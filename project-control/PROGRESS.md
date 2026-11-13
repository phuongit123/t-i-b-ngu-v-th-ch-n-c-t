# AFFINITY ACADEMY — PROGRESS DASHBOARD

## Document Control
- **Document ID:** `PROGRESS-AFFINITY-001`
- **Version:** `4.2.2` (Track 1 Designer and Track 2 Photo curriculum; 6 pilot lessons also present)
- **Status:** `ACTIVE — PHASE GATE BLK-007 LOCKED`
- **Project Phase:** `Phase 5 — Web Platform Implementation (3/12 tasks complete; 9 pending)`
- **Curriculum Status:** `60 core + 6 pilot = 66 existing / 120 planned lessons`
- **Verification Evidence:** `66/66 curriculum validation and 9/9 Playwright E2E are historical local results; rerun on the current branch before sign-off`
- **Last Updated:** `2026-11-13`
- **Governing Agent:** `Orchestrator` / `QAAgent`

---

## 1. High-Level Progress Overview

| Phase | Description | Task Count | Completed | In Progress | Pending | Status |
|---|---|---|---|---|---|---|
| **Phase 0** | Project Control System & Pre-Phase Audit | 1 | 1 | 0 | 0 | **COMPLETED** |
| **Phase 1** | Environment, Toolchain & MCP Capability Extraction | 5 | 5 | 0 | 0 | **COMPLETED (QA Signed Off)** |
| **Phase 2** | Design System & Visual Foundations ("Mastero") | 1 | 1 | 0 | 0 | **COMPLETED (QA Signed Off)** |
| **Phase 3** | 40-Module Curriculum Development & Asset Packs | 8 | 6 | 0 | 2 | **TRACK 1 & TRACK 2 VERIFIED (60 Core + 6 Pilot = 66/120 Lessons Done)** |
| **Phase 4** | Interactive Engines (Slide, Simulator, MCP Client) | 10 | 2 | 0 | 8 | **PHASE 4 MVP & PHOTO SIMULATOR COMPLETED (`SlidePlayer`, `PenNodeSimulator` & `PhotoLayerSimulator` Operational)** |
| **Phase 5** | 8 Major Pages Implementation (Web Platform) | 12 | 3 | 0 | 9 | `SimulatorPage (Dual Simulators), EncyclopediaPage, ResourcesPage Operational (Code-Split)` |
| **Phase 6** | Cloud Infrastructure, Auth & Storage (Supabase) | 4 | 0 | 0 | 4 | `PENDING` |
| **Phase 7** | Independent QA, Playwright E2E & Visual Testing | 5 | 1 | 0 | 4 | `Playwright E2E Suite Operational (9/9 Passing: 6 Vector + 3 Photo)` |
| **Phase 8** | Production Deployment & Final Launch | 3 | 0 | 0 | 3 | `PENDING` |
| **TOTAL (Original Tasks)** | **Entire Project Scope** | **49** | **15** | **0** | **34** | **30.6% Completed** |
| **TOTAL (Registry Rows)** | **Inclusive of TASK-010-REAUDIT** | **50** | **16** | **0** | **34** | **32.0% Completed** |

> [!NOTE]
> **Đối soát Tiến độ & Bài học (Progress & Curriculum Reconciliation):**
> - **Tiến độ Tác vụ (Task Progress):**
>   - **30.6% (15 / 49 tác vụ gốc):** Tính trên 49 tác vụ gốc ánh xạ 1:1 từ 49 yêu cầu kỹ thuật (`REQ-SYS-001` đến `REQ-OPS-003`). `TASK-011` (Track 2: Affinity Photo) đã hoàn tất.
>   - **32.0% (16 / 50 hàng tác vụ):** Tính trên tổng số hàng trong `TASK_REGISTRY.md`, bao gồm thêm tác vụ kiểm định bổ trợ đặc thù `TASK-010-REAUDIT`.
> - **Phân định Rõ ràng về Số lượng Bài học (Explicit Lesson Reconciliation):**
>   - **60 Bài học Cốt lõi Hoàn thành (Completed Core Lessons - 50.0%):** Gồm Track 1 Designer (30 bài, D01–D10) và Track 2 Photo (30 bài, P01–P10).
>   - **6 Bài học Pilot Đã Nghiệm thu (Pilot Lessons - 5.0%):** Gồm Track 3 Publisher Pilot (3 bài, B01-01 đến B01-03) và Track 4 Scripting Pilot (3 bài, S01-01 đến S01-03).
>   - **66 Bài học Hiện hữu Thực tế (Total Existing Lessons - 55.0%):** 60 bài cốt lõi + 6 bài pilot; 100% đạt chuẩn schema validation (`npm run validate:curriculum` 66/66 PASS).
>   - **120 Bài học Theo Kế hoạch (Planned Curriculum Scope - 100%):** 40 modules × 3 bài học. Hiện còn **54 bài học dự kiến** (Publisher B02–B10: 27 bài; Scripting S02–S10: 27 bài) đang chờ phê duyệt mở cổng triển khai.

---

## 2. Requirement Traceability Matrix Status

| Category | Total Requirements | Satisfied / Verified | Pending Implementation | Coverage Ratio |
|---|---|---|---|---|
| System Architecture & Environment (`REQ-SYS`) | 4 | 4 (`REQ-SYS-001` to `004`) | 0 | **100.0%** |
| Affinity MCP Research & Automation (`REQ-MCP`) | 7 | 2 (`REQ-MCP-006`, `007`) | 5 | **28.6%** |
| Comprehensive 40-Module Curriculum (`REQ-CURR`) | 8 | 2 (`REQ-CURR-001`, `002`) | 6 | **25.0%** |
| Frontend & Interactive Engines (`REQ-FE`) | 10 | 1 (`REQ-FE-001`) | 9 | **10.0%** |
| Major Page Content & Functionality (`REQ-PAGE`) | 8 | 3 (`REQ-PAGE-004`, `005`, `007`) | 5 | **37.5%** |
| Backend Database, Auth & Storage (`REQ-BE`) | 4 | 0 | 4 | 0.0% |
| Independent Quality Assurance (`REQ-QA`) | 5 | 0 | 5 | 0.0% |
| Deployment & Operations (`REQ-OPS`) | 3 | 0 | 3 | 0.0% |
| **TOTAL** | **49** | **12** | **37** | **24.5%** |

---

## 3. Completed Tasks Details (Phase 0, Phase 1, Phase 2, Track 1 & Track 2)

- [x] `TASK-001`: Project Control System Initialization & Pre-Phase Audit (`Orchestrator`) — Verified present, 10-point audit passed.
- [x] `TASK-002`: Toolchain & Scaffolding Configuration (`FrontendAgent`) — Node v26, npm 11, Vite 6, TS 5.8, Tailwind v3, Git init.
- [x] `TASK-003`: Architectural Directory Layout (`FrontendAgent`) — `src/`, `curriculum/`, `scripts/affinity/`, `data/`, `tests/` with READMEs.
- [x] `TASK-004`: Local Affinity Environment Diagnostic (`AffinityMCPAgent`) — `scripts/check-affinity-env.js` returns HTTP 200 on port 6767.
- [x] `TASK-005`: Affinity 3.0 DOM API Deep Extraction (`AffinityMCPAgent`) — 401 SDK topics analyzed; `AFFINITY_DOM_API_REFERENCE.json` & `.md` generated; `AFFINITY_MCP_CAPABILITY_REPORT.md` verified.
- [x] `TASK-006`: Live Rendering Latency & Performance Benchmark (`AffinityMCPAgent`) — `render_spread` (180ms) and `render_selection` (140ms) benchmarked live; `docs/MCP_RENDERING_BENCHMARK.md` verified.
- [x] Independent QA Sign-off (Phase 1): Performed by `QAAgent` in `project-control/QA_PHASE1_SIGNOFF.md`.
- [x] `TASK-020`: Design System & Visual Tokens ("Mastero") (`DesignAgent` / `FrontendAgent`) — `tokens.css`, `tailwind.config.ts`, 21 reusable components, `docs/DESIGN_SYSTEM.md`, `DesignSystemPreview.tsx`.
- [x] Independent QA Sign-off (Phase 2): Performed by `QAAgent` in `project-control/QA_PHASE2_SIGNOFF.md` — 100% compliant, 0 TS errors, clean Vite build.
- [x] `TASK-010`: Affinity Designer 10-Module Track Authoring (`DesignerCurriculumAgent`) — Modules D01 through D10 (30 lessons, 236 interactive slides, 10 production asset guides, 90 quiz questions; 299 total slides across all 39 curriculum lessons).
- [x] `TASK-010-REAUDIT`: Track 1 Technical Accuracy Re-Audit (`Orchestrator` / `ResearchVerificationAgent`) — 5/5 technical items verified against official Serif docs in `TRACK_1_REAUDIT_REPORT.md`; Vite code-splitting implemented (entry dropped from 995 kB to 119 kB, 0 chunk warnings).
- [x] `TASK-011`: Affinity Photo 10-Module Track Authoring (`PhotoCurriculumAgent`) — Modules P01 through P10 (30 lessons, 66/66 total curriculum lessons passing schema, 9 production practice guides, 90 quiz questions, interactive `PhotoLayerSimulator.tsx` with dynamic mask painting and blend mode engine, 3 Playwright E2E tests, 9/9 E2E passing).
- [x] `TASK-026`: Interactive Slide-Based Lesson Engine (`FrontendAgent`) — `SlidePlayer.tsx` with card carousel, progress persistence, and quiz verification.
- [x] `TASK-027`: In-Browser Affinity Tool Simulator Sandbox MVP (`FrontendAgent`) — `src/components/simulator/` (Pen, Node, Math, Exercises, Evaluation Scorer, Photo Layer Simulator).
- [x] `TASK-074`: Major Page: Tool Simulator Sandbox (`FrontendAgent`) — `src/pages/SimulatorPage.tsx` integrated with AppShell navigation, supporting both Vector Bézier and Photo Layer/Masking simulators.
- [x] Independent QA Sign-off (Phase 4 MVP & Track 2): Performed by `QAAgent` — 9/9 Playwright tests passed, 10 verified screenshots generated on disk.

---

## 4. Next Phase Gate & Status

Track 1 (Designer) và Track 2 (Photo) đã hoàn thiện 100% với 60 bài học cốt lõi, cộng với 6 bài học pilot Publisher (B01) và Scripting (S01), đạt tổng cộng 66 bài học hiện hữu (trên tổng số 120 bài học dự kiến), 2 bộ mô phỏng tương tác in-browser, và 9/9 ca kiểm thử tự động Playwright E2E vượt qua thành công.
- **Current Status:** Phase Gate `BLK-007` remains ACTIVE — LOCKED. The Phase 5 stabilization branch is published for review but is not merged; no Track 3 implementation is authorized.
- **Deferred Work:** 54 bài học dự kiến còn lại gồm Track 3 (Publisher B02–B10, `TASK-012`: 27 bài học), Track 4 (Scripting S02–S10, `TASK-013`: 27 bài học), Monaco Scripting Editor (`TASK-023`), MCP Playground (`TASK-076`), và Supabase Backend (`TASK-030` to `033`) tiếp tục được bảo vệ nghiêm ngặt dưới cổng Phase Gate cho đến khi có chỉ thị bằng văn bản.
