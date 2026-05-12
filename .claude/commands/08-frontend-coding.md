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
