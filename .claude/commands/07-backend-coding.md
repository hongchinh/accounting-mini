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
