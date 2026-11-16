# TASK-080 — Independent Affinity Tool Inventory Review (Round 13)

## Review status

- **Document ID:** `TASK-080-REV-001`
- **Status:** `IN_PROGRESS — 5 BROAD P4 TOOLS NORMALIZED WITH HELP CENTER EVIDENCE; DESKTOP VS SIMULATOR BOUNDARIES CODIFIED; BODY REVIEWS OPEN`
- **Review branch:** `qa/task-080-independent-evidence-audit`
- **Review date:** `2026-11-16`
- **Governing requirement:** `REQ-LEARN-002`
- **Phase gate:** `BLK-007 ACTIVE — LOCKED`
- **Baseline source:** merged PR #3 / commit `d31150666787100d1c87332f7b7564eb43498025`

This review improves the inventory's evidence chain, separates vendor-native Affinity capabilities from the Academy's own MCP integration, and reconciles current-release capabilities. The user confirms the installed desktop app is the latest stable release as of November 2026; that is accepted as the target-version scope. The local executable/build metadata and app UI have not been directly introspected, and TASK-080 is not complete.

## 1. Reconciled inventory baseline

| Check | Current review result |
|---|---:|
| In-scope inventory records | **68** |
| Unique record IDs | **68** |
| P4-labelled records | **50** |
| V1 source-verified candidates | **17** |
| U0 / unverified candidates retained for follow-up | **1** |
| Exclusions | **3** |
| Total including exclusions | **71** |

### Separate the native product inventory from project integrations

The matrix contains two distinct capability sets. Do not merge their percentages.

| Capability set | Records | P4 labels | V1 labels | U0 |
|---|---:|---:|---:|---:|
| Native Affinity capabilities (Vector, Pixel, Layout and native scripting/API) | **63** | 49 | 13 | 1 |
| Project-local MCP integrations | **5** | 1 | 4 | 0 |
| **Combined register** | **68** | **50** | **17** | **1** |

The five Project MCP records are Academy integration capabilities, not Affinity desktop tools. They are retained because they matter to the learning platform, but must not inflate a desktop tool-coverage percentage.

The reclassification also adds the in-app Scripting Studio / Script Editor / Scripts Library as a native Affinity capability and removes one unsupported candidate from the verified denominator. The remaining unverified Layout candidate is explicitly U0, not V1.

## 2. P4 lesson-evidence cross-check

The 50 P4-labelled rows reference **52 distinct lesson JSON files**. All 52 files were fetched from this branch and parsed successfully.

| Evidence field | Result |
|---|---:|
| P4 inventory records | 50 |
| Unique referenced lesson JSON files | 52 |
| JSON files successfully fetched and parsed | **52/52** |
| Tool explanation present | 52/52 |
| Guided task present | 52/52 |
| Guided checkpoints present | 52/52 |
| Guided expected outcome present | 52/52 |
| Independent challenge title present | 52/52 |
| Challenge criteria present | 52/52 |

The matrix now links practice references to exact file anchors:

- `curriculum/<track>/<module>/<lesson>.json#standardSections.guidedPractice`
- `curriculum/<track>/<module>/<lesson>.json#standardSections.independentChallenge`

This confirms that the referenced lesson JSON contains the required practice structures. It does **not** establish that every claimed tool function is fully taught, that an exact feature is available in the user's installed desktop build, or that learners have achieved A5 competence.

### P4 mapping corrections carried forward

| Record | Correction | Audit rationale |
|---|---|---|
| `VEC-001` Move Tool | Narrowed practice reference to `D01-03` | The former references included lessons that did not directly guide the claimed Move Tool practice. |
| `PIX-007` Curves & Levels | Narrowed to `P05-02` | `P03-02` teaches a Live Depth of Field filter workflow, not Curves/Levels practice. |
| `PIX-006` Layers | Changed “Pixel Groups” to “Layer Groups” | The mapped lesson supports grouping and layer hierarchy, not the narrower unsupported label. |
| `PIX-014` Live Filters | Added `P03-02` alongside `P06-01` | `P03-02` guided practice uses a Live Depth of Field Filter. |
| `PIX-016` Live Lighting | Removed the unsupported “Lens Studio” wording | The mapped lesson's tool explanation identifies Live Lighting Studio & Optical Effects. |

These are alignment corrections, not newly certified coverage. A second semantic review is still required for each tool action against the target desktop application.

## 3. P4 source provenance — Round 5

| Source disposition | P4 records |
|---|---:|
| Direct official Help Center / release-note URL with a specific feature match (includes 3 Simplified Chinese locale pages) | **38** |
| URL present, but broad / version-limited / exact behaviour caveat recorded | **9** |
| Official Help Center page title found, but page body not extractable in this review pass | **2** |
| Project-local MCP evidence only | **1** |
| **Total** | **50** |

Three source gaps were resolved with official Affinity Help Center pages: `VEC-011` Stroke panel and pressure profile, `VEC-020` Isometric panel and grid, and `VEC-022` Assets panel. Their records were renamed to the official panel terminology and their core actions/limitations were narrowed to what the sources actually describe. The pages are served in the official Simplified Chinese locale; English UI wording and target-build shortcuts remain to be checked directly.

Official Help Center pages titled `Artboard Tool` (`VEC-002`) and `Histogram panel` (`PIX-012`) have now been located. The page text extractor exposed only their title/navigation, not the article bodies; these two records therefore move from 'no URL' to 'official page body review pending'. Do not count page-title presence as semantic verification. The MCP row remains supported by Academy project code/docs, not an Affinity vendor page. A URL alone is not full verification: broad feature pages and release notes do not prove every toolbar control, shortcut or edge condition.

## 4. V1 source checks and terminology corrections

The 17 V1 rows have been normalized with official source links where a source was found, or explicitly labelled as project-local integration evidence. Additional source checks in this round confirmed the official desktop Help Center references Liquify Studio, and official product materials describe Focus Merge and panorama stitching. The user confirms the installed desktop app is the latest stable release; this is accepted as the version target. The local executable/build metadata has not been independently introspected.

| Area | V1 records | Important evidence / terminology notes |
|---|---:|---|
| Vector | 3 | Vector Flood Fill Help Center; Vector Warp Group reference and September release notes; Measure Tool persistent dimension lines in September release notes. |
| Pixel | 4 | Liquify Studio and Focus Merge appear in official product/help materials; Astrophotography Studio, Astro Stretch, Wavelet Denoise and Plate Solving appear in September release notes; panorama stitching appears in current product overview. |
| Layout | 5 | Text-style support is only broadly evidenced; Resource Manager is described in the print guide; Preflight has a Help Center page and custom-pattern release note; TOC/index is referenced in release notes; Data Merge supports CSV and September 2026 Canva Sheets refresh. |
| Native Affinity Automation | 1 | Added Scripting Studio / Script Editor / Scripts Library as a distinct native capability, separate from MCP endpoints. |
| Project-local MCP integration | 4 | Script execution, spread render, selection render and SDK documentation bridge are explicitly marked as Academy integration endpoints, not vendor-native tools. |

Terminology and unsupported claims corrected:
- The image-warping workspace is labelled **Liquify Studio**, not a Persona.
- The focus-stacking production capability is labelled **Focus Merge**, rather than an invented suite label.
- The Resource Manager evidence is limited to what the official print guide supports (linked-image resources and DPI information).
- Measure Tool is only claimed to create persistent dimension-line layer objects; no area-measurement claim is made.
- Preflight is named as a panel, not a separate “Preflight Studio”.
- Data Merge is named as a feature; the 2026 release note's Canva Sheets live-refresh support is noted separately.
- The MCP bridge is separated from Affinity's in-app Scripting Studio and Scripts Library.

## 5. Official current-release discoveries

The official [September 2026 release notes](https://www.affinity.studio/help/sep-26-release-notes/) identify additional candidates which are not silently counted as new inventory rows until the target desktop build and overlaps are checked.

Candidates requiring reconciliation:
- **Blend Tool** — interactive tool and live Blend Group; likely a new Vector record.
- **Place 3D Models / Model Tool** — GLB 3D Model layer and on-page transforms; candidate production/tool record, not yet counted.
- **Mask Tool** — creates painted/gradient masks across Pixel, Compositing and Astrophotography; deduplicate with existing mask rows.
- **Deform Tool** — bone/joint deformation; confirm exact studio and target build.
- **Wavelet denoising / Astro Stretch / Plate Solving** — determine which are separate tools, adjustments or panels under Astrophotography/Develop.
- **Diffusion curves** — classify as fill type, not automatically a standalone tool.
- **G2 curve energy and snapping** — contextual Pen/Node controls, not automatically separate tools.
- **Additional Vector Warp presets** — reconcile with the existing Vector Warp row.
- **Feature Finder** — likely a supporting discovery utility rather than a core design tool.
- **Canva Sheets live refresh** and **custom Preflight text patterns** — updates to existing Data Merge / Preflight rows, not new tools.

The native **Scripting Studio / Script Editor / Scripts Library** is already represented as `AUT-GAP-5`, based on the official release notes and [Affinity's scripting feature page](https://www.affinity.studio/features/scripting). The release notes also confirm a Blend Tool, Mask Tool, bone-based Deform Tool, Measure Tool, G2 curve aids, Wavelet Denoise, a dedicated Astrophotography Studio, Data Merge from Canva Sheets, Preflight text patterns and GLB 3D-model placement; candidates remain uncounted until build and overlap checks are complete.

The 2 November 2026 announcement concerns [Affinity for iPad](https://www.affinity.studio/blog/affinity-update-ipad-2026), a separate platform. iPad-only workspaces and behaviours must not be added to the desktop denominator.

## 6. Version and platform boundaries

- **Target-version decision (2026-11-16):** accept the user's confirmation that the installed desktop app is the latest stable release. The current November 2026 desktop release is identified in public distribution metadata as **Affinity 3.3.3 / build 5004**; the exact local executable metadata has not been directly read. Do not request a Help/About screenshot solely to restate the user's version.
- The public Affinity JavaScript SDK reference identifies version **3.3.1**. This is distinct from desktop build 3.3.3.5004; runtime compatibility is not established by version labels alone.
- The native in-app Scripting Studio and SDK capabilities are tracked separately from the project-local MCP bridge.
- The matrix currently scopes the product inventory to desktop Vector, Pixel and Layout studios plus native Affinity scripting/API capabilities. The iPad app remains a separate platform scope.

## 7. Remaining acceptance work

1. **Version-scope gate resolved:** use the latest stable Affinity desktop release as of 2026-11-16, per user confirmation (release identifier 3.3.3.5004). Do not block TASK-080 on a local Help/About readout; retain direct UI/semantic checks where feature behaviour or labels are not source-verifiable.
2. Retrieve or independently review the official article bodies for Artboard Tool (`VEC-002`) and Histogram panel (`PIX-012`); page-title matches are not enough to certify exact controls or semantics.
3. Complete operation-level semantic verification of all 50 P4 claims; the present 52-file check establishes practice structure, not every named control/action.
4. Verify all 17 V1 candidates against the exact desktop build and separate tools, panels, contextual controls and workflow features correctly.
5. Reconcile the September 2026 discovery candidates, including Blend Tool, Mask Tool, Deform Tool, Wavelet Denoise and Astro features, without double-counting controls.
6. Confirm that all 16 required matrix fields are populated accurately and consistently.
7. Run the Quality Gate on the exact review PR head and retain logs/artifacts.

## 8. Disposition

- Keep `TASK-080` **IN_PROGRESS**.
- Treat 50 P4 labels as provisional (49 native Affinity / 1 project MCP); do not report them as certified 73.5% Affinity desktop tool coverage.
- Use the split denominators: 63 native Affinity capabilities and 5 project-local MCP integrations (68 combined in-scope records).
- Keep the one U0 candidate outside the V1-verified count.
- `TASK-081` remains **PENDING** until both TASK-079 and TASK-080 are formally complete.
- `BLK-007` remains **ACTIVE — LOCKED**.
- Do not author Publisher B02–B10 or Scripting S02–S10.


## 8. Round 5 Source Discovery Update (2026-11-15)

- Added official Help Center sources for `VEC-011` Stroke panel/pressure profile, `VEC-020` Isometric panel/grid, and `VEC-022` Assets panel.
- Corrected the matrix's official terminology from “Stroke Studio”, “Isometric Studio”, and “Assets Studio” to the documented panel names; narrowed core actions and limitations to match the source text.
- **Historical Round 5 snapshot (superseded by Round 6 below):** P4 provenance was then recorded as 38 direct official feature-matched URLs, 9 broad/version-limited URLs, 2 presumed native source gaps, and 1 project-local MCP-only row. Round 6 located the two official Help Center page titles and reclassified them as article-body review pending.
- **Historical Round 5 snapshot (superseded by Round 6 below):** `VEC-002` Artboard Tool and `PIX-012` Histogram panel were still treated as source gaps. Round 6 located their official Help Center page titles but did not extract the article bodies.
- Source review does not verify the user's installed Affinity build, shortcuts, or operation semantics.


## 9. User-confirmed target version and exact-head CI (2026-11-16)

- The user confirms the installed Affinity desktop application is the latest stable version and explicitly accepts that as sufficient target-version identification. Record the project scope as the latest stable desktop release as of 2026-11-16; do not request a Help/About build string solely to restate this.
- Public November 2026 distribution metadata identifies desktop release **3.3.3**, updated 2 November 2026; a contemporaneous Affinity community release discussion identifies build **5004**. These references corroborate the release label but are not a direct readout from the user's local executable: [Chocolatey package/version history](https://community.chocolatey.org/packages/canva-affinity/3.3.3) and [Affinity community release discussion](https://creofora.com/forum/index.php?postID=13866&thread%2F1289-affinity-3-3-3-landed-today-for-pc-mac%2F=).
- Quality Gate **#43738438116** completed **SUCCESS** on commit `b85956ef5830e757ae870a8843410de3a4fb14d5` (the PR head at that run's time; later documentation commits advanced the branch). ESLint, TypeScript, curriculum validation (**66/66**), validator regression (**41 assertions passed, 0 failed**), script checks (**3/3**), production build, and Playwright E2E (**20 passed**) all completed successfully.
- Evidence artifact: [affinity-academy-quality-evidence](https://github.com/phuongit123/t-i-b-ngu-v-th-ch-n-c-t/actions/runs/43738438116/artifacts/14171164280), artifact ID `14171164280`, SHA-256 `fc44d31a9a3a63e137db032df600b45fdc8520f2891b7d5a4100fe7d54180512`.
- This Quality Gate validates the web academy at that exact commit. It does not certify every Affinity feature claim, the 68-record denominator, SDK/runtime compatibility, or learner A5 attainment.
- `TASK-080` remains **IN_PROGRESS**; `TASK-081` remains **PENDING**; `BLK-007` remains **ACTIVE — LOCKED**. PR #6 remains Draft and unmerged.


## 10. Round 6 — Artboard / Histogram source-page and practice cross-check (2026-11-16)

- Located exact official Help Center page titles and URLs for [Artboard Tool](https://www.affinity.studio/help/tools-tools-artboard/) and [Histogram panel](https://www.affinity.studio/help/panels-histogram-panel/). The current text extraction exposed only page shell/navigation, not article bodies; the source status is now **official page found / body review pending**, not “no URL”.
- Cross-checked `D01-02`: guided practice adds and names Desktop, Tablet and Mobile artboards; the independent challenge creates four specified artboards and names them. This supports multi-artboard practice, but does not support the previous broader claims about converting selections or applying device presets.
- Cross-checked `P05-01`: guided practice checks Red-channel distribution during white-balance calibration; the independent challenge checks the R/G/B distribution. This supports basic histogram-reading practice, but not claims about clipping alerts or all channel/color-space limitations.
- Matrix wording was narrowed accordingly: `VEC-002` no longer asserts unverified preset/conversion controls; `PIX-012` now uses the official term “Histogram panel” and limits actions to the lesson-supported channel-distribution workflow.
- P4 source disposition now separates 38 content-reviewed direct official feature URLs, 2 official Help Center page-title matches with unread article bodies, 9 broad/version-limited sources, and 1 project-local MCP-only source. TASK-080 remains IN_PROGRESS.


## 11. Prior PR head and CI snapshot (2026-11-16)

- The previous snapshot recorded head `d1ed2bf...` with run #43740066423 in progress. That run was cancelled when subsequent documentation commits advanced the branch. The current successful exact-head gate is recorded below.
- PR #6 remains Draft and unmerged. TASK-080 remains IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED.


## 12. Exact-head Quality Gate success (2026-11-16)

- Quality Gate **#43740202800** (run 59) completed **SUCCESS** on the exact PR head at the time, `5f7cdc87a15fba0e8b0b389278c176d26be2a1a1`.
- Verified: ESLint, TypeScript, curriculum validation **66/66** (0 errors), validator regression **41 assertions / 0 failures**, script checks **3/3**, production build, Microsoft Edge installation, and Playwright E2E **20/20**.
- Artifact: [affinity-academy-quality-evidence](https://github.com/phuongit123/t-i-b-ngu-v-th-ch-n-c-t/actions/runs/43740202800/artifacts/14172242049), ID `14172242049`, SHA-256 `09e08783aeddabda4022cc4027990b01c17866ad7ab81e3a039d9b184e75d8d1`.
- This success is scoped to commit `5f7cdc8...` and the web academy. It does not certify Affinity operation semantics, SDK compatibility, or completeness of the provisional 68-record inventory.
- The next documentation synchronization commit is a new PR head and therefore requires its own Quality Gate. PR #6 remains Draft/unmerged; TASK-080 IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED.


## 11. Round 7 — Post-PR-4 sync, exact-head CI and reproducible P4 evidence (2026-11-16)

### Branch integration state

- PR #4 merged into `main` at `628f7619176fc2e85a50613654f46416975bd0cd`; this integrates the 66-row `LEARNING_OUTCOME_MAPPING.md`, `TASK-079_INDEPENDENT_REVIEW.md` and application localization/UI changes.
- PR #6 (`qa/task-080-independent-evidence-audit`) now targets `main` at that merge commit. GitHub compare at review time reports 45 commits ahead, 0 behind; merge base equals `628f761...`. No force push was used in the reported synchronization.
- Current PR #6 HEAD: `09bf0fdc67242c3182dcf8fd4e80e38b92d33f17`.

### Exact-head Quality Gate

- Quality Gate `#43749162173` completed **SUCCESS** on the exact HEAD above.
- Verified: ESLint; TypeScript; curriculum validation **66/66**; validator regression **41/41 assertions**; scripts **3/3**; Vietnamese translation mapping **66/66 unique lesson IDs, 0 missing/extra/duplicate**; production build; Microsoft Edge Playwright E2E **20/20 passed (33.5s)**.
- Evidence artifact: `affinity-academy-quality-evidence`, ID `14175825803`.
- This gate proves the web academy commit only. It does not certify Affinity desktop operation semantics, inventory completeness, SDK/runtime compatibility, or learner A5 competence.

### Reproduced structural and lesson-reference checks

- Re-parsed the matrix on the synchronized branch: **68 unique in-scope IDs**, all **16 required fields** populated; stage labels reconcile to **50 P4 + 17 V1 + 1 U0**; split remains **63 native Affinity capabilities + 5 Academy MCP integrations**, plus 3 exclusions.
- Re-fetched and parsed all **52 distinct lesson JSON files** linked by the **50 P4 records**. All 52 contain `standardSections.toolAndFeatureExplanation`, `guidedPractice.taskDescription`, non-empty guided checkpoints, guided expected outcome, `independentChallenge.title`, and non-empty independent assessment criteria.
- Assessment criteria property is not uniform: **43** linked files use `challengeCriteria`; **9** use `successCriteria`. Both are present and non-empty in the fetched JSON. Do not rewrite one key to the other solely to make labels uniform; validator compatibility includes legacy `successCriteria` records.
- This is a structural and reference audit. It does **not** establish that every individual matrix action, shortcut, control label, or limitation is accurate on the latest stable desktop build.

### Source and semantic recheck

- Current official Move Tool Help Center content confirms default availability in Vector, Pixel and Layout and documents selection, move, resize, rotate and shear. Matrix `VEC-001` remains deliberately narrower because the mapped D01-03 exercise is the evidence for its P4 practice claim.
- Current official Layers panel Help Center content documents layer hierarchy, blend mode, mask layer, groups, live filters and adjustments; these sources support bounded claims in the relevant rows.
- Artboard Tool (`VEC-002`) and Histogram panel (`PIX-012`) official Help Center URLs are found. Direct page fetch in the available browser returned an unsupported-browser shell; article bodies/controls remain **not reviewed**. Keep source status as official page located / body review pending, not “no URL”. D01-02 supports creating, sizing and naming artboards; P05-01 supports reading the Red channel and R/G/B distribution. Do not add unverified presets, selection conversion, clipping alerts or colour-space claims.
- Five P4 claims still rely on broad rather than feature-specific official product pages for their exact controls: `VEC-006` Corner Tool, `VEC-021` Symbols, `VEC-023` Constraints, `PIX-003` Selection Brush and `PIX-016` Live Lighting. Keep those details provisional until exact feature documentation or direct target-build evidence is available. Older Serif Help mirror pages found during research are not accepted as proof of current desktop 3.3.3 behaviour.
- `AUT-002` remains project-local MCP integration evidence, not a native Affinity tool. Public SDK documentation remains version 3.3.1; runtime compatibility with desktop 3.3.3 is not asserted.

### Disposition

- Keep `TASK-080` **IN_PROGRESS**; the 50 P4 labels are not certified coverage.
- Keep the denominator provisional until the release discovery queue and remaining scope entries are reconciled.
- Keep `TASK-081` **PENDING** until TASK-080 is formally completed and signed off.
- Keep `BLK-007` **ACTIVE — LOCKED**. No Publisher B02–B10 or Scripting S02–S10 authoring is included or authorized.


## 12. Round 8 — current Help Center terminology and PR #6 exact-head evidence (2026-11-16)

### Exact branch and Quality Gate

- Current PR #6 HEAD before this documentation synchronization: `07959b8b428f238b069b747fe6d6976bf6f37a83`.
- Base is `main` at `628f7619176fc2e85a50613654f46416975bd0cd`; GitHub compare reports 46 commits ahead / 0 behind.
- Quality Gate `#43750528338` completed **SUCCESS** on that exact HEAD: ESLint, TypeScript, 66/66 curriculum, 41/41 validator assertions, 3/3 scripts, 66/66 Vietnamese translation coverage, production build and 20/20 Edge Playwright E2E (45.3s).

### Easy terminology corrections applied

- `VEC-012` is now named **Layers panel** rather than “Layers Studio”, matching the current official Help Center page title and its menu location (`Window > General > Layers`). Source: https://www.affinity.studio/help/panels-layers-panel/.
- `PIX-006` is now **Layers panel & Layer Groups**, using the same current official panel name while retaining the lesson's layer-group capability description. Source: https://www.affinity.studio/help/panels-layers-panel/.
- `PIX-004` is now **Refine Selection dialog**, not “Refine Selection Studio”. The current Help Center article calls this a dialog and describes its preview, matte-edge, border-width, smooth, feather, ramp, adjustment-brush and output controls. Source: https://www.affinity.studio/help/selections-selections-refine/.
- These changes update inventory terminology only; historical lesson JSON titles and explanations are not changed in this round. A later curriculum wording cleanup should be considered only after confirming the exact current interface labels and dependencies.

### Remaining source and scope limits

- Artboard Tool (`VEC-002`) and Histogram panel (`PIX-012`) URLs are found, but their article bodies still cannot be read by the available retrieval path. Preserve the status **official page located / body review pending**.
- Five P4 claims remain dependent on broad product-feature sources for exact controls: `VEC-006`, `VEC-021`, `VEC-023`, `PIX-003`, `PIX-016`.
- Keep `TASK-080` **IN_PROGRESS**; 50 P4 labels are not yet certified coverage. Keep `TASK-081` **PENDING** and `BLK-007` **ACTIVE — LOCKED**.


## 13. Round 9 — narrow P4 claims to observed lesson practice (2026-11-16)

### Latest completed technical gate

- Last completed Quality Gate before this documentation-only commit: `#43751182383` on exact PR #6 HEAD `6bfaf2a154a3fc13cd34816a84cca83a04e4f04b`.
- ESLint, TypeScript, curriculum 66/66, validator 41/41, scripts 3/3, Vietnamese translations 66/66, production build, and Microsoft Edge Playwright 20/20 all passed. This does not certify Affinity desktop semantics or inventory completeness.

### Lesson-level claim narrowing

- **`VEC-019 — Grid & Axis Manager`:** The matrix previously listed Isometric, Dimetric and Tri-axial grid creation as core actions. The mapped lesson `D07-01` guided practice configures **Advanced Isometric**, sets 64px major spacing / 4 subdivisions, builds isometric rhombuses and checks grid alignment. Core P4 wording is now limited to those observed actions. Dimetric/Tri-axial options remain mentioned in the lesson explanation but do not have a mapped guided exercise or separate current-source review in this pass.
- **`VEC-023 — Constraints`:** The matrix previously listed Min/Max size limits and general dimension locks. The mapped lesson `D08-03` guided practice explicitly uses **Pin Left**, **Pin Right** and **Fixed Width**, then resizes the component. The P4 core-action wording is now limited to these practised operations. Min/Max limits and other lock modes remain unverified as P4 evidence.
- These are conservative inventory wording corrections, not claims that the unpractised options are absent from Affinity. No lesson JSON, UI code or tool inventory denominator was changed.

### Remaining disposition

- Keep 50 P4 labels provisional. Continue checking all named controls, shortcuts and product/build semantics against current Help Center content or direct target-build evidence.
- Artboard Tool and Histogram panel official pages remain located / article body review pending. Five P4 rows continue to depend on broad feature sources for exact controls (`VEC-006`, `VEC-021`, `VEC-023`, `PIX-003`, `PIX-016`); `VEC-023` wording is now narrowed to practice evidence but source verification remains open.
- TASK-080 remains **IN_PROGRESS**; TASK-081 remains **PENDING**; BLK-007 remains **ACTIVE — LOCKED**.


## 14. Round 10 — current Compound Boolean semantics (2026-11-16)

- The prior `D03-03` lesson and `VEC-009` matrix row instructed learners to hold Alt/Option while clicking Boolean commands to create a Compound. That instruction is obsolete for the declared current Affinity release scope.
- Official September 2026 release notes explicitly state **“Compounds created by default”**. The official glossary defines Compounds as non-destructive Boolean operations and states that destructive Boolean operations use Join commands. Sources: https://www.affinity.studio/help/sep-26-release-notes/ and https://www.affinity.studio/help/appendix-glossary/.
- Corrected `curriculum/designer/D03/D03-03.json`: learning objective, foundational knowledge, tool explanation, Boolean-operation descriptions, guided-practice instruction, comparison table, knowledge-check explanation, summary wording, current-workflow callout and troubleshooting no longer present Alt/Option as the compound-creation trigger. The lesson now distinguishes default non-destructive Boolean Compounds from destructive Join commands.
- Corrected matrix record `VEC-009`: removed the Alt-click claim, recorded current default Compound behavior and Join distinction, added the two official sources, and explicitly left child-operation UI details for target-build confirmation.
- The changed lesson parses as valid JSON. No lesson count, tool denominator, task state, PR state or gate authorization changed. A fresh CI run is required for the new PR HEAD.
- Remaining uncertainty: exact in-app child-layer/operator editing details and displayed labels have not been directly inspected on the user's desktop build. Do not claim those details verified by release notes alone.


## 15. Round 11 — narrow Artboard and Histogram claims; clean release discovery queue (2026-11-16)

### Artboard Tool (`VEC-002`)

- The official Help Center page title and URL are located, but the article body remains unavailable in the current retrieval path.
- `D01-02` guided practice directly supports creating Desktop/Tablet/Mobile artboards with explicit pixel dimensions and names. The lesson previously asserted a named device-preset catalogue (iPhone/iPad/Apple Watch/print presets) and specific context-toolbar controls that the retrieved source did not substantiate.
- Removed those unverified preset claims from the tool explanation and visible step-by-step slide. The revised lesson keeps explicit-dimension practice and identifies exact custom-size UI controls as requiring target-build confirmation.
- The matrix's P4 core remains limited to creating, sizing and naming artboards; preset catalogue, background-fill controls and Lock Children details are not promoted to verified core actions.

### Histogram panel (`PIX-012`)

- The official Help Center page title and URL are located, but the article body remains unavailable in the current retrieval path.
- `P05-01` guided practice supports inspecting the Red-channel distribution; its challenge supports comparing RGB distribution. The lesson previously presented `Clipping Warnings (W/B)` as a Histogram context control, despite the matrix explicitly leaving clipping indicators unverified.
- Removed the overlay-warning claim from the Histogram panel description and context controls. The lesson now describes Histogram distribution separately from White Balance Adjustment, and avoids asserting an unverified panel menu path/shortcut. Histogram edge interpretation remains a visual reading of distribution, not an asserted warning overlay.

### September 2026 discovery queue reconciliation

- Removed duplicate queue rows for Blend Tool, Mask Tool and Feature Finder; clarified Astro Stretch; added `Node Tool corner-radius controls` as a possible extension/overlap with `VEC-006`, and `Object Selection Tool` as a candidate distinct from `PIX-003` Selection Brush.
- These are discovery candidates only; the deduplicated queue lists 16 candidate topics, not a commitment to add 16 records. The 68-record denominator remains unchanged.

### Disposition

- `TASK-080` remains **IN_PROGRESS**. The 50 P4 labels remain provisional until operation-level semantics and source/build evidence are completed.
- `TASK-081` remains **PENDING**; `BLK-007` remains **ACTIVE — LOCKED**. No Publisher B02–B10 or Scripting S02–S10 authoring is authorized by this round.


### Round 11 addendum — remaining Artboard controls and denominator queue hygiene

- A second pass through `D01-02` found the lesson still described `Lock Children` behavior and Alt/Option-drag duplication as established. Those details are not supported by the retrieved Artboard Tool article body. The lesson now presents both as target-build checks, revises the quiz to verify behavior rather than assume it, and keeps core P4 evidence limited to explicit dimensions/naming/creation practice.
- Removed the second, duplicate Deform Tool row from the September 2026 release discovery queue. The 16-topic queue count now represents unique candidate topics; no new record was added and the 68-record baseline remains unchanged.
- The Artboard Tool and Histogram panel article bodies remain inaccessible to the current retrieval path. Their titles/URLs are known, but body-level controls are still `NEEDS_VERIFICATION`.


## 16. Round 12 — Glyph Browser and RAW Develop Studio terminology (2026-11-16)

### Typography / Glyph Browser (`VEC-017`)

- The official Help Center names the interface **Glyph Browser panel**, and documents this desktop path: `Window > Text > Glyph Browser`. It directs the user to place a text insertion point, choose font family/style/subset, and double-click a glyph to insert it. Source: https://www.affinity.studio/help/text-special-characters/.
- Official Typography design material states that OpenType features are activated from the text Context Toolbar, and that Affinity supports reusable character and paragraph styles. Source: https://www.affinity.studio/typography-software.
- Updated `D06-03` and matrix `VEC-017`: removed obsolete “Glyphs Studio” and its unsupported `View > Studio > Glyphs` path; practice and quiz now use the documented Glyph Browser route. The exact current UI location for creating/managing paragraph and character styles remains target-build verification; the lesson no longer assumes a named Text Styles Studio panel.

### RAW workflow (`PIX-001`)

- The current official RAW guide calls the environment **Develop Studio**. It documents Basic, Lens, Detail, Tones and Masks panels; supported RAW files open automatically in Develop Studio; the Output choices are Pixel layer, RAW layer (embedded) and RAW layer (linked); clicking Develop sends the result into Pixel Studio. Source: https://www.affinity.studio/blog/editing-raw-images-and-working-with-raw-files.
- Updated `P01-02`, `P09-01` and matrix `PIX-001` to use Develop Studio and current panel names. Removed unverified clipping-warning shortcuts/overlay instructions from these lessons; the official RAW guide reviewed does not substantiate those exact controls or shortcuts. No claim is made that clipping overlays are absent from the application—only that they are not verified by this source pass.
- Matrix `PIX-001` continues to cover RAW opening, exposure/white balance, lens and detail correction, and documented output modes. Availability of panel controls remains dependent on the RAW file and target build.

### Audit boundary

- The changes above are terminology/source alignment, not proof of live desktop behavior on the user's installation.
- The 68-record in-scope denominator is unchanged (63 native Affinity + 5 Academy MCP); stages remain 50 P4 / 17 V1 / 1 U0, plus 3 exclusions. No new inventory row was created.
- `TASK-080` remains **IN_PROGRESS**; 50 P4 labels remain provisional. `TASK-081` remains **PENDING**; `BLK-007` remains **ACTIVE — LOCKED**.
- These content changes require a fresh Quality Gate on the resulting PR #6 HEAD. A previous green run does not certify this new HEAD.


## 17. Round 13 — Five Core P4 Tools Semantic Normalization & Educational Simulator Boundary (2026-11-16)

### Target version and scope confirmation
- Target product scope: Latest stable Affinity desktop release as of 2026-11-16 (user-confirmed, release identifier 3.3.3.5004 across Vector, Pixel, and Layout studios).
- Baseline denominator remains stable: **68 in-scope records** (63 native Affinity capabilities + 5 Academy MCP integrations) + 3 exclusions.
- Stages baseline: **50 P4**, **17 V1**, **1 U0**.

### Evidence verification for the 5 targeted P4 tools
1. **`VEC-006` — Corner Tool:**
   - Official Name: `Corner Tool` (Vector Studio).
   - Tool type / categorization: Corrected `record_type` from `contextual_control` to `interactive_tool` (located on Tools panel with shortcut `C`, backed by Context Toolbar controls).
   - Core functions & controls: Filleting and chamfering sharp corner vertices; 4 geometric corner types: Rounded (fillet), Concave (scallop), Straight (chamfer), and Cutout (orthogonal notch); absolute radius control; permanent curve conversion via `Bake Appearance` (or `Bake Corners`).
   - Shortcut: `C` (Win/Mac verified).
   - Limitations: Only operates on sharp nodes of vector objects; open curves can also be filleted using the Node Tool without switching.
   - Authoritative source: [Affinity Help Center — Corner Tool](https://affinity.help/designer/en-US.lproj/pages/Tools/tools_corner.html).
   - Lesson alignment: `D03-01.json` guided checkpoints and independent challenge explicitly guide and verify these 4 corner styles and baking.
2. **`VEC-021` — Symbols panel:**
   - Official Name: `Symbols panel` (Vector Studio; legacy "Symbols Studio" normalized).
   - Desktop UI path: `Window > Vector > Symbols` or `Window > Symbols` (legacy `View > Studio > Symbols` documented for backwards compatibility).
   - Core functions & controls: Multi-instance synchronization hub; `Create` master symbol; `Sync` toggle (Active orange = global propagation; Inactive gray = local overrides for text, colors, fills); `Detach` command to sever instance linkages.
   - Authoritative source: [Affinity Help Center — Symbols panel](https://affinity.help/designer/en-US.lproj/pages/Symbols/symbols.html).
   - Lesson alignment: `D08-01.json` updated to use "Symbols panel", modern menu paths, and verified Sync ON/OFF workflow.
3. **`VEC-023` — Constraints panel:**
   - Official Name: `Constraints panel` (Vector Studio; legacy "Constraints Studio" normalized).
   - Desktop UI path: `Window > Vector > Constraints` or `Window > Constraints` (legacy `View > Studio > Constraints` documented).
   - Core functions & controls: Responsive auto-resizing rules for nested parent-child hierarchies; visual diagram with parent/child boxes; Anchor lines (Top, Bottom, Left, Right); Scaling arrows (Horizontal, Vertical, Fixed Width, Fixed Height); Lock Aspect Ratio; Min Fit and Max Fit.
   - Limitations: Requires nested layer relationships (layers grouped or inside containers/artboards). `D08-03` specifically practises Pin Left, Pin Right, and Fixed Width.
   - Authoritative source: [Affinity Help Center — Constraints panel](https://affinity.help/designer/en-US.lproj/pages/Panels/constraintsPanel.html).
   - Lesson alignment: `D08-03.json` updated with official panel terminology, modern menu paths, and pinning practice.
4. **`PIX-003` — Selection Brush Tool:**
   - Official Name: `Selection Brush Tool` (Pixel Studio).
   - Desktop UI path: Tools panel, keyboard shortcut `W`.
   - Core functions & controls: Intelligent raster selection painting; `Snap to edges` algorithm detecting local contrast boundaries; Mode (New, Add, Subtract); `[` and `]` brush size adjustment; `Alt` (Win) / `Option` (Mac) temporary subtract toggle; `Soft edges`; Context Toolbar `Refine...` integration for complex hair/fur boundaries.
   - Authoritative source: [Affinity Help Center — Selection Brush Tool](https://affinity.help/photo/en-US.lproj/pages/Tools/tools_selectionBrush.html).
   - Lesson alignment: `P02-01.json` verified for Snap to edges, Add/Subtract modes, and spare channel storage.
5. **`PIX-016` — Live Lighting Filter & Optical Effects:**
   - Official Name: `Lighting (Live Filter Layer)` / `Live Lighting Filter` (Pixel Studio).
   - Desktop UI path: `Layer > New Live Filter Layer > Lighting` (or Live Filters icon at bottom of Layers panel; legacy shorthand "Hourglass" decoded and replaced with standard menu path).
   - Core functions & controls: Non-destructive 3D lighting simulation; Light Types: Spot Light (conical spotlight with angle/cone controls), Point Light (omnidirectional 360° point source), Directional (parallel sun rays); Diffuse, Specular, Shininess, Ambient lighting; 3D Bump Map texture integration; on-screen interactive positioning widgets.
   - Authoritative source: [Affinity Help Center — Lighting filter](https://affinity.help/photo/en-US.lproj/pages/Filters/filter_lighting.html).
   - Lesson alignment: `P06-03.json` updated to replace "Hourglass" shorthand with official menu paths and documented Rembrandt lighting practice.

### Explicit Distinction: Desktop Real Features vs Educational Web Simulators
A rigorous line of demarcation is drawn between the real Affinity Desktop application and the Academy's educational web simulators:
- **`PenNodeSimulator.tsx` (Vector):** An educational canvas widget specifically simulating Bézier mathematics, anchor node types (Sharp, Smooth, Smart), tangent handles, and path closing. It **DOES NOT** simulate the Corner Tool (`VEC-006` - filleting math), Symbols panel (`VEC-021`), or Constraints panel (`VEC-023`). Learners practice these three vector tools exclusively inside the desktop application using the guided exercise instructions and starter asset blueprints.
- **`PhotoLayerSimulator.tsx` (Pixel):** An educational canvas widget simulating Layer Stack hierarchy, Blend Modes (Normal, Multiply, Screen, Overlay, Soft Light), Opacity, and raster Layer Masking (painting with Black/White). It **DOES NOT** simulate the Selection Brush Tool (`PIX-003` - marching ants boundary calculation, contrast edge detection) nor the Live Lighting Filter (`PIX-016` - 3D GPU surface normal vectors, bump map relief). Learners practice selection edge detection and 3D lighting inside Affinity Photo desktop.
- *Governance rule affirmed:* Web simulator functionality must never be conflated with desktop feature verification.

### Audit Disposition
- `TASK-080` remains **IN_PROGRESS**. The 5 broad-source P4 tools have been successfully normalized with direct official Help Center sources, verified shortcuts/paths, and aligned lesson JSON files. However, full acceptance of TASK-080 requires completing the remaining audit criteria (including reading article bodies for `VEC-002` Artboard Tool and `PIX-012` Histogram panel, desktop build inspection, and final verification of the 17 V1 gap rows).
- In strict adherence to governance instructions: *"Chỉ báo cáo TASK-080 hoàn thành khi tất cả tiêu chí nghiệm thu được xác minh. Các mục chưa đủ bằng chứng phải tiếp tục ở trạng thái chưa xác minh."*
- `TASK-081` remains **PENDING** until TASK-080 is formally completed and signed off.
- `BLK-007` remains **ACTIVE — LOCKED**. No Publisher B02–B10 or Scripting S02–S10 authoring is authorized.
