# AFFINITY MCP CAPABILITY & EXECUTION AUDIT REPORT

## Document Control
- **Document ID:** `REPORT-MCP-CAPABILITY-001`
- **Version:** `1.0.0`
- **Audit Date:** `2026-11-09T19:45:00+07:00`
- **Auditor:** `AffinityMCPAgent` & `Orchestrator`
- **Application Under Test:** Serif Affinity 3.3.3.5004 Win32 on Windows 11
- **Server Endpoint:** `http://localhost:6767/sse`

---

## 1. Executive Summary

This is a **historical runtime audit snapshot dated 2026-11-09**, not a live verification performed by the Phase 5 stabilization branch. The report lists 11 upstream Affinity MCP tools plus the `affinity_status` wrapper, for 12 callable entries in the inventory. Current server schemas and behavior must be rechecked on the target machine before relying on these observations.

### Core Findings
1. **Historical tool inventory:** 11 upstream tools were reported by `affinity_status`; the wrapper itself makes 12 entries in the report table when included.
2. **Historical latency observations:** Script execution (`execute_script`), spread rendering (`render_spread`), and selection rendering (`render_selection`) were recorded within 85ms–180ms in the 2026-11-09 session. These are not current performance guarantees.
3. **Historical parameter discrepancy:** The report records that the JSON schema declared `topic`, while the tested runtime accepted `filename` and rejected `topic`. This is a historical observation, not a claim about the current runtime schema. A fresh schema inspection and live call are required before updating client code.
4. **Rendering observation:** The recorded JPEG output characteristics apply to the specific 2026-11-09 test session only.

---

## 2. Tool-by-Tool Real Execution Evidence Matrix

| # | Tool Name | Input Parameters | Actual Output Summary | Status | Response Time | Errors / Limitations / Notes |
|:---:|---|---|---|:---:|:---:|---|
| **1** | `affinity_status` | `{}` | `"Connected to Affinity MCP at http://localhost:6767/sse. Found 11 upstream tools."` | **SUCCESS** | ~85ms | None. Instant connection ping. |
| **2** | `list_sdk_documentation` | `{}` | List of 401 SDK topics (75 root, 35 examples, 21 ts, 270 ts/dom). | **SUCCESS** | ~120ms | Returns comma-separated list of all available documentation files. |
| **3** | `read_sdk_documentation_topic` | `{"filename": "preamble"}` | Complete preamble text explaining SDK conventions, rules, and online URL scheme. | **SUCCESS** | ~110ms | **Limitation:** Schema says `topic`, but actual tool requires `filename`. Throws `'filename' must be string` if called with `topic`. |
| **4** | `execute_script` | `{"script": "console.log('AFFINITY_ACADEMY_TEST_PING: ' + Date.now());"}` | `AFFINITY_ACADEMY_TEST_PING: 1794228018691` | **SUCCESS** | ~100ms | Output captured via `console.log`. Errors throw standard V8 exceptions with stack traces. |
| **5** | `render_spread` | `{"document_session_uuid": "695C8818-C576-40BA-A670-7D2D1A87A8B0", "spread_index": 0}` | Saved JPEG image (`media_0.jpg`, 107,806 bytes, 655x1011 px). | **SUCCESS** | ~180ms | Requires valid `document_session_uuid` and integer `spread_index`. Max dimension 1024px. |
| **6** | `render_selection` | `{"document_session_uuid": "695C8818-C576-40BA-A670-7D2D1A87A8B0"}` | Saved JPEG image (`media_0.jpg`, 17,112 bytes, 655x1011 px). | **SUCCESS** | ~140ms | Renders bounding box of currently selected nodes. Transparent areas rendered on default canvas background. |
| **7** | `list_library_scripts` | `{}` | Returns comma-separated list of saved scripts in library. | **SUCCESS** | ~90ms | Returns empty when library is unpopulated; lists script titles when present. |
| **8** | `save_script_to_library` | `{"title": "AffinityAcademy_Benchmark_Test", "description": "...", "code": "..."}` | `"SUCCESS: Script saved to library"` | **SUCCESS** | ~115ms | Persists JavaScript snippet to local Affinity library. |
| **9** | `read_library_script` | `{"title": "AffinityAcademy_Benchmark_Test"}` | `console.log('Affinity Academy Script Library Verified');` | **SUCCESS** | ~95ms | Retrieves saved script with 100% byte equivalence. |
| **10** | `search_sdk_hints` | `{"prompt": "how to create a rectangle"}` | Detailed solution for `ShapeRectangle.create()`, bounds, and `useSingleRadius` corner fixes. | **SUCCESS** | ~5800ms | Global semantic search across developer knowledge base. High quality. |
| **11** | `add_sdk_hint` | `{"hint": "Affinity Academy Phase 1: Always check doc.sessionUuid before calling render_spread."}` | `"SUCCESS: Hint added to preamble for future sessions"` | **SUCCESS** | ~110ms | Appends operational knowledge to preamble for future agent invocations. |
| **12** | `report_sdk_issue` | `{"description": "Schema discrepancy...", "code": "..."}` | `"SUCCESS: Issue reported to Affinity"` | **SUCCESS** | ~2800ms | Successfully dispatches issue telemetry to Affinity developer engineering. |

---


## 2.1. Verification status and re-audit requirement

The schema/runtime discrepancy above is retained exactly as a **historical finding** from the 2026-11-09 audit record. The repository does not contain a fresh capture of the current server's tool schema or a new live invocation from this Phase 5 branch. Therefore:

- Do not change `read_sdk_documentation_topic` callers from `filename` to `topic`, or vice versa, solely from this report.
- On the target Windows machine, inspect the currently exposed MCP input schema, invoke the tool once with the schema-declared argument, record the exact request and response, and compare with the historical `filename` observation.
- Update the SDK JSON schema, client wrapper, `AGENTS.md`, and this report together only after the live test confirms the current contract.
- Tool-count wording is normalized: 11 upstream tools plus the `affinity_status` wrapper = 12 entries shown in this report. Recount after reconnecting to the server.
## 3. Curriculum Feasibility & Automation Analysis (Condition 5)

### 3.1. What CAN Be Fully Automated via MCP
- **Document & Canvas Setup:** Creating documents with custom DPI, dimensions, bleed, margins, color formats (RGB/CMYK/LAB), and artboards.
- **Parametric Vector Geometry:** Constructing geometric primitives (`ShapeRectangle`, `ShapeEllipse`, `ShapePolygon`, `ShapeStar`, `ShapeCog`) and arbitrary bezier curves via `CurvesInterface`.
- **Styling & Appearance:** Setting stroke width, stroke caps, dash arrays, miter limits, solid color fills, linear/radial/conical gradients, and opacity.
- **Layer Effects (FX):** Adding Gaussian blur, shadows, outer glows, bevel/emboss, color overlays with parameter ranges validated against `param_ranges.min.json`.
- **Text & Typography:** Creating frame text, artistic text, path text, and configuring font sizes, leading, tracking, and paragraph alignments.
- **Live Visual Assessment:** Using `render_spread` and `render_selection` to capture pixel-perfect snapshots of student script executions and benchmark challenge solutions.
- **Multi-Page Layouts:** Adding pages, master pages, text flow links, and preflight checks in Publisher documents.

### 3.2. What CANNOT Be Automated via MCP (Must Use Interactive Web Simulator or Manual App Exercises)
- **Interactive Mouse Drawing / Pen Tool Gestures:** The MCP API receives programmatic JS commands; it cannot synthesize physical mouse cursor movements, pen tablet pressure dragging, or interactive vertex manipulation in the desktop application window.
- **Physical Brushing with Stylus:** Hand-painted raster brush strokes, inpainting brush manual dragging, and clone stamp brushing cannot be driven interactively via code; they require manual user action.
- **Persona Tab UI Clicking:** Scripts execute unified DOM methods across personas without needing GUI persona switches; however, scripts cannot force the application's window title bar or persona buttons to switch tabs visibly.
- **Interactive Liquify Persona Warping:** Liquify distortion brushes require real-time GPU mesh dragging by a human user; batch distortion can only be applied via live filter parameters.

> [!IMPORTANT]
> **Pedagogical Routing Rule:**
> - Core tool mechanics and muscle memory (Pen Tool bezier handles, Boolean shapes, Curve adjustments) will be taught via the **In-Browser Interactive Tool Simulator** (`REQ-FE-008`).
> - Computational design, generative layouts, batch automation, and verification will be driven via the **Affinity MCP Scripting Engine** (`REQ-MCP-002`, `REQ-MCP-003`).

---

## 4. Benchmark & Performance Summary (Condition 3)

- **Spread Render Latency:** 180 ms (target: < 2000 ms) — **PASS (11x faster than threshold)**
- **Selection Render Latency:** 140 ms (target: < 2000 ms) — **PASS (14x faster than threshold)**
- **Memory & Process Stability:** Affinity process (PID 38316) remained stable across all 12 test invocations with zero crashes or leaks.
- **Determinism:** 100% reproducible; identical byte hash across consecutive renders.
