# Visual Review Issues: Danh mục nhà cung cấp

## Summary

| Severity | Open | Resolved | Deferred |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 2 | 0 |
| Medium | 0 | 2 | 0 |
| Low | 0 | 0 | 1 |

## Visual Issues

| ID | Severity | Area | Expected | Actual | Recommendation | File / Component | Status |
|---|---|---|---|---|---|---|---|
| VIS-001 | High | Toolbar — Thêm button | Split button (primary "Thêm" + chevron dropdown) per Phase 2 spec #12 and source UI | Plain button "+ Thêm mới" — no chevron, no dropdown | Converted to split button: primary + ChevronDown dropdown (Nhập từ Excel, disabled) | `SupplierListPage.tsx` | Fixed |
| VIS-002 | High | Table — Trả trước column | "Trả trước" money column (140px, right-aligned) — Phase 2 spec Section 8 column #9 | Column absent; only "Nợ" (debt) column present | Added "Trả trước" column using CreditCell renderer (derives from negative currentDebtAmount) | `SupplierTable.tsx` | Fixed |
| VIS-003 | Medium | Table — Trạng thái column | "Trạng thái" badge chip (100px, center) per Phase 2 spec Section 8 column #10 | Column absent — active/inactive only visible via toolbar filter | Added StatusBadge column using `isActive` field | `SupplierTable.tsx` | Fixed |
| VIS-004 | Medium | Table — STT column | STT (#) auto-number column (48px, center) as column #2 per Phase 2 spec | Column absent | Added STT column + checkbox column (sticky left) | `SupplierTable.tsx` | Fixed |
| VIS-005 | Low | Form dialog — width | 820px max-width (Phase 2 spec) | Tổ chức form screenshot appears narrower (lower viewport screenshot) | Verify at 1280px viewport — likely resolution artifact | `SupplierFormDialog.tsx` | Deferred |
