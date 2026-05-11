# AccountingMini — Documentation

Multi-tenant accounting SaaS for Vietnamese SMEs. Two sub-projects: `accounting_api` (.NET 9 Minimal API + MediatR + EF Core + PostgreSQL) and `accounting_web` (Next.js 15 App Router + TanStack Query + AG Grid).

---

## Architecture

System design, tenant model, auth flows, and cross-cutting infrastructure.

| File | Description |
|------|-------------|
| [multi-tenancy.md](architecture/multi-tenancy.md) | Tenant isolation modes, per-request resolution middleware, EF query filters, tenant lifecycle |
| [auth-flow.md](architecture/auth-flow.md) | JWT contents, refresh token rotation, login/switch-tenant flow, authorization layers |
| [backend-pipeline.md](architecture/backend-pipeline.md) | MediatR pipeline behaviors (Validation → Logging → Transaction → Performance), Result pattern, EF interceptors |

---

## Codebase

Directory layout, entry points, and key modules for each sub-project.

| File | Description |
|------|-------------|
| [backend-structure.md](codebase/backend-structure.md) | .NET solution layout, project layers, vertical slice convention, implemented features |
| [frontend-structure.md](codebase/frontend-structure.md) | Next.js app structure, module pattern, stores, shared components, implemented modules |

---

## Code Standard

Conventions, patterns, and development commands the team follows.

| File | Description |
|------|-------------|
| [backend-conventions.md](code-standard/backend-conventions.md) | Namespace rules, Result pattern, endpoint style, permission wiring, entity conventions, EF naming |
| [frontend-conventions.md](code-standard/frontend-conventions.md) | Module structure, API client usage, TanStack Query patterns, Zod schemas, permission components |
| [dev-workflow.md](code-standard/dev-workflow.md) | Setup commands, migration scripts, test commands, AI feature workflow, tech stack versions |

---

## Project PDR

Product goals, business rules, and use-case specifications.

| File | Description |
|------|-------------|
| [product-goals.md](project-pdr/product-goals.md) | Product vision, multi-tenancy model, current feature scope, user roles |
| [supplier-management.md](project-pdr/supplier-management.md) | Supplier feature: use cases, business rules, data fields, API endpoints |

---

## Other

Feature-specific AI workflow documents and design artifacts.

| File | Description |
|------|-------------|
| [features/danh-muc-nha-cung-cap/](features/danh-muc-nha-cung-cap/) | Supplier management feature — design docs, API contract, coding summaries, test plan, visual review |
