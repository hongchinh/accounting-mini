# CLAUDE.md — AccountingMini

Project guide cho Claude Code khi làm việc trong monorepo này.

---

## Project Overview

**AccountingMini** là ứng dụng kế toán multi-tenant gồm hai sub-projects:

| Sub-project | Stack | Path |
|-------------|-------|------|
| `accounting_api` | .NET 9, Minimal API, MediatR, EF Core, PostgreSQL | `accounting_api/` |
| `accounting_web` | Next.js 15, React 19, TanStack Query v5, AG Grid | `accounting_web/` |

Mỗi sub-project có CLAUDE.md riêng. CLAUDE.md này là tài liệu **root-level** — tập trung vào quy trình AI Workflow, cross-project conventions và những điểm khác biệt quan trọng so với các AI skill default.



**Ignore:** `accounting_api/CLAUDE.md`, `accounting_api/AGENTS.md`, `accounting_web/.claude/`, `accounting_api/.agents/`, `accounting_api/.cursor/`, `accounting_web/.agent/`
**Reason:** Each sub-project has its own agent config; loading them here causes conflicts and wastes context

---

## AI Workflow

### Command

```
/fullstack-feature-workflow {feature-key}
```

Ví dụ:

```
/fullstack-feature-workflow danh-muc-nha-cung-cap
```

AI sẽ tự:
1. Tìm `docs/features/*/config.yaml` match với `feature: {feature-key}`
2. Đọc config và input folders
3. Detect phase tiếp theo chưa complete
4. Chạy đúng phase đó

### Skill files

Tất cả skill nằm tại `.claude/skills/`. Skill chính:

| File | Mục đích |
|------|---------|
| `.claude/skills/fullstack-feature-workflow.md` | Master workflow — 22 sections rules |
| `.claude/skills/01-frontend-basic-design.md` | Phase 1: UI/UX analysis |
| `.claude/skills/02-backend-basic-design.md` | Phase 2: Domain + DB design |
| `.claude/skills/03-backend-api-contract-review.md` | Phase 3: API Contract (source of truth) |
| `.claude/skills/04-frontend-implementation-plan.md` | Phase 4: Frontend coding plan |
| `.claude/skills/05-backend-implementation-plan.md` | Phase 5: Backend coding plan |
| `.claude/skills/06-backend-coding.md` | Phase 6: Backend implementation |
| `.claude/skills/07-frontend-coding.md` | Phase 7: Frontend implementation |
| `.claude/skills/08-backend-testing.md` | Phase 8: Backend tests |
| `.claude/skills/09-frontend-testing.md` | Phase 9: Frontend tests |
| `.claude/skills/10-integration-testing.md` | Phase 10: Integration tests |

### Feature config template

```
.claude/templates/feature-config.template.yaml
```

Copy vào `docs/features/{folder}/config.yaml` để tạo feature mới.

### Input folders (per feature)

```
docs/features/{folder}/
├── config.yaml
├── images/                    ← ảnh UI hiện tại cần implement
└── references/
    ├── images/               ← ảnh UI tham khảo (MISA, KiotViet...)
    └── markdown/             ← tài liệu nghiệp vụ tham khảo
```

### Phase completion marker

Mỗi phase document phải có:

```markdown
## Phase Status
Status: Completed
```

Phase 3 dùng:

```markdown
## Approval Status
Status: Approved
```

---

## Critical Differences from Skill Defaults

Các AI skill được viết generic — các điểm sau **override** skill defaults cho project này:

### Backend

#### 1. Architecture pattern: Vertical Slice + MediatR (NOT service layer)

Skill mặc định mô tả `IService` + `IRepository`. Project này dùng **Vertical Slice Architecture**:

```
src/Application/Features/{Area}/
├── Commands/
│   └── {Name}/
│       ├── {Name}Command.cs        ← IRequest<Result<T>>
│       ├── {Name}CommandHandler.cs ← IRequestHandler
│       └── {Name}CommandValidator.cs ← AbstractValidator (auto-run by pipeline)
└── Queries/
    └── {Name}/
        ├── {Name}Query.cs
        ├── {Name}QueryHandler.cs
        └── {Name}QueryValidator.cs (nếu cần)
```

MediatR pipeline behaviors (chạy theo thứ tự): `Validation → Logging → Transaction → Performance → UnhandledException`

**Không tạo `IService` / `IRepository` riêng — logic nằm trong Handler.**

#### 2. Endpoints: IEndpoint (Minimal API, NOT Controllers)

```csharp
// src/Api/Endpoints/{Feature}Endpoints.cs
public class SupplierEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suppliers")
            .WithTags("Suppliers")
            .RequireAuthorization();

        group.MapGet("/", GetList)
            .WithName("GetSupplierList");
    }

    private static async Task<IResult> GetList(
        [AsParameters] GetSuppliersQuery query,
        ISender sender,
        CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result.Match(Results.Ok, ApiResults.Problem);
    }
}
```

Endpoints **auto-discovered** — không cần register thủ công.

#### 3. Result pattern (NOT ApiResponse<T>)

Project dùng `Result<T>` từ `AccountingApi.Shared.Result`:

```csharp
// Handler trả về Result<T>
public async Task<Result<SupplierDto>> Handle(GetSupplierQuery query, CancellationToken ct)
{
    var supplier = await db.Suppliers.FindAsync(query.Id, ct);
    if (supplier is null) return Error.NotFound("supplier.not_found", "Supplier not found");
    return SupplierDto.From(supplier);
}

// Endpoint dùng .Match()
return result.Match(Results.Ok, ApiResults.Problem);
```

**Không dùng `ApiResponse<T>` wrapper.**

#### 4. Database: PostgreSQL (NOT SQL Server)

```bash
# docker-compose.yml
docker compose up -d postgres redis

# Connection string (default)
"Host=localhost;Database=postgres;Username=postgres;Password=1"
```

Migrations dùng script:

```bash
./scripts/migrate.sh add {MigrationName}
./scripts/migrate.sh update
```

#### 5. Namespace: `AccountingApi` (NOT `Accounting`)

```csharp
namespace AccountingApi.Application.Features.Suppliers.Commands.CreateSupplier;
namespace AccountingApi.Domain.Entities;
namespace AccountingApi.Infrastructure.Persistence;
```

#### 6. Tenant context: via Header (NOT route param)

Tenant **không** nằm trong route (`/api/{tenantId}/...`). Thay vào đó:

```
X-Tenant-Id: {tenantId}     ← gắn tự động bởi Axios client
X-Company-Id: {companyId}
X-Branch-Id: {branchId}
X-Fiscal-Year-Id: {fiscalYearId}
```

`TenantResolutionMiddleware` đọc header sau khi authenticate. Query filter dùng `ITenantEntity`.

#### 7. Permission attribute: `[HasPermission]`

```csharp
// Thêm permission mới vào:
// src/Shared/Constants/Permissions.cs
public const string SupplierView = "supplier.view";
public const string SupplierCreate = "supplier.create";

// Dùng trong endpoint:
group.MapGet("/", GetList).RequireAuthorization(Permissions.SupplierView);
// hoặc:
group.MapGet("/", GetList).WithMetadata(new HasPermissionAttribute(Permissions.SupplierView));
```

Permissions được seed tự động bởi `InitialDataSeeder` khi app khởi động ở Development.

#### 8. Transactional command

```csharp
// Đánh dấu command để transaction behavior wrap nó
public record CreateSupplierCommand(...) : IRequest<Result<SupplierDto>>, ITransactionalRequest;
```

#### 9. Pagination response shape

Backend trả về `PaginatedList<T>`:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

Fields: `total` (không phải `totalCount`), `page` (không phải `pageIndex`).

---

### Frontend

#### 1. Framework: Next.js 15 App Router (NOT Vite + React Router)

```
src/app/
├── (app)/          ← authenticated routes
│   └── layout.tsx  ← AppShell wrapper
├── (auth)/         ← login page
└── layout.tsx      ← root layout
```

Routing dùng Next.js file system — **không có React Router**.

#### 2. Module structure: `src/modules/{feature}/` (NOT `src/features/`)

```
src/modules/suppliers/
├── components/
│   ├── SupplierForm.tsx
│   └── SupplierTable.tsx
├── pages/
│   └── SupplierListPage.tsx
├── supplier.api.ts
├── supplier.schema.ts    ← zod schemas
├── supplier.types.ts
├── useSuppliers.ts
└── index.ts
```

**Luôn đặt module mới vào `src/modules/`, không phải `src/features/`.**

#### 3. API client: `apiClient` từ `@/lib/api/client`

```typescript
import { api } from '@/lib/api/client';

// Convenience wrappers (trả về T trực tiếp, không cần .data)
const data = await api.get<PageResult<Supplier>>('/api/suppliers');
const created = await api.post<Supplier>('/api/suppliers', payload);
```

- Tự động attach `Authorization` header từ token storage
- Tự động attach `X-Tenant-Id` / `X-Company-Id` / `X-Branch-Id` / `X-Fiscal-Year-Id` từ `useTenantStore`
- Tự động refresh token khi 401
- Không cần truyền `tenantId` vào URL

#### 4. Pagination type: `PageResult<T>`

```typescript
// src/types/api.types.ts
export interface PageResult<T> {
  items: T[];
  total: number;       // không phải totalCount
  page: number;        // không phải pageIndex
  pageSize: number;
}

export interface PageRequest {
  page?: number;
  pageSize?: number;
  search?: string;     // không phải keyword
  sortBy?: string;
  sortDir?: 'asc' | 'desc';  // không phải sortDirection
}
```

#### 5. Tenant context: Zustand store (NOT context/hook returning tenantId for URL)

```typescript
import { useTenantStore } from '@/stores/tenant.store';

// Đọc tenant context
const { tenantId, companyId } = useTenantStore();

// Tenant được gắn tự động vào mọi API request qua Axios interceptor
// KHÔNG cần gắn thủ công vào URL hoặc query key như skill mặc định mô tả
```

Query key vẫn nên chứa `tenantId` để tự invalidate khi switch tenant:

```typescript
const queryKey = ['suppliers', tenantId, query] as const;
```

#### 6. Permission check: `usePermissions()` hook và `<Can>` component

```typescript
// Hook
import { usePermissions } from '@/hooks/usePermissions';

const { can, canAny } = usePermissions();
const canCreate = can('supplier.create');

// Component
import { Can } from '@/components/permission/Can';

<Can permission="supplier.create">
  <Button>Thêm mới</Button>
</Can>
```

**Không hard-code permission string inline — dùng constants từ `src/config/permissions.ts`.**

#### 7. Form validation: React Hook Form + Zod

```typescript
// supplier.schema.ts
import { z } from 'zod';

export const createSupplierSchema = z.object({
  code: z.string().min(1, 'Mã không được để trống').max(50),
  name: z.string().min(1, 'Tên không được để trống').max(200),
  taxCode: z.string().optional(),
});

// Component
const form = useForm<CreateSupplierInput>({
  resolver: zodResolver(createSupplierSchema),
});
```

**Không dùng FluentValidation-style validation trong frontend — dùng Zod.**

#### 8. Toast notifications: Sonner

```typescript
import { toast } from 'sonner';

toast.success('Thêm mới thành công');
toast.error('Có lỗi xảy ra');
```

Sonner `<Toaster>` đã được mount trong `src/app/providers.tsx`.

#### 9. Package manager: pnpm

```bash
cd accounting_web
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
```

**Không dùng `npm` hay `yarn` trong project này.**

#### 10. Grid: AG Grid (không phải TanStack Table)

Shared components đã có:

```
src/components/grid/
├── DataGrid.tsx         ← wrapper chính
├── EditableGrid.tsx
├── GridEmptyState.tsx
├── GridErrorState.tsx
├── GridLoadingState.tsx
└── GridToolbar.tsx
```

**Dùng `<DataGrid>` thay vì import AG Grid trực tiếp.**

---

## Development Commands

### Backend

```bash
cd accounting_api

# Start dependencies
docker compose up -d postgres redis

# Run API (auto-migrates + seeds ở Development)
dotnet run --project src/Api/AccountingApi.Api.csproj
# → https://localhost:7100/swagger

# Build
dotnet build AccountingApi.sln

# Tests
dotnet test AccountingApi.sln
dotnet test tests/AccountingApi.UnitTests/AccountingApi.UnitTests.csproj     # unit (no DB)
dotnet test tests/AccountingApi.IntegrationTests/AccountingApi.IntegrationTests.csproj  # cần Docker

# Migrations
./scripts/migrate.sh add {MigrationName}
./scripts/migrate.sh update
./scripts/migrate.sh list
```

**Lưu ý:** Root folder có `accounting_api.sln` và `Program.cs` cũ — **bỏ qua**. Dùng `AccountingApi.sln` trong `accounting_api/`.

### Frontend

```bash
cd accounting_web

pnpm install
pnpm dev         # → http://localhost:3000
pnpm build
pnpm lint
pnpm type-check

# Tests
pnpm test        # Vitest (unit + component)
pnpm test:watch
pnpm test:e2e    # Playwright
pnpm test:e2e:ui
```

---

## Project Structure (Actual)

```
ACCOUNTINGMINI/
├── accounting_api/
│   ├── AccountingApi.sln          ← real solution file
│   ├── src/
│   │   ├── Api/                   ← AccountingApi.Api — Minimal API endpoints, middleware
│   │   │   ├── Endpoints/         ← IEndpoint implementations (auto-discovered)
│   │   │   ├── Middleware/        ← TenantResolutionMiddleware, GlobalExceptionMiddleware
│   │   │   └── Program.cs
│   │   ├── Application/           ← AccountingApi.Application — MediatR handlers, validators
│   │   │   ├── Common/
│   │   │   │   ├── Behaviors/     ← Validation, Logging, Transaction, Performance
│   │   │   │   └── Interfaces/    ← ICurrentUser, ICurrentTenantAccessor, IUnitOfWork...
│   │   │   └── Features/          ← Vertical slices (Area/Commands|Queries/Name/)
│   │   ├── Domain/                ← AccountingApi.Domain — Entities, enums, domain events
│   │   ├── Infrastructure/        ← AccountingApi.Infrastructure — EF Core, Hangfire, JWT, email
│   │   │   └── Persistence/
│   │   │       ├── AppDbContext.cs
│   │   │       ├── Configurations/
│   │   │       ├── Migrations/
│   │   │       ├── Interceptors/  ← Audit, SoftDelete, Tenant, DomainEvents
│   │   │       └── Seeders/
│   │   └── Shared/                ← AccountingApi.Shared — Result<T>, Error, Permissions, PaginatedList
│   │       ├── Constants/
│   │       │   └── Permissions.cs ← permission catalog — thêm permission mới vào đây
│   │       ├── Pagination/
│   │       └── Result/
│   ├── tests/
│   │   ├── AccountingApi.UnitTests/
│   │   └── AccountingApi.IntegrationTests/
│   ├── scripts/
│   │   ├── migrate.sh
│   │   └── migrate.ps1
│   └── docker-compose.yml
│
├── accounting_web/
│   ├── src/
│   │   ├── app/                   ← Next.js App Router
│   │   │   ├── (app)/            ← authenticated routes
│   │   │   └── (auth)/           ← login
│   │   ├── components/
│   │   │   ├── grid/             ← DataGrid, GridToolbar, Empty/Error/Loading states
│   │   │   ├── layout/           ← AppShell, Sidebar, Topbar, TenantSwitcher
│   │   │   ├── permission/       ← <Can> component
│   │   │   └── ui/               ← Radix UI wrappers (Button, Dialog, Select...)
│   │   ├── modules/              ← feature modules (auth, suppliers...)
│   │   │   └── {feature}/
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── {feature}.api.ts
│   │   │       ├── {feature}.schema.ts
│   │   │       ├── {feature}.types.ts
│   │   │       └── use{Feature}s.ts
│   │   ├── stores/               ← Zustand stores
│   │   │   ├── auth.store.ts
│   │   │   ├── tenant.store.ts   ← tenantId, companyId, branchId, fiscalYearId
│   │   │   └── company.store.ts
│   │   ├── hooks/
│   │   │   └── usePermissions.ts ← can(), canAny(), canAll()
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts     ← apiClient (Axios) — auto-attach auth + tenant headers
│   │   │   │   ├── error.ts      ← fromAxiosError → AppError
│   │   │   │   └── query-client.ts
│   │   │   └── auth/
│   │   │       ├── permissions.ts
│   │   │       └── token.ts
│   │   ├── config/
│   │   │   ├── permissions.ts    ← permission constants (frontend mirror)
│   │   │   └── routes.ts
│   │   └── types/
│   │       ├── api.types.ts      ← PageResult<T>, PageRequest, ApiId
│   │       ├── auth.types.ts
│   │       └── tenant.types.ts
│   └── package.json              ← pnpm, Next.js 15, React 19
│
├── docs/
│   └── features/
│       └── {feature-folder}/
│           ├── config.yaml
│           ├── images/
│           ├── references/
│           │   ├── images/
│           │   └── markdown/
│           └── {phase-docs}.md
│
└── .claude/
    ├── skills/                   ← AI workflow skills
    └── templates/
        └── feature-config.template.yaml
```

---

## Key Conventions

### Adding a new feature (backend)

1. Thêm permission constants vào `src/Shared/Constants/Permissions.cs`
2. Tạo Command/Query trong `src/Application/Features/{Area}/Commands|Queries/{Name}/`
3. Tạo Endpoint trong `src/Api/Endpoints/`
4. Tạo EF configuration trong `src/Infrastructure/Persistence/Configurations/`
5. Chạy migration: `./scripts/migrate.sh add {Name}`

Entity phải implement:
- `ITenantEntity` — để global query filter lọc theo tenant
- `ISoftDelete` — nếu cần soft delete
- Base class có audit fields

### Adding a new feature (frontend)

1. Tạo folder: `src/modules/{feature}/`
2. Tạo: `{feature}.types.ts`, `{feature}.schema.ts`, `{feature}.api.ts`, `use{Feature}s.ts`
3. Tạo components trong `src/modules/{feature}/components/`
4. Tạo page trong `src/modules/{feature}/pages/`
5. Thêm route vào `src/app/(app)/`
6. Thêm permission constants vào `src/config/permissions.ts`

### Pagination

Backend trả về và frontend expect:

```typescript
// Đúng
{ items: T[], total: number, page: number, pageSize: number }

// Không dùng
{ items: T[], totalCount: number, pageIndex: number, pageSize: number }
```

Query params:

```typescript
// Đúng
{ search: string, page: number, pageSize: number, sortBy: string, sortDir: 'asc' | 'desc' }

// Không dùng
{ keyword: string, pageIndex: number, sortDirection: 'asc' | 'desc' }
```

### Error handling (backend)

```csharp
// Không throw exception — trả về Error
public static class SupplierErrors
{
    public static readonly Error NotFound = Error.NotFound("supplier.not_found", "Supplier not found.");
    public static readonly Error DuplicateCode = Error.Conflict("supplier.duplicate_code", "Code already exists.");
}

// Trong handler:
if (exists) return SupplierErrors.DuplicateCode;
```

### Error handling (frontend)

```typescript
// fromAxiosError() chuyển đổi AxiosError → AppError
// Dùng trong React Query onError hoặc try/catch
try {
  await api.post('/api/suppliers', data);
  toast.success('Thêm mới thành công');
} catch (err) {
  // err là AppError (đã được normalize bởi Axios interceptor)
  toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
}
```

---

## Common Gotchas

| Gotcha | Detail |
|--------|--------|
| Legacy solution file | `accounting_api/accounting_api.sln` là file cũ — dùng `AccountingApi.sln` |
| No controllers | Backend dùng `IEndpoint` (Minimal API), không có `ApiController` |
| No service layer | Logic nằm trong MediatR Handler, không có `IService` |
| Result, not ApiResponse | Backend trả `Result<T>` — endpoint dùng `.Match()` để convert sang HTTP response |
| PostgreSQL, not SQL Server | Connection string dùng Npgsql, không phải SqlServer |
| Next.js, not Vite | Frontend là Next.js 15 App Router — routing theo file system |
| pnpm only | Dùng `pnpm`, không dùng `npm install` hay `yarn` |
| Module path | `src/modules/`, không phải `src/features/` |
| Tenant via header | `X-Tenant-Id` header, không phải route param `/api/{tenantId}/` |
| Pagination fields | `total` / `page` / `sortDir`, không phải `totalCount` / `pageIndex` / `sortDirection` |
| Single query filter | EF Core chỉ cho 1 `HasQueryFilter` per entity — tenant + soft delete được combine trong `AppDbContext` |
| Hangfire schema | Hangfire tables trong schema `hangfire` riêng — không model trong EF |


Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.