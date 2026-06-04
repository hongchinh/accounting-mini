# Product Goals & Business Context

## What Is AccountingMini

AccountingMini is a multi-tenant accounting SaaS application targeting Vietnamese SMEs. It provides bookkeeping, master-data management (suppliers, customers), and eventually journal entries, invoicing, and payment workflows.

The "Mini" qualifier reflects a focused MVP scope: the system supports essential accounting operations without the full complexity of enterprise ERP systems like MISA or KiotViet (which are used as UI/UX references during design phases).

## Multi-Tenancy Model

Each customer organization is a **Tenant**. A user can belong to multiple tenants and switch between them without logging out. Within a tenant, the accounting context is further scoped by:

- **Company** — legal entity (one tenant may have multiple companies)
- **Branch** — physical or logical branch of a company
- **Fiscal Year** — accounting period

These four dimensions are passed as headers on every API request and stored in the browser via `useTenantStore`.

## Tenant Lifecycle

New tenants start in `Trialing` status. The platform operator activates, suspends, or cancels tenants via platform-admin endpoints. Suspended tenants are blocked at the middleware layer before any business logic executes.

## Current Feature Scope

### I. Nhóm chức năng hệ thống

| Feature | Status |
|---------|--------|
| Authentication (login, register, refresh, email verification) | Complete |
| Tenant management (create, activate, suspend) | Complete (admin only) |

### II. Nhóm chức năng danh mục

#### 1. Nhóm danh mục Đối tượng

| Feature | Status |
|---------|--------|
| danh mục nhà cung cấp  (CRUD, bulk ops, export) | Complete |
| danh mục khách hàng | Planned |
| danh mục nhân viên | Planned |
| danh mục nhóm khách hàng, nhà cung cấp | Planned |

#### 2. Nhóm danh mục Vật tư hàng hóa

| Feature | Status |
|---------|--------|
| danh mục vật tư hàng hóa | Planned |
| danh mục kho | Planned |
| danh mục nhóm vật tư, hàng hóa | Planned |
| danh mục đơn vị tính | Planned |

#### 3. Nhóm danh mục tài khoản

| Feature | Status |
|---------|--------|
| danh mục hệ thống tài khoản | Planned |
| danh mục tài khoản kết chuyển | Planned |
| danh mục tài khoản ngầm định | Planned |
| danh mục đơn vị tính | Planned |

#### 4. Nhóm danh mục Chi phí

| Feature | Status |
|---------|--------|
| danh mục Đối tượng tập hợp chi phí | Planned |
| danh mục Khoản mục chi phí | Planned |
| danh mục Công trình | Planned |
| danh mục Loại công trình | Planned |

#### 5. Nhóm danh mục Ngân hàng

| Feature | Status |
|---------|--------|
| danh mục Ngân hàng | Planned |
| danh mục Tài khoản ngân hàng | Planned |

#### 6. Nhóm chi nhánh, phòng ban

| Feature | Status |
|---------|--------|
| danh mục Cơ cấu tổ chức | Planned |

### III. Nhóm chức năng nghiệp vụ

#### 1. Tiền mặt

| Feature | Status |
|---------|--------|
| Phiếu thu tiền | Planned |
| Phiếu chi tiền | Planned |
| Kiểm kê quỹ | Planned |

#### 2. Tiền gửi

| Feature | Status |
|---------|--------|
| Phiếu thu tiền | Planned |
| Phiếu chi tiền | Planned |
| Đối chiếu ngân hàng | Planned |

#### 3. Mua hàng

| Feature | Status |
|---------|--------|
| Phiếu mua hàng | Planned |
| Phiếu trả lại hàng mua | Planned |
| Đối chiếu ngân hàng | Planned |


## User Roles

| Role | Scope | Capabilities |
|------|-------|-------------|
| SuperAdmin | Platform-wide | Manage tenants, run migrations, bypass all tenant filters |
| Owner | Per-tenant | Full tenant management including member roles |
| Admin | Per-tenant | Most feature operations |
| Member | Per-tenant | Feature-level permissions granted by Admin/Owner |

Permissions are fine-grained strings (e.g., `supplier.create`, `invoice.approve`). The set of permissions for a role is configurable per tenant.

## Business Language

The application is written for Vietnamese users. UI labels, error messages, and documentation use Vietnamese (tiếng Việt). Code, API paths, and technical documentation use English.
