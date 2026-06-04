# Plan: UI Pixel Fix — Layout & UX Alignment (Full Project)

**Created:** 2026-06-04  
**Revised by:** FE Lead review 2026-06-04  
**Decision 2026-06-04:** A1 (primary color) và A2 (grid header color) **GIỮ NGUYÊN** — chỉ implement B, C, D, E, G  
**Source:** Brainstorming session — pixel-perfect analysis vs MISA reference screenshot  
**Scope:** Customers + Suppliers + shared PaginationBar — **không đổi global color tokens**  
**Backend required:** Group F only (defer)

---

## FE Lead Review — Findings Before Implementation

### 🔴 BUG-1: Group A2 sai target — plan sẽ KHÔNG hoạt động

**Plan gốc** muốn đổi `design-tokens.ts → tableHeaderBackground`.  
**Thực tế**: `tableHeaderBackground` trong `design-tokens.ts` chỉ được dùng cho pinned rows (totals row), **không phải** column header row.

AG Grid header màu được hardcode trong `ag-grid-theme.css`:
```css
--ag-header-background-color: #005bac;  /* dark navy — hardcoded */
--ag-header-foreground-color: #ffffff;  /* white text — hardcoded */
```

→ **Fix**: A2 phải target `ag-grid-theme.css`, không phải `design-tokens.ts`.  
→ Khi đổi sang light teal background, bắt buộc phải đổi text sang màu tối đồng thời.

---

### 🔴 BUG-2: Grid header hiện tại là DARK NAVY, không phải gray

Pixel analysis ban đầu assume header là `#F0F2F5` (light gray). Thực tế là `#005bac` (dark brand blue) với white text.

Gap với reference lớn hơn dự kiến:
- Current: dark navy `#005bac` + white text
- Reference: light cyan `#C5E8F0` + dark text

→ Cần đổi cả background VÀ foreground color + separator color trong `ag-grid-theme.css`.

---

### 🔴 BUG-3: `theme.css` tồn tại nhưng chưa được import

File `src/styles/theme.css` định nghĩa `--color-bg-primary`, `--color-tint-secondary`, v.v. — nhưng **không được import** ở bất kỳ đâu.

`layout.tsx` chỉ import `globals.css`. `globals.css` không import `theme.css`.

Hậu quả:
- `ag-grid-theme.css` dùng `var(--color-bg-secondary)`, `var(--color-text-primary)` — các vars này **undefined** → fallback về browser default
- Phần còn lại của app (body bg, text color) do `globals.css` Tailwind/Shadcn variables kiểm soát
- `theme.css` là **dead code** hiện tại

→ Không sửa `theme.css` trong plan này (scope quá lớn). Nhưng phải ghi nhận khi sửa `ag-grid-theme.css` để tránh dùng `var(--color-*)` chưa được import.

---

### 🟠 SCOPE-GAP-1: Supplier module bị bỏ sót hoàn toàn

Plan gốc chỉ cover Customers. Nhưng Supplier có cùng vấn đề:
- `SupplierSummaryCards.tsx` — cùng old card design
- `SupplierTable.tsx` — có `#` column, abbreviated header names
- `SupplierListPage.tsx` — cùng toolbar pattern (search left, no sort icon)

Vì đây là "apply style toàn project", plan phải cover Supplier.

---

### 🟠 SCOPE-GAP-2: `--ring` bị bỏ quên trong A1

Đổi `--primary` sang teal mà không đổi `--ring` sẽ làm focus ring vẫn màu blue.  
`globals.css` line 16: `--ring: 221.2 83.2% 53.3%` — cần sync với `--primary`.

---

### 🟡 DESIGN-DECISION-1: Nhóm + Trạng thái columns

Reference không hiển thị các columns này nhưng chúng có value. Quyết định:
- **Giữ Nhóm và Trạng thái** nhưng ẩn mặc định (hide: true, user có thể bật qua column chooser)
- Không xóa hoàn toàn vì data có ích

---

### 🟡 DESIGN-DECISION-2: Route `/payments/new` trong ChucNangCell

Route "Thu tiền" chưa tồn tại. Cell renderer vẫn implement nhưng navigate đến `#` (noop) kèm `TODO` comment.

---

## Revised Files Affected

| File | Group | Scope |
|------|-------|-------|
| ~~`accounting_web/src/app/globals.css`~~ | ~~A1~~ | **GIỮ NGUYÊN** — không đổi primary color |
| ~~`accounting_web/src/styles/ag-grid-theme.css`~~ | ~~A2~~ | **GIỮ NGUYÊN** — không đổi grid header color |
| `accounting_web/src/modules/customers/components/CustomerSummaryCards.tsx` | B | Customers |
| `accounting_web/src/modules/suppliers/components/SupplierSummaryCards.tsx` | B | Suppliers |
| `accounting_web/src/modules/customers/components/CustomerGrid.tsx` | C | Customers |
| `accounting_web/src/modules/suppliers/components/SupplierTable.tsx` | C | Suppliers |
| `accounting_web/src/components/grid/PaginationBar.tsx` | D | Global shared |
| `accounting_web/src/modules/customers/pages/CustomerListPage.tsx` | E, G | Customers |
| `accounting_web/src/modules/suppliers/pages/SupplierListPage.tsx` | E, G | Suppliers |

**Tổng: 7 files** (giảm từ 9, bỏ 2 file CSS color).

---

## GROUP A — Global Design Tokens ~~SKIP~~

> **Decision 2026-06-04:** A1 và A2 **GIỮ NGUYÊN**. Primary color (blue) và AG Grid header (dark navy) không thay đổi trong sprint này.

---

## GROUP B — Summary Cards Redesign (Customers + Suppliers)

**Checkpoint:** Cards hiển thị đúng layout: left border stripe, large number, icons, timestamp

### Target layout (per card):
```
┌──┬──────────────────────────────────────────────────┐
│▌ │ 0,0                                     ↺  ▼   │  ← text-xl font-bold, icons 14px
│  │                                                  │
│  │ Nợ quá hạn           Số liệu tính đến: 12h33   │  ← text-xs muted, justify-between
└──┴──────────────────────────────────────────────────┘
```

### B1 — `CustomerSummaryCards.tsx`

**Card definitions:**

| Slot | API field | Label | Left border | Value color |
|------|-----------|-------|-------------|-------------|
| Left | `totalDebt` | Nợ quá hạn | `bg-orange-400` | neutral |
| Mid | `totalReceivable` | Tổng nợ phải thu | `bg-red-400` | `text-destructive` nếu > 0 |
| Right | `totalAdvancePayment` | Đã thanh toán (30 ngày gần đây) | `bg-green-400` | `text-green-600` |

**Timestamp:** `summary.calculatedAt` — format sang `HHhMM` (VD: "12h33"):
```typescript
const formatTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
};
```

**Skeleton loading:** giữ `h-[80px]` (tăng từ `h-[72px]` do card cao hơn).

**Icons:** `RefreshCw` + `ChevronDown` từ lucide-react, size 14, `text-muted-foreground`. Không có handler (placeholder, tính năng refresh-card là future).

### B2 — `SupplierSummaryCards.tsx` **(NEW)**

Cùng pattern với Customer. Cards Supplier:

| Slot | API field | Label | Left border | Value color |
|------|-----------|-------|-------------|-------------|
| Left | `totalDebtAmount` | NCC nợ cần trả | `bg-orange-400` | `text-destructive` |
| Right | `totalCreditAmount` | Trả trước | `bg-green-400` | `text-green-600` |

**Timestamp:** `SupplierSummary` hiện tại **không có `calculatedAt`**. Cần kiểm tra type:
- Nếu field không có: hiển thị timestamp cố định hoặc bỏ timestamp cho Supplier (not blocking)
- Không thêm backend field chỉ để hiện timestamp — đánh dấu TODO

---

## GROUP C — Grid Column Fixes (Customers + Suppliers)

### C1 — Xóa `#` row-number column

Áp dụng cho **cả `CustomerGrid.tsx` và `SupplierTable.tsx`**.

```diff
- {
-   headerName: "#",
-   width: 48,
-   valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
-   ...
- },
```

### C2 — Full header names (Customers only — Supplier dùng different naming)

```diff
CustomerGrid.tsx:
- headerName: "Mã KH"      → "Mã khách hàng"
- headerName: "Tên KH"     → "Tên khách hàng"
- headerName: "MST/CCCD"   → "Mã số thuế/CCCD chủ hộ"

SupplierTable.tsx:
- headerName: "Mã NCC"     → "Mã nhà cung cấp"
- headerName: "Tên NCC"    → "Tên nhà cung cấp"
```

### C3 — Conditional row highlight

**Customers — `CustomerGrid.tsx`:**
```typescript
// trong gridOpts useMemo:
rowClassRules: {
  'bg-amber-50': (params: RowClassParams<CustomerListItem>) =>
    (params.data?.currentDebtAmount ?? 0) > 0,
},
```

**Suppliers:** không có "overdue debt" concept tương đương → bỏ qua row highlight cho Supplier.

### C4 — "Chức năng" contextual column (Customers only)

Thay thế column "Lập CT bán hàng" (width 150) bằng "Chức năng":

```typescript
const ChucNangCell = ({ data }: ICellRendererParams<CustomerListItem>) => {
  const router = useRouter();
  if (!data) return null;
  const hasDebt = (data.currentDebtAmount ?? 0) > 0;

  const handleAction = () => {
    if (hasDebt) {
      // TODO: route /payments/new chưa tồn tại
      console.warn('Thu tiền route not implemented yet');
      return;
    }
    router.push(`/sales/vouchers/new?customerId=${data.id}`);
  };

  return (
    <button
      type="button"
      className="text-sm text-teal-600 hover:underline flex items-center gap-0.5"
      onClick={(e) => { e.stopPropagation(); handleAction(); }}
    >
      {hasDebt ? 'Thu tiền' : 'Lập CT bán hàng'}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
};
```

Column config:
```typescript
{
  headerName: 'Chức năng',
  width: 160, minWidth: 140,
  filter: false, sortable: false,
  cellRenderer: ChucNangCell,
  // giữ pinned: "right" để không bị đẩy ra ngoài khi scroll ngang
}
```

**Suppliers — `SupplierTable.tsx`:** đổi tên column header:
```diff
- headerName: "Lập CT mua hàng"
+ headerName: "Chức năng"
```
Giữ nguyên `PurchaseVoucherCell` logic, chỉ đổi tên.

### C5 — Reorder + Hide columns

**CustomerGrid.tsx — final column order:**
1. Checkbox (pinned left)
2. Mã khách hàng
3. Tên khách hàng (flex: 1)
4. Địa chỉ
5. Công nợ (right-align)
6. Mã số thuế/CCCD chủ hộ
7. ~~Nhóm~~ → `hide: true` (ẩn mặc định, không xóa)
8. ~~Trạng thái~~ → `hide: true` (ẩn mặc định, không xóa)
9. Chức năng (pinned right)
10. ⋮ CustomerRowActions (pinned right)

**SupplierTable.tsx — final column order:**
1. Checkbox (pinned left)
2. Mã nhà cung cấp
3. Tên nhà cung cấp (flex: 1)
4. Địa chỉ
5. SĐT
6. Nợ cần trả (right-align)
7. Trả trước (right-align)
8. ~~Loại~~ → `hide: true`
9. ~~Nhóm~~ → `hide: true`
10. ~~Trạng thái~~ → `hide: true`
11. Chức năng (pinned right)
12. ⋮ SupplierRowActions (pinned right)

---

## GROUP D — Pagination Redesign (shared component)

**Checkpoint:** "Tổng số: X bản ghi | X bản ghi trên 1 trang ▼ | Trước 1 2 3 ... N Sau"

### D1 — `PaginationBar.tsx`

**Target layout:**
```
Tổng số: 1.787 bản ghi     [20 bản ghi trên 1 trang ▼]     Trước  1  2  3  ...  90  Sau
```

**Page number generation function:**
```typescript
function buildPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)  return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', current-1, current, current+1, '...', total];
}
```

**Render:**
- "Trước" / "Sau": `Button variant="ghost" size="sm"`, disabled when at boundary
- Page numbers: ellipsis `...` = `<span>`, active page = plain bold text, inactive pages = `Button variant="ghost" size="sm"`
- Select label: `"{pageSize} bản ghi trên 1 trang"` (không phải "Hiển thị X")
- Left text: `"Tổng số: {total.toLocaleString('vi-VN')} bản ghi"`

**Verify:** Cả Customers và Suppliers pagination đổi format đúng (shared component, 1 fix = 2 modules).

---

## GROUP E — Toolbar Layout

### E1 — `CustomerListPage.tsx`: Reorder

**Current:**
```
[Search] [Status ▼] ────flex-1──── [↺] [Xuất Excel] [Delete] [+ Thêm mới ▼]
```

**Target:**
```
[↕ Sort] [Thực hiện hàng loạt ▼] [Lọc ▼] ────flex-1──── [Search🔍] [↺] [📊] [Xuất Excel] [Thêm ▼]
```

Changes:
1. **Sort icon button** (placeholder, no op): `ArrowUpDown` icon, `variant="ghost"` size icon
2. **"Thực hiện hàng loạt ▼"**: luôn visible, disabled khi `selectedIds.length === 0`
   ```tsx
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="outline" size="sm" className="h-8 gap-1"
               disabled={selectedIds.length === 0}>
         Thực hiện hàng loạt <ChevronDown className="h-3 w-3" />
       </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <Can permission={PERMISSIONS.Customer.BulkDelete}>
         <DropdownMenuItem className="text-destructive"
                           onClick={() => setBulkDeleteOpen(true)}>
           <Trash2 className="mr-2 h-4 w-4" />
           Xóa {selectedIds.length} mục
         </DropdownMenuItem>
       </Can>
     </DropdownMenuContent>
   </DropdownMenu>
   ```
3. **"Lọc ▼"** button: placeholder (no filter panel yet — known P8-N2 issue). Render button, onClick noop + `toast.info('Tính năng đang phát triển')`
4. **Move Search sang right** side (before `↺` icon)
5. **Status filter**: vẫn giữ nhưng inline với search group ở right, hoặc tạm thời bỏ vào Lọc panel sau
6. **Rename "Thêm mới" → "Thêm"** trong split button text

### E2 — `SupplierListPage.tsx`: Partial reorder **(NEW)**

Supplier toolbar khác Customers (có "Xác nhận địa chỉ NCC" button riêng). Apply:
1. Add sort icon (placeholder, noop)
2. Move "Thực hiện hàng loạt" thành always-visible dropdown (hiện tại chỉ show khi `selectedIds.length > 0`)
3. Move search inputs sang right side
4. Rename "Thêm mới" → "Thêm"
5. Giữ "Xác nhận địa chỉ NCC" ở right side (không di chuyển)

---

## GROUP G — Minor Text Fixes

### G1 + G2 — `CustomerListPage.tsx`

```diff
- <h1 className="text-2xl font-semibold">Khách hàng</h1>
+ <h1 className="text-2xl font-semibold">Danh sách khách hàng</h1>
+ <Link href="/categories" className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-0.5">
+   <ChevronLeft className="h-3.5 w-3.5" />
+   Tất cả danh mục
+ </Link>
```

> Import `Link` from `next/link`, `ChevronLeft` from `lucide-react`.

### G3 — `SupplierListPage.tsx` **(NEW)**

```diff
- <h1 className="text-2xl font-semibold">Nhà cung cấp</h1>
+ <h1 className="text-2xl font-semibold">Danh sách nhà cung cấp</h1>
+ <Link href="/categories" className="text-sm text-teal-600 hover:underline ...">
+   <ChevronLeft className="h-3.5 w-3.5" />
+   Tất cả danh mục
+ </Link>
```

---

## GROUP F — Backend: New List Columns (DEFER)

Không implement trong plan này. Khi ready:
1. Backend: thêm `phoneNumber`, `mobilePhone`, `isInternalObject` vào `CustomerListItem` response
2. Frontend: update `CustomerListItem` type, thêm 3 columns

---

## Execution Order

```
B1+B2 (summary cards — Customer + Supplier cùng lúc)
  ↓
C1+C2+C3+C4+C5 (Customer grid)
  ↓
C — Supplier (SupplierTable)
  ↓
D (PaginationBar — shared)
  ↓
E1+E2 (toolbar — Customer + Supplier)
  ↓
G (text fixes)
```

---

## Tech Debt Logged (không fix trong plan này)

| Item | File | Priority |
|------|------|----------|
| `theme.css` chưa được import — dead code | `globals.css` | Medium |
| `design-tokens.ts` duplicate với `theme.css` | `design-tokens.ts` | Low |
| `ag-grid-theme.css` dùng `var(--color-*)` chưa defined | `ag-grid-theme.css` | Medium |
| Filter panel ("Lọc") chưa implement | `CustomerListPage.tsx` | P8-N2 backlog |
| Route `/payments/new` chưa tồn tại | `ChucNangCell` | Future feature |

---

## Full Test Checklist

| # | Item | Covers | Group |
|---|------|--------|-------|
| ~~1~~ | ~~Button "Thêm" teal~~ | ~~A1 SKIP~~ | — |
| ~~2~~ | ~~AG Grid header light cyan~~ | ~~A2 SKIP~~ | — |
| 1 | Customer summary cards: left border stripe đúng màu (3 cards) | Customers | B1 |
| 2 | Customer summary cards: number 20px bold | Customers | B1 |
| 3 | Customer summary cards: timestamp hiển thị từ `calculatedAt` | Customers | B1 |
| 4 | Supplier summary cards: left border stripe (2 cards) | Suppliers | B2 |
| 5 | Grid Customers: không có `#` column | Customers | C1 |
| 6 | Grid Suppliers: không có `#` column | Suppliers | C1 |
| 13 | Customer grid: "Mã khách hàng", "Tên khách hàng", "Mã số thuế/CCCD chủ hộ" | Customers | C2 |
| 14 | Supplier grid: "Mã nhà cung cấp", "Tên nhà cung cấp" | Suppliers | C2 |
| 15 | Customer row cam khi `currentDebtAmount > 0` | Customers | C3 |
| 16 | Customer "Chức năng" cell: "Thu tiền" khi có debt | Customers | C4 |
| 17 | Customer "Chức năng" cell: "Lập CT bán hàng" khi không có debt | Customers | C4 |
| 18 | Supplier "Chức năng" column header rename | Suppliers | C4 |
| 19 | Nhóm + Trạng thái columns ẩn mặc định (không bị xóa) | Both | C5 |
| 20 | Pagination: "Tổng số: X bản ghi" format | Both | D |
| 21 | Pagination: "X bản ghi trên 1 trang ▼" select label | Both | D |
| 22 | Pagination: page-number buttons với ellipsis | Both | D |
| 23 | Pagination: "Trước" disabled trên page 1 | Both | D |
| 24 | Pagination: "Sau" disabled trên page cuối | Both | D |
| 25 | Customer toolbar: search input ở right side | Customers | E1 |
| 26 | Customer toolbar: "Thực hiện hàng loạt ▼" luôn visible | Customers | E1 |
| 27 | Customer toolbar: disabled khi chưa chọn row | Customers | E1 |
| 28 | Supplier toolbar: search ở right, "Thực hiện hàng loạt" luôn visible | Suppliers | E2 |
| 29 | Page title Customers: "Danh sách khách hàng" | Customers | G |
| 30 | Page title Suppliers: "Danh sách nhà cung cấp" | Suppliers | G |
| 31 | Breadcrumb link "< Tất cả danh mục" hiển thị | Both | G |
| 32 | Supplier detail page không bị vỡ layout (smoke test) | Suppliers | All |
