# Frontend UI Pixel Analysis: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

## 1. Feature Config Summary

| Field | Value |
|---|---|
| Feature | danh-muc-nha-cung-cap |
| Name VI | Danh mục nhà cung cấp |
| Table library | AG Grid |
| Visual review | Strict |
| Cost mode | Concise |

## 2. Screenshot Inventory

| Image | Type | Purpose | Notes |
|---|---|---|---|
| danhmuc_nhacungcap_list.png | Current UI | Main list page — default state | Primary layout reference |
| danhmuc_nhacungcap_list_menu_chucnang.png | Current UI | Row context menu | 5-item dropdown |
| danhmuc_nhacungcap_them_canhan.png | Current UI | Add modal — Cá nhân tab | Multi-tab form |
| danhmuc_nhacungcap_them_tochuc.png | Current UI | Add modal — Tổ chức tab | Same modal, different fields |
| danhmuc_nhacungcap_xoa.png | Current UI | Delete confirmation dialog | Simple confirm modal |
| danhmuc_nhacungcap_xacnhandiachiNCC.png | Current UI | Update address confirmation | Full-screen modal with table |
| danhmuc_nhacungcap_detail.png | Current UI | Supplier detail / ledger view | Master-detail split layout |
| danhmuc_nhacungcap_import_excel.png | Current UI | Import Excel wizard — Step 1 | **Deferred** — out of MVP scope |

## 3. Visual Source Priority

| Source | Priority | Usage |
|---|---:|---|
| Current UI images | 1 | Main source for pixel implementation |
| Reference UI images | 2 | Not available — skip |
| Reference markdown | 3 | Business behavior only |

## 4. Layout Measurements

| Area | Est. Width | Est. Height | Padding | Notes |
|---|---:|---:|---|---|
| Viewport (full) | 1280px+ | 100vh | — | Responsive min-width 1024px |
| App sidebar (nav) | ~220px | 100vh | 0 | Dark navy bg, icon+text |
| Main content area | calc(100% - 220px) | 100vh | 16px 24px | White bg |
| Page header / breadcrumb | 100% | ~40px | 0 16px | Inline with global topbar |
| Summary cards row | 100% | ~80px | 0 0 12px | 2+ cards, gap ~12px |
| Summary card | ~50% | ~72px | 12px 16px | White bg, border, radius 8px |
| Toolbar | 100% | ~40px | 0 0 8px | Flex row, space-between |
| Search input | ~280px | ~32px | 8px 12px | Left of toolbar |
| Icon button (filter/export) | ~32px | ~32px | 6px | Square |
| AG Grid container | 100% | flex-fill | — | Fills remaining height |
| AG Grid header row | 100% | ~36px | 0 8px | Light gray bg |
| AG Grid data row | 100% | ~36px | 0 8px | Alternating rows |
| Pagination bar | 100% | ~40px | 8px 0 | Below grid |
| Add/Edit modal | ~820px | auto (max 90vh) | 24px | Centered overlay |
| Delete confirm modal | ~420px | auto | 24px | Centered |
| Address update modal | ~90vw | ~85vh | 24px | Near full-screen |

## 5. Design Tokens

| Token Name | Value | Usage | Source | Confidence |
|---|---|---|---|---|
| page-bg | #F5F6FA | Main content bg | list screenshot | High |
| card-bg | #FFFFFF | Summary cards, modal | list screenshot | High |
| border-color | #E0E3E9 | Card borders, input borders | list screenshot | High |
| primary-color | #1E88E5 | Primary buttons, active links | add modal button | Medium |
| success-color | #43A047 | "Thêm" split button | toolbar | Medium |
| danger-color | #E53935 | Delete action, error text | delete dialog | Medium |
| text-primary | #212121 | Main body text, labels | all screens | High |
| text-secondary | #616161 | Secondary labels, metadata | list screenshot | Medium |
| text-muted | #9E9E9E | Placeholder text, hints | add modal | Medium |
| table-header-bg | #F0F2F5 | AG Grid header row | list screenshot | High |
| table-row-bg | #FFFFFF | Default row bg | list screenshot | High |
| table-row-alt-bg | #FAFBFC | Alternating row bg | list screenshot | Medium |
| table-row-selected | #E3F2FD | Selected/checked row | assumption | Low |
| toolbar-height | 40px | Toolbar component | list screenshot | High |
| input-height | 32px | Search, form inputs | list/modal | High |
| button-height | 32px | Toolbar buttons | list screenshot | High |
| modal-radius | 8px | Modal border-radius | add modal | Medium |
| card-radius | 8px | Summary card radius | list screenshot | Medium |
| icon-size | 16px | Toolbar icons | list screenshot | Medium |
| sidebar-width | 220px | Left nav | list screenshot | Medium |
| page-padding | 16px 24px | Content area padding | list screenshot | Medium |
| grid-row-height | 36px | AG Grid rowHeight prop | list screenshot | High |

## 6. Typography Specification

| Element | Font Size | Font Weight | Color | Notes |
|---|---:|---:|---|---|
| Page title | 16px | 600 | #212121 | Feature name in topbar |
| Breadcrumb | 13px | 400 | #616161 | Path segments |
| Summary card label | 13px | 500 | #616161 | Above the value |
| Summary card value | 20px | 700 | #212121 | Large number |
| Toolbar button text | 13px | 500 | #212121 | Text buttons |
| Input placeholder | 13px | 400 | #9E9E9E | Search placeholder |
| Input text | 13px | 400 | #212121 | Typed text |
| AG Grid header text | 13px | 600 | #424242 | Column headers |
| AG Grid cell text | 13px | 400 | #212121 | Default rows |
| AG Grid money cell | 13px | 400 | #212121 | Right-aligned |
| Pagination text | 13px | 400 | #616161 | "100 bản ghi / trang" |
| Modal title | 16px | 600 | #212121 | Dialog heading |
| Form label | 13px | 500 | #424242 | Field labels |
| Form input text | 13px | 400 | #212121 | Field values |
| Tab label | 13px | 500 | #424242 / primary | Active vs inactive |

## 7. Component Measurement Specification

| Component | Height | Width | Padding | Gap | Radius | Notes |
|---|---:|---:|---|---:|---:|---|
| Summary Card | 72px | flex-1 | 12px 16px | — | 8px | min 2 cards |
| Toolbar | 40px | 100% | 0 | 8px | — | flex row |
| Search Input | 32px | 280px | 8px 12px | — | 4px | with search icon |
| Icon Button | 32px | 32px | 6px | — | 4px | filter, export |
| Text Button | 32px | auto | 8px 16px | — | 4px | Cập nhật địa chỉ, Tiện ích |
| Split Button | 32px | auto | 8px 16px | — | 4px | Thêm + chevron |
| AG Grid Row | 36px | 100% | 0 8px | — | — | rowHeight config |
| AG Grid Header | 36px | 100% | 0 8px | — | — | headerHeight config |
| Pagination | 40px | 100% | 8px 16px | 8px | — | page-size selector |
| Add/Edit Modal | auto | 820px | 24px | 16px | 8px | max-height 90vh |
| Modal Tab | 36px | auto | 0 16px | — | — | bottom tabs in form |
| Delete Modal | auto | 420px | 24px | 16px | 8px | simple confirm |
| Address Modal | 85vh | 90vw | 24px | 16px | 8px | full-screen table |
| Row Context Menu | auto | 160px | 6px 12px | — | 4px | 5 items |
| Type Selector Tab | 36px | auto | 0 20px | — | — | Cá nhân / Tổ chức |

## 8. Grid / Table Specification

### Main Supplier List Grid

| Column | Est. Width | Alignment | Header Text | Cell Behavior | Notes |
|---|---:|---|---|---|---|
| Checkbox | 40px | center | — | Row select | Sticky left |
| STT | 48px | center | # / STT | Auto-number | — |
| Mã NCC | 100px | left | Mã | Monospace, ellipsis | — |
| Tên nhà cung cấp | flex (~300px) | left | Tên nhà cung cấp | Ellipsis, clickable | Opens detail |
| Nhóm | 120px | left | Nhóm | Ellipsis | — |
| Điện thoại | 130px | left | Điện thoại | — | — |
| Địa chỉ | flex (~200px) | left | Địa chỉ | Ellipsis | — |
| Nợ cần trả | 140px | right | Nợ cần trả | Money format | Red if negative |
| Trả trước | 140px | right | Trả trước / Ứng trước | Money format | — |
| Trạng thái | 100px | center | Trạng thái | Badge/chip | Đang sử dụng / Ngừng |
| Hành động | 60px | center | — | Icon button (⋮) | Opens context menu |

### Address Update Modal Grid

| Column | Est. Width | Alignment | Header | Notes |
|---|---:|---|---|---|
| Tên nhà cung cấp | flex | left | Tên nhà cung cấp | — |
| Mã số thuế | 140px | left | Mã số thuế | — |
| Địa chỉ cũ | flex | left | Địa chỉ cũ | — |
| Địa chỉ mới | flex | left | Địa chỉ mới | — |

### Detail / Ledger Grid (in detail panel)

| Column | Est. Width | Alignment | Header | Notes |
|---|---:|---|---|---|
| # | 40px | center | # | STT |
| Loại | 100px | left | Loại | Voucher type |
| Ngày hạch toán | 120px | left | Ngày hạch toán | Date |
| Số chứng từ | 120px | left | Số chứng từ | Clickable link |
| GPN | 120px | left | GPN | — |
| Ngày hạch toán 2 | 120px | left | Ngày hạch toán | — |
| Số hóa đơn | 120px | left | Số hóa đơn | — |
| Chú thích | flex | left | Chú thích | Ellipsis |

## 9. Interaction Visual States

| Element | State | Expected Visual | Source | Notes |
|---|---|---|---|---|
| AG Grid row | Hover | Light blue tint bg | assumption | Standard AG Grid |
| AG Grid row | Selected | Blue-tinted bg (#E3F2FD) | assumption | Row click |
| AG Grid row | Checkbox checked | Checkbox filled, row highlight | list screenshot | Bulk select |
| Toolbar button | Hover | Bg #F5F5F5, slight shadow | assumption | Standard |
| Toolbar button | Disabled | Opacity 0.4 | assumption | Permission guard |
| Search input | Focus | Border #1E88E5, shadow | assumption | Standard |
| "Thêm" button | Hover | Darker green | assumption | — |
| Modal tab | Active | Underline + primary color text | add modal | — |
| Modal tab | Inactive | #616161 text, no underline | add modal | — |
| Type selector | Active | Bold + primary underline | add modal | Cá nhân / Tổ chức |
| Context menu item | Hover | #F5F5F5 bg | assumption | — |
| "Ngừng sử dụng" item | Default | Red text | assumption | Destructive action |
| Status badge (active) | Default | Green bg + text | assumption | "Đang sử dụng" |
| Status badge (inactive) | Default | Gray bg + text | assumption | "Ngừng sử dụng" |
| Loading | Skeleton | AG Grid skeleton rows | assumption | TanStack Query |
| Empty state | No data | AG Grid default empty | assumption | — |

## 10. Pixel-perfect Implementation Rules

- Use `rowHeight: 36` and `headerHeight: 36` in AG Grid config.
- Apply design token `table-header-bg` (#F0F2F5) to AG Grid header via `ag-header-row` CSS.
- Summary cards must use `flex: 1` with `min-width: 200px`; do not hard-code widths.
- Toolbar must be flex row with `gap: 8px`; search input pinned left, buttons pinned right via `marginLeft: auto`.
- Modal widths: add/edit = 820px max, delete = 420px, address update = 90vw.
- Money columns: right-align text, use Vietnamese locale formatting (`1.234.567,89`).
- Do not add box shadows to cards unless visible in screenshots.
- Tab bar in add/edit modal is at the bottom of the form section, not at the top of the modal.
- "Thêm" is a split button (primary action + chevron dropdown) — do not render as single button.
- The type selector (Cá nhân / Tổ chức) is a tab at the top of the form, separate from the bottom form tabs.

## 11. Pixel Review Checklist

| # | Item | Check |
|---:|---|---|
| 1 | Sidebar width matches ~220px | [ ] |
| 2 | Summary cards row height ~72px | [ ] |
| 3 | Toolbar height 40px | [ ] |
| 4 | Search input width ~280px, height 32px | [ ] |
| 5 | AG Grid rowHeight=36, headerHeight=36 | [ ] |
| 6 | AG Grid header bg #F0F2F5 | [ ] |
| 7 | Money columns right-aligned | [ ] |
| 8 | Vietnamese number format applied | [ ] |
| 9 | Add modal width 820px max | [ ] |
| 10 | Type selector tab at top of modal form | [ ] |
| 11 | Form tabs at bottom of form area | [ ] |
| 12 | "Thêm" rendered as split button | [ ] |
| 13 | Status badges — green/gray | [ ] |
| 14 | Delete dialog width 420px | [ ] |
| 15 | Address modal 90vw × 85vh | [ ] |

## 12. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P2-Q1 | Exact primary color hex (appears teal-blue in some screens, pure blue in others) | No | Use #1E88E5 as default; verify in Phase 9 |
| P2-Q2 | Exact number of summary cards and their labels (only 2 visible, labels cut off) | No | Assume: Nợ cần trả total + Trả trước total |
| P2-Q3 | Whether detail view is a split-panel (master-detail) or a separate page route | No | From screenshot appears split-panel; clarify in Phase 5 |
| P2-A1 | Alternating row color assumed #FAFBFC — not pixel-verified | No | Apply default; check in Phase 9 |
| P2-A2 | Import Excel screen included in inventory but is deferred scope — pixel spec not extracted | No | No action needed for MVP |

## 13. Definition of Done

- [x] All 8 screenshots inventoried
- [x] Layout measurements documented for all visible areas
- [x] Design tokens extracted with confidence ratings
- [x] Typography specified for all text elements
- [x] Component measurements specified
- [x] AG Grid columns specified for main list and detail grids
- [x] Interaction states documented (assumptions marked)
- [x] Pixel-perfect rules defined for Phase 8
- [x] Pixel review checklist ready for Phase 9
- [x] Unclear items logged (no blocking items)
