# Backend Basic Design: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Feature Config Summary

| Field | Value |
|---|---|
| Feature | danh-muc-khach-hang |
| Backend project | `accounting_api` |
| Entity | `Customer` — **new entity, no existing implementation** |
| Module path | `Application/Features/Customers/` |
| Permissions prefix | `customer.*` |
| Delete semantics | Soft delete (config + business rules) |
| Sub-entities | `CustomerBankAccount`, `CustomerAlternativeAddress` |

---

## 2. Backend Input Analysis

| Source | Status | Key Findings |
|---|---|---|
| `01-frontend-basic-design.md` | Read | Confirmed scope: CRUD + Export + Bulk Delete + Summary + Lookup. Out of scope: merge, update-address, pay. |
| `02-frontend-ui-pixel-analysis.md` | Read | 6-tab form; bank accounts and alt-addresses are inline editable tables → sub-collections. |
| Backend `Domain/Entities/` | Read | No Customer entity exists. Full greenfield implementation. |
| `Supplier.cs` | Read | Reference pattern: `TenantAuditableEntity`, factory `Create()`, `Update()`, `ToggleActive()`. |
| `Permissions.cs` | Read | No customer permissions present. All 9 permissions must be added. |
| Supplier feature `03-backend-basic-design.md` | Read | Reference design — reuse patterns for summary, bulk-delete, toggle-active, export. |

---

## 3. Source Review

**Existing implementation:** None — Customer entity, feature folder, endpoints, and migrations all need to be created.

**Reference implementation:** `danh-muc-nha-cung-cap` (Supplier) — reuse the same patterns for list/summary/export/bulk-delete/toggle-active. Customer is more complex due to sub-collections and richer form tabs.

**Key differences from Supplier:**
- Two child tables: `CustomerBankAccount` (replaces single `BankAccount` string) and `CustomerAlternativeAddress`
- Richer contact info (Org vs Individual split, invoice recipient, passport)
- Payment terms fields embedded on main entity
- Five custom fields with editable labels
- `IsSupplier` flag (syncs to Supplier catalog — domain event)
- `SalesEmployeeId` + `CustomerGroupId` (both nullable FKs — no entity exists, denormalized names stored)
- MST/CCCD lookup endpoint

---

## 4. Business Capability Extraction

| Capability | Source | Backend Required? | Notes |
|---|---|---|---|
| Paged list + search + filter + sort | UI + docs | Yes | Greenfield |
| Summary cards (3 debt totals) | UI (list page) | Yes | New endpoint |
| Create customer (Org/Individual) | UI + docs | Yes | Two sub-collections |
| Update customer | UI + docs | Yes | Replace sub-collections on save |
| Soft delete + transaction guard | Config + docs | Yes | Same as Supplier |
| Bulk delete | Config permissions | Yes | Fail-all on transaction guard |
| Toggle active (Ngừng sử dụng) | UI + docs | Yes | Individual only (no bulk) |
| Export Excel | UI + config | Yes | Same pattern as Supplier |
| MST/CCCD lookup | UI form | Yes | New query endpoint |
| IsSupplier sync | UI + docs | Yes | Domain event on flag set |
| CustomerType (Org/Individual) | UI form | Yes | Enum field on entity |
| Bank accounts (sub-collection) | UI form | Yes | Child table |
| Alternative addresses (sub-collection) | UI form | Yes | Child table |
| Payment terms fields | UI tab | Yes | Nullable fields on entity |
| Custom fields (5) | UI tab | Yes | 10 nullable columns on entity |
| Create sales voucher (row action) | UI + config | No | Frontend navigation only |
| Update address | UI toolbar | No | Out of scope (user confirmed) |
| Merge customers | Docs | No | Out of scope (user confirmed) |
| Pay customer | Config | No | Out of scope (user confirmed) |

---

## 5. Backend Feature Comparison

| Capability | Current UI | Reference Markdown | Backend Impact | Decision |
|---|---|---|---|---|
| Summary cards | Yes | No | API Required | Implement |
| Customer type | Yes | Yes | Database Required | Implement |
| Bank accounts sub-table | Yes | Yes | Database Required | Implement |
| Alt-address sub-table | Yes | Yes | Database Required | Implement |
| Payment terms tab | Yes | Yes | Database Required | Implement |
| Custom fields (5) | Yes | No | Database Required | Implement |
| IsSupplier sync | Yes | Yes | API + Domain Event | Implement |
| MST/CCCD lookup | Yes | Yes | API Required | Implement |
| Bulk delete | Config | No | API Required | Implement |
| Export with filters | Yes | Yes | Export Required | Implement |
| Toggle active | Yes | Yes | API Required | Implement |
| Create sales voucher | Yes (nav) | No | No Backend Impact | Frontend nav only |
| Update address | Yes | No | No Backend Impact | Out of scope |
| Merge | Docs | Yes | API Required | Out of scope |

---

## 6. Backend Gap Analysis

### 6.1 Missing Backend Capabilities
1. `Customer` entity — not in `Domain/Entities/`
2. `CustomerBankAccount` entity — child table
3. `CustomerAlternativeAddress` entity — child table
4. `CustomerType` enum — not in `Domain/Enums/`
5. All 10 API endpoints listed in §10
6. All customer permissions in `Permissions.cs`
7. EF configuration and migrations for 3 new tables

### 6.2 Extra Backend Capabilities
None — no pre-existing customer code.

### 6.3 Conflicting Requirements
- Phase 1 renamed `customer.createPurchaseVoucher` → `customer.createSalesVoucher` (confirmed decision D5). The Supplier feature has `SupplierCreatePurchaseVoucher` — do NOT copy that constant name.

### 6.4 Backend Open Questions

| # | Question | Context | Impact | Must Resolve Before Phase 4? |
|---|---|---|---|---|
| B3-Q1 | CustomerGroup: FK to future entity or denormalized string? | No `CustomerGroup` entity exists | Schema design | No — use denormalized `GroupName` as interim (same as Supplier pattern) |
| B3-Q2 | PaymentTermId: FK to future entity? | No `PaymentTerm` entity exists | Schema design | No — store nullable `PaymentTermId` (Guid) + `PaymentTermName` (string) |
| B3-Q3 | MST/CCCD lookup: check existing customers DB only, or call external tax API? | Phase 1 says "tax authority API lookup" | Implementation complexity | No — design endpoint contract now; impl detail deferred to Phase 7 |
| B3-Q4 | SalesEmployee: FK to future entity? | No `Employee` entity exists | Schema design | No — store nullable `SalesEmployeeId` (Guid) + `SalesEmployeeName` (string) |
| B3-Q5 | Bulk delete: fail-all or skip-with-report on transaction guard? | Supplier uses fail-all | API contract | Yes — following Supplier pattern: **fail-all** |
| B3-Q6 | `IsSupplier` sync: create Supplier record inline or via background job? | No Supplier creation in Customer handler exists | Implementation | No — use domain event (Phase 7 detail) |

> B3-Q5 resolved: fail-all (same as Supplier).

---

## 7. Confirmed Backend Scope

| Capability | Status |
|---|---|
| Paged list + search/filter/sort | Implement (new) |
| Summary cards endpoint | Implement (new) |
| Create customer (Org/Individual, all 6 tabs) | Implement (new) |
| Update customer (replace sub-collections) | Implement (new) |
| Soft delete with transaction guard | Implement (new) |
| Bulk delete | Implement (new) |
| Toggle active | Implement (new) |
| Export Excel | Implement (new) |
| MST/CCCD lookup | Implement (new) |
| CustomerType enum | Implement (new) |
| Bank accounts sub-collection | Implement (new) |
| Alternative addresses sub-collection | Implement (new) |

---

## 8. Domain Design

```
Customer : TenantAuditableEntity
  // Core
  + CustomerType          : CustomerType             (enum: Organization=1, Individual=2)
  + Code                  : string
  + Name                  : string
  + Salutation            : string?                  (Individual: Xưng hô)
  // Org-specific
  + TaxCode               : string?
  + BudgetUnitCode        : string?                  (Mã ĐVQHNS)
  + Phone                 : string?
  + Website               : string?
  // Individual-specific
  + Cccd                  : string?
  + CccdIssueDate         : DateOnly?
  + CccdIssuePlace        : string?
  // Shared
  + Address               : string?
  + GroupName             : string?                  (denormalized — GroupId pending)
  + SalesEmployeeId       : Guid?                    (nullable FK — no Employee entity yet)
  + SalesEmployeeName     : string?                  (denormalized)
  + IsInternalObject      : bool
  + IsSupplier            : bool                     (sync to Supplier catalog via domain event)
  + IsActive              : bool                     (default true)
  + CurrentDebtAmount     : decimal?                 (maintained externally)
  // Contact — Org
  + ContactSalutation     : string?
  + ContactName           : string?
  + ContactEmail          : string?
  + ContactPhone          : string?
  + LegalRepresentative   : string?
  + InvoiceRecipientName  : string?
  + InvoiceRecipientEmails: string?                  (semicolon-separated)
  + InvoiceRecipientPhone : string?
  // Contact — Individual
  + MobilePhone           : string?
  + OfficePhone           : string?
  + PassportNumber        : string?
  // Payment terms
  + PaymentTermId         : Guid?
  + PaymentTermName       : string?
  + DebtDays              : int?
  + MaxDebt               : decimal?
  + ReceivableAccountCode : string                   (default "131")
  // Notes + Custom fields
  + Notes                 : string?
  + CustomField1Label     : string?; CustomField1Value: string?
  + CustomField2Label     : string?; CustomField2Value: string?
  + CustomField3Label     : string?; CustomField3Value: string?
  + CustomField4Label     : string?; CustomField4Value: string?
  + CustomField5Label     : string?; CustomField5Value: string?
  // Navigation
  + BankAccounts          : ICollection<CustomerBankAccount>
  + AlternativeAddresses  : ICollection<CustomerAlternativeAddress>

CustomerBankAccount : Entity
  + CustomerId    : Guid                             (FK, required)
  + AccountNumber : string
  + BankName      : string
  + BankBranch    : string?
  + BankProvince  : string?
  + SortOrder     : int                              (preserve UI row order)

CustomerAlternativeAddress : Entity
  + CustomerId       : Guid                          (FK, required)
  + CountryCode      : string?
  + ProvinceCode     : string?
  + DistrictCode     : string?
  + WardCode         : string?
  + DeliveryAddress  : string?
  + SameAsCustomer   : bool
  + SortOrder        : int
```

**CustomerType enum** (new: `Domain/Enums/CustomerType.cs`):
```
CustomerType { Organization = 1, Individual = 2 }
```

**CustomerErrors** (new: `Domain/Errors/CustomerErrors.cs`):
- `NotFound` — `Error.NotFound("customer.not_found", ...)`
- `DuplicateCode` — `Error.Conflict("customer.duplicate_code", ...)`
- `HasTransactions` — `Error.Conflict("customer.has_transactions", ...)`
- `BulkHasTransactions` — `Error.Conflict("customer.bulk_has_transactions", ...)`

---

## 9. Database Design

**Table: `customers`** (new)

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | uuid | No | PK |
| `tenant_id` | uuid | No | FK, composite index |
| `customer_type` | int | No | 1=Org, 2=Individual; default 1 |
| `code` | varchar(32) | No | Unique per tenant |
| `name` | varchar(255) | No | — |
| `salutation` | varchar(20) | Yes | Individual only |
| `tax_code` | varchar(32) | Yes | Org: MST; Individual: MST |
| `budget_unit_code` | varchar(32) | Yes | Org only |
| `phone` | varchar(32) | Yes | Org only |
| `website` | varchar(255) | Yes | Org only |
| `cccd` | varchar(32) | Yes | Individual only |
| `cccd_issue_date` | date | Yes | Individual only |
| `cccd_issue_place` | varchar(255) | Yes | Individual only |
| `address` | varchar(500) | Yes | — |
| `group_name` | varchar(100) | Yes | Denormalized |
| `sales_employee_id` | uuid | Yes | Nullable FK |
| `sales_employee_name` | varchar(255) | Yes | Denormalized |
| `is_internal_object` | bool | No | default false |
| `is_supplier` | bool | No | default false |
| `is_active` | bool | No | default true |
| `current_debt_amount` | numeric(18,4) | Yes | — |
| `contact_salutation` | varchar(20) | Yes | Org contact |
| `contact_name` | varchar(255) | Yes | — |
| `contact_email` | varchar(255) | Yes | — |
| `contact_phone` | varchar(32) | Yes | — |
| `legal_representative` | varchar(255) | Yes | — |
| `invoice_recipient_name` | varchar(255) | Yes | — |
| `invoice_recipient_emails` | varchar(500) | Yes | Semicolon-separated |
| `invoice_recipient_phone` | varchar(32) | Yes | — |
| `mobile_phone` | varchar(32) | Yes | Individual contact |
| `office_phone` | varchar(32) | Yes | Individual contact |
| `passport_number` | varchar(32) | Yes | — |
| `payment_term_id` | uuid | Yes | Nullable FK |
| `payment_term_name` | varchar(100) | Yes | Denormalized |
| `debt_days` | int | Yes | — |
| `max_debt` | numeric(18,4) | Yes | — |
| `receivable_account_code` | varchar(20) | No | default '131' |
| `notes` | text | Yes | — |
| `custom_field_1_label` | varchar(100) | Yes | — |
| `custom_field_1_value` | varchar(500) | Yes | — |
| ... (fields 2–5 same pattern) | | | |
| `is_deleted` | bool | No | Soft delete |
| `created_at_utc` | timestamptz | No | — |
| `updated_at_utc` | timestamptz | Yes | — |
| `created_by` | uuid | Yes | — |
| `updated_by` | uuid | Yes | — |

**Indexes:** `(tenant_id, code)` UNIQUE WHERE NOT deleted; `(tenant_id, is_active)`; `(tenant_id, is_deleted)`

**Table: `customer_bank_accounts`** (new)

| Column | Type | Nullable |
|---|---|---|
| `id` | uuid | No |
| `customer_id` | uuid | No (FK → customers.id, CASCADE DELETE) |
| `account_number` | varchar(50) | No |
| `bank_name` | varchar(255) | No |
| `bank_branch` | varchar(255) | Yes |
| `bank_province` | varchar(100) | Yes |
| `sort_order` | int | No |

**Table: `customer_alternative_addresses`** (new)

| Column | Type | Nullable |
|---|---|---|
| `id` | uuid | No |
| `customer_id` | uuid | No (FK → customers.id, CASCADE DELETE) |
| `country_code` | varchar(10) | Yes |
| `province_code` | varchar(10) | Yes |
| `district_code` | varchar(10) | Yes |
| `ward_code` | varchar(10) | Yes |
| `delivery_address` | varchar(500) | Yes |
| `same_as_customer` | bool | No |
| `sort_order` | int | No |

---

## 10. Backend API Draft

| Method | Path | Permission | Status | Notes |
|---|---|---|---|---|
| GET | `/api/v1/customers` | `customer.view` | New | Paged list + filters |
| GET | `/api/v1/customers/summary` | `customer.view` | New | Summary card totals |
| GET | `/api/v1/customers/lookup` | `customer.view` | New | MST/CCCD auto-fill |
| GET | `/api/v1/customers/export` | `customer.export` | New | Excel download |
| GET | `/api/v1/customers/{id}` | `customer.view` | New | Detail with sub-collections |
| POST | `/api/v1/customers` | `customer.create` | New | Create with sub-collections |
| PUT | `/api/v1/customers/{id}` | `customer.update` | New | Update; replace sub-collections |
| DELETE | `/api/v1/customers/{id}` | `customer.delete` | New | Soft delete + transaction guard |
| POST | `/api/v1/customers/bulk-delete` | `customer.bulkDelete` | New | Fail-all on transaction guard |
| PATCH | `/api/v1/customers/{id}/toggle-active` | `customer.update` | New | Ngừng sử dụng / Sử dụng |

**List query params:** `keyword`, `page`, `pageSize`, `sortBy`, `sortDir`, `customerType`, `groupName`, `debtStatus` (all/has_debt/no_debt), `provinceCode`, `districtCode`, `wardCode`, `isActive`

**Lookup query params:** `taxCode` OR `cccd` (exactly one required)

---

## 11. DTO Design

**CustomerListItemDto:**
```
Id, CustomerCode, CustomerName, CustomerType, Address, CurrentDebtAmount,
TaxCode, CustomerGroupName, IsActive, IsSupplier, UpdatedAt
```

**CustomerDetailDto:**
```
All CustomerListItemDto fields +
Salutation, BudgetUnitCode, Phone, Website,
Cccd, CccdIssueDate, CccdIssuePlace,
SalesEmployeeId, SalesEmployeeName, IsInternalObject,
ContactSalutation, ContactName, ContactEmail, ContactPhone, LegalRepresentative,
InvoiceRecipientName, InvoiceRecipientEmails, InvoiceRecipientPhone,
MobilePhone, OfficePhone, PassportNumber,
PaymentTermId, PaymentTermName, DebtDays, MaxDebt, ReceivableAccountCode,
Notes,
CustomField1Label, CustomField1Value, ..., CustomField5Label, CustomField5Value,
BankAccounts: CustomerBankAccountDto[],
AlternativeAddresses: CustomerAlternativeAddressDto[],
CreatedAt
```

**CreateCustomerCommand / UpdateCustomerCommand:** All writable fields + BankAccounts list + AlternativeAddresses list.

**CustomerSummaryDto:**
```
TotalDebt: decimal          // sum of positive CurrentDebtAmount
TotalReceivable: decimal    // same as TotalDebt (Phải thu — clarify in Phase 4)
TotalAdvancePayment: decimal // sum of negative CurrentDebtAmount (absolute)
CalculatedAt: DateTime
```

**BulkDeleteCustomersCommand:** `Ids: List<Guid>` (max 100)

**CustomerLookupDto:** `CustomerCode, CustomerName, TaxCode, Cccd, Address, Phone`

---

## 12. Validation Rules

| Field | Rule |
|---|---|
| Code | Required, max 32, unique per tenant |
| Name | Required, max 255 |
| CustomerType | Required, valid enum value |
| TaxCode | Max 32 |
| BudgetUnitCode | Max 32 |
| Phone / MobilePhone / OfficePhone | Max 32 |
| Cccd | Max 32 |
| CccdIssueDate | Valid date, ≤ today |
| Email fields | Valid email format if provided |
| InvoiceRecipientEmails | Each semicolon-part is valid email |
| Address | Max 500 |
| Website | Max 255 |
| GroupName | Max 100 |
| SalesEmployeeName | Max 255 |
| PaymentTermName | Max 100 |
| DebtDays | Non-negative integer |
| MaxDebt | Non-negative decimal |
| ReceivableAccountCode | Required, max 20 |
| Notes | Max 2000 |
| CustomFieldLabel (each) | Max 100 |
| CustomFieldValue (each) | Max 500 |
| BankAccount.AccountNumber | Required, max 50 |
| BankAccount.BankName | Required, max 255 |
| BulkDelete.Ids | Not empty, max 100 items |
| Lookup | Exactly one of `taxCode` or `cccd` required |

---

## 13. Business Rules

| Rule | Implementation |
|---|---|
| Code unique per tenant | EF unique constraint `(tenant_id, code)` WHERE NOT deleted |
| Soft delete | `ISoftDelete` + global query filter in `AppDbContext` |
| No delete with transactions | Handler checks transaction count before delete; 409 if any |
| Bulk delete — fail-all | If any ID has transactions → 409, no deletions |
| IsSupplier sync | When `IsSupplier=true` → fire `CustomerMarkedAsSupplierDomainEvent` (Phase 7 details) |
| Toggle active (individual only) | No bulk-toggle; toggle per ID only |
| Stopped customers hidden from doc selectors | Callers filter by `IsActive=true`; `isActive` filter on list endpoint |
| Sub-collections replaced on update | Delete + re-insert bank accounts and alternative addresses on each PUT |

---

## 14. Multi-tenant Rules

- All queries filtered by `TenantId` via combined EF global query filter.
- Customer code uniqueness is per-tenant.
- Sub-table rows have no independent tenant filter — tenant isolation is via the parent `Customer.TenantId` FK chain.
- All new endpoints inherit tenant context via `ICurrentTenantAccessor`.

---

## 15. Authentication & Authorization

| Endpoint | Permission constant |
|---|---|
| All GET | `Permissions.CustomerView` |
| POST create | `Permissions.CustomerCreate` |
| PUT update | `Permissions.CustomerUpdate` |
| PATCH toggle-active | `Permissions.CustomerUpdate` |
| DELETE single | `Permissions.CustomerDelete` |
| POST bulk-delete | `Permissions.CustomerBulkDelete` |
| GET export | `Permissions.CustomerExport` |

New constants to add to `Permissions.cs`:
```
CustomerView, CustomerCreate, CustomerUpdate, CustomerDelete,
CustomerBulkDelete, CustomerExport, CustomerUpdateAddress,
CustomerPay, CustomerCreateSalesVoucher
```

Note: `CustomerUpdateAddress` and `CustomerPay` are out of scope for Phase 7 but must be added to the catalog now (used in frontend permission checks). `CustomerCreateSalesVoucher` is frontend navigation — no backend gate required.

---

## 16. Error Handling

| Scenario | HTTP | Error Code |
|---|---|---|
| Customer not found | 404 | `customer.not_found` |
| Duplicate code | 409 | `customer.duplicate_code` |
| Has transactions (single delete) | 409 | `customer.has_transactions` |
| Bulk delete — any has transactions | 409 | `customer.bulk_has_transactions` |
| Validation failure | 400 | `validation_error` |
| Lookup — no params or both params | 400 | `validation_error` |

---

## 17. Logging

Existing `LoggingBehavior` in MediatR pipeline covers all commands. No additional logging.

---

## 18. Performance Considerations

- Summary query: single aggregate SQL per tenant on indexed `current_debt_amount`.
- Sub-collection replace: batch delete + insert in one transaction (no row-by-row loops).
- List query: `AsNoTracking`, server-side pagination, no navigation property loading.
- Bulk delete: `WHERE id = ANY(@ids)` in single query; max 100 IDs per request.
- Export: stream Excel; do not load full entity graph — use projection query.

---

## 19. Security Considerations

- All endpoints require `RequireAuthorization()`.
- Tenant isolation at DB query filter + interceptor levels.
- `BulkDelete` validates all IDs belong to current tenant before any deletion.
- Sub-collection replace: verify parent `CustomerId` belongs to current tenant before deleting child rows.
- No cross-tenant lookup in MST/CCCD lookup endpoint.

---

## 20. Backend Decision Log

| # | Decision | Reason |
|---|---|---|
| 1 | Greenfield — no existing Customer entity to extend | No prior implementation found in `Domain/Entities/` |
| 2 | Sub-collections as separate child tables | UI has inline editable row tables; single string columns (like Supplier.BankAccount) are insufficient |
| 3 | Replace sub-collections on each PUT | Simplest correct approach; avoids diff-merge complexity for small collections |
| 4 | Denormalized GroupName, SalesEmployeeName, PaymentTermName | No corresponding entities exist; same pattern as Supplier.GroupName |
| 5 | Fail-all for bulk-delete | Consistent with Supplier feature decision |
| 6 | IsSupplier sync via domain event | Decouples Customer handler from Supplier handler; prevents circular dependency |
| 7 | `CustomerUpdateAddress` and `CustomerPay` added to Permissions catalog but not implemented | Frontend reads permissions catalog; constants must exist even if endpoints don't |
| 8 | Code max 32 (matches Phase 1 validation) | No conflicting PDR document for customers |

---

## 21. Acceptance Criteria

- [ ] `customer.view` user can list, search, filter, sort, paginate, get summary, and lookup by MST/CCCD.
- [ ] `customer.create` user can create customer (Org and Individual) with all 6 form tabs.
- [ ] `customer.update` user can update all fields; bank accounts and alt-addresses are replaced atomically.
- [ ] `customer.delete` user can delete; blocked with 409 if customer has transactions.
- [ ] `customer.bulkDelete` user can bulk-delete; 409 if any ID has transactions (no partial delete).
- [ ] `customer.export` user can export current filtered list to Excel.
- [ ] Toggle-active toggles individual customer's `IsActive` flag.
- [ ] `IsSupplier=true` fires domain event (Phase 7 implementation).
- [ ] Tenant isolation: no cross-tenant data in any response.
- [ ] Soft-deleted customers absent from all list/detail responses.

---

## 22. Unclear / Incomplete Items

| ID | Item | Blocking? | Must Resolve Before Phase 4? |
|---|---|---|---|
| B3-Q3 | MST/CCCD lookup: check DB only vs. call external tax API? | No | No — endpoint contract fixed; impl deferred to Phase 7 |
| B3-Q1 | CustomerGroup entity: when will it be built? GroupName string is interim. | No | No |
| B3-Q2 | PaymentTerm entity: when will it be built? | No | No |
| B3-Q4 | SalesEmployee entity: when will it be built? | No | No |

---

## 23. Definition of Done

- [x] No existing Customer backend to assess — greenfield scope confirmed
- [x] Sub-entities identified and designed (`CustomerBankAccount`, `CustomerAlternativeAddress`)
- [x] All 10 API endpoints drafted with permissions
- [x] DTO extensions designed for all tabs
- [x] Validation rules documented
- [x] Business rules documented (transaction guard, soft delete, IsSupplier sync)
- [x] Multi-tenant and security rules documented
- [x] Permission catalog additions listed
- [x] Open questions logged with blocking status
- [x] No source code created or modified
