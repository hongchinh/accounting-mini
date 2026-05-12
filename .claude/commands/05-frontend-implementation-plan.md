# Skill 05 - Frontend Implementation Plan

## Role

Senior React Frontend Architect.

## Goal

Create the frontend implementation plan from Phase 1 Frontend Basic Design, Phase 2 UI Pixel Analysis, and Phase 4 API Contract. List files to create or modify, implementation order, data flow, API mapping, query key strategy, permission strategy, state handling, and visual implementation strategy. Do not write code in this phase.

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-name}/04-api-contract-review.md`
- Existing frontend project conventions in `accounting_web/`

## Output

```text
docs/features/{feature-name}/05-frontend-implementation-plan.md
```

## Required Output Sections

```markdown
# Frontend Implementation Plan: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Goal
## 2. Scope
## 3. Dependencies
## 4. API Contract Mapping
## 5. UI Pixel Spec Mapping
## 6. File Change Plan
## 7. Implementation Steps
## 8. Data Flow
## 9. Query Key Strategy
## 10. Permission Strategy
## 11. Multi-tenant Strategy
## 12. Pixel-perfect Coding Strategy
## 13. Risk & Mitigation
## 14. Checklist Before Coding
## 15. Unclear / Incomplete Items
## 16. Definition of Done
```

## Required Tables

### File Change Plan

| # | File Path | New/Modify | Purpose | Priority |
|---|-----------|------------|---------|----------|

Every frontend file path must start with `accounting_web/`.

### API Contract Mapping

| UI Action | Hook / Service | Method | Endpoint | Request | Response | Permission |
|-----------|----------------|--------|----------|---------|----------|------------|

### UI Pixel Spec Mapping

| UI Area | Phase 2 Spec Reference | Implementation Notes | Risk |
|---------|------------------------|----------------------|------|

## Rules

1. Do not write code in this phase.
2. Do not modify files in `accounting_web/` in this phase.
3. The Phase 4 API Contract is the source of truth for endpoints, DTOs, field names, and permissions.
4. Phase 2 UI Pixel Analysis is the source of truth for layout, spacing, typography, table behavior, and visual states.
5. Do not list files outside `accounting_web/`.
6. Query keys must include `tenantId`.
7. Include mock data strategy when the backend is not yet available.
8. Include loading, empty, error, and permission states.
9. Include route registration, navigation, and module integration if required.
10. Add unresolved implementation risks to `issues.md`.

## Completion Checklist

- [ ] Phase Status block is present.
- [ ] Scope is explicit and excludes deferred items.
- [ ] API contract mapping covers all UI actions.
- [ ] UI pixel spec mapping references Phase 2.
- [ ] File change plan lists every file to create or modify.
- [ ] Implementation order is clear and dependency-aware.
- [ ] Query key strategy includes tenant isolation.
- [ ] Permission strategy is mapped to actions.
- [ ] Risks and blockers are recorded.
- [ ] No source code was created or modified.

## Final Report Format

```markdown
## Phase 5 Complete - Frontend Implementation Plan

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/05-frontend-implementation-plan.md

**Files to Create:** {n}
**Files to Modify:** {n}

**Implementation Order:**
1. Types and constants
2. API service
3. Query hooks
4. Components
5. Page wiring
6. Route/navigation integration
7. Visual polish from Phase 2

**Blockers:**
- ...

**Next Step:** Phase 6 - Backend Implementation Plan
Use skill: .claude/skills/06-backend-implementation-plan.md
```
