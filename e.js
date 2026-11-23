/* ===== e.js：建築精修、自動門、溫室連廊 ===== */
(function(){
const metal=new THREE.MeshStandardMaterial({color:C(0x23272b),roughness:.3,metalness:.75});
const brass=new THREE.MeshStandardMaterial({color:C(0xb08a4a),roughness:.3,metalness:.85});
const stoneL=new THREE.MeshStandardMaterial({color:C(0xe2dccf),roughness:.6,normalMap:rep(scaleN,20,20),normalScale:new THREE.Vector2(.06,.06)});
const stoneD=new THREE.MeshStandardMaterial({color:C(0x8e8574),roughness:.55});
const wood=new THREE.MeshStandardMaterial({color:C(0x4a3424),roughness:.55,normalMap:rep(scaleN,2,12),normalScale:new THREE.Vector2(.2,.2)});
const brick=ctex(256,128,(x,w,h)=>{x.fillStyle='#d8d0c4';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=0;c<5;c++){const ox=r%2?25:0;x.fillStyle=`hsl(${rnd(10,18)},${rnd(35,50)}%,${rnd(32,42)}%)`;x.fillRect(c*51+ox-25+2,r*16+2,47,12);}});brick.wrapS=brick.wrapT=THREE.RepeatWrapping;
const doorGlass=new THREE.MeshPhysicalMaterial({color:C(0xd8eef8),transparent:true,opacity:.2,roughness:.03,envMapIntensity:1.8,depthWrite:false,side:THREE.DoubleSide});

/* ---------- 自動感應門：人靠近就滑開 ---------- */
const DOORS=[];
function autoDoor(x,z,w,h,alongX){const g=new THREE.Group();g.position.set(x,0,z);if(!alongX)g.rotation.y=Math.PI/2;scene.add(g);const panels=[];
 for(const s of[-1,1]){const p=new THREE.Group();g.add(p);const pw=w/2;const gl=add(new THREE.PlaneGeometry(pw-.06,h-.08),doorGlass,s*pw/2,h/2,0,p);gl.renderOrder=6;
  for(const [bw,bh,bx,by] of[[pw,.05,s*pw/2,h-.025],[pw,.08,s*pw/2,.04],[.05,h,s*.025,h/2],[.05,h,s*(pw-.025),h/2]])box(bw,bh,.05,metal,bx,by,0,p);
  box(.03,.9,.06,brass,s*.12,1.05,.05,p);box(.03,.9,.06,brass,s*.12,1.05,-.05,p);panels.push([p,s]);}
 box(w+.3,.25,.3,metal,0,h+.12,0,g);const sensor=add(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({color:0x40ff90}),0,h+.12,.17,g);
 DOORS.push({x,z,w,panels,o:0,sensor});}
globalAnims.push((t,dt)=>{for(const d of DOORS){const near=Math.hypot(player.x-d.x,player.z-d.z)<3.4;d.o+=((near?1:0)-d.o)*Math.min(1,dt*5);for(const [p,s] of d.panels)p.position.x=s*d.o*(d.w/2-.08);d.sensor.material.color.setHex(near?0x40ff90:0xff5040);}});
autoDoor(0,0,4,3.2,true);autoDoor(-1,16.1,3.2,3.2,true);autoDoor(-14.15,28,4,3.5,false);autoDoor(14.15,28,4,3.5,false);autoDoor(0,40.15,8,5.2,true);autoDoor(0,56,4,3.4,true);

/* ---------- 大廳精修 ---------- */
const med=add(new THREE.RingGeometry(5.2,5.6,96),new THREE.MeshStandardMaterial({color:C(0x2a3a44),roughness:.2,metalness:.2}),0,.004,28);med.rotation.x=-Math.PI/2;
const med2=add(new THREE.RingGeometry(6.4,6.5,96),brass,0,.004,28);med2.rotation.x=-Math.PI/2;
for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=add(new THREE.PlaneGeometry(.06,1),brass,Math.cos(a)*6,.005,28+Math.sin(a)*6);r.rotation.set(-Math.PI/2,0,-a+Math.PI/2);}
for(const sx of[-1,1]){for(const z of[18.2,23.5,32.5,37.8]){box(.5,13.4,.6,stoneL,sx*13.85,6.7,z);box(.7,.4,.8,stoneD,sx*13.8,.2,z);box(.7,.35,.8,stoneD,sx*13.8,13.2,z);}
 for(const zc of[21,35]){box(.08,1.1,9.6,stoneD,sx*13.96,.55,zc);box(.1,.12,9.6,brass,sx*13.94,1.12,zc);}}
for(let x=-12;x<=12;x+=6){if(Math.abs(x)<5)continue;box(.5,13.4,.6,stoneL,x,6.7,16.45);}
for(const [x,z] of[[-6,22],[6,22],[-6,34],[6,34]]){add(cylBetween(V(x,14,z),V(x,10.2,z),.012,.012,4),metal);const sh=add(new THREE.ConeGeometry(.55,.45,32,1,true),new THREE.MeshStandardMaterial({color:C(0x1a1a1a),metalness:.6,roughness:.3,side:THREE.DoubleSide}),x,10,z);glow(x,9.75,z,2.4,0xffe4b8,.75);}
box(28,.08,.08,brass,0,4.82,16.45);
/* 外牆立面 */
for(const x of[-13.5,-9,-5,5,9,13.5])box(.7,14,.5,stoneL,x,7,40.45);
box(29,.8,.9,stoneD,0,13.7,40.5);box(29,.25,.7,stoneL,0,13.1,40.45);box(29,.5,.7,stoneD,0,.25,40.4);
box(10,.2,3.2,metal,0,5.8,41.8);for(const x of[-4.6,4.6])add(new THREE.CylinderGeometry(.08,.08,5.8,12),metal,x,2.9,43.2);
const cg=add(new THREE.PlaneGeometry(9.6,3),doorGlass,0,5.68,41.8);cg.rotation.x=-Math.PI/2;
for(const x of[-4.6,4.6])glow(x,5.5,43.2,1.2,0xfff0c0,.6);

/* ---------- 水族展廳精修 ---------- */
for(let x=-10;x<=10;x+=4)box(.25,.3,16,wood,x,4.35,8);for(let z=2;z<=14;z+=4)box(24,.3,.25,wood,0,4.35,z);
const runner=add(new THREE.PlaneGeometry(2.6,15),new THREE.MeshStandardMaterial({color:C(0x1d3a4a),roughness:.9}),0,.006,8);runner.rotation.x=-Math.PI/2;
for(const sx of[-1,1])box(.06,.008,15,brass,sx*1.33,.008,8);
for(const [x,z] of[[-11.85,6],[-11.85,10.5],[11.85,8.5],[11.85,14],[-6,15.85],[6,15.85]]){const s=add(new THREE.CylinderGeometry(.09,.13,.3,16,1,true),new THREE.MeshStandardMaterial({color:C(0xd8c9a0),emissive:C(0xffd9a0),emissiveIntensity:.6,side:THREE.DoubleSide}),x,2.7,z);glow(x,2.75,z,.9,0xffd9a0,.5);}
const bm=new THREE.MeshStandardMaterial({color:C(0x2a2622),roughness:.5});for(const z of[5.5,11]){box(1.8,.08,.5,bm,0,.45,z);box(.1,.42,.4,bm,-.8,.21,z);box(.1,.42,.4,bm,.8,.21,z);}
OBST.push([-1,1,5.2,5.8],[-1,1,10.7,11.3]);

/* ---------- 大洋廳精修 ---------- */
for(const sx of[-1,1]){for(let z=-18;z<=-2;z+=4)box(.06,7.5,.06,new THREE.MeshBasicMaterial({color:C(0x2f8fd0)}),sx*15.95,4.5,z);box(.1,.06,20,new THREE.MeshBasicMaterial({color:C(0x2f8fd0)}),sx*15.9,.08,-10);}
box(22,.04,.12,new THREE.MeshBasicMaterial({color:C(0x4fc8ff)}),0,.03,-19.6);

/* ---------- 爬蟲館精修 ---------- */
box(.08,1.2,16,wood,-35.96,.6,28);box(22,1.2,.08,wood,-25,.6,35.96);box(22,1.2,.08,wood,-25,.6,20.04);
box(.1,.08,16,brass,-35.94,1.22,28);box(22,.08,.1,brass,-25,1.22,35.94);box(22,.08,.1,brass,-25,1.22,20.06);
{const arch=new THREE.TorusGeometry(2.1,.18,10,32,Math.PI);arch.rotateY(Math.PI/2);add(arch,stoneD,-14.3,3.5,28);}
/* （爬蟲館四角地上的植物已移除） */

/* ---------- 溫室連廊（大廳→溫室，有頂棚） ---------- */
/* 兩側全開：只留四角與前後段的柱子，中段（左右小路交會處 z≈48）不放柱子，可以直接往兩邊走 */
for(let z=41.5;z<=55;z+=3.35){if(Math.abs(z-48.2)>.5)for(const sx of[-1,1]){add(new THREE.CylinderGeometry(.07,.07,3.4,12),metal,sx*2.4,1.7,z);OBST.push([sx*2.4-.12,sx*2.4+.12,z-.12,z+.12]);}box(5,.12,.12,metal,0,3.4,z);glow(0,3.2,z,1.1,0xfff0c8,.55);}
for(const sx of[-1,1])box(.12,.12,15,metal,sx*2.4,3.4,48.3);
const roof=add(new THREE.PlaneGeometry(5,15),doorGlass,0,3.45,48.3);roof.rotation.x=-Math.PI/2;
/* （原本兩側的花台已移除，讓連廊左右可以自由進出庭園） */

/* ---------- 溫室入口門廊與磚牆基座 ---------- */
const bt=rep(brick,6,1),bm2=new THREE.MeshStandardMaterial({map:bt,roughness:.85});
for(const [x,z,w,d] of[[-10,56,16,.35],[10,56,16,.35],[0,88,36,.35],[-18,72,.35,32],[18,72,.35,32]])box(w,.6,d,bm2,x,.3,z);
box(.4,4,.6,bm2,-2.2,2,56);box(.4,4,.6,bm2,2.2,2,56);box(4.8,.5,.6,bm2,0,4.1,56);
const gab=new THREE.CylinderGeometry(2.6,2.6,2,24,1,true,Math.PI/2,Math.PI);gab.rotateX(Math.PI/2);gab.scale(1,.45,1);const gm=add(gab,doorGlass,0,4.35,55);
for(const sx of[-1,1])add(new THREE.CylinderGeometry(.06,.06,4.35,10),new THREE.MeshStandardMaterial({color:C(0xf0f0ea),roughness:.4,metalness:.3}),sx*2.5,2.17,54);
box(.2,.2,32.2,new THREE.MeshStandardMaterial({color:C(0xf0f0ea),roughness:.4,metalness:.3}),0,12.05,72);OBST.push([-4.8,-4.4,43,43.4],[4.4,4.8,43,43.4],[-2.65,-2.35,53.8,54.2],[2.35,2.65,53.8,54.2]);
for(const z of[56,64,72,80,88]){add(new THREE.ConeGeometry(.12,.6,8),brass,0,12.4,z);}

/* ---------- 走路更快 ---------- */
})();
