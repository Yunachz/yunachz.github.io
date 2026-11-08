# V7 user visual corrections — 2026-11-08

These user reports extend the active V7 revision. Functional tests alone did not establish visual acceptance. Preserve existing feature data, four dummy records, 3+1 pagination, bilingual content, keyboard/touch access and history.

## About

See `V7-ABOUT-REVISION.md`: visible cursor-distorted grid matching the new reference, removal of local pause UI/function, and a visibly moving outlined MUHAMMAD FAJAR SODIK background name. Automatic lifecycle and reduced-motion behavior remain required.

## Competition photo interaction

User video: `/home/yunachz/Videos/Screencasts/Screencast from 2026-11-08 08-05-07.webm` (10.23 seconds). Durable copy: `.checkpoints/v7-about-revision-2026-11-08/competition-bug.webm`; coordinator viewed the two-frames-per-second `competition-current-contact-sheet.jpg`. The current photographs change inside an essentially fixed rounded rectangle; the user explicitly rejects this as unlike their original animation reference.

Original reference remains `.checkpoints/v7-planning-pause-2026-11-06/WhatsApp Video 2026-11-06 at 2.13.54 PM.mp4`. Coordinator also reviewed `.checkpoints/v7-planning-sol/competition-filmstrip-0.jpg`, `competition-filmstrip-2.jpg` and `competition-filmstrip-3.jpg`. In the latter two, approximately 3.3–6.6 seconds, images visibly form a layered card stack with different angles and exposed edges; transitions show the photos changing pose/order rather than only replacing content in a fixed window. Exact easing and displacement values are design proposals, not measured reference facts.

Designer: expand the narrow visual revision handover with a competition card-stack section, after inspecting original video and latest user video. Specify distinct resting rotations/offsets, visible exposed photo edges, outgoing/incoming card motion and settle, local clipping/safe spacing, responsive limits and reduced-motion alternative. Do not edit product source. Use the requested design/motion skills and preserve adjacent title/status/body layout.

Luna remains sole source editor. Implement the revised stack after coordinator design guidance: do not flatten all photos into one clipped frame or use only crossfade. Preserve native photo button semantics, per-record wrap/counter, stable state after rapid inputs, page switching cancellation, 3+1 pagination and no-JS first-photo fallback. Avoid multiple transform owners between V6 entrance wrapper and deck layers. Verify actual resting and intermediate silhouettes in screenshots/video at desktop and narrow widths. Keep text/focus controls clear and prevent document overflow. Capture before/mid/after visual evidence and meaningful interaction checks, then create a new unique frozen preview. Prior frozen artifacts remain historical.

The competition animation and About visual requests are unfinished until the concrete revised preview has been visually reviewed. Do not equate passing photo-counter/pagination checks with matching the reference.

## Coordinator design reconciliation

Designer report `V7-ABOUT-DESIGN-REVISION.md` was expanded and reviewed after status `msg_85af0c9f49ae`. Coordinator instruction to sole implementer: `msg_61251d20bc11`.

Accept the visible grid/accent direction, single-alpha outlined name, and unclipped three-card stack with exposed resting angles/edges and outgoing swing/reorder/settle. Proposed desktop poses 0/+3.5/−4.5 degrees and approximately 340 ms transition are tuning starting points, not measured reference acceptance. Calibrate narrow variants with reserved safe space and actual visual evidence.

Do not copy conflicting CSS transitions onto deck properties continuously written by the JavaScript frame owner. Keep one owner for each transform/opacity and preserve existing state/cancellation generation logic, native buttons, no-JS fallback and separate V6 entrance wrapper. Keep existing marquee phase/speed architecture and real DOM stacking; avoid global z-index rewrites. Preserve automatic lifecycle/reduced-motion behavior after removing the local pause control.

The designer's exact contrast/CPU/GPU numbers, claims of physically critical damping, or matching a measured reference frame cadence are not verified findings. A hidden toggle remains a present DOM node and does not itself make the startup guard false; its removal requires guard decoupling. Final QA/reports must distinguish actual evidence from proposed values. Designer documentation does not itself constitute acceptance of the revised preview.
