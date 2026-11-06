# V6 four-bug QA

## Frozen build

Preview: `http://127.0.0.1:4321/`. The preview served `/` as HTTP 200, 120,069 bytes. Served HTML matched `dist/index.html`, SHA-256 `7de2c4eda62eaff34504c62002f69c6408837256a35e0e486c18b4cdb2704770`.

Bundle fingerprints and protected profile/CV hashes are recorded in [V6-FOUR-BUGS-IMPLEMENTATION.md](V6-FOUR-BUGS-IMPLEMENTATION.md). Browser traces and screenshots are in `.checkpoints/v6-four-bugs-2026-11-06/`.

## Browser matrix

All 22 checks in `fixed-preview-browser.json` passed; no console errors.

| Scenario | Evidence |
| --- | --- |
| Cold lanyard startup | Ready event came after an intro physics step and rendered pose. First ready hit polygon had 2.1 px of edge tilt; canvas count 1; no fallback/stage double exposure. The visible canvas was not the untouched, axis-aligned starting pose. |
| Scroll after ready | Nine sampled scroll frames stayed `ready` with entrance `done`, one canvas, and fallback opacity 0. |
| Cold heading / import order | Heading trace advanced from 0 to 1, then 7, 8, and 20 graphemes; state reached `done` before lanyard bundle import. |
| Saved English | Reloaded page retained `en`; localized heading, portrait alt, and lanyard reached ready. |
| Touch scroll | Mobile emulation moved page scroll from 0 to 235 px with horizontal overflow 0. |
| Resize return and lanyard drag | Returned to desktop viewport without reload. Hit area remained live; center hit targeted `.lanyard-hit-area`; pointer capture succeeded. Drag reached Projects at y=887, below its y=863 boundary; horizontal overflow stayed 0. |
| Reduced motion and context loss | Both live preference change and WebGL context loss restored the accessible portrait and removed the canvas. |
| Gallery interruptions | Double-click interruptions at 30, 70, 150, and 300 ms each settled to an integer active offset (0 after 440 ms). Outside-stage release used the same pointer id and settled to offset 0; Escape, regrab, pointer cancel, and keyboard wrap also settled. |
| Caption swaps | 62 sampled frames; at most one painted caption; 0 overlap frames. |
| Project autoplay | Same tracked card moved. Observed 81.7748 px/s matched 81.7748 px/s predicted by the existing 48 ms frame-delta cap; explicit pause stopped movement (delta 0). Nominal source speed remains 88 px/s. |

## Startup timing and renderer limit

The prior ordering exposed `ready` after drawing the static pose and only then started the intro. The fix starts and advances the intro before `ready` can reveal the canvas. The browser assertion is therefore `readyPoseHasPhysicsMovement`: it checks the rendered hit polygon at the ready event, rather than requiring a second pose change after reveal. That is the relevant regression condition: the first exposed frame must already contain intro motion.

The captured ready event was at 7,072.7 ms. Its polygon had 2.1 px edge tilt. The first later polygon change arrived 870.2 ms after ready. In this ANGLE SwiftShader software run, sampled animation-frame intervals had a 116.6 ms median and 866.6 ms maximum; one 891 ms long task ended about 1.5 ms after the ready event. No long task began after ready in that interval. This run verifies reveal order and pose, but its slow follow-up frame timing is a software-renderer limit; it does not establish hardware-GPU frame performance. The intro impulse was not increased.

The mobile-to-desktop check initially showed the hit polygon outside the stage after reframe. That was a product lifecycle issue: camera framing and strap length changed while simulation nodes kept their previous frame coordinates. The rehang-on-reframe fix restored the hit area and allowed a real pointer-captured drag without reloading the page.

## Automated checks

- `npm run validate-content`: passed; 5 projects, 10 skills, 7 software apps, 9 experiences, 4 education records, 6 certificates.
- `npm test`: 44 passed, 0 failed.
- `npm run check`: 0 errors, 0 warnings, 3 existing hints (deprecated media-query listeners and `document.execCommand`).
- `npm run build`: passed; seven static pages. Existing Vite advisory remains for a chunk over 500 kB.
- `git diff --check`: passed.

The exact QA run is `.checkpoints/v6-four-bugs-2026-11-06/fixed-preview-browser.json`; screenshots include `lanyard-cold-ready.png`, `lanyard-scroll-down.png`, `lanyard-drag-into-projects.png`, and `experience-caption-fast-drag.png`. Profile and both CV hashes match the approved baseline. No dependency was added, and Experience remains manual.
