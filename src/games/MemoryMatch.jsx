import { useState, useEffect } from 'react';

const SYMBOLS = [
  { id:'bug',   icon:'🐛', label:'BUG'    },
  { id:'api',   icon:'⚡', label:'API'    },
  { id:'test',  icon:'✅', label:'TEST'   },
  { id:'jira',  icon:'📋', label:'JIRA'   },
  { id:'code',  icon:'💻', label:'CODE'   },
  { id:'deploy',icon:'🚀', label:'DEPLOY' },
  { id:'db',    icon:'🗄️', label:'DB'     },
  { id:'shield',icon:'🛡️', label:'SEC'    },
];

function makeCards() {
  const pairs = [...SYMBOLS, ...SYMBOLS].map((s, i) => ({ ...s, uid: i, flipped: false, matched: false }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(makeCards());
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t;
    if (running && !won) t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const flip = (idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;
    if (!running) setRunning(true);
    const next = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const sel = [...selected, idx];
    setCards(next);
    if (sel.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = sel;
      if (next[a].id === next[b].id) {
        const matched = next.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c);
        setTimeout(() => {
          setCards(matched);
          setSelected([]);
          setLocked(false);
          if (matched.every(c => c.matched)) { setWon(true); setRunning(false); }
        }, 400);
      } else {
        setTimeout(() => {
          setCards(next.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    } else {
      setSelected(sel);
    }
  };

  const reset = () => {
    setCards(makeCards()); setSelected([]); setMoves(0);
    setWon(false); setLocked(false); setTime(0); setRunning(false);
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{ display:'flex', gap:24, fontFamily:"'Share Tech Mono'", fontSize:13 }}>
        <span style={{ color:'#00d4ff' }}>MOVES: {moves}</span>
        <span style={{ color:'#ffb800' }}>TIME: {fmt(time)}</span>
        <span style={{ color:'#00ff88' }}>MATCHED: {cards.filter(c=>c.matched).length/2}/{SYMBOLS.length}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 68px)', gap:8 }}>
        {cards.map((card, i) => (
          <div key={card.uid} onClick={() => flip(i)} style={{
            width:68, height:68, borderRadius:8, cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            transition:'transform 0.25s, box-shadow 0.2s',
            transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(0deg)',
            background: card.matched ? 'rgba(0,255,136,0.15)' :
                        card.flipped ? 'rgba(0,212,255,0.12)' : '#0a1628',
            border: card.matched ? '1px solid rgba(0,255,136,0.5)' :
                    card.flipped ? '1px solid rgba(0,212,255,0.5)' : '1px solid #1a2f50',
            boxShadow: card.matched ? '0 0 12px rgba(0,255,136,0.3)' :
                       card.flipped ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
            userSelect:'none',
          }}>
            {card.flipped || card.matched ? (
              <>
                <span style={{ fontSize:26 }}>{card.icon}</span>
                <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:'#4a6a8a', marginTop:2 }}>{card.label}</span>
              </>
            ) : (
              <span style={{ fontSize:24, color:'#1a2f50' }}>?</span>
            )}
          </div>
        ))}
      </div>

      {won && (
        <div style={{ textAlign:'center', padding:'12px 0' }}>
          <div style={{ fontFamily:"'Share Tech Mono'", color:'#00ff88', fontSize:16, marginBottom:4 }}>
            ALL PAIRS MATCHED! 🎉
          </div>
          <div style={{ fontFamily:"'Share Tech Mono'", color:'#b8d4f0', fontSize:12 }}>
            {moves} moves · {fmt(time)}
          </div>
        </div>
      )}

      <button onClick={reset} style={{ padding:'7px 20px', background:'transparent',
        border:'1px solid #1a2f50', borderRadius:4, color:'#4a6a8a',
        fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer',
        letterSpacing:1 }}>RESET</button>
    </div>
  );
}
