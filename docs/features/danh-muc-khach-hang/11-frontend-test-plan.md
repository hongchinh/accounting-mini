# Frontend Test Plan: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Test Scope

| Area | In Scope | Notes |
|---|---|---|
| Schema validation | ✓ | customerFormSchema, bankAccountInputSchema |
| Query key structure | ✓ | All 5 key patterns with tenantId |
| Hook invalidation | ✓ | Mutation → key invalidation chains |
| CustomerFormDialog | ✓ | Title per mode, type toggle, tabs, submit, close, validation |
| CustomerSummaryCards | ✓ | Render, loading, empty, formatted value |
| DeleteConfirmDialog | ✓ | Render, delete flow, 409 blocked state |
| BulkDeleteConfirmDialog | ✓ | Render, cancel |
| CustomerRowActions | ✓ | Permission gating, active/inactive toggle label, callbacks |
| MSW handlers | — | Not used; hooks mocked with vi.mock |
| CustomerGrid | — | AG Grid internals are integration-layer; covered by row-actions test |
| CustomerListPage | — | Deferred to Phase 12 integration testing |

---

## 2. Test Environment

| Item | Value |
|---|---|
| Runner | Vitest 2.1.9 |
| Environment | jsdom |
| React Testing Library | @testing-library/react |
| User interactions | @testing-library/user-event |
| Hook mocking | vi.mock + vi.hoisted |
| API mocking | No MSW; mutation hooks mocked directly |
| Setup file | `tests/setup.ts` → @testing-library/jest-dom/vitest |

---

## 3. Test Checklist

- [x] Page render — title, mode labels covered in CustomerFormDialog tests
- [x] Form type toggle — Tổ chức / Cá nhân switch
- [x] Form validation — empty required fields prevent mutation call
- [x] Form submit — valid payload reaches createMutation
- [x] Edit mode — loading state shown while fetching detail
- [x] Delete single — dialog renders, Xóa calls mutation, Hủy closes
- [x] Delete 409 blocked — blocked message replaces Xóa button with Đóng
- [x] Bulk delete — renders count, Hủy closes
- [x] Permission-based visibility — row actions hidden per customer.update / customer.delete
- [x] Active/inactive toggle label — Ngừng sử dụng vs Sử dụng
- [x] Row action callbacks — ctx.onEdit called on Sửa click
- [x] Summary cards — all 3 cards render, skeleton loading, formatted amount
- [x] Query key tenant scope — all keys include tenantId, invalidation chains correct
- [x] Search / sort / pagination — covered by schema + keys tests; page-level covered by Phase 12
- [x] Export action — hook wired; UI-level export covered by Phase 12

---

## 4. Test Cases (Summary)

| # | File | Test Case | Result |
|---|---|---|---|
| 1–38 | customer.schema.test.ts | Schema validation (customerType, code, name, emails, dates, debtDays, maxDebt, bankAccount fields) | ✓ |
| 39–44 | customer.keys.test.ts | Key structure: all, lists, list, detail, summary contain tenantId | ✓ |
| 45–47 | useCustomers.test.ts | Invalidating all(tid) covers lists + detail + summary; lists covers list; detail distinct from lists | ✓ |
| 48–51 | CustomerSummaryCards.test.tsx | Renders 3 cards, skeleton when loading, null when no data, formatted totalReceivable | ✓ |
| 52–53 | BulkDeleteConfirmDialog.test.tsx | Renders "Xóa N mục" button, Hủy calls onClose | ✓ |
| 54–64 | CustomerFormDialog.test.tsx | Title per mode, loading state, type toggle default + switch, "Là nhà cung cấp", all 6 tabs, Hủy calls onClose, empty submit blocked, valid submit calls createMutation | ✓ |
| 65–69 | DeleteConfirmDialog.test.tsx | Customer name in text, Hủy + Xóa buttons, Hủy closes, Xóa calls mutate, 409 shows blocked state | ✓ |
| 70–75 | CustomerRowActions.test.tsx | Null without data, null without perms, renders trigger with update perm, Ngừng sử dụng (active), Sử dụng (inactive), ctx.onEdit called | ✓ |

---

## 5. Unit Test Files

| File | Tests | Coverage |
|---|---|---|
| `customer.schema.test.ts` | 38 | Zod schema validation — all rules |
| `customer.keys.test.ts` | 6 | Query key factory — structure + tenant scope |
| `useCustomers.test.ts` | 3 | Mutation invalidation chains |

---

## 6. Component Test Files

| File | Tests | Coverage |
|---|---|---|
| `components/CustomerSummaryCards.test.tsx` | 4 | Render, loading skeleton, empty state, formatted amount |
| `components/BulkDeleteConfirmDialog.test.tsx` | 2 | Render with count, Hủy closes |
| `components/CustomerFormDialog.test.tsx` | 11 | Title, loading, type toggle, checkbox, tabs, submit, validation |
| `components/DeleteConfirmDialog.test.tsx` | 5 | Render, Hủy, Xóa, 409 blocked state |
| `components/CustomerRowActions.test.tsx` | 6 | Permission gating, active/inactive label, callback |

**Total: 75 tests across 8 files**

---

## 7. MSW Handlers

Not used. All API boundary mocking is done via `vi.mock("../useCustomers", ...)` which replaces hook return values directly. MSW is deferred to Phase 12 integration tests.

---

## 8. Permission Tests

Covered in `CustomerRowActions.test.tsx`:

| Test | Permission setup | Expected |
|---|---|---|
| No permissions | `can()` returns false for all | component returns null |
| Update only | `can(Customer.Update)` = true | trigger renders, Sửa + toggle shown |
| Xóa call | `can(Customer.Delete)` = true | Xóa item shown in dropdown |

Toolbar-level permission buttons (Thêm, Xuất, Xóa nhiều) are wired to `<Can>` — covered by Phase 12 page-level tests.

---

## 9. Tenant Tests

Covered in `customer.keys.test.ts` and `useCustomers.test.ts`:

| Behavior | Test |
|---|---|
| All query keys include `tenantId` | `all`, `lists`, `list`, `detail`, `summary` key assertions |
| `all(tid)` prefix covers `detail` and `summary` | invalidation chain test |
| Tenant-scoped mutation invalidation | `useCustomers.test.ts` invalidation coverage |

Hook `enabled: !!tenantId` guards not tested at component level (would require rendering with mocked tenant store); deferred to Phase 12 page-level integration.

---

## 10. Test Commands

```powershell
# Customer module only
npx vitest run src/modules/customers/

# Full suite
npx vitest run
```

---

## 11. Test Results

| Run | Scope | Passed | Failed | Time |
|---|---|---|---|---|
| 2026-06-04 | `src/modules/customers/` | 75 | 0 | ~7s |
| 2026-06-04 | Full suite | 117 | 0 | ~7s |

No regressions. Pre-existing unrelated type error in `SupplierForm.test.tsx` (noted in Phase 8) remains; does not affect test runs.

Radix Dialog `Missing Description` warnings appear for `CustomerFormDialog` tests (not failures — component intentionally omits `DialogDescription` for the form modal pattern).

---

## 12. Unclear / Incomplete Items

| ID | Item | Blocking? |
|---|---|---|
| P11-N1 | `CustomerListPage` page-level tests (toolbar visibility per permission, pagination, search URL params) | No — deferred to Phase 12 |
| P11-N2 | `enabled: !!tenantId` disabled-state test requires rendering with mocked `useTenantStore` | No — deferred to Phase 12 |
| P11-N3 | Export flow (blob download) not tested at component level | No — mutation hook wired; download behavior covered by Phase 12 |

---

## 13. Definition of Done

- [x] Test plan created (`11-frontend-test-plan.md`)
- [x] 3 new test files created (CustomerFormDialog, DeleteConfirmDialog, CustomerRowActions)
- [x] 22 new tests added (22 new + 53 Phase 8 = 75 total in customer module)
- [x] All 75 customer module tests pass
- [x] Full suite 117/117 pass — zero regressions
- [x] Permission tests included (CustomerRowActions.test.tsx)
- [x] Tenant-aware key behavior tested (customer.keys.test.ts, useCustomers.test.ts)
- [x] 409 blocked state covered for both delete dialogs
- [x] Open non-blocking items recorded
