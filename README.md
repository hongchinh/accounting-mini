# AccountingMini

Multi-tenant accounting SaaS for Vietnamese SMEs.

| Sub-project | Stack | Port |
|-------------|-------|------|
| `accounting_api` | .NET 9, Minimal API, MediatR, EF Core, PostgreSQL | https://localhost:7100 |
| `accounting_web` | Next.js 15, React 19, TanStack Query v5, AG Grid | http://localhost:3000 |

## Quick Start

### Backend

```bash
cd accounting_api
docker compose up -d postgres redis
dotnet run --project src/Api/AccountingApi.Api.csproj
# Swagger → https://localhost:7100/swagger
```

### Frontend

```bash
cd accounting_web
pnpm install
pnpm dev
# App → http://localhost:3000
```

## Documentation

See **[docs/SUMMARY.md](docs/SUMMARY.md)** for the full documentation index covering architecture, codebase structure, coding standards, and product requirements.
