/* ===== g.js：亞馬遜河（俯視蜿蜒河道＋拱橋＋搭船遊河） ===== */
const RIV={WS:-.25,HW:2.6,P:[[13.2,86.2],[9,83.2],[2,84],[-5.5,82.8],[-11.5,79],[-12.8,73],[-9.5,68.6],[-2,68.2],[5.5,66.8],[10.5,63.2],[8,59.6],[0,59.2],[-7,59.6],[-12.5,61.5]]};
(function(){const cv=new THREE.CatmullRomCurve3(RIV.P.map(p=>V(p[0],0,p[1])));RIV.cv=cv;RIV.len=cv.getLength();RIV.S=cv.getSpacedPoints(240);
 RIV.near=(x,z)=>{let bd=1e9,bi=0;const S=RIV.S;for(let i=0;i<S.length;i++){const d=(S[i].x-x)**2+(S[i].z-z)**2;if(d<bd){bd=d;bi=i;}}return{d:Math.sqrt(bd),i:bi,p:S[bi]};};
 RIV.at=u=>cv.getPointAt(clamp(u,0,1));RIV.tan=u=>cv.getTangentAt(clamp(u,0,1));
 RIV.bridges=[];for(let i=1;i<RIV.S.length;i++){const a=RIV.S[i-1],b=RIV.S[i];if((a.x>=0)!==(b.x>=0)){const z=a.z+(b.z-a.z)*(-a.x)/(b.x-a.x);if(z<75)RIV.bridges.push(z);}}})();
const RIVER_GY=(x,z)=>{const {d,i}=RIV.near(x,z),HW=RIV.HW,WS=RIV.WS;let y;
 if(d<HW){y=WS-.2-2.4*(1-(d/HW)**2)-(i<14?.8*(1-i/14):0);}else if(d<HW+.7){y=lerp(WS-.2,0,sstep((d-HW)/.7));}else y=.02*nz(x,0,z);
 if(x>9.6&&z>84.6)y=Math.max(y,Math.min(5.6,(z-84.6)*2.2+(x-9.6)*.35));return y;};

DECO.river=function(tk){const WS=RIV.WS,HW=RIV.HW,g=tk.group,vault=x=>5+7*Math.sqrt(Math.max(0,1-(x/18)**2));tk.waterY=WS;tk.groundY=RIVER_GY;
 tk.confine=(p,m=.3)=>{const n=RIV.near(p.x,p.z),lim=Math.max(.2,HW-m);if(n.d>lim){const k=lim/n.d;p.x=n.p.x+(p.x-n.p.x)*k;p.z=n.p.z+(p.z-n.p.z)*k;}if(p.y>WS-.05)p.y=WS-.05;};
 floorPlane(tk,36,32,0,72,0x6a5a40,0x4a3a26,{res:5,nrm:2,caus:0x3a5a30,rep:[9,8],tint:(c,x,z)=>{const y=RIVER_GY(x,z);if(y<WS-.05)c.lerp(C(0x7a6a48),.5);else if(y<-.02)c.lerp(C(0x3a2a1a),.7);else{if(nz(x*.6,3,z*.6)>.1)c.lerp(C(0x3f6a2a),.7);}if(y>.4)c.lerp(C(0x6a6252),.8);}});
 for(let i=0;i<18;i++){const x=rnd(10.2,17.2),z=rnd(85.2,87.8),top=Math.min(vault(x)-.6,RIVER_GY(x,z)+1.2);rock(tk,x,top-.6,z,rnd(.6,1.1),[0x6a6050,0x5a5244,0x7a705e][i%3],rnd(1,1.6));}
 const N=RIV.S.length,P=[],U=[],I=[],W=HW+.3;for(let i=0;i<N;i++){const s=RIV.S[i],t=RIV.S[Math.min(N-1,i+1)].clone().sub(RIV.S[Math.max(0,i-1)]).normalize(),nx=-t.z,nzv=t.x;
  P.push(s.x+nx*W,WS,s.z+nzv*W,s.x-nx*W,WS,s.z-nzv*W);const u=i/(N-1)*RIV.len/3;U.push(u,0,u,1);if(i<N-1){const a=i*2;I.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',F(P,3));sg.setAttribute('uv',F(U,2));sg.setIndex(I);sg.computeVertexNormals();
 const wn=scaleN.clone();wn.needsUpdate=true;wn.wrapS=wn.wrapT=THREE.RepeatWrapping;wn.repeat.set(2,2);
 const wm=new THREE.MeshPhysicalMaterial({color:C(0x4a5a30),roughness:.03,transparent:true,opacity:.48,normalMap:wn,normalScale:new THREE.Vector2(.1,.1),envMapIntensity:1.5,depthWrite:false,side:THREE.DoubleSide});
 const surf=add(sg,wm,0,0,0,g);surf.renderOrder=2;tk.anims.push(t=>wn.offset.set(-t*.09,0));
 const pos=(u,off)=>{const p=RIV.at(u),t=RIV.tan(u);return V(p.x-t.z*off,0,p.z+t.x*off);};
 for(const u of[.24,.33,.44,.53,.71,.86]){const p=pos(u,rnd(-1,1));lilyPads(tk,1,p.x,p.z,.01,.01,WS+.02,true);}
 for(let i=0;i<26;i++){const p=pos(rnd(.1,.98),rnd(-HW+.5,HW-.5));lilyPads(tk,1,p.x,p.z,.01,.01,WS+.015,false);}
 const dw=mat(tk,0x3a2c1e,{roughness:.9,normalMap:rep(scaleN,2,8)});
 for(let i=0;i<12;i++){const a=pos(rnd(.08,.96),rnd(-1.6,1.6));a.y=RIVER_GY(a.x,a.z)+.08;const b=a.clone().add(V(rnd(-1.6,1.6),rnd(.3,1),rnd(-1.6,1.6)));tk.confine(b,.5);b.y=Math.min(b.y,WS-.4);add(cylBetween(a,b,.09,.05,8),dw,0,0,0,g);solidSeg(tk,a,b,.09);}
 for(let i=0;i<16;i++){const p=pos(rnd(.05,.98),rnd(-1.8,1.8));rock(tk,p.x,RIVER_GY(p.x,p.z),p.z,rnd(.15,.35),0x5a5040,.7);}
 for(let i=0;i<40;i++){const p=pos(rnd(.03,.99),(Math.random()<.5?-1:1)*rnd(HW-.7,HW-.2));grass(tk,p.x,RIVER_GY(p.x,p.z),p.z,rnd(.6,1.3),[0x3f8a3a,0x2f6a2a][i%2],8,.012);}
 const nearBridge=(x,z)=>RIV.bridges.some(bz=>Math.abs(x)<2.2&&Math.abs(z-bz)<HW+1.5)||(Math.hypot(x+14.8,z-61.5)<2);
 for(let i=0;i<70;i++){const u=i/70,side=i%2?1:-1,p=pos(u,side*(HW+rnd(.9,1.6)));if(Math.abs(p.x)>16.8||p.z<56.8||p.z>87.3||nearBridge(p.x,p.z)||RIV.near(p.x,p.z).d<HW+.7)continue;
  if(i%3)bigLeaves(g,p.x,0,p.z,rnd(.7,1.3),[0x2f7a32,0x3a8a3a,0x255a28][i%3],8,i%2===0);else grass(tk,p.x,0,p.z,rnd(.9,1.6),0x4a7a32,9,.012);}
 const trees=[];let tries=0;while(trees.length<8&&tries++<400){const x=rnd(-15.5,15.5),z=rnd(57.5,86.5);if(RIV.near(x,z).d<HW+2.2||nearBridge(x,z)||(x>9&&z>84)||trees.some(t=>Math.hypot(t[0]-x,t[1]-z)<4.5)||Math.abs(x)<1.6)continue;trees.push([x,z]);}
 for(const [x,z] of trees){const h=Math.min(9,(vault(x)-.5)/1.25);if(h>4)treeAt(g,x,0,z,h,{r:.38,butt:true,leaf:[0x2f6a2a,0x3f7a32,0x1f5a22,0x4a8a3a],n:12});else palmAt(g,x,0,z,h+1);}
 const wfx=13.2,wfz=86.4;const wf=add(new THREE.PlaneGeometry(2.6,5.4,1,8),new THREE.MeshBasicMaterial({map:waterfallTex,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}),wfx,2.45,wfz,g);wf.rotation.x=-.18;
 const wt=wf.material.map;wt.repeat.set(1,2);const foam=add(new THREE.CircleGeometry(1.7,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}),wfx,WS+.03,wfz-.9,g);foam.rotation.x=-Math.PI/2;
 for(let i=0;i<7;i++)glow(wfx+rnd(-1.3,1.3),WS+rnd(.3,1.6),wfz-.9+rnd(-.6,.6),rnd(1.5,2.6),0xffffff,.2,g);
 tk.anims.push(t=>{wt.offset.y=t*1.4;foam.material.opacity=.3+.08*Math.sin(t*6);});
 const fn=90,fu=new Float32Array(fn),fo=new Float32Array(fn),fp=new Float32Array(fn*3);for(let i=0;i<fn;i++){fu[i]=Math.random();fo[i]=rnd(-HW+.4,HW-.4);}
 const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(fp,3));g.add(new THREE.Points(fg,new THREE.PointsMaterial({color:C(0x8a7a50),size:.06,transparent:true,opacity:.85})));
 tk.anims.push((t,dt)=>{for(let i=0;i<fn;i++){fu[i]+=dt*.32/RIV.len;if(fu[i]>1)fu[i]=0;const p=pos(fu[i],fo[i]);fp[i*3]=p.x;fp[i*3+1]=WS+.012;fp[i*3+2]=p.z;}fg.attributes.position.needsUpdate=true;});
 /* 拱橋（可走上去，船從底下穿過） */
 const wood=new THREE.MeshStandardMaterial({color:C(0x7a5a3a),roughness:.6,normalMap:rep(scaleN,2,10),normalScale:new THREE.Vector2(.3,.3)}),rail=new THREE.MeshStandardMaterial({color:C(0x5a4028),roughness:.5});
 const RISE=1.4,RUN=HW+.75,stairs=[];
 for(const zc of RIV.bridges){const ang=Math.atan2(RISE,RUN),hyp=Math.hypot(RISE,RUN);
  for(const s of[-1,1]){const d=box(2.3,.12,hyp,wood,0,RISE/2,zc+s*RUN/2,g);d.rotation.x=-s*ang*-1;d.rotation.x=s>0?ang:-ang;
   for(const sx of[-1.1,1.1]){add(cylBetween(V(sx,1.0,zc+s*RUN),V(sx,RISE+1.0,zc),.03,.03,8),rail,0,0,0,g);for(let k=0;k<=4;k++){const t=k/4,z=zc+s*RUN*(1-t),y=RISE*t;add(cylBetween(V(sx,y,z),V(sx,y+1,z),.025,.025,6),rail,0,0,0,g);}}
   for(let k=0;k<12;k++){const t=(k+.5)/12,z=zc+s*RUN*(1-t),y=RISE*t;box(2.3,.03,.08,rail,0,y+.075,z,g);}
   stairs.push({x0:-1.12,x1:1.12,z0:s<0?zc-RUN-.05:zc,z1:s<0?zc:zc+RUN+.05,zb:zc+s*RUN,zt:zc,y0:0,y1:RISE});}
  const arch=new THREE.TorusGeometry(RUN*.95,.08,8,32,Math.PI);arch.scale(1,RISE/RUN,1);for(const sx of[-1.15,1.15]){const a=add(arch.clone(),rail,sx,-.05,zc,g);a.rotation.y=Math.PI/2;}}
 STAIRS.push(...stairs);
 /* 碼頭與小船 */
 box(1.7,.16,2.3,wood,-14.8,.08,61.5,g);for(const [x,z] of[[-15.6,60.4],[-14,60.4],[-15.6,62.6],[-14,62.6]])add(new THREE.CylinderGeometry(.06,.06,.7,8),rail,x,.2,z,g);
 RIV.boat=mkBoat();g.add(RIV.boat);RIV.boat.position.set(-12.4,WS,61.6);RIV.boat.rotation.y=.3;
 const sgn=add(new THREE.PlaneGeometry(1.6,.45),new THREE.MeshBasicMaterial({map:vText([['🚣 遊河碼頭',44,.5]],400,112,'#2a1a10','#f6e8d2')}),-14.8,1.3,62.7,g);sgn.rotation.y=Math.PI;
 const blk=(x,z)=>{if(x>-15.75&&x<-13.85&&z>60.25&&z<62.75)return false;if(x>9.6&&z>84.6)return true;if(RIV.near(x,z).d<HW+.3)return true;return trees.some(t=>Math.hypot(t[0]-x,t[1]-z)<.8);};BLOCK.push(blk);
 tk.onRemove=()=>{BLOCK.splice(BLOCK.indexOf(blk),1);for(const s of stairs)STAIRS.splice(STAIRS.indexOf(s),1);if(window.__ride)endRide();};
 tk.box=RB([-15.5,-2.8,56.5],[15.5,WS-.08,87.6]);
 tk.foodCfg={at:V(0,WS,72),sp:V(1.4,.01,1.4),n:220,size:.016,col:0xb87a40,sink:.06,name:'沉底飼料'};
 setTimeout(()=>{if(!tk.food)return;const sp=tk.food.spawn.bind(tk.food);tk.food.spawn=function(){const n=RIV.near(player.x,player.z);this.o.at=V(n.p.x,WS,n.p.z);const k=sp();for(let i=0;i<this.n;i++)if(this.alive[i]){const p=V(this.p[i*3],this.p[i*3+1],this.p[i*3+2]);tk.confine(p,.3);p.y=WS;this.p[i*3]=p.x;this.p[i*3+1]=p.y;this.p[i*3+2]=p.z;}return k;};},0);};

function mkBoat(){const g=new THREE.Group(),L=4.2,B=.55,Dp=.42,seg=40,rad=16,P=[],Cc=[],I=[],c=new THREE.Color();
 for(let i=0;i<=seg;i++){const t=i/seg,x=L/2-t*L,w=B*Math.pow(Math.sin(Math.PI*t),.6),h=Dp*Math.pow(Math.sin(Math.PI*t),.25);
  for(let j=0;j<=rad;j++){const a=Math.PI/2+j/rad*Math.PI;P.push(x,Math.cos(a)*h+.18,Math.sin(a)*w);c.set(j===0||j===rad?0xd8b080:0x8a5a32);c.convertSRGBToLinear();Cc.push(c.r,c.g,c.b);}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;I.push(a,b,a+1,b,b+1,a+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',F(P,3));geo.setAttribute('color',F(Cc,3));geo.setIndex(I);geo.computeVertexNormals();
 add(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,side:THREE.DoubleSide,normalMap:rep(scaleN,8,2),normalScale:new THREE.Vector2(.25,.25)}),0,0,0,g);
 const sm=new THREE.MeshStandardMaterial({color:C(0x6a4428),roughness:.6});for(const x of[-1.1,0,1.1])box(.22,.04,B*1.7,sm,x,.12,0,g);
 const pd=add(cylBetween(V(.6,.15,-.45),V(-.4,.55,.55),.02,.02,6),sm,0,0,0,g);add(new THREE.SphereGeometry(1,10,6).scale(.18,.02,.08),sm,-.45,.57,.6,g);
 return g;}

/* ---------- 搭船遊河 ---------- */
let RIDE=null;
function startRide(tk){if(RIDE)return;if(!tk||!TANKS.rv){toast('先在溫室設置「亞馬遜河」展區才能搭船');return;}RIDE={tk,u:0,dir:1,wait:1.2};window.__ride=true;$('#pick').style.display='none';
 const b=$('#rideBtn');b.style.display='block';b.textContent='🛶 下船';toast('🚣 出發！沿著亞馬遜河逆流而上，看看水裡的魚',3500);
 const p=RIV.at(1),t=RIV.tan(1);player.yaw=Math.atan2(t.x,t.z);}
function endRide(){if(!RIDE)return;RIDE=null;window.__ride=false;$('#rideBtn').style.display='none';Object.assign(player,{x:-15.6,y:0,z:61.5,yaw:-Math.PI/2+.3,pitch:-.15});
 if(RIV.boat){RIV.boat.position.set(-12.4,RIV.WS,61.6);RIV.boat.rotation.set(0,.3,0);}toast('下船了，歡迎再來遊河');}
$('#rideBtn').onclick=endRide;
const _bar2=bar;bar=function(){_bar2();if(lvl()!==0||RIDE)return;const tk=TANKS.rv;if(!tk)return;if(Math.hypot(player.x+14.8,player.z-61.5)<4.5||(near===tk.slot)){$('#bar').style.display='block';
 if(Math.hypot(player.x+14.8,player.z-61.5)<4.5){$('#bT').textContent='🚣 遊河碼頭';$('#bD').textContent='搭獨木舟沿亞馬遜河逆流而上，約 2 分鐘';const key='dock';if(lastBtns!==key){lastBtns=key;lastNear=null;const bb=$('#bB');bb.innerHTML='';const x=document.createElement('button');x.className='btn feed';x.textContent='🚣 上船';x.onclick=()=>startRide(tk);bb.appendChild(x);}}}};
const _rc1=refreshChips;refreshChips=function(){_rc1();if(!S.tanks.rv)return;const b=document.createElement('button');b.className='chip';b.textContent='🚣 遊河';b.onclick=()=>{player.y=0;startRide(TANKS.rv);};const ch=$('#chips');ch.insertBefore(b,ch.children[2]||null);};
globalAnims.push((t,dt)=>{if(!RIDE)return;if(!TANKS.rv){endRide();return;}if(RIDE.wait>0){RIDE.wait-=dt;}else{RIDE.u+=RIDE.dir*dt*1.35/RIV.len;if(RIDE.u>=.9){RIDE.u=.9;RIDE.dir=-1;RIDE.wait=3;toast('前方是瀑布，掉頭往下游');}if(RIDE.u<=0&&RIDE.dir<0){endRide();return;}}
 const u=1-RIDE.u,p=RIV.at(u),tg=RIV.tan(u).multiplyScalar(-RIDE.dir);const b=RIV.boat;b.position.set(p.x,RIV.WS+Math.sin(t*1.7)*.02,p.z);b.rotation.set(Math.sin(t*1.3)*.03,-Math.atan2(tg.z,tg.x),Math.sin(t*1.1)*.02);
 player.x=p.x+tg.x*.6;player.z=p.z+tg.z*.6;player.y=RIV.WS+.85-1.6;});

/* ---------- 河魚：新範圍與路徑 ---------- */
const chanAt=(u,off,y)=>{const p=RIV.at(u),t=RIV.tan(u);return V(p.x-t.z*off,y,p.z+t.x*off);};
Object.assign(MAKE,{
 arapaima:(tk,e)=>new Agent(new THREE.Mesh(gArapaima(),cache(tk,'ara',()=>fishMat(tk,{amp:.12,k:2.8,spd:2.6,nose:1.1,len:2.2}))),tk,e,{speed:.32,turn:.55,pitchMax:.35,reach:.8,box:RB([-15.5,-2.6,56.5],[15.5,-.32,87.6]),nose:1.05,eatR:.25,eatMax:3,fill:3,scare:1.5,
  after:(a,t,dt)=>{a.br=(a.br??rnd(30,70))-dt;if(a.br<0&&!a.up)a.up=true;if(a.up){const n=RIV.near(a.pos.x,a.pos.z);a.wp=V(n.p.x,RIV.WS-.03,n.p.z);if(a.pos.y>RIV.WS-.14){a.up=false;a.br=rnd(50,110);a.wp=null;ripple(a.tk,a.pos);}}}}),
 arowana:(tk,e)=>new Agent(new THREE.Mesh(gArowana(),cache(tk,'arw',()=>fishMat(tk,{amp:.03,k:8,spd:5,nose:.4,len:.8},{metalness:.45,roughness:.22}))),tk,e,{speed:.3,turn:1.1,pitchMax:.15,reach:.5,box:RB([-15.5,-.75,56.5],[15.5,-.33,87.6]),nose:.38,eatR:.07,fill:6,scare:.8}),
 piranha:(tk,e)=>new School(gPiranha(),fishMat(tk,{amp:.01,k:22,spd:12,nose:.12,len:.25},{metalness:.35,roughness:.3}),18,tk,e,{spread:[.9,.25,.9],mill:.4,speed:.45,agility:2.5,eatMax:2,fill:.7,path:t=>chanAt(.35+.3*Math.sin(t*.01),Math.sin(t*.05)*.6,-1.3+.3*Math.sin(t*.2))}),
 motoro:(tk,e)=>new Agent(new THREE.Mesh(gRay(),cache(tk,'ray',()=>patch(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,side:THREE.DoubleSide}),{tank:tk,flap:{amp:.025,spd:5,span:.25}}))),tk,e,{speed:.14,turn:1.4,pitchMax:.04,reach:.4,box:RB([-15.5,-2.9,56.5],[15.5,-2.3,87.6]),wait:[2,8],nose:.22,eatR:.08,fill:6,clear:.04}),
 rtc:(tk,e)=>new Agent(new THREE.Mesh(gCatfish(),cache(tk,'rtc',()=>fishMat(tk,{amp:.06,k:4,spd:4,nose:.5,len:1}))),tk,e,{speed:.2,turn:.8,pitchMax:.1,reach:.6,box:RB([-15.5,-2.8,56.5],[15.5,-1.9,87.6]),wait:[3,10],nose:.48,eatR:.15,eatMax:2,fill:4,scare:.9}),
 discus:(tk,e)=>new Agent(new THREE.Mesh(gDiscus(),cache(tk,'dis',()=>fishMat(tk,{amp:.004,k:40,spd:9,nose:.07,len:.15}))),tk,e,{speed:.08,turn:1.6,pitchMax:.15,reach:.15,box:RB([-15.5,-1.8,56.5],[15.5,-.6,87.6]),wait:[1,4],nose:.07,eatR:.02,fill:8}),
 cardinal:(tk,e)=>new School(gCardinal(),fishMat(tk,{amp:.003,k:140,spd:30,nose:.02,len:.04},{roughness:.25}),50,tk,e,{spread:[.6,.15,.6],mill:.35,speed:.18,agility:3,fill:.8,path:t=>chanAt(.75+.08*Math.sin(t*.03),Math.sin(t*.07)*.8,-.9+.25*Math.sin(t*.21))}),
});
$('#zoomBtn').onclick=()=>{ZOOM=ZOOM===1?2:ZOOM===2?4:1;$('#zoomBtn').textContent=`🔍 ${ZOOM}x`;resize();};

