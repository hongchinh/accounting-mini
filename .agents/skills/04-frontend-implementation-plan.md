# Skill 04 — Frontend Implementation Plan

## Role

Senior React Frontend Architect.

## Goal

Tạo kế hoạch coding frontend chi tiết dựa trên Frontend Basic Design (Phase 1) và API Contract (Phase 3). Liệt kê đầy đủ file cần tạo/sửa, thứ tự implement, data flow, và API mapping. Không code ở phase này.

---

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/03-api-contract-review.md`

---

## Output

```
docs/features/{feature-name}/04-frontend-implementation-plan.md
```

---

## Required Output Format

```markdown
# Frontend Implementation Plan: {Feature Name}

## 1. Goal

Implement màn hình {Feature Name} theo API Contract đã được approved.

## 2. Scope

### 2.1 In Scope
- ...

### 2.2 Out of Scope
- ...

## 3. Dependencies

### 3.1 Internal Dependencies
- Shared components: ...
- Auth/tenant context: ...
- Permission hooks: ...
- Axios instance: ...

### 3.2 External Dependencies (npm packages)
| Package | Version | Purpose |
|---------|---------|---------|

### 3.3 Backend Dependencies
- Backend API phải available tại: {base_url}
- Endpoints required: (list)

## 4. File Change Plan

> Mọi file path PHẢI bắt đầu bằng `accounting_web/`

### 4.1 New Files

| # | File Path | Description | Priority |
|---|-----------|-------------|----------|
| 1 | `accounting_web/src/features/{feature}/types/{feature}.types.ts` | TypeScript types/interfaces | P0 |
| 2 | `accounting_web/src/features/{feature}/constants/{feature}.constants.ts` | Constants, enum labels, column defs | P0 |
| 3 | `accounting_web/src/features/{feature}/services/{feature}Api.ts` | Axios API service | P0 |
| 4 | `accounting_web/src/features/{feature}/hooks/use{Feature}List.ts` | React Query list hook | P0 |
| 5 | `accounting_web/src/features/{feature}/hooks/use{Feature}Detail.ts` | React Query detail hook | P1 |
| 6 | `accounting_web/src/features/{feature}/hooks/use{Feature}Mutations.ts` | Create/Update/Delete mutations | P0 |
| 7 | `accounting_web/src/features/{feature}/mocks/{feature}.mock.ts` | MSW handlers / mock data | P1 |
| 8 | `accounting_web/src/features/{feature}/components/{Feature}Toolbar.tsx` | Toolbar component | P0 |
| 9 | `accounting_web/src/features/{feature}/components/{Feature}Grid.tsx` | AG Grid component | P0 |
| 10 | `accounting_web/src/features/{feature}/components/{Feature}Filter.tsx` | Filter bar component | P0 |
| 11 | `accounting_web/src/features/{feature}/components/{Feature}Form.tsx` | Add/Edit form dialog | P0 |
| 12 | `accounting_web/src/features/{feature}/components/{Feature}Detail.tsx` | Detail panel/drawer | P1 |
| 13 | `accounting_web/src/features/{feature}/components/{Feature}SummaryCards.tsx` | Summary cards | P1 |
| 14 | `accounting_web/src/features/{feature}/pages/{Feature}ListPage.tsx` | Main page component | P0 |

### 4.2 Modified Files

| # | File Path | Change Description |
|---|-----------|-------------------|
| 1 | `accounting_web/src/router/routes.tsx` | Add route for {Feature}ListPage |
| 2 | `accounting_web/src/navigation/sidebar.ts` | Add sidebar menu item |

### 4.3 File Priority Legend
- **P0:** Must have — feature cannot function without
- **P1:** Should have — required for full feature
- **P2:** Nice to have — enhancement

## 5. Implementation Steps

### Step 1: Types (accounting_web/src/features/{feature}/types/)

Define all TypeScript interfaces matching API Contract DTOs:

```typescript
// {feature}.types.ts
export interface {Feature}ListItem {
  // fields from API Contract Section 7.1
}

export interface {Feature}Detail {
  // fields from API Contract Section 7.2
}

export interface Create{Feature}Input {
  // fields from API Contract Section 7.3
}

export interface Update{Feature}Input {
  // fields from API Contract Section 7.4
}

export interface {Feature}ListQuery {
  keyword?: string;
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  // feature-specific filters
}

export interface {Feature}Summary {
  // fields from API Contract Section 7.5
}
```

**Checklist:**
- [ ] All fields match API Contract exactly (field names, types)
- [ ] No `any` types
- [ ] Enum types defined

---

### Step 2: Constants (accounting_web/src/features/{feature}/constants/)

```typescript
// {feature}.constants.ts
export const {FEATURE}_QUERY_KEYS = { ... }
export const {FEATURE}_PAGE_SIZES = [20, 50, 100]
export const {FEATURE}_DEFAULT_SORT = { sortBy: 'createdAt', sortDirection: 'desc' }
export const {FEATURE}_STATUS_LABELS: Record<{Feature}Status, string> = { ... }
export const {FEATURE}_GRID_COLUMNS: ColDef[] = [ ... ]
```

---

### Step 3: API Service (accounting_web/src/features/{feature}/services/)

Implement Axios service theo API Contract endpoints:

- `get{Feature}List(tenantId, query)` → GET list
- `get{Feature}Detail(tenantId, id)` → GET detail
- `create{Feature}(tenantId, data)` → POST create
- `update{Feature}(tenantId, id, data)` → PUT update
- `delete{Feature}(tenantId, id)` → DELETE
- `bulkDelete{Feature}(tenantId, ids)` → POST bulk-delete
- `export{Feature}(tenantId, query)` → GET export

**Rules:**
- Không gọi API trực tiếp trong component
- Dùng shared Axios instance (với interceptors cho JWT)
- Không hard-code base URL

---

### Step 4: Query Keys & React Query Hooks

Query key factory pattern:

```typescript
export const {feature}Keys = {
  all: (tenantId: string) => ['{feature}', tenantId] as const,
  lists: (tenantId: string) => [...{feature}Keys.all(tenantId), 'list'] as const,
  list: (tenantId: string, query: {Feature}ListQuery) =>
    [...{feature}Keys.lists(tenantId), query] as const,
  detail: (tenantId: string, id: string) =>
    [...{feature}Keys.all(tenantId), 'detail', id] as const,
}
```

Hooks:
- `use{Feature}List(query)` — useQuery với automatic refetch khi tenantId đổi
- `use{Feature}Detail(id)` — useQuery
- `useCreate{Feature}()` — useMutation với cache invalidation
- `useUpdate{Feature}()` — useMutation với cache invalidation
- `useDelete{Feature}()` — useMutation với cache invalidation
- `useBulkDelete{Feature}()` — useMutation

---

### Step 5: Mock Data

```typescript
// {feature}.mock.ts
export const mock{Feature}ListItem: {Feature}ListItem = { ... }
export const mock{Feature}Detail: {Feature}Detail = { ... }
export const mock{Feature}List = Array.from({ length: 20 }, (_, i) => ({
  ...mock{Feature}ListItem,
  id: `id-${i}`,
}))
```

---

### Step 6: Components

Order of implementation:
1. `{Feature}SummaryCards` — độc lập, dễ test
2. `{Feature}Filter` — controlled component, no API calls
3. `{Feature}Toolbar` — buttons, permissions
4. `{Feature}Grid` — AG Grid với column defs
5. `{Feature}Form` — form dialog với React Hook Form
6. `{Feature}Detail` — detail drawer

---

### Step 7: Page Component

```typescript
// {Feature}ListPage.tsx
// Wire up: query state (URL params) + all hooks + all components
// Handle: loading, empty, error
// Manage: modal open/close state
```

---

### Step 8: Route Registration

Add to router:
```typescript
{ path: '/{tenantId}/{feature}', element: <{Feature}ListPage /> }
```

---

### Step 9: Permission Integration

```typescript
const { can } = usePermission();
const canCreate = can('{feature}.create');
const canUpdate = can('{feature}.update');
const canDelete = can('{feature}.delete');
const canExport = can('{feature}.export');
```

---

### Step 10: Loading / Empty / Error States

- Loading: Skeleton rows in grid
- Empty: EmptyState component với message và CTA
- Error: ErrorAlert component với retry button
- No permission: PermissionDenied component

---

### Step 11: URL Query Params

Sync filter state với URL query params:
- keyword, pageIndex, pageSize, sortBy, sortDirection, status, ...
- Dùng `useSearchParams` từ React Router

---

## 6. Data Flow

```
URL Query Params
      ↓
{Feature}ListPage (state manager)
      ↓
use{Feature}List hook (React Query)
      ↓
{feature}Api.get{Feature}List (Axios)
      ↓
GET /api/{tenantId}/{resource}?...
      ↓
ApiResponse<PaginatedResult<{Feature}ListItem>>
      ↓
React Query cache
      ↓
{Feature}Grid / {Feature}SummaryCards (render)
```

---

## 7. API Mapping

| UI Action | Hook | Service Method | Endpoint | Permission |
|-----------|------|----------------|----------|------------|
| Load list | use{Feature}List | get{Feature}List | GET /api/{t}/{r} | {Feature}.View |
| View detail | use{Feature}Detail | get{Feature}Detail | GET /api/{t}/{r}/{id} | {Feature}.View |
| Create | useCreate{Feature} | create{Feature} | POST /api/{t}/{r} | {Feature}.Create |
| Update | useUpdate{Feature} | update{Feature} | PUT /api/{t}/{r}/{id} | {Feature}.Update |
| Delete | useDelete{Feature} | delete{Feature} | DELETE /api/{t}/{r}/{id} | {Feature}.Delete |
| Bulk delete | useBulkDelete{Feature} | bulkDelete{Feature} | POST /api/{t}/{r}/bulk-delete | {Feature}.Delete |
| Export | — | export{Feature} | GET /api/{t}/{r}/export | {Feature}.Export |

---

## 8. Query Key Strategy

- Query key bắt buộc phải chứa `tenantId` để tự động refetch khi đổi tenant.
- Query key chứa full query params để cache per-filter.
- Invalidate by `{feature}Keys.all(tenantId)` sau mọi mutation.

---

## 9. Permission Strategy

- Dùng permission hook/context — không hard-code.
- Hide button nếu không có permission (không chỉ disable).
- Handle 403 từ API → hiện PermissionDenied state.
- Mọi destructive action phải có confirm dialog.

---

## 10. Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Backend API chưa ready | Dùng MSW mock handlers |
| AG Grid license | Kiểm tra license policy |
| Large data set | Server-side pagination bắt buộc |

---

## 11. Checklist Before Coding

- [ ] API Contract (Phase 3) đã được approved
- [ ] Backend Implementation Plan (Phase 5) đã sẵn sàng
- [ ] Shared Axios instance đã có interceptors cho JWT
- [ ] Permission hook/context đã available
- [ ] Tenant context đã available
- [ ] AG Grid (hoặc TanStack Table) đã setup trong project
- [ ] React Query client đã setup
- [ ] Toast/notification system đã available
- [ ] React Hook Form đã install nếu cần form validation
```

---

## Rules

1. **Không code ở phase này.**
2. **Mọi file path frontend phải bắt đầu bằng `accounting_web/`.**
3. Plan phải dùng API Contract (Phase 3) làm source of truth — không tự suy đoán endpoint.
4. Không liệt kê file nào ngoài `accounting_web/`.
5. Query key phải chứa `tenantId`.
6. Phải có mock data plan.
7. Phải có permission strategy.
8. Phải có loading/empty/error state plan.
9. Implementation order phải đúng: types → constants → service → hooks → components → page.

---

## File Path Rules

| Input | Path |
|-------|------|
| Frontend design | `docs/features/{feature-name}/01-frontend-basic-design.md` |
| API Contract | `docs/features/{feature-name}/03-api-contract-review.md` |

| Output | Path |
|--------|------|
| Plan document | `docs/features/{feature-name}/04-frontend-implementation-plan.md` |

**CẤMTẠO:** Không tạo bất kỳ file code nào trong `accounting_web/` ở phase này.

---

## Checklist Trước Khi Hoàn Thành

- [ ] Section 4: File Change Plan đã liệt kê đủ mọi file cần tạo/sửa
- [ ] Mọi file path đều bắt đầu bằng `accounting_web/`
- [ ] Section 5: Implementation steps đã có đủ 11 bước
- [ ] Section 6: Data flow diagram đã có
- [ ] Section 7: API mapping đã map đầy đủ với API Contract
- [ ] Section 8: Query key strategy đã có tenantId
- [ ] Section 9: Permission strategy đã có
- [ ] Section 10: Risk & mitigation đã có
- [ ] Section 11: Pre-coding checklist đã có

---

## Final Report Format

```
## Phase 4 Complete — Frontend Implementation Plan

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/04-frontend-implementation-plan.md

**Files to Create:** {n} new files
**Files to Modify:** {n} existing files

**Implementation Order:**
1. Types
2. Constants
3. API Service
4. Hooks
5. Mock Data
6. Components ({n} components)
7. Page
8. Routes

**Estimated Complexity:** [Low | Medium | High]

**Blockers:**
- ...

**Next Step:** Phase 5 — Backend Implementation Plan
Use skill: .ai/skills/05-backend-implementation-plan.md
```
