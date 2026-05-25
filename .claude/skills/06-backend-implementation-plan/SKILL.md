---
name: 06-backend-implementation-plan
description: Phase 6: Create backend coding plan from backend design and API contract.
---

# Skill 06 - Backend Implementation Plan

## Role

Senior .NET Backend Architect.

## Goal

Create the backend implementation plan from Phase 3 Backend Basic Design and Phase 4 API Contract. List backend files to create or modify, implementation order, request flow, EF Core strategy, permissions, validation, tenant handling, migration approach, and test impact. Do not write code in this phase.

## Input

- `docs/features/{feature-name}/03-backend-basic-design.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- Existing backend project conventions in `accounting_api/`

## Output

```text
docs/features/{feature-name}/06-backend-implementation-plan.md
```

## Required Output Sections

```markdown
# Backend Implementation Plan: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Goal
## 2. Scope
## 3. Dependencies
## 4. File Change Plan
## 5. Implementation Steps
## 6. Request Flow
## 7. Query Strategy
## 8. Error Handling Strategy
## 9. Security Strategy
## 10. Multi-tenant Strategy
## 11. Permission Strategy
## 12. Validation Strategy
## 13. Migration Strategy
## 14. Test Impact
## 15. Risk & Mitigation
## 16. Checklist Before Coding
## 17. Unclear / Incomplete Items
## 18. Definition of Done
```

## Required Tables

### File Change Plan

| # | File Path | New/Modify | Purpose | Priority |
|---|-----------|------------|---------|----------|

Every backend file path must start with `accounting_api/`.

### Endpoint Implementation Mapping

| Endpoint | Handler | Request DTO | Response DTO | Validator | Permission |
|----------|---------|-------------|--------------|-----------|------------|

## Rules

1. Do not write code in this phase.
2. Do not modify files in `accounting_api/` in this phase.
3. The Phase 4 API Contract is the source of truth for endpoints, DTOs, field names, and permissions.
4. Follow existing backend architecture and naming conventions.
5. Do not introduce service/repository layers unless the project already requires them.
6. Include EF Core configuration, migration, audit, soft delete, and tenant strategy when applicable.
7. Include permission constants and endpoint authorization mapping.
8. Include validation and standard error handling strategy.
9. Add unresolved implementation risks to `issues.md`.

## Completion Checklist

- [ ] Phase Status block is present.
- [ ] File change plan lists every backend file to create or modify.
- [ ] Endpoint implementation mapping covers the Phase 4 contract.
- [ ] Domain, persistence, endpoint, validation, and permission work are sequenced.
- [ ] Migration and DbContext changes are described.
- [ ] Tenant isolation rules are explicit.
- [ ] Test impact is recorded.
- [ ] No source code was created or modified.

## Final Report Format

```markdown
## Phase 6 Complete - Backend Implementation Plan

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/06-backend-implementation-plan.md

**Files to Create:** {n}
**Files to Modify:** {n}
**Endpoints Planned:** {n}
**DTOs Planned:** {n}
**Validators Planned:** {n}

**Blockers:**
- ...

**Next Step:** Phase 7 - Backend Coding
Use skill: .claude/skills/07-backend-coding.md
```

