# Multi-Tenancy Architecture

AccountingMini uses a **shared-database, shared-schema** multi-tenant model by default, with per-tenant isolation configurable at the Tenant entity level.

## Isolation Modes

The `Tenant.IsolationMode` field controls data separation:

| Mode | Description |
|------|-------------|
| `SharedDatabaseSharedSchema` | All tenants in one DB, filtered by `tenant_id` column (default) |
| `SeparateSchema` | Each tenant gets its own Postgres schema (`SchemaName`) |
| `SeparateDatabase` | Each tenant has a dedicated DB (`ConnectionString`) |

EF Core enforces row-level isolation automatically via `HasQueryFilter` in `AppDbContext`. Every entity implementing `ITenantEntity` gets a combined query filter (tenant + soft-delete). SuperAdmin users bypass this via `IsSuperAdmin` check in the filter predicate.

## Tenant Resolution (Per Request)

`TenantResolutionMiddleware` runs after Authentication and before Authorization:

```
UseRouting → UseAuthentication → TenantResolutionMiddleware → UseAuthorization → Endpoint
```

Resolution priority: JWT claim → `X-Tenant-Id` header → route param → query string.

Endpoints that skip tenant resolution (no `400 tenant.not_resolved`):
- `/api/auth/*`
- `/api/platform/*` (SuperAdmin)
- `/health/*`, `/swagger`, `/openapi`, `/hangfire`
- Any endpoint decorated with `[AllowAnonymousTenant]`

SuperAdmin users (`IsSuperAdmin = true`) can call tenant-scoped endpoints without a resolved tenant context.

## Tenant Context Headers (Frontend → Backend)

The Axios client attaches these headers on every request, sourced from `useTenantStore` (Zustand, persisted in localStorage):

| Header | Purpose |
|--------|---------|
| `X-Tenant-Id` | Which tenant the user is operating in |
| `X-Company-Id` | Active company within the tenant |
| `X-Branch-Id` | Active branch |
| `X-Fiscal-Year-Id` | Active fiscal year |

Tenant context is never embedded in route paths (no `/api/{tenantId}/...` pattern).

## EF Core Data Guards

Three layers enforce tenant isolation at the data path:

1. **`HasQueryFilter`** — EF global query filter, applied automatically to all `ITenantEntity` types in `AppDbContext.OnModelCreating`
2. **`TenantInterceptor`** — Sets `TenantId` on `SaveChanges` for new entities, blocks cross-tenant writes
3. **`TenantedDapperContext.TenantIdOrThrow`** — Raw Dapper queries must go through this scoped context, which validates tenant before executing

Bypass: SuperAdmin + explicit `IgnoreQueryFilters()` call.

## Tenant Lifecycle

```
Trialing → Active → Suspended → Cancelled
```

Suspended tenants receive `403` from `TenantResolutionMiddleware` (even with a valid JWT).

## User ↔ Tenant Relationship

- A `User` is platform-global (email unique across the platform)
- A user joins a tenant via `TenantMembership` (userId + tenantId + roleId)
- `User.LastTenantId` caches the most-recently-used tenant, used during login auto-selection
- `User.IsSuperAdmin` is a boolean flag, not a role — SuperAdmins bypass all tenant filters
