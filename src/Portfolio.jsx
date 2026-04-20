import { useState, useEffect, useRef } from 'react';
import {
  Terminal, Code2, Shield, Globe, Database, Cpu, CheckCircle2,
  XCircle, AlertTriangle, Play, Eye, EyeOff,
  ChevronRight, Bug, RefreshCw, Menu, X, Phone, Mail,
  Gamepad2, ExternalLink,
} from 'lucide-react';
import SpaceShooter from './games/SpaceShooter.jsx';
import MemoryMatch  from './games/MemoryMatch.jsx';
import QAQuiz       from './games/QAQuiz.jsx';
import SnakeGame    from './games/SnakeGame.jsx';
import ObstacleAvoider from './games/ObstacleAvoider.jsx';

const C = {
  bg:'#050b18', surface:'#0a1628', surface2:'#0f1e38',
  border:'#1a2f50', primary:'#00d4ff', green:'#00ff88',
  amber:'#ffb800', red:'#ff4466', purple:'#b066ff',
  text:'#b8d4f0', muted:'#4a6a8a', white:'#ffffff',
};

const SKILLS = [
  { cat:'QA & Testing', icon:<Bug size={15}/>, color:C.primary, items:[
    {name:'Regression Testing',level:95},{name:'API Testing (Postman)',level:90},
    {name:'Test Case Design',level:92},{name:'Jira / Defect Tracking',level:95},
    {name:'UAT & Integration Testing',level:88},{name:'Performance Testing',level:75},
    {name:'Cross-browser / Device',level:85},{name:'Exploratory Testing',level:80},
  ]},
  { cat:'Web Systems', icon:<Globe size={15}/>, color:C.green, items:[
    {name:'CMS & DNS Management',level:90},{name:'API Integration & Debug',level:88},
    {name:'Staging Environments',level:85},{name:'CDN / Cloudflare Caching',level:82},
    {name:'CI/CD & GitHub',level:78},{name:'AWS / cPanel Hosting',level:80},
    {name:'SEO & Analytics',level:75},{name:'Security Audits',level:78},
  ]},
  { cat:'Development', icon:<Code2 size={15}/>, color:C.amber, items:[
    {name:'JavaScript / HTML / CSS',level:82},{name:'Python',level:78},
    {name:'Java / C#',level:75},{name:'SQL / MySQL',level:80},
    {name:'PHP',level:70},{name:'Shell Scripting',level:68},
    {name:'MQL5 / MetaTrader 5',level:72},{name:'Pine Script',level:65},
  ]},
  { cat:'Security & Cloud', icon:<Shield size={15}/>, color:C.purple, items:[
    {name:'WAF Configuration',level:78},{name:'SSL Management',level:85},
    {name:'Security Audits',level:80},{name:'Penetration Testing',level:65},
    {name:'Cloud Hosting (AWS)',level:75},{name:'Cloudflare',level:85},
    {name:'Cybersecurity Compliance',level:72},{name:'Incident Response',level:70},
  ]},
];

const EXPERIENCE = [
  { company:'Prop Data', role:'Test Analyst', period:'2025 – Present', type:'QA', color:C.primary, bullets:[
    'Lead QA across web platforms and property listing systems: functional, regression, integration & UAT',
    'API testing for property portals (Property24, Private Property), CRM systems, and data feeds',
    'Reduced post-release defects through structured regression testing cycles',
    'Full defect lifecycle management in Jira; liaison between technical and non-technical stakeholders',
    'Full Agile ceremonies — stand-ups, sprint planning, retrospectives',
  ]},
  { company:'Prop Data', role:'L2 Support Engineer', period:'2023 – 2025', type:'Support', color:C.green, bullets:[
    'Resolved client website errors, API integration failures, and CMS customization issues',
    'Managed DNS, CDN, and caching for high-performance real estate web platforms',
    'Validated listing data feeds to Property24, Private Property, and James Edition',
    'Website security audits covering WAF, SSL, and performance bottlenecks',
    'Emergency incident response for critical website downtime events',
  ]},
  { company:'D & C Signs', role:'Senior Sales & Marketing Consultant', period:'2021 – 2023', type:'Marketing', color:C.amber, bullets:[
    'Google Ads, LinkedIn Sales Navigator, and social media campaign management',
    'Google Analytics metrics monitoring to refine digital marketing strategies',
  ]},
];

const WEBSITES = [
  { name:'TalentFi', url:'https://talentfi.net/', icon:'🧑‍💼', color:C.primary,
    type:'Employer of Record Platform', desc:'South Africa\'s trusted employment partner — hire, pay, and manage talent with full legal compliance.' },
  { name:'Attrakta Animation', url:'https://attraktanimation.co.za/home', icon:'🎬', color:C.purple,
    type:'Animation Studio', desc:'Professional animation studio showcasing portfolio, services, and creative production capabilities.' },
  { name:'Through Balls', url:'https://throughballs.com/', icon:'⚽', color:C.green,
    type:'Sports Platform', desc:'Football analytics and content platform built for the modern fan and scout.' },
  { name:'EM Debt Solutions', url:'https://emdebtsolutions.co.za/', icon:'💼', color:C.amber,
    type:'Financial Services', desc:'Professional debt management and financial solutions tailored for South African clients.' },
  { name:'Spec Peptides', url:'https://specpeptides.com/', icon:'🧬', color:C.red,
    type:'E-Commerce Platform', desc:'High-performance product catalogue with CDN configuration and sub-2s load times.' },
  { name:'MLM Power', url:'https://mlmpower.co.za/', icon:'📈', color:C.green,
    type:'Marketing Website', desc:'SEO-optimised marketing site with Schema Markup and Google Ads integration.' },
  { name:'Jimny Culture', url:'https://jimnyculture.co.za/', icon:'🚙', color:C.purple,
    type:'Community Platform', desc:'Centralised brand hub for niche automotive community with social integration.' },
  { name:'65x Leads', url:'https://65xleads.com/', icon:'⚡', color:C.primary,
    type:'Lead Generation Funnel', desc:'Automated lead funnel integrating ReachInbox and Instantly with CRM workflows.' },
];

const QA_TESTS = [
  {id:'TC-001',name:'Login form — required field validation',status:'pass',time:'0.8s',detail:'All 4 required fields trigger correct validation messages on empty submit.'},
  {id:'TC-002',name:'API response — JSON schema validation',status:'pass',time:'1.2s',detail:'Response body matches expected schema. All 23 fields present and correctly typed.'},
  {id:'TC-003',name:'Empty email field — error message display',status:'fail',time:'0.3s',detail:'BUG: No error shown when email field is empty. Expected: "Email is required". [JIRA-441]'},
  {id:'TC-004',name:'Cross-browser layout — Chrome/Firefox/Safari',status:'pass',time:'2.1s',detail:'Layout consistent across Chrome 124, Firefox 125, Safari 17. No regressions.'},
  {id:'TC-005',name:'API timeout — user feedback message',status:'warn',time:'5.2s',detail:'WARNING: Request times out but shows generic server error, not user-friendly message.'},
  {id:'TC-006',name:'Listing sync — data integrity (47 fields)',status:'pass',time:'0.9s',detail:'All 47 property listing fields match source CRM. Data integrity verified.'},
  {id:'TC-007',name:'SQL injection — input sanitisation (12 vectors)',status:'pass',time:'0.4s',detail:'All 12 injection vectors correctly sanitised and rejected with 400 response.'},
  {id:'TC-008',name:'Mobile viewport < 375px — nav overlap',status:'fail',time:'0.6s',detail:'BUG: Nav menu overlaps hero content at < 375px viewport (iPhone SE). [JIRA-442]'},
  {id:'TC-009',name:'Password field — special character support',status:'pass',time:'0.5s',detail:'All special characters accepted. Encoding handled correctly on server side.'},
  {id:'TC-010',name:'Session timeout — auto logout at 30 min',status:'pass',time:'30.0s',detail:'Session expires at exactly 30 minutes. User redirected to login with toast message.'},
  {id:'TC-011',name:'File upload — 10MB limit enforcement',status:'pass',time:'1.4s',detail:'Files above 10MB correctly rejected with error. Files at exactly 10MB accepted.'},
  {id:'TC-012',name:'Search — XSS payload in search field',status:'pass',time:'0.7s',detail:'All 8 XSS payloads stripped and escaped. No script execution occurred.'},
  {id:'TC-013',name:'API rate limiting — 100 req/min',status:'warn',time:'2.3s',detail:'WARNING: Rate limiter triggers at 95 req/min, not 100 as documented. Off-spec.'},
  {id:'TC-014',name:'PDF export — listing data accuracy',status:'pass',time:'3.1s',detail:'Exported PDF matches all 12 data fields. Formatting consistent across OS.'},
  {id:'TC-015',name:'Two-factor auth — SMS delivery',status:'pass',time:'4.8s',detail:'OTP delivered within 5s. Code expires correctly at 10 minutes.'},
  {id:'TC-016',name:'Cache invalidation — after listing update',status:'fail',time:'1.1s',detail:'BUG: Stale cached data served for 45s after update. CDN purge not triggered. [JIRA-443]'},
];

const GAME_LIST = [
  { id:'snake',    name:'Snake',          icon:'🐍', type:'Classic',     desc:'Eat the food, grow longer. Speed up every 5 points — how long can you survive?', component: SnakeGame },
  { id:'shooter',  name:'Space Shooter',  icon:'🚀', type:'Action',      desc:'Sidescrolling starfighter. Dodge and blast three enemy types.', component: SpaceShooter },
  { id:'memory',   name:'QA Memory Match',icon:'🧠', type:'Puzzle',      desc:'Flip cards to match QA-themed pairs. Beat your best time.', component: MemoryMatch },
  { id:'quiz',     name:'IT & QA Quiz',   icon:'💡', type:'Educational', desc:'12 questions on QA, APIs, DNS, SQL. What\'s your rank?', component: QAQuiz },
  { id:'obstacle', name:'Obstacle Run',   icon:'🤖', type:'Platformer',  desc:'Jump over obstacles with double-jump. How far can you go?', component: ObstacleAvoider },
];

function SH({ label, title, accent }) {
  return (
    <div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:accent, letterSpacing:3, marginBottom:8 }}>{label}</div>
      <h2 style={{ margin:0, fontSize:'clamp(1.5rem,3vw,2.1rem)', fontWeight:700, fontFamily:"'Rajdhani',sans-serif", color:'#fff', letterSpacing:1 }}>{title}</h2>
      <div style={{ width:48, height:2, background:accent, borderRadius:1, marginTop:10, boxShadow:`0 0 8px ${accent}60` }} />
    </div>
  );
}

export default function Portfolio() {
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [expandedExp, setExpandedExp] = useState(0);
  const [activeSkillCat, setActiveSkillCat] = useState(0);
  const [animBars, setAnimBars] = useState(false);
  const [qaStarted, setQaStarted] = useState(false);
  const [qaVisible, setQaVisible] = useState([]);
  const [qaProgress, setQaProgress] = useState(0);
  const [qaFilter, setQaFilter] = useState('all');
  const [activeGame, setActiveGame] = useState(null);
  const [termLines, setTermLines] = useState([]);
  const [termDone, setTermDone] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileNav, setMobileNav] = useState(false);

  const canvasRef = useRef(null);
  const skillsRef = useRef(null);

  // Fonts
  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }, []);

  // 3D Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const nodes = Array.from({length:100}, () => ({
      x:(Math.random()-0.5)*2000, y:(Math.random()-0.5)*2000, z:Math.random()*1200,
      vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, vz:-0.4-Math.random()*0.4,
      r:Math.random()*2+0.5, color:Math.random()>0.7?'#00ff88':'#00d4ff',
    }));
    const project=(x,y,z)=>{const fov=600,cx=canvas.width/2,cy=canvas.height/2,scale=fov/(fov+z);return{sx:cx+x*scale,sy:cy+y*scale,scale};};
    let frame=0;
    const draw=()=>{
      frame++;
      ctx.fillStyle='rgba(5,11,24,0.15)';ctx.fillRect(0,0,canvas.width,canvas.height);
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,dz=nodes[i].z-nodes[j].z;
        const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
        if(dist<260){const pi=project(nodes[i].x,nodes[i].y,nodes[i].z),pj=project(nodes[j].x,nodes[j].y,nodes[j].z);
          const alpha=(1-dist/260)*0.1;ctx.strokeStyle=`rgba(0,212,255,${alpha})`;ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(pi.sx,pi.sy);ctx.lineTo(pj.sx,pj.sy);ctx.stroke();}
      }
      nodes.forEach(n=>{
        n.x+=n.vx;n.y+=n.vy;n.z+=n.vz;
        if(n.z<-200){n.z=1200;n.x=(Math.random()-0.5)*2000;n.y=(Math.random()-0.5)*2000;}
        const p=project(n.x,n.y,n.z);
        if(p.sx<-50||p.sx>canvas.width+50||p.sy<-50||p.sy>canvas.height+50)return;
        const alpha=Math.min(1,(n.z+200)/400)*0.8;
        ctx.beginPath();ctx.arc(p.sx,p.sy,n.r*p.scale,0,Math.PI*2);
        ctx.fillStyle=n.color==='#00ff88'?`rgba(0,255,136,${alpha})`:`rgba(0,212,255,${alpha})`;
        ctx.shadowBlur=6*p.scale;ctx.shadowColor=n.color;ctx.fill();ctx.shadowBlur=0;
      });
      if(frame%3===0){const y=(frame*0.8)%canvas.height;const g=ctx.createLinearGradient(0,y-30,0,y+2);g.addColorStop(0,'rgba(0,212,255,0)');g.addColorStop(1,'rgba(0,212,255,0.04)');ctx.fillStyle=g;ctx.fillRect(0,y-30,canvas.width,32);}
    };
    const id=setInterval(draw,30);
    return()=>{clearInterval(id);window.removeEventListener('resize',resize);};
  },[]);

  // Terminal
  useEffect(()=>{
    const lines=[
      {text:'$ trison --init portfolio.exe', color:C.muted},
      {text:'> ISTQB CTFL ✓ | BSc IT ✓ | 3+ yrs ✓', color:C.green},
      {text:'> Skills: QA · Web Systems · APIs · DevOps', color:C.primary},
      {text:'> Targeting: Associate Web Systems Analyst', color:C.amber},
      {text:'> Status: [ OPEN TO OPPORTUNITIES ]', color:C.green},
    ];
    let i=0;const next=()=>{if(i<lines.length){setTermLines(p=>[...p,lines[i++]]);setTimeout(next,700);}else setTermDone(true);};
    setTimeout(next,500);
  },[]);

  // Skills bar animation
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setAnimBars(true);},{threshold:0.2});
    if(skillsRef.current)obs.observe(skillsRef.current);
    return()=>obs.disconnect();
  },[]);

  // Active section tracking
  useEffect(()=>{
    const ids=['hero','about','skills','experience','qa','websites','games'];
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.id);});},{threshold:0.3});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);

  const runQA=()=>{
    setQaStarted(true);setQaVisible([]);setQaProgress(0);
    QA_TESTS.forEach((_,i)=>setTimeout(()=>{setQaVisible(p=>[...p,i]);setQaProgress(Math.round(((i+1)/QA_TESTS.length)*100));},200+i*300));
  };
  const resetQA=()=>{setQaStarted(false);setQaVisible([]);setQaProgress(0);setQaFilter('all');};

  const filtered=qaVisible.filter(i=>{
    if(qaFilter==='all')return true;
    return QA_TESTS[i].status===qaFilter;
  });
  const qaStats={pass:qaVisible.filter(i=>QA_TESTS[i].status==='pass').length,fail:qaVisible.filter(i=>QA_TESTS[i].status==='fail').length,warn:qaVisible.filter(i=>QA_TESTS[i].status==='warn').length};

  const NAV=[
    {id:'hero',label:'HOME'},{id:'about',label:'ABOUT'},{id:'skills',label:'SKILLS'},
    {id:'experience',label:'EXP'},{id:'qa',label:'QA LAB'},{id:'websites',label:'SITES'},{id:'games',label:'GAMES'},
  ];

  const ActiveGame = activeGame ? GAME_LIST.find(g=>g.id===activeGame)?.component : null;

  return (
    <div style={{fontFamily:"'Rajdhani','Share Tech Mono',sans-serif",background:C.bg,color:C.text,minHeight:'100vh',overflowX:'hidden'}}>

      {/* Scanline overlay */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)'}}/>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,background:'rgba(5,11,24,0.96)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`,height:56,display:'flex',alignItems:'center',padding:'0 16px',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Terminal size={16} color={C.primary}/>
          <span style={{fontFamily:"'Share Tech Mono',monospace",color:C.primary,fontSize:13,fontWeight:700}}>TRISON.SYS</span>
        </div>
        {/* Desktop nav */}
        <div style={{display:'flex',gap:2,alignItems:'center'}} className="desktop-nav">
          {NAV.map(n=>(
            <a key={n.id} href={`#${n.id}`} style={{padding:'4px 9px',borderRadius:4,fontSize:11,textDecoration:'none',fontWeight:700,letterSpacing:1,color:activeSection===n.id?C.primary:C.muted,background:activeSection===n.id?`${C.primary}15`:'transparent',border:activeSection===n.id?`1px solid ${C.primary}40`:'1px solid transparent',transition:'all 0.2s'}}>{n.label}</a>
          ))}
          <button onClick={()=>setRecruiterMode(r=>!r)} style={{display:'flex',alignItems:'center',gap:4,marginLeft:8,padding:'4px 10px',borderRadius:4,border:`1px solid ${recruiterMode?C.green:C.border}`,background:recruiterMode?`${C.green}15`:'transparent',color:recruiterMode?C.green:C.muted,cursor:'pointer',fontSize:11,fontFamily:'inherit',fontWeight:700,letterSpacing:1}}>
            {recruiterMode?<Eye size={11}/>:<EyeOff size={11}/>} {recruiterMode?'ON':'REC'}
          </button>
        </div>
        {/* Mobile hamburger */}
        <button onClick={()=>setMobileNav(m=>!m)} className="hamburger" style={{display:'none',background:'transparent',border:`1px solid ${C.border}`,color:C.text,borderRadius:4,padding:'6px 10px',cursor:'pointer',fontSize:16}}>{mobileNav?'✕':'☰'}</button>
      </nav>

      {/* Mobile menu */}
      {mobileNav&&(
        <div style={{position:'fixed',top:56,left:0,right:0,zIndex:199,background:'rgba(5,11,24,0.98)',borderBottom:`1px solid ${C.border}`,padding:16,display:'flex',flexDirection:'column',gap:8}}>
          {NAV.map(n=>(
            <a key={n.id} href={`#${n.id}`} onClick={()=>setMobileNav(false)} style={{padding:'12px 16px',borderRadius:6,fontSize:14,textDecoration:'none',fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:activeSection===n.id?C.primary:C.text,background:activeSection===n.id?`${C.primary}15`:C.surface,border:`1px solid ${activeSection===n.id?C.primary+'40':C.border}`}}>{n.label}</a>
          ))}
          <a href="mailto:trison7@gmail.com" style={{padding:'12px 16px',borderRadius:6,fontSize:14,textDecoration:'none',fontWeight:700,letterSpacing:1,background:`${C.green}18`,border:`1px solid ${C.green}40`,color:C.green,textAlign:'center'}}>📧 EMAIL ME</a>
        </div>
      )}

      {/* Recruiter banner */}
      {recruiterMode&&(
        <div style={{position:'fixed',top:56,left:0,right:0,zIndex:198,background:`linear-gradient(90deg,${C.green}20,${C.green}10)`,borderBottom:`1px solid ${C.green}40`,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {[['Role','Test Analyst → Web Systems'],['Cert','ISTQB CTFL'],['Edu','BSc IT Systems Dev'],['Location','Durban, SA'],['Available','Immediately']].map(([k,v])=>(
              <div key={k}><div style={{fontSize:9,color:C.muted,letterSpacing:1}}>{k}</div><div style={{fontSize:12,color:C.white,fontWeight:600}}>{v}</div></div>
            ))}
          </div>
          <div style={{display:'flex',gap:8}}>
            <a href="mailto:trison7@gmail.com" style={{display:'flex',alignItems:'center',gap:5,padding:'6px 14px',background:C.green,color:'#050b18',borderRadius:4,textDecoration:'none',fontSize:11,fontWeight:700}}><Mail size={12}/> EMAIL</a>
            <a href="tel:0842328084" style={{display:'flex',alignItems:'center',gap:5,padding:'6px 14px',background:'transparent',border:`1px solid ${C.green}`,color:C.green,borderRadius:4,textDecoration:'none',fontSize:11,fontWeight:700}}><Phone size={12}/> CALL</a>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:80,overflow:'hidden'}}>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,opacity:0.55}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 65% 55% at 50% 45%,rgba(0,212,255,0.07) 0%,transparent 70%)'}}/>
        <div style={{position:'relative',zIndex:2,textAlign:'center',maxWidth:820,padding:'0 16px',width:'100%'}}>
          {/* Photo */}
          <div style={{marginBottom:20,display:'flex',justifyContent:'center'}}>
            <div style={{width:108,height:108,borderRadius:'50%',border:`3px solid ${C.primary}`,overflow:'hidden',boxShadow:`0 0 32px ${C.primary}40`,background:C.surface}}>
              <img src="/trison.jpg" alt="Trison Pillay" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';}}/>
            </div>
          </div>
          <div style={{marginBottom:6}}><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:4,color:C.primary}}>// portfolio.exe — v3.0</span></div>
          <h1 style={{fontSize:'clamp(2.4rem,8vw,5rem)',fontWeight:700,margin:'0 0 8px',fontFamily:"'Rajdhani',sans-serif",letterSpacing:2,background:`linear-gradient(135deg,${C.white},${C.primary})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TRISON PILLAY</h1>
          <div style={{fontSize:'clamp(0.85rem,2.5vw,1.15rem)',color:C.primary,fontWeight:600,letterSpacing:2,marginBottom:28,textTransform:'uppercase'}}>Test Analyst &nbsp;|&nbsp; Web Systems &nbsp;|&nbsp; QA Engineer</div>
          {/* Terminal */}
          <div style={{background:'rgba(10,22,40,0.88)',border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 18px',textAlign:'left',marginBottom:28,backdropFilter:'blur(8px)'}}>
            <div style={{display:'flex',gap:6,marginBottom:10}}>{['#ff5f56','#ffbd2e','#27c93f'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}<span style={{marginLeft:8,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>terminal — trison@portfolio:~</span></div>
            {termLines.map((l,i)=><div key={i} style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'clamp(10px,2vw,12px)',color:l.color,marginBottom:3,lineHeight:1.6}}>{l.text}</div>)}
            {termDone&&<div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.primary,marginTop:3}}><span style={{animation:'blink 1s step-end infinite'}}>█</span></div>}
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="#qa" style={{display:'flex',alignItems:'center',gap:7,padding:'11px 22px',background:C.primary,color:'#050b18',borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:12,letterSpacing:1}}><Play size={13}/> RUN MY TESTS</a>
            <a href="#websites" style={{display:'flex',alignItems:'center',gap:7,padding:'11px 22px',border:`1px solid ${C.primary}`,color:C.primary,borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:12,letterSpacing:1}}><Globe size={13}/> LIVE SITES</a>
            <a href="#games" style={{display:'flex',alignItems:'center',gap:7,padding:'11px 22px',border:`1px solid ${C.border}`,color:C.text,borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:12,letterSpacing:1}}><Gamepad2 size={13}/> GAMES</a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{padding:'70px 16px',background:C.surface}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="01 // PROFILE" title="Who I Am" accent={C.primary}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,marginTop:36}}>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
              {[[<Cpu size={14}/>,   'ISTQB CTFL Certified',           C.primary],
                [<Globe size={14}/>, 'CMS · DNS · CDN · Cloudflare',   C.green],
                [<Database size={14}/>,'BSc IT — Systems Development',  C.amber],
                [<Terminal size={14}/>,'3+ Years Industry Experience',  C.purple],
                [<Code2 size={14}/>, 'Python · Java · C# · JS · SQL',  C.primary],
                [<Shield size={14}/>,'WAF · SSL · Security Audits',     C.green],
              ].map(([icon,text,color],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<5?`1px solid ${C.border}`:'none'}}><span style={{color}}>{icon}</span><span style={{fontSize:13}}>{text}</span></div>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[['// core_identity',C.green,'I don\'t just test systems — I build them, break them, and make them better. A rare hybrid who bridges QA, web systems management, and integration debugging.'],
                ['// why_it_matters',C.amber,'My L2 Support background means I understand systems from the infrastructure up — DNS, CDN, APIs, CMS. My QA role means I validate from the user down. That full-stack perspective is rare.'],
                ['// target',C.purple,'Targeting the Associate Web Systems Analyst role at Thrive — a natural fit combining my web platform expertise, API debugging experience, and quality-first mindset.'],
              ].map(([label,color,text])=>(
                <div key={label} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:18,borderTop:`3px solid ${color}`}}>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color,letterSpacing:2,marginBottom:8}}>{label}</div>
                  <p style={{margin:0,lineHeight:1.8,fontSize:13}}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{padding:'70px 16px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="02 // SKILLS_MATRIX" title="Technical Proficiency" accent={C.green}/>
          <div style={{display:'flex',gap:8,marginTop:28,marginBottom:20,flexWrap:'wrap'}}>
            {SKILLS.map((s,i)=>(
              <button key={i} onClick={()=>{setActiveSkillCat(i);setAnimBars(false);setTimeout(()=>setAnimBars(true),50);}} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:6,border:`1px solid ${activeSkillCat===i?s.color:C.border}`,background:activeSkillCat===i?`${s.color}18`:'transparent',color:activeSkillCat===i?s.color:C.muted,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:12}}>
                <span style={{color:s.color}}>{s.icon}</span>{s.cat}
              </button>
            ))}
          </div>
          <div ref={skillsRef} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>
            {SKILLS[activeSkillCat].items.map((skill,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>{skill.name}</span>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:SKILLS[activeSkillCat].color}}>{skill.level}%</span>
                </div>
                <div style={{height:4,background:C.border,borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:2,background:`linear-gradient(90deg,${SKILLS[activeSkillCat].color},${SKILLS[activeSkillCat].color}88)`,width:animBars?`${skill.level}%`:'0%',transition:`width 0.8s cubic-bezier(0.4,0,0.2,1) ${i*0.07}s`,boxShadow:`0 0 8px ${SKILLS[activeSkillCat].color}60`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{padding:'70px 16px',background:C.surface}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="03 // WORK_HISTORY" title="Professional Experience" accent={C.amber}/>
          <div style={{marginTop:32,display:'flex',flexDirection:'column',gap:10}}>
            {EXPERIENCE.map((exp,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${expandedExp===i?exp.color+'55':C.border}`,borderRadius:10,overflow:'hidden',borderLeft:`3px solid ${exp.color}`}}>
                <button onClick={()=>setExpandedExp(expandedExp===i?-1:i)} style={{width:'100%',padding:'14px 18px',background:'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',color:C.text,fontFamily:'inherit'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:34,height:34,borderRadius:8,background:`${exp.color}18`,border:`1px solid ${exp.color}40`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:9,fontWeight:700,color:exp.color}}>{exp.type.slice(0,3).toUpperCase()}</span></div>
                    <div style={{textAlign:'left'}}><div style={{fontSize:14,fontWeight:700,color:C.white}}>{exp.role}</div><div style={{fontSize:11,color:exp.color}}>{exp.company}</div></div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>{exp.period}</span>
                    <ChevronRight size={13} color={C.muted} style={{transform:expandedExp===i?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.2s'}}/>
                  </div>
                </button>
                {expandedExp===i&&(
                  <div style={{padding:'0 18px 16px',borderTop:`1px solid ${C.border}`}}>
                    <div style={{paddingTop:12,display:'flex',flexDirection:'column',gap:7}}>
                      {exp.bullets.map((b,j)=>(
                        <div key={j} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                          <ChevronRight size={11} color={exp.color} style={{marginTop:3,flexShrink:0}}/>
                          <span style={{fontSize:13,lineHeight:1.6}}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QA PLAYGROUND ── */}
      <section id="qa" style={{padding:'70px 16px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="04 // QA_PLAYGROUND" title="Live Test Suite" accent={C.primary}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:28}}>Run 16 simulated test cases across a real staging environment. This is how I work.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:20}}>
            {/* Control panel */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary,letterSpacing:2,marginBottom:14}}>// test_control_panel</div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:C.muted,marginBottom:5}}>SYSTEM UNDER TEST</div><div style={{padding:'7px 11px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.text}}>prop-data.staging.co.za:3000</div></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:C.muted,marginBottom:5}}>SUITE ({QA_TESTS.length} test cases)</div>
                {['Functional (6)','API Integration (3)','Security (3)','Performance (2)','Cross-browser (2)'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:7,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.text,marginBottom:3}}><CheckCircle2 size={10} color={C.green}/>{t}</div>
                ))}
              </div>
              {qaStarted&&(
                <div style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted}}>PROGRESS</span><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary}}>{qaProgress}%</span></div>
                  <div style={{height:4,background:C.border,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',borderRadius:2,background:C.primary,width:`${qaProgress}%`,transition:'width 0.3s ease'}}/></div>
                </div>
              )}
              {qaVisible.length>0&&(
                <div style={{display:'flex',gap:8,marginBottom:14}}>
                  {[[qaStats.pass,'PASS',C.green],[qaStats.fail,'FAIL',C.red],[qaStats.warn,'WARN',C.amber]].map(([n,l,c])=>(
                    <button key={l} onClick={()=>setQaFilter(f=>f===l.toLowerCase()?'all':l.toLowerCase())} style={{flex:1,padding:'7px 0',textAlign:'center',background:qaFilter===l.toLowerCase()?`${c}25`:`${c}10`,border:`1px solid ${qaFilter===l.toLowerCase()?c:c+'40'}`,borderRadius:6,cursor:'pointer',fontFamily:'inherit'}}>
                      <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"'Rajdhani',sans-serif"}}>{n}</div>
                      <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:c}}>{l}</div>
                    </button>
                  ))}
                </div>
              )}
              <div style={{display:'flex',gap:8}}>
                <button onClick={runQA} style={{flex:1,padding:'11px',borderRadius:6,border:'none',cursor:'pointer',background:qaProgress===100?`${C.green}18`:C.primary,color:qaProgress===100?C.green:'#050b18',border:qaProgress===100?`1px solid ${C.green}`:'none',fontFamily:'inherit',fontWeight:700,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
                  <Play size={12}/>{qaProgress===100?'RUN AGAIN':'RUN TEST SUITE'}
                </button>
                {qaStarted&&<button onClick={resetQA} style={{padding:'11px 14px',borderRadius:6,border:`1px solid ${C.border}`,background:'transparent',color:C.muted,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:12}}><RefreshCw size={12}/></button>}
              </div>
            </div>
            {/* Results */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22,maxHeight:460,overflowY:'auto'}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.primary,letterSpacing:2,marginBottom:14}}>// results_log {qaFilter!=='all'?`[filter: ${qaFilter.toUpperCase()}]`:''}</div>
              {!qaStarted&&<div style={{textAlign:'center',padding:'40px 0',color:C.muted,fontFamily:"'Share Tech Mono',monospace",fontSize:11}}>&gt; Awaiting test execution..._</div>}
              {filtered.map(i=>{const test=QA_TESTS[i];return(
                <div key={test.id} style={{padding:'9px 11px',marginBottom:7,borderRadius:6,background:test.status==='fail'?`${C.red}10`:test.status==='warn'?`${C.amber}10`:`${C.green}08`,border:`1px solid ${test.status==='fail'?C.red+'40':test.status==='warn'?C.amber+'40':C.green+'25'}`,animation:'fadeInUp 0.3s ease'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                    {test.status==='pass'?<CheckCircle2 size={11} color={C.green}/>:test.status==='fail'?<XCircle size={11} color={C.red}/>:<AlertTriangle size={11} color={C.amber}/>}
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:test.status==='fail'?C.red:test.status==='warn'?C.amber:C.green}}>[{test.status.toUpperCase()}]</span>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:C.muted}}>{test.id}</span>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:C.muted,marginLeft:'auto'}}>{test.time}</span>
                  </div>
                  <div style={{fontSize:12,color:C.text,fontWeight:600,marginBottom:2}}>{test.name}</div>
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{test.detail}</div>
                </div>
              );})}
            </div>
          </div>
        </div>
      </section>

      {/* ── WEBSITES ── */}
      <section id="websites" style={{padding:'70px 16px',background:C.surface}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="05 // LIVE_SITES" title="Websites I've Built" accent={C.purple}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:32}}>Click any card to open the live site in a new tab.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {WEBSITES.map((w,i)=>(
              <a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none',display:'block'}}>
                <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:20,borderTop:`3px solid ${w.color}`,transition:'all 0.22s',cursor:'pointer',height:'100%'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 10px 28px ${w.color}22`;e.currentTarget.style.borderColor=w.color;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor=C.border;}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontSize:24}}>{w.icon}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:C.white}}>{w.name}</div>
                        <div style={{fontSize:10,color:w.color,letterSpacing:1,textTransform:'uppercase'}}>{w.type}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:4,padding:'4px 8px',background:`${w.color}15`,border:`1px solid ${w.color}40`,borderRadius:4}}>
                      <ExternalLink size={11} color={w.color}/>
                      <span style={{fontSize:10,color:w.color,fontWeight:700}}>VISIT</span>
                    </div>
                  </div>
                  <p style={{margin:'0 0 10px',fontSize:12,lineHeight:1.6,color:C.muted}}>{w.desc}</p>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:w.color,opacity:0.65,wordBreak:'break-all'}}>{w.url.replace('https://','')}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES ── */}
      <section id="games" style={{padding:'70px 16px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH label="06 // ARCADE" title="Play a Game" accent={C.green}/>
          <p style={{color:C.muted,marginTop:8,fontSize:14,marginBottom:28}}>5 mini-games built into the portfolio. Pick one and play!</p>

          {activeGame?(
            <div>
              {/* Game tabs */}
              <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                {GAME_LIST.map(g=>(
                  <button key={g.id} onClick={()=>setActiveGame(g.id)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:6,border:`1px solid ${activeGame===g.id?C.green:C.border}`,background:activeGame===g.id?`${C.green}18`:'transparent',color:activeGame===g.id?C.green:C.muted,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:12}}>
                    <span>{g.icon}</span>{g.name}
                  </button>
                ))}
                <button onClick={()=>setActiveGame(null)} style={{marginLeft:'auto',padding:'7px 14px',borderRadius:6,border:`1px solid ${C.border}`,background:'transparent',color:C.muted,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:12}}>✕ CLOSE</button>
              </div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
                {ActiveGame && <ActiveGame/>}
              </div>
            </div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(195px,1fr))',gap:14}}>
              {GAME_LIST.map(g=>(
                <div key={g.id} onClick={()=>setActiveGame(g.id)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:22,borderTop:`3px solid ${C.green}`,cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 24px ${C.green}20`;e.currentTarget.style.borderTopColor=C.green;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                  <div style={{fontSize:40,marginBottom:10}}>{g.icon}</div>
                  <div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:4}}>{g.name}</div>
                  <div style={{fontSize:10,color:C.green,letterSpacing:1,marginBottom:8}}>{g.type.toUpperCase()}</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:14}}>{g.desc}</div>
                  <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 16px',background:`${C.green}18`,border:`1px solid ${C.green}40`,borderRadius:6,color:C.green,fontWeight:700,fontSize:12}}>
                    <Gamepad2 size={12}/> PLAY
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{padding:'36px 16px',textAlign:'center',borderTop:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.muted,letterSpacing:2}}>TRISON PILLAY — DURBAN, ZA — trison7@gmail.com — 084 232 8084</div>
        <div style={{marginTop:8,fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.border}}>© 2026 — TRISON PILLAY</div>
      </footer>

      <style>{`
        html{scroll-behavior:smooth;}*{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @media(max-width:768px){.desktop-nav{display:none!important;}.hamburger{display:flex!important;}}
        @media(min-width:769px){.hamburger{display:none!important;}}
      `}</style>
    </div>
  );
}
