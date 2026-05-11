# Product Goals & Business Context

## What Is AccountingMini

AccountingMini is a multi-tenant accounting SaaS application targeting Vietnamese SMEs. It provides bookkeeping, master-data management (suppliers, customers), and eventually journal entries, invoicing, and payment workflows.

The "Mini" qualifier reflects a focused MVP scope: the system supports essential accounting operations without the full complexity of enterprise ERP systems like MISA or KiotViet (which are used as UI/UX references during design phases).

## Multi-Tenancy Model

Each customer organization is a **Tenant**. A user can belong to multiple tenants and switch between them without logging out. Within a tenant, the accounting context is further scoped by:

- **Company** — legal entity (one tenant may have multiple companies)
- **Branch** — physical or logical branch of a company
- **Fiscal Year** — accounting period

These four dimensions are passed as headers on every API request and stored in the browser via `useTenantStore`.

## Tenant Lifecycle

New tenants start in `Trialing` status. The platform operator activates, suspends, or cancels tenants via platform-admin endpoints. Suspended tenants are blocked at the middleware layer before any business logic executes.

## Current Feature Scope

| Feature | Status |
|---------|--------|
| Authentication (login, register, refresh, email verification) | Complete |
| Tenant management (create, activate, suspend) | Complete (admin only) |
| Supplier master data (CRUD, bulk ops, export) | Complete |
| Customer master data | Planned |
| Journal entries | Planned |
| Invoicing | Planned |
| Payments | Planned |

## User Roles

| Role | Scope | Capabilities |
|------|-------|-------------|
| SuperAdmin | Platform-wide | Manage tenants, run migrations, bypass all tenant filters |
| Owner | Per-tenant | Full tenant management including member roles |
| Admin | Per-tenant | Most feature operations |
| Member | Per-tenant | Feature-level permissions granted by Admin/Owner |

Permissions are fine-grained strings (e.g., `supplier.create`, `invoice.approve`). The set of permissions for a role is configurable per tenant.

## Business Language

The application is written for Vietnamese users. UI labels, error messages, and documentation use Vietnamese (tiếng Việt). Code, API paths, and technical documentation use English.
