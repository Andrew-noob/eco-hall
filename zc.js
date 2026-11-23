/* =================================================================
   ⚡ zc.js：靜態模型合併（大幅減少繪製次數）、遠處物件不算矩陣、效能資訊
   作法：牆、地板、柱子、長椅這類「不會動」的東西，同材質、同一區的
   合併成一個模型一次畫完。原本的物件還在（只是不畫），
   只要有東西被移動、隱藏、移除或換材質，就自動把它拆出來恢復原狀。
   ================================================================= */
const BAT={on:(()=>{try{return localStorage.getItem('eh-sb')!=='0';}catch(e){return true;}})(),
 B:new Map(),mem:new Map(),ej:new WeakSet(),pend:null,q:[],calls0:0};
const SB_CELL=14,SB_MAXV=60000,SB_NOOP=function(){};

/* 已知會動的東西，整串不合併 */
function sbDyn(){const s=new Set([camera]);const add=o=>{if(o&&o.isObject3D)s.add(o);};
 try{for(const id in TANKS)add(TANKS[id].group);}catch(e){}
 try{for(const k in LIVE.av)add(LIVE.av[k].g);}catch(e){}
 try{for(const k in SV)for(const o of SV[k])add(o.g);}catch(e){}
 try{PV.fish.forEach(f=>add(f.m));add(PV.pond&&PV.pond.g);}catch(e){}
 try{add(TV.a);add(TV.r);}catch(e){}
 try{add(HF);}catch(e){}
 try{add(foamG);}catch(e){}
 try{add(rod);}catch(e){}
 try{add(RIV.boat);}catch(e){}
 try{for(const k in FW)add(FW[k]&&FW[k].boat);}catch(e){}
 try{for(const d of DOORS){d.panels.forEach(p=>add(p[0]));add(d.sensor);}}catch(e){}
 try{(WV.eph||[]).forEach(add);(WV.boxes||[]).forEach(o=>{add(o.ani);add(o.ani2);});add(WV.synL);}catch(e){}
 try{(LV.br||[]).forEach(o=>(o.bub||[]).forEach(add));}catch(e){}
 try{(UV.fog||[]).forEach(add);}catch(e){}
 try{(TRV.c||[]).forEach(o=>add(o.fm));}catch(e){}
 return s;}

function sbOk(o){const g=o.geometry,m=o.material;
 if(o.constructor!==THREE.Mesh||o.children.length||!g||!g.isBufferGeometry||!m||Array.isArray(m))return false;
 if(!m.visible||m.transparent||m.isShaderMaterial||m.wireframe||(m.opacity!=null&&m.opacity<1))return false;
 if(m.defines&&('SWIM' in m.defines||'FLAP' in m.defines||'SWAY' in m.defines))return false;
 if(o.renderOrder||!o.frustumCulled||o.layers.mask!==1||o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender)return false;
 if(Object.keys(g.morphAttributes||{}).length||g.drawRange.start!==0||g.drawRange.count!==Infinity)return false;
 const A=g.attributes;if(!A.position||!A.normal||A.position.itemSize!==3||A.normal.itemSize!==3)return false;
 for(const k in A){const a=A[k];if(a.isInterleavedBufferAttribute||a.normalized||!(a.array instanceof Float32Array)||a.count!==A.position.count)return false;}
 if(A.tangent&&A.tangent.itemSize!==4)return false;
 const n=A.position.count;if(!n||n>30000)return false;const ic=g.index?g.index.count:n;if(ic%3)return false;
 if(!g.boundingSphere)g.computeBoundingSphere();const r=o.matrixWorld.getMaxScaleOnAxis()*g.boundingSphere.radius;if(!(r<7))return false;
 if(Math.abs(o.matrixWorld.determinant())<1e-9)return false;
 return true;}

function sbSnap(o){return{m:o.material,g:o.geometry,v:o.geometry.attributes.position.version,iv:o.geometry.index?o.geometry.index.version:0,e:Float32Array.from(o.matrixWorld.elements)};}
function sbAttached(o){let p=o.parent;while(p&&p!==scene){if(!p.visible&&!p.userData._cull)return false;p=p.parent;}return p===scene;}
function sbSame(o,s){if(o.material!==s.m||o.geometry!==s.g||!o.visible||o.layers.mask===0)return false;const g=o.geometry;
 if(g.attributes.position.version!==s.v||(g.index?g.index.version:0)!==s.iv)return false;
 const e=o.matrixWorld.elements;for(let i=0;i<16;i++)if(Math.abs(e[i]-s.e[i])>1e-5)return false;return sbAttached(o);}

/* 找候選：可見、靜止、可合併的網格 */
function sbCollect(){const dyn=sbDyn(),out=[];
 const walk=o=>{if(dyn.has(o)||o.isLight||(o.userData&&o.userData.dyn)||(o.userData&&o.userData.sb))return;if(o!==scene&&!o.visible&&!o.userData._cull)return;
  for(const c of o.children)walk(c);if(o.isMesh&&!BAT.mem.has(o)&&!BAT.ej.has(o)&&sbOk(o))out.push(o);};
 walk(scene);return out;}

/* 材質去重：外觀完全相同的材質視為同一種（合併用的是一份複製品，遊戲改不到它） */
const SB_SK=new Set(['uuid','name','id','version','userData','onBeforeCompile','customProgramCacheKey','defines','type']);
function sbSig(m){const own=m.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile;const P=!!(m.userData&&m.userData.U);if(own&&!P)return 'U:'+m.uuid;
 let ck='';if(P){ck=m.customProgramCacheKey?String(m.customProgramCacheKey()):'';if(ck)return 'U:'+m.uuid;}
 let s=m.type+';'+(P?'P;':'')+JSON.stringify(m.defines||{})+';';
 for(const k of Object.keys(m).sort()){if(SB_SK.has(k)||k[0]==='_')continue;const v=m[k],t=typeof v;
  if(v==null||t==='boolean'||t==='string')s+=k+'='+v+';';else if(t==='number')s+=k+'='+Math.round(v*1e4)+';';
  else if(v.isColor)s+=k+'='+Math.round(v.r*1e4)+','+Math.round(v.g*1e4)+','+Math.round(v.b*1e4)+';';
  else if(v.isVector2)s+=k+'='+v.x+','+v.y+';';else if(v.isTexture)s+=k+'='+v.uuid+';';
  else if(t==='function')continue;else return 'U:'+m.uuid;}
 return s;}
/* 快速檢查：遊戲常改的屬性（顏色、發光、透明度、貼圖、顯示） */
function sbFast(m){const c=m.color,e=m.emissive;return (c?c.r+','+c.g+','+c.b:'')+'|'+(e?e.r+','+e.g+','+e.b:'')+'|'+m.emissiveIntensity+'|'+m.opacity+'|'+m.visible+'|'+m.transparent+'|'+(m.map&&m.map.uuid)+'|'+m.side+'|'+m.wireframe;}
BAT.canon=new Map();
function sbCanon(m){const sg=sbSig(m);if(sg.startsWith('U:'))return{sg,cm:m};let c=BAT.canon.get(sg);
 if(!c){c=m.clone();if(m.userData&&m.userData.U){c.onBeforeCompile=m.onBeforeCompile;c.customProgramCacheKey=m.customProgramCacheKey;}BAT.canon.set(sg,c);}return{sg,cm:c};}
function sbKey(o,sg){const g=o.geometry,c=g.boundingSphere.center.clone().applyMatrix4(o.matrixWorld);
 const sig=Object.keys(g.attributes).sort().join(',');return sg+'|'+sig+'|'+Math.floor(c.x/SB_CELL)+','+Math.floor(c.z/SB_CELL)+','+(c.y>4?1:0);}

/* 把一批網格烘焙成一個 */
function sbGeo(ms){const g0=ms[0].geometry,names=Object.keys(g0.attributes);let nv=0,ni=0;
 for(const o of ms){const g=o.geometry;nv+=g.attributes.position.count;ni+=g.index?g.index.count:g.attributes.position.count;}
 const out={};for(const k of names)out[k]=new Float32Array(nv*g0.attributes[k].itemSize);
 const I=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;const nm=new THREE.Matrix3(),v=new THREE.Vector3();
 for(const o of ms){const g=o.geometry,mw=o.matrixWorld,n=g.attributes.position.count,flip=mw.determinant()<0;nm.getNormalMatrix(mw);
  for(const k of names){const a=g.attributes[k],sz=a.itemSize,src=a.array,dst=out[k];
   if(k==='position'){for(let i=0;i<n;i++){v.fromArray(src,i*3).applyMatrix4(mw).toArray(dst,(vo+i)*3);}}
   else if(k==='normal'){for(let i=0;i<n;i++){v.fromArray(src,i*3).applyMatrix3(nm).normalize().toArray(dst,(vo+i)*3);}}
   else if(k==='tangent'){for(let i=0;i<n;i++){v.set(src[i*4],src[i*4+1],src[i*4+2]).transformDirection(mw);const j=(vo+i)*4;dst[j]=v.x;dst[j+1]=v.y;dst[j+2]=v.z;dst[j+3]=src[i*4+3]*(flip?-1:1);}}
   else dst.set(src.subarray(0,n*sz),vo*sz);}
  const ix=g.index,cnt=ix?ix.count:n,ia=ix?ix.array:null;
  for(let i=0;i<cnt;i+=3){const a=ia?ia[i]:i,b=ia?ia[i+1]:i+1,c=ia?ia[i+2]:i+2;I[io++]=a+vo;if(flip){I[io++]=c+vo;I[io++]=b+vo;}else{I[io++]=b+vo;I[io++]=c+vo;}}
  vo+=n;}
 const G=new THREE.BufferGeometry();for(const k of names)G.setAttribute(k,new THREE.BufferAttribute(out[k],g0.attributes[k].itemSize));
 G.setIndex(new THREE.BufferAttribute(I,1));G.computeBoundingSphere();G.computeBoundingBox();return G;}

function sbCullEntry(b){if(!b.mesh)return;const s=b.mesh.geometry.boundingSphere;b.ce={off:s.center.clone(),r:s.radius};}
/* BAT.mem：網格 → {s:快照, b:所屬批次} */
function sbBuild(b){if(b.mesh){scene.remove(b.mesh);b.mesh.geometry.dispose();b.mesh=null;}
 b.members=b.members.filter(o=>{const r=BAT.mem.get(o);return r&&r.b===b;});b.nv=b.members.reduce((a,o)=>a+o.geometry.attributes.position.count,0);
 if(b.members.length<2){for(const o of b.members){BAT.mem.delete(o);o.layers.set(0);}b.members=[];BAT.B.delete(b.key);return;}
 let G;try{G=sbGeo(b.members);}catch(e){errLog(e,'batch');for(const o of b.members){BAT.mem.delete(o);BAT.ej.add(o);o.layers.set(0);}b.members=[];BAT.B.delete(b.key);return;}
 const M=new THREE.Mesh(G,b.mat);M.matrixAutoUpdate=false;M.userData.sb=1;scene.add(M);b.mesh=M;
 for(const o of b.members)o.layers.set(1);sbCullEntry(b);}
/* 有東西被動到（移動、隱藏、移除、換材質）：拆出來恢復原狀，所屬那批重新合併 */
let sbPN=0;function sbOkNow(o,r,fc){if(!sbSame(o,r.s))return false;if(fc){const m=o.material;let f=fc.get(m);if(f===undefined){f=sbFast(m);fc.set(m,f);}if(f!==r.s.f)return false;}return true;}
function sbPoll(){if(!BAT.mem.size)return;const fc=(++sbPN%3===0)?new Map():null;const re=new Set();for(const [o,r] of BAT.mem){if(!sbOkNow(o,r,fc))re.add(r.b);}
 for(const b of re){for(const o of b.members){const r=BAT.mem.get(o);if(r&&!sbOkNow(o,r,fc)){BAT.mem.delete(o);BAT.ej.add(o);o.layers.set(0);}}sbBuild(b);}}
/* 掃描 → 3 秒後確認沒動過 → 排隊合併 */
function sbScan(){if(!BAT.on||BAT.pend||typeof loaded==='undefined'||!loaded)return;const c=sbCollect();if(!c.length)return;const m=new Map();for(const o of c)m.set(o,sbSnap(o));BAT.pend=m;
 setTimeout(()=>{const P=BAT.pend;BAT.pend=null;if(!BAT.on||!P)return;const grp=new Map();
  for(const [o,s] of P){if(BAT.mem.has(o)||!sbSame(o,s)||!sbOk(o))continue;let C0;try{C0=sbCanon(o.material);}catch(e){continue;}s.f=sbFast(o.material);let k=sbKey(o,C0.sg);
   const nv=o.geometry.attributes.position.count;let b=BAT.B.get(k),j=0;while(b&&b.nv+nv>SB_MAXV){j++;b=BAT.B.get(k+'#'+j);}if(j)k=k+'#'+j;
   if(!b){b={key:k,mat:C0.cm,members:[],mesh:null,nv:0};BAT.B.set(k,b);}b.members.push(o);b.nv+=nv;BAT.mem.set(o,{s,b});grp.set(k,b);}
  for(const b of grp.values())if(!BAT.q.includes(b))BAT.q.push(b);},3000);}
/* 每格最多處理一定量，避免一次卡住 */
globalAnims.push(()=>{if(!BAT.q.length)return;let budget=45000;while(BAT.q.length&&budget>0){const b=BAT.q.shift();if(!BAT.B.has(b.key))continue;budget-=b.nv;sbBuild(b);}if(!BAT.q.length)setTimeout(sbFree,1500);});
/* 原本的模型已經不畫了：釋放它們在顯示卡上的記憶體（之後若被拆回來，會自動重新上傳） */
const BAT_FREED=new WeakSet();
function sbFree(){try{const need=new Set();scene.traverse(o=>{if(o.isMesh&&o.geometry&&!BAT.mem.has(o)&&(o.layers.mask&1))need.add(o.geometry);});
 for(const o of BAT.mem.keys()){const g=o.geometry;if(!need.has(g)&&!BAT_FREED.has(g)){BAT_FREED.add(g);g.dispose();}}}catch(e){errLog(e,'sbfree');}}
function sbOff(){BAT.q.length=0;BAT.pend=null;for(const b of BAT.B.values()){if(b.mesh){scene.remove(b.mesh);b.mesh.geometry.dispose();}for(const o of b.members)o.layers.set(0);}BAT.B.clear();BAT.mem.clear();for(const m of BAT.canon.values())m.dispose();BAT.canon.clear();}
setInterval(()=>{try{sbPoll();}catch(e){errLog(e,'sbpoll');}},500);
setTimeout(function first(){if(typeof loaded==='undefined'||!loaded||!PERF.built){setTimeout(first,2000);return;}BAT.calls0=PERF.calls||0;try{sbScan();}catch(e){errLog(e,'sbscan');}},9000);
setInterval(()=>{try{sbScan();}catch(e){errLog(e,'sbscan');}},40000);

/* ---- 遠處物件不畫、也不算位置矩陣（省 CPU）；合併後的模型也一起判斷 ---- */
perfCull=function(){if(!PERF.built)return;const cd=perfQ().cd,cp=camera.position;
 const show=(o,c,r)=>{const far=c.distanceTo(cp)-r>cd;if(far){if(o.visible){o.visible=false;o.userData._cull=1;o.updateMatrixWorld=SB_NOOP;}}else if(o.userData._cull){o.visible=true;o.userData._cull=0;delete o.updateMatrixWorld;o.updateMatrixWorld(true);}};
 const tmp=new THREE.Vector3();for(const x of PERF.cull){if(!x.o.parent)continue;show(x.o,tmp.copy(x.o.position).add(x.off),x.r);}
 for(const b of BAT.B.values())if(b.ce&&b.mesh){const far=b.ce.off.distanceTo(cp)-b.ce.r>cd;b.mesh.visible=!far;}
 if(typeof WV!=='undefined'&&WV.g){const d=Math.hypot(cp.x-(WG.x+8),cp.z-WG.z);const v=d<cd+22;if(WV.g.visible!==v){WV.g.visible=v;WV.g.userData._cull=v?0:1;}}
 for(const id in TANKS){const tk=TANKS[id];if(!tk.group)continue;if(!tk._bs){const b=new THREE.Box3().setFromObject(tk.group);if(b.isEmpty())continue;tk._bs=b.getBoundingSphere(new THREE.Sphere());}show(tk.group,tk._bs.center,tk._bs.radius);}};
/* 重建遠處清單時不要把合併模型算進去（它們另外判斷），也先把被隱藏的恢復，避免漏掉 */
const _pfB=perfBuild;perfBuild=function(){for(const x of PERF.cull){if(x.o.userData._cull){x.o.visible=true;x.o.userData._cull=0;delete x.o.updateMatrixWorld;x.o.updateMatrixWorld(true);}}
 const hid=[];for(const b of BAT.B.values())if(b.mesh){hid.push([b.mesh,b.mesh.visible]);b.mesh.visible=false;}_pfB();for(const [m,v] of hid)m.visible=v;perfCull();};

/* ---- 繪製次數（給畫質面板看） ---- */
globalAnims.push(()=>{const r=renderer.info.render;PERF.calls=r.calls;PERF.tris=r.triangles;});

/* ---- 畫質面板：顯示繪製次數、合併開關、錯誤紀錄 ---- */
const _pfS=perfSheet;perfSheet=function(){_pfS();const c=$('#shC');if(!c)return;const d=document.createElement('div');d.style.marginTop='8px';
 const ago=t=>{const m=Math.round((Date.now()-t)/60000);return m<1?'剛剛':m<60?m+' 分鐘前':Math.round(m/60)+' 小時前';};
 d.innerHTML=`<h4>效能資訊</h4><div class="row2"><span>每畫面繪製次數</span><b>${PERF.calls||0}${BAT.calls0?`（合併前約 ${BAT.calls0}）`:''}</b></div>
 <div class="row2"><span>三角形數</span><b>${Math.round((PERF.tris||0)/1000)}k</b></div>
 <div class="row2"><span>已合併的靜態物件</span><b>${BAT.mem.size} 個 → ${BAT.B.size} 批</b></div>
 <button class="opt" id="sbT"><b>${BAT.on?'✅':'⬜'} 合併靜態模型</b><span class="mut">把不會動的牆、地板、裝飾合併成一起畫，通常可以順很多。畫面有東西怪怪的（例如門關不起來、東西消失）可以先關掉試試，並截圖告訴開發者。</span></button>
 <div class="row2"><span>抗鋸齒</span><b>${renderer.getContextAttributes&&renderer.getContextAttributes().antialias?'開':'關'}</b></div><div class="mut sm">選「🔋 省電」後重新整理，會關掉抗鋸齒，邊緣稍微鋸齒但更順。</div>
 <h4>錯誤紀錄 ${ERRS.length?`<button class="btn sm" id="errClr" style="float:right">清除</button>`:''}</h4>${ERRS.length?ERRS.slice().reverse().map(e=>`<div class="sm" style="padding:5px 0;border-bottom:1px solid var(--line)"><b style="color:var(--warn)">${(e.m||'').replace(/</g,'&lt;')}</b>${e.n>1?` ×${e.n}`:''}<div class="mut">${(e.w||'')} ・ ${(e.st||'').replace(/</g,'&lt;')} ・ ${e.old?'上次遊玩':ago(e.t)}</div></div>`).join(''):'<div class="mut sm">沒有錯誤 👍</div>'}
 <div class="mut sm" style="margin-top:6px">遇到問題時，把這個畫面截圖給開發者，就能很快找到原因。</div>`;c.appendChild(d);
 d.querySelector('#sbT').onclick=()=>{BAT.on=!BAT.on;try{localStorage.setItem('eh-sb',BAT.on?'1':'0');}catch(e){}if(BAT.on){toast('⚡ 已開啟合併，幾秒後生效',1800);sbScan();}else{sbOff();toast('已關閉合併，全部恢復原狀',1800);}perfSheet();};
 const ec=d.querySelector('#errClr');if(ec)ec.onclick=()=>{ERRS.length=0;try{localStorage.removeItem('eh-err');}catch(e){}perfSheet();};};

boot();
{const ld=document.getElementById('ld');if(ld){ld.style.opacity='0';ld.style.pointerEvents='none';setTimeout(()=>ld.remove(),600);}}
