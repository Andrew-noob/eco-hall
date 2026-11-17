/* ===== n.js：大洋水面透視、溪流缸精修、三個傳送釣場（海釣／溪釣／湖釣） ===== */

/* ---------- 大洋水槽：從上方看得到水裡 ---------- */
const _oc0=DECO.ocean;DECO.ocean=function(tk){_oc0(tk);for(const o of tk.group.children){const p=o.geometry&&o.geometry.parameters;if(o.geometry&&o.geometry.type==='PlaneGeometry'&&p&&p.width===30&&p.height===14){o.material.transparent=true;o.material.opacity=.38;o.material.depthWrite=false;o.material.emissiveIntensity=.6;o.renderOrder=7;}}};

/* ---------- 溪流缸精修 ---------- */
const _st1=DECO.stream;DECO.stream=function(tk){_st1(tk);const g=tk.group,P=tk.pools||[];
 const gm2=mat(tk,0xffffff,{vertexColors:true,roughness:.9}),pc=[0x8a7a62,0x6e6252,0xa89880,0x5a5046,0xb8ac94];
 const grav=[];P.forEach((p,i)=>{const W=p.max.x-p.min.x+.36,D=p.max.z-p.min.z+.36,cx=(p.min.x+p.max.x)/2,cz=(p.min.z+p.max.z)/2;
  for(let k=0;k<Math.round(W*D*120);k++){const x=cx+rnd(-W/2,W/2),z=cz+rnd(-D/2,D/2);grav.push(prim(new THREE.SphereGeometry(rnd(.012,.03),5,3).scale(1,.55,1).translate(x,p.b+.008,z),C(pc[k%5])));}});
 add(merge(grav),gm2,0,0,0,g);
 /* 貼著玻璃的半埋石，讓剖面像真的溪床 */
 const side=i=>i<6?'A':i<14?'B':i<20?'C':'D';
 P.forEach((p,i)=>{const s=side(i),n=s==='D'?3:5;for(let k=0;k<n;k++){let x,z;if(s==='A'){x=rnd(p.min.x,p.max.x);z=-8.82;}else if(s==='B'){x=-8.82;z=rnd(p.min.z,p.max.z);}else if(s==='C'){x=rnd(p.min.x,p.max.x);z=8.82;}else{x=rnd(p.min.x,p.max.x);z=rnd(p.min.z,p.max.z);}
   rock(tk,x,p.b-rnd(.05,.2),z,rnd(.14,.3),[0x7a7468,0x6a6458,0x8a8476][k%3],.8);}
  for(let k=0;k<3;k++){const x=rnd(p.min.x,p.max.x),z=rnd(p.min.z,p.max.z);grass(tk,x,p.b,z,rnd(.15,.32),[0x4a8a3a,0x3a7a32,0x6a9a3a][k],9,.008);}
  for(let k=0;k<2;k++){const lf=add(new THREE.CircleGeometry(rnd(.03,.05),8),new THREE.MeshStandardMaterial({color:C([0xd8a03a,0xb8602a,0x8a7a3a][k%3]),roughness:.7,side:THREE.DoubleSide}),rnd(p.min.x,p.max.x),p.w+.006,rnd(p.min.z,p.max.z),g);lf.rotation.x=-Math.PI/2;lf.scale.y=.55;
   tk.anims.push((t,dt)=>{lf.position.x+=Math.sin(t*.3+k)*dt*.02;lf.position.z+=Math.cos(t*.27+k)*dt*.02;lf.position.x=clamp(lf.position.x,p.min.x,p.max.x);lf.position.z=clamp(lf.position.z,p.min.z,p.max.z);});}});
 /* 後側岩壁：疊石、青苔、蕨類、垂藤 */
 const mossM=mat(tk,0x4a7a32,{roughness:1}),wallRocks=(pts)=>{for(const [x,z,y0] of pts){let y=y0;while(y<3.7){const s=rnd(.35,.6);rock(tk,x+rnd(-.12,.12),y,z+rnd(-.12,.12),s,[0x5a5850,0x4e4c44,0x66625a][Math.random()*3|0],1.15);
   if(Math.random()<.55)add(new THREE.SphereGeometry(s*.75,10,6).scale(1,.28,1),mossM,x,y+s*.9,z,g);if(Math.random()<.3)bigLeaves(g,x,y+s*.8,z,rnd(.25,.45),[0x2f7a32,0x3a8a3a][Math.random()*2|0],6,Math.random()<.4);y+=s*1.25;}
  if(Math.random()<.35){const L=rnd(.6,1.4);add(new THREE.CylinderGeometry(.008,.004,L,4),mossM,x,3.6-L/2,z+(z<0?.3:-.3),g);}}};
 const pa=[],pb=[],pcc=[];for(let x=-8.6;x<4.7;x+=.55)pa.push([x,-10.85,P[Math.min(5,Math.floor((4.7-x)/13.3*6))].w-.25]);for(let z=-11;z<11;z+=.55)pb.push([-10.85,z,P[6+Math.min(7,Math.floor((z+11)/22*8))].w-.25]);
 for(let x=-8.6;x<4.7;x+=.55)pcc.push([x,10.85,P[14+Math.min(5,Math.floor((x+8.6)/13.3*6))].w-.25]);wallRocks(pa);wallRocks(pb);wallRocks(pcc);
 /* 水面波光 */
 const ct=causticTex.clone();ct.needsUpdate=true;ct.wrapS=ct.wrapT=THREE.RepeatWrapping;ct.repeat.set(3,3);let sm=null;g.children.forEach(o=>{if(o.renderOrder===4&&o.material&&o.material.transparent){sm=o.material;}});if(sm){sm.emissiveMap=ct;sm.emissiveIntensity=.55;sm.needsUpdate=true;}
 /* 瀑布水花 */
 const sp=[];for(const [x,z,y0,y1,w,ry] of(tk.falls||[])){const n=26,pos=new Float32Array(n*3),ph=[];const l=SL(x,y0,z);for(let k=0;k<n;k++){const u=rnd(-w/2,w/2);ph.push([u,rnd(0,6.28),rnd(.05,.2)]);}
  const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(ge,new THREE.PointsMaterial({color:0xf4fbff,size:.03,transparent:true,opacity:.75,depthWrite:false}));pts.frustumCulled=false;g.add(pts);sp.push({pts,pos,ph,l,ry});}
 tk.anims.push((t,dt)=>{ct.offset.x+=dt*.03;ct.offset.y+=dt*.02;for(const s of sp){const c=Math.cos(s.ry),sn=Math.sin(s.ry);for(let k=0;k<s.ph.length;k++){const [u,p,h]=s.ph[k],a=(t*3+p)%3.14;s.pos[k*3]=s.l.x+u*c+Math.cos(p*3)*.06;s.pos[k*3+1]=s.l.y+Math.sin(a)*h;s.pos[k*3+2]=s.l.z-u*sn+Math.sin(p*5)*.08;}s.pts.geometry.attributes.position.needsUpdate=true;}});};
/* 房間光束 */
(function(){const bm=new THREE.MeshBasicMaterial({color:0xfff2d8,transparent:true,opacity:.05,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 for(const [a,b] of[[[-31,6,-15],[-36.8,1.4,-14]],[[-31,6,-7],[-36.8,1.4,-8]],[[-27,6,-16.5],[-27,1.4,-21]],[[-27,6,-5.5],[-27,1.4,-1.4]]]){const A=V(...a),B=V(...b),L=A.distanceTo(B);const cg=new THREE.ConeGeometry(1.1,L,20,1,true);cg.translate(0,-L/2,0);const m=add(cg,bm,A.x,A.y,A.z);m.quaternion.setFromUnitVectors(V(0,-1,0),B.clone().sub(A).normalize());}})();

/* ---------- 三個釣場（只能傳送） ---------- */
const addSky=(m,x,y,z)=>{const s=add(new THREE.SphereGeometry(380,32,16),m,x,y,z);s.renderOrder=-1;return s;};
const skyM=(top,mid,bot)=>new THREE.MeshBasicMaterial({map:ctex(4,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(.48,mid);g.addColorStop(.52,bot);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,w,h);}),side:THREE.BackSide,fog:false,depthWrite:false});
const FW={
 sea:{n:'🌊 海釣',d:'搭船出海，釣礁岩魚、石斑，運氣好會有黑鰭鯊',C:V(0,0,-700),stand:[0,0,-702.3],yaw:0,area:[-.75,.75,-702.9,-699.4],wy:-1.3,dist:[7,13],
  tab:[['puffer',12],['lion',10],['btang',12],['ytang',12],['clown',10],['grouper',5],['shark',2],['junk',8],['coin',5]]},
 stream:{n:'🏞 溪釣',d:'山谷裡的清澈溪流，有苦花、馬口鱲，稀有的櫻花鉤吻鮭',C:V(700,0,0),stand:[700.3,0,0],yaw:-Math.PI/2,area:[699.3,700.9,-1.1,1.1],wy:-.7,dist:[3,6.5],
  tab:[['opsari',26],['kuhua',20],['goby',16],['hemi',12],['sakura',3],['junk',8],['coin',4]]},
 lake:{n:'🏔 湖釣',d:'群山環繞的大湖，木棧橋上釣錦鯉、斑龜，傳說中有銀龍魚',C:V(-700,0,0),stand:[-700,0,-8.2],yaw:0,area:[-700.7,-699.3,-8.8,.8],wy:-.5,dist:[6,12],
  tab:[['koi',16],['goldfish',12],['guppy',10],['betta',6],['loach',8],['pturtle',6],['arowana',2],['junk',10],['coin',5]]}};
const FDIFF2={shark:.14,grouper:.18,sakura:.14,arowana:.14,pturtle:.22,koi:.24,lion:.24,puffer:.26,junk:.42,coin:.3};
const JUNK=['舊雨鞋','空鋁罐','纏住的釣線','一塊漂流木','破掉的水桶'];
let seaGeo=null,seaBase=null;
(function(){const wood=new THREE.MeshStandardMaterial({color:C(0x8a6a48),roughness:.85,normalMap:rep(scaleN,2,8),normalScale:new THREE.Vector2(.5,.5)});
 /* 海 */
 {const c=FW.sea.C;addSky(skyM('#3a78c8','#bcdcf2','#1e4a78'),c.x,0,c.z);
  seaGeo=new THREE.PlaneGeometry(700,700,70,70);seaGeo.rotateX(-Math.PI/2);seaBase=Float32Array.from(seaGeo.attributes.position.array);
  add(seaGeo,new THREE.MeshStandardMaterial({color:C(0x1e5a8a),roughness:.22,metalness:.35,envMapIntensity:1.2}),c.x,-1.3,c.z);
  const boat=new THREE.Group();boat.position.copy(c);scene.add(boat);FW.sea.boat=boat;const hull=new THREE.Group();hull.rotation.y=Math.PI/2;boat.add(hull);
  add(loft(7.2,keyProf([[0,.05,.05],[.12,.6,.55],[.35,.85,1.05],[.7,.85,1.1],[1,.75,1.0]]),(cl,t,a,x,y)=>cl.set(y<-.55?0xb83a2a:y<-.4?0x1a3a6a:0xf2f2ee),40,16),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5}),0,-.55,-.2,hull);
  box(6.4,.08,1.9,wood,-.3,-.04,0,hull);for(const s of[-1,1])box(6.2,.08,.06,new THREE.MeshStandardMaterial({color:C(0xd8d8d8),metalness:.6}),-.3,.5,s*.95,hull);
  for(let x=-3.2;x<=2.8;x+=1)for(const s of[-1,1])box(.04,.5,.04,new THREE.MeshStandardMaterial({color:C(0xd8d8d8),metalness:.6}),x,.25,s*.95,hull);
  box(1.6,1.5,1.7,new THREE.MeshStandardMaterial({color:C(0xf2f2ee),roughness:.5}),-2.3,.75,0,hull);box(1.62,.5,1.72,new THREE.MeshPhysicalMaterial({color:0x2a3a4a,roughness:.05}),-2.3,1.15,0,hull);
  add(new THREE.CylinderGeometry(.03,.03,1.4,6),new THREE.MeshStandardMaterial({color:0x888888}),-2.6,2.2,0,hull);
  for(const [x,z,s] of[[-180,-220,40],[120,-260,55],[260,-80,30],[-240,60,45]])add(new THREE.ConeGeometry(s,s*.5,16),new THREE.MeshStandardMaterial({color:C(0x4a6a3a),roughness:1,flatShading:true}),c.x+x,-1.3+s*.22,c.z+z);}
 /* 溪 */
 {const c=FW.stream.C;addSky(skyM('#5a92c8','#d8e8f0','#3a5a3a'),c.x,0,c.z);
  const gr=new THREE.MeshStandardMaterial({color:C(0x4a6a32),roughness:1});const L=add(new THREE.PlaneGeometry(150,400),gr,c.x-73.5,0,c.z);L.rotation.x=-Math.PI/2;const R=add(new THREE.PlaneGeometry(150,400),gr,c.x+85.5,0,c.z);R.rotation.x=-Math.PI/2;
  const bed=add(new THREE.PlaneGeometry(12,400),new THREE.MeshStandardMaterial({color:C(0x7a6a52),roughness:1}),c.x+6,-1.4,c.z);bed.rotation.x=-Math.PI/2;
  for(const s of[1.5,10.5]){const b=add(new THREE.PlaneGeometry(400,1.4),new THREE.MeshStandardMaterial({color:C(0x6a5a44),side:THREE.DoubleSide}),c.x+s,-.7,c.z);b.rotation.y=Math.PI/2;}
  const wt=causticTex.clone();wt.needsUpdate=true;wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(3,80);FW.stream.wt=wt;
  const wtr=add(new THREE.PlaneGeometry(9,400),new THREE.MeshStandardMaterial({color:C(0x4a8a8a),roughness:.1,metalness:.2,transparent:true,opacity:.72,emissive:C(0x9adad0),emissiveMap:wt,emissiveIntensity:.35}),c.x+6,-.7,c.z);wtr.rotation.x=-Math.PI/2;
  add(new THREE.SphereGeometry(1.6,12,8).scale(1,.62,1),new THREE.MeshStandardMaterial({color:C(0x8a8478),roughness:.9,flatShading:true}),c.x,-1,c.z);
  for(let i=0;i<40;i++){const z=c.z+rnd(-60,60),x=c.x+rnd(2.5,9.5),s=rnd(.3,1.1);add(new THREE.SphereGeometry(s,9,7).scale(1,.6,1),new THREE.MeshStandardMaterial({color:C([0x8a8478,0x6a665c,0x9a948a][i%3]),roughness:.9,flatShading:true}),x,-.9+s*.2,z);}
  for(let i=0;i<30;i++){const z=c.z+rnd(-70,70),x=c.x+(i%2?rnd(-14,-3):rnd(13,24));if(Math.abs(z-c.z)<4&&x<c.x+2)continue;treeAt(scene,x,0,z,rnd(6,11),{r:.3,n:10,leaf:[0x2a5a2a,0x335f2c,0x3e6e32]});}
  for(const [x,z,s] of[[-60,-120,70],[80,-150,90],[-90,90,80],[100,120,70],[0,-200,110]])add(new THREE.ConeGeometry(s,s*1.1,14),new THREE.MeshStandardMaterial({color:C(0x3a5a3a),roughness:1,flatShading:true}),c.x+x,s*.45,c.z+z);
  const wf=add(new THREE.PlaneGeometry(9,3.5),new THREE.MeshBasicMaterial({map:waterfallTex,transparent:true,opacity:.85,depthWrite:false}),c.x+6,1,c.z-28);box(12,3.6,3,new THREE.MeshStandardMaterial({color:C(0x5a564e),roughness:.95}),c.x+6,1.1,c.z-30);}
 /* 湖 */
 {const c=FW.lake.C;addSky(skyM('#6a8ac0','#f2d8b8','#3a4a3a'),c.x,0,c.z);
  const lw=add(new THREE.PlaneGeometry(500,400),new THREE.MeshStandardMaterial({color:C(0x2e5a6a),roughness:.12,metalness:.35,emissive:C(0x0a2a2a),emissiveIntensity:.3}),c.x,-.5,c.z-205);lw.rotation.x=-Math.PI/2;FW.lake.water=lw;
  const sh=add(new THREE.PlaneGeometry(500,200),new THREE.MeshStandardMaterial({color:C(0x5a7a3a),roughness:1}),c.x,0,c.z+95);sh.rotation.x=-Math.PI/2;const sd=add(new THREE.PlaneGeometry(500,4),new THREE.MeshStandardMaterial({color:C(0xb8a880)}),c.x,.01,c.z-3);sd.rotation.x=-Math.PI/2;
  for(let z=1;z>-9;z-=.24)box(1.6,.06,.2,wood,c.x,-.03,c.z+z);for(let z=0;z>-9.5;z-=2.2)for(const s of[-.75,.75])add(new THREE.CylinderGeometry(.07,.07,1.2,8),wood,c.x+s,-.5,c.z+z);
  for(let i=0;i<40;i++){const x=c.x+rnd(-30,30),z=c.z-rnd(2,5);if(Math.abs(x-c.x)<2)continue;for(let k=0;k<4;k++)add(new THREE.CylinderGeometry(.012,.02,rnd(.9,1.6),4),new THREE.MeshStandardMaterial({color:C(0x7a9a4a)}),x+rnd(-.3,.3),.2,z+rnd(-.3,.3));}
  for(let i=0;i<25;i++){const lp=add(new THREE.CircleGeometry(rnd(.3,.5),14,.4,5.6),new THREE.MeshStandardMaterial({color:C(0x4a8a3a),roughness:.6,side:THREE.DoubleSide}),c.x+rnd(-25,25),-.48,c.z-rnd(6,25));lp.rotation.x=-Math.PI/2;}
  for(let i=0;i<24;i++){const x=c.x+rnd(-40,40),z=c.z+rnd(6,40);if(Math.abs(x-c.x)<3)continue;treeAt(scene,x,0,z,rnd(5,9),{r:.3,n:10});}
  box(4,2.6,3.4,new THREE.MeshStandardMaterial({color:C(0x8a6a48),roughness:.85}),c.x+9,1.3,c.z+9);const rf=box(4.6,.15,4.2,new THREE.MeshStandardMaterial({color:C(0x6a3a2a)}),c.x+9,2.75,c.z+9);
  const rb=add(loft(3,keyProf([[0,.02,.02],[.2,.22,.4],[.8,.22,.45],[1,.15,.3]]),cl=>cl.set(0xa86a3a),20,10),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7}),c.x+2.2,-.45,c.z-4);rb.rotation.y=.3;
  for(let i=0;i<14;i++){const a=-Math.PI*.1-i/13*Math.PI*.8,r=rnd(230,280),s=rnd(50,110);add(new THREE.ConeGeometry(s,s*.9,12),new THREE.MeshStandardMaterial({color:C(i%2?0x4a5a6a:0x3a4a5a),roughness:1,flatShading:true}),c.x+Math.cos(a)*r,s*.4-.5,c.z+Math.sin(a)*r);}}
 for(const k in FW){const a=FW[k].area;AREAS.push(a);}})();
