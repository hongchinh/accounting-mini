# Development Workflow

## First-Time Setup

### Backend

```bash
cd accounting_api

# Start dependencies
docker compose up -d postgres redis

# Run API (auto-migrates + seeds on Development)
dotnet run --project src/Api/AccountingApi.Api.csproj
# → Swagger: https://localhost:7100/swagger
```

### Frontend

```bash
cd accounting_web
pnpm install
pnpm dev
# → http://localhost:3000
```

### Connection String Gotcha

`src/Api/appsettings.json` defaults to `Database=postgres;Username=postgres;Password=1` (local Postgres).
`docker-compose.yml` creates `Database=accountingapi;Password=postgres`.

If using Docker Compose for Postgres, override via env var or user-secrets:

```bash
export ConnectionStrings__Default="Host=localhost;Database=accountingapi;Username=postgres;Password=postgres"
```

## Backend Commands

```bash
# Build (always use AccountingApi.sln, not the legacy root solution)
dotnet build AccountingApi.sln

# All tests
dotnet test AccountingApi.sln

# Unit tests (fast, no DB)
dotnet test tests/AccountingApi.UnitTests/AccountingApi.UnitTests.csproj

# Integration tests (requires Docker for Testcontainers Postgres)
dotnet test tests/AccountingApi.IntegrationTests/AccountingApi.IntegrationTests.csproj

# Filter to a specific test
dotnet test --filter "FullyQualifiedName~LoginCommandHandlerTests"

# Migrations
./scripts/migrate.sh add {MigrationName}
./scripts/migrate.sh update
./scripts/migrate.sh remove        # remove last (only if not yet applied)
./scripts/migrate.sh list

# Windows PowerShell
./scripts/migrate.ps1 -Command update
```

## Frontend Commands

```bash
cd accounting_web
pnpm dev           # development server
pnpm build         # production build
pnpm lint          # ESLint
pnpm type-check    # tsc --noEmit
pnpm test          # Vitest (unit + component)
pnpm test:watch    # Vitest watch mode
pnpm test:e2e      # Playwright
pnpm test:e2e:ui   # Playwright UI mode
```

**Do not use `npm` or `yarn`** — this project requires `pnpm`.

## AI Feature Workflow

Use the `/fullstack-feature-workflow` skill for building new features:

```
/fullstack-feature-workflow {feature-key}
```

Feature config files live at `docs/features/{folder}/config.yaml`. Copy from `.claude/templates/feature-config.template.yaml` to start a new feature. The skill auto-detects the current phase and runs it.

## Production Migrations

Production does not auto-migrate. Use the idempotent SQL script:

```bash
./scripts/migrate.sh script migration.sql
# Then apply migration.sql out-of-band to the production database
```

## Tech Stack Versions

| Component | Version |
|-----------|---------|
| .NET | 9 |
| Next.js | 15 |
| React | 19 |
| TanStack Query | v5 |
| AG Grid | (community) |
| PostgreSQL | 17 (Docker) |
| Redis | (optional, for cache) |
| Hangfire | 1.8.x (PostgreSQL storage) |
| FluentValidation | latest |
| MediatR | latest |
| Serilog | latest |
| Zod | latest |
| Zustand | latest |
| Sonner | latest (toast) |
