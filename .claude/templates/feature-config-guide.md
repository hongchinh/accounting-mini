# Feature Config Guide

## Purpose

`docs/features/{feature-folder}/config.yaml` is the compact per-feature configuration file used by `/fullstack-feature-workflow`.

The config should stay short and only contain feature-specific data.

Detailed explanations must stay in this guide or in the workflow skill, not inside config.yaml.

## Required Fields

| Field | Meaning |
|---|---|
| role | Feature type: fullstack, web, api |
| feature | Command key used by `/fullstack-feature-workflow {feature}` |
| folder | Feature folder under `docs/features/` |
| name_vi | Vietnamese feature name |
| output_type | Output document type, usually markdown |
| workflow_mode | Workflow mode: full, frontend_only, backend_only, ui_only, bugfix, quick_change |
| documentation_level | compact, standard, detailed |
| project.backend | Backend folder |
| project.frontend | Frontend folder |
| input.current_ui_images | Current UI screenshots |
| input.reference_ui_images | Reference UI screenshots |
| input.reference_markdown | Reference business/usage docs |
| input.actual_ui_images | Actual screenshots after frontend coding |
| entities | Main domain entities |
| permissions | Permissions used by frontend/backend |
| capabilities | Functional capabilities |
| business_rules | Business rule keys |
| api.base_path | API base path |
| api.resource | API resource name |

## Cost Optimization Rules

- Keep config.yaml compact.
- Do not add long comments in config.yaml.
- Put explanations in this guide.
- AI should only read fields required for the current phase.
- AI should not repeat the full config in phase documents.
- AI should summarize config values when needed.
- Missing optional fields should use workflow defaults and be recorded as assumptions in `issues.md`.

## Workflow Modes

| Mode | Use Case |
|---|---|
| full | Full frontend + backend + tests + integration |
| frontend_only | UI/frontend work when API already exists |
| backend_only | API/backend work only |
| ui_only | Pixel UI/mock data only |
| bugfix | Fix a specific bug |
| quick_change | Small change such as label/button/column update |

## Documentation Levels

| Level | Behavior |
|---|---|
| compact | Short docs, fewer tables, lower token cost |
| standard | Balanced detail |
| detailed | Full analysis for complex features |

## Visual Review Levels

| Level | Behavior |
|---|---|
| off | Skip UI pixel and visual review phases |
| light | Review major layout/colors/components only |
| strict | Pixel-focused review, blocks on Critical/High issues |

## Recommended Config Strategy

Use a compact config per feature.

Do not duplicate workflow rules in config.

Use `.claude/skills/fullstack-feature-workflow.md` for workflow behavior.

Use `.claude/templates/feature-config-guide.md` for field explanations.
