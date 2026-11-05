# V6 QA checkpoint — current

Date: 2026-11-05
Status at snapshot capture: **designer and coordinator gates passed; scoped commit, push, and public deployment were pending.**
Preview: `http://127.0.0.1:4321/` (server remains available).
Coordinator review: PASS on this exact HTML SHA-256; Antigravity Gemini 3.8 Flash passed the requested criteria. The coordinator noted caveman was unavailable and the requested design skills were used.
Production build HTML SHA-256: `ed86f67ce520ea8bb43b209ee72c3fb57814c39511e9aa8a23a320e89cb831d2` (120,069 bytes). Lazy `Lanyard.iepRmZay.js`: 542,597 bytes, SHA-256 `7e7e9de644897a88796661dd7cd3434f28ef939bb6e10828a3357243c4f4d7e8`. Astro generated seven static routes. The build retains Vite's >500 kB minified-chunk advisory.

## Current verification

- `npm test`: 36/36 passed. `npm run check`: 0 errors, 0 warnings, 3 hints (two deprecated `MediaQueryList.addListener/removeListener` fallbacks in `AboutLanyard.jsx`, and the existing `document.execCommand` fallback). `npm run build`: passed, seven static routes. `impeccable detect --json` ran once and returned the existing Geist overused-font warning; V5 and the project design system require Geist.
- Production Brave/SwiftShader matrix covered 320×640, 390×844, 768×900, 800×900, 1366×854, 1440×1000, and 1920×1200. Every viewport had no horizontal overflow. The About figure stayed within its layout box; the expanded canvas stage intentionally extends past About to support a downward drag. At 1440×1000, About is y=73–863 and the stage is y=73–1093. At 390×844, About is y=69–1101 and the stage is y=69–1279.
- Desktop rendered pose probe measured the card within About at 1440×1000 (card y≈98–626); the mobile probe measured y≈214–407 within About. A CDP drag started at y=328, crossed Projects' y=863 boundary to y=897, reversed direction, and retained pointer capture. A real touch beginning on the mobile card surface scrolled from `scrollY=0` to `209`; computed `touch-action` was `pan-y`.
- The dedicated tap test recorded `pointerdown → gotpointercapture → pointerup → lostpointercapture` with 1.4 ms between down/up, and `lanyard-tap-final.png` shows the personalized local card back. Drag/hold/reversal/release, Escape, synthetic `pointercancel`, native lost-capture, and route teardown are in `browser-interactions-final.json`; navigating away removed the canvas. After the offscreen observer settled, the scene produced zero WebGL draws over the next 300 ms. The separate same-window hidden-tab report recorded `document.hidden=true`; hidden resize added zero RAFs/draws and returning resumed rendering.
- Production WebGL reached `ready` with one canvas on WebGL 2 / ANGLE SwiftShader (software). Reduced motion returned `reduced` with no canvas and the localized portrait visible; forced WebGL failure returned `error` with the portrait fallback visible. No JavaScript left the complete readable copy and portrait in place, with direct CV links available. Home, portrait, local card/strap, lazy chunk, and CV assets returned HTTP 200 in the baseline browser report.
- The entrance trace confirmed the H1 moves through `unseen → typing → done`; grapheme counts advance monotonically and the hero trace passed its progression gate. Full localized accessible heading text is retained independently of the `aria-hidden` grapheme copy. Direct `#contact` and `#credentials` navigation brought the target headings and GitHub marker to `done`; the end-of-page scan also completed header/footer required markers. Twenty-four markers stayed unseen because they belonged to inactive carousel items, nonactive software tabs, or the second credential sample page; they remain eligible if they become visible.
- V5 browser regression passed ticker pause/resume, category filtering, project dialog, skills hover/keyboard/touch, experience drag/reversal/regrab/wrap, credential pagination/dialog/download, email clipboard success/failure/locale, and Indonesian/English CV selection. Clipboard results used a deterministic in-page stub.
- Cold-load layout shift was 0.0011766895 across two entries. The recorded sources were header controls and a small hero-copy font/layout substitution; the entrance heading layers and portrait slot retain their full layout reservation. No horizontal overflow was observed; strict zero CLS is not claimed. Canvas verification used SwiftShader, not a hardware GPU.
- Portrait and CV bytes are unchanged: portrait `7f02f1dce947a8d79a2f19d9839a8eda07237180d536ec4e1258b6aff609caa5`; Indonesian CV `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b`; English CV `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6`.

## Preview evidence

All current production-browser artifacts are in `.checkpoints/v6-2026-11-04-qa/`: `browser-baseline.json`, `browser-interactions-final.json`, `browser-lanyard-tap.json`, `browser-hidden-tab.json`, `browser-v5-regression.json`, `preview-final-home.json`, `preview-final-home-1440.png`, `lanyard-idle.png`, `lanyard-held-drag.png`, `lanyard-release.png`, `lanyard-flipped.png`, `mobile-resting-position.png`, `mobile-touch-scroll.png`, `reduced-motion.png`, `no-js.png`, and `webgl-fallback.png`. Preview screenshots were captured from the built production output at `http://127.0.0.1:4321/`.

Coordinator gate: PASS on the exact frozen preview SHA above. Keep the preview available; the scoped commit, push, and public deployment remain the release steps.

## Previous checkpoint results (superseded)

Date: 2026-11-04
Status: **final preview ready for designer review and coordinator acceptance. No files are staged; commit, push, and publication are pending those gates.**
Preview: `http://127.0.0.1:4321/` (kept running).
Final build: `dist/index.html` SHA-256 `5f1859172510141c538ca5cdb6e583f1d24f861fbda38bcce69b28328133a5b1`; fetched preview HTML matches exactly. Lazy `Lanyard.CCVkWvpT.js` is 541,603 bytes. Build completed 2026-11-04 21:45:41 Asia/Jakarta from working tree based on HEAD `c59ad42e6e6321b9e1ba718339f3f06cfeba57c9`.

## Final resumed validation (2026-11-04)

- `npm test`: 35/35 passed. `npm run check`: 0 errors, 0 warnings, 3 hints. `npm run build`: passed; seven static routes generated. The build retains the Vite >500 kB chunk warning.
- Brave/SwiftShader production browser: Lanyard reached `ready` with WebGL 2 and one canvas. The settled 1440×1000 screenshot records About at x=140,y=73, 1160×790; canvas 397×620; Projects starts at y=863. Prior viewport matrix at 320, 390, 768, 800, 1366, 1440, and 1920px had no horizontal overflow.
- Final isolated tap measured 1.3ms from `pointerdown` to `pointerup`; the screenshot shows the personalized local reverse. Drag/reversal/release, Escape, pointercancel, native lost-capture, teardown, and mobile touch scroll are recorded in the interaction reports. A touch beginning on the canvas moved scrollY 0→209.
- Same-window tab switching produced `document.hidden=true` and a `visibilitychange`. Hidden resize changed RAF and WebGL draw counts by 0; returning to the tab resumed rendering. Use `browser-hidden-tab.json`; the `actualHiddenTab` field in `browser-interactions-final.json` is an inconclusive new-window attempt.
- The V5 browser matrix passes project pause/resume/filter/detail, skill hover-exit/keyboard/touch/chips, experience drag/reversal/regrab/wrap/double-click, credentials pagination/modal/image download, email success/failure/repeat/locale, and Indonesian/English CV paths. Clipboard outcomes used a deterministic in-page stub.
- Reduced-motion and forced-WebGL-failure runs retained the accessible portrait fallback. No-JS keeps text and portrait visible; the chooser button is hidden, with direct CV links available. Home, lazy chunk, portrait, back/strap SVGs, and both PDFs return HTTP 200 on the final preview.
- Impeccable detector ran once and returned one overused-font warning for Geist. The V5 design brief and root `DESIGN.md` require Geist, so it remains unchanged.
- Portrait and CV bytes are unchanged: portrait `7f02f1dce947a8d79a2f19d9839a8eda07237180d536ec4e1258b6aff609caa5`; Indonesian CV `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b`; English CV `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6`.

Evidence is in `.checkpoints/v6-2026-11-04-qa/`: `preview-final-home-1440.png`, `preview-final-home.json`, `browser-baseline.json`, `browser-interactions-final.json`, `browser-lanyard-tap.json`, `browser-hidden-tab.json`, and `browser-v5-regression.json`. The cold-load CLS trace remains 0.001395 at ~359ms from primary navigation/header controls; zero CLS is not claimed. WebGL verification uses SwiftShader, not a hardware GPU.

The 2026-11-03 checkpoint below is historical; the results above supersede its incomplete gates.

## Checks completed

| Check | Result |
| --- | --- |
| `npm run validate-content` | Passed within the last build: 5 projects, 10 skills, 7 software apps, 9 experiences, 4 education entries, and 6 certificates. |
| `npm test` | Last run passed 35/35 tests, including once-only entrance state, duplicate aliases, heading timing, and grapheme segmentation. This run preceded the final CSS and Lanyard config tuning; no test source changed afterward. |
| `npm run check` | Last run passed with 0 errors, 0 warnings, and 3 hints (two existing MediaQueryList fallback hints in `AboutLanyard.jsx`, one existing `execCommand` hint in `v3-ui.ts`). This run preceded the final CSS and Lanyard config tuning; no TypeScript changed afterward. |
| `npm run build` | Passed after the last source edits; seven static routes were generated. Vite still reports a >500 kB minified chunk. |
| Browser viewport/layout | Production preview checked at 320×640, 390×844, 768×900, 800×900, 1366×854, 1440×1000, and 1920×1200. All had zero horizontal overflow. Header-to-stage bounds were y=69px on mobile and y=73px on desktop. At 1440×1000 the stage was 397×620px; at 390×844 it was 340×380px; at 320×640 it was 288×320px; at 800×900 it was 336×486px. Projects began after the About section. |
| Entrance and heading behavior | CDP traces show individual targets moving `unseen → entering → done`; project and hero headings each entered once during the scroll sequence. Scroll re-entry and locale changes left completed headings complete. Chrome's accessibility tree exposed one full localized heading name despite the visual aria-hidden grapheme layer. Direct `#contact` navigation animated targets as they became visible during smooth scrolling; the controller did not bulk-consume the document. |
| WebGL and Lanyard | The production canvas reached `ready` with WebGL 2. Renderer reported ANGLE/SwiftShader (software). The local profile front, `card-back.svg`, and `strap-weave.svg` loaded. CDP pointer drag/reversal/release and tap flip were captured in `desktop-drag-release.png` and `desktop-flipped.png`. |
| Fallbacks and lifecycle | Reduced-motion load showed the static portrait with no canvas; no-JS preserved readable text, the portrait, and both CV links; forced WebGL creation failure showed the same portrait fallback with no canvas. The earlier lifecycle trace recorded a stable requestAnimationFrame count after scrolling Lanyard offscreen and a live reduced-motion change unmounting the canvas. The visibility-change event was not exercised in a real hidden tab. |
| V5 smoke | Project category filter, pause button, moving card positions, theme toggle, software tab, and CV dialog choice state were exercised. Experience dragging, credential pagination/download, email copy, and the complete V5 interaction matrix were not verified. |
| CV PDFs | SHA-256 remains `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b` for Indonesian and `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6` for English. |

## Evidence and limits

CDP artifacts and screenshots are in `/tmp/v6-resumed-final/`: `results.json`, `probes.json`, `lifecycle.json`, `desktop-top.png`, `desktop-full.png`, `desktop-drag-release.png`, `desktop-flipped.png`, `tablet.png`, `tablet-800.png`, `mobile.png`, `mobile-320.png`, `reduced-motion.png`, `no-js.png`, `webgl-fallback.png`, and `production-review.png`. The measured Lanyard response decoded to 541,394 bytes and transferred as 139,051 compressed body bytes (139,351 including response overhead); a local Brotli compression estimate was 114,027 bytes. It is imported only by the visible About island after the reduced-motion check.

The final cold-load layout-shift trace measured 0.001395 cumulative shift without recent input; V6 typewriting and canvas geometry were reserved, but strict `CLS = 0` is not claimed. The installed headless browser exposed WebGL 2 through SwiftShader, not a hardware GPU. Touch vertical scroll did not move in the recorded gesture attempt; only the computed `touch-action: pan-y` was confirmed. `impeccable detect --json`, a full V5 regression pass, designer review, coordinator acceptance, scoped commit/push, GitHub Pages status, exact deployed SHA, and public route/asset checks remain incomplete.

## Resume steps

1. Resume only after coordinator instruction. Use the existing preview and artifact set; do not overwrite unrelated historical files or stage broadly.
2. Finish remaining behavior checks (touch scroll, actual hidden-document suspension, skill accordion, experience drag, credential paging/download, email copy, and route/asset responses) and decide whether the small nonzero cold-load shift needs an in-scope fix.
3. Run final checks and update this report; then obtain the designer's review of the frozen preview and coordinator acceptance before any publication.
