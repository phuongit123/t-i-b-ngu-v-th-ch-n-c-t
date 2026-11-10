# AFFINITY ACADEMY — AGENT ASSIGNMENTS MATRIX

## Document Control
- **Document ID:** `AGENT-ASSIGNMENTS-001`
- **Version:** `2.0.0` (Audited Baseline)
- **Status:** `ACTIVE / AUDITED & EXPANDED`
- **Last Updated:** `2026-11-09`
- **Governing Agent:** `Orchestrator`

---

## 1. Agent Assignment Overview & Governance

This matrix establishes operational domains, assigned tasks, tool permissions, and strict handoff interfaces for all agent roles in **Affinity Academy**.

> [!IMPORTANT]
> **Independent QA Invariant:**
> Implementing agents (`FrontendAgent`, `CurriculumAgent`, `BackendAgent`, `AffinityMCPAgent`) are strictly prohibited from self-certifying their deliverables. All deliverables must be formally handed off to `QAAgent`, who runs automated verification suites before any task transitions to `COMPLETED`.

---

## 2. Detailed Role Assignments

### 2.1. Lead Orchestrator (`Orchestrator`)
- **Primary Domain:** Governance, roadmap oversight, phase transition verification, task assignments, user alignment.
- **Assigned Tasks:**
  - `TASK-001`: Project Control System Initialization & Pre-Phase Audit
  - `TASK-060`: Production Build & Netlify Deployment
  - `TASK-061`: Onboarding & Developer Documentation
  - `TASK-062`: Security & Secrets Audit
- **Allowed Tools:** Native filesystem (`write_file`, `edit_file`, `read_file`), shell execution (`run_command`), task management (`manage_task`, `schedule`).

---

### 2.2. Curriculum Specialist (`CurriculumAgent`)
- **Primary Domain:** 40-module syllabus authoring, 120 interactive slide lesson decks, tool encyclopedia dataset, challenge briefs.
- **Assigned Tasks:**
  - `TASK-010`: Affinity Designer 10-Module Track Authoring (Modules D01-D10, 30 lessons)
  - `TASK-011`: Affinity Photo 10-Module Track Authoring (Modules P01-P10, 30 lessons)
  - `TASK-012`: Affinity Publisher 10-Module Track Authoring (Modules B01-B10, 30 lessons)
  - `TASK-013`: Affinity JavaScript DOM Scripting 10-Module Track (Modules S01-S10, 30 lessons)
  - `TASK-016`: Comprehensive Tool Encyclopedia Dataset
- **Dependencies:** Strictly depends on `TASK-005` (`AFFINITY_DOM_API_REFERENCE.json` from Phase 1 MCP research).
- **Allowed Tools:** `research` subagent, `context7_context7`, local markdown writing.

---

### 2.3. Design & UI/UX Specialist (`DesignAgent`)
- **Primary Domain:** Visual tokens ("Mastero & Minimalism"), starter asset packs (`.af*`), resource library packs (palettes, brushes, templates, cheat sheets).
- **Assigned Tasks:**
  - `TASK-014`: Project Starter Asset Packs (40 Modules)
  - `TASK-017`: Curated Resource Library Content Pack
  - `TASK-020`: Design System & Visual Tokens ("Mastero & Minimalism")
- **Allowed Tools:** `figma_figma`, `canva_canva`, `image-generator`, CSS token authoring.

---

### 2.4. Frontend Web Engineer (`FrontendAgent`)
- **Primary Domain:** React 19/Vite platform, Monaco editor, slide-based lesson player, in-browser tool simulator sandbox, 8 major pages.
- **Assigned Tasks:**
  - `TASK-002`: Toolchain & Scaffolding Configuration
  - `TASK-003`: Architectural Directory Layout
  - `TASK-021`: Course Catalog & Track Browser Components
  - `TASK-022`: Interactive Multi-Pane Lesson Viewer Shell
  - `TASK-023`: Integrated Monaco Scripting Editor
  - `TASK-024`: Live Affinity Render Preview Viewport
  - `TASK-025`: Visual Diff & Overlay Comparison Tool
  - `TASK-026`: Interactive Slide-Based Lesson Engine
  - `TASK-027`: In-Browser Affinity Tool Simulator Sandbox
  - `TASK-028`: Searchable Tool Encyclopedia UI
  - `TASK-029`: Resource Library & Download Center UI
  - `TASK-033`: Progress Persistence Client & Store
  - `TASK-071` through `TASK-078`: All 8 Major Pages
- **Allowed Tools:** `run_command` (npm, vite), `context7_context7`, React/TypeScript tools.

---

### 2.5. Affinity MCP Automation Engineer (`AffinityMCPAgent`)
- **Primary Domain:** Phase 1 MCP capability extraction, Affinity 3.0 DOM API deep inspection, live rendering benchmark, MCP client bridge, challenge benchmark solutions.
- **Assigned Tasks:**
  - `TASK-004`: Local Affinity Environment Diagnostic
  - `TASK-005`: Affinity 3.0 DOM API Deep Extraction (`AFFINITY_DOM_API_REFERENCE.json`)
  - `TASK-006`: Live Rendering Latency & Performance Benchmark
  - `TASK-015`: Challenge Reference Benchmarks & Solutions
  - `TASK-040`: Affinity MCP Client Bridge & Health Check
  - `TASK-041`: Programmatic Script Execution Bridge
  - `TASK-042`: Visual Spread & Selection Render Engine
  - `TASK-043`: In-App Affinity SDK Documentation Explorer
  - `TASK-044`: Script Library Manager & Snippets Store
- **Allowed Tools:** `affinity` / `affinity_affinity` MCP (`execute_script`, `render_spread`, `render_selection`, `list_sdk_documentation`, etc.), `win11-harness`.

---

### 2.6. Backend & Cloud Engineer (`BackendAgent`)
- **Primary Domain:** Supabase schema for 40 modules and 120 lessons, authentication, RLS security policies, asset storage buckets, Netlify deployment.
- **Assigned Tasks:**
  - `TASK-030`: Supabase Relational Database Schema
  - `TASK-031`: Supabase Authentication & RLS Security
  - `TASK-032`: Supabase Storage Bucket Provisioning
- **Allowed Tools:** `supabase_mcp`, `netlify_netlify`, SQL migration authoring.

---

### 2.7. Independent QA Engineer (`QAAgent`)
- **Primary Domain:** Independent verification gatekeeping, Playwright E2E suites for all 8 major pages, visual regression testing, automated curriculum script validation, static typecheck.
- **Assigned Tasks:**
  - `TASK-050`: Playwright End-to-End Test Suite (8 Major Pages)
  - `TASK-051`: Playwright Visual Regression Suite
  - `TASK-052`: Curriculum Script Automated Runner (30 Scripting Exercises)
  - `TASK-053`: Static Analysis & Type Check Pipeline
  - `TASK-054`: Independent Verification Gatekeeping Protocol
- **Allowed Tools:** `playwright` MCP, `run_command` (playwright, vitest, tsc), PowerShell test scripts.
