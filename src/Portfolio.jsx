import { useState, useEffect, useRef } from 'react';
import {
  Terminal, Code2, Shield, Globe, Database, Cpu, CheckCircle2,
  XCircle, AlertTriangle, Play, Send, MessageSquare, Eye,
  Zap, ChevronDown, ChevronRight, BarChart3, Layers, Server,
  Bug, RefreshCw, User, Bot, Menu, X, Phone, Mail,
  Gamepad2, BookOpen, ExternalLink, Copy, Check,
} from 'lucide-react';
import SpaceShooter from './games/SpaceShooter.jsx';
import MemoryMatch  from './games/MemoryMatch.jsx';
import QAQuiz       from './games/QAQuiz.jsx';
import ZombieClicker from './games/ZombieClicker.jsx';
import ObstacleAvoider from './games/ObstacleAvoider.jsx';

// ─── Palette ────────────────────────────────────────────────────
const C = {
  bg:'#050b18', surface:'#0a1628', surface2:'#0f1e38',
  border:'#1a2f50', primary:'#00d4ff', green:'#00ff88',
  amber:'#ffb800', red:'#ff4466', purple:'#b066ff',
  text:'#b8d4f0', muted:'#4a6a8a', white:'#ffffff',
};

// ─── Data ────────────────────────────────────────────────────────
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
  { company:'Prop Data', role:'Test Analyst', period:'2025 – Present',
    type:'QA', color:C.primary, bullets:[
      'Lead QA across web platforms and property listing systems: functional, regression, integration & UAT',
      'API testing for property portals (Property24, Private Property), CRM systems, and data feeds',
      'Reduced post-release defects through structured regression testing cycles',
      'Improved API reliability by catching critical integration bugs pre-production',
      'Full defect lifecycle management in Jira; liaison between technical and non-technical stakeholders',
      'Full Agile ceremonies — stand-ups, sprint planning, retrospectives',
    ]},
  { company:'Prop Data', role:'L2 Support Engineer', period:'2023 – 2025',
    type:'Support', color:C.green, bullets:[
      'Resolved client website errors, API integration failures, and CMS customization issues',
      'Managed DNS, CDN, and caching for high-performance real estate web platforms',
      'Validated listing data feeds to Property24, Private Property, and James Edition',
      'Website security audits covering WAF, SSL, and performance bottlenecks',
      'Created internal knowledge base; trained clients on the Prop Data platform',
      'Emergency incident response for critical website downtime events',
    ]},
  { company:'D & C Signs', role:'Senior Sales & Marketing Consultant', period:'2021 – 2023',
    type:'Marketing', color:C.amber, bullets:[
      'Google Ads, LinkedIn Sales Navigator, and social media campaign management',
      'Google Analytics metrics monitoring to refine digital marketing strategies',
    ]},
];

const PROJECTS = [
  { name:'specpeptides.com', type:'E-Commerce Platform', icon:'🧬',
    problem:'Client needed a high-performance product catalogue with structured inventory.',
    solution:'Built a full CMS-backed site with CDN configuration and performance optimization.',
    result:'Deployed live with sub-2s load times and structured product taxonomy.',
    stack:['CMS','CDN','Cloudflare','SEO'], color:C.primary },
  { name:'mlmpower.co.za', type:'Marketing Website', icon:'📈',
    problem:'Zero digital presence or search engine visibility for the brand.',
    solution:'Built responsive marketing site with Schema Markup and Google Ads integration.',
    result:'Live SEO-optimised site with tracked ad performance dashboards.',
    stack:['HTML/CSS','Google Ads','Schema','Analytics'], color:C.amber },
  { name:'jimnyculture.co.za', type:'Community Platform', icon:'🚙',
    problem:'Niche automotive community scattered across social platforms.',
    solution:'Developed a centralised brand site with social integration and CMS.',
    result:'Active community hub with growing organic traffic and engagement.',
    stack:['CMS','Social API','SEO','Content'], color:C.purple },
];

const QA_TESTS = [
  {id:'TC-001',name:'Login form — required field validation',status:'pass',time:'0.8s',
    detail:'All 4 required fields trigger correct validation messages on empty submit.'},
  {id:'TC-002',name:'API response — JSON schema validation',status:'pass',time:'1.2s',
    detail:'Response body matches expected schema. All 23 fields present and correctly typed.'},
  {id:'TC-003',name:'Empty email field — error message display',status:'fail',time:'0.3s',
    detail:'BUG: No error shown when email field is empty. Expected: "Email is required". [JIRA-441]'},
  {id:'TC-004',name:'Cross-browser layout — Chrome/Firefox/Safari',status:'pass',time:'2.1s',
    detail:'Layout consistent across Chrome 124, Firefox 125, Safari 17. No regressions.'},
  {id:'TC-005',name:'API timeout — user feedback message',status:'warn',time:'5.2s',
    detail:'WARNING: Request times out but shows generic server error, not user-friendly message.'},
  {id:'TC-006',name:'Listing sync — data integrity (47 fields)',status:'pass',time:'0.9s',
    detail:'All 47 property listing fields match source CRM. Data integrity verified.'},
  {id:'TC-007',name:'SQL injection — input sanitisation (12 vectors)',status:'pass',time:'0.4s',
    detail:'All 12 injection vectors correctly sanitised and rejected with 400 response.'},
  {id:'TC-008',name:'Mobile viewport < 375px — nav overlap',status:'fail',time:'0.6s',
    detail:'BUG: Nav menu overlaps hero content at < 375px viewport (iPhone SE). [JIRA-442]'},
  {id:'TC-009',name:'Password field — special character support',status:'pass',time:'0.5s',
    detail:'All special characters accepted. Encoding handled correctly on server side.'},
  {id:'TC-010',name:'Session timeout — auto logout at 30 min',status:'pass',time:'30.0s',
    detail:'Session expires at exactly 30 minutes. User redirected to login with toast message.'},
  {id:'TC-011',name:'File upload — 10MB limit enforcement',status:'pass',time:'1.4s',
    detail:'Files above 10MB correctly rejected with error. Files at exactly 10MB accepted.'},
  {id:'TC-012',name:'Search — XSS payload in search field',status:'pass',time:'0.7s',
    detail:'All 8 XSS payloads stripped and escaped. No script execution occurred.'},
  {id:'TC-013',name:'API rate limiting — 100 req/min',status:'warn',time:'2.3s',
    detail:'WARNING: Rate limiter triggers at 95 req/min, not 100 as documented. Off-spec.'},
  {id:'TC-014',name:'PDF export — listing data accuracy',status:'pass',time:'3.1s',
    detail:'Exported PDF matches all 12 data fields. Formatting consistent across OS.'},
  {id:'TC-015',name:'Two-factor auth — SMS delivery',status:'pass',time:'4.8s',
    detail:'OTP delivered within 5s. Code expires correctly at 10 minutes.'},
  {id:'TC-016',name:'Cache invalidation — after listing update',status:'fail',time:'1.1s',
    detail:'BUG: Stale cached data served for 45s after update. CDN purge not triggered. [JIRA-443]'},
];

const GAME_LIST = [
  { id:'shooter',  name:'Space Shooter',    icon:'🚀', type:'Action',     desc:'Sidescrolling starfighter. Dodge and blast enemy ships.',       component: SpaceShooter },
  { id:'memory',   name:'QA Memory Match',  icon:'🧠', type:'Puzzle',     desc:'Flip cards to match QA-themed pairs. Beat the clock.',          component: MemoryMatch },
  { id:'quiz',     name:'IT & QA Quiz',     icon:'💡', type:'Educational',desc:'12 questions on QA, APIs, DNS, SQL and more. What\'s your rank?',component: QAQuiz },
  { id:'zombie',   name:'Zombie Clicker',   icon:'🧟', type:'Idle/Clicker',desc:'Build your zombie empire. Click, earn, upgrade the horde.',     component: ZombieClicker },
  { id:'obstacle', name:'Obstacle Run',     icon:'🤖', type:'Platformer',  desc:'Jump over obstacles. Double-jump unlocked. How far can you go?', component: ObstacleAvoider },
];

const CLAUDE_GUIDE = [
  { step:'1', title:'Ask for a Game Artifact', icon:'💬',
    code:'Create a playable Snake game in a React artifact with keyboard controls, score tracking, and increasing speed.',
    tip:'Be specific about controls, win/loss conditions, and visual style.' },
  { step:'2', title:'Start with an MVP', icon:'🎯',
    code:'Build the minimum: player movement + one obstacle. No score yet.',
    tip:'Simple first, then layer complexity. A working boring game beats a broken cool one.' },
  { step:'3', title:'Add Features Iteratively', icon:'⚡',
    code:'Add a score system that increases by 10 per enemy killed. Show it in the top-right corner.',
    tip:'One feature at a time. Reference what already exists: "keep the existing controls, just add..."' },
  { step:'4', title:'Customize Visuals', icon:'🎨',
    code:'Replace the white square player with a neon-cyan pixel spaceship. Add engine glow particle effects.',
    tip:'Describe mood and style: "retro arcade", "cyberpunk", "cute pixel art".' },
  { step:'5', title:'Add Difficulty Scaling', icon:'📈',
    code:'Increase enemy spawn rate every 30 seconds. Add a speed multiplier shown in the HUD.',
    tip:'Good games get harder. Ask Claude to tie difficulty to score or time elapsed.' },
  { step:'6', title:'Deploy & Share', icon:'🚀',
    code:'Copy the artifact code → paste into App.jsx in a Vite project → npm run build → deploy to Vercel.',
    tip:'Claude\'s artifacts are standard React — they drop straight into any Vite project.' },
];

// ─── Helpers ─────────────────────────────────────────────────────
function SH({ label, title, accent }) {
  return (
    <div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
        color:accent, letterSpacing:3, marginBottom:8 }}>{label}</div>
      <h2 style={{ margin:0, fontSize:'clamp(1.5rem,3vw,2.1rem)', fontWeight:700,
        fontFamily:"'Rajdhani',sans-serif", color:'#fff', letterSpacing:1 }}>{title}</h2>
      <div style={{ width:48, height:2, background:accent, borderRadius:1, marginTop:10,
        boxShadow:`0 0 8px ${accent}60` }} />
    </div>
  );
}

function Card({ children, accent=C.border, style={} }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:12, borderTop:`3px solid ${accent}`, ...style }}>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function Portfolio() {
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [recruiterCard, setRecruiterCard] = useState(false);
  const [expandedExp, setExpandedExp] = useState(0);
  const [activeSkillCat, setActiveSkillCat] = useState(0);
  const [animBars, setAnimBars] = useState(false);
  const [qaStarted, setQaStarted] = useState(false);
  const [qaVisible, setQaVisible] = useState([]);
  const [qaProgress, setQaProgress] = useState(0);
  const [qaFilter, setQaFilter] = useState('all');
  const [activeGame, setActiveGame] = useState(null);
  const [guideStep, setGuideStep] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role:'assistant', content:"👋 Hi! I'm Trison's AI assistant. Ask me anything about his skills, experience, or availability." }
  ]);
  const [apiHistory, setApiHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [termLines, setTermLines] = useState([]);
  const [termDone, setTermDone] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileNav, setMobileNav] = useState(false);
  const [copied, setCopied] = useState(null);

  const canvasRef = useRef(null);
  const skillsRef = useRef(null);
  const chatEndRef = useRef(null);

  // ── Google Fonts
  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }, []);

  // ── 3D Particle Field + Matrix Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // 3D nodes
    const nodes = Array.from({length:120}, () => ({
      x: (Math.random()-0.5)*2000, y: (Math.random()-0.5)*2000, z: Math.random()*1200,
      vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, vz:-0.4-Math.random()*0.4,
      r: Math.random()*2+0.5, color: Math.random()>0.7 ? '#00ff88' : '#00d4ff',
    }));

    const project = (x,y,z) => {
      const fov=600, cx=canvas.width/2, cy=canvas.height/2;
      const scale = fov/(fov+z);
      return { sx:cx+x*scale, sy:cy+y*scale, scale };
    };

    let frame=0;
    const draw = () => {
      frame++;
      ctx.fillStyle = 'rgba(5,11,24,0.15)';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // Draw connections
      for (let i=0;i<nodes.length;i++) {
        for (let j=i+1;j<nodes.length;j++) {
          const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, dz=nodes[i].z-nodes[j].z;
          const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
          if (dist<260) {
            const pi=project(nodes[i].x,nodes[i].y,nodes[i].z);
            const pj=project(nodes[j].x,nodes[j].y,nodes[j].z);
            const alpha=(1-dist/260)*0.12;
            ctx.strokeStyle=`rgba(0,212,255,${alpha})`;
            ctx.lineWidth=0.5;
            ctx.beginPath(); ctx.moveTo(pi.sx,pi.sy); ctx.lineTo(pj.sx,pj.sy); ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        n.x+=n.vx; n.y+=n.vy; n.z+=n.vz;
        if (n.z<-200) { n.z=1200; n.x=(Math.random()-0.5)*2000; n.y=(Math.random()-0.5)*2000; }
        const p=project(n.x,n.y,n.z);
        if (p.sx<-50||p.sx>canvas.width+50||p.sy<-50||p.sy>canvas.height+50) return;
        const alpha=Math.min(1,(n.z+200)/400)*0.8;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, n.r*p.scale, 0, Math.PI*2);
        ctx.fillStyle = n.color === '#00ff88'
          ? `rgba(0,255,136,${alpha})` : `rgba(0,212,255,${alpha})`;
        ctx.shadowBlur = 6*p.scale; ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur=0;
      });

      // Horizontal scanline sweep
      if (frame%3===0) {
        const y = (frame*0.8) % canvas.height;
        const g = ctx.createLinearGradient(0,y-30,0,y+2);
        g.addColorStop(0,'rgba(0,212,255,0)');
        g.addColorStop(1,'rgba(0,212,255,0.04)');
        ctx.fillStyle=g;
        ctx.fillRect(0,y-30,canvas.width,32);
      }
    };

    const id=setInterval(draw,30);
    return ()=>{ clearInterval(id); window.removeEventListener('resize',resize); };
  },[]);

  // ── Terminal
  useEffect(()=>{
    const lines=[
      {text:'$ trison --init portfolio.exe', color:C.muted},
      {text:'> ISTQB CTFL ✓ | BSc IT ✓ | 3+ yrs ✓', color:C.green},
      {text:'> Skills: QA · Web Systems · APIs · DevOps', color:C.primary},
      {text:'> Portfolio: trison-portfolio.vercel.app ✓', color:C.primary},
      {text:'> Target: Associate Web Systems Analyst', color:C.amber},
      {text:'> Status: [ READY ] — Available now', color:C.green},
    ];
    let i=0;
    const next=()=>{ if(i<lines.length){setTermLines(p=>[...p,lines[i++]]); setTimeout(next,700);} else setTermDone(true); };
    setTimeout(next,500);
  },[]);

  // ── Skill bar intersection
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting) setAnimBars(true);},{threshold:0.2});
    if(skillsRef.current) obs.observe(skillsRef.current);
    return ()=>obs.disconnect();
  },[]);

  // ── Section tracking
  useEffect(()=>{
    const ids=['hero','about','skills','experience','qa','projects','games','chat'];
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting) setActiveSection(e.target.id);});
    },{threshold:0.35});
    ids.forEach(id=>{ const el=document.getElementById(id); if(el) obs.observe(el); });
    return ()=>obs.disconnect();
  },[]);

  // ── QA Playground
  const runTests=()=>{
    setQaStarted(true); setQaVisible([]); setQaProgress(0);
    const tests=qaFilter==='all'?QA_TESTS:QA_TESTS.filter(t=>t.status===qaFilter);
    tests.forEach((_,i)=>{
      setTimeout(()=>{
        setQaVisible(p=>[...p,i]);
        setQaProgress(Math.round(((i+1)/tests.length)*100));
      },200+i*300);
    });
  };
  const filteredTests=qaFilter==='all'?QA_TESTS:QA_TESTS.filter(t=>t.status===qaFilter);
  const qaStats={
    pass:qaVisible.filter(i=>filteredTests[i]?.status==='pass').length,
    fail:qaVisible.filter(i=>filteredTests[i]?.status==='fail').length,
    warn:qaVisible.filter(i=>filteredTests[i]?.status==='warn').length,
  };

  // ── Chat
  const sendChat=async()=>{
    if(!chatInput.trim()||chatLoading) return;
    const msg=chatInput.trim(); setChatInput('');
    const newHist=[...apiHistory,{role:'user',content:msg}];
    setApiHistory(newHist);
    setChatMessages(p=>[...p,{role:'user',content:msg}]);
    setChatLoading(true);
    try {
      const key = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_ANTHROPIC_API_KEY : undefined;
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', ...(key ? {'x-api-key':key} : {}) },
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          system:`You are the AI assistant for Trison Pillay's portfolio. Answer concisely and confidently. Key facts:
- Current: Test Analyst at Prop Data (2025–present). Previous: L2 Support Engineer at Prop Data (2023–2025).
- Education: BSc IT Systems Development, Richfield University. ISTQB CTFL certified.
- Location: Durban, South Africa. Open to remote work internationally.
- QA skills: Regression, API testing (Postman), functional, UAT, integration, Jira, Agile, cross-browser testing, performance testing.
- Web systems: DNS, CDN, Cloudflare, CMS, staging environments, CI/CD, GitHub, AWS, cPanel.
- Dev stack: JavaScript, HTML/CSS, Python, Java, C#, SQL, MySQL, PHP.
- API experience: Third-party integrations for property portals, CRM systems, data feeds.
- Contact: trison7@gmail.com | 0842328084 | trison-portfolio.vercel.app
- Personal interests: Algorithmic trading on MetaTrader 5, MQL5 Expert Advisors for XAUUSD.
Be direct, max 3–4 sentences unless more detail is genuinely needed.`,
          messages:newHist,
        })
      });
      const data=await res.json();
      const reply=data.content?.[0]?.text||"I couldn't get a response right now. Please try again.";
      setApiHistory(p=>[...p,{role:'assistant',content:reply}]);
      setChatMessages(p=>[...p,{role:'assistant',content:reply}]);
    } catch {
      setChatMessages(p=>[...p,{role:'assistant',content:'Connection error. Please try again.'}]);
    }
    setChatLoading(false);
  };
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); },[chatMessages]);

  const copyCode=(text,id)=>{
    navigator.clipboard.writeText(text).then(()=>{ setCopied(id); setTimeout(()=>setCopied(null),2000); });
  };

  const navLinks=['hero','about','skills','experience','qa','projects','games','chat'];
  const navLabels={hero:'Home',about:'Profile',skills:'Skills',experience:'XP',qa:'QA Lab',projects:'Projects',games:'Games',chat:'AI Chat'};

  const GameComp = activeGame ? GAME_LIST.find(g=>g.id===activeGame)?.component : null;

  return (
    <div style={{ fontFamily:"'Rajdhani','Share Tech Mono',sans-serif", background:C.bg, color:C.text, minHeight:'100vh', overflowX:'hidden' }}>

      {/* ── CANVAS BACKGROUND */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, opacity:0.85, pointerEvents:'none' }} />
      {/* Scanline overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 4px)' }} />
      {/* Vignette */}
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,rgba(5,11,24,0.5) 100%)' }} />

      {/* ── NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200,
        background:'rgba(5,11,24,0.92)', backdropFilter:'blur(16px)',
        borderBottom:`1px solid ${C.border}`, height:56,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Terminal size={17} color={C.primary} />
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, fontWeight:700, color:C.primary }}>
            TRISON.SYS
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display:'flex', gap:2, alignItems:'center' }}>
          {navLinks.map(id=>(
            <a key={id} href={`#${id}`} style={{
              padding:'4px 9px', borderRadius:4, fontSize:11, textDecoration:'none',
              fontWeight:700, letterSpacing:1, textTransform:'uppercase',
              color:activeSection===id ? C.primary : C.muted,
              background:activeSection===id ? `${C.primary}15` : 'transparent',
              border:activeSection===id ? `1px solid ${C.primary}40` : '1px solid transparent',
            }}>{navLabels[id]}</a>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={()=>{setRecruiterMode(r=>!r); setRecruiterCard(r=>!r);}} style={{
            display:'flex', alignItems:'center', gap:5, padding:'5px 10px',
            borderRadius:4, border:`1px solid ${recruiterMode?C.green:C.border}`,
            background:recruiterMode?`${C.green}15`:'transparent',
            color:recruiterMode?C.green:C.muted, cursor:'pointer',
            fontFamily:'inherit', fontWeight:700, fontSize:11, letterSpacing:1,
          }}>
            <Eye size={12}/> {recruiterMode?'RECRUITER ✓':'RECRUITER'}
          </button>
          {/* Mobile hamburger */}
          <button className="hide-desktop" onClick={()=>setMobileNav(m=>!m)}
            style={{ display:'none', background:'transparent', border:'none', color:C.muted, cursor:'pointer', padding:4 }}>
            {mobileNav?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown nav */}
      {mobileNav && (
        <div style={{ position:'fixed', top:56, left:0, right:0, zIndex:199,
          background:'rgba(5,11,24,0.97)', borderBottom:`1px solid ${C.border}`,
          padding:'12px 20px', display:'flex', flexDirection:'column', gap:4 }}>
          {navLinks.map(id=>(
            <a key={id} href={`#${id}`} onClick={()=>setMobileNav(false)}
              style={{ padding:'10px 12px', borderRadius:6, fontSize:14, textDecoration:'none',
                fontWeight:700, color:activeSection===id?C.primary:C.text,
                background:activeSection===id?`${C.primary}10`:'transparent',
                borderLeft:activeSection===id?`2px solid ${C.primary}`:'2px solid transparent',
              }}>{navLabels[id]}</a>
          ))}
        </div>
      )}

      {/* ── RECRUITER BANNER */}
      {recruiterMode && (
        <div style={{ position:'fixed', top:56, left:0, right:0, zIndex:198,
          background:`linear-gradient(90deg,${C.green}22,${C.green}08)`,
          borderBottom:`1px solid ${C.green}40`, padding:'10px 24px',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {[['Role','Test Analyst → Web Systems'],['Cert','ISTQB CTFL'],['Location','Durban, SA (Remote OK)'],['Available','Immediately']].map(([k,v])=>(
              <div key={k}><div style={{ fontSize:10, color:C.muted, letterSpacing:1 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize:13, color:C.white, fontWeight:600 }}>{v}</div></div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <a href="mailto:trison7@gmail.com" style={{
              display:'flex', alignItems:'center', gap:5, padding:'6px 14px',
              background:C.green, color:'#050b18', borderRadius:4,
              textDecoration:'none', fontSize:12, fontWeight:700 }}>
              <Mail size={12}/> EMAIL
            </a>
            <a href="tel:0842328084" style={{
              display:'flex', alignItems:'center', gap:5, padding:'6px 14px',
              border:`1px solid ${C.green}`, color:C.green, borderRadius:4,
              textDecoration:'none', fontSize:12, fontWeight:700 }}>
              <Phone size={12}/> CALL
            </a>
          </div>
        </div>
      )}

      {/* Floating Recruiter Card */}
      {recruiterCard && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:300,
          background:C.surface2, border:`1px solid ${C.green}60`,
          borderRadius:16, padding:20, width:260,
          boxShadow:`0 0 40px ${C.green}30, 0 20px 60px rgba(0,0,0,0.5)` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.green, letterSpacing:2 }}>
              RECRUITER CARD
            </span>
            <button onClick={()=>setRecruiterCard(false)}
              style={{ background:'transparent', border:'none', color:C.muted, cursor:'pointer' }}>
              <X size={14}/>
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0,
              background:`linear-gradient(135deg,${C.primary},${C.green})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, fontWeight:700, color:'#050b18', fontFamily:"'Rajdhani',sans-serif" }}>TP</div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.white }}>Trison Pillay</div>
              <div style={{ fontSize:11, color:C.primary }}>Test Analyst</div>
            </div>
          </div>
          {[
            [<Mail size={12}/>, 'trison7@gmail.com', 'mailto:trison7@gmail.com'],
            [<Phone size={12}/>, '084 232 8084', 'tel:0842328084'],
            [<Globe size={12}/>, 'trison-portfolio.vercel.app', 'https://trison-portfolio.vercel.app'],
          ].map(([icon, label, href],i)=>(
            <a key={i} href={href} target={href.startsWith('http')?'_blank':undefined}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0',
                textDecoration:'none', color:C.text, fontSize:12,
                borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
              <span style={{ color:C.green }}>{icon}</span>{label}
            </a>
          ))}
          <a href="https://trison-portfolio.vercel.app" target="_blank"
            style={{ display:'block', marginTop:14, padding:'8px 0', textAlign:'center',
              background:C.green, color:'#050b18', borderRadius:6, textDecoration:'none',
              fontWeight:700, fontSize:13, letterSpacing:1 }}>
            VIEW FULL PORTFOLIO
          </a>
        </div>
      )}

      <div style={{ position:'relative', zIndex:10 }}>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section id="hero" style={{ minHeight:'100vh', display:'flex', alignItems:'center',
          justifyContent:'center', textAlign:'center', padding:'80px 20px 40px' }}>
          <div style={{ maxWidth:780 }}>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.primary,
              letterSpacing:4, marginBottom:12, opacity:0.8 }}>// initialising_portfolio.exe</div>

            {/* 3D glowing name */}
            <div style={{ position:'relative', marginBottom:12 }}>
              <h1 style={{ fontSize:'clamp(2.8rem,9vw,5.5rem)', fontWeight:700, margin:0,
                fontFamily:"'Rajdhani',sans-serif", letterSpacing:2,
                background:`linear-gradient(135deg,${C.white} 30%,${C.primary})`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                filter:`drop-shadow(0 0 30px ${C.primary}60)`,
              }}>TRISON PILLAY</h1>
              {/* Reflection */}
              <h1 aria-hidden style={{ fontSize:'clamp(2.8rem,9vw,5.5rem)', fontWeight:700, margin:0,
                fontFamily:"'Rajdhani',sans-serif", letterSpacing:2,
                background:`linear-gradient(180deg,${C.primary}30,transparent)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                transform:'scaleY(-0.25) translateY(-8px)', opacity:0.3,
                pointerEvents:'none', userSelect:'none',
              }}>TRISON PILLAY</h1>
            </div>

            <div style={{ fontSize:'clamp(0.9rem,2.5vw,1.2rem)', color:C.primary, fontWeight:600,
              letterSpacing:3, marginBottom:32, textTransform:'uppercase' }}>
              Test Analyst &nbsp;|&nbsp; Web Systems &nbsp;|&nbsp; QA Engineer
            </div>

            {/* Terminal */}
            <div style={{ background:'rgba(10,22,40,0.88)', border:`1px solid ${C.border}`,
              borderRadius:10, padding:'18px 22px', textAlign:'left', marginBottom:36,
              backdropFilter:'blur(12px)', boxShadow:`0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
              <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c=>(
                  <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
                ))}
                <span style={{ marginLeft:8, fontFamily:"'Share Tech Mono',monospace",
                  fontSize:10, color:C.muted }}>terminal — trison@portfolio:~</span>
              </div>
              {termLines.map((line,i)=>(
                <div key={i} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
                  color:line.color, marginBottom:3, lineHeight:1.6,
                  animation:'fadeInUp 0.3s ease both', animationDelay:`${i*0.05}s` }}>
                  {line.text}
                </div>
              ))}
              {termDone && <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
                color:C.primary, animation:'blink 1s step-end infinite' }}>█</div>}
            </div>

            {/* CTAs */}
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {[
                {href:'#qa', label:'RUN TESTS', icon:<Play size={13}/>, bg:C.primary, fg:'#050b18'},
                {href:'#games', label:'PLAY GAMES', icon:<Gamepad2 size={13}/>, bg:C.green, fg:'#050b18'},
                {href:'#experience', label:'VIEW XP', icon:<Layers size={13}/>, bg:'transparent', fg:C.primary, border:C.primary},
                {href:'#chat', label:'ASK AI', icon:<MessageSquare size={13}/>, bg:'transparent', fg:C.text, border:C.border},
              ].map(({href,label,icon,bg,fg,border},i)=>(
                <a key={i} href={href} style={{
                  display:'flex', alignItems:'center', gap:7, padding:'11px 22px',
                  background:bg, color:fg, borderRadius:6, textDecoration:'none',
                  fontWeight:700, fontSize:13, letterSpacing:1,
                  border:`1px solid ${border||'transparent'}`,
                  boxShadow:bg!=='transparent'?`0 0 20px ${bg}40`:'none',
                }}>{icon}{label}</a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════════════ */}
        <section id="about" style={{ padding:'80px 20px', maxWidth:1100, margin:'0 auto' }}>
          <SH label="01 // PROFILE" title="The Hybrid Profile" accent={C.primary} />
          <div className="grid-2" style={{ marginTop:36 }}>
            <Card accent={C.primary} style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
                <div style={{ width:60, height:60, borderRadius:'50%', flexShrink:0,
                  background:`linear-gradient(135deg,${C.primary},${C.green})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24, fontWeight:700, color:'#050b18', fontFamily:"'Rajdhani',sans-serif",
                  boxShadow:`0 0 20px ${C.primary}40` }}>TP</div>
                <div>
                  <div style={{ fontSize:20, fontWeight:700, color:C.white }}>Trison Pillay</div>
                  <div style={{ fontSize:13, color:C.primary }}>Test Analyst @ Prop Data</div>
                </div>
              </div>
              {[[<Cpu size={13}/>, 'ISTQB CTFL Certified', C.green],
                [<Globe size={13}/>, 'Durban, SA — Remote OK', C.primary],
                [<Database size={13}/>, 'BSc IT — Systems Development', C.amber],
                [<Terminal size={13}/>, '3+ Years Industry Experience', C.purple],
                [<Code2 size={13}/>, 'Python · Java · C# · JS · SQL', C.primary],
                [<Shield size={13}/>, 'WAF · SSL · Security Audits', C.green],
                [<Zap size={13}/>, 'MQL5 · Algo Trading · MetaTrader 5', C.amber],
              ].map(([icon,text,color],i,arr)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
                  borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
                  <span style={{ color }}>{icon}</span>
                  <span style={{ fontSize:14 }}>{text}</span>
                </div>
              ))}
            </Card>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                ['// core_identity', C.green, "I don't just test systems — I build them, break them, and make them better. A rare hybrid bridging QA, web systems management, and integration debugging."],
                ['// why_hire_me', C.amber, "My L2 Support background means I understand systems from infrastructure up — DNS, CDN, APIs, CMS. My QA role validates from the user down. That full-stack perspective is rare."],
                ['// target_role', C.purple, "Targeting Associate Web Systems Analyst roles where quality, integration debugging, and platform reliability all matter simultaneously."],
              ].map(([label,color,text])=>(
                <Card key={label} accent={color} style={{ padding:22 }}>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color, letterSpacing:2, marginBottom:10 }}>{label}</div>
                  <p style={{ margin:0, lineHeight:1.8, fontSize:14, color:C.text }}>{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SKILLS
        ══════════════════════════════════════════════════ */}
        <section id="skills" style={{ padding:'80px 20px', background:C.surface }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <SH label="02 // SKILLS_MATRIX" title="Technical Proficiency" accent={C.green} />
            <div style={{ display:'flex', gap:8, marginTop:36, marginBottom:28, flexWrap:'wrap' }}>
              {SKILLS.map((s,i)=>(
                <button key={i} onClick={()=>{setActiveSkillCat(i); setAnimBars(false); setTimeout(()=>setAnimBars(true),50);}}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:6,
                    border:`1px solid ${activeSkillCat===i?s.color:C.border}`,
                    background:activeSkillCat===i?`${s.color}15`:'transparent',
                    color:activeSkillCat===i?s.color:C.muted,
                    cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:13 }}>
                  <span style={{ color:s.color }}>{s.icon}</span>{s.cat}
                </button>
              ))}
            </div>
            <div ref={skillsRef} className="grid-2">
              {SKILLS[activeSkillCat].items.map((sk,i)=>(
                <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:'14px 18px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                    <span style={{ fontSize:14, fontWeight:600 }}>{sk.name}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:SKILLS[activeSkillCat].color }}>{sk.level}%</span>
                  </div>
                  <div style={{ height:3, background:C.border, borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:2,
                      background:`linear-gradient(90deg,${SKILLS[activeSkillCat].color},${SKILLS[activeSkillCat].color}88)`,
                      width:animBars?`${sk.level}%`:'0%',
                      transition:`width 0.8s cubic-bezier(0.4,0,0.2,1) ${i*0.07}s`,
                      boxShadow:`0 0 6px ${SKILLS[activeSkillCat].color}60` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            EXPERIENCE
        ══════════════════════════════════════════════════ */}
        <section id="experience" style={{ padding:'80px 20px', maxWidth:1100, margin:'0 auto' }}>
          <SH label="03 // WORK_HISTORY" title="Professional Experience" accent={C.amber} />
          <div style={{ marginTop:36, display:'flex', flexDirection:'column', gap:10 }}>
            {EXPERIENCE.map((exp,i)=>(
              <div key={i} style={{ background:C.surface, borderRadius:10, overflow:'hidden',
                border:`1px solid ${expandedExp===i?exp.color+'60':C.border}`,
                borderLeft:`3px solid ${exp.color}`, transition:'border-color 0.2s' }}>
                <button onClick={()=>setExpandedExp(expandedExp===i?-1:i)}
                  style={{ width:'100%', padding:'16px 22px', background:'transparent', border:'none',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between',
                    color:C.text, fontFamily:'inherit', flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:38, height:38, borderRadius:7, flexShrink:0,
                      background:`${exp.color}18`, border:`1px solid ${exp.color}40`,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:9, fontWeight:700, color:exp.color }}>{exp.type.slice(0,3)}</span>
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ fontSize:16, fontWeight:700, color:C.white }}>{exp.role}</div>
                      <div style={{ fontSize:12, color:exp.color }}>{exp.company}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.muted }}>{exp.period}</span>
                    <ChevronRight size={15} color={C.muted}
                      style={{ transform:expandedExp===i?'rotate(90deg)':'none', transition:'transform 0.2s' }} />
                  </div>
                </button>
                {expandedExp===i && (
                  <div style={{ padding:'0 22px 18px', borderTop:`1px solid ${C.border}` }}>
                    <div style={{ paddingTop:14, display:'flex', flexDirection:'column', gap:7 }}>
                      {exp.bullets.map((b,j)=>(
                        <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                          <ChevronRight size={12} color={exp.color} style={{ marginTop:4, flexShrink:0 }} />
                          <span style={{ fontSize:14, lineHeight:1.6 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            QA PLAYGROUND
        ══════════════════════════════════════════════════ */}
        <section id="qa" style={{ padding:'80px 20px', background:C.surface }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <SH label="04 // QA_PLAYGROUND" title="Test My Thinking" accent={C.primary} />
            <p style={{ color:C.muted, marginTop:8, fontSize:14, marginBottom:32 }}>
              Simulated regression test suite. Filter by status, then run.
            </p>
            <div className="grid-2" style={{ gap:20 }}>
              {/* Control panel */}
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:24 }}>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.primary, letterSpacing:2, marginBottom:18 }}>// CONTROL_PANEL</div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>FILTER BY STATUS</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['all','pass','fail','warn'].map(f=>(
                      <button key={f} onClick={()=>{setQaFilter(f); setQaStarted(false); setQaVisible([]); setQaProgress(0);}}
                        style={{ padding:'4px 12px', borderRadius:4, border:`1px solid ${qaFilter===f?C.primary:C.border}`,
                          background:qaFilter===f?`${C.primary}15`:'transparent',
                          color:qaFilter===f?C.primary:C.muted, cursor:'pointer',
                          fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:1 }}>
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16, padding:'10px 14px', background:C.surface2,
                  border:`1px solid ${C.border}`, borderRadius:6, fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:C.text }}>
                  prop-data.staging.co.za:3000
                </div>
                <div style={{ marginBottom:16, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.muted }}>
                  {filteredTests.length} test{filteredTests.length!==1?'s':''} queued · Suite v2.3
                </div>
                {qaStarted && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.muted }}>RUNNING</span>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.primary }}>{qaProgress}%</span>
                    </div>
                    <div style={{ height:5, background:C.border, borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', background:C.primary, width:`${qaProgress}%`,
                        transition:'width 0.3s', boxShadow:`0 0 8px ${C.primary}60` }} />
                    </div>
                  </div>
                )}
                {qaVisible.length>0 && (
                  <div style={{ display:'flex', gap:10, marginBottom:16 }}>
                    {[[qaStats.pass,'PASS',C.green],[qaStats.fail,'FAIL',C.red],[qaStats.warn,'WARN',C.amber]].map(([n,l,c])=>(
                      <div key={l} style={{ flex:1, padding:'8px 0', textAlign:'center',
                        background:`${c}10`, border:`1px solid ${c}30`, borderRadius:6 }}>
                        <div style={{ fontSize:20, fontWeight:700, color:c, fontFamily:"'Rajdhani',sans-serif" }}>{n}</div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:c }}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={runTests} style={{
                  width:'100%', padding:'11px', borderRadius:6, border:'none', cursor:'pointer',
                  background:qaProgress===100?`${C.green}18`:C.primary,
                  color:qaProgress===100?C.green:'#050b18',
                  border:qaProgress===100?`1px solid ${C.green}`:'none',
                  fontFamily:'inherit', fontWeight:700, fontSize:14, letterSpacing:1,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}>
                  {qaProgress===100?<><RefreshCw size={13}/> RUN AGAIN</>:<><Play size={13}/> RUN TEST SUITE</>}
                </button>
              </div>

              {/* Results */}
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12,
                padding:24, maxHeight:500, overflowY:'auto' }}>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.primary, letterSpacing:2, marginBottom:16 }}>// TEST_RESULTS_LOG</div>
                {!qaStarted && (
                  <div style={{ textAlign:'center', padding:'40px 0', color:C.muted,
                    fontFamily:"'Share Tech Mono',monospace", fontSize:12 }}>
                    &gt; Awaiting execution..._
                  </div>
                )}
                {filteredTests.map((test,i)=>qaVisible.includes(i)&&(
                  <div key={test.id} style={{ padding:'11px 13px', marginBottom:7, borderRadius:6,
                    background:test.status==='fail'?`${C.red}10`:test.status==='warn'?`${C.amber}10`:`${C.green}08`,
                    border:`1px solid ${test.status==='fail'?C.red+'40':test.status==='warn'?C.amber+'40':C.green+'30'}`,
                    animation:'fadeInUp 0.3s ease' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                      {test.status==='pass'?<CheckCircle2 size={12} color={C.green}/>:
                       test.status==='fail'?<XCircle size={12} color={C.red}/>:
                       <AlertTriangle size={12} color={C.amber}/>}
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                        color:test.status==='fail'?C.red:test.status==='warn'?C.amber:C.green }}>
                        [{test.status.toUpperCase()}]
                      </span>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.muted }}>{test.id}</span>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.muted, marginLeft:'auto' }}>{test.time}</span>
                    </div>
                    <div style={{ fontSize:13, color:C.text, fontWeight:600, marginBottom:2 }}>{test.name}</div>
                    <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{test.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════════ */}
        <section id="projects" style={{ padding:'80px 20px', maxWidth:1100, margin:'0 auto' }}>
          <SH label="05 // PROJECTS" title="Systems I've Built" accent={C.purple} />
          <div className="grid-3" style={{ marginTop:36 }}>
            {PROJECTS.map((p,i)=>(
              <Card key={i} accent={p.color} style={{ padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:26 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.white }}>{p.name}</div>
                    <div style={{ fontSize:11, color:p.color, letterSpacing:1 }}>{p.type.toUpperCase()}</div>
                  </div>
                </div>
                {[['PROBLEM',p.problem,C.red],['SOLUTION',p.solution,p.color],['RESULT',p.result,C.green]].map(([lbl,txt,col])=>(
                  <div key={lbl} style={{ marginBottom:9 }}>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:col, letterSpacing:2, marginBottom:2 }}>{lbl}</div>
                    <div style={{ fontSize:13, lineHeight:1.6 }}>{txt}</div>
                  </div>
                ))}
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:12 }}>
                  {p.stack.map(tag=>(
                    <span key={tag} style={{ padding:'2px 8px', borderRadius:3, fontSize:10,
                      background:`${p.color}12`, color:p.color, border:`1px solid ${p.color}25`,
                      fontFamily:"'Share Tech Mono',monospace" }}>{tag}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            GAMES
        ══════════════════════════════════════════════════ */}
        <section id="games" style={{ padding:'80px 20px', background:C.surface }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <SH label="06 // ARCADE" title="Mini Game Lab" accent={C.amber} />
            <p style={{ color:C.muted, marginTop:8, fontSize:14, marginBottom:32 }}>
              Playable games built with React. All keyboard and touch-friendly.
            </p>

            {/* Game picker */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
              {GAME_LIST.map(g=>(
                <button key={g.id} onClick={()=>setActiveGame(activeGame===g.id?null:g.id)} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'10px 16px',
                  borderRadius:8, border:`1px solid ${activeGame===g.id?C.amber:C.border}`,
                  background:activeGame===g.id?`${C.amber}15`:'transparent',
                  color:activeGame===g.id?C.amber:C.text, cursor:'pointer',
                  fontFamily:'inherit', fontWeight:600, fontSize:13, transition:'all 0.15s',
                }}>
                  <span style={{ fontSize:18 }}>{g.icon}</span>
                  <div style={{ textAlign:'left' }}>
                    <div>{g.name}</div>
                    <div style={{ fontSize:10, color:C.muted, fontFamily:"'Share Tech Mono',monospace" }}>{g.type}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active game */}
            {activeGame && GameComp && (
              <div style={{ background:C.bg, border:`1px solid ${C.amber}40`,
                borderRadius:12, padding:24, marginBottom:40,
                boxShadow:`0 0 40px ${C.amber}10` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div>
                    <span style={{ fontSize:20 }}>{GAME_LIST.find(g=>g.id===activeGame)?.icon}</span>
                    <span style={{ marginLeft:8, fontSize:16, fontWeight:700, color:C.white }}>
                      {GAME_LIST.find(g=>g.id===activeGame)?.name}
                    </span>
                    <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>
                      {GAME_LIST.find(g=>g.id===activeGame)?.desc}
                    </div>
                  </div>
                  <button onClick={()=>setActiveGame(null)}
                    style={{ background:'transparent', border:'none', color:C.muted, cursor:'pointer' }}>
                    <X size={18}/>
                  </button>
                </div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <GameComp />
                </div>
              </div>
            )}

            {/* How to make games with Claude */}
            <div style={{ marginTop:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
                <BookOpen size={18} color={C.amber} />
                <span style={{ fontSize:18, fontWeight:700, color:C.white, fontFamily:"'Rajdhani',sans-serif" }}>
                  How to Make Games with Claude
                </span>
              </div>
              <div className="grid-2" style={{ gap:14 }}>
                {CLAUDE_GUIDE.map((g,i)=>(
                  <div key={i} style={{ background:C.bg, border:`1px solid ${guideStep===i?C.amber:C.border}`,
                    borderRadius:10, padding:18, cursor:'pointer',
                    borderLeft:`3px solid ${C.amber}`,
                    transition:'border-color 0.15s' }}
                    onClick={()=>setGuideStep(guideStep===i?null:i)}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:guideStep===i?12:0 }}>
                      <div style={{ width:28, height:28, borderRadius:6, background:`${C.amber}20`,
                        border:`1px solid ${C.amber}40`, display:'flex', alignItems:'center',
                        justifyContent:'center', fontFamily:"'Share Tech Mono',monospace",
                        fontSize:11, color:C.amber, flexShrink:0 }}>{g.step}</div>
                      <span style={{ fontSize:14, fontWeight:700, color:C.white }}>{g.icon} {g.title}</span>
                      <ChevronRight size={13} color={C.muted} style={{ marginLeft:'auto',
                        transform:guideStep===i?'rotate(90deg)':'none', transition:'transform 0.2s' }} />
                    </div>
                    {guideStep===i && (
                      <div>
                        <div style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:10 }}>
                          💡 {g.tip}
                        </div>
                        <div style={{ background:C.surface2, border:`1px solid ${C.border}`,
                          borderRadius:6, padding:'10px 12px', position:'relative' }}>
                          <code style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
                            color:C.primary, display:'block', lineHeight:1.6 }}>"{g.code}"</code>
                          <button onClick={e=>{e.stopPropagation(); copyCode(g.code, i);}}
                            style={{ position:'absolute', top:6, right:6, background:'transparent',
                              border:'none', color:C.muted, cursor:'pointer', padding:4 }}>
                            {copied===i?<Check size={12} color={C.green}/>:<Copy size={12}/>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            AI CHAT
        ══════════════════════════════════════════════════ */}
        <section id="chat" style={{ padding:'80px 20px' }}>
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            <SH label="07 // AI_ASSISTANT" title="Ask About Trison" accent={C.green} />
            <p style={{ color:C.muted, marginTop:8, fontSize:14, marginBottom:28 }}>
              Powered by Claude. Knows everything on the CV.
            </p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`,
                display:'flex', alignItems:'center', gap:8,
                background:`linear-gradient(90deg,${C.green}10,transparent)` }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:C.green,
                  boxShadow:`0 0 6px ${C.green}`, animation:'glow 2s ease-in-out infinite' }} />
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.green }}>
                  AI ASSISTANT — ONLINE
                </span>
              </div>
              <div style={{ height:320, overflowY:'auto', padding:18 }}>
                {chatMessages.map((msg,i)=>(
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:14,
                    flexDirection:msg.role==='user'?'row-reverse':'row' }}>
                    <div style={{ width:28, height:28, borderRadius:6, flexShrink:0,
                      background:msg.role==='user'?`${C.primary}18`:`${C.green}18`,
                      border:`1px solid ${msg.role==='user'?C.primary+'30':C.green+'30'}`,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {msg.role==='user'?<User size={13} color={C.primary}/>:<Bot size={13} color={C.green}/>}
                    </div>
                    <div style={{ maxWidth:'78%', padding:'9px 13px', borderRadius:8,
                      fontSize:14, lineHeight:1.65,
                      background:msg.role==='user'?`${C.primary}12`:C.surface2,
                      border:`1px solid ${msg.role==='user'?C.primary+'25':C.border}`,
                      color:C.text }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                    <div style={{ width:28, height:28, borderRadius:6, background:`${C.green}18`,
                      border:`1px solid ${C.green}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Bot size={13} color={C.green}/>
                    </div>
                    <div style={{ padding:'12px 16px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8 }}>
                      <div style={{ display:'flex', gap:4 }}>
                        {[0,1,2].map(j=>(
                          <div key={j} style={{ width:5, height:5, borderRadius:'50%', background:C.green,
                            animation:`pulse 1s ${j*0.2}s ease-in-out infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
              <div style={{ padding:'12px 14px', borderTop:`1px solid ${C.border}`, display:'flex', gap:8 }}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&sendChat()}
                  placeholder="Ask about skills, availability, experience..."
                  style={{ flex:1, padding:'9px 13px', background:C.surface2,
                    border:`1px solid ${C.border}`, borderRadius:6, color:C.text,
                    fontFamily:'inherit', fontSize:14, outline:'none' }} />
                <button onClick={sendChat} disabled={chatLoading}
                  style={{ padding:'9px 14px', background:C.green, border:'none',
                    borderRadius:6, cursor:'pointer', opacity:chatLoading?0.5:1 }}>
                  <Send size={14} color="#050b18"/>
                </button>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
              {["What's Trison's QA experience?","Is he open to remote work?","What tools does he use?","Tell me about his projects"].map(q=>(
                <button key={q} onClick={()=>setChatInput(q)}
                  style={{ padding:'5px 11px', background:'transparent',
                    border:`1px solid ${C.border}`, borderRadius:20, cursor:'pointer',
                    color:C.muted, fontFamily:'inherit', fontSize:12 }}>{q}</button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER */}
        <footer style={{ padding:'36px 20px', textAlign:'center', borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.muted, letterSpacing:2, marginBottom:6 }}>
            TRISON PILLAY — DURBAN, ZA — trison7@gmail.com — 084 232 8084
          </div>
          <a href="https://trison-portfolio.vercel.app" target="_blank"
            style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.primary,
              textDecoration:'none', letterSpacing:1 }}>
            trison-portfolio.vercel.app
          </a>
          <div style={{ marginTop:8, fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.border }}>
            © 2026 — Built with React + Vite · AI powered by Claude
          </div>
        </footer>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          nav button:last-child { display: flex !important; }
        }
        @media (min-width: 769px) {
          nav button[data-mobile] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
