# V6 Four Bugs Release Record

## Source release

- Source commit: `a4fd021f940c860558ceda30fe85658a17cbb6b4` (`fix: resolve v6 lanyard and experience interactions`), on `main`.
- Pages workflow: [run 42156366029](https://github.com/Yunachz/yunachz.github.io/actions/runs/42156366029), completed successfully for that exact source SHA on 2026-11-06.
- Pages artifact: `github-pages`, artifact ID `13474487613`, archive SHA-256 `d5b4be125f2728c77e187df959c17a66f2066b1a626b7b11c6e907505f068ec1`; its run metadata names the same source SHA.

## Deployed content and byte checks

The public home page returned 200 and exactly matched `index.html` extracted from the successful Pages artifact: 120,071 bytes, SHA-256 `869da5286cd28eba9164eb7f5be9dda4dd6e26103111044f582ad4f6523c3b3f`. The local fixed-preview build was 120,069 bytes, SHA-256 `7de2c4eda62eaff34504c62002f69c6408837256a35e0e486c18b4cdb2704770`. The complete byte comparison found one changed span at offset 18,327: Astro emitted island UID `GeADW` (5 bytes) in the local build and `Z2wRIxg` (7 bytes) in the Actions build; the remaining 101,737-byte suffix is identical. The public HTML hash equals the Actions artifact hash exactly. This is per-build Astro hydration identity; it does not alter the shipped source or bundle bytes.

All seven public routes returned HTML 200:

- `/`
- `/projects/`
- `/projects/aquasync-ph-stabilizer/`
- `/projects/fuzzy-fire-suppression/`
- `/projects/kafe-kekinian-pos/`
- `/projects/lora-sentinel/`
- `/projects/smart-trash-bin/`

The six project pages matched their local build HTML byte for byte. All referenced same-origin assets, the CSS file, and all seven hashed JavaScript bundles returned 200 and matched local build hashes. The About portrait returned 200 with SHA-256 `7f02f1dce947a8d79a2f19d9839a8eda07237180d536ec4e1258b6aff609caa5`; lanyard textures returned 200 and matched their build copies.

Both public CVs returned 200 and retained their local bytes:

- Indonesian PDF: 6,484 bytes, SHA-256 `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b`.
- English PDF: 114,160 bytes, SHA-256 `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6`.

## Public browser smoke

The public browser run passed all 22 checks with no console errors. It covered cold lanyard startup and first motion, scroll after readiness, saved English, mobile touch scrolling, desktop hit testing and drag into Projects, reduced-motion and context-loss fallbacks, interrupted gallery settles at 30/70/150/300 ms, keyboard wrap, outside release/cancel/regrab, caption swaps, and the existing project carousel autoplay and pause controls.

Frame evidence showed a ready pose tilt of 8.4 px, zero double-portrait frames, zero fallback opacity during scroll, one painted experience caption maximum with zero overlap frames, and project autoplay at 78.8 px/s against the 78.8 px/s observed frame-budget prediction; pausing produced 0 px movement. The browser used ANGLE SwiftShader. Lanyard readiness arrived at about 5.31 s; two software-renderer long tasks of 741 ms and 660 ms occurred before readiness, and sampled ready-window frame intervals had an 83.3 ms median and 416.7 ms maximum. These timings describe this software-rendered run and do not establish hardware-GPU performance.

## Evidence files

- [Implementation report](V6-FOUR-BUGS-IMPLEMENTATION.md)
- [Fixed-preview QA report](V6-FOUR-BUGS-QA.md)
- `.checkpoints/v6-four-bugs-2026-11-06/public-deployment-check.json`
- `.checkpoints/v6-four-bugs-2026-11-06/public-deployment-browser.json`
- `.checkpoints/v6-four-bugs-2026-11-06/public-index.html` and `actions-artifact-index.html`
- `.checkpoints/v6-four-bugs-2026-11-06/public-lanyard-cold-ready.png`, `public-lanyard-scroll-down.png`, `public-lanyard-drag-into-projects.png`, and `public-experience-caption-fast-drag.png`
