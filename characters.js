import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';
// VRoid Project CC0 cartoon students; Rocketbox MIT idle/walk clips pre-baked using Three.js.
export async function loadCharacter(url,role='student',loader=new GLTFLoader()){
 const gltf=await loader.loadAsync(url),model=gltf.scene;
 model.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
 const normalized=new T.Group(),scale=1.15/size.y;model.scale.setScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);normalized.add(model);
 let triangles=0,bones=0;
 model.traverse(o=>{if(o.isBone)bones++;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;const adapt=m=>new T.MeshToonMaterial({name:m.name,color:m.color,map:m.map,alphaTest:m.alphaTest||0,side:m.side});o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material)}});
 const clips=gltf.animations,mixer=new T.AnimationMixer(model),idleClip=clips.find(a=>a.name==='Idle'),walkSource=clips.find(a=>a.name==='Walk');
 if(!idleClip||!walkSource)throw new Error('人物缺少站立或行走动画');
 // Keep pathfinding authoritative: remove root translation drift, retaining limb motion and vertical bob.
 const inPlace=clip=>{const copy=clip.clone();for(const track of copy.tracks)if(/(hips|root|armature).*\.position$/i.test(track.name)){for(let i=0;i<track.values.length;i+=3){track.values[i]=track.values[0];track.values[i+2]=track.values[2]}}return copy};
 const idle=mixer.clipAction(inPlace(idleClip)),walk=mixer.clipAction(inPlace(walkSource));idle.play();walk.play().setEffectiveWeight(0).setEffectiveTimeScale(0);mixer.update(.1);let targetSpeed=0,displaySpeed=0,blend=0;
 normalized.userData={source:'VRoid Project / pixiv (CC0), Rocketbox motion (MIT)',role,triangles,bones,textured:true,animations:[idleClip.name,walkSource.name]};
 // Captured root travel / duration, scaled by the normalized avatar hip height.
 normalized.updateMatrixWorld(true);const hips=model.getObjectByName('J_Bip_C_Hips');
 const strideSpeed=(1.214040451/1.200000048)*(hips.getWorldPosition(new T.Vector3()).y/.8977951223654944);
 normalized.userData.strideSpeed=strideSpeed;
 return {object:normalized,mixer,metadata:normalized.userData,setMoving(next){targetSpeed=next?1:0},setSpeed(speed){targetSpeed=Math.max(0,Math.min(2,speed))},update(dt){displaySpeed=T.MathUtils.damp(displaySpeed,targetSpeed,18,dt);blend=T.MathUtils.damp(blend,T.MathUtils.clamp(targetSpeed/.38,0,1),16,dt);walk.setEffectiveWeight(blend).setEffectiveTimeScale(targetSpeed>.015?T.MathUtils.clamp(displaySpeed/strideSpeed,.15,2.5):0);idle.setEffectiveWeight(1-blend);mixer.update(dt)},getMotion(){return{targetSpeed,displaySpeed,blend,timeScale:walk.getEffectiveTimeScale()}}};
}
