---
name: fullstack-feature-workflow
description: Cost-optimized router for the AccountingMini fullstack feature workflow. Auto-detects the next phase and loads only the needed phase skill. Use with /fullstack-feature-workflow {feature-key}.
---

# Fullstack Feature Workflow

## Purpose

This skill is a compact router. It must not duplicate the detailed instructions from the
13 phase skills. Its job is to resolve the feature, choose the next phase, enforce gates,
apply cost controls, then read only the phase skill required for the current step.

Keep this file synchronized with its counterpart in the other skills directory.

## Operating Role

Act as Principal Fullstack Architect, Senior Accounting BA, Senior .NET Backend Engineer,
Senior React Frontend Engineer, UI Pixel Review Engineer, QA Engineer, and Code Reviewer.

Prefer the lowest-cost workflow that can still safely complete the request.

## Command

```text
/fullstack-feature-workflow {feature}
```

Example:

```text
/fullstack-feature-workflow suppliers
```

## Source Files

Use `.claude/skills` in Claude runtimes and `.agents/skills` in Codex runtimes.
Do not load both copies during normal execution.

| Phase | Phase skill | Main output |
|---:|---|---|
| 1 | `01-frontend-basic-design` | `01-frontend-basic-design.md` |
| 2 | `02-frontend-ui-pixel-analysis` | `02-frontend-ui-pixel-analysis.md` |
| 3 | `03-backend-basic-design` | `03-backend-basic-design.md` |
| 4 | `04-backend-api-contract-review` | `04-api-contract-review.md` |
| 5 | `05-frontend-implementation-plan` | `05-frontend-implementation-plan.md` |
| 6 | `06-backend-implementation-plan` | `06-backend-implementation-plan.md` |
| 7 | `07-backend-coding` | source code + `07-backend-coding-summary.md` |
| 8 | `08-frontend-coding` | source code + `08-frontend-coding-summary.md` |
| 9 | `09-frontend-visual-review` | `09-frontend-visual-review.md` + `visual-review-issues.md` |
| 10 | `10-backend-testing` | `10-backend-test-plan.md` + tests |
| 11 | `11-frontend-testing` | `11-frontend-test-plan.md` + tests |
| 12 | `12-integration-testing` | `12-integration-test-plan.md` |
| 13 | `13-final-feature-review` | `13-final-feature-review.md` |

Read the selected phase skill only after the current phase is known and its gate is passable.

## Feature Resolution

1. Treat `{feature}` as the feature key.
2. Search `docs/features/*/config.yaml`.
3. Match by `feature: {feature}` first, then by folder name.
4. If no config matches, stop and ask the user to create one from `.claude/templates/feature-config.template.yaml`.
5. If multiple configs match, stop and ask the user which feature folder to use.
6. Use the matched folder as `docs/features/{feature-folder}`.

## Config Defaults

Read only the fields needed for routing and the current phase.
Do not read `.claude/templates/feature-config-guide.md` unless the user asks for field help or a field is ambiguous.

Default values when fields are missing:

```yaml
workflow_mode: auto
cost_profile: economy
documentation_level: compact
auto_approve: false
cost_optimization:
  enabled: true
  max_output: concise
  avoid_repeating_previous_docs: true
  summarize_existing_content: true
  only_expand_when_requested: true
  max_table_rows: 12
  max_doc_lines: 160
input_budget:
  current_images: 5
  input_markdown: 3
visual_review:
  enabled: true
  level: light
```

Record non-blocking assumptions in `issues.md`. Do not ask the user about optional fields unless correctness depends on them.

## Cost Profiles

| Profile | Use when | Defaults |
|---|---|---|
| `economy` | normal CRUD, small or medium changes | compact docs, light visual review, targeted tests, low input budget |
| `balanced` | cross-layer feature with moderate risk | standard docs, strict visual only for UI-heavy work, normal tests |
| `thorough` | accounting-critical, security/tenant-sensitive, or high-risk release | detailed docs allowed, strict visual, broader tests and review |

If `cost_profile` is missing, use `economy`.
Escalate to `balanced` or `thorough` only when risk requires it or the user explicitly asks.

## Workflow Mode

If `workflow_mode` is missing or `auto`, infer the cheapest safe mode:

| Mode | Use when | Phases |
|---|---|---|
| `quick_change` | label, color, typo, tiny UI/API adjustment | mini flow: analyze, plan, code, smoke test |
| `bugfix` | clear failing behavior | mini flow: root cause, fix plan, targeted code, targeted test, review |
| `ui_only` | UI only, mock data acceptable | 1, 2, 5, 8, 9, 11, 13 |
| `frontend_only` | frontend consumes existing/approved API | 1, 2, 4, 5, 8, 9, 11, 13 |
| `backend_only` | backend/API only | 3, 4, 6, 7, 10, 13 |
| `full` | new cross-layer feature or DB/API/UI change | 1-13 |

Do not default to `full` for small explicit requests.
If the mode cannot be inferred safely, ask once and recommend the cheapest safe mode.

## Input Budget

Use inventory-first input handling:

1. List files in `input/images/`, `input/markdown/`, and `actual/`.
2. Do not read/analyze every file by default.
3. Select only files relevant to the current phase and within the input budget.
4. If there are more files than the budget, prefer filenames that indicate list, detail, create, edit, error, empty, populated, or actual current screen.
5. Summarize skipped files by count and path. Do not load them unless needed.
6. Read `actual/` only for Phase 9 or when validating screenshots.

The old wording in phase skills such as "analyze each image" means "analyze each selected image within the active input budget" unless `cost_profile: thorough` or the user explicitly requests exhaustive analysis.

## Minimum Reads

Always read `workflow-status.md` before deciding the next phase.
Read `issues.md` only enough to find open blocking items.
Read `visual-review-issues.md` only when visual review is enabled or a gate depends on it.

| Phase | Minimum prior reads | Avoid unless needed |
|---:|---|---|
| 1 | config, selected `input/images/`, selected `input/markdown/` | backend docs/code |
| 2 | config, Phase 1 summary/scope, selected `input/images/` | backend docs/code |
| 3 | config, Phase 1 scope/API needs, Phase 2 grid/data implications | frontend implementation |
| 4 | Phase 1 API needs, Phase 2 data/grid notes, Phase 3 API draft | full phase docs over 300 lines |
| 5 | Phase 1 scope, Phase 2 visual constraints, Phase 4 contract | Phase 3 full design |
| 6 | Phase 3 backend scope, Phase 4 contract | frontend design docs |
| 7 | Phase 3, Phase 4, Phase 6, actual backend project structure | frontend docs/code |
| 8 | Phase 1, Phase 2, Phase 4, Phase 5, actual frontend project structure | backend implementation details |
| 9 | Phase 2, Phase 8 summary, selected source/actual screenshots | backend docs/code |
| 10 | Phase 3, Phase 4, Phase 6, backend test structure | frontend docs/code |
| 11 | Phase 1, Phase 2, Phase 4, Phase 5, frontend test structure | backend implementation details |
| 12 | Phase 4, Phase 9 summary, test outputs | full design docs |
| 13 | workflow-status, issues, visual issues, summaries/test outputs | full docs unless a finding requires it |

For any prior doc over 300 lines, first read only status, scope, contract, unclear items, and definition of done sections.

## Tracking Files

Use these files inside `docs/features/{feature-folder}/`:

- `workflow-status.md` for phase status only.
- `issues.md` for open/resolved assumptions, questions, defects, and blockers.
- `visual-review-issues.md` only for visual mismatches.

Do not duplicate the same issue across multiple tracking files.

Allowed phase status values: `Not Started`, `In Progress`, `Completed`, `Blocked`, `Skipped`.
Allowed review status values: `Pending`, `Approved`, `Changes Required`, `Not Required`.

If a phase output exists but lacks a status block, treat it as incomplete and ask whether to rebuild or add status.

## Phase Detection

1. Resolve feature and config.
2. Read or create tracking files.
3. Apply `workflow_mode` to mark excluded phases as `Skipped` / `Not Required`.
4. Starting from Phase 1, find the earliest phase that is not `Completed` with review status `Approved`.
5. Verify the output file exists when a phase is marked completed.
6. Check the gate for that phase.
7. Load only that phase skill and run the phase.
8. Update tracking files.
9. Stop, unless `auto_approve: true` and the safe auto-approve rules allow continuing.

## Gate Policy

Auto-approve does not waive quality gates. It only removes the manual "approve phase N" pause when the phase has no blocking issues.

General gates:

- Previous required phases must be `Completed` and review status `Approved`.
- No open `Blocking? = Yes` item may remain in `issues.md`.
- Skipped phases are allowed only when `workflow_mode` excludes them.
- Phase 4 must be `Approved`, not `Changes Required`, before implementation planning or coding.
- Phase 7/8 coding requires approved implementation plans. In standard mode also require explicit `confirm backend coding` or `confirm frontend coding`.
- Phase 9 requires actual screenshots. This cannot be auto-resolved.
- Phase 11 cannot start while open Critical/High visual issues remain.
- Phase 12 requires approved backend and frontend test phases.
- Phase 13 requires all required phases approved and no open blocking or Critical/High visual issues.

If a gate fails, report the smallest actionable blocker and stop.

## Auto-Approve

Default is `auto_approve: false`.

When `auto_approve: true`:

- Do not wait for `approve phase N` after a clean phase.
- Do not bypass blocking issues, missing screenshots, `Changes Required`, failed tests, 3-cycle escalation, missing config, or multiple config matches.
- Phase 7/8 coding confirmation is waived only if the implementation plan is approved and no blocker exists.
- If non-blocking unclear items exist, add them to one compact Q&A table and stop.
- After the user answers the Q&A table, update affected docs/issues and continue from phase detection.

## Output Rules

Phase documents:

- Use `documentation_level` and `cost_optimization.max_doc_lines`.
- Omit empty/non-applicable sections in compact mode.
- Reference previous docs by path instead of copying their content.
- Keep status, blockers, required decisions, and definition of done even when truncating.
- On updates, patch only affected sections unless more than half the document changed.

Chat response after a phase:

```markdown
# Workflow Result
- Feature: {name_vi} (`{feature}`)
- Phase: {n} - {phase name}
- Output: {path}
- Status: Completed | Blocked
- Blocking issues: None | {count}
- Next action: {approve phase n | answer questions | provide screenshots | fix blockers}
```

Do not paste phase document content into chat unless the user asks.

## Model Guidance

Use the least expensive model that can safely complete the task.

- Default to a strong general model for normal design, coding, and review.
- Use cheaper models/tools for isolated mechanical edits after the plan is explicit.
- Escalate to a stronger model only for conflicting accounting rules, tenant/security risk, severe API contract ambiguity, or repeated review/fix failure.
- Do not select expensive models by phase number alone.

## Safety

- Backend source belongs under `accounting_api/`.
- Frontend source belongs under `accounting_web/`.
- Feature docs belong under `docs/features/{feature-folder}/`.
- Backend tests belong under `accounting_api/tests/`.
- Frontend tests belong under `accounting_web/`.
- Do not expose EF entities directly in API contracts.
- Preserve user-reviewed content and unrelated user changes.
