# Fullstack Feature Workflow

## Role

Principal Fullstack Architect, Senior .NET Backend Architect, Senior React Frontend Architect, Senior Business Analyst, AI Workflow Engineer.

---

## 1. Command Usage

User runs this workflow with:

```
/fullstack-feature-workflow {feature}
```

Example:

```
/fullstack-feature-workflow danh-muc-nha-cung-cap
```

When this command is received, AI must execute the following steps **in order**, without skipping:

1. Treat `{feature}` as the feature identifier.
2. Search for a matching config in `docs/features/*/config.yaml`.
3. Match config by field `feature: {feature}` — or by folder name if no match.
4. Use the matched folder as the feature folder.
5. Read `config.yaml` completely before doing anything else.
6. Inspect input folders.
7. Detect the current workflow phase (earliest incomplete phase).
8. Run only that phase.
9. Report the result and exact next step.

If multiple configs match, ask the user to clarify which feature to run.

If no config matches, ask the user to create the config using the template at `.ai/templates/feature-config.template.yaml`.

---

## 2. Config Rules

Every feature must have a config file at:

```
docs/features/{feature-folder}/config.yaml
```

### Minimum config

```yaml
role: web
feature: danh-muc-nha-cung-cap
name_vi: Danh mục nhà cung cấp
output_type: markdown
```

### Recommended config

```yaml
role: web
feature: danh-muc-nha-cung-cap
folder: suppliers
name_vi: Danh mục nhà cung cấp
output_type: markdown

project:
  backend: accounting_api
  frontend: accounting_web

input:
  current_ui_images: docs/features/suppliers/images
  reference_ui_images: docs/features/suppliers/references/images
  reference_markdown: docs/features/suppliers/references/markdown

workflow:
  phases:
    - frontend-basic-design
    - backend-basic-design
    - backend-api-contract-review
    - frontend-implementation-plan
    - backend-implementation-plan
    - backend-coding
    - frontend-coding
    - backend-test
    - frontend-test
    - integration-test

frontend:
  stack:
    - React
    - TypeScript
    - Vite
    - TailwindCSS
    - AG Grid
    - React Query
    - Axios
    - React Router

backend:
  stack:
    - .NET 9
    - ASP.NET Core Web API
    - Entity Framework Core
    - SQL Server
    - Clean Architecture
    - JWT
    - FluentValidation
    - Swagger
    - xUnit

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

If optional fields are missing, AI may infer from the feature name and existing files, but **must list all assumptions** in the final report.

---

## 3. Input Folder Rules

For every feature, AI must inspect the following folders:

| # | Folder | Purpose |
|---|--------|---------|
| 1 | `docs/features/{feature-folder}/images/` | Current UI/UX images of the web/app being implemented |
| 2 | `docs/features/{feature-folder}/references/images/` | Reference UI/UX images (MISA, KiotViet, other software) |
| 3 | `docs/features/{feature-folder}/references/markdown/` | Reference business documents, usage guides, product manuals |

**Rules:**
- AI must not ignore these folders.
- If a folder does not exist or is empty, AI must continue but must report it in **Missing Inputs**.
- AI must read and analyze **all files** found in these folders.
- If images exist, AI must describe what it observes in layout, components, fields, actions.
- If markdown exists, AI must extract business rules, validation rules, user flows, terminology.

---

## 4. Workflow Phases

The workflow has exactly **10 phases** in strict order:

| Phase | Name | Output File |
|-------|------|-------------|
| 1 | Frontend Basic Design | `01-frontend-basic-design.md` |
| 2 | Backend Basic Design | `02-backend-basic-design.md` |
| 3 | Backend API Contract Review | `03-api-contract-review.md` |
| 4 | Frontend Implementation Plan | `04-frontend-implementation-plan.md` |
| 5 | Backend Implementation Plan | `05-backend-implementation-plan.md` |
| 6 | Backend Coding | Source code in `accounting_api/` |
| 7 | Frontend Coding | Source code in `accounting_web/` |
| 8 | Backend Test | `08-backend-test-plan.md` + test code |
| 9 | Frontend Test | `09-frontend-test-plan.md` + test code |
| 10 | Integration Test | `10-integration-test-plan.md` |

**Mandatory order rules:**
- AI must follow phases in order.
- AI must not skip phases.
- AI must not write code before Phase 6.
- AI must not create frontend code before Phase 7.
- AI must not create backend code before Phase 6.
- AI must not create implementation plans before Phase 3 is Approved.

---

## 5. Phase Completion Detection

A document phase is complete only if the output file exists **and** contains one of these markers:

```markdown
## Phase Status
Status: Completed
```

or for Phase 3:

```markdown
## Approval Status
Status: Approved
```

or:

```markdown
## Approval Status
Status: Approved with changes
```

If a file exists but the status marker is absent, AI must treat it as **incomplete** and ask the user whether to rebuild it or add the status.

Phase 6 (Backend Coding) is complete if source files matching the backend implementation plan exist inside `accounting_api/`.

Phase 7 (Frontend Coding) is complete if source files matching the frontend implementation plan exist inside `accounting_web/`.

---

## 6. Automatic Phase Detection

When the user runs `/fullstack-feature-workflow {feature}`, AI must:

1. Find and read `config.yaml`.
2. Determine the feature folder.
3. Check the existence and completion status of each phase output file in order (Phase 1 → Phase 10).
4. Identify the **earliest incomplete phase**.
5. Run **only that phase**.
6. Report the result and next step.

**Example:**
- Phase 1 file exists and is Completed → skip.
- Phase 2 file exists and is Completed → skip.
- Phase 3 file does not exist → **run Phase 3**.

---

## 7. Phase Gates

### Gate before Phase 2
- `01-frontend-basic-design.md` must exist and be Completed.

### Gate before Phase 3
- `01-frontend-basic-design.md` must exist and be Completed.
- `02-backend-basic-design.md` must exist and be Completed.
- No Open Question from Phase 1 or Phase 2 marked `Must Resolve Before Coding: Yes` may remain unanswered.

### Gate before Phase 4 and Phase 5
- `03-api-contract-review.md` must exist.
- Approval Status must be `Approved` or `Approved with changes`.
- If Phase 3 status is `Changes required`, **AI must stop** and report what must be resolved.
- If any unresolved question is marked `Must Resolve Before Coding: Yes`, **AI must stop**.

### Gate before Phase 6
- `02-backend-basic-design.md` exists and is Completed.
- `03-api-contract-review.md` is Approved.
- `05-backend-implementation-plan.md` exists and is Completed.

### Gate before Phase 7
- `01-frontend-basic-design.md` exists and is Completed.
- `03-api-contract-review.md` is Approved.
- `04-frontend-implementation-plan.md` exists and is Completed.

### Gate before Phase 8
- Backend source code exists in `accounting_api/` matching the implementation plan.

### Gate before Phase 9
- Frontend source code exists in `accounting_web/` matching the implementation plan.

### Gate before Phase 10
- `03-api-contract-review.md` is Approved.
- Backend code exists in `accounting_api/`.
- Frontend code exists in `accounting_web/`.

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

## 9. Phase 1 Rules — Frontend Basic Design

**Skill file:** `.ai/skills/01-frontend-basic-design.md`

**Purpose:** Create frontend design document based on all input sources.

**Input:**
- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/images/` — current UI images
- `docs/features/{feature-folder}/references/images/` — reference UI images
- `docs/features/{feature-folder}/references/markdown/` — reference business documents

**Output:** `docs/features/{feature-folder}/01-frontend-basic-design.md`

**AI must analyze:**
1. Every image in `images/` — describe layout, components, fields, actions, filters, states.
2. Every image in `references/images/` — describe reference patterns and suggestions.
3. Every markdown file in `references/markdown/` — extract business rules, flows, validation, glossary.
4. `config.yaml` — use `name_vi`, `entities`, `permissions`, `frontend.stack`.

**AI must compare Current UI vs Reference UI vs Reference Markdown.**

### Required output sections

```
# Frontend Basic Design: {name_vi}

## Phase Status
Status: Completed

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
## 23. Open Questions
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

### Open Questions format

| # | Question | Context | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------|---------------------|------------------------------|

### Phase 1 restrictions
- Do not create any code in `accounting_web/`.
- Do not create any code in `accounting_api/`.
- Do not finalize backend API contract.
- Do not silently implement features that exist only in reference UI or markdown — mark them clearly and propose.
- Do not ignore conflicts.
- Do not ignore unclear items.

---

## 10. Phase 2 Rules — Backend Basic Design

**Skill file:** `.ai/skills/02-backend-basic-design.md`

**Purpose:** Create backend design document based on Phase 1 and all input sources.

**Input:**
- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/01-frontend-basic-design.md` — read entirely, especially: Confirmed Frontend Scope, Updated Frontend API Needs, Gap Analysis, Open Questions
- `docs/features/{feature-folder}/images/`
- `docs/features/{feature-folder}/references/images/`
- `docs/features/{feature-folder}/references/markdown/`

**Output:** `docs/features/{feature-folder}/02-backend-basic-design.md`

### Required output sections

```
# Backend Basic Design: {name_vi}

## Phase Status
Status: Completed

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
## 22. Open Questions
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

| # | Question | Context | Impact If Not Clarified | Recommended Default | Must Resolve Before Phase 3? |
|---|----------|---------|------------------------|---------------------|-------------------------------|

### Phase 2 restrictions
- Do not create any code in `accounting_api/`.
- Do not create any frontend code.
- Do not design API for features marked `Do Not Implement`.
- Do not silently add database fields only because a reference image contains them.
- Do not ignore frontend open questions from Phase 1.
- Do not ignore business rules found in reference markdown.
- If a capability is unclear but may affect API/database, mark it `Need Confirmation`.
- Do not expose EF entities — always design DTOs separately.

---

## 11. Phase 3 Rules — Backend API Contract Review

**Skill file:** `.ai/skills/03-backend-api-contract-review.md`

**Purpose:** Compare Phase 1 and Phase 2, resolve all gaps and open questions, produce the final API Contract that serves as **source of truth** for all subsequent phases.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-backend-basic-design.md`
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/03-api-contract-review.md`

### Required output sections

```
# Backend API Contract Review: {name_vi}

## Approval Status
Status: Approved | Approved with changes | Changes required

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
```

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

### Approval gate — Status must be `Changes required` if ANY of these exist:
- Critical mismatch between frontend and backend
- Missing endpoint for a confirmed frontend feature
- Missing permission for any endpoint
- Unclear DTO field type
- Unclear validation rule that affects API or database
- Any unresolved question marked `Must Resolve Before Coding: Yes`
- Tenant rule conflict
- Error response format mismatch

### Approval gate — Status may be `Approved` only when ALL of these are true:
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

---

## 12. Phase 4 Rules — Frontend Implementation Plan

**Skill file:** `.ai/skills/04-frontend-implementation-plan.md`

**Purpose:** Create the frontend coding plan based on Phase 1 design and Phase 3 contract.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/04-frontend-implementation-plan.md`

### Required output sections

```
# Frontend Implementation Plan: {name_vi}

## Phase Status
Status: Completed

## 1. Goal
## 2. Scope
## 3. Dependencies
## 4. File Change Plan
## 5. Implementation Steps
## 6. Data Flow
## 7. API Mapping
## 8. Query Key Strategy
## 9. Permission Strategy
## 10. Multi-tenant Strategy
## 11. Risk & Mitigation
## 12. Checklist Before Coding
```

**Every frontend file path must start with `accounting_web/`.**

Example paths:
- `accounting_web/src/features/suppliers/types/supplier.types.ts`
- `accounting_web/src/features/suppliers/services/supplierApi.ts`
- `accounting_web/src/features/suppliers/hooks/useSuppliers.ts`
- `accounting_web/src/features/suppliers/components/SupplierGrid.tsx`
- `accounting_web/src/features/suppliers/pages/SupplierListPage.tsx`

AI must not list backend files in this phase.

---

## 13. Phase 5 Rules — Backend Implementation Plan

**Skill file:** `.ai/skills/05-backend-implementation-plan.md`

**Purpose:** Create the backend coding plan based on Phase 2 design and Phase 3 contract.

**Input:**
- `docs/features/{feature-folder}/02-backend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/config.yaml`

**Output:** `docs/features/{feature-folder}/05-backend-implementation-plan.md`

### Required output sections

```
# Backend Implementation Plan: {name_vi}

## Phase Status
Status: Completed

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
```

**Every backend file path must start with `accounting_api/`.**

Example paths:
- `accounting_api/src/Accounting.Domain/Entities/Supplier.cs`
- `accounting_api/src/Accounting.Application/Suppliers/Dtos/SupplierListItemDto.cs`
- `accounting_api/src/Accounting.Application/Suppliers/Services/SupplierService.cs`
- `accounting_api/src/Accounting.Infrastructure/Persistence/Configurations/SupplierConfiguration.cs`
- `accounting_api/src/Accounting.Api/Controllers/SuppliersController.cs`

AI must not list frontend files in this phase.

---

## 14. Phase 6 Rules — Backend Coding

**Skill file:** `.ai/skills/06-backend-coding.md`

**Purpose:** Implement backend source code.

**Input:**
- `docs/features/{feature-folder}/02-backend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/05-backend-implementation-plan.md`

**Output:** Backend source code inside `accounting_api/` only.

### Required implementation order

1. Domain entity
2. Enum
3. EF Core configuration
4. DbContext update
5. DTOs
6. Validators
7. Repository interface
8. Repository implementation
9. Service interface
10. Service implementation
11. Controller
12. Permission constants
13. Dependency injection
14. Export service (if required)
15. Address normalization service (if required)
16. Seed data (if required)
17. Migration command

### Backend coding rules
- Follow Clean Architecture.
- Do not put business logic in Controller.
- Do not expose EF entities directly through API.
- Use DTOs.
- Use `async/await` and `CancellationToken`.
- Use FluentValidation.
- Use standard `ApiResponse<T>`.
- Use `PaginatedResult<T>` for list endpoints.
- Enforce tenant isolation in all queries and commands.
- Enforce permission on every endpoint.
- Do not hard-code `tenantId`.
- Do not hard-code `userId`.
- Avoid unsafe raw SQL.
- Do not modify `accounting_web/`.
- Read actual project structure before creating files to use the correct namespace.

---

## 15. Phase 7 Rules — Frontend Coding

**Skill file:** `.ai/skills/07-frontend-coding.md`

**Purpose:** Implement frontend source code.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/04-frontend-implementation-plan.md`

**Output:** Frontend source code inside `accounting_web/` only.

### Required implementation order

1. Types
2. Constants
3. API service
4. Query key factory
5. React Query hooks
6. Mock data (if needed)
7. Components
8. Page
9. Route
10. Permission UI
11. Loading / empty / error states
12. URL query params (if needed)

### Frontend coding rules
- Follow existing frontend architecture.
- Use API Contract as source of truth — do not invent endpoints.
- Do not call API directly inside UI components — use service functions.
- Use React Query hooks for all data fetching.
- Use typed DTOs — no `any` unless truly necessary.
- Do not hard-code `tenantId`.
- Do not hard-code permission strings.
- Handle loading, empty, and error states on every screen.
- Respect permission-based UI — hide (not just disable) when no permission.
- Include `tenantId` in query keys.
- Do not modify `accounting_api/`.
- Read actual project structure before creating files.

---

## 16. Phase 8 Rules — Backend Test

**Skill file:** `.ai/skills/08-backend-testing.md`

**Purpose:** Create backend test plan and backend test code.

**Input:**
- `docs/features/{feature-folder}/02-backend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/05-backend-implementation-plan.md`
- Backend source code in `accounting_api/`

**Output document:** `docs/features/{feature-folder}/08-backend-test-plan.md`

**Test code must be inside:** `accounting_api/tests/`

### Required test scope
- Service unit tests
- Validator unit tests
- Controller / API integration tests
- Permission tests (401, 403 scenarios)
- Multi-tenant isolation tests (cross-tenant access must fail)
- Error handling tests
- Paging / search / filter / sort tests

AI must not create backend test files outside `accounting_api/tests/`.

---

## 17. Phase 9 Rules — Frontend Test

**Skill file:** `.ai/skills/09-frontend-testing.md`

**Purpose:** Create frontend test plan and frontend test code.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- `docs/features/{feature-folder}/04-frontend-implementation-plan.md`
- Frontend source code in `accounting_web/`

**Output document:** `docs/features/{feature-folder}/09-frontend-test-plan.md`

**Test code must be inside:** `accounting_web/`

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

AI must not create frontend test files outside `accounting_web/`.

---

## 18. Phase 10 Rules — Integration Test

**Skill file:** `.ai/skills/10-integration-testing.md`

**Purpose:** Verify frontend and backend work together according to API Contract.

**Input:**
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/02-backend-basic-design.md`
- `docs/features/{feature-folder}/03-api-contract-review.md`
- Backend source code in `accounting_api/`
- Frontend source code in `accounting_web/`

**Output:** `docs/features/{feature-folder}/10-integration-test-plan.md`

### Required output sections

```
# Integration Test Plan: {name_vi}

## Phase Status
Status: Completed

## 1. Integration Scope
## 2. Environment
## 3. Test Data
## 4. API Contract Verification
## 5. End-to-End Scenarios
## 6. Playwright E2E Plan
## 7. Postman / HTTP Test Plan
## 8. Integration Defects Template
## 9. Exit Criteria
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

## 19. Final Response Rule

After each workflow run, AI must report in this format:

```markdown
# Workflow Result

## Feature
- Feature folder: docs/features/{folder}
- Feature key: {feature}
- Name VI: {name_vi}
- Phase completed: Phase {n} — {Phase Name}

## Inputs Checked
- Config: {path} — Found / Missing
- Current UI images: {path} — Found ({n} files) / Missing
- Reference UI images: {path} — Found ({n} files) / Missing
- Reference markdown docs: {path} — Found ({n} files) / Missing

## Output Created / Updated
- File: {path}

## Status
[Completed / Need Confirmation / Blocked]

## Blocking Reasons (if Blocked)
- ...

## Next Step
Run: /fullstack-feature-workflow {feature}
(or describe what user must do before running again)
```

---

## 20. User Confirmation Rules

### AI must ask for confirmation if:
- Feature config is missing → ask user to create config using template.
- Multiple config files match the command → ask which one.
- Phase 3 has unresolved questions marked `Must Resolve Before Coding: Yes`.
- API contract status is `Changes required`.
- A requested phase would create or modify source code.
- Feature scope is unclear after reading all inputs.
- AI cannot safely determine the current phase.

### AI must not ask for confirmation if:
- Exactly one config matches.
- The next phase is a documentation-only phase (Phase 1, 2, 3, 4, 5, 8 plan, 9 plan, 10 plan).
- All required input files exist.
- There are no blocking open questions.

---

## 21. Safety Rules

AI must never:
- Create backend files in `accounting_web/`.
- Create frontend files in `accounting_api/`.
- Skip the API Contract Review phase.
- Write code before implementation plans exist.
- Ignore missing input folders silently — always report them.
- Ignore unresolved API or database questions.
- Invent business rules without marking them as `Assumption`.
- Expose EF Core entities directly through API responses.
- Hard-code `tenantId` anywhere in backend or frontend code.
- Hard-code permission strings in frontend components.
- Move to Phase 4 or Phase 5 when Phase 3 status is `Changes required`.
- Move to Phase 6 or Phase 7 without approved implementation plans.

---

## 22. Usage

To run this workflow, type:

```
/fullstack-feature-workflow {feature}
```

Example:

```
/fullstack-feature-workflow danh-muc-nha-cung-cap
```

AI will then:
1. Find `docs/features/*/config.yaml` matching `feature: danh-muc-nha-cung-cap`.
2. Load the feature folder (e.g., `docs/features/suppliers/`).
3. Check input folders:
   - `images/`
   - `references/images/`
   - `references/markdown/`
4. Detect the next incomplete phase.
5. Run that phase only.
6. Create or update the correct output file.
7. Report the result and exact next step.

To create a new feature config, copy `.ai/templates/feature-config.template.yaml` to `docs/features/{feature-folder}/config.yaml` and fill in the values.
