# Frontend Implementation Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

## 1. Goal

Extend the existing Supplier module to support: summary cards, SupplierType (Org/Individual), GroupName, IdNumber, IsCustomer, IsInternalObject fields, bulk-delete, and GroupName filter. Route and core infrastructure already exist — this is an incremental extension.

## 2. Scope

**In scope:**
- Summary cards (TotalDebtAmount, TotalCreditAmount, ActiveCount, InactiveCount)
- SupplierType selector (Cá nhân / Tổ chức) in create/edit form
- GroupName field (free-text) in form + list grid column
- IdNumber (CCCD) field in form for Individual type
- IsCustomer and IsInternalObject flags in form
- Bulk delete with confirmation dialog (fail-all semantics)
- GroupName filter in toolbar
- Extend list/detail DTOs with new fields
- Update schema validation: code max 50

**Out of scope (deferred):** import Excel, merge, clone UI, update address UI, transaction ledger, pay/purchase voucher navigation.

**Code discovery:** Route exists at `/categories/suppliers`. Existing code: `supplier.types.ts`, `supplier.api.ts`, `supplier.keys.ts`, `useSuppliers.ts`, `SupplierForm.tsx`, `SupplierListPage.tsx`, `SupplierTable.tsx`.

Note from codebase inspection: existing code already uses `search`/`page`/`sortDir`/`total` — already aligned with API contract. No naming migration needed.

## 3. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Phase 4 API Contract | Approved | Source of truth |
| Phase 2 Pixel Spec | Approved | Visual guidance |
| `@/lib/api/client` | Exists | `api.get/post/put/delete/patch` |
| `@/stores/tenant.store` | Exists | `useTenantStore()` → `tenantId` |
| `@/hooks/usePermissions` | Exists | Permission check hook |
| `@/components/permission/Can` | Exists | Permission-aware render |
| `@/types/api.types` | Exists | `PageResult<T>` matches contract |
| `@/lib/design-tokens` | Exists | Extend with Phase 2 tokens |
| AG Grid | Exists | Used in `SupplierTable.tsx` |
| TanStack Query v5 | Exists | All hooks use `useQuery`/`useMutation` |

## 4. API Contract Mapping

See [04-api-contract-review.md](04-api-contract-review.md) for full contract.

| UI Action | Hook | Method | Endpoint | Permission |
|---|---|---|---|---|
| Load summary cards | `useSupplierSummary` | GET | /api/v1/suppliers/summary | supplier.view |
| Load list | `useSupplierList` (modify) | GET | /api/v1/suppliers | supplier.view |
| Load detail | `useSupplierDetail` (exists) | GET | /api/v1/suppliers/{id} | supplier.view |
| Create supplier | `useCreateSupplier` (modify) | POST | /api/v1/suppliers | supplier.create |
| Update supplier | `useUpdateSupplier` (modify) | PUT | /api/v1/suppliers/{id} | supplier.update |
| Toggle active | `useToggleSupplierActive` (exists) | PATCH | /api/v1/suppliers/{id}/toggle-active | supplier.update |
| Delete single | `useDeleteSupplier` (exists) | DELETE | /api/v1/suppliers/{id} | supplier.delete |
| Bulk delete | `useBulkDeleteSuppliers` (new) | POST | /api/v1/suppliers/bulk-delete | supplier.bulkDelete |
| Export | `useExportSuppliers` (exists) | GET | /api/v1/suppliers/export | supplier.export |

**Agreed params (already in existing code):** `search`, `page`, `pageSize`, `sortBy`, `sortDir`, `isActive`.  
**New param:** `groupName` filter.

## 5. UI Pixel Spec Mapping

| UI Area | Phase 2 Spec | Component | Notes |
|---|---|---|---|
| Summary cards row | §4 Layout — cards 72px height, 12px 16px padding | `SupplierSummaryCards` | 2 cards flex-1, gap 12px |
| Toolbar | §7 — height 40px, gap 8px | `SupplierListPage` toolbar | Add groupName input + bulk-delete btn |
| AG Grid header | §5 tokens — table-header-bg #F0F2F5, height 36px | `SupplierTable` | AG Grid `headerHeight: 36` |
| AG Grid rows | §8 — row 36px, money columns right-aligned | `SupplierTable` | Add groupName, supplierType badge columns |
| Add/Edit modal | §7 — 820px width, type-selector tab at top | `SupplierForm` | Add Cá nhân / Tổ chức tab selector at top |
| Delete modal | §7 — 420px width | `BulkDeleteConfirmDialog` | Reuse existing DeleteConfirmDialog pattern |
| Status badge | §9 Interaction states | `SupplierTable` row | Green/gray badge — unchanged |

## 6. File Change Plan

| # | File | New/Modify | Purpose | Priority |
|---|---|---|---|---|
| 1 | `accounting_web/src/modules/suppliers/supplier.types.ts` | Modify | Add SupplierType enum, extend all interfaces, add SupplierSummary + BulkDeleteInput types | P0 |
| 2 | `accounting_web/src/modules/suppliers/supplier.schema.ts` | Modify | Add supplierType, groupName, idNumber, isCustomer, isInternalObject; code max → 50 | P0 |
| 3 | `accounting_web/src/modules/suppliers/supplier.api.ts` | Modify | Add `summary()` + `bulkDelete()` calls | P0 |
| 4 | `accounting_web/src/modules/suppliers/supplier.keys.ts` | Modify | Add `summary` key | P0 |
| 5 | `accounting_web/src/modules/suppliers/useSuppliers.ts` | Modify | Add `useSupplierSummary`, `useBulkDeleteSuppliers` | P0 |
| 6 | `accounting_web/src/config/permissions.ts` | Modify | Add `Supplier.BulkDelete: "supplier.bulkDelete"` | P0 |
| 7 | `accounting_web/src/modules/suppliers/__mocks__/supplier.mock.ts` | Modify | Extend mock data with new fields + summary mock | P1 |
| 8 | `accounting_web/src/modules/suppliers/components/SupplierSummaryCards.tsx` | **New** | Summary cards (debt/credit/counts) | P0 |
| 9 | `accounting_web/src/modules/suppliers/components/BulkDeleteConfirmDialog.tsx` | **New** | Bulk delete confirmation dialog | P0 |
| 10 | `accounting_web/src/modules/suppliers/components/SupplierForm.tsx` | Modify | Add type selector + all new fields | P0 |
| 11 | `accounting_web/src/modules/suppliers/components/SupplierTable.tsx` | Modify | Add groupName, supplierType columns to grid | P1 |
| 12 | `accounting_web/src/modules/suppliers/pages/SupplierListPage.tsx` | Modify | Add summary cards, groupName filter, bulk-delete button | P0 |
| 13 | `accounting_web/src/modules/suppliers/index.ts` | Modify | Export new hooks and types | P2 |

**Route pages (no changes needed):**
- `accounting_web/src/app/(app)/categories/suppliers/page.tsx` — already renders `SupplierListPage`
- `accounting_web/src/app/(app)/categories/suppliers/[id]/page.tsx` — already renders `SupplierDetailPage`

**Detail page:** `SupplierDetailPage.tsx` will need future update to show new fields (idNumber, isInternalObject) — deferred; not blocking MVP.

## 7. Implementation Steps

1. **Types** — extend `supplier.types.ts`
   - Add `export const SUPPLIER_TYPE = { Organization: 1, Individual: 2 } as const`
   - Add `supplierType: 1|2`, `groupName?: string|null`, `isCustomer: boolean` to `SupplierListItem`
   - Add `idNumber?: string|null`, `isInternalObject: boolean` to `SupplierDetail`
   - Add `supplierType`, `groupName`, `idNumber?`, `isCustomer`, `isInternalObject` to `CreateSupplierInput` / `UpdateSupplierInput`
   - Add `groupName?: string` to `SupplierListQuery`
   - Add `SupplierSummary` interface
   - Add `BulkDeleteInput` interface: `{ ids: string[] }`

2. **Constants** — update `permissions.ts`
   - Add `BulkDelete: "supplier.bulkDelete"` to `PERMISSIONS.Supplier`

3. **Design tokens** — no new file needed; use existing `designTokens` + Phase 2 values inline via Tailwind/CSS vars

4. **API service** — extend `supplier.api.ts`
   - Add `summary: () => api.get<SupplierSummary>(`${BASE}/summary`)`
   - Add `bulkDelete: (input: BulkDeleteInput) => api.post<void>(`${BASE}/bulk-delete`, input)`
   - Ensure `exportFile` passes `groupName` param

5. **Query key factory** — extend `supplier.keys.ts`
   - Add `summary: (tenantId: string) => [...supplierKeys.all(tenantId), "summary"] as const`

6. **React Query hooks** — extend `useSuppliers.ts`
   - Add `useSupplierSummary()` — `useQuery` with `supplierKeys.summary(tid)`, enabled when `!!tenantId`
   - Add `useBulkDeleteSuppliers()` — `useMutation`, on success: `qc.invalidateQueries(supplierKeys.all(tid))` + `qc.invalidateQueries(supplierKeys.summary(tid))`

7. **Mock data** — update `__mocks__/supplier.mock.ts`
   - Add `supplierType: 1`, `groupName: "Nhóm A"`, `isCustomer: false` to list mocks
   - Add `idNumber: null`, `isInternalObject: false` to detail mocks
   - Add `mockSupplierSummary` constant

8. **Schema** — update `supplier.schema.ts`
   - `code` max: 32 → 50
   - Add `supplierType: z.union([z.literal(1), z.literal(2)])` — required
   - Add `groupName?: string max 100`
   - Add `idNumber?: string max 32` — conditional (Individual type)
   - Add `isCustomer: z.boolean().default(false)`
   - Add `isInternalObject: z.boolean().default(false)`

9. **New component: `SupplierSummaryCards.tsx`**
   - Props: `summary: SupplierSummary | undefined`, `isLoading: boolean`
   - Renders 2 Card components (flex row): NCC nợ cần trả (totalDebtAmount), Trả trước (totalCreditAmount)
   - Skeleton loading state
   - Money format: Vietnamese locale (e.g. `1.234.567,89`)
   - Token references: card-bg white, border #E0E3E9, card height 72px, padding 12px 16px

10. **New component: `BulkDeleteConfirmDialog.tsx`**
    - Props: `open`, `ids: string[]`, `onClose`, `onConfirm`
    - Uses `useBulkDeleteSuppliers` mutation
    - Shows count and warning
    - On 409: shows error toast with "Có nhà cung cấp đã phát sinh giao dịch" message
    - On success: toast success + `onClose()`
    - Width: 420px (matches Phase 2 delete modal spec)

11. **Extend `SupplierForm.tsx`**
    - Add type selector tabs at top: "Cá nhân" / "Tổ chức" (controlled by `supplierType` field)
    - Conditionally show `idNumber` field only when `supplierType === 2` (Individual)
    - Add `groupName` text input
    - Add `isCustomer` checkbox (Là khách hàng)
    - Add `isInternalObject` checkbox (Là đối tượng nội bộ) — show only for Organization
    - Update schema to `supplierFormSchema` with new fields
    - In edit mode: `code` field is read-only (immutable per contract)

12. **Extend `SupplierTable.tsx`**
    - Add `groupName` column (120px, left-aligned)
    - Add `supplierType` badge column or merge into existing display

13. **Extend `SupplierListPage.tsx`**
    - Mount `SupplierSummaryCards` above toolbar (uses `useSupplierSummary`)
    - Add `groupName` text input filter to toolbar
    - Add bulk-delete button (visible when `selectedIds.length > 0`, guarded by `Can BulkDelete`)
    - Wire `BulkDeleteConfirmDialog` open/close
    - Pass `groupName` to `query` and `updateQuery`

## 8. Data Flow

```
URL params → query object → useSupplierList(query) → supplierApi.list(params) → GET /api/v1/suppliers
                                                   ↓
                                          SupplierTable (rows)

tenantId → useSupplierSummary() → supplierApi.summary() → GET /api/v1/suppliers/summary
                                                        ↓
                                           SupplierSummaryCards

selectedIds + confirm → useBulkDeleteSuppliers() → supplierApi.bulkDelete({ids})
  → POST /api/v1/suppliers/bulk-delete
  → onSuccess: invalidate all + summary keys
  → onError 409: toast error "Có nhà cung cấp đã phát sinh giao dịch"

SupplierForm submit → useCreateSupplier / useUpdateSupplier
  → invalidate lists + summary (summary counts change on create/delete)
```

## 9. Query Key Strategy

| Key | Structure | Invalidated By |
|---|---|---|
| `supplierKeys.all(tid)` | `["suppliers", tid]` | Bulk delete, toggle active |
| `supplierKeys.lists(tid)` | `["suppliers", tid, "list"]` | Create, update, delete, bulk-delete, toggle |
| `supplierKeys.list(tid, q)` | `["suppliers", tid, "list", q]` | — |
| `supplierKeys.detail(tid, id)` | `["suppliers", tid, "detail", id]` | Update, toggle |
| `supplierKeys.summary(tid)` | `["suppliers", tid, "summary"]` | Create, delete, bulk-delete |

All keys include `tenantId` — tenant switch triggers full invalidation via Zustand `useTenantStore` subscription.

## 10. Permission Strategy

| Permission | Constant | UI Effect |
|---|---|---|
| `supplier.view` | `PERMISSIONS.Supplier.View` | `PermissionGuard` wraps page; redirect if missing |
| `supplier.create` | `PERMISSIONS.Supplier.Create` | `Can` hides "Thêm mới" button |
| `supplier.update` | `PERMISSIONS.Supplier.Update` | `Can` hides "Sửa" row action |
| `supplier.delete` | `PERMISSIONS.Supplier.Delete` | `Can` hides "Xóa" row action |
| `supplier.bulkDelete` | `PERMISSIONS.Supplier.BulkDelete` | `Can` hides "Xóa nhiều" bulk-delete button |
| `supplier.export` | `PERMISSIONS.Supplier.Export` | `Can` hides "Xuất ra Excel" button |
| `supplier.updateAddress` | `PERMISSIONS.Supplier.UpdateAddress` | `Can` hides "Xác nhận địa chỉ NCC" button |

Use `<Can permission={PERMISSIONS.Supplier.BulkDelete}>` — do not inline permission strings.

## 11. Multi-tenant Strategy

- All query keys include `tenantId` from `useTenantStore()`
- `enabled: !!tenantId` on all `useQuery` hooks
- On tenant switch: Zustand store updates → stale query keys → TanStack Query refetches automatically
- No `tenantId` in request body or URL — backend reads from JWT

## 12. Pixel-perfect Coding Strategy

| Aspect | Strategy |
|---|---|
| Summary cards | `flex flex-row gap-3` container; each card: `flex-1 h-[72px] px-4 py-3 rounded-lg border` |
| Card bg / border | Tailwind classes mapping to token: bg-white, border-[#E0E3E9] or `designTokens.misc.border` |
| AG Grid row height | Already set `rowHeight: 36` — retain |
| AG Grid header | Already uses token bg — retain and ensure new columns inherit same style |
| Money format | `new Intl.NumberFormat('vi-VN', { style: 'decimal', minimumFractionDigits: 0 })` — existing `format.ts` utility |
| Type selector | Tab-style buttons at top of modal, not a dropdown — per Phase 2 §10: "type selector tab at top" |
| Form modal width | 820px via `max-w-[820px]` on Dialog content — per Phase 2 §7 |
| Negative debt | Display red text if `currentDebtAmount < 0` — per Phase 1 business rules |
| Delete dialog width | 420px via `max-w-[420px]` on Dialog content |

## 13. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| SupplierForm gets too large with new fields | Med | Use collapsible sections or tab layout from screenshots |
| supplierType conditional logic in schema | Low | Zod `superRefine` for cross-field validation |
| Bulk delete 409 UX | Med | Catch and display affected names (if API returns affectedIds) |
| Summary cards flicker on mount | Low | Show skeleton while `isLoading`; don't show 0 values during load |
| groupName filter adds a second text input in toolbar | Low | Keep simple text input; toolbar wraps gracefully per Phase 2 responsive spec |

## 14. Checklist Before Coding

- [x] API contract approved (Phase 4)
- [x] UI pixel spec approved (Phase 2)
- [x] Existing code structure understood (types, api, hooks, components)
- [x] Route exists — no new route needed
- [x] All new permissions documented
- [x] Mock data plan ready
- [x] Summary card layout specified from Phase 2
- [x] Bulk-delete dialog spec defined

## 15. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P5-A1 | Detail view is separate route (confirmed by `/[id]/page.tsx`). Split-panel P2-Q3 resolved: no split-panel. | No | Resolves P2-Q3 |
| P5-A2 | `format.ts` utility used for money formatting — assumed to handle Vietnamese locale. | No | Verify in Phase 8 |
| P5-A3 | `SupplierTable.tsx` uses AG Grid ColDef array — new columns appended before action column | No | Check column order in Phase 8 |
| P5-Q1 | BulkDeleteConfirmDialog: show list of affected supplier names? API returns `affectedIds` but not names — need a lookup or just show IDs. | No | Default: show count only, not names |

## 16. Definition of Done

- [ ] File change plan covers all new types, hooks, components, and page changes
- [ ] API contract mapping complete for all 9 endpoints
- [ ] UI pixel spec mapped to all components
- [ ] Query key strategy includes tenantId and summary invalidation
- [ ] Permission strategy covers all 7 permissions
- [ ] Implementation steps are ordered by dependency (types → api → hooks → components → page)
- [ ] No source code created or modified in this phase
