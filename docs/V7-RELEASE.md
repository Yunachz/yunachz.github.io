# V7 public release

Status: **released and publicly verified — 2026-11-08**.

## Release identity

- Site: [https://yunachz.github.io/](https://yunachz.github.io/)
- Repository: Yunachz/yunachz.github.io
- Existing remote: origin (https://github.com/Yunachz/yunachz.github.io.git)
- Release branch: main
- Source-bearing release commit: **6639a2ca06fc248d90e2292efe15838f03c1557a** — feat: ship V7 portfolio experience
- Pages workflow: [run 42458703729](https://github.com/Yunachz/yunachz.github.io/actions/runs/42458703729), completed successfully on main for source SHA 6639a2ca06fc248d90e2292efe15838f03c1557a.
- GitHub Pages API confirmed workflow deployment, source main at /, the public URL above, and HTTPS enforcement.

This release record is a documentation-only follow-up. Public V7 source comes from commit 6639a2ca06fc248d90e2292efe15838f03c1557a; the documentation update does not change site source.

## Build and deployed artifact identity

The release source passed npm run build; its prebuild content validation also passed with four competition records. The build generated seven pages. Local dist/index.html and the frozen candidate are 146,521 bytes with SHA-256 638cf795930085b1b539d20faf1eb2e1de5d963028a58297b8c85fa777722e4e, matching the accepted preview manifest.

The workflow artifact archive is 4,270,080 bytes with SHA-256 070bb631bfbcf47329d55b4158b8a750b0f03c44a4f477ee65ba53d5d0f8a712. Its index.html and the public root response are both 146,524 bytes with SHA-256 2bafa5fadddcda02067f56d2f0f4e0b01bbb85a47587edea5902ee7325601c3c.

The three-byte HTML size increase comes only from two Astro island uid values generated in the workflow build. Local values were GeADW (5 characters) and 1KnzFV (6); workflow and public values were Z2wRIxg (7) and Z228Fvm (7). Replacing only these uid values with a stable marker makes the local HTML and workflow artifact byte-identical. The public HTML exactly matches the workflow artifact.

The root response returned HTTPS 200 with Content-Encoding: gzip and Content-Length: 25830. Node fetch decoded the response before hashing its 146,524-byte body, so the comparison uses deployed file bytes, not compressed transfer bytes. All 12 emitted JavaScript and CSS bundles returned 200 and matched the accepted manifest, local build, workflow artifact, and public responses.

## Public smoke

The focused browser smoke completed at 2026-11-08T07:48:36Z with success true, no errors, and no browser console errors. It ran at 1920×1080 using ANGLE SwiftShader.

- About grid spanned the full 1920-pixel viewport, the outlined name was visible, and no local pause control was present.
- Both hero actions worked: View CV opened the language dialog, and Explore Projects navigated to #projects.
- Four labelled dummy competition records rendered in a 3+1 layout. Each had three photos; the photo deck advanced to 2/3, and the visible, hit-tested next-page button showed the final one-record page while the first page became inert.
- All eight credential GlareHover slots mounted. The certificate viewer opened with its image and download link.
- Browser console error list was empty.

The [smoke report](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-smoke.json), [build hashes](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/build-identity.sha256), [scoped staging allowlist](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/staging-allowlist.txt), and downloaded [Pages artifact](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/actions-artifact/github-pages/artifact.tar) remain under .checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/.

Public screenshots:

- [Home and About](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-home-hero.png)
- [About grid and name](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-about-grid-name.png)
- [CV dialog](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-cv-dialog.png)
- [Competition page one](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-competition-page-1.png)
- [Competition page two](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-competition-page-2.png)
- [Credential GlareHover](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-credentials-glare.png)
- [Certificate viewer](../.checkpoints/v7-implementation-2026-11-06/release-v7-2026-11-08/public-smoke/public-certificate-viewer.png)

The first smoke attempt exposed a test-harness issue: its page-two click target was above the viewport. That failed report and screenshots remain in public-smoke-initial-failure/. The rerun scrolled the real control into view, verified its hit target, and used pointer input; it passed without a product change. The initial raw HTML equality check also exposed the build-generated uid variance documented above.

## Limits and preserved files

The browser used software WebGL. These checks establish deployed browser behavior, not hardware GPU performance. The existing 543,853-byte Lanyard bundle still triggers Vite's 500 kB advisory.

The release commit staged exactly the 36 paths listed in the allowlist. Unrelated historical V3–V6 documents and ignored .checkpoints evidence remain on disk and were not staged, reset, cleaned, or stashed.
