# Backend Implementation Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Goal
Implement backend source for Supplier Management per the approved Phase 4 API Contract. Covers domain entity, EF config, migration, 9 MediatR handlers, SupplierEndpoints, permission constants, and Excel export (ClosedXML).

## 2. Scope
**In:** Supplier entity + errors, `PageResult<T>` wrapper, EF configuration, 3 queries + 6 commands, SupplierEndpoints (IEndpoint), Permissions.cs update, ClosedXML addition, migration.

**Not in:** real transaction check (stub returning 0 — P3-A2), metric summary endpoint, bulk delete.

## 3. Dependencies

| Dependency | Exists? | Action |
|---|---|---|
| `TenantAuditableEntity` + `ISoftDelete` | ✓ | Inherit as base class |
| `IApplicationDbContext` + `AppDbContext` | ✓ | Add `DbSet<Supplier>` to both |
| `PaginatedList<T>` (has `TotalCount`) | ✓ | Create `PageResult<T>` wrapper (maps to `Total`) |
| `Result<T>` + `.ToHttp()` | ✓ | Use as-is |
| FluentValidation pipeline behavior | ✓ | Validators auto-run via pipeline |
| `IEndpoint` auto-discovery | ✓ | Create `SupplierEndpoints` |
| `ITransactionalRequest` marker | ✓ | Apply to create/update/bulk commands |
| ClosedXML (MIT export) | ✗ | Add to `Directory.Packages.props` + `Infrastructure.csproj` |

## 4. File Change Plan

### New files (29 files across 16 paths)

| Path | # | Notes |
|---|---:|---|
| `accounting_api/src/Domain/Entities/Supplier.cs` | 1 | `TenantAuditableEntity`; entity methods: Create, Update, UpdateAddress, ToggleActive, UpdateCurrentDebt |
| `accounting_api/src/Domain/Errors/SupplierErrors.cs` | 1 | `NotFound`, `DuplicateCode`, `HasTransactions` static errors |
| `accounting_api/src/Shared/Pagination/PageResult.cs` | 1 | `record PageResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize)` |
| `accounting_api/src/Infrastructure/Persistence/Configurations/SupplierConfiguration.cs` | 1 | `IEntityTypeConfiguration<Supplier>`; table `suppliers`; unique index on `(tenant_id, code) WHERE NOT is_deleted`; perf index on `(tenant_id, is_deleted, is_active)` |
| `accounting_api/src/Application/Features/Suppliers/Dtos/SupplierListItemDto.cs` | 1 | No `Email` field (D1); dates as `CreatedAt`/`UpdatedAt` (D3) |
| `accounting_api/src/Application/Features/Suppliers/Dtos/SupplierDetailDto.cs` | 1 | All fields incl. `Email`, `BankAccount` |
| `accounting_api/src/Application/Features/Suppliers/Queries/GetSuppliers/` | 3 | `GetSuppliersQuery.cs` + `GetSuppliersQueryHandler.cs` + `GetSuppliersQueryValidator.cs` |
| `accounting_api/src/Application/Features/Suppliers/Queries/GetSupplierById/` | 2 | `GetSupplierByIdQuery.cs` + `GetSupplierByIdQueryHandler.cs` |
| `accounting_api/src/Application/Features/Suppliers/Queries/ExportSuppliers/` | 2 | `ExportSuppliersQuery.cs` + `ExportSuppliersQueryHandler.cs` (ClosedXML) |
| `accounting_api/src/Application/Features/Suppliers/Commands/CreateSupplier/` | 3 | `CreateSupplierCommand.cs` + `Handler.cs` + `Validator.cs`; `ITransactionalRequest` |
| `accounting_api/src/Application/Features/Suppliers/Commands/UpdateSupplier/` | 3 | `UpdateSupplierCommand.cs` + `Handler.cs` + `Validator.cs`; `ITransactionalRequest` |
| `accounting_api/src/Application/Features/Suppliers/Commands/DeleteSupplier/` | 2 | `DeleteSupplierCommand.cs` + `Handler.cs`; soft-delete; transaction count stub |
| `accounting_api/src/Application/Features/Suppliers/Commands/ToggleSupplierActive/` | 2 | `ToggleSupplierActiveCommand.cs` + `Handler.cs` |
| `accounting_api/src/Application/Features/Suppliers/Commands/CloneSupplier/` | 2 | `CloneSupplierCommand.cs` + `Handler.cs`; auto-code loop; `IsActive = true` |
| `accounting_api/src/Application/Features/Suppliers/Commands/BulkUpdateSupplierAddress/` | 3 | `BulkUpdateSupplierAddressCommand.cs` + `Handler.cs` + `Validator.cs`; `ITransactionalRequest` |
| `accounting_api/src/Api/Endpoints/SupplierEndpoints.cs` | 1 | 9 routes; static routes (`/export`, `/bulk-update-address`) registered before `/{id:guid}` |

### Updated files (5)

| Path | Change |
|---|---|
| `accounting_api/src/Shared/Constants/Permissions.cs` | Add 8 supplier constants (`supplier.view/create/update/delete/export/updateAddress/createPurchaseVoucher`) + update `All` list |
| `accounting_api/src/Application/Common/Interfaces/IApplicationDbContext.cs` | Add `DbSet<Supplier> Suppliers { get; }` |
| `accounting_api/src/Infrastructure/Persistence/AppDbContext.cs` | Add `public DbSet<Supplier> Suppliers => Set<Supplier>();` |
| `accounting_api/Directory.Packages.props` | Add `<PackageVersion Include="ClosedXML" Version="0.104.2" />` |
| `accounting_api/src/Infrastructure/AccountingApi.Infrastructure.csproj` | Add `<PackageReference Include="ClosedXML" />` |

## 5. Implementation Steps

Order is critical — later steps depend on earlier ones:

1. Add ClosedXML to `Directory.Packages.props` and `Infrastructure.csproj`
2. Create `Supplier.cs` domain entity + `SupplierErrors.cs`
3. Create `PageResult<T>` in `accounting_api/src/Shared/Pagination/`
4. Update `Permissions.cs` — 8 new constants + `All` list
5. Create `SupplierConfiguration.cs` (EF config; table + indexes)
6. Update `IApplicationDbContext` and `AppDbContext` — add `DbSet<Supplier>`
7. Create `SupplierListItemDto.cs` and `SupplierDetailDto.cs`
8. Create queries: `GetSuppliersQuery`, `GetSupplierByIdQuery`, `ExportSuppliersQuery`
9. Create commands: `CreateSupplier`, `UpdateSupplier`, `DeleteSupplier`, `ToggleSupplierActive`, `CloneSupplier`, `BulkUpdateSupplierAddress`
10. Create `SupplierEndpoints.cs`
11. Run migration (see §10)
12. Build: `dotnet build accounting_api/AccountingApi.sln`

## 6. Request Flow

```
HTTP Request
  → TenantResolutionMiddleware (reads X-Tenant-Id header → sets ICurrentTenantAccessor)
  → RequireAuthorization (permission policy check → 403 if denied)
  → SupplierEndpoints handler method → ISender.Send(query/command)
    → ValidationBehavior (FluentValidation; returns 400 on failure)
    → LoggingBehavior
    → [TransactionBehavior — only for ITransactionalRequest]
    → PerformanceBehavior
    → Handler (IApplicationDbContext, async/await, CancellationToken)
  → Result<T>
  → .ToHttp([statusCode]) → IResult → HTTP response
```

Tenant isolation: `TenantInterceptor.SaveChanges` stamps `TenantId` on insert; `AppDbContext.ApplyTenantAndSoftDelete<Supplier>` filters all reads automatically. **Handlers never pass `tenantId` manually.**

## 7. Query Strategy

| Handler | Approach | Key Detail |
|---|---|---|
| `GetSuppliersQueryHandler` | EF + `AsNoTracking` | `ILike` search on `code/name/taxCode/phone/email/address`; default sort: `updatedAtUtc DESC NULLS LAST, createdAtUtc DESC` |
| `GetSupplierByIdQueryHandler` | `FirstOrDefaultAsync` | Returns `SupplierErrors.NotFound` if null |
| `ExportSuppliersQueryHandler` | EF + `AsNoTracking` + ClosedXML | Same filter params as list; server-side max 5000 rows; stream `.xlsx` response |
| `BulkUpdateSupplierAddressCommandHandler` | `ExecuteUpdateAsync` | Scoped to current tenant's filtered DbSet; cross-tenant IDs silently ignored |
| `CloneSupplierCommandHandler` | Loop + query | Check `code LIKE '{code}-COPY%'` until unique (max 99 iterations) |

**SortBy mapping (GetSuppliersQueryHandler):**

| `sortBy` value | EF expression |
|---|---|
| `code` | `e.Code` |
| `name` | `e.Name` |
| `currentDebtAmount` | `e.CurrentDebtAmount` |
| `updatedAt` | `e.UpdatedAtUtc` |
| `createdAt` | `e.CreatedAtUtc` |
| null / default | `UpdatedAtUtc DESC NULLS LAST, CreatedAtUtc DESC` |

## 8. Error Handling Strategy

| Scenario | Error | HTTP |
|---|---|---|
| Supplier not found | `SupplierErrors.NotFound` | 404 |
| Duplicate code | `SupplierErrors.DuplicateCode` | 409 |
| Has transactions (stub: count=0, never fires in Phase 7) | `SupplierErrors.HasTransactions` + extra `transactionCount` field | 409 |
| Validation failure | FluentValidation pipeline | 400 |
| No permission | `.RequireAuthorization(permission)` | 403 |

⚠️ **P6-M1:** The 409 delete response needs `transactionCount` field in the JSON body. The current `Error` record has no extension fields. Recommendation for Phase 7: create `SupplierHasTransactionsError : Error` with `TransactionCount` property, or use a typed `Result<DeleteBlockedDto>` return path. Resolve during Phase 7 coding — does not block Phase 6 plan.

## 9. Security Strategy

- All 9 endpoints use `.RequireAuthorization(Permissions.Supplier*)` — no magic strings
- Tenant isolation: automatic via `AppDbContext` global query filter — no explicit WHERE clause needed
- Bulk address: `ExecuteUpdateAsync` scoped to current tenant's filtered `DbSet<Supplier>` — cross-tenant IDs silently excluded
- Export: EF parameterized queries only — no SQL interpolation
- Soft-delete: `IsDeleted = true` + `DeletedAtUtc` stamped by `AuditableEntityInterceptor`

## 10. Migration Plan

Check if `accounting_api/src/Infrastructure/Persistence/Migrations/` has migrations:

**No migrations yet (first-time dev setup):**
```powershell
cd accounting_api
./scripts/migrate.ps1 -Command add -Name InitialCreate
./scripts/migrate.ps1 -Command update
```
This migration will include all entities (Tenant, User, etc.) + Supplier.

**Migrations already exist (Supplier is new):**
```powershell
cd accounting_api
./scripts/migrate.ps1 -Command add -Name AddSupplierEntity
./scripts/migrate.ps1 -Command update
```

Verify migration SQL includes:
- `CREATE TABLE suppliers (...)` — 20 columns
- `CREATE UNIQUE INDEX ... ON suppliers (tenant_id, code) WHERE NOT is_deleted`
- `CREATE INDEX ... ON suppliers (tenant_id, is_deleted, is_active)`

## 11. Risk & Mitigation

| Risk | Mitigation |
|---|---|
| `Error` record no extra fields for 409+transactionCount | Create `SupplierHasTransactionsError : Error` in Phase 7 (P6-M1) |
| ClosedXML .NET 9 compatibility | 0.104.x confirmed .NET 6-9 target; verify build in Phase 7 |
| `{id:guid}` constraint not recognized | Static route ordering as fallback — P4-A1 (verify Phase 7) |
| Export memory for 5000 rows | Streaming + ClosedXML in-memory ~5–15MB acceptable |
| Clone code collision under concurrent load | Acceptable for Phase 7; unique DB index provides final safety net |

## 12. Checklist Before Coding

- [x] Phase 3 Backend Basic Design — Approved
- [x] Phase 4 API Contract — Approved
- [x] No open blocking issues in `issues.md` (Open Blocking = 0)
- [ ] ClosedXML version confirmed on nuget.org (0.104.2 or latest stable)
- [ ] User confirmation required → say `confirm backend coding`

## 13. Unclear / Incomplete Items

### 1. Missing Information

| ID | Info | Impact | Required Before Phase 7? |
|---|---|---|---|
| P6-M1 | `Error` record has no extension fields; DELETE 409 needs `transactionCount` in response body | Custom error subclass or typed result needed in Phase 7 | No — resolve during Phase 7 coding |

### 4. Assumptions

| ID | Assumption | Risk |
|---|---|---|
| P4-A1 | `{id:guid}` route constraint supported by existing Minimal API / ASP.NET routing | Low — verify Phase 7; fallback is static route ordering |
| P6-A1 | ClosedXML 0.104.x targets .NET 9 (TFM netstandard2.0 compatible) | Low |
| P6-A2 | `ExecuteUpdateAsync` available in EF Core 9 + Npgsql (confirmed EF Core 7+) | None |

## 14. Definition of Done

- [x] 29 new files listed across 16 folder paths with accurate namespace
- [x] 5 updated files listed with exact changes
- [x] Implementation steps ordered by dependency
- [x] Request + tenant isolation flow documented
- [x] Query strategy: sort mapping, search, clone uniqueness, bulk update
- [x] Error handling: all 5 scenarios + 409+transactionCount note
- [x] Migration plan for both scenarios (first-time vs incremental)
- [x] Security strategy documented
- [x] Risk register (5 items)
- [x] Checklist before coding
- [x] `issues.md` updated (P6-M1 added)
- [x] `workflow-status.md` updated
