import * as T from './vendor/three.module.js';
// Adapted from camera-controls _collisionTest: four near-plane corner rays.
// MIT (c) 2017 @yomotsu; vendor/camera-controls-LICENSE.txt.
// Keep OrbitControls and test actual building instances, plus a central ray.
export function createCameraObstacles(meshes){
 // Reuse structural instance transforms, omitting tiny window/trim decorations.
 // These meshes are ray-test proxies only and are never added to the scene.
 const colliders=[],matrix=new T.Matrix4(),material=new T.MeshBasicMaterial({side:T.DoubleSide});let instances=0;
 for(const mesh of meshes){
  if(!mesh.isInstancedMesh){colliders.push(mesh);instances++;continue}
  const items=mesh.userData.items||[],indices=items.flatMap((item,i)=>item.id&&Math.min(item.w,item.h,item.d)>.1&&(item.h>.25||item.w*item.d>1)?[i]:[]);if(!indices.length)continue;
  const proxy=new T.InstancedMesh(mesh.geometry,material,indices.length);proxy.userData.cameraCollider=true;
  indices.forEach((index,i)=>{mesh.getMatrixAt(index,matrix);matrix.premultiply(mesh.matrixWorld);proxy.setMatrixAt(i,matrix)});proxy.computeBoundingSphere();colliders.push(proxy);instances+=indices.length;
 }
 const ray=new T.Raycaster(),direction=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),origin=new T.Vector3();
 const constrain=function(camera,target){
  direction.copy(camera.position).sub(target);const wanted=direction.length();if(wanted<.01)return false;direction.divideScalar(wanted);
  right.crossVectors(camera.up,direction).normalize();up.crossVectors(direction,right).normalize();
  const height=Math.tan(T.MathUtils.degToRad(camera.fov)*.5)*camera.near,width=height*camera.aspect;let distance=wanted;
  for(const [x,y] of [[0,0],[-1,-1],[1,-1],[-1,1],[1,1]]){
   origin.copy(target).addScaledVector(right,x*width).addScaledVector(up,y*height);ray.set(origin,direction);ray.near=0;ray.far=wanted+.25;
   const hit=ray.intersectObjects(colliders,false).find(h=>h.object.userData.cameraCollider||h.object.userData.items?.[h.instanceId]?.id);
   if(hit)distance=Math.min(distance,Math.max(.12,hit.distance-.22));
  }
  if(distance>=wanted-.001)return false;camera.position.copy(target).addScaledVector(direction,distance);camera.updateMatrixWorld();return true;
 };constrain.colliderInstances=instances;return constrain;
}
