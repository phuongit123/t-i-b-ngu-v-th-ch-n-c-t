---
name: affinity-tool-audit
description: Performs the evidence-backed, version-scoped inventory and curriculum mapping of the current Affinity Layout, Vector, and Pixel studios, including visible tools, panels, contextual controls, production features, and verified shortcuts.
---

# Affinity Tool Coverage Audit

## Objective

Execute the discovery and evidence work registered as `TASK-080` / `REQ-LEARN-002`. Establish the denominator from the real current product scope before making coverage claims.

## Procedure

### 1. Freeze the audit context

Record:
- exact Affinity product name and installed version/build;
- operating system and relevant app edition;
- audit date;
- whether each observation came from official documentation, direct application inspection, or another source;
- the scope of the audit and any unavailable surfaces.

Do not assume that a historical "Affinity 3.0" note is the currently installed version.

### 2. Discover systematically

Audit the current Layout, Vector, and Pixel studios/workspaces separately. Include distinct record types from the matrix:

1. interactive tools and modes;
2. studios and panels;
3. contextual controls and important modifiers/options;
4. document setup, editing, and production/export features;
5. shortcuts for Windows and macOS only when independently verified.

Use the application itself and current official Affinity documentation. Search menus, toolbars, contextual toolbars, panels/studios, document dialogs, and production/export workflows. Maintain a discovery checklist so entire UI areas are not skipped.

Do not count every menu item as a separate tool. Preserve a stable identifier and explicit `record_type`.

### 3. Capture evidence for every record

Populate the required fields from `AFFINITY_TOOL_COVERAGE_MATRIX.md`: stable ID, exact user-facing name, product/build, studio, purpose, core actions/options, shortcuts, limitations, lesson/practice refs, criticality, authoritative sources, verification date/method, stage, and review owner.

- Mark absent evidence as unknown; do not infer shortcuts from other Affinity versions or other operating systems.
- If official docs and the installed app disagree, record both observations and raise a discrepancy instead of silently choosing one.
- Keep API/MCP methods in a separate automation inventory. Do not imply every UI tool has an API or every API method has a UI control.
- Keep Affinity V2 / StudioLink content in an explicitly separate legacy inventory.

### 4. Stage evidence honestly

Use the matrix stages exactly:
- `U0`: candidate, not verified;
- `V1`: current source/application evidence verified;
- `D2`: accurately documented;
- `X3`: reproducible demonstration exists;
- `P4`: guided practice and feedback/check criteria exist;
- `A5`: independent assessment on a new task with retained evidence.

A mention in a lesson title is not D2. A demonstration is not P4. A guided exercise is not A5.

### 5. Map to existing learning content

First map the verified inventory to the existing 66 lessons and relevant `PLO-01`–`PLO-11` outcomes. For every entry, identify:
- lesson reference(s);
- whether the lesson provides accurate explanation, demonstration, guided practice, and independent assessment;
- gaps, outdated terminology, unverified shortcuts, and missing workflows;
- core/supporting criticality and rationale.

Propose content corrections or new lesson needs as a gap report. Do not silently change the planned lesson count or create Publisher B02–B10 / Scripting S02–S10 while `BLK-007` is locked.

### 6. QA and reporting

Ask for independent QA of inventory completeness, evidence provenance, classification, and lesson mappings. Keep unresolved entries visible. Publish denominator and coverage percentages only after independent review of scope and exclusions.

## Exit criteria for TASK-080

Do not mark complete until:
- the current scope and build are explicit;
- all discovered in-scope records have required fields and provenance;
- exclusions and V2 legacy entries are explicit;
- records map to actual existing lessons/practice or are clearly marked as gaps;
- the inventory has independent QA sign-off.

A finished inventory document without the actual audit and evidence is not completion.
