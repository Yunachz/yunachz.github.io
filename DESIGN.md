# Design System: Portfolio Muhammad Fajar Sodik (V3 Specification)

> Authoritative Design System Specification — Engineered under `impeccable`, `apple-design`, and `taste-design` standards. Serves as the single source of truth for the V3 high-craft bilingual portfolio for **Muhammad Fajar Sodik** (Electrical Engineering). Enforces tactile physical feedback, Apple fluid mechanics, calibrated technical aesthetics, WCAG AA/AAA contrast ratios, and complete responsiveness.

---

## 1. Visual Theme & Atmosphere

* **Atmosphere:** Precision Engineering Laboratory meets Apple-fluid modern physical materials. Blends the grounded, meticulous craft of electrical power installations, control instruments, and circuit schematics with fluid, tactile digital ergonomics. Avoids generic AI purple/neon tropes, corporate SaaS clichés, and gimmicky terminal monospace aesthetics.
* **Density:** `6/10` (Engineering Balanced) — High information density organized with disciplined spatial hierarchy. Compact desktop viewport footprint (target ~700–820px height at 1440×900) without cramped typography. Natural, unforced vertical flow on mobile (320–390px).
* **Variance:** `7/10` (Offset Asymmetric) — Structured asymmetry. Unified hero pairs an editorial narrative on the left with a clean portrait card on the right, grounded by three horizontal metric cards.
* **Motion:** `7/10` (Tactile Apple Spring Physics) — Continuous, interruptible physical springs (`damping: 1.0`, `response: 0.35s`), 1:1 touch/pointer tracking, specular translucent glass materials, circular expanding wave theme reveal, and complete `prefers-reduced-motion` compliance.

---

## 2. Color Calibration & Contrast Matrix

Single calibrated accent color with saturation below 80%, anchored by an absolute neutral foundation of Slate and Zinc. Pure black (`#000000`) is strictly banned; neon outer glows are strictly banned. Tactile elevation shadows, specular border highlights, and subtle low-chroma ambient gradients are explicitly authorized per brief.

*WCAG 2.1 Contrast Requirements: Level AA $\ge 4.5:1$ (Normal Text), Level AAA $\ge 7.0:1$ (Headings/Key Data).*

### A. Light Theme (Technical Daylight & Ambient Gradient)

* **Canvas Base** (`#F8FAFC`, Slate-50) — Root background foundation.
* **Ambient Gradient (Light Mode Only):** Subtle, slow-drifting blurred abstract gradient layer (`background: radial-gradient(circle at 20% 20%, rgba(224, 231, 255, 0.45) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(224, 242, 254, 0.4) 0%, transparent 50%)`, `filter: blur(80px)`, pointer-events: none, overflow-clipped). Smooth, slow ambient drift animation (`@keyframes ambient-drift`, 28s infinite alternate ease-in-out) that freezes completely under `prefers-reduced-motion`. Banned in dark mode.
* **Pure Surface** (`#FFFFFF`) — Cards, modal containers, and navigation chrome.
* **Subtle Surface** (`#F1F5F9`, Slate-100) — Metadata chips, inactive tabs, secondary icon containers.
* **Translucent Glass Surface** (`rgba(255, 255, 255, 0.65)`) — Apple glass icon tiles and floating navigation (`backdrop-filter: blur(20px) saturate(180%)`).
* **Glass Specular Border** (`rgba(255, 255, 255, 0.85)`) — 1px top highlight simulating physical light catching glass edges.
* **Ink Primary** (`#0F172A`, Slate-900) — Primary headings, titles, and technical data:
  * Contrast vs `#F8FAFC` = **17.06:1** (*Pass AAA*).
  * Contrast vs `#FFFFFF` = **17.85:1** (*Pass AAA*).
* **Ink Secondary** (`#475569`, Slate-600) — Body descriptions, labels, and secondary copy:
  * Contrast vs `#F8FAFC` = **7.24:1** (*Pass AAA*).
  * Contrast vs `#FFFFFF` = **7.58:1** (*Pass AAA*).
* **Ink Muted** (`#64748B`, Slate-500) — Tertiary captions and metadata:
  * Contrast vs `#F8FAFC` = **4.55:1** (*Pass AA*).
  * Contrast vs `#FFFFFF` = **4.76:1** (*Pass AA*).
* **Whisper Border** (`#E2E8F0`, Slate-200) — 1px structural boundaries.
* **Structural Border** (`#CBD5E1`, Slate-300) — Interactive element borders and active card outlines.
* **Electric Cobalt (Accent)** (`#1D4ED8`, Blue-700, Saturation 76.3%) — Primary CTA, active tab indicators, and timeline nodes:
  * Contrast vs `#F8FAFC` = **6.41:1** (*Pass AA*).
* **Text On Accent** (`#FFFFFF`) — Button label text over Electric Cobalt:
  * Contrast vs `#1D4ED8` = **6.70:1** (*Pass AA*).
* **Accent Tint** (`#EFF6FF`, Blue-50) — Active category filter chips and selected item backgrounds.
* **Card Elevation Shadow** (`0 8px 24px -4px rgba(29, 78, 216, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`).
* **Focus Ring** (`#2563EB`, Blue-600) — 2px solid outline with 2px offset.

### B. Dark Theme (Instrument Night / Deep Charcoal)

* **Deep Charcoal Canvas** (`#0B0F17`, Slate-950 Tint) — Main dark mode canvas (avoids pitch black `#000000`). Clean, unadorned by the light-mode gradient layer.
* **Elevated Surface** (`#151D2A`, Slate-900 Tinted) — Cards, modal containers, and floating panels.
* **Subtle Dark Surface** (`#1E293B`, Slate-800) — Tag chips, inactive tabs, secondary controls.
* **Translucent Dark Glass Surface** (`rgba(21, 29, 42, 0.7)`) — Apple glass icon tiles and header chrome (`backdrop-filter: blur(20px) saturate(180%)`).
* **Dark Glass Specular Border** (`rgba(255, 255, 255, 0.12)`) — 1px top highlight on dark glass tiles.
* **Light Ink Primary** (`#F1F5F9`, Slate-100) — Headings, titles, primary text:
  * Contrast vs `#0B0F17` = **17.51:1** (*Pass AAA*).
  * Contrast vs `#151D2A` = **15.45:1** (*Pass AAA*).
* **Light Ink Secondary** (`#94A3B8`, Slate-400) — Body descriptions and metadata:
  * Contrast vs `#0B0F17` = **7.48:1** (*Pass AAA*).
  * Contrast vs `#151D2A` = **6.60:1** (*Pass AA*).
* **Light Ink Muted** (`#7D8C9B`, Slate-450 Calibrated) — Tertiary labels:
  * Contrast vs `#0B0F17` = **5.57:1** (*Pass AA*).
  * Contrast vs `#151D2A` = **4.91:1** (*Pass AA*).
* **Dark Whisper Border** (`#334155`, Slate-700) — 1px structural card boundaries.
* **Dark Structural Border** (`#475569`, Slate-600) — Interactive element borders.
* **Calibrated Technical Blue (Dark Accent)** (`#7BA3DF`, Blue-350 Calibrated, Saturation 61.0%) — Dark mode accent:
  * Contrast vs `#0B0F17` = **7.44:1** (*Pass AAA*).
  * Contrast vs `#151D2A` = **6.56:1** (*Pass AA*).
* **Text On Dark Accent** (`#0B0F17`, Deep Charcoal) — Contrast-compliant dark text on light blue accent button:
  * Contrast vs `#7BA3DF` = **7.44:1** (*Pass AAA*). *(Note: white text on this accent fails AA; dark text is mandatory).*
* **Accent Tint Dark** (`rgba(123, 163, 223, 0.14)`) — Active filter background.
* **Card Elevation Shadow Dark** (`0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(123, 163, 223, 0.08)`).
* **Focus Ring Dark** (`#7BA3DF`, Blue-350) — 2px solid outline with 2px offset.

---

## 3. Typography Architecture

* **Primary Display, Body, GPA & Metadata:** `Geist`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, system sans-serif.
  * Standard typography uses `Geist` sans-serif across headings, body descriptions, dates, tags, and numeric GPA metrics (`3,72` / `3.72` in `Geist 700`).
  * *Optical Discipline:* Size-specific tracking. Negative tracking on large display headings (`-0.025em` to `-0.03em`), natural zero tracking on body copy (`0`).
  * *Reading Comfort:* Body line height fixed at `1.6` with line length constrained to `max-width: 65ch`.
* **Technical Monospace (Reserved for Code Only):** `Geist Mono`, `JetBrains Mono`, `Fira Code`, monospace.
  * *Strictly reserved for:* Raw code snippets, pin definitions, terminal commands, and exact repository file paths.
* **Banned Typography:** `Inter` (banned as generic AI default), generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`), and novelty sci-fi terminal fonts.
* **Scale Hierarchy:**
  * **Brand Mark:** `1.25rem` (20px) | Weight: 700 | Tracking: -0.02em
  * **Hero Title (H1):** `clamp(2.25rem, 4.5vw, 3.5rem)` (36px – 56px) | Weight: 700 | Tracking: -0.03em | Leading: 1.1
  * **Section Title (H2):** `clamp(1.75rem, 3.2vw, 2.375rem)` (28px – 38px) | Weight: 600 | Tracking: -0.025em | Leading: 1.2
  * **Contact Eyebrow (Sole Authorized Eyebrow):** `0.8125rem` (13px) | Weight: 600 | Tracking: +0.06em (Uppercase)
  * **Section Intro:** `1.0625rem` (17px) | Weight: 400 | Leading: 1.6
  * **Card Title (H3):** `1.125rem` – `1.25rem` (18px – 20px) | Weight: 600 | Tracking: -0.015em
  * **Body Text:** `0.9375rem` – `1rem` (15px – 16px) | Weight: 400 | Leading: 1.6
  * **Factual Metric Value:** `1.125rem` (18px) | Weight: 700 (`Geist` Sans)

---

## 4. Apple Fluid Motion & Physics Engine

Built upon the principles of Apple WWDC *Designing Fluid Interfaces*:

* **Default Spring Physics:** Critically damped (`damping: 1.0`, `response: 0.35s`). Settle time is emergent, smooth, without overshoot or vestibular disturbance.
* **Momentum & Flick Spring:** Under-damped with subtle physical rebound (`damping: 0.8`, `response: 0.35s`), used exclusively after high-velocity pointer drags/swipes in the carousel and gallery.
* **1:1 Direct Manipulation:** Pointer Events with `setPointerCapture` track touch/drag movements 1:1 with pointer position. Grab offset is preserved; releasing passes instantaneous release velocity into the spring.
* **Interruptibility:** Every card transition, tab switch, and modal animation can be grabbed and reversed mid-flight without locking input.
* **Hardware Compositing:** Animated properties are strictly limited to `transform` and `opacity`. Layout shifts (`width`, `height`, `left`, `top`) are avoided in continuous motion loops.
* **Absolute Accessibility (`prefers-reduced-motion: reduce`):**
  * Auto-scrolling and animated carousel loops are permanently halted.
  * Ambient light-mode gradient drift animation freezes (`animation: none !important;`).
  * Expand/collapse animations and card transforms collapse to instantaneous cross-fades (`opacity 150ms ease`).
  * Theme wave transition falls back to an immediate synchronous theme change.
  * Manual navigation controls (previous, next, tabs, close) remain fully functional.

---

## 5. Component Geometry & Interaction States

### 5.1 Header Chrome & Navigation
* **Brand:** Display strictly **Fajar.** (font-weight 700, tracking -0.02em). Replaces the old photo/name/field header markup.
* **Controls Cluster (Right-Aligned):**
  1. **Navigation Links:** Desktop pill row (Tentang/About, Proyek/Projects, Kemampuan/Capabilities, Pendidikan/Education, Pengalaman/Experience, Sertifikasi/Certifications, Kontak/Contact).
  2. **Language Toggle:** Pill button pair showing `ID | EN`. Active locale highlighted with solid chip background (`Accent Tint`). Persistent via `localStorage['portfolio-locale']`.
  3. **Brightness Icon Toggle:** Single SVG icon button (`44×44px` hit target). Sun icon rendered in dark mode, Moon icon in light mode.
  4. **View CV Action:** Secondary pill button opening the CV modal.
* **Mobile Drawer:** Clean slide-down translucent sheet with backdrop blur. Closes on Escape, link click, or outside tap, with focus trap.

### 5.2 Circular Expanding Wave Theme Reveal
* **Origin Coordinate Rule:** ALWAYS originates from the physical center of the brightness toggle icon `(rect.left + rect.width / 2, rect.top + rect.height / 2)`. This holds true for keyboard activations (where `clientX === 0`) and pointer clicks alike.
* **Implementation & Interruption State Machine:**
  - Uses `document.startViewTransition` with a radial clip-path animation.
  - Active transition references are tracked. If a rapid toggle occurs mid-animation, the in-flight transition promise is caught and superseded, applying the latest target theme immediately.
  - Radius calculation: `Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))`.
  - Fallback: On browsers without View Transitions API or under `prefers-reduced-motion`, updates `data-theme` synchronously on `<html>`.

### 5.3 Unified Compact Hero Section
* **Desktop Viewport Target:** Target height ~700–820px at 1440×900 desktop viewport, fitting the complete introduction above the fold.
* **Desktop Grid Geometry (2 Columns):**
  * **Left Column (~60% width):**
    * Headline (H1): `Muhammad Fajar Sodik` (Geist 700, 48px, leading 1.1, tracking -0.03em, max 2 lines).
    * Sub-headline: `Mahasiswa Teknik Elektro · UPN Veteran Jakarta` / `Electrical Engineering student · UPN Veteran Jakarta` (Geist 500, 18px, Ink Secondary).
    * Narrative Intro: Concise summary of electrical power installations, control systems, and ASTON Kemayoran OJT (Geist 400, 16px, max-width 56ch).
    * Primary CTA Row: [Jelajahi proyek / Explore projects $\rightarrow$] (Electric Cobalt primary button) + [Lihat CV / View CV] (Secondary outline button) + [Mari terhubung $\nearrow$ / Let's connect $\nearrow$] (Text link).
    * Quick Metadata Links: Location (Jakarta, Indonesia) + GitHub (`Yunachz`) + LinkedIn (`muhammadfajarsodik`).
  * **Right Column (~40% width):**
    * Elevated Portrait Card (`~300px` width $\times$ `~380px` height): Rounded container (`border-radius: 16px`), border 1px `Whisper Border`, clean shadow.
    * Authentic photo: `public/assets/profile/muhammad-fajar-sodik.webp`, `object-fit: cover; object-position: center 20%`. Clean, dignified, without synthetic badges or decorative captions.
* **Bottom Fact Bar (3 Horizontal Icon Cards):**
  * Spans full container width directly below the 2-column hero split.
  * **Card 1 (GPA):** Graduation cap icon | Label: `GPA` | Value: `3,72` (ID) / `3.72` (EN) in `Geist 700`. No denominator, no semester.
  * **Card 2 (Location):** Map pin icon | Label: `Lokasi / Location` | Value: `Jakarta, Indonesia`.
  * **Card 3 (Languages):** Globe icon | Label: `Bahasa / Languages` | Value: `Bahasa ibu (ID) · Dasar (EN)` in ID / `Native (ID) · Basic (EN)` in EN.
* **Mobile Viewport Adaptation (320px – 390px):**
  * Natural single-column flow; does NOT compress text or force single-screen containment.
  * Portrait photo scales to `180×180px` circular or squircle container centered above the headline.
  * Typography scales gracefully (`clamp(2rem, 8vw, 2.5rem)` for H1).
  * Fact cards wrap naturally with minimum `44px` touch targets.

### 5.4 Project Showcase (Looping Carousel & Data Filters)
* **Section Header:**
  * Title (H2): `Dari ide ke rangkaian dan kode.` / `From ideas to circuits and code.`
  * Short Intro: `Proyek seputar kendali, IoT, machine learning, dan aplikasi desktop yang menjadi bagian dari proses belajar saya.` / `Projects in control systems, IoT, machine learning, and desktop software that form part of my learning.`
* **Data-Driven Category Filter Bar:**
  * Exactly 4 real categories derived from audited data + All:
    * `Semua / All` (5 projects)
    * `Sistem Kendali / Control Systems` (2 projects: Fuzzy Fire Suppression, AquaSync)
    * `IoT` (2 projects: LoRa Sentinel, Smart Trash Bin)
    * `Machine Learning` (1 project: Smart Trash Bin)
    * `Aplikasi Desktop / Desktop Apps` (1 project: Kafe Kekinian POS)
    * *(Note: PLC category is omitted until a dedicated PLC project is published).*
  * Filter controls use accessible button chips with smooth active background transitions.
* **Carousel Controls:**
  * Play / Pause Toggle Button: Accessible icon button showing `[||]` when running, `[|>]` when paused.
  * Navigation Arrows: `[< Previous]` and `[Next >]` icon buttons with `44×44px` hit areas.
* **Horizontally Looping Animated Cards:**
  * Infinite seamless wrap: Visual positions interpolate smoothly across the track.
  * Pause Triggers: Auto-motion pauses safely on:
    1. User manual pause (persists until manual play pressed).
    2. Pointer hover over the track.
    3. Keyboard focus-within any card.
    4. Active touch or pointer drag.
    5. Open project modal dialog.
    6. Document visibility hidden / offscreen viewport intersection.
    7. `prefers-reduced-motion: reduce`.
  * Card Anatomy:
    * Aspect ratio: 16:9 media cover. Uses real project images where available; neutral local SVG placeholders (`/assets/placeholders/project-control.svg`, etc.) where absent.
    * Title (H3): Geist 600, 20px.
    * Short Summary: 2 lines max with clean ellipsis.
    * Technology Tags: Geist Sans chips (e.g. `ESP32`, `Python`). Strictly based on audited data.
    * Card Action Link: "Lihat proyek $\rightarrow$ / View project $\rightarrow$".
* **Same-Page Project Detail Modal:**
  * Selecting any project opens a centered accessible dialog without page reload or route navigation.
  * Shows full bilingual project description, technology breakdown, high-resolution media, and real GitHub / diagram links.
  * Closes via Escape, close button `[×]`, or backdrop click. Restores focus to the triggering card.

### 5.5 Capabilities Section (Accordion & Apple Glass Tiles)
* **Section Header:**
  * Title (H2): `Yang bisa saya lakukan` / `What I can do`
  * Short Intro: `Kemampuan yang saya kembangkan lewat perkuliahan, praktik, proyek, dan kegiatan organisasi.` / `Capabilities I’m developing through coursework, practical work, projects, and student organizations.`
* **Tab Navigation Bar:**
  * Two tabs: `Keahlian / Skills` and `Perangkat Lunak / Software`.
  * Styled as an Apple-style segmented control (`border-radius: 9999px`, padding 4px, background `Subtle Surface`, sliding active pill indicator).
* **Tab 1: Skills Expandable Horizontal Accordion (10 Audited Records):**
  * Desktop Structure: 10 vertical cards side by side (`height: 480px`).
  * **Collapsed State (`flex: 1` or `width: ~70px`):**
    * Thematic visual background with dark gradient overlay (`rgba(15, 23, 42, 0.75)`).
    * Whole-word vertical title (CSS `writing-mode: vertical-rl; transform: rotate(180deg)`), aligned at the bottom. Never stacked individual characters.
  * **Expanded State (`flex: 5` or `width: ~360px`):**
    * Triggered by hover, keyboard focus, or pointer tap. Smooth spring expansion pushes sibling cards.
    * Title smoothly rotates to horizontal orientation (Geist 600, 24px, pure white text).
    * Rich description body fades in: practical context, learning background, and technical application.
  * **Keyboard & Touch Accessibility:**
    * Tab key traverses cards; Enter or Space expands the focused card.
    * Mobile adaptation: Collapses into an accessible vertical accordion or horizontally swipeable snap-strip, ensuring full readability of all 10 descriptions.
* **Tab 2: Software Apple Translucent Glass Icon Tiles (7 Authorized Apps):**
  * Seven apps: **MATLAB, Arduino IDE, STM32Cube, Altium, Fusion, Proteus, TIA Portal**.
  * Grid layout: 4 columns desktop, 3–2 columns mobile, centered.
  * **Apple Glass Tile Design (Informational, Non-Interactive):**
    * Squircle container (`80×80px` desktop, `68×68px` mobile, `border-radius: 20px`).
    * Translucent material: `background: var(--surface-glass); backdrop-filter: blur(20px) saturate(180%)`.
    * Specular highlight: `border-top: 1px solid var(--border-specular)`.
    * Subtle tactile elevation: `box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08)`.
    * Centered authentic software icon (recognizable official vector logos, e.g. MATLAB orange waveform, Arduino teal infinity, etc.).
    * Label: Exact software name displayed below the tile (Geist 500, 14px, centered). Non-interactive display (no tabindex or fake anchor).

### 5.6 Education Section (Chronological Dual-Column Timeline)
* **Section Header:**
  * Title (H2): `Langkah yang membentuk cara saya belajar.` / `Where my learning takes shape.`
  * Short Intro: `Pendidikan formal dan pelatihan yang menjadi dasar saya di bidang teknik elektro.` / `Formal education and training that underpin my studies in electrical engineering.`
* **Desktop Two-Column Architecture:**
  * **Column 1 (Left): Formal Education** (3 audited entries):
    1. *Universitas Pembangunan Nasional Veteran Jakarta* — S1 Electrical Engineering (Jul 2024 – Sekarang / Present), GPA 3,72 / 3.72.
    2. *SMKN 5 Jakarta* — Teknik Instalasi Tenaga Listrik (Jul 2022 – Mei 2024).
    3. *SMK Kemala Bhayangkari 1 Jakarta* — Teknik Instalasi Tenaga Listrik (One Year) (Jul 2021 – Jun 2022).
  * **Column 2 (Right): Non-formal Training** (1 audited entry):
    1. *Pusat Pelatihan dan Pengembangan Pendidikan Jakarta Timur* — Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023 (Agu 2023).
* **Timeline Geometry:**
  * Continuous straight vertical line (`2px solid Whisper Border`) connecting entries.
  * Connected circular nodes (`12×12px` solid Accent circle with `4px` white ring) at the top edge of each entry.
  * Chronological order: **Current / Newest at TOP, Oldest at BOTTOM**.
* **Mobile Collapse:** Stacks Formal Education first, followed by Non-formal Training, preserving clear section subtitles and vertical line connectivity.

### 5.7 Experience Gallery (Manual Layered Coverflow)
* **Section Header:**
  * Title (H2): `Belajar bersama, turun langsung.` / `Learning together, putting it into practice.`
  * Short Intro: `Pengalaman praktik kerja, organisasi, dan kepanitiaan yang memberi ruang untuk belajar dan bekerja dalam tim.` / `On-the-job training, student organizations, and event committees that have given me room to learn and work with others.`
* **Manual Looping Layered Gallery:**
  * Displays all 9 audited records: ASTON Kemayoran OJT, KSM Mekatronika, KSM IoT 2025, and 6 committees.
  * **Strictly NO Autoplay.** Driven exclusively by manual drag, swipe, and arrow navigation.
  * 3D Depth & Perspective: Central active card is prominent (`scale(1)`, full opacity, deep shadow). Flanking cards recede into perspective (`scale(0.85)`, `opacity: 0.5`, subtle blur).
  * Navigation Controls: Prominent `[< Previous]` and `[Next >]` arrow buttons, plus swipe tracking with inertia.
* **Caption & Activity Details (Positioned BELOW Image):**
  * Title & Role: Geist 600, 22px (e.g., `Engineering Department (OJT) — ASTON Kemayoran City Hotel`).
  * Period Badge: Geist 500, 13px (e.g., `Okt 2022 – Apr 2023`).
  * Narrative Summary: 2–3 lines contextualizing responsibilities.
  * Bulleted Activity List: Expandable inline disclosure for complete maintenance and documentation tasks.
* **Asset Fallback:** Uses local thematic placeholders (`/assets/placeholders/exp-aston.svg`, etc.) with clear illustrative alt text; never fake event photos.

### 5.8 Certifications Section (Six Static Landscape Cards)
* **Section Header:**
  * Title (H2): `Bekal untuk langkah berikutnya.` / `Building a stronger foundation.`
  * Short Intro: `Sertifikasi dan pelatihan yang melengkapi perjalanan belajar saya.` / `Certifications and training that complement my learning.`
* **Grid Architecture:** 3 columns desktop, 2 columns tablet, 1 column mobile (exactly 6 cards).
* **Card Anatomy:**
  * Landscape media frame (16:10 aspect ratio) with neutral preview styling and clean image icon. Strictly NO guilloché borders, NO simulated seals, and NO fake signatures.
  * Exact Canonical Certificate Title (Geist 600, 16px, wraps cleanly):
    1. *Middle Implementer of Maintenance of PLC Based Control Instruments (BNSP)*
    2. *Sertifikat Kompetensi LSK PPSDM KEBTKE*
    3. *ASTON Kemayoran City Hotel On The Job Training*
    4. *Data Analytics (Pearson IT Specialist)*
    5. *IC3 Digital Literacy Global Standard 6 Level 1*
    6. *Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023*
* **Interaction Rule:** **Strictly NO popup, NO modal, NO click-to-detail, NO invented separate issuer fields.** Cards are clean, static informational units.

### 5.9 Contact Section & Email Copy Flow
* **Section Header:**
  * Eyebrow: `Mari terhubung` / `Let’s connect` *(Requested Eyebrow)*.
  * Title (H2): `Mari bekerja sama` / `Let’s work together`.
  * Warm Intro: `Punya ide proyek, rencana kolaborasi, atau peluang karier di bidang teknik elektro? Saya senang berbincang dan mengenal kesempatan baru.` / `Have a project idea, a collaboration in mind, or a career opportunity in electrical engineering? I’d be glad to talk and hear more.`
* **Nested Interactive Email Card:**
  * Envelope icon container + heading `Kirim pesan email / Send me an email`.
  * Prominent display of `mfajarsodik.work@gmail.com`.
  * **Interactive Copy Action:** Clicking the email address initiates `await navigator.clipboard.writeText(...)`.
  * **Live Feedback Toast:** Upon successful resolution, an immediate localized toast appears: `Email berhasil disalin! / Email copied to clipboard!`. Reverts after 2.5s. If copy fails, prompt manual selection without false claims.
  * **Direct Mail Action:** Dedicated adjacent button `Buka aplikasi email / Open email app` launching `mailto:mfajarsodik.work@gmail.com`.
* **Social & Messaging Channels:**
  * WhatsApp: `+62 896-7121-6008` (opens `https://wa.me/6289671216008`).
  * LinkedIn: `https://www.linkedin.com/in/muhammadfajarsodik`.
  * GitHub: `https://github.com/Yunachz`.

### 5.10 Dedicated In-Popup CV Flow
* **Trigger:** Click "Lihat CV / View CV" from header or hero CTA.
* **State 1: Language Choice (Initial Modal State):**
  * Dialog title: `Curriculum Vitae` with close button `[×]`.
  * Guidance prompt: `Pilih bahasa untuk melihat CV / Choose a language to view the CV`.
  * Two prominent choice cards side-by-side:
    * **Bahasa Indonesia Card:** Title `Bahasa Indonesia`, subtitle `Pengalaman, pendidikan, dan keahlian teknis.`, primary action button `Buka CV Indonesia $\rightarrow$`.
    * **English Card:** Title `English`, subtitle `Experience, education, and technical capabilities.`, primary action button `View English CV $\rightarrow$`.
  * *(Download button is strictly HIDDEN in State 1).*
* **State 2: In-Popup CV Viewer & Download Action (Transitioned State):**
  * Upon language selection, the **SAME POPUP** transitions in-place into the document viewer.
  * Header displays active language indicator and a "Ganti Bahasa / Change Language" back button.
  * Document preview area renders the localized CV (`/assets/documents/cv-muhammad-fajar-sodik-id.pdf` or `/assets/documents/cv-muhammad-fajar-sodik.pdf`) via an accessible responsive embed/iframe with fallback.
  * **Download Button Appears:** `Unduh PDF (Indonesia) / Download PDF (English)` with direct file link.
  * Mobile fallback: Direct readable structured text preview and instant download action if mobile browser restricts PDF iframe rendering.

### 5.11 Footer Chrome
* Left: `© 2026 Muhammad Fajar Sodik` (all rights reserved).
* Right: Accessible `Kembali ke atas / Back to top` button with upward arrow icon. Smooth scrolling to top (`window.scrollTo({ top: 0, behavior: 'smooth' })`, respecting `prefers-reduced-motion`). Replaces old GitHub link.

---

## 6. Accessibility & Keyboard Navigation Matrix

| Component | Keyboard Focus Target | Interaction Key | Expected Behavior |
| --- | --- | --- | --- |
| Header Locale Toggle | Button (`#locale-toggle`) | `Enter` / `Space` | Toggles ID $\leftrightarrow$ EN, updates document language, persists to storage. |
| Theme Toggle | Button (`#theme-toggle`) | `Enter` / `Space` | Triggers circular wave reveal, toggles dark/light class, updates ARIA label. |
| Skills Accordion | Card Button (`role="button"`) | `Tab`, `Enter`, `Space` | Expands focused card, collapses siblings, rotates title horizontal, reveals description. |
| Software Tiles | Static Tile | Non-interactive | Clean informational presentation. |
| Project Carousel | Arrow Buttons (`#prev-proj`, `#next-proj`) | `Enter` / `Space` | Steps carousel forward/backward by 1 card, pauses auto-scroll during focus. |
| Project Play/Pause | Toggle Button (`#pause-proj`) | `Enter` / `Space` | Toggles carousel play/pause state; updates icon and ARIA label. |
| Experience Gallery | Arrow Buttons (`#prev-exp`, `#next-exp`) | `Enter` / `Space` | Cycles through all 9 experience records with perspective depth shift. |
| Project / CV Modal | Modal Root (`<dialog>`) | `Escape` | Closes dialog immediately, removes backdrop lock, restores focus to triggering element. |
| Email Copy | Email Button (`#copy-email`) | `Enter` / `Space` | Awaits clipboard write, announces "Email disalin / Email copied" to screen reader. |

---

## 7. Banned AI Patterns & Quality Floor

1. **Dilarang menggunakan Inter:** Wajib menggunakan `Geist` + `Geist Mono`.
2. **Dilarang menggunakan hitam murni (`#000000`):** Wajib menggunakan *Deep Charcoal* (`#0B0F17`).
3. **Dilarang menggunakan efek pendar neon ungu/pink:** Aksen tunggal terkalibrasi biru (`#1D4ED8` Light / `#7BA3DF` Dark) dengan saturasi $<80\%$.
4. **Dilarang mengarang metrik, statistik, atau klaim fiktif:** Nilai GPA tetap `3,72` / `3.72` tanpa penyebut dan tanpa semester.
5. **Dilarang menggunakan teks validasi internal:** Hapus kata "tercantum pada CV" dan "telah diverifikasi" dari tampilan publik.
6. **Dilarang menggunakan gambar kosong atau link `/`:** Seluruh placeholder menggunakan SVG lokal di `/assets/placeholders/...`.
7. **Dilarang memicu overflow horizontal:** `scrollWidth <= innerWidth + 1` pada 320px, 390px, 768px, dan 1440px.
8. **Dilarang membuat popup pada kartu sertifikasi:** 6 kartu sertifikasi bersifat statis murni tanpa modal rincian.
