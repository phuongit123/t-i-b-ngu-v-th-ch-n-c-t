# AFFINITY ACADEMY — PHASE 5 TRACK 3 PRE-IMPLEMENTATION AUDIT
## Affinity Publisher (Track 3) Pilot Audit & Readiness Assessment

## Document Control
- **Document ID:** `AUDIT-PHASE5-TRACK3-PRE-001`
- **Release Version:** `v4.2.2`
- **Date:** `2026-11-13`
- **Authoring Agent:** `Lead Architect & QA Auditor`
- **Associated Requirement:** `REQ-CURR-003`, `REQ-FE-008`
- **Associated Task:** `TASK-012`
- **Current Status:** `AUDITED — PENDING PROJECT OWNER AUTHORIZATION (BLK-007 ACTIVE)`

---

## 1. Executive Summary

This pre-implementation audit conducts an independent, comprehensive inspection of the **Affinity Publisher (Track 3)** educational subsystem within the workspace (`C:\affinity học`) on commit `ce0990c` (branch `master`).

### Key Audit Conclusions
1. **Existing Baseline:** Track 3 currently possesses a verified pilot module (`B01`: Publication Architecture, Document Setup & Bleed) consisting of 3 lessons (`B01-01`, `B01-02`, `B01-03`) and 1 practice specification asset (`B01_magazine_spec_guide.md`).
2. **Schema Adherence:** The existing pilot module conforms 100% to the 10-part standard content model and interactive slide deck schema. All 3 pilot lessons pass `scripts/validate-curriculum.js`.
3. **Scope Gaps:** Modules `B02` through `B10` (27 lessons), practice assets for B02–B10, an interactive Publisher layout simulator, and Publisher-specific Playwright E2E tests do not yet exist.
4. **Non-Duplication Guardrail:** Existing B01 lessons introduced foundational facing-page geometry, introductory master page folios, and basic baseline grid alignment. The forthcoming modules B02–B10 must strictly build upon these concepts without redundant re-explanation.
5. **Phase Gate Enforcement:** Blocker `BLK-007` is **ACTIVE**. No implementation code, lesson files, or asset files for Track 3 have been authored in this phase.

---

## 2. Inventory Audit of Existing Publisher Pilot (B01)

### 2.1. File System Inventory
The files residing in `curriculum/publisher/B01/` and `curriculum/assets/publisher/` were inspected directly on disk:

| Path | File Type | Size | Audit Classification |
|---|---|---|---|
| `curriculum/publisher/B01/module.json` | JSON | 1,006 bytes | **VERIFIED** — Conforms to Module schema |
| `curriculum/publisher/B01/B01-01.json` | JSON | 20,253 bytes | **VERIFIED** — 10/10 sections, 7 slides, 3 quiz Qs |
| `curriculum/publisher/B01/B01-02.json` | JSON | 19,569 bytes | **VERIFIED** — 10/10 sections, 7 slides, 3 quiz Qs |
| `curriculum/publisher/B01/B01-03.json` | JSON | 19,074 bytes | **VERIFIED** — 10/10 sections, 7 slides, 3 quiz Qs |
| `curriculum/assets/publisher/B01_magazine_spec_guide.md` | Markdown | 1,529 bytes | **VERIFIED** — Genuine specification guide |

### 2.2. Pedagogical Coverage in B01
- **Lesson B01-01:** *Publication Architecture, Facing Pages, Slug & Bleed Standards*
  - Focus: Commercial press sheet signatures, folding/trimming tolerances (+/- 1mm), facing page spreads, 3mm ISO bleed margins, and asymmetrical margins with binding gutters.
  - Primary Tool: Document Setup & Bleed Engine (`File > Document Setup` / `Ctrl+Shift+P` / `Cmd+Shift+P`).
- **Lesson B01-02:** *Master Pages Foundations & Dynamic Page Numbering*
  - Focus: Introduction to Master Pages in Pages Studio, inserting dynamic page numbering (`#`), running headers, and parent-to-child inheritance basics.
  - Primary Tool: Pages Studio & `Text > Insert > Fields`.
- **Lesson B01-03:** *Baseline Grids, Flow Columns & Frame Margins*
  - Focus: Typographic vertical rhythm, Baseline Grid Manager configuration, multi-column text frame threading, overset text alerts.
  - Primary Tool: Frame Text Tool (`T`) & Baseline Grid Manager (`View > Baseline Grid Manager`).

---

## 3. Gap Analysis: Missing Publisher Subsystems (B02–B10)

To achieve full parity with Track 1 (Designer) and Track 2 (Photo), the following components must be designed and authored:

| Dimension | Current Pilot State | Target Track 3 State | Gap Description |
|---|---|---|---|
| **Modules Count** | 1 Module (`B01`) | 10 Modules (`B01` to `B10`) | 9 modules missing (`B02`–`B10`) |
| **Lessons Count** | 3 Lessons (`B01-01` to `03`) | 30 Lessons | 27 lessons missing |
| **Practice Guides** | 1 Guide (`B01_...md`) | 10 Practice Guides | 9 guides missing (`B02` to `B10`) |
| **Catalog Integration** | Module B01 registered | Modules B01–B10 registered | `src/data/curriculum/index.ts` needs B02–B10 |
| **Code Splitting** | Bundled in `curriculum-publisher` (51 kB) | Split into foundations & advanced | Needs partitioning in `vite.config.ts` |
| **In-Browser Simulator** | None (Vector & Photo exist) | Publisher Layout & Grid Simulator | Needs `PublisherLayoutSimulator.tsx` |
| **Playwright E2E** | None specific to Publisher | Dedicated Publisher E2E suite | Needs `tests/e2e/publisher-curriculum.spec.ts` |

---

## 4. Technical Constraints & Non-Duplication Rules

To maintain high instructional quality and avoid content redundancy:

1. **Rule 1 (No Re-Explaining Basic Facing Pages):** Module B02 must NOT repeat the definition of facing pages, bleed margins, or trim lines introduced in B01-01. B02 must focus immediately on complex Section Manager workflows, Roman numeral frontmatter, and master page overrides.
2. **Rule 2 (Advanced Text Threading vs Basic Threading):** B01-03 established the basic linking of text frames. B03 must focus on advanced Auto-Flow (`Shift-Click` overflow icon to auto-generate hundreds of pages), text wrap offset contours, and balance columns.
3. **Rule 3 (Authentic Practice Assets Only):** Following ADR-016, practice assets for B02–B10 must be authored as structured Markdown specification guides (`GUIDE_DOCUMENT`) with precise dimensional tables, column gutter metrics, and typographic parameters. No fictitious `.afpub` files will be fabricated.
4. **Rule 4 (Vite Code-Splitting Invariant):** 27 new lessons will add ~500 kB of raw JSON data. `vite.config.ts` must partition Track 3 into `curriculum-publisher-foundations` (B01–B05) and `curriculum-publisher-advanced` (B06–B10) to maintain all chunks well under 300 kB.

---

## 5. Audit Conclusion & Gatekeeper Verification

- **Audit Verdict:** The repository is in an ideal, fully verified state on commit `ce0990c`.
- **Phase Gate Status:** **BLK-007 IS ACTIVE**.
- **Action:** No code or lesson creation for Track 3 is authorized. The accompanying document `project-control/PHASE_5_TRACK_3_PROPOSAL.md` outlines the detailed design proposal for Project Owner approval.
