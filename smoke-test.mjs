import {JSDOM,VirtualConsole} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{runScripts:'outside-only',url:'https://portfolio.test',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;
w.structuredClone=structuredClone;w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};w.HTMLCanvasElement.prototype.getContext=()=>({clearRect(){},drawImage(){}});
for(const name of ['resume-data.js','career-data.js','portfolio-expansion.js','project-catalog.js','app.js','hero.js'])w.eval(fs.readFileSync('dist/'+name,'utf8'));
await new Promise(r=>setTimeout(r,100));
assert.equal(w.document.querySelector('.work-timeline h4').textContent,'上海曙乐光动漫科技有限公司');assert.ok(w.document.querySelector('#caseTitle').textContent.includes('AGENT'));
assert.equal(w.document.querySelectorAll('.work-timeline article').length,4);assert.equal(w.document.querySelectorAll('.portfolio-card').length,4);
for(let i=0;i<4;i++){if(i===1)continue;w.document.querySelectorAll('.portfolio-card')[i].click();assert.equal(w.document.querySelector('#projectDetail').open,true);assert.equal(w.location.hash,'#project-'+([0,1,3,5][i]+1));assert.ok(w.document.querySelector('#caseTitle').textContent);w.document.querySelector('#closeProject').click()}
w.document.querySelectorAll('.portfolio-card')[0].click();w.document.querySelector('#closeProject').click();
assert.equal(w.document.querySelectorAll('.hero-strengths article').length,2);
assert.equal(w.document.querySelectorAll('.accordion-card').length,8);
assert.deepEqual(Array.from(w.document.querySelectorAll('.accordion-card .flip-title'),el=>el.textContent),['INCHES AGENT 总控','3D涂装模拟器','AI辅助品牌视觉设计与商业交付','涂装辅助APP','京东快递毕业季与京东图书线下会','AI内容运营','研发资源与部署Agent','收藏拍卖小程序']);
const first=w.document.querySelector('.accordion-card');first.querySelector('.flip-preview').onpointerenter({pointerType:'mouse'});assert.equal(first.classList.contains('is-flipped'),true);first.onpointerleave();assert.equal(first.classList.contains('is-flipped'),false);
const jd=w.document.querySelectorAll('.accordion-card')[4];jd.click();jd.click();assert.equal(w.document.querySelectorAll('.jd-photo img').length,2);assert.ok(w.document.querySelector('.jd-album').href.includes('alltuu'));w.document.querySelector('#closeProject').click();

w.document.querySelectorAll('.accordion-card')[3].click();assert.equal(w.document.querySelector('[data-featured="3"]').classList.contains('is-linked'),true);
w.document.querySelectorAll('.accordion-card')[6].click();assert.equal(w.document.querySelectorAll('.accordion-card')[6].getAttribute('aria-expanded'),'true');w.document.querySelectorAll('.accordion-card')[6].click();assert.equal(w.location.hash,'#project-7');w.document.querySelector('#closeProject').click();w.document.querySelectorAll('.portfolio-card')[0].click();w.document.querySelector('#closeProject').click();
w.document.querySelector('#editProject').click();assert.equal(w.document.querySelector('#editor').open,true);const f=w.document.querySelector('#editorForm');f.elements['project-0-title'].value='测试项目';f.elements['career-0-company'].value='测试公司';f.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(w.document.querySelector('#caseTitle').textContent,'测试项目');assert.equal(w.document.querySelector('.work-timeline h4').textContent,'测试公司');assert.equal(JSON.parse(w.localStorage.getItem('portfolio-content-v3')).projects[0].title,'测试项目');assert.equal(errors.length,0,errors.join('\n'));
dom.window.close();console.log('PASS: catalog order, four featured cards, hover flip/reset, JD photos/album, dialogs, editor and storage.');
