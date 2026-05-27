# Frontend Coding Summary: Danh Mục Nhà Cung Cấp (Supplier Management)

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Implementation Summary

Phase 8 extends the existing Supplier frontend module to support all Phase 4 API contract additions. Added summary cards, SupplierType (Tổ chức / Cá nhân) selector, GroupName field/filter, IdNumber (CCCD), IsCustomer / IsInternalObject flags, bulk-delete with 409 error handling. All 24 unit tests pass; TypeScript reports 0 errors.

TDD cycle followed for all groups (G1–G4). Per-task 2-stage code review applied.

---

## 2. Files Created

| File | Purpose |
|------|---------|
| `src/modules/suppliers/components/SupplierSummaryCards.tsx` | Summary cards (debt/credit amounts with skeleton loading) |
| `src/modules/suppliers/components/BulkDeleteConfirmDialog.tsx` | Bulk-delete confirmation dialog, 409 error handling |
| `src/modules/suppliers/supplier.schema.test.ts` | Schema validation tests (15 tests) |
| `src/modules/suppliers/useSuppliers.test.ts` | Query key structure tests (3 tests) |
| `src/modules/suppliers/components/SupplierSummaryCards.test.tsx` | SupplierSummaryCards render tests (4 tests) |
| `src/modules/suppliers/components/BulkDeleteConfirmDialog.test.tsx` | BulkDeleteConfirmDialog render tests (2 tests) |

---

## 3. Files Modified

| File | Change |
|------|--------|
| `src/modules/suppliers/supplier.types.ts` | Added SUPPLIER_TYPE const, SupplierSummary, BulkDeleteInput; extended all interfaces with new fields |
| `src/modules/suppliers/supplier.schema.ts` | code max 32→50; added supplierType, groupName, idNumber, isCustomer, isInternalObject |
| `src/modules/suppliers/supplier.api.ts` | Added summary() and bulkDelete() |
| `src/modules/suppliers/supplier.keys.ts` | Added summary(tenantId) key |
| `src/modules/suppliers/useSuppliers.ts` | Added useSupplierSummary, useBulkDeleteSuppliers; useCreateSupplier/useDeleteSupplier now also invalidate summary key |
| `src/modules/suppliers/__mocks__/supplier.mock.ts` | Extended with supplierType, groupName, isCustomer; added mockSupplierSummary |
| `src/modules/suppliers/components/SupplierForm.tsx` | Added type selector tabs; groupName, idNumber (conditional), isCustomer, isInternalObject fields |
| `src/modules/suppliers/components/SupplierFormDialog.tsx` | Maps all new fields to CreateSupplierInput / UpdateSupplierInput; dialog max-width 820px |
| `src/modules/suppliers/components/SupplierTable.tsx` | Added supplierType badge column + groupName column |
| `src/modules/suppliers/pages/SupplierListPage.tsx` | Added summary cards, groupName filter input, bulk-delete button + dialog |
| `src/modules/suppliers/index.ts` | Exported SupplierSummaryCards, BulkDeleteConfirmDialog |
| `src/config/permissions.ts` | Added PERMISSIONS.Supplier.BulkDelete = "supplier.bulkDelete" |

---

## 4. API Contract Mapping

| UI Action | Hook | Endpoint | Status |
|-----------|------|----------|--------|
| Summary cards | useSupplierSummary | GET /api/v1/suppliers/summary | ✓ |
| Load list (+groupName filter) | useSupplierList | GET /api/v1/suppliers | ✓ |
| Load detail | useSupplierDetail | GET /api/v1/suppliers/{id} | ✓ |
| Create supplier | useCreateSupplier | POST /api/v1/suppliers | ✓ |
| Update supplier | useUpdateSupplier | PUT /api/v1/suppliers/{id} | ✓ |
| Toggle active | useToggleSupplierActive | PATCH /api/v1/suppliers/{id}/toggle-active | ✓ |
| Delete single | useDeleteSupplier | DELETE /api/v1/suppliers/{id} | ✓ |
| Bulk delete | useBulkDeleteSuppliers | POST /api/v1/suppliers/bulk-delete | ✓ |
| Export | useExportSuppliers | GET /api/v1/suppliers/export | ✓ |

---

## 5. UI Pixel Spec Mapping

| Spec | Implementation |
|------|----------------|
| Summary cards 72px height, px-4 py-3, flex-1 | `h-[72px] flex-1 px-4 py-3 rounded-lg border bg-white` |
| Type selector tabs at top of modal | `SupplierForm` — two buttons controlled by supplierType field |
| Delete dialog 420px width | `sm:max-w-[420px]` on BulkDeleteConfirmDialog |
| Form dialog 820px width | `sm:max-w-[820px]` on SupplierFormDialog (was 720px) |
| groupName column in table | Added 120px column before address |
| supplierType badge | Tổ chức (gray) / Cá nhân (blue) badge in 90px column |

---

## 6. Components Implemented

| Component | Description |
|-----------|-------------|
| SupplierSummaryCards | 2 cards: NCC nợ cần trả (red), Trả trước (green); skeleton when loading; null when no data |
| BulkDeleteConfirmDialog | Shows count; 409 CONFLICT shows inline error; success toasts and calls onConfirm |
| SupplierForm | Type selector tabs (Tổ chức/Cá nhân); idNumber conditional on Individual; isInternalObject conditional on Organization |
| SupplierTable | +supplierType badge column, +groupName column |
| SupplierListPage | +SupplierSummaryCards, +groupName filter, +BulkDeleteConfirmDialog wired with Can guard |

---

## 7. State Management

All state follows the existing pattern:
- URL search params drive list query (search, page, pageSize, sortBy, sortDir, isActive, groupName)
- TanStack Query cache keyed by tenantId
- Summary cache invalidated on: create, delete, bulk-delete
- `useSupplierSummary` enabled only when `!!tenantId`

---

## 8. Permissions

| Permission | Constant | UI Effect |
|-----------|---------|----------|
| supplier.view | PERMISSIONS.Supplier.View | PermissionGuard wraps page |
| supplier.create | PERMISSIONS.Supplier.Create | Can hides "Thêm mới" button |
| supplier.update | PERMISSIONS.Supplier.Update | Can hides "Sửa" row action |
| supplier.delete | PERMISSIONS.Supplier.Delete | Can hides "Xóa" row action |
| supplier.bulkDelete | PERMISSIONS.Supplier.BulkDelete | Can hides "Xóa N mục" button |
| supplier.export | PERMISSIONS.Supplier.Export | Can hides "Xuất ra Excel" button |
| supplier.updateAddress | PERMISSIONS.Supplier.UpdateAddress | Can hides "Xác nhận địa chỉ" button |

---

## 9. Multi-tenant Handling

- All query keys include `tenantId` from `useTenantStore()`
- `enabled: !!tenantId` on all `useQuery` hooks
- No tenantId in request body or URL — backend reads from JWT via X-Tenant-Id header

---

## 10. Loading / Empty / Error States

| State | Where |
|-------|-------|
| Loading | SupplierSummaryCards shows skeleton; SupplierTable shows DataGrid skeleton |
| Empty | GridEmptyState with search-aware message; SupplierSummaryCards returns null when no data and not loading |
| Error | SupplierTable passes error to DataGrid; BulkDeleteConfirmDialog shows inline 409 error |
| No permission | Can component hides action buttons; PermissionGuard redirects for page-level access |

---

## 11. Commands Run

```
node_modules/.bin/vitest run src/modules/suppliers/    → 24 tests, 0 failed
node_modules/.bin/tsc --noEmit                         → 0 errors
```

---

## 12. Visual Review Preparation

Required screenshots for Phase 9:
1. Supplier list page — full view with summary cards visible
2. Supplier list page — groupName filter active
3. Supplier list page — bulk selection with "Xóa N mục" button visible
4. Bulk-delete confirmation dialog — open state
5. Add/Edit supplier form — Organization type selected
6. Add/Edit supplier form — Individual type selected (idNumber visible)
7. Empty state (no suppliers)

---

## 13. Known Limitations

- `SupplierDetailPage.tsx` was not updated to show new fields (idNumber, isInternalObject) — deferred as per Phase 5 plan
- Clone flow in `SupplierFormDialog` calls `supplierApi.create`, not `/clone` endpoint — pre-existing pattern; not changed in this phase

---

## 14. Unclear / Incomplete Items

| ID | Item | Blocking? |
|----|------|-----------|
| P5-A2 | format.ts utility — not used; Intl.NumberFormat('vi-VN') used directly in SupplierSummaryCards | No |
| P5-A3 | SupplierTable column order: supplierType (90px) and groupName (120px) added after "Tên NCC" | No |

---

## 15. Definition of Done

- [x] All changed files are under `accounting_web/`
- [x] API usage matches Phase 4 contract
- [x] UI structure matches Phase 1 and Phase 2 specs
- [x] All new hooks, components, and types implemented
- [x] Permission and tenant handling implemented
- [x] Loading, empty, error, no-permission states implemented
- [x] 24 unit tests pass, 0 failures
- [x] TypeScript: 0 errors
- [x] 08-frontend-coding-summary.md created
- [x] TDD cycle followed for all groups (G1–G4)
