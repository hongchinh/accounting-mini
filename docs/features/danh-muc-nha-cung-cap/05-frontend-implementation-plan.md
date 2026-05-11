# Frontend Implementation Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Review Status: Approved
Approved At: 2026-05-08
Blocking Issues: No
User Confirmation Required: No

---

## 1. Goal
Implement the complete Supplier Management frontend: list page with search/filter/sort/pagination, full CRUD dialogs, row actions (edit/clone/toggle/delete), export, bulk address update — all pixel-perfect per Phase 2 spec and wired to Phase 4 API contract.

## 2. Scope
- Update/rewrite existing suppliers module to match Phase 4 contract
- Correct API base URL, add missing endpoints, fix query keys, permissions
- Build 9 new components/pages/routes + 1 shared PaginationBar component
- Fix route from `/suppliers` → `/categories/suppliers`
- **Clone = "create with prefill"** (POST /suppliers): user pre-fills from source supplier and edits code. `POST /clone` endpoint is NOT called from frontend.

## 3. Dependencies
| Dependency | Location | Status |
|---|---|---|
| `DataGrid`, `GridEmptyState`, `GridErrorState`, `GridLoadingState` | `src/components/grid/` | Exists |
| `Button`, `Dialog`, `Select`, `Input`, `Card` | `src/components/ui/` | Exists |
| `Can`, `PermissionGuard` | `src/components/permission/` + `src/components/auth/` | Exists |
| `usePermissions` | `src/hooks/usePermissions.ts` | Exists |
| `useTenantStore` | `src/stores/tenant.store.ts` | Exists |
| `api` (apiClient) | `src/lib/api/client.ts` | Exists |
| `PageResult<T>` | `src/types/api.types.ts` | Exists |
| `designTokens` | `src/lib/design-tokens.ts` | Exists — actual project tokens |
| `toast` (sonner) | `sonner` | Exists |
| AG Grid Community | `ag-grid-community` + `ag-grid-react` | Exists |

**DataGrid notes (from code review):**
- `defaultColDef.filter = true` → must override with `filter: false` in all supplier column defs (server-side filtering via toolbar)
- `defaultColDef.sortable = true` → keep (shows sort arrow UI) but intercept `onSortChanged` to sync to URL
- `height = 480` default → override via `height` prop; use `calc(100vh - 320px)` for list page
- Pagination: DataGrid has NO built-in pagination → need custom `PaginationBar`
- `rowHeight`/`headerHeight` → pass via `gridOptions` prop

## 4. API Contract Mapping
See `04-api-contract-review.md` §6.5 for full contracts.

| Function | Method + Route | Hook | Note |
|---|---|---|---|
| `getSuppliers(query)` | GET /api/v1/suppliers | `useSupplierList` | |
| `getSupplierById(id)` | GET /api/v1/suppliers/{id} | `useSupplierDetail` | |
| `createSupplier(data)` | POST /api/v1/suppliers | `useCreateSupplier` | Used for both Create and Clone |
| `updateSupplier(id, data)` | PUT /api/v1/suppliers/{id} | `useUpdateSupplier` | |
| `deleteSupplier(id)` | DELETE /api/v1/suppliers/{id} | `useDeleteSupplier` | |
| `toggleSupplierActive(id)` | PATCH /api/v1/suppliers/{id}/toggle-active | `useToggleSupplierActive` | |
| `bulkUpdateSupplierAddress(data)` | PUT /api/v1/suppliers/bulk-update-address | `useBulkUpdateSupplierAddress` | |
| `exportSuppliers(query)` | GET /api/v1/suppliers/export | `useExportSuppliers` (mutation) | Returns Blob |
| ~~`cloneSupplier(id)`~~ | ~~POST /api/v1/suppliers/{id}/clone~~ | ~~removed~~ | Not used — clone = POST /suppliers |

## 5. UI Pixel Spec Mapping

| UI Area | Actual Token (lib/design-tokens.ts) | Phase 2 Estimate | Implementation Note |
|---|---|---|---|
| Grid row height | `designTokens.size.gridRowHeight` = 34px | 44px | `gridOptions={{ rowHeight: 34 }}` |
| Grid header height | `designTokens.size.gridHeaderHeight` = 36px | 40px | `gridOptions={{ headerHeight: 36 }}` |
| Input height | `designTokens.size.inputHeight` = 36px | 32px | Use actual token |
| Button height | `designTokens.size.buttonMediumHeight` = 36px | 32px | Use actual token |
| Negative debt color | `designTokens.colors.tint.emphasis` = `#E74C3C` | `#ef4444` | Use actual token |
| Text link color | `designTokens.colors.text.link` = `#007AFF` | `#2563eb` | Use actual token |
| Table header bg | `designTokens.colors.misc.tableHeaderBackground` = `#E0E6EC` | `#f9fafb` | Use actual token |
| Page bg | `designTokens.colors.background.primary` = `#F1F4F7` | `#f5f6fa` | Use actual token |
| Primary color | `designTokens.colors.tint.primary` = `#F7944E` | `#f97316` | Use actual token |
| Toolbar card | White card, `flex items-center gap-2 px-4` | 52px height | Match GridToolbar pattern |
| Dialog widths | `max-w-[720px]` / `max-w-[900px]` / `max-w-[400px]` | Same | Pass to DialogContent |
| Column widths | Mã:120, Tên:200, Địa chỉ:180, SĐT:110, Nợ:130, Lập CT:120, Action:80 | Same | Explicit `width`/`minWidth` |

**Actual design tokens override Phase 2 estimates. Use tokens exclusively.**

## 6. File Change Plan

### Create (9 new files)
| File | Purpose |
|---|---|
| `src/components/grid/PaginationBar.tsx` | Shared server-side pagination bar (total, page, pageSize, prev/next) |
| `src/modules/suppliers/supplier.keys.ts` | Query key factory with `tenantId` |
| `src/modules/suppliers/components/SupplierRowActions.tsx` | Per-row ▼ dropdown: Sửa/Nhân bản/Ngừng/Xóa — receives callbacks via AG Grid context |
| `src/modules/suppliers/components/SupplierFormDialog.tsx` | Dialog wrapper (create + edit + clone mode) |
| `src/modules/suppliers/components/DeleteConfirmDialog.tsx` | Delete confirm with 409 error state + TODO "Xem phát sinh" |
| `src/modules/suppliers/components/BulkAddressConfirmDialog.tsx` | Bulk address update dialog (900px) — receives selectedIds from page |
| `src/modules/suppliers/pages/SupplierDetailPage.tsx` | Detail info card page |
| `src/app/(app)/categories/suppliers/page.tsx` | Next.js route → SupplierListPage |
| `src/app/(app)/categories/suppliers/[id]/page.tsx` | Next.js route → SupplierDetailPage |

### Update (11 existing files)
| File | Change |
|---|---|
| `src/modules/suppliers/supplier.types.ts` | Split Supplier → SupplierListItem + SupplierDetail; fix SupplierListQuery (add sortBy/sortDir/isActive); fix inputs |
| `src/modules/suppliers/supplier.schema.ts` | Remove `isActive`; add `bankAccount`; add `bulkUpdateAddressSchema` |
| `src/modules/suppliers/supplier.api.ts` | Fix BASE to `/api/v1/suppliers`; add toggleActive, bulkUpdateAddress, exportFile; remove clone |
| `src/modules/suppliers/useSuppliers.ts` | Add `tenantId` to keys via `supplier.keys.ts`; add useToggleSupplierActive, useBulkUpdateSupplierAddress, useExportSuppliers; remove useCloneSupplier |
| `src/config/permissions.ts` | Add `Supplier` group with `supplier.*` values; keep old `Suppliers.*` group untouched |
| `src/config/routes.ts` | Update href `/suppliers` → `/categories/suppliers`; update permission to `PERMISSIONS.Supplier.View` |
| `src/modules/suppliers/components/SupplierTable.tsx` | Rewrite: Phase 2 columns, `filter:false` per column, rowHeight/headerHeight via gridOptions, negative debt cellRenderer, action column, AG Grid context, onSortChanged |
| `src/modules/suppliers/components/SupplierForm.tsx` | Remove `isActive`; add `bankAccount`; add "Cất và Thêm" button |
| `src/modules/suppliers/pages/SupplierListPage.tsx` | Rewrite: URL-derived state, isActive filter, row selection for bulk address, full CRUD, export |
| `src/modules/suppliers/index.ts` | Export new files |
| `src/app/(app)/suppliers/page.tsx` | Replace with `redirect('/categories/suppliers')` |

## 7. Implementation Steps

**Step 1 — Types** (`supplier.types.ts`):
```typescript
export interface SupplierListItem {
  id: string; code: string; name: string; taxCode?: string | null;
  phone?: string | null; address?: string | null; isActive: boolean;
  currentDebtAmount?: number | null; createdAt: string; updatedAt?: string | null;
}
export interface SupplierDetail extends SupplierListItem {
  email?: string | null; bankAccount?: string | null;
}
export interface SupplierListQuery {
  search?: string; isActive?: boolean | 'all'; page?: number; pageSize?: number;
  sortBy?: 'code' | 'name' | 'currentDebtAmount' | 'updatedAt' | 'createdAt';
  sortDir?: 'asc' | 'desc';
}
// isActive: true = active only | false = inactive only | undefined/'all' = all records
export interface CreateSupplierInput {
  code: string; name: string; taxCode?: string; email?: string;
  phone?: string; address?: string; bankAccount?: string;
}
export interface UpdateSupplierInput {
  name: string; taxCode?: string; email?: string;
  phone?: string; address?: string; bankAccount?: string;
}
export interface BulkUpdateAddressInput { ids: string[]; address: string; }
```

**Step 2 — Constants** (`config/permissions.ts`):
Add new group alongside existing (do not modify `Suppliers.*`):
```typescript
Supplier: {
  View: 'supplier.view', Create: 'supplier.create', Update: 'supplier.update',
  Delete: 'supplier.delete', Export: 'supplier.export',
  UpdateAddress: 'supplier.updateAddress', CreatePurchaseVoucher: 'supplier.createPurchaseVoucher',
}
```
Update `routes.ts`: `href: '/categories/suppliers'` + `permission: PERMISSIONS.Supplier.View`.

**Step 3 — Design tokens**: Import from `@/lib/design-tokens` — no new file needed.

**Step 4 — API service** (`supplier.api.ts`):
```typescript
const BASE = '/api/v1/suppliers';

export const supplierApi = {
  list: (params?: SupplierListQuery) => api.get<PageResult<SupplierListItem>>(BASE, { params }),
  getById: (id: string) => api.get<SupplierDetail>(`${BASE}/${id}`),
  create: (input: CreateSupplierInput) => api.post<SupplierDetail>(BASE, input),
  update: (id: string, input: UpdateSupplierInput) => api.put<SupplierDetail>(`${BASE}/${id}`, input),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
  toggleActive: (id: string) => api.patch<SupplierDetail>(`${BASE}/${id}/toggle-active`),
  bulkUpdateAddress: (data: BulkUpdateAddressInput) =>
    api.put<{ updatedCount: number }>(`${BASE}/bulk-update-address`, data),
  exportFile: (params?: Omit<SupplierListQuery, 'page' | 'pageSize'>) =>
    api.get<Blob>(`${BASE}/export`, { params, responseType: 'blob' }),
};
```

**Step 5 — Query key factory** (`supplier.keys.ts`):
```typescript
export const supplierKeys = {
  all:     (tenantId: string) => ['suppliers', tenantId] as const,
  lists:   (tenantId: string) => [...supplierKeys.all(tenantId), 'list'] as const,
  list:    (tenantId: string, q: SupplierListQuery) =>
             [...supplierKeys.lists(tenantId), q] as const,
  details: (tenantId: string) => [...supplierKeys.all(tenantId), 'detail'] as const,
  detail:  (tenantId: string, id: string) =>
             [...supplierKeys.details(tenantId), id] as const,
};
```

**Step 6 — React Query hooks** (`useSuppliers.ts`):
```typescript
// Capture tenantId outside callback (hooks rule)
export const useSupplierList = (query: SupplierListQuery) => {
  const { tenantId } = useTenantStore();
  return useQuery({ queryKey: supplierKeys.list(tenantId, query),
    queryFn: () => supplierApi.list(query) });
};
export const useSupplierDetail = (id: string | undefined) => {
  const { tenantId } = useTenantStore();
  return useQuery({ queryKey: supplierKeys.detail(tenantId, id ?? ''),
    queryFn: () => supplierApi.getById(id!), enabled: !!id });
};
// Mutations: capture tenantId at hook level, use in onSuccess
export const useCreateSupplier = () => {
  const { tenantId } = useTenantStore(); const qc = useQueryClient();
  return useMutation({ mutationFn: supplierApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.lists(tenantId) }) });
};
// ... same pattern for useUpdateSupplier, useDeleteSupplier, useToggleSupplierActive, useBulkUpdateSupplierAddress

// Export: useMutation, download in onSuccess
export const useExportSuppliers = () =>
  useMutation({
    mutationFn: (params: Omit<SupplierListQuery, 'page' | 'pageSize'>) =>
      supplierApi.exportFile(params),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'suppliers.xlsx'; a.click();
      URL.revokeObjectURL(url);
    },
  });
```

**Step 7 — Mock data**: Create `src/modules/suppliers/__mocks__/supplier.mock.ts` with 5 static `SupplierListItem` records (including one with negative `currentDebtAmount`). Usage: import directly in dev/testing — NOT MSW (MSW setup is separate and out of this phase's scope).

**Step 8 — Shared component**: `src/components/grid/PaginationBar.tsx`:
```typescript
interface PaginationBarProps {
  total: number; page: number; pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
// Renders: "365 bản ghi" | PageSizeSelect | Prev button | "1 / 20" | Next button
```

**Step 9 — Components**:

`SupplierTable` — key implementation notes:
- `"use client"` directive required
- Column defs: all with `filter: false` (override DataGrid defaultColDef)
- Pass `gridOptions={{ rowHeight: 34, headerHeight: 36, rowSelection: 'multiple', suppressMultiSort: true, onSortChanged, context: { onEdit, onDelete, onToggle, onClone } }}`
- `onSortChanged`: extract `api.getColumnState()` → find sorted col → call `onSortChange(colId, direction)` callback (lifted to page)
- Negative debt: `cellRenderer` component:
  ```tsx
  const DebtCell = ({ value }: ICellRendererParams) =>
    value == null ? null : value < 0
      ? <span style={{ color: designTokens.colors.tint.emphasis }}>({Math.abs(value).toLocaleString('vi')})</span>
      : <span>{value.toLocaleString('vi')}</span>;
  ```
- "Lập CT mua hàng": `cellRenderer` — hide entire column when `!can('supplier.createPurchaseVoucher')` via `hide: !canCreatePV` in ColDef
- Action column: `cellRenderer` = `SupplierRowActions` — reads `{ onEdit, onDelete, onToggle, onClone }` from `params.context`

`SupplierRowActions` props: `{ supplier: SupplierListItem }` — reads callbacks from AG Grid `params.context`.

`SupplierFormDialog` modes:
- `create`: empty form → `useCreateSupplier`
- `edit`: `editingId` → `useSupplierDetail(editingId)` lazy fetch inside dialog → form fills when loaded → `useUpdateSupplier`
- `clone`: `cloningSupplierId` → `useSupplierDetail(cloningSupplierId)` lazy fetch → form prefills (all fields except code — code shows suggestion `{code}-COPY`, empty input, user must type valid code) → submit calls `useCreateSupplier` (POST /suppliers)

`DeleteConfirmDialog` two states:
- Default: "Bạn có chắc muốn xóa X?" + Hủy / Xóa buttons
- 409 error state: "X đã có {n} phát sinh. Không thể xóa." + Đóng button + `{/* TODO: add "Xem phát sinh" link when purchase voucher route exists */}`

`BulkAddressConfirmDialog`: receives `selectedIds: string[]` prop from page (IDs from AG Grid selection).

**Step 10 — Page** (`SupplierListPage`):

URL param state — derive from `useSearchParams`, never `useState`:
```typescript
const searchParams = useSearchParams();
const router = useRouter();
const query: SupplierListQuery = {
  search: searchParams.get('search') ?? undefined,
  page: Number(searchParams.get('page') ?? 1),
  pageSize: Number(searchParams.get('pageSize') ?? 20),
  isActive: searchParams.get('isActive') === 'false' ? false
          : searchParams.get('isActive') === 'all' ? undefined : true,
  sortBy: (searchParams.get('sortBy') as SupplierListQuery['sortBy']) ?? undefined,
  sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') ?? undefined,
};
const updateQuery = (patch: Partial<Record<string, string | null>>) => {
  const p = new URLSearchParams(searchParams.toString());
  Object.entries(patch).forEach(([k, v]) => v == null ? p.delete(k) : p.set(k, v));
  if (patch.search !== undefined) p.set('page', '1'); // reset page on search change
  router.replace(`?${p}`);
};
```

Row selection for BulkAddressConfirmDialog:
```typescript
const [selectedIds, setSelectedIds] = useState<string[]>([]);
// SupplierTable gridOptions.onSelectionChanged = (e) =>
//   setSelectedIds(e.api.getSelectedRows().map(r => r.id))
```
"Xác nhận địa chỉ NCC" button active only when `selectedIds.length > 0`.

Callbacks passed via AG Grid context:
```typescript
const gridContext = useMemo(() => ({
  onEdit: (s: SupplierListItem) => setEditingId(s.id),
  onDelete: (s: SupplierListItem) => setDeletingSupplier(s),
  onToggle: (s: SupplierListItem) => toggleMutation.mutate(s.id, { onSuccess: ... }),
  onClone: (s: SupplierListItem) => setCloningId(s.id),
}), [toggleMutation]);
```

Sort sync from AG Grid → URL: column click → `onSortChanged` callback → `updateQuery({ sortBy: colId, sortDir: direction })`.

**Step 11 — Routes**:
- Create `src/app/(app)/categories/suppliers/page.tsx`:
  ```tsx
  import { Suspense } from 'react';
  export default function SuppliersPage() {
    return <Suspense fallback={<div>Loading...</div>}><SupplierListPage /></Suspense>;
  }
  ```
  Suspense is required because `SupplierListPage` uses `useSearchParams`.
- Create `src/app/(app)/categories/suppliers/[id]/page.tsx` → `<SupplierDetailPage />`
- Update `src/app/(app)/suppliers/page.tsx` → `redirect('/categories/suppliers')`

**Step 12 — Permission UI**:
- Page: `<PermissionGuard permission={PERMISSIONS.Supplier.View} redirectTo="/dashboard">`
- "Thêm": `<Can permission={PERMISSIONS.Supplier.Create}>`
- "Xuất Excel" dropdown: `<Can permission={PERMISSIONS.Supplier.Export}>`
- "Xác nhận địa chỉ NCC": `<Can permission={PERMISSIONS.Supplier.UpdateAddress}>` (only active when `selectedIds.length > 0`)
- Row actions: `SupplierRowActions` reads `can(...)` for each item visibility

**Step 13 — Loading / empty / error states**:
- Grid: pass `isLoading`, `error`, `onRetry` to `DataGrid`
- Empty (no search): `emptyState={<GridEmptyState message="Chưa có nhà cung cấp nào" />}`
- Empty (search active): `emptyState={<GridEmptyState message="Không tìm thấy nhà cung cấp phù hợp" />}`

**Step 14 — Visual review checklist**: `data-testid` on page, toolbar, grid, pagination.

## 8. Data Flow

```
URL params (useSearchParams) → query object
  → useSupplierList(tenantId, query)
  → supplierApi.list(query) → GET /api/v1/suppliers?...
  → PageResult<SupplierListItem>
  → SupplierTable rowData + PaginationBar total/page

User sorts column:
  AG Grid onSortChanged → updateQuery({ sortBy, sortDir }) → router.replace
  → new URL → new query → useSupplierList refetches with new sort

Edit flow:
  click "Sửa" → setEditingId(id) → SupplierFormDialog opens
  → useSupplierDetail(editingId) fires → skeleton → form fills
  → submit → useUpdateSupplier → invalidate lists + detail → toast

Export flow:
  click "Xuất Excel" → exportMutation.mutate(currentFilterQuery)
  → supplierApi.exportFile → GET /api/v1/suppliers/export → Blob
  → URL.createObjectURL → <a>.click() → download suppliers.xlsx
```

## 9. Query Key Strategy
```typescript
const { tenantId } = useTenantStore(); // captured at hook level

queryKey: supplierKeys.list(tenantId, query)    // list with full query shape
queryKey: supplierKeys.detail(tenantId, id)     // individual record

// After create/update/delete/toggle/bulkAddress:
qc.invalidateQueries({ queryKey: supplierKeys.lists(tenantId) })
// After update/toggle (also update cached detail):
qc.invalidateQueries({ queryKey: supplierKeys.detail(tenantId, id) })
```

## 10. Permission Strategy
- Constants: `PERMISSIONS.Supplier.*` from `src/config/permissions.ts`
- Page guard: `<PermissionGuard permission={PERMISSIONS.Supplier.View} redirectTo="/dashboard">`
- Element hide: `<Can>` component or `can()` from `usePermissions()`
- AG Grid column visibility (Lập CT column): computed in column defs via `can('supplier.createPurchaseVoucher')`
- Never pass permission strings as raw string literals — always use constants

## 11. Multi-tenant Strategy
- `tenantId` from `useTenantStore()` — never from URL
- `X-Tenant-Id` auto-attached by Axios interceptor
- All query keys include `tenantId` → tenant switch auto-invalidates all supplier data

## 12. Pixel-perfect Coding Strategy
- Design tokens: `import { designTokens } from '@/lib/design-tokens'`
- AG Grid sizes: `gridOptions={{ rowHeight: designTokens.size.gridRowHeight, headerHeight: designTokens.size.gridHeaderHeight }}`
- AG Grid filter: `filter: false` in every column def (server-side filtering via toolbar)
- Column widths: explicit `width` + `minWidth` — no `flex`, no auto-size
- Negative debt: `cellRenderer` with `designTokens.colors.tint.emphasis`
- "Lập CT mua hàng": `cellRenderer` with `designTokens.colors.text.link`
- Toolbar height: `<Card><div className="flex items-center gap-2 px-4 py-3">...`
- Dialog widths: `className="sm:max-w-[720px]"` on `DialogContent`
- Grid height: `height="calc(100vh - 320px)"` to fill viewport below toolbar

## 13. Risk & Mitigation
| Risk | Mitigation |
|---|---|
| `useSearchParams` requires Suspense | Wrap route page.tsx in `<Suspense>` — done in Step 11 |
| AG Grid client-side filter interferes with server filter | `filter: false` on all column defs |
| AG Grid sort fires extra `onSortChanged` on initial render | Guard with `event.api.getColumnState()` check — only push to URL if sort actually changed |
| `useState` + `useSearchParams` desync | Use URL-derived state only — no `useState` for query params |
| Clone uses POST /suppliers → duplicate code validation | Code field is required; user must enter unique code; 409 response handled same as create |
| Old `/suppliers` route in bookmarks | `redirect()` in old page |
| `suppliers.*` vs `supplier.*` permission | Keep both groups in `permissions.ts`; verify no other code uses `Suppliers.*` during Phase 8 |
| `tenantId` in mutation `onSuccess` | Capture at hook level before callback — hooks rule |

## 14. Checklist Before Coding
- [x] Phase 4 API Contract Approved — source of truth
- [x] Phase 2 UI Pixel Analysis Approved — visual spec
- [x] Actual design tokens read from `lib/design-tokens.ts`
- [x] DataGrid component interface understood (gridOptions spread, no built-in pagination)
- [x] Sidebar reads from routes.ts — update routes.ts, not Sidebar directly
- [x] All existing suppliers module files inventoried (11 files to update)
- [x] All new files identified (9 files + 1 shared PaginationBar)
- [x] Clone decision: POST /suppliers (not POST /clone)
- [x] URL state pattern: derive from `useSearchParams`, never `useState`
- [x] AG Grid sort sync: `onSortChanged` → `updateQuery`
- [x] Row selection: AG Grid `rowSelection: 'multiple'` → lift `selectedIds` to page
- [x] Edit lazy fetch pattern: dialog opens → `useSupplierDetail` fires inside → skeleton → fill
- [x] "Xem phát sinh": TODO comment in DeleteConfirmDialog
- [ ] User approves plan before Phase 8 starts

## 15. Unclear / Incomplete Items

### 1. Missing Information
| ID | Info | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
| P5-M1 | Resolved: Suspense boundary added to route page.tsx | SupplierListPage | Done in Step 11 | No |

### 4. Assumptions
| ID | Assumption | Risk | Confirm? |
|---|---|---|---|
| P5-A1 | Old `suppliers.*` permissions not used elsewhere — safe to keep alongside `supplier.*` | Low-medium | Verify during Phase 8 — grep `PERMISSIONS.Suppliers` |
| P5-A2 | AG Grid `cellRenderer` for negative debt + textlink (not `valueFormatter`) | Low | Standard pattern |
| P5-A3 | "Lập CT mua hàng" route: `/accounting/purchase-vouchers/create?supplierId={id}` | Medium | Confirm when Purchase Voucher feature is built |
| P5-A4 | `api.get<Blob>` with `responseType: 'blob'` supported by existing apiClient | Low | Verify apiClient supports Axios responseType override |

### 5. Questions — Resolved
| ID | Question | Decision |
|---|---|---|
| C1 | Clone dialog vs no-body API | Clone = form-edit dialog → POST /suppliers (not POST /clone) |
| M4 | "Xem phát sinh" link target | TODO comment; disabled/absent until purchase voucher route exists |
| M5 | Edit dialog fetch strategy | Lazy fetch: dialog opens immediately, `useSupplierDetail` fires inside, skeleton until loaded |
| P5-Q1 | Old `/suppliers` route | Redirect to `/categories/suppliers` |
| P5-Q2 | Export button placement | "Tiện ích ▼" dropdown in toolbar (matches MISA reference) |

## 16. Definition of Done
- [x] All new and updated files listed with clear purposes
- [x] API contract mapping (8 active endpoints; POST /clone removed from frontend)
- [x] UI pixel spec mapped to actual design tokens
- [x] Implementation steps in required order
- [x] URL state pattern correct (no useState/useSearchParams desync)
- [x] AG Grid: sort sync, filter override, row selection, context pattern all specified
- [x] Query key strategy with `tenantId`
- [x] Export download mechanism (useMutation + URL.createObjectURL)
- [x] PaginationBar component planned
- [x] Suspense boundary specified
- [x] All review items resolved (C1, H1-H4, M1-M5)
