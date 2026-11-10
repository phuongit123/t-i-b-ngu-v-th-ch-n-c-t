# AFFINITY ACADEMY — ACCEPTANCE CRITERIA & VERIFICATION PROTOCOL

## Document Control
- **Document ID:** `CRITERIA-AFFINITY-001`
- **Version:** `2.0.0` (Audited Baseline)
- **Status:** `ACTIVE / AUDITED & EXPANDED`
- **Last Updated:** `2026-11-09`
- **Governing Agent:** `QAAgent` / `Orchestrator`

---

## 1. Definition of Done (DoD)

A task cannot be marked `COMPLETED` unless it meets all five strict criteria:
1. **Deliverables Present:** All declared files exist in the specified repository path.
2. **Deterministic Verification:** Automated verification script, unit test, or Playwright E2E spec passes with 0 errors.
3. **No Regressions:** Static analysis (`npm run lint`, `tsc --noEmit`) passes with 0 warnings/errors.
4. **Independent QA Sign-Off:** Verified independently by `QAAgent` with documented test artifacts; no self-certification by implementing agents.
5. **Traceability Updated:** Associated `REQ-*` in `REQUIREMENTS.md` and task status in `TASK_REGISTRY.md` and `PROGRESS.md` are updated with evidence.

---

## 2. Requirement Acceptance Mapping Matrix

| Requirement ID | Requirement Title | Verification Strategy | Automated Test Command / Procedure | Expected Result |
|---|---|---|---|---|
| `REQ-SYS-001` | Project Control System & Pre-Phase Audit | File & Traceability Audit | Automated PowerShell integrity audit | All 12 markdown control files exist; 100% of tasks have owners, deps, criteria; audit report approved. |
| `REQ-SYS-002` | Toolchain & Scaffolding | Build & Typecheck | `npm install && npm run build` | Exits with code 0; `dist/` directory generated with optimized bundle. |
| `REQ-SYS-003` | Directory Layout | Structural Verification | `Get-ChildItem -Directory -Recurse` | Matches architectural specification without orphan files. |
| `REQ-SYS-004` | Local Affinity Detection | Diagnostic Execution | `node scripts/check-affinity-env.js` | Returns JSON status verifying Affinity 3.0 installation and port 6767 listener. |
| `REQ-MCP-001` | Affinity MCP Health Bridge | Connection Health Ping | `affinity_status` tool call | Returns active connection to `http://localhost:6767/sse` with upstream tool count. |
| `REQ-MCP-002` | Live Script Execution | Script Execution Verification | `execute_script` tool call | Evaluates test JavaScript payload in Affinity DOM and returns valid JSON response. |
| `REQ-MCP-003` | Spread & Selection Render | Render Tool Invocation | `render_spread` / `render_selection` | Outputs valid image file (JPEG/PNG) to disk with non-zero byte size. |
| `REQ-MCP-004` | In-App SDK Documentation | SDK Topic Retrieval | `list_sdk_documentation` & `read_sdk_documentation_topic` | Returns structured topic list and documentation markdown in UI. |
| `REQ-MCP-005` | Script Library Store | Library Storage Test | `save_script_to_library` & `read_library_script` | Script saves and reads back with 100% byte equivalence. |
| `REQ-MCP-006` | Affinity 3.0 DOM Deep Extraction | Extraction Script Verification | `node scripts/extract-affinity-api.js` | Generates `AFFINITY_DOM_API_REFERENCE.json` capturing 100% of classes, methods, shapes, and properties. |
| `REQ-MCP-007` | Rendering Performance Benchmark | Latency Benchmark Harness | `node scripts/benchmark-mcp-render.js` | Verifies `render_spread` completes within 2000ms and logs latency metrics across resolutions. |
| `REQ-CURR-001` | Designer 10-Module Track | Content & Schema Validation | `node scripts/validate-curriculum.js --track=designer` | 10 modules (D01-D10), 30 lessons present; all have frontmatter, theory, guide, and exercise. |
| `REQ-CURR-002` | Photo 10-Module Track | Content & Schema Validation | `node scripts/validate-curriculum.js --track=photo` | 10 modules (P01-P10), 30 lessons present; covers RAW, adjustments, frequency separation, compositing. |
| `REQ-CURR-003` | Publisher 10-Module Track | Content & Schema Validation | `node scripts/validate-curriculum.js --track=publisher` | 10 modules (B01-B10), 30 lessons present; covers master pages, styles, data merge, preflight. |
| `REQ-CURR-004` | JavaScript Scripting 10-Module Track | Code Syntax & DOM Test | `node scripts/test-curriculum-scripts.js` | 10 modules (S01-S10), 30 lessons; 100% of embedded JS snippets execute without error via Affinity MCP. |
| `REQ-CURR-005` | Project Starter Assets (40 Modules) | Binary Asset Verification | `node scripts/verify-assets.js` | 40 starter `.afdesign`, `.afphoto`, `.afpub` files exist, valid signatures, openable in 3.0. |
| `REQ-CURR-006` | Challenge Benchmarks & Solutions | Visual Rendering Compare | Automated MCP comparison runner | Solution scripts produce visual outputs matching benchmark images within 98% parity. |
| `REQ-CURR-007` | Tool Encyclopedia Dataset | JSON Schema Validation | `node scripts/validate-encyclopedia-json.js` | Validated `data/tool-encyclopedia.json` containing complete tool matrix and shortcuts. |
| `REQ-CURR-008` | Resource Library Content Pack | Asset Bundle Integrity Check | `node scripts/verify-resource-pack.js` | Curated palettes, brushes, templates, and PDF cheat sheets present and valid. |
| `REQ-FE-001` | Minimalist Design System | Visual Inspection & CSS Lint | Playwright visual snapshot | Tokens loaded; dark/light mode switches cleanly; typography hierarchy rendered correctly. |
| `REQ-FE-002` | Course Catalog UI Components | Component Test & Playwright | `npx playwright test tests/e2e/catalog.spec.ts` | Displays all 4 tracks and 40 modules; search and filters function correctly. |
| `REQ-FE-003` | Interactive Lesson Viewer Shell | E2E Navigation Test | `npx playwright test tests/e2e/lesson-shell.spec.ts` | Multi-pane shell resizes smoothly; housing slide player, checklist, and download triggers. |
| `REQ-FE-004` | Monaco Script Editor | Editor Interaction Test | `npx playwright test tests/e2e/editor.spec.ts` | Autocomplete for Affinity DOM classes functions; run triggers script execution. |
| `REQ-FE-005` | Live Render Preview Window | Canvas/Image Render Test | `npx playwright test tests/e2e/preview.spec.ts` | Displays rendered graphic from MCP; pan and zoom controls operate smoothly. |
| `REQ-FE-006` | Visual Diff Comparison Tool | Split Slider Interaction | `npx playwright test tests/e2e/visual-diff.spec.ts` | Split slider drags horizontally revealing student vs benchmark layers. |
| `REQ-FE-007` | Slide-Based Lesson Engine | Slide Transition & Key Nav Test | `npx playwright test tests/e2e/slide-player.spec.ts` | Smooth 5-step slide transitions; left/right arrow key navigation verified. |
| `REQ-FE-008` | In-Browser Tool Simulator | Interactive Canvas E2E Test | `npx playwright test tests/e2e/simulator.spec.ts` | User can place nodes, adjust bezier handles, and perform boolean operations on canvas. |
| `REQ-FE-009` | Searchable Tool Encyclopedia UI | Search & Modal E2E Test | `npx playwright test tests/e2e/encyclopedia.spec.ts` | Instant filtering by app/persona; tool cards open detail modal with modifier table. |
| `REQ-FE-010` | Resource Library Download UI | Download Flow Test | `npx playwright test tests/e2e/resources.spec.ts` | Cards display format badges and preview; download buttons trigger file downloads. |
| `REQ-PAGE-001` | Major Page: Home / Landing | Playwright Page Verification | `npx playwright test tests/e2e/pages/home.spec.ts` | Hero, MCP connection pill, 4 track cards, and navigation links load with 0 console errors. |
| `REQ-PAGE-002` | Major Page: Catalog & Tracks | Playwright Page Verification | `npx playwright test tests/e2e/pages/catalog.spec.ts` | All 40 modules render in grid; track tabs filter modules instantly. |
| `REQ-PAGE-003` | Major Page: Slide Lesson Player | Playwright Page Verification | `npx playwright test tests/e2e/pages/lesson.spec.ts` | Slide deck renders, drawer toggles outline, checklist tracks completion state. |
| `REQ-PAGE-004` | Major Page: Tool Simulator Sandbox | Playwright Page Verification | `npx playwright test tests/e2e/pages/simulator.spec.ts` | Interactive canvas loads tools; challenge prompt evaluates user drawing accuracy. |
| `REQ-PAGE-005` | Major Page: Tool Encyclopedia | Playwright Page Verification | `npx playwright test tests/e2e/pages/encyclopedia.spec.ts` | Search input filters tools in < 50ms; shortcut badges render for Win/Mac. |
| `REQ-PAGE-006` | Major Page: Scripting Playground | Playwright Page Verification | `npx playwright test tests/e2e/pages/playground.spec.ts` | Monaco editor and preview pane load; run button connects to Affinity MCP. |
| `REQ-PAGE-007` | Major Page: Resource Library | Playwright Page Verification | `npx playwright test tests/e2e/pages/resources.spec.ts` | Category tabs switch between palettes, brushes, templates, cheat sheets. |
| `REQ-PAGE-008` | Major Page: Student Dashboard | Playwright Page Verification | `npx playwright test tests/e2e/pages/dashboard.spec.ts` | Profile renders with progress bars across all 40 modules and badge gallery. |
| `REQ-BE-001` | Supabase Relational Schema | SQL Migration Validation | Supabase MCP `execute_sql` | All tables created for 40 modules, 120 lessons, submissions, progress, profiles. |
| `REQ-BE-002` | Supabase Auth & RLS | Security Policy Test | SQL test harness querying as anon/auth | Users can only modify their own profile/progress; curriculum is public read-only. |
| `REQ-BE-003` | Supabase Storage Buckets | Storage Upload/Download Test | Storage API curl/script | File upload accepts allowed MIME types and rejects unauthorized executables. |
| `REQ-BE-004` | Progress Tracking Client | State Persistence Test | Playwright test with page reload | Completed lesson tick persists to Supabase and remains marked after hard reload. |
| `REQ-QA-001` | Playwright E2E Suite | Full E2E Test Execution | `npx playwright test` | 100% passing across Chromium, Firefox, WebKit for all 8 pages. |
| `REQ-QA-002` | Visual Regression Testing | Snapshot Comparison | `npx playwright test --update-snapshots` | Visual diff tolerance < 0.1% across all supported breakpoints. |
| `REQ-QA-003` | Script Execution Runner | Automated MCP Validation | `node scripts/test-curriculum-scripts.js` | 0 runtime exceptions across all 30 scripting lesson exercises. |
| `REQ-QA-004` | Static Analysis Pipeline | Lint & Typecheck | `npm run lint && npm run typecheck` | 0 errors, 0 warnings. |
| `REQ-QA-005` | Independent Verification Gatekeeping | Sign-Off Audit | QA Sign-off report in `project-control/` | Every completed task has an associated QA verification log before transition. |
| `REQ-OPS-001` | Netlify Production Build | Production Build Verification | `npm run build && npx netlify build` | Build artifacts generated in `dist/`; routing rules verified. |
| `REQ-OPS-002` | Developer Setup Guide | Clean Environment Run | Verification in fresh shell session | Following `README.md` allows full local startup in < 5 minutes. |
| `REQ-OPS-003` | Security & Secrets Audit | Static Secrets Scanner | Git log & file scan | Zero API keys, database secrets, or tokens committed to git repository. |
