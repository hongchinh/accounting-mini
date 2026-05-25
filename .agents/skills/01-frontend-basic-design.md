# Skill 01 - Frontend Basic Design

## Role

Senior React Frontend Architect, UI/UX Analyst, Senior Business Analyst.

## Goal

Create the frontend basic design document before coding. Analyze all input sources, including current UI, reference UI, and business documentation. Compare features, identify gaps, and produce the UI/UX design and frontend model. Do not write code in this phase.

---

## Input

| Source | Path | Purpose |
|--------|------|---------|
| Current UI images | `docs/features/{feature-name}/images/` | Current UI to implement |
| Reference UI images | `docs/features/{feature-name}/references/images/` | Reference UI, such as MISA, KiotViet, or similar systems |
| Reference markdown docs | `docs/features/{feature-name}/references/markdown/` | Reference business guides and product documentation |
| Business requirements | Description from the user | Features to implement |
| Tech stack info | Description from the user | React, TypeScript, Vite, TailwindCSS, or the actual project stack |

**If any source is missing:** Continue the phase, but clearly record the missing source and its impact in Input Analysis.

---

## Output

```text
docs/features/{feature-name}/01-frontend-basic-design.md
```

---

## Required Output Format

```markdown
# Frontend Basic Design: {Feature Name}

---

# PART A - INPUT ANALYSIS

## A1. Input Sources

| Source | Path | Purpose | Status |
|--------|------|---------|--------|
| Current UI images | docs/features/{feature-name}/images/ | Current UI to implement | Found / Missing |
| Reference UI images | docs/features/{feature-name}/references/images/ | Reference UI | Found / Missing |
| Reference markdown docs | docs/features/{feature-name}/references/markdown/ | Business reference guides | Found / Missing |

**Missing Inputs:** List missing sources and their impact.

---

## A2. Current UI Analysis

> Analyze each image in `docs/features/{feature-name}/images/`.

### A2.1 Screens Identified

| Screen | File | Description |
|--------|------|-------------|

### A2.2 Layout Analysis

| Screen | UI Area | Observed Elements | Notes |
|--------|---------|-------------------|-------|

### A2.3 Current Feature Inventory

| Feature / Capability | UI Area | Elements | Notes |
|----------------------|---------|----------|-------|

### A2.4 Unclear Points from Current UI

| Item | Screenshot | Why Unclear |
|------|------------|-------------|

---

## A3. Reference UI Analysis

> Analyze each image in `docs/features/{feature-name}/references/images/`.

### A3.1 Reference Screens Identified

| Screen | File | Source System | Description |
|--------|------|---------------|-------------|

### A3.2 Layout Analysis

| Reference Screen | UI Area | Observed Elements | Suggested Usage |
|------------------|---------|-------------------|-----------------|

### A3.3 Reference Feature Inventory

| Feature / Capability | UI Area | Elements | Notes |
|----------------------|---------|----------|-------|

### A3.4 UX Patterns Worth Adopting

| Pattern | Reference Source | Description | Recommendation |
|---------|------------------|-------------|----------------|

---

## A4. Reference Markdown Analysis

> Analyze each file in `docs/features/{feature-name}/references/markdown/`.

### A4.1 Documents Processed

| Document | File | Summary |
|----------|------|---------|

### A4.2 Business Capabilities Extracted

| Capability | Source Document | Description | Impact on Design |
|------------|-----------------|-------------|------------------|

### A4.3 Business Rules Extracted

| Rule | Source | Description | Impact on Design |
|------|--------|-------------|------------------|

### A4.4 Validation Rules Extracted

| Field / Action | Rule | Source | Impact |
|----------------|------|--------|--------|

### A4.5 User Flows Extracted

| Flow | Steps | Source | Notes |
|------|-------|--------|-------|

### A4.6 Terminology Glossary

| Term | Definition | Source |
|------|------------|--------|

---

## A5. Feature Comparison Matrix

> Compare features across three sources: Current UI / Reference UI / Reference Markdown.

| Feature / Capability | Current UI | Reference UI | Reference Markdown | Status | Decision |
|----------------------|------------|--------------|--------------------|--------|----------|

**Status values:**
- `Matched` - present in all three sources
- `Missing in Current UI` - present in references but not visible in the current UI
- `Missing in Reference UI` - present in the current UI but not visible in references
- `Mentioned in Docs Only` - present only in markdown, not visible in any UI
- `UI Only` - visible only in UI, not mentioned in docs
- `Conflict` - sources contradict each other
- `Unclear` - not enough information to decide

**Decision values:**
- `Implement` - implement it
- `Do Not Implement` - exclude it from scope
- `Need Confirmation` - requires user confirmation
- `Defer` - defer to a later phase
- `Backend Only` - backend only, no frontend UI needed
- `Frontend Only` - frontend only, no backend API needed

---

## A6. Gap Analysis

### A6.1 Missing Features

> Features present in references but not visible in the current UI.

| Feature | Found In | Missing From | Impact | Recommendation |
|---------|----------|--------------|--------|----------------|

### A6.2 Extra Features

> Features present in the current UI but not visible in references.

| Feature | Found In | Not Found In | Risk | Recommendation |
|---------|----------|--------------|------|----------------|

### A6.3 Conflicting Features

> Contradictions between sources.

| Topic | Current UI | Reference UI | Reference Markdown | Conflict | Proposed Resolution |
|-------|------------|--------------|--------------------|----------|---------------------|

### A6.4 Unclear Items - Open Questions

> Items that do not have enough information and require user confirmation.

| # | Question | Context | Options | Recommended Default |
|---|----------|---------|---------|---------------------|

---

## A7. Confirmed Frontend Scope

> Frontend scope confirmed after analysis.

| Feature | Include? | Reason | Source |
|---------|----------|--------|--------|

**Include? values:** `Yes` / `No` / `Need Confirmation` / `Later`

---

## A8. Updated Frontend API Needs

> API needs inferred from all input sources, not only from the current UI.

| UI Action | Required By | Method Draft | Endpoint Draft | Request | Response | Notes |
|-----------|-------------|--------------|----------------|---------|----------|-------|

**Required By values:** `Current UI` / `Reference UI` / `Reference Markdown` / `Business Rule` / `Derived`

---

## A9. Frontend Basic Design Decision Log

| # | Decision | Reason | Source | Impact |
|---|----------|--------|--------|--------|

**Source values:** `Current UI` / `Reference UI` / `Reference Markdown` / `Assumption` / `User Confirmation Needed`

---

# PART B - FRONTEND DESIGN

## 1. Overview
### 1.1 Purpose
### 1.2 Business Context
### 1.3 Target Users
### 1.4 Related Screens

---

## 2. Screen Layout
### 2.1 Page Structure
Describe the overall layout: header, breadcrumb, toolbar, filter, grid, pagination, and dialogs.

### 2.2 Toolbar Area
Action buttons: Add, Edit, Delete, Export, and bulk actions.

### 2.3 Filter Area
Search boxes, dropdown filters, date range filters, and similar controls.

### 2.4 Data Grid / Table
Column list, sortable columns, action columns, row selection, and grid behavior.

### 2.5 Summary Cards
Overview metrics if available, such as total count, total amount, or active count.

### 2.6 Detail / Form Dialog
Popup or drawer behavior for create, update, and detail view.

### 2.7 Pagination
Strategy: server-side or client-side, page size options, and pagination controls.

### 2.8 Notifications / Toast
Success, error, and warning messages.

---

## 3. Component Design
### 3.1 Component Tree
Component hierarchy from the page component to leaf components.

### 3.2 Component Responsibilities
What each component does, what props it receives, and what events it emits.

### 3.3 Props & Events
| Component | Props | Events |
|-----------|-------|--------|

---

## 4. Frontend Data Model (TypeScript)
### 4.1 List Item Type
### 4.2 Detail Type
### 4.3 Query Params
### 4.4 Create Request
### 4.5 Update Request
### 4.6 Summary Type
### 4.7 Enum Types

---

## 5. Frontend API Needs (Final - from A8)

> Summary from A8. This is the frontend expectation, not the final API contract.

| UI Action | Required By | Method | Endpoint (expected) | Request | Response |
|-----------|-------------|--------|---------------------|---------|----------|

---

## 6. State Management
### 6.1 URL / Query State
- keyword
- filters, such as status, group, date range
- pageIndex
- pageSize
- sortBy
- sortDirection

### 6.2 UI State
- selectedRows
- loading
- error
- modalOpen, such as add/edit/detail/delete confirm
- activeTab

### 6.3 Server State (React Query)
- listQuery for paged data
- detailQuery
- summaryQuery

### 6.4 Permission State
- canCreate
- canUpdate
- canDelete
- canExport

---

## 7. User Interaction
### 7.1 Load List
### 7.2 Search
### 7.3 Filter
### 7.4 Sort
### 7.5 Pagination
### 7.6 Row Select
### 7.7 Add New
### 7.8 Edit
### 7.9 Delete Single
### 7.10 Delete Bulk
### 7.11 Export
### 7.12 View Detail
Describe each interaction flow.

---

## 8. Validation Rules (Frontend)
| Field | Rule | Message | Source |
|-------|------|---------|--------|

---

## 9. Permission Rules
| Action | Required Permission | UI Behavior if Missing | Source |
|--------|---------------------|------------------------|--------|

---

## 10. Multi-tenant Rules
- Read tenantId from tenant context. Do not hard-code it.
- React Query keys must include tenantId.
- Reload data when the tenant changes.
- Do not store tenantId as a hard-coded localStorage value.

---

## 11. Loading / Empty / Error States
| State | Component | Behavior |
|-------|-----------|----------|
| Loading | Skeleton / Spinner | ... |
| Empty | EmptyState component | ... |
| Error | ErrorAlert component | ... |
| No permission | PermissionDenied | ... |

---

## 12. Responsive Behavior
| Breakpoint | Behavior |
|------------|----------|

---

## 13. Acceptance Criteria
- [ ] ...

---

## 14. Open Questions
Summary from A6.4: questions that must be confirmed before moving to Phase 2.

| # | Question | Context | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------|---------------------|------------------------------|
```

---

## Rules

1. Do not write code in this phase.
2. Do not create files inside `accounting_web/` in this phase.
3. Only create the design document at `docs/features/{feature-name}/01-frontend-basic-design.md`.
4. Analyze all image files in `docs/features/{feature-name}/images/` if present.
5. Analyze all image files in `docs/features/{feature-name}/references/images/` if present.
6. Analyze all markdown files in `docs/features/{feature-name}/references/markdown/` if present.
7. Do not skip the Feature Comparison Matrix (A5).
8. Do not skip Gap Analysis (A6).
9. Do not independently implement features with status `Conflict` or `Unclear`; mark them as `Need Confirmation`.
10. If markdown and images conflict, prefer `Need Confirmation`.
11. If the reference UI has a feature that the current UI does not have, do not implement it by default. Mark it as `Missing in Current UI` and provide a recommendation.
12. The TypeScript model in Section 4 is an expectation and may change after API Contract Review.
13. Always write Multi-tenant and Permission sections, even for simple features.
14. Validation rules must include client-side validation. Do not wait for the server to define every validation rule.

---

## File Path Rules

| Output | Path |
|--------|------|
| Design document | `docs/features/{feature-name}/01-frontend-basic-design.md` |

**Do not create any file inside `accounting_web/` in this phase.**

---

## Completion Checklist

**Part A - Input Analysis:**
- [ ] A1: Input sources are listed and Found/Missing status is recorded.
- [ ] A2: All images in `images/` are analyzed for layout, elements, and unclear points.
- [ ] A3: All images in `references/images/` are analyzed for layout and patterns.
- [ ] A4: All markdown files in `references/markdown/` are analyzed for rules, flows, and glossary.
- [ ] A5: Feature Comparison Matrix is complete with valid Status and Decision values.
- [ ] A6: Gap Analysis includes Missing, Extra, Conflict, and Unclear sections.
- [ ] A7: Confirmed Frontend Scope is complete.
- [ ] A8: Updated Frontend API Needs are inferred from all sources.
- [ ] A9: Decision Log is complete.

**Part B - Frontend Design:**
- [ ] Section 1: Overview includes purpose, business context, and target users.
- [ ] Section 2: Layout fully describes toolbar, filter, grid, pagination, and dialogs.
- [ ] Section 3: Component tree and responsibilities are clear.
- [ ] Section 4: TypeScript model includes all required types.
- [ ] Section 5: API needs summarize A8.
- [ ] Section 6: State management covers URL state, UI state, server state, and permission state.
- [ ] Section 7: User interactions describe all flows.
- [ ] Section 8: Validation rules are listed with sources.
- [ ] Section 9: Permission rules are mapped to each action.
- [ ] Section 10: Multi-tenant rules are included.
- [ ] Section 11: Loading, empty, and error states are included.
- [ ] Section 13: Acceptance criteria are included.
- [ ] Section 14: Open Questions are fully summarized with `Must Resolve Before Phase 2`.
- [ ] No actual implementation code snippets are included.

---

## Final Report Format

```markdown
## Phase 1 Complete - Frontend Basic Design

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/01-frontend-basic-design.md

**Input Analysis Summary:**
- Current UI screens analyzed: {n} images
- Reference UI screens analyzed: {n} images
- Reference markdown docs analyzed: {n} files
- Features in Comparison Matrix: {n}
- Missing features found: {n}
- Extra features found: {n}
- Conflicts found: {n}
- Unclear items: {n}

**Confirmed Scope:**
- Features included: {n}
- Features excluded: {n}
- Features needing confirmation: {n}

**Frontend Design Summary:**
- Components designed: {n}
- API needs identified: {n}
- State variables defined: {n}

**Key Design Decisions:**
1. ...

**Open Questions (Must Resolve Before Phase 2):**
1. ...

**Open Questions (Can Proceed):**
1. ...

**Next Step:** Phase 2 - Frontend UI Pixel Analysis
Use skill: .claude/skills/02-frontend-ui-pixel-analysis.md
```
