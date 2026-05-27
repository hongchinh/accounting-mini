# Feature Issues: Danh mục nhà cung cấp

## Summary

| Status | Count |
|---|---:|
| Open Blocking | 0 |
| Open Non-blocking | 9 |
| Resolved | 10 |
| Deferred | 6 |

## Issues

| ID | Phase | Type | Description | Source | Blocking? | Status | User Answer | Resolution |
|---|---:|---|---|---|---|---|---|---|
| P1-A1 | 1 | Assumption | Config has `folder: suppliers`, but the matched workflow folder is `docs/features/danh-muc-nha-cung-cap`; workflow files are written to the matched folder. | config.yaml | No | Deferred |  | Use matched folder unless user asks to reorganize. |
| P1-M1 | 1 | Missing Information | Configured `references/images/` folder is missing or empty. | input inspection | No | Deferred |  | Use `images/` screenshot set as the visual source for Phase 2. |
| P1-Q1 | 1 | User Question | Confirm MVP utility scope: import Excel, merge suppliers, clone supplier, and update address. | screenshots/docs/config | No | Resolved | Core CRUD + Export only. Import/merge/clone/update-address deferred. | Scope confirmed by user. |
| P1-Q2 | 1 | Permission Issue | Confirm canonical permission prefix: config uses `supplier.*`, supplemental SCR uses `suppliers.*`. | config.yaml + markdown/SCR-1 | No | Deferred |  | Apply default: `supplier.*` from config. |
| P1-Q3 | 1 | Conflict | Confirm delete semantics: config says soft delete, reference docs describe permanent delete after dependency checks. | config.yaml + references/markdown/nha-cung-cap.md | No | Deferred |  | Apply default: soft delete with transaction dependency guard. |
| P1-Q4 | 1 | Unclear Requirement | Confirm exact list filters and address-update trigger. | screenshots | No | Deferred |  | Apply default: filters by status/group/province; address update from toolbar batch action. |
| P2-Q1 | 2 | Unclear Requirement | Exact primary color hex — appears teal-blue in some screens, pure blue in others. | screenshots | No | Resolved | Phase 9 visual review confirmed: blue matches #1E88E5 assumption. | Confirmed #1E88E5. |
| P2-Q2 | 2 | Unclear Requirement | Exact number and labels of summary cards — only 2 visible, labels partially cut off. | list screenshot | No | Resolved | Phase 9 confirmed: 2 cards — "NCC nợ cần trả" (red) + "Trả trước" (green). | Confirmed 2 cards and labels. |
| P2-Q3 | 2 | Unclear Requirement | Detail view: split-panel (master-detail) or separate route? Screenshot shows split panel layout. | detail screenshot | No | Resolved |  | Phase 5 confirmed: separate route `/[id]/page.tsx` already exists — no split-panel. |
| P2-A1 | 2 | Assumption | Alternating row color assumed #FAFBFC — not pixel-verified from screenshot. | assumption | No | Open |  | Apply default; verify in Phase 9 visual review. |
| P2-A2 | 2 | Assumption | Import Excel screen is in scope of screenshots but is deferred MVP scope — pixel spec not extracted. | import screenshot | No | Open |  | No action for MVP; defer to future phase. |
| B3-Q1 | 3 | User Question | SupplierGroup: dedicated entity with its own CRUD (separate master list), or simple free-text string tag on the supplier form? | UI form — group dropdown visible | Yes | Resolved | Free-text string tag. | Use `GroupName` as plain string on the Supplier entity — no SupplierGroup table. |
| B3-Q2 | 3 | User Question | Summary card values: what aggregates should the `/summary` endpoint return? (e.g., total debt owed to suppliers, total credit/prepaid, active count, inactive count?) | UI — 2 cards visible with large numbers | Yes | Resolved | Total debt + total credit + counts. | `SupplierSummaryDto`: TotalDebtAmount, TotalCreditAmount, ActiveCount, InactiveCount. |
| B3-Q3 | 3 | User Question | Bulk delete behavior when some suppliers have transactions: return partial-success (delete valid, skip invalid, return list of skipped IDs) or fail-all-if-any-has-transactions? | Business rule — existing single-delete returns 409 | Yes | Resolved | Fail-all if any has transactions. | BulkDelete returns 409 if any ID has transactions; no deletions performed. |
| B3-Q4 | 3 | Conflict | Supplier code max length: PDR says 50 chars, existing CreateSupplierCommandValidator says 32. Which is authoritative? | PDR vs code | No | Resolved |  | Phase 4 contract decision #6: Use 50 (PDR authoritative). Update validator in Phase 7. |
| P4-A1 | 4 | Assumption | groupName filter: ILike partial match (same pattern as search). | Phase 4 contract | No | Open |  | Apply default; confirm in Phase 7 implementation. |
| P4-A2 | 4 | Assumption | Summary endpoint: no date-range filter; returns tenant-wide totals. | Phase 4 contract | No | Open |  | Apply default; can add date-range later if needed. |
| P1-Q4 | 1 | Unclear Requirement | Province/period filters not supported by backend. groupName string filter added; provinceCode+period deferred. | Phase 4 gap analysis | No | Deferred |  | Phase 4 decision: `groupName` string filter only; province/period out of scope. |
| P5-A1 | 5 | Assumption | Detail view implemented as separate route `/[id]/page.tsx` — resolves P2-Q3 (no split-panel). | codebase inspection | No | Open |  | Confirmed in Phase 5. Verify layout in Phase 9. |
| P5-A2 | 5 | Assumption | `format.ts` utility assumed to handle Vietnamese locale for money formatting (TotalDebtAmount, TotalCreditAmount). | codebase inspection | No | Resolved | Phase 9 confirmed: 23.000.000 displays in Vietnamese locale. | Formatting verified correct. |
| P5-A3 | 5 | Assumption | New AG Grid columns (GroupName, SupplierType) appended before existing action column. | Phase 5 plan | No | Open |  | Confirm column order matches Phase 2 pixel spec in Phase 8. |
| P5-Q1 | 5 | Unclear Requirement | BulkDeleteConfirmDialog: show affected supplier names or count only? API returns 409 but not names of blocking suppliers. | Phase 5 plan | No | Open |  | Default: show count only. Change in Phase 8 if UX review requires names. |
| B6-Q1 | 6 | Missing Information | How does `DeleteSupplierCommand` check for transactions? Join table/count pattern unknown — needed to implement `BulkDeleteSuppliersCommand` correctly. | Phase 6 plan | No | Open |  | Read handler in Phase 7 before implementing BulkDelete. |
| B6-A1 | 6 | Assumption | `GetSuppliersSummaryQuery` uses two `SumAsync` calls (positive = debt, negative = credit) rather than a single aggregate. | Phase 6 plan | No | Open |  | Acceptable for current scale. Can optimize post-Phase 10. |

