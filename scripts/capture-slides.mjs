const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { validateManifest } from './build-wrapper.mjs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const manifest=JSON.parse(await readFile(new URL('../manifest.json', import.meta.url),'utf8'));
const ids=validateManifest(manifest);
const deckURL=process.env.DECK_URL || `http://127.0.0.1:${process.env.DECK_PORT || 8767}/`;
const snapshotDir=new URL('../snapshots/', import.meta.url);
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(deckURL);await page.waitForTimeout(1000);
  await mkdir(snapshotDir,{recursive:true});const frames=[];
  for(let i=0;i<ids.length;i++) {
    if(i){await page.keyboard.press('ArrowRight');await page.waitForTimeout(1100);}
    const visual=await page.evaluate(()=>{
      const frame=document.querySelector('hyperframes-player').iframeElement;
      const d=frame.contentDocument,w=frame.contentWindow;
      const scene=d.querySelector('.scene-frame[aria-hidden="false"]');
      function effectiveOpacity(el){let value=1;for(let n=el;n&&n!==scene;n=n.parentElement)value*=Number(w.getComputedStyle(n).opacity);return value;}
      const actors=[...scene.querySelectorAll('.story-art,.large-object,.brain-copy')].map(el=>{
        const r=el.getBoundingClientRect();
        const images=el.tagName==='IMG'?[el]:[...el.querySelectorAll('img')];
        return {selector:el.className,opacity:effectiveOpacity(el),transform:w.getComputedStyle(el).transform,width:r.width,height:r.height,imagesReady:images.every(img=>img.complete&&img.naturalWidth>0)};
      });
      const hiddenImages=[...scene.querySelectorAll('img')].filter(el=>!el.complete||!el.naturalWidth||effectiveOpacity(el)<=.95).map(el=>el.getAttribute('src'));
      return {active:d.body.dataset.activeSlide,actors,hiddenImages};
    });
    const active=visual.active;
    assert.equal(active,ids[i]);
    assert.deepEqual(visual.hiddenImages,[],`Hidden or unloaded image on ${active}`);
    assert.ok(visual.actors.every(actor=>actor.opacity>.95&&actor.width>0&&actor.height>0&&actor.imagesReady),`Unsettled or missing artwork on ${active}: ${JSON.stringify(visual.actors)}`);
    const file=`snapshots/slide-${String(i+1).padStart(2,'0')}.png`;
    const bytes=await page.screenshot({path:new URL('../'+file, import.meta.url).pathname});
    frames.push({slide:i+1,sceneId:active,actors:visual.actors,file,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  assert.equal(new Set(frames.map(f=>f.sha256)).size,ids.length);assert.deepEqual(errors,[]);
  await writeFile(new URL('slides-proof.json',snapshotDir),JSON.stringify({width:1920,height:1080,unique:ids.length,frames,errors},null,2)+'\n');
  console.log(JSON.stringify({captured:frames.length,unique:ids.length,errors}));
} finally {await browser.close();}
