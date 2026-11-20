/* =================================================================
   🏆 釣魚標本陳列室（二樓新翼）＋ 野生魚只能釣
   ================================================================= */
/* ---- 野生原生魚：商店買不到，只能自己釣 ---- */
const WILD=new Set(['opsari','kuhua','goby','hemi','sakura','trout','smelt','mudskipper','archer','mullet','hairtail']);
const _shW=shopSheet;shopSheet=function(tab){_shW(tab);const c=$('#shC');if(!c)return;c.querySelectorAll('[data-b]').forEach(b=>{if(WILD.has(b.dataset.b)){const s=document.createElement('span');s.className='mut sm';s.textContent='🎣 只能釣';b.replaceWith(s);}});
 if(!c.querySelector('#wildNote')&&(tab||'ani')==='ani'){const d=document.createElement('div');d.id='wildNote';d.className='mut sm';d.style.margin='4px 0 8px';d.textContent='🎣 台灣原生的野生魚（苦花、馬口鱲、櫻花鉤吻鮭…）和白帶魚、烏魚這些海魚，商店不賣，要自己去釣。';c.insertBefore(d,c.children[1]||null);}};
/* ---- 做標本 ---- */
const TXF=300;
const _lfS=landFish;landFish=function(){_lfS();const c=FS&&FS.catch;if(!c||BOSS[c.k])return;const b=$('#fB');if(!b)return;const x=document.createElement('button');x.className='btn';x.textContent=`🏆 標本 ${fmt$(TXF)}`;x.style.flex='1';
 x.onclick=()=>{if(!pay(TXF,'標本製作'))return;S.trophy=S.trophy||[];S.trophy.push({k:c.k,cm:c.cm,t:Date.now(),m:c.g&&c.g.m||'n',w:FS.w});markDirty();trVis();toast(`🏆 ${c.nm}（${c.cm} cm）做成標本，送到二樓新翼的「標本陳列室」`,3600);openCast();};b.appendChild(x);};
const TRV={};
function trName(t){return BOSS[t.k]?'👑 '+BOSS[t.k].n:(t.m&&t.m!=='n'&&MORPH[t.m]?MORPH[t.m].pre+' ':'')+((SP[t.k]&&SP[t.k].n)||t.k);}
const trSort=a=>a.map((t,i)=>({t,i})).sort((p,q)=>((q.t.pin?1e6:0)+(BOSS[q.t.k]?1e5:0)+q.t.cm)-((p.t.pin?1e6:0)+(BOSS[p.t.k]?1e5:0)+p.t.cm));
function trSheet(){const T=S.trophy||[];const L=trSort(T);sheet('🏆 標本陳列室',`<div class="mut sm" style="margin-bottom:6px">釣到的魚可以花 ${fmt$(TXF)} 做成標本（Boss 免費），會放進這裡的展示櫃，最多同時展出 12 件：📌 釘選的優先，接著是 Boss，再來是最大的。</div>`+
 (L.length?L.map(({t,i},n)=>`<div class="row2"><span>${n<12?'🔆':'📦'} <b>${trName(t)}</b> <span class="mut sm">${t.cm} cm・${new Date(t.t).toLocaleDateString()}</span></span><span><button class="btn sm" data-p="${i}">${t.pin?'📌 取消':'📌 釘選'}</button><button class="btn sm" data-s="${i}">賣 ${fmt$(trVal(t))}</button></span></div>`).join(''):'<div class="mut">還沒有標本。去釣魚，釣到大魚後按「🏆 標本」。</div>'),
 c=>{c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const t=T[+b.dataset.p];t.pin=!t.pin;markDirty();trVis();trSheet();});
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const t=T[+b.dataset.s];if(!confirm(`把「${trName(t)}」標本賣給收藏家，拿到 ${fmt$(trVal(t))}？`))return;T.splice(+b.dataset.s,1);earn(trVal(t));markDirty();trVis();trSheet();});});}
const trVal=t=>BOSS[t.k]?Math.round(BOSS[t.k].val*.5):Math.round((PRICE[t.k]||150)*1.2+t.cm*4);
/* ---- 3D：新翼主廳東半邊兩排展示櫃 ---- */
wingLvl(function(){const g=WV.g,X=WG.x,Z=WG.z;const ped=new THREE.MeshStandardMaterial({color:C(0x2b3440),roughness:.5,metalness:.3}),gl=new THREE.MeshStandardMaterial({color:C(0xd8f0ff),transparent:true,opacity:.18,roughness:.05,depthWrite:false}),wd=new THREE.MeshStandardMaterial({color:C(0x6a4a2e),roughness:.6});
 const sg=add(new THREE.PlaneGeometry(3,.66),new THREE.MeshBasicMaterial({map:vText([['🏆 釣魚標本陳列室',56,.42],['FISHING TROPHIES',28,.8,'#ffd27a']],720,160,'#16222e','#ffffff')}),6,3.4,-9.85,g);
 TRV.c=[];const pos=[];for(const x of[3.6,7.6])for(const z of[-7.2,-4.4,-1.6,1.6,4.4,7.2])pos.push([x,z]);
 pos.forEach(([x,z],i)=>{const cs=new THREE.Group();cs.position.set(x,0,z);g.add(cs);box(1.6,.9,.9,ped,0,.45,0,cs);box(1.5,.06,.8,wd,0,.93,0,cs);box(1.56,.75,.86,gl,0,1.33,0,cs);box(1.6,.04,.9,ped,0,1.72,0,cs);
  const fm=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.15,side:THREE.DoubleSide}));fm.position.set(0,1.28,0);cs.add(fm);
  const cv=document.createElement('canvas');cv.width=320;cv.height=96;const tx=new THREE.CanvasTexture(cv);const pl=add(new THREE.PlaneGeometry(.9,.27),new THREE.MeshBasicMaterial({map:tx}),0,.6,.455,cs);
  const pl2=add(new THREE.PlaneGeometry(.9,.27),new THREE.MeshBasicMaterial({map:tx}),0,.6,-.455,cs);pl2.rotation.y=Math.PI;cs.visible=false;TRV.c.push({cs,fm,cv,tx});
  OBST.push([X+x-.9,X+x+.9,Z+z-.55,Z+z+.55]);STATIONS.push({p:V(X+x,1.2,Z+z),fn:()=>trSheet()});});
 STATIONS.push({p:V(X+6,2.4,Z-9.6),fn:()=>trSheet()});});
function trVis(){if(!TRV.c)return;const L=trSort(S.trophy||[]).slice(0,12);TRV.c.forEach((o,i)=>{const it=L[i];o.cs.visible=!!it;if(!it)return;const t=it.t;
 const d=dispGeo(t.k);o.fm.geometry=d.g;const want=clamp(t.cm/100,.35,1.35);o.fm.scale.setScalar(want/d.len);o.fm.rotation.set(0,0,0);
 const bt=BOSS[t.k];o.fm.material.color.set(0xffffff);if(bt&&bt.tint)o.fm.material.color.setRGB(...bt.tint.map(v=>Math.min(1,v*.8)));else if(bt&&bt.col)o.fm.material.color.set(bt.col);
 const x=o.cv.getContext('2d');x.fillStyle='#f3e6c8';x.fillRect(0,0,320,96);x.strokeStyle='#8a6a3a';x.lineWidth=4;x.strokeRect(2,2,316,92);x.fillStyle='#2a1a0a';x.textAlign='center';x.font='700 30px "PingFang TC",sans-serif';x.fillText(trName(t).slice(0,10),160,42);
 x.font='600 22px sans-serif';x.fillText(`${t.cm} cm・${new Date(t.t).toLocaleDateString()}`,160,78);o.tx.needsUpdate=true;});}
globalAnims.push((t,dt)=>{if(!TRV.c||!inWing())return;TRV.c.forEach((o,i)=>{if(o.cs.visible)o.fm.rotation.y=Math.sin(t*.3+i)*.25;});});
setTimeout(()=>{if(loaded)trVis();},3600);

