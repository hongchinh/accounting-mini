# SCR-1 仕入先マスター / Supplier List

| 項目 | 内容 |
|---|---|
| 機能名 | 仕入先マスター / Supplier List |
| メニューパス | Danh mục > Nhà cung cấp (`/suppliers`) |
| Route | `GET /api/suppliers` — lấy danh sách (phân trang, tìm kiếm)<br>`POST /api/suppliers` — tạo nhà cung cấp mới |
| メインテーブル | `suppliers` ※Vui lòng xác nhận |
| 関連テーブル | `-` ※Vui lòng xác nhận |
| ※ Source | FE: `src/modules/suppliers/pages/SupplierListPage.tsx`, `components/SupplierTable.tsx`, `components/SupplierForm.tsx`, `supplier.api.ts`, `supplier.schema.ts`, `supplier.types.ts`, `src/config/permissions.ts`, `src/config/routes.ts`; Images: `images/danhmuc_nhacungcap_list.png` (ảnh tham khảo hệ thống cũ) |
| Actor | Người dùng đã đăng nhập, có quyền `suppliers.read` |
| Trigger | Người dùng nhấn mục **Nhà cung cấp** trên sidebar (nhóm Danh mục) |
| Pre-conditions | Đã xác thực (JWT hợp lệ); tài khoản có quyền `suppliers.read` |
| Post-conditions | **Thành công:** Hiển thị danh sách nhà cung cấp theo phân trang.<br>**Tạo mới thành công:** Bản ghi mới được lưu, danh sách tự làm mới.<br>**Không có quyền:** Redirect tự động về `/dashboard`. |

---

## 1. Tổng quan

Màn hình **Danh sách nhà cung cấp** cho phép người dùng xem và quản lý danh mục nhà cung cấp của doanh nghiệp. Người dùng có thể tìm kiếm theo tên hoặc mã nhà cung cấp. Người có quyền `suppliers.create` có thể tạo mới nhà cung cấp qua form dialog ngay trên màn hình danh sách, không cần chuyển sang trang khác.

Màn hình bao gồm:
- Tiêu đề trang và mô tả ngắn
- Thanh tìm kiếm (tìm kiếm theo từ khóa)
- Nút **Thêm nhà cung cấp** (hiển thị có điều kiện theo quyền)
- Bảng dữ liệu nhà cung cấp (AG Grid) với các cột: Mã, Tên nhà cung cấp, MST, Email, Điện thoại, Trạng thái
- Dialog form tạo mới nhà cung cấp

## 2. Luồng thao tác

### 2.1 Hiển thị danh sách

1. Người dùng truy cập `/suppliers`.
2. `PermissionGuard` kiểm tra quyền `suppliers.read`; nếu không có → redirect về `/dashboard`.
3. Tiêu đề trang: **"Nhà cung cấp"**; mô tả: _"Quản lý danh sách nhà cung cấp."_
4. Nút **Thêm nhà cung cấp** chỉ render nếu người dùng có quyền `suppliers.create`.
5. Hệ thống gọi `GET /api/suppliers` với params mặc định (không có search).
6. Trong khi tải: bảng hiển thị trạng thái loading (DataGrid skeleton).
7. Khi tải xong: bảng hiển thị danh sách nhà cung cấp (field: `items` của `PageResult<Supplier>`).
8. Nếu API lỗi: bảng hiển thị trạng thái lỗi và nút **Retry**.

### 2.2 Tìm kiếm

1. Người dùng nhập từ khóa vào thanh tìm kiếm (GridToolbar).
2. State `search` được cập nhật → hook `useSuppliers({ search })` tái gọi `GET /api/suppliers?search={keyword}`.
3. Bảng cập nhật kết quả theo từ khóa (※Vui lòng xác nhận: debounce có được áp dụng tại FE hay không).
4. Xóa từ khóa → gọi lại `GET /api/suppliers` không có tham số → hiển thị toàn bộ danh sách.

### 2.3 Retry khi lỗi tải danh sách

1. Bảng hiển thị trạng thái lỗi với nút **Retry**.
2. Người dùng nhấn Retry → gọi lại `query.refetch()` → `GET /api/suppliers`.

### 2.4 Tạo mới nhà cung cấp (Dialog)

**Mở dialog:**
1. Người dùng nhấn **Thêm nhà cung cấp** (chỉ hiển thị khi có quyền `suppliers.create`).
2. Dialog xuất hiện với tiêu đề **"Thêm nhà cung cấp"**, mô tả _"Nhập thông tin nhà cung cấp mới."_
3. Form hiển thị các trường: Mã*, Tên*, Mã số thuế, Email, Điện thoại, Địa chỉ.
4. Tất cả trường ban đầu trống. Trường `isActive` không hiển thị trên UI, mặc định `true`.

**Submit thành công:**
1. Người dùng nhấn **Tạo mới**.
2. FE validate toàn bộ form bằng Zod schema (client-side, trước khi gọi API).
3. Nếu hợp lệ: FE gọi `POST /api/suppliers` với body `{code, name, taxCode, email, phone, address, isActive: true}`.
4. Nút **Tạo mới** chuyển sang trạng thái loading (`"Đang lưu..."`), disabled.
5. API trả về `201` với record nhà cung cấp mới.
6. Toast thành công: **"Đã tạo nhà cung cấp"** (sonner toast).
7. Dialog đóng tự động (`setCreateOpen(false)`).
8. Danh sách tự làm mới: TanStack Query invalidate cache key `["suppliers"]`.

### 2.5 Validation fail (Tạo mới)

1. Người dùng nhấn **Tạo mới** khi có trường không hợp lệ.
2. Zod validate tại FE trước khi gọi API.
3. Form giữ nguyên trạng thái, dữ liệu đã nhập được giữ lại, message lỗi hiển thị dưới trường tương ứng.

Bảng lỗi chi tiết theo từng trường:

| Trường | Điều kiện | Message lỗi |
|---|---|---|
| Mã | Trống | "Mã nhà cung cấp là bắt buộc" |
| Mã | Vượt quá 32 ký tự | "Mã nhà cung cấp không quá 32 ký tự" |
| Tên | Trống | "Tên nhà cung cấp là bắt buộc" |
| Tên | Vượt quá 255 ký tự | "Tên nhà cung cấp không quá 255 ký tự" |
| Mã số thuế | Vượt quá 32 ký tự | "Mã số thuế không quá 32 ký tự" |
| Email | Sai định dạng email | "Email không hợp lệ" |
| Điện thoại | Vượt quá 32 ký tự | "Số điện thoại không quá 32 ký tự" |
| Địa chỉ | Vượt quá 500 ký tự | "Địa chỉ không quá 500 ký tự" |

### 2.6 Lỗi API (Tạo mới)

1. API trả về lỗi (4xx/5xx).
2. Nếu response là `AppError`: toast.error hiển thị message từ API.
3. Nếu không phải `AppError`: toast.error hiển thị `"Tạo thất bại"`.
4. Dialog vẫn mở, dữ liệu đã nhập giữ nguyên.

### 2.7 Hủy (Cancel)

1. Người dùng nhấn **Hủy** hoặc đóng dialog (click ngoài vùng dialog / nhấn Esc).
2. Dialog đóng (`onOpenChange(false)`).
3. Dữ liệu đã nhập vào form bị hủy (form reset lần sau khi mở lại).
4. Danh sách không thay đổi.

### 2.8 Hidden behavior

- **PermissionGuard:** Kiểm tra quyền `suppliers.read` ngay khi component mount; không có quyền → redirect `/dashboard`.
- **Can component:** Nút **Thêm nhà cung cấp** chỉ render khi có quyền `suppliers.create`; người chỉ có quyền `suppliers.read` không thấy nút này.
- **isActive mặc định:** Trường `isActive` không hiển thị trên form tạo mới; Zod schema áp dụng `default(true)` → API luôn nhận `isActive: true` khi tạo mới.
- **Query cache invalidation:** Sau khi tạo thành công, TanStack Query invalidate key `["suppliers"]` → danh sách tự làm mới không cần reload trang.
- **Trạng thái hiển thị:** Cột **Trạng thái** tại bảng hiển thị `"Hoạt động"` khi `isActive = true`, `"Ngừng"` khi `isActive = false` — transform tại FE (AG Grid `valueFormatter`), không lấy từ BE label.

## 3. Chi tiết màn hình

| No | Item | Item (VN) | Type | Status | Description | Validation (Required) | Validation (Attribute) | Validation (Default value) | Table (DB) | Field (DB) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1 | Page Title | Tiêu đề trang | Label | Enable | **Giá trị:** "Nhà cung cấp"<br>**Ý nghĩa:** Tên chức năng hiển thị đầu trang | - | - | - | - | - |
| D2 | Page Description | Mô tả trang | Text | Enable | **Giá trị:** "Quản lý danh sách nhà cung cấp."<br>**Ý nghĩa:** Mô tả ngắn mục đích màn hình | - | - | - | - | - |
| S1 | Search | Tìm kiếm | Text box | Enable | **Hoạt động:** Người dùng nhập từ khóa → FE cập nhật state `search` → gọi lại `GET /api/suppliers?search={keyword}`.<br>**Ý nghĩa:** Lọc danh sách nhà cung cấp theo từ khóa (tìm trong tên/mã ※Vui lòng xác nhận phạm vi tìm kiếm tại BE).<br>**Placeholder:** ※Vui lòng xác nhận (không thấy trong code) | No | String | Empty | - | - |
| B1 | Thêm nhà cung cấp | Nút thêm nhà cung cấp | Button | Enable | **Hoạt động:** Nhấn → mở Dialog tạo mới nhà cung cấp (`setCreateOpen(true)`).<br>**Trạng thái:** Chỉ render khi người dùng có quyền `suppliers.create`; ẩn hoàn toàn với người không có quyền.<br>**Khi thành công:** Dialog mở, form trống sẵn sàng nhập liệu.<br>**Khi lỗi:** Không áp dụng (button chỉ mở dialog, không gọi API trực tiếp). | - | - | - | - | - |
| T1 | Mã | Mã nhà cung cấp | Grid | Enable | **Giá trị:** Giá trị `code` của từng nhà cung cấp.<br>**Ý nghĩa:** Mã định danh nhà cung cấp.<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `code` ※Vui lòng xác nhận |
| T2 | Tên nhà cung cấp | Tên nhà cung cấp | Grid | Enable | **Giá trị:** Giá trị `name` của từng nhà cung cấp.<br>**Ý nghĩa:** Tên đầy đủ nhà cung cấp.<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `name` ※Vui lòng xác nhận |
| T3 | MST | Mã số thuế | Grid | Enable | **Giá trị:** Giá trị `taxCode`; có thể trống nếu nhà cung cấp không có MST.<br>**Ý nghĩa:** Mã số thuế của nhà cung cấp.<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `taxCode` ※Vui lòng xác nhận |
| T4 | Email | Email | Grid | Enable | **Giá trị:** Giá trị `email`; có thể trống.<br>**Ý nghĩa:** Địa chỉ email liên hệ của nhà cung cấp.<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `email` ※Vui lòng xác nhận |
| T5 | Điện thoại | Số điện thoại | Grid | Enable | **Giá trị:** Giá trị `phone`; có thể trống.<br>**Ý nghĩa:** Số điện thoại liên hệ của nhà cung cấp.<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `phone` ※Vui lòng xác nhận |
| T6 | Trạng thái | Trạng thái hoạt động | Grid | Enable | **Giá trị:** `"Hoạt động"` khi `isActive = true`; `"Ngừng"` khi `isActive = false`.<br>**Ý nghĩa:** Cho biết nhà cung cấp đang hoạt động hay đã ngừng.<br>**Giá trị hiển thị:** Label tiếng Việt (transform tại FE bằng AG Grid `valueFormatter`).<br>**Sắp xếp:** ※Vui lòng xác nhận | - | - | - | `suppliers` ※Vui lòng xác nhận | `isActive` ※Vui lòng xác nhận |
| P1 | Pagination | Phân trang | Pagination | Enable | **Hoạt động:** Điều hướng qua các trang kết quả; cập nhật params `page` và `pageSize` → gọi lại `GET /api/suppliers`.<br>**Ý nghĩa:** Hiển thị từng trang dữ liệu theo `PageResult<Supplier>` (fields: `items`, `total`, `page`, `pageSize`). ※Vui lòng xác nhận: UI phân trang cụ thể (component nào, hiển thị ra sao). | - | - | - | - | - |
| M1 | Dialog Thêm nhà cung cấp | Dialog tạo mới nhà cung cấp | Control | Enable | **Trigger:** Nhấn nút **Thêm nhà cung cấp** (B1).<br>**Tiêu đề:** "Thêm nhà cung cấp"<br>**Mô tả:** "Nhập thông tin nhà cung cấp mới."<br>**Nút xác nhận:** **Tạo mới** — gọi `POST /api/suppliers`; khi đang gửi: label chuyển thành "Đang lưu...", disabled.<br>**Nút hủy:** **Hủy** — đóng dialog, hủy dữ liệu đã nhập. | - | - | - | - | - |
| F1 | Mã | Mã nhà cung cấp | Text box | Enable | **Hoạt động:** Nhập mã định danh nhà cung cấp.<br>**Ý nghĩa:** Mã ngắn, duy nhất trong hệ thống để tra cứu nhanh nhà cung cấp.<br>**Placeholder:** ※Vui lòng xác nhận (không khai báo trong code).<br>**Message lỗi:**<br>- Khi trống: "Mã nhà cung cấp là bắt buộc" (FE Zod)<br>- Khi vượt quá 32 ký tự: "Mã nhà cung cấp không quá 32 ký tự" (FE Zod) | Yes | String, required, max 32 chars | Empty | `suppliers` ※Vui lòng xác nhận | `code` ※Vui lòng xác nhận |
| F2 | Tên | Tên nhà cung cấp | Text box | Enable | **Hoạt động:** Nhập tên đầy đủ nhà cung cấp.<br>**Ý nghĩa:** Tên chính thức của nhà cung cấp, hiển thị trên danh sách và chứng từ.<br>**Placeholder:** ※Vui lòng xác nhận.<br>**Message lỗi:**<br>- Khi trống: "Tên nhà cung cấp là bắt buộc" (FE Zod)<br>- Khi vượt quá 255 ký tự: "Tên nhà cung cấp không quá 255 ký tự" (FE Zod) | Yes | String, required, max 255 chars | Empty | `suppliers` ※Vui lòng xác nhận | `name` ※Vui lòng xác nhận |
| F3 | Mã số thuế | Mã số thuế | Text box | Enable | **Hoạt động:** Nhập mã số thuế doanh nghiệp của nhà cung cấp (tùy chọn).<br>**Ý nghĩa:** MST dùng cho hóa đơn VAT và báo cáo thuế.<br>**Placeholder:** ※Vui lòng xác nhận.<br>**Message lỗi:**<br>- Khi vượt quá 32 ký tự: "Mã số thuế không quá 32 ký tự" (FE Zod) | No | String, nullable, max 32 chars | Empty | `suppliers` ※Vui lòng xác nhận | `taxCode` ※Vui lòng xác nhận |
| F4 | Email | Email liên hệ | Mail address | Enable | **Hoạt động:** Nhập địa chỉ email liên hệ của nhà cung cấp (tùy chọn).<br>**Ý nghĩa:** Email dùng để gửi đơn đặt hàng, thông báo.<br>**Placeholder:** ※Vui lòng xác nhận.<br>**Message lỗi:**<br>- Khi sai định dạng: "Email không hợp lệ" (FE Zod) | No | Email, nullable | Empty | `suppliers` ※Vui lòng xác nhận | `email` ※Vui lòng xác nhận |
| F5 | Điện thoại | Số điện thoại | Text box | Enable | **Hoạt động:** Nhập số điện thoại liên hệ của nhà cung cấp (tùy chọn).<br>**Ý nghĩa:** Số điện thoại để liên hệ trực tiếp với nhà cung cấp.<br>**Placeholder:** ※Vui lòng xác nhận.<br>**Message lỗi:**<br>- Khi vượt quá 32 ký tự: "Số điện thoại không quá 32 ký tự" (FE Zod) | No | String, nullable, max 32 chars | Empty | `suppliers` ※Vui lòng xác nhận | `phone` ※Vui lòng xác nhận |
| F6 | Địa chỉ | Địa chỉ | Text box | Enable | **Hoạt động:** Nhập địa chỉ của nhà cung cấp (tùy chọn); chiếm 2 cột trong layout grid 2 cột.<br>**Ý nghĩa:** Địa chỉ văn phòng/kho hàng của nhà cung cấp.<br>**Placeholder:** ※Vui lòng xác nhận.<br>**Message lỗi:**<br>- Khi vượt quá 500 ký tự: "Địa chỉ không quá 500 ký tự" (FE Zod) | No | String, nullable, max 500 chars | Empty | `suppliers` ※Vui lòng xác nhận | `address` ※Vui lòng xác nhận |
| B2 | Hủy | Nút hủy | Button | Enable | **Hoạt động:** Nhấn → đóng dialog tạo mới (`onOpenChange(false)`).<br>**Di chuyển màn hình:** Không chuyển trang; dialog đóng, người dùng ở lại danh sách.<br>**Khi thành công:** Dialog đóng, dữ liệu đã nhập bị hủy.<br>**Khi lỗi:** Không áp dụng.<br>**Trạng thái:** Luôn Enable trong dialog. | - | - | - | - | - |
| B3 | Tạo mới | Nút tạo mới | Button | Enable | **Hoạt động:** Nhấn → validate form (Zod) → nếu hợp lệ: gọi `POST /api/suppliers`.<br>**Trạng thái:** Disable và label chuyển thành "Đang lưu..." khi đang chờ API (`isSubmitting = true`).<br>**Khi thành công:** Toast "Đã tạo nhà cung cấp"; dialog đóng; danh sách làm mới.<br>**Khi lỗi:**<br>- FE validation fail → message lỗi hiển thị dưới từng trường (xem §2.5)<br>- API lỗi có message: toast "message từ API" (AppError)<br>- API lỗi không xác định: toast "Tạo thất bại" | - | - | - | - | - |

## 4. Impact

| STT | Khu vực | Ảnh hưởng | Chi tiết | Màn hình liên quan |
|---|---|---|---|---|
| 1 | Danh mục | Dữ liệu nhà cung cấp | Nhà cung cấp tạo mới xuất hiện trong danh sách ngay sau khi tạo thành công. Danh sách phản ánh thay đổi theo thời gian thực (không cần reload trang). | SCR-1 Supplier List |
| 2 | Kế toán / Chứng từ | Tham chiếu nhà cung cấp | Các màn hình lập chứng từ mua hàng, nhập kho, thanh toán (nếu có) sẽ phụ thuộc vào dữ liệu nhà cung cấp trong bảng này. Nếu nhà cung cấp bị thay đổi trạng thái (`isActive = false`), cần xác nhận ảnh hưởng tới workflow chứng từ. ※Vui lòng xác nhận | Màn hình lập chứng từ mua hàng ※Vui lòng xác nhận |
| 3 | Phân quyền | Hiển thị theo quyền | Nút **Thêm nhà cung cấp** ẩn với người không có quyền `suppliers.create`; trang ẩn/redirect nếu không có quyền `suppliers.read`. | SCR-1 Supplier List |
| 4 | Cache / State | Query cache | Tạo mới thành công invalidate toàn bộ cache key `["suppliers"]` → tất cả component đang subscribe danh sách nhà cung cấp trong session sẽ tự làm mới. | Mọi màn hình dùng `useSuppliers` |

---

## 5. Business Rules

### 5.1 Phân quyền truy cập

- Truy cập màn hình yêu cầu quyền `suppliers.read`. Thiếu quyền → redirect `/dashboard`.
- Tạo mới yêu cầu quyền `suppliers.create`. Thiếu quyền → nút **Thêm nhà cung cấp** không hiển thị; API `POST /api/suppliers` sẽ từ chối nếu gọi trực tiếp (※Vui lòng xác nhận BE enforcement).

### 5.2 Mã nhà cung cấp (code)

- Bắt buộc nhập; tối đa 32 ký tự.
- ※Vui lòng xác nhận: mã có unique constraint trong DB hay không.
- ※Vui lòng xác nhận: định dạng mã có quy ước (chỉ chữ/số, không khoảng trắng, v.v.).

### 5.3 Trạng thái mặc định khi tạo mới

- Nhà cung cấp tạo mới luôn có `isActive = true` (Hoạt động).
- Người dùng không thể chọn trạng thái tại form tạo mới (không có UI control).
- Thay đổi trạng thái (chuyển sang "Ngừng") yêu cầu chức năng cập nhật riêng (chưa triển khai trên màn hình này).

### 5.4 Trường tùy chọn

- `taxCode`, `email`, `phone`, `address` là tùy chọn — có thể bỏ trống hoặc nhập giá trị rỗng `""`.
- Zod schema xử lý `""` như `undefined` (`.or(z.literal(""))`) → API nhận `undefined` hoặc giá trị string.
- ※Vui lòng xác nhận: BE lưu `null` hay `""` cho các trường tùy chọn không được điền.

### 5.5 Tìm kiếm danh sách

- Tham số `search` được gửi lên API; logic lọc (LIKE, full-text, v.v.) phụ thuộc BE.
- ※Vui lòng xác nhận: Phạm vi tìm kiếm (tên, mã, hay cả hai); cơ chế so khớp.
- ※Vui lòng xác nhận: Có debounce tại FE không (hiện tại chưa thấy trong code `GridToolbar`).

### 5.6 Phân trang

- API trả về `PageResult<Supplier>` với `{items, total, page, pageSize}`.
- ※Vui lòng xác nhận: Kích thước trang mặc định (`pageSize` mặc định là bao nhiêu).
- ※Vui lòng xác nhận: UI phân trang cụ thể (số trang, nút Prev/Next, hiển thị tổng số).

### 5.7 DB Summary

| Bảng | Mục đích | Ghi chú |
|---|---|---|
| `suppliers` | Lưu thông tin nhà cung cấp | ※Vui lòng xác nhận — BE chưa triển khai tại thời điểm viết BD |

Các cột dự kiến (từ FE type `Supplier`):

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | UUID/string | PK |
| `code` | varchar(32) | ※Vui lòng xác nhận unique |
| `name` | varchar(255) | Not null |
| `taxCode` | varchar(32) | Nullable |
| `email` | varchar(255) | Nullable |
| `phone` | varchar(32) | Nullable |
| `address` | varchar(500) | Nullable |
| `isActive` | boolean | Default true |
| `createdAt` | datetime | Auto |
| `updatedAt` | datetime | Auto |

※Vui lòng xác nhận: Tên bảng, kiểu dữ liệu, constraints khi BE triển khai migration thực tế.

### 5.8 Tổng hợp messages

| No | Message | Source | HTTP | Vị trí hiển thị | Context |
|---|---|---|---|---|---|
| 1 | "Mã nhà cung cấp là bắt buộc" | FE (Zod) | - | Dưới trường Mã (F1) | Trường Mã trống |
| 2 | "Mã nhà cung cấp không quá 32 ký tự" | FE (Zod) | - | Dưới trường Mã (F1) | Mã vượt 32 ký tự |
| 3 | "Tên nhà cung cấp là bắt buộc" | FE (Zod) | - | Dưới trường Tên (F2) | Trường Tên trống |
| 4 | "Tên nhà cung cấp không quá 255 ký tự" | FE (Zod) | - | Dưới trường Tên (F2) | Tên vượt 255 ký tự |
| 5 | "Mã số thuế không quá 32 ký tự" | FE (Zod) | - | Dưới trường MST (F3) | MST vượt 32 ký tự |
| 6 | "Email không hợp lệ" | FE (Zod) | - | Dưới trường Email (F4) | Email sai định dạng |
| 7 | "Số điện thoại không quá 32 ký tự" | FE (Zod) | - | Dưới trường Điện thoại (F5) | SĐT vượt 32 ký tự |
| 8 | "Địa chỉ không quá 500 ký tự" | FE (Zod) | - | Dưới trường Địa chỉ (F6) | Địa chỉ vượt 500 ký tự |
| 9 | "Đã tạo nhà cung cấp" | FE (sonner toast) | - | Toast (góc màn hình) | Tạo mới thành công |
| 10 | "Tạo thất bại" | FE (fallback) | - | Toast (góc màn hình) | API lỗi không xác định |
| 11 | Message từ API | BE | 4xx/5xx | Toast (góc màn hình) | API trả về `AppError` message |

---

## Danh sách cần xác nhận（Dành cho BA leader）

1. **DB mapping:** Tên bảng thực tế (`suppliers`), tên các cột, kiểu dữ liệu, constraints (unique trên `code`?), nullable cho các trường tùy chọn — chờ BE triển khai migration.
2. **Impact §4:** Ảnh hưởng của việc thay đổi trạng thái nhà cung cấp (`isActive`) tới các chứng từ mua hàng và workflow kế toán liên quan (màn hình cụ thể chưa rõ).
3. **Hidden behavior §2.2:** Có áp dụng debounce cho tìm kiếm tại FE (`GridToolbar`) không? Phạm vi tìm kiếm tại BE (theo `code`, `name`, hay cả hai)?
4. **Business rule §5.1:** BE có enforce phân quyền `suppliers.create` tại endpoint `POST /api/suppliers` không (trả về 403 nếu thiếu quyền)?
5. **Business rule §5.2:** Mã nhà cung cấp (`code`) có unique constraint trong DB không? Có quy ước định dạng không?
6. **Business rule §5.4:** BE lưu `null` hay `""` cho các trường tùy chọn (`taxCode`, `email`, `phone`, `address`) khi không điền?
7. **Business rule §5.6:** Kích thước trang mặc định (`pageSize` default); UI phân trang sẽ dùng component nào?
8. **Search placeholder §3 S1:** Placeholder text của ô tìm kiếm là gì?
