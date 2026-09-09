# Optional native cutouts on macOS

Run the commands below from a generated deck project directory. Use only when native local image editing is authorized. This is a local alternative after a generated cutout fails actual-alpha verification, or when the user requests source-preserving background removal. It is not part of build/presentation and does not run automatically. macOS 14+ and Swift/Xcode Command Line Tools are required; no Python image-editing dependency is used.

```sh
mkdir -p cutout-review
swift scripts/native-cutout.swift composition/assets/source.png cutout-review/candidate.png cutout-review/mask.png > cutout-review/provenance.json
node scripts/check-alpha.mjs --require-transparent cutout-review/candidate.png
```

The input, output and mask paths must differ. Existing output files are refused, including path aliases. The tool stages new PNGs and refuses to overwrite destinations. It keeps original dimensions and object positions, uses Vision revision 1 with **all detected foreground instances**, then applies the mask to the original RGB over transparent pixels. Color is encoded as sRGB. The JSON report records input/output SHA-256, dimensions, detected instances and correction counts. Keep the original and the report.

For an equal-cell sprite atlas, create a JSON options file and pass it as a fourth argument:

```json
{"columns": 3, "rows": 2}
```

The original width and height must divide exactly into the grid. Each tile is processed independently, then returned to its original pixel position without resizing. Check every tile, including multiple disconnected parts. A request finding zero instances fails before output is written; a nonempty instance set can still miss important parts.

## Repairing an omitted white interior or peripheral

Vision can omit screens, white paper, stand bases, keyboards or mice. First inspect the original and candidate against a dark background. Never remove all white pixels globally. Optional `protect` polygons union opaque areas into the mask; `clip` polygons intersect the mask to remove exterior residue. Coordinates are original **top-left pixel coordinates**. Each polygon needs at least three finite `[x,y]` points inside the canvas. Every clipping polygon must enclose all content to keep. These are author-supplied source-derived paths, not inferred replacement objects.

```json
{"protect": [[[100,100],[300,100],[300,220],[100,220]]], "clip": []}
```

This rectangle is a syntax example only, **not a valid mask for any bundled artwork**. Trace the actual source interior or silhouette; do not guess from another picture. Preserve white material inside objects and apply repairs to original RGB. Start with a new output name for each iteration. No lecture-specific geometry is bundled in the helper.

## Accepting a result

The alpha checker must report substantial fully transparent and fully opaque areas; an alpha channel alone is insufficient. Check all four corners, white interior samples and every expected object. Compare original/candidate canvas dimensions and atlas cell arrangement. Inspect full size and presentation size on dark and light backgrounds, including edges, text and thin parts. A passing pixel-alpha check does not certify a good silhouette. Only copy a reviewed candidate into the presentation's asset directory. Keep source/output hashes and correction notes with asset provenance.

Official API: [foreground instance mask request](https://developer.apple.com/documentation/vision/vngenerateforegroundinstancemaskrequest), [instance mask observation](https://developer.apple.com/documentation/vision/vninstancemaskobservation).
