# Skill 12 - Integration Testing

## Role

Senior Fullstack QA Engineer.

## Goal

Verify that frontend and backend work together according to the Phase 4 API Contract. Define and run integration or end-to-end checks for the main feature workflows, API behavior, authentication, permissions, tenant isolation, and data consistency.

## Input

- `docs/features/{feature-name}/04-api-contract-review.md`
- `docs/features/{feature-name}/10-backend-test-plan.md`
- `docs/features/{feature-name}/11-frontend-test-plan.md`
- Backend source and runtime under `accounting_api/`
- Frontend source and runtime under `accounting_web/`

## Output

- `docs/features/{feature-name}/12-integration-test-plan.md`
- Integration/E2E test files if the project already has a test location and framework

## Required Test Plan Sections

```markdown
# Integration Test Plan: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Integration Scope
## 2. Environment
## 3. Test Data
## 4. API Contract Verification
## 5. End-to-End Scenarios
## 6. Playwright / Cypress Plan
## 7. HTTP / Postman Test Plan
## 8. Integration Defects
## 9. Test Commands
## 10. Test Results
## 11. Exit Criteria
## 12. Unclear / Incomplete Items
## 13. Definition of Done
```

## Required Scenarios

- Authenticated user can open the feature page.
- List API data renders in the frontend.
- Search/filter/sort/pagination round trip correctly.
- Create/update/delete workflows work, if in scope.
- Permission restrictions work in UI and API.
- Tenant isolation prevents cross-tenant data access.
- Validation errors from backend display correctly in frontend.
- Empty and error states are visible when appropriate.

## Rules

1. Use the Phase 4 API Contract as the source of truth.
2. Do not change production code unless the user explicitly asks for fixes.
3. Prefer the project's existing E2E or integration framework.
4. If environment, credentials, tenant, or seed data are missing, record the blocker.
5. Record all commands and results in the integration test plan.
6. Record defects in `issues.md`.
7. Contract defects must be fixed in the Phase 4 contract before implementation changes are made.

## Completion Checklist

- [ ] Integration test plan is created.
- [ ] Environment and test data requirements are documented.
- [ ] Main E2E scenarios are listed.
- [ ] API contract verification is included.
- [ ] Commands and results are recorded.
- [ ] Open defects are recorded in `issues.md`.

## Final Report Format

```markdown
## Phase 12 Complete - Integration Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/12-integration-test-plan.md

**Scenarios Verified:** {n}
**Commands Run:** {commands}
**Result:** Passed / Failed / Not Run

**Open Defects:**
- ...

**Next Step:** Phase 13 - Final Feature Review
Use skill: .claude/skills/13-final-feature-review.md
```
