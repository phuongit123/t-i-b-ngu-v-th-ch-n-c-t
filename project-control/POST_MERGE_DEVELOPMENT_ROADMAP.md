# AFFINITY ACADEMY — POST-MERGE DEVELOPMENT ROADMAP & ARCHITECTURAL CONTINUATION

## Document Control
- **Document ID:** `ROADMAP-AFFINITY-002`
- **Version:** `1.0.0`
- **Date & Timestamp:** `2026-11-16T20:50:00+07:00`
- **Base Commit SHA:** `22aa4cf08d74e564bf371e2adbe4cfb56e5e3a6c` (Merge pull request #6 on `main`)
- **Working Branch:** `docs/post-merge-development-roadmap`
- **Governing Roles:** `Lead Orchestrator` / `QA Architect` / `Principal Engineer`
- **Governance Gate:** `BLK-007 ACTIVE — LOCKED` (Preserves CI/CD 66/66 curriculum validator stability)

---

## 1. Executive Baseline Summary

Following the successful merge of Pull Request #6 into `main` via merge commit `22aa4cf`, Affinity Academy has reached **Release Candidate v1.0.0** maturity for its core learning platform:
- **Verified Curriculum:** 66 physical lessons (30 Designer, 30 Photo, 3 Publisher pilot, 3 Scripting pilot) passing 100% of schema and content validations.
- **Specification Blueprint:** 54 expansion lessons (Publisher B02–B10: 27 lessons; Scripting S02–S10: 27 lessons) fully architected in [`CURRICULUM_EXPANSION_SPEC_66_TO_120.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/CURRICULUM_EXPANSION_SPEC_66_TO_120.md).
- **Web Application:** 12 functional areas operational, Dark Luxury design system, dual simulator engine (Vector Bézier + Photo Layer/Masking), instant search, and challenges.
- **Backend Architecture:** 5 SQL migrations defining 9 relational tables, zero-trust RLS policies, 50MB storage bucket with MIME whitelisting, and an Offline-First synchronization engine with exponential backoff retry.
- **Assessment Subsystem:** Authentic A5 Capstone (*Lumina Artisanal Roastery Launch Campaign*), 7-dimension scoring rubric, 5 critical dimensions enforcing `PLO-07` and `PLO-08`, and an immutable evaluator grading console.
- **Test Integrity:** 46/46 Playwright E2E tests PASS; 44/44 backend unit/integration tests PASS; 7/7 capstone evaluator tests PASS; 0 ESLint warnings; 0 TypeScript compilation errors.

---

## 2. Completed Milestones vs. Active Boundaries

| Milestone / Domain | Completed Deliverables | Active Boundary / Unfinished Scope | Governed Status |
|:---|:---|:---|:---:|
| **Phase 0 & 1** | Project control system, toolchain, directory scaffolding, port 6767 diagnostic, DOM API extraction (401 SDK topics). | Upstream MCP schema differences between runtime and documentation topics. | **COMPLETED** |
| **Phase 2** | "Mastero" Design System tokens, 21 reusable UI components, typography scale, responsive breakpoints. | Dark Luxury styling established; dedicated animations for code playground pending. | **COMPLETED** |
| **Phase 3** | Track 1 Designer (30 lessons), Track 2 Photo (30 lessons), Publisher pilot (3 lessons), Scripting pilot (3 lessons). | 54 expansion lessons (Publisher B02–B10: 27, Scripting S02–S10: 27) await Phase Gate `BLK-007` release. | **55.0% COMPLETED** |
| **Phase 4** | `SlidePlayer.tsx`, Vector Bézier Simulator (`PenNodeSimulator.tsx`), Photo Layer Simulator (`PhotoLayerSimulator.tsx`). | Live Monaco Scripting Editor (`TASK-023`) and MCP Render Preview Viewport (`TASK-024`). | **PARTIAL (MVP Operational)** |
| **Phase 5** | 12 Functional Areas implemented across AppShell; 5 Major Pages (`HomePage`, `SimulatorPage`, `EncyclopediaPage`, `ResourcesPage`, `DashboardPage`). | 3 Major Page Tasks pending extraction: `TASK-072` (CatalogPage), `TASK-073` (LessonPage), `TASK-076` (PlaygroundPage). | **PARTIAL (5/8 Major Pages)** |
| **Phase 6** | 5 SQL migrations, 9 core tables, RLS policies, storage bucket configs, offline-first sync client, AuthModal, ProtectedRoute. | Live Supabase cloud project provisioning, remote migration execution, live cloud auth smoke testing. | **LOCAL PASS / CLOUD PENDING** |
| **TASK-080** | 68 provisional tools tracked (50 P4, 17 V1, 1 U0); 5 core P4 tools verified with Serif Help Center; educational disclaimer codified. | Operation-level semantic review of 50 P4 claims, runtime executable introspection against build 3.3.3.5004. | **IN_PROGRESS** |
| **TASK-081** | Spec, types, service, evaluator harness (7/7 PASS), E2E test (5/5 PASS), UI console. | Official graduation certificate issuance is strictly gated until `TASK-080` concludes. | **IMPLEMENTED / GATED** |

---

## 3. Prioritized Engineering Backlog (P0 – P3)

```
+-----------------------------------------------------------------------------------+
|                           ENGINEERING PRIORITY PYRAMID                            |
+-----------------------------------------------------------------------------------+
| P0: GOVERNANCE ALIGNMENT & DESKTOP AUDIT HARNESS (Immediate, zero-risk, no blocks)|
| P1: PHASE 5 REMAINING MAJOR PAGES (TASK-072, TASK-073, TASK-076 - code-splitting) |
| P2: PHASE 6 SUPABASE CLOUD PROVISIONING (Pending Project Owner cloud credentials) |
| P3: BLK-007 UNLOCKING & 54 EXPANSION LESSON AUTHORING (Pending explicit PO approval) |
+-----------------------------------------------------------------------------------+
```

### 3.1. Priority P0 — Immediate Governance Alignment & Task-080 Audit Harness
1. **P0-1: Governance Consistency:**
   - Synchronize table count across all documents to exactly **9 relational tables**.
   - Explicitly distinguish the **12 Functional Areas** from the **8 Major Page Tasks** in `TASK_REGISTRY.md` and `PROGRESS.md`.
   - Update `RELEASE_READINESS_REPORT.md` to reference the final merge commit `22aa4cf`.
2. **P0-2: Task-080 Runtime Diagnostic Harness:**
   - Author `scripts/audit-affinity-runtime.js` to introspect running Affinity 3.3.3 desktop process over port 6767, inspect DOM methods, and extract verified version metadata to close the target-build evidence gap.

### 3.2. Priority P1 — Phase 5 Remaining Major Pages (`TASK-072`, `TASK-073`, `TASK-076`)
These tasks extract inline UI components from `src/App.tsx` into dedicated, code-split pages within `src/pages/`:

#### A. `TASK-072`: Course Catalog & Track Browser (`src/pages/CatalogPage.tsx`)
- **Functional Specification:**
  - Dedicated full-page view for exploring the curriculum across all 4 tracks.
  - Multi-dimensional filters: Track (`designer`, `photo`, `publisher`, `scripting`), Difficulty (`Beginner`, `Intermediate`, `Advanced`), Status (`All`, `Completed`, `In Progress`, `Not Started`).
  - Search bar filtering modules and lessons by title, tool, or description.
  - Visual prerequisite path visualization showing module progression and milestone gates.
- **Component Architecture:**
  - `src/pages/CatalogPage.tsx` (Lazy-loaded page container).
  - `src/components/catalog/TrackFilterBar.tsx` (Studio tabs with active counts).
  - `src/components/catalog/ModuleGrid.tsx` (Responsive card grid with progress bars).
  - `src/components/catalog/LessonDrawer.tsx` (Slide-out panel for quick lesson inspection).
- **Acceptance Criteria:**
  - 100% decoupled from `src/App.tsx`.
  - Responsive across Mobile (375px), Tablet (768px), and Desktop (1440px).
  - E2E tests verify track switching, filtering, and deep-link launching.

#### B. `TASK-073`: Interactive Multi-Pane Lesson Viewer Shell (`src/pages/LessonPage.tsx`)
- **Functional Specification:**
  - Dedicated full-screen immersive lesson environment housing `SlidePlayer.tsx`.
  - Collapsible Outline Sidebar showing all slides, checkpoints, and practice exercises with live progress indicators.
  - Sticky bottom/top navigation bar with shortcut indicators (`←` / `→` / `Space`).
  - Integrated Asset Download Trigger with direct link to local practice files.
  - Checkpoint verification modal when completing exercises.
- **Component Architecture:**
  - `src/pages/LessonPage.tsx` (Page container with URL param `/lesson/:lessonId`).
  - `src/components/lesson/LessonOutlineSidebar.tsx` (Collapsible slide index).
  - `src/components/lesson/LessonHeaderBar.tsx` (Breadcrumbs, exit button, lesson metadata).
  - `src/components/lesson/AssetTriggerPill.tsx` (One-click asset opener).
- **Acceptance Criteria:**
  - Direct deep linking (`/lesson/D01-01`, `/lesson/P02-01`, etc.) loads the correct lesson and state.
  - Outline sidebar accurately reflects current slide index and completed quiz status.
  - Full keyboard accessibility and responsive viewport scaling.

#### C. `TASK-076`: Scripting & MCP Playground (`src/pages/PlaygroundPage.tsx`)
- **Functional Specification:**
  - Split-pane developer environment for Affinity JavaScript DOM scripting.
  - Left pane: Code editor with syntax highlighting, template selector, and Affinity DOM API snippets.
  - Right pane: Execution console, execution latency metrics, and simulated MCP rendering viewport.
  - Pre-loaded sample scripts:
    1. *Batch Artboard Exporter* (Automates slice generation).
    2. *Non-Destructive Vignette Generator* (Creates masked adjustment layer).
    3. *Color Palette Token Injector* (Populates Swatches from JSON).
- **Component Architecture:**
  - `src/pages/PlaygroundPage.tsx` (Lazy-loaded page container).
  - `src/components/editor/CodeEditorPane.tsx` (Lightweight code editor / Monaco fallback).
  - `src/components/preview/ExecutionConsole.tsx` (Real-time log capture and JSON tree viewer).
  - `src/components/preview/RenderPreviewViewport.tsx` (Canvas preview with pan/zoom controls).
- **Acceptance Criteria:**
  - Safe sandboxed execution: scripts run locally without blocking main UI thread.
  - Zero `eval()` or unvetted dynamic script injection on client without sandboxing.
  - Responsive split layout with draggable separator.

### 3.3. Priority P2 — Phase 6 Supabase Live Cloud Readiness
- Triggered once the Project Owner provides production cloud credentials (`SUPABASE_URL` and `SUPABASE_ANON_KEY`).
- Execution of operational checklist: remote migrations, storage bucket linking, live RLS testing.

### 3.4. Priority P3 — Curriculum Expansion (54 Lessons) under Gate `BLK-007`
- Gated strictly until explicit Project Owner unlocking directive.
- Execution of `CURRICULUM_EXPANSION_SPEC_66_TO_120.md` to generate physical JSON lesson files.

---

## 4. Pull Request Execution Strategy (Next 5 PRs)

To maintain uncompromising repository safety and linear verification, all future development will proceed in atomic, reviewable Pull Requests branched from `main`:

| PR # | Working Branch | Scope & Tasks Addressed | Deliverables & Verification |
|:---:|:---|:---|:---|
| **PR #7** | `docs/governance-and-audit-plan` | Governance alignment & Task-080 closure plan | Update table counts (9 tables), reconcile 12 functional areas vs 8 major pages, update merge commit in release report. |
| **PR #8** | `feat/task-072-catalog-page` | `TASK-072`: Course Catalog & Track Browser | `src/pages/CatalogPage.tsx`, `src/components/catalog/*`, unit tests, Playwright E2E suite (`catalog-page.spec.ts`). |
| **PR #9** | `feat/task-073-lesson-page-shell` | `TASK-073`: Multi-Pane Lesson Viewer Shell | `src/pages/LessonPage.tsx`, `src/components/lesson/LessonOutlineSidebar.tsx`, deep-link routing tests (`lesson-page.spec.ts`). |
| **PR #10** | `feat/task-076-scripting-playground` | `TASK-076`: Scripting & MCP Playground | `src/pages/PlaygroundPage.tsx`, execution console, sample scripts, Playwright E2E suite (`playground-page.spec.ts`). |
| **PR #11** | `feat/task-080-runtime-audit` | `TASK-080`: Desktop Executable Audit | `scripts/audit-affinity-runtime.js`, runtime handshake capture, conclude `TASK-080` to unblock `TASK-081` graduation. |

---

## 5. Phase 6 Live Cloud Readiness Checklist

The following checklist is prepared for the Project Owner to safely commission the Supabase cloud backend without exposing credentials or risking data leakage:

### Pre-Requisites (Owner Action in Supabase Console)
- [ ] Create a new Supabase project in the desired cloud region (e.g., `Singapore - ap-southeast-1`).
- [ ] Record `Project URL` and `anon / public key`.
- [ ] **NEVER** copy or commit the `service_role secret` into frontend `.env` or client files.

### Database Migration Deployment
- [ ] Option A (CLI): Link project via `supabase link --project-ref <id>` and run `supabase db push`.
- [ ] Option B (SQL Editor): Execute the 5 migration scripts in exact chronological order:
  1. `supabase/migrations/20261116000001_initial_schema.sql` (Creates `profiles`, `tracks`, `modules`, `lessons`).
  2. `supabase/migrations/20261116000002_progress_and_assessments.sql` (Creates 5 progress/assessment tables).
  3. `supabase/migrations/20261116000003_rls_policies.sql` (Enables RLS across all 9 tables).
  4. `supabase/migrations/20261116000004_storage_buckets.sql` (Provisions `submissions` & `resources` buckets).
  5. `supabase/migrations/20261116000005_seed_data.sql` (Populates tracks and 66 curriculum lessons).

### Live Verification Smoke Test
- [ ] Register a new test user account via live Auth modal.
- [ ] Verify profile auto-creation in `public.profiles`.
- [ ] Mark lesson `D01-01` complete and observe cloud sync badge turn green (`synced`).
- [ ] Attempt an assessment upload (50MB cap, MIME whitelist).

---

## 6. TASK-080 Closure Requirements & Verification Matrix

To transition `TASK-080` from `IN_PROGRESS` to `COMPLETED`, the following 6 evidence gaps must be conclusively addressed:

| Evidence Gap # | Target Focus | Required Action & Evidence Deliverable | Current Status |
|:---:|:---|:---|:---:|
| **GAP-01** | **Operation-Level Review (50 P4 Claims)** | Audit specific UI operations (e.g., Corner Tool radius limits, Compound Booleans, Live Lighting falloff) against application behavior. | 5 core tools verified in Round 13; 45 remaining P4 tools require semantic sign-off. |
| **GAP-02** | **Artboard Tool Documentation Body** | Review full documentation text for Artboard multi-canvas behavior beyond the located Serif URL. | Article URL verified; deep operational limits flagged in curriculum notes. |
| **GAP-03** | **Histogram Panel Documentation Body** | Review full clipping warning and channel display documentation beyond the located Serif URL. | Article URL verified; practice exercise claims narrowed to match help text. |
| **GAP-04** | **17 V1 Capability Review** | Evaluate whether any of the 17 V1 tools (e.g., Vector Flood Fill, Knife Tool) have sufficient lesson depth to warrant P4 promotion. | Held strictly at V1 until dedicated practice exercises exist. |
| **GAP-05** | **1 U0 Unvetted Candidate Audit** | Perform dedicated inspection of the single unvetted tool record to determine inclusion or exclusion. | U0 candidate documented in matrix; awaiting verification. |
| **GAP-06** | **Target Desktop Runtime Handshake** | Execute live socket/HTTP handshake with running Affinity desktop process on Windows 11 host (build 3.3.3.5004). | Awaiting active application process execution on host. |

---

## 7. Recommended Next Implementation Step

The recommended immediate action is **PR #7 (`docs/governance-and-audit-plan`)**:
1. Reconcile minor governance discrepancies across control files on branch `docs/post-merge-development-roadmap`.
2. Commit `project-control/POST_MERGE_DEVELOPMENT_ROADMAP.md`.
3. Submit PR #7 for Project Owner review to establish the baseline before starting `TASK-072` (`src/pages/CatalogPage.tsx`).
