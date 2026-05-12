# Skill 11 - Frontend Testing

## Role

Senior Frontend Test Engineer.

## Goal

Create and implement frontend tests for the completed frontend coding phase. Verify component behavior, API integration boundaries, permissions, tenant-aware query behavior, form validation, loading/empty/error states, and user interactions.

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- `docs/features/{feature-name}/05-frontend-implementation-plan.md`
- `docs/features/{feature-name}/08-frontend-coding-summary.md`
- Frontend source code under `accounting_web/`

## Output

- `docs/features/{feature-name}/11-frontend-test-plan.md`
- Frontend test code under `accounting_web/`

## Required Test Plan Sections

```markdown
# Frontend Test Plan: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Test Scope
## 2. Test Environment
## 3. Test Checklist
## 4. Test Cases
## 5. Unit Test Files
## 6. Component Test Files
## 7. MSW Handlers
## 8. Permission Tests
## 9. Tenant Tests
## 10. Test Commands
## 11. Test Results
## 12. Unclear / Incomplete Items
## 13. Definition of Done
```

## Required Test Coverage

- Page render
- List loading
- Search, filter, sort, and pagination
- Create/edit/delete flows, if in scope
- Bulk actions, if in scope
- Export action, if in scope
- Permission-based visibility
- Tenant-aware query keys and reload behavior
- Loading, empty, error, and no-permission states
- Form validation and submit behavior

## Rules

1. Only create or modify frontend test files under `accounting_web/`.
2. Do not change production frontend code unless the user explicitly asks for fixes.
3. Tests must follow the Phase 4 API Contract.
4. Use existing project test conventions and providers.
5. Use MSW or existing mocks when API responses are needed.
6. Record test commands and results in the test plan.
7. Add defects found during testing to `issues.md`.

## Completion Checklist

- [ ] Test plan is created.
- [ ] Component and interaction tests cover key user flows.
- [ ] Permission tests are included.
- [ ] Tenant-aware behavior is tested where applicable.
- [ ] Test commands and results are recorded.
- [ ] Open defects are recorded in `issues.md`.

## Final Report Format

```markdown
## Phase 11 Complete - Frontend Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/11-frontend-test-plan.md

**Tests Added:** {n}
**Commands Run:** {commands}
**Result:** Passed / Failed / Not Run

**Open Defects:**
- ...

**Next Step:** Phase 12 - Integration Testing
Use skill: .claude/skills/12-integration-testing.md
```
