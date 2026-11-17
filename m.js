/* ===== m.js：ㄇ字形階梯溪流缸、大洋水槽上方後場、釣魚湖 ===== */

/* ---------- 溪流缸：右側（最高）→ 正面 → 左側（最低）→ 溢流到小缸 ---------- */
const SO=V(-27.2,0,-11.2);const SL=(x,y,z)=>V(x-SO.x,y,z-SO.z);
const _ph0=placeholder;placeholder=function(s){if(s.sz!=='ST')return _ph0(s);const g=new THREE.Group();g.position.copy(s.origin);scene.add(g);
 const p=add(new THREE.PlaneGeometry(2.4,1.2),new THREE.MeshBasicMaterial({map:textTex([['空展位・溪流缸',54],['ㄇ字形階梯溪流',40,'#9fd8ff'],['走近設置',34,'#ffc46b']]),transparent:true}),-8.5,1.5,0,g);p.rotation.y=Math.PI/2;
 const lm=new THREE.LineDashedMaterial({color:0x6fd3ff,dashSize:.2,gapSize:.12});for(const [x0,x1,z0,z1] of[[-35.8,-22.4,-22.2,-19.8],[-38.2,-35.8,-22.2,-.2],[-35.8,-22.4,-2.6,-.2]]){const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(x1-x0,1,z1-z0)),lm);l.position.copy(SL((x0+x1)/2,.5,(z0+z1)/2));l.computeLineDistances();g.add(l);}
 s.ph=g;};
DECO.stream=function(tk){const g=tk.group;tk.u.den.value=0;tk.W=13;tk.D=2.4;tk.H=2.5;
 const rk=mat(tk,0x4a4840,{roughness:.95,normalMap:rep(scaleN,4,2),normalScale:new THREE.Vector2(1.2,1.2)}),volM=new THREE.MeshStandardMaterial({color:C(0x3a7a6a),transparent:true,opacity:.26,roughness:.1,depthWrite:false,emissive:C(0x1a4a40),emissiveIntensity:.25});
 const surfM=new THREE.MeshStandardMaterial({color:C(0x7ab8b0),transparent:true,opacity:.42,roughness:.05,metalness:.2,depthWrite:false,emissive:C(0x4a8a80),emissiveIntensity:.3,side:THREE.DoubleSide});
 const wt=waterfallTex.clone();wt.needsUpdate=true;wt.wrapS=wt.wrapT=THREE.RepeatWrapping;const wfm=new THREE.MeshBasicMaterial({map:wt,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide});tk.anims.push((t,dt)=>{wt.offset.y-=dt*1.5;});
 tk.pools=[];
 const pool=(x0,x1,z0,z1,w,d)=>{const b=w-d,cx=(x0+x1)/2,cz=(z0+z1)/2,W=x1-x0,D=z1-z0;box(W,b,D,rk,...SL(cx,b/2,cz).toArray(),g);
  const v=box(W-.02,d,D-.02,volM,...SL(cx,b+d/2,cz).toArray(),g);v.renderOrder=3;const sf=add(new THREE.PlaneGeometry(W,D),surfM,...SL(cx,w,cz).toArray(),g);sf.rotation.x=-Math.PI/2;sf.renderOrder=4;
  for(let i=0;i<Math.round(W*D*2.2);i++){const x=rnd(x0+.15,x1-.15),z=rnd(z0+.15,z1-.15);rock(tk,...SL(x,b,z).toArray(),rnd(.05,.13),[0x9a9488,0x7a7468,0xb0a898,0x6a6458][i%4],.55);}
  const p={min:SL(x0+.2,b+.12,z0+.2),max:SL(x1-.2,w-.08,z1-.2),b,w};if(p.min.x>p.max.x){const m=(p.min.x+p.max.x)/2;p.min.x=p.max.x=m;}if(p.min.z>p.max.z){const m=(p.min.z+p.max.z)/2;p.min.z=p.max.z=m;}tk.pools.push(p);return p;};
 const fall=(x,z,y0,y1,w,ry)=>{(tk.falls=tk.falls||[]).push([x,z,y0,y1,w,ry]);const p=add(new THREE.PlaneGeometry(w,Math.max(.08,y1-y0),1,2),wfm,...SL(x,(y0+y1)/2,z).toArray(),g);p.rotation.y=ry;p.renderOrder=6;
  const fo=add(new THREE.PlaneGeometry(w,.25),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}),...SL(x,y0+.012,z).toArray(),g);fo.rotation.set(-Math.PI/2,0,ry);};
 /* A：右側（北牆），由東往西流 */
 const nA=6,A0=-22.5,A1=-35.8,la=[2.3,2.22,2.14,2.06,1.98,1.9];for(let i=0;i<nA;i++){const xa=A0+(A1-A0)*i/nA,xb=A0+(A1-A0)*(i+1)/nA;pool(Math.min(xa,xb),Math.max(xa,xb),-22.2,-19.8,la[i],.8);if(i)fall(xa,-21,la[i],la[i-1],2.4,Math.PI/2);}
 /* B：正面（西牆），由北往南流 */
 const nB=8,lb=[1.75,1.64,1.53,1.42,1.31,1.2,1.09,.98];for(let i=0;i<nB;i++){const za=-22.2+22*i/nB,zb=-22.2+22*(i+1)/nB;pool(-38.2,-35.8,za,zb,lb[i],.8);if(i)fall(-37,za,lb[i],lb[i-1],2.4,0);}
 fall(-35.8,-21,lb[0],la[nA-1],2.4,Math.PI/2);
 /* C：左側（南牆），由西往東流 */
 const nC=6,lc=[.88,.82,.76,.7,.64,.58];for(let i=0;i<nC;i++){const xa=-35.8+13.3*i/nC,xb=-35.8+13.3*(i+1)/nC;pool(xa,xb,-2.6,-.2,lc[i],.52);if(i)fall(xa,-1.4,lc[i],lc[i-1],2.4,Math.PI/2);}
 fall(-35.8,-1.4,lc[0],lb[nB-1],2.4,Math.PI/2);
 /* D：溢流承接的小缸 */
 const pd=pool(-22.3,-19.5,-3.4,-.2,.44,.4);fall(-22.35,-1.4,.44,lc[nC-1]+.03,1.2,Math.PI/2);
 const spout=add(new THREE.CylinderGeometry(.08,.08,.5,10).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:C(0x6a5a40),roughness:.8}),...SL(-22.3,lc[nC-1]+.02,-1.4).toArray(),g);
 /* 源頭瀑布：東北角的岩壁 */
 for(let i=0;i<7;i++)rock(tk,...SL(-22.9+rnd(-.3,.3),2.3+i*.22,-21.4+rnd(-.6,.6)).toArray(),rnd(.35,.55),[0x5a5850,0x4a4a44][i%2],1.2);fall(-22.6,-21,2.3,3.6,.8,Math.PI/2);
 /* 岸邊：後側岩石、蕨類、青苔、樹 */
 const bank=[];for(let x=-35.6;x<-22.6;x+=rnd(.6,.9))bank.push([x,-21.95,la[Math.min(nA-1,Math.floor((-22.5-x)/13.3*nA))]]);for(let z=-22;z<-.4;z+=rnd(.6,.9))bank.push([-37.95,z,lb[Math.min(nB-1,Math.floor((z+22.2)/22*nB))]]);for(let x=-35.6;x<-22.6;x+=rnd(.6,.9))bank.push([x,-.45,lc[Math.min(nC-1,Math.floor((x+35.8)/13.3*nC))]]);
 for(const [x,z,w] of bank){rock(tk,...SL(x,w-.35,z).toArray(),rnd(.32,.5),[0x5a5850,0x4a4a44,0x6a665c][Math.random()*3|0],1.1);if(Math.random()<.45)bigLeaves(g,...SL(x,w+.1,z).toArray(),rnd(.3,.55),[0x2f7a32,0x3a8a3a,0x4a9a3a][Math.random()*3|0],7,Math.random()<.3);}
 for(const [x,z,w,h] of[[-37.6,-12,1.4,2.4],[-30,-21.8,2.0,2.2],[-30,-.6,.7,2.2],[-37.6,-4,1.0,2.0],[-24.5,-21.8,2.3,1.8]])treeAt(g,...SL(x,w+.1,z).toArray(),h,{r:.08,n:7});
 const dw=mat(tk,0x5a4a38,{roughness:.9});add(cylBetween(SL(-37.8,1.6,-16),SL(-36.2,1.1,-13.5),.09,.06,9),dw,0,0,0,g);add(cylBetween(SL(-31,2.2,-22),SL(-28.5,1.7,-20.2),.08,.05,9),dw,0,0,0,g);
 /* 玻璃面與框 */
 const glass=(x,z,len,ry,h)=>{const p=add(new THREE.PlaneGeometry(len,h),glassM,...SL(x,h/2,z).toArray(),g);p.rotation.y=ry;p.renderOrder=5;const t=box(len,.06,.08,frameM,...SL(x,h,z).toArray(),g);t.rotation.y=ry;const b=box(len,.1,.1,frameM,...SL(x,.05,z).toArray(),g);b.rotation.y=ry;};
 glass(-29.1,-19.78,13.3,0,2.7);glass(-35.78,-11.2,17.2,Math.PI/2,2.2);glass(-29.1,-2.62,13.3,0,1.3);glass(-20.9,-3.42,2.8,0,.75);glass(-19.48,-1.8,3.2,Math.PI/2,.75);glass(-22.48,-21,2.4,Math.PI/2,2.7);
 for(const [x,z] of[[-35.8,-19.8],[-35.8,-2.6],[-22.4,-19.8]])box(.08,2.7,.08,frameM,...SL(x,1.35,z).toArray(),g);
 tk.box=new THREE.Box3(SL(-38,.05,-22),SL(-19.6,2.3,-.3));tk.groundY=(x,z)=>{for(const p of tk.pools)if(x>=p.min.x-.25&&x<=p.max.x+.25&&z>=p.min.z-.25&&z<=p.max.z+.25)return p.b;return 0;};
 tk.foodCfg={at:SL(-37,1.3,-11),sp:V(.6,.02,8),n:160,size:.012,col:0xc89060,sink:.05,name:'溪流飼料'};
 let patched=false;tk.anims.push(()=>{if(patched||!tk.food)return;patched=true;const f=tk.food;f.spawn=function(){let k=0;for(let i=0;i<this.n;i++)if(!this.alive[i]){const p=tk.pools[i%tk.pools.length];this.alive[i]=1;this.age[i]=0;
   this.p[i*3]=rnd(p.min.x,p.max.x);this.p[i*3+1]=p.w-.02;this.p[i*3+2]=rnd(p.min.z,p.max.z);this.count++;k++;}return k;};});};
const poolBox=(tk,e,low)=>{const P=tk.pools||[];if(!P.length)return new THREE.Box3(V(-1,.3,-1),V(1,1,1));const p=P[(e.id*7+3)%P.length];const b=new THREE.Box3(p.min.clone(),p.max.clone());if(low)b.max.y=Math.min(b.max.y,b.min.y+.12);return b;};
for(const [k,low] of[['sakura',0],['kuhua',0],['opsari',0],['hemi',1],['goby',1]]){const f0=MAKE[k];MAKE[k]=(tk,e)=>{const a=f0(tk,e);a.box=poolBox(tk,e,low);a.pos=randIn(a.box);return a;};}

/* ---------- 大洋水槽上方後場（從 2F 員工電梯上去） ---------- */
(function(){const Y=11.3,con=new THREE.MeshStandardMaterial({color:C(0xb8b6b0),roughness:.9,normalMap:rep(scaleN,10,10),normalScale:new THREE.Vector2(.4,.4)}),grate=new THREE.MeshStandardMaterial({color:C(0x8a8e92),roughness:.6,metalness:.4,normalMap:rep(scaleN,40,8),normalScale:new THREE.Vector2(.8,.8)});
 const steel=new THREE.MeshStandardMaterial({color:C(0xc8ccd0),metalness:.8,roughness:.3}),gls=new THREE.MeshPhysicalMaterial({color:0xe8f4ff,transparent:true,opacity:.22,roughness:.05,depthWrite:false,side:THREE.DoubleSide}),wht=new THREE.MeshStandardMaterial({color:C(0xeeeeec),roughness:.8});
 const X0=-17.5,X1=17.5,Z0=-36,Z1=-17,cx=0,cz=(Z0+Z1)/2;
 for(const [x,z,w,d] of[[0,-18.6,35,3.2],[0,-35,35,2],[-16.3,-26.5,2.4,15],[16.3,-26.5,2.4,15]])box(w,.25,d,grate,x,Y-.125,z);
 box(35,7,.3,con,cx,Y+3.5,Z0-.15);box(35,7,.3,con,cx,Y+3.5,Z1+.15);box(.3,7,19.3,con,X0-.15,Y+3.5,cz);box(.3,7,19.3,con,X1+.15,Y+3.5,cz);box(35.6,.4,19.6,con,cx,Y+7.2,cz);
 for(let x=-15;x<=15;x+=5)box(.9,1.1,19,con,x,Y+6.4,cz);box(35,1.1,.9,con,0,Y+5.2,-26.5);
 box(35,.08,.08,steel,0,Y+1.1,-20.05);box(35,.08,.08,steel,0,Y+1.1,-33.95);for(const s of[-1,1])box(.08,.08,13.9,steel,s*15.05,Y+1.1,-27);
 for(let x=-15;x<=15;x+=2.5){box(.06,1.1,.06,steel,x,Y+.55,-20.05);box(.06,1.1,.06,steel,x,Y+.55,-33.95);}for(const s of[-1,1])for(let z=-33.5;z<=-20.5;z+=2.6)box(.06,1.1,.06,steel,s*15.05,Y+.55,z);
 box(30,.9,.02,gls,0,Y+.5,-20.05);box(30,.9,.02,gls,0,Y+.5,-33.95);for(const s of[-1,1])box(.02,.9,13.9,gls,s*15.05,Y+.5,-27);
 const wood=new THREE.MeshStandardMaterial({color:C(0xc8a878),roughness:.8,normalMap:rep(scaleN,2,10),normalScale:new THREE.Vector2(.6,.6)});
 for(const [x,z,w,d] of[[0,-21.2,28,1.2],[0,-32.8,28,1.2],[-13.8,-27,1.2,10.4],[13.8,-27,1.2,10.4],[-4,-27,1.2,10.4]]){box(w,.18,d,wood,x,10.12,z);for(let i=-w/2+.5;i<w/2;i+=2)if(w>d)box(.3,.3,d+.1,new THREE.MeshStandardMaterial({color:C(0xf2f2ee)}),x+i,10.05,z);}
 for(let i=0;i<14;i++){const x=-13+i*2,z=i%2?-23.5:-30.5,ly=Y+2.2+(i%3)*.4;add(new THREE.CylinderGeometry(.005,.005,Y+6.6-ly,4),steel,x,(ly+Y+6.6)/2,z);const h=add(new THREE.CylinderGeometry(.22,.3,.28,16),steel,x,ly,z);
  add(new THREE.CircleGeometry(.26,16),new THREE.MeshBasicMaterial({color:C(0xfffbe8)}),x,ly-.145,z).rotation.x=Math.PI/2;}
 const lp=new THREE.PointLight(C(0xffffff),1.4,40,1.2);lp.position.set(0,Y+4,-27);scene.add(lp);const lp2=new THREE.PointLight(C(0xf0f6ff),.8,30,1.2);lp2.position.set(-10,Y+3,-19);scene.add(lp2);
 const suit=new THREE.MeshStandardMaterial({color:C(0x16181c),roughness:.6});box(2.4,.05,.05,steel,6,Y+2.1,-35.6);for(let i=0;i<3;i++){const x=5.2+i*.8;box(.36,.6,.14,suit,x,Y+1.75,-35.6);for(const s of[-1,1]){box(.14,.75,.12,suit,x+s*.1,Y+1.08,-35.6);box(.1,.5,.1,suit,x+s*.24,Y+1.7,-35.6).rotation.z=s*.15;}}
 box(.8,1,.6,wht,-15,Y+.5,-35);box(1.2,.9,.5,new THREE.MeshStandardMaterial({color:C(0x3a7ab8)}),-12,Y+.45,-35.2);for(let i=0;i<4;i++)box(.28,.4,.28,new THREE.MeshStandardMaterial({color:C(0x2a8a4a)}),8+i*.4,Y+.2,-34.6);
 const ed=-17.05;box(1.6,2.6,.12,steel,-13,Y+1.3,ed);add(new THREE.PlaneGeometry(1.4,2.4),new THREE.MeshStandardMaterial({color:C(0x8a9096),metalness:.7,roughness:.25}),-13,Y+1.2,ed-.07).rotation.y=Math.PI;
 const es=add(new THREE.PlaneGeometry(1.6,.4),new THREE.MeshBasicMaterial({map:vText([['🛗 員工電梯',48,.5]],400,100,'#1a1e22','#f2eee2')}),-13,Y+2.9,ed-.08);es.rotation.y=Math.PI;
 const ss=add(new THREE.PlaneGeometry(4,.8),new THREE.MeshBasicMaterial({map:vText([['大洋水槽　水面作業區',52,.45],['OCEAN TANK・TOP DECK',24,.84,'#9fd8ff']],720,140,'#1a1e22','#f2eee2')}),0,Y+4,-35.83);
 AREAS2.push([X0+.3,X1-.3,-20,Z1-.35],[X0+.3,X1-.3,Z0+.35,-34],[X0+.3,-15.2,Z0+.35,Z1-.35],[15.2,X1-.3,Z0+.35,Z1-.35]);
 /* 2F 的電梯門 */
 const ex=-10.6,ez=1.05;box(1.6,2.6,.12,steel,ex,5+1.3,ez-.06);add(new THREE.PlaneGeometry(1.4,2.4),new THREE.MeshStandardMaterial({color:C(0x8a9096),metalness:.7,roughness:.25}),ex,5+1.2,ez);
 add(new THREE.PlaneGeometry(1.6,.4),new THREE.MeshBasicMaterial({map:vText([['🛗 員工電梯・大洋水槽上方',36,.5]],520,100,'#1a1e22','#f2eee2')}),ex,5+2.9,ez+.01);
 const up=()=>{Object.assign(player,{x:-13,y:Y,z:-18.3,yaw:0,pitch:-.35});toast('🛗 到達大洋水槽上方的水面作業區',2200);},down=()=>{Object.assign(player,{x:ex,y:5,z:2.2,yaw:Math.PI,pitch:0});toast('🛗 回到 2F 飼育後場',2000);};
 SPOTS.push(['🌊 大洋水槽上方',up]);
 const _b6=bar;bar=function(){_b6();let k=null;if(lvl()===1&&player.y<8&&Math.hypot(player.x-ex,player.z-ez-1)<2)k=['🛗 員工電梯','搭到大洋水槽上方的水面作業區',['上樓',up]];
  else if(player.y>8&&Math.hypot(player.x+13,player.z+18)<2.6)k=['🛗 員工電梯','回到 2F 飼育後場',['下樓',down]];if(!k)return;near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent=k[0];$('#bD').textContent=k[1];
  if(lastBtns!=='el'+k[2][0]){lastBtns='el'+k[2][0];const bb=$('#bB');bb.innerHTML='';const x=document.createElement('button');x.className='btn feed';x.textContent=k[2][0];x.onclick=k[2][1];bb.appendChild(x);}};})();

/*FISHING*/

