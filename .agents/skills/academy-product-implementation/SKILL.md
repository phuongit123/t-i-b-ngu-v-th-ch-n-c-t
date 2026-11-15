---
name: academy-product-implementation
description: Plans and implements Affinity Academy web-platform, UI, UX, data, or engineering changes while preserving the approved learning outcomes, truthful progress semantics, current product terminology, and phase governance.
---

# Affinity Academy Product Implementation

## 1. Establish intent and scope

1. Run `/academy-session-orientation` or follow its procedure.
2. Translate the request into a concrete learner or operator problem.
3. Map the change to an existing `TASK-xxx` and `REQ-xxx`; inspect dependencies and acceptance criteria.
4. Identify the smallest coherent implementation that improves the learner journey. Do not redesign unrelated areas.

## 2. Product invariants

- The product's north star is independent Affinity tool competence plus transferable design thinking.
- Every major learner-facing feature should help the learner understand a concept, choose a tool/workflow, practise, receive useful feedback, assess their result, or transfer the skill to a new brief.
- Distinguish accurately between:
  - curriculum content available in the platform;
  - lessons a learner has completed;
  - skills a learner has demonstrated independently.
- Never label content availability as learner progress, or lesson completion as mastery.
- Do not invent ratings, testimonials, learner counts, instructor identities, integration status, or successful interactions.
- Do not display success for a form or action that has not actually completed.
- Use Layout, Vector, and Pixel for current studio/workspace terminology. Keep course labels Designer, Photo, Publisher as learning-domain labels only. Keep Automation/MCP as a separate strand.
- Mark V2 / StudioLink references as legacy. Never use them as current architecture.
- Design interfaces that make the learning process visible: brief, goal, tool choice, execution, critique, iteration, and deliverable.

## 3. Engineering workflow

1. Inspect existing patterns, state management, routing, styling tokens, types, and nearby tests before editing.
2. Preserve established architecture and accessibility. Reuse components where appropriate; avoid adding dependencies for trivial functionality.
3. Validate loading, empty, error, success, responsive, and keyboard states relevant to the feature.
4. Add or update tests that prove the changed behavior, not just that a component renders.
5. Do not replace real integrations with fake success handlers or hard-coded data presented as live data.
6. Keep educational simulators clearly distinguished from the real Affinity application; do not imply a browser simulator is the native tool.
7. Avoid unrequested broad refactors and avoid editing unrelated curriculum or governance records.

## 4. Verification

Run the narrowest useful tests during development, then the repository's full quality gate before claiming completion where feasible. Record exact commands and results. Tie CI evidence to the commit it actually tested; a later commit invalidates an exact-HEAD claim until rechecked.

## 5. Completion report

State the task/requirement mapping, learner problem solved, files changed, behavior added/removed, verification results, residual limitations, and whether independent QA remains pending.
