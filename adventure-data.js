export const SCHOOL_SOURCE='https://www.gdei.edu.cn/3952/list.htm';
export const LIBRARY_SOURCE='https://xyh.univs.cn/a/xyh_xyh_gddesfxy/230113/1826125.shtml';
export const CHAPTERS=[
 {id:'library',number:'01',place:'图书馆',name:'页页',kind:'书页精灵',memory:'名字里的来路',color:'#708f9e',position:[18.5,34.5],motto:'把来路读懂，才知道向哪里出发。',intro:'一本缺页的记忆册被风吹开。书页间探出一双眼睛：“我的名字叫页页。你愿意帮我把学校的三个名字，放回时间里吗？”',
  clues:[{id:'origin',title:'最初的名字',text:'学校前身广东教育行政学院创办于1955年。',source:SCHOOL_SOURCE},{id:'rename',title:'两个名字的接力',text:'1960年更名广东教育学院；2010年改制并更名广东第二师范学院。',source:SCHOOL_SOURCE},{id:'library',title:'今天的阅读空间',text:'学校2023年发布的图书馆介绍记载：花都馆于2010年11月建成使用。校名沿革不等于这些事件发生在今天的花都建筑中。',source:LIBRARY_SOURCE}],
  game:'timeline',prompt:'按学校名称出现的先后，依次选择三个名字。',options:[{id:'today',label:'广东第二师范学院',detail:'2010'},{id:'origin',label:'广东教育行政学院',detail:'1955'},{id:'college',label:'广东教育学院',detail:'1960'}],answer:['origin','college','today'],hint:'从最早的1955年出发，再经过1960年，最后来到2010年。',
  story:'一所学校的名字会随着时代改变，教育的接力却没有停下。页页把三个名字叠成书签：“以后翻到这一页，你会记得，我们从哪里来。”',fact:'校史线索：1955、1960与2010三个节点对应学校前身创办及校名沿革。',source:SCHOOL_SOURCE},
 {id:'garden',number:'02',place:'师德园',name:'芽芽',kind:'幼芽精灵',memory:'一句校训的生长',color:'#7b995c',position:[29,46.5],motto:'把一句话，慢慢长成自己的样子。',intro:'景石旁，一片小叶子轻轻晃动。“我是芽芽。这里有一句话，不只刻在石头上。你能把它带进自己的日常吗？”',
  clues:[{id:'stone',title:'先看景石',text:'园中校训石写着“进德修业，为人师表”。这里的模型参考已明确标注师德园的照片，位置与比例仍是示意。',source:'https://static.nfnews.com/content/202512/03/c11964565.html'},{id:'motto',title:'再读校训',text:'“进德修业、为人师表”是学校校训。',source:SCHOOL_SOURCE},{id:'practice',title:'把词语变成行动',text:'观察与思考：认真求学、尊重他人、对自己的行动负责，可以成为理解校训的日常入口。本句为游戏的引导创作。',fiction:true}],
  game:'motto',prompt:'选择合适的词语，把景石上的校训补完整：',options:[{id:'de',label:'进德修业'},{id:'shi',label:'为人师表'},{id:'qi',label:'奇遇远行'},{id:'xing',label:'星光满怀'}],answer:['de','shi'],hint:'第一句谈修养与学业，第二句谈师者的示范。',
  story:'芽芽在你的记忆册里留下一片小叶子：“今天理解一句话，明天试着做好一件小事。成长可以慢一点，但每天都向着光。”',fact:'事实线索：学校校训为“进德修业、为人师表”；精灵与对白为原创。',source:SCHOOL_SOURCE},
 {id:'teaching',number:'03',place:'教学与艺术区',name:'墨团',kind:'墨迹精灵',memory:'把好奇写成一页',color:'#77758b',position:[19.5,47.5],motto:'先看一眼，再多问一句。',intro:'一滴圆圆的墨，正追着风里的纸片。“别急着替故事写结尾。”墨团说，“先看清，问一问，再把自己的发现写下来。”',
  clues:[{id:'look',title:'① 观察',text:'看看校园中的窗、连廊与入口。模型中的教学与艺术区依据公开总平面与校园资料作示意重建，细节有简化。',source:'https://ghzyj.gz.gov.cn/ywpd/cxgh/ghxkgsgb/phgbnew/gbt/content/post_10196333.html'},{id:'ask',title:'② 提问',text:'如果你是第一次来校园，会对这里的学习生活提出什么问题？把问题带到真实资料里寻找答案。这是游戏的原创观察练习。',fiction:true},{id:'write',title:'③ 表达',text:'将看见的线索、查到的依据和自己的感受分开记录。原创感想可以自由表达，校园事实需要有出处。',fiction:true}],
  game:'sequence',prompt:'帮墨团把散落的求学片段整理成一段有来由的故事。',options:[{id:'write',label:'记录发现，表达自己的理解'},{id:'look',label:'先观察场景与资料'},{id:'ask',label:'带着问题继续查找依据'}],answer:['look','ask','write'],hint:'先观察，再追问，最后把发现写下来。',
  story:'墨团终于画出了完整的一笔：“求学的记忆，不只在答案里，也在认真观察和追问的过程中。”你把今天的好奇，留进了这一页。',fact:'本页是基于校园空间创作的学习主题故事，不描述未经核实的历史事件。',source:null},
 {id:'sports',number:'04',place:'体育运动区',name:'跃跃',kind:'跃动精灵',memory:'接住彼此的光',color:'#c29555',position:[34.5,52.5],motto:'一起到达，比独自领先更温暖。',intro:'一个圆滚滚的小家伙抱着接力光点，正等在路边。“我叫跃跃！今天没有倒计时。你愿意和我一起，把这一束光传到终点吗？”',
  clues:[{id:'area',title:'找到运动空间',text:'地图中的体育馆、球场与田径场是校园空间的示意；本任务不声称还原了某次真实赛事。',source:'https://ghzyj.gz.gov.cn/ywpd/cxgh/ghxkgsgb/phgbnew/gbt/content/post_10196333.html'},{id:'team',title:'接力的约定',text:'看见同伴、接住光点、再传递给下一位。这是本游戏的原创合作主题互动。',fiction:true},{id:'access',title:'按自己的节奏',text:'按亮起的站点依次传递即可，没有限时。也可以使用“逐站传递”按钮或键盘完成，不要求快速反应。',fiction:true}],
  game:'relay',prompt:'依次把光点送过四个接力站。按亮起的站点，或使用“逐站传递”。',options:[{id:'start',label:'出发'},{id:'receive',label:'接住'},{id:'share',label:'传递'},{id:'finish',label:'一起到达'}],answer:['start','receive','share','finish'],hint:'跟着当前亮起的站点走；这里没有速度要求。',
  story:'光点越过最后一站，落成一颗小小的星。跃跃把它递给你：“它不是谁一个人的奖牌，是我们一起走过的证明。”',fact:'精灵、接力光点与这段故事均为原创，不作为学校赛事史料。',source:null},
 {id:'community',number:'05',place:'学生社区',name:'暖灯',kind:'灯光精灵',memory:'熟悉的地方亮起来',color:'#b58e66',position:[19.5,24.5],motto:'校园的温度，藏在一次次相遇里。',intro:'一盏暖黄的小灯在路口眨了眨眼。“你已经读过、想过，也和伙伴走过。”暖灯说，“再把这些地方连起来，这座校园就会慢慢变得熟悉。”',
  clues:[{id:'read',title:'线索一：书与资料',text:'想阅读、查找书目和了解图书馆资料时，可以前往图书馆。具体馆务安排请查学校当期公告。',source:LIBRARY_SOURCE},{id:'motto',title:'线索二：景石与校训',text:'在本游戏的师德园专题，可以对照实景资料阅读校训石，并了解“进德修业、为人师表”。',source:SCHOOL_SOURCE},{id:'play',title:'线索三：运动与同行',text:'本游戏将接力互动放在体育运动区，用原创故事讲述合作与同行。',fiction:true}],
  game:'match',prompt:'根据线索，为暖灯找到对应的校园地点。',questions:[{id:'read',text:'带着问题寻找书籍与资料。',answer:'library'},{id:'motto',text:'看景石，读懂“为人师表”。',answer:'garden'},{id:'play',text:'把接力光点传给下一位伙伴。',answer:'sports'}],options:[{id:'garden',label:'师德园'},{id:'sports',label:'体育运动区'},{id:'library',label:'图书馆'}],answer:['library','garden','sports'],hint:'阅读对应图书馆；校训石对应师德园；接力对应体育运动区。',
  story:'暖灯把五处地点连成一条细细的光线。你发现，记忆册已经完整了：名字、校训、求学、同行，还有渐渐熟悉的日常。校园的故事，也从此多了你的参与。',fact:'本页综合已有资料线索与原创叙事；没有虚构校内服务承诺或建筑开放时间。',source:null}
];
export const BY_ID=Object.fromEntries(CHAPTERS.map(c=>[c.id,c]));
