---
name: quality-gate-handoff
description: Selects and runs the appropriate Affinity Academy validation and test commands, verifies the exact commit or GitHub Actions run, and writes an honest QA and session handoff.
---

# Quality Gate and Handoff

## 1. Determine verification scope

Inspect `package.json`, CI configuration, affected files, and task acceptance criteria. Choose:
- documentation-only: Markdown/link/frontmatter/structure checks as available; do not imply application tests ran;
- lesson/schema changes: curriculum validator and relevant validator tests;
- code/UI changes: affected unit/E2E tests plus lint and typecheck;
- release/PR candidate: full CI-equivalent quality gate.

Use commands that actually exist in the current repository. Do not assume an old script name.

## 2. Verify in layers

For the current repository, check the scripts available in `package.json`; where present, the full quality gate includes:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run validate:curriculum`
5. `npm run test:validator`
6. `npm run test:scripts`
7. `npm run build`
8. `npm run test:e2e` (including the configured browser installation when required)

Run commands sequentially where they share generated state or dependencies. Capture failures and investigate root causes rather than hiding or retrying blindly.

## 3. Exact evidence rules

- Record the exact commit SHA tested.
- For GitHub Actions, record workflow name, run ID, conclusion, commit SHA, relevant job steps, and artifact link when available.
- A successful run for an older SHA does not certify a newer HEAD.
- If new documentation-only commits follow an app test, report the distinction: the app tests passed on the earlier tested code SHA; documentation files were not covered by the application suite.
- Never convert a cancelled/skipped test into PASS.
- Never claim a check was run unless logs or local command output confirm it.

## 4. Documentation and handoff

Update the appropriate status records only when evidence is available:
- `project-control/PROGRESS.md`: current status and exact evidence;
- `project-control/HANDOFF.md`: files, task state, blockers, current branch/commit, next safe step;
- PR description: verification status and scope, without claiming merge or approval that has not occurred.

Do not replace a newer agent's edits. Fetch the current file before editing and use the latest content.

## 5. Final report

Report exact commands/checks, results, tested SHA, run URL/artifact, skipped checks, remaining risks, task status, and whether `BLK-007` remains locked. Separate software quality evidence from curriculum coverage and learner-competency evidence.
