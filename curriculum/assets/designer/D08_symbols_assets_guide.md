# D08 Practice Guide: Symbols, Linked Assets & Component Systems

**Track:** Affinity Designer Mastery  
**Module:** D08 — Symbols, Linked Assets & Component Systems  
**Asset Status:** `GUIDE_DOCUMENT` (Official Step-by-Step Production Guide)  
**Target Application:** Serif Affinity Designer 3.3.3 (Desktop — Windows & macOS)

---

## 1. Project Overview & Design System Objectives

In this hands-on project, you will architect a scalable, production-grade **Vector UI Component System** for a high-density analytics dashboard. You will master Affinity Designer's **Symbols Studio**, the critical **Sync Toggle (Synchronize ON/OFF)** mechanism for local overrides, and the **Assets Studio** for exporting and importing `.afassets` library bundles.

---

## 2. Symbols Studio Architecture & Core Concepts

1. **Open Symbols Studio**:
   - Menu: `View > Studio > Symbols` (or click the orange interlocking diamonds icon in the right dock).
2. **Creating a Master Symbol**:
   - Select any vector object or group on the canvas.
   - In the Symbols Studio panel, click **Create**.
   - The selected layer in the Layers Studio is marked with an orange vertical bar and labeled `Symbol`.
   - The symbol is added to the Symbols Studio palette for drag-and-drop instantiation.
3. **The Synchronization Engine (The 'Sync' Button)**:
   - **Sync ON (Orange active state)**: Global edit mode. Altering geometry, fill colors, stroke profiles, corner radii, or text in any single instance immediately propagates across all linked instances in the document.
   - **Sync OFF (Unlit / Inactive state)**: Local override mode. You can change text content (e.g. Button label "Submit" vs "Cancel") or tint individual colors without affecting sister instances.
   - **Re-engaging Sync**: Turning Sync back ON locks the relationship again; subsequent structural edits (such as adding an icon badge inside the symbol) will synchronize across all instances while preserving the local text overrides!

---

## 3. Assets Studio Management & `.afassets` Libraries

1. **Open Assets Studio**:
   - Menu: `View > Studio > Assets`.
2. **Organizing Categories & Subcategories**:
   - Click the panel burger menu (`≡`) -> `Create New Category` (e.g. "Affinity Enterprise UI").
   - Click `≡` -> `Create New Subcategory` (e.g. "Buttons", "Badges", "Form Inputs").
   - Rename categories and subcategories to establish clear design system taxonomy.
3. **Saving Assets**:
   - Select a completed component on canvas -> Click `≡` on the subcategory -> `Add from Selection`.
4. **Exporting & Sharing**:
   - Panel burger menu -> `Export Assets...` -> Generates an `.afassets` binary bundle that can be distributed to design and development teams.

---

## 4. Step-by-Step Exercise: Building the Button Component System

### Step 4.1: Constructing the Base Master Button
1. Create a rectangle (`160 × 44 px`).
2. Corner radius: `8 px` (using the Corner Tool `C` or Context Bar).
3. Fill: Primary Brand Indigo (`#4F46E5`), Stroke: None.
4. Add an icon placeholder (`16 × 16 px` vector checkmark, `#FFFFFF`) and a label using Artistic Text (`14 pt`, Medium, `#FFFFFF`, text: "Primary Action").
5. Group all layers (`Ctrl+G` / `Cmd+G`) and rename to `Component_Button_Primary`.

### Step 4.2: Converting to Symbol & Creating Instances
1. Select `Component_Button_Primary`.
2. In the Symbols Studio, click **Create**.
3. Drag 4 new instances of the button from the Symbols Studio onto the canvas (or duplicate with `Ctrl+J` / `Cmd+J`).
4. Arrange them in a horizontal navigation bar layout.

### Step 4.3: Executing Safe Local Overrides with Sync OFF
1. In the Symbols Studio, click the **Sync** button so it is **OFF** (gray/unlit).
2. Double-click the label on Instance 2 and change text to "Save Draft".
3. Double-click the label on Instance 3 and change text to "Export PDF".
4. Double-click the label on Instance 4 and change text to "Delete Record".
5. Notice that each button now has unique text content, while remaining linked symbols!

### Step 4.4: Testing Global Synchronization with Sync ON
1. In the Symbols Studio, click **Sync** back to **ON** (orange highlight).
2. Select Instance 1. Change the corner radius from `8 px` to pill shape (`22 px`).
3. Observe the magic: All 4 button instances update immediately to 22px rounded pill corners, while their custom text labels ("Save Draft", "Export PDF", "Delete Record") remain completely intact!
4. Add a subtle 1pt inner stroke (`#818CF8`) to Instance 1. All 4 buttons instantly receive the new border styling.

### Step 4.5: Archiving to Assets Studio
1. Select the completed master button component.
2. In the Assets Studio, under "Buttons", choose `Add from Selection`.
3. Test dragging a fresh button from the Assets Studio into a brand new document.

---

## 5. Verification Checklist & Acceptance Criteria

- [ ] Symbols Studio and Assets Studio docked and functional.
- [ ] Master symbol created with orange vertical indicator in Layers Studio.
- [ ] Safe local overrides executed with Sync OFF without breaking master linkage.
- [ ] Global styling updates propagated across all instances with Sync ON.
- [ ] Assets Studio category and subcategory organized and populated.
- [ ] Zero duplicated or orphaned curve clutter in the document structure.
