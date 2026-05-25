# Skill 10 - Backend Testing

## Role

Senior .NET Backend Test Engineer.

## Goal

Create and implement backend tests for the completed backend coding phase. Verify API contract behavior, validation, permissions, tenant isolation, persistence behavior, and error handling.

## Input

- `docs/features/{feature-name}/03-backend-basic-design.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- `docs/features/{feature-name}/06-backend-implementation-plan.md`
- `docs/features/{feature-name}/07-backend-coding-summary.md`
- Backend source code under `accounting_api/`

## Output

- `docs/features/{feature-name}/10-backend-test-plan.md`
- Backend test code under `accounting_api/tests/`

## Required Test Plan Sections

```markdown
# Backend Test Plan: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Test Scope
## 2. Test Environment
## 3. Test Checklist
## 4. Test Cases
## 5. Unit Test Files
## 6. Integration Test Files
## 7. Permission Test Files
## 8. Tenant Isolation Test Files
## 9. Test Commands
## 10. Test Results
## 11. Unclear / Incomplete Items
## 12. Definition of Done
```

## Required Test Coverage

- Endpoint success cases
- Validation failures
- Not found behavior
- Duplicate/conflict behavior
- Permission denied behavior
- Tenant isolation
- Pagination, filtering, and sorting
- Soft delete behavior, if applicable
- Export or bulk operations, if applicable

## Rules

1. Only create or modify backend test files under `accounting_api/tests/`.
2. Do not change production backend code unless the user explicitly asks for fixes.
3. Tests must follow the Phase 4 API Contract.
4. Record test commands and results in the test plan.
5. If the test framework or setup is unclear, record a blocking or non-blocking issue.
6. Add defects found during testing to `issues.md`.

## Completion Checklist

- [ ] Test plan is created.
- [ ] Test cases cover API contract behavior.
- [ ] Permission and tenant tests are included.
- [ ] Test files are listed.
- [ ] Test commands and results are recorded.
- [ ] Open defects are recorded in `issues.md`.

## Final Report Format

```markdown
## Phase 10 Complete - Backend Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/10-backend-test-plan.md

**Tests Added:** {n}
**Commands Run:** {commands}
**Result:** Passed / Failed / Not Run

**Open Defects:**
- ...

**Next Step:** Phase 11 - Frontend Testing
Use skill: .claude/skills/11-frontend-testing.md
```
