# V7 Design & Motion Specification: Competitions, GlareHover, and Dynamic Entrances

- **Document:** `docs/V7-DESIGN-MOTION.md`
- **Target Release:** V7 Revision Cycle
- **Baseline Git Commits:** V6 Release `a4fd021f940c860558ceda30fe85658a17cbb6b4`, Documentation HEAD `976fffd89891ab6f171d205e8fb52f661e428841`
- **Author / Role:** Antigravity Gemini 3.8 Flash (Independent Designer Reviewer & Motion Architect)
- **Implementer Target:** Codex GPT-6 Luna max (scheduled for implementation following planning reconciliation)
- **Review Date:** November 6, 2026
- **Status:** RECONCILED DESIGN SPECIFICATION PROPOSAL (Ready for Coordinator & Implementer Review)

---

## 1. Skills Consulted & Methodological Framework

In accordance with strict orchestration guidelines and coordinator directives, all design specifications and motion architectures in this document are grounded in the following design systems and official engineering skill references. Exact file paths, commits, and documentation versions read are explicitly recorded:

1. **`caveman`** (`/home/yunachz/.codex/skills/caveman/SKILL.md`):
   - Applied principle: Factual precision. Every coordinate, timing value, animation parameter, selector, and hardware constraint is stated with zero filler and verifiable evidence.
2. **`impeccable`** (`/home/yunachz/.gemini/config/skills/impeccable/SKILL.md`):
   - Applied principle: Craft-floor discipline. Mode is **Experience/Persuade** (engineering portfolio). Preservation over redesign: keep Muhammad Fajar Sodik's authentic engineering identity, bilingual parity (ID/EN), existing visual grammar, and V6 stability fixes intact.
3. **`taste-design`** (`/home/yunachz/.gemini/config/skills/taste-design/SKILL.md`):
   - Applied principle: Semantic token hierarchy, compositor-only rendering hygiene (`transform`, `opacity` only; no animating layout geometry), hardware layer hints (`will-change`), and perpetual micro-interactions.
4. **`apple-design`** (`/home/yunachz/.gemini/config/skills/apple-design/SKILL.md`):
   - Applied principle: WWDC *Designing Fluid Interfaces* fundamentals:
     * 1:1 direct manipulation tracking on gestures with grab-offset retention.
     * Critically damped spring defaults (`damping: 1.0`, `response: 0.35s–0.4s`) mapped to browser-supported curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
     * Under-damped springs (`damping: 0.8–0.85`, `cubic-bezier(0.2, 0.8, 0.2, 1)`) reserved strictly for physical, momentum-driven interactions (card deck shuffle).
     * Unconditional interruptibility: animating from presentation (live on-screen) values rather than logical endpoints.
     * Ergonomic standards: minimum 44×44px hit bounds for all interactive controls.
5. **`ui-ux-pro-max`** (`/home/yunachz/.gemini/config/skills/ui-ux-pro-max/SKILL.md`):
   - Applied principle: Rigorous accessibility compliance (WCAG 2.1 AA/AAA contrast ratios ≥ 4.5:1, `aria-roledescription`, `role="region"`, `aria-live="polite"` status announcements), keyboard operability (`Space`, `Enter`, `ArrowLeft`, `ArrowRight`), and dual-locale typographical balance.
6. **`design-taste-frontend`** (`/home/yunachz/.gemini/config/skills/design-taste-frontend/SKILL.md`):
   - Applied principle: Anti-slop house style. No generic purple neon gradients, no meaningless floating shapes, and no invented fake achievements. All decorative enhancements serve engineering context and tactile credibility.
7. **Official GSAP Skills (`greensock/gsap-skills` on GitHub, commit `aed9cfd`):**
   - Directly read files:
     * `skills/gsap-core/SKILL.md` (read from `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/gsap-core.md`)
     * `skills/gsap-react/SKILL.md` (read from `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/gsap-react.md`)
     * `skills/gsap-frameworks/SKILL.md` (read from `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/gsap-frameworks.md`)
     * `skills/gsap-performance/SKILL.md` (read from `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/gsap-performance.md`)
     * `skills/gsap-timeline/SKILL.md` (read from `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/gsap-timeline.md`)
     * Local reference: `/home/yunachz/.codex/.tmp/plugins/plugins/hyperframes/skills/gsap/SKILL.md`.
   - Core insights applied: Transform aliases (`x`, `y`, `scale`), compositor isolation, `immediateRender: false` on chained tweens, `gsap.quickTo()` for mouse follower smoothing, and avoiding layout thrashing.
   - **Architectural Scope Evaluation:** The existing portfolio runs on Astro 7 with a high-performance native Web Animations API (WAAPI) entrance engine (`v6-entrance.ts`, 538 lines) and React 19 islands. Introducing a heavy global GSAP runtime bundle just for entrance fades is an anti-pattern. Instead, GSAP principles (spring curves, layer promotion, compositor-only batching) are implemented natively via WAAPI and CSS custom properties for site-wide entrances, reserving lightweight specialized scripts only where needed.

---

## 2. Forensic Analysis of User References

All reference media specified in `docs/V7-REVISION-BRIEF.md` were independently inspected via video frame extraction, optical flow tracking, color-space analysis, and payload disassembly. Durable copies are maintained in `.checkpoints/v7-planning-pause-2026-11-06/` and `/tmp/v7-inspection/`.

```
Reference Inspection Provenance:
- Video 1: /home/yunachz/Downloads/WhatsApp Video 2026-11-06 at 2.13.54 PM.mp4 (854x480 @ 30fps, 200 frames, 6.67s, SHA256: 3298286910...)
- Video 2: /home/yunachz/Downloads/WhatsApp Video 2026-11-06 at 2.36.06 PM.mp4 (854x480 @ 30fps, 253 frames, 8.43s, SHA256: fda5d4452c...)
- Grid Screenshot: /tmp/orca-paste-1793951029459-8c1558f9-d436-487b-b19c-6fa2b39e1140.png (1920x1080)
- Contact Sheets: /tmp/v7-competition-reference.png & /tmp/v7-about-reference.png (1920x810)
- GlareHover Registry: https://reactbits.dev/r/GlareHover-JS-CSS.json (11,430 bytes, zero dependencies)
- Evidence Manifest: /tmp/v7-inspection/evidence-manifest.json
```

### Reference 1: Competition Multi-Photo Card Shuffle (Video 1 & Contact Sheet)
- **Technical Metrics:** 854×480 @ 30.0 fps, 200 total frames, duration 6.67 seconds.
- **Direct Observations from Video Frames:**
  1. **Layout Structure:** Alternating 2-column editorial structure. The video demonstrates an alternating layout where one row displays media on the right and text on the left, and another row displays media on the left and text on the right.
  2. **Click Transition Sequences:**
     Dense frame inspection (`/tmp/v7-inspection/video1_dense/`) identifies three distinct interaction clusters:
     - *Cluster 1 (Frames 52–62, t = 1.73s–2.07s):* The active top card is clicked. It translates outward (`x: +16px, y: -12px, rotate: +4deg`), fades to ~0.75, drops to the back of the stack (`z-index: 1`), while the revealed second card smoothly springs forward to the top (`z-index: 3`, `scale: 1.0, rotate: 0deg`). Measured transition duration: ~340 ms (10 frames @ 30 fps).
     - *Cluster 2 (Frames 80–92, t = 2.67s–3.07s):* Second click advances the deck to photo 3 with identical physical shuffle mechanics.
     - *Cluster 3 (Frames 180–192, t = 6.00s–6.40s):* Third click cycles back to photo 1.
  3. **Visual Affordance:** A small pill counter badge at the bottom-right of the card displays the photo index (e.g., `1 / 3`) with a layered card/photo icon.
- **Distinction Between Observation and Proposal:**
  - *Observed in Reference:* Card shuffle animation on click, alternating 2-column layout, counter badge.
  - *Proposed for Portfolio:* Adapt this interaction to Muhammad Fajar Sodik's engineering portfolio using Astro + CSS/JS, 4 dummy competition records, and accessible keyboard/touch navigation.

### Reference 2: About Moving Outlined Name Text (Video 2 & Contact Sheet)
- **Technical Metrics:** 854×480 @ 30.0 fps, 253 total frames, duration 8.43 seconds.
- **Direct Observations from Video Frames:**
  1. **Visual Style:** Monolithic uppercase sans-serif letters rendered purely as an outline (stroke-only) with transparent interior fills.
  2. **Motion:** A continuous, seamless horizontal drift moving across the background plane.
  3. **Placement:** In the reference video, the outline text moves in the background behind the primary biographical content.
- **User Brief Requirement vs Proposal:**
  - *User Brief:* Specifically requests using Muhammad Fajar Sodik's name (`"MUHAMMAD FAJAR SODIK"`), inspired by the video, positioned in the middle of About, coexisting safely with text and the 3D lanyard.
  - *Proposed Calibration:*
    * Light mode stroke: `-webkit-text-stroke: 1.5px rgba(24, 24, 27, 0.11)`.
    * Dark mode stroke: `-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.13)`.
    * Spatial Layering: `z-index: 0; pointer-events: none;` positioned vertically at `top: 48%; transform: translateY(-50%);`. Sits behind `.hero__copy` (`z-index: 2`) and behind `.hero-portrait` (`z-index: 3`).
    * Lifecycle: Paused offscreen via `IntersectionObserver` and paused when tab is hidden via `visibilitychange`. Rendered static under `prefers-reduced-motion: reduce`.

### Reference 3: Cursor-Distorted Technical Grid (Screenshot from `resberg.github.io/#about`)
- **Direct Observations from Screenshot:**
  1. Technical orthogonal grid (~52px cell spacing) with subtle intersection points on a dark background.
  2. Cursor movement produces a localized elastic pull / distortion towards the mouse pointer.
  3. The effect remains strictly subordinate to the readable text in the foreground.
- **Proposed Physics & Coexistence Architecture:**
  - *Elastic Displacement:* Radius $R = 150\text{ px}$, maximum displacement $D_{\max} = 9\text{ px}$, quadratic falloff $\Delta = (1 - d/R)^2 \times D_{\max}$, exponential decay `0.88` restoring intersections to rest.
  - *Lanyard Coexistence Invariant:* The grid canvas is styled with `pointer-events: none !important; z-index: 0;`. Mouse tracking attaches to `#about` using `{ passive: true }`. When the 3D lanyard badge is grabbed (`sim.grab !== null`), grid RAF animation is temporarily suspended, keeping grid lines static so 100% of GPU rendering power goes to Three.js card physics.
  - *Mobile & Touch Fallback:* Touch devices (`(pointer: coarse)`) and viewports `< 768px` render a static CSS grid with 0 JS listeners and 0 RAF loops.
  - *Accessibility:* Under `prefers-reduced-motion: reduce`, the grid is strictly static.

### Reference 4: React Bits GlareHover JS-CSS (`GlareHover.jsx`)
- **Direct Disassembly Findings:**
  1. **Zero External Dependencies:** Built with pure React 18/19 and standard Web APIs (`ResizeObserver`, `IntersectionObserver`, `color-mix(in srgb, ...)`).
  2. **Native Entry + Hover Synergy:**
     Lines 180–188 of `GlareHover.jsx` reveal:
     ```jsx
     const visibilityObserver = new IntersectionObserver(
       ([entry]) => {
         state.visible = entry.isIntersecting;
         if (entry.isIntersecting && settingsRef.current.intro && !introRef.current) {
           introRef.current = true;
           sweep(1);
         }
       },
       { threshold: 0.4 }
     );
     visibilityObserver.observe(root);
     ```
     This proves that passing `intro={true}` natively triggers the first-entry glare sweep upon entering the viewport (threshold 0.4), while `mode="hover"` concurrently handles pointer enter/leave sweeps without any monkey-patching or duplicate observers.
  3. **Reduced Motion:** Handled natively via `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active, `sweep()` aborts immediately.

---

## 3. Motion Architecture & Transform Ownership Separation

### The Transform Collision Problem
In V6, `v6-entrance.ts` animates elements using WAAPI (`element.animate()`):
```ts
const keyframes: Keyframe[] = CSS.supports?.('translate', '0px 1px')
  ? [
      { opacity: startOpacity, translate: travel },
      { opacity: 1, translate: '0px 0px' },
    ]
  : [{ opacity: startOpacity }, { opacity: 1 }];
```
If an interactive component (such as `.competition-photo-card`, which uses `transform: translate3d(...) rotate(...)`, or `.credential-card figure:hover`, which uses hover scaling) has WAAPI animating `transform` or `translate` on the **same DOM node**, the WAAPI animation locks the transform during playback and can override CSS transitions, causing visible jumps or broken stacking!

### Two-Layer Transform Ownership Contract
To eliminate transform collisions across the entire site, implementers must enforce strict two-layer DOM separation:

```
[Outer Entrance Wrapper]  <-- OWNS Entrance Motion ONLY
  data-v6-enter="<id>"
  - WAAPI animates opacity (0 -> 1) and entrance translate (0px 14px -> 0px 0px).
  - Once entrance resolves, animation is canceled and data-v6-state="done" is set.
  - No interactive transforms, hover states, or card-shuffle logic live here.
    │
    └── [Inner Interactive Element]  <-- OWNS Interactive Transforms ONLY
          .competition-card__media-deck / .competition-photo-card / .credential-card figure
          - Owns CSS transforms: translate3d(), rotate(), scale().
          - Owns hover transitions, card stacking, deck shuffle, and gesture momentum.
          - Completely isolated from WAAPI entrance animations.
```

### True Implementation Curves (No Unsupported Spring Props)
Neither CSS nor WAAPI supports arbitrary `spring()` properties natively. All springs in this specification are mapped to exact browser-supported cubic-bezier curves and milliseconds:

1. **Apple Critically Damped Entrance Spring (`damping: 1.0`, `response: 0.35s`):**
   - Mapped Curve: `cubic-bezier(0.16, 1, 0.3, 1)`
   - Duration: **360 ms** (safe controls) to **480 ms** (cards/blocks)
   - Behavior: Fast initial acceleration with smooth, asymptotic zero-overshoot settling.
2. **Apple Under-Damped Momentum / Shuffle Spring (`damping: 0.85`, `response: 0.36s`):**
   - Mapped Curve: `cubic-bezier(0.2, 0.8, 0.2, 1)`
   - Duration: **340 ms**
   - Behavior: Crisp tactile physical snap for card shuffling and button pop states.
3. **Linear Marquee:**
   - Easing: `linear`
   - Duration: **32.0 s** per full loop (`transform: translate3d(-50%, 0, 0)`).

---

## 4. Master First-Viewport-Entry Motion Matrix

### Guiding Principles & Invariants
1. **Per-Element Viewport Entry Triggering:**
   Every non-heading element/island/text triggers its first-entry animation **when it enters the viewport independently** via its own `IntersectionObserver` registration in `v6-entrance.ts`.
   *Elements are NOT blanket-gated on heading completion.* Section headings type out on their own schedule; non-heading components animate when their own bounding box enters the active viewport area.
2. **Strictly Once Per Document Lifecycle:**
   Maintained by `createOnceLedger(ids)` in `src/lib/v6-entrance-state.mjs`. When an entrance completes, its ledger state is locked to `done`. Scrolling back up, theme toggling, or hash navigation never replays entrance animations.
3. **Zero Layout Shifts (CLS = 0):**
   Animations operate exclusively on compositor properties (`translate`/`transform` and `opacity`). CSS layout containers maintain their full intrinsic geometry at all times.
4. **Reduced Motion Respect:**
   When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true, all entrance animations resolve immediately (`duration: 0ms`), elements render in final resting states, and background drift/grid animations are completely disabled.
5. **Locale & Hash Navigation Resilient:**
   `syncV6HeadingText(locale)` updates text content without re-animating completed entries. Deep linking to hashes (e.g., `#experience`) triggers immediate visibility for target elements.

### Master Motion Specification Table

| Section | Target Selector / Element | Trigger Condition | Motion Type | Duration | Easing | Stagger / Delay | Hardware Layer Hint |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero (#about)** | `#page-title` | Viewport entry (threshold 0.1) | Grapheme typing | Adaptive (~1.2s) | Linear step | 0 ms | Text compositor |
| **Hero (#about)** | `.hero__field` | Independent viewport entry | Fade-slide up (`y: 12px -> 0`) | 480 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | `will-change: transform` |
| **Hero (#about)** | `.hero__intro` | Independent viewport entry | Soft fade-in (`opacity: 0 -> 1`) | 540 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | Compositor |
| **Hero (#about)** | `.hero-fact` cards | Independent viewport entry | Cascading pop (`scale: 0.94 -> 1`, `y: 14px -> 0`)| 460 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **80 ms** | `will-change: transform` |
| **Hero (#about)** | `.hero__actions button, a`| Independent viewport entry | Elevation (`y: 10px -> 0`, fade) | 420 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **60 ms** | Compositor |
| **Hero (#about)** | `.hero-portrait` (Lanyard) | Independent viewport entry | Physics impulse (`vx += 0.7, wz += 1.2`), canvas unveil | Continuous physics | Rapier/Three.js Verlet | Preflight verified | WebGL Canvas |
| **Hero (#about)** | About Outlined Name Marquee| Viewport entry | Continuous horizontal drift | 32.0 s / loop | `linear` infinite | 0 ms | `will-change: transform` |
| **Hero (#about)** | About Technical Grid | Viewport entry | Canvas mesh rendering + elastic mouse pull | Real-time RAF | Exponential decay (`0.88`) | 0 ms | Canvas context |
| **Projects (#projects)** | `.project-category-tabs` | Independent viewport entry | Slide-in from left (`x: -16px -> 0`, fade)| 420 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | Compositor |
| **Projects (#projects)** | `.project-slide` cards | Independent viewport entry | Coordinated wave (`y: 24px -> 0`, `scale: 0.98 -> 1`)| 580 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **100 ms** | `will-change: transform` |
| **Skills (#skills)** | `.skill-card` (Accordion) | Independent viewport entry | Lateral unfolding (`x: 20px -> 0`, fade) | 520 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **60 ms** | Compositor |
| **Skills (#skills)** | `.software-tile` (Glass) | Independent viewport entry | Specular zoom (`scale: 0.9 -> 1`, fade) | 400 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`| Stagger **40 ms** | Layer promoted |
| **Education (#education)** | `.education-timeline` track | Independent viewport entry | Line draw (`scaleY: 0 -> 1`, origin top) | 650 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`| 0 ms | `transform-origin: top` |
| **Education (#education)** | `.education-entry` (Formal) | Independent viewport entry | Slide from left (`x: -24px -> 0`, fade) | 480 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **120 ms** | Compositor |
| **Education (#education)** | `.education-entry` (Non-formal)| Independent viewport entry | Slide from right (`x: 24px -> 0`, fade) | 480 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **120 ms** | Compositor |
| **Experience (#experience)**| `[data-experience-stage]` | Independent viewport entry | 3D depth reveal (`z: -50px -> 0px`, fade) | 680 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | 3D Stage context |
| **Experience (#experience)**| `.experience-slide__copy` | Carousel settled | Synchronous reveal (no lag) | Instantaneous | Discrete display switch | 0 ms | Content text |
| **Competitions (#competitions)**| `.competition-row:nth-child(even)`| Independent viewport entry | Left-text fade (`x: -20px`), Right-deck fade (`x: +20px`)| 560 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Deck delay +100 ms | Compositor |
| **Competitions (#competitions)**| `.competition-row:nth-child(odd)` | Independent viewport entry | Left-deck fade (`x: -20px`), Right-text fade (`x: +20px`)| 560 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Text delay +100 ms | Compositor |
| **Competitions (#competitions)**| `.competition-card__media-deck` | Click / Tap / Space | Deck shuffle: top card translates out (`+24px, -14px, +5deg`), next springs front | 340 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`| 0 ms | `will-change: transform` |
| **Credentials (#credentials)**| `.credential-card` | Independent viewport entry | Staggered card lift (`y: 18px -> 0`, fade) | 480 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Stagger **80 ms** | Compositor |
| **Credentials (#credentials)**| `GlareHover` Specular Streak | Certificate enters viewport (0.4) | Single diagonal streak sweep (-45°) | 650 ms | React Bits smootherstep ease | Per-card viewport entry | CSS mask layer |
| **Contact (#contact)** | `.contact-section__eyebrow` | Independent viewport entry | Slide-down (`y: -8px -> 0`, fade) | 380 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | Compositor |
| **Contact (#contact)** | `.email-card` | Independent viewport entry | Tactile expand (`scale: 0.96 -> 1.0`, fade) | 480 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 0 ms | Layer promoted |
| **Contact (#contact)** | `.social-links a` | Independent viewport entry | Cascading pop (`y: 10px -> 0`, `scale: 0.9 -> 1`)| 380 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`| Stagger **50 ms** | Compositor |

---

## 5. Section Architecture: Competitions & Achievements (`#competitions`)

### Section Placement & Narrative Logic
- **Location:** Placed directly after Experience (`#experience`) and immediately before Credentials (`#credentials`).
- **Narrative Flow:**
  1. *About (`#about`)*: Introduction to Muhammad Fajar Sodik, core identity, and 3D lanyard.
  2. *Projects (`#projects`)* & *Skills (`#skills`)*: Core technical systems, robotics, IoT, and software capabilities.
  3. *Education (`#education`)* & *Experience (`#experience`)*: Academic foundation and professional hotel OJT / organizational leadership.
  4. *Competitions & Achievements (`#competitions`)*: Competitive engineering trials, hackathons, and innovation contests under time pressure.
  5. *Credentials (`#credentials`)*: Formal professional certifications (BNSP, PPSDM KEBTKE) validating proven technical qualifications.
  6. *Contact (`#contact`)*: Direct collaboration and hiring channels.
- **Navigation Update:**
  In `src/components/HomePageV3.astro`, add navigation item between Experience and Credentials:
  `{ key: 'nav.competitions', href: '#competitions' }`
  Bilingual labels in `src/lib/i18n.ts`:
  * Indonesian (`id`): `"Kompetisi"`
  * English (`en`): `"Competitions"`

### Alternating Editorial Layout
- **Desktop (≥ 1024px):**
  - Container: `.section-block.content-shell.competitions-section#competitions`.
  - Header: Bilingual eyebrow (`data-v6-enter="competitions:eyebrow"`), typing H2 heading (`data-v6-heading data-v6-type data-v6-enter="heading:competitions"`: *"Kompetisi & Prestasi"* / *"Competitions & Achievements"*), and introductory paragraph.
  - Alternating Rows:
    * **Row 1 (Index 0):** Text Column on Left (52%), Photo Deck on Right (48%).
    * **Row 2 (Index 1):** Photo Deck on Left (48%), Text Column on Right (52%).
    * **Row 3 (Index 2):** Text Column on Left (52%), Photo Deck on Right (48%).
  - Dividing Lines: Subtle border dividers (`border-bottom: 1px solid var(--line)`) with `padding-block: 2.75rem`.
- **Tablet & Mobile (< 1024px):**
  - Collapses to a unified single column per competition entry: Photo Deck on top (full width, 16:10 aspect ratio), followed by title, tier badge, organizer, date, and description below.

### Interactive Multi-Photo Card Stack (Tactile Deck Shuffle)
- **Component HTML/CSS Structure:**
  ```html
  <div class="competition-card__media-deck" role="region" aria-roledescription="carousel" tabindex="0" data-active-index="0" data-total-photos="3">
    <div class="competition-card__stack">
      <figure class="competition-photo-card" data-card-index="0">
        <img src="/assets/placeholders/experience-electrical-competition.svg" alt="..." loading="lazy" decoding="async" />
      </figure>
      <figure class="competition-photo-card" data-card-index="1">
        <img src="/assets/placeholders/experience-ksm-mekatronika.svg" alt="..." loading="lazy" decoding="async" />
      </figure>
      <figure class="competition-photo-card" data-card-index="2">
        <img src="/assets/placeholders/experience-ksm-iot.svg" alt="..." loading="lazy" decoding="async" />
      </figure>
    </div>
    <div class="competition-photo-counter" aria-hidden="true">
      <svg viewBox="0 0 20 20" class="competition-photo-counter__icon"><path d="M4 4h12v12H4zM2 7h2v10h10v2H2z"/></svg>
      <span class="competition-photo-counter__text">1 / 3</span>
    </div>
  </div>
  ```
- **Deck Layering Mechanics:**
  * Active Front Card (`activeIndex`):
    `z-index: 3; transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; pointer-events: auto;`
  * Peek Card 1 (`(activeIndex + 1) % N`):
    `z-index: 2; transform: translate3d(8px, 6px, -8px) rotate(2.5deg); opacity: 0.88; filter: brightness(0.92); pointer-events: none;`
  * Peek Card 2 (`(activeIndex + 2) % N`):
    `z-index: 1; transform: translate3d(-6px, 10px, -16px) rotate(-2deg); opacity: 0.65; filter: brightness(0.82); pointer-events: none;`
- **Click / Tap Transition:**
  * When user clicks or presses `Space`/`Enter` on the deck:
    1. Top card translates outward: `transform: translate3d(24px, -14px, 0) rotate(5deg) scale(0.96); opacity: 0.4;` over **140 ms**.
    2. At apex, top card drops z-index to `1`, while next card springs forward to `z-index: 3` (`translate3d(0, 0, 0) rotate(0deg) scale(1)`).
    3. Old front card settles into back peek position over **220 ms** (`cubic-bezier(0.2, 0.8, 0.2, 1)`).
    4. Total transition duration: **340 ms** (matching Video 1 transition frames 52–62).
- **Affordance & Counter:**
  * Pill badge `.competition-photo-counter`:
    `background: rgba(18, 18, 20, 0.72); backdrop-filter: blur(8px); color: #fff; border-radius: 999px; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 600;`
  * Hover state: Card scales slightly (`scale: 1.015`) and counter brightens, indicating interactivity.
  * Keyboard navigation: Focused deck listens for `Space`, `Enter` (next photo), `ArrowRight` (next photo), and `ArrowLeft` (previous photo).
  * Accessible label: localized `aria-label="Foto kompetisi {title}. Foto {current} dari {total}. Tekan Spasi atau Enter untuk beralih foto."`.

### Status Hierarchy & Encouraging Non-Win Badges
In accordance with user clarification, records include both successful achievements and active participation. Unsuccessful entries must never display demoralizing labels (e.g., "Kalah" / "Lost"), but rather professional, growth-oriented status phrases.

| Tier | Indonesian Badge (`id`) | English Badge (`en`) | Visual Styling |
| :--- | :--- | :--- | :--- |
| **Tier 1: Top Win (Gold)** | **Juara 1** | **1st Place** | Amber/gold accent border (`color-mix(in srgb, #f59e0b 35%, var(--line))`), gold tinted badge, champion trophy icon. |
| **Tier 2: Special Award** | **Prototipe Terbaik** | **Most Promising Prototype** | Emerald/cyan border (`#10b981`), glowing accent tint, medal icon. |
| **Tier 3: Finalist** | **Finalis Nasional** | **National Finalist** | Indigo border (`#6366f1`), refined neutral glass tint, star icon. |
| **Tier 4: Active Contender** | **Partisipan Aktif** | **Active Participant** | Slate neutral border (`var(--line)`), clean technical typography, shield icon. |
| **Tier 4: Solution Dev** | **Pengembangan Solusi** | **Solution Contender** | Muted cyan pill, gear/circuit icon. |
| **Tier 4: Innovation** | **Eksplorasi Inovasi** | **Innovation Contender** | Muted violet pill, lightbulb/pulse icon. |

### 4 Dummy Records Schema (3 + 1 Horizontal Pagination)
The brief explicitly authorizes **4 dummy records using existing image assets** to validate horizontal pagination (3 records on Page 1, 1 record on Page 2). All dummy entries are visibly tagged as testing examples.

- **Content Schema (`src/content/competitions/`):**
  ```ts
  export interface CompetitionEntry {
    id: string;
    order: number;
    isDummy: boolean; // Explicit flag ensuring no claim of real victory
    title: { id: string; en: string };
    organizer: { id: string; en: string };
    date: { start: string; end?: string; label: { id: string; en: string } };
    status: {
      tier: 'win' | 'special' | 'finalist' | 'participant';
      badge: { id: string; en: string };
    };
    description: { id: string; en: string };
    photos: Array<{ src: string; alt: { id: string; en: string } }>;
  }
  ```

- **Authorized Test Records (Using Existing Image Assets):**
  1. **Record 1 (Tier 1 Win — Page 1, Index 0):**
     - *Title:* National Mechatronics & Automation Olympiad 2025
     - *Organizer:* Badan Kerjasama Otomasi Industri Indonesia
     - *Date:* Oktober 2025
     - *Status:* Tier `win` → *"Juara 1 / 1st Place"*
     - *Photos:*
       * Photo 1: `/assets/placeholders/experience-electrical-competition.svg`
       * Photo 2: `/assets/placeholders/experience-ksm-mekatronika.svg`
       * Photo 3: `/assets/placeholders/experience-ksm-iot.svg`
     - *Badge:* `[Data Contoh / Test Record]`
  2. **Record 2 (Tier 2 Special Award — Page 1, Index 1):**
     - *Title:* IoT Energy & Smart Building Hackathon 2025
     - *Organizer:* Forum Energi Terbarukan & Industri Cerdas
     - *Date:* Agustus 2025
     - *Status:* Tier `special` → *"Prototipe Terbaik / Most Promising Prototype"*
     - *Photos:*
       * Photo 1: `/assets/projects/smart-trash-bin.webp`
       * Photo 2: `/assets/projects/aquasync-ph-stabilizer.webp`
     - *Badge:* `[Data Contoh / Test Record]`
  3. **Record 3 (Tier 4 Encouraging Non-Win — Page 1, Index 2):**
     - *Title:* Indonesia Autonomous Robotics Challenge (IARC) 2024
     - *Organizer:* Institut Teknologi Sepuluh Nopember (ITS)
     - *Date:* November 2024
     - *Status:* Tier `participant` → *"Eksplorasi Inovasi / Innovation Contender"*
     - *Description (ID):* *"Mengembangkan purwarupa navigasi robot otonom dan integrasi sensor ultrasonik dalam arena labirin berkecepatan tinggi."*
     - *Description (EN):* *"Developed an autonomous maze-navigation robot prototype with ultrasonic sensor integration under high-speed trial conditions."*
     - *Photos:*
       * Photo 1: `/assets/projects/fuzzy-fire-suppression.webp`
       * Photo 2: `/assets/projects/lora-sentinel.webp`
       * Photo 3: `/assets/placeholders/project-desktop-pos.svg`
     - *Badge:* `[Data Contoh / Test Record]`
  4. **Record 4 (Tier 4 Encouraging Non-Win — Page 2, Index 0):**
     - *Title:* Industrial Cyber Security & PLC CTF Challenge 2024
     - *Organizer:* Komunitas Otomasi & Keamanan Kontrol Siber
     - *Date:* Mei 2024
     - *Status:* Tier `participant` → *"Pengembangan Solusi / Solution Contender"*
     - *Description (ID):* *"Merancang pertahanan logika kontrol PLC terhadap anomali injeksi paket data jaringan Modbus TCP."*
     - *Description (EN):* *"Implemented PLC ladder logic defenses against Modbus TCP network packet injection anomalies."*
     - *Photos:*
       * Photo 1: `/assets/placeholders/certificate-preview.svg`
       * Photo 2: `/assets/placeholders/skill-pcb.svg`
     - *Badge:* `[Data Contoh / Test Record]`

- **Horizontal Pagination Component (`data-competition-pagination`):**
  - Architecture mirrors `src/lib/credential-pagination.ts`:
    * Page 1 displays records 0, 1, 2.
    * Page 2 displays record 3.
  - Controls: Prev / Next arrow buttons with minimum 44×44px hit bounds, page count display (`"Halaman 1 dari 2"` / `"Page 1 of 2"`), and visual dots.
  - Horizontal Transition: Track shifts horizontally by `100%` with smooth deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`, duration **400 ms**).
  - Keyboard & Gesture: ArrowLeft / ArrowRight keys navigate pages; horizontal touch swipe with angle disambiguation (`Math.abs(dx) > Math.abs(dy) * 1.5`) navigates pages on mobile.

---

## 6. React Bits GlareHover Integration & Island Optimization

### Registry Payload Verification
- **Source URL:** `https://reactbits.dev/r/GlareHover-JS-CSS.json`
- **Durable Backup:** `.checkpoints/v7-planning-pause-2026-11-06/planner-complete/external/GlareHover-JS-CSS.json`
- **Dependencies:** **0 external npm dependencies.** Uses native browser Web APIs (`ResizeObserver`, `IntersectionObserver`, `color-mix(in srgb, ...)`).
- **True Source Props (from `GlareHover.jsx`):**
  `width`, `height`, `background`, `borderRadius`, `borderColor`, `children`, `glareColor`, `glareOpacity`, `glareAngle`, `glareSize`, `softness`, `variant`, `blendMode`, `rimGlint`, `mode`, `transitionDuration`, `interval`, `playOnce`, `intro`, `className`, `style`.

### Island Overhead & Architecture Decision
In Astro, mounting 6 individual `<GlareHover client:visible>` islands creates 6 separate React roots, 6 `ResizeObserver` instances, and 6 `IntersectionObserver` instances.
To optimize runtime performance and bundle efficiency:

- **Recommended Strategy (Single Unified Gallery Island or Vanilla Port):**
  * *Option 1 (Unified React Island):* Mount a single `CredentialGlareGallery.jsx (client:visible)` that wraps the certificate cards, applying GlareHover under one shared React context and batch observer.
  * *Option 2 (Headless Web API Implementation):* Because `GlareHover.jsx` has ZERO dependencies and runs on ~60 lines of native DOM RAF and pointer listeners, implement a lightweight vanilla client script (`src/scripts/glare-hover.ts`) matching the exact React Bits algorithm. This attaches directly to Astro's rendered `.credential-card figure` elements, completely eliminating React island hydration overhead for certificates.
  * Both options maintain 100% fidelity to React Bits GlareHover visual mechanics.

### Exact Configuration Mapping
Applying the user's requested configuration:

```jsx
<GlareHover
  width="100%"
  height="100%"
  background="transparent"
  borderRadius="14px"
  borderColor="transparent"
  mode="hover"
  variant="streak"
  glareColor="#ffffff"
  glareOpacity={0.5}
  glareSize={30}
  softness={0.6}
  glareAngle={-45}
  blendMode="screen"
  rimGlint={true}
  transitionDuration={650}
  intro={true}
  playOnce={false}
  className="credential-glare-wrapper"
  style={{ maxWidth: '360px', aspectRatio: '1.64' }}
>
  <img
    src={certificate.src}
    alt={certificate.name}
    width={certificate.width}
    height={certificate.height}
    loading="lazy"
    decoding="async"
    className="credential-image"
  />
</GlareHover>
```

### Outer Sizing Adaptation & Viewer Protection
1. **Responsive Card Geometry:**
   - In `src/styles/v3.css`, `.credential-card figure` has `height: clamp(164px, 18vh, 220px)` on desktop and `132px` on mobile with `aspect-ratio: 1.64`.
   - Passing `width="100%"` with `style={{ maxWidth: '360px', height: '100%' }}` ensures the GlareHover container matches the figure's exact dimensions across all breakpoints without causing horizontal scroll or card overflow.
   - The inner image retains `object-fit: contain; object-position: center; width: 100%; height: 100%;`, preserving original certificate proportions without distortion.
2. **First-Entry Sweep + Hover Continuity:**
   - Because `intro={true}` is set, `GlareHover`'s internal `IntersectionObserver` detects when the certificate enters 40% of the viewport (`threshold: 0.4`) and executes `sweep(1)` once.
   - Because `mode="hover"` and `playOnce={false}` are set, subsequent pointer moves across the card trigger directional streak sweeps.
3. **Pointer Transparency & Click Propagation:**
   - GlareHover's `.glare-hover__glare` has `pointer-events: none` in CSS.
   - The parent `<a class="credential-card" data-credential-open ...>` retains unobstructed click capture, ensuring the full-screen modal viewer and PDF download flow continue functioning with zero regressions.

---

## 7. About Section Dynamic Enhancements

### A. Moving Outlined Name Text ("Muhammad Fajar Sodik")
- **Visual Design & Typography:**
  - Repeated text track: `MUHAMMAD FAJAR SODIK · MUHAMMAD FAJAR SODIK · `
  - Typography: `font-family: var(--font-heading); font-size: clamp(4.5rem, 9vw, 7.5rem); font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1; white-space: nowrap;`
  - Stroke Rendering:
    * Interior fill: `color: transparent; fill: transparent;`
    * Light mode stroke: `-webkit-text-stroke: 1.5px rgba(24, 24, 27, 0.11);`
    * Dark mode stroke: `-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.13);`
- **Spatial Placement & Layer Isolation:**
  - Absolute horizontal track positioned in the middle third of `#about` (`top: 48%; transform: translateY(-50%); width: 100%; overflow: hidden; pointer-events: none; user-select: none;`).
  - Layering: `z-index: 0;`. Sits **behind** `.hero__copy` (`z-index: 2`) and **behind** `.hero-portrait` (`z-index: 3`).
- **Motion Kinetics & Battery Hygiene:**
  - Hardware-accelerated CSS marquee translation `transform: translate3d(-50%, 0, 0)` looping infinitely.
  - Duration: **32.0 seconds** per loop (calibrated stately drift: alive, but completely subordinate to reading content).
  - Offscreen Suspension: An `IntersectionObserver` pauses the marquee (`animation-play-state: paused`) whenever `#about` scrolls out of the visible viewport.
  - Tab Inactivity: `document.addEventListener('visibilitychange')` pauses the marquee when the browser tab is hidden.
  - Reduced Motion: If `prefers-reduced-motion: reduce` is active, the marquee is static (`animation: none`), resting as a subtle background architectural watermark.

### B. Cursor-Distorted Technical Grid
- **Design Inspiration & Calibration:**
  - Inspired by the Fahrez reference screenshot (`/tmp/orca-paste-1793951029459-8c1558f9-d436-487b-b19c-6fa2b39e1140.png`).
  - Rendered on a lightweight `<canvas>` element scoped to `#about` background.
  - Grid cell spacing: 52px orthogonal mesh.
  - Line stroke:
    * Light mode: `rgba(24, 24, 27, 0.045)`
    * Dark mode: `rgba(255, 255, 255, 0.055)`
  - Intersection nodes: Subtle 2.5px dots at grid vertices.
- **Elastic Displacement Physics:**
  - Active influence radius: $R = 150\text{ px}$.
  - Max displacement: $D_{\max} = 9\text{ px}$.
  - Displacement pulls elastically towards cursor with quadratic falloff $\Delta = (1 - d/R)^2 \times D_{\max}$, smoothly returning to baseline via exponential decay (`0.88` per frame).
- **Lanyard Coexistence & Touch Fallback:**
  - **Pointer Transparency:** Grid canvas has `pointer-events: none !important; z-index: 0;`.
  - Pointer tracking attaches to `#about` using `{ passive: true }`. It **never** captures, intercepts, or delays mouse events.
  - **Lanyard Drag Suppression:** When the user grabs the 3D lanyard badge (`sim.grab !== null`), grid RAF animation is suspended, holding static lines so 100% of GPU rasterization focuses on Three.js card swinging.
  - **Mobile & Touch Fallback:** Touch devices (`(pointer: coarse)`) or viewports `< 768px` render a **static CSS technical grid** with zero JavaScript listeners and zero RAF loops.
  - **Accessibility:** Under `prefers-reduced-motion: reduce`, the grid is strictly static.

---

## 8. Implementation Guidelines & Risk Register for Luna

When Codex GPT-6 Luna max implements this design specification, the following architectural invariants must be preserved:

| Risk Area | Risk Factor | Required Implementation Strategy |
| :--- | :--- | :--- |
| **Compositor Contention** | Marquee + Grid Canvas + Three.js Lanyard running simultaneously in About. | Enforce layer isolation (`will-change: transform` only where necessary). Suspend marquee and grid RAF when `#about` leaves viewport. Freeze grid when Lanyard is grabbed. |
| **GlareHover Astro Islands** | Mounting 6 heavy React islands for certificates increases bundle size and hydration overhead. | Mount a single unified `CredentialGlareGallery.jsx` island or use the lightweight vanilla port (`glare-hover.ts`) matching React Bits algorithm. |
| **Transform Collisions** | WAAPI entrance animation overriding interactive deck shuffle or hover transforms. | Enforce two-layer DOM contract: outer wrapper owns entrance WAAPI (`translate`, `opacity`), inner card owns interactive transforms (`transform`, `rotate`, `scale`). |
| **Competition Data Disclaimers** | Recruiters might mistake dummy competition entries for real audited wins. | Include clear editorial disclaimer badges in the UI: `[Data Contoh / Test Record]`. Store data in dedicated `src/content/competitions/` collection. |
| **Pagination Gesture Conflicts** | Horizontal swipe on Competitions or Credentials conflicting with vertical scroll. | Employ gesture angle classification (`Math.abs(dx) > Math.abs(dy) * 1.5`) matching the coverflow algorithm in `v3-ui.ts`. |
| **CSS Specificity** | Overriding existing V6 entrance styles or resetting fallback visibility. | Respect the V6 bugfix invariant: `.hero-portrait[data-lanyard-state='ready'] .hero-portrait__fallback { opacity: 0; transition: none; }` must never be touched. |

---

## 9. Summary of Specification Deliverables

1. **`docs/V7-DESIGN-MOTION.md`:** Authoritative design and motion architecture specification.
2. **Evidence Manifest:** Persisted at `/tmp/v7-inspection/evidence-manifest.json` and mirrored in `.checkpoints/v7-planning-pause-2026-11-06/designer-complete/` with 80 base extracted frames from Video 1, 89 dense transition frames, 17 extracted frames from Video 2, inspected contact sheets, and decomposed React Bits GlareHover registry code.
3. **Status:** **RECONCILED DESIGN SPECIFICATION PROPOSAL COMPLETE.** Ready for coordinator sign-off and implementer handoff.
