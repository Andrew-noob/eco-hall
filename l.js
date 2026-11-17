/* ===== l.js：隧道內視野修正、隧道盡頭新展廳、台灣溪流館（梯狀溪流缸＋溪流魚） ===== */
const findMesh=(fn)=>{let r=null;scene.traverse(o=>{if(!r&&o.isMesh&&fn(o))r=o;});return r;};
const near3=(o,x,y,z)=>Math.abs(o.position.x-x)<.05&&Math.abs(o.position.y-y)<.05&&Math.abs(o.position.z-z)<.05;
const archShape=(u0,u1,v0,v1,uc,r)=>{const s=new THREE.Shape();s.moveTo(u0,v0);s.lineTo(u1,v0);s.lineTo(u1,v1);s.lineTo(u0,v1);s.lineTo(u0,v0);const h=new THREE.Path();h.moveTo(uc-r,0);h.absarc(uc,0,r,Math.PI,0,true);h.lineTo(uc-r,0);s.holes.push(h);return s;};

/* ---------- 隧道：拿掉擋住出入口的水體端面，改成有拱形開口的牆 ---------- */
const _tun0=DECO.tunnel;DECO.tunnel=function(tk){_tun0(tk);
 const bx=tk.group.children.find(o=>o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters&&o.geometry.parameters.width===26.2);
 if(bx){const inv=new THREE.MeshBasicMaterial({visible:false});bx.material=[inv,inv,bx.material,bx.material,bx.material,bx.material];
  const m=mat(tk,0x1a4a66,{side:THREE.DoubleSide,roughness:1}),g=new THREE.ShapeGeometry(archShape(19.9,36.1,-1.3,7.3,28,2.45),24);
  for(const x of[14.9,41.1]){const w=add(g,m,x,0,0,tk.group);w.rotation.y=-Math.PI/2;}}};
/* 隧道盡頭：開門通往新展廳 */
(function(){const ec=findMesh(o=>o.geometry&&o.geometry.type==='CircleGeometry'&&Math.abs(o.position.x-41)<.05&&Math.abs(o.position.z-28)<.05);if(ec)ec.visible=false;
 const ts=findMesh(o=>o.geometry&&o.geometry.type==='PlaneGeometry'&&Math.abs(o.position.x-40.9)<.05&&Math.abs(o.position.y-1.3)<.05);
 if(ts){ts.position.set(39.6,2.12,28);ts.scale.setScalar(.6);ts.material=new THREE.MeshBasicMaterial({map:vText([['前往新展廳 →',56,.45],['NEW HALL',28,.85,'#9fd8ff']],512,110,'#0b1a24','#f4efe2')});}
 const ew=findMesh(o=>near3(o,41.35,4,28)&&o.geometry.type==='BoxGeometry');let stone=ew?ew.material:new THREE.MeshStandardMaterial({color:C(0x8a8478),roughness:.85});if(ew)ew.parent.remove(ew);
 const wg=new THREE.ExtrudeGeometry(archShape(19.7,36.3,-.3,8,28,2.45),{depth:.3,bevelEnabled:false,curveSegments:24});const w=add(wg,stone,41.5,0,0);w.rotation.y=-Math.PI/2;
 const fr=new THREE.MeshStandardMaterial({color:C(0x1a1e22),metalness:.6,roughness:.35});const rg=add(new THREE.TorusGeometry(2.48,.08,8,48,Math.PI),fr,41.55,0,28);rg.rotation.y=Math.PI/2;
 const RX0=41.5,RX1=53.6,RZ0=19.8,RZ1=36.2,RH=6,cx=(RX0+RX1)/2,cz=(RZ0+RZ1)/2;
 const flM=new THREE.MeshStandardMaterial({color:C(0x2a2c30),roughness:.35,metalness:.2,normalMap:rep(scaleN,20,20),normalScale:new THREE.Vector2(.1,.1)}),wl=new THREE.MeshStandardMaterial({color:C(0xd8d2c6),roughness:.85});
 const fl=add(new THREE.PlaneGeometry(RX1-RX0,RZ1-RZ0),flM,cx,.005,cz);fl.rotation.x=-Math.PI/2;
 box(RX1-RX0,RH,.3,wl,cx,RH/2,RZ0-.15);box(RX1-RX0,RH,.3,wl,cx,RH/2,RZ1+.15);box(.3,RH,RZ1-RZ0+.6,wl,RX1+.15,RH/2,cz);box(RX1-RX0+.3,.25,RZ1-RZ0+.6,new THREE.MeshStandardMaterial({color:C(0x15181c)}),cx,RH+.12,cz);
 for(const [x,z] of[[45,24],[50,24],[45,32],[50,32]]){add(new THREE.CylinderGeometry(.35,.35,.04,24),new THREE.MeshBasicMaterial({color:C(0xfff4e0)}),x,RH-.02,z);}
 const pl=new THREE.PointLight(C(0xfff0dc),1.1,22,1.3);pl.position.set(cx,RH-.6,cz);scene.add(pl);
 const sg=add(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshBasicMaterial({map:vText([['🚧 新展廳',60,.42],['準備中・COMING SOON',26,.82,'#ffd27a']],640,160,'#14181c','#f4efe2')}),RX1-.02,2.6,cz);sg.rotation.y=-Math.PI/2;
 AREAS.push([40.3,41.9,26.5,29.5],[41.6,RX1-.3,RZ0+.3,RZ1-.3]);
 SPOTS.push(['🚧 新展廳',()=>Object.assign(player,{x:43,y:0,z:28,yaw:-Math.PI/2,pitch:0})]);})();

/* ---------- 台灣溪流魚 ---------- */
Object.assign(SP,{
 sakura:{n:'櫻花鉤吻鮭',s:'Oncorhynchus formosanus',z:'全長 30 cm',f:'台灣特有的冰河孑遺魚種，野外只生活在大甲溪上游冰冷的溪水裡，是一級保育類。',hab:'stream',cost:3,hr:.05,tr:[8,17]},
 kuhua:{n:'臺灣鏟頜魚（苦花）',s:'Onychostoma barbatulum',z:'全長 25 cm',f:'用像鏟子的下顎刮食石頭上的藻類，石頭上會留下一道道刮痕。',hab:'stream',cost:2,hr:.05,tr:[12,24]},
 opsari:{n:'粗首馬口鱲',s:'Opsariichthys pachycephalus',z:'全長 15 cm',f:'繁殖期的雄魚會換上藍綠與橘紅的婚姻色，臀鰭也會變大。',hab:'stream',cost:1,hr:.06,tr:[14,28]},
 hemi:{n:'臺灣間爬岩鰍',s:'Hemimyzon formosanus',z:'全長 8 cm',f:'扁平的身體和吸盤般的胸腹鰭，讓牠能貼在急流中的石頭上不被沖走。',hab:'stream',cost:1,hr:.05,tr:[14,26]},
 goby:{n:'明潭吻鰕虎',s:'Rhinogobius candidianus',z:'全長 7 cm',f:'腹鰭癒合成吸盤；雄魚有領域性，會張開背鰭互相威嚇。',hab:'stream',cost:1,hr:.06,tr:[14,28]}});
HT.stream={n:'台灣溪流',sz:['ST'],aqua:true,wc:0x2a5a50,den:.16,deep:.85,d:'梯狀溪床、小瀑布、卵石與蕨類'};
SZ.ST={w:13,d:2.4,h:2.5,base:0,cap:30,n:'溪流缸'};ENVDEF.stream={t:16};BUILD_COST.ST=15000;
Object.assign(PRICE,{sakura:5000,kuhua:400,opsari:250,hemi:300,goby:200});
Object.assign(BR,{sakura:{m:'spawn',n:[1,2],p:.04},kuhua:{m:'spawn',n:[2,3],p:.08},opsari:{m:'spawn',n:[2,3],p:.12},goby:{m:'spawn',n:[2,3],p:.12}});
for(const [k,l] of[['sakura',.3],['kuhua',.25],['opsari',.15],['hemi',.08],['goby',.07]])SP[k].len=l;
function gSakura(){const L=.3,ol=C(0x6a7048),sv=C(0xd8d0c8),pk=C(0xe0a0a0),dk=C(0x34362e),w=C(0xf2efe8),f=C(0x8a8a70);
 return merge([loft(L,fusi(.055,.028,.38,.3,.62),(c,t,a,x)=>{const ca=Math.cos(a);c.copy(ca>.45?ol:ca<-.5?w:sv);if(Math.abs(ca)<.22&&t>.15)c.copy(pk);if(t>.18&&t<.82&&Math.abs(ca)<.5&&Math.sin(t*58)>.55)c.copy(dk);if(ca>.3&&Math.sin(x*260)*Math.sin(a*9)>.8)c.copy(dk);},36,14),
  fin([[.03,.05,0],[-.01,.09,0],[-.05,.05,0]],[f]),fin([[-.09,.03,0],[-.1,.045,0],[-.115,.025,0]],[ol]),fin([[-.06,-.03,0],[-.08,-.06,0],[-.1,-.025,0]],[f]),caudal(-.15,.012,.055,.05,.8,[f]),
  ...pecs(.08,.06,.04,-.03,.02,.04,.02,[f]),...pecs(-.01,-.03,-.05,-.04,.012,.025,.015,[f]),...eyes(.11,.012,.02,.007,C(0x2a2010))]);}
function gKuhua(){const L=.22,ol=C(0x4a5040),sv=C(0xa0a69c),w=C(0xe6e8e0),f=C(0x5a5e50);
 return merge([loft(L,fusi(.042,.024,.36,.3,.6),(c,t,a)=>{const ca=Math.cos(a);c.copy(ca>.4?ol:ca<-.5?w:sv);if(Math.abs(ca-.2)<.06||Math.abs(ca+.15)<.05)c.copy(ol);},32,14),
  fin([[.02,.04,0],[-.01,.075,0],[-.04,.04,0]],[f]),fin([[-.05,-.025,0],[-.07,-.05,0],[-.08,-.02,0]],[f]),caudal(-.11,.01,.05,.045,.75,[f]),...pecs(.05,.035,.015,-.025,.016,.03,.015,[f]),...eyes(.08,.01,.016,.0055,C(0x2a2a1a))]);}
function gOpsari(){const L=.15,bg=C(0x2a6a6a),bl=C(0x3aa0a6),or=C(0xe8907a),w=C(0xf0dcd4),r=C(0xe0502a);
 return merge([loft(L,fusi(.028,.014,.35,.3,.6),(c,t,a)=>{const ca=Math.cos(a);c.copy(ca>.5?bg:ca<-.55?w:(Math.sin(t*70)>0?bl:or));},30,12),
  fin([[.0,.026,0],[-.02,.05,0],[-.04,.024,0]],[bg,r,bg]),fin([[-.02,-.016,0],[-.03,-.055,0],[-.06,-.05,0],[-.06,-.012,0]],[r,or,r,r]),caudal(-.075,.006,.04,.03,.65,[or]),
  ...pecs(.035,.025,.0,-.016,.01,.025,.012,[r]),...eyes(.055,.006,.011,.004,C(0x1a1a1a))]);}
function gHemi(){const L=.08,b=C(0x6a5a3a),y=C(0xc8b070),k=C(0x2a2418);
 const g=[loft(L,t=>{const k2=t<.15?Math.sqrt(t/.15):1-Math.pow((t-.15)/.85,1.3)*.9;return[.005*k2+.0005,.011*k2+.0005,0];},(c,t,a,x,yy,z)=>{c.copy(Math.cos(a)<-.4?y:b);if(Math.cos(a)>0&&Math.sin(x*400)*Math.sin(z*500)>.5)c.copy(k);if(Math.cos(a)>0&&Math.sin(x*700+z*300)>.85)c.copy(y);},24,12)];
 for(const s of[1,-1]){g.push(colorize(fin([[.026,-.002,s*.008],[.028,-.003,s*.028],[.008,-.003,s*.032],[-.004,-.003,s*.012]],[b]),(c,x,yy,z)=>c.copy(Math.sin(z*500)>0?b:y)),fin([[-.006,-.003,s*.008],[-.01,-.003,s*.024],[-.026,-.003,s*.02],[-.022,-.003,s*.007]],[b]));}
 g.push(caudal(-.04,.002,.018,.008,.7,[b]),...eyes(.028,.004,.005,.0018,C(0x111111)));return merge(g);}
function gGoby(){const L=.07,s=C(0xc8b088),r=C(0xa04a2a),k=C(0x3a3026),f=C(0xb8a078);
 return merge([loft(L,fusi(.009,.009,.3,.3,.6),(c,t,a,x)=>{c.copy(Math.cos(a)<-.5?C(0xe8e0d0):s);if(Math.sin(x*600+a*4)>.75)c.copy(r);if(t>.25&&t<.85&&Math.abs(Math.cos(a))<.3&&Math.sin(t*40)>.6)c.copy(k);},24,10),
  fin([[.008,.008,0],[.0,.02,0],[-.006,.008,0]],[f,k,f]),fin([[-.008,.008,0],[-.016,.017,0],[-.026,.007,0]],[f]),caudal(-.033,.004,.014,.012,1,[f,r,f,r,f,r]),...pecs(.016,.01,.004,-.004,.008,.012,.006,[f]),...eyes(.024,.006,.0055,.0022,C(0x1a1a1a))]);}
const WT=1.3,SB=(a,b)=>RB(a,b);
Object.assign(MAKE,{
 sakura:(tk,e)=>new Agent(new THREE.Mesh(gSakura(),cache(tk,'sak',()=>fishMat(tk,{amp:.012,k:20,spd:9,nose:.15,len:.3}))),tk,e,{speed:.16,turn:1.6,pitchMax:.15,reach:.3,box:SB([-7.6,.35,-1.7],[7.6,WT-.15,-.15]),wait:[0,2],nose:.15,eatR:.04,fill:6}),
 kuhua:(tk,e)=>new Agent(new THREE.Mesh(gKuhua(),cache(tk,'kuh',()=>fishMat(tk,{amp:.01,k:24,spd:10,nose:.11,len:.22}))),tk,e,{speed:.14,turn:1.8,pitchMax:.2,reach:.25,box:SB([-7.6,.25,-1.7],[7.6,WT-.2,-.15]),wait:[0,2],nose:.11,eatR:.03,fill:6}),
 opsari:(tk,e)=>new Agent(new THREE.Mesh(gOpsari(),cache(tk,'ops',()=>fishMat(tk,{amp:.006,k:40,spd:14,nose:.075,len:.15}))),tk,e,{speed:.14,turn:2.6,reach:.2,box:SB([-7.6,.4,-1.7],[7.6,WT-.1,-.15]),wait:[0,1],nose:.075,eatR:.02,fill:7}),
 hemi:(tk,e)=>new Agent(new THREE.Mesh(gHemi(),cache(tk,'hem',()=>fishMat(tk,{amp:.002,k:60,spd:6,nose:.04,len:.08}))),tk,e,{speed:.025,turn:2,pitchMax:.05,reach:.15,box:SB([-7.6,.14,-1.7],[7.6,.32,-.15]),wait:[3,9],nose:.04,eatR:.015,fill:8}),
 goby:(tk,e)=>new Agent(new THREE.Mesh(gGoby(),cache(tk,'gob',()=>fishMat(tk,{amp:.003,k:70,spd:10,nose:.035,len:.07}))),tk,e,{speed:.04,turn:3,pitchMax:.05,reach:.15,box:SB([-7.6,.14,-1.7],[7.6,.3,-.15]),wait:[2,6],nose:.035,eatR:.012,fill:8})});

/* ---------- 梯狀溪流缸（由後上方往前下方遞減） ---------- */
DECO.stream=function(tk){const {W,D,H}=tk,g=tk.group;const T1=1.55,T2=2.2,P1=1.85,P2=2.5,Z1=-1.9,Z2=-3.1;
 tk.u.top.value=tk.slot.base+WT;tk.u.depth.value=WT;
 tk.groundY=(x,z)=>z>Z1?.12+.1*clamp(-z/1.9,0,1)+.02*nz(x*3,0,z*3):z>Z2?T1:T2;
 floorPlane(tk,W,1.95,0,-.97,0x8a8070,0x6a6052,{res:6});
 const rk=mat(tk,0x3e3e38,{roughness:.95,normalMap:rep(scaleN,6,3),normalScale:new THREE.Vector2(1.2,1.2)});
 box(W,T1,D+Z1,rk,0,T1/2,(Z1-D)/2,g);box(W,T2-T1,D+Z2,rk,0,(T1+T2)/2,(Z2-D)/2,g);
 box(W,4.8,.12,mat(tk,0x24302a,{roughness:1}),0,2.4,-D-.06,g);for(const s of[-1,1])box(.12,4.8,D,mat(tk,0x24302a,{roughness:1}),s*(W/2+.06),2.4,-D/2,g);
 const rc=[0x5a5850,0x4a4a44,0x6a665c,0x524e46];
 for(let x=-W/2+.4;x<W/2;x+=rnd(.55,.85))rock(tk,x,rnd(.5,1.15),Z1+rnd(-.12,.08),rnd(.42,.68),rc[Math.random()*4|0],rnd(1.1,1.5));
 for(let x=-W/2+.4;x<W/2;x+=rnd(.6,.9))rock(tk,x,T1+rnd(.15,.45),Z2+rnd(-.1,.08),rnd(.3,.5),rc[Math.random()*4|0],rnd(1,1.4));
 for(let i=0;i<34;i++){const x=rnd(-W/2+.3,W/2-.3),z=rnd(Z1+.25,-.25);rock(tk,x,tk.groundY(x,z),z,rnd(.06,.16),[0x9a9488,0x7a7468,0xb0a898,0x6a6458][i%4],.55);}
 for(let i=0;i<8;i++){const x=rnd(-W/2+.4,W/2-.4),z=rnd(Z2+.2,Z1-.2);rock(tk,x,T1,z,rnd(.15,.3),rc[i%4],.7);}
 const wm=(c,o)=>mat(tk,c,Object.assign({transparent:true,opacity:.55,roughness:.08,metalness:.1,emissive:C(0x4a8a80),emissiveIntensity:.25,side:THREE.DoubleSide},o||{}));
 for(const [y,z0,z1] of[[WT,0,Z1],[P1,Z1,Z2],[P2,Z2,-D]]){const p=add(new THREE.PlaneGeometry(W,Math.abs(z1-z0)),wm(0x6fa8a0),0,y,(z0+z1)/2,g);p.rotation.x=-Math.PI/2;}
 const wt=waterfallTex.clone();wt.needsUpdate=true;wt.wrapS=wt.wrapT=THREE.RepeatWrapping;const wfm=new THREE.MeshBasicMaterial({map:wt,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide});
 const fall=(x,z,y0,y1,w)=>{const p=add(new THREE.PlaneGeometry(w,y1-y0,1,4),wfm,x,(y0+y1)/2,z,g);p.renderOrder=6;const fo=add(new THREE.CircleGeometry(w*.7,16),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,depthWrite:false}),x,y0+.01,z+.18,g);fo.rotation.x=-Math.PI/2;fo.scale.y=.5;};
 for(const [x,w] of[[-5.2,.7],[.8,.5],[5.6,.9]])fall(x,Z1+.12,WT,P1+.02,w);for(const [x,w] of[[-2.6,.6],[3.4,.8]])fall(x,Z2+.1,P1,P2+.02,w);fall(-6.6,-D+.1,P2,3.6,.7);
 tk.anims.push((t,dt)=>{wt.offset.y-=dt*1.4;});
 const moss=[];for(let i=0;i<420;i++){const z=i%2?rnd(Z2,Z1):rnd(-D,Z2),x=rnd(-W/2,W/2),y=tk.groundY(x,z);moss.push(prim(new THREE.SphereGeometry(rnd(.03,.07),6,4).scale(1,.5,1).translate(x,y+.01,z),C([0x4a7a32,0x5a8a3a,0x3a6a2a][i%3])));}
 add(merge(moss),mat(tk,0xffffff,{vertexColors:true,roughness:.9}),0,0,0,g);
 for(let i=0;i<16;i++){const x=rnd(-W/2+.4,W/2-.4),hi=i%2,z=hi?rnd(-D+.2,Z2-.15):rnd(Z2+.15,Z1-.25);bigLeaves(g,x,tk.groundY(x,z),z,rnd(.35,.7),[0x2f7a32,0x3a8a3a,0x4a9a3a,0x2a6a2a][i%4],7,i%3===0);}
 for(const [x,z,h] of[[-4.2,-3.8,2.2],[2.2,-3.9,2.6],[6.6,-3.7,2]])treeAt(g,x,T2,z,h,{r:.08,n:7});
 const dw=mat(tk,0x5a4a38,{roughness:.9});add(cylBetween(V(-7.5,T1+.1,-2.4),V(-3.5,.45,-1.2),.09,.06,9),dw,0,0,0,g);
 const gl=add(new THREE.PlaneGeometry(W,H),glassM,0,H/2,0,g);gl.renderOrder=5;for(const s of[-1,1])box(.05,H,.06,frameM,s*W/2,H/2,0,g);box(W+.1,.06,.08,frameM,0,H,0,g);box(W+.1,.08,.08,frameM,0,0,0,g);
 for(const x of[-4,0,4])box(.03,H,.04,frameM,x,H/2,0,g);
 tk.box=new THREE.Box3(V(-W/2+.3,.2,Z1+.2),V(W/2-.3,WT-.1,-.12));
 tk.foodCfg={at:V(0,WT-.03,-.9),sp:V(5,.02,.6),n:120,size:.012,col:0xc89060,sink:.06,name:'溪流飼料'};};

/* ---------- 溪流館房間（大洋廳西側開門） ---------- */
(function(){const ow=findMesh(o=>near3(o,-16.1,5,-10)&&o.geometry.type==='BoxGeometry');const wm=ow?ow.material:new THREE.MeshStandardMaterial({color:C(0x0c1a24),roughness:.9});if(ow)ow.parent.remove(ow);
 box(.2,10,6.7,wm,-16.1,5,-16.65);box(.2,10,10.7,wm,-16.1,5,-5.35);box(.2,6.8,2.6,wm,-16.1,6.6,-12);
 const fr=new THREE.MeshStandardMaterial({color:C(0x2a2622),metalness:.5,roughness:.4});box(.3,3.2,.12,fr,-16.1,1.6,-13.35);box(.3,3.2,.12,fr,-16.1,1.6,-10.65);box(.3,.14,2.82,fr,-16.1,3.2,-12);
 const sg=add(new THREE.PlaneGeometry(2.6,.62),new THREE.MeshBasicMaterial({map:vText([['🏞 台灣溪流館',56,.45],['TAIWAN STREAM',24,.84,'#b8e0c8']],620,150,'#121a14','#f2eee2')}),-15.98,3.75,-12);sg.rotation.y=Math.PI/2;
 const X0=-38.2,X1=-16.2,Z0=-22.2,Z1=-.2,RH=6,cx=(X0+X1)/2,cz=(Z0+Z1)/2;
 const dark=new THREE.MeshStandardMaterial({color:C(0x15161a),roughness:.9}),flM=new THREE.MeshStandardMaterial({color:C(0x2c2622),roughness:.45,metalness:.1,normalMap:rep(scaleN,40,40),normalScale:new THREE.Vector2(.25,.25)});
 const fl=add(new THREE.PlaneGeometry(X1-X0,Z1-Z0),flM,cx,.004,cz);fl.rotation.x=-Math.PI/2;
 box(X1-X0,RH,.3,dark,cx,RH/2,Z0-.15);box(X1-X0,RH,.3,dark,cx,RH/2,Z1+.15);box(.3,RH,Z1-Z0+.6,dark,X0-.15,RH/2,cz);box(X1-X0+.3,.25,Z1-Z0+.6,new THREE.MeshStandardMaterial({color:C(0x0c0d10)}),cx,RH+.12,cz);
 for(let i=0;i<6;i++)box(X1-X0,.35,.5,new THREE.MeshStandardMaterial({color:C(0x1e1c1a),roughness:.7}),cx,RH-.2,Z0+2+i*3.6);
 const pts=[];const cv=new THREE.CurvePath();const P=(x,z)=>V(x,.07,z);cv.add(new THREE.LineCurve3(P(-22.6,-18.6),P(-32.4,-18.6)));cv.add(new THREE.QuadraticBezierCurve3(P(-32.4,-18.6),P(-34.6,-18.6),P(-34.6,-16.4)));
 cv.add(new THREE.LineCurve3(P(-34.6,-16.4),P(-34.6,-6)));cv.add(new THREE.QuadraticBezierCurve3(P(-34.6,-6),P(-34.6,-3.8),P(-32.4,-3.8)));cv.add(new THREE.LineCurve3(P(-32.4,-3.8),P(-23.6,-3.8)));
 add(new THREE.TubeGeometry(cv,160,.07,8),new THREE.MeshStandardMaterial({color:C(0xd8b070),emissive:C(0xffc070),emissiveIntensity:.9,roughness:.4}));
 for(const [x,z,tx,tz] of[[-31,-15,-36.8,-14],[-31,-7,-36.8,-8],[-27,-16.5,-27,-21],[-27,-5.5,-27,-1.4]]){const s=new THREE.SpotLight(C(0xfff2dc),1.4,14,.6,.6,1.2);s.position.set(x,RH-.3,z);s.target.position.set(tx,1.4,tz);scene.add(s,s.target);add(new THREE.CylinderGeometry(.12,.12,.06,12),new THREE.MeshBasicMaterial({color:C(0xfff2dc)}),x,RH-.05,z);}
 const amb=new THREE.PointLight(C(0xc8d8ff),.35,30,1.5);amb.position.set(-24,4,-11);scene.add(amb);
 AREAS.push([-16.6,-15.4,-13.1,-10.9],[X0+.3,X1-.2,Z0+.3,Z1-.3]);
 const s={id:'s1',sz:'ST',wall:V(-27.2,0,-11.2),f:V(0,0,1)};computeSlot(s);Object.assign(s,{origin:V(-27.2,0,-11.2),rot:0,base:0,obst:null,view:V(-27.2,0,-11.2),vr:12});SLOTS.push(s);
 OBST.push([-35.8,-22.4,-22.2,-19.75],[-38.2,-35.75,-22.2,-.2],[-35.8,-22.4,-2.65,-.2],[-22.4,-19.45,-3.45,-.2]);
 SPOTS.push(['🏞 台灣溪流館',()=>Object.assign(player,{x:-28.5,y:0,z:-11,yaw:Math.PI/2,pitch:-.05})]);})();
