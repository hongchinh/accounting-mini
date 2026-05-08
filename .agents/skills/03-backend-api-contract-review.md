# Skill 03 — Backend API Contract Review

## Role

Principal Fullstack Architect, API Contract Arbitrator, Senior Business Analyst.

## Goal

So sánh Frontend Basic Design (Phase 1) và Backend Basic Design (Phase 2) để phát hiện mọi gap/mismatch, kiểm tra alignment giữa các nguồn input, giải quyết open questions, và tạo ra API Contract cuối cùng. Contract này là **source of truth** cho toàn bộ team trong các phase sau. Không code ở phase này.

---

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/02-backend-basic-design.md`

**Key items cần đọc từ Phase 1:**
- Feature Comparison Matrix (A5)
- Gap Analysis (A6) — Missing, Extra, Conflict, Unclear
- Confirmed Frontend Scope (A7)
- Updated Frontend API Needs (A8)
- Open Questions (Section 14)

**Key items cần đọc từ Phase 2:**
- Backend Feature Comparison (A3)
- Backend Gap Analysis (A4)
- Confirmed Backend Scope (A5)
- Backend API Draft (A6)
- Backend Open Questions (A4.4)

---

## Output

```
docs/features/{feature-name}/03-api-contract-review.md
```

---

## Required Output Format

```markdown
# Backend API Contract Review: {Feature Name}

## 1. Review Summary

**Status:** [Approved | Approved with Changes | Changes Required]

**Review Date:** {date}

**Key Findings:**
- Total endpoints reviewed: {n}
- Gaps found: {n}
- Mismatches found: {n}
- Breaking changes: {n}
- Unresolved questions blocking coding: {n}

---

# PART A — CROSS-SOURCE FEATURE ALIGNMENT REVIEW

## A1. Scope Alignment

> So sánh Confirmed Frontend Scope vs Confirmed Backend Scope vs Reference Docs

| Feature / Capability | Frontend Scope | Backend Scope | Reference Docs | Alignment Status | Required Action |
|----------------------|---------------|--------------|---------------|-----------------|----------------|

**Alignment Status values:**
- `Aligned` — frontend và backend đều confirmed, docs đồng thuận
- `Frontend Only` — frontend muốn nhưng backend không có
- `Backend Only` — backend propose nhưng frontend không cần
- `Missing Backend Support` — feature confirmed ở frontend nhưng backend chưa có API/entity
- `Missing Frontend Support` — backend có API nhưng frontend chưa consume
- `Conflict` — các nguồn mâu thuẫn
- `Need Confirmation` — chưa đủ thông tin

**Required Action values:**
- `Approve` — không cần thay đổi
- `Update Frontend Design` — cần cập nhật Phase 1
- `Update Backend Design` — cần cập nhật Phase 2
- `Add API` — cần thêm endpoint
- `Remove API` — cần xóa endpoint không cần thiết
- `Need User Confirmation` — cần hỏi người dùng
- `Defer` — chuyển sang phase sau

---

## A2. Unresolved Questions Before Contract Approval

> Tổng hợp tất cả Open Questions từ Phase 1 và Phase 2

| # | Question | Source Phase | Context | Impact on Contract | Must Resolve Before Coding? |
|---|----------|-------------|---------|-------------------|------------------------------|

**Must Resolve Before Coding? values:** `Yes` / `No`

---

## A3. Contract Approval Gate

Trả lời từng điều kiện:

| Gate Condition | Status | Notes |
|---------------|--------|-------|
| Không còn mismatch nghiêm trọng giữa frontend và backend | ✅ / ❌ | |
| Các tính năng `Need Confirmation` đã được đánh dấu rõ | ✅ / ❌ | |
| Các feature được implement đều có API/backend support | ✅ / ❌ | |
| Mọi API đều có permission | ✅ / ❌ | |
| Mọi API đều rõ request/response | ✅ / ❌ | |
| Error format thống nhất | ✅ / ❌ | |
| Paging/filter/sort thống nhất | ✅ / ❌ | |
| Multi-tenant rule thống nhất | ✅ / ❌ | |
| Không còn Open Question `Must Resolve = Yes` | ✅ / ❌ | |

**→ Nếu có bất kỳ ❌ nào: Status = `Changes Required`. Không được Approved.**

---

# PART B — GAP ANALYSIS (Frontend vs Backend)

## 2. Frontend API Needs (from Phase 1 — A8)

| # | UI Action | Required By | Method | Endpoint (expected) | Request Fields | Response Fields |
|---|-----------|------------|--------|---------------------|----------------|-----------------|

---

## 3. Backend Proposed APIs (from Phase 2 — A6)

| # | Method | Endpoint | Permission | Status | Request Body | Response Body |
|---|--------|----------|-----------|--------|-------------|--------------|

---

## 4. Technical Gap Analysis

### 4.1 Missing Endpoints
(Endpoint frontend cần nhưng backend chưa propose)

| Frontend Need | Required By | Status | Resolution |
|---------------|------------|--------|------------|

### 4.2 Method Mismatch
| Frontend Expects | Backend Proposes | Resolution |
|-----------------|-----------------|------------|

### 4.3 Route Mismatch
| Frontend Expects | Backend Proposes | Resolution |
|-----------------|-----------------|------------|

### 4.4 Query Params Mismatch
| Param | Frontend | Backend | Resolution |
|-------|----------|---------|------------|

### 4.5 Request Body Mismatch
| Field | Frontend Type | Backend Type | Resolution |
|-------|--------------|-------------|------------|

### 4.6 Response Body Mismatch
| Field | Frontend Expects | Backend Returns | Resolution |
|-------|-----------------|-----------------|------------|

### 4.7 Field Name Mismatch
| Frontend Name | Backend Name | Agreed Name | Resolution |
|--------------|-------------|-------------|------------|

### 4.8 Type Mismatch
| Field | Frontend Type | Backend Type | Agreed Type | Notes |
|-------|--------------|-------------|------------|-------|

### 4.9 Permission Mismatch
| Endpoint | Frontend Expects | Backend Defines | Resolution |
|----------|-----------------|----------------|------------|

### 4.10 Error Format Mismatch
| Scenario | Frontend Expects | Backend Returns | Resolution |
|----------|-----------------|----------------|------------|

### 4.11 Pagination Mismatch
| Property | Frontend | Backend | Agreed |
|----------|----------|---------|--------|
| Page param name | | | |
| Page size param name | | | |
| Response wrapper | | | |
| Total count field | | | |
| Total pages field | | | |

### 4.12 Sorting Mismatch
| Property | Frontend | Backend | Agreed |
|----------|----------|---------|--------|
| Sort param name | | | |
| Direction param name | | | |
| Direction values | | | |

### 4.13 Filtering Mismatch
| Filter | Frontend | Backend | Resolution |
|--------|----------|---------|------------|

### 4.14 Multi-tenant Mismatch
| Aspect | Frontend | Backend | Resolution |
|--------|----------|---------|------------|

---

# PART C — FINAL API CONTRACT

> **This is the source of truth. All subsequent phases MUST follow this contract.**

## 5. Final API Contract

### 5.1 Standard Success Response

```json
{
  "success": true,
  "data": { },
  "message": null,
  "errors": [],
  "traceId": "uuid"
}
```

### 5.2 Standard Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": [
    { "field": "fieldName", "message": "Validation message" }
  ],
  "traceId": "uuid"
}
```

### 5.3 Pagination Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 0,
    "pageIndex": 1,
    "pageSize": 20,
    "totalPages": 0
  },
  "message": null,
  "errors": []
}
```

### 5.4 Base URL Pattern

```
/api/{tenantId}/{resource}
```

---

## 6. Endpoint Contracts

(Một section per endpoint — đây là contract cuối cùng)

### 6.1 GET /api/{tenantId}/{resource}

**Purpose:** List with pagination, search, filter, sort

**Auth:** Bearer JWT required

**Permission:** `{Feature}.View`

**Query Params:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| keyword | string | No | null | Search keyword |
| pageIndex | int | No | 1 | 1-based page number |
| pageSize | int | No | 20 | Items per page |
| sortBy | string | No | "createdAt" | Field to sort |
| sortDirection | string | No | "desc" | "asc" or "desc" |
| status | string | No | null | Filter by status |

**Response:** `ApiResponse<PaginatedResult<{Feature}ListItemDto>>`

**Error Cases:**
- 401 — Missing/expired token
- 403 — Missing permission
- 400 — Invalid query params

---

### 6.2 GET /api/{tenantId}/{resource}/{id}

**Purpose:** Get detail by id

**Auth:** Bearer JWT required

**Permission:** `{Feature}.View`

**Response:** `ApiResponse<{Feature}DetailDto>`

**Error Cases:**
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not found

---

### 6.3 POST /api/{tenantId}/{resource}

**Purpose:** Create new

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Create`

**Request Body:** `Create{Feature}Request`

```json
{ }
```

**Response:** `ApiResponse<{Feature}DetailDto>` (201 Created)

**Error Cases:**
- 400 — Validation error
- 401 — Unauthorized
- 403 — Forbidden
- 409 — Conflict (duplicate)

---

### 6.4 PUT /api/{tenantId}/{resource}/{id}

**Purpose:** Update

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Update`

**Request Body:** `Update{Feature}Request`

**Response:** `ApiResponse<{Feature}DetailDto>`

**Error Cases:**
- 400 — Validation error
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not found
- 409 — Conflict

---

### 6.5 DELETE /api/{tenantId}/{resource}/{id}

**Purpose:** Soft delete single

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Delete`

**Response:** `ApiResponse<bool>`

**Error Cases:**
- 400 — Cannot delete (has dependencies)
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not found

---

### 6.6 POST /api/{tenantId}/{resource}/bulk-delete

**Purpose:** Soft delete multiple

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Delete`

**Request Body:**

```json
{
  "ids": ["uuid1", "uuid2"]
}
```

**Response:** `ApiResponse<BulkDeleteResult>`

---

### 6.7 GET /api/{tenantId}/{resource}/export

**Purpose:** Export to Excel

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Export`

**Query Params:** Same as list endpoint (no pagination)

**Response:** File download (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

---

(Thêm endpoint khác nếu feature có)

---

## 7. DTO Contract

### 7.1 {Feature}ListItemDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|-----------|-----------|----------|----------|-------|

### 7.2 {Feature}DetailDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|-----------|-----------|----------|----------|-------|

### 7.3 Create{Feature}Request / Create{Feature}Input

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Required | Notes |
|-----------|-----------|----------|----------|----------|-------|

### 7.4 Update{Feature}Request / Update{Feature}Input

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Required | Notes |
|-----------|-----------|----------|----------|----------|-------|

### 7.5 {Feature}SummaryDto (nếu có)

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|-----------|-----------|----------|----------|-------|

---

## 8. Permission Contract

| Permission Constant | Value String | Applies To |
|---------------------|--------------|------------|
| {Feature}.View | "{feature}.view" | GET list, GET detail |
| {Feature}.Create | "{feature}.create" | POST create |
| {Feature}.Update | "{feature}.update" | PUT update |
| {Feature}.Delete | "{feature}.delete" | DELETE, bulk delete |
| {Feature}.Export | "{feature}.export" | GET export |

---

## 9. Multi-tenant Contract

| Rule | Implementation |
|------|----------------|
| TenantId source | JWT claim `tenantId` |
| Route pattern | `/api/{tenantId}/...` |
| Query filter | `WHERE TenantId = @tenantId` (all queries) |
| Create | Set `TenantId` from JWT claim |
| Update/Delete | Verify `entity.TenantId == jwtTenantId` |
| React Query key | Must include `tenantId` |
| Reload on tenant switch | Required |

---

## 10. Validation Contract

| Field | Rule | HTTP Status | Error Field | Error Message |
|-------|------|-------------|-------------|---------------|

---

## 11. Contract Decisions

| # | Decision | Rationale | Impact |
|---|----------|-----------|--------|
| 1 | ... | ... | ... |

---

## 12. Required Changes

### 12.1 Frontend Design Changes (Phase 1 Updates Needed)
- [ ] Change {field} from {old} to {new} — Reason: ...

### 12.2 Backend Design Changes (Phase 2 Updates Needed)
- [ ] Add endpoint {endpoint} — Reason: ...

### 12.3 Features Deferred (Not in this Contract)
- [ ] {feature} — Reason: Need Confirmation / Out of scope

---

## 13. Approval Checklist

- [ ] A3 Contract Approval Gate: all conditions ✅
- [ ] A2: No "Must Resolve Before Coding = Yes" questions remaining
- [ ] All frontend API needs are covered by backend endpoints
- [ ] All field names agreed (camelCase in JSON, PascalCase in C#)
- [ ] All types aligned (dates as ISO8601 string, IDs as string/GUID)
- [ ] Pagination contract defined (pageIndex, pageSize, totalCount, totalPages)
- [ ] Sort contract defined (sortBy, sortDirection with "asc"/"desc")
- [ ] Standard success response format agreed
- [ ] Standard error response format agreed
- [ ] Permission constants agreed
- [ ] Multi-tenant rules agreed
- [ ] Validation error format agreed
- [ ] Export endpoint agreed (if applicable)
- [ ] Bulk delete endpoint agreed (if applicable)
- [ ] No breaking ambiguity remains
- [ ] Scope alignment complete (Part A1)
```

---

## Rules

1. **Không code ở phase này.**
2. **Phải cực kỳ nghiêm ngặt với mọi mismatch — không để mismatch qua phase sau.**
3. **Phải đọc và xử lý toàn bộ Open Questions từ Phase 1 và Phase 2.**
4. **Nếu có câu hỏi `Must Resolve Before Coding = Yes` → Status phải là `Changes Required`.** Không được Approved.
5. **Phải hoàn thành A1 Scope Alignment trước khi viết Final Contract.**
6. Gap Analysis (Part B) phải kiểm tra đủ 14 loại mismatch.
7. Contract cuối cùng là chuẩn cho backend coding (Phase 6) và frontend coding (Phase 7).
8. Nếu có conflict giữa frontend expectation và backend proposal, phải ghi rõ decision rationale.
9. Field naming convention: JSON dùng camelCase, C# dùng PascalCase, TypeScript dùng camelCase.
10. Date/time phải là ISO8601 string.
11. ID phải nhất quán: GUID string hay int (chọn một).
12. Feature `Need Confirmation` phải ghi vào Section 12.3 Deferred — không đưa vào Final Contract.

---

## File Path Rules

| Input | Path |
|-------|------|
| Frontend design | `docs/features/{feature-name}/01-frontend-basic-design.md` |
| Backend design | `docs/features/{feature-name}/02-backend-basic-design.md` |

| Output | Path |
|--------|------|
| Contract document | `docs/features/{feature-name}/03-api-contract-review.md` |

**CẤMTẠO:** Không tạo bất kỳ file code nào ở phase này.

---

## Checklist Trước Khi Hoàn Thành

**Part A — Cross-source Alignment:**
- [ ] A1: Scope Alignment đã so sánh đủ Frontend Scope vs Backend Scope vs Reference Docs
- [ ] A2: Tất cả Open Questions từ Phase 1 và Phase 2 đã tổng hợp
- [ ] A3: Contract Approval Gate đã điền đủ ✅/❌ cho mọi điều kiện
- [ ] A3: Nếu có ❌ thì Status = `Changes Required`

**Part B — Gap Analysis:**
- [ ] Section 2: Tất cả frontend API needs đã liệt kê (kèm Required By)
- [ ] Section 3: Tất cả backend proposed APIs đã liệt kê (kèm Status)
- [ ] Section 4: Đã check đủ 14 loại mismatch

**Part C — Final Contract:**
- [ ] Section 5: Standard response formats đã định nghĩa
- [ ] Section 6: Đủ endpoint contracts (mỗi endpoint một section)
- [ ] Section 7: DTO contract đã so sánh C# và TypeScript
- [ ] Section 8: Permission contract đã đầy đủ
- [ ] Section 9: Multi-tenant contract đã đầy đủ
- [ ] Section 10: Validation contract đã đầy đủ
- [ ] Section 11: Contract decisions đã ghi rationale
- [ ] Section 12.3: Deferred features đã ghi rõ
- [ ] Section 13: Approval checklist đã điền

---

## Final Report Format

```
## Phase 3 Complete — API Contract Review

**Feature:** {feature-name}
**Status:** [Approved | Approved with Changes | Changes Required]
**Document:** docs/features/{feature-name}/03-api-contract-review.md

**Cross-source Alignment Summary:**
- Features Aligned: {n}
- Features Frontend Only: {n}
- Features Backend Only: {n}
- Features Missing Backend Support: {n}
- Conflicts: {n}
- Need Confirmation: {n}

**Gap Analysis Summary:**
- Endpoints missing: {n}
- Field name mismatches: {n}
- Type mismatches: {n}
- Permission mismatches: {n}
- Other mismatches: {n}

**Unresolved Questions:**
- Must Resolve Before Coding: {n}
- Can Proceed: {n}

**Contract Decisions:**
1. ...

**Required Changes:**
- Frontend: {n} changes
- Backend: {n} changes
- Deferred features: {n}

**[If Status = Changes Required]:**
Cannot proceed to Phase 4/5 until the following are resolved:
1. ...

**[If Status = Approved or Approved with Changes]:**
This contract is now source of truth for Phase 4-10.

**Next Step:** Phase 4 + Phase 5 — Implementation Plans
- Frontend: .ai/skills/04-frontend-implementation-plan.md
- Backend: .ai/skills/05-backend-implementation-plan.md
```
