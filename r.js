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
 else if(p==='heavy'&&FS.hits>0&&FS.zw>.12&&!FS._hs){FS._hs=1;}
 if(FS.pos<.1)FS.dir=1;else if(FS.pos>.9)FS.dir=-1;}
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
  fBtns([['放活魚艙',()=>{S.well=S.well||[];if(S.well.length>=(typeof boatNow==='function'?boatNow().well:6)){toast('活魚艙滿了，先到「🧰 更多 → 活魚艙」處理');return;}S.well.push(it);markDirty();wellSync();toast('🐟 放進活魚艙了，回頭看看牠在游');openCast();},'feed'],[`賣 ${fmt$(c.val)}`,()=>{earn(c.val);mktHit(c.k);toast(`💰 獲得 ${fmt$(c.val)}`);openCast();}],['放生',()=>{toast('🌊 放生了');openCast();}]]);}
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
const VISIT=(()=>{try{return new URLSearchParams(location.search).get('visit')||'';}catch(e){return '';}})();
const ON={ready:false,db:null,uid:null,canW:false};
const FBC={apiKey:"AIzaSyCjBkO264RwY2U_RHEPw3UadvmGIA8fGJo",authDomain:"eco-hall.firebaseapp.com",projectId:"eco-hall",storageBucket:"eco-hall.firebasestorage.app",messagingSenderId:"793329877041",appId:"1:793329877041:web:3e73f31949ffe16b0d1510",databaseURL:"https://eco-hall-default-rtdb.asia-southeast1.firebasedatabase.app"};
const ldJs=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=no;document.head.appendChild(s);});
let fbP=null;function fbInit(){if(fbP)return fbP;fbP=(async()=>{const V='https://www.gstatic.com/firebasejs/10.12.2/';await ldJs(V+'firebase-app-compat.js');await ldJs(V+'firebase-auth-compat.js');await ldJs(V+'firebase-firestore-compat.js');
 const fb=window.firebase;if(!fb.apps.length)fb.initializeApp(FBC);const au=fb.auth();let u=await new Promise(r=>{const un=au.onAuthStateChanged(x=>{un();r(x);});});if(!u){const cr=await au.signInAnonymously();u=cr&&cr.user;}if(!u)return ON;Object.assign(ON,{ready:true,db:fb.firestore(),uid:u.uid,canW:true,g:!u.isAnonymous,gName:u.displayName||((u.providerData||[])[0]||{}).displayName||''});if(VISIT)ON.canW=false;return ON;})().catch(e=>{fbP=null;return ON;});return fbP;}
async function onInit(){if(ON.ready)return ON;try{if(!(window.claude&&claude.use))return await fbInit();const db=await claude.use('db'),us=await claude.use('user');if(!db||!us)return ON;const id=await us.id();if(!id)return ON;
 let cw=null;try{cw=await us.can('data.write');}catch(e){}Object.assign(ON,{ready:true,db,uid:id,canW:cw!==false});}catch(e){}return ON;}
const wait10=p=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r({code:'timeout'}),10000))]);
function nick(){if(!S.nick){const n=(typeof prompt==='function'?prompt('取一個在排行榜和市集顯示的暱稱（最多 12 字）',''):'')||'';S.nick=n.trim().slice(0,12)||'玩家'+String(Date.now()).slice(-4);markDirty();}return S.nick;}
let lbT=0;function lbPushSoon(){clearTimeout(lbT);lbT=setTimeout(lbPush,3000);}
async function lbPush(){const o=await onInit();if(!o.ready||!o.canW||!S.nick)return;S.fishLog=S.fishLog||{};let maxCm=0,maxSp='';for(const k in S.fishLog){if(k.startsWith('boss:'))continue;const v=S.fishLog[k];if(v>maxCm){maxCm=v;maxSp=k;}}
 const bossN=Object.values(S.bossLog||{}).reduce((a,b)=>a+b,0),kinds=Object.keys(S.fishLog).filter(k=>!k.startsWith('boss:')).length;let bossBig=0,bossSp='';for(const k in S.fishLog)if(k.startsWith('boss:')&&S.fishLog[k]>bossBig){bossBig=S.fishLog[k];bossSp=k.slice(5);}
 try{await o.db.doc('lb/'+o.uid).set({nick:S.nick,maxCm,maxSp,bossN,bossBig,bossSp,kinds,t:Date.now()});}catch(e){if(e&&e.code==='invalid_argument')ON.canW=false;}}
async function lbSheet(tab='big'){sheet('🏆 全服釣魚排行榜','<div class="mut">讀取中…</div>');const o=await onInit();if(!o.ready){sheet('🏆 全服釣魚排行榜','<div class="mut sm">目前連不上線上資料，確認有網路後再試一次。</div>');return;}
 let docs=[];try{const sn=await wait10(o.db.collection('lb').limit(300).get());docs=sn.docs.map(d=>({id:d.id,...d.data()}));}catch(e){sheet('🏆 全服釣魚排行榜','<div class="mut sm">排行榜暫時讀不到，等一下再試。</div>');return;}
 const key={big:'maxCm',boss:'bossN',kinds:'kinds'}[tab];docs.sort((a,b)=>(b[key]||0)-(a[key]||0));const nm=k=>BOSS[k]?BOSS[k].n:SP[k]?SP[k].n:'—';
 const rows=docs.slice(0,50).map((d,i)=>`<div class="row2" style="${d.id===o.uid?'background:rgba(111,211,255,.12);border-radius:6px':''}"><span>${['🥇','🥈','🥉'][i]||(i+1)+'.'} <b>${esc(String(d.nick||'玩家'))}</b> <span class="mut sm">${tab==='big'?nm(d.maxSp):tab==='boss'?(d.bossSp?'最大：'+nm(d.bossSp)+' '+(d.bossBig||0)+' cm':''):''}</span></span><span>${tab==='big'?(d.maxCm||0)+' cm':tab==='boss'?(d.bossN||0)+' 條':(d.kinds||0)+' 種'}</span></div>`).join('')||'<div class="mut sm">還沒有人上榜，當第一個！</div>';
 sheet('🏆 全服釣魚排行榜',`<div style="display:flex;gap:6px;margin-bottom:8px">${[['big','最大的魚'],['boss','Boss 數'],['kinds','收集種類']].map(([k,n])=>`<button class="chip ${tab===k?'on':''}" data-t="${k}">${n}</button>`).join('')}</div>
  <div class="mut sm" style="margin-bottom:6px">${o.canW?(S.nick?`你的暱稱：${esc(S.nick)}・釣到新紀錄會自動更新`:'設定暱稱後就會上榜'):'你目前只有瀏覽權限，可以看榜但不能上傳（要請擁有者把你設成「Contributor」）'}</div>${rows}
  ${o.canW?`<button class="btn" id="lbN" style="width:100%;margin-top:8px">${S.nick?'改暱稱':'設定暱稱並上榜'}</button>`:''}`,c=>{c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>lbSheet(b.dataset.t));const n=c.querySelector('#lbN');if(n)n.onclick=async()=>{S.nick='';nick();await lbPush();lbSheet(tab);};});}
/* 玩家市集：上架任何動物，顯示行情價 */
const mkEst=(sp,g)=>typeof estVal==='function'?estVal(sp,g):Math.round((PRICE[sp]||100)*(g&&g.m?geneMul(g):1));
const isSpecial=g=>g&&(g.m!=='n'||g.sz>=1.3||g.sz<=.7);
async function settleMarket(){const o=await onInit();if(!o.ready)return;try{const me=await o.db.doc('mkt/'+o.uid).get();if(!me.exists)return;const my=(me.data().items||[]).slice();if(!my.length)return;
 const bs=await o.db.collection('buys').limit(500).get();S.settled=S.settled||{};let got=0,n=0;const sold=new Set();for(const d of bs.docs)for(const it of(d.data().items||[]))if(it.seller===o.uid)sold.add(it.iid);
 const left=my.filter(it=>{if(sold.has(it.iid)){if(!S.settled[it.iid]){S.settled[it.iid]=1;got+=it.price;n++;}return false;}return true;});
 if(left.length!==my.length&&o.canW){await o.db.doc('mkt/'+o.uid).set({nick:S.nick||'玩家',items:left,t:Date.now()});}if(got){earn(got);markDirty();toast(`🏪 市集賣出 ${n} 隻，收到 ${fmt$(got)}`,4000);}}catch(e){}}
async function mktSheet(){sheet('🏪 玩家市集','<div class="mut">讀取中…</div>');const o=await onInit();if(!o.ready){sheet('🏪 玩家市集','<div class="mut sm">目前連不上線上資料，確認有網路後再試一次。</div>');return;}
 await settleMarket();let ls=[],sold=new Set();try{const [a,b]=await wait10(Promise.all([o.db.collection('mkt').limit(200).get(),o.db.collection('buys').limit(500).get()]));for(const d of b.docs)for(const it of(d.data().items||[]))sold.add(it.iid);
  for(const d of a.docs){const x=d.data();for(const it of(x.items||[]))if(!sold.has(it.iid))ls.push({...it,seller:d.id,nick:x.nick});}}catch(e){sheet('🏪 玩家市集','<div class="mut sm">市集暫時讀不到，等一下再試。</div>');return;}
 const mine=ls.filter(x=>x.seller===o.uid),others=ls.filter(x=>x.seller!==o.uid).sort((a,b)=>b.t-a.t);
 const card=(x,btn)=>`<div class="res"><div><b>${esc(String(x.name||SP[x.sp].n))}</b> <span class="mut">${x.sex||''}</span></div><div class="sm">${SP[x.sp]?SP[x.sp].n:''}・${esc(gTag({g:x.g})||'原色')}・行情 ${fmt$(mkEst(x.sp,x.g))}${x.price<mkEst(x.sp,x.g)*.8?' <span style="color:#6fd38c">🔥 划算</span>':x.price>mkEst(x.sp,x.g)*1.3?' <span style="color:#ffb347">偏貴</span>':''}</div><div class="mut sm">賣家：${esc(String(x.nick||'玩家'))}</div>${btn}</div>`;
 sheet('🏪 玩家市集',`<div class="mut sm">把自己的動物上架，其他玩家用遊戲金幣購買。每件商品都會顯示「行情價」，可以比較划不划算。賣出後下次打開市集會自動收款。</div>${o.canW?'<button class="btn feed" id="mkSell" style="width:100%;margin:8px 0">＋ 上架我的動物</button>':'<div class="mut sm" style="margin:6px 0">你目前只有瀏覽權限，不能上架或購買。</div>'}
  ${mine.length?'<h4>我的上架</h4>'+mine.map(x=>card(x,`<button class="btn sm" data-c="${esc(x.iid)}">下架 ${fmt$(x.price)}</button>`)).join(''):''}<h4>其他玩家的商品</h4>${others.map((x,i)=>card(x,`<button class="btn sm ${o.canW?'':'dis'}" data-b="${i}">買 ${fmt$(x.price)}</button>`)).join('')||'<div class="mut sm">目前沒有商品。</div>'}`,c=>{
  const s=c.querySelector('#mkSell');if(s)s.onclick=listSheet;
  c.querySelectorAll('[data-c]').forEach(b=>b.onclick=async()=>{const it=mine.find(x=>x.iid===b.dataset.c);if(!it)return;try{const left=mine.filter(x=>x.iid!==it.iid).map(({seller,nick,...r})=>r);await o.db.doc('mkt/'+o.uid).set({nick:S.nick||'玩家',items:left,t:Date.now()});S.wh.push({sp:it.sp,g:it.g,sex:it.sex,name:it.name});markDirty();toast('📦 下架，回到倉庫');}catch(e){toast('下架失敗，等一下再試');}mktSheet();});
  c.querySelectorAll('[data-b]').forEach(b=>b.onclick=async()=>{if(!o.canW)return;const x=others[+b.dataset.b];if(!b.dataset.ok){b.dataset.ok=1;b.textContent='確認購買';return;}
   try{const bs=await o.db.collection('buys').limit(500).get();for(const d of bs.docs)for(const it of(d.data().items||[]))if(it.iid===x.iid){toast('剛好被別人買走了');mktSheet();return;}
    if(!pay(x.price,'這隻動物'))return;const ref=o.db.doc('buys/'+o.uid),cur=await ref.get();const items=(cur.exists?(cur.data().items||[]):[]).slice(-200);items.push({iid:x.iid,seller:x.seller,price:x.price,t:Date.now()});await ref.set({items});
    S.wh.push({sp:x.sp,g:x.g,sex:x.sex,name:x.name});markDirty();toast(`🎉 買到 ${x.name}，在 📦 倉庫`,3000);}catch(e){toast('購買失敗，等一下再試');}mktSheet();});});}
function listSheet(){const L=[];for(const id in TANKS){const tk=TANKS[id];for(const e of tk.st.animals)if(SP[e.sp])L.push({tk,e});}(S.wh||[]).forEach((it,i)=>{if(it.sp&&SP[it.sp])L.push({wh:i,e:it});});
 sheet('＋ 上架動物',`<div class="mut sm">任何動物都可以上架，旁邊是目前的行情價（依物種、體型、突變色估算）。上架後動物會先離開展缸，下架可以拿回。</div>`+(L.map((x,i)=>`<div class="row2"><span>${esc(x.e.name||SP[x.e.sp].n)} <span class="mut sm">${gTag(x.e)||''}・行情 ${fmt$(mkEst(x.e.sp,x.e.g))}</span></span><button class="btn sm" data-l="${i}">上架</button></div>`).join('')||'<div class="mut sm">你還沒有動物可以上架。</div>'),
 c=>c.querySelectorAll('[data-l]').forEach(b=>b.onclick=async()=>{const x=L[+b.dataset.l],sp=x.e.sp,sug=mkEst(sp,x.e.g);const v=typeof prompt==='function'?prompt(`定價（建議 ${sug}）`,String(sug)):String(sug);const price=Math.max(1,Math.min(999999,parseInt(v)||0));if(!v||!price)return;
  const o=await onInit();if(!o.ready||!o.canW){toast('沒有上架權限');return;}nick();const ref=o.db.doc('mkt/'+o.uid);try{const cur=await ref.get();const items=(cur.exists?(cur.data().items||[]):[]).slice();if(items.length>=10){toast('最多同時上架 10 隻');return;}
   const it={iid:o.uid.slice(-6)+'-'+Date.now().toString(36),sp,g:{...(x.e.g||{sz:1,m:'n'})},sex:x.e.sex||'',name:x.e.name||SP[sp].n,price,t:Date.now()};items.push(it);await ref.set({nick:S.nick,items,t:Date.now()});
   if(x.tk)sellAnimalSilent(x.tk,x.e);else S.wh.splice(x.wh,1);markDirty();toast(`🏪 ${it.name} 上架了（${fmt$(price)}）`,2600);mktSheet();}catch(e){toast('上架失敗，等一下再試');}}));}
function sellAnimalSilent(tk,e){const cr=tk.creatures.find(k=>k.entry===e);if(cr){if(typeof GLO!=='undefined')GLO.delete(cr);cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}tk.st.animals.splice(tk.st.animals.indexOf(e),1);logEv(tk.st,`${e.name} 上架到玩家市集`);refreshChips();if(sel&&sel.entry===e){$('#pick').style.display='none';sel=null;}}
const _ms1=mapSheet;mapSheet=function(){_ms1();if(VISIT)return;const c=$('#shC'),d=document.createElement('div');d.style.cssText='display:flex;gap:6px;margin-top:10px';d.innerHTML='<button class="btn" style="flex:1" id="oLb">🏆 全服排行榜</button><button class="btn" style="flex:1" id="oMk">🏪 玩家市集</button>';c.insertBefore(d,c.children[1]||null);d.querySelector('#oLb').onclick=()=>lbSheet();d.querySelector('#oMk').onclick=()=>mktSheet();};
const _ms2=moreSheet;moreSheet=function(){_ms2();const c=$('#shC'),b=document.createElement('button');b.className='opt';b.innerHTML='<b>🏆 全服排行榜</b><span class="mut">和其他玩家比最大的魚、Boss 數</span>';b.onclick=()=>lbSheet();c.appendChild(b);};
setTimeout(()=>{settleMarket();},8000);
/* ---------- Firebase：雲端存檔、Google 登入、誰在玩 ---------- */
let cloudRef=null,cloudT=0;
let cloudLT=0;function cloudPush(force){if(VISIT||!cloudRef||!loaded)return;if(!force&&Date.now()-cloudT<60000)return;if(S.t&&S.t===cloudLT&&!force)return;cloudT=Date.now();cloudLT=S.t;S.t=S.t||Date.now();cloudRef.set({j:JSON.stringify(S),t:S.t,nick:S.nick||''}).catch(()=>{});pubPush();}
async function cloudLoad(){if(window.claude)return null;try{const o=await Promise.race([fbInit(),new Promise(r=>setTimeout(()=>r(null),6000))]);if(!o||!o.ready)return null;cloudRef=o.db.doc('saves/'+o.uid);const sn=await wait10(cloudRef.get());if(sn.exists){const d=sn.data();const c=JSON.parse(d.j||'null');if(c&&c.tanks)return c;}}catch(e){}return null;}
async function gLogin(){const o=await fbInit();if(!o.ready){toast('連不上，確認有網路後再試');return;}const fb=window.firebase,au=fb.auth(),pv=new fb.auth.GoogleAuthProvider();
 try{const r=await au.currentUser.linkWithPopup(pv);ON.g=true;ON.gName=r.user.displayName||((r.user.providerData||[])[0]||{}).displayName||'';if(!S.nick&&ON.gName)S.nick=ON.gName.slice(0,12);markDirty();cloudPush(true);presence();toast('✅ 已綁定 Google，換手機登入同一個帳號就能接著玩',4200);mapSheet();}
 catch(e){const c=e&&e.code||'';
  if(c==='auth/credential-already-in-use'||c==='auth/email-already-in-use'){if(!confirm('這個 Google 帳號已經有存檔了，要切換過去嗎？\n（這支手機目前的進度會被那份存檔取代）'))return;
   try{const cr=(fb.auth.GoogleAuthProvider.credentialFromError&&fb.auth.GoogleAuthProvider.credentialFromError(e))||e.credential;await au.signInWithCredential(cr);try{localStorage.removeItem('museum-v2');}catch(_){}location.reload();}catch(e2){toast('切換失敗，等一下再試');}}
  else if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;
  else if(c==='auth/popup-blocked'||c==='auth/operation-not-supported-in-this-environment'||c==='auth/web-storage-unsupported'||c==='auth/internal-error')toast('請用 Safari 或 Chrome 打開遊戲再登入（LINE 裡的瀏覽器不能用 Google 登入）',5200);
  else toast('登入失敗：'+c,4000);}}
async function presence(){if(VISIT||window.claude||document.hidden||!loaded)return;const o=await fbInit();if(!o.ready)return;let n=0;for(const id in S.tanks)n+=(S.tanks[id].animals||[]).length;
 try{await o.db.doc('on/'+o.uid).set({nick:S.nick||'',t:Date.now(),g:!!ON.g,n});}catch(e){}}
function rename(){const v=(prompt('新的暱稱（最多 12 字）',S.nick||'')||'').trim().slice(0,12);if(!v)return;S.nick=v;markDirty();cloudPush(true);presence();lbPushSoon();toast('✏️ 暱稱改成「'+v+'」');}
const agoT=ms=>ms<60000?'剛剛':ms<3600000?Math.floor(ms/60000)+' 分鐘前':ms<86400000?Math.floor(ms/3600000)+' 小時前':Math.floor(ms/86400000)+' 天前';
async function whoSheet(){const T='👥 誰在玩';sheet(T,'<div class="mut">讀取中…</div>');const o=await fbInit();if(!o.ready){sheet(T,'<div class="mut sm">目前連不上線上資料，確認有網路後再試一次。</div>');return;}
 await presence();let ds=[];try{const sn=await wait10(o.db.collection('on').orderBy('t','desc').limit(100).get());ds=sn.docs.map(d=>({id:d.id,...d.data()}));}catch(e){sheet(T,'<div class="mut sm">暫時讀不到，等一下再試。</div>');return;}
 const now=Date.now(),on=ds.filter(d=>now-d.t<180000),rec=ds.filter(d=>now-d.t>=180000&&now-d.t<7*86400000);
 const row=(d,live)=>`<div class="row2" style="${d.id===o.uid?'background:rgba(111,211,255,.12);border-radius:6px':''}"><span>${live?'🟢':'⚪'} <b>${esc(String(d.nick||'無名玩家'))}</b>${d.id===o.uid?' <span class="mut sm">（你）</span>':''}</span><span class="mut sm">${d.n||0} 隻・${live?'在線':agoT(now-d.t)} ${d.id!==o.uid?`<button class="btn sm" data-v="${esc(d.id)}">🏛 參觀</button>`:''}</span></div>`;
 sheet(T,`<div style="margin-bottom:6px"><b>現在在線 ${on.length} 人</b></div>${on.map(d=>row(d,true)).join('')||'<div class="mut sm">目前只有你</div>'}
  <div style="margin:12px 0 6px"><b>這週來過</b></div>${rec.map(d=>row(d,false)).join('')||'<div class="mut sm">還沒有</div>'}
  <div style="display:flex;gap:6px;margin-top:12px"><button class="btn" style="flex:1" id="wRn">✏️ 改暱稱</button><button class="btn" style="flex:1" id="wRf">🔄 重新整理</button></div>`,c=>{c.querySelector('#wRn').onclick=()=>{rename();whoSheet();};c.querySelector('#wRf').onclick=()=>whoSheet();c.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>goVisit(b.dataset.v));gbBox(c);});}
const _ms3=mapSheet;mapSheet=function(){_ms3();if(window.claude||VISIT)return;const c=$('#shC'),d=document.createElement('div');d.style.cssText='display:flex;gap:6px;margin-top:6px';
 d.innerHTML=`<button class="btn" style="flex:1" id="oWho">👥 誰在玩</button><button class="btn" style="flex:1" id="oG">${ON.g?'✅ '+esc((ON.gName||'Google').slice(0,8)):'🔑 Google 登入'}</button>`;c.insertBefore(d,c.children[2]||null);
 d.querySelector('#oWho').onclick=()=>whoSheet();d.querySelector('#oG').onclick=()=>{if(ON.g)toast('已用 Google 登入，進度會存到雲端，換手機登入同一個帳號就能接著玩',4200);else gLogin();};};
if(!window.claude){setInterval(()=>cloudPush(false),15000);setInterval(presence,60000);setTimeout(presence,9000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cloudPush(true);else presence();});addEventListener('pagehide',()=>cloudPush(true));}

/* ---------- 存檔匯出／匯入 ---------- */
function exportSave(){try{S.t=Date.now();const b=new Blob([JSON.stringify(S)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='生態館存檔.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);toast('💾 存檔已下載');}catch(e){toast('匯出失敗');}}
function importSave(){const i=document.createElement('input');i.type='file';i.style.display='none';document.body.appendChild(i);
 i.onchange=()=>{const f=i.files&&i.files[0];i.remove();if(!f)return;const r=new FileReader();r.onload=async()=>{let d=null;try{d=JSON.parse(r.result);}catch(e){}
  if(!d||!d.tanks){toast('這不是生態館的存檔檔案',3500);return;}let n=0;for(const k in d.tanks)n+=(d.tanks[k].animals||[]).length;
  if(!confirm(`要匯入這個存檔嗎？\n裡面有 ${Object.keys(d.tanks).length} 個展缸、${n} 隻動物、$${d.money||0}\n（目前的進度會被取代）`))return;
  d.t=Date.now();if(S.nick&&!d.nick)d.nick=S.nick;try{localStorage.setItem('museum-v2',JSON.stringify(d));}catch(e){}
  if(cloudRef){try{await cloudRef.set({j:JSON.stringify(d),t:d.t,nick:d.nick||''});}catch(e){}}else if(docRef){try{await docRef.set(d);}catch(e){}}
  toast('📥 匯入完成，重新載入中…',3000);setTimeout(()=>location.reload(),900);};r.readAsText(f);};i.click();}
const _ms4=mapSheet;mapSheet=function(){_ms4();if(VISIT)return;const c=$('#shC'),d=document.createElement('div');d.style.cssText='display:flex;gap:6px;margin-top:6px';d.innerHTML='<button class="btn" style="flex:1" id="oEx">💾 匯出存檔</button><button class="btn" style="flex:1" id="oIm">📥 匯入存檔</button>';c.insertBefore(d,c.children[3]||null);d.querySelector('#oEx').onclick=exportSave;d.querySelector('#oIm').onclick=importSave;};


/* ---------- 參觀別人的館、按讚、留言、送禮 ---------- */
let VNAME='';const homeURL=()=>location.pathname;
function pubPush(){if(VISIT||window.claude)return;fbInit().then(o=>{if(!o.ready)return;const t={};for(const k in S.tanks)t[k]=Object.assign({},S.tanks[k],{log:[]});
 o.db.doc('pub/'+o.uid).set({j:JSON.stringify({tanks:t,gd:S.gd||null,up:S.up||null}),nick:S.nick||'',t:Date.now()}).catch(()=>{});});}
async function goVisit(id){toast('🏛 出發參觀…');try{dirty=true;await save();}catch(e){}cloudPush(true);setTimeout(()=>{location.href=homeURL()+'?visit='+encodeURIComponent(id);},600);}
async function visitLoad(){const o=await Promise.race([fbInit(),new Promise(r=>setTimeout(()=>r(null),8000))]);if(!o||!o.ready)return null;
 try{const sn=await wait10(o.db.doc('pub/'+VISIT).get());if(!sn.exists)return null;const d=sn.data(),v=JSON.parse(d.j||'null');if(!v||!v.tanks)return null;VNAME=d.nick||'玩家';
  return Object.assign({money:0,wh:[],fishLog:{},well:[]},v,{nick:VNAME});}catch(e){return null;}}
const ownSave=()=>{try{return JSON.parse(localStorage.getItem('museum-v2'))||null;}catch(e){return null;}};
const myNick=()=>{const l=ownSave();return (l&&l.nick)||'玩家';};
async function gbSend(it){const o=await fbInit();if(!o.ready)return false;const ref=o.db.doc('gb/'+o.uid);
 try{const cur=await ref.get();const items=(cur.exists?(cur.data().items||[]):[]).slice(-60);items.push(Object.assign({to:VISIT,from:o.uid,nick:myNick(),t:Date.now(),id:o.uid.slice(0,6)+Date.now().toString(36)},it));
  await ref.set({items,to:[...new Set(items.map(x=>x.to))]});return true;}catch(e){return false;}}
function visitUI(){const d=document.createElement('div');d.id='visitBar';d.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top) + 64px);z-index:60;display:flex;gap:6px;background:rgba(8,18,28,.9);padding:8px 10px;border-radius:14px;align-items:center;max-width:94vw;flex-wrap:wrap;justify-content:center;border:1px solid rgba(111,211,255,.35)';
 d.innerHTML=`<span style="color:#d8f0ff;font-size:14px;width:100%;text-align:center">🏛 正在參觀 <b>${esc(VNAME)}</b> 的館</span><button class="btn sm" id="vL">❤️ 讚</button><button class="btn sm" id="vG">🎁 送禮</button><button class="btn sm" id="vM">✍️ 留言</button><button class="btn sm feed" id="vH">🏠 回家</button>`;document.body.appendChild(d);
 let liked=false;d.querySelector('#vH').onclick=()=>{location.href=homeURL();};
 d.querySelector('#vL').onclick=async()=>{if(liked){toast('已經按過讚了');return;}liked=true;toast(await gbSend({k:'like'})?'❤️ 按讚了':'按讚失敗，等一下再試');};
 d.querySelector('#vM').onclick=async()=>{const m=(prompt(`留言給 ${VNAME}（最多 60 字）`,'')||'').trim().slice(0,60);if(!m)return;toast(await gbSend({k:'msg',m})?'✍️ 留言送出':'留言失敗，等一下再試');};
 d.querySelector('#vG').onclick=async()=>{const l=ownSave();const have=(l&&l.money)||0;const v=Math.floor(+prompt(`送金幣給 ${VNAME}（50～5000，你有 ${fmt$(have)}）`,'500')||0);if(!v)return;
  if(v<50||v>5000){toast('金額要在 50～5000 之間');return;}if(have<v){toast('你的金幣不夠');return;}
  l.money-=v;l.t=Date.now();try{localStorage.setItem('museum-v2',JSON.stringify(l));}catch(e){}if(cloudRef){try{await cloudRef.set({j:JSON.stringify(l),t:l.t,nick:l.nick||''});}catch(e){}}
  toast(await gbSend({k:'gift',v})?`🎁 送出 ${fmt$(v)}`:'送禮失敗，等一下再試',3000);};
 setTimeout(()=>toast(`歡迎參觀 ${VNAME} 的館！這裡的東西動了也不會影響他`,4200),600);}
async function gbFetch(){const o=await fbInit();if(!o.ready)return [];const got=[];try{const sn=await wait10(o.db.collection('gb').where('to','array-contains',o.uid).limit(100).get());
 for(const d of sn.docs)for(const it of(d.data().items||[]))if(it.to===o.uid)got.push(it);}catch(e){}got.sort((a,b)=>b.t-a.t);return got;}
async function gbCheck(){if(VISIT||window.claude||!loaded)return;const got=await gbFetch();S.gbSeen=S.gbSeen||{};let money=0,n=0,likes=0;
 for(const it of got){if(S.gbSeen[it.id])continue;S.gbSeen[it.id]=1;n++;if(it.k==='gift')money+=Math.min(5000,Math.max(0,it.v||0));if(it.k==='like')likes++;}
 if(n){if(money)earn(money);markDirty();toast(`📬 有 ${n} 則新訪客動態${likes?`・❤️ ${likes}`:''}${money?`・🎁 收到 ${fmt$(money)}`:''}（地圖 → 誰在玩）`,5000);}}
async function gbBox(c){const box=document.createElement('div');box.innerHTML='<div style="margin:14px 0 6px"><b>📬 訪客留言板</b></div><div class="mut sm">讀取中…</div>';c.appendChild(box);
 const got=(await gbFetch()).slice(0,30),now=Date.now();const ic={like:'❤️',msg:'✍️',gift:'🎁'};
 box.innerHTML='<div style="margin:14px 0 6px"><b>📬 訪客留言板</b></div>'+(got.map(it=>`<div class="row2"><span>${ic[it.k]||'•'} <b>${esc(String(it.nick||'玩家'))}</b> <span class="mut sm">${it.k==='like'?'按了讚':it.k==='gift'?'送了 '+fmt$(it.v||0):esc(String(it.m||''))}</span></span><span class="mut sm">${agoT(now-it.t)}</span></div>`).join('')||'<div class="mut sm">還沒有人來過，請朋友來參觀吧！</div>');}
if(!window.claude&&!VISIT){setTimeout(gbCheck,12000);setInterval(gbCheck,180000);}

/* ---------- 出航／入場費、拿掉放大鏡、多種釣竿 ---------- */
const TRIP={sea:[600,'⛵ 租船出航'],stream:[250,'🎫 溪釣入山'],lake:[300,'🛶 租木棧位'],pier:[450,'🎫 堤防夜釣'],ice:[500,'🎫 冰湖門票'],mangrove:[400,'🛶 紅樹林導覽船']};
const tripOf=k=>TRIP[k]||[300,'🎫 入場'];
const _gf=goFish;goFish=function(k){if(curW()===k){_gf(k);return;}const [fee,nm]=tripOf(k);if(!pay(fee,nm))return;_gf(k);setTimeout(()=>toast(`${nm}：付了 ${fmt$(fee)}`,2400),2300);};
{const zb=document.getElementById('zoomBtn');if(zb)zb.style.display='none';if(typeof ZOOM!=='undefined'&&ZOOM!==1){ZOOM=1;try{resize();}catch(e){}}}
const ROD2={
 std:{n:'🎋 標準竿',d:'什麼釣場都能用，沒有特別加成',cost:0,col:null},
 iso:{n:'🪨 磯釣竿',d:'海釣、堤防：判定區 ×1.2；可失誤 +1',cost:3000,col:0x2f6b4f,at:['sea','pier'],zw:1.2,line:1},
 ul:{n:'🌿 溪流短竿',d:'溪釣、湖釣、紅樹林：判定區 ×1.35；海邊 ×0.9',cost:2500,col:0x7a5a2a,at:['stream','lake','mangrove'],zw:1.35,off:.9},
 glow:{n:'🌙 夜光竿',d:'夜間堤防、冰釣：游標變慢 ×0.8，判定區 ×1.15',cost:3500,col:0x3fd8c8,at:['pier','ice'],v:.8,zw:1.15},
 lure:{n:'⚡ 路亞竿',d:'所有釣場：游標變慢 ×0.88；但判定區 ×0.92',cost:4500,col:0xe0662a,v:.88,zw:.92},
 heavy:{n:'⚓ 重型船竿',d:'Boss 和沉重型的魚：少拉 1 次、判定區 ×1.25',cost:8000,col:0x1a1a2a,boss:1},
 carbon:{n:'✨ 碳纖維旗艦竿',d:'所有釣場：判定區 ×1.15、游標 ×0.9、可失誤 +1',cost:20000,col:0xc8c8d8,zw:1.15,v:.9,line:1}};
const rodNow=()=>ROD2[S.rodSel]||ROD2.std;
const _fgv=fgv;fgv=function(k){let v=_fgv(k);const r=rodNow(),w=FS&&FS.w;const here=!r.at||(w&&r.at.includes(w));
 if(k==='rod'){if(r.zw&&here)v*=r.zw;else if(r.off&&!here)v*=r.off;}
 else if(k==='reel'){if(r.v&&here)v*=r.v;}
 else if(k==='line'){if(r.line&&here)v+=r.line;}return v;};
const _hk3=hook;hook=function(){_hk3();if(FS&&FS.st==='reel'&&rodNow().boss&&(FS.boss||FS.pat==='heavy')){FS.need=Math.max(2,FS.need-1);FS.zw=Math.min(.6,FS.zw*1.25);try{setZone();}catch(e){}fSub(`⚓ 重型船竿：只要拉中 ${FS.need} 次`);}};
const _oc=openCast;openCast=function(){_oc();const r=rodNow();if(r.col!=null)rodM.color.set(r.col);};
const _gs=gearSheet;gearSheet=function(){_gs();const c=$('#shC');S.rods=S.rods||{std:1};const sel=S.rodSel||'std';const d=document.createElement('div');
 d.innerHTML='<h4 style="margin:12px 0 4px">🎣 釣竿收藏（選一支帶出門）</h4><div class="mut sm" style="margin-bottom:6px">上面的「釣竿等級」是基本強度，這裡選的竿子會再加上特殊效果。</div>'+Object.entries(ROD2).map(([k,r])=>`<div class="res"><div><b>${r.n}</b> ${k===sel?'<span style="color:var(--acc)">使用中</span>':''}</div><div class="mut sm">${r.d}</div>${S.rods[k]?(k===sel?'<span></span>':`<button class="btn sm" data-rs="${k}">換上</button>`):`<button class="btn sm" data-rb="${k}">買 ${fmt$(r.cost)}</button>`}</div>`).join('');
 c.appendChild(d);d.querySelectorAll('[data-rs]').forEach(b=>b.onclick=()=>{S.rodSel=b.dataset.rs;markDirty();toast('換上 '+ROD2[S.rodSel].n);gearSheet();});
 d.querySelectorAll('[data-rb]').forEach(b=>b.onclick=()=>{const k=b.dataset.rb,r=ROD2[k];if(!pay(r.cost,r.n))return;S.rods[k]=1;S.rodSel=k;markDirty();toast(`🎉 買了 ${r.n}，已經換上`,2600);gearSheet();});};

if(typeof S!=='undefined')setInterval(()=>{if(S.inf){S.inf=false;markDirty();updMoney();}},3000);

