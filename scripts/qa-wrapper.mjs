const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateManifest } from './build-wrapper.mjs';
const manifest=JSON.parse(await readFile(new URL('../manifest.json', import.meta.url),'utf8'));
const ids=validateManifest(manifest);
const deckURL=process.env.DECK_URL || `http://127.0.0.1:${process.env.DECK_PORT || 8767}/`;
const deckOrigin=new URL(deckURL).origin;
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
const errors=[];const failed=[];const offOrigin=[];
context.on('page', p => p.on('pageerror', e=>errors.push(e.message)));
page.on('pageerror', e=>errors.push(e.message));
context.on('requestfailed',r=>failed.push({url:r.url(),failure:r.failure()}));
context.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()});});
context.on('request',r=>{if(!r.url().startsWith(deckOrigin+'/')&&!r.url().startsWith('data:')&&!r.url().startsWith('about:'))offOrigin.push(r.url());});
async function state(p) {return p.evaluate(()=>{
 const frame=document.querySelector('hyperframes-player').iframeElement;
 const w=frame.contentWindow,d=frame.contentDocument;
 const scene=d.querySelector('[aria-hidden="false"]');
 const motionNodes=scene ? [...scene.querySelectorAll('.slide-motion,.large-object,[data-hero],[data-enter],.enter-brand,.plug-left,.plug-right')] : [];
 const invisibleImages=scene ? [...scene.querySelectorAll('img')].filter(el=>{let opacity=1;for(let n=el;n&&n!==scene;n=n.parentElement)opacity*=Number(w.getComputedStyle(n).opacity);return !el.complete||!el.naturalWidth||opacity<.01;}).map(el=>el.getAttribute('src')) : [];
 return {invisibleImages,slide:d.body.dataset.activeSlide,flag:w.__hfCameraTransitionsEnabled,time:w.__timelines?.root?.time(),motion:motionNodes.map(el=>({transform:w.getComputedStyle(el).transform,opacity:w.getComputedStyle(el).opacity})),visible:[...d.querySelectorAll('.scene-frame[data-composition-id]')].filter(el=>w.getComputedStyle(el).visibility==='visible').map(el=>el.dataset.compositionId)};
});}
await page.goto(deckURL);await page.waitForTimeout(1100);
const nav=[];let motionProof=null;
for(let i=0;i<ids.length;i++){
 if(i){await page.keyboard.press('ArrowRight');if(i===1){await page.waitForTimeout(80);motionProof={during:await state(page)};}await page.waitForTimeout(1000);}
 const current=await state(page);assert.equal(current.slide,ids[i]);assert.deepEqual(current.visible,[ids[i]]);assert.deepEqual(current.invisibleImages,[],`Invisible or unloaded image on ${ids[i]}`);nav.push(current.slide);
 if(i===1)motionProof.after=current;
}
if(ids.length>1){
 assert.ok(motionProof.during.motion.length>0,'No motion targets were found on the second scene.');
 assert.notDeepEqual(motionProof.during.motion,motionProof.after.motion);
}
const settled=await state(page);await page.waitForTimeout(1200);assert.deepEqual(await state(page),settled);
const previousIndex=Math.max(0,ids.length-2);
await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1000);assert.equal((await state(page)).slide,ids[previousIndex]);
const rapidIndex=Math.max(0,previousIndex-2);
await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1000);assert.equal((await state(page)).slide,ids[rapidIndex]);
const popup=context.waitForEvent('page');await page.keyboard.press('p');const audience=await popup;await audience.waitForLoadState();await page.waitForTimeout(900);
assert.equal((await state(audience)).slide,ids[rapidIndex]);await page.keyboard.press('ArrowRight');await page.waitForTimeout(1000);
const synchronizedId=ids[Math.min(ids.length-1,rapidIndex+1)];
assert.equal((await state(audience)).slide,synchronizedId);assert.equal((await state(page)).slide,synchronizedId);
const presenterText=await page.locator('body').innerText();assert.ok(presenterText.includes('UP NEXT') || presenterText.includes('SLIDE'));
const noteEditors=await page.locator('textarea,[contenteditable="true"]').count();assert.ok(noteEditors>0);
const reducedContext=await browser.newContext({reducedMotion:'reduce'});const reduced=await reducedContext.newPage();await reduced.goto(deckURL);await reduced.waitForTimeout(900);await reduced.keyboard.press('ArrowRight');await reduced.waitForTimeout(40);const reducedState=await state(reduced);await reduced.waitForTimeout(850);assert.deepEqual(await state(reduced),reducedState);assert.equal(reducedState.slide,ids[Math.min(1,ids.length-1)]);
console.log(JSON.stringify({ok:errors.length===0&&failed.length===0&&offOrigin.length===0,nav,motionProof,motionChecked:ids.length>1,idleStable:true,rapidNavigation:true,presenterAndAudience:synchronizedId,presenterNotesEditors:noteEditors,reducedMotionStable:true,errors,failed,offOrigin},null,2));
if(errors.length||failed.length||offOrigin.length)process.exitCode=1;
} finally { await browser.close(); }
