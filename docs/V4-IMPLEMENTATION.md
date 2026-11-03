# V4 implementation notes

This documents the V4 revision work against the current revision brief. The V4 brief is the source of truth where earlier V3 notes disagree. Public facts and the supplied English and Indonesian CV files remain unchanged.

## What changed

- **Header and About:** The language control is a persistent `EN | ID` button. The approved About copy is preserved; the GPA mark is the sole About icon change and now uses a graduation-cap SVG.
- **Projects:** The filter, count, pause/play control, and arrows share a compact toolbar. The rail advances from `requestAnimationFrame` at 88 CSS px/s, repeats data-backed slides across the wrap seam, and supports filters, arrows, drag, and pause. It pauses while hidden, offscreen, dragged, reduced-motion is active, a project dialog is open, or a moving project card has keyboard focus. Hover and toolbar focus do not pause it.
- **Sections and capabilities:** Section dividers are compact. Skills are an accessible accordion with one expanded item, arrow-key navigation, and a separate tab for the seven software entries. Closed skill details are inert and removed from the accessibility tree.
- **Education:** Institution marks are optional local assets with validated intrinsic dimensions. Entries without an institution mark remain typographic and do not receive invented logos.
- **Experience:** The manual coverflow uses five data-backed positions (center, two flanks, and two rear cards), modulo navigation, arrow/Home/End keys, click/tap on the visible side cards, and horizontal drag. The center image is capped at 480 px, with measured desktop widths of 400 px at 1366, 460 px at 1440, and 480 px at 1920. Captions cross-fade with the image; only the active caption is exposed to assistive technology. There is no visible bottom navigation or counter.
- **Certificates:** `src/lib/credential-pagination.ts` chunks the real collection into six-record pages and clamps stale page state. The page controls appear only when more than one page exists. Card activation opens a dialog with the certificate title and contained image; unsupported issuer/date metadata is not added.
- **Contact and appearance:** Email copy gives localized text and live-region feedback for 2.2 seconds, then restores the address. Switching languages during that period keeps the success state and deadline. Light mode has a moving, white-dominant blurred gradient; dark mode hides it, and reduced motion disables its animation.

## Data and maintenance

Projects remain Markdown records. Skills, software, experience, education, certificates, profile, and contact stay in their data collections; page elements are rendered from those records. No QA-only certificate records are shipped. `npm run validate-content` now also checks optional education-logo paths and positive dimensions. See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for authoring instructions and examples.

`tests/credential-pagination.test.mjs` creates in-memory collections of 6, 7, 12, and 13 records and checks page membership, ordering, partial final pages, and stale-index clamping. These fixtures do not modify the public content collection.

The supplied CV PDFs retain these SHA-256 digests:

- Indonesian: `55dcc8b2b7d258dfad9a9bd544d511b97bb2a23e47e0cca01d9bbfba0adedb9b`
- English: `91ea5c19fa1e650fcdf16e5cb28438811f39afd1336bf6e9213302921773b6c6`

For measured browser evidence, viewport geometry, interaction checks, and remaining limitations, see [V4-QA.md](V4-QA.md).
