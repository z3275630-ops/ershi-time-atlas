import {CHAPTERS,BY_ID} from './adventure-data.js';
export const SAVE_KEY='ershi-campus-adventure-v1',PROFILE_KEY='ershi-adventure-profile-v1';
const ids=CHAPTERS.map(c=>c.id),date=()=>new Date().toISOString(),unique=a=>[...new Set(a)];
export function fresh(){return {schema:1,started:false,active:'library',following:null,quests:Object.fromEntries(ids.map(id=>[id,{observed:[],steps:[],solved:false,collected:false,completedAt:null,visits:0}])),demo:{place:'library',stamps:[]},updatedAt:date()}}
export function clean(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.schema!==1)throw Error('这不是兼容的校园寻宝存档。');
 const state=fresh();state.started=!!input.started;state.active=ids.includes(input.active)?input.active:'library';
 for(const c of CHAPTERS){const q=input.quests?.[c.id];if(!q||typeof q!=='object')continue;const observations=c.clues.map(v=>v.id);state.quests[c.id]={observed:unique(Array.isArray(q.observed)?q.observed.filter(v=>observations.includes(v)):[]),steps:[],solved:!!q.solved,collected:!!q.collected,completedAt:typeof q.completedAt==='string'&&Number.isFinite(Date.parse(q.completedAt))?q.completedAt:null,visits:Number.isInteger(q.visits)?Math.max(0,Math.min(q.visits,3)):0};const next=state.quests[c.id];
  // Reward flags cannot manufacture completion without the task prerequisite.
  if(next.solved&&next.observed.length===c.clues.length){next.steps=[...c.answer]}else{next.solved=false;next.collected=false;next.completedAt=null;const raw=Array.isArray(q.steps)?q.steps:[];for(let i=0;i<Math.min(raw.length,c.answer.length);i++){if(raw[i]!==c.answer[i])break;next.steps.push(raw[i])}}
  if(!next.collected)next.completedAt=null;
 }
 state.following=ids.includes(input.following)&&state.quests[input.following].collected?input.following:null;
 state.demo={place:ids.includes(input.demo?.place)?input.demo.place:'library',stamps:unique(Array.isArray(input.demo?.stamps)?input.demo.stamps.filter(v=>ids.includes(v)):[])};return state;
}
export function migrateLegacy(legacy){const state=fresh();if(legacy&&Number.isInteger(legacy.stage)&&legacy.stage>0){state.started=true;state.quests.library.observed=legacy.stage>=2?CHAPTERS[0].clues.map(c=>c.id):[];if(legacy.stage===3){Object.assign(state.quests.library,{steps:[...CHAPTERS[0].answer],solved:true,collected:true,completedAt:date()});state.active='garden'}}return state}
export function loadGame(storage,legacy){
 try{const raw=storage.getItem(SAVE_KEY);if(!raw)return {state:migrateLegacy(legacy),warning:null};return {state:clean(JSON.parse(raw)),warning:null}}catch(error){return {state:migrateLegacy(legacy),warning:'寻宝存档暂时无法读取，原始数据仍保留。你可以先游玩，或在“存档”中导出原始数据。',corrupt:true}}
}
export const total=s=>ids.filter(id=>s.quests[id].collected).length;
export const nextChapter=s=>CHAPTERS.find(c=>!s.quests[c.id].collected)||CHAPTERS[0];
export function applyEvent(current,event){
 const state=structuredClone(current),c=BY_ID[event.id],q=c&&state.quests[c.id];let accepted=true,message='',reward=false;
 switch(event.type){
  case 'start':state.started=true;state.active=nextChapter(state).id;break;
  case 'active':if(c)state.active=c.id;else accepted=false;break;
  case 'observe':if(q&&c.clues.some(v=>v.id===event.clue)){q.observed=unique([...q.observed,event.clue]);state.started=true;state.active=c.id}else accepted=false;break;
  case 'step':{
   if(!q||q.collected||q.observed.length<c.clues.length){accepted=false;message='先观察完三条线索，再开始互动。';break}
   const correct=c.answer[q.steps.length];if(event.choice===correct){q.steps.push(event.choice);q.solved=q.steps.length===c.answer.length;message=q.solved?'线索连起来了，精灵愿意与你同行。':'这一步对了，继续。'}else{accepted=false;message='再看看线索，这次没有扣除任何收藏。'}break;
  }
  case 'retry':if(q&&!q.collected){q.steps=[];q.solved=false}else accepted=false;break;
  case 'collect':if(q&&q.solved&&!q.collected){q.collected=true;q.completedAt=date();state.active=nextChapter(state).id;if(!state.following)state.following=c.id;reward=true;message=c.name+'加入了伙伴图鉴。'}else{accepted=false;message=q?.collected?'已经收集过啦，记忆一直在。':'先完成线索互动。'}break;
  case 'follow':if(q?.collected){state.following=c.id;message=c.name+'将陪你一起漫游校园。'}else accepted=false;break;
  case 'visit':if(q?.collected){q.visits=Math.min(3,q.visits+1);message='与'+c.name+'的羁绊更深了一点。'}else accepted=false;break;
  case 'demo-place':if(c)state.demo.place=c.id;else accepted=false;break;
  case 'demo-stamp':if(c)state.demo.stamps=unique([...state.demo.stamps,c.id]);else accepted=false;break;
  default:accepted=false;
 }
 if(accepted)state.updatedAt=date();return {state:accepted?state:current,accepted,message,reward};
}
export function mergeGames(local,remote){
 const a=clean(local),b=clean(remote);a.started=a.started||b.started;
 for(const c of CHAPTERS){const x=a.quests[c.id],y=b.quests[c.id];x.observed=unique([...x.observed,...y.observed]);x.solved=x.solved||y.solved;x.collected=x.collected||y.collected;x.steps=x.solved?[...c.answer]:(x.steps.length>=y.steps.length?x.steps:y.steps);x.visits=Math.max(x.visits,y.visits);x.completedAt=[x.completedAt,y.completedAt].filter(Boolean).sort()[0]||null}
 // Simulated footprints remain local and never become real visit data.
 a.demo=structuredClone(local.demo||fresh().demo);a.updatedAt=date();return clean(a);
}
export function cloudPayload(state){const normalized=clean(state);delete normalized.demo;return {schema:1,started:normalized.started,active:normalized.active,following:normalized.following,quests:normalized.quests,updatedAt:normalized.updatedAt}}
