---
name: fullstack-feature-workflow
description: Master 13-phase fullstack feature workflow. Auto-detects current phase and runs it. Use with /fullstack-feature-workflow {feature-key}.
---

# Fullstack Feature Workflow

## Role

Principal Fullstack Architect, Senior .NET Backend Architect, Senior React Frontend Architect, Senior Business Analyst, Senior UI Engineer (pixel-perfect), AI Workflow Engineer.

---

## 1. Command Usage

User runs this workflow with:

```
/fullstack-feature-workflow {feature}
```

Example:

```
/fullstack-feature-workflow suppliers
```

When this command is received, AI must execute the following steps **in order**, without skipping:

1. Treat `{feature}` as the feature identifier.
2. Search for a matching config in `docs/features/*/config.yaml`.
3. Match config by field `feature: {feature}` - or by folder name if no match.
4. Use the matched folder as the feature folder.
5. Read `config.yaml` - only the fields needed for the current phase (see Section 42).
6. Inspect input folders.
7. Read or create `workflow-status.md`.
8. Read or create `issues.md`.
9. Read or create `visual-review-issues.md` if `visual_review.enabled: true` in config.
10. Detect the next incomplete phase using `workflow-status.md` (not only file existence).
11. Run **only that phase**.
12. Update `workflow-status.md`, `issues.md`, and `visual-review-issues.md` as needed.
13. Stop and wait for user review.
14. Do not run the next phase until previous phase is explicitly approved.

If multiple configs match, ask the user to clarify which feature to run.

If no config matches, ask the user to create the config using the template at `.claude/templates/feature-config.template.yaml`.

---

## 2. Config Rules

Every feature must have a config file at:

```
docs/features/{feature-folder}/config.yaml
```

### Config must be compact

- `config.yaml` must contain **only feature-specific data** - no long comments, no usage guides, no explanations.
- Field meanings and usage guidance belong in `.claude/templates/feature-config-guide.md`.
- AI must not copy content from the config guide into phase output documents.
- AI must not repeat the full config block in phase output documents - reference relevant field values only.

### Minimum config

```yaml
role: web
feature: suppliers
name_vi: Supplier Management
output_type: markdown
```

### Recommended config

```yaml
role: fullstack
feature: suppliers
folder: suppliers
name_vi: Supplier Management
name_en: Supplier Management
output_type: markdown
language: en

workflow_mode: full
documentation_level: standard

project:
  backend: accounting_api
  frontend: accounting_web

input:
  current_ui_images: docs/features/suppliers/images
  reference_ui_images: docs/features/suppliers/references/images
  reference_markdown: docs/features/suppliers/references/markdown
  actual_ui_images: docs/features/suppliers/actual

cost_optimization:
  enabled: true
  max_output: concise
  avoid_repeating_previous_docs: true
  summarize_existing_content: true
  only_expand_when_requested: true
  max_table_rows: 20
  max_doc_lines: 250

visual_review:
  enabled: true
  level: strict
  require_actual_screenshot: true
  block_on_critical: true
  block_on_high: true

entities:
  - Supplier

permissions:
  - supplier.view
  - supplier.create
  - supplier.update
  - supplier.delete
  - supplier.export
  - supplier.bulkDelete
  - supplier.updateAddress
```

### Missing fields

If optional fields are missing, AI must:
1. Apply workflow defaults for the current phase.
2. Record each assumption in `docs/features/{feature-folder}/issues.md` as type `Assumption`.
3. **Not** stop or ask the user unless the missing field is required for correctness.

AI must **not** read the full config guide (`feature-config-guide.md`) on every run - only read it if the user explicitly requests field explanations or if a field value is ambiguous.

---

## 3. Input Folder Rules

For every feature, AI must inspect the following folders:

| # | Folder | Purpose |
|---|--------|---------|
| 1 | `docs/features/{feature-folder}/images/` | Current UI/UX images of the web/app being implemented |
| 2 | `docs/features/{feature-folder}/references/images/` | Reference UI/UX images (MISA, KiotViet, other software) |
| 3 | `docs/features/{feature-folder}/references/markdown/` | Reference business documents, usage guides, product manuals |
| 4 | `docs/features/{feature-folder}/actual/` | Actual implementation screenshots (for Phase 9 Visual Review) |

**Rules:**
- AI must not ignore these folders.
- If a folder does not exist or is empty, AI must continue but must report it in **Missing Inputs**.
- AI must read and analyze **all files** found in these folders.
- If images exist, AI must describe what it observes in layout, components, fields, actions.
- If markdown exists, AI must extract business rules, validation rules, user flows, terminology.

---

## 4. Workflow Phases

The workflow has exactly **13 phases** in strict order:

| Phase | Stage | Name | Output File |
|------:|-------|------|-------------|
| 1 | Design | Frontend Basic Design | `01-frontend-basic-design.md` |
| 2 | Design | Frontend UI Pixel Analysis | `02-frontend-ui-pixel-analysis.md` |
| 3 | Design | Backend Basic Design | `03-backend-basic-design.md` |
| 4 | Design | Backend API Contract Review | `04-api-contract-review.md` |
| 5 | Planning | Frontend Implementation Plan | `05-frontend-implementation-plan.md` |
| 6 | Planning | Backend Implementation Plan | `06-backend-implementation-plan.md` |
| 7 | Coding | Backend Coding | Source code in `accounting_api/` + `07-backend-coding-summary.md` |
| 8 | Coding | Frontend Coding | Source code in `accounting_web/` + `08-frontend-coding-summary.md` |
| 9 | Verification | Frontend Visual Review | `09-frontend-visual-review.md` + `visual-review-issues.md` |
| 10 | Verification | Backend Test | `10-backend-test-plan.md` + test code |
| 11 | Verification | Frontend Test | `11-frontend-test-plan.md` + test code |
| 12 | Verification | Integration Test | `12-integration-test-plan.md` |
| 13 | Closure | Final Feature Review | `13-final-feature-review.md` |

**Rationale for phase order:**
- Phase 1 (Frontend Basic Design) analyzes UI and business scope first.
- Phase 2 (Frontend UI Pixel Analysis) extracts layout, spacing, design tokens early - before backend design, so backend knows data requirements.
- Phase 3 (Backend Basic Design) uses both Frontend Basic Design AND UI Pixel Analysis as input.
- Phase 4 (Backend API Contract Review) is the hard gate before all planning and coding.
- Phase 5 (Frontend Implementation Plan) and Phase 6 (Backend Implementation Plan) are independent of each other — they may run in parallel. Default workflow runs them sequentially; to parallelize, user starts two separate workflow sessions after Phase 4 is approved.
- Phase 7 (Backend Coding) before Phase 8 (Frontend Coding) - backend API must exist before frontend calls it.
- Phase 9 (Frontend Visual Review) after coding, requires actual screenshots.
- Phase 10 (Backend Test) and Phase 11 (Frontend Test) are independent of each other — same parallel opportunity as Phase 5/6.
- Phase 13 (Final Feature Review) closes the feature.

**Mandatory order rules:**
- AI must follow phases in order.
- AI must not skip phases unless `workflow_mode` in config explicitly allows it.
- AI must not write any code before Phase 7 (Backend Coding) or Phase 8 (Frontend Coding).
- AI must not start Phase 8 without Phase 2 (UI Pixel Analysis) approved.
- AI must not start Phase 9 without actual screenshots.
- AI must not run Phase 11 (Frontend Test) if Phase 9 has Critical or High visual issues.

**Phase status values (in `workflow-status.md`):** `Not Started` / `In Progress` / `Completed` / `Blocked` / `Skipped`

Phases may be `Skipped` when `workflow_mode` in config excludes them. A skipped phase must be recorded in `workflow-status.md` as `Status = Skipped` / `Review Status = Not Required`. See Section 35 (Adaptive Workflow Mode) for full rules.

---

## 5. Phase Completion Detection

**AI must read `workflow-status.md` first** - do not rely only on output file existence.

A document phase is complete only if the output file exists **and** contains one of these status blocks near the top:

**Completed - no blocking issues:**
```markdown
## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No
```

**Completed - has non-blocking questions:**
```markdown
## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: Yes
```

**Blocked - has blocking issues:**
```markdown
## Phase Status
Status: Blocked
Blocking Issues: Yes
User Confirmation Required: Yes
```

For Phase 4 only, use the Approval Status block instead:
```markdown
## Approval Status
Status: Approved | Changes Required
Blocking Issues: Yes | No
User Confirmation Required: Yes | No
```

**Important:** Phase 4 status must only be `Approved` or `Changes Required`. Do not use `Approved with changes`.

If a file exists but the status marker is absent, AI must treat it as **incomplete** and ask the user whether to rebuild it or add the status.

**Rules:**
- If any item in `## Unclear / Incomplete Items` has `Required Before Next Phase? = Yes`, then `Blocking Issues` must be `Yes`.
- If any question has `Blocking? = Yes`, then `Blocking Issues` must be `Yes`.
- A phase with `Blocking Issues: Yes` cannot be treated as complete for gate purposes.

Phase 7 (Backend Coding) is complete if source files matching the backend implementation plan exist inside `accounting_api/` and `07-backend-coding-summary.md` exists.

Phase 8 (Frontend Coding) is complete if source files matching the frontend implementation plan exist inside `accounting_web/` and `08-frontend-coding-summary.md` exists.

Phase 9 (Frontend Visual Review) is complete only if actual implementation screenshots exist AND the review document has `## Phase Status: Status: Completed` AND `## Frontend Visual Status` is `Approved` or `Approved with minor issues`, with no unresolved Critical/High issues in `visual-review-issues.md`.

---

## 6. Automatic Phase Detection

When the user runs `/fullstack-feature-workflow {feature}`, AI must:

1. Find and read `config.yaml`.
2. Determine the feature folder.
3. Read `workflow-status.md` if it exists.
4. Read `issues.md` if it exists.
5. Read `visual-review-issues.md` if relevant.
6. Check the status of each phase in `workflow-status.md` first, then verify output files.
7. Identify the **earliest incomplete phase** (Status != Completed, or Review Status != Approved).
8. Check all phase gate conditions for that phase.
9. If gate conditions are not met, report which gate is blocking.
10. If gate conditions are met, run **only that phase**.
11. Update tracking files.
12. Report the result and next step.
13. Stop and wait for user review.

**Example:**
- Phase 1 Completed + Approved -> skip.
- Phase 2 Completed + Approved -> skip.
- Phase 3 Not Started -> **check gate, then run Phase 3**.

---

## 7. Phase Gates

### Gate before Phase 2 (Frontend UI Pixel Analysis)
- `01-frontend-basic-design.md` must exist.
- Phase 1 Review Status in `workflow-status.md` must be `Approved`.
- No Open item with `Blocking? = Yes` from Phase 1 in `issues.md`.

### Gate before Phase 3 (Backend Basic Design)
- `01-frontend-basic-design.md` must exist.
- `02-frontend-ui-pixel-analysis.md` must exist.
- Phase 1 Review Status must be `Approved`.
- Phase 2 Review Status must be `Approved`.
- No Open item with `Blocking? = Yes` from Phase 1 or Phase 2 in `issues.md`.

### Gate before Phase 4 (Backend API Contract Review)
- `01-frontend-basic-design.md` must exist.
- `02-frontend-ui-pixel-analysis.md` must exist.
- `03-backend-basic-design.md` must exist.
- Phase 1 Review Status must be `Approved`.
- Phase 2 Review Status must be `Approved`.
- Phase 3 Review Status must be `Approved`.
- No Open item with `Blocking? = Yes` from Phase 1, Phase 2, or Phase 3 in `issues.md`.
- **Exception:** If Phase 3 is `Skipped` (by `workflow_mode`), all Phase 3 conditions above are waived.

### Gate before Phase 5 (Frontend Implementation Plan)
- `01-frontend-basic-design.md` must exist.
- `02-frontend-ui-pixel-analysis.md` must exist and Review Status must be `Approved`.
- `04-api-contract-review.md` must exist.
- Phase 4 Approval Status must be `Approved` (not `Changes Required`).
- Phase 2 Review Status must be `Approved`.
- Phase 4 Review Status must be `Approved`.
- No Open item with `Blocking? = Yes` from any previous phase in `issues.md`.
- If Phase 4 status is `Changes Required`, **AI must stop**.

### Gate before Phase 6 (Backend Implementation Plan)
- `03-backend-basic-design.md` must exist and Review Status must be `Approved`.
- `04-api-contract-review.md` must exist.
- Phase 4 Approval Status must be `Approved`.
- Phase 3 Review Status must be `Approved`.
- Phase 4 Review Status must be `Approved`.
- No Open item with `Blocking? = Yes` from any previous phase in `issues.md`.

### Gate before Phase 7 (Backend Coding)
- `03-backend-basic-design.md` exists with `Blocking Issues: No`.
- `04-api-contract-review.md` is `Approved` with `Blocking Issues: No`.
- `06-backend-implementation-plan.md` exists and Review Status must be `Approved`.
- **User must explicitly confirm backend coding** - AI must not begin Phase 7 without:
  - `confirm backend coding`
  - If this confirmation is missing, AI must request it in the current conversation — no workflow re-invocation required.
- No Open item with `Blocking? = Yes` in `issues.md`.

### Gate before Phase 8 (Frontend Coding)
- Phase 7 Review Status in `workflow-status.md` must be `Approved`.
  - **Exception:** If `workflow_mode = ui_only`, this condition is waived — Phase 7 is skipped.
- `01-frontend-basic-design.md` exists and Review Status must be `Approved`.
- `02-frontend-ui-pixel-analysis.md` exists and Review Status must be `Approved`.
- `04-api-contract-review.md` is `Approved` with `Blocking Issues: No`.
  - **Exception:** If `workflow_mode = ui_only`, this condition is waived — frontend coding uses mock data with no real API contract.
- `05-frontend-implementation-plan.md` exists and Review Status must be `Approved`.
- **User must explicitly confirm frontend coding** - AI must not begin Phase 8 without:
  - `confirm frontend coding`
  - If this confirmation is missing, AI must request it in the current conversation — no workflow re-invocation required.
- No Open item with `Blocking? = Yes` in `issues.md`.

### Gate before Phase 9 (Frontend Visual Review)
- Phase 8 Review Status in `workflow-status.md` must be `Approved`.
- `08-frontend-coding-summary.md` must exist.
- Actual implementation screenshots must be provided:
  - `docs/features/{feature-folder}/actual/` (folder with image files), OR
  - Screenshots uploaded directly in the conversation.
- If no actual screenshots exist, Phase 9 must be `Blocked` / Waiting for Screenshot: Yes.

### Gate before Phase 10 (Backend Test)
- Phase 7 Backend Coding must be Completed.
- Phase 7 Review Status in `workflow-status.md` must be `Approved`.
- No Open item with `Blocking? = Yes` from Phase 7 in `issues.md`.

### Gate before Phase 11 (Frontend Test)
- Phase 8 Frontend Coding must be Completed.
- Phase 9 Review Status in `workflow-status.md` must be `Approved`.
- No Critical or High visual issues remain Open in `visual-review-issues.md`.
- Note: Phase 9 may be approved when `## Frontend Visual Status` is `Approved` or `Approved with minor issues` - both map to Review Status `Approved` in `workflow-status.md`.

### Gate before Phase 12 (Integration Test)
- Phase 10 Backend Test Review Status must be `Approved`.
- Phase 11 Frontend Test Review Status must be `Approved`.
- `04-api-contract-review.md` must be Approved.
- No Open item with `Blocking? = Yes` in `issues.md`.

### Gate before Phase 13 (Final Feature Review)
- Phase 12 Integration Test Review Status must be `Approved`.
- No Open item with `Blocking? = Yes` in `issues.md`.
- No Open Critical or High issues in `visual-review-issues.md`.

---

## 8. File Path Rules

| Layer | Root | Rule |
|-------|------|------|
| Backend source code | `accounting_api/` | All backend code must be created and modified only here |
| Frontend source code | `accounting_web/` | All frontend code must be created and modified only here |
| Feature documents | `docs/features/{feature-folder}/` | All feature docs must be created only here |
| Backend tests | `accounting_api/tests/` | All backend test files must be created only here |
| Frontend tests | `accounting_web/` | All frontend test files must be created only here |

**AI must never:**
- Create backend files in `accounting_web/`
- Create frontend files in `accounting_api/`
- Create feature documents outside `docs/features/{feature-folder}/`

---

## 9. Phase 1 Rules - Frontend Basic Design

**Skill file:** `.claude/skills/01-frontend-basic-design.md`

**Purpose:** Create frontend design document based on all input sources.

**Input:**
- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/images/` - current UI images
- `docs/features/{feature-folder}/references/images/` - reference UI images
- `docs/features/{feature-folder}/references/markdown/` - reference business documents

**Output:** `docs/features/{feature-folder}/01-frontend-basic-design.md`

**Source priority:**
1. Current UI images - main source
2. User requirement / config
3. Reference markdown
4. Reference UI images

**AI must analyze:**
1. Every image in `images/` - describe layout, components, fields, actions, filters, states.
2. Every image in `references/images/` - describe reference patterns and suggestions.
3. Every markdown file in `references/markdown/` - extract business rules, flows, validation, glossary.
4. `config.yaml` - use `name_vi`, `entities`, `permissions`, `capabilities`, `business_rules`.

**AI must compare Current UI vs Reference UI vs Reference Markdown.**

### Required output sections

```
# Frontend Basic Design: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Feature Config Summary
## 2. Input Sources
## 3. Missing Inputs
## 4. Current UI Analysis
## 5. Reference UI Analysis
## 6. Reference Markdown Analysis
## 7. Feature Comparison Matrix
## 8. Gap Analysis
   ### 8.1 Missing Features
   ### 8.2 Extra Features
   ### 8.3 Conflicting Features
   ### 8.4 Unclear Items
## 9. Confirmed Frontend Scope
## 10. Screen Layout
## 11. Component Design
## 12. Frontend Data Model
## 13. Updated Frontend API Needs
## 14. State Management
## 15. User Interaction
## 16. Validation Rules
## 17. Permission Rules
## 18. Multi-tenant Rules
## 19. Loading / Empty / Error States
## 20. Responsive Behavior
## 21. Frontend Decision Log
## 22. Acceptance Criteria
## 23. Unclear / Incomplete Items
## 24. Definition of Done
```

### Feature Comparison Matrix (required)

| Feature / Capability | Current UI | Reference UI | Reference Markdown | Status | Decision |
|---|---|---|---|---|---|

**Allowed Status values:**
- `Matched`
- `Missing in Current UI`
- `Missing in Reference UI`
- `Mentioned in Docs Only`
- `UI Only`
- `Conflict`
- `Unclear`

**Allowed Decision values:**
- `Implement`
- `Do Not Implement`
- `Need Confirmation`
- `Defer`
- `Backend Only`
- `Frontend Only`

### Visual Companion (tùy chọn) — Phase 1

Khi Phase 1 cần **trình bày lựa chọn thiết kế** cho user (layout, navigation structure,
screen composition), dùng Visual Companion thay vì mô tả bằng chữ.

Xem: `.claude/skills/brainstorming/visual-companion.md`

**Dùng browser khi:**
- Có ≥ 2 layout options cho màn hình chính (list / detail / modal)
- So sánh side-by-side giữa Current UI và Reference UI
- Trình bày wireframe cho Section 10 (Screen Layout) hoặc Section 11 (Component Design)
- Có câu hỏi về spatial arrangement mà chữ khó diễn đạt

**Không dùng browser cho:**
- Feature Comparison Matrix — dùng table trong terminal
- Gap Analysis — text là đủ
- Validation rules, permission rules — text là đủ

**Quick start:**
```
# Windows — Bash tool với run_in_background: true
node scripts/brainstorm-server.js --project-dir <project-root>

# Sau đó đọc state_dir/server-info để lấy URL và screen_dir
```

### Phase 1 restrictions
- Do not create any code in `accounting_web/`.
- Do not create any code in `accounting_api/`.
- Do not finalize backend API contract.
- Do not silently implement features that exist only in reference UI or markdown - mark them clearly.
- Do not ignore conflicts.
- Do not ignore unclear items.
- Any unclear item must be added to `issues.md`.

---

## 10. Phase 2 Rules - Frontend UI Pixel Analysis

**Skill file:** `.claude/skills/02-frontend-ui-pixel-analysis.md`

**Purpose:** Create precise UI implementation specification from screenshots. This phase runs early (before backend design, frontend plan, and frontend coding) so that layout data requirements inform backend design.

**Input:**
- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/images/` - current UI screenshots (main source)
- `docs/features/{feature-folder}/references/images/` - reference UI screenshots
- `docs/features/{feature-folder}/references/markdown/` - if relevant for visual behavior
- Existing style guide if available in the project

**Output:** `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`

Optional support files (create if useful):
- `docs/features/{feature-folder}/ui-spec/design-tokens.md`
- `docs/features/{feature-folder}/ui-spec/layout-measurement.md`
- `docs/features/{feature-folder}/ui-spec/pixel-review-checklist.md`

### Required output sections

```
# Frontend UI Pixel Analysis: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Feature Config Summary
## 2. Screenshot Inventory
## 3. Visual Source Priority
## 4. Layout Measurements
## 5. Design Tokens
## 6. Typography Specification
## 7. Component Measurement Specification
## 8. Grid / Table Specification
## 9. Interaction Visual States
## 10. Pixel-perfect Implementation Rules
## 11. Pixel Review Checklist
## 12. Unclear / Incomplete Items
## 13. Definition of Done
```

### Section 2: Screenshot Inventory

| Image | Type | Purpose | Notes |
|---|---|---|---|

Image Type allowed values: `Current UI` / `Reference UI` / `Actual Implementation` / `Unknown`

### Section 3: Visual Source Priority

| Source | Priority | Usage |
|---|---:|---|
| Current UI images | 1 | Main source for pixel implementation |
| Reference UI images | 2 | UX/reference patterns only |
| Reference markdown | 3 | Business behavior, not pixel style |

Rules:
- Current UI image is the main source for visual implementation.
- Reference UI is used only for missing or unclear UX patterns.
- Reference markdown is for business behavior, not pixel values.

### Section 4: Layout Measurements

| Area | Est. Width | Est. Height | Padding | Margin | Notes |
|---|---:|---:|---|---|---|

Areas to inspect: page, content container, header, breadcrumb, summary cards, toolbar, search box, filter button, action buttons, table/grid, table header, table row, pagination, modal/drawer if visible.

### Section 5: Design Tokens

| Token Name | Value | Usage | Source | Confidence |
|---|---|---|---|---|

Confidence values: `High` / `Medium` / `Low`

Required tokens to extract: page background, card background, border color, primary color, danger color, text primary, text secondary, muted text, table header background, table row background, button height, input height, toolbar height, table header height, table row height, page padding, card padding, border radius, icon size.

### Section 6: Typography Specification

| Element | Font Size | Font Weight | Line Height | Color | Notes |
|---|---:|---:|---:|---|---|

Elements: page title, breadcrumb, summary card title, summary card value, toolbar button text, input text, table header text, table cell text, pagination text.

### Section 7: Component Measurement Specification

| Component | Height | Width | Padding | Gap | Radius | Border | Notes |
|---|---:|---:|---|---|---:|---|---|

Components: Header, Summary Card, Toolbar, Button, Search Input, Dropdown, Data Grid, Table Header, Table Row, Pagination.

### Section 8: Grid / Table Specification

| Column | Est. Width | Alignment | Header Text | Cell Behavior | Notes |
|---|---:|---|---|---|---|

Rules:
- Money columns align right.
- Text columns align left.
- Action columns align center or follow screenshot.
- Long text should ellipsis or wrap based on screenshot.
- Negative money displays red and parentheses if required by Basic Design.

### Section 9: Interaction Visual States

| Element | State | Expected Visual | Source | Notes |
|---|---|---|---|---|

States: hover, focus, selected row, checked row, disabled button, dropdown open, loading, empty, error.

If state not visible in screenshots, mark as assumption.

### Section 10: Pixel-perfect Implementation Rules

AI must follow these rules during Phase 8 Frontend Coding:
- Do not approximate layout casually.
- Use design tokens from this document.
- Use explicit height/spacing where specified.
- Do not replace visible UI elements with a different design.
- Do not change visual hierarchy from screenshot.
- Do not add extra shadows, colors, borders unless visible or specified.
- Do not hide visible buttons or actions.
- Do not invent UI interactions that are not in scope.
- If unsure, mark as assumption and ask.

### Section 11: Pixel Review Checklist

| Area | Check | Expected | Status |
|---|---|---|---|

Checklist must include: page background, header spacing, breadcrumb, summary card spacing, toolbar order, toolbar height, button height, search input width/height, icon size, table header background, table header height, table row height, column widths, cell padding, text alignment, pagination position, dropdown/action menu.

### Phase 2 restrictions

AI must not:
- Create frontend source code.
- Create backend source code.
- Modify API contract.
- State exact pixel values without marking confidence level.
- Treat `Low` confidence estimates as confirmed measurements.
- Skip design token output if any color/spacing is visible.
- Any unclear visual detail must be added to `issues.md`.

---

## 11. Phase 3 Rules - Backend Basic Design

**Skill file:** `.claude/skills/03-backend-basic-design.md`

**Purpose:** Create backend design document based on Phase 1, Phase 2, and all input sources.

**Input:**
- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/01-frontend-basic-design.md` - read entirely: Confirmed Frontend Scope, Updated Frontend API Needs, Gap Analysis, Unclear Items
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md` - read for data requirements implied by UI layout
- `docs/features/{feature-folder}/images/`
- `docs/features/{feature-folder}/references/images/`
- `docs/features/{feature-folder}/references/markdown/`

**Output:** `docs/features/{feature-folder}/03-backend-basic-design.md`

### Required output sections

```
# Backend Basic Design: {name_vi}

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

### Business Capability Extraction table (required)

| Capability | Source | Description | Backend Required? | Notes |
|---|---|---|---|---|

**Allowed Backend Required values:** `Yes` / `No` / `Need Confirmation` / `Later`

### Backend Feature Comparison table (required)

| Capability | Current UI | Reference UI | Reference Markdown | Backend Impact | Decision |
|---|---|---|---|---|---|

**Allowed Backend Impact values:**
- `API Required`
- `Database Required`
- `Validation Required`
- `Permission Required`
- `Background Job Required`
- `Export Required`
- `No Backend Impact`
- `Need Confirmation`

**Allowed Decision values:** `Implement` / `Do Not Implement` / `Need Confirmation` / `Defer`

### Backend Open Questions format

| # | Question | Context | Impact If Not Clarified | Recommended Default | Must Resolve Before Phase 4? |
|---|----------|---------|------------------------|---------------------|-------------------------------|

### Phase 3 restrictions
- Do not create any code in `accounting_api/`.
- Do not create any frontend code.
- Do not design API for features marked `Do Not Implement`.
- Do not silently add database fields only because a reference image contains them.
- Do not ignore frontend open questions from Phase 1.
- Do not ignore business rules found in reference markdown.
- If a capability is unclear but may affect API/database, mark it `Need Confirmation`.
- Do not expose EF entities - always design DTOs separately.
- Any unclear API/database/business rule must be added to `issues.md`.

---

## 12. Phase 4 Rules - Backend API Contract Review

**Skill file:** `.claude/skills/04-backend-api-contract-review.md`

**Purpose:** Compare Phase 1, Phase 2, and Phase 3, resolve all gaps and open questions, produce the final API Contract that serves as **source of truth** for all subsequent phases.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/03-backend-basic-design.md`
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/04-api-contract-review.md`

### Required output sections

```
# Backend API Contract Review: {name_vi}

## Approval Status
Status: Approved | Changes Required
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Review Summary
## 2. Frontend API Needs
## 3. Backend Proposed APIs
## 4. Cross-source Feature Alignment Review
## 5. Gap Analysis
   ### 5.1 Missing Endpoints
   ### 5.2 Method Mismatch
   ### 5.3 Route Mismatch
   ### 5.4 Query Params Mismatch
   ### 5.5 Request Body Mismatch
   ### 5.6 Response Body Mismatch
   ### 5.7 Field Name Mismatch
   ### 5.8 Type Mismatch
   ### 5.9 Permission Mismatch
   ### 5.10 Error Format Mismatch
   ### 5.11 Pagination Mismatch
   ### 5.12 Sorting Mismatch
   ### 5.13 Filtering Mismatch
   ### 5.14 Multi-tenant Mismatch
## 6. Final API Contract
   ### 6.1 Standard Success Response
   ### 6.2 Standard Error Response
   ### 6.3 Pagination Response
   ### 6.4 Base URL Pattern
   ### 6.5 Endpoint Contracts (one section per endpoint)
## 7. DTO Contract
## 8. Permission Contract
## 9. Multi-tenant Contract
## 10. Validation Contract
## 11. Contract Decisions
## 12. Unresolved Questions Before Contract Approval
## 13. Required Changes
## 14. Approval Checklist
## 15. Unclear / Incomplete Items
## 16. Definition of Done
```

**Important: Phase 4 Approval Status must only be:**
- `Approved`
- `Changes Required`

**Do not use `Approved with changes`.**

### Cross-source Feature Alignment Review table (required)

| Feature / Capability | Frontend Scope | Backend Scope | Reference Docs | Alignment Status | Required Action |
|---|---|---|---|---|---|

**Allowed Alignment Status values:**
- `Aligned`
- `Frontend Only`
- `Backend Only`
- `Missing Backend Support`
- `Missing Frontend Support`
- `Conflict`
- `Need Confirmation`

**Allowed Required Action values:**
- `Approve`
- `Update Frontend Design`
- `Update Backend Design`
- `Add API`
- `Remove API`
- `Need User Confirmation`
- `Defer`

### Unresolved Questions format

| # | Question | Source Phase | Context | Impact on Contract | Must Resolve Before Coding? |
|---|----------|-------------|---------|-------------------|------------------------------|

### Approval gate - Status must be `Changes Required` if ANY of these exist:
- Critical mismatch between frontend and backend
- Missing endpoint for a confirmed frontend feature
- Missing permission for any endpoint
- Unclear DTO field type
- Unclear validation rule that affects API or database
- Any unresolved question marked `Must Resolve Before Coding: Yes`
- Tenant rule conflict
- Error response format mismatch

### Approval gate - Status may be `Approved` only when ALL of these are true:
- Frontend scope and backend scope are aligned
- All confirmed frontend features have API support
- Endpoint routes are clear and agreed
- All request and response shapes are clear
- All DTO field names and types are agreed
- All permissions are mapped to endpoints
- Validation behavior is clear
- Paging, filter, and sort behavior is clear
- Multi-tenant behavior is clear
- Error response format is agreed

All API contract issues must be added to `issues.md`.

---

## 13. Phase 5 Rules - Frontend Implementation Plan

**Skill file:** `.claude/skills/05-frontend-implementation-plan.md`

**Purpose:** Create the frontend coding plan based on Phase 1 design, Phase 2 UI Pixel Analysis, and Phase 4 contract.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- `docs/features/{feature-folder}/ui-spec/design-tokens.md` if exists
- `docs/features/{feature-folder}/ui-spec/layout-measurement.md` if exists
- `docs/features/{feature-folder}/ui-spec/pixel-review-checklist.md` if exists
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/05-frontend-implementation-plan.md`

### Required output sections

```
# Frontend Implementation Plan: {name_vi}

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

### Section 5: UI Pixel Spec Mapping

| UI Area | Pixel Spec Source | Component | Implementation Notes |
|---|---|---|---|

### Section 7: Implementation Steps (required order)

1. Types
2. Constants
3. Design tokens (from Phase 2)
4. API service
5. Query key factory
6. React Query hooks
7. Mock data if needed
8. UI components
9. Page
10. Route
11. Permission UI
12. Loading / empty / error states
13. URL query params if needed
14. Visual review checklist setup

### Section 12: Pixel-perfect Coding Strategy

Must include:
- How design tokens will be applied
- How grid column widths will be implemented
- How row and header heights will be enforced
- How spacing values will be controlled
- How visual review will be prepared

**Every frontend file path must start with `accounting_web/`.**

AI must not list backend files in this phase.

---

## 14. Phase 6 Rules - Backend Implementation Plan

**Skill file:** `.claude/skills/06-backend-implementation-plan.md`

**Purpose:** Create the backend coding plan based on Phase 3 design and Phase 4 contract.

**Input:**
- `docs/features/{feature-folder}/03-backend-basic-design.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/06-backend-implementation-plan.md`

### Required output sections

```
# Backend Implementation Plan: {name_vi}

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
## 10. Migration Plan
## 11. Risk & Mitigation
## 12. Checklist Before Coding
## 13. Unclear / Incomplete Items
## 14. Definition of Done
```

**Every backend file path must start with `accounting_api/`.**

AI must not list frontend files in this phase.

---

## 15. Phase 7 Rules - Backend Coding

**Skill file:** `.claude/skills/07-backend-coding.md`

**Purpose:** Implement backend source code.

**Input:**
- `docs/features/{feature-folder}/03-backend-basic-design.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- `docs/features/{feature-folder}/06-backend-implementation-plan.md`

**Output:**
- Backend source code inside `accounting_api/` only.
- `docs/features/{feature-folder}/07-backend-coding-summary.md`

Required confirmation before starting:
- User must say `confirm backend coding`.

AI must read actual project structure before creating files to use the correct namespace and folder conventions.

### Required implementation order

1. Domain entity
2. Enum
3. EF Core configuration
4. DbContext update
5. DTOs
6. Validators
7. MediatR Command / Query / Handler
8. Endpoint (IEndpoint)
9. Permission constants
10. Dependency injection registration
11. Export service (if required)
12. Seed data (if required)
13. Migration command
14. Build / typecheck / test if available

### TDD Enforcement (Phase 7)

Every handler, validator, and endpoint must follow TDD before implementation:

```
1. Write failing test (xUnit) for the behavior
2. Run: dotnet test accounting_api/tests/ --filter "{TestClass}"
3. Verify test FAILS for the right reason
4. Write minimal code to make it PASS
5. Verify PASS + no regression in other tests
```

**Iron Law:** No production code without a failing test first.

Full rules: `.claude/skills/tdd-enforcement.md`

### Per-Task Code Review (Phase 7)

After each task group, run 2-stage review before moving to the next:

| Group | Content | Review when |
|-------|---------|-------------|
| G1 | Entity + Enum + EF Config + DbContext | After G1 done |
| G2 | DTOs + Validators | After G2 done |
| G3 | Command/Query + Handler | After G3 done |
| G4 | Endpoint + Permission + DI | After G4 done |

**Stage 1 — Spec Compliance:** Matches Phase 4 + Phase 6?
**Stage 2 — Code Quality:** Follows AccountingMini conventions?

**3-cycle escalation:** 3 fix cycles without passing → stop, report to user.

Full rules: `.claude/skills/per-task-code-review.md`

### Backend coding rules
- Follow Vertical Slice Architecture with MediatR - no IService or IRepository.
- Do not put business logic in Endpoint.
- Do not expose EF entities directly through API - always use DTOs.
- Use `async/await` and `CancellationToken`.
- Use FluentValidation (auto-run by pipeline behavior).
- Use `Result<T>` pattern - endpoint uses `.Match()` to convert to HTTP response.
- Use `PaginatedList<T>` for list endpoints.
- Enforce tenant isolation via `ITenantEntity` global query filter.
- Enforce permission on every endpoint.
- Do not hard-code `tenantId` or `userId`.
- Avoid unsafe raw SQL.
- Do not modify `accounting_web/`.

### 07-backend-coding-summary.md required sections

```
# Backend Coding Summary: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Files Created
## 2. Files Updated
## 3. API Contract Implementation
## 4. Business Rules Implemented
## 5. Tenant / Permission Implementation
## 6. Validation Implementation
## 7. Migration Notes
## 8. Build / Test / Check Results
## 9. Known Limitations
## 10. Unclear / Incomplete Items
## 11. Definition of Done
```

---

## 16. Phase 8 Rules - Frontend Coding

**Skill file:** `.claude/skills/08-frontend-coding.md`

**Purpose:** Implement pixel-perfect frontend source code based on API Contract and UI Pixel Analysis.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/04-api-contract-review.md` — **Exception:** If `workflow_mode = ui_only`, this file does not exist. Use mock API contract: all API calls return hardcoded data; no real endpoints required.
- `docs/features/{feature-folder}/05-frontend-implementation-plan.md`
- `docs/features/{feature-folder}/ui-spec/design-tokens.md` if exists
- `docs/features/{feature-folder}/ui-spec/layout-measurement.md` if exists
- `docs/features/{feature-folder}/ui-spec/pixel-review-checklist.md` if exists

**Output:**
- Frontend source code inside `accounting_web/` only.
- `docs/features/{feature-folder}/08-frontend-coding-summary.md`

Required confirmation before starting:
- User must say `confirm frontend coding`.

### Required implementation order

1. Types
2. Constants
3. Design tokens (from Phase 2)
4. API service
5. Query key factory
6. React Query hooks
7. Mock data if needed
8. Components
9. Page
10. Route
11. Permission UI
12. Loading / empty / error states
13. URL query params if needed
14. Visual review preparation
15. Typecheck / build / test if available

### TDD Enforcement (Phase 8)

Every hook, component, and page must follow TDD before implementation:

```
1. Write failing test (Vitest + RTL) for the behavior
2. Run: pnpm test --run src/modules/{feature}/
3. Verify test FAILS for the right reason
4. Write minimal code to make it PASS
5. Verify PASS + no regression in other tests
```

**Iron Law:** No production code without a failing test first.

Full rules: `.claude/skills/tdd-enforcement.md`

### Per-Task Code Review (Phase 8)

After each task group, run 2-stage review before moving to the next:

| Group | Content | Review when |
|-------|---------|-------------|
| G1 | Types + Constants + Design tokens | After G1 done |
| G2 | API service + Query key factory + React Query hooks | After G2 done |
| G3 | UI Components | After G3 done |
| G4 | Page + Route + Permission UI + States | After G4 done |

**Stage 1 — Spec Compliance:** Matches Phase 4 + Phase 5 + Phase 2?
**Stage 2 — Code Quality:** Follows AccountingMini conventions?

**3-cycle escalation:** 3 fix cycles without passing → stop, report to user.

Full rules: `.claude/skills/per-task-code-review.md`

### Frontend coding rules
- Follow existing frontend architecture.
- Use API Contract as source of truth - do not invent endpoints.
- Use UI Pixel Analysis as visual source of truth - do not guess layout.
- Use design tokens from Phase 2 instead of hard-coded style values.
- Do not call API directly inside UI components - use service functions.
- Use React Query hooks for all data fetching.
- Use typed DTOs - no `any` unless truly necessary.
- Do not hard-code `tenantId`.
- Do not hard-code permission strings.
- Handle loading, empty, and error states on every screen.
- Respect permission-based UI - hide (not just disable) when no permission.
- Include `tenantId` in query keys.
- Do not modify `accounting_api/`.
- Do not change visual hierarchy from screenshot.
- Do not introduce unrelated UI library styles.
- Do not invent layout if screenshot already shows it.
- Read actual project structure before creating files.

### 08-frontend-coding-summary.md required sections

```
# Frontend Coding Summary: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Files Created
## 2. Files Updated
## 3. API Contract Usage
## 4. UI Pixel Spec Usage
## 5. Design Tokens Created / Used
## 6. Components Implemented
## 7. Visual Review Preparation
## 8. Required Actual Screenshots
## 9. How to Run Frontend
## 10. Build / Test / Check Results
## 11. Known Limitations
## 12. Unclear / Incomplete Items
## 13. Definition of Done
```

### Section 7: Visual Review Preparation

AI must include this section:

```markdown
### Required Actual Screenshots

Please run the frontend app, open the feature screen, and capture actual screenshots.

Save into: docs/features/{feature-folder}/actual/

Recommended screenshots:
- actual-list-full-page.png
- actual-toolbar.png
- actual-grid.png
- actual-pagination.png
- actual-dropdown-open.png (if applicable)
- actual-modal.png (if applicable)

Or upload screenshots directly in the conversation.
```

---

## 17. Phase 9 Rules - Frontend Visual Review

**Skill file:** `.claude/skills/09-frontend-visual-review.md`

**Purpose:** Compare source UI screenshots with actual frontend implementation screenshots and detect visual mismatches.

**Input:**

Required:
- `docs/features/{feature-folder}/images/` - current UI screenshots (main source)
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/08-frontend-coding-summary.md`
- Actual implementation screenshots from:
  - `docs/features/{feature-folder}/actual/`, OR
  - Screenshots uploaded by user directly in the conversation

Optional:
- `docs/features/{feature-folder}/references/images/`
- `docs/features/{feature-folder}/ui-spec/pixel-review-checklist.md`

**Output:**
- `docs/features/{feature-folder}/09-frontend-visual-review.md`
- `docs/features/{feature-folder}/visual-review-issues.md` - updated with all visual issues found

### If actual screenshots are missing

AI must set:

```markdown
## Phase Status
Status: Blocked
Blocking Issues: Yes
User Confirmation Required: Yes
```

And update `workflow-status.md`:
- Waiting for screenshot: Yes

And respond:

```
Frontend Visual Review requires actual implementation screenshots.

Please:
1. Run the frontend app.
2. Open the feature screen.
3. Capture screenshots.
4. Save into: docs/features/{feature-folder}/actual/
   or upload them directly in this conversation.
5. Run /fullstack-feature-workflow {feature} again.
```

AI must not mark Phase 9 completed without actual screenshots.

### Required output sections

```
# Frontend Visual Review: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Screenshot Sources
## 2. Visual Comparison Summary
## 3. Visual Mismatch List
## 4. Pixel Checklist Result
## 5. Component-level Fix Plan
## 6. Approval Decision
## 7. Unclear / Incomplete Items
## 8. Definition of Done
```

### Section 1: Screenshot Sources

| Source | Path / Upload | Status | Notes |
|---|---|---|---|

### Section 2: Visual Comparison Summary

| Area | Match Level | Notes |
|---|---|---|

Match Level values: `Excellent` / `Good` / `Acceptable` / `Poor` / `Missing`

### Section 3: Visual Mismatch List

| ID | Severity | Area | Expected (Source UI) | Actual (Implementation) | Recommendation | File / Component |
|---|---|---|---|---|---|---|

Severity values: `Critical` / `High` / `Medium` / `Low`

**Severity rules:**
- **Critical:** layout broken, missing major UI section, wrong data grid/table, unusable screen.
- **High:** visible mismatch in main layout, toolbar, table, major spacing or color.
- **Medium:** minor spacing, typography, column width, icon alignment.
- **Low:** tiny visual polish issue.

### Section 4: Pixel Checklist Result

| Check | Expected | Actual | Status | Notes |
|---|---|---|---|---|

Status values: `Pass` / `Fail` / `Partial` / `Not Applicable`

### Section 5: Component-level Fix Plan

| Component | Issue IDs | Fix Required | Priority |
|---|---|---|---|

### Section 6: Approval Decision

```markdown
## Frontend Visual Status
[Approved | Approved with minor issues | Changes Required]
```

**Rules:**
- If any Critical issue exists -> `Changes Required`.
- If any High issue exists -> `Changes Required`.
- If only Medium/Low issues exist -> `Approved with minor issues`.
- If no issues or only acceptable Low issues -> `Approved`.

### Visual Companion (tùy chọn) — Phase 9

Phase 9 là phase visual nhất trong workflow. Visual Companion **rất phù hợp** ở đây để
trình bày kết quả so sánh source vs actual cho user duyệt.

Xem: `.claude/skills/brainstorming/visual-companion.md`

**Dùng browser khi:**
- Trình bày Section 2 (Visual Comparison Summary) với side-by-side mockup
- Liệt kê mismatches theo severity (Critical / High / Medium / Low) dưới dạng visual cards
- Hiển thị Section 5 (Component-level Fix Plan) dưới dạng actionable checklist
- User cần approve / reject visually — browser dễ thao tác hơn terminal

**Workflow cho Phase 9:**
1. Khởi động server → bảo user mở URL
2. Viết `comparison.html` — split view: source (left) vs actual (right) cho mỗi area
3. Viết `mismatches.html` — danh sách issues grouped theo severity với `data-choice`
4. User click approve hoặc flag issues cần fix
5. Đọc `state_dir/events` → merge với terminal input → ghi `09-frontend-visual-review.md`

**Không dùng browser cho:**
- Blockers về missing screenshot — thông báo trong terminal, rõ ràng hơn
- Section 6 Approval Decision — yêu cầu text confirm từ user

### Phase 9 restrictions

AI must not:
- Approve visual review without actual screenshots.
- Ignore Critical or High mismatches.
- Mark Phase 9 complete when screen is clearly different from source.
- Fix code during review - create a fix plan only unless user explicitly asks to fix.
- Use reference UI as main source when current UI images exist.
- Claim pixel-perfect match without actual visual comparison.

### Visual Issue Fix Command

When Phase 9 result is `Changes Required`, AI must not allow Phase 11 or Phase 12 to proceed.

When user says:

```
fix visual issues phase 9
```

or:

```
fix visual issues P9
```

or:

```
fix UI according to visual review
```

AI must:
1. Read `docs/features/{feature-folder}/09-frontend-visual-review.md`.
2. Read `docs/features/{feature-folder}/visual-review-issues.md`.
3. Fix Critical and High issues first.
4. Modify only frontend files inside `accounting_web/`.
5. Do not change API logic unless the visual issue requires data display adjustment.
6. Do not modify `accounting_api/`.
7. After fixing, update `docs/features/{feature-folder}/08-frontend-coding-summary.md`.
8. Update `visual-review-issues.md` - mark fixed issues as `Fixed`.
9. Ask user to rerun app and provide new actual screenshots.
10. Keep Phase 9 Review Status as `Pending` until visual review passes.

If user says `fix all visual issues`, AI may also fix Medium and Low issues but must prioritize Critical/High.

### Visual Fix Loop Escalation

AI must track fix cycles for Phase 9 visual issues. After **3 fix cycles** on a Critical or High issue without resolving it:
1. Stop attempting to fix that issue.
2. Mark it as `Escalated` in `visual-review-issues.md`.
3. Report to user: the issue ID, what was attempted (3 cycles of changes), and why it cannot be auto-resolved.
4. Require user decision: accept as-is (downgrade to Medium), defer, or manually fix and re-screenshot.
5. Do not block Phase 11/12 for `Escalated` issues that user has explicitly accepted.

**Fix cycle** = one round of: read visual issues → modify frontend code → ask user for new actual screenshots → AI reviews new screenshots.

---

## 18. Phase 10 Rules - Backend Test

**Skill file:** `.claude/skills/10-backend-testing.md`

**Purpose:** Create backend test plan and backend test code.

**Input:**
- `docs/features/{feature-folder}/03-backend-basic-design.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- `docs/features/{feature-folder}/06-backend-implementation-plan.md`
- Backend source code in `accounting_api/`

**Output document:** `docs/features/{feature-folder}/10-backend-test-plan.md`

**Test code must be inside:** `accounting_api/tests/`

### Required output sections

```
# Backend Test Plan: {name_vi}

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
## 10. Unclear / Incomplete Items
## 11. Definition of Done
```

### Required test scope
- Handler unit tests
- Validator unit tests
- API integration tests (via endpoint)
- Permission tests (401, 403 scenarios)
- Multi-tenant isolation tests (cross-tenant access must fail)
- Error handling tests
- Paging / search / filter / sort tests

AI must not create backend test files outside `accounting_api/tests/`.

---

## 19. Phase 11 Rules - Frontend Test

**Skill file:** `.claude/skills/11-frontend-testing.md`

**Purpose:** Create frontend test plan and frontend test code.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- `docs/features/{feature-folder}/05-frontend-implementation-plan.md`
- Frontend source code in `accounting_web/`

**Output document:** `docs/features/{feature-folder}/11-frontend-test-plan.md`

**Test code must be inside:** `accounting_web/`

### Required output sections

```
# Frontend Test Plan: {name_vi}

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
## 9. Test Commands
## 10. Unclear / Incomplete Items
## 11. Definition of Done
```

### Required test scope
- Component render tests
- Hook tests
- MSW mock handlers
- Permission tests (hide/show based on permissions)
- Loading state tests
- Empty state tests
- Error state tests
- User interaction tests (search, filter, sort, pagination, CRUD)
- Tenant switch tests (if applicable)
- Visual-sensitive component tests where useful

AI must not create frontend test files outside `accounting_web/`.

---

## 20. Phase 12 Rules - Integration Test

**Skill file:** `.claude/skills/12-integration-testing.md`

**Purpose:** Verify frontend and backend work together according to API Contract.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/03-backend-basic-design.md`
- `docs/features/{feature-folder}/04-api-contract-review.md`
- Backend source code in `accounting_api/`
- Frontend source code in `accounting_web/`
- Backend test result from Phase 10
- Frontend test result from Phase 11
- Visual review result from Phase 9

**Output:** `docs/features/{feature-folder}/12-integration-test-plan.md`

### Required output sections

```
# Integration Test Plan: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Integration Scope
## 2. Environment
## 3. Test Data
## 4. API Contract Verification
## 5. End-to-End Scenarios
## 6. Playwright E2E Plan
## 7. Postman / HTTP Test Plan
## 8. Integration Defects Template
## 9. Exit Criteria
## 10. Unclear / Incomplete Items
## 11. Definition of Done
```

### Required E2E scenarios (minimum)

1. Load List
2. Search
3. Filter
4. Pagination
5. Sorting
6. Create
7. Update
8. Delete
9. Permission enforcement (403 from backend, UI hides actions)
10. Tenant Isolation (cross-tenant access returns 404/403)
11. Validation Error (400 with field-level errors displayed in UI)
12. Server Error (500 shows user-friendly error state)

---

## 21. Phase 13 Rules - Final Feature Review

**Skill file:** `.claude/skills/13-final-feature-review.md`

**Purpose:** Review the complete feature end-to-end before closing.

**Input:**
- `workflow-status.md` — phase completion status and approval history
- `issues.md` — all open, resolved, and deferred issues
- `visual-review-issues.md` — visual mismatch status
- `07-backend-coding-summary.md` — what backend was built
- `08-frontend-coding-summary.md` — what frontend was built
- `09-frontend-visual-review.md` — visual review result
- `10-backend-test-plan.md` — test scope and results
- `11-frontend-test-plan.md` — test scope and results
- `12-integration-test-plan.md` — integration test result

Do **not** re-read full design docs (01–06) unless a specific review question requires it — the summaries and tracking files contain sufficient information for final review.

**Output:** `docs/features/{feature-folder}/13-final-feature-review.md`

### Required output sections

```
# Final Feature Review: {name_vi}

## Phase Status
Status: Completed | Blocked
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Review Summary
## 2. Document Completion Checklist
## 3. API Contract Checklist
## 4. Backend Checklist
## 5. Frontend Checklist
## 6. Visual Review Checklist
## 7. Testing Checklist
## 8. Security / Tenant / Permission Checklist
## 9. Remaining Issues
## 10. Deferred Items
## 11. Merge Readiness
## 12. Final Verdict
## 13. Definition of Done
```

### Section 2: Document Completion Checklist

| Phase | Stage | Name | Status | Approved | Notes |
|---:|---|---|---|---|---|
| 1 | Design | Frontend Basic Design | | | |
| 2 | Design | Frontend UI Pixel Analysis | | | |
| 3 | Design | Backend Basic Design | | | |
| 4 | Design | API Contract Review | | | |
| 5 | Planning | Frontend Implementation Plan | | | |
| 6 | Planning | Backend Implementation Plan | | | |
| 7 | Coding | Backend Coding | | | |
| 8 | Coding | Frontend Coding | | | |
| 9 | Verification | Frontend Visual Review | | | |
| 10 | Verification | Backend Test | | | |
| 11 | Verification | Frontend Test | | | |
| 12 | Verification | Integration Test | | | |

### Section 12: Final Verdict

```markdown
## Final Verdict
[Ready to Merge | Ready with Deferred Items | Changes Required | Blocked]
```

**Final Verdict values:**
- `Ready to Merge` - all phases approved, no open blocking issues, no Critical/High visual issues, API Contract approved, tests completed.
- `Ready with Deferred Items` - all critical phases approved, only non-blocking items deferred with user approval.
- `Changes Required` - one or more phases need rework.
- `Blocked` - blocking issues or Critical/High visual issues remain open.

**Ready to Merge only if:**
- All phases Approved.
- No open blocking issues in `issues.md`.
- No open Critical or High issues in `visual-review-issues.md`.
- API Contract status is `Approved`.
- Backend and frontend tests are completed or limitations are clearly documented.
- Integration test completed.

---

## 22. Final Response Rule

After each workflow phase run, AI must respond in a **compact format**. Do not paste the full document content into chat - it was written to a file.

### Default compact format (always use this)

```markdown
# Workflow Result

- Feature: {name_vi} (`{feature}`)
- Phase completed: {n} - {Phase Name}
- Output: {file path}
- Status: Completed | Blocked
- Blocking issues: None | {count} open blocking items
- Tracking: workflow-status.md updated, issues.md updated
- Next action: {one of the commands below}
```

Append visual summary only for Phase 8 or 9:
```markdown
- Visual: Actual screenshots {found / missing} - {Critical}/{High}/{Medium}/{Low} issues - {Visual status}
```

### Next action line

If blocking items exist:
```
answer item {ID}: {your answer}
```

If actual screenshots missing (Phase 9):
```
Run frontend -> capture screenshots -> docs/features/{feature-folder}/actual/ -> /fullstack-feature-workflow {feature}
```

If Phase 9 has Critical/High visual issues:
```
fix visual issues phase 9
```

If no blocking items:
```
approve phase {n}
```

### Expanded format (only when documentation_level = detailed, or user asks)

When `documentation_level = detailed` in config.yaml, or user explicitly requests detail, AI may use the full format:

```markdown
# Workflow Result

## Feature
- Feature folder: docs/features/{folder}
- Feature key: {feature}
- Name VI: {name_vi}

## Completed Phase
- Phase: {n}
- Stage: {Design | Planning | Coding | Verification | Closure}
- Phase name: {Phase Name}
- Output: {file path}

## Tracking Updated
- workflow-status.md: Updated
- issues.md: Updated
- visual-review-issues.md: Updated (if relevant)

## Inputs Checked
- Config: {path} - Found / Missing
- Current UI images: Found ({n} files) / Missing
- Reference UI images: Found ({n} files) / Missing
- Reference markdown docs: Found ({n} files) / Missing
- Actual screenshots: Found ({n} files) / Missing / Not required

## Issues Summary

| Type | Open Blocking | Open Non-blocking | Resolved | Deferred |
|---|---:|---:|---:|---:|

## Visual Review Summary (Phase 8/9 only)
- Actual screenshots required: Yes / No
- Actual screenshots found: Yes / No
- Critical issues: {n}  High: {n}  Medium: {n}  Low: {n}
- Visual status: {status}

## Status
{Completed | Blocked}. Waiting for user review.

## Next Step
{action command}
```

### Rules
- Do not paste full document content into chat.
- Do not repeat content already in the output file.
- If `cost_optimization.max_output = concise` in config, always use compact format regardless of documentation_level.
- If user wants more detail, expand only the requested section inline.

---

## 23. User Confirmation Rules

### AI must ask for confirmation if:
- Feature config is missing -> ask user to create config using template.
- Multiple config files match the command -> ask which one.
- Phase 4 has unresolved questions marked `Must Resolve Before Coding: Yes`.
- API contract status is `Changes Required`.
- A requested phase would create or modify source code (Phase 7 or Phase 8).
- Feature scope is unclear after reading all inputs.
- AI cannot safely determine the current phase.
- Phase 9 actual screenshots are missing - ask user to provide them.

### AI must not ask for confirmation if:
- Exactly one config matches.
- The next phase is a documentation-only phase (1, 2, 3, 4, 5, 6, 9, 10 plan, 11 plan, 12 plan, 13).
- All required input files exist.
- There are no blocking open questions.

---

## 24. Safety Rules

AI must never:
- Create backend files in `accounting_web/`.
- Create frontend files in `accounting_api/`.
- Skip the API Contract Review phase (Phase 4).
- Skip the UI Pixel Analysis phase (Phase 2) before frontend coding.
- Write backend code before Phase 7 is explicitly confirmed.
- Write frontend code before Phase 8 is explicitly confirmed.
- Ignore missing input folders silently - always report them.
- Ignore unresolved API or database questions.
- Ignore open blocking issues in `issues.md`.
- Ignore Critical/High visual issues in `visual-review-issues.md`.
- Invent business rules without marking them as `Assumption`.
- Expose EF Core entities directly through API responses.
- Hard-code `tenantId` anywhere in backend or frontend code.
- Hard-code permission strings in frontend components.
- Move to Phase 5 or Phase 6 when Phase 4 status is `Changes Required`.
- Move to Phase 7 or Phase 8 without approved implementation plans.
- Proceed to the next phase while there are unresolved `Blocking Issues: Yes` items.
- Approve a phase that has unresolved blocking items.
- Hide uncertainty in prose without adding it to `issues.md`.
- Treat assumptions as confirmed facts.
- Implement unclear business rules without explicit user confirmation.
- Implement unclear API or database decisions without explicit user confirmation.
- Ignore conflicts between Current UI, Reference UI, and Reference Markdown.
- Automatically continue to the next phase after answering a blocking item - always wait for explicit approval.
- Mark Phase 9 approved without actual implementation screenshots.
- Allow Phase 11 or Phase 12 to proceed if Phase 9 has Critical or High visual issues.
- Treat reference UI as main visual source when current UI images exist.
- Modify backend code while fixing frontend visual issues.
- Change API contract to solve a purely visual issue.
- Silently skip pixel review checklist.
- Claim pixel-perfect match without actual visual comparison.
- Continue to next phase without user review approval.
- Run next phase automatically without explicit user approval of current phase.

**Note:** The phase gates in Section 7 are the authoritative source for each phase's entry conditions. Section 24 highlights the most critical safety constraints as a quick reference - when in doubt, check Section 7.

---

## 25. Usage

To run this workflow:

```
/fullstack-feature-workflow {feature}
```

Example:

```
/fullstack-feature-workflow suppliers
```

Normal flow:
1. AI finds `docs/features/*/config.yaml` matching `feature: suppliers`.
2. AI loads the feature folder.
3. AI checks input folders: `images/`, `references/images/`, `references/markdown/`, `actual/`.
4. AI reads `workflow-status.md`.
5. AI reads `issues.md`.
6. AI reads `visual-review-issues.md` if relevant.
7. AI detects the next incomplete phase.
8. AI runs that phase only.
9. AI updates `workflow-status.md`, `issues.md`, `visual-review-issues.md`.
10. AI stops and reports result.

### Approval

```
approve phase {number}
```

### Approve with deferred non-blocking items

```
approve phase {number} with deferred items
```

### Request changes

```
changes requested phase {number}: {notes}
```

### Answer blocking items

```
answer item {ID}: {your answer}
confirm item {ID}: {decision}
```

To answer and immediately continue to the next gate check without re-invoking the workflow:

```
answer item {ID}: {your answer} and continue
```

AI will update `issues.md`, check remaining blocking items, and if none remain, report that the phase is ready for approval.

### Confirm backend coding (required before Phase 7)

```
confirm backend coding
```

### Confirm frontend coding (required before Phase 8)

```
confirm frontend coding
```

### Visual review flow

1. AI completes Phase 8 Frontend Coding.
2. `08-frontend-coding-summary.md` lists required screenshots.
3. User runs frontend app and captures actual screenshots.
4. User saves screenshots to `docs/features/{feature-folder}/actual/` or uploads in conversation.
5. User runs `/fullstack-feature-workflow {feature}`.
6. AI performs Phase 9 Frontend Visual Review.
7. If Critical/High issues exist, user runs:
   ```
   fix visual issues phase 9
   ```
8. User captures new screenshots after fix.
9. AI reviews again.
10. When visual status is `Approved` or `Approved with minor issues`, user approves Phase 9:
    ```
    approve phase 9
    ```

To create a new feature config, copy `.claude/templates/feature-config.template.yaml` to `docs/features/{feature-folder}/config.yaml` and fill in the values.

---

## 26. Unclear / Incomplete Items Rule

After every phase, AI must identify and list all unclear, incomplete, conflicting, or assumed items. AI must not hide uncertainty. AI must not silently continue if important information is missing.

AI must create a dedicated section in every phase output file:

```markdown
## Unclear / Incomplete Items
```

This section must include the following subsections:

### 26.1 Missing Information

```markdown
### 1. Missing Information

| ID | Missing Information | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
```

`Required Before Next Phase?` allowed values: `Yes` / `No`

### 26.2 Unclear Requirements

```markdown
### 2. Unclear Requirements

| ID | Requirement | Why Unclear | Possible Interpretations | Recommended Default | Required Before Next Phase? |
|---|---|---|---|---|---|
```

### 26.3 Conflicts

```markdown
### 3. Conflicts

| ID | Topic | Source A | Source B | Conflict | Recommendation | Required Before Next Phase? |
|---|---|---|---|---|---|---|
```

### 26.4 Assumptions

```markdown
### 4. Assumptions

| ID | Assumption | Reason | Risk | User Confirmation Needed? |
|---|---|---|---|---|
```

### 26.5 Questions for User Confirmation

```markdown
### 5. Questions for User Confirmation

| ID | Question | Context | Options | Recommended Option | Blocking? |
|---|---|---|---|---|---|
```

**ID format:** `P{phase}-Q{n}` questions, `P{phase}-M{n}` missing info, `P{phase}-U{n}` unclear, `P{phase}-C{n}` conflicts, `P{phase}-A{n}` assumptions, `P{phase}-API{n}` API contract issues (Phase 4), `P{phase}-CODE{n}` code issues (Phase 7/8).

**After every phase, AI must copy all unresolved items into `issues.md`.**

---

## 27. Phase Output Status Rule

Every phase output file must include one of these status blocks near the top, immediately after the `# {Phase Title}` heading.

**Completed - no blocking issues:**
```markdown
## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No
```

**Completed - has non-blocking questions:**
```markdown
## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: Yes
```

**Blocked - has blocking issues:**
```markdown
## Phase Status
Status: Blocked
Blocking Issues: Yes
User Confirmation Required: Yes
```

**Phase 4 only:**
```markdown
## Approval Status
Status: Approved | Changes Required
Blocking Issues: Yes | No
User Confirmation Required: Yes | No
```

**Rules:**
- If any item has `Required Before Next Phase? = Yes` -> `Blocking Issues: Yes`.
- If any question has `Blocking? = Yes` -> `Blocking Issues: Yes`.
- If `Blocking Issues = Yes` -> Review Status in `workflow-status.md` must be `Changes Required` or `Pending`.
- AI must not proceed to the next phase if `Blocking Issues = Yes`.

---

## 28. Workflow Status File Rule

AI must maintain `docs/features/{feature-folder}/workflow-status.md` after every phase.

This file is for **phase tracking only** - detailed issues go to `issues.md` and `visual-review-issues.md`.

### Required format

```markdown
# Workflow Status: {name_vi}

## Feature

- Feature key: {feature}
- Feature folder: docs/features/{feature-folder}
- Name VI: {name_vi}
- Last updated: {datetime}

## Current Status

- Current stage: Design | Planning | Coding | Verification | Closure
- Current phase: {phase-number}
- Current phase name: {phase-name}
- Overall status: Not Started | In Progress | Blocked | Completed
- Waiting for user review: Yes | No
- Waiting for screenshot: Yes | No
- Blocking issues: Yes | No
- Blocking visual issues: Yes | No

## Phase Tracking

| Phase | Stage | Name | Output File | Status | Review Status | Completed At | Approved At | Notes |
|---:|---|---|---|---|---|---|---|---|
| 1 | Design | Frontend Basic Design | 01-frontend-basic-design.md | Not Started | Pending |  |  |  |
| 2 | Design | Frontend UI Pixel Analysis | 02-frontend-ui-pixel-analysis.md | Not Started | Pending |  |  |  |
| 3 | Design | Backend Basic Design | 03-backend-basic-design.md | Not Started | Pending |  |  |  |
| 4 | Design | Backend API Contract Review | 04-api-contract-review.md | Not Started | Pending |  |  |  |
| 5 | Planning | Frontend Implementation Plan | 05-frontend-implementation-plan.md | Not Started | Pending |  |  |  |
| 6 | Planning | Backend Implementation Plan | 06-backend-implementation-plan.md | Not Started | Pending |  |  |  |
| 7 | Coding | Backend Coding | 07-backend-coding-summary.md | Not Started | Pending |  |  |  |
| 8 | Coding | Frontend Coding | 08-frontend-coding-summary.md | Not Started | Pending |  |  |  |
| 9 | Verification | Frontend Visual Review | 09-frontend-visual-review.md | Not Started | Pending |  |  |  |
| 10 | Verification | Backend Test | 10-backend-test-plan.md | Not Started | Pending |  |  |  |
| 11 | Verification | Frontend Test | 11-frontend-test-plan.md | Not Started | Pending |  |  |  |
| 12 | Verification | Integration Test | 12-integration-test-plan.md | Not Started | Pending |  |  |  |
| 13 | Closure | Final Feature Review | 13-final-feature-review.md | Not Started | Pending |  |  |  |

## Next Action

Describe exactly what the user should do next.
```

**Allowed Status values:** `Not Started` / `In Progress` / `Completed` / `Blocked` / `Skipped`

**Allowed Review Status values:** `Pending` / `Approved` / `Changes Required` / `Not Required`

**Rules:**
- AI must read `workflow-status.md` before deciding next phase.
- AI must update `workflow-status.md` after every phase.
- AI must not rely only on output file existence to detect phase status.
- AI must stop after every phase and wait for review.
- Skipped phases must have `Review Status = Not Required` and must be permitted by the current `workflow_mode`.

---

## 29. Issues File Rule

For every feature, AI must create or update:

```
docs/features/{feature-folder}/issues.md
```

**Purpose:** Track all unclear, incomplete, missing, conflicting, assumed, or user-confirmation items across all phases.

### Required format

```markdown
# Feature Issues: {name_vi}

## Summary

| Status | Count |
|---|---:|
| Open Blocking | 0 |
| Open Non-blocking | 0 |
| Resolved | 0 |
| Deferred | 0 |

## Issues

| ID | Phase | Type | Description | Source | Blocking? | Status | User Answer | Resolution |
|---|---:|---|---|---|---|---|---|---|
```

**Allowed Type values:**
- `Missing Information`
- `Unclear Requirement`
- `Conflict`
- `Assumption`
- `User Question`
- `API Contract Issue`
- `Database Issue`
- `Permission Issue`
- `Tenant Issue`
- `Validation Issue`
- `Code Issue`
- `Test Issue`

**Allowed Blocking? values:** `Yes` / `No`

**Allowed Status values:** `Open` / `Answered` / `Resolved` / `Deferred`

**Issue ID convention:**
- `P1-Q1`, `P1-M1`, `P1-C1`, `P1-A1`
- `P2-Q1`, `P2-M1`, `P2-C1`, `P2-A1`
- `P4-API1`
- `P7-CODE1`

**Rules:**
- Every phase output must include an `## Unclear / Incomplete Items` section.
- AI must copy all unresolved items into `issues.md` after every phase.
- If any issue has `Blocking? = Yes` and `Status = Open`, AI must not continue to the next phase.
- If user answers an issue, AI must update `issues.md`.
- AI must not hide uncertainty in prose without adding it to `issues.md`.

**Archiving rule (cost control):**
- When `issues.md` exceeds 50 rows total, AI must archive all `Resolved` and `Deferred` items into `docs/features/{feature-folder}/issues-archive.md`.
- Keep only `Open` and `Answered` items in the main `issues.md`.
- Maintain the Summary count table at the top of `issues.md` to reflect totals across both files.
- Add a reference at the bottom of `issues.md`: `(... {n} archived items — see issues-archive.md)`.

---

## 30. Visual Review Issues File Rule

For every feature with `visual_review.enabled: true`, AI must create or update:

```
docs/features/{feature-folder}/visual-review-issues.md
```

**Purpose:** Track visual mismatch issues found in Phase 9 - separate from general issues.

### Required format

```markdown
# Visual Review Issues: {name_vi}

## Summary

| Severity | Open | Resolved | Deferred |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |

## Visual Issues

| ID | Severity | Area | Expected | Actual | Recommendation | File / Component | Status |
|---|---|---|---|---|---|---|---|
```

**Allowed Severity:** `Critical` / `High` / `Medium` / `Low`

**Allowed Status:** `Open` / `Fixed` / `Resolved` / `Deferred` / `Escalated`

**Rules:**
- Critical and High visual issues block approval of Phase 9.
- Medium and Low can be deferred with user approval.
- AI must not continue to Phase 11/12 if Critical or High visual issues remain Open.
- AI must never claim pixel-perfect match without actual screenshot comparison.
- After fixing visual issues, update Status to `Fixed` (pending re-review) or `Resolved` (confirmed fixed).

---

## 31. Approval Rule

When user says `approve phase {number}` or `ok phase {number}`:

AI must:
1. Read `workflow-status.md`.
2. Read `issues.md`.
3. Read `visual-review-issues.md` if the phase is 9 or later.
4. Check whether the phase has open blocking issues in `issues.md`.
5. If open blocking issues exist, refuse approval and list them.
6. If no open blocking issues exist, set Review Status to `Approved` in `workflow-status.md`.
7. Update `Approved At` timestamp.
8. Set `Waiting for user review: No` in `workflow-status.md`.
9. Detect the next eligible phase by checking phase gates.
10. If the next phase is a documentation phase (1–6, 9–13): report its name and prompt `Run /fullstack-feature-workflow {feature} to begin Phase {n} — {phase name}.`
11. If the next phase requires coding confirmation (Phase 7 or 8): request the confirmation in the current conversation — do not require workflow re-invocation.
    - For Phase 7: `Type confirm backend coding to begin Phase 7 — Backend Coding.`
    - For Phase 8: `Type confirm frontend coding to begin Phase 8 — Frontend Coding.`
12. If no more phases remain: report that the feature is complete.

**AI must not approve a phase with unresolved blocking issues.**

**If the phase has only non-blocking open issues**, AI may approve if user says:

```
approve phase {number} with deferred items
```

Then AI must mark those non-blocking open issues as `Deferred` in `issues.md`.

---

## 32. User Answer Handling Rule

When user replies `answer item {ID}: {answer}` or `confirm item {ID}: {decision}`:

1. Locate the item in `issues.md`.
2. Add the answer into `User Answer`.
3. Set item `Status` to `Answered` or `Resolved`.
4. If the answer changes the phase output, update the relevant phase document.
5. If all blocking items are resolved, inform user they can now approve the phase.
6. Update `issues.md` Summary counts.

**AI must not auto-continue** unless user explicitly adds `and continue` to the command.

Even then, AI must respect all phase gate rules.

---

## 33. Changes Required Rule

When user says `changes requested phase {number}: {notes}`:

1. Update `workflow-status.md` - set Review Status to `Changes Required`, add notes.
2. Add the notes to `Review Notes` section in the phase document.
3. Check whether the notes resolve or create any items in `issues.md`.
4. Rework the phase document.
5. Regenerate the `## Unclear / Incomplete Items` section.
6. Set Phase Status to `Blocked` if new blocking issues arise, or `Completed` if resolved.
7. Keep Review Status as `Pending` - never self-approve.
8. Update `issues.md`.
9. Stop and wait for user approval.

---

## 34. Phase-Specific Unclear Item Rules

For each phase, AI must proactively check and mark unclear items for the topics below. Use ID format from Section 26: `P{phase}-Q{n}` for questions, `P{phase}-A{n}` for assumptions, `P{phase}-API{n}` for API issues, etc.

### Phase 1: Frontend Basic Design
- Missing UI screenshots
- Difference between current UI and reference UI
- Reference markdown feature not visible in current UI
- UI action without business explanation
- Unknown permission behavior
- Unknown validation behavior
- Unknown responsive behavior
- Unknown data source
- Unknown empty / loading / error state
- Unknown multi-tenant behavior

### Phase 2: Frontend UI Pixel Analysis
- Missing UI screenshots (no current UI images)
- Low-confidence measurements (cannot estimate value)
- Conflict between current UI and reference UI for same element
- Unknown design token (color/spacing not visible in screenshots)
- Unknown interaction state (state not shown in screenshots)
- Unclear column behavior (ellipsis vs wrap vs scroll)
- Unknown responsive behavior at different screen sizes
- Measurement assumed from reference UI (not current UI)

### Phase 3: Backend Basic Design
- Missing entity fields
- Unknown database relationship
- Unknown unique constraint
- Unknown delete rule
- Unknown audit requirement
- Unknown tenant strategy
- Unknown permission mapping
- Unknown validation rule
- Unknown business rule from markdown
- UI action requiring backend but no clear API behavior

### Phase 4: Backend API Contract Review
- Endpoint mismatch
- DTO field mismatch
- Type mismatch between TypeScript and C#
- Permission mismatch
- Validation mismatch
- Error response mismatch
- Paging / filter / sort mismatch
- Tenant behavior mismatch
- Any API contract decision not explicitly confirmed

### Phase 5: Frontend Implementation Plan
- Missing shared component path
- Unknown route config
- Unknown auth / permission hook
- Unknown tenant context
- Unknown table / grid library choice
- Unknown API service convention
- Unknown style guide details
- Design token not yet defined (pending Phase 2 approval)

### Phase 6: Backend Implementation Plan
- Unknown Vertical Slice Architecture folder / namespace
- Unknown DbContext path or configuration
- Unknown existing EF configuration pattern
- Unknown Result<T> wrapper implementation
- Unknown permission attribute implementation
- Unknown tenant context / ITenantEntity usage
- Unknown migration project path

### Phase 7: Backend Coding
- Any file path not found in actual project
- Any missing base class / interface (IRequest, IRequestHandler, IEndpoint)
- Any missing DI registration pattern
- Any unclear namespace
- Any business rule not implementable safely
- Any API contract mismatch discovered during coding

### Phase 8: Frontend Coding
- Any file path not found in actual project
- Any missing API client (`@/lib/api/client`)
- Any missing auth / permission hook (`usePermissions`)
- Any missing tenant context (`useTenantStore`)
- Any missing shared UI component (`DataGrid`, `Can`, etc.)
- Any UI behavior not specified in Phase 1 or Phase 2
- Any API contract mismatch discovered during coding
- Design token not defined but needed for styling

### Phase 9: Frontend Visual Review
- Actual screenshots not provided by user
- Screenshot too small or unclear to compare
- Multiple components look similar - cannot distinguish which was implemented
- Actual screenshot shows unexpected state (loading, error, empty) rather than populated UI
- Source UI image and actual implementation show different data - unsure if visual or data issue

### Phase 10: Backend Test
- Unknown test framework setup (xUnit, NUnit)
- Unknown integration test setup (WebApplicationFactory, TestContainers)
- Unknown auth mock strategy
- Unknown tenant mock strategy
- Unknown database test strategy (in-memory, real DB, SQLite)
- Missing seed data for tests

### Phase 11: Frontend Test
- Unknown test framework setup (Vitest, Jest)
- Unknown MSW setup and handler location
- Unknown provider wrapper for tests
- Unknown auth mock strategy
- Unknown tenant mock strategy
- Unknown permission mock strategy
- Missing test data / fixtures

### Phase 12: Integration Test
- Unknown frontend URL
- Unknown backend URL
- Unknown test users and credentials
- Unknown test tenant and company IDs
- Unknown seed data for integration scenario
- Unknown deployment environment
- Unknown E2E framework setup (Playwright, Cypress)

### Phase 13: Final Feature Review
- Any phase not yet Approved
- Any Critical or High visual issue remaining in `visual-review-issues.md`
- Any open blocking item in `issues.md`
- Any acceptance criteria not verified
- Any API contract deviation found during review

---

## 35. Adaptive Workflow Mode

Read `workflow_mode` from `config.yaml`. If missing, default to `full`.

### Mode: `full`
Use all 13 phases in strict order.

### Mode: `frontend_only`
Run only frontend-related phases:
- Phase 1: Frontend Basic Design
- Phase 2: Frontend UI Pixel Analysis (if `visual_review.enabled = true`)
- Phase 4: Backend API Contract Review (frontend verification mode - verify API contract only, no backend design)
- Phase 5: Frontend Implementation Plan
- Phase 8: Frontend Coding
- Phase 9: Frontend Visual Review (if `visual_review.enabled = true`)
- Phase 11: Frontend Test
- Phase 13: Final Feature Review

Skip: Phase 3, 6, 7, 10, 12.

### Mode: `backend_only`
Run only backend-related phases:
- Phase 3: Backend Basic Design
- Phase 4: Backend API Contract Review
- Phase 6: Backend Implementation Plan
- Phase 7: Backend Coding
- Phase 10: Backend Test
- Phase 13: Final Feature Review

Skip: Phase 1, 2, 5, 8, 9, 11, 12. Set `visual_review.level = off`.

### Mode: `ui_only`
Run only UI phases:
- Phase 1: Frontend Basic Design
- Phase 2: Frontend UI Pixel Analysis
- Phase 5: Frontend Implementation Plan
- Phase 8: Frontend Coding (with mock data - no real API)
- Phase 9: Frontend Visual Review
- Phase 11: Frontend Test (light)
- Phase 13: Final Feature Review

Skip: Phase 3, 4, 6, 7, 10, 12.

### Mode: `bugfix`
Do not use the 13-phase workflow. Use a simplified 5-step flow:
1. Bug Analysis - describe the bug, root cause, affected files
2. Fix Plan - describe minimal changes needed
3. Targeted Coding - fix only the affected files
4. Targeted Test - test only the fixed area
5. Final Review - confirm fix is clean

Only touch files related to the bug. Do not refactor unrelated code.

### Mode: `quick_change`
Use a minimal 4-step flow:
1. Change Analysis - describe what needs to change
2. Small Implementation Plan - list affected files only
3. Coding - implement the change
4. Smoke Test - verify the change works

Use only when user explicitly requests a small change (e.g., "rename this field", "change this label").

### Skipped phase recording

When a phase is skipped due to `workflow_mode`, AI must update `workflow-status.md`:

```
Status = Skipped
Review Status = Not Required
Notes = Skipped by workflow_mode: {mode}
```

---

## 36. Documentation Level

Read `documentation_level` from `config.yaml`. If missing, default to `standard`.

### Level: `compact`
- Max 120 lines per phase document.
- Only include essential tables - omit tables that would have 0 rows.
- Use bullet points instead of long prose.
- Do not repeat content from previous phase documents - reference by file path instead.
- Do not generate explanations for self-evident rules.

### Level: `standard`
- Max 250 lines per phase document.
- Include all required sections but keep tables concise.
- Omit sub-sections that have no content.

### Level: `detailed`
- No line limit.
- Use all required sections and sub-sections.
- Suitable for complex accounting features with many edge cases.

**Rules:**
- AI must respect `documentation_level` in every phase output.
- If `cost_optimization.max_doc_lines` is set, that value overrides the level default.
- If user asks for more detail mid-phase, expand only the requested section.
- **Priority override:** If `cost_optimization.max_output = concise`, compact response format always applies regardless of `documentation_level` (see Section 22). `documentation_level` controls document structure; `max_output = concise` controls chat response length.

---

## 37. Cost Optimization Rules

Read `cost_optimization` from `config.yaml`. If missing, apply defaults.

```yaml
cost_optimization:
  enabled: true
  max_output: concise       # concise | full
  avoid_repeating_previous_docs: true
  summarize_existing_content: true
  only_expand_when_requested: true
  max_table_rows: 20
  max_doc_lines: 250
```

### Rules

**Config reading:**
- AI reads only fields needed for the current phase (see Section 42).
- AI must not read the full config guide on every run.
- AI must not copy field descriptions from `feature-config-guide.md` into phase output.

**Do not repeat content from previous documents:**
- Do not copy the full API contract into Phase 5/6/7/8. Reference it: `See 04-api-contract-review.md`.
- Do not copy the full Backend Design into Phase 6. Reference it.
- Do not paste full endpoint contracts in test plans - reference the contract file.
- Do not repeat the full config block in any phase document - reference only the relevant field values.

**Do not duplicate issues across files:**
- `workflow-status.md` = phase status only.
- `issues.md` = all open/resolved issues.
- `visual-review-issues.md` = visual mismatches only.
- Never copy the same issue to multiple files.

**Table row limits:**
- If a table would exceed `max_table_rows`, show the first N rows and write: `(... {n} more rows - see full document)`.
- Do not generate placeholder rows for items that do not exist.

**Document line limits:**
- If a phase document would exceed `max_doc_lines`, truncate less-critical sections and add: `(... truncated - see {section} for detail)`.
- Priority order to keep: status block, required tables, blocking issues, definition of done.

**Chat response:**
- Default to compact format (Section 22).
- Do not paste file content into chat if it was written to a file.
- If user asks for detail, expand only that section inline.

**Delta updates:**
- When updating an existing phase document, do not rewrite the whole file unless the changes affect >50% of the content.
- Update only affected sections.
- Preserve user-reviewed content.

**Expand on request only:**
- If a table or section is truncated and the user asks for more detail, expand only that specific section.
- Do not expand the entire document when only one section is requested.

---

## 38. Visual Review Level Rules

Read `visual_review.level` from `config.yaml`.

### Level: `off` (or `visual_review.enabled = false`)
- Skip Phase 2 (Frontend UI Pixel Analysis).
- Skip Phase 9 (Frontend Visual Review).
- Do not create `visual-review-issues.md`.
- Do not block workflow on screenshots.

### Level: `light`
- Phase 2 creates only: essential design tokens, grid/table spec, pixel review checklist.
- Phase 2 skips: full typography table, detailed layout measurement table.
- Phase 9 checks only: major layout, colors, toolbar, table structure, pagination.
- Phase 9 does not generate detailed pixel tables.
- Medium and Low issues do not require fixing before Phase 11.

### Level: `strict` (default for `full` and `ui_only`)
- Use full UI Pixel Analysis (all sections in Phase 2).
- Phase 9 requires actual screenshots.
- Block on Critical/High issues before Phase 11/12.
- Generate all visual tracking tables.

### Default level by workflow_mode

| workflow_mode | Default visual_review.level |
|---|---|
| `full` | `strict` |
| `frontend_only` | `light` (unless config says `strict`) |
| `backend_only` | `off` |
| `ui_only` | `strict` |
| `bugfix` | `off` |
| `quick_change` | `off` |

If `visual_review.level` is explicitly set in config, that value takes precedence.

---

## 39. Read-Before-Write Rule

Before generating a phase output, AI must read **only the minimum necessary** prior files.

### Minimum reads per phase

| Phase | Must read | Must NOT read unless needed |
|---|---|---|
| 1 | config.yaml, images/, references/ | - |
| 2 | config.yaml, 01-frontend-basic-design.md, images/, references/images/ | - |
| 3 | config.yaml, 01-frontend-basic-design.md, 02-frontend-ui-pixel-analysis.md | - |
| 4 | 01-frontend-basic-design.md, 02-frontend-ui-pixel-analysis.md, 03-backend-basic-design.md | - |
| 5 | 01-frontend-basic-design.md, 02-frontend-ui-pixel-analysis.md, 04-api-contract-review.md | 03-backend-basic-design.md |
| 6 | 03-backend-basic-design.md, 04-api-contract-review.md | 01, 02, 05 |
| 7 | 03-backend-basic-design.md, 04-api-contract-review.md, 06-backend-implementation-plan.md | 01, 02, 05 |
| 8 | 01-frontend-basic-design.md, 02-frontend-ui-pixel-analysis.md, 04-api-contract-review.md, 05-frontend-implementation-plan.md | 03, 06, 07 |
| 9 | 02-frontend-ui-pixel-analysis.md, 08-frontend-coding-summary.md, images/, actual/ | 03, 04, 06, 07 |
| 10 | 03-backend-basic-design.md, 04-api-contract-review.md, 06-backend-implementation-plan.md | 01, 02, 05 |
| 11 | 01-frontend-basic-design.md, 02-frontend-ui-pixel-analysis.md, 04-api-contract-review.md, 05-frontend-implementation-plan.md | 03, 06, 07 |
| 12 | 04-api-contract-review.md, 09-frontend-visual-review.md | earlier design docs |
| 13 | workflow-status.md, issues.md, visual-review-issues.md | all source docs |

**Phase 4 size guard:** If any of the three input docs (01, 02, 03) exceeds 300 lines, AI must read only the following sections from each:
- From `01-frontend-basic-design.md`: `## Confirmed Frontend Scope`, `## Updated Frontend API Needs`, `## Unclear / Incomplete Items`
- From `02-frontend-ui-pixel-analysis.md`: `## Grid / Table Specification`, `## Design Tokens`
- From `03-backend-basic-design.md`: `## Confirmed Backend Scope`, `## Backend API Draft Based on Confirmed Scope`

Do a full read only when a specific section is needed to resolve a gap in the API contract review.

**Rule:** Do not read backend implementation details when working on a frontend phase, and vice versa.

---

## 40. Delta Update Rule

When updating an existing phase document after `changes requested` or issue resolution:

- Do not rewrite the whole file unless changes affect >50% of the document.
- Update only the affected sections.
- Preserve user-reviewed content (approved tables, accepted decisions).
- At the end of the response, summarize what changed: `Updated sections: X, Y, Z`.

If the change is minor (e.g., adding one row to a table or updating one field type):
- Edit only that table/section.
- Note the change in a single line.

---

## 41. Feature Size Detection

If `workflow_mode` is missing from `config.yaml`, AI should infer the appropriate mode:

### Small feature
- Likely 1-2 files changed.
- No API or database change.
- Recommended: `quick_change`
- Example: rename a label, fix a typo, adjust a color.

### Medium feature
- One frontend screen OR one backend API group.
- Recommended: `frontend_only`, `backend_only`, or `full` depending on scope.
- Example: add a new list screen, add a new CRUD endpoint.

### Large feature
- Multiple screens, multiple API endpoints, database changes, permissions.
- Recommended: `full`
- Example: new accounting module (Suppliers, Inventory, etc.).

### Inference rule

If AI cannot determine feature size from config, ask user once:

```
This feature config does not specify workflow_mode.
Estimated size: {small | medium | large} based on {reason}.
Recommended mode: {mode}.

Use this mode, or specify another? (full / frontend_only / backend_only / ui_only / bugfix / quick_change)
```

Do not ask more than once. If user does not answer, default to `full`.

---

## 42. Config Compact Rules

These rules govern how AI reads and uses `config.yaml`. They exist to minimize token cost across all phases.

### Rule 1 - Config must be compact

`config.yaml` must contain only feature-specific data values. No comments, no inline documentation, no usage guides. The template is at `.claude/templates/feature-config.template.yaml`.

### Rule 2 - Guide is separate

Field meanings and usage instructions belong in `.claude/templates/feature-config-guide.md`. AI must NOT read or load the guide unless:
- The user explicitly asks for a field explanation, OR
- A config field value is ambiguous and cannot be resolved by workflow defaults.

### Rule 3 - Phase-specific field reading

AI reads only the config fields relevant to the current phase:

| Phase | Config fields to read |
|---|---|
| 1 | feature, folder, name_vi, workflow_mode, input, cost_optimization, visual_review, entities, permissions, capabilities, business_rules |
| 2 | feature, folder, name_vi, cost_optimization, visual_review, input |
| 3 | feature, folder, name_vi, cost_optimization, entities, business_rules, backend |
| 4 | feature, folder, name_vi, cost_optimization, api, entities, permissions |
| 5 | feature, folder, name_vi, cost_optimization, frontend, input |
| 6 | feature, folder, name_vi, cost_optimization, backend, api |
| 7 | feature, folder, name_vi, backend, api, entities, permissions, commands |
| 8 | feature, folder, name_vi, frontend, cost_optimization, visual_review, commands |
| 9 | feature, folder, name_vi, visual_review, cost_optimization, input |
| 10 | feature, folder, name_vi, backend, commands |
| 11 | feature, folder, name_vi, frontend, commands |
| 12 | feature, folder, name_vi, commands |
| 13 | feature, folder, name_vi, workflow_mode |

AI must not parse or store unneeded config sections.

### Rule 4 - Missing optional fields

If an optional config field is absent:
1. Apply the workflow default for that field.
2. Record the assumption in `issues.md` as type `Assumption`, `Blocking? = No`.
3. Continue without stopping.

Do not ask the user about missing optional fields unless they affect correctness.

### Rule 5 - Do not copy config into output

AI must not paste or reproduce the config block (or large portions of it) into any phase output document. Reference specific values inline where needed, e.g.: `entity: Supplier (from config)`.

### Rule 6 - Do not copy guide into output

AI must not copy content from `feature-config-guide.md` into any phase document, chat response, or issues file.

### Rule 7 - Summarize, do not repeat

In a `## Feature Config Summary` section within a phase document, AI must include only the fields relevant to that phase — not the full config. Maximum 10 lines.

**Cost reduction:** When `cost_optimization.enabled: true`:
- Phase 1–2: Full summary (up to 10 lines) — these phases need full context.
- Phase 3–4: Reduce to 5 lines (feature, name_vi, workflow_mode, entities, permissions).
- Phase 5 onwards: Reduce to 3 lines (feature key, name_vi, workflow_mode only). If no config field changed since Phase 4, replace the section with: `See config.yaml — no changes since Phase 4.`

### Rules 8–12 — See Section 37

Output format, delta updates, table row limits, document line limits, and expand-on-request behavior are governed by **Section 37 (Cost Optimization Rules)**. Those rules are not repeated here to avoid duplication.

### Rule 13 - No guide content in config

Never add comments, field descriptions, or usage instructions directly inside `config.yaml`. If the config file already has such comments, do not add more and do not flag it as an error - simply ignore them during phase execution.

---

## 43. Model Selection Guidance

Use the least powerful model that can handle each phase to reduce cost and increase speed.

### By phase

| Phase | Recommended model | Reason |
|------:|------------------|--------|
| 1 | `sonnet` | Multi-source analysis (images, markdown, UI comparison) |
| 2 | `sonnet` | Image reading, design token extraction, measurement estimation |
| 3 | `sonnet` | Cross-source backend design, domain modeling |
| 4 | `opus` | API contract review requires high precision and judgment |
| 5 | `sonnet` | Frontend planning from approved contract |
| 6 | `sonnet` | Backend planning from approved contract |
| 7 | `sonnet` + `haiku` | sonnet for judgment tasks; haiku for isolated, well-specified implementations |
| 8 | `sonnet` + `haiku` | Same split as Phase 7 |
| 9 | `sonnet` | Visual comparison requires image reading and detailed analysis |
| 10 | `sonnet` | Test plan + test code with spec cross-reference |
| 11 | `sonnet` | Test plan + test code with spec cross-reference |
| 12 | `sonnet` | Integration scenario planning |
| 13 | `opus` | Final architecture and quality judgment across all phases |

### By task type (within Phase 7 & 8)

| Task type | Model | Example |
|-----------|-------|---------|
| Well-specified, isolated (1-2 files) | `haiku` | Write validator for known rules, add DTO field |
| Multi-file coordination | `sonnet` | Handler + endpoint + DI wiring |
| Design judgment, cross-reference | `sonnet` | Verify code matches Phase 4 contract |
| Spec compliance review | `sonnet` | 2-stage review Stage 1 |
| Code quality review | `haiku` or `sonnet` | 2-stage review Stage 2 |
| Root cause analysis | `sonnet` | Debugging unexpected behavior |
| Escalation assessment | `opus` | 3-cycle escalation root cause |

### By review type

| Review | Model |
|--------|-------|
| Stage 1: Spec Compliance | `sonnet` (needs multi-doc context) |
| Stage 2: Code Quality | `haiku` for mechanical checks; `sonnet` if nuanced |
| Final Feature Review (Phase 13) | `opus` |

### Rules

- Never use `opus` for mechanical implementation tasks — it is cost-inefficient.
- Never use `haiku` for multi-source analysis phases (1, 2, 3, 4, 9, 13).
- When in doubt about model, use `sonnet`.
- Model selection applies per-task, not per-phase. A phase may use multiple models across its task groups.

