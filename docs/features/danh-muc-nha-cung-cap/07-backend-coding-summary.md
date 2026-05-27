# Backend Coding Summary: Danh Mục Nhà Cung Cấp (Supplier Management)

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Implementation Summary

Phase 7 implements all backend changes for the Supplier Management feature. Added 5 new domain fields (`supplierType`, `groupName`, `idNumber`, `isCustomer`, `isInternalObject`), expanded `code` max length from 32 to 50, added `BulkDeleteSuppliersCommand` and `GetSuppliersSummaryQuery`, extended all list/detail DTOs, updated all handlers to use a shared `ToDto()` helper, and registered all new endpoints in `SupplierEndpoints`.

TDD cycle followed for every validator. Per-task code review performed for G1–G4. All 71 unit tests pass; solution builds clean.

---

## 2. Files Created

| File | Purpose |
|------|---------|
| `src/Domain/Enums/SupplierType.cs` | SupplierType enum (Organization=1, Individual=2) |
| `src/Application/Features/Suppliers/Commands/BulkDeleteSuppliers/BulkDeleteSuppliersCommand.cs` | Bulk soft-delete up to 100 suppliers |
| `src/Application/Features/Suppliers/Queries/GetSuppliersSummary/GetSuppliersSummaryQuery.cs` | Aggregate summary: total debt, credit, active/inactive counts |
| `src/Infrastructure/Persistence/Migrations/20260526110009_AddSupplierNewFields.cs` | EF migration: code max 32→50, 5 new columns |
| `tests/AccountingApi.UnitTests/Suppliers/BulkDeleteSuppliersCommandValidatorTests.cs` | Validator tests: empty ids, 1, 100, 101 ids |

---

## 3. Files Modified

| File | Change |
|------|--------|
| `src/Domain/Entities/Supplier.cs` | +5 properties; updated Create() (12 params) and Update() (11 params) |
| `src/Domain/Errors/SupplierErrors.cs` | Added BulkHasTransactionsError |
| `src/Infrastructure/Persistence/Configurations/SupplierConfiguration.cs` | Code max 32→50; SupplierType with HasConversion<int>(); 4 new column configs |
| `src/Application/Features/Suppliers/Dtos/SupplierListItemDto.cs` | 10→13 fields (added supplierType, groupName, isCustomer) |
| `src/Application/Features/Suppliers/Dtos/SupplierDetailDto.cs` | 12→17 fields (added supplierType, groupName, idNumber, isCustomer, isInternalObject) |
| `src/Application/Features/Suppliers/Commands/CreateSupplier/CreateSupplierCommand.cs` | 12-param command; added shared ToDto() helper; updated validator (code max 50, supplierType 1\|2, new fields) |
| `src/Application/Features/Suppliers/Commands/UpdateSupplier/UpdateSupplierCommand.cs` | 12-param command (no Code); uses CreateSupplierCommandHandler.ToDto() |
| `src/Application/Features/Suppliers/Commands/ToggleSupplierActive/ToggleSupplierActiveCommand.cs` | Uses CreateSupplierCommandHandler.ToDto() |
| `src/Application/Features/Suppliers/Commands/CloneSupplier/CloneSupplierCommand.cs` | Passes new fields to Supplier.Create(); code max 50 in GenerateUniqueCodeAsync |
| `src/Application/Features/Suppliers/Queries/GetSuppliers/GetSuppliersQuery.cs` | 7th param groupName; ILike filter; updated Select projection |
| `src/Application/Features/Suppliers/Queries/GetSupplierById/GetSupplierByIdQuery.cs` | Uses CreateSupplierCommandHandler.ToDto() |
| `src/Api/Endpoints/SupplierEndpoints.cs` | Added groupName param, GET /summary, POST /bulk-delete (with 409 handling); extended UpdateSupplierBody |
| `tests/AccountingApi.UnitTests/Suppliers/CreateSupplierCommandValidatorTests.cs` | 12-param helper; added supplierType, groupName, idNumber tests |
| `tests/AccountingApi.UnitTests/Suppliers/UpdateSupplierCommandValidatorTests.cs` | 12-param helper; added supplierType, groupName, idNumber tests |
| `tests/AccountingApi.UnitTests/Suppliers/GetSuppliersQueryValidatorTests.cs` | 7-param constructor calls |
| `tests/AccountingApi.IntegrationTests/Suppliers/SupplierEndpointsTests.cs` | Fixed pre-existing compilation errors (PostgresFixture _ → pg, GetConnectionString() → ConnectionString); added supplierType=1 to create/update calls |

---

## 4. API Contract Mapping

| Endpoint | Status | Handler |
|----------|--------|---------|
| GET /api/v1/suppliers | Updated | GetSuppliersQueryHandler (+groupName filter) |
| GET /api/v1/suppliers/summary | New | GetSuppliersSummaryQueryHandler |
| GET /api/v1/suppliers/export | Unchanged | ExportSuppliersQueryHandler |
| GET /api/v1/suppliers/{id} | Updated | GetSupplierByIdQueryHandler (+new DTO fields) |
| POST /api/v1/suppliers | Updated | CreateSupplierCommandHandler (+new fields) |
| PUT /api/v1/suppliers/{id} | Updated | UpdateSupplierCommandHandler (+new fields) |
| DELETE /api/v1/suppliers/{id} | Unchanged | DeleteSupplierCommandHandler |
| POST /api/v1/suppliers/bulk-delete | New | BulkDeleteSuppliersCommandHandler |
| PUT /api/v1/suppliers/bulk-update-address | Unchanged | BulkUpdateSupplierAddressCommandHandler |
| PATCH /api/v1/suppliers/{id}/toggle-active | Unchanged | ToggleSupplierActiveCommandHandler |
| POST /api/v1/suppliers/{id}/clone | Updated | CloneSupplierCommandHandler (code max 50) |

---

## 5. Database / Migration Changes

Migration: `20260526110009_AddSupplierNewFields`

| Change | Type | Notes |
|--------|------|-------|
| `suppliers.code` varchar(32→50) | AlterColumn | Safe expansion, no data loss |
| `suppliers.supplier_type` int NOT NULL DEFAULT 1 | AddColumn | Existing rows get Organization |
| `suppliers.group_name` varchar(100) NULL | AddColumn | |
| `suppliers.id_number` varchar(32) NULL | AddColumn | |
| `suppliers.is_customer` boolean NOT NULL DEFAULT false | AddColumn | |
| `suppliers.is_internal_object` boolean NOT NULL DEFAULT false | AddColumn | |

Migration not applied to DB yet (requires running environment).

---

## 6. Validation Implemented

| Command | Field | Rule |
|---------|-------|------|
| Create | Code | NotEmpty, MaxLength(50) |
| Create | Name | NotEmpty |
| Create | SupplierType | Must(1 or 2) |
| Create | GroupName | MaxLength(100) when not null |
| Create | TaxCode | MaxLength(32) when not null |
| Create | IdNumber | MaxLength(32) when not null |
| Create | Email | EmailAddress when not null |
| Create | Phone | MaxLength(32) when not null |
| Create | Address | MaxLength(500) when not null |
| Create | BankAccount | MaxLength(50) when not null |
| Update | Name | NotEmpty |
| Update | SupplierType | Must(1 or 2) |
| Update | GroupName/IdNumber/Email/Address/BankAccount | Same max-length rules |
| BulkDelete | Ids | NotEmpty, Count <= 100 |

---

## 7. Permission Changes

No new permissions added. `Permissions.SupplierBulkDelete` was already present in `Permissions.cs`. All endpoints use existing supplier permission constants.

---

## 8. Multi-tenant Handling

All queries filter by tenant via EF Core global query filter (combined tenant + soft-delete in `AppDbContext`). `ITransactionalRequest` marks commands that mutate state. No explicit `TenantId` filter needed in handlers.

---

## 9. Error Handling

| Error | HTTP | When |
|-------|------|------|
| supplier.not_found | 404 | GetById, Update, Delete, ToggleActive, Clone |
| supplier.duplicate_code | 409 | Create |
| supplier.has_transactions | 409 | Delete (stub, always 0) |
| supplier.bulk_has_transactions | 409 + affectedIds | BulkDelete (stub, always 0) |
| Validation errors | 400 | All commands |

---

## 10. Deviations from Plan or Contract

| # | Deviation | Reason |
|---|-----------|--------|
| 1 | `BulkDeleteSuppliersCommand` uses a stub for transaction check | Real transaction module not yet built; stub consistent with `DeleteSupplierCommand` pattern |
| 2 | `GetSuppliersSummaryDto` named `SupplierSummaryDto` in code | Shorter, matches naming convention of other DTOs |

---

## 11. Commands Run

```
dotnet build AccountingApi.sln --no-restore         → Build succeeded (0 errors)
dotnet test tests/AccountingApi.UnitTests/...        → 71 passed, 0 failed
dotnet ef migrations add AddSupplierNewFields ...    → Done
```

---

## 12. Known Limitations

- Transaction check in Delete and BulkDelete is a stub (always returns 0 transactions). Real implementation deferred until the transaction module is built.
- Migration has not been applied to any environment in this session.

---

## 13. Unclear / Incomplete Items

| # | Item | Required Before Next Phase? |
|---|------|----------------------------|
| B6-Q1 | BulkDelete transaction check stub — same pattern as single delete | No (resolved: stub is intentional) |

---

## 14. Definition of Done

- [x] All new/modified files compile (build succeeded)
- [x] 71 unit tests pass, 0 failures
- [x] TDD cycle followed for all new validators (BulkDelete, CreateSupplier, UpdateSupplier updates)
- [x] EF migration generated for schema changes
- [x] All Phase 4 API contract endpoints are implemented
- [x] Permission enforcement on all endpoints
- [x] Tenant isolation via global query filter
- [x] 07-backend-coding-summary.md created
