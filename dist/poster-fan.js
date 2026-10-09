(()=>{
 const root=document.querySelector('.poster-fan');if(!root)return;
 const stage=root.querySelector('.fan-stage'),cards=[...stage.querySelectorAll('.fan-card')],status=root.querySelector('.fan-status');
 const dialog=document.querySelector('.poster-lightbox'),image=dialog.querySelector('img'),caption=dialog.querySelector('p'),original=dialog.querySelector('a');
 let selected=Math.floor(cards.length/2),opener=null;
 function select(index,scroll=false){
  selected=Math.max(0,Math.min(cards.length-1,index));
  const step=Math.min(76,Math.max(16,(stage.clientWidth-500)/(cards.length-1)));
  cards.forEach((card,i)=>{
   const d=i-(cards.length-1)/2,offset=i===selected?0:Math.sign(i-selected)*24;
   card.style.setProperty('--x',`${d*step+offset}px`);
   card.style.setProperty('--y',`${d*d*2}px`);
   card.style.setProperty('--angle',`${d*4}deg`);
   card.style.setProperty('--z',String(cards.length-Math.round(Math.abs(d))));
   card.classList.toggle('is-active',i===selected);
  });
  status.textContent=`${String(selected+1).padStart(2,'0')} / ${cards.length} · ${cards[selected].querySelector('img').alt}`;
  if(scroll&&matchMedia('(max-width:767px)').matches)cards[selected].scrollIntoView({block:'nearest',inline:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
 cards.forEach((card,i)=>{
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')select(i)});
  card.addEventListener('focus',()=>select(i,true));
  card.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();cards[Math.max(0,Math.min(cards.length-1,i+(event.key==='ArrowRight'?1:-1)))].focus()});
  card.addEventListener('click',event=>{
   if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();select(i);opener=card;image.src=card.href;image.alt=card.querySelector('img').alt;caption.textContent=image.alt;original.href=card.href;dialog.showModal();
  });
 });
 root.querySelector('[data-step="-1"]').onclick=()=>select((selected-1+cards.length)%cards.length,true);
 root.querySelector('[data-step="1"]').onclick=()=>select((selected+1)%cards.length,true);
 dialog.querySelector('button').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 window.addEventListener('resize',()=>select(selected));select(selected);
})();
