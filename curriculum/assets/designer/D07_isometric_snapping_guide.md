# D07 Practice Guide: Isometric Grids, 3D Projections & Precision Snapping

**Track:** Affinity Designer Mastery  
**Module:** D07 — Isometric Grids, 3D Projections & Snapping  
**Asset Status:** `GUIDE_DOCUMENT` (Official Step-by-Step Production Guide)  
**Target Application:** Serif Affinity Designer 3.3.3 (Desktop — Windows & macOS)

---

## 1. Project Overview & Blueprint Objective

In this hands-on project, you will construct a high-precision **Isometric Modular Server Kiosk & UI Terminal** using Affinity Designer's native **Grid and Axis Manager**, the dedicated **Isometric Studio**, and advanced **Intersection Snapping Candidates**.

You will master the mathematics and workflow of parallel projection—eliminating perspective vanishing points while maintaining exact 30° true axonometric fidelity.

---

## 2. Document Setup & Isometric Grid Configuration

1. **Create New Document**:
   - Preset: **Web / FHD** (1920 × 1080 px).
   - Color Format: **RGB/8**, Color Profile: **sRGB IEC61966-2.1**.
   - Transparent Background: Checked.
2. **Open Grid and Axis Manager**:
   - Menu: `View > Grid and Axis Manager...` (Win/Mac shortcut: `Ctrl+Alt+G` / `Cmd+Option+G`).
   - Uncheck `Use automatic grid`.
   - Grid Mode: Select **Advanced**.
   - Grid Type: Select **Isometric** (or **Axonometric** with Custom Angles if creating Dimetric/Trimetric art).
   - Angle: Standard isometric uses **30°** elevation (`X = 30°`, `Y = 150°`, `Z = 90°`).
   - Spacing: Set uniform division to `64 px` with `4 subdivisions` (16 px fine increments).
   - Check `Show grid` (`Ctrl+'` / `Cmd+'`) and check `Snap to grid` (`Ctrl+Alt+'` / `Cmd+Option+'`).

---

## 3. The Isometric Studio & Fit-to-Plane Workflow

1. **Activate Isometric Studio**:
   - Menu: `View > Studio > Isometric` (or click the Isometric Studio icon in the right dock).
2. **Understanding the Projection Planes**:
   - **Front Plane** (Left-facing vertical plane, aligned along the 150° axis).
   - **Side Plane** (Right-facing vertical plane, aligned along the 30° axis).
   - **Top Plane** (Horizontal ground/roof plane, aligned between 30° and 150° axes).
3. **The Two Core Modes**:
   - **Fit to Plane**: Select any 2D flat artwork (rectangle, icon, text) -> Click `Fit to Plane` with `Top`, `Side`, or `Front` selected. Designer applies an affine skew and rotation transform non-destructively to project the flat art into the chosen isometric plane.
   - **Edit in Plane**: When enabled, any new shape or node drawn with the Pen Tool (`P`) or Rectangle Tool (`M`) is constrained and projected dynamically into the active plane in real-time.

---

## 4. Step-by-Step Terminal Kiosk Assembly

### Step 4.1: Constructing the Isometric Base Pedestal
1. Set Active Plane to **Top** in the Isometric Studio. Enable `Edit in Plane`.
2. Draw a square base (`256 × 256 px`). Fill with Dark Gunmetal (`#1A1D24`), Stroke: None.
3. Switch Active Plane to **Front**. Draw the front left face (`256 × 400 px`). Fill with `#252A34`.
4. Switch Active Plane to **Side**. Draw the right face (`256 × 400 px`). Fill with `#2E3440`.
5. Observe how light naturally hits the Top (`#3B4252` highlight), Side (`#2E3440` midtone), and Front (`#252A34` core shadow).

### Step 4.2: Projecting Flat UI Screen & Decals
1. On a blank area of the canvas, switch `Edit in Plane` **OFF**.
2. Create a 2D flat terminal screen layout:
   - A rectangle (`180 × 240 px`) with `#0F172A` background and `#00D2FF` neon border (1.5 pt).
   - Add sample telemetry text ("SYSTEM ONLINE", "CORE TEMP: 34°C") using Artistic Text (`T`).
   - Group the flat UI elements (`Ctrl+G` / `Cmd+G`).
3. Select the UI Group. In the Isometric Studio:
   - Select **Side** Plane.
   - Click **Fit to Plane**.
4. The flat group snaps instantly into true isometric projection. Move the projected group onto the right face of the pedestal.

### Step 4.3: Precision Snapping Candidates Configuration
1. Open Snapping Manager: Click the magnet icon on the main toolbar or `View > Snapping Manager...`.
2. Ensure `Show snapping candidates` is checked.
3. Set Candidates mode to `Candidate list (maximum 6)`. Hover your cursor over key vertices of the pedestal to activate them as magenta snapping candidates.
4. Enable `Snap to grid` and `Snap to object geometry`.
5. Using the Pen Tool (`P`), draw cable conduits between the server nodes. The cursor will display crosshairs indicating exact vertex-to-vertex geometric lock.

---

## 5. Verification Checklist & Acceptance Criteria

- [ ] Grid and Axis Manager configured with Isometric mode (30° elevation).
- [ ] Base pedestal constructed with coherent 3-value shading (Top highlight, Side midtone, Front shadow).
- [ ] 2D flat vector artwork successfully projected into an isometric plane using `Fit to Plane`.
- [ ] No manual freehand shearing or guesswork used; all angles match exact 30° / 150° / 90° axes.
- [ ] Snapping candidates utilized for perfect vertex-to-vertex alignment without gaps or subpixel bleed.
