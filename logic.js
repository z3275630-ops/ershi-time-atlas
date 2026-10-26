export const SCHOOL='https://www.gdei.edu.cn/3952/list.htm';
export const LIBRARY='https://xyh.univs.cn/a/xyh_xyh_gddesfxy/230113/1826125.shtml';
export function taskEvent(state,event){let stage=state.stage||0;if(event==='start'&&stage===0)stage=1;if(event==='read'&&stage===1)stage=2;if(event==='answer-2010'&&stage===2)stage=3;return {...state,stage}}
export function manualStep(position,dx,dz,world,radius=0){let {x,z}=position;const open=(x,z)=>world.walkable(x,z)&&(!radius||[[radius,0],[-radius,0],[0,radius],[0,-radius],[radius*.707,radius*.707],[-radius*.707,radius*.707],[radius*.707,-radius*.707],[-radius*.707,-radius*.707]].every(([a,b])=>world.walkable(x+a,z+b)));const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.08));for(let i=0;i<n;i++){if(open(x+dx/n,z))x+=dx/n;if(open(x,z+dz/n))z+=dz/n}return {x,z}}
export function guideReply(q,state,context){
 if(/图书馆|建成|面积/.test(q))return {text:'学校2023年发布的图书馆介绍记载：花都校区图书馆于2010年11月建成使用，馆舍面积22289平方米。你可以在“实景照片”里看外观，也能切到视频或原始VR继续参观。\n这些数据引用的是当时发布的介绍，不代表实时馆务信息。',url:LIBRARY};
 if(/名字|以前|更名|1955|1960|2010|校史/.test(q))return {text:'1955年，学校前身广东教育行政学院创办；1960年更名广东教育学院；2010年改制为普通本科院校，更名广东第二师范学院。',url:SCHOOL};
 if(/校训/.test(q))return {text:'学校校训是“进德修业、为人师表”。具体史实可查学校官方简介。',url:SCHOOL};
 if(/格栅|门形|框架|立柱|台阶/.test(q))return {text:'学校发布的花都图书馆照片清楚显示了大尺度门形框架、通高立柱与入口台阶。模型依据这些照片做简化。VR场景名代表拍摄位置，镜头对面的建筑不能只凭标签认定归属。',url:LIBRARY};
 if(/任务|线索|下一步|提示|记忆|答案/.test(q))return {text:state.stage===0?'打开图书馆介绍，点击“开启记忆任务”，接过缺页记忆册。':state.stage===1?'在图书馆专题里查阅名称沿革，分清学校前身与今天校名的年份。':state.stage===2?/答案|直接/.test(q)?'今天的校名对应2010年。选择这一年即可获得“来路”记忆页。':'资料里有三个年份。今天的校名对应其中最近的一个；需要直接答案可以再问我。':'你已收集“来路”记忆页。可以保存纪念卡，也可以继续查看图书馆实景和校园其他地点。'};
 return {text:`当前地点：${context||'花都校园'}。这次预览仅提供本地资料与固定提示，真实AI尚未接入。这个问题暂未找到内置依据，我不会补编答案。可以问图书馆、学校名字或任务线索。`};
}
