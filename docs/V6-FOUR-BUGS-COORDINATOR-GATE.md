# V6 four-bug coordinator release gate

Date: 2026-11-06. Decision: **PASS — scoped release authorized**.

The user explicitly resumed this task through release. This decision opens the release gate for the reviewed working-tree changes against HEAD `31226c69b95ffa3fbb0b54c536d7bb63f6609339`.

## Reviewed identity and evidence

- Frozen HTML SHA-256: `7de2c4eda62eaff34504c62002f69c6408837256a35e0e486c18b4cdb2704770`.
- Lanyard bundle SHA-256: `d2920672179508d39eb0b2adc010d32c24ae5f1979427595f9148dfe861269bc`.
- Coordinator independently checked local build hashes, read the complete tracked source diff and new helpers, and reviewed implementation/QA reports.
- Implementation reports content validation, 44 passing tests, Astro check with 0 errors/0 warnings and 3 existing hints, seven-page build, diff check, 22 passing browser checks, and unchanged protected photo/CV hashes.
- Corrected independent designer review passed on the same preview. Fresh live-browser evidence records a moving ready pose and subsequent swing, no scroll portrait ghost, integer gallery settle, and single-caption rendering.
- The corrected designer report removes unsupported Rapier and hardware-performance claims. Its programmatic mobile scroll alone does not establish touch behavior; the coordinator relies on the implementer's separately recorded touch-input scenario for that requirement.
- Software SwiftShader timings remain an explicit measurement limitation. This gate accepts the startup/reveal ordering fix and observed movement; it makes no hardware-GPU frame-rate guarantee.

## Scoped commit allowlist

Stage these exact files only after inspecting the index:

- `src/components/AboutLanyard.jsx`
- `src/components/lanyard/Lanyard.jsx`
- `src/lib/experience-coverflow.ts`
- `src/lib/experience-caption-state.mjs`
- `src/lib/lanyard-startup-state.mjs`
- `src/lib/raf-owner.ts`
- `src/lib/v6-entrance-state.mjs`
- `src/scripts/v3-ui.ts`
- `src/scripts/v6-entrance.ts`
- `src/styles/v3.css`
- `tests/v5-interactions.test.mjs`
- `tests/v6-entrance.test.mjs`
- `docs/V6-FOUR-BUGS-IMPLEMENTATION.md`
- `docs/V6-FOUR-BUGS-QA.md`
- `docs/V6-FOUR-BUGS-FINAL-DESIGN-REVIEW.md`
- `docs/V6-FOUR-BUGS-COORDINATOR-GATE.md`

Preserve all other historical/untracked files. No broad staging, reset, clean, amend, or force push. Any subsequent product source change invalidates this frozen-preview gate and requires appropriate verification/review.

## Release completion

Luna may perform a normal scoped commit and push to the existing project remote, then verify GitHub Pages success for the exact commit and public HTML, hashed bundles, protected assets, seven routes, and browser smoke of the four fixes. Save actual release SHA, deployment identity, public checks, and limitations to `docs/V6-FOUR-BUGS-RELEASE.md`. This gate is authorization, not a claim that publication has already occurred.
