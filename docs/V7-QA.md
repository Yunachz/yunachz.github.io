# V7 QA

Status: **current-source QA complete; designer review and local coordinator acceptance PASS**. See [V7-COORDINATOR-ACCEPTANCE.md](./V7-COORDINATOR-ACCEPTANCE.md). The frozen bytes and historical evidence remain preserved under `.checkpoints/v7-implementation-2026-11-06/`; no release or deployment occurred. Earlier pending/failing statuses below are historical and superseded by the final current-source results and acceptance record.

## Final current-source QA — 2026-11-08

- `npm run validate-content`: passed (5 projects, 10 skills, 7 software entries, 9 experiences, 4 education entries, 6 certificates, 4 competitions).
- `npm test`: passed, 52/52.
- `npm run check`: passed, 0 errors, 0 warnings, 3 existing hints (deprecated MediaQueryList fallback methods in `AboutLanyard.jsx`; `document.execCommand` in `v3-ui.ts`).
- `npm run build`: passed, 7 pages; Vite retained its existing warning for the 543,853-byte shared Lanyard chunk.
- `git diff --check`: passed.
- [Native Glare lifecycle report](../.checkpoints/v7-implementation-2026-11-06/v7-eight-slots-native-1794116206622.json): passed all eight stable portal slots, real certificates and samples on pages 1 and 2, first-entry and hover in both themes, reduced-motion/offscreen/hidden cancellation, no replay after return, and exact viewer/download delegation. The earlier failure JSON remains preserved. Its sweep crossed from −159.82 to +177.49 px between samples 301 ms apart, missing a narrow single-frame assertion while the actual animation was visible and active. The durable v2 harness now recognizes bounded sign crossings between adjacent active samples; product eligibility was not weakened.
- [Responsive UI report](../.checkpoints/v7-implementation-2026-11-06/v7-ui-qa-native-1794116312489.json): passed 1440×900, 1024×768, 390×844, and 320×844, both themes/locales, reduced-motion apply/restore, no-JS records, 3+1 pagination, page-two focus/inert behavior, photo deck and pager controls, once-only nonheading entrance, coarse/static grid, and absence of the removed local About pause control.
- [Visual-revision report](../.checkpoints/v7-implementation-2026-11-06/visual-revision-1794116450700/visual-revision-qa.json): passed 1920, 1440, 1024, 390, and 320 widths, recording About marquee/grid, cursor-local deformation, Competition stack transitions, CTA hit tests, and lanyard capture.
- [V6 regression report](../.checkpoints/v7-implementation-2026-11-06/fixed-preview-browser.json): passed 22 checks, including lanyard drag and capture release, resize/fallback/context/reduced-motion, manual Experience interruption/captions, project autoplay at about 82.72 px/s, pause/phase, and no console errors.
- Browser automation used ANGLE SwiftShader. It verifies browser rendering and software-WebGL paths, not hardware GPU performance.

The uniquely frozen preview is `.checkpoints/v7-implementation-2026-11-06/frozen-preview-v7-2026-11-08-1794116450700/index.html`, SHA-256 `638cf795930085b1b539d20faf1eb2e1de5d963028a58297b8c85fa777722e4e`, 146,521 bytes. Its identity matches `dist/index.html`. [The durable manifest](../.checkpoints/v7-implementation-2026-11-06/preview-sha256-manifest-v7-2026-11-08-1794116450700.json) covers all 12 emitted JS/CSS bundles; the Glare enhancement chunk is 8,177 bytes. Four approved dummy competition IDs remain covered by content validation and tests. No new dependency was added. The local preview is ready for independent designer review and coordinator acceptance; those are the only remaining gates.

## Historical stop checkpoint — 2026-11-08

- `visual-revision-1794104845662/visual-revision-qa.json` records the corrected CTA hit test: six click points across View CV and Explore Projects resolve to their own elements, CV opens, Projects navigates, and lanyard pointer capture works and releases. It also records About cursor probes at three points across 1920/1440/1024 px widths, with colored-pixel response local to the cursor. Coordinator inspected the actual 1920 px About and Competition transition screenshots; visual direction appears present but awaits independent designer review.
- `v7-ui-qa-native-1794104791868.json` covers 1440×900, 1024×768, 390×844, and 320×844. It records both themes/locales, four dummy competition records and 3+1 pagination, no-JS rows, and reduced-motion application/restoration across the matrix. The report has no `unresolvedFindings`; preserve the raw report and screenshots.
- `v7-eight-slots-native-failure-1794104933829.json` is a **failed** native glare lifecycle run: the light/real PLC maintenance card did not show an observed first-entry crossing. Eight-slot lifecycle acceptance is still open; diagnose the report before adjusting assertions.
- The latest observed `npm run check` exited 1. The About reduced-motion source listeners were edited again after that command, so rerun `npm run check` and `npm run build` on current source before treating any browser evidence as final.
- Browser automation used ANGLE SwiftShader; it validates browser rendering paths, not hardware GPU performance. Latest local preview PID 11279 was stopped by SIGINT and verified absent.

## Historical automated gates

On 2026-11-07, after the competition pager and BFCache source changes:

- `npm run validate-content` passed: 5 projects, 10 skills, 7 software entries, 9 experiences, 4 education entries, 6 certificates, and 4 competitions.
- `npm test` passed: 50/50 tests.
- `npm run check` passed with 0 errors, 0 warnings, and 3 existing hints (two deprecated MediaQueryList fallback calls in `AboutLanyard.jsx`, one deprecated `document.execCommand` call in `v3-ui.ts`).
- `npm run build` passed and produced 7 pages. Vite reported the existing shared chunk above 500 kB. No dependency was added.

These gates were run before the later QA-harness-only changes. No application source changed after that build during the browser diagnostics recorded below; the build will be repeated before the preview is frozen.

## Historical responsive browser matrix

Native browser interactions ran at 1440×900, 1024×768, 390×844, and 320×844, across both themes and locales. The full matrix report is [v7-ui-qa-native-1794056355534.json](../.checkpoints/v7-implementation-2026-11-06/v7-ui-qa-native-1794056355534.json), with durable viewport screenshots in the same directory.

The pre-revision run checked no horizontal overflow, bilingual four-record content, the 3+1 page layout, page-two visibility and inertness, focus exclusion and boundary focus restoration, click/touch/arrow navigation, photo counter wrapping, localization, theme switching, cursor-deformed grid pixels, the former local pause control, dialog/offscreen/hidden-tab lifecycle, and no-JavaScript SSR at desktop and 320 px. The no-JavaScript pages retained all four records and first images with correct alt text; pagination and photo controls remained hidden. The main report returned `passed: false` because two live reduced-motion application-state checks failed at 1440×900 and 1024×768. Other recorded viewport checks completed.

The keyboard input path was validated with a plain native button and then the competition control. Both Enter and Space used keydown, char/text, and keyup; the plain button produced one trusted native click and the competition photo counter advanced. The document was visible and `document.hasFocus()` was true, and the photo button was focused, visible, enabled, and outside inert content.

The V6 competition entrance test passed at each size: the native `Element.animate` wrapper forwarded the original method and arguments, observed exactly one 520 ms entrance on the non-heading media child, recorded final settling, and confirmed no replay within the document. SwiftShader is a software WebGL renderer; this verifies browser behavior and rendering API paths, not hardware GPU performance.

## Historical reduced-motion evidence gap

An isolated uninstrumented browser probe passed four `reduce`/`no-preference` cycles at 1440×900: [v7-reduced-motion-qa-1794055701760.json](../.checkpoints/v7-implementation-2026-11-06/v7-reduced-motion-qa-1794055701760.json). A fresh native MediaQueryList received one trusted event per change and the About grid/marquee applied and restored the requested state in each cycle.

Full UI runs remain intermittent. In the latest pre-revision matrix, a fresh native probe received the requested event, but About remained moving until the former user pause was clicked. That interaction is removed from current source and the revised fixture no longer clicks it or forces a state resync. An earlier diagnostic run preserved the About module's per-query stack and listener registration: the application MQL's signal was not aborted, but that query recorded no event while sibling queries changed. See [the traced failure](../.checkpoints/v7-implementation-2026-11-06/v7-ui-qa-native-failure-1794054939852.json), [the latest matrix](../.checkpoints/v7-implementation-2026-11-06/v7-ui-qa-native-1794056355534.json), and other timestamped failure JSONs in the evidence directory.

The event-driven source is retained. No ongoing poll or test-only state fallback is used to claim success. The live reduced-motion behavior across the full UI matrix remains an unresolved evidence gap for independent review.

## Historical BFCache and glare lifecycle

The pre-revision BFCache source behavior passed a real same-document browser restore with persisted `pagehide` and `pageshow`: [v7-bfcache-qa-1794055429370.json](../.checkpoints/v7-implementation-2026-11-06/v7-bfcache-qa-1794055429370.json). Grid and marquee paused during persisted pagehide and resumed after restoration, with the former local pause state off.

Representative light/dark real/sample glare render and viewer evidence already exists in [glare-probe-verified.json](../.checkpoints/v7-implementation-2026-11-06/glare-probe-verified.json) with associated screenshots; that probe used native IntersectionObserver and forwarded native animation APIs. Final lifecycle coverage is still unfinished against the built, native IntersectionObserver page. The first native run showed the test had only scrolled to the document's maximum position while the top credential frame was still about 75% visible. The QA fixture then added temporary bottom space so native geometry could become truly offscreen, moved the real pointer away, and centered the exact frame on return; it does not alter product eligibility logic. The latest run cancelled the sweep when the frame became nonvisible, then still failed the `returnedVisible` wait even though its failure snapshot showed the frame fully within the viewport (top 417.7 px, height 164 px, viewport 900 px). See [the latest native failure](../.checkpoints/v7-implementation-2026-11-06/v7-eight-slots-native-failure-1794056885245.json). Hidden-tab and page-two lifecycle checks remain unrun in this corrected path.

## Superseded remaining-gate checklist

The checklist below describes the earlier stop and has been satisfied by the Final current-source QA section above. Only independent designer review and coordinator acceptance remain.

## Historical visual corrections recorded before final QA

This section records the revision context before current browser verification. Its pending-verification notes are superseded by the Final current-source QA section at the top of this document.

The user reported that About's outlined name is not perceptible in `.checkpoints/v7-about-revision-2026-11-08/marquee-bug-contact-sheet.jpg`. Source inspection found the old stroke mixed at 24% accent and then multiplied by `opacity: .12` (about 2.9% effective alpha); the narrow rule compounded another `.09` opacity. Current source now uses a single 18% accent stroke alpha and opacity 1, centers a compact name under reduced motion, raises canvas opacity to 1, increases grid strokes, expands deformation and draws a cursor accent point. The 18%, grid color, radius, displacement and timing values are starting proposals, not verified contrast or performance claims. The old name motion-state probes did not establish visibility.

The local pause UI, behavior, CSS, and translations are removed from current source. The native UI matrix fixture now asserts its absence, does not click it during offscreen/reduced-motion checks, does not manually resynchronize a failed media preference, and records the unresolved result as-is. These current-source edits have not yet been browser-verified.

The coordinator reported a second user correction: Competition photos need visible, rotated, layered card edges and outgoing/incoming movement, not a fixed-frame replacement. The source change awaits concrete designer direction; current and original references are cataloged in [V7-VISUAL-CORRECTIONS.md](./V7-VISUAL-CORRECTIONS.md). Do not treat the existing counter/pagination pass or old preview as visual acceptance.
