# Skill 09 — Frontend Testing

## Role

Senior React Test Engineer, Frontend Quality Assurance.

## Goal

Tạo frontend test plan và implement frontend test code bao gồm component tests, hook tests, MSW mock handlers, permission tests và loading/empty/error state tests. API Contract là source of truth cho mọi mock response.

---

## Input

- `docs/features/{feature-name}/03-api-contract-review.md`
- `docs/features/{feature-name}/04-frontend-implementation-plan.md`
- Frontend source code đã implement (Phase 7)

---

## Output

**Test Plan Document:**
```
docs/features/{feature-name}/09-frontend-test-plan.md
```

**Test Code:**
```
accounting_web/src/features/{feature}/tests/
```

hoặc theo folder structure test hiện có của project (`__tests__/`, `*.test.tsx` đặt cạnh file).

---

## Required Output: Test Plan Document

```markdown
# Frontend Test Plan: {Feature Name}

## 1. Test Scope
- Component Tests: Render, interaction, UI state
- Hook Tests: Data fetching, mutations, cache
- Permission Tests: UI behavior based on permissions
- Loading / Empty / Error State Tests
- User Interaction Tests: Search, filter, sort, pagination, CRUD

## 2. Test Environment
- Test Framework: Vitest + React Testing Library
- Mock API: MSW (Mock Service Worker)
- Mock Data: từ {feature}.mock.ts

## 3. Test Coverage Goals
| Area | Target |
|------|--------|
| {Feature}ListPage render | 100% happy path |
| Permission UI | All permission scenarios |
| Loading/Empty/Error states | 100% |
| User interactions | All primary flows |

## 4. Component Test Plan

### {Feature}ListPage
| Test | Expected |
|------|----------|

### {Feature}Grid
### {Feature}Toolbar
### {Feature}Filter
### {Feature}Form

## 5. Hook Test Plan
| Hook | Test Scenarios |
|------|---------------|

## 6. MSW Handler Plan
| Endpoint | Handler | Response |
|----------|---------|----------|

## 7. Exit Criteria
- [ ] All component tests pass
- [ ] All permission tests pass
- [ ] All loading/empty/error state tests pass
- [ ] All user interaction tests pass
```

---

## Required Test Code Patterns

### MSW Handlers

```typescript
// accounting_web/src/features/{feature}/mocks/{feature}.handlers.ts
import { http, HttpResponse } from 'msw';
import type { ApiResponse, PaginatedResult, {Feature}ListItem } from '../types/{feature}.types';
import { mock{Feature}ListItems, mock{Feature}Detail } from './{feature}.mock';

const BASE = '/api/:tenantId/{resource}';

export const {feature}Handlers = [
  // GET List — success
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const pageIndex = Number(url.searchParams.get('pageIndex') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const keyword = url.searchParams.get('keyword') ?? '';

    const filtered = keyword
      ? mock{Feature}ListItems.filter(s =>
          s.name.toLowerCase().includes(keyword.toLowerCase()) ||
          s.code.toLowerCase().includes(keyword.toLowerCase())
        )
      : mock{Feature}ListItems;

    const paged = filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return HttpResponse.json<ApiResponse<PaginatedResult<{Feature}ListItem>>>({
      success: true,
      data: {
        items: paged,
        totalCount: filtered.length,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
      message: null,
      errors: [],
      traceId: 'test-trace-id',
    });
  }),

  // GET Detail — success
  http.get(`${BASE}/:id`, ({ params }) => {
    const item = mock{Feature}ListItems.find(s => s.id === params.id);
    if (!item) {
      return HttpResponse.json({ success: false, data: null, message: 'Not found', errors: [], traceId: '' }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      data: mock{Feature}Detail,
      message: null,
      errors: [],
      traceId: 'test-trace-id',
    });
  }),

  // POST Create — success
  http.post(BASE, async ({ request }) => {
    const body = await request.json() as Create{Feature}Input;
    return HttpResponse.json({
      success: true,
      data: { ...mock{Feature}Detail, code: body.code, name: body.name },
      message: null,
      errors: [],
      traceId: 'test-trace-id',
    }, { status: 201 });
  }),

  // POST Create — validation error
  // (used with server.use() override in specific tests)
  // http.post(BASE, () =>
  //   HttpResponse.json({
  //     success: false, data: null, message: 'Validation failed',
  //     errors: [{ field: 'code', message: 'Code is required' }],
  //     traceId: ''
  //   }, { status: 400 })
  // ),

  // PUT Update
  http.put(`${BASE}/:id`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
      data: mock{Feature}Detail,
      message: null,
      errors: [],
      traceId: 'test-trace-id',
    });
  }),

  // DELETE
  http.delete(`${BASE}/:id`, () => {
    return HttpResponse.json({
      success: true,
      data: true,
      message: null,
      errors: [],
      traceId: 'test-trace-id',
    });
  }),
];
```

---

### Mock Data

```typescript
// accounting_web/src/features/{feature}/mocks/{feature}.mock.ts
import type { {Feature}ListItem, {Feature}Detail } from '../types/{feature}.types';
import { {Feature}Status } from '../types/{feature}.types';

export const mock{Feature}ListItems: {Feature}ListItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `id-${i + 1}`,
  code: `S${String(i + 1).padStart(3, '0')}`,
  name: `Nhà cung cấp ${i + 1}`,
  status: i % 3 === 0 ? {Feature}Status.Inactive : {Feature}Status.Active,
  // ... other fields matching API Contract exactly
  createdAt: new Date().toISOString(),
  updatedAt: null,
}));

export const mock{Feature}Detail: {Feature}Detail = {
  ...mock{Feature}ListItems[0],
  // ... additional detail fields
};
```

---

### Page Component Tests

```typescript
// accounting_web/src/features/{feature}/tests/{Feature}ListPage.test.tsx
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { {Feature}ListPage } from '../pages/{Feature}ListPage';
import { server } from '@/mocks/server'; // MSW server
import { http, HttpResponse } from 'msw';
import { createTestWrapper } from '@/test-utils/wrapper'; // provides QueryClient, Router, TenantContext
import { mock{Feature}ListItems } from '../mocks/{feature}.mock';

describe('{Feature}ListPage', () => {

  // ===== RENDER =====
  it('renders page title and toolbar', async () => {
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });
    expect(await screen.findByText('{Feature} Page Title')).toBeInTheDocument();
  });

  it('renders grid with data after loading', async () => {
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });

    // Loading state first
    expect(screen.queryByRole('grid')).not.toBeInTheDocument(); // or skeleton visible

    // Data loads
    await waitFor(() => {
      expect(screen.getByText(mock{Feature}ListItems[0].code)).toBeInTheDocument();
    });
  });

  // ===== LOADING STATE =====
  it('shows loading indicator while fetching', () => {
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });
    // Check skeleton or spinner is shown
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  // ===== EMPTY STATE =====
  it('shows empty state when no data returned', async () => {
    server.use(
      http.get('/api/:tenantId/{resource}', () =>
        HttpResponse.json({
          success: true,
          data: { items: [], totalCount: 0, pageIndex: 1, pageSize: 20, totalPages: 0 },
          message: null, errors: [], traceId: '',
        })
      )
    );

    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });
    expect(await screen.findByText(/không có dữ liệu/i)).toBeInTheDocument();
  });

  // ===== ERROR STATE =====
  it('shows error state when API fails', async () => {
    server.use(
      http.get('/api/:tenantId/{resource}', () =>
        HttpResponse.json({ success: false, message: 'Server error' }, { status: 500 })
      )
    );

    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });
    expect(await screen.findByText(/lỗi tải dữ liệu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thử lại/i })).toBeInTheDocument();
  });

  // ===== SEARCH =====
  it('filters list when search keyword entered', async () => {
    const user = userEvent.setup();
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });

    // Wait for initial load
    await screen.findByText(mock{Feature}ListItems[0].code);

    const searchInput = screen.getByPlaceholderText(/tìm kiếm/i);
    await user.type(searchInput, 'S001');

    // URL should update
    // Grid should refetch
    await waitFor(() => {
      // Verify filter applied (MSW handler filters by keyword)
    });
  });

  // ===== CREATE =====
  it('opens add dialog when Add button clicked', async () => {
    const user = userEvent.setup();
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });

    await screen.findByText(mock{Feature}ListItems[0].code);

    const addButton = screen.getByRole('button', { name: /thêm mới/i });
    await user.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/thêm mới {feature}/i)).toBeInTheDocument();
  });

  it('shows success toast and closes dialog after create success', async () => {
    const user = userEvent.setup();
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });

    await screen.findByText(mock{Feature}ListItems[0].code);
    await user.click(screen.getByRole('button', { name: /thêm mới/i }));

    // Fill form
    await user.type(screen.getByLabelText(/mã/i), 'S999');
    await user.type(screen.getByLabelText(/tên/i), 'Test Supplier');
    await user.click(screen.getByRole('button', { name: /lưu/i }));

    expect(await screen.findByText(/thêm mới thành công/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ===== PERMISSIONS =====
  it('hides Add button when missing create permission', async () => {
    render(
      <{Feature}ListPage />,
      { wrapper: createTestWrapper({ permissions: ['{feature}.view'] }) }
    );

    await screen.findByText(mock{Feature}ListItems[0].code);
    expect(screen.queryByRole('button', { name: /thêm mới/i })).not.toBeInTheDocument();
  });

  it('hides Delete button when missing delete permission', async () => {
    render(
      <{Feature}ListPage />,
      { wrapper: createTestWrapper({ permissions: ['{feature}.view'] }) }
    );

    await screen.findByText(mock{Feature}ListItems[0].code);
    expect(screen.queryByRole('button', { name: /xóa/i })).not.toBeInTheDocument();
  });

  // ===== TENANT SWITCH =====
  it('reloads data when tenant changes', async () => {
    const { rerender } = render(
      <{Feature}ListPage />,
      { wrapper: createTestWrapper({ tenantId: 'tenant-a' }) }
    );

    await screen.findByText(mock{Feature}ListItems[0].code);

    // Simulate tenant switch
    rerender(<{Feature}ListPage />); // with new tenantId in context

    // Data should refetch
    await waitFor(() => {
      // verify API was called again with new tenantId
    });
  });

  // ===== PAGINATION =====
  it('changes page when pagination clicked', async () => {
    const user = userEvent.setup();
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });

    await screen.findByText(mock{Feature}ListItems[0].code);

    const nextPageButton = screen.getByRole('button', { name: /trang sau/i });
    await user.click(nextPageButton);

    // URL should update pageIndex
    // Grid should refetch with pageIndex=2
  });

  // ===== VALIDATION ERRORS =====
  it('shows field-level validation error from API', async () => {
    server.use(
      http.post('/api/:tenantId/{resource}', () =>
        HttpResponse.json({
          success: false,
          data: null,
          message: 'Validation failed',
          errors: [{ field: 'code', message: 'Mã đã tồn tại' }],
          traceId: '',
        }, { status: 400 })
      )
    );

    const user = userEvent.setup();
    render(<{Feature}ListPage />, { wrapper: createTestWrapper() });
    await screen.findByText(mock{Feature}ListItems[0].code);
    await user.click(screen.getByRole('button', { name: /thêm mới/i }));
    await user.type(screen.getByLabelText(/mã/i), 'S001');
    await user.type(screen.getByLabelText(/tên/i), 'Test');
    await user.click(screen.getByRole('button', { name: /lưu/i }));

    expect(await screen.findByText(/mã đã tồn tại/i)).toBeInTheDocument();
  });
});
```

---

### Hook Tests

```typescript
// accounting_web/src/features/{feature}/tests/use{Feature}List.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { use{Feature}List } from '../hooks/use{Feature}List';
import { createTestWrapper } from '@/test-utils/wrapper';

describe('use{Feature}List', () => {
  it('fetches list data successfully', async () => {
    const { result } = renderHook(
      () => use{Feature}List({ pageIndex: 1, pageSize: 20 }),
      { wrapper: createTestWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data?.items).toBeDefined();
    expect(result.current.data?.data?.items.length).toBeGreaterThan(0);
  });

  it('returns isError when API fails', async () => {
    // Override MSW to return error
    // ...

    const { result } = renderHook(
      () => use{Feature}List({ pageIndex: 1, pageSize: 20 }),
      { wrapper: createTestWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

---

## Full Test Checklist

### Render Tests
- [ ] Page title displays correctly
- [ ] Toolbar displays with correct buttons
- [ ] Grid columns display correctly
- [ ] Summary cards display correctly

### Loading State Tests
- [ ] Skeleton/spinner shown during initial load
- [ ] Grid disabled while loading
- [ ] Toolbar buttons disabled while loading

### Empty State Tests
- [ ] Empty state message shown when no data
- [ ] Empty state has CTA button (if applicable)

### Error State Tests
- [ ] Error message shown when API fails
- [ ] Retry button shown
- [ ] Retry button triggers refetch

### Search Tests
- [ ] Search input updates URL query params
- [ ] Grid refetches with keyword
- [ ] Clear search resets to full list

### Filter Tests
- [ ] Status filter updates URL
- [ ] Grid refetches with filter
- [ ] Multiple filters combine correctly

### Sort Tests
- [ ] Column header click triggers sort
- [ ] Sort direction toggles
- [ ] Sort updates URL params

### Pagination Tests
- [ ] Total count displays correctly
- [ ] Next page button works
- [ ] Page size change works
- [ ] URL params update on page change

### CRUD Interaction Tests
- [ ] Add button opens dialog
- [ ] Form submission creates entity
- [ ] Edit button opens pre-filled dialog
- [ ] Update form submission updates entity
- [ ] Delete button shows confirm dialog
- [ ] Confirm delete removes from list
- [ ] Bulk select enables bulk delete
- [ ] Bulk delete confirmation shows count

### Permission Tests
- [ ] Add button hidden without create permission
- [ ] Edit button hidden without update permission
- [ ] Delete button hidden without delete permission
- [ ] Export button hidden without export permission
- [ ] 403 from API shows PermissionDenied state

### Tenant Tests
- [ ] Data refetches when tenant changes
- [ ] Query key contains tenantId
- [ ] Cache is separate per tenant

### API Error Tests
- [ ] 400 validation errors shown under form fields
- [ ] 409 conflict error shows appropriate message
- [ ] 500 server error shows generic error
- [ ] Network error shows appropriate message

---

## File Path Rules

| Output | Path |
|--------|------|
| Test plan | `docs/features/{feature-name}/09-frontend-test-plan.md` |
| Component tests | `accounting_web/src/features/{feature}/tests/*.test.tsx` |
| Hook tests | `accounting_web/src/features/{feature}/tests/*.test.ts` |
| MSW handlers | `accounting_web/src/features/{feature}/mocks/*.handlers.ts` |
| Mock data | `accounting_web/src/features/{feature}/mocks/*.mock.ts` |

**CẤMTẠO:** Không tạo test file nào ngoài `accounting_web/`.

---

## Final Report Format

```
## Phase 9 Complete — Frontend Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/09-frontend-test-plan.md

### Test Files Created

| File | Tests |
|------|-------|
| accounting_web/src/features/.../...Page.test.tsx | {n} tests |
| accounting_web/src/features/.../use...List.test.ts | {n} tests |
| accounting_web/src/features/.../....handlers.ts | {n} handlers |

### Test Results
- Component tests: {n}/{n} passing
- Hook tests: {n}/{n} passing
- Permission tests: {n}/{n} passing
- Loading/Empty/Error tests: {n}/{n} passing

### Run Command
\```bash
cd accounting_web && npm run test
# or specific feature:
npm run test -- --grep "{feature}"
\```

### Failed Tests (if any)
- ...

**Next Step:** Phase 10 — Integration Testing
Use skill: .ai/skills/10-integration-testing.md
```
