# Frontend UI Pixel Analysis: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Feature Config Summary
- feature: `danh-muc-nha-cung-cap` | visual_review: `strict` | level: `standard`
- Sources: 1 current UI image + 8 reference UI images | No actual AccountingMini screenshots yet
- Note: Current UI image = MISA reference screenshot (no AccountingMini-specific design exists)

## 2. Screenshot Inventory

| Image | Type | Purpose | Notes |
|---|---|---|---|
| images/danhmuc_nhacungcap_list.png | Current UI | Main list page (main source) | MISA app, same content as ref below |
| references/images/danhmuc_nhacungcap_list.png | Reference UI | Full MISA app with sidebar + full toolbar | Same screen, higher fidelity view |
| references/images/danhmuc_nhacungcap_list_menu_chucnang.png | Reference UI | Row action ▼ dropdown open | Sửa / Nhân bản / Ngừng sử dụng / Xóa |
| references/images/danhmuc_nhacungcap_them_tochuc.png | Reference UI | Create/Edit dialog — Tổ chức tab | Form layout, tabs, sub-tabs, buttons |
| references/images/danhmuc_nhacungcap_them_canhan.png | Reference UI | Create/Edit dialog — Cá nhân tab | Deferred per Phase 1 |
| references/images/danhmuc_nhacungcap_xoa.png | Reference UI | Delete confirm dialog | Small centered dialog, warning message |
| references/images/danhmuc_nhacungcap_xacnhandiachiNCC.png | Reference UI | Bulk address update dialog | Wide dialog with NCC table inside |
| references/images/danhmuc_nhacungcap_detail.png | Reference UI | Detail: master-detail layout (MISA) | Left list + right panel; AccountingMini uses separate route |

## 3. Visual Source Priority

| Source | Priority | Usage |
|---|---:|---|
| Current UI images | 1 | Main source for pixel implementation |
| Reference UI images | 2 | UX/reference patterns only |
| Reference markdown | 3 | Business behavior, not pixel values |

All measurements are estimates (Medium confidence) unless noted — no actual AccountingMini UI exists yet.

## 4. Layout Measurements

| Area | Est. Width | Est. Height | Padding | Notes |
|---|---:|---:|---|---|
| Page content area | 100% | 100vh | px-6 py-4 | Inside AppShell content wrapper |
| Page header row | 100% | 40px | pb-4 | Title + breadcrumb |
| Toolbar card | 100% | 52px | px-4 py-3 | White card, full-width |
| DataGrid container | 100% | flex-1 | 0 | Fills remaining vertical space |
| Grid header row | 100% | 40px | px-3 | Sticky top |
| Grid data row | 100% | 44px | px-3 | Each row |
| Pagination bar | 100% | 44px | px-4 py-2 | White card, bottom |
| Form dialog | 720px | auto (max 90vh) | p-6 | Centered modal, scrollable content |
| Bulk address dialog | 900px | auto (max 90vh) | p-6 | Wide dialog with embedded NCC table |
| Delete confirm dialog | 400px | auto | p-6 | Small centered dialog |

## 5. Design Tokens

| Token Name | Value | Usage | Source | Confidence |
|---|---|---|---|---|
| page-bg | `bg-gray-50` / `#f5f6fa` | Page background | MISA list view | Medium |
| card-bg | `#ffffff` | Toolbar, grid, pagination card bg | All screens | High |
| border-color | `#e5e7eb` | Card borders, grid borders | Visible in all screens | Medium |
| primary-color | `#f97316` (orange-500) | "Thêm" button, active sidebar | MISA primary | Medium |
| primary-hover | `#ea580c` (orange-600) | Hover state — primary button | Assumption | Low |
| danger-color | `#ef4444` (red-500) | Negative debt value, delete icon | Negative debt visible | High |
| text-primary | `#111827` | Page title, grid cell text | Dark text visible | Medium |
| text-secondary | `#6b7280` | Secondary labels, placeholder | Gray text visible | Medium |
| text-link | `#2563eb` (blue-600) | "Lập CT mua hàng" textlink | Blue link visible in grid | Medium |
| table-header-bg | `#f9fafb` | Grid header row background | Light gray header | Medium |
| table-row-hover | `#f3f4f6` | Row hover state | Standard | Low |
| table-selected-row | `#eff6ff` | Selected/active row | Assumption | Low |
| button-height | `32px` | All toolbar buttons | MISA toolbar | Medium |
| input-height | `32px` | Search input, form inputs | Visible | Medium |
| toolbar-height | `52px` | Toolbar card total height | Estimate | Low |
| grid-header-height | `40px` | Grid column header row | Estimate | Low |
| grid-row-height | `44px` | Each data row | Estimate | Low |
| page-padding-x | `24px` (px-6) | Horizontal page padding | Estimate | Low |
| card-padding | `16px` (p-4) | Card internal padding | Estimate | Low |
| border-radius-card | `8px` | Card/panel corners | Standard | Low |
| border-radius-btn | `4px` | Button corners | MISA buttons | Medium |
| icon-size | `16px` | Action icons, chevron ▼ | Standard | Medium |
| dialog-overlay | `rgba(0,0,0,0.5)` | Modal backdrop | Standard | Low |

## 6. Typography Specification

| Element | Font Size | Font Weight | Color | Notes |
|---|---:|---:|---|---|
| Page title | 18px | 600 | text-primary | "Danh sách nhà cung cấp" |
| Breadcrumb | 12px | 400 | text-secondary | "Danh mục / Nhà cung cấp" |
| Toolbar button text | 13px | 500 | white or text-primary | Depends on variant |
| Search input placeholder | 13px | 400 | text-secondary | "Tìm kiếm…" |
| Grid header text | 12px | 600 | text-primary | Normal case (not uppercase) |
| Grid cell text | 13px | 400 | text-primary | Regular data |
| Grid cell — negative debt | 13px | 400 | danger-color | `(40,602)` red parentheses |
| Grid textlink | 13px | 400 | text-link | "Lập CT mua hàng" |
| Pagination text | 12px | 400 | text-secondary | "365 bản ghi / 20 mỗi trang" |
| Dialog title | 16px | 600 | text-primary | Modal header |
| Form label | 13px | 500 | text-primary | Field labels |
| Form input text | 13px | 400 | text-primary | Input values |

## 7. Component Measurement Specification

| Component | Height | Width | Padding | Radius | Notes |
|---|---:|---:|---|---:|---|
| PageHeader | 40px | 100% | pb-4 | — | Title left, breadcrumb above |
| ToolbarCard | 52px | 100% | px-4 py-3 | 8px | White card wrapping toolbar row |
| SearchInput | 32px | 240px | px-3 | 4px | Debounce 300ms |
| isActiveDropdown | 32px | 140px | px-3 | 4px | Radix Select; "Tất cả/Đang dùng/Ngừng" |
| ExportDropdown | 32px | auto | px-3 | 4px | "Tiện ích ▼" secondary button |
| Button (primary) | 32px | auto | px-4 | 4px | Orange bg, white text — "Thêm" |
| Button (secondary) | 32px | auto | px-4 | 4px | Outline border variant |
| DataGrid | flex-1 | 100% | 0 | 0 | `<DataGrid>` component |
| GridHeaderRow | 40px | 100% | px-3 | 0 | Sticky, `headerHeight={40}` |
| GridDataRow | 44px | 100% | px-3 | 0 | `rowHeight={44}` |
| PaginationBar | 44px | 100% | px-4 py-2 | 8px | White card bottom |
| FormDialog | auto | 720px | p-6 | 12px | Centered modal |
| BulkAddressDialog | auto | 900px | p-6 | 12px | Wider — embedded NCC table |
| DeleteDialog | auto | 400px | p-6 | 12px | Small confirm |

## 8. Grid / Table Specification

| Column | Est. Width | Alignment | Header Text | Cell Behavior | Notes |
|---|---:|---|---|---|---|
| Mã nhà cung cấp | 120px | left | Mã nhà cung cấp | ellipsis | Sortable; `sortBy=code` |
| Tên nhà cung cấp | 200px | left | Tên nhà cung cấp | ellipsis | Sortable; `sortBy=name` |
| Địa chỉ | 180px | left | Địa chỉ | ellipsis | Not sortable |
| Số điện thoại | 110px | left | Số điện thoại | ellipsis | Not sortable |
| Nợ (currentDebtAmount) | 130px | right | Nợ | numeric `(n,nnn)` red if < 0 | Sortable; `sortBy=currentDebtAmount` |
| Lập CT mua hàng | 120px | center | Lập CT mua hàng | blue textlink | Hidden when no `supplier.createPurchaseVoucher` |
| Chức năng | 80px | center | Chức năng | ▼ dropdown button | Always visible |

Notes:
- **No "Số TK NH/CCCD" column** — `bankAccount` is form-only per Phase 1 decision (not in `SupplierListItem`)
- **No "Nợ cũ" column** — deferred per Phase 1
- Total approx. width ≈ 940px → horizontal scroll on narrow viewports
- Negative `currentDebtAmount`: format as `(1,234,567)` in `danger-color`; positive: normal `1,234,567`
- Currency/number format: Vietnamese locale (comma as thousands separator, period as decimal)

## 9. Interaction Visual States

| Element | State | Expected Visual | Source | Notes |
|---|---|---|---|---|
| Grid row | hover | `table-row-hover` (`#f3f4f6`) bg | Standard | |
| Grid row | selected/active | `table-selected-row` (`#eff6ff`) | Assumption | |
| Negative Nợ cell | always | red text `(value)` with parentheses | Visible in screenshot | High |
| "Thêm" button | hover | `primary-hover` darker orange | Assumption | |
| isActive dropdown | open | Radix Select dropdown list | Standard Radix | |
| Chức năng ▼ | click | Dropdown: Sửa / Nhân bản / Ngừng sử dụng / Xóa | Visible in ref screenshot | High |
| Search input | focus | blue ring outline | Radix default | |
| Disabled row action | — | grayed out, cursor-not-allowed | Assumption | When no permission |
| Grid loading | — | `GridLoadingState` AG Grid overlay | Existing component | |
| Grid empty | — | `GridEmptyState` centered message | Existing component | |
| Delete dialog | 409 state | Error message + "Xem phát sinh" button | BA requirement | |
| Form dialog | submitting | button spinner + disabled all inputs | Standard | |
| isActive badge | isActive=false | gray/muted badge "Ngừng" | Assumption | |

## 10. Pixel-perfect Implementation Rules

During Phase 8 Frontend Coding, AI must:
- Apply design tokens from Section 5 via Tailwind classes — no inline hex values
- Negative `currentDebtAmount`: render as `(n,nnn,nnn)` string in `text-red-500`; use AG Grid `cellRenderer` or `valueFormatter`
- "Lập CT mua hàng": render as anchor/button with `text-blue-600 hover:underline` inside AG Grid cell
- `rowHeight={44}` and `headerHeight={40}` on `<DataGrid>` component
- Grid column `width` and `minWidth` from Section 8 — do not let AG Grid auto-size blindly
- Toolbar: `Card` wrapper with `flex items-center gap-2 px-4 py-3`
- isActive filter: Radix `Select` component from `src/components/ui/`
- Primary "Thêm" button: `Button` with `variant="default"` (maps to primary/orange)
- Dialog widths: use `max-w-[720px]` / `max-w-[900px]` / `max-w-[400px]` Tailwind classes
- Do not use AG Grid `AutoSizeColumns` — specify widths explicitly
- Do not add extra shadows or borders beyond what is specified here

## 11. Pixel Review Checklist

| Area | Check | Expected | Status |
|---|---|---|---|
| Page background | bg color | `bg-gray-50` | Pending |
| Page title | font size/weight | 18px / semibold | Pending |
| Toolbar | height + bg | ~52px, white card | Pending |
| Search input | width × height | 240px × 32px | Pending |
| isActive dropdown | visible + width | in toolbar, ~140px | Pending |
| "Thêm" button | color + height | orange bg, 32px | Pending |
| Export button | style | secondary/outline, 32px | Pending |
| Grid header bg | color | `bg-gray-50` / `#f9fafb` | Pending |
| Grid header height | px | ~40px | Pending |
| Grid row height | px | ~44px | Pending |
| Negative debt | color + format | red `(value)` | Pending |
| "Lập CT mua hàng" | color + style | blue textlink | Pending |
| Chức năng ▼ dropdown | items | Sửa/Nhân bản/Ngừng/Xóa | Pending |
| Column widths | Mã/Tên/Nợ | ~120/200/130px | Pending |
| Pagination position | placement | below grid, white card | Pending |
| Form dialog width | max-width | ~720px | Pending |
| Form tab bar | style | underline tabs: Tổ chức/Cá nhân | Pending |
| Form buttons | order + labels | Hủy / Cất / Cất và Thêm | Pending |
| Delete dialog width | max-width | ~400px, centered | Pending |
| Delete 409 state | error UX | message + "Xem phát sinh" button | Pending |
| Bulk address dialog | width | ~900px | Pending |

## 12. Unclear / Incomplete Items

### 1. Missing Information

| ID | Info | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
| P2-M1 | No AccountingMini-specific UI design; all measurements from MISA reference | Phase 8 pixel coding | Medium — adapt tokens to AccountingMini system | No |
| P2-M2 | Exact primary/brand color of AccountingMini not confirmed | Section 5 primary-color token | Medium — may need update during Phase 8 | No |

### 2. Unclear Requirements

| ID | Requirement | Why Unclear | Recommended Default | Required? |
|---|---|---|---|---|
| P2-U1 | "Lập CT mua hàng" textlink click target — route? | Purchase voucher create route not yet designed | `/accounting/purchase-vouchers/create?supplierId={id}` or dialog | No |

### 4. Assumptions

| ID | Assumption | Risk | Confirm? |
|---|---|---|---|
| P2-A1 | AccountingMini uses Tailwind + shadcn/Radix UI; tokens map to Tailwind classes | Low | No |
| P2-A2 | Negative debt: `(value)` parentheses + red = accounting standard convention | Low | No |
| P2-A3 | Primary orange ~#f97316 matches AccountingMini brand | Medium — brand palette not confirmed | Phase 8 |
| P2-A4 | "Số TK NH/CCCD" column NOT in grid (bankAccount is form-only per Phase 1) — divergence from MISA reference | Medium — MISA shows it in grid | Already decided |

## 13. Definition of Done
- [x] All 8 screenshots analyzed and inventoried
- [x] Visual source priority defined
- [x] Layout measurements estimated for all major areas
- [x] Design tokens extracted with confidence levels
- [x] Typography specification documented
- [x] Component measurements specified
- [x] Grid/table columns specified (widths, alignment, behavior)
- [x] Interaction visual states documented
- [x] Pixel-perfect implementation rules written
- [x] Pixel review checklist created (all items: Pending — for Phase 9)
- [x] Unclear items and assumptions documented
