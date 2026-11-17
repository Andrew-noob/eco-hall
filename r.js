/* ===== r.js：釣竿彎曲晃動、拉竿模式、船上活魚艙、海面浪花、全服排行榜、玩家市集 ===== */

/* ---------- 釣竿彎曲 ---------- */
function rodBend(t){const sw=Math.sin(t*1.7)*.012+Math.sin(t*3.1)*.006;if(!FS)return sw;switch(FS.st){
 case'charge':return -.05*FS.pw+sw;case'fly':{const u=Math.min(1,FS.ft/FS.dur);return .14*Math.sin(u*Math.PI*2.5)*(1-u);}
 case'wait':return .025+Math.sin(t*2)*.008;case'bite':return .09+Math.abs(Math.sin(t*14))*.08;
 case'reel':return .13+(FS.boss?.07:0)+Math.sin(t*(FS.burst>0?30:16))*.035+(FS.burst>0?.06:0);
 case'done':return showM.visible&&FS.show?Math.min(.16,.04+FS.show.dl*.08)+Math.sin(FS.show.t0*9)*.02*Math.exp(-FS.show.t0*.5):sw;}return sw;}

/* ---------- 不同魚的拉竿模式 ---------- */
const PAT={rush:['shark','gt','marlin','trout','sakura','arowana','barra','icelord','tuna'],zigzag:['lion','btang','ytang','opsari','archer','mudskipper','hairtail','clown','betta','guppy','mandarin'],
 dive:['grouper','kuhua','koi','loach','hemi','lakelord','kuhuaking','pturtle','goby'],heavy:['puffer','mullet','goldfish','smelt']};
const PATN={steady:'🎯 穩定型',rush:'⚡ 暴衝型：游標會突然加速',zigzag:'〰️ 亂竄型：游標會突然換方向',dive:'⤵️ 下潛型：綠區會一直往旁邊跑',heavy:'🪨 沉重型：游標慢，但要拉中 4 次、綠區縮很快'};
const patOf=k=>{for(const p in PAT)if(PAT[p].includes(k))return p;return'steady';};
function initPat(){const p=patOf(FS.k);FS.pat=p;FS.burst=0;FS.bt2=rnd(.8,1.6);FS.zt=rnd(.3,.7);FS.zd=Math.random()<.5?-1:1;if(p==='heavy'&&!FS.boss){FS.need=4;FS.v*=.7;}
 fSub(`${PATN[p]}・拉中 ${FS.need} 次、失誤 ${fgv('line')+(FS.boss?1:0)} 次線會斷`);}
function reelPat(dt,t){const p=FS.pat||'steady';if(FS.burst>0)FS.burst-=dt;
 if(p==='rush'){FS.bt2-=dt;if(FS.bt2<=0){FS.burst=.45;FS.bt2=rnd(.9,1.9);vib(40);}}
 else if(p==='zigzag'){FS.zt-=dt;if(FS.zt<=0){FS.dir*=-1;FS.zt=rnd(.25,.65);}}
 else if(p==='dive'){FS.zc+=FS.zd*dt*.22;if(FS.zc<FS.zw/2){FS.zc=FS.zw/2;FS.zd=1;}if(FS.zc>1-FS.zw/2){FS.zc=1-FS.zw/2;FS.zd=-1;}setZone();}
 else if(p==='heavy'&&FS.hits>0&&FS.zw>.12&&!FS._hs){FS._hs=1;}}
const _hk=hook;hook=function(){_hk();if(FS&&FS.st==='reel')initPat();};
const _rt=reelTap;reelTap=function(){const h=FS&&FS.hits;_rt();if(FS&&FS.st==='reel'&&FS.pat==='heavy'&&FS.hits>h){FS.zw*=.9;setZone();}};

/* ---------- 船上活魚艙 ---------- */
const WELL={x:1.25,z:-699.6};const wellG=new THREE.Group();wellG.position.set(WELL.x,0,WELL.z);scene.add(wellG);
(function(){const wh=new THREE.MeshStandardMaterial({color:C(0xf2f2ee),roughness:.4});for(const [x,z,w,d] of[[0,-.92,1.3,.08],[0,.92,1.3,.08],[-.64,0,.08,1.9],[.64,0,.08,1.9]])box(w,.55,d,wh,x,.27,z,wellG);
 box(1.22,.05,1.78,new THREE.MeshStandardMaterial({color:C(0x1a3a5a)}),0,.02,0,wellG);const w=add(new THREE.PlaneGeometry(1.2,1.76),new THREE.MeshStandardMaterial({color:C(0x3a8ac8),transparent:true,opacity:.45,roughness:.05,emissive:C(0x1a4a6a),emissiveIntensity:.3,depthWrite:false}),0,.45,0,wellG);w.rotation.x=-Math.PI/2;w.renderOrder=3;
 const lb=add(new THREE.PlaneGeometry(.8,.18),new THREE.MeshBasicMaterial({map:vText([['活魚艙',40,.6]],256,60,'#1a3a5a','#ffffff')}),0,.4,.965,wellG);
 BLOCK.push((x,z)=>Math.abs(x-WELL.x)<.75&&Math.abs(z-WELL.z)<1.05);})();
let wellFish=[];
function wellSync(){for(const f of wellFish)wellG.remove(f.m);wellFish=[];S.well=S.well||[];S.well.forEach((it,i)=>{const d=dispGeo(it.sp),L=clamp((SP[it.sp].len||.2)*(it.g?it.g.sz:1),.12,.5);
 const m=new THREE.Mesh(d.g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35}));m.scale.setScalar(L/d.len);const mo=it.g&&it.g.m!=='n'&&MORPH[it.g.m];if(mo&&mo.tint)m.material.color.setRGB(...mo.tint);wellG.add(m);wellFish.push({m,a:i*1.1,r:rnd(.18,.5),sp:rnd(.5,1.1),y:rnd(.12,.32)});});}
function wellSheet(){S.well=S.well||[];sheet('🐟 活魚艙',`<div class="mut sm">海釣的魚先養在船上（最多 6 條），可以看牠們游，回港前再決定帶回倉庫或賣掉。</div>`+(S.well.length?S.well.map((it,i)=>`<div class="row2"><span>${esc(it.name)} <span class="mut sm">${it.cm} cm${gTag(it)?'・'+gTag(it):''}</span></span><span style="display:flex;gap:4px"><button class="btn sm" data-w="${i}">帶回倉庫</button><button class="btn sm" data-s="${i}">賣 ${fmt$(fishVal(it.sp,it.g))}</button></span></div>`).join(''):'<div class="mut sm">活魚艙是空的。</div>')+
 (S.well.length?'<button class="btn feed" id="wAll" style="width:100%;margin-top:8px">全部帶回倉庫</button>':''),c=>{
 c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{const it=S.well.splice(+b.dataset.w,1)[0];S.wh.push({sp:it.sp,g:it.g,sex:it.sex,name:it.name});markDirty();wellSync();toast('📦 送回倉庫');wellSheet();});
 c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const it=S.well.splice(+b.dataset.s,1)[0];const v=fishVal(it.sp,it.g);earn(v);mktHit(it.sp);markDirty();wellSync();toast(`💰 獲得 ${fmt$(v)}`);wellSheet();});
 const a=c.querySelector('#wAll');if(a)a.onclick=()=>{for(const it of S.well)S.wh.push({sp:it.sp,g:it.g,sex:it.sex,name:it.name});S.well=[];markDirty();wellSync();toast('📦 全部送回倉庫');wellSheet();};});}
const _lf=landFish;landFish=function(){_lf();const c=FS&&FS.catch;if(!c||BOSS[c.k])return lbPushSoon();
 if(FS.w==='sea'){const it={sp:c.k,g:c.g,sex:c.sex,cm:c.cm,name:`${c.g.m!=='n'?MORPH[c.g.m].pre+' ':''}${c.nm}`};
  fBtns([['放活魚艙',()=>{S.well=S.well||[];if(S.well.length>=6){toast('活魚艙滿了（6 條），先到「🧰 更多 → 活魚艙」處理');return;}S.well.push(it);markDirty();wellSync();toast('🐟 放進活魚艙了，回頭看看牠在游');openCast();},'feed'],[`賣 ${fmt$(c.val)}`,()=>{earn(c.val);mktHit(c.k);toast(`💰 獲得 ${fmt$(c.val)}`);openCast();}],['放生',()=>{toast('🌊 放生了');openCast();}]]);}
 lbPushSoon();};
const _ms=moreSheet;moreSheet=function(){_ms();if(curW()!=='sea')return;const c=$('#shC'),b=document.createElement('button');b.className='opt';b.innerHTML=`<b>🐟 活魚艙（${(S.well||[]).length}/6）</b><span class="mut">看船上養的魚，帶回倉庫或賣掉</span>`;b.onclick=wellSheet;c.insertBefore(b,c.firstChild);};

/* ---------- 海面浪花 ---------- */
let foamG=null,spray=null;
(function(){if(!seaMesh)return;const n=seaGeo.attributes.position.count;seaGeo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3));seaMesh.material.vertexColors=true;seaMesh.material.needsUpdate=true;
 foamG=new THREE.Group();foamG.position.copy(FW.sea.C);scene.add(foamG);const fm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false});
 for(let i=0;i<90;i++){const m=add(new THREE.CircleGeometry(rnd(.6,2.4),10),fm,rnd(-90,90),-1.18,rnd(-150,150),foamG);m.rotation.x=-Math.PI/2;m.scale.y=rnd(.25,.6);m.userData.z0=m.position.z;}
 const sp=new Float32Array(120*3);const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));spray=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.09,transparent:true,opacity:.8,depthWrite:false}));spray.frustumCulled=false;scene.add(spray);spray.userData.ph=Array.from({length:120},()=>[rnd(-1,1),rnd(0,6.28),rnd(.6,1.4)]);})();
globalAnims.push((t,dt)=>{const k=curW();
 if(k==='sea'&&seaMesh){const p=seaGeo.attributes.position,c=seaGeo.attributes.color;for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i),z=p.getZ(i);let f=clamp((y-.16)/.16,0,1);f+=Math.max(0,Math.sin(x*.7+t*.6)*Math.sin((z-seaOff)*.9))*.5*f;const s=Math.max(0,Math.sin(x*3.1+(z-seaOff)*2.3+t*2))>.985?1.2:0;const v=1-.12*clamp(-y/.3,0,1)+f*2.4+s;c.setXYZ(i,v,v,v*1.02);}c.needsUpdate=true;
  for(const m of foamG.children){m.position.z=((m.userData.z0+seaOff*1.0+150)%300+300)%300-150;m.position.y=-1.3+waveY(m.position.x+FW.sea.C.x,m.position.z+FW.sea.C.z,t)+.06;}foamG.visible=true;
  const a=spray.geometry.attributes.position.array,sp=seaSpd/14;for(let i=0;i<120;i++){const [ox,ph,h]=spray.userData.ph[i],u=((t*1.6+ph)%1);a[i*3]=FW.sea.C.x+ox*(1.4+u*1.5);a[i*3+1]=-1.1+Math.sin(u*Math.PI)*h*(.3+sp);a[i*3+2]=FW.sea.C.z-8.1+u*2.5;}spray.geometry.attributes.position.needsUpdate=true;spray.visible=seaSpd>.8;}
 else{if(foamG)foamG.visible=false;if(spray)spray.visible=false;}
 if(k==='sea'){wellG.visible=true;for(const f of wellFish){f.a+=dt*f.sp;f.m.position.set(Math.cos(f.a)*f.r*.9,f.y+Math.sin(t*2+f.a)*.02,Math.sin(f.a)*f.r*1.3);f.m.rotation.y=-f.a-Math.PI/2;f.m.rotation.z=Math.sin(t*8+f.a)*.08;}}else wellG.visible=false;});
setTimeout(()=>{try{wellSync();}catch(e){}},1500);

/* ---------- 線上：全服排行榜、玩家市集 ---------- */
const ON={ready:false,db:null,uid:null,canW:false};
async function onInit(){if(ON.ready)return ON;try{if(!(window.claude&&claude.use))return ON;const db=await claude.use('db'),us=await claude.use('user');if(!db||!us)return ON;const id=await us.id();if(!id)return ON;
 let cw=null;try{cw=await us.can('data.write');}catch(e){}Object.assign(ON,{ready:true,db,uid:id,canW:cw!==false});}catch(e){}return ON;}
const wait10=p=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r({code:'timeout'}),10000))]);
function nick(){if(!S.nick){const n=(typeof prompt==='function'?prompt('取一個在排行榜和市集顯示的暱稱（最多 12 字）',''):'')||'';S.nick=n.trim().slice(0,12)||'玩家'+String(Date.now()).slice(-4);markDirty();}return S.nick;}
let lbT=0;function lbPushSoon(){clearTimeout(lbT);lbT=setTimeout(lbPush,3000);}
async function lbPush(){const o=await onInit();if(!o.ready||!o.canW||!S.nick)return;S.fishLog=S.fishLog||{};let maxCm=0,maxSp='';for(const k in S.fishLog){if(k.startsWith('boss:'))continue;const v=S.fishLog[k];if(v>maxCm){maxCm=v;maxSp=k;}}
 const bossN=Object.values(S.bossLog||{}).reduce((a,b)=>a+b,0),kinds=Object.keys(S.fishLog).filter(k=>!k.startsWith('boss:')).length;let bossBig=0,bossSp='';for(const k in S.fishLog)if(k.startsWith('boss:')&&S.fishLog[k]>bossBig){bossBig=S.fishLog[k];bossSp=k.slice(5);}
 try{await o.db.doc('lb/'+o.uid).set({nick:S.nick,maxCm,maxSp,bossN,bossBig,bossSp,kinds,t:Date.now()});}catch(e){if(e&&e.code==='invalid_argument')ON.canW=false;}}
async function lbSheet(tab='big'){sheet('🏆 全服釣魚排行榜','<div class="mut">讀取中…</div>');const o=await onInit();if(!o.ready){sheet('🏆 全服釣魚排行榜','<div class="mut sm">目前連不上線上資料（需要登入，而且這個頁面要分享給你）。</div>');return;}
 let docs=[];try{const sn=await wait10(o.db.collection('lb').limit(300).get());docs=sn.docs.map(d=>({id:d.id,...d.data()}));}catch(e){sheet('🏆 全服釣魚排行榜','<div class="mut sm">排行榜暫時讀不到，等一下再試。</div>');return;}
 const key={big:'maxCm',boss:'bossN',kinds:'kinds'}[tab];docs.sort((a,b)=>(b[key]||0)-(a[key]||0));const nm=k=>BOSS[k]?BOSS[k].n:SP[k]?SP[k].n:'—';
 const rows=docs.slice(0,50).map((d,i)=>`<div class="row2" style="${d.id===o.uid?'background:rgba(111,211,255,.12);border-radius:6px':''}"><span>${['🥇','🥈','🥉'][i]||(i+1)+'.'} <b>${esc(String(d.nick||'玩家'))}</b> <span class="mut sm">${tab==='big'?nm(d.maxSp):tab==='boss'?(d.bossSp?'最大：'+nm(d.bossSp)+' '+(d.bossBig||0)+' cm':''):''}</span></span><span>${tab==='big'?(d.maxCm||0)+' cm':tab==='boss'?(d.bossN||0)+' 條':(d.kinds||0)+' 種'}</span></div>`).join('')||'<div class="mut sm">還沒有人上榜，當第一個！</div>';
 sheet('🏆 全服釣魚排行榜',`<div style="display:flex;gap:6px;margin-bottom:8px">${[['big','最大的魚'],['boss','Boss 數'],['kinds','收集種類']].map(([k,n])=>`<button class="chip ${tab===k?'on':''}" data-t="${k}">${n}</button>`).join('')}</div>
  <div class="mut sm" style="margin-bottom:6px">${o.canW?(S.nick?`你的暱稱：${esc(S.nick)}・釣到新紀錄會自動更新`:'設定暱稱後就會上榜'):'你目前只有瀏覽權限，可以看榜但不能上傳（要請擁有者把你設成「Contributor」）'}</div>${rows}
  ${o.canW?`<button class="btn" id="lbN" style="width:100%;margin-top:8px">${S.nick?'改暱稱':'設定暱稱並上榜'}</button>`:''}`,c=>{c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>lbSheet(b.dataset.t));const n=c.querySelector('#lbN');if(n)n.onclick=async()=>{S.nick='';nick();await lbPush();lbSheet(tab);};});}
/* 玩家市集：上架自己的突變／巨型動物 */
const isSpecial=g=>g&&(g.m!=='n'||g.sz>=1.3||g.sz<=.7);
async function settleMarket(){const o=await onInit();if(!o.ready)return;try{const me=await o.db.doc('mkt/'+o.uid).get();if(!me.exists)return;const my=(me.data().items||[]).slice();if(!my.length)return;
 const bs=await o.db.collection('buys').limit(500).get();S.settled=S.settled||{};let got=0,n=0;const sold=new Set();for(const d of bs.docs)for(const it of(d.data().items||[]))if(it.seller===o.uid)sold.add(it.iid);
 const left=my.filter(it=>{if(sold.has(it.iid)){if(!S.settled[it.iid]){S.settled[it.iid]=1;got+=it.price;n++;}return false;}return true;});
 if(left.length!==my.length&&o.canW){await o.db.doc('mkt/'+o.uid).set({nick:S.nick||'玩家',items:left,t:Date.now()});}if(got){earn(got);markDirty();toast(`🏪 市集賣出 ${n} 隻，收到 ${fmt$(got)}`,4000);}}catch(e){}}
async function mktSheet(){sheet('🏪 玩家市集','<div class="mut">讀取中…</div>');const o=await onInit();if(!o.ready){sheet('🏪 玩家市集','<div class="mut sm">目前連不上線上資料（需要登入，而且這個頁面要分享給你）。</div>');return;}
 await settleMarket();let ls=[],sold=new Set();try{const [a,b]=await wait10(Promise.all([o.db.collection('mkt').limit(200).get(),o.db.collection('buys').limit(500).get()]));for(const d of b.docs)for(const it of(d.data().items||[]))sold.add(it.iid);
  for(const d of a.docs){const x=d.data();for(const it of(x.items||[]))if(!sold.has(it.iid))ls.push({...it,seller:d.id,nick:x.nick});}}catch(e){sheet('🏪 玩家市集','<div class="mut sm">市集暫時讀不到，等一下再試。</div>');return;}
 const mine=ls.filter(x=>x.seller===o.uid),others=ls.filter(x=>x.seller!==o.uid).sort((a,b)=>b.t-a.t);
 const card=(x,btn)=>`<div class="res"><div><b>${esc(String(x.name||SP[x.sp].n))}</b> <span class="mut">${x.sex||''}</span></div><div class="sm">${SP[x.sp]?SP[x.sp].n:''}・${esc(gTag({g:x.g})||'原色')}</div><div class="mut sm">賣家：${esc(String(x.nick||'玩家'))}</div>${btn}</div>`;
 sheet('🏪 玩家市集',`<div class="mut sm">把自己繁殖或釣到的突變色、巨型、迷你個體上架，其他玩家用遊戲金幣購買。賣出後下次打開市集會自動收款。</div>${o.canW?'<button class="btn feed" id="mkSell" style="width:100%;margin:8px 0">＋ 上架我的動物</button>':'<div class="mut sm" style="margin:6px 0">你目前只有瀏覽權限，不能上架或購買。</div>'}
  ${mine.length?'<h4>我的上架</h4>'+mine.map(x=>card(x,`<button class="btn sm" data-c="${esc(x.iid)}">下架 ${fmt$(x.price)}</button>`)).join(''):''}<h4>其他玩家的商品</h4>${others.map((x,i)=>card(x,`<button class="btn sm ${o.canW?'':'dis'}" data-b="${i}">買 ${fmt$(x.price)}</button>`)).join('')||'<div class="mut sm">目前沒有商品。</div>'}`,c=>{
  const s=c.querySelector('#mkSell');if(s)s.onclick=listSheet;
  c.querySelectorAll('[data-c]').forEach(b=>b.onclick=async()=>{const it=mine.find(x=>x.iid===b.dataset.c);if(!it)return;try{const left=mine.filter(x=>x.iid!==it.iid).map(({seller,nick,...r})=>r);await o.db.doc('mkt/'+o.uid).set({nick:S.nick||'玩家',items:left,t:Date.now()});S.wh.push({sp:it.sp,g:it.g,sex:it.sex,name:it.name});markDirty();toast('📦 下架，回到倉庫');}catch(e){toast('下架失敗，等一下再試');}mktSheet();});
  c.querySelectorAll('[data-b]').forEach(b=>b.onclick=async()=>{if(!o.canW)return;const x=others[+b.dataset.b];if(!b.dataset.ok){b.dataset.ok=1;b.textContent='確認購買';return;}
   try{const bs=await o.db.collection('buys').limit(500).get();for(const d of bs.docs)for(const it of(d.data().items||[]))if(it.iid===x.iid){toast('剛好被別人買走了');mktSheet();return;}
    if(!pay(x.price,'這隻動物'))return;const ref=o.db.doc('buys/'+o.uid),cur=await ref.get();const items=(cur.exists?(cur.data().items||[]):[]).slice(-200);items.push({iid:x.iid,seller:x.seller,price:x.price,t:Date.now()});await ref.set({items});
    S.wh.push({sp:x.sp,g:x.g,sex:x.sex,name:x.name});markDirty();toast(`🎉 買到 ${x.name}，在 📦 倉庫`,3000);}catch(e){toast('購買失敗，等一下再試');}mktSheet();});});}
function listSheet(){const L=[];for(const id in TANKS){const tk=TANKS[id];for(const e of tk.st.animals)if(isSpecial(e.g))L.push({tk,e});}(S.wh||[]).forEach((it,i)=>{if(isSpecial(it.g))L.push({wh:i,e:it});});
 sheet('＋ 上架動物',`<div class="mut sm">只能上架突變色、巨型（1.3× 以上）或迷你（0.7× 以下）的個體。上架後動物會先離開展缸，下架可以拿回。</div>`+(L.map((x,i)=>`<div class="row2"><span>${esc(x.e.name||SP[x.e.sp||x.e.sp].n)} <span class="mut sm">${gTag(x.e)}</span></span><button class="btn sm" data-l="${i}">上架</button></div>`).join('')||'<div class="mut sm">目前沒有特殊個體。去基因實驗桌編輯，或繁殖、釣魚碰運氣吧。</div>'),
 c=>c.querySelectorAll('[data-l]').forEach(b=>b.onclick=async()=>{const x=L[+b.dataset.l],sp=x.e.sp,sug=Math.round((PRICE[sp]||100)*geneMul(x.e.g));const v=typeof prompt==='function'?prompt(`定價（建議 ${sug}）`,String(sug)):String(sug);const price=Math.max(1,Math.min(999999,parseInt(v)||0));if(!v||!price)return;
  const o=await onInit();if(!o.ready||!o.canW){toast('沒有上架權限');return;}nick();const ref=o.db.doc('mkt/'+o.uid);try{const cur=await ref.get();const items=(cur.exists?(cur.data().items||[]):[]).slice();if(items.length>=10){toast('最多同時上架 10 隻');return;}
   const it={iid:o.uid.slice(-6)+'-'+Date.now().toString(36),sp,g:{...x.e.g},sex:x.e.sex||'',name:x.e.name||SP[sp].n,price,t:Date.now()};items.push(it);await ref.set({nick:S.nick,items,t:Date.now()});
   if(x.tk)sellAnimalSilent(x.tk,x.e);else S.wh.splice(x.wh,1);markDirty();toast(`🏪 ${it.name} 上架了（${fmt$(price)}）`,2600);mktSheet();}catch(e){toast('上架失敗，等一下再試');}}));}
function sellAnimalSilent(tk,e){const cr=tk.creatures.find(k=>k.entry===e);if(cr){if(typeof GLO!=='undefined')GLO.delete(cr);cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}tk.st.animals.splice(tk.st.animals.indexOf(e),1);logEv(tk.st,`${e.name} 上架到玩家市集`);refreshChips();if(sel&&sel.entry===e){$('#pick').style.display='none';sel=null;}}
const _ms1=mapSheet;mapSheet=function(){_ms1();const c=$('#shC'),d=document.createElement('div');d.style.cssText='display:flex;gap:6px;margin-top:10px';d.innerHTML='<button class="btn" style="flex:1" id="oLb">🏆 全服排行榜</button><button class="btn" style="flex:1" id="oMk">🏪 玩家市集</button>';c.insertBefore(d,c.children[1]||null);d.querySelector('#oLb').onclick=()=>lbSheet();d.querySelector('#oMk').onclick=()=>mktSheet();};
const _ms2=moreSheet;moreSheet=function(){_ms2();const c=$('#shC'),b=document.createElement('button');b.className='opt';b.innerHTML='<b>🏆 全服排行榜</b><span class="mut">和其他玩家比最大的魚、Boss 數</span>';b.onclick=()=>lbSheet();c.appendChild(b);};
setTimeout(()=>{settleMarket();},8000);
boot();
