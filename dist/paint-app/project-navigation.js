(()=>{
 const base='https://ai-story-portfolio.citrus-moon-5505.chatgpt.site/';
 const names=['INCHES AGENT 总控','3D涂装模拟器','涂装辅助APP','研发资源与部署Agent','京东快递毕业季与京东图书线下会','AI内容运营','收藏拍卖小程序','AI辅助品牌视觉设计与商业交付'];
 const urls=[base+'inches-agent/',base+'mini-atelier.html','https://fangcun-h5-portfolio.citrus-moon-5505.chatgpt.site',base+'#project-4',base+'jd-campaign.html',base+'content-operations.html',base+'#project-7',base+'#project-8'];
 const script=document.currentScript;const initial=Number(script.dataset.project);const modal=document.querySelector('#projectDetail');
 function mount(root,index,isModal=false){
 root.querySelectorAll('.pn-back,.pn-guide,.pn-bottom').forEach(el=>el.remove());
 const go=i=>{if(isModal&&[3,6,7].includes(i)){window.openProject(i);return}location.href=urls[i]};
 const back=document.createElement('button');back.type='button';back.className='pn-back';back.textContent='← 返回上一页';back.onclick=()=>{if(isModal){document.querySelector('#closeProject').click();return}if(history.length>1&&document.referrer){history.back()}else location.href=base+'#projects'};
 if(isModal)root.prepend(back);else {const header=document.querySelector('body>header');if(header){header.querySelector('.brand')?.remove();header.prepend(back)}else root.prepend(back)}
 const guide=document.createElement('div');guide.className='pn-guide';const toggle=document.createElement('button');toggle.type='button';toggle.className='pn-toggle';toggle.textContent='☷';toggle.setAttribute('aria-label','打开项目导航');toggle.setAttribute('aria-expanded','false');
 const panel=document.createElement('nav');panel.className='pn-panel';panel.setAttribute('aria-label','全部项目');panel.hidden=true;
 names.forEach((name,i)=>{const link=document.createElement('a');link.href=urls[i];link.textContent=(i+1)+'  '+name;if(i===index)link.setAttribute('aria-current','page');link.onclick=e=>{e.preventDefault();go(i)};panel.append(link)});
 toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden))};guide.append(toggle,panel);const top=document.createElement('button');top.type='button';top.className='pn-toggle pn-top';top.textContent='↑';top.title='回到顶部';top.setAttribute('aria-label','回到顶部');top.onclick=()=>{const options={top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'};if(isModal)root.scrollTo(options);else window.scrollTo(options)};guide.append(top);root.append(guide);
 const bottom=document.createElement('nav');bottom.className='pn-bottom';bottom.setAttribute('aria-label','相邻项目');[[-1,'← 上一个项目'],[1,'下一个项目 →']].forEach(([delta,label])=>{const i=(index+delta+8)%8;const link=document.createElement('a');link.href=urls[i];const small=document.createElement('small');small.textContent=label;const title=document.createElement('span');title.textContent=names[i];link.append(small,title);link.onclick=e=>{e.preventDefault();go(i)};bottom.append(link)});
 const closing=isModal?null:document.querySelector('main .closing');(closing||root).append(bottom);
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}});
 }
 if(modal){if(modal.open)mount(modal,Number((location.hash.match(/project-(\d+)/)||[])[1]||1)-1,true);window.addEventListener('portfolio:project',e=>mount(modal,e.detail,true));return}
 document.querySelectorAll('a').forEach(a=>{if(/(?:返回|回到).*(?:作品集|精选项目|项目列表)/.test(a.textContent))a.remove()});mount(document.body,initial);
})();
