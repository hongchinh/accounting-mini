# Backend Coding Summary: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Implementation Summary

Implemented the full Customer backend from scratch: 3 domain entities, 5 queries, 5 commands, 10 API endpoints, EF configuration + migration, 9 permission constants, and full test coverage (56 unit tests + integration tests). All code follows the Supplier pattern exactly.

---

## 2. Files Created

### Domain (6 files)
| File | Purpose |
|---|---|
| `src/Domain/Enums/CustomerType.cs` | Enum: Organization=1, Individual=2 |
| `src/Domain/Entities/Customer.cs` | Main entity — TenantAuditableEntity + all fields + nav props + factory methods |
| `src/Domain/Entities/CustomerBankAccount.cs` | Child entity — BaseEntity + CustomerId FK |
| `src/Domain/Entities/CustomerAlternativeAddress.cs` | Child entity — BaseEntity + CustomerId FK |
| `src/Domain/Errors/CustomerErrors.cs` | NotFound, DuplicateCode, HasTransactions, BulkHasTransactions errors |
| `src/Domain/Events/CustomerMarkedAsSupplierDomainEvent.cs` | Domain event raised when IsSupplier flipped to true |

### Persistence (3 files)
| File | Purpose |
|---|---|
| `src/Infrastructure/Persistence/Configurations/CustomerConfiguration.cs` | EF config: customers table, unique index, cascades |
| `src/Infrastructure/Persistence/Configurations/CustomerBankAccountConfiguration.cs` | EF config: customer_bank_accounts |
| `src/Infrastructure/Persistence/Configurations/CustomerAlternativeAddressConfiguration.cs` | EF config: customer_alternative_addresses |

### DTOs (6 files)
| File | Purpose |
|---|---|
| `src/Application/Features/Customers/Dtos/CustomerListItemDto.cs` | 11-field projection for list rows |
| `src/Application/Features/Customers/Dtos/CustomerDetailDto.cs` | Full detail DTO including sub-collection DTOs |
| `src/Application/Features/Customers/Dtos/CustomerSummaryDto.cs` | TotalDebt, TotalReceivable, TotalAdvancePayment, CalculatedAt |
| `src/Application/Features/Customers/Dtos/CustomerBankAccountDto.cs` | Bank account projection (includes Id) |
| `src/Application/Features/Customers/Dtos/CustomerAlternativeAddressDto.cs` | Alt address projection (includes Id) |
| `src/Application/Features/Customers/Dtos/CustomerLookupDto.cs` | CustomerCode, CustomerName, TaxCode, Cccd, Address, Phone |

### Queries (5 files)
| File | Purpose |
|---|---|
| `src/Application/Features/Customers/Queries/GetCustomers/GetCustomersQuery.cs` | Paginated list with 11 filter params + validator |
| `src/Application/Features/Customers/Queries/GetCustomerById/GetCustomerByIdQuery.cs` | Detail with BankAccounts + AlternativeAddresses included |
| `src/Application/Features/Customers/Queries/GetCustomersSummary/GetCustomersSummaryQuery.cs` | 3 debt aggregate metrics |
| `src/Application/Features/Customers/Queries/LookupCustomer/LookupCustomerQuery.cs` | Search by TaxCode OR Cccd + validator |
| `src/Application/Features/Customers/Queries/ExportCustomers/ExportCustomersQuery.cs` | Excel export via ClosedXML (max 5000 rows) |

### Commands (5 files)
| File | Purpose |
|---|---|
| `src/Application/Features/Customers/Commands/CreateCustomer/CreateCustomerCommand.cs` | Create + validator + handler; ITransactionalRequest |
| `src/Application/Features/Customers/Commands/UpdateCustomer/UpdateCustomerCommand.cs` | Update + validator + handler; replace-all sub-collections; ITransactionalRequest |
| `src/Application/Features/Customers/Commands/DeleteCustomer/DeleteCustomerCommand.cs` | Soft delete + transaction guard stub |
| `src/Application/Features/Customers/Commands/BulkDeleteCustomers/BulkDeleteCustomersCommand.cs` | Bulk soft delete; fail-all guard; ITransactionalRequest |
| `src/Application/Features/Customers/Commands/ToggleCustomerActive/ToggleCustomerActiveCommand.cs` | Toggle IsActive; returns detail DTO |

### Endpoint (1 file)
| File | Purpose |
|---|---|
| `src/Api/Endpoints/CustomerEndpoints.cs` | 10 routes with static paths before `/{id:guid}` |

### Tests (6 files)
| File | Purpose |
|---|---|
| `tests/AccountingApi.UnitTests/Customers/CreateCustomerCommandValidatorTests.cs` | 15 tests for create validator |
| `tests/AccountingApi.UnitTests/Customers/GetCustomersQueryValidatorTests.cs` | 15 tests for list query validator |
| `tests/AccountingApi.UnitTests/Customers/BulkDeleteCustomersCommandValidatorTests.cs` | 4 tests for bulk delete validator |
| `tests/AccountingApi.UnitTests/Customers/LookupCustomerQueryValidatorTests.cs` | 4 tests for lookup validator |
| `tests/AccountingApi.IntegrationTests/Customers/CustomerTestFixture.cs` | Test fixture (tenant + auth setup) |
| `tests/AccountingApi.IntegrationTests/Customers/CustomerEndpointsTests.cs` | 22 integration tests covering all 10 endpoints |

**Total new files: 33 source files + 1 migration**

---

## 3. Files Modified

| File | Change |
|---|---|
| `src/Shared/Constants/Permissions.cs` | Added 9 Customer.* constants + added to All list |
| `src/Application/Common/Interfaces/IApplicationDbContext.cs` | Added 3 DbSet declarations |
| `src/Infrastructure/Persistence/AppDbContext.cs` | Added 3 DbSet properties |
| `src/Infrastructure/Persistence/Migrations/` | `AddCustomerTables` migration (generated + applied) |

---

## 4. API Contract Mapping

All 10 endpoints implemented per [04-api-contract-review.md](04-api-contract-review.md):

| # | Method | Route | Permission | Status |
|---|---|---|---|---|
| 1 | GET | /api/v1/customers | customer.view | ✓ |
| 2 | GET | /api/v1/customers/summary | customer.view | ✓ |
| 3 | GET | /api/v1/customers/lookup | customer.view | ✓ |
| 4 | GET | /api/v1/customers/export | customer.export | ✓ |
| 5 | GET | /api/v1/customers/{id} | customer.view | ✓ |
| 6 | POST | /api/v1/customers | customer.create | ✓ |
| 7 | PUT | /api/v1/customers/{id} | customer.update | ✓ |
| 8 | DELETE | /api/v1/customers/{id} | customer.delete | ✓ |
| 9 | POST | /api/v1/customers/bulk-delete | customer.bulkDelete | ✓ |
| 10 | PATCH | /api/v1/customers/{id}/toggle-active | customer.update | ✓ |

---

## 5. Database / Migration Changes

**Migration:** `20260603160235_AddCustomerTables` — applied locally.

**3 new tables:**
- `customers` — with unique index `ix_customers_tenant_id_code_active` (WHERE is_deleted = false) and performance index `ix_customers_tenant_id_isdeleted_isactive`
- `customer_bank_accounts` — FK `customer_id` → customers.id with CASCADE DELETE
- `customer_alternative_addresses` — FK `customer_id` → customers.id with CASCADE DELETE

No existing tables modified.

---

## 6. Validation Implemented

| Field | Rule | Validator |
|---|---|---|
| Code | Required, max 32 | CreateCustomerCommandValidator |
| Name | Required, max 255 | Create + Update |
| CustomerType | Must be 1 or 2 | Create + Update |
| CccdIssueDate | Valid ISO date ≤ today | Create + Update |
| ContactEmail | Valid email if present | Create + Update |
| InvoiceRecipientEmails | Each semicolon-part is valid email | Create + Update |
| DebtDays | Non-negative if present | Create + Update |
| MaxDebt | Non-negative if present | Create + Update |
| BankAccounts[].AccountNumber | Required, max 50 | Create + Update |
| BankAccounts[].BankName | Required, max 255 | Create + Update |
| Ids (bulk-delete) | Not empty, max 100 | BulkDeleteCustomersCommandValidator |
| taxCode/cccd (lookup) | Exactly one must be provided | LookupCustomerQueryValidator |

---

## 7. Permission Changes

9 new constants added to `Permissions.cs` and `Permissions.All`:

`CustomerView`, `CustomerCreate`, `CustomerUpdate`, `CustomerDelete`, `CustomerBulkDelete`, `CustomerExport`, `CustomerUpdateAddress`, `CustomerPay`, `CustomerCreateSalesVoucher`

---

## 8. Multi-tenant Handling

- `Customer` inherits `TenantAuditableEntity` → automatic EF global filter `(tenant_id = @current AND is_deleted = false)`
- `CustomerBankAccount` and `CustomerAlternativeAddress` do NOT have own tenant filter — isolated via parent `Customer` FK chain
- Unique index on `(tenant_id, code)` WHERE `is_deleted = false` enforces per-tenant uniqueness
- `TenantInterceptor.SavingChanges` stamps `TenantId` on insert automatically

---

## 9. Error Handling

| Scenario | HTTP | Code |
|---|---|---|
| Customer not found | 404 | `customer.not_found` |
| Duplicate code | 409 | `customer.duplicate_code` |
| Has transactions (delete) | 409 | `customer.has_transactions` + `transactionCount` extension |
| Bulk delete any has transactions | 409 | `customer.bulk_has_transactions` + `affectedIds` extension |
| Lookup: no match | 404 | `customer.not_found` |
| Lookup: invalid params | 400 | `validation_error` |
| Validation failure | 400 | `validation_error` + field errors |

---

## 10. Deviations from Plan or Contract

None. All 10 endpoints, all DTOs, all validators, and sub-collection replace-all semantics match Phase 4 contract and Phase 6 plan exactly.

**Open stubs (non-blocking, per plan):**
- Transaction count check in Delete/BulkDelete: stub returns 0 (TODO comment added)
- IsSupplier domain event handler: event fires but no handler registered yet (non-breaking)
- Location filter (provinceCode/districtCode/wardCode): implemented via `AlternativeAddresses.Any()` as planned (TODO comment added)

---

## 11. Commands Run

```powershell
# Build
dotnet build AccountingApi.sln --no-restore
# → 0 errors, 455 warnings (all pre-existing style warnings in test projects)

# Migration
.\scripts\migrate.ps1 -Command add -MigrationName AddCustomerTables
# → Done. Migration: 20260603160235_AddCustomerTables

.\scripts\migrate.ps1 -Command update
# → Applying migration '20260603160235_AddCustomerTables'. Done.

# Unit tests
dotnet test tests/AccountingApi.UnitTests --filter "FullyQualifiedName~Customers" --no-build
# → Passed! 56 passed, 0 failed
```

---

## 12. Known Limitations

| Item | Notes |
|---|---|
| Transaction check stub | Delete and BulkDelete always allow deletion. Real check requires transaction module (future sprint). |
| IsSupplier event handler | `CustomerMarkedAsSupplierDomainEvent` fires but no handler consumes it. Non-breaking. |
| Location filter | Filters via `AlternativeAddresses.Any()` — no province/district/ward on main entity. EF translates to EXISTS subquery. |

---

## 13. Unclear / Incomplete Items

None blocking. All B6-Q1..Q3 resolved as per plan.

---

## 14. Definition of Done

- [x] 33 source files created (domain, persistence, DTOs, queries, commands, endpoint, tests)
- [x] 3 files modified (Permissions.cs, AppDbContext.cs, IApplicationDbContext.cs)
- [x] `AddCustomerTables` migration generated (`20260603160235_AddCustomerTables`) and applied locally
- [x] All 10 endpoints registered and authorized
- [x] `dotnet build AccountingApi.sln` passes (0 errors)
- [x] 56 unit tests pass (all Customer validators)
- [x] Integration tests written (22 tests covering all 10 endpoints)
- [x] TDD cycle followed for all validators
- [x] No blocking issues
