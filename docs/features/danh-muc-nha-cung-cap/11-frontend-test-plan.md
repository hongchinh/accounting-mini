# Frontend Test Plan: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Test Scope

Phase 11 adds frontend tests for the new components and behaviors introduced in Phase 8. The 24 tests from Phase 8 (TDD cycle) already covered schema validation, query key structure, SupplierSummaryCards render, and BulkDeleteConfirmDialog render. This phase fills the remaining gaps:

- `SupplierForm` — type selector toggle, conditional field visibility, edit-mode code lock, validation errors, submit callback
- No MSW or router setup required — all new tests are unit-level component tests

---

## 2. Test Environment

| Component | Detail |
|---|---|
| Framework | Vitest + React Testing Library |
| Environment | jsdom |
| Setup | `tests/setup.ts` — `@testing-library/jest-dom/vitest` matchers, cleanup after each |
| User interactions | `@testing-library/user-event` v14 |
| API mocking | `vi.mock` (used in BulkDeleteConfirmDialog tests) |
| Run command | `node_modules/.bin/vitest run src/modules/suppliers/` |

---

## 3. Test Checklist

| Area | Coverage | Status |
|---|---|---|
| Schema validation (code, name, supplierType, groupName, idNumber, isCustomer, isInternalObject) | `supplier.schema.test.ts` — 15 tests | Covered (Phase 8) |
| Query key structure and tenant scoping | `useSuppliers.test.ts` — 3 tests | Covered (Phase 8) |
| SupplierSummaryCards — debt, credit, loading skeleton, empty state | `SupplierSummaryCards.test.tsx` — 4 tests | Covered (Phase 8) |
| BulkDeleteConfirmDialog — count display, closed state | `BulkDeleteConfirmDialog.test.tsx` — 2 tests | Covered (Phase 8) |
| SupplierForm — type selector rendering and active state | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — idNumber conditional on Cá nhân type | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — isInternalObject conditional on Tổ chức type | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — code field disabled in edit mode | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — Cất và Thêm hidden in edit mode | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — validation error on empty code submit | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — onSubmit called with correct values | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierForm — onCancel called and button visibility | `SupplierForm.test.tsx` — new | Covered (Phase 11) |
| SupplierListPage — visual + permission tests | Not covered (requires router + MSW + permission store) | Deferred |
| SupplierTable — AG Grid column rendering | Not covered (AG Grid render complexity in jsdom) | Deferred |

---

## 4. Test Cases

### Phase 8 TDD tests (24 — unchanged)

| # | File | Test | Result |
|---|---|---|---|
| 1–15 | `supplier.schema.test.ts` | Schema validation (code, name, supplierType, groupName, idNumber, isCustomer, isInternalObject) | Pass |
| 16–18 | `useSuppliers.test.ts` | Query key structure (all, summary, list) | Pass |
| 19–22 | `SupplierSummaryCards.test.tsx` | Debt/credit rendered, skeleton loading, empty null | Pass |
| 23–24 | `BulkDeleteConfirmDialog.test.tsx` | Count display, closed state | Pass |

### Phase 11 new tests (14)

| # | Test | Assertion |
|---|---|---|
| 1 | Renders both type selector buttons | Both "Tổ chức" and "Cá nhân" buttons present |
| 2 | Defaults to Tổ chức type | "Tổ chức" button has `bg-primary` class |
| 3 | Shows idNumber field when Cá nhân selected | `getByLabelText("Số CCCD")` is in DOM |
| 4 | Hides idNumber when switching back to Tổ chức | `queryByLabelText("Số CCCD")` is null |
| 5 | Shows isInternalObject checkbox for Tổ chức | `getByLabelText("Là đối tượng nội bộ")` present |
| 6 | Hides isInternalObject when Cá nhân selected | `queryByLabelText("Là đối tượng nội bộ")` is null |
| 7 | Code field disabled in edit mode | Input with value "NCC001" is `disabled` |
| 8 | Code field enabled in create mode | Input with label "Mã *" is not disabled |
| 9 | Shows "Cất và Thêm" in create mode | Button present when `onSubmitAndAdd` provided |
| 10 | Hides "Cất và Thêm" in edit mode | Button absent in edit mode |
| 11 | Shows validation error on empty code submit | "Mã nhà cung cấp là bắt buộc" appears after click |
| 12 | Calls onSubmit with correct values | `onSubmit` called once with `{ code, name, supplierType }` |
| 13 | Calls onCancel when Hủy clicked | `onCancel` mock called once |
| 14 | No Hủy button when onCancel not provided | Button absent when prop omitted |

---

## 5. Unit Test Files

| File | Tests | Scope |
|---|---|---|
| `src/modules/suppliers/supplier.schema.test.ts` | 15 | Zod schema validation rules |
| `src/modules/suppliers/useSuppliers.test.ts` | 3 | TanStack Query key structure + tenant scoping |

---

## 6. Component Test Files

| File | Tests | Scope |
|---|---|---|
| `src/modules/suppliers/components/SupplierSummaryCards.test.tsx` | 4 | Render: debt, credit, skeleton, empty null |
| `src/modules/suppliers/components/BulkDeleteConfirmDialog.test.tsx` | 2 | Render: count display, closed state |
| `src/modules/suppliers/components/SupplierForm.test.tsx` | 14 | Type selector, conditional fields, edit mode, validation, callbacks |

---

## 7. MSW Handlers

No MSW handlers added in Phase 11. Existing `vi.mock` pattern in `BulkDeleteConfirmDialog.test.tsx` mocks the API client directly — no MSW server setup needed for current test scope.

---

## 8. Permission Tests

Permission-based visibility (Can component guard on Thêm mới, Xuất ra Excel, Xóa N mục, Xác nhận địa chỉ) is not covered in this phase. These require mocking the `usePermissions` hook and wrapping with providers. Logged as deferred item P11-D1.

---

## 9. Tenant Tests

Tenant-aware query key tests are covered in `useSuppliers.test.ts` (test #16–18 above): all keys include `tenantId`, and `summary` key is scoped under the `["suppliers", tenantId]` namespace.

---

## 10. Test Commands

```powershell
# Run supplier module tests
cd accounting_web
node_modules/.bin/vitest run src/modules/suppliers/

# Run all frontend tests
node_modules/.bin/vitest run

# TypeScript check
node_modules/.bin/tsc --noEmit
```

---

## 11. Test Results

| Run | Result |
|---|---|
| `vitest run src/modules/suppliers/` | **38 passed, 0 failed** (5 test files) |
| `tsc --noEmit` | 0 errors |

---

## 12. Unclear / Incomplete Items

| ID | Item | Blocking? | Notes |
|---|---|---|---|
| P11-D1 | SupplierListPage permission-based visibility tests | No | Deferred — requires router mock, permission store mock, and MSW for API calls |
| P11-D2 | SupplierTable AG Grid column rendering tests | No | Deferred — AG Grid requires complex DOM setup in jsdom; visual verification done in Phase 9 |
| P11-D3 | E2E tests for create/edit/delete flows | No | Not in scope for Phase 11; E2E phase if planned |

---

## 13. Definition of Done

- [x] Test plan created
- [x] 14 new component tests for SupplierForm (type selector, conditional fields, edit mode, validation, callbacks)
- [x] All 38 tests pass: 24 from Phase 8 + 14 new
- [x] TypeScript: 0 errors
- [x] Test commands documented
- [x] Open deferred items recorded as non-blocking
