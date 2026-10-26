import {driver} from './vendor/driver.js.mjs';
const STORE='ershi-first-walk-tour-v1';
export function createTutorial(actions){
 let tour=null,current=-1,done=new Set(),lastFocus=null,closed=true,moveDistance=0;
 const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
 const write=data=>{try{localStorage.setItem(STORE,JSON.stringify(data))}catch{}};
 const small=()=>window.innerWidth<=900;
 const steps=[
  {title:'欢迎来到新生拾光',text:'花约3分钟学会校园探索。教程会带你实际操作；可以随时点右上角×跳过，并从“新手引导”重新开始。',prepare:()=>actions.overview()},
  {element:'#canvas',title:'① 换个角度看校园',text:'在校园画面里按住左键拖动，手机用单指拖动，试着旋转一下。完成后，“下一步”会亮起。',require:'orbit'},
  {element:'#zoom-in',title:'② 把建筑拉近一点',text:'点击高亮的“＋”按钮拉近；以后也可以用滚轮或双指缩放。',require:'zoom'},
  {element:()=>document.querySelector(small()?'#places-mobile':'#place-list [data-place="library"]'),title:'③ 找到图书馆',text:small()?'点“地点”，再选择“图书馆”，打开它的介绍。':'点击左侧“图书馆”。镜头会拉近，同时打开场馆介绍。',require:'library'},
  {element:'.venue-tabs',title:'④ 从模型走进实景',text:'点击“实景照片”，看看有明确来源的图书馆照片。照片可以再点开放大，其他页签还有视频和原始VR。',require:'photos',prepare:()=>actions.library()},
  {element:'[data-mode="walk"]',title:'⑤ 切换人物漫游',text:'点击“人物漫游”，从总览转到角色视角。',require:'walk-mode'},
  {element:'#canvas',title:'⑥ 沿校园小路走几步',text:'电脑按WASD或方向键，手机按左下方向按钮；点击道路可自动前往。左上可选男生或女生，电脑也可按C切换。请实际移动一小段。',require:'move',prepare:()=>actions.focusCanvas()},
  {element:'#guide-launch',title:'⑦ 向拾光向导提问',text:'点击向导入口，打开共享对话。它能解释当前地点，并给你任务线索。',require:'chat'},
  {element:'#chat-form',title:'⑧ 试着问一个问题',text:'输入“图书馆是哪年建成的”，再点击发送。当前回复为附出处的本地资料，真实AI接口尚未接入。',require:'ask'},
  {title:'准备好，开始你的校园故事',text:'你已经学会浏览、查看实景、行走和提问。现在可以回到图书馆，完成“来路”记忆页；需要复习时再点“新手引导”。'}
 ];
 function refreshButtons(){if(!tour?.isActive())return;const required=steps[current]?.require,b=document.querySelector('.driver-popover-next-btn'),status=document.querySelector('.tour-check');if(b)b.disabled=!!required&&!done.has(required);if(status){status.textContent=required?(done.has(required)?'✓ 已完成，可以继续':'请先完成这一小步'):'可以随时跳过或重新学习';status.classList.toggle('finished',!!required&&done.has(required))}}
 function start(){if(tour?.isActive())tour.destroy();closed=false;done=new Set();moveDistance=0;lastFocus=document.activeElement;actions.prepare();write({...read(),seen:true,completed:false});
  tour=driver({animate:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,allowClose:true,allowKeyboardControl:false,disableActiveInteraction:false,overlayClickBehavior:'none',overlayOpacity:.38,stagePadding:8,stageRadius:8,popoverClass:'campus-tour',showProgress:true,progressText:'{{current}} / {{total}}',nextBtnText:'下一步 →',prevBtnText:'上一步',doneBtnText:'开始自由探索',closeBtnText:'跳过教程',steps:steps.map((s,i)=>({element:s.element,onHighlightStarted:()=>{current=i;document.body.dataset.tourAction=s.require||'intro';actions.clearInput();s.prepare?.()},onHighlighted:()=>{if(i===6)setTimeout(()=>{if(current===6&&tour?.isActive())actions.focusCanvas()},30)},popover:{title:s.title,description:s.text+'<p class="tour-check" aria-live="polite"></p>',side:i===1||i===6?'bottom':'bottom',align:'center'}})),onPopoverRender:p=>{p.closeButton?.setAttribute('aria-label','跳过教程');refreshButtons()},onNextClick:()=>{const req=steps[current]?.require;if(req&&!done.has(req)){refreshButtons();return}tour.moveNext()},onDestroyed:()=>{closed=true;delete document.body.dataset.tourAction;actions.clearInput();write({...read(),seen:true});if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true})}});
  // v1.3.6 uses onNextClick for the last button as well; mark completion before moving past it.
  const config=tour.getConfig();tour.setConfig({...config,onNextClick:()=>{const req=steps[current]?.require;if(req&&!done.has(req))return;if(current===steps.length-1)write({seen:true,completed:true});tour.moveNext()}});tour.drive();
 }
 return {start,autoStart(){if(!read().seen)start()},signal(type,amount=0){if(closed||!tour?.isActive())return;if(steps[current]?.require===type){if(type==='move'){moveDistance+=amount;if(moveDistance<.45)return}done.add(type);refreshButtons()}},isActive:()=>!!tour?.isActive(),currentAction:()=>steps[current]?.require,refresh(){if(tour?.isActive())tour.refresh()},close(){tour?.destroy()},progress:()=>({current,completed:[...done],active:!!tour?.isActive()})};
}
