# Backend Request Pipeline

## MediatR Pipeline Behaviors

Every command and query flows through these behaviors in order:

```
Request → Validation → Logging → Transaction → Performance → UnhandledException → Handler
```

| Behavior | Class | Effect |
|----------|-------|--------|
| Validation | `ValidationBehavior` | Runs all FluentValidation validators; returns `Result.Failure(ValidationError)` without throwing |
| Logging | `LoggingBehavior` | Logs request name + elapsed time at Debug level |
| Transaction | `TransactionBehavior` | Wraps handler in a DB transaction if request implements `ITransactionalRequest` |
| Performance | `PerformanceBehavior` | Warns (Serilog) if handler exceeds 500 ms |
| UnhandledException | `UnhandledExceptionBehavior` | Catches unhandled exceptions, logs them, returns a generic failure result |

To opt a command into a DB transaction, mark it with `ITransactionalRequest`:

```csharp
public record CreateSupplierCommand(...) : IRequest<Result<SupplierDto>>, ITransactionalRequest;
```

## Result Pattern

Handlers never throw for business logic failures. They return `Result<T>` from `AccountingApi.Shared.Result`:

```csharp
// Success
return SupplierDto.From(supplier);

// Failure
return Error.NotFound("supplier.not_found", "Supplier not found.");
return Error.Conflict("supplier.duplicate_code", "Code already exists.");
```

Endpoints convert `Result<T>` to HTTP using `.Match()`:

```csharp
var result = await sender.Send(query, ct);
return result.Match(Results.Ok, ApiResults.Problem);
```

`ApiResults.Problem` maps `Error` types to HTTP status codes:
- `Error.NotFound` → 404
- `Error.Conflict` → 409
- `ValidationError` → 422

## Infrastructure Services Wired

| Service | Implementation | Notes |
|---------|---------------|-------|
| Cache | `InMemoryCacheService` (no Redis) / `RedisCacheService` | Auto-selected by `ConnectionStrings:Redis` presence |
| Background jobs | `HangfireBackgroundJobService` | Tables in `hangfire` schema, not owned by EF |
| Email | `LoggingEmailService` | Development stub — logs to console instead of sending |
| DateTime | `DateTimeProvider` | Abstracted for testability |

## EF Core Interceptors

Applied on every `SaveChanges` call:

| Interceptor | Effect |
|------------|--------|
| `AuditableEntityInterceptor` | Sets `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy` |
| `TenantInterceptor` | Sets `TenantId` on new `ITenantEntity` records; rejects cross-tenant writes |
| `SoftDeleteInterceptor` | Converts `Delete` state → sets `IsDeleted = true` |
| `DispatchDomainEventsInterceptor` | Publishes domain events via MediatR after `SaveChanges` |
