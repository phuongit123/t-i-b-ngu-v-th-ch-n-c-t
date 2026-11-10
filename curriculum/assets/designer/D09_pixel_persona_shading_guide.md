# D09 Practice Guide: Pixel Persona Integration & Textured Vector Shading

**Track:** Affinity Designer Mastery  
**Module:** D09 — Pixel Persona Integration & Textured Vector Shading  
**Asset Status:** `GUIDE_DOCUMENT` (Official Step-by-Step Production Guide)  
**Target Application:** Serif Affinity Designer 3.3.3 (Desktop — Windows & macOS)

---

## 1. Project Overview & Hybrid Workflow Objectives

In this masterclass project, you will build a sophisticated **Retro-Futuristic Botanical Illustration** utilizing Affinity Designer's most celebrated superpower: the seamless fusion of **mathematical vector paths** with **organic, pressure-sensitive raster grain shading** via the **Pixel Persona**.

You will master child pixel clipping, brush dynamics (Flow vs Opacity), Protect Alpha locking, and resolution DPI governance for flawless commercial print reproduction.

---

## 2. Document DPI & Raster-Vector Architecture

1. **Document Setup**:
   - Menu: `File > New...`
   - Dimensions: `2400 × 3000 px` (Vertical Poster Layout).
   - Color Format: `RGB/8` or `CMYK/8` (U.S. Web Coated SWOP v2 or ISO Coated v2).
   - DPI: **300 DPI** (Crucial: While vector curves scale infinitely, raster brush strokes drawn inside Pixel Persona are baked at document DPI!).
2. **Switching to the Pixel Persona**:
   - Menu: Click the second icon in the top-left Toolbar Persona bar (Pixel Persona), or use your custom shortcut if configured in `Edit > Preferences > Keyboard Shortcuts` (Win) / `Settings > Keyboard Shortcuts` (Mac). Note: Affinity Designer does not assign default shortcuts for personas out of the box.
   - Notice the left toolbar transforms: Pen and Shape tools are replaced by Paint Brush Tool (`B`), Pixel Tool, Eraser Tool (`E`), Selection Brushes, Smudge, and Dodge/Burn tools.
   - The Brushes Studio switches from vector strokes to raster brush libraries (Acrylics, Dry Media, Gouache, Inks, Spray and Spatters, Texture).

---

## 3. The Non-Destructive Vector Clipping Architecture

1. **The Vector Shell**:
   - In the Designer Persona (first icon on the top-left toolbar), draw your foundational vector silhouette using the Pen Tool (`P`) or parametric shapes.
   - Example: A clean organic leaf or geometric sphere filled with base midtone teal (`#0F766E`).
2. **Inserting a Child Pixel Layer**:
   - On the top toolbar, click the **Insert inside the selection** button (blue target square with an inner arrow).
   - Switch to the **Pixel Persona**.
   - In the Layers Studio, click the **Add Pixel Layer** button.
   - The new pixel layer is automatically indented as a direct child inside the vector curve container.
3. **Painless Shading**:
   - Paint with a textured grain brush inside the leaf.
   - Even if your brush stroke extends 200 pixels beyond the edge of the leaf, Designer's GPU compositing clips the pixels strictly to the vector bezier outline!
   - Select the parent vector shape with the Node Tool (`A`) and edit the curve: The clipped raster texture adjusts instantaneously without pixel stretching.

---

## 4. Step-by-Step Shading Execution Guide

### Step 4.1: Brush Selection & Dynamics Setup
1. Open the Brushes Studio (Pixel Persona) -> Select **Dry Media** or **Texture**.
2. Choose a stipple or chalk brush (e.g. "Chalk Rough" or "Noise Grain").
3. In the Context Bar:
   - Width: `80 px`.
   - Opacity: `100%`.
   - **Flow: `15% - 25%`** (Critical: Low flow allows gradual, velvety build-up of grain texture with repeated stylus passes).
   - Hardness: `0%` (Soft feathered falloff).
4. Click the **More** button in the Context Bar:
   - Size Jitter: `20%` (Controller: Pressure).
   - Flow Jitter: `15%` (Controller: Pressure).

### Step 4.2: Applying Core Shadows & Ambient Occlusion
1. Select the child pixel layer inside the vector leaf.
2. Color Picker: Sample the base teal (`#0F766E`), then shift brightness down and hue toward deep navy (`#042F2E`).
3. Set the child pixel layer blend mode to **Multiply** in the Layers Studio.
4. Lightly paint along the bottom curvature and stem junction. Notice the rich, tactile stippled grain emerging.

### Step 4.3: Highlighting & Protect Alpha
1. Add a second child pixel layer above the shadow layer.
2. Set blend mode to **Screen** or **Linear Light**.
3. Color: Warm soft gold (`#FDE68A`) or vibrant mint (`#5EEAD4`).
4. Paint along the upper edge receiving light.
5. In the Context Bar, check **Protect Alpha** when you want to lock the painted pixels and recolor them without painting over empty areas.

### Step 4.4: Returning to Designer Persona for Clean Cutouts
1. Switch back to **Designer Persona** (click the blue pen icon on the top-left toolbar).
2. Add sharp vector veins over the shaded leaf using the Pen Tool (`P`) with a 2pt stroke.
3. Notice the stunning visual contrast between the razor-sharp vector lines and the soft analog grain shading underneath!

---

## 5. Verification Checklist & Acceptance Criteria

- [ ] Document configured at 300 DPI for crisp raster texture rendering.
- [ ] Switched between Designer Persona and Pixel Persona using verified shortcuts.
- [ ] Raster shading painted on a dedicated child pixel layer inside a vector parent.
- [ ] Flow set to 15%–25% for smooth, multi-pass grain accumulation.
- [ ] Moving or altering vector nodes preserves clean mathematical clipping borders.
- [ ] No raster blur or pixelation visible when viewed at 100% zoom.
