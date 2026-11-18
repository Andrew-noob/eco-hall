/* =================================================================
   👷 員工系統：清潔員、飼育員、環境員，自動照顧展缸，看得到他們在館裡工作
   ================================================================= */
const STAFF={
 clean:{n:'🧹 清潔員',d:'自動清缸、擦玻璃、換水（乾淨度低於 55% 的缸）',cost:1500,sal:8,col:0x4aa3ff,max:4},
 feed:{n:'🍽 飼育員',d:'自動餵食飢餓的動物（會用掉倉庫的飼料）',cost:2000,sal:10,col:0x6fd38c,max:4},
 mist:{n:'💦 環境員',d:'自動幫爬蟲缸、鳥園噴霧，維持濕度',cost:1500,sal:8,col:0xb47aff,max:3}};
const HUMT={desert:35,tropical:70,aviary:65,yard:55};
const NAMES=['阿明','小美','阿德','小芬','志豪','雅婷','建宏','佳穎','冠宇','怡君','家豪','欣怡'];
function ensureStaff(){S.staff=S.staff||{clean:[],feed:[],mist:[]};for(const k in STAFF)S.staff[k]=S.staff[k]||[];S.staffT=S.staffT||Date.now();return S.staff;}
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
  need.slice(0,n*2).forEach((tk,i)=>{try{if(k==='clean')clean(tk);else if(k==='feed')feed(tk);else mist(tk);done[k]++;staffGo(k,i%n,tk);}catch(e){}});}
 const tot=done.clean+done.feed+done.mist;if(tot){S.staffLog=S.staffLog||[];S.staffLog.unshift({t:Date.now(),x:`清了 ${done.clean} 缸・餵了 ${done.feed} 缸・噴霧 ${done.mist} 缸`});S.staffLog.length=Math.min(S.staffLog.length,20);markDirty();}}
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
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false}));sp.scale.set(.95,.22,1);sp.position.y=1.75;sp.renderOrder=19;g.add(sp);g.visible=false;scene.add(g);return{g,tool,ph:Math.random()*6};}
function staffSync(){const s=ensureStaff();for(const k in STAFF){SV[k]=SV[k]||[];while(SV[k].length>s[k].length){const o=SV[k].pop();scene.remove(o.g);}s[k].forEach((w,i)=>{if(!SV[k][i])SV[k][i]=staffMesh(k,w.n);});}}
function tankFront(tk){const s=tk.slot,d=(SZ[s.sz]&&SZ[s.sz].d)||1;const f=s.f;return{x:s.wall.x+f.x*(d+.9),y:(s.fy||s.wall.y||0),z:s.wall.z+f.z*(d+.9),yaw:Math.atan2(f.x,f.z)};}
function staffGo(k,i,tk){staffSync();const o=SV[k]&&SV[k][i];if(!o)return;const p=tankFront(tk);o.g.visible=true;o.tgt=p;o.work=4;if(!o.placed||Math.hypot(o.g.position.x-p.x,o.g.position.z-p.z)>8||Math.abs(o.g.position.y-p.y)>1){o.g.position.set(p.x,p.y,p.z);o.placed=1;}}
function staffIdle(){staffSync();const tks=Object.values(TANKS).filter(t=>t.st&&t.slot);if(!tks.length)return;for(const k in SV)SV[k].forEach(o=>{if(o.work>0)return;const tk=tks[Math.random()*tks.length|0];o.tgt=tankFront(tk);o.g.visible=true;if(!o.placed){o.g.position.set(o.tgt.x,o.tgt.y,o.tgt.z);o.placed=1;}});}
globalAnims.push((dt,t)=>{for(const k in SV)for(const o of SV[k]){if(!o.tgt||!o.g.visible)continue;const g=o.g,T=o.tgt;const dx=T.x-g.position.x,dz=T.z-g.position.z,d=Math.hypot(dx,dz);
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
boot();
