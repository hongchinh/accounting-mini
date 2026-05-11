# Backend API Contract Review: Danh mục nhà cung cấp

## Approval Status
Status: Approved
Blocking Issues: No
User Confirmation Required: No

---

## 1. Review Summary

Reviewed Phase 1, 2, 3. All 9 frontend-required endpoints have backend coverage. 4 gaps found and resolved in this phase:
- **D1** Email removed from SupplierListItemDto (not in grid; no need in list response)
- **D3** Date field names standardized: `CreatedAt` / `UpdatedAt` (not `CreatedAtUtc`)
- **D2** Toggle-active response: full SupplierDetailDto (not `{ isActive }` only)
- **D4** Route constraint `{id:guid}` prevents ambiguity with /export and /bulk-update-address

## 2. Frontend API Needs
See `01-frontend-basic-design.md` §13 — 9 endpoints. All covered.

## 3. Backend Proposed APIs
See `03-backend-basic-design.md` §10 — 9 MediatR handlers + Minimal API endpoints.

## 4. Cross-source Feature Alignment Review

| Feature / Capability | Frontend Scope | Backend Scope | Alignment Status | Required Action |
|---|---|---|---|---|
| List + search + pagination | Confirmed | GetSuppliersQuery | Aligned | Approve |
| isActive filter | Confirmed | `?isActive` param | Aligned | Approve |
| Sort (sortBy + sortDir) | Confirmed | Convert to bool internally | Aligned | Approve |
| CRUD (create/update) | Confirmed | Commands + handlers | Aligned | Approve |
| Delete + 409 + transactionCount | Confirmed | DeleteSupplierCommand | Aligned | Approve |
| Toggle active/inactive | Confirmed | ToggleSupplierActiveCommand | Aligned | Approve |
| Clone (Nhân bản) | Confirmed | CloneSupplierCommand | Aligned | Approve |
| Export to Excel | Confirmed | ExportSuppliersQuery | Aligned | Approve |
| Bulk update address | Confirmed | BulkUpdateSupplierAddressCommand | Aligned | Approve |
| Permission-based UI | Confirmed | 7 permission constants | Aligned | Approve |
| email in SupplierListItem | Frontend type has it | Backend DTO does NOT | Conflict | Update Frontend Design (D1) |
| Date field naming | createdAt/updatedAt | CreatedAtUtc/UpdatedAtUtc | Conflict | Update Backend Design (D3) |
| Toggle-active response shape | `{ isActive: boolean }` | SupplierDetailDto | Conflict | Update Frontend contract (D2) |
| "Lập CT mua hàng" backend | Frontend-only nav | No endpoint needed | Frontend Only | Approve (D5) |

## 5. Gap Analysis

### 5.6 Response Body Mismatch
- **Toggle-active:** Phase 1 expects `{ isActive: boolean }` — Phase 3 returns `SupplierDetailDto`. **Decision D2:** response = SupplierDetailDto. Frontend reads `.isActive` from it.

### 5.7 Field Name Mismatch
- **Date fields:** `CreatedAtUtc`/`UpdatedAtUtc` → JSON `createdAtUtc`. Frontend expects `createdAt`/`updatedAt`. **D3:** Rename DTO fields to `CreatedAt`/`UpdatedAt`.
- **Email in list:** Backend SupplierListItemDto excludes Email; Phase 1 SupplierListItem includes `email`. Email is not a grid column. **D1:** Remove `email` from frontend SupplierListItem type.

### 5.13 Filtering
- Export accepts same filter params as List (`search`, `isActive`, `sortBy`, `sortDir`) but no pagination. Max 5000 rows server-side. ✓

### Routing Note (Implementation rule for Phase 7)
Register `/export` and `/bulk-update-address` static routes **before** `/{id}` routes. Use `{id:guid}` constraint on all `/{id}` route templates to prevent "export" / "bulk-update-address" from matching `{id}`.

## 6. Final API Contract

### 6.1 Standard Success Response
```json
// Single resource
{ "id": "uuid", ...fields }
// Paginated list
{ "items": [], "total": 0, "page": 1, "pageSize": 20 }
// Bulk
{ "updatedCount": 5 }
```

### 6.2 Standard Error Response
```json
{ "code": "error.code", "message": "Human-readable message" }
// Validation (400)
{ "code": "validation.failure", "message": "Validation failed", "errors": { "fieldName": ["msg"] } }
// Delete blocked (409)
{ "code": "supplier.has_transactions", "message": "...", "transactionCount": 3 }
```

### 6.3 Pagination Response
`{ "items": [SupplierListItemDto], "total": 365, "page": 1, "pageSize": 20 }` — `total` not `totalCount`; `page` 1-based.

### 6.4 Base URL Pattern
`/api/v1/suppliers` — all requests carry `X-Tenant-Id` header (auto-attached by Axios interceptor).

### 6.5 Endpoint Contracts

#### GET /api/v1/suppliers
- **Permission:** `supplier.view`
- **Query params:** `search?`, `page=1`, `pageSize=20`, `sortBy?`, `sortDir=asc|desc`, `isActive?`
- **sortBy values:** `code | name | currentDebtAmount | updatedAt | createdAt`
- **isActive:** `true` (active only) | `false` (inactive only) | omit (all)
- **Default sort:** `updatedAt DESC NULLS LAST, createdAt DESC`
- **Response 200:** `PageResult<SupplierListItemDto>`

#### GET /api/v1/suppliers/export
- **Permission:** `supplier.export`
- **Query params:** `search?`, `isActive?`, `sortBy?`, `sortDir?` (no page/pageSize; max 5000 rows)
- **Response 200:** `.xlsx` file stream
- **Headers:** `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `Content-Disposition: attachment; filename="suppliers.xlsx"`

#### GET /api/v1/suppliers/{id:guid}
- **Permission:** `supplier.view`
- **Response 200:** `SupplierDetailDto`
- **Response 404:** `{ code: "supplier.not_found", message }`

#### POST /api/v1/suppliers
- **Permission:** `supplier.create`
- **Body:** `CreateSupplierRequest`
- **Response 201:** `SupplierDetailDto`
- **Response 400:** validation errors
- **Response 409:** `{ code: "supplier.duplicate_code", message }`

#### PUT /api/v1/suppliers/{id:guid}
- **Permission:** `supplier.update`
- **Body:** `UpdateSupplierRequest` (no `code` — immutable)
- **Response 200:** `SupplierDetailDto`
- **Response 400/404/409** as above

#### DELETE /api/v1/suppliers/{id:guid}
- **Permission:** `supplier.delete`
- **Response 204:** deleted
- **Response 404:** `supplier.not_found`
- **Response 409:** `{ code: "supplier.has_transactions", message, transactionCount: number }`

#### PATCH /api/v1/suppliers/{id:guid}/toggle-active
- **Permission:** `supplier.update`
- **No body**
- **Response 200:** `SupplierDetailDto` (contains updated `isActive`)
- **Response 404:** `supplier.not_found`

#### POST /api/v1/suppliers/{id:guid}/clone
- **Permission:** `supplier.create`
- **No body**
- **Response 201:** `SupplierDetailDto` (new supplier, auto-generated code, `isActive = true`)
- **Response 404:** `supplier.not_found`

#### PUT /api/v1/suppliers/bulk-update-address
- **Permission:** `supplier.updateAddress`
- **Body:** `BulkUpdateAddressRequest`
- **Response 200:** `{ updatedCount: number }` — IDs not in tenant silently ignored
- **Response 400:** address empty or ids empty

## 7. DTO Contract

**SupplierListItemDto** (GET /suppliers list items):

| Field | TS Type | C# Type | Nullable | Notes |
|---|---|---|---|---|
| id | string | Guid | No | |
| code | string | string | No | max 32 |
| name | string | string | No | max 255 |
| taxCode | string \| null | string? | Yes | max 32 |
| phone | string \| null | string? | Yes | max 32 |
| address | string \| null | string? | Yes | max 500 |
| isActive | boolean | bool | No | |
| currentDebtAmount | number \| null | decimal? | Yes | negative allowed |
| createdAt | string | DateTime | No | ISO 8601 |
| updatedAt | string \| null | DateTime? | Yes | ISO 8601 |

**No `email` field in SupplierListItemDto** (D1).

**SupplierDetailDto** — all list fields plus:

| Field | TS Type | C# Type | Nullable |
|---|---|---|---|
| email | string \| null | string? | Yes |
| bankAccount | string \| null | string? | Yes |

**CreateSupplierRequest:** `code* (max 32)`, `name* (max 255)`, `taxCode? (max 32)`, `email? (max 255)`, `phone? (max 32)`, `address? (max 500)`, `bankAccount? (max 50)`.

**UpdateSupplierRequest:** same as Create but **without `code`** (D6 — code immutable).

**BulkUpdateAddressRequest:** `ids*: string[] (min 1 UUID)`, `address*: string (non-empty, max 500)`.

## 8. Permission Contract

| Endpoint | Permission Constant | Value |
|---|---|---|
| GET /suppliers | SupplierView | supplier.view |
| GET /suppliers/export | SupplierExport | supplier.export |
| GET /suppliers/{id} | SupplierView | supplier.view |
| POST /suppliers | SupplierCreate | supplier.create |
| PUT /suppliers/{id} | SupplierUpdate | supplier.update |
| DELETE /suppliers/{id} | SupplierDelete | supplier.delete |
| PATCH /{id}/toggle-active | SupplierUpdate | supplier.update |
| POST /{id}/clone | SupplierCreate | supplier.create |
| PUT /bulk-update-address | SupplierUpdateAddress | supplier.updateAddress |

`supplier.createPurchaseVoucher` — frontend-only permission (hides "Lập CT mua hàng" column). No backend endpoint.

## 9. Multi-tenant Contract
- `X-Tenant-Id` header on all requests (enforced by `TenantResolutionMiddleware`)
- Automatic tenant filter via `ITenantEntity` global query filter — handlers do NOT pass tenantId manually
- Bulk address: IDs from other tenants silently ignored (return `updatedCount` < requested)
- Cross-tenant `/{id}` access returns 404 (not 403)

## 10. Validation Contract
See `03-backend-basic-design.md` §12 for full rules. Key contract-level rules:
- `code` NOT updatable (not in UpdateSupplierRequest)
- `BulkUpdateAddressRequest.address`: must be non-empty string (whitespace rejected); max 500
- Clone: code auto-generated server-side (`{code}-COPY`, increment suffix until unique)
- Uniqueness check: `(tenantId, code)` among non-deleted records only

## 11. Contract Decisions

| # | Decision | Reason |
|---|---|---|
| D1 | Remove `email` from SupplierListItemDto + frontend SupplierListItem | Not a grid column; no display purpose in list |
| D2 | Toggle-active returns full SupplierDetailDto | Consistent with create/update responses; frontend reads `.isActive` |
| D3 | DTO date fields: `CreatedAt`/`UpdatedAt` (not `...Utc`) | JSON → `createdAt`/`updatedAt` — matches frontend convention |
| D4 | Route constraint `{id:guid}` on all `/{id}` routes | Prevents /export and /bulk-update-address from matching `{id}` |
| D5 | "Lập CT mua hàng" route: `/accounting/purchase-vouchers/create?supplierId={id}` | Frontend-only nav; resolves P2-U1 |
| D6 | `code` not in UpdateSupplierRequest (immutable) | Code changes cause reconciliation issues in accounting systems |

## 12. Unresolved Questions Before Contract Approval
None. P3-M1 (add ClosedXML to Directory.Packages.props) is a Phase 6/7 implementation task — no contract impact.

## 13. Required Changes

**Backend (apply during Phase 7 coding):**
1. `SupplierListItemDto`: remove `Email` field; rename `CreatedAtUtc`/`UpdatedAtUtc` → `CreatedAt`/`UpdatedAt`
2. `SupplierDetailDto`: rename `CreatedAtUtc`/`UpdatedAtUtc` → `CreatedAt`/`UpdatedAt`
3. All `/{id}` Minimal API routes: add `{id:guid}` constraint

**Frontend (apply during Phase 8 coding):**
1. `SupplierListItem` interface: remove `email` field
2. Date fields in `SupplierDetail`: confirm using `createdAt`/`updatedAt` (already correct in Phase 1)
3. Toggle-active success handler: read `.isActive` from full `SupplierDetailDto` response

## 14. Approval Checklist
- [x] All 9 frontend features have API support
- [x] Endpoint routes clear and unique (with `{id:guid}` constraints)
- [x] All request shapes defined (Create, Update, BulkUpdateAddress)
- [x] All response shapes defined (SupplierListItemDto, SupplierDetailDto, PageResult, BulkResult)
- [x] All DTO field names and types agreed (D1, D3 applied)
- [x] All permissions mapped (8 endpoints + 1 frontend-only)
- [x] Validation behavior documented (§10)
- [x] Pagination: `{ items, total, page, pageSize }` — 1-based `page`
- [x] Sorting: `sortBy` + `sortDir=asc|desc` string params
- [x] Multi-tenant: X-Tenant-Id header, automatic filter, 404 on cross-tenant
- [x] Error format: `{ code, message }` + extras for 409 cases

## 15. Unclear / Incomplete Items

### 1. Missing Information
| ID | Info | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
| P3-M1 | ClosedXML not in Directory.Packages.props | Phase 7 export handler | Blocked if missing | No (Phase 6) |

### 4. Assumptions
| ID | Assumption | Risk | Confirm? |
|---|---|---|---|
| P4-A1 | `{id:guid}` route constraint supported by existing Minimal API setup | Low | Verify Phase 7 |
| P4-A2 | "Lập CT mua hàng" nav route: `/accounting/purchase-vouchers/create?supplierId={id}` | Medium — route not yet designed | When Purchase Voucher feature is built |

## 16. Definition of Done
- [x] All 9 endpoints cross-reviewed (Phase 1 vs Phase 2 vs Phase 3)
- [x] All gaps identified and resolved (D1–D6)
- [x] Final API contract written (§6)
- [x] DTO contract finalized with field types (§7)
- [x] Permission contract finalized (§8)
- [x] Required changes listed for backend and frontend (§13)
- [x] issues.md updated (P2-U1 resolved; P4-A1, P4-A2 added)
- [x] workflow-status.md updated
