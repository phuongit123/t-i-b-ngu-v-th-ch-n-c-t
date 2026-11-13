# AFFINITY ACADEMY — ARCHITECTURAL DECISION RECORDS (ADR)

## Document Control
- **Document ID:** `ADR-REGISTRY-001`
- **Version:** `4.2.2` (Track 2 Affinity Photo & Photo Layer Simulator Certified)
- **Status:** `ACTIVE / AUDITED & EXPANDED`
- **Last Updated:** `2026-11-11`
- **Governing Agent:** `Orchestrator`

---

## ADR-001: Project Control System as Persistent Governance Standard
- **Decision:** Maintain a dedicated `project-control/` directory with persistent markdown control documents and a root `AGENTS.md`. No agent may write implementation code without registered tasks and prerequisite phases satisfied.
- **Status:** **ACCEPTED** (Phase 0).

---

## ADR-002: Framework Selection: Vite + React 19 + TypeScript + Tailwind CSS v4
- **Decision:** Select **React 19** bundled with **Vite** and typed with **TypeScript 5.x**, styled via **Tailwind CSS v4** and **Lucide React** icons.
- **Status:** **ACCEPTED** (Phase 1).

---

## ADR-003: Affinity MCP as Runtime Automation & Visual Verification Engine
- **Decision:** Directly leverage the official **Affinity MCP Server** running at `http://localhost:6767/sse` using native tools (`execute_script`, `render_spread`, `render_selection`, `list_sdk_documentation`).
- **Status:** **ACCEPTED** (Verified live).

---

## ADR-004: Supabase for Relational Data, Authentication & Asset Storage
- **Decision:** Adopt **Supabase** (PostgreSQL with RLS, Supabase Auth, Supabase Storage) for user profiles, 40 modules, 120 lessons, progress tracking, and asset hosting.
- **Status:** **ACCEPTED** (Phase 6).

---

## ADR-005: Playwright for End-to-End & Visual Regression Testing
- **Decision:** Utilize **Playwright** via the `playwright` MCP server and `@playwright/test` for headless E2E testing of all 8 major pages and visual snapshot comparison.
- **Status:** **ACCEPTED** (Phase 7).

---

## ADR-006: Separation of Curriculum Content from Application Code
- **Decision:** Store all curriculum content as structured slide Markdown files with YAML frontmatter in a dedicated root directory: `curriculum/{designer,photo,publisher,scripting}/`.
- **Status:** **ACCEPTED** (Phase 3).

---

## ADR-007: Strict Phased Gating with Explicit User Approval Checkpoints
- **Decision:** Enforce a hard stop at Phase 0 and at each subsequent major phase boundary. The agent must halt and wait for explicit user approval before executing tasks in the next phase.
- **Status:** **ACCEPTED** (Enforced immediately).

---

## ADR-008: 40-Module Curriculum Structure Across Tri-App Suite & Scripting
- **Context:** Design mastery requires comprehensive coverage across all three professional apps and modern computational design.
- **Decision:** Structure the curriculum into exactly **4 tracks of 10 modules each (40 modules total, 120 lessons)**: Designer (D01-D10), Photo (P01-P10), Publisher (B01-B10), and JavaScript DOM Scripting & MCP Automation (S01-S10).
- **Status:** **ACCEPTED**.

---

## ADR-009: Interactive Slide-Based Lesson Engine
- **Context:** Continuous vertical text articles cause cognitive fatigue in visual design learning.
- **Decision:** Implement a slide-based interactive presentation player (`REQ-FE-007`) presenting 5 structured slide types per lesson (Theory, Demo, Step-by-Step, Pitfalls, Challenge) with keyboard navigation and step checklists.
- **Status:** **ACCEPTED**.

---

## ADR-010: In-Browser Interactive Affinity Tool Simulator
- **Context:** Learners need immediate hands-on practice with Affinity's Pen Tool bezier physics, Node curvature, and Boolean operations before or without launching desktop software.
- **Decision:** Build canvas-based tool simulators (`REQ-FE-008`) that emulate Affinity's exact node handling, bezier math, keyboard modifiers (Alt/Opt cusp, Shift 45°), and live curves.
- **Status:** **ACCEPTED**.

---

## ADR-011: Pre-Development MCP Research & Ground-Truth API Extraction
- **Context:** Writing scripting curriculum or code editor autocomplete before inspecting the running Affinity 3.0 DOM causes API hallucinations.
- **Decision:** Phase 1 strictly requires automated extraction of all SDK documentation topics via `read_sdk_documentation_topic` and DOM object inspection, producing `AFFINITY_DOM_API_REFERENCE.json` as the ground truth before curriculum authoring or editor implementation.
- **Status:** **ACCEPTED**.

---

## ADR-012: Independent QA Gatekeeping & Zero Self-Certification Rule
- **Context:** Implementing agents may overlook edge cases or regressions if allowed to mark their own tasks completed.
- **Decision:** All task completions require independent verification and automated test execution by `QAAgent`. No task transitions to `COMPLETED` without QA sign-off evidence.
- **Status:** **ACCEPTED**.

---

## ADR-013: Mastero & Minimalism Design System Architecture & Traced.life Aesthetic Reference
- **Context:** Affinity Academy requires an ultra-modern, high-aesthetic design standard that honors creative craftsmanship, inspired by `https://traced.life/`, while anchoring 100% of visual content in Serif Affinity 3.0 graphic design and scripting.
- **Decision:** Adopt an obsidian-canvas design token system (`src/styles/tokens.css`, `tailwind.config.ts`, `docs/DESIGN_SYSTEM.md`) featuring dark/light modes, hairline border geometry (`rgba(255,255,255,0.08)`), distinct Affinity application signature accents (Designer Cyan `#00d2ff`, Photo Cobalt `#38bdf8`, Publisher Rose `#fb7185`, Scripting Emerald `#10b981`), ambient glow shadows, and 21 modular reusable UI components.
- **Status:** **ACCEPTED** (Phase 2 Completed & QA Signed Off).

---

## ADR-014: WebAssembly (WASM) Rollup Fallback for Windows AppLocker / WDAC Compliance
- **Context:** On Windows 11 host environments with active AppLocker or Windows Defender Application Control (WDAC) policies, native C++ Node addons such as `@rollup/rollup-win32-x64-msvc\rollup.win32-x64-msvc.node` can be blocked from dynamic linking (`ERR_DLOPEN_FAILED`), breaking standard Vite production builds.
- **Decision:** Configure `@rollup/wasm-node@^4.68.1` as a reliable WebAssembly fallback via npm dependency override and a persistent `postinstall` script in `package.json`. This guarantees 100% deterministic Vite builds on any host security policy without sacrificing compiler correctness.
- **Status:** **ACCEPTED** (Phase 2 Verified).

---

## ADR-015: 10-Part Standard Content Model & Slide Lesson Engine Schema
- **Context:** To ensure exceptional pedagogical depth across 120 lessons, lessons must adhere to a standardized educational structure that prohibits shallow copy-paste templates while driving an interactive slide deck experience.
- **Decision:** Establish `src/types/curriculum.ts` and `curriculum/schema/lesson-schema.json` enforcing 10 required sections per lesson: (1) Learning Objectives, (2) Foundational Knowledge, (3) Tool & Feature Explanation with Win/Mac shortcuts, (4) Step-by-Step Instructions, (5) Visual Examples, (6) Guided Practice, (7) Independent Challenge with criteria, (8) Common Pitfalls & Solutions, (9) Knowledge Check Quiz with explanations, and (10) Summary & Resources. Each lesson is broken into 6-8 interactive slides consumed by `<SlidePlayer />`.
- **Status:** **ACCEPTED** (Phase 3 Pilot Verified & QA Signed Off).

---

## ADR-016: Practical Practice Assets & Desktop Sandbox Security Boundaries
- **Context:** Practice assets must be authentic, openable, and genuine without fictitious file extensions. Furthermore, MSIX application sandboxing restricts arbitrary disk writes from the Affinity JavaScript DOM.
- **Decision:** Provide verified practice assets:
  1. A genuine 1.65 MB `.afphoto` document (`curriculum/assets/photo/P01_starter.afphoto`) tested live in Affinity 3.3.3.
  2. Executable Node and DOM scripts (`curriculum/assets/scripting/*.js`) tested live against the port 6767 MCP SSE bridge.
  3. Structured layout guides and specifications (`curriculum/assets/{designer,publisher}/*.md`) for manual canvas setup, avoiding sandboxed disk write errors.
- **Status:** **ACCEPTED** (Phase 3 Pilot Verified & QA Signed Off).

---

## ADR-017: Flexible Slide Depth by Pedagogical Difficulty Tier
- **Context:** Rigid fixed slide counts (e.g. exactly 7 slides for all lessons) constrain complex topics like Axonometric 3D projections, Symbols architecture, and PDF/X commercial preflight, while bloating simple introductory concepts.
- **Decision:** Calibrate lesson slide deck depth by difficulty:
  * Beginner Tier (Modules D01–D03): 5 to 7 slides per lesson.
  * Intermediate Tier (Modules D04–D07): 7 to 9 slides per lesson (standard: 8 slides).
  * Advanced Tier (Modules D08–D10): 9 to 12 slides per lesson (standard: 9 slides).
- **Status:** **ACCEPTED** (Track 1 Implemented & QA Signed Off).

---

## ADR-018: Track 1 Technical Architecture: True Axonometry, Symbols Sync & Dual-Engine Pipelines
- **Context:** Vector illustration in Affinity Designer combines several unique technical paradigms that diverge from Adobe Illustrator and require explicit modeling in the curriculum.
- **Decision:** Document and enforce the following verified mechanics across Track 1:
  1. *True Isometric Math:* Enforce 30°/150°/90° axonometric angles in Grid & Axis Manager and Isometric Studio; distinguish from 2:1 pixel isometric (26.565°).
  2. *Symbols Studio Synchronization:* Enforce the Sync ON (global edits) vs Sync OFF (local instance overrides) mental model.
  3. *Dual-Engine Hybrid Clipping:* Model parent vector curves as dynamic clipping containers for child pixel layers; enforce 300 DPI resolution standards and utilize Color Studio procedural vector noise.
  4. *Production Output:* Enforce layer-based dynamic bounding box slices in Export Persona, Continuous background export, responsive SVG viewBox generation, and ISO PDF/X-4 print sheets.
- **Status:** **ACCEPTED** (Track 1 Completed & QA Signed Off).

---

## ADR-019: In-Browser Pen & Node Tool Bézier Simulation Architecture & Scope Limitation
- **Context:** Students learning vector design in Phase 4 require an immediate tactile experience for mastering cubic Bézier math, anchor point placement, and tangent handle control directly in the web browser, without needing native Affinity Designer installed immediately. Furthermore, project scope boundaries dictate that the full Monaco Scripting Editor and live MCP bridge be held until explicitly authorized.
- **Decision:**
  1. Build `src/components/simulator/PenNodeSimulator.tsx` using native SVG rendering, mathematical cubic Bézier curve sampling, and Catmull-Rom tangent calculations.
  2. Implement Sharp (corner), Smooth (180° collinear), and Smart (auto-tangent) node models, complete with Alt-key Cusp handle angle breaking.
  3. Include guided exercises based on D02 (Sharp Diamond Polygon) and D03 (Smooth S-Wave & Heart Silhouette) with automated pixel-deviation accuracy evaluation.
  4. Explicitly limit Phase 4 MVP to the Pen/Node simulator; defer Monaco IDE and live MCP code execution until subsequent approval.
  5. Include prominent disclaimer indicating the component simulates Bézier mechanics in-browser and is not a native application replacement.
- **Status:** **ACCEPTED** (Phase 4 MVP Implemented & QA Signed Off).

---

## ADR-020: Rollup Manual Chunk Partitioning & Headless Playwright Verification
- **Context:** The growing curriculum library (39 lessons) caused Vite's initial bundle chunk to reach 995 kB, exceeding recommended bundle thresholds and triggering build warnings. Additionally, Playwright automated testing needed seamless headless execution on Windows 11 host environments.
- **Decision:**
  1. Configure `manualChunks` in `vite.config.ts` separating `curriculum-designer-foundations`, `curriculum-designer-advanced`, `curriculum-photo`, `curriculum-publisher`, `curriculum-scripting`, `vendor-react`, and `vendor-lucide`. This reduced the main entry bundle to 119 kB with zero chunk warnings.
  2. Configure `playwright.config.ts` targeting Microsoft Edge (`msedge` channel) and exact element-relative position clicking (`locator.click({ position: { x, y } })`), combined with `pointer-events: none` on ghost guidance overlays, ensuring 100% deterministic, flake-free headless test execution.
- **Status:** **ACCEPTED** (Verified & Certified).

---

## ADR-021: Phase 5 Track 2 (Affinity Photo) Curriculum Expansion, Photo Layer Simulator & Rollup Chunk Partitioning
- **Context:**
  Expanding Affinity Academy to include Track 2 (Affinity Photo) required:
  1. Authoring 10 comprehensive modules (P01–P10) with 30 production lessons adhering strictly to the 10-part standard content model and interactive slide deck schema.
  2. Providing authentic, reproducible practice assets without fabricating non-functional binary `.afphoto` packages.
  3. Designing an in-browser pedagogical simulator for Affinity Photo's core mechanics (non-destructive layer stack, dynamic mask painting with brush mechanics, and blend modes) without misleading learners into expecting a full desktop replacement.
  4. Preventing bundle bloat from adding 30 richly detailed photo curriculum modules.
- **Decision:**
  1. *Curriculum Schema & Content:* Authored modules P01 through P10 covering Selections, Masking, Layers, Retouching & Restoration, Color Correction & Grading, Live Filters, Compositing, Typography Integration, RAW Develop Persona, and Export Persona. All 30 lessons adhere 100% to `src/types/curriculum.ts` and validated via `scripts/validate-curriculum.js` (66/66 total lessons pass).
  2. *Genuine Practice Assets:* Authored 9 structured Markdown guides in `curriculum/assets/photo/P02_...` through `P10_...` specifying exact canvas setups, layer stacks, adjustment parameters, and challenge rubrics. Retained verified authentic binary `P01_starter.afphoto` (1.65 MB).
  3. *In-Browser Photo Layer Simulator:* Built `src/components/simulator/PhotoLayerSimulator.tsx` featuring an HTML5 Canvas rendering engine, a 4-layer non-destructive stack (Background, Subject with live mask, Adjustment, Live Filter), brush controls (radius, hardness, Black conceals, White reveals), mask inversion (`Ctrl+I` / `Cmd+I`), reset, and 3 preset challenges. Included a prominent educational disclaimer badge. Integrated as a tab in `src/pages/SimulatorPage.tsx`.
  4. *Rollup Chunk Partitioning:* Partitioned Photo curriculum in `vite.config.ts` into `curriculum-photo-foundations` (P01–P05: 262 kB) and `curriculum-photo-advanced` (P06–P10: 250 kB), maintaining all chunks below the 300 kB threshold with zero warnings.
  5. *Automated Verification:* Added Playwright test suite `tests/e2e/photo-curriculum.spec.ts` covering Catalog track filtering, Lesson Player slide navigation, and Photo Simulator interactivity (3/3 pass, total E2E suite passes 9/9 in 18s).
- **Status:** **ACCEPTED** (Track 2 Completed & QA Signed Off).
