# Third-party JavaScript

These are unmodified upstream browser distributions. They retain their own licenses; the project's own license does not relicense them.

| Files | Version | Source | License |
|---|---|---|---|
| `hyperframes-player.global.js`, `hyperframes-slideshow.global.js` | 0.8.31 | `hyperframes@0.8.31` npm package, `dist/` | Apache-2.0 per package metadata; upstream license copied as `hyperframes-LICENSE.txt` |
| `gsap.min.js` (also copied to `composition/vendor/`) | 3.14.2 | `gsap@3.14.2/dist/gsap.min.js` | GSAP Standard No Charge License; bundled header retained, see `gsap-LICENSE-NOTICE.txt` |

`manifest.json` records exact source URLs, sizes and SHA-256 hashes of the three distributions. Optional authoring checks use a separate pinned `hyperframes@0.8.33` CLI; they do not silently replace the vendored browser files.

Upstream references, checked 2026-09-09:

- https://github.com/heygen-com/hyperframes (Apache license: https://github.com/heygen-com/hyperframes/blob/main/LICENSE)
- https://www.npmjs.com/package/hyperframes/v/0.8.31
- https://www.npmjs.com/package/gsap/v/3.14.2
- https://gsap.com/standard-license (GSAP license and usage conditions)

Artwork and third-party logos are separate from these JavaScript licenses. Consult their asset provenance records.
