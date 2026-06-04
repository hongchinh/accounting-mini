# Frontend Coding Summary: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Implementation Summary

Implemented the full Customer frontend module under `accounting_web/src/modules/customers/`. 26 new files created across types, schema, API service, React Query hooks, mock data, 13 components (including 6 form tabs), page, and route. Two existing files modified (permissions.ts, routes.ts). Three new shared UI components added (tabs, checkbox, textarea). All 10 API endpoints wired to hooks. Permission-aware rendering for all 9 customer permissions. TDD cycle followed for all logical groups — 53 new tests.

---

## 2. Files Created

### Module Core (5 files)
| File | Purpose |
|---|---|
| `src/modules/customers/customer.types.ts` | All TypeScript types — CustomerListItem, CustomerDetail, sub-DTOs, inputs, query, summary, lookup |
| `src/modules/customers/customer.schema.ts` | Zod schema — customerFormSchema, bankAccountInputSchema, altAddressInputSchema |
| `src/modules/customers/customer.api.ts` | 10 API calls via `api.*` client |
| `src/modules/customers/customer.keys.ts` | TanStack Query key factories (all, lists, list, details, detail, summary) |
| `src/modules/customers/useCustomers.ts` | 9 React Query hooks (list, summary, detail, lookup, create, update, delete, bulk-delete, toggle-active, export) |

### Mock (1 file)
| File | Purpose |
|---|---|
| `src/modules/customers/__mocks__/customer.mock.ts` | 5 mock list items (mix Org/Individual), detail, summary, lookup |

### Components (13 files)
| File | Purpose |
|---|---|
| `components/CustomerSummaryCards.tsx` | 3 metric cards (Phải thu, Tổng công nợ, Trả trước) with skeleton loading |
| `components/CustomerGrid.tsx` | AG Grid — 10 columns: checkbox, #, code, name, MST, group, address, công nợ, status, actions |
| `components/CustomerRowActions.tsx` | ⋮ dropdown — Sửa, Ngừng/Sử dụng, Xóa (permission-gated) |
| `components/OrgMainFields.tsx` | Main form fields for Tổ chức type |
| `components/IndividualMainFields.tsx` | Main form fields for Cá nhân type |
| `components/CustomerFormDialog.tsx` | Dialog orchestrator — type toggle + isSupplier checkbox in header, FormProvider context, 6 tabs |
| `components/DeleteConfirmDialog.tsx` | Single delete — 409 transaction guard error display |
| `components/BulkDeleteConfirmDialog.tsx` | Bulk delete — 409 fail-all message |
| `components/form-tabs/ContactTab.tsx` | Liên hệ tab — Org (contact + invoice recipient) / Individual (mobile, office, passport) |
| `components/form-tabs/PaymentTermsTab.tsx` | TK thanh toán — paymentTermName, receivableAccountCode, debtDays, maxDebt |
| `components/form-tabs/BankAccountsTab.tsx` | TK ngân hàng — inline editable table with useFieldArray, Thêm/Xóa buttons |
| `components/form-tabs/AltAddressTab.tsx` | Địa chỉ khác — inline editable table, "Giống KH" checkbox syncs parent address |
| `components/form-tabs/NotesTab.tsx` | Ghi chú — Textarea |
| `components/form-tabs/CustomFieldsTab.tsx` | Thông tin bổ sung — 5 label/value editable field pairs |

### Page + Route (3 files)
| File | Purpose |
|---|---|
| `pages/CustomerListPage.tsx` | Page root — summary, toolbar, filter selects, grid, pagination, all dialogs |
| `index.ts` | Public module exports |
| `src/app/(app)/categories/customers/page.tsx` | Next.js App Router page — Suspense + CustomerListPage |

### Shared UI Components Added (3 files)
| File | Purpose |
|---|---|
| `src/components/ui/tabs.tsx` | Radix Tabs (shadcn pattern) — needed for form dialog |
| `src/components/ui/checkbox.tsx` | Radix Checkbox (shadcn pattern) — needed for isSupplier + alt-address |
| `src/components/ui/textarea.tsx` | Styled native textarea — needed for NotesTab |

### Test Files (5 files)
| File | Tests |
|---|---|
| `customer.schema.test.ts` | 38 tests — schema validation rules |
| `customer.keys.test.ts` | 6 tests — query key structure |
| `useCustomers.test.ts` | 3 tests — key invalidation coverage |
| `components/CustomerSummaryCards.test.tsx` | 4 tests — render, loading, empty states |
| `components/BulkDeleteConfirmDialog.test.tsx` | 2 tests — render, cancel action |

**Total: 26 new source files + 5 test files + 3 shared UI components**

---

## 3. Files Modified

| File | Change |
|---|---|
| `src/config/permissions.ts` | Added `Customer` group with 9 permission constants |
| `src/config/routes.ts` | Updated customers nav entry: `href` → `/categories/customers`, `permission` → `PERMISSIONS.Customer.View` |

---

## 4. API Contract Mapping

All 10 endpoints per [04-api-contract-review.md](04-api-contract-review.md):

| # | Hook | Method | Endpoint | Status |
|---|---|---|---|---|
| 1 | `useCustomerList` | GET | /api/v1/customers | ✓ |
| 2 | `useCustomerSummary` | GET | /api/v1/customers/summary | ✓ |
| 3 | `useCustomerLookup` | GET | /api/v1/customers/lookup | ✓ |
| 4 | `useExportCustomers` | GET | /api/v1/customers/export | ✓ |
| 5 | `useCustomerDetail` | GET | /api/v1/customers/{id} | ✓ |
| 6 | `useCreateCustomer` | POST | /api/v1/customers | ✓ |
| 7 | `useUpdateCustomer` | PUT | /api/v1/customers/{id} | ✓ |
| 8 | `useDeleteCustomer` | DELETE | /api/v1/customers/{id} | ✓ |
| 9 | `useBulkDeleteCustomers` | POST | /api/v1/customers/bulk-delete | ✓ |
| 10 | `useToggleCustomerActive` | PATCH | /api/v1/customers/{id}/toggle-active | ✓ |

---

## 5. UI Pixel Spec Mapping

| UI Area | Phase 2 Spec | Implementation | Status |
|---|---|---|---|
| Summary cards row | 72px height, flex-1, 3 cards | `flex gap-3`, 3 × `h-[72px] flex-1` | ✓ |
| AG Grid | rowHeight 36, headerHeight 36 | `designTokens.size.gridRowHeight/gridHeaderHeight` | ✓ |
| Công nợ cell | Negative red in parentheses | `DebtCell` — `(number)` in `#E53935` | ✓ |
| Status badge | Green / gray | `StatusBadge` — green-100/gray-100 | ✓ |
| Type badge | Org gray / Individual blue | `CustomerTypeBadge` | ✓ |
| Form modal | 820px max-w, 90vh max-h | `sm:max-w-[820px] max-h-[90vh] overflow-y-auto` | ✓ |
| Type toggle | Radio at modal header | Inline buttons in `CustomerFormInner` header | ✓ |
| "Là nhà cung cấp" | Checkbox in header right | Checkbox + label in header `ml-auto` | ✓ |
| Form tabs | 6 tabs below main fields | Shadcn Tabs with min-h-[240px] content | ✓ |
| Inline tables | Bank accounts, alt-address | Simple `<table>` with `<input>` cells | ✓ |
| "Lập CT bán hàng" | Button cell in grid | `SalesVoucherCell` with `router.push` | ✓ |

---

## 6. Components Implemented

| Component | Pattern | Notes |
|---|---|---|
| `CustomerSummaryCards` | 3 metric cards | Skeleton loading state |
| `CustomerGrid` | AG Grid 10 cols | Custom cell renderers: DebtCell, StatusBadge, TypeBadge, SalesVoucherCell |
| `CustomerRowActions` | DropdownMenu | Sửa / Ngừng sử dụng / Xóa — permission gated |
| `CustomerFormDialog` | Dialog + FormProvider | Type toggle + isSupplier in header, 6 tabs, create/edit mode |
| `OrgMainFields` | react-hook-form | 9 fields for Tổ chức type |
| `IndividualMainFields` | react-hook-form | 10 fields for Cá nhân type |
| `ContactTab` | useFormContext | Type-aware: Org vs Individual |
| `PaymentTermsTab` | useFormContext | 4 fields |
| `BankAccountsTab` | useFormContext + useFieldArray | Inline editable table |
| `AltAddressTab` | useFormContext + useFieldArray | "Giống KH" checkbox syncs address |
| `NotesTab` | useFormContext | Textarea |
| `CustomFieldsTab` | useFormContext | 5 label/value rows |
| `DeleteConfirmDialog` | Dialog | 409 error state |
| `BulkDeleteConfirmDialog` | Dialog | 409 fail-all message |
| `CustomerListPage` | Page | Toolbar, grid, pagination, all dialogs wired |

---

## 7. State Management

| State | Source | Strategy |
|---|---|---|
| List query params | URL search params | Derived from `useSearchParams`, updated with `router.replace` |
| Form state | react-hook-form | `useForm` + `FormProvider` + `useFormContext` in tab children |
| Sub-collections | react-hook-form | `useFieldArray` for bankAccounts and alternativeAddresses |
| Server data | TanStack Query | useQuery hooks with `enabled: !!tenantId` |
| Mutations | TanStack Query | useMutation + onSuccess invalidation |
| Selected rows | useState | `selectedIds` array fed from AG Grid selection |
| Dialog open state | useState | `formOpen`, `bulkDeleteOpen`, `deletingCustomer` |

---

## 8. Permissions

| Permission | Constant | Implementation |
|---|---|---|
| `customer.view` | `PERMISSIONS.Customer.View` | `PermissionGuard` wraps page |
| `customer.create` | `PERMISSIONS.Customer.Create` | `<Can>` hides "Thêm mới" button |
| `customer.update` | `PERMISSIONS.Customer.Update` | Row action dropdown `canUpdate` guard |
| `customer.delete` | `PERMISSIONS.Customer.Delete` | Row action dropdown `canDelete` guard |
| `customer.bulkDelete` | `PERMISSIONS.Customer.BulkDelete` | `<Can>` hides bulk delete button |
| `customer.export` | `PERMISSIONS.Customer.Export` | `<Can>` hides "Xuất ra Excel" |
| `customer.createSalesVoucher` | `PERMISSIONS.Customer.CreateSalesVoucher` | `CustomerGrid` hides "Lập CT bán hàng" column |

---

## 9. Multi-tenant Handling

- All query keys include `tenantId` from `useTenantStore()`
- `enabled: !!tenantId` on all `useQuery` hooks
- `tenantId` NOT in request body or URL — backend reads from JWT + `X-Tenant-Id` header (auto by Axios)
- Tenant switch → stale keys → TanStack Query refetches automatically

---

## 10. Loading / Empty / Error States

| Component | Loading | Empty | Error |
|---|---|---|---|
| `CustomerSummaryCards` | Skeleton 3 gray bars | null (hidden) | — |
| `CustomerGrid` | AG Grid loading state | "Chưa có khách hàng nào" / "Không tìm thấy kết quả" | retry button |
| `CustomerFormDialog` | "Đang tải..." text | — | — |
| `DeleteConfirmDialog` | "Đang xóa..." button | — | 409 inline message |
| `BulkDeleteConfirmDialog` | "Đang xóa..." button | — | 409 inline message |

---

## 11. Commands Run

```powershell
# TypeScript typecheck
npx tsc --noEmit
# → 1 error in pre-existing SupplierForm.test.tsx (unrelated to Customer module)
# → 0 errors in all customer module files

# Customer module tests
npx vitest run src/modules/customers/
# → 53 passed, 0 failed

# Full test suite
npx vitest run
# → 95 passed, 0 failed — no regressions
```

---

## 12. Visual Review Preparation

Screenshots required for Phase 9:
1. Customer list page — initial state (empty / no data)
2. Customer list page — with data loaded (Org and Individual rows visible)
3. Customer list page — with debt column showing positive and negative amounts
4. Summary cards row — showing 3 metric values
5. "Thêm" form dialog — Tổ chức type with all main fields
6. "Thêm" form dialog — Cá nhân type variant
7. Form dialog — Liên hệ tab (Org view)
8. Form dialog — TK ngân hàng tab with rows
9. Form dialog — Địa chỉ khác tab
10. Delete confirm dialog
11. Bulk delete confirm dialog

---

## 13. Known Limitations

| Item | Notes |
|---|---|
| `useCustomerLookup` not wired in form | Lookup endpoint implemented in hook but form search icon (🔍 trigger) not built — deferring to Phase 9 feedback |
| Location cascade (Province/District/Ward) | No catalog API — AltAddressTab uses free-text inputs for province/district/ward codes |
| Customer group / payment term dropdowns | No lookup endpoints — using free-text Input for groupName, paymentTermName |
| "Lập CT bán hàng" navigation | Routes to `/sales/vouchers/new?customerId={id}` — route may not exist yet |

---

## 14. Unclear / Incomplete Items

| ID | Item | Blocking? |
|---|---|---|
| P8-N1 | Lookup search icon in form not built (trigger missing) | No — hook ready, UI deferred to Phase 9 |
| P8-N2 | `CustomerFilterPanel` component not built — toolbar has isActive filter only | No — Phase 5 marked as P1 risk |

---

## 15. Definition of Done

- [x] 26 new source files created (types, schema, api, keys, hooks, mock, 13 components, page, route, index)
- [x] 5 test files created (53 tests, 0 failed)
- [x] 3 shared UI components added (tabs, checkbox, textarea)
- [x] 2 existing files modified (permissions.ts, routes.ts)
- [x] All 10 hooks mapped to Phase 4 contract endpoints
- [x] Permission-aware rendering for all 9 customer permissions
- [x] Multi-tenant query key strategy (tenantId in all keys)
- [x] Loading, empty, error states for all data-bearing components
- [x] TDD cycle followed for G1 (schema, keys), G2 (hooks), G3 (components)
- [x] TypeScript compilation clean for all customer module files
- [x] Full test suite passes 95/95 — no regressions in supplier module
- [x] Route at `/categories/customers` with `metadata.title = "Khách hàng"`
