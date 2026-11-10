# AFFINITY DESIGNER PRACTICE GUIDE — MODULE D04
## Fill, Gradient, Stroke & Pressure Profiles Practice Guide

**Module ID:** `D04`  
**Difficulty:** Intermediate  
**Track:** Affinity Designer  
**Asset Status:** `GUIDE_DOCUMENT`  
**Target File:** Manual canvas setup in Affinity Designer 3.3.3  

---

### 1. Document Setup Instructions
1. Open Affinity Designer 3.3.3.
2. Create a new document: `Web > FHD (1920 x 1080 px)` with RGB/8 color space.
3. Check **Create Artboard** and click **Create**.

---

### 2. Practice Exercises

#### Exercise 1: Multi-Stop Gradients (Lesson D04-01)
- Draw a rectangle using the Rectangle Tool (`M`).
- Press **`G`** to activate the **Fill Tool**.
- Click and drag across the rectangle to establish a gradient line.
- In the Context Toolbar, test gradient Types:
  - **Linear:** Direct directional gradation between endpoints.
  - **Radial:** Concentric circular gradient emanating from center.
  - **Elliptical:** Oval gradient with independent X/Y focal radius axes.
  - **Conical:** 360-degree sweep gradient (ideal for metallic dials, radar sweeps, and CDs).
- Click anywhere along the on-canvas gradient line to add intermediate color stops.
- Drag the small slider tick between two color stops to skew the midpoint bias.

#### Exercise 2: Vector Pressure Profiles & Custom Dashes (Lesson D04-02)
- Select the Pen Tool (`P`) and draw an undulating S-curve.
- In the **Stroke Studio** (`View > Studio > Stroke`), set Stroke width to `24 pt`.
- Click the **Pressure** button at the bottom of the Stroke panel.
- In the Pressure graph popup:
  - Drag the left end node to `0%` (sharp tapered point).
  - Pull the center curve upward to `100%` (thick belly).
  - Drag the right end node to `0%` (sharp tail).
  - Notice the uniform 24pt stroke transform into a hand-drawn calligraphy brush stroke!
- Click **Save Profile** to store this taper preset for future paths.

#### Exercise 3: Contour Tool & Expand Stroke (Lesson D04-03)
- Select any closed vector shape or letterform.
- Press **`O`** to activate the **Contour Tool**.
- Click and drag outward from the shape's perimeter to generate a uniform offset contour.
- On the Context Toolbar, test Point types: Round, Bevel, Miter.
- Select the contoured shape, then select a path with a stroke.
- Go to **Layer > Expand Stroke**.
- Notice the outline transforms from a stroked path with a center line into a closed filled shape containing independent exterior and interior boundary nodes!
