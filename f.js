/* ===== f.js：二樓（大樓梯、迴廊、玻璃天橋、2F 珍稀物種館）＋尺寸資料 ===== */
(function(){
const LEN={whale:9,manta:4.4,shark:1.6,turtle:1,grouper:2,jack:.8,sardine:.2,clown:.09,btang:.25,ytang:.18,chromis:.07,neon:.035,guppy:.04,angel:.12,seahorse:.12,moon:.26,nettle:.2,
 gecko:.22,beardie:.5,tortoise:.46,python:1.1,horned:.12,dart:.04,crested:.2,cham:.45,arapaima:2.2,arowana:.8,piranha:.25,motoro:.5,rtc:1,discus:.15,cardinal:.04,koi:.6,pturtle:.2,ltort:.46};
for(const k in LEN)if(SP[k])SP[k].len=LEN[k];

const stoneL=new THREE.MeshStandardMaterial({color:C(0xe2dccf),roughness:.55,normalMap:rep(scaleN,10,10),normalScale:new THREE.Vector2(.05,.05)});
const stoneD=new THREE.MeshStandardMaterial({color:C(0x8e8574),roughness:.55});
const metal=new THREE.MeshStandardMaterial({color:C(0x23272b),roughness:.3,metalness:.75});
const brass=new THREE.MeshStandardMaterial({color:C(0xb08a4a),roughness:.3,metalness:.85});
const rg=new THREE.MeshPhysicalMaterial({color:C(0xe4f4ff),transparent:true,opacity:.14,roughness:.03,envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide});
function rail(x0,z0,x1,z1,y=5.17){const L=Math.hypot(x1-x0,z1-z0),a=Math.atan2(z1-z0,x1-x0);const g=add(new THREE.PlaneGeometry(L,1.02),rg,(x0+x1)/2,y+.52,(z0+z1)/2);g.rotation.y=-a;g.renderOrder=5;
 const b=box(L,.06,.08,brass,(x0+x1)/2,y+1.06,(z0+z1)/2);b.rotation.y=-a;const f=box(L,.05,.05,metal,(x0+x1)/2,y+.03,(z0+z1)/2);f.rotation.y=-a;
 for(let i=0;i<=Math.floor(L/2);i++){const t=i/Math.max(1,Math.floor(L/2));add(new THREE.CylinderGeometry(.025,.025,1.05,8),metal,x0+(x1-x0)*t,y+.52,z0+(z1-z0)*t);}}

/* ---------- 北側迴廊、樓梯平台、玻璃天橋 ---------- */
box(28,.35,1.9,stoneL,0,5,17.5);box(1.6,.35,4.2,stoneL,1,5,20.45);
rail(-11.8,18.45,.2,18.45);rail(1.8,18.45,11.8,18.45);rail(.2,18.45,.2,22.5);rail(1.8,18.45,1.8,20.5);rail(.2,22.5,1.8,22.5);rail(11.8,18.45,11.8,32.6);rail(11.8,34.4,11.8,37.8);rail(-11.8,18.45,-11.8,32.6);rail(-11.8,34.4,-11.8,37.8);rail(-11.8,37.8,11.8,37.8);

for(const z of[32.6,34.4]){box(23.6,.3,.15,metal,0,4.95,z);rail(-11.8,z,11.8,z);}
const bf=new THREE.MeshPhysicalMaterial({color:C(0xcfeaf6),transparent:true,opacity:.22,roughness:.05,envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide});
const bfl=add(new THREE.PlaneGeometry(23.6,1.8),bf,0,5.06,33.5);bfl.rotation.x=-Math.PI/2;bfl.renderOrder=5;for(let x=-11;x<=11;x+=2)box(.06,.06,1.8,metal,x,5.03,33.5);
for(let x=-10;x<=10;x+=5)glow(x,4.85,33.5,.8,0x9fe0ff,.45);
/* ---------- 大樓梯（大廳東側，往北上二樓） ---------- */
/* ---------- 大樓梯（大廳北側，由東往西上二樓，不擋任何門） ---------- */
const XB=12.7,XT=1.6,N=30,TR=(XB-XT)/N,ZC=21.5;
for(let i=0;i<N;i++){const top=(i+1)*5/N,xc=XB-(i+.5)*TR;box(TR,top,2,stoneL,xc,top/2,ZC);box(.04,.03,2,brass,xc-TR/2+.02,top+.01,ZC);}
for(const z of[20.45,22.55]){add(cylBetween(V(XB,1.05,z),V(XT,6.05,z),.035,.035,10),brass);for(let i=0;i<=7;i++){const t=i/7,x=XB+(XT-XB)*t,y=5*t;add(cylBetween(V(x,y,z),V(x,y+1.05,z),.02,.02,6),metal);}
 const gp=new THREE.PlaneGeometry(Math.hypot(XB-XT,5),1);const m=add(gp,rg,(XB+XT)/2,3.05,z);m.rotation.z=Math.atan2(5,XB-XT)*-1;m.rotation.z=-Math.atan2(5,XB-XT);m.renderOrder=5;}
STAIRS.push({ax:'x',x0:XT-.25,x1:XB+.15,z0:20.55,z1:22.45,zb:XB,zt:XT,y0:0,y1:5});
const ss=add(new THREE.PlaneGeometry(2.2,.5),new THREE.MeshBasicMaterial({map:vText([['↑ 2F 飼育後場',48,.5]],420,100,'#0b1a24','#f4efe2')}),13.3,2.2,21.5);ss.rotation.y=-Math.PI/2;


/* =================================================================
   2F 飼育後場（Behind the Scenes）：監控中心、孵化室、活餌培養室、檢疫育成缸
   ================================================================= */
const labW=new THREE.MeshStandardMaterial({color:C(0xe6eaec),roughness:.8}),steel=new THREE.MeshStandardMaterial({color:C(0xc8ccd0),roughness:.25,metalness:.85});
box(24.4,.48,16.2,new THREE.MeshStandardMaterial({color:C(0x1a1612)}),0,4.76,8);
const f2=add(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({color:C(0xb8bec4),roughness:.18,metalness:.05,envMapIntensity:1.2}),0,5.002,8);f2.rotation.x=-Math.PI/2;
for(const [x,z,w,d] of[[0,12.6,23,.08],[-3.4,8,.08,9],[3.4,8,.08,9]]){const l=add(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color:C(0xe8c030)}),x,5.006,z);l.rotation.x=-Math.PI/2;}
box(.2,4.6,16,labW,-12.1,7.3,8);box(.2,4.6,16,labW,12.1,7.3,8);box(23.6,4.6,.12,labW,0,7.3,15.83).visible=false;
const c2=add(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({color:C(0xf0f2f4),roughness:.9}),0,9.6,8);c2.rotation.x=Math.PI/2;
for(let x=-9;x<=9;x+=4.5)for(let z=3;z<=13;z+=5){const p=add(new THREE.PlaneGeometry(1.6,.6),new THREE.MeshBasicMaterial({color:C(0xf6fbff)}),x,9.58,z);p.rotation.x=Math.PI/2;}
for(const sx of[-1,1]){const g=add(new THREE.PlaneGeometry(8,2.6),glassM,sx*7,7.3,-.02);g.renderOrder=5;box(8.2,.12,.2,steel,sx*7,8.62,-.05);box(8.2,.12,.2,steel,sx*7,5.98,-.05);box(8.4,1.05,.12,labW,sx*7,5.52,.5);box(8.4,.06,.18,steel,sx*7,6.06,.5);}
const l2=new THREE.PointLight(C(0xf4f8ff),1.2,22,1.4);l2.position.set(0,8.8,8);scene.add(l2);
const sgM=new THREE.MeshBasicMaterial({map:vText([['2F 飼育後場',52,.42],['BEHIND THE SCENES',24,.83,'#9fd8ff']],600,124,'#0b1a24','#f4efe2')});
add(new THREE.PlaneGeometry(3.4,.7),sgM,-1,8.85,16.25);add(new THREE.PlaneGeometry(3.4,.7),sgM,-1,8.85,15.85).rotation.y=Math.PI;
/* 中央實驗桌 */
box(6,.08,1.6,steel,0,5.92,8);for(const [x,z] of[[-2.8,7.4],[2.8,7.4],[-2.8,8.6],[2.8,8.6]])box(.08,.9,.08,steel,x,5.45,z);box(5.8,.04,1.4,steel,0,5.35,8);
add(new THREE.CylinderGeometry(.06,.08,.35,12),new THREE.MeshStandardMaterial({color:0x222222,metalness:.5}),-1.5,6.14,8);add(new THREE.CylinderGeometry(.12,.12,.04,16),new THREE.MeshStandardMaterial({color:0x222222}),-1.5,5.98,8);
for(let i=0;i<6;i++){const b=add(new THREE.CylinderGeometry(.05,.06,.16,12),new THREE.MeshPhysicalMaterial({color:C([0x9fe0a0,0xf0c060,0x80c8ff][i%3]),transparent:true,opacity:.55,roughness:.05}),.4+i*.35,6.04,7.7+(i%2)*.4);}
/* ---------- 監控中心 ---------- */
const mcv=document.createElement('canvas');mcv.width=1024;mcv.height=512;const mtex=new THREE.CanvasTexture(mcv);mtex.encoding=THREE.sRGBEncoding;
const mon=add(new THREE.PlaneGeometry(6,3),new THREE.MeshBasicMaterial({map:mtex}),5.5,7.4,15.8);mon.rotation.y=Math.PI;box(6.2,3.2,.08,new THREE.MeshStandardMaterial({color:0x111111,metalness:.6,roughness:.3}),5.5,7.4,15.86);
box(5.6,.06,.9,new THREE.MeshStandardMaterial({color:C(0x2a2e33),roughness:.4}),5.5,5.78,13.9);for(const x of[3,8])box(.06,.75,.8,steel,x,5.39,13.9);
for(const x of[4,5.5,7]){add(new THREE.CylinderGeometry(.22,.22,.06,16),new THREE.MeshStandardMaterial({color:0x222222}),x,5.48,13.1);add(new THREE.CylinderGeometry(.03,.03,.45,8),steel,x,5.24,13.1);}
function drawMonitor(){const x=mcv.getContext('2d'),W=1024,H=512;x.fillStyle='#071218';x.fillRect(0,0,W,H);x.fillStyle='#6fd3ff';x.font='700 34px "PingFang TC","Noto Sans TC",sans-serif';x.fillText('飼育監控中心  MONITOR',30,52);
 x.font='500 18px sans-serif';x.fillStyle='#7a9aa8';x.fillText(new Date().toLocaleTimeString('zh-TW'),W-140,50);
 const rows=Object.keys(TANKS).map(id=>{const tk=TANKS[id],st=tk.st,n=st.animals.length,hg=n?st.animals.filter(e=>e.hunger<35).length:0,env=st.animals.filter(e=>envIssues(st,e).some(s=>/冷|熱|乾|潮/.test(s))).length;return{nm:st.name||HT[st.type].n,st,n,hg,env,bad:hg+env+(st.clean<50?1:0)};}).sort((a,b)=>b.bad-a.bad).slice(0,9);
 x.font='600 22px "PingFang TC","Noto Sans TC",sans-serif';if(!rows.length){x.fillStyle='#9fb4be';x.fillText('還沒有設置任何展缸',30,120);}
 rows.forEach((r,i)=>{const y=100+i*44;x.fillStyle=i%2?'#0b1c24':'#0e222c';x.fillRect(20,y-28,W-40,40);x.fillStyle=r.bad?'#ffb070':'#7ff0b0';x.fillText(r.bad?'●':'●',30,y);x.fillStyle='#e8f2f6';x.fillText(r.nm.slice(0,10),60,y);
  x.fillStyle='#9fb4be';x.fillText(`${r.st.temp}°C${r.st.hum!=null?'  '+Math.round(r.st.hum)+'%':''}`,330,y);x.fillText(`${isAqua(r.st)?'水質':'清潔'} ${Math.round(r.st.clean)}%`,510,y);x.fillText(`${r.n} 筆`,690,y);
  x.fillStyle=r.bad?'#ff9a7a':'#7ff0b0';x.fillText(r.bad?[r.hg?`${r.hg} 餓`:'',r.env?`${r.env} 環境不適`:'',r.st.clean<50?'髒':''].filter(Boolean).join('・'):'正常',790,y);});
 x.fillStyle='#4a6a78';x.font='500 18px sans-serif';x.fillText('點螢幕查看全部展缸、一鍵前往',30,H-18);mtex.needsUpdate=true;}
/* ---------- 孵化室 ---------- */
const incG=new THREE.Group();incG.position.set(-5.5,5,15.3);scene.add(incG);box(1.6,1.9,.7,new THREE.MeshStandardMaterial({color:C(0xf2f2f0),roughness:.5}),0,.95,0,incG);
const incGl=add(new THREE.PlaneGeometry(1.3,1.4),new THREE.MeshPhysicalMaterial({color:C(0xffe8c0),transparent:true,opacity:.25,roughness:.05,emissive:C(0x6a3a10),emissiveIntensity:.4,depthWrite:false}),0,1.05,-.36,incG);incGl.rotation.y=Math.PI;incGl.renderOrder=6;
for(const y of[.55,1.0,1.45])box(1.3,.03,.55,steel,0,y,0,incG);glow(0,1.05,-.2,1.4,0xffb060,.35,incG);
const icv=document.createElement('canvas');icv.width=256;icv.height=64;const itex=new THREE.CanvasTexture(icv);const ilcd=add(new THREE.PlaneGeometry(.5,.125),new THREE.MeshBasicMaterial({map:itex}),0,1.82,-.36,incG);ilcd.rotation.y=Math.PI;
const eggM2=new THREE.MeshStandardMaterial({color:C(0xf3eee2),roughness:.55}),eggsG=new THREE.Group();incG.add(eggsG);
function drawInc(){const x=icv.getContext('2d');x.fillStyle='#08100c';x.fillRect(0,0,256,64);x.fillStyle='#ff9a50';x.font='700 38px monospace';x.fillText(`${S.incT||29}.0°C`,20,46);itex.needsUpdate=true;
 for(let i=eggsG.children.length-1;i>=0;i--)eggsG.remove(eggsG.children[i]);(S.inc||[]).forEach((eg,i)=>{const m=add(new THREE.SphereGeometry(1,14,10).scale(.012,.016,.012),eggM2,-.5+(i%8)*.14,.6+Math.floor(i/8)*.45,0,eggsG);});}
const femaleP=T=>T<=27?.97:T<=28?.85:T<=29?.65:T<=30?.4:T<=31?.15:T<=32?.3:T<=33?.7:.9;
const incDur=T=>8*60*Math.pow(29/T,3);
function incSheet(){ensureStock();const T=S.incT;sheet('孵化器',`<div class="mut sm">守宮、鬆獅蜥、蟒蛇、烏龜都是「溫度決定性別」：孵化溫度會影響寶寶是公還是母，溫度越高孵得越快。</div>
 <div class="envrow"><span>🌡 孵化溫度</span><input type="range" id="iT" min="26" max="34" value="${T}"><b id="iTv">${T}°C</b></div>
 <div class="mut sm" id="iP">預估：${Math.round(femaleP(T)*100)}% ♀・約 ${Math.round(incDur(T)/60)} 分鐘孵化</div><h4>孵化中的蛋</h4>
 ${(S.inc||[]).map(eg=>`<div class="row2"><span>🥚 ${SP[eg.sp].n}${eg.g&&gTag({g:eg.g})?' '+gTag({g:eg.g}):''}（來自 ${esc((S.tanks[eg.from]&&(S.tanks[eg.from].name||HT[S.tanks[eg.from].type].n))||'—')}）</span><span class="mut sm">${Math.round((eg.prog||0)*100)}%</span></div>`).join('')||'<div class="mut sm">目前沒有蛋。爬蟲和烏龜一公一母、心情好就會下蛋，也可以到繁殖區配對，蛋會自動送來這裡。</div>'}`,
 c=>{const r=c.querySelector('#iT');r.oninput=()=>{S.incT=+r.value;c.querySelector('#iTv').textContent=S.incT+'°C';c.querySelector('#iP').textContent=`預估：${Math.round(femaleP(S.incT)*100)}% ♀・約 ${Math.round(incDur(S.incT)/60)} 分鐘孵化`;drawInc();};r.onchange=()=>markDirty();});}
/* ---------- 活餌培養室 ---------- */
const STOCKDEF={pellet:{n:'飼料',cap:99,rate:30,h:15,cd:120,ic:'🟤',act:'配製飼料'},insect:{n:'蟋蟀',cap:99,rate:15,h:20,cd:120,ic:'🦗',act:'收成蟋蟀'},brine:{n:'豐年蝦',cap:99,rate:30,h:15,cd:120,ic:'🦐',act:'收集豐年蝦'},veg:{n:'蔬菜',cap:60,rate:45,h:10,cd:180,ic:'🥬',act:'採收蔬菜'},mouse:{n:'解凍鼠',cap:12,rate:300,h:2,cd:600,ic:'🐁',act:'解凍老鼠'}};
function ensureStock(){if(!S.stock)S.stock={pellet:60,insect:60,brine:40,veg:20,mouse:6};S.cult=S.cult||{};S.inc=S.inc||[];if(S.incT==null)S.incT=29;S.acc=S.acc||{};if(!S.stockT)S.stockT=Date.now();}
function tickStock(){ensureStock();const now=Date.now(),el=Math.min((now-S.stockT)/1000,7*86400);S.stockT=now;const pm=typeof upv==='function'?upv('prod'):1;for(const k in STOCKDEF){const d=STOCKDEF[k];S.acc[k]=(S.acc[k]||0)+el/d.rate*pm;const n=Math.floor(S.acc[k]);if(n>0){S.acc[k]-=n;S.stock[k]=Math.min(capOf(k),S.stock[k]+n);}}}
const cg=new THREE.Group();cg.position.set(11.3,5,3);scene.add(cg);
box(1.2,2.2,3.2,new THREE.MeshStandardMaterial({color:C(0xd8dcde),roughness:.4,metalness:.4}),.15,1.1,0,cg);for(const y of[.5,1.1,1.7])box(1.1,.04,3.1,steel,0,y,0,cg);
for(let i=0;i<4;i++){box(.5,.32,.6,new THREE.MeshPhysicalMaterial({color:C(0xe8e0d0),transparent:true,opacity:.6,roughness:.2}),-.2,.68,-1.2+i*.8,cg);for(let k=0;k<6;k++)add(new THREE.SphereGeometry(.012,6,4),new THREE.MeshStandardMaterial({color:0x4a2a10}),-.2+rnd(-.18,.18),.56,-1.2+i*.8+rnd(-.22,.22),cg);}
for(let i=0;i<5;i++){add(new THREE.ConeGeometry(.09,.32,16).rotateX(Math.PI),new THREE.MeshPhysicalMaterial({color:C(0xf08a3a),transparent:true,opacity:.7,roughness:.05}),-.25,1.32,-1.2+i*.6,cg);glow(-.25,1.32,-1.2+i*.6,.35,0xffa050,.4,cg);}
box(.6,.5,1.2,new THREE.MeshStandardMaterial({color:C(0xf6f6f6),roughness:.3}),-.15,2.0,-.6,cg);for(let i=0;i<6;i++)add(new THREE.SphereGeometry(.06,8,6),new THREE.MeshStandardMaterial({color:C(0x5aa040)}),-.25,1.82,.5+i*.18,cg);
const csg=add(new THREE.PlaneGeometry(1.8,.45),new THREE.MeshBasicMaterial({map:vText([['🦗 活餌培養室',44,.5]],480,120,'#0b1a24','#f4efe2')}),-.6,2.55,0,cg);csg.rotation.y=-Math.PI/2;
function cultSheet(){tickStock();const now=Date.now(),pm=upv('prod'),ym=upv('yield');sheet('活餌培養室',`<div class="mut sm">餵食會消耗庫存，設備會自動生產；手動收成可以一次補一大批。多的可以直接賣掉換金幣。</div><div class="row" style="display:flex;gap:6px;margin:8px 0"><button class="btn" id="cSell">💰 賣出庫存</button><button class="btn" id="cUp">⬆ 升級設備</button></div>`+Object.entries(STOCKDEF).map(([k,d])=>{const cap=capOf(k),cd=Math.max(0,cdOf(k)-(now-(S.cult[k]||0))/1000),h=Math.round(d.h*ym);return`<div class="res"><div><b>${d.ic} ${d.n}</b> <span class="mut">${S.stock[k]}/${cap}</span></div><div class="bars"><i style="width:${S.stock[k]/cap*100}%;background:var(--acc)"></i></div><div class="mut sm">自動生產：每 ${(d.rate/pm)>=60?((d.rate/pm)/60).toFixed(1)+' 分鐘':Math.round(d.rate/pm)+' 秒'} +1・賣價 $${SELL[k]}</div><button class="btn sm ${cd>0?'dis':''}" data-c="${k}">${cd>0?Math.ceil(cd)+' 秒':d.act+' +'+h}</button></div>`;}).join(''),
 c=>{c.querySelector('#cSell').onclick=()=>whSheet();c.querySelector('#cUp').onclick=()=>shopSheet('up');c.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c,d=STOCKDEF[k];if((Date.now()-(S.cult[k]||0))/1000<cdOf(k)){toast('還在培養中，等一下再來');return;}S.cult[k]=Date.now();const h=Math.round(d.h*upv('yield'));S.stock[k]=Math.min(capOf(k),S.stock[k]+h);markDirty();toast(`${d.ic} ${d.act} +${h}`);cultSheet();});});}

/* ---------- 可點的設施 ---------- */
const STATIONS=[{p:V(5.5,7.4,15.8),fn:()=>dashboard()},{p:V(-5.5,6,15.3),fn:()=>incSheet()},{p:V(11.2,6.2,3),fn:()=>cultSheet()}];
const _pick=pick;pick=function(sx,sy){const v=V(0,0,0);for(const s of STATIONS){v.copy(s.p);if(v.distanceTo(camera.position)>7)continue;v.project(camera);if(v.z>1)continue;if(Math.hypot((v.x+1)/2*innerWidth-sx,(1-v.y)/2*innerHeight-sy)<90){s.fn();return;}}_pick(sx,sy);};
function dashboard(){const ids=Object.keys(TANKS);sheet('飼育監控',ids.length?ids.map(id=>{const tk=TANKS[id],st=tk.st,n=st.animals.length,iss=[];const hg=st.animals.filter(e=>e.hunger<35).length;if(hg)iss.push(`${hg} 隻餓了`);const env=st.animals.filter(e=>envIssues(st,e).some(s=>/冷|熱|乾|潮/.test(s))).length;if(env)iss.push(`${env} 隻環境不適`);if(st.clean<50)iss.push(isAqua(st)?'該換水了':'該清潔了');if(st.hum!=null&&st.type==='tropical'&&st.hum<65)iss.push('該噴霧了');
  return`<div class="res"><div><b>${esc(st.name||HT[st.type].n)}</b> <span class="mut">${SZ[tk.sz].n}・${n} 筆</span></div><div class="mut sm">🌡 ${st.temp}°C${st.hum!=null?`・💧${Math.round(st.hum)}%`:''}・${isAqua(st)?'水質':'清潔'} ${Math.round(st.clean)}%</div><div class="sm" style="color:${iss.length?'var(--warn)':'var(--acc)'}">${iss.length?'⚠ '+iss.join('、'):'✓ 一切正常'}</div><button class="btn sm" data-go="${id}">前往</button></div>`;}).join('')+`<h4>庫存</h4><div class="mut sm">${Object.entries(STOCKDEF).map(([k,d])=>`${d.ic}${d.n} ${(S.stock||{})[k]??0}`).join('　')}</div>`:'<div class="mut">還沒有設置任何展缸。</div>',
 c=>c.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{goTo(TANKS[b.dataset.go].slot);$('#sheet').classList.remove('open');}));}
/* ---------- 二樓通行區與展位 ---------- */
AREAS2.push([-11.6,11.6,.9,15.6],[-2.3,.3,15.3,16.9],[-13.75,13.75,16.9,18.3],[12.1,13.75,16.9,39.6],[-13.75,-12.1,16.9,39.6],[-13.75,13.75,38.1,39.6],[-12.1,12.1,32.75,34.25],[.35,1.95,18.2,22.4]);
for(const sx of[-1,1])for(const z of[18.2,23.5,32.5,37.8])OBST2.push([sx>0?13.55:-14.2,sx>0?14.2:-13.55,z-.35,z+.35]);
OBST2.push([-3.1,3.1,7.1,8.9],[-6.4,-4.6,14.9,15.7],[10.6,12,1.3,4.7],[2.6,8.4,13.4,14.4]);
for(const s of[{id:'u1',sz:'M',wall:V(-12,0,4),f:V(1,0,0),fy:5},{id:'u2',sz:'M',wall:V(-12,0,11),f:V(1,0,0),fy:5},{id:'u3',sz:'L',wall:V(12,0,8.6),f:V(-1,0,0),fy:5},
 {id:'u4',sz:'S',wall:V(-9.5,0,16),f:V(0,0,-1),fy:5},{id:'u5',sz:'S',wall:V(12,0,13.3),f:V(-1,0,0),fy:5}]){computeSlot(s);SLOTS.push(s);}
SPOTS.splice(1,0,['2F 後場',()=>Object.assign(player,{x:-1,y:5,z:14.2,yaw:0,pitch:-.05})]);
SPOTS.splice(2,0,['玻璃天橋',()=>Object.assign(player,{x:-8,y:5,z:33.5,yaw:-Math.PI/2,pitch:-.1})]);

/* ---------- 系統：庫存餵食、孵化、性別、轉缸 ---------- */
window.STATIONS=STATIONS;window.tickStock=tickStock;window.ensureStock=ensureStock;window.STOCKDEF=STOCKDEF;window.drawMonitor=drawMonitor;window.drawInc=drawInc;window.incDur=incDur;window.femaleP=femaleP;window.dashboard=dashboard;window.incSheet=incSheet;window.cultSheet=cultSheet;
})();

const _feed0=feed;
feed=function(tk){ensureStock();tickStock();const st=tk.st;if(!st.animals.length){toast('缸裡還沒有動物');return;}const SD=STOCKDEF;
 if(tk.food){const k=(st.type==='seahorse'||st.type==='jelly')?'brine':'pellet',need=['ocean','river'].includes(st.type)?3:1;if(S.stock[k]<need){toast(`${SD[k].n}庫存不足（剩 ${S.stock[k]}），去 2F 活餌培養室收成`,3200);return;}
  const n=tk.food.spawn();if(!n){toast('上一批食物還沒吃完');return;}S.stock[k]-=need;toast(`投入${tk.foodCfg.name}（${SD[k].n}剩 ${S.stock[k]}）`);logEv(st,`餵了${tk.foodCfg.name}`);}
 else{const d={};for(const e of st.animals){const di=SP[e.sp].diet||'';if(di.includes('insect'))d.insect=Math.min(14,(d.insect||0)+(e.sp==='dart'?2:3));if(di.includes('veg'))d.veg=1;if(di.includes('fruit'))d.fruit=1;if(di==='mouse'&&e.hunger<70)d.mouse=1;}
  if(st.animals.every(e=>SP[e.sp].diet==='mouse')&&!d.mouse){toast('球蟒還不餓，牠們一週左右才吃一次');return;}
  const lack=[];if(d.insect){const n=Math.min(d.insect,S.stock.insect);if(n<d.insect)lack.push('蟋蟀');d.insect=n;S.stock.insect-=n;if(!n)delete d.insect;}
  for(const k of['veg','mouse'])if(d[k]){if(S.stock[k]<1){lack.push(SD[k].n);delete d[k];}else S.stock[k]-=1;}
  if(d.fruit&&S.stock.pellet>=1)S.stock.pellet-=1;else if(d.fruit){lack.push('果泥');delete d.fruit;}
  const out=Object.keys(d).length?tk.tfood.spawn(d):[];toast((out.length?`放入 ${out.join('、')}`:'沒有放入食物')+(lack.length?`・${lack.join('、')}庫存不足`:''),3000);if(out.length)logEv(st,`餵了${out.join('、')}`);}
 st.clean=Math.max(0,st.clean-3);markDirty();};
checkBreed=function(tk){ensureStock();const st=tk.st,cap=SZ[tk.sz].cap;const by=k=>st.animals.filter(e=>e.sp===k);
 const gp=by('guppy');if(gp.length>=2&&used(tk)+1<=cap&&gp.reduce((a,e)=>a+e.mood,0)/gp.length>70&&Math.random()<.3){const n=Math.min(cap-used(tk),1+(Math.random()*2|0));for(let i=0;i<n;i++)newAnimal(tk,'guppy',{size:.3,name:'孔雀魚寶寶'});logEv(st,`孔雀魚生了 ${n} 隻寶寶`);toast(`🎉 ${st.name||HT[st.type].n}的孔雀魚生寶寶了！`,3500);}
 const gk=by('gecko');if(gk.length>=2&&gk.some(e=>e.sex==='♀')&&gk.some(e=>e.sex==='♂')&&S.inc.filter(e=>e.from===tk.slot.id).length<2&&gk.reduce((a,e)=>a+e.mood,0)/gk.length>72&&Math.random()<.2){S.inc.push({sp:'gecko',from:tk.slot.id,prog:0},{sp:'gecko',from:tk.slot.id,prog:0});logEv(st,'豹紋守宮下了 2 顆蛋，已送到 2F 孵化器');toast('🥚 豹紋守宮下蛋了！蛋已送到 2F 孵化器',4000);drawInc();}
 for(let i=st.eggs.length-1;i>=0;i--){const eg=st.eggs[i];if(Date.now()>=eg.hatch){if(eg._m)tk.group.remove(eg._m);st.eggs.splice(i,1);newAnimal(tk,eg.sp,{size:.35,name:SP[eg.sp].n+'寶寶'});toast(`🐣 ${SP[eg.sp].n}寶寶孵化了！`);}}
 markDirty();};
const _na0=newAnimal;newAnimal=function(tk,k,o={}){const e=_na0(tk,k,o);if(!SP[k].school&&!e.sex)e.sex=o.sex||(Math.random()<.5?'♀':'♂');return e;};
const _up0=updPick;updPick=function(){_up0();if(!sel)return;const e=sel.entry;if(!SP[e.sp].school){if(!e.sex){e.sex=Math.random()<.5?'♀':'♂';markDirty();}$('#pSt').textContent=e.sex+' '+$('#pSt').textContent;}};
const _rc0=refreshChips;refreshChips=function(){_rc0();const b=document.createElement('button');b.className='chip';b.textContent='📋 監控';b.onclick=()=>dashboard();const ch=$('#chips');ch.insertBefore(b,ch.children[1]||null);};
let incT2=0,monT=0;
let sexed=false;
globalAnims.push((t,dt)=>{if(!loaded)return;ensureStock();if(!sexed){sexed=true;for(const id in S.tanks)for(const e of S.tanks[id].animals)if(!SP[e.sp].school&&!e.sex)e.sex=Math.random()<.5?'♀':'♂';drawInc();}incT2+=dt;monT+=dt;
 if(monT>3){monT=0;tickStock();drawMonitor();}
 if(incT2>2){const step=incT2;incT2=0;let ch=false;for(let i=S.inc.length-1;i>=0;i--){const eg=S.inc[i];eg.prog=(eg.prog||0)+step/incDur(S.incT)*upv('inc');if(eg.prog>=1){S.inc.splice(i,1);ch=true;
   hatchEgg(eg);}}
  if(ch){drawInc();markDirty();}}});
/* 2F 設施：走近就出現按鈕 */
const FAC=[{n:'📋 飼育監控中心',d:'即時查看所有展缸、一鍵前往',p:[5.5,14],fn:()=>dashboard(),b:'打開監控'},{n:'🥚 孵化器',d:'調整孵化溫度、查看孵化進度',p:[-5.5,14.3],fn:()=>incSheet(),b:'打開孵化器'},{n:'🦗 活餌培養室',d:'查看庫存、收成飼料與活餌',p:[10.2,3],fn:()=>cultSheet(),b:'收成／庫存'}];
const _bar1=bar;bar=function(){_bar1();if(lvl()!==1)return;let f=null,bd=3.4;for(const F of FAC){const d=Math.hypot(player.x-F.p[0],player.z-F.p[1]);if(d<bd){bd=d;f=F;}}if(!f)return;
 const s=nearestSlot();if(s&&Math.hypot(player.x-s.view.x,player.z-s.view.z)<bd)return;near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent=f.n;$('#bD').textContent=f.d;
 const key='fac:'+f.n;if(lastBtns!==key){lastBtns=key;const bb=$('#bB');bb.innerHTML='';const x=document.createElement('button');x.className='btn feed';x.textContent=f.b;x.onclick=f.fn;bb.appendChild(x);}};
/* 轉缸 */
$('#pMove').onclick=()=>{if(!sel)return;const e=sel.entry,src=sel.tk,p=SP[e.sp];const dests=Object.values(TANKS).filter(k=>k!==src&&spOK(e.sp,k)&&used(k)+p.cost<=SZ[k.sz].cap);
 sheet(`把 ${e.name} 移到…`,dests.length?dests.map(k=>`<button class="opt" data-to="${k.slot.id}"><b>${esc(k.st.name||HT[k.st.type].n)}</b><span class="mut">${SZ[k.sz].n}・空間 ${used(k)}/${SZ[k.sz].cap}・🌡 ${k.st.temp}°C</span></button>`).join(''):'<div class="mut">沒有可以接收牠的展缸（類型要相符、空間要夠）。</div>',
 c=>c.querySelectorAll('[data-to]').forEach(b=>b.onclick=()=>{const dst=TANKS[b.dataset.to];const cr=src.creatures.find(k=>k.entry===e);if(cr){cr.dispose();src.creatures.splice(src.creatures.indexOf(cr),1);}
  src.st.animals.splice(src.st.animals.indexOf(e),1);dst.st.animals.push(e);spawnAnimal(dst,e);logEv(src.st,`${e.name} 轉到 ${dst.st.name||HT[dst.st.type].n}`);logEv(dst.st,`${e.name} 從 ${src.st.name||HT[src.st.type].n} 轉入`);
  markDirty();refreshChips();$('#sheet').classList.remove('open');$('#pick').style.display='none';sel=null;toast(`${e.name} 搬家完成`);}));};
