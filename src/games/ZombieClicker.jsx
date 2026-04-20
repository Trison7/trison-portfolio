import { useState, useEffect, useRef } from 'react';

const UPGRADES = [
  { id:'brain',  name:'Brain Farm',    icon:'🧠', base:15,  multiplier:0.5,  desc:'Grows brains passively' },
  { id:'horde',  name:'Zombie Horde',  icon:'🧟', base:100, multiplier:3,    desc:'Unleash the horde!' },
  { id:'lab',    name:'Mad Lab',       icon:'🔬', base:500, multiplier:12,   desc:'Scientific undead research' },
  { id:'tower',  name:'Skull Tower',   icon:'💀', base:2000,multiplier:40,   desc:'Rains skulls from above' },
  { id:'portal', name:'Hell Portal',   icon:'🌀', base:8000,multiplier:150,  desc:'Direct line to the underworld' },
];

export default function ZombieClicker() {
  const [coins, setCoins] = useState(0);
  const [total, setTotal] = useState(0);
  const [owned, setOwned] = useState({brain:0,horde:0,lab:0,tower:0,portal:0});
  const [clicks, setClicks] = useState([]);
  const [bigClick, setBigClick] = useState(false);
  const tickRef = useRef(null);

  const cps = UPGRADES.reduce((s, u) => s + (owned[u.id] * u.multiplier), 0);
  const cpc = 1 + Math.floor(cps * 0.1);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setCoins(c => c + cps / 20);
      setTotal(t => t + cps / 20);
    }, 50);
    return () => clearInterval(tickRef.current);
  }, [cps]);

  const click = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoins(c => c + cpc);
    setTotal(t => t + cpc);
    setBigClick(true);
    setTimeout(() => setBigClick(false), 80);
    const id = Date.now();
    setClicks(cl => [...cl, { id, x, y, val: cpc }]);
    setTimeout(() => setClicks(cl => cl.filter(c => c.id !== id)), 800);
  };

  const buy = (upg) => {
    const cost = Math.floor(upg.base * Math.pow(1.15, owned[upg.id]));
    if (coins < cost) return;
    setCoins(c => c - cost);
    setOwned(o => ({ ...o, [upg.id]: o[upg.id] + 1 }));
  };

  const fmt = n => n >= 1e9 ? (n/1e9).toFixed(1)+'B' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : Math.floor(n).toString();

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 180px', gap:16, maxWidth:460 }}>
      {/* Left: clicker */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:'#4a6a8a' }}>ZOMBIE COINS</div>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:32, fontWeight:700, color:'#ff4466' }}>
          🪙 {fmt(coins)}
        </div>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:'#4a6a8a' }}>
          {cps.toFixed(1)}/sec · {cpc}/click
        </div>

        {/* Big zombie button */}
        <div onClick={click} style={{
          position:'relative', width:110, height:110, borderRadius:'50%',
          background: bigClick ? 'rgba(255,68,102,0.3)' : 'rgba(255,68,102,0.1)',
          border:`3px solid ${bigClick ? '#ff4466' : 'rgba(255,68,102,0.4)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:52, cursor:'pointer', userSelect:'none',
          boxShadow: bigClick ? '0 0 30px rgba(255,68,102,0.7)' : '0 0 10px rgba(255,68,102,0.2)',
          transition:'all 0.08s',
          transform: bigClick ? 'scale(0.93)' : 'scale(1)',
        }}>
          🧟
          {clicks.map(c => (
            <div key={c.id} style={{ position:'absolute', left:c.x, top:c.y,
              fontFamily:"'Share Tech Mono'", fontSize:12, color:'#ff4466', fontWeight:700,
              pointerEvents:'none', animation:'fadeInUp 0.8s ease forwards',
              whiteSpace:'nowrap' }}>+{c.val}</div>
          ))}
        </div>

        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:'#4a6a8a' }}>
          Total earned: {fmt(total)}
        </div>
      </div>

      {/* Right: shop */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:'#ffb800', marginBottom:2 }}>UPGRADES</div>
        {UPGRADES.map(u => {
          const cost = Math.floor(u.base * Math.pow(1.15, owned[u.id]));
          const can = coins >= cost;
          return (
            <button key={u.id} onClick={() => buy(u)} title={u.desc} style={{
              padding:'6px 8px', borderRadius:6, cursor: can ? 'pointer' : 'not-allowed',
              background: can ? 'rgba(255,184,0,0.1)' : 'rgba(26,47,80,0.4)',
              border:`1px solid ${can ? 'rgba(255,184,0,0.4)' : '#1a2f50'}`,
              textAlign:'left', transition:'all 0.15s', fontFamily:'inherit',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:16 }}>{u.icon}</span>
                <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9,
                  color: can ? '#ffb800' : '#4a6a8a' }}>{fmt(cost)}</span>
              </div>
              <div style={{ fontSize:11, color: can ? '#e8f4ff' : '#4a6a8a',
                fontWeight:600, marginTop:2 }}>{u.name}</div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:'#4a6a8a' }}>
                owned: {owned[u.id]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
