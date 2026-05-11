# Supplier Management — Business Rules & Use Cases

Feature key: `danh-muc-nha-cung-cap`

## Use Cases

| ID | Actor | Action |
|----|-------|--------|
| SUP-01 | User with `supplier.view` | View paginated supplier list with search, filter, sort |
| SUP-02 | User with `supplier.create` | Create a new supplier (organization or individual) |
| SUP-03 | User with `supplier.update` | Update supplier details (name, contact, bank, address) |
| SUP-04 | User with `supplier.delete` | Soft-delete a supplier |
| SUP-05 | User with `supplier.bulkDelete` | Delete multiple suppliers at once |
| SUP-06 | User with `supplier.export` | Export supplier list to Excel |
| SUP-07 | User with `supplier.updateAddress` | Bulk-update address for selected suppliers |
| SUP-08 | User with `supplier.view` | Toggle supplier active/inactive status |
| SUP-09 | User with `supplier.createPurchaseVoucher` | Navigate to create a purchase voucher for a supplier |

## Business Rules

| Rule | Detail |
|------|--------|
| Code uniqueness | `supplier.code` must be unique per tenant |
| Soft delete | Deleted suppliers are hidden (not physically removed) |
| No delete with transactions | Cannot delete a supplier that has associated accounting transactions |
| Tenant isolation | Suppliers are fully isolated — a user in tenant A cannot see tenant B's suppliers |
| Negative debt | `currentDebtAmount` can be negative (credit balance); display with sign |
| Inactive suppliers | Inactive suppliers remain visible but are flagged; filtering available |

## Supplier Data Fields

| Field | Required | Notes |
|-------|----------|-------|
| `code` | Yes | Max 50 chars; unique per tenant |
| `name` | Yes | Max 200 chars |
| `taxCode` | No | Vietnamese tax identification |
| `email` | No | Contact email |
| `phone` | No | Contact phone |
| `address` | No | Physical address |
| `bankAccount` | No | Bank account number |
| `isActive` | Auto | Defaults to true |
| `currentDebtAmount` | Computed | Outstanding payable; maintained by transaction engine |

## List Query Capabilities

- **Search**: across `code`, `name`, `taxCode`, `phone`, `email`, `address`
- **Filter**: by `isActive` (active / inactive / all)
- **Sort**: by `code`, `name`, `currentDebtAmount`, `updatedAt`, `createdAt`
- **Pagination**: page-based, default 100 rows, max 500

## API Endpoints

| Method | Path | Permission |
|--------|------|-----------|
| GET | `/api/suppliers` | `supplier.view` |
| GET | `/api/suppliers/{id}` | `supplier.view` |
| POST | `/api/suppliers` | `supplier.create` |
| PUT | `/api/suppliers/{id}` | `supplier.update` |
| DELETE | `/api/suppliers/{id}` | `supplier.delete` |
| POST | `/api/suppliers/bulk-delete` | `supplier.bulkDelete` |
| POST | `/api/suppliers/bulk-update-address` | `supplier.updateAddress` |
| POST | `/api/suppliers/{id}/toggle-active` | `supplier.update` |
| POST | `/api/suppliers/{id}/clone` | `supplier.create` |
| GET | `/api/suppliers/export` | `supplier.export` |

## Reference UI

Designed with MISA Accounting as the UX reference. Key screens:
- List page with toolbar (search, filter bar, action buttons)
- Create/Edit dialog (not a separate page)
- Detail page showing full info + debt summary
- Bulk address confirmation dialog

Screenshots and Figma-style references in `docs/features/danh-muc-nha-cung-cap/references/images/`.
