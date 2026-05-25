---
name: 04-backend-api-contract-review
description: Phase 4: Align frontend and backend designs and produce the final API contract.
---

# Skill 04 - Backend API Contract Review

## Role

Principal Fullstack Architect, API Contract Arbitrator, Senior Business Analyst.

## Goal

Compare Frontend Basic Design (Phase 1) and Backend Basic Design (Phase 3) to detect every gap and mismatch, verify alignment across input sources, resolve open questions, and produce the final API contract. This contract is the source of truth for all subsequent phases. Do not write code in this phase.

---

## Input

- `docs/features/{feature-name}/01-frontend-basic-design.md`
- `docs/features/{feature-name}/03-backend-basic-design.md`

**Key items to read from Phase 1:**
- Feature Comparison Matrix (A5)
- Gap Analysis (A6): Missing, Extra, Conflict, Unclear
- Confirmed Frontend Scope (A7)
- Updated Frontend API Needs (A8)
- Open Questions (Section 14)

**Key items to read from Phase 3:**
- Backend Feature Comparison (A3)
- Backend Gap Analysis (A4)
- Confirmed Backend Scope (A5)
- Backend API Draft (A6)
- Backend Open Questions (A4.4)

---

## Output

```text
docs/features/{feature-name}/04-api-contract-review.md
```

---

## Required Output Format

```markdown
# Backend API Contract Review: {Feature Name}

## 1. Review Summary

**Status:** [Approved | Changes Required]

**Review Date:** {date}

**Key Findings:**
- Total endpoints reviewed: {n}
- Gaps found: {n}
- Mismatches found: {n}
- Breaking changes: {n}
- Unresolved questions blocking coding: {n}

---

# PART A - CROSS-SOURCE FEATURE ALIGNMENT REVIEW

## A1. Scope Alignment

> Compare Confirmed Frontend Scope, Confirmed Backend Scope, and reference documentation.

| Feature / Capability | Frontend Scope | Backend Scope | Reference Docs | Alignment Status | Required Action |
|----------------------|----------------|---------------|----------------|------------------|-----------------|

**Alignment Status values:**
- `Aligned` - frontend and backend are both confirmed and documentation agrees
- `Frontend Only` - frontend needs it but backend does not define it
- `Backend Only` - backend proposes it but frontend does not need it
- `Missing Backend Support` - frontend confirmed the feature but backend has no API/entity support
- `Missing Frontend Support` - backend has API support but frontend does not consume it
- `Conflict` - sources contradict each other
- `Need Confirmation` - not enough information

**Required Action values:**
- `Approve` - no change required
- `Update Frontend Design` - update Phase 1
- `Update Backend Design` - update Phase 3
- `Add API` - add an endpoint
- `Remove API` - remove an unnecessary endpoint
- `Need User Confirmation` - ask the user for confirmation
- `Defer` - defer to a later phase

---

## A2. Unresolved Questions Before Contract Approval

> Collect all open questions from Phase 1 and Phase 3.

| # | Question | Source Phase | Context | Impact on Contract | Must Resolve Before Coding? |
|---|----------|--------------|---------|--------------------|-----------------------------|

**Must Resolve Before Coding? values:** `Yes` / `No`

---

## A3. Contract Approval Gate

Evaluate each gate condition:

| Gate Condition | Status | Notes |
|----------------|--------|-------|
| No serious frontend/backend mismatch remains | Pass / Fail | |
| All `Need Confirmation` features are clearly marked | Pass / Fail | |
| Every implemented feature has API/backend support | Pass / Fail | |
| Every API has a permission | Pass / Fail | |
| Every API has clear request/response definitions | Pass / Fail | |
| Error format is consistent | Pass / Fail | |
| Paging/filter/sort behavior is consistent | Pass / Fail | |
| Multi-tenant rules are consistent | Pass / Fail | |
| No open question with `Must Resolve = Yes` remains | Pass / Fail | |

**If any gate condition is `Fail`, Status must be `Changes Required`. Do not mark the contract as Approved.**

---

# PART B - GAP ANALYSIS (Frontend vs Backend)

## 2. Frontend API Needs (from Phase 1 - A8)

| # | UI Action | Required By | Method | Endpoint (expected) | Request Fields | Response Fields |
|---|-----------|-------------|--------|---------------------|----------------|-----------------|

---

## 3. Backend Proposed APIs (from Phase 3 - A6)

| # | Method | Endpoint | Permission | Status | Request Body | Response Body |
|---|--------|----------|------------|--------|--------------|---------------|

---

## 4. Technical Gap Analysis

### 4.1 Missing Endpoints
Frontend-required endpoints that backend has not proposed.

| Frontend Need | Required By | Status | Resolution |
|---------------|-------------|--------|------------|

### 4.2 Method Mismatch
| Frontend Expects | Backend Proposes | Resolution |
|------------------|------------------|------------|

### 4.3 Route Mismatch
| Frontend Expects | Backend Proposes | Resolution |
|------------------|------------------|------------|

### 4.4 Query Params Mismatch
| Param | Frontend | Backend | Resolution |
|-------|----------|---------|------------|

### 4.5 Request Body Mismatch
| Field | Frontend Type | Backend Type | Resolution |
|-------|---------------|--------------|------------|

### 4.6 Response Body Mismatch
| Field | Frontend Expects | Backend Returns | Resolution |
|-------|------------------|-----------------|------------|

### 4.7 Field Name Mismatch
| Frontend Name | Backend Name | Agreed Name | Resolution |
|---------------|--------------|-------------|------------|

### 4.8 Type Mismatch
| Field | Frontend Type | Backend Type | Agreed Type | Notes |
|-------|---------------|--------------|-------------|-------|

### 4.9 Permission Mismatch
| Endpoint | Frontend Expects | Backend Defines | Resolution |
|----------|------------------|-----------------|------------|

### 4.10 Error Format Mismatch
| Scenario | Frontend Expects | Backend Returns | Resolution |
|----------|------------------|-----------------|------------|

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

# PART C - FINAL API CONTRACT

> This is the source of truth. All subsequent phases must follow this contract.

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

```text
/api/{tenantId}/{resource}
```

---

## 6. Endpoint Contracts

One section per endpoint. This is the final contract.

### 6.1 GET /api/{tenantId}/{resource}

**Purpose:** List with pagination, search, filter, and sort.

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
- 401 - Missing or expired token
- 403 - Missing permission
- 400 - Invalid query params

---

### 6.2 GET /api/{tenantId}/{resource}/{id}

**Purpose:** Get detail by id.

**Auth:** Bearer JWT required

**Permission:** `{Feature}.View`

**Response:** `ApiResponse<{Feature}DetailDto>`

**Error Cases:**
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found

---

### 6.3 POST /api/{tenantId}/{resource}

**Purpose:** Create new.

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Create`

**Request Body:** `Create{Feature}Request`

```json
{ }
```

**Response:** `ApiResponse<{Feature}DetailDto>` (201 Created)

**Error Cases:**
- 400 - Validation error
- 401 - Unauthorized
- 403 - Forbidden
- 409 - Conflict (duplicate)

---

### 6.4 PUT /api/{tenantId}/{resource}/{id}

**Purpose:** Update.

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Update`

**Request Body:** `Update{Feature}Request`

**Response:** `ApiResponse<{Feature}DetailDto>`

**Error Cases:**
- 400 - Validation error
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 409 - Conflict

---

### 6.5 DELETE /api/{tenantId}/{resource}/{id}

**Purpose:** Soft delete single item.

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Delete`

**Response:** `ApiResponse<bool>`

**Error Cases:**
- 400 - Cannot delete because dependencies exist
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found

---

### 6.6 POST /api/{tenantId}/{resource}/bulk-delete

**Purpose:** Soft delete multiple items.

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

**Purpose:** Export to Excel.

**Auth:** Bearer JWT required

**Permission:** `{Feature}.Export`

**Query Params:** Same as list endpoint, without pagination.

**Response:** File download (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

---

Add additional endpoints if the feature requires them.

---

## 7. DTO Contract

### 7.1 {Feature}ListItemDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|------------|------------|-----------|-----------|-------|

### 7.2 {Feature}DetailDto

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|------------|------------|-----------|-----------|-------|

### 7.3 Create{Feature}Request / Create{Feature}Input

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Required | Notes |
|------------|------------|-----------|-----------|----------|-------|

### 7.4 Update{Feature}Request / Update{Feature}Input

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Required | Notes |
|------------|------------|-----------|-----------|----------|-------|

### 7.5 {Feature}SummaryDto (if any)

| Field (C#) | Field (TS) | Type (C#) | Type (TS) | Notes |
|------------|------------|-----------|-----------|-------|

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
| Query filter | `WHERE TenantId = @tenantId` for all queries |
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
- [ ] Change {field} from {old} to {new} - Reason: ...

### 12.2 Backend Design Changes (Phase 3 Updates Needed)
- [ ] Add endpoint {endpoint} - Reason: ...

### 12.3 Features Deferred (Not in this Contract)
- [ ] {feature} - Reason: Need Confirmation / Out of scope

---

## 13. Approval Checklist

- [ ] A3 Contract Approval Gate: all conditions pass
- [ ] A2: No `Must Resolve Before Coding = Yes` questions remain
- [ ] All frontend API needs are covered by backend endpoints
- [ ] All field names are agreed: camelCase in JSON, PascalCase in C#
- [ ] All types are aligned: dates as ISO 8601 strings, IDs as string/GUID
- [ ] Pagination contract is defined: pageIndex, pageSize, totalCount, totalPages
- [ ] Sort contract is defined: sortBy, sortDirection with `asc`/`desc`
- [ ] Standard success response format is agreed
- [ ] Standard error response format is agreed
- [ ] Permission constants are agreed
- [ ] Multi-tenant rules are agreed
- [ ] Validation error format is agreed
- [ ] Export endpoint is agreed, if applicable
- [ ] Bulk delete endpoint is agreed, if applicable
- [ ] No breaking ambiguity remains
- [ ] Scope alignment is complete (Part A1)
```

---

## Rules

1. Do not write code in this phase.
2. Be strict with every mismatch. Do not let unresolved mismatches pass into later phases.
3. Read and handle all open questions from Phase 1 and Phase 3.
4. If any question has `Must Resolve Before Coding = Yes`, Status must be `Changes Required`. Do not approve the contract.
5. Complete A1 Scope Alignment before writing the Final API Contract.
6. Gap Analysis (Part B) must check all 14 mismatch categories.
7. The final contract is the source of truth for backend coding (Phase 7) and frontend coding (Phase 8).
8. If frontend expectations conflict with the backend proposal, record a clear decision rationale.
9. Field naming convention: JSON uses camelCase, C# uses PascalCase, TypeScript uses camelCase.
10. Date/time values must be ISO 8601 strings.
11. IDs must be consistent: choose GUID string or int.
12. Features marked `Need Confirmation` must be recorded in Section 12.3 Deferred and must not be included in the Final Contract.

---

## File Path Rules

| Input | Path |
|-------|------|
| Frontend design | `docs/features/{feature-name}/01-frontend-basic-design.md` |
| Backend design | `docs/features/{feature-name}/03-backend-basic-design.md` |

| Output | Path |
|--------|------|
| Contract document | `docs/features/{feature-name}/04-api-contract-review.md` |

**Do not create any code files in this phase.**

---

## Completion Checklist

**Part A - Cross-source Alignment:**
- [ ] A1: Scope Alignment fully compares Frontend Scope, Backend Scope, and Reference Docs.
- [ ] A2: All open questions from Phase 1 and Phase 3 are collected.
- [ ] A3: Contract Approval Gate is completed for every condition.
- [ ] A3: If any condition fails, Status is `Changes Required`.

**Part B - Gap Analysis:**
- [ ] Section 2: All frontend API needs are listed with `Required By`.
- [ ] Section 3: All backend proposed APIs are listed with status.
- [ ] Section 4: All 14 mismatch categories are checked.

**Part C - Final Contract:**
- [ ] Section 5: Standard response formats are defined.
- [ ] Section 6: Endpoint contracts are complete, with one section per endpoint.
- [ ] Section 7: DTO contract compares C# and TypeScript.
- [ ] Section 8: Permission contract is complete.
- [ ] Section 9: Multi-tenant contract is complete.
- [ ] Section 10: Validation contract is complete.
- [ ] Section 11: Contract decisions include rationale.
- [ ] Section 12.3: Deferred features are clearly recorded.
- [ ] Section 13: Approval checklist is completed.

---

## Final Report Format

```markdown
## Phase 4 Complete - API Contract Review

**Feature:** {feature-name}
**Status:** [Approved | Changes Required]
**Document:** docs/features/{feature-name}/04-api-contract-review.md

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

**If Status = Changes Required:**
Cannot proceed to Phase 5/6 until the following are resolved:
1. ...

**If Status = Approved:**
This contract is now the source of truth for Phase 5-13.

**Next Step:** Phase 5 + Phase 6 - Implementation Plans
- Frontend: .claude/skills/05-frontend-implementation-plan.md
- Backend: .claude/skills/06-backend-implementation-plan.md
```

