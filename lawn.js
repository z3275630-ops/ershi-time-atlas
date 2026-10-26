import * as T from './vendor/three.module.js';
// Three.js's native instancing and LOD; this project's small tuft geometry and placement mask.
export function createLawn(C,groundItems,{density=96}={}){
 const root=new T.Group();root.name='DetailedLawns';
 const floors=groundItems.filter(o=>o.y<.2&&o.h<=.25&&['grass','road','water','stone','white','wood','court','track'].includes(o.mat));
 const inside=(x,z,o,margin=0)=>x>=o.x-o.w/2-margin&&x<=o.x+o.w/2+margin&&z>=o.z-o.d/2-margin&&z<=o.z+o.d/2+margin;
 function groundAt(x,z){let y=0,grass=false;for(const o of floors)if(inside(x,z,o)&&o.y+o.h/2>=y-.0001){y=o.y+o.h/2;grass=o.mat==='grass'}
  const dx=x-41,dz=Math.max(0,Math.abs(z-42.5)-4.5);if(dx*dx+dz*dz<3.6*3.6&&y<.075){y=.07;grass=true}return{y,grass};}
 function sample(x,z){
  if(x<1.12||x>47.85||z<1.12||z>65.85)return null;
  for(const b of C.buildings)if(x>b.x-.12&&x<b.x+b.w+.12&&z>b.y-.12&&z<b.y+b.h+.12){if(!['dorm','courtyard'].includes(b.kind)||x<b.x+1.42||x>b.x+b.w-1.42||z<b.y+1.42||z>b.y+b.h-1.42)return null}
  const g=groundAt(x,z);if(!g.grass)return null;
  if(C.gardenObstacles.some(([a,b,w,d])=>x>a-.13&&x<a+w+.13&&z>b-.13&&z<b+d+.13))return null;
  if(C.furnishings.benches.some(([a,b])=>x>a-.1&&x<a+1.4&&z>b-.1&&z<b+.5))return null;
  // Keep the athletics markings readable from above and at walking height.
  if(x>37.6&&x<44.5&&z>36.7&&z<48.3&&(Math.min(Math.abs(x-37.9),Math.abs(x-44.1),Math.abs(z-37),Math.abs(z-42.5),Math.abs(z-48))<.09))return null;
  return g.y;
 }
 const seedRandom=()=>{let s=9167;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}},rand=seedRandom();
 // Green microtexture is project-generated data; no extra image request or painted screenshot.
 const side=512,data=new Uint8Array(side*side*4);for(let z=0;z<side;z++)for(let x=0;x<side;x++){const i=(z*side+x)*4,n=rand(),v=.5+.18*Math.sin(x*.19+Math.cos(z*.11))+.14*Math.sin(z*.23+x*.14);data.set([100+v*27+n*34,126+v*26+n*31,63+v*18+n*22,255],i)}
 const texture=new T.DataTexture(data,side,side,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.minFilter=T.LinearMipmapLinearFilter;texture.magFilter=T.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;texture.anisotropy=4;
 const baseMat=new T.MeshStandardMaterial({map:texture,color:0xffffff,roughness:1,vertexColors:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),positions=[],uvs=[],colors=[],normals=[],indices=[];
 for(let z=1.2;z<65.6;z+=.4)for(let x=1.2;x<47.6;x+=.4){const y=sample(x+.2,z+.2);if(y===null||[sample(x+.02,z+.02),sample(x+.38,z+.02),sample(x+.02,z+.38),sample(x+.38,z+.38)].some(h=>h===null||Math.abs(h-y)>.02))continue;const i=positions.length/3;
  for(const [a,b] of [[x,z],[x,z+.4],[x+.4,z],[x+.4,z+.4]]){positions.push(a,y+.002,b);uvs.push(a/.85,b/.85);normals.push(0,1,0);const tone=.9+.06*Math.sin(a*.44+b*.27)+.04*Math.sin(a*.9-b*.5);colors.push(tone,tone,tone)}indices.push(i,i+1,i+2,i+2,i+1,i+3);
 }
 const surface=new T.BufferGeometry();surface.setAttribute('position',new T.Float32BufferAttribute(positions,3));surface.setAttribute('normal',new T.Float32BufferAttribute(normals,3));surface.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));surface.setAttribute('color',new T.Float32BufferAttribute(colors,3));surface.setIndex(indices);const matMesh=new T.Mesh(surface,baseMat);matMesh.name='TexturedLawnSurface';matMesh.receiveShadow=true;root.add(matMesh);
 // Three curved, tapering blades per tuft. Colors graduate from a dark root to a light tip.
 const verts=[],ns=[],cs=[],ix=[];
 for(let blade=0;blade<3;blade++){const angle=blade*Math.PI*2/3,base=verts.length/3;for(let ring=0;ring<4;ring++){const t=ring/3,w=.006*(1-t)+.0005,bend=.014*t*t,h=.055*t;for(const sign of [-1,1]){const a=sign*w;verts.push(Math.cos(angle)*a+Math.sin(angle)*bend,h,-Math.sin(angle)*a+Math.cos(angle)*bend);ns.push(Math.sin(angle),.3,Math.cos(angle));const c=new T.Color().setRGB(.18+.10*t,.32+.16*t,.10+.05*t);cs.push(c.r,c.g,c.b)}}for(let i=0;i<3;i++)ix.push(base+i*2,base+i*2+2,base+i*2+1,base+i*2+1,base+i*2+2,base+i*2+3)}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(verts,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(ns,3));geometry.setAttribute('color',new T.Float32BufferAttribute(cs,3));geometry.setIndex(ix);geometry.normalizeNormals();
 const bladeMat=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,side:T.DoubleSide,roughness:1}),buckets=Array.from({length:6},()=>[]),placements=[];
 for(let i=0;i<49*67*density;i++){const x=1.2+rand()*46.5,z=1.2+rand()*64.5,y=sample(x,z);if(y===null)continue;const p={x,z,y,scale:.55+rand()*.65,angle:rand()*Math.PI*2};if(x>35&&z>30)p.scale*=.55;buckets[(x<24?0:1)+Math.min(2,Math.floor(z/22))*2].push(p);placements.push(p)}
 const dummy=new T.Object3D();let batches=0;
 buckets.forEach((list,k)=>{if(!list.length)return;const cx=k%2?36:12,cz=Math.floor(k/2)*22+11,lod=new T.LOD();lod.position.set(cx,0,cz);lod.name='LawnDetail-'+k;
  for(const [stride,distance] of [[1,0],[6,14]]){const selected=list.filter((_,i)=>i%stride===0),mesh=new T.InstancedMesh(geometry,bladeMat,selected.length);mesh.name='GrassTufts-'+k+'-'+stride;mesh.userData.tufts=selected;selected.forEach((p,i)=>{dummy.position.set(p.x-cx,p.y+.004,p.z-cz);dummy.rotation.set(0,p.angle,0);dummy.scale.setScalar(p.scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color().setRGB(.83+(i%5)*.045,.88+(i%4)*.035,.8+(i%6)*.045))});mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();mesh.receiveShadow=true;mesh.castShadow=false;lod.addLevel(mesh,distance,.12)}lod.addLevel(new T.Group(),34,.12);root.add(lod);batches++;
 });
 return{root,baseMaterial:baseMat,groundAt,sample,placements,metadata:{tufts:placements.length,blades:placements.length*3,nearTriangles:placements.length*18,surfaceTriangles:indices.length/3,maxGrassBatches:batches,lodDistances:[0,14,34]}};
}
export async function applyLawnTexture(lawn,resolve,onReady){const bump=await new T.TextureLoader().loadAsync(resolve('vegetation/grass.jpg'));bump.wrapS=bump.wrapT=T.RepeatWrapping;bump.anisotropy=4;lawn.baseMaterial.bumpMap=bump;lawn.baseMaterial.bumpScale=.013;lawn.baseMaterial.needsUpdate=true;onReady()}
