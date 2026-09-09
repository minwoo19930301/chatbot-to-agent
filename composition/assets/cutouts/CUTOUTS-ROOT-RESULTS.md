# Root asset cutout validation

Sources remain unchanged. Both outputs keep the original 1254 × 1254 canvas. Native macOS Vision/Core Image produced the cutouts; Pillow was used only for read-only metrics and this QA contact sheet.

| Asset | Transparent pixels | Opaque pixels | Source SHA256 | Output SHA256 |
|---|---:|---:|---|---|
| markdown-memory | 821103 (52.22%) | 711485 (45.25%) | `64c1c54dd48848e259a45fd473b1714ff8b3d7c0c6c00da67931d8d33cba1acd` | `d51b1918a6061aca8ae7cdf6f57aac3ab4efc7fec235b508d03ddf36f72f93cc` |
| ax-workspace | 1204390 (76.59%) | 303306 (19.29%) | `7c258dc5f6bd232c27799d2c64df93647a01579af4be45045383365ade925b38` | `2f022ffb3d0ae23838f70ab8b2f943510ec3607eba136416638c491566af157d` |

Paths are relative to the lecture project:
- `composition/assets/markdown-memory.png` → `composition/assets/cutouts/markdown-memory.png`
- `composition/assets/ax-workspace.png` → `composition/assets/cutouts/ax-workspace.png`

`markdown-memory` passed without repair: white paper, folds, lettering, green tabs and metal tray remain opaque.

Initial AX segmentation omitted all three mice, the right keyboard and portions of monitor stands (initial output SHA256 `14063cb849d70c561d1296cec7bdf4adb7a90f61a9f43c8319c334512f6657e2`). The accepted native repair unions three crop-local Vision mouse masks and source-traced stand/keyboard protection polygons with the original alpha mask, then composites the untouched original RGB through that mask. Rejected intermediate masks with white rectangular patches were never installed.

Final dark-background inspection confirms three complete computers, keyboards and mice, three intact white screens, the central white .md stack and all green connecting branches. White screen/paper probes remain alpha 255; background gap probes remain alpha 0. Original artwork has some soft light edging around metal surfaces; this is retained source styling, not a white canvas.

Evidence: `composition/assets/cutouts/CUTOUTS-ROOT-ALPHA.json` and `composition/assets/cutouts/CUTOUTS-ROOT-CONTACT.jpg`.
