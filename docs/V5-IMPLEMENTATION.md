# V5 implementation

- Date: 2026-11-03
- Baseline: published V4, `d3487c93169f150490b0cb4734ad81cb8edd7c07`

## Changes

- Project motion keeps fractional phase across rapid pause/play toggles, shares one animation-frame owner, resets its clock after suspension, and recomputes geometry from rendered card rectangles. Filtered grid cards now use a 24px gap and publish their physical width and pitch. Highlighting selects one visible hovered instance or one automatic instance.
- Experience coverflow updates continuously while the pointer is held, supports reversal, wrap and cancellation, and settles on the nearest item. Gallery media cannot be selected or dragged as a native image; the Activities disclosure has no separator line.
- Four bilingual, data-driven capability groups reference all ten canonical skill records. Group summaries and chips stay attached to those references. Software remains its separate seven-app collection. Desktop hover exit, keyboard focus and touch control can open or close groups.
- Education keeps natural content height and equal record spacing, removes the redundant UPNVJ summary while retaining its program, and fills one desktop viewport below the sticky header.
- Six canonical credentials stay in their own collection and CV. Two image-only demonstration tiles use a separate sample collection and carry no issuer, date, description or achievement claim. The dialog uses the same image URL for the localized download link and displayed image.
- Email success appears in the address button only; its polite live status is visually hidden. Failure remains visible. The light-theme ambient gradient follows scroll progress, the dark theme hides it, and reduced motion uses a stable treatment.
- The supplied content and visual assets, canonical credential names, CVs and approved visual identity remain intact. No framework or dependency migration was made.

## Content maintenance

`docs/CONTENT-GUIDE.md` documents the current collection schemas, bilingual copy, four-group-to-ten-skill mapping, separate sample records, and how to remove samples without changing CV or canonical credential counts.

## Preview

Local production preview: <http://127.0.0.1:4321/>. Keep this preview available for coordinator review.
