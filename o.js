/* ===== o.js：釣具升級、全館地圖傳送、溪流缸水色修正 ===== */

/* ---------- 釣具 ---------- */
const FGEAR={rod:{n:'🎣 釣竿',d:'綠色判定區變寬',lv:['竹竿','碳纖維竿','專業海釣竿','黃金傳說竿'],eff:[1,1.18,1.36,1.6],cost:[0,1500,5000,15000],fmt:v=>`判定區 ×${v}`},
 reel:{n:'🌀 捲線器',d:'拉竿時游標變慢',lv:['基本款','順滑款','電動捲線器','頂級捲線器'],eff:[1,.86,.74,.62],cost:[0,1200,4000,12000],fmt:v=>`游標速度 ×${v}`},
 line:{n:'🧵 釣線',d:'可以失誤的次數變多',lv:['尼龍線','碳纖線','PE 編織線','鋼絲前導'],eff:[3,4,5,6],cost:[0,800,3000,9000],fmt:v=>`可失誤 ${v} 次`},
 sonar:{n:'📡 魚探＋浮標',d:'魚更快上鉤，上鉤後反應時間更長',lv:['普通浮標','夜光浮標','魚群探測器','聲納'],eff:[1,.75,.55,.4],cost:[0,2000,6000,18000],fmt:v=>`等待 ×${v}`}};
function fgv(k){S.fg=S.fg||{rod:1,reel:1,line:1,sonar:1,lure:0};if(k==='win')return[1.6,1.9,2.3,2.8][S.fg.sonar-1];return FGEAR[k].eff[S.fg[k]-1];}
function gearSheet(){S.fg=S.fg||{rod:1,reel:1,line:1,sonar:1,lure:0};ensureEco();
 sheet('🛒 釣具店',`<div class="mut" style="margin-bottom:6px">持有 ${S.inf?'∞':fmt$(S.money)}・高級擬餌 ${S.fg.lure} 個</div>`+Object.entries(FGEAR).map(([k,g])=>{const lv=S.fg[k],nx=lv<4;
  return`<div class="res"><div><b>${g.n}</b> <span class="mut">${g.lv[lv-1]}</span></div><div class="mut sm">${g.d}・${g.fmt(g.eff[lv-1])}${nx?` → <span style="color:var(--acc)">${g.lv[lv]}（${g.fmt(g.eff[lv])}）</span>`:'（已是最高級）'}</div>${nx?`<button class="btn sm" data-g="${k}">升級 ${fmt$(g.cost[lv])}</button>`:'<span></span>'}</div>`;}).join('')+
  `<div class="res"><div><b>🪱 高級擬餌</b> <span class="mut">消耗品</span></div><div class="mut sm">優先使用：稀有魚機率 ×3.5、突變色機率 14%</div><button class="btn sm" data-l="1">10 個 $500</button></div>`,
  c=>{c.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const k=b.dataset.g,g=FGEAR[k],lv=S.fg[k];if(!pay(g.cost[lv],g.n))return;S.fg[k]=lv+1;markDirty();toast(`⬆ ${g.n} 升級成「${g.lv[lv]}」`,2600);gearSheet();});
   c.querySelector('[data-l]').onclick=()=>{if(!pay(500,'擬餌'))return;S.fg.lure+=10;markDirty();toast('🪱 買了 10 個高級擬餌');gearSheet();};});}

/* ---------- 溪流缸：拿掉互相重疊的水體方塊，改成每段一片貼著玻璃的水色 ---------- */
const _st2=DECO.stream;DECO.stream=function(tk){_st2(tk);const g=tk.group,P=tk.pools||[];
 g.children.forEach(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.material&&o.material.transparent&&Math.abs(o.material.opacity-.26)<.01)o.visible=false;});
 const tm=new THREE.MeshBasicMaterial({color:C(0x2e7466),transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
 const panel=(steps,fixed,axis,flip)=>{const s=new THREE.Shape(),f=flip?-1:1;const u0=steps[0][0],u1=steps[steps.length-1][1];s.moveTo(f*u0,0);for(const [a,b,w] of steps){s.lineTo(f*a,w);s.lineTo(f*b,w);}s.lineTo(f*u1,0);s.lineTo(f*u0,0);
  const m=add(new THREE.ShapeGeometry(s),tm,0,0,0,g);m.renderOrder=3;if(axis==='z')m.position.z=fixed;else{m.position.x=fixed;m.rotation.y=Math.PI/2;}if(axis==='z'&&flip)m.rotation.y=Math.PI;return m;};
 const st=(a,b,key)=>P.slice(a,b).map(p=>{const lo=p[key==='x'?'min':'min'][key]-.2,hi=p.max[key]+.2;return[Math.min(lo,hi),Math.max(lo,hi),p.w];});
 if(P.length>=21){const A=st(0,6,'x').sort((a,b)=>a[0]-b[0]);panel(A,-8.66,'z',false);
  const B=st(6,14,'z').sort((a,b)=>b[0]-a[0]).map(([a,b,w])=>[-b,-a,w]).sort((a,b)=>a[0]-b[0]);const sB=new THREE.Shape();sB.moveTo(B[0][0],0);for(const [a,b,w] of B){sB.lineTo(a,w);sB.lineTo(b,w);}sB.lineTo(B[B.length-1][1],0);sB.lineTo(B[0][0],0);
  const mb=add(new THREE.ShapeGeometry(sB),tm,-8.66,0,0,g);mb.rotation.y=Math.PI/2;mb.renderOrder=3;
  const Cc=st(14,20,'x').map(([a,b,w])=>[-b,-a,w]).sort((a,b)=>a[0]-b[0]);const sC=new THREE.Shape();sC.moveTo(Cc[0][0],0);for(const [a,b,w] of Cc){sC.lineTo(a,w);sC.lineTo(b,w);}sC.lineTo(Cc[Cc.length-1][1],0);sC.lineTo(Cc[0][0],0);
  const mc=add(new THREE.ShapeGeometry(sC),tm,0,0,8.66,g);mc.rotation.y=Math.PI;mc.renderOrder=3;}};

/* ---------- 全館地圖傳送 ---------- */
const MAPX=[-41,57],MAPZ=[-38,100];
const DEST=[
 {n:'水族展廳',r:[-12,12,0,16],to:[0,0,9,0]},{n:'大洋廳',r:[-16,16,-20,0],to:[0,0,-6,0]},{n:'大洋水槽',r:[-15,15,-34,-20],to:[0,0,-4,0],c:'#1e5a8a'},
 {n:'大廳',r:[-14,14,16,40],to:[0,0,38.5,0]},{n:'爬蟲館',r:[-36,-14,20,36],to:[-16,0,28,Math.PI/2]},{n:'鯊魚隧道',r:[14,41,26,30],to:[16,0,28,-Math.PI/2],c:'#1e5a8a'},
 {n:'新展廳',r:[41.5,53.6,19.8,36.2],to:[43,0,28,-Math.PI/2]},{n:'溪流館',r:[-38,-16,-22,0],to:[-25,0,-11,Math.PI/2],c:'#2e6a50'},
 {n:'戶外廣場',r:[-38,38,40.7,56],to:[0,0,45,Math.PI],c:'#4a6a3a'},{n:'池塘',r:[-20.5,-11.5,45,51],to:[-16,0,43.4,Math.PI],c:'#2e5a6a'},{n:'放養區',r:[12,20,45,51],to:[16,0,43.4,Math.PI],c:'#6a7a3a'},
 {n:'亞馬遜河',r:[-17.4,17.4,56.4,87.6],to:[0,0,57.2,Math.PI],c:'#2e6a5a',ride:1},{n:'鳥類館',r:[-35.8,-21,62.6,77.4],to:[-28.4,0,60.1,Math.PI],c:'#3a6a3a',round:1},
 {n:'生態農園',r:[20.5,34,62,84],to:[27,0,60.5,Math.PI],c:'#6a5a3a'},{n:'倉庫',r:[25,35,43,63],to:[23,0,48,-Math.PI/2],c:'#5a5a5a'},{n:'商店',r:[-34,-26,45,51],to:[-23,0,48,Math.PI/2],c:'#8a5a2a'}];
const FLOORS=[['2F 飼育後場',[-1,5,14.2,0]],['🧬 基因實驗室',[-3.3,5,11,.35]],['玻璃天橋',[-8,5,33.5,-Math.PI/2]],['🌊 大洋水槽上方',[-13,11.3,-18.3,0]]];
function tpTo([x,y,z,yaw]){if(window.__ride&&typeof endRide==='function')endRide();if(typeof curW==='function'&&curW())endFish();Object.assign(player,{x,y,z,yaw,pitch:y>8?-.35:0});$('#sheet').classList.remove('open');}
function mapSheet(){const W=320,H=Math.round(W*(MAPZ[1]-MAPZ[0])/(MAPX[1]-MAPX[0])),sx=x=>(x-MAPX[0])/(MAPX[1]-MAPX[0])*W,sz=z=>(z-MAPZ[0])/(MAPZ[1]-MAPZ[0])*H;
 const rects=DEST.map((d,i)=>{const [x0,x1,z0,z1]=d.r,X=sx(x0),Y=sz(z0),w=sx(x1)-X,h=sz(z1)-Y;const shape=d.round?`<ellipse cx="${X+w/2}" cy="${Y+h/2}" rx="${w/2}" ry="${h/2}"`:`<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="3"`;
  return`${shape} fill="${d.c||'#2a3a48'}" stroke="#9fd8ff" stroke-width=".8" data-d="${i}" style="cursor:pointer"/><text x="${X+w/2}" y="${Y+h/2+4}" font-size="${w<40?9:11}" fill="#f2f6f8" text-anchor="middle" pointer-events="none">${d.n}</text>`;}).join('');
 const me=curW&&curW()?'':`<circle cx="${sx(player.x)}" cy="${sz(player.z)}" r="5" fill="#ff5050" stroke="#fff" stroke-width="1.5"/>`;
 const svg=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#0b141a;border-radius:10px;touch-action:manipulation"><rect x="${sx(-38)}" y="${sz(40.7)}" width="${sx(38)-sx(-38)}" height="${sz(98)-sz(40.7)}" fill="#1e2e1e"/>${rects}${me}<text x="6" y="${H-6}" font-size="9" fill="#7a9aa8">↑ 北（大洋水槽）・紅點是你的位置</text></svg>`;
 const tanks=SLOTS.filter(s=>S.tanks[s.id]&&!['XL','U','R','ST','AV'].includes(s.sz)).map(s=>`<button class="chip" data-t="${s.id}">${esc(S.tanks[s.id].name||HT[S.tanks[s.id].type].n)}</button>`).join('');
 sheet('🗺 傳送地圖',`<div class="mut sm" style="margin-bottom:6px">點地圖上的區域就會傳送過去</div>${svg}<h4>樓上</h4><div style="display:flex;flex-wrap:wrap;gap:6px">${FLOORS.map((f,i)=>`<button class="chip" data-f="${i}">${f[0]}</button>`).join('')}</div>
  <h4>🎣 釣場</h4><div style="display:flex;flex-wrap:wrap;gap:6px">${Object.entries(FW).map(([k,w])=>`<button class="chip" data-w="${k}">${w.n} <span class="mut sm">${fmt$(tripOf(k)[0])}</span></button>`).join('')}<button class="chip" id="mGear">🛒 釣具店</button></div>${tanks?`<h4>我的展缸</h4><div style="display:flex;flex-wrap:wrap;gap:6px">${tanks}</div>`:''}`,
  c=>{c.querySelectorAll('[data-d]').forEach(e=>e.addEventListener('click',()=>{const d=DEST[+e.dataset.d];tpTo(d.to);toast(`📍 ${d.n}`,1500);if(d.ride&&TANKS.rv)setTimeout(()=>toast('🚣 走到西南角碼頭可以搭船',2500),1600);}));
   c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=FLOORS[+b.dataset.f];tpTo(f[1]);toast(`📍 ${f[0]}`,1500);});
   c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{$('#sheet').classList.remove('open');goFish(b.dataset.w);});c.querySelector('#mGear').onclick=()=>gearSheet();
   c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{$('#sheet').classList.remove('open');goTo(SLOTS.find(s=>s.id===b.dataset.t));});});}
/* 上方標籤整理：只留館藏、金幣、基因、監控，其餘傳送收進地圖 */
const _rc4=refreshChips;refreshChips=function(){_rc4();const ch=$('#chips');const keep=[...ch.children].filter(b=>/^館藏|^💰|^🧬|^📋/.test(b.textContent));ch.innerHTML='';
 const m=document.createElement('button');m.className='chip';m.style.fontWeight='700';m.textContent='🗺 地圖';m.onclick=()=>mapSheet();
 keep.forEach((b,i)=>{ch.appendChild(b);if(i===0)ch.appendChild(m);});if(!keep.length)ch.appendChild(m);};

