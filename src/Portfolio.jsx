import { useState, useEffect, useRef, useCallback } from "react";
import {
  Terminal, Code2, Shield, Globe, Database, Cpu, CheckCircle2,
  XCircle, AlertTriangle, Play, ExternalLink, Eye, EyeOff,
  ChevronRight, Layers, Server, Bug, RefreshCw, BarChart3,
  Gamepad2, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from "lucide-react";

const C = {
  bg:"#050b18",surface:"#0a1628",surface2:"#0f1e38",border:"#1a2f50",
  primary:"#00d4ff",green:"#00ff88",amber:"#ffb800",red:"#ff4466",
  purple:"#b066ff",text:"#b8d4f0",muted:"#4a6a8a",white:"#ffffff",
};

const SKILLS = [
  { cat:"QA & Testing", icon:<Bug size={16}/>, color:C.primary, items:[
    {name:"Regression Testing",level:95},{name:"API Testing (Postman)",level:90},
    {name:"Test Case Design",level:92},{name:"Jira / Defect Tracking",level:95},
    {name:"UAT & Integration Testing",level:88},{name:"Performance Testing",level:75},
  ]},
  { cat:"Web Systems", icon:<Globe size={16}/>, color:C.green, items:[
    {name:"CMS & DNS Management",level:90},{name:"API Integration & Debugging",level:88},
    {name:"Staging Environments",level:85},{name:"CDN / Cloudflare Caching",level:82},
    {name:"CI/CD & GitHub",level:78},{name:"AWS / cPanel Hosting",level:80},
  ]},
  { cat:"Development", icon:<Code2 size={16}/>, color:C.amber, items:[
    {name:"JavaScript / HTML / CSS",level:82},{name:"Python",level:78},
    {name:"Java / C#",level:75},{name:"SQL / MySQL",level:80},
    {name:"PHP",level:70},{name:"Shell Scripting",level:68},
  ]},
  { cat:"Security & Cloud", icon:<Shield size={16}/>, color:C.purple, items:[
    {name:"WAF Configuration",level:78},{name:"SSL Management",level:85},
    {name:"Security Audits",level:80},{name:"Penetration Testing (Basics)",level:65},
    {name:"Cloud Hosting (AWS)",level:75},{name:"Cybersecurity Compliance",level:72},
  ]},
];

const EXPERIENCE = [
  { company:"Prop Data", role:"Test Analyst", period:"2025 – Present", type:"QA", color:C.primary,
    bullets:["Lead QA across web platforms and property listing systems: functional, regression, integration & UAT","Conduct API testing for property portals (Property24, Private Property), CRM systems, and data feeds","Reduced post-release defects through structured regression testing cycles","Improved API reliability by catching critical integration bugs pre-production","Manage full defect lifecycle in Jira; bridge technical and non-technical stakeholders","Participate in full Agile ceremonies — stand-ups, sprint planning, retrospectives"]},
  { company:"Prop Data", role:"L2 Support Engineer", period:"2023 – 2025", type:"Support", color:C.green,
    bullets:["Resolved client website errors, API integration failures, and CMS customization issues","Managed DNS, CDN, and caching for high-performance real estate web platforms","Validated listing data feeds to Property24, Private Property, and James Edition","Conducted website security audits covering WAF, SSL, and performance bottlenecks","Created and maintained internal knowledge base; trained clients on the Prop Data platform","Provided emergency incident response for critical website downtime events"]},
  { company:"D & C Signs", role:"Senior Sales & Marketing Consultant", period:"2021 – 2023", type:"Marketing", color:C.amber,
    bullets:["Managed Google Ads, LinkedIn Sales Navigator, and social media campaigns","Monitored Google Analytics metrics to refine digital marketing strategies","Oversaw website updates and online advertising performance"]},
];

const WEBSITES = [
  {name:"TalentFi",url:"https://talentfi.net/",icon:"🧑‍💼",color:C.primary,type:"Employer of Record Platform",desc:"South Africa's trusted employment partner — hire, pay, and manage talent with full compliance."},
  {name:"Attrakta Animation",url:"https://attraktanimation.co.za/home",icon:"🎬",color:C.purple,type:"Animation Studio",desc:"Professional animation studio website with portfolio showcase and service offerings."},
  {name:"Through Balls",url:"https://throughballs.com/",icon:"⚽",color:C.green,type:"Sports Platform",desc:"Football analytics and content platform built for the modern fan."},
  {name:"EM Debt Solutions",url:"https://emdebtsolutions.co.za/",icon:"💼",color:C.amber,type:"Financial Services",desc:"Professional debt management and financial solutions for South African clients."},
  {name:"Spec Peptides",url:"https://specpeptides.com/",icon:"🧬",color:C.red,type:"E-Commerce Platform",desc:"High-performance product catalogue with CDN configuration and sub-2s load times."},
  {name:"65x Leads",url:"https://65xleads.com/",icon:"⚡",color:C.primary,type:"Lead Generation Funnel",desc:"Automated lead funnel integrating ReachInbox and Instantly with CRM workflows."},
  {name:"MLM Power",url:"https://mlmpower.co.za/",icon:"📈",color:C.green,type:"Marketing Website",desc:"SEO-optimised marketing site with Schema Markup and Google Ads integration."},
  {name:"Jimny Culture",url:"https://jimnyculture.co.za/",icon:"🚙",color:C.purple,type:"Community Platform",desc:"Centralised brand hub for niche automotive community with social integration."},
];

const QA_TESTS = [
  {id:"TC-001",name:"Login form — validation rules",status:"pass",time:"0.8s",detail:"All required field validations fire correctly on submit"},
  {id:"TC-002",name:"API response — schema validation",status:"pass",time:"1.2s",detail:"Response body matches expected JSON schema"},
  {id:"TC-003",name:"Missing field — error message display",status:"fail",time:"0.3s",detail:"BUG: No error shown when 'email' field is empty. Expected: 'Email is required'"},
  {id:"TC-004",name:"Cross-browser layout consistency",status:"pass",time:"2.1s",detail:"Layout consistent across Chrome 124, Firefox 125, Safari 17"},
  {id:"TC-005",name:"API timeout — user feedback",status:"warn",time:"5.2s",detail:"WARNING: Request times out but shows generic error, not user-friendly message"},
  {id:"TC-006",name:"Listing sync — data integrity",status:"pass",time:"0.9s",detail:"Property listing data matches source CRM — all 47 fields verified"},
  {id:"TC-007",name:"SQL injection — input sanitisation",status:"pass",time:"0.4s",detail:"All 12 injection vectors correctly sanitised and rejected"},
  {id:"TC-008",name:"Mobile nav — viewport < 375px",status:"fail",time:"0.6s",detail:"BUG: Nav menu overlaps hero content on viewport width < 375px (iPhone SE)"},
];

function SnakeGame({onClose}){
  const canvasRef=useRef(null);
  const gameRef=useRef({snake:[{x:10,y:10}],dir:{x:1,y:0},food:{x:15,y:15},score:0,alive:true});
  const intervalRef=useRef(null);
  const [score,setScore]=useState(0);
  const [dead,setDead]=useState(false);
  const CELL=18,COLS=20,ROWS=20;
  const placeFood=()=>({x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)});
  const draw=useCallback(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#050b18";ctx.fillRect(0,0,COLS*CELL,ROWS*CELL);
    const g=gameRef.current;
    g.snake.forEach((s,i)=>{ctx.fillStyle=i===0?"#00ff88":`rgba(0,255,136,${Math.max(0.1,0.8-i*0.04)})`;ctx.fillRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2);});
    ctx.fillStyle="#ff4466";ctx.beginPath();ctx.arc(g.food.x*CELL+CELL/2,g.food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2);ctx.fill();
  },[]);
  const tick=useCallback(()=>{
    const g=gameRef.current;if(!g.alive)return;
    const head={x:g.snake[0].x+g.dir.x,y:g.snake[0].y+g.dir.y};
    if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||g.snake.some(s=>s.x===head.x&&s.y===head.y)){g.alive=false;setDead(true);clearInterval(intervalRef.current);return;}
    g.snake.unshift(head);
    if(head.x===g.food.x&&head.y===g.food.y){g.score++;setScore(g.score);g.food=placeFood();}else{g.snake.pop();}
    draw();
  },[draw]);
  useEffect(()=>{draw();intervalRef.current=setInterval(tick,150);return()=>clearInterval(intervalRef.current);},[tick,draw]);
  useEffect(()=>{
    const h=(e)=>{const g=gameRef.current;if(e.key==="ArrowUp"&&g.dir.y!==1)g.dir={x:0,y:-1};if(e.key==="ArrowDown"&&g.dir.y!==-1)g.dir={x:0,y:1};if(e.key==="ArrowLeft"&&g.dir.x!==1)g.dir={x:-1,y:0};if(e.key==="ArrowRight"&&g.dir.x!==-1)g.dir={x:1,y:0};e.preventDefault();};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);
  const restart=()=>{gameRef.current={snake:[{x:10,y:10}],dir:{x:1,y:0},food:{x:15,y:15},score:0,alive:true};setScore(0);setDead(false);clearInterval(intervalRef.current);intervalRef.current=setInterval(tick,150);draw();};
  const setDir=(dx,dy)=>{const g=gameRef.current;if(dx===1&&g.dir.x!==-1)g.dir={x:1,y:0};if(dx===-1&&g.dir.x!==1)g.dir={x:-1,y:0};if(dy===-1&&g.dir.y!==1)g.dir={x:0,y:-1};if(dy===1&&g.dir.y!==-1)g.dir={x:0,y:1};};
  return(
    <div style={{textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",color:C.green,fontSize:14}}>SNAKE // SCORE: {score}</span>
        <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>✕ CLOSE</button>
      </div>
      <div style={{position:"relative",display:"inline-block",maxWidth:"100%"}}>
        <canvas ref={canvasRef} width={COLS*CELL} height={ROWS*CELL} style={{border:`1px solid ${C.border}`,borderRadius:6,display:"block",maxWidth:"100%"}}/>
        {dead&&(<div style={{position:"absolute",inset:0,background:"rgba(5,11,24,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:6}}><div style={{color:C.red,fontFamily:"'Share Tech Mono',monospace",fontSize:18,marginBottom:8}}>GAME OVER</div><div style={{color:C.text,fontSize:13,marginBottom:14}}>Score: {score}</div><button onClick={restart} style={{padding:"8px 20px",background:C.green,border:"none",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>RESTART</button></div>)}
      </div>
      <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(3,44px)",gridTemplateRows:"repeat(2,44px)",gap:4,justifyContent:"center"}}>
        {[null,{icon:<ArrowUp size={18}/>,dx:0,dy:-1},null,{icon:<ArrowLeft size={18}/>,dx:-1,dy:0},{icon:<ArrowDown size={18}/>,dx:0,dy:1},{icon:<ArrowRight size={18}/>,dx:1,dy:0}].map((cell,i)=>cell?(<button key={i} onTouchStart={()=>setDir(cell.dx,cell.dy)} onClick={()=>setDir(cell.dx,cell.dy)} style={{width:44,height:44,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>{cell.icon}</button>):(<div key={i}/>))}
      </div>
    </div>
  );
}

function SoccerGame({onClose}){
  const canvasRef=useRef(null);
  const s=useRef({px:200,py:240,bx:200,by:240,bvx:0,bvy:0,score:0,saves:0,goalie:200,gdir:1,started:false});
  const rafRef=useRef(null);
  const [score,setScore]=useState(0);
  const [msg,setMsg]=useState("TAP / CLICK to place player & kick!");
  const W=400,H=300,GW=120,GH=50;
  const draw=useCallback(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");const st=s.current;
    ctx.fillStyle="#1a4a1a";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(255,255,255,0.15)";ctx.lineWidth=1;ctx.strokeRect(20,20,W-40,H-40);
    ctx.beginPath();ctx.arc(W/2,H/2,40,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W/2,20);ctx.lineTo(W/2,H-20);ctx.stroke();
    const gx=(W-GW)/2;
    ctx.fillStyle="rgba(255,255,255,0.08)";ctx.fillRect(gx,0,GW,GH);
    ctx.strokeStyle="#ffffff";ctx.lineWidth=2;ctx.strokeRect(gx,0,GW,GH);
    ctx.fillStyle="#ffb800";ctx.fillRect(st.goalie-20,GH-8,40,10);
    ctx.fillStyle="#00d4ff";ctx.beginPath();ctx.arc(st.px,st.py,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.font="bold 9px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("TP",st.px,st.py);
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(st.bx,st.by,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fillRect(0,H-28,W,28);
    ctx.fillStyle="#fff";ctx.font="11px 'Share Tech Mono',monospace";ctx.textAlign="left";ctx.fillText(`GOALS: ${st.score}  SAVES: ${st.saves}`,8,H-10);
  },[]);
  const loop=useCallback(()=>{
    const st=s.current;if(!st.started){draw();return;}
    st.bx+=st.bvx;st.by+=st.bvy;st.bvx*=0.97;st.bvy*=0.97;
    if(st.bx<8){st.bx=8;st.bvx*=-0.7;}if(st.bx>W-8){st.bx=W-8;st.bvx*=-0.7;}
    if(st.by>H-8){st.by=H-8;st.bvy=-Math.abs(st.bvy)*0.5;}
    if(st.by<8&&st.bx>(W-GW)/2&&st.bx<(W+GW)/2){
      const hit=st.bx>st.goalie-20&&st.bx<st.goalie+20;
      if(hit){st.saves++;setMsg("SAVED! 🧤");}else{st.score++;setScore(st.score);setMsg("GOAL! ⚽🎉");setTimeout(()=>setMsg("TAP to play again!"),1500);}
      st.bvx=0;st.bvy=0;st.bx=st.px;st.by=st.py;st.started=false;
    }
    st.goalie+=st.gdir*2.5;if(st.goalie>((W+GW)/2)-20||st.goalie<((W-GW)/2)+20)st.gdir*=-1;
    draw();rafRef.current=requestAnimationFrame(loop);
  },[draw]);
  const kick=useCallback((e)=>{
    const st=s.current;const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();const scaleX=W/rect.width,scaleY=H/rect.height;
    const cx=e.touches?(e.touches[0].clientX-rect.left)*scaleX:(e.clientX-rect.left)*scaleX;
    const cy=e.touches?(e.touches[0].clientY-rect.top)*scaleY:(e.clientY-rect.top)*scaleY;
    if(!st.started){
      st.bx=st.px;st.by=st.py;
      const dx=cx-st.px,dy=cy-st.py,dist=Math.sqrt(dx*dx+dy*dy)||1;
      st.bvx=(dx/dist)*12;st.bvy=(dy/dist)*12;st.started=true;setMsg("");
      rafRef.current=requestAnimationFrame(loop);
    }else{
      st.px=Math.max(20,Math.min(W-20,cx));st.py=Math.max(H/2,Math.min(H-30,cy));
      st.bx=st.px;st.by=st.py;st.started=false;setMsg("Now click to shoot!");
    }
  },[loop]);
  useEffect(()=>{draw();return()=>cancelAnimationFrame(rafRef.current);},[draw]);
  return(
    <div style={{textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",color:C.green,fontSize:14}}>SOCCER // GOALS: {score}</span>
        <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>✕ CLOSE</button>
      </div>
      <canvas ref={canvasRef} width={W} height={H} onClick={kick} onTouchStart={kick} style={{border:`1px solid ${C.border}`,borderRadius:6,cursor:"crosshair",maxWidth:"100%",display:"block",margin:"0 auto"}}/>
      {msg&&<div style={{marginTop:8,color:C.amber,fontFamily:"'Share Tech Mono',monospace",fontSize:12}}>{msg}</div>}
    </div>
  );
}

function SpaceGame({onClose}){
  const canvasRef=useRef(null);
  const st=useRef({ship:{x:200,y:350},bullets:[],enemies:[],stars:[],score:0,alive:true,keys:{},lastShot:0,wave:1});
  const rafRef=useRef(null);
  const [score,setScore]=useState(0);
  const [dead,setDead]=useState(false);
  const W=400,H=400;
  const initEnemies=()=>{const e=[];for(let r=0;r<2;r++)for(let c=0;c<5;c++)e.push({x:60+c*65,y:40+r*50,alive:true,dir:1});return e;};
  const initStars=()=>Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()*2+0.5,sp:Math.random()*1.5+0.5}));
  useEffect(()=>{st.current.enemies=initEnemies();st.current.stars=initStars();},[]);
  const draw=useCallback(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");const s=st.current;
    ctx.fillStyle="#050b18";ctx.fillRect(0,0,W,H);
    s.stars.forEach(star=>{ctx.fillStyle=`rgba(255,255,255,${star.s/3})`;ctx.fillRect(star.x,star.y,star.s,star.s);});
    if(s.alive){ctx.fillStyle="#00d4ff";ctx.beginPath();ctx.moveTo(s.ship.x,s.ship.y-16);ctx.lineTo(s.ship.x-12,s.ship.y+12);ctx.lineTo(s.ship.x+12,s.ship.y+12);ctx.closePath();ctx.fill();ctx.fillStyle="#ff4466";ctx.fillRect(s.ship.x-3,s.ship.y+12,6,8);}
    s.bullets.forEach(b=>{ctx.fillStyle=b.enemy?"#ff4466":"#00ff88";ctx.fillRect(b.x-2,b.y-6,4,12);});
    s.enemies.forEach(e=>{if(!e.alive)return;ctx.fillStyle="#b066ff";ctx.beginPath();ctx.arc(e.x,e.y,14,0,Math.PI*2);ctx.fill();ctx.fillStyle="#050b18";ctx.font="14px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("👾",e.x,e.y);});
    ctx.fillStyle="#00d4ff";ctx.font="12px 'Share Tech Mono',monospace";ctx.textAlign="left";ctx.fillText(`SCORE: ${s.score}  WAVE: ${s.wave}`,8,20);
  },[]);
  const loop=useCallback(()=>{
    const s=st.current;if(!s.alive)return;
    s.stars.forEach(star=>{star.y+=star.sp;if(star.y>H)star.y=0;});
    if(s.keys["ArrowLeft"]&&s.ship.x>20)s.ship.x-=5;
    if(s.keys["ArrowRight"]&&s.ship.x<W-20)s.ship.x+=5;
    const now=Date.now();
    if(s.keys[" "]&&now-s.lastShot>220){s.bullets.push({x:s.ship.x,y:s.ship.y-16,enemy:false});s.lastShot=now;}
    s.bullets=s.bullets.filter(b=>{b.y+=b.enemy?3:-9;return b.y>-10&&b.y<H+10;});
    let edge=false;s.enemies.forEach(e=>{if(!e.alive)return;e.x+=1.2*e.dir;if(e.x>W-20||e.x<20)edge=true;});
    if(edge)s.enemies.forEach(e=>{e.dir*=-1;e.y+=20;});
    const alive=s.enemies.filter(e=>e.alive);
    if(alive.length&&Math.random()<0.015){const e=alive[Math.floor(Math.random()*alive.length)];s.bullets.push({x:e.x,y:e.y+14,enemy:true});}
    s.bullets.forEach(b=>{
      if(b.enemy){if(Math.abs(b.x-s.ship.x)<14&&Math.abs(b.y-s.ship.y)<14){s.alive=false;setDead(true);cancelAnimationFrame(rafRef.current);return;}}
      else{s.enemies.forEach(e=>{if(!e.alive)return;if(Math.abs(b.x-e.x)<16&&Math.abs(b.y-e.y)<16){e.alive=false;b.y=-999;s.score+=10;setScore(s.score);}});}
    });
    if(alive.some(e=>e.y>H-60)){s.alive=false;setDead(true);cancelAnimationFrame(rafRef.current);return;}
    if(!s.enemies.some(e=>e.alive)){s.wave++;s.enemies=initEnemies();s.bullets=[];}
    draw();rafRef.current=requestAnimationFrame(loop);
  },[draw]);
  useEffect(()=>{
    draw();rafRef.current=requestAnimationFrame(loop);
    const kd=e=>{st.current.keys[e.key]=true;if([" ","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault();};
    const ku=e=>{st.current.keys[e.key]=false;};
    window.addEventListener("keydown",kd);window.addEventListener("keyup",ku);
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);};
  },[loop,draw]);
  const restart=()=>{st.current={ship:{x:200,y:350},bullets:[],enemies:initEnemies(),stars:initStars(),score:0,alive:true,keys:{},lastShot:0,wave:1};setScore(0);setDead(false);rafRef.current=requestAnimationFrame(loop);};
  const mobileMove=(dx)=>{st.current.ship.x=Math.max(20,Math.min(W-20,st.current.ship.x+dx*30));};
  const mobileShoot=()=>{const s=st.current;const now=Date.now();if(now-s.lastShot>220){s.bullets.push({x:s.ship.x,y:s.ship.y-16,enemy:false});s.lastShot=now;}};
  return(
    <div style={{textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",color:C.green,fontSize:14}}>SPACE IMPACT // SCORE: {score}</span>
        <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>✕ CLOSE</button>
      </div>
      <div style={{position:"relative",display:"inline-block",maxWidth:"100%"}}>
        <canvas ref={canvasRef} width={W} height={H} style={{border:`1px solid ${C.border}`,borderRadius:6,display:"block",maxWidth:"100%"}}/>
        {dead&&(<div style={{position:"absolute",inset:0,background:"rgba(5,11,24,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:6}}><div style={{color:C.red,fontFamily:"'Share Tech Mono',monospace",fontSize:18,marginBottom:8}}>GAME OVER</div><div style={{color:C.text,fontSize:13,marginBottom:14}}>Score: {score}</div><button onClick={restart} style={{padding:"8px 20px",background:C.green,border:"none",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>RESTART</button></div>)}
      </div>
      <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center"}}>
        <button onTouchStart={()=>mobileMove(-1)} onClick={()=>mobileMove(-1)} style={{padding:"10px 20px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,cursor:"pointer",fontSize:18}}>◀</button>
        <button onTouchStart={mobileShoot} onClick={mobileShoot} style={{padding:"10px 24px",background:`${C.green}20`,border:`1px solid ${C.green}`,borderRadius:6,color:C.green,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>FIRE</button>
        <button onTouchStart={()=>mobileMove(1)} onClick={()=>mobileMove(1)} style={{padding:"10px 20px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,cursor:"pointer",fontSize:18}}>▶</button>
      </div>
      <div style={{marginTop:6,color:C.muted,fontSize:12}}>Arrow keys + Space on desktop • buttons on mobile</div>
    </div>
  );
}

export default function Portfolio(){
  const [recruiterMode,setRecruiterMode]=useState(false);
  const [expandedExp,setExpandedExp]=useState(0);
  const [qaStarted,setQaStarted]=useState(false);
  const [qaVisible,setQaVisible]=useState([]);
  const [qaProgress,setQaProgress]=useState(0);
  const [terminalLines,setTerminalLines]=useState([]);
  const [terminalDone,setTerminalDone]=useState(false);
  const [activeSkillCat,setActiveSkillCat]=useState(0);
  const [animatedBars,setAnimatedBars]=useState(false);
  const [activeSection,setActiveSection]=useState("hero");
  const [activeGame,setActiveGame]=useState(null);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const canvasRef=useRef(null);
  const skillsRef=useRef(null);

  useEffect(()=>{
    const link=document.createElement("link");link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);return()=>document.head.removeChild(link);
  },[]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    const chars="アイウエオ01TESTPASSFAILAPI_QA#{}[]</>SELECT";
    const fontSize=12;let cols=Math.floor(canvas.width/fontSize);let drops=Array(cols).fill(1);
    const draw=()=>{cols=Math.floor(canvas.width/fontSize);if(drops.length!==cols)drops=Array(cols).fill(1);ctx.fillStyle="rgba(5,11,24,0.06)";ctx.fillRect(0,0,canvas.width,canvas.height);drops.forEach((y,i)=>{ctx.fillStyle=i%7===0?"#00ff8818":"#00d4ff15";ctx.font=`${fontSize}px monospace`;ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*fontSize,y*fontSize);if(y*fontSize>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;});};
    const interval=setInterval(draw,55);return()=>{clearInterval(interval);window.removeEventListener("resize",resize);};
  },[]);

  useEffect(()=>{
    const lines=[{text:"$ trison --init portfolio.exe",color:C.muted},{text:"> Booting: Test Analyst | Web Systems | QA Engineer...",color:C.primary},{text:"> ISTQB CTFL ✓ | BSc IT Systems Development ✓ | 3+ years exp ✓",color:C.green},{text:"> Targeting: Associate Web Systems Analyst @ Thrive",color:C.amber},{text:"> Status: [ READY ] — Open to opportunities",color:C.green}];
    let i=0;const next=()=>{if(i<lines.length){setTerminalLines(p=>[...p,lines[i++]]);setTimeout(next,800);}else{setTerminalDone(true);}};setTimeout(next,600);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setAnimatedBars(true);},{threshold:0.2});
    if(skillsRef.current)obs.observe(skillsRef.current);return()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    const ids=["hero","about","skills","experience","qa","websites","games"];
    const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.id);});},{threshold:0.3});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});return()=>obs.disconnect();
  },[]);

  const runTestsNow=()=>{setQaStarted(true);setQaVisible([]);setQaProgress(0);QA_TESTS.forEach((_,i)=>{setTimeout(()=>{setQaVisible(p=>[...p,i]);setQaProgress(Math.round(((i+1)/QA_TESTS.length)*100));},300+i*450);});};
  const runTests=()=>{if(qaStarted){setQaStarted(false);setQaVisible([]);setQaProgress(0);setTimeout(runTestsNow,100);}else{runTestsNow();}};
  const qaStats={pass:qaVisible.filter(i=>QA_TESTS[i].status==="pass").length,fail:qaVisible.filter(i=>QA_TESTS[i].status==="fail").length,warn:qaVisible.filter(i=>QA_TESTS[i].status==="warn").length};

  const navLinks=["hero","about","skills","experience","qa","websites","games"];
  const navLabels={hero:"Home",about:"Profile",skills:"Skills",experience:"Experience",qa:"QA Lab",websites:"Sites",games:"Games"};

  return(
    <div style={{fontFamily:"'Rajdhani','Share Tech Mono',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",overflowX:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)"}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(5,11,24,0.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Terminal size={18} color={C.primary}/><span style={{color:C.primary,fontFamily:"'Share Tech Mono',monospace",fontSize:14,fontWeight:700}}>TRISON.SYS</span></div>
        <div style={{display:"flex",gap:2,alignItems:"center"}} className="desktop-nav">
          {navLinks.map(id=>(<a key={id} href={`#${id}`} style={{padding:"4px 8px",borderRadius:4,fontSize:11,textDecoration:"none",fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:activeSection===id?C.primary:C.muted,background:activeSection===id?`${C.primary}15`:"transparent",border:activeSection===id?`1px solid ${C.primary}40`:"1px solid transparent",transition:"all 0.2s"}}>{navLabels[id]}</a>))}
          <button onClick={()=>setRecruiterMode(r=>!r)} style={{display:"flex",alignItems:"center",gap:4,marginLeft:8,padding:"4px 10px",borderRadius:4,border:`1px solid ${recruiterMode?C.green:C.border}`,background:recruiterMode?`${C.green}18`:"transparent",color:recruiterMode?C.green:C.muted,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>
            {recruiterMode?<Eye size={12}/>:<EyeOff size={12}/>}{recruiterMode?"ON":"REC"}
          </button>
        </div>
        <button onClick={()=>setMobileMenuOpen(m=>!m)} className="hamburger" style={{display:"none",background:"transparent",border:`1px solid ${C.border}`,color:C.text,borderRadius:4,padding:"6px 10px",cursor:"pointer",fontSize:16}}>{mobileMenuOpen?"✕":"☰"}</button>
      </nav>

      {mobileMenuOpen&&(
        <div style={{position:"fixed",top:56,left:0,right:0,zIndex:99,background:"rgba(5,11,24,0.98)",borderBottom:`1px solid ${C.border}`,padding:16,display:"flex",flexDirection:"column",gap:8}}>
          {navLinks.map(id=>(<a key={id} href={`#${id}`} onClick={()=>setMobileMenuOpen(false)} style={{padding:"12px 16px",borderRadius:6,fontSize:14,textDecoration:"none",fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:activeSection===id?C.primary:C.text,background:activeSection===id?`${C.primary}15`:C.surface,border:`1px solid ${activeSection===id?C.primary+"40":C.border}`}}>{navLabels[id]}</a>))}
        </div>
      )}

      {recruiterMode&&(
        <div style={{position:"fixed",top:56,left:0,right:0,zIndex:98,background:`linear-gradient(90deg,${C.green}22,${C.green}11)`,borderBottom:`1px solid ${C.green}40`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[["Role","Test Analyst → Web Systems"],["Cert","ISTQB CTFL"],["Location","Durban, SA"],["Available","Immediately"]].map(([k,v])=>(<div key={k}><div style={{fontSize:9,color:C.muted,letterSpacing:1}}>{k}</div><div style={{fontSize:12,color:C.white,fontWeight:600}}>{v}</div></div>))}
          </div>
          <a href="mailto:trison7@gmail.com" style={{padding:"6px 14px",background:C.green,color:"#050b18",borderRadius:4,textDecoration:"none",fontSize:11,fontWeight:700}}>CONTACT</a>
        </div>
      )}

      {/* HERO */}
      <section id="hero" style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",paddingTop:80,overflow:"hidden"}}>
        <canvas ref={canvasRef} style={{position:"absolute",inset:0,opacity:0.5}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 50% 50%,rgba(0,212,255,0.06) 0%,transparent 70%)"}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:800,padding:"0 16px",width:"100%"}}>
          <div style={{marginBottom:24,display:"flex",justifyContent:"center"}}>
            <div style={{width:110,height:110,borderRadius:"50%",border:`3px solid ${C.primary}`,overflow:"hidden",boxShadow:`0 0 30px ${C.primary}40`,background:C.surface}}>
              <img src="/trison.jpg" alt="Trison Pillay" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
            </div>
          </div>
          <div style={{marginBottom:8}}><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:4,color:C.primary}}>// portfolio.exe — v2.0</span></div>
          <h1 style={{fontSize:"clamp(2.2rem,8vw,5rem)",fontWeight:700,margin:"0 0 8px",fontFamily:"'Rajdhani',sans-serif",letterSpacing:2,background:`linear-gradient(135deg,${C.white},${C.primary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>TRISON PILLAY</h1>
          <div style={{fontSize:"clamp(0.8rem,2.5vw,1.2rem)",color:C.primary,fontWeight:600,letterSpacing:2,marginBottom:28,textTransform:"uppercase"}}>Test Analyst &nbsp;|&nbsp; Web Systems &nbsp;|&nbsp; QA Engineer</div>
          <div style={{background:"rgba(10,22,40,0.85)",border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 18px",textAlign:"left",marginBottom:28,backdropFilter:"blur(8px)"}}>
            <div style={{display:"flex",gap:6,marginBottom:10}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}<span style={{marginLeft:8,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>terminal — trison@portfolio:~</span></div>
            {terminalLines.map((line,i)=><div key={i} style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"clamp(10px,2vw,12px)",color:line.color,marginBottom:3,lineHeight:1.6}}>{line.text}</div>)}
            {terminalDone&&<div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.primary,marginTop:3}}><span style={{animation:"blink 1s step-end infinite"}}>█</span></div>}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#qa" style={{display:"flex",alignItems:"center",gap:8,padding:"11px 22px",background:C.primary,color:"#050b18",borderRadius:6,textDecoration:"none",fontWeight:700,fontSize:12,letterSpacing:1}}><Play size={13}/> RUN MY TESTS</a>
            <a href="#websites" style={{display:"flex",alignItems:"center",gap:8,padding:"11px 22px",border:`1px solid ${C.primary}`,color:C.primary,borderRadius:6,textDecoration:"none",fontWeight:700,fontSize:12,letterSpacing:1}}><Globe size={13}/> MY SITES</a>
            <a href="#games" style={{display:"flex",alignItems:"center",gap:8,padding:"11px 22px",border:`1px solid ${C.border}`,color:C.text,borderRadius:6,textDecoration:"none",fontWeight:700,fontSize:12,letterSpacing:1}}><Gamepad2 size={13}/> PLAY GAMES</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{padding:"60px 16px",background:C.surface}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="01 // PROFILE" title="Who I Am" accent={C.primary}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24,marginTop:36}}>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
              {[[<Cpu size={14}/>, "ISTQB CTFL Certified", C.primary],[<Globe size={14}/>, "CMS · DNS · CDN · Cloudflare", C.green],[<Database size={14}/>, "BSc IT — Systems Development", C.amber],[<Terminal size={14}/>, "3+ Years Industry Experience", C.purple],[<Code2 size={14}/>, "Python · Java · C# · JS · SQL", C.primary],[<Shield size={14}/>, "WAF · SSL · Security Audits", C.green]].map(([icon,text,color],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<5?`1px solid ${C.border}`:"none"}}><span style={{color}}>{icon}</span><span style={{fontSize:13}}>{text}</span></div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["// core_identity",C.green,"I don't just test systems — I build them, break them, and make them better. A rare hybrid who bridges QA, web systems management, and integration debugging."],["// why_it_matters",C.amber,"My L2 Support background means I understand systems from the infrastructure up — DNS, CDN, APIs, CMS. My QA role means I validate from the user down. That full-stack perspective is rare."],["// current_target",C.purple,"Targeting the Associate Web Systems Analyst role at Thrive — a natural fit combining my web platform expertise, API debugging experience, and quality-first mindset."]].map(([label,color,text])=>(
                <div key={label} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:18,borderTop:`3px solid ${color}`}}>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color,letterSpacing:2,marginBottom:8}}>{label}</div>
                  <p style={{margin:0,lineHeight:1.8,fontSize:13}}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{padding:"60px 16px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="02 // SKILLS_MATRIX" title="Technical Proficiency" accent={C.green}/>
          <div style={{display:"flex",gap:8,marginTop:28,marginBottom:20,flexWrap:"wrap"}}>
            {SKILLS.map((s,i)=>(<button key={i} onClick={()=>{setActiveSkillCat(i);setAnimatedBars(false);setTimeout(()=>setAnimatedBars(true),50);}} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:6,border:`1px solid ${activeSkillCat===i?s.color:C.border}`,background:activeSkillCat===i?`${s.color}18`:"transparent",color:activeSkillCat===i?s.color:C.muted,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12}}><span style={{color:s.color}}>{s.icon}</span>{s.cat}</button>))}
          </div>
          <div ref={skillsRef} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
            {SKILLS[activeSkillCat].items.map((skill,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{skill.name}</span><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:SKILLS[activeSkillCat].color}}>{skill.level}%</span></div>
                <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${SKILLS[activeSkillCat].color},${SKILLS[activeSkillCat].color}88)`,width:animatedBars?`${skill.level}%`:"0%",transition:`width 0.8s cubic-bezier(0.4,0,0.2,1) ${i*0.08}s`,boxShadow:`0 0 8px ${SKILLS[activeSkillCat].color}60`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{padding:"60px 16px",background:C.surface}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="03 // WORK_HISTORY" title="Professional Experience" accent={C.amber}/>
          <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:10}}>
            {EXPERIENCE.map((exp,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${expandedExp===i?exp.color+"60":C.border}`,borderRadius:10,overflow:"hidden",borderLeft:`3px solid ${exp.color}`}}>
                <button onClick={()=>setExpandedExp(expandedExp===i?-1:i)} style={{width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",color:C.text,fontFamily:"inherit"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:34,height:34,borderRadius:8,background:`${exp.color}18`,border:`1px solid ${exp.color}40`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:700,color:exp.color}}>{exp.type.slice(0,3).toUpperCase()}</span></div>
                    <div style={{textAlign:"left"}}><div style={{fontSize:14,fontWeight:700,color:C.white}}>{exp.role}</div><div style={{fontSize:11,color:exp.color}}>{exp.company}</div></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>{exp.period}</span><ChevronRight size={13} color={C.muted} style={{transform:expandedExp===i?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}/></div>
                </button>
                {expandedExp===i&&(<div style={{padding:"0 18px 16px",borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:12,display:"flex",flexDirection:"column",gap:7}}>{exp.bullets.map((b,j)=>(<div key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}><ChevronRight size={11} color={exp.color} style={{marginTop:3,flexShrink:0}}/><span style={{fontSize:13,lineHeight:1.6}}>{b}</span></div>))}</div></div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QA */}
      <section id="qa" style={{padding:"60px 16px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="04 // QA_PLAYGROUND" title="Test My Thinking" accent={C.primary}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:28}}>Click RUN TEST SUITE to simulate a QA pass on a web system.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:20}}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary,letterSpacing:2,marginBottom:14}}>// test_control_panel</div>
              <div style={{marginBottom:14}}><div style={{fontSize:11,color:C.muted,marginBottom:5}}>SYSTEM UNDER TEST</div><div style={{padding:"7px 11px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.text}}>prop-data.staging.co.za:3000</div></div>
              <div style={{marginBottom:14}}><div style={{fontSize:11,color:C.muted,marginBottom:5}}>TEST SUITE</div>{["Functional Tests (4)","API Integration (2)","Security (1)","Cross-browser (1)"].map(t=>(<div key={t} style={{display:"flex",alignItems:"center",gap:7,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.text,marginBottom:3}}><CheckCircle2 size={10} color={C.green}/>{t}</div>))}</div>
              {qaStarted&&(<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>PROGRESS</span><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary}}>{qaProgress}%</span></div><div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:C.primary,width:`${qaProgress}%`,transition:"width 0.3s ease"}}/></div></div>)}
              {qaVisible.length>0&&(<div style={{display:"flex",gap:8,marginBottom:14}}>{[[qaStats.pass,"PASS",C.green],[qaStats.fail,"FAIL",C.red],[qaStats.warn,"WARN",C.amber]].map(([n,l,c])=>(<div key={l} style={{flex:1,padding:"7px 0",textAlign:"center",background:`${c}12`,border:`1px solid ${c}40`,borderRadius:6}}><div style={{fontSize:18,fontWeight:700,color:c}}>{n}</div><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:c}}>{l}</div></div>))}</div>)}
              <button onClick={runTests} style={{width:"100%",padding:"11px",borderRadius:6,border:qaProgress===100?`1px solid ${C.green}`:"none",cursor:"pointer",background:qaProgress===100?`${C.green}18`:C.primary,color:qaProgress===100?C.green:"#050b18",fontFamily:"inherit",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                {qaProgress===100?<><RefreshCw size={12}/> RUN AGAIN</>:<><Play size={12}/> RUN TEST SUITE</>}
              </button>
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22,maxHeight:420,overflowY:"auto"}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary,letterSpacing:2,marginBottom:14}}>// test_results_log</div>
              {!qaStarted&&<div style={{textAlign:"center",padding:"36px 0",color:C.muted,fontFamily:"'Share Tech Mono',monospace",fontSize:11}}>&gt; Awaiting test execution..._</div>}
              {QA_TESTS.map((test,i)=>qaVisible.includes(i)&&(<div key={test.id} style={{padding:"9px 11px",marginBottom:7,borderRadius:6,background:test.status==="fail"?`${C.red}10`:test.status==="warn"?`${C.amber}10`:`${C.green}08`,border:`1px solid ${test.status==="fail"?C.red+"40":test.status==="warn"?C.amber+"40":C.green+"30"}`,animation:"fadeIn 0.3s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                  {test.status==="pass"?<CheckCircle2 size={11} color={C.green}/>:test.status==="fail"?<XCircle size={11} color={C.red}/>:<AlertTriangle size={11} color={C.amber}/>}
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:test.status==="fail"?C.red:test.status==="warn"?C.amber:C.green}}>[{test.status.toUpperCase()}]</span>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:C.muted}}>{test.id}</span>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:C.muted,marginLeft:"auto"}}>{test.time}</span>
                </div>
                <div style={{fontSize:12,color:C.text,fontWeight:600,marginBottom:2}}>{test.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{test.detail}</div>
              </div>))}
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITES */}
      <section id="websites" style={{padding:"60px 16px",background:C.surface}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="05 // LIVE_SITES" title="Websites I've Built" accent={C.purple}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:28}}>Click any card to visit the live site.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
            {WEBSITES.map((w,i)=>(
              <a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
                <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:20,borderTop:`3px solid ${w.color}`,transition:"all 0.2s",cursor:"pointer",height:"100%"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${w.color}20`;e.currentTarget.style.borderColor=w.color;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.border;}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{w.icon}</span><div><div style={{fontSize:14,fontWeight:700,color:C.white}}>{w.name}</div><div style={{fontSize:10,color:w.color,letterSpacing:1}}>{w.type.toUpperCase()}</div></div></div>
                    <ExternalLink size={13} color={w.color}/>
                  </div>
                  <p style={{margin:0,fontSize:12,lineHeight:1.6,color:C.muted}}>{w.desc}</p>
                  <div style={{marginTop:10,fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:w.color,opacity:0.7}}>{w.url.replace("https://","")}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" style={{padding:"60px 16px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="06 // ARCADE" title="Play a Game" accent={C.green}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:28}}>Taking a break from testing — pick a game!</p>
          {activeGame?(
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
              {activeGame==="snake"&&<SnakeGame onClose={()=>setActiveGame(null)}/>}
              {activeGame==="soccer"&&<SoccerGame onClose={()=>setActiveGame(null)}/>}
              {activeGame==="space"&&<SpaceGame onClose={()=>setActiveGame(null)}/>}
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
              {[{id:"snake",icon:"🐍",name:"Snake",desc:"Eat the food, grow longer, don't crash!",color:C.green},{id:"soccer",icon:"⚽",name:"Soccer Penalty",desc:"Beat the goalie! Click to aim and shoot.",color:C.amber},{id:"space",icon:"🚀",name:"Space Impact",desc:"Shoot down alien invaders before they reach you!",color:C.primary}].map(g=>(
                <div key={g.id} onClick={()=>setActiveGame(g.id)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,borderTop:`3px solid ${g.color}`,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${g.color}20`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{fontSize:44,marginBottom:10}}>{g.icon}</div>
                  <div style={{fontSize:17,fontWeight:700,color:C.white,marginBottom:6}}>{g.name}</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:14}}>{g.desc}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 18px",background:`${g.color}18`,border:`1px solid ${g.color}40`,borderRadius:6,color:g.color,fontWeight:700,fontSize:12}}><Gamepad2 size={12}/> PLAY NOW</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"36px 16px",textAlign:"center",borderTop:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.muted,letterSpacing:2}}>TRISON PILLAY — DURBAN, ZA — trison7@gmail.com — 084 232 8084</div>
        <div style={{marginTop:8,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.border}}>© 2026 — TRISON PILLAY</div>
      </footer>

      <style>{`
        html{scroll-behavior:smooth;}*{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @media(max-width:768px){.desktop-nav{display:none!important;}.hamburger{display:flex!important;}}
        @media(min-width:769px){.hamburger{display:none!important;}}
      `}</style>
    </div>
  );
}

function SectionHeader({label,title,accent}){
  return(
    <div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:accent,letterSpacing:3,marginBottom:8}}>{label}</div>
      <h2 style={{margin:0,fontSize:"clamp(1.4rem,3vw,2.2rem)",fontWeight:700,fontFamily:"'Rajdhani',sans-serif",color:"#ffffff",letterSpacing:1}}>{title}</h2>
      <div style={{width:48,height:2,background:accent,borderRadius:1,marginTop:10,boxShadow:`0 0 8px ${accent}60`}}/>
    </div>
  );
}
