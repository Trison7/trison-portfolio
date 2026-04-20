import { useState } from 'react';

const QS = [
  { q: "Which testing technique checks if valid AND invalid inputs are handled correctly?",
    opts: ["Boundary Value Analysis","Equivalence Partitioning","Decision Table","State Transition"],
    a: 1, exp: "Equivalence Partitioning divides inputs into valid/invalid classes to reduce test cases while maintaining coverage." },
  { q: "In Agile, what artifact lists all work items prioritised by business value?",
    opts: ["Sprint Backlog","Kanban Board","Product Backlog","Release Plan"],
    a: 2, exp: "The Product Backlog is owned by the Product Owner and lists all desired work items prioritised for the team." },
  { q: "An API returns HTTP 422. What does this mean?",
    opts: ["Server Error","Not Found","Unprocessable Entity","Unauthorised"],
    a: 2, exp: "422 Unprocessable Entity means the server understands the content type but cannot process the contained instructions." },
  { q: "What is the PRIMARY purpose of regression testing?",
    opts: ["Test new features","Ensure fixes didn't break existing functionality","Measure performance","Validate user stories"],
    a: 1, exp: "Regression testing ensures that previously working features remain unbroken after new code changes are introduced." },
  { q: "In SQL, which clause filters results AFTER aggregation?",
    opts: ["WHERE","FILTER","GROUP BY","HAVING"],
    a: 3, exp: "HAVING filters rows after GROUP BY aggregation, while WHERE filters rows before aggregation." },
  { q: "A DNS A record points to a…",
    opts: ["Domain alias","IPv4 address","Mail server","IPv6 address"],
    a: 1, exp: "DNS A (Address) records map a hostname to an IPv4 address. AAAA records handle IPv6." },
  { q: "What does CORS stand for?",
    opts: ["Content Origin Response Security","Cross-Origin Resource Sharing","Certificate Of Remote Service","Client-Oriented Request System"],
    a: 1, exp: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism controlling how web pages request resources from different domains." },
  { q: "Which ISTQB testing level validates the entire integrated system against requirements?",
    opts: ["Unit Testing","Integration Testing","System Testing","Acceptance Testing"],
    a: 2, exp: "System Testing validates the complete, integrated system against specified requirements, performed by an independent QA team." },
  { q: "In CI/CD, what does a 'pipeline' do?",
    opts: ["Stores code backups","Automates build, test, and deploy steps","Manages user sessions","Routes API requests"],
    a: 1, exp: "A CI/CD pipeline automates the steps from code commit to deployment: build → test → stage → deploy." },
  { q: "What HTTP method should an API use to PARTIALLY update a resource?",
    opts: ["PUT","POST","PATCH","UPDATE"],
    a: 2, exp: "PATCH applies partial modifications to a resource. PUT replaces the entire resource, and POST creates a new one." },
  { q: "A CDN (Content Delivery Network) primarily improves…",
    opts: ["Database query speed","Code compilation time","Asset delivery speed via edge servers","API authentication"],
    a: 2, exp: "CDNs cache static assets on geographically distributed edge servers, reducing latency for end users worldwide." },
  { q: "Which Jira issue type represents a large body of work that can be broken into stories?",
    opts: ["Bug","Task","Epic","Sub-task"],
    a: 2, exp: "An Epic is a large feature or body of work broken down into smaller Stories or Tasks for sprint planning." },
];

export default function QAQuiz() {
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);

  const pick = (idx) => {
    if (chosen !== null) return;
    const correct = idx === QS[qi].a;
    setChosen(idx);
    setAnswers(a => [...a, { correct, chosen: idx }]);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (qi + 1 >= QS.length) { setDone(true); return; }
    setQi(q => q + 1);
    setChosen(null);
  };

  const reset = () => { setQi(0); setChosen(null); setScore(0); setDone(false); setAnswers([]); };

  const pct = Math.round((score / QS.length) * 100);
  const grade = pct >= 90 ? { label:'SENIOR QA', color:'#00ff88' } :
                pct >= 70 ? { label:'QA ANALYST', color:'#00d4ff' } :
                pct >= 50 ? { label:'JUNIOR QA', color:'#ffb800' } :
                            { label:'KEEP STUDYING', color:'#ff4466' };

  if (done) return (
    <div style={{ textAlign:'center', padding:'10px 0' }}>
      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:13, color:'#4a6a8a', marginBottom:8 }}>
        QUIZ COMPLETE — {QS.length}/{QS.length} questions
      </div>
      <div style={{ fontSize:48, fontWeight:700, fontFamily:"'Rajdhani',sans-serif",
        color: grade.color, marginBottom:4 }}>{pct}%</div>
      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color: grade.color, marginBottom:16 }}>
        RANK: {grade.label}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:4, marginBottom:16 }}>
        {answers.map((a, i) => (
          <div key={i} style={{ width:32, height:32, borderRadius:4, display:'flex',
            alignItems:'center', justifyContent:'center', fontSize:14,
            background: a.correct ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,102,0.15)',
            border: `1px solid ${a.correct ? '#00ff88' : '#ff4466'}44` }}>
            {a.correct ? '✓' : '✗'}
          </div>
        ))}
      </div>
      <button onClick={reset} style={{ padding:'8px 24px', background:'#00d4ff', color:'#050b18',
        border:'none', borderRadius:4, fontFamily:"'Rajdhani',sans-serif",
        fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:1 }}>
        RETRY
      </button>
    </div>
  );

  const q = QS[qi];
  return (
    <div style={{ maxWidth:420 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12,
        fontFamily:"'Share Tech Mono'", fontSize:11, color:'#4a6a8a' }}>
        <span>Q {qi+1} / {QS.length}</span>
        <span style={{ color:'#00ff88' }}>SCORE: {score}</span>
      </div>
      {/* Progress bar */}
      <div style={{ height:3, background:'#1a2f50', borderRadius:2, marginBottom:16, overflow:'hidden' }}>
        <div style={{ height:'100%', background:'#00d4ff', borderRadius:2,
          width:`${((qi) / QS.length) * 100}%`, transition:'width 0.3s' }} />
      </div>

      <div style={{ fontSize:15, fontWeight:600, color:'#e8f4ff', lineHeight:1.5, marginBottom:16 }}>
        {q.q}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {q.opts.map((opt, i) => {
          let bg = '#0a1628', border = '#1a2f50', color = '#b8d4f0';
          if (chosen !== null) {
            if (i === q.a) { bg = 'rgba(0,255,136,0.12)'; border = '#00ff88'; color = '#00ff88'; }
            else if (i === chosen && i !== q.a) { bg = 'rgba(255,68,102,0.12)'; border = '#ff4466'; color = '#ff4466'; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{
              padding:'10px 14px', background:bg, border:`1px solid ${border}`,
              borderRadius:6, color, textAlign:'left', cursor: chosen !== null ? 'default' : 'pointer',
              fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:600,
              transition:'all 0.2s',
            }}>
              <span style={{ fontFamily:"'Share Tech Mono'", fontSize:11, marginRight:8,
                color:'#4a6a8a' }}>{['A','B','C','D'][i]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(0,212,255,0.07)',
          border:'1px solid rgba(0,212,255,0.2)', borderRadius:6,
          fontFamily:"'Share Tech Mono'", fontSize:12, color:'#b8d4f0', lineHeight:1.6 }}>
          💡 {q.exp}
        </div>
      )}

      {chosen !== null && (
        <button onClick={next} style={{ marginTop:12, padding:'8px 20px', background:'#00d4ff',
          color:'#050b18', border:'none', borderRadius:4, fontFamily:"'Rajdhani',sans-serif",
          fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:1 }}>
          {qi + 1 >= QS.length ? 'SEE RESULTS →' : 'NEXT →'}
        </button>
      )}
    </div>
  );
}
