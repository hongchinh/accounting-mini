# Frontend Basic Design: Danh mục khách hàng

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: Yes

---

# PART A - INPUT ANALYSIS

## A1. Input Sources

| Source | Path | Status |
|--------|------|--------|
| Current UI images | docs/features/danh-muc-khach-hang/input/images/ | Found: 11 |
| Reference UI images | docs/features/danh-muc-khach-hang/input/references/images/ | Missing |
| Reference markdown | docs/features/danh-muc-khach-hang/input/markdown/ | Found: 3 |

**Missing inputs:** No reference UI images. Current UI screenshots used as visual target. Non-blocking (recorded as issue P1-M1).

---

## A2. Current UI Analysis

### A2.1 Screens Identified

| Screen | File | Description |
|--------|------|-------------|
| Customer list | danh-muc-khach-hang-list.png | Title, summary cards, toolbar, search/filter, AG Grid, pagination |
| List with filter panel | danh-muc-khach-hang-list-lọc.png | Left sidebar: type, group, debt status, search-by, location cascade |
| Add — Tổ chức | danh-muc-khach-hang-add(tổ chức).png | Create modal: Tổ chức mode, main fields, Thông tin liên hệ tab |
| Add — Cá nhân | danh-muc-khach-hang-add(cá nhân).png | Create modal: Cá nhân mode, CCCD fields, Thông tin liên hệ tab |
| Edit — Tổ chức | danh-muc-khach-hang-edit(tổ chức).png | Edit modal with data filled in |
| Edit — Cá nhân | danh-muc-khach-hang-edit(cá nhân).png | Edit modal with data filled in |
| Edit — Điều khoản thanh toán | danh-muc-khach-hang-edit(cá nhân - điều khoản thanh toán).png | Payment terms tab: payment term, debt days, max debt, AR account 131 |
| Edit — Tài khoản ngân hàng | danh-muc-khach-hang-edit(cá nhân - tài khoản ngân hàng).png | Bank accounts tab: inline editable table |
| Edit — Địa chỉ khác | danh-muc-khach-hang-edit(cá nhân - địa chỉ).png | Alt address tab: location cascade + delivery address list |
| Edit — Ghi chú | danh-muc-khach-hang-edit(cá nhân - ghi chú).png | Notes tab: large textarea |
| Edit — Thông tin bổ sung | danh-muc-khach-hang-edit(cá nhân - thông tin bổ sung).png | 5 custom fields with editable labels |

### A2.2 Key Observations

**List screen:**
- Summary cards: 3 cards (Tổng công nợ, Phải thu — negative shown in parentheses, Trả trước)
- Toolbar: Thêm nhanh | Cập nhật địa chỉ | Tiện ích ▼ | Thêm
- Grid columns: Mã khách hàng, Tên khách hàng, Địa chỉ, Công nợ, M(?), Chức năng
- Row action: "Lập CT bán hàng" button + ⏷ dropdown menu
- Pagination: 20 rows/page default, 1,787 total rows shown

**Form modal (shared header):** "Thông tin khách hàng" + Tổ chức/Cá nhân radio + "Là nhà cung cấp" checkbox + ? / X

**Form — Tổ chức main fields:** Mã số thuế/CCCD chủ hộ (search), Mã ĐVQHNS, Mã khách hàng*, Điện thoại, Website, Tên khách hàng*, Nhóm khách hàng (+▼), Địa chỉ (textarea), Nhân viên bán hàng (+▼), Là Đối tượng nội bộ (checkbox)

**Form — Cá nhân main fields:** Số CCCD (search), Ngày cấp (date), Nơi cấp, Nhóm khách hàng (+▼), Mã khách hàng*, Mã số thuế, Nhân viên bán hàng (+▼), Tên khách hàng* (Xưng hô ▼ + Họ và tên), Là Đối tượng nội bộ (checkbox), Địa chỉ (textarea)

**Tab Thông tin liên hệ — Tổ chức:** Left: Người liên hệ (Xưng hô, Họ và tên, Email, SĐT, Đại diện theo PL); Right: Người nhận hóa đơn điện tử (Họ và tên, Email semicolon-separated, SĐT)

**Tab Thông tin liên hệ — Cá nhân:** Left: Thông tin liên hệ (Email, ĐT di động, ĐT cố định, Đại diện theo PL); Right: Sổ hộ chiếu

**Tab Điều khoản thanh toán:** Điều khoản thanh toán (+▼), Số ngày được nợ, Số nợ tối đa, Tài khoản công nợ phải thu (default: 131)

**Tab Tài khoản ngân hàng:** Inline table — Số tài khoản, Tên ngân hàng, Chi nhánh, Tỉnh/TP; buttons Thêm dòng / Xóa hết dòng

**Tab Địa chỉ khác:** Vị trí địa lý cascade (Country, Province, District, Ward) + Địa chỉ giao hàng (checkbox "Giống địa chỉ khách hàng", Thêm dòng / Xóa hết dòng)

**Tab Ghi chú:** Textarea

**Tab Thông tin bổ sung:** 5 editable-label text fields (Trường mở rộng 1–5)

**Footer:** Hủy | Cất | Cất và Thêm

### A2.3 Unclear Points

| Item | Why Unclear |
|------|-------------|
| "M" column header in list | Possibly status flag or default indicator — label not fully readable |
| Summary card exact labels | Partial readability; inferred from supplier pattern |
| Row ⏷ menu full content | Dropdown not expanded in screenshots |
| "Tiện ích" menu items | Collapsed; assumed: Xuất Excel + Gộp khách hàng |

---

## A3. Reference UI Analysis

No reference UI images available. Current UI screenshots serve as the visual target. Customer list UI follows the same design language as the supplier list (`danh-muc-nha-cung-cap`), confirmed from project patterns.

---

## A4. Reference Markdown Analysis

### A4.1 Documents Processed

| Document | Summary |
|----------|---------|
| khach-hang.md | View, add, edit, stop/use (individual only), delete, export Excel, customize grid; stopped customers hidden from document selectors and reports |
| khi-bao-khach-hang.md | Create Tổ chức/Cá nhân; "Là nhà cung cấp" syncs to supplier list; MST/CCCD lookup auto-fills; required fields: Mã + Tên; flags: Là đối tượng nội bộ, Tổng công ty/chi nhánh; 6 tabs |
| gop-khach-hang.md | Auto/manual merge by name/MST/phone/address; retained customer gets all transactions; duplicates deleted |

### A4.2 Business Rules Extracted

| Rule | Source | Impact on Design |
|------|--------|-----------------|
| Customer code unique per tenant | config | Validate uniqueness via API on blur/save |
| Cannot delete with transactions | khach-hang.md | Show error with transaction list on blocked delete |
| Stopped customers hidden from doc selectors | khach-hang.md | Backend filter; show Ngừng sử dụng badge in grid |
| "Là nhà cung cấp" checkbox syncs to supplier list | khi-bao-khach-hang.md | Saving with flag checked auto-creates supplier record |
| MST/CCCD lookup auto-fills customer data | khi-bao-khach-hang.md | Search icon triggers tax authority API lookup |
| Merge transfers all transactions to retained record | gop-khach-hang.md | Irreversible action — requires strong confirmation UX |
| Stop/use is individual only (no bulk) | khach-hang.md | No bulk stop-use in UI |

### A4.3 Validation Rules

| Field | Rule | Source |
|-------|------|--------|
| Mã khách hàng | Required, unique per tenant, max 32 | config + docs |
| Tên khách hàng | Required, max 255 | khi-bao-khach-hang.md |
| Email (contact) | Valid email format | Derived |
| Invoice recipient emails | Semicolon-separated, each valid email | UI (placeholder text) |
| Ngày cấp (Cá nhân) | Valid date, ≤ today | Derived |
| Số ngày được nợ | Non-negative integer | Derived |
| Số nợ tối đa | Non-negative decimal | Derived |

---

## A5. Feature Comparison Matrix

| Feature / Capability | Current UI | Reference Markdown | Status | Decision |
|----------------------|------------|--------------------|--------|----------|
| Customer list, search, pagination | Yes | Yes | Matched | Implement |
| Summary cards (debt metrics) | Yes | Implied | UI Only | Implement |
| Filter (type/group/debt/location) | Yes | Implied | Matched | Implement |
| Create — Tổ chức / Cá nhân | Yes | Yes | Matched | Implement |
| Update customer | Yes | Yes | Matched | Implement |
| Delete single | Yes | Yes | Matched | Implement |
| Bulk delete | Not visible | No | Config only | Implement |
| Stop/use (individual) | Implied | Yes | Matched | Implement |
| Export Excel | Yes (Tiện ích) | Yes | Matched | Implement |
| Update address | Yes (toolbar) | No | UI Only | Need Confirmation |
| Merge customers (auto/manual) | Not visible | Yes | Mentioned in Docs Only | Need Confirmation |
| Clone customer | Not visible | No | Not confirmed | No |
| Create sales voucher (row) | Yes | No | UI Only | Implement (from config) |
| Pay customer | Not visible | No | Config only | Need Confirmation |
| "Là nhà cung cấp" sync | Yes | Yes | Matched | Implement |
| MST/CCCD lookup | Yes | Yes | Matched | Implement |
| Payment terms tab | Yes | Yes | Matched | Implement |
| Bank accounts tab | Yes | Yes | Matched | Implement |
| Alt address tab | Yes | Yes | Matched | Implement |
| Custom fields (5) | Yes | No | UI Only | Implement |
| "Tổng công ty/chi nhánh" flag | No | Yes | Mentioned in Docs Only | Need Confirmation |
| Column customization | Implied | Yes | Matched | Later |

---

## A6. Gap Analysis

### A6.1 Missing Features

| Feature | Found In | Recommendation |
|---------|----------|----------------|
| Merge customers | Reference markdown only | Confirm scope; likely a separate utility dialog |
| "Tổng công ty/chi nhánh" flag | Docs only | Confirm before adding to form |
| Pay customer | Config only | Confirm target route in payment module |

### A6.2 Extra Features

| Feature | Found In | Recommendation |
|---------|----------|----------------|
| Update address | UI toolbar | Confirm external address data source (same as supplier?) |
| Create sales voucher | UI row + config | Route target must exist in sales module |

### A6.3 Conflicting Features

| Topic | Conflict | Proposed Resolution |
|-------|----------|---------------------|
| Permission naming | Config: `customer.createPurchaseVoucher`; UI: "Lập CT bán hàng" (sales voucher) | Rename to `customer.createSalesVoucher` — confirm with user |

### A6.4 Unclear Items — Open Questions

| # | Question | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------------------|------------------------------|
| Q1 | ~~"M" column in list — what field?~~ | — | **Resolved: "Mã số thuế/CCCD chủ hộ" — added to grid columns** | — |
| Q2 | ~~Rename customer.createPurchaseVoucher → customer.createSalesVoucher?~~ | — | **Resolved: Rename confirmed** | — |
| Q3 | ~~Include "Tổng công ty/chi nhánh" flag in form?~~ | — | **Resolved: Not in scope** | — |
| Q4 | ~~Include "Gộp khách hàng" in scope?~~ | — | **Resolved: Not in scope** | — |
| Q5 | ~~"Cập nhật địa chỉ" — same flow as supplier?~~ | — | **Resolved: Not in scope** | — |

---

## A7. Confirmed Frontend Scope

| Feature | Include? | Source |
|---------|----------|--------|
| List, search, filter, sort, pagination | Yes | All confirmed |
| Summary cards | Yes | UI |
| Create (Tổ chức + Cá nhân) | Yes | Confirmed |
| Update | Yes | Confirmed |
| Delete single (with transaction guard) | Yes | Docs |
| Bulk delete | Yes | Config permission |
| Stop/use (individual) | Yes | Docs |
| Export Excel | Yes | Docs + UI |
| "Là nhà cung cấp" sync | Yes | Docs + UI |
| MST/CCCD lookup | Yes | UI + Docs |
| All 6 form tabs | Yes | UI |
| Create sales voucher (row) | Yes | UI + config (permission renamed to createSalesVoucher) |
| Update address | No | User confirmed: not in scope |
| Pay customer | Need Confirmation | Config only |
| Merge customers | No | User confirmed: not in scope |
| "Tổng công ty/chi nhánh" flag | No | User confirmed: not in scope |
| Clone customer | No | Not in config capabilities |
| Column customization | Later | UX polish |

---

## A8. Updated Frontend API Needs

| UI Action | Required By | Method | Endpoint | Notes |
|-----------|-------------|--------|----------|-------|
| Load list | Current UI | GET | /api/v1/customers | page, pageSize, sortBy, sortDir, keyword, filters |
| Load summary cards | Current UI | GET | /api/v1/customers/summary | 3 debt metrics |
| Load detail | Current UI | GET | /api/v1/customers/{id} | for edit form |
| Create | Current UI | POST | /api/v1/customers | |
| Update | Current UI | PUT | /api/v1/customers/{id} | |
| Delete single | Current UI | DELETE | /api/v1/customers/{id} | 409 if has transactions |
| Bulk delete | Config | DELETE | /api/v1/customers | body: { ids: string[] } |
| Export Excel | Docs + UI | POST | /api/v1/customers/export | returns file stream |
| Update address | UI | PUT | /api/v1/customers/{id}/address | TBC |
| Create sales voucher | UI | POST | /api/v1/customers/{id}/sales-voucher | cross-module |
| Pay | Config | POST | /api/v1/customers/{id}/pay | TBC |
| MST/CCCD lookup | UI form | GET | /api/v1/customers/lookup | ?taxCode=… or ?cccd=… |
| Customer groups lookup | UI form | GET | /api/v1/customer-groups | for dropdown |
| Sales employees lookup | UI form | GET | /api/v1/employees | for dropdown |

---

## A9. Frontend Basic Design Decision Log

| # | Decision | Reason | Source |
|---|----------|--------|--------|
| D1 | Tổ chức/Cá nhân type toggle in form header | Both types visible in all screenshots | Current UI |
| D2 | Default receivable account: 131 | Visible in payment tab screenshot | Current UI |
| D3 | Stop/use is individual row action only (no bulk) | Explicitly stated in docs | Reference Markdown |
| D4 | Merge (Gộp khách hàng) excluded from scope | User confirmed: not in scope | User Confirmation |
| D5 | Permission rename: customer.createPurchaseVoucher → customer.createSalesVoucher | User confirmed; UI shows "Lập CT bán hàng" — customers generate sales vouchers | User Confirmation |
| D6 | Negative debt displayed in red/parentheses | Visible pattern in summary card + consistent with supplier feature | Current UI |
| D7 | "Tổng công ty/chi nhánh" flag excluded from form | User confirmed: not in scope | User Confirmation |
| D8 | "Cập nhật địa chỉ" excluded from scope | User confirmed: not in scope | User Confirmation |

---

# PART B - FRONTEND DESIGN

## 1. Overview

### 1.1 Purpose
Quản lý danh mục khách hàng: xem danh sách, khai báo, sửa, xóa, ngừng sử dụng, theo dõi công nợ phải thu, xuất Excel.

### 1.2 Business Context
Khách hàng là đối tượng trung tâm trong nghiệp vụ bán hàng và kế toán công nợ phải thu (tài khoản 131). Mỗi khách hàng thuộc về một tenant; mã khách hàng phải duy nhất trong tenant.

### 1.3 Target Users
Kế toán viên, nhân viên bán hàng, quản trị hệ thống.

### 1.4 Related Screens
- `/categories/suppliers` — danh mục nhà cung cấp (same pattern, reference implementation)
- `/sales/*` — mục tiêu điều hướng cho "Lập CT bán hàng"

---

## 2. Screen Layout

### 2.1 Page Structure
```
[Breadcrumb: Danh mục / Khách hàng]
[Summary Cards Row: Tổng công nợ | Phải thu | Trả trước]
[Toolbar: Cập nhật địa chỉ | Tiện ích ▼ | Thêm]
[Search Bar: keyword input | Lọc toggle]
[Content: Filter Panel (left, collapsible) + AG Grid (main)]
[CustomerFormDialog (modal — create / edit)]
[DeleteConfirmDialog]
```

### 2.2 Toolbar Area
| Button | Permission | Behavior |
|--------|------------|----------|
| Cập nhật địa chỉ | customer.updateAddress | Opens address update flow |
| Tiện ích ▼ | — | Dropdown: Xuất Excel (customer.export), Gộp KH (TBC) |
| Thêm | customer.create | Opens CustomerFormDialog (create mode) |

### 2.3 Filter Area
Collapsible left panel (toggled by "Lọc" button):
- **Loại**: Tất cả / Tổ chức / Cá nhân
- **Nhóm**: Customer group picker (search + select)
- **Tình trạng công nợ**: Tất cả / Có nợ / Không nợ
- **Tìm theo** dropdown: Tên / Mã khách hàng / ĐVQHNS / Địa chỉ / Tỉnh TP
- **Vị trí**: Quận/Huyện, Xã/Phường cascades
- **Đặt lại** button clears all filters

### 2.4 Data Grid / Table
AG Grid, server-side pagination.

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| Mã khách hàng | customerCode | Yes | |
| Tên khách hàng | customerName | Yes | |
| Địa chỉ | address | No | |
| Công nợ | currentDebtAmount | Yes | Negative = red |
| Mã số thuế/CCCD chủ hộ | taxCode | No | Confirmed from list screenshot |
| Nhóm | customerGroupName | No | |
| Ngừng sử dụng | isActive | No | Badge/checkbox indicator |
| Chức năng | — | No | "Lập CT bán hàng" button + ⏷ menu |

Row ⏷ menu: Xem, Sửa, Xóa, Ngừng sử dụng / Sử dụng

### 2.5 Summary Cards
| Card | Metric | Color |
|------|--------|-------|
| Tổng công nợ | totalDebt | neutral |
| Phải thu | totalReceivable | red if > 0 |
| Trả trước | totalAdvancePayment | green |

### 2.6 Detail / Form Dialog
Wide modal `CustomerFormDialog` — shared for create and edit.

**Header row:** "Thông tin khách hàng" | ◉ Tổ chức ○ Cá nhân | ☐ Là nhà cung cấp | ? | ×

**Main fields — Tổ chức:**
Row 1: Mã số thuế/CCCD chủ hộ (🔍), Mã ĐVQHNS, Mã khách hàng*, Điện thoại, Website
Row 2: Tên khách hàng*
Row 3: Địa chỉ (textarea) | Nhóm khách hàng (+▼) / Nhân viên bán hàng (+▼) / ☐ Là Đối tượng nội bộ

**Main fields — Cá nhân:**
Row 1: Số CCCD (🔍), Ngày cấp (date), Nơi cấp | Nhóm khách hàng (+▼)
Row 2: Mã khách hàng*, Mã số thuế | Nhân viên bán hàng (+▼)
Row 3: Tên khách hàng* (Xưng hô ▼ + Họ và tên) | ☐ Là Đối tượng nội bộ
Row 4: Địa chỉ (textarea)

**Tabs:** Thông tin liên hệ | Điều khoản thanh toán | Tài khoản ngân hàng | Địa chỉ khác | Ghi chú | Thông tin bổ sung

**Tab content:**

_Thông tin liên hệ — Tổ chức:_
- Left: Xưng hô ▼, Họ và tên, Email, SĐT, Đại diện theo PL
- Right (Người nhận HĐ điện tử): Họ và tên, Email (;-separated), SĐT

_Thông tin liên hệ — Cá nhân:_
- Left: Email, ĐT di động, ĐT cố định, Đại diện theo PL
- Right: Sổ hộ chiếu

_Điều khoản thanh toán:_
Điều khoản thanh toán (+▼), Số ngày được nợ, Số nợ tối đa, Tài khoản công nợ phải thu (default: 131 ▼)

_Tài khoản ngân hàng:_
Inline editable table: Số tài khoản | Tên ngân hàng | Chi nhánh | Tỉnh/TP ngân hàng | 🗑
Buttons: Thêm dòng / Xóa hết dòng

_Địa chỉ khác:_
Vị trí địa lý: Country ▼, Province ▼, District ▼, Ward ▼
Địa chỉ giao hàng: ☐ Giống địa chỉ khách hàng + Thêm dòng / Xóa hết dòng

_Ghi chú:_ Textarea

_Thông tin bổ sung:_ 5 rows of [✏ Editable label | Text input]

**Footer:** Hủy | Cất | Cất và Thêm

### 2.7 Pagination
Server-side. Default: 100 rows/page. Options: 20, 50, 100, 500.

### 2.8 Notifications / Toast
| Event | Message |
|-------|---------|
| Create success | "Thêm khách hàng thành công" |
| Update success | "Cập nhật khách hàng thành công" |
| Delete success | "Xóa khách hàng thành công" |
| Delete blocked | "Khách hàng [Mã] đã có phát sinh. Xóa các phát sinh liên quan trước khi xóa." |
| Stop success | "Ngừng sử dụng khách hàng thành công" |

---

## 3. Component Design

### 3.1 Component Tree
```
CustomerPage
├── CustomerSummaryCards
├── CustomerToolbar
│   └── UtilitiesMenu (Xuất Excel, ...)
├── CustomerFilterPanel (collapsible)
├── CustomerGrid (AG Grid)
│   ├── CustomerRowActions (⏷ menu)
│   └── BulkActionBar (when rows selected)
├── CustomerFormDialog
│   ├── CustomerTypeToggle (Tổ chức / Cá nhân)
│   ├── OrgMainFields / IndividualMainFields
│   └── CustomerFormTabs
│       ├── ContactTab (type-aware)
│       ├── PaymentTermsTab
│       ├── BankAccountsTab (inline editable table)
│       ├── AlternativeAddressTab (location cascade + address rows)
│       ├── NotesTab
│       └── CustomFieldsTab (5 editable-label rows)
└── DeleteConfirmDialog
```

### 3.2 Component Responsibilities

| Component | Props | Key behavior |
|-----------|-------|-------------|
| CustomerPage | — | URL state, query sync, route entry |
| CustomerSummaryCards | summary: CustomerSummary | Render 3 metric cards |
| CustomerGrid | query, onEdit, onDelete | AG Grid, server-side, row selection |
| CustomerFormDialog | mode, customerId, onClose | Create/edit modal, type-aware field switch |
| BankAccountsTab | value, onChange | Add/remove/edit bank account rows inline |
| AlternativeAddressTab | value, onChange | Location cascade + delivery address rows |
| CustomFieldsTab | value, onChange | 5 editable-label custom fields |

---

## 4. Frontend Data Model (TypeScript)

### 4.1 List Item Type
```typescript
interface CustomerListItem {
  id: string
  customerCode: string
  customerName: string
  address?: string
  currentDebtAmount: number
  isActive: boolean
  customerType: 'organization' | 'individual'
  updatedAt: string
}
```

### 4.2 Detail Type
```typescript
interface CustomerDetail {
  id: string
  customerType: 'organization' | 'individual'
  customerCode: string
  customerName: string
  salutation?: string
  // Organization
  taxCode?: string
  budgetUnitCode?: string
  phoneNumber?: string
  website?: string
  // Individual
  cccd?: string
  cccdIssueDate?: string
  cccdIssuePlace?: string
  // Shared
  address?: string
  customerGroupId?: string
  customerGroupName?: string
  salesEmployeeId?: string
  salesEmployeeName?: string
  isInternalEntity: boolean
  isSupplier: boolean
  isHeadquarterOrBranch?: boolean  // TBC — Q3
  isActive: boolean
  // Contact — Org
  contactSalutation?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  legalRepresentative?: string
  invoiceRecipientName?: string
  invoiceRecipientEmails?: string  // semicolon-separated
  invoiceRecipientPhone?: string
  // Contact — Individual
  mobilePhone?: string
  officePhone?: string
  passportNumber?: string
  // Payment terms
  paymentTermId?: string
  debtDays?: number
  maxDebt?: number
  receivableAccountCode: string  // default '131'
  // Sub-collections
  bankAccounts: CustomerBankAccount[]
  alternativeAddresses: CustomerAlternativeAddress[]
  notes?: string
  customField1Label?: string; customField1Value?: string
  customField2Label?: string; customField2Value?: string
  customField3Label?: string; customField3Value?: string
  customField4Label?: string; customField4Value?: string
  customField5Label?: string; customField5Value?: string
  createdAt: string
  updatedAt: string
}

interface CustomerBankAccount {
  id?: string
  accountNumber: string
  bankName: string
  bankBranch?: string
  bankProvince?: string
}

interface CustomerAlternativeAddress {
  id?: string
  countryCode?: string
  provinceCode?: string
  districtCode?: string
  wardCode?: string
  deliveryAddress?: string
  sameAsCustomer: boolean
}
```

### 4.3 Query Params
```typescript
interface CustomerListQuery {
  keyword?: string
  page: number
  pageSize: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  customerType?: 'organization' | 'individual'
  groupId?: string
  debtStatus?: 'all' | 'has_debt' | 'no_debt'
  provinceCode?: string
  districtCode?: string
  wardCode?: string
  isActive?: boolean
}
```

### 4.4 Create/Update Request
```typescript
type SaveCustomerRequest = Omit<CustomerDetail,
  'id' | 'customerGroupName' | 'salesEmployeeName' | 'isActive' | 'createdAt' | 'updatedAt'
>
```

### 4.5 Summary Type
```typescript
interface CustomerSummary {
  totalDebt: number
  totalReceivable: number
  totalAdvancePayment: number
}
```

### 4.6 Enum Types
```typescript
type CustomerType = 'organization' | 'individual'
type DebtStatus = 'all' | 'has_debt' | 'no_debt'
```

---

## 5. Frontend API Needs (Final)

See A8 for full table. Key endpoints:
- `GET /api/v1/customers` — list with filters/pagination
- `GET /api/v1/customers/summary` — summary cards
- `GET /api/v1/customers/{id}` — detail for edit
- `POST /api/v1/customers` — create
- `PUT /api/v1/customers/{id}` — update
- `DELETE /api/v1/customers/{id}` — delete (409 if transactions exist)
- `DELETE /api/v1/customers` — bulk delete `{ ids[] }`
- `POST /api/v1/customers/export` — export Excel

---

## 6. State Management

### 6.1 URL / Query State
`keyword`, `page`, `pageSize`, `sortBy`, `sortDir`, `customerType`, `groupId`, `debtStatus`, `provinceCode`, `districtCode`, `wardCode`

### 6.2 UI State
`selectedRowIds[]`, `isFilterOpen`, `formMode: 'create'|'edit'|null`, `editingCustomerId`, `isDeleteConfirmOpen`, `deletingIds[]`

### 6.3 Server State (React Query)
- `useCustomerList(query)` — invalidated on create/update/delete
- `useCustomerDetail(id)` — fetched on form open in edit mode
- `useCustomerSummary()` — summary cards

### 6.4 Permission State
`canCreate`, `canUpdate`, `canDelete`, `canBulkDelete`, `canExport`, `canUpdateAddress`, `canPay`, `canCreateSalesVoucher`

---

## 7. User Interaction

| Flow | Steps |
|------|-------|
| Load list | Mount → fetch list + summary → render grid + cards |
| Search | Type in keyword → debounce 300ms → refetch list |
| Filter | Toggle filter panel → change filter values → refetch list |
| Sort | Click column header → update sortBy/sortDir → refetch |
| Paginate | Change page/pageSize → refetch |
| Add | Click Thêm → open dialog (create mode, auto-code) → fill → Cất |
| Edit | Row ⏷ > Sửa → fetch detail → open dialog (edit mode) → save |
| Delete | Row ⏷ > Xóa → confirm → DELETE → if 409: show error; else toast + refresh |
| Bulk delete | Select rows → BulkActionBar > Xóa → confirm → DELETE batch |
| Stop/use | Row ⏷ > Ngừng sử dụng → toggle isActive → refresh row |
| Export | Tiện ích > Xuất Excel → POST export → browser download |
| Create sales voucher | Row "Lập CT bán hàng" → navigate to sales module |

---

## 8. Validation Rules (Frontend)

| Field | Rule | Message |
|-------|------|---------|
| Mã khách hàng | Required, max 32 chars | "Mã khách hàng không được để trống" |
| Tên khách hàng | Required, max 255 chars | "Tên khách hàng không được để trống" |
| Email (contact) | Valid email if filled | "Email không hợp lệ" |
| Invoice recipient emails | Each semicolon-part valid email | "Email hóa đơn điện tử không hợp lệ" |
| Ngày cấp CCCD | Valid date, not future | "Ngày cấp không hợp lệ" |
| Số ngày được nợ | Non-negative integer | "Giá trị không hợp lệ" |
| Số nợ tối đa | Non-negative decimal | "Giá trị không hợp lệ" |

---

## 9. Permission Rules

| Action | Permission | UI if Missing |
|--------|------------|---------------|
| View list | customer.view | Redirect / hide menu item |
| Create | customer.create | Hide Thêm button |
| Edit | customer.update | Hide Sửa in row menu |
| Delete | customer.delete | Hide Xóa in row menu |
| Bulk delete | customer.bulkDelete | Disable bulk action bar |
| Export | customer.export | Hide Xuất Excel |
| Update address | customer.updateAddress | Hide Cập nhật địa chỉ button |
| Pay | customer.pay | Hide pay action |
| Create sales voucher | customer.createSalesVoucher | Hide "Lập CT bán hàng" |

---

## 10. Multi-tenant Rules
- Read `tenantId` from tenant context. Never hard-code.
- React Query keys include tenantId: `['customers', tenantId, query]`
- X-Tenant-Id header sent automatically by Axios interceptor.
- Reload data when active tenant changes.

---

## 11. Loading / Empty / Error States

| State | Component | Behavior |
|-------|-----------|----------|
| Loading list | AG Grid skeleton | Skeleton rows during fetch |
| Empty list | EmptyState | "Chưa có khách hàng nào. Nhấn Thêm để khai báo." |
| Error list | ErrorAlert | Error message + Retry button |
| Loading form detail | Dialog spinner | Spinner while fetching detail |
| No permission | PermissionDenied | Access denied message |

---

## 12. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| ≥1280px | Full layout: collapsible left filter + grid |
| <1280px | Filter opens as drawer/dialog overlay |
| <768px | Grid scrolls horizontally; form fields stack vertically |

---

## 13. Acceptance Criteria
- [ ] Customer list loads with search, filter, sort, server-side pagination
- [ ] Summary cards display correct debt metrics
- [ ] Create works for both Tổ chức and Cá nhân with all 6 tabs
- [ ] Edit loads existing data and updates correctly
- [ ] "Là nhà cung cấp" checkbox syncs customer to supplier list
- [ ] MST/CCCD lookup auto-populates form fields
- [ ] Delete blocked when customer has transactions; shows transaction list link
- [ ] Bulk delete works for selected rows
- [ ] Export downloads valid Excel file
- [ ] Stop/use toggles customer active status
- [ ] All permissions control corresponding UI elements
- [ ] Multi-tenant isolation: data scoped to active tenant

---

## 14. Open Questions

| # | Question | Options | Recommended Default | Must Resolve Before Phase 2? |
|---|----------|---------|---------------------|------------------------------|
| Q1 | "M" column in list — what field does it represent? | Status badge / Mặc định / unknown | Exclude until confirmed | **Yes — OPEN** |
| Q2 | ~~Rename customer.createPurchaseVoucher → customer.createSalesVoucher?~~ | — | **Resolved: Rename confirmed** | — |
| Q3 | ~~Include "Tổng công ty/chi nhánh" flag in form?~~ | — | **Resolved: Not in scope** | — |
| Q4 | ~~Include "Gộp khách hàng" in scope?~~ | — | **Resolved: Not in scope** | — |
| Q5 | ~~"Cập nhật địa chỉ" — same flow as supplier?~~ | — | **Resolved: Not in scope** | — |
