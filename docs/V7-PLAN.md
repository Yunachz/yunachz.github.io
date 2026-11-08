# V7 implementation plan

Planning only · 2026-11-06 · Codex GPT-6.1 Sol high

The implementation target is four explicitly labelled example competitions over two horizontal pages (3 + 1), richer once-per-document non-heading entrances, the actual React Bits GlareHover component on certificate images, and restrained About name/grid motion. Extend the released V6 architecture. No product implementation, dependency installation, build, deployment, staging, or commit was performed for this plan. The coordinator must authorize the sole implementer, Codex GPT-6 Luna max, after reviewing this plan with `V7-DESIGN-MOTION.md` and the corrections below.

## Baseline and actual read coverage

Verified current HEAD: `976fffd89891ab6f171d205e8fb52f661e428841`. Released V6 source: `a4fd021f940c860558ceda30fe85658a17cbb6b4`. HEAD adds release documentation; it is not an unfinished V6 implementation. The newest V7 user clarification in `V7-REVISION-BRIEF.md` takes precedence over older plans: **four dummy records, existing dummy images, three records per page**. Historical pause instructions do not cancel the coordinator's subsequent resume instruction.

All 73 current root/docs Markdown documents were read, including untracked history, totalling 1,081,656 bytes at the pre-plan snapshot. No non-Markdown files were found under `docs`. The complete per-path byte/line counts, SHA-256 fingerprints, and read methods are in [the coverage ledger](../.checkpoints/v7-planning-sol/DOCUMENTATION-COVERAGE.md) and [its machine-readable version](../.checkpoints/v7-planning-sol/documentation-coverage.json). This covers root `README.md`, `PRODUCT.md`, `DESIGN.md`, all content/deployment guides, V2–V6 plans/reviews/checkpoints, final V6 four-bug release reports, and both current V7 documents.

Coverage was established by actually consuming 24,000-character stream pages 0–43 and explicitly reading the final V7 design and brief in full. Page 3 was repeated after a combined tool response omitted it. A small omitted paragraph from page 2 was separately re-read at `CHECKPOINT-V3.md` lines 108–139. `V7-DESIGN-MOTION.md` was fully read through explicit ranges 1–100, 101–220, 221–350, 351–506; the brief was read in full. Stream pages 44–45 and earlier saved, merely prepared chunks are **not** claimed as consumed. All 73 inventory fingerprints were rechecked before this plan was written; none changed during this worker's reading.

Source inspection covered the live Astro homepage/layout, collection schemas, package manifest, certificate pagination and viewer delegation, locale/theme updates, the complete V6 entrance controller/state helper, frame owner and Experience caption state, About startup component, lanyard capture/cancellation paths, relevant stylesheet rules, and content validation loading/media rules. Source inspection was targeted where a whole large file was unnecessary; it is not a claim that every repository source file was read. Evidence and source findings are recorded below. The final evidence manifest confirms no tracked working-tree diff and no index diff.

### Historical decisions that remain binding

| Released behavior | V7 preservation requirement |
|---|---|
| V6 H1 typing is 800 ms; H2 typing 560–1000 ms; final grapheme settle 120 ms | Preserve heading timing, segmentation, accessible source text, visual ownership and locale behavior. Only the new competition H2 joins this system. |
| Lanyard import starts after H1 completes, then the next animation frame; first exposed canvas frame has already advanced simulation | Keep this deliberate startup dependency. A generic design recommendation that every island start independently does not override it. |
| V6 ledger is `unseen → entering → done`, once per element per document | No persistent entrance completion in local/session storage. Hash navigation schedules a real visibility scan; it does not mark an entire destination section done. Reload gets a new ledger; BFCache retains the existing document's ledger. |
| Portrait fallback is the accessible image; canvas ready/error/live reduced-motion state controls exposure | Never show both portraits, hide the sole semantic image with `visibility:hidden`, or remove recovery after context loss/import failure. |
| Lanyard rests within About with strap below header; expanded render/hit area permits drag into Projects | Clip only new decorative layers or local photo windows. No new `overflow:hidden`, mask, containment, or pointer overlay on the whole About/lanyard ancestor. |
| Experience is manual; cancellation settles fractional coverflow positions, captions become hidden/inert synchronously | Preserve pending-click/outside/Escape/cancel handling and the existing frame owner. No autoplay, outgoing caption fade, or new deck controller attached to Experience. |
| Projects run at nominal 88 px/s with 24 px gaps, phase-preserving pause/resume and composed pause reasons | Preserve user pause, reduced motion, dialogs, visibility reasons, single physical hover highlight and no hover pause. |
| Four capability groups reference ten canonical skills; seven software items; all-closed groups are centered | Preserve current grouping, pointer exit, touch and keyboard parity. |
| Education remains two columns with its present layering; six canonical certificates plus two separate image-only samples, six per certificate page | Do not change certificate page size to three. Competition labels are newly mandatory; removal of old certificate sample captions does not remove competition dummy labels. |
| Canonical facts, roles, dates, links, contacts, portrait and both CVs were audited | New example achievements never enter CV templates, Person structured data, real credential counts, or canonical Experience records. |

Final V6 release evidence documents successful Pages run `42156366029` and the expected generated-island-UID difference between local and public HTML. That is historical release evidence, not a fresh V7 public check. Earlier “pending” deployment/bug text and obsolete Rapier/React Three Fiber proposals do not describe current source: the lanyard uses Three.js and custom simulation. Historical 44-test/22-browser-check results are not newly rerun results. Prior small nonzero layout shifts and software-rendered GPU measurements must not be relabelled “CLS 0” or hardware performance.

Protected file hashes checked during planning:

| Asset | SHA-256 |
|---|---|
| `public/assets/profile/muhammad-fajar-sodik.webp` | `7f02f1dce947a8d79a2f19d9839a8eda07237180d536ec4e1258b6aff609caa5` |
| `public/assets/documents/cv-muhammad-fajar-sodik-id.pdf` | `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b` |
| `public/assets/documents/cv-muhammad-fajar-sodik.pdf` | `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6` |

## Guidance actually read

Local skills read: `/home/yunachz/.codex/skills/caveman/SKILL.md`, `/home/yunachz/.agents/skills/orchestration/SKILL.md`, `/home/yunachz/.agents/skills/impeccable/SKILL.md`, and Impeccable's `reference/animate.md`. Impeccable context was loaded; its omitted design document was read separately in the documentation pass. The supplied brief and existing product/design context define the task, so no speculative design interview was added. Caveman applies to worker communication; this durable implementation specification retains full technical detail.

Official GSAP guidance was discovered from the official repository tree and directly read as resource files, not installed as local skills. These five `SKILL.md` files were fully read at repository commit `aed9cfd3277740755f6bfc1155c7aa645403b760`:

| Official resource | Bytes | SHA-256 |
|---|---:|---|
| [gsap-core](https://raw.githubusercontent.com/greensock/gsap-skills/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-core/SKILL.md) | 14792 | `3887b47e050ab5afbe2a9a820f23d39fa02ab785e06a343be44c6f91d84d12b3` |
| [gsap-react](https://raw.githubusercontent.com/greensock/gsap-skills/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-react/SKILL.md) | 6565 | `88e2a5312b45e8cc7b3c496637ff5bc9af2ae9c925b555c8b235b34cbc989d74` |
| [gsap-frameworks](https://raw.githubusercontent.com/greensock/gsap-skills/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-frameworks/SKILL.md) | 10621 | `842d9d3659ec3ddc8abbdc524708f8facf81f468ac25d0577f48c759c4fa31e6` |
| [gsap-performance](https://raw.githubusercontent.com/greensock/gsap-skills/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-performance/SKILL.md) | 4139 | `cb5408d6fba707aabcbfe3320317a14c1f8fca6070074e5261047930f50d441e` |
| [gsap-timeline](https://raw.githubusercontent.com/greensock/gsap-skills/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-timeline/SKILL.md) | 4394 | `1a8b0f39cc4be3ed3d834b89672e4ae2f151b901dc3450bebf10bbc45379fe02` |

Durable copies are in `.checkpoints/v7-planning-pause-2026-11-06/resume-02/v7-planning-sol/external/` (core/react/performance/timeline), and `resume-02/v7-planner/external/` (frameworks). Their HTTP manifests identify successful direct retrieval. A saved ScrollTrigger file exists but is not counted as a fully read skill here. No independent local skill named `gsap`, `motion-design`, or `apple-design` was loaded by this planner, and no designer-only skill claim is inherited.

Applied principles: scope animation to its root; give each property one owner; make effect cleanup symmetrical; perform browser work only after mount; batch geometry reads; use reusable pointer targets rather than spawning tweens per event; animate transform/opacity where possible; reserve `will-change` for active work; respect live media-query changes and offscreen/hidden lifecycle. Impeccable supports meaningful restraint, clear status, usable controls, and reduced-motion alternatives. These principles do not require adding a GSAP runtime. **Dependency decision: keep native WAAPI/CSS/rAF, retain existing React/React DOM, add zero packages.** No `gsap`, `@gsap/react`, animation library, or shadcn CLI run is proposed for this scope.

## Reference inspection and design reconciliation

The original competition video is 854×480, 30 fps, 200 encoded frames, approximately 6.67 seconds of video (container duration approximately 6.85 seconds), SHA-256 `3298286910125e384ef478bffe30048df6410e07db029b5bf3c82478e04e2351`. The About video has 253 frames, approximately 8.43 seconds of video (container approximately 8.46), SHA-256 `fda5d4452c951480040eef4c5357ff456db68db64394ff0e0d0371f58e93ac72`. Durable original copies remain in the parent V7 planning checkpoint. The requested Downloads paths are recorded in the brief.

This planner inspected all 80 competition and 101 About extracted samples at 12 fps across the entire video timelines, then inspected individual full-resolution competition samples 48, 58, 66 and About sample 51 to resolve actual stack motion. The sample images are in `resume-02/v7-planning-sol/video/{competition,about}/`; this worker's ten labelled filmstrips are in `.checkpoints/v7-planning-sol/`. This is actual full-span sampled video inspection, beyond the two coordinator contact sheets; it is not native playback, audio analysis, event telemetry, or a new optical-flow measurement.

Observed competition behavior: an editorial sequence of alternating photo/text rows; the right-hand HACK FOR GOV 4 stack cycles from an award/group image to people at laptops around 3.92–4.0 seconds, then to an outdoor group around 4.75–4.83 seconds, then people around a table around 5.33–5.58 seconds. Cards fan/rotate and change foreground order. Around 1.7–2.1 and 2.67–3.07 seconds the page is scrolling/repositioning; these are not proven photo swaps. The video does not establish a full wrap cycle, exact transforms/easing, a verified `1 / 3` counter, or click event timestamps. The accessible counter, modulo wrapping and calibrated 340 ms motion below are implementation proposals.

Observed About behavior: oversized outlined repeated name text drifts left behind the foreground portrait. Theme transition circles also appear, but are outside this request; retain the portfolio's existing theme interaction. Use **Muhammad Fajar Sodik**, never the reference person's name/portrait/branding. The supplied grid screenshot shows a light background, thin purple grid/nodes, and local curvature around the cursor. It cannot prove elastic decay or a precise displacement radius. The portfolio should use its current accent tokens in both themes; 52 CSS-pixel spacing is a proposed starting value, not a screenshot measurement.

Reconcile `V7-DESIGN-MOTION.md` as follows before implementation:

| Design proposal/claim | Resolved plan |
|---|---|
| Useful alternating rows, outline name, low-contrast grid, separate entrance/interaction wrappers | Adopt these directions, adjusted to current source and reduced-motion behavior below. |
| Photo transitions measured at frames 52–62 and another early cluster | Those spans show page movement. Do not use them as measured click timings. Use the later observed swaps; treat final motion values as calibration. |
| Copying named national awards, organizations/dates or real project photos into dummy wins | Use generic clearly labelled example competitions and existing placeholder assets only. No new factual achievements. |
| Glare is roughly 60 lines, or a vanilla algorithm port is interchangeable | Exact JSX is 9,501 bytes with lifecycle machinery. Include the actual React component; do not replace the user-requested component with an imitation. |
| Native `threshold: 0.4` guarantees first entry at 40% | Callback tests only `isIntersecting`; an initial positive intersection may trigger earlier. Add an explicit ratio/eligibility guard. |
| Hover mode continuously follows pointer movement; smootherstep is the sweep ease | Hover sweeps on enter/leave; `follow` handles pointer tracking. Sweep easing is cosine; smootherstep constructs gradient stops. |
| Single island means one shared vendor observer | It means one React root. The exact component still creates per-instance observers; eight instances are bounded and must be cleaned up. |
| 14 px radius / max-width 360 px / 1.64 ratio in sample code | User asks 20 px; 360×240 is the reference footprint, not a new rigid gallery size. Preserve current responsive figure sizing and image containment. |
| Every component independent, including initial lanyard | Keep V6's H1-to-lanyard startup gate. Other eligible non-heading elements retain independent viewport entrances. |
| Continuous CSS marquee with no user control | Add a small shared About motion pause control because the decorative drift lasts longer than five seconds. |

Do not edit the designer's document in this planning task. This reconciliation is the precise implementer contract; the coordinator/designer should resolve any later visual disagreement on a reviewable preview.

## Competition content and rendering contract

Place `#competitions` after Experience and before Credentials, as a new `CompetitionSection.astro` composed into `HomePageV3.astro`. Add its bilingual navigation item through the existing nav array/i18n system. Keep existing anchors stable. Heading: `Kompetisi & Prestasi` / `Competitions & Achievements`; intro and each record visibly explain the example state.

Add a strict `competitions` Astro JSON collection. File basename supplies stable ID; fields:

```text
order: integer; draft: boolean (default true); isDummy: boolean
outcome: "winner" | "award" | "finalist" | "participant"
copy: { id, en }, each containing nonempty title, status, description
photos: nonempty array of { src, width, height, kind, alt: { id, en } }
```

Require `copy.id`/`copy.en`, nonempty localized status for every outcome, and every image alt. Use the established local-asset validator and `sitePath` base handling. For `isDummy: true`, require `kind: "placeholder"` and an existing path under `/assets/placeholders/`; render the `Data contoh / Example record` badge from this flag so a title edit cannot silently remove the label. Editorial review must confirm that the supplied non-winning statuses are encouraging; do not implement a brittle keyword test for tone. Add `competition: 'assets/competitions/'` to the validator's photo-directory map for future genuine replacements; no new photo files are needed now. No organizer or date is needed for examples; optional genuine metadata can be added later with a specific content/schema revision. Do not use `sourcePages` to imply CV provenance for these examples.

The authorized four visible examples have `draft: false`, `isDummy: true`, deterministic orders 10/20/30/40. `draft: true` would filter them out in the existing publication convention. `isDummy` is the factual disclaimer, distinct from publication state. The entire section also says `Empat data contoh untuk menguji tampilan dan paginasi; bukan prestasi terverifikasi.` / `Four example records for layout and pagination testing; these are not verified achievements.` No aggregation into verified achievements or CV content.

| Stable file ID | Bilingual title | Result/status | Activity description |
|---|---|---|---|
| `example-automation` | Contoh kompetisi otomasi / Example automation competition | Contoh — Juara 1 / Example — 1st place | Contoh aktivitas: menyusun alur kontrol dan menguji urutan kerja sistem. / Example activity: designing a control sequence and testing the system workflow. |
| `example-iot` | Contoh tantangan IoT / Example IoT challenge | Contoh — Penghargaan ide / Example — Idea award | Contoh aktivitas: merancang pemantauan sensor dan menjelaskan hasil pengujian. / Example activity: planning sensor monitoring and presenting test results. |
| `example-robotics` | Contoh kompetisi robotika / Example robotics competition | Belum meraih penghargaan — terus berkembang. / No award this time — keep building. | Contoh aktivitas: menguji navigasi prototipe dan mencatat perbaikan untuk percobaan berikutnya. / Example activity: testing prototype navigation and recording improvements for the next attempt. |
| `example-control` | Contoh tantangan sistem kontrol / Example control systems challenge | Belum meraih penghargaan — pengalaman untuk langkah berikutnya. / No award this time — experience for the next step. | Contoh aktivitas: mencoba strategi kendali dan mengevaluasi respons sistem. / Example activity: trying control strategies and evaluating the system response. |

Rows one/two use `winner`/`award`; rows three/four use `participant`. The visible example badge remains next to every status, including the non-winning statuses. All descriptions explicitly describe examples, not Muhammad Fajar Sodik's verified activity. These proposed strings may receive bilingual editorial polishing without introducing facts.

Use three existing images per record so every deck can exercise 1→2→3→1. Reuse `gggggg.jpg` (1920×1080), `experience-electrical-competition.svg`, `experience-ksm-iot.svg`, `experience-ksm-mekatronika.svg`, `skill-control.svg` (each SVG viewBox 1200×750), in differing orders. Keep dimensions accurate, localized alts identifying illustrative examples, and `kind: "placeholder"` even for the existing JPEG. All five paths/dimensions/hashes were checked in [final evidence](../.checkpoints/v7-planning-sol/final-verification.json). Do not use protected portrait/CVs, canonical project photos, fetched stock, generated media, or the reference person's images.

### Pagination and photo interaction

Use `chunkRecords(records, 3)` and `clampPageIndex` from the existing generic helper; leave `CREDENTIAL_PAGE_SIZE = 6` and real/sample certificate separation unchanged. Competition pages contain three vertically arranged editorial rows and then one row, not three tiny side-by-side tiles. At desktop, alternate media/text columns; at narrow widths use photo then text for each row while preserving meaningful DOM reading order. The second page contains no filler achievements.

Match certificate-style horizontal page translation with a viewport and full-width page flex items. A track sized to `pageCount * 100%` translates by `-pageIndex * 100 / pageCount%`; avoid the common double-width percentage error. Use 360 ms `cubic-bezier(.2,.8,.2,1)` as the initial pager calibration. Set inactive pages `inert` and `aria-hidden` synchronously, and queue the existing V6 entrance visibility scan after selecting the page and after settling. Only actually visible row sub-elements consume their entrance IDs. Keep the pager outside moving pages so it retains focus.

Buttons are native Previous/Next with localized names, 44 px targets, disabled boundaries, and `Halaman 1 dari 2 / Page 1 of 2` status. Hide the pager when page count ≤1. Do not wrap pages, autoplay, hijack wheel/vertical scroll, or require drag. Touch uses the same buttons and deck tap; page swipe is unnecessary for the requested behavior and is not included in this initial scope. Keyboard arrows can operate the focused pager, not the entire document. Preserve the selected page and photo indices on locale/theme changes.

Use a native button for the clickable photo surface with a localized “next photo” name, a visible `1 / 3` counter and short `Klik foto / Click photo` hint; adjacent Previous/Next photo buttons sit outside it, never nested. Enter/Space advances the surface; scoped ArrowLeft/Right navigates within its deck and does not bubble into pager handling. Touch tap is equivalent. One image is accessible as current; background stack images are decorative (`alt=""`, `aria-hidden`), with no hidden focusable descendants. Announce user-requested image changes politely, not initial layout or locale refresh repeatedly. Do not open the certificate dialog from competition images.

`v7-competitions.ts` owns page selection, active-page accessibility, focus restoration if necessary, photo indices and deck frames. `competition-state.mjs` supplies testable pure clamping/wrapping and generation/target decisions. Each deck has one `createFrameOwner` instance; no uncancelled timer chains. A proposed 340 ms shuffle is 140 ms outgoing displacement plus 200 ms settle, approximately +24 px/−14 px/+5° for the departing front image, then reorder to the back. Keep rear images at modest ±3°/±6° and a few pixels of offset. These are design values, not measurements from the clip. Repeated fast clicks advance from the latest logical target and rebase the current visual pose under a new generation; stale completions cannot overwrite it. Page change, pointer cancel, hidden tab, live reduced motion and cleanup finish at the selected stable photo and cancel pending work. No continuous photo motion or automatic cycling.

Without JS, all four row descriptions and their first images remain readable in normal document flow, with no clipped second page, disabled-only navigation dependency, or invisible labels. Hide enhancement controls until initialization succeeds; enable the horizontal pager only after state and measurement are ready. If image decoding fails, preserve frame size, alt/error affordance and usable remaining photos. No forced viewport-height section or animated section-height that creates large layout shifts; measure/set active track height without a height tween and ensure lower sections remain reachable.

## Entrance extension and ownership

Keep `v6-entrance.ts` as the sole once-only entrance controller. It already snapshots SSR `data-v6-enter` markers, deduplicates aliases/clones, excludes the header from visibility, tests actual clipping/area, finishes entries on real interaction, handles hash scans, hidden tabs and reduced motion, and preserves H1/lanyard coordination. New competition markup must be server rendered before this snapshot. Do not mount new entry markers later inside the glare island or invent a second section-wide reveal ledger.

Add a small allowlisted non-heading preset selector (`data-v6-preset`) to the existing controller. Unknown values fall back to current behavior. Keep all heading and lanyard branches unchanged; keep the existing `data-v6-safe`/interactive safeguards. Marker/observer stays on a stable outer element; `data-v6-enter-target` points to a dedicated visual child when another owner already uses transforms. Avoid a blanket scale/blur/clip animation on every component.

| Target | Proposed entrance | Owner and separation |
|---|---|---|
| Header, buttons, controls, contact links | Retain safe baseline: opacity .72→1, travel ≤5 px, 360 ms, delay 0 | V6 only; immediate usable/focusable controls, interaction finishes active entry. |
| About field/intro/facts, section explanatory copy, footer copy | Opacity 0→1, y 12→0, 480 ms | V6 visual wrapper; no marquee/text splitting inside semantic body text. |
| Project cards | Opacity and y 14→0, 480 ms, no scale | Existing project slide owns carousel position; entrance targets its visual child, hover remains separate. |
| Skill groups/software/education | Opacity and y 12–16→0, 480–520 ms, 40 ms local stagger capped at 160 ms | Entrance wrapper outside expansion/tile interaction, no changes to group geometry or two-column layout. |
| Experience active card/caption | Small safe fade/travel on a dedicated visual child | Existing coverflow and caption state retain exclusive position/visibility ownership; finish leaving entry before cancellation/hiding. |
| Competition media and text | Separate IDs `competition:<id>:media` and `competition:<id>:copy`; x ±18→0 desktop, y 12→0 mobile; 520 ms, secondary delay 60 ms | V6 outer visuals; deck inner photo layers own shuffle. No row-wide gate waiting for heading. |
| Certificate card content | Opacity/y 12→0, 480 ms | New inner entry visual wrapper; existing anchor hover transform stays on anchor, GlareHover only owns its specular overlay. |

Use existing `cubic-bezier(.16,1,.3,1)` for entrances. Start stagger calculations within each actual visible group, never an ever-growing global index. All non-heading entries remain independently visible-triggered and once per document; theme/locale/resize/rescroll does not reset them. Reduced motion immediately exposes/consumes entries; focus, click or pointer-down on a real control makes it usable immediately. A JS failure must leave server content visible after the existing preflight timeout. Do not add persistent hidden CSS dependent on a new script succeeding.

If wrappers are added, put layout sizing/flex/grid behavior on the structural wrapper and let the visual child fill it; check selectors such as direct-child skill/project rules. Do not animate both `transform` and independent `translate` for different owners on the same node simply because CSS allows composition. Permanent transforms, hover and entrance must have explicit separate nodes.

## Exact React Bits inclusion

The exact [user registry URL](https://reactbits.dev/r/GlareHover-JS-CSS.json) was fetched by direct HTTP with a browser-like User-Agent after the browser retrieval failed. Reuse the verified task snapshot; do not blindly rerun `npx shadcn` or silently fetch a newer version. The saved HTTP manifest records status 200 at `2026-11-06T09:57:34.946071+00:00`. This worker re-read and verified that each extracted file exactly equals the corresponding JSON `files[].content`.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `GlareHover-JS-CSS.json` | 11430 | `8bb09c07743680d4da8d22c2b7ed3218421d75a5e4da2f3617efe78102252f04` |
| `GlareHover.jsx` | 9501 | `2279e8920957cea3570cec387f184a76f23281ae2e59ccc5299cb5a71bb90fc2` |
| `GlareHover.css` | 1045 | `556debf36792dd1a774b27f96c120494b7d2a1ed19c188f2b30faf5df31f2b35` |
| Upstream `LICENSE.md` fetched from DavidHDev/react-bits | 2060 | `4bdd1fa59a6b7d5954bc3b213dbc34e455c635a94bbcecf9293553797d0fad02` |

The upstream license is **MIT plus Commons Clause**, copyright 2026 David Haz, not plain MIT. Preserve its entire text and a source URL/fingerprint notice next to the vendored files; do not replace it with the lanyard's license or assume all React Bits snippets share a plain-MIT grant. This is source provenance, not a new deployment approval flow.

Registry `dependencies` and `registryDependencies` are both empty. Source imports React hooks and its local CSS. Existing manifest already includes React/React DOM `^19.3.1`, `@astrojs/react ^7.1.2`, Astro `7.4.4`, TypeScript `^5.9.3`, and Three `^0.180.0`. Empty registry dependencies does not mean a vanilla component with no React requirement. No package/lockfile changes are needed.

Actual API: `width`, `height`, `background`, `borderRadius`, `borderColor`, `children`, `glareColor`, `glareOpacity`, `glareAngle`, `glareSize`, `softness`, `variant`, `blendMode`, `rimGlint`, `mode`, `transitionDuration`, `interval`, `playOnce`, `intro`, `className`, `style`. Modes in source are `hover`, `follow`, `click`, `loop`. There is no public imperative `play()`/`sweep()` ref; the internal `engineRef` exposes `measure` only. `playOnce` suppresses leave reversal; it is not a once-per-document introduction ledger.

Exact requested effect configuration, with the allowed responsive outer-size adaptation:

```jsx
<GlareHover
  width="100%" height="100%" background="transparent"
  borderRadius="20px" borderColor="transparent"
  mode="hover" variant="streak"
  glareColor="#ffffff" glareOpacity={0.5} glareSize={30}
  softness={0.6} glareAngle={-45} blendMode="screen"
  rimGlint={true} transitionDuration={650}
  intro={true} playOnce={false}
/>
```

The user reference is 360×240; do not force a 240 px image frame into the current mobile gallery. Current certificate CSS uses height `clamp(164px,18vh,220px)` and 132 px at the mobile rule, with responsive columns and `object-fit: contain`. Retain those fit/responsive rules, apply the requested 20 px visual radius to the image frame, and use the actual frame's width/height for the component. Do not add `max-width:360px`, change image crop, change downloads, or force a 1.64 aspect ratio. Validate whether overlay border-box sizing needs a scoped zero border to avoid a one-pixel rim mismatch; record any CSS adaptation.

### One enhancement island; static certificates remain authoritative

Add one `CredentialGlareEnhancement.jsx` React island near the gallery, loaded `client:visible` using a real visible bootstrap box (not a zero-size element that may never intersect). It server-renders no replacement image/content. On mount it finds the eight stable image-frame slots and uses React DOM `createPortal` to render one actual GlareHover instance per slot. Keep instances keyed by credential kind + ID, mounted across certificate page/locale/theme changes. One root avoids a separate Astro hydration root per image; it does not magically eliminate eight bounded component observers.

Each existing Astro certificate anchor, figure, image, localized title, `data-credential-open` and JSON payload remains in place. Add an empty absolute-positioned enhancement slot over the image frame; the actual transparent GlareHover root fills it and receives pointer enter/leave. Its empty `children` is a supported API use; the static image remains below the root. The overlay's spans already have `pointer-events:none` and `aria-hidden`; the root has no text, tab stop or role. Native click bubbles through the slot to the existing anchor and document viewer delegation. Do not `preventDefault`, replace the anchor, or create a second viewer. Do not put `aria-hidden="true"` on the root/slot containing a pointer target: the existing viewer handler deliberately rejects a trigger inside an `aria-hidden` subtree. Keep the vendor's decorative span attributes.

The new entry visual wrapper surrounds the original figure/title inside the anchor, so the V6 entrance animates this wrapper while anchor hover keeps its own transform. No new V6 registration occurs on hydration: all markers/targets already exist in SSR markup. If hydration/React/CSS fails, the original certificate images, direct image hrefs, payloads, modal and downloads still work. Scope the vendor CSS to these slots and ensure the decorative root does not obscure focus rings. Keyboard users retain the anchor's visible focus, Enter-to-view and complete download behavior; an additional keyboard glare sweep is optional and not a requirement to activate a certificate. Do not synthesize mouse events to make an introduction.

Layering of a transparent GlareHover portal over a sibling image is an integration risk to inspect early: verify `isolation`, screen blending and border/rim output in both themes. The actual upstream gradient/rim engine must remain recognizable and used. If this exact overlay fails visual validation, stop for a scoped design/coordinator decision about a single shared SSR React gallery rather than silently substituting a CSS glare or eight islands.

### First entry, hover and narrow lifecycle adaptations

Native `intro={true}` plus `mode="hover"` already cooperates: the component's `introRef` performs one introduction on intersection; pointer enter starts a directional sweep and pointer leave reverses it when `playOnce=false`. Hover pointermove does not continually change the effect; that is follow mode. Keep hover mode and 650 ms sweeps. Intro/hover both use the same vendor sweep/rAF owner, so hover during an intro retargets that owner rather than starting a second animation.

Vendoring must start from the byte-verified exact JSX/CSS, with a provenance file describing the following **explicit local adaptations**, not claiming a byte-identical modified component:

1. In its existing IntersectionObserver, require `intersectionRatio >= .4` and actual visible eligibility (connected, current certificate page, not inert/aria-hidden/hidden, below fixed header). Incorporate header exclusion via the observer's root margin, refreshing only on header-size changes; do not run a second intro observer. Hidden-page or hydration-before-visibility callbacks cannot consume intro. If hover happens first while eligible, treat that visible sweep as the introduction to avoid a delayed duplicate sweep.
2. Retain the native per-instance `introRef`; mark introduction consumed when a visible eligible image is skipped under reduced motion. Stable portal instances ensure returning to a page/locale/theme does not replay it. The current document owns this state; no storage. Offscreen unseen certificate samples remain eligible for their first actual entry later.
3. Replace the initial-only reduced-motion snapshot with a live matchMedia listener. Reducing motion cancels the sole rAF, removes current specular presence and consumes the visible intro; later returning to normal does not replay it. Hover may resume on a later intentional hover only.
4. On hidden document, page becoming inert or image leaving visibility, cancel active finite sweep and restore an unobtrusive off-frame resting band. No active animation keeps painting hidden cards and no interrupted intro replays on return. A visibility/inert-state check can be driven from the existing observer plus one shared active-page/visibility notification in the enhancement root; do not add timers/polling. Certificate page selection should emit a small internal state notification after its existing DOM updates; it does not gain ownership of glare transforms.
5. Cleanup cancels rAF/timers and removes pointer/focus/visibility/media listeners, ResizeObserver and IntersectionObserver. No global selector mutation or perpetual loop mode. Source already cleans many resources; extend that cleanup symmetrically.

Use explicit internal notifications: `v3-ui.ts` dispatches `portfolio:credentialpagechange` after it sets page DOM state, and `portfolio:localechange` after locale DOM updates. New modules read current root state at initialization as well, so they cannot miss an initial event. The single glare bridge listens once to page/visibility changes and forwards a private eligibility event to its mounted component roots; the annotated vendor patch rechecks visibility/cancels its existing engine from that event. This adds no invented public GlareHover props or imperative API. It must not re-create instances or reset `introRef`. The About module can observe the existing root theme attribute only to redraw its static canvas colors.

Keep the local lifecycle patch small and annotate it against the stored upstream fingerprint. Do not rewrite the projection, cosine sweep ease, 33-stop gradient construction, streak/rim algorithm, API names or requested visual settings. Unsupported `color-mix`, mask or blending paths should degrade to a static image with no effect, never hide the image. Reduced-motion absence of glare is an intentional accessible alternative.

## About name, grid and controls

Add `AboutMotion.astro` as a decorative sibling behind the existing hero content/lanyard, with its own absolute clipped background layer. It contains repeated, uppercase outlined `MUHAMMAD FAJAR SODIK`, `aria-hidden="true"`, pointer-events none, no duplicated accessible heading. Keep the real H1 unchanged. Use existing font/accent tokens, `clamp()` sizing, approximately 0.08–0.14 outline opacity and a soft local readability mask. Place the line around the middle of the About composition; do not move foreground layout or mask the portrait/strap.

Use two identical name groups with a gap included in each measured group width; animate exactly one group width left, making the loop seamless. Initial calibration is 26 seconds per repeat group; adapt duration from measured width if needed to avoid much faster narrow-screen motion. On resize/font-ready, preserve phase when recalculating geometry. Only the marquee child owns its `transform`; no entrance animation targets that same element. Reduced motion uses one static clipped outline name, not translated duplicate text. With JS failure it is also static.

Use one lightweight 2D canvas for a restrained cursor-distorted grid, scoped to About. It is decorative (`aria-hidden`, pointer-events none), below foreground content, using theme accent/neutral tokens. Proposed starting mesh: 52 CSS-pixel spacing, 1 px lines, low opacity, deformation radius approximately 140 px, maximum displacement 12 px. Use a smooth distance falloff away from the pointer; draw polylines through displaced grid points so lines actually curve, not merely move a radial-gradient highlight. Static screenshot values are not measured motion parameters.

`v7-about-motion.ts` owns grid geometry, one demand-driven frame owner, marquee pause reasons and lifecycle. Read pointer coordinates on passive events, cache bounds on resize/scroll scheduling, then compute/write in the scheduled frame. Cap canvas DPR at 1.5 and avoid blur/filter chains or per-cell DOM nodes. Animate only while the pointer target/settling state changes; stop when displacement is below a small threshold. Pointer exit resets smoothly to static grid. Coarse-pointer/touch and reduced motion get a static grid without following, pointer capture or touch interception. Canvas/context failure leaves a faint CSS/static grid or no decorative grid; content remains usable.

Suspend name/grid when About is offscreen, document hidden, a modal is open, the new About motion control is paused, or reduced motion is active. Resume only when all pause reasons clear; user pause must survive viewport/visibility changes within the current document. Observe the existing dialog's `open` state rather than changing dialog ownership. A subtle 44 px native button in About says `Jeda gerak latar / Pause background motion`, with pressed state and `Lanjutkan gerak latar / Resume background motion` when paused. This is a local control for the added name/grid, not a replacement for project Pause or system motion preferences. Leave it hidden until initialization succeeds; no storage requirement.

Freeze/reset grid following while the lanyard is captured, to reduce motion competition during manipulation. The lanyard's `sim.grab` is private; do not invent a public property or alter physics. Its actual `.lanyard-hit-area` calls `setPointerCapture` only after a real card hit. Listen for `gotpointercapture` / `lostpointercapture` on that area (capture-phase delegation tolerates late island mount), plus pointer cancel/up and Escape cleanup. If capture is unavailable, conservatively suspend following during pointer-down in that area until release; never prevent or stop lanyard events. Preserve the expanded hit area outside About and its current Escape/context-loss/unmount cleanup. No `Lanyard.jsx` change is needed for the planned public event observation.

At mobile widths, reduce outline size/opacity, keep a static grid on coarse pointers, and confirm labels/button do not collide with hero actions or lanyard. Do not introduce a cursor replacement, magnetic navigation, new theme reveal, scroll hijack, or another perpetual foreground animation.

## Proposed implementation file scope

This is the allowlist for the next implementation stage, **not files changed by this planning worker**. Expand scope only for a concrete source discovery and report why.

| File(s) | Responsibility |
|---|---|
| `src/content.config.ts` | Strict competitions collection and localized photo/content schema; export new collection. |
| `src/content/competitions/example-automation.json`, `example-iot.json`, `example-robotics.json`, `example-control.json` | Exactly four published, explicitly dummy examples and existing placeholder references. |
| `src/components/CompetitionSection.astro` | SSR two-page 3+1 editorial rows, accessible deck/pager markup and entry markers. |
| `src/lib/competition-state.mjs` | Pure photo wrap/page/transition target logic, importing/reusing existing generic pagination where appropriate rather than changing certificate size. |
| `src/scripts/v7-competitions.ts` | Progressive enhancement, deck frame owners, horizontal pager, cancellation, locale notifications. |
| `src/components/AboutMotion.astro`, `src/scripts/v7-about-motion.ts` | Scoped background markup/control, canvas mesh, marquee phase and composed pause lifecycle. |
| `src/components/react-bits/GlareHover.jsx`, `GlareHover.css`, `LICENSE.md`, `PROVENANCE.md` | Exact fetched component baseline plus documented minimal eligibility/lifecycle patch and full upstream license. |
| `src/components/CredentialGlareEnhancement.jsx` | One enhancement root, stable React portals, shared visibility/page notifications. |
| `src/components/HomePageV3.astro` | Compose new section/decor; add nav entry, SSR visual wrappers and credential slots; mount the single glare island and V7 scripts. Preserve existing payload/content. |
| `src/scripts/v6-entrance.ts` | Allowlisted non-heading preset selection; retain current ledger/heading/readiness logic. No second entrance controller. |
| `src/scripts/v3-ui.ts` | Emit internal locale-change and certificate-page-state notifications after existing DOM updates. Existing manual Experience/project/viewer algorithms remain unchanged. |
| `src/lib/i18n.ts` | Bilingual navigation, section, labels/status, photo controls and About pause labels. |
| `src/styles/v3.css` | Scoped V7 layout, enhancement-only pager rules, visual-wrapper sizing, motion-safe/reduced-motion styles, responsive photo frames and 20 px certificate radius. |
| `scripts/v3-content-validation.mjs`, `scripts/validate-v3-content.mjs` | Load/validate/count competitions without changing canonical counts or CV generation; reject invalid/local missing media and unlabeled dummy content. |
| `tests/competition-state.test.mjs`, `tests/v3-content-validation.test.mjs` | Meaningful state/cancellation/content cases, including updating existing fixtures for the new collection; do not create shallow tests that merely assert CSS constants. |
| `docs/CONTENT-GUIDE.md`, `docs/V7-IMPLEMENTATION.md`, `docs/V7-QA.md` | Later replacement instructions, actual implementation/provenance deviations, measured verification and preview review decisions. |

Existing `src/lib/credential-pagination.ts` and `src/lib/raf-owner.ts` should be imported unchanged. `PortfolioLayoutV3.astro`, `AboutLanyard.jsx`, `lanyard/Lanyard.jsx`, its CSS/config, project motion helpers, protected media, canonical collection records, CV templates, `package.json`, lockfile, Astro/Vite configuration, workflows, build output and Git index are outside the planned edits. If a loader/import boundary requires a layout change, prefer the homepage's own processed script first and document the narrow adjustment.

## Stages and acceptance gates

1. **Freeze and data/static layer.** Reconfirm HEAD and protected hashes; preserve untracked docs. Add schema/validation, four JSON examples, SSR section/navigation and no-JS layouts. Validate 3+1 grouping with explicit size three, stable ordering, localization, dummy labels and exclusion from canonical facts. Preview static desktop/mobile layout before adding motion.
2. **Interaction layer.** Implement pager/deck using one owner per property, stable state and interruption rules. Exercise all four decks, 1→2→3→1, previous wrap, fast inputs, one-photo fallback, 0/1/3/4/6/7-record helper cases, and focus/inert behavior. Confirm page-two row remains reachable with no height trap.
3. **Entrances.** Add wrappers/presets incrementally, then regress existing V6 document/hash/interaction semantics. Do not migrate headings or lanyard startup. New competition page-two media/copy remain unseen until actually visible.
4. **Certificate component.** Copy verified upstream source/license/provenance; add one portal island and only documented lifecycle fixes. First inspect one representative real certificate and one sample at both responsive heights/themes, then all eight. Confirm actual React Bits intro+hover output and delegated viewer before widening animation work.
5. **About decoration.** Add name/static grid first, then demand-driven deformation and pause reasons. Test lanyard drag/capture/fallback before tuning opacity/speed. Calibrate on the actual preview with designer rather than treating reference frame estimates as measurements.
6. **Verification and review.** Run `npm run validate-content`, `npm test`, `npm run check`, `npm run build` once implementation is ready; run required focused regressions after any relevant failure/change. Capture preview evidence and actual bundle/runtime results. Obtain designer/coordinator review on the concrete preview before any publication. Do not stage broadly, reset, clean, commit historical docs, or deploy from this plan.

Required meaningful checks for the implementation report:

- **Data/copy:** four clearly labelled example records in both locales; three rows on page one and one on page two; no fake organizers/dates or verified-win claims; two encouraging non-win statuses; replacing JSON and toggling draft/isDummy does not require component edits; missing media, incomplete locale/alt, and invalid dimensions fail validation.
- **Pagination/decks:** real horizontal movement; inactive page content inert/hidden from accessibility, no offscreen tab stops; pager focus stable; visible current-photo counter; keyboard/touch/photo click equivalence; interruption cannot land on fractional/obsolete state; no duplicate listeners or animation frames after repeat page changes. No JS exposes all four records and first photos.
- **Entrance ledger:** hard reload at top, deep hash reload, delayed scroll, rapid hash changes, back/forward, BFCache, locale/theme toggle and reduced-motion toggle. H1/lanyard gate still occurs in order; actual first lanyard frame is advanced; portrait never doubles. Page-two entries trigger individually on real visibility and never replay during this document. No invisible content or disabled controls after a failed script/1800 ms preflight timeout.
- **Glare:** verify vendored baseline hashes and patch list; eight stable instances in one island; normal first entry once, later hover enter/leave, hover during intro, page-two first visit/return, live reduced-motion both directions, hidden tab mid-sweep, offscreen cancellation, StrictMode mount/cleanup if used in development, and hydration failure. Confirm no synthetic mouse intro, no loop mode, no remount on locale/theme. Images remain contained, direct image links and modal/download point to the same source bytes; modified clicks still work; Escape restores anchor focus; no `aria-hidden` delegation rejection.
- **About:** readable body/name in light/dark, narrow widths and 200% zoom; keyboard-visible pause with meaningful pressed/name state; hidden/offscreen/dialog/user/reduced pause reasons compose correctly; no work after disposal; DPR capped; fine pointer warps actual grid lines, coarse pointer is static; no keyboard/touch/scroll interception. Drag and flip lanyard beyond About into Projects, Escape/lost capture/cancel, resize, context loss and import failure still work.
- **V6 regression:** manual Experience only with rapid prev/next and interrupted drag/caption settling; project nominal speed/gap/phase and independent pause reasons; four skill groups/ten canonical references/seven software and all-closed centering; education columns; certificate six-plus-two pages; CV choice/preview/download; menus/theme/locale/contact copy and project dialogs; protected hashes unchanged.
- **Visual/performance:** capture at least 1440×900, 1024×768, 390×844 and 320 px wide, both themes/locales, with an extra reduced-motion view. No horizontal document overflow, clipped focus rings, distorted certificate images or unreadable status contrast. Reserve image/canvas dimensions; record actual CLS and isolate any changes rather than claiming zero. Check shared React bundle impact and idle/offscreen rAF behavior with real browser evidence; distinguish software GPU from hardware results. The grid/marquee must not noticeably degrade the existing lanyard. Disable/reduce decorative grid density before touching physics if contention appears.

## Evidence and remaining work

Durable task inputs were reused from `.checkpoints/v7-planning-pause-2026-11-06/resume-02/` after independently verifying hashes/content. This avoids relying on disappearing `/tmp` files or repeating successful downloads. This worker's own `.checkpoints/v7-planning-sol/` contains the documentation inventory/coverage, read and verification scripts, full-span labelled video filmstrips, and final git/external/dummy-asset manifest. A read result truncated or omitted by the tool was repaired as stated above; saving a file alone was never treated as reading it.

Planning validation confirms the released HEAD, all 73 unchanged input-document fingerprints, exact registry extraction, local dummy dimensions and no tracked/index changes. No product tests/build/browser execution was performed for a documentation-only change; test and preview statements above are acceptance requirements, not reported passes. Remaining work is coordinator/design reconciliation, authorization of Luna implementation, the staged product work and concrete preview review. Public deployment remains a later coordinator gate.
