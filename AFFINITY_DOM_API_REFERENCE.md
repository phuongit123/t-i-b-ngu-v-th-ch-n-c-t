# AFFINITY 3.0 JAVASCRIPT DOM API REFERENCE

## Document Metadata
- **Product:** Serif Affinity (Canva Affinity)
- **Version:** `Affinity 3.3.3.5004 Win32 (Oct 30 2026)`
- **Extracted Date:** `2026-11-09`
- **Total SDK Topics Extracted:** 401 topics (270 `ts/dom/*.d.ts`, 21 `ts/*.d.ts`, 35 `examples/*.js`, 75 root JS modules)
- **Status:** **LIVE VERIFIED**

---

## 1. Classification & Status Legend

- **[VERIFIED LIVE]**: Executed and confirmed working in the running Affinity 3.3.3 instance via MCP.
- **[DOCUMENTED]**: Declared in official SDK `.d.ts` and `.js` documentation files with verified parameter ranges.
- **[UNSUPPORTED / CONSTRAINED]**: Restricted by security sandbox, hardware constraints, or architectural boundaries.

---

## 2. Core Application & Document Architecture

### 2.1. Module `/application.js` [VERIFIED LIVE]
Required as: `const { Application } = require('/application.js');`

#### Class `Application`
- `Application.version` [VERIFIED LIVE]: Returns string (`"Affinity 3.3.3.5004 Win32 (Oct 30 2026)"`).
- `Application.productFullName` [VERIFIED LIVE]: Returns `"Affinity"`.
- `Application.buildVersion` [VERIFIED LIVE]: Returns `3`.
- `Application.documents` [VERIFIED LIVE]: Returns `ApplicationDocuments` accessor.
- `Application.settings` [DOCUMENTED]: Settings object (e.g. `loadPSDWithEditableText`, `undoLimit`).
- `Application.userDesktopPath` [DOCUMENTED]: Path to user's desktop (sandboxed filesystem boundary).
- `Application.resourcesPath` [DOCUMENTED]: Path to application resources.

#### Class `ApplicationDocuments`
- `Application.documents.current` [VERIFIED LIVE]: Returns active `Document` object or `null`.
- `Application.documents.all` [DOCUMENTED]: Returns array of all open `Document` objects.
- `Application.documents.load(path, options)` [DOCUMENTED]: Opens a document from disk.

---

### 2.2. Module `/document.js` [VERIFIED LIVE]
Required as: `const { Document } = require('/document.js');`

#### Class `Document`
- `doc.sessionUuid` [VERIFIED LIVE]: Required 36-character UUID used for `render_spread` and `render_selection` (e.g., `"695C8818-C576-40BA-A670-7D2D1A87A8B0"`).
- `doc.name` / `doc.title` [VERIFIED LIVE]: Active document filename.
- `doc.spreads` [VERIFIED LIVE]: Array of `Spread` instances.
- `doc.selectedNodes` [DOCUMENTED]: Array of currently selected nodes.
- `doc.addNode(nodeDefinition)` [DOCUMENTED]: Appends a newly created node to the document.
- `doc.executeCommand(command)` [DOCUMENTED]: Executes a `DocumentCommand` within the undo stack.

---

## 3. Shapes & Geometry Architecture (`/shapes.js`, `/geometry.js`)

### 3.1. Shape Generation [DOCUMENTED & HINT-VERIFIED]
Required as: `const { ShapeRectangle, ShapeEllipse, ShapePolygon, ShapeStar } = require('/shapes.js');`

- `ShapeRectangle.create()`: Creates rectangle shape.
  * *Important behavior:* Defaults to rounded corners. To obtain a square rectangle:
    ```javascript
    shape.useSingleRadius = true;
    shape.topLeft.setRadius(0, width, height);
    ```
- `ShapeEllipse.create()`: Creates ellipse or circle.
- `ShapePolygon.create(sides)`: Creates regular polygon.
- `ShapeStar.create(points)`: Creates star vector shape.
- `ShapeCog.create(teeth)`: Creates mechanical cog shape.
- `ShapePie.create()`, `ShapeDonut.create()`, `ShapeCloud.create()`, `ShapeHeart.create()`.

### 3.2. Freeform Bezier Curves (`/curvesinterface.js`, `ts/dom/CurvesInterfaceApi.d.ts`)
- `CubicBezierApi.evaluate(t: [0.0, 1.0])`: Evaluates bezier spline coordinate.
- `PolyCurveNodeDefinition`: Creates complex multi-node vector paths.

---

## 4. Fills, Strokes & Colors (`/fills.js`, `/colours.js`, `affinity:linestyles`)

### 4.1. Colors
- `Colour` / `RGBA8(r, g, b, a)`: Standard 8-bit RGBA color object (`alpha: [0.0, 1.0]`).
- `CMYK8(c, m, y, k)`: 8-bit CMYK color for print workflows.

### 4.2. Fills
- `FillDescriptor.createSolid(colour)`: Creates solid color fill.
- `FillDescriptor.createNone()`: Transparent / no fill.
- `FillDescriptor.createLinear(gradient)`: Linear gradient fill.

### 4.3. Strokes
- `LineStyleDescriptor.createDefault(weight)`: Sets stroke weight.
- `lineStyle.miterLimit`: Range `[1.0, 100.0]`.
- `lineStyle.type`: `LineType.Solid`, `LineType.Dashed`.

---

## 5. Live Layer Effects & Live Filters (`/layereffects.js`, `param_ranges.min.json`)

All parameter ranges are extracted from `param_ranges.min.json` and verified:

| Effect / Filter | Native API Class | Property / Parameter | Valid Range |
|---|---|---|:---:|
| **Gaussian Blur** | `GaussianBlurFilterParametersApi` | `radius` | `[0.0, 1024.0]` |
| **Outer Shadow** | `OuterShadowLayerEffectApi` | `intensity` | `[0.0, 1.0]` |
| **Inner Shadow** | `InnerShadowLayerEffectApi` | `intensity` | `[0.0, 1.0]` |
| **Outer Glow** | `OuterGlowLayerEffectApi` | `intensity` | `[0.0, 1.0]` |
| **Bevel / Emboss** | `BevelEmbossLayerEffectApi` | `soften` | `[0.0, 1.0]` |
| **Black & White** | `BlackAndWhiteAdjustmentParametersApi` | `red, green, blue, cyan, magenta, yellow` | `[-2.0, 3.0]` |
| **Brightness / Contrast** | `BrightnessContrastAdjustmentParametersApi` | `brightness, contrast` | `[-1.0, 1.0]` |
| **Exposure** | `ExposureAdjustmentParametersApi` | `exposure` | `[-20.0, 20.0]` |
| **Curves** | `CurvesAdjustmentParametersApi` | `min, max` | `[-100.0, 100.0]` |
| **Vignette** | `VignetteFilterParametersApi` | `exposure: [-4.0, 4.0], scale: [0.25, 4.0]` | Multiple |

---

## 6. Document Commands & Generative Operations (`/commands.js`)

`DocumentCommand` wraps undoable, native Affinity operations:
- `createAddPages(firstPageIndex, insertAfter, pageCount, masterSpreadIndex, insertMode)`
- `createDeletePages(firstPageIndex, pageCount)`
- `createAddMasterPages(insertAfterMasterSpreadIndex, masterSpreadCount, pageCount)`
- `createFeatherRasterSelectionCommand(radius: [0.0, 1024.0])`
- `createGenerativeUpscaleCommand(scale: [1.0, 4.0])`
- `createImageTraceCommand(curveFittingTolerance: [0.0, 1.0], edgeThreshold: [0.0, 1.0])`
- `createMixedLightCorrectionCommand(strength: [0.0, 1.0], temperature: [-1.0, 1.0])`
- `createRasterMLDenoiseCommand(chromaStrength: [0.0, 1.0], lumaStrength: [0.0, 1.0])`
- `createRasterFloodFillCommand(point, tolerance: [0.0, 1.0])`
- `createRasterFloodSelectCommand(point, tolerance: [0.0, 1.0])`

---

## 7. Unsupported Capabilities & Safety Boundaries

1. **Filesystem Isolation:** By default, scripts cannot write to arbitrary directories; all filesystem interactions must target `Application.userDesktopPath` or temporary directories unless user relaxed Affinity app settings.
2. **Synchronous UI Modals:** `UiApi.alert()` and `UiApi.confirm()` halt the Affinity main thread until manually clicked by the user. Automated CI scripts must avoid interactive UI calls.
3. **Hardware Cursor & Pen Drawing Events:** The MCP operates at the DOM object model level. It cannot simulate physical mouse movements, pen stylus pressure curves in real-time, or hardware dragging.
4. **App Window Chrome Switching:** Scripts can manipulate elements across all personas simultaneously, but cannot programmatically click or switch the visual Persona toolbar button in the application window chrome.
