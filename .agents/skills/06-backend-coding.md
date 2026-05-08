# Skill 06 — Backend Coding

## Role

Senior .NET Backend Engineer, Clean Architecture Practitioner.

## Goal

Implement backend source code theo Backend Basic Design (Phase 2), API Contract (Phase 3) và Backend Implementation Plan (Phase 5). Tuân thủ Clean Architecture, multi-tenant, permission, FluentValidation.

---

## Input

- `docs/features/{feature-name}/02-backend-basic-design.md`
- `docs/features/{feature-name}/03-api-contract-review.md`
- `docs/features/{feature-name}/05-backend-implementation-plan.md`
- Project structure thực tế của `accounting_api/`

---

## Output

Backend source code files trong `accounting_api/`.

---

## Pre-coding Checklist

Trước khi tạo bất kỳ file nào, phải:

- [ ] Đọc cấu trúc thư mục thực tế của `accounting_api/src/`
- [ ] Xác định đúng root namespace (vd: `Accounting`, `AccountingMini`, `CompanyName.AccountingMini`)
- [ ] Xác định folder structure thực tế của từng layer
- [ ] Xác định base classes đã có sẵn (BaseEntity, AuditableEntity, etc.)
- [ ] Xác định ICurrentTenantService, ICurrentUserService interface
- [ ] Xác định ApiResponse<T>, PaginatedResult<T> types
- [ ] Xác định global exception handler setup
- [ ] Xác định permission policy registration pattern
- [ ] API Contract (Phase 3) đã được reviewed và approved

---

## Implementation Order (Bắt buộc)

```
1.  Domain Entity
2.  Domain Enum(s)
3.  EF Core Configuration
4.  DbContext Update (add DbSet)
5.  DTOs (List query, ListItem, Detail, Create request, Update request, Summary, Bulk)
6.  FluentValidation Validators
7.  Repository Interface (Application layer)
8.  Repository Implementation (Infrastructure layer)
9.  Service Interface (Application layer)
10. Service Implementation (Application layer)
11. Controller (Api layer)
12. Permission Constants (Domain or Application layer)
13. Dependency Injection Registration
14. Export Service (nếu có export feature)
15. Seed Data (nếu cần)
16. Migration Command (chạy sau khi code xong)
```

---

## Required Output Format (per file)

Mỗi file tạo ra phải có:

```csharp
// File: accounting_api/src/{Namespace}.{Layer}/{Path}/{FileName}.cs
// Purpose: {one-line description}
```

---

## Coding Rules (Bắt Buộc)

### General

- Tất cả file backend phải nằm trong `accounting_api/`.
- Không được sửa bất kỳ file nào trong `accounting_web/`.
- Không được sửa file ngoài phạm vi feature (trừ DI registration và DbContext).
- Dùng đúng namespace của project thực tế.

### Architecture

- Follow Clean Architecture: Domain → Application → Infrastructure → Api.
- Không đặt business logic trong Controller.
- Không đặt business logic trong Repository.
- Không expose EF Entity trực tiếp trong API response.
- Controller chỉ được gọi Service, không gọi Repository trực tiếp.

### Async

- Mọi method trong Service và Repository phải là `async Task<T>`.
- Luôn truyền `CancellationToken ct` vào mọi async method.
- Dùng `await` đúng cách — không `.Result` hay `.Wait()`.

### DTOs

- Luôn dùng DTO cho request và response.
- DTO phải khớp chính xác với API Contract (field names, types).
- Không thêm field thừa không có trong API Contract.
- Không dùng `dynamic` hay `object` cho response.

### Validation

- Dùng FluentValidation cho mọi request DTO.
- Validator phải cover mọi rule trong API Contract Section 10.
- Return chuẩn error response khi validation fails.
- Inject IValidator và validate trong Service (không validate trong Controller).

### Multi-tenant

- Không bao giờ hard-code tenantId.
- Lấy tenantId từ `ICurrentTenantService`.
- Mọi query Entity Framework phải có `WHERE TenantId = currentTenantId`.
- Trước khi Update hoặc Delete: verify `entity.TenantId == currentTenantId`.
- Global query filter trên DbContext ưu tiên hơn per-query filter.

### Permission

- Mọi Controller endpoint phải có `[Authorize(Policy = Permissions.{Feature}.{Action})]`.
- Không hard-code permission string trong Controller — dùng Permissions constants class.
- 401 khi missing/expired JWT.
- 403 khi valid JWT nhưng thiếu permission.

### Response Format

Dùng chuẩn ApiResponse<T>:

```csharp
// Success
return Ok(ApiResponse<T>.Success(data));

// Created
return CreatedAtAction(..., ApiResponse<T>.Success(data));

// Validation Error
return BadRequest(ApiResponse<T>.Fail("Validation failed", errors));

// Not Found
return NotFound(ApiResponse<T>.Fail("Not found"));

// Forbidden
return Forbid();
```

### Security

- Không raw SQL — luôn dùng EF Core LINQ.
- Không string concatenation trong queries.
- DTO pattern prevents mass assignment.
- Validate và sanitize mọi input từ user.

### Performance

- Dùng `AsNoTracking()` cho read-only queries.
- Dùng `Select()` projection thay vì load full entity cho list.
- Implement server-side pagination cho mọi list endpoint.
- Không load tất cả records vào memory.

---

## Template: Domain Entity

```csharp
namespace {Namespace}.Domain.Entities;

public class {Entity} : BaseEntity  // hoặc implement IAuditableEntity nếu project dùng
{
    public Guid TenantId { get; set; }

    // Business properties
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    // ... (theo API Contract)

    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }

    // Audit (nếu BaseEntity chưa có)
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
```

---

## Template: EF Core Configuration

```csharp
namespace {Namespace}.Infrastructure.Persistence.Configurations;

public class {Entity}Configuration : IEntityTypeConfiguration<{Entity}>
{
    public void Configure(EntityTypeBuilder<{Entity}> builder)
    {
        builder.ToTable("{Entities}");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        // Unique index: code per tenant
        builder.HasIndex(e => new { e.TenantId, e.Code })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        // Global query filter (soft delete + tenant)
        // NOTE: TenantId filter thường được implement qua CurrentTenantService
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}
```

---

## Template: Repository Implementation

```csharp
namespace {Namespace}.Infrastructure.Persistence.Repositories;

public class {Feature}Repository : I{Feature}Repository
{
    private readonly AppDbContext _db;
    private readonly ICurrentTenantService _tenantService;

    public {Feature}Repository(AppDbContext db, ICurrentTenantService tenantService)
    {
        _db = db;
        _tenantService = tenantService;
    }

    public async Task<PaginatedResult<{Feature}ListItemDto>> GetListAsync(
        {Feature}ListQuery query,
        CancellationToken ct)
    {
        var tenantId = _tenantService.TenantId;

        var q = _db.{Entities}
            .AsNoTracking()
            .Where(e => e.TenantId == tenantId);

        // Apply keyword search
        if (!string.IsNullOrWhiteSpace(query.Keyword))
            q = q.Where(e => e.Name.Contains(query.Keyword) || e.Code.Contains(query.Keyword));

        // Apply filters
        if (query.Status.HasValue)
            q = q.Where(e => e.Status == query.Status.Value);

        // Apply sorting
        q = query.SortDirection == "asc"
            ? q.OrderBy(e => EF.Property<object>(e, query.SortBy ?? "CreatedAt"))
            : q.OrderByDescending(e => EF.Property<object>(e, query.SortBy ?? "CreatedAt"));

        var totalCount = await q.CountAsync(ct);

        var items = await q
            .Skip((query.PageIndex - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(e => new {Feature}ListItemDto
            {
                // Map fields from API Contract
            })
            .ToListAsync(ct);

        return PaginatedResult<{Feature}ListItemDto>.Create(items, totalCount, query.PageIndex, query.PageSize);
    }
}
```

---

## Template: Service Implementation

```csharp
namespace {Namespace}.Application.{Feature}.Services;

public class {Feature}Service : I{Feature}Service
{
    private readonly I{Feature}Repository _repo;
    private readonly IValidator<Create{Feature}Request> _createValidator;
    private readonly IValidator<Update{Feature}Request> _updateValidator;
    private readonly ICurrentTenantService _tenantService;
    private readonly ICurrentUserService _userService;

    public async Task<ApiResponse<PaginatedResult<{Feature}ListItemDto>>> GetListAsync(
        {Feature}ListQuery query,
        CancellationToken ct)
    {
        var result = await _repo.GetListAsync(query, ct);
        return ApiResponse<PaginatedResult<{Feature}ListItemDto>>.Success(result);
    }

    public async Task<ApiResponse<{Feature}DetailDto>> CreateAsync(
        Create{Feature}Request request,
        CancellationToken ct)
    {
        var validation = await _createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
            return ApiResponse<{Feature}DetailDto>.Fail("Validation failed",
                validation.Errors.Select(e => new ApiError(e.PropertyName, e.ErrorMessage)));

        var tenantId = _tenantService.TenantId;
        var userId = _userService.UserId;

        // Check duplicate
        if (await _repo.IsCodeExistsAsync(request.Code, tenantId, null, ct))
            return ApiResponse<{Feature}DetailDto>.Fail("Code already exists",
                new[] { new ApiError("code", "Mã đã tồn tại trong hệ thống") });

        var entity = new {Entity}
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId,
            // map from request
        };

        await _repo.AddAsync(entity, ct);

        var detail = await _repo.GetDetailAsync(entity.Id, tenantId, ct);
        return ApiResponse<{Feature}DetailDto>.Success(detail!);
    }
}
```

---

## Template: Controller

```csharp
namespace {Namespace}.Api.Controllers;

[ApiController]
[Route("api/{tenantId:guid}/[controller]")]
[Authorize]
public class {Feature}Controller : ControllerBase
{
    private readonly I{Feature}Service _service;

    public {Feature}Controller(I{Feature}Service service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.{Feature}.View)]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<{Feature}ListItemDto>>), 200)]
    public async Task<IActionResult> GetList(
        [FromQuery] {Feature}ListQuery query,
        CancellationToken ct)
    {
        var result = await _service.GetListAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permissions.{Feature}.View)]
    public async Task<IActionResult> GetDetail(Guid id, CancellationToken ct)
    {
        var result = await _service.GetDetailAsync(id, ct);
        if (result.Data == null) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = Permissions.{Feature}.Create)]
    public async Task<IActionResult> Create([FromBody] Create{Feature}Request request, CancellationToken ct)
    {
        var result = await _service.CreateAsync(request, ct);
        if (!result.Success) return BadRequest(result);
        return CreatedAtAction(nameof(GetDetail), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permissions.{Feature}.Update)]
    public async Task<IActionResult> Update(Guid id, [FromBody] Update{Feature}Request request, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, request, ct);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Permissions.{Feature}.Delete)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _service.DeleteAsync(id, ct);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("bulk-delete")]
    [Authorize(Policy = Permissions.{Feature}.Delete)]
    public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteRequest request, CancellationToken ct)
    {
        var result = await _service.BulkDeleteAsync(request, ct);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("export")]
    [Authorize(Policy = Permissions.{Feature}.Export)]
    public async Task<IActionResult> Export([FromQuery] {Feature}ListQuery query, CancellationToken ct)
    {
        var fileResult = await _service.ExportAsync(query, ct);
        return fileResult;
    }
}
```

---

## File Path Rules

| Layer | Path Pattern |
|-------|-------------|
| Domain Entity | `accounting_api/src/{NS}.Domain/Entities/{Entity}.cs` |
| Domain Enum | `accounting_api/src/{NS}.Domain/Enums/{Entity}Status.cs` |
| Application DTO | `accounting_api/src/{NS}.Application/{Feature}/Dtos/{Dto}.cs` |
| Application Validator | `accounting_api/src/{NS}.Application/{Feature}/Validators/{Validator}.cs` |
| Application Service Interface | `accounting_api/src/{NS}.Application/{Feature}/Services/I{Feature}Service.cs` |
| Application Service Impl | `accounting_api/src/{NS}.Application/{Feature}/Services/{Feature}Service.cs` |
| Infrastructure Config | `accounting_api/src/{NS}.Infrastructure/Persistence/Configurations/{Entity}Configuration.cs` |
| Infrastructure Repository | `accounting_api/src/{NS}.Infrastructure/Persistence/Repositories/{Feature}Repository.cs` |
| Api Controller | `accounting_api/src/{NS}.Api/Controllers/{Feature}Controller.cs` |
| Unit Tests | `accounting_api/tests/{NS}.UnitTests/{Feature}/{Feature}ServiceTests.cs` |
| Integration Tests | `accounting_api/tests/{NS}.IntegrationTests/{Feature}/{Feature}ControllerTests.cs` |

---

## Checklist Trước Khi Báo Cáo Hoàn Thành

- [ ] Đã đọc project structure thực tế trước khi tạo file
- [ ] Domain entity có đủ TenantId, audit fields, soft delete
- [ ] EF config có global query filter, indexes, unique constraint
- [ ] DbContext đã thêm DbSet
- [ ] Mọi DTO khớp chính xác với API Contract
- [ ] FluentValidation validator cover đủ rules
- [ ] Repository luôn filter by tenantId
- [ ] Service lấy tenantId từ ICurrentTenantService (không từ request)
- [ ] Controller có [Authorize] trên class và permission policy trên mỗi action
- [ ] DI registration đã thêm
- [ ] Permission constants đã thêm
- [ ] Migration command đã chuẩn bị
- [ ] Không có file nào tạo trong `accounting_web/`

---

## Final Report Format

```
## Phase 6 Complete — Backend Coding

**Feature:** {feature-name}

### Files Created

| File | Layer | Description |
|------|-------|-------------|
| accounting_api/src/... | Domain | Entity |
| accounting_api/src/... | Domain | Enum |
| ... | ... | ... |

### Files Modified

| File | Change |
|------|--------|
| accounting_api/src/.../AppDbContext.cs | Added DbSet<{Entity}> |
| accounting_api/src/.../DependencyInjection.cs | Registered repository + service |
| ... | ... |

### Migration Command

\```bash
dotnet ef migrations add Add{Feature} \
  --project accounting_api/src/{NS}.Infrastructure \
  --startup-project accounting_api/src/{NS}.Api
dotnet ef database update \
  --project accounting_api/src/{NS}.Infrastructure \
  --startup-project accounting_api/src/{NS}.Api
\```

### Assumptions
1. ...

### Remaining TODOs
- [ ] ...

### How to Run
1. Run migration: ...
2. Start API: dotnet run --project accounting_api/src/{NS}.Api
3. Test via Swagger: https://localhost:{port}/swagger

**Next Step:** Phase 7 — Frontend Coding
Use skill: .ai/skills/07-frontend-coding.md
```
