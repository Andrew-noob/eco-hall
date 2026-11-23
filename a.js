/* ===== a.js：核心工具、渲染器、著色器、貼圖 ===== */
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const C=h=>new THREE.Color(h).convertSRGBToLinear();
const F=(a,n)=>new THREE.Float32BufferAttribute(a,n);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const angDiff=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const turnTo=(a,b,m)=>a+clamp(angDiff(a,b),-m,m);
const nz=(x,y,z)=>Math.sin(x*1.7+Math.sin(z*1.3))*.5+Math.sin(z*2.9+y*1.1+x*.7)*.3+Math.sin((x-z+y)*4.3)*.2;
const sstep=t=>t*t*(3-2*t);

const canvas=$('#c');
/* 錯誤紀錄：某個功能出錯時只跳過它，不讓整個畫面當掉（地圖 → 畫質 可以看到紀錄） */
const ERRS=(()=>{try{return JSON.parse(localStorage.getItem('eh-err')||'[]').map(e=>Object.assign(e,{old:1}));}catch(e){return [];}})();
function errLog(e,w){try{const m=String((e&&e.message)||e).slice(0,140),st=String((e&&e.stack)||'').split('\n').slice(1,3).map(x=>x.trim().replace(/^at /,'').replace(/\(?https?:\/\/[^\s)]*\/([^\/\s)]+)\)?/,'$1')).join(' ← ').slice(0,160),k=m+'|'+st;
 const f=ERRS.find(x=>x.k===k&&!x.old);if(f){f.n++;return;}ERRS.push({k,m,st,w:w||'',n:1,t:Date.now()});while(ERRS.length>10)ERRS.shift();try{localStorage.setItem('eh-err',JSON.stringify(ERRS.slice(-8)));}catch(_){}console.warn('[生態館]',w,e);}catch(_){}}
addEventListener('error',ev=>errLog(ev.error||ev.message,'win'));addEventListener('unhandledrejection',ev=>errLog(ev.reason,'async'));
const renderer=new THREE.WebGLRenderer({canvas,antialias:(()=>{try{return localStorage.getItem('eh-q')!=='low';}catch(e){return true;}})(),powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene();scene.background=C(0x05080b);
const camera=new THREE.PerspectiveCamera(70,1,.015,160);

function ctex(w,h,draw,srgb=true){const cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);const t=new THREE.CanvasTexture(cv);if(srgb)t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function rep(tex,x,y){const t=tex.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(x,y);return t;}

/* 環境反射（讓玻璃、濕皮膚、魚鱗有光澤） */
(function(){const pm=new THREE.PMREMGenerator(renderer);const es=new THREE.Scene();
 const sky=ctex(16,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#b9cfe0');g.addColorStop(.45,'#4a5a66');g.addColorStop(.55,'#2a2a28');g.addColorStop(1,'#120f0c');x.fillStyle=g;x.fillRect(0,0,w,h);});
 es.add(new THREE.Mesh(new THREE.SphereGeometry(10,32,16),new THREE.MeshBasicMaterial({map:sky,side:THREE.BackSide})));
 const pm2=new THREE.MeshBasicMaterial({color:new THREE.Color(4,4,3.6)});
 for(const [x,z] of[[-3,-2],[3,-2],[0,3]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1),pm2);p.position.set(x,9,z);p.rotation.x=Math.PI/2;es.add(p);}
 const pb=new THREE.Mesh(new THREE.PlaneGeometry(6,3),new THREE.MeshBasicMaterial({color:new THREE.Color(.4,1.2,2.2)}));pb.position.set(0,3,-9.5);es.add(pb);
 scene.environment=pm.fromScene(es,.04).texture;})();

const hemi=new THREE.HemisphereLight(C(0xbfd8ff),C(0x2a2420),.3);scene.add(hemi);
const sunL=new THREE.DirectionalLight(0xffffff,.85);sunL.position.set(3,10,4);scene.add(sunL);
const warm=new THREE.PointLight(C(0xffd2a0),.9,22,1.5);warm.position.set(0,4,8);scene.add(warm);
const blue=new THREE.PointLight(C(0x3fa0ff),2.2,24,1.4);blue.position.set(0,4,-17);scene.add(blue);

/* ===== 著色器：水色深度、游動彎曲、拍翅、搖曳 ===== */
const T={value:0};
function patch(mat,o){const tk=o.tank;const U={sw:{value:new THREE.Vector4(...(o.swim?[o.swim.amp,o.swim.k,o.swim.spd,0]:[0,0,0,0]))},sw2:{value:new THREE.Vector2(...(o.swim?[o.swim.nose,o.swim.len]:[0,1]))},
  fl:{value:new THREE.Vector3(...(o.flap?[o.flap.amp,o.flap.spd,o.flap.span]:[0,0,1]))},sy:{value:new THREE.Vector2(...(o.sway?[o.sway.amp,o.sway.spd]:[0,0]))}};
 mat.userData.U=U;
 mat.onBeforeCompile=sh=>{sh.uniforms.uTime=T;sh.uniforms.uSw=U.sw;sh.uniforms.uSw2=U.sw2;sh.uniforms.uFl=U.fl;sh.uniforms.uSy=U.sy;
  if(tk&&tk.u)Object.assign(sh.uniforms,{uMode:tk.u.mode,uCyl:tk.u.cyl,uN:tk.u.n,uD:tk.u.d,uWC:tk.u.wc,uDen:tk.u.den,uTop:tk.u.top,uDepth:tk.u.depth,uDeep:tk.u.deep});
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;uniform float uTime;uniform vec4 uSw;uniform vec2 uSw2;uniform vec3 uFl;uniform vec2 uSy;')
  .replace('#include <begin_vertex>',`#include <begin_vertex>
   float ph=modelMatrix[3].x*1.7+modelMatrix[3].z*2.3;
   #ifdef USE_INSTANCING
    ph+=instanceMatrix[3].x*1.7+instanceMatrix[3].z*2.3+instanceMatrix[3].y*3.1;
   #endif
   #ifdef SWIM
    float bt=clamp((uSw2.x-transformed.x)/uSw2.y,0.,1.);
    transformed.z+=uSw.x*bt*bt*sin(transformed.x*uSw.y+uTime*uSw.z+ph+uSw.w);
   #endif
   #ifdef FLAP
    float az=abs(transformed.z)/uFl.z;
    transformed.y+=uFl.x*pow(az,1.6)*sin(uTime*uFl.y+ph-az*1.2);
   #endif
   #ifdef SWAY
    float yy=abs(transformed.y);
    transformed.x+=uSy.x*yy*yy*sin(uTime*uSy.y+ph+yy*3.);
    transformed.z+=uSy.x*yy*yy*cos(uTime*uSy.y*.8+ph+yy*2.);
   #endif`)
  .replace('#include <project_vertex>',`#include <project_vertex>
   #ifdef USE_INSTANCING
    vWP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;
   #else
    vWP=(modelMatrix*vec4(transformed,1.)).xyz;
   #endif`);
  if(tk&&tk.u)sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;uniform float uMode;uniform vec3 uCyl;uniform vec3 uN;uniform float uD;uniform vec3 uWC;uniform float uDen;uniform float uTop;uniform float uDepth;uniform float uDeep;')
  .replace('#include <tonemapping_fragment>',`
   vec3 wd=vWP-cameraPosition;float wl=length(wd);float wn=dot(uN,wd);
   float tE=abs(wn)>1e-4?clamp((uD-dot(uN,cameraPosition))/wn,0.,1.):0.;
   if(uMode>.5){vec2 co=cameraPosition.yz-uCyl.xy;vec2 cd=wd.yz;float qa=dot(cd,cd),qb=2.*dot(co,cd),qc=dot(co,co)-uCyl.z*uCyl.z;float disc=qb*qb-4.*qa*qc;tE=(qa>1e-6&&disc>0.)?clamp((-qb+sqrt(disc))/(2.*qa),0.,1.):0.;}
   if(cameraPosition.y>uTop&&vWP.y<uTop){tE=max(tE,(cameraPosition.y-uTop)/max(cameraPosition.y-vWP.y,1e-3));}
   if(vWP.y<=uTop+.03){gl_FragColor.rgb*=mix(1.,uDeep,clamp((uTop-vWP.y)/uDepth,0.,1.));
   gl_FragColor.rgb=mix(gl_FragColor.rgb,uWC,1.-exp(-(1.-tE)*wl*uDen));}
   #include <tonemapping_fragment>`);};
 const def={};if(o.swim)def.SWIM='';if(o.flap)def.FLAP='';if(o.sway)def.SWAY='';mat.defines=Object.assign({},mat.defines||{},def);
 mat.customProgramCacheKey=()=>((tk&&tk.u)?'T':'')+(o.swim?'S':'')+(o.flap?'F':'')+(o.sway?'W':'');return mat;}
function mat(tk,c,o={},fx={}){return patch(new THREE.MeshStandardMaterial(Object.assign({color:C(c),roughness:.8},o)),Object.assign({tank:tk},fx));}
function pmat(tk,c,o={},fx={}){return patch(new THREE.MeshPhysicalMaterial(Object.assign({color:C(c),roughness:.5},o)),Object.assign({tank:tk},fx));}
function add(geo,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);parent.add(o);return o;}

/* ===== 幾何工具 ===== */
function prim(g,col,uv){g=g.index?g.toNonIndexed():g;const n=g.attributes.position.count,c=new Float32Array(n*3);for(let i=0;i<n;i++){c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;}g.setAttribute('color',new THREE.BufferAttribute(c,3));
 if(uv||!g.attributes.uv){const u=new Float32Array(n*2);for(let i=0;i<n;i++){u[i*2]=uv?uv[0]:.5;u[i*2+1]=uv?uv[1]:.5;}g.setAttribute('uv',new THREE.BufferAttribute(u,2));}return g;}
function colorize(g,fn){g=g.index?g.toNonIndexed():g;const p=g.attributes.position,c=[],t=new THREE.Color();for(let i=0;i<p.count;i++){fn(t,p.getX(i),p.getY(i),p.getZ(i));c.push(t.r,t.g,t.b);}g.setAttribute('color',F(c,3));if(!g.attributes.uv)g.setAttribute('uv',F(new Array(p.count*2).fill(.5),2));return g;}
function merge(gs){let n=0;gs.forEach(g=>n+=g.attributes.position.count);const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2),Cc=new Float32Array(n*3);let o=0;
 for(const g of gs){const c=g.attributes.position.count;P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);U.set(g.attributes.uv.array,o*2);Cc.set(g.attributes.color.array,o*3);o+=c;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('uv',new THREE.BufferAttribute(U,2));g.setAttribute('color',new THREE.BufferAttribute(Cc,3));return g;}
function loft(len,prof,colFn,seg=32,rad=12){const P=[],U=[],Cc=[],I=[],c=new THREE.Color();
 for(let i=0;i<=seg;i++){const t=i/seg,x=len/2-t*len,[hr,wr,yo=0]=prof(t);
  for(let j=0;j<=rad;j++){const a=j/rad*Math.PI*2,y=hr*Math.cos(a)+yo,z=wr*Math.sin(a);P.push(x,y,z);U.push(t,j/rad);colFn(c,t,a,x,y,z);Cc.push(c.r,c.g,c.b);}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;I.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',F(P,3));g.setAttribute('uv',F(U,2));g.setAttribute('color',F(Cc,3));g.setIndex(I);g.computeVertexNormals();return g.toNonIndexed();}
/* 關鍵點輪廓：keys=[[t,h,w,yOff],...] 平滑內插 */
function keyProf(keys){return t=>{for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(t>=a[0]&&t<=b[0]){const k=sstep((t-a[0])/(b[0]-a[0]||1));return[lerp(a[1],b[1],k),lerp(a[2],b[2],k),lerp(a[3]||0,b[3]||0,k)];}}const l=keys[keys.length-1];return[l[1],l[2],l[3]||0];};}
function fin(pts,cols,uv=[.5,.5]){const P=[],Cc=[],U=[];for(let k=1;k<pts.length-1;k++)for(const q of[0,k,k+1]){P.push(...pts[q]);const c=cols[q]||cols[cols.length-1];Cc.push(c.r,c.g,c.b);U.push(...uv);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',F(P,3));g.setAttribute('color',F(Cc,3));g.setAttribute('uv',F(U,2));g.computeVertexNormals();return g;}
const fusi=(H,W,p=.3,tr=.12,bl=.5)=>t=>{const f=t<p?Math.pow(t/p,bl):1-Math.pow((t-p)/(1-p),1.5)*(1-tr);return[H*f,W*f];};
function caudal(xb,hb,L,H,fork,cols,uv){return fin([[xb,0,0],[xb,hb,0],[xb-L,H,0],[xb-L*fork,0,0],[xb-L,-H*.9,0],[xb,-hb,0]],cols,uv);}
function pecs(x1,x2,xt,y,z,span,drop,cols,uv){return[fin([[x1,y,z],[x2,y,z],[xt,y-drop,z+span]],cols,uv),fin([[x1,y,-z],[x2,y,-z],[xt,y-drop,-z-span]],cols,uv)];}
function eyes(x,y,z,r,col=C(0xcfc6a8),uv){const o=[];for(const s of[1,-1]){o.push(prim(new THREE.SphereGeometry(r,14,10).translate(x,y,s*z),col,uv),prim(new THREE.SphereGeometry(r*.6,10,8).translate(x+r*.18,y+r*.05,s*(z+r*.48)),C(0x020202),uv));}return o;}
function cylBetween(a,b,r1,r2,seg=6){const d=new THREE.Vector3().subVectors(b,a),len=d.length();const g=new THREE.CylinderGeometry(r2,r1,len,seg);
 g.applyMatrix4(new THREE.Matrix4().compose(a.clone().addScaledVector(d,.5),new THREE.Quaternion().setFromUnitVectors(V(0,1,0),d.normalize()),V(1,1,1)));return g;}
/* 沿曲線的變粗細管（蛇、捲尾、樹枝） */
function tubeFill(pos,pts,rads,rad){const n=pts.length;let N0=V(0,1,0),prevT=null;const T0=V(0,0,0),B=V(0,0,0),Nn=V(0,0,0);let q=0;
 for(let i=0;i<n;i++){const p=pts[i];T0.subVectors(pts[Math.min(n-1,i+1)],pts[Math.max(0,i-1)]).normalize();
  if(prevT){const ax=V(0,0,0).crossVectors(prevT,T0);const s=ax.length();if(s>1e-6){ax.normalize();N0.applyAxisAngle(ax,Math.asin(clamp(s,-1,1)));}}else{N0=Math.abs(T0.y)>.9?V(1,0,0):V(0,1,0);N0.sub(T0.clone().multiplyScalar(N0.dot(T0))).normalize();}
  prevT=T0.clone();B.crossVectors(T0,N0).normalize();Nn.crossVectors(B,T0).normalize();N0.copy(Nn);
  for(let j=0;j<=rad;j++){const a=j/rad*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),r=rads[i];pos[q++]=p.x+(Nn.x*ca+B.x*sa)*r;pos[q++]=p.y+(Nn.y*ca+B.y*sa)*r;pos[q++]=p.z+(Nn.z*ca+B.z*sa)*r;}}}
function tubeGeo(pts,rads,rad,colFn){const n=pts.length,pos=new Float32Array(n*(rad+1)*3),U=[],Cc=[],I=[],c=new THREE.Color();tubeFill(pos,pts,rads,rad);
 for(let i=0;i<n;i++)for(let j=0;j<=rad;j++){U.push(i/(n-1),j/rad);colFn(c,i/(n-1),j/rad*Math.PI*2);Cc.push(c.r,c.g,c.b);}
 for(let i=0;i<n-1;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;I.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',F(U,2));g.setAttribute('color',F(Cc,3));g.setIndex(I);g.computeVertexNormals();return g;}

/* ===== 貼圖 ===== */
const causticTex=(()=>{const s=256,cv=document.createElement('canvas');cv.width=cv.height=s;const x=cv.getContext('2d'),im=x.createImageData(s,s);
 for(let j=0;j<s;j++)for(let i=0;i<s;i++){const u=i/s*Math.PI*2,v=j/s*Math.PI*2;let w=0;
  for(const[a,b,c,d]of[[3,2,1,5],[2,-3,4,1],[5,1,-2,3],[-4,3,3,-2]])w+=Math.pow(1-Math.abs(Math.sin(a*u+b*v+Math.sin(c*u+d*v)*1.4)),9);
  const k=Math.min(255,w*210),q=(j*s+i)*4;im.data[q]=im.data[q+1]=im.data[q+2]=k;im.data[q+3]=255;}
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})();
/* 鱗片法線貼圖 */
const scaleN=(()=>{const s=256,cw=32,ch=32,cv=document.createElement('canvas');cv.width=cv.height=s;const x=cv.getContext('2d'),im=x.createImageData(s,s),H=new Float32Array(s*s);
 for(let j=0;j<s;j++)for(let i=0;i<s;i++){let best=1e9;const row=Math.floor(j/ch);for(let r=row-1;r<=row+1;r++){const off=((r%2)+2)%2*cw/2;const col=Math.floor((i-off)/cw);for(let c=col-1;c<=col+1;c++){const cx=c*cw+off+cw/2,cy=r*ch+ch/2;const d=Math.hypot((i-cx)/cw,(j-cy)/ch*1.15);if(d<best)best=d;}}
  H[j*s+i]=Math.max(0,1-best*1.55);}
 for(let j=0;j<s;j++)for(let i=0;i<s;i++){const hx=H[j*s+(i+1)%s]-H[j*s+(i-1+s)%s],hy=H[((j+1)%s)*s+i]-H[((j-1+s)%s)*s+i];const nx=-hx*3,ny=-hy*3,l=Math.hypot(nx,ny,1),q=(j*s+i)*4;
  im.data[q]=(nx/l*.5+.5)*255;im.data[q+1]=(ny/l*.5+.5)*255;im.data[q+2]=(1/l*.5+.5)*255;im.data[q+3]=255;}
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})();
const rayTex=ctex(64,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
 const g2=x.createLinearGradient(0,0,w,0);g2.addColorStop(0,'rgba(0,0,0,1)');g2.addColorStop(.5,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(0,0,0,1)');x.globalCompositeOperation='destination-out';x.fillStyle=g2;x.fillRect(0,0,w,h);});
const blobTex=ctex(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});
const glowTex=ctex(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,220,170,.9)');g.addColorStop(1,'rgba(255,160,80,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});
const woodTex=ctex(512,512,(x,w,h)=>{for(let i=0;i<8;i++){const y=i*h/8;x.fillStyle=`hsl(26,${32+rnd(-4,4)}%,${26+rnd(-4,4)}%)`;x.fillRect(0,y,w,h/8);
 for(let k=0;k<40;k++){x.strokeStyle=`rgba(0,0,0,${rnd(.03,.08)})`;x.beginPath();const yy=y+rnd(2,h/8-2);x.moveTo(0,yy);x.bezierCurveTo(w*.3,yy+rnd(-3,3),w*.6,yy+rnd(-3,3),w,yy);x.stroke();}
 x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,y,w,2);x.fillRect(rnd(.2,.8)*w,y,2,h/8);}});
woodTex.wrapS=woodTex.wrapT=THREE.RepeatWrapping;woodTex.repeat.set(5,3.5);
const meshTex=ctex(64,64,(x,w,h)=>{x.clearRect(0,0,w,h);x.strokeStyle='rgba(30,30,30,1)';x.lineWidth=3;for(let i=0;i<=w;i+=8){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke();}});
meshTex.wrapS=meshTex.wrapT=THREE.RepeatWrapping;
const whaleTex=ctex(1024,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);
 [[0,'#34444f'],[.3,'#42566a'],[.39,'#8a9ca9'],[.44,'#e5eaed'],[.56,'#e5eaed'],[.61,'#8a9ca9'],[.7,'#42566a'],[1,'#34444f']].forEach(s=>g.addColorStop(...s));
 x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle='rgba(222,230,234,.5)';
 for(let u=.21;u<.93;u+=.036){x.lineWidth=3;x.beginPath();x.moveTo(u*w,0);x.lineTo(u*w,h*.35);x.moveTo(u*w,h*.65);x.lineTo(u*w,h);x.stroke();}
 for(const v of[.08,.17,.26,.74,.83,.92]){x.lineWidth=2.5;x.beginPath();x.moveTo(.21*w,v*h);x.lineTo(.92*w,v*h);x.stroke();}
 x.fillStyle='rgba(236,241,242,.9)';
 for(let u=.03;u<.95;u+=.018)for(let v=.012;v<1;v+=.03){if(Math.abs(v-.5)<.13)continue;const sm=u<.21;if(!sm&&Math.random()<.3)continue;x.beginPath();x.arc(u*w+rnd(-3,3),v*h+rnd(-3,3),sm?rnd(1.6,2.6):rnd(3,5.5),0,7);x.fill();}
 x.strokeStyle='rgba(18,26,34,.65)';x.lineWidth=3;for(let i=0;i<5;i++){const X=(.15+i*.012)*w;x.beginPath();x.moveTo(X,h*.2);x.lineTo(X,h*.35);x.moveTo(X,h*.65);x.lineTo(X,h*.8);x.stroke();}
 x.fillStyle='#161c22';x.fillRect(0,h*.36,.022*w,h*.28);x.fillStyle='#34444f';x.fillRect(.97*w,0,.03*w,h);});
const jellyBg=ctex(32,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1d2f8a');g.addColorStop(.55,'#2a1252');g.addColorStop(1,'#07061a');x.fillStyle=g;x.fillRect(0,0,w,h);});
function textTex(lines,w=512,h=256,bg='rgba(8,18,26,.88)'){return ctex(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle='rgba(111,211,255,.7)';x.lineWidth=4;x.setLineDash([16,10]);x.strokeRect(6,6,w-12,h-12);
 x.textAlign='center';x.textBaseline='middle';lines.forEach(([t,sz,col],i)=>{x.fillStyle=col||'#dff4ff';x.font=`600 ${sz}px "PingFang TC","Noto Sans TC",sans-serif`;x.fillText(t,w/2,h*(i+1)/(lines.length+1));});});}

const glassM=new THREE.MeshPhysicalMaterial({color:C(0xe4f4ff),transparent:true,opacity:.08,roughness:.02,metalness:0,envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide});
const frameM=new THREE.MeshStandardMaterial({color:C(0x14181b),roughness:.35,metalness:.6});
const cabM=new THREE.MeshStandardMaterial({color:C(0x2a221c),roughness:.45});
const box=(w,h,d,m,x,y,z,p=scene)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);

const glowTex2=ctex(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});
const _gm={};function glow(x,y,z,sz,c=0xfff0d0,op=.7,p=scene){const k=c+'_'+op;const m=_gm[k]||(_gm[k]=new THREE.SpriteMaterial({map:glowTex2,color:C(c),transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));const sp=new THREE.Sprite(m);sp.position.set(x,y,z);sp.scale.set(sz,sz,1);p.add(sp);return sp;}
const marbleTex=ctex(512,512,(x,w,h)=>{x.fillStyle='#d9d4ca';x.fillRect(0,0,w,h);for(let i=0;i<40;i++){x.strokeStyle=`rgba(${rnd(90,140)|0},${rnd(90,130)|0},${rnd(90,120)|0},${rnd(.08,.25)})`;x.lineWidth=rnd(.5,2.5);x.beginPath();let px=rnd(0,w),py=rnd(0,h);x.moveTo(px,py);for(let k=0;k<12;k++){px+=rnd(-40,40);py+=rnd(-10,40);x.lineTo(px,py);}x.stroke();}
 x.strokeStyle='rgba(60,55,50,.35)';x.lineWidth=2;for(let i=0;i<=w;i+=128){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke();}});
marbleTex.wrapS=marbleTex.wrapT=THREE.RepeatWrapping;
const slateTex=ctex(512,512,(x,w,h)=>{for(let j=0;j<4;j++)for(let i=0;i<4;i++){const l=rnd(18,28);x.fillStyle=`hsl(25,${rnd(8,16)}%,${l}%)`;x.fillRect(i*128+2,j*128+2,124,124);for(let k=0;k<60;k++){x.fillStyle=`rgba(0,0,0,${rnd(.03,.1)})`;x.fillRect(i*128+rnd(0,124),j*128+rnd(0,124),rnd(2,14),rnd(1,4));}}x.fillStyle='#120d0a';});
slateTex.wrapS=slateTex.wrapT=THREE.RepeatWrapping;
function vText(lines,w,h,bg,fg){return ctex(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';lines.forEach(([t,sz,yy,col])=>{x.fillStyle=col||fg;x.font=`700 ${sz}px "PingFang TC","Noto Sans TC",sans-serif`;x.fillText(t,w/2,yy*h);});});}
