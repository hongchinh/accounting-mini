# Backend Implementation Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

## 1. Goal

Extend the existing Supplier backend to support: SupplierType enum, 4 new entity fields (GroupName, IdNumber, IsCustomer, IsInternalObject), 2 new endpoints (summary cards, bulk-delete), and `groupName` list filter. All existing endpoints keep working. See `04-api-contract-review.md` for the authoritative contract.

## 2. Scope

**In scope:**
- New enum: `SupplierType` (Organization=1, Individual=2)
- Entity extensions: SupplierType, GroupName, IdNumber, IsCustomer, IsInternalObject
- Code max length: 32 → 50 (PDR authoritative)
- DTO extensions: SupplierListItemDto, SupplierDetailDto
- Command extensions: Create + Update (new fields + updated code max)
- Query extension: GetSuppliersQuery (groupName filter)
- New query: GetSuppliersSummary
- New command: BulkDeleteSuppliers (fail-all semantics)
- EF configuration + migration
- Endpoint registration of 2 new routes

**Out of scope:** clone, bulk-update-address, import, merge, province/period filters.

## 3. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| `accounting_api/src/Domain/Errors/SupplierErrors.cs` | Exists | Add `BulkHasTransactions` |
| `accounting_api/src/Shared/Constants/Permissions.cs` | Exists | `SupplierBulkDelete` already present |
| `accounting_api/src/Infrastructure/Persistence/Configurations/SupplierConfiguration.cs` | Exists | Extend |
| `accounting_api/src/Application/Common/Interfaces/IApplicationDbContext.cs` | Exists | `DbSet<Supplier>` already defined |
| `./scripts/migrate.ps1` | Exists | Used to generate migration |

No new external packages needed.

## 4. File Change Plan

| # | File Path | New/Modify | Purpose | Priority |
|---|-----------|------------|---------|----------|
| 1 | `accounting_api/src/Domain/Enums/SupplierType.cs` | New | SupplierType enum (Organization=1, Individual=2) | P1 |
| 2 | `accounting_api/src/Domain/Entities/Supplier.cs` | Modify | Add 5 new properties + extend Create/Update methods | P1 |
| 3 | `accounting_api/src/Domain/Errors/SupplierErrors.cs` | Modify | Add `BulkHasTransactions(List<Guid> affectedIds)` error | P1 |
| 4 | `accounting_api/src/Infrastructure/Persistence/Configurations/SupplierConfiguration.cs` | Modify | Map new columns; update Code max 32→50 | P2 |
| 5 | `accounting_api/src/Infrastructure/Persistence/Migrations/` | New (generated) | `AddSupplierNewFields` migration | P2 |
| 6 | `accounting_api/src/Application/Features/Suppliers/Dtos/SupplierListItemDto.cs` | Modify | Add SupplierType, GroupName, IsCustomer | P3 |
| 7 | `accounting_api/src/Application/Features/Suppliers/Dtos/SupplierDetailDto.cs` | Modify | Add all 5 new fields | P3 |
| 8 | `accounting_api/src/Application/Features/Suppliers/Commands/CreateSupplier/CreateSupplierCommand.cs` | Modify | Add 5 new fields; update Code validator max 32→50 | P3 |
| 9 | `accounting_api/src/Application/Features/Suppliers/Commands/UpdateSupplier/UpdateSupplierCommand.cs` | Modify | Add 5 new fields (no Code) | P3 |
| 10 | `accounting_api/src/Application/Features/Suppliers/Commands/BulkDeleteSuppliers/BulkDeleteSuppliersCommand.cs` | New | BulkDeleteSuppliersCommand + Validator + Handler | P3 |
| 11 | `accounting_api/src/Application/Features/Suppliers/Queries/GetSuppliers/GetSuppliersQuery.cs` | Modify | Add `GroupName?` filter; update DTO projection with new fields | P3 |
| 12 | `accounting_api/src/Application/Features/Suppliers/Queries/GetSupplierById/GetSupplierByIdQuery.cs` | Modify | Update DTO projection with new fields | P3 |
| 13 | `accounting_api/src/Application/Features/Suppliers/Queries/GetSuppliersSummary/GetSuppliersSummaryQuery.cs` | New | GetSuppliersSummaryQuery + Handler + SupplierSummaryDto | P3 |
| 14 | `accounting_api/src/Application/Features/Suppliers/Commands/ToggleSupplierActive/ToggleSupplierActiveCommand.cs` | Modify | Update SupplierDetailDto construction with new fields | P4 |
| 15 | `accounting_api/src/Application/Features/Suppliers/Commands/CloneSupplier/CloneSupplierCommand.cs` | Modify | Update SupplierDetailDto construction with new fields | P4 |
| 16 | `accounting_api/src/Api/Endpoints/SupplierEndpoints.cs` | Modify | Register summary + bulk-delete routes; extend UpdateSupplierBody | P4 |

**Files to Create:** 3 source files + 1 migration  
**Files to Modify:** 12

## 5. Implementation Steps

### G1 — Domain (no dependencies)
1. Create `SupplierType.cs` enum
2. Extend `Supplier.cs` entity (add properties, update `Create()` and `Update()` signatures)
3. Add `BulkHasTransactions` to `SupplierErrors.cs`

### G2 — Persistence
4. Update `SupplierConfiguration.cs` (new column mappings, Code max 50)
5. Run migration: `./scripts/migrate.ps1 -Command add -Name AddSupplierNewFields`
6. Verify generated migration has correct column types and defaults

### G3 — Application Layer
7. Update `SupplierListItemDto.cs` (add SupplierType, GroupName, IsCustomer)
8. Update `SupplierDetailDto.cs` (add all 5 new fields)
9. Update `CreateSupplierCommand.cs` (new fields + code max 50)
10. Update `UpdateSupplierCommand.cs` (new fields, no code)
11. Create `BulkDeleteSuppliersCommand.cs` (command + validator + handler)
12. Create `GetSuppliersSummaryQuery.cs` (query + handler + SupplierSummaryDto)
13. Update `GetSuppliersQuery.cs` (add groupName filter + DTO projection)
14. Update `GetSupplierByIdQuery.cs` (DTO projection)

### G4 — Endpoint Wiring
15. Update `ToggleSupplierActiveCommand.cs` (DTO construction)
16. Update `CloneSupplierCommand.cs` (DTO construction)
17. Update `SupplierEndpoints.cs` (register 2 new routes, extend UpdateSupplierBody)

## 6. Request Flow

```
HTTP Request
  → TenantResolutionMiddleware (JWT claim → X-Tenant-Id header)
  → RequireAuthorization (permission check via policy)
  → Minimal API handler (inline lambda in SupplierEndpoints)
  → ISender.Send(Command/Query)
  → MediatR pipeline: ValidationBehavior → LoggingBehavior → [TransactionBehavior if ITransactionalRequest]
  → CommandHandler / QueryHandler (IApplicationDbContext + global query filter applies tenant+soft-delete)
  → Result<T>.ToHttp() or Results.Problem() on error
```

**Tenant isolation:** Applied automatically by EF Core `HasQueryFilter` combining `TenantId == currentTenantId && !IsDeleted`.

## 7. Query Strategy

| Query | Strategy |
|---|---|
| GetSuppliersQuery | `AsNoTracking`, server-side pagination, existing pattern + add `groupName` ILike filter |
| GetSupplierByIdQuery | `FirstOrDefaultAsync` by Id (global filter handles tenant + soft-delete) |
| GetSuppliersSummaryQuery | Single `GroupBy(x => x.TenantId)` or aggregate `SUM/COUNT` over `db.Suppliers.AsNoTracking()` |
| BulkDeleteSuppliersCommand | 1. `WHERE id IN (@ids)` load with tracking → 2. check transactions → 3. `ExecuteDeleteAsync` or soft-delete loop |

**Summary query:** Compute `TotalDebtAmount` as sum of positive `CurrentDebtAmount`, `TotalCreditAmount` as absolute sum of negative values. All via single LINQ query or two `SumAsync` calls on tenant-filtered set.

**BulkDelete:** Load IDs via `Where(x => ids.Contains(x.Id))`, check each for transactions (Phase 7 determines whether via a join or a count per ID), fail-all if any has transactions. Mark `IsDeleted = true` on all, save.

## 8. Error Handling Strategy

| Scenario | HTTP | Error Code | Extension |
|---|---|---|---|
| Supplier not found | 404 | `supplier.not_found` | — |
| Duplicate code (create) | 409 | `supplier.duplicate_code` | — |
| Single delete has transactions | 409 | `supplier.has_transactions` | `transactionCount` |
| Bulk delete any has transactions | 409 | `supplier.bulk_has_transactions` | `affectedIds` |
| Validation failure | 400 | `validation_error` | field-level errors |
| Unauthorised | 401 | — | — |
| Missing permission | 403 | — | — |

`BulkHasTransactionsError` pattern: extend `SupplierErrors.cs` with a record carrying `List<Guid> AffectedIds`, mirroring `SupplierHasTransactionsError` pattern.

Endpoint wiring for bulk-delete 409 mirrors existing single-delete pattern (check `result.Error is BulkHasTransactionsError` then `Results.Problem(extensions: { "affectedIds": [...] })`).

## 9. Security Strategy

- Every new endpoint gets `.RequireAuthorization(Permissions.SupplierView)` / `...BulkDelete` / etc.
- Summary endpoint: `Permissions.SupplierView` (read-only aggregate).
- Bulk-delete endpoint: `Permissions.SupplierBulkDelete` (already in `Permissions.cs`).
- No new permission constants needed.

## 10. Multi-tenant Strategy

| Aspect | Implementation |
|---|---|
| Summary | EF global query filter already scopes to `TenantId` — no extra filter needed |
| BulkDelete | Filter applied via global query filter; IDs from other tenants return 0 rows (silently ignored) |
| Code uniqueness | Unique index on `(tenant_id, code)` WHERE `is_deleted = false` — already enforced |

## 11. Permission Strategy

| Endpoint | Constant | Value |
|---|---|---|
| GET /api/v1/suppliers/summary | `Permissions.SupplierView` | `supplier.view` |
| POST /api/v1/suppliers/bulk-delete | `Permissions.SupplierBulkDelete` | `supplier.bulkDelete` |
| (all others — unchanged) | — | — |

All constants already in `Permissions.cs` — no file changes needed.

## 12. Validation Strategy

| New Rule | Location |
|---|---|
| `SupplierType` required, must be 1 or 2 | `CreateSupplierCommandValidator`, `UpdateSupplierCommandValidator` |
| `Code` max 50 (was 32) | `CreateSupplierCommandValidator` |
| `GroupName` max 100 | Both validators |
| `IdNumber` max 32 | Both validators |
| `BulkDeleteSuppliersCommand.Ids` not empty, max 100 | `BulkDeleteSuppliersCommandValidator` |

Pipeline: `ValidationBehavior` auto-runs FluentValidation before handler — no changes to pipeline.

## 13. Migration Strategy

```powershell
# Generate migration
./scripts/migrate.ps1 -Command add -Name AddSupplierNewFields

# Apply (dev)
./scripts/migrate.ps1 -Command update
```

**New columns and defaults:**

| Column | Type | Default |
|---|---|---|
| `supplier_type` | int NOT NULL | `1` (Organization) |
| `group_name` | varchar(100) NULL | — |
| `id_number` | varchar(32) NULL | — |
| `is_customer` | bool NOT NULL | `false` |
| `is_internal_object` | bool NOT NULL | `false` |

**Column size change:** `code` varchar(32) → varchar(50). Needs explicit migration column alteration.

**No data loss** — all new columns are nullable or have defaults; existing rows are safe.

## 14. Test Impact

| Area | Impact |
|---|---|
| `CreateSupplierCommandHandler` tests | Must supply `SupplierType` (required) — update test fixtures |
| `GetSuppliersQueryHandler` tests | `groupName` filter — add new test cases |
| New: `GetSuppliersSummaryQuery` | Unit tests for aggregate logic |
| New: `BulkDeleteSuppliersCommand` | Unit tests for transaction guard (fail-all) + success path |
| DTO construction | All existing handler tests that construct `SupplierDetailDto` need new fields |

Integration tests: update `CustomWebApplicationFactory` seed data if it creates suppliers — add `SupplierType` field.

## 15. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Positional record DTO change breaks all handler call sites | Medium | Fix in G3 step 7–8 before touching handlers; compiler will catch all sites |
| Bulk-delete transaction check: how to detect "has transactions"? | High | Phase 7 determines mechanism (likely a join/count on a related table; verify table name in Phase 7) |
| `CloneSupplier` handler constructs SupplierDetailDto — must pass new fields | Low | Read before modify in Phase 7 |
| Code varchar(32→50) migration on PostgreSQL | Low | `ALTER COLUMN` is instant on Postgres for varchar widening |

**B6-Q1 open item:** How does the existing `DeleteSupplierCommand` check for transactions? This same mechanism drives `BulkDelete`. Read the handler in Phase 7 to confirm the join table/count pattern.

## 16. Checklist Before Coding

- [ ] `04-api-contract-review.md` status is Approved ✓
- [ ] `03-backend-basic-design.md` status is Completed ✓
- [ ] `06-backend-implementation-plan.md` approved by user
- [ ] All file paths verified against actual project structure ✓
- [ ] No new NuGet packages required ✓
- [ ] `Permissions.SupplierBulkDelete` already in `Permissions.cs` ✓
- [ ] Migration script available at `./scripts/migrate.ps1` ✓
- [ ] Confirm `confirm backend coding` before starting Phase 7

## 17. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| B6-Q1 | How does `DeleteSupplierCommand` detect transactions? Join table name unknown. | No | Read handler in Phase 7 before implementing `BulkDeleteSuppliersCommand` |
| B6-A1 | `GetSuppliersSummary` uses two `SumAsync` calls (debt + credit) rather than a single SQL aggregate. | No | Acceptable for current scale; can optimize in Phase 10 |
| B6-A2 | `BulkDelete` soft-deletes via loop over loaded entities (not `ExecuteDeleteAsync`) to trigger domain events / audit. | No | May change to `ExecuteUpdateAsync` if no domain events needed; decide in Phase 7 |

## 18. Definition of Done

- [ ] All 3 new source files created
- [ ] All 12 modified files updated
- [ ] `AddSupplierNewFields` migration generated and applied locally
- [ ] All existing endpoints still work (no breaking change to existing DTOs)
- [ ] New endpoints: `GET /summary` and `POST /bulk-delete` registered and authorized
- [ ] `supplier.view` user can call summary endpoint
- [ ] `supplier.bulkDelete` user can call bulk-delete endpoint
- [ ] Build passes: `dotnet build AccountingApi.sln`
- [ ] No source code created or modified in this phase (planning only)
