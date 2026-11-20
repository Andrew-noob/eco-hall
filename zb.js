/* =================================================================
   ⚡ 效能：燈光上限、遠處物件不畫、動態解析度、畫質設定
   ================================================================= */
const PQ={auto:{n:'⚙️ 自動',pr:[.75,1.5],K:3,cd:55},low:{n:'🔋 省電',pr:[.65,.9],K:2,cd:36},high:{n:'✨ 高畫質',pr:[1.2,1.75],K:6,cd:90}};
let PERF={q:(()=>{try{return localStorage.getItem('eh-q')||'auto';}catch(e){return 'auto';}})(),pr:1,fps:60,lights:[],cull:[],built:false};
function perfQ(){return PQ[PERF.q]||PQ.auto;}
function perfApply(){const q=perfQ();PERF.pr=Math.min(q.pr[1],devicePixelRatio||1);renderer.setPixelRatio(PERF.pr);}
/* 燈光：只開最近的幾盞（數量固定，不會造成畫面重新編譯而頓一下） */
function perfLights(){if(!PERF.lights.length)return;const K=perfQ().K,cp=camera.getWorldPosition(new THREE.Vector3());const L=PERF.lights.map(l=>({l,d:l.getWorldPosition(new THREE.Vector3()).distanceTo(cp)})).sort((a,b)=>a.d-b.d);L.forEach((o,i)=>{o.l.visible=i<K;});}
/* 遠處的展缸和小物件先不畫，也不算動物動畫 */
function perfBuild(){PERF.lights=[];scene.traverse(o=>{if(o.isPointLight||o.isSpotLight)PERF.lights.push(o);});PERF.cull=[];const b=new THREE.Box3(),sp=new THREE.Sphere();
 for(const o of scene.children){if(o===camera||o.isLight||o.userData.dyn||!o.visible)continue;b.setFromObject(o);if(b.isEmpty())continue;b.getBoundingSphere(sp);if(sp.radius>9)continue;PERF.cull.push({o,off:sp.center.clone().sub(o.position),r:sp.radius});}PERF.built=true;}
function perfCull(){if(!PERF.built)return;const cd=perfQ().cd,cp=camera.position;const show=(o,c,r)=>{const far=c.distanceTo(cp)-r>cd;if(far){if(o.visible){o.visible=false;o.userData._cull=1;}}else if(o.userData._cull){o.visible=true;o.userData._cull=0;}};
 const tmp=new THREE.Vector3();for(const x of PERF.cull){if(!x.o.parent)continue;show(x.o,tmp.copy(x.o.position).add(x.off),x.r);}
 if(typeof WV!=='undefined'&&WV.g){const d=Math.hypot(cp.x-(WG.x+8),cp.z-WG.z);WV.g.visible=d<cd+22;}
 for(const id in TANKS){const tk=TANKS[id];if(!tk.group)continue;if(!tk._bs){const b=new THREE.Box3().setFromObject(tk.group);if(b.isEmpty())continue;tk._bs=b.getBoundingSphere(new THREE.Sphere());}show(tk.group,tk._bs.center,tk._bs.radius);}}
/* 傳送後馬上重新判斷要畫什麼，不用等 */
let pfLast=null;globalAnims.push(()=>{if(!PERF.built)return;const cp=camera.position;if(pfLast&&cp.distanceTo(pfLast)>6){perfCull();perfLights();}pfLast=(pfLast||new THREE.Vector3()).copy(cp);});
/* 動態解析度：太卡就自動降低，順就慢慢調回來 */
let pfT=0,pfN=0,pfA=0;globalAnims.push((t,dt)=>{pfA+=dt;pfN++;pfT+=dt;if(pfT<2)return;const fps=pfN/pfA;PERF.fps=fps;pfT=0;pfN=0;pfA=0;const q=perfQ();
 if(fps<36&&PERF.pr>q.pr[0]){PERF.pr=Math.max(q.pr[0],PERF.pr-.15);renderer.setPixelRatio(PERF.pr);}else if(fps>55&&PERF.pr<Math.min(q.pr[1],devicePixelRatio||1)){PERF.pr=Math.min(q.pr[1],devicePixelRatio||1,PERF.pr+.1);renderer.setPixelRatio(PERF.pr);}});
setInterval(()=>{if(PERF.built)perfLights();},1000);setInterval(()=>{if(PERF.built)perfCull();},400);
setTimeout(()=>{perfApply();perfBuild();perfLights();perfCull();},6500);setInterval(()=>{if(PERF.built){const n=PERF.cull.length;perfBuild();}},60000);
function perfSheet(){sheet('⚡ 畫質與效能',`<div class="mut sm" style="margin-bottom:6px">玩起來卡的話選「省電」。現在大約 <b>${Math.round(PERF.fps)} FPS</b>・解析度 ${PERF.pr.toFixed(2)}×・燈光 ${perfQ().K} 盞・${perfQ().cd} 公尺外的東西不畫。</div>`+
 Object.entries(PQ).map(([k,q])=>`<button class="opt" data-q="${k}"><b>${PERF.q===k?'✅ ':''}${q.n}</b><span class="mut">${k==='auto'?'卡的時候自動降低解析度（推薦）':k==='low'?'最順，畫面比較糊，遠的東西比較早消失':'最漂亮，適合新手機'}</span></button>`).join(''),
 c=>c.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{PERF.q=b.dataset.q;try{localStorage.setItem('eh-q',PERF.q);}catch(e){}perfApply();perfLights();perfCull();toast(`⚡ 畫質：${perfQ().n}`,1600);perfSheet();}));}
const _msP=mapSheet;mapSheet=function(){_msP();const c=$('#shC');if(!c)return;const b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:6px';b.textContent=`⚡ 畫質：${perfQ().n}（${Math.round(PERF.fps)} FPS）`;b.onclick=perfSheet;c.appendChild(b);};
boot();
