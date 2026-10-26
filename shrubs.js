import * as T from './vendor/three.module.js';
import {Tree} from './vendor/ez-tree/ez-tree.js';
// Original EZ-Tree Bush 1 skeleton/leaf generator, fitted into low hedge proportions.
// Materials and original leaf textures are shared with campus trees.
export function createShrubs(C,materials){
 const root=new T.Group();root.name='LayeredHedges';const dummy=new T.Object3D(),templates=[];let triangles=0;
 for(let k=0;k<3;k++){
  const plant=new Tree();plant.loadPreset('Bush 1');plant.options.seed=735+k*211;
  plant.options.branch.children={0:8,1:3,2:2};plant.options.leaves.count=17;plant.options.leaves.size=1.95;plant.options.leaves.sizeVariance=.42;plant.generate();
  const shapes=plant.createGeometry({sectionStride:2,segmentFactor:.8,leafStride:1}),bounds=new T.Box3();for(const g of Object.values(shapes)){g.computeBoundingBox();bounds.union(g.boundingBox)}
  const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  const list=C.shrubs.filter((_,i)=>i%3===k);let perPlant=0;
  for(const [part,g,material] of [['branches',shapes.branches,materials[k].bark],['leaves',shapes.leaves,materials[k].leaf]]){
   g.translate(-center.x,-bounds.min.y,-center.z);g.scale(1/size.x,1/size.y,1/size.z);g.computeBoundingSphere();const mesh=new T.InstancedMesh(g,material,list.length);mesh.name='shrub-'+part+'-'+k;mesh.userData.plants=list;
   list.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.angle,0);dummy.scale.set(p.w,p.h,p.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color().setRGB(.87+(i%4)*.035,.9+(i%3)*.03,.82+(i%5)*.035))});mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();mesh.receiveShadow=true;mesh.castShadow=true;root.add(mesh);perPlant+=g.index.count/3;triangles+=g.index.count/3*list.length;
  }
  templates.push({variant:k,triangles:perPlant});plant.branchesMesh.geometry.dispose();plant.leavesMesh.geometry.dispose();plant.branchesMesh.material.dispose();plant.leavesMesh.material.dispose();
 }
 return{root,placements:C.shrubs,metadata:{plants:C.shrubs.length,libraryRow:C.shrubs.filter(p=>p.area==='library').length,batches:root.children.length,triangles,templates,source:'Original EZ-Tree Bush 1 geometry; shared original ash/oak leaf textures; project scale and placement'}};
}
