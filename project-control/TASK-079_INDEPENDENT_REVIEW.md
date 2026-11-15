# TASK-079 — Independent Learning Outcome Mapping Review (Initial Pass)

## Review status

- **Document ID:** `TASK-079-REV-001`
- **Status:** `IN_PROGRESS — INITIAL REVIEW PASS`
- **Reviewed branch:** `feat/task-079-learning-outcome-mapping`
- **Submitted commit:** `210086658268914f2917a476e3d1ee9d9bd133e0`
- **Review date:** `2026-11-15`
- **Governing requirement:** `REQ-LEARN-001`
- **Phase gate:** `BLK-007 ACTIVE — LOCKED`

This report records the independent QA audit of `project-control/LEARNING_OUTCOME_MAPPING.md` (`PLO-MAP-001`). It verifies the structural integrity, evidence attribution, and curriculum coverage distribution across all 66 active lessons (60 core + 6 pilot) against the approved Programme Learning Outcomes (`PLO-01`–`PLO-11`).

---

## 1. Structural and Inventory Checks

1. **Denominator and Universe:**
   - Exactly 66 lessons audited: 30 Designer (`D01`–`D10`), 30 Photo (`P01`–`P10`), 3 Publisher pilot (`B01`), and 3 Scripting pilot (`S01`).
   - 0 duplicate lesson IDs; 0 missing lesson IDs.
   - Fully aligned with `scripts/test-vietnamese-translations.js` (`66/66 unique lesson IDs mapped`).
2. **Evidence Notation Rules:**
   - **`T` (Taught):** Foundational knowledge, concepts, and tool mechanics directly taught in the lesson.
   - **`G` (Guided practice):** Observable step-by-step guided practice with clear checkpoints.
   - **`X*` (Independent challenge opportunity):** Formative challenge prompt in the lesson. Explicitly qualified with an asterisk (`*`) to state that an in-lesson challenge is a learning opportunity, **not** certified `A5` independent competence.
3. **Scope Governance:**
   - No unapproved lessons (such as Publisher `B02`–`B10` or Scripting `S02`–`S10`) are present in the mapping. `BLK-007` remains strictly enforced.

---

## 2. Programme Outcome Distribution & Statistical Breakdown

The mapping reveals the current distribution of outcomes across the 66 active lessons:

| Outcome Code | Outcome Title | Lesson Rows Mapped | Coverage Assessment |
|---|---|---:|---|
| `PLO-01` | Tool literacy and identification | 15 / 66 | Adequate foundational coverage across intro modules (`D01`, `P01`, `B01`, `S01`). |
| `PLO-02` | Contextual tool & method selection | 26 / 66 | Well represented in vector/photo workflow modules. |
| `PLO-03` | Technical fluency & execution | 66 / 66 | 100% baseline — every lesson covers technical execution. |
| `PLO-04` | Non-destructive editing & safe revision | 29 / 66 | Strong emphasis in Photo masking, adjustment layers, and Vector compound shapes. |
| `PLO-05` | Visual communication, composition & craft | 40 / 66 | Broad coverage across design and layout lessons. |
| `PLO-06` | Typography & color theory judgement | 21 / 66 | Mapped to specialized typography and color grading lessons (`D04`, `D06`, `P05`, `P08`, `B01`). |
| `PLO-07` | **Brief & production-spec interpretation** | **4 / 66** | **CRITICAL DEFICIENCY:** Only 4 lessons explicitly teach brief dissection. |
| `PLO-08` | **Critique, diagnosis & purposeful iteration** | **15 / 66** | **CRITICAL DEFICIENCY:** Under-represented; learners are rarely asked to critique or revise based on feedback. |
| `PLO-09` | Production delivery & editable handoff | 23 / 66 | Covered in capstone, export, bleed, and slice lessons (`D10`, `P10`, `B01`). |
| `PLO-10` | Independent transfer opportunities | 55 / 66 | High formative opportunity count (`X*`), but requires formal capstone framework (`A5`). |
| `PLO-11` | Programmatic automation & MCP literacy | 3 / 66 | Correctly restricted to `S01` pilot. Deliberately excludes Photo macros to avoid conflating UI recording with API scripting. |

---

## 3. Critical Pedagogical Findings

The independent review identifies two critical curriculum realities that must govern subsequent work:

### 3.1. The "Brief Interpretation" Void (`PLO-07` — 4/66 lessons)
The existing curriculum heavily instructs learners on *how to execute* predefined technical tasks, but rarely presents learners with raw, ambiguous client briefs or production specifications that require translation into design requirements.

### 3.2. The "Critique and Iteration" Gap (`PLO-08` — 15/66 lessons)
Most lesson challenges provide a single output goal without structured stages for peer critique, rubric evaluation, visual flaw diagnosis, or documented revision loops.

### 3.3. Distinction Between `P4` and `A5`
Stage `P4` (Practised in lesson with checklist) is not stage `A5` (Independently Assessed on an unfamiliar brief with verified portfolio evidence). The high count of `PLO-10` (55 lessons) reflects in-lesson practice prompts, which cannot substitute for the track-level graduation capstones to be designed under `TASK-081`.

---

## 4. Sampling & Verification Across Domains

A representative sample of lesson JSON files was cross-checked against their mapping entries:

1. **`D01-01` (Designer Workspace Anatomy):**
   - *Claimed:* `PLO-01` T/G, `PLO-02` T/G, `PLO-03` T/G, `PLO-04` T/G, `PLO-09` X*.
   - *Verification:* PASS. Lesson teaches tri-persona switching, non-destructive layer states, and includes an export slice challenge.
2. **`D02-01` (Pen Tool Modes & Bezier Mechanics):**
   - *Claimed:* `PLO-01` T/G, `PLO-03` T/G, `PLO-05` G, `PLO-10` X*.
   - *Verification:* PASS. Teaches Pen tool modes, tangent handles, and presents a swan silhouette transfer challenge.
3. **`P01-02` (RAW Develop Workflow Architecture):**
   - *Claimed:* `PLO-01` T, `PLO-02` T/G, `PLO-03` T/G, `PLO-04` T/G.
   - *Verification:* PASS. Directly teaches 32-bit develop architecture and non-destructive output.
4. **`P04-03` (Frequency Separation & Advanced Retouching):**
   - *Claimed:* `PLO-02` T/G, `PLO-03` T/G, `PLO-04` T/G, `PLO-05` G, `PLO-10` X*.
   - *Verification:* PASS. High/low frequency separation split verified; title mapping corrected from earlier Clone Stamp misattribution.
5. **`B01-01` (Facing Pages, Margins & 3mm Bleed Standards):**
   - *Claimed:* `PLO-02` T/G, `PLO-03` T/G, `PLO-07` T/G, `PLO-09` T/G, `PLO-10` X*.
   - *Verification:* PASS. Commercial print specs and bleed tolerances directly address `PLO-07` and `PLO-09`.
6. **`S01-01` (V8 Engine, DOM Architecture & MCP Integration):**
   - *Claimed:* `PLO-03` T/G, `PLO-11` T/G.
   - *Verification:* PASS. Focuses strictly on scripting architecture and MCP localhost:6767 bridge.

---

## 5. Direct Input to TASK-081 (Capstone Framework)

Based on the deficiencies identified in Section 3, `TASK-081` (Independent Design Assessment & Graduation Capstone) must not simply be another set of tutorials. Instead, each capstone brief must:
1. Provide an ambiguous, realistic client brief to assess `PLO-07` (Brief Interpretation).
2. Mandate a structured "Evaluate & Iterate" phase assessing `PLO-08` (Self-critique and revision log).
3. Require native, editable files (`.afdesign`, `.afphoto`, `.afpub`) alongside production exports to assess `PLO-04` and `PLO-09`.
4. Establish clear, observable rubric criteria for graduating from stage `P4` to certified stage `A5`.

---

## 6. Recommendations & Disposition

1. **`TASK-079` Status:** The mapping document `PLO-MAP-001` is structurally complete, verified against all 66 lesson JSONs, and accurately reflects curriculum realities. Upon Project Owner review of PR #4, `TASK-079` is recommended for sign-off to `COMPLETED`.
2. **`TASK-080` Status:** Remains `IN_PROGRESS` (pending external Help Center source URL expansion and row-by-row P4 practice audits).
3. **`TASK-081` Status:** Remains `PENDING`. Begins immediately upon acceptance of TASK-079, using the findings of this review as its design foundation.
4. **Phase Gate:** `BLK-007` remains `ACTIVE — LOCKED`.
