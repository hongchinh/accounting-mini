# CLAUDE.md — AccountingMini

Project guide cho Claude Code khi làm việc trong monorepo này.

---

## Project Overview

**AccountingMini** là ứng dụng kế toán multi-tenant gồm hai sub-projects:

| Sub-project | Stack | Path |
|-------------|-------|------|
| `accounting_api` | .NET 9, Minimal API, MediatR, EF Core, PostgreSQL | `accounting_api/` |
| `accounting_web` | Next.js 15, React 19, TanStack Query v5, AG Grid | `accounting_web/` |

**Ignore:** `accounting_api/CLAUDE.md`, `accounting_api/AGENTS.md`, `accounting_web/.claude/`, `accounting_api/.agents/`, `accounting_api/.cursor/`, `accounting_web/.agent/`  
**Reason:** Each sub-project has its own agent config; loading them here causes conflicts and wastes context

---

## Context Loading Protocol

Before planning or implementing any feature, load documentation first:

### Step 1 — Load Root Entry Point

Read `docs/SUMMARY.md` to get the full documentation landscape. It contains:
- Architecture docs (multi-tenancy, auth flow, backend pipeline)
- Codebase maps (backend and frontend directory structure)
- Code standard (backend conventions, frontend conventions, dev workflow)
- Product PDR (goals, feature business rules)

The **Code Standard** section is critical for keeping code consistent. Always read it before writing any code.

### Step 2 — Load Detail Files on Demand

Use the file tables in `docs/SUMMARY.md` to identify and load only the detail files relevant to the current task. Do NOT load all files upfront.

**Code discovery rule:** Use documentation path maps before running Glob/Grep searches. Only fall back to Glob/Grep if the docs don't cover the needed area.

---

## Sub-Project Isolation

Do NOT load agent configurations from sub-projects:

- **Ignore:** `accounting_api/CLAUDE.md`, `accounting_api/AGENTS.md`, `accounting_web/.claude/`, `accounting_api/.agents/`
- **Exception:** `docs/` folders ARE allowed and expected

---

## Question Tool Mandate

Always use `AskUserQuestion` when asking a question during task execution. Do not ask questions in plain text.

Guidelines:
- Prefer selectable options (2–5 choices) over open-ended text when practical
- Ask exactly one question per message; do not bundle multiple questions
- Never interrupt the session/flow — users should only respond to the question asked

---

## AI Workflow

### Command

```
/fullstack-feature-workflow {feature-key}
```

Ví dụ:

```
/fullstack-feature-workflow danh-muc-nha-cung-cap
```

AI sẽ tự:
1. Tìm `docs/features/*/config.yaml` match với `feature: {feature-key}`
2. Đọc config và input folders
3. Detect phase tiếp theo chưa complete
4. Chạy đúng phase đó

### Skill files

Tất cả skill nằm tại `.claude/skills/`. Skill chính:

| File | Mục đích |
|------|---------|
| `.claude/skills/fullstack-feature-workflow.md` | Master workflow — 42 sections rules |
| `.claude/skills/01-frontend-basic-design.md` | Phase 1: Frontend Basic Design |
| `.claude/skills/02-frontend-ui-pixel-analysis.md` | Phase 2: Frontend UI Pixel Analysis |
| `.claude/skills/03-backend-basic-design.md` | Phase 3: Backend Basic Design |
| `.claude/skills/04-backend-api-contract-review.md` | Phase 4: Backend API Contract Review |
| `.claude/skills/05-frontend-implementation-plan.md` | Phase 5: Frontend Implementation Plan |
| `.claude/skills/06-backend-implementation-plan.md` | Phase 6: Backend Implementation Plan |
| `.claude/skills/07-backend-coding.md` | Phase 7: Backend Coding |
| `.claude/skills/08-frontend-coding.md` | Phase 8: Frontend Coding |
| `.claude/skills/09-frontend-visual-review.md` | Phase 9: Frontend Visual Review |
| `.claude/skills/10-backend-testing.md` | Phase 10: Backend Test |
| `.claude/skills/11-frontend-testing.md` | Phase 11: Frontend Test |
| `.claude/skills/12-integration-testing.md` | Phase 12: Integration Test |
| `.claude/skills/13-final-feature-review.md` | Phase 13: Final Feature Review |

### Feature config & input folders

Template: `.claude/templates/feature-config.template.yaml` → copy vào `docs/features/{folder}/config.yaml`

```
docs/features/{folder}/
├── config.yaml
├── images/                    ← ảnh UI hiện tại cần implement
└── references/
    ├── images/               ← ảnh UI tham khảo (MISA, KiotViet...)
    └── markdown/             ← tài liệu nghiệp vụ tham khảo
```

### Phase completion markers

```markdown
## Phase Status
Status: Completed
```

Phase 4 (API Contract) dùng:

```markdown
## Approval Status
Status: Approved
```

---

## Common Gotchas

Quick-reference cho các lỗi phổ biến nhất. Chi tiết đầy đủ trong `docs/`.

| Gotcha | Detail |
|--------|--------|
| Legacy solution file | `accounting_api/accounting_api.sln` là file cũ — dùng `AccountingApi.sln` trong `accounting_api/` |
| No controllers | Backend dùng `IEndpoint` (Minimal API), không có `ApiController` |
| No service layer | Logic nằm trong MediatR Handler — không tạo `IService` hay `IRepository` |
| Result, not ApiResponse | Backend trả `Result<T>` — endpoint dùng `.Match(Results.Ok, ApiResults.Problem)` |
| PostgreSQL, not SQL Server | Connection string dùng Npgsql; docker-compose và appsettings có DB name khác nhau |
| Next.js App Router | Frontend là Next.js 15 App Router — file-system routing, không có React Router |
| pnpm only | Dùng `pnpm`, không dùng `npm install` hay `yarn` |
| Module path | `src/modules/`, không phải `src/features/` |
| Tenant via header | `X-Tenant-Id` header (gắn tự động bởi Axios), không phải route param `/api/{tenantId}/` |
| Pagination fields | `total` / `page` / `sortDir` — không dùng `totalCount` / `pageIndex` / `sortDirection` |
| Single query filter | EF Core chỉ cho 1 `HasQueryFilter` per entity — tenant + soft-delete được combine trong `AppDbContext` |
| Hangfire schema | Hangfire tables nằm trong schema `hangfire` riêng — không model trong EF |
| Namespace | `AccountingApi.*` — không phải `Accounting.*` |
| Permission catalog | Thêm permission mới vào `src/Shared/Constants/Permissions.cs` và `src/config/permissions.ts` cùng lúc |

---

## Behavioral Guidelines

### 1. Think Before Coding

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions that YOUR changes made unused — but not pre-existing dead code.

### 4. Goal-Driven Execution

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"

For multi-step tasks, state a brief plan before starting:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

### 5. General Principles

- Follow every step in each workflow skill; do not skip required steps.
- Apply YAGNI, KISS, DRY, SOLID, and the principle of least surprise.
- Ask clarifying questions when documentation is unclear or critical context is missing.
- Generate timestamps with inline bash commands:
  - Folder name: `` `date +%y%m%d-%H%M` ``
  - Document timestamp: `` `date "+%Y-%m-%d %H:%M:%S"` ``
