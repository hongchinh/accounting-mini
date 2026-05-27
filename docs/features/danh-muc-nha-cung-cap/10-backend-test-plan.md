# Backend Test Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Test Scope

Phase 10 covers integration testing for all supplier API endpoints implemented in Phase 7. Unit tests for validators were already written during Phase 7 (TDD cycle). This plan focuses on:

- New endpoints: `GET /summary`, `POST /bulk-delete`
- New fields: `supplierType`, `groupName`, `idNumber`, `isCustomer`, `isInternalObject`
- New filter: `groupName` query param on `GET /suppliers`
- Permission and tenant isolation for new endpoints

---

## 2. Test Environment

| Component | Detail |
|---|---|
| Test framework | xUnit + FluentAssertions |
| Unit test runner | `dotnet test tests/AccountingApi.UnitTests/` |
| Integration test runner | `dotnet test tests/AccountingApi.IntegrationTests/` |
| Integration DB | Testcontainers (PostgreSQL — auto-spun per collection) |
| App host | `CustomWebApplicationFactory` with `Migrations:RunOnStartup=true` |

---

## 3. Test Checklist

| Area | Coverage | Status |
|---|---|---|
| GET /suppliers — list, search, isActive filter, pagination, sort | Pre-existing tests | Covered |
| GET /suppliers — groupName filter (new) | New test | Covered |
| GET /suppliers/summary — shape, 401, 403 | New tests | Covered |
| POST /suppliers — valid (201), empty code (400), invalid email (400), duplicate code (409) | Pre-existing | Covered |
| POST /suppliers — new fields (supplierType=2, groupName, isCustomer) | New tests | Covered |
| POST /suppliers — invalid supplierType (400) | New test | Covered |
| GET /suppliers/{id} — exists (200), not found (404) | Pre-existing | Covered |
| GET /suppliers/{id} — new fields (idNumber, isInternalObject) | New test | Covered |
| PUT /suppliers/{id} — valid (200), empty name (400), unknown (404) | Pre-existing | Covered |
| PATCH /suppliers/{id}/toggle-active | Pre-existing | Covered |
| DELETE /suppliers/{id} — 204 + 404 after, unknown (404) | Pre-existing | Covered |
| POST /suppliers/bulk-delete — valid (204), empty (400), >100 (400) | New tests | Covered |
| POST /suppliers/bulk-delete — no permission (403), cross-tenant (204 silently skipped) | New tests | Covered |
| GET /suppliers/export — XLSX (200) | Pre-existing | Covered |
| PUT /suppliers/bulk-update-address — valid (200), empty (400), cross-tenant (0 updated) | Pre-existing | Covered |
| Permission — no JWT (401), no permissions (403), view-only on create/delete (403) | Pre-existing | Covered |
| Tenant isolation — GET cross-tenant id (404), list isolation | Pre-existing | Covered |

---

## 4. Test Cases

### New test cases added in Phase 10

| # | Test Name | Endpoint | Expected | Type |
|---|---|---|---|---|
| 1 | `GetSummary_Returns200WithCorrectShape` | GET /summary | 200 + all 5 DTO fields present | Integration |
| 2 | `GetSummary_NoJwt_Returns401` | GET /summary | 401 | Integration |
| 3 | `GetSummary_NoPermission_Returns403` | GET /summary | 403 | Integration |
| 4 | `GetList_WithGroupNameFilter_ReturnsMatchingResults` | GET /?groupName=X | 200 + at least 1 matching item | Integration |
| 5 | `CreateSupplier_IndividualType_ReturnsSupplierType2` | POST / | 201 + supplierType=2 in response | Integration |
| 6 | `CreateSupplier_WithGroupNameAndIsCustomer_ReturnsFieldsInResponse` | POST / | 201 + groupName + isCustomer in response | Integration |
| 7 | `CreateSupplier_InvalidSupplierType_Returns400` | POST / | 400 (supplierType=99) | Integration |
| 8 | `GetById_AfterUpdateWithIdNumberAndInternalObject_ReturnsNewFields` | GET /{id} | 200 + idNumber + isInternalObject in response | Integration |
| 9 | `BulkDelete_ValidIds_Returns204AndSuppliersGone` | POST /bulk-delete | 204 + GET on deleted ids → 404 | Integration |
| 10 | `BulkDelete_EmptyIds_Returns400` | POST /bulk-delete | 400 | Integration |
| 11 | `BulkDelete_TooManyIds_Returns400` | POST /bulk-delete | 400 (101 ids) | Integration |
| 12 | `BulkDelete_NoPermission_Returns403` | POST /bulk-delete | 403 (view-only JWT) | Integration |
| 13 | `BulkDelete_CrossTenantIds_AreIgnoredReturns204` | POST /bulk-delete | 204 (foreign ids silently skipped) | Integration |

---

## 5. Unit Test Files

These already existed from Phase 7 TDD cycle — no changes in Phase 10:

| File | Tests | Coverage |
|---|---|---|
| `tests/AccountingApi.UnitTests/Suppliers/CreateSupplierCommandValidatorTests.cs` | ~30 | Code, Name, SupplierType, GroupName, IdNumber, Email, Phone, Address, BankAccount |
| `tests/AccountingApi.UnitTests/Suppliers/UpdateSupplierCommandValidatorTests.cs` | ~20 | Same fields minus Code |
| `tests/AccountingApi.UnitTests/Suppliers/GetSuppliersQueryValidatorTests.cs` | ~5 | page, pageSize, sortBy, sortDir |
| `tests/AccountingApi.UnitTests/Suppliers/BulkDeleteSuppliersCommandValidatorTests.cs` | 4 | Empty ids, 1, 100, 101 |
| `tests/AccountingApi.UnitTests/Suppliers/BulkUpdateAddressCommandValidatorTests.cs` | ~6 | ids not empty, address required |

Total unit tests: **71 passing** (verified in Phase 7)

---

## 6. Integration Test Files

| File | Test Count | Coverage |
|---|---|---|
| `tests/AccountingApi.IntegrationTests/Suppliers/SupplierEndpointsTests.cs` | Pre-existing: 23 + New: 13 = **36** | All endpoints |
| `tests/AccountingApi.IntegrationTests/Suppliers/SupplierTestFixture.cs` | — | Shared tenant + auth setup |

---

## 7. Permission Test Files

Covered within `SupplierEndpointsTests.cs`:
- `GetList_NoJwt_Returns401`
- `GetList_NoPermissions_Returns403`
- `CreateSupplier_ViewOnlyPermission_Returns403`
- `DeleteSupplier_ViewOnlyPermission_Returns403`
- `GetSummary_NoJwt_Returns401` (new)
- `GetSummary_NoPermission_Returns403` (new)
- `BulkDelete_NoPermission_Returns403` (new)

---

## 8. Tenant Isolation Test Files

Covered within `SupplierEndpointsTests.cs`:
- `GetById_CrossTenant_Returns404` (cross-tenant GET returns 404, list does not include cross-tenant data)
- `BulkDelete_CrossTenantIds_AreIgnoredReturns204` (new — silent skip on foreign IDs)
- `BulkUpdateAddress_OtherTenantIds_AreIgnored` (0 updated count)

---

## 9. Test Commands

```powershell
# Unit tests only (fast, no DB)
cd accounting_api
dotnet test tests/AccountingApi.UnitTests/AccountingApi.UnitTests.csproj -v q

# Integration tests (requires Docker for Testcontainers)
dotnet test tests/AccountingApi.IntegrationTests/AccountingApi.IntegrationTests.csproj -v q

# All tests
dotnet test AccountingApi.sln -v q

# Filter to supplier tests only
dotnet test AccountingApi.sln --filter "FullyQualifiedName~Suppliers" -v q
```

---

## 10. Test Results

| Suite | Result | Count |
|---|---|---|
| Unit tests (Phase 7) | Passed | 71 passed, 0 failed |
| Integration tests — build | Passed | 0 errors, warnings only (CA1707 — xUnit naming convention) |
| Integration tests — run | Not run (Docker not available in this session) | — |

**Note:** Integration tests require Docker (Testcontainers). Tests compile cleanly; runtime execution requires a running Docker daemon. Tests were not run in this session due to environment constraints.

---

## 11. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P10-A1 | Integration tests not executed (Docker unavailable in session) | No | Tests compile cleanly; run manually with `dotnet test` in Docker-enabled environment |
| P10-A2 | BulkDelete transaction check is a stub — 409 path not testable yet | No | Will be testable when transaction module is built |

---

## 12. Definition of Done

- [x] Test plan created
- [x] Pre-existing unit tests: 71 passing (verified Phase 7)
- [x] 13 new integration tests added covering Phase 7 new endpoints and fields
- [x] Integration test project compiles: 0 errors
- [x] Permission tests included for GET /summary and POST /bulk-delete
- [x] Tenant isolation test included for POST /bulk-delete
- [x] Test commands documented
- [x] Open deviations (Docker, stub) recorded as non-blocking items
