# ANTIGRAVITY OPERATING GUIDE — AFFINITY ACADEMY

## Purpose

This guide makes the Project Owner's approved product direction available to Antigravity in the actual repository workspace. It is an onboarding and operating guide for the workspace customizations stored in `.agents/`; it does not replace the project's source-of-truth governance documents.

## 1. Authoritative direction

Affinity Academy must develop learners who can independently understand and use the in-scope Affinity tools **and** think like designers. It is not merely a catalogue of 120 click-by-click tutorials.

Before planning curriculum or product work, read:

1. `AGENTS.md` — always-on repository instructions and non-negotiable constraints.
2. `project-control/MASTER_SPEC.md` — product scope and architecture (check its status and reconcile outdated statements against newer owner-approved decisions).
3. `project-control/LEARNING_OUTCOMES.md` — observable programme learning outcomes, design-thinking method, lesson teaching contract, competency levels, and graduation rubric.
4. `project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md` — authoritative inventory model, evidence stages, and completeness rules.
5. `project-control/REQUIREMENTS.md` and `project-control/TASK_REGISTRY.md` — traceability, task owner, dependencies, acceptance criteria, and status.
6. `project-control/ACCEPTANCE_CRITERIA.md` — software and programme-level acceptance.
7. `project-control/BLOCKERS.md`, `project-control/PROGRESS.md`, and `project-control/HANDOFF.md` — current gate, progress, and handoff (verify freshness against GitHub and the current branch before relying on historical statements).

When documents conflict, do not silently choose the most convenient wording. Prefer explicit, newer Project Owner decisions and the specific learning-outcome standards; record and reconcile the conflict in the appropriate control document.

## 2. Approved learning model

Teach and assess this design-thinking cycle:

**Discover → Define → Explore → Plan → Create → Evaluate → Iterate → Deliver**

Learners must understand why a tool is appropriate, when an alternative is better, what important options and limitations apply, and how to judge the visual result. Tutorials are scaffolding, not the end state. Independent challenges must differ materially from the demonstration.

Use the programme outcomes `PLO-01` through `PLO-11` and the ten-section teaching contract in `LEARNING_OUTCOMES.md`. Do not weaken the lesson schema to make weak instructional content pass.

## 3. Product terminology and tool scope

- The current Affinity desktop product is taught through its **Layout, Vector, and Pixel** studios/workspaces.
- Designer, Photo, and Publisher may remain as familiar learning-domain/course labels, but they must map to the current studios and must not imply three separate current applications.
- Affinity V2 / StudioLink references are historical or legacy and must be labelled as such.
- Scripting, JavaScript DOM API, and MCP are a distinct automation strand. Do not conflate API methods with visible desktop tools.
- Do not hardcode an old Affinity version. Record the exact installed build and verify version-sensitive claims against current official references and/or direct application evidence.

## 4. Evidence discipline

Every tool inventory claim must be traceable to a current source or direct application observation, with version/build and verification date. Mark unknowns as unknown. Use the matrix stages `U0`, `V1`, `D2`, `X3`, `P4`, and `A5` only when the required evidence exists.

Keep these three types of evidence separate:

1. **Platform quality:** lint, typecheck, curriculum validation, build, and E2E tests.
2. **Curriculum coverage:** verified tool inventory, outcome mapping, demonstrations, practice, and assessment.
3. **Learner competence:** independent performance on new tasks with retained evidence and rubric review.

A passing platform test does not prove tool coverage or learner competence. A lesson title or encyclopedia mention does not prove independent mastery. Never invent ratings, testimonials, progress, tool names, shortcuts, feature behaviour, or test results.

## 5. Task and phase governance

- Every substantive change must map to an existing `TASK-xxx` and `REQ-xxx`, or propose a new traceable task before implementation.
- Respect task ownership, dependencies, acceptance criteria, and independent QA.
- `TASK-079`, `TASK-080`, and `TASK-081` remain pending until their actual deliverables and independent acceptance evidence exist.
- The current next learning-work sequence is to perform the version-scoped tool audit and map the existing 66 lessons before proposing extra lesson content.
- `BLK-007` remains **ACTIVE — LOCKED**. Do not author Publisher B02–B10, Scripting S02–S10, or start the deferred Monaco/MCP Playground/Supabase expansion unless the Project Owner explicitly unlocks that work.
- Do not merge PR #1 into `main`, close it, force-push, rewrite shared history, deploy, or perform destructive environment changes without the relevant explicit authorization.
- Never discard an uncommitted working tree or overwrite another agent's work to make a branch switch easier.

## 6. Antigravity workspace customizations

Antigravity discovers project rules from repository-level `AGENTS.md`, `.agents/AGENTS.md`, and immediate Markdown children of `.agents/rules/`. Workspace skills live in `.agents/skills/<skill-name>/SKILL.md`.

This repository intentionally keeps the customizations project-scoped and version-controlled. Do not copy project policy into global `~/.gemini` settings unless the user separately asks for workstation-wide behavior.

The repository provides these skills:

| Skill | Use |
|---|---|
| `/academy-session-orientation` | Reconcile branch, tasks, blockers, and owner direction before substantive work |
| `/academy-product-implementation` | Implement application or platform changes in line with the learning model |
| `/affinity-tool-audit` | Populate and verify the current-version Layout/Vector/Pixel inventory |
| `/curriculum-lesson-design` | Design or revise lessons against PLOs and the ten-section teaching contract |
| `/independent-capstone-assessment` | Design transfer challenges, assessment rubrics, and graduation evidence |
| `/quality-gate-handoff` | Run the relevant checks and produce an exact-SHA evidence-based handoff |

## 7. First-use setup and verification

1. Open the repository root as the Antigravity workspace — the folder containing `AGENTS.md`, `package.json`, and `.agents/`.
2. Confirm Antigravity has discovered the workspace rules and skills in its Customizations panel. The rules should include the Affinity Academy governance rule; the skills list should include the six names above.
3. Start a fresh agent turn after opening or updating the workspace so discovery is refreshed.
4. Invoke `/academy-session-orientation` before the first substantive task.
5. Ask the agent to report the current branch, working-tree status, active blockers, next eligible task, and which governing files it read. It must not modify files simply to prove discovery.

Antigravity surfaces may present the Customizations panel in slightly different menus. In the IDE, use the agent side-panel menu and choose **Customizations**; in the App, open **Customizations** from the application menu or project settings. Workspace rules and skills are discovered from the repository paths described above.

## 8. Branch synchronization safety

The published Phase 5 review branch is `fix/phase5-stabilization`; PR #1 is still a review request, not permission to merge into `main`.

Before synchronizing a local workspace:

- Inspect `git status --short --branch` and `git branch --show-current`.
- If the working tree is dirty, preserve and report the changes before switching branches.
- If already on `fix/phase5-stabilization` with a clean tree, fetch and use a fast-forward-only update.
- If on another branch, do not reset, force checkout, or overwrite work. Explain the safe options and obtain permission before any operation that could affect existing local work.
- Never assume a remote branch is current without checking its HEAD.

## 9. Current implementation status

At the time this guide was authored, PR #1 is open against `main`, and the learning-outcome specifications exist. The actual comprehensive current-version tool inventory, complete lesson-to-tool/outcome mapping, independent capstone implementation, and graduation QA remain unfinished. Re-check live GitHub and the control documents each session rather than treating this paragraph as permanent status.
