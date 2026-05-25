# Feature Issues: Danh mục nhà cung cấp

## Summary

| Status | Count |
|---|---:|
| Open Blocking | 0 |
| Open Non-blocking | 7 |
| Resolved | 4 |
| Deferred | 5 |

## Issues

| ID | Phase | Type | Description | Source | Blocking? | Status | User Answer | Resolution |
|---|---:|---|---|---|---|---|---|---|
| P1-A1 | 1 | Assumption | Config has `folder: suppliers`, but the matched workflow folder is `docs/features/danh-muc-nha-cung-cap`; workflow files are written to the matched folder. | config.yaml | No | Deferred |  | Use matched folder unless user asks to reorganize. |
| P1-M1 | 1 | Missing Information | Configured `references/images/` folder is missing or empty. | input inspection | No | Deferred |  | Use `images/` screenshot set as the visual source for Phase 2. |
| P1-Q1 | 1 | User Question | Confirm MVP utility scope: import Excel, merge suppliers, clone supplier, and update address. | screenshots/docs/config | No | Resolved | Core CRUD + Export only. Import/merge/clone/update-address deferred. | Scope confirmed by user. |
| P1-Q2 | 1 | Permission Issue | Confirm canonical permission prefix: config uses `supplier.*`, supplemental SCR uses `suppliers.*`. | config.yaml + markdown/SCR-1 | No | Deferred |  | Apply default: `supplier.*` from config. |
| P1-Q3 | 1 | Conflict | Confirm delete semantics: config says soft delete, reference docs describe permanent delete after dependency checks. | config.yaml + references/markdown/nha-cung-cap.md | No | Deferred |  | Apply default: soft delete with transaction dependency guard. |
| P1-Q4 | 1 | Unclear Requirement | Confirm exact list filters and address-update trigger. | screenshots | No | Deferred |  | Apply default: filters by status/group/province; address update from toolbar batch action. |
| P2-Q1 | 2 | Unclear Requirement | Exact primary color hex — appears teal-blue in some screens, pure blue in others. | screenshots | No | Open |  | Use #1E88E5 as default; verify in Phase 9 visual review. |
| P2-Q2 | 2 | Unclear Requirement | Exact number and labels of summary cards — only 2 visible, labels partially cut off. | list screenshot | No | Open |  | Assume: Nợ cần trả total + Trả trước total; confirm in Phase 9. |
| P2-Q3 | 2 | Unclear Requirement | Detail view: split-panel (master-detail) or separate route? Screenshot shows split panel layout. | detail screenshot | No | Open |  | Assume split-panel; clarify in Phase 5 frontend plan. |
| P2-A1 | 2 | Assumption | Alternating row color assumed #FAFBFC — not pixel-verified from screenshot. | assumption | No | Open |  | Apply default; verify in Phase 9 visual review. |
| P2-A2 | 2 | Assumption | Import Excel screen is in scope of screenshots but is deferred MVP scope — pixel spec not extracted. | import screenshot | No | Open |  | No action for MVP; defer to future phase. |
| B3-Q1 | 3 | User Question | SupplierGroup: dedicated entity with its own CRUD (separate master list), or simple free-text string tag on the supplier form? | UI form — group dropdown visible | Yes | Resolved | Free-text string tag. | Use `GroupName` as plain string on the Supplier entity — no SupplierGroup table. |
| B3-Q2 | 3 | User Question | Summary card values: what aggregates should the `/summary` endpoint return? (e.g., total debt owed to suppliers, total credit/prepaid, active count, inactive count?) | UI — 2 cards visible with large numbers | Yes | Resolved | Total debt + total credit + counts. | `SupplierSummaryDto`: TotalDebtAmount, TotalCreditAmount, ActiveCount, InactiveCount. |
| B3-Q3 | 3 | User Question | Bulk delete behavior when some suppliers have transactions: return partial-success (delete valid, skip invalid, return list of skipped IDs) or fail-all-if-any-has-transactions? | Business rule — existing single-delete returns 409 | Yes | Resolved | Fail-all if any has transactions. | BulkDelete returns 409 if any ID has transactions; no deletions performed. |
| B3-Q4 | 3 | Conflict | Supplier code max length: PDR says 50 chars, existing CreateSupplierCommandValidator says 32. Which is authoritative? | PDR vs code | No | Open |  | Recommendation: use 50 (PDR); update validator in Phase 7. |

