# AGENTS.md — Multi-Agent System & Operational Specification

## 1. Project Context: AFFINITY ACADEMY

**Affinity Academy** is an interactive, modern educational platform and structured curriculum dedicated to mastering Serif Affinity 3.0 suite (Affinity Designer, Affinity Photo, Affinity Publisher) combined with modern programmatic graphic automation via the **Affinity JavaScript DOM Scripting API** and **Affinity MCP Server**.

The project workspace is located at `c:\affinity học`.

---

## 2. Multi-Agent Organization & Roles

To ensure separation of concerns, high engineering quality, and strict verification, the project is governed by specialized agent roles. All agents operate under the direction of the Lead Orchestrator and follow the project control protocol.

| Agent Role | Role Identifier | Primary Focus & Domain | Assigned Tools / Skills |
|------------|-----------------|-------------------------|--------------------------|
| **Lead Orchestrator** | `Orchestrator` | Overall project governance, phase transitions, task routing, status tracking, and user alignment. | Native tools (`write_file`, `edit_file`, `read_file`, `run_command`, `manage_task`, `schedule`), project-control files |
| **Curriculum Specialist** | `CurriculumAgent` | Instructional design, syllabus authoring, step-by-step tutorials, exercise design, asset briefs for Designer, Photo, Publisher, and Scripting. | `research` subagent, `context7_context7`, local file system |
| **Design & UI/UX Specialist** | `DesignAgent` | Visual design of the academy web app, design system tokens, typography, component layouts, and presentation decks. | `figma_figma`, `canva_canva`, `image-generator` |
| **Frontend Web Engineer** | `FrontendAgent` | Interactive web platform, lesson viewer, course catalog, interactive script runner UI, code editor integration, responsive layout. | React/TypeScript toolchain, Tailwind CSS, `run_command`, file system |
| **Backend & Cloud Engineer** | `BackendAgent` | Data models, student progress tracking, exercise submissions, Supabase schema, authentication, Edge Functions, storage buckets. | `supabase_mcp`, `netlify_netlify`, SQL migrations |
| **Affinity MCP Automation Engineer** | `AffinityMCPAgent` | Affinity scripting DOM API implementation, automated sample generation, visual rendering (`render_spread`, `render_selection`), script validation. | `affinity` / `affinity_affinity` MCP, `win11-harness_win11-harness` |
| **QA & Verification Engineer** | `QAAgent` | Automated end-to-end testing, visual regression testing, cross-browser validation, linting, script validation pipeline. | `playwright`, `run_command` (test suites), PowerShell test scripts |

---

## 3. Real MCP Server Inventory & Verified Capabilities

> [!IMPORTANT]
> Tools and capabilities listed below reflect the exact, inspected runtime environment. No hallucinated or fictitious tools are permitted.

### 3.1. `affinity` / `affinity_affinity` MCP Server
- **Transport / Endpoint:** Connected at `http://localhost:6767/sse` (11 upstream tools verified live).
- **Available Tools:**
  - `affinity_status`: Query live connection status and engine state.
  - `add_sdk_hint`: Record SDK operational hints and API notes.
  - `execute_script`: Run JavaScript code in the running Affinity 3.0 application DOM context.
  - `list_library_scripts`: Retrieve stored library scripts.
  - `read_library_script`: Inspect a specific library script content.
  - `save_script_to_library`: Save a reusable script snippet into the library.
  - `list_sdk_documentation`: Browse available Affinity JavaScript API documentation topics.
  - `read_sdk_documentation_topic`: Read specific API class and method documentation.
  - `search_sdk_hints`: Search stored developer and API hints.
  - `render_selection`: Render currently selected layer/object to an image file.
  - `render_spread`: Render the current active spread/page to an image file.
  - `report_sdk_issue`: Log SDK inconsistencies or bugs.
- **Constraints & Limitations:**
  - Requires Affinity application to be running with the MCP listener active on localhost:6767.
  - Scripts execute synchronously or via Promise handling within the Affinity process context.

### 3.2. `win11-harness_win11-harness` MCP Server
- **Purpose:** Host OS management, process orchestration, and safe Windows 11 system operations.
- **Available Tools:**
  - `shell_exec`: Execute shell scripts (PowerShell preferred for structured multiline scripts).
  - `fs_read`, `fs_write`, `fs_list`, `fs_ops`: Safe filesystem interactions.
  - `process_list`, `process_start`, `process_kill`: Process lifecycle management.
  - `registry_read`, `registry_write`: Windows registry inspection.
  - `clipboard`: Windows clipboard inspection and staging.
  - `service_manage`: Windows background services management.
  - `scheduled_task`: Scheduled task registration and queries.
  - `env_var`: Read and configure system/user environment variables.
  - `system_info`: Inspect CPU, memory, OS build, and environment metrics.
  - `notification`: Trigger desktop notifications.
  - `window_control`: Window enumeration, focus, and state manipulation.
  - `network_ops`: Port inspection, connectivity checks.
  - `web_search`, `web_fetch`, `web_extract`, `web_download`: Web data retrieval.
- **Safety Rules:**
  - NEVER kill system processes (`pid < 100`, `csrss`, `wininit`, `lsass`, etc.).
  - NEVER modify `HKLM:\SYSTEM\CurrentControlSet` without explicit confirmation.
  - Summarize any destructive operation before execution.

### 3.3. `figma_figma` MCP Server
- **Available Tools:** `get_screenshot`, `get_design_context`, `get_motion_context`, `get_metadata`, `get_variable_defs`, `get_figjam`, `generate_image`, `generate_diagram`, `get_code_connect_map`, `whoami`, `create_session`, `create_new_file`, `send_code_to_figma`, etc.
- **Usage:** Used by `DesignAgent` for UI component definitions, design token synchronization, and high-fidelity wireframes.

### 3.4. `playwright` MCP Server
- **Available Tools:** `browser_navigate`, `browser_click`, `browser_type`, `browser_fill_form`, `browser_select_option`, `browser_take_screenshot`, `browser_snapshot`, `browser_evaluate`, `browser_wait_for`, `browser_tabs`, `browser_close`.
- **Usage:** Used by `QAAgent` for headless E2E verification of the web learning platform and verification of visual rendering outputs.

### 3.5. `supabase_mcp` MCP Server
- **Available Tools:** `list_projects`, `get_project`, `list_tables`, `execute_sql`, `apply_migration`, `query_logs`, `list_edge_functions`, `deploy_edge_function`, `create_branch`, `list_branches`.
- **Usage:** Used by `BackendAgent` for schema migration, database queries, and Edge Function deployments.

### 3.6. `canva_canva` MCP Server
- **Available Tools:** Design management, templates, assets, export formats, brand kits.
- **Usage:** Presentation slides and promotional assets for Affinity Academy.

### 3.7. `context7_context7` MCP Server
- **Available Tools:** `resolve-library-id`, `query-docs`.
- **Usage:** Fetching official framework documentation for React, Vite, Tailwind CSS, Supabase, and TypeScript libraries.

### 3.8. `linear_linear` MCP Server
- **Available Tools:** Issues, projects, milestones, diff comments, cycles, triage.
- **Usage:** Tracking external backlog and issue syncing if configured.

### 3.9. `netlify_netlify` MCP Server
- **Available Tools:** Deployment status, build logs, site configuration, environment variables.
- **Usage:** Production and preview deployment of the web platform.

---

## 4. Subagent Capabilities & Invocation Protocol

### 4.1. Standard Subagents
1. **`self`**: Inherits parent configuration, all MCP tools, full system prompt. Used for independent subtasks that need write access and full tool availability.
2. **`research`**: Read-only sandbox without network access. Used for exploring the codebase, reading local files, and surveying documentation without risking changes.
3. **`image-generator`**: Generates or edits visual images from structured briefs and returns file paths.

### 4.2. Subagent Creation Protocol
- New specialized subagents can be created using `define_subagent` and invoked via `invoke_subagent`.
- All subagents communicate asynchronously via `send_message`.
- Orchestrator handles reactive wakeup; no polling loops are permitted.

---

## 5. Operational Governance & Communication Rules

1. **Strict Phased Execution**: No agent may proceed to implementation (Phase 1+) without explicit user approval.
2. **Truth in Documentation**: No task may be marked `COMPLETED` merely because its design or documentation was created. A task is completed only when its deliverables exist and pass acceptance criteria.
3. **Traceability**: Every code change, design asset, and lesson plan must trace back to a specific `TASK-xxx` and `REQ-xxx`.
4. **Handoff Discipline**: Every agent working session must terminate with an updated `project-control/PROGRESS.md` and `project-control/HANDOFF.md`.
5. **Language**: Technical documentation is kept in clear Markdown (English / Vietnamese where specified by user). User communication follows user language preferences (Vietnamese).
