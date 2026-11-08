# V7 Visual Corrections & About Motion Design Revision

**Date:** 2026-11-08<br>
**Designer:** Antigravity (Gemini 3.8 Flash)<br>
**Task ID:** `task_afae422dbbbc`<br>
**Target Document:** `docs/V7-ABOUT-DESIGN-REVISION.md`<br>
**Target Implementer:** Luna (`gpt-6-luna`, sole source editor)<br>
**Status:** Authoritative Design Advisory & Handover Specification (Updated with Cursor Attraction Pinch & Focal Node Models)

---

## 1. Executive Summary & Latest Review Decisions

Following coordinator inspection of the original reference frame at 3.0s (`.checkpoints/v7-about-revision-2026-11-08/reference-grid-detail.png`) and the user's latest override screencast (`full-width-neutral-grid-request.webm`), this document establishes the definitive design specification across all visual correction tracks:

1. **Cursor Attraction / Pinch (Sign & Topology Correction):** The prior implementation and proposal mistakenly used radial displacement vector $(\mathbf{P} - \mathbf{C})/d$, which pushed vertices *away* from the cursor, creating an artificial, rubbery bulge. The original reference video visibly demonstrates **magnetic attraction / contraction toward the cursor**: mesh intersections pull smoothly inward toward $(\mathbf{C} - \mathbf{P})$, bunching the technical grid tightly around the focal point without mesh crossings.
2. **Crisp Focal Accent Node (Replacing Large Glow):** The large $24\text{px}$ radial gradient glow is superseded. The reference shows a **crisp, small solid accent point** ($r \approx 3.0\text{--}3.5\text{px}$) with a tight, restrained micro-halo ($r \approx 6\text{--}8\text{px}$) and subtle intersection nodes along deformed lines.
3. **Neutral Base Grid with Localized Accent Color:** The base grid across the entire surface is a faint, neutral gray. Vibrant accent color is applied *only* to the local attraction patch ($R \approx 160\text{--}180\text{px}$) as lines pinch toward the cursor.
4. **Full-Viewport Edge-to-Edge Coordinate Space:** Grid deformation and the moving name marquee must span the full usable browser viewport width within About's vertical region—including both side gutters—with active pointer sensitivity in the outer margins and zero page-level horizontal overflow (`scrollWidth === innerWidth`).
5. **Exact Stacking Order:** Outlined name marquee renders **ABOVE the grid canvas and BELOW readable foreground copy and the 3D lanyard**.
6. **Free 3D Lanyard Drag:** No `overflow: hidden` on `#about` or ancestor containers; background canvas and marquee maintain `pointer-events: none !important;` so the lanyard moves unconstrained across and beyond About.
7. **Competition Multi-Photo Card Stack:** Unclipped layered card stack (`overflow: visible`), distinct rest angles ($0^\circ, +3.0^\circ, -4.0^\circ$), visible exposed edges, individual card elevation shadows, and $340\text{ms}$ physical shuffle remains authoritative.
8. **Local Pause Removed:** Local pause button remains deleted; automatic lifecycles (reduced motion, offscreen, tab hidden, dialog, BFCache, lanyard capture) remain 100% active.

> [!NOTE]
> All numerical values herein are calibrated design proposals for visual matching, not pre-claimed empirical benchmark facts. Luna remains the sole product source editor.

---

## 2. Design Skills & Preserved Guidance Audit

All five requested design skills and preserved motion guidance repositories were independently verified on disk:

| Design Skill / Reference | Location on Disk | Status | Core Principles Applied |
| :--- | :--- | :--- | :--- |
| **`impeccable`** | `/home/yunachz/.gemini/config/skills/impeccable/SKILL.md` | **Verified** | Experience/Persuade mode; restrained CAD-like grid precision; magnetic attraction physics; strict typography protection. |
| **`taste-design`** | `/home/yunachz/.gemini/config/skills/taste-design/SKILL.md` | **Verified** | Semantic design tokens (`var(--line)`, `var(--ink)`, `var(--accent)`); hardware layer isolation (`transform`, `opacity` only); zero layout shifts. |
| **`apple-design`** | `/home/yunachz/.gemini/config/skills/apple-design/SKILL.md` | **Verified** | WWDC *Designing Fluid Interfaces*; first-order exponential smoothing ($\tau = 65\text{ms}$); physical pinch attraction; non-blocking gesture pass-through. |
| **`ui-ux-pro-max`** | `/home/yunachz/.gemini/config/skills/ui-ux-pro-max/SKILL.md` | **Verified** | Target contrast ratios ($\ge 7:1$ for solid ink headings and copy against the neutral/watermark backdrop); automatic `prefers-reduced-motion` handling; coarse pointer fallback. |
| **`design-taste-frontend`** | `/home/yunachz/.gemini/config/skills/design-taste-frontend/SKILL.md` | **Verified** | Anti-slop house style; eliminating cartoonish bubble-warping; authentic precision engineering aesthetic. |
| **Preserved GSAP Guidance** | `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/` (`gsap-core.md`, etc.) | **Verified** | Demand-driven frame loops (rAF owner); rest gate halting animation when stationary; zero runtime bundle additions. |

---

## 3. Forensic Analysis of Reference Media & Bug Diagnosis

### 3.1 Media Artifacts Inspected
1. **Original Reference Frame at 3.0s:** `.checkpoints/v7-about-revision-2026-11-08/reference-grid-detail.png` (1920×1080). Shows mesh intersections contracting inward toward the cursor, crisp small solid accent point, locally colored thin lines, and faint neutral grid outside.
2. **About Grid Original Reference Video:** `.checkpoints/v7-about-revision-2026-11-08/reference.webm` (1920×1080 @ 29.50 fps, 249 frames, 8.44s, VP8 without audio). Contact sheet: `reference-contact-sheet.jpg` (1920 px wide × 2160 px high).
3. **Latest Override Screencast:** `.checkpoints/v7-about-revision-2026-11-08/full-width-neutral-grid-request.webm` (1920×1080 @ 29.75 fps, 392 frames, 13.18s, VP8 without audio). Contact sheet: `full-width-request-contact-sheet.jpg` (1920 px wide × 1620 px high).
4. **Marquee Bug Report:** `.checkpoints/v7-about-revision-2026-11-08/marquee-bug.webm` (1920×1080 @ 29.67 fps, 333 frames, 11.22s). Contact sheet: `marquee-bug-contact-sheet.jpg` (1920 px wide × 1620 px high).
5. **Competition Bug Report:** `.checkpoints/v7-about-revision-2026-11-08/competition-bug.webm` (1920×1080, 10.23s). Contact sheet: `competition-current-contact-sheet.jpg` (2560 px wide × 1800 px high).
6. **Competition Original Reference:** `.checkpoints/v7-planning-pause-2026-11-06/WhatsApp Video 2026-11-06 at 2.13.54 PM.mp4` (854×480 @ 30 fps, 200 frames, 6.67s). Contact sheets: `competition-filmstrip-0.jpg`, `competition-filmstrip-2.jpg`, `competition-filmstrip-3.jpg`.

### 3.2 Root-Cause Diagnosis: Repulsion vs Attraction
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ERRONEOUS IMPLEMENTATION (REPULSION / BULGE)                                           │
│ Vector: P' = P + (P - C)/d * amount                                                    │
│ Behavior: Point P is pushed AWAY from cursor C. Result: rubbery bubble, exaggerated    │
│ distortion, lines spreading apart at the cursor.                                       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ RECONCILED TO ORIGINAL REFERENCE
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│ CORRECT REFERENCE BEHAVIOR (ATTRACTION / PINCH)                                        │
│ Vector: P' = P + (C - P)/d * amount                                                    │
│ Behavior: Point P is pulled TOWARD cursor C. Result: tight magnetic pinch, lines       │
│ contracting toward the small solid accent node, natural tension fading outward.        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

In `reference-grid-detail.png`, grid lines do NOT bow outward away from the cursor. They contract inward toward the cursor tip, creating a localized grid concentration that mimics gravitational or elastic pull.

---

## 4. About Background: Magnetic Attraction Grid Model

### 4.1 Mathematical Formulation of Attraction / Pinch
Let $\mathbf{C} = (C_x, C_y)$ be the smoothed pointer position, and $\mathbf{P} = (x, y)$ be an undisplaced grid vertex.
Let $d = \|\mathbf{P} - \mathbf{C}\| = \sqrt{(x - C_x)^2 + (y - C_y)^2}$ be the Euclidean distance.
Let $R \approx 170\text{px}$ be the localized attraction radius, and $D_{\max} \approx 16\text{px}$ be the peak attraction displacement.

If $d \ge R$ or $d \le 0.5\text{px}$:
$$\mathbf{P}' = \mathbf{P}$$

For $0.5\text{px} < d < R$:
1. Normalized proximity:
   $$u = 1 - \frac{d}{R} \quad (u \in (0, 1])$$
2. Smooth cubic Hermite falloff:
   $$\text{weight} = u^2 \cdot (3 - 2u) \cdot \text{intensity}$$
3. Attraction displacement amount (guaranteed $\text{amount} < d \cdot 0.5$, ensuring zero line crossings):
   $$\text{amount} = D_{\max} \cdot \text{weight}$$
4. **Attraction Displacement Vector (Pulling TOWARD Cursor):**
   $$\mathbf{P}' = \mathbf{P} + \frac{\mathbf{C} - \mathbf{P}}{d} \cdot \text{amount}$$

*Topology Guarantee:* Because the grid pitch is $S = 52\text{px}$ and $D_{\max} \approx 16\text{px} < S/2$, adjacent vertices move in the same coherent direction and can never cross, invert, or fold.

### 4.2 Neutral Base Grid with Localized Accent Color
* **Base Grid (Global resting surface):**
  - Light Theme: Neutral slate gray stroke `rgba(15, 23, 42, 0.12)` (or `color-mix(in srgb, var(--ink) 12%, transparent)`).
  - Dark Theme: Neutral light slate stroke `rgba(255, 255, 255, 0.14)`.
  - Line width: `1.0px`.
  - Pitch: $52\text{px}$ uniform orthogonal spacing.
* **Localized Accent Tint (Inside Attraction Zone $d < R$):**
  - Grid lines outside $R$ remain 100% neutral gray.
  - Inside $R$, the stroke transitions smoothly from neutral gray at $r = R$ to the vivid accent color at the cursor:
    * Light Theme: transitions to `rgba(37, 99, 235, 0.70 * intensity)`.
    * Dark Theme: transitions to `rgba(147, 197, 253, 0.75 * intensity)`.
  - Canvas 2D Implementation Strategy:
    1. Draw entire neutral grid in one continuous pass (`context.strokeStyle = neutralStroke; context.stroke()`).
    2. If `intensity > 0.01`: Set `context.strokeStyle` to a 2D radial gradient centered at $(C_x, C_y)$ with radius $R$, fading from accent color to neutral gray, and stroke the deformed line paths within the local patch.

### 4.3 Crisp Focal Accent Node & Intersection Dots
In `reference-grid-detail.png`, the cursor focal point is a **crisp, small solid dot**, NOT a broad fuzzy cloud:

* **Central Solid Accent Node:**
  - Radius: $r = 3.2\text{px}$ (sharp, compact).
  - Fill Color: solid accent blue (`rgba(37, 99, 235, 0.95 * intensity)` light / `rgba(147, 197, 253, 0.95 * intensity)` dark).
* **Restrained Micro-Halo:**
  - Radial gradient from $(C_x, C_y)$ out to $r = 7.0\text{px}$ only, providing a subtle optical glint around the solid node.
* **Micro Intersection Nodes (Optional CAD Polish):**
  - At deformed grid intersections within $d < R$, draw small micro-dots ($r = 1.2\text{px}$, stroke color) to reinforce the precision technical grid aesthetic seen in the reference screencast.

### 4.4 Follower Smoothing & Rest Gate
* Position tracking uses first-order exponential smoothing:
  $$\mathbf{C}_t = \mathbf{C}_{t-1} + (\mathbf{C}_{\text{target}} - \mathbf{C}_{t-1}) \cdot (1 - e^{-\Delta t / 0.065})$$
* Rest Gate: Halt rAF scheduling when $\|\mathbf{C}_{\text{target}} - \mathbf{C}\| < 0.15\text{px}$ and $|I_{\text{target}} - I| < 0.002$. Ensures the animation idles with 0% CPU consumption when the mouse is at rest.

---

## 5. Full-Width Layout & Stacking Hierarchy

### 5.1 Edge-to-Edge Decorative Coordinate Space
* **Full Viewport Span:**
  - The decorative background container `.about-motion-background` must span the full usable browser viewport width (`width: 100vw; max-width: 100%`) within About's vertical bounds, covering both side gutters.
  - Zero document horizontal overflow (`document.documentElement.scrollWidth === window.innerWidth`).
* **Outer Gutter Pointer Tracking:**
  - Pointer movement in the left and right margins must deform the mesh in those gutters.
  - Listener is attached to `window` (passive), checking if `event.clientY` is within About's vertical bounds, and mapping `targetX` across the full viewport width ($0$ to `cssWidth`).

### 5.2 Stacking Order: Name ABOVE Grid, BELOW Foreground
Explicit user requirement:
> *"The text must render above the grid, behind the readable foreground and lanyard."*

```
About Section Stacking Order:

┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Interactive 3D Lanyard (z-index: 10, interactive)  │
│  • Canvas: pointer-events: auto; free drag across viewport   │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Readable Foreground Copy (z-index: 2, interactive) │
│  • .hero__copy, h1, p, buttons, fact cards                  │
│  • Solid ink text (var(--ink)), target contrast >= 7:1      │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Outlined Name Marquee (z-index: 1, decorative)     │
│  • .about-motion-marquee: pointer-events: none              │
│  • Renders ABOVE grid canvas, BELOW foreground text         │
│  • Single-layer stroke: 38% light / 42% dark, opacity: 1.0  │
│  • Spans full viewport width, seamless WAAPI drift          │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Neutral Grid Canvas (z-index: 0, decorative)       │
│  • .about-motion-grid: pointer-events: none                 │
│  • Full-width neutral gray base with localized attraction   │
├─────────────────────────────────────────────────────────────┤
│ Layer 0: Background Surface (z-index: -1, background)       │
│  • Page surface / paper color tokens                        │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Marquee Typographic Watermark Calibration
* **Single Alpha Layer:** `.about-motion-marquee__group { opacity: 1 !important; color: transparent; }`
* **Stroke Contrast:**
  - Light Theme: `-webkit-text-stroke: 1.5px color-mix(in srgb, var(--accent) 38%, transparent);`
  - Dark Theme: `-webkit-text-stroke: 1.5px color-mix(in srgb, var(--accent) 42%, transparent);`
  - Mobile ($\le 48\text{rem}$): `-webkit-text-stroke-width: 1.2px; opacity: 1 !important;`
* **Placement:** Centered vertically in About (`top: 48%; transform: translateY(-50%);`), spanning edge-to-edge across the viewport.

---

## 6. Competition Section: Unclipped Layered Photo Stack

*(Preserved from the prior visual correction—authoritative for Luna's implementation)*

### 6.1 Architecture: Unclipped Physical Deck
1. **Remove Container Clipping:**
   - `.competition-photo-stack` MUST have `overflow: visible;`.
   - Remove outer border and box shadow from `.competition-photo-stack`. Borders and shadows belong on individual `.competition-photo-layer` cards.
2. **Safe Spacing & Boundary Clearance:**
   - `.competition-row__media-visual` provides internal clearance (`padding: 1.25rem 1.5rem`) so tilted card edges ($\pm 4^\circ$) never clip against container edges or cause horizontal scrollbars.

### 6.2 Distinct Resting Poses & Exposed Edges
For each card in a 3-photo deck ($0 = \text{front}, 1 = \text{middle}, 2 = \text{back}$):

| Card Layer | Rank | Z-Index | Resting Transform (Translate, Rotate, Scale) | Opacity | Individual Card Styling |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **Front Card** | `0` (Active) | `3` | `translate3d(0, 0, 0) rotate(0deg) scale(1.0)` | `1.0` | `border: 1px solid var(--line-strong); border-radius: 18px; box-shadow: 0 16px 32px -10px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12);` |
| **Middle Card** | `1` | `2` | `translate3d(10px, -5px, 0) rotate(3.0deg) scale(0.97)` | `0.90` | `border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 10px 22px -6px rgba(0,0,0,0.18);` (Top & right edges exposed by $\approx 10\text{px}$) |
| **Back Card** | `2` | `1` | `translate3d(-8px, 6px, 0) rotate(-4.0deg) scale(0.94)` | `0.78` | `border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 6px 14px -4px rgba(0,0,0,0.14);` (Left & bottom edges exposed by $\approx 8\text{px}$) |

*Alternating Row Polish:* For odd-indexed competition rows (where photo media is on the right), invert the tilt signs (Rank 1: $-3.0^\circ$, Rank 2: $+4.0^\circ$) for organic editorial asymmetry.

### 6.3 Shuffle Kinetics (Click / Key / Tap)
* **Outgoing Phase (0–150ms):** Active front card lifts and swings outward: `translate3d(36px, -18px, 0) rotate(12deg) scale(1.02)`, opacity easing to `0.80`. Middle card springs toward front pose `(0, 0, 0deg, 1.0)`.
* **Drop-to-Back Phase (150–340ms):** Outgoing card drops to `z-index: 1`, gliding smoothly into back resting pose `(-8px, 6px, -4.0deg, 0.94)`. Total duration: **$340\text{ ms}$** (`cubic-bezier(0.16, 1, 0.3, 1)`).
* **Reduced Motion:** All cards orthogonal ($0^\circ$), switching via clean instantaneous crossfade.

---

## 7. Removal of Local Pause Control & Lifecycle Retention

### 7.1 Local Pause Removal
1. **Markup:** Remove `<button class="about-motion-pause" ...>` from `src/components/AboutMotion.astro`.
2. **Styles:** Remove `.about-motion-pause` and all associated rules from `src/styles/v3.css`.
3. **Logic:** In `src/scripts/v7-about-motion.ts`:
   - Delete `toggle` DOM query.
   - Delete `updateToggle()` function.
   - Remove `pauseReasons.has('user')` toggling logic and click handler.
   - Decouple marquee initialization from toggle existence (`if (about && canvas && marquee && track)`).

### 7.2 Preserved Automatic Lifecycles

| Lifecycle Trigger | Detection Mechanism | Grid Canvas Action | Marquee Action | Competition Deck Action |
| :--- | :--- | :--- | :--- | :--- |
| **Reduced Motion** | `matchMedia('(prefers-reduced-motion: reduce)')` | Clear canvas, halt rAF, show static CSS grid | Pause WAAPI, single static group | Flat crossfade, $0^\circ$ tilt |
| **Offscreen Section** | `IntersectionObserver(..., { threshold: [0, 0.01] })` | Clear canvas, halt rAF | Pause WAAPI animation | Normal idle |
| **Tab Hidden** | `document.visibilityState === 'hidden'` | Clear canvas, halt rAF | Pause WAAPI animation | Pause active shuffle |
| **Modal Dialog Open** | `MutationObserver` on `#content-dialog[open]` | Clear canvas, halt rAF | Pause WAAPI animation | Normal idle |
| **BFCache Suspend** | `window.addEventListener('pagehide', e => e.persisted)` | Zero intensity, halt rAF | Pause WAAPI animation | Settle deck to idle |
| **BFCache Restore** | `window.addEventListener('pageshow', e => e.persisted)` | Recalibrate geometry, resume | Resume WAAPI animation | Resume active state |
| **Coarse Pointer** | `matchMedia('(pointer: coarse)')` | Static CSS grid | Normal drift | Touch advance |
| **Lanyard Drag** | Pointer capture on `.lanyard-hit-area` | Settle grid intensity to 0 | Normal drift | Normal idle |

---

## 8. Actionable Implementation Directives for Luna

Luna (`gpt-6-luna`) is the sole authorized product source editor.

### 8.1 `src/components/AboutMotion.astro`
* Remove pause button markup (lines 18–21).
* Retain `<div class="about-motion-background" ...>`, `<canvas class="about-motion-grid" ...>`, and `<div class="about-motion-marquee" ...>`.

### 8.2 `src/styles/v3.css`
1. **Full-Bleed About Background:**
   ```css
   .hero {
     position: relative;
     isolation: isolate;
   }
   .about-motion-background {
     position: absolute;
     z-index: 0;
     top: 0;
     bottom: 0;
     left: 50%;
     transform: translateX(-50%);
     width: 100vw;
     max-width: 100%;
     overflow: hidden;
     pointer-events: none;
   }
   .about-motion-grid {
     position: absolute;
     inset: 0;
     display: block;
     width: 100%;
     height: 100%;
     opacity: 1;
     pointer-events: none;
   }
   ```
2. **Full-Width Outlined Marquee:**
   ```css
   .about-motion-marquee {
     position: absolute;
     z-index: 1; /* Above canvas (0), below copy (2) */
     top: 48%;
     transform: translateY(-50%);
     left: 0;
     right: 0;
     width: 100%;
     overflow: hidden;
     pointer-events: none;
     mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
   }
   .about-motion-marquee__group {
     flex: 0 0 auto;
     color: transparent;
     font-size: clamp(4.2rem, 11vw, 10.5rem);
     font-weight: 700;
     line-height: 1;
     letter-spacing: .06em;
     white-space: nowrap;
     -webkit-text-stroke: 1.5px color-mix(in srgb, var(--accent) 38%, transparent);
     opacity: 1; /* Single alpha layer */
   }
   html[data-theme='dark'] .about-motion-marquee__group {
     -webkit-text-stroke: 1.5px color-mix(in srgb, var(--accent) 42%, transparent);
   }
   @media (max-width: 48rem) {
     .about-motion-marquee { top: 46%; }
     .about-motion-marquee__group {
       font-size: clamp(3.2rem, 12vw, 5.8rem);
       -webkit-text-stroke-width: 1.2px;
       opacity: 1;
     }
   }
   ```
3. **Competition Unclipped Stack:**
   ```css
   .competition-photo-stack {
     position: relative;
     width: 100%;
     aspect-ratio: 16 / 10;
     overflow: visible;
     background: transparent;
     border: 0;
     box-shadow: none;
   }
   .competition-photo-layer {
     position: absolute;
     inset: 0;
     display: block;
     width: 100%;
     height: 100%;
     border: 1px solid var(--line);
     border-radius: 18px;
     object-fit: cover;
     background: var(--soft-surface);
     box-shadow: var(--shadow-soft);
     transform-origin: center center;
     transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease;
     user-select: none;
     will-change: transform, opacity;
   }
   ```
4. **Delete `.about-motion-pause` CSS block.**

### 8.3 `src/scripts/v7-about-motion.ts`
1. **Startup Check:** Change to `if (about && canvas && marquee && track)`.
2. **Full-Width Geometry & Gutter Sensitivity:**
   - Measure `cachedBounds = about.getBoundingClientRect()`. Set canvas dimensions to full usable width (`cachedBounds.width`) and height (`cachedBounds.height`).
   - In `pointerMove`: attach to `window` (passive), verify `event.clientY` is within About's vertical bounds, and compute `targetX = event.clientX - cachedBounds.left` across all horizontal gutters.
3. **Magnetic Attraction Formula:**
   ```ts
   // In drawGrid():
   const neutralStroke = theme === 'dark' ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.12)';
   const accentBase = theme === 'dark' ? 'rgba(147, 197, 253, ' : 'rgba(37, 99, 235, ';
   const spacing = 52;
   const radius = 170;
   const maximum = 16; // Peak attraction displacement

   const point = (x: number, y: number): [number, number] => {
     const dx = pointerX - x; // Vector TOWARD cursor (C - P)
     const dy = pointerY - y;
     const distance = Math.hypot(dx, dy);
     if (distance <= 0.5 || distance >= radius) return [x, y];
     const u = 1 - distance / radius;
     const weight = u * u * (3 - 2 * u) * intensity;
     const amount = maximum * weight;
     return [x + (dx / distance) * amount, y + (dy / distance) * amount];
   };
   ```
4. **Crisp Focal Accent Point:**
   ```ts
   // Render focal node at (pointerX, pointerY):
   if (intensity > 0.01) {
     // Crisp small solid dot (r = 3.2px)
     context.fillStyle = `${accentBase}${0.95 * intensity})`;
     context.beginPath();
     context.arc(pointerX, pointerY, 3.2, 0, Math.PI * 2);
     context.fill();

     // Restrained micro-halo (r = 7px)
     const halo = context.createRadialGradient(pointerX, pointerY, 3.2, pointerX, pointerY, 7.0);
     halo.addColorStop(0, `${accentBase}${0.35 * intensity})`);
     halo.addColorStop(1, `${accentBase}0)`);
     context.fillStyle = halo;
     context.beginPath();
     context.arc(pointerX, pointerY, 7.0, 0, Math.PI * 2);
     context.fill();
   }
   ```
5. **Settling Parameters:** $\tau_{\text{pos}} = 65\text{ms}$, $\tau_{\text{intensity}} = 120\text{ms}$, rest gate $< 0.15\text{px}$.

### 8.4 `src/scripts/v7-competitions.ts`
1. Apply calibrated rest angles: Rank 0 ($0^\circ$), Rank 1 ($+3.0^\circ$), Rank 2 ($-4.0^\circ$).
2. Execute $340\text{ms}$ swing-out and drop-to-back card shuffle.

---

## 9. Verification Matrix for Implementation Handover

Before coordinator gate acceptance:

1. **Visual Acceptance Evidence:**
   - **Attraction vs Repulsion:** Deformed lines visibly pinch/contract inward toward the cursor; no bubble bulging or line crossings.
   - **Focal Accent Node:** Small crisp $3.2\text{px}$ dot visible at cursor; no broad fuzzy cloud.
   - **Gutter Sensitivity:** Pointer motion in left/right gutters deforms grid locally.
   - **Neutral Grid with Localized Tint:** Full surface shows calm neutral gray; only cursor attraction patch is colored.
   - **Full-Width Outlined Name:** `"MUHAMMAD FAJAR SODIK"` visibly drifts across full viewport, rendering above the grid canvas and behind foreground copy.
   - **Competition Card Stack:** Unclipped deck with exposed resting card edges ($0^\circ, +3.0^\circ, -4.0^\circ$) and smooth $340\text{ms}$ swing-out shuffle.
2. **Zero Horizontal Overflow:**
   - Confirm `document.documentElement.scrollWidth === window.innerWidth` across all viewports.
3. **Free Lanyard Drag:**
   - 3D badge dragged freely across and beyond About without clipping or boundary constraints.
4. **Frozen Preview Gate:**
   - Luna records SHA-256 bundle manifest and produces fresh, uniquely identified frozen preview for coordinator gate review.
