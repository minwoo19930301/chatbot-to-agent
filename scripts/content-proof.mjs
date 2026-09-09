import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from './build-wrapper.mjs';

const normalize = text => String(text || '').replace(/\s+/g, ' ').trim();
const compact = text => normalize(text).replace(/\s/g, '');

// Pure assertions can be exercised before the composition or browser is ready.
export function validateContent(rows, { title, expectedCount, storyOrder = [], learningId = 'learning' } = {}) {
  const issues = [];
  const visibleText = rows.map(row => normalize(row.text)).join(' ');
  if (title !== 'ChatBot에서 Agent로') issues.push('Browser title must be ChatBot에서 Agent로.');
  if (compact(rows[0]?.text) !== 'ChatBot에서Agent로') issues.push('Opening slide must show the requested title only.');
  if (rows[0]?.images?.some(image => image.visible)) issues.push('Opening slide must contain no brain or other artwork.');
  if (rows[1]?.id !== 'makers' || rows[2]?.id !== 'models') issues.push('Company makers must precede the model names on slides 2 and 3.');
  if (!rows[2]?.text.includes('Fable')) issues.push('Fable must appear on slide 3.');
  if (expectedCount !== undefined && rows.length !== expectedCount) issues.push(`Expected ${expectedCount} slides, found ${rows.length}.`);
  for (const forbidden of ['모델의 비법', '피드백']) {
    if (compact(visibleText).includes(compact(forbidden))) issues.push(`Forbidden audience copy: ${forbidden}`);
  }
  for (const word of ['Opus', 'Fable', 'Flash', 'Pro', 'OpenClaw', 'Pi', 'Hermes']) {
    if (!new RegExp(`(^|[^A-Za-z0-9])${word}([^A-Za-z0-9]|$)`).test(visibleText)) issues.push(`Missing visible name: ${word}`);
  }
  if (!compact(visibleText).includes('ClaudeDesktop')) issues.push('Missing visible name: Claude Desktop');
  const learning = rows.find(row => row.id === learningId);
  if (!learning || !compact(learning.text).includes('학습데이터')) issues.push('Learning slide must show 학습데이터.');
  if (learning) {
    const images = (learning.images || []).filter(image => image.visible);
    for (const name of ['google-company.png', 'anthropic-company.svg', 'openai-company.svg']) {
      if (!images.some(image => image.src.split(/[?#]/)[0].endsWith('/' + name))) issues.push(`Learning slide missing visible company logo: ${name}`);
    }
    if (images.some(image => /data[\s_-]*cent(?:er|re)|server[\s_-]*rack|데이터\s*센터/i.test(image.src + ' ' + image.alt))) {
      issues.push('Learning slide must not show a datacenter asset.');
    }
  }
  const visibleImages = id => (rows.find(row => row.id === id)?.images || []).filter(image => image.visible);
  const makers = visibleImages('makers');
  for (const filename of ['google-company.png', 'anthropic-company.svg', 'openai-company.svg']) {
    if (!makers.some(image => image.src.endsWith('/' + filename))) issues.push(`Makers scene missing company logo: ${filename}`);
  }
  if (visibleImages('local_app').some(image => image.src.includes('agent-hand'))) issues.push('Local app/API explanation must appear before the agent hand.');
  for (const filename of ['gmail.svg', 'google-calendar.svg']) {
    if (!visibleImages('schedule').some(image => image.src.endsWith('/' + filename))) issues.push(`Schedule example missing source: ${filename}`);
  }
  if (!rows.find(row => row.id === 'schedule')?.text.includes('09:00')) issues.push('The concrete daily schedule needs 09:00.');
  if (!rows.find(row => row.id === 'job_review')?.text.includes('OK')) issues.push('The application workflow needs explicit human OK.');
  const requiredFlow = ['api', 'local_app', 'agent_structure', 'services', 'agents', 'cli', 'gui', 'compare', 'personal', 'custom_result', 'automation', 'schedule', 'job_start', 'job_find', 'job_filter', 'job_documents', 'job_write', 'job_review', 'job_submit', 'rules', 'rules_run', 'scattered', 'ax', 'centralize', 'agent_workflow', 'vibe_tools', 'agent_customers', 'interfaces'];
  let flowIndex = -1;
  for (const id of requiredFlow) {
    const next = rows.findIndex(row => row.id === id);
    if (next <= flowIndex) issues.push(`Requested API, automation or AX sequence is broken at ${id}.`);
    flowIndex = next;
  }
  let lastIndex = -1;
  for (const id of storyOrder) {
    const index = rows.findIndex(row => row.id === id);
    if (index === -1) issues.push(`Story scene is absent: ${id}`);
    else if (index <= lastIndex) issues.push(`Story order is incorrect at ${id}`);
    lastIndex = index;
  }
  for (const row of rows) {
    if (row.visibleSceneIds?.length !== 1 || row.visibleSceneIds[0] !== row.id) issues.push(`Exactly one scene must be visible: ${row.id}`);
    if (row.overflow?.length) issues.push(`Audience text exceeds the canvas: ${row.id}`);
  }
  return issues;
}

function option(name) {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} needs a value.`);
  return value;
}

async function run() {
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
  const ids = validateManifest(manifest);
  const deckURL = process.env.DECK_URL || `http://127.0.0.1:${process.env.DECK_PORT || 8767}/`;
  const count = option('--count');
  const expectedCount = count === undefined ? ids.length : Number(count);
  if (!Number.isInteger(expectedCount) || expectedCount < 1) throw new Error('--count must be a positive integer.');
  const storyOrder = (option('--story-order') || '').split(',').map(id => id.trim()).filter(Boolean);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
    const browserErrors = [];
    page.on('pageerror', error => browserErrors.push(error.message));
    await page.goto(deckURL);
    await page.waitForTimeout(1100);
    const rows = [];
    for (let index = 0; index < ids.length; index++) {
      if (index) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100); }
      const row = await page.evaluate(() => {
        const frame = document.querySelector('hyperframes-player').iframeElement;
        const doc = frame.contentDocument, win = frame.contentWindow;
        const scene = doc.querySelector('.scene-frame[aria-hidden="false"]');
        const visibleSceneIds = [...doc.querySelectorAll('.scene-frame')].filter(el => win.getComputedStyle(el).visibility === 'visible').map(el => el.dataset.compositionId);
        const overflow = [];
        const walker = doc.createTreeWalker(scene, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.textContent.trim()) continue;
          const range = doc.createRange(); range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (rect.width && rect.height && (rect.left < -2 || rect.top < -2 || rect.right > 1922 || rect.bottom > 1082)) {
              overflow.push({ text: node.textContent.trim(), x: rect.x, y: rect.y, width: rect.width, height: rect.height });
            }
          }
        }
        const images = [...scene.querySelectorAll('img')].map(image => {
          let opacity = 1, visible = true;
          for (let node = image; node && node !== scene; node = node.parentElement) {
            const css = win.getComputedStyle(node); opacity *= Number(css.opacity);
            if (css.display === 'none' || css.visibility === 'hidden') visible = false;
          }
          const rect = image.getBoundingClientRect();
          visible = visible && opacity > .95 && rect.width > 0 && rect.height > 0 && image.complete && image.naturalWidth > 0;
          return { src: image.getAttribute('src') || '', alt: image.alt, visible, opacity, naturalWidth: image.naturalWidth };
        });
        return { id: scene.dataset.compositionId, text: scene.innerText.replace(/\s+/g, ' ').trim(), visibleSceneIds, overflow, images };
      });
      if (row.id !== ids[index]) throw new Error(`Navigation mismatch: expected ${ids[index]}, found ${row.id}`);
      rows.push(row);
    }
    const title = await page.title();
    const issues = [...validateContent(rows, { title, expectedCount, storyOrder, learningId: option('--learning') || 'learning' }), ...browserErrors];
    const proof = { ok: issues.length === 0, title, slideCount: rows.length, storyOrder, issues, slides: rows,
      limit: 'DOM checks verify rendered text and declared image identity; asset meaning and official provenance require separate source/visual review.' };
    const snapshots = new URL('../snapshots/', import.meta.url);
    await mkdir(snapshots, { recursive: true });
    await writeFile(new URL('content-proof.json', snapshots), JSON.stringify(proof, null, 2) + '\n');
    console.log(JSON.stringify({ ok: proof.ok, title, slideCount: rows.length, issues }, null, 2));
    if (issues.length) process.exitCode = 1;
  } finally { await browser.close(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await run();
