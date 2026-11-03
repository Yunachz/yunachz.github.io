# V3 implementation plan

Planner handoff, 2 November 2026. Scope: implementation guidance and copy planning only; this document does not certify that the new interface has passed QA. Public copy is in [V3-COPY.md](V3-COPY.md). Luna owns production sources, Git, generated CV files, and deployment; the root coordinator owns final review. Preserve existing internal documents, including untracked files.

## 1. Problem and constraints

The portfolio needs a more compact introduction, richer interaction, and complete Indonesian/English content without changing the audited identity or inventing evidence. Keep the existing Astro static site and its content collections. Add content through validated data, not new component branches for individual records.

The current inventory is **5 projects, 10 skills, 9 experiences, 4 education entries, and 6 certifications**, plus profile/contact/settings and one about section. All must remain available after the layout changes. The old about section becomes part of the introduction; its learning and committee facts also remain in capabilities and experience descriptions, so a second about block is unnecessary.

### Authority and assumptions

- The latest user request overrides the old public-source labels in `CONTENT-CV-AUDIT.md` and `CONTENT-V2-REVIEW.md`. Those audits remain internal evidence; never render “tercantum pada CV”, “telah diverifikasi”, audit results, or repository-validation commentary as portfolio copy.
- Identity: Muhammad Fajar Sodik; Electrical Engineering student at Universitas Pembangunan Nasional Veteran Jakarta; Jakarta, Indonesia. Do not imply graduation, a permanent engineering position, a professional licence, or a current employment status.
- GPA is numeric **3.72**, displayed **3,72** in ID and **3.72** in EN. No semester, denominator, honours, or invented scale.
- Indonesian is native; English is basic. English interface availability does not change the stated language ability.
- The user now authorizes exactly these seven software names: **MATLAB, Arduino IDE, STM32Cube, Altium, Fusion, Proteus, TIA Portal**. Do not attach proficiency levels, versions, certifications, or unsupported software-to-project claims.
- Existing portrait, contact details, project photographs, dates, roles, and names remain factual. Missing pictures use local thematic placeholders, not synthetic evidence.
- “Berjalan/Sekarang” and “Present” preserve the source record. Do not calculate years of experience or independently extend a role's dates. Keep **KSM IOT 2025** even though its period begins in February 2026.
- The original English CV at `/assets/documents/cv-muhammad-fajar-sodik.pdf` was inspected with `pdftotext -layout` and `pdfinfo`: **3 pages, A4, 114160 bytes**. An Indonesian file is not present in the initial document directory. Preserve the English source and produce a faithful Indonesian translation.

## 2. Alternatives and decisions

| Choice | Decision and reason |
| --- | --- |
| Rewrite framework or keep Astro | Keep Astro. The requested interactions fit a small client script; a framework migration adds no required user benefit. |
| One translation dictionary containing every record or translations beside each record | Put public record copy beside its facts. Use a shared dictionary only for UI labels. Adding a sixth project must not require a component edit or a new slug switch. |
| Translate official names or preserve them | Preserve institution, project, event, and exact certificate names. Translate surrounding labels, roles, descriptions, dates, and accessibility text. |
| Add a PLC project filter because PLC is a skill | Omit it until a published project actually uses PLC. Skills and project categories answer different questions. |
| Duplicate interactive carousel cards for a loop or keep a canonical item set | Prefer one DOM instance per project, with visual positions wrapping. If the implementation needs decorative copies, make them inert and hidden from accessibility, remove IDs, and provide access through the canonical cards. |
| One long CV modal or two separate dialogs | One dialog with two internal states: language choice, then preview. The user retains context and focus. |
| Certificate detail dialogs or visible cards | Six static certificate cards. Exact title and landscape preview area are sufficient; no click target, chevron, or modal. |
| Force the hero into one mobile screen or allow content flow | Target one desktop viewport; allow normal mobile reading and scrolling. Never shrink text to force a mobile fit. |

## 3. Data and localization contract

### Stable facts, translated presentation

Use stable `id`/slug values for identity, references, filter membership, and application state. Keep factual fields such as URLs, GPA, date bounds, source-page references, dimensions, `draft`, and ordering outside translations. Source/audit fields are internal and never rendered.

An illustrative entry shape, adaptable to the current strict Zod schema:

```ts
type Locale = 'id' | 'en';
type Localized<T> = { id: T; en: T };

type PublicCopy = {
  title?: string;
  summary: string;
  paragraphs?: string[];
  details?: string[];
  imageAlt?: string;
};

type Project = {
  slug: string;
  title: string;                 // Project name remains invariant.
  categoryIds: string[];        // Stable data keys, never translated labels.
  tags: string[];
  copy: Localized<PublicCopy>;
  cover?: {
    src: string;
    width: number;
    height: number;
    kind: 'photo' | 'placeholder';
  };
  repositoryUrl?: string;
  sourceLinks: Array<{
    label: Localized<string>;
    url: string;
  }>;
  order: number;
  draft: boolean;
};
```

The example is a migration target, not a requirement to preserve duplicate legacy strings indefinitely. Existing Markdown bodies can move into bilingual paragraph/detail fields; avoid rendering the old audit-oriented bodies underneath the new copy. If Markdown remains the public body source, store both language bodies with the same canonical project record, rather than treating language versions as separate projects.

Apply the same pattern to skill names/context, experience role/summary/details, education program/summary/details, category labels, image alt text, and any descriptive credential text. Exact credential names remain one canonical string in both locales. For experiences and education, optional machine-readable dates support sorting; retain exact source period meaning and use locale formatting rather than guessing a missing day.

Add a software collection or validated data array with `id`, `name`, local icon path, `order`, and `draft`. The initial seven records are the user list above. An optional localized description is permitted only when factual; the requested tiles need names alone. Add optional media fields to experience and skills, including dimensions, localized alt, and media kind. Placeholder paths must resolve to SVG/image files under `/assets/placeholders/`; never set an image URL to `/`.

### UI dictionary and page behavior

- Keep one typed UI dictionary for nav, section copy, modal controls, toasts, ARIA labels, fallback messages, and singular/plural announcements. Store changing names/counts as interpolation parameters, not English sentences built by concatenation.
- Default to ID when there is no saved choice. Persist explicit ID/EN selection independently of theme. Apply `html.lang`, title/description where client switching is used, all visible text, alt text, labels, and currently open dialog content together.
- If storage throws, keep the selected language/theme active for the current page. Catch storage reads/writes; navigation must still work.
- Use one visible language selector adjacent to the brightness control. Labels **ID / EN** are language choices; proper language names in the CV chooser remain **Bahasa Indonesia / English**.
- Keep stable section IDs across language changes: `about`, `projects`, `skills`, `education`, `experience`, `credentials`, `contact`. There must be only one `about` ID.
- Existing `/projects/` and `/projects/[slug]/` routes remain useful fallbacks. Give them the same bilingual header, labels, descriptions, and content. In normal JavaScript-enabled browsing, project activation opens a same-page dialog without navigating.
- No-JavaScript baseline: ID content, readable project links, accessible contact/mail links, and direct English/Indonesian CV links. Interactive controls should be hidden or disabled if they cannot function.

### Project categories: actual initial mapping

The category registry contains stable keys plus localized labels and ordering. Render filters from the union of category IDs on published projects, excluding categories with no matching entries. “All” is an aggregate control, not a stored category.

| Canonical project slug | Filter memberships | Card category ID / EN |
| --- | --- | --- |
| `fuzzy-fire-suppression` | `control-systems` | Embedded & Kendali / Embedded & Control |
| `aquasync-ph-stabilizer` | `control-systems` | Instrumentasi & Kendali / Instrumentation & Control |
| `lora-sentinel` | `iot` | Telemetri & IoT / Telemetry & IoT |
| `smart-trash-bin` | `iot`, `machine-learning` | IoT & Computer Vision / IoT & Computer Vision |
| `kafe-kekinian-pos` | `desktop` | Aplikasi desktop / Desktop software |

Expected initial counts: **All 5, Control Systems 2, IoT 2, Machine Learning 1, Desktop 1**. Labels: **Semua / All; Sistem Kendali / Control Systems; IoT / IoT; Machine Learning / Machine Learning; Aplikasi Desktop / Desktop Apps**. Do not infer IoT from the mere presence of an ESP32. If future data adds a real PLC project and its registry label, the PLC filter appears without editing the renderer.

### Data validation

Require nonempty ID and EN public copy for every published record; do not silently render a mixture of languages. Validate referenced category IDs/project slugs, duplicate slugs, media dimensions/alt, local asset existence, local-file extensions, HTTPS external links, and email/phone formats. Preserve credential issuer/date/ID/verification URL as absent when unknown. Do not turn a placeholder into a document attachment.

Keep count-dependent UI derived from data. Baseline counts are regression checks, not hardcoded maximums. Verify adding a temporary valid translated project creates a card, filter membership, and fallback route without UI edits; remove the fixture after the check.

## 4. Page and interaction implementation

### Header, background, and introduction

The brand link displays only **Fajar.** Keep the full name and field in the introduction. Put a single brightness icon and the adjacent ID/EN choice in the header; accessible button names still describe their actions. The small-screen menu, if used, must open/close with Escape and restore focus.

Use a subtle blurred abstract gradient on the light page background, with low-chroma tones and restrained motion. Dark mode retains its own appearance without the light gradient layer. Background layers are decorative, pointer-inert, clipped to avoid overflow, and disabled or static for reduced motion.

The theme reveal originates at the icon center and expands to cover the furthest viewport corner, in either direction. Detect the available transition mechanism, and provide an immediate theme-change fallback. Rapid toggles must finish or cancel the prior reveal, settle on the last requested theme, clear temporary overlays, and leave controls usable. Recompute origin/radius from the current icon position; do not use fixed desktop coordinates. Reduced motion changes theme immediately. Save the chosen theme independently of animation success.

Merge hero, portrait, and about into a single concise section. Retain the real portrait, at a smaller scale. Use the full name, student status, one short introduction, CV/project actions, and small horizontal icon fact cards for GPA, location, and language ability. At 1440×900, target the introduction within the first viewport after the header; at 320/390, permit normal flow with readable text and at least 44px controls.

### Projects: one filtered looping gallery

All five projects are in the primary project gallery. Add previous/next icon buttons, a pause/play icon toggle, touch swipe, and data-driven filters. The project dialog contains the selected title, description, technology tags, media, and real repository/resource links. Use the copy document's neutral technical descriptions rather than public audit notes.

Treat motion as explicit state: user play preference plus temporary pause reasons for keyboard focus on a moving project card, active drag, open dialog, offscreen gallery, hidden document, and reduced motion. Pointer hover and pointer focus on the play, arrow, or filter controls do not pause the loop. Removing one pause reason must not clear another. A deliberate user pause remains paused after modal close or pointer movement. A manual next/previous/swipe action must not produce a competing animation.

Keep one canonical logical collection. Recalculate positions on filter and resize; selected category and current logical item cannot depend on translated labels. A focused card must remain visible and stable. Filter announcements use the resulting unique item count. With zero items show a localized empty message; with one item disable unnecessary movement. Stop automatic motion under reduced motion while keeping manual navigation available. Announce only manual selection/filter changes, never every animation frame.

### Capabilities: skills and software tabs

Section title: **Yang bisa saya lakukan / What I can do**, with the short introduction in V3-COPY. Use a real tab bar with **Keahlian / Skills** and **Perangkat Lunak / Software**, `aria-selected`, linked tab panels, keyboard movement, and one visible panel.

Skills use a horizontal expanding accordion. Keep all **10 skill records**; do not discard learning-context entries. Collapsed cards show whole words rotated vertically over topic-related imagery. Hover, keyboard focus, or tap expands a card, pushes siblings, rotates its heading to horizontal, and reveals its description. Prefer one explicit active ID, stable focus, button headings, and `aria-expanded`/`aria-controls`. Long headings may have multiple whole words, never one letter per line. At narrow widths, allow a sensible scrollable strip or stacked expandable cards; a readable active card takes priority over imitating the desktop proportions. Supply a visible focus treatment and ensure every description is reachable without hover.

The software panel contains seven small translucent icon tiles, with each exact app name below its icon. Local assets must remain readable in both themes. These are software names, not badges implying mastery or certification. No progress bars or skill percentages.

### Education

Desktop: **Formal** left, **Nonformal / Non-formal** right. Use a straight vertical timeline with connected dots, newest/current first. Formal order: UPNVJ, SMKN 5 Jakarta, SMK Kemala Bhayangkari 1 Jakarta. Nonformal has the single August 2023 training entry; do not invent extra points for symmetry. Collapse to one column on mobile while retaining the two group headings. Do not insert a degree after the student's name.

### Galeri Pengalaman / Experience Gallery

One manual landscape gallery contains **all nine** records, with layered adjacent images where appropriate. Never autoplay. Previous/next wraps through the canonical list; drag/swipe, keyboard-accessible arrows, and click/tap on neighboring images work. Keep each selected record's title, role, period, summary, and full activity details below its image. An inline disclosure can hold longer activity details; it must not require a separate modal to read them. Maintain a single set of controls, selection state, and captions, without duplicate visual galleries.

All nine experience photos are initially unavailable. Use thematic local placeholders with clearly illustrative alt text. They must not resemble event documentation or depict the user participating. If later replaced, only the data/media fields should change.

### Certifications

Render exactly six static cards from data. Each has a landscape media area and its exact canonical certificate name; allow long names to wrap. Missing scans use a neutral local placeholder with truthful descriptive alt text; no temporary-image label appears on the card. Do not simulate a real certificate with a signature, seal, serial, grade, institution logo, or fabricated scan. Remove the old disclosure/modal behavior and any verification action.

### Contact, email, CV, footer

Use the localized **Let’s connect** section label, **Let’s work together** main heading, and warm project/career invitation. A nested envelope card has **Send me an email**. The visible email address is a copy button; a separate real `mailto:` link opens a mail client. Announce success only after the clipboard operation succeeds. On failure, leave the address selectable and show a localized manual-copy message; never claim it copied. Preserve LinkedIn, WhatsApp, and GitHub destinations exactly.

The CV dialog always starts with language choice, even after a previous viewing session. Choosing **Bahasa Indonesia** or **English** replaces the same dialog body with the selected preview. Only then does a download button appear, pointing to that language's file. Provide change-language and open-PDF actions, a readable responsive preview, and useful fallback text when embedding is unavailable. The CV language choice is independent of the site's UI locale. Switching CV language does not change the whole website language.

Native dialog or equivalent must trap focus, close with Escape and the close button, keep the background inert, prevent background scrolling, avoid duplicate IDs, and restore focus to the exact trigger. On CV state change, move focus to the new preview heading or another meaningful control. On language switching while a dialog is open, translate dialog controls without losing the selected item/document. Prevent iframe focus from trapping keyboard users.

Footer: **© 2026 Muhammad Fajar Sodik** and localized **Back to top**. The back-to-top action respects reduced motion and reaches the top of the page.

## 5. Indonesian CV production approach

1. Keep `/assets/documents/cv-muhammad-fajar-sodik.pdf` as the English source. Produce `/assets/documents/cv-muhammad-fajar-sodik-id.pdf` for Indonesian; do not label the English PDF as Indonesian.
2. Translate all three source pages using the structured content and CV wording map in V3-COPY. Preserve every work/activity item, all four education entries, all six exact certificate names, contact facts, and native/basic language levels. Keep proper names invariant.
3. Interpret “engineer” in the summary within the explicit **Engineering Department (OJT)** context. Use the date range October 2022–April 2023 rather than resolving the source's inconsistent “6 months” wording into a new duration claim.
4. Keep the Indonesian document a faithful translation of the English source. GPA and the new software list are authoritative website facts but absent from the source PDF; do not silently insert them into only one language's CV. A future bilingual CV revision can add them consistently with explicit editorial intent.
5. Use the PDF skill's authoring and rendering workflow. Verify every rendered page for clipping, missing glyphs, tiny text, awkward page breaks, and omitted records. Extract text from the final Indonesian PDF and compare its fact inventory to the source and V3-COPY.
6. Verify local/server responses are real PDFs, document-language mappings differ correctly, the preview is usable at 320px, and the download appears only after language choice. The same chosen language must drive preview URL, open-PDF URL, download URL, and filename.

## 6. Acceptance matrix

Run a visual pass at **320, 390, 768, and 1440px** in **ID/EN × light/dark**: **16 combinations**. At 1440 use a 900px-tall desktop viewport to judge the compact intro. Runtime interaction checks can use representative widths, with any layout-specific behavior checked where it changes.

| Area | Observable pass condition |
| --- | --- |
| Build and schema | `npm run validate-content`, `npm run check`, `npm test`, and `npm run build` pass after necessary updates to old interaction tests. No missing published translations or broken asset references. |
| Facts and counts | 5 projects, 10 skills, 7 software apps, 9 experiences, 4 education entries, 6 certificates; GPA 3,72/3.72; no scale/semester, fabricated dates, achievements, skill levels, issuers, or job status. |
| Source hygiene | Search public render/content for old audit language. Inspect both popup content and fallback project routes; no “tercantum pada CV”, “terverifikasi”, provenance paragraphs, setup-audit warnings, or placeholder repository metrics. |
| Responsive visual QA | No body horizontal overflow (`scrollWidth <= innerWidth + 1`); long name/certificate titles and seven-app panel wrap; portrait preserved; tab/menu/icon controls remain readable and reachable. Internal carousel scrolling does not widen the document. |
| Theme | One visible brightness icon; light-only subtle background; reveal starts at icon in both directions; rapid alternating clicks settle on the last choice; unsupported animation and reduced-motion paths work; theme persists independently of locale. |
| Localization | All nav, headings, entries, dates, count messages, buttons, alt/ARIA text, tooltips, fallback pages, open dialogs, and email toasts change correctly; `html.lang` matches; choice survives reload/navigation; blocked storage does not break the page. Proper names and exact certificate titles remain invariant. |
| Project filters | Initial counts 5/2/2/1/1; no PLC filter. Switching filters rebuilds the visual loop from matching unique records, with a localized count and no stale modal/track references. |
| Project motion | Automatic loop, pause/play, arrows, pointer drag, and touch swipe work. Keyboard focus on a moving card, open modal, offscreen, hidden tab, and reduced motion pause safely; pointer hover/control focus do not. Manual pause survives other state changes. No duplicate IDs or clone tab stops. |
| Project dialog | Stays on the same page; correct record and language; Escape/close/focus restoration work; scrolling contained; all links and image captions are accurate. |
| Skills/software | Tabs work by keyboard/touch. All ten skill descriptions remain accessible; vertical headings use whole rotated words. All seven exact software names show below icons, with no unsupported mastery labels. |
| Education | Three formal entries left, one nonformal right on desktop; newest formal first; straight connected dots; mobile collapse remains readable and complete. |
| Experience | All nine records reachable with arrows/swipe/drag, including wrap from 9 to 1; no autoplay; correct image/caption pairing; complete activity details below image; no duplicate gallery UI. |
| Certificates | Six landscape areas and exact names, neutral placeholders where needed; no popup trigger, link styling, invented scan details, or verification button. |
| Contact | Correct email and destinations; clipboard success announced after a successful copy; failure message honest; separate mail action launches `mailto:`; all icon links have localized names. |
| CV | Every open begins with ID/EN choice; no download in choice state; choosing updates the same popup; both real language files preview/open/download correctly; change-language works; preview fallback and focus handling tested at 320px. |
| Motion/accessibility | Reduced-motion disables automatic motion and reveal animation, leaves manual controls usable; visible focus, 44px action targets, icon labels, no hidden focusable content, and no repeated autoplay announcements. |
| Scalability | A temporary data-only project/experience/software addition renders through the same schema and components; categories and counts derive from entries; zero/one-item galleries remain usable. |
| Publication | Root reviews evidence before Luna commits/deploys. After authorized publication, inspect the live root page and representative assets/routes for the reviewed build. Do not claim live success from a local build alone. |

## 7. Work order for Luna and coordinator

1. Evolve validated content and UI dictionaries; migrate all public strings with V3-COPY, register actual project categories, and add replaceable local placeholder paths.
2. Build the compact page sections and static fallbacks; prepare the Indonesian PDF while preserving the English original.
3. Add locale/theme state, tabs/accordion, galleries/filters, project/CV dialogs, and email copy with explicit accessibility and motion states.
4. Run content/build checks, then the visual matrix and targeted interactions. Fix failures before broad repeat testing; record concrete evidence for root review.
5. Root approves the reviewed result. Luna alone performs the already-authorized publication and reports the live result.

No missing fact currently blocks planning. Missing event/certificate images are handled by the user's placeholder instruction; unknown credential metadata stays absent.

### Planner verification

Documentation inventory checks passed for 5 project sections, 10 skill records, 7 software names, 4 education sections, 9 experience sections, and 6 exact certification titles. Both languages contain the same 24 activity items, and all expected periods are present. The compact hero and explicit Galeri Pengalaman / Experience Gallery heading incorporate the coordinator's copy review. These are documentation checks; implementation, generated-PDF inspection, browser testing, and live deployment remain subject to Luna's work and root review.
