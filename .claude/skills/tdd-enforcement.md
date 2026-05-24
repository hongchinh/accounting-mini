# TDD Enforcement

## Role

Senior .NET Backend Test Engineer / Senior React Frontend Test Engineer.

---

## The Iron Law

```
KHÔNG VIẾT PRODUCTION CODE KHI CHƯA CÓ FAILING TEST
```

Viết code trước rồi test sau? Xóa đi. Bắt đầu lại.

**Không có ngoại lệ:**
- Không giữ lại "để tham khảo"
- Không "adapt" trong khi viết test
- Xóa nghĩa là xóa

---

## Red-Green-Refactor

```
RED   → Viết failing test, verify nó FAIL đúng lý do
GREEN → Viết minimal code để test PASS
REFACTOR → Clean up, giữ test xanh
```

Nếu test pass ngay khi viết xong → bạn đang test code đã tồn tại, không phải code mới. Sửa test.

---

## Backend (.NET / xUnit)

### Cú pháp test cơ bản

```csharp
public class CreateSupplierHandlerTests
{
    [Fact]
    public async Task Handle_ValidCommand_ReturnsSuccess()
    {
        // Arrange
        var command = new CreateSupplierCommand { Name = "ACME" };
        var handler = new CreateSupplierHandler(/* deps */);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_DuplicateName_ReturnsFailure()
    {
        // Arrange - existing supplier with same name
        // Act
        // Assert: result.IsFailure && result.Error.Code == "Supplier.DuplicateName"
    }
}
```

### Lệnh chạy test

```powershell
dotnet test accounting_api/tests/ --filter "FullyQualifiedName~CreateSupplierHandler"
```

Toàn bộ:
```powershell
dotnet test accounting_api/tests/
```

### Verify RED (bắt buộc)

Output phải có dạng:
```
FAILED: CreateSupplierHandlerTests.Handle_ValidCommand_ReturnsSuccess
  Error: Method not found: 'CreateSupplierHandler...'
```

Nếu PASS ngay → test đang test code cũ. Sửa test.

### Verify GREEN (bắt buộc)

```
PASSED: CreateSupplierHandlerTests.Handle_ValidCommand_ReturnsSuccess (Xms)
Test Run Successful. Total: 1
```

### Nhóm test bắt buộc theo Phase 7

| Nhóm | File test | Test cần có |
|------|-----------|-------------|
| Handler | `{Feature}HandlerTests.cs` | Happy path, not found, duplicate, validation error |
| Validator | `{Feature}ValidatorTests.cs` | Required fields, max length, format, business rules |
| Endpoint (integration) | `{Feature}EndpointTests.cs` | 200, 201, 400, 401, 403, 404 |
| Permission | `{Feature}PermissionTests.cs` | 403 khi thiếu permission |
| Tenant isolation | `{Feature}TenantTests.cs` | Cross-tenant trả 404/403 |

### Khi nào được dùng mock (backend)

**Được phép mock:**
- External HTTP calls (HttpClient, external payment gateway)
- Email/SMS services
- File storage (Azure Blob, S3)

**Không được mock:**
- DbContext / EF Core — dùng in-memory hoặc Testcontainers
- MediatR — test handler trực tiếp hoặc qua endpoint
- FluentValidation — test validator trực tiếp

---

## Frontend (React / Vitest + RTL)

### Cú pháp test cơ bản

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { SupplierListPage } from './SupplierListPage'

const server = setupServer(
  http.get('/api/suppliers', () =>
    HttpResponse.json({ data: [], total: 0, page: 1 })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('hiển thị empty state khi không có nhà cung cấp', async () => {
  render(<SupplierListPage />, { wrapper: AppProviders })
  await waitFor(() =>
    expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument()
  )
})
```

### Lệnh chạy test

```bash
pnpm test --run accounting_web/src/modules/suppliers/
```

Toàn bộ:
```bash
pnpm test --run
```

Watch mode (development):
```bash
pnpm test
```

### Verify RED (bắt buộc)

```
FAIL  src/modules/suppliers/SupplierListPage.test.tsx
  ● hiển thị empty state khi không có nhà cung cấp
    TestingLibraryElementError: Unable to find an element with the text: Không có dữ liệu
```

### Verify GREEN (bắt buộc)

```
PASS  src/modules/suppliers/SupplierListPage.test.tsx
  ✓ hiển thị empty state khi không có nhà cung cấp (245ms)
```

### Nhóm test bắt buộc theo Phase 8

| Nhóm | File test | Test cần có |
|------|-----------|-------------|
| Hook | `use{Feature}.test.ts` | Loading, success, error states; query key có tenantId |
| Component | `{Component}.test.tsx` | Render, props, user interactions |
| Page | `{Feature}Page.test.tsx` | Happy path, empty, error, no-permission |
| Permission | `{Feature}Permission.test.tsx` | Ẩn UI khi thiếu permission |
| MSW handlers | `handlers/{feature}.ts` | GET list, GET detail, POST, PUT, DELETE |

### Khi nào được dùng mock (frontend)

**Được phép mock:**
- API calls — dùng MSW (không dùng `jest.mock` cho fetch/axios)
- Browser APIs không available trong jsdom (window.matchMedia, ResizeObserver)
- `next/navigation` (useRouter, useSearchParams)

**Không được mock:**
- Component con — test tích hợp thực tế
- React Query hooks — test với QueryClient thực
- Zustand store — dùng store thực với initial state

---

## Chu trình thực tế

```
1. Đọc Phase 6/5 Implementation Plan — xác định task cần implement
2. Viết failing test cho behavior đó
3. Chạy test → verify FAIL đúng lý do
4. Viết minimal code để pass
5. Chạy test → verify PASS
6. Refactor nếu cần → verify vẫn PASS
7. Commit → chạy per-task code review
```

---

## Các lý do hay dùng để bỏ TDD (và tại sao sai)

| Lý do | Thực tế |
|-------|---------|
| "Đơn giản quá, không cần test" | Code đơn giản vẫn có thể sai. Test mất 2 phút. |
| "Viết test sau cũng được" | Test viết sau pass ngay = không chứng minh gì |
| "Đã manual test rồi" | Manual test không tái sử dụng được, không chạy lại khi refactor |
| "Feature này không có business logic" | Endpoint vẫn cần test permission, tenant isolation |
| "Tôi chỉ sửa một dòng" | Một dòng sai = regression. Test giúp catch nó |
| "Sẽ viết test sau khi xong hết" | Sẽ không bao giờ viết |

---

## Checklist trước khi mark task complete

- [ ] Mỗi function/handler/component mới đều có test
- [ ] Đã verify từng test FAIL trước khi implement
- [ ] Test fail đúng lý do (không phải lỗi syntax hay import)
- [ ] Đã verify test PASS sau khi implement
- [ ] Các test khác vẫn PASS (không có regression)
- [ ] Test dùng real code (mock chỉ khi thực sự cần)
- [ ] Edge cases được cover: null input, empty list, permission denied, tenant mismatch

---

## Tích hợp với workflow

Skill này được gọi từ:
- Phase 7 Backend Coding (`.claude/skills/07-backend-coding.md`)
- Phase 8 Frontend Coding (`.claude/skills/08-frontend-coding.md`)
- Phase 10 Backend Testing (`.claude/skills/10-backend-testing.md`)
- Phase 11 Frontend Testing (`.claude/skills/11-frontend-testing.md`)

Sau mỗi TDD cycle hoàn thành → gọi `.claude/skills/per-task-code-review.md`.
