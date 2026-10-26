import * as T from './vendor/three.module.js';
import {Tree} from './vendor/ez-tree/ez-tree.js';
// Original EZ-Tree generator: genuine tapered branches + crossed leaf geometry.
// Generate three shared templates, then instance them; no editor/framework dependency.
export function createVegetation(C){
 const root=new T.Group();root.name='LayeredCampusTrees';const materials=[],placements=[];
 let seed=271;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<360;i++){
  const x=1.8+rand()*44,z=2+rand()*61;
  if([...C.roads,...C.plazas].some(([a,b,w,d])=>x>a-.3&&x<a+w+.3&&z>b-.3&&z<b+d+.3)||C.buildings.some(b=>x>b.x-.7&&x<b.x+b.w+.7&&z>b.y-.7&&z<b.y+b.h+.7)||x>35&&z>24||x>7&&x<20&&z>30&&z<39||x>24&&x<34&&z>38&&z<55)continue;
  if(placements.some(p=>Math.hypot(p.x-x,p.z-z)<1.45))continue;
  placements.push({x,z,h:2.4+rand()*1.8,rotation:rand()*Math.PI*2,kind:i%3});
 }
 // Deliberate garden planting frames the central path and preserves sightlines.
 for(const [x,z,h] of C.gardenTrees)placements.push({x,z,h,rotation:rand()*6.28,kind:placements.length%3});
 const dummy=new T.Object3D();let triangles=0;
 for(let k=0;k<3;k++){
  const tree=new Tree();tree.loadPreset(k===1?'Oak Medium':'Ash Medium');tree.options.seed=483+k*171;
  tree.options.branch.children={0:6,1:4,2:3};tree.options.leaves.count=18;tree.options.leaves.size*=1.05;tree.generate();
  const shapes=tree.createGeometry({sectionStride:2,segmentFactor:.8,leafStride:1});const bounds=new T.Box3().setFromBufferAttribute(shapes.leaves.attributes.position),height=bounds.max.y;
  const bark=new T.MeshStandardMaterial({color:0x9c9380,roughness:1});const leaf=new T.MeshStandardMaterial({color:k===1?0x9aae77:0xb3c08b,side:T.DoubleSide,alphaTest:.48,roughness:1});
  leaf.userData.leafType=k===1?'oak':'ash';materials.push({bark,leaf});
  for(const [part,geometry,mat] of [['branches',shapes.branches,bark],['leaves',shapes.leaves,leaf]]){
   const list=placements.filter(p=>p.kind===k),mesh=new T.InstancedMesh(geometry,mat,list.length);mesh.name='tree-'+part+'-'+k;
   list.forEach((p,i)=>{dummy.position.set(p.x,0,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.setScalar(p.h/height);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.computeBoundingSphere();mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);triangles+=(geometry.index.count/3)*list.length;
  }
  tree.branchesMesh.geometry.dispose();tree.leavesMesh.geometry.dispose();tree.branchesMesh.material.dispose();tree.leavesMesh.material.dispose();
 }
 return {root,materials,placements,triangles};
}
export async function applyVegetationTextures(forest,resolve,onReady){
 const loader=new T.TextureLoader();const [bark,ash,oak]=await Promise.all(['bark.jpg','ash.png','oak.png'].map(n=>loader.loadAsync(resolve('vegetation/'+n))));
 for(const tex of [bark,ash,oak]){tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4}bark.wrapS=bark.wrapT=T.RepeatWrapping;bark.repeat.set(1,2);
 for(const entry of forest.materials){entry.bark.map=bark;entry.bark.needsUpdate=true;entry.leaf.map=entry.leaf.userData.leafType==='oak'?oak:ash;entry.leaf.needsUpdate=true}onReady();
}
