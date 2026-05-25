# As-Fix — Bug Fix Workflow

## Role

Senior Fullstack Debugger (Backend .NET hoặc Frontend React tuỳ context bug).

---

## Mục đích

Resolve bugs cụ thể một cách có cấu trúc: root-cause analysis, minimal fix, verification.

Dùng skill này khi scope rõ và risk thấp. Escalate khi scope phình to.

---

## Scope Gate — Kiểm tra trước khi bắt đầu

Dùng skill này chỉ khi **tất cả** điều kiện sau đúng:

1. **Có signal cụ thể** — Failing behavior, error message, stack trace, hoặc failing test có thể reproduce được
2. **Fix path có vẻ localized** — Issue giới hạn trong một khu vực nhỏ, không cần redesign cross-system
3. **Risk thấp đến trung bình** — Fix không yêu cầu thay đổi foundational (schema, auth, multi-tenant rules)
4. **Verification rõ ràng** — Có thể reproduce và verify fix bằng test hoặc lệnh cụ thể

Nếu bất kỳ điều kiện nào fail → escalate sang `/fullstack-feature-workflow` hoặc `brainstorming`.

---

## Hard Stop — Dừng ngay và escalate

Dừng tất cả implementation nếu xuất hiện bất kỳ dấu hiệu nào sau:

- Root cause không rõ sau khi đã investigate focused
- Fix yêu cầu thay đổi database schema, EF configuration, hoặc multi-tenant query filter
- Fix kéo theo refactor nhiều modules
- Bug liên quan đến security (auth bypass, tenant isolation breach, permission escalation)
- Verification cho thấy regression rộng
- 3 lần fix vẫn không hết bug

**Hành động khi hard stop:**

1. Dừng mọi coding activity.
2. Báo user: `"Bug này vượt giới hạn single-pass debugging. Recommend sử dụng /fullstack-feature-workflow hoặc brainstorming để plan phased investigation."`
3. Dùng `AskUserQuestion` để xác nhận hướng xử lý.

---

## Workflow

### Bước 1: Thu thập thông tin bug

Xác nhận các trường sau trước khi investigate:

```
Title: [tên bug ngắn gọn]
Expected behavior: [hành vi đúng]
Actual behavior: [hành vi sai hiện tại]
Reproduction steps: [các bước reproduce]
Evidence: [log, stack trace, error message, failing test output]
Area: [backend endpoint / frontend component / database / API response]
Severity: [Critical / High / Medium / Low]
```

Đọc context liên quan: `docs/SUMMARY.md`, file code trong vùng bị ảnh hưởng.

### Bước 2: Reproduce và Diagnose

1. Reproduce bug consistently (bằng test hoặc manual steps).
2. Locate điểm fail chính xác (file/function/line).
3. Trace control/data flow để tìm **root cause** (không chỉ symptom).
4. Form hypothesis và confirm nó giải thích behavior đang thấy.

**Backend debugging hints:**
- Check MediatR pipeline behaviors (validation, logging, transaction)
- Check tenant filter (`HasQueryFilter` trong AppDbContext)
- Check Result<T> handling trong endpoint `.Match()`
- Check FluentValidation rules và error message format

**Frontend debugging hints:**
- Check React Query query key (có thiếu `tenantId`?)
- Check API service function (URL, method, body)
- Check permission check logic (`usePermissions`, `Can` component)
- Check error boundary và error state rendering

### Bước 3: Classify — Small vs Bigger Fix

#### Small fix (tiếp tục trong skill này)

Tất cả điều sau đúng:
- Root cause rõ và confirmed
- Thay đổi trong ≤ 5 files
- Risk regression thấp và testable nhanh

#### Bigger fix (escalate)

Bất kỳ điều sau đúng:
- Root cause chưa rõ
- Cần thay đổi nhiều module
- Cần migration hoặc refactor lớn
- Risk không control được trong single pass

→ Hard Stop.

### Bước 4: Implement (Small Fix)

1. Phát biểu brief 1-3 bullet fix plan.
2. **Viết failing test** reproduce bug (theo TDD — xem `.claude/skills/tdd-enforcement.md`).
3. **Verify test FAIL** đúng lý do.
4. Apply smallest targeted change để fix root cause.
5. **Verify test PASS** + các test khác không bị break.
6. Không refactor code không liên quan trong cùng commit.

### Bước 5: Verify

Chạy validation theo thứ tự tăng dần:

1. **Backend:** `dotnet test accounting_api/tests/ --filter "{RelatedTests}"`
2. **Frontend:** `pnpm test --run src/modules/{affected}/`
3. **Broader:** Chạy full test suite nếu bug có thể ảnh hưởng rộng
4. **Build:** `dotnet build` hoặc `pnpm build` để confirm không có regression mới

Fix complete chỉ khi:
- Bug không còn reproduce được
- Expected behavior được confirm
- Không có critical regression mới

### Bước 6: Báo cáo

```markdown
## Fix Complete

**Root cause:** {mô tả ngắn gọn}
**What changed:** {file(s), line(s)}
**Why this works:** {giải thích}
**Test added:** {test file + test name}
**Verification:** {lệnh chạy + result}
**Residual risks:** {nếu có}
```

---

## Quy tắc

- Không đoán khi thiếu context — hỏi qua `AskUserQuestion`.
- Luôn ưu tiên fix root cause, không patch symptom.
- Giữ blast radius tối thiểu.
- Không mark done khi chưa verify.
- Escalate sớm khi scope/risk tăng.
- Không fix bug mà không có test reproduce nó (Iron Law từ TDD).

---

## Khi nào dùng

- Có failing test hoặc error report cụ thể
- Bug rõ ràng, không cần thiết kế lại
- Ít hơn half-day để fix

## Khi không dùng (escalate thay)

- Không rõ root cause sau 30 phút investigate
- Fix kéo theo thay đổi schema hoặc multi-tenant rules
- Bug là symptom của architectural problem
- Cần phân tích security impact
