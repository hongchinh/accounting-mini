# Danh mục nhà cung cấp (Supplier List)

- **Module:** web/danh-muc-nha-cung-cap
- **Tài liệu nghiệp vụ tham khảo:** `references/markdown/khai-bao-nha-cung-cap.md`, `references/markdown/nha-cung-cap.md`, `references/markdown/gop-nha-cung-cap.md`
- **Ảnh hiện tại:** `images/danhmuc_nhacungcap_list.png`
- **Ảnh tham khảo:** `references/images/danhmuc_nhacungcap_list.png`, `danhmuc_nhacungcap_list_menu_chucnang.png`, `danhmuc_nhacungcap_them_tochuc.png`, `danhmuc_nhacungcap_them_canhan.png`, `danhmuc_nhacungcap_detail.png`, `danhmuc_nhacungcap_xoa.png`, `danhmuc_nhacungcap_import_excel.png`, `danhmuc_nhacungcap_xacnhandiachiNCC.png`
- **Actor:** Kế toán viên / người dùng có quyền quản lý danh mục nhà cung cấp
- **Trigger:** Vào menu **Danh mục > Nhà cung cấp** trên sidebar hệ thống
- **Pre-conditions:** Đã đăng nhập hệ thống; có quyền truy cập module Quản lý danh mục
- **Post-conditions:**
  - Thành công: Hiển thị danh sách nhà cung cấp; thêm/sửa/xóa/import được lưu và phản ánh ngay trên danh sách
  - Thất bại: Thông báo lỗi hiển thị; dữ liệu hiện tại không thay đổi

※ Nguồn: `images/danhmuc_nhacungcap_list.png`; `references/images/*.png` (8 ảnh); `references/markdown/*.md` (3 file)

---

## 1. Tổng quan

Màn hình **Danh mục nhà cung cấp** là nơi quản lý tập trung toàn bộ thông tin nhà cung cấp của doanh nghiệp. Người dùng có thể xem danh sách, tìm kiếm, lọc, thêm mới, chỉnh sửa, ngừng sử dụng và xóa nhà cung cấp. Dữ liệu nhà cung cấp được dùng xuyên suốt trong các nghiệp vụ mua hàng, thanh toán và đối chiếu công nợ.

Màn hình hỗ trợ khai báo hai loại nhà cung cấp: **Tổ chức** (doanh nghiệp có mã số thuế) và **Cá nhân** (cá nhân có số CCCD/hộ chiếu). Một nhà cung cấp có thể đồng thời là khách hàng — hệ thống sẽ tự động đồng bộ thông tin sang danh sách khách hàng. Ngoài ra, người dùng có thể import hàng loạt từ file Excel và gộp các nhà cung cấp trùng lặp để đảm bảo tính chính xác của dữ liệu.

Màn hình hiển thị các chỉ số tổng hợp đầu trang: tổng công nợ phải trả, tổng giá trị mua hàng và số lượng nhà cung cấp đã đóng tài khoản — giúp kế toán nắm bắt nhanh tình hình công nợ mà không cần vào từng báo cáo.

*(Nguồn: `references/markdown/khai-bao-nha-cung-cap.md`, `references/markdown/nha-cung-cap.md`)*

## 2. Luồng thao tác

### 2.1 Hiển thị danh sách

1. Người dùng vào menu **Danh mục > Nhà cung cấp**.
2. Hệ thống tải danh sách nhà cung cấp và hiển thị bảng có phân trang (mặc định 100 bản ghi/trang).
3. Đầu trang hiển thị 4 thẻ chỉ số: **Tổng nợ phải trả** (lũy kế), **Tổng giá trị mua hàng** ※Cần xác nhận nhãn chính xác, và **Số NCC đóng tài khoản**. Giá trị tính lũy kế đến kỳ đang chọn (S4).
4. Bảng mặc định hiển thị tất cả NCC đang hoạt động.

*(Nguồn: `images/danhmuc_nhacungcap_list.png`, `references/images/danhmuc_nhacungcap_list.png`)*

### 2.2 Tìm kiếm và lọc danh sách

1. Người dùng nhập từ khóa vào ô tìm kiếm → danh sách lọc theo tên hoặc mã NCC.
2. Người dùng chọn **Tỉnh/Thành phố** từ dropdown → lọc theo địa chỉ.
3. Người dùng chọn bộ lọc ※Cần xác nhận (dropdown thứ hai, nhãn "LDK" trong ảnh) → ※Cần xác nhận tiêu chí lọc.
4. Người dùng chọn kỳ (date/period picker) → lọc theo kỳ kế toán.
5. Danh sách cập nhật ngay sau khi thay đổi bất kỳ điều kiện lọc nào.

*(Nguồn: `images/danhmuc_nhacungcap_list.png`, `references/images/danhmuc_nhacungcap_list.png`)*

### 2.3 Thêm mới nhà cung cấp

**Mở dialog:**
1. Người dùng nhấn **Thêm**.
2. Dialog **"Thông tin nhà cung cấp"** mở ra với 2 tab chính: **Tổ chức** / **Cá nhân** và tùy chọn **Là khách hàng**.
3. Tab **Tổ chức** được chọn mặc định.

**Khai báo nhà cung cấp — Tổ chức:**
1. Nhập Mã số thuế/CCCD (*) → nhấn **Lấy thông tin**: nếu có internet, hệ thống tự lấy Tên NCC và Địa chỉ từ cơ quan thuế.
2. Nhập Mã số ĐVQHNS (tùy chọn — mã số đơn vị quan hệ ngân sách, không bắt buộc).
3. Nhập Tên nhà cung cấp (*), Địa chỉ, Nhóm nhà cung cấp, Nhóm hàng, Điện thoại, Website.
4. Tích **Là khách hàng** nếu đối tượng vừa là NCC vừa là KH → hệ thống tự đồng bộ sang danh sách khách hàng sau khi lưu.
5. Tích **Là đối tượng nội bộ** nếu là công ty con/mẹ trong tập đoàn.
6. Tích **Tổng công ty/chi nhánh** nếu là tổng công ty/chi nhánh nội bộ.
7. Chuyển sang tab **Thông tin liên hệ**: nhập Người liên hệ, Email, Điện thoại, Đại diện theo PL.
8. Các tab phụ khác (Điều khoản thanh toán, Tài khoản ngân hàng, Địa chỉ khác, Ghi chú, Thông tin bổ sung) — nhập nếu cần.

**Khai báo nhà cung cấp — Cá nhân:**
1. Chọn tab **Cá nhân**.
2. Nhập Số CCCD (*), Họ tên (*), Năm cấp, Mã số thuế, Nhóm mua hàng, Địa chỉ, Số hộ chiếu.
3. Tên nhà cung cấp tự điền theo Họ tên (※Cần xác nhận).

**Submit thành công:**
1. Nhấn **Cất**: lưu và đóng dialog → nhà cung cấp xuất hiện trong danh sách.
2. Nhấn **Cất và Thêm**: lưu và mở lại form trống để nhập NCC tiếp theo.

*(Nguồn: `references/images/danhmuc_nhacungcap_them_tochuc.png`, `references/images/danhmuc_nhacungcap_them_canhan.png`, `references/markdown/khai-bao-nha-cung-cap.md`)*

### 2.4 Validation fail (Thêm/Sửa NCC)

1. Người dùng nhấn **Cất** khi chưa điền đủ trường bắt buộc (*).
2. Form giữ nguyên trạng thái, dữ liệu đã nhập được giữ lại, message lỗi hiển thị dưới trường tương ứng.
3. Các trường bắt buộc được highlight đỏ (※Cần xác nhận cơ chế hiển thị lỗi cụ thể).

*(Nguồn: `references/images/danhmuc_nhacungcap_them_tochuc.png`)*

### 2.5 Sửa thông tin nhà cung cấp

1. Tại danh sách, người dùng nhấn mũi tên ▼ ở cột Chức năng của dòng NCC cần sửa → chọn **Sửa**.
2. Dialog **"Thông tin nhà cung cấp"** mở ra với dữ liệu hiện tại đã được điền sẵn.
3. Người dùng chỉnh sửa thông tin → nhấn **Cất** để lưu.

*(Nguồn: `references/images/danhmuc_nhacungcap_list_menu_chucnang.png`, `references/markdown/nha-cung-cap.md`)*

### 2.6 Ngừng sử dụng / Sử dụng nhà cung cấp

1. Tại cột Chức năng → chọn **Ngừng sử dụng**.
2. NCC sẽ không còn hiển thị ở màn hình chứng từ chi tiết và màn hình tham số báo cáo liên quan.
3. Để kích hoạt lại: chọn **Sử dụng** tại cột Chức năng.
4. **Lưu ý:** Hệ thống chưa hỗ trợ ngừng sử dụng hàng loạt — thực hiện từng NCC.

*(Nguồn: `references/markdown/nha-cung-cap.md`)*

### 2.7 Xóa nhà cung cấp

**Trường hợp chưa có phát sinh:**
1. Tại cột Chức năng → chọn **Xóa**.
2. Hệ thống hiển thị dialog xác nhận: *"Bạn có chắc muốn xóa Nhà cung cấp <tên> không?"*
3. Nhấn **OK** → xóa thành công, NCC biến mất khỏi danh sách.

**Trường hợp đã có phát sinh dữ liệu:**
1. Tại cột Chức năng → chọn **Xóa**.
2. Hệ thống hiển thị cảnh báo: *"Nhà cung cấp <tên> đã có phát sinh. Bạn phải xóa các phát sinh liên quan trước khi xóa Nhà cung cấp."*
3. Nhấn **Xem phát sinh** → hệ thống liệt kê các chứng từ/giao dịch liên quan.
4. Người dùng phải xóa hết các phát sinh trước, sau đó mới xóa được NCC.

**Hủy xóa:** Đóng dialog → không có thay đổi.

*(Nguồn: `references/images/danhmuc_nhacungcap_xoa.png`, `references/markdown/nha-cung-cap.md`)*

### 2.8 Xem chi tiết nhà cung cấp

1. Nhấn vào tên NCC trên danh sách (Textlink) → mở trang **Chi tiết nhà cung cấp**.
2. Trang chi tiết gồm:
   - Panel trái: danh sách NCC liên quan (cùng nhóm/địa bàn ※Cần xác nhận tiêu chí).
   - Panel phải: thông tin cơ bản (Mã, Địa chỉ, Điện thoại) và 2 tab: **Chi tiết** (lịch sử giao dịch) / **Công nợ nhà cung cấp**.
3. Tab **Chi tiết**: bảng giao dịch gồm cột Loại, Ngày hạch toán, Số chứng từ, Ngày, Số hóa đơn, Chức năng.

*(Nguồn: `references/images/danhmuc_nhacungcap_detail.png`)*

### 2.9 Import nhà cung cấp từ Excel

1. Nhấn **Tiện ích ▼** → chọn **Nhập từ Excel** (※Cần xác nhận nhãn chính xác trên menu).
2. Wizard 4 bước mở ra:
   - **Bước 1 — Chọn tệp nguồn:** Kéo thả hoặc chọn file Excel (tối đa 20MB). Tải tệp mẫu cơ bản hoặc đầy đủ. Chọn sheet, dòng tiêu đề. Phương thức nhập: **Thêm mới** (chỉ thêm record chưa tồn tại) hoặc **Cập nhật** (thêm mới + cập nhật record đã có theo mã).
   - **Bước 2 — Ghép dữ liệu:** Map cột Excel với trường hệ thống.
   - **Bước 3 — Kiểm tra dữ liệu:** Hệ thống validate dữ liệu, hiển thị lỗi nếu có.
   - **Bước 4 — Kết quả:** Hiển thị số bản ghi đã import thành công/thất bại.
3. Nhấn **Tiếp tục** để sang bước kế, **Hủy** để thoát.

*(Nguồn: `references/images/danhmuc_nhacungcap_import_excel.png`, `references/markdown/nha-cung-cap.md`)*

### 2.10 Xuất danh sách ra Excel

1. Nhấn **Tiện ích ▼** → chọn **Xuất ra Excel**.
2. Hệ thống xuất danh sách NCC hiện tại ra file Excel và tải về máy.

*(Nguồn: `references/markdown/nha-cung-cap.md`)*

### 2.11 Xác nhận cập nhật địa chỉ nhà cung cấp

1. Khi cập nhật địa chỉ (※Cần xác nhận trigger cụ thể — sau khi Lấy thông tin từ MST hay sau khi sửa địa chỉ hàng loạt?), hệ thống hiển thị dialog **"Xác nhận cập nhật địa chỉ nhà cung cấp"**.
2. Dialog liệt kê bảng NCC sẽ bị cập nhật địa chỉ: Mã NCC, Tên NCC, MST, Địa chỉ cũ → Địa chỉ mới.
3. Nhấn **Xác nhận** để áp dụng; **Hủy** để bỏ qua.

*(Nguồn: `references/images/danhmuc_nhacungcap_xacnhandiachiNCC.png`)*

### 2.12 Tùy chỉnh giao diện danh sách

1. Nhấn biểu tượng bánh răng ⚙ → hộp tùy chỉnh hiện ra với danh sách các cột.
2. Tích/bỏ tích để ẩn/hiện cột tương ứng.
3. Nhấn **Cất** để lưu cấu hình (cấu hình được giữ lại cho các lần vào sau).

*(Nguồn: `references/markdown/nha-cung-cap.md`)*

### 2.13 Gộp nhà cung cấp

**Gộp tự động:**
1. Nhấn **Tiện ích ▼** → chọn **Gộp nhà cung cấp tự động**.
2. Chọn tiêu chí tìm NCC trùng (tên, MST, SĐT, địa chỉ) → nhấn **Lấy nhà cung cấp**.
3. Hệ thống liệt kê các cặp NCC trùng. Tích chọn 1 NCC giữ lại; các NCC còn lại sẽ bị xóa sau khi gộp.
4. Nhấn **Gộp và đóng** → hệ thống gộp, chuyển toàn bộ giao dịch sang NCC được giữ.

**Gộp thủ công:**
1. Trên danh sách, tích chọn nhiều NCC cần gộp → **Thực hiện hàng loạt** → **Gộp**.
2. Tích chọn 1 NCC giữ lại → nhấn **Gộp và Đóng**.

*(Nguồn: `references/markdown/gop-nha-cung-cap.md`)*

### 2.14 Hành vi ẩn

- **Đồng bộ khách hàng:** NCC tích "Là khách hàng" → sau khi Cất, hệ thống tự tạo/cập nhật bản ghi tương ứng trong danh sách khách hàng (thao tác nền, không hiển thị riêng).
- **Ngừng sử dụng ảnh hưởng chứng từ:** NCC đã Ngừng sử dụng sẽ bị ẩn khỏi dropdown NCC ở màn hình nhập chứng từ và tham số báo cáo.
- **Lấy thông tin từ MST:** Kết quả phụ thuộc vào kết nối internet và dữ liệu cơ quan thuế — có thể không tìm thấy.
- **Gộp NCC:** Toàn bộ giao dịch/công nợ của NCC bị gộp sẽ được chuyển sang NCC giữ lại; NCC bị gộp sẽ bị xóa khỏi hệ thống.

## 3. Bảng chi tiết field

| ID | Item | Type | Status | Mô tả | Validation | Mapping (nếu có) | Nguồn |
|---|---|---|---|---|---|---|---|
| D1 | Tiêu đề trang | Label | Readonly | **Giá trị:** "Danh sách nhà cung cấp" | - | - | images + references/images |
| D2 | Thẻ: Tổng nợ phải trả | Label | Readonly | **Mục đích:** Hiển thị tổng công nợ phải trả lũy kế của tất cả NCC tính đến kỳ đang chọn (S4). Giá trị số, định dạng tiền tệ. | - | - | images + references/images |
| D3 | Thẻ: Tổng giá trị mua hàng | Label | Readonly | **Mục đích:** Tổng giá trị mua hàng lũy kế tính đến kỳ đang chọn (S4). Giá trị số, định dạng tiền tệ.<br>**※Cần xác nhận:** Nhãn chính xác trên UI ("Tổng giá trị mua hàng" hay tên khác). | - | - | images + references/images |
| D4 | Thẻ: Số NCC đóng tài khoản | Label | Readonly | **Mục đích:** Đếm số nhà cung cấp có trạng thái "Ngừng sử dụng". | - | - | images + references/images |
| S1 | Tìm kiếm | Text input | Tùy chọn | **Mục đích:** Lọc danh sách theo tên hoặc mã nhà cung cấp (※Cần xác nhận phạm vi tìm kiếm tại BE).<br>**Hoạt động:** Nhập từ khóa → danh sách lọc realtime hoặc sau khi nhấn Enter/icon tìm kiếm. | - | - | images + references/images |
| S2 | Tỉnh/Thành phố | Dropdown | Tùy chọn | **Mục đích:** Lọc NCC theo tỉnh/thành phố trong địa chỉ.<br>**Nguồn danh sách:** Danh mục tỉnh/thành phố hệ thống. | - | - | images + references/images |
| S3 | Bộ lọc thứ hai (LDK) | Dropdown | Tùy chọn | **Mục đích:** ※Cần xác nhận — tiêu chí lọc của dropdown này (nhãn "LDK" không rõ nghĩa trong ảnh).<br>**Nguồn danh sách:** ※Cần xác nhận. | - | - | images + references/images |
| S4 | Kỳ (period filter) | Date picker | Tùy chọn | **Mục đích:** Chọn kỳ kế toán → các thẻ chỉ số (D2, D3) được tính lũy kế đến kỳ đó.<br>**Hoạt động:** Thay đổi kỳ → D2, D3 cập nhật theo. ※Cần xác nhận bộ lọc này có ảnh hưởng đến danh sách bảng hay chỉ ảnh hưởng thẻ chỉ số. | - | - | images + references/images |
| B1 | Tiện ích ▼ | Button | Bắt buộc | **Mục đích:** Mở dropdown menu tiện ích.<br>**Các lựa chọn:**<br>- Gộp nhà cung cấp tự động (→ §2.13)<br>- Nhập từ Excel (→ §2.9)<br>- Xuất ra Excel (→ §2.10)<br>- Tùy chỉnh giao diện (→ §2.12)<br>**※Cần xác nhận:** Nhãn chính xác của từng mục trong menu. | - | - | images + references/images + references/markdown |
| B2 | Thêm | Button | Bắt buộc | **Mục đích:** Mở dialog khai báo nhà cung cấp mới (→ §2.3).<br>**Style:** Nút xanh lá, icon "+". | - | - | images + references/images + references/markdown |
| T1 | Mã nhà cung cấp | Table column | Readonly | **Giá trị:** Mã định danh ngắn của NCC.<br>**Sắp xếp:** ※Cần xác nhận. | - | - | images + references/images |
| T2 | Tên nhà cung cấp | Table column | Readonly | **Giá trị:** Tên đầy đủ NCC, là Textlink → nhấn vào mở trang chi tiết (→ §2.8). | - | - | images + references/images |
| T3 | Địa chỉ | Table column | Readonly | **Giá trị:** Địa chỉ NCC. | - | - | images + references/images |
| T4 | Số điện thoại | Table column | Readonly | **Giá trị:** SĐT liên hệ của NCC. | - | - | images + references/images |
| T5 | Số tài khoản NH/CCCD/Hộ chiếu | Table column | Readonly | **Giá trị:** Số tài khoản ngân hàng hoặc số CCCD/hộ chiếu (tùy loại NCC: Tổ chức/Cá nhân). | - | - | images + references/images |
| T6 | Nợ | Table column | Readonly | **Giá trị:** Công nợ phải trả hiện tại của NCC, định dạng tiền tệ. Giá trị âm (đỏ) = NCC đang có dư có. | - | - | images + references/images |
| T7 | Nợ cũ | Table column | Readonly | **Giá trị:** Công nợ kỳ trước (※Cần xác nhận định nghĩa "nợ cũ" trong nghiệp vụ). | - | - | images + references/images |
| T8 | Lập CT mua hàng | Table column | Readonly | **Giá trị:** Textlink "Lập CT mua hàng" → điều hướng sang màn hình lập chứng từ mua hàng với NCC được chọn tự động.<br>**※Cần xác nhận:** Nhãn chính xác và màn hình đích. | - | - | images + references/images |
| T9 | Chức năng | Table column | Readonly | **Giá trị:** Nút mũi tên ▼ mở inline menu hành động: **Sửa** / **Ngừng sử dụng** (hoặc Sử dụng) / **Xóa** / **Nhân bản**.<br>**※Cần xác nhận:** Có hiển thị "Nhân bản" không; điều kiện ẩn/hiện từng option. | - | - | references/images/danhmuc_nhacungcap_list_menu_chucnang.png |
| P1 | Phân trang | Pagination | Readonly | **Mục đích:** Điều hướng qua các trang kết quả.<br>**Hiển thị:** Nút Prev/Next, số trang hiện tại.<br>**Tổng số:** Hiển thị "Tổng số X bản ghi" cuối bảng. | - | - | images + references/images |
| P2 | Số bản ghi/trang | Dropdown | Tùy chọn | **Mặc định:** 100 bản ghi/trang.<br>**Các lựa chọn:** ※Cần xác nhận (20/50/100/200…). | - | - | images + references/images |
| M1 | Dialog Thêm/Sửa nhà cung cấp | Modal | Bắt buộc | **Trigger:** Nhấn Thêm (B2) hoặc Sửa từ menu Chức năng.<br>**Tiêu đề:** "Thông tin nhà cung cấp"<br>**Tabs chính:** Tổ chức / Cá nhân<br>**Tùy chọn:** Là khách hàng (checkbox/tab thứ 3)<br>**Nút lưu:** Cất (F_cat), Cất và Thêm (F_cat_them)<br>**Nút hủy:** Hủy (F_huy) | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png + references/markdown |
| F1 | Mã số thuế/CCCD (*) | Text input | Bắt buộc | **Mục đích (Tổ chức):** Mã số thuế của doanh nghiệp — dùng để tra cứu thông tin từ cơ quan thuế.<br>**Mục đích (Cá nhân):** Số CCCD hoặc số hộ chiếu.<br>**※Cần xác nhận:** Validate format (độ dài, ký tự cho phép). | - Khi trống: "Vui lòng nhập Mã số thuế/CCCD" | - | references/images + references/markdown |
| F2 | Nút "Lấy thông tin" | Button | Tùy chọn | **Mục đích:** Sau khi nhập MST, nhấn để tự động lấy Tên NCC và Địa chỉ từ cổng thông tin cơ quan thuế (cần internet).<br>**Khi thành công:** Tên NCC và Địa chỉ tự điền vào form.<br>**Khi không tìm thấy / mất mạng:** Không có thay đổi; người dùng tự nhập thủ công. | - | - | references/markdown/khai-bao-nha-cung-cap.md |
| F3 | Tên nhà cung cấp (*) | Text input | Bắt buộc | **Mục đích:** Tên chính thức của NCC, hiển thị trên danh sách và chứng từ.<br>**Tổ chức:** Nhập thủ công hoặc tự điền từ "Lấy thông tin".<br>**Cá nhân:** Lấy từ trường "Họ tên" ※Cần xác nhận cơ chế tự điền. | - Khi trống: "Vui lòng nhập Tên nhà cung cấp" | - | references/images + references/markdown |
| F4 | Mã số ĐVQHNS | Text input | Tùy chọn | **Mục đích:** Mã số đơn vị quan hệ ngân sách (ĐVQHNS) — dùng cho các đơn vị có quan hệ với ngân sách nhà nước. Không bắt buộc. | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| F5 | Địa chỉ | Text input | Tùy chọn | **Mục đích:** Địa chỉ văn phòng/kho của NCC.<br>**Cá nhân:** Địa chỉ thường trú.<br>**Lưu ý:** Có thể tự điền từ "Lấy thông tin" với NCC Tổ chức. | - | - | references/images + references/markdown |
| F6 | Nhóm nhà cung cấp | Dropdown | Tùy chọn | **Mục đích:** Phân loại NCC vào nhóm để lọc/báo cáo theo nhóm.<br>**Nguồn danh sách:** Danh mục "Nhóm khách hàng, nhà cung cấp" đã khai báo. | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png + references/markdown |
| F7 | Nhóm hàng | Dropdown | Tùy chọn | **Mục đích:** Phân loại NCC theo nhóm mặt hàng cung cấp chính ※Cần xác nhận tên chính xác ("Nhóm hàng" hay "Nhóm mua hàng"). | - | - | references/images |
| F8 | Là khách hàng | Checkbox | Tùy chọn | **Mục đích:** Đánh dấu đối tượng vừa là NCC vừa là KH → hệ thống tự đồng bộ bản ghi sang danh mục khách hàng sau khi lưu.<br>**Mặc định:** Không tích. | - | - | references/images + references/markdown |
| F9 | Là đối tượng nội bộ | Checkbox | Tùy chọn | **Mục đích:** Đánh dấu NCC là công ty con/mẹ trong tập đoàn → loại trừ giao dịch nội bộ khi lập BCTC hợp nhất. | - | - | references/images + references/markdown |
| F10 | Tổng công ty/chi nhánh | Checkbox | Tùy chọn | **Mục đích:** Đánh dấu NCC là tổng công ty/chi nhánh nội bộ → loại trừ giao dịch nội bộ trong BCTC nội bộ công ty đa chi nhánh. | - | - | references/markdown/khai-bao-nha-cung-cap.md |
| F11 | Điện thoại (NCC) | Text input | Tùy chọn | **Mục đích:** SĐT chính của NCC (khác với SĐT người liên hệ). | - | - | references/images |
| F12 | Website | Text input | Tùy chọn | **Mục đích:** Địa chỉ website của NCC (chỉ dành cho Tổ chức). | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| F13 | Số CCCD (Cá nhân) | Text input | Bắt buộc | **Mục đích:** Số CCCD của cá nhân là NCC — đóng vai trò là "mã" định danh cho tab Cá nhân. | - Khi trống: "Vui lòng nhập Số CCCD" | - | references/images/danhmuc_nhacungcap_them_canhan.png |
| F14 | Họ tên (Cá nhân) | Text input | Bắt buộc | **Mục đích:** Họ và tên đầy đủ của cá nhân là NCC — đóng vai trò là "tên" cho tab Cá nhân. | - Khi trống: "Vui lòng nhập Họ tên" | - | references/images/danhmuc_nhacungcap_them_canhan.png |
| F15 | Năm cấp (CCCD) | Text input | Tùy chọn | **Mục đích:** Năm cấp CCCD. ※Cần xác nhận có bắt buộc không. | - | - | references/images/danhmuc_nhacungcap_them_canhan.png |
| F16 | Số hộ chiếu | Text input | Tùy chọn | **Mục đích:** Số hộ chiếu của cá nhân là NCC (nếu có). | - | - | references/images/danhmuc_nhacungcap_them_canhan.png |
| F17 | Người liên hệ | Text input | Tùy chọn | **Mục đích:** Tên người liên hệ đại diện cho NCC.<br>**Vị trí:** Tab "Thông tin liên hệ" trong dialog. | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| F18 | Email (liên hệ) | Text input | Tùy chọn | **Mục đích:** Email người liên hệ của NCC.<br>**Vị trí:** Tab "Thông tin liên hệ". | - Sai format: ※Cần xác nhận message | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| F19 | Điện thoại (liên hệ) | Text input | Tùy chọn | **Mục đích:** SĐT người liên hệ của NCC.<br>**Vị trí:** Tab "Thông tin liên hệ". | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| F20 | Đại diện theo PL | Text input | Tùy chọn | **Mục đích:** Tên người đại diện theo pháp luật của NCC.<br>**Vị trí:** Tab "Thông tin liên hệ". | - | - | references/images/danhmuc_nhacungcap_them_tochuc.png |
| B3 | Cất | Button | Bắt buộc | **Mục đích:** Lưu thông tin NCC và đóng dialog.<br>**Khi thành công:** NCC được thêm/cập nhật, dialog đóng, danh sách làm mới.<br>**Khi lỗi validation:** Form giữ nguyên, message lỗi hiển thị dưới trường tương ứng. | - | - | references/images + references/markdown |
| B4 | Cất và Thêm | Button | Bắt buộc | **Mục đích:** Lưu NCC hiện tại và mở lại form trống để khai báo NCC tiếp theo (luồng nhập hàng loạt). | - | - | references/images + references/markdown |
| B5 | Hủy | Button | Bắt buộc | **Mục đích:** Đóng dialog mà không lưu bất kỳ thay đổi nào. | - | - | references/images |

## 4. Tác động

1. **Danh mục khách hàng:** NCC tích "Là khách hàng" → sau khi lưu, hệ thống tự tạo/cập nhật bản ghi trong danh sách khách hàng. Nếu thông tin NCC thay đổi, bản ghi KH tương ứng cũng cập nhật theo. *(Nguồn: `references/markdown/khai-bao-nha-cung-cap.md`)*

2. **Màn hình chứng từ mua hàng / thanh toán:** NCC ở trạng thái "Ngừng sử dụng" sẽ bị ẩn khỏi dropdown chọn NCC ở tất cả màn hình lập chứng từ liên quan — người dùng không thể chọn NCC này cho giao dịch mới. *(Nguồn: `references/markdown/nha-cung-cap.md`)*

3. **Báo cáo tài chính hợp nhất / nội bộ:** NCC được đánh dấu "Là đối tượng nội bộ" hoặc "Tổng công ty/chi nhánh" sẽ bị loại trừ khi lập BCTC hợp nhất hoặc BCTC nội bộ. *(Nguồn: `references/markdown/khai-bao-nha-cung-cap.md`)*

4. **Công nợ và giao dịch sau Gộp NCC:** Toàn bộ lịch sử giao dịch, công nợ của NCC bị gộp được chuyển sang NCC giữ lại; NCC bị gộp sẽ bị xóa vĩnh viễn. *(Nguồn: `references/markdown/gop-nha-cung-cap.md`)*

---

## 5. Quy tắc nghiệp vụ

### 5.1 Ngừng sử dụng nhà cung cấp

- NCC ở trạng thái "Ngừng sử dụng" không hiển thị ở màn hình chứng từ và tham số báo cáo liên quan.
- Không hỗ trợ ngừng sử dụng hàng loạt — phải thực hiện từng NCC.
- Có thể đảo ngược: chọn **Sử dụng** để kích hoạt lại.

*(Nguồn: `references/markdown/nha-cung-cap.md`)*

### 5.2 Xóa nhà cung cấp — kiểm tra phát sinh

- NCC **chưa có phát sinh**: xóa trực tiếp sau khi xác nhận.
- NCC **đã có phát sinh** (chứng từ, giao dịch liên kết): hệ thống chặn xóa và hiển thị cảnh báo kèm link "Xem phát sinh". Phải xóa hết phát sinh trước khi xóa NCC.
- Xóa là **xóa vĩnh viễn** (không phải soft delete — ※Cần xác nhận).

*(Nguồn: `references/markdown/nha-cung-cap.md`)*

### 5.3 Là khách hàng — quy tắc đồng bộ

- Tích "Là khách hàng" → sau khi Cất, bản ghi được lưu đồng thời vào danh mục NCC và danh mục KH.
- Nếu thông tin NCC thay đổi sau này (sửa), bản ghi KH tương ứng cập nhật theo (※Cần xác nhận cơ chế: tự động hay cần thao tác riêng).

*(Nguồn: `references/markdown/khai-bao-nha-cung-cap.md`)*

### 5.4 Lấy thông tin từ mã số thuế

- Sau khi nhập MST và nhấn **Lấy thông tin**, hệ thống gọi cổng thông tin cơ quan thuế để lấy Tên NCC và Địa chỉ.
- Yêu cầu có kết nối internet.
- Người dùng có thể chỉnh sửa lại sau khi lấy tự động.
- Nếu không tìm thấy MST hoặc mất kết nối: không có thay đổi, người dùng tự nhập thủ công.

*(Nguồn: `references/markdown/khai-bao-nha-cung-cap.md`)*

### 5.5 Import từ Excel — quy tắc phương thức nhập

- **Thêm mới:** Dữ liệu trong file mà mã chưa tồn tại trong hệ thống → thêm mới. Dữ liệu có mã đã tồn tại → bỏ qua (không cập nhật).
- **Cập nhật:** Dữ liệu chưa có trong hệ thống → thêm mới. Dữ liệu đã có → cập nhật.
- Giới hạn file: 20MB.
- Cấu hình ghép cột được lưu lại cho các lần import tiếp theo.

*(Nguồn: `references/images/danhmuc_nhacungcap_import_excel.png`)*

### 5.6 Gộp nhà cung cấp — quy tắc

- Tiêu chí phát hiện trùng tự động: tên NCC, MST, SĐT, địa chỉ (có thể chọn kết hợp nhiều tiêu chí).
- Sau khi gộp: NCC được chọn giữ lại toàn bộ thông tin và giao dịch; các NCC khác bị xóa.
- Thao tác không thể hoàn tác — cần kiểm tra kỹ trước khi gộp (※Cần xác nhận có bước xác nhận cuối hay không).

*(Nguồn: `references/markdown/gop-nha-cung-cap.md`)*

### 5.7 Tổng hợp message

| No | Message | Nguồn | Loại | Vị trí hiển thị | Ngữ cảnh |
|---|---|---|---|---|---|
| 1 | "Nhà cung cấp \<tên\> đã có phát sinh. Bạn phải xóa các phát sinh liên quan trước khi xóa Nhà cung cấp" | Hệ thống | Dialog cảnh báo | Popup | Xóa NCC đã có giao dịch |
| 2 | "Bạn có chắc muốn xóa Nhà cung cấp \<tên\> không?" | Hệ thống | Dialog xác nhận | Popup | Xóa NCC chưa có phát sinh |
| 3 | Message lỗi validation trường bắt buộc | FE | Inline | Dưới trường tương ứng | Cất mà thiếu trường (*) |
| 4 | ※Cần xác nhận: message khi Lấy thông tin MST không tìm thấy | Hệ thống | Toast/Inline | ※Cần xác nhận | Gọi API thuế thất bại |
| 5 | ※Cần xác nhận: message thành công sau khi Cất | Hệ thống | Toast | ※Cần xác nhận | Khai báo NCC thành công |

## 6. Danh sách cần xác nhận (Dành cho BA / Leader)

### 6.1 Có trong references nhưng chưa thấy trong ảnh hiện tại

1. **Dialog Thêm nhà cung cấp (Tổ chức/Cá nhân):** Chỉ có trong `references/images/` — cần bổ sung ảnh UI hiện tại của dialog khai báo NCC.
2. **Trang Chi tiết NCC:** Chỉ có trong `references/images/` — cần xác nhận project có màn hình chi tiết riêng không.
3. **Import từ Excel (4-step wizard):** Chỉ có trong `references/images/` — cần xác nhận wizard này có được implement không.
4. **Xác nhận cập nhật địa chỉ NCC:** Chỉ có trong `references/images/` — cần xác nhận trigger và luồng cụ thể.
5. **Menu Chức năng (Sửa/Ngừng sử dụng/Xóa/Nhân bản):** Chỉ thấy trong `references/images/` — cần xác nhận tên chính xác và các option của menu.

### 6.2 Điểm cần làm rõ khác

1. **Nhãn thẻ D3:** Ảnh hiển thị số lớn nhưng nhãn khó đọc — cần xác nhận tên chính xác ("Tổng giá trị mua hàng" hay khác).
2. **Dropdown "LDK" (S3):** Nhãn không rõ trong ảnh — cần xác nhận đây là bộ lọc gì (loại đối khách? loại doanh nghiệp?).
3. **S4 ảnh hưởng danh sách bảng:** Cần xác nhận bộ lọc kỳ có lọc danh sách NCC trong bảng hay chỉ ảnh hưởng thẻ chỉ số D2/D3.
4. **Là khách hàng — đồng bộ hai chiều:** Khi sửa thông tin NCC sau đó, bản ghi KH có tự cập nhật không hay cần thao tác riêng?
5. **Xóa NCC — soft delete hay hard delete:** Tài liệu tham khảo mô tả xóa vật lý; cần xác nhận hệ thống mới có dùng soft delete không.
6. **Trigger "Xác nhận cập nhật địa chỉ" (§2.11):** Chưa rõ khi nào dialog này xuất hiện — sau khi Lấy thông tin MST hàng loạt, hay sau thao tác import?
7. **Tên NCC Cá nhân (F3):** Tên nhà cung cấp có tự điền theo Họ tên (F14) hay phải nhập riêng?
8. **Message thành công sau khi Cất:** Hệ thống có hiển thị toast/notification sau khi khai báo thành công không? Nếu có, nội dung message là gì?
9. **Exact wording validation messages:** Message "Vui lòng nhập…" đã ghi trong §3 là dự thảo — cần xác nhận wording chính xác của hệ thống.
10. **Phân quyền:** Cần xác nhận quyền nào kiểm soát từng thao tác: thêm, sửa, xóa, import, xuất Excel, gộp NCC.
