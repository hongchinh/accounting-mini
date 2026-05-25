# Backend Basic Design: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

## 1. Feature Config Summary

| Field | Value |
|---|---|
| Feature | danh-muc-nha-cung-cap |
| Backend project | `accounting_api` |
| Entity | `Supplier` (exists in `Domain/Entities/Supplier.cs`) |
| Existing feature | `Application/Features/Suppliers/` — partially implemented |
| Permissions prefix | `supplier.*` |
| Delete semantics | Soft delete (config + PDR) |

## 2. Backend Input Analysis

| Source | Status | Key Findings |
|---|---|---|
| `01-frontend-basic-design.md` | Read | Confirmed scope: CRUD + Export. Deferred: import, merge, clone, update-address. |
| `02-frontend-ui-pixel-analysis.md` | Read | Type selector (Cá nhân/Tổ chức), group field, IsCustomer flag, CCCD field visible in forms. |
| `Domain/Entities/Supplier.cs` | Read | Basic entity exists — missing Type, Group, IsCustomer, IdNumber fields. |
| `Application/Features/Suppliers/` | Read | CRUD + Export + Clone + BulkUpdateAddress already implemented. Bulk-delete and summary missing. |
| `Api/Endpoints/SupplierEndpoints.cs` | Read | 9 endpoints already wired. |
| `project-pdr/supplier-management.md` | Read | PDR aligns with existing implementation; GroupId not yet modeled. |

## 3. Source Review

**Existing implementation (already working):**
- `GET /api/v1/suppliers` — paged list with search/filter/sort
- `GET /api/v1/suppliers/{id}` — detail
- `GET /api/v1/suppliers/export` — Excel export
- `POST /api/v1/suppliers` — create
- `PUT /api/v1/suppliers/{id}` — update
- `DELETE /api/v1/suppliers/{id}` — soft delete with transaction guard
- `PATCH /api/v1/suppliers/{id}/toggle-active` — status toggle
- `POST /api/v1/suppliers/{id}/clone` — clone (deferred MVP but already live)
- `PUT /api/v1/suppliers/bulk-update-address` — address update (deferred MVP but already live)

**Missing vs confirmed scope:**
- `GET /api/v1/suppliers/summary` — needed for summary cards
- `POST /api/v1/suppliers/bulk-delete` — needed for bulk delete action

**Entity gaps vs screenshots:**
- `SupplierType` (enum: Organization/Individual) — visible in form's type selector
- `GroupId` (foreign key to future `SupplierGroup`) — visible in form's group dropdown
- `GroupName` (denormalized string until SupplierGroup entity exists)
- `IsCustomer` (bool) — `Là khách hàng` checkbox in form
- `IdNumber` (string?) — CCCD field for Individual type
- `IsInternalObject` (bool) — `Là đối tượng nội bộ` in organization form

## 4. Business Capability Extraction

| Capability | Source | Backend Required? | Notes |
|---|---|---|---|
| Paged list + search + filter + sort | UI + docs | Yes | Implemented |
| Summary cards (debt totals) | UI (list page) | Yes | Missing endpoint |
| Create supplier (Org/Individual) | UI + docs | Yes | Partially — no type field |
| Update supplier | UI + docs | Yes | Implemented |
| Soft delete + transaction guard | Config + docs | Yes | Implemented |
| Bulk delete | UI (toolbar) + PDR | Yes | Missing |
| Toggle active | UI + docs | Yes | Implemented |
| Export Excel | UI + config | Yes | Implemented |
| SupplierType (Org/Individual) | UI form | Yes | Entity field missing |
| SupplierGroup | UI form | Yes | Entity + table missing |
| IsCustomer sync | UI form + docs | Yes | Entity field missing |
| IdNumber (CCCD) | UI form | Yes | Entity field missing |
| IsInternalObject | UI form | Yes | Entity field missing |
| Clone supplier | UI + backend | Later | Deferred MVP; keep existing impl |
| Bulk update address | UI + backend | Later | Deferred MVP; keep existing impl |
| Import Excel | UI | No | Deferred |
| Merge suppliers | Docs | No | Deferred |
| Transaction ledger | UI | No | Not in confirmed scope |

## 5. Backend Feature Comparison

| Capability | Current UI | Reference Markdown | Backend Impact | Decision |
|---|---|---|---|---|
| Summary cards | Yes | No | API Required | Implement |
| Supplier type (Org/Individual) | Yes | Yes | Database Required | Implement |
| Supplier group | Yes | Yes | Database Required | Implement |
| IsCustomer flag | Yes | Yes | Database Required | Implement |
| IdNumber (CCCD) | Yes | Yes | Database Required | Implement |
| IsInternalObject | Yes | Yes | Database Required | Implement |
| Bulk delete | Yes | Yes | API Required | Implement |
| Export with filters | Yes | No | Export Required | Implement (already done) |
| Clone | Yes (row menu) | No | API Required | Defer (keep existing) |
| Update address | Yes | No | API Required | Defer (keep existing) |

## 6. Backend Gap Analysis

### 6.1 Missing Backend Capabilities
1. `GET /api/v1/suppliers/summary` — returns aggregate totals for summary cards
2. `POST /api/v1/suppliers/bulk-delete` — deletes multiple suppliers with transaction guard per ID
3. `SupplierType` enum + entity field — required for form differentiation
4. `GroupName` / `GroupId` entity field — required for group filter and display
5. `IsCustomer`, `IdNumber`, `IsInternalObject` entity fields — required for create/update form

### 6.2 Extra Backend Capabilities (already implemented, MVP-deferred)
- Clone: `/api/v1/suppliers/{id}/clone` — keep gated by `supplier.create` permission
- BulkUpdateAddress: `/api/v1/suppliers/bulk-update-address` — keep gated by `supplier.updateAddress`

### 6.3 Conflicting Requirements
- Code max length: PDR says 50 chars, CreateSupplierValidator says 32 chars. → Use 50 (PDR is authoritative).
- Name max length: PDR says 200 chars, validator says 255. → Use 255 (more lenient; no business reason to restrict).

### 6.4 Backend Open Questions

| # | Question | Impact | Must Resolve Before Phase 4? |
|---|---|---|---|
| B3-Q1 | SupplierGroup: dedicated entity with own CRUD, or simple string tag? | Database design | Yes |
| B3-Q2 | Summary card values: what aggregates exactly? (total debt, credit balance, paid-30-days?) | API response shape | Yes |
| B3-Q3 | BulkDelete: return partial-success (skip suppliers with transactions) or fail-all? | API contract | Yes |
| B3-Q4 | Code max length: PDR says 50, validator says 32 — which wins? | Validation | No |

## 7. Confirmed Backend Scope

| Capability | Status |
|---|---|
| Paged list + search/filter/sort | Keep as-is |
| Summary cards endpoint | Add |
| Create supplier (with Type, Group, IsCustomer, IdNumber, IsInternalObject) | Extend entity + command |
| Update supplier (same fields) | Extend entity + command |
| Delete with transaction guard | Keep as-is |
| Bulk delete | Add |
| Toggle active | Keep as-is |
| Export Excel | Keep as-is |
| Clone | Keep existing (gated, MVP-deferred) |
| Bulk update address | Keep existing (gated, MVP-deferred) |

## 8. Domain Design

```
Supplier : TenantAuditableEntity (existing + additions)
  + SupplierType  : SupplierType   (enum: Organization=1, Individual=2)
  + GroupName     : string?        (denormalized until SupplierGroup exists)
  + IdNumber      : string?        (CCCD for Individual)
  + IsCustomer    : bool           (syncs to Customer catalog when true)
  + IsInternalObject : bool
```

`TenantAuditableEntity` already provides: `Id`, `TenantId`, `CreatedAtUtc`, `UpdatedAtUtc`, `IsDeleted`.

**SupplierType enum** (new file in `Domain/Enums/`):
```
SupplierType { Organization = 1, Individual = 2 }
```

**SupplierErrors** (extend `Domain/Errors/SupplierErrors.cs`):
- `HasTransactions` — already exists as `SupplierHasTransactionsError`
- `NotFound` — already exists
- `DuplicateCode` — already exists

## 9. Database Design

**Table: `suppliers`** (existing, extend with migrations)

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | uuid | No | PK |
| `tenant_id` | uuid | No | FK, part of composite index |
| `code` | varchar(50) | No | Unique per tenant |
| `name` | varchar(255) | No | — |
| `supplier_type` | int | No | 1=Org, 2=Individual; default 1 |
| `group_name` | varchar(100) | Yes | Denormalized for now |
| `tax_code` | varchar(32) | Yes | — |
| `id_number` | varchar(32) | Yes | CCCD (Individual only) |
| `email` | varchar(255) | Yes | — |
| `phone` | varchar(32) | Yes | — |
| `address` | varchar(500) | Yes | — |
| `bank_account` | varchar(50) | Yes | — |
| `is_customer` | bool | No | Default false |
| `is_internal_object` | bool | No | Default false |
| `is_active` | bool | No | Default true |
| `current_debt_amount` | numeric(18,4) | Yes | Maintained externally |
| `is_deleted` | bool | No | Soft delete |
| `created_at_utc` | timestamptz | No | — |
| `updated_at_utc` | timestamptz | Yes | — |
| `created_by` | uuid | Yes | — |
| `updated_by` | uuid | Yes | — |

**Indexes:** `(tenant_id, code)` UNIQUE WHERE NOT deleted, `(tenant_id, is_active)`, `(tenant_id, is_deleted)` (via global filter).

## 10. Backend API Draft

| Method | Path | Permission | Status | Notes |
|---|---|---|---|---|
| GET | `/api/v1/suppliers` | `supplier.view` | Exists | Add `groupName` to filter params |
| GET | `/api/v1/suppliers/summary` | `supplier.view` | **New** | Returns summary card data |
| GET | `/api/v1/suppliers/{id}` | `supplier.view` | Exists | Extend response DTO |
| GET | `/api/v1/suppliers/export` | `supplier.export` | Exists | — |
| POST | `/api/v1/suppliers` | `supplier.create` | Extend | Add new fields |
| PUT | `/api/v1/suppliers/{id}` | `supplier.update` | Extend | Add new fields |
| DELETE | `/api/v1/suppliers/{id}` | `supplier.delete` | Exists | — |
| POST | `/api/v1/suppliers/bulk-delete` | `supplier.bulkDelete` | **New** | Partial-success TBD (B3-Q3) |
| PATCH | `/api/v1/suppliers/{id}/toggle-active` | `supplier.update` | Exists | — |
| POST | `/api/v1/suppliers/{id}/clone` | `supplier.create` | Exists (deferred) | — |
| PUT | `/api/v1/suppliers/bulk-update-address` | `supplier.updateAddress` | Exists (deferred) | — |

## 11. DTO Design

**SupplierListItemDto** (extend):
```
+ SupplierType, GroupName, IsCustomer, IsActive (already exists)
```

**SupplierDetailDto** (extend):
```
+ SupplierType, GroupName, IdNumber, IsCustomer, IsInternalObject
```

**CreateSupplierCommand** / **UpdateSupplierCommand** (extend):
```
+ SupplierType (required), GroupName?, IdNumber?, IsCustomer, IsInternalObject
```

**SupplierSummaryDto** (new):
```
TotalDebtAmount     : decimal   // sum of positive CurrentDebtAmount per tenant
TotalCreditAmount   : decimal   // sum of negative CurrentDebtAmount (absolute)
ActiveCount         : int
InactiveCount       : int
CalculatedAt        : DateTime
```

**BulkDeleteCommand** (new):
```
Ids : List<Guid>
```
**BulkDeleteResult**: `204 No Content` on success. `409 Conflict` with error detail if **any** ID has transactions — no deletions performed.

## 12. Validation Rules

| Field | Rule | Change from existing |
|---|---|---|
| Code | Required, max 50, unique per tenant | Max changed from 32 → 50 |
| Name | Required, max 255 | Unchanged |
| SupplierType | Required, valid enum value | New |
| IdNumber | Max 32 | New (optional, Individual type recommended) |
| GroupName | Max 100 | New |
| TaxCode | Max 32 | Unchanged |
| Email | Max 255, valid format if present | Unchanged |
| Phone | Max 32 | Unchanged |
| Address | Max 500 | Unchanged |
| BankAccount | Max 50 | Unchanged |
| BulkDelete.Ids | Not empty, max 100 IDs | New |

## 13. Business Rules

| Rule | Implementation |
|---|---|
| Supplier code unique per tenant | EF unique constraint on `(tenant_id, code)` WHERE NOT deleted |
| Soft delete | `ISoftDelete` + global query filter in `AppDbContext` |
| No delete with active transactions | Handler checks transaction count before delete |
| Bulk delete — fail-all transaction guard | If any ID has transactions → 409, no deletions performed |
| IsCustomer sync | When `IsCustomer=true` → fire domain event `SupplierMarkedAsCustomer` (Phase 7 detail) |
| Inactive supplier filtering | `IsActive` filter in list query (already implemented) |
| Negative debt display | Backend returns raw value; frontend applies formatting |

## 14. Multi-tenant Rules

- All queries filtered by `TenantId` via EF global query filter (existing).
- Supplier code uniqueness is per-tenant.
- `BulkDelete` and `Summary` endpoints inherit tenant context via `ICurrentTenantAccessor`.
- No cross-tenant lookups.

## 15. Authentication & Authorization

| Endpoint | Permission constant |
|---|---|
| All GET | `Permissions.SupplierView` |
| POST create | `Permissions.SupplierCreate` |
| PUT update | `Permissions.SupplierUpdate` |
| DELETE / bulk-delete | `Permissions.SupplierDelete` / `Permissions.SupplierBulkDelete` |
| toggle-active | `Permissions.SupplierUpdate` |
| export | `Permissions.SupplierExport` |
| bulk-update-address | `Permissions.SupplierUpdateAddress` |

Add to `Permissions.cs`: `SupplierBulkDelete = "supplier.bulkDelete"` (may already exist — verify).

## 16. Error Handling

| Scenario | HTTP | Error Code |
|---|---|---|
| Supplier not found | 404 | `supplier.not_found` |
| Duplicate code | 409 | `supplier.duplicate_code` |
| Has transactions (single delete) | 409 | `supplier.has_transactions` |
| Validation failure | 400 | `validation_error` |
| Bulk delete — any has transactions | 409 | `supplier.bulk_has_transactions` |

## 17. Logging

Existing `LoggingBehavior` in MediatR pipeline logs all commands. No additional logging needed.

## 18. Performance Considerations

- Summary query: single SQL `GROUP BY tenant_id` or aggregate over indexed `current_debt_amount` column.
- Bulk delete: max 100 IDs per request; use `WHERE id = ANY(@ids)` in a single query.
- List query already uses `AsNoTracking` and server-side pagination.

## 19. Security Considerations

- All endpoints require `RequireAuthorization()` — no anonymous access.
- Tenant isolation enforced at DB query filter level + interceptor.
- `BulkDelete` validates each ID belongs to current tenant before deleting.

## 20. Backend Decision Log

| # | Decision | Reason |
|---|---|---|
| 1 | Extend existing entity (not replace) | Core CRUD already live; avoid breaking migration |
| 2 | Denormalize `GroupName` as string | No SupplierGroup entity exists; avoids blocking scope |
| 3 | Keep Clone + BulkUpdateAddress as gated endpoints | Already implemented; remove only if explicitly requested |
| 4 | Fail-all for bulk-delete | User confirmed: 409 if any ID has transactions, no partial deletions |
| 5 | Use 50 char max for Code | PDR is authoritative over existing validator |

## 21. Acceptance Criteria

- [ ] `supplier.view` user can list, search, filter, sort, paginate, and get summary.
- [ ] `supplier.create` user can create supplier with all new fields.
- [ ] `supplier.update` user can update all fields including new ones.
- [ ] `supplier.delete` user can delete; blocked with 409 if has transactions.
- [ ] `supplier.bulkDelete` user can bulk-delete; suppliers with transactions are skipped.
- [ ] `supplier.export` user can export current filtered list.
- [ ] Tenant isolation: no cross-tenant data leakage.
- [ ] Soft-deleted suppliers do not appear in any list/detail response.

## 22. Unclear / Incomplete Items

| ID | Item | Blocking? | Must Resolve Before Phase 4? |
|---|---|---|---|
| B3-Q4 | Code max length 50 vs 32 conflict | No | No |

## 23. Definition of Done

- [x] Existing implementation documented and assessed
- [x] Entity gaps identified against UI screenshots
- [x] Missing endpoints identified (summary, bulk-delete)
- [x] DTO extensions designed
- [x] Validation rules updated
- [x] Business rules documented
- [x] Open questions logged with blocking status
- [x] No source code created or modified
