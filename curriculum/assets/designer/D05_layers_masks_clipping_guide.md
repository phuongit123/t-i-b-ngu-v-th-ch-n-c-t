# AFFINITY DESIGNER PRACTICE GUIDE — MODULE D05
## Layer Organization, Masks & Clipping Paths Practice Guide

**Module ID:** `D05`  
**Difficulty:** Intermediate  
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

#### Exercise 1: Hierarchy, Grouping & Color Tagging (Lesson D05-01)
- Draw multiple geometric shapes representing parts of an illustration (e.g. background, character head, eyes, mouth).
- In the **Layers Studio** (`View > Studio > Layers`):
  - Select related shapes and press **`Ctrl+G`** (Win) / **`Cmd+G`** (Mac) to group them into a folder. Double-click the folder name to rename it (e.g. `Character_Head`).
  - Right-click a group in the Layers panel and assign a **Color Tag** (e.g. Blue for Lineart, Orange for Shading, Green for Background).
  - Click the Lock icon to prevent accidental moves on background elements.

#### Exercise 2: Vector Clipping vs Vector Masking (Lesson D05-02)
- Draw a vector circle with a vibrant color fill.
- Draw a jagged zigzag lightning bolt that extends far outside the circle.
- Test **Vector Clipping (Insert Inside):**
  - In the Layers Studio, drag the zigzag layer directly **onto the text label/body** of the circle layer.
  - Notice the zigzag indents as a child under the circle, clipped strictly inside its boundary!
  - You can still move the zigzag freely with the Move Tool (`V`).
- Test **Vector Masking:**
  - Create a new rectangle. Draw a wavy path over it.
  - Drag the wavy path onto the **thumbnail icon** of the rectangle (notice the vertical drop indicator bar beside the thumbnail).
  - The wavy path acts as a vector mask: the rectangle is masked to the wavy path while retaining its own fill!

#### Exercise 3: Blend Modes & Isolation Mode (Lesson D05-03)
- Place a colored vector shape over a dark textured background.
- Change its Blend Mode in the Layers Studio dropdown from **Normal** to **Screen**, **Multiply**, **Overlay**, and **Color Dodge**.
- Click the cog/gear icon at the top right of the Layers Studio to open the **Blend Options** dialog:
  - Adjust the 'Source Layer' and 'Underlying Composition' tone curves to control which luminance levels blend smoothly into the background.
- Test **Isolation Mode:**
  - Hold **`Alt` (Windows) or `Option` (macOS)** and click on any layer thumbnail in the Layers panel.
  - The entire canvas isolates only that selected layer, hiding all other artwork so you can edit in complete distraction-free focus!
  - `Alt+Click` / `Option+Click` again to exit Isolation Mode.
