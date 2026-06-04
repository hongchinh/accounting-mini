# Frontend Implementation Plan: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Goal

Create the Customer module from scratch under `accounting_web/src/modules/customers/`. New route at `/categories/customers`. All core CRUD, summary cards, filter panel, 6-tab form with sub-collections (bank accounts, alt-addresses), bulk-delete, toggle-active, export, MST/CCCD lookup, and permission-aware rendering.

---

## 2. Scope

**In scope:**
- Customer list page (AG Grid, search, filter panel, sort, pagination)
- Summary cards (3 debt metrics)
- Create / edit form dialog — 6 tabs, Tổ chức / Cá nhân type toggle
- Form sub-collections: bank accounts (inline editable), alt-addresses (inline editable)
- Delete single (with transaction guard error display)
- Bulk delete (fail-all, 409 handling)
- Toggle active (Ngừng sử dụng / Sử dụng) per row
- Export Excel
- MST/CCCD lookup (auto-fill on search icon click in form)
- "Lập CT bán hàng" row button (navigation only — no API)
- Permission-aware UI
- Mock data for all API calls (mock-first per config)

**Out of scope (deferred):** Update address, Pay customer, Merge customers, Customer groups / employees / payment-terms lookup endpoints (dropdowns will use static or empty state until those features land).

---

## 3. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Phase 4 API Contract | Approved | Source of truth for all endpoints and DTOs |
| Phase 2 Pixel Spec | Approved | Layout, sizes, tokens |
| `@/lib/api/client` | Exists | `api.get/post/put/delete/patch` |
| `@/stores/tenant.store` | Exists | `useTenantStore()` → `tenantId` |
| `@/hooks/usePermissions` | Exists | `can()`, `canAny()` |
| `@/components/permission/Can` | Exists | `<Can permission=…>` |
| `@/types/api.types` | Exists | `PageResult<T>` — matches contract `{ items, total, page, pageSize }` |
| `@/components/grid/DataGrid` | Exists | AG Grid wrapper |
| `@/components/ui/*` | Exists | Button, Dialog, Input, Tabs, Badge, etc. |
| `@/lib/utils/format` | Exists | `formatCurrency` (Vietnamese locale) |
| TanStack Query v5 | Exists | `useQuery` / `useMutation` |
| `suppliers/` module | Exists | Reference implementation — follow its pattern |

**No new external dependencies required.**

---

## 4. API Contract Mapping

Full contract: [04-api-contract-review.md](04-api-contract-review.md)

| UI Action | Hook | Method | Endpoint | Permission |
|---|---|---|---|---|
| Load list | `useCustomerList` | GET | /api/v1/customers | customer.view |
| Load summary cards | `useCustomerSummary` | GET | /api/v1/customers/summary | customer.view |
| MST/CCCD lookup | `useCustomerLookup` | GET | /api/v1/customers/lookup | customer.view |
| Export Excel | `useExportCustomers` | GET | /api/v1/customers/export | customer.export |
| Load detail | `useCustomerDetail` | GET | /api/v1/customers/{id} | customer.view |
| Create | `useCreateCustomer` | POST | /api/v1/customers | customer.create |
| Update | `useUpdateCustomer` | PUT | /api/v1/customers/{id} | customer.update |
| Delete single | `useDeleteCustomer` | DELETE | /api/v1/customers/{id} | customer.delete |
| Bulk delete | `useBulkDeleteCustomers` | POST | /api/v1/customers/bulk-delete | customer.bulkDelete |
| Toggle active | `useToggleCustomerActive` | PATCH | /api/v1/customers/{id}/toggle-active | customer.update |

**Agreed query params:** `search`, `page`, `pageSize`, `sortBy`, `sortDir`, `isActive`, `customerType`, `groupName`, `debtStatus`, `provinceCode`, `districtCode`, `wardCode`.  
**Agreed response shape:** `{ items, total, page, pageSize }` — no wrapper, no totalPages.

---

## 5. UI Pixel Spec Mapping

| UI Area | Phase 2 Spec Reference | Implementation Notes | Risk |
|---|---|---|---|
| Summary cards row | §4, §7 — 72px height, flex-1, 12px 16px padding, gap 12px, radius 8px | 3 `<Card>` in `flex` row | Low |
| Toolbar | §7 — 40px height, gap 8px, search 280px, buttons right | Flex row, `margin-left: auto` on button group | Low |
| Filter panel | §4 — 240px, collapsible left, padding 16px, gap 12px | Left aside, toggle state in URL/UI | Low |
| AG Grid header | §5 — `table-header-bg` #F0F2F5, 36px | `headerHeight: 36`, custom CSS var | Medium |
| AG Grid rows | §8 — 36px, 130px công nợ right-aligned, negative red | `rowHeight: 36`, custom cell renderer for money | Low |
| Grid columns | §8 table spec | 10 columns per spec (checkbox, 8 data, context menu) | Low |
| Bank accounts tab | §8 inline table | Inline editable table — NOT AG Grid, use simple `<table>` rows | Medium |
| Alt address tab | §8 inline table | Cascade dropdowns + textarea + row add/delete | High |
| Form modal | §7, §10 — 820px, max 90vh | `<Dialog>` with `max-w-[820px]` | Low |
| Type toggle | §10 — radio at modal header row | Inline radios in dialog header, NOT inside form grid | Medium |
| "Là nhà cung cấp" | §10 — standalone checkbox in header | Checkbox in header right side | Low |
| Form tabs | §7, §10 — tab bar below main fields | Shadcn `<Tabs>` component | Low |
| "Lập CT bán hàng" | §8 — button cell in grid | Custom AG Grid `cellRenderer` | Medium |
| Negative debt color | §5, §6 — `#E53935` in parentheses | Custom money cell renderer | Low |
| Ngừng sử dụng badge | §9 — green/gray badge | Status badge cell renderer (reuse supplier pattern) | Low |

---

## 6. File Change Plan

| # | File Path | New/Modify | Purpose | Priority |
|---|---|---|---|---|
| 1 | `accounting_web/src/modules/customers/customer.types.ts` | **New** | All TypeScript types: enums, list item, detail, inputs, summary, lookup | P0 |
| 2 | `accounting_web/src/modules/customers/customer.schema.ts` | **New** | Zod schemas for create/update form validation | P0 |
| 3 | `accounting_web/src/modules/customers/customer.api.ts` | **New** | All 10 API calls via `api.*` | P0 |
| 4 | `accounting_web/src/modules/customers/customer.keys.ts` | **New** | TanStack Query key factories (all, lists, list, detail, summary) | P0 |
| 5 | `accounting_web/src/modules/customers/useCustomers.ts` | **New** | All `useQuery` and `useMutation` hooks | P0 |
| 6 | `accounting_web/src/modules/customers/__mocks__/customer.mock.ts` | **New** | Mock data for all response types | P1 |
| 7 | `accounting_web/src/modules/customers/components/CustomerSummaryCards.tsx` | **New** | 3 summary metric cards | P0 |
| 8 | `accounting_web/src/modules/customers/components/CustomerGrid.tsx` | **New** | AG Grid with all columns + row actions | P0 |
| 9 | `accounting_web/src/modules/customers/components/CustomerFilterPanel.tsx` | **New** | Collapsible left filter sidebar | P1 |
| 10 | `accounting_web/src/modules/customers/components/CustomerFormDialog.tsx` | **New** | Main create/edit dialog orchestrator | P0 |
| 11 | `accounting_web/src/modules/customers/components/OrgMainFields.tsx` | **New** | Form fields for Tổ chức type | P0 |
| 12 | `accounting_web/src/modules/customers/components/IndividualMainFields.tsx` | **New** | Form fields for Cá nhân type | P0 |
| 13 | `accounting_web/src/modules/customers/components/form-tabs/ContactTab.tsx` | **New** | Thông tin liên hệ tab (type-aware: Org vs Individual) | P0 |
| 14 | `accounting_web/src/modules/customers/components/form-tabs/PaymentTermsTab.tsx` | **New** | Điều khoản thanh toán tab | P1 |
| 15 | `accounting_web/src/modules/customers/components/form-tabs/BankAccountsTab.tsx` | **New** | Tài khoản ngân hàng tab — inline editable row table | P1 |
| 16 | `accounting_web/src/modules/customers/components/form-tabs/AltAddressTab.tsx` | **New** | Địa chỉ khác tab — location cascade + delivery rows | P1 |
| 17 | `accounting_web/src/modules/customers/components/form-tabs/NotesTab.tsx` | **New** | Ghi chú tab — textarea | P2 |
| 18 | `accounting_web/src/modules/customers/components/form-tabs/CustomFieldsTab.tsx` | **New** | Thông tin bổ sung tab — 5 editable-label fields | P2 |
| 19 | `accounting_web/src/modules/customers/components/DeleteConfirmDialog.tsx` | **New** | Single delete confirmation | P0 |
| 20 | `accounting_web/src/modules/customers/components/BulkDeleteConfirmDialog.tsx` | **New** | Bulk delete confirmation + 409 error display | P0 |
| 21 | `accounting_web/src/modules/customers/pages/CustomerListPage.tsx` | **New** | Page root: composes all components | P0 |
| 22 | `accounting_web/src/modules/customers/index.ts` | **New** | Public exports | P2 |
| 23 | `accounting_web/src/app/(app)/categories/customers/page.tsx` | **New** | Next.js App Router page — renders `CustomerListPage` | P0 |
| 24 | `accounting_web/src/config/permissions.ts` | Modify | Add `Customer` group with 9 permission constants | P0 |
| 25 | `accounting_web/src/config/routes.ts` | Modify | Add Customers nav entry under Danh mục group | P0 |

**Total: 23 new files, 2 modify.**

---

## 7. Implementation Steps

**Step 1 — Types + Constants** _(files #1, #24)_
- `customer.types.ts`:
  - `export const CUSTOMER_TYPE = { Organization: 1, Individual: 2 } as const`
  - `CustomerType = 1 | 2`
  - `CustomerListItem` — 11 fields per §7.1 contract
  - `CustomerDetail extends CustomerListItem` — all §7.2 fields including sub-collections
  - `CustomerBankAccountDto`, `CustomerAlternativeAddressDto` — per §7.3, §7.4
  - `CustomerSummary` — per §7.6
  - `CustomerLookupResult` — per §7.7
  - `CustomerListQuery` — agreed params (search/page/pageSize/sortBy/sortDir/isActive/customerType/groupName/debtStatus/provinceCode/districtCode/wardCode)
  - `CreateCustomerInput`, `UpdateCustomerInput` — per §7.5
  - `CustomerBankAccountInput`, `CustomerAlternativeAddressInput` — no `id` field
  - `BulkDeleteCustomersInput = { ids: string[] }`
- `permissions.ts`: Add `Customer: { View, Create, Update, Delete, BulkDelete, Export, UpdateAddress, Pay, CreateSalesVoucher }`

**Step 2 — API Service** _(file #3)_
```typescript
// customer.api.ts
const BASE = '/api/v1/customers'
export const customerApi = {
  list: (params: CustomerListQuery) => api.get<PageResult<CustomerListItem>>(BASE, { params }),
  summary: () => api.get<CustomerSummary>(`${BASE}/summary`),
  lookup: (params: { taxCode?: string; cccd?: string }) => api.get<CustomerLookupResult>(`${BASE}/lookup`, { params }),
  export: (params: Omit<CustomerListQuery, 'page'|'pageSize'>) => api.get(`${BASE}/export`, { params, responseType: 'blob' }),
  getById: (id: string) => api.get<CustomerDetail>(`${BASE}/${id}`),
  create: (body: CreateCustomerInput) => api.post<CustomerDetail>(BASE, body),
  update: (id: string, body: UpdateCustomerInput) => api.put<CustomerDetail>(`${BASE}/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
  bulkDelete: (body: BulkDeleteCustomersInput) => api.post<void>(`${BASE}/bulk-delete`, body),
  toggleActive: (id: string) => api.patch<CustomerDetail>(`${BASE}/${id}/toggle-active`),
}
```

**Step 3 — Query Keys** _(file #4)_
```typescript
// customer.keys.ts
export const customerKeys = {
  all: (tid: string) => ['customers', tid] as const,
  lists: (tid: string) => [...customerKeys.all(tid), 'list'] as const,
  list: (tid: string, q: CustomerListQuery) => [...customerKeys.lists(tid), q] as const,
  detail: (tid: string, id: string) => [...customerKeys.all(tid), 'detail', id] as const,
  summary: (tid: string) => [...customerKeys.all(tid), 'summary'] as const,
}
```

**Step 4 — React Query Hooks** _(file #5)_
- `useCustomerList(query)` — `useQuery`; `enabled: !!tenantId`
- `useCustomerSummary()` — `useQuery`; `enabled: !!tenantId`
- `useCustomerDetail(id)` — `useQuery`; `enabled: !!id && !!tenantId`
- `useCustomerLookup(params)` — `useQuery`; `enabled` when param present
- `useCreateCustomer()` — `useMutation`; on success: invalidate `lists` + `summary`
- `useUpdateCustomer()` — `useMutation`; on success: invalidate `lists` + `detail` + `summary`
- `useDeleteCustomer()` — `useMutation`; on success: invalidate `lists` + `summary`
- `useBulkDeleteCustomers()` — `useMutation`; on success: invalidate `all` + `summary`
- `useToggleCustomerActive()` — `useMutation`; on success: invalidate `lists` + `detail`
- `useExportCustomers()` — `useMutation` (triggers download)

**Step 5 — Validation Schema** _(file #2)_
- `customerFormSchema` (Zod) — required: `customerType`, `code` (create only), `name`
- Conditional: `cccdIssueDate` ≤ today if present
- `invoiceRecipientEmails`: split by `;`, each must be valid email
- `debtDays`: non-negative integer
- `maxDebt`: non-negative number
- `bankAccounts`: array with `accountNumber` required, `bankName` required
- `superRefine`: cross-field rules (Org vs Individual required fields)

**Step 6 — Mock Data** _(file #6)_
- `mockCustomerListItem`, `mockCustomerList` (5 items, mix Org/Individual)
- `mockCustomerDetail` (with bankAccounts[], alternativeAddresses[])
- `mockCustomerSummary`
- `mockCustomerLookupResult`

**Step 7 — Components (P0 first)**
- `CustomerSummaryCards` — 3 `<Card>` flex row, money format, skeleton loading
- `CustomerGrid` — AG Grid: 10 columns per §8 spec, custom cell renderers (money, badge, button)
- `CustomerFormDialog` — Dialog orchestrator, type toggle in header, "Là nhà cung cấp" checkbox, main fields switch, 6 tabs
- `OrgMainFields` / `IndividualMainFields` — conditional form field sets
- `ContactTab` — type-aware: Org shows company contact + invoice recipient; Individual shows personal contact + passport
- `DeleteConfirmDialog` — confirm single delete; show 409 message with transactionCount
- `BulkDeleteConfirmDialog` — confirm bulk delete; on 409 show error with affectedIds count

**Step 8 — P1 Components**
- `CustomerFilterPanel` — filter sidebar (Loại, Nhóm, Tình trạng công nợ, Tìm theo, Vị trí, Đặt lại)
- `PaymentTermsTab` — 4 fields + receivableAccountCode
- `BankAccountsTab` — inline editable table; Thêm dòng / Xóa hết dòng buttons

**Step 9 — P2 Components**
- `AltAddressTab` — 4-level location cascade + delivery address rows
- `NotesTab` — `<Textarea>` full width
- `CustomFieldsTab` — 5 rows with editable label + value

**Step 10 — Page + Route** _(files #21, #23)_
- `CustomerListPage.tsx` — wires all components: summary, toolbar (search, filter toggle, Tiện ích ▼, Thêm), filter panel, grid, dialogs
- `page.tsx` — `<CustomerListPage />` wrapped in `<PermissionGuard permission={PERMISSIONS.Customer.View}>`

**Step 11 — Navigation** _(file #25)_
- Add entry under Danh mục nav group in `routes.ts`:
  ```typescript
  { label: 'Khách hàng', href: '/categories/customers', icon: UsersIcon }
  ```

---

## 8. Data Flow

```
URL search params ──► CustomerListQuery
  ──► useCustomerList(query) ──► customerApi.list(params) ──► GET /api/v1/customers
  ──► CustomerGrid (rows + pagination)

tenantId ──► useCustomerSummary() ──► GET /api/v1/customers/summary
  ──► CustomerSummaryCards

[Thêm click] ──► open CustomerFormDialog (create mode)
  ──► useCreateCustomer.mutate(input)
  ──► POST /api/v1/customers
  ──► onSuccess: invalidate lists + summary; toast success
  ──► onError 409: toast "Mã khách hàng đã tồn tại"

[Sửa click] ──► fetchCustomerDetail(id) ──► GET /api/v1/customers/{id}
  ──► CustomerFormDialog (edit mode, pre-filled)
  ──► useUpdateCustomer.mutate({id, input})
  ──► PUT /api/v1/customers/{id}
  ──► onSuccess: invalidate lists + detail + summary

[🔍 in form] ──► useCustomerLookup({taxCode}) ──► GET /api/v1/customers/lookup
  ──► auto-fill form fields (customerCode, customerName, address, phone)

[Xóa] ──► DeleteConfirmDialog ──► useDeleteCustomer.mutate(id)
  ──► DELETE /api/v1/customers/{id}
  ──► 409: show "Khách hàng [Mã] đã có phát sinh. Xóa các phát sinh liên quan trước khi xóa."

[Bulk delete] ──► BulkDeleteConfirmDialog ──► useBulkDeleteCustomers.mutate({ids})
  ──► POST /api/v1/customers/bulk-delete
  ──► 409: "Có khách hàng đã phát sinh giao dịch. Không thể xóa."
  ──► onSuccess: invalidate all + summary

[Ngừng sử dụng] ──► useToggleCustomerActive.mutate(id)
  ──► PATCH /api/v1/customers/{id}/toggle-active

[Lập CT bán hàng] ──► router.push('/sales/vouchers/new?customerId={id}')  ← frontend nav only

[Xuất Excel] ──► useExportCustomers.mutate(currentFilters)
  ──► GET /api/v1/customers/export ──► blob download
```

---

## 9. Query Key Strategy

| Key | Structure | Invalidated By |
|---|---|---|
| `customerKeys.all(tid)` | `["customers", tid]` | Bulk delete, toggle |
| `customerKeys.lists(tid)` | `["customers", tid, "list"]` | Create, update, delete, bulk-delete, toggle |
| `customerKeys.list(tid, q)` | `["customers", tid, "list", q]` | — |
| `customerKeys.detail(tid, id)` | `["customers", tid, "detail", id]` | Update, toggle |
| `customerKeys.summary(tid)` | `["customers", tid, "summary"]` | Create, delete, bulk-delete |

All keys include `tenantId`. Tenant switch triggers `invalidateQueries(customerKeys.all(tid))`.

---

## 10. Permission Strategy

| Permission | Constant | UI Effect |
|---|---|---|
| `customer.view` | `PERMISSIONS.Customer.View` | `PermissionGuard` wraps page; redirect if missing |
| `customer.create` | `PERMISSIONS.Customer.Create` | `<Can>` hides "Thêm" button |
| `customer.update` | `PERMISSIONS.Customer.Update` | `<Can>` hides "Sửa" row action + toggle |
| `customer.delete` | `PERMISSIONS.Customer.Delete` | `<Can>` hides "Xóa" row action |
| `customer.bulkDelete` | `PERMISSIONS.Customer.BulkDelete` | `<Can>` hides bulk-delete button in bulk action bar |
| `customer.export` | `PERMISSIONS.Customer.Export` | `<Can>` hides "Xuất Excel" in Tiện ích menu |
| `customer.updateAddress` | `PERMISSIONS.Customer.UpdateAddress` | `<Can>` hides "Cập nhật địa chỉ" button (deferred — button hidden) |
| `customer.createSalesVoucher` | `PERMISSIONS.Customer.CreateSalesVoucher` | `<Can>` guards "Lập CT bán hàng" button per row |

Use `<Can permission={PERMISSIONS.Customer.Create}>` — never inline permission strings.

---

## 11. Multi-tenant Strategy

- All query keys include `tenantId` from `useTenantStore()`
- `enabled: !!tenantId` on all `useQuery` hooks
- No `tenantId` in request body or URL — backend reads from JWT + `X-Tenant-Id` header
- On tenant switch: Zustand store update → stale keys → TanStack Query refetches automatically

---

## 12. Pixel-perfect Coding Strategy

| Aspect | Strategy |
|---|---|
| Summary cards | `flex flex-row gap-3`; each card `flex-1 min-w-[180px] h-[72px] px-4 py-3 rounded-lg border bg-card` |
| Card value (20px/700) | `text-xl font-bold` |
| Card label (13px/500) | `text-sm font-medium text-muted-foreground` |
| Negative debt | `(2.146.916.479,9)` format in `--destructive` color |
| AG Grid | `rowHeight: 36, headerHeight: 36`, header bg via CSS `var(--table-header-bg)` = `#F0F2F5` |
| Money cell | Custom `cellRenderer` — right-align, Vietnamese locale, red parentheses if negative |
| Type radio (modal header) | Inline in `<DialogHeader>` row — not inside `<form>` |
| "Là nhà cung cấp" | `<Checkbox>` in header right side before close button |
| Form modal | `<Dialog>` content `max-w-[820px] max-h-[90vh] overflow-y-auto` |
| Tab bar | Shadcn `<Tabs>` with `TabsList` at bottom of main fields; `TabsContent` has `min-h-[240px]` |
| Inline table (bank, alt-addr) | Simple `<table>` with `<input>` in cells; NOT AG Grid (lighter, matches UI) |
| Filter panel | `w-[240px] shrink-0 p-4` aside; grid: `flex-1 min-w-0` |
| Row action dropdown | Shadcn `<DropdownMenu>` — 160px width per Phase 2 spec |
| "Lập CT bán hàng" column | Custom `cellRendererFramework` — renders `<Button>` |
| Status badge | Green = `bg-green-100 text-green-800`, Gray = `bg-gray-100 text-gray-600` |
| Toolbar | `flex items-center gap-2 mb-2`; search pinned left, buttons pinned right with `ml-auto` |

---

## 13. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| `CustomerFormDialog` becomes very large (6 tabs + 2 type variants) | High | Split tab content into separate components per tab; form state passed via prop drilling or `useFormContext` |
| Bank accounts / alt-address inline tables — Zod array validation for nested objects | Med | Use `z.array(bankAccountSchema)` in `superRefine`; test with empty array and invalid inputs |
| Location cascade dropdowns (Country → Province → District → Ward) — no existing catalog endpoint | Med | Use static mock data for Phase 8; note as `issues.md` blocker for visual review |
| `AltAddressTab` "Giống địa chỉ khách hàng" checkbox syncs parent address to row | Med | Watch for form `getValues('address')` dependency in tab |
| Summary card metric semantics — `totalDebt` vs `totalReceivable` display | Low | Phase 4 contract §11 Decision 4 defines all three; map directly to card labels |
| "Lập CT bán hàng" navigation target (`/sales/vouchers/new`) may not exist | Med | Show button always; if route 404, graceful fallback; mark as integration issue |
| Lookup 404 UX — no match found | Low | Show toast "Không tìm thấy thông tin khách hàng với mã số thuế này" |

---

## 14. Checklist Before Coding

- [x] API contract approved (Phase 4)
- [x] UI pixel spec approved (Phase 2)
- [x] No existing customer module — greenfield, no migration needed
- [x] Supplier module used as reference pattern — same conventions
- [x] Route path confirmed: `/categories/customers`
- [x] All 9 permission constants documented
- [x] Query key strategy covers all 5 key patterns
- [x] Mock data plan ready for all response types
- [x] Inline table components confirmed (bank accounts, alt addresses)
- [x] Form split confirmed: OrgMainFields / IndividualMainFields per type

---

## 15. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P5-Q1 | Customer groups / employees / payment-terms dropdowns — no lookup endpoint yet | No | Use empty array + allow free-text entry for groupName; dropdowns use `combobox` with no options until feature lands |
| P5-Q2 | Location cascade (Country/Province/District/Ward) — no catalog endpoint in scope | No | Phase 8: use static hardcoded province/district data or empty cascade |
| P5-Q3 | "Lập CT bán hàng" target route — does `/sales/vouchers/new` exist? | No | Phase 8: implement as `router.push` with guard; 404 is acceptable until sales module exists |
| P5-Q4 | `AltAddressTab` "Giống địa chỉ khách hàng" pre-fills from parent form — confirm sync behavior | No | Phase 8: on checkbox check, copy `address` field value into `deliveryAddress` |

---

## 16. Definition of Done

- [x] File change plan covers all 23 new + 2 modified files
- [x] API contract mapping covers all 10 hooks
- [x] UI pixel spec mapped to all major components
- [x] Implementation steps ordered by dependency (types → api → hooks → schema → components → page → route)
- [x] Query key strategy includes tenantId
- [x] Permission strategy covers all 9 permissions
- [x] Mock-first approach documented
- [x] Risks identified with mitigations
- [x] No source code created or modified in this phase
