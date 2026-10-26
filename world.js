/* Campus geometry is an illustrative adaptation of the 2025 published site plan.
 * Projection and art are project code; pathfinding is the unmodified EasyStar library. */
(function(root){
 'use strict';
 const W=49,H=67,OX=2110,OY=170,TW=30,TH=15;
 const roads=[[3,2,3,63],[46,2,2,64],[3,2,45,2],[3,64,45,2],[23,2,3,63],[3,13,44,2],[3,23,44,2],[3,39,32,3],[3,47,32,2],[3,54,44,2],[3,59,33,3],[32,24,3,40],[18,32,8,3],[18,43,8,6],[26,45,8,3]];
 const plazas=[[5,32,21,9],[25,39,8,15],[31,55,6,9]];
 const buildings=[
  {id:'teacher',x:6,y:5,w:7,h:5,z:115,kind:'apartments',label:'教工公寓'},
  {id:'teacher2',x:14,y:5,w:6,h:5,z:110,kind:'apartments'},
  {id:'dorm1',x:28,y:5,w:7,h:7,z:90,kind:'dorm',label:'学生宿舍'},
  {id:'dorm2',x:38,y:5,w:7,h:7,z:90,kind:'dorm'},
  {id:'canteen',x:6,y:16,w:14,h:6,z:84,kind:'canteen',label:'生活区'},
  {id:'dorm3',x:28,y:16,w:7,h:6,z:88,kind:'dorm'},
  {id:'dorm4',x:38,y:16,w:7,h:6,z:88,kind:'dorm'},
  {id:'library',x:7,y:26,w:12,h:6,z:102,kind:'library',label:'图书馆'},
  {id:'teaching',x:6,y:43,w:14,h:3,z:87,kind:'teaching',label:'教学楼'},
  {id:'training',x:6,y:50,w:13,h:7,z:86,kind:'courtyard',label:'教师教育实训楼'},
  {id:'lab',x:7,y:62,w:12,h:2,z:74,kind:'teaching',label:'实验楼'},
  {id:'art',x:26,y:57,w:5,h:7,z:87,kind:'art',label:'艺术楼'},
  {id:'gym',x:38,y:57,w:8,h:7,z:84,kind:'gym',label:'体育馆'}
 ];
 // The VR scene title is the viewpoint, not proof that the water feature belongs to the library.
 const pond={x:27,y:41,w:3,h:2};
 const gardenTrees=[[25.5,40.8,3.4],[32.3,40,3.8],[25.7,45.5,3],[32.3,46.2,3.5],[25.6,52.9,3.7],[32.1,53.3,3.5]];
 const gardenObstacles=[[27.35,44.05,3.3,.7],[25.8,51.4,6.3,.35],...gardenTrees.map(([x,z])=>[x-.15,z-.15,.3,.3])];
 const furnishings={benches:[[6.4,41.6],[10.6,41.6],[20.7,32],[26.8,49.4],[30,49.4]],planters:[[6.2,41.4],[20.5,41.4],[26.1,48.3],[31,44]]};
 const shrubs=[];
 for(let i=0;i<20;i++)shrubs.push({area:'library',x:6+i*.8,z:41.1,y:.04,w:.83+(i%3)*.025,h:.43+(i%5)*.018,d:.50+(i%3)*.025,angle:((i%5)-2)*.055});
 for(const z of [48.85,53.05])for(let i=0;i<15;i++)shrubs.push({area:'garden',x:25.45+i*.48,z,y:.075,w:.57,h:.25+(i%4)*.012,d:.36,angle:((i%5)-2)*.055});
 for(const [x,z] of furnishings.planters)shrubs.push({area:'planter',x:x+.275,z:z+.275,y:.4,w:.59,h:.4,d:.59,angle:.12});
 const locations=[
  {id:'library',name:'图书馆',note:'首个完整任务 · 名字里的来路',icon:'▤',x:18,y:34,building:'library',labelX:14,labelY:32},
  {id:'garden',name:'师德园',note:'水景、石刻与育人故事',icon:'❋',x:29,y:46,labelX:29,labelY:49},
  {id:'teaching',name:'教学与艺术区',note:'走过求学的日常',icon:'▥',x:19,y:47,building:'teaching',labelX:16,labelY:46},
  {id:'sports',name:'体育运动区',note:'田径场、球场与体育馆',icon:'◉',x:34,y:52,building:'gym',labelX:41,labelY:52},
  {id:'community',name:'学生社区',note:'服务中心任务预留',icon:'⌂',x:19,y:24,building:'canteen',labelX:14,labelY:22}
 ];
 const spawn={x:22.5,y:37.5},guide={x:21.5,y:38.5};
 const rect=(x,y,r)=>x>=r[0]&&y>=r[1]&&x<r[0]+r[2]&&y<r[1]+r[3];
 const grid=Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>roads.some(r=>rect(x,y,r))||plazas.some(r=>rect(x,y,r))?1:0));
 for(const b of buildings)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)grid[y][x]=0;
 for(let y=pond.y;y<pond.y+pond.h;y++)for(let x=pond.x;x<pond.x+pond.w;x++)grid[y][x]=0;
 // Raised library steps are viewed from the adjoining ground-level entrance route in this prototype.
 for(let y=32;y<34;y++)for(let x=11;x<17;x++)grid[y][x]=0;
 for(const [x,y,w,h] of [...furnishings.benches.map(([x,y])=>[x,y,1.25,.4]),...furnishings.planters.map(([x,y])=>[x,y,.55,.55]),...gardenObstacles,...shrubs.filter(p=>p.area==='library').map(p=>[p.x-p.w/2,p.z-p.d/2,p.w,p.d])])for(let yy=Math.floor(y);yy<Math.ceil(y+h);yy++)for(let xx=Math.floor(x);xx<Math.ceil(x+w);xx++)grid[yy][xx]=0;
 // Courts and track are scenery; movement stays on shared paths around them.
 const project=(x,y,z=0)=>({x:OX+(x-y)*TW,y:OY+(x+y)*TH-z});
 const unproject=(x,y)=>({x:((x-OX)/TW+(y-OY)/TH)/2,y:((y-OY)/TH-(x-OX)/TW)/2});
 const walkable=(x,y)=>grid[Math.floor(y)]?.[Math.floor(x)]===1;
 function nearest(x,y,radius=3){
  let best=null,distance=Infinity;
  for(let yy=Math.max(0,Math.floor(y)-radius);yy<Math.min(H,Math.floor(y)+radius+1);yy++)for(let xx=Math.max(0,Math.floor(x)-radius);xx<Math.min(W,Math.floor(x)+radius+1);xx++){
   const d=Math.hypot(xx+.5-x,yy+.5-y);if(grid[yy][xx]&&d<distance){best={x:xx,y:yy};distance=d}
  }
  return distance<=radius+.5?best:null;
 }
 const data={W,H,OX,OY,TW,TH,roads,plazas,buildings,pond,furnishings,shrubs,gardenTrees,gardenObstacles,locations,spawn,guide,grid,project,unproject,walkable,nearest};
 root.CampusWorld=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
