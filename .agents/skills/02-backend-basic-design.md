# Skill 02 — Backend Basic Design

## Role

Senior .NET Backend Architect, Domain-Driven Design Expert, Senior Business Analyst.

## Goal

Tạo tài liệu thiết kế cơ bản backend dựa trên Frontend Basic Design (Phase 1) và toàn bộ input sources (UI hiện tại, UI tham khảo, tài liệu nghiệp vụ). Định nghĩa domain model, database schema, API draft, DTO design, validation rules, permission và multi-tenant strategy. Không code ở phase này.

---

## Input

| Source | Path | Used For |
|--------|------|---------|
| Frontend Basic Design | `docs/features/{feature-name}/01-frontend-basic-design.md` | UI scope, API needs, gaps, confirmed scope, open questions |
| Current UI images | `docs/features/{feature-name}/images/` | UI actions, fields, business flow |
| Reference UI images | `docs/features/{feature-name}/references/images/` | Reference features, patterns |
| Reference markdown docs | `docs/features/{feature-name}/references/markdown/` | Business rules, validation, workflows |

**Ưu tiên đọc:** Frontend Basic Design trước — đặc biệt phần Confirmed Frontend Scope, Gap Analysis, Updated Frontend API Needs và Open Questions.

---

## Output

```
docs/features/{feature-name}/02-backend-basic-design.md
```

---

## Required Output Format

```markdown
# Backend Basic Design: {Feature Name}

---

# PART A — BACKEND INPUT ANALYSIS

## A1. Source Review

| Source | Path | Used For | Status |
|--------|------|---------|--------|
| Frontend Basic Design | docs/features/{feature-name}/01-frontend-basic-design.md | UI scope, API needs, gaps | Found / Missing |
| Current UI images | docs/features/{feature-name}/images/ | UI actions and fields | Found / Missing |
| Reference UI images | docs/features/{feature-name}/references/images/ | Reference features | Found / Missing |
| Reference markdown docs | docs/features/{feature-name}/references/markdown/ | Business rules | Found / Missing |

**Key items from Phase 1 to address:**
- Confirmed Frontend Scope: {summary}
- Open Questions (Must Resolve Before Coding): {list}
- Missing Features identified: {list}
- Conflicts identified: {list}

---

## A2. Business Capability Extraction

> Trích xuất từ UI hiện tại, UI tham khảo và markdown

| Capability | Source | Description | Backend Required? | Notes |
|------------|--------|-------------|------------------|-------|

**Backend Required? values:** `Yes` / `No` / `Need Confirmation` / `Later`

---

## A3. Backend Feature Comparison

> So sánh nhu cầu backend từ các nguồn

| Capability | Current UI | Reference UI | Reference Markdown | Backend Impact | Decision |
|------------|-----------|-------------|-------------------|---------------|----------|

**Backend Impact values:**
- `API Required`
- `Database Required`
- `Validation Required`
- `Permission Required`
- `Background Job Required`
- `Export Required`
- `No Backend Impact`
- `Need Confirmation`

**Decision values:** `Implement` / `Do Not Implement` / `Need Confirmation` / `Defer`

---

## A4. Backend Gap Analysis

### A4.1 Missing Backend Capabilities

> Capabilities cần thiết nhưng chưa có trong draft ban đầu

| Capability | Required By | Missing From Draft | Impact | Recommendation |
|------------|------------|-------------------|--------|---------------|

### A4.2 Extra Backend Capabilities

> Capabilities trong draft nhưng không có nhu cầu thực tế

| Capability | Proposed In Backend | Not Required By | Risk | Recommendation |
|------------|---------------------|----------------|------|---------------|

### A4.3 Conflicting Backend Requirements

> Điểm mâu thuẫn giữa các nguồn

| Topic | Current UI | Reference UI | Reference Markdown | Backend Conflict | Proposed Resolution |
|-------|-----------|-------------|-------------------|-----------------|---------------------|

### A4.4 Backend Open Questions

| # | Question | Context | Impact If Not Clarified | Recommended Default | Must Resolve Before Coding? |
|---|----------|---------|------------------------|---------------------|------------------------------|

---

## A5. Confirmed Backend Scope

> Phạm vi backend được xác nhận sau phân tích

| Capability | Include? | Backend Work Required | Reason | Source |
|------------|----------|----------------------|--------|--------|

**Include? values:** `Yes` / `No` / `Need Confirmation` / `Later`

**Backend Work Required (chọn nhiều):**
`Entity` / `Table` / `API` / `DTO` / `Validation` / `Permission` / `Query` / `Export` / `Integration` / `Background Job`

---

## A6. Backend API Draft Based on Confirmed Scope

> Chỉ thiết kế API cho capabilities đã Confirmed = Yes
> Capabilities = Need Confirmation được ghi nhưng đánh dấu [Pending Confirmation]

| Capability | Method | Endpoint | Request | Response | Permission | Status | Source |
|------------|--------|----------|---------|----------|-----------|--------|--------|

**Status values:** `Confirmed` / `Pending Confirmation` / `Deferred`

---

## A7. Backend Decision Log

| # | Decision | Reason | Source | Impact |
|---|----------|--------|--------|--------|

**Source values:** `Frontend Basic Design` / `Current UI` / `Reference UI` / `Reference Markdown` / `Assumption` / `User Confirmation Needed`

---

# PART B — BACKEND DESIGN

## 1. Overview
### 1.1 Purpose
### 1.2 Business Context
### 1.3 Related Frontend Screens
### 1.4 Related Backend Modules

---

## 2. Scope
### 2.1 In Scope
(Dựa trên Confirmed Backend Scope — A5)

### 2.2 Out of Scope
(Capabilities đã quyết định Do Not Implement hoặc Defer)

### 2.3 Pending Confirmation
(Capabilities đang Need Confirmation — không code cho đến khi có xác nhận)

---

## 3. Domain Design
### 3.1 Main Entity / Aggregate Root
(Tên entity, namespace, layer: Domain)

### 3.2 Entity Fields
| Field | Type | Nullable | Description | Source |
|-------|------|----------|-------------|--------|

### 3.3 Enums
(Liệt kê enum và giá trị, kèm source)

### 3.4 Value Objects (nếu có)

### 3.5 Relationships
(1-1, 1-N, N-N với entity khác)

---

## 4. Database Design
### 4.1 Tables
| Table | Description |
|-------|-------------|

### 4.2 Table Definition
(Định nghĩa đầy đủ cột, kiểu dữ liệu, constraints)

### 4.3 Indexes
| Index | Columns | Type | Purpose |
|-------|---------|------|---------|

### 4.4 Constraints
(PK, FK, Unique, Check constraints)

### 4.5 Soft Delete Strategy
(Dùng IsDeleted flag hay DeletedAt timestamp)

### 4.6 Audit Fields
(CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, TenantId)

---

## 5. API Design Draft
> Dựa trên A6 — chỉ include Confirmed APIs
> [Pending Confirmation] APIs được liệt kê nhưng chưa được implement

| Method | Endpoint | Purpose | Permission | Status | Source |
|--------|----------|---------|-----------|--------|--------|

### 5.x Endpoint Details (Confirmed only)

#### {METHOD} /api/{tenant}/{resource}
- **Purpose:**
- **Auth:** Bearer JWT
- **Permission:**
- **Query Params:**
- **Request Body:**
- **Response:**
- **Error Cases:**
- **Status:** Confirmed

(Lặp lại cho mỗi endpoint)

---

## 6. DTO Design
### 6.1 {Feature}ListQuery
### 6.2 {Feature}ListItemDto
### 6.3 {Feature}DetailDto
### 6.4 Create{Feature}Request
### 6.5 Update{Feature}Request
### 6.6 {Feature}SummaryDto (nếu có)
### 6.7 Bulk{Action}{Feature}Request (nếu có)

(Liệt kê fields của mỗi DTO, kèm source)

---

## 7. Validation Rules (FluentValidation)
| Field | Rule | Error Message | Source |
|-------|------|---------------|--------|

### 7.1 Create Validation
### 7.2 Update Validation
### 7.3 Bulk Action Validation

---

## 8. Business Rules
> Bao gồm rules từ markdown, UI hiện tại và UI tham khảo

| # | Rule | Source | Impact |
|---|------|--------|--------|

---

## 9. Multi-tenant Rules
### 9.1 TenantId Source
(Lấy từ JWT claim, route, hay header)

### 9.2 Tenant Resolution
(Middleware hay service nào resolve tenantId)

### 9.3 Query Filtering
(Mọi query phải WHERE TenantId = @tenantId)

### 9.4 Command Ownership Check
(Trước khi update/delete phải check entity.TenantId == currentTenantId)

### 9.5 Data Leakage Prevention
(Không expose data cross-tenant trong bất kỳ endpoint nào)

---

## 10. Authentication & Authorization
### 10.1 JWT Claims Required
- TenantId
- UserId
- Permissions (list)

### 10.2 Permission Constants
| Permission | Description | Required By |
|------------|-------------|------------|
| {Feature}.View | ... | |
| {Feature}.Create | ... | |
| {Feature}.Update | ... | |
| {Feature}.Delete | ... | |
| {Feature}.Export | ... | |

### 10.3 Permission Mapping
| Endpoint | Required Permission |
|----------|---------------------|

### 10.4 401 Behavior
(Missing hoặc expired token → 401 Unauthorized)

### 10.5 403 Behavior
(Valid token nhưng thiếu permission → 403 Forbidden)

---

## 11. Error Handling
### 11.1 Standard Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    { "field": "fieldName", "message": "Error message" }
  ],
  "traceId": "..."
}
```

### 11.2 Standard Success Response

```json
{
  "success": true,
  "data": { },
  "message": null,
  "errors": [],
  "traceId": "..."
}
```

### 11.3 Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 100,
    "pageIndex": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "message": null,
  "errors": []
}
```

### 11.4 HTTP Status Codes
| Status | When |
|--------|------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## 12. Logging
(Log levels và what to log per operation)

---

## 13. Performance Considerations
- Indexes đề xuất
- Query optimization notes
- Caching strategy nếu có

---

## 14. Security Considerations
- Input sanitization
- SQL injection prevention (EF Core parameterized queries)
- Mass assignment prevention (dùng DTO, không bind trực tiếp entity)
- Sensitive field handling

---

## 15. Acceptance Criteria
- [ ] ...

---

## 16. Open Questions
(Tổng hợp từ A4.4 — các câu hỏi backend cần xác nhận)

| # | Question | Context | Impact | Must Resolve Before Phase 3? |
|---|----------|---------|--------|-------------------------------|
```

---

## Rules

1. **Không code ở phase này.**
2. **Không tạo file trong `accounting_api/` ở phase này.**
3. Chỉ tạo file tài liệu tại `docs/features/{feature-name}/02-backend-basic-design.md`.
4. **Phải đọc và sử dụng output của Phase 1** — đặc biệt Confirmed Frontend Scope, Gap Analysis, Open Questions.
5. **Phải xét cả tính năng Missing, Extra, Conflict, Unclear từ Phase 1.**
6. **Không được thiết kế API cho feature đã quyết định Do Not Implement.**
7. Feature `Need Confirmation` có thể mô tả API draft nhưng phải đánh dấu `[Pending Confirmation]`.
8. **Không được tự ý tạo database field chỉ vì reference UI có field** — phải kiểm tra markdown hoặc business need.
9. Nếu markdown có business rule không thấy trên UI → vẫn phải đưa vào Business Rules với source = Reference Markdown.
10. Nếu UI có button/action nhưng markdown không giải thích → phải đưa vào Open Questions.
11. Không expose EF entity trực tiếp — luôn thiết kế DTO riêng.
12. Luôn có permission design và multi-tenant design.
13. Soft delete bắt buộc phải thiết kế — không hard delete entity quan trọng.
14. Audit fields (CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) bắt buộc phải có.

---

## File Path Rules

| Input | Path |
|-------|------|
| Frontend Basic Design | `docs/features/{feature-name}/01-frontend-basic-design.md` |
| Current UI images | `docs/features/{feature-name}/images/` |
| Reference UI images | `docs/features/{feature-name}/references/images/` |
| Reference markdown | `docs/features/{feature-name}/references/markdown/` |

| Output | Path |
|--------|------|
| Design document | `docs/features/{feature-name}/02-backend-basic-design.md` |

**CẤMTẠO:** Không tạo bất kỳ file nào trong `accounting_api/` ở phase này.

---

## Checklist Trước Khi Hoàn Thành

**Part A — Backend Input Analysis:**
- [ ] A1: Source review đã liệt kê, key items từ Phase 1 đã ghi nhận
- [ ] A2: Business Capability Extraction đã đủ từ tất cả sources
- [ ] A3: Backend Feature Comparison đã có Backend Impact và Decision
- [ ] A4: Backend Gap Analysis đã có Missing, Extra, Conflict, Open Questions
- [ ] A5: Confirmed Backend Scope đã có
- [ ] A6: Backend API Draft chỉ có Confirmed APIs (Pending Confirmation được đánh dấu rõ)
- [ ] A7: Backend Decision Log đã có

**Part B — Backend Design:**
- [ ] Section 2: Scope đã có In Scope, Out of Scope, Pending Confirmation
- [ ] Section 3: Entity fields đã đủ (audit fields, TenantId, soft delete) — kèm source
- [ ] Section 4: Database design đã có tables, indexes, constraints
- [ ] Section 5: API draft chỉ có Confirmed endpoints
- [ ] Section 6: DTOs đã phân biệt rõ List/Detail/Create/Update
- [ ] Section 7: Validation rules đã đủ, FluentValidation style, kèm source
- [ ] Section 8: Business rules đã liệt kê đủ từ tất cả sources
- [ ] Section 9: Multi-tenant rules đã có đủ 5 mục
- [ ] Section 10: Permission constants đã có đủ cho mọi confirmed action
- [ ] Section 11: Error response format đã chuẩn
- [ ] Section 15: Acceptance criteria đã có
- [ ] Section 16: Open Questions tổng hợp với Must Resolve Before Phase 3

---

## Final Report Format

```
## Phase 2 Complete — Backend Basic Design

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/02-backend-basic-design.md

**Input Analysis Summary:**
- Capabilities extracted: {n}
- Capabilities confirmed: {n}
- Capabilities pending confirmation: {n}
- Capabilities deferred: {n}
- Backend conflicts found: {n}

**Backend Design Summary:**
- Entity fields defined: {n}
- API endpoints confirmed: {n}
- API endpoints pending: {n}
- DTOs designed: {n}
- Permissions defined: {n}
- Business rules documented: {n}

**Key Design Decisions:**
1. ...

**Open Questions (Must Resolve Before Phase 3):**
1. ...

**Gaps vs Frontend API Needs (Phase 1):**
1. ...

**Next Step:** Phase 3 — Backend API Contract Review
Use skill: .ai/skills/03-backend-api-contract-review.md
```
