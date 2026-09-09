# Native cutout batch B — verified results

Date: 2026-09-09 (Asia/Seoul). User explicitly authorized the native macOS extraction workflow.

Apple Vision `VNGenerateForegroundInstanceMaskRequest` retained every detected foreground instance. Output used `generateMaskedImage(..., croppedToInstancesExtent: false)` and Core Image RGBA8 PNG export. No image generation, color keying, background recoloring or source-file overwrite occurred. All seven inputs and outputs were visually inspected.

## Alpha and canvas proof

All canvases remain **1254 × 1254**. Every output has alpha extrema **0–255**, four alpha-zero corners, substantial fully transparent pixels and substantial fully opaque interiors. Interior probe pixels listed in `CUTOUTS-B-ALPHA.json` all have alpha 255.

| Asset | Alpha 0 pixels | Partial alpha pixels | Alpha 255 pixels | Transparent area | Opaque area | Native elapsed |
|---|---:|---:|---:|---:|---:|---:|
| html-flyer.png | 923,398 | 37,488 | 611,630 | 58.72% | 38.89% | 0.584 s |
| own-site.png | 833,956 | 39,953 | 698,607 | 53.03% | 44.43% | 0.19 s |
| agent-hand.png | 1,173,170 | 48,524 | 350,822 | 74.6% | 22.31% | 0.182 s |
| personal-context.png | 951,821 | 37,820 | 582,875 | 60.53% | 37.07% | 0.189 s |
| automation-calendar.png | 805,935 | 51,284 | 715,297 | 51.25% | 45.49% | 0.196 s |
| decision-console.png | 922,129 | 46,644 | 603,743 | 58.64% | 38.39% | 0.189 s |
| human-work.png | 781,839 | 108,920 | 681,757 | 49.72% | 43.35% | 0.195 s |

## Visual review

The seven output PNGs were composited in a browser over a dark blue-gray surface (#314153). `CUTOUTS-B-CONTACT.jpg` is this inspection contact sheet, not a replacement asset. All source component groups are present; none were regenerated or rearranged. External studio floor/backdrop was removed, including its broad floor shadow. Fractional edge alpha remains around the silhouettes. No missing component or opaque white backdrop was found.

- **html-flyer:** Paper silhouette, opaque white sheet, gray browser frame, four chat bubbles and curled lower corner retained.
- **own-site:** Browser shell and opaque interior retained, including green cube, white sphere, silver cylinder and chat control.
- **agent-hand:** All visible fingers, palm, metal joints, wrist, green accent and forearm retained; gaps between fingers are transparent.
- **personal-context:** All three white panels, checkmark, calendar, three sliders and full metal base retained.
- **automation-calendar:** Calendar sheet, spiral rings, base, clock face, clock hands and both clock feet retained.
- **decision-console:** Both green buttons, connecting metal arms, central pivot, green checkmark and full metal base retained.
- **human-work:** All three figures including white heads/limbs, three chairs, tabletop, central pedestal and green document retained. Interior background gaps are transparent.

## Files and checksums

Paths below are relative to the lecture project root. Native invocation reports and pixel checks are retained in `CUTOUTS-B-NATIVE.json` and `CUTOUTS-B-ALPHA.json`.

### html-flyer
- Source: `composition/assets/html-flyer.png`
- Source SHA-256: `8a69b73d314106637fa06a89a8ebd144cc6c49088c840933cf959d2dbc7c7a19`
- Output: `composition/assets/cutouts/html-flyer.png`
- Output SHA-256: `5459a8d7f1afc66f5f28ffd6ac2fb4ec03cbbcdecd680d9e3c107d395ed2c8b9`

### own-site
- Source: `composition/assets/own-site.png`
- Source SHA-256: `3c488483e876c7ce94d86ddd07e4354b773b4e36b1918e3dc629343d02d6efd3`
- Output: `composition/assets/cutouts/own-site.png`
- Output SHA-256: `dac1cfbb68a7157d86938264a19a1e682d0f12614ade3a1bd3ce10e85eae2e3c`

### agent-hand
- Source: `composition/assets/agent-hand.png`
- Source SHA-256: `3ade3a216b1667be0fbc5b8ee3a4c36e0a853e1f9747971c6bfd53711f019a29`
- Output: `composition/assets/cutouts/agent-hand.png`
- Output SHA-256: `4c3ddc5bd27fbdd7b2c332d1663b3a425b7e19bb46fc7943910a1ed6d72eeb04`

### personal-context
- Source: `composition/assets/personal-context.png`
- Source SHA-256: `75e7e0ca1628e697374214b10172f1a1cfd3b5706497f1046742023278a9156b`
- Output: `composition/assets/cutouts/personal-context.png`
- Output SHA-256: `4fed54225200ea2f4cceae3c9cd966599506d6d08252a397ef1ec4148cd80bc2`

### automation-calendar
- Source: `composition/assets/automation-calendar.png`
- Source SHA-256: `13640f4b847d404995cf287dd7332d23eeebc4ea44c4ba19b4fc09d1ef304d59`
- Output: `composition/assets/cutouts/automation-calendar.png`
- Output SHA-256: `81397628bb1bfdc9c6c3b1c9af6a33c25688dca9fcaee93e0dea57681625335d`

### decision-console
- Source: `composition/assets/decision-console.png`
- Source SHA-256: `0b69355a50b37818dd3623ae6a13aa3cbfc242376765c2ef85a83bbcc40aab8e`
- Output: `composition/assets/cutouts/decision-console.png`
- Output SHA-256: `24c7906cab23933bb58b6e2c355b95db045f4f45a6ed17d4740570bf47a39e3b`

### human-work
- Source: `composition/assets/human-work.png`
- Source SHA-256: `7dac0807c356da46f80eda41caa768a659b439b56f2e8c4ce27e0f431d27487b`
- Output: `composition/assets/cutouts/human-work.png`
- Output SHA-256: `a27c83768592703dcbb83dc41c86e9240d3d3f05c8da46804da06c90280110d6`

The earlier image-generation candidates described in `CUTOUTS-B-PROMPTS.md` were not used. These verified native outputs supersede those failed transparency candidates. This batch did not change the lecture HTML, runtime, template, README or published repository.
