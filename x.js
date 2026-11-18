/* =================================================================
   👥 即時連線：同一間館／同一艘船看得到彼此、表情、一起出海、🐟 魚拍大亂鬥
   ================================================================= */
const LIVE={on:false,db:null,ref:null,me:null,room:null,av:{},last:{x:0,z:0,yaw:0,t:0},host:null};
const qp=k=>{try{return new URLSearchParams(location.search).get(k)||'';}catch(e){return '';}};
async function liveInit(){if(window.claude||LIVE.on)return;try{const o=await fbInit();if(!o.ready)return;if(!window.firebase.database)await ldJs('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js');
 LIVE.db=window.firebase.database();LIVE.uid=o.uid;LIVE.on=true;liveJoin(wantRoom());
 LIVE.db.ref('hits/'+o.uid).on('child_added',s=>{const h=s.val();s.ref.remove().catch(()=>{});if(h&&Date.now()-(h.t||0)<15e3)gotHit(h);});
 LIVE.db.ref('invites/'+o.uid).on('value',s=>{const v=s.val();if(v&&Date.now()-(v.t||0)<120e3&&v.t!==LIVE.invT){LIVE.invT=v.t;showInvite(v);}});
 const cr=qp('crew');if(cr&&!VISIT){try{history.replaceState(null,'',location.pathname);}catch(e){}setTimeout(()=>{S.crewOf=cr;goFish('sea');toast('⛵ 上船了！',2400);},800);}
 if(!S.nick&&!VISIT&&typeof rename==='function')setTimeout(()=>{toast('先取一個暱稱，別人才認得你',2600);rename();},1800);}catch(e){console.warn('live',e);}}
function wantRoom(){if(typeof curW==='function'&&curW()==='sea')return 'sea_'+(S.crewOf||LIVE.uid);if(S.crewOf)S.crewOf=null;return VISIT||LIVE.uid;}
function liveJoin(room){if(!LIVE.db||room===LIVE.room)return;if(LIVE.ref){LIVE.ref.off();LIVE.me.onDisconnect().cancel();LIVE.me.remove().catch(()=>{});}for(const id in LIVE.av)liveDel(id);
 LIVE.room=room;LIVE.host=room.startsWith('sea_')?room.slice(4):room;LIVE.ref=LIVE.db.ref('rooms/'+room);LIVE.me=LIVE.ref.child(LIVE.uid);LIVE.me.onDisconnect().remove();
 LIVE.ref.on('child_added',s=>liveUpd(s.key,s.val(),true));LIVE.ref.on('child_changed',s=>liveUpd(s.key,s.val(),false));LIVE.ref.on('child_removed',s=>liveDel(s.key));livePush(true);liveHud();}
setInterval(()=>{if(LIVE.on)liveJoin(wantRoom());},1000);
const liveNick=()=>{if(VISIT){try{const l=JSON.parse(localStorage.getItem('museum-v2'));if(l&&l.nick)return l.nick;}catch(e){}}return S.nick||'玩家';};
function livePush(force){if(!LIVE.on||!LIVE.me||document.hidden)return;const L=LIVE.last,now=Date.now();const moved=Math.hypot(player.x-L.x,player.z-L.z)>.04||Math.abs(player.yaw-L.yaw)>.06||Math.abs((player.y||0)-(L.y||0))>.2;
 if(!force&&!moved&&now-L.t<6000)return;Object.assign(L,{x:player.x,z:player.z,y:player.y||0,yaw:player.yaw,t:now});
 const d={x:+player.x.toFixed(2),y:+(player.y||0).toFixed(2),z:+player.z.toFixed(2),r:+player.yaw.toFixed(2),n:liveNick().slice(0,12),t:now,w:LIVE.wpn||'sardine'};
 if(LIVE.emo&&now-LIVE.emo.t<4000)d.e=LIVE.emo;if(LIVE.cat&&now-LIVE.cat.t<6000)d.c=LIVE.cat;if(LIVE.sw&&now-LIVE.sw<600)d.s=LIVE.sw;LIVE.me.set(d).catch(()=>{});}
setInterval(()=>livePush(false),250);document.addEventListener('visibilitychange',()=>{if(!LIVE.on||!LIVE.me)return;if(document.hidden)LIVE.me.remove().catch(()=>{});else livePush(true);});
/* ---- 小人 ---- */
{const st=document.createElement('style');st.textContent='#sheet{z-index:90!important}.toast{z-index:95!important}';document.head.appendChild(st);}
const hueOf=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h;};
function nameTex(n,host){const cv=document.createElement('canvas');cv.width=320;cv.height=80;const x=cv.getContext('2d');x.fillStyle='rgba(8,18,28,.75)';x.beginPath();x.roundRect?x.roundRect(4,8,312,64,30):x.rect(4,8,312,64);x.fill();x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='700 34px "PingFang TC",sans-serif';x.fillText((host?(LIVE.room&&LIVE.room.startsWith('sea_')?'⚓ ':'🏠 '):'')+n,160,42);return new THREE.CanvasTexture(cv);}
function emoTex(e){const cv=document.createElement('canvas');cv.width=160;cv.height=160;const x=cv.getContext('2d');x.font='110px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,80,88);return new THREE.CanvasTexture(cv);}
function heldFish(k,fp){const d=dispGeo(k);const m=new THREE.Mesh(d.g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.4,side:THREE.DoubleSide}));const L=Math.min(SLAP[k]?SLAP[k].vis:.4,fp?.42:.9);m.scale.setScalar(L/d.len);return m;}
function mkAvatar(id,v){const g=new THREE.Group();const col=new THREE.Color().setHSL(hueOf(id)/360,.55,.55);const m=new THREE.MeshStandardMaterial({color:col,roughness:.6});
 add(new THREE.CylinderGeometry(.2,.25,.95,14),m,0,.72,0,g);add(new THREE.SphereGeometry(.2,14,10),m,0,.2,0,g).scale.set(1.25,.5,1.25);add(new THREE.SphereGeometry(.17,16,12),new THREE.MeshStandardMaterial({color:C(0xf2d2b6),roughness:.7}),0,1.37,0,g);
 const eye=new THREE.MeshBasicMaterial({color:C(0x111111)});add(new THREE.SphereGeometry(.025,6,4),eye,-.06,1.4,-.15,g);add(new THREE.SphereGeometry(.025,6,4),eye,.06,1.4,-.15,g);
 const arm=new THREE.Group();arm.position.set(.28,1.05,0);g.add(arm);const host=id===LIVE.host;
 const nm=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTex(v.n||'玩家',host),depthTest:false,transparent:true}));nm.scale.set(1.2,.3,1);nm.position.y=1.85;nm.renderOrder=20;g.add(nm);
 const em=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false}));em.scale.set(.5,.5,1);em.position.y=2.3;em.visible=false;em.renderOrder=21;g.add(em);
 g.position.set(v.x,v.y||0,v.z);g.rotation.y=v.r||0;scene.add(g);return{g,nm,em,arm,n:v.n,tgt:{x:v.x,y:v.y||0,z:v.z,r:v.r||0},ph:0,et:0,ct:0,st:0,w:null,sw:0};}
function liveUpd(id,v,added){if(!v||id===LIVE.uid)return;if(Date.now()-(v.t||0)>600e3)return;let a=LIVE.av[id];
 if(!a){a=LIVE.av[id]=mkAvatar(id,v);if(added&&Date.now()-v.t<120e3){const sea=LIVE.room.startsWith('sea_');if(sea)toast(id===LIVE.host?`⚓ 船長 ${v.n||''} 在船上`:`⛵ ${v.n||'有人'} 上船了！`,3200);else if(!VISIT)toast(`👋 ${v.n||'有人'} 來參觀你的館了！`,4200);else toast(id===LIVE.host?`🏠 館主 ${v.n||''} 在線上，就在館裡`:`👥 ${v.n||'有人'} 也在這裡參觀`,3600);}liveHud();}
 if(v.n&&v.n!==a.n){a.n=v.n;a.nm.material.map=nameTex(v.n,id===LIVE.host);}a.tgt={x:v.x,y:v.y||0,z:v.z,r:v.r||0};
 if(v.w&&v.w!==a.w&&SLAP[v.w]){a.w=v.w;for(const ch of [...a.arm.children])a.arm.remove(ch);const f=heldFish(v.w);f.rotation.set(0,Math.PI/2,-1.2);f.position.set(0,0,-.1);a.arm.add(f);}
 if(v.s&&v.s!==a.st){a.st=v.s;a.sw=.35;}
 if(v.e&&v.e.t!==a.et&&Date.now()-v.e.t<5000){a.et=v.e.t;a.em.material.map=emoTex(v.e.k||'👋');a.em.material.needsUpdate=true;a.em.visible=true;a.emT=3.5;}
 if(v.c&&v.c.t!==a.ct&&Date.now()-v.c.t<8000){a.ct=v.c.t;toast(`🎣 ${v.n||'有人'} 釣到 ${v.c.cm} cm 的${v.c.nm}！`,3200);a.em.material.map=emoTex('🎣');a.em.material.needsUpdate=true;a.em.visible=true;a.emT=2.5;}}
function liveDel(id){const a=LIVE.av[id];if(!a)return;scene.remove(a.g);delete LIVE.av[id];liveHud();}
globalAnims.push((dt,t)=>{for(const id in LIVE.av){const a=LIVE.av[id],T=a.tgt,g=a.g;const dx=T.x-g.position.x,dz=T.z-g.position.z,d=Math.hypot(dx,dz);
 if(d>8||Math.abs(T.y-g.position.y)>2){g.position.set(T.x,T.y,T.z);}else{const k=Math.min(1,dt*8);g.position.x+=dx*k;g.position.z+=dz*k;g.position.y+=(T.y-g.position.y)*k;}
 let dr=T.r-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,dt*8);const mv=Math.min(1,d*6);a.ph+=dt*9*mv;g.children[0].position.y=.72+Math.abs(Math.sin(a.ph))*.05*mv;
 if(a.sw>0){a.sw-=dt;a.arm.rotation.x=-Math.sin((1-a.sw/.35)*Math.PI)*1.8;}else a.arm.rotation.x=0;
 if(a.em.visible){a.emT-=dt;a.em.position.y=2.3+Math.sin(t*4)*.05;if(a.emT<=0)a.em.visible=false;}}});
/* ---- 🐟 魚拍大亂鬥 ---- */
const SLAP={sardine:{n:'沙丁魚',p:3,cd:.6,vis:.3},mullet:{n:'烏魚',p:5,cd:.8,vis:.45},hairtail:{n:'白帶魚',p:6,cd:.9,vis:.9},kuhua:{n:'苦花',p:4,cd:.7,vis:.35},
 grouper:{n:'龍膽石斑',p:9,cd:1.4,vis:.7},shark:{n:'黑鰭礁鯊',p:12,cd:2,vis:1},marlin:{n:'旗魚',p:16,cd:3,vis:1.3},whale:{n:'鯨鯊',p:22,cd:8,vis:1.6,aoe:4}};
function slapOwned(){const L=S.fishLog||{};const own=Object.keys(SLAP).filter(k=>k==='sardine'||L[k]||L['boss:'+k]);let hasW=false;for(const id in TANKS)if(TANKS[id].st&&TANKS[id].st.animals.some(e=>e.sp==='whale'))hasW=true;if(hasW&&!own.includes('whale'))own.push('whale');return own;}
let HF=null,swingT=0,slapCD=0;const KB={vx:0,vz:0,sh:0};
function setWeapon(k){LIVE.wpn=k;if(HF){camera.remove(HF);HF=null;}if(!k)return;if(!camera.parent)scene.add(camera);HF=heldFish(k,true);HF.position.set(.34,-.36,-.8);HF.rotation.set(0,Math.PI/2+.3,-.6);camera.add(HF);HF.userData.base=HF.rotation.clone();livePush(true);}
function swing(){if(slapCD>0)return;const k=LIVE.wpn||'sardine',w=SLAP[k];slapCD=w.cd;swingT=.35;LIVE.sw=Date.now();livePush(true);
 const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);let hit=0;
 for(const id in LIVE.av){const a=LIVE.av[id],p=a.g.position;const dx=p.x-player.x,dz=p.z-player.z,d=Math.hypot(dx,dz);if(Math.abs(p.y-(player.y||0))>1.5)continue;
  const R=w.aoe||2.3;const ang=d>0?(dx*fx+dz*fz)/d:1;if(d<R&&(w.aoe||ang>.45)){hit++;const nx=d>0?dx/d:fx,nz=d>0?dz/d:fz;LIVE.db.ref('hits/'+id).push({f:LIVE.uid,n:liveNick(),k,p:w.p,dx:+nx.toFixed(2),dz:+nz.toFixed(2),t:Date.now()}).catch(()=>{});
   a.em.material.map=emoTex('💦');a.em.material.needsUpdate=true;a.em.visible=true;a.emT=1.2;}}
 if(hit)toast(`💥 用${w.n}打中 ${hit} 個人！`,1400);}
function gotHit(h){const w=SLAP[h.k]||SLAP.sardine;KB.vx+=h.dx*h.p;KB.vz+=h.dz*h.p;KB.sh=.5;toast(`💥 被 ${h.n||'某人'} 用${w.n}打飛了！`,2200);}
globalAnims.push((dt,t)=>{if(slapCD>0)slapCD-=dt;if(HF){HF.visible=!(typeof curW==='function'&&curW());if(swingT>0){swingT-=dt;const s=Math.sin((1-swingT/.35)*Math.PI);HF.rotation.z=HF.userData.base.z+s*1.6;HF.position.x=.32-s*.35;}else{HF.rotation.z=HF.userData.base.z+Math.sin(t*2)*.05;HF.position.x=.32;}}
 const sp=Math.hypot(KB.vx,KB.vz);if(sp>.05){for(const [ax,v] of[['x','vx'],['z','vz']]){const nx=player.x+(ax==='x'?KB.vx*dt:0),nz=player.z+(ax==='z'?KB.vz*dt:0);if(okPos(nx,nz)){player.x=nx;player.z=nz;}else KB[v]*=-.35;}const f=Math.exp(-3.2*dt);KB.vx*=f;KB.vz*=f;}else{KB.vx=KB.vz=0;}
 if(KB.sh>0){KB.sh-=dt;player.pitch=(player.pitch||0)+Math.sin(t*60)*.01*KB.sh;}});
/* ---- 右上角：人數、表情、揮魚 ---- */
function liveHud(){let h=document.getElementById('liveHud');const n=Object.keys(LIVE.av).length;if(!n){if(h)h.remove();setWeapon(null);return;}
 if(!h){h=document.createElement('div');h.id='liveHud';h.style.cssText='position:fixed;right:10px;z-index:55;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;align-items:center;max-width:62vw;background:rgba(8,18,28,.85);padding:6px 8px;border-radius:12px;border:1px solid rgba(111,211,255,.3)';document.body.appendChild(h);}
 h.style.top=VISIT?'calc(env(safe-area-inset-top) + 175px)':'calc(env(safe-area-inset-top) + 64px)';if(!VISIT&&document.getElementById('qTrk'))h.style.top='calc(env(safe-area-inset-top) + 168px)';
 if(!LIVE.wpn)setWeapon('sardine');const own=slapOwned();
 h.innerHTML=`<span style="color:#d8f0ff;font-size:13px;width:100%;text-align:right">👥 ${n+1} 人在${LIVE.room&&LIVE.room.startsWith('sea_')?'船上':'館裡'}</span>${['👋','❤️','😂','👍'].map(e=>`<button class="btn sm" data-e="${e}" style="padding:4px 7px">${e}</button>`).join('')}
  <button class="btn sm" id="wpn" style="padding:4px 7px">🐟 ${SLAP[LIVE.wpn||'sardine'].n} ▾</button><button class="btn sm feed" id="swg" style="padding:4px 10px">揮！</button>`;
 h.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{LIVE.emo={k:b.dataset.e,t:Date.now()};livePush(true);toast(`你比了 ${b.dataset.e}`,1200);});
 h.querySelector('#swg').onclick=swing;h.querySelector('#wpn').onclick=wpnSheet;}
const HOW={sardine:'一開始就有',mullet:'釣到烏魚',hairtail:'釣到白帶魚',kuhua:'釣到苦花',grouper:'釣到龍膽石斑',shark:'釣到黑鰭礁鯊',marlin:'釣到 Boss 旗魚',whale:'館裡養一隻鯨鯊'};
function wpnSheet(){const own=slapOwned(),cur=LIVE.wpn||'sardine';sheet('🐟 選一條魚當武器',`<div class="mut sm" style="margin-bottom:6px">擊飛力越大，對方飛越遠；越大的魚冷卻越久。</div>`+Object.entries(SLAP).map(([k,w])=>{const ok=own.includes(k);return`<button class="opt" data-w="${k}" ${ok?'':'disabled style="opacity:.45"'}><b>${k===cur?'✅ ':''}${w.n}</b><span class="mut">擊飛力 ${w.p}・冷卻 ${w.cd} 秒${w.aoe?'・💥 範圍攻擊':''}${ok?'':'・🔒 '+HOW[k]}</span></button>`;}).join(''),
 c=>c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{if(!own.includes(b.dataset.w))return;setWeapon(b.dataset.w);$('#sheet').classList.remove('open');liveHud();toast(`🐟 拿起${SLAP[b.dataset.w].n}`,1500);}));}
/* ---- 釣到魚時通知同一間的人 ---- */
const _lfL=landFish;landFish=function(){_lfL();const c=FS&&FS.catch;if(c&&LIVE.on){LIVE.cat={nm:c.nm,cm:c.cm,t:Date.now()};livePush(true);}};
/* ---- ⛵ 一起出海：邀請、接受 ---- */
async function inviteSheet(){if(curW()!=='sea'){toast('要在海釣場才能邀請');return;}if(!S.boat){toast('要有自己的船才能邀朋友上船（釣具店 → ⛵ 船隻）',3600);return;}const o=await fbInit();if(!o.ready)return;
 const cap=boatNow().crew,on=Object.keys(LIVE.av).length+1;sheet('👥 邀請朋友上船','<div class="mut">讀取中…</div>');let ds=[];try{const sn=await wait10(o.db.collection('on').orderBy('t','desc').limit(60).get());ds=sn.docs.map(d=>({id:d.id,...d.data()})).filter(d=>d.id!==o.uid&&Date.now()-d.t<180000);}catch(e){}
 sheet('👥 邀請朋友上船',`<div class="mut sm" style="margin-bottom:6px">${boatNow().n}：船上 ${on}/${cap} 人。朋友接受後會直接傳送到你的船上，大家看得到彼此，誰釣到魚全船都會知道。</div>`+(on>=cap?'<div class="mut">船上滿了，升級更大的船可以載更多人。</div>':
  (ds.length?ds.map(d=>`<button class="opt" data-u="${esc(d.id)}" data-n="${esc(String(d.nick||'玩家'))}"><b>🟢 ${esc(String(d.nick||'無名玩家'))}</b><span class="mut">在線上</span></button>`).join(''):'<div class="mut">現在沒有其他人在線上。</div>')),
  c=>c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{LIVE.db.ref('invites/'+b.dataset.u).set({from:o.uid,n:liveNick(),boat:boatNow().n,t:Date.now()}).then(()=>toast(`📨 邀請已送給 ${b.dataset.n}`,2400)).catch(()=>toast('邀請失敗，等一下再試'));}));}
function showInvite(v){let d=document.getElementById('invBox');if(d)d.remove();d=document.createElement('div');d.id='invBox';d.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom) + 110px);z-index:70;background:rgba(8,18,28,.95);border:1px solid #ffb347;border-radius:14px;padding:12px 14px;color:#fff;text-align:center;width:min(88vw,340px)';
 d.innerHTML=`<div style="font-size:16px;margin-bottom:8px">⛵ <b>${esc(String(v.n||'朋友'))}</b> 邀請你搭他的${esc(String(v.boat||'船'))}出海！</div><div style="display:flex;gap:8px"><button class="btn feed" style="flex:1" id="invY">上船</button><button class="btn" style="flex:1" id="invN">不要</button></div>`;document.body.appendChild(d);
 const clr=()=>{d.remove();LIVE.db.ref('invites/'+LIVE.uid).remove().catch(()=>{});};d.querySelector('#invN').onclick=clr;
 d.querySelector('#invY').onclick=()=>{clr();if(VISIT){location.href=location.pathname+'?crew='+encodeURIComponent(v.from);return;}if(curW()==='sea'&&typeof goHome==='function'){goHome();}setTimeout(()=>{S.crewOf=v.from;goFish('sea');toast(`⛵ 上了 ${v.n||'朋友'} 的船！`,2600);},300);};setTimeout(()=>{if(d.parentNode)d.remove();},60000);}
const _msX=moreSheet;moreSheet=function(){_msX();const c=$('#shC');if(!c||curW()!=='sea')return;const b=document.createElement('button');b.className='opt';b.innerHTML=`<b>👥 邀請朋友上船</b><span class="mut">${S.boat?boatNow().n+'・最多 '+boatNow().crew+' 人':'要有自己的船（釣具店 → ⛵ 船隻）'}</span>`;b.onclick=inviteSheet;c.insertBefore(b,c.children[1]||null);};
setTimeout(()=>{if(!window.claude)liveInit();},VISIT?2500:6000);
