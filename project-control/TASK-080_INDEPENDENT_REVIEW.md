# TASK-080 — Independent Affinity Tool Inventory Review (Round 4)

## Review status

- **Document ID:** `TASK-080-REV-001`
- **Status:** `IN_PROGRESS — INVENTORY RECLASSIFIED; P4 JSON STRUCTURE AUDITED; TARGET-BUILD AND SEMANTIC AUDIT OPEN`
- **Review branch:** `qa/task-080-independent-evidence-audit`
- **Review date:** `2026-11-15`
- **Governing requirement:** `REQ-LEARN-002`
- **Phase gate:** `BLK-007 ACTIVE — LOCKED`
- **Baseline source:** merged PR #3 / commit `d31150666787100d1c87332f7b7564eb43498025`

This review improves the inventory's evidence chain, separates vendor-native Affinity capabilities from the Academy's own MCP integration, and reconciles new official September 2026 capabilities. It does **not** claim that the user's installed application build was inspected or that TASK-080 is complete.

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

## 3. P4 source provenance

| Source disposition | P4 records |
|---|---:|
| Official URL with no explicit caveat in the matrix | **35** |
| URL present, but broad / version-limited / exact behaviour caveat recorded | **9** |
| No direct vendor URL located for a native desktop claim | **5** |
| Project-local MCP evidence only | **1** |
| **Total** | **50** |

The five native claims without direct vendor URLs remain source gaps. The MCP row is supported by project code/docs, not by an Affinity vendor page. A URL alone is not full verification: broad feature pages and release notes do not prove every toolbar control, shortcut or edge condition.

## 4. V1 source checks and terminology corrections

The 17 V1 rows have been normalized with official source links where a source was found, or explicitly labelled as project-local integration evidence. Additional source checks in this round confirmed the official desktop Help Center references Liquify Studio, and official product materials describe Focus Merge and panorama stitching. The exact installed target build remains uninspected.

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

- The curriculum and matrix declare desktop build **3.3.3.5004**. The installed desktop application on the user's machine has **not** been inspected during this remote review.
- The public Affinity JavaScript SDK reference identifies version **3.3.1**. This is distinct from desktop build 3.3.3.5004; runtime compatibility is not established by version labels alone.
- The native in-app Scripting Studio and SDK capabilities are tracked separately from the project-local MCP bridge.
- The matrix currently scopes the product inventory to desktop Vector, Pixel and Layout studios plus native Affinity scripting/API capabilities. The iPad app remains a separate platform scope.

## 7. Remaining acceptance work

1. Obtain direct evidence of the exact installed desktop build (Help/About or equivalent) and confirm studio/tool availability against that build.
2. Resolve the five native P4 claims without direct vendor URLs or supply direct target-app evidence: Artboard Tool, Stroke Studio/Pressure Graph, Isometric Studio, Assets Studio, and Histogram Studio.
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
