/* ===== j.js：鳥類館（可走入的網頂鳥園）＋鳥類模型與行為 ===== */
const AVC=V(-28.4,0,70),AVR=7.4;
/* ---------- 物種 ---------- */
Object.assign(SP,{
 macaw:{n:'緋紅金剛鸚鵡',s:'Ara macao',z:'全長 85 cm・翼展 1 m',f:'紅、黃、藍三色的大型鸚鵡，嘴巴強壯到能咬開堅果，能活 50 年以上。',hab:'aviary',cost:4,hr:.03,tr:[20,34],hu:[40,95]},
 bgmacaw:{n:'藍黃金剛鸚鵡',s:'Ara ararauna',z:'全長 85 cm・翼展 1.1 m',f:'背藍腹黃，臉上有黑色細紋，每一隻的紋路都不一樣，像指紋。',hab:'aviary',cost:4,hr:.03,tr:[20,34],hu:[40,95]},
 toucan:{n:'托哥巨嘴鳥',s:'Ramphastos toco',z:'全長 60 cm（嘴長 19 cm）',f:'嘴巴看起來很重，其實裡面是蜂巢狀的中空結構，還能幫忙散熱。',hab:'aviary',cost:3,hr:.035,tr:[20,34],hu:[40,95]},
 flamingo:{n:'美洲紅鶴',s:'Phoenicopterus ruber',z:'站高 1.2 m',f:'粉紅色來自食物裡的類胡蘿蔔素。常用單腳站立來節省體力。',hab:'aviary',cost:5,hr:.03,tr:[18,34],hu:[30,95]},
 peacock:{n:'藍孔雀',s:'Pavo cristatus',z:'全長 1 m（公鳥尾屏 1.5 m）',f:'公鳥會把尾屏整片豎起來開屏求偶；母鳥是低調的褐色。',hab:'aviary',cost:5,hr:.03,tr:[12,36],hu:[30,95]},
 budgie:{n:'虎皮鸚鵡（群）',s:'Melopsittacus undulatus',z:'全長 18 cm',f:'來自澳洲的小型鸚鵡，總是成群飛行、吱吱喳喳。',hab:'aviary',cost:6,hr:.04,school:true,tr:[18,34],hu:[30,90]}});
HT.aviary={n:'熱帶鳥園',sz:['AV'],d:'網頂鳥園：棲木樹、餵食台、淺水池'};
SZ.AV={w:14,d:14,cap:40,n:'鳥園'};ENVDEF.aviary={t:27,h:70,hb:65};
Object.assign(BUILD_COST,{AV:12000});for(const [k,l] of[['macaw',.85],['bgmacaw',.85],['toucan',.6],['flamingo',1.2],['peacock',1],['budgie',.18]])SP[k].len=l;
Object.assign(PRICE,{macaw:3000,bgmacaw:2800,toucan:2500,flamingo:3500,peacock:2000,budgie:600});
Object.assign(BR,{macaw:{m:'egg',n:[1,2],p:.08},bgmacaw:{m:'egg',n:[1,2],p:.08},toucan:{m:'egg',n:[2,3],p:.1},flamingo:{m:'egg',n:[1,1],p:.08},peacock:{m:'egg',n:[2,3],p:.12}});

/* ---------- 鳥的外觀 ---------- */
const BS={
 macaw:{L:.3,R:.085,hr:.058,beak:'hook',bk:.07,tilt:1.0,legH:.07,span:1.0,chord:.2,tailL:.46,tailW:.055,spd:4.2,
  c:{body:0xd8231e,belly:0xc61c18,head:0xd8231e,face:0xf3ede4,cov:0xf2c21a,mid:0x2f9a3a,prim:0x1f4fb8,tail:[0xd0201c,0x2a6ad0],bu:0xf0e6d6,bl:0x2a2a2a,leg:0x5a5a5a,iris:0xf2eab8}},
 bgmacaw:{L:.3,R:.085,hr:.058,beak:'hook',bk:.07,tilt:1.0,legH:.07,span:1.1,chord:.2,tailL:.46,tailW:.055,spd:4.2,
  c:{body:0x1e78cc,belly:0xf2b01c,head:0x1e78cc,crown:0x3aa04a,face:0xf3f1ec,cov:0x1e78cc,mid:0x1e6ac0,prim:0x1a3f98,tail:[0x1e70c8,0x1a3f98],bu:0x1a1a1a,bl:0x1a1a1a,leg:0x4a4a4a,iris:0xf2eab8,throat:0x111111}},
 toucan:{L:.28,R:.08,hr:.055,beak:'toucan',bk:.19,tilt:.75,legH:.06,span:.6,chord:.16,tailL:.2,tailW:.07,spd:3.2,
  c:{body:0x141414,belly:0x141414,head:0x141414,bib:0xf6eed8,vent:0xd8221a,cov:0x161616,mid:0x161616,prim:0x101010,tail:[0x141414,0x0a0a0a],bu:0xf08a1a,bl:0xe0701a,leg:0x3a5ab8,iris:0x3a8ad8,eyeSkin:0xf07a20}},
 flamingo:{L:.42,R:.11,hr:.045,beak:'flam',bk:.11,tilt:.05,legH:.82,neck:.6,span:1.5,chord:.25,tailL:.12,tailW:.08,ground:true,
  c:{body:0xf49890,belly:0xf6a59a,head:0xf49890,cov:0xff6e6a,mid:0xff6e6a,prim:0x161616,tail:[0xf49890,0xf49890],bu:0xf0d0c8,bl:0x1a1a1a,leg:0xf07a8a,iris:0xf2e070}},
 peacock:{L:.4,R:.1,hr:.045,beak:'small',bk:.035,tilt:.3,legH:.38,neck:.2,span:1.3,chord:.28,tailL:.35,tailW:.1,ground:true,train:true,
  c:{body:0x2a8a5a,belly:0x1e2a3a,head:0x1a4fd0,neck:0x1a4fd0,cov:0xc8a878,mid:0xb88a50,prim:0xb8622a,tail:[0x6a5a3a,0x5a4a2a],bu:0xc8b8a0,bl:0xb8a890,leg:0x8a8a84,iris:0x2a2018,crest:0x1a4fd0}},
 peahen:{L:.36,R:.09,hr:.04,beak:'small',bk:.03,tilt:.3,legH:.34,neck:.18,span:1.1,chord:.24,tailL:.3,tailW:.1,ground:true,
  c:{body:0x7a6046,belly:0xe6dfd0,head:0x6a5a44,neck:0x2e6a52,cov:0x8a6e52,mid:0x7a5e44,prim:0x6a4e34,tail:[0x6a5440,0x4a3a2a],bu:0xb8a890,bl:0xa89880,leg:0x8a8a84,iris:0x2a2018,crest:0x6a5a44}},
 budgie:{L:.075,R:.022,hr:.018,beak:'hook',bk:.014,tilt:.9,legH:.015,span:.3,chord:.05,tailL:.09,tailW:.012,spd:6,
  c:{body:0x6fd23a,belly:0x7ade44,head:0xf2e23a,face:0xf2e23a,cov:0x2a3a1a,mid:0xd8e03a,prim:0x2a3a1a,tail:[0x2a4a9a,0x1a2a6a],bu:0xd8c89a,bl:0x9a8a6a,leg:0x9a8a9a,iris:0x111111}}};
const bstd=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({vertexColors:true,roughness:.75,side:THREE.DoubleSide},o));
function beakGeo(b,len){const C1=C(b.c.bu),C2=C(b.c.bl),gs=[];
 if(b.beak==='toucan'){const red=C(0xd8301a),blk=C(0x111111);
  gs.push(loft(len,t=>[.03*(.12+.88*Math.pow(t,.6)),.018*(.2+.8*Math.pow(t,.6)),-len*.1*Math.pow(1-t,2)],(c,t,a)=>{c.copy(t<.07||t>.95?blk:C1);if(t>=.07&&t<=.95&&Math.cos(a)>.5)c.lerp(red,.45*(1-t));},18,10).translate(0,.008,0));
  gs.push(loft(len*.93,t=>[.016*(.15+.85*Math.pow(t,.6)),.016*(.2+.8*Math.pow(t,.6)),-len*.06*Math.pow(1-t,2)],(c,t)=>c.copy(t<.08||t>.95?blk:C2),14,8).translate(0,-.016,0));}
 else if(b.beak==='flam'){const up=t=>t<.55?-len*.5*Math.pow((.55-t)/.55,1.3):0;gs.push(loft(len,t=>[.012*(.3+.7*t),.01*(.3+.7*t),up(t)],(c,t)=>c.copy(t<.42?C2:C1),16,8));
  gs.push(loft(len*.95,t=>[.01*(.3+.7*t),.009*(.3+.7*t),up(t)-.008],(c,t)=>c.copy(t<.42?C2:C1),14,8));}
 else if(b.beak==='hook'){gs.push(loft(len,t=>[len*.42*(.12+.88*Math.pow(t,.7)),len*.3*(.2+.8*Math.pow(t,.7)),-len*.75*Math.pow(1-t,2)],c=>c.copy(C1),14,10));
  gs.push(loft(len*.55,t=>[len*.22*(.2+.8*t),len*.24*(.3+.7*t),0],c=>c.copy(C2),10,8).translate(-len*.2,-len*.28,0));}
 else gs.push(loft(len,t=>[len*.25*(.15+.85*t),len*.22*(.2+.8*t),-len*.08*(1-t)],c=>c.copy(C1),10,8));
 return merge(gs);}
function buildBird(sp,sex){const b=sp==='peacock'&&sex==='♀'?BS.peahen:BS[sp],c=b.c,L=b.L,R=b.R,hr=b.hr;
 const root=new THREE.Group(),torso=new THREE.Group(),m=bstd(),wm=bstd({roughness:.85});root.add(torso);torso.position.y=b.legH;
 const cx=L*.12,cy=R*.85;const body=loft(L,keyProf([[0,R*.35,R*.32],[.15,R*.85,R*.78],[.4,R,R*.9],[.75,R*.8,R*.72],[1,R*.25,R*.25]]),(col,t,a,x,y,z)=>{col.set(Math.cos(a)<-.35?c.belly:c.body).convertSRGBToLinear();
  if(c.bib&&t<.3&&Math.cos(a)>-.6)col.set(c.bib).convertSRGBToLinear();if(c.vent&&t>.82&&Math.cos(a)<0)col.set(c.vent).convertSRGBToLinear();if(c.neck&&t<.22)col.set(c.neck).convertSRGBToLinear();},28,16).translate(cx,cy,0);
 const parts=[body];
 /* 頭與頸 */
 const neckL=b.neck||0,head=new THREE.Group();let hp;
 if(neckL>.3){const p0=V(cx+L*.45,cy+R*.3,0),pts=[];for(let i=0;i<=10;i++){const u=i/10;pts.push(V(p0.x+Math.sin(u*Math.PI)*.12-u*.02+u*.1,p0.y+u*neckL,0));}
  for(let i=0;i<10;i++)parts.push(prim(cylBetween(pts[i],pts[i+1],R*.24-i*.004,R*.24-(i+1)*.004,10),C(c.body)),prim(new THREE.SphereGeometry(R*.24-i*.004,10,8).translate(pts[i].x,pts[i].y,0),C(c.body)));hp=pts[10].clone().add(V(.02,.02,0));}
 else if(neckL>0){const a=V(cx+L*.4,cy+R*.3,0),h=V(cx+L*.5+.02,cy+R*.3+neckL,0);parts.push(prim(cylBetween(a,h,R*.42,R*.3,14),C(c.neck||c.body)));hp=h.clone().add(V(.01,.015,0));}
 else hp=V(cx+L*.5+hr*.25,cy+R*.45,0);
 head.position.copy(hp);torso.add(head);
 const hg=colorize(new THREE.SphereGeometry(hr,20,14),(col,x,y,z)=>{col.set(c.head);if(c.crown&&y>hr*.35&&x>-hr*.2)col.set(c.crown);if(c.face&&x>-hr*.1&&Math.abs(z)>hr*.45&&y<hr*.35&&y>-hr*.6)col.set(c.face);
  if(c.throat&&y<-hr*.55&&x>0)col.set(c.throat);if(c.eyeSkin&&x>-hr*.2&&x<hr*.6&&y>-hr*.25&&y<hr*.45&&Math.abs(z)>hr*.6)col.set(c.eyeSkin);col.convertSRGBToLinear();});
 const hparts=[hg,...eyes(hr*.35,hr*.18,hr*.78,hr*.2,C(c.iris))];const bkG=beakGeo(b,b.bk);bkG.translate(hr*.75+b.bk*.5,-hr*.05,0);hparts.push(bkG);
 if(sp==='peacock'){for(let i=0;i<7;i++){const a=(i-3)*.16,top=V(-hr*.1+Math.sin(a)*.0,hr+.07,Math.sin(a)*.05);parts;hparts.push(prim(cylBetween(V(0,hr*.8,0),top,.0018,.0018,4),C(c.crest)),prim(new THREE.SphereGeometry(.009,8,6).scale(1,1.4,.4).translate(top.x,top.y,top.z),C(c.crest)));}}
 if(c.face&&sp==='bgmacaw')for(let i=0;i<3;i++)for(const s of[1,-1])hparts.push(prim(new THREE.SphereGeometry(1,8,4).scale(hr*.3,.0025,.002).translate(hr*.25,-hr*.05-i*hr*.14,s*hr*.93),C(0x111111)));
 const hm=new THREE.Mesh(merge(hparts),m);head.add(hm);
 /* 尾 */
 if(!(b.train&&sex!=='♀')){const tl=b.tailL,tw=b.tailW,tg=colorize(tFin([[-L*.45+cx,cy,tw*.5],[-L*.45+cx-tl*.6,cy-tl*.05,tw*.6],[-L*.45+cx-tl,cy-tl*.1,0],[-L*.45+cx-tl*.6,cy-tl*.05,-tw*.6],[-L*.45+cx,cy,-tw*.5]],.02,.006,()=>[.5,.5]),
  (col,x)=>{const u=clamp((-L*.45+cx-x)/tl,0,1);col.set(c.tail[0]).lerp(new THREE.Color(c.tail[1]),u).convertSRGBToLinear();});parts.push(tg);}
 /* 收起的翅膀 */
 for(const s of[1,-1])parts.push(colorize(new THREE.SphereGeometry(1,18,10).scale(L*.5,R*.62,R*.2).translate(cx-L*.18,cy+R*.15,s*R*.78),(col,x)=>{const u=(cx+L*.32-x)/L;col.set(u<.35?c.cov:u<.55?c.mid:c.prim).convertSRGBToLinear();}));
 const bm=new THREE.Mesh(merge(parts),m);torso.add(bm);
 /* 展開的翅膀 */
 const S=b.span/2,ch=b.chord,wg=colorize(tFin([[.02,0,0],[.03,0,S*.35],[-.01,0,S*.75],[-ch*.35,0,S],[-ch*.75,0,S*.88],[-ch*1.05,0,S*.55],[-ch,0,S*.25],[-ch*.75,0,0]],.035,.006,()=>[.5,.5]),
  (col,x,y,z)=>{const f=Math.abs(z)/S,cr=-x/ch;let k=c.prim;if(cr<.42&&f<.62)k=c.cov;else if(cr<.6&&f<.7)k=c.mid;col.set(k).convertSRGBToLinear();if(k===c.prim&&Math.sin(z*90)>.75)col.multiplyScalar(.75);});
 const wings=[];for(const s of[1,-1]){const w=new THREE.Group();w.position.set(cx+L*.22,cy+R*.62,s*R*.6);w.scale.z=s;w.add(new THREE.Mesh(wg,wm));w.visible=false;torso.add(w);wings.push(w);}
 /* 腳 */
 const legs=[];const lm=new THREE.MeshStandardMaterial({color:C(c.leg),roughness:.6});for(const s of[1,-1]){const lg=new THREE.Group();lg.position.set(0,b.legH,s*R*.38);root.add(lg);const lr=Math.max(.004,R*.09);
  add(new THREE.CylinderGeometry(lr,lr*.9,b.legH,8).translate(0,-b.legH/2,0),lm,0,0,0,lg);if(b.legH>.3)add(new THREE.SphereGeometry(lr*1.5,10,8),lm,0,-b.legH*.48,0,lg);
  for(const a of(sp==='macaw'||sp==='bgmacaw'||sp==='toucan'||sp==='budgie'?[.5,-.5,2.6,-2.6]:[0,.6,-.6,3.14])){const tl=Math.max(.012,R*.45);add(cylBetween(V(0,-b.legH,0),V(Math.cos(a)*tl,-b.legH+.003,Math.sin(a)*tl*.6),lr*.7,lr*.5,6),lm,0,0,0,lg);}legs.push(lg);}
 /* 孔雀尾屏 */
 let train=null;if(b.train&&sex!=='♀'){train=new THREE.Group();train.position.set(cx-L*.4,cy+R*.2,0);torso.add(train);train.userData.f=[];
  const N=30;for(let i=0;i<N;i++){const len=1.0+.5*Math.sin(i/(N-1)*Math.PI)*rnd(.9,1),w=.075;const tip=V(-len+.08,0,0);
   const fg=colorize(tFin([[0,0,.008],[-len*.6,0,w*.45],[-len+.02,0,w*.5],[-len-.05,0,0],[-len+.02,0,-w*.5],[-len*.6,0,-w*.45],[0,0,-.008]],.006,.003,()=>[.5,.5]),(col,x,y,z)=>{const d=Math.hypot((x-tip.x)/1.35,z);
    if(d<.014)col.set(0x0a1450);else if(d<.024)col.set(0x18a0c8);else if(d<.034)col.set(0xc89a40);else if(d<.046)col.set(0x2a9a4a);else col.set(x>-len*.7?0x6a7a3a:0x3a8a4a);if(Math.abs(z)<.003)col.set(0x8a8a5a);col.convertSRGBToLinear();});
   const f=new THREE.Mesh(fg,m);f.userData.a=(i/(N-1)-.5);f.position.y=i*.0006;train.add(f);train.userData.f.push(f);}}
 return{root,torso,head,wings,legs,train,b,body:bm};}

/* ---------- 單隻鳥 ---------- */
const domeH=(x,z)=>{const r=Math.hypot(x,z);return 7.2*Math.sqrt(Math.max(0,1-(r/AVR)**2));};
class Bird{constructor(tk,entry){this.tk=tk;this.entry=entry;this.sp=entry.sp;const B=buildBird(entry.sp,entry.sex);Object.assign(this,B);this.g=this.root;tk.group.add(this.g);
  this.st='idle';this.tm=rnd(1,4);this.fold=1;this.yaw=rnd(0,6.28);this.seenFeed=tk.feedAt||0;this.ph=rnd(0,9);this.disp=0;this.oneLeg=0;
  if(this.b.ground){const p=this.groundPt();this.g.position.copy(p);}else{this.perch=this.freePerch();if(this.perch){this.perch.occ=this;this.g.position.copy(this.perch.p);this.yaw=this.perch.yaw;}else this.g.position.copy(this.groundPt());this.st='perch';}}
 groundPt(){const tk=this.tk;for(let i=0;i<30;i++){const a=rnd(0,6.28),r=Math.sqrt(Math.random())*6,x=Math.cos(a)*r,z=Math.sin(a)*r;if(this.sp!=='flamingo'&&tk.inPond(x,z))continue;if(this.sp==='flamingo'&&Math.random()<.65&&!tk.inPond(x,z))continue;if(tk.blockedL(x,z))continue;return V(x,tk.groundY(x,z),z);}return V(0,0,-3);}
 freePerch(list){const L=(list||this.tk.perches).filter(p=>!p.occ);return L.length?L[Math.random()*L.length|0]:null;}
 pickPos(){return this.g.position.clone().add(V(0,this.b.legH+this.b.R*1.5,0));}
 flyTo(p){if(this.perch&&this.perch.occ===this)this.perch.occ=null;this.perch=p;p.occ=this;const a=this.g.position.clone(),e=p.p.clone(),m=a.clone().add(e).multiplyScalar(.5);
  const off=V(-(e.z-a.z),0,e.x-a.x).normalize().multiplyScalar(rnd(-2,2));m.add(off);const r=Math.hypot(m.x,m.z);if(r>5.2)m.multiplyScalar(5.2/r);m.y=Math.min(Math.max(a.y,e.y)+rnd(1.2,2.6),domeH(m.x,m.z)-1.2);
  this.path=[a,m,e];const len=a.distanceTo(m)+m.distanceTo(e);this.dur=len/this.b.spd;this.u=0;this.st='fly';this.wings.forEach(w=>w.visible=true);}
 bez(u){const[a,m,e]=this.path,k=1-u;return V(k*k*a.x+2*k*u*m.x+u*u*e.x,k*k*a.y+2*k*u*m.y+u*u*e.y,k*k*a.z+2*k*u*m.z+u*u*e.z);}
 eat(){const e=this.entry;e.hunger=Math.min(100,e.hunger+55);e.fed=(e.fed||0)+1;e.mood=Math.min(100,(e.mood||70)+5);markDirty();}
 update(dt,t){const tk=this.tk,g=this.g,b=this.b;this.ph+=dt;const fedNew=(tk.feedAt||0)>this.seenFeed;
  if(b.ground)this.updGround(dt,t,fedNew);else this.updFly(dt,t,fedNew);
  g.rotation.y=this.yaw;}
 updFly(dt,t,fedNew){const g=this.g,b=this.b;
  if(this.st==='perch'){this.tm-=dt;this.torso.rotation.z=lerp(this.torso.rotation.z,b.tilt,dt*4);this.head.rotation.z=-this.torso.rotation.z*.85;this.head.rotation.y=Math.sin(this.ph*.7)*.6+Math.sin(this.ph*2.3)*.15;
   this.legs.forEach(l=>{l.rotation.z=lerp(l.rotation.z,0,dt*5);});
   if(fedNew){this.seenFeed=this.tk.feedAt;const p=this.freePerch(this.tk.feedPerches);if(p){this.flyTo(p);this.goEat=true;return;}}
   if(this.tm<=0){const p=this.freePerch();if(p)this.flyTo(p);this.tm=rnd(5,14);}}
  else if(this.st==='fly'){this.u+=dt/this.dur;const u=Math.min(1,this.u),p=this.bez(u),q=this.bez(Math.min(1,u+.02));g.position.copy(p);const d=q.clone().sub(p);
   if(d.lengthSq()>1e-8){const ty=Math.atan2(-d.z,d.x);let dy=ty-this.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));this.yaw+=dy*Math.min(1,dt*8);this.torso.rotation.z=lerp(this.torso.rotation.z,clamp(Math.atan2(d.y,Math.hypot(d.x,d.z)),-.6,.6)+(u>.85?.9*(u-.85)/.15:0),dt*6);}
   this.head.rotation.z=-this.torso.rotation.z*.6;this.head.rotation.y=0;const glide=d.y<-.002&&u>.2&&u<.8;const amp=glide?.08:.85,fr=b.spd>5?14:u>.85?7:4.2;
   const fl=Math.sin(t*fr*6.28)*amp+(glide?.15:.1);this.wings.forEach((w,i)=>w.rotation.x=-(i?-1:1)*fl);this.legs.forEach(l=>l.rotation.z=lerp(l.rotation.z,-1.3,dt*6));
   if(this.u>=1){this.st='perch';this.wings.forEach(w=>w.visible=false);this.yaw=lerp(this.yaw,this.perch.yaw,.5);this.tm=rnd(6,14);if(this.goEat){this.goEat=false;this.eat();this.tm=rnd(8,14);}}}}
 updGround(dt,t,fedNew){const g=this.g,b=this.b,tk=this.tk;
  if(fedNew){this.seenFeed=tk.feedAt;const f=tk.feedGround;this.tgt=V(f.x+rnd(-.6,.6),0,f.z+rnd(-.5,.5));this.st='walk';this.goEat=true;this.oneLeg=0;this.disp=0;}
  if(this.st==='idle'){this.tm-=dt;this.head.rotation.y=Math.sin(this.ph*.5)*.5;
   if(this.sp==='flamingo'){this.oneLeg=lerp(this.oneLeg,this.tm>2&&this.tm<9&&this.tk.inPond(g.position.x,g.position.z)?1:0,dt*2);}
   if(this.train){this.disp=lerp(this.disp,this.dispOn?1:0,dt*1.2);if(this.dispOn)this.train.rotation.x=Math.sin(t*28)*.012*this.disp;}
   if(this.tm<=0){if(this.train&&!this.dispOn&&Math.random()<.35){this.dispOn=true;this.tm=rnd(8,14);}else{this.dispOn=false;this.tgt=this.groundPt();this.st='walk';}}}
  else{this.oneLeg=lerp(this.oneLeg,0,dt*4);this.disp=lerp(this.disp,0,dt*2);const p=g.position,d=this.tgt.clone().sub(p);d.y=0;const dist=d.length();
   if(dist<.08){this.st='idle';this.tm=rnd(3,10);if(this.goEat){this.goEat=false;this.eat();this.tm=rnd(6,10);}}
   else{const ty=Math.atan2(-d.z,d.x);let dy=ty-this.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));this.yaw+=clamp(dy,-dt*2,dt*2);
    if(Math.abs(dy)<.6){const sp=(this.sp==='flamingo'?.35:.45)*(this.entry.size<.6?.7:1),nx=p.x+Math.cos(this.yaw)*sp*dt,nz=p.z-Math.sin(this.yaw)*sp*dt;if(this.tk.blockedL(nx,nz)&&!this.goEat){this.tgt=this.groundPt();}else{p.x=nx;p.z=nz;}}
    const s=Math.sin(this.ph*(this.sp==='flamingo'?4:6));this.legs[0].rotation.z=s*.35;this.legs[1].rotation.z=-s*.35;this.head.position.x+=(Math.cos(this.ph*12)*.002);}
   p.y=tk.groundY(p.x,p.z);}
  this.torso.rotation.z=lerp(this.torso.rotation.z,b.tilt,dt*3);this.head.rotation.z=-this.torso.rotation.z;
  if(this.sp==='flamingo'){this.legs[1].rotation.x=-this.oneLeg*.15;this.legs[1].rotation.z=this.st==='idle'?-this.oneLeg*2.3:this.legs[1].rotation.z;this.legs[1].scale.y=1-this.oneLeg*.45;}
  if(this.train){const d=this.disp;this.train.rotation.z=lerp(.12,1.45,d);for(const f of this.train.userData.f)f.rotation.y=f.userData.a*lerp(.35,3.0,d);}}
 dispose(){if(this.perch&&this.perch.occ===this)this.perch.occ=null;this.tk.group.remove(this.g);}}

/* ---------- 虎皮鸚鵡鳥群 ---------- */
class Flock{constructor(tk,entry){this.tk=tk;this.entry=entry;this.g=new THREE.Group();tk.group.add(this.g);this.m=[];this.mode='fly';this.tm=rnd(15,30);this.seenFeed=tk.feedAt||0;
  const tints=[null,null,null,[.55,.95,2.2],[1.5,1.25,.45],null,[1.6,1.6,1.7]];
  for(let i=0;i<14;i++){const B=buildBird('budgie');const tc=tints[i%tints.length];if(tc){const mm=B.body.material.clone();mm.color.setRGB(...tc);B.body.material=mm;B.wings.forEach(w=>{const wm2=w.children[0].material.clone();wm2.color.setRGB(...tc);w.children[0].material=wm2;});}
   B.root.scale.setScalar(rnd(.9,1.1));this.g.add(B.root);B.wings.forEach(w=>w.visible=true);B.legs.forEach(l=>l.rotation.z=-1.3);this.m.push({B,o:rnd(0,6.28),r:rnd(-.6,.6),h:rnd(-.5,.5),sp:rnd(.9,1.1),pos:V(0,3,0),yaw:0,perch:null,fp:0});}}
 pickPos(){return this.m[0].pos.clone();}
 update(dt,t){const tk=this.tk;this.tm-=dt;
  if((tk.feedAt||0)>this.seenFeed){this.seenFeed=tk.feedAt;this.mode='land';this.tm=rnd(14,20);this.assign(tk.feedPerches.concat(tk.feedPerches.map(p=>({p:p.p.clone().add(V(rnd(-.15,.15),0,rnd(-.15,.15))),yaw:p.yaw}))),true);}
  if(this.tm<=0){if(this.mode==='fly'){this.mode='land';this.tm=rnd(14,26);this.assign(tk.twigs);}else{this.mode='fly';this.tm=rnd(18,34);this.m.forEach(k=>{k.perch=null;k.B.wings.forEach(w=>w.visible=true);});}}
  for(const k of this.m){const B=k.B;let tgt;
   if(this.mode==='fly'||!k.perch){const a=t*.45*k.sp+k.o;tgt=V(Math.cos(a)*(3.6+k.r),3.6+k.h+Math.sin(t*.7+k.o)*.5,Math.sin(a)*(3.6+k.r)*.9);}else tgt=k.perch.p;
   const d=tgt.clone().sub(k.pos),dist=d.length();const landed=this.mode!=='fly'&&k.perch&&dist<.03;
   if(landed){k.pos.copy(tgt);B.wings.forEach(w=>w.visible=false);B.torso.rotation.z=lerp(B.torso.rotation.z,.9,dt*5);B.legs.forEach(l=>l.rotation.z=0);k.yaw=k.perch.yaw;B.head.rotation.z=-.8;B.head.rotation.y=Math.sin(t*1.3+k.o)*.7;
    if(k.eat){k.eat=false;this.entry.hunger=Math.min(100,this.entry.hunger+5);this.entry.fed=(this.entry.fed||0)+(k===this.m[0]?1:0);}}
   else{const v=Math.min(dist,6*dt);if(dist>1e-4)k.pos.addScaledVector(d,v/dist);const ty=Math.atan2(-d.z,d.x);let dy=ty-k.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));k.yaw+=dy*Math.min(1,dt*6);
    B.wings.forEach(w=>w.visible=true);const fl=Math.sin(t*16*6.28+k.o)*.9;B.wings.forEach((w,i)=>w.rotation.x=-(i?-1:1)*fl);B.torso.rotation.z=lerp(B.torso.rotation.z,clamp(d.y*2,-.5,.5),dt*5);B.head.rotation.z=0;B.legs.forEach(l=>l.rotation.z=-1.3);}
   B.root.position.copy(k.pos);B.root.rotation.y=k.yaw;}
  if(this.mode==='land'&&this.entry.hunger<100&&this.m.some(k=>k.eat===undefined))0;}
 assign(list,eat){const L=list.slice().sort(()=>Math.random()-.5);this.m.forEach((k,i)=>{k.perch=L[i%L.length];k.eat=!!eat;});}
 dispose(){this.tk.group.remove(this.g);}}
for(const k of['macaw','bgmacaw','toucan','flamingo','peacock'])MAKE[k]=(tk,e)=>new Bird(tk,e);MAKE.budgie=(tk,e)=>new Flock(tk,e);

/* ---------- 鳥園內景（設置後） ---------- */
DECO.aviary=function(tk){const g=tk.group;tk.W=12;tk.D=12;tk.H=6;
 const pond={x:2.8,z:2.6,rx:2.2,rz:1.5};tk.inPond=(x,z)=>((x-pond.x)/pond.rx)**2+((z-pond.z)/pond.rz)**2<1;
 tk.groundY=(x,z)=>{const q=((x-pond.x)/pond.rx)**2+((z-pond.z)/pond.rz)**2;if(q<1)return -.22*(1-q)-.02;return .02+.02*nz(x*1.3,0,z*1.3);};
 const fg=new THREE.CircleGeometry(AVR-.05,72,0,Math.PI*2);fg.rotateX(-Math.PI/2);const pp=fg.attributes.position,cc=[],cl=new THREE.Color();
 for(let i=0;i<pp.count;i++){const x=pp.getX(i),z=pp.getZ(i);pp.setY(i,tk.groundY(x,z));cl.set(0x5a8a3a);if(nz(x*.8,1,z*.8)>.25)cl.set(0x6a5a3a);if(Math.abs(x)<.9&&z<-2.4)cl.set(0x8a7050);cl.convertSRGBToLinear();cc.push(cl.r,cl.g,cl.b);}
 fg.setAttribute('color',F(cc,3));fg.computeVertexNormals();add(fg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,normalMap:rep(scaleN,30,30),normalScale:new THREE.Vector2(.8,.8)}),0,0,0,g);
 const pw=new THREE.Mesh(new THREE.CircleGeometry(1,48).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:C(0x4a7a7a),roughness:.05,metalness:.2,transparent:true,opacity:.82}));pw.scale.set(pond.rx,1,pond.rz);pw.position.set(pond.x,-.04,pond.z);g.add(pw);
 for(let i=0;i<14;i++){const a=i/14*6.28;rock(tk,pond.x+Math.cos(a)*pond.rx*1.05,0,pond.z+Math.sin(a)*pond.rz*1.05,rnd(.12,.24),0x8a8274,.6);}
 const wood=new THREE.MeshStandardMaterial({color:C(0x8a6a48),roughness:.8,normalMap:rep(scaleN,2,8),normalScale:new THREE.Vector2(.5,.5)});
 for(let z=-7.1;z<-2.3;z+=.22)box(1.7,.05,.19,wood,0,.04,z,g);
 tk.perches=[];tk.twigs=[];tk.obsL=[];const bark=new THREE.MeshStandardMaterial({color:C(0x7a6a58),roughness:.9,normalMap:rep(scaleN,2,6),normalScale:new THREE.Vector2(1,1)});
 const ptree=(x,z,h,n)=>{const gs=[];gs.push(prim(cylBetween(V(x,0,z),V(x+rnd(-.2,.2),h,z+rnd(-.2,.2)),.2,.09,10),C(0x7a6a58)));tk.obsL.push([x,z,.45]);
  for(let i=0;i<n;i++){const y=h*(.42+.5*i/n),a=i*2.4+rnd(-.3,.3),len=rnd(1.1,1.8),s=V(x,y,z),e=V(x+Math.cos(a)*len,y+rnd(.2,.6),z+Math.sin(a)*len);gs.push(prim(cylBetween(s,e,.07,.035,8),C(0x7a6a58)));
   const p=s.clone().lerp(e,.72);p.y+=.04;tk.perches.push({p,yaw:-a+Math.PI/2*(Math.random()<.5?1:-1)});for(let k=0;k<3;k++){const q=s.clone().lerp(e,.35+k*.25);q.y+=.035;tk.twigs.push({p:q,yaw:-a+Math.PI/2});}
   const tw=e.clone().add(V(Math.cos(a+1)*.4,.3,Math.sin(a+1)*.4));gs.push(prim(cylBetween(e,tw,.03,.012,6),C(0x7a6a58)));tk.twigs.push({p:tw.clone().add(V(0,.02,0)),yaw:-a});}
  const m=new THREE.Mesh(merge(gs),bark);m.material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,normalMap:rep(scaleN,2,6),normalScale:new THREE.Vector2(1,1)});g.add(m);};
 ptree(-3.2,1.4,5.2,7);ptree(3.6,-3.4,4.4,6);ptree(-1.2,4.4,3.6,5);
 const st=(x,z)=>{box(.1,2.3,.1,wood,x,1.15,z,g);tk.obsL.push([x,z,.3]);for(const [y,r] of[[1.6,0],[2.25,Math.PI/2]]){const b=box(1.4,.07,.07,wood,x,y,z,g);b.rotation.y=r;for(const s of[-.5,.5])tk.perches.push({p:V(x+Math.cos(r)*s,y+.04,z-Math.sin(r)*s),yaw:r+Math.PI/2});}};st(-4.8,-3.2);st(5,1.2);
 for(const [x,z,h] of[[-5.2,3.6,6],[1.2,6.1,5.4],[5.6,-1.4,5.2]]){treeAt(g,x,0,z,h,{r:.26,n:9});tk.obsL.push([x,z,.4]);for(let i=0;i<4;i++){const a=rnd(0,6.28);tk.twigs.push({p:V(x+Math.cos(a)*.9,h*.78,z+Math.sin(a)*.9),yaw:rnd(0,6)});}}
 for(let i=0;i<12;i++){const a=i/12*6.28+.3,r=rnd(5.6,6.6);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(z<-5&&Math.abs(x)<2)continue;bigLeaves(g,x,0,z,rnd(.6,1.1),[0x2f7a32,0x3a8a3a,0x4a9a3a][i%3],8,i%2===0);}
 /* 餵食台 */
 const fx=.8,fz=-1.6;box(.12,1.2,.12,wood,fx,.6,fz,g);add(new THREE.CylinderGeometry(.5,.5,.06,28),wood,fx,1.22,fz,g);tk.obsL.push([fx,fz,.35]);
 const bowl=add(new THREE.CylinderGeometry(.22,.16,.1,20),new THREE.MeshStandardMaterial({color:C(0xe8e2d8),roughness:.3}),fx,1.3,fz,g);
 const fruit=new THREE.Group();fruit.position.set(fx,1.35,fz);g.add(fruit);for(let i=0;i<14;i++)add(new THREE.SphereGeometry(rnd(.03,.05),10,8),new THREE.MeshStandardMaterial({color:C([0xf2a03a,0xd8301a,0x8ac03a,0xf2d03a][i%4]),roughness:.5}),rnd(-.13,.13),rnd(0,.06),rnd(-.13,.13),fruit);fruit.visible=false;tk.fruit=fruit;
 tk.feedPerches=[];for(let i=0;i<6;i++){const a=i/6*6.28;tk.feedPerches.push({p:V(fx+Math.cos(a)*.42,1.26,fz+Math.sin(a)*.42),yaw:-a+Math.PI});}
 const tray=add(new THREE.CylinderGeometry(.55,.55,.06,24),wood,-1.6,.04,-1.4,g);tk.feedGround=V(-1.6,0,-1.4);tk.obsL.push([-1.6,-1.4,.5]);
 tk.blockedL=(x,z)=>Math.hypot(x,z)>6.5||tk.obsL.some(o=>Math.hypot(x-o[0],z-o[1])<o[2]+.15);
 tk.walk=new THREE.Box3(V(-4,0,-4),V(4,3,4));tk.feedSpot=V(-1.6,0,-1.4);
 tk.anims.push((t,dt)=>{if(tk.fruit.visible&&Date.now()-(tk.feedAt||0)>90e3)tk.fruit.visible=false;});
 tk.onRemove=()=>{};};
/* 餵食：鳥用果物＋滋養丸 */
const _feedAv=feed;feed=function(tk){if(tk.st.type!=='aviary')return _feedAv(tk);ensureStock();tickStock();const st=tk.st;if(!st.animals.length){toast('鳥園裡還沒有鳥');return;}
 const nv=Math.min(2,S.stock.veg),np=Math.min(2,S.stock.pellet);if(!nv&&!np){toast('🍎 蔬果和滋養丸都沒有庫存了，去 2F 培養室收成或在商店補貨',3200);return;}
 S.stock.veg-=nv;S.stock.pellet-=np;tk.feedAt=Date.now();tk.fruit.visible=true;st.clean=Math.max(0,st.clean-3);logEv(st,'在餵食台放了水果和滋養丸');markDirty();toast('🍎 餵食台放好水果了，鳥會飛過來吃');};

/* ---------- 鳥類館建築（常駐） ---------- */
(function(){const P=AVC;const steelM=new THREE.MeshStandardMaterial({color:C(0x2e3a34),metalness:.7,roughness:.35});
 const ncv=document.createElement('canvas');ncv.width=ncv.height=64;const nx=ncv.getContext('2d');nx.strokeStyle='rgba(30,40,36,.9)';nx.lineWidth=2;nx.strokeRect(0,0,64,64);
 const nt=new THREE.CanvasTexture(ncv);nt.wrapS=nt.wrapT=THREE.RepeatWrapping;nt.anisotropy=4;
 const netM=(rx,ry)=>{const t=nt.clone();t.needsUpdate=true;t.repeat.set(rx,ry);return new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false});};
 const th=Math.acos(2.6/AVR);const dg=.17;
 add(new THREE.SphereGeometry(AVR,64,24,0,Math.PI*2,0,th),netM(110,18),P.x,0,P.z);
 add(new THREE.SphereGeometry(AVR,64,6,Math.PI*1.5+dg,Math.PI*2-dg*2,th,Math.PI/2-th),netM(108,5),P.x,0,P.z);
 const stone=new THREE.MeshStandardMaterial({color:C(0x9a9284),roughness:.85,normalMap:rep(scaleN,30,2),normalScale:new THREE.Vector2(.8,.8)});
 add(new THREE.CylinderGeometry(AVR+.12,AVR+.12,.55,72,1,true,Math.PI+dg,Math.PI*2-dg*2),stone,P.x,.27,P.z).material.side=THREE.DoubleSide;
 for(let i=0;i<16;i++){const ph=Math.PI*1.5+(i+.5)*Math.PI*2/16,pts=[];for(let k=0;k<=16;k++){const a=k/16*Math.PI/2;pts.push(V(P.x-Math.cos(ph)*Math.cos(a)*(AVR+.03),Math.sin(a)*(AVR+.03),P.z+Math.sin(ph)*Math.cos(a)*(AVR+.03)));}
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.05,6),steelM);}
 for(const y of[2.6,4.8,6.4]){const r=Math.sqrt(AVR*AVR-y*y)+.03;const tr=add(new THREE.TorusGeometry(r,.045,6,72),steelM,P.x,y,P.z);tr.rotation.x=Math.PI/2;}
 add(new THREE.SphereGeometry(.5,20,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0xddeeff,transparent:true,opacity:.5,roughness:.05}),P.x,AVR-.05,P.z);
 const dz=P.z-AVR;for(const s of[-1,1])box(.22,2.8,.3,steelM,P.x+s*1.3,1.4,dz);box(2.84,.3,.34,steelM,P.x,2.85,dz);
 const sgm=new THREE.MeshBasicMaterial({map:vText([['🦜 鳥類館',60,.46],['AVIARY・可走入的熱帶鳥園',24,.84,'#ffe08a']],640,150,'#12301e','#f6f2e2')});
 for(const s of[1,-1]){const p=add(new THREE.PlaneGeometry(2.7,.64),sgm,P.x,3.4,dz+s*.02);if(s>0)p.rotation.y=Math.PI;}
 const chM=new THREE.MeshStandardMaterial({color:C(0x9aa0a4),metalness:.8,roughness:.3,transparent:true,opacity:.65});for(let i=0;i<22;i++){const x=P.x-1.15+i*.11;add(new THREE.CylinderGeometry(.006,.006,2.5,4),chM,x,1.45,dz-.05);}
 const pathM=new THREE.MeshStandardMaterial({map:rep(slateTex,1,6),roughness:.7,color:C(0xc8c0b0)});
 const pth=(x,z,w,d)=>{const p=add(new THREE.PlaneGeometry(w,d),pathM,x,.013,z);p.rotation.x=-Math.PI/2;};pth((-2.4+P.x)/2,54,Math.abs(P.x+2.4),2);pth(P.x,(54+dz)/2,2,dz-54+1);
 /* 移除鳥園範圍內的樹 */
 for(const [tx,tz] of[[-26,66],[-33,76]]){for(let i=scene.children.length-1;i>=0;i--){const o=scene.children[i];if(Math.abs(o.position.x-tx)<.3&&Math.abs(o.position.z-tz)<.3&&o.position.y<.5)scene.remove(o);}
  for(let i=OBST.length-1;i>=0;i--){const o=OBST[i];if(Math.abs((o[0]+o[1])/2-tx)<.1&&Math.abs((o[2]+o[3])/2-tz)<.1)OBST.splice(i,1);}}
 /* 行走限制：網壁（門口除外）＋內部障礙 */
 BLOCK.push((x,z)=>{const lx=x-P.x,lz=z-P.z,r=Math.hypot(lx,lz);if(r>AVR-.45&&r<AVR+.5&&!(Math.abs(lx)<1.05&&lz<0))return true;const tk=TANKS.b1;if(tk&&r<AVR&&tk.obsL&&(tk.inPond(lx,lz)||tk.obsL.some(o=>Math.hypot(lx-o[0],lz-o[1])<o[2])))return true;return false;});
 const s={id:'b1',sz:'AV',wall:P.clone(),f:V(0,0,1)};computeSlot(s);s.obst=null;s.vr=AVR+2;s.view=P.clone();SLOTS.push(s);
 SPOTS.push(['🦜 鳥類館',()=>Object.assign(player,{x:P.x,y:0,z:dz-2.5,yaw:Math.PI,pitch:.05})]);})();
const _rc8=refreshChips;refreshChips=function(){_rc8();const ch=$('#chips'),b=document.createElement('button');b.className='chip';b.textContent='🦜 鳥類館';b.onclick=()=>{const s=SPOTS.find(x=>x[0]==='🦜 鳥類館');if(s)s[1]();};ch.appendChild(b);};
