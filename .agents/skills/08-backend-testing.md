# Skill 08 — Backend Testing

## Role

Senior .NET Test Engineer, Quality Assurance Architect.

## Goal

Tạo backend test plan và implement backend test code bao gồm unit tests, validator tests, controller integration tests, permission tests và tenant isolation tests. API Contract là source of truth cho mọi test assertion.

---

## Input

- `docs/features/{feature-name}/03-api-contract-review.md`
- `docs/features/{feature-name}/05-backend-implementation-plan.md`
- Backend source code đã implement (Phase 6)

---

## Output

**Test Plan Document:**
```
docs/features/{feature-name}/08-backend-test-plan.md
```

**Test Code:**
```
accounting_api/tests/{Namespace}.UnitTests/{Feature}/
accounting_api/tests/{Namespace}.IntegrationTests/{Feature}/
```

---

## Required Output: Test Plan Document

```markdown
# Backend Test Plan: {Feature Name}

## 1. Test Scope
- Unit Tests: Service layer, Validator layer
- Integration Tests: Controller endpoints (HTTP level)
- Permission Tests: 401, 403 scenarios
- Tenant Isolation Tests: Cross-tenant access prevention

## 2. Test Environment
- Test Framework: xUnit
- Mocking: Moq (hoặc NSubstitute)
- Integration: WebApplicationFactory
- Database: In-memory SQLite hoặc TestContainers SQL Server

## 3. Test Coverage Goals
| Layer | Target Coverage |
|-------|----------------|
| Service | >= 80% |
| Validator | 100% of rules |
| Controller (integration) | All happy paths + main error paths |

## 4. Unit Test Plan

### 4.1 {Feature}ServiceTests
| Test | Input | Expected |
|------|-------|----------|

### 4.2 {Feature}ValidatorTests
| Test | Input | Expected |
|------|-------|----------|

## 5. Integration Test Plan

### 5.1 GET /api/{t}/{r} — List
| Scenario | Setup | Expected HTTP | Expected Response |
|----------|-------|--------------|-------------------|

### 5.2 GET /api/{t}/{r}/{id} — Detail
### 5.3 POST /api/{t}/{r} — Create
### 5.4 PUT /api/{t}/{r}/{id} — Update
### 5.5 DELETE /api/{t}/{r}/{id} — Delete
### 5.6 POST /api/{t}/{r}/bulk-delete — Bulk Delete
### 5.7 GET /api/{t}/{r}/export — Export

## 6. Permission Test Plan
| Endpoint | No JWT | Wrong Permission | Correct Permission |
|----------|--------|-----------------|-------------------|

## 7. Tenant Isolation Test Plan
| Scenario | Expected |
|----------|----------|
| Tenant A reads Tenant B data | 404 or empty |
| Tenant A updates Tenant B entity | 403 or 404 |
| Tenant A deletes Tenant B entity | 403 or 404 |

## 8. Exit Criteria
- [ ] All happy path tests pass
- [ ] All validation tests pass
- [ ] All permission tests pass
- [ ] All tenant isolation tests pass
- [ ] No 500 errors from test scenarios
```

---

## Required Test Code Patterns

### Unit Test: Service

```csharp
// accounting_api/tests/{NS}.UnitTests/{Feature}/{Feature}ServiceTests.cs
namespace {Namespace}.UnitTests.{Feature};

public class {Feature}ServiceTests
{
    private readonly Mock<I{Feature}Repository> _repoMock;
    private readonly Mock<ICurrentTenantService> _tenantMock;
    private readonly Mock<ICurrentUserService> _userMock;
    private readonly {Feature}Service _sut;

    public {Feature}ServiceTests()
    {
        _repoMock = new Mock<I{Feature}Repository>();
        _tenantMock = new Mock<ICurrentTenantService>();
        _userMock = new Mock<ICurrentUserService>();

        _tenantMock.Setup(x => x.TenantId).Returns(Guid.NewGuid());
        _userMock.Setup(x => x.UserId).Returns("test-user");

        _sut = new {Feature}Service(
            _repoMock.Object,
            new Create{Feature}Validator(),
            new Update{Feature}Validator(),
            _tenantMock.Object,
            _userMock.Object
        );
    }

    // ===== GET LIST =====
    [Fact]
    public async Task GetListAsync_ShouldReturnSuccess_WhenDataExists()
    {
        // Arrange
        var query = new {Feature}ListQuery { PageIndex = 1, PageSize = 20 };
        var expected = PaginatedResult<{Feature}ListItemDto>.Create(
            new List<{Feature}ListItemDto> { /* mock */ },
            1, 1, 20
        );
        _repoMock.Setup(x => x.GetListAsync(query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetListAsync(query, CancellationToken.None);

        // Assert
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(1, result.Data.TotalCount);
    }

    // ===== CREATE =====
    [Fact]
    public async Task CreateAsync_ShouldReturnSuccess_WhenValidInput()
    {
        // Arrange
        var request = new Create{Feature}Request { Code = "S001", Name = "Test" };
        _repoMock.Setup(x => x.IsCodeExistsAsync("S001", It.IsAny<Guid>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.True(result.Success);
        _repoMock.Verify(x => x.AddAsync(It.IsAny<{Entity}>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnFail_WhenCodeDuplicated()
    {
        // Arrange
        var request = new Create{Feature}Request { Code = "S001", Name = "Test" };
        _repoMock.Setup(x => x.IsCodeExistsAsync("S001", It.IsAny<Guid>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.False(result.Success);
        Assert.Contains(result.Errors, e => e.Field == "code");
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnFail_WhenNameEmpty()
    {
        // Arrange
        var request = new Create{Feature}Request { Code = "S001", Name = "" };

        // Act
        var result = await _sut.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.False(result.Success);
        Assert.Contains(result.Errors, e => e.Field.ToLower() == "name");
    }

    // ===== DELETE =====
    [Fact]
    public async Task DeleteAsync_ShouldReturnNotFound_WhenEntityNotExist()
    {
        // Arrange
        _repoMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Entity)null!);

        // Act
        var result = await _sut.DeleteAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        Assert.False(result.Success);
    }
}
```

---

### Unit Test: Validator

```csharp
// accounting_api/tests/{NS}.UnitTests/{Feature}/{Feature}ValidatorTests.cs
namespace {Namespace}.UnitTests.{Feature};

public class Create{Feature}ValidatorTests
{
    private readonly Create{Feature}Validator _validator = new();

    [Theory]
    [InlineData("", "Test Name", false)]     // Empty code
    [InlineData(null, "Test Name", false)]   // Null code
    [InlineData("S001", "", false)]          // Empty name
    [InlineData("S001", null, false)]        // Null name
    [InlineData("S001", "Test Name", true)]  // Valid
    public async Task Validate_ShouldMatchExpected(string? code, string? name, bool expectedValid)
    {
        var request = new Create{Feature}Request { Code = code!, Name = name! };
        var result = await _validator.ValidateAsync(request);
        Assert.Equal(expectedValid, result.IsValid);
    }

    [Fact]
    public async Task Validate_ShouldFail_WhenCodeExceedsMaxLength()
    {
        var request = new Create{Feature}Request
        {
            Code = new string('A', 51), // Exceeds 50 char limit
            Name = "Valid Name"
        };
        var result = await _validator.ValidateAsync(request);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Code");
    }
}
```

---

### Integration Test: Controller

```csharp
// accounting_api/tests/{NS}.IntegrationTests/{Feature}/{Feature}ControllerTests.cs
namespace {Namespace}.IntegrationTests.{Feature};

public class {Feature}ControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly string _viewerToken;    // JWT with {feature}.view
    private readonly string _creatorToken;   // JWT with {feature}.create
    private readonly string _noPermToken;    // JWT without {feature} permissions

    public {Feature}ControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
        // Setup JWT tokens for different permission levels
        _viewerToken = JwtTestHelper.CreateToken(_tenantId, new[] { "{feature}.view" });
        _creatorToken = JwtTestHelper.CreateToken(_tenantId, new[] { "{feature}.view", "{feature}.create" });
        _noPermToken = JwtTestHelper.CreateToken(_tenantId, Array.Empty<string>());
    }

    // ===== GET LIST =====
    [Fact]
    public async Task GetList_ShouldReturn200_WhenAuthorized()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _viewerToken);

        var response = await _client.GetAsync($"/api/{_tenantId}/{resource}?pageIndex=1&pageSize=20");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<PaginatedResult<{Feature}ListItemDto>>>();
        Assert.True(body!.Success);
        Assert.NotNull(body.Data);
    }

    [Fact]
    public async Task GetList_ShouldReturn401_WhenNoToken()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var response = await _client.GetAsync($"/api/{_tenantId}/{resource}");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetList_ShouldReturn403_WhenMissingPermission()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _noPermToken);
        var response = await _client.GetAsync($"/api/{_tenantId}/{resource}");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ===== CREATE =====
    [Fact]
    public async Task Create_ShouldReturn201_WhenValidInput()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _creatorToken);

        var request = new Create{Feature}Request { Code = "S001", Name = "Test Supplier" };
        var response = await _client.PostAsJsonAsync($"/api/{_tenantId}/{resource}", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<{Feature}DetailDto>>();
        Assert.True(body!.Success);
        Assert.Equal("S001", body.Data!.Code);
    }

    [Fact]
    public async Task Create_ShouldReturn400_WhenValidationFails()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _creatorToken);

        var request = new Create{Feature}Request { Code = "", Name = "" }; // Invalid
        var response = await _client.PostAsJsonAsync($"/api/{_tenantId}/{resource}", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        Assert.False(body!.Success);
        Assert.NotEmpty(body.Errors);
    }

    // ===== TENANT ISOLATION =====
    [Fact]
    public async Task GetDetail_ShouldReturn404_WhenEntityBelongsToDifferentTenant()
    {
        // Seed entity for Tenant A
        var tenantAId = Guid.NewGuid();
        var entityId = await SeedEntityForTenant(tenantAId);

        // Try to access with Tenant B token
        var tenantBToken = JwtTestHelper.CreateToken(Guid.NewGuid(), new[] { "{feature}.view" });
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tenantBToken);

        var response = await _client.GetAsync($"/api/{Guid.NewGuid()}/{resource}/{entityId}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetList_ShouldOnlyReturnCurrentTenantData()
    {
        var tenantAId = Guid.NewGuid();
        var tenantBId = Guid.NewGuid();

        // Seed data for both tenants
        await SeedEntityForTenant(tenantAId, count: 3);
        await SeedEntityForTenant(tenantBId, count: 5);

        var tokenA = JwtTestHelper.CreateToken(tenantAId, new[] { "{feature}.view" });
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenA);

        var response = await _client.GetAsync($"/api/{tenantAId}/{resource}");
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<PaginatedResult<{Feature}ListItemDto>>>();

        Assert.Equal(3, body!.Data!.TotalCount); // Only Tenant A data
    }
}
```

---

## Full Test Checklist

### Happy Path Tests
- [ ] GET list returns 200 with paginated data
- [ ] GET list with keyword search returns filtered results
- [ ] GET list with status filter returns filtered results
- [ ] GET list with sorting returns sorted results
- [ ] GET list with pagination returns correct page
- [ ] GET detail returns 200 with full detail
- [ ] POST create returns 201 with created entity
- [ ] PUT update returns 200 with updated entity
- [ ] DELETE returns 200 (soft delete)
- [ ] POST bulk-delete returns 200
- [ ] GET export returns file

### Validation Tests
- [ ] Create with empty required fields returns 400
- [ ] Create with field too long returns 400
- [ ] Create with invalid format (email, phone, tax code) returns 400
- [ ] Duplicate code returns 409
- [ ] Duplicate tax code returns 409
- [ ] Update with invalid data returns 400

### Business Rule Tests
- [ ] Cannot delete entity with active dependencies
- [ ] Unique constraints enforced per tenant

### Permission Tests
- [ ] GET list without JWT returns 401
- [ ] GET list with expired JWT returns 401
- [ ] GET list without view permission returns 403
- [ ] POST create without create permission returns 403
- [ ] PUT update without update permission returns 403
- [ ] DELETE without delete permission returns 403
- [ ] GET export without export permission returns 403

### Tenant Isolation Tests
- [ ] GET list only returns own tenant data
- [ ] GET detail returns 404 for other tenant's entity
- [ ] PUT update returns 404 or 403 for other tenant's entity
- [ ] DELETE returns 404 or 403 for other tenant's entity
- [ ] Bulk delete skips other tenant's entities

### Error Format Tests
- [ ] 400 response has standard error format (success=false, errors=[])
- [ ] 401 response is standard format
- [ ] 403 response is standard format
- [ ] 404 response is standard format

---

## File Path Rules

| Output | Path |
|--------|------|
| Test plan | `docs/features/{feature-name}/08-backend-test-plan.md` |
| Unit tests | `accounting_api/tests/{NS}.UnitTests/{Feature}/` |
| Integration tests | `accounting_api/tests/{NS}.IntegrationTests/{Feature}/` |

**CẤMTẠO:** Không tạo test file ngoài `accounting_api/tests/`.

---

## Final Report Format

```
## Phase 8 Complete — Backend Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/08-backend-test-plan.md

### Test Files Created

| File | Tests |
|------|-------|
| accounting_api/tests/.../...ServiceTests.cs | {n} tests |
| accounting_api/tests/.../...ValidatorTests.cs | {n} tests |
| accounting_api/tests/.../...ControllerTests.cs | {n} tests |

### Test Results
- Unit tests: {n}/{n} passing
- Integration tests: {n}/{n} passing
- Permission tests: {n}/{n} passing
- Tenant isolation tests: {n}/{n} passing

### Run Command
\```bash
dotnet test accounting_api/tests/{NS}.UnitTests
dotnet test accounting_api/tests/{NS}.IntegrationTests
\```

### Failed Tests (if any)
- ...

**Next Step:** Phase 9 — Frontend Testing
Use skill: .ai/skills/09-frontend-testing.md
```
