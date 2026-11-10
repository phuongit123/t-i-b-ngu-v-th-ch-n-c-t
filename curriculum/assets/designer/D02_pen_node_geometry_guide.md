# AFFINITY DESIGNER PRACTICE GUIDE — MODULE D02
## Vector Nodes, Paths & Pen Tool Geometry Practice Guide

**Module ID:** `D02`  
**Difficulty:** Beginner  
**Track:** Affinity Designer  
**Asset Status:** `GUIDE_DOCUMENT`  
**Target File:** Manual canvas setup in Affinity Designer 3.3.3  

---

### 1. Document Setup Instructions
1. Open Affinity Designer 3.3.3.
2. Press `Ctrl+N` (Windows) or `Cmd+N` (macOS).
3. Select **Print > A4** (or Web FHD `1920 x 1080 px`).
4. Set Units to **Pixels** or **Millimeters**.
5. Check **Create Artboard** and click **Create**.

---

### 2. Practice Exercises

#### Exercise 1: Pen Tool 4-Mode Matrix (Lesson D02-01)
- Activate Pen Tool by pressing `P`.
- On the top Context Toolbar, test the 4 Pen modes:
  1. **Standard Pen Mode:** Click to place sharp nodes, click-drag to pull symmetrical bezier control handles.
  2. **Smart Mode:** Click sequence of points. Designer automatically computes optimal curvature curves through every point without pulling handles.
  3. **Polygon Mode:** Click points to draw straight line polygons without inadvertent curve handles.
  4. **Line Mode:** Click and drag two-point constrained line segments.
- Hold `Alt` / `Option` while dragging a bezier handle to convert it into a sharp directional corner (cusp handle).

#### Exercise 2: Node Types & Node Tool Conversions (Lesson D02-02)
- Draw an organic wave curve.
- Switch to Node Tool by pressing `A`.
- Select various nodes along the path and test the 3 conversion buttons on the Context Toolbar:
  - **Sharp (Cusp):** Disconnects handles for independent angle and length.
  - **Smooth:** Forces handles to align collinearly (180 degrees) for seamless continuity.
  - **Smart:** Auto-calculates curvature based on neighboring nodes.
- Hold `Shift` while dragging a node to constrain movement along 45-degree angles.

#### Exercise 3: Join, Break & Close Geometry (Lesson D02-03)
- Draw two separate open line curves using the Pen Tool (`P`).
- Select both curves with the Move Tool (`V`) or Node Tool (`A`).
- On the Context Toolbar, click **Join Curves** to unite the closest end nodes into a single continuous path.
- Select an intermediate node and click **Break Curve** to split the path into two independent segments.
- Click **Close Curve** to bridge the start and end nodes with a final closing bezier segment.

---

### 3. Cap & Join Stroke Specifications
- Open the **Stroke Studio** (`View > Studio > Stroke`).
- Set stroke width to `6 pt`.
- Test **Cap** styles: *Butt Cap*, *Round Cap*, *Square Cap*.
- Test **Join** styles: *Miter Join* (sharp corners with adjustable miter limit), *Round Join* (soft corners), *Bevel Join* (chiseled flat corners).
