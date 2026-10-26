import * as T from './vendor/three.module.js';
import {manualStep} from './logic.js';
export const WALK_SPEED=1.0,PLAYER_RADIUS=.16;
export function canStand(world,x,z,r=PLAYER_RADIUS){
 if(!world.walkable(x,z))return false;
 for(const [dx,dz] of [[r,0],[-r,0],[0,r],[0,-r],[r*.707,r*.707],[-r*.707,r*.707],[r*.707,-r*.707],[-r*.707,-r*.707]])if(!world.walkable(x+dx,z+dz))return false;
 return true;
}
export function clearSegment(world,a,b,r=PLAYER_RADIUS){const d=Math.hypot(b.x-a.x,b.z-a.z),n=Math.max(1,Math.ceil(d/.08));for(let i=0;i<=n;i++)if(!canStand(world,a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n,r))return false;return true}
// PathFinding.js smoothenPath's line-of-sight string pulling, adapted from grid points
// to world coordinates and a circular body. Original MIT notice is in vendor/pathfinding-LICENSE.txt.
export function smoothRoute(position,points,world){
 const path=[{...position},...points],result=[];let anchor=path[0];
 for(let i=2;i<path.length;i++)if(!clearSegment(world,anchor,path[i])){result.push(path[i-1]);anchor=path[i-1]}
 if(path.length>1)result.push(path.at(-1));return result.filter((p,i)=>i?Math.hypot(p.x-result[i-1].x,p.z-result[i-1].z)>.001:Math.hypot(p.x-position.x,p.z-position.z)>.025);
}
export function createWalker(world){
 let speed=0,lastDirection={x:0,z:0};const rotation=new T.Quaternion(),targetRotation=new T.Quaternion(),up=new T.Vector3(0,1,0);
 return {reset(){speed=0;lastDirection={x:0,z:0}},step(position,intent,route,yaw,dt){
  dt=Math.min(Math.max(dt,0),.1);const before={...position};let x=position.x,z=position.z,arrived=false;
  const manual=Math.hypot(intent.x,intent.z)>.001;if(manual&&route.length)route.length=0;
  while(route.length&&Math.hypot(route[0].x-x,route[0].z-z)<.002){route.shift();if(!route.length){arrived=true;speed=0;lastDirection={x:0,z:0}}}
  const wantsMove=manual||route.length>0;
  speed=T.MathUtils.damp(speed,wantsMove?WALK_SPEED:0,wantsMove?13:22,dt);if(speed<.006)speed=0;
  // tamani-coding CharacterControls: camera-relative facing with Quaternion.rotateTowards.
  // Adapted to dt seconds, +Z-facing avatars and circular collision. MIT notice retained.
  const facing=manual?intent:route[0]?{x:route[0].x-x,z:route[0].z-z}:null;let alignment=1;
  if(facing&&Math.hypot(facing.x,facing.z)>.001){const goal=Math.atan2(facing.x,facing.z);rotation.setFromAxisAngle(up,yaw);targetRotation.setFromAxisAngle(up,goal);rotation.rotateTowards(targetRotation,9*dt);yaw=new T.Euler().setFromQuaternion(rotation,'YXZ').y;alignment=Math.max(0,Math.cos(Math.atan2(Math.sin(goal-yaw),Math.cos(goal-yaw))))}
  let budget=speed*dt*alignment;
  while(budget>.00001){
   const target=route[0];let dx,dz,d=Infinity;
   if(manual){const len=Math.hypot(intent.x,intent.z);dx=intent.x/len;dz=intent.z/len;lastDirection={x:dx,z:dz}}
   else if(target){dx=target.x-x;dz=target.z-z;d=Math.hypot(dx,dz);if(d<.00001){route.shift();continue}dx/=d;dz/=d;lastDirection={x:dx,z:dz}}
   else{dx=lastDirection.x;dz=lastDirection.z;if(!wantsMove&&Math.hypot(dx,dz)<.01)break}
   const step=Math.min(budget,d),next=manualStep({x,z},dx*step,dz*step,world,PLAYER_RADIUS),moved=Math.hypot(next.x-x,next.z-z);x=next.x;z=next.z;budget-=step;
   if(moved<.000001){speed=0;break}
   if(target&&!manual&&Math.hypot(target.x-x,target.z-z)<.002){route.shift();if(!route.length){arrived=true;speed=0;break}}
   if(manual||!target)break;
  }
  const dx=x-before.x,dz=z-before.z,distance=Math.hypot(dx,dz),actualSpeed=dt?distance/dt:0;

  return {x,z,dx,dz,yaw,speed:actualSpeed,distance,arrived};
 }};
}
