# Skill 03 - Backend Basic Design

## Role

Senior .NET Backend Architect, Domain-Driven Design Expert, Senior Business Analyst.

## Goal

Create the backend basic design document from Phase 1 Frontend Basic Design, Phase 2 Frontend UI Pixel Analysis, feature config, and available input sources. Define backend scope, domain model, database design, API draft, DTOs, validation, permissions, multi-tenant behavior, and security notes. Do not write code in this phase.

## Input

- `docs/features/{feature-name}/config.yaml`
- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-name}/images/`
- `docs/features/{feature-name}/references/images/`
- `docs/features/{feature-name}/references/markdown/`

## Output

```text
docs/features/{feature-name}/03-backend-basic-design.md
```

## Required Output Sections

```markdown
# Backend Basic Design: {Feature Name}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Feature Config Summary
## 2. Backend Input Analysis
## 3. Source Review
## 4. Business Capability Extraction
## 5. Backend Feature Comparison
## 6. Backend Gap Analysis
   ### 6.1 Missing Backend Capabilities
   ### 6.2 Extra Backend Capabilities
   ### 6.3 Conflicting Backend Requirements
   ### 6.4 Backend Open Questions
## 7. Confirmed Backend Scope
## 8. Domain Design
## 9. Database Design
## 10. Backend API Draft Based on Confirmed Scope
## 11. DTO Design
## 12. Validation Rules
## 13. Business Rules
## 14. Multi-tenant Rules
## 15. Authentication & Authorization
## 16. Error Handling
## 17. Logging
## 18. Performance Considerations
## 19. Security Considerations
## 20. Backend Decision Log
## 21. Acceptance Criteria
## 22. Unclear / Incomplete Items
## 23. Definition of Done
```

## Required Tables

### Business Capability Extraction

| Capability | Source | Description | Backend Required? | Notes |
|------------|--------|-------------|-------------------|-------|

**Backend Required? values:** `Yes` / `No` / `Need Confirmation` / `Later`

### Backend Feature Comparison

| Capability | Current UI | Reference UI | Reference Markdown | Backend Impact | Decision |
|------------|------------|--------------|--------------------|----------------|----------|

**Backend Impact values:** `API Required` / `Database Required` / `Validation Required` / `Permission Required` / `Background Job Required` / `Export Required` / `No Backend Impact` / `Need Confirmation`

**Decision values:** `Implement` / `Do Not Implement` / `Need Confirmation` / `Defer`

### Backend Open Questions

| # | Question | Context | Impact | Must Resolve Before Phase 4? |
|---|----------|---------|--------|------------------------------|

## Rules

1. Do not write code in this phase.
2. Do not create files inside `accounting_api/` or `accounting_web/`.
3. Only create the backend design document under `docs/features/{feature-name}/`.
4. Read Phase 1 and Phase 2 outputs before designing backend behavior.
5. Design backend behavior only for confirmed or explicitly required capabilities.
6. Mark `Need Confirmation` features as pending; do not include them as final implementation requirements.
7. Do not add database fields only because a reference UI contains them; tie fields to business need, current UI, or documentation.
8. If markdown contains business rules not visible in UI, include them with clear source attribution.
9. If UI contains actions without business explanation, add open questions.
10. Do not expose EF entities directly; design DTOs.
11. Include permission and multi-tenant design for every confirmed endpoint.
12. Include soft delete and audit fields where the entity is business-critical.
13. Add all blocking uncertainties to `issues.md`.

## File Path Rules

| Input | Path |
|-------|------|
| Frontend Basic Design | `docs/features/{feature-name}/01-frontend-basic-design.md` |
| Frontend UI Pixel Analysis | `docs/features/{feature-name}/02-frontend-ui-pixel-analysis.md` |
| Current UI images | `docs/features/{feature-name}/images/` |
| Reference UI images | `docs/features/{feature-name}/references/images/` |
| Reference markdown | `docs/features/{feature-name}/references/markdown/` |

| Output | Path |
|--------|------|
| Design document | `docs/features/{feature-name}/03-backend-basic-design.md` |

## Completion Checklist

- [ ] Phase Status block is present.
- [ ] All required inputs are listed as Found or Missing.
- [ ] Backend capabilities are extracted from all relevant sources.
- [ ] Backend feature comparison includes impact and decision values.
- [ ] Backend gap analysis covers missing, extra, conflict, and unclear items.
- [ ] Confirmed backend scope is explicit.
- [ ] Domain model, database design, DTOs, and validation rules are documented.
- [ ] API draft includes only confirmed or clearly marked pending endpoints.
- [ ] Permission and multi-tenant behavior are defined.
- [ ] Open questions are recorded with blocking status.
- [ ] No source code was created or modified.

## Final Report Format

```markdown
## Phase 3 Complete - Backend Basic Design

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/03-backend-basic-design.md

**Backend Design Summary:**
- Capabilities extracted: {n}
- Capabilities confirmed: {n}
- API endpoints drafted: {n}
- DTOs designed: {n}
- Permissions defined: {n}

**Open Questions (Must Resolve Before Phase 4):**
1. ...

**Next Step:** Phase 4 - Backend API Contract Review
Use skill: .claude/skills/04-backend-api-contract-review.md
```
