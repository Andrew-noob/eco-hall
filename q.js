/* ===== q.js：釣魚系統 2.0 ===== 甩竿蓄力、3D 漁獲、天氣、餌料、Boss、新釣場、開船換海域、籠捕撈網、魚市行情 */

/* ---------- 新魚種 ---------- */
function gGen(o){const L=o.L,c=k=>C(o[k]||o.side),g=[];const B=c('back'),Sd=c('side'),Bl=c('belly'),F=c('fin');
 g.push(loft(L,fusi(L*(o.h||.2),L*(o.w||.1),o.p||.35,o.tr||.25,o.bl||.6),(col,t,a,x,y,z)=>{const ca=Math.cos(a);col.copy(ca>.45?B:ca<-.45?Bl:Sd);
  if(o.band&&Math.abs(ca)<.2&&t>.15)col.copy(C(o.band));if(o.spots&&ca>-.2&&Math.sin(x*o.spots)*Math.sin(a*11)>.75)col.copy(C(0x1a1a1a));if(o.bars&&t>.15&&t<.85&&ca>-.4&&Math.sin(t*o.bars)>.55)col.copy(C(0x1a1a1a));},o.ribbon?48:32,14));
 const H=L*(o.h||.2);
 if(o.ribbon)g.push(fin([[L*.4,H*.9,0],[-L*.45,H*.9,0],[-L*.48,H*.3,0],[L*.38,H*1.3,0]],[F]));
 else{g.push(fin([[L*.12,H*.85,0],[-L*.02,H*(o.dh||1.7),0],[-L*.14,H*.8,0]],[F]),fin([[-L*.18,-H*.7,0],[-L*.26,-H*1.3,0],[-L*.32,-H*.6,0]],[F]),caudal(-L*.47,H*.15,L*(o.cl||.16),H*(o.ch||1.2),o.fork||.7,[F]),...pecs(L*.25,L*.2,L*.1,-H*.4,H*.3,L*.12,L*.04,[F]));}
 if(o.sail)g.push(fin([[L*.32,H*.9,0],[L*.2,H*3.2,0],[-L*.05,H*2.4,0],[-L*.15,H*.9,0]],[C(o.sail)]));
 if(o.bill)g.push(prim(cylBetween(V(L*.5,0,0),V(L*.5+o.bill,-H*.05,0),H*.12,H*.02,8),C(o.back)));
 g.push(...eyes(L*.38,H*.25,H*.5,H*(o.eye||.18),C(0x111111)));return merge(g);}
const NEWF={
 trout:{n:'虹鱒',s:'Oncorhynchus mykiss',z:'全長 45 cm',f:'身體側面有一條粉紅色的彩虹帶，喜歡冰冷乾淨的水。',hab:'stream',cost:3,tr:[8,20],price:600,len:.45,o:{L:.4,back:0x5a6a4a,side:0xc8c4b8,belly:0xf2eee6,fin:0x8a8a72,band:0xd88a8a,spots:220}},
 smelt:{n:'公魚',s:'Hypomesus nipponensis',z:'全長 12 cm',f:'冬天在結冰的湖面鑿洞釣的代表魚，身體半透明。',hab:'fresh',cost:1,tr:[4,20],price:120,len:.12,o:{L:.12,h:.13,w:.07,back:0x9aa890,side:0xd8e0dc,belly:0xf2f4f2,fin:0xc8d0cc,band:0xa8b8c0}},
 mudskipper:{n:'彈塗魚',s:'Periophthalmus modestus',z:'全長 12 cm',f:'能用胸鰭在泥灘上「走路」，眼睛長在頭頂可以四處張望。',hab:'fresh',cost:1,tr:[20,32],price:300,len:.12,o:{L:.12,h:.14,w:.13,p:.25,back:0x6a5a40,side:0x8a7a5a,belly:0xc8b898,fin:0x5a6a7a,spots:300,eye:.3,dh:2.4}},
 archer:{n:'射水魚',s:'Toxotes jaculatrix',z:'全長 20 cm',f:'會從嘴裡噴出水柱，把樹葉上的昆蟲射下來吃。',hab:'fresh',cost:2,tr:[24,30],price:500,len:.2,o:{L:.2,h:.32,w:.12,back:0x8a9a8a,side:0xe0e4dc,belly:0xf2f2ee,fin:0x2a2a2a,bars:22}},
 mullet:{n:'烏魚',s:'Mugil cephalus',z:'全長 50 cm',f:'冬至前後成群洄游到台灣西南沿海，烏魚子就是牠的卵。',hab:'reef',cost:3,tr:[16,28],price:600,len:.5,min:'L',o:{L:.45,h:.17,w:.12,back:0x4a5a6a,side:0xb8c0c8,belly:0xe8ecee,fin:0x6a7480,band:0x8a96a2}},
 hairtail:{n:'白帶魚',s:'Trichiurus lepturus',z:'全長 1 m',f:'身體像一條銀色的緞帶，夜晚會游到水面附近覓食。',hab:'reef',cost:3,tr:[18,28],price:900,len:1,min:'L',o:{L:1,h:.07,w:.02,p:.15,tr:.02,bl:.4,back:0xd8e0e8,side:0xe8eef2,belly:0xf2f6f8,fin:0xc8d8e0,ribbon:1,eye:.4}}};
for(const [k,d] of Object.entries(NEWF)){SP[k]={n:d.n,s:d.s,z:d.z,f:d.f,hab:d.hab,cost:d.cost,hr:.05,tr:d.tr,len:d.len,...(d.min?{min:d.min}:{})};PRICE[k]=d.price;
 MAKE[k]=(tk,e)=>new Agent(new THREE.Mesh(gGen(d.o),cache(tk,'nf'+k,()=>fishMat(tk,{amp:d.len*.03,k:6/d.len,spd:10,nose:d.o.L/2,len:d.o.L}))),tk,e,{speed:d.len*.6,turn:2,reach:d.len,wait:[0,2],pitchMax:.15,nose:d.o.L/2,eatR:.03,fill:6});}
Object.assign(BR,{trout:{m:'spawn',n:[2,3],p:.08},smelt:{m:'spawn',n:[2,3],p:.12},archer:{m:'spawn',n:[1,2],p:.06}});

/* ---------- 釣場資料 ---------- */
Object.assign(FW,{
 ice:{n:'🧊 冰釣',d:'在結冰的湖面鑿洞，釣公魚和虹鱒',C:V(0,0,1000),stand:[0,0,998.4],yaw:0,area:[-1.3,1.3,997.75,1000.5],wy:0,dist:[0,0],hole:V(0,0,997.1),
  tab:[['smelt',30],['trout',18],['kuhua',6],['sakura',4],['junk',6],['coin',4]],boss:'icelord',trap:0},
 mangrove:{n:'🌿 紅樹林',d:'泥灘與水筆仔之間，彈塗魚、射水魚、烏魚',C:V(1000,0,1000),stand:[1000,0,998.6],yaw:0,area:[999.25,1000.75,998.3,1006],wy:-.4,dist:[4,9],
  tab:[['mudskipper',18],['archer',14],['mullet',12],['goby',12],['guppy',8],['junk',8],['coin',4]],boss:'barra',trap:1},
 pier:{n:'🌙 夜間堤防',d:'夜晚的防波堤，開燈釣白帶魚，大物是浪人鰺',C:V(-1000,0,1000),stand:[-1000,0,991.6],yaw:0,area:[-1001.3,-998.7,991.2,1010],wy:-1.5,dist:[8,16],night:1,
  tab:[['hairtail',20],['mullet',12],['puffer',10],['lion',6],['grouper',4],['junk',8],['coin',5]],boss:'gt',trap:1}});
Object.assign(FW.sea,{stand:[0,0,-706],area:[-2,2,-707.2,-697.4],dist:[8,16],boss:'marlin'});Object.assign(FW.stream,{boss:'kuhuaking',trap:1,net:1});Object.assign(FW.lake,{boss:'lakelord',trap:1});FW.mangrove.net=1;
const SEAZ={near:{n:'近海',col:0x1e5a8a,tab:FW.sea.tab},deep:{n:'深海',col:0x0c2650,tab:[['grouper',14],['shark',8],['hairtail',14],['mullet',10],['lion',8],['junk',6],['coin',6]]},
 reef:{n:'珊瑚礁',col:0x2a9ab8,tab:[['clown',16],['btang',14],['ytang',14],['mandarin',8],['puffer',10],['lion',8],['junk',4],['coin',4]]}};
const BOSS={marlin:{n:'旗魚',w:'sea',len:3.2,val:18000,col:0x1a3a7a},kuhuaking:{n:'苦花王',w:'stream',len:.65,val:8000,tint:[1.3,1.05,.5]},lakelord:{n:'湖主・大鯉魚',w:'lake',len:1.3,val:12000,tint:[1.2,.9,.4]},
 icelord:{n:'冰湖巨鱒',w:'ice',len:1.1,val:10000,tint:[.85,1,1.25]},barra:{n:'巨型尖吻鱸',w:'mangrove',len:1.4,val:11000},gt:{n:'浪人鰺',w:'pier',len:1.5,val:15000}};
const TAG={opsari:'insect',kuhua:'veg',goby:'worm',hemi:'veg',sakura:'insect',koi:'veg',goldfish:'veg',guppy:'insect',betta:'insect',loach:'worm',pturtle:'meat',arowana:'insect',puffer:'shrimp',lion:'meat',btang:'veg',ytang:'veg',clown:'shrimp',grouper:'meat',shark:'meat',trout:'insect',smelt:'worm',mudskipper:'worm',archer:'insect',mullet:'veg',hairtail:'shrimp',mandarin:'shrimp'};
const BAIT={none:{n:'空鉤',ic:'🪝'},worm:{n:'蚯蚓',ic:'🪱',tag:{worm:3,insect:1.5}},insect:{n:'蟋蟀',ic:'🦗',tag:{insect:3}},shrimp:{n:'蝦',ic:'🦐',tag:{shrimp:3,meat:2}},dough:{n:'麵糊',ic:'🌽',tag:{veg:3}},lure:{n:'高級擬餌',ic:'✨',tag:{meat:2.5},rare:3}};
const baitCnt=k=>{S.fg=S.fg||{rod:1,reel:1,line:1,sonar:1,lure:0};ensureStock();return k==='none'?Infinity:k==='worm'?(S.fg.worm||0):k==='insect'?S.stock.insect:k==='shrimp'?S.stock.brine:k==='dough'?S.stock.veg:(S.fg.lure||0);};
const useBait=k=>{if(k==='worm')S.fg.worm--;else if(k==='insect')S.stock.insect--;else if(k==='shrimp')S.stock.brine--;else if(k==='dough')S.stock.veg--;else if(k==='lure')S.fg.lure--;markDirty();};

/* ---------- 3D 漁獲顯示用模型 ---------- */
function turtleGeo(){return merge([colorize(new THREE.SphereGeometry(.12,18,10,0,6.29,0,1.6).scale(1.15,.45,1),(c,x,y,z)=>c.set(Math.sin(x*60)*Math.sin(z*60)>.3?0x3a4a2a:0x5a6a3a).convertSRGBToLinear()),prim(new THREE.SphereGeometry(.035,10,8).translate(.15,.01,0),C(0x6a7a4a)),
 ...[[.08,.08],[.08,-.08],[-.08,.08],[-.08,-.08]].map(([x,z])=>prim(new THREE.SphereGeometry(.03,8,6).scale(1.4,.5,1).translate(x,-.01,z),C(0x6a7a4a)))]);}
const GEOF={puffer:gPuffer,lion:gLion,btang:gBTang,ytang:gYTang,clown:gClown,grouper:gGrouper,shark:gShark,opsari:gOpsari,kuhua:gKuhua,goby:gGoby,hemi:gHemi,sakura:gSakura,koi:()=>gKoi().geo,goldfish:gGoldfish,guppy:gGuppy,betta:gBetta,loach:gLoach,arowana:gArowana,pturtle:turtleGeo,mandarin:gMandarin,
 marlin:()=>gGen({L:1,h:.18,w:.09,back:0x1a3a7a,side:0x8aa0c0,belly:0xe8ecf2,fin:0x1a2a5a,bars:30,sail:0x2a4aa0,bill:.35,fork:.4,ch:2,cl:.22}),kuhuaking:gKuhua,lakelord:()=>gKoi().geo,
 icelord:()=>gGen({L:1,h:.2,w:.11,back:0x4a5a5a,side:0xc8ccd0,belly:0xf2f2f2,fin:0x6a7a7a,band:0xc88a9a,spots:90}),barra:()=>gGen({L:1,h:.26,w:.12,back:0x6a6a5a,side:0xd8d4c8,belly:0xf2f0ea,fin:0x8a8070,eye:.22}),
 gt:()=>gGen({L:1,h:.32,w:.12,back:0x3a4048,side:0x8a9098,belly:0xc8ccd0,fin:0x2a2e34,fork:.3,ch:1.6})};
for(const k in NEWF)GEOF[k]=()=>gGen(NEWF[k].o);
const geoC={};const dispGeo=k=>{if(!geoC[k]){const f=GEOF[k];let g=f?f():new THREE.SphereGeometry(.1,12,8);g.computeBoundingBox();const b=g.boundingBox,c=b.getCenter(V(0,0,0));g=g.clone();g.translate(-c.x,-c.y,-c.z);g.computeBoundingBox();geoC[k]={g,len:b.max.x-b.min.x};}return geoC[k];};

/* ---------- 場景：大船、新釣場 ---------- */
let BOAT=null,ISL=null,WAKE=null,seaMesh=null,seaOff=0,seaSpd=3.5;
(function(){const wood=new THREE.MeshStandardMaterial({color:C(0x8a6a48),roughness:.85,normalMap:rep(scaleN,2,8),normalScale:new THREE.Vector2(.5,.5)}),wht=new THREE.MeshStandardMaterial({color:C(0xf2f2ee),roughness:.45}),stl=new THREE.MeshStandardMaterial({color:C(0xc8ccd0),metalness:.7,roughness:.3});
 /* 海：換成 16 m 漁船，舊船與島移除 */
 {const c=FW.sea.C;if(FW.sea.boat)scene.remove(FW.sea.boat);for(let i=scene.children.length-1;i>=0;i--){const o=scene.children[i];if(o.geometry&&o.geometry.type==='ConeGeometry'&&o.position.z<-400&&Math.abs(o.position.x)<400)scene.remove(o);if(o.geometry===seaGeo)seaMesh=o;}
  BOAT=new THREE.Group();BOAT.position.copy(c);scene.add(BOAT);const h=new THREE.Group();h.rotation.y=Math.PI/2;BOAT.add(h);
  {const hg=loft(16,keyProf([[0,.05,.05],[.1,1.1,.9],[.3,1.5,2.4],[.75,1.5,2.6],[1,1.3,2.4]]),(cl,t,a,x,y)=>cl.set(y<-1.15?0xa83a2a:y<-.95?0x1a3a6a:0xf2f2ee),48,18);const pp=hg.attributes.position;for(let i=0;i<pp.count;i++)if(pp.getY(i)>0)pp.setY(i,0);hg.computeVertexNormals();
   add(hg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.45,side:THREE.DoubleSide}),0,-.08,0,h);for(const s of[-1,1])box(13.5,.55,.08,new THREE.MeshStandardMaterial({color:C(0xf2f2ee),roughness:.5}),-.8,.22,s*2.3,h);}
  box(15,.1,4.6,wood,-.6,-.05,0,h);for(const s of[-1,1]){box(14,.08,.08,stl,-.8,.95,s*2.35,h);for(let x=-7.5;x<=6;x+=1.5)box(.05,.95,.05,stl,x,.47,s*2.35,h);}
  box(3.6,2.4,3.6,wht,-5.4,1.2,0,h);box(3.62,.7,3.62,new THREE.MeshPhysicalMaterial({color:0x22303c,roughness:.05}),-5.4,1.85,0,h);box(4,.15,4,wht,-5.4,2.47,0,h);
  add(new THREE.CylinderGeometry(.06,.06,4,8),stl,-6,4.4,0,h);box(1.4,.1,.15,stl,-6,5.2,0,h);const rad=box(1.2,.08,.25,new THREE.MeshStandardMaterial({color:0x333333}),-5.2,2.75,0,h);
  const flag=add(new THREE.PlaneGeometry(.9,.55),new THREE.MeshStandardMaterial({color:C(0x2a8ad8),side:THREE.DoubleSide}),-6.45,6,0,h);
  for(const s of[-1,1]){const r=add(new THREE.TorusGeometry(.32,.08,8,20),new THREE.MeshStandardMaterial({color:C(0xe8502a)}),-3.6,1.1,s*2.42,h);}
  box(1.2,.7,.8,new THREE.MeshStandardMaterial({color:C(0x3a8ad8)}),-2.8,.35,1.6,h);box(1.2,.7,.8,new THREE.MeshStandardMaterial({color:C(0xf2f2ee)}),-2.8,.35,-1.6,h);
  for(let i=0;i<4;i++)add(cylBetween(V(-4+i*.4,1,2.2),V(-4.6+i*.4,3.2,3),.012,.006,5),new THREE.MeshStandardMaterial({color:0x222222}),0,0,0,h);
  for(const s of[-1,1])add(cylBetween(V(-3,2.4,s*.3),V(-2,7,s*5),.04,.02,6),stl,0,0,0,h);
  BOAT.userData.flag=flag;BOAT.userData.rad=rad;
  const fc=document.createElement('canvas');fc.width=64;fc.height=256;const fx=fc.getContext('2d');for(let i=0;i<300;i++){fx.fillStyle=`rgba(255,255,255,${Math.random()*.6})`;fx.fillRect(Math.random()*64,Math.random()*256,rnd(2,8),rnd(2,6));}
  const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(1,3);WAKE=ft;for(const s of[-1,1]){const w=add(new THREE.PlaneGeometry(2.6,40),new THREE.MeshBasicMaterial({map:ft,transparent:true,opacity:.8,depthWrite:false}),c.x+s*1.6,-1.25,c.z+28);w.rotation.x=-Math.PI/2;w.rotation.z=s*.06;}
  ISL=new THREE.Group();ISL.position.copy(c);scene.add(ISL);for(const [x,z,s] of[[-180,-220,40],[120,-260,55],[260,-80,30],[-240,60,45],[160,140,35],[-120,-60,25]]){const m=add(new THREE.ConeGeometry(s,s*.5,16),new THREE.MeshStandardMaterial({color:C(0x4a6a3a),roughness:1,flatShading:true}),x,-1.3+s*.22,z,ISL);m.userData.z0=z;}
  const cor=new THREE.Group();cor.position.copy(c);cor.visible=false;scene.add(cor);FW.sea.coral=cor;for(let i=0;i<70;i++)add(new THREE.SphereGeometry(rnd(.5,1.6),8,6).scale(1,.5,1),new THREE.MeshStandardMaterial({color:C([0xe86a8a,0xf2a03a,0x8a5ad8,0x3ab88a][i%4]),roughness:.8}),rnd(-30,30),-3.5,rnd(-40,-8),cor);
  AREAS.push(FW.sea.area);}
 /* 冰釣 */
 {const c=FW.ice.C;addSky(skyM('#9ab8d8','#e8f0f6','#c8d4dc'),c.x,0,c.z);const sn=add(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:C(0xf2f6fa),roughness:.9}),c.x,-.01,c.z);sn.rotation.x=-Math.PI/2;
  const ic=ctex(512,512,(x,w,h)=>{x.fillStyle='#bcd8e8';x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,.7)';for(let i=0;i<40;i++){x.lineWidth=rnd(.5,2);x.beginPath();let px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);for(let k=0;k<5;k++){px+=rnd(-60,60);py+=rnd(-60,60);x.lineTo(px,py);}x.stroke();}});
  const lk=add(new THREE.CircleGeometry(80,48),new THREE.MeshStandardMaterial({map:ic,roughness:.25,metalness:.1}),c.x,0,c.z-40);lk.rotation.x=-Math.PI/2;
  const hole=FW.ice.hole;const hm=add(new THREE.CircleGeometry(.45,24),new THREE.MeshStandardMaterial({color:C(0x0a2030),roughness:.1}),hole.x,.012,hole.z);hm.rotation.x=-Math.PI/2;
  for(let i=0;i<10;i++){const a=i/10*6.28;add(new THREE.BoxGeometry(rnd(.15,.3),rnd(.05,.12),rnd(.15,.3)),new THREE.MeshStandardMaterial({color:C(0xd8eef8),roughness:.2}),hole.x+Math.cos(a)*.55,.04,hole.z+Math.sin(a)*.55).rotation.y=a;}
  add(new THREE.ConeGeometry(1.8,2.4,6,1,true),new THREE.MeshStandardMaterial({color:C(0xd84a2a),side:THREE.DoubleSide}),c.x,1.2,c.z+2.6);box(.5,.4,.4,new THREE.MeshStandardMaterial({color:C(0x3a7ad8)}),c.x+.9,.2,c.z-1.1);
  for(let i=0;i<40;i++){const a=rnd(0,6.28),r=rnd(25,90);treeAt(scene,c.x+Math.cos(a)*r,0,c.z+Math.sin(a)*r+20,rnd(6,12),{r:.3,n:10,leaf:[0xc8d8d0,0x9ab0a0,0xe8f0ec]});}
  for(const [x,z,s] of[[-80,-200,90],[100,-180,110],[0,-260,130]])add(new THREE.ConeGeometry(s,s*1.1,10),new THREE.MeshStandardMaterial({color:C(0xe8eef2),roughness:.9,flatShading:true}),c.x+x,s*.45,c.z+z);AREAS.push(FW.ice.area);}
 /* 紅樹林 */
 {const c=FW.mangrove.C;addSky(skyM('#7aa0b8','#e0e4cc','#4a5a3a'),c.x,0,c.z);const wm=add(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:C(0x4a5a3a),roughness:.15,metalness:.25}),c.x,-.4,c.z);wm.rotation.x=-Math.PI/2;
  for(let i=0;i<30;i++){const m=add(new THREE.CircleGeometry(rnd(2,6),16),new THREE.MeshStandardMaterial({color:C(0x5a4a34),roughness:1}),c.x+rnd(-40,40),-.38,c.z+rnd(-50,20));m.rotation.x=-Math.PI/2;}
  const bark=new THREE.MeshStandardMaterial({color:C(0x6a5a44),roughness:.9}),lf=new THREE.MeshStandardMaterial({color:C(0x2e5a2a),roughness:.8,flatShading:true});
  for(let i=0;i<45;i++){const x=c.x+rnd(-45,45),z=c.z+rnd(-55,25);if(Math.abs(x-c.x)<4&&z>c.z-12)continue;const h=rnd(3,6);add(new THREE.CylinderGeometry(.12,.18,h,6),bark,x,h/2-.4,z);
   for(let k=0;k<6;k++){const a=k/6*6.28;add(cylBetween(V(x,1.2,z),V(x+Math.cos(a)*1.2,-.4,z+Math.sin(a)*1.2),.05,.04,5),bark);}for(let k=0;k<3;k++)add(new THREE.SphereGeometry(rnd(1.3,2.2),8,6),lf,x+rnd(-1,1),h-.4+rnd(0,1),z+rnd(-1,1));}
  for(let z=1006;z>997.9;z-=.24)box(1.6,.06,.2,wood,c.x,-.03,z);for(let z=1006;z>998;z-=2)for(const s of[-.75,.75])add(new THREE.CylinderGeometry(.06,.06,1,6),wood,c.x+s,-.5,z);AREAS.push(FW.mangrove.area);}
 /* 夜間堤防 */
 {const c=FW.pier.C;addSky(skyM('#03050c','#0e1a30','#03050c'),c.x,0,c.z);const st=new Float32Array(900);for(let i=0;i<300;i++){const a=rnd(0,6.28),e=rnd(.05,1.4),r=360;st[i*3]=c.x+Math.cos(a)*Math.cos(e)*r;st[i*3+1]=Math.sin(e)*r;st[i*3+2]=c.z+Math.sin(a)*Math.cos(e)*r;}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(st,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,fog:false})));
  const sea=add(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:C(0x08121c),roughness:.12,metalness:.4}),c.x,-1.5,c.z);sea.rotation.x=-Math.PI/2;
  const con=new THREE.MeshStandardMaterial({color:C(0x8a8a86),roughness:.9});box(3,1.6,22,con,c.x,-.8,c.z+1);
  for(let i=0;i<16;i++){const z=c.z+rnd(-9,11),x=c.x+(i%2?2.4:-2.4)+rnd(-.4,.4),g=new THREE.Group();g.position.set(x,-1,z);g.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));scene.add(g);for(const d of[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]])add(cylBetween(V(0,0,0),V(d[0]*.6,d[1]*.6,d[2]*.6),.22,.14,6),con,0,0,0,g);}
  for(let z=-8;z<=10;z+=6){add(new THREE.CylinderGeometry(.06,.08,4,6),stl,c.x+1.3,2,c.z+z);add(new THREE.SphereGeometry(.18,10,8),new THREE.MeshBasicMaterial({color:C(0xffd890)}),c.x+1.1,4,c.z+z);}
  const pl=new THREE.PointLight(C(0xffd890),1.4,20,1.4);pl.position.set(c.x+1.1,3.8,c.z-8);scene.add(pl);FW.pier.light=pl;
  const gl=add(new THREE.CircleGeometry(3,24),new THREE.MeshBasicMaterial({color:C(0x3aff8a),transparent:true,opacity:.18,depthWrite:false}),c.x,-1.48,c.z-11);gl.rotation.x=-Math.PI/2;
  for(let i=0;i<60;i++)add(new THREE.SphereGeometry(rnd(.4,1),6,4),new THREE.MeshBasicMaterial({color:C([0xffe0a0,0xfff4e0,0xff9a6a][i%3])}),c.x+rnd(-300,300),rnd(.5,6),c.z-330+rnd(-10,10));AREAS.push(FW.pier.area);}})();

/* ---------- 天氣 ---------- */
const WX={k:'晴',t:120};const WXL=['晴','晴','陰','雨','霧'];
const L0={h:hemi.intensity,s:sunL.intensity};let rainP=null,snowP=null;
(function(){const n=700,p=new Float32Array(n*6);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));rainP=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xaac8e0,transparent:true,opacity:.55}));rainP.frustumCulled=false;rainP.visible=false;scene.add(rainP);
 const m=500,q=new Float32Array(m*3);const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.BufferAttribute(q,3));snowP=new THREE.Points(g2,new THREE.PointsMaterial({color:0xffffff,size:.06,transparent:true,opacity:.9}));snowP.frustumCulled=false;snowP.visible=false;scene.add(snowP);
 for(let i=0;i<n;i++){p[i*6]=rnd(-25,25);p[i*6+1]=rnd(0,20);p[i*6+2]=rnd(-25,25);}for(let i=0;i<m;i++){q[i*3]=rnd(-20,20);q[i*3+1]=rnd(0,12);q[i*3+2]=rnd(-20,20);}})();
const wxNow=k=>k==='ice'?'雪':WX.k;
function applyEnv(k){if(!k){hemi.intensity=L0.h;sunL.intensity=L0.s;scene.fog=null;rainP.visible=snowP.visible=false;return;}const w=wxNow(k),night=FW[k].night;
 const m=(night?.22:1)*({晴:1,陰:.72,雨:.55,霧:.7,雪:.8}[w]);hemi.intensity=L0.h*(night?.6:1)+.15*m;sunL.intensity=L0.s*m;
 scene.fog=w==='霧'?new THREE.Fog(night?0x101820:0xc8d0d4,6,70):w==='雨'?new THREE.Fog(0x6a7680,20,220):null;rainP.visible=w==='雨';snowP.visible=w==='雪';}

/* ---------- 魚市行情（同一種魚賣越多越便宜，會慢慢回升） ---------- */
function mktF(k){S.mkt=S.mkt||{};const m=S.mkt[k];if(!m)return 1;const f=Math.min(1,m.f+(Date.now()-m.t)/60000*.06);return f;}
function mktHit(k){S.mkt=S.mkt||{};S.mkt[k]={f:Math.max(.3,mktF(k)*.85),t:Date.now()};markDirty();}
let fishVal=(k,g)=>BOSS[k]?Math.round(BOSS[k].val*mktF(k)):Math.round((PRICE[k]||100)*.6*geneMul(g)*mktF(k));

/* ---------- 釣具、介面 ---------- */
const rodM=new THREE.MeshStandardMaterial({color:C(0x2a2a2a),roughness:.4,metalness:.3}),rod=new THREE.Group();rod.visible=false;scene.add(rod);const RSEG=[];{let par=rod;const SL2=.32;for(let i=0;i<6;i++){const g=new THREE.Group();g.position.y=i?SL2:0;par.add(g);add(new THREE.CylinderGeometry(.014-(i+1)*.0015,.014-i*.0015,SL2,6).translate(0,SL2/2,0),rodM,0,0,0,g);if(i)add(new THREE.TorusGeometry(.012,.002,4,10),new THREE.MeshStandardMaterial({color:0xcccccc,metalness:.8}),.012,0,0,g);RSEG.push(g);par=g;}
 const tipO=new THREE.Object3D();tipO.position.y=SL2;par.add(tipO);rod.userData.tip=tipO;add(new THREE.CylinderGeometry(.035,.035,.045,14).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:C(0x8a8a8a),metalness:.8,roughness:.3}),.035,.28,0,RSEG[0]);add(new THREE.CylinderGeometry(.018,.018,.25,8),new THREE.MeshStandardMaterial({color:C(0x2a1a10),roughness:.8}),0,.12,0,RSEG[0]);}
function rodTipW(){rod.updateMatrixWorld(true);return rod.userData.tip.getWorldPosition(V(0,0,0));}
const fBob=new THREE.Group();add(new THREE.SphereGeometry(.06,12,8,0,6.29,0,1.57),new THREE.MeshStandardMaterial({color:C(0xe83a2a),emissive:C(0x601008)}),0,0,0,fBob);add(new THREE.SphereGeometry(.06,12,8,0,6.29,1.57,1.57),new THREE.MeshStandardMaterial({color:0xf2f2f2}),0,0,0,fBob);fBob.visible=false;scene.add(fBob);
const lineG=new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,0),V(0,0,0)]),fline=new THREE.Line(lineG,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.7}));fline.visible=false;fline.frustumCulled=false;scene.add(fline);
const ring=add(new THREE.RingGeometry(.1,.16,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),0,-100,0);ring.rotation.x=-Math.PI/2;
const showM=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.15,side:THREE.DoubleSide}));showM.visible=false;scene.add(showM);
const FU=document.createElement('div');FU.style.cssText='position:fixed;left:50%;bottom:150px;transform:translateX(-50%);width:min(350px,90vw);background:rgba(8,16,22,.9);border:1px solid rgba(111,211,255,.35);border-radius:14px;padding:12px;color:#e8f4f8;display:none;z-index:30;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none';
FU.innerHTML='<div id="fT" style="font-weight:700;font-size:16px;margin-bottom:6px"></div><div id="fBaits" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-bottom:6px"></div><div id="fPow" style="position:relative;height:22px;background:#1a2a30;border-radius:11px;overflow:hidden;margin:6px 0;display:none"><i style="position:absolute;top:0;bottom:0;left:82%;width:13%;background:#f2c94c;opacity:.75"></i><i id="fPowF" style="position:absolute;top:0;bottom:0;left:0;width:0;background:linear-gradient(90deg,#3fa0ff,#3fd28a)"></i></div><div id="fBar" style="position:relative;height:26px;background:#1a2a30;border-radius:13px;overflow:hidden;margin:8px 0;display:none"><i id="fZone" style="position:absolute;top:0;bottom:0;background:#3fd28a;opacity:.8"></i><i id="fMk" style="position:absolute;top:-2px;bottom:-2px;width:6px;margin-left:-3px;background:#fff;border-radius:3px;box-shadow:0 0 6px #fff"></i></div><div id="fS" class="mut sm" style="margin-bottom:8px"></div><div id="fB" style="display:flex;gap:6px;justify-content:center"></div>';
document.body.appendChild(FU);
let FS=null,FWK=null,RET=null;const fT=t=>$('#fT').textContent=t,fSub=t=>$('#fS').textContent=t;const vib=n=>{if(typeof navigator!=='undefined'&&navigator.vibrate)navigator.vibrate(n);};
function fBtns(list){const b=$('#fB');b.innerHTML='';for(const [t,f,c,fast] of list){const x=document.createElement('button');x.className='btn '+(c||'');x.textContent=t;x.style.flex='1';x.style.touchAction='none';
 if(fast){x.style.padding='14px 0';x.style.fontSize='18px';x.addEventListener('pointerdown',e=>{e.preventDefault();f();});}else x.onclick=f;b.appendChild(x);}}
const waveY=(x,z,t)=>Math.sin(x*.08+t*.9)*.22+Math.sin((z-seaOff)*.11+t*1.25)*.16;
function curW(){for(const k in FW){const a=FW[k].area;if(player.x>a[0]-2&&player.x<a[1]+2&&player.z>a[2]-2&&player.z<a[3]+2)return k;}return null;}
function tabOf(k){return k==='sea'?SEAZ[S.seaZ||'near'].tab:FW[k].tab;}
function fishMenu(){sheet('🎣 去釣魚',`<div class="mut sm">選一個釣場傳送過去。</div>`+Object.entries(FW).map(([k,w])=>`<button class="opt" data-w="${k}"><b>${w.n} <span class="mut sm">${tripOf(k)[1]} ${fmt$(tripOf(k)[0])}</span></b><span class="mut">${w.d}</span></button>`).join(''),c=>c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{goFish(b.dataset.w);$('#sheet').classList.remove('open');}));}
function goFish(k){if(!curW())RET={x:player.x,y:player.y,z:player.z,yaw:player.yaw};endFish();const w=FW[k];Object.assign(player,{x:w.stand[0],y:0,z:w.stand[2],yaw:w.yaw,pitch:-.18});toast(`${w.n}・天氣：${wxNow(k)}`,2200);}
function goHome(){endFish();const r=RET||{x:0,y:0,z:38.5,yaw:0};Object.assign(player,{x:r.x,y:r.y,z:r.z,yaw:r.yaw,pitch:0});RET=null;toast('🏠 回到生態館',1800);}
function endFish(msg){if(msg)toast(msg,2000);FS=null;fBob.visible=rod.visible=fline.visible=showM.visible=false;FU.style.display='none';ring.position.y=-100;}

/* 1. 選餌＋蓄力甩竿 */
function openCast(){const k=curW();if(!k)return;if(FS&&!['done','idle'].includes(FS.st))return;S.fbait=S.fbait||'none';if(baitCnt(S.fbait)<=0)S.fbait='none';
 FS={st:'idle',w:k,p:V(player.x,FW[k].wy,player.z)};rod.visible=true;showM.visible=fBob.visible=fline.visible=false;FU.style.display='block';$('#fBar').style.display='none';$('#fPow').style.display='block';$('#fPowF').style.width='0';
 rodM.color.set([0x2a2a2a,0x1f5ab8,0xc8302a,0xd8a830][((S.fg&&S.fg.rod)||1)-1]);
 const bt=$('#fBaits');bt.innerHTML=Object.entries(BAIT).map(([b,d])=>{const n=baitCnt(b);return`<button class="chip ${S.fbait===b?'on':''} ${n<=0?'dis':''}" data-b="${b}" style="font-size:12px;padding:4px 8px">${d.ic}${d.n}${n===Infinity?'':' '+n}</button>`;}).join('');
 bt.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{if(baitCnt(x.dataset.b)<=0){toast('這種餌沒有了，去「🛒 釣具」或培養室補貨');return;}S.fbait=x.dataset.b;markDirty();openCast();});
 fT(FW[k].hole?'🧊 對準冰洞，按住蓄力後放開':'🎣 按住蓄力，放開甩竿');fSub(`天氣：${wxNow(k)}${k==='sea'?'・海域：'+SEAZ[S.seaZ||'near'].n:''}・黃色區域是完美甩竿`);
 const b=$('#fB');b.innerHTML='';const x=document.createElement('button');x.className='btn feed';x.textContent='按住蓄力';x.style.cssText='flex:1;padding:16px 0;font-size:18px;touch-action:none';
 const go=e=>{e.preventDefault();if(FS&&FS.st==='charge')release();};x.addEventListener('pointerdown',e=>{e.preventDefault();if(!FS||FS.st!=='idle')return;FS.st='charge';FS.pw=0;FS.pd=1;x.textContent='放開甩竿！';try{x.setPointerCapture(e.pointerId);}catch(_){}});
 x.addEventListener('pointerup',go);x.addEventListener('pointercancel',go);b.appendChild(x);const c=document.createElement('button');c.className='btn';c.textContent='收起';c.onclick=()=>endFish();b.appendChild(c);}
function release(){const k=FS.w,w=FW[k],p=FS.pw,perfect=p>.82&&p<.95;const bait=S.fbait||'none';if(bait!=='none'&&baitCnt(bait)>0)useBait(bait);
 const f=V(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),r=V(-f.z,0,f.x);let tg;if(w.hole)tg=V(w.hole.x,w.wy+.02,w.hole.z);else{const d=lerp(w.dist[0],w.dist[1],p);tg=V(player.x,w.wy,player.z).addScaledVector(f,d).addScaledVector(r,rnd(-1,1)*(perfect?.3:1.2));}
 if(p<.12&&!w.hole){FS.st='idle';toast('力道太小，沒甩出去');openCast();return;}
 const from=rodTipW();FS={st:'fly',w:k,from,p:tg,ft:0,dur:.45+p*.5,arc:1+p*3,perfect,bait,pw:p};$('#fPow').style.display='none';$('#fBaits').innerHTML='';fBob.visible=fline.visible=true;
 fT(perfect?'✨ 完美甩竿！':'🎣 甩出去了');fSub('');fBtns([['收竿',()=>endFish('收竿了')]]);}
function startWait(){const k=FS.w,w=wxNow(k);const bm=BAIT[FS.bait]||{};let t=rnd(.8,2.4)*fgv('sonar')*(FS.bait==='none'?1.6:1)*(w==='雨'?.8:w==='陰'?.9:1);
 FS.st='wait';FS.t=t;FS.k=pickCatch(k,FS.bait,FS.perfect);ring.position.set(FS.p.x,FS.p.y+.01,FS.p.z);ring.scale.setScalar(1);ring.material.opacity=.8;fT('🎣 等待上鉤…');fSub(`餌：${BAIT[FS.bait].ic}${BAIT[FS.bait].n}・天氣：${w}`);}
function pickCatch(k,bait,perfect){const w=wxNow(k),b=BAIT[bait]||{};let bc=.03*(w==='雨'?2:w==='霧'?2.5:1)*(bait==='lure'?1.5:1)*(perfect?1.3:1);if(FW[k].boss&&!(S.bossLog&&S.bossLog[FW[k].boss]&&Math.random()<.5)&&Math.random()<bc)return FW[k].boss;
 const t2=tabOf(k).map(([s,wt])=>{let m=1;const tg=TAG[s];if(b.tag&&tg&&b.tag[tg])m*=b.tag[tg];if(wt<=5&&s!=='junk')m*=(b.rare||1)*(w==='雨'?1.4:1)*(perfect?1.3:1);if(s==='junk'&&bait==='none')m*=1.5;return[s,wt*m];});
 let s=t2.reduce((a,x)=>a+x[1],0)*Math.random();for(const [x,wt] of t2){s-=wt;if(s<=0)return x;}return t2[0][0];}
/* 2. 上鉤與拉竿（Boss 有專屬模式） */
const setZone=()=>{$('#fZone').style.left=((FS.zc-FS.zw/2)*100)+'%';$('#fZone').style.width=(FS.zw*100)+'%';};
function hook(){if(!FS||FS.st!=='bite')return;const boss=!!BOSS[FS.k];const tw=(tabOf(FS.w).find(x=>x[0]===FS.k)||[0,10])[1],rr=boss?4:FS.k==='junk'||FS.k==='coin'?0:tw>=12?0:tw>=6?1:tw>=3?2:3;
 FS={...FS,st:'reel',rr,boss,need:boss?5:3,pos:0,dir:1,hits:0,miss:0,zw:[.3,.25,.2,.16,.16][rr]*fgv('rod'),zc:rnd(.3,.7),v:[.85,1.1,1.35,1.65,1.4][rr]*fgv('reel'),flip:rnd(.4,1)};
 $('#fBar').style.display='block';setZone();fT(boss?`⚠️ BOSS 上鉤：${BOSS[FS.k].n}！`:'🐟 中魚了！白線進到綠區時按「拉」');fSub(`${['常見','少見','稀有','傳說','BOSS'][rr]}・拉中 ${FS.need} 次、失誤 ${fgv('line')+(boss?1:0)} 次線會斷${boss?'・牠會亂竄，綠區也會移動':''}`);fBtns([['拉！',reelTap,'feed',1]]);vib(boss?[80,60,80]:60);}
function reelTap(){if(!FS||FS.st!=='reel')return;const lim=fgv('line')+(FS.boss?1:0);if(Math.abs(FS.pos-FS.zc)<=FS.zw/2+.02){FS.hits++;vib(30);if(!FS.boss){FS.zc=rnd(.2,.8);FS.zw*=.94;}setZone();if(FS.hits>=FS.need){landFish();return;}}
 else{FS.miss++;vib(120);if(FS.miss>=lim){FS.st='done';fBob.visible=fline.visible=false;$('#fBar').style.display='none';fT(FS.boss?`💥 ${BOSS[FS.k].n} 掙斷了釣線！`:'😢 線斷了，魚跑掉了');fSub(FS.boss?'Boss 很強，升級釣竿、捲線器或釣線再挑戰':'');fBtns([['再甩一次',openCast,'feed'],['休息',()=>endFish()]]);return;}}
 fSub(`拉中 ${FS.hits}/${FS.need}・失誤 ${FS.miss}/${lim}`);}
/* 3. 釣上來：3D 展示 */
function landFish(){const k=FS.k;fBob.visible=false;$('#fBar').style.display='none';FS.st='done';const again=[['再甩一次',openCast,'feed'],['休息',()=>endFish()]];
 if(k==='junk'){fline.visible=false;fT('🥾 釣到了'+['舊雨鞋','空鋁罐','纏住的釣線','一塊漂流木','破掉的水桶'][Math.random()*5|0]);fSub('順手撿起來丟掉，環境變乾淨了');fBtns(again);return;}
 if(k==='coin'){fline.visible=false;const v=Math.round(rnd(200,800));earn(v);fT('💰 釣到一個錢袋！');fSub(`裡面有 ${fmt$(v)}`);fBtns(again);return;}
 const boss=BOSS[k];const g=boss?{sz:1,m:'n'}:{sz:+rnd(.75,1.6).toFixed(3),m:Math.random()<({none:.03,lure:.14}[FS.bait]||.06)?COLM[Math.random()*COLM.length|0]:'n'},sex=Math.random()<.5?'♀':'♂';
 const len=boss?boss.len*rnd(.9,1.15):(SP[k].len||.2)*g.sz,cm=Math.round(len*100);const key=boss?'boss:'+k:k;S.fishLog=S.fishLog||{};const best=S.fishLog[key]||0,rec=cm>best;if(rec)S.fishLog[key]=cm;
 const d=dispGeo(k);showM.geometry=d.g;const dl=clamp(len,.22,1.5);const sc=dl/d.len;FS.show={sc,dl,t0:0,boss:!!boss};showM.scale.setScalar(sc);showM.material.color.setRGB(1,1,1);showM.material.emissive=new THREE.Color(0);
 const tint=boss&&boss.tint||(g.m!=='n'&&MORPH[g.m].tint);if(tint)showM.material.color.setRGB(...tint);if(g.m!=='n'&&MORPH[g.m].em)showM.material.emissive.setRGB(...MORPH[g.m].em);showM.visible=true;markDirty();
 const nm=boss?boss.n:SP[k].n.replace(/（群）/,''),val=fishVal(k,g),mf=Math.round(mktF(k)*100);FS.catch={k,g,sex,nm,cm,val,rec};
 fT(boss?`🏆 釣到 BOSS：${nm}！`:`🎉 ${g.m!=='n'?MORPH[g.m].pre+' ':''}${nm}`);fSub(`${boss?'':sex+'・'}全長 ${cm} cm${rec?'・🏆 新紀錄！':`（紀錄 ${best} cm）`}${!boss&&gTag({g})?'・'+gTag({g}):''}・行情 ${mf}%`);
 if(boss){S.bossLog=S.bossLog||{};S.bossLog[k]=(S.bossLog[k]||0)+1;fBtns([[`賣 ${fmt$(val)}`,()=>{earn(val);mktHit(k);toast(`💰 獲得 ${fmt$(val)}`);openCast();},'feed'],['做成標本',()=>{S.trophy=S.trophy||[];S.trophy.push({k,cm,t:Date.now()});markDirty();toast(`🏆 ${nm} 標本收進收藏（${S.trophy.length} 件）`,2600);openCast();}]]);return;}
 fBtns([['帶回倉庫',()=>{S.wh.push({sp:k,g,sex,name:`${g.m!=='n'?MORPH[g.m].pre+' ':''}野生${nm}`});markDirty();toast(`📦 ${nm} 送回倉庫了`,2200);openCast();},'feed'],[`賣 ${fmt$(val)}`,()=>{earn(val);mktHit(k);toast(`💰 獲得 ${fmt$(val)}`);openCast();}],['放生',()=>{toast('🌊 放生了');openCast();}]]);}

/* ---------- 籠捕、撈網、開船 ---------- */
const TRAPT={stream:['goby','hemi','opsari'],lake:['loach','guppy','goldfish'],mangrove:['mudskipper','goby','archer'],pier:['puffer','mullet']};
const trapMesh=new THREE.Group();add(new THREE.CylinderGeometry(.25,.25,.4,10,1,true),new THREE.MeshStandardMaterial({color:C(0x8a7a5a),wireframe:true}),0,-.2,0,trapMesh);add(new THREE.SphereGeometry(.09,10,8),new THREE.MeshStandardMaterial({color:C(0xf2a020)}),0,.05,0,trapMesh);trapMesh.visible=false;scene.add(trapMesh);
const trapGlow=glow(0,-100,0,.8,0xffe080,.8);
function trapPos(k){const w=FW[k],f=V(-Math.sin(w.yaw),0,-Math.cos(w.yaw)),r=V(-f.z,0,f.x);return V(w.stand[0],w.wy,w.stand[2]).addScaledVector(f,3).addScaledVector(r,2);}
function trapAct(){const k=curW();S.traps=S.traps||{};const tr=S.traps[k];if(!tr){if(baitCnt('worm')<=0&&baitCnt('shrimp')<=0){toast('放籠子需要 1 條蚯蚓或 1 隻蝦當誘餌',2600);return;}useBait(baitCnt('worm')>0?'worm':'shrimp');S.traps[k]={t:Date.now()};markDirty();toast('🪤 籠子放下去了，約 3 分鐘後來收',2400);moreSheet();return;}
 if(Date.now()-tr.t<180e3){toast(`🪤 還要 ${Math.ceil((180e3-(Date.now()-tr.t))/1000)} 秒`);return;}delete S.traps[k];const got=[];const n=2+(Math.random()*3|0);
 for(let i=0;i<n;i++){if(Math.random()<.55){const b=Math.random()<.5?'brine':'worm',q=2+(Math.random()*4|0);if(b==='brine')S.stock.brine=Math.min(capOf('brine'),S.stock.brine+q);else S.fg.worm=(S.fg.worm||0)+q;got.push(b==='brine'?`🦐蝦×${q}`:`🪱蚯蚓×${q}`);}
  else{const sp=TRAPT[k][Math.random()*TRAPT[k].length|0];S.wh.push({sp,g:{sz:+rnd(.7,1.2).toFixed(3),m:'n'},sex:Math.random()<.5?'♀':'♂',name:'野生'+SP[sp].n});got.push(`📦${SP[sp].n}`);}}
 markDirty();toast('🪤 收籠：'+got.join('、'),3800);moreSheet();}
function netAct(){S.netT=S.netT||0;if(Date.now()-S.netT<20e3){toast(`🥅 水裡的蝦還沒回來，${Math.ceil((20e3-(Date.now()-S.netT))/1000)} 秒後再撈`);return;}S.netT=Date.now();
 const a=1+(Math.random()*3|0),b=Math.random()<.5?1+(Math.random()*2|0):0;S.stock.brine=Math.min(capOf('brine'),S.stock.brine+a);S.fg.worm=(S.fg.worm||0)+b;markDirty();toast(`🥅 撈到 🦐蝦×${a}${b?`、🪱蚯蚓×${b}`:''}`,2400);}
let sail=0;function sailTo(z){if(S.seaZ===z){toast('已經在這個海域了');return;}endFish();$('#sheet').classList.remove('open');sail=4;toast(`🧭 開往${SEAZ[z].n}…`,3000);setTimeout(()=>{S.seaZ=z;markDirty();
 if(seaMesh)seaMesh.material.color.copy(C(SEAZ[z].col));ISL.visible=z==='near';FW.sea.coral.visible=z==='reef';toast(`⚓ 到達${SEAZ[z].n}`,2000);},4000);}
function moreSheet(){const k=curW();if(!k)return;const w=FW[k];S.traps=S.traps||{};const tr=S.traps[k],left=tr?Math.max(0,Math.ceil((180e3-(Date.now()-tr.t))/1000)):0;const rows=[];
 if(k==='sea')rows.push(`<h4>🧭 開船換海域（目前：${SEAZ[S.seaZ||'near'].n}）</h4><div style="display:flex;gap:6px">${Object.entries(SEAZ).map(([z,s])=>`<button class="chip ${(S.seaZ||'near')===z?'on':''}" data-z="${z}">${s.n}</button>`).join('')}</div><div class="mut sm">深海有鯊魚和大石斑；珊瑚礁有小丑魚、倒吊、七彩麒麟。</div>`);
 if(w.trap)rows.push(`<button class="opt" id="mTrap"><b>🪤 ${tr?(left?'籠子放著（'+left+' 秒）':'收籠子！'):'放籠子'}</b><span class="mut">用 1 條蚯蚓或 1 隻蝦當誘餌，3 分鐘後收：小魚帶回倉庫，或蝦、蚯蚓當餌</span></button>`);
 if(w.net)rows.push(`<button class="opt" id="mNet"><b>🥅 撈網</b><span class="mut">在淺水撈蝦和蚯蚓，可以當餌料（20 秒一次）</span></button>`);
 rows.push(`<button class="opt" id="mGear"><b>🛒 釣具店</b><span class="mut">升級釣竿、捲線器、釣線、魚探；買蚯蚓和擬餌</span></button><button class="opt" id="mLog"><b>📖 釣魚紀錄・行情</b><span class="mut">最大尺寸、Boss、目前魚市價格</span></button><button class="opt" id="mMenu"><b>🗺 換釣場</b><span class="mut">去其他釣場</span></button>`);
 sheet(`${w.n}・${wxNow(k)}`,rows.join(''),c=>{c.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>sailTo(b.dataset.z));const q=s=>c.querySelector(s);if(q('#mTrap'))q('#mTrap').onclick=trapAct;if(q('#mNet'))q('#mNet').onclick=netAct;q('#mGear').onclick=()=>gearSheet();q('#mLog').onclick=fishLogSheet;q('#mMenu').onclick=fishMenu;});}
function fishLogSheet(){S.fishLog=S.fishLog||{};S.bossLog=S.bossLog||{};const mk=k=>{const f=Math.round(mktF(k)*100);return f<100?` <span style="color:${f<60?'#ff8a6a':'#f2c94c'}">行情 ${f}%</span>`:'';};
 sheet('📖 釣魚紀錄',`<div class="mut sm">同一種魚一次賣太多，魚市價格會下跌（最低 30%），每分鐘回升 6%。換著釣不同的魚最賺。</div>`+Object.entries(FW).map(([wk,w])=>{const tab=wk==='sea'?[...new Set(Object.values(SEAZ).flatMap(z=>z.tab.map(x=>x[0])))]:w.tab.map(x=>x[0]);
  return`<h4>${w.n}</h4>`+tab.filter(k=>SP[k]).map(k=>`<div class="row2"><span>${SP[k].n}${mk(k)}</span><span class="mut">${S.fishLog[k]?S.fishLog[k]+' cm':'—'}</span></div>`).join('')+(w.boss?`<div class="row2"><span>👑 ${BOSS[w.boss].n}${mk(w.boss)}</span><span class="mut">${S.bossLog[w.boss]?'已釣到 '+S.bossLog[w.boss]+' 次・'+S.fishLog['boss:'+w.boss]+' cm':'未釣到'}</span></div>`:'');}).join('')+
  ((S.trophy||[]).length?`<h4>🏆 標本收藏</h4>`+S.trophy.map(t=>`<div class="row2"><span>${BOSS[t.k].n}</span><span class="mut">${t.cm} cm</span></div>`).join(''):''));}
/* 釣具店：加賣蚯蚓 */
const _gs0=gearSheet;gearSheet=function(){_gs0();const c=$('#shC'),d=document.createElement('div');d.innerHTML=`<div class="res"><div><b>🪱 蚯蚓</b> <span class="mut">有 ${S.fg.worm||0} 條</span></div><div class="mut sm">鰕虎、三間鼠、公魚、彈塗魚最愛；也可以放籠子</div><button class="btn sm" id="gWorm">20 條 $100</button></div>`;c.appendChild(d);
 d.querySelector('#gWorm').onclick=()=>{if(!pay(100,'蚯蚓'))return;S.fg.worm=(S.fg.worm||0)+20;markDirty();toast('🪱 買了 20 條蚯蚓');gearSheet();};};

/* ---------- 每幀更新 ---------- */
let envK=null;
globalAnims.push((t,dt)=>{WX.t-=dt;if(WX.t<=0){WX.k=WXL[Math.random()*WXL.length|0];WX.t=rnd(120,240);if(curW())toast(`🌦 天氣變成「${wxNow(curW())}」`,2000);envK=undefined;}
 const k=curW();if(k!==envK){envK=k;applyEnv(k);}if(!k&&FWK){FWK=null;endFish();}if(k)FWK=k;
 if(k==='sea'){const moving=!FS||FS.st==='idle'||FS.st==='done';const tgt=sail>0?14:moving?3.5:0;seaSpd=lerp(seaSpd,tgt,dt*.8);if(sail>0)sail-=dt;seaOff+=seaSpd*dt;
  const p=seaGeo.attributes.position,c=FW.sea.C;for(let i=0;i<p.count;i++)p.setY(i,waveY(seaBase[i*3]+c.x,seaBase[i*3+2]+c.z,t));p.needsUpdate=true;seaGeo.computeVertexNormals();
  BOAT.rotation.z=Math.sin(t*.8)*.02;BOAT.rotation.x=Math.sin(t*.6)*.012+seaSpd*.002;BOAT.userData.flag.rotation.y=Math.sin(t*6)*.3;BOAT.userData.rad.rotation.y+=dt*2;WAKE.offset.y-=dt*seaSpd*.08;
  for(const m of ISL.children){m.position.z=((m.userData.z0+seaOff+400)%800+800)%800-400;}}
 if(k==='pier'&&FW.pier.light)FW.pier.light.intensity=1.3+Math.sin(t*3)*.05;
 if(rainP.visible){const p=rainP.geometry.attributes.position.array;for(let i=0;i<p.length/6;i++){let y=p[i*6+1]-dt*18;if(y<0)y+=20;p[i*6]=p[i*6]||0;p[i*6+1]=y;p[i*6+3]=p[i*6];p[i*6+4]=y+.5;p[i*6+5]=p[i*6+2];}rainP.geometry.attributes.position.needsUpdate=true;rainP.position.set(player.x,0,player.z);}
 if(snowP.visible){const q=snowP.geometry.attributes.position.array;for(let i=0;i<q.length/3;i++){q[i*3+1]-=dt*1.2;q[i*3]+=Math.sin(t+i)*dt*.2;if(q[i*3+1]<0)q[i*3+1]+=12;}snowP.geometry.attributes.position.needsUpdate=true;snowP.position.set(player.x,0,player.z);}
 S.traps=S.traps||{};if(k&&FW[k].trap&&S.traps[k]){const tp=trapPos(k);trapMesh.visible=true;trapMesh.position.set(tp.x,tp.y+Math.sin(t*1.5)*.03,tp.z);const ready=Date.now()-S.traps[k].t>=180e3;trapGlow.position.set(tp.x,ready?tp.y+.5:-100,tp.z);}else{trapMesh.visible=false;trapGlow.position.y=-100;}
 if(ring.material.opacity>0){ring.scale.multiplyScalar(1+dt*2.2);ring.material.opacity=Math.max(0,ring.material.opacity-dt*.7);}
 if(rod.visible){const f=V(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),r=V(Math.cos(player.yaw),0,-Math.sin(player.yaw));rod.position.set(player.x+f.x*.35+r.x*.28,player.y+1.05,player.z+f.z*.35+r.z*.28);
  let tilt=.95;if(FS&&FS.st==='charge')tilt=-.4-FS.pw*.8;else if(FS&&FS.st==='fly')tilt=lerp(-1.2,.9,Math.min(1,FS.ft/FS.dur*2.2));else if(FS&&FS.st==='reel')tilt=.55+Math.sin(t*20)*.04;else if(FS&&FS.st==='done'&&showM.visible)tilt=-.2;
  rod.rotation.set(0,player.yaw,0);rod.rotateX(-tilt);const bd=rodBend(t);for(const s of RSEG)s.rotation.x=-bd;rod.updateMatrixWorld();}
 if(!FS)return;const tip=rodTipW();const by=FS.p.y+(FS.w==='sea'?waveY(FS.p.x,FS.p.z,t):0);
 if(FS.st==='charge'){FS.pw+=dt*1.25*FS.pd;if(FS.pw>1){FS.pw=1;FS.pd=-1;}if(FS.pw<0){FS.pw=0;FS.pd=1;}$('#fPowF').style.width=(FS.pw*100)+'%';}
 else if(FS.st==='fly'){FS.ft+=dt;const u=Math.min(1,FS.ft/FS.dur);fBob.position.lerpVectors(FS.from,FS.p,u);fBob.position.y+=Math.sin(u*Math.PI)*FS.arc;if(u>=1){fBob.position.y=by;startWait();}}
 else if(FS.st==='wait'){FS.t-=dt;fBob.position.set(FS.p.x,by+Math.sin(t*2)*.012,FS.p.z);if(FS.t<=0){FS.st='bite';FS.bt=fgv('win');fT('❗ 上鉤了！快按「拉」');fSub('');fBtns([['拉！',hook,'feed',1]]);vib(150);ring.position.set(FS.p.x,by+.01,FS.p.z);ring.scale.setScalar(1);ring.material.opacity=.9;}}
 else if(FS.st==='bite'){FS.bt-=dt;fBob.position.y=by-Math.abs(Math.sin(t*14))*.06;if(FS.bt<=0){FS.st='done';fBob.visible=fline.visible=false;fT('魚跑掉了…');fSub('浮標往下沉時要快點按');fBtns([['再甩一次',openCast,'feed'],['休息',()=>endFish()]]);}}
 else if(FS.st==='reel'){reelPat(dt,t);FS.pos+=FS.v*dt*FS.dir*(FS.burst>0?2.2:1);if(FS.boss){FS.flip-=dt;if(FS.flip<=0){FS.dir*=-1;FS.flip=rnd(.25,.9);FS.v=[1.4][0]*fgv('reel')*rnd(.8,1.4);}FS.zc=clamp(FS.zc+Math.sin(t*1.3)*dt*.18,FS.zw/2,1-FS.zw/2);setZone();}
  if(FS.pos>1){FS.pos=1;FS.dir=-1;}if(FS.pos<0){FS.pos=0;FS.dir=1;}$('#fMk').style.left=(FS.pos*100)+'%';fBob.position.set(FS.p.x+Math.sin(t*5)*.15,by-.04+Math.sin(t*9)*.02,FS.p.z);}
 else if(FS.st==='done'&&showM.visible){const s=FS.show;s.t0+=dt;const f=V(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),dist=.9+s.dl*.8;const cp=V(player.x,player.y+1.6,player.z).addScaledVector(f,dist);cp.y-=.12;
  showM.position.lerp(cp,Math.min(1,dt*6));showM.rotation.set(0,player.yaw,0);showM.rotateX(-Math.PI/2*0);showM.rotateZ(Math.PI/2+Math.sin(s.t0*9)*.35*Math.exp(-s.t0*.5));
  const nose=V(0,0,0);nose.copy(showM.position).addScaledVector(V(0,1,0),s.dl*.5);lineG.setFromPoints([tip,nose,nose]);fline.visible=true;return;}
 lineG.setFromPoints([tip,V((tip.x+fBob.position.x)/2,Math.min(tip.y,fBob.position.y)-.3,(tip.z+fBob.position.z)/2),fBob.position]);});
const _b8=bar;bar=function(){_b8();const k=curW();if(!k)return;const w=FW[k];near=null;lastNear=null;$('#bar').style.display='block';$('#bT').textContent=w.n+(k==='sea'?'・'+SEAZ[S.seaZ||'near'].n:'');
 $('#bD').textContent=`天氣 ${wxNow(k)}・餌 ${BAIT[S.fbait||'none'].ic}${BAIT[S.fbait||'none'].n}${S.traps&&S.traps[k]?'・🪤籠子放著':''}`;
 if(lastBtns!=='fw'+k){lastBtns='fw'+k;const bb=$('#bB');bb.innerHTML='';for(const [t,f,c] of[['🎣 甩竿',openCast,'feed'],['🧰 更多',moreSheet,''],['🏠 回館',goHome,'']]){const x=document.createElement('button');x.className='btn '+c;x.textContent=t;x.onclick=f;bb.appendChild(x);}}};

