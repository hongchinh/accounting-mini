# Backend Coding Conventions

## Namespace

All code uses `AccountingApi.*` namespaces — never `Accounting.*`:

```csharp
namespace AccountingApi.Application.Features.Suppliers.Commands.CreateSupplier;
namespace AccountingApi.Domain.Entities;
namespace AccountingApi.Infrastructure.Persistence;
```

## No Service Layer

Logic lives in MediatR handlers. Do not create `IService` or `IRepository` abstractions. The handler is the use-case boundary.

## Result Pattern (Never Throw for Business Errors)

```csharp
// Return errors as values
public async Task<Result<SupplierDto>> Handle(...)
{
    if (duplicate) return SupplierErrors.DuplicateCode;  // Error.Conflict(...)
    if (notFound) return SupplierErrors.NotFound;         // Error.NotFound(...)
    return SupplierDto.From(entity);
}
```

Define errors in static classes per domain area:

```csharp
// Domain/Errors/SupplierErrors.cs
public static class SupplierErrors
{
    public static readonly Error NotFound = Error.NotFound("supplier.not_found", "Supplier not found.");
    public static readonly Error DuplicateCode = Error.Conflict("supplier.duplicate_code", "Code already exists.");
}
```

## Endpoints (Minimal API, Not Controllers)

```csharp
public class SupplierEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suppliers")
            .WithTags("Suppliers")
            .RequireAuthorization(Permissions.SupplierView);

        group.MapGet("/", GetList).WithName("GetSupplierList");
        group.MapPost("/", Create).WithName("CreateSupplier");
    }

    private static async Task<IResult> GetList(
        [AsParameters] GetSuppliersQuery query,
        ISender sender, CancellationToken ct)
        => (await sender.Send(query, ct)).Match(Results.Ok, ApiResults.Problem);
}
```

Endpoints are auto-discovered — no manual registration in `Program.cs`.

## Permission Authorization

Add new constants to `src/Shared/Constants/Permissions.cs` and they auto-seed on startup:

```csharp
// In Permissions.cs
public const string SupplierView = "supplier.view";

// On endpoint
group.MapGet("/", GetList).RequireAuthorization(Permissions.SupplierView);
// OR
.WithMetadata(new HasPermissionAttribute(Permissions.SupplierView));
```

## Transactional Commands

Implement `ITransactionalRequest` to enable the transaction pipeline behavior:

```csharp
public record CreateSupplierCommand(...) : IRequest<Result<SupplierDto>>, ITransactionalRequest;
```

## Pagination Shape

Backend always returns:

```json
{ "items": [], "total": 100, "page": 1, "pageSize": 20 }
```

Use `PaginatedList<T>` from `AccountingApi.Shared.Pagination`. Field names:
- `total` (not `totalCount`)
- `page` (not `pageIndex`)
- `sortDir` (not `sortDirection`)

## Entity Conventions

New entities should implement:
- `ITenantEntity` — automatic tenant isolation via query filter
- `ISoftDelete` — soft-delete via `IsDeleted` flag (interceptor handles it)
- Extend `AuditableEntity` — auto-populated `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`

EF Core only supports one `HasQueryFilter` per entity type. `AppDbContext` combines tenant + soft-delete predicates automatically — do not add a second filter in `IEntityTypeConfiguration<T>`.

## EF Naming Convention

All columns use `snake_case` via `.UseSnakeCaseNamingConvention()`. No manual `[Column]` attributes needed for standard fields.

## Code Quality

`Directory.Build.props` enforces globally:
- `Nullable = enable` — nullable warnings fail the build
- `EnforceCodeStyleInBuild = true`

Package versions are centrally managed in `Directory.Packages.props` — add `<PackageVersion>` there and reference without a version in individual `.csproj` files.

## Migration Workflow

```bash
# Add migration
./scripts/migrate.sh add {MigrationName}

# Apply pending
./scripts/migrate.sh update

# Generate idempotent SQL for production
./scripts/migrate.sh script migration.sql
```

EF CLI source project: `src/Infrastructure`, startup project: `src/Api`.
