# AFFINITY ACADEMY — REQUIREMENTS REGISTRY

## Document Control
- **Document ID:** `REQ-REGISTRY-001`
- **Version:** `2.0.0` (Audited Baseline)
- **Status:** `ACTIVE / AUDITED & EXPANDED`
- **Last Updated:** `2026-11-09`
- **Governing Agent:** `Orchestrator`

---

## 1. Requirement Taxonomy & Conventions

Each requirement is assigned a persistent, unique identifier following the format:
`REQ-[CATEGORY]-[NUMBER]`

Categories:
- **`REQ-SYS`**: System Architecture, Environment, Tooling & Foundations
- **`REQ-MCP`**: Affinity MCP Research, Capability Extraction & Live Automation
- **`REQ-CURR`**: Curriculum (40 Modules, 120 Lessons, Starter Assets, Solutions)
- **`REQ-FE`**: Frontend Platform, Slide Engine, Tool Simulator, Editor, Encyclopedia
- **`REQ-PAGE`**: Major Page Content & Functional Specifications (8 Core Pages)
- **`REQ-BE`**: Backend Database, Authentication, API & Storage
- **`REQ-QA`**: Quality Assurance, Independent Verification & Automated Testing
- **`REQ-OPS`**: DevOps, Deployment, CI/CD & Operations

Priority Levels:
- **P0**: Critical / Blocker — Core to system function
- **P1**: High — Essential for full feature set
- **P2**: Medium — Enhancement or secondary capability

---

## 2. System Architecture & Environment Requirements (`REQ-SYS`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-SYS-001` | Project Control System Initialization | P0 | Initialize and maintain persistent markdown-based project control files in `project-control/` and `AGENTS.md`. | Ensures deterministic, auditable multi-agent progress across sessions. | `TASK-001` | **COMPLETED** |
| `REQ-SYS-002` | Workspace Environment & Toolchain | P0 | Configure modern web application toolchain using Vite, React 19, TypeScript, and strict ESLint/Prettier configs. | Provides reproducible, type-safe development environment. | `TASK-002` | `PENDING` |
| `REQ-SYS-003` | Directory Structure Standard | P0 | Enforce clean architectural directory layout separating frontend (`src/`), curriculum (`curriculum/`), scripts (`scripts/affinity/`), and project control (`project-control/`). | Prevents architectural drift and ensures modularity. | `TASK-003` | `PENDING` |
| `REQ-SYS-004` | Affinity Local Environment Detection | P0 | Provide automated detection of local Serif Affinity 3.0 installation and MCP server status on `localhost:6767`. | Enables seamless onboarding for local interactive scripting. | `TASK-004` | `PENDING` |

---

## 3. Affinity MCP Research & Capability Extraction (`REQ-MCP`)

> [!IMPORTANT]
> Must be executed and verified before curriculum authoring and frontend implementation.

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-MCP-001` | Affinity MCP Health & Connection Bridge | P0 | Connect to local Affinity MCP server on `localhost:6767/sse` with graceful connection status indicators. | Bridges web client to desktop design software. | `TASK-040` | `PENDING` |
| `REQ-MCP-002` | Live Script Execution Pipeline | P0 | Safe execution wrapper for `execute_script` to send JavaScript payloads into running Affinity 3.0 instance and return results/errors. | Core interactive scripting feature. | `TASK-041` | `PENDING` |
| `REQ-MCP-003` | Automated Spread & Selection Rendering | P0 | Integrate `render_spread` and `render_selection` to capture generated graphics as JPEG/PNG and pipe to client preview. | Visual output verification of programmatic work. | `TASK-042` | `PENDING` |
| `REQ-MCP-004` | Affinity SDK Documentation Explorer | P1 | Interface to query `list_sdk_documentation` and `read_sdk_documentation_topic` within the academy UI. | Built-in reference for students while coding. | `TASK-043` | `PENDING` |
| `REQ-MCP-005` | Script Library & Code Snippets Store | P2 | Manage reusable code snippets via `list_library_scripts`, `read_library_script`, and `save_script_to_library`. | Curated library of utility scripts. | `TASK-044` | `PENDING` |
| `REQ-MCP-006` | Affinity 3.0 DOM API Deep Extraction | P0 | Exhaustively inspect all SDK documentation topics and live Affinity DOM classes/methods to produce `AFFINITY_DOM_API_REFERENCE.json`. | Ground truth for Monaco autocomplete and scripting curriculum. | `TASK-005` | `PENDING` |
| `REQ-MCP-007` | Live Rendering Performance & Latency Benchmark | P0 | Benchmark execution time and image payload sizes of `render_spread` and `render_selection` under varied canvas resolutions. | Ensures UI preview window does not stall during student runs. | `TASK-006` | `PENDING` |

---

## 4. Comprehensive 40-Module Curriculum Requirements (`REQ-CURR`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-CURR-001` | Affinity Designer 10-Module Track | P0 | Author 10 structured modules (D01-D10, 30 lessons) covering Personas, Pen Tool, Boolean shapes, Grids, Isometric, Symbols, and Vector Export. | Complete vector illustration curriculum. | `TASK-010` | `PENDING` |
| `REQ-CURR-002` | Affinity Photo 10-Module Track | P0 | Author 10 structured modules (P01-P10, 30 lessons) covering RAW develop, Live Adjustments, Refine Edge, Frequency Separation, Compositing, and Macros. | Complete photo editing and raster curriculum. | `TASK-011` | `PENDING` |
| `REQ-CURR-003` | Affinity Publisher 10-Module Track | P0 | Author 10 structured modules (B01-B10, 30 lessons) covering Master Pages, Baseline Grids, Styles, StudioLink, Data Merge, Preflight, and PDF/X. | Complete editorial and layout design curriculum. | `TASK-012` | `PENDING` |
| `REQ-CURR-004` | Affinity JavaScript DOM Scripting 10-Module Track | P0 | Author 10 structured modules (S01-S10, 30 lessons) covering JS DOM, shapes, layers, styling, typography, batch export, MCP bridge, and generative art. | Programmatic automation curriculum. | `TASK-013` | `PENDING` |
| `REQ-CURR-005` | Project Starter Asset Packs (40 Modules) | P1 | Curate production-ready starter templates (`.afdesign`, `.afphoto`, `.afpub`) for all 40 modules. | Hands-on practical reinforcement. | `TASK-014` | `PENDING` |
| `REQ-CURR-006` | Challenge Benchmarks & Solution Code | P1 | Target reference images and validated solution scripts for all 40 module challenge exercises. | Enables self-assessment and automated validation. | `TASK-015` | `PENDING` |
| `REQ-CURR-007` | Comprehensive Tool Encyclopedia Data | P1 | Structured database of all tools, shortcuts (Win/Mac), modifier keys, and persona associations across Designer, Photo, Publisher 3.0. | Knowledge base for tool reference. | `TASK-016` | `PENDING` |
| `REQ-CURR-008` | Curated Resource Library Content Pack | P1 | Curated repository of color palettes (`.afpalette`), brushes (`.afbrushes`), templates (`.aftemplate`), vector assets (`.afassets`), and shortcut PDFs. | Essential toolkit for creative practitioners. | `TASK-017` | `PENDING` |

---

## 5. Frontend & Interactive Learning Experience Requirements (`REQ-FE`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-FE-001` | High-Aesthetic Design System ("Mastero & Minimalism") | P0 | Establish dark/light minimalist design system with refined typography, high-contrast layouts, smooth transitions, and zero visual clutter. | Matches professional creative tool aesthetics. | `TASK-020` | `PENDING` |
| `REQ-FE-002` | Responsive Course Catalog & Track Navigation | P0 | Catalog browser displaying 4 learning tracks, 40 modules, 120 lessons, estimated time, and difficulty tags. | User discovery and course entry. | `TASK-021` | `PENDING` |
| `REQ-FE-003` | Interactive Lesson Viewer Shell | P0 | Multi-pane viewer housing the slide engine, step checklist, shortcut bar, and asset download triggers. | Core shell for student learning. | `TASK-022` | `PENDING` |
| `REQ-FE-004` | Integrated Monaco Script Editor | P1 | In-browser code editor with JavaScript syntax highlighting, autocomplete for Affinity DOM APIs, and run button. | Live coding experience inside the LMS. | `TASK-023` | `PENDING` |
| `REQ-FE-005` | Live Affinity Render Preview Window | P1 | Dynamic viewport displaying renders returned by Affinity MCP (`render_spread` or `render_selection`) with zoom/pan controls. | Real-time visual feedback for script execution. | `TASK-024` | `PENDING` |
| `REQ-FE-006` | Visual Diff Comparison Tool | P2 | Side-by-side or slider comparison overlay between student output and instructor benchmark. | Visual feedback for student self-correction. | `TASK-025` | `PENDING` |
| `REQ-FE-007` | Interactive Slide-Based Lesson Engine | P0 | Step-by-step interactive slide presentation player within lessons with card transitions, keyboard navigation, and step checkpoints. | Mandated interactive slide format. | `TASK-026` | `PENDING` |
| `REQ-FE-008` | In-Browser Affinity Tool Simulator Sandbox | P0 | Canvas-based interactive simulation of Pen Tool, Node Tool curvature, Boolean geometry, and live adjustment curves. | Practice core tool mechanics directly in browser. | `TASK-027` | `PENDING` |
| `REQ-FE-009` | Searchable Tool Encyclopedia UI | P1 | Searchable interface filtering tools by app, persona, name, or keyboard shortcut with modifier key detail modals. | Fast reference lookup for designers. | `TASK-028` | `PENDING` |
| `REQ-FE-010` | Resource Library & Download Center UI | P1 | Download portal categorized by palettes, brushes, templates, assets, and cheat sheets with preview thumbnails and file sizes. | Frictionless asset downloads. | `TASK-029` | `PENDING` |

---

## 6. Major Page Content & Functional Specifications (`REQ-PAGE`)

| Requirement ID | Page Identifier | Priority | Content & Functionality Requirements | Associated Task | Status |
|---|---|---|---|---|---|
| `REQ-PAGE-001` | `PAGE-01`: Home / Landing Page | P0 | Hero section with high-aesthetic branding, live Affinity MCP connection badge, 4 track overview cards, feature highlights, and quick-start CTA. | `TASK-071` | `PENDING` |
| `REQ-PAGE-002` | `PAGE-02`: Course Catalog & Tracks | P0 | 4-track tabbed navigation, 40-module grid with lesson counts and difficulty badges, search/filter bar, and visual prerequisite roadmap. | `TASK-072` | `PENDING` |
| `REQ-PAGE-003` | `PAGE-03`: Interactive Slide Lesson Player | P0 | Slide viewport rendering 5-step slide decks, keyboard arrow navigation, collapsible lesson drawer, step checklist, and starter file download button. | `TASK-073` | `PENDING` |
| `REQ-PAGE-004` | `PAGE-04`: Tool Simulator Sandbox | P0 | Full-screen interactive canvas with Pen Tool, Node Tool, Boolean operations bar, practice tracing prompts, node count scorer, and real-time hints. | `TASK-074` | `PENDING` |
| `REQ-PAGE-005` | `PAGE-05`: Tool Encyclopedia | P1 | Instant search input, persona filter tags, grid of tool cards with shortcut badges, and detailed modal explaining modifiers and context options. | `TASK-075` | `PENDING` |
| `REQ-PAGE-006` | `PAGE-06`: Scripting & MCP Playground | P0 | Split-pane IDE: Monaco editor with Affinity DOM autocomplete on left; live render preview with zoom/pan on right; run/render toolbar and console. | `TASK-076` | `PENDING` |
| `REQ-PAGE-007` | `PAGE-07`: Resource Library Center | P1 | Filterable asset catalog (palettes, brushes, templates, assets, cheat sheets) with file format badges, preview modal, and direct download links. | `TASK-077` | `PENDING` |
| `REQ-PAGE-008` | `PAGE-08`: Student Dashboard & Portfolio | P1 | User profile summary, progress tracker across all 40 modules and 120 lessons, challenge submission gallery, and achievement badges. | `TASK-078` | `PENDING` |

---

## 7. Backend, Auth & Storage Requirements (`REQ-BE`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-BE-001` | Supabase Database Schema | P0 | Relational schema defining `profiles`, `courses`, `modules` (40), `lessons` (120), `progress`, `submissions`, and `achievements`. | Reliable relational foundation for user learning state. | `TASK-030` | `PENDING` |
| `REQ-BE-002` | User Authentication & Authorization | P0 | Supabase Auth supporting Email/Password and OAuth, with Row Level Security (RLS) policies protecting user data. | Secure user identity and data isolation. | `TASK-031` | `PENDING` |
| `REQ-BE-003` | Asset Storage Buckets | P1 | Supabase Storage buckets for course starter files, exercise assets, reference renders, and user submissions. | High-performance delivery of binary creative assets. | `TASK-032` | `PENDING` |
| `REQ-BE-004` | Progress Tracking & Submission API | P1 | API endpoints / Supabase client queries for saving lesson completion, script submissions, and quiz/exercise results. | Synchronizes student progress across devices. | `TASK-033` | `PENDING` |

---

## 8. Quality Assurance & Independent Verification (`REQ-QA`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-QA-001` | End-to-End Test Suite (Playwright) | P0 | Automated Playwright test suite covering all 8 major pages, catalog, lesson player, editor, and tool simulator. | Ensures platform stability and zero regressions. | `TASK-050` | `PENDING` |
| `REQ-QA-002` | Visual Regression Testing | P1 | Playwright screenshot comparison tests for core pages across desktop (1080p, 4K) and mobile viewports. | Protects the "Mastero & Minimalism" visual standard. | `TASK-051` | `PENDING` |
| `REQ-QA-003` | Affinity Script Syntax & Execution Validation | P1 | Automated runner that verifies all 30 scripting lesson exercises against the live Affinity MCP engine. | Guarantees all student exercises run without error. | `TASK-052` | `PENDING` |
| `REQ-QA-004` | Linting & Static Type Check Pipeline | P0 | CI checks for TypeScript (`tsc --noEmit`), ESLint, and Prettier formatting. | Enforces clean codebase standards. | `TASK-053` | `PENDING` |
| `REQ-QA-005` | Independent Verification Gatekeeping | P0 | Mandatory independent sign-off by `QAAgent` before any task or phase can be declared complete; no self-certification by implementing agents. | Strict quality control and zero false completions. | `TASK-054` | `PENDING` |

---

## 9. Deployment & Operations Requirements (`REQ-OPS`)

| Requirement ID | Title | Priority | Description | Rationale | Associated Task | Status |
|---|---|---|---|---|---|---|
| `REQ-OPS-001` | Production Build & Netlify Deployment | P0 | Configure `netlify.toml`, build commands, SPA redirects, and automated deployment pipeline. | Reliable hosting and public availability. | `TASK-060` | `PENDING` |
| `REQ-OPS-002` | Local Development Setup Documentation | P0 | Comprehensive `README.md` and onboarding guide detailing prerequisites (Node.js, Affinity 3.0, MCP configuration). | Smooth developer onboarding. | `TASK-061` | `PENDING` |
| `REQ-OPS-003` | Environment Variables & Security Audit | P0 | Define `.env.example`, secure Supabase credentials, and enforce zero credential leaks in git. | Security hardening. | `TASK-062` | `PENDING` |
