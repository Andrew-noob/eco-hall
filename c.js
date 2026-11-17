/* ===== c.js：博物館、展位、造景、飼養系統、介面、存檔 ===== */
/* ---------- 造景小工具（皆加在水槽的本地群組） ---------- */
function rockGeo(s,seed){const g=new THREE.DodecahedronGeometry(s,1),p=g.attributes.position,v=V(0,0,0);for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.multiplyScalar(1+nz(v.x*4/s+seed,v.y*3/s,v.z*4/s)*.16);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();return g;}
function solid(tk,x,y,z,r,top){(tk.solids=tk.solids||[]).push({x,y,z,r,top:top??y+r});}
function solidSeg(tk,a,b,r){for(let i=0;i<=4;i++){const p=a.clone().lerp(b,i/4);solid(tk,p.x,p.y,p.z,r*1.3,p.y+r);}}
function rock(tk,x,y,z,s,c,sy=1){solid(tk,x,y,z,s*.95,y+s*sy*.85);const m=add(rockGeo(s,rnd(0,9)),mat(tk,c,{roughness:.92,flatShading:true}),x,y,z,tk.group);m.scale.y=sy;m.rotation.y=rnd(0,6);return m;}
function coralBranch(tk,x,y,z,s,c1,c2){const gs=[],a=C(c1),b=C(c2);const rec=(p,dir,len,r,d)=>{const q=p.clone().addScaledVector(dir,len);gs.push(prim(cylBetween(p,q,r,r*.75,7),d>=2?b:a));
  if(d<3){const n=d===0?3:2+(Math.random()<.5?1:0);for(let k=0;k<n;k++)rec(q,dir.clone().add(V(rnd(-.7,.7),rnd(.2,.6),rnd(-.7,.7))).normalize(),len*.72,r*.72,d+1);}else gs.push(prim(new THREE.SphereGeometry(r*1.15,7,5).translate(q.x,q.y,q.z),b));};
 rec(V(0,0,0),V(0,1,0),s*.32,s*.055,0);solid(tk,x,y+s*.3,z,s*.33,y+s*.6);return add(merge(gs),mat(tk,0xffffff,{vertexColors:true,roughness:.65}),x,y,z,tk.group);}
function brain(tk,x,y,z,r,c){const g=new THREE.SphereGeometry(r,40,20,0,Math.PI*2,0,Math.PI*.55),p=g.attributes.position,v=V(0,0,0);
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.multiplyScalar(1+.05*Math.sin(v.x/r*22+Math.sin(v.z/r*9)*2)*Math.sin(v.z/r*20));p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();solid(tk,x,y+r*.25,z,r*.95,y+r*.55);return add(g,mat(tk,c,{roughness:.7}),x,y,z,tk.group);}
function tableCoral(tk,x,y,z,r,c){solid(tk,x,y+r*.52,z,r*.8,y+r*.6);const m=mat(tk,c,{roughness:.8});add(new THREE.CylinderGeometry(r*.12,r*.18,r*.5,8),m,x,y+r*.25,z,tk.group);const t=add(new THREE.CylinderGeometry(r,r*.85,r*.08,24),m,x,y+r*.52,z,tk.group);t.rotation.z=rnd(-.15,.15);}
function seaFan(tk,x,y,z,r,c,ry){const o=add(new THREE.CircleGeometry(r,28,0,Math.PI),mat(tk,c,{side:THREE.DoubleSide,roughness:.9,transparent:true,opacity:.88},{sway:{amp:.03/r,spd:.7}}),x,y,z,tk.group);o.rotation.y=ry;}
function plantStem(tk,x,y,z,h,c,leaf=.05){const gs=[],col=C(c),n=Math.floor(h/.035);gs.push(prim(cylBetween(V(0,0,0),V(0,h,0),.003,.002,5),col));
 for(let i=1;i<n;i++){const yy=i*.035,a=i*2.4;for(const s of[0,Math.PI]){const dx=Math.cos(a+s),dz=Math.sin(a+s);gs.push(fin([[0,yy,0],[dx*leaf*.5+(-dz)*.006,yy+.01,dz*leaf*.5+dx*.006],[dx*leaf,yy+.004,dz*leaf],[dx*leaf*.5-(-dz)*.006,yy-.004,dz*leaf*.5-dx*.006]],[col]));}}
 return add(merge(gs),mat(tk,0xffffff,{vertexColors:true,side:THREE.DoubleSide,roughness:.65},{sway:{amp:.08,spd:.9}}),x,y,z,tk.group);}
function grass(tk,x,y,z,h,c,n=7,w=.006){const bl=[];for(let i=0;i<n;i++){const a=rnd(0,6.28),hh=h*rnd(.6,1),ox=Math.cos(a)*.01,oz=Math.sin(a)*.01,tx=Math.cos(a)*hh*.25,tz=Math.sin(a)*hh*.25,px=-Math.sin(a)*w,pz=Math.cos(a)*w;
 bl.push(fin([[ox-px,0,oz-pz],[ox+px,0,oz+pz],[ox+tx*.5+px*.6,hh*.55,oz+tz*.5+pz*.6],[ox+tx,hh,oz+tz],[ox+tx*.5-px*.6,hh*.55,oz+tz*.5-pz*.6]],[C(c)]));}
 return add(merge(bl),mat(tk,0xffffff,{vertexColors:true,side:THREE.DoubleSide,roughness:.7},{sway:{amp:.5/Math.max(h,.1),spd:1.1}}),x,y,z,tk.group);}
function leafy(tk,x,z,s,c1,c2,n=9,wide=.2,up=.8){const gs=[],a1=C(c1),a2=C(c2),M4=THREE.Matrix4;
 for(let i=0;i<n;i++){const len=s*rnd(.7,1.1),m=new M4().makeRotationY(-(i/n*Math.PI*2+rnd(-.3,.3))).multiply(new M4().makeTranslation(0,rnd(.02,s*.4),0)).multiply(new M4().makeRotationZ(rnd(.3,1.1)*up)).multiply(new M4().makeTranslation(len*.5,0,0)).multiply(new M4().makeScale(len*.5,len*.025,len*wide));
  const g=new THREE.SphereGeometry(1,12,6);g.applyMatrix4(m);gs.push(prim(g,i%2?a1:a2));}
 return add(merge(gs),mat(tk,0xffffff,{vertexColors:true,roughness:.5,side:THREE.DoubleSide},{sway:{amp:.6,spd:.8}}),x,tk.groundY(x,z),z,tk.group);}
function anemone(tk,x,y,z){const gs=[],tc=C(0xc9a77a),tip=C(0xf2d2a0);for(let i=0;i<90;i++){const a=rnd(0,6.28),r=rnd(0,.09),h=rnd(.06,.1),bx=Math.cos(a)*r,bz=Math.sin(a)*r;
 gs.push(prim(cylBetween(V(bx,0,bz),V(bx*1.6,h,bz*1.6),.006,.004,5),tc),prim(new THREE.SphereGeometry(.005,5,4).translate(bx*1.6,h,bz*1.6),tip));}
 add(new THREE.CylinderGeometry(.09,.06,.04,16),mat(tk,0x8a5a3a),x,y-.02,z,tk.group);add(merge(gs),mat(tk,0xffffff,{vertexColors:true,roughness:.45},{sway:{amp:3.5,spd:1.3}}),x,y,z,tk.group);}
function floorPlane(tk,w,d,cx,cz,c1,c2,o={}){const g=new THREE.PlaneGeometry(w,d,Math.ceil(w*o.res||w*16),Math.ceil(d*(o.res||16)));g.rotateX(-Math.PI/2);const p=g.attributes.position,col=[],a=C(c1),b=C(c2),t=new THREE.Color();
 for(let i=0;i<p.count;i++){const lx=p.getX(i)+cx,lz=p.getZ(i)+cz;p.setY(i,tk.groundY(lx,lz));t.copy(a).lerp(b,clamp(.5+.4*nz(lx*3,0,lz*3)+rnd(-.15,.15),0,1));if(o.tint)o.tint(t,lx,lz);col.push(t.r,t.g,t.b);}
 g.setAttribute('color',F(col,3));g.computeVertexNormals();const mo={vertexColors:true,roughness:1};
 if(o.caus){const ct=rep(causticTex,...o.rep);Object.assign(mo,{emissive:C(o.caus),emissiveMap:ct});tk.anims.push(t=>ct.offset.set(t*.03,t*.04));}
 if(o.nrm)Object.assign(mo,{normalMap:rep(scaleN,w*o.nrm,d*o.nrm),normalScale:new THREE.Vector2(.5,.5)});
 return add(g,mat(tk,0xffffff,mo),cx,0,cz,tk.group);}
function backWall(tk,c1,c2,amp,o={}){const {W,D,H}=tk;const g=new THREE.PlaneGeometry(W-.01,H-.01,Math.ceil(W*20),Math.ceil(H*20)),p=g.attributes.position,col=[],a=C(c1),b=C(c2),t=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);const n1=nz(x*2.2/amp*.06,y*2.2/amp*.06,0),n2=nz(x*7,y*6,1);p.setZ(i,amp*(n1*.7+n2*.3));t.copy(a).lerp(b,clamp(.5+n1*.5+(o.strata?Math.sin(y*o.strata)*.3:0),0,1));col.push(t.r,t.g,t.b);}
 g.setAttribute('color',F(col,3));g.computeVertexNormals();return add(g,mat(tk,0xffffff,{vertexColors:true,roughness:.95,normalMap:rep(scaleN,W*3,H*3),normalScale:new THREE.Vector2(.3,.3)}),0,H/2,-D+amp+.01,tk.group);}
function shell(tk,c,em){const {W,D,H}=tk;return add(new THREE.BoxGeometry(W-.014,H-.008,D-.014),mat(tk,c,{side:THREE.BackSide,roughness:1,emissive:C(em||0)}),0,H/2,-D/2,tk.group);}
function surface(tk,c,em){const {W,D,H}=tk;const s=add(new THREE.PlaneGeometry(W,D),mat(tk,c,{emissive:C(em),emissiveIntensity:.8,side:THREE.DoubleSide,transparent:true,opacity:.72}),0,H-.03,-D/2,tk.group);s.rotation.x=Math.PI/2;}
function dish(tk,x,z,r,c=0x5a564f){const y=tk.groundY(x,z);solid(tk,x,y,z,r*1.05,y+r*.3);add(new THREE.CylinderGeometry(r,r*.85,r*.35,28),mat(tk,c,{roughness:.6}),x,y+r*.1,z,tk.group);
 const w=add(new THREE.CircleGeometry(r*.88,28),new THREE.MeshPhysicalMaterial({color:C(0x4a7a88),roughness:.03,transmission:0,transparent:true,opacity:.8}),x,y+r*.26,z,tk.group);w.rotation.x=-Math.PI/2;}

/* ---------- 外殼：水族缸／爬蟲箱 ---------- */
function encAqua(tk){const {W,D,H,base}=tk,g=tk.group;box(W+.1,base,D+.1,cabM,0,-base/2,-D/2,g);box(W+.08,.18,D+.08,frameM,0,H+.09,-D/2,g);
 const gl=add(new THREE.PlaneGeometry(W,H),glassM,0,H/2,0,g);gl.renderOrder=5;
 for(const s of[-1,1]){box(.025,H+.02,.03,frameM,s*W/2,H/2,0,g);const sg=add(new THREE.PlaneGeometry(D,H),glassM,s*W/2,H/2,-D/2,g);sg.rotation.y=Math.PI/2;sg.renderOrder=5;}
 box(W+.04,.025,.03,frameM,0,0,0,g);box(W+.04,.025,.03,frameM,0,H,0,g);
 const strip=add(new THREE.PlaneGeometry(W*.96,.04),new THREE.MeshBasicMaterial({color:C(0xeaf6ff)}),0,H-.005,-D*.4,g);strip.rotation.x=Math.PI/2;}
function encTerra(tk){const {W,D,H,base}=tk,g=tk.group,fm=frameM,t=.025;box(W+.1,base,D+.1,cabM,0,-base/2,-D/2,g);
 for(const y of[0,H])for(const z of[0,-D])box(W+t,t,t,fm,0,y,z,g);for(const x of[-W/2,W/2]){for(const z of[0,-D])box(t,H,t,fm,x,H/2,z,g);for(const y of[0,H])box(t,t,D,fm,x,y,-D/2,g);}
 for(const [s,z] of[[-1,0],[1,-.014]]){const p=add(new THREE.PlaneGeometry(W/2+.02,H*.82),glassM,s*W/4,H*.47,z,g);p.renderOrder=5;box(.012,H*.25,.012,new THREE.MeshStandardMaterial({color:0x888888,metalness:.8,roughness:.3}),s*.03,H*.5,z+.012,g);}
 box(W,H*.12,.004,new THREE.MeshStandardMaterial({color:C(0x111111),roughness:.6}),0,H*.94,0,g);box(W,.06,.004,fm,0,.03,0,g);
 for(const s of[-1,1]){const sg=add(new THREE.PlaneGeometry(D,H),glassM,s*W/2,H/2,-D/2,g);sg.rotation.y=Math.PI/2;sg.renderOrder=5;}
 const mt=rep(meshTex,W*25,D*25);const lid=add(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:mt,transparent:true,alphaTest:.3,side:THREE.DoubleSide,color:0x222222}),0,H,-D/2,g);lid.rotation.x=-Math.PI/2;
 const bar=box(W*.8,.03,.06,fm,0,H+.03,-D*.25,g);const em=add(new THREE.PlaneGeometry(W*.78,.04),new THREE.MeshBasicMaterial({color:C(0xf6f9ff)}),0,H+.012,-D*.25,g);em.rotation.x=Math.PI/2;
 const sm=add(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({color:C(0x9a9a80),transparent:true,opacity:0,depthWrite:false}),0,H/2,-.02,g);sm.renderOrder=6;tk.smudge=sm;}

/* ---------- 各類造景 ---------- */
const DECO={
 fresh(tk){const {W,D,H}=tk;tk.groundY=(x,z)=>.04+.14*clamp(-z/D,0,1)*Math.min(1,H/1.2)+.012*nz(x*6,0,z*6);
  shell(tk,0x0b100d);floorPlane(tk,W,D,0,-D/2,0x3a2e22,0x221a12);const sc=Math.min(1,H/1.2),dw=mat(tk,0x4a3424,{roughness:.9,normalMap:rep(scaleN,2,8),normalScale:new THREE.Vector2(.6,.6)});
  for(let i=0;i<Math.max(1,Math.round(W*1.2));i++){const x=rnd(-W/2+.15,W/2-.15),z=-D*rnd(.55,.8),a=V(x,tk.groundY(x,z)+.02,z),b=V(clamp(x+rnd(-.4,.4)*sc,-W/2+.1,W/2-.1),a.y+rnd(.25,.55)*H,clamp(z+rnd(.1,.35)*D,-D+.05,-.1));add(cylBetween(a,b,.03*sc,.012*sc,9),dw,0,0,0,tk.group);solidSeg(tk,a,b,.03*sc);}
  const pc=[0x3f9a3a,0x5ab845,0x2f7a3a,0x9a3a2a,0x6dc04a];for(let i=0;i<Math.round(W*12);i++){const x=rnd(-W/2+.04,W/2-.04),z=rnd(-D+.05,-D*.45);plantStem(tk,x,tk.groundY(x,z),z,rnd(.3,.75)*H,pc[i%5],rnd(.035,.06));}
  const cg=[];for(let i=0;i<Math.round(W*D*90);i++){const x=rnd(-W/2+.03,W/2-.03),z=rnd(-D*.38,-.03);cg.push(prim(new THREE.SphereGeometry(rnd(.008,.014),6,4).translate(x,tk.groundY(x,z)+.004,z),C(i%3?0x5fb444:0x4a9a38)));}
  add(merge(cg),mat(tk,0xffffff,{vertexColors:true,roughness:.8}),0,0,0,tk.group);
  for(let i=0;i<3;i++){const x=rnd(-W/2+.1,W/2-.1),z=-D*rnd(.2,.5);rock(tk,x,tk.groundY(x,z)+.01,z,.04*sc+.02,0x5a5a55,.8);}
  surface(tk,0xa0e0c0,0x8fd8b0);tk.box=new THREE.Box3(V(-W/2+.06,.16*sc+.08,-D+.06),V(W/2-.06,H-.1,-.06));
  tk.foodCfg={at:V(0,H-.04,-D/2),sp:V(W*.15,.02,D*.3),n:90,size:.008,col:0xd88a40,sink:.05,name:'薄片飼料'};},
 reef(tk){const {W,D,H}=tk,k=D/2;tk.groundY=(x,z)=>.05+.04*clamp(-z/D,0,1)+.02*nz(x*4,0,z*4);
  shell(tk,0x2c7fb8,0x0b3a66);floorPlane(tk,W,D,0,-D/2,0xeee2c4,0xd2c29c,{caus:0x7fd2ff,rep:[W*.5,D]});
  for(let x=-W/2+.2;x<W/2-.1;x+=.5*k){const z=-D*rnd(.72,.9);rock(tk,x+rnd(-.1,.1),tk.groundY(x,z)+rnd(.1,.25)*k,z,rnd(.3,.48)*k,[0x8a6f7d,0x7a6f6a,0x9a7a86][Math.floor(rnd(0,3))],rnd(.8,1.4));}
  for(let i=0;i<Math.round(W*.6);i++){const x=rnd(-W/2+.3,W/2-.3),z=-D*rnd(.35,.6);rock(tk,x,tk.groundY(x,z)+.1*k,z,rnd(.22,.32)*k,0x8a6f7d,1.1);}
  const cc=[[0x8f5aa8,0xe0b0ff],[0x3a9a8a,0xa0ffe8],[0xd0603a,0xffc090],[0x5a7ad0,0xb0d0ff],[0xc04a7a,0xffb0d0]];
  for(let i=0;i<Math.round(W*2.4);i++){const c=cc[i%5],x=rnd(-W/2+.15,W/2-.15),z=-D*rnd(.65,.9);coralBranch(tk,x,tk.groundY(x,z)+rnd(.35,.7)*k,z,rnd(.18,.32)*k,c[0],c[1]);}
  for(let i=0;i<Math.round(W*.6);i++){const x=rnd(-W/2+.2,W/2-.2),z=-D*rnd(.15,.4);brain(tk,x,tk.groundY(x,z),z,rnd(.08,.13)*k,[0x7aa868,0xb0886a,0x8a9a5a][i%3]);}
  for(let i=0;i<Math.round(W*.4);i++){const x=rnd(-W/2+.3,W/2-.3),z=-D*rnd(.5,.7);tableCoral(tk,x,tk.groundY(x,z)+.25*k,z,rnd(.15,.22)*k,[0x8ab0a0,0xb09ac8][i%2]);}
  for(let i=0;i<Math.round(W*1.2);i++){const x=rnd(-W/2+.1,W/2-.1),z=-D*rnd(.1,.5);grass(tk,x,tk.groundY(x,z),z,rnd(.08,.16),[0x3a8a3a,0x7a3a2a][i%2],6,.004);}
  const ax=-W*.25,az=-D*.35;anemone(tk,ax,tk.groundY(ax,az)+.01,az);tk.anemone=V(ax,tk.groundY(ax,az)+.12,az);
  surface(tk,0x7fd0ff,0x8fd8ff);tk.box=new THREE.Box3(V(-W/2+.1,.2,-D+.12),V(W/2-.1,H-.1,-.1));
  tk.foodCfg={at:V(0,H-.05,-D/2),sp:V(W*.18,.02,D*.35),n:120,size:.009,col:0xffd9b8,sink:.07,name:'糠蝦'};},
 seahorse(tk){const {W,D,H}=tk;tk.groundY=(x,z)=>.04+.03*clamp(-z/D,0,1)+.01*nz(x*8,0,z*8);
  shell(tk,0x1e5d7a,0x08263a);floorPlane(tk,W,D,0,-D/2,0xe8dcc0,0xc8b896,{caus:0x7fd2ff,rep:[W,D*2]});
  for(let i=0;i<Math.round(W*14);i++){const x=rnd(-W/2+.04,W/2-.04),z=rnd(-D+.04,-D*.3);grass(tk,x,tk.groundY(x,z),z,rnd(.3,.6)*H,i%3?0x4a8a3a:0x6a9a3a,6,.005);}
  rock(tk,-W*.3,tk.groundY(-W*.3,-D*.6)+.02,-D*.6,.08,0x8a7a70,.9);brain(tk,W*.2,tk.groundY(W*.2,-D*.3),-D*.3,.05,0xc0806a);
  surface(tk,0x9fe0ff,0x8fd8ff);tk.box=new THREE.Box3(V(-W/2+.05,.12,-D+.05),V(W/2-.05,H-.08,-.05));
  tk.foodCfg={at:V(0,H-.04,-D/2),sp:V(W*.3,.02,D*.35),n:60,size:.006,col:0xffa080,sink:.025,name:'豐年蝦'};},
 jelly(tk){const r=tk.r,cz=-r,cb=tk.cb,ch=tk.ch;tk.cyl=r;tk.cz=cz;tk.groundY=()=>cb;
  add(new THREE.CylinderGeometry(r+.13,r+.2,cb,64),new THREE.MeshStandardMaterial({color:C(0x1a1d22),roughness:.3,metalness:.5}),0,cb/2,cz,tk.group);
  add(new THREE.CylinderGeometry(r+.13,r+.13,.25,64),frameM,0,cb+ch+.12,cz,tk.group);
  const ring=add(new THREE.TorusGeometry(r-.03,.02,8,72),new THREE.MeshBasicMaterial({color:C(0x9fbcff)}),0,cb+ch-.02,cz,tk.group);ring.rotation.x=Math.PI/2;glow(0,cb+ch-.1,cz,r*2.2,0x8fb0ff,.35,tk.group);
  if(r<1.5)add(new THREE.CylinderGeometry(r-.03,r-.03,ch,48,1,true,Math.PI/2,Math.PI),new THREE.MeshBasicMaterial({map:jellyBg,side:THREE.DoubleSide}),0,cb+ch/2,cz,tk.group);
  const bot=add(new THREE.CircleGeometry(r,64),mat(tk,0x101830,{emissive:C(0x101a40)}),0,cb+.01,cz,tk.group);bot.rotation.x=-Math.PI/2;
  const gl=add(new THREE.CylinderGeometry(r,r,ch,96,1,true),glassM,0,cb+ch/2,cz,tk.group);gl.renderOrder=5;
  tk.box=new THREE.Box3(V(-r*.7,cb+.25,cz-r*.7),V(r*.7,cb+ch-.2,cz+r*.7));
  tk.foodCfg={at:V(0,cb+ch-.1,cz),sp:V(r*.5,.02,r*.5),n:r>1.5?200:80,size:.006,col:0xffe0c0,sink:.03,name:'豐年蝦幼體'};},
 reefT(tk){const r=tk.r,cz=-r,cb=tk.cb,ch=tk.ch,k=1.4;tk.cyl=r;tk.cz=cz;
  tk.groundY=(x,z)=>{const d=Math.hypot(x,z-cz);return cb+.08+Math.max(0,.9*(1-d/1.6))+.03*nz(x*3,0,z*3);};
  add(new THREE.CylinderGeometry(r+.15,r+.25,cb,72),new THREE.MeshStandardMaterial({color:C(0x161a1e),roughness:.25,metalness:.6}),0,cb/2,cz,tk.group);
  add(new THREE.CylinderGeometry(r+.15,r+.15,.35,72),frameM,0,cb+ch+.17,cz,tk.group);
  const g=new THREE.CircleGeometry(r,72,0,Math.PI*2);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,tk.groundY(p.getX(i),p.getZ(i)+cz)-0);g.computeVertexNormals();
  add(g,mat(tk,0xe8dcc0,{roughness:1,emissive:C(0x6fb8e0),emissiveMap:rep(causticTex,3,3)}),0,0,cz,tk.group);
  for(let i=0;i<9;i++){const a=i/9*6.28,d=rnd(0,1.1);rock(tk,Math.cos(a)*d,cb+rnd(.4,1.4),cz+Math.sin(a)*d,rnd(.45,.75),[0x8a6f7d,0x7a6f6a,0x9a7a86][i%3],rnd(.9,1.6));}
  rock(tk,0,cb+2.2,cz,.6,0x8a6f7d,1.8);rock(tk,.3,cb+3.1,cz+.2,.4,0x9a7a86,1.5);
  const cc=[[0x8f5aa8,0xe0b0ff],[0x3a9a8a,0xa0ffe8],[0xd0603a,0xffc090],[0x5a7ad0,0xb0d0ff],[0xc04a7a,0xffb0d0]];
  for(let i=0;i<26;i++){const a=rnd(0,6.28),d=rnd(.3,1.3),h=cb+rnd(.8,3.4);coralBranch(tk,Math.cos(a)*d,h,cz+Math.sin(a)*d,rnd(.3,.55),cc[i%5][0],cc[i%5][1]);}
  for(let i=0;i<6;i++){const a=rnd(0,6.28),d=rnd(1.5,2.1);brain(tk,Math.cos(a)*d,tk.groundY(Math.cos(a)*d,cz+Math.sin(a)*d),cz+Math.sin(a)*d,rnd(.12,.2),[0x7aa868,0xb0886a,0x8a9a5a][i%3]);}
  for(let i=0;i<4;i++){const a=i*1.6+.4;tableCoral(tk,Math.cos(a)*.9,cb+rnd(1.6,2.6),cz+Math.sin(a)*.9,rnd(.28,.4),[0x8ab0a0,0xb09ac8][i%2]);}
  for(let i=0;i<14;i++){const a=rnd(0,6.28),d=rnd(1.6,2.3),x=Math.cos(a)*d,z=cz+Math.sin(a)*d;grass(tk,x,tk.groundY(x,z),z,rnd(.15,.3),[0x3a8a3a,0x7a3a2a][i%2],6,.006);}
  const ax=1.7,az=cz+.6;anemone(tk,ax,tk.groundY(ax,az),az);tk.anemone=V(ax,tk.groundY(ax,az)+.12,az);
  const sf=add(new THREE.CircleGeometry(r,72),mat(tk,0x7fd0ff,{emissive:C(0x9fe0ff),emissiveIntensity:1,side:THREE.DoubleSide,transparent:true,opacity:.7}),0,cb+ch-.04,cz,tk.group);sf.rotation.x=Math.PI/2;
  const gl=add(new THREE.CylinderGeometry(r,r,ch,128,1,true),glassM,0,cb+ch/2,cz,tk.group);gl.renderOrder=5;
  for(let i=0;i<10;i++){const a=i/10*6.28;glow(Math.cos(a)*(r-.3),cb+ch-.15,cz+Math.sin(a)*(r-.3),1.2,0xbfe8ff,.45,tk.group);}
  const rays=[];for(let i=0;i<5;i++){const rr=add(new THREE.PlaneGeometry(rnd(.5,1),ch*.95),new THREE.MeshBasicMaterial({map:rayTex,color:C(0x9fdcff),transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),rnd(-1.2,1.2),cb+ch*.5,cz+rnd(-1.2,1.2),tk.group);rr.rotation.y=rnd(0,3);rays.push(rr);}
  tk.anims.push(t=>rays.forEach((rr,i)=>rr.material.opacity=.08+.04*Math.sin(t*.5+i)));
  tk.box=new THREE.Box3(V(-r*.72,cb+.5,cz-r*.72),V(r*.72,cb+ch-.25,cz+r*.72));
  tk.foodCfg={at:V(0,cb+ch-.1,cz),sp:V(1.2,.05,1.2),n:220,size:.009,col:0xffd9b8,sink:.08,name:'糠蝦'};},
 ocean(tk){tk.groundY=(x,z)=>-.45+.22*nz(x*.35,0,z*.35)+.007*(-z)+.05*Math.sin(x*.9);
  add(new THREE.BoxGeometry(30.2,11.2,14.2),mat(tk,0x1d4d68,{side:THREE.BackSide,roughness:1}),0,4.5,-7.1,tk.group);
  floorPlane(tk,30,14,0,-7,0xd9c9a2,0xb8a57c,{caus:0x7fc4e2,rep:[7,3.5],res:4});
  for(let x=-14;x<=14;x+=3.1){const s=rnd(2,3.3);rock(tk,x+rnd(-.6,.6),s*.25,-12.6+rnd(-.4,.4),s,[0x6c6152,0x5d5850,0x7a6a5e][Math.floor(rnd(0,3))],rnd(.8,1.4));}
  for(let z=-11;z<=-2;z+=2.6)for(const sx of[-1,1]){const s=rnd(1.4,2.4);rock(tk,sx*rnd(13.4,14.3),s*.2,z,s,0x655c50,rnd(.7,1.2));}
  rock(tk,-6.5,-.1,-6.5,1.3,0x6f6455,.8);rock(tk,7.5,-.15,-8.5,1.7,0x6a5f52,.75);rock(tk,1.5,-.2,-10,1.2,0x726656,.9);
  const cc=[[0x8f5aa8,0xd9a8ff],[0xc76b4a,0xffc49a],[0x5a8fa8,0xb8f0ff],[0xa8a04a,0xfff2a0]];
  for(let i=0;i<16;i++){const c=cc[i%4];coralBranch(tk,rnd(-12.5,12.5),rnd(1.2,2.6),rnd(-12,-9.5),rnd(.9,1.6),c[0],c[1]);}
  brain(tk,-2,-.35,-5.5,.8,0x8aa05a);brain(tk,4,-.35,-4.8,.6,0xa08a5a);brain(tk,-10,-.3,-7.5,.9,0x7a9a6a);tableCoral(tk,10.5,-.3,-5.5,1.2,0x7fa89a);tableCoral(tk,-11.5,-.3,-4.5,1,0x9a8fb0);
  for(const [x,z,r,c] of[[-8,-11.2,1.3,0xb8404f],[-3,-11.5,1.1,0xd06a3a],[5,-11.3,1.4,0x9a3a8a],[11,-10.8,1.0,0xc84a3a]])seaFan(tk,x,rnd(2.5,3.6),z,r,c,rnd(-.3,.3));
  const st=rep(causticTex,4,2);const sf=add(new THREE.PlaneGeometry(30,14),mat(tk,0x4aa7d8,{emissive:C(0x9fdcff),emissiveMap:st,emissiveIntensity:1.3,side:THREE.DoubleSide,roughness:.2}),0,9.9,-7.1,tk.group);sf.rotation.x=Math.PI/2;
  const rays=[];for(let i=0;i<9;i++){const r=add(new THREE.PlaneGeometry(rnd(1.5,3.2),12),new THREE.MeshBasicMaterial({map:rayTex,color:C(0x9fdcff),transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),rnd(-12,12),4.5,rnd(-12,-2),tk.group);
   r.rotation.set(0,rnd(-.5,.5),rnd(-.25,-.1));r.userData={ph:rnd(0,6),x0:r.position.x};rays.push(r);}
  tk.anims.push(t=>{st.offset.set(-t*.01,t*.013);for(const r of rays){r.position.x=r.userData.x0+Math.sin(t*.15+r.userData.ph)*.8;r.material.opacity=.07+.03*Math.sin(t*.4+r.userData.ph);}});
  tk.box=new THREE.Box3(V(-13.5,.4,-13),V(13.5,9.3,-1.3));tk.foodCfg={at:V(0,9.4,-4),sp:V(6,.3,2.2),n:360,size:.07,col:0xffb8a4,sink:.11,name:'磷蝦'};
  tk.oc={c:V(0,0,-7.2),a:10.3,b:4.1,y:[1.6,7],wy:4.6,gbox:new THREE.Box3(V(-12,.6,-11),V(12,2.6,-4)),jPath:t=>V(-8*Math.cos(t*.07),3+1.2*Math.sin(t*.13),-6.5+3.8*Math.sin(t*.07)),sPath:t=>V(8.5*Math.sin(t*.045),5.4+1.6*Math.sin(t*.09),-7+3.4*Math.sin(t*.06+1))};},
 tunnel(tk){const cz=28,R=2.4;tk.tube={y:0,z:cz,R};
  tk.groundY=(x,z)=>{const dz=Math.abs(z-cz);return -.55+.07*Math.max(0,dz-R)+.2*nz(x*.4,0,z*.4)+.04*Math.sin(x*.8);};
  add(new THREE.BoxGeometry(26.2,8.6,16.2),mat(tk,0x1a4a66,{side:THREE.BackSide,roughness:1}),28,3,28,tk.group);
  floorPlane(tk,26,16,28,28,0xd8c8a0,0xb0a078,{caus:0x7fc4e2,rep:[6,4],res:3});
  for(let x=16;x<=40;x+=2.4)for(const zz of[20.8,35.2]){const sz=rnd(1.1,2);rock(tk,x+rnd(-.5,.5),sz*.3,zz+rnd(-.3,.3),sz,[0x6c6152,0x5d5850,0x7a6a5e][Math.floor(rnd(0,3))],rnd(.8,1.5));}
  const cc=[[0x8f5aa8,0xd9a8ff],[0xc76b4a,0xffc49a],[0x5a8fa8,0xb8f0ff],[0xa8a04a,0xfff2a0],[0xc04a7a,0xffb0d0]];
  for(let i=0;i<22;i++){const c=cc[i%5],zz=i%2?rnd(21.5,23):rnd(33,34.5);coralBranch(tk,rnd(16.5,39.5),rnd(.8,1.8),zz,rnd(.6,1.1),c[0],c[1]);}
  for(let i=0;i<14;i++){const zz=i%2?rnd(25.2,25.5)-.4:rnd(30.6,31);const x=rnd(16,40);const c=cc[i%5];if(i%3)coralBranch(tk,x,tk.groundY(x,zz),zz,rnd(.3,.5),c[0],c[1]);else brain(tk,x,tk.groundY(x,zz),zz,rnd(.2,.35),[0x7aa868,0xb0886a][i%2]);}
  for(let i=0;i<6;i++){const x=rnd(17,39),zz=i%2?21.3:34.7;seaFan(tk,x,rnd(1.8,2.8),zz,rnd(.8,1.2),[0xb8404f,0xd06a3a,0x9a3a8a][i%3],rnd(-.3,.3));}
  const st=rep(causticTex,4,3);const sf=add(new THREE.PlaneGeometry(26,16),mat(tk,0x4aa7d8,{emissive:C(0x9fdcff),emissiveMap:st,emissiveIntensity:1.4,side:THREE.DoubleSide,roughness:.2}),28,7,28,tk.group);sf.rotation.x=Math.PI/2;
  const rays=[];for(let i=0;i<10;i++){const r=add(new THREE.PlaneGeometry(rnd(1.2,2.4),8),new THREE.MeshBasicMaterial({map:rayTex,color:C(0x9fdcff),transparent:true,opacity:.09,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),rnd(16,40),3.2,i%2?rnd(21,25):rnd(31,35),tk.group);r.rotation.set(0,rnd(-.5,.5),rnd(-.25,-.1));r.userData={ph:rnd(0,6),x0:r.position.x};rays.push(r);}
  tk.anims.push(t=>{st.offset.set(-t*.01,t*.013);for(const r of rays){r.position.x=r.userData.x0+Math.sin(t*.15+r.userData.ph)*.6;r.material.opacity=.07+.03*Math.sin(t*.4+r.userData.ph);}});
  tk.box=new THREE.Box3(V(15.8,-.3,20.8),V(40.2,6.5,35.2));tk.foodCfg={at:V(28,6.6,24),sp:V(9,.2,1.8),n:300,size:.06,col:0xffb8a4,sink:.11,name:'磷蝦'};
  tk.oc={c:V(28,0,28),a:10,b:5.2,y:[2.9,5.8],wy:4.3,gbox:new THREE.Box3(V(17,-.2,21.2),V(39,1.3,24.3)),jPath:t=>V(28-8*Math.cos(t*.08),4.7+.7*Math.sin(t*.13),28+4.4*Math.sin(t*.08)),sPath:t=>V(28+9*Math.sin(t*.05),4.3+.9*Math.sin(t*.1),28+4.2*Math.sin(t*.07+1))};},
 desert(tk){const {W,D,H}=tk,sc=Math.min(D,H)/1;const bx=-W*.28,bz=-D*.55,br=.16*sc,bh=.07*sc;
  const base=(x,z)=>.03+.06*sc*clamp(-z/D,0,1)+.01*nz(x*5,0,z*5)+.015*sc*Math.sin(x*2.1/sc)*Math.cos(z*1.7/sc);
  tk.groundY=(x,z)=>{const d=Math.hypot(x-bx,(z-bz)*1.2)/br;return base(x,z)+(d<1?bh*sstep(1-d)*1.2:0);};tk.bask=V(bx,0,bz);
  backWall(tk,0xb88456,0x8a5a36,.05*sc,{strata:30});floorPlane(tk,W,D,0,-D/2,0xe0b97f,0xc69458,{tint:(c,x,z)=>{const d=Math.hypot(x-bx,(z-bz)*1.2)/br;if(d<1)c.lerp(C(0x8a7864),sstep(1-d)*.9);},nrm:6,res:24});
  for(let i=0;i<Math.round(W*2.5);i++){const x=rnd(-W/2+.08,W/2-.08),z=-D*rnd(.7,.95);rock(tk,x,tk.groundY(x,z)+.01,z,rnd(.06,.14)*sc,[0xa3764c,0x94683f,0xa98058][i%3],rnd(.7,1.3));}
  const hx=W*.28,hz=-D*.6,hr=.12*sc;const dome=add(new THREE.SphereGeometry(hr,28,12,0,Math.PI*1.55,0,Math.PI/2),mat(tk,0x6d5944,{side:THREE.DoubleSide,roughness:.95,flatShading:true,normalMap:rep(scaleN,3,3)}),hx,tk.groundY(hx,hz)-.01,hz,tk.group);dome.rotation.y=2.1;solid(tk,hx,tk.groundY(hx,hz),hz,hr*1.02,tk.groundY(hx,hz)+hr);tk.hide=V(hx,0,hz+hr*1.3);
  dish(tk,-W*.05,-D*.3,.055*sc);add(cylBetween(V(-W*.1,tk.groundY(-W*.1,-D*.75),-D*.75),V(W*.12,H*.55,-D*.85),.016*sc,.009*sc,8),mat(tk,0x8a6f56,{roughness:.9,normalMap:rep(scaleN,2,10)}),0,0,0,tk.group);
  leafy(tk,W*.4,-D*.85,.08*sc,0x8fae7a,0x6f9466,12,.22,.6);leafy(tk,-W*.42,-D*.25,.06*sc,0x9bb685,0x7a9c6c,10,.22,.6);
  const fx=add(new THREE.CylinderGeometry(.06*sc+.03,.08*sc+.04,.1,24),frameM,bx,H+.06,bz,tk.group);
  const gl=add(new THREE.CircleGeometry(.07*sc+.03,24),new THREE.MeshBasicMaterial({color:C(0xffc080)}),bx,H+.005,bz,tk.group);gl.rotation.x=Math.PI/2;
  const spot=add(new THREE.PlaneGeometry(br*3.2,br*3.2),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),bx,tk.groundY(bx,bz)+.01,bz,tk.group);spot.rotation.x=-Math.PI/2;
  tk.walk=new THREE.Box3(V(-W/2+.05,0,-D+.05),V(W/2-.05,H,-.05));tk.feedSpot=V(W*.12,0,-D*.35);},
 tropical(tk){const {W,D,H}=tk,sc=Math.min(D,H)/1;tk.groundY=(x,z)=>.05+.05*sc*clamp(-z/D,0,1)+.012*nz(x*4,0,z*4);
  backWall(tk,0x4a3426,0x2a1c12,.06*sc);
  floorPlane(tk,W,D,0,-D/2,0x3d2b1c,0x21160d,{tint:(c,x,z)=>{const m=nz(x*3,1,z*3);if(m>.35)c.lerp(C(0x4c7a2c),clamp((m-.35)*3,0,1));},res:24});
  const bark=mat(tk,0x5b4231,{roughness:.95,normalMap:rep(scaleN,3,30),normalScale:new THREE.Vector2(1.2,1.2)});tk.branches=[];
  const nb=W<2?2:3;for(let i=0;i<nb;i++){const fx=(i-(nb-1)/2)/(nb)*W*1.1;const p0=V(fx+rnd(-.1,.1)*W,0,-D*rnd(.2,.35));p0.y=tk.groundY(p0.x,p0.z)+.01;
   const p1=V(clamp(p0.x+rnd(-.2,.2)*W,-W/2+.08,W/2-.08),H*rnd(.4,.5),-D*.6),p2=V(clamp(p1.x+rnd(-.25,.25)*W,-W/2+.1,W/2-.1),H*rnd(.72,.85),-D*.82);
   const cv=new THREE.CatmullRomCurve3([p0,p1,p2]);const r=.01*sc+.007;add(new THREE.TubeGeometry(cv,48,r,9),bark,0,0,0,tk.group);tk.branches.push({curve:cv,r,len:cv.getLength()});}
  const e=tk.branches[0].curve.getPointAt(1);tk.branches[0].cup=true;add(new THREE.CylinderGeometry(.03,.025,.03,20,1,true),mat(tk,0xd8d4cc,{side:THREE.DoubleSide,roughness:.4}),e.x,e.y+.005,e.z+.02,tk.group);
  const fill=add(new THREE.CylinderGeometry(.027,.024,.025,20),mat(tk,0xe08a3a,{roughness:.3}),e.x,e.y-.006,e.z+.02,tk.group);fill.geometry.translate(0,.0125,0);tk.cup={level:0,mesh:fill};
  const pc=[[0x3f8a3a,0x2f6e2c],[0x4c9a45,0x316f2d],[0x6aa84f,0x4f8a3c],[0x9c3f5c,0x7d2f48]];
  for(let i=0;i<Math.round(W*4);i++){const c=pc[i%4],x=rnd(-W/2+.08,W/2-.08),z=-D*rnd(.55,.92);leafy(tk,x,z,rnd(.12,.28)*sc,c[0],c[1],rnd(7,11)|0,i%3?.2:.09,i%3?.8:1.1);}
  const mossM=[mat(tk,0x4c7a2c,{flatShading:true}),mat(tk,0x5f8f35,{flatShading:true})];
  for(let i=0;i<Math.round(W*3);i++){const x=rnd(-W/2+.05,W/2-.05),z=-D*rnd(.1,.9),m=add(new THREE.IcosahedronGeometry(1,1),mossM[i%2],x,tk.groundY(x,z),z,tk.group);m.scale.set(rnd(.04,.09)*sc,rnd(.012,.025)*sc,rnd(.04,.08)*sc);}
  const lc=[C(0x6b4a2a),C(0x8a5e30),C(0x4f3820)],lg=[];
  for(let i=0;i<Math.round(W*D*40);i++){const x=rnd(-W/2+.03,W/2-.03),z=rnd(-D+.03,-.03),g=new THREE.SphereGeometry(1,7,3);g.applyMatrix4(new THREE.Matrix4().makeRotationY(rnd(0,6)).multiply(new THREE.Matrix4().makeScale(.016,.0015,.009)));g.translate(x,tk.groundY(x,z)+.002,z);lg.push(prim(g,lc[i%3]));}
  add(merge(lg),mat(tk,0xffffff,{vertexColors:true,roughness:.9}),0,0,0,tk.group);
  dish(tk,W*.32,-D*.25,.07*sc,0x3b3a35);
  tk.walk=new THREE.Box3(V(-W/2+.05,0,-D+.05),V(W/2-.05,H,-.05));tk.feedSpot=V(-W*.1,0,-D*.3);}
};

/* ---------- 物種資料 ---------- */
const SP={
 whale:{n:'鯨鯊',s:'Rhincodon typus',z:'全長 9 m（野外最大約 18 m）',f:'世界上最大的魚。靠濾食浮游生物和小魚維生，對人沒有威脅。',hab:'ocean',cost:30,max:1,hr:.04},
 manta:{n:'鬼蝠魟',s:'Mobula birostris',z:'翼展 4.4 m（最大約 7 m）',f:'用頭部兩片頭鰭把浮游生物撥進嘴裡，是腦部比例最大的魚類之一。',hab:'ocean',cost:10,hr:.04},
 shark:{n:'黑鰭礁鯊',s:'Carcharhinus melanopterus',z:'全長 1.6 m',f:'鰭尖是黑色的，常在珊瑚礁淺水區巡游。',hab:'ocean',cost:6,hr:.04},
 turtle:{n:'綠蠵龜',s:'Chelonia mydas',z:'甲長 1 m',f:'成年後主要吃海草和藻類。台灣的澎湖望安和蘭嶼都有產卵紀錄。',hab:'ocean',cost:6,hr:.035},
 grouper:{n:'龍膽石斑',s:'Epinephelus lanceolatus',z:'全長 2 m（最大約 2.7 m）',f:'最大型的石斑魚之一，喜歡待在岩石附近伏擊獵物。',hab:'ocean',cost:8,hr:.035},
 jack:{n:'浪人鰺（群）',s:'Caranx ignobilis',z:'單隻 0.8 m，一群 26 隻',f:'成群高速巡游的掠食者，會衝進小魚群裡捕食。',hab:'ocean',cost:10,hr:.05},
 sardine:{n:'沙丁魚（群）',s:'Sardinops sagax',z:'單隻 20 cm，一群 460 隻',f:'靠群游躲避掠食者，大魚一靠近，魚群就會整片散開。',hab:'ocean',cost:10,hr:.06},
 clown:{n:'公子小丑',s:'Amphiprion ocellaris',z:'全長 9 cm',f:'和海葵共生，身上的黏液讓牠不會被海葵螫到。',hab:'reef',cost:1,hr:.06},
 btang:{n:'藍倒吊',s:'Paracanthurus hepatus',z:'全長 25 cm',f:'尾柄上有像刀片的硬棘，受威脅時會用來自衛。',hab:'reef',cost:4,hr:.06,min:'L'},
 ytang:{n:'黃三角倒吊',s:'Zebrasoma flavescens',z:'全長 18 cm',f:'整天啃食藻類，晚上體色會變暗。',hab:'reef',cost:3,hr:.06},
 chromis:{n:'藍綠光鰓雀鯛（群）',s:'Chromis viridis',z:'單隻 7 cm，一群 30 隻',f:'成群在枝狀珊瑚上方活動，一受驚就鑽進珊瑚枝裡。',hab:'reef',cost:4,hr:.06},
 neon:{n:'日光燈魚（群）',s:'Paracheirodon innesi',z:'單隻 3.5 cm，一群 40 隻',f:'身上的藍線會反光，一般認為能在昏暗的河水中幫助同伴辨認彼此。',hab:'fresh',cost:3,hr:.06},
 guppy:{n:'孔雀魚',s:'Poecilia reticulata',z:'全長 4 cm',f:'卵胎生，母魚直接生出小魚。雄魚的尾鰭顏色變化非常多。',hab:'fresh',cost:1,hr:.07},
 angel:{n:'神仙魚',s:'Pterophyllum scalare',z:'體長 12 cm（含鰭高約 15 cm）',f:'扁平的身體適合在水草和沉木之間穿梭。',hab:'fresh',cost:3,hr:.05,min:'M'},
 seahorse:{n:'庫達海馬',s:'Hippocampus kuda',z:'身高 12 cm',f:'由公海馬懷孕生產，平常會用尾巴勾住海草休息。',hab:'seahorse',cost:1,hr:.06},
 moon:{n:'海月水母',s:'Aurelia aurita',z:'傘徑 26 cm',f:'沒有大腦也沒有心臟，傘上四個環狀構造是生殖腺。',hab:'jelly',cost:1,hr:.05},
 nettle:{n:'太平洋黃金水母',s:'Chrysaora fuscescens',z:'傘徑 20 cm，觸手長達數公尺',f:'用長長的觸手捕捉浮游動物，觸手有刺絲胞。',hab:'jelly',cost:2,hr:.05},
 gecko:{n:'豹紋守宮',s:'Eublepharis macularius',z:'全長 22 cm',f:'少數有可動眼瞼的守宮，夜行性，肥厚的尾巴用來儲存脂肪。',hab:'desert',cost:2,hr:.03,diet:'insect'},
 beardie:{n:'鬆獅蜥',s:'Pogona vitticeps',z:'全長 50 cm',f:'會點頭、揮手溝通；受到威脅時會撐開喉部的「鬍鬚」並變黑。',hab:'desert',cost:5,hr:.03,min:'M',diet:'insect+veg'},
 tortoise:{n:'蘇卡達象龜',s:'Centrochelys sulcata',z:'甲長 45 cm（成體可達 80 cm）',f:'世界第三大的陸龜，以草和高纖植物為主食。',hab:'desert',cost:12,hr:.025,min:'L',diet:'veg'},
 python:{n:'球蟒',s:'Python regius',z:'全長 1.1 m',f:'受驚時會把身體捲成一顆球、把頭藏在中間，因此得名。',hab:'tropical',hab2:'desert',cost:5,hr:.008,min:'M',diet:'mouse'},
 horned:{n:'南美角蛙',s:'Ceratophrys ornata',z:'體長 12 cm',f:'伏擊型掠食者，嘴巴幾乎和身體一樣寬，獵物經過就一口吞下。',hab:'tropical',cost:2,hr:.025,diet:'insect'},
 dart:{n:'藍箭毒蛙',s:'Dendrobates tinctorius',z:'體長 4 cm',f:'野生個體的毒來自食物中的小蟲，人工飼養的個體不帶毒。',hab:'tropical',cost:1,hr:.04,diet:'insect'},
 crested:{n:'睫角守宮',s:'Correlophus ciliatus',z:'全長 20 cm',f:'曾被認為已經滅絕，1994 年在新喀里多尼亞被重新發現。腳趾有吸附皮瓣，能爬玻璃。',hab:'tropical',cost:2,hr:.03,diet:'insect+fruit'},
 cham:{n:'高冠變色龍',s:'Chamaeleo calyptratus',z:'全長 45 cm',f:'兩隻眼睛能各自轉動；舌頭可以伸到比身體還長，一瞬間黏住獵物。',hab:'tropical',cost:5,hr:.03,min:'M',diet:'insect'},
};
const HT={
 fresh:{n:'淡水草缸',sz:['S','M','L'],aqua:true,wc:0x2e4a34,den:.22,deep:.8,d:'沉木、水草、南美小型魚'},
 reef:{n:'珊瑚礁缸',sz:['M','L','T'],aqua:true,wc:0x1a74a6,den:.14,deep:.75,d:'活石、珊瑚、海葵與礁岩魚'},
 seahorse:{n:'海馬缸',sz:['S','M'],aqua:true,wc:0x226a88,den:.25,deep:.8,d:'海草床、低水流'},
 jelly:{n:'水母柱缸',sz:['C','T'],aqua:true,wc:0x0b1840,den:.06,deep:.85,d:'環流圓柱缸、背光'},
 ocean:{n:'大洋水槽',sz:['XL','U'],aqua:true,wc:0x0a3a58,den:.042,deep:.33,d:'鯨鯊、鬼蝠魟、魚群'},
 desert:{n:'沙漠爬箱',sz:['S','M','L'],d:'沙地、曬燈、岩洞'},
 tropical:{n:'熱帶雨林箱',sz:['S','M','L'],d:'軟木背板、樹枝、植物、高濕度'},
};
const SZ={S:{w:.9,d:.5,h:.6,base:1.05,cap:4,n:'小型'},M:{w:1.8,d:.7,h:1.0,base:.9,cap:10,n:'中型'},L:{w:3.2,d:1.4,h:2.0,base:.45,cap:22,n:'大型'},C:{r:.75,h:2.4,cb:.5,cap:14,n:'圓柱'},T:{r:2.5,h:8.5,cb:.6,cap:40,n:'塔型'},XL:{cap:80,n:'巨型'},U:{cap:60,n:'隧道'}};
const SZO=['S','M','L'];
const spOK=(k,tk)=>{const s=SP[k];return(s.hab===tk.type||s.hab2===tk.type)&&(!s.min||SZO.indexOf(tk.sz)>=SZO.indexOf(s.min)||['XL','C','T','U','R','PD','PEN','AV'].includes(tk.sz));};

/* ---------- 生物生成 ---------- */
function fishMat(tk,swim,o={}){return mat(tk,0xffffff,Object.assign({vertexColors:true,roughness:.32,metalness:.15,envMapIntensity:1.2,side:THREE.DoubleSide,normalMap:scaleN,normalScale:new THREE.Vector2(.15,.15)},o),{swim});}
function cache(tk,k,f){tk.mc=tk.mc||{};return tk.mc[k]||(tk.mc[k]=f());}
const MAKE={
 whale:(tk,e)=>new Agent(new THREE.Mesh(gWhale(),patch(new THREE.MeshStandardMaterial({map:whaleTex,vertexColors:true,roughness:.5,side:THREE.DoubleSide,normalMap:rep(scaleN,40,6),normalScale:new THREE.Vector2(.3,.3)}),{tank:tk,swim:{amp:.55,k:.65,spd:1.6,nose:4.5,len:9}})),tk,e,{speed:.95,turn:.32,pitchMax:.18,feedPitch:.9,loop:{c:tk.oc.c,a:tk.oc.a,b:tk.oc.b,y0:tk.oc.wy,yA:1.4,dir:1,ph:0},roll:.6,nose:4.4,eatR:1.3,eatMax:3,centroid:true,feedMul:.6,scare:3,fill:.6}),
 manta:(tk,e)=>{const m=cache(tk,'manta',()=>patch(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.45,side:THREE.DoubleSide}),{tank:tk,flap:{amp:.85,spd:1.4,span:2.2}}));const d=Math.random()<.5?1:-1;
  return new Agent(new THREE.Mesh(gManta(),m),tk,e,{speed:1.05,turn:.6,pitchMax:.25,loop:{c:tk.oc.c,a:tk.oc.a*.85,b:tk.oc.b*.78,y0:rnd(tk.oc.y[0]+.6,tk.oc.y[1]-.4),yA:rnd(.6,1.6),dir:d,ph:rnd(0,6)},roll:1.1,nose:1,eatR:.9,eatMax:2,centroid:true,scare:2,fill:1});},
 shark:(tk,e)=>new Agent(new THREE.Mesh(gShark(),cache(tk,'shark',()=>fishMat(tk,{amp:.14,k:3.5,spd:5,nose:.8,len:1.6}))),tk,e,{speed:1.25,turn:1.1,pitchMax:.2,loop:{c:tk.oc.c,a:tk.oc.a*1.1,b:tk.oc.b*1.15,y0:rnd(tk.oc.y[0],tk.oc.y[0]+1.2),yA:.6,dir:1,ph:rnd(0,6)},roll:.7,nose:.75,eatR:.4,scare:1.6,fill:3}),
 grouper:(tk,e)=>new Agent(new THREE.Mesh(gGrouper(),cache(tk,'grouper',()=>fishMat(tk,{amp:.08,k:2.5,spd:3,nose:1,len:2}))),tk,e,{speed:.25,turn:.5,pitchMax:.2,reach:.8,wait:[3,9],box:tk.oc.gbox,nose:.95,eatR:.35,eatMax:2,scare:1.4,fill:3}),
 turtle:(tk,e)=>{const tg=new THREE.Group(),sm=mat(tk,0xffffff,{vertexColors:true,roughness:.4,normalMap:rep(scaleN,6,6),normalScale:new THREE.Vector2(.5,.5)}),skin=mat(tk,0xffffff,{vertexColors:true,roughness:.6,normalMap:rep(scaleN,8,8),normalScale:new THREE.Vector2(.9,.9)});
  const sg=new THREE.SphereGeometry(1,56,28),sp=sg.attributes.position;for(let i=0;i<sp.count;i++){let x=sp.getX(i),y=sp.getY(i),z=sp.getZ(i);if(y<0)y*=.28;z*=1-Math.max(0,-x)*.45;if(x<0)x*=1.12;sp.setXYZ(i,x*.5,y*.17,z*.42);}sg.computeVertexNormals();
  add(colorize(sg,(c,x,y,z)=>{if(y<-.008)c.set(0xd7c88e);else{c.set(0x5c4630);const u=x*14,w=z*16;if(Math.sin(u)*Math.sin(w)>.35)c.set(0x7a5a34);if(Math.abs(Math.sin(u*.5+Math.abs(z)*4))<.07||Math.abs(z)<.01)c.set(0xc0a070);if(Math.hypot(x,z)>.38)c.lerp(new THREE.Color(0x3a2a1a),.35);}c.convertSRGBToLinear();}),sm,0,0,0,tg);
  const sk=(c,t,a)=>{c.set(Math.sin(t*40)*Math.sin(a*6)>.3?0xd8c890:0x5f5e42).convertSRGBToLinear();};
  add(loft(.24,keyProf([[0,.015,.012],[.06,.05,.05],[.35,.07,.075],[.75,.06,.068],[1,.055,.062]]),sk,28,18),skin,.6,.015,0,tg);
  for(const s2 of[-1,1]){add(new THREE.SphereGeometry(.013,12,10),new THREE.MeshStandardMaterial({color:0x0a0a0a,roughness:.15}),.66,.045,s2*.05,tg);}
  const flG=(len,k)=>{const g=loft(len,keyProf(k),sk,24,12);g.translate(-len/2,0,0);return g;};
  const flip=[];for(const [x,s2,big] of[[.2,1,1],[.2,-1,1],[-.38,1,0],[-.38,-1,0]]){const p=new THREE.Group();p.position.set(x,-.02,s2*(big?.3:.2));tg.add(p);
   const g=flG(big?.5:.2,big?[[0,.02,.06],[.15,.022,.1],[.55,.016,.085],[1,.004,.015]]:[[0,.015,.05],[.4,.012,.06],[1,.003,.02]]);g.rotateY(-s2*(big?1.2:2.0));add(g,skin,0,0,0,p);flip.push([p,s2,big]);}
  return new Agent(tg,tk,e,{speed:.4,turn:.6,pitchMax:.35,reach:1,wait:[0,2],eatR:.3,fill:3,nose:.7,rad:.45,after:(a,t)=>{for(const [p,s2,b] of flip){if(b){p.rotation.x=-s2*Math.sin(t*1.6)*.55;p.rotation.y=s2*Math.sin(t*1.6-1)*.25;}else p.rotation.y=s2*Math.sin(t*1.6)*.2;}}});},
 jack:(tk,e)=>new School(gJack(),fishMat(tk,{amp:.04,k:7,spd:9,nose:.4,len:.8},{metalness:.45,roughness:.25}),26,tk,e,{spread:[2.2,.8,1.6],mill:.3,speed:1.5,agility:1.6,predator:true,scare:3,path:tk.oc.jPath,fill:.4}),
 sardine:(tk,e)=>new School(gSardine(),fishMat(tk,{amp:.012,k:25,spd:18,nose:.1,len:.2},{metalness:.45,roughness:.25}),460,tk,e,{spread:[3,1.3,2.2],mill:.2,speed:1.3,agility:2.5,eatMax:2,path:tk.oc.sPath,fill:.3}),
 clown:(tk,e)=>new Agent(new THREE.Mesh(gClown(),cache(tk,'clown',()=>fishMat(tk,{amp:.006,k:60,spd:22,nose:.045,len:.09}))),tk,e,{speed:.07,turn:4,reach:.04,home:tk.anemone,homeR:.16,wait:[0,1],nose:.04,eatR:.02,fill:8}),
 btang:(tk,e)=>new Agent(new THREE.Mesh(gBTang(),cache(tk,'btang',()=>fishMat(tk,{amp:.012,k:22,spd:12,nose:.125,len:.25}))),tk,e,{speed:.2,turn:2.2,reach:.15,wait:[0,1.5],nose:.12,eatR:.03,fill:6}),
 ytang:(tk,e)=>new Agent(new THREE.Mesh(gYTang(),cache(tk,'ytang',()=>fishMat(tk,{amp:.009,k:30,spd:12,nose:.09,len:.18}))),tk,e,{speed:.16,turn:2.4,reach:.12,wait:[0,2],nose:.09,eatR:.03,fill:6}),
 chromis:(tk,e)=>{const b=tk.box,c=b.getCenter(V(0,0,0)),sz=b.getSize(V(0,0,0));return new School(gChromis(),fishMat(tk,{amp:.005,k:70,spd:22,nose:.035,len:.07}),30,tk,e,{spread:[.2,.12,Math.min(.45,sz.z*.3)],mill:.6,speed:.22,agility:3,path:t=>V(c.x+sz.x*.3*Math.sin(t*.13),c.y+sz.y*.15*Math.sin(t*.31),c.z+sz.z*.15*Math.sin(t*.2)),fill:.6});},
 neon:(tk,e)=>{const b=tk.box,c=b.getCenter(V(0,0,0)),sz=b.getSize(V(0,0,0));return new School(gNeon(),fishMat(tk,{amp:.003,k:140,spd:30,nose:.017,len:.035},{roughness:.25}),40,tk,e,{spread:[Math.min(.5,sz.x*.18),.08,Math.min(.2,sz.z*.25)],mill:.35,speed:.12,agility:3,path:t=>V(c.x+sz.x*.3*Math.sin(t*.09),c.y+sz.y*.2*Math.sin(t*.23),c.z+sz.z*.15*Math.sin(t*.17)),fill:.8});},
 guppy:(tk,e)=>new Agent(new THREE.Mesh(gGuppy(),fishMat(tk,{amp:.004,k:120,spd:25,nose:.02,len:.04})),tk,e,{speed:.07,turn:4,reach:.05,wait:[0,1],nose:.02,eatR:.012,fill:8}),
 angel:(tk,e)=>new Agent(new THREE.Mesh(gAngel(),cache(tk,'angel',()=>fishMat(tk,{amp:.004,k:40,spd:10,nose:.06,len:.12}))),tk,e,{speed:.06,turn:1.6,reach:.08,wait:[1,4],pitchMax:.2,nose:.06,eatR:.015,fill:8}),
 seahorse:(tk,e)=>new Agent(new THREE.Mesh(gSeahorse(),cache(tk,'sh',()=>mat(tk,0xffffff,{vertexColors:true,roughness:.4,normalMap:rep(scaleN,2,2),normalScale:new THREE.Vector2(1,1)}))),tk,e,{speed:.02,turn:1,reach:.03,wait:[3,9],pitchMax:0,nose:.035,eatR:.025,fill:10,
  after:(ag,t)=>{ag.obj.position.y+=Math.sin(t*1.3+ag.th)*.004;ag.obj.rotation.x=Math.sin(t*.9+ag.th)*.08;}}),
 moon:(tk,e)=>new Jelly(tk,e,'moon'),nettle:(tk,e)=>new Jelly(tk,e,'nettle'),
 gecko:(tk,e)=>new Walker(tk,e,'gecko',{speed:.05,wait:[2,10],eatR:.025,fill:20}),
 beardie:(tk,e)=>new Walker(tk,e,'beardie',{speed:.11,wait:[3,12],eatR:.05,fill:14,bask:true,bob:true,und:.02,diet:['insect','veg']}),
 crested:(tk,e)=>new Climber(tk,e,'crested',{speed:.04}),cham:(tk,e)=>new Climber(tk,e,'cham',{speed:.03}),
 horned:(tk,e)=>new Hopper(tk,e,'horned',{fill:30}),dart:(tk,e)=>new Hopper(tk,e,'dart',{fill:20}),
 tortoise:(tk,e)=>new Tortoise(tk,e),python:(tk,e)=>new Snake(tk,e),
};

/* =================================================================
   建築與展位
   ================================================================= */
const TANKS={};const globalAnims=[];
const wallA=new THREE.MeshStandardMaterial({color:C(0x1f3c46),roughness:.9}),wallB=new THREE.MeshStandardMaterial({color:C(0x0c1a24),roughness:.9}),trim=new THREE.MeshStandardMaterial({color:C(0x3b2a1f),roughness:.5});
(function building(){const fa=add(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({map:woodTex,roughness:.45,envMapIntensity:.6}),0,0,8);fa.rotation.x=-Math.PI/2;
 const ca=add(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({color:C(0x0e1418)}),0,4.5,8);ca.rotation.x=Math.PI/2;
 box(.2,4.5,16,wallA,-12.1,2.25,8);box(.2,4.5,16,wallA,12.1,2.25,8);box(9.6,4.5,.2,wallA,-7.4,2.25,16.1);box(11.6,4.5,.2,wallA,6.4,2.25,16.1);box(3.2,1.3,.2,wallA,-1,3.85,16.1);
 for(const sx of[-1,1]){box(14,6,.2,wallB,sx*9,3,-.1);box(14,1.4,.2,wallB,sx*9,9.3,-.1);box(1,2.6,.2,wallB,sx*2.5,7.3,-.1);box(5,2.6,.2,wallB,sx*13.5,7.3,-.1);}box(4,6.8,.2,wallB,0,6.6,-.1);box(4.3,.2,.3,trim,0,3.2,0);box(.2,3.2,.3,trim,-2.1,1.6,0);box(.2,3.2,.3,trim,2.1,1.6,0);
 for(const [w,x,z,ry] of[[16,-11.98,8,Math.PI/2],[16,11.98,8,Math.PI/2]]){box(w,.12,.04,trim,x,1.05,z).rotation.y=ry;box(w,.14,.04,trim,x,.07,z).rotation.y=ry;}
 for(const x of[-6,0,6])for(const z of[4,12]){const l=add(new THREE.CircleGeometry(.35,24),new THREE.MeshBasicMaterial({color:C(0xfff0d8)}),x,4.49,z);l.rotation.x=Math.PI/2;}
 const fb=add(new THREE.PlaneGeometry(32,20),new THREE.MeshStandardMaterial({color:C(0x141b20),roughness:.25,metalness:.1}),0,0,-10);fb.rotation.x=-Math.PI/2;
 const cb=add(new THREE.PlaneGeometry(32,20),new THREE.MeshStandardMaterial({color:C(0x060c10)}),0,10,-10);cb.rotation.x=Math.PI/2;
 box(.2,10,20,wallB,-16.1,5,-10);box(.2,10,20,wallB,16.1,5,-10);box(5,10,.4,wallB,-13.5,5,-20.2);box(5,10,.4,wallB,13.5,5,-20.2);box(22,.3,.4,wallB,0,.15,-20.2);box(22,1.5,.4,wallB,0,9.25,-20.2);
 const fm=frameM;box(22.4,.22,.35,fm,0,8.5,-19.95);box(22.4,.22,.35,fm,0,.3,-19.95);box(.22,8.2,.35,fm,-11.1,4.4,-19.95);box(.22,8.2,.35,fm,11.1,4.4,-19.95);
 const gl=add(new THREE.PlaneGeometry(22,8.2),glassM,0,4.4,-19.98);gl.renderOrder=5;
 add(new THREE.PlaneGeometry(6.4,.8),new THREE.MeshBasicMaterial({map:textTex([['大 洋 水 槽　OCEAN',64]],1024,128,'#0b1a24')}),0,9.2,-19.98);
 const cs=rep(causticTex,5,2);const cf=add(new THREE.PlaneGeometry(26,11),new THREE.MeshBasicMaterial({map:cs,color:C(0x2a7fb8),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}),0,.012,-14.5);cf.rotation.x=-Math.PI/2;
 window.__oceanFloor=cf;globalAnims.push(t=>cs.offset.set(t*.012,t*.02));
 const bench=new THREE.MeshStandardMaterial({color:C(0x2c2a28),roughness:.6});for(const x of[-4.5,4.5]){box(3.2,.08,.6,bench,x,.45,-11);box(.12,.42,.5,bench,x-1.4,.21,-11);box(.12,.42,.5,bench,x+1.4,.21,-11);}
 const ppl=new THREE.MeshStandardMaterial({color:C(0x080b0e),roughness:1});
 for(const [x,z,h] of[[-4.2,-17.6,1.75],[-3.6,-17.9,1.62],[-3.1,-17.5,1.15],[6.4,-16.8,1.8]]){const bw=h*.15;add(new THREE.CylinderGeometry(bw,bw*.85,h*.84,12),ppl,x,h*.42,z);add(new THREE.SphereGeometry(h*.068,14,10),ppl,x,h*.93,z);}
 const dark=add(new THREE.PlaneGeometry(22,8.2),new THREE.MeshBasicMaterial({color:C(0x02060a)}),0,4.4,-20.3);window.__oceanDark=dark;})();

(function expansion(){
 const stone=new THREE.MeshStandardMaterial({color:C(0xd9d2c3),roughness:.75,normalMap:rep(scaleN,30,30),normalScale:new THREE.Vector2(.08,.08)}),stoneD=new THREE.MeshStandardMaterial({color:C(0xbdb3a1),roughness:.6}),dark=new THREE.MeshStandardMaterial({color:C(0x1a1d20),roughness:.4,metalness:.4});
 /* ===== 挑高大廳 x -14..14, z 16..40, 高 14 ===== */
 const fl=add(new THREE.PlaneGeometry(28,24),new THREE.MeshStandardMaterial({map:rep(marbleTex,7,6),roughness:.1,metalness:.05,envMapIntensity:1.4}),0,0,28);fl.rotation.x=-Math.PI/2;
 box(11.6,9.5,.3,stone,-8.4,9.25,16.05);box(13.6,9.5,.3,stone,7.4,9.25,16.05);box(3.2,5.6,.3,stone,-1,11.2,16.05);box(3.2,.5,.3,stone,-1,4.75,16.05);box(11.4,4.5,.12,stone,-8.3,2.25,16.27);box(13.4,4.5,.12,stone,7.3,2.25,16.27);box(3.2,1.3,.12,stone,-1,3.85,16.27);
 box(.25,3.4,.4,dark,-2.7,1.7,16.2);box(.25,3.4,.4,dark,.7,1.7,16.2);box(3.6,.25,.4,dark,-1,3.3,16.2);
 for(const sx of[-1,1]){const x=sx*14.15;box(.3,14,10,stone,x,7,21);box(.3,14,10,stone,x,7,35);box(.3,10.4,4,stone,x,8.8,28);
  box(.4,3.6,.25,dark,x-sx*.05,1.8,26);box(.4,3.6,.25,dark,x-sx*.05,1.8,30);box(.4,.25,4.2,dark,x-sx*.05,3.6,28);}
 box(10.2,14,.3,stone,-9.1,7,40.15);box(10.2,14,.3,stone,9.1,7,40.15);box(8,8.6,.3,stone,0,9.7,40.15);
 box(.3,5.4,.5,dark,-4,2.7,40.15);box(.3,5.4,.5,dark,4,2.7,40.15);box(8.3,.3,.5,dark,0,5.4,40.15);
 const sky=add(new THREE.PlaneGeometry(28,24),new THREE.MeshBasicMaterial({color:C(0xd2e8ff)}),0,14.4,28);sky.rotation.x=Math.PI/2;
 for(let x=-14;x<=14;x+=2)box(.14,.3,24,dark,x,14.1,28);for(let z=16;z<=40;z+=2)box(28,.3,.14,dark,0,14.1,z);
 box(28.6,.6,.8,stone,0,13.7,16.4);box(28.6,.6,.8,stone,0,13.7,39.6);box(.8,.6,24,stone,-13.7,13.7,28);box(.8,.6,24,stone,13.7,13.7,28);
 const rays=[];for(let i=0;i<8;i++){const r=add(new THREE.PlaneGeometry(rnd(1.5,3),16),new THREE.MeshBasicMaterial({map:rayTex,color:C(0xfff2d8),transparent:true,opacity:.06,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),rnd(-10,10),7,rnd(19,37));r.rotation.set(rnd(-.15,.15),rnd(0,3),.3);rays.push(r);}
 globalAnims.push(t=>rays.forEach((r,i)=>r.material.opacity=.045+.025*Math.sin(t*.3+i*1.7)));
 for(const sx of[-1,1]){box(2.2,.35,24,stone,sx*12.9,5,28);
  for(let z=18;z<=38;z+=4)glow(sx*12.9,4.72,z,.9,0xffe6c0,.6);}
 box(23.6,.35,2.2,stone,0,5,38.9);
 for(const [x,z] of[[-9.5,19.5],[9.5,19.5],[-9.5,36.5],[9.5,36.5]]){add(new THREE.CylinderGeometry(.55,.6,13.4,40),stoneD,x,6.7,z);box(1.5,.5,1.5,stone,x,.25,z);box(1.5,.4,1.5,stone,x,13.3,z);}
 for(const sx of[-1,1])add(new THREE.PlaneGeometry(1.6,6.5),new THREE.MeshBasicMaterial({map:vText([['生',150,.17],['態',150,.37],['館',150,.57],[sx<0?'ECOLOGY':'HALL',64,.82,'#bfe8ff']],256,1024,sx<0?'#0f3a46':'#1d3a26','#f2efe6'),side:THREE.DoubleSide}),sx*6.5,9.6,22);
 const sg=add(new THREE.PlaneGeometry(9,1.6),new THREE.MeshBasicMaterial({map:vText([['生 態 館',110,.42],['ECOLOGY HALL',40,.83,'#9fd8ff']],1024,192,'#0b1a24','#f4efe2')}),0,7.4,39.95);sg.rotation.y=Math.PI;
 const ds=(t1,t2,x,y,z,ry)=>{const m=add(new THREE.PlaneGeometry(2.6,.6),new THREE.MeshBasicMaterial({map:vText([[t1,64,.42],[t2,30,.83,'#9fd8ff']],512,118,'#0b1a24','#f4efe2')}),x,y,z);m.rotation.y=ry;};
 ds('水族展廳','AQUARIUM',-1,4.1,16.36,0);ds('爬蟲館','REPTILE HOUSE',-13.98,4.3,28,Math.PI/2);ds('鯊魚隧道','SHARK TUNNEL',13.98,4.3,28,-Math.PI/2);
 const leafM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,side:THREE.DoubleSide});
 function palm(x,y,z,h){const gs=[],tc=C(0x6a5440),lc=[C(0x3f8a3a),C(0x2f7a32),C(0x4c9a40)];let p=V(0,0,0);for(let i=0;i<8;i++){const q=V(Math.sin(i*.4)*.08,h*(i+1)/8,Math.cos(i*.5)*.06);gs.push(prim(cylBetween(p,q,.16-i*.01,.15-i*.01,10),tc));p=q;}
  for(let k=0;k<14;k++){const a=k/14*6.28+rnd(-.2,.2),L=rnd(1.6,2.4);let pv=p.clone();for(let j=1;j<=8;j++){const s=j/8,pt=V(p.x+Math.cos(a)*L*s,p.y+Math.sin(s*2.2)*.3*L-s*s*L*.55,p.z+Math.sin(a)*L*s);const w=.22*Math.sin(Math.PI*Math.min(1,s*1.1))+.02,px=-Math.sin(a)*w,pz=Math.cos(a)*w;
    gs.push(fin([[pv.x,pv.y,pv.z],[pt.x+px,pt.y-.03,pt.z+pz],[pt.x,pt.y,pt.z],[pt.x-px,pt.y-.03,pt.z-pz]],[lc[k%3]]));pv=pt;}}
  add(merge(gs),leafM,x,y,z);}
 const pm=new THREE.MeshStandardMaterial({color:C(0x2a2622),roughness:.5});
 for(const [x,z] of[[-11.5,18.5],[11.5,18.5],[-11.5,37.5],[11.5,37.5]]){box(1.8,.8,1.8,pm,x,.4,z);palm(x,.8,z,rnd(4,5.5));}

 const bm=new THREE.MeshStandardMaterial({color:C(0x2c2622),roughness:.5});for(let i=0;i<10;i++){const a=i/10*6.28;const b=box(1.9,.42,.55,bm,Math.cos(a)*4.6,.21,28+Math.sin(a)*4.6);b.rotation.y=-a+Math.PI/2;}
 const atL=new THREE.PointLight(C(0xfff0dc),1.2,34,1.3);atL.position.set(0,11,28);scene.add(atL);
 /* ===== 爬蟲館 x -36..-14, z 20..36, 高 5 ===== */
 const rf=add(new THREE.PlaneGeometry(22,16),new THREE.MeshStandardMaterial({map:rep(slateTex,6,4),roughness:.55}),-25,0,28);rf.rotation.x=-Math.PI/2;
 const sand=new THREE.MeshStandardMaterial({color:C(0x7a6248),roughness:.9,normalMap:rep(scaleN,12,4),normalScale:new THREE.Vector2(.3,.3)});
 box(.3,5,16,sand,-36.15,2.5,28);box(22.4,5,.3,sand,-25,2.5,36.15);box(22.4,5,.3,sand,-25,2.5,19.85);
 const rc=add(new THREE.PlaneGeometry(22,16),new THREE.MeshStandardMaterial({color:C(0x2a1c14),roughness:.8}),-25,5,28);rc.rotation.x=Math.PI/2;
 const beam=new THREE.MeshStandardMaterial({color:C(0x4a3424),roughness:.7});for(let x=-35;x<=-15;x+=2.5)box(.25,.3,16,beam,x,4.85,28);
 const shade=new THREE.MeshStandardMaterial({color:C(0x1a1a1a),side:THREE.DoubleSide,metalness:.5,roughness:.4});
 for(const [x,z] of[[-30,24],[-30,32],[-20,24],[-20,32],[-25,24],[-25,32]]){add(cylBetween(V(x,5,z),V(x,3.95,z),.008,.008),dark);add(new THREE.ConeGeometry(.28,.3,24,1,true),shade,x,3.8,z);glow(x,3.6,z,1.5,0xffc890,.75);}
 {const gs=[],tc=C(0x5a4636);const rec=(p,d,L,r,k)=>{const q=p.clone().addScaledVector(d,L);gs.push(prim(cylBetween(p,q,r,r*.7,10),tc));if(k<4)for(let i=0;i<2;i++)rec(q,d.clone().add(V(rnd(-.9,.9),rnd(.1,.5),rnd(-.9,.9))).normalize(),L*.72,r*.7,k+1);};rec(V(0,.4,0),V(0,1,0),1.5,.28,0);
  add(merge(gs),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,normalMap:rep(scaleN,2,8),normalScale:new THREE.Vector2(1,1)}),-25,0,28);add(new THREE.CylinderGeometry(1.5,1.6,.45,40),new THREE.MeshStandardMaterial({color:C(0x5a4a3a),roughness:.8}),-25,.22,28);}
 const rs=add(new THREE.PlaneGeometry(4.4,.9),new THREE.MeshBasicMaterial({map:vText([['爬 蟲 館',72,.42],['REPTILE HOUSE',32,.83,'#ffcf9a']],768,158,'#2a1a10','#f6e8d2')}),-14.4,4.2,28);rs.rotation.y=-Math.PI/2;
 const rl=new THREE.PointLight(C(0xffc890),1,22,1.5);rl.position.set(-25,4,28);scene.add(rl);
 /* ===== 鯊魚隧道（沿 x 方向，z=28，半徑 2.4） ===== */
 const R=2.4;box(27.2,.1,4.4,new THREE.MeshStandardMaterial({color:C(0x0f1418),roughness:.25,metalness:.3}),27.6,-.04,28);
 for(const sz of[-1,1])box(27,.03,.05,new THREE.MeshBasicMaterial({color:C(0x4fc8ff)}),27.5,.02,28+sz*2);
 const tube=add(new THREE.CylinderGeometry(R,R,27,96,1,true,0,Math.PI).rotateZ(Math.PI/2),glassM,27.5,0,28);tube.renderOrder=5;
 for(let x=14.5;x<=41;x+=2.5){const rib=add(new THREE.TorusGeometry(R,.05,8,48,Math.PI),frameM,x,0,28);rib.rotation.y=Math.PI/2;}
 window.__tunnelDark=add(new THREE.CylinderGeometry(R+.06,R+.06,27,48,1,true,0,Math.PI).rotateZ(Math.PI/2),new THREE.MeshBasicMaterial({color:C(0x02060a),side:THREE.DoubleSide}),27.5,0,28);
 const ec=add(new THREE.CircleGeometry(R,48,0,Math.PI),new THREE.MeshStandardMaterial({color:C(0x0b1a24)}),41,0,28);ec.rotation.y=-Math.PI/2;
 const ts=add(new THREE.PlaneGeometry(2.8,.6),new THREE.MeshBasicMaterial({map:vText([['鯊魚隧道・終點',56,.45],['SHARK TUNNEL',28,.85,'#9fd8ff']],512,110,'#0b1a24','#f4efe2')}),40.9,1.3,28);ts.rotation.y=-Math.PI/2;
 const tl=new THREE.PointLight(C(0x3f9fff),1.2,18,1.4);tl.position.set(28,1.6,28);scene.add(tl);
})();

const SLOTS=[
 {id:'a',sz:'M',wall:V(-12,0,3.5),f:V(1,0,0)},{id:'b',sz:'S',wall:V(-12,0,8),f:V(1,0,0)},{id:'c',sz:'M',wall:V(-12,0,12.5),f:V(1,0,0)},
 {id:'d',sz:'L',wall:V(12,0,4.5),f:V(-1,0,0)},{id:'e',sz:'M',wall:V(12,0,11.5),f:V(-1,0,0)},
 {id:'f',sz:'S',wall:V(-8,0,16),f:V(0,0,-1)},{id:'g',sz:'S',wall:V(-4,0,16),f:V(0,0,-1)},{id:'h',sz:'M',wall:V(2.5,0,16),f:V(0,0,-1)},{id:'i',sz:'S',wall:V(8,0,16),f:V(0,0,-1)},
 {id:'j',sz:'C',wall:V(-5,0,0),f:V(0,0,1)},{id:'k',sz:'C',wall:V(5,0,0),f:V(0,0,1)},{id:'x',sz:'XL',wall:V(0,0,-20),f:V(0,0,1)},
 {id:'t',sz:'T',wall:V(0,0,28),f:V(0,0,1)},{id:'u',sz:'U',wall:V(0,0,0),f:V(0,0,1)},
 {id:'r1',sz:'L',wall:V(-36,0,28),f:V(1,0,0)},{id:'r2',sz:'M',wall:V(-30,0,36),f:V(0,0,-1)},{id:'r3',sz:'M',wall:V(-21,0,36),f:V(0,0,-1)},
 {id:'r4',sz:'S',wall:V(-31,0,20),f:V(0,0,1)},{id:'r5',sz:'S',wall:V(-27,0,20),f:V(0,0,1)},{id:'r6',sz:'M',wall:V(-20,0,20),f:V(0,0,1)}];
function computeSlot(s){const z=SZ[s.sz];s.rot=Math.atan2(s.f.x,s.f.z);
 if(s.sz==='R'){s.origin=V(0,0,0);s.base=0;s.view=V(0,0,72);s.vr=18;s.obst=null;return;}
 if(s.sz==='PD'||(s.sz==='PEN'||s.sz==='AV')){s.origin=s.wall.clone();s.base=0;s.view=s.wall.clone();s.vr=Math.max(z.w,z.d)/2+2.2;const qx=(Math.abs(s.f.x)>.5?z.d:z.w)/2+.15,qz=(Math.abs(s.f.x)>.5?z.w:z.d)/2+.15;s.obst=[s.wall.x-qx,s.wall.x+qx,s.wall.z-qz,s.wall.z+qz];return;}
 if(s.sz==='XL'){s.origin=V(0,0,-20);s.view=V(0,0,-9);s.vr=12;s.base=0;}
 else if(s.sz==='U'){s.origin=V(0,0,0);s.view=V(28,0,28);s.vr=13.6;s.base=0;s.obst=null;return;}
 else if(s.sz==='T'){s.origin=s.wall.clone().addScaledVector(s.f,z.r);s.base=0;s.view=s.wall.clone();s.vr=z.r+5;const q=z.r+.45;s.obst=[s.wall.x-q,s.wall.x+q,s.wall.z-q,s.wall.z+q];return;}
 else if(s.sz==='C'){s.origin=s.wall.clone().addScaledVector(s.f,.15+2*z.r);s.base=0;s.view=s.origin.clone().addScaledVector(s.f,1.6);s.vr=1.9;}
 else{s.origin=s.wall.clone().addScaledVector(s.f,z.d+.03);s.base=z.base;s.view=s.origin.clone().addScaledVector(s.f,s.sz==='L'?2.6:s.sz==='M'?1.8:1.2);s.vr=s.sz==='L'?3.2:s.sz==='M'?2.4:1.5;}
 const w=s.sz==='C'?2*z.r+.4:s.sz==='XL'?0:z.w+.12,d=s.sz==='C'?2*z.r+.4:s.sz==='XL'?0:z.d+.1,c=s.wall.clone().addScaledVector(s.f,d/2);
 s.obst=s.sz==='XL'?null:(Math.abs(s.f.x)>.5?[c.x-d/2,c.x+d/2,c.z-w/2,c.z+w/2]:[c.x-w/2,c.x+w/2,c.z-d/2,c.z+d/2]);}
SLOTS.forEach(computeSlot);
function placeholder(s){const g=new THREE.Group();g.position.copy(s.origin);g.position.y=s.fy||0;g.rotation.y=s.rot;scene.add(g);const z=SZ[s.sz];
 const dm=new THREE.LineDashedMaterial({color:0x6fd3ff,dashSize:.12,gapSize:.08,transparent:true,opacity:.75});
 if(s.sz==='R'){const sg=add(new THREE.PlaneGeometry(2.2,1.1),new THREE.MeshBasicMaterial({map:textTex([['空展位・亞馬遜河',50],['蜿蜒河道 5 m 寬・可搭船',36,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true,side:THREE.DoubleSide}),0,1.5,58.5,g);sg.rotation.y=Math.PI;}
 else if(s.sz==='PD'||(s.sz==='PEN'||s.sz==='AV')){const R=false,w=R?26:z.w,d=R?11:z.d,h=R?3:s.sz==='PD'?.5:.7,cz=R?-d/2:0,yy=R?h/2:s.sz==='PD'?-.1:h/2;const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d)),dm);l.position.set(0,yy,cz);l.computeLineDistances();g.add(l);
  const nm=R?'亞馬遜河展區':s.sz==='PD'?'戶外池塘':'戶外放養區';const sgn=add(new THREE.PlaneGeometry(1.8,.9),new THREE.MeshBasicMaterial({map:textTex([[`空展位・${nm}`,50],[`${w} × ${d} m`,38,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true,side:THREE.DoubleSide}),0,R?1.6:1.1,R?.15:-(d/2+.2),g);if(!R)sgn.rotation.y=Math.PI;}
 else if(s.sz==='U'){const sg=add(new THREE.PlaneGeometry(2.4,1.2),new THREE.MeshBasicMaterial({map:textTex([['空展位・鯊魚隧道',50],['26 × 16 × 8 m',36,'#9fd8ff'],['走進隧道設置',34,'#ffc46b']]),transparent:true}),18,1.5,28,g);sg.rotation.y=-Math.PI/2;}
 else if(s.sz==='T'){const r=z.r;add(new THREE.CylinderGeometry(r+.15,r+.25,z.cb,72),new THREE.MeshStandardMaterial({color:C(0x161a1e),roughness:.25,metalness:.6}),0,z.cb/2,-r,g);
  const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(r,r,z.h,24)),dm);l.position.set(0,z.cb+z.h/2,-r);l.computeLineDistances();g.add(l);
  for(const a of[0,Math.PI/2,Math.PI,-Math.PI/2]){const sg=add(new THREE.PlaneGeometry(1.6,.8),new THREE.MeshBasicMaterial({map:textTex([['空展位・塔型',54],['直徑 5 × 高 8.5 m',36,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true,side:THREE.DoubleSide}),Math.sin(a)*(r+.3),2.2,-r+Math.cos(a)*(r+.3),g);sg.rotation.y=a;}}
 else if(s.sz==='XL'){const sg=add(new THREE.PlaneGeometry(6,3),new THREE.MeshBasicMaterial({map:textTex([['空展位・巨型',64],['30 × 14 × 11 m',44,'#9fd8ff'],['走近設置大洋水槽',40,'#ffc46b']],1024,512),transparent:true}),0,4.4,-.1,g);}
 else if(s.sz==='C'){box(z.r*2+.3,.5,z.r*2+.3,cabM,0,.25,-z.r,g).geometry=new THREE.CylinderGeometry(z.r+.13,z.r+.2,.5,40);const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(z.r,z.r,2.4,16)),dm);l.position.set(0,1.7,-z.r);l.computeLineDistances();g.add(l);
  const sg=add(new THREE.PlaneGeometry(1,.5),new THREE.MeshBasicMaterial({map:textTex([['空展位・圓柱',54],['直徑 1.5 × 高 2.4 m',36,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true}),0,1.6,.05,g);}
 else{box(z.w+.1,z.base,z.d+.1,cabM,0,z.base/2,-z.d/2,g);const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(z.w,z.h,z.d)),dm);l.position.set(0,z.base+z.h/2,-z.d/2);l.computeLineDistances();g.add(l);
  const sw=Math.min(z.w*.8,1.2);add(new THREE.PlaneGeometry(sw,sw/2),new THREE.MeshBasicMaterial({map:textTex([[`空展位・${z.n}`,54],[`${z.w} × ${z.d} × ${z.h} m`,40,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true}),0,z.base+z.h/2,.02,g);}
 s.ph=g;}

/* =================================================================
   水槽實體
   ================================================================= */
function buildTank(s,st){ensureSt(st);const z=SZ[s.sz],ht=HT[st.type];const g=new THREE.Group();g.position.copy(s.origin);g.position.y=s.base+(s.fy||0);g.rotation.y=s.rot;scene.add(g);
 const tk={slot:s,sz:s.sz,type:st.type,st,group:g,creatures:[],anims:[],base:s.base};
 if(s.sz==='C'||s.sz==='T'){tk.r=z.r;tk.cb=z.cb;tk.ch=z.h;tk.H=z.cb+z.h;}else if(s.sz==='U'){tk.H=7;}else if(s.sz==='R'){tk.W=26;tk.D=11;tk.H=4;}else if(s.sz==='PD'){tk.W=z.w;tk.D=z.d;tk.H=1;}else if((s.sz==='PEN'||s.sz==='AV')){tk.W=z.w;tk.D=z.d;tk.H=1;}else if(s.sz!=='XL'){tk.W=z.w;tk.D=z.d;tk.H=z.h;}else{tk.H=11;}
 if(ht.aqua){const cyl=s.sz==='C'||s.sz==='T';const top=cyl?tk.H-.05:s.sz==='XL'?10:s.sz==='U'?7:s.sz==='R'?-.25:s.sz==='PD'?-.02:s.base+(s.fy||0)+tk.H-.05,depth=cyl?tk.ch:s.sz==='XL'?11:s.sz==='U'?8:s.sz==='R'?2.6:s.sz==='PD'?1:tk.H;
  const hz=s.sz==='PD'||s.sz==='R';const fn=hz?V(0,1,0):s.f.clone();tk.u={n:{value:fn},d:{value:s.sz==='PD'?-.02:s.sz==='R'?-.25:s.f.dot(s.origin)},wc:{value:C(ht.wc)},den:{value:ht.den},top:{value:top},depth:{value:depth},deep:{value:ht.deep},mode:{value:s.sz==='U'?1:0},cyl:{value:V(0,28,2.4)}};tk.wc0=C(ht.wc);tk.den0=ht.den;}
 DECO[st.type==='ocean'&&s.sz==='U'?'tunnel':st.type==='reef'&&s.sz==='T'?'reefT':st.type](tk);
 if(ht.aqua){if(s.sz==='S'||s.sz==='M'||s.sz==='L')encAqua(tk);tk.food=new Food(tk,tk.foodCfg);}else{if((s.sz!=='PEN'&&s.sz!=='AV'))encTerra(tk);tk.tfood=new TFood(tk);}
 if(s.sz==='XL'){window.__oceanDark.visible=false;window.__oceanFloor.material.opacity=.55;}if(s.sz==='U')window.__tunnelDark.visible=false;if(s.sz==='R'&&window.__ghFloor){window.__ghFloor.visible=false;if(window.__ghPath)window.__ghPath.visible=false;}
 TANKS[s.id]=tk;s.ph.visible=false;for(const e of st.animals)spawnAnimal(tk,e);for(const eg of st.eggs)addEggMesh(tk,eg);return tk;}
function spawnAnimal(tk,e){try{const c=MAKE[e.sp](tk,e);c.entry=e;c.tk=c.tk||tk;c.root=c.obj||c.g||null;c.base=c.root?c.root.scale.x:1;c._fed=e.fed||0;tk.creatures.push(c);applySize(c);return c;}catch(err){console.error(err);}}
function applySize(c){if(c.root&&!(c instanceof School))c.root.scale.setScalar(c.base*clamp(c.entry.size??1,.25,1));}
function removeTank(s){const tk=TANKS[s.id];if(!tk)return;if(tk.onRemove)tk.onRemove();if(s.sz==='R'&&window.__ghFloor){window.__ghFloor.visible=true;if(window.__ghPath)window.__ghPath.visible=true;}for(const c of tk.creatures)c.dispose();if(tk.food)tk.food.dispose();if(tk.tfood)tk.tfood.dispose();
 scene.remove(tk.group);tk.group.traverse(o=>{if(o.geometry)o.geometry.dispose();});delete TANKS[s.id];s.ph.visible=true;if(s.sz==='U')window.__tunnelDark.visible=true;if(s.sz==='XL'){window.__oceanDark.visible=true;window.__oceanFloor.material.opacity=0;}}
const used=tk=>tk.st.animals.reduce((a,e)=>a+SP[e.sp].cost,0);

/* =================================================================
   存檔：雲端（帳號）優先，否則本機
   ================================================================= */
let S={v:2,t:Date.now(),nid:1,tanks:{}},docRef=null,saving=false,dirty=false,loaded=false;
function markDirty(){dirty=true;}
async function save(){if(!loaded||saving||!dirty)return;dirty=false;saving=true;S.t=Date.now();const data=JSON.parse(JSON.stringify(S));
 try{if(docRef)await docRef.set(data);else localStorage.setItem('museum-v2',JSON.stringify(data));}catch(e){try{localStorage.setItem('museum-v2',JSON.stringify(data));}catch(_){}}saving=false;}
setInterval(save,5000);setInterval(()=>{if(loaded&&Object.keys(S.tanks).length)dirty=true;},90000);
function applyOffline(){const el=clamp((Date.now()-(S.t||Date.now()))/1000,0,7*86400);if(el<60)return;
 for(const id in S.tanks){const st=ensureSt(S.tanks[id]);st.clean=Math.max(0,(st.clean??100)-.02*.05*el);const d=ENVDEF[st.type];if(d&&d.hb!=null)st.hum=d.hb+(st.hum-d.hb)*Math.exp(-el*.002);
  for(const e of st.animals){const fedRatio=clamp(e.hunger/60,0,1);if(e.size<1&&!SP[e.sp].school)e.size=Math.min(1,e.size+GROW*.3*el*fedRatio);e.hunger=Math.max(5,e.hunger-SP[e.sp].hr*.05*el);}}
 const h=el/3600;if(h>.2)toast(h<24?`離開了 ${h.toFixed(1)} 小時，動物們有點餓了`:`離開了 ${Math.round(h/24)} 天，快去看看大家`,4200);}
async function load(){let got=null;const done=()=>{loaded=true;for(const s of SLOTS)placeholder(s);for(const id in S.tanks){const s=SLOTS.find(x=>x.id===id);if(s)buildTank(s,S.tanks[id]);}
  if((S.v||2)<3){for(const id in S.tanks)for(const e of S.tanks[id].animals)if(e.size!=null&&e.size<.85&&!/寶寶/.test(e.name))e.size=.85;S.v=3;markDirty();}
  applyOffline();refreshChips();if(!Object.keys(S.tanks).length)toast('走到發光的虛線空展位，設置你的第一個展缸',5000);};
 const timer=new Promise(r=>setTimeout(()=>r('timeout'),10000));
 try{if(window.claude&&claude.use){const res=await Promise.race([(async()=>{const db=await claude.use('db'),us=await claude.use('user');if(!db||!us)return null;const id=await us.id();if(!id)return null;
   docRef=db.doc('data/users/'+id+'/museum');const sn=await docRef.get();return sn.exists?sn.data():{};})(),timer]);
   if(res&&res!=='timeout'&&res.tanks)got=JSON.parse(JSON.stringify(res));if(res==='timeout')docRef=null;}}catch(e){docRef=null;}
 if(!got){try{const l=JSON.parse(localStorage.getItem('museum-v2'));if(l&&l.tanks)got=l;}catch(e){}}
 if(got)S=Object.assign(S,got);done();}

/* =================================================================
   玩家移動
   ================================================================= */
const player={x:0,y:0,z:38.5,yaw:0,pitch:.05};
const AREAS=[[-11.6,11.6,.45,15.6],[-1.7,1.7,-.7,.7],[-15.6,15.6,-19.4,-.45],[-2.3,.3,15.3,16.7],[-13.6,13.6,16.6,39.6],[-14.7,-13.3,26.5,29.5],[-35.6,-14.4,20.4,35.6],[13.3,40.6,26.5,29.5]];
const OBST=[[-6.1,-2.9,-11.3,-10.7],[2.9,6.1,-11.3,-10.7],[-10.3,-8.7,18.7,20.3],[8.7,10.3,18.7,20.3],[-10.3,-8.7,35.7,37.3],[8.7,10.3,35.7,37.3],[-12.4,-10.6,17.6,19.4],[10.6,12.4,17.6,19.4],[-12.4,-10.6,36.6,38.4],[10.6,12.4,36.6,38.4],[5.9,9.1,34.6,36.4],[-26.6,-23.4,26.4,29.6]];
const AREAS2=[],OBST2=[],STAIRS=[];
const lvl=()=>player.y>2.5?1:0;
function stairAt(x,z){for(const s of STAIRS)if(x>s.x0&&x<s.x1&&z>s.z0&&z<s.z1)return s;return null;}
function stairY(s,x,z){const v=s.ax==='x'?x:z;return s.y0+(s.y1-s.y0)*clamp((v-s.zb)/(s.zt-s.zb),0,1);}
const BLOCK=[];
function okPos(x,z){const st=stairAt(x,z);if(st)return Math.abs(stairY(st,x,z)-player.y)<.7;const L=lvl(),A=L?AREAS2:AREAS,O=L?OBST2:OBST;if(!L&&BLOCK.some(f=>f(x,z)))return false;
 return A.some(a=>x>a[0]&&x<a[1]&&z>a[2]&&z<a[3])&&!O.concat(SLOTS.filter(s=>s.obst&&((s.fy||0)>2.5?1:0)===L).map(s=>s.obst)).some(o=>x>o[0]-.3&&x<o[1]+.3&&z>o[2]-.3&&z<o[3]+.3);}
const joy={id:null,x:0,y:0,dx:0,dy:0},look={id:null,x:0,y:0,sx:0,sy:0,t:0},keys={};const joyEl=$('#joy'),knob=joyEl.firstElementChild;
canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&joy.id===null&&e.clientX<innerWidth*.45&&e.clientY>innerHeight*.4){joy.id=e.pointerId;joy.x=e.clientX;joy.y=e.clientY;joy.dx=joy.dy=0;joyEl.style.left=e.clientX+'px';joyEl.style.top=e.clientY+'px';joyEl.style.display='block';knob.style.transform='';}
 else if(look.id===null){look.id=e.pointerId;look.x=look.sx=e.clientX;look.y=look.sy=e.clientY;look.t=performance.now();}canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===joy.id){let dx=e.clientX-joy.x,dy=e.clientY-joy.y;const l=Math.hypot(dx,dy);if(l>48){dx*=48/l;dy*=48/l;}joy.dx=dx/48;joy.dy=dy/48;knob.style.transform=`translate(${dx}px,${dy}px)`;}
 else if(e.pointerId===look.id){player.yaw-=(e.clientX-look.x)*.0045/ZOOM;player.pitch=clamp(player.pitch-(e.clientY-look.y)*.0045/ZOOM,-1.25,1.25);look.x=e.clientX;look.y=e.clientY;}});
const endP=e=>{if(e.pointerId===joy.id){joy.id=null;joy.dx=joy.dy=0;joyEl.style.display='none';}else if(e.pointerId===look.id){look.id=null;if(Math.hypot(e.clientX-look.sx,e.clientY-look.sy)<8&&performance.now()-look.t<400)pick(e.clientX,e.clientY);}};
canvas.addEventListener('pointerup',endP);canvas.addEventListener('pointercancel',endP);
addEventListener('keydown',e=>{if(e.target.tagName!=='INPUT')keys[e.key.toLowerCase()]=true;});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function movePlayer(dt){if(window.__ride)return 0;let f=-joy.dy,r=joy.dx;if(keys.w||keys.arrowup)f+=1;if(keys.s||keys.arrowdown)f-=1;if(keys.d||keys.arrowright)r+=1;if(keys.a||keys.arrowleft)r-=1;
 const l=Math.hypot(f,r);if(l>1){f/=l;r/=l;}if(l<.05)return 0;const run=keys.shift||Math.hypot(joy.dx,joy.dy)>.9;const sp=(run?6.2:3.8)*dt,sy=Math.sin(player.yaw),cy=Math.cos(player.yaw);
 const dx=(-sy*f+cy*r)*sp,dz=(-cy*f-sy*r)*sp;if(okPos(player.x+dx,player.z+dz)){player.x+=dx;player.z+=dz;}else if(okPos(player.x+dx,player.z))player.x+=dx;else if(okPos(player.x,player.z+dz))player.z+=dz;const st=stairAt(player.x,player.z);if(st)player.y=stairY(st,player.x,player.z);else player.y=lvl()?(player.y>8?11.3:5):0;return Math.min(1,l);}
function goTo(s){player.y=s.fy||0;if(s.sz==='R'){Object.assign(player,{x:0,y:0,z:57.2,yaw:Math.PI,pitch:-.3});return;}
 if(s.sz==='PD'||(s.sz==='PEN'||s.sz==='AV')){const z=SZ[s.sz];Object.assign(player,{x:s.wall.x,z:s.wall.z-z.d/2-1.6,yaw:Math.PI,pitch:s.sz==='PD'?-.5:-.38});return;}
 if(s.sz==='U'){Object.assign(player,{x:16.5,z:28,yaw:-Math.PI/2,pitch:.15});return;}if(s.sz==='T'){Object.assign(player,{x:0,z:35.5,yaw:0,pitch:.32});return;}const d=s.sz==='XL'?10:s.sz==='L'?2.2:s.sz==='M'?1.4:s.sz==='C'?1.5:.95;const p=s.origin.clone().addScaledVector(s.f,d);Object.assign(player,{x:p.x,z:p.z,yaw:Math.atan2(s.f.x,s.f.z),pitch:s.sz==='XL'?.12:s.sz==='L'?-.02:-.12});}

/* =================================================================
   飼養系統：環境、親密度、成長、繁殖、便便、日誌
   ================================================================= */
const ENVDEF={fresh:{t:26},reef:{t:25},seahorse:{t:24},jelly:{t:17},ocean:{t:25},desert:{t:30,h:35,hb:30},tropical:{t:25,h:80,hb:55},river:{t:28},pond:{t:22},yard:{t:28,h:70,hb:70}};
const GROW=.00009;
function ensureSt(st){const d=ENVDEF[st.type]||{t:25};if(st.temp==null)st.temp=d.t;if(d.h!=null&&st.hum==null)st.hum=d.h;st.log=st.log||[];st.eggs=st.eggs||[];if(st.clean==null)st.clean=100;
 for(const e of st.animals){if(e.bond==null)e.bond=0;if(e.size==null)e.size=1;if(e.mood==null)e.mood=80;}return st;}
function logEv(st,x){st.log.unshift({t:Date.now(),x});if(st.log.length>30)st.log.length=30;}
const isAqua=st=>!!HT[st.type].aqua;
const stage=e=>SP[e.sp].school?'群體':e.size<.6?'幼體':e.size<.9?'亞成體':'成體';
function envIssues(st,e){const p=SP[e.sp],o=[];if(p.tr){if(st.temp<p.tr[0])o.push(`太冷（適溫 ${p.tr[0]}–${p.tr[1]}°C）`);else if(st.temp>p.tr[1])o.push(`太熱（適溫 ${p.tr[0]}–${p.tr[1]}°C）`);}
 if(p.hu&&st.hum!=null){if(st.hum<p.hu[0])o.push(`太乾（濕度 ${p.hu[0]}–${p.hu[1]}%）`);else if(st.hum>p.hu[1])o.push(`太潮濕（濕度 ${p.hu[0]}–${p.hu[1]}%）`);}
 if(e.hunger<35)o.push('肚子餓了');if(st.clean<50)o.push(isAqua(st)?'水質變差':'環境髒了');return o;}
function moodTarget(st,e,over){const p=SP[e.sp];let m=100-Math.max(0,50-e.hunger)*1.4-Math.max(0,60-st.clean)*.9-(over?25:0);
 if(p.tr)m-=Math.max(0,p.tr[0]-st.temp,st.temp-p.tr[1])*8;if(p.hu&&st.hum!=null)m-=Math.max(0,p.hu[0]-st.hum,st.hum-p.hu[1])*1.1;return clamp(m+e.bond*.08,0,100);}
/* 愛心特效 */
const heartTex=ctex(64,64,(x)=>{x.fillStyle='#ff6b8a';x.beginPath();x.moveTo(32,54);x.bezierCurveTo(4,34,10,8,32,22);x.bezierCurveTo(54,8,60,34,32,54);x.fill();});
const fx=[];function hearts(wp,n=4){for(let i=0;i<n;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false}));sp.position.copy(wp).add(V(rnd(-.08,.08),rnd(0,.06),rnd(-.08,.08)));const s=rnd(.05,.09);sp.scale.set(s,s,1);scene.add(sp);fx.push({o:sp,l:0,v:rnd(.15,.3),d:i*.15});}}
function mistFx(tk){const n=160,p=new Float32Array(n*3),vy=[];for(let i=0;i<n;i++){p[i*3]=rnd(-tk.W/2,tk.W/2);p[i*3+1]=tk.H-.05;p[i*3+2]=-rnd(0,tk.D);vy.push(rnd(.15,.4));}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.Points(g,new THREE.PointsMaterial({color:0xeaf6ff,size:.012,transparent:true,opacity:.8,depthWrite:false}));tk.group.add(m);
 fx.push({o:m,l:0,mist:true,vy,tk});tk.fogT=1;}
function updFx(dt){for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.l+=dt;
 if(f.mist){const p=f.o.geometry.attributes.position;for(let k=0;k<p.count;k++)p.setY(k,Math.max(0,p.getY(k)-f.vy[k]*dt));p.needsUpdate=true;f.o.material.opacity=Math.max(0,.8-f.l*.3);if(f.l>3){f.tk.group.remove(f.o);fx.splice(i,1);}continue;}
 if(f.l<f.d){f.o.visible=false;continue;}f.o.visible=true;f.o.position.y+=f.v*dt;f.o.material.opacity=Math.max(0,1-(f.l-f.d)/1.4);if(f.l-f.d>1.4){scene.remove(f.o);fx.splice(i,1);}}}
/* 蛋 */
const eggM=new THREE.MeshStandardMaterial({color:C(0xf3eee2),roughness:.6});
function addEggMesh(tk,eg){if(!tk.tfood)return;const p=(tk.hide||tk.feedSpot||V(0,0,-.2)).clone();p.x+=rnd(-.03,.03);p.z+=rnd(-.03,.03);p.y=tk.groundY(p.x,p.z);
 const g=new THREE.Group();for(let i=0;i<2;i++)add(new THREE.SphereGeometry(1,14,10).scale(.012,.016,.012),eggM,i*.022,.012,0,g);g.position.copy(p);tk.group.add(g);eg._m=g;}
function checkBreed(tk){const st=tk.st,cap=SZ[tk.sz].cap;const by=k=>st.animals.filter(e=>e.sp===k);
 const gp=by('guppy');if(gp.length>=2&&used(tk)+1<=cap&&gp.reduce((a,e)=>a+e.mood,0)/gp.length>70&&Math.random()<.3){const n=Math.min(cap-used(tk),1+(Math.random()*2|0));for(let i=0;i<n;i++)newAnimal(tk,'guppy',{size:.3,name:'孔雀魚寶寶'});logEv(st,`孔雀魚生了 ${n} 隻寶寶`);toast(`🎉 ${HT[st.type].n}的孔雀魚生寶寶了！`,3500);}
 const gk=by('gecko');if(gk.length>=2&&!st.eggs.length&&used(tk)+2<=cap&&gk.reduce((a,e)=>a+e.mood,0)/gk.length>72&&Math.random()<.2){const eg={sp:'gecko',hatch:Date.now()+8*60e3};st.eggs.push(eg);addEggMesh(tk,eg);logEv(st,'豹紋守宮下蛋了，約 8 分鐘後孵化');toast('🥚 豹紋守宮下蛋了！',3500);}
 for(let i=st.eggs.length-1;i>=0;i--){const eg=st.eggs[i];if(Date.now()>=eg.hatch){if(eg._m)tk.group.remove(eg._m);st.eggs.splice(i,1);const n=Math.min(2,Math.max(1,Math.floor((cap-used(tk))/SP[eg.sp].cost)));for(let k=0;k<n;k++)newAnimal(tk,eg.sp,{size:.35,name:SP[eg.sp].n+'寶寶'});logEv(st,`${SP[eg.sp].n}的蛋孵化了（${n} 隻）`);toast(`🐣 ${SP[eg.sp].n}寶寶孵化了！`,3500);}}
 markDirty();}
function newAnimal(tk,k,o={}){const p=SP[k];const n=tk.st.animals.filter(e=>e.sp===k).length+1;const e={id:S.nid++,sp:k,name:o.name||`${p.n.replace(/（群）/,'')}${n>1?' '+n:''}`,hunger:80,mood:80,bond:0,size:p.school?1:(o.size??.85),born:Date.now()};
 tk.st.animals.push(e);spawnAnimal(tk,e);refreshChips();return e;}
/* 日夜（依你的裝置時間） */
let dayF=1;function updDay(){const d=new Date(),h=d.getHours()+d.getMinutes()/60;dayF=clamp(Math.sin((h-6)/12*Math.PI)*1.8,0,1);window.__night=dayF<.15;
 sunL.intensity=.25+.75*dayF;sunL.color.setRGB(1,.92+.08*dayF,.82+.18*dayF);hemi.intensity=.18+.15*dayF;if(window.__sky)window.__sky.material.color.setRGB(.06+.94*dayF,.09+.91*dayF,.18+.82*dayF);
 if(window.__lamps)window.__lamps.forEach(l=>l.visible=dayF<.4);}

/* =================================================================
   介面
   ================================================================= */
let tt;function toast(s,ms=2600){const e=$('#toast');e.textContent=s;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),ms);}
const allSp=()=>Object.keys(SP).length;
let SPOTS=[];
function refreshChips(){const ch=$('#chips');ch.innerHTML='';const shown=new Set();for(const id in S.tanks)for(const e of S.tanks[id].animals)shown.add(e.sp);
 const p=document.createElement('button');p.className='chip on';p.textContent=`館藏 ${shown.size}/${allSp()}`;p.onclick=()=>openCollection(shown);ch.appendChild(p);
 const mk=(n,f)=>{const b=document.createElement('button');b.className='chip';b.textContent=n;b.onclick=f;ch.appendChild(b);};
 for(const [n,f] of SPOTS)mk(n,f);for(const s of SLOTS){const st=S.tanks[s.id];if(st&&!['XL','U','R'].includes(s.sz))mk((st.name||HT[st.type].n),()=>goTo(s));}}
function openCollection(shown){sheet('館藏圖鑑',Object.entries(SP).map(([k,s])=>`<div class="row2"><span>${shown.has(k)?'✅':'⬜'} ${s.n}</span><span class="mut">${HT[s.hab].n}</span></div>`).join(''));}
function sheet(title,html,after){$('#shT').textContent=title;$('#shC').innerHTML=html;$('#sheet').classList.add('open');if(after)after($('#shC'));}
$('#shX').onclick=()=>{$('#sheet').classList.remove('open');openMg=null;};$('#sheet').addEventListener('pointerdown',e=>{if(e.target.id==='sheet'){$('#sheet').classList.remove('open');openMg=null;}});
let near=null,openMg=null;
function nearestSlot(){let b=null,bd=1e9;const L=lvl();for(const s of SLOTS){if(((s.fy||0)>2.5?1:0)!==L)continue;const d=Math.hypot(player.x-s.view.x,player.z-s.view.z)/s.vr;if(d<bd){bd=d;b=s;}}return bd<1?b:null;}
const DIMTXT=s=>{const z=SZ[s.sz];return s.sz==='C'?'直徑 1.5 × 高 2.4 m':s.sz==='T'?'直徑 5 × 高 8.5 m':s.sz==='U'?'26 × 16 × 8 m（可走入）':s.sz==='XL'?'30 × 14 × 11 m':s.sz==='R'?'26 × 11 m・水深 4.5 m':`${z.w} × ${z.d}${z.h&&s.sz!=='PD'&&(s.sz!=='PEN'&&s.sz!=='AV')?' × '+z.h:''} m`;};
function bar(){const s=nearestSlot();near=s;const el=$('#bar');if(!s){el.style.display='none';return;}el.style.display='block';const st=S.tanks[s.id],z=SZ[s.sz];
 if(!st){$('#bT').textContent=`空展位・${z.n}`;$('#bD').textContent=DIMTXT(s);setBtns([['設置展缸','feed',()=>setupSheet(s)]]);return;}
 const tk=TANKS[s.id],n=st.animals.length,avg=n?Math.round(st.animals.reduce((a,e)=>a+(e.mood||70),0)/n):0,aq=isAqua(st);
 $('#bT').textContent=`${st.name||HT[st.type].n}・${z.n}`;
 $('#bD').textContent=`🌡 ${st.temp}°C${st.hum!=null?`・💧 ${Math.round(st.hum)}%`:''}・${aq?'水質':'清潔'} ${Math.round(st.clean)}%・${n?`${n} 筆・心情 ${avg}`:'還沒有動物'}`;
 const b=[['餵食','feed',()=>feed(tk)],[aq?'換水':'清潔','',()=>clean(tk)]];if(st.type==='river'){b.length=0;b.push(['🚣 搭船','feed',()=>startRide(tk)],['餵食','',()=>feed(tk)],['換水','',()=>clean(tk)]);}if(st.hum!=null&&st.type!=='yard')b.push(['噴霧','',()=>mist(tk)]);b.push(['管理','',()=>manage(s)]);setBtns(b);}
let lastBtns='',lastNear=null;function setBtns(arr){const key=arr.map(a=>a[0]).join('|');if(key===lastBtns&&near===lastNear)return;lastBtns=key;lastNear=near;const b=$('#bB');b.innerHTML='';for(const [t,c,f] of arr){const x=document.createElement('button');x.className='btn '+c;x.textContent=t;x.onclick=f;b.appendChild(x);}}
function setupSheet(s){const opts=Object.entries(HT).filter(([k,h])=>h.sz.includes(s.sz));
 sheet(`設置展缸・${SZ[s.sz].n}`,opts.map(([k,h])=>`<button class="opt" data-k="${k}"><b>${h.aqua?'💧':'🪨'} ${h.n}</b><span>${h.d}</span><span class="mut">可飼養：${Object.values(SP).filter(p=>p.hab===k||p.hab2===k).map(p=>p.n).join('、')}</span></button>`).join(''),
  c=>c.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const k=b.dataset.k;S.tanks[s.id]={type:k,clean:100,animals:[],built:Date.now(),log:[]};logEv(S.tanks[s.id],`${HT[k].n}設置完成`);buildTank(s,S.tanks[s.id]);markDirty();refreshChips();lastBtns='';
   $('#sheet').classList.remove('open');toast(`${HT[k].n}設置完成！按「管理」放入動物`,3200);}));}
function feed(tk){const st=tk.st;if(!st.animals.length){toast('缸裡還沒有動物');return;}
 if(tk.food){const k=tk.food.spawn();toast(k?`投入${tk.foodCfg.name}`:'上一批食物還沒吃完');if(k)logEv(st,`餵了${tk.foodCfg.name}`);}
 else{const d={};for(const e of st.animals){const di=SP[e.sp].diet||'';if(di.includes('insect'))d.insect=Math.min(14,(d.insect||0)+(e.sp==='dart'?2:3));if(di.includes('veg'))d.veg=(d.veg||0)+1;if(di.includes('fruit'))d.fruit=1;if(di==='mouse'&&e.hunger<70)d.mouse=1;}
  if(d.veg)d.veg=Math.min(3,d.veg);if(st.animals.every(e=>SP[e.sp].diet==='mouse')&&!d.mouse){toast('球蟒還不餓，牠們一週左右才吃一次');return;}
  const out=tk.tfood.spawn(d);toast(out.length?`放入 ${out.join('、')}`:'目前不需要餵食');if(out.length)logEv(st,`餵了${out.join('、')}`);}
 st.clean=Math.max(0,st.clean-3);markDirty();}
function clean(tk){tk.st.clean=100;if(tk.tfood)tk.tfood.items.filter(i=>i.type==='poop').forEach(i=>tk.tfood.consume(i));logEv(tk.st,isAqua(tk.st)?'換水、刷藻':'清理環境、擦玻璃');markDirty();toast(isAqua(tk.st)?'換水、刷藻完成，水變清了':'清理排泄物、擦玻璃完成');}
function mist(tk){const st=tk.st;st.hum=Math.min(100,st.hum+18);mistFx(tk);logEv(st,`噴霧，濕度 ${Math.round(st.hum)}%`);markDirty();toast(`噴霧完成・濕度 ${Math.round(st.hum)}%`);}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const col=v=>v>60?'var(--acc)':v>30?'var(--warn)':'var(--bad)';
const heartStr=b=>'♥'.repeat(Math.round(b/20))+'♡'.repeat(5-Math.round(b/20));
const ago=t=>{const m=(Date.now()-t)/60000;return m<1?'剛剛':m<60?`${m|0} 分鐘前`:m<1440?`${(m/60)|0} 小時前`:`${(m/1440)|0} 天前`;};
function manage(s){openMg=s;const st=S.tanks[s.id],tk=TANKS[s.id],cap=SZ[s.sz].cap;const rng=[];for(const e of st.animals){const p=SP[e.sp];if(p.tr&&!rng.find(r=>r[0]===p.n))rng.push([p.n,p.tr]);}
 const lo=rng.length?Math.max(...rng.map(r=>r[1][0])):null,hi=rng.length?Math.min(...rng.map(r=>r[1][1])):null;
 const rows=st.animals.map(e=>`<div class="res"><div><b>${esc(e.name)}</b> <span class="mut">${SP[e.sp].n}・${stage(e)}</span></div><div class="bars"><i style="width:${e.hunger}%;background:${col(e.hunger)}"></i></div><div class="mut sm">飽食 ${Math.round(e.hunger)}・心情 ${Math.round(e.mood)}・<span style="color:#ff8aa5">${heartStr(e.bond)}</span></div><button class="btn sm" data-rm="${e.id}">移出</button></div>`).join('')||'<div class="mut">還沒有動物，從下面加入吧。</div>';
 const opts=Object.entries(SP).filter(([k])=>spOK(k,tk)).map(([k,p])=>{const full=used(tk)+p.cost>cap||(p.max&&st.animals.filter(e=>e.sp===k).length>=p.max);return`<button class="btn add ${full?'dis':''}" data-sp="${k}">＋ ${p.n} <span class="mut">${p.cost} 格${p.tr?`・${p.tr[0]}–${p.tr[1]}°C`:''}</span></button>`;}).join('');
 const blocked=Object.entries(SP).filter(([k,p])=>(p.hab===st.type||p.hab2===st.type)&&!spOK(k,tk)).map(([k,p])=>`${p.n}（需要${SZ[p.min].n}以上）`);
 const eggs=st.eggs.map(eg=>`<div class="mut sm">🥚 ${SP[eg.sp].n}的蛋・約 ${Math.max(0,Math.ceil((eg.hatch-Date.now())/60000))} 分鐘後孵化</div>`).join('');
 sheet(`${st.name||HT[st.type].n}`,`<div class="mut">空間 ${used(tk)}/${cap} 格・${isAqua(st)?'水質':'清潔'} ${Math.round(st.clean)}%</div>
  <label class="mut sm">展缸名稱</label><input id="tName" maxlength="16" value="${esc(st.name||HT[st.type].n)}">
  <h4>環境</h4><div class="envrow"><span>🌡 ${isAqua(st)?'水溫':'溫度'}</span><input type="range" id="tTemp" min="10" max="38" value="${st.temp}"><b id="tTv">${st.temp}°C</b></div>
  ${lo!=null?`<div class="mut sm">住民都舒服的範圍：${lo<=hi?`${lo}–${hi}°C`:'<span style="color:var(--bad)">沒有交集，要分缸養</span>'}</div>`:''}
  ${st.hum!=null?`<div class="envrow"><span>💧 濕度</span><b>${Math.round(st.hum)}%</b>${st.type!=='yard'?'<button class="btn sm" id="tMist">噴霧</button>':''}</div>`:''}
  <h4>住民</h4>${rows}${eggs}<h4>加入動物（新來的是亞成體，會慢慢長成成體）</h4><div class="adds">${opts}</div>${blocked.length?`<div class="mut sm">這個尺寸放不下：${blocked.join('、')}</div>`:''}
  <h4>飼養日誌</h4>${st.log.slice(0,12).map(l=>`<div class="row2"><span>${esc(l.x)}</span><span class="mut sm">${ago(l.t)}</span></div>`).join('')||'<div class="mut sm">還沒有紀錄</div>'}
  <h4></h4><button class="btn danger" id="demo">拆除展缸</button>`,c=>{
  c.querySelector('#tName').onchange=ev=>{st.name=ev.target.value.trim().slice(0,16)||'';markDirty();refreshChips();lastBtns='';};
  const tr=c.querySelector('#tTemp');tr.oninput=()=>{st.temp=+tr.value;c.querySelector('#tTv').textContent=st.temp+'°C';};tr.onchange=()=>{logEv(st,`溫度調到 ${st.temp}°C`);markDirty();};
  const mb=c.querySelector('#tMist');if(mb)mb.onclick=()=>{mist(tk);manage(s);};
  c.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{const id=+b.dataset.rm,i=st.animals.findIndex(e=>e.id===id);if(i<0)return;const e=st.animals[i];const cr=tk.creatures.find(k=>k.entry===e);if(cr){cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}
   st.animals.splice(i,1);logEv(st,`${e.name} 移出`);markDirty();refreshChips();toast(`${e.name} 已移出`);manage(s);});
  c.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{const k=b.dataset.sp,p=SP[k];if(b.classList.contains('dis')){toast(p.max&&st.animals.filter(e=>e.sp===k).length>=p.max?`一個展缸只能養 ${p.max} 隻${p.n}`:'空間不夠了，換大一點的展缸吧');return;}
   const e=newAnimal(tk,k);logEv(st,`${e.name} 加入`);markDirty();toast(`歡迎 ${e.name}！`);manage(s);});
  const d=c.querySelector('#demo');d.onclick=()=>{if(d.dataset.c){removeTank(s);delete S.tanks[s.id];markDirty();refreshChips();lastBtns='';$('#sheet').classList.remove('open');openMg=null;toast('展缸已拆除');}else{d.dataset.c=1;d.textContent='再按一次確認拆除（動物也會一起移出）';}};});}
/* 點選：動物或便便 */
let sel=null;
function pick(sx,sy){let best=null,bd=60,poop=null;const v=V(0,0,0);for(const id in TANKS){const tk=TANKS[id];
  for(const c of tk.creatures){if(!c.pickPos)continue;v.copy(c.pickPos());tk.group.localToWorld(v);if(v.distanceTo(camera.position)>35)continue;v.project(camera);if(v.z>1||v.z<-1)continue;const d=Math.hypot((v.x+1)/2*innerWidth-sx,(1-v.y)/2*innerHeight-sy);if(d<bd){bd=d;best=c;poop=null;}}
  if(tk.tfood)for(const it of tk.tfood.items){if(it.type!=='poop')continue;v.copy(it.pos);tk.group.localToWorld(v);if(v.distanceTo(camera.position)>6)continue;v.project(camera);const d=Math.hypot((v.x+1)/2*innerWidth-sx,(1-v.y)/2*innerHeight-sy);if(d<bd){bd=d;best=null;poop=[tk,it];}}}
 if(poop){const [tk,it]=poop;tk.tfood.consume(it);tk.st.clean=Math.min(100,tk.st.clean+4);markDirty();toast('撿起便便 🧻 清潔 +4');return;}
 sel=best;const el=$('#pick');if(!best){el.style.display='none';return;}const e=best.entry,p=SP[e.sp];$('#pName').value=e.name;$('#pSp').textContent=`${p.n}・${p.s}`;$('#pZ').textContent=p.z;$('#pF').textContent=p.f;el.style.display='block';updPick();}
function updPick(){if(!sel)return;const e=sel.entry,st=sel.tk.st;$('#pH').style.width=e.hunger+'%';$('#pH').style.background=col(e.hunger);$('#pM').style.width=e.mood+'%';$('#pM').style.background=col(e.mood);
 $('#pHt').textContent=Math.round(e.hunger);$('#pMt').textContent=e.mood>75?'很開心':e.mood>45?'普通':'不太好';{const L=(SP[e.sp].len||0)*(SP[e.sp].school?1:e.size*(e.g?e.g.sz:1)*(sel.base||1));$('#pSt').textContent=`${stage(e)}・${SP[e.sp].school?'單隻':'目前'}約 ${L>=1?L.toFixed(1)+' m':Math.round(L*100)+' cm'}`;}$('#pBond').textContent=heartStr(e.bond);
 const tips=envIssues(st,e);$('#pTip').textContent=tips.length?'⚠ '+tips.join('、'):'✓ 狀態良好';$('#pTip').style.color=tips.length?'var(--warn)':'var(--acc)';
 const cd=Math.max(0,20-(Date.now()-(e._ia||0))/1000);$('#pAct').textContent=cd>0?`互動（${Math.ceil(cd)}）`:'互動 ♥';}
$('#pName').onchange=ev=>{if(!sel)return;const old=sel.entry.name;sel.entry.name=ev.target.value.trim().slice(0,16)||SP[sel.entry.sp].n;logEv(sel.tk.st,`${old} 改名為 ${sel.entry.name}`);markDirty();toast(`牠現在叫 ${sel.entry.name}`);};
$('#pX').onclick=()=>{$('#pick').style.display='none';sel=null;};
$('#pAct').onclick=()=>{if(!sel)return;const e=sel.entry;if(Date.now()-(e._ia||0)<20000){toast('讓牠休息一下再互動');return;}e._ia=Date.now();e.bond=Math.min(100,e.bond+3);
 const w=sel.tk.group.localToWorld(sel.pickPos().clone());hearts(w);sel.beg=8;const aq=isAqua(sel.tk.st);
 const msg=aq?['牠游過來看你了','牠在玻璃前轉了一圈','牠好像認得你了']:['牠眨了眨眼','牠抬頭看著你','牠慢慢靠近你'];toast(`${e.name}：${msg[Math.random()*msg.length|0]}`);if(e.bond>=100&&!e._b100){e._b100=1;logEv(sel.tk.st,`${e.name} 的親密度滿了 ♥`);}markDirty();updPick();};

/* =================================================================
   主迴圈
   ================================================================= */
let ZOOM=1;function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;const base=w<h?60:50;camera.fov=2*Math.atan(Math.tan(base*Math.PI/360)/ZOOM)*180/Math.PI;camera.updateProjectionMatrix();}
const clock=new THREE.Clock();let bob=0,uiT=0,brT=0,dayT=99;
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;T.value=t;
 const m=movePlayer(dt);bob+=dt*m*8;camera.position.set(player.x,player.y+1.6+Math.sin(bob)*.022*m,player.z);camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
 dayT+=dt;if(dayT>20){dayT=0;updDay();}brT+=dt;const doBreed=brT>45;if(doBreed)brT=0;
 for(const id in TANKS){const tk=TANKS[id],st=tk.st,s=tk.slot;
  if(s.sz==='C'||s.sz==='T'){const c=s.origin.clone().addScaledVector(s.f,-tk.r),dx=camera.position.x-c.x,dz=camera.position.z-c.z,l=Math.hypot(dx,dz)||1;tk.u.n.value.set(dx/l,0,dz/l);tk.u.d.value=(dx*c.x+dz*c.z)/l+tk.r;}
  tk.attract=null;if(near===s&&!['XL','U'].includes(s.sz)&&loaded){const lp=tk.group.worldToLocal(V(player.x,player.y+1.4,player.z));
   if(tk.cyl){const dx=lp.x,dz=lp.z-tk.cz,l=Math.hypot(dx,dz)||1;tk.attract=V(dx/l*tk.r*.62,clamp(lp.y,tk.box.min.y+.1,tk.box.max.y-.1),tk.cz+dz/l*tk.r*.62);}
   else if(tk.box&&!tk.walk){const b=tk.box,p=b.clampPoint(lp,V());if(s.sz==='PD'||s.sz==='R')p.y=b.max.y-.08;else p.z=b.max.z-.02;if(tk.confine)tk.confine(p,.4);tk.attract=p;}
   else if(tk.walk){const p=tk.walk.clampPoint(lp,V());if((s.sz!=='PEN'&&s.sz!=='AV'))p.z=tk.walk.max.z-.04;p.y=tk.groundY(p.x,p.z);tk.attract=p;}}
  for(const c of tk.creatures){c.update(dt,t);if(c.beg>0)c.beg-=dt;}for(const a of tk.anims)a(t,dt);if(tk.food)tk.food.update(dt,t);if(tk.tfood)tk.tfood.update(dt,t);
  st.clean=Math.max(0,st.clean-.015*dt);const dirt=1-st.clean/100;const d=ENVDEF[st.type];if(d&&d.hb!=null)st.hum+=(d.hb-st.hum)*dt*.002;
  if(tk.u){tk.u.wc.value.copy(tk.wc0).lerp(C(0x4a5a2a),dirt*.6);tk.u.den.value=tk.den0*(1+dirt*1.6);}if(tk.smudge){tk.fogT=Math.max(0,(tk.fogT||0)-dt*.08);tk.smudge.material.opacity=Math.max(dirt*.32,tk.fogT*.35);tk.smudge.material.color.setRGB(.6+.35*tk.fogT,.6+.35*tk.fogT,.5+.45*tk.fogT);}
  const over=used(tk)>SZ[s.sz].cap;
  for(const c of tk.creatures){const e=c.entry;e.hunger=Math.max(0,e.hunger-SP[e.sp].hr*dt);e.mood=lerp(e.mood??80,moodTarget(st,e,over),Math.min(1,dt*.2));
   if(e.size<1&&!SP[e.sp].school&&e.hunger>40){const o=stage(e);e.size=Math.min(1,e.size+GROW*dt);applySize(c);const n=stage(e);if(n!==o){logEv(st,`${e.name} 長成${n}了`);toast(`🌱 ${e.name} 長成${n}了！`);markDirty();}}
   if((e.fed||0)>c._fed){if(tk.tfood&&SP[e.sp].diet)(c._pq=c._pq||[]).push(t+rnd(40,110));c._fed=e.fed;}
   if(c._pq&&c._pq.length&&t>c._pq[0]){c._pq.shift();const p=c.pickPos().clone();p.x+=rnd(-.04,.04);p.z+=rnd(-.04,.04);tk.tfood.addPoop(p,SP[e.sp].ps||1);st.clean=Math.max(0,st.clean-4);}}
  if(doBreed)checkBreed(tk);}
 for(const a of globalAnims)a(t,dt);updFx(dt);
 uiT+=dt;if(uiT>.3){uiT=0;if(loaded)bar();updPick();}
 renderer.render(scene,camera);}
function boot(){addEventListener('resize',resize);resize();updDay();toast('讀取你的生態館…',2000);load();loop();}
