# AFFINITY ACADEMY — LESSON-LEVEL PROGRAMME OUTCOME MAP

## Document Control

- **Document ID:** `PLO-MAP-001`
- **Version:** `1.0.0`
- **Status:** `INDEPENDENT QA APPROVED — FULL 66/66 ROW-BY-ROW VERIFICATION COMPLETE`
- **Last Updated:** `2026-11-15`
- **Branch:** `feat/task-079-learning-outcome-mapping`
- **Scope:** All 66 currently existing curriculum lessons (60 core + 6 pilot)
- **Governing requirement:** `REQ-LEARN-001`
- **Related task:** `TASK-079`

## 1. Purpose and acceptance boundary

This document maps each existing lesson to the approved Programme Learning Outcomes (PLO-01–PLO-11) using the lesson's actual objectives, tool explanation, guided practice, independent challenge, and knowledge-check content.

**This is an instructional alignment map, not a learner-performance certification.** A lesson mapped to a PLO does not prove that a learner achieved that outcome. An independentChallenge field is a learning opportunity, not retained A5 assessment evidence.

The map has completed independent row-by-row QA against the 66 current lesson JSON files. The reviewer verified lesson IDs/titles, named tools, guided-practice checkpoint counts, independent-challenge titles, and the corresponding criteria counts. This approves the mapping as curriculum-alignment evidence; it does not certify learner achievement or A5 competence.

## 2. Evidence notation

- **T — Taught:** the lesson objectives, foundational content, or tool explanation directly teach the outcome.
- **G — Guided practice:** the guided exercise includes an observable activity relevant to the outcome.
- **X* — Independent challenge opportunity:** the lesson contains a challenge prompt relevant to the outcome. The reviewer must confirm that the task changes the brief/constraints sufficiently to require learner choice; the marker does **not** mean A5 has been achieved.
- **PLO assignment:** each row lists the outcomes supported by the lesson. Outcomes are not weighted scores and are not a claim that every part of the programme-level outcome is fully taught in that lesson.

The mapping deliberately does not assign PLO-11 to Photo Macro/Batch lessons: the approved PLO-11 is specifically about verified scripting/API/MCP use, while macro recording is an in-app production feature.

## 3. Programme outcome coverage — lesson-level mapping count

Counts below show how many of the 66 lesson rows are mapped to each outcome at this initial pass. Multiple outcomes may be mapped to the same lesson; these counts must not be added together as a course-completion percentage.

| Outcome | Lesson rows mapped | Interpretation |
|---|---:|---|
| `PLO-01` | 15 / 66 | Tool literacy and locating/explaining tools. |
| `PLO-02` | 26 / 66 | Choosing tools and workflows for task constraints. |
| `PLO-03` | 66 / 66 | Technical execution, controls, file operations and workflows. |
| `PLO-04` | 29 / 66 | Editable/non-destructive methods and safe revision. |
| `PLO-05` | 40 / 66 | Visual communication, composition, hierarchy and craft. |
| `PLO-06` | 21 / 66 | Typography and color judgement. |
| `PLO-07` | 4 / 66 | Brief and production-spec interpretation. |
| `PLO-08` | 15 / 66 | Diagnosis, critique and purposeful iteration. |
| `PLO-09` | 23 / 66 | Editable source, output settings and production delivery. |
| `PLO-10` | 55 / 66 | Transfer challenge opportunities; not yet independently assessed. |
| `PLO-11` | 3 / 66 | Verified scripting/API/MCP learning in the Scripting pilot. |
 
**Important:** A higher row count does not imply deeper coverage. In particular, a PLO mapped through one guided activity is not equivalent to a complete track-level outcome with repeated practice and independent assessment.

## 4. Lesson-level mapping

### Track 1 — Designer / Vector domain (30 lessons)

| Lesson | Title | Mapped outcomes and evidence | Mapping note |
|---|---|---|---|
| `D01-01` | Designer Workspace Anatomy & Persona Switching | `PLO-01` T/G; `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-09` X* | Persona switching, hybrid layers, clipped pixel texture, export slice. |
| `D01-02` | Artboard Architecture vs Single Canvas Setup | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` X*; `PLO-09` T/G; `PLO-10` X* | Responsive artboard sizes, hierarchy, bleed and profile setup. |
| `D01-03` | Vector View Modes, Pixel Preview, Grids & Snapping Systems | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G/X* | Pixel alignment, view modes, grids and snapping; independent isometric cube. |
| `D02-01` | Pen Tool Modes & Bezier Handle Mechanics | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G; `PLO-10` X* | Pen modes, Bezier handles, node placement; swan silhouette challenge. |
| `D02-02` | Node Classifications & Node Tool Manipulation | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Node types, handles, alignment and heart-sculpting challenge. |
| `D02-03` | Path Operations, Joining, Breaking & Stroke Joins | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Path topology and stroke geometry; ribbon/calligraphy challenge. |
| `D03-01` | Parametric Shape Primitives & Corner Tool Mechanics | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Parametric primitives, editable geometry and corner decisions. |
| `D03-02` | Boolean Geometry Operations (5 Operations) | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Boolean selection and layer order; interlocking rings challenge. |
| `D03-03` | Non-Destructive Compound Shapes & Geometry Optimization | `PLO-03` T/G; `PLO-04` T/G; `PLO-02` G; `PLO-10` X* | Live compound edits, child modes and preserving source geometry. |
| `D04-01` | Fill Tool & Multi-Stop Gradients (5 Types) | `PLO-03` T/G; `PLO-05` G/X*; `PLO-06` T/G; `PLO-10` X* | Gradient selection, color stops, opacity and tonal transitions. |
| `D04-02` | Stroke Studio, Custom Dashes & Vector Pressure Curves | `PLO-03` T/G; `PLO-05` G/X*; `PLO-06` G; `PLO-10` X* | Stroke construction, pressure, rhythm and calligraphic form. |
| `D04-03` | Contour Tool (Offset Curves) & Expand Stroke | `PLO-03` T/G; `PLO-04` T/G; `PLO-09` G; `PLO-10` X* | Live offsets, expand stroke and die-cut/production preparation. |
| `D05-01` | Layers Studio Hierarchy, Grouping & Color Tagging | `PLO-01` T/G; `PLO-03` T/G; `PLO-09` G; `PLO-10` X* | Scene graph, layer semantics, organization and handoff hygiene. |
| `D05-02` | Vector Clipping (Child Nesting) vs Vector Masking | `PLO-03` T/G; `PLO-04` T/G; `PLO-02` G; `PLO-10` X* | Choosing and applying editable clipping and vector masks. |
| `D05-03` | Layer Blend Modes, Blend Ranges & Isolation Mode | `PLO-03` T/G; `PLO-04` G; `PLO-05` T/G; `PLO-06` G/X* | Blend-mode choice, tonal interaction and isolating edit context. |
| `D06-01` | Artistic Text vs Frame Text & Text Hierarchy | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` T/G; `PLO-06` T/G; `PLO-10` X* | Text-role selection, hierarchy, pairing, kerning and editorial composition. |
| `D06-02` | Text-on-Path & Circular Badges | `PLO-03` T/G; `PLO-05` G/X*; `PLO-06` T/G; `PLO-10` X* | Curved type, baseline placement, legibility and circular badge construction. |
| `D06-03` | OpenType Features, Glyph Browser & Text Styles Hierarchy | `PLO-01` T/G; `PLO-03` T/G; `PLO-05` G; `PLO-06` T/G; `PLO-10` X* | OpenType, glyph discovery, reusable text styles and type-system design. |
| `D07-01` | Axonometric & Isometric Grid Configuration | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Grid model selection and geometric construction along isometric axes. |
| `D07-02` | Isometric Studio & Fit-to-Plane Workflow | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Projection-plane choice and composing visual elements in 3D space. |
| `D07-03` | Snapping Candidates & 3D Vector Assembly | `PLO-03` T/G; `PLO-05` G/X*; `PLO-10` X* | Precision assembly, snapping, intersections and seam diagnostics. |
| `D08-01` | Symbol Creation & Multi-Instance Synchronization | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G; `PLO-10` X* | Reusable symbols, global synchronization and local overrides. |
| `D08-02` | Assets Studio & Portable .afassets Libraries | `PLO-03` T/G; `PLO-04` G; `PLO-09` T/G; `PLO-10` X* | Asset organization, reusable libraries and distribution packaging. |
| `D08-03` | Scalable Vector Component Systems & Variants | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-05` T/G; `PLO-06` G; `PLO-10` X* | Responsive components, variants, nested symbols and design tokens. |
| `D09-01` | Pixel Persona & Raster Brush Dynamics in Designer | `PLO-01` T/G; `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-05` G/X* | Distinguishing vector and pixel brush workflows and calibrated texture. |
| `D09-02` | Non-Destructive Child Pixel Clipping & Masking | `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G/X*; `PLO-10` X* | Nested pixel layers, clipping, alpha protection and controlled shading. |
| `D09-03` | Hybrid Vector-Raster Workflow & DPI Management | `PLO-03` T/G; `PLO-04` G; `PLO-09` T/G; `PLO-05` G/X* | Resolution trade-offs, vector noise, raster texture and print export. |
| `D10-01` | Export Persona Workspace & Slices Architecture | `PLO-01` T/G; `PLO-03` T/G; `PLO-09` T/G; `PLO-10` X* | Slice types, naming, export destinations and production packaging. |
| `D10-02` | Multi-Density Formats & Continuous Export Engine | `PLO-03` T/G; `PLO-09` T/G; `PLO-10` X* | Density, output formats, path templates and continuous delivery. |
| `D10-03` | Clean SVG Code Optimization & Press-Ready PDF/X | `PLO-03` T/G; `PLO-05` G; `PLO-06` G; `PLO-09` T/G; `PLO-10` X* | SVG hygiene, PDF/X, bleed, printer marks and commercial handoff. |

### Track 2 — Photo / Pixel domain (30 lessons)

| Lesson | Title | Mapped outcomes and evidence | Mapping note |
|---|---|---|---|
| `P01-01` | Photo Interface, Toolbars & Studio Panels | `PLO-01` T/G; `PLO-03` T/G; `PLO-04` T/G | Workspace navigation and first non-destructive adjustment-layer exercise. |
| `P01-02` | RAW Develop Persona & 32-bit HDR Color Pipelines | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-06` G; `PLO-09` G/X* | RAW development, highlight recovery, white balance and lens correction. |
| `P01-03` | Non-Destructive Canvas Geometry, Crop Tool, DPI & Resampling | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` G; `PLO-09` T/G; `PLO-10` X* | Crop/straighten selection, composition overlay and resampling decisions. |
| `P02-01` | Selection Tools & Core Selection Principles | `PLO-01` T/G; `PLO-02` T/G; `PLO-03` T/G; `PLO-10` X* | Choose and combine selection methods for geometric and organic edges. |
| `P02-02` | Refining Selections & Complex Edge Detection | `PLO-03` T/G; `PLO-04` G; `PLO-08` G; `PLO-10` X* | Matte refinement, edge diagnosis and output choice. |
| `P02-03` | Pixel Masks & Non-Destructive Masking Architectures | `PLO-03` T/G; `PLO-04` T/G; `PLO-08` G; `PLO-10` X* | Mask logic, invert, paint/recover and non-destructive selective color. |
| `P03-01` | Layer Types, Organization & Scene Hierarchy | `PLO-01` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-09` G | Pixel/Image layer distinction, organization, naming and reusable template. |
| `P03-02` | Adjustment Layers & Live Filter Architecture | `PLO-03` T/G; `PLO-04` T/G; `PLO-08` G; `PLO-10` X* | Live filters, adjustment choices and built-in mask controls. |
| `P03-03` | Clipping, Grouping & Blend Mode Mathematics | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G/X*; `PLO-06` G | Blend-mode choice, clipping boundaries and visual light/material effects. |
| `P04-01` | Inpainting, Patch Tool & Smart Object Removal | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-08` G; `PLO-10` X* | Choosing inpainting/patch methods and protecting source pixels. |
| `P04-02` | Clone Stamp, Healing Brush & Restoration Concepts | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-08` G; `PLO-10` X* | Clone versus healing decisions, aligned sampling and restoration challenge. |
| `P04-03` | Frequency Separation & High-End Portrait Workflow | `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G; `PLO-06` G; `PLO-08` G; `PLO-10` X* | Frequency-specific retouching and controlled dodge-and-burn workflow. |
| `P05-01` | Exposure, Dynamic Range & White Balance Calibration | `PLO-03` T/G; `PLO-05` G; `PLO-06` T/G; `PLO-08` G; `PLO-10` X* | Histogram diagnosis, clipping alerts and mixed-light white-balance decisions. |
| `P05-02` | Curves, Levels & Precision Tonal Control | `PLO-03` T/G; `PLO-05` G/X*; `PLO-06` T/G; `PLO-10` X* | Tonal control, RGB channel reasoning and S-curve/film-look choices. |
| `P05-03` | Creative Color Grading, HSL, Gradient Maps & 3D LUTs | `PLO-03` T/G; `PLO-05` G/X*; `PLO-06` T/G; `PLO-09` G; `PLO-10` X* | Color-system choices, grading, LUT creation and cross-app delivery. |
| `P06-01` | Live Filters & Dynamic Filter Workflows | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G; `PLO-10` X* | Live perspective/displace and non-destructive mockup workflow. |
| `P06-02` | Blur, Sharpening & Sensor Noise Reduction | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-05` G; `PLO-08` G; `PLO-10` X* | Choosing blur/sharpen/noise-reduction methods and diagnosing artifacts. |
| `P06-03` | Live Lighting, Bump Maps & Atmospheric Effects | `PLO-03` T/G; `PLO-05` T/G; `PLO-06` G; `PLO-10` X* | Lighting direction, material response and atmospheric visual composition. |
| `P07-01` | Visual Planning, Light Direction & Perspective Matching | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` T/G; `PLO-07` T/G; `PLO-10` X* | Plan source light, perspective, horizon, focal length and composite structure. |
| `P07-02` | Horizon Alignment, Live Perspective & Warp Groups | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` T/G; `PLO-05` G; `PLO-10` X* | Choose perspective/warp method and maintain editable transformations. |
| `P07-03` | Multi-Image Edge Blending, Light Wrap & 2-Tier Shadow Systems | `PLO-03` T/G; `PLO-04` G; `PLO-05` T/G; `PLO-08` G; `PLO-10` X* | Evaluate edge, light, shadow and grain consistency across composite plates. |
| `P08-01` | Text Layers, Artistic vs Frame Text & Character/Paragraph Typography | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` T/G; `PLO-06` T/G; `PLO-10` X* | Typography role selection, hierarchy, OpenType and shape integration. |
| `P08-02` | Vector Shape Integration & Quick FX / Studio Layer Effects | `PLO-02` T/G; `PLO-03` T/G; `PLO-05` T/G; `PLO-06` G; `PLO-10` X* | Shape and effect selection, coherent commercial graphic treatment. |
| `P08-03` | Designing Promotional Commercial Compositions & Text Behind Subject | `PLO-03` T/G; `PLO-05` T/G; `PLO-06` G; `PLO-07` G; `PLO-08` G; `PLO-10` X* | Promotional visual hierarchy, subject masking, depth and CTA composition. |
| `P09-01` | RAW Sensor Decoding, 32-bit Float Pipeline & Basic Panel Tone Mapping | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-06` G; `PLO-09` G | RAW output mode selection, exposure recovery and tone pipeline. |
| `P09-02` | Optical Lens Corrections, Chromatic Aberration & Defringing | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-09` G; `PLO-08` G | Diagnose lens distortions, select correction workflow and verify geometry. |
| `P09-03` | Batch Processing, Macro Recording & Photography Presets | `PLO-03` T/G; `PLO-09` T/G; `PLO-10` X* | Macro recording, interactive parameters and batch output pipeline; not counted as API/MCP PLO-11. |
| `P10-01` | Export Persona Slices, Multi-Format 1x/2x/3x & Continuous Export | `PLO-03` T/G; `PLO-09` T/G; `PLO-10` X* | Export configuration and automated slice pipeline. |
| `P10-02` | Color Spaces (sRGB vs P3 vs Adobe RGB) & File Compression (WebP, JPEG XL, TIFF, PSD) | `PLO-03` T/G; `PLO-06` T/G; `PLO-09` T/G; `PLO-10` X* | Color profile, rendering intent and channel-specific output choices. |
| `P10-03` | Capstone Project — End-to-End Commercial Portrait/Landscape Master Workflow | `PLO-03` T/G; `PLO-04` T/G; `PLO-05` T/G; `PLO-07` G; `PLO-08` G; `PLO-09` T/G; `PLO-10` X* | Integrated guided capstone lesson and independent poster brief; not a programme graduation A5 assessment. |

### Track 3 — Publisher / Layout pilot (3 lessons)

| Lesson | Title | Mapped outcomes and evidence | Mapping note |
|---|---|---|---|
| `B01-01` | Publication Architecture, Facing Pages, Slug & Bleed Standards | `PLO-03` T/G; `PLO-05` G; `PLO-07` T/G; `PLO-09` T/G; `PLO-10` X* | Interpret print specification, document structure, binding, bleed and color profile. |
| `B01-02` | Master Pages Foundations & Dynamic Page Numbering | `PLO-02` T/G; `PLO-03` T/G; `PLO-04` G; `PLO-09` G; `PLO-10` X* | Master hierarchy, inherited fields, local overrides and page-system setup. |
| `B01-03` | Baseline Grids, Flow Columns & Frame Margins | `PLO-03` T/G; `PLO-05` T/G; `PLO-06` G; `PLO-09` G; `PLO-10` X* | Vertical rhythm, text flow, baseline grid and overset diagnostics. |

### Track 4 — Scripting / Automation pilot (3 lessons)

| Lesson | Title | Mapped outcomes and evidence | Mapping note |
|---|---|---|---|
| `S01-01` | Affinity JS Runtime Architecture, V8 Engine & Sandbox Limits | `PLO-01` T/G; `PLO-03` T/G; `PLO-08` G; `PLO-10` X*; `PLO-11` T/G | Runtime, modules, permissions, diagnostic script and defensive errors. |
| `S01-02` | Connecting to Local Affinity MCP Server (Port 6767) & SSE Bridge | `PLO-02` T/G; `PLO-03` T/G; `PLO-08` G; `PLO-10` X*; `PLO-11` T/G | MCP concepts, health check, transport boundaries and reconnection logic. |
| `S01-03` | First Automation Script: Programmatic Document & Session UUID Extraction | `PLO-03` T/G; `PLO-08` G; `PLO-09` G; `PLO-10` X*; `PLO-11` T/G | Read document/session state, defensive handling, render calls and QA summary. |

## 5. Track-level outcome interpretation

| Learning domain | Strongest current evidence | Outcomes needing stronger programme-level evidence |
|---|---|---|
| Designer / Vector (D01–D10) | PLO-01, PLO-02, PLO-03, PLO-04, PLO-05, PLO-06 and PLO-09 appear across the 30 lessons. D10 concentrates export and production skills. | PLO-07 needs more explicit brief decomposition and success criteria; PLO-08 needs a visible critique/iteration loop; PLO-10 needs a genuinely unfamiliar track project and retained rubric evidence. |
| Photo / Pixel (P01–P10) | PLO-03 and PLO-04 are prominent; PLO-05/06 are developed through compositing, tonal, color and typography workflows; PLO-09 is addressed in P09/P10. | PLO-07 needs a consistent Discover/Define brief record; PLO-08 needs explicit feedback, revision rationale and before/after evidence; PLO-10 needs independent assessment beyond the P10 lesson challenge. |
| Publisher / Layout pilot (B01) | The three pilot lessons introduce print specs, master-page systems, baseline grids, text flow and production constraints. | Three pilot lessons cannot establish full track mastery. PLO-05/06 design judgement and PLO-08 critique require more representative, assessed publication work, subject to the phase gate. |
| Scripting / Automation pilot (S01) | S01-01–03 introduce runtime literacy, MCP connection, document inspection, defensive handling and render workflows; they align to PLO-11. | The pilot does not establish broad automation competence, reliability across workflows or visual QA on varied design tasks. |

## 6. Programme-level gaps exposed by the mapping

1. **PLO-07 — Brief interpretation:** several lessons have a scenario in their challenge prompt, but not all explicitly require audience, purpose, message, constraints, deliverables and measurable success criteria to be recorded before work begins.
2. **PLO-08 — Iteration and critique:** common pitfalls and troubleshooting are useful, but they are not a substitute for critique, evidence-based revision, and a rationale explaining what changed and why. Most lessons need clearer iteration artefacts.
3. **PLO-10 — Independent transfer:** lesson challenges create opportunities to transfer, but some may remain too close to the demonstration. The reviewer must check for material changes in audience, goal, content, constraints or output format. No lesson challenge alone certifies Level 3 or Level 4.
4. **PLO-09 — Production readiness:** D10, P09/P10 and B01 cover selected output topics, but end-to-end delivery evidence across track-specific source files and exports still requires assessed projects.
5. **PLO-11 — Automation literacy:** the mapping is concentrated in three Scripting pilot lessons. It should not be generalized to all learners or treated as proof of competent automation use.

These are **curriculum design and assessment gaps**, not authorization to create the locked Publisher B02–B10 or Scripting S02–S10 lessons.

## 7. Required QA procedure for TASK-079

The independent reviewer must:

- Re-open every one of the 66 lesson JSON files at the reviewed commit.
- Confirm that each mapped PLO is supported by the actual `learningObjectives`, `foundationalKnowledge`, `toolAndFeatureExplanation`, `guidedPractice`, `independentChallenge`, and relevant check criteria.
- Downgrade or remove any mapping that is based only on a title, incidental mention, or unrelated challenge.
- Confirm that every track has an explicit track-level outcome statement and identify which outcomes remain unassessed.
- Review whether the proposed challenge is materially different from the demonstration; treat `X*` only as a challenge opportunity until this is checked.
- Record reviewer, reviewed commit, date, decisions, and unresolved items. No self-approval by the authoring agent.

## 8. Acceptance status

- 66/66 existing lesson IDs are represented exactly once in this mapping draft.
- All 11 PLO identifiers are used in the mapping vocabulary; coverage counts are calculated from the rows above.
- Track-specific summaries and cross-programme gaps are recorded.
- **TASK-079 remains IN_PROGRESS** until independent QA approves the lesson-level mappings and track-level gaps.
- **TASK-080 remains IN_PROGRESS** pending its separate independent inventory/source and P4 evidence review.
- **TASK-081 remains PENDING** and depends on TASK-079 and TASK-080.
- **BLK-007 remains ACTIVE — LOCKED.**
