import * as T from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import {CHAPTERS} from './adventure-data.js';
// Original campus-object characters. RoundedBoxGeometry is unmodified Three.js MIT source.
const sphere=new T.SphereGeometry(1,32,24),smallSphere=new T.SphereGeometry(1,20,16),up=new T.Vector3(0,1,0);
const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.48,metalness:0,...extra});
function mesh(group,geometry,mat,x=0,y=0,z=0,scale=null){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function ball(g,mat,x,y,z,s){return mesh(g,sphere,mat,x,y,z,s)}
function round(g,mat,w,h,d,r,x,y,z){return mesh(g,new RoundedBoxGeometry(w,h,d,3,r),mat,x,y,z)}
function curve(g,points,r,mat){return mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),18,r,8,false),mat)}
function leaf(g,mat,x,y,z,angle=0,size=.4){const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-.62,.18,-.5,.7,0,1);shape.bezierCurveTo(.5,.7,.62,.18,0,0);const geo=new T.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:3,curveSegments:14,steps:1});const l=mesh(g,geo,mat,x,y,z);l.scale.setScalar(size);l.rotation.z=angle;return l}
export function createSpirit(id){
 const c=CHAPTERS.find(c=>c.id===id)||CHAPTERS[0],root=new T.Group(),body=new T.Group();root.name='Spirit_'+c.id;root.userData.spirit=c.id;root.add(body);body.position.y=.55;
 const cream=material('#fff4d9'),dark=material('#303443'),blush=material('#dfaa9c'),white=material('#fffefa'),gold=material('#dcb56d'),colored=material(c.color),limbs=[],wings=[],eyes=[];
 let faceZ=.35,faceY=.07;
 if(c.id==='library'){
  round(body,colored,.86,.89,.43,.14,0,0,0);round(body,cream,.71,.76,.075,.09,0,.005,.255);
  for(let i=0;i<5;i++)round(body,material(i%2?'#e4d8b7':'#f9efd9'),.67,.012,.04,.005,0,-.26+i*.12,.302);
  round(body,colored,.12,.86,.47,.06,-.38,0,.0);round(body,gold,.075,.22,.055,.02,.22,.38,.29);
  for(const side of [-1,1]){const wing=new T.Group();wing.position.set(side*.43,.03,0);body.add(wing);const w=round(wing,cream,.35,.49,.055,.025,side*.12,0,0);w.rotation.z=-side*.28;for(let j=0;j<3;j++)round(wing,gold,.19,.013,.009,.004,side*.12,-.13+j*.1,.035);wings.push(wing)}
  faceZ=.315;faceY=.04;
 }else if(c.id==='garden'){
  ball(body,colored,0,-.02,0,[.44,.45,.36]);ball(body,material('#d3df9d'),0,-.12,.19,[.34,.27,.22]);
  curve(body,[[0,.27,0],[.02,.52,0],[0,.64,0]],.04,material('#709253'));
  wings.push(leaf(body,material('#97bb6e'),-.015,.49,.02,.82,.36),leaf(body,material('#b1cc82'),.015,.5,.02,-.76,.38));faceZ=.38;faceY=.03;
 }else if(c.id==='teaching'){
  const ink=material('#53536c');ball(body,ink,0,0,0,[.44,.39,.37]);ball(body,material('#75758d'),-.09,.13,-.07,[.35,.31,.29]);
  curve(body,[[.17,.18,0],[.34,.46,0],[.21,.64,0],[.11,.67,0]],.085,ink);const glint=material('#b4b0ce');curve(body,[[-.3,.15,.24],[-.23,.26,.28],[-.11,.29,.31]],.018,glint);faceZ=.37;faceY=.01;
  for(const s of [-1,1])ball(body,ink,s*.44,-.1,0,[.13,.12,.13]);
 }else if(c.id==='sports'){
  ball(body,colored,0,0,0,[.44,.43,.36]);const band=round(body,cream,.86,.12,.36,.05,0,.22,.07);band.rotation.z=-.08;
  for(const s of [-1,1]){const scarf=new T.Group();scarf.position.set(s*.38,.16,-.02);body.add(scarf);round(scarf,cream,.28,.12,.08,.045,s*.12,0,0);wings.push(scarf)}
  ball(body,gold,0,-.09,.35,[.12,.13,.07]);faceY=.035;faceZ=.36;
 }else{
  round(body,material('#e5c695'),.72,.75,.48,.21,0,0,0);round(body,material('#fff1ce',{emissive:'#f3b768',emissiveIntensity:.18}),.56,.55,.075,.17,0,0,.26);
  for(const s of [-1,1])round(body,gold,.055,.62,.06,.025,s*.27,0,.29);
  curve(body,[[-.18,.38,0],[-.16,.57,0],[0,.63,0],[.16,.57,0],[.18,.38,0]],.025,gold);round(body,gold,.5,.075,.4,.03,0,-.4,0);faceZ=.315;faceY=.015;
 }
 for(const side of [-1,1]){
  const eye=new T.Group();eye.position.set(side*.13,faceY+.055,faceZ);body.add(eye);mesh(eye,smallSphere,dark,0,0,0,[.039,.061,.025]);mesh(eye,smallSphere,white,-.01,.019,.02,[.012,.016,.007]);eyes.push(eye);
  mesh(body,smallSphere,blush,side*.23,faceY-.055,faceZ-.01,[.055,.023,.009]);
  const arm=new T.Group();arm.position.set(side*.39,-.15,0);body.add(arm);ball(arm,c.id==='teaching'?colored:cream,side*.025,-.055,.025,[.075,.115,.08]);limbs.push(arm);
  const foot=ball(root,c.id==='teaching'?colored:cream,side*.18,.11,.06,[.13,.085,.16]);limbs.push(foot);
 }
 curve(body,[[-.055,faceY-.055,faceZ+.005],[0,faceY-.08,faceZ+.015],[.055,faceY-.055,faceZ+.005]],.01,dark);
 // A stitched medallion makes the silhouettes read as a coherent collection.
 if(c.id!=='sports')ball(body,gold,0,-.25,faceZ-.01,[.035,.035,.014]);
 root.userData={spirit:c.id,original:true,theme:c.kind,pose:'idle'};
 let triangles=0;root.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3});
 return {object:root,metadata:{id:c.id,triangles,original:true},update(time,{collected=false,reducedMotion=false}={}){const t=reducedMotion?0:time;body.position.y=.55+Math.sin(t*2.4)*.025;body.rotation.z=Math.sin(t*1.7)*.025;wings.forEach((w,i)=>w.rotation.z=Math.sin(t*3+i*Math.PI)*.08);limbs.slice(0,2).forEach((a,i)=>a.rotation.z=Math.sin(t*2.1+i*Math.PI)*.1);const blink=reducedMotion?1:Math.cos(t*1.1)>.995?.16:1;eyes.forEach(e=>e.scale.y=blink);root.userData.pose=collected?'companion':'waiting'}};
}
export function createSpiritField(){
 const root=new T.Group();root.name='CampusSpirits';const actors=CHAPTERS.map(c=>{const actor=createSpirit(c.id);actor.object.position.set(c.position[0]+.65,.12,c.position[1]);actor.object.scale.setScalar(.78);root.add(actor.object);return actor});
 let previousFollower=null,previousTime=null;
 return {root,actors,update(time,pose,state){const dt=previousTime===null?1/60:Math.max(0,Math.min(.1,time-previousTime));previousTime=time;for(const actor of actors){const p=actor.object.position,c=CHAPTERS.find(c=>c.id===actor.metadata.id),following=state.following===c.id&&state.quests[c.id].collected;
  if(following){const target=new T.Vector3(pose.x+.85,.23,pose.z+.45);if(previousFollower!==c.id)p.copy(target);else p.lerp(target,1-Math.exp(-10*dt))}else p.set(c.position[0]+.65,.12,c.position[1]);
  actor.object.visible=pose.mode==='walk'&&Math.hypot(p.x-pose.x,p.z-pose.z)<19;actor.update(time,{collected:state.quests[c.id].collected,reducedMotion:pose.reducedMotion});if(actor.object.visible)actor.object.rotation.y=Math.atan2(pose.x-p.x,pose.z-p.z)}previousFollower=state.following;}};
}
