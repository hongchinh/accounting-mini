# Backend API Contract Review: Danh mục nhà cung cấp

## Approval Status
Status: Approved
Blocking Issues: No
User Confirmation Required: No

## 1. Review Summary

**Review Date:** 2026-05-26  
**Status:** Approved

| Metric | Count |
|---|---:|
| Endpoints in final contract | 9 active + 2 deferred-MVP |
| New endpoints to build | 2 (summary, bulk-delete) |
| Mismatches found and resolved | 5 param naming + 5 DTO fields + response format |
| Unresolved questions blocking coding | 0 |

---

# PART A — CROSS-SOURCE FEATURE ALIGNMENT

## A1. Scope Alignment

| Feature / Capability | Frontend Scope | Backend Scope | Ref Docs | Alignment Status | Required Action |
|---|---|---|---|---|---|
| List + search + pagination | Confirmed | Implemented | Confirmed | Aligned | Approve |
| Summary cards | Confirmed | Missing | Referenced | Missing Backend Support | Add API |
| Create (Org/Individual) | Confirmed | Exists – extend | Confirmed | Aligned | Approve |
| Update supplier | Confirmed | Exists – extend | Confirmed | Aligned | Approve |
| Delete + transaction guard | Confirmed | Implemented | Confirmed | Aligned | Approve |
| Bulk delete | Confirmed | Missing | Referenced | Missing Backend Support | Add API |
| Toggle active | Confirmed | Implemented | Confirmed | Aligned | Approve |
| Export Excel | Confirmed | Implemented | Confirmed | Aligned | Approve |
| SupplierType (Org/Individual) | Confirmed | Entity field missing | Confirmed | Missing Backend Support | Update Backend Design |
| GroupName (string) | Confirmed | Entity field missing | Confirmed | Missing Backend Support | Update Backend Design |
| IsCustomer flag | Confirmed | Entity field missing | Confirmed | Missing Backend Support | Update Backend Design |
| IdNumber (CCCD) | Confirmed | Entity field missing | Confirmed | Missing Backend Support | Update Backend Design |
| IsInternalObject | Confirmed | Entity field missing | Confirmed | Missing Backend Support | Update Backend Design |
| Clone supplier | Need Confirmation | Exists – deferred | No | Backend Only | Defer |
| Bulk update address | Need Confirmation | Exists – deferred | No | Backend Only | Defer |
| Import Excel | Deferred (P1-Q1) | Not planned | Yes | Conflict | Defer |
| Merge suppliers | Deferred (P1-Q1) | Not planned | Yes | Mentioned in Docs Only | Defer |
| Pay / purchase voucher | Need Confirmation | No endpoint | Config only | Frontend Only | Defer |

## A2. Unresolved Questions Before Contract Approval

| # | Question | Source Phase | Impact on Contract | Must Resolve Before Coding? |
|---|---|---|---|---|
| P2-Q3 | Detail: split-panel vs separate route | Phase 2 | None — no new API needed | No |
| B3-Q4 | Code max 50 vs 32 | Phase 3 | Resolved: 50 (PDR) | No |
| P1-Q4 | groupId / provinceCode / period filters | Phase 1 | Resolved: groupName string; province/period deferred | No |

All previously blocking questions (B3-Q1, B3-Q2, B3-Q3, P1-Q1, P1-Q2, P1-Q3) are resolved.

## A3. Contract Approval Gate

| Gate Condition | Status | Notes |
|---|---|---|
| No serious frontend/backend mismatch remains | Pass | All 5 naming mismatches resolved |
| All `Need Confirmation` features clearly marked | Pass | Deferred in Section 12.3 |
| Every confirmed feature has API/backend support | Pass | summary + bulk-delete added to contract |
| Every API has a permission | Pass | All 9 endpoints have permission constants |
| Every API has clear request/response definitions | Pass | Full contracts in Section 6 |
| Error format consistent | Pass | RFC 7807 ProblemDetails throughout |
| Paging/filter/sort consistent | Pass | Agreed params in Sections 4.4/4.11/4.12 |
| Multi-tenant rules consistent | Pass | Header-based; no route param |
| No open question with Must Resolve = Yes | Pass | Zero remaining |

---

# PART B — GAP ANALYSIS

## 2. Frontend API Needs

| # | UI Action | Method | Endpoint | Notes |
|---|---|---|---|---|
| 1 | Load list | GET | /api/v1/suppliers | server-paged |
| 2 | Load summary | GET | /api/v1/suppliers/summary | cards |
| 3 | Load detail | GET | /api/v1/suppliers/{id} | form/view |
| 4 | Create | POST | /api/v1/suppliers | rich payload |
| 5 | Update | PUT | /api/v1/suppliers/{id} | |
| 6 | Toggle active | PATCH | /api/v1/suppliers/{id}/toggle-active | |
| 7 | Delete | DELETE | /api/v1/suppliers/{id} | |
| 8 | Bulk delete | POST | /api/v1/suppliers/bulk-delete | |
| 9 | Export | GET | /api/v1/suppliers/export | file download |

## 3. Backend Proposed APIs

| # | Method | Endpoint | Permission | Status |
|---|---|---|---|---|
| 1 | GET | /api/v1/suppliers | supplier.view | Exists |
| 2 | GET | /api/v1/suppliers/summary | supplier.view | **New** |
| 3 | GET | /api/v1/suppliers/{id} | supplier.view | Exists |
| 4 | GET | /api/v1/suppliers/export | supplier.export | Exists |
| 5 | POST | /api/v1/suppliers | supplier.create | Exists – extend |
| 6 | PUT | /api/v1/suppliers/{id} | supplier.update | Exists – extend |
| 7 | DELETE | /api/v1/suppliers/{id} | supplier.delete | Exists |
| 8 | POST | /api/v1/suppliers/bulk-delete | supplier.bulkDelete | **New** |
| 9 | PATCH | /api/v1/suppliers/{id}/toggle-active | supplier.update | Exists |
| 10 | POST | /api/v1/suppliers/{id}/clone | supplier.create | Deferred MVP |
| 11 | PUT | /api/v1/suppliers/bulk-update-address | supplier.updateAddress | Deferred MVP |

## 4. Technical Gap Analysis

### 4.1 Missing Endpoints

| Frontend Need | Resolution |
|---|---|
| GET /api/v1/suppliers/summary | Add in Phase 7 |
| POST /api/v1/suppliers/bulk-delete | Add in Phase 7 |

### 4.2–4.3 Method/Route Mismatch: None.

### 4.4 Query Params Mismatch

| Param | Frontend (Phase 1) | Backend (actual) | **Agreed** |
|---|---|---|---|
| Search text | `keyword` | `search` | **`search`** |
| Page number | `pageIndex` | `page` | **`page`** |
| Sort direction | `sortDirection` | `sortDir` | **`sortDir`** |
| Status filter | `status` (string) | `isActive` (bool) | **`isActive` (bool)** |
| Group filter | `groupId` (Guid) | Not implemented | **`groupName` (string)** |
| Province filter | `provinceCode` | Not implemented | **Deferred** |
| Period filter | `period` | Not implemented | **Deferred** |

### 4.5 Request Body Mismatch

| Field | Frontend Expects | Backend Current | Resolution |
|---|---|---|---|
| supplierType | required | Missing | Add to Create + Update commands |
| groupName | optional | Missing | Add to Create + Update commands |
| idNumber | optional | Missing | Add to Create + Update commands |
| isCustomer | optional | Missing | Add to Create + Update commands |
| isInternalObject | optional | Missing | Add to Create + Update commands |
| code (on update) | not sent | Not in update body | Code is immutable — correct |

### 4.6 Response Body Mismatch

| Field | Frontend Expects | Backend Returns | Resolution |
|---|---|---|---|
| supplierType | required | Missing from DTO | Add to SupplierListItemDto + SupplierDetailDto |
| groupName | optional | Missing | Add to both DTOs |
| isCustomer | optional | Missing | Add to SupplierListItemDto |
| idNumber | optional | Missing | Add to SupplierDetailDto |
| isInternalObject | optional | Missing | Add to SupplierDetailDto |
| Success wrapper | `{ success, data }` | Raw JSON (no wrapper) | **Agreed: raw JSON** |
| Total count | `totalCount` | `total` | **Agreed: `total`** |
| Page field | `pageIndex` | `page` | **Agreed: `page`** |
| Total pages | expected | Not in PageResult | **Client-side: `Math.ceil(total/pageSize)`** |

### 4.7 Field Name Mismatch

| Frontend (TS) | Backend (JSON) | Agreed |
|---|---|---|
| `keyword` query param | `search` | `search` |
| `pageIndex` query param | `page` | `page` |
| `sortDirection` query param | `sortDir` | `sortDir` |
| `totalCount` in response | `total` | `total` |

### 4.8 Type Mismatch

| Field | Frontend Type | Backend Type | Agreed |
|---|---|---|---|
| id | string (GUID) | Guid | string (GUID format) |
| supplierType | 1\|2 | int enum | number (1\|2) |
| currentDebtAmount | number\|null | decimal? | number\|null |
| createdAt | string (ISO 8601) | DateTime | string (ISO 8601) |
| updatedAt | string\|null | DateTime? | string\|null |

### 4.9 Permission Mismatch

| Endpoint | Frontend Expects | Backend Defines | Status |
|---|---|---|---|
| toggle-active | supplier.update | supplier.update | Aligned |
| bulk-delete | supplier.bulkDelete | supplier.bulkDelete | Aligned |
| supplier.pay | config capability | Not in Permissions.cs | Deferred |

### 4.10 Error Format: None — both use RFC 7807 ProblemDetails.

### 4.11 Pagination Mismatch

| Property | Frontend | Backend | **Agreed** |
|---|---|---|---|
| Page param | `pageIndex` | `page` | **`page`** |
| Page size param | `pageSize` | `pageSize` | **`pageSize`** |
| Total count field | `totalCount` | `total` | **`total`** |
| Total pages | expected | Not returned | **Calculate client-side** |

### 4.12 Sorting Mismatch

| Property | Frontend | Backend | **Agreed** |
|---|---|---|---|
| Sort param | `sortBy` | `sortBy` | **`sortBy`** |
| Direction param | `sortDirection` | `sortDir` | **`sortDir`** |
| Direction values | asc/desc | asc/desc | **asc/desc** |

### 4.13 Filtering Mismatch

| Filter | Frontend | Backend | Resolution |
|---|---|---|---|
| Status | `status` string | `isActive` bool | `isActive` bool |
| Group | `groupId` (Guid) | Not supported | `groupName` string filter |
| Province | `provinceCode` | Not supported | Deferred |
| Period | `period` | Not supported | Deferred |

### 4.14 Multi-tenant: None — both header-based, no route param.

---

# PART C — FINAL API CONTRACT

## 5. Final API Contract

### 5.1 Standard Success Response
Direct JSON — no `{ success, data }` wrapper. The DTO IS the response body.

### 5.2 Standard Error Response (RFC 7807)
```json
{
  "type": "https://api.errors/supplier.not_found",
  "title": "supplier.not_found",
  "status": 404,
  "detail": "Supplier not found."
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
{ "items": [], "total": 100, "page": 1, "pageSize": 20 }
```
No `totalPages` — frontend calculates `Math.ceil(total / pageSize)` as needed.

### 5.5 Base URL
```
/api/v1/suppliers
```
Tenant from JWT claim `tenantId` + `X-Tenant-Id` header (auto by Axios). **No `{tenantId}` in route.**

## 6. Endpoint Contracts

### 6.1 GET /api/v1/suppliers — List

**Auth:** Bearer JWT | **Permission:** `supplier.view`

| Param | Type | Default | Description |
|---|---|---|---|
| search | string? | null | Searches code/name/taxCode/phone/email/address |
| page | int | 1 | 1-based |
| pageSize | int | 20 | Max 500 |
| sortBy | string? | updatedAt | code\|name\|currentDebtAmount\|updatedAt\|createdAt |
| sortDir | string? | desc | asc\|desc |
| isActive | bool? | null | Filter by status |
| groupName | string? | null | Filter by group name (new) |

**Response:** `PageResult<SupplierListItemDto>` (200) | **Errors:** 401, 403, 400

### 6.2 GET /api/v1/suppliers/summary — Summary Cards (NEW)

**Auth:** Bearer JWT | **Permission:** `supplier.view`  
**Response** (200):
```json
{
  "totalDebtAmount": 0.0,
  "totalCreditAmount": 0.0,
  "activeCount": 0,
  "inactiveCount": 0,
  "calculatedAt": "2026-05-26T00:00:00Z"
}
```
**Errors:** 401, 403

### 6.3 GET /api/v1/suppliers/{id} — Detail

**Auth:** Bearer JWT | **Permission:** `supplier.view`  
**Response:** `SupplierDetailDto` (200) | **Errors:** 401, 403, 404

### 6.4 POST /api/v1/suppliers — Create

**Auth:** Bearer JWT | **Permission:** `supplier.create`  
**Body:** `CreateSupplierInput` (Section 7.3)  
**Response:** `SupplierDetailDto` (201) | **Errors:** 400, 401, 403, 409 (duplicate code)

### 6.5 PUT /api/v1/suppliers/{id} — Update

**Auth:** Bearer JWT | **Permission:** `supplier.update`  
**Body:** `UpdateSupplierInput` (Section 7.4 — no `code` field)  
**Response:** `SupplierDetailDto` (200) | **Errors:** 400, 401, 403, 404

### 6.6 DELETE /api/v1/suppliers/{id} — Soft Delete

**Auth:** Bearer JWT | **Permission:** `supplier.delete`  
**Response:** 204 | **Errors:** 401, 403, 404

```json
// 409 — has transactions:
{
  "type": "https://api.errors/supplier.has_transactions",
  "title": "supplier.has_transactions",
  "status": 409,
  "detail": "Cannot delete supplier with existing transactions.",
  "extensions": { "transactionCount": 5 }
}
```

### 6.7 POST /api/v1/suppliers/bulk-delete — Bulk Delete (NEW)

**Auth:** Bearer JWT | **Permission:** `supplier.bulkDelete`  
**Body:** `{ "ids": ["uuid1", "uuid2"] }`  
**Response:** 204 | **Errors:** 400 (empty/>100 ids), 401, 403

```json
// 409 — any has transactions (no deletions performed):
{
  "type": "https://api.errors/supplier.bulk_has_transactions",
  "title": "supplier.bulk_has_transactions",
  "status": 409,
  "detail": "One or more suppliers have transactions and cannot be deleted.",
  "extensions": { "affectedIds": ["uuid1"] }
}
```

### 6.8 PATCH /api/v1/suppliers/{id}/toggle-active

**Auth:** Bearer JWT | **Permission:** `supplier.update`  
**Response:** `SupplierDetailDto` (200) | **Errors:** 401, 403, 404

### 6.9 GET /api/v1/suppliers/export — Export Excel

**Auth:** Bearer JWT | **Permission:** `supplier.export`  
**Query Params:** Same as GET list but without page/pageSize  
**Response:** File download (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

### 6.10 POST /api/v1/suppliers/{id}/clone — Deferred MVP (exists, gated)

**Permission:** `supplier.create` | **Response:** `SupplierDetailDto` (201)

### 6.11 PUT /api/v1/suppliers/bulk-update-address — Deferred MVP (exists, gated)

**Permission:** `supplier.updateAddress`

## 7. DTO Contract

### 7.1 SupplierListItemDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|---|---|---|---|---|
| Id | id | Guid | string | GUID |
| Code | code | string | string | |
| Name | name | string | string | |
| SupplierType | supplierType | int | 1\|2 | **NEW** 1=Org 2=Individual |
| GroupName | groupName | string? | string\|null | **NEW** |
| TaxCode | taxCode | string? | string\|null | |
| Phone | phone | string? | string\|null | |
| Address | address | string? | string\|null | |
| IsActive | isActive | bool | boolean | |
| IsCustomer | isCustomer | bool | boolean | **NEW** |
| CurrentDebtAmount | currentDebtAmount | decimal? | number\|null | Negative = credit |
| CreatedAt | createdAt | DateTime | string | ISO 8601 |
| UpdatedAt | updatedAt | DateTime? | string\|null | ISO 8601 |

### 7.2 SupplierDetailDto (extends SupplierListItemDto)

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|---|---|---|---|---|
| Email | email | string? | string\|null | |
| BankAccount | bankAccount | string? | string\|null | |
| IdNumber | idNumber | string? | string\|null | **NEW** CCCD |
| IsInternalObject | isInternalObject | bool | boolean | **NEW** |
| *(all SupplierListItemDto fields)* | | | | |

### 7.3 CreateSupplierInput

| Field | Required | Max Length | Notes |
|---|---|---|---|
| code | Yes | 50 | Unique per tenant |
| name | Yes | 255 | |
| supplierType | Yes | — | 1 or 2 |
| taxCode | No | 32 | |
| idNumber | No | 32 | CCCD (Individual) |
| groupName | No | 100 | |
| email | No | 255 | Format validated if present |
| phone | No | 32 | |
| address | No | 500 | |
| bankAccount | No | 50 | |
| isCustomer | No | — | Default false |
| isInternalObject | No | — | Default false |

### 7.4 UpdateSupplierInput

Same as CreateSupplierInput **minus `code`** — code is immutable after creation.

### 7.5 BulkDeleteInput

| Field | Type | Required | Notes |
|---|---|---|---|
| ids | string[] | Yes | 1–100 GUID strings |

### 7.6 SupplierSummaryDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) |
|---|---|---|---|
| TotalDebtAmount | totalDebtAmount | decimal | number |
| TotalCreditAmount | totalCreditAmount | decimal | number |
| ActiveCount | activeCount | int | number |
| InactiveCount | inactiveCount | int | number |
| CalculatedAt | calculatedAt | DateTime | string (ISO 8601) |

## 8. Permission Contract

| C# Constant | Value | Applies To |
|---|---|---|
| Permissions.SupplierView | supplier.view | GET list, GET summary, GET detail |
| Permissions.SupplierCreate | supplier.create | POST create, POST clone |
| Permissions.SupplierUpdate | supplier.update | PUT update, PATCH toggle-active |
| Permissions.SupplierDelete | supplier.delete | DELETE single |
| Permissions.SupplierBulkDelete | supplier.bulkDelete | POST bulk-delete |
| Permissions.SupplierExport | supplier.export | GET export |
| Permissions.SupplierUpdateAddress | supplier.updateAddress | PUT bulk-update-address (deferred) |
| Permissions.SupplierCreatePurchaseVoucher | supplier.createPurchaseVoucher | Deferred scope |
| (supplier.pay) | — | NOT in Permissions.cs — deferred scope |

## 9. Multi-tenant Contract

| Rule | Implementation |
|---|---|
| TenantId source | JWT claim `tenantId`; fallback: `X-Tenant-Id` header (auto-set by Axios) |
| Route pattern | `/api/v1/suppliers` — NO `{tenantId}` in route |
| Query filter | EF global filter: `WHERE tenant_id = @tenantId AND is_deleted = false` |
| Create | Set `TenantId` from `ICurrentTenantAccessor` |
| Update/Delete | Verified via global query filter (entity returns 404 if wrong tenant) |
| React Query key | Must include tenantId: `['suppliers', tenantId, ...params]` |
| Tenant switch | Invalidate all supplier queries |

## 10. Validation Contract

| Field | Rule | HTTP | Error Field |
|---|---|---|---|
| code | Required, max 50, unique/tenant | 400/409 | Code |
| name | Required, max 255 | 400 | Name |
| supplierType | Required, value 1 or 2 | 400 | SupplierType |
| email | Valid format if present | 400 | Email |
| idNumber | Max 32 | 400 | IdNumber |
| groupName | Max 100 | 400 | GroupName |
| taxCode | Max 32 | 400 | TaxCode |
| phone | Max 32 | 400 | Phone |
| address | Max 500 | 400 | Address |
| bankAccount | Max 50 | 400 | BankAccount |
| ids (bulk-delete) | Not empty, max 100 items | 400 | Ids |

## 11. Contract Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | No `{tenantId}` in route | Project pattern: header-based tenant via `X-Tenant-Id` |
| 2 | No `{ success, data }` wrapper | Existing backend uses direct JSON + ProblemDetails |
| 3 | Use `page`/`sortDir`/`total` | CLAUDE.md gotcha — existing code already uses these |
| 4 | `isActive` bool not `status` string | Existing backend query uses `bool?` |
| 5 | Code is immutable after creation | UpdateSupplierCommand design — prevents code re-use issues |
| 6 | Code max 50 | PDR is authoritative over old validator (32) |
| 7 | GroupName as plain string | No SupplierGroup entity (confirmed B3-Q1) |
| 8 | Bulk-delete: fail-all if any has transactions | Confirmed B3-Q3 |
| 9 | No `totalPages` in response | `PageResult<T>` struct; client calculates |
| 10 | Summary: TotalDebt + TotalCredit + counts | Confirmed B3-Q2 |

## 12. Required Changes

### 12.1 Frontend (Phase 5 must account for)
- [ ] Use `search` not `keyword`
- [ ] Use `page` not `pageIndex`; `sortDir` not `sortDirection`
- [ ] Use `isActive: boolean` not `status: string` for status filter
- [ ] Handle raw JSON response (no success wrapper)
- [ ] Handle `{ items, total, page, pageSize }` shape (no totalPages)
- [ ] Use `groupName` string filter; remove `groupId`/`provinceCode`/`period` from params
- [ ] React Query key includes `tenantId`

### 12.2 Backend (Phase 7 must implement)
- [ ] Add `SupplierType` enum (`Domain/Enums/SupplierType.cs`)
- [ ] Add entity fields: `SupplierType`, `GroupName`, `IdNumber`, `IsCustomer`, `IsInternalObject` + migration
- [ ] Extend `SupplierListItemDto`: add SupplierType, GroupName, IsCustomer
- [ ] Extend `SupplierDetailDto`: add all new fields
- [ ] Extend `CreateSupplierCommand` + validator (Code max 50 → update)
- [ ] Extend `UpdateSupplierCommand` with new fields
- [ ] Add `GetSuppliersSummaryQuery` + handler + endpoint
- [ ] Add `BulkDeleteSuppliersCommand` + handler + endpoint
- [ ] Add `groupName` filter to `GetSuppliersQuery`

### 12.3 Deferred (Not in this Contract)
- Import Excel
- Merge suppliers
- Clone supplier (keep existing endpoint, not MVP — keep it working)
- Bulk update address (keep existing endpoint, not MVP — keep it working)
- Transaction ledger API (`/api/v1/suppliers/{id}/transactions`)
- `supplier.pay` permission and endpoint
- Province / period filters

## 13. Approval Checklist

- [x] A3 Contract Approval Gate: all conditions pass
- [x] A2: No `Must Resolve Before Coding = Yes` questions remain
- [x] All frontend API needs covered by backend endpoints
- [x] Field names agreed: camelCase JSON, PascalCase C#
- [x] Types aligned: dates as ISO 8601, IDs as GUID string
- [x] Pagination contract defined: page, pageSize, total
- [x] Sort contract defined: sortBy, sortDir (asc/desc)
- [x] Success response format agreed (raw JSON)
- [x] Error response format agreed (RFC 7807 ProblemDetails)
- [x] Permission constants agreed
- [x] Multi-tenant rules agreed (no route param, header-based)
- [x] Validation rules agreed
- [x] Export endpoint agreed
- [x] Bulk delete endpoint agreed with fail-all semantics
- [x] No breaking ambiguity remains
- [x] Scope alignment complete (Part A1)

## 14. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P4-A1 | groupName filter: assume ILike partial match | No | Same pattern as search |
| P4-A2 | summary endpoint: no date-range filter for now | No | Returns tenant-wide totals |
| P2-Q3 | Detail view: split-panel vs separate route | No | No API impact; Phase 5 decides |

## 15. Definition of Done

- [x] All confirmed frontend API needs mapped to backend contracts
- [x] All param naming mismatches resolved (search, page, sortDir, isActive)
- [x] All DTO gaps identified and extensions specified
- [x] Response format agreed (direct JSON, ProblemDetails errors)
- [x] New endpoints (summary, bulk-delete) fully specified with error shapes
- [x] Deferred items documented in Section 12.3
- [x] No source code created or modified
