# TASK-080 — Independent Affinity Tool Inventory Review (Round 2)

## Review status

- **Document ID:** `TASK-080-REV-001`
- **Status:** `IN_PROGRESS — P4 EVIDENCE CROSS-CHECKED; SOURCE, BUILD AND DENOMINATOR AUDIT OPEN`
- **Submitted baseline:** `main` after PR #3 merge `d31150666787100d1c87332f7b7564eb43498025`
- **Review branch:** `qa/task-080-independent-evidence-audit`
- **Review date:** `2026-11-15`
- **Governing requirement:** `REQ-LEARN-002`
- **Phase gate:** `BLK-007 ACTIVE — LOCKED`

This is an independent review continuation. It improves traceability and tests the current P4 claims against the lesson JSON. It does **not** approve the 68-row denominator or complete TASK-080.

## 1. Reproduced baseline

| Check | Reproduced result |
|---|---:|
| Inventory records | 50 |
| Unique record IDs | 50 |
| P4-stage claims | 50 |
| Other in-scope records | 0 |
| Exclusion records | 3 (outside the 68 in-scope rows) |
| Lesson IDs referenced by P4 records | 53 unique lesson IDs |
| P4 rows with old synthetic `*-PRAC` practice IDs | 0 after this update |

The submitted arithmetic (68 in-scope + 3 exclusions = 71 total; 50 P4 claims + 18 V1 claims = 68) is internally consistent. It remains a **submitted baseline**, not independently proven exhaustive product coverage.

## 2. P4 lesson-evidence cross-check

All 50 P4 record rows reference 53 distinct lesson JSON files. The previous row-by-row inspection established that these referenced lesson definitions contain:
- `standardSections.toolAndFeatureExplanation`;
- non-empty `standardSections.guidedPractice` with observable checkpoints and an expected outcome;
- an `independentChallenge` with criteria.

This proves the lesson JSON includes practice structures. It does not, by itself, prove that every named tool action is precisely exercised or that it matches the current installed application. The matrix now replaces synthetic `D01-03-PRAC`-style tokens with exact paths to `#standardSections.guidedPractice` and `#standardSections.independentChallenge` for each referenced lesson.

### Row-level corrections made

| Record | Correction | Reason |
|---|---|---|
| `VEC-001` Move Tool | Narrowed lesson references to `D01-03` only; narrowed the claimed actions | D01-03's guided checkpoints explicitly select and reposition/snap objects with Move Tool. D01-01 and D01-02 are not direct Move Tool guided-practice evidence. |
| `PIX-007` Curves & Levels | Removed `P03-02`; retained `P05-02` | P03-02 guides Live Depth of Field, not Curves/Levels. P05-02 explicitly guides Curves tonal work. |
| `PIX-006` Layers | Renamed from “Layers Studio & Pixel Groups” to “Layers Studio & Layer Groups” | P03-01 teaches grouping and layer hierarchy; the mapped practice does not establish the narrower “Pixel Groups” claim. |
| `PIX-014` Live Filters | Added `P03-02` alongside `P06-01` | P03-02 guided practice explicitly uses a Live Depth of Field Filter. |
| `PIX-016` Live Lighting | Renamed from “Live Lighting & Lens Studio” to “Live Lighting & Optical Effects” | The mapped lesson identifies Live Lighting Studio & Optical Effects; “Lens Studio” was not supported by the lesson evidence. |

These corrections narrow over-claimed coverage and add a supported Live Filter mapping. They do not increase the 68-record denominator.

## 3. P4 source provenance

P4 source fields were normalized to direct official links where a relevant page was located. Sources without a retrievable official URL are explicitly marked as requiring direct-app evidence rather than being represented by an internal source title.

| Source status | P4 records |
|---|---:|
| No direct URL located in this pass | 6 |
| URL linked but broad or version/compatibility-limited | 9 |
| URL linked without a specific caveat in the matrix | 35 |
| **Total P4 records** | **50** |

Records still lacking a direct URL: `VEC-002`, `VEC-011`, `VEC-020`, `VEC-022`, `PIX-012`, `AUT-002`.

A URL link is not automatic verification. Broad feature pages are marked as partial where they do not specify the exact panel or operation. The two SDK-linked Automation records cite the public **Affinity JavaScript SDK 3.3.1** documentation; that does not establish compatibility with the curriculum-declared desktop build 3.3.3.5004. The project-local MCP bridge is not an Affinity vendor-native feature and is identified separately.

### P4 record register

| Record | Inventory name | Lesson refs | Source disposition |
|---|---|---|---|
| `VEC-001` | Move Tool | D01-03 | URL linked |
| `VEC-002` | Artboard Tool | D01-02 | No direct URL |
| `VEC-003` | Pen Tool | D02-01 | URL linked |
| `VEC-004` | Node Tool | D02-02 | URL linked |
| `VEC-005` | Contour Tool | D04-03 | URL linked |
| `VEC-006` | Corner Tool | D03-01 | Partial / compatibility-limited |
| `VEC-007` | Parametric Shapes | D03-01 | URL linked |
| `VEC-008` | Boolean Operations | D03-02 | URL linked |
| `VEC-009` | Compound Shapes | D03-03 | URL linked |
| `VEC-010` | Fill Tool | D04-01 | URL linked |
| `VEC-011` | Stroke Studio & Pressure Graph | D04-02 | No direct URL |
| `VEC-012` | Layers Studio | D05-01 | URL linked |
| `VEC-013` | Layer Clipping & Masking | D05-02 | URL linked |
| `VEC-014` | Blend Modes & Blend Options | D05-03 | URL linked |
| `VEC-015` | Artistic & Frame Text Tools | D06-01 | URL linked |
| `VEC-016` | Text-on-Path Engine | D06-02 | URL linked |
| `VEC-017` | Typography & Glyphs Studios | D06-03 | URL linked |
| `VEC-018` | Snapping & Snapping Manager | D01-03, D07-03 | URL linked |
| `VEC-019` | Grid & Axis Manager | D07-01 | Partial / compatibility-limited |
| `VEC-020` | Isometric Studio | D07-02 | No direct URL |
| `VEC-021` | Symbols Studio | D08-01 | Partial / compatibility-limited |
| `VEC-022` | Assets Studio | D08-02 | No direct URL |
| `VEC-023` | Constraints Studio | D08-03 | Partial / compatibility-limited |
| `VEC-024` | Export Persona & Slice Tool | D10-01, D10-02 | URL linked |
| `VEC-025` | SVG & PDF/X Optimizer | D10-03 | URL linked |
| `PIX-001` | Develop Persona & RAW Engine | P01-02, P09-01 | URL linked |
| `PIX-002` | Crop & Straighten Tool | P01-03 | Partial / compatibility-limited |
| `PIX-003` | Selection Brush Tool | P02-01 | Partial / compatibility-limited |
| `PIX-004` | Refine Selection Studio | P02-02 | URL linked |
| `PIX-005` | Layer Mask System | P02-03 | URL linked |
| `PIX-006` | Layers Studio & Layer Groups | P03-01 | URL linked |
| `PIX-007` | Curves & Levels Adjustment Studio | P05-02 | URL linked |
| `PIX-008` | Blend Modes & Advanced Clipping | P03-03 | URL linked |
| `PIX-009` | Inpainting Brush Tool | P04-01 | URL linked |
| `PIX-010` | Clone Stamp & Healing Brush | P04-02 | URL linked |
| `PIX-011` | Frequency Separation | P04-03 | URL linked |
| `PIX-012` | Histogram Studio | P05-01 | No direct URL |
| `PIX-013` | HSL, Gradient Map & LUT Studio | P05-03 | URL linked |
| `PIX-014` | Live Filters Suite | P03-02, P06-01 | URL linked |
| `PIX-015` | Denoise & Sharpening Studio | P06-02 | URL linked |
| `PIX-016` | Live Lighting & Optical Effects | P06-03 | Partial / compatibility-limited |
| `PIX-017` | Live Perspective & Warp | P07-02 | URL linked |
| `PIX-018` | Macro Studio & Batch Jobs | P09-03 | URL linked |
| `PIX-019` | Color Management & Soft Proofing | P10-02 | URL linked |
| `LAY-001` | Document Setup & Bleed Engine | B01-01 | URL linked |
| `LAY-002` | Master Pages Studio & Fields | B01-02 | URL linked |
| `LAY-003` | Frame Text Tool & Baseline Grid | B01-03 | URL linked |
| `AUT-001` | Application Module | S01-01 | Partial / compatibility-limited |
| `AUT-002` | MCP Status & Bridge | S01-02 | No direct URL |
| `AUT-003` | Document Module | S01-03 | Partial / compatibility-limited |

## 4. Version and product-boundary findings

- The curriculum JSON and inventory declare **Affinity desktop 3.3.3.5004**. This remote review did not inspect the user's installed application. Matrix product-scope fields now label the build as curriculum-declared and explicitly mark the local installation unverified.
- The public SDK page presently identifies its reference as **Affinity SDK 3.3.1**. SDK documentation version and desktop application build are separate facts; do not infer compatibility without a runtime check.
- Official desktop release information located in this review includes the 15 September 2026 desktop update. The official 2 November 2026 announcement concerns **Affinity for iPad**, a separate platform. The current inventory remains scoped to desktop until the owner explicitly expands the target platform.
- `AUT-002` is a project-local MCP bridge. The `execute_script`, `render_spread`, and `render_selection` calls are MCP integration endpoints, not automatically native tools in the Affinity desktop app.

## 5. Current-release discovery queue

The official September 2026 release notes identify candidates that need reconciliation before the 68-row denominator can be treated as complete. The list includes:
- Blend Tool (distinct interactive tool);
- diffusion curves (fill type/control, not necessarily a separate tool);
- G2 curve-energy display and snapping (contextual control on Pen/Node);
- extended Vector Warp presets (likely an update to an existing gap);
- Deform Tool (new tool candidate);
- Mask Tool (multi-studio tool; deduplicate with existing masking records);
- Wavelet denoising (feature/tool classification still to settle);
- Astrophotography Studio, Astro Stretch, Wavelet Denoise and Plate Solving (workspace plus child tools/panels);
- Scripting Studio and Scripts Library (native in-app workspace/library, distinct from local MCP);
- Feature Finder (supporting discovery utility);
- Canva Sheets live refresh and custom Preflight text patterns (updates to existing records, not automatic new rows).

The official release notes are the discovery source, not proof that each item is present in the curriculum's installed target build. Reconcile names, studio placement, record types and overlap before adding any denominator rows.

## 6. Remaining acceptance work

1. **Exact source verification:** resolve the six P4 records with no direct URL, and replace any broad source references that do not support the exact claimed behaviour with target-app evidence or a precise official page.
2. **App/build verification:** obtain direct evidence for the exact desktop build being taught (Help/About or equivalent) and verify relevant tool names and studios in that build.
3. **Gap-row V1 verification:** re-check all 18 V1 labels. Four rows had initial direct-source checks, but all 18 have not yet been exhaustively verified against the current build.
4. **Denominator completeness:** reconcile the September desktop release candidates, deduplicate controls against existing records, and preserve a separate desktop/iPad scope.
5. **Automation boundary:** separate native Affinity scripting Studio/Library and SDK capabilities from this project's MCP server endpoints.
6. **CI:** run the repository Quality Gate against this review branch and record the exact tested SHA before closing TASK-080.

## 7. Disposition

- Keep `TASK-080` **IN_PROGRESS**.
- Treat 50 P4 as **provisional claims**, not a certified 73.5% tool-coverage result.
- Do not mark `TASK-081` active until both TASK-079 and TASK-080 are formally complete.
- Keep `BLK-007` **ACTIVE — LOCKED**.
- Do not author Publisher B02–B10 or Scripting S02–S10.
