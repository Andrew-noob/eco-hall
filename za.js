/* =================================================================
   🏭 飼料合成機・🛒 商店建築・📦 倉庫活魚池與船・靠近顯示管理卡・📘 新手教學・💰 收支表
   ================================================================= */
/* ---- 拿掉舊的二樓孵化器、活餌培養室；飼料不再自動生產 ---- */
try{scene.remove(incG);scene.remove(cg);}catch(e){}
/* 拿掉基因實驗桌旁的「繁殖區」配對台（配對繁殖改到二樓新翼的繁殖場） */
{const bx=-6.7,bz=8;for(const o of [...scene.children]){const p=o.position;if(p&&p.x>bx-1.9&&p.x<bx+1.9&&p.z>bz-1.1&&p.z<bz+1.1&&p.y>5.2&&p.y<8.3)scene.remove(o);}for(let i=OBST2.length-1;i>=0;i--){const o=OBST2[i];if(Math.abs(o[0]-(bx-1.75))<.01&&Math.abs(o[2]-(bz-.9))<.01)OBST2.splice(i,1);}}
for(let i=FAC.length-1;i>=0;i--)if(/繁殖區/.test(FAC[i].n))FAC.splice(i,1);
const _gsP=geneSheet;geneSheet=function(tab){if(tab==='pair'){toast('💞 配對繁殖搬到「二樓新翼・繁殖場」了，那裡有真實的繁殖流程',3200);bfSheet('box');return;}_gsP(tab);const c=$('#shC');if(c)c.querySelectorAll('button,.chip').forEach(b=>{if(/配對|繁殖/.test(b.textContent)&&!/繁殖場/.test(b.textContent))b.remove();});};
for(let i=STATIONS.length-1;i>=0;i--){const p=STATIONS[i].p;if((Math.abs(p.x+5.5)<.01&&Math.abs(p.z-15.3)<.01)||(Math.abs(p.x-11.2)<.01&&Math.abs(p.z-3)<.01))STATIONS.splice(i,1);}
for(let i=FAC.length-1;i>=0;i--)if(/孵化器|活餌培養室/.test(FAC[i].n))FAC.splice(i,1);
tickStock=function(){ensureStock();S.stockT=Date.now();};
setInterval(()=>{if(!loaded||!S.inc||!S.inc.length||(typeof VISIT!=='undefined'&&VISIT))return;const b=ensureBF();let n=0;while(S.inc.length&&b.eggs.length<eggCap()){const e=S.inc.shift();b.eggs.push({sp:e.sp,g:e.g||{sz:1,m:'n'},fert:true,cand:1,p:Math.min(.9,e.prog||0),dent:0,mold:0,hp:1,t0:Date.now(),box:'A'});n++;}if(S.inc.length&&b.eggs.length>=eggCap())S.inc.length=0;if(n){markDirty();toast(`🥚 ${n} 顆蛋送到二樓新翼的孵蛋室`,3000);}},2000);
/* ---- 🏭 飼料合成機（二樓東牆，原本活餌培養室的位置） ---- */
const RCP={pellet:{n:'🟤 顆粒飼料 ×20',in:{fm:2,veg:3},out:['pellet',20],sec:30,d:'魚、龜、大部分水族都吃'},brine:{n:'🦐 冷凍豐年蝦 ×20',in:{nau:5},out:['brine',20],sec:20,d:'把新鮮無節幼體急速冷凍保存'},
 insect:{n:'🦗 營養蟲餐 ×15',in:{worm:5},out:['insect',15],sec:20,d:'大麥蟲加鈣粉做成的爬蟲飼料'},mouse:{n:'🐁 冷凍鼠 ×3',in:{pinky:6},out:['mouse',3],sec:25,d:'乳鼠養大一點再冷凍'}};
const ING={fm:'🐟 魚粉',veg:'🥬 蔬菜',nau:'🦐 新鮮無節幼體',worm:'🐛 大麥蟲',pinky:'🐁 乳鼠'};
const ingHave=k=>k==='fm'?(S.fm||0):k==='veg'?S.stock.veg:(S.lf?S.lf.st[k]:0)||0;
const ingUse=(k,n)=>{if(k==='fm')S.fm-=n;else if(k==='veg')S.stock.veg-=n;else S.lf.st[k]-=n;};
function synTick(){if(!S.syn||!S.syn.q.length)return;const now=Date.now();let ch=0;while(S.syn.q.length&&S.syn.q[0].end<=now){const j=S.syn.q.shift(),r=RCP[j.r];S.stock[r.out[0]]=Math.min(capOf(r.out[0]),S.stock[r.out[0]]+r.out[1]);toast(`🏭 合成完成：${r.n}`,2400);ch=1;}if(ch)markDirty();}
function synSheet(){ensureStock();ensureLF();S.syn=S.syn||{q:[]};S.qs&&(S.qs.f.syn=1);TUT.f.syn=1;synTick();const now=Date.now();
 sheet('🏭 飼料合成機',`<div class="mut sm" style="margin-bottom:6px">用原料自己合成飼料，比用買的便宜。原料：魚粉（倉庫活魚池把小魚磨成粉，或在商店買）、蔬菜（植物種植區）、活餌區的收成。最多同時排 3 批。</div>
 <div class="sm" style="background:#0d1a24;padding:6px 8px;border-radius:8px;margin-bottom:8px">原料：${Object.entries(ING).map(([k,n])=>`${n} <b>${ingHave(k)}</b>`).join('　')}<br>庫存：${Object.entries(STOCKDEF).map(([k,d])=>`${d.n||k} ${S.stock[k]}`).join('・')}</div>`+
 (S.syn.q.length?`<h4 style="margin:4px 0">⏳ 合成中</h4>`+S.syn.q.map(j=>`<div class="row2"><span>${RCP[j.r].n}</span><span class="mut sm">${Math.max(0,Math.ceil((j.end-now)/1000))} 秒</span></div>`).join(''):'')+
 Object.entries(RCP).map(([k,r])=>{const ok=Object.entries(r.in).every(([i,n])=>ingHave(i)>=n);return`<div class="res"><div><b>${r.n}</b></div><div class="mut sm">${r.d}<br>需要 ${Object.entries(r.in).map(([i,n])=>`${ING[i]} ${n}`).join(' + ')}・${r.sec} 秒</div><button class="btn sm ${ok?'feed':''}" data-r="${k}">${ok?'合成':'原料不夠'}</button></div>`;}).join('')+
 `<button class="btn" style="width:100%;margin-top:8px" id="toShopF">🛒 直接用買的（商店 → 飼料）</button>`,
 c=>{c.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=RCP[b.dataset.r];if(S.syn.q.length>=3){toast('一次最多排 3 批');return;}if(!Object.entries(r.in).every(([i,n])=>ingHave(i)>=n)){toast('原料不夠');return;}for(const [i,n] of Object.entries(r.in))ingUse(i,n);
   const last=S.syn.q.length?S.syn.q[S.syn.q.length-1].end:Date.now();S.syn.q.push({r:b.dataset.r,end:Math.max(last,Date.now())+r.sec*1000});markDirty();toast(`🏭 開始合成 ${r.n}`,1800);synSheet();});c.querySelector('#toShopF').onclick=()=>shopSheet('feed');});}
(function(){const g=new THREE.Group();g.position.set(11.25,5,3);scene.add(g);const st=new THREE.MeshStandardMaterial({color:C(0xc8ccd0),roughness:.35,metalness:.6}),dk=new THREE.MeshStandardMaterial({color:C(0x2b3440),roughness:.5,metalness:.4});
 box(1.1,1.2,2.6,st,0,.6,0,g);add(new THREE.CylinderGeometry(.35,.35,1,16),st,0,1.7,-.7,g);add(new THREE.ConeGeometry(.35,.4,16).rotateX(Math.PI),st,0,1.0,-.7,g);add(new THREE.CylinderGeometry(.25,.25,.8,14),st,0,1.6,.6,g);
 box(.05,.4,.7,new THREE.MeshBasicMaterial({color:C(0x37d07a)}),-.56,.9,0,g);WV.synL=add(new THREE.SphereGeometry(.06,8,6),new THREE.MeshBasicMaterial({color:C(0x37d07a)}),-.56,1.25,.25,g);
 for(let i=0;i<5;i++)add(new THREE.CylinderGeometry(.08,.08,.1,10),new THREE.MeshStandardMaterial({color:C(0x8a5a2a)}),-.4,1.26,-1.1+i*.12,g);
 const sg=add(new THREE.PlaneGeometry(1.9,.45),new THREE.MeshBasicMaterial({map:vText([['🏭 飼料合成機',44,.5]],480,120,'#0b1a24','#f4efe2')}),-.58,2.5,0,g);sg.rotation.y=-Math.PI/2;
 STATIONS.push({p:V(10.8,6.2,3),fn:synSheet});FAC.push({n:'🏭 飼料合成機',d:'用魚粉、蔬菜、活餌合成飼料，比買的便宜',p:[10.2,3],fn:synSheet,b:'合成飼料'});})();
globalAnims.push((dt,t)=>{if(WV.synL)WV.synL.material.color.set(S.syn&&S.syn.q.length&&Math.sin(t*8)>0?0xffb347:0x37d07a);});
/* ---- 🛒 商店：飼料、繁殖用品 ---- */
const FEEDBUY={pellet:[20,80],insect:[20,100],brine:[20,90],veg:[10,60],mouse:[5,150],fm:[5,120]};
const SHOPTABS=[['ani','動物'],['feed','🥫 飼料'],['gear','🧪 繁殖用品'],['up','設備升級']];
const tabRow=t=>`<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">${SHOPTABS.map(([k,n])=>`<button class="chip ${t===k?'on':''}" data-st="${k}">${n}</button>`).join('')}</div><div class="row2" style="margin-bottom:6px"><span class="mut">持有 ${fmt$(S.money)}・買的東西會送到 📦 倉庫</span></div>`;
const _shZ=shopSheet;shopSheet=function(tab='ani'){ensureEco();ensureStock();ensureBF();
 if(tab==='feed'){sheet('🛒 商店',tabRow('feed')+`<div class="mut sm" style="margin-bottom:6px">飼料直接送進倉庫庫存。想省錢的話，用二樓的「🏭 飼料合成機」自己做。</div>`+Object.entries(FEEDBUY).map(([k,[n,p]])=>{const nm=k==='fm'?'🐟 魚粉（合成原料）':(STOCKDEF[k].n||k),have=k==='fm'?(S.fm||0):S.stock[k];return`<div class="res"><div><b>${nm}</b> <span class="mut">庫存 ${have}${k!=='fm'?'/'+capOf(k):''}</span></div><div class="mut sm">一包 ${n} 份</div><button class="btn sm" data-fb="${k}">買 ${fmt$(p)}</button></div>`;}).join(''),
   c=>{c.querySelectorAll('[data-st]').forEach(x=>x.onclick=()=>shopSheet(x.dataset.st));c.querySelectorAll('[data-fb]').forEach(x=>x.onclick=()=>{const k=x.dataset.fb,[n,p]=FEEDBUY[k];if(k!=='fm'&&S.stock[k]>=capOf(k)){toast('倉庫這種飼料已經滿了');return;}if(!pay(p,'飼料'))return;if(k==='fm')S.fm=(S.fm||0)+n;else S.stock[k]=Math.min(capOf(k),S.stock[k]+n);markDirty();toast(`📦 ${n} 份送進倉庫`,1600);shopSheet('feed');});});return;}
 if(tab==='gear'){const b=S.bf;sheet('🛒 商店',tabRow('gear')+`<div class="mut sm" style="margin-bottom:6px">繁殖場、孵蛋室要用的器材。買了會放在倉庫，繁殖時自動拿來用。</div>`+Object.entries(NEED).filter(([k,n])=>!n.act).map(([k,n])=>{const own=k==='ca'?b.ca:k==='hormone'?b.hor:b.items[k]?1:0;
   return`<div class="res"><div><b>${n.n}</b> <span class="mut">${n.use?'剩 '+own+' 份':own?'已擁有':''}</span></div><div class="mut sm">${n.d}</div>${n.use?`<button class="btn sm" data-gb="${k}">買 5 份 ${fmt$(n.c*5)}</button>`:own?'<span>✅</span>':`<button class="btn sm" data-gb="${k}">買 ${fmt$(n.c)}</button>`}</div>`;}).join('')+
   `<div class="res"><div><b>🥚 孵蛋介質（蛭石）</b></div><div class="mut sm">孵蛋室的蛋比較不容易乾掉或發霉（濕度容錯 +5%）</div>${b.items.verm?'<span>✅</span>':`<button class="btn sm" data-gb="verm">買 ${fmt$(400)}</button>`}</div>`,
   c=>{c.querySelectorAll('[data-st]').forEach(x=>x.onclick=()=>shopSheet(x.dataset.st));c.querySelectorAll('[data-gb]').forEach(x=>x.onclick=()=>{const k=x.dataset.gb;if(k==='verm'){if(!pay(400,'蛭石'))return;b.items.verm=1;}else{const n=NEED[k];if(n.use){if(!pay(n.c*5,n.n))return;if(k==='ca')b.ca+=5;else b.hor+=5;}else{if(!pay(n.c,n.n))return;b.items[k]=1;}}markDirty();toast('📦 送到倉庫了',1500);shopSheet('gear');});});return;}
 _shZ(tab);const c=$('#shC');if(!c)return;const row=c.querySelector('[data-t]')&&c.querySelector('[data-t]').parentNode;if(row){row.style.flexWrap='wrap';for(const [k,n] of [['feed','🥫 飼料'],['gear','🧪 繁殖用品']]){const x=document.createElement('button');x.className='chip';x.textContent=n;x.onclick=()=>shopSheet(k);row.insertBefore(x,row.children[1]||null);}}
 if(tab==='up')c.querySelectorAll('.res').forEach(r=>{if(/活餌培養設備|收成量|產量/.test(r.textContent))r.remove();});};
/* ---- 商店建築（戶外西側） ---- */
(function(){const sx=-30,sz=48;const g=new THREE.Group();g.position.set(sx,0,sz);scene.add(g);const wl=new THREE.MeshStandardMaterial({color:C(0xf2e6d0),roughness:.8}),rf=new THREE.MeshStandardMaterial({color:C(0xb8462e),roughness:.6}),wd=new THREE.MeshStandardMaterial({color:C(0x8a5a32),roughness:.7});
 box(8,.1,6,new THREE.MeshStandardMaterial({color:C(0xd8c8a8)}),0,.05,0,g);box(.2,3.6,6,wl,-4,1.8,0,g);box(8,3.6,.2,wl,0,1.8,-3,g);box(8,3.6,.2,wl,0,1.8,3,g);box(.2,.9,6,wl,4,3.15,0,g);
 const roof=box(8.8,.2,7,rf,0,3.75,0,g);for(let i=0;i<8;i++)box(.9,.5,.08,new THREE.MeshStandardMaterial({color:C(i%2?0xffffff:0xd84a3a)}),-3.6+i*1.03,3.4,3.15,g);
 for(let i=0;i<8;i++)box(.9,.5,.08,new THREE.MeshStandardMaterial({color:C(i%2?0xffffff:0xd84a3a)}),4.15,3.4,-3.6+i*1.03,g).rotation.y=Math.PI/2;
 box(1.2,1,3.4,wd,1.8,.5,0,g);box(1.3,.06,3.5,new THREE.MeshStandardMaterial({color:C(0xd8b888)}),1.8,1.03,0,g);
 for(const z of[-2,0,2]){box(.6,2.4,1.6,wd,-3.5,1.2,z,g);for(let y=0;y<3;y++)for(let i=0;i<3;i++)box(.3,.3,.3,new THREE.MeshStandardMaterial({color:C([0xe8c030,0x4aa3ff,0x6fd38c,0xd84a3a][(i+y+z)&3])}),-3.3,.6+y*.75,z-.45+i*.45,g);}
 const sg=add(new THREE.PlaneGeometry(4,.9),new THREE.MeshBasicMaterial({map:vText([['🛒 生態館商店',60,.45],['SHOP・買的東西送到倉庫',26,.82,'#ffd27a']],720,160,'#3a1a10','#fff4e0')}),4.12,4.3,0,g);sg.rotation.y=Math.PI/2;
 glow(sx+1,3.4,sz,1.6,0xfff0d0,.7);OBST.push([sx-4.2,sx-3.1,sz-3,sz+3],[sx-4.2,sx+4.2,sz-3.2,sz-2.8],[sx-4.2,sx+4.2,sz+2.8,sz+3.2],[sx+1.1,sx+2.5,sz-1.8,sz+1.8]);
 STATIONS.push({p:V(sx+1.8,1.3,sz),fn:()=>shopSheet('ani')});
 const _barS=bar;bar=function(){_barS();if(lvl()!==0||window.__ride)return;if(player.x>sx-3.5&&player.x<sx+8&&player.z>sz-3&&player.z<sz+3){near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent='🛒 生態館商店';$('#bD').textContent=`持有 ${fmt$(S.money||0)}・買的東西會用卡車送到東邊倉庫`;
  if(lastBtns!=='shopB'){lastBtns='shopB';const bb=$('#bB');bb.innerHTML='';for(const [t,k,c] of[['動物','ani','feed'],['飼料','feed',''],['繁殖用品','gear',''],['升級','up','']]){const x=document.createElement('button');x.className='btn '+c;x.textContent=t;x.onclick=()=>shopSheet(k);bb.appendChild(x);}}}};
 SPOTS.push(['🛒 商店',()=>Object.assign(player,{x:sx+6,y:0,z:sz,yaw:Math.PI/2,pitch:-.05})]);})();
/* ---- 📦 倉庫：活魚池、我的船 ---- */
const isAquaSp=k=>!!(SP[k]&&HT[SP[k].hab]&&HT[SP[k].hab].aqua);
const PV={fish:[]};
function boatMesh(k){const g=new THREE.Group();const B=BOATS[k];if(!B||k==='rent')return g;const L={skiff:4.2,cruiser:5.3,yacht:6.3}[k],W={skiff:1.6,cruiser:2,yacht:2.3}[k];
 const hc={skiff:0xf2f2f2,cruiser:0x2f7ad0,yacht:0x1a2a3a}[k];const hm=new THREE.MeshStandardMaterial({color:C(hc),roughness:.35,metalness:.2});
 box(W,.8,L*.75,hm,0,.9,-L*.1,g);const bow=add(new THREE.ConeGeometry(W*.55,L*.3,4),hm,0,.9,L*.4,g);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.5);
 box(W*.95,.06,L*.7,new THREE.MeshStandardMaterial({color:C(0xc8a878)}),0,1.32,-L*.1,g);box(W*.7,.9,L*.25,new THREE.MeshStandardMaterial({color:C(0xf6f6f6)}),0,1.8,-L*.05,g);
 box(W*.72,.35,.04,new THREE.MeshStandardMaterial({color:C(0x223344)}),0,1.95,L*.08,g);box(W+.1,.12,L*.75,new THREE.MeshStandardMaterial({color:C(0xd84a3a)}),0,.55,-L*.1,g);
 if(k!=='skiff'){add(cylBetween(V(0,2.25,-L*.05),V(0,3.3,-L*.05),.03,.03),new THREE.MeshStandardMaterial({color:C(0xcccccc)}),0,0,0,g);}
 for(const s of[-1,1])box(.1,.5,L*.5,new THREE.MeshStandardMaterial({color:C(0x333333)}),s*W*.35,.25,-L*.1,g);return g;}
(function(){const wx=30,wz=48;const g=new THREE.Group();scene.add(g);PV.g=g;
 const rim=new THREE.MeshStandardMaterial({color:C(0x5a6068),roughness:.6});const px=27.8,pz=55.9,pw=4.4,pd=4.6;
 box(pw+.3,.45,.15,rim,px,.22,pz-pd/2,g);box(pw+.3,.45,.15,rim,px,.22,pz+pd/2,g);box(.15,.45,pd,rim,px-pw/2,.22,pz,g);box(.15,.45,pd,rim,px+pw/2,.22,pz,g);
 box(pw,.02,pd,new THREE.MeshStandardMaterial({color:C(0x2a4a5a)}),px,.02,pz,g);const wt=box(pw,.02,pd,new THREE.MeshStandardMaterial({color:C(0x3a8ac8),transparent:true,opacity:.55,roughness:.1,depthWrite:false}),px,.36,pz,g);
 PV.pond={x:px,z:pz,w:pw,d:pd};OBST.push([px-pw/2-.15,px+pw/2+.15,pz-pd/2-.15,pz+pd/2+.15]);
 const s1=add(new THREE.PlaneGeometry(2.4,.5),new THREE.MeshBasicMaterial({map:vText([['🐟 活魚池',48,.5]],480,100,'#0b1a24','#bfe6ff')}),px,2.2,pz-pd/2-.2,g);s1.rotation.y=Math.PI;
 const s2=add(new THREE.PlaneGeometry(2.4,.5),new THREE.MeshBasicMaterial({map:vText([['⛵ 我的船',48,.5]],480,100,'#0b1a24','#ffd27a')}),32.6,3.4,53.3,g);s2.rotation.y=Math.PI;
 box(2.4,.25,6.6,new THREE.MeshStandardMaterial({color:C(0x444a52),metalness:.5}),32.6,.12,56.1,g);PV.boatAt=V(32.6,.2,56.1);OBST.push([31.3,33.9,52.7,59.5]);
 STATIONS.push({p:V(px,.6,pz),fn:()=>pondSheet()},{p:V(32.6,1.5,56.1),fn:()=>boatSheet()});})();
function pondVis(){if(!PV.g)return;const L=(S.wh||[]).map((w,i)=>({w,i})).filter(o=>isAquaSp(o.w.sp)).slice(0,16);
 while(PV.fish.length>L.length){const f=PV.fish.pop();PV.g.remove(f.m);}
 L.forEach((o,i)=>{let f=PV.fish[i];if(!f||f.k!==o.w.sp){if(f)PV.g.remove(f.m);const d=dispGeo(o.w.sp);const m=new THREE.Mesh(d.g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.4,side:THREE.DoubleSide}));const len=clamp((SP[o.w.sp].len||.25)*((o.w.g&&o.w.g.sz)||1),.15,.9);m.scale.setScalar(len/d.len);
  const t=o.w.g&&o.w.g.m&&MORPH[o.w.g.m]&&MORPH[o.w.g.m].tint;if(t)m.material.color.setRGB(...t);PV.g.add(m);f=PV.fish[i]={m,k:o.w.sp,a:Math.random()*6,r:.6+Math.random()*1.4,sp:.25+Math.random()*.3,y:.12+Math.random()*.15};}});
 if(PV.boat&&PV.boatK!==S.boat){PV.g.remove(PV.boat);PV.boat=null;}if(!PV.boat&&S.boat){PV.boat=boatMesh(S.boat);PV.boat.position.copy(PV.boatAt);PV.boatK=S.boat;PV.g.add(PV.boat);}}
globalAnims.push((dt,t)=>{if(!PV.pond)return;const P=PV.pond;PV.fish.forEach(f=>{f.a+=dt*f.sp;const x=P.x+Math.cos(f.a)*Math.min(f.r,P.w/2-.4)*.9,z=P.z+Math.sin(f.a)*Math.min(f.r*1.6,P.d/2-.5);f.m.position.set(x,f.y,z);f.m.rotation.y=-f.a-Math.PI/2*(f.sp>0?1:-1)+Math.PI;});});
setInterval(()=>{if(loaded)pondVis();},2000);
function pondSheet(){const L=(S.wh||[]).map((w,i)=>({w,i})).filter(o=>isAquaSp(o.w.sp));
 sheet('🐟 倉庫活魚池',`<div class="mut sm" style="margin-bottom:6px">買來的魚、從船上帶回來的魚都會先養在這裡，看得到牠們在游。可以放進展缸、賣掉，或把小魚磨成「魚粉」拿去合成飼料。魚粉：<b>${S.fm||0}</b></div>`+
 (L.length?L.map(o=>{const v=fishVal(o.w.sp,o.w.g||{sz:1,m:'n'}),fm=Math.max(1,Math.round(((SP[o.w.sp].len||.25)*((o.w.g&&o.w.g.sz)||1))*6));return`<div class="row2"><span>🐟 ${esc(o.w.name||SP[o.w.sp].n)} <span class="mut sm">${gTag(o.w)||''}${o.w.cm?' '+o.w.cm+' cm':''}</span></span><span style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end"><button class="btn sm" data-p="${o.i}">放展缸</button><button class="btn sm" data-s="${o.i}">賣 ${fmt$(v)}</button><button class="btn sm" data-m="${o.i}">魚粉 +${fm}</button></span></div>`;}).join(''):'<div class="mut">活魚池是空的。</div>'),
 c=>{c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pondPlace(S.wh[+b.dataset.p]));
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const i=+b.dataset.s,w=S.wh[i];if(!w)return;const v=fishVal(w.sp,w.g||{sz:1,m:'n'});S.wh.splice(i,1);earn(v);mktHit(w.sp);markDirty();pondVis();toast(`💰 賣了 ${fmt$(v)}`,1600);pondSheet();});
  c.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const i=+b.dataset.m,w=S.wh[i];if(!w)return;const fm=Math.max(1,Math.round(((SP[w.sp].len||.25)*((w.g&&w.g.sz)||1))*6));S.wh.splice(i,1);S.fm=(S.fm||0)+fm;markDirty();pondVis();toast(`🐟 磨成 ${fm} 份魚粉`,1600);pondSheet();});});}
/* 活魚池放進展缸；魚的轉賣價跟活魚池一致 */
function pondPlace(it){if(!it)return;const ds=Object.values(TANKS).filter(k=>spOK(it.sp,k)&&used(k)+SP[it.sp].cost<=SZ[k.sz].cap);
 if(!ds.length){toast(`沒有適合的展缸，先設置一個${HT[SP[it.sp].hab].n}`,3000);return;}
 sheet(`🐟 ${esc(it.name||SP[it.sp].n)} 要放哪一缸？`,ds.map((k,i)=>`<button class="opt" data-d="${i}"><b>${esc(k.st.name||HT[k.st.type].n)}</b><span class="mut">空間 ${used(k)}/${SZ[k.sz].cap}・${k.st.animals.length} 隻</span></button>`).join(''),
  c=>c.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{placeIn(it,ds[+b.dataset.d]);markDirty();pondVis();toast(`🐟 放進「${ds[+b.dataset.d].st.name||HT[ds[+b.dataset.d].st.type].n}」`,2000);pondSheet();}));}
{const _wv=whVal;whVal=it=>isAquaSp(it.sp)?fishVal(it.sp,it.g||{sz:1,m:'n'}):_wv(it);}
/* 市集行情價：跟活魚池、倉庫用同一套價格（不受當天賣太多的影響） */
function estVal(sp,g){g=g||{sz:1,m:'n'};if(isAquaSp(sp)&&!BOSS[sp])return Math.round(fPrice(sp)*Math.pow(clamp(g.sz||1,.75,1.6),2)*Math.min(2,((MORPH[g.m]||MORPH.n).mul)||1));return Math.round((PRICE[sp]||100)*.8*(g.m?geneMul(g):1));}
/* ---- 靠近顯示管理卡：二樓新翼所有設施 ---- */
(function(){const X=WG.x,Z=WG.z,W=(x,z)=>[X+x,Z+z];const add2=(n,d,p,fn,b)=>FAC.push({n,d,p,fn,b});
 for(let q=0;q<4;q++)add2(`🧪 繁殖箱 ${q+1}・${q+5}`,'放一對動物、調溫度濕度、看繁殖進度',W(-9.6,-5.4+q*2.6),()=>{const b=ensureBF();const i=[q,q+4].find(i=>i<boxN()&&b.box[i].st!=='idle');if(i!=null)boxSheet(i);else bfSheet('box');},'管理繁殖箱');
 add2('🥚 孵蛋室','兩台孵蛋箱：照蛋、調溫度濕度、控制公母比例',W(-7.8,-8.2),()=>bfSheet('egg'),'打開孵蛋室');
 add2('🪼 水母生活史','水螅體、橫裂、碟狀幼體',W(-5.8,-5),()=>bfSheet('jel'),'管理水母');
 add2('🏭 繁殖場總覽','所有繁殖箱、器材、紀錄',W(-3,3.6),()=>bfSheet('box'),'打開總覽');
 add2('🏆 釣魚標本陳列室','管理展示的標本、釘選、賣出',W(5.6,0),()=>trSheet(),'管理標本');
 add2('🦐 豐年蝦孵化錐','孵化、收成新鮮無節幼體',W(15,-8),()=>lfSheet('br'),'管理');add2('🦠 微藻・輪蟲・橈足類','綠水食物鏈',W(20.5,-8),()=>lfSheet('pl'),'管理');
 add2('🦗 蟋蟀繁殖箱','溫度、濕度、清理、腸道負載',W(26.2,-7),()=>lfSheet('cr'),'管理');add2('🐛 大麥蟲','隔離化蛹、收成',W(23.5,-5.2),()=>lfSheet('sw'),'管理');
 add2('🪰 果蠅培養','分瓶、收成',W(14.4,-5.2),()=>lfSheet('ff'),'管理');add2('🐁 冷凍鼠繁殖架','換墊料、冷凍',W(18.8,-5.1),()=>lfSheet('ms'),'管理');
 add2('🔬 顯微鏡','鑑定樣本賺研究點數',W(15,-1.4),()=>{const R=ensureRS();(R.mic.n>=5&&Date.now()-R.mic.t<3*60e3)?rsSheet('mic'):micQ();},'開始鑑定');
 add2('🧪 研究電腦','研究項目、論文',W(20,-1.3),()=>rsSheet('tree'),'打開研究');add2('👀 行為觀察任務','到展示缸前待 20 秒',W(26.6,-.4),()=>rsSheet('obs'),'查看任務');
 add2('🧊 基因庫','採樣、冷凍保存',W(24.5,.9),()=>rsHas('cryo')?rsSheet('gb'):toast('🔒 先完成「冷凍生物學」研究',2600),'打開基因庫');add2('📄 論文發表','發表論文拿經費',W(16.5,.8),()=>rsSheet('pap'),'發表論文');
 add2('🌏 保育計畫地圖','進行中的計畫',W(26.6,6.3),()=>csSheet('proj'),'查看計畫');add2('📋 保育委託板','接新的保育計畫',W(16,8.4),()=>csSheet('new'),'接委託');
 add2('🌲 野放閘門','野放人工繁殖的個體',W(21.5,8.4),()=>csSheet('rel'),'野放');add2('🏅 保育成就','完成的計畫和名聲',W(25.5,8.2),()=>csSheet('bad'),'查看');})();
/* 一樓也用靠近顯示（節肢館紫外線台） */
const FAC0=[{n:'🔦 紫外線展示台',d:'開關紫外線燈，看蠍子發螢光',p:[-44,29.3],fn:()=>{const s=STATIONS.find(s=>Math.abs(s.p.x+44)<.01&&Math.abs(s.p.z-28.6)<.01);if(s)s.fn();},b:'開關紫外線燈'}];
const _bar0=bar;bar=function(){_bar0();if(lvl()!==0||window.__ride)return;let f=null,bd=2.6;for(const F of FAC0){const d=Math.hypot(player.x-F.p[0],player.z-F.p[1]);if(d<bd){bd=d;f=F;}}if(!f)return;near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent=f.n;$('#bD').textContent=f.d;
 const key='fac0:'+f.n;if(lastBtns!==key){lastBtns=key;const bb=$('#bB');bb.innerHTML='';const x=document.createElement('button');x.className='btn feed';x.textContent=f.b;x.onclick=f.fn;bb.appendChild(x);}};
/* ---- 💰 收支表 ---- */
const _earnL=earn;earn=function(n){_earnL(n);if(n>0){S.led=S.led||[];S.led.push([Date.now(),n]);}};
const _payL=pay;pay=function(n,w){const r=_payL(n,w);if(r&&n>0){S.led=S.led||[];S.led.push([Date.now(),-n]);}return r;};
setInterval(()=>{if(S.led){const c=Date.now()-3600e3;S.led=S.led.filter(x=>x[0]>c);}},60000);
function finSheet(){TUT.f.fin=1;const m=mScore(),st=starOf(m.score),tk=tkRate(m),sal=salary();const L=(S.led||[]).filter(x=>x[0]>Date.now()-3600e3);const inc=L.filter(x=>x[1]>0).reduce((a,x)=>a+x[1],0),out=-L.filter(x=>x[1]<0).reduce((a,x)=>a+x[1],0);
 const tips=[];if(m.avgC<60&&m.n)tips.push(`🧹 缸的平均乾淨度只有 ${m.avgC}%，清乾淨門票會變多。`);if(m.avgM<60&&m.n)tips.push(`😟 動物平均心情 ${m.avgM}，餵食、清潔、溫度對了就會開心。`);
 if(!staffN()&&tanksN()>=5)tips.push('👷 展缸很多了，雇一個清潔員或飼育員，讓它們自動照顧。');if(sal>tk*.6&&sal)tips.push('⚠️ 薪水快吃掉門票了，先把星等拉高再雇更多人。');
 if(STARS[st])tips.push(`⭐ 再 ${STARS[st]-m.score} 分升到 ${st+1} 星，票價會變高。多展出不同物種最有效。`);if(!S.bf||!S.bf.box.some(x=>x.st!=='idle'))tips.push('🥚 繁殖出來的寶寶可以賣或上市集，突變的特別值錢。');
 sheet('💰 收支表',`<div class="res" style="display:block"><div class="row2"><span>🎟 門票（${'⭐'.repeat(st)}）</span><b style="color:#6fd38c">+${fmt$(tk)}/分</b></div><div class="row2"><span>👷 員工薪水（${staffN()} 人）</span><b style="color:#ff8a8a">−${fmt$(sal)}/分</b></div><div class="row2" style="border-top:1px solid #234;margin-top:4px;padding-top:4px"><span><b>固定淨收入</b></span><b>${fmt$(tk-sal)}/分・約 ${fmt$((tk-sal)*60)}/小時</b></div></div>
  <div class="res" style="display:block"><div class="mut sm">最近 1 小時所有進出（門票、賣動物、釣魚、獎金、買東西…）</div><div class="row2"><span>收入</span><b style="color:#6fd38c">+${fmt$(inc)}</b></div><div class="row2"><span>支出</span><b style="color:#ff8a8a">−${fmt$(out)}</b></div></div>
  <h4 style="margin:10px 0 4px">💡 賺更多的建議</h4>${tips.map(t=>`<div class="sm" style="margin:4px 0;line-height:1.6">${t}</div>`).join('')||'<div class="mut sm">經營得很好！</div>'}`);}
const _qsF=qSheet;qSheet=function(){TUT.f.qs=1;_qsF();const c=$('#shC');if(!c)return;const b=document.createElement('button');b.className='btn feed';b.style.cssText='width:100%;margin:6px 0';b.textContent='💰 看收支表';b.onclick=finSheet;c.insertBefore(b,c.children[1]||null);};
/* ---- 📘 新手教學：箭頭＋文字 ---- */
const TUT={on:false,i:0,f:{}};
const emptySlot=()=>{let best=null,bd=1e9;for(const s of SLOTS){if(TANKS[s.id]||!s.view)continue;if((s.fy||0)>2)continue;const d=Math.hypot(player.x-s.view.x,player.z-s.view.z);if(d<bd){bd=d;best=s;}}return best?V(best.wall.x+best.f.x*.8,1.6,best.wall.z+best.f.z*.8):null;};
const animTank=()=>{for(const id in TANKS){const t=TANKS[id];if(t.st&&t.st.animals.length&&t.slot)return V(t.slot.wall.x+t.slot.f.x*.8,(t.slot.fy||0)+1.8,t.slot.wall.z+t.slot.f.z*.8);}return null;};
const TSTEPS=[
 {t:'👋 歡迎！這個教學教你怎麼經營生態館賺錢。左上角的小卡是星等和「每分鐘門票收入」，門票就是最主要的收入。',man:1},
 {t:'點一下左上角的小卡，打開「館長任務」。照著主線做，每完成一個都有獎金。',ui:'#qTrk',ok:()=>TUT.f.qs},
 {t:'跟著箭頭走到牆邊的虛線框，點它蓋一個展缸。展缸越多，能展出的動物越多。',pos:emptySlot,ok:()=>tanksN()>=1},
 {t:'到戶外西邊的「🛒 商店」買一隻動物（地圖可以直接傳送）。買的東西會用卡車送到東邊的倉庫。',pos:()=>V(-28,2.2,48),ok:()=>dispSp()>=2||(S.orders||[]).length>0||(S.wh||[]).length>0},
 {t:'到戶外東邊的「📦 倉庫」，把送到的動物放進展缸。物種越多、越稀有，星等越高、門票越多。',pos:()=>V(28,2.2,47),ok:()=>dispSp()>=2||(dispSp()>=1&&!(S.wh||[]).length&&!(S.orders||[]).length)},
 {t:'走到有動物的展缸前按「餵食」。動物開心、缸乾淨，門票收入會乘上去。',pos:animTank,ok:()=>(S.qs&&S.qs.f.fed||0)>(TUT.fed0||0)},
 {t:'按下面的「💰 看收支表」，看每分鐘賺多少、花多少，還有賺更多的建議。',btn:['💰 看收支表',()=>finSheet()],ok:()=>TUT.f.fin},
 {t:'缸多了照顧不完就雇員工：打開「地圖」→「👷 員工管理」，雇一個清潔員。薪水比多賺的門票少就划算。',ui:'#chips',ok:()=>staffN()>=1},
 {t:'到二樓水族展廳東邊的走廊，走進「二樓新翼」：繁殖、研究、保育都能賺大錢。',pos:()=>V(13.5,7,11.5),ok:()=>S.qs&&S.qs.f.wing},
 {t:'回到二樓東牆邊的「🏭 飼料合成機」：用魚粉、蔬菜自己做飼料，比用買的便宜。',pos:()=>V(10.9,7.8,3),ok:()=>TUT.f.syn},
 {t:'🎉 教學完成！之後跟著左上角的館長任務走，星等越高門票越多。釣魚是副業，出海要付費，大魚可以做標本加分。',man:1}];
const TV={};
(function(){const g=new THREE.Group();const m=new THREE.MeshBasicMaterial({color:C(0xffb347),transparent:true,opacity:.95,depthTest:false});add(new THREE.ConeGeometry(.28,.6,12).rotateX(Math.PI),m,0,0,0,g);add(new THREE.CylinderGeometry(.09,.09,.5,8),m,0,.5,0,g);
 const r=add(new THREE.RingGeometry(.45,.6,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:C(0xffb347),transparent:true,opacity:.6,side:THREE.DoubleSide,depthTest:false}),0,-1.2,0,g);g.children.forEach(o=>o.renderOrder=30);g.visible=false;g.userData.dyn=1;scene.add(g);TV.a=g;TV.r=r;})();
function tutStart(force){S.tut={i:0,done:0};TUT.on=true;TUT.i=0;tutSkipDone();tutUI();if(force)toast('📘 新手教學開始',1600);markDirty();}
function tutSkipDone(){while(TUT.i<TSTEPS.length-1){const s=TSTEPS[TUT.i];if(s.man&&TUT.i===0)break;if(!s.man&&s.ok&&s.ok()){TUT.i++;continue;}break;}if(TSTEPS[TUT.i]&&TSTEPS[TUT.i].ok&&TUT.i===5)TUT.fed0=(S.qs&&S.qs.f.fed)||0;}
function tutNext(){TUT.i++;if(S.tut)S.tut.i=TUT.i;if(TUT.i>=TSTEPS.length){tutEnd(true);return;}if(TUT.i<TSTEPS.length-1)earn(300);if(TUT.i===5)TUT.fed0=(S.qs&&S.qs.f.fed)||0;markDirty();tutSkipDone();tutUI();}
function tutEnd(fin){TUT.on=false;S.tut={done:1};const d=document.getElementById('tutBox');if(d)d.remove();TV.a.visible=false;document.querySelectorAll('.tutHi').forEach(e=>e.classList.remove('tutHi'));if(fin){earn(1000);toast('📘 教學完成！獎金 $1,000',3000);}markDirty();}
function tutUI(){let d=document.getElementById('tutBox');if(!TUT.on){if(d)d.remove();return;}const s=TSTEPS[TUT.i];if(!s){tutEnd(true);return;}
 if(!d){d=document.createElement('div');d.id='tutBox';d.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom) + 118px);z-index:58;width:min(92vw,420px);background:rgba(8,18,28,.94);border:1.5px solid #ffb347;border-radius:14px;padding:10px 12px;color:#fff;font-size:14px;line-height:1.55';document.body.appendChild(d);}
 d.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:12px;color:#ffb347;margin-bottom:4px"><span>📘 新手教學 ${TUT.i+1}/${TSTEPS.length}</span><span id="tutSk" style="opacity:.7;cursor:pointer">跳過教學 ✕</span></div><div>${s.t}</div><div id="tutDir" style="font-size:12px;color:#9fd8ff;margin-top:4px"></div><div style="display:flex;gap:6px;margin-top:6px">${s.man?`<button class="btn feed" style="flex:1" id="tutN">${TUT.i===TSTEPS.length-1?'完成':'下一步'}</button>`:''}${s.btn?`<button class="btn feed" style="flex:1" id="tutB">${s.btn[0]}</button>`:''}</div>`;
 d.querySelector('#tutSk').onclick=()=>{tutEnd(false);toast('之後可以從地圖重新開始教學',2400);};const n=s.man&&d.querySelector('#tutN');if(n)n.onclick=tutNext;const b=s.btn&&d.querySelector('#tutB');if(b)b.onclick=s.btn[1];
 document.querySelectorAll('.tutHi').forEach(e=>e.classList.remove('tutHi'));if(s.ui){const e=document.querySelector(s.ui);if(e)e.classList.add('tutHi');}}
{const st=document.createElement('style');st.textContent='@keyframes tutP{0%,100%{box-shadow:0 0 0 2px #ffb347}50%{box-shadow:0 0 0 6px rgba(255,179,71,.35)}}.tutHi{animation:tutP 1.2s infinite;border-radius:12px}';document.head.appendChild(st);}
globalAnims.push((dt,t)=>{if(!TUT.on){if(TV.a)TV.a.visible=false;return;}const s=TSTEPS[TUT.i];if(!s)return;if(s.ok&&s.ok()){tutNext();return;}
 const p=s.pos?s.pos():null;TV.a.visible=!!p;const dir=document.getElementById('tutDir');if(!p){if(dir)dir.textContent='';return;}TV.a.position.set(p.x,p.y+Math.sin(t*3)*.15,p.z);TV.r.scale.setScalar(1+Math.sin(t*3)*.15);
 if(dir&&((t*4)|0)%2===0){const dx=p.x-player.x,dz=p.z-player.z,d=Math.hypot(dx,dz);const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);const fw=(dx*fx+dz*fz)/(d||1),rt=(dx*-fz+dz*fx)/(d||1);
  const lvlTxt=Math.abs(p.y-((player.y||0)+1.6))>2.5?(p.y>(player.y||0)+2?'・要上二樓':'・要下一樓'):'';dir.textContent=d<2.5?'📍 就在這裡！':`📍 目標在你${fw>.7?'正前方':fw<-.5?'後面':rt>0?'右邊':'左邊'} ${Math.round(d)} 公尺${lvlTxt}（看發亮的箭頭）`;}});
const _msT=mapSheet;mapSheet=function(){_msT();if(typeof VISIT!=='undefined'&&VISIT)return;const c=$('#shC');if(!c)return;const b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:6px';b.textContent=TUT.on?'📘 新手教學進行中':'📘 新手教學（賺錢經營）';b.onclick=()=>{$('#sheet').classList.remove('open');tutStart(true);};c.insertBefore(b,c.children[2]||null);
 const f=document.createElement('button');f.className='btn';f.style.cssText='width:100%;margin-top:6px';f.textContent='💰 收支表';f.onclick=finSheet;c.insertBefore(f,c.children[3]||null);};
setTimeout(()=>{if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;S.syn=S.syn||{q:[]};pondVis();if(S.tut&&S.tut.done)return;if(S.tut&&S.tut.i!=null){TUT.on=true;TUT.i=S.tut.i;tutSkipDone();tutUI();return;}if(tanksN()<3)tutStart(false);else{S.tut={done:1};markDirty();setTimeout(()=>toast('📘 地圖裡有新的「新手教學」和「💰 收支表」',4200),3000);}},5500);
setInterval(()=>{if(loaded)synTick();},2000);

