# Backend Implementation Plan: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Goal

Implement the Customer backend from scratch — 3 new entities, 2 sub-collection tables, 10 API endpoints, full CRUD with sub-collection replace-all semantics, summary cards, MST/CCCD lookup, bulk-delete, toggle-active, export, permission catalog, and EF migrations. See [04-api-contract-review.md](04-api-contract-review.md) for the authoritative contract.

---

## 2. Scope

**In scope:**
- 3 entities: `Customer`, `CustomerBankAccount`, `CustomerAlternativeAddress`
- `CustomerType` enum + `CustomerErrors` + `CustomerMarkedAsSupplierDomainEvent`
- 9 permission constants added to `Permissions.cs`
- EF configurations + 3-table migration
- 5 queries: GetCustomers, GetCustomerById, GetCustomersSummary, LookupCustomer, ExportCustomers
- 5 commands: CreateCustomer, UpdateCustomer, DeleteCustomer, BulkDeleteCustomers, ToggleCustomerActive
- `CustomerEndpoints.cs` with all 10 routes registered

**Out of scope:** domain event handler for IsSupplier sync (Phase 7 decision), transaction check implementation (stub, same as Supplier), update-address, pay, merge.

---

## 3. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `Domain/Common/TenantAuditableEntity` | Exists | Customer inherits this |
| `Domain/Common/BaseEntity` | Exists | CustomerBankAccount, CustomerAlternativeAddress inherit this |
| `Application/Common/Interfaces/IApplicationDbContext` | Exists | Add 3 DbSets |
| `Infrastructure/Persistence/AppDbContext.cs` | Exists | Add 3 DbSets |
| `Shared/Constants/Permissions.cs` | Exists | Extend with 9 customer constants |
| `Shared/Pagination/PaginatedList<T>` | Exists | Used in GetCustomersQuery |
| `Shared/Result/Result<T>` | Exists | All handlers return Result<T> |
| `Api/Extensions/ResultExtensions.ToHttp()` | Exists | Used in endpoint lambdas |
| `./scripts/migrate.ps1` | Exists | Generate + apply migration |
| ClosedXML or EPPlus | Verify | Used in ExportSuppliers — confirm package name for reuse |

No new NuGet packages expected — reuse whatever Excel library ExportSuppliers uses.

---

## 4. File Change Plan

| # | File Path | New/Modify | Purpose | Priority |
|---|---|---|---|---|
| 1 | `accounting_api/src/Domain/Enums/CustomerType.cs` | New | Enum Organization=1, Individual=2 | P1 |
| 2 | `accounting_api/src/Domain/Entities/Customer.cs` | New | Main entity — TenantAuditableEntity + all fields + nav props | P1 |
| 3 | `accounting_api/src/Domain/Entities/CustomerBankAccount.cs` | New | Child entity — BaseEntity + CustomerId FK | P1 |
| 4 | `accounting_api/src/Domain/Entities/CustomerAlternativeAddress.cs` | New | Child entity — BaseEntity + CustomerId FK | P1 |
| 5 | `accounting_api/src/Domain/Errors/CustomerErrors.cs` | New | NotFound, DuplicateCode, HasTransactions, BulkHasTransactions errors | P1 |
| 6 | `accounting_api/src/Domain/Events/CustomerMarkedAsSupplierDomainEvent.cs` | New | Domain event raised when IsSupplier flipped to true | P1 |
| 7 | `accounting_api/src/Shared/Constants/Permissions.cs` | Modify | Add 9 Customer.* permission constants | P1 |
| 8 | `accounting_api/src/Infrastructure/Persistence/Configurations/CustomerConfiguration.cs` | New | Map customers table, unique index on (tenant_id, code), query filter handled by AppDbContext | P2 |
| 9 | `accounting_api/src/Infrastructure/Persistence/Configurations/CustomerBankAccountConfiguration.cs` | New | Map customer_bank_accounts, FK with CASCADE DELETE | P2 |
| 10 | `accounting_api/src/Infrastructure/Persistence/Configurations/CustomerAlternativeAddressConfiguration.cs` | New | Map customer_alternative_addresses, FK with CASCADE DELETE | P2 |
| 11 | `accounting_api/src/Infrastructure/Persistence/AppDbContext.cs` | Modify | Add DbSet<Customer>, DbSet<CustomerBankAccount>, DbSet<CustomerAlternativeAddress> | P2 |
| 12 | `accounting_api/src/Application/Common/Interfaces/IApplicationDbContext.cs` | Modify | Add matching DbSet declarations | P2 |
| 13 | `accounting_api/src/Infrastructure/Persistence/Migrations/` | New (generated) | `AddCustomerTables` migration | P2 |
| 14 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerListItemDto.cs` | New | 11-field projection for list rows | P3 |
| 15 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerDetailDto.cs` | New | Full detail DTO including sub-collection DTOs | P3 |
| 16 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerSummaryDto.cs` | New | TotalDebt, TotalReceivable, TotalAdvancePayment, CalculatedAt | P3 |
| 17 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerBankAccountDto.cs` | New | Projection for bank accounts (includes Id) | P3 |
| 18 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerAlternativeAddressDto.cs` | New | Projection for alt addresses (includes Id) | P3 |
| 19 | `accounting_api/src/Application/Features/Customers/Dtos/CustomerLookupDto.cs` | New | CustomerCode, CustomerName, TaxCode, Cccd, Address, Phone | P3 |
| 20 | `accounting_api/src/Application/Features/Customers/Queries/GetCustomers/GetCustomersQuery.cs` | New | Query + Handler + Validator (all in one file) | P3 |
| 21 | `accounting_api/src/Application/Features/Customers/Queries/GetCustomerById/GetCustomerByIdQuery.cs` | New | Query + Handler; loads with Include(BankAccounts, AltAddresses) | P3 |
| 22 | `accounting_api/src/Application/Features/Customers/Queries/GetCustomersSummary/GetCustomersSummaryQuery.cs` | New | Query + Handler + CustomerSummaryDto inline | P3 |
| 23 | `accounting_api/src/Application/Features/Customers/Queries/LookupCustomer/LookupCustomerQuery.cs` | New | Query + Validator + Handler; searches by TaxCode or Cccd | P3 |
| 24 | `accounting_api/src/Application/Features/Customers/Queries/ExportCustomers/ExportCustomersQuery.cs` | New | Query + Handler; same filter params as list; streams Excel file | P3 |
| 25 | `accounting_api/src/Application/Features/Customers/Commands/CreateCustomer/CreateCustomerCommand.cs` | New | Command + Validator + Handler; ITransactionalRequest | P3 |
| 26 | `accounting_api/src/Application/Features/Customers/Commands/UpdateCustomer/UpdateCustomerCommand.cs` | New | Command + Validator + Handler; includes sub-collection inputs | P3 |
| 27 | `accounting_api/src/Application/Features/Customers/Commands/DeleteCustomer/DeleteCustomerCommand.cs` | New | Command + Handler; transaction guard stub | P3 |
| 28 | `accounting_api/src/Application/Features/Customers/Commands/BulkDeleteCustomers/BulkDeleteCustomersCommand.cs` | New | Command + Validator + Handler; fail-all guard; ITransactionalRequest | P3 |
| 29 | `accounting_api/src/Application/Features/Customers/Commands/ToggleCustomerActive/ToggleCustomerActiveCommand.cs` | New | Command + Handler | P3 |
| 30 | `accounting_api/src/Api/Endpoints/CustomerEndpoints.cs` | New | All 10 routes; static routes registered before /{id:guid} | P4 |

**Files to Create:** 27 source files + 1 migration
**Files to Modify:** 3 (`Permissions.cs`, `AppDbContext.cs`, `IApplicationDbContext.cs`)

---

## 5. Implementation Steps

### G1 — Domain (no external dependencies)
1. `CustomerType.cs` — enum
2. `Customer.cs` — entity with `Create()`, `Update()`, `ToggleActive()`, `UpdateCurrentDebt()` factory methods; `RaiseDomainEvent(new CustomerMarkedAsSupplierDomainEvent(this))` in `SetIsSupplier(true)` helper
3. `CustomerBankAccount.cs` — entity; no factory method needed (created via collection assignment)
4. `CustomerAlternativeAddress.cs` — entity; same
5. `CustomerErrors.cs` — 4 errors following `SupplierErrors.cs` pattern
6. `CustomerMarkedAsSupplierDomainEvent.cs` — implement `IDomainEvent`

### G2 — Shared
7. `Permissions.cs` — add 9 constants + add to `All` list

### G3 — Persistence
8. `CustomerConfiguration.cs` — configure `customers` table; define unique index `(tenant_id, code)` WHERE `!is_deleted`; set `receiver_account_code` default = "131"; column max lengths per §9 Phase 3
9. `CustomerBankAccountConfiguration.cs` — configure `customer_bank_accounts`; FK `customer_id` → customers.id with `DeleteBehavior.Cascade`
10. `CustomerAlternativeAddressConfiguration.cs` — configure `customer_alternative_addresses`; FK with `DeleteBehavior.Cascade`
11. `AppDbContext.cs` — add 3 `DbSet<>` properties; global query filter already handles `ITenantEntity` + `ISoftDelete` via reflection — no manual filter needed
12. `IApplicationDbContext.cs` — add matching `DbSet<>` declarations
13. Run migration: `./scripts/migrate.ps1 -Command add -Name AddCustomerTables`

### G4 — DTOs
14–19. Create 6 DTO files as records per contract §7

### G5 — Queries
20. `GetCustomersQuery` — `AsNoTracking`, `PaginatedList<CustomerListItemDto>`, filters: `search` (ILIKE on code/name/taxCode/phone/email/address), `isActive`, `customerType`, `groupName` (ILIKE), `debtStatus` (positive/negative/null currentDebt filter), `provinceCode`/`districtCode`/`wardCode` (defer ILIKE; note as TODO if location data not on entity — actually address location cascade is on CustomerAlternativeAddress; main entity has no province/district/ward columns → mark as TODO stub returning unfiltered)
21. `GetCustomerByIdQuery` — `.Include(x => x.BankAccounts).Include(x => x.AlternativeAddresses)`, ordered by `SortOrder`
22. `GetCustomersSummaryQuery` — 3 aggregates:
    - `totalDebt` = SUM(ALL currentDebtAmount)
    - `totalReceivable` = SUM(WHERE currentDebtAmount > 0)
    - `totalAdvancePayment` = ABS(SUM(WHERE currentDebtAmount < 0))
23. `LookupCustomerQuery` — search by `TaxCode` OR `Cccd` (exactly one required); return first match or 404
24. `ExportCustomersQuery` — same filters as list (no pagination); stream Excel via ExistingExcelHelper pattern (copy from ExportSuppliersQuery)

### G6 — Commands
25. `CreateCustomerCommand` — validate uniqueness of Code per tenant; `Customer.Create(...)` factory; add bank accounts + alt addresses; save; return `CustomerDetailDto`; mark `ITransactionalRequest`
26. `UpdateCustomerCommand` — load with `.Include()` nav props; call `customer.Update(...)`;  clear `customer.BankAccounts` + assign new; clear `customer.AlternativeAddresses` + assign new; save; return detail DTO; mark `ITransactionalRequest`
27. `DeleteCustomerCommand` — load customer; transaction count stub (= 0); `db.Customers.Remove(customer)`; save
28. `BulkDeleteCustomersCommand` — load all by IDs; transaction check stub; fail-all if any affected; `Remove` each; save; mark `ITransactionalRequest`
29. `ToggleCustomerActiveCommand` — load; `customer.ToggleActive()`; save; return detail DTO

### G7 — Endpoint Registration
30. `CustomerEndpoints.cs` — register all 10 routes in correct order (static paths before `{id:guid}`):
    - `/` → GET list, POST create
    - `/summary` → GET summary
    - `/lookup` → GET lookup
    - `/export` → GET export
    - `/bulk-delete` → POST bulk-delete
    - `/{id:guid}` → GET detail, PUT update, DELETE delete
    - `/{id:guid}/toggle-active` → PATCH

---

## 6. Request Flow

```
HTTP Request
  → TenantResolutionMiddleware (JWT tenantId → ICurrentTenantAccessor)
  → RequireAuthorization (permission policy)
  → CustomerEndpoints handler (lambda)
  → ISender.Send(Command/Query)
  → MediatR pipeline: ValidationBehavior → LoggingBehavior → [TransactionBehavior if ITransactionalRequest]
  → Handler (IApplicationDbContext + EF global filter: tenantId + !isDeleted)
  → Result<T>.ToHttp() or Results.Problem() on error
```

**Sub-collection isolation:** CustomerBankAccount and CustomerAlternativeAddress do NOT have their own EF global filter. They are always accessed via Customer navigation properties which inherit tenant isolation from the parent.

---

## 7. Query Strategy

| Query | Strategy |
|---|---|
| GetCustomers | `AsNoTracking`, LINQ `Where` chain for each active filter, `PaginatedList.CreateAsync` for page |
| GetCustomerById | `FirstOrDefaultAsync` + `.Include()` for both sub-collections, ordered by `SortOrder` |
| GetCustomersSummary | 3 `SumAsync` calls on `AsNoTracking()` tenant-scoped set |
| LookupCustomer | `FirstOrDefaultAsync(x => x.TaxCode == taxCode \|\| x.Cccd == cccd)`; return `CustomerLookupDto` or `CustomerErrors.NotFound` |
| ExportCustomers | No-tracking projection query with same filter params; stream file |
| UpdateCustomer | Tracking query with `.Include()` nav props; clear + re-assign collections |

**Location filter (provinceCode/districtCode/wardCode):** Customer main entity has no location columns. These fields are on `CustomerAlternativeAddress`. For Phase 7, implement as: filter customers that have at least one alt address matching `provinceCode`/`districtCode`/`wardCode` using `.Where(c => c.AlternativeAddresses.Any(a => a.ProvinceCode == params.ProvinceCode))`. Add TODO comment in handler.

---

## 8. Error Handling Strategy

| Scenario | HTTP | Error Code | Extension |
|---|---|---|---|
| Customer not found | 404 | `customer.not_found` | — |
| Duplicate code | 409 | `customer.duplicate_code` | — |
| Has transactions (single delete) | 409 | `customer.has_transactions` | `transactionCount` |
| Bulk delete any has transactions | 409 | `customer.bulk_has_transactions` | `affectedIds` |
| Lookup: no match | 404 | `customer.not_found` | — |
| Lookup: invalid params | 400 | `validation_error` | — |
| Validation failure | 400 | `validation_error` | field-level |

Endpoint wiring for delete/bulk-delete 409: mirror `SupplierEndpoints.cs` pattern — check `result.Error is CustomerHasTransactionsError` → `Results.Problem(extensions: { "transactionCount": ... })`.

---

## 9. Security Strategy

- Every route gets `.RequireAuthorization(Permissions.CustomerXxx)`
- `CustomerView` gates GET list, summary, lookup, detail, export
- `CustomerCreate` gates POST create
- `CustomerUpdate` gates PUT update + PATCH toggle-active
- `CustomerDelete` gates DELETE single
- `CustomerBulkDelete` gates POST bulk-delete
- `CustomerExport` gates GET export
- No anonymous access to any customer endpoint

---

## 10. Multi-tenant Strategy

| Aspect | Implementation |
|---|---|
| All GET queries | EF global filter `tenant_id = currentTenantId && !is_deleted` applied automatically |
| Create | `TenantInterceptor.SavingChanges` stamps `Customer.TenantId` from `ICurrentTenantAccessor` |
| Update | Global filter ensures entity is not found if wrong tenant (→ 404) |
| Delete/BulkDelete | IDs from other tenants return no rows from `db.Customers.Where(x => ids.Contains(x.Id))` |
| Sub-collections | No independent tenant filter; isolation via parent Customer navigation |
| Code uniqueness | Unique index on `(tenant_id, code)` WHERE `is_deleted = false` enforced at DB level |

---

## 11. Permission Strategy

| New Constant | Value | Endpoint |
|---|---|---|
| `CustomerView` | `customer.view` | GET list/summary/lookup/detail/export |
| `CustomerCreate` | `customer.create` | POST create |
| `CustomerUpdate` | `customer.update` | PUT update, PATCH toggle-active |
| `CustomerDelete` | `customer.delete` | DELETE single |
| `CustomerBulkDelete` | `customer.bulkDelete` | POST bulk-delete |
| `CustomerExport` | `customer.export` | GET export |
| `CustomerUpdateAddress` | `customer.updateAddress` | Deferred — add to catalog now |
| `CustomerPay` | `customer.pay` | Deferred — add to catalog now |
| `CustomerCreateSalesVoucher` | `customer.createSalesVoucher` | Frontend nav — add to catalog now |

Add all 9 to `Permissions.All` list in `Permissions.cs`.

---

## 12. Validation Strategy

| Field | Validator | Rule |
|---|---|---|
| CustomerType | Create + Update validator | Required, must be 1 or 2 |
| Code | Create validator only | Required, max 32, unique per tenant (checked in handler) |
| Name | Create + Update | Required, max 255 |
| CccdIssueDate | Create + Update | If present: valid date ≤ today |
| InvoiceRecipientEmails | Create + Update | Each semicolon-part must be valid email format |
| DebtDays | Create + Update | If present: ≥ 0 |
| MaxDebt | Create + Update | If present: ≥ 0 |
| BankAccounts[].AccountNumber | Create + Update | Required, max 50 |
| BankAccounts[].BankName | Create + Update | Required, max 255 |
| BulkDeleteCustomers.Ids | BulkDelete validator | NotEmpty, max 100 items |
| LookupCustomer | Lookup validator | Exactly one of TaxCode or Cccd must be provided (not both, not neither) |

FluentValidation `ValidationBehavior` in MediatR pipeline runs validators automatically before handlers.

---

## 13. Migration Strategy

```powershell
./scripts/migrate.ps1 -Command add -Name AddCustomerTables
./scripts/migrate.ps1 -Command update
```

**3 new tables:** `customers`, `customer_bank_accounts`, `customer_alternative_addresses`

| Column | Type | Default | Notes |
|---|---|---|---|
| `customers.customer_type` | int NOT NULL | 1 | |
| `customers.is_active` | bool NOT NULL | true | |
| `customers.is_supplier` | bool NOT NULL | false | |
| `customers.is_internal_object` | bool NOT NULL | false | |
| `customers.receivable_account_code` | varchar(20) NOT NULL | '131' | |
| `customers.is_deleted` | bool NOT NULL | false | |
| `customer_bank_accounts.customer_id` | uuid NOT NULL | — | FK CASCADE DELETE |
| `customer_alternative_addresses.customer_id` | uuid NOT NULL | — | FK CASCADE DELETE |

**Unique index:** `IX_customers_tenant_id_code` WHERE `is_deleted = false`

**No data loss** — all new tables; no existing tables modified.

---

## 14. Test Impact

| Area | Impact |
|---|---|
| `CreateCustomerCommandHandler` tests | All fields required — write fixture helper |
| `UpdateCustomerCommandHandler` tests | Sub-collection replace-all — test empty → populated → empty round-trip |
| `GetCustomersSummaryQueryHandler` tests | Unit-test 3 aggregate cases (all positive, all negative, mixed) |
| `BulkDeleteCustomersCommandHandler` tests | Fail-all path + success path |
| `LookupCustomerQueryHandler` tests | taxCode match, cccd match, no match (404) |
| Integration tests | Add `Customer` seed data in `CustomWebApplicationFactory` if it uses tenant-scoped seeds |

---

## 15. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Sub-collection replace-all EF behavior | High | Use `.Include()` on load + `customer.BankAccounts.Clear()` + `.Add()` new items; EF cascade delete removes orphans |
| `CustomerBankAccount.SortOrder` not auto-set | Low | Assign from list index in command handler: `input.BankAccounts.Select((b, i) => new CustomerBankAccount { ..., SortOrder = i })` |
| Location filter (province/district/ward) uses `AlternativeAddresses.Any(...)` — may be N+1 | Med | Use `.Any()` in LINQ which EF translates to EXISTS subquery — no N+1 |
| IsSupplier domain event handler not implemented | Low | Event fires but no handler registered yet — no runtime error; implement in Phase 7 or next sprint |
| Excel export library name | Low | Read `ExportSuppliersQuery.cs` import statements in Phase 7 before writing export handler |
| `Xmin` concurrency token on Customer | Low | EF maps `xmin` as `uint` concurrency token automatically on Postgres — no manual config needed |

---

## 16. Checklist Before Coding

- [x] `04-api-contract-review.md` status: Approved
- [x] `03-backend-basic-design.md` status: Completed
- [x] All file paths verified against actual project layout
- [x] No new NuGet packages needed
- [x] Migration script available at `./scripts/migrate.ps1`
- [x] Single-file command/query pattern confirmed (command + validator + handler in one file)
- [x] `IApplicationDbContext` must be modified alongside `AppDbContext`
- [x] Unique index scoped to `(tenant_id, code) WHERE is_deleted = false` pattern confirmed from supplier

---

## 17. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| B6-Q1 | Province/district/ward filter: filter against `AlternativeAddresses.Any(...)` or main entity columns? | No | Main entity has no location columns — use `AlternativeAddresses.Any()` in Phase 7 |
| B6-Q2 | Excel library: ClosedXML or EPPlus? | No | Read `ExportSuppliersQuery.cs` imports in Phase 7 |
| B6-Q3 | Domain event handler for `IsSupplier=true` — deferred to future sprint? | No | Fire event in Phase 7; handler can be empty/stub if CustomerMarkedAsSupplierHandler doesn't exist yet |

---

## 18. Definition of Done

- [ ] 27 source files created (domain, persistence, DTOs, queries, commands, endpoint)
- [ ] 3 files modified (Permissions.cs, AppDbContext.cs, IApplicationDbContext.cs)
- [ ] `AddCustomerTables` migration generated and applied locally
- [ ] All 10 endpoints registered and authorized
- [ ] `dotnet build AccountingApi.sln` passes
- [ ] No source code created or modified in this planning phase
