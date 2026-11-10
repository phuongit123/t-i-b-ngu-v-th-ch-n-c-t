# QA ACCEPTANCE SIGNOFF: PHASE 4 MVP (PEN & NODE SIMULATOR)
**Affinity Academy — Interactive Bézier Simulation Sandbox**
**Sign-Off Date:** 2026-11-09  
**Auditor:** Independent QA Auditor (`QAAgent`) & Lead Orchestrator  
**Status:** ACCEPTED & CERTIFIED  
**Governing Tasks:** `TASK-027` (In-Browser Tool Simulator Sandbox MVP), `TASK-074` (Simulator Page)  
**Governing Requirements:** `REQ-FE-008`, `REQ-PAGE-004`  

---

## 1. Executive Summary

In accordance with the directive `PHASE GATE DECISION — TRACK 1 AUDIT + PHASE 4 MVP`, `FrontendAgent` has developed and `QAAgent` has independently verified the **Phase 4 MVP: Pen & Node Tool Bézier Simulator**.

The simulator is built as a pure TypeScript + React 19 interactive SVG/HTML5 Canvas sandbox located at `src/components/simulator/PenNodeSimulator.tsx` and hosted within `src/pages/SimulatorPage.tsx`. It provides authentic mathematical modeling of cubic Bézier curves, node types (Sharp, Smooth, Smart), interactive handle manipulation, guided exercises based on Designer Modules D02 and D03, automated accuracy evaluation scoring, undo/redo/reset history, and responsive layouts across desktop, tablet, and mobile devices.

All 5 Playwright end-to-end acceptance tests passed with zero errors. All visual states have been captured as screenshot artifacts. No regressions occurred in the 39 curriculum lessons or build toolchain.

---

## 2. Scope Boundaries & Honest Accounting

### 2.1 Functioning Features (Verified Live)
- **Pen Tool (`P`):**
  - Click to place Sharp corner nodes.
  - Click-and-drag to pull out smooth tangent handles.
  - Alt/Option key modifier to break collinear handle coupling (Cusp handle mode).
  - Hover over start node with visual pulse indicator and click to close curve (`isClosed = true`).
  - Enter / Esc keys to complete open curves.
- **Node Tool (`A`):**
  - Click on any node to select it and reveal control handles.
  - Drag node position (connected handles translate proportionally).
  - Drag incoming (`handleIn`) and outgoing (`handleOut`) control points.
  - Smooth nodes maintain 180° collinear handle continuity.
  - Node Type Conversion Toolbar buttons:
    - **Sharp:** Strips handles or creates independent cusps.
    - **Smooth:** Re-aligns handles into continuous 180° tangents.
    - **Smart:** Computes optimal Catmull-Rom tangent curves based on adjacent node positions.
  - Toggle Open / Close Path button.
  - Delete selected node button (and `Delete` / `Backspace` keyboard shortcuts).
- **Control Bar & History:**
  - Full Undo (`Ctrl+Z`) and Redo (`Ctrl+Y` / `Ctrl+Shift+Z`) state stack.
  - Canvas Reset (`RotateCcw`) button.
  - Dot Grid background toggle and 20px Grid Snapping toggle.
- **Guided Exercises & Automated Evaluation:**
  - **D02: Sharp Diamond Polygon** (Beginner): 4 Sharp nodes with closed path detection.
  - **D03: Smooth S-Wave Curve** (Intermediate): Continuous S-curve with smooth handles.
  - **D03: Heart Silhouette** (Advanced): Hybrid cusp nodes (top dip & bottom tip) combined with smooth lobes.
  - **Freeform Sandbox**: Open exploration without target outlines.
  - Ghost outline rendering in dashed emerald/cyan with target node step indicators.
  - "Chấm điểm đường cong" (Evaluate) scoring engine: Computes average pixel deviation across sampled cubic Bézier segments and outputs an accuracy percentage (0–100%) and tailored instructional feedback.
- **Compliance & Disclaimer:**
  - Prominent mandatory warning banner displayed at top: *"Bản mô phỏng cơ chế Bézier trong trình duyệt — Thiết kế mô phỏng thao tác Pen/Node Tool và đường cong Bézier chuẩn mực của Affinity Designer, không thay thế hoàn toàn phần mềm native."*

### 2.2 Out-of-Scope Features (Explicitly Deferred)
- **Monaco Scripting Editor (`TASK-023`):** Intentionally NOT implemented in this MVP turn.
- **Affinity MCP Live Code Runner / Bridge (`TASK-041`, `TASK-076`):** Intentionally NOT connected in this turn.
- **Track 2 (Photo), Track 3 (Publisher), Track 4 (Scripting) Mass Authoring:** Held at Phase Gate awaiting explicit authorization.

---

## 3. Automated Test Verification Matrix

All tests were executed against the running application in headless Microsoft Edge via Playwright (`tests/e2e/pen-node-simulator.spec.ts`):

| Test Case ID | Test Title | Test Assertion | Result | Latency |
|---|---|---|---|---|
| `TC-SIM-01` | Displays disclaimer banner and tool controls | Verifies mandatory banner, Pen [P], Node [A], Sharp, Smooth, Smart buttons are visible and properly initialized | **PASS** | 729ms |
| `TC-SIM-02` | Pen Tool places nodes, closes path & evaluates | Places 4 diamond nodes, clicks start node to close, clicks "Chấm điểm đường cong", verifies accuracy score badge (>= 80%) | **PASS** | 1.6s |
| `TC-SIM-03` | Node Tool selects node and converts types | Places 3 nodes, switches to Node Tool (`A`), selects node #2, enables and clicks Smooth button, verifies `(smooth)` status | **PASS** | 1.1s |
| `TC-SIM-04` | Supports Undo, Redo, and Reset | Adds nodes, triggers Undo (nodes: 1), triggers Redo (nodes: 2), triggers Reset (nodes: 0) | **PASS** | 1.1s |
| `TC-SIM-05` | Exercises switch target ghost path and hints | Switches between Wave and Heart exercises, verifies target ghost dashed SVG path updates and instructions match | **PASS** | 792ms |
| **SUMMARY** | **Full E2E Simulator Suite** | **5 / 5 Acceptance Tests Passed** | **PASS** | **8.7s** |

---

## 4. Visual Evidence Artifacts

The following 7 screenshot files were captured during verification and are permanently saved and verified on disk in `tests/screenshots/`:

| Artifact Path | Size on Disk | Viewport | Verification Description | Status |
|---|---|---|---|---|
| `tests/screenshots/simulator-initial-state.png` | 84.6 kB (84,662 B) | 1440 × 900 (Desktop) | Clean initial state showing Pen Tool active, grid background, disclaimer banner, and D02 Diamond ghost outline | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-canvas-active.png` | 83.8 kB (83,828 B) | 1440 × 900 (Desktop) | SVG canvas scaled to full responsive width and 520px height with crisp dot grid | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-diamond-evaluated.png` | 81.8 kB (81,801 B) | 1440 × 900 (Desktop) | Completed user diamond path evaluated with **88% accuracy score**, 9.9px deviation, and positive feedback card | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-node-tool-smooth.png` | 88.8 kB (88,751 B) | 1440 × 900 (Desktop) | Node Tool active with Node #1 selected and smooth Bézier handles rendered in collinear alignment | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-heart-exercise.png` | 117.7 kB (117,716 B) | 1440 × 900 (Desktop) | Advanced D03 Heart Silhouette exercise with ghost cusp and smooth lobe guidelines | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-tablet-768.png` | 85.7 kB (85,714 B) | 768 × 1024 (Tablet) | Responsive layout on iPad/tablet viewport; control bar wraps cleanly, canvas maintains aspect ratio | **VERIFIED ON DISK** |
| `tests/screenshots/simulator-mobile-375.png` | 65.3 kB (65,251 B) | 375 × 667 (Mobile) | Responsive layout on iPhone/mobile viewport; stack order adjusts, controls remain touch-accessible | **VERIFIED ON DISK** |

---

## 5. Non-Regression Verification Harness

The entire project verification pipeline was executed to confirm zero regressions across prior phases:

1. **Curriculum Schema Audit (`npm run validate:curriculum`):**
   - **39 / 39 lessons PASSED** (0 errors, 0 warnings).
   - All 30 Designer lessons (D01–D10) and 9 Pilot lessons validate against `lesson-schema.json`.
2. **Script Syntax & Assertion Audit (`npm run test:scripts`):**
   - **3 / 3 scripts PASSED** (`S01_hello_affinity.js`, `S01_ping_mcp.js`, `S01_inspect_doc.js`).
3. **TypeScript Strict Typecheck (`npm run typecheck`):**
   - **0 ERRORS** (`tsc --noEmit` completed with zero diagnostics).
4. **Production Build & Bundle Optimization (`npm run build`):**
   - Built cleanly in **3.15s**.
   - Main entry `index.js`: **119.09 kB** (gzip: 37.66 kB) — an exact **-88.03% net reduction** from the monolithic 994.96 kB baseline (`(994.96 - 119.09) / 994.96 = 88.03%`).
   - Largest vendor chunk: **256.94 kB** (`curriculum-designer-advanced`).
   - **Zero Vite chunk warnings (> 500 kB eliminated)**.
5. **Console Errors:**
   - Evaluated `window.__errors` in active browser session: **0 unhandled errors or exceptions**.

---

## 6. QA Gate Verdict

```
======================================================================
  PHASE 4 MVP (PEN & NODE SIMULATOR) VERIFICATION: PASSED & SIGNED OFF
======================================================================
  [x] Track 1 Technical Re-Audit Verified & Remediated (5/5 items)
  [x] Pen Tool Bézier Canvas Implementation Verified
  [x] Node Tool (Sharp, Smooth, Smart, Cusp) Verified
  [x] Undo / Redo / Reset State Management Verified
  [x] Guided Exercises (D02 Diamond, D03 Wave, D03 Heart) Verified
  [x] Automated Accuracy Evaluation Engine Verified
  [x] Mandatory Disclaimer Banner Verified
  [x] 5 / 5 Playwright E2E Tests Passed on Microsoft Edge
  [x] 7 Visual Screenshot Artifacts Archived
  [x] Zero Bundle Warnings (Largest Chunk 256 kB)
  [x] Zero Regressions in 39 Curriculum Modules
======================================================================
```

**Phase Gate Status:** **HALTED AT PHASE GATE**. Phase 4 MVP is certified complete. The platform stands ready for user evaluation. No further phases (Monaco editor, Track 2 Photo, Track 3 Publisher, Track 4 Scripting) will be initiated without explicit user approval.
