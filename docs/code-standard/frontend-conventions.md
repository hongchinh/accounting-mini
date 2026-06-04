# Frontend Coding Conventions

## Module Structure

All feature code lives under `src/modules/{feature}/` — never `src/features/`:

```
src/modules/suppliers/
├── supplier.types.ts      ← TypeScript interfaces
├── supplier.schema.ts     ← Zod schemas for form validation
├── supplier.api.ts        ← API calls using api.get/post/put/delete
├── supplier.keys.ts       ← TanStack Query key factories
├── useSuppliers.ts        ← useQuery / useMutation hooks
├── components/            ← feature-specific components
├── pages/                 ← full page components
└── index.ts               ← public re-exports
```

## API Client

Always use `api` from `@/lib/api/client`, never raw `fetch` or `axios` directly:

```typescript
import { api } from '@/lib/api/client';

const data = await api.get<PageResult<Supplier>>('/api/suppliers');
const created = await api.post<Supplier>('/api/suppliers', payload);
```

The client automatically attaches `Authorization` and all tenant headers. Never pass `tenantId` in URLs or params.

## TanStack Query Patterns

Define keys in a `{feature}.keys.ts` file:

```typescript
export const supplierKeys = {
  all: (tid: string) => ['suppliers', tid] as const,
  lists: (tid: string) => [...supplierKeys.all(tid), 'list'] as const,
  list: (tid: string, q: SupplierListQuery) => [...supplierKeys.lists(tid), q] as const,
  detail: (tid: string, id: string) => [...supplierKeys.all(tid), 'detail', id] as const,
};
```

Always include `tenantId` in query keys so cache invalidates automatically when the user switches tenant.

Hooks must be guarded with `enabled: !!tenantId`:

```typescript
return useQuery({
  queryKey: supplierKeys.list(tid, query),
  queryFn: () => supplierApi.list(query),
  enabled: !!tenantId,
});
```

## Pagination Types

```typescript
import type { PageResult, PageRequest } from '@/types/api.types';

// Correct field names
interface PageResult<T> { items: T[]; total: number; page: number; pageSize: number; }
interface PageRequest { page?: number; pageSize?: number; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc'; }
```

Do not use: `totalCount`, `pageIndex`, `keyword`, `sortDirection`.

## Form Validation

Use React Hook Form + Zod. Define schemas in `{feature}.schema.ts`:

```typescript
export const createSupplierSchema = z.object({
  code: z.string().min(1, 'Mã không được để trống').max(50),
  name: z.string().min(1, 'Tên không được để trống').max(200),
});

// In component
const form = useForm<CreateSupplierInput>({ resolver: zodResolver(createSupplierSchema) });
```

## Permission Checks

Import constants from `src/config/permissions.ts` — never use raw strings:

```typescript
import { PERMISSIONS } from '@/config/permissions';

// Hook
const { can } = usePermissions();
if (!can(PERMISSIONS.Supplier.Create)) return null;

// Component
<Can permission={PERMISSIONS.Supplier.Create}>
  <Button>Thêm mới</Button>
</Can>
```

## Tenant Context

Read tenant context from the Zustand store, never from URL params:

```typescript
import { useTenantStore } from '@/stores/tenant.store';
const { tenantId, companyId } = useTenantStore();
```

## Toast Notifications

Use `sonner` (already configured globally in `providers.tsx`):

```typescript
import { toast } from 'sonner';
toast.success('Thêm mới thành công');
toast.error('Có lỗi xảy ra');
```

## UI Layout Constraints

### Màn hình danh sách (List screens)

- **Header luôn render** — không ẩn header khi data rỗng hoặc đang loading.
- **Header và pagination footer luôn trong viewport** — dùng flex column layout, data body là scrollable flex child.
- **Data body scroll, header và footer không scroll**.

```tsx
<div className="flex flex-col h-full">
  <ListHeader />                          {/* always visible */}
  <div className="flex-1 overflow-auto">  {/* scrollable body */}
    <DataGrid ... />
  </div>
  <PaginationBar />                       {/* always visible */}
</div>
```

### Màn hình thêm mới / chỉnh sửa (Add/Edit screens)

- **Tất cả trường nhập liệu phải hiển thị trong viewport** — không để form overflow dọc.
- **Dùng multi-column layout** (`grid-cols-2` hoặc `grid-cols-3`) thay vì single-column khi số field nhiều.
- Điều chỉnh label/input size và spacing để giảm chiều cao tổng thể nếu cần.

---

## Grid Components

Use `<DataGrid>` from `@/components/grid` — do not import AG Grid directly:

```typescript
import { DataGrid } from '@/components/grid';
```

Available grid components: `DataGrid`, `EditableGrid`, `GridToolbar`, `PaginationBar`, `GridEmptyState`, `GridErrorState`, `GridLoadingState`.

## Error Handling

The Axios interceptor normalizes all API errors to `AppError`. In mutations:

```typescript
try {
  await api.post('/api/suppliers', data);
  toast.success('Thêm mới thành công');
} catch (err) {
  toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
}
```

## Routing

Routes are defined in `src/config/routes.ts` and used by the Sidebar. When adding a new route, also add a `NavItem` entry there. Authenticated routes go under `src/app/(app)/`, auth routes under `src/app/(auth)/`.
