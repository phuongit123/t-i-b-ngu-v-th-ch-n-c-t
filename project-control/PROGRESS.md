# AFFINITY ACADEMY — PROGRESS DASHBOARD

## Document Control
- **Document ID:** `PROGRESS-AFFINITY-001`
- **Version:** `4.5.1` (TASK-079 merged to main; TASK-080 Round 8 evidence review in progress)
- **Status:** `ACTIVE — PHASE GATE BLK-007 LOCKED`
- **Project Phase:** `Phase 5 — Web Platform Implementation (3/12 tasks complete; 9 pending)`
- **Curriculum Status:** `60 core + 6 pilot = 66 existing / 120 planned lessons`
- **Verification boundary:** `Quality Gate #43750528338 passed on exact PR #6 head 07959b8b428f238b069b747fe6d6976bf6f37a83: ESLint, TypeScript, curriculum 66/66, validator regression 41/41, script checks 3/3, Vietnamese translation coverage 66/66, production build, and Microsoft Edge Playwright E2E 20/20 (45.3s). This verifies the web academy at that exact SHA only; it does not certify Affinity desktop feature semantics, inventory completeness, or learner A5 competence. Any later commit requires its own gate.`
- **Last Updated:** `2026-11-16`
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
| **Phase 7** | Independent QA, Playwright E2E & Visual Testing | 5 | 1 | 0 | 4 | `PR #4 Quality Gate #43730666138 passed and PR #4 merged to main; PR #6 Quality Gate #43750528338 passed on exact HEAD 07959b8b428f238b069b747fe6d6976bf6f37a83 (web academy scope only)` |
| **Phase 8** | Production Deployment & Final Launch | 3 | 0 | 0 | 3 | `PENDING` |
| **TOTAL (Original Tasks)** | **Entire Project Scope** | **49** | **14** | **2** | **33** | **28.6% Completed** |
| **TOTAL (Registry Rows)** | **Inclusive of TASK-010-REAUDIT & TASK-079–081** | **53** | **16** | **3** | **34** | **30.2% Completed** |

> [!NOTE]
> **Đối soát Tiến độ & Bài học (Progress & Curriculum Reconciliation):**
> - **Tiến độ Tác vụ (Task Progress):**
>   - **28.6% (14 / 49 tác vụ gốc):** Tính trên 49 tác vụ gốc ánh xạ 1:1 từ 49 yêu cầu kỹ thuật (`REQ-SYS-001` đến `REQ-OPS-003`). `TASK-011` (Track 2: Affinity Photo) đã hoàn tất.
>   - **30.2% (16 / 53 hàng tác vụ):** Tính trên tổng số 53 hàng hiện tại; 3 task đang IN_PROGRESS (`TASK-012`, `TASK-013`, `TASK-080`), còn `TASK-079` đã COMPLETED và merged vào main.
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
<<<<<<< HEAD
- **Governance updates:** `REQ-LEARN-001`–`003` and `TASK-079`–`081` register the work. `TASK-079` is COMPLETED after the 66/66 independent mapping review and exact-head Quality Gate evidence; `TASK-080` remains IN_PROGRESS and `TASK-081` remains PENDING. The specifications do not count as a completed inventory or capstone implementation.
=======
- **Governance updates:** `TASK-079` is COMPLETED after independent 66/66 row-by-row QA. `TASK-080` remains IN_PROGRESS pending source, version, denominator and P4 evidence review; `TASK-081` remains PENDING until both prerequisites are complete. TASK-079 sign-off is not learner mastery or capstone certification.
>>>>>>> main
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
  - `project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md`: Populated with 71 submitted rows (68 provisional in-scope: 50 P4, 17 V1, 1 U0; 3 exclusions).
  - `project-control/TASK_REGISTRY.md`: `TASK-079` is **COMPLETED**; `TASK-080` is **IN_PROGRESS** (16 completed / 3 in-progress / 34 pending across all 53 task rows).
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
- The Round 3/4 review reproduced 68 unique inventory IDs (63 native Affinity capabilities + 5 project-local MCP integrations), 16 fields per row, and 50 P4 + 17 V1 + 1 U0 = 68. This verifies inventory structure and stage arithmetic, not exhaustive product discovery.
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
- `TASK-079` is COMPLETED and merged into `main` following Project Owner approval and the independent 66/66 source-row audit.
- Governance note: `TASK-081` (Capstone Assessment Framework) strictly requires BOTH `TASK-079` AND `TASK-080` to be completed and signed off before it can begin.
- `TASK-080` remains IN_PROGRESS pending separate Help Center source validation and P4 practice audits. `TASK-081` remains PENDING.
- `BLK-007` remains ACTIVE — LOCKED; no new Publisher/Scripting lessons are authorized.

---

## 10. TASK-080 Independent Review — Round 2 (2026-11-15)

- Independent review branch: `qa/task-080-independent-evidence-audit`, based on merged TASK-080 baseline commit `d31150666787100d1c87332f7b7564eb43498025`.
- Reproduced the reclassified baseline: 68 in-scope records (63 native Affinity capabilities + 5 project-local MCP integrations), 50 P4 claims, 17 V1 candidates, 1 U0 candidate, and 3 exclusions (71 total submitted rows). The denominator remains provisional.
- Cross-checked the 50 P4 records against 52 distinct lesson JSON references. Each referenced lesson has a declared tool explanation, guided-practice checkpoints and expected outcome; the matrix practice references now point to the exact JSON sections.
- Corrected over-broad or mismatched evidence mappings: VEC-001 narrowed to D01-03; PIX-007 narrowed to P05-02; PIX-006 renamed to Layer Groups; PIX-014 additionally maps to P03-02; PIX-016 no longer claims a Lens Studio.
- Added official source URLs where located. Of the 50 P4 rows, 38 have a direct official feature-matched URL (including 3 Simplified Chinese locale pages), 9 are URL-linked but broad/compatibility-limited, 2 native Affinity rows lack a direct vendor URL, and 1 project-MCP row is supported by project-local evidence only. This is traceability progress, not P4 acceptance.
- The user confirms the installed desktop app is the latest stable release; this is accepted as target scope as of 2026-11-16 (public release identifier 3.3.3.5004). Public SDK docs identify version 3.3.1, so SDK/runtime compatibility remains unconfirmed.
- Official September 2026 desktop release notes expose candidate tools/controls not represented clearly in the original matrix. The 2 November 2026 official announcement is for Affinity for iPad and is not mixed into the desktop denominator.
- `TASK-080` remains IN_PROGRESS. `TASK-081` remains PENDING until TASK-079 and TASK-080 are completed. `BLK-007` remains ACTIVE — LOCKED.


## 11. TASK-080 Independent Evidence Audit — Round 4 (2026-11-15)

- Reclassified the inventory into 63 native Affinity capabilities and 5 project-local MCP integrations; do not mix their denominators. The combined register remains 68 records, plus 3 exclusions.
- Stage counts reconcile as 50 P4 claims, 17 V1 candidates and 1 U0 candidate. P4 claims comprise 49 native Affinity entries and one project MCP integration.
- The 50 P4 rows reference 52 distinct lesson JSON files, each with tool explanation, guided task, checkpoints, expected outcome, challenge title and challenge criteria. This remains structural evidence; operation-level semantic and target-build checks are open.
- Source traceability across P4: 38 direct official feature-matched URLs (including 3 Simplified Chinese locale pages), 9 broad/compatibility-limited URLs, 2 native claims with no direct vendor URL, and one project-local MCP evidence-only record.
- Official September 2026 release notes support the separate native Scripting Studio/Script Editor/Scripts Library record. Blend Tool, Mask Tool, Deform Tool, Wavelet/astro features and GLB 3D model placement stay in the discovery queue until the target build is verified.
- Target-version scope is now accepted as the latest stable desktop release per user confirmation; local executable metadata was not directly introspected.
- `TASK-080` remains IN_PROGRESS; `REQ-LEARN-002` is IN_PROGRESS; `TASK-081` remains PENDING; `BLK-007` remains ACTIVE — LOCKED.


---

## 12. TASK-080 Round 4 Quality Gate & Governance Reconciliation (2026-11-15)

- Exact audited commit: `58c508da9011f0a2cf89f07819d0bab90a575b18` on `qa/task-080-independent-evidence-audit`.
- Quality Gate workflow `43736054933`: **SUCCESS**. ESLint, TypeScript, curriculum validation (66/66), validator regression, script checks, production build, and Microsoft Edge Playwright (20/20) all passed.
- Evidence artifact: `affinity-academy-quality-evidence`, artifact ID `14169703842`.
- This CI result verifies the web academy at the exact commit only. It does not validate the installed Affinity build, prove semantic correctness of all 50 P4 operations, or certify denominator completeness.
- Reconciled programme-learning governance: `TASK-079` / `REQ-LEARN-001` COMPLETED based on the independent 66/66 mapping audit and its exact-head Quality Gate; `TASK-080` / `REQ-LEARN-002` remain IN_PROGRESS; `TASK-081` remains PENDING.
- Registry arithmetic: 53 rows = 16 COMPLETED / 3 IN_PROGRESS / 34 PENDING. The 49 original tasks remain 14 COMPLETED / 2 IN_PROGRESS / 33 PENDING.
- PR #6 remains Draft and unmerged. `BLK-007` remains ACTIVE — LOCKED.


## 13. TASK-080 Round 5 Source Discovery (2026-11-15)

- Located official Help Center sources for Stroke panel/pressure profile, Isometric panel/grid, and Assets panel; corrected the matrix terminology and narrowed the associated claims.
- **Historical Round 5 snapshot (superseded by Section 15):** P4 source disposition was recorded as 38 direct official feature-matched URLs, 9 broad/version-limited URLs, 2 presumed native source gaps, and 1 project-local MCP-only row.
- **Round 6 update:** official Help Center page titles/URLs were found for Artboard Tool (`VEC-002`) and Histogram panel (`PIX-012`); article-body extraction remains pending. The denominator remains provisional; latest-stable desktop version scope is accepted per user confirmation.


## 14. TASK-080 Version Scope & Current-Head Quality Gate (2026-11-16)

- **Version scope accepted:** the user confirms the installed Affinity desktop app is the latest stable release and says this is sufficient. Use latest stable desktop as of 2026-11-16; public November 2026 distribution metadata identifies version 3.3.3 / build 5004. Do not block on obtaining a local Help/About string. Local executable metadata was not directly introspected.
- **Exact PR head:** `b85956ef5830e757ae870a8843410de3a4fb14d5`.
- **Quality Gate #43738438116: SUCCESS.** ESLint, TypeScript, curriculum validation 66/66, validator regression 41 assertions/0 failures, script checks 3/3, production build, and Playwright E2E 20/20 passed.
- **Artifact:** `affinity-academy-quality-evidence`, ID `14171164280`, SHA-256 `fc44d31a9a3a63e137db032df600b45fdc8520f2891b7d5a4100fe7d54180512`.
- CI is evidence for the web academy at the exact commit only; it does not certify Affinity operation semantics, completeness of the denominator, or runtime SDK compatibility.
- PR #6 stays Draft and unmerged. TASK-080 stays IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED.


## 15. TASK-080 Artboard / Histogram Source and Practice Recheck (2026-11-16)

- Located official Help Center pages for Artboard Tool and Histogram panel. The extractor returned page title/navigation only, so exact article-body claims remain pending; record them as official URL found / body not reviewed, not as missing URLs.
- Rechecked `D01-02`: multi-artboard creation, dimensions and naming are practised; unverified preset/conversion claims were removed from `VEC-002`.
- Rechecked `P05-01`: Red-channel and R/G/B histogram reading are practised; unverified clipping alerts and color-space constraints were removed from `PIX-012`.
- P4 provenance reconciles to 38 official content-reviewed URLs + 2 official page-title/body-review-pending URLs + 9 broad/version-limited URLs + 1 project-local MCP row = 50.
- TASK-080 remains IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED.


## 16. Prior PR Head / CI Snapshot (2026-11-16)

- At the time of this snapshot, PR #6 head was `d1ed2bf...` and Quality Gate #43740066423 was in progress. That run was cancelled when a subsequent documentation synchronization advanced the branch.
- TASK-080 remains IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED. PR #6 remains Draft and unmerged.


## 17. Exact-head Quality Gate evidence (2026-11-16)

- Quality Gate **#43740202800** (run 59) passed on exact PR head `5f7cdc87a15fba0e8b0b389278c176d26be2a1a1`.
- Results: ESLint PASS; TypeScript PASS; curriculum validation **66/66**; validator regression **41 assertions / 0 failed**; scripts **3/3**; production build PASS; Edge setup PASS; Playwright E2E **20/20**.
- Artifact `affinity-academy-quality-evidence`, ID `14172242049`, SHA-256 `09e08783aeddabda4022cc4027990b01c17866ad7ab81e3a039d9b184e75d8d1`.
- This is evidence for `5f7cdc8...` only. The synchronization commit that adds this record will become a new PR head and needs a new Quality Gate; use the PR Checks tab for the current exact SHA. PR #6 remains Draft/unmerged; TASK-080 IN_PROGRESS; TASK-081 PENDING; BLK-007 ACTIVE — LOCKED.


## 18. TASK-080 Round 7 — Post-merge sync and reproducible evidence audit (2026-11-16)

- PR #4 is merged to `main` at `628f7619176fc2e85a50613654f46416975bd0cd`. PR #6 now targets `main` at that exact base commit; compare result at review time: 45 commits ahead, 0 behind, merge base equal to `628f761...`.
- Exact PR #6 head after the sync and screenshot refresh: `09bf0fdc67242c3182dcf8fd4e80e38b92d33f17`.
- Quality Gate `#43749162173` completed **SUCCESS** on that exact HEAD. ESLint, TypeScript, curriculum 66/66, validator 41/41, script checks 3/3, Vietnamese translation coverage 66/66, production build and Microsoft Edge Playwright E2E **20/20** passed (33.5s). Artifact ID: `14175825803`.
- Reproduced matrix structure: 68 unique in-scope IDs; all 16 fields are populated; stage counts are 50 P4, 17 V1 and 1 U0; 63 native Affinity capabilities + 5 project-local MCP integrations; 3 exclusions. The 68-record denominator remains provisional, not exhaustive.
- Re-fetched and parsed the 52 distinct lesson JSON files referenced by the 50 P4 rows. All 52 include tool explanation, a guided-practice task with checkpoints and expected outcome, an independent-challenge title, and a non-empty assessment-criteria array. The criteria field is not uniform: 43 use `challengeCriteria`; 9 use `successCriteria`. This confirms linked evidence structures, not every named control/action or current-build behaviour.
- Current official Help Center content reviewed in this pass confirms the Move Tool's default availability in Vector, Pixel and Layout and its documented selection/transform behaviour; the matrix deliberately retains only actions supported by mapped D01-03 practice. The current Layers panel page documents layer hierarchy, blend mode, masking, groups, live filters and adjustments. These source checks support bounded claims, not every detailed shortcut or workflow assertion.
- Official Help Center page URLs for Artboard Tool (`VEC-002`) and Histogram panel (`PIX-012`) are located, but the page bodies still return only an unsupported-browser shell/navigation in the available extraction. Keep them classified as **official page located / article body review pending**. `D01-02` supports artboard creation, sizing and naming; `P05-01` supports basic Red-channel and RGB-distribution reading. Do not add unverified preset/conversion, clipping-alert or colour-space claims.
- Five P4 records still rely on broad rather than feature-specific official product pages for exact operation details: `VEC-006` Corner Tool, `VEC-021` Symbols, `VEC-023` Constraints, `PIX-003` Selection Brush and `PIX-016` Live Lighting. Keep their P4 status provisional until exact 3.3.3 feature controls/behaviour are verified. Older Serif Help mirror pages found during research are not treated as proof of current 3.3.3 behaviour.
- `AUT-002` remains an Academy project-local MCP integration supported by repository evidence, not a vendor-native Affinity capability. Native SDK documentation is version 3.3.1; runtime compatibility with desktop 3.3.3 is not asserted.
- `TASK-080` remains **IN_PROGRESS**; `TASK-081` remains **PENDING**; `BLK-007` remains **ACTIVE — LOCKED**.
