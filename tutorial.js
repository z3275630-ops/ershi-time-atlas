import {driver} from './vendor/driver.js.mjs';
const STORE='ershi-adventure-tour-v1';
export function createTutorial(actions){
 let tour=null,current=-1,done=new Set(),lastFocus=null,closed=true,moveDistance=0;
 const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
 const write=data=>{try{localStorage.setItem(STORE,JSON.stringify(data))}catch{}};
 const small=()=>window.innerWidth<=900;
 const steps=[
  {title:'欢迎来到校园寻宝',text:'花约3分钟学会校园探索。教程会带你实际操作；可以随时点右上角×跳过，并从“新手引导”重新开始。',prepare:()=>actions.overview()},
  {element:'#canvas',title:'① 换个角度看校园',text:'在校园画面里按住左键拖动，手机用单指拖动，试着旋转一下。完成后，“下一步”会亮起。',require:'orbit'},
  {element:'#zoom-in',title:'② 把建筑拉近一点',text:'点击高亮的“＋”按钮拉近；以后也可以用滚轮或双指缩放。',require:'zoom'},
  {element:()=>document.querySelector(small()?'#places-mobile':'#place-list [data-place="library"]'),title:'③ 找到图书馆',text:small()?'点“地点”，再选择“图书馆”，打开它的介绍。':'点击左侧“图书馆”。镜头会拉近，同时打开场馆介绍。',require:'library'},
  {element:'.venue-tabs',title:'④ 从模型走进实景',text:'点击“实景照片”，看看有明确来源的图书馆照片。照片可以再点开放大，其他页签还有视频和原始VR。',require:'photos',prepare:()=>actions.library()},
  {element:'[data-mode="walk"]',title:'⑤ 切换人物漫游',text:'点击“人物漫游”，从总览转到角色视角。',require:'walk-mode'},
  {element:'#canvas',title:'⑥ 沿校园小路走几步',text:'电脑按WASD或方向键，手机按左下方向按钮；点击道路可自动前往。左上可选男生或女生，电脑也可按C切换。请实际移动一小段。',require:'move',prepare:()=>actions.focusCanvas()},
  {element:'#guide-launch',title:'⑦ 向拾光向导提问',text:'点击向导入口，打开共享对话。它能解释当前地点，并给你任务线索。',require:'chat'},
  {element:'#chat-form',title:'⑧ 试着问一个问题',text:'输入“图书馆是哪年建成的”，再点击发送。当前回复为附出处的本地资料，真实AI接口尚未接入。',require:'ask'},
  {element:'#quest-open',title:'⑨ 领取缺页记忆册',text:'点击“开始寻宝”或“查看任务”，打开任务书；第一次游玩时，再点“接过记忆册”。',require:'book',prepare:()=>actions.prepare()},
  {element:'#adventure-modal',title:'⑩ 先观察，再行动',text:'打开图书馆任务，点击任意一张线索卡。资料有出处，精灵对白与创作引导会单独标注。',require:'clue',prepare:()=>actions.quest?.()},
  {element:'#adventure-modal',title:'⑪ 把三条线索连起来',text:'读完三条线索，再把学校名字按出现顺序排列。这里没有限时，答错可以继续；需要时点“看一点提示”。',require:'puzzle',prepare:()=>actions.quest?.()},
  {element:'#adventure-modal',title:'⑫ 和页页成为伙伴',text:'互动完成后，点“向页页伸出手”。你会同时获得书页精灵和“来路”记忆页。已完成的玩家可直接继续。',require:'collect',prepare:()=>actions.quest?.()},
  {element:'.adventure-nav [data-game="inventory"]',title:'⑬ 打开精灵图鉴',text:'点击“精灵图鉴”，看看已经相遇的伙伴。以后可以回访精灵，让羁绊慢慢成长。',require:'inventory',prepare:()=>actions.closeGame?.()},
  {element:'#adventure-modal',title:'⑭ 认清定位演示',text:'这里仅模拟位置，没有读取GPS。演示印章不会计入真实足迹，也不会增加正式收藏。你在校外也可以完成全部线上故事。',prepare:()=>actions.demo?.()},
  {title:'准备好，开始你的校园故事',prepare:()=>actions.closeGame?.(),text:'你已经学会浏览、观察、收服、收藏和识别模拟定位。继续寻找芽芽、墨团、跃跃和暖灯，补完整本记忆册；随时可以重看教程。'}
 ];
 function refreshButtons(){if(!tour?.isActive())return;const required=steps[current]?.require,b=document.querySelector('.driver-popover-next-btn'),status=document.querySelector('.tour-check');if(b)b.disabled=!!required&&!done.has(required);if(status){status.textContent=required?(done.has(required)?'✓ 已完成，可以继续':'请先完成这一小步'):'可以随时跳过或重新学习';status.classList.toggle('finished',!!required&&done.has(required))}}
 function returnPopover(){const p=document.querySelector('.driver-popover');if(p&&p.parentElement!==document.body)document.body.appendChild(p)}
 function start(){if(tour?.isActive())tour.destroy();closed=false;done=new Set();moveDistance=0;lastFocus=document.activeElement;actions.prepare();write({...read(),seen:true,completed:false});
  tour=driver({animate:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,allowClose:true,allowKeyboardControl:false,disableActiveInteraction:false,overlayClickBehavior:'none',overlayOpacity:.38,stagePadding:8,stageRadius:8,popoverClass:'campus-tour',showProgress:true,progressText:'{{current}} / {{total}}',nextBtnText:'下一步 →',prevBtnText:'上一步',doneBtnText:'开始自由探索',closeBtnText:'跳过教程',steps:steps.map((s,i)=>({element:s.element,onHighlightStarted:()=>{current=i;document.body.dataset.tourAction=s.require||'intro';actions.clearInput();s.prepare?.();const q=actions.questProgress?.();if(s.require==='book'&&q?.started)done.add('book');if(s.require==='clue'&&q?.observed)done.add('clue');if(s.require==='puzzle'&&q?.solved)done.add('puzzle');if(s.require==='collect'&&q?.collected)done.add('collect')},onHighlighted:()=>{if(i===6)setTimeout(()=>{if(current===6&&tour?.isActive())actions.focusCanvas()},30)},popover:{title:s.title,description:s.text+'<p class="tour-check" aria-live="polite"></p>',side:i===1||i===6?'bottom':'bottom',align:'center'}})),onPrevClick:()=>{returnPopover();tour.movePrevious()},onPopoverRender:p=>{const dialog=document.querySelector('#adventure-modal');if(dialog?.open)dialog.appendChild(p.wrapper);p.closeButton?.setAttribute('aria-label','跳过教程');refreshButtons()},onNextClick:()=>{const req=steps[current]?.require;if(req&&!done.has(req)){refreshButtons();return}returnPopover();tour.moveNext()},onDestroyed:()=>{closed=true;delete document.body.dataset.tourAction;actions.clearInput();write({...read(),seen:true});if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true})}});
  // v1.3.6 uses onNextClick for the last button as well; mark completion before moving past it.
  const config=tour.getConfig();tour.setConfig({...config,onNextClick:()=>{const req=steps[current]?.require;if(req&&!done.has(req))return;if(current===steps.length-1)write({seen:true,completed:true});returnPopover();tour.moveNext()}});tour.drive();
 }
 return {start,autoStart(){if(!read().seen)start()},signal(type,amount=0){if(closed||!tour?.isActive())return;if(steps[current]?.require===type){if(type==='move'){moveDistance+=amount;if(moveDistance<.45)return}done.add(type);refreshButtons()}},isActive:()=>!!tour?.isActive(),currentAction:()=>steps[current]?.require,refresh(){if(tour?.isActive())tour.refresh()},close(){tour?.destroy()},progress:()=>({current,completed:[...done],active:!!tour?.isActive()})};
}
