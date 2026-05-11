# Backend Test Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: Yes

---

## 1. Test Scope

| Layer | What is tested |
|---|---|
| Unit — Validators | `CreateSupplierCommandValidator`, `UpdateSupplierCommandValidator`, `GetSuppliersQueryValidator`, `BulkUpdateSupplierAddressCommandValidator` |
| Integration — Endpoints | All 9 supplier endpoints (happy path, validation, business rules) |
| Permission | 401 (no JWT), 403 (missing permission via crafted JWT) |
| Tenant Isolation | Cross-tenant GET by ID returns 404; list returns empty |

**Out of scope:**
- Handler unit tests (handlers depend on DB + EF — covered by integration tests)
- Export binary content verification (tested at endpoint level only)
- Delete-with-transactions 409 (stub always returns 0 — P3-A2; will be tested when accounting module is built)

---

## 2. Test Environment

| Item | Detail |
|---|---|
| Framework | xUnit 2.9.2 |
| Assertions | FluentAssertions 6.12.2 |
| Mocking | NSubstitute 5.3.0 |
| Fake data | Bogus 35.6.1 |
| Integration DB | Testcontainers.PostgreSql 4.1.0 (postgres:17-alpine) |
| Web factory | `CustomWebApplicationFactory` — overrides connection string, JWT keys, runs migrations |
| Auth setup | Register → Login → Bearer token + X-Tenant-Id header |
| Permission JWT | `JwtTestHelper.CreateToken(tenantId, permissions[])` — signed with test key |

---

## 3. Test Checklist

### Validator tests
- [x] Create: code required, max 32
- [x] Create: name required, max 255
- [x] Create: email format validated when non-empty
- [x] Create: taxCode/phone max length
- [x] Create: address max 500, bankAccount max 50
- [x] Update: name required, max 255 (no code field)
- [x] Update: email format validated when non-empty
- [x] GetSuppliers: page >= 1 when page != 0
- [x] GetSuppliers: pageSize in [1, 500] when != 0
- [x] GetSuppliers: sortBy must be one of valid values
- [x] GetSuppliers: sortDir must be asc or desc
- [x] BulkUpdateAddress: ids not empty
- [x] BulkUpdateAddress: address not empty, max 500

### Integration — happy path
- [x] GET /suppliers → 200 paged list
- [x] GET /suppliers?search= → filtered results
- [x] GET /suppliers?isActive=false → filtered results
- [x] GET /suppliers?sortBy=name&sortDir=asc → sorted results
- [x] GET /suppliers?page=1&pageSize=2 → correct page
- [x] POST /suppliers → 201 with SupplierDetailDto
- [x] GET /suppliers/{id} → 200 with SupplierDetailDto
- [x] PUT /suppliers/{id} → 200 updated (code unchanged)
- [x] PATCH /suppliers/{id}/toggle-active → 200 toggled isActive
- [x] POST /suppliers/{id}/clone → 201 with new supplier
- [x] DELETE /suppliers/{id} → 204 soft-deleted
- [x] GET /suppliers/export → 200 xlsx binary
- [x] PUT /suppliers/bulk-update-address → 200 { updatedCount }

### Integration — error paths
- [x] POST with empty code → 400 validation problem
- [x] POST with invalid email → 400
- [x] POST duplicate code → 409 supplier.duplicate_code
- [x] GET /suppliers/{unknownId} → 404 supplier.not_found
- [x] DELETE /suppliers/{unknownId} → 404

### Permission tests
- [x] GET /suppliers without JWT → 401
- [x] GET /suppliers with crafted JWT (no permissions) → 403
- [x] POST /suppliers with crafted JWT (only supplier.view) → 403
- [x] DELETE /suppliers/{id} with crafted JWT (only supplier.view) → 403

### Tenant isolation tests
- [x] Tenant B GET /suppliers/{id} where ID belongs to Tenant A → 404
- [x] Tenant B GET /suppliers (with Tenant A data in DB) → 0 items

---

## 4. Test Cases

See §5 (Unit Test Files) and §6 (Integration Test Files) for case details.

---

## 5. Unit Test Files

| File | Tests | Notes |
|---|---|---|
| `UnitTests/Suppliers/CreateSupplierCommandValidatorTests.cs` | 11 | Code, name, email, field lengths |
| `UnitTests/Suppliers/UpdateSupplierCommandValidatorTests.cs` | 7 | Name, email, field lengths (no code) |
| `UnitTests/Suppliers/GetSuppliersQueryValidatorTests.cs` | 8 | Page, pageSize, sortBy, sortDir |
| `UnitTests/Suppliers/BulkUpdateAddressCommandValidatorTests.cs` | 5 | Ids not empty, address not empty/max length |

---

## 6. Integration Test Files

| File | Tests | Notes |
|---|---|---|
| `IntegrationTests/Common/JwtTestHelper.cs` | helper | Craft JWTs for permission tests |
| `IntegrationTests/Suppliers/SupplierTestFixture.cs` | fixture | One tenant setup per test class |
| `IntegrationTests/Suppliers/SupplierEndpointsTests.cs` | ~20 | All 9 endpoints + error + isolation |

---

## 7. Permission Test Files

Covered in `SupplierEndpointsTests.cs` — uses `JwtTestHelper` to craft tokens with specific permissions.

---

## 8. Tenant Isolation Test Files

Covered in `SupplierEndpointsTests.cs` — creates two tenants and crosses them within the test.

---

## 9. Test Commands

```powershell
cd accounting_api

# Unit tests only (fast, no Docker required)
dotnet test tests/AccountingApi.UnitTests/AccountingApi.UnitTests.csproj

# Integration tests (requires Docker for Testcontainers)
dotnet test tests/AccountingApi.IntegrationTests/AccountingApi.IntegrationTests.csproj

# All tests
dotnet test AccountingApi.sln

# Filter to Suppliers only
dotnet test --filter "FullyQualifiedName~Suppliers"
```

---

## 10. Unclear / Incomplete Items

### 1. Missing Information

| ID | Info | Impact | Required Before Next Phase? |
|---|---|---|---|
| P10-M1 | Delete 409 (HasTransactions) not testable — stub returns 0 (P3-A2) | Missing coverage | No — implement when accounting module is built |

### 4. Assumptions

| ID | Assumption | Risk |
|---|---|---|
| P10-A1 | `SupplierTestFixture` constructor injection of `PostgresFixture` is supported by xUnit v2 | Low — standard xUnit v2 behavior |
| P10-A2 | Crafted JWTs with test signing key are accepted by the app when CustomWebApplicationFactory overrides `Jwt:SigningKey` | Low — verified by reviewing config |

---

## 11. Definition of Done

- [x] Test plan document written
- [x] 4 unit test files created (31 tests)
- [x] Integration test helper (JwtTestHelper) created
- [x] Integration test fixture (SupplierTestFixture) created
- [x] Integration test file created (~20 tests)
- [ ] Tests run: `dotnet test AccountingApi.sln`
- [ ] All unit tests pass
- [ ] All integration tests pass (or failures documented)
- [ ] `workflow-status.md` updated
