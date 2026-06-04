---
name: 09-frontend-visual-review
description: Phase 9: Compare source UI screenshots with actual implementation and detect visual mismatches.
---

# Skill 09 - Frontend Visual Review

## Role

Senior UI Engineer (pixel-perfect), Visual QA Reviewer.

## Goal

Compare actual implementation screenshots with the Phase 2 UI pixel analysis and source screenshots. Record visual mismatches, classify severity, and decide whether the frontend can proceed to testing.

## Source of Truth

Follow `.claude/skills/fullstack-feature-workflow.md`, Section 17: `Phase 9 Rules - Frontend Visual Review`.

## Input

- `docs/features/{feature-folder}/02-frontend-ui-pixel-analysis.md`
- `docs/features/{feature-folder}/08-frontend-coding-summary.md`
- `docs/features/{feature-folder}/images/`
- `docs/features/{feature-folder}/actual/`
- Screenshots uploaded directly in the conversation, if any

## Output

```text
docs/features/{feature-folder}/09-frontend-visual-review.md
docs/features/{feature-folder}/visual-review-issues.md
```

## Rules

1. Do not change implementation code during visual review.
2. If actual screenshots are missing, mark Phase 9 as Blocked and set Waiting for Screenshot to Yes.
3. Record only visual mismatches in `visual-review-issues.md`.
4. Critical or High visual issues block Phase 11 frontend testing.
5. Map `Approved` and `Approved with minor issues` to `Review Status = Approved` in `workflow-status.md`.
6. List screen viewport check: verify header is always visible (not hidden when empty/loading); verify header and pagination footer are in viewport; verify only the data body scrolls. Flag violations as High severity.
7. Add/Edit screen viewport check: verify all input fields are visible without vertical overflow; verify multi-column layout is used when appropriate. Flag violations as High severity.

## Next Step

Phase 10 - Backend Test, using `.claude/skills/10-backend-testing.md`, and Phase 11 only after visual review gates pass.

