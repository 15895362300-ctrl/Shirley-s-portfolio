import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {Check,ArrowUpRight} from 'lucide-react';

export function useTypewriter(text,speed=38,startDelay=600){
 const [displayed,setDisplayed]=useState(''),[done,setDone]=useState(false);
 useEffect(()=>{let interval;setDisplayed('');setDone(false);const delay=setTimeout(()=>{let i=0;interval=setInterval(()=>{i++;setDisplayed(text.slice(0,i));if(i>=text.length){clearInterval(interval);setDone(true)}},speed)},startDelay);return()=>{clearTimeout(delay);clearInterval(interval)}},[text,speed,startDelay]);return {displayed,done};
}

// Keep the original portrait static; no pointer-driven deformation.
function Portrait(){return <img src="assets/standing.png" className="hero-portrait" alt="Shirley 的银框墨镜卡通形象" fetchPriority="high"/>}

export function BackgroundVideo(){
 return <div className="hero-visual order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-transparent"><Portrait/></div>;
}

function Hero(){
 const first=Boolean(window.portfolioFirstVisit);const {displayed,done}=useTypewriter("I'd love to\nhear from you!",38,first?3100:0);const [services,setServices]=useState([]),[profile,setProfile]=useState(window.portfolioProfile||window.resumeDefaults);const reduce=useReducedMotion();
 useEffect(()=>{const update=e=>setProfile(e.detail);window.addEventListener('portfolio:update',update);return()=>window.removeEventListener('portfolio:update',update)},[]);
 const options=['Brand','Digital','Campaign','Other'];const toggle=option=>setServices(current=>current.includes(option)?current.filter(x=>x!==option):[...current,option]);
 return <div className="hero-shell relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
 <BackgroundVideo src={profile.heroVideoUrl||''}/>
 <div className="hero-content relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen"><main id="spade-hero" className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"><div className="hero-copy">
 <span className="hero-kicker">SHIRLEY / AI PRODUCT MANAGER</span>
 <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.6,delay:first?2.8:0}}><h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">{reduce||!first?"I'd love to\nhear from you!":displayed}{!done&&!reduce&&first&&<span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"/>}</h1></motion.div>
 <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.6,delay:first?2.9:0}}><p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">Whether you have questions, feedback,<br/>drop me a message and I'll get back to you as soon as possible.</p></motion.div>
 <div className="hero-strengths">{profile.strengths.split(/\n\s*\n/).map((block,i)=>{const [title,...body]=block.split('：');return <article key={i}><h3>{title}</h3><p>{body.join('：')}</p></article>})}</div>
 <button className="hero-scroll" onClick={()=>window.dispatchEvent(new CustomEvent('portfolio:goto',{detail:1}))}>向下滚动，认识我 <span>↓</span></button>
 </div></main></div></div>;
}
createRoot(document.getElementById('hero-root')).render(<Hero/>);
