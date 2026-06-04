# Backend Test Plan: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Test Scope

All 10 endpoints for the Customer module per [04-api-contract-review.md](04-api-contract-review.md).

| Area | Covered |
|---|---|
| Endpoint success cases | ✅ |
| Validation failures | ✅ |
| Not found behavior | ✅ |
| Duplicate/conflict behavior | ✅ |
| Permission denied (401/403) | ✅ |
| Tenant isolation | ✅ |
| Pagination, filtering, sorting | ✅ (pagination + 2 filters) |
| Soft delete behavior | ✅ |
| Export | ✅ |
| Bulk delete | ✅ |
| Sub-collection replace-all | ✅ |

---

## 2. Test Environment

| Item | Value |
|---|---|
| Framework | xUnit + FluentAssertions |
| DB | Testcontainers PostgreSQL (spun per test class) |
| Auth | `JwtTestHelper.CreateToken` for crafted JWTs |
| Docker | Required — must be running |
| Run command | `dotnet test AccountingApi.sln --filter "FullyQualifiedName~Customers"` |

---

## 3. Test Checklist

| # | Check | Status |
|---|---|---|
| 1 | GET /customers returns paged result | ✅ |
| 2 | GET /customers?search filters by code | ✅ |
| 3 | GET /customers?customerType filters by type | ✅ |
| 4 | GET /customers?page=1&pageSize=5 returns correct page | ✅ |
| 5 | GET /customers/summary returns 4 fields | ✅ |
| 6 | GET /customers/lookup?taxCode finds customer | ✅ |
| 7 | GET /customers/lookup?taxCode=NOTEXIST → 404 | ✅ |
| 8 | GET /customers/lookup with no params → 400 | ✅ |
| 9 | GET /customers/lookup with both params → 400 | ✅ |
| 10 | POST /customers Org with bank accounts → 201 | ✅ |
| 11 | POST /customers Individual → 201 | ✅ |
| 12 | POST /customers duplicate code → 409 | ✅ |
| 13 | POST /customers missing code → 400 | ✅ |
| 14 | GET /customers/{id} returns detail + sub-collections | ✅ |
| 15 | GET /customers/{id} unknown id → 404 | ✅ |
| 16 | PUT /customers/{id} updates name + bank accounts | ✅ |
| 17 | PUT /customers/{id} replace-all sub-collections round-trip | ✅ |
| 18 | PATCH /customers/{id}/toggle-active toggles isActive | ✅ |
| 19 | DELETE /customers/{id} returns 204, then 404 | ✅ |
| 20 | DELETE /customers/{id} unknown id → 404 | ✅ |
| 21 | POST /customers/bulk-delete valid ids → 204 | ✅ |
| 22 | POST /customers/bulk-delete empty ids → 400 | ✅ |
| 23 | GET /customers no JWT → 401 | ✅ |
| 24 | POST /customers no create permission → 403 | ✅ |
| 25 | GET /customers/{id} cross-tenant → 404 | ✅ |
| 26 | GET /customers/export returns Excel file | ✅ |

---

## 4. Test Cases

### Unit Tests (56 total)

| File | Cases |
|---|---|
| `CreateCustomerCommandValidatorTests` | Required fields, max length, enum range, email format, date range, bank account sub-validator |
| `GetCustomersQueryValidatorTests` | Page/pageSize bounds, sortBy allowed values, customerType 1/2/null valid; 0/3 invalid |
| `BulkDeleteCustomersCommandValidatorTests` | Empty ids, too many ids, null ids |
| `LookupCustomerQueryValidatorTests` | Neither param, both params, taxCode only, cccd only |

### Integration Tests (26 total — see §3 checklist)

Key scenarios:
- Sub-collection replace-all: `Update_ReplacesSubCollections_RoundTrip` verifies that bank accounts are fully replaced (not merged) on PUT
- Soft delete: `Delete_Existing_Returns204` followed by `GetById` → 404 proves soft delete + query filter
- Tenant isolation: `GetById_CrossTenant_Returns404` creates a real second tenant and verifies EF query filter blocks cross-tenant access
- Permission: `Create_NoCreatePermission_Returns403` verifies `customer.create` permission is enforced
- Export: verifies MIME type `spreadsheetml`

---

## 5. Unit Test Files

| File | Location |
|---|---|
| `CreateCustomerCommandValidatorTests.cs` | `tests/AccountingApi.UnitTests/Customers/` |
| `GetCustomersQueryValidatorTests.cs` | `tests/AccountingApi.UnitTests/Customers/` |
| `BulkDeleteCustomersCommandValidatorTests.cs` | `tests/AccountingApi.UnitTests/Customers/` |
| `LookupCustomerQueryValidatorTests.cs` | `tests/AccountingApi.UnitTests/Customers/` |

---

## 6. Integration Test Files

| File | Location |
|---|---|
| `CustomerTestFixture.cs` | `tests/AccountingApi.IntegrationTests/Customers/` |
| `CustomerEndpointsTests.cs` | `tests/AccountingApi.IntegrationTests/Customers/` |

---

## 7. Permission Test Coverage

| Permission | Test |
|---|---|
| `customer.view` (no JWT) | `GetList_NoJwt_Returns401` |
| `customer.create` (denied) | `Create_NoCreatePermission_Returns403` |
| Tenant isolation | `GetById_CrossTenant_Returns404` |

---

## 8. Tenant Isolation Tests

`GetById_CrossTenant_Returns404`: Creates Tenant A customer, registers real Tenant B via auth API, confirms Tenant B cannot access Tenant A's customer (EF global query filter).

---

## 9. Test Commands

```powershell
# Unit tests (no Docker needed)
dotnet test tests/AccountingApi.UnitTests/AccountingApi.UnitTests.csproj --filter "FullyQualifiedName~Customers"

# Integration tests (Docker required)
dotnet test tests/AccountingApi.IntegrationTests/AccountingApi.IntegrationTests.csproj --filter "FullyQualifiedName~Customers"

# All customer tests
dotnet test AccountingApi.sln --filter "FullyQualifiedName~Customers"
```

---

## 10. Test Results

| Run | Unit | Integration | Total | Result |
|---|---|---|---|---|
| Baseline (pre-fix) | 56/56 ✅ | 21/26 ⚠️ | 77/82 | 5 failures |
| Final (post-fix) | 56/56 ✅ | 26/26 ✅ | 82/82 | **All passed** |

---

## 11. Defects Found

| ID | Severity | Area | Description | Status |
|---|---|---|---|---|
| D01 | High | DTO | `CustomerListItemDto` and `CustomerDetailDto` used `Code`/`Name` — serialized as `code`/`name` — violating Phase 4 contract (`customerCode`/`customerName`). Frontend `customer.types.ts` expects `customerCode`/`customerName`. | **Fixed** — renamed to `CustomerCode`/`CustomerName` |
| D02 | Low | Test | `GetList_NoJwt_Returns401` used anonymous client with no X-Tenant-Id — tenant middleware returned 400 before auth could return 401. | **Fixed** — test now uses `CreateClientWithTenantNoJwt()` |
| D03 | Medium | Test | `GetById_CrossTenant_Returns404` used a random non-existent GUID as tenant — returned 400 (tenant not resolved) instead of 404. | **Fixed** — test now creates a real second tenant (Supplier pattern) |
| D04 (known) | Low | Test | Supplier `GetList_NoJwt_Returns401` has the same D02 pattern — also fails with 400. Not fixed here (out of scope). | Open — log in issues.md |

---

## 12. Definition of Done

- [x] Test plan created
- [x] 26 integration test cases cover all 10 API endpoints
- [x] 56 unit test cases cover all 4 validators
- [x] Permission + tenant isolation tests included
- [x] Test commands documented
- [x] Final results: 82/82 passed
- [x] 3 defects found and fixed (D01, D02, D03)
- [x] 1 pre-existing defect logged (D04 — Supplier, out of scope)
- [x] Defects recorded in issues.md
