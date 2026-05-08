# Frontend Basic Design: Danh mục nhà cung cấp

## Phase Status
Status: Completed

---

# PART A — INPUT ANALYSIS

## A1. Input Sources

| Source | Path | Purpose | Status |
|--------|------|---------|--------|
| Current UI images | docs/features/danh-muc-nha-cung-cap/images/ | UI tham khảo (MISA Kế toán – hệ thống cũ) | Found (1 file) |
| Reference UI images | docs/features/danh-muc-nha-cung-cap/references/images/ | UI tham khảo MISA chi tiết | Found (8 files) |
| Reference markdown docs | docs/features/danh-muc-nha-cung-cap/references/markdown/ | Hướng dẫn nghiệp vụ MISA | Found (3 files) |
| Additional spec docs | docs/features/danh-muc-nha-cung-cap/markdown/ | SCR-1 MVP spec + full BA requirements | Found (2 files) |
| Existing frontend code | accounting_web/src/modules/suppliers/ | Code MVP đã implement (list + create) | Found |

**Missing Inputs:**
- Không có ảnh UI của dialog Edit/Delete trong `images/` — đã bổ sung từ `references/images/`
- Config.yaml thiếu nhiều fields (stack, entities, permissions) — inferred từ CLAUDE.md và code hiện tại
- Chưa có backend code — backend chưa được implement

**Notable context:**
- `images/danhmuc_nhacungcap_list.png` là ảnh MISA (hệ thống cũ, tham khảo) — không phải UI của AccountingMini
- Code hiện tại trong `accounting_web/src/modules/suppliers/` đã implement scope MVP (list + create dialog)
- Backend `accounting_api` chưa có file nào trong `Features/Suppliers/`

---

## A2. Current UI Analysis

> Phân tích `docs/features/danh-muc-nha-cung-cap/images/danhmuc_nhacungcap_list.png`

### A2.1 Screens Identified

| Screen | File | Description |
|--------|------|-------------|
| Danh sách nhà cung cấp | danhmuc_nhacungcap_list.png | List page — đây là MISA (hệ thống cũ tham khảo) |

### A2.2 Layout Analysis

| Screen | UI Area | Observed Elements | Notes |
|--------|---------|-------------------|-------|
| List Page | Header / Metric cards | 3 thẻ số liệu: Tổng lũy kế (0.0), 4.020.240.692,6, 7.132.214.273,0 | Có thể là: Nợ phải trả, Tổng mua hàng, Tổng nợ |
| List Page | Toolbar | Search input, Period picker, Page size dropdown (100), Thêm button | Tiện ích button bị cắt khỏi ảnh |
| List Page | Data Grid | AG Grid với nhiều cột, sortable, row striping | Sử dụng AG Grid Community |
| List Page | Grid Columns | Mã NCC, Tên NCC, Địa chỉ, SĐT, Số TK NH/CCCD/Hộ chiếu, Nợ (đỏ khi âm), Nợ cũ, Lập CT mua hàng (link), Chức năng (▼) | Nợ âm = màu đỏ (dư có) |
| List Page | Pagination | "Tổng số: 365 bản ghi", prev/next navigation, page size selector | Server-side pagination |

### A2.3 Current Feature Inventory

| Feature / Capability | UI Area | Elements | Notes |
|----------------------|---------|----------|-------|
| List with paging | Grid | Bảng 365 bản ghi, phân trang | Server-side |
| Search | Toolbar | Ô tìm kiếm | Theo tên hoặc mã |
| Period filter | Toolbar | Date picker kỳ kế toán | Ảnh hưởng thẻ chỉ số |
| Metric cards | Header | 3 thẻ số | Tổng nợ, tổng mua, số NCC ngừng |
| Page size selector | Toolbar | Dropdown 100 | Tùy chỉnh số dòng/trang |
| Add button | Toolbar | Nút "Thêm" | Mở dialog khai báo mới |
| Nợ column | Grid | Giá trị tiền, đỏ khi âm | Dữ liệu công nợ phải trả |
| Row action | Grid | Cột Chức năng (▼) | Sửa, Ngừng, Xóa, Nhân bản |
| Lập CT mua hàng | Grid | Textlink | Tạo chứng từ mua từ NCC |

### A2.4 Unclear Points from Current UI

| Item | Screenshot | Why Unclear |
|------|-----------|-------------|
| Nhãn thẻ chỉ số | danhmuc_nhacungcap_list.png | Chữ nhỏ, khó đọc chính xác |
| Tiện ích menu options | danhmuc_nhacungcap_list.png | Bị cắt khỏi ảnh |
| Cột Số TK NH/CCCD/Hộ chiếu | danhmuc_nhacungcap_list.png | Không rõ hiển thị từ trường nào |

---

## A3. Reference UI Analysis

> Phân tích 8 ảnh trong `docs/features/danh-muc-nha-cung-cap/references/images/`

### A3.1 Reference Screens Identified

| Screen | File | Source System | Description |
|--------|------|--------------|-------------|
| Danh sách NCC (full) | danhmuc_nhacungcap_list.png | MISA Kế toán | Full app view: sidebar, header, list |
| List + menu Chức năng | danhmuc_nhacungcap_list_menu_chucnang.png | MISA Kế toán | Action dropdown mở: Sửa/Nhân bản/Ngừng/Xóa |
| Form thêm NCC – Tổ chức | danhmuc_nhacungcap_them_tochuc.png | MISA Kế toán | Dialog Tổ chức tab với nhiều fields |
| Form thêm NCC – Cá nhân | danhmuc_nhacungcap_them_canhan.png | MISA Kế toán | Dialog Cá nhân tab |
| Chi tiết NCC | danhmuc_nhacungcap_detail.png | MISA Kế toán | Trang chi tiết: lịch sử giao dịch, công nợ |
| Import từ Excel | danhmuc_nhacungcap_import_excel.png | MISA Kế toán | Wizard 4 bước nhập Excel |
| Xác nhận cập nhật địa chỉ | danhmuc_nhacungcap_xacnhandiachiNCC.png | MISA Kế toán | Bulk address update confirmation dialog |
| Xóa NCC | danhmuc_nhacungcap_xoa.png | MISA Kế toán | Delete confirmation popup |

### A3.2 Layout Analysis

| Reference Screen | UI Area | Observed Elements | Suggested Usage |
|-----------------|---------|-------------------|----------------|
| List (full) | Left sidebar | Navigation menu với Danh mục active | Reference for menu structure |
| List (full) | Header | Company name, fiscal year, period selector | Not part of suppliers feature |
| List (full) | Metric cards | 3 cards: Tổng nợ phải trả, Total mua hàng, 7.132.214.273,0 | Summary stats section |
| List (full) | Toolbar | Search, "Tiện ích ▼" (dropdown), "Thêm" (green) | Action bar pattern |
| List (full) | Grid | 9 columns, row hover highlight | Column definitions |
| List (full) | Pagination | "100 bản ghi/trang 1 ▼", Prev/Next | Pagination component |
| Form (Tổ chức) | Dialog | Tabs: Tổ chức/Cá nhân + "Là khách hàng" checkbox | Form structure |
| Form (Tổ chức) | Main tab | MST/CCCD, "Lấy thông tin" btn, Tên, ĐVQHNS, Nhóm NCC, Nhóm hàng, Địa chỉ, ĐT, Website, checkboxes | Fields list |
| Form (Tổ chức) | Sub-tabs | Thông tin liên hệ, Điều khoản TT, TK ngân hàng, Địa chỉ khác, Ghi chú, Thông tin bổ sung | Extended data sections |
| Form (Tổ chức) | Buttons | Hủy, Cất, Cất và Thêm | Save actions |
| Form (Cá nhân) | Main tab | Số CCCD, Ngày/nơi cấp, Tên NCC, MST, Nhóm mua hàng, Địa chỉ, Là đối tượng nội bộ | Individual-specific fields |
| Detail page | Left panel | List of related suppliers | Navigation aid |
| Detail page | Right panel | Header info + Chi tiết/Công nợ tabs | Two-panel layout |
| Import wizard | Step 1 | File upload, sheet select, method (Thêm mới/Cập nhật) | Wizard pattern |
| Delete popup | Modal | "Bạn có chắc là xóa nhà cung cấp … không?" + OK/X | Simple confirm pattern |

### A3.3 Reference Feature Inventory

| Feature / Capability | UI Area | Elements | Notes |
|----------------------|---------|----------|-------|
| List with pagination | Grid | AG Grid, 9 cols | Server-side |
| Search | Toolbar | Text input | Name + code |
| Period filter | Toolbar | Date/period picker | Affects metric cards |
| Province filter | Toolbar | Tỉnh dropdown | Filter by address province |
| "LDK" filter | Toolbar | Unknown dropdown | Unclear purpose |
| Metric cards | Header | 3 stat cards | Financial totals |
| Add supplier | Toolbar | "Thêm" button | Opens dialog |
| Tổ chức/Cá nhân types | Form | Tab selector | Two supplier types |
| Là khách hàng | Form | Checkbox | Dual NCC+KH entity |
| Là đối tượng nội bộ | Form | Checkbox | For consolidated reports |
| Tổng công ty/chi nhánh | Form | Checkbox | Internal branch flag |
| Lấy thông tin MST | Form | Button | External tax API lookup |
| Extended form tabs | Form | 5+ sub-tabs | Contact, payment terms, bank, etc. |
| Cất và Thêm | Form | Button | Save + open new form |
| Edit supplier | Row menu | Sửa | Opens form with data |
| Clone supplier | Row menu | Nhân bản | Copies data to new form |
| Deactivate/Activate | Row menu | Ngừng sử dụng / Sử dụng | Toggle isActive |
| Delete supplier | Row menu | Xóa | Confirm then delete |
| Supplier detail page | Textlink on name | Click name → detail page | Full detail + transactions |
| Transaction history | Detail page | Chi tiết tab | Purchase vouchers |
| Debt info | Detail page | Công nợ tab | Payable balance |
| Financial columns | Grid | Nợ, Nợ cũ | Accounting balance |
| "Lập CT mua hàng" | Grid | Textlink column | Jump to purchase voucher |
| Tiện ích menu | Toolbar | Dropdown | Merge, Import, Export, Customize |
| Export Excel | Tiện ích | Menu item | Export list to .xlsx |
| Import Excel | Tiện ích | 4-step wizard | Bulk import from .xlsx |
| Merge suppliers (auto) | Tiện ích | Dialog | Auto-detect duplicates |
| Merge suppliers (manual) | Tiện ích | Bulk action | Manual select & merge |
| Customize columns | Tiện ích | Checkbox list | Show/hide columns |
| Address update confirm | System | Dialog | Bulk address confirmation |
| Row selection (bulk) | Grid | Checkbox | Multi-select for bulk actions |

### A3.4 UX Patterns Worth Adopting

| Pattern | Reference Source | Description | Recommendation |
|---------|-----------------|-------------|---------------|
| Row action dropdown (▼) | list_menu_chucnang.png | Inline action menu per row | Implement (replaces separate buttons) |
| Cất và Thêm | them_tochuc.png | Save + immediately open new form | Include for power users |
| Delete confirmation popup | xoa.png | Simple modal with supplier name in message | Implement — clear pattern |
| Wizard import | import_excel.png | Step-by-step 4-phase import with progress indicator | Adopt if Import is in scope |
| Metric summary cards | list.png | 3 cards at top with key financial totals | Include pending backend confirmation |
| Supplier name as Textlink | list.png | Clicking name opens detail page | Include if detail page is in scope |

---

## A4. Reference Markdown Analysis

### A4.1 Documents Processed

| Document | File | Summary |
|----------|------|---------|
| Nhà cung cấp (overview) | references/markdown/nha-cung-cap.md | Tổng quan: tạo mới, sửa, ngừng sử dụng, xóa NCC, xuất Excel, tùy chỉnh giao diện |
| Khai báo nhà cung cấp | references/markdown/khai-bao-nha-cung-cap.md | Chi tiết: Tổ chức/Cá nhân types, Là khách hàng, MST lookup, Là đối tượng nội bộ, Tổng công ty/chi nhánh |
| Gộp nhà cung cấp | references/markdown/gop-nha-cung-cap.md | Merge: auto (theo tên/MST/SĐT/địa chỉ) + manual (bulk select) |
| SCR-1 MVP Spec | markdown/SCR-1_仕入先マスター_Supplier-List.md | Chi tiết màn hình MVP: list + create dialog — scope ban đầu của AccountingMini |
| BA Requirements | markdown/danh-muc-nha-cung-cap.md | Full scope: tất cả features từ MISA với field-level analysis |

### A4.2 Business Capabilities Extracted

| Capability | Source Document | Description | Impact on Design |
|------------|----------------|-------------|-----------------|
| Tạo mới NCC | nha-cung-cap.md, khai-bao-nha-cung-cap.md | Khai báo NCC Tổ chức hoặc Cá nhân | Form với 2 tab types |
| Sửa NCC | nha-cung-cap.md | Chỉnh sửa thông tin đã khai báo | Edit dialog / page |
| Ngừng sử dụng | nha-cung-cap.md | Toggle isActive — NCC ngừng ẩn khỏi chứng từ | Row action + UI hide |
| Xóa NCC | nha-cung-cap.md | Xóa nếu chưa có phát sinh; block nếu có phát sinh | Confirm dialog + error handling |
| Xuất Excel | nha-cung-cap.md | Export danh sách ra .xlsx | Export button |
| Tùy chỉnh giao diện | nha-cung-cap.md | Ẩn/hiện cột, lưu cấu hình | Column customization |
| Lấy thông tin MST | khai-bao-nha-cung-cap.md | Auto-fill từ cổng thuế khi có internet | External API call |
| Là khách hàng | khai-bao-nha-cung-cap.md | NCC vừa là KH → đồng bộ sang danh mục khách hàng | Cross-entity sync |
| Là đối tượng nội bộ | khai-bao-nha-cung-cap.md | Loại trừ giao dịch nội bộ trong BCTC hợp nhất | Boolean flag |
| Tổng công ty/chi nhánh | khai-bao-nha-cung-cap.md | Loại trừ giao dịch nội bộ trong BCTC nội bộ | Boolean flag |
| Gộp NCC tự động | gop-nha-cung-cap.md | Phát hiện trùng theo tên/MST/SĐT/địa chỉ | Complex wizard |
| Gộp NCC thủ công | gop-nha-cung-cap.md | Chọn nhiều NCC → gộp → giữ 1 | Bulk action |
| Import Excel | danh-muc-nha-cung-cap.md | 4-step wizard, max 20MB, Thêm mới / Cập nhật mode | Complex import wizard |
| Chi tiết NCC | danh-muc-nha-cung-cap.md | Trang riêng: lịch sử giao dịch + công nợ | Detail page with tabs |
| Metric cards | danh-muc-nha-cung-cap.md | 3 thẻ: Tổng nợ phải trả, Tổng mua hàng, Số NCC ngừng | Requires aggregation APIs |
| Xác nhận cập nhật địa chỉ | danh-muc-nha-cung-cap.md | Bulk address update confirmation dialog | Confirmation workflow |

### A4.3 Business Rules Extracted

| Rule | Source | Description | Impact on Design |
|------|--------|-------------|-----------------|
| Xóa NCC có phát sinh | nha-cung-cap.md | Hệ thống chặn xóa NCC đã có giao dịch; phải xóa giao dịch trước | Error message + "Xem phát sinh" link |
| Ngừng sử dụng ảnh hưởng chứng từ | nha-cung-cap.md | NCC ngừng không xuất hiện trong dropdown chứng từ | Backend filter, UI badge |
| Không hỗ trợ ngừng sử dụng hàng loạt | nha-cung-cap.md | Phải làm từng NCC | No bulk deactivate button |
| isActive = true khi tạo mới | SCR-1 / danh-muc-nha-cung-cap.md | Luôn active khi tạo; field không hiển thị trên form | Default value logic |
| Đồng bộ KH khi "Là khách hàng" | khai-bao-nha-cung-cap.md | Sau khi Cất, tự tạo/cập nhật bản ghi khách hàng | Cross-module side effect |
| Gộp NCC: irreversible | gop-nha-cung-cap.md | Sau khi gộp, NCC bị gộp bị xóa vĩnh viễn; không hoàn tác | Warning + confirmation |
| Import: Thêm mới vs Cập nhật | danh-muc-nha-cung-cap.md | Thêm mới: bỏ qua mã trùng. Cập nhật: overwrite mã trùng | Import mode selector |
| Code NCC unique | SCR-1 | Mã nhà cung cấp là bắt buộc và phải duy nhất | Unique constraint + BE error handling |
| Mã max 32 chars | SCR-1 | Validation: code max 32 | FE Zod validation |
| Tên max 255 chars | SCR-1 | Validation: name max 255 | FE Zod validation |

### A4.4 Validation Rules Extracted

| Field / Action | Rule | Source | Impact |
|---------------|------|--------|--------|
| Mã NCC | Required, max 32 chars | SCR-1, BA doc | Zod: min(1), max(32) |
| Tên NCC | Required, max 255 chars | SCR-1, BA doc | Zod: min(1), max(255) |
| MST / Mã số thuế | Optional, max 32 chars | SCR-1, BA doc | Zod: optional, max(32) |
| Email | Optional, valid email format | SCR-1 | Zod: email() or literal("") |
| Điện thoại | Optional, max 32 chars | SCR-1 | Zod: optional, max(32) |
| Địa chỉ | Optional, max 500 chars | SCR-1 | Zod: optional, max(500) |
| Số CCCD (Cá nhân) | Required for Cá nhân type | BA doc | Conditional required |
| Họ tên (Cá nhân) | Required for Cá nhân type | BA doc | Conditional required |
| Xóa NCC | Block nếu có phát sinh dữ liệu | nha-cung-cap.md | BE validates; FE shows error |

### A4.5 User Flows Extracted

| Flow | Steps | Source | Notes |
|------|-------|--------|-------|
| Tạo NCC Tổ chức | Nhấn Thêm → chọn tab Tổ chức → nhập MST → Lấy thông tin (optional) → điền Tên, Nhóm, Địa chỉ, v.v. → Cất | khai-bao-nha-cung-cap.md | MST lookup optional |
| Tạo NCC Cá nhân | Nhấn Thêm → chọn tab Cá nhân → nhập Số CCCD, Họ tên → điền thông tin thêm → Cất | BA doc | CCCD required |
| Sửa NCC | Click ▼ → Sửa → form điền sẵn → chỉnh sửa → Cất | nha-cung-cap.md | Same form as create |
| Ngừng sử dụng | Click ▼ → Ngừng sử dụng → confirm (optional) → isActive = false | nha-cung-cap.md | Ảnh hưởng chứng từ |
| Xóa NCC (no tx) | Click ▼ → Xóa → confirm dialog → OK → xóa | nha-cung-cap.md | Simple path |
| Xóa NCC (has tx) | Click ▼ → Xóa → error: "có phát sinh" → "Xem phát sinh" → xóa giao dịch trước | nha-cung-cap.md | Must clear transactions first |
| Gộp tự động | Tiện ích → Gộp tự động → chọn tiêu chí → Lấy NCC → tick giữ lại → Gộp và đóng | gop-nha-cung-cap.md | Irreversible |
| Gộp thủ công | Tick nhiều NCC → Thực hiện hàng loạt → Gộp → tick giữ lại → Gộp và Đóng | gop-nha-cung-cap.md | Irreversible |
| Import Excel | Tiện ích → Nhập từ Excel → Step1: chọn file, mode → Step2: map columns → Step3: validate → Step4: result | BA doc | 4-step wizard |

### A4.6 Terminology Glossary

| Term | Definition | Source |
|------|-----------|--------|
| NCC | Nhà cung cấp (Supplier) | All sources |
| Tổ chức | Doanh nghiệp có MST (Organization/Company) | khai-bao-nha-cung-cap.md |
| Cá nhân | Cá nhân có CCCD/hộ chiếu (Individual) | khai-bao-nha-cung-cap.md |
| Phát sinh | Giao dịch/chứng từ liên quan đến NCC | nha-cung-cap.md |
| Ngừng sử dụng | isActive = false; NCC ẩn khỏi chứng từ | nha-cung-cap.md |
| Gộp | Merge nhiều NCC thành 1 | gop-nha-cung-cap.md |
| ĐVQHNS | Mã số đơn vị quan hệ ngân sách (Government budget code) | khai-bao-nha-cung-cap.md |
| Là đối tượng nội bộ | NCC là công ty con/mẹ trong tập đoàn | khai-bao-nha-cung-cap.md |
| Tổng công ty/chi nhánh | NCC là tổng công ty/chi nhánh nội bộ | khai-bao-nha-cung-cap.md |
| Cất | Save / Lưu (action button label) | Reference UI |
| Cất và Thêm | Save + mở form trống mới | Reference UI |
| Lập CT mua hàng | Lập chứng từ mua hàng | Current UI |
| Công nợ phải trả | Accounts payable (debt owed to suppliers) | All sources |

---

## A5. Feature Comparison Matrix

| Feature / Capability | Current UI (MISA ref) | Reference UI (MISA) | Reference Markdown | Status | Decision |
|----------------------|----------------------|--------------------|--------------------|--------|----------|
| List view AG Grid | ✓ | ✓ | ✓ | Matched | Implement |
| Search by name/code | ✓ | ✓ | ✓ | Matched | Implement |
| Server-side pagination | ✓ | ✓ | ✓ | Matched | Implement |
| Page size selector | ✓ | ✓ | ✓ | Matched | Implement |
| Metric/summary cards (3) | ✓ | ✓ | ✓ | Matched | Need Confirmation |
| Period filter (kỳ) | ✓ | ✓ | ✓ | Matched | Need Confirmation |
| Province filter (Tỉnh) | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| "LDK" dropdown filter | – | ✓ | – | Unclear | Need Confirmation |
| "Tiện ích" dropdown button | – (cropped) | ✓ | ✓ | Missing in Current UI | Implement |
| Add supplier (dialog) | ✓ | ✓ | ✓ | Matched | Implement |
| Tổ chức / Cá nhân type | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Là khách hàng flag | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Là đối tượng nội bộ | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Tổng công ty/chi nhánh | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Lấy thông tin MST (API) | – | ✓ | ✓ | Missing in Current UI | Defer |
| Extended sub-tabs (form) | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| "Cất và Thêm" button | – | ✓ | ✓ | Missing in Current UI | Implement |
| Edit supplier | – | ✓ | ✓ | Missing in Current UI | Implement |
| Clone supplier (Nhân bản) | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Deactivate/Activate | – | ✓ | ✓ | Missing in Current UI | Implement |
| Delete supplier | – | ✓ | ✓ | Missing in Current UI | Implement |
| Delete + check phát sinh | – | – | ✓ | Mentioned in Docs Only | Implement (backend handles) |
| Row action dropdown (▼) | ✓ | ✓ | ✓ | Matched | Implement |
| Supplier detail page | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Transaction history tab | – | ✓ | ✓ | Missing in Current UI | Defer |
| Công nợ tab | – | ✓ | ✓ | Missing in Current UI | Defer |
| Financial columns (Nợ/Nợ cũ) | ✓ | ✓ | ✓ | Matched | Defer |
| "Lập CT mua hàng" column | ✓ | ✓ | ✓ | Matched | Defer |
| Export to Excel | – | ✓ | ✓ | Missing in Current UI | Implement |
| Import from Excel (wizard) | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Merge suppliers (auto) | – | ✓ | ✓ | Missing in Current UI | Defer |
| Merge suppliers (manual) | – | ✓ | ✓ | Missing in Current UI | Defer |
| Address update confirm | – | ✓ | ✓ | Missing in Current UI | Defer |
| Customize columns | – | – | ✓ | Mentioned in Docs Only | Defer |
| Bulk row selection | – | ✓ | ✓ | Missing in Current UI | Need Confirmation |
| Permission-based UI | – | – | ✓ | Mentioned in Docs Only | Implement |
| Loading / empty / error states | – | – | – | UI Only (inferred) | Implement |

---

## A6. Gap Analysis

### A6.1 Missing Features

> Tính năng có trong reference nhưng chưa thấy trong current UI images / code hiện tại

| Feature | Found In | Missing From | Impact | Recommendation |
|---------|----------|-------------|--------|---------------|
| Edit supplier | Reference UI + Docs | Current code (no Edit UI) | Medium — CRUD incomplete | Implement in Phase 7 |
| Delete supplier (UI) | Reference UI + Docs | Current code (hook exists, no UI) | Medium — CRUD incomplete | Implement in Phase 7 |
| Toggle active/inactive | Reference UI + Docs | Current code | Medium — state management | Implement in Phase 7 |
| Tổ chức / Cá nhân type | Reference UI + Docs | Current code & types | High — data model change | Need Confirmation |
| Metric summary cards | Reference UI + Docs | Current code | Low — informational | Need Confirmation |
| Supplier detail page | Reference UI + Docs | Current code | Medium — usability | Need Confirmation |
| Export to Excel | Reference UI + Docs | Current code | Medium — common need | Implement in Phase 7 |
| tenantId in query key | CLAUDE.md convention | Current useSuppliers.ts | Low — correctness | Fix in Phase 7 |
| Province filter | Reference UI + Docs | Current code | Low | Need Confirmation |
| "Cất và Thêm" | Reference UI | Current form | Low | Implement |
| Pagination UI component | Reference UI | SupplierListPage (no pagination UI) | Medium — usability | Implement |

### A6.2 Extra Features

> Tính năng trong code hiện tại không thấy trong reference design docs

| Feature | Found In | Not Found In | Risk | Recommendation |
|---------|----------|-------------|------|---------------|
| useUpdateSupplier hook | Current code | Not yet used in UI | Low — future-proofing | Keep, will be used for Edit |
| useDeleteSupplier hook | Current code | Not yet used in UI | Low | Keep, will be used for Delete |
| isActive in create form (hidden) | Current schema | Reference MVP form | Low | Keep default true |

### A6.3 Conflicting Features

| Topic | Current Code | Reference UI | Reference Markdown | Conflict | Proposed Resolution |
|-------|-------------|-------------|-------------------|----------|---------------------|
| Permission key naming | `suppliers.read` (plural) | N/A | N/A | Minor — CLAUDE.md example uses `supplier.view` (singular) | Keep existing `suppliers.read` convention (already in code + permissions.ts) |
| Query key includes tenantId? | No tenantId in KEYS | CLAUDE.md requires tenantId | CLAUDE.md convention | Conflict with convention | Add tenantId to query keys in Phase 7 |
| isActive default | `default(true)` in schema | Not shown in form | BA doc: always true on create | No conflict | Maintain default(true); no UI field |

### A6.4 Unclear Items — Open Questions

| # | Question | Context | Options | Recommended Default |
|---|----------|---------|---------|---------------------|
| Q1 | Có implement Tổ chức/Cá nhân type không? | Ảnh hưởng data model; cần migration nếu add sau | Yes (2 tabs) / No (đơn giản hoá) / Later | Later — keep simple for MVP; add supplierType field nullable |
| Q2 | Metric cards có cần không? | Cần aggregation API từ backend | Yes (cần BE API) / No (ẩn) / Later | Later (Defer) |
| Q3 | Có làm trang chi tiết NCC không? | /suppliers/{id} route riêng | Yes / No / Later | Yes (implement cơ bản) |
| Q4 | Province filter có cần không? | Cần danh mục tỉnh/thành phố | Yes / No / Later | Later (Defer) |
| Q5 | Import Excel có trong scope Phase 7 không? | Wizard 4 bước, phức tạp | Yes / No / Later | Later (Defer) |
| Q6 | "Là khách hàng" có cần không? | Cross-entity sync phức tạp | Yes / No / Later | Later (Defer) |
| Q7 | Bulk row selection có cần không? | Cần nếu có bulk delete / bulk deactivate | Yes / No | No (chưa có bulk action nào) |
| Q8 | Kích thước trang mặc định là bao nhiêu? | pageSize default value | 20 / 50 / 100 | 20 |

---

## A7. Confirmed Frontend Scope

| Feature | Include? | Reason | Source |
|---------|----------|--------|--------|
| List view with AG Grid | Yes | Core feature, đã có code | All sources |
| Search (name/code, debounced) | Yes | Core UX, đã có code | All sources |
| Server-side pagination | Yes | 365+ records, essential | All sources |
| Page size selector (20/50/100) | Yes | UX standard | Reference UI |
| Create supplier (dialog) | Yes | Core CRUD, đã có code | All sources |
| Edit supplier (dialog) | Yes | Core CRUD | Reference UI + Docs |
| Delete supplier (confirm dialog) | Yes | Core CRUD | Reference UI + Docs |
| Toggle active/inactive | Yes | Core lifecycle | Reference UI + Docs |
| Row action dropdown menu (▼) | Yes | Standard UX pattern | Reference UI |
| "Cất và Thêm" (Save & Add Next) | Yes | Power user UX | Reference UI |
| Export to Excel | Yes | Common need, simple | Reference UI + Docs |
| Permission-based UI | Yes | Security requirement | CLAUDE.md + Docs |
| Loading / empty / error states | Yes | Standard UX | CLAUDE.md |
| Supplier detail page (/suppliers/{id}) | Yes | Usability — view full info | Reference UI + Docs |
| Metric summary cards | Need Confirmation | Requires aggregation API (BE work) | Q2 |
| Tổ chức / Cá nhân type | Need Confirmation | Data model impact | Q1 |
| Province filter | Need Confirmation | Complexity vs value | Q4 |
| Import from Excel | Need Confirmation | Complex 4-step wizard | Q5 |
| "Là khách hàng" | Need Confirmation | Cross-entity side effect | Q6 |
| Nhân bản (clone) | Need Confirmation | Lower priority | Reference UI |
| "LDK" dropdown filter | Need Confirmation | Unclear purpose | Unclear |
| Financial columns (Nợ/Nợ cũ) | Later | Requires accounting transactions | Reference UI |
| Merge suppliers | Later | Complex, low frequency | Reference UI + Docs |
| Transaction history tab | Later | Requires accounting data | Reference UI |
| "Lập CT mua hàng" column | Later | Depends on invoice module | Reference UI |
| Lấy thông tin MST (API) | Later | External API integration | Reference Docs |
| Address update confirmation | Later | Complex trigger logic | Reference UI |
| Customize columns | Later | Nice-to-have | Docs |
| Bulk row selection | No | No bulk actions in scope | — |

---

## A8. Updated Frontend API Needs

| UI Action | Required By | Method Draft | Endpoint Draft | Request | Response | Notes |
|-----------|------------|-------------|---------------|---------|----------|-------|
| Load list | All sources | GET | /api/suppliers | { search?, page?, pageSize?, sortBy?, sortDir?, isActive? } | PageResult<SupplierListItem> | Server-side pagination |
| Load detail | Detail page | GET | /api/suppliers/{id} | — | SupplierDetail | Full info |
| Create supplier | Create dialog | POST | /api/suppliers | CreateSupplierRequest | SupplierDetail | 201 on success |
| Update supplier | Edit dialog | PUT | /api/suppliers/{id} | UpdateSupplierRequest | SupplierDetail | |
| Delete supplier | Delete confirm | DELETE | /api/suppliers/{id} | — | void | 409/400 if has transactions |
| Toggle active | Row action | PATCH | /api/suppliers/{id}/toggle-active | — | { isActive: bool } | Or PUT with isActive |
| Export to Excel | Tiện ích | GET | /api/suppliers/export | { search?, isActive? } | binary/xlsx | Content-Disposition: attachment |
| Summary/stats | Metric cards (if in scope) | GET | /api/suppliers/summary | — | SupplierSummary | Aggregation endpoint |

---

## A9. Frontend Basic Design Decision Log

| # | Decision | Reason | Source | Impact |
|---|----------|--------|--------|--------|
| D1 | Module path: `src/modules/suppliers/` (not features) | CLAUDE.md convention | CLAUDE.md | All file paths |
| D2 | API client: `api` from `@/lib/api/client` | CLAUDE.md convention | CLAUDE.md | supplier.api.ts |
| D3 | Permission keys: `suppliers.read`, `suppliers.create`, `suppliers.update`, `suppliers.delete` (plural) | Already in permissions.ts; consistent with codebase | Existing code | permissions.ts |
| D4 | Add `suppliers.export` permission for export action | New capability needs new permission | Derived | permissions.ts |
| D5 | Query keys must include `tenantId` | CLAUDE.md convention — invalidate on tenant switch | CLAUDE.md | useSuppliers.ts |
| D6 | isActive defaults to true on create; no UI field | SCR-1 + BA doc + existing schema | SCR-1 | SupplierForm |
| D7 | Delete: backend returns error if has transactions; FE shows toast error | Reference docs business rule | nha-cung-cap.md | Delete handler |
| D8 | Row action menu (▼ dropdown) per row | Reference UI pattern; cleaner than inline buttons | Reference UI | SupplierTable |
| D9 | Tổ chức/Cá nhân type: mark as "Need Confirmation" — don't block Phase 7 | Significant model change; can be added later without migration if type field nullable | Assumption | SupplierForm |
| D10 | Financial columns (Nợ/Nợ cũ): Defer — requires accounting module | Out of scope for current phase | Assumption | SupplierTable |
| D11 | "Cất và Thêm": implement as second submit button in dialog | High-value for batch entry, low complexity | Reference UI | SupplierForm |
| D12 | Pagination UI: use shared component; pageSize default = 20 | Standard accounting app | CLAUDE.md + Reference UI | SupplierListPage |
| D13 | Export: GET endpoint returning .xlsx via download | Simple implementation | Reference UI + Docs | supplier.api.ts |
| D14 | debounce search input (300ms) | Prevent excessive API calls | SCR-1 question noted | GridToolbar |

---

# PART B — FRONTEND DESIGN

## 1. Overview

### 1.1 Purpose
Màn hình **Danh mục nhà cung cấp** là nơi quản lý tập trung thông tin nhà cung cấp của doanh nghiệp. Cung cấp các chức năng: xem danh sách, tìm kiếm, thêm mới, chỉnh sửa, ngừng sử dụng, xóa và xuất Excel.

### 1.2 Business Context
Dữ liệu nhà cung cấp là master data dùng xuyên suốt trong các nghiệp vụ mua hàng, thanh toán và đối chiếu công nợ. Tính chính xác và đầy đủ của danh mục NCC ảnh hưởng trực tiếp đến các chứng từ kế toán.

### 1.3 Target Users
- **Kế toán viên:** Quản lý danh mục NCC hàng ngày — thêm mới, sửa, xem
- **Kế toán trưởng:** Giám sát danh mục, xuất báo cáo
- **Người dùng có quyền hạn chế:** Chỉ xem (read-only)

### 1.4 Related Screens
| Screen | Relation | Note |
|--------|----------|------|
| /suppliers/{id} | Detail page | Trang chi tiết NCC |
| /dashboard | Redirect | Khi không có quyền `suppliers.read` |
| Danh mục khách hàng | Cross-entity | Nếu "Là khách hàng" được implement |

---

## 2. Screen Layout

### 2.1 Page Structure

```
/suppliers — SupplierListPage
├── PermissionGuard (requires suppliers.read)
├── Page Header
│   ├── Title: "Nhà cung cấp"
│   ├── Description: "Quản lý danh sách nhà cung cấp."
│   └── Action bar (right)
│       ├── [DEFER] Metric cards (3)
│       ├── Tiện ích ▼ (Export, ...)
│       └── <Can permission="suppliers.create"> Thêm NCC button
├── Filter Area (Card)
│   ├── GridToolbar: Search input (debounced 300ms)
│   └── [Q4 - if confirmed] Province filter dropdown
├── Data Grid (Card)
│   └── SupplierTable
│       ├── AG Grid rows
│       └── Per row: ▼ action menu
├── Pagination Area
│   └── page info + page size selector + prev/next
└── Dialogs (mounted at page level)
    ├── SupplierFormDialog (Create / Edit — shared dialog)
    ├── DeleteConfirmDialog
    └── [Q5 - if confirmed] ImportExcelDialog (wizard)
```

### 2.2 Toolbar Area

| Element | Visibility | Action | Permission |
|---------|-----------|--------|-----------|
| "Thêm nhà cung cấp" button | `suppliers.create` only | Opens create dialog | suppliers.create |
| "Tiện ích ▼" dropdown | Always visible | Opens action menu | — |
| └ Xuất ra Excel | `suppliers.export` | Triggers export API | suppliers.export |
| └ [Later] Nhập từ Excel | `suppliers.import` | Opens import wizard | suppliers.import |
| └ [Later] Gộp NCC | `suppliers.update` | Opens merge dialog | suppliers.update |

### 2.3 Filter Area

| Filter | Type | Default | Behavior |
|--------|------|---------|----------|
| Search | Text input | empty | Debounce 300ms → re-fetch list |
| isActive | Tab/Toggle (All / Active / Inactive) | All | Immediate re-fetch |
| [Q4] Province | Dropdown | All | If confirmed |
| [Q2] Period | Date picker | Current period | If confirmed (affects metric cards) |

### 2.4 Data Grid

| Column | Field | Type | Sortable | Notes |
|--------|-------|------|----------|-------|
| Mã | code | string | Yes | Fixed width 120px |
| Tên nhà cung cấp | name | string | Yes | Flex, clickable → detail page |
| MST | taxCode | string? | No | Optional |
| Email | email | string? | No | Optional |
| Điện thoại | phone | string? | No | Optional |
| Trạng thái | isActive | bool | No | "Hoạt động" / "Ngừng" (AG Grid valueFormatter) |
| Chức năng | — | action | No | ▼ dropdown: Sửa, Ngừng/Sử dụng, Xóa |

**Column notes:**
- `name` field renders as Textlink → navigates to `/suppliers/{id}` if detail page in scope
- Action column ▼ dropdown: shows "Ngừng sử dụng" when isActive=true, "Sử dụng" when isActive=false
- "Xóa" in action menu: requires `suppliers.delete` permission (hidden if no permission)
- "Sửa" in action menu: requires `suppliers.update` permission (hidden if no permission)

### 2.5 Summary Cards

> **Status: Need Confirmation (Q2)**
> Requires backend aggregation API. Defer unless backend confirms support.

If implemented:
| Card | Label | Value | Requires |
|------|-------|-------|---------|
| Card 1 | Tổng nợ phải trả | Total payable balance | Aggregation API |
| Card 2 | Tổng giá trị mua hàng | Total purchase value (current period) | Aggregation API + period param |
| Card 3 | Số NCC đóng tài khoản | Count of inactive suppliers | Simple count query |

### 2.6 Detail / Form Dialog

**SupplierFormDialog** (shared for Create and Edit):

```
Dialog
├── Header: "Thêm nhà cung cấp" / "Sửa nhà cung cấp"
├── Form (SupplierForm)
│   ├── Row 1: [Mã *] [Tên nhà cung cấp *]
│   ├── Row 2: [Mã số thuế] [Email]
│   ├── Row 3: [Điện thoại] (empty)
│   └── Row 4: [Địa chỉ — full width]
└── Footer
    ├── Hủy (cancel)
    ├── [Create mode] Cất và Thêm (save + reset for next entry)
    └── Tạo mới / Lưu (submit)
```

**Supplier Detail Page** `/suppliers/{id}`:

```
SupplierDetailPage
├── PermissionGuard (requires suppliers.read)
├── Back button → /suppliers
├── Page header: supplier name + status badge
├── Action buttons: Sửa, Ngừng/Sử dụng, Xóa (permission-gated)
├── Info cards: Mã, MST, Email, Điện thoại, Địa chỉ
└── [Later] Tabs: Chi tiết giao dịch / Công nợ
```

### 2.7 Pagination

- **Strategy:** Server-side (API handles paging)
- **Page size options:** 20, 50, 100 (default: 20)
- **Display:** "Hiển thị X–Y trong tổng Z bản ghi"
- **State:** `page` and `pageSize` in URL query params for shareable links
- **Component:** Shared pagination component or AG Grid built-in

### 2.8 Notifications / Toast

| Event | Type | Message |
|-------|------|---------|
| Tạo NCC thành công | success | "Đã tạo nhà cung cấp" |
| Cập nhật NCC thành công | success | "Đã cập nhật nhà cung cấp" |
| Xóa NCC thành công | success | "Đã xóa nhà cung cấp" |
| Ngừng sử dụng thành công | success | "Đã ngừng sử dụng nhà cung cấp" |
| Kích hoạt lại thành công | success | "Đã kích hoạt nhà cung cấp" |
| Xuất Excel thành công | success | "Đã xuất danh sách" |
| Lỗi API có message | error | message từ AppError |
| Lỗi API không xác định | error | "Có lỗi xảy ra" |
| Xóa NCC đã có phát sinh | error | "Nhà cung cấp đã có phát sinh, không thể xóa" |

---

## 3. Component Design

### 3.1 Component Tree

```
SupplierListPage (page)
├── PermissionGuard
├── PageHeader
│   └── SupplierActionBar
│       ├── UtilityDropdown (Tiện ích)
│       └── <Can> AddButton
├── SupplierFilters (Card)
│   └── GridToolbar (search)
├── SupplierTable (Card)
│   └── DataGrid<SupplierListItem>
│       └── SupplierRowActions (▼ per row)
├── PaginationBar
├── SupplierFormDialog (modal — create + edit)
│   └── SupplierForm
└── DeleteConfirmDialog

SupplierDetailPage (page)
├── PermissionGuard
├── DetailHeader
├── SupplierInfoCard
└── [Later] SupplierTabs
```

### 3.2 Component Responsibilities

| Component | Responsibility | Props In | Events Out |
|-----------|---------------|----------|-----------|
| SupplierListPage | Page state orchestration (search, page, modals) | — | — |
| SupplierTable | Render AG Grid, column definitions | rows, isLoading, error, onRetry | onRowClick, onEdit, onDelete, onToggleActive |
| SupplierRowActions | Per-row ▼ dropdown menu | supplier (row data), permissions | onEdit, onDelete, onToggleActive |
| SupplierFormDialog | Dialog wrapper for create/edit | open, supplier? (for edit), onClose | onSuccess |
| SupplierForm | RHF form with Zod validation | defaultValues, isSubmitting, mode, onSubmit, onCancel, onSaveAndAdd | — |
| DeleteConfirmDialog | Confirm delete with supplier name | open, supplierName, isDeleting, onConfirm, onCancel | — |
| UtilityDropdown | Tiện ích menu | permissions | onExport |
| PaginationBar | Page controls | page, pageSize, total, onPageChange, onPageSizeChange | — |
| SupplierDetailPage | Display full supplier info | id (from route params) | — |

### 3.3 Props & Events

| Component | Props | Events |
|-----------|-------|--------|
| SupplierTable | `rows: SupplierListItem[] \| undefined`, `isLoading: boolean`, `error: unknown`, `onRetry: () => void` | `onEdit: (id: string) => void`, `onDelete: (id: string) => void`, `onToggleActive: (id: string, current: boolean) => void` |
| SupplierFormDialog | `open: boolean`, `supplierId?: string`, `onOpenChange: (open: boolean) => void` | — |
| DeleteConfirmDialog | `open: boolean`, `supplier: SupplierListItem \| null`, `isDeleting: boolean` | `onConfirm: () => void`, `onCancel: () => void` |
| PaginationBar | `page: number`, `pageSize: number`, `total: number` | `onPageChange: (page: number) => void`, `onPageSizeChange: (size: number) => void` |

---

## 4. Frontend Data Model (TypeScript)

### 4.1 List Item Type

```typescript
// Used in AG Grid rows
export interface SupplierListItem {
  id: string;
  code: string;
  name: string;
  taxCode?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
}
```

### 4.2 Detail Type

```typescript
// Used in detail page
export interface SupplierDetail extends SupplierListItem {
  createdAt: string;
  updatedAt: string;
  // [Q1 - if Tổ chức/Cá nhân confirmed]:
  // supplierType?: 'organization' | 'individual';
  // contactName?: string | null;
  // contactPhone?: string | null;
  // contactEmail?: string | null;
  // website?: string | null;
}
```

### 4.3 Query Params

```typescript
export interface SupplierListQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
```

### 4.4 Create Request

```typescript
export interface CreateSupplierRequest {
  code: string;           // required, max 32
  name: string;           // required, max 255
  taxCode?: string;       // optional, max 32
  email?: string;         // optional, valid email
  phone?: string;         // optional, max 32
  address?: string;       // optional, max 500
  isActive?: boolean;     // default true (hidden field)
}
```

### 4.5 Update Request

```typescript
export type UpdateSupplierRequest = Partial<CreateSupplierRequest>;
```

### 4.6 Summary Type (if Q2 confirmed)

```typescript
export interface SupplierSummary {
  totalPayable: number;       // Tổng nợ phải trả
  totalPurchaseValue: number; // Tổng giá trị mua hàng
  inactiveCount: number;      // Số NCC ngừng sử dụng
}
```

### 4.7 Enum Types

```typescript
export type SupplierSortField = 'code' | 'name' | 'createdAt';
// [Q1] export type SupplierType = 'organization' | 'individual';
```

---

## 5. Frontend API Needs (Final — from A8)

| UI Action | Required By | Method | Endpoint (expected) | Request | Response |
|-----------|------------|--------|---------------------|---------|----------|
| Load supplier list | All sources | GET | /api/suppliers | SupplierListQuery | PageResult\<SupplierListItem\> |
| Load supplier detail | Detail page | GET | /api/suppliers/{id} | — | SupplierDetail |
| Create supplier | Create dialog | POST | /api/suppliers | CreateSupplierRequest | SupplierDetail |
| Update supplier | Edit dialog | PUT | /api/suppliers/{id} | UpdateSupplierRequest | SupplierDetail |
| Delete supplier | Delete dialog | DELETE | /api/suppliers/{id} | — | void / 409 if has transactions |
| Toggle active/inactive | Row action | PATCH | /api/suppliers/{id}/toggle-active | — | { isActive: boolean } |
| Export Excel | Tiện ích | GET | /api/suppliers/export | SupplierListQuery | Blob (.xlsx) |
| [Q2] Summary stats | Metric cards | GET | /api/suppliers/summary | — | SupplierSummary |

---

## 6. State Management

### 6.1 URL / Query State

Persist in URL search params để shareable links hoạt động:
- `search` — keyword tìm kiếm
- `page` — trang hiện tại (default: 1)
- `pageSize` — số dòng/trang (default: 20)
- `sortBy` — cột sort (default: none)
- `sortDir` — hướng sort: `asc` | `desc`
- `isActive` — filter trạng thái (default: all)

### 6.2 UI State

```typescript
// Local state trong SupplierListPage
const [editSupplierId, setEditSupplierId] = useState<string | null>(null);
const [deletingSupplier, setDeletingSupplier] = useState<SupplierListItem | null>(null);
const [createOpen, setCreateOpen] = useState(false);
```

### 6.3 Server State (React Query)

| Query | Key | Stale Time |
|-------|-----|-----------|
| List | `['suppliers', 'list', tenantId, query]` | 30s |
| Detail | `['suppliers', 'detail', tenantId, id]` | 60s |
| Summary | `['suppliers', 'summary', tenantId]` | 60s |

**Invalidation rules:**
- Create/Update/Delete/ToggleActive → invalidate `['suppliers', 'list', tenantId]` + detail if applicable
- Tenant switch → all supplier queries auto-invalidate (tenantId in key)

### 6.4 Permission State

```typescript
const { can } = usePermissions();
const canCreate = can(PERMISSIONS.Suppliers.Create);
const canUpdate = can(PERMISSIONS.Suppliers.Update);
const canDelete = can(PERMISSIONS.Suppliers.Delete);
const canExport = can(PERMISSIONS.Suppliers.Export); // new permission to add
```

---

## 7. User Interaction

### 7.1 Load List
1. Page mount → PermissionGuard checks `suppliers.read`
2. `useSuppliers(query)` fires GET /api/suppliers with default params
3. Grid shows skeleton loading → data renders on success → empty state if empty

### 7.2 Search
1. User types in GridToolbar search input
2. 300ms debounce → `search` state updates → `useSuppliers({ search })` re-runs
3. Grid refreshes with filtered results; page resets to 1

### 7.3 Filter (isActive tab)
1. User selects "Hoạt động" / "Ngừng" / "Tất cả"
2. `isActive` query param updates → list re-fetches with filter
3. Grid refreshes

### 7.4 Sort
1. User clicks column header in AG Grid
2. AG Grid fires sort event → `sortBy` + `sortDir` state updates
3. Re-fetch with new sort params

### 7.5 Pagination
1. User clicks Prev/Next or changes page size
2. `page` / `pageSize` URL params update
3. List re-fetches; grid scrolls to top

### 7.6 Add New
1. User clicks "Thêm nhà cung cấp" (permission: `suppliers.create`)
2. Create dialog opens with empty form
3. User fills fields → validate on submit → POST /api/suppliers
4. Success: toast "Đã tạo nhà cung cấp", dialog closes, list invalidates
5. "Cất và Thêm": success + form resets for next entry (dialog stays open)
6. Error: toast error message, dialog stays open

### 7.7 Edit
1. User opens row ▼ menu → clicks "Sửa" (permission: `suppliers.update`)
2. Edit dialog opens with `supplierId` → `useSupplier(id)` fetches current data → form pre-fills
3. User edits → validate → PUT /api/suppliers/{id}
4. Success: toast "Đã cập nhật", dialog closes, list + detail queries invalidated

### 7.8 Toggle Active/Inactive
1. User opens row ▼ menu → "Ngừng sử dụng" / "Sử dụng" (permission: `suppliers.update`)
2. PATCH /api/suppliers/{id}/toggle-active
3. Success: toast message, list query invalidated → row updates status badge

### 7.9 Delete Single
1. User opens row ▼ menu → "Xóa" (permission: `suppliers.delete`)
2. `DeleteConfirmDialog` opens showing supplier name: "Bạn có chắc muốn xóa Nhà cung cấp {name}?"
3. Confirm → DELETE /api/suppliers/{id}
4. Success: toast "Đã xóa nhà cung cấp", dialog closes, list invalidated
5. Error (409 — has transactions): toast "Nhà cung cấp đã có phát sinh, không thể xóa"

### 7.10 View Detail
1. User clicks supplier name in grid (Textlink)
2. Navigate to `/suppliers/{id}`
3. SupplierDetailPage loads: `useSupplier(id)` fetches data
4. Info card renders; back button returns to list

### 7.11 Export Excel
1. User opens Tiện ích ▼ → "Xuất ra Excel" (permission: `suppliers.export`)
2. GET /api/suppliers/export with current search/filter params
3. Browser downloads .xlsx file
4. Toast: "Đã xuất danh sách"

---

## 8. Validation Rules (Frontend)

| Field | Rule | Message | Source |
|-------|------|---------|--------|
| code | Required | "Mã nhà cung cấp là bắt buộc" | SCR-1 |
| code | Max 32 chars | "Mã nhà cung cấp không quá 32 ký tự" | SCR-1 |
| name | Required | "Tên nhà cung cấp là bắt buộc" | SCR-1 |
| name | Max 255 chars | "Tên nhà cung cấp không quá 255 ký tự" | SCR-1 |
| taxCode | Max 32 chars (optional) | "Mã số thuế không quá 32 ký tự" | SCR-1 |
| email | Valid email format (optional) | "Email không hợp lệ" | SCR-1 |
| phone | Max 32 chars (optional) | "Số điện thoại không quá 32 ký tự" | SCR-1 |
| address | Max 500 chars (optional) | "Địa chỉ không quá 500 ký tự" | SCR-1 |

**Note:** Empty string (`""`) for optional fields treated as `undefined` by Zod `.or(z.literal(""))` — existing schema is correct.

---

## 9. Permission Rules

| Action | Required Permission | UI Behavior if Missing |
|--------|---------------------|------------------------|
| View list page | `suppliers.read` | PermissionGuard → redirect to /dashboard |
| Add new supplier | `suppliers.create` | "Thêm nhà cung cấp" button hidden |
| Edit supplier | `suppliers.update` | "Sửa" option hidden in row action menu |
| Toggle active | `suppliers.update` | "Ngừng sử dụng"/"Sử dụng" hidden in row menu |
| Delete supplier | `suppliers.delete` | "Xóa" option hidden in row action menu |
| Export Excel | `suppliers.export` | "Xuất ra Excel" option hidden in Tiện ích menu |
| View detail page | `suppliers.read` | Same as list page access |

**New permission to add:** `suppliers.export` → add to `src/config/permissions.ts` and `src/Shared/Constants/Permissions.cs`

---

## 10. Multi-tenant Rules

- `tenantId` lấy từ `useTenantStore()` — không hard-code, không lấy từ URL
- Tất cả API calls đính kèm `X-Tenant-Id` header tự động qua Axios interceptor trong `lib/api/client.ts`
- React Query key bắt buộc chứa `tenantId`:
  ```typescript
  const KEYS = {
    all: (tenantId: string) => ['suppliers', tenantId] as const,
    list: (tenantId: string, params?: SupplierListQuery) => ['suppliers', tenantId, 'list', params ?? {}] as const,
    detail: (tenantId: string, id: string) => ['suppliers', tenantId, 'detail', id] as const,
  };
  ```
- Khi `tenantId` thay đổi (tenant switch), React Query tự invalidate tất cả supplier queries
- `useSuppliers` hook phải đọc `tenantId` từ store và đưa vào query key

> **Gap found:** Code hiện tại trong `useSuppliers.ts` không có `tenantId` trong query key. Cần fix trong Phase 7.

---

## 11. Loading / Empty / Error States

| State | Component | Behavior |
|-------|-----------|----------|
| Loading list | DataGrid skeleton | AG Grid built-in loading overlay (existing `GridLoadingState`) |
| Empty list (no records) | GridEmptyState | "Chưa có nhà cung cấp nào. Nhấn 'Thêm nhà cung cấp' để bắt đầu." |
| Empty list (search no result) | GridEmptyState | "Không tìm thấy nhà cung cấp phù hợp." |
| Error loading list | GridErrorState + Retry button | "Không thể tải danh sách. Thử lại?" + refetch() |
| Loading detail | Skeleton cards | Page-level skeleton |
| Error loading detail | Error alert | "Không thể tải thông tin nhà cung cấp." |
| Delete loading | Button spinner | "Đang xóa..." disabled state |
| Submit form loading | Button spinner | "Đang lưu..." disabled state |
| No permission | PermissionGuard redirect | Redirect to /dashboard |

---

## 12. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (≥1280px) | Full table, all columns visible, dialog centered |
| Tablet (768-1279px) | Table scrollable horizontally; some columns hidden (email, address) |
| Mobile (<768px) | Table scrollable; minimal columns (code, name, status, action); dialog full-screen |

> Note: AG Grid handles horizontal scroll natively. Column `maxWidth` and `flex` settings control priority.

---

## 13. Acceptance Criteria

**List Screen:**
- [ ] Danh sách NCC hiển thị với AG Grid, phân trang server-side (page, pageSize từ URL)
- [ ] Tìm kiếm theo keyword (debounce 300ms) lọc theo tên hoặc mã
- [ ] Cột Trạng thái hiển thị "Hoạt động" / "Ngừng" (transform tại FE)
- [ ] Người dùng không có `suppliers.read` bị redirect về /dashboard
- [ ] Loading state hiển thị skeleton khi đang tải
- [ ] Empty state hiển thị khi không có kết quả
- [ ] Error state hiển thị với nút Retry khi API lỗi

**Create:**
- [ ] Nút "Thêm nhà cung cấp" chỉ hiện khi có `suppliers.create`
- [ ] Dialog mở với form trống
- [ ] Submit validate Zod; hiển thị inline error messages
- [ ] Thành công: toast + dialog đóng + list làm mới
- [ ] "Cất và Thêm": thành công + form reset + dialog giữ mở
- [ ] Lỗi API: toast error; dialog giữ mở, dữ liệu không mất

**Edit:**
- [ ] "Sửa" chỉ hiện trong row menu khi có `suppliers.update`
- [ ] Dialog mở với dữ liệu NCC đã fill sẵn
- [ ] Submit cập nhật + toast + list làm mới

**Delete:**
- [ ] "Xóa" chỉ hiện khi có `suppliers.delete`
- [ ] Confirm dialog hiển thị tên NCC
- [ ] Thành công: toast + list làm mới
- [ ] NCC có phát sinh: toast error message từ BE

**Toggle Active:**
- [ ] Row menu hiện "Ngừng sử dụng" khi NCC đang active; "Sử dụng" khi đang ngừng
- [ ] Toggle chỉ hiện khi có `suppliers.update`
- [ ] Thành công: toast + row cập nhật trạng thái

**Export:**
- [ ] "Xuất ra Excel" chỉ hiện khi có `suppliers.export`
- [ ] Trigger download file .xlsx
- [ ] Export theo search/filter hiện tại

**Multi-tenant:**
- [ ] Query key chứa tenantId
- [ ] Chuyển tenant → list tự làm mới

---

## 14. Open Questions

| # | Question | Context | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------|---------------------|------------------------------|
| Q1 | Có implement Tổ chức / Cá nhân type không? | Ảnh hưởng DB schema — nếu chưa add sẽ cần migration sau | A: Yes (full type distinction) / B: No (single form, add supplierType field optional) / C: Later | B (Later — add `supplierType` nullable field, không đổi form) | No |
| Q2 | Metric cards (Tổng nợ, Tổng mua hàng, Số NCC ngừng) có cần không? | Cần aggregation API từ backend | A: Yes (cần BE endpoint `/api/suppliers/summary`) / B: No | No (Defer) | No |
| Q3 | Trang chi tiết NCC (`/suppliers/{id}`) có implement trong Phase 7 không? | Hiện tại chỉ có list + create | A: Yes (basic info only) / B: No / C: Yes (full with transaction tabs) | A (Yes — basic info only) | No |
| Q4 | Province filter có cần không? | Cần danh mục tỉnh/thành phố riêng | A: Yes / B: No | No (Defer) | No |
| Q5 | Import Excel có nằm trong Phase 7 không? | 4-step wizard, phức tạp đáng kể | A: Yes / B: No | No (Defer to later phase) | No |
| Q6 | "Là khách hàng" và các advanced form fields có trong scope Phase 7? | Cross-entity sync cần careful planning | A: Yes / B: No | No (Defer) | No |
| Q7 | `suppliers.export` permission — thêm mới hay không cần permission? | Hiện tại chưa có trong permissions.ts | A: Add permission / B: No permission check (anyone with read can export) | A (Add permission) | Yes — affects Phase 2 |
| Q8 | pageSize default: 20 hay khác? | Reference UI mặc định 100, nhưng 100 là nhiều với mobile | A: 20 / B: 50 / C: 100 | A (20) | No |
| Q9 | Toggle active endpoint: PATCH `/toggle-active` hay PUT với full body? | API design choice | A: PATCH /toggle-active / B: PUT /{id} với isActive field | A (PATCH /toggle-active — clean intent) | Yes — affects Phase 2 |
