# V5 QA report

- Date: 2026-11-03
- Baseline: published V4, `d3487c93169f150490b0cb4734ad81cb8edd7c07`
- Preview: <http://127.0.0.1:4321/>

## Automated checks

- `npm run validate-content` passed: 5 projects, 10 canonical skills, 7 software apps, 9 experiences, 4 education entries and 6 canonical credentials.
- `npm run check` passed with 0 errors, 0 warnings and 1 existing TypeScript hint: deprecated `document.execCommand` in the clipboard fallback.
- `npm test` passed all 32 tests.
- `npm run build` passed and generated 7 static pages.

## Real-browser checks

Ran `/tmp/v5-browser-qa.mjs` against the local production preview using the existing CDP helper and a fresh Brave profile. The run passed with no browser exceptions. Screenshots are in `/tmp/v5-qa/`.

- Project geometry used physical DOM rectangles at 1920, 1440, 1366 and 390 CSS pixels. The unfiltered cards measured 380/360/341.5/334px wide, with measured pitches 404/384/365.5/358px: 24px between each adjacent card. After selecting the `control-systems` filter, desktop cards measured 568px wide with a 24px gap; at 390px they became one column with a 24px row gap. Filter reset and 10 subsequent hit-tested pause/play clicks retained 24px gaps. CDP viewport changes did not reliably emit `resize`, so the harness dispatched a browser `resize` event after each viewport change and measured the resulting rendered layout.
- Ten real pointer clicks (nine pauses, then play) left motion running. The highlighted card center moved 4.22px during the sampled burst; the phase was not reconstructed from a rounded index. Automatic, hover and pointer-exit states each had exactly one highlighted physical card.
- Gallery double-click delivered `mousedown` details 1 and 2 plus a browser `dblclick` detail 2. Selection, native `dragstart`, pending drag and index shift were absent. Holding the pointer after a 44px move rendered 45.99px of coverflow travel (1.99px error); reversing reduced fractional travel. A held drag wrapped from item 8 to item 0. Touch cancellation returned to item 8 and cleared dragging; vertical touch moved the page 75px without taking over gallery motion. Settling left one active caption and no Activities divider.
- At a 1440×1000 desktop viewport with a 73px sticky header, education measured 927px high. Top and bottom content slack were 267.14px and 266.14px; the two formal-entry gaps were both 14.703px, with zero forced row minimum heights.
- Credential pages contained six canonical entries and two separate sample images. Sample cards had no visible copy, badges or descriptions; images loaded with `object-fit: contain`. Indonesian and English sample dialogs showed `Pratinjau gambar` / `Image preview` and `Simpan gambar` / `Save image`. The clicked same-origin image link matched the displayed image URL and filename. Brave emitted `downloadProgress: completed` for 1,307,929 bytes at the expected `gggggg.jpg` path. A post-shutdown host listing did not retain that temporary download, so evidence confirms Brave's completed event and link target, not a persistent file after browser shutdown.
- Email success changed only the address button to `Email disalin`; the live announcement was clipped and no second visible success message appeared. A simulated clipboard failure restored the address and showed the localized failure guidance.
- Captured same-size screenshots at scroll top, 25%, 50%, 75% and bottom. In uncovered left-gutter patches, mean RGB at `(x 10–120, y 100–220)` moved from `(220,231,241)` at top to `(246,247,244)` at bottom; the lower patch `(x 10–120, y 700–820)` shifted in the opposite direction. Screenshot set: `gradient-top.png`, `gradient-quarter.png`, `gradient-middle.png`, `gradient-threequarter.png`, `gradient-bottom.png`. Dark theme hid the gradient; reduced motion retained a stable midpoint treatment and disabled project autoplay.
- Tested English and Indonesian, light and dark themes, keyboard skill movement/exit, touch skill open/close, separate seven-app software tab, and 320/390/768/1366/1920px layouts. `scrollWidth` matched `clientWidth` at those five widths; this overflow check does not claim that every content block fits in one viewport.

## Review artifacts and release gate

Key screenshots: `projects.png`, `experience-held-left.png`, `experience-wrap-held.png`, `education-layer.png`, `credentials-real.png`, `credentials-samples.png`, `credentials-samples-en.png`, `mobile-skill-open.png`, `mobile.png`, and `desktop-dark.png` in `/tmp/v5-qa/`.

The refreshed preview and reports are ready for coordinator QA acceptance. No commit or push has been made; publication remains behind that acceptance gate.
