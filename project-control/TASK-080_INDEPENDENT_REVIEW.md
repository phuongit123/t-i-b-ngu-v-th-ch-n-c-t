# TASK-080 — Independent Inventory Review (Initial Pass)

## Review status

**Status:** `IN_PROGRESS — INITIAL REVIEW PASS`  
**Reviewed branch:** `feat/task-080-affinity-tool-inventory`  
**Submitted commit:** `e65b9fd295d10edcee3afab807d339f738a6f01c`  
**Review date:** `2026-11-15`  
**Phase gate:** `BLK-007 ACTIVE — LOCKED`

This report records a first independent review slice. It does not sign off TASK-080 or certify the inventory denominator.

## 1. Structural checks reproduced from the submitted matrix

- 68 inventory data rows were parsed.
- 68 stable IDs were unique.
- All 68 rows contained the 16 required columns.
- Studio/domain distribution in the submitted matrix: Vector 29, Pixel 23, Layout 9, Automation 7.
- The 18 gap IDs appeared both in the inventory tables and in the gap-enumeration summary.
- Stage counts were internally consistent: 50 P4 + 18 V1 = 68 in-scope.
- Exclusions were 3, giving 71 total submitted records.

These checks establish internal table consistency only. They do not prove exhaustive discovery or source accuracy.

## 2. Direct source checks completed

| Record | Finding | Source |
|---|---|---|
| `VEC-001 — Move Tool` | The official guide says the tool is available by default in Vector, Pixel and Layout Studios, shortcut V. The actual guided Move Tool exercise is in D01-03; the submitted row previously mapped D01-01 and D01-02 only. The matrix mapping has been corrected to include D01-03 and its practice reference. | [Affinity Help Center — Move Tool](https://www.affinity.studio/help/tools-tools-move/) |
| `VEC-GAP-2 — Vector Flood Fill Tool` | Official guide confirms the feature exists in Vector Studio; it remains a gap because no current lesson/practice is mapped. A direct URL has been added to the matrix. | [Affinity Help Center — Flooding areas](https://www.affinity.studio/help/object-control-flooding-areas/) |
| `VEC-GAP-4 — Measure Tool` | September 2026 release notes name the feature Measure Tool and describe persistent dimension lines stored as layer objects. The previous “Measure & Area Tool” label and area-calculation claim exceeded the cited evidence; the matrix entry was narrowed. | [Affinity September 2026 release notes](https://www.affinity.studio/help/sep-26-release-notes/) |
| `LAY-GAP-4 — Preflight panel` | Official guide confirms on-demand, pre-export and live check modes plus configurable profiles. The matrix label was changed to “Preflight panel” and a direct URL added. | [Affinity Help Center — Preflight](https://www.affinity.studio/help/sharing-preflight/) |

## 3. Newly identified discovery candidates

The September 2026 desktop release notes contain capabilities not clearly represented by distinct records in the submitted matrix: Blend Tool, diffusion curves, G2 curve-energy controls, extended vector-warp presets, Deform Tool, Mask Tool, wavelet denoising, Astrophotography Studio and related tools, Scripting Studio, Scripts Library, Feature Finder, expanded Data Merge sources, and custom Preflight patterns.

They are recorded in Section 14.5 of `AFFINITY_TOOL_COVERAGE_MATRIX.md` as a discovery queue. They are **not yet added to the denominator** because some are contextual controls or extensions of existing records. The exact target build and studio placement must be confirmed first.

## 4. Findings still blocking acceptance

1. **Source traceability:** most of the 68 rows still contain source titles/internal labels rather than direct, independently retrievable URLs or retained direct-app evidence.
2. **P4 teaching evidence:** all 50 P4 claims still need a row-by-row check that the linked lesson actually explains the named tool, includes it in guided practice, and provides observable check criteria. A lesson reference alone is insufficient.
3. **Current build confirmation:** repository lessons cite Affinity 3.3.3.5004, but this remote review did not inspect the user's installed desktop build. Do not treat the repository string as live machine evidence.
4. **Denominator completeness:** the current 68 is an internally consistent submitted baseline, not yet an independently established exhaustive inventory. Reconcile the current release discovery queue and any shared-tool applicability before certification.
5. **Progress and handoff consistency:** Version 4.4.0 status lines, the 32.0% legacy task-count note, Phase 8 counters, and older CI statements need to be reconciled.
6. **CI:** the reported local tests on `e65b9fd` have not yet been independently confirmed by a GitHub Actions run on the same commit.

## 5. Current disposition

- Keep `TASK-080` at `IN_PROGRESS`.
- Do not describe 73.5% as a certified coverage result; it is a provisional count of submitted P4-stage claims.
- Keep `TASK-081` pending.
- Keep `BLK-007` ACTIVE — LOCKED.
- Next review slice: test each P4 mapping against the exact lesson's `toolAndFeatureExplanation`, `guidedPractice`, `commonPitfalls`, and check criteria; then source-check the discovery queue against the installed target build.

