# AFFINITY ACADEMY — BLOCKERS & RISK REGISTER

## Document Control
- **Document ID:** `BLOCKERS-AFFINITY-001`
- **Version:** `4.2.2` (Track 2 Affinity Photo & Photo Layer Simulator Certified)
- **Status:** `ACTIVE — PHASE GATE BLK-007 LOCKED`
- **Last Updated:** `2026-11-13`
- **Governing Agent:** `Orchestrator`

---

## 1. Active Blockers

| Blocker ID | Description | Severity | Impacted Tasks | Mitigation / Resolution Action | Owner | Status |
|---|---|---|---|---|---|---|
| `BLK-007` | **Phase Gate: Awaiting Authorization for Track 3 (Publisher B02–B10), Track 4 (Scripting S02–S10) & Advanced Cloud/IDE Modules**<br>With 60 completed core lessons (Track 1 Designer: 30, Track 2 Photo: 30) and 6 pilot lessons (Publisher B01: 3, Scripting S01: 3) for a total of 66 existing verified lessons, the remaining 54 planned lessons (Publisher B02–B10: 27 lessons, Scripting S02–S10: 27 lessons out of 120 planned lessons) and advanced cloud/IDE modules (Monaco Editor, Live Code Runner, Supabase auth/storage) await explicit Project Owner directive. | **High (Gatekeeper)** | Track 3 (`TASK-012`), Track 4 (`TASK-013`), Monaco Playground (`TASK-023`, `TASK-076`), Supabase (`TASK-030` to `033`) | Maintain modular stability; keep bundle lean with chunk partitioning; wait for explicit PO directive to start authoring subsequent tracks. | `Orchestrator` | **ACTIVE** |

---

## 2. Resolved Blockers

| Blocker ID | Description | Resolved Date | Resolution Summary | Resolved By |
|---|---|---|---|---|
| `BLK-006` | Phase Gate: Authorization for Phase 5 Track 2 (Affinity Photo P01–P10) & Photo Simulator | 2026-11-11 | User issued Master Execution Prompt for Phase 5 — Track 2. All 10 modules (30 lessons), 9 practice guides, Photo Layer Simulator, and Playwright tests implemented, passing all 5 verification suites (66/66 lessons, 9/9 E2E). | User & `Orchestrator` | **RESOLVED** |
| `BLK-005` | Phase Gate: Authorization for Phase 5 major pages (Encyclopedia & Resource Library) | 2026-11-11 | User reviewed and approved `V4.2.1_DEV_AUDIT_REPORT.md`. Both `EncyclopediaPage` (401 API topics) and `ResourcesPage` (local bundled asset downloads) patched with zero TS errors, code-split via `React.lazy`, and verified. | User & `Orchestrator` | **RESOLVED** |
| `BLK-000` | Gap in original requirements representation (missing 40-module structure, slide engine, simulator, encyclopedia, resource pack, 8 major pages, and MCP-first sequence) | 2026-11-09 | Performed comprehensive audit; expanded spec, requirements (49 reqs), tasks (49 original tasks, 50 task rows), and acceptance criteria in baseline v2.0.0. | `Orchestrator` | **RESOLVED** |
| `BLK-001` | Phase 1 Gateway: Awaiting User Approval to Begin Phase 1 | 2026-11-09 | User explicitly approved Phase 1 execution under 8 strict conditions. All 8 conditions satisfied and QA signed off. | User & `Orchestrator` | **RESOLVED** |
| `BLK-002` | Phase 2 Gateway: Awaiting User Approval to Begin Phase 2 | 2026-11-09 | User explicitly approved Phase 2 execution ("Mastero & Minimalism" tokens, 21 reusable components). All deliverables built, tested, and QA signed off. | User & `Orchestrator` | **RESOLVED** |
| `BLK-003` | Phase 3 Gateway: Awaiting User Approval to Begin Phase 3 | 2026-11-09 | User explicitly approved Phase 3 with mandatory 12-lesson pilot checkpoint. Pilot implemented, verified, and QA signed off. | User & `Orchestrator` | **RESOLVED** |
| `BLK-004` | Pilot Checkpoint Gate: Awaiting User Review & Track 1 Authorization | 2026-11-09 | User reviewed Pilot, ordered Track 1 Technical Re-Audit, and authorized Phase 4 MVP Simulator. Both completed and certified. | User & `Orchestrator` | **RESOLVED** |

---

## 3. Project Risks & Monitoring Register

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy | Monitoring Metric |
|---|---|---|---|---|---|
| `RSK-001` | Local Affinity MCP Server Disconnected | Medium | High | Web app includes offline/mock mode with visual guides instructing how to start Affinity and enable port 6767 listener. Diagnostic verified HTTP 200. | Health check endpoint response on `http://localhost:6767/sse` |
| `RSK-002` | Affinity DOM API Breaking Changes across versions | Low | Medium | Automated extraction script (`TASK-005`) validates live DOM classes against `AFFINITY_DOM_API_REFERENCE.json`. | Pass rate of `TASK-052` |
| `RSK-003` | Monolithic Codebase Drift | Low | Medium | Strict modular directory structure separating curriculum, UI components, simulator, and automation libraries (`TASK-003`). | Static architecture linting |
| `RSK-004` | Credential Leakage in Git | Low | Critical | Strict `.gitignore` including `.env`, `.env.local`, and automated scan before commits (`TASK-062`). | Git pre-commit audit |
| `RSK-005` | Parameter Schema Inconsistencies in MCP | Medium | Low | Historical 2026-11-09 discrepancy is documented; current server schema/runtime has not been revalidated. Inspect live schema and invoke the tool before changing client code. | Fresh schema + invocation evidence on target Windows machine |
| `RSK-006` | Windows AppLocker / WDAC Block on Native Node Addons | Low | High | Resolved by `@rollup/wasm-node` fallback in `package.json` `postinstall` hook. Production builds run cleanly without native DLLs. | `npm run build` clean exit code 0 |
| `RSK-007` | Sandboxed Desktop Write Restrictions on Practice Assets | Medium | Medium | Documented in ADR-016. Genuine `.afphoto` copied from user session; `.js` files executed via DOM; manual guides provided for `.afdesign` and `.afpub`. | Integrity verification via `scripts/validate-curriculum.js` |

| `RSK-008` | Curriculum validator structural blind spots | Medium | Medium | Phase 5 follow-up adds root-entry allow-list, exact lesson filename checks, manifest-to-module lesson ID comparison, and duplicate lesson payload detection. Local test execution remains pending in this environment. | `npm run validate:curriculum` and `npm run test:validator` on target branch |
