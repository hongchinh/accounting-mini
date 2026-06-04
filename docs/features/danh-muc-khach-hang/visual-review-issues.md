# Visual Review Issues: Danh mục khách hàng

Feature: Danh mục khách hàng (`danh-muc-khach-hang`)
Last updated: 2026-06-04 (Phase 9)

---

## Open Issues

| ID | Severity | Area | Description | Blocks P11? | Status |
|----|----------|------|-------------|-------------|--------|
| V-M01 | Medium | Grid | Column order mismatch. Spec: Checkbox\|Mã KH\|Tên KH\|**Địa chỉ\|Công nợ\|MST\|Nhóm**\|Status. Actual: Checkbox\|#\|Mã KH\|Tên KH\|**MST\|Nhóm\|Địa chỉ\|Công nợ**\|Status. | No | Open |
| V-M02 | Medium | Grid | Extra "#" (row number) column present — not in Phase 2 spec. Affects column layout and visual weight. | No | Open |
| V-M03 | Medium | Toolbar | "Lọc" filter button absent. Filter panel not built (known omission P8-N2). Toolbar shows status filter only. | No | Open |
| V-L01 | Low | Grid | "Lập CT bán hàng" renders as link text (blue text), not a styled button cell as spec describes ("button cell renderer"). Functional but not pixel-perfect. | No | Open |
| V-L02 | Low | Modal | Modal title is "Thêm khách hàng" / "Sửa khách hàng". Spec says "Thông tin khách hàng". Context-aware title is better UX — cosmetic inconsistency with spec. | No | Open |
| V-L03 | Low | Modal | Tab label "Bổ sung" vs spec "Thông tin bổ sung". Label truncated. | No | Open |
| V-L04 | Low | Grid | Column header "Trạng thái" vs spec "Ngừng sử dụng". Content/badge behavior is correct. | No | Open |
| V-L05 | Low | Toolbar | Search placeholder "Tìm kiếm mã, tên, MST..." vs spec "Tìm theo tên khách hàng...". | No | Open |
| V-M04 | Medium | Grid | Grid header row ẩn khi không có dữ liệu — empty state component thay thế toàn bộ grid (kể cả header). Spec yêu cầu header luôn hiển thị. | No | Open |
| V-M05 | Medium | Grid | Column header và pagination footer không sticky — cuộn danh sách dài sẽ mất header/footer khỏi khung nhìn. Cả hai phải luôn visible trong viewport. | No | Open |
| V-M06 | Medium | Modal | Form add/edit bị cắt: scrollbar xuất hiện, các trường phía dưới (Email, Điện thoại liên hệ…) nằm ngoài viewport. Toàn bộ main fields phải visible mà không cần scroll — chỉ tab content area được phép scroll. | No | Open |

---

## Resolved Issues

_(None yet)_
