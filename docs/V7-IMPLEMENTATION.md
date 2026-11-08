# V7 Implementation

Status: **implementation, current-source QA, designer review, and local coordinator acceptance PASS; released publicly on 2026-11-08**. Source commit 6639a2ca06fc248d90e2292efe15838f03c1557a deployed through [Pages run 42458703729](https://github.com/Yunachz/yunachz.github.io/actions/runs/42458703729) to [yunachz.github.io](https://yunachz.github.io/). See [V7-RELEASE.md](./V7-RELEASE.md) for public verification. Older pending statements below describe pre-release checkpoints.

## Public release — 2026-11-08

The released source is commit 6639a2ca06fc248d90e2292efe15838f03c1557a. The successful Pages artifact and public root matched at 146,524 bytes and SHA-256 2bafa5fadddcda02067f56d2f0f4e0b01bbb85a47587edea5902ee7325601c3c. The accepted local build remains 146,521 bytes with SHA-256 638cf795930085b1b539d20faf1eb2e1de5d963028a58297b8c85fa777722e4e; the only variance is the two generated Astro island uid values, totaling three bytes. The complete focused public smoke passed with no console errors. See [the release record](./V7-RELEASE.md) and its linked evidence.

## Frozen preview milestone — pre-release status, 2026-11-08

Current-source content validation, all 52 tests, check, production build, diff whitespace check, focused native browser suites, and V6 regression suites passed. The preview HTML is 146,521 bytes with SHA-256 `638cf795930085b1b539d20faf1eb2e1de5d963028a58297b8c85fa777722e4e`; it matches `dist/index.html`. The durable manifest `../.checkpoints/v7-implementation-2026-11-06/preview-sha256-manifest-v7-2026-11-08-1794116450700.json` records all 12 emitted JS/CSS bundles. The largest existing shared Lanyard bundle is 543,853 bytes, above Vite's 500 kB advisory threshold; the Glare enhancement chunk is 8,177 bytes. No package dependency was added.

The eight-slot native Glare lifecycle passed. The earlier failure report remains untouched: its real first-entry sweep crossed from −159.82 to +177.49 px between samples 301 ms apart, so it missed the harness's narrow single-sample window despite active, visible animation. The revised durable harness accepts a bounded sign crossing between active samples without changing product logic. UI and visual-revision suites passed at desktop, tablet, and narrow widths in both themes/locales; focused V6 regressions passed. Browser rendering used ANGLE SwiftShader, so evidence establishes software-rendered browser behavior, not hardware GPU performance. The four approved dummy competition IDs remain in source and tests. The user's later revision removed the About local pause control; it remains absent.

At this pre-release milestone, independent designer review and coordinator acceptance were the remaining gates and the preview was still local. Both gates and deployment are now complete; see the release status above.

## Latest implementation checkpoint — 2026-11-08

The lanyard ready-stage hitbox bug is fixed in source: the oversized stage is pointer-transparent, while the clipped lanyard hit area stays interactive. The latest visual-revision report records all six CTA hit positions working, CV dialog and project anchor behavior, and lanyard pointer capture. The latest screenshots show full-width moving About text, gray base grid with localized cursor color, and visibly rotated Competition photo stacks. Coordinator inspected these screenshots; the independent designer's final preview review remains pending.

The earlier stop state and failed sampling assertion are historical. Current-source gates and native lifecycle results are recorded in the frozen preview milestone above and in [V7-QA.md](./V7-QA.md).

## Competition & Achievements

The homepage now renders four `isDummy` competition examples after Experience and before Credentials. They use the existing placeholder images and carry localized titles, statuses, descriptions, alt text, and example badges. Two examples explicitly describe non-winning outcomes in encouraging terms. No real achievement, organizer, or date was invented.

The static page exposes all four records without JavaScript. With JavaScript, the editorial track groups them as three records followed by one; page two is hidden from accessibility and focus until selected. Each record has a three-photo deck with localized labels, a counter, mouse, Enter, Space, arrow-key, and touch operation, previous/next controls, wrapping, and reduced-motion settling. Paging clamps against the actual two-page list and restores focus to an enabled boundary control.

The pager correction is in `src/scripts/v7-competitions.ts`: it no longer calls `paginateRecords` on the already-paginated `pages` array. That call collapsed the valid two-page list to one page. Current code clamps directly against `pages.length`, preserving the final one-record page.

## V6 entrance extension

Competition media and copy are server-rendered as separate V6 entrance markers on dedicated visual children. They use existing V6 presets and its once-per-document ledger. The page heading remains owned by V6 typing. Competition page changes schedule the existing V6 entrance scan; there is no second reveal controller and no post-hydration entrance marker injection.

The native browser run observed the `competition-media` preset on the media child at 520 ms, from opacity 0 and a desktop x offset of 18 px to its resting pose. It settled in roughly 0.55–1.14 seconds of browser time in the recorded viewport runs and did not replay after leaving and re-entering. The H1 typing path remained separate. See the per-run times in the QA evidence.

## Credential GlareHover

The image gallery, anchors, direct-image URLs, dialog payloads, download links, page markup, and V6 entry markers remain server-rendered. One `CredentialGlareEnhancement` React island portals the actual GlareHover component into eight stable empty image-frame slots when the gallery becomes visible. The portal roots stay mounted across page and locale changes; the image remains the content and the existing document click handler still owns viewer delegation.

The vendor baseline is the durable 11,430-byte React Bits registry response captured 2026-11-06, SHA-256 `8bb09c07743680d4da8d22c2b7ed3218421d75a5e4da2f3617efe78102252f04`. Its source files were verified against that response before local lifecycle edits. Upstream JSX SHA-256 was `2279e8920957cea3570cec387f184a76f23281ae2e59ccc5299cb5a71bb90fc2`; upstream CSS SHA-256 is `556debf36792dd1a774b27f96c120494b7d2a1ed19c188f2b30faf5df31f2b35`. The locally adapted JSX currently hashes to `090da3b7567bef6533b3210f2be4edd3e1f22f6677caeeb8d24a801366ddc121`.

The complete upstream MIT + Commons Clause license (copyright 2026 David Haz) is preserved at `src/components/react-bits/LICENSE.md`, with source URL and fingerprints in `PROVENANCE.md`. This is not plain MIT. No package or lockfile dependency was added.

The production instance keeps native `intro={true}`, `mode="hover"`, and these requested values: white glare, opacity 0.5, size 30, softness 0.6, angle −45°, screen blend, rim glint, 650 ms transition, and 20 px radius. The outer overlay fills the existing responsive frame; it does not impose the reference image's fixed dimensions or alter image fitting.

Local lifecycle changes are documented beside the source. They use the component's existing IntersectionObserver and rAF owner, require at least 40% intersection plus active-page/header eligibility, consume a visible intro skipped for reduced motion, settle on live reduction, offscreen/inert state, hidden-document state, and page/locale eligibility updates, and remove observers/listeners/timers on cleanup. No timer polling or synthetic pointer event was added. The original media assets and viewer remain available if the enhancement does not hydrate.

## About motion and BFCache implementation notes

`AboutMotion.astro` adds two aria-hidden outlined name groups behind the existing foreground. The existing H1 and lanyard remain untouched. A 2D grid deforms locally around a fine pointer; a measured two-group name marquee owns its own transform. The user's 2026-11-08 revision removed the local pause control, its user-pause branch, and its unused localized labels. Automatic reduced/coarse/static, offscreen, hidden-document, dialog, lanyard-capture, and BFCache handling remain in source. The new grid colors, cursor point, deformation radius/displacement, and single-alpha name stroke are design starting values; visual acceptance is still pending real browser screenshots in both themes and narrow layouts.

`src/scripts/v7-about-motion.ts` now treats a persisted `pagehide` as BFCache suspension: it adds a pause reason, clears grid intensity, pauses the marquee, and cancels the frame owner while retaining listeners. On persisted `pageshow`, it refreshes geometry and removes the BFCache reason. Non-persisted `pagehide` still disconnects observers and aborts listeners.

The visual-acceptance note in the earlier paragraph is superseded by current screenshots and lifecycle evidence listed in [V7-QA.md](./V7-QA.md). Independent designer review remains pending.

Pre-revision BFCache browser evidence restored the same document token, recorded `pagehide.persisted === true` and `pageshow.persisted === true`, observed the grid static and marquee paused in the application-ordered pagehide handler, then observed the grid and marquee resume with the former local pause off. See [the BFCache report](../.checkpoints/v7-implementation-2026-11-06/v7-bfcache-qa-1794055429370.json). This is lifecycle evidence for the earlier frozen preview, not a fresh visual acceptance run.

## Scope and current limits

The implementation retains bilingual copy, both themes, no-JavaScript content, the original portrait/CVs, certificate pages and viewer/download behavior, manual Experience navigation, existing project motion and skills/education behavior. The card stacks, About marquee/grid, lifecycle cleanup, entrance animation, GlareHover delegation, and V6 regressions have current-source browser evidence. Remaining limits: the browser used SwiftShader; Vite still warns about the 543,853-byte Lanyard chunk; and independent designer/coordinator review is pending.
