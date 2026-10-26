/* Original reference-based geometry. Three.js r183.2 supplies actual 3D meshes,
 * lighting and instancing. This is not a photogrammetric or surveyed model. */
import * as T from './vendor/three.module.js';
import {createVegetation} from './vegetation.js';
import {createLawn} from './lawn.js';
import {createShrubs} from './shrubs.js';
export function createCampus(C,{grassDensity=96}={}){
 const root=new T.Group();root.name='HuaduCampus';const bins=new Map(),meta=[];
 const colors={wall:0xe3e4dd,wallDark:0xbfc9c7,white:0xf4f3e9,roof:0xcbd3ce,glass:0x5b808c,glassLight:0x8ba5aa,red:0xad716a,stone:0xd0d2c7,road:0xd4d9d3,grass:0x93ad7d,water:0x6c9496,soil:0xaba88f,track:0xb8806a,court:0x639b9a,wood:0xa48d68,bark:0x7e8064,leaf:0x648758,leaf2:0x7c9c66,leaf3:0x96ae7a};
 const materials=Object.fromEntries(Object.entries(colors).map(([k,v])=>[k,new T.MeshStandardMaterial({color:v,roughness:k.startsWith('glass')?.25:k==='water'?.16:.86,metalness:k.startsWith('glass')?.25:k==='water'?.28:0})]));
 const geom={box:new T.BoxGeometry(1,1,1),sphere:new T.SphereGeometry(1,15,11),cylinder:new T.CylinderGeometry(1,1,1,10)};
 function item(kind,mat,x,y,z,w,h,d,id=null){const key=kind+':'+mat;if(!bins.has(key))bins.set(key,{kind,mat,items:[]});bins.get(key).items.push({x,y,z,w,h,d,id})}
 const box=(mat,x,y,z,w,h,d,id)=>item('box',mat,x+w/2,y+h/2,z+d/2,w,h,d,id);
 function wing(x,z,w,d,height,id,floors=5){
  box('wall',x,0,z,w,height,d,id);box('roof',x+.12,height,z+.12,w-.24,.12,d-.24,id);
  for(let row=0;row<floors;row++){
   const y=.45+row*(height-.7)/floors;
   for(let col=.32;col<w-.2;col+=.72){box('glass',x+col,y,z+d+.015,.39,.48,.035,id);box('glassLight',x+col,y,z-.05,.39,.48,.035,id)}
   for(let col=.28;col<d-.2;col+=.65){box('glass',x+w+.012,y,z+col,.035,.48,.34,id);box('glassLight',x-.045,y,z+col,.035,.48,.34,id)}
   box('white',x,y+.53,z+d+.02,w,.09,.06,id);box('white',x+w+.018,y+.53,z,.06,.09,d,id);
  }
  for(const q of [[x,height,z,w,.22,.12],[x,height,z+d-.12,w,.22,.12],[x,height,z,.12,.22,d],[x+w-.12,height,z,.12,.22,d]])box('white',...q,id);
 }
 box('soil',1,-.7,1,47,.6,65);box('grass',1,-.1,1,47,.1,65);
 box('water',-2,-.12,1,2,.12,65);box('stone',.2,-.07,1,.65,.13,65);
 for(const [x,z,w,d] of [...C.roads,...C.plazas])box('road',x,.005,z,w,.025,d);
 for(let z=33;z<41;z+=.5)box('stone',5,.04,z,21,.008,.018);
 for(let x=5;x<26;x+=.5)box('stone',x,.04,33,.018,.008,8);
 for(const b of C.buildings){
  const h=b.z/18,id=b.id;
  if(b.kind==='library'){
   // Explicitly identified school photos: broad portal frame, open void, full-height columns.
   wing(7,26,3.9,6,6.4,id,6);wing(10.9,26,8.1,1.5,6.4,id,6);wing(17,27.5,2,3.5,6.4,id,6);
   box('white',10.9,5.5,31.1,8.1,.9,.9,id);box('white',18.25,0,31.1,.75,5.5,.9,id);
   for(const x of [13.2,14.4,15.6,16.8])box('wallDark',x,.2,29.9,.28,5.3,.36,id);
   box('glass',11.1,1.9,28.0,5.6,2.9,.045,id);
   for(let k=0;k<12;k++)box('stone',11.1,.025,33.2-k*.2,5.7,.13*(k+1),.22,id);
   box('wallDark',10.88,1.7,29.9,6.1,.25,1.2,id);
   for(let r=1;r<=5;r++)box('white',7,r*1.0,32.06,3.9,.08,.08,id);
   box('roof',8.2,6.64,27,1.2,.5,1.3,id);box('roof',16.3,6.64,26.6,1.5,.4,1.2,id);
   box('white',7.2,.6,32.13,1.55,5.2,.055,id);
  }else if(b.kind==='courtyard'||b.kind==='dorm'){
   wing(b.x,b.y,b.w,1.25,h,id,6);wing(b.x,b.y+1.25,1.25,b.h-1.25,h,id,6);wing(b.x+b.w-1.25,b.y+1.25,1.25,b.h-1.25,h,id,6);wing(b.x+1.25,b.y+b.h-1.25,b.w-2.5,1.25,h,id,6);
  }else if(b.kind==='gym'){
   box('wallDark',b.x,0,b.y,b.w,.7,b.h,id);box('white',b.x,.7,b.y,b.w,h-.7,b.h,id);box('roof',b.x+.1,h,b.y+.1,b.w-.2,.16,b.h-.2,id);
   for(let x=b.x+.7;x<b.x+b.w-.3;x+=1)box('wallDark',x,1,b.y+b.h+.015,.13,h-1.5,.03,id);
   box('glass',b.x+.6,.4,b.y+b.h+.03,b.w-1.2,.8,.04,id);
   for(let z=b.y+.5;z<b.y+b.h;z+=1)box('stone',b.x,h+.18,z,b.w,.035,.035,id);
  }else{wing(b.x,b.y,b.w,b.h,h,id,b.kind==='apartments'?8:6);box('roof',b.x+.6,h+.22,b.y+.5,1.7,.5,1.4,id)}
  // Building-specific detail: balconies for residences, shaded entrances for teaching and service blocks.
  if(['dorm','apartments'].includes(b.kind)){
   const levels=b.kind==='apartments'?8:6;
   for(let f=1;f<levels;f++){const y=.42+f*(h-.7)/levels;for(let k=.5;k<b.w-.7;k+=1.4){box('white',b.x+k,y,b.y+b.h,1.15,.09,.48,id);box('wallDark',b.x+k,y+.1,b.y+b.h+.41,1.15,.26,.055,id);for(let r=0;r<4;r++)box('white',b.x+k+r*.36,y+.1,b.y+b.h+.44,.025,.3,.025,id)}}
  }
  if(['teaching','art','canteen'].includes(b.kind)){
   const w=Math.min(3.1,b.w-1),x=b.x+(b.w-w)/2,z=b.y+b.h;
   box('white',x,1.25,z,w,.15,1,id);box('glass',x+.25,.15,z+.03,w-.5,1.05,.035,id);box('wallDark',x+.1,0,z+.72,.12,1.25,.12,id);box('wallDark',x+w-.22,0,z+.72,.12,1.25,.12,id);
   for(let c=.25;c<b.w-.2;c+=1.15)box('white',b.x+c,.5,z+.08,.065,h-.7,.28,id);
  }
  if(b.kind==='gym'){
   const roofShape=new T.Shape();roofShape.moveTo(-b.w/2,0);roofShape.quadraticCurveTo(0,1.25,b.w/2,0);roofShape.lineTo(b.w/2,-.15);roofShape.quadraticCurveTo(0,1.05,-b.w/2,-.15);roofShape.closePath();
   const vault=new T.Mesh(new T.ExtrudeGeometry(roofShape,{depth:b.h,bevelEnabled:false,curveSegments:20}),materials.white);vault.position.set(b.x+b.w/2,h+.15,b.y);vault.castShadow=true;vault.receiveShadow=true;root.add(vault);
   for(let z=b.y+.35;z<b.y+b.h;z+=.85){const pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push(new T.Vector3(b.x+t*b.w,h+.18+2*1.25*t*(1-t),z))}root.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0xb8c5c2})))}
  }
  meta.push({id,box:[b.x,0,b.y,b.w,h,b.h],name:b.label||'宿舍建筑'});
 }
 const p=C.pond;box('stone',p.x-.15,-.015,p.y-.15,p.w+.3,.09,p.h+.3);box('water',p.x,.08,p.y,p.w,.025,p.h);
 for(const q of [[p.x-.15,.04,p.y-.15,p.w+.3,.16,.15],[p.x-.15,.04,p.y+p.h,p.w+.3,.16,.15],[p.x-.15,.04,p.y,.15,.16,p.h],[p.x+p.w,.04,p.y,.15,.16,p.h]])box('white',...q);
 for(let z=p.y+.3;z<p.y+p.h;z+=.52)box('glassLight',p.x+.2,.11,z,p.w-.4,.003,.018);
 // Sports field: shape and markings are geometry and remain correct when the camera rotates.
 function stadium(radius){const s=new T.Shape();s.moveTo(-radius,-4.5);s.absarc(0,-4.5,radius,Math.PI,2*Math.PI,false);s.lineTo(radius,4.5);s.absarc(0,4.5,radius,0,Math.PI,false);s.closePath();return s}
 const outer=new T.Mesh(new T.ShapeGeometry(stadium(5),32),materials.track);outer.rotation.x=-Math.PI/2;outer.position.set(41,.06,42.5);root.add(outer);
 const inner=new T.Mesh(new T.ShapeGeometry(stadium(3.6),32),materials.grass);inner.rotation.x=-Math.PI/2;inner.position.set(41,.07,42.5);root.add(inner);
 const paint=new T.LineBasicMaterial({color:0xe8e9df});
 for(let k=.2;k<1.3;k+=.22){const points=stadium(5-k).getPoints(80).map(p=>new T.Vector3(41+p.x,.085,42.5-p.y));root.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(points),paint))}
 for(const q of [[37.9,.1,37,6.2,.015,.035],[37.9,.1,48,6.2,.015,.035],[37.9,.1,37,.035,.015,11],[44.1,.1,37,.035,.015,11],[37.9,.1,42.5,6.2,.015,.035]])box('white',...q);
 for(let row=0;row<2;row++)for(let col=0;col<3;col++){const x=36+col*3.2,z=25+row*3.2;box('court',x,.045,z,2.8,.02,2.8);box('track',x+.6,.07,z+.2,1.6,.01,2.4);box('white',x+.05,.085,z+1.4,2.7,.008,.025);for(const q of [[x+.1,.085,z+.1,2.6,.008,.025],[x+.1,.085,z+2.7,2.6,.008,.025],[x+.1,.085,z+.1,.025,.008,2.6],[x+2.7,.085,z+.1,.025,.008,2.6]])box('white',...q)}
 const vegetation=createVegetation(C);root.add(vegetation.root);
 box('soil',5.5,.035,40.75,16.4,.025,.7);
 box('stone',5.5,.03,40.71,16.4,.065,.04);box('stone',5.5,.03,41.45,16.4,.065,.04);
 const shrubs=createShrubs(C,vegetation.materials);root.add(shrubs.root);
 // Shide Garden reference: waterside motto stone, lawn, low white exhibition canopy.
 const garden=new T.Group();garden.name='ShideGarden';root.add(garden);
 box('grass',25.15,.04,39.2,7.7,.014,14.5);
 for(const [x,z,w,d] of [[25.7,45.1,6.4,1.15],[26,46.25,1.05,3.7],[30.8,46.25,1.05,3.7],[26,49.65,6,.65],[28.25,46.2,1.4,3.5]])box('road',x,.061,z,w,.015,d);
 const add=(geometry,mat,x,y,z)=>{const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;garden.add(m);return m};
 const stoneShape=new T.Shape();stoneShape.moveTo(-1.5,0);stoneShape.lineTo(-1.66,.67);stoneShape.lineTo(-1.35,1.03);stoneShape.lineTo(-.7,1.1);stoneShape.lineTo(.15,1.22);stoneShape.lineTo(.8,1.13);stoneShape.lineTo(.87,.91);stoneShape.lineTo(1.5,.86);stoneShape.lineTo(1.43,.4);stoneShape.lineTo(1.3,0);stoneShape.closePath();
 const stoneGeometry=new T.ExtrudeGeometry(stoneShape,{depth:.48,bevelEnabled:true,bevelSize:.07,bevelThickness:.06,bevelSegments:5,curveSegments:12}),stonePositions=stoneGeometry.attributes.position;
 for(let i=0;i<stonePositions.count;i++){const x=stonePositions.getX(i),y=stonePositions.getY(i),z=stonePositions.getZ(i),noise=Math.sin(x*19+y*31+z*13)*.018;stonePositions.setXYZ(i,x+noise,y+noise*.55,z+noise*.35)}stoneGeometry.computeVertexNormals();
 const mottoStone=add(stoneGeometry,new T.MeshStandardMaterial({color:0xc5a274,roughness:1}),29,.12,44.05);mottoStone.name='MottoStone';mottoStone.userData.location='garden';
 box('grass',25.2,.045,43.5,7.3,.055,1.8);box('grass',25.2,.045,47.2,7.3,.055,1.55);
 box('white',25.7,1.55,50.35,6.5,.14,1.55,'garden');box('wallDark',25.85,.04,51.58,6.18,1.48,.09,'garden');
 for(let x=25.9;x<32;x+=1.15){box('white',x,.06,50.45,.065,1.49,.065);box('wood',x+.12,.17,51.46,.87,1.23,.055)}
 for(let x=25.6;x<32.5;x+=.48)box('stone',x,.06,49.95,.43,.035,.55);
 box('wood',27,.085,43.15,4.6,.075,.6);for(let x=27.15;x<31.6;x+=.18)box('wallDark',x,.165,43.17,.018,.009,.56);
 // Irregular shore stones, planted flower borders and small ground lights.
 for(let i=0;i<32;i++){const x=26.9+i*.157,z=40.7+(i%3)*.075;const rock=add(new T.DodecahedronGeometry(.08+(i%4)*.018,1),materials.stone,x,.12,z);rock.scale.set(1.25,.7,1)}
 for(let i=0;i<30;i++){const x=25.45+(i%15)*.48,z=i<15?48.85:53.05;if(i%3===0){const flower=add(new T.SphereGeometry(.035,8,5),new T.MeshStandardMaterial({color:i%2?0xd5c79b:0xc09085,roughness:1}),x,.41,z);flower.scale.set(1.4,.6,1.4)}}
 for(const [x,z] of [[26.2,46.5],[31.6,46.5],[26.2,49.8],[31.6,49.8]]){box('wallDark',x,.05,z,.1,.24,.1);box('white',x-.015,.28,z-.015,.13,.035,.13)}
 garden.userData.reference='https://static.nfnews.com/content/202512/03/c11964565.html';garden.userData.features=['motto-stone','waterfront','exhibition-canopy','planting'];
 // Scene geometry and movement obstacles share the same furnishing coordinates.
 for(const [x,z] of C.furnishings.benches){for(let i=0;i<4;i++)box('wood',x,.37,z+i*.085,1.25,.055,.065);for(let i=0;i<3;i++)box('wood',x,.55+i*.12,z+.32,1.25,.08,.055);for(const dx of [.12,1.0])box('wallDark',x+dx,.02,z+.02,.08,.38,.32)}
 for(let z=14;z<61;z+=6){item('cylinder','wallDark',22.7,.9,z,.035,1.8,.035);box('wallDark',22.68,1.78,z,.54,.055,.055);box('white',23.05,1.71,z-.07,.25,.08,.18)}
 for(const [x,z] of C.furnishings.planters)box('stone',x,.03,z,.55,.38,.55);
 const dummy=new T.Object3D(),pickables=[];
 for(const bin of bins.values()){
  const mesh=new T.InstancedMesh(geom[bin.kind],materials[bin.mat],bin.items.length);mesh.name=bin.kind+'-'+bin.mat;mesh.userData.items=bin.items;
  bin.items.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.scale.set(v.w,v.h,v.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.instanceMatrix.needsUpdate=true;
  mesh.castShadow=!['road','grass','water','stone'].includes(bin.mat);mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);pickables.push(mesh);
 }
 const lawn=createLawn(C,[...bins.values()].flatMap(b=>b.kind==='box'?b.items.map(v=>({...v,mat:b.mat})):[]),{density:grassDensity});root.add(lawn.root);
 root.updateMatrixWorld(true);
 return {root,pickables,gardenPickables:[mottoStone],metadata:meta,materials,vegetation,shrubs,garden,lawn,batches:bins.size,instances:[...bins.values()].reduce((n,b)=>n+b.items.length,0),hotspots:[
  {id:'frame',name:'门形框架',point:[16.4,6.35,32.4],camera:[24,12,44],title:'把天空，留在建筑之间',text:'学校发布的花都图书馆照片中，大尺度门形框架形成醒目的开放空间。模型以明确归属的实景照片为依据，重建其体量和开口关系。',photo:'library-official-3.jpg'},
  {id:'entrance',name:'立柱与台阶',point:[14.5,1.7,32.8],camera:[21,6,41],title:'走近通高立柱与入口台阶',text:'通高立柱与逐级台阶，是照片中清楚可辨的入口特征。当前先通过相邻地面道路参观，室内用实景资料继续介绍。',photo:'library-official-3.jpg'},
  {id:'hall',name:'馆内入口',point:[10.3,1.8,32.3],camera:[18,8,41],title:'走进书页之间',text:'学校图文提供了馆内入口照片，用户VR录屏还提供了大厅画面。两类资料分别标注来源，不把录屏截图当成原始全景。',photo:'library-official-4.jpg'}
  ]};
}
