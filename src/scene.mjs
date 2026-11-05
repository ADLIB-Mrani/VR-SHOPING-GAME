import {PRODUCTS,CATEGORIES} from './catalog.mjs';

const NS='http://www.w3.org/1999/xhtml';
const E=(tag,attrs={},parent)=>{const node=document.createElement(tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));parent?.appendChild(node);return node};
const pos=(x,y,z)=>`${x} ${y} ${z}`;
const metal='metalness: .63; roughness: .27;';
function prim(root,tag,position,attrs={}){return E(tag,{position,...attrs},root)}
function box(root,x,y,z,w,h,d,color,extra={}){return prim(root,'a-box',pos(x,y,z),{width:w,height:h,depth:d,material:`color: ${color}; ${metal}`, ...extra})}
function sphere(root,x,y,z,r,color,extra={}){return prim(root,'a-sphere',pos(x,y,z),{radius:r,material:`color: ${color}; ${metal}`, ...extra})}
function cylinder(root,x,y,z,rad,h,color,extra={}){return prim(root,'a-cylinder',pos(x,y,z),{radius:rad,height:h,material:`color: ${color}; ${metal}`,...extra})}
function torus(root,x,y,z,rad,tube,color,extra={}){return prim(root,'a-torus',pos(x,y,z),{radius:rad,'radius-tubular':tube,material:`color: ${color}; ${metal}`,...extra})}
function line(root,a,b,color,opacity=.4){return E('a-entity',{line:`start: ${a}; end: ${b}; color: ${color}; opacity: ${opacity}`},root)}
const palette={electronics:['#91c2d6','#233948','#0c1a24'],clothing:['#d79eac','#76495d','#201a29'],home:['#d8b88b','#8f7153','#2c2723'],food:['#b4cba0','#54785e','#1f322c'],books:['#ad9ecd','#55536e','#242635'],sports:['#94c9c3','#3f7d80','#1e3437']};

/** Hand-built stylized 3D object models, not stock photos or remotely hosted meshes. */
function objectModel(parent,shape,colors){
 const [light,medium,dark]=colors;
 const add=(kind,p,a)=>prim(parent,kind,p,a);
 switch(shape){
  case 'audio':
   torus(parent,0,.22,0,.55,.105,dark,{rotation:'0 0 0'});box(parent,-.53,-.12,.02,.26,.55,.29,medium,{rotation:'0 0 9'});box(parent,.53,-.12,.02,.26,.55,.29,medium,{rotation:'0 0 -9'});sphere(parent,-.54,-.11,.19,.14,light);sphere(parent,.54,-.11,.19,.14,light);break;
  case 'phone':box(parent,0,0,0,.57,1.04,.09,dark);box(parent,0,0,.053,.49,.91,.009,light,{material:`color:${light}; metalness:.6; roughness:.1; emissive:${medium}; emissiveIntensity:.1`});sphere(parent,0,-.44,.065,.025,dark);break;
  case 'watch':cylinder(parent,0,0,0,.31,.15,dark,{rotation:'90 0 0'});box(parent,0,.43,0,.34,.48,.08,medium);box(parent,0,-.43,0,.34,.48,.08,medium);cylinder(parent,0,0,.105,.25,.02,light,{rotation:'90 0 0'});break;
  case 'laptop':box(parent,0,-.25,.20,1.25,.07,.78,light);box(parent,0,.19,-.17,1.18,.87,.055,dark,{rotation:'-15 0 0'});box(parent,0,.19,-.13,1.06,.72,.015,medium,{rotation:'-15 0 0'});break;
  case 'camera':box(parent,0,0,0,.94,.59,.40,dark);cylinder(parent,0,0,.24,.26,.17,light,{rotation:'90 0 0'});sphere(parent,0,0,.35,.13,dark);box(parent,-.27,.35,0,.3,.14,.3,medium);break;
  case 'jacket':box(parent,0,0,0,.83,.98,.23,medium);box(parent,-.55,.15,0,.25,.76,.23,medium,{rotation:'0 0 -16'});box(parent,.55,.15,0,.25,.76,.23,medium,{rotation:'0 0 16'});box(parent,0,.55,0,.35,.12,.25,light);box(parent,0,-.24,.13,.05,.65,.02,dark);break;
  case 'shoe':box(parent,.1,-.28,.12,1.15,.29,.47,medium);box(parent,-.26,-.02,-.04,.55,.45,.48,light,{rotation:'0 0 12'});box(parent,.15,-.46,.12,1.3,.1,.55,dark);break;
  case 'shirt':box(parent,0,.02,0,.75,.95,.11,light);box(parent,-.54,.29,0,.37,.31,.13,light,{rotation:'0 0 -18'});box(parent,.54,.29,0,.37,.31,.13,light,{rotation:'0 0 18'});torus(parent,0,.47,.08,.12,.03,dark);break;
  case 'bag':box(parent,0,-.12,0,.93,.74,.36,medium);torus(parent,0,.31,0,.31,.055,dark);box(parent,0,-.04,.2,.29,.2,.02,light);break;
  case 'cap':sphere(parent,0,.14,0,.45,medium,{scale:'1 .55 1'});box(parent,0,-.1,.35,.79,.045,.38,dark);break;
  case 'lamp':cylinder(parent,0,-.35,0,.27,.06,dark);cylinder(parent,0,.12,0,.045,.95,medium);add('a-cone',pos(0,.53,0),{'radius-bottom':.45,'radius-top':.15,height:.57,material:`color:${light}; side:double; emissive:${light}; emissiveIntensity:.22`});sphere(parent,0,.36,0,.12,'#ffeac5',{material:'color:#ffeac5; emissive:#ffcf87; emissiveIntensity:.7'});break;
  case 'vase':cylinder(parent,0,-.2,0,.33,.66,medium,{'radius-top':.24,'radius-bottom':.4});cylinder(parent,0,.25,0,.2,.27,light);torus(parent,0,.38,0,.195,.035,dark,{rotation:'90 0 0'});break;
  case 'chair':box(parent,0,-.32,0,.9,.20,.8,medium);box(parent,0,.19,-.34,.9,.9,.17,medium);for(const x of [-.35,.35])for(const z of [-.3,.3])box(parent,x,-.67,z,.08,.51,.08,dark);break;
  case 'candle':cylinder(parent,0,-.2,0,.31,.58,light);cylinder(parent,0,.11,0,.32,.03,medium);box(parent,0,.21,0,.023,.19,.023,dark);sphere(parent,0,.32,0,.055,'#facf74',{material:'color:#facf74; emissive:#f9b448; emissiveIntensity:.8'});break;
  case 'clock':cylinder(parent,0,0,0,.48,.12,medium,{rotation:'90 0 0'});cylinder(parent,0,0,.08,.4,.01,light,{rotation:'90 0 0'});box(parent,0,.09,.105,.025,.28,.026,dark);box(parent,.10,-.04,.105,.21,.02,.025,dark,{rotation:'0 0 -25'});break;
  case 'coffee':box(parent,0,0,0,.62,.94,.40,medium);box(parent,0,.14,.22,.41,.32,.02,light);cylinder(parent,0,.49,0,.33,.07,dark);break;
  case 'chocolate':box(parent,0,0,0,.97,.62,.17,medium);for(let x of [-.27,0,.27])for(let y of [-.17,.17])box(parent,x,y,.12,.23,.28,.025,dark);break;
  case 'matcha':cylinder(parent,0,-.14,0,.43,.45,light,{'radius-top':.45});sphere(parent,0,.12,0,.36,medium,{scale:'1 .2 1'});cylinder(parent,.45,.18,0,.05,.9,dark,{rotation:'0 0 40'});break;
  case 'bottle':cylinder(parent,0,-.21,0,.23,.69,light);cylinder(parent,0,.24,0,.11,.33,medium);cylinder(parent,0,.41,0,.14,.09,dark);break;
  case 'tea':box(parent,0,-.03,0,.96,.65,.43,medium);box(parent,0,.31,0,1,.05,.45,dark);box(parent,0,-.02,.24,.61,.4,.025,light);break;
  case 'book':box(parent,0,0,0,.72,1.06,.18,medium,{rotation:'0 -17 0'});box(parent,.02,0,.105,.62,.94,.012,light,{rotation:'0 -17 0'});box(parent,0,-.32,.125,.49,.045,.017,dark);break;
  case 'journal':box(parent,0,0,0,.74,1.03,.12,light);box(parent,-.31,0,.065,.052,.99,.06,medium);for(let i=0;i<4;i++)line(parent,pos(-.13,.22-i*.13,.085),pos(.25,.22-i*.13,.085),dark,.5);break;
  case 'yoga':cylinder(parent,0,-.1,0,.33,1.11,medium,{rotation:'0 0 90'});torus(parent,.48,-.1,0,.25,.035,dark,{rotation:'0 90 0'});break;
  case 'dumbbell':cylinder(parent,0,0,0,.1,1.1,light,{rotation:'0 0 90'});for(const x of [-.46,.46]){cylinder(parent,x,0,0,.31,.15,dark,{rotation:'0 0 90'});cylinder(parent,x*1.22,0,0,.24,.09,medium,{rotation:'0 0 90'})}break;
  case 'ball':sphere(parent,0,0,0,.45,medium);torus(parent,0,0,.02,.45,.012,dark);torus(parent,0,0,.02,.45,.013,light,{rotation:'0 90 0'});break;
  default:sphere(parent,0,0,0,.42,light);
 }
}
function room(scene){
 const floor=E('a-entity',{id:'floor'},scene);
 prim(floor,'a-plane',pos(0,-.035,-1.5),{rotation:'-90 0 0',width:35,height:35,material:'color:#172b36; metalness:.32; roughness:.76'});
 for(let x=-16;x<=16;x+=2){line(floor,pos(x,.003,-18),pos(x,.003,15),'#52707d',.12)}
 for(let z=-18;z<=15;z+=2){line(floor,pos(-16,.004,z),pos(16,.004,z),'#52707d',.12)}
 for(const [x,y,z,w,h,d] of [[0,3.7,-17,36,7.4,.35],[-17,3.7,-1.5,.35,7.4,35],[17,3.7,-1.5,.35,7.4,35]])box(scene,x,y,z,w,h,d,'#142631');
 box(scene,0,7.2,-1.5,35,.21,35,'#0b1b28');
 for(let x=-14;x<=14;x+=7){for(const z of [-12,-1,10]){
  prim(scene,'a-box',pos(x,7.04,z),{width:4.5,height:.02,depth:.1,material:'color:#afdbdd; emissive:#84c7d0; emissiveIntensity:.7'});
 }}
 for(const x of [-13,13])for(const z of [-13,-1,11]){
  cylinder(scene,x,3.2,z,.085,6.4,'#274454');
  sphere(scene,x,6.25,z,.16,'#9edbc6',{material:'color:#9edbc6; emissive:#9edbc6; emissiveIntensity:.5'});
 }
 for(let x=-14;x<=14;x+=7){box(scene,x,3.4,-16.78,4.9,3.2,.05,'#1e3e4b');box(scene,x,3.4,-16.72,4.4,2.7,.02,'#26434d',{material:'color:#26434d; opacity:.65; transparent:true'});}
 const mainSign=E('a-entity',{position:'0 5.8 -16.2'},scene);
 E('a-text',{value:'NOVA   /   THE IMMERSIVE STORE',align:'center',width:17,color:'#dfc69e',font:'mozillavr', 'letter-spacing':4},mainSign);
 // Atrium central platform and sculpture.
 cylinder(scene,0,.12,-.6,1.55,.22,'#253b46');cylinder(scene,0,.25,-.6,1.2,.09,'#b59b78');
 const sculpture=E('a-entity',{position:'0 1.7 -0.6',animation:'property: rotation; to: 0 360 0; loop: true; dur: 28000; easing: linear'},scene);
 torus(sculpture,0,0,0,.8,.025,'#c8b18a',{rotation:'30 45 0'});torus(sculpture,0,0,0,.67,.018,'#7cb1ba',{rotation:'90 0 20'});sphere(sculpture,0,0,0,.30,'#e4c58c',{material:'color:#d7bb91; metalness:.85; roughness:.17'});
 for(const x of [-15.9,15.9])for(let z=-15;z<=13;z+=3){box(scene,x,2,z,.1,3.5,1.4,'#1b3742')}
}
function station(scene,category,idx,onSelect){
 const [cx,cz]=category.zone;
 const colors=palette[category.id];
 const area=E('a-entity',{id:`zone-${category.id}`,position:pos(cx,0,cz)},scene);
 box(area,0,.08,0,7.1,.13,6.5,'#1b303c');
 box(area,0,.6,-2.72,7,.9,.2,'#253945');
 box(area,0,2.65,-2.75,6.8,.08,.16,colors[1]);
 E('a-text',{value:category.label.toUpperCase(),position:pos(0,3.12,-2.67),align:'center',width:8.7,color:'#e6e7e0'},area);
 E('a-text',{value:`0${idx+1}  /  NOVA COLLECTION`,position:pos(0,2.77,-2.65),align:'center',width:4.2,color:colors[0]},area);
 for(let j=0;j<5;j++){
  const p=PRODUCTS.filter(item=>item.category===category.id)[j];
  const x=(j-2)*1.34;
  const z=j%2===0?-.35:.6;
  const stand=E('a-entity',{position:pos(x,0,z)},area);
  cylinder(stand,0,.49,0,.52,.96,'#304653');cylinder(stand,0,.99,0,.56,.07,colors[1]);
  cylinder(stand,0,.1,0,.58,.04,'#101f2b');
  const model=E('a-entity',{position:'0 1.53 0',rotation:`0 ${(j-2)*-11} 0`,animation:`property: position; dir: alternate; dur: ${1700+j*213}; to: 0 1.59 0; loop: true; easing: easeInOutSine`},stand);
  objectModel(model,p.shape,colors);
  const hit=box(model,0,0,0,1.16,1.35,1.03,'#ffffff',{class:'interactable',material:'color:#fff; transparent:true; opacity:0.001; side:double','data-product':p.id});
  hit.addEventListener('click',()=>onSelect(p.id));
  hit.addEventListener('mouseenter',()=>{model.setAttribute('scale','1.12 1.12 1.12');document.body.style.cursor='pointer'});
  hit.addEventListener('mouseleave',()=>{model.setAttribute('scale','1 1 1');document.body.style.cursor=''});
  const label=E('a-entity',{position:'0 .19 .57',rotation:'0 0 0'},stand);
  box(label,0,0,0,1.26,.29,.02,'#102430');
  E('a-text',{value:p.name.length>15?p.name.slice(0,14)+'…':p.name,color:'#ebeee9',align:'center',width:1.4,position:'0 .03 .021'},label);
  E('a-text',{value:`${(p.priceCents/100).toFixed(0)} EUR`,color:'#d4b58a',align:'center',width:1.25,position:'0 -.085 .025'},label);
 }
}
export async function createShowroom(container,{onProduct,onZone}){
 const start=Date.now();
 while(!window.AFRAME&&Date.now()-start<8500) await new Promise(resolve=>setTimeout(resolve,120));
 if(!window.AFRAME) throw new Error('A-Frame est indisponible (vérifiez votre connexion).');
 if(!window.AFRAME.components['nova-thumbstick']){
  window.AFRAME.registerComponent('nova-thumbstick',{
   init(){this.axis={x:0,y:0};this.left=this.el.querySelector('#left-hand');this.right=this.el.querySelector('#right-hand');const move=e=>{this.axis={x:e.detail.x||0,y:e.detail.y||0}};this.left?.addEventListener('thumbstickmoved',move);this.right?.addEventListener('thumbstickmoved',move)},
   tick(t,dt){const rig=this.el;if(!dt||dt>150)return;const p=rig.object3D.position;const y=rig.querySelector('[camera]')?.object3D.rotation.y||0;const speed=dt*.0032;const f=-this.axis.y*speed;const s=this.axis.x*speed;p.x=Math.max(-15.6,Math.min(15.6,p.x+Math.sin(y)*f+Math.cos(y)*s));p.z=Math.max(-15.6,Math.min(13.8,p.z-Math.cos(y)*f+Math.sin(y)*s));}
  });
  window.AFRAME.registerComponent('nova-bounds',{tick(){const p=this.el.object3D.position;p.x=Math.max(-15.6,Math.min(15.6,p.x));p.z=Math.max(-15.6,Math.min(13.8,p.z));}});
 }
 const scene=E('a-scene',{embedded:'',renderer:'antialias: true; colorManagement: true; physicallyCorrectLights: true; highRefreshRate: true',background:'color: #091723',fog:'type: linear; color: #152735; near: 14; far: 38','xr-mode-ui':'enabled: true','vr-mode-ui':'enabled: false',loading:'color: #c8b18b'},container);
 E('a-light',{type:'ambient',color:'#b5d0db',intensity:.65},scene);
 E('a-light',{type:'hemisphere',color:'#d9edff',groundColor:'#223c40',intensity:.8},scene);
 for(const [x,z,color] of [[-10,-9,'#99c8e3'],[9,-9,'#e4b9ab'],[-10,6,'#9fc3a1'],[9,6,'#c7aee5'],[0,3,'#e0c28f']])E('a-light',{type:'point',color,intensity:.52,distance:12,position:pos(x,5,z)},scene);
 room(scene);
 CATEGORIES.forEach((cat,idx)=>station(scene,cat,idx,onProduct));
 const rig=E('a-entity',{id:'player-rig',position:'0 0 12','wasd-controls':'acceleration: 24; fly: false','nova-thumbstick':'','nova-bounds':''},scene);
 E('a-entity',{id:'view-camera',camera:'fov: 75; active: true',position:'0 1.65 0','look-controls':'pointerLockEnabled: false; touchEnabled: true',cursor:'rayOrigin: mouse',raycaster:'objects: .interactable; far: 9; interval: 75'},rig);
 E('a-entity',{id:'left-hand','laser-controls':'hand: left',raycaster:'objects: .interactable; far: 8; lineColor: #e1bf8e; lineOpacity: .7'},rig);
 E('a-entity',{id:'right-hand','laser-controls':'hand: right',raycaster:'objects: .interactable; far: 8; lineColor: #e1bf8e; lineOpacity: .7'},rig);
 const ready=()=>{document.getElementById('scene-fallback')?.remove();onZone?.('atrium')};
 if(scene.hasLoaded)ready();else scene.addEventListener('loaded',ready,{once:true});
 const setPosition=(x,z)=>{rig.object3D.position.set(x,0,z);rig.object3D.rotation.y=0};
 return {
  scene,rig,
  explore(){setPosition(0,3.5)},
  reset(){setPosition(0,12)},
  nudge(dx,dz){const p=rig.object3D.position;p.x=Math.max(-15.6,Math.min(15.6,p.x+dx));p.z=Math.max(-15.6,Math.min(13.8,p.z+dz))},
  visit(id){const cat=CATEGORIES.find(c=>c.id===id);if(!cat)return;setPosition(cat.zone[0],Math.min(13.5,cat.zone[1]+3.8));onZone?.(id)},
  enterVR(){if(!scene.is('vr-mode'))scene.enterVR();else scene.exitVR()},
  getFPS(){return scene.renderer?.info?.render?.frame??0}
 };
}
