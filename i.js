/* ===== i.js：新鯨鯊、基因系統、全面繁殖、2F 繁殖區＋基因實驗桌 ===== */

/* ---------- 鯨鯊（依 Tripo 參考圖重做：深藍、白斑、扁寬頭、背脊稜線、新月尾） ---------- */
(function repaintWhale(){const cv=whaleTex.image,x=cv.getContext('2d'),w=cv.width,h=cv.height;
 const g=x.createLinearGradient(0,0,0,h);[[0,'#1b2d63'],[.18,'#203a7c'],[.31,'#2b4c96'],[.39,'#7d97c6'],[.45,'#e8eef6'],[.55,'#e8eef6'],[.61,'#7d97c6'],[.69,'#2b4c96'],[.82,'#203a7c'],[1,'#1b2d63']].forEach(s=>g.addColorStop(...s));
 x.fillStyle=g;x.fillRect(0,0,w,h);
 const jg=x.createRadialGradient(0,h/2,0,0,h/2,h*.22);jg.addColorStop(0,'rgba(240,244,250,1)');jg.addColorStop(1,'rgba(240,244,250,0)');x.fillStyle=jg;x.fillRect(0,h*.25,w*.08,h*.5);
 x.strokeStyle='rgba(190,210,240,.16)';x.lineWidth=2;for(let u=.23;u<.9;u+=.032){x.beginPath();x.moveTo(u*w,h*.02);x.lineTo(u*w,h*.36);x.moveTo(u*w,h*.64);x.lineTo(u*w,h*.98);x.stroke();}
 for(const v of[.1,.2,.29,.71,.8,.9]){x.lineWidth=3;x.strokeStyle='rgba(12,22,58,.35)';x.beginPath();x.moveTo(.12*w,v*h);x.lineTo(.92*w,v*h);x.stroke();}
 const spot=(u,v,r,a=.95)=>{x.fillStyle=`rgba(214,228,247,${a})`;x.beginPath();x.ellipse(u*w,v*h,r,r*rnd(.85,1.1),0,0,7);x.fill();};
 for(let u=.012;u<.22;u+=.011)for(let v=.01;v<1;v+=.02){if(Math.abs(v-.5)<.14)continue;if(Math.random()<.25)continue;spot(u+rnd(-.004,.004),v+rnd(-.005,.005),rnd(1.3,2.6));}
 for(let u=.22;u<.95;u+=.022)for(let v=.012;v<1;v+=.03){const d=Math.abs(v-.5);if(d<.13)continue;if(Math.random()<.22)continue;const big=d>.2?1:.6;spot(u+rnd(-.006,.006),v+rnd(-.006,.006),rnd(2.6,5.6)*big*(u>.8?.75:1));}
 for(let i=0;i<5;i++){const X=(.165+i*.011)*w;x.strokeStyle='rgba(8,14,40,.75)';x.lineWidth=3.5;x.beginPath();x.moveTo(X,h*.24);x.lineTo(X+3,h*.39);x.moveTo(X,h*.76);x.lineTo(X+3,h*.61);x.stroke();
  x.strokeStyle='rgba(150,175,215,.35)';x.lineWidth=1.5;x.beginPath();x.moveTo(X+3,h*.24);x.lineTo(X+6,h*.39);x.moveTo(X+3,h*.76);x.lineTo(X+6,h*.61);x.stroke();}
 x.fillStyle='#1b2d63';x.fillRect(.975*w,0,.025*w,h);whaleTex.needsUpdate=true;})();
function tFin(pts,thR,thT,uvF){const v=pts.map(p=>V(...p)),N=v.length,n=V(0,0,0);
 for(let i=0;i<N;i++){const a=v[i],b=v[(i+1)%N];n.x+=(a.y-b.y)*(a.z+b.z);n.y+=(a.z-b.z)*(a.x+b.x);n.z+=(a.x-b.x)*(a.y+b.y);}n.normalize();
 const rm=v[0].clone().add(v[N-1]).multiplyScalar(.5);let dm=0;for(const p of v)dm=Math.max(dm,p.distanceTo(rm));
 const th=v.map((p,i)=>i===0||i===N-1?thR:lerp(thR,thT,Math.pow(p.distanceTo(rm)/dm,.8)));
 const T=v.map((p,i)=>p.clone().addScaledVector(n,th[i]/2)),B=v.map((p,i)=>p.clone().addScaledVector(n,-th[i]/2));
 const P=[],U=[],Cc=[],put=q=>{P.push(q.x,q.y,q.z);U.push(...uvF(q));Cc.push(1,1,1);};
 for(let k=1;k<N-1;k++){put(T[0]);put(T[k]);put(T[k+1]);put(B[0]);put(B[k+1]);put(B[k]);}
 for(let i=0;i<N-1;i++){put(T[i]);put(B[i]);put(T[i+1]);put(T[i+1]);put(B[i]);put(B[i+1]);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',F(P,3));g.setAttribute('uv',F(U,2));g.setAttribute('color',F(Cc,3));g.computeVertexNormals();return g;}
gWhale=function(){const L=9,seg=72,rad=44,P=[],U=[],Cc=[],I=[];
 const pf=keyProf([[0,0,0,-.08],[.006,.3,.72,-.06],[.03,.43,.93,-.03],[.09,.55,1.03,0],[.2,.7,1.07,.05],[.34,.8,1.0,.1],[.48,.74,.84,.12],[.62,.55,.6,.1],[.76,.34,.36,.08],[.88,.2,.2,.06],[.96,.14,.14,.08],[1,.1,.06,.1]]);
 for(let i=0;i<=seg;i++){const t=Math.pow(i/seg,1.12),[hh,ww,yo]=pf(t),x=L/2-t*L;
  const rr=sstep(clamp((t-.08)/.12,0,1))*(1-sstep(clamp((t-.78)/.14,0,1))),kr=Math.exp(-Math.pow((t-.9)/.06,2));
  for(let j=0;j<=rad;j++){const a=j/rad*Math.PI*2,s=a<=Math.PI?a:a-Math.PI*2,as=Math.abs(s);let m=1;
   for(const ai of[.48,.95,1.4])m+=.055*rr*Math.exp(-Math.pow((as-ai)/.075,2));m+=.035*rr*Math.exp(-Math.pow(s/.07,2))+.28*kr*Math.exp(-Math.pow((as-Math.PI/2)/.12,2));
   let y=hh*Math.cos(a)*m;if(y<0&&t<.25)y*=.8+.2*sstep(t/.25);P.push(x,y+yo,ww*Math.sin(a)*m);U.push(t,j/rad);Cc.push(1,1,1);}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;I.push(a,b,a+1,b,b+1,a+1);}
 const body=new THREE.BufferGeometry();body.setAttribute('position',F(P,3));body.setAttribute('uv',F(U,2));body.setAttribute('color',F(Cc,3));body.setIndex(I);body.computeVertexNormals();
 const fuv=q=>[clamp((L/2-q.x)/L,.25,.93),.06+((Math.abs(q.y)*.09+Math.abs(q.z)*.11)%.24)];
 const parts=[body.toNonIndexed(),
  tFin([[.6,.78,0],[.05,1.55,0],[-.35,2.0,0],[-.6,2.0,0],[-.62,1.6,0],[-.7,1.1,0],[-.85,.72,0]],.14,.03,fuv),
  tFin([[-1.95,.44,0],[-2.3,.85,0],[-2.45,.86,0],[-2.45,.62,0],[-2.55,.4,0]],.08,.02,fuv),
  tFin([[-2.05,-.26,0],[-2.4,-.62,0],[-2.52,-.62,0],[-2.55,-.42,0],[-2.62,-.24,0]],.07,.02,fuv),
  tFin([[-4.15,.12,0],[-4.4,.35,0],[-4.95,1.15,0],[-5.55,1.95,0],[-6.0,2.5,0],[-5.85,1.9,0],[-5.45,.75,0],[-5.15,.05,0],[-5.45,-.65,0],[-5.8,-1.25,0],[-5.4,-1.0,0],[-4.75,-.45,0],[-4.3,-.1,0]],.12,.03,fuv)];
 for(const s of[1,-1]){parts.push(tFin([[2.75,-.3,.86*s],[2.2,-.55,1.6*s],[1.55,-.85,2.6*s],[1.1,-1.0,3.05*s],[.85,-.98,2.95*s],[.95,-.75,2.3*s],[1.4,-.5,1.4*s],[1.75,-.36,.9*s]],.15,.035,fuv),
  tFin([[-.7,-.42,.3*s],[-1.05,-.7,.55*s],[-1.25,-.68,.62*s],[-1.2,-.5,.4*s],[-1.25,-.4,.3*s]],.07,.02,fuv));}
 const uv0=[.5,.5];parts.push(prim(new THREE.SphereGeometry(1,28,10).scale(.07,.075,.64).translate(4.46,-.14,0),C(0x3a1418),uv0),prim(new THREE.SphereGeometry(1,28,6).scale(.075,.013,.6).translate(4.465,-.085,0),C(0xe8dcc4),uv0),
  prim(new THREE.SphereGeometry(1,28,6).scale(.07,.013,.56).translate(4.46,-.2,0),C(0xe8dcc4),uv0),...eyes(4.02,.02,.97,.05,C(0x14161a),uv0));
 return merge(parts);};

/* ---------- 基因 ---------- */
const MORPH={n:{n:'原色',ic:'',mul:1},alb:{n:'白化',ic:'🤍',pre:'白化',tint:[1,.92,.85],em:[.34,.27,.22],mul:3},mel:{n:'黑化',ic:'🖤',pre:'黑化',tint:[.3,.3,.34],mul:2.5},
 xan:{n:'黃金',ic:'💛',pre:'黃金',tint:[1,.8,.26],em:[.12,.08,0],mul:3},ery:{n:'紅化',ic:'❤️',pre:'紅化',tint:[1,.42,.36],em:[.06,0,0],mul:3},cya:{n:'藍化',ic:'💙',pre:'藍化',tint:[.45,.75,1],em:[0,.04,.12],mul:3.5},
 glo:{n:'螢光',ic:'✨',pre:'螢光',tint:[.7,1,.85],em:[.05,.5,.35],mul:8}};
const COLM=['alb','mel','xan','ery','cya'];
const szCap=k=>SP[k].max?1.3:(SP[k].hab==='ocean'&&(PRICE[k]||0)>=8000)?1.5:2.0;
const geneMul=g=>(MORPH[g.m]||MORPH.n).mul*clamp(1+(g.sz-1)*2.5,.6,2.2);
const gTag=e=>{const g=e&&e.g;if(!g)return'';const a=[];if(g.m&&g.m!=='n')a.push(MORPH[g.m].ic+MORPH[g.m].n);if(Math.abs(g.sz-1)>.04)a.push(`${g.sz>1?'巨型':'迷你'} ${g.sz.toFixed(2)}×`);return a.join('・');};
let whVal=it=>Math.round((PRICE[it.sp]||100)*(it.baby?.6:.8)*(it.g?geneMul(it.g):1));
function ensureGenes(e){if(!e.g)e.g={sz:+rnd(.85,1.15).toFixed(3),m:'n'};return e.g;}
function inherit(F,M,k){const a=F.g||{sz:1,m:'n'},b=M.g||{sz:1,m:'n'};let m='n',mut=false;const r=Math.random();
 if(a.m===b.m)m=a.m==='n'?'n':(r<.75?a.m:'n');else if(a.m!=='n'&&b.m!=='n')m=r<.4?a.m:r<.8?b.m:'n';else m=r<.35?(a.m!=='n'?a.m:b.m):'n';
 if(Math.random()<.03){m=COLM[Math.random()*COLM.length|0];mut=true;}
 return{g:{sz:+clamp((a.sz+b.sz)/2*rnd(.9,1.15),.55,szCap(k)).toFixed(3),m},mut};}
function predict(a,b){const A=a.m,B=b.m;if(A===B)return A==='n'?'原色 97%・自然突變 3%':`${MORPH[A].n} 75%・原色 25%`;if(A!=='n'&&B!=='n')return`${MORPH[A].n} 40%・${MORPH[B].n} 40%・原色 20%`;const X=A!=='n'?A:B;return`${MORPH[X].n} 35%・原色 65%`;}
const GLO=new Set();
function applyGenes(c){if(!c||!c.root||!c.entry||!c.entry.g||(typeof School!=='undefined'&&c instanceof School))return;const M=MORPH[c.entry.g.m]||MORPH.n;if(M===MORPH.n)return;
 c.root.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material)||!o.material.color)return;if(!o.userData.own){const m=o.material,m2=m.clone();m2.onBeforeCompile=m.onBeforeCompile;if(m.customProgramCacheKey)m2.customProgramCacheKey=m.customProgramCacheKey;m2.userData=m.userData;o.material=m2;o.userData.own=1;}
  const mt=o.material;mt.color.setRGB(...M.tint);if(mt.emissive&&M.em)mt.emissive.setRGB(...M.em);});if(c.entry.g.m==='glo')GLO.add(c);}
const _as1=applySize;applySize=function(c){_as1(c);if(c.root&&c.entry&&c.entry.g&&!(typeof School!=='undefined'&&c instanceof School))c.root.scale.multiplyScalar(c.entry.g.sz);};
const _sa1=spawnAnimal;spawnAnimal=function(tk,e){if(!SP[e.sp].school)ensureGenes(e);const c=_sa1(tk,e);if(c){applySize(c);applyGenes(c);}return c;};
newAnimal=function(tk,k,o={}){const p=SP[k];const n=tk.st.animals.filter(e=>e.sp===k).length+1;
 const e={id:S.nid++,sp:k,name:o.name||`${p.n.replace(/（群）/,'')}${n>1?' '+n:''}`,hunger:80,mood:80,bond:0,size:p.school?1:(o.size??.85),born:Date.now()};
 if(!p.school){e.sex=o.sex||(Math.random()<.5?'♀':'♂');e.g=o.g?{...o.g}:{sz:+rnd(.85,1.15).toFixed(3),m:'n'};}tk.st.animals.push(e);spawnAnimal(tk,e);refreshChips();return e;};
function respawn(tk,e){const cr=tk.creatures.find(k=>k.entry===e);if(cr){GLO.delete(cr);cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}spawnAnimal(tk,e);}
function findA(id){for(const sid in TANKS){const tk=TANKS[sid],e=tk.st.animals.find(a=>a.id===id);if(e)return{tk,e};}return null;}
const tName=tk=>tk.st.name||HT[tk.st.type].n;
const babyName=(k,g)=>`${g&&g.m!=='n'?MORPH[g.m].pre+' ':''}${SP[k].n.replace(/（群）/,'')}寶寶`;

/* ---------- 全面繁殖 ---------- */
const BR={guppy:{m:'live',n:[2,4],p:.3},seahorse:{m:'live',n:[2,3],p:.15},motoro:{m:'live',n:[1,2],p:.08},shark:{m:'live',n:[1,2],p:.04},manta:{m:'live',n:[1,1],p:.02},
 gecko:{m:'egg',n:[2,2],p:.2},beardie:{m:'egg',n:[2,3],p:.15},crested:{m:'egg',n:[2,2],p:.18},cham:{m:'egg',n:[2,3],p:.12},python:{m:'egg',n:[2,3],p:.08},tortoise:{m:'egg',n:[2,3],p:.06},ltort:{m:'egg',n:[2,3],p:.06},pturtle:{m:'egg',n:[2,3],p:.1},turtle:{m:'egg',n:[2,3],p:.04},
 clown:{m:'spawn',n:[2,3],p:.18},btang:{m:'spawn',n:[1,2],p:.06},ytang:{m:'spawn',n:[1,2],p:.06},angel:{m:'spawn',n:[2,3],p:.15},discus:{m:'spawn',n:[2,3],p:.12},koi:{m:'spawn',n:[2,3],p:.1},
 arowana:{m:'spawn',n:[1,2],p:.05},arapaima:{m:'spawn',n:[1,2],p:.03},rtc:{m:'spawn',n:[1,2],p:.04},grouper:{m:'spawn',n:[1,2],p:.04},horned:{m:'spawn',n:[2,3],p:.12},dart:{m:'spawn',n:[2,3],p:.12},
 moon:{m:'bud',n:[1,2],p:.15},nettle:{m:'bud',n:[1,2],p:.1}};
const BRM={live:'🍼 胎生，直接生在缸裡',egg:'🥚 下蛋，送到 2F 孵化器',spawn:'🫧 產卵，約 3 分鐘後在缸內孵化',bud:'🧫 無性分裂，一隻就能繁殖'};
const REPT=new Set(['gecko','beardie','crested','cham','python','tortoise','ltort','pturtle','turtle']);
const rint=([a,b])=>a+(Math.random()*(b-a+1)|0);
function toWh(k,g,sex,why){S.wh.push({sp:k,g,sex,baby:1,name:babyName(k,g)});if(why)toast(why,4000);}
function deliverBabies(tk,k,gs,why){let placed=0,whn=0;for(const g of gs){if(tk&&used(tk)+SP[k].cost<=SZ[tk.sz].cap&&spOK(k,tk)){newAnimal(tk,k,{size:.3,g,name:babyName(k,g)});placed++;}else{toWh(k,g,Math.random()<.5?'♀':'♂');whn++;}}
 if(tk)logEv(tk.st,`${SP[k].n}${why}：${placed} 隻在缸內${whn?`、${whn} 隻送到倉庫`:''}`);return{placed,whn};}
function hatchEgg(eg){const k=eg.sp||'gecko',g=eg.g||{sz:+rnd(.85,1.15).toFixed(3),m:'n'};const sex=REPT.has(k)?(Math.random()<femaleP(S.incT)?'♀':'♂'):(Math.random()<.5?'♀':'♂');
 let tk=TANKS[eg.from];if(!tk||!spOK(k,tk)||used(tk)+SP[k].cost>SZ[tk.sz].cap)tk=Object.values(TANKS).find(x=>spOK(k,x)&&used(x)+SP[k].cost<=SZ[x.sz].cap);
 if(tk){newAnimal(tk,k,{size:.35,g,sex,name:babyName(k,g)});logEv(tk.st,`孵化器孵出 ${sex} ${babyName(k,g)}`);toast(`🐣 孵出 ${sex} ${babyName(k,g)}${gTag({g})?'（'+gTag({g})+'）':''}，送到「${tName(tk)}」`,4200);}
 else toWh(k,g,sex,`🐣 ${babyName(k,g)} 孵化了，沒有空缸，先放在 📦 倉庫`);}
checkBreed=function(tk){ensureStock();ensureEco();const st=tk.st,cap=SZ[tk.sz].cap,now=Date.now();st.brT=st.brT||{};
 for(const k of[...new Set(st.animals.map(e=>e.sp))]){const b=BR[k];if(!b||SP[k].school||now-(st.brT[k]||0)<240e3)continue;const all=st.animals.filter(e=>e.sp===k),ad=all.filter(e=>e.size>=.9);let F,M;
  if(b.m==='bud'){if(!ad.length)continue;F=M=ad[Math.random()*ad.length|0];}else{const fs=ad.filter(e=>e.sex==='♀'),ms=ad.filter(e=>e.sex==='♂');if(!fs.length||!ms.length)continue;F=fs[Math.random()*fs.length|0];M=ms[Math.random()*ms.length|0];}
  if(all.reduce((a,e)=>a+e.mood,0)/all.length<70||all.reduce((a,e)=>a+e.hunger,0)/all.length<45||Math.random()>b.p)continue;
  let n=rint(b.n);if(b.m!=='egg'){n=Math.min(n,Math.floor((cap-used(tk))/SP[k].cost));if(n<=0)continue;}else if(S.inc.length>=16)continue;
  st.brT[k]=now;const gs=[];let mut=false;for(let i=0;i<n;i++){const r=inherit(F,M,k);gs.push(r.g);mut=mut||r.mut;}const nm=SP[k].n.replace(/（群）/,'');
  if(b.m==='live'||b.m==='bud'){for(const g of gs)newAnimal(tk,k,{size:.3,g,name:babyName(k,g)});logEv(st,`${nm}${b.m==='bud'?'分裂出':'生了'} ${n} 隻寶寶`);toast(`🎉 「${tName(tk)}」的${nm}${b.m==='bud'?'分裂出':'生了'} ${n} 隻寶寶！${mut?'其中有自然突變！':''}`,3800);}
  else if(b.m==='egg'){for(const g of gs)S.inc.push({sp:k,from:tk.slot.id,prog:0,g});logEv(st,`${nm}下了 ${n} 顆蛋，已送到 2F 孵化器`);toast(`🥚 ${nm}下了 ${n} 顆蛋！已送到 2F 孵化器${mut?'（有突變蛋！）':''}`,4000);drawInc();}
  else{const eg={sp:k,hatch:now+180e3,g:gs};st.eggs.push(eg);if(tk.tfood)addEggMesh(tk,eg);logEv(st,`${nm}產卵了，約 3 分鐘後孵化`);toast(`🫧 「${tName(tk)}」的${nm}產卵了！約 3 分鐘後孵化`,3800);}}
 for(let i=st.eggs.length-1;i>=0;i--){const eg=st.eggs[i];if(now<eg.hatch)continue;if(eg._m)tk.group.remove(eg._m);st.eggs.splice(i,1);const gs=eg.g||[ensureGenes({})];
  const r=deliverBabies(tk,eg.sp,gs,'的卵孵化了');toast(`🐣 ${SP[eg.sp].n.replace(/（群）/,'')}的卵孵化了！${r.whn?`（${r.whn} 隻缸滿了，放到倉庫）`:''}`,3800);}
 markDirty();};

/* ---------- 實驗室升級 ---------- */
UPG.lab={n:'🧬 基因實驗室',d:'基因編輯成功率、配對速度；Lv.3 解鎖螢光基因',lv:[1,2,3],cost:[0,8000,25000],fmt:v=>['成功率 60–70%・配對 3 分鐘','成功率 75–85%・配對 2 分鐘','成功率 90–95%・配對 1 分鐘・螢光'][v-1]};
const labLv=()=>(S.up&&S.up.lab)||1;
function ensureLab(){ensureEco();S.pairs=S.pairs||[];}

/* ---------- 基因實驗桌（2F 中央） ---------- */
const steel=new THREE.MeshStandardMaterial({color:C(0xb8c0c6),metalness:.8,roughness:.3});
let dnaBoost=0;const dna=new THREE.Group();dna.position.set(0,7.05,8);scene.add(dna);
(function(){const cA=new THREE.MeshBasicMaterial({color:C(0x5ff0ff)}),cB=new THREE.MeshBasicMaterial({color:C(0xff6ad5)}),rg=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55});
 for(let i=0;i<34;i++){const th=i/34*Math.PI*4,y=-.62+i/33*1.24,a=V(Math.cos(th)*.26,y,Math.sin(th)*.26),b=V(-a.x,y,-a.z);add(new THREE.SphereGeometry(.04,10,8),cA,a.x,a.y,a.z,dna);add(new THREE.SphereGeometry(.04,10,8),cB,b.x,b.y,b.z,dna);
  if(i%2===0)add(cylBetween(a,b,.011,.011,6),rg,0,0,0,dna);}
 add(new THREE.CylinderGeometry(.38,.42,.1,28),new THREE.MeshStandardMaterial({color:C(0x1a2128),metalness:.7,roughness:.3}),0,6.01,8);
 const ring=add(new THREE.TorusGeometry(.34,.015,8,40),new THREE.MeshBasicMaterial({color:C(0x5ff0ff)}),0,6.07,8);ring.rotation.x=Math.PI/2;glow(0,6.3,8,1.6,0x5ff0ff,.45);
 const sq=new THREE.Group();sq.position.set(-2.3,6.12,8);scene.add(sq);box(.72,.34,.52,new THREE.MeshStandardMaterial({color:C(0xeef1f3),roughness:.35}),0,0,0,sq);
 const scr=new THREE.MeshBasicMaterial({map:vText([['GENE SEQ',30,.4],['▮▮▯▮▮▮▯▮',26,.75,'#5ff0ff']],256,128,'#071218','#9fe8ff')});for(const s of[1,-1]){const p=add(new THREE.PlaneGeometry(.5,.24),scr,0,.02,s*.265,sq);if(s<0)p.rotation.y=Math.PI;}
 const sgm=new THREE.MeshBasicMaterial({map:vText([['🧬 基因實驗桌',54,.45],['GENE LAB・點我編輯基因',24,.83,'#9fe8ff']],620,140,'#0b1a24','#f4efe2')});
 for(const s of[1,-1]){const p=add(new THREE.PlaneGeometry(2.6,.58),sgm,0,8.15,8+s*.02);if(s<0)p.rotation.y=Math.PI;}
 /* 繁殖區 */
 const bx=-6.7,bz=8,top=new THREE.MeshStandardMaterial({color:C(0xd9dee2),roughness:.35,metalness:.5});box(3.3,.08,1.6,top,bx,5.92,bz);for(const [x,z] of[[-1.55,-.7],[1.55,-.7],[-1.55,.7],[1.55,.7]])box(.08,.9,.08,steel,bx+x,5.45,bz+z);box(3.1,.04,1.4,steel,bx,5.35,bz);
 const water=new THREE.MeshPhysicalMaterial({color:C(0x6fc8ff),transparent:true,opacity:.35,roughness:.05}),sand=new THREE.MeshStandardMaterial({color:C(0xd8b98a),roughness:1}),gl=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.18,roughness:.02});
 [-1.2,-.4,.4,1.2].forEach((dx,i)=>{const x=bx+dx;box(.62,.44,.52,gl,x,6.18,bz);if(i<2){box(.58,.32,.48,water,x,6.13,bz);for(let k=0;k<4;k++)add(new THREE.SphereGeometry(.018,8,6).scale(1.8,1,1),new THREE.MeshStandardMaterial({color:C([0xff8a3a,0x3a9aff][i])}),x+rnd(-.2,.2),6.08+rnd(0,.15),bz+rnd(-.15,.15));}
  else{box(.58,.08,.48,sand,x,6.0,bz);add(new THREE.SphereGeometry(.05,10,8).scale(1.4,.6,.8),new THREE.MeshStandardMaterial({color:C(0xd8a24a)}),x,6.07,bz);glow(x,6.6,bz,.9,0xff7a40,.5);}});
 const hm=new THREE.MeshBasicMaterial({map:vText([['💞 繁殖區',54,.45],['BREEDING・配對＆產房',24,.83,'#ffc0de']],620,140,'#24101a','#fff0f6')});for(const s of[1,-1]){const p=add(new THREE.PlaneGeometry(2.6,.58),hm,bx,8.05,bz+s*.02);if(s<0)p.rotation.y=Math.PI;}glow(bx,7.2,bz,2.2,0xff6aa8,.3);
 OBST2.push([bx-1.75,bx+1.75,bz-.9,bz+.9]);
 FAC.push({n:'🧬 基因實驗桌',d:'編輯動物體色、體型・查看基因',p:[0,8],fn:()=>geneSheet('edit'),b:'基因編輯'},{n:'💞 繁殖區',d:'挑一公一母配對，寶寶帶著爸媽的基因',p:[bx,bz],fn:()=>geneSheet('pair'),b:'配對繁殖'});
 STATIONS.push({p:V(0,7.05,8),fn:()=>geneSheet('edit')},{p:V(bx,6.3,bz),fn:()=>geneSheet('pair')});
 SPOTS.push(['🧬 基因實驗室',()=>Object.assign(player,{x:-3.3,y:5,z:11,yaw:.35,pitch:-.12})]);})();
function atLab(fn){if(lvl()===1&&Math.hypot(player.x+3.3,player.z-8)<7){fn();return;}Object.assign(player,{x:-3.3,y:5,z:11,yaw:.35,pitch:-.12});toast('🧬 已帶你到 2F 基因實驗室',1800);setTimeout(fn,250);}

/* ---------- 基因／繁殖介面 ---------- */
let PS={sp:null,f:null,m:null};
function adults(k){const busy=new Set((S.pairs||[]).flatMap(p=>[p.f,p.m]));const o=[];for(const id in TANKS){const tk=TANKS[id];for(const e of tk.st.animals)if(e.sp===k&&e.size>=.9&&!busy.has(e.id))o.push({tk,e});}return o;}
function geneSheet(tab='edit'){ensureLab();const lv=labLv();
 const tabs=`<div style="display:flex;gap:6px;margin-bottom:8px">${[['edit','🧬 基因編輯'],['pair','💞 配對繁殖'],['info','📖 繁殖圖鑑']].map(([k,n])=>`<button class="chip ${tab===k?'on':''}" data-t="${k}">${n}</button>`).join('')}</div><div class="mut sm" style="margin-bottom:6px">實驗室 Lv.${lv}・持有 ${fmt$(S.money)}${lv<3?'・<a href="#" id="gUp" style="color:var(--acc)">升級實驗室</a>':''}</div>`;
 let body='';
 if(tab==='edit'){const rows=[];for(const id in TANKS){const tk=TANKS[id],L=tk.st.animals.filter(e=>!SP[e.sp].school);if(!L.length)continue;rows.push(`<h4>${esc(tName(tk))}</h4>`+L.map(e=>`<div class="row2"><span>${esc(e.name)} <span class="mut sm">${e.sex||''} ${gTag(e)||'原色'}</span></span><button class="btn sm" data-e="${e.id}">編輯</button></div>`).join(''));}
  body=rows.join('')||'<div class="mut sm">還沒有可以編輯的動物（魚群不能個別編輯）。</div>';}
 else if(tab==='pair'){const prs=S.pairs.map(p=>`<div class="row2"><span>💞 ${esc(p.fn)} × ${esc(p.mn)}</span><span class="mut sm">${Math.max(0,Math.ceil((p.end-Date.now())/1000))} 秒</span></div>`).join('');
  if(PS.sp){const L=adults(PS.sp),fs=L.filter(a=>a.e.sex==='♀'),ms=L.filter(a=>a.e.sex==='♂');const fA=fs.find(a=>a.e.id===PS.f),mA=ms.find(a=>a.e.id===PS.m);
   const pick=(arr,key,cur)=>arr.map(a=>`<button class="opt ${cur===a.e.id?'on':''}" data-${key}="${a.e.id}" style="${cur===a.e.id?'outline:2px solid var(--acc)':''}"><b>${esc(a.e.name)}</b><span class="mut">${gTag(a.e)||'原色'}・${esc(tName(a.tk))}</span></button>`).join('')||'<div class="mut sm">沒有</div>';
   body=`<button class="chip" id="pBack">← 換物種</button><h4>${SP[PS.sp].n}・${BRM[BR[PS.sp].m]}</h4><h4>♀ 母</h4>${pick(fs,'f',PS.f)}<h4>♂ 公</h4>${pick(ms,'m',PS.m)}
    ${fA&&mA?`<div class="res"><div><b>預測後代</b></div><div class="sm">${predict(fA.e.g||{m:'n'},mA.e.g||{m:'n'})}</div><div class="mut sm">體型約 ${(((fA.e.g?.sz||1)+(mA.e.g?.sz||1))/2).toFixed(2)}×・${BR[PS.sp].n.join('–')} 隻・${[180,120,60][lv-1]} 秒</div><span></span></div><button class="btn feed" id="pGo" style="width:100%;margin-top:6px">開始配對</button>`:'<div class="mut sm" style="margin-top:6px">各選一隻公、一隻母。</div>'}`;}
  else{const cand=Object.keys(BR).filter(k=>BR[k].m!=='bud').map(k=>{const L=adults(k);return{k,f:L.filter(a=>a.e.sex==='♀').length,m:L.filter(a=>a.e.sex==='♂').length};}).filter(c=>c.f+c.m>0);
   body=(prs?'<h4>配對中</h4>'+prs:'')+'<h4>選擇物種（要有成年的一公一母）</h4>'+(cand.map(c=>`<div class="row2"><span>${SP[c.k].n} <span class="mut sm">♀${c.f} ♂${c.m}</span></span><button class="btn sm ${c.f&&c.m?'':'dis'}" data-s="${c.k}">${c.f&&c.m?'配對':'缺'+(c.f?'公':'母')}</button></div>`).join('')||'<div class="mut sm">還沒有成年動物。去 🛒 商店買幾隻吧（成年＝成體）。</div>')+
    '<div class="mut sm" style="margin-top:8px">配對後寶寶會帶著爸媽的體色和體型基因：卵生的送孵化器，其他的送到 📦 倉庫。缸裡一公一母、心情好也會自己繁殖。</div>';}}
 else body=`<div class="mut sm">缸裡有成年的一公一母、心情 70 以上、吃得飽、空間夠，就有機會自己繁殖。也可以來繁殖區手動配對。後代會遺傳體色（同色雙親 75%）和體型，偶爾還會自然突變。</div>`+
  Object.entries(BRM).map(([m,t])=>`<h4>${t}</h4><div class="sm">${Object.keys(BR).filter(k=>BR[k].m===m).map(k=>SP[k].n).join('、')}</div>`).join('')+'<h4>🚫 無法繁殖</h4><div class="sm">鯨鯊（全館只能有一隻）、所有魚群</div>';
 sheet('🧬 基因實驗室',tabs+body,c=>{c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{PS={sp:null,f:null,m:null};geneSheet(b.dataset.t);});const up=c.querySelector('#gUp');if(up)up.onclick=ev=>{ev.preventDefault();shopSheet('up');};
  c.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const r=findA(+b.dataset.e);if(r)editSheet(r.tk,r.e);});
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{if(b.classList.contains('dis'))return;PS={sp:b.dataset.s,f:null,m:null};geneSheet('pair');});
  c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{PS.f=+b.dataset.f;geneSheet('pair');});c.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{PS.m=+b.dataset.m;geneSheet('pair');});
  const bk=c.querySelector('#pBack');if(bk)bk.onclick=()=>{PS={sp:null,f:null,m:null};geneSheet('pair');};
  const go=c.querySelector('#pGo');if(go)go.onclick=()=>{const F=findA(PS.f),M=findA(PS.m);if(!F||!M)return;const d=[180,120,60][labLv()-1];
   S.pairs.push({sp:PS.sp,f:F.e.id,m:M.e.id,fn:F.e.name,mn:M.e.name,gf:{...ensureGenes(F.e)},gm:{...ensureGenes(M.e)},from:F.tk.slot.id,end:Date.now()+d*1000});markDirty();dnaBoost=2;
   toast(`💞 ${F.e.name} × ${M.e.name} 開始配對，約 ${d} 秒`,3000);PS={sp:null,f:null,m:null};geneSheet('pair');};});}
function editSheet(tk,e){ensureLab();const g=ensureGenes(e),lv=labLv(),P=PRICE[e.sp]||100,cap=szCap(e.sp);
 const cc=Math.round(1500+P*.4),gc=Math.round(6000+P*.6),sc=Math.round(800+P*.25*(1+Math.max(0,g.sz-1)*4)),cs=[.6,.75,.9][lv-1],ss=[.7,.85,.95][lv-1];
 const opts=COLM.filter(m=>m!==g.m).map(m=>({k:'c:'+m,t:`${MORPH[m].ic} 改成${MORPH[m].n}`,c:cc,p:cs}));
 if(g.m!=='glo')opts.push({k:'c:glo',t:'✨ 螢光基因（會發光）',c:gc,p:lv>=3?.6:0,lock:lv<3});
 if(g.sz<cap-.01)opts.push({k:'s:+',t:`📏 體型 +25%（${g.sz.toFixed(2)} → ${Math.min(cap,g.sz+.25).toFixed(2)}）`,c:sc,p:ss});
 if(g.sz>.6)opts.push({k:'s:-',t:`📏 體型 −25%（${g.sz.toFixed(2)} → ${Math.max(.55,g.sz-.25).toFixed(2)}）`,c:Math.round(sc*.6),p:ss});
 if(g.m!=='n')opts.push({k:'c:n',t:'↺ 還原原色',c:300,p:1});
 sheet(`🧬 ${e.name}`,`<div class="res"><div><b>${SP[e.sp].n}</b> <span class="mut">${e.sex||''}</span></div><div class="sm">體色：${MORPH[g.m].ic}${MORPH[g.m].n}・體型基因：${g.sz.toFixed(2)}×</div><div class="mut sm">身價 ×${geneMul(g).toFixed(1)}（賣出／轉賣價會跟著變）</div><span></span></div><div class="mut" style="margin:6px 0">持有 ${fmt$(S.money)}・失敗會扣錢但動物不受影響</div>`+
  opts.map((o,i)=>`<button class="opt ${o.lock?'dis':''}" data-o="${i}"><b>${o.t}</b><span class="mut">${o.lock?'需要實驗室 Lv.3':`${fmt$(o.c)}・成功率 ${Math.round(o.p*100)}%`}</span></button>`).join('')+'<button class="chip" id="eBack" style="margin-top:8px">← 回到列表</button>',
  c=>{c.querySelector('#eBack').onclick=()=>geneSheet('edit');c.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.o];if(o.lock){toast('螢光基因要先把基因實驗室升到 Lv.3',3000);return;}
   if(!pay(o.c,'這次基因編輯'))return;dnaBoost=2.5;if(Math.random()>o.p){toast('🧬 編輯失敗……DNA 沒有成功嵌入，再試一次吧',3200);editSheet(tk,e);return;}
   const[t,v]=o.k.split(':');if(t==='c')g.m=v;else g.sz=+clamp(g.sz+(v==='+'?.25:-.25),.55,cap).toFixed(3);markDirty();respawn(tk,e);logEv(tk.st,`${e.name} 基因編輯：${gTag(e)||'原色'}`);
   toast(`🧬 編輯成功！${e.name} 現在是 ${gTag(e)||'原色'}`,3200);if(sel&&sel.entry===e){$('#pick').style.display='none';sel=null;}editSheet(tk,e);});});}

/* ---------- 迴圈：配對完成、DNA 旋轉、螢光呼吸 ---------- */
let prAcc=0;globalAnims.push((t,dt)=>{dna.rotation.y+=dt*(.6+dnaBoost*2.5);dnaBoost=Math.max(0,dnaBoost-dt);const s=1+Math.min(dnaBoost,1)*.15;dna.scale.set(s,s,s);
 for(const c of GLO){if(!c.root||!c.root.parent){GLO.delete(c);continue;}const k=1+.7*Math.sin(t*2.2+c.entry.id);c.root.traverse(o=>{if(o.isMesh&&o.material&&o.material.emissive)o.material.emissiveIntensity=k;});}
 if(!loaded)return;prAcc+=dt;if(prAcc<1)return;prAcc=0;ensureLab();const now=Date.now();
 for(let i=S.pairs.length-1;i>=0;i--){const p=S.pairs[i];if(now<p.end)continue;S.pairs.splice(i,1);const b=BR[p.sp],n=rint(b.n),gs=[];let mut=false;
  for(let j=0;j<n;j++){const r=inherit({g:p.gf},{g:p.gm},p.sp);gs.push(r.g);mut=mut||r.mut;}const nm=SP[p.sp].n.replace(/（群）/,'');
  if(b.m==='egg'){for(const g of gs)S.inc.push({sp:p.sp,from:p.from,prog:0,g});drawInc();toast(`💞 配對成功！${nm}下了 ${n} 顆蛋，已放進孵化器${mut?'（有突變！）':''}`,4200);}
  else{for(const g of gs)toWh(p.sp,g,Math.random()<.5?'♀':'♂');toast(`💞 配對成功！${n} 隻${nm}寶寶送到 📦 倉庫${mut?'（有突變！）':''}：${gs.map(g=>gTag({g})||'原色').join('、')}`,4600);}
  markDirty();}});

/* ---------- 動物卡片：基因資訊＋基因按鈕 ---------- */
(function(){const z=$('#pZ');const s=document.createElement('div');s.id='pG';s.className='sz';s.style.color='var(--acc)';z.after(s);
 const b=document.createElement('button');b.className='btn';b.id='pGene';b.textContent='🧬';b.title='基因';$('#pSell').after(b);
 b.onclick=()=>{if(!sel)return;const tk=sel.tk,e=sel.entry;if(SP[e.sp].school){toast('魚群不能個別編輯基因');return;}atLab(()=>editSheet(tk,e));};})();
const _up9=updPick;updPick=function(){_up9();if(!sel)return;const e=sel.entry;$('#pG').textContent=SP[e.sp].school?'':`🧬 ${gTag(e)||'原色'}${BR[e.sp]?'':'・不可繁殖'}`;};
const _rc9=refreshChips;refreshChips=function(){_rc9();const ch=$('#chips'),b=document.createElement('button');b.className='chip';b.textContent='🧬 基因';b.onclick=()=>atLab(()=>geneSheet('edit'));ch.insertBefore(b,ch.children[2]||null);};
