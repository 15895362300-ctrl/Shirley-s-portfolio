import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {Check,ArrowUpRight} from 'lucide-react';

export function useTypewriter(text,speed=38,startDelay=600){
 const [displayed,setDisplayed]=useState(''),[done,setDone]=useState(false);
 useEffect(()=>{let interval;setDisplayed('');setDone(false);const delay=setTimeout(()=>{let i=0;interval=setInterval(()=>{i++;setDisplayed(text.slice(0,i));if(i>=text.length){clearInterval(interval);setDone(true)}},speed)},startDelay);return()=>{clearTimeout(delay);clearInterval(interval)}},[text,speed,startDelay]);return {displayed,done};
}

// A localized 2D head warp. The source below the neckline is never transformed.
function Portrait(){
 const canvas=useRef(null),reduce=useReducedMotion();
 useEffect(()=>{let disposed=false,frame=0,ready=false,x=0,y=0,tx=0,ty=0;const img=new Image(),node=canvas.current,ctx=node.getContext('2d');
 const draw=()=>{frame=0;if(!ready||disposed)return;x+=(tx-x)*.13;y+=(ty-y)*.13;const W=img.width,H=img.height;ctx.clearRect(0,0,W,H);const neck=H*.265;ctx.drawImage(img,0,neck,W,H-neck,0,neck,W,H-neck);
 // Inverse row mapping prevents double eyes or a second stationary face underneath.
 for(let dest=0;dest<neck;dest+=2){const t=dest/neck;const weight=Math.sin(Math.PI*t);const sy=Math.max(0,Math.min(neck-2,dest-y*8*weight));const scale=1-Math.abs(x)*.015*weight;const offset=x*11*weight;ctx.drawImage(img,0,sy,W,2.3,(W-W*scale)/2+offset,dest,W*scale,2.3)}
 if(Math.abs(tx-x)+Math.abs(ty-y)>.008)frame=requestAnimationFrame(draw)};
 const queue=()=>{if(!frame)frame=requestAnimationFrame(draw)};
 const move=e=>{if(reduce||innerWidth<1024||window.scrollY>innerHeight*.4)return;tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;queue()};const reset=()=>{tx=ty=0;queue()};
 img.onload=()=>{if(disposed)return;node.width=img.width;node.height=img.height;ready=true;queue()};img.src='assets/standing.png';window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',reset);return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset)};
 },[reduce]);return <canvas ref={canvas} className="hero-portrait" role="img" aria-label="Shirley 的银框墨镜卡通形象，身体保持静止，头部轻微跟随鼠标"/>;
}

export function BackgroundVideo({src}){
 const ref=useRef(null),[failed,setFailed]=useState(false);useEffect(()=>{setFailed(false)},[src]);
 useEffect(()=>{const v=ref.current;if(!v||!src||failed)return;let previousX=null,target=0,pending=false;const seek=()=>{if(pending||!Number.isFinite(v.duration)||v.duration<=0)return;if(Math.abs(v.currentTime-target)<.01)return;pending=true;v.currentTime=target};const onSeeked=()=>{pending=false;seek()};const onMove=e=>{if(innerWidth<1024)return;if(previousX===null){previousX=e.clientX;return}const delta=e.clientX-previousX;previousX=e.clientX;if(!Number.isFinite(v.duration))return;target=Math.min(v.duration-.001,Math.max(0,target+(delta/innerWidth)*.8*v.duration));seek()};const mode=()=>{previousX=null;if(innerWidth<1024){v.autoplay=true;v.play().catch(()=>{})}else{v.autoplay=false;v.pause();target=v.currentTime}};v.addEventListener('seeked',onSeeked);v.addEventListener('loadedmetadata',mode);window.addEventListener('mousemove',onMove);window.addEventListener('resize',mode);mode();return()=>{v.pause();v.removeEventListener('seeked',onSeeked);v.removeEventListener('loadedmetadata',mode);window.removeEventListener('mousemove',onMove);window.removeEventListener('resize',mode)}},[src,failed]);
 return <div className="hero-visual order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">{src&&!failed?<video ref={ref} src={src} onError={()=>setFailed(true)} muted playsInline preload="auto" className="w-full h-full object-cover object-right lg:object-right-bottom"/>:<Portrait/>}</div>;
}

function Hero(){
 const {displayed,done}=useTypewriter("I'd love to\nhear from you!",38,3100);const [services,setServices]=useState([]),[profile,setProfile]=useState(window.portfolioProfile||window.resumeDefaults);const reduce=useReducedMotion();
 useEffect(()=>{const update=e=>setProfile(e.detail);window.addEventListener('portfolio:update',update);return()=>window.removeEventListener('portfolio:update',update)},[]);
 const options=['Brand','Digital','Campaign','Other'];const toggle=option=>setServices(current=>current.includes(option)?current.filter(x=>x!==option):[...current,option]);
 const contact=()=>{if(profile.email)location.href='mailto:'+encodeURIComponent(profile.email)+'?subject='+encodeURIComponent('Let’s talk: '+services.join(', '));else window.dispatchEvent(new Event('portfolio:edit'))};
 return <div className="hero-shell relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
 <BackgroundVideo src={profile.heroVideoUrl||''}/>
 <div className="hero-content relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen"><main id="spade-hero" className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"><div className="hero-copy">
 <span className="hero-kicker">SHIRLEY / AI PRODUCT MANAGER</span>
 <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.6,delay:2.8}}><h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">{reduce?"I'd love to\nhear from you!":displayed}{!done&&!reduce&&<span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"/>}</h1></motion.div>
 <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.6,delay:2.9}}><p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">Whether you have questions, feedback,<br/>drop me a message and I'll get back to you as soon as possible.</p></motion.div>
 <div className="hero-strengths">{profile.strengths.split(/\n\s*\n/).map((block,i)=>{const [title,...body]=block.split('：');return <article key={i}><h3>{title}</h3><p>{body.join('：')}</p></article>})}</div>
 <button className="hero-scroll" onClick={()=>window.dispatchEvent(new CustomEvent('portfolio:goto',{detail:1}))}>向下滚动，认识我 <span>↓</span></button>
 </div></main></div></div>;
}
createRoot(document.getElementById('hero-root')).render(<Hero/>);
