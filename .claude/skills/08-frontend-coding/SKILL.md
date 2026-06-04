---
name: 08-frontend-coding
description: Phase 8: Implement pixel-perfect frontend source code following TDD and per-task code review.
---

# Skill 08 - Frontend Coding

## Role

Senior React Frontend Engineer, Senior UI Engineer.

## Goal

Implement frontend source code according to Phase 1 Frontend Basic Design, Phase 2 UI Pixel Analysis, Phase 4 API Contract, and Phase 5 Frontend Implementation Plan. The implementation must follow existing project conventions and match the approved UI specification.

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- `docs/features/{feature-name}/05-frontend-implementation-plan.md`
- Actual project structure under `accounting_web/`

## Output

- Frontend source code in `accounting_web/`
- `docs/features/{feature-name}/08-frontend-coding-summary.md`

## Required Coding Summary Sections

```markdown
# Frontend Coding Summary: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Implementation Summary
## 2. Files Created
## 3. Files Modified
## 4. API Contract Mapping
## 5. UI Pixel Spec Mapping
## 6. Components Implemented
## 7. State Management
## 8. Permissions
## 9. Multi-tenant Handling
## 10. Loading / Empty / Error States
## 11. Commands Run
## 12. Visual Review Preparation
## 13. Known Limitations
## 14. Unclear / Incomplete Items
## 15. Definition of Done
```

## TDD Requirement

Mỗi hook, component, page phải tuân theo TDD cycle trước khi implement:

```
1. Viết failing test (Vitest + RTL) cho behavior cần implement
2. Chạy: pnpm test --run src/modules/{feature}/
3. Verify test FAIL đúng lý do (không phải lỗi import/setup)
4. Viết minimal code để test PASS
5. Chạy lại: verify test PASS, các test khác không bị break
```

**Iron Law:** Không viết production code khi chưa có failing test.

Skill chi tiết: `.claude/skills/tdd-enforcement.md`

## Per-Task Code Review

Sau mỗi task group hoàn thành (TDD cycle xong), chạy 2-stage review:

| Group | Files | Khi nào review |
|-------|-------|----------------|
| G1 | Types + Constants + Design tokens | Sau G1 xong |
| G2 | API service + Query key factory + React Query hooks | Sau G2 xong |
| G3 | UI Components | Sau G3 xong |
| G4 | Page + Route + Permission UI + States | Sau G4 xong |

**Stage 1 — Spec Compliance:** Code match Phase 4 + Phase 5 + Phase 2?
**Stage 2 — Code Quality:** Code follow AccountingMini conventions?

**3-cycle rule:** Sau 3 vòng fix không pass → dừng, escalate user.

Skill chi tiết: `.claude/skills/per-task-code-review.md`

## Rules

1. Do not start this phase unless the user explicitly confirms frontend coding.
2. Only create or modify frontend files under `accounting_web/`.
3. Follow the Phase 4 API Contract exactly.
4. Follow Phase 2 UI Pixel Analysis for layout, spacing, typography, and visual states.
5. Do not change backend files.
6. Do not refactor unrelated frontend code.
7. Use existing project conventions for modules, routes, API client, hooks, state, styling, and UI components.
8. Query keys must include `tenantId`.
9. Implement permission-based UI behavior for every controlled action.
10. Include loading, empty, error, and no-permission states.
11. Record every contract or pixel-spec deviation in the coding summary and `issues.md`.
12. Run typecheck/lint/build when feasible and record the result.
13. Follow TDD: write failing test before each implementation unit (see TDD Requirement above).
14. Run per-task code review (2-stage) after each task group (see Per-Task Code Review above).
15. List screen: header always rendered (no conditional hide); implement `flex flex-col h-full` layout with `flex-1 overflow-auto` data body and fixed pagination footer. See UI Layout Constraints in `docs/code-standard/frontend-conventions.md`.
16. Add/Edit screen: all input fields must be visible in viewport; use `grid grid-cols-2` or `grid-cols-3` layout when field count would cause vertical overflow in a single column.

## Completion Checklist

- [ ] Frontend coding was explicitly confirmed by the user.
- [ ] All changed files are under `accounting_web/`.
- [ ] API usage matches Phase 4.
- [ ] UI structure maps to Phase 1 and Phase 2.
- [ ] Components, hooks, services, and types are implemented according to the plan.
- [ ] Permission and tenant handling are implemented.
- [ ] Loading, empty, error, and no-permission states are implemented.
- [ ] Typecheck/lint/build result is recorded, or reason for not running is documented.
- [ ] `08-frontend-coding-summary.md` is created.
- [ ] Required screenshots for visual review are listed.
- [ ] TDD cycle followed for every hook, component, page (failing test first).
- [ ] Per-task 2-stage review passed for every task group (G1–G4).
- [ ] No Critical or Important issues remain open from code review.
- [ ] List screen: header always rendered; header and pagination footer in viewport; data body scrolls.
- [ ] Add/Edit screen: all input fields visible in viewport; multi-column layout used if needed.

## Final Report Format

```markdown
## Phase 8 Complete - Frontend Coding

**Feature:** {feature-name}
**Summary:** docs/features/{feature-name}/08-frontend-coding-summary.md

**Files Created:** {n}
**Files Modified:** {n}
**Components Implemented:** {n}
**Commands Run:** {commands}

**Visual Review Required Screenshots:**
- ...

**Next Step:** Phase 9 - Frontend Visual Review
Use skill: .claude/skills/09-frontend-visual-review.md
```

