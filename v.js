/* =================================================================
   🕷 節肢動物館（爬蟲館西側）
   ================================================================= */
/* ---- 物種 ---- */
Object.assign(SP,{
 scorp:{n:'帝王蠍',s:'Pandinus imperator',z:'體長 20 cm',f:'蠍子是「胎生」的，小蠍子一出生就爬到媽媽背上。牠們在紫外線燈下會發出藍綠色螢光，科學家到現在還不確定為什麼。',hab:'tropical',cost:2,hr:.02,diet:'insect'},
 tarant:{n:'智利紅玫瑰',s:'Grammostola rosea',z:'腳展 14 cm',f:'母蜘蛛可以活 20 年以上，公的只有幾年。牠們受到威脅時會用後腳把腹部的「蟄毛」踢出去。',hab:'desert',cost:2,hr:.015,diet:'insect'},
 beetle:{n:'獨角仙',s:'Trypoxylus dichotomus',z:'體長 8 cm（含角）',f:'只有公的有長角，用來把對手從樹上撬下去。幼蟲在腐植土裡要長將近一年，成蟲只活一個夏天。',hab:'tropical',cost:1,hr:.03,diet:'veg'},
 stag:{n:'台灣深山鍬形蟲',s:'Lucanus formosanus',z:'體長 7 cm',f:'台灣特有種，住在中高海拔的山區。公蟲巨大的「大顎」其實是嘴巴，打架用的，咬合力不太會傷人。',hab:'tropical',cost:1,hr:.03,diet:'veg'},
 mantis:{n:'蘭花螳螂',s:'Hymenopus coronatus',z:'體長 6 cm',f:'牠長得像一朵蘭花，不是為了躲在花裡，而是自己「假裝成花」，把來採蜜的昆蟲騙過來吃掉。母螳螂交配後有時會把公的吃掉。',hab:'tropical',cost:1,hr:.03,diet:'insect'},
 stick:{n:'津田氏大頭竹節蟲',s:'Megacrania tsudai',z:'體長 12 cm',f:'台灣的保育類昆蟲，只吃林投的葉子。很多竹節蟲可以「孤雌生殖」：沒有公的，母的也能自己生出女兒。',hab:'tropical',cost:1,hr:.02,diet:'veg'},
 milli:{n:'非洲巨人馬陸',s:'Archispirostreptus gigas',z:'體長 30 cm',f:'名字叫「千足蟲」，其實大約 250 隻腳。受到驚嚇會捲成一團，還會分泌難聞的液體。牠們是森林裡的分解者。',hab:'tropical',cost:1,hr:.02,diet:'veg'},
 isopod:{n:'球鼠婦（群）',s:'Armadillidium vulgare',z:'體長 1.5 cm',f:'牠們其實是蝦蟹的親戚（甲殼類），用鰓呼吸，所以要住在潮濕的地方。是生態缸裡最好的「清潔隊」。',hab:'tropical',cost:1,hr:.02,diet:'veg'},
 giso:{n:'大王具足蟲',s:'Bathynomus giganteus',z:'體長 35 cm',f:'住在幾百公尺深的海底，吃沉下來的動物屍體。日本鳥羽水族館有一隻 5 年多完全沒吃東西，還活著。',hab:'reef',cost:3,hr:.004,diet:'pellet'},
 hcrab:{n:'三棘鱟',s:'Tachypleus tridentatus',z:'體長 50 cm',f:'鱟在地球上活了 4 億多年，被叫做活化石。牠的血是藍色的，用來檢驗疫苗有沒有被細菌汙染。金門是台灣鱟最重要的棲地，但因為海岸開發數量大減。',hab:'reef',hab2:'seahorse',cost:3,hr:.01,diet:'pellet'}});
Object.assign(PRICE,{scorp:900,tarant:1100,beetle:300,stag:600,mantis:800,stick:500,milli:450,isopod:150,giso:4500,hcrab:3000});
const ARTH=new Set(['scorp','tarant','beetle','stag','mantis','stick','milli','isopod','giso','hcrab']);
/* 繁殖：展示缸內（孤雌生殖、清潔隊）＋繁殖場 */
Object.assign(BR,{stick:{m:'bud',n:[1,2],p:.12},isopod:{m:'live',n:[2,3],p:.25},milli:{m:'spawn',n:[1,2],p:.08}});
Object.assign(NEED,{soil:{n:'🪵 發酵木屑',d:'甲蟲把卵產在腐植土裡，幼蟲吃它長大',c:300},sand:{n:'🏖 潮間帶沙灘',d:'模擬大潮的沙灘，鱟在滿月大潮時上岸產卵',c:1200},moult:{n:'🍂 蛻皮躲避屋',d:'蜘蛛、蠍子蛻皮時很脆弱，要有安全的地方',c:250}});
Object.assign(BRE,{
 scorp:{g:'live',cool:0,T:[26,30],H:[70,85],court:1,gest:4,n:[4,8],need:['moult'],f:'公蠍會拉著母蠍的鉗子跳「求偶舞」，把精莢放在地上再拖母蠍過去。小蠍子出生後會爬到媽媽背上，第一次蛻皮後才下來。'},
 tarant:{g:'spawn',cool:2,coolT:[18,22],T:[24,28],H:[40,60],court:1,gest:3,n:[4,8],need:['moult'],cann:.25,f:'公蜘蛛交配時要很小心，母的有時會把牠吃掉。母蜘蛛會織一個「卵囊」，抱著它好幾週直到小蜘蛛孵出。'},
 beetle:{g:'spawn',cool:0,T:[22,27],H:[60,80],court:1,gest:3,n:[3,6],need:['soil'],f:'獨角仙母蟲會鑽進發酵木屑裡產卵，幼蟲（雞母蟲）吃腐植土長大，經過三齡、化蛹，將近一年才變成蟲。'},
 stag:{g:'spawn',cool:2,coolT:[14,18],T:[18,23],H:[60,80],court:1,gest:3,n:[2,4],need:['soil'],f:'深山鍬形蟲住在比較涼的山上，溫度太高幼蟲會長不好。母蟲會在朽木裡咬洞產卵。'},
 mantis:{g:'spawn',cool:0,T:[25,30],H:[60,80],court:1,gest:3,n:[4,8],need:[],cann:.3,f:'母螳螂會產下一個泡沫狀的「卵鞘」，幾週後一次孵出幾十隻小螳螂。小螳螂一出生就會互相吃，要分開養。'},
 hcrab:{g:'spawn',cool:0,T:[24,28],court:2,gest:3,n:[3,6],need:['sand'],first:'brine',lv:2,f:'鱟會在夏天大潮的夜晚成對上岸，母鱟在沙灘挖洞產卵，公鱟緊緊抱在後面。小鱟要蛻皮十幾次、超過十年才會長大。'}});
CP.hcrab={n:'🦀 金門鱟復育',sp:'hcrab',type:'release',need:4,$:9000,rep:25,t:1,f:'金門的鱟因為海岸開發和汙染大量減少，當地有人工繁殖、放流小鱟的復育計畫。放流前要先在水族館養到能自己覓食。'};
CP.stick={n:'🌿 大頭竹節蟲棲地保育',sp:'stick',type:'breed',need:4,$:3000,rep:10,t:1,f:'津田氏大頭竹節蟲只吃林投，而林投在海岸開發中一直被砍掉。保護牠，就要先保護海岸林。'};
/* ---- 3D 模型 ---- */
function bugMesh(type,e){const g=new THREE.Group(),legs=[],M=c=>new THREE.MeshStandardMaterial({color:C(c),roughness:.35,metalness:.1});const parts={};
 const ell=(m,sx,sy,sz,x,y,z,p=g)=>{const o=add(new THREE.SphereGeometry(.5,14,10),m,x,y,z,p);o.scale.set(sx,sy,sz);return o;};
 const leg=(m,x,z,side,len,up,front,r=.006,p=g)=>{const piv=new THREE.Group();piv.position.set(x,up*.5,z);p.add(piv);const a=V(0,0,0),b=V(len*.15,up*.9,side*len*.45),c=V(len*.32,-up*.5,side*len*.95);
  add(cylBetween(a,b,r,r*.8),m,0,0,0,piv);add(cylBetween(b,c,r*.8,r*.4),m,0,0,0,piv);piv.userData={side,front};legs.push(piv);return piv;};
 if(type==='scorp'){const m=M(0x101418),L=.2;parts.m=m;ell(m,.07,.035,.06,.04,.03,0);for(let i=0;i<5;i++)ell(m,.022,.03,.065-i*.003,-.01-i*.022,.03,0);let px=-.11,py=.035;parts.tail=[];
  for(let i=0;i<5;i++){const s=ell(m,.03,.022,.022,px,py,0);parts.tail.push(s);px-=.018*Math.cos(i*.55);py+=.026*Math.sin(.3+i*.55);}const st=add(new THREE.ConeGeometry(.008,.03,6),m,px+.01,py+.005,0,g);st.rotation.z=-2.2;
  for(const s of[1,-1]){const arm=new THREE.Group();arm.position.set(.07,.03,s*.025);g.add(arm);add(cylBetween(V(0,0,0),V(.05,0,s*.04),.007,.006),m,0,0,0,arm);const cl=ell(m,.06,.022,.03,.08,0,s*.05,arm);parts['c'+s]=arm;}
  for(let i=0;i<4;i++)for(const s of[1,-1])leg(m,.05-i*.03,s*.02,s,.07,.035,i<2?1:0,.004);}
 else if(type==='tarant'){const m=M(0x6a4a3e),h=M(0xc08a7a);ell(m,.06,.035,.055,.025,.04,0);ell(h,.075,.06,.07,-.045,.05,0);for(let i=0;i<4;i++)for(const s of[1,-1])leg(i%2?h:m,.04-i*.012,s*.02,s,.09,.05,i<2?1:0,.006);
  for(const s of[1,-1])add(cylBetween(V(.05,.035,s*.012),V(.085,.015,s*.02),.005,.004),m,0,0,0,g);}
 else if(type==='beetle'||type==='stag'){const big=e&&e.sex==='♂';const m=M(type==='beetle'?0x4a2a14:0x3a2010);m.metalness=.25;m.roughness=.22;ell(m,.07,.032,.05,-.01,.032,0);ell(m,.028,.025,.04,.035,.035,0);ell(m,.016,.014,.022,.055,.03,0);
  if(type==='beetle'&&big){add(cylBetween(V(.06,.03,0),V(.1,.06,0),.006,.004),m,0,0,0,g);add(cylBetween(V(.1,.06,0),V(.105,.075,0),.004,.002),m,0,0,0,g);add(cylBetween(V(.04,.05,0),V(.07,.06,0),.005,.003),m,0,0,0,g);}
  if(type==='stag'){const r=big?.04:.015;for(const s of[1,-1]){add(cylBetween(V(.06,.03,s*.008),V(.06+r,.032,s*.02),.005,.004),m,0,0,0,g);add(cylBetween(V(.06+r,.032,s*.02),V(.065+r,.033,s*.002),.004,.002),m,0,0,0,g);}}
  for(let i=0;i<3;i++)for(const s of[1,-1])leg(m,.03-i*.025,s*.018,s,.06,.03,i===0?1:0,.004);}
 else if(type==='mantis'){const m=M(0xf6e4ee),p=M(0xf0b8d0);ell(m,.05,.02,.02,-.02,.04,0);ell(m,.04,.012,.012,.03,.05,0);const hd=add(new THREE.ConeGeometry(.012,.02,3),m,.06,.058,0,g);hd.rotation.z=-Math.PI/2;
  for(const s of[1,-1]){add(cylBetween(V(.045,.05,s*.006),V(.07,.03,s*.012),.004,.003),m,0,0,0,g);add(cylBetween(V(.07,.03,s*.012),V(.065,.055,s*.01),.003,.002),m,0,0,0,g);}
  for(let i=0;i<2;i++)for(const s of[1,-1]){const l=leg(m,.0-i*.025,s*.008,s,.06,.04,i===0?1:0,.003);ell(p,.025,.004,.016,.02,.03,s*.02,l);}}
 else if(type==='stick'){const m=M(0x5a8a3a);ell(m,.16,.014,.014,0,.05,0);ell(m,.025,.02,.02,.085,.052,0);for(let i=0;i<3;i++)for(const s of[1,-1])leg(m,.04-i*.05,s*.006,s,.12,.05,i===0?1:0,.003);
  add(cylBetween(V(.1,.055,0),V(.17,.07,.02),.002,.001),m,0,0,0,g);add(cylBetween(V(.1,.055,0),V(.17,.07,-.02),.002,.001),m,0,0,0,g);}
 else if(type==='milli'){const m=M(0x3a1c10),l=M(0xa06040);parts.seg=[];for(let i=0;i<22;i++){const s=ell(m,.018,.022,.022,.11-i*.011,.014,0);parts.seg.push(s);if(i%2===0)for(const q of[1,-1])add(cylBetween(V(0,0,0),V(0,-.012,q*.012),.0015,.001),l,s.position.x,.008,q*.006,g);}}
 else if(type==='isopod'){const m=M(0x6a6e74);parts.iso=[];for(let i=0;i<6;i++){const b=new THREE.Group();b.position.set(rnd(-.06,.06),0,rnd(-.05,.05));b.rotation.y=rnd(0,6.28);g.add(b);ell(m,.03,.012,.02,0,.007,0,b);parts.iso.push(b);}}
 else if(type==='giso'){const m=M(0xc8c0b4);m.roughness=.5;for(let i=0;i<7;i++)ell(m,.06,.05,.24-Math.abs(i-3)*.015,.15-i*.05,.03,0);ell(m,.05,.035,.12,.19,.025,0);for(let i=0;i<7;i++)for(const s of[1,-1])leg(m,.14-i*.045,s*.09,s,.07,.025,i<3?1:0,.006);
  for(const s of[1,-1])add(cylBetween(V(.21,.03,s*.03),V(.32,.03,s*.08),.004,.002),m,0,0,0,g);}
 else if(type==='hcrab'){const m=M(0x5a4a30);m.roughness=.4;const sh=ell(m,.26,.06,.28,.06,.035,0);const ab=ell(m,.13,.04,.14,-.12,.03,0);add(cylBetween(V(-.17,.03,0),V(-.4,.025,0),.01,.004),m,0,0,0,g);
  for(let i=0;i<5;i++)for(const s of[1,-1])leg(m,.08-i*.03,s*.04,s,.06,.02,i<2?1:0,.005);}
 if(e&&e.g&&e.g.m&&e.g.m!=='n'){g.traverse(o=>{if(o.isMesh&&o.material.color){const c=o.material.color;if(e.g.m==='alb'||e.g.m==='leu')c.lerp(C(0xf4eee6),.6);else if(e.g.m==='mel')c.multiplyScalar(.35);else if(e.g.m==='xan')c.lerp(C(0xe8b830),.5);else if(e.g.m==='ery')c.lerp(C(0xd84a2a),.5);else if(e.g.m==='glo'){o.material.emissive=C(0x30ffd0);o.material.emissiveIntensity=.25;}}});}
 return{g,legs,parts};}
const BUGO={scorp:{len:.2,speed:.03,wait:[4,14]},tarant:{len:.14,speed:.025,wait:[8,25]},beetle:{len:.09,speed:.03,wait:[3,10]},stag:{len:.08,speed:.03,wait:[3,10]},mantis:{len:.08,speed:.015,wait:[10,30]},stick:{len:.2,speed:.012,wait:[10,30]},milli:{len:.24,speed:.035,wait:[2,8]},isopod:{len:.12,speed:.02,wait:[1,5]}};
let UVON=false;
class Bug{constructor(tk,entry,key){this.tk=tk;this.entry=entry;this.key=key;this.o=BUGO[key];const M=bugMesh(key,entry);this.M=M;this.g=M.g;tk.group.add(this.g);this.len=this.o.len;
  this.pos=randIn(tk.walk);this.pos.y=tk.groundY(this.pos.x,this.pos.z);this.yaw=rnd(0,6.28);this.wait=rnd(0,3);this.ph=0;this.mv=0;this.diet=[SP[key].diet];}
 headPos(){return V(this.pos.x+Math.cos(this.yaw)*this.len*.45,this.pos.y,this.pos.z+Math.sin(this.yaw)*this.len*.45);}
 update(dt,t){if(this.wait>0)this.wait-=dt;let tg=null;const it=this.entry.hunger<85&&this.tk.tfood?this.tk.tfood.nearest(this.headPos(),this.diet):null;if(it){this.it=it;tg=it.pos;}else{this.it=null;if(this.wait<=0){if(!this.wp)this.wp=freePt(this.tk,this.tk.walk,true);tg=this.wp;}}
  let mv=0;if(tg){const dx=tg.x-this.pos.x,dz=tg.z-this.pos.z,d=Math.hypot(dx,dz);if(!this.it&&d<.03){this.wp=null;this.wait=rnd(...this.o.wait);}else{const w=Math.atan2(dz,dx);this.yaw=turnTo(this.yaw,w,2.2*dt);mv=Math.abs(angDiff(this.yaw,w))<1.2?1:.3;
   const sp=this.o.speed*(this.it?1.4:1)*mv*dt;this.pos.x+=Math.cos(this.yaw)*sp;this.pos.z+=Math.sin(this.yaw)*sp;this.tk.walk.clampPoint(this.pos,this.pos);if(pushSolids(this.tk,this.pos,this.len*.2,true))this.wp=null;this.ph+=sp/(this.len*.06);
   if(this.it){const h=this.headPos();if(Math.hypot(h.x-this.it.pos.x,h.z-this.it.pos.z)<.03){if(this.tk.tfood.consume(this.it))feedEntry(this.entry,18);this.it=null;}}}}
  this.mv+=(mv-this.mv)*Math.min(1,dt*6);this.pos.y=this.tk.groundY(this.pos.x,this.pos.z);this.g.position.copy(this.pos);this.g.rotation.set(0,-this.yaw,0);
  for(const l of this.M.legs){const off=((this.M.legs.indexOf(l)%2)?Math.PI:0);const s=Math.sin(this.ph*3+off);l.rotation.y=s*.4*this.mv*l.userData.side;l.rotation.x=l.userData.side*Math.max(0,Math.cos(this.ph*3+off))*.3*this.mv;}
  const P=this.M.parts;if(P.tail)P.tail.forEach((s,i)=>s.position.y+=Math.sin(t*1.5+i)*.00005);if(P.seg)P.seg.forEach((s,i)=>{s.position.z=Math.sin(this.ph*.8-i*.5)*.006*this.mv;s.position.y=.014+Math.max(0,Math.sin(t*2-i))*.001;});
  if(P.iso)P.iso.forEach((b,i)=>{b.position.x+=Math.cos(t*.7+i*2)*.0004*this.mv;b.rotation.y+=Math.sin(t+i)*.004;});
  if(this.key==='mantis'||this.key==='stick')this.g.rotation.z=Math.sin(t*1.3+this.entry.id)*.04;
  if(P.m){const on=UVON||window.__night;P.m.emissive.set(on?0x10ffd0:0x000000);P.m.emissiveIntensity=on?.55:0;}}
 pickPos(){return V(this.pos.x,this.pos.y+.03,this.pos.z);}
 dispose(){this.tk.group.remove(this.g);}}
for(const k of['scorp','tarant','beetle','stag','mantis','stick','milli','isopod'])MAKE[k]=(tk,e)=>new Bug(tk,e,k);
const seaBug=(k,len,sp)=>(tk,e)=>{const M=bugMesh(k,e);M.g.traverse(o=>{if(o.isMesh)o.material=patch(o.material.clone(),{tank:tk});});const b=tk.box;const box=new THREE.Box3(V(b.min.x+.1,b.min.y,b.min.z+.1),V(b.max.x-.1,b.min.y+.02,b.max.z-.1));
 const a=new Agent(M.g,tk,e,{speed:sp,turn:.8,pitchMax:0,reach:.25,box,wait:[4,14],nose:len*.5,eatR:.06,fill:15});const up=a.update.bind(a);a.update=(dt,t)=>{up(dt,t);M.legs.forEach((l,i)=>{l.rotation.y=Math.sin(t*4+i)*.25*l.userData.side;});M.g.rotation.x=0;M.g.rotation.z=0;};return a;};
MAKE.giso=seaBug('giso',.35,.04);MAKE.hcrab=seaBug('hcrab',.5,.05);
/* ---- 3D：展館 ---- */
(function(){const wall=scene.children.find(m=>m.isMesh&&Math.abs(m.position.x+36.15)<.01&&Math.abs(m.position.z-28)<.01&&m.geometry.parameters&&m.geometry.parameters.depth===16);
 const sand=wall?wall.material:new THREE.MeshStandardMaterial({color:C(0x7a6248),roughness:.9});if(wall)scene.remove(wall);
 box(.3,5,1.4,sand,-36.15,2.5,20.7);box(.3,5,12.6,sand,-36.15,2.5,29.7);box(.3,2,2,sand,-36.15,4,22.4);
 for(const [w,h,y,x0] of[[.08,1.2,.6,-35.96],[.1,.08,1.22,-35.94]]){const m=scene.children.find(o=>o.isMesh&&Math.abs(o.position.x-x0)<.005&&Math.abs(o.position.y-y)<.005&&Math.abs(o.position.z-28)<.01&&o.geometry.parameters&&o.geometry.parameters.depth===16);if(m){const mt=m.material;scene.remove(m);box(w,h,1.4,mt,x0,y,20.7);box(w,h,12.6,mt,x0,y,29.7);}}
 const jamb=new THREE.MeshStandardMaterial({color:C(0x2a2a30),roughness:.6});box(.5,3,.12,jamb,-36.15,1.5,21.36);box(.5,3,.12,jamb,-36.15,1.5,23.44);box(.5,.12,2.2,jamb,-36.15,3,22.4);
 const fl=add(new THREE.PlaneGeometry(16,16),new THREE.MeshStandardMaterial({color:C(0x6a625a),roughness:.85,normalMap:rep(scaleN,8,8),normalScale:new THREE.Vector2(.2,.2)}),-44.2,0,28);fl.rotation.x=-Math.PI/2;
 const dark=new THREE.MeshStandardMaterial({color:C(0x4a4652),roughness:.9});box(.3,5,16.6,dark,-52.3,2.5,28);box(16.3,5,.3,dark,-44.2,2.5,36.15);box(16.3,5,.3,dark,-44.2,2.5,19.85);
 const cl=add(new THREE.PlaneGeometry(16,16),new THREE.MeshStandardMaterial({color:C(0x2a2830),roughness:1}),-44.2,5,28);cl.rotation.x=Math.PI/2;
 for(const [x,z] of[[-48,24],[-48,32],[-41,24],[-41,32],[-44.5,28]]){glow(x,4.3,z,1.8,0xe8f4ff,.7);box(1.2,.05,.4,new THREE.MeshBasicMaterial({color:C(0xffffff)}),x,4.95,z);}
 const al=new THREE.PointLight(C(0xfff4e8),1.1,18,1.6);al.position.set(-44,4.2,28);scene.add(al);
 const sg=add(new THREE.PlaneGeometry(4,.9),new THREE.MeshBasicMaterial({map:vText([['🕷 節肢動物館',64,.42],['ARTHROPODS・地球上 80% 的動物都是節肢動物',26,.8,'#9fffd8']],720,160,'#101418','#ffffff')}),-36.35,3.9,28,scene);sg.rotation.y=-Math.PI/2;
 const sg2=add(new THREE.PlaneGeometry(1.8,.4),new THREE.MeshBasicMaterial({map:vText([['🕷 節肢動物館 →',44,.5]],512,110,'#101418','#9fffd8')}),-35.98,3.3,22.4,scene);sg2.rotation.y=Math.PI/2;
 /* 中央：紫外線展示台 */
 const isl=new THREE.Group();isl.position.set(-44,0,28);scene.add(isl);box(2.2,.9,1.4,dark,0,.45,0,isl);const uvl=add(new THREE.BoxGeometry(2,.05,.08),new THREE.MeshBasicMaterial({color:C(0x7a3aff)}),0,1.7,0,isl);box(.06,.8,.06,dark,-.95,1.3,0,isl);box(.06,.8,.06,dark,.95,1.3,0,isl);
 const sc=bugMesh('scorp',{g:{m:'n'}});sc.g.scale.setScalar(4);sc.g.position.set(0,.9,0);isl.add(sc.g);const pl=add(new THREE.PlaneGeometry(1.8,.5),new THREE.MeshBasicMaterial({map:vText([['🔦 紫外線燈',40,.35],['點我開關',28,.75,'#c8a8ff']],420,120,'#141018','#ffffff')}),0,.6,.71,isl);
 STATIONS.push({p:V(-44,1.1,28.6),fn:()=>{UVON=!UVON;uvl.material.color.set(UVON?0xc8a0ff:0x3a2a5a);toast(UVON?'🔦 開啟紫外線燈：蠍子的外骨骼發出藍綠色螢光！外骨骼裡的「β-咔啉」會吸收紫外線再發出可見光。':'🔦 關掉紫外線燈',5200);}});
 globalAnims.push((dt,t)=>{const on=UVON||window.__night;sc.parts.m.emissive.set(on?0x10ffd0:0x000000);sc.parts.m.emissiveIntensity=on?.6:0;});
 OBST.push([-45.3,-42.7,27.1,28.9]);AREAS.push([-51.6,-36.6,20.4,35.6],[-36.9,-35.3,21.6,23.2]);
 /* 展缸位置 */
 const NS=[{id:'a1',sz:'L',wall:V(-52,0,28),f:V(1,0,0)},{id:'a2',sz:'M',wall:V(-47.5,0,36),f:V(0,0,-1)},{id:'a3',sz:'M',wall:V(-41,0,36),f:V(0,0,-1)},
  {id:'a4',sz:'S',wall:V(-49,0,20),f:V(0,0,1)},{id:'a5',sz:'S',wall:V(-45.5,0,20),f:V(0,0,1)},{id:'a6',sz:'M',wall:V(-41,0,20),f:V(0,0,1)}];for(const s of NS){computeSlot(s);SLOTS.push(s);}
 MAPX[0]=-54;DEST.push({n:'節肢動物館',r:[-52,-36,20,36],to:[-38,0,28,Math.PI/2]});})();
/* 館藏提示 */
setTimeout(()=>{if(loaded&&!(S.flags&&S.flags.arth)){S.flags=S.flags||{};S.flags.arth=1;markDirty();toast('🕷 新展館開放：從爬蟲館西邊的門走進「節肢動物館」，有蠍子、狼蛛、獨角仙、鱟…',6000);}},6000);

