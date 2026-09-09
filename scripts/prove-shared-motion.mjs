import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const manifest=JSON.parse(await readFile(new URL('../manifest.json',import.meta.url),'utf8'));
const transitions=[['makers','models'],['gui','compare'],['compare','local_files'],['local_files','handoff'],['handoff','control'],['control','personal'],['personal','custom_result'],['job_review','job_submit'],['job_submit','rules'],['rules','rules_run'],['centralize','agent_workflow'],['agent_customers','interfaces']];
const shots=new Set(['makers-models','handoff-control','centralize-agent_workflow']);
const browser=await chromium.launch({channel:'chrome',headless:true});
const proof=[];const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.DECK_URL || 'http://127.0.0.1:8767/');await page.waitForTimeout(900);
 let currentIndex=0;
 async function seek(id,animate){
  const next=manifest.slides.findIndex(s=>s.sceneId===id);assert.ok(next>=0,id);
  await page.evaluate(animate=>{document.querySelector('hyperframes-player').iframeElement.contentWindow.__hfCameraTransitionsEnabled=animate;},animate);
  while(currentIndex!==next){const forward=next>currentIndex;await page.keyboard.press(forward?'ArrowRight':'ArrowLeft');currentIndex+=forward?1:-1;}
 }

 async function state(){return page.evaluate(()=>{
  const f=document.querySelector('hyperframes-player').iframeElement,w=f.contentWindow,d=f.contentDocument;
  const scene=d.querySelector('.scene-frame[aria-hidden="false"]');
  const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
  const nodes=[...scene.querySelectorAll('[data-motion-key],.large-object,.story-art,.brain-copy,.object,[data-hero],.done-files,.brand>img')];
  const actors=nodes.filter(el=>!nodes.some(p=>p!==el&&p.contains(el))).map(el=>({key:el.dataset.motionKey||null,class:el.className,src:(el.matches('img')?el:el.querySelector('img'))?.getAttribute('src'),rect:rect(el)}));
  const hidden=[...scene.querySelectorAll('img')].filter(el=>{let opacity=1;for(let p=el;p&&p!==scene;p=p.parentElement){const s=w.getComputedStyle(p);opacity*=Number(s.opacity);if(s.visibility==='hidden')return true;}return opacity<.95||!el.complete||!el.naturalWidth;}).map(el=>el.getAttribute('src'));
  const layer=d.querySelector('.hf-motion-overlay');
  return{id:scene.dataset.compositionId,actors,hidden,layer:layer?{mode:layer.dataset.motionTransition,count:layer.dataset.sharedCount,clones:[...layer.children].map(el=>({src:el.querySelector('img')?.getAttribute('src'),class:el.firstElementChild.className,rect:rect(el)}))}:null};
 });}
 for(const [from,to] of transitions){
  await seek(from,false);await page.waitForTimeout(30);const before=await state();
  await seek(to,true);const begin=Date.now();await page.waitForTimeout(430);const during=await state();
  assert.equal(during.layer?.mode,'shared',`${from} → ${to} did not share an image`);
  const name=from+'-'+to;if(shots.has(name))await page.screenshot({path:`snapshots/motion-${name}-mid.png`});
  await page.waitForTimeout(Math.max(0,1080-(Date.now()-begin)));const after=await state();
  assert.equal(after.id,to);assert.equal(after.layer,null,`${name} overlay remained`);assert.deepEqual(after.hidden,[],`${name} has hidden images`);
  proof.push({from,to,before,during,after,screenshot:shots.has(name)?`motion-${name}-mid.png`:null});
 }
 const settledSlides=[];
 await seek(manifest.slides[0].sceneId,false);
 for(const slide of manifest.slides){await seek(slide.sceneId,true);await page.waitForTimeout(1050);const final=await state();assert.equal(final.id,slide.sceneId);assert.equal(final.layer,null);assert.deepEqual(final.hidden,[]);settledSlides.push(final.id);}
 assert.deepEqual(errors,[]);
 await writeFile('snapshots/shared-motion-proof.json',JSON.stringify({ok:true,settleBudgetMs:1080,settledSlides,transitions:proof,errors},null,2)+'\n');
 console.log(JSON.stringify({ok:true,pairs:proof.map(p=>[p.from,p.to,p.during.layer.count]),captures:shots.size,settledSlides:settledSlides.length,errors}));
}finally{await browser.close();}
