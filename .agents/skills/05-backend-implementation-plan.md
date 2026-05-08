# Skill 05 — Backend Implementation Plan

## Role

Senior .NET Backend Architect, Clean Architecture Expert.

## Goal

Tạo kế hoạch coding backend chi tiết dựa trên Backend Basic Design (Phase 2) và API Contract (Phase 3). Liệt kê đầy đủ file cần tạo/sửa theo Clean Architecture, thứ tự implement, request flow và security strategy. Không code ở phase này.

---

## Input

- `docs/features/{feature-name}/02-backend-basic-design.md`
- `docs/features/{feature-name}/03-api-contract-review.md`

---

## Output

```
docs/features/{feature-name}/05-backend-implementation-plan.md
```

---

## Required Output Format

```markdown
# Backend Implementation Plan: {Feature Name}

## 1. Goal

Implement backend API cho {Feature Name} theo API Contract đã được approved, tuân thủ Clean Architecture.

## 2. Scope

### 2.1 In Scope
- ...

### 2.2 Out of Scope
- ...

## 3. Dependencies

### 3.1 NuGet Packages
| Package | Version | Purpose |
|---------|---------|---------|

### 3.2 Internal Dependencies
- DbContext: ...
- Shared entities: ...
- Base classes: ...
- Permission constants file: ...
- Current tenant service: ...
- Current user service: ...

### 3.3 Migration Strategy
- Có tạo migration mới không?
- Migration name: ...

## 4. File Change Plan

> Mọi file path PHẢI bắt đầu bằng `accounting_api/`
> Đọc project structure thực tế trước khi liệt kê — dùng đúng folder/namespace đang có.

### 4.1 New Files

#### Domain Layer

| # | File Path | Description |
|---|-----------|-------------|
| 1 | `accounting_api/src/{Namespace}.Domain/Entities/{Entity}.cs` | Main entity |
| 2 | `accounting_api/src/{Namespace}.Domain/Enums/{Entity}Status.cs` | Status enum |

#### Application Layer

| # | File Path | Description |
|---|-----------|-------------|
| 3 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/{Feature}ListQuery.cs` | List query DTO |
| 4 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/{Feature}ListItemDto.cs` | List item DTO |
| 5 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/{Feature}DetailDto.cs` | Detail DTO |
| 6 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/Create{Feature}Request.cs` | Create request |
| 7 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/Update{Feature}Request.cs` | Update request |
| 8 | `accounting_api/src/{Namespace}.Application/{Feature}/Dtos/Bulk{Feature}Request.cs` | Bulk action request |
| 9 | `accounting_api/src/{Namespace}.Application/{Feature}/Validators/Create{Feature}Validator.cs` | FluentValidation |
| 10 | `accounting_api/src/{Namespace}.Application/{Feature}/Validators/Update{Feature}Validator.cs` | FluentValidation |
| 11 | `accounting_api/src/{Namespace}.Application/{Feature}/Services/I{Feature}Service.cs` | Service interface |
| 12 | `accounting_api/src/{Namespace}.Application/{Feature}/Services/{Feature}Service.cs` | Service implementation |

#### Infrastructure Layer

| # | File Path | Description |
|---|-----------|-------------|
| 13 | `accounting_api/src/{Namespace}.Infrastructure/Persistence/Configurations/{Entity}Configuration.cs` | EF Core configuration |
| 14 | `accounting_api/src/{Namespace}.Infrastructure/Persistence/Repositories/{Feature}Repository.cs` | Repository implementation |

#### API Layer

| # | File Path | Description |
|---|-----------|-------------|
| 15 | `accounting_api/src/{Namespace}.Api/Controllers/{Feature}Controller.cs` | ASP.NET Core controller |

### 4.2 Modified Files

| # | File Path | Change Description |
|---|-----------|-------------------|
| 1 | `accounting_api/src/{Namespace}.Infrastructure/Persistence/AppDbContext.cs` | Add DbSet<{Entity}> |
| 2 | `accounting_api/src/{Namespace}.Infrastructure/DependencyInjection.cs` | Register repository |
| 3 | `accounting_api/src/{Namespace}.Application/DependencyInjection.cs` | Register service, validator |
| 4 | `accounting_api/src/{Namespace}.Domain/Constants/Permissions.cs` | Add permission constants |

### 4.3 Test Files

| # | File Path | Description |
|---|-----------|-------------|
| 1 | `accounting_api/tests/{Namespace}.UnitTests/{Feature}/{Feature}ServiceTests.cs` | Unit tests |
| 2 | `accounting_api/tests/{Namespace}.UnitTests/{Feature}/{Feature}ValidatorTests.cs` | Validator tests |
| 3 | `accounting_api/tests/{Namespace}.IntegrationTests/{Feature}/{Feature}ControllerTests.cs` | Integration tests |

## 5. Implementation Steps

### Step 1: Domain Entity

```csharp
// {Entity}.cs
// Properties:
// - Id (Guid)
// - TenantId (Guid)
// - [business fields]
// - IsDeleted (bool)
// - CreatedAt (DateTime)
// - CreatedBy (string)
// - UpdatedAt (DateTime?)
// - UpdatedBy (string?)
// Extends: BaseEntity (nếu có base class)
```

Mapping từ API Contract Section 7.x.

---

### Step 2: Enums

```csharp
// {Entity}Status.cs
public enum {Entity}Status
{
    Active = 1,
    Inactive = 2,
}
```

---

### Step 3: EF Core Configuration

```csharp
// {Entity}Configuration.cs : IEntityTypeConfiguration<{Entity}>
// - Table name
// - Primary key
// - Required fields
// - Max length constraints
// - Indexes (unique per tenant, search indexes)
// - Soft delete filter: HasQueryFilter(e => !e.IsDeleted && e.TenantId == _tenantId)
```

---

### Step 4: DbContext Update

```csharp
// AppDbContext.cs
public DbSet<{Entity}> {Entities} { get; set; }
```

---

### Step 5: DTOs

Implement theo API Contract Section 7:
- `{Feature}ListQuery` — query params
- `{Feature}ListItemDto` — list response
- `{Feature}DetailDto` — detail response
- `Create{Feature}Request` — create body
- `Update{Feature}Request` — update body
- `{Feature}SummaryDto` — summary response

---

### Step 6: Validators (FluentValidation)

```csharp
// Create{Feature}Validator.cs
public class Create{Feature}Validator : AbstractValidator<Create{Feature}Request>
{
    // Rules từ API Contract Section 10
}
```

---

### Step 7: Repository

Interface và implementation:

```csharp
// I{Feature}Repository interface
Task<PaginatedResult<{Feature}ListItemDto>> GetListAsync({Feature}ListQuery query, Guid tenantId, CancellationToken ct);
Task<{Feature}DetailDto?> GetDetailAsync(Guid id, Guid tenantId, CancellationToken ct);
Task<{Entity}> GetByIdAsync(Guid id, Guid tenantId, CancellationToken ct);
Task<bool> IsCodeExistsAsync(string code, Guid tenantId, Guid? excludeId, CancellationToken ct);
Task AddAsync({Entity} entity, CancellationToken ct);
Task UpdateAsync({Entity} entity, CancellationToken ct);
Task DeleteAsync({Entity} entity, CancellationToken ct);
Task<int> BulkDeleteAsync(List<Guid> ids, Guid tenantId, CancellationToken ct);
```

**Repository Rules:**
- Mọi query phải filter by tenantId
- Sử dụng AsNoTracking cho read-only queries
- Sử dụng projection (Select) thay vì load full entity cho list queries
- Không thực hiện business logic trong repository

---

### Step 8: Service

```csharp
// I{Feature}Service interface + {Feature}Service implementation
// Inject: I{Feature}Repository, IValidator<Create{Feature}Request>, ICurrentTenantService, ICurrentUserService

// Methods:
Task<ApiResponse<PaginatedResult<{Feature}ListItemDto>>> GetListAsync({Feature}ListQuery query, CancellationToken ct);
Task<ApiResponse<{Feature}DetailDto>> GetDetailAsync(Guid id, CancellationToken ct);
Task<ApiResponse<{Feature}DetailDto>> CreateAsync(Create{Feature}Request request, CancellationToken ct);
Task<ApiResponse<{Feature}DetailDto>> UpdateAsync(Guid id, Update{Feature}Request request, CancellationToken ct);
Task<ApiResponse<bool>> DeleteAsync(Guid id, CancellationToken ct);
Task<ApiResponse<BulkDeleteResult>> BulkDeleteAsync(BulkDeleteRequest request, CancellationToken ct);
Task<FileResult> ExportAsync({Feature}ListQuery query, CancellationToken ct);
```

**Service Rules:**
- Lấy tenantId từ ICurrentTenantService
- Lấy userId từ ICurrentUserService
- Validate trước khi thực hiện business logic
- Check ownership trước update/delete
- Không business logic trong controller

---

### Step 9: Controller

```csharp
// {Feature}Controller.cs
[ApiController]
[Route("api/{tenantId}/{resource}")]
[Authorize]
public class {Feature}Controller : ControllerBase
{
    // Inject I{Feature}Service
    // Methods match API Contract Section 6
}
```

**Endpoints:**
- `GET /` — GetList
- `GET /{id}` — GetDetail
- `POST /` — Create
- `PUT /{id}` — Update
- `DELETE /{id}` — Delete
- `POST /bulk-delete` — BulkDelete
- `GET /export` — Export

**Permission check per endpoint** via `[Authorize(Policy = Permissions.{Feature}.{Action})]`

---

### Step 10: Permission Constants

```csharp
// Permissions.cs (thêm vào class hiện có)
public static class {Feature}
{
    public const string View = "{feature}.view";
    public const string Create = "{feature}.create";
    public const string Update = "{feature}.update";
    public const string Delete = "{feature}.delete";
    public const string Export = "{feature}.export";
}
```

---

### Step 11: Dependency Injection

```csharp
// Infrastructure DI:
services.AddScoped<I{Feature}Repository, {Feature}Repository>();

// Application DI:
services.AddScoped<I{Feature}Service, {Feature}Service>();
services.AddValidatorsFromAssemblyContaining<Create{Feature}Validator>();
```

---

### Step 12: Migration

```bash
# Command to run after coding:
dotnet ef migrations add Add{Feature} --project accounting_api/src/{Namespace}.Infrastructure --startup-project accounting_api/src/{Namespace}.Api
dotnet ef database update --project accounting_api/src/{Namespace}.Infrastructure --startup-project accounting_api/src/{Namespace}.Api
```

---

### Step 13: Seed Data (nếu cần)

- Seed initial {feature} data nếu có yêu cầu.

---

## 6. Request Flow

```
HTTP Request
    ↓
[Middleware: JWT Auth → Tenant Resolution]
    ↓
{Feature}Controller
    ↓
[Authorize: Permission check]
    ↓
{Feature}Service.Method()
    ↓
[FluentValidation]
    ↓
[Business Rules]
    ↓
I{Feature}Repository.Method()
    ↓
EF Core Query (with TenantId filter)
    ↓
SQL Server
    ↓
Projection → DTO
    ↓
ApiResponse<T>
    ↓
HTTP Response
```

---

## 7. Query Strategy

| Query | Strategy | Notes |
|-------|----------|-------|
| List | Projection, server-side pagination | AsNoTracking, Select to DTO |
| Detail | Projection | AsNoTracking, include related entities |
| Create | Full entity | SaveChanges |
| Update | Tracked entity | Find → modify → SaveChanges |
| Delete | Soft delete | Set IsDeleted = true, SaveChanges |
| Export | Projection no limit | Stream to Excel |

---

## 8. Error Handling Strategy

| Scenario | Response | HTTP Status |
|----------|----------|-------------|
| Validation failed | Standard error response | 400 |
| Not found | Standard error response | 404 |
| Duplicate code | Standard error response | 409 |
| Unauthorized | Standard error response | 401 |
| Forbidden | Standard error response | 403 |
| Unhandled exception | Standard error response | 500 |
| Cannot delete (has deps) | Standard error response | 400 |

---

## 9. Security Strategy

- All endpoints require `[Authorize]`
- Permission check per endpoint
- TenantId from JWT (không nhận từ request body)
- All queries filter by TenantId
- Update/Delete verify `entity.TenantId == currentTenantId`
- DTO prevents mass assignment
- FluentValidation prevents injection via input sanitization
- EF Core parameterized queries prevent SQL injection

---

## 10. Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Migration conflict | Coordinate with team, sequential migration |
| Performance on large tables | Add pagination, indexes |
| N+1 query | Use Include() or projection |
| Tenant leakage | Global query filter on TenantId |

---

## 11. Checklist Before Coding

- [ ] API Contract (Phase 3) đã được approved
- [ ] Backend Implementation Plan đã review
- [ ] Project structure thực tế đã được đọc (đúng namespace)
- [ ] BaseEntity/base class đã check (có sẵn không?)
- [ ] ICurrentTenantService đã available
- [ ] ICurrentUserService đã available
- [ ] ApiResponse<T> và PaginatedResult<T> đã có sẵn
- [ ] Global exception handler đã setup
- [ ] Permission policy registration đã có
- [ ] EF Core global query filter strategy đã hiểu
```

---

## Rules

1. **Không code ở phase này.**
2. **Mọi file path backend phải bắt đầu bằng `accounting_api/`.**
3. **Phải đọc project structure thực tế trước khi liệt kê file path** — dùng đúng namespace đang có.
4. Plan phải theo đúng thứ tự Clean Architecture: Domain → Application → Infrastructure → Api.
5. Không liệt kê file nào ngoài `accounting_api/`.
6. Phải có migration plan.
7. Request flow phải mô tả đủ middleware chain.
8. Repository interface phải tách khỏi implementation.
9. Service phải tách khỏi controller logic.

---

## File Path Rules

| Input | Path |
|-------|------|
| Backend design | `docs/features/{feature-name}/02-backend-basic-design.md` |
| API Contract | `docs/features/{feature-name}/03-api-contract-review.md` |

| Output | Path |
|--------|------|
| Plan document | `docs/features/{feature-name}/05-backend-implementation-plan.md` |

**CẤMTẠO:** Không tạo bất kỳ file code nào trong `accounting_api/` ở phase này.

---

## Checklist Trước Khi Hoàn Thành

- [ ] Section 4: File Change Plan đã liệt kê đủ file theo Clean Architecture layers
- [ ] Mọi file path đều bắt đầu bằng `accounting_api/`
- [ ] Namespace trong path khớp với project thực tế
- [ ] Section 5: Đủ 13 implementation steps
- [ ] Section 6: Request flow diagram có đủ middleware chain
- [ ] Section 7: Query strategy đã có
- [ ] Section 8: Error handling đã map với API Contract
- [ ] Section 9: Security strategy đã có
- [ ] Section 12: Migration command đã có

---

## Final Report Format

```
## Phase 5 Complete — Backend Implementation Plan

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/05-backend-implementation-plan.md

**Files to Create:** {n} new files
**Files to Modify:** {n} existing files

**Implementation Order:**
1. Domain entity + enum
2. EF Core configuration
3. DbContext update
4. DTOs ({n} files)
5. Validators ({n} files)
6. Repository
7. Service
8. Controller
9. Permission constants
10. DI registration
11. Migration

**Migration Command:**
dotnet ef migrations add Add{Feature} ...

**Estimated Complexity:** [Low | Medium | High]

**Blockers:**
- ...

**Next Step:** Phase 6 — Backend Coding
Use skill: .ai/skills/06-backend-coding.md
```
