# Skill 01 — Frontend Basic Design

## Role

Senior React Frontend Architect, UI/UX Analyst, Senior Business Analyst.

## Goal

Tạo tài liệu thiết kế cơ bản frontend trước khi code. Phân tích đầy đủ các nguồn input (UI hiện tại, UI tham khảo, tài liệu nghiệp vụ), so sánh tính năng, xác định gap, và tạo thiết kế UI/UX cùng frontend model. Không code ở phase này.

---

## Input

| Source | Path | Purpose |
|--------|------|---------|
| Current UI images | `docs/features/{feature-name}/images/` | UI hiện tại cần implement |
| Reference UI images | `docs/features/{feature-name}/references/images/` | UI tham khảo (MISA, KiotViet...) |
| Reference markdown docs | `docs/features/{feature-name}/references/markdown/` | Hướng dẫn nghiệp vụ tham khảo |
| Business requirements | Mô tả từ người dùng | Chức năng cần implement |
| Tech stack info | Mô tả từ người dùng | React, TypeScript, Vite, TailwindCSS... |

**Nếu thiếu nguồn nào:** Vẫn tiếp tục, nhưng phải ghi rõ trạng thái Missing trong phần Input Analysis.

---

## Output

```
docs/features/{feature-name}/01-frontend-basic-design.md
```

---

## Required Output Format

```markdown
# Frontend Basic Design: {Feature Name}

---

# PART A — INPUT ANALYSIS

## A1. Input Sources

| Source | Path | Purpose | Status |
|--------|------|---------|--------|
| Current UI images | docs/features/{feature-name}/images/ | UI hiện tại cần implement | Found / Missing |
| Reference UI images | docs/features/{feature-name}/references/images/ | UI tham khảo | Found / Missing |
| Reference markdown docs | docs/features/{feature-name}/references/markdown/ | Hướng dẫn nghiệp vụ | Found / Missing |

**Missing Inputs:** (Liệt kê nguồn thiếu và tác động)

---

## A2. Current UI Analysis

> Phân tích từng ảnh trong `docs/features/{feature-name}/images/`

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
|------|-----------|-------------|

---

## A3. Reference UI Analysis

> Phân tích từng ảnh trong `docs/features/{feature-name}/references/images/`

### A3.1 Reference Screens Identified

| Screen | File | Source System | Description |
|--------|------|--------------|-------------|

### A3.2 Layout Analysis

| Reference Screen | UI Area | Observed Elements | Suggested Usage |
|-----------------|---------|-------------------|----------------|

### A3.3 Reference Feature Inventory

| Feature / Capability | UI Area | Elements | Notes |
|----------------------|---------|----------|-------|

### A3.4 UX Patterns Worth Adopting

| Pattern | Reference Source | Description | Recommendation |
|---------|-----------------|-------------|---------------|

---

## A4. Reference Markdown Analysis

> Phân tích từng file trong `docs/features/{feature-name}/references/markdown/`

### A4.1 Documents Processed

| Document | File | Summary |
|----------|------|---------|

### A4.2 Business Capabilities Extracted

| Capability | Source Document | Description | Impact on Design |
|------------|----------------|-------------|-----------------|

### A4.3 Business Rules Extracted

| Rule | Source | Description | Impact on Design |
|------|--------|-------------|-----------------|

### A4.4 Validation Rules Extracted

| Field / Action | Rule | Source | Impact |
|---------------|------|--------|--------|

### A4.5 User Flows Extracted

| Flow | Steps | Source | Notes |
|------|-------|--------|-------|

### A4.6 Terminology Glossary

| Term | Definition | Source |
|------|-----------|--------|

---

## A5. Feature Comparison Matrix

> So sánh tính năng giữa 3 nguồn: Current UI / Reference UI / Reference Markdown

| Feature / Capability | Current UI | Reference UI | Reference Markdown | Status | Decision |
|----------------------|-----------|-------------|-------------------|--------|----------|

**Status values:**
- `Matched` — có trong cả 3 nguồn
- `Missing in Current UI` — có trong reference nhưng chưa thấy trong current UI
- `Missing in Reference UI` — có trong current UI nhưng không thấy trong reference
- `Mentioned in Docs Only` — chỉ có trong markdown, không thấy trên UI nào
- `UI Only` — chỉ thấy trên UI, không đề cập trong docs
- `Conflict` — các nguồn mâu thuẫn nhau
- `Unclear` — không đủ thông tin để xác định

**Decision values:**
- `Implement` — sẽ implement
- `Do Not Implement` — loại khỏi scope
- `Need Confirmation` — cần xác nhận với người dùng
- `Defer` — defer sang phase sau
- `Backend Only` — chỉ cần backend, không cần frontend
- `Frontend Only` — chỉ cần frontend, không cần backend API

---

## A6. Gap Analysis

### A6.1 Missing Features

> Tính năng có trong reference nhưng chưa thấy trong current UI

| Feature | Found In | Missing From | Impact | Recommendation |
|---------|----------|-------------|--------|---------------|

### A6.2 Extra Features

> Tính năng có trong current UI nhưng không thấy trong reference

| Feature | Found In | Not Found In | Risk | Recommendation |
|---------|----------|-------------|------|---------------|

### A6.3 Conflicting Features

> Điểm mâu thuẫn giữa các nguồn

| Topic | Current UI | Reference UI | Reference Markdown | Conflict | Proposed Resolution |
|-------|-----------|-------------|-------------------|----------|---------------------|

### A6.4 Unclear Items — Open Questions

> Điểm không đủ thông tin, cần hỏi lại người dùng

| # | Question | Context | Options | Recommended Default |
|---|----------|---------|---------|---------------------|

---

## A7. Confirmed Frontend Scope

> Phạm vi frontend được xác nhận sau phân tích

| Feature | Include? | Reason | Source |
|---------|----------|--------|--------|

**Include? values:** `Yes` / `No` / `Need Confirmation` / `Later`

---

## A8. Updated Frontend API Needs

> API needs suy ra từ toàn bộ input sources — không chỉ từ current UI

| UI Action | Required By | Method Draft | Endpoint Draft | Request | Response | Notes |
|-----------|------------|-------------|---------------|---------|----------|-------|

**Required By values:** `Current UI` / `Reference UI` / `Reference Markdown` / `Business Rule` / `Derived`

---

## A9. Frontend Basic Design Decision Log

| # | Decision | Reason | Source | Impact |
|---|----------|--------|--------|--------|

**Source values:** `Current UI` / `Reference UI` / `Reference Markdown` / `Assumption` / `User Confirmation Needed`

---

# PART B — FRONTEND DESIGN

## 1. Overview
### 1.1 Purpose
### 1.2 Business Context
### 1.3 Target Users
### 1.4 Related Screens

---

## 2. Screen Layout
### 2.1 Page Structure
(Mô tả layout tổng thể: header, breadcrumb, toolbar, filter, grid, pagination, dialogs)

### 2.2 Toolbar Area
(Các button hành động: Add, Edit, Delete, Export, Bulk actions)

### 2.3 Filter Area
(Các ô tìm kiếm, dropdown filter, date range)

### 2.4 Data Grid / Table
(Danh sách cột, sortable columns, action columns, row selection)

### 2.5 Summary Cards
(Thống kê tổng quan nếu có: tổng số, tổng tiền, số active...)

### 2.6 Detail / Form Dialog
(Popup hoặc drawer cho thêm mới / cập nhật / xem chi tiết)

### 2.7 Pagination
(Strategy: server-side hay client-side, page size options)

### 2.8 Notifications / Toast
(Success, error, warning messages)

---

## 3. Component Design
### 3.1 Component Tree
(Cây component từ Page xuống các leaf components)

### 3.2 Component Responsibilities
(Mỗi component làm gì, nhận props gì, emit events gì)

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

## 5. Frontend API Needs (Final — from A8)

> Tổng hợp từ A8 — đây là expectation của frontend, chưa phải contract cuối cùng

| UI Action | Required By | Method | Endpoint (expected) | Request | Response |
|-----------|------------|--------|---------------------|---------|----------|

---

## 6. State Management
### 6.1 URL / Query State
- keyword
- filters (status, group, date range...)
- pageIndex
- pageSize
- sortBy
- sortDirection

### 6.2 UI State
- selectedRows
- loading
- error
- modalOpen (add/edit/detail/delete confirm)
- activeTab

### 6.3 Server State (React Query)
- listQuery (paged data)
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
(Mô tả flow từng interaction)

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
- tenantId lấy từ tenant context (không hard-code)
- React Query key chứa tenantId
- Reload data khi đổi tenant
- Không lưu tenantId vào localStorage dạng hard-code

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
(Tổng hợp từ A6.4 — các câu hỏi cần xác nhận trước khi chuyển sang Phase 2)

| # | Question | Context | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------|---------------------|------------------------------|
```

---

## Rules

1. **Không code ở phase này.**
2. **Không tạo file trong `accounting_web/` ở phase này.**
3. Chỉ tạo file tài liệu tại `docs/features/{feature-name}/01-frontend-basic-design.md`.
4. **Phải phân tích tất cả file ảnh trong `docs/features/{feature-name}/images/` nếu có.**
5. **Phải phân tích tất cả file ảnh trong `docs/features/{feature-name}/references/images/` nếu có.**
6. **Phải phân tích tất cả file markdown trong `docs/features/{feature-name}/references/markdown/` nếu có.**
7. **Không được bỏ qua phần Feature Comparison Matrix (A5).**
8. **Không được bỏ qua phần Gap Analysis (A6).**
9. **Không được tự ý implement tính năng có status `Conflict` hoặc `Unclear`** — phải đưa vào Need Confirmation.
10. Nếu markdown và ảnh mâu thuẫn → ưu tiên đưa vào `Need Confirmation`.
11. Nếu reference UI có tính năng nhưng current UI không có → không mặc định implement; đánh dấu `Missing in Current UI` và đề xuất.
12. TypeScript model ở section 4 là expectation — có thể thay đổi sau API Contract Review.
13. Luôn viết section Multi-tenant và Permission dù feature có vẻ đơn giản.
14. Validation rules phải liệt kê cả client-side validation (không chờ server).

---

## File Path Rules

| Output | Path |
|--------|------|
| Design document | `docs/features/{feature-name}/01-frontend-basic-design.md` |

**CẤMTẠO:** Không tạo bất kỳ file nào trong `accounting_web/` ở phase này.

---

## Checklist Trước Khi Hoàn Thành

**Part A — Input Analysis:**
- [ ] A1: Input sources đã liệt kê, trạng thái Found/Missing đã ghi
- [ ] A2: Đã phân tích tất cả ảnh trong `images/` — layout, elements, unclear points
- [ ] A3: Đã phân tích tất cả ảnh trong `references/images/` — layout, patterns
- [ ] A4: Đã phân tích tất cả markdown trong `references/markdown/` — rules, flows, glossary
- [ ] A5: Feature Comparison Matrix đã đầy đủ với đúng Status và Decision values
- [ ] A6: Gap Analysis đã có Missing, Extra, Conflict, Unclear sections
- [ ] A7: Confirmed Frontend Scope đã có
- [ ] A8: Updated Frontend API Needs đã suy ra từ toàn bộ sources
- [ ] A9: Decision Log đã có

**Part B — Frontend Design:**
- [ ] Section 1: Overview đã đủ purpose, business context, target users
- [ ] Section 2: Layout đã mô tả đầy đủ toolbar, filter, grid, pagination, dialogs
- [ ] Section 3: Component tree và responsibilities đã rõ ràng
- [ ] Section 4: TypeScript model đã có đủ các type cần thiết
- [ ] Section 5: API needs tổng hợp từ A8
- [ ] Section 6: State management đã cover URL state, UI state, server state, permission state
- [ ] Section 7: User interaction đã mô tả đủ mọi flow
- [ ] Section 8: Validation rules đã liệt kê đủ (với source)
- [ ] Section 9: Permission rules đã map với từng action
- [ ] Section 10: Multi-tenant rules đã có
- [ ] Section 11: Loading/empty/error states đã có
- [ ] Section 13: Acceptance criteria đã có
- [ ] Section 14: Open Questions tổng hợp đầy đủ (với Must Resolve Before Phase 2)
- [ ] Không có code snippet thực tế

---

## Final Report Format

```
## Phase 1 Complete — Frontend Basic Design

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

**Next Step:** Phase 2 — Backend Basic Design
Use skill: .ai/skills/02-backend-basic-design.md
```
