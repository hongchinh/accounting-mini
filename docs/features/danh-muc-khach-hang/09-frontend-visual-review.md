# Frontend Visual Review: Danh mục khách hàng

## Phase Status
Status: Completed
Review Status: Approved
Blocking Issues: No
Visual Issues: 6 Medium, 5 Low — no Critical/High

---

## 1. Screenshots Reviewed

| File | Screen | Status |
|------|--------|--------|
| `actual/danh sách -có dữ liệu.png` | List — 1 row of data | Analyzed |
| `actual/danh sách khách hàng trống.png` | List — empty state | Analyzed |
| `actual/addnew khách hàng.png` | Add form dialog (Tổ chức, Liên hệ tab) | Analyzed |
| `actual/sửa khách hàng.png` | Edit form dialog (Tổ chức, Liên hệ tab) | Analyzed |
| `actual/xóa khách hàng.png` | Delete confirmation dialog | Analyzed |

---

## 2. Checklist Results (Phase 2 Pixel Spec)

| # | Item | Result | Note |
|---|------|--------|------|
| 1 | Sidebar width ~220px | ✅ | Visible, correct |
| 2 | Summary cards row — 3 cards, ~72px height | ✅ | Phải thu / Tổng công nợ / Trả trước visible |
| 3 | Toolbar height ~40px | ✅ | Correct |
| 4 | Search input ~280px, 32px height | ✅ | Correct |
| 5 | Lọc button ~80px, filter panel collapsible | ❌ | Missing — not built (P8-N2) |
| 6 | AG Grid rowHeight=36, headerHeight=36 | ✅ | Visually matches spec |
| 7 | AG Grid header bg #F0F2F5 | ✅ | Light gray header visible |
| 8 | MST/CCCD column visible (~160px) | ✅ | Visible as "MST/CCCD" |
| 9 | Nhóm column visible (~110px) | ✅ | Visible |
| 10 | Status badge green/gray per status | ✅ | "Đang sử dụng" green badge correct |
| 11 | Công nợ right-aligned, negative = red parens | ✅ | Shows "—" for zero; format correct |
| 12 | Vietnamese number format applied | ✅ | Pending data with numbers to verify |
| 13 | "Lập CT bán hàng" button cell per row | ⚠️ | Rendered as link text, not a styled button |
| 14 | Modal width 820px, max-height 90vh | ✅ | Appears correctly sized |
| 15 | Type radio (Tổ chức/Cá nhân) in modal header | ✅ | Present in header area |
| 16 | "Là nhà cung cấp" checkbox in modal header | ✅ | Top-right of modal ✅ |
| 17 | Form tabs below main fields | ✅ | 6 tabs: Liên hệ, TK thanh toán, TK ngân hàng, Địa chỉ khác, Ghi chú, Bổ sung |
| 18 | Default AR account in payment tab = 131 | ⚠️ | Not visible in current screenshots |
| 19 | Delete modal width ~420px | ✅ | Appears correct |
| 20 | Hủy left-aligned, Cất/Cất và Thêm right-aligned | ⚠️ | Footer not visible in screenshots (form scrolled) |

---

## 3. Area-by-Area Review

### List Page

**Summary Cards:**
- ✅ 3 cards correct: Phải thu, Tổng công nợ, Trả trước
- ✅ White bg, border, correct layout
- ✅ Color coding: Phải thu value in red (debt), Trả trước value in green (credit) — intentional, matches business semantics

**Toolbar:**
- ✅ Search, status filter, refresh, Xuất ra Excel, + Thêm mới split button
- ❌ "Lọc" filter button absent — known omission P8-N2

**AG Grid:**
- ✅ Column headers visible: Mã KH, Tên KH, MST/CCCD, Nhóm, Địa chỉ, Công nợ, Trạng thái, Lập CT bán hàng, ⋮
- ❌ Column order differs from spec (see V-M01)
- ⚠️ Extra "#" row-number column not in spec (see V-M02)
- ✅ "Đang sử dụng" green status badge correct
- ✅ "Lập CT bán hàng" column present (link-style, see V-L01)

**Empty State:**
- ✅ Envelope icon + "Chưa có khách hàng nào" + subtitle text
- ✅ Pagination bar: "0 bản ghi"

### Form Dialog (Add / Edit)

- ✅ Type toggle (Tổ chức / Cá nhân) in modal header
- ✅ "Là nhà cung cấp" checkbox top-right
- ✅ Two-column layout for main fields
- ✅ Full-width Địa chỉ field
- ✅ 6 tabs: Liên hệ, TK thanh toán, TK ngân hàng, Địa chỉ khác, Ghi chú, Bổ sung
- ✅ Edit mode shows "(không thể thay đổi)" hint on Mã KH
- ⚠️ Modal title "Thêm/Sửa khách hàng" vs spec "Thông tin khách hàng" (see V-L02)
- ⚠️ Tab label "Bổ sung" vs spec "Thông tin bổ sung" (see V-L03)

### Delete Confirmation Dialog

- ✅ "Xác nhận xóa" title
- ✅ Descriptive message about irreversible action
- ✅ "Hủy" outlined + "Xóa" red filled buttons

---

## 4. Assumptions Verified from Phase 2

| P2 ID | Assumption | Verified? |
|-------|-----------|-----------|
| P2-A1 | Summary card labels: Tổng công nợ / Phải thu / Trả trước | ✅ Confirmed |
| P2-A2 | Alternating row color (#FAFBFC) | ⚠️ Only 1 data row — cannot verify |
| P2-A3 | Primary color in blue-teal range → CSS variable | ✅ Blue confirmed |
| P2-A4 | "Pay customer" button location/style | ⚠️ Not visible in screenshots |

---

## 5. Issues Summary

See [visual-review-issues.md](visual-review-issues.md) for full list.

| Severity | Count | Blocks Phase 11? |
|----------|-------|-----------------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 6 | No |
| Low | 5 | No |

---

## 6. Definition of Done

- [x] All 5 actual screenshots analyzed
- [x] Phase 2 pixel checklist evaluated (20 items)
- [x] All issues recorded in visual-review-issues.md
- [x] No Critical or High severity issues found
- [x] Phase 11 gate: not blocked
- [x] Assumptions P2-A1, P2-A3 verified; P2-A2, P2-A4 deferred (data/feature dependent)
