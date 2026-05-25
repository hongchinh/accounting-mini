# Frontend Basic Design: Danh mục nhà cung cấp
## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: Yes
## 1. Feature Config Summary
- Feature key: `danh-muc-nha-cung-cap`
- Entity: Supplier
- Workflow mode: full
- Frontend route: `/categories/suppliers`
- Table library: AG Grid
- Visual review: enabled, strict
- Permissions source: config uses `supplier.*`
## 2. Input Sources
| Source | Path | Status | Notes |
|---|---|---|---|
| Current UI images | docs/features/danh-muc-nha-cung-cap/images/ | Found: 8 | Main visual source. |
| Reference UI images | docs/features/danh-muc-nha-cung-cap/references/images/ | Missing / empty | No separate external UI comparison. |
| Reference markdown | docs/features/danh-muc-nha-cung-cap/references/markdown/ | Found: 3 | MISA supplier, create/edit, merge guides. |
| Supplemental markdown | docs/features/danh-muc-nha-cung-cap/markdown/ | Found: 2 | Existing screen/business specs in feature folder. |
## 3. Missing Inputs
`references/images/` is empty. Phase 1 uses the 8 screenshots in `images/` as the visual target and records this as non-blocking issue `P1-M1`.
## 4. Current UI Analysis
| Screen | File | Observed UI / Behavior |
|---|---|---|
| Supplier list | danhmuc_nhacungcap_list.png | Title, category backlink, summary cards, bulk action, filter, search, refresh/export/settings icons, update address, utilities, add button, supplier grid, pagination. |
| Row menu | danhmuc_nhacungcap_list_menu_chucnang.png | Row action menu contains Xem, Sửa, Nhân bản, Xóa, Ngừng sử dụng. |
| Supplier detail | danhmuc_nhacungcap_detail.png | Left supplier selector, supplier facts, debt totals, tabs, transaction table, row actions for offset/payment. |
| Excel import | danhmuc_nhacungcap_import_excel.png | Four-step wizard: choose file, map data, validate data, result; file limit 20MB; add/update modes. |
| Add individual | danhmuc_nhacungcap_them_canhan.png | Wide modal with Cá nhân selected, CCCD/date/place, code, name, tax, group, employee, contact/payment/bank/address/note/extra tabs. |
| Add organization | danhmuc_nhacungcap_them_tochuc.png | Wide modal with Tổ chức selected, tax/CCCD, budget unit code, phone, website, groups, internal/customer flags, tabs. |
| Update address | danhmuc_nhacungcap_xacnhandiachiNCC.png | Confirmation modal with supplier table, old address, new address, responsibility checkbox. |
| Delete | danhmuc_nhacungcap_xoa.png | Warning modal confirms deleting selected supplier. |
**Key inventory:** list/search/filter/sort/pagination, summary cards, create/update, row menu, delete, stop/use, detail ledger, import, export, address update, pay, create purchase voucher, column customization.
**Unclear from screenshots:** exact filter fields, utility menu options, update-address trigger, clone behavior, delete-with-transactions state, destination routes for pay/purchase voucher.
## 5. Reference UI Analysis
No files were found in `references/images/`. UX patterns are therefore taken from current screenshots: dense accounting grid, compact toolbar, wide maintenance modal, guarded destructive actions, and server-side paged data.
## 6. Reference Markdown Analysis
| Document | Main rules / flows extracted |
|---|---|
| references/markdown/nha-cung-cap.md | Create, edit, stop/use, delete, export Excel, customize grid; stopped suppliers are hidden from related documents/reports; delete is blocked when transactions exist. |
| references/markdown/khai-bao-nha-cung-cap.md | Organization/person supplier creation; `Là khách hàng` sync; tax-code lookup; internal object flags; contact/payment/bank/address/note/extra tabs. |
| references/markdown/gop-nha-cung-cap.md | Automatic/manual merge by name, tax code, phone, address; one retained supplier receives transactions; others are removed. |
| markdown/danh-muc-nha-cung-cap.md | Consolidated feature spec covering list, filters, rich form, detail, import, export, update address, merge, messages. |
| markdown/SCR-1_仕入先マスター_Supplier-List.md | Simpler `/suppliers` list spec: AG Grid, search, create dialog, Zod validation, permissions `suppliers.*`. |
**Business rules:** supplier code unique per tenant, tenant isolation, soft delete from config, cannot delete with transactions, negative debt displayed in red, inactive suppliers hidden from document/report selectors, customer sync when flagged, import add/update modes, merge transfers transactions to retained supplier.
**Validation rules:** code required max 32, name required max 255, tax/CCCD mode-specific requirement, email format, phone max 32, address max 500, Excel file max 20MB.
## 7. Feature Comparison Matrix
| Feature / Capability | Current UI | Reference UI | Reference Markdown | Status | Decision |
|---|---|---|---|---|---|
| Supplier list, search, pagination | Yes | Not provided | Yes | Missing in Reference UI | Implement |
| Summary cards | Yes | Not provided | Yes | Missing in Reference UI | Implement |
| Advanced filters | Partial | Not provided | Yes | Unclear | Need Confirmation |
| Rich create/update modal | Yes | Not provided | Yes | Missing in Reference UI | Implement |
| Stop/use supplier | Yes | Not provided | Yes | Missing in Reference UI | Implement |
| Delete with dependency check | Partial | Not provided | Yes | Missing in Reference UI | Implement |
| Detail ledger | Yes | Not provided | Supplemental only | UI Only | Need Confirmation |
| Import Excel | Yes | Not provided | Supplemental only | UI Only | Need Confirmation |
| Export Excel | Yes | Not provided | Yes | Missing in Reference UI | Implement |
| Update address | Yes | Not provided | Supplemental/config | UI Only | Need Confirmation |
| Merge suppliers | Not visible | Not provided | Yes | Mentioned in Docs Only | Need Confirmation |
| Clone supplier | Yes | Not provided | No | UI Only | Need Confirmation |
| Pay / create purchase voucher | Yes | Not provided | Config capability | UI Only | Need Confirmation |
| Permission prefix | `supplier.*` in config | - | `suppliers.*` in SCR | Conflict | Need Confirmation |
| Delete semantics | soft delete in config | - | hard/permanent wording in docs | Conflict | Need Confirmation |
## 8. Gap Analysis
### 8.1 Missing Features
| Feature | Found In | Missing From | Recommendation |
|---|---|---|---|
| Merge suppliers | Reference markdown | Current screenshot menu not visible | Keep as confirmable utility scope. |
| Dependency-list view after blocked delete | Reference markdown | Screenshot only shows simple confirmation | Include in API/UI design. |
### 8.2 Extra Features
| Feature | Found In | Risk | Recommendation |
|---|---|---|---|
| Clone supplier | Row menu screenshot | Backend/API scope unclear | Confirm before implementation. |
| Update address | Screenshot + config | External tax/address source unclear | Confirm trigger and API. |
| Pay / create purchase voucher | Screenshot + config | Cross-module route dependency | Implement only if target routes exist. |
### 8.3 Conflicting Features
| Topic | Conflict | Proposed Resolution |
|---|---|---|
| Permission prefix | `supplier.*` vs `suppliers.*` | Use config `supplier.*` unless user confirms otherwise. |
| Delete behavior | Config soft delete vs reference hard-delete wording | Use soft delete with transaction dependency guard. |
| Form scope | Rich MISA form vs simple SCR form | Design rich form; Phase 5 may phase implementation. |
### 8.4 Unclear Items
| ID | Question | Recommended Default | Blocking? |
|---|---|---|---|
| P1-Q1 | Which utilities are MVP: import, merge, clone, update address? | Core CRUD + export first; utilities can be phased. | No |
| P1-Q2 | Which permission prefix is canonical? | `supplier.*` from config. | No |
| P1-Q3 | Soft delete or hard delete? | Soft delete with dependency guard. | No |
| P1-Q4 | Exact filter fields and address-update trigger? | Filters by status/group/province; toolbar batch update. | No |
## 9. Confirmed Frontend Scope
| Feature | Include? | Reason |
|---|---|---|
| List/search/filter/sort/pagination | Yes | Core supplier directory workflow. |
| Summary cards | Yes | Visible first-viewport accounting signal. |
| Create/update rich modal | Yes | Present in screenshots and docs. |
| Delete with transaction guard | Yes | Config and docs require it. |
| Stop/use supplier | Yes | Required row action. |
| Export Excel | Yes | Config permission and docs. |
| Detail ledger | Need Confirmation | Visible but requires transaction API. |
| Import Excel | Need Confirmation | Large multi-step API surface. |
| Merge/clone/update address | Need Confirmation | Utility scope and backend behavior unclear. |
| Pay/create purchase voucher | Need Confirmation | Cross-module navigation dependency. |
## 10. Screen Layout
- Page shell: existing accounting navigation, page title, backlink to all categories, summary cards, toolbar, grid, and footer pagination.
- Toolbar: bulk actions and filters on the left; search, refresh/export/settings icons, update address, utilities, and add split button on the right.
- Grid: checkbox selection, code, name, address, debt, tax/CCCD, invoice risk, primary action, row menu; horizontal scroll allowed.
- Form: wide modal with supplier type selector, customer checkbox, main fields, tabs, and actions `Cất`, `Cất và Thêm`, `Hủy`.
- Detail: supplier list/sidebar plus right-side facts and transaction grid.
## 11. Component Design
| Component | Responsibility | Key Events |
|---|---|---|
| SupplierListPage | Own query state, permissions, selected supplier, dialogs | load, refetch, route actions |
| SupplierSummaryCards | Show overdue/payable/paid metrics | refresh summary |
| SupplierToolbar | Search, filters, export, utility/add actions | onSearch, onFilter, onAdd, onExport |
| SupplierGrid | Render rows, selection, sort, paging, row actions | onSelect, onSort, onPage, onRowAction |
| SupplierFormDialog | Create/update organization or individual supplier | onSave, onSaveAndAdd, onClose |
| SupplierDeleteDialog | Confirm delete and dependency-blocked state | onConfirm, onViewDependencies |
| SupplierAddressUpdateDialog | Preview and confirm address updates | onConfirm |
| SupplierImportWizard | File upload, mapping, validation, result | onImportComplete |
## 12. Frontend Data Model
- List item: id, supplierCode, supplierName, supplierType, taxCode, idNumber, phone, email, address, currentDebtAmount, invoiceRisk, isActive, isCustomer, updatedAt.
- Detail: list item fields plus contact info, legal representative, payment terms, bank accounts, other addresses, notes, internal flags, audit fields.
- Query params: keyword, status, groupId, provinceCode, period, pageIndex, pageSize, sortBy, sortDirection.
- Create/update request: supplier type, code/name or CCCD/name fields, optional tax/address/phone/email/group, customer/internal flags, tab data.
- Summary: overdueDebtAmount, totalPayableDebtAmount, paidLast30DaysAmount, calculatedAt.
- Enums: Organization/Individual, Active/Inactive, AddNew/Update import mode, row action types.
## 13. Updated Frontend API Needs
| UI Action | Required By | Method | Endpoint Draft | Notes |
|---|---|---|---|---|
| Load list | Current UI | GET | /api/v1/suppliers | Server paging/search/filter/sort. |
| Load summary | Current UI | GET | /api/v1/suppliers/summary | Summary cards. |
| Load detail | Current UI | GET | /api/v1/suppliers/{id} | Detail/form. |
| Load transactions | Current UI | GET | /api/v1/suppliers/{id}/transactions | Detail ledger. |
| Create/update | Current UI | POST/PUT | /api/v1/suppliers | Rich supplier payload. |
| Stop/use | Reference docs | PATCH | /api/v1/suppliers/{id}/status | Single row. |
| Delete/bulk delete | Business rule | DELETE/POST | /api/v1/suppliers/{id}, /bulk-delete | Dependency guard. |
| Export/import | Current UI | GET/POST | /api/v1/suppliers/export, /import | Import if confirmed. |
| Update address | Config/current UI | POST | /api/v1/suppliers/update-address | Preview and confirm. |
| Merge | Reference docs | POST | /api/v1/suppliers/merge | If confirmed. |
| Tax lookup | Reference docs | GET | /api/v1/taxpayers/{taxCode} | External dependency. |
## 14. State Management
- URL/query state: keyword, filters, pageIndex, pageSize, sortBy, sortDirection.
- UI state: selectedRows, active dialog, active supplier, import step, column visibility, loading/error flags.
- Server state: supplier list, summary, detail, transactions, lookup dictionaries; query keys include tenant id.
- Permission state: canView, canCreate, canUpdate, canDelete, canBulkDelete, canExport, canUpdateAddress, canPay, canCreatePurchaseVoucher.
## 15. User Interaction
| Flow | Expected Behavior |
|---|---|
| Load list | Check permission, load cards/list, show skeleton, retry on error. |
| Search/filter/sort/page | Update query, reset page when needed, refetch server data. |
| Add/edit | Open modal, validate inline, save, invalidate list/detail; `Cất và Thêm` resets form. |
| Delete | Confirm, call API, keep context and show dependency error if blocked. |
| Stop/use | Toggle status from row menu and refresh data. |
| Export | Download current filtered list. |
| Detail | Open supplier detail and transaction ledger. |
| Utilities | Import, merge, clone, update address depend on confirmation and API support. |
## 16. Validation Rules
| Field / Action | Rule | Message / Behavior |
|---|---|---|
| Supplier code | Required, max 32, unique per tenant | Inline error + API uniqueness message. |
| Supplier name | Required, max 255 | Inline error. |
| Tax code / CCCD | Mode-specific required; max 32 | Confirm exact wording. |
| Email | Valid format when present | `Email không hợp lệ`. |
| Phone | Max 32 | Inline error. |
| Address | Max 500 | Inline error. |
| Excel import | File required, max 20MB | Disable continue and show file error. |
## 17. Permission Rules
| Action | Permission | UI Behavior if Missing |
|---|---|---|
| View list | supplier.view | Deny page or redirect by app pattern. |
| Create | supplier.create | Hide add button. |
| Update | supplier.update | Hide edit action. |
| Delete | supplier.delete | Hide delete action. |
| Bulk delete | supplier.bulkDelete | Disable/hide bulk action. |
| Export | supplier.export | Hide export. |
| Update address | supplier.updateAddress | Hide update-address action. |
| Pay | supplier.pay | Hide pay row action. |
| Create purchase voucher | supplier.createPurchaseVoucher | Hide purchase-voucher action. |
## 18. Multi-tenant Rules
- Read tenant/company from tenant context or JWT/API context; never hard-code tenant id.
- Supplier code uniqueness is per tenant.
- React Query keys include tenant id and query params.
- Tenant changes clear selected rows and refetch supplier data.
## 19. Loading / Empty / Error States
| State | Component | Behavior |
|---|---|---|
| Loading | Grid/cards | Skeleton rows and muted cards. |
| Empty | Grid | Empty message with Add action if permitted. |
| Error | Grid/cards | Error alert and Retry. |
| No permission | Page | Permission denied or redirect. |
| Mutating | Dialog/actions | Disable submit, preserve entered data. |
## 20. Responsive Behavior
| Breakpoint | Behavior |
|---|---|
| Desktop | Full cards, toolbar, grid, and wide modal. |
| Tablet | Toolbar wraps; grid horizontal scroll. |
| Mobile | Hide low-priority columns; row actions collapse to menu. |
## 21. Frontend Decision Log
| # | Decision | Reason |
|---|---|---|
| 1 | Use screenshots in `images/` as visual source | No separate reference UI images exist. |
| 2 | Design rich MISA-style form | Screenshots and docs show organization/person modes and tabs. |
| 3 | Track utilities as confirmable scope | Import/merge/update-address/clone can expand backend and UX work. |
| 4 | Use config permissions for now | Config is the workflow source of truth. |
## 22. Acceptance Criteria
- [ ] User with `supplier.view` can see list, summary cards, search/filter/sort, and pagination.
- [ ] User without action permissions does not see restricted buttons or row actions.
- [ ] Create/update form supports organization and individual modes with validation.
- [ ] Delete requires confirmation and blocks suppliers with transactions.
- [ ] Export respects current filters.
- [ ] Tenant changes refetch data and do not leak rows across tenants.
## 23. Unclear / Incomplete Items
| ID | Item | Type | Required Before Next Phase? | Recommendation |
|---|---|---|---|---|
| P1-A1 | Config `folder: suppliers` differs from actual matched folder. | Assumption | No | Use `docs/features/danh-muc-nha-cung-cap`. |
| P1-M1 | `references/images/` is empty. | Missing Information | No | Use `images/` for Phase 2. |
| P1-Q1 | Confirm MVP utility scope. | User Question | No | Core CRUD + export first. |
| P1-Q2 | Confirm permission prefix. | User Question | No | Use `supplier.*`. |
| P1-Q3 | Confirm delete semantics. | User Question | No | Soft delete with dependency guard. |
| P1-Q4 | Confirm exact filters and address-update trigger. | User Question | No | Use conservative defaults. |
## 24. Definition of Done
- Current UI screenshots and markdown references were inspected.
- Feature matrix, gap analysis, scope, API needs, validation, permissions, and state design are documented.
- No source code was changed in Phase 1.
- Non-blocking unresolved items are tracked in `issues.md`.
