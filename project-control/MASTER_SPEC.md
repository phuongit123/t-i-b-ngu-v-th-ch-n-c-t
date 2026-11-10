# AFFINITY ACADEMY — MASTER SPECIFICATION

## Document Control
- **Document ID:** `SPEC-AFFINITY-ACADEMY-001`
- **Version:** `2.0.0` (Audited Baseline)
- **Status:** `AUDITED & EXPANDED / AWAITING USER APPROVAL FOR PHASE 1`
- **Last Updated:** `2026-11-09`
- **Governing Agent:** `Orchestrator`

---

## 1. Executive Summary & Vision

**AFFINITY ACADEMY** is a premier digital learning platform, interactive curriculum, and automated design sandbox designed to educate and empower creators in mastering the **Serif Affinity 3.0 suite** (**Affinity Designer**, **Affinity Photo**, **Affinity Publisher**), along with modern **programmatic graphic automation** via the **Affinity JavaScript DOM Scripting API** and **Affinity Model Context Protocol (MCP) Server**.

Traditional design education treats graphic software as static manual tools. **Affinity Academy** bridges the gap between artistic creation and generative automation, teaching both manual design excellence (composition, color theory, typography, photo retouching, vector art, editorial layouts) and computational design (scripting shapes, parametric layouts, batch asset generation, and automated QA via MCP).

---

## 2. Core Pillars & Architecture

```
+---------------------------------------------------------------------------------------------------------+
|                                            AFFINITY ACADEMY                                             |
+---------------------------------------------------------------------------------------------------------+
| Pillar 1:            | Pillar 2:            | Pillar 3:            | Pillar 4:            | Pillar 5:   |
| 40-Module Curriculum | Interactive Slide    | In-Browser Tool      | MCP Scripting Lab &  | Comprehensive|
| 10 per App/Track     | Lessons & Guided     | Simulators (Pen,     | Live Affinity Bridge | Encyclopedia|
| Designer, Photo,     | Checkpoints          | Nodes, Curves,       | (execute_script &    | & Resource  |
| Publisher, Scripting |                      | Layers, Personas)    | render_spread)       | Library Hub |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Comprehensive 40-Module Curriculum Specification

The curriculum is rigorously structured into **4 tracks**, each containing **10 modules** (40 modules total), with **3 interactive lessons per module** (120 lessons total).

### 3.1. Track 1: Affinity Designer Mastery (10 Modules, 30 Lessons)
- **Module D01: Designer Interface, Personas & Canvas Setup** (Vector Persona vs Pixel Persona vs Export Persona, Artboards, Document Presets).
- **Module D02: Vector Nodes, Paths & Pen Tool Geometry** (Sharp, Smooth, Smart nodes, control handles, bezier curves, keyboard modifiers).
- **Module D03: Advanced Shape Creation & Boolean Geometry** (Add, Subtract, Intersect, Xor, Divide, Non-destructive Compound Shapes).
- **Module D04: Fill, Gradient, Stroke & Pressure Profiles** (Linear, Elliptical, Radial, Conical gradients, brush pressure curves, contour tool).
- **Module D05: Layer Organization, Masks & Clipping Paths** (Layer hierarchy, vector clipping, vector masking, blend modes, isolation mode).
- **Module D06: Typography, Text-on-Path & Glyph Styling** (Frame Text vs Artistic Text, path text, OpenType features, glyph browser, text styles).
- **Module D07: Isometric Grids, 3D Projections & Snapping** (Axonometric grids, isometric plane switching, fit-to-plane projection, dynamic snapping).
- **Module D08: Symbols, Linked Assets & Component Systems** (Creating symbols, detached synchronization, asset studio management, vector UI kits).
- **Module D09: Pixel Persona Integration & Textured Vector Shading** (Pixel brushes on vector masks, raster grain, textured shading, brush dynamics).
- **Module D10: Vector Export, Slices & Production Output** (Export Persona, continuous export, 1x/2x/3x asset slices, SVG optimization, PDF print prep).

### 3.2. Track 2: Affinity Photo Mastery (10 Modules, 30 Lessons)
- **Module P01: Photo Interface, RAW Develop Persona & Color Profiles** (Develop Persona, 32-bit HDR, RAW exposure/curves, white balance, chromatic aberration).
- **Module P02: Non-Destructive Workflow & Layer Hierarchy** (Pixel layers vs mask layers vs adjustment layers, non-destructive cropping, history states).
- **Module P03: Precision Selection, Quick Masks & Refine Edge** (Lasso, Selection Brush, color selection, Refine Edge algorithm for hair/fur, feathering).
- **Module P04: Live Adjustment Layers & Histogram Mastery** (Curves, Levels, HSL, Black & White, Selective Color, LUT adjustments, clipping adjustments).
- **Module P05: Retouching, Inpainting, Blemish & Clone Mastery** (Inpainting Brush, Healing Brush, Patch Tool, Clone Tool, frequency-aware touchups).
- **Module P06: Frequency Separation & High-End Skin Retouching** (High/Low frequency split, median blur, texture restoration, Dodge & Burn curves).
- **Module P07: Live Filters, Distortion, Perspective & Mesh Warping** (Live Gaussian blur, Clarity, Unsharp Mask, Perspective tool, Liquify Persona).
- **Module P08: Advanced Compositing, Lighting Match & Shadows** (Subject isolation, atmospheric perspective, match color, directional shadow casting).
- **Module P09: Tone Mapping, HDR & Multi-Exposure Fusion** (Tone Mapping Persona, exposure bracketing, focus stacking, astrophotography stacking).
- **Module P10: Batch Processing, Macros & Print/Web Export** (Macro recording, batch processing jobs, color profile conversion, CMYK prep).

### 3.3. Track 3: Affinity Publisher Mastery (10 Modules, 30 Lessons)
- **Module B01: Publication Architecture, Document Setup & Bleed** (Facing pages, slug, bleed dimensions, margin standards, master page foundations).
- **Module B02: Master Pages & Multi-Section Pagination** (Parent/Child master pages, section manager, dynamic page numbering, running headers).
- **Module B03: Baseline Grids, Flow Columns & Frame Margins** (Document baseline grid, text frame columns, vertical justification, text wrapping).
- **Module B04: Paragraph & Character Style Hierarchy** (Hierarchical styles, next styles, keep options, hyphenation, drop caps, style import).
- **Module B05: StudioLink Integration (Designer & Photo in Publisher)** (One-click persona switching, editing vector/raster directly within publication pages).
- **Module B06: Table Formatting, Data Cells & Visual Infographics** (Table Tool, cell formats, alternating row styling, inline vector tables).
- **Module B07: Image Frames, Resource Management & DPI Verification** (Picture frames, smart scaling, Resource Manager, embedded vs linked assets).
- **Module B08: Data Merge & Automated Catalog Generation** (Data Merge Layout tool, CSV/JSON source binding, automated batch variable generation).
- **Module B09: Preflight Diagnostics, Font Packaging & Spot Colors** (Live Preflight panel, overflow detection, missing font alerts, Pantone spot colors).
- **Module B10: Press-Ready PDF/X Generation & Digital Publication** (PDF/X-1a, PDF/X-4, PDF bookmarks, hyperlinks, print imposition prep).

### 3.4. Track 4: Affinity JavaScript Scripting & MCP Automation (10 Modules, 30 Lessons)
- **Module S01: Affinity JS Runtime, Environment & Hello World** (Execution context, console logging, sandbox security, environment limits).
- **Module S02: Document Object Model (DOM) Architecture & Inspection** (Active document, spreads, pages, layers, nodes tree, coordinate systems).
- **Module S03: Programmatic Shape & Vector Node Generation** (Rectangles, Ellipses, Polygons, custom curves via bezier node arrays).
- **Module S04: Layer Manipulation, Grouping & Z-Order Scripting** (Parenting, reordering, layer renaming, locking, visibility, opacity).
- **Module S05: Style, Fills, Strokes & Layer Effects via JS API** (Solid fills, gradient stops, stroke alignments, inner/outer shadow effects via code).
- **Module S06: Automated Text Creation, Typography & Style Assignment** (Creating frame text, setting font families, font sizes, leading, tracking).
- **Module S07: Batch Document Creation & Automated Asset Resizing** (Automating banner creation across multiple dimensions, multi-page creation).
- **Module S08: Affinity MCP Server Architecture & SSE Bridge Integration** (Connecting to `localhost:6767`, tool protocol, telemetry, SDK hint logging).
- **Module S09: Programmatic Rendering (`render_spread` / `render_selection`)** (Capturing spreads, layer bounds rendering, format options, visual pipelines).
- **Module S10: End-to-End Generative Art & Automated Design Pipeline** (Algorithmic geometric art, data-driven vector graphics, automated QA check).

---

## 4. Interactive Slide-Based Lesson Engine

Each lesson is presented not merely as continuous text, but as an **interactive, step-by-step slide deck**:
- **Structured Slides:**
  1. *Concept & Theory Slide:* Concise visual breakdown of the topic.
  2. *Interactive Demonstration Slide:* Animated GIF / visual breakdown of tool action.
  3. *Step-by-Step Execution Slide:* Numbered steps with keyboard shortcuts callouts.
  4. *Common Mistakes & Pro-Tips Slide:* What to avoid and workflow speedups.
  5. *Hands-on Challenge Slide:* Target exercise with downloadable starter file and verification criteria.
- **Controls & Navigation:** Left/Right arrow key navigation, progress bar indicator, slide thumbnail drawer, and step completion checklist.

---

## 5. In-Browser Interactive Affinity Tool Simulator

To allow hands-on muscle memory practice directly in the browser:
- **Simulated Pen & Node Tool:** HTML5 Canvas interactive tool replicating Affinity's Pen Tool (click to place sharp nodes, drag for bezier handles, Alt/Option for cusp node, Shift for 45° snapping).
- **Simulated Boolean Geometry:** Interactive shape overlap sandbox where users click Add, Subtract, Intersect, Xor, and Divide to see immediate compound path results.
- **Simulated Live Curves & Histogram:** Interactive curve adjustment widget with black/white/midtone control points affecting a sample image in real-time.
- **Simulated Persona Switcher:** Experience switching between Vector, Pixel, and Export personas with contextual toolbar alterations.

---

## 6. Complete Tool Encyclopedia & Resource Library Hub

### 6.1. Tool Encyclopedia & Keyboard Shortcuts Matrix
- Comprehensive dictionary of **every tool across Affinity Designer, Photo, and Publisher 3.0**.
- Searchable by tool name, keyboard shortcut, persona, or application.
- Dedicated modal/card for each tool displaying:
  * Official Tool Icon & Name
  * Shortcut Key (Windows & macOS)
  * Modifier Key table (Shift, Ctrl, Alt actions)
  * Context Toolbar options explained
  * Common use cases and video/graphic micro-demonstration.

### 6.2. Resource Library & Download Center
- Curated repository of verified assets for designers:
  * **Color Palettes:** `.afpalette` files (curated designer palettes, Pantone equivalents, dynamic gradients).
  * **Brush Packs:** `.afbrushes` (raster grain brushes, ink liners, stippling brushes).
  * **Template Packs:** `.aftemplate` (book layout templates, stationery mockups, social media grids).
  * **Vector Assets:** `.afassets` (UI iconography, isometric grids, typographic scales).
  * **Cheat Sheets:** High-resolution PDF printable shortcut matrices for Designer, Photo, and Publisher.

---

## 7. Major Pages: Detailed Content & Functionality Specifications

The platform consists of **8 major pages**, each with explicit functional boundaries:

### `PAGE-01`: Home / Landing Page
- **Hero Section:** High-aesthetic typography ("Mastero & Minimalism"), dynamic headline, call to action ("Start Learning" / "Launch Playground"), ambient animated graphic.
- **Track Overview Cards:** 4 distinct interactive cards for Designer, Photo, Publisher, and Scripting tracks.
- **Affinity MCP Live Status Pill:** Real-time indicator displaying whether local Affinity 3.0 MCP is connected on `localhost:6767`.
- **Feature Highlights:** Slide-based pedagogy, in-browser tool simulator, generative scripting lab, tool encyclopedia.

### `PAGE-02`: Course Catalog & Track Browser
- **Track Tabs / Filter Bar:** Filter by Application (Designer, Photo, Publisher, Scripting), Difficulty (Beginner, Intermediate, Advanced), or Duration.
- **Module Grid:** 40 module cards showing module number, title, lesson count (3 lessons/module), estimated time, and completion badge.
- **Learning Path Roadmap View:** Visual flowchart mapping recommended prerequisites between modules.

### `PAGE-03`: Interactive Slide-Based Lesson Player
- **Header:** Course title, module breadcrumbs, progress tracker, theme toggle.
- **Slide Stage:** Centered high-resolution slide canvas rendering markdown, diagrams, and video clips.
- **Slide Navigation Controls:** Previous/Next buttons, slide indicators, keyboard shortcuts guide.
- **Sidebar Drawer:** Collapsible lesson outline, step checklist, downloadable starter asset button (`.af*`), and challenge brief.

### `PAGE-04`: Interactive Tool Simulator Sandbox
- **Canvas Viewport:** HTML5 Canvas / SVG interactive drawing surface.
- **Toolbar:** Pen Tool, Node Tool, Shape Tools, Boolean operations bar, Curve adjustment panel.
- **Challenge Prompts:** "Trace this path with under 6 nodes", "Create a compound icon using Boolean Subtract".
- **Real-time Feedback:** Accuracy scoring, node count evaluator, and hint system.

### `PAGE-05`: Tool Encyclopedia & Shortcuts Matrix
- **Search & Filter:** Instant search input, filter by App (Designer/Photo/Publisher) and Persona (Vector, Pixel, Export, Develop, Liquify).
- **Tool Cards Grid:** Displays all tools with shortcut badges.
- **Detail View:** Deep dive into tool behavior, modifier keys (Ctrl/Cmd, Alt/Opt, Shift), and context options.

### `PAGE-06`: Live Scripting & MCP Automation Playground
- **Split Pane Layout:**
  * Left: Monaco Code Editor with syntax highlighting, Affinity DOM API autocomplete, and script library selector.
  * Right: Live Render Viewport displaying outputs from `render_spread` / `render_selection`.
- **Control Bar:** "Run in Affinity" button, "Render Spread" button, execution status/timer, error console.
- **API Reference Drawer:** Quick lookup of Affinity JS classes and methods directly alongside the code.

### `PAGE-07`: Resource Library & Asset Download Center
- **Category Tabs:** Palettes, Brushes, Templates, Vector Assets, Cheat Sheets.
- **Asset Cards:** Preview thumbnail, file format badge (`.afdesign`, `.afbrushes`, `.afpalette`, `.pdf`), file size, description, and "Download Asset" button.
- **Search & Sort:** Quick search by keyword, sort by newest or most popular.

### `PAGE-08`: Student Dashboard & Portfolio Progress
- **Student Profile Summary:** User avatar, enrolled tracks, overall completion percentage.
- **Course Progress Bars:** Granular progress for each of the 40 modules and 120 lessons.
- **Project Submissions Gallery:** Visual gallery of student challenge renders and benchmark comparisons.
- **Certificates & Badges:** Earned badges for completing modules and tracks.

---

## 8. Affinity MCP Research & Direct Application Inspection Pipeline

> [!IMPORTANT]
> **MCP Research Must Precede Curriculum Authoring & Frontend Development.**
> 
> Before writing curriculum lessons or frontend components, Phase 1 strictly requires:
> 1. Complete enumeration of available API topics via `list_sdk_documentation`.
> 2. Deep programmatic extraction of all SDK topics via `read_sdk_documentation_topic`.
> 3. Execution of test scripts on live Affinity 3.0 via `execute_script` to establish exact DOM object shapes, error payload schemas, and execution latency.
> 4. Execution of `render_spread` and `render_selection` to establish exact image resolution, render performance, and output file paths.
> 5. Compilation of `AFFINITY_DOM_API_REFERENCE.json` as the single source of truth for both the Monaco editor autocomplete and curriculum script lessons.
