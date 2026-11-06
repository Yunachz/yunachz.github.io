# V6 four-bug implementation

## Result

All four reported behaviors pass on the frozen production preview. One resize lifecycle defect found during the required mobile-to-desktop interaction check is also fixed: after the viewport frame changes, the lanyard returns to its hanging pose unless a pointer grab is active.

## Changes

- **Lanyard startup:** start the intro before its first exposed scene frame. Keep the portrait fallback until a simulation step and rendered scene exist. Reduced-motion and error states still restore the accessible portrait.
- **Ready handoff:** base the once-only entrance handoff on the ready figure's visibility. Scrolling after the handoff does not bring the fallback back.
- **Experience gallery:** preserve fractional phase and the existing animation owner through interruption. Settle after pending clicks, pointer cancellation, Escape, and release outside the stage. Experience stays manual; no autoplay was added.
- **Caption ownership:** only the leaving active record can finish its entrance. Hide inactive captions synchronously, preventing overlap during rapid changes.
- **Responsive lanyard frame:** rehang after a viewport/framing change when no pointer grab is active. This keeps the rendered card and its raycast hit area usable after returning from mobile viewport emulation.
- **Regression coverage:** add focused tests for frame ownership, coverflow transitions, caption ownership, lanyard reveal gating, and reframe/grab state.

## Source diff

Working-tree diff is against `31226c69b95ffa3fbb0b54c536d7bb63f6609339`; no commit or staging was done. Changed tracked files: `src/components/AboutLanyard.jsx`, `src/components/lanyard/Lanyard.jsx`, `src/lib/experience-coverflow.ts`, `src/lib/v6-entrance-state.mjs`, `src/scripts/v3-ui.ts`, `src/scripts/v6-entrance.ts`, `src/styles/v3.css`, `tests/v5-interactions.test.mjs`, and `tests/v6-entrance.test.mjs`. New source helpers: `src/lib/experience-caption-state.mjs`, `src/lib/lanyard-startup-state.mjs`, and `src/lib/raf-owner.ts`.

The implementation, QA report, runner, result JSON, and browser captures are separate files. Older checkpoint and handover files remain untouched.

## Frozen preview

- Local production preview: `http://127.0.0.1:4321/` (server left running).
- `dist/index.html`: 120,069 bytes; SHA-256 `7de2c4eda62eaff34504c62002f69c6408837256a35e0e486c18b4cdb2704770`.
- Served `/` returned HTTP 200 with the same byte count and SHA-256.
- Browser bundles: `AboutLanyard.gSbXnDdT.js` SHA-256 `dade67a9fa2de8a7ad631fb8b606d36a9bfe6890975574a3e1be32b86a22735c`; `Lanyard.K-wyj7jL.js` SHA-256 `d2920672179508d39eb0b2adc010d32c24ae5f1979427595f9148dfe861269bc`; `PortfolioLayoutV3.astro_astro_type_script_index_0_lang.CSh_0gq9.js` SHA-256 `2a445d3c5d262356d020d857d4b726b2aadd123ed5d45b497b4321a0ca3e0a93`.
- Build produced seven static pages. Preview identity and browser evidence are in `.checkpoints/v6-four-bugs-2026-11-06/fixed-preview-browser.json`.

## Protected content

Original profile and CV bytes match the handover fingerprints:

- `public/assets/profile/muhammad-fajar-sodik.webp`: `7f02f1dce947a8d79a2f19d9839a8eda07237180d536ec4e1258b6aff609caa5`
- `public/assets/documents/cv-muhammad-fajar-sodik-id.pdf`: `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b`
- `public/assets/documents/cv-muhammad-fajar-sodik.pdf`: `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6`

Ready for designer and coordinator review. Do not release before the coordinator's fixed-preview gate.
