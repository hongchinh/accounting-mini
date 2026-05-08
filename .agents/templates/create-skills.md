
Bạn là Principal Fullstack Architect, AI Workflow Engineer, Senior BA, Senior Frontend Architect, Senior Backend Architect và Senior UI Engineer chuyên pixel-perfect frontend.

Hãy cập nhật file:

.ai/skills/fullstack-feature-workflow.md

Mục tiêu:
Chỉnh sửa workflow fullstack theo khuyến nghị mới để workflow ổn định hơn, dễ tracking hơn, có UI Pixel Analysis sớm hơn, có issue tracking riêng, visual review riêng, và có review gate sau mỗi phase.

Sau khi cập nhật, khi tôi chạy:

/fullstack-feature-workflow danh-muc-nha-cung-cap

AI phải:
1. Tìm đúng feature config trong docs/features/*/config.yaml.
2. Match theo field feature hoặc folder.
3. Xác định feature folder.
4. Đọc config.yaml.
5. Kiểm tra input folders.
6. Đọc hoặc tạo workflow-status.md.
7. Đọc hoặc tạo issues.md.
8. Đọc hoặc tạo visual-review-issues.md nếu cần.
9. Tự xác định phase tiếp theo.
10. Chỉ chạy một phase tại một thời điểm.
11. Sau mỗi phase phải dừng lại để user review.
12. Không tự động chạy phase tiếp theo.
13. Chỉ chạy phase tiếp theo khi phase trước đã được user approve.
14. Không code khi chưa có explicit confirmation cho coding phase.
15. Không tiếp tục nếu còn blocking issues.
16. Không tiếp tục sau Phase 9 nếu còn Critical/High visual issues.

==================================================
1. UPDATE WORKFLOW PHASES
==================================================

Hãy cập nhật workflow thành 13 phase theo đúng thứ tự mới:

1. Frontend Basic Design
2. Frontend UI Pixel Analysis
3. Backend Basic Design
4. Backend API Contract Review
5. Frontend Implementation Plan
6. Backend Implementation Plan
7. Backend Coding
8. Frontend Coding
9. Frontend Visual Review
10. Backend Test
11. Frontend Test
12. Integration Test
13. Final Feature Review

Lý do thứ tự mới:
- Frontend Basic Design phân tích UI/nghiệp vụ đầu tiên.
- Frontend UI Pixel Analysis chạy sớm để phân tích ảnh, layout, spacing, typography, table/grid, design tokens.
- Backend Basic Design dùng kết quả Frontend Basic Design + UI Pixel Analysis + markdown nghiệp vụ.
- API Contract Review là hard gate trước khi planning/coding.
- Backend Coding trước Frontend Coding.
- Frontend Visual Review sau Frontend Coding để so sánh ảnh gốc và ảnh thực tế sau khi chạy app.
- Final Feature Review để đóng feature.

==================================================
2. UPDATE PHASE OUTPUT FILES
==================================================

Hãy cập nhật danh sách output files:

Phase 1 output:
docs/features/{feature-folder}/01-frontend-basic-design.md

Phase 2 output:
docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md

Phase 3 output:
docs/features/{feature-folder}/03-backend-basic-design.md

Phase 4 output:
docs/features/{feature-folder}/04-api-contract-review.md

Phase 5 output:
docs/features/{feature-folder}/05-frontend-implementation-plan.md

Phase 6 output:
docs/features/{feature-folder}/06-backend-implementation-plan.md

Phase 7 output:
docs/features/{feature-folder}/07-backend-coding-summary.md
Backend source code in accounting_api/

Phase 8 output:
docs/features/{feature-folder}/08-frontend-coding-summary.md
Frontend source code in accounting_web/

Phase 9 output:
docs/features/{feature-folder}/09-frontend-visual-review.md

Phase 10 output:
docs/features/{feature-folder}/10-backend-test-plan.md

Phase 11 output:
docs/features/{feature-folder}/11-frontend-test-plan.md

Phase 12 output:
docs/features/{feature-folder}/12-integration-test-plan.md

Phase 13 output:
docs/features/{feature-folder}/13-final-feature-review.md

Nếu workflow cũ đang dùng numbering cũ:
- 02-backend-basic-design.md
- 03-api-contract-review.md
- 04-frontend-ui-pixel-analysis.md
- 05-frontend-implementation-plan.md
- 06-backend-implementation-plan.md
- 08-backend-test-plan.md
- 09-frontend-test-plan.md
- 10-integration-test-plan.md

thì hãy cập nhật lại toàn bộ theo numbering mới ở trên.

==================================================
3. UPDATE FEATURE FOLDER STRUCTURE
==================================================

Feature folder chuẩn:

docs/features/{feature-folder}/
├── config.yaml
├── workflow-status.md
├── issues.md
├── visual-review-issues.md
├── images/
├── actual/
├── references/
│   ├── images/
│   └── markdown/
├── 01-frontend-basic-design.md
├── 02-frontend-ui-pixel-analysis.md
├── 03-backend-basic-design.md
├── 04-api-contract-review.md
├── 05-frontend-implementation-plan.md
├── 06-backend-implementation-plan.md
├── 07-backend-coding-summary.md
├── 08-frontend-coding-summary.md
├── 09-frontend-visual-review.md
├── 10-backend-test-plan.md
├── 11-frontend-test-plan.md
├── 12-integration-test-plan.md
└── 13-final-feature-review.md

Purpose:
- workflow-status.md: chỉ tracking phase, status, review status, current phase.
- issues.md: tracking Missing / Unclear / Conflict / Assumption / User Question.
- visual-review-issues.md: tracking visual mismatches sau Phase 9.
- actual/: lưu ảnh screenshot thực tế sau khi user chạy app.
- images/: ảnh UI hiện tại cần implement.
- references/images/: ảnh UI tham khảo.
- references/markdown/: tài liệu nghiệp vụ/hướng dẫn tham khảo.

==================================================
4. UPDATE WORKFLOW STATUS FORMAT
==================================================

workflow-status.md chỉ nên tracking ngắn gọn, không chứa toàn bộ issues chi tiết.

Format:

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

Allowed Status values:
- Not Started
- In Progress
- Completed
- Blocked

Allowed Review Status values:
- Pending
- Approved
- Changes Requested
- Not Required

## Next Action

Describe exactly what the user should do next.

Rules:
- AI must read workflow-status.md before deciding next phase.
- AI must update workflow-status.md after every phase.
- AI must not rely only on output file existence.
- AI must stop after every phase and wait for review.

==================================================
5. ADD ISSUES.MD RULE
==================================================

For every feature, AI must create or update:

docs/features/{feature-folder}/issues.md

Purpose:
Track all unclear, incomplete, missing, conflicting, assumed, or user-confirmation items across phases.

Format:

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

Allowed Type values:
- Missing Information
- Unclear Requirement
- Conflict
- Assumption
- User Question
- API Contract Issue
- Database Issue
- Permission Issue
- Tenant Issue
- Validation Issue
- Code Issue
- Test Issue

Allowed Blocking? values:
- Yes
- No

Allowed Status values:
- Open
- Answered
- Resolved
- Deferred

Issue ID convention:
- P1-Q1, P1-M1, P1-C1, P1-A1
- P2-Q1, P2-M1, P2-C1, P2-A1
- P4-API1
- P7-CODE1

Rules:
- Every phase output must include an Unclear / Incomplete Items section.
- AI must copy all unresolved items into issues.md.
- If any issue has Blocking? = Yes and Status = Open, AI must not continue to the next phase.
- If user answers an issue, AI must update issues.md.
- AI must not hide uncertainty in prose without adding it to issues.md.

==================================================
6. ADD VISUAL-REVIEW-ISSUES.MD RULE
==================================================

For every feature with visual review enabled, AI must create or update:

docs/features/{feature-folder}/visual-review-issues.md

Purpose:
Track visual mismatch issues found in Phase 9.

Format:

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

Allowed Severity:
- Critical
- High
- Medium
- Low

Allowed Status:
- Open
- Fixed
- Resolved
- Deferred

Rules:
- Critical and High visual issues block approval of Phase 9.
- Medium and Low can be deferred with user approval.
- AI must not continue to Phase 11/12 if Critical or High visual issues remain open.
- AI must never claim pixel-perfect match without actual screenshot comparison.

==================================================
7. UPDATE CONFIG TEMPLATE
==================================================

Update .ai/templates/feature-config.template.yaml:

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
  actual_ui_images: docs/features/suppliers/actual

visual_review:
  enabled: true
  source_priority:
    - current_ui_images
    - reference_ui_images
    - reference_markdown
  require_actual_screenshot: true
  block_on_critical: true
  block_on_high: true
  allow_approve_with_medium: true
  allow_approve_with_low: true

workflow:
  phases:
    - frontend-basic-design
    - frontend-ui-pixel-analysis
    - backend-basic-design
    - backend-api-contract-review
    - frontend-implementation-plan
    - backend-implementation-plan
    - backend-coding
    - frontend-coding
    - frontend-visual-review
    - backend-test
    - frontend-test
    - integration-test
    - final-feature-review

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

==================================================
8. UPDATE PHASE GATES
==================================================

Gate before Phase 2:
- Phase 1 output must exist.
- Phase 1 Review Status must be Approved.
- No open blocking issues from Phase 1.

Gate before Phase 3:
- Phase 1 output must exist.
- Phase 2 output must exist.
- Phase 1 Review Status must be Approved.
- Phase 2 Review Status must be Approved.
- No open blocking issues from Phase 1 or Phase 2.

Gate before Phase 4:
- Phase 1 output must exist.
- Phase 2 output must exist.
- Phase 3 output must exist.
- Phase 1 Review Status must be Approved.
- Phase 2 Review Status must be Approved.
- Phase 3 Review Status must be Approved.
- No open blocking issues from Phase 1, Phase 2, or Phase 3.

Gate before Phase 5:
- Phase 1 output must exist.
- Phase 2 UI Pixel Analysis output must exist.
- Phase 4 API Contract Review output must exist.
- Phase 4 Approval Status must be Approved.
- Phase 2 Review Status must be Approved.
- Phase 4 Review Status must be Approved.
- No open blocking issues.

Gate before Phase 6:
- Phase 3 Backend Basic Design output must exist.
- Phase 4 API Contract Review output must exist.
- Phase 4 Approval Status must be Approved.
- Phase 3 Review Status must be Approved.
- Phase 4 Review Status must be Approved.
- No open blocking issues.

Gate before Phase 7:
- Phase 3 output must exist.
- Phase 4 output must be Approved.
- Phase 6 output must exist.
- Phase 6 Review Status must be Approved.
- User must explicitly confirm backend coding.
- No open blocking issues.

Gate before Phase 8:
- Phase 1 output must exist.
- Phase 2 UI Pixel Analysis output must exist.
- Phase 4 API Contract Review output must be Approved.
- Phase 5 Frontend Implementation Plan output must exist.
- Phase 2 Review Status must be Approved.
- Phase 5 Review Status must be Approved.
- User must explicitly confirm frontend coding.
- No open blocking issues.

Gate before Phase 9:
- Phase 8 Frontend Coding must be completed.
- Phase 8 Review Status must be Approved.
- Actual screenshots must be available in docs/features/{feature-folder}/actual/ or uploaded in conversation.
- If actual screenshots are missing, Phase 9 status must be Blocked / Waiting for Screenshot.

Gate before Phase 10:
- Phase 7 Backend Coding must be completed.
- Phase 7 Review Status must be Approved.
- No open backend blocking issues.

Gate before Phase 11:
- Phase 8 Frontend Coding must be completed.
- Phase 9 Frontend Visual Review must be Approved or Approved with minor issues.
- No open Critical or High visual issues.

Gate before Phase 12:
- Phase 10 Backend Test Review Status must be Approved.
- Phase 11 Frontend Test Review Status must be Approved.
- Phase 4 API Contract Review Status must be Approved.
- No open blocking issues.

Gate before Phase 13:
- Phase 12 Integration Test Review Status must be Approved.
- No open blocking issues.
- No open Critical or High visual issues.

==================================================
9. UPDATE APPROVAL RULE
==================================================

When user says:

approve phase {number}

or:

duyệt phase {number}

or:

ok phase {number}

AI must:
1. Read workflow-status.md.
2. Read issues.md.
3. Read visual-review-issues.md if the phase is 9 or later.
4. Check whether the phase has open blocking issues.
5. If open blocking issues exist, refuse approval and list them.
6. If no open blocking issues exist, set Review Status to Approved.
7. Update Approved At.
8. Tell user to run /fullstack-feature-workflow {feature} to continue.

AI must not approve a phase with unresolved blocking issues.

If the phase has only non-blocking open issues, AI may approve if user says:

approve phase {number} with deferred items

Then AI must mark those non-blocking open issues as Deferred.

==================================================
10. UPDATE USER ANSWER RULE
==================================================

When user says:

answer item {ID}: {answer}

or:

confirm item {ID}: {decision}

AI must:
1. Locate the item in issues.md.
2. Add the user answer.
3. Set Status to Answered or Resolved.
4. If the answer affects a phase document, update that phase document.
5. If all blocking issues are resolved, tell user they can approve the phase.
6. Do not continue to next phase automatically unless user explicitly asks and phase approval rules allow it.

==================================================
11. ADD VISUAL FIX RULE
==================================================

When Phase 9 result is:

Frontend Visual Status: Changes required

AI must not allow Phase 11 Frontend Test or Phase 12 Integration Test to proceed.

User may request:

fix visual issues phase 9

or:

fix visual issues P9

or:

sửa UI theo visual review

When this command is used, AI must:
1. Read docs/features/{feature-folder}/09-frontend-visual-review.md.
2. Read visual-review-issues.md.
3. Fix only Critical and High issues first.
4. Modify only frontend files inside accounting_web/.
5. Do not change API logic unless the visual issue requires data display adjustment.
6. Do not modify accounting_api/.
7. After fixing, update docs/features/{feature-folder}/08-frontend-coding-summary.md.
8. Update visual-review-issues.md.
9. Ask user to rerun app and provide new screenshots.
10. Keep Phase 9 Review Status as Pending until visual review passes.

If user requests:

fix all visual issues

AI may fix Medium and Low issues too, but must still prioritize Critical/High.

==================================================
12. UPDATE PHASE 1: FRONTEND BASIC DESIGN
==================================================

Purpose:
Create frontend design document based on:
- config.yaml
- current UI images
- reference UI images
- reference markdown documents

Input:
- docs/features/{feature-folder}/config.yaml
- docs/features/{feature-folder}/images/
- docs/features/{feature-folder}/references/images/
- docs/features/{feature-folder}/references/markdown/

Output:
docs/features/{feature-folder}/01-frontend-basic-design.md

Required output sections:

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

Feature Comparison Matrix required:

| Feature / Capability | Current UI | Reference UI | Reference Markdown | Status | Decision |
|---|---|---|---|---|---|

Allowed Status:
- Matched
- Missing in Current UI
- Missing in Reference UI
- Mentioned in Docs Only
- UI Only
- Conflict
- Unclear

Allowed Decision:
- Implement
- Do Not Implement
- Need Confirmation
- Defer
- Backend Only
- Frontend Only

Source priority:
1. Current UI images
2. User requirement / config
3. Reference markdown
4. Reference UI images

Rules:
- Do not create code.
- Do not finalize API contract.
- Do not silently implement reference-only features.
- Any unclear item must be added to issues.md.

==================================================
13. ADD PHASE 2: FRONTEND UI PIXEL ANALYSIS
==================================================

Purpose:
Create precise UI implementation specification from screenshots before backend design, frontend plan, and frontend coding.

Input:
- docs/features/{feature-folder}/config.yaml
- docs/features/{feature-folder}/01-frontend-basic-design.md
- docs/features/{feature-folder}/images/
- docs/features/{feature-folder}/references/images/
- docs/features/{feature-folder}/references/markdown/ if relevant
- existing style guide if available

Output:
docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md

Optional support files:
docs/features/{feature-folder}/ui-spec/design-tokens.md
docs/features/{feature-folder}/ui-spec/layout-measurement.md
docs/features/{feature-folder}/ui-spec/pixel-review-checklist.md

Required output sections:

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
## 8. Grid/Table Specification
## 9. Interaction Visual States
## 10. Pixel-perfect Implementation Rules
## 11. Pixel Review Checklist
## 12. Unclear / Incomplete Items
## 13. Definition of Done

Visual Source Priority:
1. Current UI images = main source for implementation.
2. Reference UI images = UX/reference only.
3. Reference markdown = business behavior reference.

Rules:
- Do not code.
- Estimate measurements when exact values are unavailable.
- Mark confidence: High / Medium / Low.
- Low-confidence measurements must be listed as assumptions.
- Any unclear visual detail must be added to issues.md.

==================================================
14. UPDATE PHASE 3: BACKEND BASIC DESIGN
==================================================

Purpose:
Create backend design based on:
- config.yaml
- Frontend Basic Design
- Frontend UI Pixel Analysis
- current UI images
- reference UI images
- reference markdown

Input:
- docs/features/{feature-folder}/config.yaml
- docs/features/{feature-folder}/01-frontend-basic-design.md
- docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md
- docs/features/{feature-folder}/images/
- docs/features/{feature-folder}/references/images/
- docs/features/{feature-folder}/references/markdown/

Output:
docs/features/{feature-folder}/03-backend-basic-design.md

Required output sections:

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

Rules:
- Do not create backend code.
- Do not design API for Do Not Implement features.
- Do not create database fields only because reference UI contains them.
- Any unclear API/database/business rule must be added to issues.md.

==================================================
15. UPDATE PHASE 4: API CONTRACT REVIEW
==================================================

Purpose:
Compare Phase 1, Phase 2, and Phase 3, then produce final API contract.

Input:
- docs/features/{feature-folder}/01-frontend-basic-design.md
- docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md
- docs/features/{feature-folder}/03-backend-basic-design.md
- docs/features/{feature-folder}/config.yaml

Output:
docs/features/{feature-folder}/04-api-contract-review.md

Required output sections:

# Backend API Contract Review: {name_vi}

## Approval Status
Status: Approved | Changes required
Blocking Issues: Yes | No
User Confirmation Required: Yes | No

## 1. Review Summary
## 2. Frontend API Needs
## 3. Backend Proposed APIs
## 4. Cross-source Feature Alignment Review
## 5. Gap Analysis
## 6. Final API Contract
### 6.1 Standard Success Response
### 6.2 Standard Error Response
### 6.3 Pagination Response
### 6.4 Endpoint Contracts
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

Important:
API Contract status must only be:
- Approved
- Changes required

Do not use:
- Approved with changes

Rules:
- If changes are needed, status must be Changes required.
- If any blocking question exists, status must be Changes required.
- API Contract Review is a hard gate for planning/coding.
- All API contract issues must be added to issues.md.

==================================================
16. UPDATE PHASE 5: FRONTEND IMPLEMENTATION PLAN
==================================================

Input:
- 01-frontend-basic-design.md
- 02-frontend-ui-pixel-analysis.md
- 04-api-contract-review.md
- config.yaml

Output:
docs/features/{feature-folder}/05-frontend-implementation-plan.md

Required sections:

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

Rules:
- Every frontend file path must start with accounting_web/.
- Plan must include exact file paths and order of modification.
- Plan must include how UI Pixel Analysis will be implemented.
- Plan must include visual review preparation.

==================================================
17. UPDATE PHASE 6: BACKEND IMPLEMENTATION PLAN
==================================================

Input:
- 03-backend-basic-design.md
- 04-api-contract-review.md
- config.yaml

Output:
docs/features/{feature-folder}/06-backend-implementation-plan.md

Required sections:

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

Rules:
- Every backend file path must start with accounting_api/.
- Plan must include exact file paths and order of modification.
- Plan must follow Clean Architecture.
- Plan must implement API Contract.

==================================================
18. UPDATE PHASE 7: BACKEND CODING
==================================================

Input:
- 03-backend-basic-design.md
- 04-api-contract-review.md
- 06-backend-implementation-plan.md

Output:
- Backend source code only inside accounting_api/
- docs/features/{feature-folder}/07-backend-coding-summary.md

Required backend coding confirmation:
- confirm backend coding
- xác nhận code backend

Required implementation order:
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
14. Export service if required
15. Address normalization service if required
16. Seed data if required
17. Migration command
18. Typecheck/build/test if available

07-backend-coding-summary.md sections:

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

Rules:
- Do not modify accounting_web/.
- Do not expose EF entities directly.
- Enforce tenant and permission.
- Run build/test if available, or report that it could not be run.

==================================================
19. UPDATE PHASE 8: FRONTEND CODING
==================================================

Input:
- 01-frontend-basic-design.md
- 02-frontend-ui-pixel-analysis.md
- 04-api-contract-review.md
- 05-frontend-implementation-plan.md

Output:
- Frontend source code only inside accounting_web/
- docs/features/{feature-folder}/08-frontend-coding-summary.md

Required frontend coding confirmation:
- confirm frontend coding
- xác nhận code frontend

Required implementation order:
1. Types
2. Constants
3. Design tokens
4. API service
5. Query key factory
6. React Query hooks
7. Mock data if needed
8. Components
9. Page
10. Route
11. Permission UI
12. Loading/empty/error states
13. URL query params if needed
14. Visual review preparation
15. Typecheck/build/test if available

08-frontend-coding-summary.md sections:

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

Required Actual Screenshots:
User must run frontend app and capture screenshots into:

docs/features/{feature-folder}/actual/

Recommended screenshots:
- actual-list-full-page.png
- actual-toolbar.png
- actual-grid.png
- actual-pagination.png
- actual-dropdown-open.png if applicable
- actual-modal.png if applicable

Rules:
- Do not modify accounting_api/.
- Use API Contract as source of truth.
- Use UI Pixel Analysis as visual source of truth.
- Use design tokens.
- Do not change visual hierarchy.
- Run typecheck/build/test if available, or report that it could not be run.

==================================================
20. UPDATE PHASE 9: FRONTEND VISUAL REVIEW
==================================================

Input:
- docs/features/{feature-folder}/images/
- docs/features/{feature-folder}/actual/
- 02-frontend-ui-pixel-analysis.md
- 08-frontend-coding-summary.md
- uploaded screenshots if provided

Output:
docs/features/{feature-folder}/09-frontend-visual-review.md
docs/features/{feature-folder}/visual-review-issues.md

If actual screenshot is missing:
- Phase 9 Status: Blocked
- Waiting for screenshot: Yes
- Ask user to run frontend, capture screenshots, and place them in actual/ or upload them.

Required sections:

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

Frontend Visual Status:
- Approved
- Approved with minor issues
- Changes required

Rules:
- If any Critical issue exists, status must be Changes required.
- If any High issue exists, status must be Changes required.
- If only Medium/Low issues exist, status may be Approved with minor issues.
- If no issues or acceptable Low issues exist, status may be Approved.
- Do not approve without actual screenshots.
- Current UI images are main source for comparison.
- Reference UI is secondary.

==================================================
21. UPDATE PHASE 10: BACKEND TEST
==================================================

Input:
- 03-backend-basic-design.md
- 04-api-contract-review.md
- 06-backend-implementation-plan.md
- Backend code in accounting_api/

Output:
docs/features/{feature-folder}/10-backend-test-plan.md
Backend test code only inside accounting_api/tests/

Required test scope:
- service tests
- validator tests
- controller/API integration tests
- permission tests
- tenant isolation tests
- error handling tests
- paging/search/filter/sort tests

Required sections:
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

==================================================
22. UPDATE PHASE 11: FRONTEND TEST
==================================================

Input:
- 01-frontend-basic-design.md
- 02-frontend-ui-pixel-analysis.md
- 04-api-contract-review.md
- 05-frontend-implementation-plan.md
- Frontend code in accounting_web/

Output:
docs/features/{feature-folder}/11-frontend-test-plan.md
Frontend test code only inside accounting_web/

Required test scope:
- component tests
- hook tests
- MSW handlers
- permission tests
- loading/empty/error state tests
- user interaction tests
- tenant switch tests if applicable
- visual-sensitive component tests where useful

Required sections:
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

==================================================
23. UPDATE PHASE 12: INTEGRATION TEST
==================================================

Input:
- 01-frontend-basic-design.md
- 03-backend-basic-design.md
- 04-api-contract-review.md
- Backend code in accounting_api/
- Frontend code in accounting_web/
- Backend test result
- Frontend test result
- Visual review result

Output:
docs/features/{feature-folder}/12-integration-test-plan.md

Required sections:
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

Required scenarios:
1. Load List
2. Search
3. Filter
4. Pagination
5. Sorting
6. Create
7. Update
8. Delete
9. Permission
10. Tenant Isolation
11. Validation Error
12. Server Error

==================================================
24. ADD PHASE 13: FINAL FEATURE REVIEW
==================================================

Input:
- All previous phase outputs
- workflow-status.md
- issues.md
- visual-review-issues.md
- Backend code
- Frontend code
- Test outputs

Output:
docs/features/{feature-folder}/13-final-feature-review.md

Required sections:

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

Final Verdict allowed values:
- Ready to Merge
- Ready with Deferred Items
- Changes Required
- Blocked

Ready to Merge only if:
- All phases approved.
- No open blocking issues.
- No open Critical/High visual issues.
- API Contract approved.
- Backend and frontend tests are completed or limitations are clearly documented.
- Integration test completed.

==================================================
25. UPDATE FINAL RESPONSE RULE
==================================================

After every phase run, AI must respond with:

# Workflow Result

## Feature

- Feature folder:
- Feature key:
- Name VI:

## Completed Phase

- Phase:
- Stage:
- Phase name:
- Output:

## Tracking Updated

- workflow-status.md:
- issues.md:
- visual-review-issues.md if relevant:

## Inputs Checked

- Config:
- Current UI images:
- Reference UI images:
- Reference markdown docs:
- Actual screenshots if relevant:

## Issues Summary

| Type | Open Blocking | Open Non-blocking | Resolved | Deferred |
|---|---:|---:|---:|---:|

## Visual Review Summary

Show only if current phase is 8 or 9:
- Actual screenshots required: Yes / No
- Actual screenshots found: Yes / No
- Critical issues:
- High issues:
- Medium issues:
- Low issues:
- Visual status:

## Status

Completed. Waiting for user review.

If blocking issues exist:
Blocked from next phase until required items are resolved.

If actual screenshots are required:
Please run the frontend app and capture actual screenshots into:
docs/features/{feature-folder}/actual/

or upload screenshots into the conversation.

## Next Step

If there are blocking items:
answer item {ID}: {your answer}

or:
confirm item {ID}: {decision}

If there are no blocking items:
approve phase {phase-number}

If Phase 9 has visual issues:
fix visual issues phase 9

==================================================
26. UPDATE USAGE SECTION
==================================================

Add/update usage section:

# Usage

To run this workflow:

/fullstack-feature-workflow {feature}

Example:

/fullstack-feature-workflow danh-muc-nha-cung-cap

Normal flow:
1. AI finds config.
2. AI detects next phase.
3. AI checks workflow-status.md.
4. AI checks issues.md.
5. AI checks visual-review-issues.md if relevant.
6. AI runs one phase only.
7. AI updates tracking files.
8. AI stops for user review.

Approval:
approve phase {number}

Request changes:
changes requested phase {number}: {notes}

Answer issue:
answer item {ID}: {answer}

Confirm issue:
confirm item {ID}: {decision}

Confirm backend coding:
confirm backend coding

Confirm frontend coding:
confirm frontend coding

Visual review flow:
1. AI completes Phase 8 Frontend Coding.
2. User runs frontend app.
3. User captures actual screenshots into:
   docs/features/{feature-folder}/actual/
   or uploads screenshots to conversation.
4. User runs:
   /fullstack-feature-workflow {feature}
5. AI performs Phase 9 Frontend Visual Review.
6. If Critical/High issues exist, user runs:
   fix visual issues phase 9
7. User captures new screenshots.
8. AI reviews again.
9. When visual status is Approved or Approved with minor issues, user can approve Phase 9.

==================================================
27. UPDATE SAFETY RULES
==================================================

AI must never:
- create backend files in accounting_web/
- create frontend files in accounting_api/
- skip API Contract Review
- code before implementation plans
- continue to next phase without user review approval
- ignore missing input folders silently
- ignore unresolved API/database questions
- ignore open blocking issues
- ignore Critical/High visual issues
- invent business rules without marking assumptions
- expose EF entities directly through backend API
- hard-code tenantId
- hard-code permissions
- mark frontend visual review as approved without actual screenshots
- treat reference UI as main visual source when current UI exists
- modify backend code while fixing frontend visual issues
- change API contract to solve a purely visual issue
- claim pixel-perfect match without visual comparison
- hide uncertainty without adding it to issues.md

==================================================
28. FINAL REPORT AFTER UPDATE
==================================================

After updating, report:

1. File updated:
   - .ai/skills/fullstack-feature-workflow.md

2. File updated:
   - .ai/templates/feature-config.template.yaml

3. New workflow order:
   - 1 Frontend Basic Design
   - 2 Frontend UI Pixel Analysis
   - 3 Backend Basic Design
   - 4 Backend API Contract Review
   - 5 Frontend Implementation Plan
   - 6 Backend Implementation Plan
   - 7 Backend Coding
   - 8 Frontend Coding
   - 9 Frontend Visual Review
   - 10 Backend Test
   - 11 Frontend Test
   - 12 Integration Test
   - 13 Final Feature Review

4. Tracking files:
   - workflow-status.md
   - issues.md
   - visual-review-issues.md

5. Important gates added:
   - review gate after every phase
   - blocking issues gate
   - API contract hard gate
   - frontend visual review gate
   - coding confirmation gate

6. Example commands:
   - /fullstack-feature-workflow danh-muc-nha-cung-cap
   - approve phase 1
   - answer item P1-Q1: ...
   - confirm backend coding
   - confirm frontend coding
   - fix visual issues phase 9