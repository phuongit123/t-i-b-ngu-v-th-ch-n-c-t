# AFFINITY ACADEMY — WEB APPLICATION ROUTING & 12 CORE FUNCTIONAL AREAS

## 1. Overview & Architecture

Affinity Academy implements a zero-dead-link, state-driven client-side routing architecture with deep-link support across 12 distinct functional areas divided into 4 operational groups. Every route is backed by real interactive components, complete loading, empty, and error states, keyboard navigation, and responsive layouts across mobile, tablet, and desktop viewports.

---

## 2. The 12 Functional Areas Mapping Matrix

| # | Area Name | Route Identifier | Component Implementation | Group | Primary Features & Verification Status |
|---|---|---|---|---|---|
| 1 | **Home** | `home` | `src/pages/HomePage.tsx` | Core | Hero section, 3 Studio showcases, Design Thinking 8-step cycle, course tracks overview, verified Playwright E2E. |
| 2 | **Search** | `search` / `knowledge` | `src/pages/KnowledgePage.tsx` (`tab="search"`) | Nhóm Knowledge | Real-time global search across shortcuts, cheatsheets, glossary terms, query highlight, empty state, simulated error handling. |
| 3 | **Shortcuts** | `shortcuts` / `knowledge` | `src/pages/KnowledgePage.tsx` (`tab="shortcuts"`) | Nhóm Knowledge | Studio filter (Layout, Vector, Pixel), OS modifier switch (Windows Ctrl vs macOS Cmd), verified desktop evidence tags. |
| 4 | **CheatSheet** | `cheatsheet` / `knowledge` | `src/pages/KnowledgePage.tsx` (`tab="cheatsheet"`) | Nhóm Knowledge | Boolean operations, Bézier node types, blend modes, print & digital export profiles. |
| 5 | **Glossary** | `glossary` / `knowledge` | `src/pages/KnowledgePage.tsx` (`tab="glossary"`) | Nhóm Knowledge | A-Z design thinking terms, technical concepts (Bleed, Bézier, Compound, Cusp, Develop Studio, Curves, Histogram). |
| 6 | **Sandbox** | `sandbox` / `simulator` | `src/pages/SimulatorPage.tsx` | Nhóm Practice | Freeform Vector Bézier SVG canvas & Pixel Layer stack sandbox; pure client-side math, strictly 0 untrusted code. |
| 7 | **Challenges** | `challenges` | `src/pages/ChallengesPage.tsx` | Nhóm Practice | Step-by-step guided challenges (Diamond, S-Wave, Heart, Portrait Mask), checklist, accuracy evaluator, localStorage persistence. |
| 8 | **ProgressDashboard** | `dashboard` | `src/pages/DashboardPage.tsx` | Nhóm Dashboard | Track breakdown for 66 lessons, completed lessons list, learning statistics, cloud sync status, simulated sync error handling & retry. |
| 9 | **Settings** | `settings` | `src/pages/SettingsPage.tsx` | Nhóm Dashboard | Account profile (Display Name, Career Track), OS modifier key preference, data export (JSON backup), reset progress modal. |
| 10 | **Resources** | `resources` | `src/pages/ResourcesPage.tsx` | Nhóm Existing | Bundled project assets download hub, extension badges, real-time search, category filters, empty state. |
| 11 | **Encyclopedia** | `encyclopedia` | `src/pages/EncyclopediaPage.tsx` | Nhóm Existing | Searchable 401 DOM API topics extracted from SDK, module filter, code signature viewer, empty state. |
| 12 | **Simulator** | `simulator` | `src/pages/SimulatorPage.tsx` | Nhóm Existing | Interactive Bézier Pen & Node simulator + Photo Layer stack & Masking simulator with educational disclaimer banner. |

---

## 3. Detailed Group Specifications

### 3.1. Nhóm Knowledge (Search, Shortcuts, CheatSheet, Glossary)
- **Component:** `src/pages/KnowledgePage.tsx`
- **Data Source:** `src/data/knowledge/index.ts`
- **Capabilities:**
  - Integrated search query evaluator filtering shortcuts, cheatsheets, and glossary items simultaneously.
  - Studio selector (`all`, `vector`, `pixel`, `layout`).
  - Platform toggle: Windows (`Ctrl`, `Alt`, `Shift`) vs macOS (`Cmd`, `Option`, `Shift`).
  - Empty state when search yields 0 items with clear query button.
  - Simulated network error state with retry button.
  - Jump-link to DOM API Encyclopedia (`/encyclopedia`).

### 3.2. Nhóm Practice (Sandbox, Challenges)
- **Component:** `src/pages/ChallengesPage.tsx` & `src/pages/SimulatorPage.tsx`
- **Data Source:** `src/data/challenges/index.ts`
- **Capabilities:**
  - 4 authentic challenges: *Sharp Diamond*, *Smooth S-Wave*, *Heart Silhouette*, *Portrait Mask*.
  - Step-by-step guidance with interactive checkpoints.
  - Expected outcome specification card.
  - Evaluation scorer calculating accuracy percentage against tolerance threshold.
  - Persistence: Progress automatically saved in `localStorage` (`affinity_challenges_progress`).
  - Zero untrusted code execution: No `eval()`, `new Function()`, or dynamic script injection; all calculations execute via deterministic React/SVG mathematics.

### 3.3. Nhóm Dashboard (ProgressDashboard, Settings)
- **Components:** `src/pages/DashboardPage.tsx` & `src/pages/SettingsPage.tsx`
- **Capabilities:**
  - Progress per Studio track: Vector Studio (30 lessons), Pixel Studio (30 lessons), Layout Studio (3 lessons), Automation (3 lessons) — total 66 existing lessons.
  - Completed lessons table with search and track filter.
  - Statistics cards: Completed count, Challenges count, Capstone A5 status, Learning streak.
  - Cloud Sync Status bar with simulated 503 error handling and recovery retry mechanism.
  - User Settings: Profile configuration, OS modifier switch, data export to `.json`, and progress reset modal with double confirmation.

### 3.4. Nhóm Existing (Resources, Encyclopedia, Simulator)
- **Components:** `src/pages/ResourcesPage.tsx`, `src/pages/EncyclopediaPage.tsx`, `src/pages/SimulatorPage.tsx`
- **Capabilities:**
  - Leveraging already built production-ready modules without duplicate code.
  - Seamless navigation between Practice Hub and Simulator.

---

## 4. UI/UX & Responsive Governance

1. **Dark Luxury Consistency:** All components use the Mastero design system tokens (`--color-canvas`, `--color-surface`, `--color-border-hairline`, Kanit/Inter typography, amber/cyan/emerald luxury accents).
2. **Mobile & Tablet Drawer:** `MainNavigation.tsx` includes an accessible mobile navigation drawer (`< lg`) ensuring zero hidden or dead buttons on small viewports.
3. **No Dead Buttons / No Broken Links:** All buttons trigger active callbacks, modals, downloads, or route transitions.
4. **Keyboard Accessibility:** `Ctrl+K` global palette, standard focus rings (`focus-visible:ring-1 focus-visible:ring-zinc-400`), tab indexing, and Escape key bindings.
