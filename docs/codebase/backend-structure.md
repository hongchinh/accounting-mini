# Backend Codebase Structure

Solution file: `accounting_api/AccountingApi.sln`

> The root folder contains a legacy `accounting_api.sln` / `Program.cs` from `dotnet new webapi`. Ignore it. Always use `AccountingApi.sln` and `src/`.

## Project Layout

```
accounting_api/
├── AccountingApi.sln
├── src/
│   ├── Api/                         ← AccountingApi.Api (executable)
│   │   ├── Endpoints/               ← IEndpoint implementations (auto-discovered)
│   │   ├── Middleware/              ← TenantResolutionMiddleware, GlobalExceptionMiddleware
│   │   ├── OpenApi/                 ← SwaggerConfiguration
│   │   └── Program.cs              ← composition root
│   ├── Application/                 ← AccountingApi.Application
│   │   ├── Common/
│   │   │   ├── Behaviors/           ← MediatR pipeline behaviors
│   │   │   └── Interfaces/          ← ICurrentUser, ICurrentTenantAccessor, IUnitOfWork, etc.
│   │   └── Features/                ← vertical slices
│   │       ├── Auth/
│   │       ├── Suppliers/
│   │       ├── Tenants/
│   │       └── Admin/
│   ├── Domain/                      ← AccountingApi.Domain (no external dependencies)
│   │   ├── Common/                  ← BaseEntity, AuditableEntity, ITenantEntity, ISoftDelete
│   │   ├── Entities/                ← User, Tenant, TenantMembership, Supplier, Role, Permission, ...
│   │   ├── Enums/                   ← TenantStatus, UserStatus
│   │   ├── Errors/                  ← AuthErrors, TenantErrors (static Error factories)
│   │   ├── Events/                  ← domain events (UserRegisteredDomainEvent, etc.)
│   │   └── ValueObjects/            ← Email, TenantCode
│   ├── Infrastructure/              ← AccountingApi.Infrastructure
│   │   ├── Caching/                 ← InMemoryCacheService, RedisCacheService
│   │   ├── Identity/                ← JWT, HasPermissionAttribute, PermissionPolicyProvider
│   │   ├── Messaging/               ← HangfireBackgroundJobService, OutboxProcessor
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Configurations/      ← IEntityTypeConfiguration<T> per entity
│   │   │   ├── Interceptors/        ← Audit, Tenant, SoftDelete, DomainEvents
│   │   │   ├── Migrations/          ← EF migrations (managed via scripts/migrate.sh)
│   │   │   └── Seeders/             ← InitialDataSeeder (permissions + roles + superadmin)
│   │   ├── Security/                ← PasswordHasher, JwtTokenService
│   │   └── Tenancy/                 ← TenantConnectionResolver, TenantProvider, TenantResolver
│   └── Shared/                      ← AccountingApi.Shared (no project dependencies)
│       ├── Constants/               ← Permissions.cs (permission catalog), SystemRoles
│       ├── Pagination/              ← PaginatedList<T>
│       └── Result/                  ← Result<T>, Error, ValidationError
├── tests/
│   ├── AccountingApi.UnitTests/     ← no DB, fast
│   └── AccountingApi.IntegrationTests/ ← Testcontainers Postgres, requires Docker
├── scripts/
│   ├── migrate.sh                   ← Linux/Mac migration wrapper
│   └── migrate.ps1                  ← Windows migration wrapper
└── docker-compose.yml               ← Postgres 17 + Redis
```

## Key Entry Points

| File | Role |
|------|------|
| [src/Api/Program.cs](../../accounting_api/src/Api/Program.cs) | App composition root — registers services, middleware, runs migrations |
| [src/Api/Endpoints/IEndpoint.cs](../../accounting_api/src/Api/Endpoints/IEndpoint.cs) | Interface + auto-discovery for all endpoints |
| [src/Infrastructure/Persistence/AppDbContext.cs](../../accounting_api/src/Infrastructure/Persistence/AppDbContext.cs) | EF DbContext with combined query filters |
| [src/Shared/Constants/Permissions.cs](../../accounting_api/src/Shared/Constants/Permissions.cs) | Canonical permission catalog — add new permissions here |
| [src/Infrastructure/DependencyInjection.cs](../../accounting_api/src/Infrastructure/DependencyInjection.cs) | Infrastructure service registration |

## Vertical Slice Convention

Each feature lives entirely within one folder:

```
src/Application/Features/{Area}/
├── Commands/{Name}/
│   ├── {Name}Command.cs          ← IRequest<Result<T>>
│   ├── {Name}CommandHandler.cs   ← IRequestHandler
│   └── {Name}CommandValidator.cs ← AbstractValidator (auto-run by pipeline)
└── Queries/{Name}/
    ├── {Name}Query.cs
    ├── {Name}QueryHandler.cs
    └── {Name}QueryValidator.cs   ← optional
```

Each area can also have a `Dtos/` folder for shared DTOs within that feature.

## Currently Implemented Features

| Area | Commands | Queries |
|------|----------|---------|
| `Auth` | Login, Register, RefreshToken, Logout, RevokeToken, SwitchTenant, ChangePassword, ForgotPassword, ResetPassword, VerifyEmail | GetCurrentUser |
| `Suppliers` | CreateSupplier, UpdateSupplier, DeleteSupplier, ToggleSupplierActive, CloneSupplier, BulkUpdateSupplierAddress | GetSuppliers, GetSupplierById, ExportSuppliers |
| `Tenants` | CreateTenant, UpdateTenant, ActivateTenant, SuspendTenant | GetTenants |
| `Admin` | RunMigrations | — |
