# AFFINITY ACADEMY — PROGRESS DASHBOARD

## Document Control
- **Document ID:** `PROGRESS-AFFINITY-001`
- **Version:** `4.4.6` (TASK-079 completed; TASK-080 inventory reclassified into native Affinity and project MCP scopes; source/build review remains open)
- **Status:** `ACTIVE — PHASE GATE BLK-007 LOCKED`
- **Project Phase:** `Phase 5 — Web Platform Implementation (3/12 tasks complete; 9 pending)`
- **Curriculum Status:** `60 core + 6 pilot = 66 existing / 120 planned lessons`
- **Latest CI evidence:** `Quality Gate run 43734389889 passed on exact stacked PR #5 head ed18dfd3fa7998b8378c007469cbbea164024657: ESLint, TypeScript, 66/66 curriculum, 41/41 assertions, 3/3 scripts, 66/66 translation keys, build, and 20/20 Microsoft Edge Playwright E2E (41.5s). This evidence applies to the tested head; subsequent changes require a new run.`
- **Last Updated:** `2026-11-15`
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
| **Phase 7** | Independent QA, Playwright E2E & Visual Testing | 5 | 1 | 0 | 4 | `Quality Gate #43728990588 passed on PR #4 head 2d3e3f2, including the full 20/20 Edge E2E suite` |
| **Phase 8** | Production Deployment & Final Launch | 3 | 0 | 0 | 3 | `PENDING` |
| **TOTAL (Original Tasks)** | **Entire Project Scope** | **49** | **14** | **2** | **33** | **28.6% Completed** |
| **TOTAL (Registry Rows)** | **Inclusive of TASK-010-REAUDIT & TASK-079–081** | **53** | **16** | **3** | **34** | **30.2% Completed** |

> [!NOTE]
> **Đối soát Tiến độ & Bài học (Progress & Curriculum Reconciliation):**
> - **Tiến độ Tác vụ (Task Progress):**
>   - **28.6% (14 / 49 tác vụ gốc):** Tính trên 49 tác vụ gốc ánh xạ 1:1 từ 49 yêu cầu kỹ thuật (`REQ-SYS-001` đến `REQ-OPS-003`). `TASK-011` (Track 2: Affinity Photo) đã hoàn tất.
>   - **30.2% (16 / 53 hàng tác vụ):** Tính trên tổng số 53 hàng hiện tại; 3 task đang IN_PROGRESS (`TASK-012`, `TASK-013`, `TASK-080`), còn `TASK-079` đã COMPLETED.
> - **Phân định Rõ ràng về Số lượng Bài học (Explicit Lesson Reconciliation):**
>   - **60 Bài học Cốt lõi Hoàn thành (Completed Core Lessons - 50.0%):** Gồm Track 1 Designer (30 bài, D01–D10) và Track 2 Photo (30 bài, P01–P10).
>   - **6 Bài học Pilot Đã Nghiệm thu (Pilot Lessons - 5.0%):** Gồm Track 3 Publisher Pilot (3 bài, B01-01 đến B01-03) và Track 4 Scripting Pilot (3 bài, S01-01 đến S01-03).
>   - **66 Bài học Hiện hữu Thực tế (Total Existing Lessons - 55.0%):** 60 bài cốt lõi + 6 bài pilot; 66/66 PASS was confirmed again by Quality Gate #8 on 8f6ef74; this verifies schema/content integrity, not learner competency or complete tool coverage.
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
- [x] `TASK-011`: Affinity Photo 10-Module Track Authoring (`PhotoCurriculumAgent`) — Modules P01 through P10 (30 lessons, 66/66 total curriculum lessons passing schema in historical baseline, 9 production practice guides, 90 quiz questions, interactive `PhotoLayerSimulator.tsx` with dynamic mask painting and blend mode engine, 3 Playwright E2E tests in the historical baseline; not a current-head result).
- [x] `TASK-026`: Interactive Slide-Based Lesson Engine (`FrontendAgent`) — `SlidePlayer.tsx` with card carousel, progress persistence, and quiz verification.
- [x] `TASK-027`: In-Browser Affinity Tool Simulator Sandbox MVP (`FrontendAgent`) — `src/components/simulator/` (Pen, Node, Math, Exercises, Evaluation Scorer, Photo Layer Simulator).
- [x] `TASK-074`: Major Page: Tool Simulator Sandbox (`FrontendAgent`) — `src/pages/SimulatorPage.tsx` integrated with AppShell navigation, supporting both Vector Bézier and Photo Layer/Masking simulators.
- [x] Independent QA Sign-off (Phase 4 MVP & Track 2): Performed by `QAAgent` — 9/9 Playwright tests passed in the historical baseline; later test additions require a new full-suite run.

---

## 4. Next Phase Gate & Status

Track 1 (Designer) và Track 2 (Photo) hiện có 60 bài cốt lõi; Publisher (B01) và Scripting (S01) có thêm 6 bài pilot, tổng cộng 66/120 bài theo kế hoạch. Quality Gate #8 đã xác nhận lại 66/66 bài hợp lệ và chạy thành công toàn bộ 20/20 E2E trên Microsoft Edge tại commit 8f6ef74. Kết quả này xác nhận chất lượng kỹ thuật của nhánh, không phải bằng chứng rằng người học đã đạt chuẩn tốt nghiệp.
- **Current Status:** Phase Gate `BLK-007` remains ACTIVE — LOCKED. The Phase 5 stabilization branch is published for review but is not merged; no Track 3 implementation is authorized.
- **Deferred Work:** 54 bài học dự kiến còn lại gồm Track 3 (Publisher B02–B10, `TASK-012`: 27 bài học), Track 4 (Scripting S02–S10, `TASK-013`: 27 bài học), Monaco Scripting Editor (`TASK-023`), MCP Playground (`TASK-076`), và Supabase Backend (`TASK-030` to `033`) tiếp tục được bảo vệ nghiêm ngặt dưới cổng Phase Gate cho đến khi có chỉ thị bằng văn bản.


---

## 5. Learning Outcomes & Tool Coverage Direction (2026-11-15)

- **Owner decision:** The Academy's final product outcome is independent Affinity tool competence plus transferable design thinking. Completing 120 lessons is not, by itself, proof of this outcome.
- **Specifications added:** `project-control/LEARNING_OUTCOMES.md` defines programme outcomes, a competency scale, lesson teaching contract, and graduation rubric. `project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md` defines a version-scoped inventory schema, evidence stages, and completeness rules.
- **Governance updates:** `TASK-079` is COMPLETED after independent 66/66 row-by-row QA. `TASK-080` remains IN_PROGRESS: 68 provisional records (63 native Affinity + 5 project MCP), 50 P4 labels, 17 V1 candidates, 1 U0 candidate; target-build, source and operation-level review remain open. `TASK-081` remains PENDING until both prerequisites are complete. TASK-079 sign-off is not learner mastery or capstone certification.
- **No curriculum count change:** The repository still reports 66 existing / 120 planned lessons. No new lessons have been authored by this change.
- **Verification:** This documentation-only commit does not execute application tests. Any owner-reported local test results must be tied to the exact pushed HEAD before being treated as branch verification.
- **Phase gate:** `BLK-007` remains ACTIVE — LOCKED. No Track 3 lesson authoring or Track 4 expansion is authorized by this documentation change.

---

## 6. Antigravity Workspace Customizations — 2026-11-15

- **Always-on instructions:** root `AGENTS.md` now includes the Project Owner's approved learning outcome, design-thinking cycle, current Affinity product terminology, evidence rules, task traceability, and repository/phase safety.
- **Always-on workspace rule:** `.agents/rules/affinity-academy-governance.md` uses the supported `trigger: always_on` format.
- **Six reusable workspace skills:** `academy-session-orientation`, `academy-product-implementation`, `affinity-tool-audit`, `curriculum-lesson-design`, `independent-capstone-assessment`, and `quality-gate-handoff`, each with a `SKILL.md` manifest.
- **Onboarding guide:** `project-control/ANTIGRAVITY_OPERATING_GUIDE.md` documents discovery paths, setup, first-session verification, skill invocation, branch safety, and current eligible learning work.
- **README / handoff:** linked and described how to open the repository root, verify workspace customizations, and start with `/academy-session-orientation`.
- **Verification boundary:** the documented code-bearing HEAD `baec6c5bfe8de22d9c46546dbf2216a2ba276560` passed Quality Gate workflow `43711760405` (all steps success; 66/66, 41/41, 3/3, 20/20 Edge E2E in 38.2s). Antigravity rules/skills are Markdown and frontmatter files; the remote session can verify their committed contents but cannot assert that the user's local Antigravity instance has loaded them. Verify in the Customizations panel on the user's machine.
- **Governance:** `TASK-079` is COMPLETED; `TASK-080` remains IN_PROGRESS; `TASK-081` remains PENDING until both dependencies are completed; `BLK-007` remains ACTIVE — LOCKED. Publisher B02–B10, Scripting S02–S10, and deferred cloud/IDE expansion remain blocked.

---

## 7. TASK-080 Population & Vietnamese HomePage Refinement (2026-11-15)

- **Owner Alignment & Review Requirements:**
  1. Fix the English language regression on `HomePage.tsx` with 100% natural, elegant Vietnamese copywriting aligned with the Figma Interia design and the new design-thinking pedagogical framework.
  2. Implement international standard bilingual terminology (Vietnamese interface with original English tool/studio names in brackets).
  3. Fully populate the 16 required fields for all inventory items in `AFFINITY_TOOL_COVERAGE_MATRIX.md`.
  4. Explicitly distinguish between Stage `P4` (guided practice in 66 lessons) and Stage `A5` (independent design capstone assessment).
  5. Keep `TASK-080` in `IN_PROGRESS` until peer review and acceptance on GitHub; `BLK-007` remains **ACTIVE — LOCKED**.
- **Deliverables Prepared:**
  - `src/pages/HomePage.tsx`: 100% refined with Vietnamese text, keeping Figma Interia typography and preserving all `.sr-only` accessibility tags.
  - `project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md`: Fully populated with 71 total entries (68 in-scope: 50 at stage P4, 18 gaps at stage V1; 3 legacy exclusions).
  - `project-control/TASK_REGISTRY.md`: `TASK-080` transitioned to **IN_PROGRESS** awaiting review (16 completed / 1 in-progress / 36 pending).
- **Verification Evidence:**
  - `npm run lint` & `npm run typecheck`: 0 errors, 0 warnings.
  - `npm run validate:curriculum`: 66/66 lessons valid.
  - `npm run test:validator`: 27 scenarios, 41 assertions passed.
  - `npm run test:scripts`: 3/3 scripts passed.
  - `npm run build`: Production bundle clean.
  - `npm run test:e2e`: 20/20 Playwright E2E passed on Microsoft Edge.

---

## 8. TASK-080 Independent Review — 2026-11-15

- Submitted branch `feat/task-080-affinity-tool-inventory`, commit `e65b9fd`, contains 68 inventory rows, 3 exclusions and 18 listed gap records.
- A first independent structure check reproduced 68 unique IDs, 16 columns per row, and 50 P4 + 18 V1 = 68. This verifies table integrity, not exhaustive product discovery.
- A direct lesson spot check corrected the Move Tool mapping to include `D01-03`, whose guided practice uses the Move Tool.
- Direct official URLs have been added for Move Tool, Vector Flood Fill Tool, Measure Tool release-note evidence, and Preflight.
- The September 2026 release notes exposed additional discovery candidates; they are recorded separately and are not yet included in the denominator.
- A detailed review report is available at `project-control/TASK-080_INDEPENDENT_REVIEW.md`.
- `TASK-080` remains IN_PROGRESS. The 50 P4 claims, remaining sources, exact installed build, and denominator completeness require further review. Antigravity's reported local checks are not GitHub Actions evidence for commit e65b9fd.

---

## 9. TASK-079 — Comprehensive 66-Lesson PLO Mapping & Full QA Audit (2026-11-15)

- Created `project-control/LEARNING_OUTCOME_MAPPING.md` on branch `feat/task-079-learning-outcome-mapping`.
- The mapping includes all 66 current lesson IDs exactly once and maps them to the 11 approved PLOs with evidence tags: T (taught), G (guided practice), X* (independent-challenge opportunity; not A5).
- Lesson-row counts by PLO: PLO-01 (15); PLO-02 (26); PLO-03 (66); PLO-04 (29); PLO-05 (40); PLO-06 (21); PLO-07 (4); PLO-08 (15); PLO-09 (23); PLO-10 (55); PLO-11 (3). Counts are alignment counts, not completion percentages.
- Critical deficiencies identified: severe under-representation of brief interpretation (PLO-07, 4/66) and structured critique/iteration loops (PLO-08, 15/66).
- Independent QA completed a 100% full audit across all 66 lesson JSON files, recording individual lesson titles, tool evidence, guided checkpoints, challenge criteria counts, QA dispositions (66/66 PASS), and transfer evaluation notes in `project-control/TASK-079_INDEPENDENT_REVIEW.md`.
- `TASK-079` is COMPLETED following Project Owner direction to proceed and the independent 66/66 source-row audit.
- Governance note: `TASK-081` (Capstone Assessment Framework) strictly requires BOTH `TASK-079` AND `TASK-080` to be completed and signed off before it can begin.
- `TASK-080` remains IN_PROGRESS pending separate Help Center source validation and P4 practice audits. `TASK-081` remains PENDING.
- `BLK-007` remains ACTIVE — LOCKED; no new Publisher/Scripting lessons are authorized.


---

## 11. TASK-080 Independent Inventory Audit — Round 3

- Review is carried on stacked PR branch `qa/task-080-independent-evidence-audit-stacked`, based on PR #4's TASK-079 completion branch. PR #4 must merge before this stacked PR can be merged.
- Current matrix baseline: **68 inventory records + 3 exclusions**. The 68 are split into **63 native Affinity capabilities** and **5 project-local MCP integrations**.
- Stage labels are provisional: **50 P4**, **17 V1**, **1 U0**. The 5 MCP integrations are reported separately and excluded from native desktop tool-coverage percentages.
- The 50 P4 rows reference 52 unique lesson JSON files. All 52 files were fetched and parsed; each has tool explanation, guided practice, checkpoints, expected outcome, independent challenge and criteria. This is structural evidence, not live-build proof.
- Five P4 mappings were narrowed or corrected; practice references now use exact JSON section anchors rather than synthetic `*-PRAC` IDs.
- P4 source trail: 35 official URLs without explicit caveat, 9 broad/version-limited URLs, 5 native claims without direct vendor URL, and 1 project-local MCP source.
- Added the native Scripting Studio / Script Editor / Scripts Library candidate separately from the Academy's MCP integration endpoints.
- September 2026 release candidates remain under de-duplication and target-build verification. Desktop build 3.3.3.5004 remains curriculum-declared only; the installed user build has not been inspected.
- `TASK-080` remains IN_PROGRESS; `TASK-081` remains PENDING until both TASK-079 and TASK-080 are complete; `BLK-007` remains ACTIVE — LOCKED.


### Stacked PR / CI evidence update

- Draft PR #5: https://github.com/phuongit123/t-i-b-ngu-v-th-ch-n-c-t/pull/5
- Base: `feat/task-079-learning-outcome-mapping` (PR #4); head branch: `qa/task-080-independent-evidence-audit-stacked`.
- Quality Gate #43734389889 passed on head `ed18dfd3fa7998b8378c007469cbbea164024657`: 66/66 curriculum, 41/41 validator assertions, 3/3 scripts, 66/66 translations, production build and 20/20 Edge E2E.
- PR #5 remains Draft/unmerged and stacked; merge only after PR #4 is accepted.
