import {JSDOM,VirtualConsole} from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const errors=[];
const console=new VirtualConsole();
console.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{url:'https://portfolio.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:console});
const w=dom.window;
w.HTMLMediaElement.prototype.pause=function(){};
w.structuredClone=structuredClone;w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
for(const file of ['resume-data.js','career-data.js','portfolio-expansion.js','project-catalog.js','app.js'])w.eval(fs.readFileSync('dist/'+file,'utf8'));
assert.equal(w.document.querySelectorAll('.portfolio-card').length,4);
assert.equal(w.document.querySelectorAll('.accordion-card').length,8);
// The public portfolio is read-only; old browser drafts remain readable.
assert.equal(w.document.querySelector('#editor, #openEditor, #editResume, #editProject, #editorForm'),null);
const appSource=fs.readFileSync('dist/app.js','utf8');
assert.ok(!/openEditor|fillCareerEditor|saveCareerEditor|open_portfolio_editor|localStorage\.setItem/.test(appSource));
assert.ok(!fs.readFileSync('src/hero.jsx','utf8').includes('portfolio:edit'));
const careerBefore=w.document.querySelector('.work-timeline').textContent;
w.dispatchEvent(new w.Event('portfolio:edit'));
assert.equal(w.document.querySelector('dialog[open]'),null);
assert.equal(w.document.querySelector('.work-timeline').textContent,careerBefore);
assert.equal(w.document.querySelectorAll('.work-timeline article').length,2);
assert.equal(w.document.querySelector('#emailLink').protocol,'mailto:');
w.document.querySelector('#mainVideo').dispatchEvent(new w.Event('loadedmetadata'));
w.document.querySelector('#mainVideo').dispatchEvent(new w.Event('error'));
const fanDom=new JSDOM(fs.readFileSync('dist/pansong-model.html','utf8'),{url:'https://portfolio.test/pansong-model',runScripts:'outside-only'});
const fw=fanDom.window;fw.matchMedia=()=>({matches:false});
fw.HTMLElement.prototype.scrollIntoView=()=>{};
fw.HTMLDialogElement.prototype.showModal=function(){this.open=true};
fw.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new fw.Event('close'))};
fw.eval(fs.readFileSync('dist/poster-fan.js','utf8'));
const cards=[...fw.document.querySelectorAll('.fan-card')];
assert.equal(cards.length,14);assert.equal(fw.document.querySelectorAll('video').length,0);
assert.equal(new Set(cards.map(card=>card.href)).size,14);
for(const card of cards)assert.ok(fs.existsSync('dist/'+card.getAttribute('href')));
const hover=new fw.Event('pointerenter');Object.defineProperty(hover,'pointerType',{value:'mouse'});cards[0].dispatchEvent(hover);
assert.ok(cards[0].classList.contains('is-active'));
fw.document.querySelector('[data-step="-1"]').click();assert.ok(cards[13].classList.contains('is-active'));
cards[3].click();assert.ok(fw.document.querySelector('dialog').open);
assert.equal(fw.document.querySelector('dialog img').src,cards[3].href);
fw.document.querySelector('dialog button').click();assert.ok(!fw.document.querySelector('dialog').open);
assert.equal(fw.document.activeElement,cards[3]);
fanDom.window.close();
const savedCareers=structuredClone(w.resumeDefaults);
savedCareers.careers.push({company:'无锡布提工业设计有限公司'},{company:'上海博士爱文化创意有限公司'});
savedCareers.careers[0].description='保留其他工作经历的编辑内容';
const cleanedCareers=w.validate(savedCareers).careers;
assert.equal(cleanedCareers.length,2);
assert.equal(cleanedCareers[0].description,'保留其他工作经历的编辑内容');
const education=w.document.querySelector('.education-tools').textContent;
assert.ok(education.includes('南安普顿大学｜设计管理 硕士｜2023.09—2024.11'));
assert.ok(education.includes('常州大学｜产品设计 本科｜2018.09—2020.08'));
assert.ok(education.includes('Codex、ChatGPT、ChatCut、Lovart、豆包、混元 3D'));
assert.equal(w.document.querySelectorAll('.flip-hint').length,0);
assert.equal(w.document.querySelectorAll('#projectCards .flip-action > .flip-number').length,4);
assert.equal(w.pageStep([{top:0,bottom:900},{top:900,bottom:1800}],900,1),1);
assert.equal(w.pageStep([{top:-900,bottom:0},{top:0,bottom:900}],900,-1),0);
assert.equal(w.pageStep([{top:0,bottom:1400},{top:1400,bottom:2300}],900,1),null);
assert.equal(w.pageStep([{top:-500,bottom:900},{top:900,bottom:1800}],900,1),1);
assert.equal(w.pageStep([{top:-300,bottom:1100},{top:1100,bottom:2000}],900,-1),null);
assert.ok(!fs.readFileSync('src/hero.jsx','utf8').includes('ctx.drawImage'));
assert.ok(!fs.readFileSync('src/hero.jsx','utf8').includes('mousemove'));
for(const file of ['dist/index.html','dist/inches-agent/index.html']){
 const html=fs.readFileSync(file,'utf8');
 const refs=[...html.matchAll(/(?:src|href)="([^"?#]+\.(?:css|js))\?v=([a-f0-9]{12})"/g)];
 assert.ok(refs.length>=2);
 for(const [,url,hash] of refs){
  const bytes=fs.readFileSync(path.resolve(path.dirname(file),url));
  assert.equal(hash,crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12));
 }
}
const sceneCss=fs.readFileSync('dist/flip-cards.css','utf8');
assert.ok(sceneCss.includes('scroll-snap-type:y mandatory'));
assert.ok(sceneCss.includes('scroll-snap-align:start;scroll-snap-stop:always'));
assert.ok(sceneCss.includes('#index,#projects,#contact{background:#fff}'));
const old=structuredClone(w.resumeDefaults);old.projects=structuredClone(w.previousEvidenceProjects);delete old.evidenceCaseRevision;
old.projects[3].role='保留我的自定义职责';
const migrated=w.validate(old);
assert.equal(migrated.projects[3].role,'保留我的自定义职责');
assert.equal(migrated.projects[3].demoUrl,w.resumeDefaults.projects[3].demoUrl);
for(const i of [1,2,4,5,6])assert.deepEqual(migrated.projects[i],old.projects[i]);
assert.equal(w.validate(migrated).evidenceCaseRevision,1);
// Every scene stays visible and interactive, even between old scroll thresholds.
w.tick();
for(const scene of w.document.querySelectorAll('.scene'))assert.equal(scene.inert,false);
let scrollRequest;
w.scrollTo=options=>{scrollRequest=options};
w.document.querySelector('#index').getBoundingClientRect=()=>({top:2345});
w.go(2);
assert.equal(scrollRequest.top,2345);
assert.equal(scrollRequest.behavior,'instant');
assert.equal(w.location.hash,'#index');
assert.ok(w.document.querySelector('#intro').inert);
const rows=w.document.querySelectorAll('.accordion-card');
rows[1].onpointerenter({pointerType:'mouse'});
assert.equal(rows[1].classList.contains('expanded'),false);
await new Promise(r=>setTimeout(r,200));
assert.equal(rows[1].classList.contains('expanded'),true);
rows[2].onpointerenter({pointerType:'mouse'});rows[2].onpointerleave();
await new Promise(r=>setTimeout(r,400));
assert.equal(rows[2].classList.contains('expanded'),false);
const preview=rows[1].querySelector('.flip-preview');preview.onpointerenter({pointerType:'mouse'});
assert.equal(rows[1].classList.contains('is-flipped'),false);
await new Promise(r=>setTimeout(r,500));
assert.equal(rows[1].classList.contains('is-flipped'),true);
rows[1].onpointerleave();
assert.equal(rows[1].classList.contains('is-flipped'),false);
// Initial visit plays once; refresh / same-session return must skip it.
w.history.replaceState(null,'','/');
const visit=fs.readFileSync('dist/visit-state.js','utf8');w.eval(visit);
assert.equal(w.portfolioFirstVisit,true);w.eval(visit);
assert.equal(w.portfolioFirstVisit,false);
assert.equal(w.document.documentElement.dataset.portfolioReturn,'true');
assert.equal(errors.length,0,errors.join('\n'));
dom.window.close();

for(const [file,count] of [['inches-agent/index.html',5],['rd-agent.html',4],['pansong-model.html',2]]){
 const d=new JSDOM(fs.readFileSync('dist/'+file,'utf8')).window.document;
 assert.equal(d.querySelectorAll('h1').length,1,file);
 assert.equal(d.querySelectorAll('.evidence img').length,count,file);
 for(const el of d.querySelectorAll('[src],[href]')){
  const value=el.getAttribute('src')||el.getAttribute('href');
  if(/^(https?:|data:)/.test(value))continue;
  if(value.startsWith('#')){assert.ok(d.getElementById(value.slice(1)),file+': '+value);continue;}
  let target=path.resolve('dist',path.dirname(file),value.split(/[?#]/)[0]);
  if(value.split('#')[0].endsWith('/'))target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),file+': missing '+value);
 }
}
for(const file of ['dist/project-navigation.js','dist/paint-app/project-navigation.js','dist/app.js']){
 const text=fs.readFileSync(file,'utf8');assert.ok(text.includes('rd-agent.html'));assert.ok(text.includes('pansong-model.html'));
}
process.stdout.write('PASS: 8 projects, 14-poster fan, hover, navigation, original-image dialog, education, personal drafts, routes and local assets.\n');
