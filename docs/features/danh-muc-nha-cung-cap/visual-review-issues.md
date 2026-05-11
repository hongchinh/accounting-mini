# Visual Review Issues: Danh mục nhà cung cấp

## Summary

| Severity | Open | Resolved | Deferred |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 1 | 0 |
| Low | 0 | 1 | 1 |

## Visual Issues

| ID | Severity | Area | Expected | Actual | Recommendation | File / Component | Status |
|---|---|---|---|---|---|---|---|
| V9-1 | Low | Breadcrumb | "Danh mục" label for categories segment | "categories" (URL slug) | Map route segment to localized label in breadcrumb config | `Breadcrumb.tsx` | Fixed |
| V9-2 | Low | Page title | "Danh sách nhà cung cấp" (source) | "Nhà cung cấp" | Acceptable design simplification — keep as-is | `SupplierListPage.tsx:132` | Deferred |
| V9-3 | Medium | Pagination during load | Skeleton or hidden count | "0 bản ghi" shown while `isLoading = true` | `total: number \| undefined`; shows `—` when undefined | `SupplierListPage.tsx`, `PaginationBar.tsx` | Fixed |
