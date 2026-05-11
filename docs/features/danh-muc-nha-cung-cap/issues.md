# Feature Issues: Danh mục nhà cung cấp

## Summary

| Status | Count |
|---|---:|
| Open Blocking | 0 |
| Open Non-blocking | 19 |
| Resolved | 14 |
| Deferred | 2 |

## Issues

| ID | Phase | Type | Description | Source | Blocking? | Status | User Answer | Resolution |
|---|---:|---|---|---|---|---|---|---|
| P1-M1 | 1 | Missing Information | AccountingMini actual UI screenshots chưa có; dùng MISA reference thay thế | images/ | No | Open | | Pending Phase 9 |
| P1-U1 | 1 | Unclear Requirement | Bulk delete scope — config có `supplier-bulk-delete` nhưng MISA nói không hỗ trợ bulk deactivate | config.yaml | No | Resolved | không hỗ trợ | Bulk delete không implement — Do Not Implement |
| P1-U2 | 1 | Unclear Requirement | `supplier-updateAddress` — bulk dialog hay inline edit? | config.yaml | No | Resolved | bulk dialog | supplier-updateAddress = bulk address confirmation dialog (Xác nhận địa chỉ NCC) |
| P1-U3 | 1 | Unclear Requirement | "Nhân bản" (Clone) có trong row action của MISA nhưng không có trong scope | Ref UI | No | Resolved | Implement | Thêm vào Row Action: ▼ Nhân bản → POST /suppliers/{id}/clone |
| P1-U4 | 1 | Unclear Requirement | Delete UX khi 409: chỉ toast hay cần "Xem phát sinh"? | nha-cung-cap.md | No | Resolved | Có nút Xem phát sinh | Dialog error state + nút navigate đến chứng từ liên quan |
| P1-U5 | 1 | Unclear Requirement | isActive filter — URL param có UI element không? | Section 14 vs Section 10 | No | Resolved | Dropdown Toolbar | Thêm dropdown Tất cả/Đang dùng/Ngừng vào Toolbar, default: Đang sử dụng |
| P1-C1 | 1 | Conflict | Permission prefix: existing code dùng `suppliers.` (plural) vs config/CLAUDE.md dùng `supplier.` (singular) | CLAUDE.md vs code | No | Resolved | supplier. (singular) | Dùng `supplier.` singular — migrate existing `suppliers.` code |
| P1-C2 | 1 | Conflict | `supplier-pay` capability — separate payment screen hay textlink Lập CT mua hàng? | config.yaml | No | Resolved | textlink Lập CT mua hàng | "Lập CT mua hàng" là textlink column trong grid, dùng permission supplier.createPurchaseVoucher |
| P1-A1 | 1 | Assumption | `currentDebtAmount` field tồn tại trong API response (cần cho negative-debt-display business rule) | config.yaml | No | Resolved | | Phase 3: stored as `decimal?` in Supplier entity; null = no accounting data yet |
| P1-A2 | 1 | Assumption | Bank account field (bankAccount) chỉ có trong form, không trong grid | BA review | No | Resolved | Thêm form only | Phase 3: `bank_account varchar(50) NULL`; field name = `bankAccount`; not in SupplierListItemDto |
| P1-Q1 | 1 | User Question | Metric cards (3 thẻ tài chính) có cần trong phase này không? | Current UI | No | Resolved | No | Metric cards không implement trong phase này — Defer |
| P1-Q6 | 1 | User Question | "Là khách hàng" sync rule — cross-module, có trong scope phase này không? | khai-bao-nha-cung-cap.md | No | Deferred | (not answered) | Defer — ảnh hưởng schema. Phase 3 Backend Design phải xử lý |
| P1-Q7 | 1 | User Question | Cột Nợ cũ (previousDebtAmount) có implement không? | Ref UI grid | No | Deferred | Defer | Chỉ hiển thị cột Nợ (currentDebtAmount) trong phase này |
| P2-M1 | 2 | Missing Information | No AccountingMini-specific UI design; all measurements estimated from MISA reference | images/ | No | Open | | Adapt during Phase 8 coding |
| P2-M2 | 2 | Missing Information | Exact primary/brand color token of AccountingMini not confirmed | design system | No | Open | | Confirm when reading actual project during Phase 8 |
| P2-U1 | 2 | Unclear Requirement | "Lập CT mua hàng" textlink click target — route? Purchase voucher create route not yet designed | Phase 1 scope | No | Resolved | Route: `/accounting/purchase-vouchers/create?supplierId={id}` (assumption P4-A2) | Phase 4 D5: frontend-only navigation |
| P2-A1 | 2 | Assumption | AccountingMini uses Tailwind + shadcn/Radix UI — design tokens map to Tailwind classes | CLAUDE.md | No | Open | | Low risk — consistent with CLAUDE.md |
| P2-A2 | 2 | Assumption | Negative debt: `(value)` parentheses + red = accounting standard | convention | No | Open | | Low risk |
| P2-A3 | 2 | Assumption | Primary orange ~#f97316 matches AccountingMini brand color | MISA ref | No | Open | | Confirm during Phase 8 |
| P2-A4 | 2 | Assumption | "Số TK NH/CCCD" column NOT in grid — bankAccount is form-only, diverges from MISA | Phase 1 decision | No | Open | | Already decided in Phase 1 |
| P3-C1 | 3 | Conflict | `PaginatedList<T>.TotalCount` serializes as `totalCount`; frontend expects `total` | PaginatedList.cs | No | Resolved | | Phase 3 D3: introduce `PageResult<T>` wrapper DTO at API layer mapping TotalCount → Total |
| P3-C2 | 3 | Conflict | `PaginationRequest.SortDescending: bool`; frontend uses `sortDir: 'asc'\|'desc'` | PaginationRequest.cs | No | Resolved | | Phase 3 D4: `GetSuppliersQuery` accepts `SortDir: string?`, converts to `SortDescending` internally |
| P3-C3 | 3 | Conflict | `PaginationRequest.MaxPageSize = 200`; config `max_page_size: 500` | PaginationRequest.cs | No | Resolved | | Phase 3 D7: `GetSuppliersQuery` overrides to 500; export uses 5000 |
| P3-M1 | 3 | Missing Information | Excel export package not in Directory.Packages.props — EPPlus or ClosedXML? | Directory.Packages.props | No | Open | | Resolve before Phase 6 coding |
| P3-A1 | 3 | Assumption | `currentDebtAmount` stored as nullable decimal; null until accounting module exists | Phase 3 design | No | Open | | Low risk — documented in Phase 3 D2 |
| P3-A2 | 3 | Assumption | "Has transactions" delete check stubbed to always return 0 in Phase 7 | Phase 3 design | No | Open | | Medium risk — document explicitly in Phase 7 summary |
| P3-Q2 | 3 | User Question | Excel export package choice: EPPlus (commercial+free tier) vs ClosedXML (MIT) | Phase 3 | No | Resolved | ClosedXML | Use ClosedXML (MIT license) — add to Directory.Packages.props in Phase 6 |
| P3-Q3 | 3 | User Question | Delete 409 response body: include `transactionCount` field? | Phase 3 / Phase 1 | No | Resolved | Yes | DELETE 409 returns `{ code, message, transactionCount }` |
| P4-C1 | 4 | Conflict | `email` in frontend SupplierListItem but not in backend SupplierListItemDto | Phase 1 vs Phase 3 | No | Resolved | | Phase 4 D1: remove `email` from frontend SupplierListItem (not in grid) |
| P4-C2 | 4 | Conflict | Date field naming: backend `CreatedAtUtc`/`UpdatedAtUtc` vs frontend `createdAt`/`updatedAt` | Phase 3 DTO vs Phase 1 | No | Resolved | | Phase 4 D3: rename backend DTO fields to `CreatedAt`/`UpdatedAt` |
| P4-A1 | 4 | Assumption | `{id:guid}` route constraint supported by existing Minimal API setup | Phase 4 routing | No | Open | | Verify during Phase 7 coding |
| P4-A2 | 4 | Assumption | "Lập CT mua hàng" nav route: `/accounting/purchase-vouchers/create?supplierId={id}` — route not yet designed | Phase 4 D5 | No | Open | | Confirm when Purchase Voucher feature is built |
| P5-M1 | 5 | Missing Information | Next.js App Router `useSearchParams` requires Suspense boundary to avoid hydration error | SupplierListPage | No | Open | | Wrap SupplierListPage in `<Suspense>` in route page.tsx |
| P5-A1 | 5 | Assumption | Old `suppliers.*` permissions group kept alongside new `supplier.*` — existing code not audited | permissions.ts | No | Open | | Verify no other code relies on old group during Phase 8 |
| P5-A2 | 5 | Assumption | AG Grid cellRenderer for negative debt and "Lập CT mua hàng" textlink | Phase 8 coding | No | Open | | Standard AG Grid pattern |
| P6-M1 | 6 | Missing Information | `Error` record has no extension fields; DELETE 409 needs `transactionCount` in response body — need `SupplierHasTransactionsError : Error` or typed result | Phase 7 delete handler | No | Open | | Resolve during Phase 7 coding |
| P9-M1 | 9 | Missing Information | Grid with data not captured — cannot verify row height, debt color, action column | Phase 9 review | No | Open | | Low risk — code verified in Phase 8; V9 screenshots can supplement |
| P9-M2 | 9 | Missing Information | Breadcrumb shows URL slug "categories" instead of label "Danh mục" | Phase 9 review (V9-1) | No | Open | | Fix breadcrumb route-to-label mapping |
| P9-M3 | 9 | Missing Information | Pagination shows "0 bản ghi" while isLoading = true (V9-3) | Phase 9 review | No | Open | | Pass `total: undefined` to PaginationBar during loading; show `—` |
