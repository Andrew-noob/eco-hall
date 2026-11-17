/* ===== p.js：小魚放大顯示、水母餵食與繁殖、養大賣出 ===== */
/* ---------- 小魚放大顯示（卡片上的長度仍是真實尺寸） ---------- */
const vBoost=k=>{const p=SP[k];if(!p||(S.vb===false))return 1;const ht=HT[p.hab];if(!ht||!ht.aqua||p.hab==='jelly')return 1;return clamp(Math.sqrt(.2/(p.len||.2)),1,2.2);};
const _as2=applySize;applySize=function(c){_as2(c);if(c.root&&c.entry&&!(c instanceof School))c.root.scale.multiplyScalar(vBoost(c.entry.sp));};
for(const k in MAKE){if(!SP[k]||!SP[k].school)continue;const f0=MAKE[k];MAKE[k]=(tk,e)=>{const c=f0(tk,e),b=vBoost(k);if(b>1&&c.mesh&&c.mesh.isInstancedMesh){c.mesh.geometry=c.mesh.geometry.clone().scale(b,b,b);}return c;};}
function toggleVB(){S.vb=S.vb===false;markDirty();for(const id in TANKS){const tk=TANKS[id];for(const c of tk.creatures.slice())respawn(tk,c.entry);}toast(S.vb===false?'🔍 小魚放大：關（真實比例）':'🔍 小魚放大：開',2200);}
const _ms0=mapSheet;mapSheet=function(){_ms0();const c=$('#shC'),b=document.createElement('button');b.className='btn';b.style.cssText='width:100%;margin-top:10px';b.textContent=`🔍 小魚放大顯示：${S.vb===false?'關（真實比例）':'開'}`;b.onclick=()=>{toggleVB();mapSheet();};c.appendChild(b);};
/* ---------- 水母：餵食時直接吃到浮游生物，才能長大、繁殖 ---------- */
const _fd9=feed;feed=function(tk){_fd9(tk);if(tk.st.type!=='jelly')return;for(const c of tk.creatures){const e=c.entry;if(e.hunger<95){e.hunger=Math.min(100,e.hunger+60);e.fed=(e.fed||0)+1;e.mood=Math.min(100,(e.mood||60)+8);}if(c.bell){c.bell.material.emissiveIntensity*=1.4;setTimeout(()=>{if(c.bell)c.bell.material.emissiveIntensity/=1.4;},1500);}}markDirty();toast('🪼 水母吃到豐年蝦了');};
Object.assign(BR.moon,{p:.3});Object.assign(BR.nettle,{p:.22});
/* ---------- 養大賣出：價格隨成長、心情、好感提升 ---------- */
const _up8=updPick;updPick=function(){_up8();if(!sel)return;const b=$('#pSell');if(!b.dataset.c)b.textContent=`賣 ${fmt$(sellPrice(sel.entry))}`;};
function sellAnimal(tk,e){const v=sellPrice(e);const cr=tk.creatures.find(k=>k.entry===e);if(cr){if(typeof GLO!=='undefined')GLO.delete(cr);cr.dispose();tk.creatures.splice(tk.creatures.indexOf(cr),1);}
 tk.st.animals.splice(tk.st.animals.indexOf(e),1);logEv(tk.st,`${e.name} 賣出（${fmt$(v)}）`);earn(v);refreshChips();if(sel&&sel.entry===e){$('#pick').style.display='none';sel=null;}return v;}
const _wh8=whSheet;whSheet=function(){_wh8();const L=[];for(const id in TANKS){const tk=TANKS[id];for(const e of tk.st.animals)if(SP[e.sp].school||e.size>=.9)L.push({tk,e,v:sellPrice(e)});}L.sort((a,b)=>b.v-a.v);
 const c=$('#shC'),d=document.createElement('div');d.innerHTML=`<h4>💰 收購站：已長大的動物</h4><div class="mut sm">越大、越開心、越親人的動物賣得越貴；突變色和巨型個體價格更高。</div>`+(L.length?L.slice(0,40).map((x,i)=>`<div class="row2"><span>${esc(x.e.name)} <span class="mut sm">${esc(tName(x.tk))}${gTag(x.e)?'・'+gTag(x.e):''}</span></span><button class="btn sm" data-sa="${i}">賣 ${fmt$(x.v)}</button></div>`).join(''):'<div class="mut sm">目前沒有已長大的動物。</div>');
 c.appendChild(d);d.querySelectorAll('[data-sa]').forEach(b=>b.onclick=()=>{const x=L[+b.dataset.sa];if(!b.dataset.c){b.dataset.c=1;b.textContent='確認賣出';return;}const v=sellAnimal(x.tk,x.e);toast(`💰 賣出 ${x.e.name}，獲得 ${fmt$(v)}`);whSheet();});};

