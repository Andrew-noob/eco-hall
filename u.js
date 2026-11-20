/* =================================================================
   二樓新翼東側：🔬 研究區、🌏 保育中心
   ================================================================= */
openDoor('rs');openDoor('cs');AREAS2.push([WG.x+12.2,WG.x+27.6,WG.z-3.0,WG.z+2.4],[WG.x+12.2,WG.x+27.6,WG.z+3.2,WG.z+9.6]);
/* ---- 研究 ---- */
const RS={
 inc:{n:'🌡 孵化生理學',d:'孵蛋室會顯示每個溫度的公母比例；蛋可以多忍受 1°C 的溫差',rp:6,min:2},
 nutri:{n:'🥗 動物營養學',d:'繁殖受精率 +10%；加餵活餌時心情再 +3',rp:8,min:3},
 plank:{n:'🦠 浮游生物學',d:'微藻、輪蟲、橈足類長得快 40%，綠水比較不容易崩缸',rp:8,min:3},
 eth:{n:'👀 行為生態學',d:'繁殖箱的求偶速度 ×1.5',rp:10,min:3},
 cnid:{n:'🪼 刺胞動物學',d:'水螅體出芽 ×1.5；碟狀幼體可以撐 12 分鐘不吃',rp:10,min:3,req:['plank']},
 cryo:{n:'🧊 冷凍生物學',d:'解鎖「基因庫」：從動物身上採樣冷凍保存，只有母的時候也能「人工授精」',rp:15,min:4,req:['nutri']},
 larvi:{n:'🐟 海水仔魚培育',d:'倒吊這類難養的幼魚，死亡率降低 60%',rp:18,min:5,req:['plank','nutri']},
 field:{n:'🗺 野外保育學',d:'解鎖第二階段的保育計畫（鯊魚、倒吊、巨骨舌魚…）',rp:15,min:4,req:['eth']}};
function ensureRS(){ensureLF();S.rs=S.rs||{};const R=S.rs;R.rp=R.rp||0;R.done=R.done||{};R.pap=R.pap||{};R.cur=R.cur||null;R.mic=R.mic||{n:0,t:0};R.fish=R.fish||{};R.obs=R.obs||null;R.tot=R.tot||0;
 S.cons=S.cons||{};const Cn=S.cons;Cn.rep=Cn.rep||0;Cn.act=Cn.act||[];Cn.done=Cn.done||{};Cn.gb=Cn.gb||{};Cn.bc=Cn.bc||{};Cn.rel=Cn.rel||{};Cn.sv=Cn.sv||{};Cn.sm=Cn.sm||{};return R;}
function rsHas(k){return !!(S.rs&&S.rs.done&&S.rs.done[k]);}
function addRP(n,why){const R=ensureRS();R.rp+=n;R.tot+=n;markDirty();if(why)toast(`🔬 +${n} 研究點數：${why}`,2600);}
function rsTick(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;const R=ensureRS();if(R.cur&&Date.now()>=R.cur.end){const k=R.cur.k;R.done[k]=1;R.cur=null;markDirty();toast(`🎓 研究完成：${RS[k].n}！可以到研究區「發表論文」`,4600);}}
/* 顯微鏡：鑑定樣本 */
const MIC=[
 {a:'草履蟲',c:'像一隻鞋子，全身長滿細細的纖毛在划水，會一直轉圈游。',f:'草履蟲是單細胞生物，可以拿來當剛孵化小魚的第一口食物。'},
 {a:'輪蟲',c:'頭上有兩圈會轉動的纖毛，看起來像兩個在轉的輪子，身體透明、會伸縮。',f:'輪蟲繁殖超快，母的可以不用交配直接生出女兒（孤雌生殖）。'},
 {a:'橈足類',c:'身體像水滴，有兩根很長的觸角往兩邊張開，游泳是一跳一跳的。',f:'橈足類是海洋裡數量最多的動物之一，是很多魚類幼生的天然食物。'},
 {a:'豐年蝦無節幼體',c:'橘紅色、身上帶著卵黃，只有一隻眼睛和三對附肢，在光線下會聚集。',f:'豐年蝦的卵可以乾燥休眠好幾年，泡到鹽水裡才孵化。'},
 {a:'水熊蟲',c:'圓圓胖胖，有八隻短短的腳，每隻腳末端有小爪子，慢慢地爬。',f:'水熊蟲可以在真空、輻射、極冷極熱中活下來，是地球上最耐操的動物之一。'},
 {a:'水螅',c:'一根細細的管子黏在底部，頂端有一圈觸手，碰到會縮成一團。',f:'淡水的水螅幾乎不會老化，牠跟水母、珊瑚是親戚（刺胞動物）。'},
 {a:'鐘形蟲',c:'像一個倒過來的鐘，下面有一根長柄，受驚時柄會瞬間捲成彈簧縮回去。',f:'鐘形蟲的柄裡有一條收縮絲，收縮速度是生物界數一數二快的。'},
 {a:'矽藻',c:'外殼像玻璃做的小盒子，有很對稱的花紋，有的是圓的、有的是船形。',f:'矽藻的殼是二氧化矽（玻璃的成分），地球上大約兩成的氧氣是矽藻產生的。'},
 {a:'渦蟲',c:'扁扁的，頭部是三角形，有兩個像鬥雞眼一樣的眼點，在玻璃上滑行。',f:'渦蟲被切成好幾段，每一段都能再長成一隻完整的渦蟲。'},
 {a:'白點蟲',c:'在魚鰭上看到一顆顆白色小點，放大後是一個圓圓的、裡面有馬蹄形核的蟲。',f:'白點病是觀賞魚最常見的寄生蟲病，提高水溫可以加快牠的生活史，比較好治療。'},
 {a:'碟狀幼體',c:'像一片有八個缺口的小花瓣，會一縮一縮地游。',f:'這是水母的寶寶。水螅體「橫裂」時，會像疊盤子一樣一片片脫落出來。'},
 {a:'浮浪幼體',c:'一顆長滿纖毛的小橢圓，游一陣子之後會黏到石頭上不動了。',f:'浮浪幼體附著後會變成水螅體，是水母、珊瑚生命的開始。'},
 {a:'線蟲',c:'細細長長、兩頭尖尖，一直像蛇一樣扭來扭去。',f:'土壤裡一把土就可能有上千隻線蟲，有些是益蟲，有些是寄生蟲。'},
 {a:'夜光藻',c:'圓圓的像一顆小氣球，晚上被攪動時會發出藍光。',f:'台灣馬祖的「藍眼淚」就是夜光藻發光造成的。'},
 {a:'綠藻（小球藻）',c:'非常小的綠色圓球，沒有鞭毛，一大片看起來就是綠色的水。',f:'小球藻是「綠水」的主角，可以拿來養輪蟲。'},
 {a:'蟎',c:'有八隻腳、身體圓圓的，在果蠅培養瓶裡爬來爬去。',f:'果蠅培養瓶放太久就會長蟎，所以要一直換新瓶。'}];
function micQ(){const R=ensureRS();if(R.mic.n>=5&&Date.now()-R.mic.t<3*60e3){rsSheet('mic');return;}if(R.mic.n>=5){R.mic.n=0;}
 const q=MIC[Math.random()*MIC.length|0];const opts=[q.a];while(opts.length<4){const o=MIC[Math.random()*MIC.length|0].a;if(!opts.includes(o))opts.push(o);}opts.sort(()=>Math.random()-.5);
 sheet('🔬 顯微鏡鑑定',`<div class="mut sm">第 ${R.mic.n+1}/5 個樣本・答對 +2 研究點數</div><div class="res" style="display:block;margin:8px 0"><div style="font-size:40px;text-align:center">🔬</div><div style="line-height:1.7">${q.c}</div></div><div class="mut sm" style="margin-bottom:6px">這是什麼？</div>`+opts.map(o=>`<button class="opt" data-o="${esc(o)}"><b>${o}</b></button>`).join(''),
  c=>c.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const ok=b.dataset.o===q.a;R.mic.n++;if(R.mic.n>=5)R.mic.t=Date.now();if(ok)addRP(2);markDirty();
   sheet('🔬 顯微鏡鑑定',`<div class="res" style="display:block"><div style="font-size:22px;margin-bottom:6px">${ok?'✅ 答對了！+2':'❌ 不對，答案是「'+q.a+'」'}</div><div class="mut" style="line-height:1.7">📖 ${q.f}</div></div><div style="display:flex;gap:6px;margin-top:8px">${R.mic.n<5?'<button class="btn feed" style="flex:1" id="mN">下一個樣本</button>':'<span class="mut sm" style="flex:1">這批樣本看完了，3 分鐘後有新的</span>'}<button class="btn" style="flex:1" id="mB">← 研究區</button></div>`,
    c2=>{const n=c2.querySelector('#mN');if(n)n.onclick=micQ;c2.querySelector('#mB').onclick=()=>rsSheet();});}));}
/* 行為觀察任務 */
function newObs(){const R=ensureRS();const pool=[];for(const id in TANKS){const tk=TANKS[id];const sp=[...new Set(tk.st.animals.map(e=>e.sp))];for(const k of sp)if(SP[k]&&!SP[k].school)pool.push({id,k});}if(!pool.length){R.obs=null;return;}const p=pool[Math.random()*pool.length|0];R.obs={id:p.id,k:p.k,p:0};markDirty();}
globalAnims.push((t,dt)=>{const R=S.rs;if(!R||!R.obs||!loaded)return;const tk=TANKS[R.obs.id];if(!tk){R.obs=null;return;}const w=tk.slot.wall;const d=Math.hypot(player.x-w.x,player.z-w.z);const same=Math.abs((player.y>2.5?5:0)-(w.y>2.5?5:0))<1;
 if(d<4.5&&same){R.obs.p+=dt;if(!R.obs.sh){R.obs.sh=1;toast(`👀 觀察中：${SP[R.obs.k].n}…（待在缸前 20 秒）`,2600);}if(R.obs.p>=20){const k=R.obs.k;R.obs=null;addRP(4,`完成${SP[k].n}行為觀察`);setTimeout(()=>toast(`📖 ${SP[k].f||''}`,6000),2700);}}});
/* 研究區介面 */
function rsSheet(tab='tree'){const R=ensureRS();rsTick();const tabs=`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">${chip('🧪 研究項目',tab==='tree','data-t="tree"')}${chip('🔬 顯微鏡',tab==='mic','data-t="mic"')}${chip('👀 觀察',tab==='obs','data-t="obs"')}${chip('📄 論文',tab==='pap','data-t="pap"')}${rsHas('cryo')?chip('🧊 基因庫',tab==='gb','data-t="gb"'):''}</div>
 <div class="row2" style="background:#0d1a24;border-radius:8px;padding:6px 8px"><span>🔬 研究點數 <b style="color:var(--acc)">${R.rp}</b></span><span class="mut sm">累計 ${R.tot}</span></div>`;let h='';
 if(tab==='tree')h=`<div class="mut sm" style="margin:6px 0">研究點數從顯微鏡鑑定、行為觀察、繁殖成功、釣到新魚種得到。同一時間只能進行一項研究。</div>`+(R.cur?`<div class="res"><div><b>進行中：${RS[R.cur.k].n}</b></div><div class="mut sm">還要 ${Math.max(0,Math.ceil((R.cur.end-Date.now())/60000))} 分鐘</div><span></span></div>`:'')+
  Object.entries(RS).map(([k,r])=>{const done=R.done[k],lock=(r.req||[]).filter(q=>!R.done[q]);return`<div class="res" style="${done?'opacity:.75':''}"><div><b>${r.n}</b> ${done?'<span style="color:#6fd38c">✅ 已完成</span>':''}</div><div class="mut sm">${r.d}${lock.length?`<br>🔒 先完成：${lock.map(q=>RS[q].n).join('、')}`:''}</div>${done||lock.length||R.cur?'<span></span>':`<button class="btn sm" data-r="${k}">${r.rp} 點・${r.min} 分鐘</button>`}</div>`;}).join('');
 else if(tab==='mic')h=`<div class="mut sm" style="margin:6px 0">從展示缸和活餌區採水，在顯微鏡下鑑定是什麼生物。每批 5 個樣本，答對一個 +2 點。</div>${R.mic.n>=5&&Date.now()-R.mic.t<3*60e3?`<div class="mut">這批看完了，${Math.ceil((3*60e3-(Date.now()-R.mic.t))/60000)} 分鐘後有新樣本。</div>`:'<button class="btn feed" style="width:100%" id="mS">開始鑑定</button>'}`;
 else if(tab==='obs'){if(!R.obs)newObs();const o=R.obs;h=`<div class="mut sm" style="margin:6px 0">到展示缸前面待 20 秒，記錄動物的行為，完成 +4 點，還會學到一個冷知識。</div>`+(o?`<div class="res"><div><b>👀 觀察 ${SP[o.k].n}</b></div><div class="mut sm">地點：「${esc(tName(TANKS[o.id]))}」・進度 ${Math.round(o.p/20*100)}%</div><button class="btn sm" id="oR">換一個</button></div>`:'<div class="mut">展示缸裡還沒有動物可以觀察。</div>');}
 else if(tab==='pap')h=`<div class="mut sm" style="margin:6px 0">每完成一項研究，可以發表一篇論文，拿到研究經費和保育名聲。</div>`+(Object.keys(R.done).length?Object.keys(R.done).map(k=>`<div class="res"><div><b>📄 ${RS[k].n.slice(2)}研究</b></div><div class="mut sm">${R.pap[k]?'已發表':'經費 '+fmt$(600+RS[k].rp*120)+'・名聲 +5'}</div>${R.pap[k]?'<span>✅</span>':`<button class="btn sm feed" data-p="${k}">發表</button>`}</div>`).join(''):'<div class="mut">還沒有完成的研究。</div>');
 else if(tab==='gb'){const G=S.cons.gb;h=`<div class="mut sm" style="margin:6px 0">從展示缸的成年動物身上採一點組織或精子，用液態氮（−196°C）冷凍保存。之後就算沒有公的，也能在繁殖箱「人工授精」，也可以保留稀有的基因。</div>`+
  (Object.keys(G).filter(k=>G[k].length).map(k=>`<div class="row2"><span>🧊 ${SP[k].n}</span><span class="mut sm">♂ ${G[k].filter(x=>x.sex==='♂').length}・♀ ${G[k].filter(x=>x.sex==='♀').length}</span></div>`).join('')||'<div class="mut sm">基因庫是空的。</div>')+`<button class="btn feed" style="width:100%;margin-top:8px" id="gS">🧪 採樣</button>`;}
 sheet('🔬 研究區',tabs+h,c=>{c.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>rsSheet(x.dataset.t));c.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>{const k=x.dataset.r,r=RS[k];if(R.rp<r.rp){toast(`研究點數不夠（要 ${r.rp}）`);return;}R.rp-=r.rp;R.cur={k,end:Date.now()+r.min*60e3};markDirty();toast(`🧪 開始研究 ${r.n}，${r.min} 分鐘後完成`,3000);rsSheet();});
  const ms=c.querySelector('#mS');if(ms)ms.onclick=micQ;const oR=c.querySelector('#oR');if(oR)oR.onclick=()=>{newObs();rsSheet('obs');};const gS=c.querySelector('#gS');if(gS)gS.onclick=sampleSheet;
  c.querySelectorAll('[data-p]').forEach(x=>x.onclick=()=>{const k=x.dataset.p;R.pap[k]=1;earn(600+RS[k].rp*120);S.cons.rep+=5;markDirty();toast(`📄 論文發表！拿到研究經費 ${fmt$(600+RS[k].rp*120)}，保育名聲 +5`,3600);rsSheet('pap');});});}
function sampleSheet(){const C2=S.cons;const list=[];for(const id in TANKS)for(const e of TANKS[id].st.animals)if(e.size>=.9&&!SP[e.sp].school&&!C2.sm[e.id]&&(e.sex==='♂'||e.sex==='♀'))list.push({tk:TANKS[id],e});
 sheet('🧊 採樣',list.length?list.slice(0,40).map((o,i)=>`<button class="opt" data-i="${i}"><b>${o.e.sex} ${esc(o.e.name)}${gTag(o.e)?' '+gTag(o.e):''}</b><span class="mut">${SP[o.e.sp].n}・「${esc(tName(o.tk))}」</span></button>`).join(''):'<div class="mut">沒有可以採樣的成年動物（每隻只能採一次）。</div>',
  c=>c.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=list[+b.dataset.i];ensureGenes(o.e);C2.sm[o.e.id]=1;(C2.gb[o.e.sp]=C2.gb[o.e.sp]||[]).push({g:{...o.e.g},sex:o.e.sex,name:o.e.name,id:o.e.id});o.e.mood=Math.max(10,(o.e.mood||60)-5);markDirty();toast(`🧊 ${o.e.name} 的樣本存進基因庫`,2600);sampleSheet();}));}
/* 研究點數來源：繁殖成功、釣到新魚種 */
const _bd=bfDeliver;bfDeliver=function(k,g,sex){const r=_bd(k,g,sex);ensureRS();S.cons.bc[k]=(S.cons.bc[k]||0)+1;S.rs.rp+=1;S.rs.tot+=1;
 const tk=Object.values(TANKS).find(t=>t.st.animals.length&&t.st.animals[t.st.animals.length-1].sp===k&&t.st.animals[t.st.animals.length-1].g===g);if(tk)tk.st.animals[tk.st.animals.length-1].cb=1;else{const w=S.wh[S.wh.length-1];if(w&&w.sp===k)w.cb=1;}consProg();return r;};
const _lf2=landFish;landFish=function(){_lf2();const c=FS&&FS.catch;if(!c)return;const R=ensureRS();if(!R.fish[c.k]){R.fish[c.k]=1;addRP(3,`第一次釣到 ${c.nm}`);}
 for(const a of S.cons.act){const P=CP[a.id];if(P&&P.type==='survey'&&P.sp===c.k){a.c=(a.c||0)+1;toast(`📋 保育調查：記錄到 ${c.nm}（${a.c}/${P.need}），量完體長記得放生`,3600);}}consProg();markDirty();};
/* 研究效果 */
const _bb2=bfBirth;bfBirth=function(i){const x=S.bf.box[i],r=BRE[x.sp];const of=r.fert,oh=r.hard;if(rsHas('nutri')&&of)r.fert=Math.min(.98,of*1.1);if(rsHas('larvi')&&oh)r.hard=oh*.4;try{_bb2(i);}finally{r.fert=of;r.hard=oh;}};
const _fdR=feed;feed=function(tk){const before=S.lf?Object.values(S.lf.st).reduce((a,b)=>a+b,0):0;_fdR(tk);const after=S.lf?Object.values(S.lf.st).reduce((a,b)=>a+b,0):0;if(rsHas('nutri')&&after<before)for(const e of tk.st.animals)e.mood=Math.min(100,(e.mood||60)+3);};
/* 人工授精：基因庫裡有公的樣本時，只有母的也能放進繁殖箱 */
const _pp=pickPair;pickPair=function(i){if(!rsHas('cryo'))return _pp(i);const G=S.cons.gb;const ks=Object.keys(BRE).filter(k=>SP[k]);const opts=ks.map(k=>{const a=adults(k);const f=a.filter(o=>o.e.sex==='♀');const m=a.filter(o=>o.e.sex==='♂').concat((G[k]||[]).filter(s=>s.sex==='♂').map(s=>({tk:null,e:{name:'🧊 冷凍精子・'+s.name,g:s.g,sex:'♂',sp:k,mood:100,hunger:100,ai:1}})));return{k,f,m};}).filter(o=>o.f.length&&o.m.length);
 sheet(`🧪 繁殖箱 ${i+1}：選物種`,opts.length?opts.map(o=>{const r=BRE[o.k];const lock=(r.lv||1)>bfLv();return`<button class="opt" data-k="${o.k}" ${lock?'disabled style="opacity:.5"':''}><b>${SP[o.k].n} <span class="mut sm">${GN[r.g]}</span></b><span class="mut">♀ ${o.f.length}・♂ ${o.m.length}（含冷凍精子）${lock?`・🔒 要繁殖場 Lv.${r.lv}`:''}</span></button>`;}).join(''):'<div class="mut sm">沒有可以配對的成年母體。</div>',
  c=>c.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{const o=opts.find(z=>z.k===x.dataset.k);if((BRE[o.k].lv||1)>bfLv())return;pickOne(i,o,'f');}));};
const _tko=takeOut;takeOut=function(tk,e){if(!tk||e.ai)return;_tko(tk,e);};const _pb=putBack;putBack=function(e){if(e&&e.ai)return '🧊 基因庫';if(e&&e.dead)return '💀 被吃掉了';return _pb(e);};
/* ---- 保育計畫 ---- */
const CP={
 pturtle:{n:'🐢 斑龜族群補充',sp:'pturtle',type:'release',need:4,$:3000,rep:10,t:1,f:'斑龜是台灣原生的淡水龜，但在野外常被外來種「巴西龜」搶走棲地。野放前要確定是本地的族群。'},
 crested:{n:'🦎 睫角守宮保險族群',sp:'crested',type:'breed',need:4,$:3500,rep:10,t:1,f:'睫角守宮 1994 年在新喀里多尼亞被重新發現，野外受到火蟻入侵和森林火災威脅。人工飼養的族群就像一份「保險」。'},
 sakura:{n:'🐟 櫻花鉤吻鮭族群調查',sp:'sakura',type:'survey',need:2,$:2500,rep:10,t:1,f:'櫻花鉤吻鮭是冰河時期留下來的魚，只住在雪霸的七家灣溪。1984 年只剩大約 200 隻，經過復育和拆除攔砂壩，現在已經回升到上千隻。'},
 hemi:{n:'🐟 台灣間爬岩鰍溪流調查',sp:'hemi',type:'survey',need:3,$:2000,rep:8,t:1,f:'間爬岩鰍用像吸盤一樣的腹部貼在急流的石頭上。溪流水泥化、攔砂壩會讓牠們失去棲地。'},
 clown:{n:'🐠 小丑魚人工繁殖取代野採',sp:'clown',type:'breed',need:6,$:4000,rep:15,t:1,f:'《海底總動員》上映後，野生小丑魚被大量捕捉。現在市面上的小丑魚大多已經是人工繁殖的了。'},
 seahorse:{n:'🐴 海馬保育計畫',sp:'seahorse',type:'breed',need:4,$:4500,rep:15,t:1,f:'海馬被列在華盛頓公約附錄二，每年有上千萬隻被抓去當中藥材或乾燥紀念品。'},
 moon:{n:'🪼 水母自給自足',sp:'moon',type:'breed',need:8,$:3000,rep:10,t:1,f:'水族館展示的水母幾乎都是自己培養的，用水螅體一代一代繁殖，不用再去海裡撈。'},
 dart:{n:'🐸 箭毒蛙避難所',sp:'dart',type:'breed',need:4,$:5000,rep:15,t:1,f:'全世界的蛙類被一種「壺菌」大量消滅，已經有 90 種以上的蛙因此滅絕。很多動物園建立「兩棲類避難所」保存族群。'},
 tortoise:{n:'🐢 蘇卡達象龜繁殖',sp:'tortoise',type:'breed',need:4,$:5000,rep:15,t:1,f:'蘇卡達象龜在原產地非洲撒哈拉南緣被列為瀕危，棲地沙漠化和過度放牧是主要威脅。'},
 gecko:{n:'🧬 豹紋守宮基因庫',sp:'gecko',type:'gene',need:3,$:3000,rep:10,t:1,cryo:1,f:'寵物豹紋守宮經過太多選育，基因變得很單一。保存不同血統的樣本，可以避免近親繁殖帶來的疾病。'},
 turtle:{n:'🐢 綠蠵龜育幼放流',sp:'turtle',type:'release',need:4,sex:1,$:9000,rep:25,t:2,f:'沙灘越熱，孵出的小龜越多是母的。有些海灘已經 99% 都是母龜。放流的小龜要有公有母，族群才能延續——試試把一些蛋放在比較涼的孵蛋箱。'},
 shark:{n:'🦈 黑鰭礁鯊繁殖計畫',sp:'shark',type:'breed',need:2,$:12000,rep:30,t:2,f:'每年大約有 1 億隻鯊魚被捕殺，很多只是為了魚翅。鯊魚長得慢、生得少，族群很難恢復。'},
 ytang:{n:'🐟 黃金吊人工繁殖',sp:'ytang',type:'breed',need:2,$:12000,rep:30,t:2,f:'夏威夷每年從珊瑚礁抓走幾十萬隻黃金吊賣給水族市場。2015 年人工繁殖成功後，終於有機會減少野外捕撈。'},
 arapaima:{n:'🐟 巨骨舌魚復育',sp:'arapaima',type:'breed',need:2,$:12000,rep:30,t:2,f:'巨骨舌魚因為過度捕撈，在亞馬遜很多地方幾乎消失。巴西推行「社區管理漁業」後，有些湖泊的數量增加了好幾倍。'},
 manta:{n:'🌊 鬼蝠魟族群研究',sp:'manta',type:'breed',need:1,$:20000,rep:40,t:2,f:'鬼蝠魟的鰓耙在一些地方被當成中藥材，造成大量捕殺。牠們一胎只生 1 隻，非常怕被過度捕撈。'}};
const REPT2=[[0,'🌱 新手保育員'],[30,'🏛 保育推廣館'],[80,'🎖 認證保育機構'],[150,'🌏 國際保育夥伴'],[260,'🏆 傳奇保育中心']];
const repT=r=>{let t=REPT2[0][1];for(const [v,n] of REPT2)if(r>=v)t=n;return t;};
function cpProg(a){const P=CP[a.id],Cn=S.cons;if(P.type==='breed')return(Cn.bc[P.sp]||0)-a.base;if(P.type==='release')return(Cn.rel[P.sp]||0)-a.base;if(P.type==='gene')return((Cn.gb[P.sp]||[]).length)-a.base;return a.c||0;}
function cpOK(a){const P=CP[a.id];if(cpProg(a)<P.need)return false;if(P.sex){const s=a.sx||{};return(s['♂']||0)>=1&&(s['♀']||0)>=1;}return true;}
function consProg(){ensureRS();for(const a of S.cons.act)if(cpOK(a)&&!a.ok){a.ok=1;toast(`🌏 保育計畫「${CP[a.id].n}」達成了！到保育中心領獎`,4600);}}
function canRelease(e){return e.cb||/寶寶/.test(e.name||'');}
function csSheet(tab='proj'){ensureRS();const Cn=S.cons;const tabs=`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">${chip('📋 進行中',tab==='proj','data-t="proj"')}${chip('🆕 新委託',tab==='new','data-t="new"')}${chip('🌲 野放',tab==='rel','data-t="rel"')}${chip('🏅 成就',tab==='bad','data-t="bad"')}</div>
 <div class="row2" style="background:#0d1a24;border-radius:8px;padding:6px 8px"><span>保育名聲 <b style="color:var(--acc)">${Cn.rep}</b>・${repT(Cn.rep)}</span><span class="mut sm">已完成 ${Object.keys(Cn.done).length} 項</span></div>`;let h='';
 const tier2=rsHas('field')||Cn.rep>=30;
 if(tab==='proj')h=(Cn.act.length?Cn.act.map((a,i)=>{const P=CP[a.id],p=Math.min(P.need,cpProg(a));const s=a.sx||{};return`<div class="res"><div><b>${P.n}</b></div><div class="mut sm">${{breed:'在繁殖場繁殖',release:'野放人工繁殖的',survey:'在野外釣到並記錄',gene:'存進基因庫'}[P.type]} ${SP[P.sp].n} ${p}/${P.need}${P.sex?`・♂ ${s['♂']||0} ♀ ${s['♀']||0}（公母都要有）`:''}<br>獎勵 ${fmt$(P.$)}・名聲 +${P.rep}</div>${cpOK(a)?`<button class="btn sm feed" data-c="${i}">領獎</button>`:`<button class="btn sm" data-x="${i}">放棄</button>`}</div>`;}).join(''):'<div class="mut" style="margin-top:8px">沒有進行中的計畫，到「🆕 新委託」接一個（最多同時 3 個）。</div>');
 else if(tab==='new')h=`<div class="mut sm" style="margin:6px 0">${tier2?'':'🔒 第二階段的計畫：完成「🗺 野外保育學」研究，或名聲到 30。'}</div>`+Object.entries(CP).filter(([k,P])=>!Cn.done[k]&&!Cn.act.some(a=>a.id===k)).map(([k,P])=>{const lock=(P.t===2&&!tier2)||(P.cryo&&!rsHas('cryo'));return`<div class="res" style="${lock?'opacity:.5':''}"><div><b>${P.n}</b></div><div class="mut sm" style="line-height:1.6">${P.f}<br>目標：${{breed:'繁殖',release:'野放',survey:'野外調查',gene:'基因樣本'}[P.type]} ${P.need} 隻 ${SP[P.sp].n}・${fmt$(P.$)}・名聲 +${P.rep}${P.cryo&&!rsHas('cryo')?'<br>🔒 要先研究「冷凍生物學」':''}</div>${lock?'<span></span>':`<button class="btn sm" data-a="${k}">接受</button>`}</div>`;}).join('');
 else if(tab==='rel'){const rp=Cn.act.filter(a=>CP[a.id].type==='release');const list=[];for(const a of rp){const k=CP[a.id].sp;for(const id in TANKS)for(const e of TANKS[id].st.animals)if(e.sp===k&&canRelease(e))list.push({tk:TANKS[id],e,a});S.wh.forEach((w,wi)=>{if(w.sp===k&&canRelease(w))list.push({w,wi,a});});}
  h=`<div class="mut sm" style="margin:6px 0">只有<b>人工繁殖</b>的個體可以野放（名字有「寶寶」，或是在繁殖場出生的）。野放前會做健康檢查、打上標記，追蹤牠們在野外的狀況。</div>`+(rp.length?(list.length?list.map((o,i)=>{const e=o.e||o.w;return`<button class="opt" data-r="${i}"><b>🌲 ${e.sex||''} ${esc(e.name)}</b><span class="mut">${SP[e.sp].n}・${o.tk?'「'+esc(tName(o.tk))+'」':'📦 倉庫'}</span></button>`;}).join(''):'<div class="mut">沒有符合的人工繁殖個體，先去繁殖場繁殖。</div>'):'<div class="mut">要先接一個「野放」類的保育計畫。</div>');
  sheet('🌏 保育中心',tabs+h,c=>{csBind(c);c.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const o=list[+b.dataset.r],e=o.e||o.w,k=e.sp;if(o.tk){const cr=o.tk.creatures.find(z=>z.entry===e);if(cr){if(typeof GLO!=='undefined')GLO.delete(cr);cr.dispose();o.tk.creatures.splice(o.tk.creatures.indexOf(cr),1);}o.tk.st.animals.splice(o.tk.st.animals.indexOf(e),1);logEv(o.tk.st,`${e.name} 野放了`);refreshChips();}else S.wh.splice(S.wh.indexOf(e),1);
   Cn.rel[k]=(Cn.rel[k]||0)+1;o.a.sx=o.a.sx||{};if(e.sex)o.a.sx[e.sex]=(o.a.sx[e.sex]||0)+1;markDirty();consProg();toast(`🌲 ${e.name} 回到大自然了！`,3200);csSheet('rel');});});return;}
 else{const all=Object.entries(CP);h=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px">${all.map(([k,P])=>`<div style="text-align:center;padding:8px 4px;border-radius:10px;background:${Cn.done[k]?'#1e3a2a':'#151d26'};opacity:${Cn.done[k]?1:.45}"><div style="font-size:26px">${P.n.split(' ')[0]}</div><div class="sm">${P.n.split(' ').slice(1).join(' ')}</div></div>`).join('')}</div>
  <div class="mut sm" style="margin-top:8px">名聲稱號：${REPT2.map(([v,n])=>`${n}（${v}）`).join('・')}</div>`;}
 sheet('🌏 保育中心',tabs+h,csBind);}
function csBind(c){const Cn=S.cons;c.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>csSheet(x.dataset.t));
 c.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{if(Cn.act.length>=3){toast('最多同時進行 3 個計畫');return;}const k=x.dataset.a,P=CP[k];const a={id:k,t0:Date.now(),c:0};a.base=P.type==='breed'?(Cn.bc[P.sp]||0):P.type==='release'?(Cn.rel[P.sp]||0):P.type==='gene'?(Cn.gb[P.sp]||[]).length:0;Cn.act.push(a);markDirty();toast(`📋 接下「${P.n}」`,2600);csSheet('proj');});
 c.querySelectorAll('[data-x]').forEach(x=>x.onclick=()=>{Cn.act.splice(+x.dataset.x,1);markDirty();csSheet('proj');});
 c.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{const a=Cn.act[+x.dataset.c],P=CP[a.id];Cn.act.splice(+x.dataset.c,1);Cn.done[a.id]=1;earn(P.$);const old=repT(Cn.rep);Cn.rep+=P.rep;markDirty();toast(`🏅 完成「${P.n}」！獎金 ${fmt$(P.$)}・名聲 +${P.rep}`,4200);
  if(repT(Cn.rep)!==old)setTimeout(()=>toast(`🎉 生態館升格為「${repT(Cn.rep)}」！`,4600),4300);csVis();csSheet('proj');});}
/* ---- 3D：研究區、保育中心 ---- */
const UV={};
wingLvl(function(){const g=WV.g,X=WG.x,Z=WG.z;const dk=new THREE.MeshStandardMaterial({color:C(0x2b3440),roughness:.6,metalness:.3}),wt=new THREE.MeshStandardMaterial({color:C(0xf2f4f6),roughness:.5});
 const sign=(t,sub,x,y,z,ry,w=3)=>{const m=add(new THREE.PlaneGeometry(w,w*.22),new THREE.MeshBasicMaterial({map:vText([[t,64,.42],[sub||'',30,.8,'#9fd8ff']],720,160,'#16222e','#ffffff')}),x,y,z,g);m.rotation.y=ry;return m;};
 const st=(p,fn)=>STATIONS.push({p:V(X+p[0],p[1],Z+p[2]),fn});
 /* 研究區 z -3..2.6 */
 sign('🔬 研究區','RESEARCH LAB',20,3.3,-3.05,0,3.2);
 box(3,.9,.8,wt,15,.45,-2.4,g);const mc=new THREE.Group();mc.position.set(15,.9,-2.4);g.add(mc);box(.3,.06,.3,dk,0,.03,0,mc);box(.06,.45,.06,dk,0,.26,-.1,mc);const tb=add(new THREE.CylinderGeometry(.05,.05,.35,10),dk,0,.5,0,mc);tb.rotation.x=-.5;box(.2,.03,.2,dk,0,.25,0,mc);
 add(new THREE.CylinderGeometry(.04,.04,.03,10),new THREE.MeshBasicMaterial({color:C(0xfff2c0)}),0,.28,0,mc);sign('🔬 顯微鏡','鑑定樣本',15,2.2,-2.95,0,1.8);st([15,1.2,-2.4],()=>{const R=ensureRS();(R.mic.n>=5&&Date.now()-R.mic.t<3*60e3)?rsSheet('mic'):micQ();});OBST.push([X+13.4,X+16.6,Z-2.9,Z-1.9]);
 box(2.4,.8,.8,dk,20,.4,-2.4,g);const scr=add(new THREE.PlaneGeometry(1.6,.9),new THREE.MeshBasicMaterial({map:vText([['🧪 研究項目',44,.35],['研究點數・論文',28,.72,'#9fd8ff']],420,240,'#0d2a3a','#ffffff')}),20,1.4,-2.55,g);
 st([20,1.2,-2.3],()=>rsSheet('tree'));OBST.push([X+18.7,X+21.3,Z-2.9,Z-1.9]);
 const bd=add(new THREE.PlaneGeometry(3,1.6),new THREE.MeshBasicMaterial({map:vText([['👀 行為觀察任務',46,.25],['到展示缸前待 20 秒',30,.55,'#2a6a8a'],['記錄行為 +4 研究點數',30,.8,'#2a6a8a']],600,320,'#f6f8fa','#16222e')}),27.85,1.7,-.4,g);bd.rotation.y=-Math.PI/2;st([27.4,1.6,-.4],()=>rsSheet('obs'));
 const ln=new THREE.Group();ln.position.set(24.5,0,2);g.add(ln);add(new THREE.CylinderGeometry(.35,.35,1,18),new THREE.MeshStandardMaterial({color:C(0xb8c4cc),metalness:.7,roughness:.25}),0,.5,0,ln);add(new THREE.CylinderGeometry(.12,.12,.2,12),dk,0,1.1,0,ln);
 UV.fog=[];for(let i=0;i<5;i++){const m=add(new THREE.SphereGeometry(.08,8,6),new THREE.MeshBasicMaterial({color:C(0xffffff),transparent:true,opacity:.4}),0,1.25,0,ln);UV.fog.push(m);}
 sign('🧊 基因庫','液態氮 −196°C',24.5,2.2,2.35,Math.PI,1.8);st([24.5,1,1.8],()=>rsHas('cryo')?rsSheet('gb'):toast('🔒 先完成「🧊 冷凍生物學」研究，才能使用基因庫',3200));OBST.push([X+24,X+25,Z+1.5,Z+2.5]);
 box(2,.75,.9,wt,16.5,.38,1.9,g);const pp=add(new THREE.PlaneGeometry(.5,.35),new THREE.MeshBasicMaterial({color:C(0xffffff)}),16.5,.77,1.9,g);pp.rotation.x=-Math.PI/2;sign('📄 論文發表','',16.5,2,2.35,Math.PI,1.6);st([16.5,1,1.8],()=>rsSheet('pap'));OBST.push([X+15.4,X+17.6,Z+1.4,Z+2.5]);
 /* 保育中心 z 3..9.6 */
 sign('🌏 保育中心','CONSERVATION CENTER',20,3.3,3.05,Math.PI,3.4);
 UV.map=document.createElement('canvas');UV.map.width=900;UV.map.height=420;UV.mapT=new THREE.CanvasTexture(UV.map);const mp=add(new THREE.PlaneGeometry(4.8,2.25),new THREE.MeshBasicMaterial({map:UV.mapT}),27.85,1.9,6.3,g);mp.rotation.y=-Math.PI/2;st([27.3,1.9,6.3],()=>csSheet('proj'));
 box(2.6,1.2,.15,new THREE.MeshStandardMaterial({color:C(0x7a5a3a)}),16,1.5,9.85,g);add(new THREE.PlaneGeometry(2.3,.95),new THREE.MeshBasicMaterial({map:vText([['📋 保育委託板',44,.3],['接受新的保育計畫',28,.7,'#5a3a1a']],460,190,'#f3e6c8','#2a1a0a')}),16,1.5,9.77,g).rotation.y=Math.PI;st([16,1.5,9.4],()=>csSheet('new'));
 const gt=new THREE.Group();gt.position.set(21.5,0,9.85);g.add(gt);box(2.4,2.8,.1,new THREE.MeshStandardMaterial({color:C(0x2f6b3f),emissive:C(0x0a2a12)}),0,1.4,0,gt);add(new THREE.PlaneGeometry(2.1,1.6),new THREE.MeshBasicMaterial({map:vText([['🌲',120,.42],['野放閘門',40,.85]],300,240,'#1e4a2a','#ffffff')}),0,1.5,-.06,gt).rotation.y=Math.PI;
 st([21.5,1.4,9.4],()=>csSheet('rel'));
 UV.tro=[];const sh=new THREE.Group();sh.position.set(25.5,0,9.5);g.add(sh);box(2.6,.06,.5,dk,0,1.2,0,sh);box(2.6,.06,.5,dk,0,1.8,0,sh);for(let i=0;i<15;i++){const m=add(new THREE.CylinderGeometry(.08,.11,.28,10),new THREE.MeshStandardMaterial({color:C(0xd8a830),metalness:.8,roughness:.25}),-1.1+(i%8)*.31,1.37+Math.floor(i/8)*.6,0,sh);m.visible=false;UV.tro.push(m);}
 sign('🏅 保育成就','',25.5,2.6,9.8,Math.PI,1.8);st([25.5,1.5,9.2],()=>csSheet('bad'));OBST.push([X+24.1,X+26.9,Z+9.1,Z+9.9]);});
function csVis(){if(!UV.map)return;ensureRS();const Cn=S.cons,x=UV.map.getContext('2d');x.fillStyle='#0e3a5a';x.fillRect(0,0,900,420);x.fillStyle='#2e6a4a';
 [[120,120,90,70],[200,270,45,90],[430,110,60,50],[470,250,60,85],[640,140,140,80],[760,300,60,40],[340,60,35,25]].forEach(([a,b,w,h])=>{x.beginPath();x.ellipse(a,b,w,h,0,0,Math.PI*2);x.fill();});
 const pins={pturtle:[720,175],sakura:[722,170],hemi:[725,180],crested:[815,300],clown:[790,265],seahorse:[700,220],moon:[710,160],dart:[205,240],tortoise:[470,215],gecko:[600,150],turtle:[740,230],shark:[780,250],ytang:[60,180],arapaima:[220,265],manta:[300,240]};
 x.font='700 30px "PingFang TC",sans-serif';x.fillStyle='#ffffff';x.fillText('🌏 全球保育計畫',20,40);x.font='600 18px sans-serif';
 for(const k in pins){const [a,b]=pins[k];const st=Cn.done[k]?'#6fd38c':Cn.act.some(z=>z.id===k)?'#ffb347':'#557';x.fillStyle=st;x.beginPath();x.arc(a,b,9,0,Math.PI*2);x.fill();}
 x.fillStyle='#cfe';x.fillText(`🟠 進行中 ${Cn.act.length}　🟢 完成 ${Object.keys(Cn.done).length}　名聲 ${Cn.rep}・${repT(Cn.rep)}`,20,400);UV.mapT.needsUpdate=true;
 const n=Object.keys(Cn.done).length;UV.tro.forEach((m,i)=>m.visible=i<n);}
globalAnims.push((t,dt)=>{if(!UV.fog||!inWing())return;UV.fog.forEach((m,i)=>{const y=((t*.3+i/5)%1);m.position.set(Math.sin(i*3+t)*.1,1.25+y*.7,Math.cos(i*2+t)*.1);m.material.opacity=.45*(1-y);});});
/* 入口：地圖按鈕文字 */
const _ms6=mapSheet;mapSheet=function(){_ms6();const c=$('#shC');if(!c)return;const b=[...c.querySelectorAll('button')].find(x=>/二樓新翼/.test(x.textContent));if(b)b.textContent='🏢 二樓新翼：繁殖場・活餌・研究・保育';};
setInterval(()=>{rsTick();},3000);setTimeout(()=>{if(loaded){ensureRS();csVis();}},3500);setInterval(()=>{if(loaded&&inWing())csVis();},15000);

