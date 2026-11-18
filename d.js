/* ===== d.js：戶外庭園、熱帶溫室、亞馬遜河、池塘、放養區、新物種 ===== */

/* ---------- 物種資料擴充 ---------- */
const TRH={neon:[[20,26]],guppy:[[22,28]],angel:[[24,30]],clown:[[24,28]],btang:[[24,28]],ytang:[[24,28]],chromis:[[24,28]],seahorse:[[22,26]],moon:[[12,22]],nettle:[[12,18]],
 whale:[[22,28]],manta:[[22,28]],shark:[[22,28]],turtle:[[22,30]],grouper:[[22,28]],jack:[[22,28]],sardine:[[16,26]],
 gecko:[[26,32],[30,50]],beardie:[[28,35],[25,45]],tortoise:[[26,34],[30,75]],python:[[25,32],[50,75]],horned:[[24,28],[70,95]],dart:[[22,27],[75,100]],crested:[[20,26],[55,90]],cham:[[24,30],[45,80]]};
for(const k in TRH){SP[k].tr=TRH[k][0];if(TRH[k][1])SP[k].hu=TRH[k][1];}
for(const k of['jack','sardine','chromis','neon'])SP[k].school=true;
Object.assign(SP.gecko,{ps:.6});Object.assign(SP.beardie,{ps:1.4});Object.assign(SP.tortoise,{ps:2,hab2:'yard'});Object.assign(SP.python,{ps:1.5});Object.assign(SP.horned,{ps:.8});Object.assign(SP.dart,{ps:.3});Object.assign(SP.crested,{ps:.5});Object.assign(SP.cham,{ps:.8});
Object.assign(SP,{
 arapaima:{n:'巨骨舌魚',s:'Arapaima gigas',z:'全長 2.2 m（最大可達 3 m）',f:'世界最大的淡水魚之一。用特化的魚鰾呼吸空氣，每隔一陣子就會浮上水面換氣。',hab:'river',cost:12,hr:.03,tr:[25,30]},
 arowana:{n:'銀帶（銀龍魚）',s:'Osteoglossum bicirrhosum',z:'全長 80 cm',f:'會躍出水面捕食樹枝上的昆蟲，有「水猴子」的別名，下巴有兩根觸鬚。',hab:'river',cost:5,hr:.04,tr:[24,30]},
 piranha:{n:'紅腹食人魚（群）',s:'Pygocentrus nattereri',z:'單隻 25 cm，一群 18 隻',f:'其實很膽小，成群行動主要是為了保護自己，牙齒像剃刀一樣銳利。',hab:'river',cost:8,hr:.05,tr:[24,28],school:true},
 motoro:{n:'珍珠魟',s:'Potamotrygon motoro',z:'盤寬 50 cm',f:'淡水魟魚，背上有像眼睛的橘色圓斑，尾巴上有毒刺。',hab:'river',cost:5,hr:.035,tr:[24,30]},
 rtc:{n:'紅尾鴨嘴',s:'Phractocephalus hemioliopterus',z:'全長 1 m（最大約 1.8 m）',f:'大型鯰魚，用長長的觸鬚在河底找食物，尾鰭是鮮豔的紅色。',hab:'river',cost:8,hr:.03,tr:[24,30]},
 discus:{n:'七彩神仙',s:'Symphysodon aequifasciatus',z:'全長 15 cm',f:'親魚會從體表分泌「魚乳」餵小魚，被稱為「熱帶魚之王」。',hab:'river',cost:2,hr:.05,tr:[28,31]},
 cardinal:{n:'寶蓮燈（群）',s:'Paracheirodon axelrodi',z:'單隻 4 cm，一群 50 隻',f:'來自亞馬遜的黑水河，紅色延伸到整個腹部，這點和日光燈魚不同。',hab:'river',cost:3,hr:.06,tr:[24,29],school:true},
 koi:{n:'錦鯉',s:'Cyprinus rubrofuscus',z:'全長 60 cm',f:'可以活超過 50 年，會記得餵牠的人，看到人靠近就游過來討食。',hab:'pond',cost:3,hr:.03,tr:[10,26]},
 pturtle:{n:'斑龜',s:'Mauremys sinensis',z:'背甲長 20 cm',f:'台灣原生的淡水龜，脖子上有黃綠色細條紋，喜歡爬到浮木上曬太陽。',hab:'pond',cost:2,hr:.03,tr:[18,30]},
 ltort:{n:'豹紋陸龜',s:'Stigmochelys pardalis',z:'甲長 45 cm',f:'背甲上的黑色斑點像豹紋，是體型很大的陸龜之一，以草為主食。',hab:'yard',cost:8,hr:.025,tr:[24,34],hu:[30,75],diet:'veg',ps:2.4},
});
Object.assign(HT,{
 river:{n:'亞馬遜河',sz:['R'],aqua:true,wc:0x46482a,den:.2,deep:.65,d:'淹水森林、王蓮、河岸剖面'},
 pond:{n:'錦鯉龜池',sz:['PD'],aqua:true,wc:0x34503c,den:.9,deep:.7,d:'睡蓮、蘆葦、曬背浮木'},
 yard:{n:'陸龜放養區',sz:['PEN'],d:'草地、遮蔽小屋、泥坑、水槽'},
});
Object.assign(SZ,{R:{cap:50,n:'河流'},PD:{w:9,d:6,cap:30,n:'池塘'},PEN:{w:8,d:6,cap:40,n:'放養區'}});

/* ---------- 新魚類模型 ---------- */
function gArapaima(){const L=2.2,o=C(0x55604a),d=C(0x2e352a),r=C(0xb8382a),b=C(0x9aa08a),f=C(0x6a2a20);
 const prof=keyProf([[0,.002,.002],[.03,.06,.09],[.1,.12,.15],[.3,.155,.155],[.6,.14,.125],[.82,.09,.07],[.92,.06,.035],[1,.03,.01]]);
 return merge([loft(L,prof,(c,t,a,x)=>{const ca=Math.cos(a);c.copy(ca<-.4?b:o);if(t>.45){const k=clamp((t-.45)/.3,0,1);c.lerp(r,k*(Math.sin(x*60)*Math.sin(a*14)>-.2?1:.55));}if(Math.sin(x*48+Math.sin(a*12)*2)>.86)c.lerp(d,.6);},60,20),
  fin([[-.62,.12,0],[-.95,.27,0],[-1.05,.05,0]],[f,r,f]),fin([[-.62,-.12,0],[-.95,-.25,0],[-1.05,-.05,0]],[f,r,f]),caudal(-1.05,.04,.22,.2,1,[f,r,r,r,r,f]),...pecs(.75,.62,.5,-.08,.12,.16,.08,[o]),...eyes(.98,.05,.11,.016,C(0xc0b080))]);}
function gArowana(){const L=.8,s=C(0xd8dde0),p=C(0xe6c4cc),g=C(0x8aa4ac),f=C(0xb8c4c8);
 const prof=keyProf([[0,.002,.002],[.04,.03,.018,-.01],[.15,.068,.032,-.012],[.4,.085,.035,-.01],[.7,.065,.026],[.9,.03,.012],[1,.012,.004]]);
 return merge([loft(L,prof,(c,t,a,x)=>{const ca=Math.cos(a);c.copy(ca>.6?g:s);if(Math.sin(x*75)*Math.sin(a*7)>.55)c.lerp(p,.55);},44,16),
  fin([[-.15,.07,0],[-.3,.12,0],[-.37,.04,0]],[f]),fin([[-.05,-.07,0],[-.3,-.12,0],[-.37,-.03,0]],[f]),caudal(-.39,.012,.07,.05,.7,[f]),...pecs(.3,.24,.16,-.04,.03,.06,.03,[f]),
  prim(cylBetween(V(.39,-.035,.006),V(.48,-.03,.012),.003,.001,4),s),prim(cylBetween(V(.39,-.035,-.006),V(.48,-.03,-.012),.003,.001,4),s),...eyes(.35,.015,.03,.009,C(0xd0b060))]);}
function gPiranha(){const L=.25,bk=C(0x6a7880),sv=C(0xa8b4b8),rd=C(0xd8402a),k=C(0x1a1a1a);
 return merge([loft(L,fusi(.085,.035,.45,.2,.75),(c,t,a,x)=>{const ca=Math.cos(a);c.copy(ca>.3?bk:sv);if(ca<-.2&&t<.78)c.copy(rd);if(Math.sin(x*400+a*30)>.93)c.lerp(new THREE.Color(1,1,1),.6);},34,14),
  fin([[0,.08,0],[-.04,.11,0],[-.065,.075,0]],[bk]),fin([[-.04,-.07,0],[-.07,-.1,0],[-.1,-.04,0]],[rd]),caudal(-.11,.012,.05,.045,.62,[bk,bk,k,bk,k,bk]),...pecs(.07,.05,.03,-.03,.03,.03,.02,[rd]),...eyes(.09,.02,.017,.0065,C(0xc03a20))]);}
function gRay(){const Rd=.25,nu=22,nv=40,P=[],Cc=[],I=[],top=C(0x5a3e24),bot=C(0xece6dc),oc=C(0xf09030),k=C(0x1a1008),c=new THREE.Color();
 for(const side of[1,-1]){const base=P.length/3;for(let i=0;i<=nu;i++){const r=i/nu;for(let j=0;j<=nv;j++){const a=j/nv*Math.PI*2,x=Math.cos(a)*r*Rd*1.05,z=Math.sin(a)*r*Rd,th=.032*(1-r*r)+.002;P.push(x,side*th,z);
   c.copy(side>0?top:bot);if(side>0){const sx=x*36,sz=z*36+(Math.round(x*36)%2)*.5,fx=sx-Math.round(sx),fz=sz-Math.round(sz),dd=Math.hypot(fx,fz);if(dd<.26)c.copy(oc);else if(dd<.36)c.copy(k);}Cc.push(c.r,c.g,c.b);}}
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=base+i*(nv+1)+j,b=a+nv+1;I.push(a,b,a+1,b,b+1,a+1);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',F(P,3));g.setAttribute('color',F(Cc,3));g.setAttribute('uv',F(new Array(P.length/3*2).fill(.5),2));g.setIndex(I);g.computeVertexNormals();
 return merge([g.toNonIndexed(),prim(cylBetween(V(-.25,0,0),V(-.6,.01,0),.013,.003,6),top),prim(new THREE.ConeGeometry(.004,.05,4).rotateZ(Math.PI/2).translate(-.45,.016,0),k),...eyes(.12,.03,.035,.008,C(0x2a2010))]);}
function gCatfish(){const L=1,bk=C(0x1c1c1e),w=C(0xf0eee8),r=C(0xe05a2a),gy=C(0x3a3a3a);
 const prof=keyProf([[0,.002,.003],[.05,.05,.09],[.15,.09,.13],[.35,.11,.11],[.6,.09,.07],[.85,.05,.035],[1,.02,.01]]);
 const gs=[loft(L,prof,(c,t,a)=>{const ca=Math.cos(a),sa=Math.abs(Math.sin(a));c.copy(bk);if(sa>.5&&ca<.15&&ca>-.7)c.copy(w);if(ca<-.7)c.copy(gy);if(ca>.2&&Math.sin(t*90+a*9)>.85)c.copy(gy);},48,18),
  fin([[.15,.1,0],[.05,.22,0],[-.02,.1,0]],[bk,r,bk]),fin([[-.25,.07,0],[-.3,.1,0],[-.38,.05,0]],[bk]),fin([[-.2,-.07,0],[-.27,-.13,0],[-.33,-.05,0]],[bk]),caudal(-.47,.02,.15,.13,.7,[r]),...pecs(.3,.22,.12,-.07,.1,.13,.05,[bk]),...eyes(.42,.04,.09,.008,C(0x8a7a50))];
 for(const [tx,ty,tz] of[[.78,-.07,.2],[.62,-.13,.06],[.6,-.12,.03]])for(const s of[1,-1])gs.push(prim(cylBetween(V(.48,-.03,s*.04),V(tx,ty,s*tz),.005,.0015,4),bk));return merge(gs);}
function gDiscus(){const L=.15,b=C(0x2fb0c0),r=C(0xb8402a),f=C(0x3ab8b0);
 return merge([loft(L,t=>{const k=Math.pow(Math.sin(Math.PI*Math.min(1,t*1.04)),.55);return[.068*k,.012*k+.001];},(c,t,a,x,y)=>{c.copy(b);if(Math.sin(y*240+x*90)>.25)c.copy(r);},36,14),
  fin([[.045,.055,0],[.0,.085,0],[-.05,.072,0],[-.072,.03,0]],[f,r,f]),fin([[.03,-.055,0],[-.01,-.082,0],[-.05,-.07,0],[-.072,-.03,0]],[f,r,f]),caudal(-.074,.01,.025,.025,.9,[f]),...eyes(.055,.012,.009,.0045,C(0xc03a20))]);}
function gCardinal(){const L=.04,s=C(0xc8d4dc),bl=C(0x22e6ff),r=C(0xe0202a),f=C(0xdde6ea);
 return merge([loft(L,fusi(.0075,.005,.35,.2,.6),(c,t,a)=>{const ca=Math.cos(a);c.copy(s);if(ca>.1&&ca<.6&&t>.1&&t<.88)c.copy(bl);if(ca<-.05&&t>.12)c.copy(r);},16,10),caudal(-.018,.0016,.009,.007,.55,[f]),...eyes(.014,.0016,.0024,.0013)]);}
function gKoi(){const L=.6,vt=Math.random(),W=C(0xf4f2ec),R=C(0xd8381a),K=C(0x141414),G=C(0xe8b84a),seed=rnd(0,100);
 const col=(c,t,a,x,y,z)=>{const ca=Math.cos(a),n=nz(x*12+seed,y*30,z*30+seed);
  if(vt<.35){c.copy(W);if(ca>-.3&&n>.05)c.copy(R);}else if(vt<.6){c.copy(W);if(ca>-.3&&n>.1)c.copy(R);if(ca>-.2&&nz(x*20,y*40+seed,z*40)>.55)c.copy(K);}
  else if(vt<.8){c.copy(K);if(n>.2&&ca>-.4)c.copy(R);if(ca<-.3||nz(x*15,seed,z*15)>.45)c.copy(W);}else{c.copy(G);if(ca<-.5)c.lerp(W,.4);}};
 const fc=vt<.8?(vt>=.6?K:W):G;
 return{geo:merge([loft(L,fusi(.1,.08,.35,.15,.6),col,48,18),fin([[.05,.09,0],[-.02,.14,0],[-.2,.11,0],[-.24,.07,0]],[fc]),caudal(-.27,.02,.12,.1,.8,[fc]),...pecs(.17,.12,.06,-.05,.06,.1,.03,[fc]),
  prim(cylBetween(V(.29,-.02,.02),V(.32,-.035,.03),.003,.001,4),W),prim(cylBetween(V(.29,-.02,-.02),V(.32,-.035,-.03),.003,.001,4),W),...eyes(.24,.025,.04,.008,C(0x302010))]),metal:vt>=.8};}

/* ---------- 新物種生成 ---------- */
const RB=(a,b)=>new THREE.Box3(V(...a),V(...b));
Object.assign(MAKE,{
 gecko:(tk,e)=>new Walker(tk,e,'gecko',{speed:.05,wait:[2,10],eatR:.025,fill:20,noct:true}),
 crested:(tk,e)=>new Climber(tk,e,'crested',{speed:.04}),
 tortoise:(tk,e)=>new Tortoise(tk,e,{scale:tk.type==='yard'?1.7:1}),
 ltort:(tk,e)=>new Tortoise(tk,e,{scale:1,leopard:true}),
 arapaima:(tk,e)=>new Agent(new THREE.Mesh(gArapaima(),cache(tk,'ara',()=>fishMat(tk,{amp:.12,k:2.8,spd:2.6,nose:1.1,len:2.2}))),tk,e,{speed:.3,turn:.5,pitchMax:.35,reach:.6,box:RB([-12,.6,-5.6],[12,4.45,-.6]),nose:1.05,eatR:.25,eatMax:3,fill:3,scare:1.5,
  after:(a,t,dt)=>{a.br=(a.br??rnd(30,70))-dt;if(a.br<0&&!a.up)a.up=true;if(a.up){a.wp=V(clamp(a.pos.x+Math.cos(a.yaw)*1.5,-11,11),4.46,clamp(a.pos.z,-5.3,-.8));if(a.pos.y>4.36){a.up=false;a.br=rnd(50,110);a.wp=null;ripple(a.tk,a.pos);}}}}),
 arowana:(tk,e)=>new Agent(new THREE.Mesh(gArowana(),cache(tk,'arw',()=>fishMat(tk,{amp:.03,k:8,spd:5,nose:.4,len:.8},{metalness:.45,roughness:.22}))),tk,e,{speed:.25,turn:1.1,pitchMax:.15,reach:.4,box:RB([-12,3.7,-5.4],[12,4.4,-.5]),nose:.38,eatR:.06,fill:6,scare:.8}),
 piranha:(tk,e)=>new School(gPiranha(),fishMat(tk,{amp:.01,k:22,spd:12,nose:.12,len:.25},{metalness:.35,roughness:.3}),18,tk,e,{spread:[1.2,.3,.8],mill:.4,speed:.35,agility:2.5,eatMax:2,fill:.7,path:t=>V(8*Math.sin(t*.07),2.3+.7*Math.sin(t*.2),-3+1.5*Math.sin(t*.11))}),
 motoro:(tk,e)=>new Agent(new THREE.Mesh(gRay(),cache(tk,'ray',()=>patch(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,side:THREE.DoubleSide}),{tank:tk,flap:{amp:.025,spd:5,span:.25}}))),tk,e,{speed:.12,turn:1.4,pitchMax:.04,reach:.3,box:RB([-12,.33,-5.5],[12,.42,-.5]),wait:[2,8],nose:.22,eatR:.08,fill:6}),
 rtc:(tk,e)=>new Agent(new THREE.Mesh(gCatfish(),cache(tk,'rtc',()=>fishMat(tk,{amp:.06,k:4,spd:4,nose:.5,len:1}))),tk,e,{speed:.18,turn:.8,pitchMax:.08,reach:.5,box:RB([-12,.45,-5.5],[12,.95,-.5]),wait:[3,10],nose:.48,eatR:.15,eatMax:2,fill:4,scare:.9}),
 discus:(tk,e)=>new Agent(new THREE.Mesh(gDiscus(),cache(tk,'dis',()=>fishMat(tk,{amp:.004,k:40,spd:9,nose:.07,len:.15}))),tk,e,{speed:.07,turn:1.6,pitchMax:.15,reach:.1,box:RB([-10,1,-5],[10,3.6,-.6]),wait:[1,4],nose:.07,eatR:.02,fill:8}),
 cardinal:(tk,e)=>new School(gCardinal(),fishMat(tk,{amp:.003,k:140,spd:30,nose:.02,len:.04},{roughness:.25}),50,tk,e,{spread:[.6,.15,.4],mill:.35,speed:.15,agility:3,fill:.8,path:t=>V(-4+4*Math.sin(t*.06),2.2+.7*Math.sin(t*.21),-2.6+.9*Math.sin(t*.13))}),
 koi:(tk,e)=>{const k=gKoi();return new Agent(new THREE.Mesh(k.geo,fishMat(tk,{amp:.03,k:9,spd:5,nose:.3,len:.6},{metalness:k.metal?.6:.12,roughness:k.metal?.25:.35})),tk,e,{speed:.22,turn:1,pitchMax:.15,reach:.4,wait:[0,2],nose:.28,eatR:.08,eatMax:2,fill:5});},
 pturtle:(tk,e)=>mkPondTurtle(tk,e),
});
function mkPondTurtle(tk,e){const g=new THREE.Group();
 const sh=colorize(new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI*.55).scale(.1,.045,.08),(c,x,y,z)=>{c.set(0x4a4a2a);if(Math.abs(Math.sin(x*60))<.12||Math.abs(Math.sin(z*70))<.1)c.set(0xb8a860);c.convertSRGBToLinear();});
 add(sh,mat(tk,0xffffff,{vertexColors:true,roughness:.35,normalMap:rep(scaleN,4,4),normalScale:new THREE.Vector2(.4,.4)}),0,0,0,g);
 add(new THREE.CylinderGeometry(.095,.095,.012,28).scale(1,1,.82),mat(tk,0xd8c870,{roughness:.5}),0,-.004,0,g);
 const hp=keyProf([[0,.004,.004],[.2,.016,.016],[.6,.02,.02],[1,.018,.018]]);
 add(loft(.07,hp,(c,t,a)=>{c.set(Math.sin(a*9)>.55?0xd8d060:0x2e3a22).convertSRGBToLinear();},20,16),mat(tk,0xffffff,{vertexColors:true,roughness:.4}),.115,.008,0,g);
 const sk=mat(tk,0x3a4428,{roughness:.6});const fl=[];for(const [x,s] of[[.06,1],[.06,-1],[-.06,1],[-.06,-1]]){const p=new THREE.Group();p.position.set(x,-.006,s*.07);g.add(p);const f=add(new THREE.SphereGeometry(1,10,8).scale(.03,.008,.018),sk,0,0,s*.015,p);fl.push([p,s]);}
 return new Agent(g,tk,e,{speed:.12,turn:1.2,pitchMax:.4,reach:.15,wait:[0,3],box:RB([-3.6,-.8,-2.3],[3.6,.12,2.3]),nose:.14,eatR:.04,fill:8,
  after:(a,t,dt)=>{for(const [p,s] of fl)p.rotation.x=s*Math.sin(t*4+a.th)*.5*(a.bask>0?0:1);
   if(!(a.bask>0)&&!a.bk&&a.tk.log&&Math.random()<dt*.012){a.bk=true;}if(a.bk){a.wp=a.tk.log.clone();if(a.pos.distanceTo(a.tk.log)<.15){a.bk=false;a.bask=rnd(25,60);}}
   if(a.bask>0){a.bask-=dt;a.pos.copy(a.tk.log);a.obj.position.copy(a.tk.log);a.obj.rotation.set(0,-a.yaw,0);if(a.bask<=0)a.wp=null;}}});}
function ripple(tk,p){const r=add(new THREE.RingGeometry(.05,.08,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),p.x,(tk.waterY||2)+.01,p.z,tk.group);r.rotation.x=-Math.PI/2;
 let l=0;const f=(t,dt)=>{l+=dt;r.scale.setScalar(1+l*8);r.material.opacity=Math.max(0,.6-l*.4);if(l>1.5){tk.group.remove(r);tk.anims.splice(tk.anims.indexOf(f),1);}};tk.anims.push(f);}

/* ---------- 共用造景 ---------- */
function lilyPads(tk,n,cx,cz,rx,rz,y,big){const pm=mat(null,0x3f7a2a,{roughness:.45,side:THREE.DoubleSide}),rm=mat(null,big?0x8a2a2a:0x3f7a2a,{roughness:.5,side:THREE.DoubleSide}),fm=[mat(null,0xf6f0f4,{roughness:.4}),mat(null,0xf0a0c0,{roughness:.4})];
 for(let i=0;i<n;i++){const r=big?rnd(.55,.9):rnd(.1,.18),x=cx+rnd(-rx,rx),z=cz+rnd(-rz,rz),a=rnd(0,6);const pad=add(new THREE.CircleGeometry(r,40,big?0:.15,big?Math.PI*2:Math.PI*1.9),pm,x,y,z,tk.group);pad.rotation.set(-Math.PI/2,0,a);
  if(big){const rim=add(new THREE.CylinderGeometry(r,r*.98,.07,48,1,true),rm,x,y+.035,z,tk.group);}if(Math.random()<.35){const fl=new THREE.Group();fl.position.set(x+rnd(-.1,.1)*r,y+.02,z+rnd(-.1,.1)*r);tk.group.add(fl);const fmt=fm[i%2];for(let k=0;k<8;k++){const p=add(new THREE.SphereGeometry(1,8,6).scale(.012,.006,.03).translate(0,0,.03),fmt,0,.01,0,fl);p.rotation.set(-.6,k/8*6.28,0);}}}}
function treeAt(parent,x,y,z,h,o={}){const gs=[],tc=C(o.bark||0x5a4636),lc=(o.leaf||[0x3f7a32,0x2f6a2a,0x4c8a3a]).map(C);gs.push(prim(cylBetween(V(0,0,0),V(0,h*.62,0),o.r||.28,(o.r||.28)*.6,10),tc));
 if(o.butt)for(let i=0;i<5;i++){const a=i/5*6.28;gs.push(prim(cylBetween(V(Math.cos(a)*o.r*2.4,0,Math.sin(a)*o.r*2.4),V(Math.cos(a)*o.r*.4,h*.12,Math.sin(a)*o.r*.4),o.r*.25,o.r*.15,6),tc));}
 for(let i=0;i<4;i++){const a=i*1.7+rnd(0,1);gs.push(prim(cylBetween(V(0,h*.5,0),V(Math.cos(a)*h*.22,h*.78,Math.sin(a)*h*.22),(o.r||.28)*.45,(o.r||.28)*.2,7),tc));}
 for(let i=0;i<(o.n||9);i++){const a=rnd(0,6.28),d=rnd(0,h*.26),g=new THREE.IcosahedronGeometry(rnd(.18,.3)*h,1);g.translate(Math.cos(a)*d,h*rnd(.72,.95),Math.sin(a)*d);gs.push(colorize(g,c=>c.copy(lc[i%lc.length])));}
 const m=add(merge(gs.map(g=>g.attributes.normal?g:(g.computeVertexNormals(),g))),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,flatShading:true}),x,y,z,parent);return m;}
function palmAt(parent,x,y,z,h){const gs=[],tc=C(0x6a5440),lc=[C(0x3f8a3a),C(0x2f7a32),C(0x4c9a40)];let p=V(0,0,0);for(let i=0;i<8;i++){const q=V(Math.sin(i*.4)*.08,h*(i+1)/8,Math.cos(i*.5)*.06);gs.push(prim(cylBetween(p,q,.16-i*.01,.15-i*.01,10),tc));p=q;}
 for(let k=0;k<14;k++){const a=k/14*6.28+rnd(-.2,.2),L=rnd(1.6,2.4);let pv=p.clone();for(let j=1;j<=8;j++){const s=j/8,pt=V(p.x+Math.cos(a)*L*s,p.y+Math.sin(s*2.2)*.3*L-s*s*L*.55,p.z+Math.sin(a)*L*s);const w=.22*Math.sin(Math.PI*Math.min(1,s*1.1))+.02,px=-Math.sin(a)*w,pz=Math.cos(a)*w;
   gs.push(fin([[pv.x,pv.y,pv.z],[pt.x+px,pt.y-.03,pt.z+pz],[pt.x,pt.y,pt.z],[pt.x-px,pt.y-.03,pt.z-pz]],[lc[k%3]]));pv=pt;}}
 return add(merge(gs),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,side:THREE.DoubleSide}),x,y,z,parent);}
function bigLeaves(parent,x,y,z,s,col=0x2f7a32,n=7,split=false){const gs=[],lc=C(col),sc=C(0x6a8a3a);
 for(let k=0;k<n;k++){const a=k/n*6.28+rnd(-.3,.3),L=s*rnd(.8,1.2),stem=V(Math.cos(a)*L*.35,L*rnd(.6,.9),Math.sin(a)*L*.35);gs.push(prim(cylBetween(V(0,0,0),stem,.012*s+.004,.008,5),sc));
  const dir=V(Math.cos(a),0,Math.sin(a)),side=V(-Math.sin(a),0,Math.cos(a));const pts=[stem];for(let j=1;j<=6;j++){const t=j/6,w=Math.sin(Math.PI*t)*L*.28*(split&&j%2?.6:1);const c=stem.clone().addScaledVector(dir,L*.6*t).add(V(0,-t*t*L*.35,0));pts.push(c.clone().addScaledVector(side,w));}
  const pts2=[stem];for(let j=1;j<=6;j++){const t=j/6,w=Math.sin(Math.PI*t)*L*.28*(split&&j%2?.6:1);const c=stem.clone().addScaledVector(dir,L*.6*t).add(V(0,-t*t*L*.35,0));pts2.push(c.clone().addScaledVector(side,-w));}
  gs.push(fin(pts.map(p=>[p.x,p.y,p.z]),[lc]),fin(pts2.map(p=>[p.x,p.y,p.z]),[lc]));}
 return add(merge(gs),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,side:THREE.DoubleSide}),x,y,z,parent);}
const waterfallTex=(()=>{const t=ctex(64,256,(x,w,h)=>{x.fillStyle='rgba(220,235,240,.15)';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){x.fillStyle=`rgba(255,255,255,${rnd(.15,.6)})`;x.fillRect(rnd(0,w),rnd(0,h),rnd(1,3),rnd(20,80));}});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})();

/* ---------- 亞馬遜河剖面缸 ---------- */
DECO.river=function(tk){const W=26,D=11,WY=4.5;tk.waterY=WY;const vault=x=>5+7*Math.sqrt(Math.max(0,1-(x/18)**2));
 tk.groundY=(x,z)=>{const n=.06*nz(x*.8,0,z*.8);if(z>-6)return .2+n+.05*Math.sin(x*.7);if(z>-9)return .2+n+(-6-z)/3*5.8;return 6+(-9-z)*1.5+.3*nz(x*.5,1,z);};
 floorPlane(tk,W,D,0,-D/2,0x6a5638,0x3a2e1e,{tint:(c,x,z)=>{const y=tk.groundY(x,z);if(y>WY+.05)c.lerp(C(0x3d5a26),.8);if(y>6.2)c.lerp(C(0x6a6458),.75);},res:6,caus:0x4a6a2a,rep:[8,4],nrm:2});
 for(let x=-12.4;x<=12.4;x+=1.7){const r=rnd(1.1,1.7),sy=rnd(1.2,1.8),top=vault(x)-.5;rock(tk,x,Math.min(tk.groundY(x,-10.3)-.2,top-r*sy*.85),-10.3+rnd(-.3,.3),r,[0x6a6050,0x5a5244,0x7a705e][Math.random()*3|0],sy);}
 for(const sx of[-1,1])for(let z=-.8;z>-10;z-=1.4){const g=tk.groundY(sx*12.6,z);for(let y=.7;y<Math.min(g+2.2,vault(13)-1.2);y+=1.5)rock(tk,sx*13.1,y,z,rnd(.85,1.2),[0x5a5040,0x4a4234][Math.random()<.5?0:1],rnd(1,1.4));}
 const wm=new THREE.MeshPhysicalMaterial({color:C(0x5a6a38),roughness:.04,transparent:true,opacity:.55,normalMap:rep(scaleN,40,14),normalScale:new THREE.Vector2(.12,.12),side:THREE.DoubleSide,envMapIntensity:1.3,depthWrite:false});
 const ws=add(new THREE.PlaneGeometry(W,8.4),wm,0,WY,-4.2,tk.group);ws.rotation.x=-Math.PI/2;ws.renderOrder=2;
 const ct=rep(causticTex,6,2);const uc=add(new THREE.PlaneGeometry(W,8.4),new THREE.MeshBasicMaterial({map:ct,color:C(0x9fd8a0),transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),0,WY-.04,-4.2,tk.group);uc.rotation.x=-Math.PI/2;
 tk.anims.push(t=>{wm.normalMap.offset.set(-t*.04,t*.006);ct.offset.set(-t*.03,t*.02);});
 lilyPads(tk,8,0,-4.5,10.5,2.6,WY+.02,true);lilyPads(tk,18,0,-3.8,11.5,3.4,WY+.015,false);
 for(const [x,z] of[[-8.5,-3.2],[-3,-5.2],[2.2,-2.6],[6.5,-4.6],[10.5,-2.4],[-11,-5.4]]){const h=Math.min(10,(vault(x)-.4)/1.22),r=rnd(.35,.5);treeAt(tk.group,x,.15,z,h,{r,butt:true,leaf:[0x2f6a2a,0x3f7a32,0x1f5a22,0x4a8a3a],n:12});solidSeg(tk,V(x,.2,z),V(x,WY,z),r*1.1);
  for(let i=0;i<6;i++){const vx=x+rnd(-2.2,2.2),vz=z+rnd(-1.2,1.2);add(cylBetween(V(vx,h*.8,vz),V(vx+rnd(-.2,.2),WY+rnd(.2,1.4),vz),.016,.01,4),new THREE.MeshStandardMaterial({color:C(0x3a5a2a),roughness:.8}),0,0,0,tk.group);}}
 for(let i=0;i<7;i++){const x=rnd(-11,11),z=rnd(-10.4,-8.6),y=tk.groundY(x,z);if(y+6<vault(x))palmAt(tk.group,x,y,z,Math.min(5,vault(x)-y-1.5));}
 for(let i=0;i<14;i++){const x=rnd(-12,12),z=rnd(-10,-8.4);bigLeaves(tk.group,x,tk.groundY(x,z),z,rnd(.8,1.5),[0x2f7a32,0x3a8a3a,0x255a28][i%3],8,i%2===0);}
 const dw=mat(tk,0x3a2c1e,{roughness:.9,normalMap:rep(scaleN,2,8)});
 for(let i=0;i<9;i++){const x=rnd(-11,11),z=rnd(-5.5,-1.5),a=V(x,tk.groundY(x,z)+.05,z),b=V(x+rnd(-2,2),rnd(1.2,3.6),z+rnd(-1.2,-.2));add(cylBetween(a,b,.1,.05,8),dw,0,0,0,tk.group);solidSeg(tk,a,b,.1);}
 for(let i=0;i<30;i++){const x=rnd(-12,12),z=rnd(-5.9,-4);grass(tk,x,tk.groundY(x,z),z,rnd(.5,1.4),[0x3f8a3a,0x2f6a2a][i%2],8,.014);}
 for(let i=0;i<10;i++){const x=rnd(-11,11),z=rnd(-5,-1);rock(tk,x,tk.groundY(x,z),z,rnd(.15,.35),0x5a5040,.7);}
 const wfx=3.5;const wf=add(new THREE.PlaneGeometry(3.2,5.4,1,8),new THREE.MeshBasicMaterial({map:waterfallTex,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}),wfx,WY+2.6,-8.9,tk.group);wf.rotation.x=-.28;
 const wt=wf.material.map;wt.repeat.set(1,2);const foam=add(new THREE.CircleGeometry(1.8,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}),wfx,WY+.03,-7.9,tk.group);foam.rotation.x=-Math.PI/2;
 for(let i=0;i<6;i++)glow(wfx+rnd(-1.4,1.4),WY+rnd(.2,1.4),-7.9+rnd(-.6,.6),rnd(1.5,2.6),0xffffff,.22,tk.group);
 tk.anims.push(t=>{wt.offset.y=t*1.4;foam.material.opacity=.3+.08*Math.sin(t*6);});
 const rays=[];for(let i=0;i<10;i++){const r=add(new THREE.PlaneGeometry(rnd(.8,1.8),WY),new THREE.MeshBasicMaterial({map:rayTex,color:C(0xd8f0b0),transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),rnd(-11,11),WY/2,rnd(-5.5,-1),tk.group);r.rotation.set(0,rnd(-.4,.4),rnd(-.25,.25));r.userData={ph:rnd(0,6)};rays.push(r);}
 tk.anims.push(t=>rays.forEach(r=>r.material.opacity=.07+.04*Math.sin(t*.4+r.userData.ph)));
 const dn=70,dp=new Float32Array(dn*3);for(let i=0;i<dn;i++){dp[i*3]=rnd(-12,12);dp[i*3+1]=WY+.012;dp[i*3+2]=rnd(-7,-.5);}const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
 tk.group.add(new THREE.Points(dg,new THREE.PointsMaterial({color:C(0x8a7a50),size:.06,transparent:true,opacity:.8})));tk.anims.push((t,dt)=>{for(let i=0;i<dn;i++){dp[i*3]-=dt*.2;if(dp[i*3]<-12.5)dp[i*3]=12.5;}dg.attributes.position.needsUpdate=true;});
 const GH=5.4;const gl=add(new THREE.PlaneGeometry(W,GH),glassM,0,GH/2,0,tk.group);gl.renderOrder=5;box(W+.3,.18,.18,frameM,0,GH+.09,0,tk.group);box(W+.3,.15,.35,frameM,0,.07,0,tk.group);for(const sx of[-1,1])box(.3,GH+.2,.35,frameM,sx*13.05,GH/2,0,tk.group);
 for(let x=-9.75;x<=9.75;x+=6.5)box(.08,GH,.08,frameM,x,GH/2,.02,tk.group);
 const sg=add(new THREE.PlaneGeometry(5,.85),new THREE.MeshBasicMaterial({map:vText([['亞 馬 遜 河',64,.42],['AMAZON FLOODED FOREST',28,.83,'#bfe8a0']],640,112,'#14261a','#f2efe2')}),0,GH+.6,.05,tk.group);sg.rotation.y=Math.PI;
 tk.box=RB([-12.3,.5,-5.8],[12.3,4.3,-.4]);tk.foodCfg={at:V(0,WY,-3),sp:V(7,.02,1.8),n:260,size:.014,col:0xb87a40,sink:.1,name:'沉底飼料'};};

/* ---------- 戶外池塘 ---------- */
DECO.pond=function(tk){const W=tk.W,D=tk.D;tk.waterY=-.02;
 tk.groundY=(x,z)=>{const d=Math.hypot(x/(W/2),z/(D/2));return d<1?-1+.95*Math.pow(d,3.2)+.03*nz(x*3,0,z*3):-.05;};
 floorPlane(tk,W+.6,D+.6,0,0,0x5a5a48,0x3a3a2e,{res:6,caus:0x3a5a4a,rep:[3,2]});
 for(let i=0;i<40;i++){const a=i/40*6.28;rock(tk,Math.cos(a)*(W/2+.2),.0,Math.sin(a)*(D/2+.2),rnd(.2,.32),[0x8a8478,0x6f6a60,0x9a948a][i%3],rnd(.45,.7));}
 const wm=new THREE.MeshPhysicalMaterial({color:C(0x3a5a48),roughness:.02,transparent:true,opacity:.42,normalMap:rep(scaleN,20,14),normalScale:new THREE.Vector2(.08,.08),envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide});
 const ws=add(new THREE.CircleGeometry(1,72).scale(W/2+.05,D/2+.05,1),wm,0,-.02,0,tk.group);ws.rotation.x=-Math.PI/2;ws.renderOrder=2;tk.anims.push(t=>wm.normalMap.offset.set(t*.01,t*.008));
 lilyPads(tk,16,0,0,W*.38,D*.35,-.012,false);
 for(let i=0;i<14;i++){const a=rnd(0,6.28),x=Math.cos(a)*W*.47,z=Math.sin(a)*D*.47;grass(tk,x,tk.groundY(x,z),z,rnd(.6,1.1),0x5a7a3a,9,.008);}
 const lg=add(new THREE.CylinderGeometry(.14,.12,1.6,12).rotateZ(Math.PI/2+.12),mat(tk,0x5a4632,{roughness:.9,normalMap:rep(scaleN,2,6)}),W*.22,-.02,-D*.12,tk.group);lg.rotation.y=.4;tk.log=V(W*.22,.13,-D*.12);
 tk.box=RB([-W/2+.8,-.85,-D/2+.6],[W/2-.8,-.12,D/2-.6]);tk.foodCfg={at:V(0,0,0),sp:V(1.2,.01,.8),n:120,size:.015,col:0xc89040,sink:.025,name:'錦鯉飼料'};};

/* ---------- 戶外陸龜放養區 ---------- */
DECO.yard=function(tk){const W=tk.W,D=tk.D,mx=W*.25,mz=D*.2;
 tk.groundY=(x,z)=>{let y=.02+.03*nz(x*1.5,0,z*1.5);const md=Math.hypot(x-mx,z-mz);if(md<.7)y-=.06*(1-md/.7);return y;};
 floorPlane(tk,W,D,0,0,0x7a9a4a,0x5a7a34,{tint:(c,x,z)=>{const md=Math.hypot(x-mx,z-mz);if(md<.8)c.lerp(C(0x5a4030),clamp(1-md/.8,0,1));if(nz(x*2,2,z*2)>.4)c.lerp(C(0x9a7a50),.6);},res:6,nrm:3});
 const st=new THREE.MeshStandardMaterial({color:C(0x9a8e7a),roughness:.85,normalMap:rep(scaleN,8,2),normalScale:new THREE.Vector2(.8,.8)});
 box(W+.5,.7,.25,st,0,.35,-D/2-.12,tk.group);box(W+.5,.7,.25,st,0,.35,D/2+.12,tk.group);box(.25,.7,D,st,-W/2-.12,.35,0,tk.group);box(.25,.7,D,st,W/2+.12,.35,0,tk.group);
 const wd=new THREE.MeshStandardMaterial({color:C(0x7a5a3a),roughness:.8}),hx=-W*.3,hz=-D*.25;solid(tk,hx,0,hz,.85,.8);solid(tk,W*.35,0,-D*.32,.55,.3);box(1.6,.06,1.2,wd,hx,.75,hz,tk.group).rotation.z=.18;box(.06,.7,1.2,wd,hx-.75,.35,hz,tk.group);box(1.5,.7,.06,wd,hx,.35,hz-.57,tk.group);
 box(1,.25,.45,new THREE.MeshStandardMaterial({color:C(0x8a8a8a),roughness:.4,metalness:.3}),W*.35,.12,-D*.32,tk.group);const wsf=add(new THREE.PlaneGeometry(.9,.36),new THREE.MeshStandardMaterial({color:C(0x6a8a9a),roughness:.05}),W*.35,.24,-D*.32,tk.group);wsf.rotation.x=-Math.PI/2;
 for(let i=0;i<5;i++){const x=rnd(-W/2+.6,W/2-.6),z=rnd(-D/2+.6,D/2-.6);rock(tk,x,.05,z,rnd(.15,.3),0x8a7e6a,.7);}
 for(let i=0;i<6;i++){const a=i/6*6.28;bigLeaves(tk.group,Math.cos(a)*W*.44,.02,Math.sin(a)*D*.42,rnd(.4,.7),0x4a7a32,6);}
 const hay=add(new THREE.SphereGeometry(.4,12,8,0,6.28,0,1.4),new THREE.MeshStandardMaterial({color:C(0xd8c070),roughness:1}),hx+.1,0,hz+.1,tk.group);hay.scale.y=.35;
 tk.walk=RB([-W/2+.45,0,-D/2+.45],[W/2-.45,1,D/2-.45]);tk.feedSpot=V(0,0,D*.15);tk.hide=V(hx+.9,0,hz+.5);};

/* =================================================================
   世界：戶外庭園、溫室
   ================================================================= */
(function outdoor(){
 const skyT=ctex(16,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#3d7fd0');g.addColorStop(.42,'#a8d0f0');g.addColorStop(.5,'#e8f0f4');g.addColorStop(.52,'#8aa070');g.addColorStop(1,'#4a5a3a');x.fillStyle=g;x.fillRect(0,0,w,h);});
 const sky=add(new THREE.SphereGeometry(150,32,16),new THREE.MeshBasicMaterial({map:skyT,side:THREE.BackSide,depthWrite:false,fog:false}),0,0,60);sky.renderOrder=-1;window.__sky=sky;
 const sun=glow(90,95,150,40,0xfff2d0,.9);
 const grassT=ctex(256,256,(x,w,h)=>{x.fillStyle='#4f7a32';x.fillRect(0,0,w,h);for(let i=0;i<3000;i++){x.fillStyle=`hsla(${rnd(80,110)},${rnd(30,50)}%,${rnd(22,42)}%,.55)`;x.fillRect(rnd(0,w),rnd(0,h),1.5,rnd(3,7));}});grassT.wrapS=grassT.wrapT=THREE.RepeatWrapping;grassT.repeat.set(30,24);
 const gsh=new THREE.Shape();gsh.moveTo(-45,-38);gsh.lineTo(45,-38);gsh.lineTo(45,-102);gsh.lineTo(-45,-102);gsh.lineTo(-45,-38);const hole=new THREE.Path();hole.absellipse(-16,-48,4.85,3.35,0,Math.PI*2,true);gsh.holes.push(hole);const h2=new THREE.Path();h2.moveTo(-18,-56);h2.lineTo(-18,-88);h2.lineTo(18,-88);h2.lineTo(18,-56);h2.lineTo(-18,-56);gsh.holes.push(h2);
 const gt2=grassT.clone();gt2.needsUpdate=true;gt2.wrapS=gt2.wrapT=THREE.RepeatWrapping;gt2.repeat.set(1/3,1/3);const gr=add(new THREE.ShapeGeometry(gsh,48),new THREE.MeshStandardMaterial({map:gt2,roughness:1}),0,-.01,0);gr.rotation.x=-Math.PI/2;
 const pathM=new THREE.MeshStandardMaterial({map:rep(slateTex,1,6),roughness:.7,color:C(0xc8c0b0)});
 const path=(x,z,w,d,ry=0)=>{const p=add(new THREE.PlaneGeometry(w,d),pathM,x,0,z);p.rotation.set(-Math.PI/2,0,ry);};
 path(0,48,4,16);path(-8,48,12,2.2,Math.PI/2);path(8,48,12,2.2,Math.PI/2);path(0,72,3,32);
 const hedge=new THREE.MeshStandardMaterial({color:C(0x2f5a2a),roughness:1,normalMap:rep(scaleN,20,2),normalScale:new THREE.Vector2(2,2)});
 box(.9,2.4,60,hedge,-39.5,1.2,70);box(.9,2.4,60,hedge,39.5,1.2,70);box(80,2.4,.9,hedge,0,1.2,99.5);box(25.5,2.4,.9,hedge,-27,1.2,40.4);box(25.5,2.4,.9,hedge,27,1.2,40.4);
 const fac=add(new THREE.PlaneGeometry(9,1.6),new THREE.MeshBasicMaterial({map:vText([['生 態 館',110,.42],['ECOLOGY HALL',40,.83,'#9fd8ff']],1024,192,'#0b1a24','#f4efe2')}),0,7.4,40.32);
 const stone=new THREE.MeshStandardMaterial({color:C(0xb8ae9c),roughness:.8});
 box(.3,8,16.6,stone,41.35,4,28);box(26.9,8,.3,stone,28,4,19.65);box(26.9,8,.3,stone,28,4,36.35);
 const trees=[[-34,58],[-26,66],[-33,76],[-28,90],[-22,95],[27,68],[33,80],[26,92],[21,96],[-6,96],[8,95]];
 window.__treeObst=[];for(const [x,z] of trees){treeAt(scene,x,0,z,rnd(5,8),{r:.32,n:10});window.__treeObst.push([x-.6,x+.6,z-.6,z+.6]);}
 const lampM=new THREE.MeshStandardMaterial({color:C(0x222222),metalness:.6,roughness:.4});window.__lamps=[];
 for(const [x,z] of[[-2.6,44],[2.6,44],[-2.6,52],[2.6,52],[-2.2,60],[2.2,60]]){add(new THREE.CylinderGeometry(.05,.07,3,8),lampM,x,1.5,z);add(new THREE.SphereGeometry(.16,12,10),new THREE.MeshBasicMaterial({color:C(0xfff0d0)}),x,3.05,z);window.__lamps.push(glow(x,3.05,z,1.6,0xffe0a0,.8));}
 const bm=new THREE.MeshStandardMaterial({color:C(0x6a4a30),roughness:.6});for(const [x,z,r] of[[-9,52.5,0],[9,52.5,0],[-24,48,Math.PI/2],[24,48,Math.PI/2]]){const b=box(1.8,.08,.5,bm,x,.45,z);b.rotation.y=r;}
 /* ===== 熱帶溫室 x -18..18, z 56..88 ===== */
 const iron=new THREE.MeshStandardMaterial({color:C(0xf0f0ea),roughness:.4,metalness:.3});
 const gm=new THREE.MeshPhysicalMaterial({color:C(0xe8f6ff),transparent:true,opacity:.12,roughness:.08,envMapIntensity:1.4,depthWrite:false,side:THREE.DoubleSide});
 const gf=add(new THREE.PlaneGeometry(36,32),new THREE.MeshStandardMaterial({color:C(0x3a2e22),roughness:1,map:grassT}),0,.005,72);gf.rotation.x=-Math.PI/2;gf.material.color=C(0x6a5a40);window.__ghFloor=gf;
 {const pp=add(new THREE.PlaneGeometry(3,20),pathM,0,.012,66);pp.rotation.x=-Math.PI/2;window.__ghPath=pp;}
 const wall=(x,z,w,ry,door)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);
  if(door){for(const s of[-1,1]){const p=add(new THREE.PlaneGeometry(w/2-2,5),gm,s*(w/4+1),2.5,0,g);p.renderOrder=5;}const p=add(new THREE.PlaneGeometry(4,1.5),gm,0,4.25,0,g);p.renderOrder=5;}
  else{const p=add(new THREE.PlaneGeometry(w,5),gm,0,2.5,0,g);p.renderOrder=5;}
  for(let u=-w/2;u<=w/2+.01;u+=2){if(door&&Math.abs(u)<1.9)continue;box(.08,5,.08,iron,u,2.5,0,g);}box(w,.1,.1,iron,0,5,0,g);box(w,.1,.1,iron,0,2.5,0,g);box(w,.25,.2,iron,0,.12,0,g);};
 wall(0,56,36,0,true);wall(0,88,36,0,false);wall(-18,72,32,Math.PI/2,false);wall(18,72,32,Math.PI/2,false);
 const vault=new THREE.CylinderGeometry(18,18,32,72,1,true,Math.PI/2,Math.PI);vault.rotateX(Math.PI/2);vault.scale(1,7/18,1);const vm=add(vault,gm,0,5,72);vm.renderOrder=5;
 for(let z=56;z<=88;z+=4){const rib=new THREE.TorusGeometry(18,.09,6,72,Math.PI);rib.scale(1,7/18,1);add(rib,iron,0,5,z);}
 for(const a of[.12,.28,.42,.58,.72,.88]){const t=a*Math.PI;box(.08,.08,32,iron,18*Math.cos(t),5+7*Math.sin(t),72);}
 for(const z of[56,88]){const e=add(new THREE.CircleGeometry(1,48,0,Math.PI).scale(18,7,1),gm,0,5,z);e.renderOrder=5;}
 const gs=add(new THREE.PlaneGeometry(5,.9),new THREE.MeshBasicMaterial({map:vText([['熱 帶 溫 室',70,.42],['TROPICAL GREENHOUSE',30,.83,'#bfe8a0']],800,144,'#14261a','#f2efe2')}),0,5.6,55.9);gs.rotation.y=Math.PI;
 const gs2=add(new THREE.PlaneGeometry(5,.9),gs.material,0,5.6,56.05);
 const beds=[];window.__bedObst=beds.map(([x,z,w,d])=>[x-w/2,x+w/2,z-d/2,z+d/2]);
 const soil=new THREE.MeshStandardMaterial({color:C(0x3a2a1c),roughness:1});const curb=new THREE.MeshStandardMaterial({color:C(0x8a8070),roughness:.8});
 for(const [x,z,w,d] of beds){box(w,.3,d,soil,x,.15,z);box(w+.2,.4,.12,curb,x,.2,z-d/2);box(w+.2,.4,.12,curb,x,.2,z+d/2);box(.12,.4,d,curb,x-w/2,.2,z);box(.12,.4,d,curb,x+w/2,.2,z);
  palmAt(scene,x,.3,z,rnd(5,8));for(let i=0;i<5;i++)bigLeaves(scene,x+rnd(-w/2+.4,w/2-.4),.3,z+rnd(-d/2+.3,d/2-.3),rnd(.7,1.3),[0x2f7a32,0x3a8a3a,0x255a28][i%3],8,i%2===0);}
 for(const [x,z] of[[-16,82],[16,82],[-16,58],[16,58]])palmAt(scene,x,0,z,rnd(7,10));
 for(let i=0;i<24;i++){const x=rnd(-16,16),z=rnd(58,74),y=rnd(8,10.5);add(cylBetween(V(x,y,z),V(x+rnd(-.2,.2),y-rnd(2,4.5),z),.012,.008,4),new THREE.MeshStandardMaterial({color:C(0x3a6a2a),roughness:.8}));}
 const hn=90,hp=new Float32Array(hn*3);for(let i=0;i<hn;i++){hp[i*3]=rnd(-17,17);hp[i*3+1]=rnd(.5,7);hp[i*3+2]=rnd(57,87);}
 const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(hp,3));
 const haze=new THREE.Points(hg,new THREE.PointsMaterial({map:glowTex2,size:3.5,color:C(0xeef6ee),transparent:true,opacity:.07,depthWrite:false}));scene.add(haze);
 globalAnims.push((t,dt)=>{for(let i=0;i<hn;i++){hp[i*3]+=Math.sin(t*.1+i)*dt*.1;hp[i*3+1]+=Math.cos(t*.13+i)*dt*.05;}hg.attributes.position.needsUpdate=true;});
 for(const [x,z] of[[-8,62],[8,62],[-8,74],[8,74]])window.__lamps.push(glow(x,4.6,z,1.4,0xffe0a0,.8));
})();
camera.far=420;camera.updateProjectionMatrix();

/* ---------- 新展位、通行區、快捷 ---------- */
const NEWS=[{id:'rv',sz:'R',wall:V(0,0,0),f:V(0,0,1),ob:null},
 {id:'g1',sz:'M',wall:V(-18,0,64),f:V(1,0,0)},{id:'g2',sz:'M',wall:V(18,0,64),f:V(-1,0,0)},{id:'g3',sz:'S',wall:V(-18,0,79),f:V(1,0,0)},{id:'g4',sz:'S',wall:V(18,0,79),f:V(-1,0,0)},
 {id:'o1',sz:'PD',wall:V(-16,0,48),f:V(0,0,1)},{id:'o2',sz:'PEN',wall:V(16,0,48),f:V(0,0,1)}];
for(const s of NEWS){computeSlot(s);SLOTS.push(s);}
AREAS.push([-3.6,3.6,39.3,40.9],[-38,38,40.7,55.6],[-38,-18.6,40.7,98],[18.6,38,40.7,98],[-38,38,88.6,98],[-17.4,17.4,56.4,87.6],[-1.8,1.8,55.2,56.8]);
OBST.push(...window.__treeObst,...window.__bedObst,[-17.4,-14,80.5,84],[14,17.4,80.5,84],[-17.4,-14,56.4,59.6],[14,17.4,56.4,59.6]);
SPOTS=[['大廳',()=>Object.assign(player,{x:0,z:38.5,yaw:0,pitch:.05})],['水族展廳',()=>Object.assign(player,{x:0,z:9,yaw:0,pitch:0})],['大洋廳',()=>goTo(SLOTS.find(s=>s.id==='x'))],
 ['爬蟲館',()=>Object.assign(player,{x:-17,z:28,yaw:Math.PI/2,pitch:0})],['鯊魚隧道',()=>goTo(SLOTS.find(s=>s.id==='u'))],['戶外庭園',()=>Object.assign(player,{x:0,z:42,yaw:Math.PI,pitch:0})],
 ['熱帶溫室',()=>Object.assign(player,{x:0,z:58,yaw:Math.PI,pitch:.12})],['亞馬遜河',()=>goTo(SLOTS.find(s=>s.id==='rv'))]];
for(const sp of SPOTS){const f=sp[1];sp[1]=()=>{player.y=0;f();};}
