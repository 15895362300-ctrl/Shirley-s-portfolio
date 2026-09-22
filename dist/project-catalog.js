// Current project order; archive the former catalog before migrating browser drafts.
window.previousProjectCatalog=structuredClone(window.resumeDefaults.projects);
const sourceProjects=window.resumeDefaults.projects;
const projectBase={title:'',tag:'',description:'',role:'待补充',work:'项目过程与作品画面待补充。',result:'待补充',coverUrl:'',demoUrl:'',galleryUrls:'',albumUrl:''};
window.resumeDefaults.schemaVersion=3;
window.resumeDefaults.projects=[
 {...sourceProjects[0],title:'INCHES AGENT 总控'},
 {...projectBase,...sourceProjects[1],title:'3D涂装模拟器',tag:'3D / PAINT SIMULATOR'},
 {...sourceProjects[3],title:'AI辅助品牌视觉设计与商业交付'},
 {...projectBase,title:'涂装辅助APP',tag:'AI / PAINT ASSISTANT',description:'围绕白模上传、方案比较与涂装建议，连接灵感探索和实际涂装准备。',role:sourceProjects[1].role,work:'白模上传、方案对比、涂装报告及保存分享；色卡、混色建议、工序与风险提示。',result:'涂装工作台通过 12 项基础测试，目前处于内测阶段。'},
 {...sourceProjects[4],title:'京东快递毕业季与京东图书线下会'},
 {...projectBase,title:'AI内容运营',tag:'AI / CONTENT OPERATIONS',description:'以内容选题、制作与发布为线索，展示 AI 辅助内容运营的工作方法。'},
 {...projectBase,title:'研发资源与部署Agent',tag:'AGENT / DEVELOPMENT',description:'围绕研发资源整理与部署任务，展示 Agent 辅助工作的流程与实践。'},
 {...projectBase,title:'收藏拍卖小程序',tag:'MINI PROGRAM / PRODUCT DESIGN',description:'围绕收藏与拍卖场景，展示小程序的产品思考、界面设计与体验流程。'}
];
window.resumeDefaults.projects.forEach(project=>{project.backUrl=''});

Object.assign(window.resumeDefaults.projects[4],{title:'京东快递毕业季与京东图书线下活动',tag:'CAMPAIGN / 2026.05—07',description:'从 H5 开屏到校园快闪、阅读活动传播物料，以连贯的视觉连接线上内容与线下体验。',role:'Creative & Design Lead / 创意设计负责人',work:'AI 方向探索与筛选、客户对接、人员统筹、创意与视觉方向、3D 建模渲染、物料设计制作及落地协同。',result:'已完成线上视觉与线下物料交付并落地；曝光、领券、核销与寄件转化数据尚未取得。',coverUrl:'https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/assets/jd/6.webp',demoUrl:'https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/jd-campaign.html'});

Object.assign(window.resumeDefaults.projects[5],{title:'AI内容运营',tag:'AI / CONTENT OPERATIONS',description:'为方寸之间小红书运营串联热门素材 Agent、选题工作台与 ChatCut，统筹灵感、大纲、拍摄安排和视频图文发布。',role:'品牌内容策划 / 制作统筹 / 运营发布',work:'使用 Agent 收集网络热门素材；通过内容选题工作台安排灵感、大纲、拍摄时间与发布；使用 ChatCut 辅助视频制作，完成视频及图文产出。',result:'形成从素材收集到发布的内容工作流，已产出视频与图文。高赞高收藏表现为运营者自述，具体作品与数据待补入案例。',demoUrl:'https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/content-operations.html'});

Object.assign(window.resumeDefaults.projects[5],{result:'五篇代表作截图合计 1,035 次点赞、846 次收藏、94 条评论。以工作台统筹档期、内容管线与复盘；数据仅为所展示样本的截图时点。',coverUrl:'https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/assets/content/evidence-3.png',backUrl:'https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/assets/content/evidence-3.png'});
// Stable reorder: carry complete project content and case-study URLs together.
window.resumeDefaults.projects=[0,1,3,6,4,5,7,2].map(i=>window.resumeDefaults.projects[i]);
window.resumeDefaults.projects[4].title='京东快递毕业季与京东图书线下会';
window.resumeDefaults.schemaVersion=4;

window.resumeDefaults.projects[2].demoUrl="https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/paint-app/";
window.resumeDefaults.paintAppCaseRevision=1;

// Use existing case-study artwork for card previews and full reverse images.
const cardAssetBase=new URL('.',location.href).href;
const cardArtwork={1:['assets/atelier/reference.webp','assets/atelier/reference.webp'],2:['paint-app/assets/editorial-text-v6.png','paint-app/assets/editorial-text-v6.png'],4:['assets/jd-campus-front.jpg','assets/jd-campus-front.jpg'],5:['assets/content/evidence-3.png','assets/content/evidence-3.png']};
Object.entries(cardArtwork).forEach(([i,paths])=>{window.resumeDefaults.projects[i].coverUrl=new URL(paths[0],cardAssetBase).href;window.resumeDefaults.projects[i].backUrl=new URL(paths[1],cardAssetBase).href});
window.resumeDefaults.cardArtworkRevision=1;

Object.assign(window.resumeDefaults.projects[6],{description:'为收藏资讯小程序扩展竞拍模块，从保证金、竞价与成交确认到订单履约，串联产品规则与交互原型。',role:'产品规划 / 交互与界面设计',work:'V1.0 PRD、交易流程与页面结构梳理；首页、拍品、我的及竞价、订单核心界面设计与交互原型。',result:'形成前期产品文档与高保真交互原型；真实业务数据、支付及退款规则待开发接入与确认。',coverUrl:new URL('auction/assets/home.webp',cardAssetBase).href,backUrl:new URL('auction/assets/bidding.webp',cardAssetBase).href,demoUrl:new URL('auction/',cardAssetBase).href});
window.resumeDefaults.auctionCaseRevision=1;
