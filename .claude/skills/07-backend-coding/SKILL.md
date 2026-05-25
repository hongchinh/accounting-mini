---
name: 07-backend-coding
description: Phase 7: Implement backend source code following TDD and per-task code review.
---

# Skill 07 - Backend Coding

## Role

Senior .NET Backend Engineer.

## Goal

Implement backend source code according to Phase 3 Backend Basic Design, Phase 4 API Contract, and Phase 6 Backend Implementation Plan. Follow the existing backend architecture, multi-tenant rules, permission model, validation conventions, and error handling pattern.

## Input

- `docs/features/{feature-name}/03-backend-basic-design.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- `docs/features/{feature-name}/06-backend-implementation-plan.md`
- Actual project structure under `accounting_api/`

## Output

- Backend source code in `accounting_api/`
- `docs/features/{feature-name}/07-backend-coding-summary.md`

## Required Coding Summary Sections

```markdown
# Backend Coding Summary: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Implementation Summary
## 2. Files Created
## 3. Files Modified
## 4. API Contract Mapping
## 5. Database / Migration Changes
## 6. Validation Implemented
## 7. Permission Changes
## 8. Multi-tenant Handling
## 9. Error Handling
## 10. Deviations from Plan or Contract
## 11. Commands Run
## 12. Known Limitations
## 13. Unclear / Incomplete Items
## 14. Definition of Done
```

## TDD Requirement

Mỗi handler, validator, endpoint phải tuân theo TDD cycle trước khi implement:

```
1. Viết failing test (xUnit) cho behavior cần implement
2. Chạy: dotnet test accounting_api/tests/ --filter "{TestClass}"
3. Verify test FAIL đúng lý do (không phải lỗi syntax)
4. Viết minimal code để test PASS
5. Chạy lại: verify test PASS, các test khác không bị break
```

**Iron Law:** Không viết production code khi chưa có failing test.

Skill chi tiết: `.claude/skills/tdd-enforcement.md`

## Per-Task Code Review

Sau mỗi task group hoàn thành (TDD cycle xong), chạy 2-stage review:

| Group | Files | Khi nào review |
|-------|-------|----------------|
| G1 | Entity + Enum + EF Config + DbContext | Sau G1 xong |
| G2 | DTOs + Validators | Sau G2 xong |
| G3 | Command/Query + Handler | Sau G3 xong |
| G4 | Endpoint + Permission + DI | Sau G4 xong |
| G5 | Export/Seed/Migration (nếu có) | Sau G5 xong |

**Stage 1 — Spec Compliance:** Code match Phase 4 + Phase 6?
**Stage 2 — Code Quality:** Code follow AccountingMini conventions?

**3-cycle rule:** Sau 3 vòng fix không pass → dừng, escalate user.

Skill chi tiết: `.claude/skills/per-task-code-review.md`

## Rules

1. Do not start this phase unless the user explicitly confirms backend coding.
2. Only create or modify backend files under `accounting_api/`.
3. Follow the Phase 4 API Contract exactly.
4. Do not change frontend files.
5. Do not refactor unrelated backend code.
6. Match existing backend architecture, namespaces, endpoint style, Result pattern, validation style, and dependency injection conventions.
7. Add permission constants and mappings required by the contract.
8. Enforce tenant isolation for every query and command.
9. Do not expose EF entities directly from endpoints.
10. Record every contract deviation in the coding summary and `issues.md`.
11. Run the relevant build/test command when feasible and record the result.
12. Follow TDD: write failing test before each implementation unit (see TDD Requirement above).
13. Run per-task code review (2-stage) after each task group (see Per-Task Code Review above).

## Completion Checklist

- [ ] Backend coding was explicitly confirmed by the user.
- [ ] All changed files are under `accounting_api/`.
- [ ] Implemented endpoints match Phase 4.
- [ ] DTOs match the API contract.
- [ ] Validators match documented validation rules.
- [ ] Permissions are enforced.
- [ ] Tenant isolation is enforced.
- [ ] Migration or persistence changes are documented.
- [ ] Build/test command result is recorded, or reason for not running is documented.
- [ ] `07-backend-coding-summary.md` is created.
- [ ] TDD cycle followed for every handler, validator, endpoint (failing test first).
- [ ] Per-task 2-stage review passed for every task group (G1–G5).
- [ ] No Critical or Important issues remain open from code review.

## Final Report Format

```markdown
## Phase 7 Complete - Backend Coding

**Feature:** {feature-name}
**Summary:** docs/features/{feature-name}/07-backend-coding-summary.md

**Files Created:** {n}
**Files Modified:** {n}
**Endpoints Implemented:** {n}
**Commands Run:** {commands}

**Contract Deviations:**
- None / ...

**Next Step:** Phase 8 - Frontend Coding
Use skill: .claude/skills/08-frontend-coding.md
```

