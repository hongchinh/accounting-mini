# Authentication & Authorization Flow

## Login Flow

`POST /api/auth/login` always returns tokens in one call (no picker mid-flow).

Tenant selection priority inside `LoginTenantResolver`:
1. Explicit `tenantCode` in body (back-compat)
2. `user.LastTenantId` (last-used tenant)
3. Oldest active `TenantMembership`

Response includes `availableTenants` so the UI can render a switcher without an extra round trip.

## JWT Contents

JWTs are short-lived (configurable, default 15 min). Claims included:

| Claim | Value |
|-------|-------|
| `sub` | User GUID |
| `email` | User email |
| `tenant_id` | Active tenant GUID |
| `is_super_admin` | `"true"` if SuperAdmin |
| `security_stamp` | Rotated on credential change — invalidates old tokens |
| `role` | Tenant-scoped role name |
| `permissions` | Comma-separated permission strings |

## Refresh Token Rotation

- Refresh tokens are per-user, per-tenant, per-device (identified by `deviceId`)
- `POST /api/auth/refresh-token` rotates the refresh token on every call (old token is revoked)
- Frontend deduplicates concurrent refresh attempts using a shared `refreshPromise` in `client.ts`
- On 401, the Axios interceptor retries once with a fresh token, then redirects to `/login`

## Tenant Switching

`POST /api/auth/switch-tenant { tenantId }`:
- Validates the user has membership in the target tenant
- Issues a new JWT for the target tenant
- Revokes only the current device's refresh token at the old tenant (other devices unaffected)
- Stamps `user.LastTenantId` for future auto-selection

## Authorization Layers

Three layers, use the lowest-privilege option:

| Layer | How to Use | When to Use |
|-------|-----------|-------------|
| Permission | `[HasPermission(Permissions.SupplierView)]` | Most feature endpoints |
| Policy | `[Authorize(Policy = Policies.SuperAdmin)]` | Platform-admin endpoints |
| Role | `[Authorize(Roles = "Owner")]` | Legacy — avoid for new code |

`PermissionPolicyProvider` dynamically synthesizes an ASP.NET policy from any string in `Permissions.cs`. Adding a constant there is enough — no manual policy registration needed. Permissions are seeded to the database by `InitialDataSeeder` on next startup in Development.

## Account Security

- Failed login attempts are counted; account locks after `AuthOptions.MaxFailedAttempts`
- Lockout duration is configurable (`AuthOptions.LockoutDuration`)
- Password change rotates `SecurityStamp`, which invalidates all existing JWTs for that user
- Email verification is required before a newly registered user can log in
