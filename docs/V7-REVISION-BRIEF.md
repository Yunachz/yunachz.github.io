# V7 competition and motion revision brief

Date: 2026-11-06. Baseline: released V6 source `a4fd021f940c860558ceda30fe85658a17cbb6b4`, documentation HEAD `976fffd89891ab6f171d205e8fb52f661e428841`.

## User requirements

1. Add Competition & Achievements, covering participation as well as wins. Each record has a clickable multi-photo presentation, competition title, result/status, and activity description. For unsuccessful entries use a brief encouraging status. Show 3 competitions per page; page changes move horizontally like certificate pagination.
2. User explicitly authorizes **4 dummy competition records and existing dummy images** for pagination testing (3 + 1). Mark examples clearly; do not present invented achievements as real facts. Keep replacement through content files straightforward, with bilingual labels/content consistent with the current site.
3. Improve first-entry motion for non-heading components/islands/text when they enter the viewport, preserving current per-element/once-per-document behavior and title typing. Supporting UI additions are allowed when they fit the existing design and improve animation.
4. Add the exact React Bits GlareHover JS-CSS component to certificate images, triggered once on first viewport entry and again on hover. Registry: https://reactbits.dev/r/GlareHover-JS-CSS.json ; docs: https://reactbits.dev/animations/glare-hover . Fetch exact source and listed dependencies; preserve provenance/license. Requested configuration: width 360px, height 240px, borderRadius 20px, mode hover, variant streak, glareColor #ffffff, glareOpacity 0.5, glareSize 30, softness 0.6, glareAngle -45, blendMode screen, rimGlint true, transitionDuration 650. Adapt outer sizing to current responsive certificate layout without distorting images or breaking viewers/downloads. Plan how first-entry triggering cooperates with hover mode using the real API.
5. Add moving name text in the middle of About, inspired by the video, using Muhammad Fajar Sodik and fitting the current About/lanyard composition.
6. Add cursor-responsive distorted grid/background in About, inspired by the supplied screenshot. Designer may propose a better fitting variation. It must remain subordinate to readable content and usable lanyard.

## References to actually inspect

- Competition photo/layout/click animation: `/home/yunachz/Downloads/WhatsApp Video 2026-11-06 at 2.13.54 PM.mp4`.
- About moving outlined name text: `/home/yunachz/Downloads/WhatsApp Video 2026-11-06 at 2.36.06 PM.mp4`.
- Grid-distortion screenshot: `/tmp/orca-paste-1793951029459-8c1558f9-d436-487b-b19c-6fa2b39e1140.png`.
- Coordinator contact sheets: `/tmp/v7-competition-reference.png` and `/tmp/v7-about-reference.png`. Inspect full videos at closer intervals for click mechanics; the sheets alone do not prove animation behavior.

## Workflow and constraints

- Coordinator owns this brief and gates. Planner: Codex GPT-6.1 Sol high. Designer: Antigravity Gemini 3.8 Flash. Sole product implementer: Codex GPT-6 Luna max, after planning/design reconciliation.
- All workers use caveman. Designer must read impeccable, taste-design, apple-design, ui-ux-pro-max, design-taste-frontend, and relevant motion/GSAP guidance. No separate local skill named motion-design or gsap was found in initial skill scans. Official GSAP skills are available at https://github.com/greensock/gsap-skills ; read applicable SKILL.md files directly, document exact sources, and use Impeccable motion guidance. Do not claim missing skills were loaded or install arbitrary skill packages globally.
- Before product changes, planner must cover all current project documentation, reconcile historical instructions against the completed V6 release, and document coverage. Designer reads current product/design/brief and latest reports before proposing changes. No product edits during these read-only planning tasks.
- Preserve all historical untracked docs, original portrait/CV bytes, bilingual/theme support, existing data and interactions, V6 startup/reveal/drag fixes, manual Experience, project autoplay/pause, and certificate viewer/download behavior. No reset/clean/broad staging.
- Design motion coherently: avoid multiple transform owners, content hidden forever on JS failure, motion-induced layout shifts, or duplicate lanyard/fallback. Provide keyboard/click/touch behavior and reduced-motion alternatives. Decorative continuous animations should suspend offscreen/hidden, respect user pause if applicable, and avoid blocking pointer interactions.
- Prefer integrating with the existing Astro and once-only entrance controller. Evaluate GSAP scope, cleanup and performance deliberately rather than mounting a new heavy island per certificate.
- Build a reviewable preview and obtain designer/coordinator gates before any publication step. This brief does not claim the new work is already authorized for public deployment.

## Required planning deliverables

- `docs/V7-PLAN.md`: documentation coverage, architecture/content schema, exact registry/API/dependency findings, integration risks, phased implementation and meaningful acceptance checks (including 4 records over 2 pages).
- `docs/V7-DESIGN-MOTION.md`: reference analysis, chosen section placement/layout, motion matrix (trigger, duration/easing/stagger, ownership, first-entry/hover behavior), responsive and reduced-motion treatment, and supporting UI with rationale. Clearly distinguish proposal from implemented behavior.
