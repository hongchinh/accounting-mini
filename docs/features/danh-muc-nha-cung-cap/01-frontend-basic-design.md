# Frontend Basic Design: Danh mục nhà cung cấp

## Phase Status
Status: Completed
Blocking Issues: No
User Confirmation Required: No

---

## 1. Feature Config Summary
- feature: `danh-muc-nha-cung-cap` | folder: `danh-muc-nha-cung-cap` | mode: `full` | level: `standard`
- entity: `Supplier` | backend: `accounting_api` | frontend: `accounting_web`
- permissions (from config): `supplier.view/create/update/delete/export/updateAddress/createPurchaseVoucher` (bulkDelete và pay: không implement phase này)

> **Resolved P1-C1:** Permission prefix = `supplier.` singular — per config & CLAUDE.md. Migrate existing `suppliers.` code.

## 2. Input Sources

| Source | Path | Status |
|---|---|---|
| Current UI image | images/danhmuc_nhacungcap_list.png | Found (1 file) — MISA reference screenshot |
| Reference UI images | references/images/ | Found (8 files) — MISA forms, actions, dialogs |
| Reference markdown | references/markdown/ | Found (3 files) — nha-cung-cap.md, khai-bao-nha-cung-cap.md, gop-nha-cung-cap.md |
| Previous analysis | 01-frontend-basic-design-old.md | Found — detailed prior analysis |

## 3. Missing Inputs
- `actual/` folder: empty (Phase 9 input — not needed yet)
- No AccountingMini-specific current UI design; `images/` contains MISA reference screenshot

## 4. Current UI Analysis (danhmuc_nhacungcap_list.png)
Màn hình danh sách NCC của MISA (tham khảo):
- **Metric cards** (top): 3 thẻ — giá trị 0.0, 4.020.240.692,6, 7.132.214.273,0 (Tổng nợ phải trả / Tổng mua hàng)
- **Toolbar**: Tìm kiếm, Date picker (kỳ), Page size 100, nút Thêm, Tiện ích ▼
- **Grid columns**: Mã NCC, Tên NCC, Địa chỉ, SĐT, Số TK NH/CCCD, **Nợ** (đỏ khi âm), Nợ cũ, Lập CT mua hàng, Chức năng ▼
- **Pagination**: Tổng số 365 bản ghi, prev/next, page size selector

## 5. Reference UI Analysis (8 reference images)
- `danhmuc_nhacungcap_list.png` — Full MISA app: sidebar, metric cards, toolbar, AG Grid 9 cột
- `danhmuc_nhacungcap_list_menu_chucnang.png` — Row action dropdown: Sửa / Nhân bản / Ngừng sử dụng / Xóa
- `danhmuc_nhacungcap_them_tochuc.png` — Form dialog: tab Tổ chức (MST, Lấy thông tin, Tên, Nhóm NCC, Địa chỉ, ĐT, sub-tabs)
- `danhmuc_nhacungcap_them_canhan.png` — Form dialog: tab Cá nhân (CCCD, Họ tên, MST, Nhóm mua hàng)
- `danhmuc_nhacungcap_detail.png` — Detail page: left panel list + right panel (info + Chi tiết/Công nợ tabs)
- `danhmuc_nhacungcap_xoa.png` — Delete confirm dialog: "Bạn có chắc là xóa nhà cung cấp … không?"
- `danhmuc_nhacungcap_xacnhandiachiNCC.png` — Bulk address update confirmation dialog
- `danhmuc_nhacungcap_import_excel.png` — Import wizard 4-step

## 6. Reference Markdown Analysis
- **nha-cung-cap.md**: Tổng quan — tạo mới, sửa, ngừng sử dụng, xóa (block nếu có phát sinh), xuất Excel
- **khai-bao-nha-cung-cap.md**: Tổ chức/Cá nhân tabs, "Là khách hàng" → đồng bộ KH, MST lookup (Lấy thông tin), Là đối tượng nội bộ, Tổng công ty/chi nhánh
- **gop-nha-cung-cap.md**: Gộp NCC tự động (theo tên/MST/SĐT/địa chỉ) + thủ công (bulk select) — irreversible

## 7. Feature Comparison Matrix

| Feature / Capability | Current UI | Ref UI | Ref Markdown | Status | Decision |
|---|---|---|---|---|---|
| List AG Grid + pagination | ✓ | ✓ | ✓ | Matched | Implement |
| Search by name/code | ✓ | ✓ | ✓ | Matched | Implement |
| Create supplier (dialog) | ✓ | ✓ | ✓ | Matched | Implement |
| Edit supplier | – | ✓ | ✓ | Missing in Current UI | Implement |
| Delete supplier + check phát sinh | – | ✓ | ✓ | Missing in Current UI | Implement (+Xem phát sinh UX on 409) |
| Toggle active/inactive | – | ✓ | ✓ | Missing in Current UI | Implement |
| Row action dropdown ▼ | ✓ | ✓ | ✓ | Matched | Implement |
| Export to Excel | – | ✓ | ✓ | Missing in Current UI | Implement |
| Metric cards (3 thẻ) | ✓ | ✓ | ✓ | Matched | Do Not Implement |
| Tổ chức / Cá nhân type | – | ✓ | ✓ | Missing in Current UI | Defer |
| Supplier detail page | – | ✓ | ✓ | Missing in Current UI | Implement (basic) |
| Bulk delete | – | – | ✓ | Config capability | Do Not Implement |
| Nhân bản (Clone) | – | ✓ | – | Missing in Current UI | Implement |
| Filter isActive dropdown | – | ✓ | – | Missing in Current UI | Implement |
| Bank account (form field) | – | – | ✓ | Docs only | Implement (form only, not grid) |
| "Là khách hàng" sync KH | – | ✓ | ✓ | Missing | Defer |
| supplier-pay | – | – | – | Config capability | Do Not Implement (textlink only) |
| supplier-updateAddress | – | ✓ | – | Config capability | Implement (bulk dialog) |
| Cột Nợ (currentDebtAmount) | ✓ | ✓ | – | Matched | Implement |
| Cột Nợ cũ (previousDebtAmount) | ✓ | ✓ | – | Matched | Defer |
| Negative debt display | ✓ | ✓ | – | Matched | Implement (config: negative-debt-display) |
| "Lập CT mua hàng" | ✓ | ✓ | – | Matched | Implement (textlink column) |
| Import Excel (wizard) | – | ✓ | ✓ | Missing | Defer |
| Merge suppliers | – | ✓ | ✓ | Missing | Defer |
| MST lookup API | – | ✓ | ✓ | Missing | Defer |
| Permission-based UI | – | – | ✓ | Docs only | Implement |

## 8. Gap Analysis

### 8.1 Missing Features (trong scope)
- Edit, Delete, Toggle active/inactive — cần implement dialog/confirm
- Export to Excel — cần permission `supplier.export` và endpoint
- Supplier detail page `/categories/suppliers/{id}` — basic info only

### 8.2 Conflicting Features
- P1-C1: Permission prefix `suppliers.` (plural, existing code) vs `supplier.` (singular, config & CLAUDE.md)
- P1-C2: Config capabilities `supplier-pay`, `supplier-purchase-voucher` vs MISA reference shows "Lập CT mua hàng" as a simple textlink

### 8.3 Resolved Items
- P1-U1: Bulk delete → **không hỗ trợ** — Do Not Implement (no bulk select, no bulk delete)
- P1-U2: `supplier-updateAddress` → **bulk dialog** — Implement "Xác nhận địa chỉ NCC" bulk confirmation dialog
- P1-C1: Permission prefix → **`supplier.`** singular confirmed
- P1-C2: `supplier-pay` → **textlink** "Lập CT mua hàng" column in grid, hidden when no `supplier.createPurchaseVoucher`
- P1-Q1: Metric cards → **No** — không implement phase này

## 9. Confirmed Frontend Scope

**In scope (confirmed):**
- List + search + pagination + page size selector
- isActive filter dropdown trong Toolbar (Tất cả / Đang sử dụng / Ngừng sử dụng; default: Đang sử dụng)
- Create / Edit / Clone supplier (shared dialog — Clone prefills từ NCC gốc, sinh Mã mới)
- Delete supplier with confirm + block nếu có phát sinh (409 → error state + nút "Xem phát sinh")
- Toggle active/inactive (Ngừng sử dụng / Sử dụng)
- Row action dropdown ▼ (Sửa, Nhân bản, Ngừng/Sử dụng, Xóa)
- "Cất và Thêm" button
- Export to Excel (theo search/filter/isActive hiện tại)
- Supplier detail page (basic info)
- Permission-based UI (hide actions without permission)
- Loading / empty / error states
- Negative debt display — cột Nợ (currentDebtAmount, đỏ khi âm)
- "Lập CT mua hàng" textlink column (hidden khi không có `supplier.createPurchaseVoucher`)
- Bulk address update dialog "Xác nhận địa chỉ NCC" (requires `supplier.updateAddress`)
- `bankAccount` field trong SupplierForm (optional, không hiển thị cột trong grid)

**Do Not Implement (confirmed):** Metric cards, Bulk delete

**Defer:** Import Excel, Merge suppliers, MST lookup, Tổ chức/Cá nhân type, "Là khách hàng" sync KH, Cột Nợ cũ (previousDebtAmount), Transaction history tab, Công nợ tab

## 10. Screen Layout

```
/categories/suppliers — SupplierListPage
├── PermissionGuard (requires supplier.view)
├── PageHeader: "Nhà cung cấp"
├── Toolbar (Card): Search input (debounce 300ms) + isActive dropdown (Tất cả/Đang dùng/Ngừng) + [Export dropdown ▼] + Thêm button
├── DataGrid (Card): SupplierTable with SupplierRowActions ▼ per row
├── PaginationBar: page info + page size selector + prev/next
└── Dialogs: SupplierFormDialog (create+edit) + DeleteConfirmDialog + BulkAddressConfirmDialog

/categories/suppliers/{id} — SupplierDetailPage
├── Back button + supplier name header + action buttons (Sửa, Ngừng/Sử dụng, Xóa)
└── Info card: code, taxCode, email, phone, address, isActive badge
```

## 11. Component Design

| Component | Responsibility |
|---|---|
| SupplierListPage | Page state orchestration (search, page, modals) |
| SupplierTable | DataGrid with column definitions |
| SupplierRowActions | Per-row ▼ dropdown: Sửa / Nhân bản / Ngừng/Sử dụng / Xóa |
| SupplierFormDialog | Dialog wrapper (create + edit mode) |
| SupplierForm | RHF + Zod form |
| DeleteConfirmDialog | Confirm dialog showing supplier name |
| BulkAddressConfirmDialog | Bulk address update confirmation dialog (Xác nhận địa chỉ NCC) |
| SupplierDetailPage | Static info card |

## 12. Frontend Data Model

```typescript
interface SupplierListItem {
  id: string;
  code: string;          // max 32
  name: string;          // max 255
  taxCode?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  currentDebtAmount?: number | null;  // config: sortable + negative-debt-display
}

interface SupplierDetail extends SupplierListItem {
  bankAccount?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SupplierListQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'code' | 'name' | 'currentDebtAmount' | 'updatedAt' | 'createdAt';
  sortDir?: 'asc' | 'desc';
}
```

## 13. Updated Frontend API Needs

| Action | Method | Endpoint | Notes |
|---|---|---|---|
| List | GET | /api/v1/suppliers | PageResult\<SupplierListItem\> — accepts `isActive` filter |
| Detail | GET | /api/v1/suppliers/{id} | SupplierDetail |
| Create | POST | /api/v1/suppliers | SupplierDetail |
| Update | PUT | /api/v1/suppliers/{id} | SupplierDetail |
| Clone | POST | /api/v1/suppliers/{id}/clone | SupplierDetail (new record, code auto-generated) |
| Delete | DELETE | /api/v1/suppliers/{id} | 409: `{ message, transactionCount }` if has transactions |
| Toggle active | PATCH | /api/v1/suppliers/{id}/toggle-active | { isActive: boolean } |
| Export | GET | /api/v1/suppliers/export | Blob (.xlsx) — same filters as List endpoint |
| Bulk update address | PUT | /api/v1/suppliers/bulk-update-address | Body: `{ ids: string[], address: string }` — requires supplier.updateAddress |

## 14. State Management
- URL params: `search`, `page`, `pageSize`, `sortBy`, `sortDir`, `isActive` (default: `true`)
- Local state: `createOpen`, `editSupplierId`, `cloningSupplier`, `deletingSupplier`
- Query keys: `['suppliers', tenantId, 'list', query]`, `['suppliers', tenantId, 'detail', id]`
- Tenant from `useTenantStore()` — NOT from URL

## 15. User Interaction
See full flows in `01-frontend-basic-design-old.md` Section A4.5. Key flows:
- Create → Thêm button → SupplierFormDialog (empty) → POST → success toast + close
- "Cất và Thêm" → POST → success toast + form reset (dialog stays open)
- Edit → ▼ Sửa → SupplierFormDialog (prefilled) → PUT
- Clone → ▼ Nhân bản → SupplierFormDialog (prefilled từ NCC gốc, mã tự sinh) → POST /clone → toast + close
- Delete → ▼ Xóa → DeleteConfirmDialog → DELETE:
  - Thành công: toast + close
  - 409 has transactions: dialog chuyển sang error state — hiển thị "NCC đã có phát sinh" + nút **"Xem phát sinh"** (navigate đến chứng từ liên quan)
- Toggle → ▼ Ngừng/Sử dụng → PATCH /toggle-active
- Filter isActive → dropdown Tất cả/Đang dùng/Ngừng → update URL param `isActive` → refetch list
- Export → Tiện ích ▼ → Xuất ra Excel → GET /export?{current filters} → download .xlsx

## 16. Validation Rules

| Field | Rule |
|---|---|
| code | Required, max 32 |
| name | Required, max 255 |
| taxCode | Optional, max 32 |
| email | Optional, valid email |
| phone | Optional, max 32 |
| address | Optional, max 500 |
| bankAccount | Optional, max 50 |

## 17. Permission Rules

| Action | Permission | UI Behavior |
|---|---|---|
| View list | supplier.view | PermissionGuard → redirect /dashboard |
| Create | supplier.create | "Thêm" button hidden |
| Edit | supplier.update | "Sửa" menu item hidden |
| Toggle active | supplier.update | "Ngừng/Sử dụng" hidden |
| Delete | supplier.delete | "Xóa" menu item hidden |
| Export | supplier.export | "Xuất ra Excel" hidden |
| Bulk update address | supplier.updateAddress | "Xác nhận địa chỉ NCC" button hidden |
| Lập CT mua hàng | supplier.createPurchaseVoucher | Textlink column hidden |
| Clone (Nhân bản) | supplier.create | "Nhân bản" menu item hidden |

> Permission prefix: **`supplier.`** (singular) — confirmed. Migrate existing `suppliers.` code (P1-C1 resolved).

## 18. Multi-tenant Rules
- `tenantId` from `useTenantStore()` only — never from URL
- `X-Tenant-Id` header auto-attached by `lib/api/client.ts`
- Query keys must include `tenantId` for auto-invalidation on tenant switch

## 19. Loading / Empty / Error States
- Loading: `GridLoadingState` (AG Grid overlay)
- Empty (no records): "Chưa có nhà cung cấp nào"
- Empty (search): "Không tìm thấy nhà cung cấp phù hợp"
- Error: `GridErrorState` + Retry button
- Submitting: Button spinner + disabled state

## 20. Responsive Behavior
- ≥1280px: All columns visible, dialog centered
- 768–1279px: Horizontal scroll, optional column hide (email, address)
- <768px: Minimal columns (code, name, isActive, action), dialog full-screen

## 21. Frontend Decision Log

| # | Decision | Reason |
|---|---|---|
| D1 | Module path: `src/modules/suppliers/` | CLAUDE.md convention |
| D2 | Permission prefix: `supplier.` (singular) | Config + CLAUDE.md override existing `suppliers.` code |
| D3 | Route: `/categories/suppliers` | From config `frontend.route_path` |
| D4 | pageSize default: 20 (not 100) | Mobile UX; config `list_query.default_page_size: 100` is API default but FE can differ — confirmed by user |
| D9 | Clone dùng POST /suppliers/{id}/clone (không dùng GET + copy) | Server-side clone đảm bảo code uniqueness và audit trail |
| D10 | isActive default = true (Đang sử dụng) | Accounting UX: user thường chỉ làm việc với NCC đang hoạt động |
| D11 | Delete 409 → dialog error state + "Xem phát sinh" link (không toast) | BA requirement: user cần navigate đến chứng từ liên quan trước khi xóa |
| D12 | Export truyền cùng query params với List | Consistency: user export đúng những gì đang xem |
| D5 | Toggle active: PATCH `/toggle-active` | Clean intent; not full PUT |
| D6 | `currentDebtAmount` in SupplierListItem | Config sortable fields + `negative-debt-display` business rule |
| D7 | `isActive` default true; hidden from form | SCR-1 + BA doc |
| D8 | tenantId in query key | CLAUDE.md convention |

## 22. Acceptance Criteria
- [ ] List hiển thị với AG Grid, phân trang server-side từ URL params
- [ ] Tìm kiếm debounce 300ms; page reset về 1 khi search thay đổi
- [ ] Create/Edit/Delete/Toggle — CRUD đầy đủ với toast notifications
- [ ] Delete block 409 khi NCC có phát sinh, hiển thị toast error
- [ ] Negative `currentDebtAmount` hiển thị màu đỏ
- [ ] "Cất và Thêm" hoạt động đúng
- [ ] isActive filter dropdown hoạt động đúng; default "Đang sử dụng"; URL param đồng bộ
- [ ] Export Excel download .xlsx theo filter/search hiện tại
- [ ] "Nhân bản" → SupplierFormDialog prefilled, mã tự sinh, POST /clone thành công
- [ ] Delete 409 → error state trong dialog + nút "Xem phát sinh" (không chỉ toast)
- [ ] bankAccount field có trong SupplierForm (optional); không hiển thị cột trong grid
- [ ] "Lập CT mua hàng" textlink column hiển thị; hidden khi không có supplier.createPurchaseVoucher
- [ ] Bulk address update dialog hoạt động; hidden khi không có supplier.updateAddress
- [ ] Permission-based UI — hide actions khi không có quyền
- [ ] supplier.view redirect về /dashboard khi không có quyền
- [ ] tenantId trong query key; switch tenant → list tự làm mới
- [ ] Loading / Empty / Error states hiển thị đúng

## 23. Unclear / Incomplete Items

### 1. Missing Information

| ID | Info | Needed For | Impact | Required Before Next Phase? |
|---|---|---|---|---|
| P1-M1 | AccountingMini actual UI screenshots (not MISA reference) | Phase 2 pixel analysis | Low — reference images still sufficient | No |

### 2. Unclear Requirements — Resolved

| ID | Requirement | User Answer | Resolution |
|---|---|---|---|
| P1-U1 | Bulk delete scope | không hỗ trợ | Do Not Implement |
| P1-U2 | `supplier-updateAddress` | bulk dialog | Implement bulk address confirmation dialog |

### 3. Conflicts — Resolved

| ID | Topic | User Answer | Resolution |
|---|---|---|---|
| P1-C1 | Permission prefix | supplier. (singular) | Dùng `supplier.` — migrate `suppliers.` code |
| P1-C2 | supplier-pay scope | textlink Lập CT mua hàng | Implement as textlink column, permission: supplier.createPurchaseVoucher |

### 4. Assumptions

| ID | Assumption | Risk | Confirm? |
|---|---|---|---|
| P1-A1 | `currentDebtAmount` field exists in API response | Medium — if not available, remove from grid | Confirm in Phase 3 |

### 5. Questions — Resolved / Deferred

| ID | Question | User Answer | Status |
|---|---|---|---|
| P1-Q1 | Metric cards có cần trong phase này? | No | Resolved — Do Not Implement |
| P1-Q2 | Tổ chức / Cá nhân supplier type có cần? | (not answered) | Deferred — significant DB change |
| P1-Q6 | "Là khách hàng" sync rule — trong scope? | (not answered) | Deferred — cross-module, ảnh hưởng schema. Phase 3 phải thiết kế. |
| P1-Q7 | Cột Nợ cũ (previousDebtAmount) có cần? | Defer | Deferred — chỉ hiển thị cột Nợ trong phase này |

## 24. Definition of Done
- [x] Current UI images analyzed
- [x] Reference UI images analyzed (8 files)
- [x] Reference markdown analyzed (3 files)
- [x] Feature Comparison Matrix completed
- [x] Confirmed Frontend Scope defined
- [x] Screen layout documented
- [x] Component design documented
- [x] Data model documented
- [x] API needs documented
- [x] Permission rules documented
- [x] Open questions listed in issues.md
- [x] User confirms open questions — P1-Q1, P1-U1, P1-U2, P1-C1, P1-C2 resolved; P1-Q2 deferred
