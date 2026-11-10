# D10 Practice Guide: Vector Export, Slices & Production Output

**Track:** Affinity Designer Mastery  
**Module:** D10 — Vector Export, Slices & Production Output  
**Asset Status:** `GUIDE_DOCUMENT` (Official Step-by-Step Production Guide)  
**Target Application:** Serif Affinity Designer 3.3.3 (Desktop — Windows & macOS)

---

## 1. Project Overview & Production Pipeline Objectives

In this final capstone module of the Affinity Designer Mastery Track, you will master commercial output engineering. You will transition from vector drafting into the specialized **Export Persona** (accessible via the top-left Toolbar Persona icons), automate multi-density asset generation (**1x, 2x, 3x SVG, WebP, PNG**), configure **Continuous Export** for automated background builds, optimize **SVG code structure**, and generate press-ready **PDF/X-4** documents complete with printer's marks and commercial bleed.

---

## 2. Export Persona Workspace & Slices Studio Architecture

1. **Switching to the Export Persona**:
   - Menu: Click the third icon on the top-left Toolbar Persona bar (Export Persona), or use your custom shortcut if configured in `Edit > Preferences > Keyboard Shortcuts`. Note: Affinity Designer does not assign default keyboard shortcuts for switching personas out of the box.
   - The workspace adapts: standard drawing tools are replaced by the **Slice Tool (`S`)** and **Slice Selection Tool**.
   - The right studio dock reveals two critical panels: the **Slices Studio** and the **Export Options Studio**.
2. **Types of Slices**:
   - **Document Slice**: Automatically captures the entire canvas or bleed boundary.
   - **Artboard Slices**: Automatically created for every artboard in the document.
   - **Layer-Based Slices**: Select any vector group or icon in the Layers panel (inside Export Persona) and click **Create Slice**. The slice bounding box tracks the object dynamically, even if the object is resized or moved on canvas!
   - **User Custom Slices**: Drawn manually with the Slice Tool (`S`) to crop arbitrary sub-regions.

---

## 3. Multi-Density Continuous Export Setup

1. **Configuring Scale Targets in the Slices Studio**:
   - Select a slice in the Slices Studio.
   - Click the disclosure triangle to reveal export formats.
   - Default is `1x PNG`.
   - Click the `+` button to add export tiers:
     * Tier 1: `1x` Scale, Format: `PNG`, Suffix: `@1x`.
     * Tier 2: `2x` Scale, Format: `PNG`, Suffix: `@2x` (Retina).
     * Tier 3: `3x` Scale, Format: `WebP`, Suffix: `@3x`.
     * Tier 4: `1x` Scale, Format: `SVG (for web)`.
2. **The "Continuous" Export Workflow & Triggers**:
   - At the top of the Slices Studio, check the **Continuous** checkbox.
   - **Crucial Step:** Click the **Export Slices** button once and choose an output directory (e.g. `dist/assets/icons/`). *Affinity requires this initial export to bind the destination path before background exports can function.*
   - **Trigger Conditions:** Once bound, background re-exports are triggered by:
     * Saving the document (`Ctrl+S` / `Cmd+S`).
     * Modifying layers, text, or shapes within the slice boundary on canvas.
     * Transforming slice dimensions or updating export formats in the Slices Studio.
   - *Performance note:* Use Continuous selectively on active UI components; enabling it across dozens of heavy artboards simultaneously can introduce save latency.

---

## 4. SVG Code Optimization & PDF/X Commercial Press Standards

### 4.1: Optimizing Clean SVG Code for Web & Mobile
1. Select an icon slice -> Set format to `SVG`. Click the export settings burger menu (`...`).
2. Preset: Select **SVG (for web)**.
3. Advanced Options:
   - **Use viewBox**: Checked (Crucial for responsive CSS scaling).
   - **Decimal Places**: Set to `2` (Dramatically shrinks SVG file size without visual distortion).
   - **Flatten Transforms**: Checked (Bakes scale/rotation into raw node path coordinates for cleaner DOM).
   - **Embed Fonts**: Unchecked (or Text as Curves if using bespoke un-installed display fonts).
   - **Rasterize**: Nothing (ensures zero unexpected bitmap embedding).

### 4.2: Generating Commercial Press-Ready PDF/X
1. Return to Designer Persona (click blue pen icon on the top-left toolbar).
2. Go to `File > Export...` (or `Ctrl+Alt+Shift+S` / `Cmd+Option+Shift+S`).
3. Format: Select **PDF**.
4. Preset: Select **PDF/X-4:2010** (Modern ISO standard supporting live transparency and CMYK conversion).
5. Advanced Options:
   - **Raster DPI**: `300 DPI`.
   - **Include Bleed**: Checked (Mandatory! Even if bleed is configured in Document Setup, omitting this checkbox will cause Affinity to crop the PDF strictly to the page trim line).
   - **Printer Marks**: Check `Include printer marks`, `Crop marks`, and `Registration marks`.
   - **Color Space**: CMYK (U.S. Web Coated SWOP v2 or ISO Coated v2).
   - **Embed Fonts**: All Fonts.

---

## 5. Verification Checklist & Acceptance Criteria

- [ ] Export Persona entered via top-left toolbar icon.
- [ ] Layer-based slices generated from UI component groups.
- [ ] Slices Studio configured with multi-density scales (1x, 2x, 3x) and multi-formats (PNG, WebP, SVG).
- [ ] Continuous Export verified: target directory bound and background regeneration active.
- [ ] Exported SVG inspected in code editor: contains clean `viewBox`, 2 decimal precision, and zero base64 raster blobs.
- [ ] PDF/X-4 export generated with crop marks, registration targets, and explicit 'Include bleed' confirmation.
