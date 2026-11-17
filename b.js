/* ===== b.js：生物模型（真實尺寸，公尺）與行為 ===== */

/* ---------- 水生模型 ---------- */
function gWhale(){const L=9,W=new THREE.Color(1,1,1),fc=[W],uv=[.985,.1];
 const prof=t=>{const w=t<.06?.9*Math.sqrt(t/.06):.9*(1-Math.pow((t-.06)/.94,1.25)*.93);const h=t<.06?.5*Math.sqrt(t/.06):(t<.38?.5+.25*((t-.06)/.32):.75*(1-Math.pow((t-.38)/.62,1.15)*.92));return[h,w];};
 return merge([loft(L,prof,c=>c.copy(W),56,28),fin([[1.3,.62,0],[.1,1.75,0],[.35,.6,0]],fc,uv),fin([[-1.6,.42,0],[-2.25,1.0,0],[-2.2,.4,0]],fc,uv),
  ...pecs(2.6,1.5,.9,-.35,.72,1.6,.45,fc,uv),...pecs(-.9,-1.5,-1.6,-.45,.28,.3,.3,fc,uv),
  fin([[-4.25,0,0],[-4.2,.25,0],[-5.6,2.2,0],[-5.0,.1,0],[-5.25,-1.2,0],[-4.2,-.2,0]],fc,uv),...eyes(4.05,.08,.8,.06,C(0x080808),uv)]);}
function gManta(){const S=2.2,nu=34,nv=12,P=[],Cc=[],I=[],top=C(0x1b1f25),bot=C(0xeceeee),wh=C(0xc9cdcf),c=new THREE.Color();
 const xl=s=>1.0-1.15*Math.pow(s,1.3),xt=s=>-.9+.75*Math.pow(s,.8);
 for(const side of[1,-1]){const base=P.length/3;for(let i=0;i<=nu;i++){const z=(i/nu*2-1)*S,s=Math.abs(z)/S;for(let j=0;j<=nv;j++){const v=j/nv,x=xl(s)+(xt(s)-xl(s))*v,th=.21*(1-Math.pow(s,1.4))*Math.sin(Math.PI*v)+.012;P.push(x,side*th,z);
   c.copy(side>0?top:bot);if(side>0&&s>.18&&s<.48&&v<.38)c.lerp(wh,.75);if(side<0&&s<.12&&v<.12)c.set(0x222222);Cc.push(c.r,c.g,c.b);}}
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=base+i*(nv+1)+j,b=a+nv+1;I.push(a,b,a+1,b,b+1,a+1);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',F(P,3));g.setAttribute('color',F(Cc,3));g.setAttribute('uv',F(new Array(P.length/3*2).fill(.5),2));g.setIndex(I);g.computeVertexNormals();
 const dk=[top];return merge([g.toNonIndexed(),fin([[1.0,0,.26],[.72,0,.36],[1.4,-.06,.34]],dk),fin([[1.0,0,-.26],[.72,0,-.36],[1.4,-.06,-.34]],dk),fin([[-.8,.03,0],[-.8,-.03,0],[-2.1,0,0]],dk),fin([[-.85,0,.03],[-.85,0,-.03],[-2.1,0,0]],dk)]);}
function gShark(){const L=1.6,g=C(0x6f7b84),w=C(0xe9edef),k=C(0x111418);
 return merge([loft(L,fusi(.15,.13,.3,.07,.62),(c,t,a)=>c.copy(Math.cos(a)<-.25?w:g),36,14),fin([[.2,.12,0],[-.06,.36,0],[-.12,.1,0]],[g,k,g]),fin([[-.42,.06,0],[-.5,.13,0],[-.52,.05,0]],[g]),
  fin([[-.7,0,0],[-.7,.05,0],[-1.02,.33,0],[-.9,.02,0],[-.96,-.16,0],[-.72,-.05,0]],[g,g,k,g,k,g]),...pecs(.32,.16,.02,-.07,.1,.32,.1,[g,g,k]),...eyes(.63,.035,.065,.012)]);}
function gGrouper(){const L=2,b=C(0x5a4a32),y=C(0xb89b52),bl=C(0x8a7a5a),fb=C(0x4a3c28);
 return merge([loft(L,fusi(.38,.3,.35,.25,.55),(c,t,a,x,yy,z)=>{c.copy(Math.cos(a)<-.45?bl:b);if(Math.sin(x*11)*Math.sin(yy*13+z*9)>.45)c.copy(y);},40,16),
  fin([[.45,.3,0],[.2,.48,0],[-.2,.48,0],[-.62,.38,0],[-.65,.15,0]],[fb]),fin([[-.25,-.25,0],[-.45,-.42,0],[-.65,-.15,0]],[fb]),caudal(-.9,.12,.32,.3,.95,[fb]),...pecs(.55,.35,.2,-.08,.28,.28,.12,[fb]),...eyes(.82,.12,.17,.025)]);}
function gJack(){const L=.8,g=C(0x5c6c77),s=C(0xc0cad0),f=C(0x3e464c);
 return merge([loft(L,fusi(.17,.06,.38,.06,.6),(c,t,a)=>c.copy(Math.cos(a)>.3?g:s),24,10),fin([[.06,.15,0],[-.02,.23,0],[-.06,.14,0]],[f]),fin([[-.06,.14,0],[-.12,.18,0],[-.3,.06,0]],[f]),
  fin([[-.04,-.14,0],[-.1,-.18,0],[-.28,-.06,0]],[f]),caudal(-.36,.02,.17,.16,.62,[f]),...pecs(.14,.08,-.12,-.03,.05,.05,.03,[f]),...eyes(.3,.035,.03,.012)]);}
function gSardine(){const L=.2,b=C(0x2f5276),s=C(0xc9d6df),w=C(0xeef3f6),f=C(0x9fb0ba);
 return merge([loft(L,fusi(.022,.016,.3,.12,.55),(c,t,a)=>c.copy(Math.cos(a)>.35?b:Math.cos(a)>-.2?s:w),14,8),caudal(-.09,.006,.035,.022,.55,[f]),fin([[.01,.019,0],[-.008,.032,0],[-.02,.018,0]],[f])]);}
function gClown(){const L=.09,o=C(0xff7417),w=C(0xffffff),k=C(0x111111);
 const band=t=>(t>.2&&t<.28)||(t>.5&&t<.6)||(t>.84&&t<.88)?1:((t>.185&&t<.295)||(t>.485&&t<.615)||(t>.825&&t<.895))?2:0;
 return merge([loft(L,fusi(.026,.013,.4,.3,.6),(c,t)=>{const b=band(t);c.copy(b===1?w:b===2?k:o);},32,12),fin([[.015,.02,0],[0,.034,0],[-.03,.022,0]],[o,k,o]),fin([[-.01,-.018,0],[-.02,-.03,0],[-.03,-.015,0]],[o,k,o]),
  caudal(-.038,.008,.018,.016,.95,[o,o,k,k,k,o]),...pecs(.015,.006,-.004,-.004,.012,.012,.006,[o,o,k]),...eyes(.032,.006,.009,.0035)]);}
function gBTang(){const L=.25,bl=C(0x1f55d6),k=C(0x0a0f22),y=C(0xffd21f);
 return merge([loft(L,fusi(.09,.022,.45,.15,.7),(c,t,a)=>{const ca=Math.cos(a);c.copy(bl);if(ca>.1&&t>.18&&t<.86&&!(ca>.5&&t>.38&&t<.62))c.copy(k);if(t>.88)c.copy(y);},34,12),
  fin([[.06,.08,0],[0,.1,0],[-.09,.075,0],[-.1,.04,0]],[bl,k,k,bl]),fin([[.02,-.08,0],[-.04,-.095,0],[-.09,-.06,0],[-.1,-.03,0]],[bl,k,k,bl]),caudal(-.115,.012,.05,.045,.7,[y,y,k,y,k,y]),...pecs(.05,.03,0,-.01,.02,.035,.015,[y]),...eyes(.085,.02,.017,.005)]);}
function gYTang(){const L=.18,y=C(0xffd400),w=C(0xffffff);
 return merge([loft(L,fusi(.08,.016,.42,.15,.8),(c,t)=>c.copy(t>.9?w:y),30,12),fin([[.05,.07,0],[.0,.13,0],[-.07,.1,0],[-.075,.04,0]],[y]),fin([[.02,-.07,0],[-.03,-.12,0],[-.07,-.09,0],[-.075,-.03,0]],[y]),
  caudal(-.082,.012,.035,.035,.85,[y]),...pecs(.04,.02,0,-.01,.015,.025,.012,[y]),...eyes(.065,.018,.012,.0045)]);}
function gChromis(){const L=.07,g=C(0x6ad6cb),b=C(0x47b2b6),f=C(0x9ee6df);
 return merge([loft(L,fusi(.02,.009,.4,.15,.6),(c,t,a)=>c.copy(Math.cos(a)>.2?b:g),14,8),caudal(-.032,.004,.016,.014,.5,[f]),fin([[.01,.016,0],[-.005,.026,0],[-.025,.012,0]],[f]),...eyes(.024,.004,.006,.0025)]);}
function gNeon(){const L=.035,s=C(0xc8d4dc),bl=C(0x1ee8ff),r=C(0xe01e2a),f=C(0xdde6ea);
 return merge([loft(L,fusi(.0065,.0045,.35,.2,.6),(c,t,a)=>{const ca=Math.cos(a);c.copy(s);if(ca>.05&&ca<.6&&t>.12&&t<.85)c.copy(bl);if(ca<-.05&&t>.45)c.copy(r);},16,10),caudal(-.016,.0015,.008,.006,.55,[f]),...eyes(.012,.0015,.002,.0012)]);}
function gAngel(){const L=.12,s=C(0xd9dee1),k=C(0x1a1a1a),f=C(0xe8ecee);
 const band=t=>(t>.18&&t<.23)||(t>.44&&t<.5)||(t>.72&&t<.76);
 return merge([loft(L,fusi(.05,.009,.45,.3,.75),(c,t)=>c.copy(band(t)?k:s),28,10),fin([[.02,.04,0],[-.075,.135,0],[-.05,.03,0]],[s,k,s]),fin([[.02,-.04,0],[-.075,-.14,0],[-.05,-.03,0]],[s,k,s]),
  fin([[.03,-.03,.003],[-.01,-.13,.003],[.02,-.03,.003]],[f]),caudal(-.056,.008,.03,.03,.9,[f]),...eyes(.04,.012,.007,.0035,C(0x8a1010))]);}
function gGuppy(){const L=.04,s=C(0xbfc8c6),tc=new THREE.Color().setHSL(rnd(0,1),.85,.55).convertSRGBToLinear(),k=C(0x111111);
 return merge([loft(L,fusi(.009,.006,.35,.25,.6),(c,t)=>c.copy(t>.7?tc:s),16,8),caudal(-.018,.003,.022,.014,.98,[tc]),fin([[-.004,.008,0],[-.012,.014,0],[-.016,.007,0]],[tc]),...eyes(.014,.002,.004,.0015,k)]);}
function gSeahorse(){const y=C(0xe8b52e),d=C(0xb07c18);
 const raw=[[.006,.112,.0105],[0,.1,.011],[-.004,.085,.013],[-.002,.07,.0145],[.004,.055,.0135],[.006,.04,.0115],[.004,.028,.009],[-.002,.018,.007],[-.008,.01,.0055],[-.012,.004,.0045],[-.011,-.002,.0038],[-.004,-.005,.0032],[.002,-.001,.0026],[.001,.004,.002]];
 const P=new THREE.CatmullRomCurve3(raw.map(q=>V(q[0],q[1],0))).getPoints(55),n=P.length;const R=P.map((_,i)=>{const f=i/(n-1)*(raw.length-1),k=Math.min(raw.length-2,Math.floor(f));return lerp(raw[k][2],raw[k+1][2],f-k);});
 const gs=[tubeGeo(P,R,14,(c,s,a)=>{c.copy(Math.sin(s*150)>.55?d:y);if(Math.cos(a)<-.4)c.lerp(new THREE.Color(1,.95,.8),.2);}).toNonIndexed(),prim(new THREE.SphereGeometry(.0108,16,12).translate(.006,.112,0),y)];
 gs.push(tubeGeo([V(.012,.114,0),V(.024,.111,0),V(.037,.108,0)],[.0042,.0032,.003],10,c=>c.copy(y)).toNonIndexed(),prim(new THREE.SphereGeometry(.003,8,6).translate(.037,.108,0),d));
 gs.push(prim(new THREE.SphereGeometry(.0055,10,8).scale(1,1.4,1).translate(-.001,.124,0),d),fin([[-.012,.072,0],[-.026,.066,0],[-.026,.052,0],[-.014,.047,0]],[C(0xf6d98a)]));
 for(let i=6;i<36;i+=5){const q=P[i],t=P[i+1].clone().sub(q).normalize(),nrm=V(-t.y,t.x,0);gs.push(prim(new THREE.ConeGeometry(.0012,.004,5).applyMatrix4(new THREE.Matrix4().compose(q.clone().addScaledVector(nrm,-R[i]),new THREE.Quaternion().setFromUnitVectors(V(0,1,0),nrm.clone().negate()),V(1,1,1))),d));}
 gs.push(...eyes(.012,.117,.0072,.0025,C(0xd8a830)));return merge(gs);}

/* ---------- 食物（水生：粒子） ---------- */
class Food{constructor(tk,o){this.tk=tk;this.o=o;const n=o.n;this.n=n;this.p=new Float32Array(n*3);for(let i=0;i<n;i++)this.p[i*3+1]=-999;this.alive=new Uint8Array(n);this.age=new Float32Array(n);this.count=0;
 const g=new THREE.BufferGeometry();this.attr=new THREE.BufferAttribute(this.p,3);g.setAttribute('position',this.attr);
 this.pts=new THREE.Points(g,new THREE.PointsMaterial({color:C(o.col),size:o.size,transparent:true,opacity:.9,depthWrite:false}));this.pts.frustumCulled=false;tk.group.add(this.pts);}
 spawn(){const c=this.o.at,s=this.o.sp;let k=0;for(let i=0;i<this.n;i++)if(!this.alive[i]){this.alive[i]=1;this.age[i]=0;this.p[i*3]=c.x+rnd(-s.x,s.x);this.p[i*3+1]=c.y+rnd(-s.y,s.y);this.p[i*3+2]=c.z+rnd(-s.z,s.z);this.count++;k++;}
  if(this.tk.cyl){const r=this.tk.cyl-.1;for(let i=0;i<this.n;i++){const q=i*3,x=this.p[q],z=this.p[q+2]-this.tk.cz,l=Math.hypot(x,z);if(l>r){this.p[q]=x/l*r;this.p[q+2]=this.tk.cz+z/l*r;}}}return k;}
 kill(i){this.alive[i]=0;this.p[i*3+1]=-999;this.count--;}
 update(dt,t){if(!this.count)return;const fl=this.tk.box.min.y-.05;for(let i=0;i<this.n;i++){if(!this.alive[i])continue;this.age[i]+=dt;if(this.age[i]>120){this.kill(i);this.tk.st.clean=Math.max(0,this.tk.st.clean-.05);continue;}
  const q=i*3;if(this.p[q+1]>fl){this.p[q+1]-=this.o.sink*dt*(.6+.4*Math.sin(i));this.p[q]+=Math.sin(t*.6+i)*.015*dt*this.o.sp.x;this.p[q+2]+=Math.cos(t*.5+i*1.3)*.015*dt*this.o.sp.z;}}
  this.attr.needsUpdate=true;}
 nearest(v){let b=-1,bd=1e9;for(let i=0;i<this.n;i++){if(!this.alive[i])continue;const q=i*3,d=(this.p[q]-v.x)**2+(this.p[q+1]-v.y)**2+(this.p[q+2]-v.z)**2;if(d<bd){bd=d;b=i;}}return b<0?null:V(this.p[b*3],this.p[b*3+1],this.p[b*3+2]);}
 centroid(){if(!this.count)return null;const s=V(0,0,0);for(let i=0;i<this.n;i++)if(this.alive[i])s.x+=this.p[i*3],s.y+=this.p[i*3+1],s.z+=this.p[i*3+2];return s.divideScalar(this.count);}
 eatNear(v,r,max){let e=0;const r2=r*r;for(let i=0;i<this.n&&e<max;i++){if(!this.alive[i])continue;const q=i*3;if((this.p[q]-v.x)**2+(this.p[q+1]-v.y)**2+(this.p[q+2]-v.z)**2<r2){this.kill(i);e++;}}return e;}
 dispose(){this.tk.group.remove(this.pts);this.pts.geometry.dispose();}}

/* ---------- 碰撞：避開岩石、珊瑚、沉木 ---------- */
function pushSolids(tk,p,m,twoD){const S=tk.solids;if(!S)return false;let hit=false;for(const s of S){if(twoD&&s.top<p.y+.01)continue;const dx=p.x-s.x,dz=p.z-s.z,dy=twoD?0:p.y-s.y,d=Math.hypot(dx,dy,dz),R=s.r+m;
 if(d<R){const k=R/Math.max(d,1e-4);p.x=s.x+dx*k;p.z=s.z+dz*k;if(!twoD)p.y=s.y+dy*k;hit=true;}}return hit;}
function freePt(tk,b,twoD){let p;for(let i=0;i<10;i++){p=randIn(b);if(tk.confine)tk.confine(p,.35);if(twoD)p.y=tk.groundY(p.x,p.z);if(!tk.solids||!tk.solids.some(s=>Math.hypot(p.x-s.x,twoD?0:p.y-s.y,p.z-s.z)<s.r+.06&&(!twoD||s.top>p.y+.01)))return p;}return p;}
/* ---------- 共用：飽食 ---------- */
function feedEntry(entry,amt){entry.hunger=Math.min(100,entry.hunger+amt);entry.fed=(entry.fed||0)+1;}
const randIn=b=>V(rnd(b.min.x,b.max.x),rnd(b.min.y,b.max.y),rnd(b.min.z,b.max.z));
function randNear(h,r,b){const p=V(h.x+rnd(-r,r),h.y+rnd(-r*.6,r*.6),h.z+rnd(-r,r));return b.clampPoint(p,p);}

/* ---------- 個體游動 ---------- */
class Agent{constructor(obj,tk,entry,o){this.o=Object.assign({speed:.3,turn:1.5,pitchMax:.45,reach:.3,roll:0,nose:.1,eatR:.05,eatMax:1,eat:true,wait:[0,0],scare:0,fill:6},o);
 this.obj=obj;this.tk=tk;this.entry=entry;this.box=o.box||tk.box;this.pos=o.home?randNear(o.home,o.homeR,this.box):randIn(this.box);
 this.yaw=rnd(0,6.28);this.pitch=0;this.rollV=0;this.spd=this.o.speed;this.th=rnd(0,6.28);this.wt=0;this.ft=0;obj.rotation.order='YZX';tk.group.add(obj);}
 update(dt,t){const o=this.o,f=this.tk.food;let tg=null,feeding=false;
  if(o.eat&&f&&f.count>0&&this.entry.hunger<92){this.ft-=dt;if(this.ft<=0||!this.fp){this.fp=o.centroid?f.centroid():f.nearest(this.mouth());this.ft=o.centroid?.6:.35;}if(this.fp){tg=this.fp;feeding=true;}}
  if(!tg){if(o.loop){const L=o.loop;this.th+=dt*o.speed/((L.a+L.b)/2)*L.dir;const a=this.th+.5*L.dir;tg=V(L.c.x+Math.cos(a)*L.a,L.y0+Math.sin(this.th*1.3+L.ph)*L.yA,L.c.z+Math.sin(a)*L.b);}
   else if(this.tk.attract&&(this.entry.hunger<60||this.entry.bond>45||this.beg>0)){if(!this.bo)this.bo=V(rnd(-1,1),rnd(-1,1),rnd(-1,0));const sc=Math.min(.22,(this.box.max.x-this.box.min.x)*.08);tg=this.tk.attract.clone().add(this.bo.clone().multiplyScalar(sc));this.box.clampPoint(tg,tg);}
   else{if(this.wt>0)this.wt-=dt;if(!this.wp||this.pos.distanceTo(this.wp)<o.reach){this.wp=o.home?randNear(o.home,o.homeR,this.box):freePt(this.tk,this.box);this.wt=rnd(...o.wait);}tg=this.wp;}}
  const d=tg.clone().sub(this.pos),dist=d.length(),h=Math.hypot(d.x,d.z),tr=o.turn*(dist<o.reach*4?2:1),py=this.yaw;
  this.yaw=turnTo(this.yaw,Math.atan2(d.z,d.x),tr*dt);
  const pm=feeding&&o.feedPitch?o.feedPitch:o.pitchMax,wp=clamp(Math.atan2(d.y,h),-pm,pm);this.pitch+=clamp(wp-this.pitch,-tr*.5*dt,tr*.5*dt);
  let sp=o.speed*(feeding?(o.feedMul||1.4):1)*(this.wt>0?.2:1);if(!o.loop)sp*=clamp(dist/(o.reach*3),.3,1);
  this.spd+=(sp-this.spd)*Math.min(1,dt*1.2);const cp=Math.cos(this.pitch);
  this.pos.x+=cp*Math.cos(this.yaw)*this.spd*dt;this.pos.z+=cp*Math.sin(this.yaw)*this.spd*dt;this.pos.y+=Math.sin(this.pitch)*this.spd*dt;
  if(!this.box.containsPoint(this.pos)){this.box.clampPoint(this.pos,this.pos);this.wp=null;}
  if(this.tk.tube){const T=this.tk.tube,dy=this.pos.y-T.y,dz=this.pos.z-T.z,r=Math.hypot(dy,dz),m=T.R+.25+this.o.nose*.25;if(r<m){const k=m/Math.max(r,1e-3);this.pos.y=T.y+Math.max(dy,.05)*k;this.pos.z=T.z+dz*k;if(this.pos.y<T.y)this.pos.y=T.y+m;}}
  if(this.tk.confine)this.tk.confine(this.pos,o.nose*.3+.15);
  if(!o.loop){if(this.tk.solids&&pushSolids(this.tk,this.pos,o.rad||Math.max(.015,o.nose*.45),false))this.wp=null;if(this.tk.groundY){const g=this.tk.groundY(this.pos.x,this.pos.z)+(o.clear||Math.max(.015,o.nose*.22));if(this.pos.y<g)this.pos.y=g;}}
  const yr=angDiff(py,this.yaw)/Math.max(dt,1e-4);this.rollV+=(clamp(-yr*o.roll,-.6,.6)-this.rollV)*Math.min(1,dt*2);
  this.obj.position.copy(this.pos);this.obj.rotation.set(this.rollV,-this.yaw,this.pitch);
  if(feeding&&f){const e=f.eatNear(this.mouth(),o.eatR,o.eatMax);if(e)feedEntry(this.entry,e*o.fill);}if(o.after)o.after(this,t,dt);}
 mouth(){const cp=Math.cos(this.pitch);return V(this.pos.x+cp*Math.cos(this.yaw)*this.o.nose,this.pos.y+Math.sin(this.pitch)*this.o.nose,this.pos.z+cp*Math.sin(this.yaw)*this.o.nose);}
 pickPos(){return this.pos;}
 dispose(){this.tk.group.remove(this.obj);}}

/* ---------- 魚群 ---------- */
const dummy=new THREE.Object3D();dummy.rotation.order='YZX';const tA=V(0,0,0),tB=V(0,0,0);
class School{constructor(geo,m,n,tk,entry,o){this.o=Object.assign({mill:.3,speed:.5,agility:2,eat:true,eatMax:1,fill:1},o);this.tk=tk;this.entry=entry;this.n=n;
 this.mesh=new THREE.InstancedMesh(geo,m,n);this.mesh.frustumCulled=false;tk.group.add(this.mesh);this.c=o.path(0).clone();this.center=this.c.clone();this.pos=this.center;
 this.p=[];this.v=[];this.off=[];this.yaw=new Float32Array(n);this.pit=new Float32Array(n);const s=o.spread;
 for(let i=0;i<n;i++){let q;do{q=V(rnd(-1,1),rnd(-1,1),rnd(-1,1));}while(q.lengthSq()>1);this.off.push(V(q.x*s[0],q.y*s[1],q.z*s[2]));this.p.push(this.c.clone().add(this.off[i]));this.v.push(V(0,0,0));this.yaw[i]=rnd(0,6);}}
 update(dt,t){const o=this.o,f=this.tk.food,feeding=o.eat&&f&&f.count>0&&this.entry.hunger<92;let c=o.path(t);if(feeding){const fc=f.centroid();if(fc)c=fc;}
  this.c.lerp(c,Math.min(1,dt*(feeding?1.2:.5)));const ang=t*o.mill,ca=Math.cos(ang),sa=Math.sin(ang),sum=V(0,0,0),s0=o.spread[0];
  const preds=this.tk.creatures.filter(k=>k.o&&k.o.scare>0&&k!==this&&!(k instanceof School)).concat(this.tk.creatures.filter(k=>k instanceof School&&k!==this&&k.o.predator));
  for(let i=0;i<this.n;i++){const p=this.p[i],v=this.v[i],of=this.off[i];
   tA.set(this.c.x+of.x*ca-of.z*sa,this.c.y+of.y+Math.sin(t*.8+i)*o.spread[1]*.15,this.c.z+of.x*sa+of.z*ca).sub(p);
   const dl=tA.length();tA.multiplyScalar(o.speed*Math.min(1,dl/(s0*.35))/Math.max(dl,1e-4));
   for(const pr of preds){tB.subVectors(p,pr.pos);const dd=tB.length(),R=pr.o.scare||3;if(dd<R)tA.addScaledVector(tB,(R-dd)/R*o.speed*3.5/Math.max(dd,1e-3));}
   v.lerp(tA,Math.min(1,dt*o.agility));p.addScaledVector(v,dt);this.tk.box.clampPoint(p,p);if(this.tk.confine)this.tk.confine(p,.2);if(this.tk.groundY){const g=this.tk.groundY(p.x,p.z)+.03;if(p.y<g)p.y=g;}if(this.tk.solids)pushSolids(this.tk,p,.035,false);if(this.tk.tube){const T=this.tk.tube,dy=p.y-T.y,dz=p.z-T.z,r=Math.hypot(dy,dz),m=T.R+.2;if(r<m){const k=m/Math.max(r,1e-3);p.y=T.y+Math.max(dy,.05)*k;p.z=T.z+dz*k;}}
   if(v.lengthSq()>1e-8){this.yaw[i]=Math.atan2(v.z,v.x);this.pit[i]=clamp(Math.atan2(v.y,Math.hypot(v.x,v.z)),-.6,.6);}
   dummy.position.copy(p);dummy.rotation.set(0,-this.yaw[i],this.pit[i]);dummy.updateMatrix();this.mesh.setMatrixAt(i,dummy.matrix);sum.add(p);}
  this.mesh.instanceMatrix.needsUpdate=true;this.center.copy(sum.divideScalar(this.n));if(feeding){const e=f.eatNear(this.center,s0*.8,o.eatMax);if(e)feedEntry(this.entry,e*o.fill);}}
 pickPos(){return this.center;}
 dispose(){this.tk.group.remove(this.mesh);}}

/* ---------- 水母 ---------- */
class Jelly{constructor(tk,entry,kind){this.tk=tk;this.entry=entry;this.kind=kind;const a=rnd(0,6.28),r=rnd(0,tk.cyl-.25);this.ang=a;this.rad=r;this.pos=V(Math.cos(a)*r,rnd(tk.box.min.y,tk.box.max.y),tk.cz+Math.sin(a)*r);
 this.ph=rnd(0,6.28);this.w=kind==='moon'?rnd(1.6,2.2):rnd(1.1,1.5);this.vy=0;const g=new THREE.Group();this.g=g;tk.group.add(g);
 const moon=kind==='moon',R=moon?.13:.1;this.R=R;
 const bell=add(new THREE.SphereGeometry(R,32,14,0,Math.PI*2,0,Math.PI*.5).scale(1,moon?.42:.75,1),pmat(tk,moon?0xe6f0ff:0xd9782a,{transparent:true,opacity:moon?.38:.62,emissive:C(moon?0x6a8ad8:0x7a3410),emissiveIntensity:moon?.55:.4,roughness:.15,clearcoat:1,depthWrite:false,side:THREE.DoubleSide}),0,0,0,g);this.bell=bell;
 if(moon){for(let i=0;i<4;i++){const a2=i*Math.PI/2+.78;const t=add(new THREE.TorusGeometry(.028,.006,6,16),mat(tk,0xf0a0c8,{emissive:C(0xb04080),emissiveIntensity:.6}),Math.cos(a2)*.045,.025,Math.sin(a2)*.045,g);t.rotation.x=Math.PI/2;}}
 else{for(let i=0;i<16;i++){const a2=i/16*Math.PI*2;const s=add(new THREE.PlaneGeometry(.006,.09),mat(tk,0x6a2a0a,{side:THREE.DoubleSide,transparent:true,opacity:.6,depthWrite:false}),Math.cos(a2)*.06,.04,Math.sin(a2)*.06,g);s.lookAt(0,.2,0);}}
 this.ta=[];const n=moon?64:24,seg=moon?2:9;this.seg=seg;this.len=moon?.03:.9;for(let k=0;k<n;k++)this.ta.push(k/n*Math.PI*2);
 this.tp=new Float32Array(n*(seg-1)*6);this.tg=new THREE.BufferGeometry();this.tg.setAttribute('position',new THREE.BufferAttribute(this.tp,3));
 const tl=new THREE.LineSegments(this.tg,new THREE.LineBasicMaterial({color:C(moon?0xcfe0ff:0xf2b860),transparent:true,opacity:moon?.5:.55}));tl.frustumCulled=false;g.add(tl);
 const arm=mat(tk,moon?0xe8eeff:0xf6e6c8,{transparent:true,opacity:.45,side:THREE.DoubleSide,emissive:C(moon?0x5070b0:0x806040),emissiveIntensity:.4,depthWrite:false},{sway:{amp:moon?3:.5,spd:1.2}});
 for(let i=0;i<4;i++){const L=moon?.1:.55;const ag=new THREE.PlaneGeometry(moon?.025:.04,L,1,10).translate(0,L/2,0).rotateX(Math.PI);const m=add(ag,arm,0,0,0,g);m.rotation.y=i*Math.PI/2;}}
 update(dt,t){const p=Math.sin(t*this.w+this.ph);this.bell.scale.set(1-.11*p,1+.12*p,1-.11*p);
  this.vy+=Math.max(0,p)*.08*dt-.025*dt;this.vy=clamp(this.vy*(1-dt*.5),-.035,.07);this.pos.y+=this.vy*dt;
  const b=this.tk.box;if(this.pos.y>b.max.y){this.pos.y=b.max.y;this.vy=-.02;}if(this.pos.y<b.min.y){this.pos.y=b.min.y;this.vy=.04;}
  this.ang+=dt*.04;this.pos.x=Math.cos(this.ang)*this.rad;this.pos.z=this.tk.cz+Math.sin(this.ang)*this.rad;
  this.g.position.copy(this.pos);this.g.rotation.z=Math.sin(t*.3+this.ph)*.12;this.g.rotation.x=Math.cos(t*.25+this.ph)*.1;
  const R=this.R*(1-.11*p),sg=this.seg,L=this.len/(sg-1);let q=0;
  for(let k=0;k<this.ta.length;k++){const a=this.ta[k];let px=Math.cos(a)*R,pz=Math.sin(a)*R,py=0;
   for(let j=0;j<sg-1;j++){const nx=px+Math.sin(t*1.4+k+j*.6)*.006*(j+1),nz2=pz+Math.cos(t*1.2+k*1.3+j*.5)*.006*(j+1),ny=py-L*(1-.15*p);
    this.tp[q++]=px;this.tp[q++]=py;this.tp[q++]=pz;this.tp[q++]=nx;this.tp[q++]=ny;this.tp[q++]=nz2;px=nx;py=ny;pz=nz2;}}
  this.tg.attributes.position.needsUpdate=true;
  const f=this.tk.food;if(f&&f.count&&this.entry.hunger<92){const e=f.eatNear(this.pos,this.R*1.6,1);if(e)feedEntry(this.entry,e*4);}}
 pickPos(){return this.pos;}
 dispose(){this.tk.group.remove(this.g);}}

/* =================================================================
   爬蟲與兩棲
   ================================================================= */
const blobM=new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false});
function blob(tk,s){const m=add(new THREE.PlaneGeometry(s,s*.6),blobM,0,0,0,tk.group);m.rotation.x=-Math.PI/2;m.renderOrder=1;return m;}
function skinMat(o={},rx=6,ry=3,phys=false){const base=Object.assign({color:C(0xffffff),vertexColors:true,roughness:.55,normalMap:rep(scaleN,rx,ry),normalScale:new THREE.Vector2(.7,.7),side:THREE.DoubleSide},o);
 return patch(phys?new THREE.MeshPhysicalMaterial(base):new THREE.MeshStandardMaterial(base),{tank:null,swim:{amp:0,k:1,spd:0,nose:0,len:1}});}
/* 四肢：從肩膀到地面，含趾 */
function limb(px,py,pz,side,o,col,clawCol){const gs=[],up=o.upper,lo=o.lower,fw=o.fw||0,r=o.r,cc=clawCol||C(0x2a2018);
 if(o.toes==='stump'){const P=new THREE.CatmullRomCurve3([V(0,0,0),V(fw*.3,-py*.3,side*up*.6),V(fw*.6,-py*.75,side*up*.85),V(fw*.7,-py+r*.5,side*up)]).getPoints(8);
  gs.push(tubeGeo(P,P.map((_,i)=>r*(1.05-.1*i/8)),10,c=>c.copy(col)).toNonIndexed());const ft=P[P.length-1];
  gs.push(prim(new THREE.CylinderGeometry(r*1.05,r*1.15,r*.7,14).translate(ft.x,-py+r*.35,ft.z),col));for(let k=-1;k<=1;k++)gs.push(prim(new THREE.ConeGeometry(r*.22,r*.45,6).rotateZ(-Math.PI/2).translate(ft.x+r*1.05,-py+r*.2,ft.z+k*r*.5),cc));return merge(gs);}
 const sh=V(0,0,0),el=V(fw*.3,py*.12,side*up),wr=V(fw*.85,-py+r*.7,side*(up+lo*.3));
 const P=new THREE.CatmullRomCurve3([sh,V(fw*.12,py*.1,side*up*.5),el,V(fw*.6,-py*.35,side*(up+lo*.12)),wr]).getPoints(14);
 gs.push(tubeGeo(P,P.map((_,i)=>r*(1-.42*i/14)),8,c=>c.copy(col)).toNonIndexed());
 const fd=V(fw>=0?1:-.25,0,side*.6).normalize();
 if(o.toes==='zygo'){for(const s2 of[-1,1]){const d=V(s2,0,side*.15).normalize();gs.push(tubeGeo([wr.clone(),wr.clone().addScaledVector(d,o.toeL*.55).add(V(0,-r*.3,0)),wr.clone().addScaledVector(d,o.toeL).add(V(0,-r*.55,0))],[r*.55,r*.45,r*.25],6,c=>c.copy(col)).toNonIndexed());}return merge(gs);}
 for(let k=0;k<5;k++){const a=(k-2)*.42,ca=Math.cos(a),sa=Math.sin(a),d=V(fd.x*ca-fd.z*sa,0,fd.x*sa+fd.z*ca),L=o.toeL*(k===0||k===4?.7:1);
  const a2=wr.clone().addScaledVector(d,L).add(V(0,-r*.62,0));gs.push(tubeGeo([wr.clone(),wr.clone().addScaledVector(d,L*.5).add(V(0,-r*.45,0)),a2],[r*.32,r*.24,r*.16],5,c=>c.copy(col)).toNonIndexed());
  if(o.pads)gs.push(prim(new THREE.SphereGeometry(r*.32,8,6).scale(1.2,.45,1.2).translate(a2.x,a2.y,a2.z),col));
  else gs.push(prim(new THREE.ConeGeometry(r*.12,r*.35,5).rotateZ(-Math.PI/2).applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.atan2(d.z,d.x))).translate(a2.x,a2.y,a2.z),cc));}
 return merge(gs);}
function spikeRow(pts,h,col,base=.4){const gs=[];for(const [p,dir] of pts){const g=new THREE.ConeGeometry(h*base,h,5);g.applyMatrix4(new THREE.Matrix4().compose(p.clone().addScaledVector(dir,h*.4),new THREE.Quaternion().setFromUnitVectors(V(0,1,0),dir.clone().normalize()),V(1,1,1)));gs.push(prim(g,col));}return gs;}
/* 由輪廓求某 t 的表面點 */
function surf(len,prof,t,a,bodyY=0){const [h,w,yo]=prof(t);return V(len/2-t*len,bodyY+h*Math.cos(a)+(yo||0),w*Math.sin(a));}

/* ---------- 蜥蜴模型 ---------- */
function buildLizard(sp){const g=new THREE.Group(),L=sp.len,prof=keyProf(sp.keys),by=sp.bodyY;
 const gs=[loft(L,prof,(c,t,a,x,y,z)=>sp.col(c,t,a,x,y,z),sp.seg||64,sp.rad||16).translate(0,by,0)];
 const [eh,ew]=prof(sp.eyeT),ex=L/2-sp.eyeT*L;gs.push(...eyes(ex,by+eh*.45,ew*.82,sp.eyeR,C(sp.eyeC||0x0a0a0a)));
 if(sp.extra)sp.extra(gs,prof,L,by);
 const m=skinMat(sp.mat||{},sp.nrep[0],sp.nrep[1],sp.phys);const body=add(merge(gs),m,0,0,0,g);
 const legs=[];const lc=C(sp.legC);
 for(const [lt,side,front] of[[sp.frontT,1,1],[sp.frontT,-1,1],[sp.backT,1,0],[sp.backT,-1,0]]){const [h,w]=prof(lt);const px=L/2-lt*L,py=by-h*.25;const pv=new THREE.Group();pv.position.set(px,py,side*w*.75);g.add(pv);
  const lg=limb(0,py,0,side,Object.assign({fw:front?sp.limb.fw:-sp.limb.fw},sp.limb,front?sp.limbF||{}:sp.limbB||{}),lc,sp.claw?C(sp.claw):null);add(lg,m,0,0,0,pv);pv.userData={side,front};legs.push(pv);}
 return{g,body,m,legs};}

const SPEC={
 gecko:{len:.22,bodyY:.018,eyeT:.065,eyeR:.0042,eyeC:0x101010,frontT:.19,backT:.49,nrep:[18,4],
  keys:[[0,.0008,.0008],[.02,.0055,.007],[.07,.0088,.0118],[.13,.0095,.0132],[.175,.0075,.0098],[.25,.0098,.0138],[.4,.0108,.016],[.52,.0098,.0138],[.56,.0088,.011],[.66,.0105,.0122],[.82,.0068,.0075],[1,.0005,.0005]],
  limb:{upper:.012,lower:.014,r:.0028,toeL:.006,fw:.004},legC:0xefc867,
  col:(c,t,a,x)=>{const ca=Math.cos(a);c.set(ca<-.35?0xf4ecd6:0xf0c24a);if(ca>-.2&&t<.56&&Math.sin(x*520+a*6.3)*Math.sin(x*410-a*4.7)>.42)c.set(0x221a12);
   if(t>.56){const b=Math.floor((t-.56)*26)%2;c.set(ca<-.35?0xf0e8da:(b?0xf2ead8:0x3a2e2a));if(b&&Math.sin(x*700+a*9)>.6)c.set(0x2a2220);}c.convertSRGBToLinear();}},
 beardie:{len:.5,bodyY:.04,eyeT:.07,eyeR:.006,eyeC:0x2a1a0a,frontT:.21,backT:.46,nrep:[30,6],
  keys:[[0,.001,.001],[.03,.011,.016],[.09,.019,.03],[.14,.017,.024],[.2,.022,.038],[.33,.026,.05],[.43,.022,.042],[.49,.016,.024],[.7,.009,.011],[1,.001,.001]],
  limb:{upper:.03,lower:.036,r:.0065,toeL:.014,fw:.01},legC:0xd8a050,claw:0x3a2a18,
  col:(c,t,a,x)=>{const ca=Math.cos(a);c.set(0xd9a252);if(ca<-.4)c.set(0xead1a0);if(ca>.1&&t>.18&&t<.5&&Math.sin(t*90)>.3&&Math.abs(Math.sin(a))<.6)c.set(0xb07a3a);
   if(t>.07&&t<.15&&ca<-.2)c.set(0x6a4a2a);if(t>.5&&Math.floor(t*40)%2)c.set(0xc0904a);c.convertSRGBToLinear();},
  extra:(gs,prof,L,by)=>{const sc=C(0xe0b070),pts=[];for(let t=.19;t<.49;t+=.014){for(const s of[1,-1]){const p=surf(L,prof,t,s*Math.PI*.55,by);pts.push([p,V(0,.25,s)]);}}
   for(let t=.06;t<.15;t+=.012){for(const s of[1,-1]){const p=surf(L,prof,t,s*Math.PI*.8,by);pts.push([p,V(.1,-.6,s*.8)]);}}
   for(const s of[1,-1]){for(let k=0;k<4;k++){const p=surf(L,prof,.11+k*.01,s*Math.PI*.35,by);pts.push([p,V(-.3,.5,s)]);}}
   gs.push(...spikeRow(pts,.009,sc,.35));}},
 crested:{len:.2,bodyY:.016,eyeT:.06,eyeR:.0052,eyeC:0x4a2a10,frontT:.17,backT:.45,nrep:[16,4],phys:false,
  keys:[[0,.0008,.0008],[.025,.0075,.0095],[.08,.0108,.0158],[.135,.0068,.0088],[.2,.0085,.0105],[.38,.0098,.0118],[.47,.0078,.0088],[.75,.004,.0042],[1,.0006,.0006]],
  limb:{upper:.011,lower:.013,r:.0026,toeL:.005,fw:.004,pads:true},legC:0xc87a3a,
  col:(c,t,a,x)=>{const ca=Math.cos(a);c.set(0xc4753a);if(ca>.82&&t>.15)c.set(0xf2d8a8);if(ca<-.4)c.set(0xe8b880);if(Math.sin(x*300+a*3)>.75&&ca>-.2)c.set(0x8a4a22);c.convertSRGBToLinear();},
  extra:(gs,prof,L,by)=>{const sc=C(0xf2c890),pts=[];for(let t=.03;t<.14;t+=.009){for(const s of[1,-1]){const p=surf(L,prof,t,s*.75,by);pts.push([p,V(0,1,s*.6)]);}}
   for(let t=.14;t<.5;t+=.015){for(const s of[1,-1]){const p=surf(L,prof,t,s*.55,by);pts.push([p,V(0,1,s*.4)]);}}gs.push(...spikeRow(pts,.0035,sc,.4));}},
 cham:{len:.24,bodyY:.032,eyeT:.09,eyeR:.0001,frontT:.3,backT:.82,nrep:[22,6],
  keys:[[0,.001,.001],[.04,.011,.008],[.12,.02,.014],[.2,.016,.011],[.35,.034,.017],[.6,.038,.019],[.85,.026,.014],[1,.011,.008]],
  limb:{upper:.022,lower:.026,r:.0042,toeL:.008,fw:.006,toes:'zygo'},legC:0x5aa04a,
  col:(c,t,a,x)=>{const ca=Math.cos(a);c.set(0x58a246);if(ca<-.5)c.set(0x9ad07a);if(t>.25&&Math.sin(t*44)>.55&&ca>-.3)c.set(0xd8b040);if(t>.25&&Math.sin(t*44+1.4)>.85)c.set(0x3a7ab0);c.convertSRGBToLinear();},
  extra:(gs,prof,L,by)=>{const gC=C(0x5aa04a),yC=C(0x8ac060);const hx=L/2-.09*L,[hh]=prof(.09);
   gs.push(fin([[hx+.02,by+hh*.6,0],[hx-.005,by+hh+.052,0],[hx-.04,by+hh+.03,0],[hx-.05,by+hh*.6,0]],[gC,yC,gC,gC]));
   for(let t=.25;t<.98;t+=.03){const p=surf(L,prof,t,0,by);gs.push(fin([[p.x+.004,p.y-.001,0],[p.x,p.y+.006,0],[p.x-.004,p.y-.001,0]],[gC]));}
   const pts=[],rads=[];for(let i=0;i<=40;i++){const s=i/40,th=s*2.5*Math.PI,R=.05*(1-s*.78);pts.push(V(-L/2+.004-R*Math.sin(th),by+0-.05+R*Math.cos(th),0));rads.push(.0105*(1-s*.8));}
   gs.push(tubeGeo(pts,rads,10,(c,s)=>{c.set(Math.sin(s*30)>.6?0xd8b040:0x58a246).convertSRGBToLinear();}).toNonIndexed());}},
};

/* 走地型（守宮、鬆獅蜥、睫角也可下地） */
class Walker{constructor(tk,entry,key,o){this.tk=tk;this.entry=entry;this.o=Object.assign({speed:.05,turn:2.5,wait:[1,6],eatR:.03,fill:22,und:.012,diet:['insect']},o);
 const M=buildLizard(SPEC[key]);this.M=M;this.g=M.g;this.g.rotation.order='YZX';tk.group.add(this.g);const sp=SPEC[key];this.len=sp.len;this.head=sp.len/2-.02;
 const U=M.m.userData.U;U.sw.value.set(0,Math.PI*2/(sp.len*.9),0,0);U.sw2.value.set(sp.len/2-sp.frontT*sp.len,sp.len);
 this.pos=randIn(tk.walk);this.pos.y=tk.groundY(this.pos.x,this.pos.z);this.yaw=rnd(0,6.28);this.wait=rnd(0,2);this.ph=0;this.mv=0;this.sh=blob(tk,sp.len*.8);}
 target(){const it=this.entry.hunger<85&&this.tk.tfood?this.tk.tfood.nearest(this.headPos(),this.o.diet):null;if(it){this.it=it;return it.pos;}this.it=null;
  if(this.tk.attract&&(this.entry.hunger<60||this.entry.bond>45||this.beg>0)){this.wp=null;return this.tk.attract.clone().add(this.bo||(this.bo=V(rnd(-.12,.12),0,0)));}
  if(this.o.noct&&!window.__night&&this.wait<=0&&Math.random()<.004){this.wait=rnd(15,40);}
  if(this.wait>0)return null;if(!this.wp){this.wp=(this.o.bask&&this.tk.bask&&Math.random()<.5)?this.tk.bask.clone().add(V(rnd(-.05,.05),0,rnd(-.05,.05))):freePt(this.tk,this.tk.walk,true);}return this.wp;}
 headPos(){return V(this.pos.x+Math.cos(this.yaw)*this.head,this.pos.y,this.pos.z+Math.sin(this.yaw)*this.head);}
 update(dt,t){if(this.wait>0)this.wait-=dt;const tg=this.target();let mv=0;
  if(tg){const dx=tg.x-this.pos.x,dz=tg.z-this.pos.z,dist=Math.hypot(dx,dz);
   if(!this.it&&dist<.03){this.wp=null;this.wait=rnd(...this.o.wait);}
   else{const want=Math.atan2(dz,dx);this.yaw=turnTo(this.yaw,want,this.o.turn*dt);mv=Math.abs(angDiff(this.yaw,want))<1.2?1:.35;
    const sp=this.o.speed*(this.it?1.5:1)*mv*dt;this.pos.x+=Math.cos(this.yaw)*sp;this.pos.z+=Math.sin(this.yaw)*sp;this.tk.walk.clampPoint(this.pos,this.pos);this.pos.y=this.tk.groundY(this.pos.x,this.pos.z);if(pushSolids(this.tk,this.pos,this.len*.14,true))this.wp=null;this.ph+=sp/(this.len*.09);
    if(this.it){const h=this.headPos();if(Math.hypot(h.x-this.it.pos.x,h.z-this.it.pos.z)<this.o.eatR+.01){if(this.tk.tfood.consume(this.it))feedEntry(this.entry,this.o.fill);this.it=null;this.lunge=1;}}}}
  this.mv+=(mv-this.mv)*Math.min(1,dt*6);
  const gy=this.tk.groundY(this.pos.x,this.pos.z);this.pos.y=gy;const ahead=this.tk.groundY(this.pos.x+Math.cos(this.yaw)*this.len*.3,this.pos.z+Math.sin(this.yaw)*this.len*.3);
  this.g.position.copy(this.pos);this.g.rotation.set(0,-this.yaw,Math.atan2(ahead-gy,this.len*.3)+(this.o.bob&&!mv?Math.max(0,Math.sin(t*9))*Math.max(0,Math.sin(t*.4+this.entry.id))*.12:0));
  this.lunge=Math.max(0,(this.lunge||0)-dt*4);this.g.position.x+=Math.cos(this.yaw)*this.lunge*.01;this.g.position.z+=Math.sin(this.yaw)*this.lunge*.01;
  const U=this.M.m.userData.U;U.sw.value.x=this.o.und*this.mv+.0015*Math.sin(t*.7);U.sw.value.w=this.ph*2.2;
  for(const l of this.M.legs){const off=(l.userData.side>0)===(l.userData.front===1)?0:Math.PI;const s=Math.sin(this.ph*2.2+off);l.rotation.y=s*.55*this.mv*l.userData.side*(l.userData.front?1:-1);l.rotation.x=l.userData.side*Math.max(0,Math.cos(this.ph*2.2+off))*.35*this.mv;}
  this.sh.position.set(this.pos.x,gy+.002,this.pos.z);this.sh.rotation.z=-this.yaw;}
 pickPos(){return V(this.pos.x,this.pos.y+.02,this.pos.z);}
 dispose(){this.tk.group.remove(this.g);this.tk.group.remove(this.sh);}}

/* 攀爬型（變色龍、睫角守宮） */
class Climber{constructor(tk,entry,key,o){this.tk=tk;this.entry=entry;this.key=key;this.o=Object.assign({speed:.02,fill:25,diet:['insect']},o);
 const M=buildLizard(SPEC[key]);this.M=M;this.g=M.g;this.g.rotation.order='YZX';tk.group.add(this.g);this.len=SPEC[key].len;this.head=this.len/2-.015;
 this.bi=Math.floor(rnd(0,tk.branches.length));this.s=rnd(.2,.9);this.dir=Math.random()<.5?1:-1;this.wait=rnd(0,3);this.ph=0;this.pos=V(0,0,0);this.tng=0;this.tgt=null;
 if(key==='cham'){this.eyes=[];const [eh,ew]=keyProf(SPEC.cham.keys)(.09);for(const s of[1,-1]){const e=new THREE.Group();e.position.set(this.len/2-.09*this.len,SPEC.cham.bodyY+eh*.35,s*ew*.9);this.g.add(e);
   add(new THREE.SphereGeometry(.0075,12,10),this.M.m,0,0,0,e);const p=add(new THREE.SphereGeometry(.0028,8,6),new THREE.MeshStandardMaterial({color:0x080808,roughness:.2}),.0062,0,s*.003,e);this.eyes.push(e);}
  this.tongue=add(new THREE.CylinderGeometry(.0018,.0022,1,6).translate(0,.5,0).rotateZ(-Math.PI/2),new THREE.MeshStandardMaterial({color:C(0xe08a9a),roughness:.3}),this.head,SPEC.cham.bodyY,0,this.g);this.tongue.scale.set(.001,1,1);
  this.baseCol=new THREE.Color(1,1,1);}}
 br(){return this.tk.branches[this.bi];}
 headPos(){const f=V(Math.cos(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.sin(this.yaw)*Math.cos(this.pitch));return this.pos.clone().addScaledVector(f,this.head);}
 update(dt,t){const b=this.br(),cv=b.curve;let mv=0;const tf=this.tk.tfood,hungry=this.entry.hunger<85;
  if(this.tng>0){this.tng-=dt;const k=this.tng>.25?(.5-this.tng)/.25:this.tng/.25;this.tongue.scale.x=Math.max(.001,k*this.tl);if(this.tng<=0){this.tongue.scale.x=.001;}}
  else if(hungry&&tf){
   if(this.key==='crested'&&this.tk.cup&&this.tk.cup.level>0&&b.cup){const goal=1;if(Math.abs(this.s-goal)>.02){this.dir=Math.sign(goal-this.s);mv=1;}else{this.tk.cup.level=Math.max(0,this.tk.cup.level-dt*.08);feedEntry(this.entry,dt*12);}}
   else{const it=tf.nearest(this.headPos(),this.o.diet,this.key==='cham'?.42:.06);
    if(it&&this.key==='cham'){const h=this.headPos(),d=it.pos.clone().sub(h);this.tl=d.length();const lp=this.g.worldToLocal(this.tk.group.localToWorld(it.pos.clone()));
     this.tongue.rotation.set(0,Math.atan2(-lp.z,lp.x-this.head),Math.atan2(lp.y-SPEC.cham.bodyY,Math.hypot(lp.x-this.head,lp.z)));this.tng=.5;if(tf.consume(it))feedEntry(this.entry,this.o.fill);}
    else if(it&&this.key==='crested'){if(tf.consume(it))feedEntry(this.entry,this.o.fill);}
    else{const any=tf.nearest(this.headPos(),this.o.diet,9);if(any){const d0=cv.getPointAt(0).distanceTo(any.pos),d1=cv.getPointAt(1).distanceTo(any.pos);const goal=d0<d1?.03:.97;if(Math.abs(this.s-goal)>.02){this.dir=Math.sign(goal-this.s);mv=1;}}}}}
  else{if(this.wait>0){this.wait-=dt;}else{mv=1;if(this.s<=.02||this.s>=.98){if(Math.random()<.4&&this.tk.branches.length>1){const end=cv.getPointAt(this.s>.5?1:0);let best=-1,bd=.25;this.tk.branches.forEach((o,i)=>{if(i===this.bi)return;for(const ss of[0,1]){const d=o.curve.getPointAt(ss).distanceTo(end);if(d<bd){bd=d;best=i;this.ns=ss;}}});if(best>=0){this.bi=best;this.s=this.ns;}}
     this.dir=this.s>.5?-1:1;this.wait=rnd(2,8);this.s=clamp(this.s,.021,.979);}}}
  if(mv){const sp=this.o.speed*(this.key==='cham'?(.5+.5*Math.max(0,Math.sin(t*3))):1);this.s=clamp(this.s+this.dir*sp*dt/b.len,0,1);this.ph+=sp*dt/(this.len*.08);}
  this.mv=lerp(this.mv||0,mv,Math.min(1,dt*5));
  const p=cv.getPointAt(this.s),tn=cv.getTangentAt(this.s).multiplyScalar(this.dir>=0?1:-1);
  this.yaw=Math.atan2(tn.z,tn.x);this.pitch=Math.asin(clamp(tn.y,-1,1));const rock=this.key==='cham'&&!mv?Math.sin(t*1.5)*.003:0;
  this.pos.copy(p).add(V(0,b.r*.9,0)).addScaledVector(tn,rock);this.g.position.copy(this.pos);this.g.rotation.set(0,-this.yaw,this.pitch);
  const U=this.M.m.userData.U;U.sw.value.x=.004*this.mv;U.sw.value.w=this.ph*2;
  for(const l of this.M.legs){const off=(l.userData.side>0)===(l.userData.front===1)?0:Math.PI;const s=Math.sin(this.ph*2+off);l.rotation.y=s*.5*this.mv*l.userData.side*(l.userData.front?1:-1);l.rotation.x=l.userData.side*(.25+Math.max(0,Math.cos(this.ph*2+off))*.3*this.mv);}
  if(this.eyes){this.eyes.forEach((e,i)=>{e.rotation.y=Math.sin(t*.6+i*2.1+Math.floor(t*.5+i)*1.7)*.8;e.rotation.z=Math.cos(t*.5+i*1.3+Math.floor(t*.4))*.5;});
   const mood=this.entry.mood||70,hue=mood>70?0:mood>45?.05:.12;this.M.m.color.setHSL(.0,0,1);const tint=new THREE.Color().setHSL((.28-hue+.03*Math.sin(t*.1))%1,.25,.6+.1*Math.sin(t*.13));this.M.m.color.lerp(tint,.35);}}
 pickPos(){return this.pos;}
 dispose(){this.tk.group.remove(this.g);}}

/* 青蛙（角蛙、箭毒蛙）—濕潤光澤 */
function buildFrog(kind){const H=kind==='horned',gs=[];
 const top=C(H?0x7aa83c:0x1f5fe0),dark=C(H?0x3f5f22:0x0b0f1c),belly=C(H?0xe6d6a0:0x2a50b8),leg=C(H?0x6f9a36:0x16336f),acc=C(H?0x8a4a2a:0x0b0f1c),blk=new THREE.Color(0x0c0a06);
 const bw=H?.055:.0125,bh=H?.032:.0102,bl=H?.058:.017;
 const body=new THREE.SphereGeometry(1,56,36);const p=body.attributes.position,v=V(0,0,0),col=[],c=new THREE.Color();
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);let x=v.x,y=v.y,z=v.z;if(y<-.25)y=-.25+(y+.25)*.3;z*=1+(H?.2:.06)*Math.max(0,x);if(y>0)y+=(H?.14:.06)*Math.max(0,x-.25);if(x<-.55)y*=1-(-.55-x)*.35;
  const X=x*bl,Y=y*bh+bh*.82,Z=z*bw;p.setXYZ(i,X,Y,Z);c.copy(y<-.12?belly:top);
  if(y>-.08){const pat=H?Math.sin(X*260)*Math.sin(Z*300)+Math.sin((X+Z)*180)*.5:Math.sin(X*900)*Math.sin(Z*950+Y*400);if(pat>(H?.5:.55))c.copy(H&&Math.sin(X*120+Z*90)>0?acc:dark);}
  if(x>.4&&y>-.2&&y<-.06)c.lerp(blk,.85);col.push(c.r,c.g,c.b);}
 body.setAttribute('color',F(col,3));body.computeVertexNormals();gs.push(body.toNonIndexed());
 const ex=bl*.52,ey=bh*1.72,ez=bw*.48,er=bw*(H?.22:.3);
 for(const s of[-1,1]){gs.push(prim(new THREE.SphereGeometry(er,16,12).translate(ex,ey-er*.25,s*ez),top),prim(new THREE.SphereGeometry(er*.82,16,12).translate(ex+er*.1,ey,s*(ez+er*.12)),H?C(0xc8a83a):blk));
  if(H)gs.push(prim(new THREE.SphereGeometry(1,10,8).scale(er*.18,er*.32,er*.5).translate(ex+er*.55,ey+er*.05,s*(ez+er*.55)),blk),prim(new THREE.ConeGeometry(er*.5,er*1.6,8).rotateX(s*-.35).rotateZ(.25).translate(ex-er*.3,ey+er*1.1,s*(ez+er*.1)),top));
  const hp=V(-bl*.5,bh*.65,s*bw*.55),kn=V(-bl*.02,bh*.38,s*bw*1.18),an=V(-bl*.78,bh*.16,s*bw*1.08),ft=V(-bl*.32,bh*.03,s*bw*1.5);
  gs.push(tubeGeo(new THREE.CatmullRomCurve3([hp,V(-bl*.25,bh*.6,s*bw*.95),kn,V(-bl*.45,bh*.3,s*bw*1.2),an]).getPoints(16),new Array(17).fill(0).map((_,i)=>bw*(H?.3:.28)*(1-.5*i/16)),9,c=>c.copy(leg)).toNonIndexed());
  const toes=[];for(let k=0;k<4;k++){const a=-.5+k*.35;const tip=V(an.x+Math.cos(a)*bl*.55,.001,an.z+s*Math.sin(a+.9)*bw*.55);toes.push(tip);gs.push(tubeGeo([an.clone(),V((an.x+tip.x)/2,bh*.06,(an.z+tip.z)/2),tip],[bw*.09,bw*.07,bw*.04],5,c=>c.copy(leg)).toNonIndexed());if(!H)gs.push(prim(new THREE.SphereGeometry(bw*.08,8,6).translate(tip.x,tip.y,tip.z),leg));}
  gs.push(fin([[an.x,.0015,an.z],...toes.map(t=>[t.x,.0012,t.z])],[H?C(0x9ab060):leg]));
  const sh=V(bl*.42,bh*.62,s*bw*.55),el=V(bl*.5,bh*.32,s*bw*1.0),wr=V(bl*.72,bh*.06,s*bw*.9);
  gs.push(tubeGeo(new THREE.CatmullRomCurve3([sh,el,wr]).getPoints(10),new Array(11).fill(0).map((_,i)=>bw*(H?.17:.16)*(1-.4*i/10)),8,c=>c.copy(leg)).toNonIndexed());
  for(let k=0;k<4;k++){const a=-.6+k*.4,tip=V(wr.x+Math.cos(a)*bl*.22,.001,wr.z+s*Math.sin(a+.4)*bw*.35);gs.push(tubeGeo([wr.clone(),tip],[bw*.06,bw*.035],5,c=>c.copy(leg)).toNonIndexed());if(!H)gs.push(prim(new THREE.SphereGeometry(bw*.07,8,6).translate(tip.x,tip.y,tip.z),leg));}}
 return merge(gs);}
class Hopper{constructor(tk,entry,kind,o){this.tk=tk;this.entry=entry;this.kind=kind;this.o=Object.assign({fill:30},o);const horned=kind==='horned';this.horned=horned;
 this.m=patch(new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.35,clearcoat:1,clearcoatRoughness:.12,normalMap:rep(scaleN,3,3),normalScale:new THREE.Vector2(.25,.25)}),{tank:null});
 this.g=new THREE.Group();this.g.rotation.order='YZX';this.body=add(buildFrog(kind),this.m,0,0,0,this.g);tk.group.add(this.g);this.sh=blob(tk,horned?.12:.045);
 this.pos=randIn(tk.walk);this.pos.y=tk.groundY(this.pos.x,this.pos.z);this.yaw=rnd(0,6.28);this.wait=rnd(0,3);this.hop=null;this.air=0;this.ph=rnd(0,6);}
 update(dt,t){const tk=this.tk,hz=this.horned;
  if(this.hop){const h=this.hop;h.p=Math.min(1,h.p+dt/h.dur);const p=h.p;this.pos.x=h.fx+(h.tx-h.fx)*p;this.pos.z=h.fz+(h.tz-h.fz)*p;this.air=Math.sin(Math.PI*p);const gy0=tk.groundY(this.pos.x,this.pos.z);this.pos.y=gy0;pushSolids(tk,this.pos,this.horned?.05:.018,true);this.pos.y=gy0+this.air*h.ht;
   if(p>=1){this.hop=null;this.air=0;this.wait=this.it?rnd(.1,.4):(hz?rnd(6,14):rnd(.6,2.5));}}
  else{const tf=tk.tfood;this.it=this.entry.hunger<88&&tf?tf.nearest(this.pos,['insect'],hz&&this.entry.hunger>40?.14:9):null;
   if(this.it){const f=this.it.pos;this.yaw=turnTo(this.yaw,Math.atan2(f.z-this.pos.z,f.x-this.pos.x),5*dt);if(Math.hypot(f.x-this.pos.x,f.z-this.pos.z)<(hz?.07:.025)){if(tf.consume(this.it))feedEntry(this.entry,this.o.fill);this.it=null;this.lunge=1;this.wait=hz?3:.5;}}
   if(this.wait>0)this.wait-=dt;else{let tx,tz;const L=hz?.12:.06;
    if(this.it){const f=this.it.pos,d=Math.hypot(f.x-this.pos.x,f.z-this.pos.z),s=Math.min(d,L);tx=this.pos.x+(f.x-this.pos.x)/d*s;tz=this.pos.z+(f.z-this.pos.z)/d*s;}
    else if(tk.attract&&(this.entry.hunger<60||this.entry.bond>45||this.beg>0)&&Math.hypot(tk.attract.x-this.pos.x,tk.attract.z-this.pos.z)>.05){const f=tk.attract,d=Math.hypot(f.x-this.pos.x,f.z-this.pos.z),s=Math.min(d,L);tx=this.pos.x+(f.x-this.pos.x)/d*s;tz=this.pos.z+(f.z-this.pos.z)/d*s;}
    else{const a=rnd(0,6.28),r=rnd(L*.4,L);tx=this.pos.x+Math.cos(a)*r;tz=this.pos.z+Math.sin(a)*r;}
    const v=tk.walk.clampPoint(V(tx,0,tz),V());this.yaw=Math.atan2(v.z-this.pos.z,v.x-this.pos.x);this.hop={fx:this.pos.x,fz:this.pos.z,tx:v.x,tz:v.z,p:0,dur:hz?.45:.28,ht:hz?.05:.03};}}
  this.lunge=Math.max(0,(this.lunge||0)-dt*4);
  this.g.position.copy(this.pos);this.g.position.x+=Math.cos(this.yaw)*this.lunge*.01;this.g.rotation.set(0,-this.yaw,this.hop?(this.hop.p<.5?.35:-.25)*this.air:0);
  this.body.scale.set(1,1+.04*Math.sin(t*3+this.ph)*(1-this.air),1);this.sh.position.set(this.pos.x,tk.groundY(this.pos.x,this.pos.z)+.002,this.pos.z);this.sh.scale.setScalar(1-this.air*.4);}
 pickPos(){return this.pos;}
 dispose(){this.tk.group.remove(this.g);this.tk.group.remove(this.sh);}}

/* 蘇卡達象龜 */
class Tortoise{constructor(tk,entry,o={}){this.tk=tk;this.entry=entry;this.o=o;const g=new THREE.Group();g.scale.setScalar(o.scale||1);g.rotation.order='YZX';this.g=g;tk.group.add(g);
 const sg=new THREE.SphereGeometry(1,64,32,0,Math.PI*2,0,Math.PI*.62);const p=sg.attributes.position,v=V(0,0,0);
 const cells=[];for(let r=0;r<3;r++){const n=r===0?1:r===1?6:12;for(let i=0;i<n;i++){const th=r===0?0:(r===1?.55:1.05),ph=i/n*Math.PI*2+(r===2?.26:0);cells.push(V(Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)));}}
 const col=[],c=new THREE.Color();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).normalize();let d1=9,d2=9;for(const q of cells){const d=v.distanceTo(q);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
  const edge=d2-d1;const bump=1+.06*Math.max(0,.35-d1)/.35;const vv=v.clone().multiplyScalar(bump);p.setXYZ(i,vv.x,vv.y,vv.z);
  if(o.leopard){c.set(edge<.03?0x2a2018:0xd9c286);if(edge>=.03&&Math.sin(d1*70+Math.atan2(v.z,v.x)*9)>.45)c.set(0x1e1810);}else{c.set(edge<.04?0x5a3c1e:0xd2a868);if(edge>=.04)c.lerp(new THREE.Color(0x8a6232),clamp(d1*1.6,0,1)*.7);if(edge>=.04&&Math.sin(d1*90)>.7)c.lerp(new THREE.Color(0x6a4a24),.35);}c.convertSRGBToLinear();col.push(c.r,c.g,c.b);}
 sg.setAttribute('color',F(col,3));sg.computeVertexNormals();sg.scale(.23,.17,.19);
 const shM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,normalMap:rep(scaleN,10,6),normalScale:new THREE.Vector2(.4,.4)});
 this.shell=add(sg,shM,0,.075,0,g);add(new THREE.CylinderGeometry(.2,.19,.025,40).scale(1.15,1,.95),new THREE.MeshStandardMaterial({color:C(0xd8c088),roughness:.7}),0,.07,0,g);
 const sk=new THREE.MeshStandardMaterial({color:C(0xc9a87a),roughness:.75,normalMap:rep(scaleN,4,4),normalScale:new THREE.Vector2(1.2,1.2)});
 this.neck=new THREE.Group();this.neck.position.set(.2,.09,0);g.add(this.neck);
 const hd=loft(.09,keyProf([[0,.002,.002],[.15,.022,.022],[.45,.03,.028],[.8,.026,.024],[1,.024,.022]]),c=>c.set(0xffffff),20,14);add(hd,new THREE.MeshStandardMaterial({color:C(0xc9a87a),roughness:.7,vertexColors:true}),.05,0,0,this.neck);
 for(const s of[-1,1])add(new THREE.SphereGeometry(.006,8,6),new THREE.MeshStandardMaterial({color:0x111111,roughness:.2}),.075,.012,s*.019,this.neck);
 this.legs=[];for(const [x,s,f] of[[.12,1,1],[.12,-1,1],[-.12,1,0],[-.12,-1,0]]){const pv=new THREE.Group();pv.position.set(x,.07,s*.13);g.add(pv);
  add(limb(0,.07,0,s,{upper:.03,lower:.03,r:f?.022:.026,toeL:.01,fw:f?.02:-.01,toes:'stump'},new THREE.Color(1,1,1),C(0x3a2a1a)),new THREE.MeshStandardMaterial({vertexColors:true,color:C(0xc9a87a),roughness:.8,normalMap:rep(scaleN,3,3),normalScale:new THREE.Vector2(1.4,1.4)}),0,0,0,pv);pv.userData={s,f};this.legs.push(pv);}
 this.sh=blob(tk,.55);this.pos=randIn(tk.walk);this.yaw=rnd(0,6.28);this.wait=rnd(0,3);this.ph=0;}
 update(dt,t){const tk=this.tk,tf=tk.tfood;let mv=0;this.it=this.entry.hunger<85&&tf?tf.nearest(this.pos,['veg'],9):null;let tg=this.it?this.it.pos:null;
  if(!tg&&tk.attract&&(this.entry.hunger<60||this.entry.bond>45||this.beg>0)&&Math.hypot(tk.attract.x-this.pos.x,tk.attract.z-this.pos.z)>.25*(this.o.scale||1))tg=tk.attract;
  if(!tg){if(this.wait>0)this.wait-=dt;else{if(!this.wp)this.wp=freePt(tk,tk.walk,true);tg=this.wp;}}
  if(tg){const dx=tg.x-this.pos.x,dz=tg.z-this.pos.z,d=Math.hypot(dx,dz);
   if(this.it&&d<.22*(this.o.scale||1)){mv=0;this.chew=(this.chew||0)+dt;if(this.chew>2.5){this.chew=0;if(tf.consume(this.it))feedEntry(this.entry,14);}}
   else if(!this.it&&d<.05){this.wp=null;this.wait=rnd(4,12);}
   else{const want=Math.atan2(dz,dx);this.yaw=turnTo(this.yaw,want,.8*dt);mv=Math.abs(angDiff(this.yaw,want))<1?1:.5;const sp=.035*mv*dt;this.pos.x+=Math.cos(this.yaw)*sp;this.pos.z+=Math.sin(this.yaw)*sp;tk.walk.clampPoint(this.pos,this.pos);this.pos.y=tk.groundY(this.pos.x,this.pos.z);if(pushSolids(tk,this.pos,.2*(this.o.scale||1),true))this.wp=null;this.ph+=sp/.012;}}
  this.mv=lerp(this.mv||0,mv,Math.min(1,dt*4));const gy=tk.groundY(this.pos.x,this.pos.z);this.pos.y=gy;
  this.g.position.copy(this.pos);this.g.position.y+=Math.abs(Math.sin(this.ph))*.004*this.mv;this.g.rotation.set(Math.sin(this.ph)*.03*this.mv,-this.yaw,0);
  this.neck.position.x=.2+(this.mv?.015:.005*Math.sin(t*.5))+(this.chew?Math.sin(t*10)*.003:0);this.neck.rotation.z=this.chew?-.25:Math.sin(t*.3)*.08;
  for(const l of this.legs){const off=(l.userData.s>0)===(l.userData.f===1)?0:Math.PI;l.rotation.y=Math.sin(this.ph+off)*.35*this.mv*l.userData.s;l.rotation.x=l.userData.s*Math.max(0,Math.cos(this.ph+off))*.25*this.mv;}
  this.sh.position.set(this.pos.x,gy+.002,this.pos.z);this.sh.rotation.z=-this.yaw;}
 pickPos(){return V(this.pos.x,this.pos.y+.1,this.pos.z);}
 dispose(){this.tk.group.remove(this.g);this.tk.group.remove(this.sh);}}

/* 球蟒：沿軌跡移動的身體 */
class Snake{constructor(tk,entry){this.tk=tk;this.entry=entry;const N=56,L=1.1;this.N=N;this.L=L;this.step=.005;this.k=Math.round(L/(N-1)/this.step);
 this.hd=V(0,0,0);const st=randIn(tk.walk);this.yaw=rnd(0,6.28);this.hist=[];for(let i=0;i<(N-1)*this.k+2;i++){const s=i*this.step,a=this.yaw+Math.PI;this.hist.push(V(st.x+Math.cos(a)*s*.55-Math.sin(a)*Math.sin(s*5)*.12,0,st.z+Math.sin(a)*s*.55+Math.cos(a)*Math.sin(s*5)*.12));}
 this.hist.forEach(p=>tk.walk.clampPoint(p,p));this.rads=[];for(let i=0;i<N;i++){const s=i/(N-1);this.rads.push(.028*(s<.05?.55+s*9:s<.75?1-(s-.05)*.1:Math.max(.08,.93-(s-.75)*3.5)));}
 this.pts=[];for(let i=0;i<N;i++)this.pts.push(V(0,0,0));this.layout();
 const geo=tubeGeo(this.pts,this.rads,14,(c,s,a)=>{const ca=Math.cos(a),sa=Math.abs(Math.sin(a));c.set(0x2a1d14);
  if(sa>.35&&Math.sin(s*95+ca*1.5)>.05)c.set(0xb8862e);if(sa>.45&&Math.sin(s*95+ca*1.5)>.7)c.set(0x3a2a18);if(ca>.6&&Math.sin(s*95+1.2)>.75)c.set(0xa07a30);if(ca<-.65)c.set(0xe8dcc0);c.convertSRGBToLinear();});
 this.geo=geo;this.m=new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.3,clearcoat:.6,clearcoatRoughness:.3,normalMap:rep(scaleN,90,5),normalScale:new THREE.Vector2(.6,.6)});
 this.body=add(geo,this.m,0,0,0,tk.group);this.body.frustumCulled=false;
 this.head=new THREE.Group();this.head.rotation.order='YZX';tk.group.add(this.head);
 const hp=keyProf([[0,.003,.004],[.12,.011,.013],[.45,.016,.02],[.8,.017,.022],[1,.014,.016]]);
 add(merge([loft(.05,hp,(c,t,a)=>{const ca=Math.cos(a);c.set(ca>.2?0x2a1d14:0xe8dcc0);if(ca>-.2&&ca<.6&&t>.2)c.set(0xc8a050);c.convertSRGBToLinear();},24,14),...eyes(.012,.006,.012,.0035,C(0x0a0806))]),new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.3,clearcoat:.6}),-.025,0,0,this.head);
 this.tongue=add(new THREE.CylinderGeometry(.0012,.0012,.03,4).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:C(0xb02030)}),.015,-.004,0,this.head);
 this.wait=rnd(0,5);this.ph=0;}
 layout(){const tk=this.tk;for(let i=0;i<this.N;i++){const h=this.hist[Math.min(this.hist.length-1,i*this.k)];const r=this.rads[i];this.pts[i].set(h.x,tk.groundY(h.x,h.z)+r*.92,h.z);}}
 update(dt,t){const tk=this.tk,tf=tk.tfood;let mv=0;const hp=this.hist[0];
  this.it=this.entry.hunger<70&&tf?tf.nearest(hp,['mouse'],9):null;let tg=this.it?this.it.pos:null;
  if(!tg){if(this.wait>0)this.wait-=dt;else{if(!this.wp)this.wp=randIn(tk.walk);tg=this.wp;}}
  if(tg){const dx=tg.x-hp.x,dz=tg.z-hp.z,d=Math.hypot(dx,dz);
   if(this.it&&d<.035){if(tf.consume(this.it))feedEntry(this.entry,70);this.it=null;this.wait=rnd(20,40);this.gulp=1;}
   else if(!this.it&&d<.05){this.wp=null;this.wait=rnd(8,25);}
   else{mv=1;this.ph+=dt;const want=Math.atan2(dz,dx)+Math.sin(this.ph*2.2)*.6;this.yaw=turnTo(this.yaw,want,1.6*dt);let travel=(this.it?.07:.045)*dt;
    while(travel>0){const s=Math.min(travel,this.step);const np=V(hp.x+Math.cos(this.yaw)*s,0,hp.z+Math.sin(this.yaw)*s);tk.walk.clampPoint(np,np);np.y=tk.groundY(np.x,np.z);pushSolids(tk,np,.03,true);np.y=0;
     if(np.distanceTo(hp)<s*.3){this.yaw+=1.2;break;}this.hist.unshift(np);this.hist.pop();travel-=s;}}}
  this.layout();tubeFill(this.geo.attributes.position.array,this.pts,this.rads,14);this.geo.attributes.position.needsUpdate=true;this.geo.computeVertexNormals();
  const h0=this.pts[0],h1=this.pts[2];this.head.position.copy(h0);this.head.rotation.set(0,-Math.atan2(h0.z-h1.z,h0.x-h1.x),Math.atan2(h0.y-h1.y,Math.hypot(h0.x-h1.x,h0.z-h1.z)));
  this.tongue.visible=Math.sin(t*3+this.entry.id)>.85;this.tongue.scale.x=1+Math.sin(t*40)*.3;this.gulp=Math.max(0,(this.gulp||0)-dt*.05);
  if(this.gulp>0){const i=Math.floor((1-this.gulp)*this.N*.6)+3;this.rads.forEach((r,j)=>{});}}
 get pos(){return this.pts[0];}
 pickPos(){return this.pts[Math.floor(this.N*.3)];}
 dispose(){this.tk.group.remove(this.body);this.tk.group.remove(this.head);}}

/* ---------- 陸生食物：蟋蟀、蔬菜、老鼠、果泥 ---------- */
const cricketGeo=(()=>{const b=C(0x5a3a1c),d=C(0x3a2410);const gs=[prim(new THREE.SphereGeometry(1,10,8).scale(.011,.0045,.0055).translate(0,.006,0),b),prim(new THREE.SphereGeometry(.0042,8,6).translate(.011,.0065,0),d)];
 for(const s of[-1,1]){gs.push(prim(cylBetween(V(-.004,.006,s*.003),V(-.014,.012,s*.008),.0011,.0007,4),d),prim(cylBetween(V(-.014,.012,s*.008),V(-.02,0,s*.01),.0008,.0005,4),d),prim(cylBetween(V(.013,.008,s*.002),V(.035,.016,s*.012),.0003,.0002,3),d));
  for(const x of[.004,0])gs.push(prim(cylBetween(V(x,.005,s*.004),V(x+.003,0,s*.009),.0005,.0004,3),d));}
 return merge(gs);})();
const cricketM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5});
class TFood{constructor(tk){this.tk=tk;this.items=[];}
 spawn(kinds){const tk=this.tk,out=[];
  if(kinds.insect){for(let i=0;i<kinds.insect;i++){const m=add(cricketGeo,cricketM,0,0,0,tk.group);const p=randIn(tk.walk);p.y=tk.H-.05;this.items.push({type:'insect',m,pos:p,landed:false,vy:0,h:rnd(0,6),age:0});}out.push(`蟋蟀 ×${kinds.insect}`);}
  if(kinds.veg){const g=new THREE.Group();const lm=new THREE.MeshStandardMaterial({color:C(0x5aa040),roughness:.6,side:THREE.DoubleSide});
   for(let i=0;i<14;i++){const l=add(new THREE.SphereGeometry(1,10,6).scale(rnd(.03,.05),.003,rnd(.02,.035)),i%3?lm:new THREE.MeshStandardMaterial({color:C(0xd85a2a),roughness:.6}),rnd(-.05,.05),i*.0025,rnd(-.04,.04),g);l.rotation.y=rnd(0,6);}
   const p=tk.feedSpot.clone();p.y=tk.groundY(p.x,p.z);g.position.copy(p);tk.group.add(g);this.items.push({type:'veg',m:g,pos:p,landed:true,portions:6,age:0});out.push('蔬菜');}
  if(kinds.mouse){const g=new THREE.Group();const fm=new THREE.MeshStandardMaterial({color:C(0xe8e2dc),roughness:.9});add(new THREE.SphereGeometry(1,14,10).scale(.035,.018,.02),fm,0,.016,0,g);add(new THREE.SphereGeometry(1,10,8).scale(.016,.012,.012),fm,.035,.016,0,g);
   for(const s of[-1,1])add(new THREE.SphereGeometry(.007,8,6),new THREE.MeshStandardMaterial({color:C(0xf0b0b0)}),.03,.028,s*.009,g);add(cylBetween(V(-.034,.012,0),V(-.08,.004,.01),.002,.001),new THREE.MeshStandardMaterial({color:C(0xe0a0a0)}),0,0,0,g);
   const p=randIn(tk.walk);p.y=tk.groundY(p.x,p.z);g.position.copy(p);g.rotation.y=rnd(0,6);tk.group.add(g);this.items.push({type:'mouse',m:g,pos:p,landed:true,age:0});out.push('解凍鼠');}
  if(kinds.fruit&&tk.cup){tk.cup.level=1;out.push('果泥');}
  return out;}
 update(dt,t){const tk=this.tk;for(let i=this.items.length-1;i>=0;i--){const it=this.items[i];it.age+=dt;
  if(it.type!=='poop'&&it.age>400){this.remove(i);tk.st.clean=Math.max(0,tk.st.clean-3);continue;}
  if(it.type==='insect'){const p=it.pos;if(!it.landed){it.vy-=4*dt;p.y+=it.vy*dt;const gy=tk.groundY(p.x,p.z);if(p.y<=gy){p.y=gy;it.landed=true;}}
   else{it.h+=rnd(-3,3)*dt*3;const sp=Math.sin(t*2+i)>.3?.04:0;p.x+=Math.cos(it.h)*sp*dt;p.z+=Math.sin(it.h)*sp*dt;tk.walk.clampPoint(p,p);p.y=tk.groundY(p.x,p.z);it.jump=Math.max(0,(it.jump||0)-dt);if(Math.random()<dt*.15)it.jump=.3;}
   it.m.position.set(p.x,p.y+Math.sin((it.jump||0)/.3*Math.PI)*.04,p.z);it.m.rotation.y=-it.h;}}
  if(tk.cup)tk.cup.mesh.scale.y=Math.max(.01,tk.cup.level);}
 addPoop(p,s=1){const g=new THREE.Group(),bm=new THREE.MeshStandardMaterial({color:C(0x3a2a1a),roughness:.5});for(let i=0;i<3;i++)add(new THREE.SphereGeometry(1,8,6).scale(.008*s,.005*s,.006*s),bm,i*.007*s,.004*s,rnd(-.003,.003)*s,g);add(new THREE.SphereGeometry(.004*s,8,6),new THREE.MeshStandardMaterial({color:0xf4f0e6,roughness:.4}),.02*s,.004*s,0,g);
  p.y=this.tk.groundY(p.x,p.z);g.position.copy(p);g.rotation.y=rnd(0,6);this.tk.group.add(g);this.items.push({type:'poop',m:g,pos:p,landed:true,age:0});}
 nearest(v,types,maxD=9){let b=null,bd=maxD;for(const it of this.items){if(!types.includes(it.type)||!it.landed)continue;const d=it.pos.distanceTo(v);if(d<bd){bd=d;b=it;}}return b;}
 consume(it){const i=this.items.indexOf(it);if(i<0)return false;if(it.portions>1){it.portions--;it.m.scale.setScalar(.4+it.portions/10);return true;}this.remove(i);return true;}
 remove(i){const it=this.items[i];this.tk.group.remove(it.m);this.items.splice(i,1);}
 dispose(){for(let i=this.items.length-1;i>=0;i--)this.remove(i);}}
