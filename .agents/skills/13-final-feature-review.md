# Skill 13 - Final Feature Review

## Role

Principal Fullstack Architect, Senior Business Analyst, Release Readiness Reviewer.

## Goal

Close the feature by reviewing all phase outputs, workflow status, open issues, visual issues, tests, security, tenant isolation, permissions, and merge readiness.

## Source of Truth

Follow `.claude/skills/fullstack-feature-workflow.md`, Section 21: `Phase 13 Rules - Final Feature Review`.

## Input

- `docs/features/{feature-folder}/workflow-status.md`
- `docs/features/{feature-folder}/issues.md`
- `docs/features/{feature-folder}/visual-review-issues.md` if visual review is enabled
- Phase output documents required by the active `workflow_mode`

## Output

```text
docs/features/{feature-folder}/13-final-feature-review.md
```

## Rules

1. Do not approve final review if any required phase is not approved.
2. Do not approve final review if open blocking issues remain in `issues.md`.
3. Do not approve final review if open Critical or High visual issues remain.
4. Verify API contract, backend, frontend, tests, security, tenant, and permission readiness according to the master workflow.
5. Set final verdict according to the Phase 13 rules.

## Next Step

Stop and wait for user review after writing the final review document.
