const evidenceDialog=document.querySelector('#evidence-dialog');
const fullImage=document.querySelector('#evidence-full');
let evidenceTrigger=null;
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
 evidenceTrigger=button;fullImage.src=button.dataset.image;fullImage.alt=button.dataset.caption+'完整截图';
 document.querySelector('#evidence-caption').textContent=button.dataset.caption;
 evidenceDialog.showModal();
}));
document.querySelector('#evidence-close').addEventListener('click',()=>evidenceDialog.close());
evidenceDialog.addEventListener('click',event=>{if(event.target===evidenceDialog){const r=evidenceDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)evidenceDialog.close();}});
evidenceDialog.addEventListener('close',()=>evidenceTrigger?.focus());
