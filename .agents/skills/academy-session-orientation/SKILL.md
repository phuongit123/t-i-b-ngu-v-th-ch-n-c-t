---
name: academy-session-orientation
description: Reconciles the Affinity Academy project direction, Git branch and working tree, active phase gates, task dependencies, and current handoff before substantial work. Use at the start of a new implementation or curriculum session and whenever asked to continue.
---

# Affinity Academy Session Orientation

## Objective

Start from the repository's actual state, not from stale chat memory or an assumed task list. Do not implement changes until the eligible task and governing constraints are clear.

## Procedure

1. Inspect the working tree and branch:
   - `git status --short --branch`
   - `git branch --show-current`
   - inspect relevant local and remote refs without changing them.
2. Read the mandatory source-of-truth files:
   - `AGENTS.md`
   - `project-control/MASTER_SPEC.md`
   - `project-control/LEARNING_OUTCOMES.md`
   - `project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md`
   - `project-control/REQUIREMENTS.md`
   - `project-control/TASK_REGISTRY.md`
   - `project-control/ACCEPTANCE_CRITERIA.md`
   - `project-control/BLOCKERS.md`
   - `project-control/PROGRESS.md`
   - `project-control/HANDOFF.md`
3. Reconcile document status with the live GitHub PR/branch and latest commit. Treat dates, run IDs, and SHAs as historical until checked.
4. Identify the user's explicit request, map it to an existing task and requirement, then inspect task dependencies and acceptance criteria.
5. Check phase gates. If blocked, do only work that is explicitly allowed outside the gate (for example, the approved current-version tool inventory and mapping to the existing lessons); do not expand locked tracks or deferred modules.
6. Give a short plan for multi-step changes. Ask only when an authorization or a required input is genuinely missing; otherwise make a safe best effort.

## Current priority

The approved learning work is evidence-backed current-version tool discovery and mapping the existing 66 lessons to verified tools and programme outcomes. This does not authorize writing the remaining Publisher or Scripting lessons. Keep `TASK-079`–`TASK-081` pending until each acceptance condition is met.

## Branch safety

- Never discard a dirty tree to change branches.
- Never use force push or history rewrite as a routine sync method.
- Use fast-forward-only updates when the intended branch and clean state are confirmed.
- PR #1 is for review; do not merge it into `main` without explicit authorization.
- Do not make destructive file, database, deployment, or OS changes without explicit authorization.

## Session closeout

Report: task/requirement, files changed, commands executed, exact commit SHA, test outcomes, unresolved evidence/gaps, and whether the phase gate remains locked. Do not call a documentation-only specification an implemented deliverable.
