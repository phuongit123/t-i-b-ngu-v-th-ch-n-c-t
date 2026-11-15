# AFFINITY ACADEMY — AFFINITY TOOL COVERAGE MATRIX

## Document Control
- **Document ID:** `TOOL-COVERAGE-001`
- **Version:** `1.0.0`
- **Status:** `MATRIX SPECIFIED / INVENTORY POPULATION AND AUDIT PENDING`
- **Last Updated:** `2026-11-15`
- **Governing Roles:** `CurriculumAgent` / `AffinityMCPAgent` / `QAAgent`

---

## 1. Purpose and Scope

This matrix is the source of truth for proving that the curriculum teaches the tools and relevant feature controls within a declared Affinity product scope. It exists to prevent tools from being omitted merely because the current lesson plan does not mention them.

The current product is taught through its Layout, Vector, and Pixel studios/workspaces. Course labels such as Designer, Photo, and Publisher are learning domains and must be mapped to the current product terminology. Affinity V2 StudioLink information is legacy context only and must be separated from current-product instructions.

The scripting/API domain is tracked separately from the desktop application's visible tools. An API method is not automatically a desktop tool, and a desktop tool is not assumed to have a supported API equivalent.

## 2. Inventory Classes

Maintain separate entries or clearly typed child records for:

1. **Interactive tools:** toolbar tools and modes a learner selects to create, select, transform, edit, draw, paint, crop, or inspect content.
2. **Studios and panels:** stateful editing or inspection surfaces, such as layer, color, typography, asset, resource, history, or preflight areas where applicable.
3. **Contextual controls:** context toolbar options, tool-specific modifiers, snapping/constraint behaviours, and important operation settings.
4. **Document and production features:** setup, page/artboard operations, masks, adjustments, symbols, placed assets, export and print/publishing features.
5. **Keyboard shortcuts:** Windows and macOS bindings, including modifiers, only when verified for the declared product/version.
6. **Automation capabilities:** scripting/API/MCP operations in a separate inventory linked to the relevant desktop workflow where a verified relationship exists.

Do not inflate the count by treating every option as a separate tool. Keep the record type explicit so reports can distinguish tools, panels, controls, production features, and automation methods.

## 3. Required Matrix Fields

Every inventory record must include the fields below. Use `Not applicable` with a reason where a field genuinely does not apply; do not leave an unexplained blank.

| Field | Required value |
|---|---|
| `tool_id` | Stable unique identifier; never reuse an ID for a different function. |
| `record_type` | Tool, studio/panel, contextual_control, production_feature, shortcut, or automation_capability. |
| `product_scope` | Exact current Affinity product/build or explicitly labelled legacy scope. |
| `studio_or_workspace` | Layout, Vector, Pixel, or the verified applicable workspace. |
| `official_name` | Exact user-facing name as shown in the application/reference. |
| `purpose` | What problem it solves, in plain language. |
| `core_actions` | Main operations and important options. |
| `shortcuts` | Verified Windows/macOS keys and modifiers, or explicit unknown/not applicable. |
| `constraints_and_limitations` | Important dependencies, destructive/non-destructive behaviour, and known limitations. |
| `lesson_refs` | Lesson IDs that teach the item. |
| `practice_refs` | Guided practice and independent challenge IDs. |
| `criticality` | Core or supporting, with rationale. |
| `authoritative_sources` | Official documentation and/or direct application evidence. |
| `verified_on` | Date, product/build, and verification method. |
| `coverage_stage` | Current coverage stage from Section 4. |
| `review_owner` | Person/role responsible for the next review. |

### Blank entry template

| tool_id | record_type | product_scope | studio_or_workspace | official_name | purpose | core_actions | shortcuts | constraints_and_limitations | lesson_refs | practice_refs | criticality | authoritative_sources | verified_on | coverage_stage | review_owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `TBD` | `U0` | `TBD` |

The template row is not an inventory entry and must not be counted.

## 4. Coverage Stages

Coverage stage describes curriculum evidence for each inventory record.

| Stage | Name | Required evidence |
|---|---|---|
| `U0` | Unverified inventory candidate | Candidate observed or reported; identity, scope, and behaviour not yet verified. |
| `V1` | Source verified | Exact name and behaviour confirmed against current authoritative documentation and/or the target application. |
| `D2` | Documented | Purpose, use cases, important options, constraints, and verified shortcuts explained in curriculum/reference content. |
| `X3` | Demonstrated | A reproducible visual demonstration or annotated example exists. |
| `P4` | Practised | A guided exercise and learner feedback/check criteria exist. |
| `A5` | Independently assessed | A new task assesses appropriate independent selection and use; evidence is retained. |

A record advances only when evidence for that stage exists. A lesson title or a mention in prose is not sufficient evidence.

## 5. Criticality and Minimum Coverage

- **Core:** Essential to common workflows or a declared module/track outcome. Must reach `A5` before the relevant track can be signed off.
- **Supporting:** Useful, specialist, or less frequently used. Must reach at least `P4`; its limitations and discovery path must be documented.
- **Out of scope:** Must have an explicit reason and, where appropriate, a legacy/product-version label. It must not disappear silently from the inventory.

For every in-scope entry, the matrix must link at least one lesson. Core entries must also link an independent assessment. If a tool is only documented in the encyclopedia but never practised, it is not fully covered.

## 6. Completeness Reporting

Publish counts only after the inventory denominator has been established through a version-scoped audit.

Report separately:
- total verified in-scope interactive tools;
- total verified studios/panels, contextual controls, and production features;
- total core and supporting entries;
- entries at each coverage stage;
- entries with no lesson, no practice, or no authoritative evidence;
- explicit exclusions and legacy-only entries.

Coverage percentage must use verified in-scope records as the denominator, not the set of records already present in the curriculum. Do not claim 100% coverage while the inventory is still being discovered or while exclusions are unresolved.

## 7. Evidence and Audit Rules

1. Record exact product name/build, OS, audit date, and source for version-sensitive behaviour.
2. Prefer current official Affinity documentation; use direct application inspection to confirm actual interface labels and behaviours where possible.
3. Treat community tutorials as supplementary evidence, not the sole authority for exact shortcuts, modifier behaviour, or version-specific claims.
4. When official documentation and the installed app disagree, record the discrepancy, do not silently choose one, and raise an audit item.
5. Re-audit affected entries when the product changes materially.
6. Keep legacy Affinity V2/StudioLink records separate and visibly labelled.
7. A test passing in the web academy validates the platform behaviour, not the accuracy or completeness of the Affinity tool inventory.

## 8. Initial Status

No complete, current-version tool inventory is asserted by this document. The matrix schema, verification stages, and coverage rules are defined; actual enumeration, authoritative source capture, lesson mapping, and independent audit remain pending.

The first implementation task is to inventory the current application by Layout, Vector, and Pixel studio/workspace, then map verified entries to the existing 66 lessons before proposing any additional lesson count. This audit must not unlock Track 3 or Track 4 implementation while `BLK-007` remains active and locked.
