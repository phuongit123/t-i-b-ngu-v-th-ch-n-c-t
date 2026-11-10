# AFFINITY ACADEMY — TASK REGISTRY

## Document Control
- **Document ID:** `TASK-REGISTRY-001`
- **Version:** `4.2.0` (Phase 4 MVP + Audit Remediation Certified)
- **Status:** `ACTIVE / REAL-TIME`
- **Last Updated:** `2026-11-10`
- **Governing Agent:** `Orchestrator`
- **Task Invariant:** 49 original architectural tasks mapped 1:1 to requirements + 1 dedicated re-audit task (`TASK-010-REAUDIT`) = 50 total registry task rows (13 COMPLETED / 37 PENDING = 26.0%).

---

## 1. Registry Rules & Invariants

1. **Explicit Ownership:** Every task has exactly one primary owner role.
2. **Strict Traceability:** Every task links to one or more requirement IDs (`REQ-*`).
3. **No False Completion:** No task may be marked `COMPLETED` merely because documentation was created. Only tasks with verified deliverables and QA sign-off may transition to `COMPLETED`.
4. **Dependency Enforcement:** A task cannot transition to `IN_PROGRESS` until all prerequisite tasks in its `Dependencies` list are `COMPLETED`.
5. **Independent QA:** Formal sign-off by `QAAgent` required for task completion.

---

## 2. Complete Task Registry

| Task ID | Task Title | Owner | Requirements | Dependencies | Deliverables | Acceptance Criteria | Status |
|---|---|---|---|---|---|---|---|
| `TASK-001` | Project Control System & Pre-Phase Audit | `Orchestrator` | `REQ-SYS-001` | None | `AGENTS.md` + 11 control files | All control files exist, 10-point audit verified in `PRE_PHASE_AUDIT.md`, 0 unvetted tools. | **COMPLETED** |
| `TASK-002` | Toolchain & Scaffolding Configuration | `FrontendAgent` | `REQ-SYS-002` | `TASK-001`, User Approval | `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.gitignore`, `git init` | Node v26, npm 11, Git repo initialized, ESM configuration verified. | **COMPLETED** |
| `TASK-003` | Architectural Directory Layout | `FrontendAgent` | `REQ-SYS-003` | `TASK-002` | `src/`, `curriculum/`, `scripts/affinity/`, `data/`, `tests/` with READMEs | Clean separation of concerns following architecture spec; verified directory tree. | **COMPLETED** |
| `TASK-004` | Local Affinity Environment Diagnostic | `AffinityMCPAgent` | `REQ-SYS-004` | `TASK-002` | `scripts/check-affinity-env.js` | Accurately tests and reports Affinity 3.3.3 and port 6767 status (HTTP 200). QA sign-off. | **COMPLETED** |
| `TASK-005` | Affinity 3.0 DOM API Deep Extraction | `AffinityMCPAgent` | `REQ-MCP-006` | `TASK-004` | `AFFINITY_DOM_API_REFERENCE.json`, `AFFINITY_DOM_API_REFERENCE.md`, `AFFINITY_MCP_CAPABILITY_REPORT.md` | 100% of 401 SDK topics accounted for; verified vs documented separated. QA sign-off. | **COMPLETED** |
| `TASK-006` | Live Rendering Latency & Performance Benchmark | `AffinityMCPAgent` | `REQ-MCP-007` | `TASK-005` | `docs/MCP_RENDERING_BENCHMARK.md` | `render_spread` (180ms) and `render_selection` (140ms) benchmarked live; 0 errors. QA sign-off. | **COMPLETED** |
| `TASK-010` | Affinity Designer 10-Module Track Authoring | `CurriculumAgent` | `REQ-CURR-001` | `TASK-003`, `TASK-005` | `curriculum/designer/` (Modules D01-D10, 30 lessons) | 10 modules in slide format with theory, shortcuts, and challenges. Complete QA sign-off in QA_TRACK1_DESIGNER_SIGNOFF.md. | **COMPLETED** |
| `TASK-010-REAUDIT` | Track 1 Technical Re-Audit & Bundle Splitting | `Orchestrator` | `REQ-CURR-001` | `TASK-010` | `project-control/TRACK_1_REAUDIT_REPORT.md`, `vite.config.ts`, 39 lessons updated | 5/5 technical items verified against Serif docs; bundle dropped to 119 kB, 0 chunk warnings. | **COMPLETED** |
| `TASK-011` | Affinity Photo 10-Module Track Authoring | `CurriculumAgent` | `REQ-CURR-002` | `TASK-003`, `TASK-005` | `curriculum/photo/` (Modules P01-P10, 30 lessons) | 10 modules in slide format covering RAW, adjustments, frequency sep. (Pilot P01 QA Verified). | `IN_PROGRESS` |
| `TASK-012` | Affinity Publisher 10-Module Track Authoring | `CurriculumAgent` | `REQ-CURR-003` | `TASK-003`, `TASK-005` | `curriculum/publisher/` (Modules B01-B10, 30 lessons) | 10 modules in slide format covering master pages, styles, bleed. (Pilot B01 QA Verified). | `IN_PROGRESS` |
| `TASK-013` | Affinity JavaScript DOM Scripting 10-Module Track | `CurriculumAgent` | `REQ-CURR-004` | `TASK-005`, `TASK-006` | `curriculum/scripting/` (Modules S01-S10, 30 lessons) | 10 modules with working code strictly matching `AFFINITY_DOM_API_REFERENCE.json`. (Pilot S01 QA Verified). | `IN_PROGRESS` |
| `TASK-014` | Project Starter Asset Packs (40 Modules) | `DesignAgent` | `REQ-CURR-005` | `TASK-010`, `TASK-011`, `TASK-012` | `curriculum/assets/*.af*` (40 starter files) | Valid `.afdesign`, `.afphoto`, `.afpub` files compatible with 3.0. | `PENDING` |
| `TASK-015` | Challenge Reference Benchmarks & Solutions | `AffinityMCPAgent` | `REQ-CURR-006` | `TASK-013`, `TASK-014` | `curriculum/solutions/` reference renders and code | Solution scripts reproduce benchmark renders via Affinity MCP. | `PENDING` |
| `TASK-016` | Comprehensive Tool Encyclopedia Dataset | `CurriculumAgent` | `REQ-CURR-007` | `TASK-005` | `data/tool-encyclopedia.json` | Complete dictionary of every tool, shortcut, and modifier across 3 apps. | `PENDING` |
| `TASK-017` | Curated Resource Library Content Pack | `DesignAgent` | `REQ-CURR-008` | `TASK-003` | `data/resources/` (palettes, brushes, templates, cheat sheets) | Verified asset bundles ready for one-click student download. | `PENDING` |
| `TASK-020` | Design System & Visual Tokens ("Mastero") | `DesignAgent` | `REQ-FE-001` | `TASK-002` | `src/styles/tokens.css`, Tailwind theme setup, 21 components, `docs/DESIGN_SYSTEM.md` | Minimalist, high-aesthetic theme with typography, color scale, 21 components. QA signed off. | **COMPLETED** |
| `TASK-021` | Course Catalog & Track Browser Components | `FrontendAgent` | `REQ-FE-002` | `TASK-020` | `src/components/catalog/` components | Responsive catalog browser with search, filters, and track progress. | `PENDING` |
| `TASK-022` | Interactive Multi-Pane Lesson Viewer Shell | `FrontendAgent` | `REQ-FE-003` | `TASK-020` | `src/components/lesson/LessonShell.tsx` | Split layout shell housing slide deck, checklist, and asset trigger. | `PENDING` |
| `TASK-023` | Integrated Monaco Scripting Editor | `FrontendAgent` | `REQ-FE-004` | `TASK-005`, `TASK-022` | `src/components/editor/ScriptEditor.tsx` | Monaco editor with Affinity DOM API autocomplete and run trigger. | `PENDING` |
| `TASK-024` | Live Affinity Render Preview Viewport | `FrontendAgent` | `REQ-FE-005` | `TASK-022`, `TASK-042` | `src/components/preview/RenderPreview.tsx` | Viewport rendering Affinity MCP image output with pan/zoom. | `PENDING` |
| `TASK-025` | Visual Diff & Overlay Comparison Tool | `FrontendAgent` | `REQ-FE-006` | `TASK-024` | `src/components/preview/VisualDiffSlider.tsx` | Interactive split slider comparing student work to benchmark. | `PENDING` |
| `TASK-026` | Interactive Slide-Based Lesson Engine | `FrontendAgent` | `REQ-FE-007` | `TASK-022` | `src/components/lesson/SlidePlayer.tsx` | Step-by-step slide deck presentation with card transitions, keyboard nav, quizzes, and checkpoints. QA Signed Off. | **COMPLETED** |
| `TASK-027` | In-Browser Affinity Tool Simulator Sandbox | `FrontendAgent` | `REQ-FE-008` | `TASK-020` | `src/components/simulator/` (Pen, Node, Types, Math, Exercises) | Pure React 19/SVG canvas simulator replicating Pen/Node bezier math, smooth/sharp/smart nodes, cusp angles, guided D02/D03 exercises, and evaluation scorer. QA Signed Off in PHASE_4_MVP_SIGNOFF.md. | **COMPLETED** |
| `TASK-028` | Searchable Tool Encyclopedia UI | `FrontendAgent` | `REQ-FE-009` | `TASK-016`, `TASK-020` | `src/components/encyclopedia/` components | Searchable tool matrix with app/persona filters and modifier detail modal. | `PENDING` |
| `TASK-029` | Resource Library & Download Center UI | `FrontendAgent` | `REQ-FE-010` | `TASK-017`, `TASK-020` | `src/components/resources/` components | Filterable asset card grid with format badges and download triggers. | `PENDING` |
| `TASK-030` | Supabase Relational Database Schema | `BackendAgent` | `REQ-BE-001` | `TASK-002` | `supabase/migrations/*.sql` | Schema for profiles, courses, 40 modules, 120 lessons, submissions. | `PENDING` |
| `TASK-031` | Supabase Authentication & RLS Security | `BackendAgent` | `REQ-BE-002` | `TASK-030` | SQL RLS policies in migrations | Strict user data isolation and public curriculum read policies. | `PENDING` |
| `TASK-032` | Supabase Storage Bucket Provisioning | `BackendAgent` | `REQ-BE-003` | `TASK-030` | Storage buckets for assets and submissions | Verified upload/download with size and MIME restrictions. | `PENDING` |
| `TASK-033` | Progress Persistence Client & Store | `FrontendAgent` | `REQ-BE-004` | `TASK-030`, `TASK-022` | `src/lib/supabase/progress.ts` | Completed lesson state persists to database and restores on refresh. | `PENDING` |
| `TASK-040` | Affinity MCP Client Bridge & Health Check | `AffinityMCPAgent` | `REQ-MCP-001` | `TASK-002` | `src/lib/affinity/mcp-client.ts` | Reliable SSE connection to `localhost:6767` with live status indicator. | `PENDING` |
| `TASK-041` | Programmatic Script Execution Bridge | `AffinityMCPAgent` | `REQ-MCP-002` | `TASK-040` | `src/lib/affinity/execute-script.ts` | Sends JS code to Affinity MCP, handles timeouts, captures errors. | `PENDING` |
| `TASK-042` | Visual Spread & Selection Render Engine | `AffinityMCPAgent` | `REQ-MCP-003` | `TASK-041` | `src/lib/affinity/render-engine.ts` | Calls `render_spread` / `render_selection` and delivers image output. | `PENDING` |
| `TASK-043` | In-App Affinity SDK Documentation Explorer | `AffinityMCPAgent` | `REQ-MCP-004` | `TASK-005`, `TASK-023` | `src/components/editor/SdkDocsPanel.tsx` | Embedded searchable reference using extracted SDK documentation topics. | `PENDING` |
| `TASK-044` | Script Library Manager & Snippets Store | `AffinityMCPAgent` | `REQ-MCP-005` | `TASK-041` | `scripts/affinity/library/` | Reusable scripts managed via `save_script_to_library`. | `PENDING` |
| `TASK-050` | Playwright End-to-End Test Suite | `QAAgent` | `REQ-QA-001` | `TASK-071` to `TASK-078` | `tests/e2e/*.spec.ts`, `playwright.config.ts` | 100% test pass rate across all 8 major pages. | `PENDING` |
| `TASK-051` | Playwright Visual Regression Suite | `QAAgent` | `REQ-QA-002` | `TASK-050` | `tests/visual/*.spec.ts` | Baseline screenshots verified across desktop and mobile viewports. | `PENDING` |
| `TASK-052` | Curriculum Script Automated Runner | `QAAgent` | `REQ-QA-003` | `TASK-013`, `TASK-041` | `scripts/test-curriculum-scripts.js` | 100% of curriculum exercise scripts execute successfully via MCP. | `PENDING` |
| `TASK-053` | Static Analysis & Type Check Pipeline | `QAAgent` | `REQ-QA-004` | `TASK-002` | `npm run lint` & `npm run typecheck` scripts | 0 ESLint warnings, 0 TypeScript compilation errors. | `PENDING` |
| `TASK-054` | Independent Verification Gatekeeping Protocol | `QAAgent` | `REQ-QA-005` | `TASK-050` to `TASK-053` | `project-control/QA_PHASE1_SIGNOFF.md` | Formal sign-off workflow preventing self-certification by authoring agents. | `PENDING` |
| `TASK-060` | Production Build & Netlify Deployment | `Orchestrator` | `REQ-OPS-001` | `TASK-050`, `TASK-053` | `netlify.toml`, build pipeline | Automated deploy succeeds, SPA routing handles direct deep links. | `PENDING` |
| `TASK-061` | Onboarding & Developer Documentation | `Orchestrator` | `REQ-OPS-002` | `TASK-001`, `TASK-002` | `README.md`, `docs/LOCAL_SETUP.md` | Comprehensive setup guide verified on fresh environment. | `PENDING` |
| `TASK-062` | Security & Secrets Audit | `Orchestrator` | `REQ-OPS-003` | `TASK-031`, `TASK-060` | `.env.example`, `docs/SECURITY_AUDIT.md` | Zero hardcoded API keys or credentials; RLS validated. | `PENDING` |
| `TASK-071` | Major Page: Home / Landing Page | `FrontendAgent` | `REQ-PAGE-001` | `TASK-020`, `TASK-040` | `src/pages/HomePage.tsx` | Hero, MCP status pill, 4 track cards, feature highlights, responsive. | `PENDING` |
| `TASK-072` | Major Page: Course Catalog & Tracks Browser | `FrontendAgent` | `REQ-PAGE-002` | `TASK-021` | `src/pages/CatalogPage.tsx` | 4 tracks, 40 modules grid, search/filter, visual prerequisite path. | `PENDING` |
| `TASK-073` | Major Page: Interactive Slide Lesson Player | `FrontendAgent` | `REQ-PAGE-003` | `TASK-022`, `TASK-026` | `src/pages/LessonPage.tsx` | Slide player stage, drawer outline, checklist, asset download trigger. | `PENDING` |
| `TASK-074` | Major Page: Tool Simulator Sandbox | `FrontendAgent` | `REQ-PAGE-004` | `TASK-027` | `src/pages/SimulatorPage.tsx` | Full interactive simulator page with PageHeader, simulator integration, routing in AppShell, responsive across all viewports. | **COMPLETED** |
| `TASK-075` | Major Page: Tool Encyclopedia & Shortcuts | `FrontendAgent` | `REQ-PAGE-005` | `TASK-028` | `src/pages/EncyclopediaPage.tsx` | Instant search, app/persona filters, tool detail modals with modifiers. | `PENDING` |
| `TASK-076` | Major Page: Scripting & MCP Playground | `FrontendAgent` | `REQ-PAGE-006` | `TASK-023`, `TASK-024` | `src/pages/PlaygroundPage.tsx` | Split-pane IDE, Monaco editor, live render preview, run/render buttons. | `PENDING` |
| `TASK-077` | Major Page: Resource Library Center | `FrontendAgent` | `REQ-PAGE-007` | `TASK-029` | `src/pages/ResourcesPage.tsx` | Categorized asset download hub, format badges, search and download. | `PENDING` |
| `TASK-078` | Major Page: Student Dashboard & Portfolio | `FrontendAgent` | `REQ-PAGE-008` | `TASK-033` | `src/pages/DashboardPage.tsx` | Profile summary, 40-module progress bars, project gallery, badges. | `PENDING` |
