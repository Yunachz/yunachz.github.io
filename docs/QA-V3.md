# V3 QA evidence

3 November 2026. This is a staged QA record; the coordinator retains release acceptance. The latest static preview is available at `http://127.0.0.1:4321/`; V2 remains live until final acceptance.

## Source and build checks

Final source and preview checks:

- `npm run validate-content` passed: 5 projects, 10 skills, 7 software apps, 9 experiences, 4 education entries, and 6 certificates.
- `npm test` passed: 17 tests, including audited baseline facts as subsets, bilingual arrays, registry-backed category rendering/growth, published references, and optional sourced credential metadata.
- `npm run check` passed with 0 errors. Astro reports one deprecation hint for `document.execCommand`, retained as a fallback when Clipboard API access fails.
- `npm run build` passed after the archive layout, secondary-text contrast, and public-copy cleanup and produced 7 static routes: home, project archive, and all five project details.

The delivered source also clips experience side cards inside their stage, increases mobile body/fact sizes, improves hero fact-label contrast, restores 16px phone gutters, preserves truthful alt text for temporary certificate illustrations without showing an on-card label, resolves all project category labels from the shared registry, and handles canceled View Transition promises/native drag starts. Project autoplay no longer pauses for pointer hover or focus on its controls; it still honors manual pause, reduced motion, offscreen/hidden state, open dialogs, active drag, and keyboard focus on a moving card. The coordinator approved changing the email copy hint and footer copyright from the soft-muted token to the regular muted token. After rebuilding, the 768px homepage inspection reports `lowContrast=[]`; neither label is below the contrast threshold.

A mechanical public-copy scan found one obsolete provenance sentence in an unused legacy project-detail component; it has been removed. The repeated scan over public-facing source and `dist/` found no matches for the audited-CV/verification phrases, and the build retains the accepted GPA values (`3,72` in Indonesian, `3.72` in English) without a semester or scale.

## Initial production-preview inspection

Preview URL: `http://127.0.0.1:4321/`.

The initial design-inspector capture at `.taste-skill/v3-review/` found 176px horizontal overflow at 1440px, caused by experience-gallery side slides. The source gallery clip resolves the issue; the corrected home page capture at `.taste-skill/v3-review-final/` reports zero horizontal overflow, no culprits, and no broken images at 320, 390, 768, and 1440px. It measures 15.2px running copy on all four widths and no low-contrast text at 320, 390, or 1440px. The rebuilt 768px capture at `.taste-skill/v3-contrast-final/` also reports `lowContrast=[]` after the two label adjustments.

The inspector's mobile screenshots use a 200px capture height for its fold analysis. Its first-screen heading warning is therefore not a phone-height acceptance result. The inspector itself captured one theme/language combination per viewport; the coordinator separately covered the 16 viewport/language/theme layout combinations under reduced motion, with the 1440px overflow as the only layout defect.

Coordinator's final interaction evidence is in `docs/V3-QA-FINAL.md`. It covers the 16 homepage viewport/locale/theme combinations, project and experience dialogs/loops, mouse and touch dragging, autoplay pause/resume, circular theme reveal and rapid toggles, all four UI/document locale pairings for CV, clipboard result localization, contacts, menu focus, loaded images, duplicate IDs, and console output. Those checks passed on the corrected build before the archive-only style addition.

The design inspector then captured `/projects/` at 320, 390, 768, and 1440px in `.taste-skill/v3-archive-final/`. All four widths report `horizontalOverflow=0`, no overflow culprits, no broken images, and no console errors. A visual capture confirms the two-column desktop archive and single-column phone cards stay within the page margins. The inspector's remaining heuristic warnings concern intentional return navigation, card outlines/shadows, and absent video; they did not correspond to a runtime or overflow issue.

The final focused homepage capture at `.taste-skill/v3-final-certificate/` uses one 1440px viewport. It reports `horizontalOverflow=0`, no broken images, no console errors, and `lowContrast=[]`. The certificate row shows each landscape placeholder followed directly by its canonical name; no temporary-image label is visible, while the translated alt text still identifies the illustration honestly. The experience image is capped at 640px with a 16:9 ratio and visible adjacent-image navigation. `npm run check` on this scoped update reports 0 errors and 0 warnings (one existing `document.execCommand` deprecation hint); the build produced all 7 static routes.

Coordinator's final focused runtime pass also succeeded on this build: project autoplay advanced while pointer-hovered; manual pause kept its selected item; Play resumed while the control retained focus; clicking the previous/next experience images navigated and wrapped from the first to the ninth record; and mobile project/experience touch gestures worked without opening an item accidentally. The measured central experience image was approximately 638×358px inside the 640px cap. The coordinator confirmed the certificate label is absent in both locales across all six static cards, and 320/390/768/1440px showed no overflow or runtime errors.

The final Impeccable detector pass reports one warning: Geist is used throughout `src/styles/v3.css`. Geist is the approved primary face in `DESIGN.md`; no correction was warranted. The source detector did not report the requested light-mode gradient, software glass tiles, or card shadows. The browser taste inspector separately notes those visual treatments; they remain intentional parts of the approved V3 design. Its other style heuristics (such as return links, outlines, muted body text, and absent video) do not indicate broken behavior and were not treated as release failures.

## Release gate

The coordinator accepted the implementation and authorized publication after reviewing this evidence. The deployment and live-site check are recorded by the release workflow.
