# Frontend Codebase Structure

Framework: Next.js 15 App Router, React 19. Package manager: **pnpm only**.

## Directory Layout

```
accounting_web/src/
├── app/                        ← Next.js App Router pages
│   ├── layout.tsx              ← root layout (providers, fonts)
│   ├── page.tsx                ← root redirect → /dashboard or /login
│   ├── providers.tsx           ← QueryClientProvider, Toaster, theme
│   ├── (auth)/
│   │   ├── layout.tsx          ← centered card layout for login
│   │   └── login/page.tsx
│   └── (app)/
│       ├── layout.tsx          ← AppShell (Sidebar + Topbar) + AuthGuard
│       ├── dashboard/page.tsx
│       ├── categories/
│       │   └── suppliers/
│       │       ├── page.tsx    ← SupplierListPage
│       │       └── [id]/page.tsx ← SupplierDetailPage
│       └── suppliers/page.tsx  ← legacy route alias
├── modules/                    ← feature modules (use this, NOT src/features/)
│   ├── auth/
│   │   ├── api/auth.api.ts
│   │   ├── components/LoginForm.tsx
│   │   └── hooks/useLogin.ts, useLogout.ts, useCurrentUser.ts
│   └── suppliers/
│       ├── supplier.types.ts
│       ├── supplier.schema.ts  ← Zod validation schemas
│       ├── supplier.api.ts     ← API calls via api.get/post/put/delete
│       ├── supplier.keys.ts    ← TanStack Query key factories
│       ├── useSuppliers.ts     ← all useQuery / useMutation hooks
│       ├── components/         ← SupplierForm, SupplierTable, SupplierFormDialog, ...
│       ├── pages/              ← SupplierListPage, SupplierDetailPage
│       └── index.ts            ← public exports
├── components/
│   ├── grid/                   ← DataGrid, EditableGrid, GridToolbar, PaginationBar, states
│   ├── layout/                 ← AppShell, Sidebar, Topbar, UserMenu, TenantSwitcher, Breadcrumb
│   ├── permission/             ← <Can> component
│   ├── auth/                   ← AuthGuard, PermissionGuard
│   └── ui/                     ← Radix UI wrappers (Button, Dialog, Select, Input, Card, ...)
├── stores/
│   ├── auth.store.ts           ← Zustand: user profile, isAuthenticated
│   ├── tenant.store.ts         ← Zustand (persisted): tenantId, companyId, branchId, fiscalYearId
│   └── company.store.ts        ← Zustand: active company metadata
├── hooks/
│   └── usePermissions.ts       ← can(perm), canAny(perms[]), canAll(perms[])
├── lib/
│   ├── api/
│   │   ├── client.ts           ← Axios instance with auth + tenant interceptors
│   │   ├── error.ts            ← fromAxiosError → AppError
│   │   └── query-client.ts     ← TanStack QueryClient config
│   ├── auth/
│   │   ├── token.ts            ← tokenStorage (localStorage access/refresh tokens)
│   │   └── permissions.ts      ← permission helpers
│   ├── env.ts                  ← validated env vars (NEXT_PUBLIC_API_BASE_URL)
│   └── utils/                  ← cn (tailwind merge), format (currency, date)
├── config/
│   ├── permissions.ts          ← PERMISSIONS constants (frontend mirror of backend Permissions.cs)
│   └── routes.ts               ← NAV_GROUPS for sidebar navigation
└── types/
    ├── api.types.ts            ← PageResult<T>, PageRequest, ApiId
    ├── auth.types.ts           ← User, AuthResponse
    └── tenant.types.ts         ← TenantContext, TenantSummary
```

## Key Entry Points

| File | Role |
|------|------|
| [src/lib/api/client.ts](../../accounting_web/src/lib/api/client.ts) | Central Axios client — all API calls go through `api.get/post/put/delete` |
| [src/stores/tenant.store.ts](../../accounting_web/src/stores/tenant.store.ts) | Active tenant context, persisted in localStorage |
| [src/config/permissions.ts](../../accounting_web/src/config/permissions.ts) | Permission string constants — use these, not magic strings |
| [src/config/routes.ts](../../accounting_web/src/config/routes.ts) | Navigation groups and route definitions |
| [src/hooks/usePermissions.ts](../../accounting_web/src/hooks/usePermissions.ts) | `can()`, `canAny()`, `canAll()` hooks |
| [src/components/grid/DataGrid.tsx](../../accounting_web/src/components/grid/DataGrid.tsx) | AG Grid wrapper — use this instead of importing AG Grid directly |

## Implemented Modules

| Module | Location | Status |
|--------|----------|--------|
| Auth | `src/modules/auth/` | Complete (login, logout, current user) |
| Suppliers | `src/modules/suppliers/` | Complete (list, create, update, delete, export, bulk ops) |
