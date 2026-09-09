import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function validateManifest(manifest) {
  if (!manifest || !Array.isArray(manifest.slides) || manifest.slides.length === 0) {
    throw new Error('Manifest must contain at least one slide.');
  }
  const seen = new Set();
  let expectedStart = 0;
  for (const [index, slide] of manifest.slides.entries()) {
    if (!slide || typeof slide.sceneId !== 'string' || !slide.sceneId.trim() || seen.has(slide.sceneId)) {
      throw new Error(`Slide ${index + 1} must have a nonempty, unique sceneId.`);
    }
    if (!Number.isFinite(slide.startTime) || !Number.isFinite(slide.endTime)
        || slide.startTime < 0 || slide.endTime <= slide.startTime
        || Math.abs(slide.startTime - expectedStart) > 1e-6) {
      throw new Error(`Slide ${index + 1} must have a positive, continuous time range starting at ${expectedStart}.`);
    }
    seen.add(slide.sceneId);
    expectedStart = slide.endTime;
  }
  return manifest.slides.map(slide => slide.sceneId);
}

async function build() {
const manifest = JSON.parse(await readFile(resolve(project, 'manifest.json'), 'utf8'));
const ids = validateManifest(manifest);
const island = JSON.stringify(manifest, null, 2).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ChatBot에서 Agent로</title>
  <script defer src="vendor/hyperframes-player.global.js"></script>
  <script defer src="vendor/hyperframes-slideshow.global.js"></script>
  <script defer src="scripts/wrapper-runtime.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
    body { font-family: "Apple SD Gothic Neo", "Helvetica Neue", sans-serif; }
    hyperframes-slideshow { display: block; position: relative; width: 100vw; height: 100vh; }
    hyperframes-player { position: absolute; inset: 0; }
  </style>
</head>
<body>
  <hyperframes-slideshow tabindex="0" aria-label="ChatBot에서 Agent로">
    <hyperframes-player interactive src="composition/index.html"></hyperframes-player>
    <script type="application/hyperframes-slideshow+json">${island}</script>
  </hyperframes-slideshow>
</body>
</html>
`;
await writeFile(resolve(project, 'index.html'), html);
const compositionPath = resolve(project, 'composition/index.html');
const composition = await readFile(compositionPath, 'utf8');
await writeFile(compositionPath, composition.replace(/(<script type="application\/hyperframes-slideshow\+json">)[\s\S]*?(<\/script>)/, () => `<script type="application/hyperframes-slideshow+json">${island}</script>`));
console.log(`Built index.html from manifest.json: ${ids.length} slides, local bundles, built-in presenter.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
