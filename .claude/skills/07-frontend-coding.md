# Skill 07 — Frontend Coding

## Role

Senior React Frontend Engineer, TypeScript Specialist.

## Goal

Implement frontend source code theo Frontend Basic Design (Phase 1), API Contract (Phase 3) và Frontend Implementation Plan (Phase 4). API Contract là source of truth tuyệt đối cho field names, endpoint URLs, query params và response shapes.

---

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/03-api-contract-review.md`
- `docs/features/{feature-name}/04-frontend-implementation-plan.md`
- Project structure thực tế của `accounting_web/`

---

## Output

Frontend source code files trong `accounting_web/`.

---

## Pre-coding Checklist

Trước khi tạo bất kỳ file nào, phải:

- [ ] Đọc cấu trúc thư mục thực tế của `accounting_web/src/`
- [ ] Xác định pattern tổ chức features (feature-based hay layer-based)
- [ ] Xác định Axios instance đang dùng (path, interceptors)
- [ ] Xác định permission hook/context pattern đang dùng
- [ ] Xác định tenant context pattern đang dùng
- [ ] Xác định toast/notification system đang dùng
- [ ] Xác định shared components: EmptyState, ErrorAlert, LoadingSkeleton
- [ ] Xác định router setup (React Router v6+)
- [ ] Xác định React Query version và QueryClient setup
- [ ] Xác định AG Grid hoặc TanStack Table (đọc package.json)
- [ ] API Contract (Phase 3) đã được approved
- [ ] Backend API đã running hoặc MSW mock đã chuẩn bị

---

## Implementation Order (Bắt buộc)

```
1.  Types (TypeScript interfaces/types)
2.  Constants (query keys, labels, column defs, defaults)
3.  API Service (Axios service layer)
4.  Query Key Factory
5.  React Query Hooks (useQuery, useMutation)
6.  Mock Data / MSW Handlers
7.  Leaf Components (SummaryCards, Filter, Toolbar)
8.  Grid/Table Component
9.  Form Dialog/Drawer
10. Detail Panel (nếu có)
11. Page Component (wire up everything)
12. Route Registration
13. Permission-based UI
14. Loading / Empty / Error States
15. URL Query Params Sync
```

---

## Coding Rules (Bắt buộc)

### General

- Tất cả file frontend phải nằm trong `accounting_web/`.
- Không được sửa bất kỳ file nào trong `accounting_api/`.
- Không được sửa file ngoài phạm vi feature (trừ routes và sidebar).
- Đọc project structure thực tế trước khi tạo file.

### TypeScript

- Không dùng `any` khi có thể định nghĩa type cụ thể.
- Interface names phải khớp với API Contract DTO names (camelCase cho fields).
- Export mọi type/interface từ types file.
- Không import type từ file không cùng feature (trừ shared types).

### API Service Layer

- Không gọi Axios trực tiếp trong component.
- Không gọi Axios trực tiếp trong hook.
- Mọi API call phải thông qua service function trong `services/{feature}Api.ts`.
- Dùng shared Axios instance — không tạo Axios instance mới.
- Endpoint URL phải khớp chính xác với API Contract (không tự đoán).
- Không hard-code base URL.
- Không hard-code tenantId trong URL.

### React Query

- Mọi data fetching phải dùng `useQuery` hoặc `useMutation`.
- Query key phải chứa `tenantId` — tự động refetch khi đổi tenant.
- Query key phải chứa filter params — cache per filter combination.
- Invalidate cache sau mọi mutation (`queryClient.invalidateQueries`).
- Handle `isLoading`, `isError`, `error` từ useQuery.
- Không fetch data trong `useEffect` trực tiếp.

### State Management

- Filter state và pagination state sync với URL query params.
- Dùng `useSearchParams` từ React Router.
- Modal state (open/close) quản lý bằng `useState` trong Page component.
- Không dùng global state (Redux/Zustand) cho feature-local state.

### Multi-tenant

- Không hard-code tenantId ở bất kỳ đâu.
- Lấy tenantId từ tenant context/hook.
- Query key phải có tenantId là phần tử đầu tiên hoặc sớm nhất.
- Khi tenant thay đổi, React Query tự động refetch do query key thay đổi.

### Permission

- Không hard-code permission strings.
- Dùng permission constants hoặc enum.
- Dùng permission hook để check: `const { can } = usePermission()`.
- Ẩn button (không chỉ disable) nếu không có permission.
- Handle 403 từ API → hiện PermissionDenied state.

### Error Handling

- Mọi API error phải hiện toast notification.
- Validation errors từ API phải hiện dưới form fields.
- Network errors phải hiện ErrorAlert với retry button.
- 401 phải redirect về login page.
- 403 phải hiện PermissionDenied state.

### Performance

- Dùng `useCallback` và `useMemo` khi cần tránh re-render không cần thiết.
- AG Grid column defs nên là constant (không tạo mới mỗi render).
- Không load toàn bộ data — luôn dùng server-side pagination.

---

## Template: Types File

```typescript
// accounting_web/src/features/{feature}/types/{feature}.types.ts

// Enum từ API Contract
export enum {Feature}Status {
  Active = 'active',
  Inactive = 'inactive',
}

// List item — khớp với API Contract Section 7.1
export interface {Feature}ListItem {
  id: string;
  code: string;
  name: string;
  status: {Feature}Status;
  // ... fields từ API Contract
  createdAt: string;
  updatedAt: string | null;
}

// Detail — khớp với API Contract Section 7.2
export interface {Feature}Detail extends {Feature}ListItem {
  // extra detail fields
}

// Create request — khớp với API Contract Section 7.3
export interface Create{Feature}Input {
  code: string;
  name: string;
  // ...
}

// Update request — khớp với API Contract Section 7.4
export interface Update{Feature}Input {
  name: string;
  // ...
}

// Query params — khớp với API Contract Section 6.1
export interface {Feature}ListQuery {
  keyword?: string;
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: {Feature}Status;
}

// Summary — khớp với API Contract Section 7.5
export interface {Feature}Summary {
  totalCount: number;
  // ...
}

// Pagination response wrapper
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Array<{ field: string; message: string }>;
  traceId: string;
}
```

---

## Template: API Service

```typescript
// accounting_web/src/features/{feature}/services/{feature}Api.ts
import { axiosInstance } from '@/lib/axios'; // shared instance
import type {
  {Feature}ListQuery,
  {Feature}ListItem,
  {Feature}Detail,
  Create{Feature}Input,
  Update{Feature}Input,
  ApiResponse,
  PaginatedResult,
} from '../types/{feature}.types';

const BASE = (tenantId: string) => `/api/${tenantId}/{resource}`;

export const {feature}Api = {
  getList: (tenantId: string, query: {Feature}ListQuery) =>
    axiosInstance.get<ApiResponse<PaginatedResult<{Feature}ListItem>>>(BASE(tenantId), { params: query }),

  getDetail: (tenantId: string, id: string) =>
    axiosInstance.get<ApiResponse<{Feature}Detail>>(`${BASE(tenantId)}/${id}`),

  create: (tenantId: string, data: Create{Feature}Input) =>
    axiosInstance.post<ApiResponse<{Feature}Detail>>(BASE(tenantId), data),

  update: (tenantId: string, id: string, data: Update{Feature}Input) =>
    axiosInstance.put<ApiResponse<{Feature}Detail>>(`${BASE(tenantId)}/${id}`, data),

  delete: (tenantId: string, id: string) =>
    axiosInstance.delete<ApiResponse<boolean>>(`${BASE(tenantId)}/${id}`),

  bulkDelete: (tenantId: string, ids: string[]) =>
    axiosInstance.post<ApiResponse<{ deletedCount: number }>>(`${BASE(tenantId)}/bulk-delete`, { ids }),

  export: (tenantId: string, query: {Feature}ListQuery) =>
    axiosInstance.get(`${BASE(tenantId)}/export`, {
      params: query,
      responseType: 'blob',
    }),
};
```

---

## Template: Query Keys & Hooks

```typescript
// accounting_web/src/features/{feature}/hooks/use{Feature}List.ts
import { useQuery } from '@tanstack/react-query';
import { useTenant } from '@/contexts/TenantContext';
import { {feature}Api } from '../services/{feature}Api';
import type { {Feature}ListQuery } from '../types/{feature}.types';

export const {feature}Keys = {
  all: (tenantId: string) => ['{feature}', tenantId] as const,
  lists: (tenantId: string) => [...{feature}Keys.all(tenantId), 'list'] as const,
  list: (tenantId: string, query: {Feature}ListQuery) =>
    [...{feature}Keys.lists(tenantId), query] as const,
  detail: (tenantId: string, id: string) =>
    [...{feature}Keys.all(tenantId), 'detail', id] as const,
};

export function use{Feature}List(query: {Feature}ListQuery) {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: {feature}Keys.list(tenantId, query),
    queryFn: () => {feature}Api.getList(tenantId, query).then(r => r.data),
    enabled: !!tenantId,
  });
}

// Mutations
export function useCreate{Feature}() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  const toast = useToast(); // hoặc pattern toast của project

  return useMutation({
    mutationFn: (data: Create{Feature}Input) =>
      {feature}Api.create(tenantId, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {feature}Keys.all(tenantId) });
      toast.success('Thêm mới thành công');
    },
    onError: (error) => {
      toast.error('Thêm mới thất bại');
    },
  });
}
```

---

## Template: Page Component

```typescript
// accounting_web/src/features/{feature}/pages/{Feature}ListPage.tsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';
import { {Feature}Toolbar } from '../components/{Feature}Toolbar';
import { {Feature}Filter } from '../components/{Feature}Filter';
import { {Feature}Grid } from '../components/{Feature}Grid';
import { {Feature}Form } from '../components/{Feature}Form';
import { use{Feature}List } from '../hooks/use{Feature}List';
import type { {Feature}ListQuery } from '../types/{feature}.types';
import { PERMISSIONS } from '../constants/{feature}.constants';

export function {Feature}ListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { can } = usePermission();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const query: {Feature}ListQuery = {
    keyword: searchParams.get('keyword') ?? undefined,
    pageIndex: Number(searchParams.get('pageIndex') ?? 1),
    pageSize: Number(searchParams.get('pageSize') ?? 20),
    sortBy: searchParams.get('sortBy') ?? 'createdAt',
    sortDirection: (searchParams.get('sortDirection') as 'asc' | 'desc') ?? 'desc',
  };

  const { data, isLoading, isError, error, refetch } = use{Feature}List(query);

  const handleFilterChange = (updates: Partial<{Feature}ListQuery>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null) next.delete(k);
      else next.set(k, String(v));
    });
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Summary Cards */}

      {/* Toolbar */}
      <{Feature}Toolbar
        selectedIds={selectedIds}
        canCreate={can(PERMISSIONS.CREATE)}
        canDelete={can(PERMISSIONS.DELETE)}
        canExport={can(PERMISSIONS.EXPORT)}
        onAdd={() => setFormOpen(true)}
        onRefresh={refetch}
      />

      {/* Filter */}
      <{Feature}Filter query={query} onChange={handleFilterChange} />

      {/* Grid */}
      <{Feature}Grid
        data={data?.data?.items ?? []}
        totalCount={data?.data?.totalCount ?? 0}
        loading={isLoading}
        error={isError ? error : null}
        query={query}
        onQueryChange={handleFilterChange}
        onSelectionChange={setSelectedIds}
        onEdit={(id) => { setEditingId(id); setFormOpen(true); }}
      />

      {/* Form Dialog */}
      {formOpen && (
        <{Feature}Form
          id={editingId}
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditingId(null); }}
        />
      )}
    </div>
  );
}
```

---

## File Path Rules

| Type | Path Pattern |
|------|-------------|
| Types | `accounting_web/src/features/{feature}/types/{feature}.types.ts` |
| Constants | `accounting_web/src/features/{feature}/constants/{feature}.constants.ts` |
| API Service | `accounting_web/src/features/{feature}/services/{feature}Api.ts` |
| Hooks | `accounting_web/src/features/{feature}/hooks/use{Feature}*.ts` |
| Mock | `accounting_web/src/features/{feature}/mocks/{feature}.mock.ts` |
| Components | `accounting_web/src/features/{feature}/components/{Component}.tsx` |
| Pages | `accounting_web/src/features/{feature}/pages/{Feature}ListPage.tsx` |
| Tests | `accounting_web/src/features/{feature}/tests/{Component}.test.tsx` |

---

## Checklist Trước Khi Báo Cáo Hoàn Thành

- [ ] Đã đọc project structure thực tế trước khi tạo file
- [ ] Mọi type/interface khớp chính xác với API Contract
- [ ] Không có `any` type không cần thiết
- [ ] API service endpoint URLs khớp chính xác với API Contract
- [ ] Query keys chứa tenantId
- [ ] Mutations invalidate cache đúng cách
- [ ] Page component xử lý loading, empty, error states
- [ ] Permission check trước mọi action button
- [ ] URL query params sync với filter state
- [ ] Không hard-code tenantId ở bất kỳ đâu
- [ ] Không hard-code permission strings
- [ ] Không có file nào tạo trong `accounting_api/`
- [ ] Route đã được đăng ký

---

## Final Report Format

```
## Phase 7 Complete — Frontend Coding

**Feature:** {feature-name}

### Files Created

| File | Description |
|------|-------------|
| accounting_web/src/features/{feature}/types/... | TypeScript types |
| accounting_web/src/features/{feature}/services/... | API service |
| ... | ... |

### Files Modified

| File | Change |
|------|--------|
| accounting_web/src/router/routes.tsx | Added {Feature} route |
| ... | ... |

### API Integration

| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /api/{t}/{r} | ✅ Implemented | |
| POST /api/{t}/{r} | ✅ Implemented | |
| ... | ... | ... |

### Assumptions
1. ...

### Remaining TODOs
- [ ] ...

### How to Run
1. Start backend: ...
2. Start frontend: cd accounting_web && npm run dev
3. Navigate to: http://localhost:5173/{tenantId}/{resource}

**Next Step:** Phase 8 — Backend Testing
Use skill: .ai/skills/08-backend-testing.md
```
