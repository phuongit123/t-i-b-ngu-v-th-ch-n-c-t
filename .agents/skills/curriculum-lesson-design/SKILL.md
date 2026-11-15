---
name: curriculum-lesson-design
description: Designs, audits, or revises Affinity Academy lessons so they teach verified current Affinity tools, measurable learning outcomes, visual communication principles, independent practice, and transferable design judgement.
---

# Curriculum Lesson Design

## 1. Read before authoring

Read `LEARNING_OUTCOMES.md`, `AFFINITY_TOOL_COVERAGE_MATRIX.md`, the applicable track specification, lesson schema, nearby lessons, and task acceptance criteria. Confirm the current task is eligible under `BLK-007`.

## 2. Start with the learner outcome

For each lesson, specify:
- which observable `PLO-xx` outcome(s) it advances;
- what the learner must be able to do by the end;
- what evidence will demonstrate success;
- prerequisite tools/concepts and the next transfer step.

Use measurable verbs and visible success conditions. Avoid vague objectives such as "understand everything about the tool".

## 3. Explain design reasoning, not just UI actions

Teach the relevant principles at the right point in the workflow:
- brief, audience, purpose, message, and constraints;
- hierarchy, composition, contrast, alignment, proximity, repetition, balance, and spacing;
- typography, color, imagery, tone, and consistency;
- tool selection and alternatives;
- editability, non-destructive methods, and production delivery where applicable.

Explain why one method fits the brief and when another approach would be better.

## 4. Apply the ten-section teaching contract

Preserve the existing JSON schema and field names. Every lesson must provide:

1. `learningObjectives`: measurable objectives and success criteria.
2. `foundationalKnowledge`: conceptual model and prerequisites.
3. `toolAndFeatureExplanation`: exact current-version name, location, purpose, key options, verified shortcuts/modifiers, and limitations.
4. `stepByStepInstructions`: reproducible steps with decision points and explanations.
5. `visualExamples`: useful visual evidence, comparisons, or before/after.
6. `guidedPractice`: coached repetition with clear checkpoints.
7. `independentChallenge`: a materially different brief/asset/constraint that requires learner choices.
8. `commonPitfalls`: how to recognize likely errors and recover safely.
9. `knowledgeCheck`: conceptual why/when checks plus appropriate factual/procedural checks.
10. `summaryAndResources`: key principles, verified references, and reflection/transfer prompt.

Confirm the exact schema from the repository rather than inventing alternative field names. Run curriculum validation after any lesson change.

## 5. Independent practice quality

The independent challenge must not be a cosmetic reskin of the demonstration. Change at least one meaningful dimension such as audience, communication goal, content, format, asset constraints, brand, or production requirement. The learner should have to:
- interpret the brief;
- choose tools and workflow;
- make visual decisions;
- inspect and revise the result;
- explain key decisions;
- export or deliver the requested output.

Provide rubric/check criteria that assess both the artifact and the reasoning. Do not reveal a step-by-step solution that removes the intended decisions.

## 6. Technical accuracy and scope

- Use the exact current Affinity product build and current Layout / Vector / Pixel terminology.
- Link each tool/feature to its stable Tool Coverage Matrix ID.
- Cite authoritative current documentation or direct application evidence for version-sensitive steps.
- Mark shortcuts and modifiers unknown until verified.
- Explicitly label V2 / StudioLink legacy instructions.
- Do not assume that a browser simulator is identical to the native Affinity application.
- Do not conflate desktop UI tools with scripting/API/MCP operations.

## 7. Review before completion

Check accuracy, clarity, accessibility of visuals, schema compliance, outcome alignment, practice transfer, and assessment evidence. A lesson passing JSON validation does not automatically pass instructional QA. Keep `TASK-079` pending until every in-scope lesson/track mapping is actually present and independently reviewed.
