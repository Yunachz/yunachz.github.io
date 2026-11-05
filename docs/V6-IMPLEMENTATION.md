# V6 implementation record — current

Date: 2026-11-05
Release status at snapshot capture: designer and coordinator gates passed on the frozen preview; scoped commit, push, and public deployment were pending.
Preview: `http://127.0.0.1:4321/` (keep this server running).
Working-tree baseline: `c59ad42e6e6321b9e1ba718339f3f06cfeba57c9`.

## Current architecture

- Astro remains a static site. The About portrait alone is an Astro React island using React/ReactDOM and Three.js `^0.180.0`; no R3F or framework migration was introduced. The personalized JavaScript/CSS Lanyard was fetched from the React Bits registry at `https://reactbits.dev/r/Lanyard-JS-CSS.json` (source SHA-256 `be3a04d16f87ddfc7a500ebf257bbedec9e963f64d8073de6eb47b5d2f77b278`). Its license and Commons Clause notice are in `src/components/lanyard/LICENSE.md`.
- `src/scripts/v6-entrance.ts` uses a document-lifetime `unseen → entering → done` ledger for home-page markers. The entrance layer uses WAAPI's independent `translate` property so V5 carousel/gallery transforms remain intact. Interactive wrappers receive a short, low-distance entrance; decorative carousel clones and offscreen/inactive states remain outside the entrance set. Existing V5 controllers and content collections remain in place.
- Each heading retains its complete localized source string for assistive technology and layout reservation; an `aria-hidden` grapheme copy reveals text progressively. Grapheme segmentation uses `Intl.Segmenter` with a combining-mark/emoji fallback. Heading records are prepared while ledger entries are still unseen, preventing initial entry from being misread as a replay. Locale changes update both layers without replaying completed entries. Reduced motion, width changes, hidden-tab changes, direct navigation, and user interaction finish the active work safely.
- `HomePageV3.astro` replaces only the About portrait. The front photo, localized alt text, card back, and woven strap are local assets; the regular portrait remains available for reduced motion, no JavaScript, image failure, WebGL failure, or context loss. The About wrapper lazy-loads Three only after its visibility and motion checks, and has a bounded failure timeout.
- `src/components/lanyard/Lanyard.jsx` retains the upstream canvas physics, raycast hit testing, pointer capture, drag/reversal, and tap-to-flip behavior. Adaptations add readiness/error reporting, local-face load checks, responsive framing, mobile `pan-y`, pause on offscreen/document-hidden/context-lost states, cancellation for Escape/pointercancel/lost capture, and full listener/geometry/material/texture/renderer cleanup. Resize updates canvas dimensions but only render when the scene is visible.
- The default card is positioned by the responsive About wrapper's initial strap target; the rendered drag surface is a separate expanded, absolutely positioned stage. At 1440×1000, About measures y=73–863 and the default card bounds measured y=98–626. At 390×844, About measures y=69–1101 and the default card bounds y=214–407. The stage extends through the start of Projects, but creates no layout height and remains unclipped vertically, so pointer capture can carry a drag past About. Horizontal overflow was absent from the 320–1920px matrix.

## Current source changes

Application files: `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `src/components/HomePageV3.astro`, `src/layouts/PortfolioLayoutV3.astro`, `src/scripts/v3-ui.ts`, `src/scripts/v6-entrance.ts`, `src/lib/v6-entrance-state.mjs`, `src/styles/v3.css`, `src/data/lanyard.ts`, `src/components/AboutLanyard.jsx`, `src/components/lanyard/Lanyard.jsx`, `src/components/lanyard/Lanyard.css`, `src/components/lanyard/LICENSE.md`, `public/assets/lanyard/card-back.svg`, `public/assets/lanyard/strap-weave.svg`, and `tests/v6-entrance.test.mjs`. `docs/CONTENT-GUIDE.md` and `docs/V6-QA.md` document the new source and verification.

## Prior checkpoint details (superseded)

Date: 2026-11-04
Baseline: `c59ad42e6e6321b9e1ba718339f3f06cfeba57c9`
Scope: additive once-only entrances on the home page and the About portrait replacement.

## Architecture

- Kept Astro static rendering and the existing V5 page, interaction controllers, copy, and content collections. Added `@astrojs/react` and React 19 only for the About island, plus Three.js `^0.180.0`. No React migration, R3F, Rapier, GLB, or animation framework was added.
- `src/scripts/v6-entrance.ts` owns home-only reveals. A document-lifetime ledger moves each marked region from `unseen` to `entering` to `done`; it is not persisted and never rearms on scrolling, locale changes, filter/pager changes, dialogs, theme changes, or BFCache restoration.
- Markers are on independent wrappers around the hero copy/portrait, section headings, education records, skill panel, experience caption, credential viewport, and contact blocks. Project/experience slides, skill labels/details, credential track, and controls are not entrance targets. Regions use finite WAAPI fade and 14px rise with no permanent hidden CSS state.
- Heading text keeps a full canonical accessible string in the layout. While typing, an `aria-hidden` visual copy reveals grapheme clusters; the two layers occupy the same grid cell. `Intl.Segmenter` is used where available, with a combining-mark/emoji fallback. Locale changes rebuild the visual layer in the same turn, and an active heading finishes on resize or reduced-motion changes.
- Reduced motion at initialization consumes all pending reveals immediately. A live change to reduce finishes active and pending reveals. A hidden document finishes only active work. Direct anchors and pointer/focus interaction finish their target region synchronously.

## About Lanyard

- The only portrait replacement is scoped to `figure.hero-portrait` in `HomePageV3.astro`. The old arch, portrait frame, 172px mobile slot, and portrait-box confinement are removed. The Lanyard stage starts flush below the sticky header and is bounded by the About section. Final production geometry measured 397×620px at 1440×1000 (figure y=73px), 399×540px at 1366×854, 336×486px at 800×900, 340×380px at 390×844, and 288×320px at 320×640. Each stage began at the header’s lower edge, had zero horizontal overflow, and ended before Projects. The Astro `astro-island` wrapper and its React child both fill the reserved stage; this is required because the React root is nested below the custom element.
- `AboutLanyard.jsx` is an SSR-safe wrapper. Astro hydrates it with `client:visible`; the wrapper checks reduced motion before dynamically importing Three.js. A 12-second initialization timeout, image/import errors, WebGL creation/render errors, and context loss retain the regular portrait. Reduced motion unmounts the simulation; switching back does not replay the Lanyard intro after it has started once.
- `Lanyard.jsx` and `Lanyard.css` were fetched from the React Bits JavaScript/CSS Lanyard registry source at `https://reactbits.dev/r/Lanyard-JS-CSS.json` (registry SHA-256 `be3a04d16f87ddfc7a500ebf257bbedec9e963f64d8073de6eb47b5d2f77b278`). The component source keeps its spring simulation, raycast hit testing, drag, and tap-to-flip behavior. Necessary local adaptations add readiness/error callbacks, require both configured card faces to load, treat the first rendered textured frame as ready, stop on document hiding/offscreen/context loss, reject secondary pointers, cancel an active grab on Escape, pointercancel, lost pointer capture, pause, and teardown, and dispose resources/listeners on unmount. Unexpected capture loss clears grab/press/cursor without triggering a flip. The stylesheet is scoped under `.about-lanyard`.
- `src/data/lanyard.ts` owns the local front/back/strap paths and visual options. The front uses the existing portrait asset without changing its bytes. The back contains only the name, verified student description, and existing portfolio domain; the strap is local SVG. Both SVG assets live under `public/assets/lanyard/`.
- `src/components/lanyard/LICENSE.md` carries the upstream MIT + Commons Clause notice and source link. The upstream terms allow use in a commercial site but prohibit selling, sublicensing, or redistributing the component itself.

## Production verification

- Final build `dist/index.html` SHA-256 is `5f1859172510141c538ca5cdb6e583f1d24f861fbda38bcce69b28328133a5b1`; the fetched preview body matches exactly. The lazy `Lanyard.CCVkWvpT.js` is 541,603 bytes. Astro remains static with seven generated routes.
- Brave/SwiftShader reports WebGL 2 and ANGLE/SwiftShader. A stable canvas hit confirms drag, reversal, and release; an isolated quick tap measures 1.3ms from `pointerdown` to `pointerup` and the final screenshot shows the local badge back. Escape, pointercancel, native lost-capture, and route teardown clear active state/capture as intended. Reduced-motion and forced-WebGL-failure runs retain the accessible portrait fallback.
- A same-window tab switch sets `document.hidden=true`; resizing while hidden adds zero RAFs and zero WebGL draws, and returning resumes rendering. A real touch beginning on the Lanyard canvas scrolls mobile from 0 to 209. The baseline viewport matrix through 320px–1920px had no horizontal overflow. Entrance traces show `unseen → entering → done` once; completed headings stay done after scrolling and locale changes.
- The final detector reported one Geist overused-font warning. Geist remains because the V5 brief and root design system explicitly require preserving it. Full test, fallback, V5 regression, HTTP asset, CLS, and byte-hash results are recorded in `docs/V6-QA.md`.

## Changed files

`astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `src/components/HomePageV3.astro`, `src/layouts/PortfolioLayoutV3.astro`, `src/scripts/v3-ui.ts`, `src/scripts/v6-entrance.ts`, `src/lib/v6-entrance-state.mjs`, `src/styles/v3.css`, `src/data/lanyard.ts`, `src/components/AboutLanyard.jsx`, `src/components/lanyard/Lanyard.jsx`, `src/components/lanyard/Lanyard.css`, `src/components/lanyard/LICENSE.md`, `public/assets/lanyard/card-back.svg`, `public/assets/lanyard/strap-weave.svg`, `tests/v6-entrance.test.mjs`, `docs/CONTENT-GUIDE.md`, `docs/V6-QA.md`, and this document.
