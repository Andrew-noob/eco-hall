/* =================================================================
   二樓新翼東側：活餌區（每種活餌有自己的養法，產出高品質活餌）
   ================================================================= */
/* ---- 東側三間房的外殼 ---- */
(function(){const g=WV.g,X=WG.x,Z=WG.z;const wl=new THREE.MeshStandardMaterial({color:C(0xe9edf0),roughness:.9}),fl=new THREE.MeshStandardMaterial({color:C(0xc8d0d6),roughness:.6});
 box(16,.1,20,fl,20,-.05,0,g);box(16,.1,20,new THREE.MeshStandardMaterial({color:C(0xf4f6f8),roughness:1}),20,4.05,0,g);
 box(.2,4,20,wl,28,2,0,g);box(16,4,.2,wl,20,2,-10,g);box(16,4,.2,wl,20,2,10,g);box(16,4,.2,wl,20,2,-3.2,g);box(16,4,.2,wl,20,2,2.8,g);
 for(const z of[-6.6,-.2,6.4])for(const x of[16,24])box(1.6,.04,.5,new THREE.MeshBasicMaterial({color:C(0xffffff)}),x,4,z,g);
 AREAS.push([X+12.2,X+27.6,Z-9.6,Z-3.6]);})();
function openDoor(id){const d=WV.door&&WV.door[id];if(!d||d.open)return;d.open=1;d.sh.visible=false;d.tp.visible=false;AREAS.push([WG.x+11.2,WG.x+12.8,WG.z+d.z-.95,WG.z+d.z+.95]);}
openDoor('lf');
/* ---- 資料 ---- */
const LFN={nau:['🦐','新鮮無節幼體'],roti:['🦠','輪蟲'],cope:['🦐','橈足類'],gut:['🦗','腸道負載蟋蟀'],worm:['🐛','大麥蟲'],ff:['🪰','果蠅'],pinky:['🐁','乳鼠']};
function ensureLF(){ensureBF();S.lf=S.lf||{};const L=S.lf;L.st=L.st||{};for(const k in LFN)L.st[k]=L.st[k]||0;
 L.br=L.br||[{st:'idle'},{st:'idle'},{st:'idle'}];L.cy=L.cy??3;
 L.pl=L.pl||{alg:.3,light:1,fert:0,roti:0,cope:0,crash:0};
 L.cr=L.cr||{ad:0,eggs:[],pin:[],moist:65,T:30,clean:100,food:0,gutT:0};
 L.sw=L.sw||{lar:0,cups:[],bee:0,eggT:0,bran:0};
 L.ff=L.ff||{v:[],T:24};L.ms=L.ms||{trio:0,preg:0,lit:[],clean:100,rest:0};L.lt=L.lt||Date.now();return L;}
const lfAdd=(k,n)=>{const L=ensureLF();L.st[k]=Math.min(L.st[k]+n,{nau:120,roti:200,cope:120,gut:150,worm:120,ff:200,pinky:40}[k]);};
const lfUse=(k,n)=>{const L=ensureLF();if(L.st[k]>=n){L.st[k]-=n;return true;}return false;};
/* ---- 時間推進 ---- */
function lfTick(){if(!loaded||(typeof VISIT!=='undefined'&&VISIT))return;const L=ensureLF(),now=Date.now();const dt=Math.min((now-L.lt)/60000,720);L.lt=now;if(dt<=0)return;let ch=0;
 /* 豐年蝦孵化錐 */
 for(const c of L.br){if(c.st==='hatch'){const ok=inR(c.sal,[20,35])&&c.air;const sp=c.T>=26&&c.T<=30?1:c.T>=22&&c.T<=32?.55:.15;if(ok)c.p+=dt/2*sp;else c.bad=(c.bad||0)+dt;
   if(c.bad>3){c.st='idle';toast(`💀 豐年蝦孵化錐：${!c.air?'沒有打氣，卵沉底悶死了':'鹽度不對，孵化失敗'}`,3600);ch=1;}
   if(c.p>=1){c.st='ready';c.t1=now;const rate=(c.dec?.85:.6)*(inR(c.sal,[25,30])?1:.8);c.n=Math.round(c.g*rate*12);toast(`🦐 豐年蝦孵出來了！約 ${c.n} 份無節幼體，6 分鐘內收成最營養`,4000);ch=1;}}
  else if(c.st==='ready'&&now-c.t1>12*60e3){c.st='idle';toast('💀 孵出的豐年蝦太久沒收成，全死了',3200);ch=1;}}
 /* 浮游生物鏈：微藻 → 輪蟲、橈足類 */
 const P=L.pl;if(P.crash>0){P.crash-=dt;if(P.crash<=0){P.crash=0;}}else{const gr=(P.light?.35:-.08)*(P.fert>0?1.4:1)*(rsHas('plank')?1.4:1);P.alg=clamp(P.alg+gr*dt*P.alg*(1-P.alg/1.3)+(P.light?.01*dt:0),0,1.4);P.fert=Math.max(0,P.fert-dt);
  const eat=Math.min(P.alg,(P.roti*.004+P.cope*.006)*dt);P.alg-=eat;const food=P.alg>.15;P.roti=clamp(P.roti+(food?(P.roti>0?(P.roti*.5+2)*(rsHas('plank')?1.4:1):0):-P.roti*.3)*dt,0,400);P.cope=clamp(P.cope+(food?(P.cope>0?P.cope*.22+.6:0):-P.cope*.2)*dt,0,250);
  if(P.alg>(rsHas('plank')?1.3:1.2)){P.over=(P.over||0)+dt;if(P.over>3){P.alg=.05;P.roti*=.2;P.cope*=.4;P.crash=2;P.over=0;toast('💀 綠水太濃「崩缸」了：藻類一夜死光，輪蟲也跟著死了大半',4800);ch=1;}}else P.over=0;}
 /* 蟋蟀 */
 const R=L.cr;if(R.ad>0){R.clean=Math.max(0,R.clean-dt*(2+R.ad/60));R.moist=Math.max(0,R.moist-dt*6);R.food=Math.max(0,R.food-dt);
  const ok=inR(R.T,[27,33])&&R.food>0;if(R.clean<25){const d=Math.ceil(R.ad*.15*dt);R.ad=Math.max(0,R.ad-d);if(d&&Math.random()<.3)toast('🦗 蟋蟀箱太臭（氨氣），蟋蟀一直死，快清理',3200);ch=1;}
  if(!R.food&&R.ad>0&&Math.random()<dt*.5){R.ad=Math.max(0,R.ad-Math.ceil(R.ad*.1));toast('🦗 蟋蟀沒東西吃，開始互相啃食',3000);ch=1;}
  R.lay=(R.lay||0)+(ok&&inR(R.moist,[50,85])?dt:0);if(R.lay>=2&&R.ad>=10){R.lay=0;R.eggs.push({t:0,n:Math.round(R.ad*.4)});ch=1;}}
 for(let i=R.eggs.length-1;i>=0;i--){const e=R.eggs[i];if(inR(R.moist,[45,90])&&inR(R.T,[26,34]))e.t+=dt;else if(R.moist<30)e.n=Math.round(e.n*(1-.3*dt));if(e.n<=0){R.eggs.splice(i,1);continue;}if(e.t>=3){R.eggs.splice(i,1);R.pin.push({t:0,n:e.n});toast(`🦗 蟋蟀卵孵化了，${e.n} 隻小蟋蟀`,2600);ch=1;}}
 for(let i=R.pin.length-1;i>=0;i--){const e=R.pin[i];if(R.food>0)e.t+=dt;if(e.t>=4){R.pin.splice(i,1);R.ad=Math.min(400,R.ad+e.n);ch=1;}}
 /* 大麥蟲 */
 const W=L.sw;for(let i=W.cups.length-1;i>=0;i--){const c=W.cups[i];c.t+=dt;if(c.t>=5){W.cups.splice(i,1);W.bee++;ch=1;}}
 if(W.bee>=2){W.eggT+=dt*(W.bran>0?1:.3);if(W.eggT>=2){W.eggT=0;const n=W.bee*6;W.lar=Math.min(300,W.lar+n);toast(`🐛 大麥蟲甲蟲產卵，孵出 ${n} 隻小蟲`,2800);ch=1;}W.beeAge=(W.beeAge||0)+dt;if(W.beeAge>15){W.beeAge=0;W.bee=Math.max(0,W.bee-2);toast('🪲 兩隻大麥蟲甲蟲老死了',2400);ch=1;}}
 W.bran=Math.max(0,W.bran-dt*.5);if(W.lar>0&&W.bran<=0&&Math.random()<dt*.3){W.lar=Math.max(0,W.lar-Math.ceil(W.lar*.08));ch=1;}
 /* 果蠅 */
 for(let i=L.ff.v.length-1;i>=0;i--){const v=L.ff.v[i];v.t+=dt*(L.ff.T>28?.6:L.ff.T<20?.5:1);if(L.ff.T>28)v.ster=1;if(v.t>16){L.ff.v.splice(i,1);toast('🪰 一瓶果蠅培養瓶衰退（長蟎了），丟掉了',2600);ch=1;}}
 /* 鼠類 */
 const M=L.ms;if(M.trio){M.clean=Math.max(0,M.clean-dt*4);if(M.rest>0)M.rest-=dt;else if(!M.preg&&M.clean>30){M.preg=dt;}else if(M.preg){M.preg+=dt;if(M.preg>=3){M.preg=0;M.rest=1;const n=6+(Math.random()*5|0);if(M.clean<45){toast('🐁 鼠籠太髒，母鼠壓力太大，這胎沒有存活',3800);}else{M.lit.push({t:0,n});toast(`🐁 母鼠生了 ${n} 隻乳鼠`,2800);}ch=1;}}}
 for(const l of M.lit)l.t+=dt;
 if(ch){markDirty();}lfVis();}
/* ---- 動作 ---- */
const lfAct={
 cyst(){if(!pay(120,'豐年蝦卵 1 罐'))return;ensureLF().cy+=3;toast('🥫 買了豐年蝦卵（3 份）');},
 brStart(i,dec){const L=ensureLF(),c=L.br[i];if(L.cy<=0){toast('沒有豐年蝦卵了，先買一罐');return;}L.cy--;Object.assign(c,{st:'hatch',p:0,g:1,dec:dec?1:0,sal:c.sal||28,T:c.T||28,air:c.air??1,bad:0});if(dec)toast('🧪 先用漂白水「去殼」：孵化率變高，小蝦也不會吞到卵殼',3600);},
 brHarvest(i){const L=ensureLF(),c=L.br[i];const age=(Date.now()-c.t1)/60000;const f=age<=6?1:.5;const n=Math.round(c.n*f);lfAdd('nau',n);S.stock.brine=Math.min(capOf('brine'),S.stock.brine+Math.round(n*.5));c.st='idle';
  toast(age<=6?`🦐 收成 ${n} 份新鮮無節幼體（還帶著卵黃，最營養）`:`🦐 收成 ${n} 份，但已經放太久，卵黃吃完了，營養變差`,3600);},
 plFert(){if(!pay(30,'藻類肥料'))return;ensureLF().pl.fert=4;toast('🧪 加了 F/2 藻類肥料，綠水會長得比較快');},
 plLight(){const P=ensureLF().pl;P.light=P.light?0:1;toast(P.light?'💡 開燈：藻類行光合作用':'🌙 關燈：藻類停止生長');},
 plSeed(k){if(!pay(k==='roti'?150:400,k==='roti'?'輪蟲種源':'橈足類種源'))return;ensureLF().pl[k]+=k==='roti'?20:10;toast(`🦠 放入${k==='roti'?'輪蟲':'橈足類'}種源`);},
 plHarvest(k){const P=ensureLF().pl;const n=Math.floor(P[k]*.5/(k==='roti'?3:2));if(n<1){toast('數量太少，先養多一點再收成');return;}P[k]-=n*(k==='roti'?3:2);lfAdd(k,n);toast(`🦠 收成 ${n} 份${k==='roti'?'輪蟲':'橈足類'}（留一半當種源）`);},
 plThin(){const P=ensureLF().pl;P.alg*=.5;toast('🫙 把一半綠水分瓶出去，濃度降下來了');},
 crBuy(){if(!pay(300,'蟋蟀種群'))return;ensureLF().cr.ad+=40;toast('🦗 買了 40 隻成蟲當種群');},
 crFood(){const R=ensureLF().cr;R.food=6;toast('🥕 放了飼料和保水凝膠（大約 6 分鐘）');},
 crSpray(){const R=ensureLF().cr;R.moist=Math.min(100,R.moist+20);toast(`💦 噴濕產卵土，濕度 ${R.moist}%`);},
 crClean(){const R=ensureLF().cr;R.clean=100;toast('🧹 清掉糞便和死蟲，氨味不見了');},
 crGut(){const R=ensureLF().cr;if(S.stock.veg<3){toast('蔬菜不夠（要 3 份），去 2F 採收蔬菜');return;}S.stock.veg-=3;R.gutT=Date.now();toast('🥬 腸道負載：讓蟋蟀先吃蔬菜和鈣粉，餵給爬蟲時營養更好（10 分鐘內有效）',4200);},
 crHarvest(){const R=ensureLF().cr;const n=Math.floor((R.ad-20)/2);if(n<1){toast('成蟲太少了，至少留 20 隻當種群');return;}R.ad-=n;const gut=Date.now()-R.gutT<10*60e3;if(gut)lfAdd('gut',n);else S.stock.insect=Math.min(capOf('insect'),S.stock.insect+n);
  toast(gut?`🦗 收成 ${n} 隻「腸道負載蟋蟀」`:`🦗 收成 ${n} 隻蟋蟀（普通，沒有腸道負載）`,3200);},
 swBuy(){if(!pay(250,'大麥蟲'))return;ensureLF().sw.lar+=40;toast('🐛 買了 40 隻大麥蟲幼蟲');},
 swBran(){ensureLF().sw.bran=8;toast('🌾 補了麥麩和紅蘿蔔');},
 swCup(){const W=ensureLF().sw;const n=Math.min(10,W.lar,20-W.cups.length);if(n<1){toast(W.lar?'隔離杯滿了（20 個）':'沒有幼蟲');return;}W.lar-=n;for(let i=0;i<n;i++)W.cups.push({t:0});toast(`🥤 把 ${n} 隻幼蟲各自隔離：大麥蟲要「獨處」才會化蛹`,3600);},
 swHarvest(){const W=ensureLF().sw;const n=Math.floor((W.lar-10)/2);if(n<1){toast('幼蟲太少，留 10 隻繼續養');return;}W.lar-=n;lfAdd('worm',n);toast(`🐛 收成 ${n} 隻大麥蟲`);},
 ffNew(){const L=ensureLF();const src=L.ff.v.find(v=>v.t>=6&&v.t<=14&&!v.ster);if(L.ff.v.length&&!src){toast('要從「正在產蠅」的瓶子分出種蠅，現在沒有適合的瓶');return;}if(L.ff.v.length>=8){toast('培養架滿了（8 瓶）');return;}if(!pay(src?30:200,src?'果蠅培養基':'果蠅種瓶'))return;L.ff.v.push({t:src?0:6,ster:0,h:0});toast(src?'🧫 用香蕉、酵母做了一瓶新培養基，倒入種蠅':'🪰 買了一瓶正在產蠅的種瓶（無翅果蠅）',3200);},
 ffHarvest(){const L=ensureLF();let n=0;for(const v of L.ff.v)if(v.t>=6&&v.t<=14&&Date.now()-(v.h||0)>60e3){v.h=Date.now();n+=v.ster?2:10;}if(!n){toast('沒有可以收的瓶子（要產蠅期，而且每瓶 1 分鐘收一次）');return;}lfAdd('ff',n);toast(`🪰 收成 ${n} 份果蠅`);},
 ffT(d){const L=ensureLF();L.ff.T=clamp(L.ff.T+d,16,32);if(L.ff.T>28)toast('⚠️ 超過 28°C 果蠅的公蠅會不孕！',3000);},
 msBuy(){if(!pay(800,'繁殖種鼠（一公兩母）'))return;ensureLF().ms.trio=1;toast('🐁 放入一公兩母的繁殖種鼠');},
 msClean(){ensureLF().ms.clean=100;toast('🧹 換了乾淨的墊料');},
 msHarvest(big){const M=ensureLF().ms;const l=M.lit.find(x=>big?x.t>=4:x.t<4);if(!l){toast(big?'還沒有長大的小鼠':'沒有乳鼠');return;}M.lit.splice(M.lit.indexOf(l),1);if(big){S.stock.mouse=Math.min(capOf('mouse'),S.stock.mouse+l.n);toast(`❄️ ${l.n} 隻成鼠冷凍保存，當大型蛇的飼料`);}else{lfAdd('pinky',l.n);toast(`❄️ ${l.n} 隻乳鼠冷凍保存，小型蛇和角蛙的飼料`);}}};
/* ---- 介面 ---- */
function lfSheet(tab='br'){const L=ensureLF(),now=Date.now();const T=[['br','🦐 豐年蝦'],['pl','🦠 浮游生物'],['cr','🦗 蟋蟀'],['sw','🐛 大麥蟲'],['ff','🪰 果蠅'],['ms','🐁 鼠']];
 const top=`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">${T.map(([k,n])=>chip(n,tab===k,`data-t="${k}"`)).join('')}</div><div class="sm" style="margin-bottom:8px;background:#0d1a24;padding:6px 8px;border-radius:8px">庫存：${Object.entries(LFN).map(([k,[i,n]])=>`${i}${n} <b>${L.st[k]}</b>`).join('　')}</div>`;
 const btn=(t,a,c='')=>`<button class="btn sm ${c}" data-a="${a}">${t}</button>`;let h='';
 if(tab==='br')h=`<div class="mut sm">把豐年蝦卵放進孵化錐，鹽度 25–30 ppt、溫度 28°C、一定要打氣，大約 2 分鐘孵化。剛孵出的「無節幼體」還帶著卵黃，6 分鐘內收成最營養。卵：${L.cy} 份</div>`+
  L.br.map((c,i)=>`<div class="res"><div><b>孵化錐 ${i+1}</b> <span class="mut">${c.st==='idle'?'空的':c.st==='hatch'?`孵化中 ${Math.round(c.p*100)}%`:`✅ 孵好了・${Math.floor((now-c.t1)/60000)} 分鐘`}</span></div>
   ${c.st==='hatch'?`<div class="sm">🧂 ${c.sal} ppt ${btn('−',`sal,${i},-5`)}${btn('＋',`sal,${i},5`)}　🌡 ${c.T}°C ${btn('−',`brT,${i},-1`)}${btn('＋',`brT,${i},1`)}　${btn(c.air?'💨 打氣中':'⛔ 沒打氣',`air,${i}`)}</div>`:c.st==='ready'?`<div class="mut sm">約 ${c.n} 份</div>`:`<div class="mut sm">要用 1 份卵</div>`}
   <div style="display:flex;flex-direction:column;gap:4px">${c.st==='idle'?btn('直接孵',`brS,${i},0`)+btn('去殼後孵',`brS,${i},1`):c.st==='ready'?btn('收成',`brH,${i}`,'feed'):'<span></span>'}</div></div>`).join('')+`<div style="margin-top:6px">${btn('🥫 買豐年蝦卵 $120','cyst')}</div>`;
 else if(tab==='pl'){const P=L.pl;h=`<div class="mut sm">食物鏈：<b>微藻</b>（綠水，要光和肥料）→ 被<b>輪蟲</b>和<b>橈足類</b>吃掉。輪蟲是小魚的第一口食物，橈足類是倒吊幼魚唯一吃得下的。綠水太濃會「崩缸」。</div>
  <div class="res"><div><b>🟢 微藻</b> <span class="mut">${P.crash>0?'💀 崩缸中，等它恢復':`濃度 ${Math.round(P.alg*100)}%`}</span></div><div class="sm">${P.light?'💡 開燈':'🌙 關燈'}${P.fert>0?'・🧪 有肥料':''}${P.alg>1.05?'・<span style="color:#ff8a8a">太濃了！</span>':''}</div><div style="display:flex;flex-direction:column;gap:4px">${btn(P.light?'關燈':'開燈','plL')}${btn('加肥料 $30','plF')}${btn('分瓶','plT')}</div></div>
  <div class="res"><div><b>🦠 輪蟲</b> <span class="mut">${Math.round(P.roti)} 隻／ml</span></div><div class="mut sm">繁殖超快，靠吃微藻</div><div style="display:flex;flex-direction:column;gap:4px">${P.roti<1?btn('放種源 $150','plS,roti'):btn('收成','plH,roti','feed')}</div></div>
  <div class="res"><div><b>🦐 橈足類</b> <span class="mut">${Math.round(P.cope)} 隻／ml</span></div><div class="mut sm">長得比較慢，營養很高</div><div style="display:flex;flex-direction:column;gap:4px">${P.cope<1?btn('放種源 $400','plS,cope'):btn('收成','plH,cope','feed')}</div></div>`;}
 else if(tab==='cr'){const R=L.cr;h=`<div class="mut sm">蟋蟀把卵產在濕的土裡，要保持溫暖（27–33°C）、產卵土濕度 50–85%，還要常清理，不然氨氣會讓牠們大量死亡。收成前先做「腸道負載」，餵給爬蟲時營養更好。</div>
  <div class="res"><div><b>🦗 成蟲 ${R.ad} 隻</b> <span class="mut">卵 ${R.eggs.reduce((a,e)=>a+e.n,0)}・小蟋蟀 ${R.pin.reduce((a,e)=>a+e.n,0)}</span></div><div class="sm">🌡 ${R.T}°C ${btn('−','crT,-1')}${btn('＋','crT,1')}<br>💦 產卵土 <b style="color:${inR(R.moist,[50,85])?'#6fd38c':'#ff8a8a'}">${Math.round(R.moist)}%</b>　🧹 乾淨 <b style="color:${R.clean>40?'#6fd38c':'#ff8a8a'}">${Math.round(R.clean)}%</b>　🥕 ${R.food>0?Math.ceil(R.food)+' 分鐘':'<span style="color:#ff8a8a">沒食物</span>'}${now-R.gutT<10*60e3?'　🥬 腸道負載中':''}</div><span></span></div>
  <div style="display:flex;gap:4px;flex-wrap:wrap">${R.ad?btn('🥕 餵食','crFood')+btn('💦 噴濕','crSpray')+btn('🧹 清理','crClean')+btn('🥬 腸道負載','crGut')+btn('收成','crH','feed'):''}${btn('買種群 $300','crB')}</div>`;}
 else if(tab==='sw'){const W=L.sw;h=`<div class="mut sm">大麥蟲很特別：牠們在一大群裡<b>永遠不會化蛹</b>，要一隻一隻「隔離」在小杯子裡，幾分鐘後才會變成蛹、再變成甲蟲。甲蟲在麥麩裡產卵，孵出新的幼蟲。</div>
  <div class="res"><div><b>🐛 幼蟲 ${W.lar}</b> <span class="mut">隔離中 ${W.cups.length}/20・🪲 甲蟲 ${W.bee}</span></div><div class="sm">🌾 麥麩 ${W.bran>0?Math.ceil(W.bran)+' 分鐘':'<span style="color:#ff8a8a">吃完了</span>'}</div><span></span></div>
  <div style="display:flex;gap:4px;flex-wrap:wrap">${btn('🌾 補麥麩','swBran')}${btn('🥤 隔離 10 隻化蛹','swCup')}${W.lar?btn('收成','swH','feed'):''}${btn('買幼蟲 $250','swB')}</div>`;}
 else if(tab==='ff'){h=`<div class="mut sm">箭毒蛙這類小型蛙只吃得下果蠅。用的是「無翅果蠅」，不會飛走。每瓶培養基：前 6 分鐘是卵和幼蟲，6–14 分鐘開始產蠅，之後會衰退長蟎，要一直從好的瓶子分新瓶。溫度超過 28°C 公蠅會不孕。</div>
  <div class="row2"><span>🌡 培養室 <b style="color:${L.ff.T>28?'#ff8a8a':'#6fd38c'}">${L.ff.T}°C</b></span><span>${btn('−','ffT,-1')}${btn('＋','ffT,1')}</span></div>`+
  (L.ff.v.length?L.ff.v.map((v,i)=>`<div class="row2"><span>🧫 第 ${i+1} 瓶</span><span class="mut sm">${v.t<6?`🥚 幼蟲期 ${Math.round(v.t/6*100)}%`:v.t<=14?(v.ster?'⚠️ 不孕':'🪰 產蠅中'):'衰退中'}</span></div>`).join(''):'<div class="mut sm">還沒有培養瓶。</div>')+
  `<div style="display:flex;gap:4px;margin-top:6px">${btn(L.ff.v.length?'🧫 分新瓶 $30':'🪰 買種瓶 $200','ffN')}${btn('收成','ffH','feed')}</div>`;}
 else{const M=L.ms;h=`<div class="mut sm">爬蟲館的蛇和角蛙主要吃冷凍鼠。一公兩母的繁殖組會一直生，乳鼠可以直接冷凍，或養大一點再冷凍給大型蛇。籠子要常換墊料，太髒母鼠壓力大，整胎都養不活。</div>
  ${M.trio?`<div class="res"><div><b>🐁 繁殖組（一公兩母）</b> <span class="mut">${M.preg?`懷孕中 ${Math.round(M.preg/3*100)}%`:M.rest>0?'休息中':'等待交配'}</span></div><div class="sm">🧹 墊料 <b style="color:${M.clean>45?'#6fd38c':'#ff8a8a'}">${Math.round(M.clean)}%</b>　乳鼠 ${M.lit.filter(l=>l.t<4).reduce((a,l)=>a+l.n,0)}・長大的 ${M.lit.filter(l=>l.t>=4).reduce((a,l)=>a+l.n,0)}</div><span></span></div>
  <div style="display:flex;gap:4px;flex-wrap:wrap">${btn('🧹 換墊料','msC')}${btn('冷凍乳鼠','msP')}${btn('冷凍成鼠','msA','feed')}</div>`:`<div style="margin-top:6px">${btn('買繁殖種鼠 $800','msB')}</div>`}`;}
 sheet('🦗 活餌區',top+h,c=>{c.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>lfSheet(x.dataset.t));c.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{const [a,p,q]=x.dataset.a.split(',');const L=ensureLF();
  ({cyst:()=>lfAct.cyst(),brS:()=>lfAct.brStart(+p,+q),brH:()=>lfAct.brHarvest(+p),sal:()=>{L.br[+p].sal=clamp(L.br[+p].sal+ +q,0,60);},brT:()=>{L.br[+p].T=clamp(L.br[+p].T+ +q,15,36);},air:()=>{L.br[+p].air=L.br[+p].air?0:1;},
   plL:lfAct.plLight,plF:lfAct.plFert,plT:lfAct.plThin,plS:()=>lfAct.plSeed(p),plH:()=>lfAct.plHarvest(p),crT:()=>{L.cr.T=clamp(L.cr.T+ +p,18,38);},crFood:lfAct.crFood,crSpray:lfAct.crSpray,crClean:lfAct.crClean,crGut:lfAct.crGut,crH:lfAct.crHarvest,crB:lfAct.crBuy,
   swBran:lfAct.swBran,swCup:lfAct.swCup,swH:lfAct.swHarvest,swB:lfAct.swBuy,ffT:()=>lfAct.ffT(+p),ffN:lfAct.ffNew,ffH:lfAct.ffHarvest,msB:lfAct.msBuy,msC:lfAct.msClean,msP:()=>lfAct.msHarvest(0),msA:()=>lfAct.msHarvest(1)})[a]();
  markDirty();lfVis();lfSheet(tab);});});}
/* ---- 跟其他系統串接 ---- */
/* 1. 展示缸餵食：有高品質活餌時自動加餵，心情和親密度更好 */
const PREM={desert:['gut','worm'],tropical:['ff','gut','pinky'],jelly:['nau'],reef:['cope','nau'],ocean:['nau'],stream:['nau'],river:['worm'],pond:['worm'],yard:[]};
const _fdL=feed;feed=function(tk){_fdL(tk);const st=tk.st;if(!st||!st.animals.length)return;const L=ensureLF();const k=(PREM[st.type]||[]).find(k=>L.st[k]>=2);if(!k)return;L.st[k]-=2;
 for(const e of st.animals){e.mood=Math.min(100,(e.mood||60)+6);e.bond=Math.min(100,(e.bond||0)+2);}markDirty();setTimeout(()=>toast(`${LFN[k][0]} 加餵了${LFN[k][1]}：營養更好，心情 +6`,2400),900);};
/* 2. 繁殖場：剛出生的小魚吃新鮮活餌存活率更高；倒吊要橈足類；箭毒蛙要果蠅；爬蟲母體吃腸道負載蟋蟀受精率更高 */
const _hasL=has;has=function(k){if(k==='copepod'&&ensureLF().st.cope>=6)return true;return _hasL(k);};
const _bb=bfBirth;bfBirth=function(i){const b=ensureBF(),x=b.box[i],r=BRE[x.sp],L=ensureLF();const was=x.st;let note='';
 if(r.g==='egg'&&['gecko','beardie','cham','crested'].includes(x.sp)&&L.st.gut>=3){L.st.gut-=3;r._fb=1;note='🦗 母體吃了腸道負載蟋蟀，受精率提高';}
 if(r.first==='copepod'&&L.st.cope>=6){L.st.cope-=6;}
 let fresh=null,sb=null;if(x.sp==='dart'){sb=S.stock.brine;if(L.st.ff>=6){L.st.ff-=6;S.stock.brine=999;fresh='ff';}else{S.stock.brine=0;note='🪰 沒有果蠅，箭毒蛙的小蛙幾乎都餓死了';}}
 else if(r.first==='brine'||r.first==='mucus'){fresh=['roti','nau'].find(k=>L.st[k]>=4);if(fresh){L.st[fresh]-=4;sb=S.stock.brine;S.stock.brine=999;}}
 const ofert=r.fert;if(r._fb){r.fert=Math.min(.98,r.fert*1.15);}try{_bb(i);}finally{r.fert=ofert;r._fb=0;if(sb!=null)S.stock.brine=sb;}
 if(fresh&&x.st!==was)setTimeout(()=>toast(`${LFN[fresh][0]} 用新鮮${LFN[fresh][1]}當第一口食物，小魚存活率很好`,3200),1500);if(note)setTimeout(()=>toast(note,3200),3000);markDirty();};
/* 3. 水母碟狀幼體優先吃新鮮無節幼體 */
const _jf=bfTick;bfTick=function(){const L=S.lf;if(L&&S.bf&&L.st.nau>0){for(const k in S.bf.jel){const j=S.bf.jel[k];if(j.eph.length&&j.eph.some(e=>Date.now()-e.f>3*60e3)&&L.st.nau>=1){L.st.nau--;j.fedT=Date.now();for(const e of j.eph)e.f=Date.now();}}}_jf();};
/* ---- 3D：活餌區 ---- */
const LV={};
(function(){const g=WV.g,X=WG.x,Z=WG.z;const dk=new THREE.MeshStandardMaterial({color:C(0x2b3440),roughness:.6,metalness:.3});
 const sign=(t,sub,x,y,z,ry,w=3)=>{const m=add(new THREE.PlaneGeometry(w,w*.22),new THREE.MeshBasicMaterial({map:vText([[t,64,.42],[sub||'',30,.8,'#9fd8ff']],720,160,'#16222e','#ffffff')}),x,y,z,g);m.rotation.y=ry;return m;};
 sign('🦗 活餌區','LIVE FOOD CULTURE',20,3.3,-9.85,0,3.4);
 const st=(p,fn,ox=0,oz=0)=>STATIONS.push({p:V(X+p[0]+ox,p[1],Z+p[2]+oz),fn});
 /* 豐年蝦孵化錐 */
 box(4,1,.8,dk,15,.5,-9.2,g);LV.br=[];for(let i=0;i<3;i++){const x=13.8+i*1.2;const cn=add(new THREE.ConeGeometry(.35,.9,16,1,true),new THREE.MeshStandardMaterial({color:C(0xffa860),transparent:true,opacity:.55,side:THREE.DoubleSide}),x,1.55,-9.2,g);cn.rotation.x=Math.PI;
  const lq=add(new THREE.ConeGeometry(.3,.75,16),new THREE.MeshBasicMaterial({color:C(0xd27a3a),transparent:true,opacity:.7}),x,1.5,-9.2,g);lq.rotation.x=Math.PI;const bub=[];for(let b=0;b<6;b++){bub.push(add(new THREE.SphereGeometry(.025,6,4),new THREE.MeshBasicMaterial({color:C(0xffffff)}),x,1.3,-9.2,g));}LV.br.push({lq,bub,x});}
 sign('🦐 豐年蝦孵化錐','',15,2.6,-9.75,0,2.4);st([15,1.5,-9],()=>lfSheet('br'));OBST.push([X+12.9,X+17.1,Z-9.8,Z-8.7]);
 /* 浮游生物瓶 */
 box(4.4,.9,.8,dk,20.5,.45,-9.2,g);box(4.4,.06,.9,new THREE.MeshBasicMaterial({color:C(0xfff6d8)}),20.5,2.9,-9.2,g);LV.alg=[];
 for(let i=0;i<6;i++){const m=add(new THREE.CylinderGeometry(.22,.22,1.1,14),new THREE.MeshStandardMaterial({color:C(i<4?0x4fbf4a:0xc8d8a0),emissive:C(i<4?0x1a5a18:0x3a4a2a),transparent:true,opacity:.8}),18.8+i*.68,1.45,-9.2,g);LV.alg.push(m);}
 sign('🦠 微藻・輪蟲・橈足類','',20.5,3.3,-9.75,0,2.6);st([20.5,1.4,-9],()=>lfSheet('pl'));OBST.push([X+18.2,X+22.8,Z-9.8,Z-8.7]);
 /* 蟋蟀箱 */
 LV.cr=[];for(let i=0;i<3;i++)for(let j=0;j<2;j++){const b=box(.8,.55,1.2,new THREE.MeshStandardMaterial({color:C(0xe8e0d0),transparent:true,opacity:.8}),27.3,.35+j*.65,-8.4+i*1.4,g);LV.cr.push(b);}
 sign('🦗 蟋蟀繁殖箱','',27.85,2.2,-7,-Math.PI/2,2.2);st([27.2,.9,-7],()=>lfSheet('cr'));OBST.push([X+26.8,X+28,Z-9.2,Z-4.6]);
 /* 大麥蟲與隔離杯 */
 box(2.4,.9,.8,dk,23.5,.45,-4.1,g);LV.cups=[];for(let i=0;i<20;i++){const m=add(new THREE.CylinderGeometry(.07,.06,.12,8),new THREE.MeshStandardMaterial({color:C(0xf0f0f0),transparent:true,opacity:.85}),22.5+(i%10)*.22,.97,-4.25+Math.floor(i/10)*.25,g);m.visible=false;LV.cups.push(m);}
 sign('🐛 大麥蟲・隔離化蛹','',23.5,2.1,-3.45,Math.PI,2.2);st([23.5,1,-4.2],()=>lfSheet('sw'));OBST.push([X+22.2,X+24.8,Z-4.6,Z-3.4]);
 /* 果蠅瓶架 */
 box(1.8,.9,.7,dk,14.4,.45,-4.1,g);LV.ff=[];for(let i=0;i<8;i++){const m=add(new THREE.CylinderGeometry(.06,.06,.22,8),new THREE.MeshStandardMaterial({color:C(0xe8d080),transparent:true,opacity:.85}),13.8+(i%4)*.38,1.02,-4.2+Math.floor(i/4)*.24,g);m.visible=false;LV.ff.push(m);}
 sign('🪰 果蠅培養','',14.4,2.1,-3.45,Math.PI,1.8);st([14.4,1,-4.2],()=>lfSheet('ff'));OBST.push([X+13.4,X+15.4,Z-4.6,Z-3.4]);
 /* 鼠架 */
 const rk=new THREE.Group();rk.position.set(18.8,0,-4);g.add(rk);for(let j=0;j<3;j++){box(2.2,.04,.6,dk,0,.3+j*.6,0,rk);box(.6,.35,.5,new THREE.MeshStandardMaterial({color:C(0xd8e4ea),transparent:true,opacity:.7}),-.6,.5+j*.6,0,rk);box(.6,.35,.5,new THREE.MeshStandardMaterial({color:C(0xd8e4ea),transparent:true,opacity:.7}),.6,.5+j*.6,0,rk);}
 sign('🐁 冷凍鼠繁殖架','',18.8,2.3,-3.45,Math.PI,2);st([18.8,1,-4],()=>lfSheet('ms'));OBST.push([X+17.6,X+20,Z-4.4,Z-3.4]);})();
function lfVis(){if(!LV.br)return;const L=ensureLF();L.br.forEach((c,i)=>{LV.br[i].lq.visible=c.st!=='idle';LV.br[i].lq.material.color.set(c.st==='ready'?0xff8a3a:0xd27a3a);});
 const a=L.pl.crash>0?.05:L.pl.alg;LV.alg.forEach((m,i)=>{if(i<4){m.material.color.setRGB(.25+.1*(1-a),.4+.4*Math.min(1,a),.2);m.material.opacity=.35+.5*Math.min(1,a);}});
 LV.cups.forEach((m,i)=>m.visible=i<L.sw.cups.length);LV.ff.forEach((m,i)=>m.visible=i<L.ff.v.length);}
globalAnims.push((dt,t)=>{if(!LV.br||!inWing())return;const L=S.lf;if(!L)return;LV.br.forEach((o,i)=>{const on=L.br[i]&&L.br[i].st==='hatch'&&L.br[i].air;o.bub.forEach((b,j)=>{b.visible=on;if(on){const y=((t*.8+j/6)%1);b.position.set(o.x+Math.sin(j*2+t)*.05,1.15+y*.75,-9.2+Math.cos(j*3)*.05);}});});});
/* 繁殖場總覽電腦加一個活餌捷徑 */
const _bfs=bfSheet;bfSheet=function(tab){_bfs(tab);const c=$('#shC');if(!c)return;const d=document.createElement('div');d.className='mut sm';d.style.marginTop='8px';const L=ensureLF();d.innerHTML=`活餌庫存：${Object.entries(LFN).filter(([k])=>L.st[k]).map(([k,[i,n]])=>`${i}${n} ${L.st[k]}`).join('・')||'（空）'} <button class="btn sm" id="toLf">🦗 活餌區</button>`;c.appendChild(d);d.querySelector('#toLf').onclick=()=>lfSheet();};
setInterval(lfTick,2000);setTimeout(()=>{if(loaded){ensureLF();lfVis();}},3200);

