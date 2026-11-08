# GlareHover provenance

- Registry item: <https://reactbits.dev/r/GlareHover-JS-CSS.json>
- Registry response: HTTP 200, captured 2026-11-06 from the durable V7 planning evidence.
- Exact registry JSON: 11,430 bytes, SHA-256 `8bb09c07743680d4da8d22c2b7ed3218421d75a5e4da2f3617efe78102252f04`.
- Upstream files: `GlareHover.jsx` 9,501 bytes, SHA-256 `2279e8920957cea3570cec387f184a76f23281ae2e59ccc5299cb5a71bb90fc2`; `GlareHover.css` 1,045 bytes, SHA-256 `556debf36792dd1a774b27f96c120494b7d2a1ed19c188f2b30faf5df31f2b35`.
- Upstream license: <https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md>, 2,060 bytes, SHA-256 `4bdd1fa59a6b7d5954bc3b213dbc34e455c635a94bbcecf9293553797d0fad02`. The full MIT + Commons Clause text is preserved in [LICENSE.md](./LICENSE.md); this is not plain MIT.
- Registry `dependencies` and `registryDependencies` were empty. React and React DOM were already direct project dependencies; no dependency was added.

`GlareHover.jsx` began as the byte-verified registry payload. Its visual algorithm, public props, 33-stop gradient, cosine sweep easing, `streak` profile, screen blend mode and rim construction remain upstream. Local lifecycle changes are limited to certificate eligibility and cleanup:

1. Intro requires an intersecting ratio of at least 0.4 and a connected image slot on the active credential page, with a nonzero visible area below the fixed header. The same observer uses a header-size root margin; it refreshes only when that header changes size.
2. First eligible hover counts as the intro. A visible intro skipped for reduced motion is consumed for this document, so normal motion restored later does not replay it.
3. Live reduced-motion changes, document visibility, offscreen/inert page state, and a private `credential:eligibilitychange` event cancel the single active sweep and settle at rest. `CredentialGlareEnhancement.jsx` listens once for portfolio page, locale, and visibility changes, then notifies mounted portal roots; instances remain stable and are not remounted.
4. Page/locale/visibility/media/resize observers, rAF and timers are removed or canceled during cleanup. No polling loop or synthetic pointer event was added.
5. A first eligible intro sets hover-mode presence before its native sweep. After lifecycle cancellation, a later intentional hover or keyboard focus restores presence before sweeping; an offscreen card stays visually clear until that input.

The React component is rendered once from `CredentialGlareEnhancement.jsx`. It portals the actual upstream component into existing static credential image frames. Static `<img>`, anchor URLs, dialog payloads, PDF downloads and V6 entrance markers remain owned by Astro and the existing document-level viewer.
