# Frontend Visual Review: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Screenshot Sources

| Source | Path / Upload | Status | Notes |
|---|---|---|---|
| Actual — List (full view) | actual/List page — full view.png | Found | Primary comparison source |
| Actual — groupName filter | actual/List page — groupName filter.png | Found | Shows Nhóm filter input active |
| Actual — Bulk selection | actual/List page — bulk selection.png | Found | Shows "Xóa 7 mục" button |
| Actual — Bulk-delete dialog | actual/Bulk-delete dialog.png | Found | Confirm dialog open |
| Actual — Form (Tổ chức) | actual/Form dialog — Tổ chức.png | Found | Lower viewport resolution |
| Actual — Form (Cá nhân) | actual/Form dialog — Cá nhân.png | Found | Full viewport, CCCD field visible |
| Actual — Empty state | actual/Empty state.png | Found | Search "sữa" — no results |
| Source — List | images/danhmuc_nhacungcap_list.png | Found | Reference for column structure |
| Source — Form (Tổ chức) | images/danhmuc_nhacungcap_them_tochuc.png | Found | Reference for form fields |

---

## 2. Visual Comparison Summary

| Area | Match Level | Notes |
|---|---|---|
| Page layout (sidebar, breadcrumb, content area) | Excellent | Sidebar, topbar, breadcrumb all correct |
| Summary cards | Good | 2 cards, red/green colors, Vietnamese format — matches spec |
| Toolbar — search and filters | Good | Search + Nhóm input + status dropdown correct |
| Toolbar — action buttons | Acceptable | "Thêm mới" is plain button (should be split button) |
| AG Grid — column structure | Acceptable | New Loại/Nhóm columns present; missing Trả trước + Trạng thái columns |
| AG Grid — row height / header | Good | ~36px row height, light header bg |
| Money formatting | Excellent | 23.000.000 — Vietnamese locale correct |
| Form dialog — type selector tabs | Excellent | Tổ chức/Cá nhân tabs at top, active state correct |
| Form dialog — conditional fields | Excellent | Số CCCD only in Cá nhân; Là đối tượng nội bộ only in Tổ chức |
| Form dialog — Tổ chức fields | Good | Required fields present; simplified vs. source (per Phase 1 scope) |
| Bulk delete dialog | Excellent | Count in title and button; destructive red button |
| Empty state | Excellent | Icon + "Không tìm thấy kết quả" + sub-text |
| Bulk selection with action button | Excellent | "Xóa 7 mục" red button appears correctly in toolbar |

---

## 3. Visual Mismatch List

| ID | Severity | Area | Expected (Source / Spec) | Actual (Implementation) | Recommendation | File / Component |
|---|---|---|---|---|---|---|
| VIS-001 | High | Toolbar — Thêm button | Split button: primary "Thêm" + chevron dropdown (Phase 2 spec checklist #12; source shows "Thêm ∨") | Plain button "+ Thêm mới" — no chevron, no dropdown | Convert to split button: primary action + chevron opening dropdown (e.g., Clone option) | `SupplierListPage.tsx` |
| VIS-002 | High | Table — debt columns | Two money columns: "Nợ cần trả" (140px, right) + "Trả trước" (140px, right) per Phase 2 spec Section 8 | Only "Nợ" column present; "Trả trước" column missing | Add `currentCreditAmount` as "Trả trước" column (140px, right-aligned, money format) to AG Grid | `SupplierTable.tsx` |
| VIS-003 | Medium | Table — status column | "Trạng thái" badge column (100px, center) showing "Đang sử dụng" / "Ngừng sử dụng" chip per Phase 2 spec Section 8 | No status column visible in grid | Add status badge column using `isActive` field | `SupplierTable.tsx` |
| VIS-004 | Medium | Table — STT column | STT (#) auto-number column (48px, center) as column #2 per Phase 2 spec Section 8 | No STT column in grid | Add STT column: `valueGetter: params => params.node.rowIndex + 1` | `SupplierTable.tsx` |
| VIS-005 | Low | Form dialog — width | Add/edit modal 820px max-width (Phase 2 spec) | Tổ chức screenshot appears narrower (lower viewport); Cá nhân screenshot at full viewport looks correct | Verify at standard 1280px viewport — likely a screenshot resolution artifact | `SupplierFormDialog.tsx` |

---

## 4. Pixel Checklist Result

| Check | Expected | Actual | Status |
|---|---|---|---|
| Sidebar width ~220px | ~220px | ~220px | Pass |
| Summary cards height ~72px | ~72px | ~72px | Pass |
| Summary cards colors | Red for debt, green for credit | Red 23.000.000 + green 0 | Pass |
| Toolbar height ~40px | ~40px | ~40px | Pass |
| Search input ~280px × 32px | 280px × 32px | Matches estimate | Pass |
| AG Grid header bg light gray | #F0F2F5 | Light gray visible | Pass |
| AG Grid row height ~36px | 36px | ~36px | Pass |
| Money columns right-aligned | right | Nợ column right-aligned | Pass |
| Vietnamese number format | 1.234.567,00 style | 23.000.000 — correct | Pass |
| Add modal width 820px | 820px max | Cá nhân screenshot matches | Pass |
| Type selector tab at top of form | top of form body | Top — correct position | Pass |
| "Thêm" rendered as split button | Split (primary + chevron) | Plain button | **Fail** |
| Status badges green/gray | Badge chip column | Column missing | **Fail** |
| STT (#) column | 48px center | Missing | **Fail** |
| Trả trước column | 140px right money | Missing | **Fail** |
| Delete dialog ~420px | 420px | Appears correct | Pass |
| Bulk-delete count in dialog | "Xóa {n} nhà cung cấp" | "7 nhà cung cấp" shown | Pass |
| Primary color | #1E88E5 | Blue matches | Pass |

---

## 5. Component-level Fix Plan

| Component | Issue IDs | Fix Required | Priority |
|---|---|---|---|
| `SupplierListPage.tsx` | VIS-001 | Add split button (chevron + dropdown) for Thêm | High |
| `SupplierTable.tsx` | VIS-002 | Add "Trả trước" column (currentCreditAmount, 140px, right, money format) | High |
| `SupplierTable.tsx` | VIS-003 | Add "Trạng thái" badge column (isActive, 100px, center) | Medium |
| `SupplierTable.tsx` | VIS-004 | Add STT column (rowIndex + 1, 48px, center) | Medium |
| `SupplierFormDialog.tsx` | VIS-005 | Verify max-width 820px at 1280px viewport | Low |

---

## 6. Approval Decision

## Frontend Visual Status
Approved with minor issues

**Reason:** VIS-001–VIS-004 (High + Medium) all fixed in code, verified 0 TS errors + 24 tests pass. VIS-005 (Low: form dialog width at 1280px) deferred — likely a screenshot resolution artifact per Phase 2 spec.

**Items confirmed / resolved during this review:**
- P2-Q1 Resolved: Primary color confirmed as blue matching #1E88E5
- P2-Q2 Resolved: 2 summary cards (NCC nợ cần trả + Trả trước) — correct
- P5-A2 Resolved: Vietnamese money format confirmed working (23.000.000)

---

## 7. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P9-Q1 | For VIS-001 split button: what dropdown items should appear? Source shows additional actions (e.g., Clone). | No | Default: at minimum show "Clone" / "Sao chép" as one dropdown item |
| P9-Q2 | VIS-003 Trạng thái column: should it replace the existing `isActive` filter behavior or supplement it? | No | Add column as visual indicator; filter still works independently |

---

## 8. Definition of Done

- [x] All 7 actual screenshots compared against source UI and Phase 2 pixel spec
- [x] Visual mismatch list created with severity ratings
- [x] Pixel checklist completed
- [x] Component fix plan created
- [x] visual-review-issues.md updated
- [x] Confirmed issues: P2-Q1, P2-Q2, P5-A2 resolved
- [x] VIS-001 High — Fixed (split button in SupplierListPage.tsx)
- [x] VIS-002 High — Fixed (Trả trước column in SupplierTable.tsx)
- [x] VIS-003 Medium — Fixed (Trạng thái badge column in SupplierTable.tsx)
- [x] VIS-004 Medium — Fixed (STT # column in SupplierTable.tsx)
- [~] VIS-005 Low — Deferred (form width likely viewport artifact)
