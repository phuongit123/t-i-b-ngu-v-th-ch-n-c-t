# AFFINITY DESIGNER PRACTICE GUIDE — MODULE D03
## Advanced Shape Creation & Boolean Geometry Practice Guide

**Module ID:** `D03`  
**Difficulty:** Beginner  
**Track:** Affinity Designer  
**Asset Status:** `GUIDE_DOCUMENT`  
**Target File:** Manual canvas setup in Affinity Designer 3.3.3  

---

### 1. Document Setup Instructions
1. Open Affinity Designer 3.3.3.
2. Create a new document: `Web > FHD (1920 x 1080 px)` or `Print > A4`.
3. Check **Create Artboard** and click **Create**.

---

### 2. Practice Exercises

#### Exercise 1: Parametric Shapes & Corner Tool (Lesson D03-01)
- In the left Tools Panel, expand the shape tool flyout (under `M`).
- Select the **Cog Tool**. Notice the orange on-canvas adjustment handles:
  - Adjust tooth count (e.g. 12 teeth), hole radius, notch size, and tooth curvature directly by dragging the orange dots.
- Convert parametric shape to vector curves using `Ctrl+Enter` (Win) / `Cmd+Enter` (Mac) or the **Convert to Curves** button.
- Select the **Corner Tool (`C`)**.
- Click and drag an acute vertex. Test the 4 corner types on the Context Toolbar:
  1. **Rounded:** Standard circular arc radius.
  2. **Concave:** Inward scooped radius.
  3. **Straight:** Flat chiseled chamfer.
  4. **Cutout:** Inward squared notch.

#### Exercise 2: Boolean Operations (Lesson D03-02)
- Draw an ellipse and a rectangle overlapping on the canvas.
- Select both shapes using the Move Tool (`V`).
- On the top main toolbar (Geometry section), test each Boolean button:
  - **Add:** Combines shapes into a single outline.
  - **Subtract:** Cuts top shape out of bottom shape.
  - **Intersect:** Preserves only overlapping intersection.
  - **Xor:** Preserves non-overlapping areas, punching out the intersection.
  - **Divide:** Slices both shapes into individual puzzle-piece fragments at every intersection edge.

#### Exercise 3: Non-Destructive Compound Shapes (Lesson D03-03)
- Select two overlapping vector shapes.
- Hold **`Alt` (Windows) or `Option` (macOS)** and click any Boolean button (e.g. `Alt+Click Subtract`).
- Look at the **Layers Studio**: notice a specialized **`(Compound)`** layer is created!
- Expand the Compound layer: both primitive shapes are still completely intact inside!
- Move or resize either shape; notice the subtraction recalculates live in real-time.
