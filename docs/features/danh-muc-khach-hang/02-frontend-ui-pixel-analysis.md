# Frontend UI Pixel Analysis: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Feature Config Summary

| Field | Value |
|-------|-------|
| Feature | danh-muc-khach-hang |
| Name VI | Danh mục khách hàng |
| Table library | AG Grid |
| Visual review | Strict |
| Cost mode | Concise |
| Design system | Shadcn/ui + Tailwind CSS (CSS variables, HSL-based) |

---

## 2. Screenshot Inventory

| Image | Type | Purpose | Used In |
|-------|------|---------|---------|
| danh-muc-khach-hang-list.png | Current UI | Main list — full column set (updated) | Sections 4, 5, 8 |
| danh-muc-khach-hang-list-lọc.png | Current UI | List with filter panel open | Section 4, 8 |
| danh-muc-khach-hang-add(tổ chức).png | Current UI | Create modal — Tổ chức, Thông tin liên hệ tab | Sections 4, 7 |
| danh-muc-khach-hang-add(cá nhân).png | Current UI | Create modal — Cá nhân, Thông tin liên hệ tab | Sections 4, 7 |
| danh-muc-khach-hang-edit(tổ chức).png | Current UI | Edit modal — Tổ chức | Section 7 |
| danh-muc-khach-hang-edit(cá nhân).png | Current UI | Edit modal — Cá nhân | Section 7 |
| danh-muc-khach-hang-edit(cá nhân - điều khoản thanh toán).png | Current UI | Payment terms tab | Section 7 |
| danh-muc-khach-hang-edit(cá nhân - tài khoản ngân hàng).png | Current UI | Bank accounts tab | Section 7 |
| danh-muc-khach-hang-edit(cá nhân - địa chỉ).png | Current UI | Alt address tab | Section 7 |
| danh-muc-khach-hang-edit(cá nhân - ghi chú).png | Current UI | Notes tab | Section 7 |
| danh-muc-khach-hang-edit(cá nhân - thông tin bổ sung).png | Current UI | Custom fields tab | Section 7 |

No reference UI images available — current screenshots are primary source.

---

## 3. Visual Source Priority

| Source | Priority | Usage |
|--------|----------|-------|
| Current UI images | 1 | Primary source — pixel measurements and layout |
| Reference UI images | 2 | Not available — skip |
| Supplier feature (`danh-muc-nha-cung-cap`) | 3 | Same design language confirmed — reuse measurements |

---

## 4. Layout Measurements

| Area | Est. Width | Est. Height | Padding | Notes |
|------|-----------|------------|---------|-------|
| App sidebar (nav) | ~220px | 100vh | 0 | Dark navy bg, icon+text |
| Main content area | calc(100% - 220px) | 100vh | 16px 24px | White bg |
| Page breadcrumb | 100% | ~40px | 0 16px | Danh mục / Khách hàng |
| Summary cards row | 100% | ~80px | 0 0 12px | 3 cards, gap ~12px |
| Summary card | ~33% | ~72px | 12px 16px | White bg, border, radius 8px |
| Toolbar | 100% | ~40px | 0 0 8px | Flex row, buttons right |
| Search input | ~280px | ~32px | 8px 12px | "Tìm theo tên khách hàng..." |
| Lọc button | ~80px | ~32px | 8px 12px | Toggle filter panel |
| Filter panel (open) | ~240px | 100% fill | 16px | Left sidebar, collapsible |
| AG Grid container | 100% | flex-fill | — | Fills remaining height |
| AG Grid header row | 100% | ~36px | 0 8px | Light gray bg |
| AG Grid data row | 100% | ~36px | 0 8px | Standard density |
| Pagination bar | 100% | ~40px | 8px 0 | Below grid |
| Add/Edit modal | ~820px | auto (max 90vh) | 24px | Centered overlay |
| Delete confirm modal | ~420px | auto | 24px | Centered |

---

## 5. Design Tokens

The project uses Shadcn/ui CSS variables (HSL). Hex values below are approximations from screenshots for implementation reference; map to CSS variable equivalents in code.

| Token Name | Approx. Hex | CSS Variable | Usage | Confidence |
|------------|------------|--------------|-------|------------|
| page-bg | #F5F6FA | `--background` | Main content bg | High |
| card-bg | #FFFFFF | `--card` | Summary cards, modal bg | High |
| border-color | #E0E3E9 | `--border` | Card/input borders | High |
| primary-color | #1E88E5 | `--primary` | Buttons (Thêm), active state | Medium |
| success-color | #43A047 | — | "Thêm" split button (green variant) | Medium |
| danger-color | #E53935 | `--destructive` | Delete action, error text | Medium |
| text-primary | #212121 | `--foreground` | Body text, grid cells | High |
| text-secondary | #616161 | `--muted-foreground` | Labels, pagination | Medium |
| text-muted | #9E9E9E | `--muted-foreground` | Placeholder text | Medium |
| table-header-bg | #F0F2F5 | — | AG Grid header row | High |
| table-row-bg | #FFFFFF | — | Default row bg | High |
| table-row-alt-bg | #FAFBFC | — | Alternating row bg | Medium |
| table-row-selected | #E3F2FD | — | Selected row | Low (assumption) |
| negative-debt-color | #E53935 | `--destructive` | Negative công nợ value | High |
| toolbar-height | 40px | — | Toolbar component | High |
| input-height | 32px | — | Search, form inputs | High |
| button-height | 32px | — | Toolbar/action buttons | High |
| modal-radius | 8px | `--radius` | Modal border-radius | Medium |
| card-radius | 8px | `--radius` | Summary card radius | Medium |
| grid-row-height | 36px | — | AG Grid `rowHeight` prop | High |
| filter-panel-width | 240px | — | Left filter sidebar | Medium |

---

## 6. Typography Specification

| Element | Font Size | Font Weight | Color Token | Notes |
|---------|-----------|------------|-------------|-------|
| Page breadcrumb | 13px | 400 | text-secondary | "Danh mục / Khách hàng" |
| Summary card label | 13px | 500 | text-secondary | Above value |
| Summary card value | 20px | 700 | text-primary | Large number (VND) |
| Negative value | 20px | 700 | negative-debt-color | In parentheses e.g. (2,146,916,479.9) |
| Toolbar button text | 13px | 500 | text-primary | Text buttons |
| Search placeholder | 13px | 400 | text-muted | "Tìm theo tên khách hàng..." |
| AG Grid header | 13px | 600 | #424242 | Column headers |
| AG Grid cell text | 13px | 400 | text-primary | Default |
| AG Grid money cell | 13px | 400 | text-primary | Right-aligned; negative = red |
| Filter panel label | 13px | 500 | text-primary | "Loại", "Nhóm", etc. |
| Filter panel input | 13px | 400 | text-primary | Dropdown/select text |
| Pagination text | 13px | 400 | text-secondary | "20 bản ghi / trang · 1,787 kết quả" |
| Modal title | 16px | 600 | text-primary | "Thông tin khách hàng" |
| Form label | 13px | 500 | #424242 | Field labels |
| Form required marker | 13px | 500 | danger-color | "*" after label |
| Form input text | 13px | 400 | text-primary | Field values |
| Form placeholder | 13px | 400 | text-muted | Placeholder text |
| Tab label (active) | 13px | 600 | primary-color | With underline |
| Tab label (inactive) | 13px | 500 | text-secondary | No underline |
| Type radio label | 13px | 500 | text-primary | "Tổ chức" / "Cá nhân" |

---

## 7. Component Measurement Specification

| Component | Height | Width | Padding | Gap | Radius | Notes |
|-----------|--------|-------|---------|-----|--------|-------|
| Summary Card | 72px | flex-1 (min 200px) | 12px 16px | — | 8px | 3 cards in row |
| Toolbar | 40px | 100% | 0 | 8px | — | flex row |
| Search Input | 32px | 280px | 8px 12px | — | 4px | with search icon |
| Lọc Button | 32px | ~80px | 8px 12px | — | 4px | text button |
| Icon Button | 32px | 32px | 6px | — | 4px | refresh, settings |
| Text Button | 32px | auto | 8px 16px | — | 4px | Tiện ích ▼ |
| Split Button (Thêm) | 32px | auto | 8px 16px | — | 4px | primary + chevron |
| AG Grid Row | 36px | 100% | 0 8px | — | — | `rowHeight: 36` |
| AG Grid Header | 36px | 100% | 0 8px | — | — | `headerHeight: 36` |
| Filter Panel | 100% height | 240px | 16px | 12px | — | collapsible left |
| Pagination | 40px | 100% | 8px 16px | 8px | — | page-size selector |
| Add/Edit Modal | auto | 820px | 24px | 16px | 8px | max-height 90vh |
| Modal Type Radio | 24px | auto | 4px 16px | 8px | — | "Tổ chức / Cá nhân" at top |
| Form Tab | 36px | auto | 0 16px | — | — | bottom of form section |
| Delete Modal | auto | 420px | 24px | 16px | 8px | simple confirm |
| Row Context Menu | auto | 160px | 6px 12px | — | 4px | Xem, Sửa, Xóa, Ngừng sử dụng |

---

## 8. Grid / Table Specification

### Customer List Grid (AG Grid)

| Column | Est. Width | Alignment | Notes |
|--------|-----------|-----------|-------|
| Checkbox | 40px | center | Row select, sticky left |
| Mã khách hàng | 120px | left | Monospace, ellipsis |
| Tên khách hàng | flex (~280px) | left | Ellipsis; opens edit on click |
| Địa chỉ | flex (~200px) | left | Ellipsis |
| Công nợ | 130px | right | Money format; negative = red + parentheses |
| Mã số thuế/CCCD chủ hộ | 160px | left | May be empty |
| Nhóm | 110px | left | Customer group name, ellipsis |
| Ngừng sử dụng | 90px | center | Badge: Đang sử dụng (green) / Ngừng (gray) |
| Lập CT bán hàng | 130px | center | Button, requires `customer.createSalesVoucher` |
| Chức năng ▼ | 50px | center | Row context menu trigger |

**Notes:**
- Checkbox column sticky left; Chức năng column sticky right.
- AG Grid config: `rowHeight: 36`, `headerHeight: 36`.
- "Lập CT bán hàng" column is a custom cell renderer (button), not text.
- Money format: Vietnamese locale — `1.234.567,89` (period = thousands, comma = decimal).

### Bank Accounts Inline Table (in form tab)

| Column | Est. Width | Alignment | Notes |
|--------|-----------|-----------|-------|
| Số tài khoản | flex | left | Editable input cell |
| Tên ngân hàng | flex | left | Editable input cell |
| Chi nhánh | flex | left | Editable input cell |
| Tỉnh/TP của ngân hàng | flex | left | Editable input cell |
| 🗑 (delete) | 40px | center | Remove row icon button |

### Alt Address Inline Table (in form tab)

| Column | Est. Width | Alignment | Notes |
|--------|-----------|-----------|-------|
| Location cascade | auto | left | Country / Province / District / Ward dropdowns |
| Địa chỉ giao hàng | flex | left | Text input or "Giống địa chỉ khách hàng" checkbox |
| 🗑 (delete) | 40px | center | Remove row |

---

## 9. Interaction Visual States

| Element | State | Expected Visual | Confidence |
|---------|-------|-----------------|------------|
| AG Grid row | Hover | Light blue tint bg | Medium (assumption) |
| AG Grid row | Selected | #E3F2FD bg | Low (assumption) |
| AG Grid row | Checkbox checked | Checkbox filled + row highlight | Medium |
| Toolbar button | Hover | #F5F5F5 bg, slight shadow | Medium |
| Toolbar button | Disabled | Opacity 0.4 | Medium |
| Search input | Focus | Primary border + shadow | Medium |
| "Thêm" button | Default | Green/primary bg | High |
| "Thêm" button | Hover | Darker shade | Medium |
| Modal type radio | Selected | Bold + primary dot/underline | High (visible in screenshots) |
| Modal form tab | Active | Underline + primary color text | High (visible in screenshots) |
| Modal form tab | Inactive | text-secondary, no underline | High |
| Row context menu item | Hover | #F5F5F5 bg | Medium |
| "Xóa" menu item | Default | Red/danger text | Medium (assumption) |
| "Ngừng sử dụng" badge | Default | Gray bg + text | Medium |
| "Đang sử dụng" badge | Default | Green bg + text | Medium |
| Loading | Skeleton | AG Grid skeleton rows | Medium |
| Empty state | No data | EmptyState component | Medium |
| Filter panel | Open | Left sidebar slides in, grid narrows | High (visible) |

---

## 10. Form Modal Layout Details

### Type Toggle (Modal Header)
```
[Thông tin khách hàng] [◉ Tổ chức] [○ Cá nhân]  [☐ Là nhà cung cấp]  [?] [×]
```
- Radio buttons at top of modal header, not inside form body.
- Switching type changes main field set (and Thông tin liên hệ tab content).
- "Là nhà cung cấp" is a standalone checkbox, right-aligned before ? icon.

### Form Body — Two-Column Grid
- Left column (~50%): MST/CCCD, Mã KH, Tên KH, Địa chỉ (wider textarea)
- Right column (~50%): Điện thoại, Website, Nhóm KH, NVBH, Là đối tượng nội bộ

### Tab Bar (Below Form Body)
```
[Thông tin liên hệ] [Điều khoản thanh toán] [Tài khoản ngân hàng] [Địa chỉ khác] [Ghi chú] [Thông tin bổ sung]
```
- Tab bar is below the main fields, not at the top of the modal.
- Active tab: underline + primary color text.
- Tab content area: ~240px min height.

### Điều khoản thanh toán Tab
```
[Điều khoản thanh toán +▼] [Số ngày được nợ] [Số nợ tối đa]
[Tài khoản công nợ phải thu: 131 ▼]
```
- Default receivable account: **131** (distinct from supplier's 331).

### Footer
```
[Hủy]  ────────────────────  [Cất]  [Cất và Thêm]
```
- Hủy: left-aligned, outlined/ghost.
- Cất + Cất và Thêm: right-aligned, primary filled.

---

## 11. Pixel-Perfect Implementation Rules

1. Use `rowHeight: 36` and `headerHeight: 36` in AG Grid options.
2. Apply `table-header-bg` (#F0F2F5) to AG Grid header via `ag-header-row` CSS class.
3. Summary cards: `flex: 1` with `min-width: 180px`, gap `12px`. Do not hard-code widths.
4. Toolbar: flex row, `gap: 8px`, search input pinned left, action buttons pinned right via `margin-left: auto`.
5. Negative money values: display in parentheses with `--destructive` color (e.g. `(2.146.916.479,9)`).
6. Modal: width `820px`, `max-height: 90vh`, overflow-y scroll in tab content area.
7. Form type radio (Tổ chức/Cá nhân) renders in modal header row — not inside the form grid.
8. "Là nhà cung cấp" is a standalone checkbox in the modal header — not a form field.
9. Form tabs render below the main fields area; the tab bar is a simple horizontal tab list.
10. Bank accounts and alt address tabs use an inline editable AG Grid or table (not a form).
11. "Lập CT bán hàng" is a button cell renderer in the grid — rendered per row, not a column header action.
12. Money columns right-aligned; Vietnamese locale format: `1.234.567,89`.
13. Filter panel slides in from left with fixed 240px width; the grid main area shrinks accordingly.
14. Ngừng sử dụng column uses a badge/chip: green (active) or gray (inactive) — not plain text.
15. Do not add drop shadows to summary cards unless confirmed in Phase 9 visual review.

---

## 12. Pixel Review Checklist

| # | Item | Check |
|---|------|-------|
| 1 | Sidebar width ~220px | [ ] |
| 2 | Summary cards row height ~72px, 3 cards in row | [ ] |
| 3 | Toolbar height 40px | [ ] |
| 4 | Search input width ~280px, height 32px | [ ] |
| 5 | Filter panel width 240px, collapsible | [ ] |
| 6 | AG Grid rowHeight=36, headerHeight=36 | [ ] |
| 7 | AG Grid header bg #F0F2F5 | [ ] |
| 8 | Mã số thuế/CCCD column visible (~160px) | [ ] |
| 9 | Nhóm column visible (~110px) | [ ] |
| 10 | Ngừng sử dụng badge green/gray per status | [ ] |
| 11 | Công nợ column right-aligned, negative = red in parentheses | [ ] |
| 12 | Vietnamese number format applied (1.234.567,89) | [ ] |
| 13 | "Lập CT bán hàng" renders as button cell per row | [ ] |
| 14 | Add/edit modal width 820px, max-height 90vh | [ ] |
| 15 | Type radio (Tổ chức/Cá nhân) in modal header, not in form body | [ ] |
| 16 | "Là nhà cung cấp" checkbox in modal header | [ ] |
| 17 | Form tabs below main fields | [ ] |
| 18 | Default AR account in payment tab = 131 | [ ] |
| 19 | Delete modal width 420px | [ ] |
| 20 | Hủy left-aligned, Cất/Cất và Thêm right-aligned | [ ] |

---

## 13. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|----|------|-----------|-------|
| P2-A1 | Exact summary card labels (partial readability) | No | Assumed: Tổng công nợ / Phải thu / Trả trước — verify in Phase 9 |
| P2-A2 | Alternating row color (#FAFBFC) — not pixel-verified | No | Apply default; check in Phase 9 |
| P2-A3 | Exact primary color hex (appears blue-teal range) | No | Map to CSS variable `--primary`; verify in Phase 9 |
| P2-A4 | "Pay customer" action button location/style | No | Feature is Need Confirmation — no visual to analyze |

No blocking unclear items.

---

## 14. Definition of Done

- [x] 11 screenshots inventoried and analyzed
- [x] Layout measurements documented for all visible areas
- [x] Design tokens extracted with confidence ratings (CSS variable mapped)
- [x] Typography specified for all text elements
- [x] Component measurements specified
- [x] AG Grid columns specified for customer list + form inline tables
- [x] Form modal layout detailed (header, body, tabs, footer)
- [x] Interaction states documented (assumptions marked)
- [x] Pixel-perfect rules defined for Phase 8
- [x] Pixel review checklist ready for Phase 9 (20 items)
- [x] Unclear items logged — no blocking items
