# Backend API Contract Review: Danh mục khách hàng

## Approval Status
Status: Approved
Blocking Issues: No
User Confirmation Required: No

## 1. Review Summary

**Review Date:** 2026-06-03
**Status:** Approved

| Metric | Count |
|---|---:|
| Endpoints in final contract | 10 active |
| New endpoints to build | 10 (greenfield) |
| Mismatches found and resolved | 6 param naming + 2 method + 4 DTO type + 1 sub-collection ID |
| Unresolved questions blocking coding | 0 |

---

# PART A — CROSS-SOURCE FEATURE ALIGNMENT

## A1. Scope Alignment

| Feature / Capability | Frontend Scope | Backend Scope | Ref Docs | Alignment Status | Required Action |
|---|---|---|---|---|---|
| List + search + filter + sort + pagination | Confirmed | New | Confirmed | Aligned | Approve |
| Summary cards (3 debt totals) | Confirmed | New | Referenced | Aligned | Approve |
| MST/CCCD lookup | Confirmed | New | Confirmed | Aligned | Approve |
| Export Excel | Confirmed | New | Confirmed | Aligned | Approve |
| Create (Org/Individual, 6 tabs) | Confirmed | New | Confirmed | Aligned | Approve |
| Update customer | Confirmed | New | Confirmed | Aligned | Approve |
| Soft delete + transaction guard | Confirmed | New | Confirmed | Aligned | Approve |
| Bulk delete | Confirmed | New | Config | Aligned | Approve |
| Toggle active (individual) | Confirmed | New | Confirmed | Aligned | Approve |
| CustomerType (Org/Individual) | Confirmed | New | Confirmed | Aligned | Approve |
| Bank accounts (sub-collection) | Confirmed | New | Confirmed | Aligned | Approve |
| Alt addresses (sub-collection) | Confirmed | New | Confirmed | Aligned | Approve |
| Payment terms tab | Confirmed | New | Confirmed | Aligned | Approve |
| Custom fields (5) | Confirmed | New | No | Aligned | Approve |
| IsSupplier sync | Confirmed | New (domain event) | Confirmed | Aligned | Approve |
| Customer groups dropdown | Confirmed (UI need) | Not in scope | No | Frontend Only | Defer — lookup endpoint in future CustomerGroup feature |
| Sales employees dropdown | Confirmed (UI need) | Not in scope | No | Frontend Only | Defer — lookup endpoint in future Employee feature |
| Payment terms dropdown | Confirmed (UI need) | Not in scope | No | Frontend Only | Defer — lookup endpoint in future PaymentTerm feature |
| Create sales voucher | UI nav only | No endpoint | Config | Backend Only | Frontend navigation — no API needed |
| Update address | Out of scope | Out of scope | No | Aligned (deferred) | Defer |
| Pay customer | Out of scope | Out of scope | Config only | Aligned (deferred) | Defer |
| Merge customers | Out of scope | Out of scope | Mentioned in docs | Aligned (deferred) | Defer |

## A2. Unresolved Questions Before Contract Approval

| # | Question | Source | Impact on Contract | Must Resolve Before Coding? |
|---|---|---|---|---|
| B3-Q3 | MST/CCCD lookup: DB only vs external tax API? | Phase 3 | None — endpoint contract fixed | No |
| B3-Q1 | CustomerGroup entity timeline | Phase 3 | None — using `groupName` string | No |
| Summary card metrics exact definitions | Phase 3 §11 | Resolved below (§11 Decision 4) | No |

All questions resolved or non-blocking. No blockers remain.

## A3. Contract Approval Gate

| Gate Condition | Status | Notes |
|---|---|---|
| No serious frontend/backend mismatch remains | Pass | 6 param/method mismatches all resolved |
| All `Need Confirmation` features clearly marked | Pass | Deferred in §12.3 |
| Every confirmed feature has API/backend support | Pass | All 10 endpoints designed |
| Every API has a permission | Pass | Section 8 covers all |
| Every API has clear request/response definitions | Pass | Section 6 complete |
| Error format consistent | Pass | RFC 7807 ProblemDetails throughout |
| Paging/filter/sort consistent | Pass | Aligned to supplier pattern |
| Multi-tenant rules consistent | Pass | Header-based; no route param |
| No open question with Must Resolve = Yes | Pass | Zero remaining |

---

# PART B — GAP ANALYSIS

## 2. Frontend API Needs

| # | UI Action | Method | Endpoint | Notes |
|---|---|---|---|---|
| 1 | Load list | GET | /api/v1/customers | server-paged + filters |
| 2 | Load summary cards | GET | /api/v1/customers/summary | 3 debt totals |
| 3 | MST/CCCD lookup | GET | /api/v1/customers/lookup | ?taxCode= or ?cccd= |
| 4 | Export Excel | GET | /api/v1/customers/export | file download |
| 5 | Load detail | GET | /api/v1/customers/{id} | for edit form |
| 6 | Create | POST | /api/v1/customers | with sub-collections |
| 7 | Update | PUT | /api/v1/customers/{id} | replace sub-collections |
| 8 | Delete | DELETE | /api/v1/customers/{id} | 409 if transactions |
| 9 | Bulk delete | POST | /api/v1/customers/bulk-delete | fail-all if any has transactions |
| 10 | Toggle active | PATCH | /api/v1/customers/{id}/toggle-active | Ngừng sử dụng / Sử dụng |

## 3. Backend Proposed APIs

| # | Method | Endpoint | Permission | Status |
|---|---|---|---|---|
| 1 | GET | /api/v1/customers | customer.view | New |
| 2 | GET | /api/v1/customers/summary | customer.view | New |
| 3 | GET | /api/v1/customers/lookup | customer.view | New |
| 4 | GET | /api/v1/customers/export | customer.export | New |
| 5 | GET | /api/v1/customers/{id} | customer.view | New |
| 6 | POST | /api/v1/customers | customer.create | New |
| 7 | PUT | /api/v1/customers/{id} | customer.update | New |
| 8 | DELETE | /api/v1/customers/{id} | customer.delete | New |
| 9 | POST | /api/v1/customers/bulk-delete | customer.bulkDelete | New |
| 10 | PATCH | /api/v1/customers/{id}/toggle-active | customer.update | New |

## 4. Technical Gap Analysis

### 4.1 Missing Endpoints
None — Phase 3 covers all 10 confirmed frontend needs.

### 4.2 Method Mismatch

| Phase 1 Expects | Agreed | Resolution |
|---|---|---|
| `DELETE /api/v1/customers` (bulk) | `POST /api/v1/customers/bulk-delete` | DELETE with body is unreliable — use POST (same as Supplier pattern) |
| `POST /api/v1/customers/export` | `GET /api/v1/customers/export` | Idempotent export → GET (same as Supplier pattern) |

### 4.3 Route Mismatch: None.

### 4.4 Query Params Mismatch

| Param | Phase 1 (Frontend) | Agreed |
|---|---|---|
| Search text | `keyword` | **`search`** |
| Page number | `pageIndex` | **`page`** |
| Sort direction | `sortDirection` | **`sortDir`** |
| Customer type | `customerType: 'organization'\|'individual'` | **`customerType: 1\|2`** (int) |
| Group filter | `groupId: string` (Guid) | **`groupName: string`** (no entity yet) |
| Debt status | `debtStatus: 'all'\|'has_debt'\|'no_debt'` | **`debtStatus: string`** (same values) |
| Location filters | `provinceCode`, `districtCode`, `wardCode` | **Aligned** (same names) |
| Status filter | `isActive: boolean` | **`isActive: boolean`** |

### 4.5 Request Body Mismatch

| Field | Phase 1 Type | Agreed |
|---|---|---|
| `customerType` | `'organization'\|'individual'` | `number (1\|2)` |
| Sub-collection item `id?` on create/update | Optional GUID | **Omit from request** — backend replaces all rows; no ID tracking needed in body |

### 4.6 Response Body Mismatch

| Field | Phase 1 Expects | Backend Returns | Resolution |
|---|---|---|---|
| Success wrapper | `{ success, data }` | Raw JSON (no wrapper) | **Agreed: raw JSON** |
| Total count | `totalCount` | `total` | **Agreed: `total`** |
| Page field | `pageIndex` | `page` | **Agreed: `page`** |
| Total pages | Expected | Not returned | **Client-side: `Math.ceil(total / pageSize)`** |
| `customerType` | `string ('organization'\|'individual')` | `int (1\|2)` | **Agreed: number (1\|2)** |

### 4.7 Field Name Mismatch

| Frontend (TS) | Backend (JSON) | Agreed |
|---|---|---|
| `keyword` query param | `search` | `search` |
| `pageIndex` query param | `page` | `page` |
| `sortDirection` query param | `sortDir` | `sortDir` |
| `totalCount` in response | `total` | `total` |
| `groupId` query param | `groupName` | `groupName` |

### 4.8 Type Mismatch

| Field | Phase 1 Type | Backend Type | Agreed |
|---|---|---|---|
| `id` | string | Guid | string (GUID format) |
| `customerType` | `'organization'\|'individual'` | int enum (1\|2) | number (1\|2) |
| `currentDebtAmount` | number\|null | decimal? | number\|null |
| `cccdIssueDate` | string | DateOnly | string (ISO 8601 date `YYYY-MM-DD`) |
| `createdAt` / `updatedAt` | string (ISO 8601) | DateTime | string (ISO 8601) |

### 4.9 Permission Mismatch: None — Phase 3 permission names match config values.

### 4.10 Error Format: None — both use RFC 7807 ProblemDetails.

### 4.11 Pagination Mismatch

| Property | Phase 1 | Backend | **Agreed** |
|---|---|---|---|
| Page param | `pageIndex` | `page` | **`page`** |
| Page size param | `pageSize` | `pageSize` | **`pageSize`** |
| Total count field | `totalCount` | `total` | **`total`** |
| Total pages | Expected | Not returned | **Calculate client-side** |

### 4.12 Sorting Mismatch

| Property | Phase 1 | Backend | **Agreed** |
|---|---|---|---|
| Sort param | `sortBy` | `sortBy` | **`sortBy`** |
| Direction param | `sortDirection` | `sortDir` | **`sortDir`** |
| Direction values | asc/desc | asc/desc | **asc/desc** |

### 4.13 Filtering Mismatch

| Filter | Phase 1 | Backend | Resolution |
|---|---|---|---|
| Customer type | `customerType: string` | `customerType: int` | Use int (1\|2) |
| Group | `groupId: Guid` | Not supported | `groupName: string` filter |
| Debt status | `debtStatus: 'all'\|...` | `debtStatus: string` | Same values — aligned |
| Location | `provinceCode`, `districtCode`, `wardCode` | Same | Aligned |

### 4.14 Multi-tenant: None — both header-based, no route param.

---

# PART C — FINAL API CONTRACT

## 5. Final API Contract

### 5.1 Standard Success Response
Direct JSON — no `{ success, data }` wrapper. The DTO IS the response body.

### 5.2 Standard Error Response (RFC 7807)
```json
{
  "type": "https://api.errors/customer.not_found",
  "title": "customer.not_found",
  "status": 404,
  "detail": "Customer not found."
}
```

### 5.3 Validation Error Response (400)
```json
{
  "type": "https://api.errors/validation_error",
  "title": "validation_error",
  "status": 400,
  "errors": { "Code": ["'Code' must not be empty."] }
}
```

### 5.4 Pagination Response
```json
{ "items": [], "total": 100, "page": 1, "pageSize": 100 }
```
No `totalPages` — frontend calculates `Math.ceil(total / pageSize)`.

### 5.5 Base URL
```
/api/v1/customers
```
Tenant from JWT claim `tenantId` + `X-Tenant-Id` header (auto by Axios). **No `{tenantId}` in route.**

---

## 6. Endpoint Contracts

### 6.1 GET /api/v1/customers — List

**Auth:** Bearer JWT | **Permission:** `customer.view`

| Param | Type | Default | Description |
|---|---|---|---|
| search | string? | null | Searches code/name/taxCode/phone/email/address |
| page | int | 1 | 1-based |
| pageSize | int | 100 | Default 100; max 500 |
| sortBy | string? | updatedAt | customerCode\|customerName\|currentDebtAmount\|updatedAt\|createdAt |
| sortDir | string? | desc | asc\|desc |
| isActive | bool? | null | Filter by active status |
| customerType | int? | null | 1=Org, 2=Individual |
| groupName | string? | null | Filter by group name |
| debtStatus | string? | null | all\|has_debt\|no_debt |
| provinceCode | string? | null | |
| districtCode | string? | null | |
| wardCode | string? | null | |

**Response:** `PageResult<CustomerListItemDto>` (200) | **Errors:** 401, 403, 400

### 6.2 GET /api/v1/customers/summary — Summary Cards

**Auth:** Bearer JWT | **Permission:** `customer.view`

**Response (200):**
```json
{
  "totalDebt": 0.0,
  "totalReceivable": 0.0,
  "totalAdvancePayment": 0.0,
  "calculatedAt": "2026-06-03T00:00:00Z"
}
```
**Errors:** 401, 403

### 6.3 GET /api/v1/customers/lookup — MST/CCCD Lookup

**Auth:** Bearer JWT | **Permission:** `customer.view`

| Param | Type | Description |
|---|---|---|
| taxCode | string? | MST (Mã số thuế) — provide exactly one of taxCode or cccd |
| cccd | string? | CCCD/Identity card number |

**Response:** `CustomerLookupDto` (200) or 404 if no match found in DB.

**Errors:** 400 (neither or both params provided), 401, 403, 404

### 6.4 GET /api/v1/customers/export — Export Excel

**Auth:** Bearer JWT | **Permission:** `customer.export`

**Query Params:** Same as list endpoint without `page`/`pageSize`.

**Response:** File download (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

### 6.5 GET /api/v1/customers/{id} — Detail

**Auth:** Bearer JWT | **Permission:** `customer.view`

**Response:** `CustomerDetailDto` (200) | **Errors:** 401, 403, 404

### 6.6 POST /api/v1/customers — Create

**Auth:** Bearer JWT | **Permission:** `customer.create`

**Body:** `CreateCustomerInput` (§7.3)

**Response:** `CustomerDetailDto` (201) | **Errors:** 400, 401, 403, 409 (duplicate code)

### 6.7 PUT /api/v1/customers/{id} — Update

**Auth:** Bearer JWT | **Permission:** `customer.update`

**Body:** `UpdateCustomerInput` (§7.4 — no `code` field)

**Response:** `CustomerDetailDto` (200) | **Errors:** 400, 401, 403, 404

### 6.8 DELETE /api/v1/customers/{id} — Soft Delete

**Auth:** Bearer JWT | **Permission:** `customer.delete`

**Response:** 204 | **Errors:** 401, 403, 404

```json
// 409 — has transactions:
{
  "type": "https://api.errors/customer.has_transactions",
  "title": "customer.has_transactions",
  "status": 409,
  "detail": "Cannot delete customer with existing transactions.",
  "extensions": { "transactionCount": 5 }
}
```

### 6.9 POST /api/v1/customers/bulk-delete — Bulk Delete

**Auth:** Bearer JWT | **Permission:** `customer.bulkDelete`

**Body:** `{ "ids": ["uuid1", "uuid2"] }`

**Response:** 204 | **Errors:** 400 (empty / >100 ids), 401, 403

```json
// 409 — any has transactions (no deletions performed):
{
  "type": "https://api.errors/customer.bulk_has_transactions",
  "title": "customer.bulk_has_transactions",
  "status": 409,
  "detail": "One or more customers have transactions and cannot be deleted.",
  "extensions": { "affectedIds": ["uuid1"] }
}
```

### 6.10 PATCH /api/v1/customers/{id}/toggle-active

**Auth:** Bearer JWT | **Permission:** `customer.update`

**Response:** `CustomerDetailDto` (200) | **Errors:** 401, 403, 404

---

## 7. DTO Contract

### 7.1 CustomerListItemDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|---|---|---|---|---|
| Id | id | Guid | string | GUID |
| CustomerType | customerType | int | 1\|2 | 1=Org, 2=Individual |
| Code | customerCode | string | string | |
| Name | customerName | string | string | |
| TaxCode | taxCode | string? | string\|null | MST / CCCD (M column) |
| Address | address | string? | string\|null | |
| CustomerGroupName | customerGroupName | string? | string\|null | |
| IsActive | isActive | bool | boolean | |
| IsSupplier | isSupplier | bool | boolean | |
| CurrentDebtAmount | currentDebtAmount | decimal? | number\|null | Negative = advance |
| UpdatedAt | updatedAt | DateTime? | string\|null | ISO 8601 |

### 7.2 CustomerDetailDto (extends CustomerListItemDto)

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|---|---|---|---|---|
| Salutation | salutation | string? | string\|null | Individual xưng hô |
| BudgetUnitCode | budgetUnitCode | string? | string\|null | Org: Mã ĐVQHNS |
| Phone | phoneNumber | string? | string\|null | Org phone |
| Website | website | string? | string\|null | |
| Cccd | cccd | string? | string\|null | Individual CCCD |
| CccdIssueDate | cccdIssueDate | DateOnly? | string\|null | ISO 8601 date (YYYY-MM-DD) |
| CccdIssuePlace | cccdIssuePlace | string? | string\|null | |
| SalesEmployeeId | salesEmployeeId | Guid? | string\|null | |
| SalesEmployeeName | salesEmployeeName | string? | string\|null | |
| IsInternalObject | isInternalObject | bool | boolean | |
| ContactSalutation | contactSalutation | string? | string\|null | Org contact |
| ContactName | contactName | string? | string\|null | |
| ContactEmail | contactEmail | string? | string\|null | |
| ContactPhone | contactPhone | string? | string\|null | |
| LegalRepresentative | legalRepresentative | string? | string\|null | |
| InvoiceRecipientName | invoiceRecipientName | string? | string\|null | |
| InvoiceRecipientEmails | invoiceRecipientEmails | string? | string\|null | Semicolon-separated |
| InvoiceRecipientPhone | invoiceRecipientPhone | string? | string\|null | |
| MobilePhone | mobilePhone | string? | string\|null | Individual |
| OfficePhone | officePhone | string? | string\|null | Individual |
| PassportNumber | passportNumber | string? | string\|null | Individual |
| PaymentTermId | paymentTermId | Guid? | string\|null | |
| PaymentTermName | paymentTermName | string? | string\|null | |
| DebtDays | debtDays | int? | number\|null | |
| MaxDebt | maxDebt | decimal? | number\|null | |
| ReceivableAccountCode | receivableAccountCode | string | string | Default "131" |
| Notes | notes | string? | string\|null | |
| CustomField1Label | customField1Label | string? | string\|null | |
| CustomField1Value | customField1Value | string? | string\|null | |
| ... (fields 2–5) | | | | Same pattern |
| BankAccounts | bankAccounts | CustomerBankAccountDto[] | CustomerBankAccountDto[] | |
| AlternativeAddresses | alternativeAddresses | CustomerAlternativeAddressDto[] | CustomerAlternativeAddressDto[] | |
| CreatedAt | createdAt | DateTime | string | ISO 8601 |

### 7.3 CustomerBankAccountDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) |
|---|---|---|---|
| Id | id | Guid | string |
| AccountNumber | accountNumber | string | string |
| BankName | bankName | string | string |
| BankBranch | bankBranch | string? | string\|null |
| BankProvince | bankProvince | string? | string\|null |

### 7.4 CustomerAlternativeAddressDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) |
|---|---|---|---|
| Id | id | Guid | string |
| CountryCode | countryCode | string? | string\|null |
| ProvinceCode | provinceCode | string? | string\|null |
| DistrictCode | districtCode | string? | string\|null |
| WardCode | wardCode | string? | string\|null |
| DeliveryAddress | deliveryAddress | string? | string\|null |
| SameAsCustomer | sameAsCustomer | bool | boolean |

### 7.5 CreateCustomerInput / UpdateCustomerInput

| Field | Required | Max | Notes |
|---|---|---|---|
| customerType | Yes | — | 1 or 2 |
| code | Yes (Create only) | 32 | Unique per tenant; immutable after creation |
| name | Yes | 255 | |
| salutation | No | 20 | |
| taxCode | No | 32 | |
| budgetUnitCode | No | 32 | |
| phoneNumber | No | 32 | |
| website | No | 255 | |
| cccd | No | 32 | |
| cccdIssueDate | No | — | ISO date ≤ today |
| cccdIssuePlace | No | 255 | |
| address | No | 500 | |
| groupName | No | 100 | |
| salesEmployeeId | No | — | GUID string |
| salesEmployeeName | No | 255 | |
| isInternalObject | No | — | default false |
| isSupplier | No | — | default false |
| contactSalutation / contactName / contactEmail / contactPhone / legalRepresentative | No | 20/255/255/32/255 | |
| invoiceRecipientName / invoiceRecipientEmails / invoiceRecipientPhone | No | 255/500/32 | Emails: semicolon-separated |
| mobilePhone / officePhone / passportNumber | No | 32/32/32 | |
| paymentTermId | No | — | GUID string |
| paymentTermName | No | 100 | |
| debtDays | No | — | Non-negative int |
| maxDebt | No | — | Non-negative decimal |
| receivableAccountCode | No | 20 | Default "131" on create |
| notes | No | 2000 | |
| customField1Label–5Label | No | 100 | |
| customField1Value–5Value | No | 500 | |
| bankAccounts | No | — | Array of bank account inputs (replaces all on update) |
| alternativeAddresses | No | — | Array of alt address inputs (replaces all on update) |

**CustomerBankAccountInput:** `{ accountNumber: string, bankName: string, bankBranch?: string, bankProvince?: string }` (no `id` — replace-all semantics)

**CustomerAlternativeAddressInput:** `{ countryCode?, provinceCode?, districtCode?, wardCode?, deliveryAddress?, sameAsCustomer: bool }` (no `id`)

### 7.6 CustomerSummaryDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|---|---|---|---|---|
| TotalDebt | totalDebt | decimal | number | Net sum of ALL currentDebtAmount (Tổng công nợ) |
| TotalReceivable | totalReceivable | decimal | number | SUM(positive currentDebtAmount) — AR (Phải thu) |
| TotalAdvancePayment | totalAdvancePayment | decimal | number | SUM(ABS(negative currentDebtAmount)) — Trả trước |
| CalculatedAt | calculatedAt | DateTime | string | ISO 8601 |

### 7.7 CustomerLookupDto

| Field (C#) | Field (TS) | Notes |
|---|---|---|
| CustomerCode | customerCode | |
| CustomerName | customerName | |
| TaxCode | taxCode | |
| Cccd | cccd | |
| Address | address | |
| Phone | phoneNumber | Org phone |

### 7.8 BulkDeleteCustomersInput

| Field | Type | Required | Notes |
|---|---|---|---|
| ids | string[] | Yes | 1–100 GUID strings |

---

## 8. Permission Contract

| C# Constant | Value | Applies To |
|---|---|---|
| Permissions.CustomerView | customer.view | GET list, summary, lookup, detail, export |
| Permissions.CustomerCreate | customer.create | POST create |
| Permissions.CustomerUpdate | customer.update | PUT update, PATCH toggle-active |
| Permissions.CustomerDelete | customer.delete | DELETE single |
| Permissions.CustomerBulkDelete | customer.bulkDelete | POST bulk-delete |
| Permissions.CustomerExport | customer.export | GET export |
| Permissions.CustomerUpdateAddress | customer.updateAddress | Deferred scope — add to catalog now |
| Permissions.CustomerPay | customer.pay | Deferred scope — add to catalog now |
| Permissions.CustomerCreateSalesVoucher | customer.createSalesVoucher | Frontend nav only — add to catalog |

---

## 9. Multi-tenant Contract

| Rule | Implementation |
|---|---|
| TenantId source | JWT claim `tenantId`; fallback: `X-Tenant-Id` header (auto-set by Axios) |
| Route pattern | `/api/v1/customers` — NO `{tenantId}` in route |
| Query filter | EF global filter: `WHERE tenant_id = @tenantId AND is_deleted = false` |
| Create | Set `TenantId` from `ICurrentTenantAccessor` |
| Update/Delete | Verified via global query filter (returns 404 if wrong tenant) |
| Sub-collections | Tenant isolation via parent `Customer.TenantId` FK chain |
| React Query key | Must include tenantId: `['customers', tenantId, ...params]` |
| Tenant switch | Invalidate all customer queries |

---

## 10. Validation Contract

| Field | Rule | HTTP | Error Field |
|---|---|---|---|
| code | Required, max 32, unique/tenant | 400/409 | Code |
| name | Required, max 255 | 400 | Name |
| customerType | Required, value 1 or 2 | 400 | CustomerType |
| contactEmail | Valid email if present | 400 | ContactEmail |
| invoiceRecipientEmails | Each semicolon-part is valid email | 400 | InvoiceRecipientEmails |
| cccdIssueDate | Valid ISO date, ≤ today | 400 | CccdIssueDate |
| debtDays | Non-negative integer | 400 | DebtDays |
| maxDebt | Non-negative decimal | 400 | MaxDebt |
| receivableAccountCode | Max 20 | 400 | ReceivableAccountCode |
| bankAccounts[].accountNumber | Required, max 50 | 400 | BankAccounts[n].AccountNumber |
| bankAccounts[].bankName | Required, max 255 | 400 | BankAccounts[n].BankName |
| ids (bulk-delete) | Not empty, max 100 items | 400 | Ids |
| lookup taxCode/cccd | Exactly one must be provided | 400 | — |

---

## 11. Contract Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | No `{tenantId}` in route | Project pattern: header-based tenant via `X-Tenant-Id` |
| 2 | No `{ success, data }` wrapper | Same as Supplier — raw JSON + ProblemDetails |
| 3 | Use `page`/`sortDir`/`total`/`search` | CLAUDE.md gotcha + Supplier precedent |
| 4 | Summary: `totalDebt` = net sum; `totalReceivable` = positive only; `totalAdvancePayment` = negative abs | Three distinct card metrics; different accounting concepts |
| 5 | `customerType` as int (1\|2) | Consistent with `supplierType` int enum pattern |
| 6 | Sub-collection replace-all on update | Simple and correct; collections are small (< 20 rows) |
| 7 | Sub-collection input has no `id` field | Replace-all semantics make row IDs irrelevant in request |
| 8 | Code immutable after creation | Prevent code re-use issues; consistent with Supplier |
| 9 | `groupName` string filter (not `groupId`) | No `CustomerGroup` entity exists (B3-Q1) |
| 10 | Bulk-delete: fail-all if any has transactions | Consistent with Supplier (B3-Q5 confirmed) |
| 11 | Lookup: 404 if no match in DB (not external API error) | Contract hides implementation; Phase 7 decides if external API is called |
| 12 | `CustomerUpdateAddress`, `CustomerPay`, `CustomerCreateSalesVoucher` added to catalog but not implemented | Frontend permission checks require constants to exist |

---

## 12. Required Changes

### 12.1 Frontend Design Changes (Phase 5 must account for)
- [ ] Use `search` not `keyword` as query param
- [ ] Use `page` not `pageIndex`; `sortDir` not `sortDirection`
- [ ] Use `customerType: 1|2` number, not `'organization'|'individual'` string
- [ ] Use `groupName: string` filter, remove `groupId` from params
- [ ] Handle raw JSON response (no success wrapper)
- [ ] Handle `{ items, total, page, pageSize }` pagination shape (no totalPages)
- [ ] React Query key includes `tenantId`
- [ ] Bulk delete uses `POST /bulk-delete` not `DELETE /`
- [ ] Export uses `GET` not `POST`
- [ ] Sub-collection inputs omit `id` field on create/update

### 12.2 Backend Implementation Notes (Phase 6/7)
- [ ] All 10 endpoints are new — implement from scratch
- [ ] `CustomerType` enum in `Domain/Enums/CustomerType.cs`
- [ ] `Customer`, `CustomerBankAccount`, `CustomerAlternativeAddress` entities in `Domain/Entities/`
- [ ] EF configurations + 3 migration tables
- [ ] 9 customer permission constants in `Permissions.cs`
- [ ] `IsSupplier` change fires `CustomerMarkedAsSupplierDomainEvent`
- [ ] Lookup endpoint searches existing DB records (implementation of external API call is Phase 7 decision)

### 12.3 Deferred Features (Not in this Contract)
- Customer groups dropdown (`GET /api/v1/customer-groups`) — no entity; deferred to CustomerGroup feature
- Sales employees dropdown (`GET /api/v1/employees`) — no entity; deferred to Employee feature
- Payment terms dropdown (`GET /api/v1/payment-terms`) — no entity; deferred to PaymentTerm feature
- Create sales voucher action — frontend navigation only; no API needed in this feature
- Update address (`PUT /api/v1/customers/{id}/address`) — out of scope (user confirmed)
- Pay customer (`POST /api/v1/customers/{id}/pay`) — out of scope (user confirmed)
- Merge customers — out of scope (user confirmed)

---

## 13. Approval Checklist

- [x] A3 Contract Approval Gate: all conditions pass
- [x] A2: No `Must Resolve Before Coding = Yes` questions remain
- [x] All frontend API needs covered by backend endpoints
- [x] All field names agreed: camelCase in JSON, PascalCase in C#
- [x] All types aligned: dates as ISO 8601 strings, IDs as GUID strings
- [x] Pagination contract defined: page, pageSize, total (no totalPages)
- [x] Sort contract defined: sortBy, sortDir with asc/desc
- [x] Standard success response format agreed (raw JSON)
- [x] Standard error response format agreed (RFC 7807 ProblemDetails)
- [x] Permission constants agreed (9 constants)
- [x] Multi-tenant rules agreed (header-based, no route param)
- [x] Validation error format agreed
- [x] Export endpoint agreed (GET)
- [x] Bulk delete endpoint agreed (POST /bulk-delete, fail-all)
- [x] Sub-collection replace-all semantics agreed
- [x] Summary card metric definitions agreed (3 distinct values)
- [x] Scope alignment complete (Part A1)
