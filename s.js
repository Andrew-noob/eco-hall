/* =================================================================
   二樓新翼：繁殖場（真實繁殖流程、孵蛋室、水母生活史）
   ================================================================= */
const WG=V(28.2,5,2),WY=5;
function wingLvl(fn){const s0=STATIONS.length,o0=OBST.length,a0=AREAS.length;fn();for(let i=s0;i<STATIONS.length;i++)STATIONS[i].p.y+=WY;OBST2.push(...OBST.splice(o0));AREAS2.push(...AREAS.splice(a0));}
/* ---- 物種繁殖資料（遊戲時間：分鐘） ----
 g: egg 下蛋 / live 胎生 / spawn 產卵 / frog 蛙類
 cool: 需要降溫期幾分鐘、coolT 降溫溫度；T 繁殖溫度；H 濕度（陸棲）
 court 求偶交配、gest 懷孕／抱卵；n 一窩數量；need 需要的器材；inc 孵蛋條件；tsd 溫度決定性別 */
const BRE={
 gecko:{g:'egg',cool:2,coolT:[18,24],T:[28,32],H:[30,50],court:1,gest:3,n:[2,2],fert:.85,need:['lay','ca'],inc:{T:[26,33],H:[80,95],dur:5},tsd:t=>t<=28?.9:t<=31?.5:.1,
  f:'豹紋守宮是「溫度決定性別」：26–28°C 幾乎都是母的，32°C 以上多半是公的，中間溫度公母都有。母守宮一季可以下好幾窩，每窩固定 2 顆蛋。'},
 beardie:{g:'egg',cool:3,coolT:[16,22],T:[30,35],H:[20,40],court:1,gest:4,n:[3,6],fert:.8,need:['lay','ca'],inc:{T:[27,31],H:[70,85],dur:6},tsd:t=>t>=31?.85:.5,
  f:'鬆獅蜥要先「冬眠（Brumation）」幾週才會發情。性別由染色體決定，但孵蛋溫度太高時，公的胚胎會「性反轉」變成母的。野外一窩可以有 15–30 顆蛋。'},
 crested:{g:'egg',cool:1,coolT:[19,23],T:[22,27],H:[60,80],court:1,gest:3,n:[2,2],fert:.85,need:['lay','ca'],inc:{T:[22,26],H:[80,95],dur:6},tsd:null,
  f:'睫角守宮曾經被認為已經滅絕，1994 年在新喀里多尼亞重新被發現。牠們不耐熱，孵蛋超過 28°C 很容易失敗。'},
 cham:{g:'egg',cool:0,T:[26,30],H:[50,70],court:1,gest:4,n:[4,8],fert:.75,need:['lay','ca'],inc:{T:[25,28],H:[75,90],dur:8},tsd:null,
  f:'高冠變色龍母的需要很深的濕沙才肯產卵，一窩可達 20–80 顆，孵化要 6–9 個月。沒有產卵處的母龍會「卡蛋」，很危險。'},
 python:{g:'egg',cool:3,coolT:[21,25],T:[28,32],H:[50,70],court:2,gest:5,n:[3,6],fert:.8,need:['lay'],inc:{T:[31,32],H:[90,100],dur:7},tsd:null,
  f:'蟒蛇母蛇會盤在蛋上「抖動肌肉發熱」幫蛋保溫。人工孵蛋溫度要很精準，31–32°C，誤差大一點就會畸形。'},
 tortoise:{g:'egg',cool:0,T:[30,35],H:[40,60],court:2,gest:5,n:[4,8],fert:.7,need:['lay','ca'],inc:{T:[28,32],H:[60,75],dur:8},tsd:t=>t>=31?.85:t>=30?.5:.15,
  f:'蘇卡達象龜是世界第三大陸龜。烏龜也是溫度決定性別，但方向跟守宮相反：越熱越多母龜。'},
 ltort:{g:'egg',cool:0,T:[28,33],H:[40,60],court:2,gest:5,n:[3,6],fert:.7,need:['lay','ca'],inc:{T:[28,31],H:[60,75],dur:8},tsd:t=>t>=30.5?.85:t>=29.5?.5:.15,f:'豹紋陸龜也是越熱越多母龜，蛋殼是硬殼，濕度太高反而容易發霉。'},
 pturtle:{g:'egg',cool:2,coolT:[14,20],T:[25,29],H:[70,90],court:1,gest:4,n:[3,6],fert:.8,need:['lay','ca'],inc:{T:[26,31],H:[75,90],dur:7},tsd:t=>t>=29.5?.85:t>=28?.5:.15,
  f:'斑龜（中華花龜）是台灣常見的原生龜，母龜會爬上岸挖洞產卵。越熱越多母龜。'},
 turtle:{g:'egg',cool:0,T:[26,29],H:[80,90],court:2,gest:6,n:[4,8],fert:.75,need:['lay'],inc:{T:[28,31],H:[80,90],dur:8},tsd:t=>t>=29.5?.9:t>=29?.5:.1,
  f:'綠蠵龜的性別分界大約 29°C。全球暖化讓沙灘變熱，有些族群孵出的小龜 99% 都是母的。母龜會游回自己出生的沙灘產卵。'},
 guppy:{g:'live',cool:0,T:[24,28],court:1,gest:3,n:[3,6],need:['trap'],first:'brine',f:'孔雀魚是胎生的，母魚交配一次可以把精子存起來，之後連生好幾胎。大魚會吃掉剛出生的小魚，所以要用「分娩盒」。'},
 seahorse:{g:'live',cool:0,T:[22,26],court:1,gest:3,n:[3,6],need:[],first:'brine',f:'海馬是「公的懷孕」：母海馬把卵放進公海馬的育兒囊，由爸爸生小孩。小海馬一出生就要吃活的小型浮游動物。'},
 motoro:{g:'live',cool:0,T:[26,30],court:2,gest:6,n:[1,3],need:[],lv:2,f:'珍珠魟是淡水魟，胎生，小魟魚出生時尾刺外面有一層軟鞘，避免刺傷媽媽。'},
 shark:{g:'live',cool:0,T:[25,28],court:2,gest:7,n:[1,2],need:[],lv:3,f:'黑鰭礁鯊是胎生，懷孕大約 10–11 個月，一胎 2–4 隻。鯊魚繁殖很慢，所以很怕過度捕撈。'},
 manta:{g:'live',cool:0,T:[24,28],court:3,gest:8,n:[1,1],need:[],lv:4,f:'鬼蝠魟一胎通常只生 1 隻，懷孕超過一年，是繁殖最慢的魚之一。水族館成功繁殖的案例全世界很少。'},
 clown:{g:'spawn',cool:0,T:[26,28],court:1,gest:2,n:[3,6],need:['rock'],first:'brine',f:'小丑魚出生時都是公的，群體裡最大的會變成母的（雄性先熟）。牠們把卵產在海葵旁邊的岩石上，由爸爸照顧。'},
 angel:{g:'spawn',cool:0,T:[27,29],court:1,gest:2,n:[3,6],need:['slate'],first:'brine',f:'神仙魚會把卵產在傾斜的板子或寬葉子上。新手親魚常常把自己的卵吃掉，很多人會把卵拿出來人工孵化。'},
 discus:{g:'spawn',cool:0,T:[28,31],court:1,gest:2,n:[3,6],need:['slate','soft'],first:'mucus',f:'七彩神仙魚的父母會從皮膚分泌「黏液」餵小魚，就像哺乳一樣。牠們要很軟、偏酸的水才肯繁殖。'},
 koi:{g:'spawn',cool:2,coolT:[10,16],T:[18,23],court:1,gest:2,n:[3,6],need:['mops','wc'],first:'brine',f:'錦鯉在春天水溫回升、下雨換水之後產卵，卵會黏在水草上。親魚會吃卵，所以產完要把產卵藻移走。'},
 arowana:{g:'spawn',cool:0,T:[27,30],court:3,gest:4,n:[1,3],need:[],lv:2,f:'銀龍魚是「口孵魚」：公魚把受精卵含在嘴裡大約兩個月，這段時間完全不吃東西。'},
 arapaima:{g:'spawn',cool:0,T:[27,30],court:3,gest:5,n:[1,2],need:[],lv:3,f:'巨骨舌魚在沙底挖窩產卵，公魚頭上會分泌物質「餵」小魚，小魚會一直跟在爸爸頭旁邊。'},
 rtc:{g:'spawn',cool:0,T:[25,28],court:3,gest:5,n:[1,2],need:['hormone'],lv:3,f:'紅尾鴨嘴在水族箱裡幾乎不會自然繁殖，養殖場是用「激素催熟」人工擠卵授精。'},
 grouper:{g:'spawn',cool:0,T:[25,28],court:2,gest:3,n:[1,2],need:['hormone'],lv:2,f:'龍膽石斑是「雌性先熟」：年輕時是母的，長大後變成公的。台灣是全世界石斑魚苗的主要產地，用激素人工催熟。'},
 btang:{g:'spawn',cool:0,T:[25,27],court:2,gest:2,n:[1,2],need:['copepod'],first:'copepod',hard:.35,lv:2,f:'藍倒吊的幼生期很長又很挑食，要吃極小的橈足類。2016 年才第一次人工繁殖成功（電影《海底總動員》的多莉就是牠）。'},
 ytang:{g:'spawn',cool:0,T:[25,27],court:2,gest:2,n:[1,2],need:['copepod'],first:'copepod',hard:.4,lv:2,f:'黃金吊以前全部是野外捕捉的，2015 年夏威夷海洋研究所才第一次人工繁殖成功，現在開始有養殖個體。'},
 horned:{g:'frog',cool:2,coolT:[18,22],T:[25,28],H:[80,100],court:1,gest:2,n:[4,8],need:['rain'],first:'brine',f:'南美角蛙在乾季過後的第一場大雨才會繁殖。人工繁殖要先「乾冷」一段時間，再用灑水模擬下雨。蝌蚪會互相吃，要分開養。'},
 dart:{g:'frog',cool:0,T:[22,26],H:[85,100],court:1,gest:2,n:[2,4],need:['cups'],first:'brine',f:'箭毒蛙把卵產在葉子上，孵出的蝌蚪會被爸爸背到樹洞的小水窪裡，媽媽還會回來產「未受精卵」餵蝌蚪。'}};
const NEED={lay:{n:'🪺 產卵盒',d:'裝濕水苔或沙，母的才有地方產卵',c:0},ca:{n:'🦴 鈣粉',d:'每窩消耗 1 份，沒補鈣蛋殼會太薄',c:60,use:1},trap:{n:'🥅 分娩盒',d:'把小魚和大魚隔開',c:200},rock:{n:'🪨 產卵岩',d:'小丑魚把卵產在上面',c:150},
 slate:{n:'🟫 產卵板',d:'斜放的石板',c:150},soft:{n:'💧 軟水設備',d:'RO 水把水質調軟、偏酸',c:800},mops:{n:'🧶 產卵藻',d:'人工產卵拖把，卵會黏在上面',c:100},wc:{n:'🚿 大量換水',d:'模擬春雨，觸發產卵（每次動作）',c:0,act:1},
 hormone:{n:'💉 催熟激素',d:'每窩消耗 1 劑',c:900,use:1},copepod:{n:'🦠 橈足類培養',d:'倒吊幼魚唯一吃得下的食物',c:2500},rain:{n:'🌧 人工降雨',d:'灑水模擬雨季（每次動作）',c:0,act:1},cups:{n:'🥤 育幼杯',d:'每隻蝌蚪一個杯子',c:120}};
const GN={egg:'🥚 下蛋',live:'🍼 胎生',spawn:'🫧 產卵',frog:'🐸 蛙類'};
const STN={idle:'空的',cool:'❄️ 降溫期',court:'💞 求偶交配',gest:'🤰 懷孕／抱卵',rest:'😴 休養'};
const STC={idle:'#3a4654',cool:'#4aa3ff',court:'#ff7ab8',gest:'#ffb347',rest:'#6fd38c'};
UPG.bf={n:'🏭 繁殖場',d:'繁殖箱數量、孵蛋室容量、可以繁殖的大型物種',lv:[1,2,3,4],cost:[0,6000,16000,35000],fmt:v=>`繁殖箱 ${[2,4,6,8][v-1]} 個・孵蛋 ${[12,20,30,40][v-1]} 顆・${['小型','中型','大型','巨型'][v-1]}物種`};
const bfLv=()=>(S.up&&S.up.bf)||1,boxN=()=>[2,4,6,8][bfLv()-1],eggCap=()=>[12,20,30,40][bfLv()-1];
const JEL={moon:{nT:20,sT:[12,16],sn:'海月水母'},nettle:{nT:18,sT:[10,14],sn:'太平洋黃金水母'}};
function ensureBF(){ensureEco();ensureStock();S.bf=S.bf||{};const b=S.bf;b.box=b.box||[];while(b.box.length<8)b.box.push({st:'idle'});b.eggs=b.eggs||[];b.inc=b.inc||{A:{T:27,H:85},B:{T:31,H:85}};b.items=b.items||{lay:1,wc:1,rain:1};b.ca=b.ca||0;b.hor=b.hor||0;
 b.jel=b.jel||{};for(const k in JEL){b.jel[k]=b.jel[k]||{pol:0,T:JEL[k].nT,eph:[],sc:0};}b.lt=b.lt||Date.now();b.log=b.log||[];return b;}
const inR=(v,[a,b])=>v>=a&&v<=b;
function bfLog(x){const b=ensureBF();b.log.unshift({t:Date.now(),x});b.log.length=Math.min(b.log.length,40);}
let has=k=>{const b=ensureBF();return k==='ca'?b.ca>0:k==='hormone'?b.hor>0:!!b.items[k];};
/* ---- 取出／放回動物 ---- */
function takeOut(tk,e){const cr=tk.creatures.find(c=>c.entry===e);if(cr){if(typeof GLO!=='undefined')GLO.delete(cr);cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}tk.st.animals.splice(tk.st.animals.indexOf(e),1);logEv(tk.st,`${e.name} 送到繁殖場`);refreshChips();}
function putBack(e){const k=e.sp;const tk=Object.values(TANKS).find(x=>spOK(k,x)&&used(x)+SP[k].cost<=SZ[x.sz].cap);if(tk){tk.st.animals.push(e);spawnAnimal(tk,e);logEv(tk.st,`${e.name} 從繁殖場回來`);refreshChips();return tName(tk);}
 S.wh.push({sp:k,g:e.g,sex:e.sex,name:e.name});return '📦 倉庫';}
function bfDeliver(k,g,sex){const nm=babyName(k,g);const tk=Object.values(TANKS).find(x=>spOK(k,x)&&used(x)+SP[k].cost<=SZ[x.sz].cap);
 if(tk){newAnimal(tk,k,{size:.3,g,sex,name:nm});logEv(tk.st,`繁殖場送來 ${sex} ${nm}`);return tName(tk);}S.wh.push({sp:k,g,sex,baby:1,name:nm});return '📦 倉庫';}
/* ---- 時間推進 ---- */
function bfTick(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;const b=ensureBF(),now=Date.now();let dt=Math.min((now-b.lt)/60000,720);b.lt=now;if(dt<=0)return;let ch=false;
 for(let i=0;i<boxN();i++){const x=b.box[i];if(x.st==='idle')continue;const r=BRE[x.sp];
  if(x.st==='cool'){if(inR(x.T,r.coolT)){x.p+=dt/r.cool;}if(x.p>=1){x.st='court';x.p=0;bfLog(`${SP[x.sp].n}降溫期結束，開始求偶`);toast(`💞 繁殖箱 ${i+1}：${SP[x.sp].n}降溫結束，把溫度調回 ${r.T[0]}–${r.T[1]}°C 讓牠們求偶`,4200);}ch=true;}
  else if(x.st==='court'){const ok=inR(x.T,r.T)&&(!r.H||inR(x.H,r.H));if(ok)x.p+=dt/r.court*(rsHas('eth')?1.5:1);if(x.p>=1){x.st='gest';x.p=0;x.trig=0;bfLog(`${SP[x.sp].n}交配成功`);if(r.cann&&!x.m.ai&&!x.m.dead&&Math.random()<r.cann){x.m.dead=1;bfLog(`母${SP[x.sp].n}把公的吃掉了`);setTimeout(()=>toast(`😱 繁殖箱 ${i+1}：交配後母${SP[x.sp].n}把公的吃掉了！（真的會發生）`,4800),1200);}toast(`🤰 繁殖箱 ${i+1}：${SP[x.sp].n}交配成功，${r.g==='live'?'懷孕了':'開始抱卵'}`,3600);}ch=true;}
  else if(x.st==='gest'){if(inR(x.T,r.T))x.p+=dt/r.gest;else x.p+=dt/r.gest*.3;if(x.p>=1){bfBirth(i);}ch=true;}
  else if(x.st==='rest'){x.p+=dt/4;if(x.p>=1){x.st='court';x.p=0;x.n=(x.n||0);toast(`😴 繁殖箱 ${i+1}：母${SP[x.sp].n}休養好了，可以再繁殖一窩`,3200);}ch=true;}}
 /* 孵蛋 */
 for(let i=b.eggs.length-1;i>=0;i--){const e=b.eggs[i],r=BRE[e.sp],c=b.inc[e.box||'A'];const dT=c.T<r.inc.T[0]?r.inc.T[0]-c.T:c.T>r.inc.T[1]?c.T-r.inc.T[1]:0;
  if(dT>(rsHas('inc')?4:3)){e.hp-=dt*.6;}else e.p+=dt/r.inc.dur*(dT?.5:1)*(e.fert?1:0);
  if(c.H<r.inc.H[0])e.dent+=dt*.25*(r.inc.H[0]-c.H)/10;if(c.H>r.inc.H[1])e.mold+=dt*.3*(c.H-r.inc.H[1])/10;if(!e.fert&&e.t0+90e3<now)e.mold+=dt*.6;
  if(e.mold>.5){for(const o of b.eggs)if(o!==e&&(o.box||'A')===(e.box||'A'))o.mold+=dt*.08;}
  if(e.dent>=1||e.mold>=1||e.hp<=0){b.eggs.splice(i,1);const why=e.hp<=0?'溫度太離譜，胚胎死了':e.dent>=1?'太乾，蛋凹陷乾掉了':'發霉壞掉了';bfLog(`${SP[e.sp].n}的蛋${why}`);toast(`💀 孵蛋室：一顆${SP[e.sp].n}的蛋${why}`,3600);ch=true;continue;}
  if(e.p>=1){b.eggs.splice(i,1);const sex=r.tsd?(Math.random()<r.tsd(c.T)?'♀':'♂'):(Math.random()<.5?'♀':'♂');const to=bfDeliver(e.sp,e.g,sex);bfLog(`孵出 ${sex} ${babyName(e.sp,e.g)}`);
   toast(`🐣 孵出 ${sex} ${babyName(e.sp,e.g)}${gTag({g:e.g})?'（'+gTag({g:e.g})+'）':''}，送到「${to}」`,4200);S.cons=S.cons||{};S.cons.bred=(S.cons.bred||0)+1;ch=true;}}
 /* 水母生活史 */
 for(const k in b.jel){const j=b.jel[k],J=JEL[k];
  if(j.pol>0){if(inR(j.T,J.sT)){j.sc+=dt/3;if(j.sc>=1){j.sc=0;const st=Math.max(1,Math.round(j.pol*.3));let n=0;for(let q=0;q<st;q++)n+=3+(Math.random()*4|0);n=Math.min(n,30-j.eph.length);for(let q=0;q<n;q++)j.eph.push({t0:now,p:0,f:now});
     if(n>0){bfLog(`${J.sn}水螅體橫裂，放出 ${n} 隻碟狀幼體`);toast(`🪼 ${J.sn}的水螅體「橫裂」了！放出 ${n} 隻碟狀幼體，記得把水溫調回 ${J.nT}°C 並餵豐年蝦`,5200);}ch=true;}}
   else{j.sc=Math.max(0,j.sc-dt/6);if(Math.abs(j.T-J.nT)<=2&&j.fedT&&now-j.fedT<5*60e3){j.bud=(j.bud||0)+dt/2*(rsHas('cnid')?1.5:1);if(j.bud>=1){j.bud=0;const add=Math.max(1,Math.round(j.pol*.2));j.pol=Math.min(j.pol+add,polCap());ch=true;}}}}
  for(let q=j.eph.length-1;q>=0;q--){const e=j.eph[q];const fedOK=now-e.f<4*60e3;if(fedOK&&Math.abs(j.T-J.nT)<=3)e.p+=dt/6;if(now-e.f>(rsHas('cnid')?12:8)*60e3){j.eph.splice(q,1);ch=true;continue;}
   if(e.p>=1){j.eph.splice(q,1);const g={sz:+rnd(.85,1.15).toFixed(3),m:'n'};const to=bfDeliver(k,g,Math.random()<.5?'♀':'♂');j.done=(j.done||0)+1;S.cons=S.cons||{};S.cons.bred=(S.cons.bred||0)+1;
    toast(`🪼 一隻${J.sn}長成幼水母，送到「${to}」`,3200);ch=true;}}}
 if(ch){markDirty();bfVis();}}
const polCap=()=>[20,35,50,70][bfLv()-1];
function bfBirth(i){const b=ensureBF(),x=b.box[i],r=BRE[x.sp],nm=SP[x.sp].n;const F=x.f,M=x.m;
 const miss=r.need.filter(k=>!has(k)&&!NEED[k].act),acts=r.need.filter(k=>NEED[k].act);
 if(acts.length&&!x.trig){x.p=.92;if(!x.warn){x.warn=1;toast(`⏳ 繁殖箱 ${i+1}：${nm}還差一個觸發條件：${acts.map(k=>NEED[k].n).join('、')}`,4200);}return;}
 x.warn=0;x.trig=0;
 if(r.g==='egg'&&!has('lay')){x.st='rest';x.p=0;F.mood=Math.max(5,(F.mood||60)-45);bfLog(`母${nm}沒有產卵盒，卡蛋了`);toast(`⚠️ 繁殖箱 ${i+1}：沒有產卵盒，母${nm}「卡蛋」，蛋全部沒了，牠需要休養`,5200);return;}
 if((r.g==='spawn'||r.g==='frog')&&miss.some(k=>['rock','slate','mops','soft','hormone','cups','soil','sand','moult'].includes(k))){x.st='court';x.p=.4;toast(`🫧 繁殖箱 ${i+1}：${nm}找不到適合的產卵環境（缺 ${miss.map(k=>NEED[k].n).join('、')}），沒有產卵`,4800);return;}
 const caOK=!r.need.includes('ca')||b.ca>0; if(r.need.includes('ca')){if(b.ca>0)b.ca--;}if(r.need.includes('hormone')){if(b.hor>0)b.hor--;}
 let n=rint(r.n);const gs=[];let mut=false;for(let q=0;q<n;q++){const z=inherit(F,M,x.sp);gs.push(z.g);mut=mut||z.mut;}x.n=(x.n||0)+1;
 if(r.g==='egg'){const fert=r.fert*(caOK?1:.6)*(x.n>3?.8:1);let put=0;for(const g of gs){if(b.eggs.length>=eggCap())break;b.eggs.push({sp:x.sp,g,fert:Math.random()<fert,cand:0,p:0,dent:0,mold:0,hp:1,t0:Date.now(),box:'A'});put++;}
  bfLog(`母${nm}產下 ${put} 顆蛋`);toast(`🥚 繁殖箱 ${i+1}：${nm}下了 ${put} 顆蛋，已移到孵蛋室（A 箱）${mut?'・有突變蛋！':''}${put<n?`・孵蛋室滿了，${n-put} 顆沒地方放`:''}`,4800);}
 else{let alive=n,why='';if(r.need.includes('trap')&&!has('trap')){alive=Math.round(n*.4);why='大魚吃掉了一些小魚';}
  const fd=r.first;if(fd==='brine'){const need=alive*3;if(S.stock.brine>=need)S.stock.brine-=need;else{alive=Math.round(alive*.35);why=(why?why+'、':'')+'豐年蝦不夠，小魚餓死了一些';}}
  else if(fd==='copepod'&&!has('copepod')){alive=0;why='幼魚找不到吃得下的食物（需要橈足類）';}
  if(r.hard&&Math.random()<r.hard){alive=Math.max(0,alive-1);why=(why?why+'、':'')+'幼生期很難熬';}
  const to=new Set();for(let q=0;q<alive;q++)to.add(bfDeliver(x.sp,gs[q],Math.random()<.5?'♀':'♂'));S.cons=S.cons||{};S.cons.bred=(S.cons.bred||0)+alive;
  bfLog(`${nm}${r.g==='live'?'生了':'的卵孵化了'}：活下 ${alive}/${n}`);toast(`${r.g==='live'?'🍼':'🫧'} 繁殖箱 ${i+1}：${nm}${r.g==='live'?'生了':'的卵孵化了'}，活下來 ${alive}/${n} 隻${why?'（'+why+'）':''}${alive?'，送到 '+[...to].join('、'):''}`,5600);}
 x.st='rest';x.p=0;F.mood=Math.max(20,(F.mood||70)-10);markDirty();}
/* ---- 介面 ---- */
const chip=(t,on,id)=>`<button class="chip ${on?'on':''}" ${id}>${t}</button>`;
function bfSheet(tab='box'){const b=ensureBF();const tabs=`<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">${chip('🧪 繁殖箱',tab==='box','data-t="box"')}${chip(`🥚 孵蛋室 ${b.eggs.length}`,tab==='egg','data-t="egg"')}${chip('🪼 水母',tab==='jel','data-t="jel"')}${chip('🧰 器材',tab==='gear','data-t="gear"')}${chip('📜 紀錄',tab==='log','data-t="log"')}</div>`;
 let h='';
 if(tab==='box'){h=`<div class="mut sm" style="margin-bottom:6px">繁殖場 Lv.${bfLv()}・${boxN()} 個繁殖箱。把一對成年的公母放進繁殖箱，照著真實的流程：降溫 → 求偶 → 懷孕 → 產卵／生產。</div>`+
  b.box.slice(0,boxN()).map((x,i)=>{if(x.st==='idle')return`<div class="res"><div><b>繁殖箱 ${i+1}</b> <span class="mut">空的</span></div><div class="mut sm">放一對成年公母進來</div><button class="btn sm" data-new="${i}">放入一對</button></div>`;
   const r=BRE[x.sp];return`<div class="res" style="border-left:4px solid ${STC[x.st]}"><div><b>繁殖箱 ${i+1}・${SP[x.sp].n}</b> <span class="mut">${STN[x.st]} ${Math.round(x.p*100)}%</span></div><div class="mut sm">♀ ${esc(x.f.name)} × ♂ ${esc(x.m.name)}・第 ${(x.n||0)+1} 窩</div><button class="btn sm" data-open="${i}">管理</button></div>`;}).join('')+
  (boxN()<8?`<div class="mut sm" style="margin-top:6px">🔒 升級繁殖場（商店 → 設備升級）可以多開繁殖箱，也能繁殖鯊魚、魟魚這類大型物種。</div>`:'');}
 else if(tab==='egg'){const ic=b.inc;h=`<div class="mut sm">兩台孵蛋箱可以設不同溫度。很多爬蟲是「溫度決定性別」，同一窩蛋分兩台孵，就能控制公母比例。蛋放 1 分鐘後可以「照蛋」，看出有沒有受精，沒受精的蛋放著會發霉，還會傳染給旁邊的蛋。</div>`+
  ['A','B'].map(k=>`<div class="res"><div><b>孵蛋箱 ${k}</b> <span class="mut">${b.eggs.filter(e=>(e.box||'A')===k).length} 顆</span></div><div class="sm">🌡 ${ic[k].T}°C <button class="btn sm" data-it="${k},-0.5">−</button><button class="btn sm" data-it="${k},0.5">＋</button>　💧 ${ic[k].H}% <button class="btn sm" data-ih="${k},-5">−</button><button class="btn sm" data-ih="${k},5">＋</button></div><span></span></div>`).join('')+
  (b.eggs.length?b.eggs.map((e,i)=>{const r=BRE[e.sp],c=ic[e.box||'A'];const okT=inR(c.T,r.inc.T),okH=inR(c.H,r.inc.H);const sx=r.tsd?(rsHas('inc')?`・此溫度約 ${Math.round(r.tsd(c.T)*100)}% 母`:'・溫度決定性別（研究「孵化生理學」看比例）'):'・性別 50/50';
   const st=e.cand?(e.fert?'🩸 有血管（受精）':'⚪ 無精蛋'):'❔ 還沒照蛋';const warn=[!okT?`溫度要 ${r.inc.T[0]}–${r.inc.T[1]}°C`:'',!okH?`濕度要 ${r.inc.H[0]}–${r.inc.H[1]}%`:'',e.mold>.3?'🦠 開始發霉':'',e.dent>.3?'🥀 有點凹陷':''].filter(Boolean).join('・');
   return`<div class="row2" style="flex-wrap:wrap"><span>🥚 ${SP[e.sp].n}${gTag({g:e.g})?' '+gTag({g:e.g}):''} <span class="mut sm">[${e.box||'A'}] ${Math.round(e.p*100)}%・${st}${sx}</span>${warn?`<br><span class="sm" style="color:#ffb347">${warn}</span>`:''}</span><span>${!e.cand&&Date.now()-e.t0>60e3?`<button class="btn sm" data-cd="${i}">照蛋</button>`:''}${e.cand&&!e.fert?`<button class="btn sm" data-rm="${i}">丟掉</button>`:''}<button class="btn sm" data-mv="${i}">移到 ${(e.box||'A')==='A'?'B':'A'}</button></span></div>`;}).join(''):'<div class="mut sm" style="margin-top:8px">孵蛋室是空的。</div>');}
 else if(tab==='jel'){h=`<div class="mut sm" style="margin-bottom:6px">水母一生有兩種型態：<b>水螅體</b>（黏在板子上，會「無性出芽」複製自己）→ 降溫觸發<b>橫裂</b>，像疊盤子一樣一片片脫落成<b>碟狀幼體</b> → 餵豐年蝦長成<b>幼水母</b>。展示缸裡有公有母的成體水母，會放出浮浪幼體，自動附著成水螅體送來這裡。</div>`+
  Object.entries(b.jel).map(([k,j])=>{const J=JEL[k];const mode=inR(j.T,J.sT)?`❄️ 橫裂中 ${Math.round(j.sc*100)}%`:Math.abs(j.T-J.nT)<=2?(j.fedT&&Date.now()-j.fedT<5*60e3?'🌱 出芽繁殖中':'🍽 餵食後才會出芽'):'🌡 溫度不適合';
   return`<div class="res"><div><b>🪼 ${J.sn}</b> <span class="mut">${mode}</span></div><div class="sm">水螅體 ${j.pol}/${polCap()}・碟狀幼體 ${j.eph.length}・已長成 ${j.done||0} 隻<br>🌡 ${j.T}°C <button class="btn sm" data-jt="${k},-1">−</button><button class="btn sm" data-jt="${k},1">＋</button> <span class="mut sm">平常 ${J.nT}°C・橫裂 ${J.sT[0]}–${J.sT[1]}°C</span></div><div style="display:flex;flex-direction:column;gap:4px"><button class="btn sm feed" data-jf="${k}">🦐 餵食</button>${j.pol?'':`<button class="btn sm" data-jc="${k}">採集幼體</button>`}</div></div>`;}).join('')+
  `<div class="mut sm" style="margin-top:6px">碟狀幼體 4 分鐘內要餵一次，超過 8 分鐘沒吃會死掉。豐年蝦庫存：${S.stock.brine}</div>`;}
 else if(tab==='gear'){h=`<div class="mut sm" style="margin-bottom:6px">不同物種要的器材不一樣，缺了就會繁殖失敗。</div>`+Object.entries(NEED).filter(([k,n])=>!n.act).map(([k,n])=>{const own=k==='ca'?b.ca:k==='hormone'?b.hor:b.items[k]?'已擁有':'';
  return`<div class="res"><div><b>${n.n}</b> <span class="mut">${own!==''&&own!==0?(typeof own==='number'?'剩 '+own+' 份':own):''}</span></div><div class="mut sm">${n.d}</div>${n.use?`<button class="btn sm" data-buy="${k}">買 5 份 ${fmt$(n.c*5)}</button>`:b.items[k]?'<span></span>':`<button class="btn sm" data-buy="${k}">買 ${fmt$(n.c)}</button>`}</div>`;}).join('');}
 else h=b.log.length?b.log.map(l=>`<div class="row2"><span class="sm">${esc(l.x)}</span><span class="mut sm">${agoT(Date.now()-l.t)}</span></div>`).join(''):'<div class="mut sm">還沒有紀錄。</div>';
 sheet('🏭 繁殖場',tabs+h,c=>{c.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>bfSheet(x.dataset.t));
  c.querySelectorAll('[data-new]').forEach(x=>x.onclick=()=>pickPair(+x.dataset.new));c.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>boxSheet(+x.dataset.open));
  c.querySelectorAll('[data-it]').forEach(x=>x.onclick=()=>{const [k,d]=x.dataset.it.split(',');b.inc[k].T=Math.round((b.inc[k].T+ +d)*2)/2;markDirty();bfSheet('egg');});
  c.querySelectorAll('[data-ih]').forEach(x=>x.onclick=()=>{const [k,d]=x.dataset.ih.split(',');b.inc[k].H=clamp(b.inc[k].H+ +d,30,100);markDirty();bfSheet('egg');});
  c.querySelectorAll('[data-cd]').forEach(x=>x.onclick=()=>{const e=b.eggs[+x.dataset.cd];e.cand=1;markDirty();toast(e.fert?'🩸 照蛋：看得到血管，是受精蛋':'⚪ 照蛋：裡面是黃色的，沒有受精',2600);bfSheet('egg');});
  c.querySelectorAll('[data-rm]').forEach(x=>x.onclick=()=>{b.eggs.splice(+x.dataset.rm,1);markDirty();bfSheet('egg');});
  c.querySelectorAll('[data-mv]').forEach(x=>x.onclick=()=>{const e=b.eggs[+x.dataset.mv];e.box=(e.box||'A')==='A'?'B':'A';markDirty();bfSheet('egg');});
  c.querySelectorAll('[data-jt]').forEach(x=>x.onclick=()=>{const [k,d]=x.dataset.jt.split(',');b.jel[k].T=clamp(b.jel[k].T+ +d,6,30);markDirty();bfSheet('jel');});
  c.querySelectorAll('[data-jf]').forEach(x=>x.onclick=()=>{const k=x.dataset.jf,j=b.jel[k],n=Math.max(1,Math.ceil((j.pol+j.eph.length)/6));if(S.stock.brine<n){toast(`豐年蝦不夠（要 ${n}），去 2F 收集豐年蝦`);return;}S.stock.brine-=n;j.fedT=Date.now();for(const e of j.eph)e.f=Date.now();markDirty();toast(`🦐 餵了 ${JEL[k].sn}（用掉 ${n} 份豐年蝦）`);bfSheet('jel');});
  c.querySelectorAll('[data-jc]').forEach(x=>x.onclick=()=>{const k=x.dataset.jc;const ad=[];for(const id in TANKS)for(const e of TANKS[id].st.animals)if(e.sp===k&&e.size>=.9)ad.push(e);
   if(!ad.some(e=>e.sex==='♀')||!ad.some(e=>e.sex==='♂')){toast(`要先在展示缸養一公一母成年的${JEL[k].sn}，才採集得到浮浪幼體`,4200);return;}const n=3+(Math.random()*4|0);b.jel[k].pol+=n;markDirty();bfLog(`採集 ${JEL[k].sn}浮浪幼體，附著成 ${n} 個水螅體`);toast(`🔬 採到浮浪幼體，附著成 ${n} 個水螅體`,3200);bfSheet('jel');});
  c.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{const k=x.dataset.buy,n=NEED[k];if(n.use){if(!pay(n.c*5,n.n))return;if(k==='ca')b.ca+=5;else b.hor+=5;}else{if(!pay(n.c,n.n))return;b.items[k]=1;}markDirty();toast('🛒 買了 '+n.n);bfSheet('gear');});});}
function pickPair(i){const ks=Object.keys(BRE).filter(k=>SP[k]);const opts=ks.map(k=>{const a=adults(k);const f=a.filter(o=>o.e.sex==='♀'),m=a.filter(o=>o.e.sex==='♂');return{k,f,m};}).filter(o=>o.f.length&&o.m.length);
 sheet(`🧪 繁殖箱 ${i+1}：選物種`,opts.length?opts.map(o=>{const r=BRE[o.k];const lock=(r.lv||1)>bfLv();return`<button class="opt" data-k="${o.k}" ${lock?'disabled style="opacity:.5"':''}><b>${SP[o.k].n} <span class="mut sm">${GN[r.g]}</span></b><span class="mut">♀ ${o.f.length} 隻・♂ ${o.m.length} 隻${lock?`・🔒 要繁殖場 Lv.${r.lv}`:''}</span></button>`;}).join(''):'<div class="mut sm">展示缸裡沒有可以配對的成年公母。可以繁殖的物種：守宮、鬆獅蜥、烏龜、蟒蛇、變色龍、角蛙、箭毒蛙、孔雀魚、海馬、小丑魚、神仙魚、七彩、錦鯉、石斑、倒吊、魟魚、鯊魚…（水母請用「🪼 水母」分頁）</div>',
  c=>c.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{const o=opts.find(z=>z.k===x.dataset.k);if((BRE[o.k].lv||1)>bfLv())return;pickOne(i,o,'f');}));}
function pickOne(i,o,s,F){const list=s==='f'?o.f:o.m;sheet(`選${s==='f'?'母':'公'}的 ${SP[o.k].n}`,list.map((a,q)=>`<button class="opt" data-q="${q}"><b>${s==='f'?'♀':'♂'} ${esc(a.e.name)}${gTag(a.e)?' '+gTag(a.e):''}</b><span class="mut">${a.tk?'在「'+esc(tName(a.tk))+'」':'🧊 基因庫'}・心情 ${Math.round(a.e.mood)}・飽食 ${Math.round(a.e.hunger)}</span></button>`).join(''),
 c=>c.querySelectorAll('[data-q]').forEach(x=>x.onclick=()=>{const a=list[+x.dataset.q];if(s==='f')pickOne(i,o,'m',a);else startBox(i,o.k,F,a);}));}
function startBox(i,k,F,M){const b=ensureBF(),r=BRE[k];ensureGenes(F.e);ensureGenes(M.e);takeOut(F.tk,F.e);takeOut(M.tk,M.e);
 b.box[i]={st:r.cool?'cool':'court',sp:k,f:F.e,m:M.e,p:0,n:0,T:r.cool?r.coolT[1]:Math.round((r.T[0]+r.T[1])/2),H:r.H?Math.round((r.H[0]+r.H[1])/2):null,trig:0};markDirty();bfLog(`${SP[k].n} ${F.e.name} × ${M.e.name} 進入繁殖箱 ${i+1}`);
 toast(r.cool?`❄️ ${SP[k].n}進入繁殖箱，先降溫 ${r.coolT[0]}–${r.coolT[1]}°C 模擬冬天`:`💞 ${SP[k].n}進入繁殖箱，開始求偶`,3600);bfVis();boxSheet(i);}
function boxSheet(i){const b=ensureBF(),x=b.box[i];if(x.st==='idle'){bfSheet('box');return;}const r=BRE[x.sp];const tgt=x.st==='cool'?r.coolT:r.T;const okT=inR(x.T,tgt),okH=!r.H||x.st==='cool'||inR(x.H,r.H);
 const steps=['cool','court','gest','rest'].filter(s=>s!=='cool'||r.cool).map(s=>`<span style="padding:2px 8px;border-radius:10px;background:${s===x.st?STC[s]:'#223'};color:${s===x.st?'#04131c':'#9ab'}">${STN[s]}</span>`).join(' → ');
 const needs=r.need.map(k=>{const n=NEED[k];const ok=n.act?(x.st==='gest'?x.trig:null):has(k);return`<div class="row2"><span>${n.n} <span class="mut sm">${n.d}</span></span>${n.act?(x.st==='gest'?(x.trig?'<span>✅</span>':`<button class="btn sm feed" data-act="${k}">執行</button>`):'<span class="mut sm">懷孕期再做</span>'):ok?'<span>✅</span>':'<span style="color:#ff8a8a">缺少</span>'}</div>`;}).join('');
 sheet(`🧪 繁殖箱 ${i+1}・${SP[x.sp].n}`,`<div class="sm" style="margin-bottom:6px;line-height:2">${steps}</div>
  <div class="res"><div><b>${STN[x.st]}</b> <span class="mut">${Math.round(x.p*100)}%</span></div><div class="mut sm">${x.st==='cool'?`溫度要維持在 ${r.coolT[0]}–${r.coolT[1]}°C，模擬冬天`:x.st==='court'?`溫度 ${r.T[0]}–${r.T[1]}°C${r.H?`、濕度 ${r.H[0]}–${r.H[1]}%`:''}，牠們才會求偶`:x.st==='gest'?`維持溫度，準備好下面的器材`:'母的產後要休養，之後可以再生一窩'}</div><span></span></div>
  <div class="row2"><span>🌡 溫度 <b style="color:${okT?'#6fd38c':'#ff8a8a'}">${x.T}°C</b> <span class="mut sm">目標 ${tgt[0]}–${tgt[1]}</span></span><span><button class="btn sm" data-dt="-1">−</button><button class="btn sm" data-dt="1">＋</button></span></div>
  ${r.H&&x.st!=='cool'?`<div class="row2"><span>💧 濕度 <b style="color:${okH?'#6fd38c':'#ff8a8a'}">${x.H}%</b> <span class="mut sm">目標 ${r.H[0]}–${r.H[1]}</span></span><span><button class="btn sm" data-dh="-5">−</button><button class="btn sm" data-dh="5">＋</button></span></div>`:''}
  ${needs?`<h4 style="margin:10px 0 4px">需要的器材</h4>${needs}`:''}
  <div class="mut sm" style="margin:10px 0;line-height:1.6">📖 ${r.f}</div>
  <div style="display:flex;gap:6px"><button class="btn" style="flex:1" data-back="1">← 繁殖場</button><button class="btn" style="flex:1" data-end="1">結束，送回展示缸</button></div>`,
 c=>{c.querySelectorAll('[data-dt]').forEach(y=>y.onclick=()=>{x.T=clamp(x.T+ +y.dataset.dt,8,40);markDirty();boxSheet(i);});c.querySelectorAll('[data-dh]').forEach(y=>y.onclick=()=>{x.H=clamp(x.H+ +y.dataset.dh,10,100);markDirty();boxSheet(i);});
  c.querySelectorAll('[data-act]').forEach(y=>y.onclick=()=>{x.trig=1;markDirty();toast(y.dataset.act==='rain'?'🌧 灑水模擬大雨，蛙開始抱接':'🚿 大量換水，模擬春天的雨',3000);boxSheet(i);});
  c.querySelector('[data-back]').onclick=()=>bfSheet('box');c.querySelector('[data-end]').onclick=()=>{const a=putBack(x.f),m=putBack(x.m);b.box[i]={st:'idle'};markDirty();bfVis();toast(`🏠 ${SP[x.sp].n}回到「${a}」${m!==a?'、「'+m+'」':''}`,3200);bfSheet('box');};});}
/* ---- 展示缸裡的繁殖：爬蟲改到繁殖場，水母改成生活史 ---- */
const _cb2=checkBreed;checkBreed=function(tk){const st=tk.st,now=Date.now();st.brT=st.brT||{};ensureBF();
 for(const k of new Set(st.animals.map(e=>e.sp))){const r=BRE[k];if(r&&(r.g==='egg'||r.g==='frog'))st.brT[k]=now;
  else if(r&&now-(st.brT[k]||0)>=240e3&&Math.random()<.5)st.brT[k]=now;
  if(JEL[k]){st.brT[k]=now;if(now-(st['pl_'+k]||0)>240e3){st['pl_'+k]=now;const ad=st.animals.filter(e=>e.sp===k&&e.size>=.9);if(ad.some(e=>e.sex==='♀')&&ad.some(e=>e.sex==='♂')&&Math.random()<.35){const j=S.bf.jel[k];const n=2+(Math.random()*3|0);if(j.pol<polCap()){j.pol=Math.min(polCap(),j.pol+n);bfLog(`展示缸的${JEL[k].sn}放出浮浪幼體，附著成 ${n} 個水螅體`);toast(`🪼 ${JEL[k].sn}放出浮浪幼體，在繁殖場附著成 ${n} 個水螅體`,4000);}}}}}
 _cb2(tk);};
/* ---- 3D：二樓新翼 ---- */
let WRET=null;const WV={};
wingLvl(function(){const X=WG.x,Z=WG.z;const g=new THREE.Group();g.position.copy(WG);scene.add(g);WV.g=g;
 const fl=new THREE.MeshStandardMaterial({color:C(0xcfd6dc),roughness:.6}),wl=new THREE.MeshStandardMaterial({color:C(0xe9edf0),roughness:.9}),dk=new THREE.MeshStandardMaterial({color:C(0x2b3440),roughness:.6,metalness:.3}),
  gl=new THREE.MeshStandardMaterial({color:C(0xbfe6ff),transparent:true,opacity:.22,roughness:.05,metalness:.1,depthWrite:false}),em=c=>new THREE.MeshBasicMaterial({color:C(c)});
 box(24,.1,20,fl,0,-.05,0,g);box(24,.1,20,new THREE.MeshStandardMaterial({color:C(0xf4f6f8),roughness:1}),0,4.05,0,g);
 box(24,4,.2,wl,0,2,-10,g);box(24,4,.2,wl,0,2,10,g);box(.2,4,17.2,wl,-12,2,-1.4,g);box(.2,4,.2,wl,-12,2,9.9,g);box(.2,1,2.6,wl,-12,3.5,8.5,g);[[-10,-7.5],[-5.5,-1.5],[.5,4.5],[6.5,10]].forEach(([a,b])=>box(.2,4,b-a,wl,12,2,(a+b)/2,g));box(.2,1.4,20,wl,12,3.3,0,g);box(.2,4,8,wl,0,2,-6,g);box(.2,4,8,wl,0,2,6,g);
 for(let x=-9;x<=9;x+=6)for(let z=-6;z<=6;z+=6)box(1.6,.04,.5,em(0xffffff),x,4,z,g);
 box(23.8,.02,.4,new THREE.MeshStandardMaterial({color:C(0x3fb6a8)}),0,.01,0,g);
 const sign=(t,sub,x,y,z,ry,w=3.2)=>{const m=add(new THREE.PlaneGeometry(w,w*.22),new THREE.MeshBasicMaterial({map:vText([[t,64,.42],[sub||'',30,.8,'#9fd8ff']],720,160,'#16222e','#ffffff')}),x,y,z,g);m.rotation.y=ry;return m;};
 sign('🏭 繁殖場','BREEDING CENTER',-6,3.4,9.85,Math.PI);sign('🏭 繁殖場','BREEDING CENTER',-.12,3.2,-2,-Math.PI/2,2.6);
 /* 繁殖箱：西牆兩層架 */
 WV.boxes=[];for(let r=0;r<2;r++)for(let q=0;q<4;q++){const i=r*4+q,y=1+r*1.25,z=-5.4+q*2.6;box(1.1,.08,2.4,dk,-11.3,y-.5,z,g);const bx=new THREE.Group();bx.position.set(-11.2,y,z);g.add(bx);
  box(.9,.9,2.2,gl,0,0,0,bx);box(.92,.06,2.22,dk,0,.47,0,bx);box(.6,.1,1.6,new THREE.MeshStandardMaterial({color:C(0x9a7a52)}),-.1,-.4,0,bx);
  const cv=document.createElement('canvas');cv.width=256;cv.height=96;const tx=new THREE.CanvasTexture(cv);const lb=add(new THREE.PlaneGeometry(1.4,.52),new THREE.MeshBasicMaterial({map:tx}),.47,.18,0,bx);lb.rotation.y=Math.PI/2;
  const led=add(new THREE.SphereGeometry(.05,8,6),new THREE.MeshBasicMaterial({color:C(0x3a4654)}),.47,-.3,.95,bx);const ani=add(new THREE.SphereGeometry(.12,10,8),new THREE.MeshStandardMaterial({color:C(0x8a9a6a)}),-.1,-.25,-.3,bx);ani.scale.set(1.6,.6,.8);
  const ani2=ani.clone();ani2.position.z=.35;bx.add(ani2);WV.boxes.push({bx,cv,tx,led,ani,ani2});STATIONS.push({p:V(X-10.75,y,Z+z),fn:()=>{if(i>=boxN()){toast(`🔒 繁殖箱 ${i+1} 還沒開放，升級繁殖場（商店 → 設備升級）`,3200);return;}const x=ensureBF().box[i];x.st==='idle'?pickPair(i):boxSheet(i);}});}
 OBST.push([X-12,X-10.4,Z-7,Z+7]);
 /* 孵蛋箱 */
 WV.inc=[];[['A',-9],['B',-6.6]].forEach(([k,x])=>{const cb=new THREE.Group();cb.position.set(x,0,-9.4);g.add(cb);box(1.6,1.9,.9,dk,0,.95,0,cb);box(1.3,1.3,.05,new THREE.MeshStandardMaterial({color:C(0xffa040),emissive:C(0x7a3a00),transparent:true,opacity:.85}),0,1.1,.46,cb);
  for(let s=0;s<3;s++)box(1.2,.03,.6,new THREE.MeshStandardMaterial({color:C(0xd8d0c0)}),0,.6+s*.4,.05,cb);const cv=document.createElement('canvas');cv.width=256;cv.height=72;const tx=new THREE.CanvasTexture(cv);add(new THREE.PlaneGeometry(1.4,.4),new THREE.MeshBasicMaterial({map:tx}),0,2.15,.46,cb);
  const eggs=[];for(let e=0;e<12;e++){const m=add(new THREE.SphereGeometry(.06,8,6),new THREE.MeshStandardMaterial({color:C(0xf3ead8)}),-.45+(e%6)*.18,.66+Math.floor(e/6)*.4,.1+((e*7)%3)*.08,cb);m.scale.y=1.3;m.visible=false;eggs.push(m);}
  WV.inc.push({k,cv,tx,eggs});STATIONS.push({p:V(X+x,1.1,Z-8.9),fn:()=>bfSheet('egg')});});OBST.push([X-10,X-5.6,Z-10,Z-8.8]);
 /* 水母：水螅培養板 + 圓形 Kreisel 缸 */
 const kr=new THREE.Group();kr.position.set(-4.2,1.6,-6.5);g.add(kr);box(2.4,.9,1.2,dk,0,-1.15,0,kr);const ring=add(new THREE.CylinderGeometry(1,1,.5,40,1,true),new THREE.MeshStandardMaterial({color:C(0x0a3a5a),side:THREE.DoubleSide,roughness:.2}),0,0,0,kr);ring.rotation.x=Math.PI/2;
  const face=add(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({color:C(0x0d4f80),transparent:true,opacity:.92}),0,0,-.24,kr);const glass=add(new THREE.CircleGeometry(1,40),gl,0,0,.25,kr);
  WV.eph=[];for(let e=0;e<30;e++){const m=add(new THREE.CircleGeometry(.05,8),new THREE.MeshBasicMaterial({color:C(0xffe9c8),transparent:true,opacity:.85}),0,0,0,kr);m.visible=false;WV.eph.push(m);}
 const pt=new THREE.Group();pt.position.set(-7.4,1.15,-6.5);g.add(pt);box(1.4,.5,1,dk,0,-.55,0,pt);box(1.3,.7,.9,gl,0,0,0,pt);box(1.1,.04,.7,new THREE.MeshStandardMaterial({color:C(0x8a8a8a)}),0,-.25,0,pt);
  WV.pol=[];for(let e=0;e<70;e++){const m=add(new THREE.ConeGeometry(.018,.07,5),new THREE.MeshBasicMaterial({color:C(0xfff4e0)}),-.5+(e%10)*.11,-.2,-.3+Math.floor(e/10)*.09,pt);m.visible=false;WV.pol.push(m);}
 sign('🪼 水母生活史','水螅體 → 橫裂 → 碟狀幼體',-5.8,3.1,-9.85,0,3);
 STATIONS.push({p:V(X-4.2,1.6,Z-6),fn:()=>bfSheet('jel')},{p:V(X-7.4,1.2,Z-6),fn:()=>bfSheet('jel')});OBST.push([X-8.3,X-2.9,Z-7.3,Z-5.7]);
 /* 管理電腦 */
 box(1.6,.8,.7,dk,-3,.4,4.5,g);const scr=add(new THREE.PlaneGeometry(1,.6),new THREE.MeshBasicMaterial({map:vText([['🏭 繁殖場總覽',44,.4],['點我管理',30,.75,'#9fd8ff']],400,240,'#0d2a3a','#ffffff')}),-3,1.25,4.2,g);scr.rotation.x=-.25;
 STATIONS.push({p:V(X-3,1.1,Z+4.4),fn:()=>bfSheet('box')});OBST.push([X-3.9,X-2.1,Z+4,Z+5]);
 /* 東側：之後開放的區域 */
 WV.door={};[['lf','🦗 活餌區','LIVE FOOD',-6.5],['rs','🔬 研究區','RESEARCH',-.5],['cs','🌏 保育中心','CONSERVATION',5.5]].forEach(([id,t,s,z])=>{const sh=box(.1,2.6,2.2,new THREE.MeshStandardMaterial({color:C(0x59626c),metalness:.4,roughness:.5}),11.9,1.3,z,g);sign(t,s,11.85,3.2,z,-Math.PI/2,2.6);
  const tp=add(new THREE.PlaneGeometry(2.1,.25),new THREE.MeshBasicMaterial({map:vText([['施工中',30,.5]],512,48,'#f2c230','#111')}),11.8,1.4,z,g);tp.rotation.y=-Math.PI/2;WV.door[id]={sh,tp,z};});
 /* 出口 */
 sign('← 二樓展廳','',-11.85,3.5,8.5,Math.PI/2,2.2);
 AREAS.push([X-11.5,X+11.5,Z-9.5,Z+9.5]);OBST.push([X-.25,X+.25,Z-10,Z-2],[X-.25,X+.25,Z+2,Z+10]);
});
/* 二樓東牆打通，接一條走廊到新翼 */
(function(){const w=scene.children.find(m=>m.isMesh&&Math.abs(m.position.x-12.1)<.01&&Math.abs(m.position.y-7.3)<.01&&Math.abs(m.position.z-8)<.01&&m.geometry.parameters&&m.geometry.parameters.depth===16);const mt=w?w.material:new THREE.MeshStandardMaterial({color:C(0xe9edf0)});if(w)scene.remove(w);
 box(.2,4.6,9.2,mt,12.1,7.3,4.6);box(.2,4.6,4.2,mt,12.1,7.3,13.9);box(.2,.6,2.6,mt,12.1,9.3,10.5);
 const fl=new THREE.MeshStandardMaterial({color:C(0xcfd6dc),roughness:.6}),wl=new THREE.MeshStandardMaterial({color:C(0xe9edf0),roughness:.9});
 box(4.3,.1,2.8,fl,14.15,4.95,10.5);box(4.3,.1,2.8,new THREE.MeshStandardMaterial({color:C(0xf4f6f8)}),14.15,9.05,10.5);box(4.3,4,.15,wl,14.15,7,9.12);box(4.3,4,.15,wl,14.15,7,11.88);
 box(4.1,.02,.3,new THREE.MeshStandardMaterial({color:C(0x3fb6a8)}),14.15,5.01,10.5);box(1.4,.04,.4,new THREE.MeshBasicMaterial({color:C(0xffffff)}),14.15,8.98,10.5);
 const sg=add(new THREE.PlaneGeometry(2.4,.56),new THREE.MeshBasicMaterial({map:vText([['二樓新翼 →',52,.42],['繁殖場・活餌・研究・保育',26,.8,'#9fd8ff']],600,140,'#16222e','#ffffff')}),11.98,8.6,10.5);sg.rotation.y=-Math.PI/2;
 AREAS2.push([11.4,16.8,9.4,11.6]);})();

function goWing(){if(typeof curW==='function'&&curW()&&typeof endFish==='function')endFish();if(!inWing())WRET={x:player.x,y:player.y,z:player.z,yaw:player.yaw};Object.assign(player,{x:WG.x-9,y:5,z:WG.z+8.5,yaw:0,pitch:0});bfVis();toast('🏢 二樓新翼：繁殖場',2200);}
function leaveWing(){const r={x:9,y:5,z:10.5,yaw:Math.PI/2};Object.assign(player,{x:r.x,y:r.y,z:r.z,yaw:r.yaw,pitch:0});WRET=null;toast('🏛 回到二樓',1800);}
const inWing=()=>player.y>2.5&&player.x>13.9&&player.x<WG.x+29&&Math.abs(player.z-WG.z)<11;
function bfVis(){if(!WV.boxes)return;const b=ensureBF();
 WV.boxes.forEach((o,i)=>{const x=b.box[i],lock=i>=boxN();const c=o.cv.getContext('2d');c.fillStyle=lock?'#111820':STC[x.st]||'#3a4654';c.fillRect(0,0,256,96);c.fillStyle=lock||x.st==='idle'?'#cfe':'#04131c';c.textAlign='center';c.font='700 30px "PingFang TC",sans-serif';
  c.fillText(lock?'🔒 未開放':x.st==='idle'?`繁殖箱 ${i+1}`:SP[x.sp].n,128,38);c.font='600 24px "PingFang TC",sans-serif';c.fillText(lock?'升級繁殖場':x.st==='idle'?'空的・點我放入':`${STN[x.st]} ${Math.round(x.p*100)}%`,128,76);o.tx.needsUpdate=true;
  o.led.material.color.set(lock?0x111111:x.st==='idle'?0x3a4654:STC[x.st]);o.ani.visible=o.ani2.visible=!lock&&x.st!=='idle';});
 WV.inc.forEach(o=>{const n=b.eggs.filter(e=>(e.box||'A')===o.k).length,c=b.inc[o.k];const x=o.cv.getContext('2d');x.fillStyle='#0d1a24';x.fillRect(0,0,256,72);x.fillStyle='#ffb347';x.textAlign='center';x.font='700 26px "PingFang TC",sans-serif';x.fillText(`孵蛋箱 ${o.k}・${c.T}°C・${c.H}%`,128,30);x.fillStyle='#cfe';x.font='600 22px sans-serif';x.fillText(`${n} 顆蛋`,128,60);o.tx.needsUpdate=true;o.eggs.forEach((m,i)=>m.visible=i<n);});
 const pol=Object.values(b.jel).reduce((a,j)=>a+j.pol,0),eph=Object.values(b.jel).reduce((a,j)=>a+j.eph.length,0);WV.pol.forEach((m,i)=>m.visible=i<pol);WV.eph.forEach((m,i)=>m.visible=i<eph);}
globalAnims.push((dt,t)=>{if(!WV.eph||!inWing())return;WV.eph.forEach((m,i)=>{if(!m.visible)return;const a=t*.35+i*2.39,r=.25+((i*37)%60)/100;m.position.set(Math.cos(a)*r,Math.sin(a)*r,-.05+((i*13)%10)/100);m.rotation.z=t*2+i;});
 WV.boxes.forEach((o,i)=>{if(o.ani.visible){o.ani.position.x=-.1+Math.sin(t*.7+i)*.12;o.ani2.position.x=-.1+Math.cos(t*.6+i*2)*.12;}});});
/* ---- 入口 ---- */
const _ms5=mapSheet;mapSheet=function(){_ms5();if(typeof VISIT!=='undefined'&&VISIT)return;const c=$('#shC'),b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:6px';b.textContent=inWing()?'🏛 回二樓':'🏢 二樓新翼：繁殖場・水母・孵蛋室';b.onclick=()=>{$('#sheet').classList.remove('open');inWing()?leaveWing():goWing();};c.insertBefore(b,c.children[1]||null);};
setInterval(()=>bfTick(),2000);setTimeout(()=>{if(loaded){ensureBF();bfVis();}},3000);

