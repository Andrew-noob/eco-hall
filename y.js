/* =================================================================
   📜 館長主線任務、⭐ 生態館星等、🎟 門票收入、🐟 漁獲價格、⛵ 船
   ================================================================= */
/* ---- 漁獲價格：照市場行情，不再跟館方進貨價掛鉤 ---- */
const fPrice=k=>Math.max(40,Math.round((PRICE[k]||100)*.15));
fishVal=(k,g)=>BOSS[k]?Math.round(BOSS[k].val*.6*mktF(k)):Math.round(fPrice(k)*Math.pow(clamp(g.sz,.75,1.6),2)*Math.min(2,(MORPH[g.m]||MORPH.n).mul||1)*mktF(k));
mktF=function(k){S.mkt=S.mkt||{};const m=S.mkt[k];if(!m)return 1;return Math.min(1,m.f+(Date.now()-m.t)/60000*.03);};
mktHit=function(k){S.mkt=S.mkt||{};S.mkt[k]={f:Math.max(.25,mktF(k)*.8),t:Date.now()};markDirty();};
/* ---- ⛵ 船 ---- */
const BOATS={rent:{n:'🛶 租來的舢舨',crew:1,well:6,boss:1,sc:1,d:'每次出海付 $600'},
 skiff:{n:'🚤 小漁船',cost:12000,crew:2,well:8,boss:1.15,sc:1,d:'出海免費・可以邀 1 個朋友上船・活魚艙 8 格'},
 cruiser:{n:'🛥 娛樂釣船',cost:35000,crew:4,well:10,boss:1.35,sc:1.12,d:'出海免費・最多 4 人・活魚艙 10 格・Boss 機率 ×1.35'},
 yacht:{n:'🛳 遠洋釣船',cost:90000,crew:6,well:14,boss:1.7,sc:1.25,d:'出海免費・最多 6 人・活魚艙 14 格・Boss 機率 ×1.7'}};
const boatNow=()=>BOATS[S.boat]||BOATS.rent;
function applyBoat(){const b=boatNow();TRIP.sea=S.boat?[0,`${b.n.split(' ')[0]} 自己的船`]:[600,'⛵ 租船出航'];if(typeof BOAT!=='undefined'&&BOAT)BOAT.scale.setScalar(b.sc||1);}
const _gfB=goFish;goFish=function(k){if(k==='sea'&&S.crewOf&&curW()!=='sea'){_gf(k);applyBoat();return;}_gfB(k);applyBoat();};
const _pcB=pickCatch;pickCatch=function(k,bait,perfect){const r=_pcB(k,bait,perfect);if(k==='sea'&&FW[k].boss&&r!==FW[k].boss&&Math.random()<.03*(boatNow().boss-1))return FW[k].boss;return r;};
function boatSheet(){const own=S.boat||'rent';sheet('⛵ 船隻',`<div class="mut sm" style="margin-bottom:6px">有自己的船，海釣就不用再付租船費，還可以邀朋友一起出海（出海後在「🧰 更多」裡邀請）。</div>`+
 Object.entries(BOATS).map(([k,b])=>{const order=Object.keys(BOATS);const have=order.indexOf(own)>=order.indexOf(k);return`<div class="res"><div><b>${b.n}</b> ${k===own?'<span style="color:var(--acc)">使用中</span>':''}</div><div class="mut sm">${b.d}</div>${have||k==='rent'?'<span></span>':`<button class="btn sm" data-b="${k}">買 ${fmt$(b.cost)}</button>`}</div>`;}).join(''),
 c=>c.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{const k=x.dataset.b,b=BOATS[k];const order=Object.keys(BOATS);if(order.indexOf(k)<=order.indexOf(own))return;if(!pay(b.cost,b.n))return;S.boat=k;markDirty();applyBoat();toast(`🎉 買了 ${b.n}！出海不用再付租船費`,3600);boatSheet();}));}
const _gsB=gearSheet;gearSheet=function(){_gsB();const c=$('#shC');if(!c)return;const b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:10px';b.textContent=`⛵ 船隻：${boatNow().n}`;b.onclick=boatSheet;c.appendChild(b);};
/* ---- ⭐ 星等 ---- */
const STARS=[0,150,300,550,900];
function mScore(){const sp=new Set();let n=0,md=0,cl=0,tk=0,ar=0;for(const id in TANKS){const st=TANKS[id].st;if(!st||!st.animals.length)continue;tk++;cl+=st.clean??60;if(/^a\d/.test(id))ar++;for(const e of st.animals){sp.add(e.sp);n++;md+=e.mood??60;}}
 const avgM=n?md/n:0,avgC=tk?cl/tk:0;const wel=.6+.6*(avgM/100*.6+avgC/100*.4);let rar=0;for(const k of sp)rar+=Math.log10(PRICE[k]||100)*2;
 const base=(sp.size*8+rar+Math.min(n,150)*.5)*wel;const R=S.rs||{},Cn=S.cons||{};
 const fac={bf:((S.up&&S.up.bf)||1)-1,rs:Object.keys(R.done||{}).length,rep:Cn.rep||0,tro:Math.min(12,(S.trophy||[]).length),ar,lf:S.lf?['nau','roti','cope','gut','worm','ff','pinky'].filter(k=>S.lf.st[k]>0).length:0,boat:Object.keys(BOATS).indexOf(S.boat||'rent')};
 const facS=fac.bf*20+fac.rs*10+fac.rep*.8+fac.tro*4+fac.ar*8+fac.lf*5+fac.boat*10;
 return{score:Math.round(base+facS),base:Math.round(base),facS:Math.round(facS),sp:sp.size,n,avgM:Math.round(avgM),avgC:Math.round(avgC),wel,fac};}
const starOf=s=>{let r=1;STARS.forEach((v,i)=>{if(s>=v)r=i+1;});return r;};
const tkRate=m=>Math.round(m.score*(.12+.05*starOf(m.score)));
/* ---- 🎟 門票收入 ---- */
function tkTick(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;S.tk=S.tk||{t:Date.now(),tot:0};const now=Date.now(),m=mScore(),r=tkRate(m);const min=(now-S.tk.t)/60000;S.tk.t=now;if(min<=0)return;
 let v;if(min>3){const off=Math.min(min,360);v=Math.round(r*off*.4);if(v>0)setTimeout(()=>toast(`🎟 你不在的時候賣出了門票，收入 ${fmt$(v)}（離線最多算 6 小時）`,5200),1500);}else v=Math.round(r*min);
 if(v>0){earn(v);S.tk.tot+=v;}qTrk();}
/* ---- 📜 主線任務 ---- */
const tanksN=()=>Object.values(TANKS).filter(t=>t.st).length,dispSp=()=>{const s=new Set();for(const id in TANKS)for(const e of (TANKS[id].st?TANKS[id].st.animals:[]))s.add(e.sp);return s.size;};
const bornN=()=>Object.values((S.cons&&S.cons.bc)||{}).reduce((a,b)=>a+b,0);
const QS=[
 {ch:'第 1 章・開幕準備',q:[
  {id:'t1',n:'設置第一個展缸',d:'走到牆邊的虛線框，選一種展缸蓋起來',v:()=>tanksN(),need:1,$:500},
  {id:'s3',n:'展出 3 種動物',d:'在商店買動物放進展缸',v:dispSp,need:3,$:800},
  {id:'fd',n:'餵食 5 次',d:'點展缸 →「餵食」',v:()=>S.qs.f.fed||0,need:5,$:500},
  {id:'s5',n:'展出 5 種動物',v:dispSp,need:5,$:1200}]},
 {ch:'第 2 章・生態館成長',q:[
  {id:'t6',n:'擁有 6 個展缸',v:()=>tanksN(),need:6,$:2000},
  {id:'fi',n:'去釣魚，釣到 3 種魚',d:'地圖 → 選一個釣場',v:()=>Object.keys(S.fishLog||{}).filter(k=>!/^boss:/.test(k)).length,need:3,$:1000},
  {id:'tr',n:'做一個釣魚標本',d:'釣到魚後按「🏆 標本」',v:()=>(S.trophy||[]).length,need:1,$:800},
  {id:'s10',n:'展出 10 種動物',v:dispSp,need:10,$:2500},
  {id:'st2',n:'生態館達到 ⭐⭐',d:'物種越多、越稀有、動物越開心，星等越高',v:()=>starOf(mScore().score),need:2,$:3000}]},
 {ch:'第 3 章・繁殖之路',q:[
  {id:'wg',n:'參觀二樓新翼',d:'從二樓水族展廳東邊的走廊走過去',v:()=>S.qs.f.wing?1:0,need:1,$:300},
  {id:'bx',n:'把一對動物放進繁殖箱',d:'繁殖場西牆的繁殖箱',v:()=>S.qs.f.box?1:0,need:1,$:800},
  {id:'lf',n:'在活餌區收成一次',d:'豐年蝦最簡單：孵 2 分鐘後收成',v:()=>S.qs.f.lfh?1:0,need:1,$:800},
  {id:'cd',n:'照蛋一次',d:'孵蛋室的蛋放 1 分鐘後按「照蛋」',v:()=>S.qs.f.cand?1:0,need:1,$:600},
  {id:'bn',n:'繁殖出 3 隻寶寶',v:bornN,need:3,$:3000}]},
 {ch:'第 4 章・研究與保育',q:[
  {id:'mc',n:'累積 10 研究點數',d:'研究區的顯微鏡、行為觀察',v:()=>(S.rs&&S.rs.tot)||0,need:10,$:1500},
  {id:'rd',n:'完成 2 項研究',v:()=>Object.keys((S.rs&&S.rs.done)||{}).length,need:2,$:3000},
  {id:'ca',n:'接一個保育計畫',d:'保育中心的委託板',v:()=>((S.cons&&S.cons.act.length)||0)+Object.keys((S.cons&&S.cons.done)||{}).length,need:1,$:500},
  {id:'cd2',n:'完成 2 個保育計畫',v:()=>Object.keys((S.cons&&S.cons.done)||{}).length,need:2,$:6000},
  {id:'st3',n:'生態館達到 ⭐⭐⭐',v:()=>starOf(mScore().score),need:3,$:6000}]},
 {ch:'第 5 章・頂級生態館',q:[
  {id:'ar',n:'在節肢動物館設一個展缸',d:'爬蟲館西邊的門',v:()=>Object.keys(TANKS).filter(id=>/^a\d/.test(id)&&TANKS[id].st).length,need:1,$:3000},
  {id:'bt',n:'買一艘自己的船',d:'釣具店 →「⛵ 船隻」',v:()=>S.boat?1:0,need:1,$:5000},
  {id:'s25',n:'展出 25 種動物',v:dispSp,need:25,$:10000},
  {id:'rp',n:'保育名聲 80',v:()=>(S.cons&&S.cons.rep)||0,need:80,$:10000},
  {id:'st4',n:'生態館達到 ⭐⭐⭐⭐',v:()=>starOf(mScore().score),need:4,$:15000},
  {id:'st5',n:'生態館達到 ⭐⭐⭐⭐⭐',d:'最終目標：頂級生態館',v:()=>starOf(mScore().score),need:5,$:50000}]}];
const QALL=QS.flatMap((c,ci)=>c.q.map(q=>({...q,ci})));
function ensureQ(){S.qs=S.qs||{};S.qs.done=S.qs.done||{};S.qs.f=S.qs.f||{};return S.qs;}
const qCur=()=>{ensureQ();return QALL.find(q=>!S.qs.done[q.id]);};
const qProg=q=>{try{return Math.min(q.need,q.v()||0);}catch(e){return 0;}};
function qClaim(q){ensureQ();if(S.qs.done[q.id]||qProg(q)<q.need)return;S.qs.done[q.id]=1;earn(q.$);markDirty();toast(`📜 主線任務完成：${q.n}！獎金 ${fmt$(q.$)}`,3800);
 const nx=qCur();if(nx&&nx.ci!==q.ci)setTimeout(()=>toast(`📖 進入${QS[nx.ci].ch}`,3600),4000);if(!nx)setTimeout(()=>toast('🏆 主線全部完成！你的生態館是頂級生態館了',6000),4000);qTrk();}
function qFlags(){const f=ensureQ().f;if(typeof inWing==='function'&&inWing())f.wing=1;if(S.bf){if(S.bf.box.some(x=>x.st&&x.st!=='idle'))f.box=1;if(S.bf.eggs.some(e=>e.cand))f.cand=1;}if(S.lf&&Object.values(S.lf.st).some(v=>v>0))f.lfh=1;}
const _fdQ=feed;feed=function(tk){_fdQ(tk);ensureQ().f.fed=(S.qs.f.fed||0)+1;markDirty();};
/* ---- 介面：左上角的任務／星等小卡 ---- */
function qTrk(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT)){const o=document.getElementById('qTrk');if(o)o.remove();return;}qFlags();let d=document.getElementById('qTrk');
 if(!d){d=document.createElement('div');d.id='qTrk';d.style.cssText='position:fixed;left:10px;top:calc(env(safe-area-inset-top) + 64px);z-index:54;max-width:46vw;background:rgba(8,18,28,.86);border:1px solid rgba(111,211,255,.3);border-radius:12px;padding:7px 9px;color:#d8f0ff;font-size:12px;line-height:1.35';document.body.appendChild(d);d.onclick=()=>qSheet();}
 const m=mScore(),st=starOf(m.score),q=qCur();const p=q?qProg(q):0;
 d.innerHTML=`<div style="font-weight:700">${'⭐'.repeat(st)}<span style="opacity:.35">${'⭐'.repeat(5-st)}</span></div><div class="mut" style="font-size:11px">🎟 門票 ${fmt$(tkRate(m))}/分</div>`+
  (q?`<div style="margin-top:4px;font-weight:700">📜 ${q.n}</div><div style="height:5px;background:#223;border-radius:3px;margin-top:3px"><div style="height:5px;width:${Math.round(p/q.need*100)}%;background:${p>=q.need?'#ffb347':'#4aa3ff'};border-radius:3px"></div></div><div style="font-size:11px;margin-top:2px">${p>=q.need?'✅ 點我領 '+fmt$(q.$):`${p}/${q.need}・獎金 ${fmt$(q.$)}`}</div>`:'<div style="margin-top:4px">🏆 主線完成</div>');}
function qSheet(){ensureQ();const m=mScore(),st=starOf(m.score),nx=STARS[st]||null;
 sheet('📜 館長任務',`<div class="res" style="display:block"><div style="font-size:18px">${'⭐'.repeat(st)}<span style="opacity:.3">${'⭐'.repeat(5-st)}</span> <span class="mut sm">展示分數 ${m.score}${nx?`・下一星 ${nx}`:''}</span></div>
  <div class="mut sm" style="line-height:1.7;margin-top:4px">🐠 展出 ${m.sp} 種、${m.n} 隻・平均心情 ${m.avgM}・缸的乾淨度 ${m.avgC}%　→ 動物分 ${m.base}<br>🏗 設施加分 ${m.facS}：繁殖場等級、完成的研究、保育名聲、標本、節肢館展缸、活餌庫存、船<br>🎟 門票收入 <b>${fmt$(tkRate(m))}/分鐘</b>（星等越高，每位遊客付的票價越高；離線時以 40% 計算，最多 6 小時）</div></div>`+
  QS.map((c,ci)=>`<h4 style="margin:12px 0 4px">${c.ch}</h4>`+c.q.map(q=>{const p=qProg(q),done=S.qs.done[q.id];return`<div class="res" style="${done?'opacity:.55':''}"><div><b>${done?'✅':p>=q.need?'🎁':'▫️'} ${q.n}</b></div><div class="mut sm">${q.d?q.d+'・':''}${done?'已完成':`${p}/${q.need}`}・${fmt$(q.$)}</div>${!done&&p>=q.need?`<button class="btn sm feed" data-q="${q.id}">領獎</button>`:'<span></span>'}</div>`;}).join('')).join(''),
  c=>c.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{qClaim(QALL.find(q=>q.id===b.dataset.q));qSheet();}));}
setInterval(()=>{if(loaded)qTrk();},4000);setInterval(tkTick,60000);setTimeout(()=>{if(loaded){S.tk=S.tk||{t:Date.now(),tot:0};tkTick();applyBoat();qTrk();}},4000);

