# Per-Task Code Review

## Role

Spec Compliance Reviewer / Code Quality Reviewer.

---

## Nguyên tắc cốt lõi

Mỗi nhóm implementation (task group) trong Phase 7 hoặc Phase 8 phải trải qua **2 vòng review độc lập** trước khi chuyển sang task tiếp theo:

1. **Spec Compliance Review** — code có match Phase 4 API Contract + Phase 6/5 Plan không?
2. **Code Quality Review** — code có tuân theo AccountingMini conventions không?

Review phải chạy theo thứ tự này. Không bỏ qua review nào. Không gộp hai vòng làm một.

---

## Task Groups

### Phase 7 — Backend Coding

| Group | Files | Review trigger |
|-------|-------|---------------|
| G1 | Domain Entity + Enum + EF Config + DbContext update | Sau khi tất cả G1 files done |
| G2 | DTOs + Validators | Sau khi tất cả G2 files done |
| G3 | Command/Query + Handler | Sau khi tất cả G3 files done |
| G4 | Endpoint (IEndpoint) + Permission constants + DI registration | Sau khi tất cả G4 files done |
| G5 | Export / Seed / Migration (nếu có) | Sau khi done |

### Phase 8 — Frontend Coding

| Group | Files | Review trigger |
|-------|-------|---------------|
| G1 | Types + Constants + Design tokens | Sau khi done |
| G2 | API service + Query key factory + React Query hooks | Sau khi done |
| G3 | UI Components | Sau khi done |
| G4 | Page + Route + Permission UI + Loading/Empty/Error states | Sau khi done |

---

## Stage 1: Spec Compliance Review

**Mục đích:** Verify code match đúng spec, không thiếu, không thừa.

### Backend checklist (so với Phase 4 + Phase 6)

- [ ] Tất cả endpoints trong Phase 4 đã được implement
- [ ] Route pattern khớp contract (method, path, params)
- [ ] Request DTO fields khớp contract (tên, type, nullable)
- [ ] Response DTO fields khớp contract (tên, type, shape)
- [ ] Validation rules khớp Phase 4 Validation Contract
- [ ] Permission attributes khớp Phase 4 Permission Contract
- [ ] Tenant filter được apply (ITenantEntity hoặc explicit filter)
- [ ] Không có endpoint/field ngoài scope Phase 4

### Frontend checklist (so với Phase 4 + Phase 5 + Phase 2)

- [ ] API calls đúng route, method, body, params theo Phase 4
- [ ] Request/response types khớp DTO Contract
- [ ] Tất cả UI elements trong Phase 1 & Phase 2 đã có mặt
- [ ] Column widths, heights, design tokens từ Phase 2 được apply
- [ ] Permission-based UI (ẩn/hiện) theo Phase 4 Permission Contract
- [ ] Query keys include `tenantId`
- [ ] Không có API call ngoài Phase 4 contract

### Kết quả Stage 1

**PASS:** Tất cả checklist items cleared → tiến sang Stage 2.

**FAIL:** List ra từng item bị thiếu/sai. Implementer fix → Stage 1 review lại.

---

## Stage 2: Code Quality Review

**Mục đích:** Verify code tuân theo AccountingMini conventions và quality standards.

### Backend checklist

- [ ] Namespace đúng: `AccountingApi.{Module}.{Feature}`
- [ ] Handler không chứa business logic ở Endpoint
- [ ] Sử dụng `Result<T>` pattern, endpoint dùng `.Match(Results.Ok, ApiResults.Problem)`
- [ ] Sử dụng `async/await` và `CancellationToken` đúng nơi
- [ ] Không expose EF entity trực tiếp — dùng DTO
- [ ] FluentValidation rules rõ ràng, không validate trong Handler
- [ ] Không hard-code `tenantId` hay `userId`
- [ ] Không dùng raw SQL unsafe
- [ ] Không có code dead/unreachable
- [ ] Tên method, class rõ nghĩa theo domain

### Frontend checklist

- [ ] Không có `any` type trừ khi thực sự cần
- [ ] API không được gọi trực tiếp trong component — phải qua service function
- [ ] React Query hooks encapsulate data fetching
- [ ] Không hard-code `tenantId`, permission strings
- [ ] Design token dùng từ Phase 2, không hard-code giá trị màu/spacing
- [ ] Loading, empty, error states đều được handle
- [ ] Permission UI ẩn (không chỉ disable) khi thiếu permission
- [ ] Không có console.log trong production code
- [ ] Component nhỏ, focused — không có "God component"

### Kết quả Stage 2

**PASS:** Tất cả checklist items cleared → task group hoàn thành, mark done.

**FAIL:** List ra từng issue với severity:
- **Critical:** Phải fix trước khi tiếp tục (ví dụ: expose EF entity, hard-code tenantId)
- **Important:** Phải fix trong group này (ví dụ: missing permission check)
- **Minor:** Note lại, fix trước Phase 13 (ví dụ: naming inconsistency nhỏ)

---

## Quy tắc 3-cycle escalation

Nếu sau **3 vòng fix** (Stage 1 hoặc Stage 2) mà reviewer vẫn FAIL:

1. **Dừng ngay** — không tiếp tục fix.
2. Báo user với format:

```markdown
## Review Escalation

**Task Group:** {G1/G2/G3/G4} — {Phase 7/8}
**Cycles attempted:** 3
**Stage stuck at:** Stage 1 (Spec Compliance) | Stage 2 (Code Quality)

**Unresolved issues:**
- {issue 1}: {description}
- {issue 2}: {description}

**Root cause assessment:**
- [ ] Spec ambiguity (Phase 4/5/6 chưa rõ)
- [ ] Architectural conflict (không thể implement theo cách đã plan)
- [ ] Missing project infrastructure (base class/interface không tồn tại)
- [ ] Scope quá lớn cho single task group

**Recommended action:**
- Clarify spec → update Phase 4/5/6 document
- Break group thành nhỏ hơn
- Escalate to brainstorming
```

3. Chờ user quyết định trước khi tiếp tục.

---

## Model selection cho review

| Stage | Recommended model | Lý do |
|-------|------------------|-------|
| Stage 1: Spec Compliance | `sonnet` | Cần đọc nhiều phase documents để so sánh |
| Stage 2: Code Quality | `sonnet` hoặc `haiku` | Mechanical checklist, ít context cần |
| 3-cycle escalation report | `sonnet` | Cần phân tích root cause |

---

## Format báo cáo sau mỗi task group

```markdown
## Review Result — {Phase 7/8} Group {G1/G2/G3/G4}

**Stage 1 (Spec Compliance):** PASS | FAIL (cycle {n})
**Stage 2 (Code Quality):** PASS | FAIL (cycle {n}) | Not started

**Issues fixed this cycle:**
- ...

**Remaining issues:**
- ...

**Status:** ✅ Group complete | 🔄 Fix needed | 🚨 Escalated
```

---

## Red flags — không bao giờ được làm

- Skip Stage 1 để đi thẳng Stage 2
- Mark task complete khi Stage 2 còn Critical/Important issues
- Tự approve review (reviewer không phải là implementer)
- Tiếp tục task tiếp theo khi task hiện tại chưa qua cả 2 stage
- Ignore escalation sau 3 cycles

---

## Tích hợp với workflow

- Gọi sau mỗi TDD cycle hoàn thành (`.claude/skills/tdd-enforcement.md`)
- Được reference từ Phase 7 (`.claude/skills/07-backend-coding.md`)
- Được reference từ Phase 8 (`.claude/skills/08-frontend-coding.md`)
- Issues phát hiện trong review → ghi vào `issues.md` (type: `Code Issue`)
