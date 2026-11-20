/* =================================================================
   👷 員工系統：清潔員、飼育員、環境員，自動照顧展缸，看得到他們在館裡工作
   ================================================================= */
const STAFF={
 clean:{n:'🧹 清潔員',d:'自動清缸、擦玻璃、換水（乾淨度低於 55% 的缸）',cost:1500,sal:8,col:0x4aa3ff,max:4},
 feed:{n:'🍽 飼育員',d:'自動餵食飢餓的動物（會用掉倉庫的飼料）',cost:2000,sal:10,col:0x6fd38c,max:4},
 mist:{n:'💦 環境員',d:'自動幫爬蟲缸、鳥園噴霧，維持濕度',cost:1500,sal:8,col:0xb47aff,max:3},
 breed:{n:'🧪 繁殖助理',d:'二樓新翼：自動把繁殖箱調到建議溫濕度、做觸發動作、照蛋丟無精蛋、調孵蛋濕度、餵碟狀幼體',cost:3000,sal:12,col:0xff7ab8,max:1},
 lfk:{n:'🦗 活餌員',d:'活餌區：自動孵豐年蝦並收成、顧綠水、餵蟋蟀噴水清理、補麥麩、分果蠅瓶、換鼠籠墊料，收成多的送進庫存',cost:2500,sal:10,col:0xffb347,max:1}};
const HUMT={desert:35,tropical:70,aviary:65,yard:55};
const NAMES=['阿明','小美','阿德','小芬','志豪','雅婷','建宏','佳穎','冠宇','怡君','家豪','欣怡'];
function ensureStaff(){S.staff=S.staff||{};for(const k in STAFF)S.staff[k]=S.staff[k]||[];S.staffT=S.staffT||Date.now();return S.staff;}
const staffN=()=>{const s=ensureStaff();return Object.values(s).reduce((a,b)=>a+b.length,0);};
const salary=()=>{const s=ensureStaff();let t=0;for(const k in STAFF)t+=s[k].length*STAFF[k].sal;return t;};
/* 安靜模式：員工工作時不要一直跳提示 */
let QUIET=0;const _toZ=toast;toast=function(...a){if(QUIET>Date.now())return;return _toZ(...a);};
function staffWork(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;const s=ensureStaff();if(S.strike)return;const tks=Object.values(TANKS).filter(t=>t.st&&t.st.animals&&t.st.animals.length);let done={clean:0,feed:0,mist:0};
 QUIET=Date.now()+1500;
 for(const k in STAFF){const n=s[k].length;if(!n)continue;let need=[];
  if(k==='clean')need=tks.filter(t=>(t.st.clean??100)<55).sort((a,b)=>a.st.clean-b.st.clean);
  else if(k==='feed')need=tks.filter(t=>{const a=t.st.animals;return a.reduce((x,e)=>x+(e.hunger??60),0)/a.length<50;}).sort((a,b)=>a.st.animals.reduce((x,e)=>x+(e.hunger??60),0)/a.st.animals.length-b.st.animals.reduce((x,e)=>x+(e.hunger??60),0)/b.st.animals.length);
  else need=tks.filter(t=>t.st.hum!=null&&HUMT[t.st.type]&&t.st.hum<HUMT[t.st.type]-12);
  if(k==='breed'||k==='lfk'){try{const r=k==='breed'?wingBreed():wingLF();done[k]=(done[k]||0)+r;if(r)staffAt(k,0,k==='breed'?V(WG.x-9.4,WG.y,WG.z-2+Math.random()*4):V(WG.x+20+Math.random()*4,WG.y,WG.z-5.5),k==='breed'?Math.PI/2:0);}catch(e){}continue;}
  need.slice(0,n*2).forEach((tk,i)=>{try{if(k==='clean')clean(tk);else if(k==='feed')feed(tk);else mist(tk);done[k]++;staffGo(k,i%n,tk);}catch(e){}});}
 const tot=done.clean+done.feed+done.mist+(done.breed||0)+(done.lfk||0);if(tot){S.staffLog=S.staffLog||[];S.staffLog.unshift({t:Date.now(),x:`清了 ${done.clean} 缸・餵了 ${done.feed} 缸・噴霧 ${done.mist} 缸${done.breed?'・繁殖場 '+done.breed+' 件事':''}${done.lfk?'・活餌區 '+done.lfk+' 件事':''}`});S.staffLog.length=Math.min(S.staffLog.length,20);markDirty();}}
function staffPay(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;ensureStaff();const now=Date.now();const min=Math.min((now-S.staffT)/60000,360);S.staffT=now;const sal=Math.round(salary()*min);if(!sal)return;
 if(S.money>=sal){S.money-=sal;updMoney();if(S.strike){S.strike=0;toast('👷 薪水付清了，員工回來上班',2600);}}else{if(!S.strike)toast('⚠️ 錢不夠付員工薪水，他們罷工了！有錢後會自動補發',4200);S.strike=1;}markDirty();}
/* ---- 員工小人 ---- */
const SV={};
function staffMesh(k,name){const g=new THREE.Group(),c=STAFF[k].col;const uni=new THREE.MeshStandardMaterial({color:C(c),roughness:.6});
 add(new THREE.CylinderGeometry(.19,.24,.9,12),uni,0,.7,0,g);add(new THREE.CylinderGeometry(.2,.2,.08,12),new THREE.MeshStandardMaterial({color:C(0x2a2e33)}),0,.27,0,g);
 add(new THREE.SphereGeometry(.16,14,10),new THREE.MeshStandardMaterial({color:C(0xf0d0b0),roughness:.7}),0,1.3,0,g);const cap=add(new THREE.CylinderGeometry(.17,.17,.08,14),uni,0,1.43,0,g);add(new THREE.BoxGeometry(.2,.02,.12),uni,0,1.4,-.14,g);
 const tool=new THREE.Group();tool.position.set(.26,.9,-.05);g.add(tool);
 if(k==='clean'){add(cylBetween(V(0,0,0),V(0,-.8,0),.015,.015),new THREE.MeshStandardMaterial({color:C(0xd8b060)}),0,0,0,tool);add(new THREE.BoxGeometry(.25,.06,.08),new THREE.MeshStandardMaterial({color:C(0x3a7ad8)}),0,-.82,0,tool);}
 else if(k==='feed'){add(new THREE.CylinderGeometry(.08,.07,.14,10),new THREE.MeshStandardMaterial({color:C(0xd84a2a)}),0,-.1,0,tool);}
 else{add(new THREE.CylinderGeometry(.05,.05,.22,10),new THREE.MeshStandardMaterial({color:C(0xe8e8f0),transparent:true,opacity:.8}),0,-.05,0,tool);add(new THREE.BoxGeometry(.05,.06,.08),new THREE.MeshStandardMaterial({color:C(0x7a3aff)}),0,.08,-.03,tool);}
 const cv=document.createElement('canvas');cv.width=300;cv.height=70;const x=cv.getContext('2d');x.fillStyle='rgba(8,18,28,.7)';x.fillRect(0,6,300,58);x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='700 30px "PingFang TC",sans-serif';x.fillText(STAFF[k].n.split(' ')[0]+' '+name,150,36);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));sp.scale.set(.95,.22,1);sp.position.y=1.75;sp.renderOrder=19;g.add(sp);g.visible=false;g.userData.dyn=1;scene.add(g);return{g,tool,ph:Math.random()*6};}
function staffSync(){const s=ensureStaff();for(const k in STAFF){SV[k]=SV[k]||[];while(SV[k].length>s[k].length){const o=SV[k].pop();scene.remove(o.g);}s[k].forEach((w,i)=>{if(!SV[k][i])SV[k][i]=staffMesh(k,w.n);});}}
function tankFront(tk){const s=tk.slot,d=(SZ[s.sz]&&SZ[s.sz].d)||1;const f=s.f;return{x:s.wall.x+f.x*(d+.9),y:(s.fy||s.wall.y||0),z:s.wall.z+f.z*(d+.9),yaw:Math.atan2(f.x,f.z)};}
function staffGo(k,i,tk){staffSync();const o=SV[k]&&SV[k][i];if(!o)return;const p=tankFront(tk);o.g.visible=true;o.tgt=p;o.work=4;if(!o.placed||Math.hypot(o.g.position.x-p.x,o.g.position.z-p.z)>8||Math.abs(o.g.position.y-p.y)>1){o.g.position.set(p.x,p.y,p.z);o.placed=1;}}
function staffAt(k,i,p,yaw){staffSync();const o=SV[k]&&SV[k][i];if(!o)return;o.g.visible=true;o.tgt={x:p.x,y:p.y,z:p.z,yaw:yaw||0};o.work=4;if(!o.placed||Math.hypot(o.g.position.x-p.x,o.g.position.z-p.z)>8||Math.abs(o.g.position.y-p.y)>1){o.g.position.set(p.x,p.y,p.z);o.placed=1;}}
/* 繁殖助理：二樓新翼繁殖場 */
function wingBreed(){if(typeof ensureBF!=='function')return 0;const b=ensureBF();let n=0;const mid=a=>Math.round((a[0]+a[1])/2);
 for(let i=0;i<boxN();i++){const x=b.box[i];if(x.st==='idle')continue;const r=BRE[x.sp];const tg=x.st==='cool'?r.coolT:r.T;if(x.T!==mid(tg)){x.T=mid(tg);n++;}if(r.H&&x.st!=='cool'&&!inR(x.H,r.H)){x.H=Math.round(mid(r.H)/5)*5;n++;}
  if(x.st==='gest'&&!x.trig&&r.need.some(q=>NEED[q].act)){x.trig=1;n++;}if(r.need.includes('ca')&&b.ca<=0&&S.money>=600){if(pay(300,'鈣粉')){b.ca+=5;n++;}}}
 for(let q=b.eggs.length-1;q>=0;q--){const e=b.eggs[q];if(!e.cand&&Date.now()-e.t0>60e3){e.cand=1;n++;}if(e.cand&&!e.fert){b.eggs.splice(q,1);n++;}}
 for(const k of['A','B']){const es=b.eggs.filter(e=>(e.box||'A')===k);if(!es.length)continue;const h=Math.round(es.reduce((a,e)=>a+mid(BRE[e.sp].inc.H),0)/es.length/5)*5;if(b.inc[k].H!==h){b.inc[k].H=h;n++;}
  const lo=Math.max(...es.map(e=>BRE[e.sp].inc.T[0])),hi=Math.min(...es.map(e=>BRE[e.sp].inc.T[1]));if(lo<=hi&&!inR(b.inc[k].T,[lo,hi])){b.inc[k].T=Math.round((lo+hi));b.inc[k].T/=2;n++;}}
 for(const k in b.jel){const j=b.jel[k];if((j.eph.length||j.pol)&&(!j.fedT||Date.now()-j.fedT>150e3)){const need=Math.max(1,Math.ceil((j.pol+j.eph.length)/6));const L=S.lf;if(L&&L.st.nau>=need){L.st.nau-=need;}else if(S.stock.brine>=need){S.stock.brine-=need;}else continue;j.fedT=Date.now();for(const e of j.eph)e.f=Date.now();n++;}}
 if(n){markDirty();if(typeof bfVis==='function')bfVis();}return n;}
/* 活餌員：二樓新翼活餌區 */
function wingLF(){if(typeof ensureLF!=='function')return 0;const L=ensureLF();let n=0;const A=lfAct;
 L.br.forEach((c,i)=>{if(c.st==='ready'){A.brHarvest(i);n++;}else if(c.st==='idle'&&L.cy>0){A.brStart(i,0);n++;}else if(c.st==='hatch'){c.sal=28;c.T=28;c.air=1;}});if(L.cy<=0&&S.money>=1000&&L.br.some(c=>c.st==='idle')){A.cyst();n++;}
 const P=L.pl;P.light=1;if(P.alg>1){A.plThin();n++;}if(P.fert<=0&&P.alg<.5&&S.money>=500){A.plFert();n++;}if(P.roti>90){A.plHarvest('roti');n++;}if(P.cope>70){A.plHarvest('cope');n++;}
 const R=L.cr;if(R.ad>0){if(R.food<1.5){A.crFood();n++;}if(R.moist<60){A.crSpray();n++;}if(R.clean<55){A.crClean();n++;}if(R.ad>140){if(S.stock.veg>=3)A.crGut();A.crHarvest();n++;}}
 const W=L.sw;if(W.lar||W.bee||W.cups.length){if(W.bran<1){A.swBran();n++;}if(W.lar>30&&W.cups.length<10){A.swCup();n++;}if(W.lar>90){A.swHarvest();n++;}}
 if(L.ff.v.length){L.ff.T=24;const prod=L.ff.v.filter(v=>v.t>=6&&v.t<=14).length,young=L.ff.v.filter(v=>v.t<6).length;if(prod&&young<2&&L.ff.v.length<8&&S.money>=300){A.ffNew();n++;}A.ffHarvest();}
 const M=L.ms;if(M.trio){if(M.clean<60){A.msClean();n++;}if(M.lit.some(l=>l.t>=4)){A.msHarvest(1);n++;}}
 if(n){markDirty();if(typeof lfVis==='function')lfVis();}return n;}
function staffIdle(){staffSync();const tks=Object.values(TANKS).filter(t=>t.st&&t.slot);if(!tks.length)return;for(const k in SV)SV[k].forEach(o=>{if(o.work>0)return;if(k==='breed'||k==='lfk'){if(!o.placed)staffAt(k,0,k==='breed'?V(WG.x-9.4,WG.y,WG.z):V(WG.x+20,WG.y,WG.z-5.5),k==='breed'?Math.PI/2:0);return;}const tk=tks[Math.random()*tks.length|0];o.tgt=tankFront(tk);o.g.visible=true;if(!o.placed){o.g.position.set(o.tgt.x,o.tgt.y,o.tgt.z);o.placed=1;}});}
globalAnims.push((t,dt)=>{for(const k in SV)for(const o of SV[k]){if(!o.tgt||!o.g.visible)continue;const g=o.g,T=o.tgt;const dx=T.x-g.position.x,dz=T.z-g.position.z,d=Math.hypot(dx,dz);
 if(Math.abs(T.y-g.position.y)>1||d>8){g.position.set(T.x,T.y,T.z);}else if(d>.05){const sp=Math.min(d,1.4*dt);g.position.x+=dx/d*sp;g.position.z+=dz/d*sp;g.rotation.y=Math.atan2(-dx,-dz);o.ph+=dt*9;g.children[0].position.y=.7+Math.abs(Math.sin(o.ph))*.04;}
 else{g.rotation.y=T.yaw;if(o.work>0){o.work-=dt;o.tool.rotation.x=Math.sin(t*6)*.6;}else o.tool.rotation.x=0;}}});
/* ---- 介面 ---- */
function staffSheet(){const s=ensureStaff();sheet('👷 員工管理',`<div class="mut sm" style="margin-bottom:6px">員工每 30 秒巡一次館，每人每次照顧 2 個最需要的缸。薪水每分鐘從金幣扣，現在總共 <b>${fmt$(salary())}/分鐘</b>${S.strike?'・<span style="color:#ff8a8a">⚠️ 罷工中（錢不夠）</span>':''}。</div>`+
 Object.entries(STAFF).map(([k,r])=>`<div class="res"><div><b>${r.n}</b> <span class="mut">${s[k].length}/${r.max} 人</span></div><div class="mut sm">${r.d}<br>雇用 ${fmt$(r.cost)}・薪水 ${fmt$(r.sal)}/分鐘${s[k].length?'<br>👤 '+s[k].map(w=>w.n).join('、'):''}</div><div style="display:flex;flex-direction:column;gap:4px">${s[k].length<r.max?`<button class="btn sm feed" data-h="${k}">雇用</button>`:''}${s[k].length?`<button class="btn sm" data-f="${k}">解雇</button>`:''}</div></div>`).join('')+
 `<h4 style="margin:10px 0 4px">📋 工作紀錄</h4>`+((S.staffLog||[]).slice(0,8).map(l=>`<div class="row2"><span class="sm">${l.x}</span><span class="mut sm">${agoT(Date.now()-l.t)}</span></div>`).join('')||'<div class="mut sm">還沒有紀錄。</div>'),
 c=>{c.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{const k=b.dataset.h,r=STAFF[k];if(!pay(r.cost,r.n))return;const used=new Set(Object.values(s).flat().map(w=>w.n));const nm=NAMES.find(n=>!used.has(n))||'小幫手';s[k].push({n:nm,t:Date.now()});markDirty();staffSync();staffIdle();_toZ(`👷 雇用了${r.n.split(' ')[1]}「${nm}」，他會開始在館裡巡缸`,3200);staffSheet();});
  c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f;const w=s[k].pop();markDirty();staffSync();_toZ(`👋 ${w.n} 離職了`,2200);staffSheet();});});}
const _msZ=mapSheet;mapSheet=function(){_msZ();if(typeof VISIT!=='undefined'&&VISIT)return;const c=$('#shC');if(!c)return;const b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:6px';b.textContent=`👷 員工管理（${staffN()} 人・${fmt$(salary())}/分）`;b.onclick=staffSheet;c.insertBefore(b,c.children[2]||null);};
/* 員工也算設施分數 */
const _mSc=mScore;mScore=function(){const r=_mSc();const n=staffN();r.score+=n*4;r.facS+=n*4;return r;};
setInterval(staffWork,30000);setInterval(staffPay,60000);setInterval(staffIdle,20000);setTimeout(()=>{if(loaded&&!(typeof VISIT!=='undefined'&&VISIT)){ensureStaff();staffPay();staffSync();staffIdle();}},5000);

