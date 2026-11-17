/* ===== h.js：經濟系統（金幣、商店、送貨區倉庫、設備升級、賣餌料、賣動物） ===== */
const PRICE={guppy:30,neon:120,angel:180,clown:150,btang:400,ytang:300,chromis:200,seahorse:250,moon:80,nettle:150,gecko:300,beardie:600,tortoise:2500,python:900,horned:250,dart:400,crested:450,cham:800,
 koi:500,pturtle:300,ltort:2000,arapaima:6000,arowana:1200,piranha:900,motoro:1500,rtc:2000,discus:300,cardinal:150,whale:50000,manta:20000,shark:8000,turtle:10000,grouper:9000,jack:4000,sardine:3000};
const BUILD_COST={S:300,M:800,L:2000,C:1200,T:9000,XL:30000,U:25000,R:15000,PD:2500,PEN:2500};
const SELL={pellet:5,insect:4,brine:6,veg:8,mouse:40};
const UPG={prod:{n:'🧪 活餌培養設備',d:'飼料與活餌的自動生產速度',lv:[1,1.6,2.5,4,6],cost:[0,2000,6000,15000,40000],fmt:v=>`速度 ×${v}`},
 cap:{n:'🏗 倉庫擴建',d:'每種庫存的上限',lv:[1,2,4,8,15],cost:[0,1500,5000,12000,30000],fmt:v=>`上限 ×${v}`},
 yield:{n:'🧺 收成效率',d:'手動收成的數量，冷卻也會變短',lv:[1,1.5,2,3,4],cost:[0,1000,4000,10000,25000],fmt:v=>`收成 ×${v}`},
 ship:{n:'🚚 物流車隊',d:'訂購的動物送到倉庫所需時間',lv:[60,35,15,5],cost:[0,1500,5000,12000],fmt:v=>`${v} 秒送達`},
 inc:{n:'🥚 孵化器',d:'蛋的孵化速度',lv:[1,1.5,2.5],cost:[0,3000,9000],fmt:v=>`速度 ×${v}`}};
function ensureEco(){if(S.money==null){S.money=5000;setTimeout(()=>toast('💰 新系統：你有 5,000 金幣，可以在商店買動物、在倉庫賣餌料、升級設備',5200),2500);}S.up=S.up||{};for(const k in UPG)if(!S.up[k])S.up[k]=1;S.orders=S.orders||[];S.wh=S.wh||[];}
const upv=k=>UPG[k].lv[((S.up&&S.up[k])||1)-1];
const capOf=k=>Math.round(STOCKDEF[k].cap*upv('cap'));
const cdOf=k=>STOCKDEF[k].cd*[1,.85,.7,.55,.4][((S.up&&S.up.yield)||1)-1];
const fmt$=n=>'$'+Math.round(n).toLocaleString('en-US');
function pay(n,what){ensureEco();if(S.inf){updMoney();return true;}if(S.money<n){toast(`金幣不夠：${what}要 ${fmt$(n)}，你有 ${fmt$(S.money)}。去倉庫賣餌料或賣出繁殖的寶寶吧`,3800);return false;}S.money-=n;markDirty();updMoney();return true;}
function earn(n){ensureEco();S.money+=n;markDirty();updMoney();}
function updMoney(){const c=document.getElementById('moneyChip');if(c)c.textContent=S.inf?'💰 ∞':'💰 '+fmt$(S.money||0);}

/* ---------- 商店 ---------- */
function order(sp){const p=PRICE[sp]||100;if(!pay(p,SP[sp].n))return;S.orders.push({sp,eta:Date.now()+upv('ship')*1000});toast(`🛒 已訂購 ${SP[sp].n}（${fmt$(p)}），約 ${upv('ship')} 秒後送達倉庫`,3200);}
function shopSheet(tab='ani'){ensureEco();const tabs=`<div style="display:flex;gap:6px;margin-bottom:8px"><button class="chip ${tab==='ani'?'on':''}" data-t="ani">動物</button><button class="chip ${tab==='up'?'on':''}" data-t="up">設備升級</button></div><div class="row2" style="margin-bottom:6px"><span class="mut">持有 ${S.inf?'∞ 無限':fmt$(S.money)}</span><button class="btn sm" id="infT" style="${S.inf?'background:var(--acc);color:#04131c':''}">♾ 無限金錢：${S.inf?'開':'關'}</button></div>`;
 let body='';if(tab==='ani'){for(const [h,ht] of Object.entries(HT)){const list=Object.entries(SP).filter(([k,p])=>p.hab===h);if(!list.length)continue;body+=`<h4>${ht.n}</h4>`+list.map(([k,p])=>`<div class="row2"><span>${p.n} <span class="mut sm">${p.z.split('，')[0].split('（')[0]}</span></span><button class="btn sm ${!S.inf&&S.money<(PRICE[k]||100)?'dis':''}" data-b="${k}">${fmt$(PRICE[k]||100)}</button></div>`).join('');}}
 else body=Object.entries(UPG).map(([k,u])=>{const lv=S.up[k],max=u.lv.length,cur=u.fmt(u.lv[lv-1]),nx=lv<max?u.fmt(u.lv[lv]):null;return`<div class="res"><div><b>${u.n}</b> <span class="mut">Lv.${lv}/${max}</span></div><div class="mut sm">${u.d}</div><div class="sm">${cur}${nx?` → <span style="color:var(--acc)">${nx}</span>`:'（已滿級）'}</div>${nx?`<button class="btn sm ${!S.inf&&S.money<u.cost[lv]?'dis':''}" data-u="${k}">升級 ${fmt$(u.cost[lv])}</button>`:'<span></span>'}</div>`;}).join('');
 sheet('🛒 商店',tabs+body,c=>{c.querySelector('#infT').onclick=()=>{S.inf=!S.inf;markDirty();updMoney();toast(S.inf?'♾ 無限金錢已開啟：買東西、升級、基因編輯都免費':'無限金錢已關閉，回到原本的金幣',3000);shopSheet(tab);};c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>shopSheet(b.dataset.t));c.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{order(b.dataset.b);shopSheet('ani');});
  c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const k=b.dataset.u,u=UPG[k],lv=S.up[k];if(!pay(u.cost[lv],u.n))return;S.up[k]=lv+1;toast(`⬆ ${u.n} 升到 Lv.${lv+1}：${u.fmt(u.lv[lv])}`,3000);shopSheet('up');});});}

/* ---------- 倉庫（待安置動物、運送中、庫存買賣） ---------- */
function placeIn(item,tk){const i=S.wh.indexOf(item);if(i<0)return;S.wh.splice(i,1);const e=newAnimal(tk,item.sp,{size:item.baby?.35:.85,g:item.g,sex:item.sex,name:item.name});logEv(tk.st,`${e.name} 從倉庫放入`);markDirty();refreshChips();toast(`📦 ${e.name} 已放進「${tk.st.name||HT[tk.st.type].n}」`);}
function whSheet(){ensureEco();tickStock();const now=Date.now();
 const items=S.wh.map((it,i)=>{const dests=Object.values(TANKS).filter(k=>spOK(it.sp,k)&&used(k)+SP[it.sp].cost<=SZ[k.sz].cap);return`<div class="res"><div><b>📦 ${it.baby?'🍼 ':''}${SP[it.sp].n}${it.sex?' '+it.sex:''}</b>${it.g&&gTag(it)?' <span class="sm" style="color:var(--acc)">'+gTag(it)+'</span>':''} <span class="mut">${HT[SP[it.sp].hab].n}</span></div><div class="mut sm">${dests.length?'可放入：'+dests.map(k=>esc(k.st.name||HT[k.st.type].n)).slice(0,3).join('、'):'沒有適合的展缸，先設置一個'+HT[SP[it.sp].hab].n}</div><div style="display:flex;gap:6px;grid-column:2;grid-row:1/3"><button class="btn sm" data-p="${i}">放入</button><button class="btn sm" data-r="${i}">轉賣 ${fmt$(whVal(it))}</button></div></div>`;}).join('')||'<div class="mut sm">倉庫裡沒有待安置的動物。去 🛒 商店訂購吧。</div>';
 const ords=S.orders.map(o=>`<div class="row2"><span>🚚 ${SP[o.sp].n}</span><span class="mut sm">${Math.max(0,Math.ceil((o.eta-now)/1000))} 秒後送達</span></div>`).join('');
 const stock=Object.entries(STOCKDEF).map(([k,d])=>`<div class="row2"><span>${d.ic} ${d.n} <b>${S.stock[k]}</b><span class="mut sm">/${capOf(k)}・單價 $${SELL[k]}</span></span><span style="display:flex;gap:6px"><button class="btn sm" data-s="${k}" data-n="10">賣 10</button><button class="btn sm" data-s="${k}" data-n="all">全賣</button></span></div>`).join('');
 sheet('📦 倉庫・送貨區',`<div class="mut" style="margin-bottom:6px">持有 ${fmt$(S.money)}</div><div style="display:flex;gap:6px;margin-bottom:6px"><button class="btn" id="wShop">🛒 商店</button><button class="btn" id="wUp">⬆ 升級設備</button></div><h4>待安置的動物</h4>${items}${ords?'<h4>運送中</h4>'+ords:''}<h4>餌料庫存（直接賣出換金幣）</h4>${stock}`,c=>{
  c.querySelector('#wShop').onclick=()=>shopSheet('ani');c.querySelector('#wUp').onclick=()=>shopSheet('up');
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,n=b.dataset.n==='all'?S.stock[k]:Math.min(10,S.stock[k]);if(!n){toast('沒有庫存可以賣');return;}S.stock[k]-=n;earn(n*SELL[k]);toast(`💰 賣出 ${STOCKDEF[k].n} ×${n}，獲得 ${fmt$(n*SELL[k])}`);whSheet();});
  c.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const it=S.wh[+b.dataset.r];if(!it)return;S.wh.splice(+b.dataset.r,1);const v=whVal(it);earn(v);toast(`轉賣 ${SP[it.sp].n}，拿回 ${fmt$(v)}`);whSheet();});
  c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const it=S.wh[+b.dataset.p];if(!it)return;const dests=Object.values(TANKS).filter(k=>spOK(it.sp,k)&&used(k)+SP[it.sp].cost<=SZ[k.sz].cap);
   if(!dests.length){toast(`沒有可以放 ${SP[it.sp].n} 的展缸（要${HT[SP[it.sp].hab].n}${SP[it.sp].min?'、'+SZ[SP[it.sp].min].n+'以上':''}，而且空間要夠）`,3800);return;}
   sheet(`把 ${SP[it.sp].n} 放到…`,dests.map(k=>`<button class="opt" data-to="${k.slot.id}"><b>${esc(k.st.name||HT[k.st.type].n)}</b><span class="mut">${SZ[k.sz].n}・空間 ${used(k)}/${SZ[k.sz].cap}・🌡 ${k.st.temp}°C</span></button>`).join(''),c2=>c2.querySelectorAll('[data-to]').forEach(x=>x.onclick=()=>{placeIn(it,TANKS[x.dataset.to]);whSheet();}));});});}

/* ---------- 改寫：設置展缸要花錢、加入動物改成購買或從倉庫放入、可賣出動物 ---------- */
const _setup0=setupSheet;setupSheet=function(s){_setup0(s);ensureEco();const cost=BUILD_COST[s.sz]||500;$('#shT').textContent+=`（${fmt$(cost)}）`;
 $('#shC').querySelectorAll('.opt').forEach(b=>{const f=b.onclick;b.insertAdjacentHTML('beforeend',`<span class="sm" style="color:var(--warn)">建造費 ${fmt$(cost)}・持有 ${fmt$(S.money)}</span>`);b.onclick=()=>{if(pay(cost,'這個展缸'))f();};});};
const _mg0=manage;manage=function(s){_mg0(s);ensureEco();const tk=TANKS[s.id];if(!tk)return;
 $('#shC').querySelectorAll('[data-sp]').forEach(b=>{const k=b.dataset.sp,inWh=S.wh.filter(i=>i.sp===k);const full=b.classList.contains('dis');
  b.innerHTML=`${inWh.length?'📦 放入':'🛒 '+fmt$(PRICE[k]||100)} ${SP[k].n} <span class="mut">${SP[k].cost} 格${inWh.length?'・倉庫有 '+inWh.length:''}</span>`;
  b.onclick=()=>{if(full){toast('空間不夠了，換大一點的展缸吧');return;}if(inWh.length){placeIn(inWh[0],tk);manage(s);}else{order(k);manage(s);}};});
 const h=[...$('#shC').querySelectorAll('h4')].find(x=>/加入動物/.test(x.textContent));if(h)h.textContent='加入動物（花金幣訂購，送到倉庫後放入；倉庫有的會直接放進來）';};
const sellPrice=e=>Math.round((PRICE[e.sp]||100)*(SP[e.sp].school?.7:(.25+.75*clamp((e.size-.3)/.7,0,1)))*(1+(e.bond||0)/500+((e.mood||50)>80?.1:0))*(e.g?geneMul(e.g):1));
$('#pSell').onclick=()=>{if(!sel)return;const e=sel.entry,b=$('#pSell'),v=sellPrice(e);if(!b.dataset.c){b.dataset.c=1;b.textContent=`確認賣 ${fmt$(v)}`;setTimeout(()=>{b.dataset.c='';b.textContent='賣出';},3000);return;}
 const tk=sel.tk,cr=tk.creatures.find(k=>k.entry===e);if(cr){cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}tk.st.animals.splice(tk.st.animals.indexOf(e),1);logEv(tk.st,`${e.name} 賣出（${fmt$(v)}）`);earn(v);refreshChips();
 $('#pick').style.display='none';sel=null;b.dataset.c='';b.textContent='賣出';toast(`💰 賣出 ${e.name}，獲得 ${fmt$(v)}`);};

/* ---------- 倉庫建築與送貨卡車（戶外東側） ---------- */
(function(){const wx=30,wz=48;const wall=new THREE.MeshStandardMaterial({color:C(0x8a9096),roughness:.6,metalness:.3,normalMap:rep(scaleN,20,6),normalScale:new THREE.Vector2(.15,.15)}),dark=new THREE.MeshStandardMaterial({color:C(0x2a2e33),roughness:.4,metalness:.6});
 const fl=add(new THREE.PlaneGeometry(10,10),new THREE.MeshStandardMaterial({color:C(0x9a9a96),roughness:.7}),wx,.008,wz);fl.rotation.x=-Math.PI/2;
 box(10.2,4.5,.2,wall,wx,2.25,wz+5);box(10.2,4.5,.2,wall,wx,2.25,wz-5);box(.2,4.5,10,wall,wx+5,2.25,wz);box(.2,4.5,2,wall,wx-5,2.25,wz-4);box(.2,4.5,2,wall,wx-5,2.25,wz+4);box(.2,1.3,6,wall,wx-5,3.85,wz);
 box(10.6,.25,10.6,dark,wx,4.6,wz);for(let z=-4;z<=4;z+=2)box(.14,.14,10,dark,wx,4.4,wz+z).rotation.y=Math.PI/2;
 box(.3,3.4,.3,new THREE.MeshStandardMaterial({color:C(0xe8c030)}),wx-5.05,1.7,wz-3);box(.3,3.4,.3,new THREE.MeshStandardMaterial({color:C(0xe8c030)}),wx-5.05,1.7,wz+3);
 const sg=add(new THREE.PlaneGeometry(4.2,.9),new THREE.MeshBasicMaterial({map:vText([['📦 倉庫・送貨區',56,.42],['WAREHOUSE & DELIVERY',24,.83,'#ffd27a']],700,150,'#1a1a10','#f6efe0')}),wx-5.12,3.9,wz);sg.rotation.y=-Math.PI/2;
 for(const [x,z] of[[-2,-3.5],[2,-3.5],[0,3.6]])glow(wx+x,4.2,wz+z,1.6,0xfff4e0,.7);
 const shelfM=new THREE.MeshStandardMaterial({color:C(0x3a5a8a),roughness:.5,metalness:.4});for(const z of[-3,0,3]){box(1.2,.06,2.4,shelfM,wx+4,1,wz+z);box(1.2,.06,2.4,shelfM,wx+4,2.2,wz+z);for(const dz of[-1.15,1.15])for(const dx of[-.55,.55])box(.06,2.6,.06,shelfM,wx+4+dx,1.3,wz+z+dz);}
 const crateM=new THREE.MeshStandardMaterial({color:C(0xb88a50),roughness:.8,normalMap:rep(scaleN,1,6),normalScale:new THREE.Vector2(.3,.3)});const crates=[];
 for(let i=0;i<12;i++){const sh=Math.floor(i/4),lv=(i%4)<2?1:2.2,c=box(.6,.5,.7,crateM,wx+4,lv+.3,wz-3+sh*3+((i%2)?.45:-.45));c.visible=false;crates.push(c);}
 for(let i=0;i<6;i++){const s=add(new THREE.CylinderGeometry(.3,.34,.7,12),new THREE.MeshStandardMaterial({color:C([0xd8c8a0,0xc0a878][i%2]),roughness:1}),wx-2+(i%3)*.7,.35,wz-4+Math.floor(i/3)*.7);}
 OBST.push([wx-5.15,wx+5.15,wz+4.85,wz+5.15],[wx-5.15,wx+5.15,wz-5.15,wz-4.85],[wx+4.85,wx+5.15,wz-5,wz+5],[wx-5.15,wx-4.85,wz-5,wz-3],[wx-5.15,wx-4.85,wz+3,wz+5],[wx+3.3,wx+4.7,wz-4.3,wz+4.3],[wx-2.4,wx,wz-4.4,wz-3.2]);
 const truck=new THREE.Group();scene.add(truck);const tcol=new THREE.MeshStandardMaterial({color:C(0x2f7ad0),roughness:.35,metalness:.3}),tw=new THREE.MeshStandardMaterial({color:C(0xf2f2f2),roughness:.5});
 box(2.2,2.2,4.2,tw,0,1.6,-.6,truck);box(2.2,1.6,1.6,tcol,0,1.3,2.4,truck);const ws=add(new THREE.PlaneGeometry(1.9,.7),new THREE.MeshPhysicalMaterial({color:0x223344,roughness:.05,metalness:.2}),0,1.7,3.21,truck);
 for(const [x,z] of[[-1.05,-1.8],[1.05,-1.8],[-1.05,2.3],[1.05,2.3]]){const w=add(new THREE.CylinderGeometry(.42,.42,.3,16).rotateZ(Math.PI/2),dark,x,.42,z,truck);}
 const lg=add(new THREE.PlaneGeometry(3,1),new THREE.MeshBasicMaterial({map:vText([['生態館物流',60,.5]],400,130,'#2f7ad0','#ffffff')}),1.11,1.9,-.6,truck);lg.rotation.y=Math.PI/2;
 truck.position.set(37.3,0,104);truck.rotation.y=Math.PI;let tr=null;
 window.__truckGo=()=>{if(!tr)tr={t:0};};
 let acc=0;globalAnims.push((t,dt)=>{if(!loaded)return;ensureEco();acc+=dt;
  if(tr){tr.t+=dt;const T=tr.t;let z;if(T<6)z=104-(104-wz)*sstep(T/6);else if(T<11)z=wz;else z=wz+(104-wz)*sstep(Math.min(1,(T-11)/6));truck.position.z=z;if(T>17)tr=null;}
  if(acc>.5){acc=0;const now=Date.now();let got=[];for(let i=S.orders.length-1;i>=0;i--)if(now>=S.orders[i].eta){got.push(S.orders[i].sp);S.wh.push({sp:S.orders[i].sp});S.orders.splice(i,1);}
   if(got.length){markDirty();window.__truckGo();toast(`🚚 ${got.map(k=>SP[k].n).join('、')} 送達倉庫，去「📦 倉庫」放進展缸吧`,4200);}
   crates.forEach((c,i)=>c.visible=i<S.wh.length);updMoney();}});
 SPOTS.push(['📦 倉庫',()=>Object.assign(player,{x:23,y:0,z:48,yaw:-Math.PI/2,pitch:-.05})]);
 const _bar3=bar;bar=function(){_bar3();if(lvl()!==0||window.__ride)return;if(Math.hypot(player.x-wx,player.z-wz)<7.5){near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent='📦 倉庫・送貨區';$('#bD').textContent=`待安置 ${(S.wh||[]).length} 箱・運送中 ${(S.orders||[]).length}・${fmt$(S.money||0)}`;
  if(lastBtns!=='wh'){lastBtns='wh';const bb=$('#bB');bb.innerHTML='';for(const [t,f,c] of[['倉庫',whSheet,'feed'],['商店',()=>shopSheet('ani'),''],['升級',()=>shopSheet('up'),'']]){const x=document.createElement('button');x.className='btn '+c;x.textContent=t;x.onclick=f;bb.appendChild(x);}}}};})();
const _rc2=refreshChips;refreshChips=function(){_rc2();ensureEco();const ch=$('#chips'),b=document.createElement('button');b.className='chip';b.id='moneyChip';b.style.fontWeight='700';b.onclick=()=>shopSheet('ani');ch.insertBefore(b,ch.children[1]||null);updMoney();};
