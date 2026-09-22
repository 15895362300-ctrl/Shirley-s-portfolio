(() => {
 const progress = document.querySelector('.top-progress');
 const update = () => {const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';};
 addEventListener('scroll', update, {passive:true}); addEventListener('resize', update); update();
 if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:0.06});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 }
})();
addEventListener('DOMContentLoaded', () => {
 const dialog = document.querySelector('#screen-dialog');
 const target = document.querySelector('#screen-dialog-body');
 const screens = [...document.querySelectorAll('.screen-card .phone')];
 const titles = ['上传与照片检查','结构化创作简报','方案对比与局部编辑'];
 document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.screen);
  target.replaceChildren(screens[index].cloneNode(true));
  document.querySelector('#screen-dialog-title').textContent=titles[index];
  dialog.showModal(); dialog.scrollTop=0;
 }));
 document.querySelector('#close-screen').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
});
addEventListener('DOMContentLoaded', () => {
 const updateScreens = () => document.querySelectorAll('.screen-open,#screen-dialog-body').forEach(el => {
  if(el.clientWidth)el.style.setProperty('--screen-scale',String(el.clientWidth/390));
 });
 const resizeObserver = new ResizeObserver(updateScreens);
 document.querySelectorAll('.screen-open,#screen-dialog-body').forEach(el=>resizeObserver.observe(el));
 updateScreens();
});
