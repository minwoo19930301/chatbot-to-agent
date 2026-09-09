(function () {
  'use strict';
  const scenes = [...document.querySelectorAll('.scene-frame')];
  if (!scenes.length) return;
  const ranges = scenes.map(s => ({start:Number(s.dataset.start),end:Number(s.dataset.start)+Number(s.dataset.duration)}));
  const duration = ranges[ranges.length-1].end;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = window.__timelines.root;
  root.to({}, {duration, ease:'none'});
  let activeIndex = -1;
  let transition = null;
  const visualSelector = '[data-motion-key],.large-object,.story-art,.brain-copy,.object,[data-hero],.done-files,.brand>img';

  // One owned GSAP context: revert restores authored inline transforms (including
  // logo sizing). Never clear every scene's transform or tween a visual twice.
  function cancelTransition() {
    if (!transition) return;
    const old = transition;
    transition = null;
    old.context.revert();
    old.layer.remove();
  }
  function topLevel(nodes) {
    return nodes.filter(el => !nodes.some(other => other !== el && other.contains(el)));
  }
  function visuals(scene) {
    return topLevel([...scene.querySelectorAll(visualSelector)]).filter(el => el.matches('img') || el.querySelector('img'));
  }
  function identity(el) {
    const explicit = el.dataset.motionKey;
    if (explicit) return 'key:' + explicit;
    const img = el.matches('img') ? el : el.querySelector('img');
    if (!img) return null;
    const crop = el.matches('.object') ? el : el.querySelector('.object');
    const tile = crop ? [...crop.classList].find(c => /^object-\d+$/.test(c)) || 'object-0' : '';
    return (img.currentSrc || img.src) + '|' + tile;
  }
  function pose(el) {
    const r = el.getBoundingClientRect();
    let x = r.left, y = r.top, width = r.width, height = r.height;
    // Use the painted image, not the object-fit letterbox, as the handoff pose.
    if (el.matches('img') && el.naturalWidth && getComputedStyle(el).objectFit === 'contain') {
      const ratio = Math.min(width/el.naturalWidth, height/el.naturalHeight);
      const w = el.naturalWidth*ratio, h = el.naturalHeight*ratio;
      x += (width-w)/2; y += (height-h)/2; width=w; height=h;
    }
    return {x,y,width,height};
  }
  function stripMetadata(clone) {
    for (const el of [clone,...clone.querySelectorAll('*')]) {
      el.removeAttribute('id');
      for (const attr of [...el.attributes]) if (attr.name.startsWith('data-')) el.removeAttribute(attr.name);
    }
    clone.setAttribute('aria-hidden','true');
    return clone;
  }
  function cloneVisual(el, box, layer) {
    const holder = document.createElement('div');
    Object.assign(holder.style,{position:'absolute',left:'0',top:'0',width:box.width+'px',height:box.height+'px',transform:`translate(${box.x}px, ${box.y}px)`,transformOrigin:'0 0',pointerEvents:'none'});
    const clone = stripMetadata(el.cloneNode(true));
    Object.assign(clone.style,{position:'absolute',left:'0',top:'0',right:'auto',bottom:'auto',margin:'0',width:'100%',height:'100%',maxWidth:'none',transform:'none',visibility:'visible',opacity:'1'});
    if (clone.matches('img')) {
      const style=getComputedStyle(el);
      // Only contain has had its letterbox removed by pose(). Other fits
      // still use the authored box: preserve its crop and focal position.
      clone.style.objectFit=style.objectFit==='contain'&&el.naturalWidth?'fill':style.objectFit;
      clone.style.objectPosition=style.objectPosition;
    }
    holder.append(clone);layer.append(holder);
    return holder;
  }
  function makeLayer() {
    const layer = document.createElement('div');
    layer.className='hf-motion-overlay';
    layer.setAttribute('aria-hidden','true');
    Object.assign(layer.style,{position:'fixed',inset:'0',overflow:'hidden',pointerEvents:'none',zIndex:'9999',contain:'layout paint'});
    document.body.append(layer);
    return layer;
  }
  function animate(from, to, direction) {
    const before = visuals(from), after = visuals(to);
    const used = new Set(), pairs = [];
    for (const target of after) {
      const key = identity(target);
      const end=pose(target);
      const distance=el=>{const b=pose(el);return Math.hypot(b.x+b.width/2-end.x-end.width/2,b.y+b.height/2-end.y-end.height/2);};
      const source = before.filter(el => !used.has(el) && key && identity(el) === key).sort((a,b)=>distance(a)-distance(b))[0];
      if (!source) continue;
      const start=pose(source);
      if (!start.width || !end.width) continue;
      used.add(source);pairs.push({source,target,start,end});
    }
    const layer = makeLayer();
    const state = {layer,context:null};
    transition=state;
    const mode = to.dataset.motion || to.querySelector('[data-motion]')?.dataset.motion || 'handoff';
    state.context=gsap.context(() => {
      const tl=gsap.timeline({onComplete:()=>{if(transition===state)cancelTransition();}});
      if (pairs.length) {
        layer.dataset.motionTransition='shared';
        layer.dataset.sharedCount=String(pairs.length);
        for (const {source,target,start,end} of pairs) {
          const clone=cloneVisual(source,start,layer);
          gsap.set(target,{visibility:'hidden'});
          tl.to(clone,{x:end.x,y:end.y,width:end.width,height:end.height,duration:.9,ease:'power3.inOut'},0);
        }
        // Unmatched imagery moves independently; exclude every ancestor/child
        // of shared nodes so nested transforms cannot fight the handoff.
        const free=after.filter(el=>!pairs.some(p=>el===p.target||el.contains(p.target)||p.target.contains(el)));
        free.forEach((el,i)=>tl.from(el,{x:direction*(mode==='compare'?390:620),scale:mode==='accumulate'?.72:.86,duration:.72,ease:'power3.out'},mode==='accumulate'?Math.min(i*.1,.2):.12));
        const text=topLevel([...to.querySelectorAll('[data-enter],.enter-brand')]).filter(el=>!after.some(v=>el===v||el.contains(v)||v.contains(el)));
        if(text.length)tl.from(text,{x:direction*130,duration:.52,ease:'power3.out',stagger:{amount:.16}},.15);
      } else {
        layer.dataset.motionTransition='camera';
        // A page-wide camera travel preserves the complete previous picture.
        // Only the new inner and old snapshot move; no child transform tween.
        const inner=to.querySelector('.slide-motion') || to;
        const oldInner=from.querySelector('.slide-motion') || from;
        const box=pose(oldInner);
        const snapshot=cloneVisual(oldInner,box,layer);
        const travel=Math.max(box.width,window.innerWidth);
        tl.to(snapshot,{x:box.x-direction*travel,duration:.78,ease:'power3.inOut'},0);
        tl.from(inner,{x:direction*travel,duration:.78,ease:'power3.inOut'},0);
      }
      // Semantic marks finish after the main movement without another transform.
      const marks=to.querySelectorAll('.blocked-mark path');
      if(marks.length)tl.fromTo(marks,{strokeDashoffset:100},{strokeDashoffset:0,duration:.24,ease:'power2.out'},.64);
    });
  }
  function update(t) {
    let next=ranges.findIndex(r=>t>=r.start&&t<r.end);
    if(next<0)next=t>=duration?scenes.length-1:0;
    if(next===activeIndex)return;
    cancelTransition();
    const previous=activeIndex;
    const shouldAnimate=previous!==-1&&window.__hfCameraTransitionsEnabled&&!reduced.matches;
    scenes.forEach((scene,i)=>{
      scene.style.opacity=i===next?'1':'0';
      scene.style.visibility=i===next?'visible':'hidden';
      scene.style.pointerEvents=i===next?'auto':'none';
      scene.setAttribute('aria-hidden',i===next?'false':'true');
    });
    activeIndex=next;
    document.body.dataset.activeSlide=scenes[next].dataset.compositionId;
    if(shouldAnimate)animate(scenes[previous],scenes[next],Math.sign(next-previous));
  }
  window.__hfSetTime=update;
  root.eventCallback('onUpdate',()=>update(root.time()));
  window.addEventListener('resize',cancelTransition);
  reduced.addEventListener('change',cancelTransition);
  window.addEventListener('pagehide',cancelTransition);
  update(0);
  function bootstrap() {
    parent.postMessage({source:'hf-preview',type:'timeline',durationInFrames:duration*30,scenes:scenes.map((s,i)=>({id:s.dataset.compositionId,start:ranges[i].start,duration:ranges[i].end-ranges[i].start}))},'*');
  }
  if(document.readyState==='complete')bootstrap();
  else window.addEventListener('load',bootstrap,{once:true});
})();
