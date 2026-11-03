# V4 QA record

**Date:** 2026-11-03
**Preview:** `http://127.0.0.1:4321/` (built static output served by the local production preview)
**Browser:** Brave via Chrome DevTools Protocol
**Report:** `/tmp/v4-browser-report.json`

## Required checks

| Check | Result |
| --- | --- |
| `npm run validate-content` | Pass: 5 projects, 10 skills, 7 software apps, 9 experience records, 4 education entries, and 6 certificates. |
| `npm run check` | Pass: 0 errors and 0 warnings; one TypeScript hint notes the deprecated `document.execCommand('copy')` fallback. |
| `npm test` | Pass: 21 tests, 0 failures. The certificate pagination cases use in-memory fixtures for 6, 7, 12, and 13 entries. |
| `npm run build` | Pass: 7 static routes generated. |
| `git diff --check` | Pass. |

## Desktop section geometry

Each cell is `top / height` in CSS pixels. Section shell widths are 1160 px, positioned at x=103 (1366 viewport), x=140 (1440), and x=380 (1920). Theme changes did not change the geometry; Indonesian and English can differ where copy wraps.

### 1366 × 768

| Section | Indonesian | English |
| --- | ---: | ---: |
| About | 73 / 695 | 73 / 695 |
| Projects | 768 / 663 | 768 / 663 |
| Skills | 1431 / 591 | 1431 / 613 |
| Education | 2022 / 544 | 2044 / 501 |
| Experience | 2566 / 598 | 2545 / 598 |
| Certificates | 3163 / 564 | 3143 / 564 |
| Contact | 3728 / 285 | 3707 / 285 |
| Footer | 4028 / 74 | 4007 / 74 |

### 1440 × 900

| Section | Indonesian | English |
| --- | ---: | ---: |
| About | 73 / 790 | 73 / 790 |
| Projects | 863 / 718 | 863 / 718 |
| Skills | 1581 / 646 | 1581 / 668 |
| Education | 2227 / 558 | 2249 / 514 |
| Experience | 2786 / 646 | 2764 / 646 |
| Certificates | 3431 / 579 | 3410 / 579 |
| Contact | 4011 / 285 | 3989 / 285 |
| Footer | 4312 / 74 | 4290 / 74 |

### 1920 × 1080

| Section | Indonesian | English |
| --- | ---: | ---: |
| About | 73 / 790 | 73 / 790 |
| Projects | 863 / 775 | 863 / 775 |
| Skills | 1638 / 703 | 1638 / 725 |
| Education | 2341 / 577 | 2363 / 533 |
| Experience | 2917 / 673 | 2896 / 673 |
| Certificates | 3591 / 644 | 3569 / 644 |
| Contact | 4235 / 285 | 4213 / 285 |
| Footer | 4535 / 74 | 4514 / 74 |

## Responsive and accessibility checks

The browser measured 768 × 1024, 390 × 844, and 320 × 780 in both locales and both themes. In every case, document width matched viewport width; there was no horizontal overflow. At 125% zoom on 1440 × 900, document width also remained 1440 px. Mobile section heights grow naturally and scroll without clipping. At 768 × 1024 the skills section is 983 px high in Indonesian and 1005 px in English, so it extends below the initial viewport and uses ordinary page scrolling.

Reduced-motion emulation disabled the project auto-motion control and removed the background animation. The light gradient's computed transform changed between samples 1800 ms apart. Dialog Escape tests closed both dialog types; the project dialog returned focus to its visible opening card, and the certificate dialog returned focus to its opening card. Skill accordion checks found 10 records, one expanded item, and inert closed details. The software tab exposed all 7 entries.

## Motion and interaction evidence

- **Project rail:** A real card moved −123 px over 1.4 seconds (about 88 px/s). Explicit pause measured 0 px displacement over 700 ms. A 140 px drag shifted the rail by 140 px; filtering to IoT showed two real projects and hid the controls for that compact result set.
- **Experience gallery:** Measured center widths are 400 px at 1366, 460 px at 1440, 480 px at 1920, and 281 px at 390. At 1440 the center is x=490–950, with both side cards and both rear positions rendered; the mobile screenshot shows a 281 px center and visible flanks. At 120 ms into a transition, the outgoing and incoming captions had opacity 0.246 and 0.754 while the image transform was between positions. Keyboard navigation advanced two items, a hit-tested visible side card advanced one, horizontal drag advanced one, and a hit-tested mobile touch advanced one. No visible bottom controls or counter were present.
- **Certificates:** Six real cards appeared on the single page and pagination controls were hidden. The certificate dialog showed the title and image with `object-fit: contain`, without unsupported issuer/date fields.
- **Email:** Clipboard shim received `mfajarsodik.work@gmail.com`; success feedback localized during a language switch, then the address returned after the 2.2-second deadline.
- **Routes and files:** `/`, `/projects/`, and `/projects/fuzzy-fire-suppression/` completed with main content. Both CV PDF routes returned HTTP 200 with `application/pdf` (`6484` and `114160` bytes). Their SHA-256 digests are recorded in [V4-IMPLEMENTATION.md](V4-IMPLEMENTATION.md).
- **Runtime:** The report contains no JavaScript exceptions, browser console errors, or failed HTTP responses.

## Evidence files

- Full interaction and viewport report: `/tmp/v4-browser-report.json`
- Certificate dialog Escape/focus-return result: `/tmp/v4-focus-dialog-report.json`
- Desktop gallery screenshot: `/tmp/v4-experience-1440.png`
- Mobile gallery screenshot: `/tmp/v4-experience-390.png`
- Project rail screenshot: `/tmp/v4-project-1440.png`
- Top-of-page light gradient screenshot: `/tmp/v4-top-1440.png`
- Skills accordion screenshot: `/tmp/v4-skills-1440.png`

Publication was not performed as part of this QA run; it remains behind the coordinator's requested acceptance gate.
