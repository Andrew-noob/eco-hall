/* =================================================================
   👥 即時看到同一間館裡的其他玩家（Firebase Realtime Database）
   ================================================================= */
const LIVE={on:false,ref:null,me:null,av:{},last:{x:0,z:0,yaw:0,t:0},host:null};
async function liveInit(){if(window.claude||LIVE.on)return;try{const o=await fbInit();if(!o.ready)return;if(!window.firebase.database)await ldJs('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js');
 const db=window.firebase.database();LIVE.host=VISIT||o.uid;LIVE.uid=o.uid;LIVE.ref=db.ref('rooms/'+LIVE.host);LIVE.me=LIVE.ref.child(o.uid);LIVE.me.onDisconnect().remove();LIVE.on=true;
 LIVE.ref.on('child_added',s=>liveUpd(s.key,s.val(),true));LIVE.ref.on('child_changed',s=>liveUpd(s.key,s.val(),false));LIVE.ref.on('child_removed',s=>liveDel(s.key));livePush(true);}catch(e){console.warn('live',e);}}
const liveNick=()=>{if(VISIT){try{const l=JSON.parse(localStorage.getItem('museum-v2'));if(l&&l.nick)return l.nick;}catch(e){}}return S.nick||'玩家';};
function livePush(force){if(!LIVE.on||document.hidden)return;const L=LIVE.last,now=Date.now();const moved=Math.hypot(player.x-L.x,player.z-L.z)>.04||Math.abs(player.yaw-L.yaw)>.06||Math.abs((player.y||0)-(L.y||0))>.2;
 if(!force&&!moved&&now-L.t<6000)return;Object.assign(L,{x:player.x,z:player.z,y:player.y||0,yaw:player.yaw,t:now});const d={x:+player.x.toFixed(2),y:+(player.y||0).toFixed(2),z:+player.z.toFixed(2),r:+player.yaw.toFixed(2),n:liveNick().slice(0,12),t:now};if(LIVE.emo&&now-LIVE.emo.t<4000)d.e=LIVE.emo;LIVE.me.set(d).catch(()=>{});}
setInterval(()=>livePush(false),250);document.addEventListener('visibilitychange',()=>{if(!LIVE.on)return;if(document.hidden)LIVE.me.remove().catch(()=>{});else livePush(true);});
const hueOf=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h;};
function nameTex(n,host){const cv=document.createElement('canvas');cv.width=320;cv.height=80;const x=cv.getContext('2d');x.fillStyle='rgba(8,18,28,.75)';x.beginPath();x.roundRect?x.roundRect(4,8,312,64,30):x.rect(4,8,312,64);x.fill();x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='700 34px "PingFang TC",sans-serif';x.fillText((host?'🏠 ':'')+n,160,42);const t=new THREE.CanvasTexture(cv);return t;}
function emoTex(e){const cv=document.createElement('canvas');cv.width=160;cv.height=160;const x=cv.getContext('2d');x.font='110px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,80,88);return new THREE.CanvasTexture(cv);}
function mkAvatar(id,v){const g=new THREE.Group();const col=new THREE.Color().setHSL(hueOf(id)/360,.55,.55);const m=new THREE.MeshStandardMaterial({color:col,roughness:.6});
 add(new THREE.CylinderGeometry(.2,.25,.95,14),m,0,.72,0,g);add(new THREE.SphereGeometry(.2,14,10),m,0,.2,0,g).scale.set(1.25,.5,1.25);add(new THREE.SphereGeometry(.17,16,12),new THREE.MeshStandardMaterial({color:C(0xf2d2b6),roughness:.7}),0,1.37,0,g);
 const eye=new THREE.MeshBasicMaterial({color:C(0x111111)});add(new THREE.SphereGeometry(.025,6,4),eye,-.06,1.4,-.15,g);add(new THREE.SphereGeometry(.025,6,4),eye,.06,1.4,-.15,g);
 const host=id===LIVE.host;const nm=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTex(v.n||'玩家',host),depthTest:false,transparent:true}));nm.scale.set(1.2,.3,1);nm.position.y=1.85;nm.renderOrder=20;g.add(nm);
 const em=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false}));em.scale.set(.5,.5,1);em.position.y=2.3;em.visible=false;em.renderOrder=21;g.add(em);
 g.position.set(v.x,v.y||0,v.z);g.rotation.y=v.r||0;scene.add(g);return{g,nm,em,n:v.n,tgt:{x:v.x,y:v.y||0,z:v.z,r:v.r||0},ph:0,et:0};}
function liveUpd(id,v,added){if(!v||id===LIVE.uid)return;if(Date.now()-(v.t||0)>600e3)return;let a=LIVE.av[id];
 if(!a){a=LIVE.av[id]=mkAvatar(id,v);if(added&&Date.now()-v.t<120e3){if(!VISIT)toast(`👋 ${v.n||'有人'} 來參觀你的館了！`,4200);else toast(id===LIVE.host?`🏠 館主 ${v.n||''} 在線上，就在館裡`:`👥 ${v.n||'有人'} 也在這裡參觀`,3600);}liveHud();}
 if(v.n&&v.n!==a.n){a.n=v.n;a.nm.material.map=nameTex(v.n,id===LIVE.host);}a.tgt={x:v.x,y:v.y||0,z:v.z,r:v.r||0};
 if(v.e&&v.e.t!==a.et&&Date.now()-v.e.t<5000){a.et=v.e.t;a.em.material.map=emoTex(v.e.k||'👋');a.em.material.needsUpdate=true;a.em.visible=true;a.emT=3.5;}}
function liveDel(id){const a=LIVE.av[id];if(!a)return;scene.remove(a.g);delete LIVE.av[id];liveHud();}
globalAnims.push((dt,t)=>{for(const id in LIVE.av){const a=LIVE.av[id],T=a.tgt,g=a.g;const dx=T.x-g.position.x,dz=T.z-g.position.z,d=Math.hypot(dx,dz);
 if(d>8||Math.abs(T.y-g.position.y)>2){g.position.set(T.x,T.y,T.z);}else{const k=Math.min(1,dt*8);g.position.x+=dx*k;g.position.z+=dz*k;g.position.y+=(T.y-g.position.y)*k;}
 let dr=T.r-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,dt*8);const mv=Math.min(1,d*6);a.ph+=dt*9*mv;g.children[0].position.y=.72+Math.abs(Math.sin(a.ph))*.05*mv;
 if(a.em.visible){a.emT-=dt;a.em.position.y=2.3+Math.sin(t*4)*.05;if(a.emT<=0)a.em.visible=false;}}});
/* 右上角的人數小標和打招呼 */
function liveHud(){let h=document.getElementById('liveHud');const n=Object.keys(LIVE.av).length;if(!n){if(h)h.remove();return;}
 if(!h){h=document.createElement('div');h.id='liveHud';h.style.cssText='position:fixed;right:10px;top:calc(env(safe-area-inset-top) + 64px);z-index:55;display:flex;gap:6px;align-items:center;background:rgba(8,18,28,.85);padding:6px 8px;border-radius:12px;border:1px solid rgba(111,211,255,.3)';document.body.appendChild(h);}
 h.innerHTML=`<span style="color:#d8f0ff;font-size:13px">👥 ${n+1} 人在館裡</span>${['👋','❤️','😂','👍'].map(e=>`<button class="btn sm" data-e="${e}" style="padding:4px 7px">${e}</button>`).join('')}`;
 if(VISIT){const vb=document.getElementById('visitBar');if(vb)h.style.top='calc(env(safe-area-inset-top) + 150px)';}
 h.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{LIVE.emo={k:b.dataset.e,t:Date.now()};livePush(true);toast(`你比了 ${b.dataset.e}`,1200);});}
setTimeout(()=>{if(!window.claude)liveInit();},VISIT?2500:6000);
boot();
