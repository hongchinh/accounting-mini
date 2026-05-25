---
name: 02-frontend-ui-pixel-analysis
description: Phase 2: Extract pixel measurements and design tokens from screenshots.
---

# Skill 02 - Frontend UI Pixel Analysis

## Role

Senior UI Engineer (pixel-perfect), Senior React Frontend Architect.

## Goal

Create the Phase 2 UI pixel analysis document from current/reference screenshots and the Phase 1 frontend design. This phase defines layout measurements, design tokens, typography, grid/table behavior, interaction states, and a pixel review checklist before backend design and frontend implementation planning.

## Source of Truth

Follow `.claude/skills/fullstack-feature-workflow.md`, Section 10: `Phase 2 Rules - Frontend UI Pixel Analysis`.

## Input

- `docs/features/{feature-folder}/config.yaml`
- `docs/features/{feature-folder}/01-frontend-basic-design.md`
- `docs/features/{feature-folder}/images/`
- `docs/features/{feature-folder}/references/images/`
- `docs/features/{feature-folder}/references/markdown/` if relevant for visual behavior
- Existing project style guide if available

## Output

```text
docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md
```

Optional support files:

```text
docs/features/{feature-folder}/ui-spec/design-tokens.md
docs/features/{feature-folder}/ui-spec/layout-measurement.md
```

## Rules

1. Do not write source code in `accounting_web/` or `accounting_api/`.
2. Analyze all available screenshots relevant to this phase.
3. Mark low-confidence measurements and missing visual states as unclear items.
4. Add blocking unclear items to `issues.md` using the workflow issue format.
5. Set Phase Status according to the master workflow status rules.

## Next Step

Phase 3 - Backend Basic Design, using `.claude/skills/03-backend-basic-design.md` after Phase 2 is approved.

