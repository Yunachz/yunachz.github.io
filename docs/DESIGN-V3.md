# V3 Visual & Interaction Design Specification

> Implementation Blueprint for Luna (Implementer) & Root Coordinator.
> Authored by Design-UI Worker (`term_2a3f6417-ad80-4512-bcc2-70a6312f6ef3`).
> Aligned with `PRODUCT.md`, `DESIGN.md`, `docs/V3-PLAN.md`, `docs/V3-COPY.md`, and official Apple design physics.

---

## 1. Executive Summary & Vision

V3 transforms the portfolio of **Muhammad Fajar Sodik** from a segmented static website into a cohesive, high-craft engineering showcase. It combines the rigorous precision of an electrical engineering laboratory with Apple fluid interface mechanics:
1. **Compact, Unified First Impression:** Merges the disparate hero, portrait, and about sections into a single asymmetric desktop hero (height ~700–820px at 1440×900) with three horizontal factual cards (GPA 3,72 / 3.72, Jakarta, ID/EN).
2. **Circular Expanding Wave Theme Reveal:** Single brightness toggle triggering a geometric clip-path ripple originating strictly from the icon center in both directions with interruptible fallback and cancellation handling.
3. **Subtle Light-Mode Dynamic Gradient:** Restrained, low-chroma ambient blurred gradient active only in light mode with slow ambient drift (frozen under `prefers-reduced-motion`), while dark mode retains a deep charcoal canvas (`#0B0F17`).
4. **Interactive Capabilities Architecture:** Segmented tab bar housing a 10-item horizontal expanding accordion with rotated whole-word typography and 7 Apple-grade translucent glass software tiles displaying authentic logos.
5. **Continuous Looping & Layered Galleries:** Frictionless project carousel with exactly 4 real data-driven categories + All (Control Systems, IoT, ML, Desktop) and an organic 3D layered coverflow gallery for all 9 audited experience records (strictly manual, no autoplay).
6. **Chronological Dual-Column Education:** Straight vertical connected-dots timeline separating formal education from vocational non-formal training.
7. **Refined In-Popup CV Flow:** Single modal initiating with an ID/EN language choice before transitioning in-place to a readable preview and revealing the PDF download action.

---

## 2. Global Tokens & Layout Geometry

### 2.1 CSS Custom Properties Baseline

```css
:root {
  /* Typography */
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;

  /* Sizing & Transitions */
  --header-height: 68px;
  --max-content-width: 1240px;
  --spring-default: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-snap: 180ms;
  --duration-fluid: 350ms;
  --duration-reveal: 450ms;

  /* Light Theme Canvas & Ink */
  --canvas-bg: #F8FAFC;
  --surface-pure: #FFFFFF;
  --surface-subtle: #F1F5F9;
  --surface-glass: rgba(255, 255, 255, 0.65);
  --border-specular: rgba(255, 255, 255, 0.85);
  --border-whisper: #E2E8F0;
  --border-structural: #CBD5E1;
  --ink-primary: #0F172A;
  --ink-secondary: #475569;
  --ink-muted: #64748B;

  /* Light Theme Accent */
  --accent: #1D4ED8;
  --accent-hover: #1E40AF;
  --accent-tint: #EFF6FF;
  --text-on-accent: #FFFFFF;
  --card-shadow: 0 8px 24px -4px rgba(29, 78, 216, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
  --focus-ring: #2563EB;
}

[data-theme='dark'] {
  /* Dark Theme Canvas & Ink (Instrument Night) */
  --canvas-bg: #0B0F17;
  --surface-pure: #151D2A;
  --surface-subtle: #1E293B;
  --surface-glass: rgba(21, 29, 42, 0.7);
  --border-specular: rgba(255, 255, 255, 0.12);
  --border-whisper: #334155;
  --border-structural: #475569;
  --ink-primary: #F1F5F9;
  --ink-secondary: #94A3B8;
  --ink-muted: #7D8C9B;

  /* Dark Theme Calibrated Accent */
  --accent: #7BA3DF;
  --accent-hover: #93B5E8;
  --accent-tint: rgba(123, 163, 223, 0.14);
  --text-on-accent: #0B0F17;
  --card-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(123, 163, 223, 0.08);
  --focus-ring: #7BA3DF;
}
```

### 2.2 Responsive Viewport Matrix

| Viewport | Container Padding | Layout Strategy | Key Adjustments |
| --- | --- | --- | --- |
| **320px** (Narrow Mobile) | `16px` | Single column natural flow | Portrait circular 140px, H1 28px, 44px touch floor, zero horizontal overflow. |
| **390px** (Standard Mobile) | `20px` | Single column natural flow | Portrait 180px squircle, H1 32px, accordion vertical touch-cards. |
| **768px** (Tablet) | `32px` | 2-column adaptive | Hero 2 columns, education 2 columns, software 4 columns. |
| **1440px** (Desktop Target) | `48px` | Asymmetric 2-column split | Full Hero containment (<820px height), horizontal 10-skill accordion. |

---

## 3. Detailed Component Architecture

### 3.1 Header Chrome & Circular Wave Reveal

#### DOM Hierarchy
```html
<header class="header-chrome">
  <div class="header-container">
    <a href="#about" class="brand-link" aria-label="Fajar, beranda">
      <span class="brand-text">Fajar.</span>
    </a>

    <nav class="desktop-nav" aria-label="Navigasi utama">
      <a href="#about" class="nav-item">Tentang</a>
      <a href="#projects" class="nav-item">Proyek</a>
      <a href="#skills" class="nav-item">Kemampuan</a>
      <a href="#education" class="nav-item">Pendidikan</a>
      <a href="#experience" class="nav-item">Pengalaman</a>
      <a href="#credentials" class="nav-item">Sertifikasi</a>
      <a href="#contact" class="nav-item">Kontak</a>
    </nav>

    <div class="header-actions">
      <!-- Language Selector -->
      <div class="locale-toggle-group" role="group" aria-label="Bahasa situs">
        <button id="locale-btn-id" class="locale-chip active" aria-pressed="true">ID</button>
        <button id="locale-btn-en" class="locale-chip" aria-pressed="false">EN</button>
      </div>

      <!-- Single Brightness Toggle -->
      <button id="theme-toggle" class="theme-btn" aria-label="Ganti tema tampilan">
        <svg class="icon-sun" ...></svg>
        <svg class="icon-moon" ...></svg>
      </button>

      <!-- View CV Action Button -->
      <button id="open-cv-btn" class="cv-pill-btn">
        <span>Lihat CV</span>
      </button>
    </div>
  </div>
</header>
```

#### Circular Expanding Wave Script Contract (Luna Implementation)
```javascript
let activeThemeTransition = null;

function toggleThemeWithWave(event) {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // 1. Reduced-motion or missing View Transitions API: synchronous fallback
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !document.startViewTransition
  ) {
    applyTheme(targetTheme);
    return;
  }

  // 2. Center coordinates: ALWAYS from theme-toggle center (handles keyboard clientX=0 as well)
  const btn = document.getElementById('theme-toggle');
  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Maximum radius to furthest viewport corner
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  document.documentElement.style.setProperty('--click-x', `${x}px`);
  document.documentElement.style.setProperty('--click-y', `${y}px`);
  document.documentElement.style.setProperty('--max-radius', `${maxRadius}px`);

  // 3. Interruption Handling: If prior transition is active, supersede cleanly
  if (activeThemeTransition) {
    try {
      activeThemeTransition.skipTransition();
    } catch (e) {
      // Ignored
    }
  }

  try {
    activeThemeTransition = document.startViewTransition(() => {
      applyTheme(targetTheme);
    });

    activeThemeTransition.ready.then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` }
        ],
        {
          duration: 450,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });

    activeThemeTransition.finished.finally(() => {
      activeThemeTransition = null;
    });
  } catch (err) {
    applyTheme(targetTheme);
    activeThemeTransition = null;
  }
}
```

---

### 3.2 Dynamic Ambient Background (Light Mode Only)

```css
/* Ambient background container fixed behind content */
.ambient-gradient-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  opacity: 1;
  transition: opacity 300ms ease;
}

[data-theme='dark'] .ambient-gradient-layer {
  opacity: 0;
  visibility: hidden;
}

.ambient-gradient-layer::before {
  content: '';
  position: absolute;
  top: -10%;
  left: 15%;
  width: 65vw;
  height: 65vw;
  background: radial-gradient(circle, rgba(219, 234, 254, 0.55) 0%, rgba(241, 245, 249, 0) 70%);
  filter: blur(90px);
  animation: ambient-drift-1 28s infinite alternate ease-in-out;
}

.ambient-gradient-layer::after {
  content: '';
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 55vw;
  height: 55vw;
  background: radial-gradient(circle, rgba(224, 231, 255, 0.45) 0%, rgba(248, 250, 252, 0) 70%);
  filter: blur(100px);
  animation: ambient-drift-2 32s infinite alternate ease-in-out;
}

@keyframes ambient-drift-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(4vw, 3vh) scale(1.08); }
}

@keyframes ambient-drift-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-3vw, -4vh) scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-gradient-layer::before,
  .ambient-gradient-layer::after {
    animation: none !important;
  }
}
```

---

### 3.3 Unified Compact Hero Section

* **Height Constraint on Desktop (1440×900):** Section target is `700px – 820px`, fitting comfortably within the 900px viewport below the 68px header.
* **Layout Structure:**
  ```
  +--------------------------------------------------------------------------+
  | [Left Column - 60%]                               | [Right Column - 40%] |
  | H1: Muhammad Fajar Sodik                          | +------------------+ |
  | Subtitle: Mahasiswa Teknik Elektro · UPNVJ        | |                  | |
  | Intro: S1 Teknik Elektro, fokus pada instalasi     | | Real Portrait    | |
  |        listrik, kendali, dan OJT ASTON Kemayoran  | | Photo Card       | |
  | Buttons: [Jelajahi Proyek ->] [Lihat CV] [Kontak] | | 300x380px        | |
  | Links: Jakarta | GitHub | LinkedIn                | +------------------+ |
  +--------------------------------------------------------------------------+
  | [Bottom Fact Bar - 3 Horizontal Cards]                                   |
  | [GPA: 3,72]             | [Lokasi: Jakarta]      | [Bahasa: ID & EN]     |
  +--------------------------------------------------------------------------+
  ```

#### Bottom Fact Bar Token Matrix
* **GPA Card:** Icon `lucide:graduation-cap`. Label: `GPA`. Value: `3,72` (ID) / `3.72` (EN). Typography: `Geist` 700 18px (Sans). *Strictly no `/4.0` or semester*.
* **Location Card:** Icon `lucide:map-pin`. Label: `Lokasi / Location`. Value: `Jakarta, Indonesia`.
* **Language Card:** Icon `lucide:languages`. Label: `Bahasa / Languages`. Value: `Bahasa ibu (ID) · Dasar (EN)` (ID) / `Native (ID) · Basic (EN)` (EN).

---

### 3.4 Project Looping Showcase & Filters

#### Category Filter Keys (Derived from Audited Data)
1. `all` $\rightarrow$ **Semua / All** (Total: 5)
2. `control-systems` $\rightarrow$ **Sistem Kendali / Control Systems** (2 projects: Fuzzy Fire Suppression, AquaSync)
3. `iot` $\rightarrow$ **IoT** (2 projects: LoRa Sentinel, Smart Trash Bin)
4. `machine-learning` $\rightarrow$ **Machine Learning** (1 project: Smart Trash Bin)
5. `desktop` $\rightarrow$ **Aplikasi Desktop / Desktop Apps** (1 project: Kafe Kekinian POS)
*(Total: exactly 4 distinct real categories + All).*

#### Looping Track Geometry & Controls
* **Card Dimensions:** Width `380px` desktop, `310px` mobile. Gap: `24px`.
* **Controls Row:**
  - Play/Pause Button: Icon toggles `Pause [||]` / `Play [|>]`.
  - Step Buttons: `Previous [<]` and `Next [>]` (instant 1-card offset step).
* **State Machine for Auto-Scroll:**
  ```typescript
  interface CarouselState {
    userPaused: boolean;          // true when user clicked pause button
    hoverPaused: boolean;         // true on mouseenter
    focusPaused: boolean;         // true on focusin
    dragPaused: boolean;          // true while pointer down / dragging
    modalOpen: boolean;           // true when project dialog is open
    offscreen: boolean;           // true when IntersectionObserver is not intersecting
    reducedMotion: boolean;       // true if prefers-reduced-motion matches
  }

  // Animation runs ONLY when ALL pause flags are false
  const isPlaying = !Object.values(state).some(Boolean);
  ```

---

### 3.5 Capabilities Section (Tabs, Accordion & Glass Tiles)

#### Tab Bar
Two segmented items: `Keahlian / Skills` and `Perangkat Lunak / Software`. High contrast active pill with spring sliding transition.

#### Tab 1: Skills Expandable Horizontal Accordion (10 Items)
* **Desktop Dimensions:** Height `480px`, full width flexbox track.
* **Collapsed Card:** `flex: 1` (~65px). Dark gradient overlay over thematic background. Whole-word title oriented vertically (`writing-mode: vertical-rl; transform: rotate(180deg)`). Never individual stacked characters.
* **Expanded Card:** `flex: 4.5` (~360px). Header rotates to horizontal (`writing-mode: horizontal-tb; transform: none;`), and description body transitions in (`opacity: 1; transform: translateY(0)`).
* **10 Audited Records:**
  1. *Teknik Elektro & Kelistrikan* (Electrical Engineering)
  2. *Diagram Pengawatan* (Electrical Diagrams)
  3. *Instalasi Penerangan & Motor* (Electrical Installations)
  4. *Pemrograman PLC* (PLC Programming)
  5. *Analisis Rangkaian* (Circuit Analysis)
  6. *Python* (Python Programming)
  7. *Editing & Dokumentasi* (Technical Documentation)
  8. *Desain PCB Proteus* (Proteus PCB Design)
  9. *Sensor & Mikrokontroler* (Sensors & Protocols)
  10. *Dasar Machine Learning* (Machine Learning Basics)

#### Tab 2: Apple Translucent Glass Software Tiles (7 Items)
* **Authorized Apps:** MATLAB, Arduino IDE, STM32Cube, Altium, Fusion, Proteus, TIA Portal.
* **Squircle Tile Specifications:**
  - Size: `80×80px` desktop, `68×68px` mobile. Border radius: `22px`.
  - Material: `background: var(--surface-glass); backdrop-filter: blur(20px) saturate(180%);`
  - Specular Highlight: `border-top: 1px solid var(--border-specular);`
  - Tactile shadow: `box-shadow: 0 8px 20px -4px rgba(0,0,0,0.08);`
  - Icon: Centered authentic application logo (recognizable official vector logos, e.g. MATLAB orange waveform, Arduino teal infinity, etc.).
  - Label: Exact software name in `Geist 500` 14px positioned `8px` below tile. Non-interactive display (no tabindex or fake anchor).

---

### 3.6 Education Section (Dual-Column Connected Timeline)

* **Left Column (Formal Education - 3 entries):**
  1. **Universitas Pembangunan Nasional Veteran Jakarta** | S1 Electrical Engineering | Jul 2024 – Sekarang | GPA 3,72 / 3.72.
  2. **SMKN 5 Jakarta** | Teknik Instalasi Tenaga Listrik | Jul 2022 – Mei 2024.
  3. **SMK Kemala Bhayangkari 1 Jakarta** | Teknik Instalasi Tenaga Listrik (One Year) | Jul 2021 – Jun 2022.
* **Right Column (Non-formal Training - 1 entry):**
  1. **Pusat Pelatihan dan Pengembangan Pendidikan Jakarta Timur** | Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023 | Agu 2023.
* **Timeline Line:** Continuous vertical rule (`2px solid var(--border-whisper)`). Nodes are `12px` solid accent dots with `3px` white outline rings. **Current / Newest at TOP, Oldest at BOTTOM**.

---

### 3.7 Experience Gallery (Manual Layered Coverflow)

* **Records (All 9 Audited Experiences):**
  1. ASTON Kemayoran City Hotel (Engineering Department OJT)
  2. KSM Mekatronika (Electronic Division Staff)
  3. KSM IOT 2025 (Firmware Division Staff)
  4. Electrician Gathering 2025 (PDD Staff)
  5. Seminar Start-Up 101 (PDD Staff)
  6. Webinar Nasional Hari Listrik 2025 (PDD Staff)
  7. Seminar MOSFET 2025 (PDD Staff)
  8. Synergy Fest 2025 (PDD Staff)
  9. Electrical Competition 2025 (Mobile Legends Division Staff)
* **Coverflow Interaction:**
  - Strictly manual loop (Arrow keys, `<` / `>` buttons, drag/swipe).
  - Center active card: `transform: scale(1) translateZ(0); opacity: 1; z-index: 10;`.
  - Left / Right sibling cards: `transform: scale(0.85) translateX(±60px); opacity: 0.55; filter: blur(1px);`.
  - Complete details positioned **below** the image frame: Title, Role, Dates, Summary, and bulleted tasks.

---

### 3.8 Certifications (Six Static Landscape Cards)

* **6 Exact Titles:**
  1. *Middle Implementer of Maintenance of PLC Based Control Instruments (BNSP)*
  2. *Sertifikat Kompetensi LSK PPSDM KEBTKE*
  3. *ASTON Kemayoran City Hotel On The Job Training*
  4. *Data Analytics (Pearson IT Specialist)*
  5. *IC3 Digital Literacy Global Standard 6 Level 1*
  6. *Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023*
* **Design:** 3 columns desktop, 1 column mobile. Aspect ratio 16:10 preview frame with neutral container and image icon. **Strictly NO popup, NO modal, NO click-to-detail, NO fake verification link, NO fake seals/signatures**.

---

### 3.9 Contact Section & Live Email Copy

* **Headlines:** Eyebrow `Mari terhubung / Let’s connect`. Heading `Mari bekerja sama / Let’s work together`.
* **Email Card:**
  - Envelope icon + heading `Kirim pesan email / Send me an email`.
  - Address: `mfajarsodik.work@gmail.com`.
  - Action 1: Click email text to copy to clipboard via `await navigator.clipboard.writeText(...)`.
  - Live feedback: Localized toast appears `Email berhasil disalin! / Email copied!` only after successful resolution.
  - Action 2: Button `Buka aplikasi email` launching `mailto:mfajarsodik.work@gmail.com`.
* **Verified Social Icons:** WhatsApp (`https://wa.me/6289671216008`), LinkedIn (`https://www.linkedin.com/in/muhammadfajarsodik`), GitHub (`https://github.com/Yunachz`).

---

### 3.10 In-Popup CV Modal Flow

```
[User clicks "Lihat CV"]
         |
         v
+-------------------------------------------------------+
| Modal Dialog State 1: Language Choice                 |
| "Pilih bahasa untuk melihat CV"                       |
|                                                       |
|  +-----------------------+  +-----------------------+ |
|  | Bahasa Indonesia      |  | English               | |
|  | Ringkasan & detail    |  | Summary & details     | |
|  | [Buka CV Indonesia ->] |  | [View English CV ->]  | |
|  +-----------------------+  +-----------------------+ |
|                                                       |
| (Download button is strictly HIDDEN in State 1)       |
+-------------------------------------------------------+
         |
         | User clicks language (e.g. English)
         v
+-------------------------------------------------------+
| Modal Dialog State 2: CV Viewer (SAME POPUP)          |
| [< Ganti Bahasa / Switch Language]    [Download PDF v]|
|-------------------------------------------------------|
|                                                       |
| [Embedded Responsive PDF / HTML Fallback Viewer]      |
| cv-muhammad-fajar-sodik.pdf                           |
|                                                       |
+-------------------------------------------------------+
```

---

## 4. Local Placeholder Asset Registry

To avoid broken images or prohibited `img src="/"` links:

| Asset Path | Usage | Format / Visual Design |
| --- | --- | --- |
| `/assets/placeholders/project-placeholder.svg` | Projects without photo | Neutral geometric blueprint grid with centered project icon. Clearly dummy. |
| `/assets/placeholders/experience-placeholder.svg` | 9 Experiences | Neutral hardware/event frame with technical symbol. Clearly dummy. |
| `/assets/placeholders/cert-placeholder.svg` | 6 Certifications | Neutral landscape frame with clean document icon and "Pratinjau / Preview". Strictly no fake seals or signatures. |

---

## 5. Implementation Verification Checklist for Luna

- [ ] Header brand renders strictly **Fajar.** (no photo/title in header).
- [ ] Theme ripple wave expands strictly from brightness icon center in both directions (Light $\leftrightarrow$ Dark).
- [ ] Light-mode dynamic blurred gradient rendered with gentle drift; disabled in dark mode.
- [ ] Desktop hero fits inside `700–820px` height at 1440×900 viewport.
- [ ] Mobile hero flows naturally without forced single-screen squeeze.
- [ ] GPA displayed as `3,72` (ID) and `3.72` (EN) in `Geist 700` sans-serif; no `/4.0`, no semester.
- [ ] Fact cards show `Bahasa ibu (ID) · Dasar (EN)` in ID, `Native (ID) · Basic (EN)` in EN.
- [ ] Exactly 4 real project categories + All; no PLC filter.
- [ ] Carousel pause button, arrows, and swipe work; pauses on hover/focus/modal.
- [ ] 10-item skills horizontal accordion functions with rotated whole-word vertical titles.
- [ ] 7 Apple translucent glass software tiles render authentic application logos cleanly.
- [ ] Education timeline shows 3 formal entries on left, 1 non-formal entry on right, current at top.
- [ ] Experience gallery displays all 9 entries with manual looping (no autoplay).
- [ ] 6 certificate cards are static (no click modal, neutral placeholder).
- [ ] Email click copies text with live toast only after `await` success; mailto link functions.
- [ ] CV modal starts with ID/EN choice; download button appears only after selection in same popup.
- [ ] Footer displays `© 2026 Muhammad Fajar Sodik` and `Back to top` button.
- [ ] Zero document horizontal overflow across 320px, 390px, 768px, 1440px.
- [ ] `prefers-reduced-motion` completely disables auto-loop and wave transitions.
