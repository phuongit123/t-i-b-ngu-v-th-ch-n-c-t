# AFFINITY ACADEMY — DESIGN SYSTEM SPECIFICATION ("MASTERO & MINIMALISM")

## Document Control
- **Document ID:** `SPEC-DESIGN-SYSTEM-001`
- **Version:** `1.0.0`
- **Design Philosophy:** Mastero & Minimalism (inspired by traced.life visual craft & micro-interactions)
- **Status:** **PHASE 2 DELIVERABLE — IMPLEMENTED & VERIFIED**
- **Governing Agents:** `DesignSystemAgent`, `UIComponentAgent`, `AccessibilityAgent`, `QAAgent`

---

## 1. Design Philosophy: Mastero & Minimalism

The **Affinity Academy Design System** bridges high-precision creative software aesthetics with an ultra-minimalist, disciplined web experience. Drawing inspiration from **traced.life**, the interface is governed by three core visual tenets:

1. **Restraint & High Negative Space:** Elimination of decorative clutter, heavy saturated gradients, or cartoonish graphics. Every pixel serves clarity, focus, and instructional value.
2. **Monochrome Canvas with Authentic Affinity Signature Accents:** Deep Obsidian background (`#09090b`), dark graphite surfaces (`#111115`), hairline borders (`rgba(255, 255, 255, 0.08)`), paired with precision application accents:
   - **Affinity Designer:** Electric Cyan (`#00d2ff`) &mdash; vector precision, bezier geometry.
   - **Affinity Photo:** Cobalt Sky (`#38bdf8`) &mdash; RAW development, non-destructive retouching.
   - **Affinity Publisher:** Vivid Rose (`#fb7185`) &mdash; editorial typography, master page grids.
   - **Automation / Scripting:** Neon Emerald (`#10b981`) &mdash; JavaScript DOM API & MCP engine.
3. **Deterministic Micro-Interactions:** Subtle hover states, spring-eased transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), zero unexpected layout shifts, and accessible keyboard focus navigation.

---

## 2. Token Architecture & Variables (`src/styles/tokens.css`)

### 2.1. Color Tokens
```css
/* Dark Mode Base (Default) */
--bg-canvas: #09090b;       /* Deepest obsidian background */
--bg-surface: #111115;      /* Elevated card & pane background */
--bg-elevated: #18181f;     /* Dropdowns, toolbars, popovers */
--bg-overlay: rgba(9, 9, 11, 0.85); /* Modal & dialog backdrops */

--text-primary: #f4f4f5;    /* High-contrast crisp typography */
--text-secondary: #a1a1aa;  /* Subtitles & descriptive labels */
--text-muted: #71717a;      /* Footers, metadata, shortcuts */
--text-inverse: #09090b;

--border-hairline: rgba(255, 255, 255, 0.08); /* Minimalist separators */
--border-subtle: rgba(255, 255, 255, 0.14);   /* Card borders on hover */
--border-active: rgba(255, 255, 255, 0.28);   /* Active selection ring */

/* Affinity Accents */
--accent-brand: #10b981;
--accent-designer: #00d2ff;
--accent-photo: #38bdf8;
--accent-publisher: #fb7185;
--accent-scripting: #34d399;
```

### 2.2. Typography Scale
- **Display Heading:** `text-4xl` / `text-6xl`, tracking `-0.025em`, font-weight `800`.
- **H1:** `text-2xl` / `text-3xl`, tracking `-0.02em`, font-weight `700`.
- **H2:** `text-xl` / `text-2xl`, tracking `-0.015em`, font-weight `600`.
- **H3:** `text-base` / `text-lg`, tracking `-0.01em`, font-weight `600`.
- **Body:** `text-sm`, line-height `1.6`, font-weight `400` / `500`.
- **Caption / Meta:** `text-xs`, font-weight `400` / `500`.
- **Code / Monospace:** `font-mono text-xs`, letter-spacing `0`.

### 2.3. Spacing Scale
- `space-1`: `4px` (`0.25rem`)
- `space-2`: `8px` (`0.5rem`)
- `space-3`: `12px` (`0.75rem`)
- `space-4`: `16px` (`1rem`)
- `space-6`: `24px` (`1.5rem`)
- `space-8`: `32px` (`2rem`)
- `space-12`: `48px` (`3rem`)
- `space-16`: `64px` (`4rem`)

### 2.4. Radii & Shadows
- **Radii:** Sharp, architectural corners: `radius-xs` (`2px`), `radius-sm` (`4px`), `radius-md` (`6px`).
- **Shadows:** Subtle ambient depth:
  * `--shadow-subtle`: `0 1px 2px 0 rgba(0, 0, 0, 0.4)`
  * `--shadow-card`: `0 4px 20px -2px rgba(0, 0, 0, 0.6)`
  * Signature App Glows: `--shadow-glow-designer`, `--shadow-glow-photo`, `--shadow-glow-publisher`, `--shadow-glow-brand`.

---

## 3. Component Inventory (21 Reusable Components)

| Component | Category | Path | Key Functionality |
|---|---|---|---|
| `AppShell` | Layout | `src/components/layout/AppShell.tsx` | Master structural container with header, content area, responsive sidebar, and footer. |
| `MainNavigation` | Layout | `src/components/layout/MainNavigation.tsx` | Navigation bar with live Affinity MCP status badge, search trigger, and theme toggle. |
| `SidebarNavigation` | Layout | `src/components/layout/SidebarNavigation.tsx` | Track switcher and module list with progress indicators. |
| `PageHeader` | Layout | `src/components/layout/PageHeader.tsx` | Standardized page title, badge, breadcrumbs, and action button toolbar. |
| `HeroSection` | Section | `src/components/sections/HeroSection.tsx` | High-aesthetic hero inspired by traced.life with live metrics and CTA buttons. |
| `TrackCard` | Card | `src/components/cards/TrackCard.tsx` | Signature track cards for Designer, Photo, Publisher, and Scripting with glow effects. |
| `ModuleCard` | Card | `src/components/cards/ModuleCard.tsx` | Card displaying module number (e.g. D01), duration, lesson count, difficulty badge. |
| `LessonCard` | Card | `src/components/cards/LessonCard.tsx` | Lesson row component with completion checkmark and play trigger. |
| `ProgressCard` | Card | `src/components/cards/ProgressCard.tsx` | Curriculum progress tracker, lesson completion ratio (out of 120), streak, badges. |
| `ToolCard` | Card | `src/components/cards/ToolCard.tsx` | Encyclopedia card displaying tool icon, app, persona, and Win/Mac keyboard shortcut. |
| `ResourceCard` | Card | `src/components/cards/ResourceCard.tsx` | Download card with format badge (`.afpalette`, `.afbrushes`, etc.) and download trigger. |
| `SearchCommand` | Overlay | `src/components/search/SearchCommand.tsx` | Global command palette with instant search and `Ctrl+K` shortcut support. |
| `Breadcrumbs` | Navigation | `src/components/ui/Breadcrumbs.tsx` | Accessible hierarchical navigation breadcrumbs. |
| `Button` | Primitive | `src/components/ui/Button.tsx` | 8 variants (Primary, Secondary, Outline, Ghost, 4 App Accents) and 4 sizes with loading spinners. |
| `Tabs` | Primitive | `src/components/ui/Tabs.tsx` | Accessible tablist supporting underline and pill variants with badge counts. |
| `Tooltip` | Primitive | `src/components/ui/Tooltip.tsx` | Hover and focus-triggered micro-informational tooltips with 4 directional anchors. |
| `Modal` | Overlay | `src/components/ui/Modal.tsx` | Accessible dialog with backdrop blur, Escape key dismissal, and keyboard focus trap. |
| `Toast` | Feedback | `src/components/ui/Toast.tsx` | Non-intrusive status notification (success, error, warning, info) with dismissal. |
| `Skeleton` | Loading | `src/components/ui/Skeleton.tsx` | Shimmer pulse placeholder preventing layout shifts during data fetching. |
| `EmptyState` | Feedback | `src/components/ui/EmptyState.tsx` | Minimalist container for zero-data states with contextual icons and CTA. |
| `ErrorState` | Feedback | `src/components/ui/ErrorState.tsx` | Error container with retry trigger and monospace diagnostic display. |

---

## 4. Accessibility (WCAG 2.1 AA) Compliance

1. **Color Contrast:**
   - High contrast text (`#f4f4f5` on `#09090b` canvas) exceeds **14:1 contrast ratio** (surpassing the 4.5:1 WCAG AA threshold).
   - Secondary text (`#a1a1aa` on `#09090b`) maintains a **5.8:1 contrast ratio**.
2. **Keyboard Navigation:**
   - All interactive elements (`Button`, `TrackCard`, `ModuleCard`, `LessonCard`, `ToolCard`) have explicit `tabIndex={0}`, `focus-visible:ring-1 focus-visible:ring-zinc-400`, and `onKeyDown` handlers supporting `Enter` and `Space`.
3. **Screen Readers & ARIA:**
   - Modal dialogs use `role="dialog"`, `aria-modal="true"`.
   - Tooltips use `role="tooltip"`.
   - Skeletons use `aria-hidden="true"`.
   - Error states use `role="alert"`.
   - Status toasts use `role="status"` and `aria-live="polite"`.
