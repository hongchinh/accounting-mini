# Skill 10 — Integration Testing

## Role

Principal Fullstack Architect, Integration Test Lead.

## Goal

Kiểm tra frontend và backend hoạt động đúng theo API Contract bằng cách chạy end-to-end scenarios với real API calls. Phát hiện mọi discrepancy giữa frontend và backend trước khi ship.

---

## Input

- `docs/features/{feature-name}/03-api-contract-review.md` ← Source of Truth
- `docs/features/{feature-name}/08-backend-test-plan.md`
- `docs/features/{feature-name}/09-frontend-test-plan.md`
- Backend đã chạy được
- Frontend đã chạy được

---

## Output

**Test Plan Document:**
```
docs/features/{feature-name}/10-integration-test-plan.md
```

---

## Required Output Format

```markdown
# Integration Test Plan: {Feature Name}

## 1. Integration Scope

Kiểm tra sự tương thích giữa frontend và backend theo API Contract (Phase 3):

- Real HTTP request/response compatibility
- Authentication flow
- Authorization enforcement
- Tenant isolation
- API response wrapper format
- Validation error format và field mapping
- Pagination/search/filter/sorting behavior
- Frontend UI reaction to backend data
- Frontend UI reaction to backend errors

## 2. Environment Setup

### 2.1 Backend
| Setting | Value |
|---------|-------|
| URL | http://localhost:{port} |
| Database | {DB name / connection} |
| Auth endpoint | POST /api/auth/login |
| Swagger | http://localhost:{port}/swagger |

### 2.2 Frontend
| Setting | Value |
|---------|-------|
| URL | http://localhost:5173 |
| Start command | cd accounting_web && npm run dev |

### 2.3 Test Users

| User | Email | Password | Role / Permissions |
|------|-------|----------|-------------------|
| Admin | admin@test.com | ... | All permissions |
| Viewer | viewer@test.com | ... | {feature}.view only |
| Creator | creator@test.com | ... | {feature}.view, {feature}.create |
| No Perm | noperm@test.com | ... | No {feature} permissions |
| Tenant A Admin | tenantA@test.com | ... | All — Tenant A |
| Tenant B Admin | tenantB@test.com | ... | All — Tenant B |

### 2.4 Required Permissions
| Permission | Required For |
|------------|-------------|
| {feature}.view | GET list, GET detail |
| {feature}.create | POST create |
| {feature}.update | PUT update |
| {feature}.delete | DELETE, bulk delete |
| {feature}.export | GET export |

### 2.5 Seed Data Requirements
| Data | Tenant | Quantity | Purpose |
|------|--------|----------|---------|
| {Feature} records | Tenant A | 25 | Pagination test |
| {Feature} records | Tenant B | 10 | Tenant isolation test |
| Deleted records | Tenant A | 5 | Soft delete test |

## 3. Test Data Setup

### 3.1 Setup Script

```sql
-- Seed test data for Tenant A
INSERT INTO {Entities} (Id, TenantId, Code, Name, Status, IsDeleted, CreatedAt, CreatedBy)
VALUES
  (NEWID(), 'tenant-a-guid', 'S001', 'Nhà cung cấp 001', 1, 0, GETUTCDATE(), 'system'),
  -- ... 25 records total
  ;

-- Seed test data for Tenant B  
INSERT INTO {Entities} (Id, TenantId, Code, Name, Status, IsDeleted, CreatedAt, CreatedBy)
VALUES
  -- ... 10 records
  ;
```

### 3.2 Cleanup Script

```sql
DELETE FROM {Entities} WHERE Code LIKE 'S%' AND CreatedBy = 'system';
```

## 4. API Contract Verification

> Source of Truth: docs/features/{feature-name}/03-api-contract-review.md

### 4.1 Route Verification
| Expected Route | Actual Route | Status |
|---------------|-------------|--------|
| GET /api/{t}/{r} | | ☐ |
| GET /api/{t}/{r}/{id} | | ☐ |
| POST /api/{t}/{r} | | ☐ |
| PUT /api/{t}/{r}/{id} | | ☐ |
| DELETE /api/{t}/{r}/{id} | | ☐ |
| POST /api/{t}/{r}/bulk-delete | | ☐ |
| GET /api/{t}/{r}/export | | ☐ |

### 4.2 Response Format Verification
| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Success wrapper has `success: true` | ✓ | | ☐ |
| Error wrapper has `success: false` | ✓ | | ☐ |
| Error wrapper has `errors` array | ✓ | | ☐ |
| Error item has `field` and `message` | ✓ | | ☐ |
| List response has `items` array | ✓ | | ☐ |
| List response has `totalCount` | ✓ | | ☐ |
| List response has `pageIndex` | ✓ | | ☐ |
| List response has `pageSize` | ✓ | | ☐ |
| List response has `totalPages` | ✓ | | ☐ |

### 4.3 Field Name Verification (camelCase in JSON)
| DTO | Field | Backend Returns | Frontend Expects | Status |
|-----|-------|----------------|-----------------|--------|
| ListItemDto | id | id | id | ☐ |
| ListItemDto | code | code | code | ☐ |
| ListItemDto | name | name | name | ☐ |
| ListItemDto | status | status | status | ☐ |
| ListItemDto | createdAt | createdAt | createdAt | ☐ |
| DetailDto | ... | ... | ... | ☐ |

### 4.4 Type Verification
| Field | Expected Type | Actual Type | Status |
|-------|--------------|-------------|--------|
| id | string (GUID) | | ☐ |
| createdAt | ISO8601 string | | ☐ |
| status | enum string | | ☐ |
| totalCount | number | | ☐ |

### 4.5 Enum Value Verification
| Enum | Frontend Value | Backend Returns | Status |
|------|---------------|----------------|--------|
| Status.Active | "active" | | ☐ |
| Status.Inactive | "inactive" | | ☐ |

## 5. End-to-End Test Scenarios

### Scenario 1: Load List

**User:** Viewer (has {feature}.view)
**Steps:**
1. Login as Viewer
2. Navigate to /{tenantId}/{feature}
3. Verify page loads
4. Verify grid shows data

**Assertions:**
- [ ] HTTP 200 from GET /api/{t}/{r}
- [ ] `success: true` in response
- [ ] `items` array populated
- [ ] `totalCount` matches actual seeded data
- [ ] Frontend grid shows correct number of rows
- [ ] Column values match API response fields
- [ ] Pagination shows correct total

---

### Scenario 2: Search

**User:** Viewer
**Steps:**
1. Enter keyword in search box
2. Wait for debounce / press Enter

**Assertions:**
- [ ] API called with `keyword` query param
- [ ] Grid updates with filtered results
- [ ] Total count updates
- [ ] URL updates with keyword
- [ ] Reload page preserves search

---

### Scenario 3: Filter

**User:** Viewer
**Steps:**
1. Select status filter (e.g., Active)

**Assertions:**
- [ ] API called with `status` query param
- [ ] Grid shows only Active records
- [ ] Total count reflects filtered count
- [ ] URL updates with status param
- [ ] Clear filter restores full list

---

### Scenario 4: Pagination

**User:** Viewer (25 records seeded)
**Steps:**
1. Set page size to 10
2. Verify first page shows 10 items
3. Click next page
4. Verify second page shows 10 items
5. Click last page
6. Verify last page shows 5 items

**Assertions:**
- [ ] `pageSize=10` in API request
- [ ] `pageIndex` increments correctly
- [ ] `totalPages` = 3 for 25 records at size 10
- [ ] URL params update correctly

---

### Scenario 5: Sort

**User:** Viewer
**Steps:**
1. Click column header "Name"
2. Verify ascending sort
3. Click again
4. Verify descending sort

**Assertions:**
- [ ] `sortBy=name&sortDirection=asc` in first request
- [ ] `sortBy=name&sortDirection=desc` in second request
- [ ] Grid rows reorder correctly

---

### Scenario 6: Create

**User:** Creator (has {feature}.create)
**Steps:**
1. Click Add button
2. Fill in valid form data
3. Submit

**Assertions:**
- [ ] POST /api/{t}/{r} called with correct request body
- [ ] Request body field names match API Contract
- [ ] HTTP 201 Created returned
- [ ] Success toast shown
- [ ] Dialog closes
- [ ] Grid refreshes and shows new record

---

### Scenario 7: Update

**User:** User with {feature}.update
**Steps:**
1. Click Edit on a record
2. Modify Name field
3. Submit

**Assertions:**
- [ ] PUT /api/{t}/{r}/{id} called
- [ ] Correct ID in URL
- [ ] Request body matches API Contract
- [ ] HTTP 200 returned
- [ ] Grid shows updated value

---

### Scenario 8: Delete Single

**User:** User with {feature}.delete
**Steps:**
1. Click Delete on a record
2. Confirm in dialog

**Assertions:**
- [ ] DELETE /api/{t}/{r}/{id} called
- [ ] HTTP 200 returned
- [ ] Record removed from grid
- [ ] Total count decrements

---

### Scenario 9: Bulk Delete

**User:** User with {feature}.delete
**Steps:**
1. Select 3 records via checkbox
2. Click Bulk Delete
3. Confirm

**Assertions:**
- [ ] POST /api/{t}/{r}/bulk-delete called
- [ ] Request body: `{ "ids": ["id1", "id2", "id3"] }`
- [ ] HTTP 200 returned
- [ ] All 3 records removed from grid
- [ ] Total count decrements by 3

---

### Scenario 10: Export

**User:** User with {feature}.export
**Steps:**
1. Apply some filters
2. Click Export button

**Assertions:**
- [ ] GET /api/{t}/{r}/export called with filter params
- [ ] File download starts
- [ ] File is valid Excel
- [ ] Data matches filtered list

---

### Scenario 11: Permission — No View

**User:** No Permission user
**Steps:**
1. Navigate to /{tenantId}/{feature}

**Assertions:**
- [ ] GET /api/{t}/{r} returns 403
- [ ] Frontend shows PermissionDenied state (not blank screen, not crash)
- [ ] Add button not shown
- [ ] Delete button not shown

---

### Scenario 12: Permission — View Only

**User:** Viewer
**Steps:**
1. Navigate to /{tenantId}/{feature}

**Assertions:**
- [ ] List loads correctly
- [ ] Add button NOT shown
- [ ] Edit button NOT shown
- [ ] Delete button NOT shown
- [ ] Export button NOT shown (if export requires permission)

---

### Scenario 13: Validation Error Display

**User:** Creator
**Steps:**
1. Open Add dialog
2. Submit empty form

**Assertions:**
- [ ] POST returns 400 with errors array
- [ ] Each error has correct `field` matching frontend field name
- [ ] Error message displays under correct field
- [ ] Dialog stays open
- [ ] No success toast

---

### Scenario 14: Tenant Isolation — List

**Users:** Tenant A Admin, Tenant B Admin
**Steps:**
1. Login as Tenant A Admin
2. Note list data (25 records)
3. Login as Tenant B Admin
4. Note list data (10 records)

**Assertions:**
- [ ] Tenant A sees exactly 25 records
- [ ] Tenant B sees exactly 10 records
- [ ] Neither can see the other's data

---

### Scenario 15: Tenant Isolation — Direct URL Access

**User:** Tenant B Admin
**Steps:**
1. Note ID of a Tenant A record
2. Navigate to /api/{tenantB}/{feature}/{tenantAEntityId}

**Assertions:**
- [ ] Backend returns 404 (not the entity)
- [ ] Frontend shows not-found state

---

### Scenario 16: Duplicate Code Validation

**User:** Creator
**Steps:**
1. Create entity with code "S001"
2. Try to create another entity with code "S001"

**Assertions:**
- [ ] Second create returns 409 Conflict
- [ ] Error message shown for code field
- [ ] First entity unaffected

---

### Scenario 17: 401 Handling

**Steps:**
1. Let JWT expire (or manually clear token)
2. Attempt any API action

**Assertions:**
- [ ] API returns 401
- [ ] Frontend redirects to login page
- [ ] No data leak shown

---

### Scenario 18: Server Error Handling

**Steps:**
1. Simulate 500 from backend (can use feature flag / test endpoint)

**Assertions:**
- [ ] Frontend shows generic error state
- [ ] No unhandled JS exception
- [ ] Error message is user-friendly

---

## 6. Playwright E2E Test Plan

```typescript
// accounting_web/e2e/{feature}.spec.ts

import { test, expect } from '@playwright/test';

test.describe('{Feature} — List Page', () => {

  test.beforeEach(async ({ page }) => {
    // Login and navigate
    await page.goto('/login');
    await page.fill('[name=email]', 'admin@test.com');
    await page.fill('[name=password]', 'password');
    await page.click('[type=submit]');
    await page.waitForURL('**/{tenantId}/dashboard');
    await page.goto(`/{tenantId}/{feature}`);
  });

  test('displays list with correct data', async ({ page }) => {
    await expect(page.locator('[data-testid="feature-grid"]')).toBeVisible();
    await expect(page.locator('.ag-row')).toHaveCount(20); // default page size
  });

  test('creates new entity successfully', async ({ page }) => {
    await page.click('[data-testid="add-button"]');
    await page.fill('[name=code]', 'TEST001');
    await page.fill('[name=name]', 'Integration Test Supplier');
    await page.click('[data-testid="save-button"]');
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=TEST001')).toBeVisible();
  });

  test('shows permission denied for user without permissions', async ({ page, context }) => {
    // Login as no-perm user
    // Navigate to feature page
    // Verify PermissionDenied state
  });

  test('tenant isolation — cannot see other tenant data', async ({ page }) => {
    // Login as Tenant A
    // Check data count
    // Login as Tenant B
    // Verify different data count
  });

});
```

---

## 7. Postman / HTTP Test Collection

### Environment Variables
```json
{
  "baseUrl": "http://localhost:{port}",
  "tenantId": "{{tenant-a-id}}",
  "adminToken": "{{get from login endpoint}}"
}
```

### Collection Structure
```
{Feature} API Tests/
├── Auth/
│   └── Login (Admin)
├── Happy Path/
│   ├── GET List
│   ├── GET List with Search
│   ├── GET List with Filter
│   ├── GET List with Sort
│   ├── GET List with Pagination
│   ├── GET Detail
│   ├── POST Create (valid)
│   ├── PUT Update (valid)
│   ├── DELETE Single
│   ├── POST Bulk Delete
│   └── GET Export
├── Validation/
│   ├── POST Create — empty fields (expect 400)
│   ├── POST Create — duplicate code (expect 409)
│   └── PUT Update — invalid data (expect 400)
├── Auth/Permission/
│   ├── GET List — no token (expect 401)
│   ├── GET List — no permission (expect 403)
│   ├── POST Create — no create perm (expect 403)
│   └── DELETE — no delete perm (expect 403)
└── Tenant Isolation/
    ├── GET Detail — wrong tenant (expect 404)
    └── GET List — verify count per tenant
```

---

## 8. Integration Defect Template

```markdown
### Defect #{n}

**Severity:** [Critical | High | Medium | Low]
**Phase:** Integration Test
**Scenario:** Scenario {n} — {name}

**Expected (per API Contract):**
- Method: {METHOD}
- Endpoint: {endpoint}
- Response field: `{field}` should be `{expected_value}`

**Actual:**
- Response field: `{field}` is `{actual_value}`

**Root Cause:** [Frontend | Backend | Contract Ambiguity]

**Fix Required:**
- [ ] Frontend: Update `{file}` line {n} — change `{old}` to `{new}`
- [ ] Backend: Update `{file}` line {n} — change `{old}` to `{new}`
- [ ] Contract: Update Phase 3 document section {n}

**Status:** [Open | Fixed | Verified | Won't Fix]
```

---

## 9. Exit Criteria

Integration testing is COMPLETE only when ALL of the following are true:

### Functional
- [ ] All 18 E2E scenarios pass
- [ ] All Postman tests pass (happy paths)
- [ ] All Postman tests pass (validation errors)
- [ ] All Postman tests pass (permission scenarios)

### Contract Compliance
- [ ] All JSON field names match API Contract exactly (camelCase)
- [ ] All data types match API Contract
- [ ] All pagination fields present and correct
- [ ] All error response fields present and correct

### Security
- [ ] 401 returned for all endpoints without JWT
- [ ] 403 returned for all endpoints with wrong permission
- [ ] No cross-tenant data leakage

### Frontend Behavior
- [ ] No unhandled JS exceptions in browser console
- [ ] No 4xx/5xx errors swallowed silently
- [ ] Loading states work correctly
- [ ] Error states work correctly
- [ ] Empty states work correctly
- [ ] Success toasts appear correctly

### Performance (Smoke)
- [ ] List API responds in < 500ms for 25 records
- [ ] UI renders list in < 2s after API response
- [ ] No N+1 queries (check SQL profiler)

### Defects
- [ ] Zero open Critical defects
- [ ] Zero open High defects affecting core flows
- [ ] All defects logged with defect template

---

## Rules

1. **API Contract Review (Phase 3) là source of truth** — không tự diễn giải.
2. **Phải test cả frontend protection** (UI hides/shows) **và backend enforcement** (HTTP 401/403).
3. **Tenant isolation là bắt buộc** — phải có ít nhất 2 test tenants.
4. **Permission testing là bắt buộc** — phải test thiếu permission cho mọi operation.
5. **Không đánh dấu integration complete** nếu còn field name/type mismatch giữa frontend và backend.
6. Khi phát hiện defect: log vào defect template, xác định root cause (Frontend / Backend / Contract).
7. Contract defect phải được fix ở Phase 3 document trước, sau đó mới fix code.

---

## File Path Rules

| Output | Path |
|--------|------|
| Test plan | `docs/features/{feature-name}/10-integration-test-plan.md` |
| Playwright tests | `accounting_web/e2e/{feature}.spec.ts` |
| Postman collection | `docs/features/{feature-name}/postman/{feature}-collection.json` |

---

## Final Report Format

```
## Phase 10 Complete — Integration Testing

**Feature:** {feature-name}
**Document:** docs/features/{feature-name}/10-integration-test-plan.md

### Test Results

| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Happy Path Scenarios | {n} | {n} | {n} |
| Validation Scenarios | {n} | {n} | {n} |
| Permission Scenarios | {n} | {n} | {n} |
| Tenant Isolation | {n} | {n} | {n} |
| Error Handling | {n} | {n} | {n} |

### Contract Compliance
- [ ] All field names verified: ✅ / ❌ {details}
- [ ] All types verified: ✅ / ❌ {details}
- [ ] All pagination fields: ✅ / ❌ {details}

### Defects Found
| # | Severity | Description | Root Cause | Status |
|---|----------|-------------|------------|--------|
| | | | | |

### Exit Criteria Status
- [ ] All 9 exit criteria met

### Feature Status
**[READY TO SHIP | BLOCKED — {reason}]**

### Notes for Next Feature
- ...
```
