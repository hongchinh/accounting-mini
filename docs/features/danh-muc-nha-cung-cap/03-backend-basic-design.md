# Backend Basic Design: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

## Approval Status
Status: Approved
Approved At: 2026-05-08

---

## 1. Feature Config Summary
- entity: `Supplier` | backend: `accounting_api` | soft_delete: `true` | audit_fields: `true`
- tenant_strategy: `jwt_claim_or_header` | api_base_path: `/api/v1`
- business_rules: `supplier-code-unique-per-tenant`, `soft-delete`, `cannot-delete-with-transactions`, `tenant-isolation`, `negative-debt-display`

## 2. Backend Input Analysis

| Input | Status | Key Findings |
|---|---|---|
| config.yaml | Found | 9 capabilities; soft_delete + audit_fields confirmed |
| 01-frontend-basic-design.md | Found | 9 API endpoints; 13 confirmed scope items; bankAccount form-only |
| 02-frontend-ui-pixel-analysis.md | Found | No new backend data; confirms DTO fields for grid columns |
| Existing `PaginatedList<T>` | Conflict | `.TotalCount` serializes as `totalCount` — frontend expects `total` → P3-C1 |
| Existing `PaginationRequest` | Conflict | `.SortDescending: bool` — frontend uses `sortDir: 'asc'\|'desc'` → P3-C2 |
| `PaginationRequest.MaxPageSize` | Conflict | Hard-coded 200 — config `max_page_size: 500` → P3-C3 |

## 3. Source Review
Three structural conflicts between existing backend code and Phase 1 contract — all resolved via design decisions (see Section 20).

## 4. Business Capability Extraction

| Capability | Source | Backend Required? | Notes |
|---|---|---|---|
| List + search + pagination | Phase 1 | Yes | `GetSuppliersQuery` |
| Filter by isActive | Phase 1 | Yes | `?isActive=true/false`; null = all |
| Sort (code/name/debt/dates) | config | Yes | `sortBy` + `sortDir` string params |
| Create supplier | Phase 1 | Yes | code unique-per-tenant |
| Update supplier | Phase 1 | Yes | |
| Soft delete | Phase 1 | Yes | block if has transactions |
| Toggle active/inactive | Phase 1 | Yes | `PATCH /toggle-active` |
| Clone supplier | Phase 1 (BA) | Yes | auto-generate code |
| Export to Excel (.xlsx) | Phase 1 | Yes | same filters as list |
| Bulk update address | Phase 1 | Yes | `PUT /bulk-update-address` |
| "Lập CT mua hàng" textlink | Phase 1 | No | frontend navigation only |
| Metric cards / summary | Phase 1 (deferred) | No | |
| Bulk delete | Phase 1 (deferred) | No | |

## 5. Backend Feature Comparison

| Capability | Frontend Scope | Backend Scope | Alignment Status | Required Action |
|---|---|---|---|---|
| List + pagination + search | Confirmed | Design here | Aligned | Approve |
| isActive filter dropdown | Confirmed | `?isActive` param | Aligned | Approve |
| CRUD + toggle + clone | Confirmed | Design here | Aligned | Approve |
| Delete + Xem phát sinh (409 + transactionCount) | Confirmed | 409 + `{ transactionCount }` | Aligned | Approve |
| Export xlsx | Confirmed | Design here | Aligned | Approve |
| Bulk address update | Confirmed | Design here | Aligned | Approve |
| `currentDebtAmount` in response | Confirmed (P1-A1) | Stored field (nullable) | Need Confirmation | P3-Q1 |
| Response shape `total` vs `totalCount` | `total` | `TotalCount` | Conflict | P3-C1 — API wrapper DTO |
| `sortDir` string vs `SortDescending` bool | `sortDir` | `SortDescending` | Conflict | P3-C2 — convert in query |

## 6. Backend Gap Analysis

### 6.1 Missing Backend Capabilities
- `PageResult<T>` wrapper DTO at API layer (resolves P3-C1)
- Export package not in `Directory.Packages.props` (P3-M1 — **must resolve before Phase 6**)

### 6.3 Conflicting Backend Requirements
- P3-C1: `PaginatedList.TotalCount` → `total` → API layer wrapper
- P3-C2: `SortDescending: bool` → `sortDir: string` → convert in query model
- P3-C3: `MaxPageSize 200` → override to 500 in `GetSuppliersQuery`

### 6.4 Backend Open Questions

| # | Question | Impact If Not Clarified | Recommended Default | Must Resolve Before Phase 4? |
|---|----------|------------------------|---------------------|-------------------------------|
| P3-Q1 | `currentDebtAmount`: stored field vs computed JOIN? | API field may always be null | Stored nullable field | No |
| P3-Q2 | Export package: EPPlus vs ClosedXML? | Phase 6 implementation blocked | ClosedXML (MIT license) | No (Phase 6) |
| P3-Q3 | Delete 409 body: `{ message, transactionCount }` confirm? | API contract ambiguous | Yes — confirm format | Yes |

## 7. Confirmed Backend Scope

**Implement:** Supplier entity + EF config + migration + 9 MediatR handlers + 9 Minimal API endpoints + permissions + `PageResult<T>` wrapper DTO

**Not implementing:** metric summary endpoint, bulk delete, "Lập CT mua hàng" backend logic

## 8. Domain Design

```csharp
namespace AccountingApi.Domain.Entities;

public sealed class Supplier : TenantAuditableEntity, IAggregateRoot
{
    public string Code { get; private set; } = string.Empty;     // max 32
    public string Name { get; private set; } = string.Empty;     // max 255
    public string? TaxCode { get; private set; }                 // max 32
    public string? Email { get; private set; }                   // max 255
    public string? Phone { get; private set; }                   // max 32
    public string? Address { get; private set; }                 // max 500
    public string? BankAccount { get; private set; }             // max 50
    public bool IsActive { get; private set; } = true;
    public decimal? CurrentDebtAmount { get; private set; }      // null = no accounting data yet

    public static Supplier Create(Guid tenantId, string code, string name, ...) → Supplier
    public void Update(string name, ...) → void
    public void UpdateAddress(string address) → void
    public void ToggleActive() → void
    public void UpdateCurrentDebt(decimal amount) → void         // called by accounting module
}
```

```csharp
namespace AccountingApi.Domain.Errors;

public static class SupplierErrors
{
    public static readonly Error NotFound =
        Error.NotFound("supplier.not_found", "Supplier not found.");
    public static readonly Error DuplicateCode =
        Error.Conflict("supplier.duplicate_code", "Supplier code already exists.");
    public static readonly Error HasTransactions =
        Error.Conflict("supplier.has_transactions", "Cannot delete supplier with existing transactions.");
}
```

## 9. Database Design

Table: `suppliers`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| tenant_id | uuid | NOT NULL | FK tenants.id; ITenantEntity |
| code | varchar(32) | NOT NULL | unique per tenant (see index) |
| name | varchar(255) | NOT NULL | |
| tax_code | varchar(32) | NULL | |
| email | varchar(255) | NULL | |
| phone | varchar(32) | NULL | |
| address | varchar(500) | NULL | |
| bank_account | varchar(50) | NULL | |
| is_active | bool | NOT NULL DEFAULT true | |
| current_debt_amount | numeric(18,4) | NULL | denormalized; updated by accounting module |
| is_deleted | bool | NOT NULL DEFAULT false | from ISoftDelete |
| deleted_at_utc | timestamptz | NULL | |
| deleted_by | uuid | NULL | |
| created_at_utc | timestamptz | NOT NULL | from AuditableEntity |
| created_by | uuid | NULL | |
| updated_at_utc | timestamptz | NULL | |
| updated_by | uuid | NULL | |
| xmin | xid | — | Postgres concurrency token |

Index: `UNIQUE (tenant_id, code) WHERE NOT is_deleted`

EF query filter: combined tenant + soft-delete in `AppDbContext.OnModelCreating` via reflection (project convention — **do not add a second `HasQueryFilter`**).

## 10. Backend API Draft

| Method | Route | Permission | Response | Handler |
|---|---|---|---|---|
| GET | /api/v1/suppliers | SupplierView | 200 PageResult\<SupplierListItemDto\> | GetSuppliersQueryHandler — default sort: UpdatedAt DESC, CreatedAt DESC |
| GET | /api/v1/suppliers/{id} | SupplierView | 200 SupplierDetailDto / 404 | GetSupplierByIdQueryHandler |
| POST | /api/v1/suppliers | SupplierCreate | 201 SupplierDetailDto / 409 | CreateSupplierCommandHandler |
| PUT | /api/v1/suppliers/{id} | SupplierUpdate | 200 SupplierDetailDto / 404 / 409 | UpdateSupplierCommandHandler |
| DELETE | /api/v1/suppliers/{id} | SupplierDelete | 204 / 404 / 409+transactionCount | DeleteSupplierCommandHandler |
| PATCH | /api/v1/suppliers/{id}/toggle-active | SupplierUpdate | 200 SupplierDetailDto / 404 | ToggleSupplierActiveCommandHandler |
| POST | /api/v1/suppliers/{id}/clone | SupplierCreate | 201 SupplierDetailDto / 404 | CloneSupplierCommandHandler |
| PUT | /api/v1/suppliers/bulk-update-address | SupplierUpdateAddress | 200 { updatedCount } / 404 | BulkUpdateSupplierAddressCommandHandler |
| GET | /api/v1/suppliers/export | SupplierExport | 200 .xlsx stream | ExportSuppliersQueryHandler — params: search, isActive, sortBy, sortDir; max 5000 rows |

## 11. DTO Design

```csharp
// List item — returned by GET /suppliers
record SupplierListItemDto(Guid Id, string Code, string Name, string? TaxCode,
    string? Phone, string? Address, bool IsActive, decimal? CurrentDebtAmount,
    DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);

// Detail — returned by GET/{id}, POST, PUT, clone
record SupplierDetailDto(Guid Id, string Code, string Name, string? TaxCode,
    string? Email, string? Phone, string? Address, string? BankAccount,
    bool IsActive, decimal? CurrentDebtAmount,
    DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);

// Pagination wrapper at API layer — resolves P3-C1
record PageResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize);

// Request bodies
record CreateSupplierRequest(string Code, string Name, string? TaxCode,
    string? Email, string? Phone, string? Address, string? BankAccount);
record UpdateSupplierRequest(string Name, string? TaxCode,
    string? Email, string? Phone, string? Address, string? BankAccount);
record BulkUpdateAddressRequest(List<Guid> Ids, string Address);
```

## 12. Validation Rules

| Field | Rule | Error |
|---|---|---|
| Code | Required, MaxLength(32), unique per tenant (non-deleted) | supplier.duplicate_code |
| Name | Required, MaxLength(255) | validation |
| TaxCode | Optional, MaxLength(32) | validation |
| Email | Optional, MaxLength(255), valid email | validation |
| Phone | Optional, MaxLength(32) | validation |
| Address | Optional, MaxLength(500) | validation |
| BankAccount | Optional, MaxLength(50) | validation |
| BulkUpdateAddress.Address | Required, NotEmpty (whitespace rejected), MaxLength(500) | validation |
| BulkUpdateAddress.Ids | Required, MinCount(1) | validation |

## 13. Business Rules

1. **supplier-code-unique-per-tenant** — check `(TenantId, Code)` among non-deleted before create/update; return `SupplierErrors.DuplicateCode`
2. **soft-delete** — `DeleteSupplierCommand` sets `IsDeleted=true`; global filter hides deleted rows
3. **cannot-delete-with-transactions** — check related transaction tables; **Phase 7 stub: always returns 0** (transaction module does not exist yet — explicit `// TODO:` required)
4. **tenant-isolation** — automatic via `ITenantEntity` global filter + `TenantInterceptor`; handler must not pass `tenantId` manually
5. **Clone auto-code** — generate `{originalCode}-COPY`, increment suffix (`-COPY2`, `-COPY3`) until unique; cloned supplier always `IsActive = true` regardless of source
6. **currentDebtAmount** — stored as `decimal?` in entity; null = no accounting data; negative values are valid (credit balance)

## 14. Multi-tenant Rules
- `TenantId` stamped on insert by `TenantInterceptor` via `ICurrentTenantAccessor`
- All queries filtered by `TenantId` via `AppDbContext` global query filter
- Bulk address update: `WHERE id = ANY(@ids) AND tenant_id = @tenantId` — filter ensures cross-tenant IDs are silently ignored (return `updatedCount` < requested)

## 15. Authentication & Authorization

```csharp
// Add to Permissions.cs + Permissions.All
public const string SupplierView               = "supplier.view";
public const string SupplierCreate             = "supplier.create";
public const string SupplierUpdate             = "supplier.update";
public const string SupplierDelete             = "supplier.delete";
public const string SupplierExport             = "supplier.export";
public const string SupplierUpdateAddress      = "supplier.updateAddress";
public const string SupplierCreatePurchaseVoucher = "supplier.createPurchaseVoucher";
```

## 16. Error Handling

| Scenario | HTTP | Error Code |
|---|---|---|
| Supplier not found | 404 | supplier.not_found |
| Duplicate code | 409 | supplier.duplicate_code |
| Has transactions | 409 | supplier.has_transactions + `transactionCount` |
| Validation failure | 400 | validation.* (FluentValidation pipeline) |
| Unauthorized / Forbidden | 401/403 | auth.* / permission.* |

Delete 409 body (P3-Q3 pending confirmation):
```json
{ "code": "supplier.has_transactions", "message": "...", "transactionCount": 3 }
```

## 17. Logging
- `LoggingBehavior` logs all commands/queries automatically
- Key log fields: `supplierId`, `supplierCode`, `tenantId`, `userId`
- `PerformanceBehavior` alerts on slow queries (existing threshold)

## 18. Performance Considerations
- Additional index: `(tenant_id, is_deleted, is_active)` for filtered list queries
- `currentDebtAmount` denormalized → no JOIN on list
- Export: stream response; custom max rows = 5000 (overrides `PaginationRequest.MaxPageSize`)
- Bulk address: single SQL `UPDATE ... WHERE id = ANY(...)` — not N individual updates

## 19. Security Considerations
- Tenant isolation: automatic via query filter — no explicit `WHERE tenantId =` needed in handlers
- Bulk address: silently skips IDs not belonging to current tenant (via filter)
- Soft-deleted code reuse: allowed — unique index is `WHERE NOT is_deleted`

## 20. Backend Decision Log

| # | Decision | Reason |
|---|---|---|
| D1 | `Supplier : TenantAuditableEntity` | Gets audit + soft-delete + tenant for free |
| D2 | `currentDebtAmount` stored nullable | No transaction module; avoids JOIN on list; updated by accounting later |
| D3 | `PageResult<T>` wrapper at API layer | Maps `TotalCount` → `Total` → serializes as `"total"` per CLAUDE.md contract |
| D4 | `GetSuppliersQuery` accepts `SortDir: string`, converts to bool internally | Frontend uses `sortDir`; `PaginationRequest` uses `SortDescending` |
| D5 | "Has transactions" check stubbed in Phase 7 | Transaction module does not exist |
| D6 | Clone code = `{code}-COPY` (increment until unique); IsActive always true | Code: simple & deterministic. IsActive=true: avoid creating inactive by accident (MISA behavior) |
| D7 | Export max rows = 5000 (not 200) | Accounting export must include full dataset |
| D8 | Export package = ClosedXML | MIT license — no commercial restrictions |
| D9 | DELETE 409 body includes `transactionCount` | Frontend shows count in error dialog per Phase 1 UX requirement |
| D10 | Default sort: `UpdatedAt DESC NULLS LAST, CreatedAt DESC` | Most recently modified first — consistent with MISA convention |
| D11 | Clone: IsActive always = true (not copied from source) | Prevent accidental inactive clone; user can toggle separately |
| D12 | BulkUpdateAddress: address must be non-empty | Bulk operation intent is to set address, not clear it; clear via Edit form |
| D13 | Export params: same as list (search, isActive, sortBy, sortDir), max 5000 rows | Export "current filter" per Phase 1 confirmation |

## 21. Acceptance Criteria
- [ ] GET /api/v1/suppliers returns `{ items, total, page, pageSize }` (not `totalCount`)
- [ ] No `sortBy` → default order: UpdatedAt DESC NULLS LAST, then CreatedAt DESC
- [ ] `?isActive=true/false` filter works; omit = all records
- [ ] `?sortBy=code|name|currentDebtAmount|updatedAt|createdAt` + `?sortDir=asc|desc`
- [ ] POST returns 409 `supplier.duplicate_code` on duplicate code within tenant
- [ ] DELETE returns 409 `{ ..., transactionCount }` when supplier has transactions
- [ ] PATCH /toggle-active flips IsActive correctly
- [ ] POST /{id}/clone creates new supplier with auto-generated unique code; `isActive = true` always
- [ ] PUT /bulk-update-address rejects empty address (400); updates address for all matching tenant IDs
- [ ] GET /export accepts same params as list; returns valid .xlsx; max 5000 rows
- [ ] All endpoints isolated by tenant; cross-tenant access returns 404

## 22. Unclear / Incomplete Items

### 1. Missing Information

| ID | Info | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
| P3-M1 | Excel export package (EPPlus / ClosedXML) not in Directory.Packages.props | Phase 6 implementation | Blocks export handler coding | No (Phase 6) |

### 3. Conflicts — Resolved

| ID | Topic | Resolution |
|---|---|---|
| P3-C1 | `TotalCount` vs `total` | `PageResult<T>` wrapper DTO at API layer — D3 |
| P3-C2 | `SortDescending: bool` vs `sortDir: string` | Accept string in query, convert internally — D4 |
| P3-C3 | `MaxPageSize 200` vs config 500 | `GetSuppliersQuery` overrides to 500; export uses 5000 — D7 |

### 4. Assumptions

| ID | Assumption | Risk | Confirm? |
|---|---|---|---|
| P3-A1 | `currentDebtAmount` stored as nullable (null until accounting module exists) | Low | No |
| P3-A2 | "Has transactions" returns 0 (stub) in Phase 7 | Medium — testers cannot verify delete block | Document in Phase 7 summary |

### 5. Questions for User Confirmation

| ID | Question | Options | Recommended | Blocking? |
|---|---|---|---|---|
| P3-Q2 | Excel export package | EPPlus (commercial+free tier) / ClosedXML (MIT) | ClosedXML | **Resolved: ClosedXML** |
| P3-Q3 | Delete 409 body include `transactionCount`? | Yes / No | Yes | **Resolved: Yes** |

## 23. Definition of Done
- [x] Backend Input Analysis completed
- [x] Business Capability Extraction (13 capabilities)
- [x] Backend Feature Comparison table
- [x] Confirmed Backend Scope defined
- [x] Domain entity designed (`Supplier : TenantAuditableEntity`)
- [x] Database schema designed (20 columns, unique index)
- [x] 9 API endpoints drafted
- [x] DTOs designed (SupplierListItemDto, SupplierDetailDto, PageResult\<T\>)
- [x] Validation rules documented
- [x] 6 business rules documented
- [x] 7 permission constants listed
- [x] Error handling documented
- [x] 3 conflicts identified and resolved
- [x] User confirms P3-Q2 (ClosedXML) and P3-Q3 (transactionCount in 409 body)
