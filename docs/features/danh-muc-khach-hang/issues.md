# Issues: danh-muc-khach-hang

Feature: Danh mục khách hàng (`danh-muc-khach-hang`)
Last updated: 2026-06-04 (Phase 10 defects added)

## Open Issues

| ID | Phase | Type | Blocking? | Description | Status |
|----|-------|------|-----------|-------------|--------|
| P1-M1 | 1 | Missing Input | No | No reference UI images in `input/references/images/`. Current UI screenshots used as visual target. | Open |
| P1-Q1 | 1 | Unclear | Yes (Phase 2) | "M" column in customer list — field/purpose unknown. Must confirm before pixel analysis. | **Resolved 2026-06-03: Mã số thuế/CCCD chủ hộ** |
| B3-Q1 | 3 | Design | No | CustomerGroup: no entity exists — using denormalized `GroupName` string until `CustomerGroup` feature lands. | Open |
| B3-Q2 | 3 | Design | No | PaymentTerm: no entity exists — storing `PaymentTermId` (Guid?) + `PaymentTermName` (string?) as interim. | Open |
| B3-Q3 | 3 | Design | No | MST/CCCD lookup: contract defined. Whether it calls external tax API is an impl detail deferred to Phase 7. | Open |
| B3-Q4 | 3 | Design | No | SalesEmployee: no entity exists — storing `SalesEmployeeId` (Guid?) + `SalesEmployeeName` (string?) as interim. | Open |
| B10-D04 | 10 | Defect | No | Supplier `GetList_NoJwt_Returns401` same D02 pattern — returns 400 not 401. Out of Customer scope. | Open |

## Resolved Issues

| ID | Phase | Description | Resolution |
|----|-------|-------------|------------|
| B10-D01 | 10 | `CustomerListItemDto`/`CustomerDetailDto` fields `Code`/`Name` serialized as `code`/`name` — contract requires `customerCode`/`customerName`. Frontend broke. | **Fixed 2026-06-04**: Renamed to `CustomerCode`/`CustomerName`. |
| B10-D02 | 10 | `GetList_NoJwt_Returns401` test used anonymous client (no X-Tenant-Id) → tenant middleware returned 400. | **Fixed 2026-06-04**: Test uses `CreateClientWithTenantNoJwt()`. |
| B10-D03 | 10 | `GetById_CrossTenant_Returns404` test used random GUID tenant → 400 (not resolved). | **Fixed 2026-06-04**: Test creates real second tenant (Supplier pattern). |
| P1-Q2 | 1 | Permission rename: `customer.createPurchaseVoucher` → `customer.createSalesVoucher` | **Resolved 2026-06-03**: User confirmed rename. |
| P1-Q3 | 1 | "Tổng công ty/chi nhánh" flag in form? | **Resolved 2026-06-03**: Not in scope. |
| P1-Q4 | 1 | "Gộp khách hàng" (merge) in scope? | **Resolved 2026-06-03**: Not in scope. |
| P1-Q5 | 1 | "Cập nhật địa chỉ" in scope? | **Resolved 2026-06-03**: Not in scope. |
