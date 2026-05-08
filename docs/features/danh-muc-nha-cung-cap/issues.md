# Feature Issues: Danh mục nhà cung cấp

## Summary

| Status | Count |
|---|---:|
| Open Blocking | 0 |
| Open Non-blocking | 7 |
| Resolved | 0 |
| Deferred | 0 |

## Issues

| ID | Phase | Type | Description | Source | Blocking? | Status | User Answer | Resolution |
|---|---:|---|---|---|---|---|---|---|
| P1-M1 | 1 | Missing Information | AccountingMini actual UI screenshots chưa có; dùng MISA reference thay thế | images/ | No | Open | | |
| P1-U1 | 1 | Unclear Requirement | Bulk delete scope — config có `supplier-bulk-delete` nhưng MISA nói không hỗ trợ bulk deactivate | config.yaml | No | Open | | |
| P1-U2 | 1 | Unclear Requirement | `supplier-updateAddress` — bulk dialog hay inline edit? | config.yaml | No | Open | | |
| P1-C1 | 1 | Conflict | Permission prefix: existing code dùng `suppliers.` (plural) vs config/CLAUDE.md dùng `supplier.` (singular) | CLAUDE.md vs code | No | Open | | |
| P1-C2 | 1 | Conflict | `supplier-pay` capability — separate payment screen hay textlink Lập CT mua hàng? | config.yaml | No | Open | | |
| P1-A1 | 1 | Assumption | `currentDebtAmount` field tồn tại trong API response (cần cho negative-debt-display business rule) | config.yaml | No | Open | | |
| P1-Q1 | 1 | User Question | Metric cards (3 thẻ tài chính) có cần trong phase này không? | Current UI | No | Open | | |
