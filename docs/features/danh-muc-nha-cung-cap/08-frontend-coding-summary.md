# Frontend Coding Summary: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No

---

## 1. Goal

Implement frontend source code for Supplier Management (danh mục nhà cung cấp) per Phase 1 design, Phase 4 API contract, and Phase 5 implementation plan. All 8 active API endpoints integrated. Build 0 errors. TypeScript check passed.

---

## 2. Files Created (10 new files)

| File | Purpose |
|---|---|
| `src/components/grid/PaginationBar.tsx` | Shared server-side pagination bar (total, page size, prev/next) |
| `src/modules/suppliers/supplier.keys.ts` | Query key factory with tenantId |
| `src/modules/suppliers/components/SupplierRowActions.tsx` | Per-row ▼ dropdown (Sửa / Nhân bản / Ngừng/Sử dụng / Xóa) |
| `src/modules/suppliers/components/SupplierFormDialog.tsx` | Dialog wrapper — create / edit / clone modes |
| `src/modules/suppliers/components/DeleteConfirmDialog.tsx` | Delete confirm + 409 error state |
| `src/modules/suppliers/components/BulkAddressConfirmDialog.tsx` | Bulk address update dialog (Xác nhận địa chỉ NCC) |
| `src/modules/suppliers/pages/SupplierDetailPage.tsx` | Detail info card page |
| `src/modules/suppliers/__mocks__/supplier.mock.ts` | 5 static mock SupplierListItem records |
| `src/app/(app)/categories/suppliers/page.tsx` | Next.js route → SupplierListPage (Suspense wrapped) |
| `src/app/(app)/categories/suppliers/[id]/page.tsx` | Next.js route → SupplierDetailPage |

---

## 3. Files Modified (11 existing files)

| File | Change |
|---|---|
| `src/modules/suppliers/supplier.types.ts` | Split Supplier → SupplierListItem + SupplierDetail; added BulkUpdateAddressInput; fixed SupplierListQuery (sortBy/sortDir/isActive); fixed inputs (removed isActive, added bankAccount) |
| `src/modules/suppliers/supplier.schema.ts` | Removed isActive field; added bankAccount; added bulkUpdateAddressSchema |
| `src/modules/suppliers/supplier.api.ts` | Fixed BASE → `/api/v1/suppliers`; added toggleActive, bulkUpdateAddress, exportFile; removed clone endpoint |
| `src/modules/suppliers/useSuppliers.ts` | Added tenantId to all query keys; added useToggleSupplierActive, useBulkUpdateSupplierAddress, useExportSuppliers; renamed hooks for clarity |
| `src/modules/suppliers/components/SupplierForm.tsx` | Removed isActive; added bankAccount; added "Cất và Thêm" button; added mode/codePlaceholder props |
| `src/modules/suppliers/components/SupplierTable.tsx` | Full rewrite: Phase 2 columns, filter:false, designTokens sizes, DebtCell renderer, PurchaseVoucherCell, AG Grid context, onSortChanged sync, row selection |
| `src/modules/suppliers/pages/SupplierListPage.tsx` | Full rewrite: URL-derived state, debounced search, isActive filter, full CRUD via dialogs, export, bulk address, AG Grid sort sync, PaginationBar |
| `src/modules/suppliers/index.ts` | Exported all new files |
| `src/config/permissions.ts` | Added Supplier group (View/Create/Update/Delete/Export/UpdateAddress/CreatePurchaseVoucher); kept Suppliers group untouched |
| `src/config/routes.ts` | Updated href → `/categories/suppliers`, permission → `PERMISSIONS.Supplier.View` |
| `src/app/(app)/suppliers/page.tsx` | Replaced with `redirect('/categories/suppliers')` |

---

## 4. API Integration

| Endpoint | Method | Hook | Status |
|---|---|---|---|
| GET /api/v1/suppliers | list | `useSupplierList` | ✅ Implemented |
| GET /api/v1/suppliers/{id} | getById | `useSupplierDetail` | ✅ Implemented |
| POST /api/v1/suppliers | create | `useCreateSupplier` | ✅ Implemented (create + clone) |
| PUT /api/v1/suppliers/{id} | update | `useUpdateSupplier` | ✅ Implemented |
| DELETE /api/v1/suppliers/{id} | delete | `useDeleteSupplier` | ✅ Implemented |
| PATCH /api/v1/suppliers/{id}/toggle-active | toggleActive | `useToggleSupplierActive` | ✅ Implemented |
| PUT /api/v1/suppliers/bulk-update-address | bulkUpdateAddress | `useBulkUpdateSupplierAddress` | ✅ Implemented |
| GET /api/v1/suppliers/export | exportFile | `useExportSuppliers` | ✅ Implemented |
| ~~POST /api/v1/suppliers/{id}/clone~~ | — | — | ❌ Not called (clone = POST /suppliers per plan) |

---

## 5. Design Tokens Applied

| Element | Token | Value |
|---|---|---|
| Grid row height | `designTokens.size.gridRowHeight` | 34px |
| Grid header height | `designTokens.size.gridHeaderHeight` | 36px |
| Negative debt color | `designTokens.colors.tint.emphasis` | `#E74C3C` |
| Purchase voucher link | `designTokens.colors.text.link` | `#007AFF` |

---

## 6. Implementation Notes

- **Clone = POST /suppliers**: User edits prefilled form (code empty with `{code}-COPY` placeholder), submit calls `useCreateSupplier`. No `/clone` endpoint called.
- **isActive filter default**: URL `isActive` absent → `true` (active only). Dropdown: Đang sử dụng / Ngừng sử dụng / Tất cả.
- **Delete 409**: `DeleteConfirmDialog` catches CONFLICT AppError, switches to error state showing backend message. TODO comment left for "Xem phát sinh" link.
- **Sort sync**: AG Grid `onSortChanged` → `updateQuery({ sortBy, sortDir })` → URL → `useSupplierList` refetches. Sort indicator reflects user clicks only (not external URL state).
- **tenantId null guard**: `tenantId ?? ""` used in all `supplierKeys.*` calls. Queries `enabled: !!tenantId` prevent fetches before tenant is set.
- **Suspense boundary**: `categories/suppliers/page.tsx` wraps `SupplierListPage` in `<Suspense>` (required for `useSearchParams` in Next.js 15).
- **P5-A1 confirmed**: Grepped `PERMISSIONS.Suppliers` — only used in old `SupplierListPage.tsx` (now rewritten) and `permissions.ts`. Both updated. Old group kept for safety.
- **P5-A4 confirmed**: `api.get<Blob>(..., { responseType: 'blob' })` works via `apiClient.get<T>(url, config)`.

---

## 7. Known Stubs / TODOs

| ID | Item | Location |
|---|---|---|
| P3-A2 | "Xem phát sinh" link — navigate to purchase voucher transactions | `DeleteConfirmDialog.tsx:44` |
| P5-A3 | "Lập CT mua hàng" route: `/accounting/purchase-vouchers/create?supplierId=...` | `SupplierTable.tsx PurchaseVoucherCell` |

---

## 8. Acceptance Criteria Status

| # | Criterion | Status |
|---|---|---|
| 1 | List hiển thị với AG Grid, phân trang server-side từ URL params | ✅ |
| 2 | Tìm kiếm debounce 300ms; page reset về 1 khi search thay đổi | ✅ |
| 3 | Create/Edit/Delete/Toggle — CRUD đầy đủ với toast notifications | ✅ |
| 4 | Delete block 409 khi NCC có phát sinh, hiển thị error state | ✅ |
| 5 | Negative currentDebtAmount hiển thị màu đỏ | ✅ |
| 6 | "Cất và Thêm" hoạt động đúng | ✅ |
| 7 | isActive filter dropdown; default "Đang sử dụng"; URL param đồng bộ | ✅ |
| 8 | Export Excel download .xlsx theo filter/search hiện tại | ✅ |
| 9 | "Nhân bản" → SupplierFormDialog prefilled, mã trống, POST create | ✅ |
| 10 | Delete 409 → error state trong dialog (không chỉ toast) | ✅ |
| 11 | bankAccount field có trong SupplierForm; không hiển thị cột trong grid | ✅ |
| 12 | "Lập CT mua hàng" column hiển thị; hidden khi không có permission | ✅ |
| 13 | Bulk address update dialog hoạt động; hidden khi không có permission | ✅ |
| 14 | Permission-based UI — hide actions khi không có quyền | ✅ |
| 15 | supplier.view redirect về /dashboard khi không có quyền | ✅ |
| 16 | tenantId trong query key; switch tenant → list tự làm mới | ✅ |
| 17 | Loading / Empty / Error states hiển thị đúng | ✅ |

---

## 9. How to Run

```bash
# Start backend (if needed)
cd accounting_api
dotnet run --project src/Api/AccountingApi.Api.csproj

# Start frontend
cd accounting_web
pnpm dev

# Navigate to
http://localhost:3000/categories/suppliers
```

---

## 10. Next Step: Phase 9 — Frontend Visual Review

Run the app, navigate to `/categories/suppliers`, and capture screenshots for pixel-perfect comparison with Phase 2 spec.
