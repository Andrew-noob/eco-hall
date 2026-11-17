/* ===== k.js：蜥蜴外觀依參考圖修正、新魚種、生態農園（蔬菜田＋多肉溫室） ===== */

/* ---------- 睫角守宮：灰褐體色、乳白冠棘、側腹白點 ---------- */
Object.assign(SPEC.crested,{eyeC:0x5a4a32,legC:0x9a8c82,
 col:(c,t,a,x)=>{const ca=Math.cos(a),sa=Math.abs(Math.sin(a));c.set(0x8c857d);if(ca<-.45)c.set(0xb4ab9e);if(t<.09&&ca<.2)c.set(0xd2c8b8);if(t>.46)c.set(0x94806e);
  if(t>.16&&t<.46&&sa>.55&&ca>-.4&&ca<.5&&Math.sin(x*900)*Math.sin(a*14)>.55)c.set(0xf0e4cc);if(ca>.9&&t>.14&&t<.47)c.set(0xa29a8e);c.convertSRGBToLinear();},
 extra:(gs,prof,L,by)=>{const sc=C(0xf0e0c0),pts=[];for(let t=.02;t<.13;t+=.008)for(const s of[1,-1]){const p=surf(L,prof,t,s*.85,by);pts.push([p,V(0,1,s*.7)]);}
  for(let t=.13;t<.47;t+=.011)for(const s of[1,-1]){const p=surf(L,prof,t,s*.5,by);pts.push([p,V(0,1,s*.35)]);}
  for(let t=.18;t<.44;t+=.03)for(const s of[1,-1]){const p=surf(L,prof,t,s*1.25,by);pts.push([p,V(0,.3,s)]);}
  gs.push(...spikeRow(pts,.0038,sc,.45));}});
/* 鬆獅蜥：橄欖褐背、灰色側腹棘緣、白喉、環紋尾 */
Object.assign(SPEC.beardie,{legC:0x8e6c48,eyeC:0x2a1a0a,
 col:(c,t,a,x)=>{const ca=Math.cos(a),sa=Math.abs(Math.sin(a));c.set(0xa49a68);if(t<.15)c.set(0xb2a672);if(ca>.88&&t>.15&&t<.5)c.set(0xc8b888);
  if(t>.18&&t<.5&&sa>.6&&ca<.45&&ca>-.4)c.set(Math.sin(x*400)>.2?0x6e6e66:0x5e5e58);if(ca<-.4)c.set(0xe6e0d0);if(t>.06&&t<.15&&ca<-.1)c.set(0xeae6da);
  if(t>.5){const b=Math.floor((t-.5)*34)%2;c.set(ca<-.4?0xd8ccb0:(b?0xb8a27a:0x5a4632));}if(t>.08&&t<.11&&sa>.7&&ca>0)c.set(0x5a5040);c.convertSRGBToLinear();}});

/* ---------- 新魚種 ---------- */
Object.assign(SP,{
 betta:{n:'泰國鬥魚',s:'Betta splendens',z:'全長 6 cm（含鰭）',f:'雄魚有華麗的長鰭，會吐泡泡築巢；兩隻雄魚放一起會打架。',hab:'fresh',cost:1,hr:.06,tr:[24,30]},
 goldfish:{n:'琉金',s:'Carassius auratus',z:'全長 12 cm',f:'圓滾滾的身體配上飄逸的雙尾，是改良了上千年的觀賞魚。',hab:'fresh',cost:2,hr:.07,tr:[16,26]},
 loach:{n:'三間鼠',s:'Chromobotia macracanthus',z:'全長 15 cm',f:'橘黃色身體有三條黑帶，喜歡躲在石縫裡，休息時會側躺。',hab:'fresh',cost:2,hr:.06,tr:[25,30],min:'M'},
 mandarin:{n:'七彩麒麟',s:'Synchiropus splendidus',z:'全長 6 cm',f:'全身是迷幻的藍橘花紋，是少數真正有藍色色素的動物之一。',hab:'reef',cost:1,hr:.05,tr:[24,27]},
 lion:{n:'魔鬼簑鮋',s:'Pterois volitans',z:'全長 30 cm',f:'華麗的鰭棘有毒；在大西洋是破壞生態的入侵種。',hab:'reef',cost:4,hr:.05,tr:[23,28],min:'L'},
 puffer:{n:'六斑刺魨',s:'Diodon holocanthus',z:'全長 25 cm',f:'受到威脅時會吸水把身體撐成刺球。',hab:'reef',cost:4,hr:.05,tr:[23,28],min:'L'},
 oscar:{n:'地圖魚',s:'Astronotus ocellatus',z:'全長 30 cm',f:'很聰明、會認主人，尾柄上的橘色眼斑可以騙過掠食者。',hab:'river',cost:3,hr:.05,tr:[24,30]}});
Object.assign(PRICE,{betta:150,goldfish:200,loach:250,mandarin:600,lion:1200,puffer:900,oscar:800});
Object.assign(BR,{betta:{m:'spawn',n:[2,3],p:.15},goldfish:{m:'spawn',n:[2,3],p:.12},oscar:{m:'spawn',n:[2,3],p:.06}});
for(const [k,l] of[['betta',.06],['goldfish',.12],['loach',.15],['mandarin',.06],['lion',.3],['puffer',.25],['oscar',.3]])SP[k].len=l;
const hsl=(h,s,l)=>new THREE.Color().setHSL(h,s,l).convertSRGBToLinear();
function gBetta(){const L=.05,h=[0,.62,.75,.95][Math.random()*4|0],b=hsl(h,.75,.32),f=hsl(h,.85,.48),e=hsl(h,.7,.65);
 return merge([loft(L,fusi(.009,.005,.35,.3,.6),c=>c.copy(b),20,10),fin([[-.02,0,0],[-.024,.01,0],[-.045,.032,0],[-.068,.034,0],[-.08,.012,0],[-.082,-.012,0],[-.068,-.034,0],[-.045,-.032,0],[-.024,-.01,0]],[f,f,e,e,e,e,e,f,f]),
  fin([[.002,.008,0],[-.012,.024,0],[-.032,.03,0],[-.028,.006,0]],[f,e,e,f]),fin([[.006,-.007,0],[-.006,-.03,0],[-.034,-.036,0],[-.03,-.006,0]],[f,e,e,f]),...pecs(.012,.008,.002,-.004,.004,.012,.008,[f]),...eyes(.018,.002,.0045,.0018,C(0x111111))]);}
function gGoldfish(){const L=.08,o=C(0xff7a1a),w=C(0xf6f0e6),f=C(0xffa060);
 const g=[loft(L,fusi(.032,.02,.42,.22,.55),(c,t,a,x,y,z)=>c.copy(Math.sin(x*90+y*70)+Math.sin(z*120)>1.1?w:o),26,12),fin([[.01,.03,0],[-.01,.058,0],[-.03,.05,0],[-.035,.022,0]],[o,f,f,o])];
 for(const s of[1,-1])g.push(fin([[-.035,0,s*.002],[-.04,.012,s*.004],[-.07,.04,s*.02],[-.095,.02,s*.03],[-.085,-.005,s*.03],[-.095,-.028,s*.028],[-.065,-.034,s*.018],[-.04,-.01,s*.004]],[o,f,f,f,f,f,f,o]));
 return merge([...g,...pecs(.02,.012,.0,-.015,.016,.02,.01,[f]),...eyes(.03,.008,.012,.004,C(0x1a1a1a))]);}
function gLoach(){const L=.13,y=C(0xf2a020),k=C(0x141414),r=C(0xd8301a);const band=t=>(t>.13&&t<.2)||(t>.38&&t<.5)||(t>.7&&t<.8);
 return merge([loft(L,fusi(.018,.012,.35,.3,.55),(c,t,a)=>c.copy(band(t)?k:Math.cos(a)<-.5?C(0xf0d090):y),32,12),fin([[.0,.016,0],[-.02,.03,0],[-.035,.014,0]],[r,k,r]),fin([[-.02,-.012,0],[-.032,-.026,0],[-.042,-.01,0]],[r]),
  caudal(-.062,.006,.03,.022,.6,[r,r,r,r,r,r]),...pecs(.035,.025,.015,-.012,.008,.016,.008,[r]),...eyes(.05,.004,.008,.0028,C(0x1a1a1a))]);}
function gMandarin(){const L=.055,bl=C(0x2a8ad8),o=C(0xf08a1a),gr=C(0x2ac0a0);
 return merge([loft(L,fusi(.011,.01,.35,.35,.6),(c,t,a,x,y,z)=>{c.copy(bl);if(Math.sin(x*700+Math.sin(y*500+z*400)*3)>.45)c.copy(o);if(Math.cos(a)<-.6)c.copy(gr);},26,12),
  fin([[.004,.009,0],[-.004,.03,0],[-.01,.01,0]],[o,bl,o]),fin([[-.008,.01,0],[-.025,.022,0],[-.034,.006,0]],[bl,o,bl]),caudal(-.028,.004,.02,.014,1,[bl,o,bl,o,bl,o]),
  ...pecs(.012,.006,-.006,-.004,.008,.014,.004,[o,bl,o]),...eyes(.018,.004,.006,.0024,C(0x1a1a1a))]);}
function gLion(){const L=.24,r=C(0xb8381a),w=C(0xf2e6da),g=[];
 g.push(loft(L,fusi(.055,.026,.38,.3,.62),(c,t,a,x)=>c.copy(Math.sin(x*130)>.1?r:w),34,14));
 for(let i=0;i<13;i++){const x=.07-i*.012,a=V(x,.045-Math.abs(i-4)*.002,0),b=V(x-.02,.13-Math.abs(i-3)*.004,0);g.push(prim(cylBetween(a,b,.0022,.0007,4),i%2?r:w));}
 for(const s of[1,-1]){const base=V(.03,-.015,s*.025),pts=[[base.x,base.y,base.z]];for(let k=0;k<=8;k++){const an=-.4-k*.25;pts.push([base.x+Math.cos(an)*.13,base.y+Math.sin(an)*.05,base.z+s*(.03+k*.012)]);}
  g.push(colorize(fin(pts,[r]),(c,x,y,z)=>c.copy(Math.sin(Math.hypot(x-base.x,z-base.z)*160)>0?r:w)));}
 g.push(caudal(-.13,.012,.05,.04,1,[w,r,w,r,w,r]),...eyes(.085,.016,.02,.006,C(0x8a1a10)));for(const s of[1,-1])g.push(prim(cylBetween(V(.08,.025,s*.018),V(.075,.05,s*.026),.003,.001,4),w));return merge(g);}
function gPuffer(){const L=.22,y=C(0xc8b07a),w=C(0xf2ede0),k=C(0x2a2018),g=[];
 g.push(loft(L,fusi(.07,.065,.45,.25,.7),(c,t,a,x,yy,z)=>{c.copy(Math.cos(a)<-.3?w:y);if(Math.cos(a)>-.3&&Math.sin(x*80)*Math.sin(a*5)>.7)c.copy(k);},30,16));
 for(let i=0;i<70;i++){const t=rnd(.15,.75),a=rnd(0,6.28);const p=surf(L,fusi(.07,.065,.45,.25,.7),t,a,0),n=V(0,Math.cos(a),Math.sin(a));g.push(prim(cylBetween(p,p.clone().addScaledVector(n,.018).add(V(-.008,0,0)),.002,.0004,4),C(0xe0d4b0)));}
 g.push(caudal(-.11,.01,.04,.03,1,[y]),fin([[-.06,.05,0],[-.08,.07,0],[-.09,.045,0]],[y]),fin([[-.06,-.05,0],[-.08,-.07,0],[-.09,-.045,0]],[y]),...pecs(.04,.03,.02,0,.06,.025,.01,[y]),...eyes(.07,.022,.045,.014,C(0x2a8a7a)));return merge(g);}
function gOscar(){const L=.28,d=C(0x2a2620),o=C(0xe0602a),f=C(0x1e1a16);
 return merge([loft(L,fusi(.07,.03,.4,.3,.65),(c,t,a,x,y,z)=>{c.copy(d);if(nz(x*30,y*30,z*30)>.35&&Math.cos(a)>-.5)c.copy(o);if(t>.8&&t<.88&&Math.cos(a)>0)c.copy(o);},34,14),
  fin([[.06,.06,0],[-.04,.085,0],[-.12,.06,0],[-.14,.02,0]],[f]),fin([[-.03,-.05,0],[-.1,-.07,0],[-.135,-.02,0]],[f]),caudal(-.14,.02,.06,.05,1,[f]),...pecs(.07,.05,.03,-.02,.03,.04,.02,[f]),...eyes(.1,.02,.022,.008,C(0xd84a1a))]);}
Object.assign(MAKE,{
 betta:(tk,e)=>new Agent(new THREE.Mesh(gBetta(),fishMat(tk,{amp:.004,k:90,spd:12,nose:.025,len:.05})),tk,e,{speed:.04,turn:3,reach:.05,wait:[1,4],nose:.025,eatR:.012,fill:8}),
 goldfish:(tk,e)=>new Agent(new THREE.Mesh(gGoldfish(),cache(tk,'gold',()=>fishMat(tk,{amp:.006,k:50,spd:10,nose:.04,len:.08}))),tk,e,{speed:.05,turn:2,reach:.08,wait:[0,2],nose:.04,eatR:.015,fill:8}),
 loach:(tk,e)=>new Agent(new THREE.Mesh(gLoach(),cache(tk,'loach',()=>fishMat(tk,{amp:.006,k:45,spd:14,nose:.065,len:.13}))),tk,e,{speed:.08,turn:3,reach:.08,wait:[0,2],pitchMax:.1,nose:.065,eatR:.015,fill:8}),
 mandarin:(tk,e)=>new Agent(new THREE.Mesh(gMandarin(),cache(tk,'mand',()=>fishMat(tk,{amp:.003,k:90,spd:9,nose:.028,len:.055}))),tk,e,{speed:.025,turn:3,reach:.04,wait:[1,3],nose:.028,eatR:.01,fill:8}),
 lion:(tk,e)=>new Agent(new THREE.Mesh(gLion(),cache(tk,'lion',()=>fishMat(tk,{amp:.004,k:18,spd:5,nose:.12,len:.24}))),tk,e,{speed:.04,turn:1.1,reach:.12,wait:[2,6],pitchMax:.15,nose:.12,eatR:.03,fill:6}),
 puffer:(tk,e)=>{const a=new Agent(new THREE.Mesh(gPuffer(),cache(tk,'puff',()=>fishMat(tk,{amp:.004,k:18,spd:7,nose:.11,len:.22}))),tk,e,{speed:.06,turn:1.5,reach:.12,wait:[1,3],nose:.11,eatR:.03,fill:6});
  const up=a.update.bind(a);a._inf=0;a._it=rnd(20,60);a.update=(dt,t)=>{up(dt,t);a._it-=dt;if(a._it<0){a._it=a._inf>0?rnd(30,80):4;a._on=!a._on;}a._inf=lerp(a._inf,a._on?1:0,dt*3);if(a.root){applySize(a);a.root.scale.multiplyScalar(1+.6*a._inf);}};return a;},
 oscar:(tk,e)=>new Agent(new THREE.Mesh(gOscar(),cache(tk,'osc',()=>fishMat(tk,{amp:.01,k:18,spd:8,nose:.14,len:.28}))),tk,e,{speed:.12,turn:1.4,pitchMax:.15,reach:.25,box:RB([-15.5,-1.8,56.5],[15.5,-.6,87.6]),wait:[1,3],nose:.14,eatR:.04,fill:6})});

/* ---------- 生態農園 ---------- */
const CROP={lettuce:{n:'萵苣',ic:'🥬',t:120,y:[2,3],sell:15,feed:3,seed:8},kale:{n:'地瓜葉',ic:'🌿',t:90,y:[3,4],sell:10,feed:3,seed:5},carrot:{n:'胡蘿蔔',ic:'🥕',t:180,y:[3,5],sell:18,feed:2,seed:12},
 tomato:{n:'番茄',ic:'🍅',t:240,y:[4,6],sell:25,feed:2,seed:20},strawberry:{n:'草莓',ic:'🍓',t:300,y:[5,8],sell:30,feed:1,seed:30},pumpkin:{n:'南瓜',ic:'🎃',t:480,y:[1,2],sell:120,feed:8,seed:60}};
const SUCC={echeveria:{n:'石蓮花',ic:'🪷',t:600,sell:180,seed:60},bear:{n:'熊童子',ic:'🐾',t:720,sell:220,seed:70},rabbit:{n:'月兔耳',ic:'🐰',t:720,sell:200,seed:60},
 cactus:{n:'金琥仙人掌',ic:'🌵',t:900,sell:260,seed:80},haworthia:{n:'玉露',ic:'💎',t:900,sell:300,seed:100},lithops:{n:'生石花',ic:'🪨',t:1200,sell:450,seed:150}};
UPG.garden={n:'🌱 農園設備',d:'作物和多肉的生長速度；Lv.2 起自動灑水',lv:[1,1.5,2.2,3],cost:[0,3000,9000,20000],fmt:v=>`生長 ×${v}${v>1?'・自動灑水':''}`};
const GX=27,GZ=72.5,BEDS=[[24,65],[30.5,65],[24,68.6],[30.5,68.6],[24,72.2],[30.5,72.2]],POTS=12;
function ensureGarden(){ensureEco();if(!S.gd){S.gd={plots:BEDS.map(()=>({c:null,g:0,w:0})),pots:Array.from({length:POTS},()=>({c:null,g:0,w:0,v:false})),t:Date.now()};S.crop={};S.succ={};}S.crop=S.crop||{};S.succ=S.succ||{};}
const wetFor=(o,pot)=>Date.now()-(o.w||0)<(pot?900e3:180e3)||upv('garden')>1;
function tickGarden(){ensureGarden();const now=Date.now(),el=Math.min((now-S.gd.t)/1000,6*3600);S.gd.t=now;const m=upv('garden');
 for(const p of S.gd.plots)if(p.c&&p.g<1)p.g=Math.min(1,p.g+el/CROP[p.c].t*m*(wetFor(p)?1:.3));
 for(const p of S.gd.pots)if(p.c&&p.g<1)p.g=Math.min(1,p.g+el/SUCC[p.c].t*m*(wetFor(p,1)?1:.5));}
/* 作物與多肉外觀 */
const gm=(geo,col,m)=>{geo=geo.index?geo.toNonIndexed():geo;if(m)geo.applyMatrix4(m);return prim(geo,C(col));};
const M4=(x,y,z,ry=0,rz=0,rx=0,sx=1,sy=1,sz=1)=>new THREE.Matrix4().compose(V(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz,'YZX')),V(sx,sy,sz));
const SG=new THREE.SphereGeometry(1,10,7);
function cropGeo(k){const P=[],F=[];
 if(k==='lettuce')for(let i=0;i<14;i++){const a=i*2.4,r=i<5?.02:.05;P.push(gm(SG.clone(),i<5?0xb8e070:0x7ac04a,M4(Math.cos(a)*r,.05+(i<5?.04:0),-Math.sin(a)*r,a,i<5?1.1:.5,0,.08,.02,.06)));}
 if(k==='kale')for(let i=0;i<12;i++){const a=i*2.1,r=rnd(.03,.09);P.push(gm(SG.clone(),0x3e8a3a,M4(Math.cos(a)*r,.08+rnd(0,.06),-Math.sin(a)*r,a,.4,0,.05,.008,.045)),gm(new THREE.CylinderGeometry(.003,.003,.1,4),0x7a3a6a,M4(Math.cos(a)*r*.5,.04,-Math.sin(a)*r*.5,0,.6)));}
 if(k==='carrot'){for(let i=0;i<8;i++){const a=i*.8;P.push(gm(new THREE.ConeGeometry(.012,.26,5),0x5aa83a,M4(Math.cos(a)*.02,.13,-Math.sin(a)*.02,a,.35)));}F.push(gm(new THREE.ConeGeometry(.022,.05,10),0xf07a1a,M4(0,.01,0,0,Math.PI)));}
 if(k==='tomato'){P.push(gm(new THREE.CylinderGeometry(.006,.006,.95,5),0x8a6a48,M4(.04,.47,0)),gm(new THREE.CylinderGeometry(.008,.01,.7,6),0x4a8a3a,M4(0,.35,0)));
  for(let i=0;i<8;i++){const a=i*1.7,y=.15+i*.07;P.push(gm(SG.clone(),0x3e7a32,M4(Math.cos(a)*.07,y,-Math.sin(a)*.07,a,0,0,.08,.025,.06)));}
  for(let i=0;i<7;i++){const a=i*2.2,y=.2+i*.06;F.push(gm(SG.clone(),i%3?0xd8301a:0xe85a2a,M4(Math.cos(a)*.06,y,-Math.sin(a)*.06,0,0,0,.028,.026,.028)));}}
 if(k==='strawberry'){for(let i=0;i<9;i++){const a=i*.7;P.push(gm(SG.clone(),0x3a8a3a,M4(Math.cos(a)*.06,.06,-Math.sin(a)*.06,a,.3,0,.04,.008,.035)));}
  for(let i=0;i<6;i++){const a=i*1.05+.3;F.push(gm(new THREE.ConeGeometry(.014,.028,8),0xd8202a,M4(Math.cos(a)*.1,.02,-Math.sin(a)*.1,0,Math.PI)));}}
 if(k==='pumpkin'){for(let i=0;i<6;i++){const a=i*1.05;P.push(gm(SG.clone(),0x4a8a3a,M4(Math.cos(a)*.18,.08,-Math.sin(a)*.18,a,.2,0,.13,.02,.11)),gm(new THREE.CylinderGeometry(.006,.006,.3,4),0x5a8a3a,M4(Math.cos(a)*.1,.03,-Math.sin(a)*.1,-a,Math.PI/2)));}
  F.push(colorize(new THREE.SphereGeometry(.15,18,12).scale(1,.72,1).translate(0,.1,0),(c,x,y,z)=>{c.set(Math.sin(Math.atan2(z,x)*8)>.6?0xc85a10:0xf08a1a).convertSRGBToLinear();}),gm(new THREE.CylinderGeometry(.012,.016,.05,6),0x5a6a2a,M4(0,.2,0)));}
 return{p:merge(P),f:F.length?merge(F):null};}
function succGeo(k,v){const P=[];
 if(k==='echeveria')for(let L=0;L<3;L++)for(let i=0;i<9;i++){const a=i/9*6.28+L*.35;P.push(gm(SG.clone(),0x8ab0a8,M4(Math.cos(a)*(.02+L*-.006),.02+L*.008,-Math.sin(a)*(.02+L*-.006),a,.25+L*.35,0,.03-L*.006,.008,.014-L*.002)));}
 if(k==='haworthia')for(let i=0;i<14;i++){const a=i*2.4,r=.012;P.push(gm(SG.clone(),0x9ad8a0,M4(Math.cos(a)*r,.02,-Math.sin(a)*r,a,.7,0,.015,.012,.01)));}
 if(k==='lithops')for(const s of[1,-1])P.push(gm(new THREE.SphereGeometry(1,14,10,0,Math.PI*2,0,Math.PI/2),0xb8a890,M4(0,.004,s*.011,0,0,0,.02,.026,.011)));
 if(k==='cactus')P.push(colorize(new THREE.SphereGeometry(.045,20,14).translate(0,.04,0),(c,x,y,z)=>{const r=Math.sin(Math.atan2(z,x)*12);c.set(r>.85&&Math.sin(y*300)>.3?0xf2d84a:r>0?0x3e8a4a:0x2e6a3a).convertSRGBToLinear();}));
 if(k==='bear')for(let i=0;i<8;i++){const a=i*1.6;P.push(gm(SG.clone(),0x8ab868,M4(Math.cos(a)*.014,.03+i*.004,-Math.sin(a)*.014,a,.5,0,.011,.022,.009)),gm(SG.clone(),0xa0302a,M4(Math.cos(a)*.026,.05+i*.004,-Math.sin(a)*.026,0,0,0,.004,.003,.004)));}
 if(k==='rabbit')for(let i=0;i<9;i++){const a=i*2.3;P.push(gm(SG.clone(),0xc8d0b8,M4(Math.cos(a)*.012,.035,-Math.sin(a)*.012,a,.35,0,.009,.035,.007)));}
 const g=merge(P);if(v){const p=g.attributes.position,c=g.attributes.color,t=new THREE.Color();for(let i=0;i<p.count;i++){if(Math.sin(p.getX(i)*500+p.getZ(i)*380)>.35){t.setRGB(c.getX(i),c.getY(i),c.getZ(i)).lerp(C(0xf2e8a8),.75);c.setXYZ(i,t.r,t.g,t.b);}}}
 return g;}
/* 農園場景 */
const GD={beds:[],pots:[]};
(function(){const plantM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,side:THREE.DoubleSide});
 const wood=new THREE.MeshStandardMaterial({color:C(0x7a5a3a),roughness:.85,normalMap:rep(scaleN,3,1),normalScale:new THREE.Vector2(.6,.6)});
 for(const [tx,tz] of[[27,68],[33,80]]){for(let i=scene.children.length-1;i>=0;i--){const o=scene.children[i];if(Math.abs(o.position.x-tx)<.3&&Math.abs(o.position.z-tz)<.3&&o.position.y<.5)scene.remove(o);}
  for(let i=OBST.length-1;i>=0;i--){const o=OBST[i];if(Math.abs((o[0]+o[1])/2-tx)<.1&&Math.abs((o[2]+o[3])/2-tz)<.1)OBST.splice(i,1);}}
 const gr=add(new THREE.PlaneGeometry(13.5,22),new THREE.MeshStandardMaterial({color:C(0x8a7a5a),roughness:1,map:rep(slateTex,4,6)}),GX,.01,GZ+1.5);gr.rotation.x=-Math.PI/2;
 BEDS.forEach(([x,z],i)=>{box(4.1,.32,.12,wood,x,.16,z-.8);box(4.1,.32,.12,wood,x,.16,z+.8);box(.12,.32,1.5,wood,x-2,.16,z);box(.12,.32,1.5,wood,x+2,.16,z);
  const soil=box(3.9,.28,1.5,new THREE.MeshStandardMaterial({color:C(0x5a3e28),roughness:1,normalMap:rep(scaleN,6,3),normalScale:new THREE.Vector2(1.5,1.5)}),x,.14,z);
  const pl=[];for(let r=0;r<2;r++)for(let c=0;c<4;c++){const g=new THREE.Group();g.position.set(x-1.4+c*.93,.28,z-.38+r*.76);g.rotation.y=rnd(0,6);scene.add(g);pl.push(g);}
  GD.beds.push({soil,pl,k:null});OBST.push([x-2.05,x+2.05,z-.85,z+.85]);STATIONS.push({p:V(x,.5,z),fn:()=>gardenSheet()});});
 const sign=add(new THREE.PlaneGeometry(2.8,.66),new THREE.MeshBasicMaterial({map:vText([['🌱 生態農園',56,.46],['蔬菜田・多肉溫室',26,.84,'#d8f0a0']],640,150,'#1e3216','#f4f0e0')}),GX,2.4,62.3);
 for(const s of[-1,1])box(.12,2.8,.12,wood,GX+s*1.45,1.4,62.3);
 /* 多肉溫室 */
 const hx=GX,hz=79.6,glass=new THREE.MeshPhysicalMaterial({color:0xf4fbff,transparent:true,opacity:.18,roughness:.05,side:THREE.DoubleSide,depthWrite:false}),fr=new THREE.MeshStandardMaterial({color:C(0xeeeeee),metalness:.4,roughness:.3});
 box(6,2.4,.04,glass,hx,1.2,hz-1.8);box(6,2.4,.04,glass,hx,1.2,hz+1.8);box(.04,2.4,3.6,glass,hx-3,1.2,hz);box(.04,2.4,3.6,glass,hx+3,1.2,hz);
 for(const s of[1,-1]){const r=box(6.1,.04,2.1,glass,hx,2.9,hz+s*.9);r.rotation.x=s*.5;}
 for(const x of[-3,-1.5,0,1.5,3])for(const z of[-1.8,1.8])box(.06,2.4,.06,fr,hx+x,1.2,hz+z);box(6.1,.06,.06,fr,hx,3.4,hz);
 for(let r=0;r<2;r++)box(5.4,.05,.6,wood,hx,.55+r*.45,hz-1.1+r*.65);
 for(let i=0;i<POTS;i++){const r=Math.floor(i/6),c=i%6,x=hx-2.25+c*.9,y=.58+r*.45,z=hz-1.1+r*.65;add(new THREE.CylinderGeometry(.07,.055,.1,14),new THREE.MeshStandardMaterial({color:C(0xb8643a),roughness:.8}),x,y+.05,z);
  add(new THREE.CylinderGeometry(.064,.064,.01,14),new THREE.MeshStandardMaterial({color:C(0x4a3424),roughness:1}),x,y+.098,z);const g=new THREE.Group();g.position.set(x,y+.1,z);g.scale.setScalar(1.5);scene.add(g);GD.pots.push({g,k:null});}
 const hs=add(new THREE.PlaneGeometry(1.8,.42),new THREE.MeshBasicMaterial({map:vText([['🪴 多肉溫室',52,.5]],440,104,'#2a3a22','#f4f0e0')}),hx,2.55,hz-1.83);hs.rotation.y=Math.PI;
 const hs2=add(new THREE.PlaneGeometry(1.8,.42),hs.material,hx,2.55,hz-1.86);
 OBST.push([hx-3.1,hx+3.1,hz-1.9,hz+1.9]);STATIONS.push({p:V(hx,1,hz-1.6),fn:()=>succSheet()});
 const pthM=new THREE.MeshStandardMaterial({map:rep(slateTex,1,6),roughness:.7,color:C(0xc8c0b0)});const pth=(x,z,w,d)=>{const p=add(new THREE.PlaneGeometry(w,d),pthM,x,.014,z);p.rotation.x=-Math.PI/2;};
 pth((2.4+GX)/2,54,GX-2.4,2);pth(GX,58.2,2,8.4);
 /* 視覺同步 */
 const cache2={};const cg=k=>cache2[k]||(cache2[k]=cropGeo(k));const sc2={};const sg=(k,v)=>sc2[k+v]||(sc2[k+v]=succGeo(k,v));
 window.__gdSync=()=>{ensureGarden();S.gd.plots.forEach((p,i)=>{const b=GD.beds[i];b.soil.material.color.set(wetFor(p)?0x3a2818:0x5a3e28);if(b.k!==p.c){b.k=p.c;b.pl.forEach(g=>{for(let q=g.children.length-1;q>=0;q--)g.remove(g.children[q]);if(p.c){const G=cg(p.c);add(G.p,plantM,0,0,0,g);if(G.f){const f=add(G.f,plantM,0,0,0,g);f.userData.fruit=1;}}});}
   b.pl.forEach(g=>{g.scale.setScalar(.15+.85*p.g);g.children.forEach(m=>{if(m.userData.fruit)m.visible=p.g>.75;});});});
  S.gd.pots.forEach((p,i)=>{const o=GD.pots[i],key=p.c?p.c+(p.v?1:0):null;if(o.k!==key){o.k=key;for(let q=o.g.children.length-1;q>=0;q--)o.g.remove(o.g.children[q]);if(p.c)add(sg(p.c,p.v?1:0),plantM,0,0,0,o.g);}o.g.scale.setScalar(1.5*(.3+.7*p.g));});};
 let ac=0;globalAnims.push((t,dt)=>{if(!loaded)return;ac+=dt;if(ac<1)return;ac=0;tickGarden();window.__gdSync();});
 SPOTS.push(['🌱 生態農園',()=>Object.assign(player,{x:GX,y:0,z:60.5,yaw:Math.PI,pitch:-.25})]);
 const _bar5=bar;bar=function(){_bar5();if(lvl()!==0||window.__ride)return;if(player.x>20.5&&player.x<34&&player.z>60&&player.z<83){near=null;lastNear=null;ensureGarden();$('#bar').style.display='block';$('#bT').textContent='🌱 生態農園';
  const rd=S.gd.plots.filter(p=>p.c&&p.g>=1).length+S.gd.pots.filter(p=>p.c&&p.g>=1).length,dry=S.gd.plots.filter(p=>p.c&&p.g<1&&!wetFor(p)).length;$('#bD').textContent=`可收成 ${rd}・需要澆水 ${dry}・倉庫作物 ${Object.values(S.crop).reduce((a,b)=>a+b,0)}`;
  if(lastBtns!=='gd'){lastBtns='gd';const bb=$('#bB');bb.innerHTML='';for(const [t,f,c] of[['🥕 菜田',()=>gardenSheet(),'feed'],['🪴 多肉',()=>succSheet(),''],['🧺 作物',()=>cropSheet(),'']]){const x=document.createElement('button');x.className='btn '+c;x.textContent=t;x.onclick=f;bb.appendChild(x);}}}};})();
/* 介面 */
const pct=g=>Math.round(g*100)+'%';
function gardenSheet(pick){tickGarden();const m=upv('garden');
 if(pick!=null){sheet(`種在第 ${pick+1} 塊田`,Object.entries(CROP).map(([k,c])=>`<button class="opt" data-c="${k}"><b>${c.ic} ${c.n}</b><span class="mut">種子 ${fmt$(c.seed)}・約 ${Math.round(c.t/m/60*10)/10} 分鐘・收 ${c.y.join('–')} 個・賣 $${c.sell}／做飼料 +${c.feed}</span></button>`).join('')+'<button class="chip" id="gBk">← 返回</button>',
  c=>{c.querySelector('#gBk').onclick=()=>gardenSheet();c.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;if(!pay(CROP[k].seed,'種子'))return;Object.assign(S.gd.plots[pick],{c:k,g:0,w:Date.now()});markDirty();window.__gdSync();toast(`${CROP[k].ic} 種下${CROP[k].n}，記得澆水`);gardenSheet();});});return;}
 const rows=S.gd.plots.map((p,i)=>{if(!p.c)return`<div class="row2"><span>第 ${i+1} 塊田 <span class="mut sm">空地</span></span><button class="btn sm" data-p="${i}">播種</button></div>`;const c=CROP[p.c],wet=wetFor(p);
  return`<div class="res"><div><b>${c.ic} ${c.n}</b> <span class="mut">第 ${i+1} 塊・${p.g>=1?'可以收成！':pct(p.g)}</span></div><div class="bars"><i style="width:${p.g*100}%;background:${p.g>=1?'var(--acc)':'#7ac04a'}"></i></div><div class="mut sm">${wet?'💧 土壤濕潤':'🥀 土太乾，長得很慢'}</div>${p.g>=1?`<button class="btn sm feed" data-h="${i}">收成</button>`:wet?'<span></span>':`<button class="btn sm" data-w="${i}">澆水</button>`}</div>`;}).join('');
 sheet('🥕 蔬菜田',`<div class="mut sm">播種 → 澆水 → 收成。收成的作物可以賣掉，或做成「蔬菜」飼料給陸龜、鬆獅蜥、鳥吃。${m>1?'（已自動灑水）':''}</div><div style="display:flex;gap:6px;margin:8px 0"><button class="btn" id="gWa">💧 全部澆水</button><button class="btn feed" id="gHa">🧺 全部收成</button><button class="btn" id="gCr">作物庫存</button></div>${rows}`,
  c=>{c.querySelector('#gCr').onclick=()=>cropSheet();c.querySelector('#gWa').onclick=()=>{S.gd.plots.forEach(p=>{if(p.c)p.w=Date.now();});markDirty();window.__gdSync();toast('💧 全部澆好水了');gardenSheet();};
   c.querySelector('#gHa').onclick=()=>{let n=0;S.gd.plots.forEach((p,i)=>{if(p.c&&p.g>=1)n+=harvest(i);});toast(n?`🧺 收成 ${n} 個作物，放進作物庫存`:'還沒有可以收成的作物');gardenSheet();};
   c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>gardenSheet(+b.dataset.p));c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{S.gd.plots[+b.dataset.w].w=Date.now();markDirty();window.__gdSync();gardenSheet();});
   c.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{const n=harvest(+b.dataset.h);toast(`🧺 收成 ${n} 個`);gardenSheet();});});}
function harvest(i){const p=S.gd.plots[i],c=CROP[p.c],n=c.y[0]+(Math.random()*(c.y[1]-c.y[0]+1)|0);S.crop[p.c]=(S.crop[p.c]||0)+n;Object.assign(p,{c:null,g:0,w:0});markDirty();window.__gdSync();return n;}
function succSheet(pick){tickGarden();const m=upv('garden');
 if(pick!=null){sheet(`種在第 ${pick+1} 盆`,Object.entries(SUCC).map(([k,c])=>`<button class="opt" data-c="${k}"><b>${c.ic} ${c.n}</b><span class="mut">葉插苗 ${fmt$(c.seed)}・約 ${Math.round(c.t/m/60)} 分鐘・成株賣 ${fmt$(c.sell)}（錦斑 ×5）</span></button>`).join('')+'<button class="chip" id="sBk">← 返回</button>',
  c=>{c.querySelector('#sBk').onclick=()=>succSheet();c.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;if(!pay(SUCC[k].seed,'葉插苗'))return;Object.assign(S.gd.pots[pick],{c:k,g:0,w:Date.now(),v:Math.random()<.08});markDirty();window.__gdSync();toast(`${SUCC[k].ic} 種下${SUCC[k].n}`);succSheet();});});return;}
 const rows=S.gd.pots.map((p,i)=>{if(!p.c)return`<div class="row2"><span>第 ${i+1} 盆 <span class="mut sm">空盆</span></span><button class="btn sm" data-p="${i}">種植</button></div>`;const c=SUCC[p.c],val=c.sell*(p.v?5:1);
  return`<div class="res"><div><b>${c.ic} ${c.n}${p.v?' <span style="color:#f2d84a">✦錦</span>':''}</b> <span class="mut">${p.g>=1?'成株':pct(p.g)}</span></div><div class="bars"><i style="width:${p.g*100}%;background:#9ad8a0"></i></div><div class="mut sm">${wetFor(p,1)?'💧 剛澆過':'🌵 有點乾（多肉耐旱，只是長慢一點）'}・成株價 ${fmt$(val)}</div>${p.g>=1?`<span style="display:flex;gap:4px"><button class="btn sm feed" data-s="${i}">賣 ${fmt$(val)}</button><button class="btn sm" data-k="${i}">收藏</button></span>`:`<button class="btn sm" data-w="${i}">澆水</button>`}</div>`;}).join('');
 const col=Object.entries(S.succ).filter(([k,n])=>n).map(([k,n])=>{const[b,v]=k.split(':');return`${SUCC[b].ic}${SUCC[b].n}${v?'✦錦':''}×${n}`;}).join('、');
 sheet('🪴 多肉溫室',`<div class="mut sm">多肉長得慢但很值錢，每盆有 8% 機率長出稀有的「錦斑」（黃白條紋），價格 ×5。${col?'<br>收藏：'+col:''}</div>${rows}`,
  c=>{c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>succSheet(+b.dataset.p));c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{S.gd.pots[+b.dataset.w].w=Date.now();markDirty();succSheet();});
   c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const p=S.gd.pots[+b.dataset.s],v=SUCC[p.c].sell*(p.v?5:1);earn(v);toast(`💰 賣出${SUCC[p.c].n}${p.v?'（錦）':''}，獲得 ${fmt$(v)}`);Object.assign(p,{c:null,g:0,w:0,v:false});markDirty();window.__gdSync();succSheet();});
   c.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const p=S.gd.pots[+b.dataset.k],key=p.c+':'+(p.v?1:'');S.succ[key]=(S.succ[key]||0)+1;toast(`🪴 ${SUCC[p.c].n} 收進收藏`);Object.assign(p,{c:null,g:0,w:0,v:false});markDirty();window.__gdSync();succSheet();});});}
function cropSheet(){ensureGarden();const rows=Object.entries(CROP).map(([k,c])=>{const n=S.crop[k]||0;return`<div class="row2"><span>${c.ic} ${c.n} <b>${n}</b> <span class="mut sm">$${c.sell}・飼料 +${c.feed}</span></span><span style="display:flex;gap:4px"><button class="btn sm ${n?'':'dis'}" data-s="${k}">全賣</button><button class="btn sm ${n?'':'dis'}" data-f="${k}">做飼料</button></span></div>`;}).join('');
 const sc=Object.entries(S.succ).filter(([k,n])=>n).map(([k,n])=>{const[b,v]=k.split(':'),val=SUCC[b].sell*(v?5:1);return`<div class="row2"><span>${SUCC[b].ic} ${SUCC[b].n}${v?' ✦錦':''} ×${n}</span><button class="btn sm" data-u="${k}">賣 1 盆 ${fmt$(val)}</button></div>`;}).join('');
 sheet('🧺 作物庫存',`<div class="mut sm">「做飼料」會把作物加進蔬菜庫存（目前 ${S.stock.veg}/${capOf('veg')}），陸龜、鬆獅蜥、鳥園餵食都會用到。</div>${rows}${sc?'<h4>多肉收藏</h4>'+sc:''}`,c=>{
  c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,n=S.crop[k]||0;if(!n)return;S.crop[k]=0;earn(n*CROP[k].sell);toast(`💰 賣出${CROP[k].n} ×${n}，獲得 ${fmt$(n*CROP[k].sell)}`);cropSheet();});
  c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f,n=S.crop[k]||0;if(!n)return;const room=capOf('veg')-S.stock.veg,use=Math.min(n,Math.ceil(room/CROP[k].feed));if(use<=0){toast('蔬菜庫存已經滿了');return;}S.crop[k]-=use;S.stock.veg=Math.min(capOf('veg'),S.stock.veg+use*CROP[k].feed);markDirty();toast(`🥗 ${use} 個${CROP[k].n}做成飼料，蔬菜庫存 ${S.stock.veg}`);cropSheet();});
  c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const k=b.dataset.u,[bb,v]=k.split(':'),val=SUCC[bb].sell*(v?5:1);S.succ[k]--;earn(val);toast(`💰 賣出${SUCC[bb].n}，獲得 ${fmt$(val)}`);cropSheet();});});}
const _wh9=whSheet;whSheet=function(){_wh9();const c=$('#shC'),b=document.createElement('button');b.className='btn';b.textContent='🧺 農作物';b.onclick=()=>cropSheet();const w=c.querySelector('#wUp');if(w)w.after(b);};
const _rc7=refreshChips;refreshChips=function(){_rc7();const ch=$('#chips'),b=document.createElement('button');b.className='chip';b.textContent='🌱 農園';b.onclick=()=>{const s=SPOTS.find(x=>x[0]==='🌱 生態農園');if(s)s[1]();};ch.appendChild(b);};
