import { useEffect, useRef, useState } from 'react';

export default function SpaceShooter() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | playing | dead
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  const W = 480, H = 280;

  const init = () => {
    stateRef.current = {
      player: { x: 60, y: H / 2, w: 36, h: 20, vy: 0, hp: 3 },
      bullets: [], enemies: [], stars: [], particles: [], frame: 0,
      score: 0, alive: true, spawnRate: 90,
    };
    // init stars
    for (let i = 0; i < 60; i++) {
      stateRef.current.stars.push({
        x: Math.random() * W, y: Math.random() * H,
        s: Math.random() * 2 + 0.5, spd: Math.random() * 1.5 + 0.5,
      });
    }
  };

  const startGame = () => {
    init();
    setStatus('playing');
    setScore(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const keys = {};

    const onKey = e => { keys[e.code] = e.type === 'keydown'; e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const s = stateRef.current;
      if (!s || !s.alive) return;

      s.frame++;
      const p = s.player;

      // input
      if (keys['ArrowUp'] || keys['KeyW']) p.vy -= 0.6;
      if (keys['ArrowDown'] || keys['KeyS']) p.vy += 0.6;
      p.vy *= 0.85;
      p.y = Math.max(10, Math.min(H - 10, p.y + p.vy));

      // shoot
      if ((keys['Space'] || keys['KeyZ']) && s.frame % 10 === 0) {
        s.bullets.push({ x: p.x + p.w, y: p.y, spd: 9 });
      }

      // spawn enemies
      if (s.frame % s.spawnRate === 0) {
        const types = ['grunt', 'zigzag', 'tank'];
        const t = types[Math.floor(Math.random() * types.length)];
        s.enemies.push({ x: W + 20, y: Math.random() * (H - 40) + 20,
          w: t === 'tank' ? 32 : 22, h: t === 'tank' ? 22 : 16,
          hp: t === 'tank' ? 3 : 1, type: t, frame: 0,
          spd: t === 'tank' ? 1.5 : 2.5 });
        if (s.spawnRate > 30) s.spawnRate -= 0.15;
      }

      // update bullets
      s.bullets = s.bullets.filter(b => { b.x += b.spd; return b.x < W + 10; });

      // update enemies
      s.enemies.forEach(e => {
        e.frame++;
        e.x -= e.spd;
        if (e.type === 'zigzag') e.y += Math.sin(e.frame * 0.12) * 2.2;
      });
      s.enemies = s.enemies.filter(e => e.x > -40);

      // bullet-enemy collision
      s.bullets.forEach((b, bi) => {
        s.enemies.forEach((e, ei) => {
          if (b.x > e.x && b.x < e.x + e.w && b.y > e.y - e.h / 2 && b.y < e.y + e.h / 2) {
            e.hp--;
            s.bullets.splice(bi, 1);
            for (let i = 0; i < 5; i++) s.particles.push({
              x: e.x + e.w / 2, y: e.y, vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4, life: 20, color: '#ff4466',
            });
            if (e.hp <= 0) {
              s.score += e.type === 'tank' ? 30 : 10;
              setScore(s.score);
              s.enemies.splice(ei, 1);
            }
          }
        });
      });

      // enemy-player collision
      s.enemies.forEach(e => {
        if (Math.abs(e.x - p.x) < (e.w + p.w) / 2 && Math.abs(e.y - p.y) < (e.h + p.h) / 2) {
          s.alive = false;
          setHi(h => Math.max(h, s.score));
          setStatus('dead');
        }
      });

      // particles
      s.particles.forEach(pt => { pt.x += pt.vx; pt.y += pt.vy; pt.life--; });
      s.particles = s.particles.filter(pt => pt.life > 0);

      // stars
      s.stars.forEach(st => { st.x -= st.spd; if (st.x < 0) { st.x = W; st.y = Math.random() * H; } });

      // ─ DRAW ─
      ctx.fillStyle = '#020814';
      ctx.fillRect(0, 0, W, H);

      // stars
      s.stars.forEach(st => {
        ctx.fillStyle = `rgba(180,220,255,${st.s / 3})`;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.s * 0.5, 0, Math.PI * 2); ctx.fill();
      });

      // bullets
      s.bullets.forEach(b => {
        ctx.shadowBlur = 8; ctx.shadowColor = '#00d4ff';
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(b.x - 6, b.y - 2, 12, 4);
        ctx.shadowBlur = 0;
      });

      // enemies
      s.enemies.forEach(e => {
        ctx.fillStyle = e.type === 'tank' ? '#ff4466' : e.type === 'zigzag' ? '#b066ff' : '#ff8800';
        ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(e.x + e.w, e.y - e.h / 2);
        ctx.lineTo(e.x + e.w, e.y + e.h / 2);
        ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0;
        // hp bar
        if (e.hp > 1) {
          ctx.fillStyle = '#333'; ctx.fillRect(e.x, e.y - e.h / 2 - 6, e.w, 3);
          ctx.fillStyle = '#00ff88'; ctx.fillRect(e.x, e.y - e.h / 2 - 6, e.w * (e.hp / 3), 3);
        }
      });

      // player ship
      ctx.shadowBlur = 16; ctx.shadowColor = '#00d4ff';
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.moveTo(p.x + p.w, p.y);
      ctx.lineTo(p.x, p.y - p.h / 2);
      ctx.lineTo(p.x + 8, p.y);
      ctx.lineTo(p.x, p.y + p.h / 2);
      ctx.closePath(); ctx.fill();
      // engine glow
      ctx.fillStyle = '#00ff88';
      ctx.beginPath(); ctx.ellipse(p.x, p.y, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // particles
      s.particles.forEach(pt => {
        ctx.globalAlpha = pt.life / 20;
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = '#00d4ff';
      ctx.font = "bold 13px 'Share Tech Mono', monospace";
      ctx.fillText(`SCORE: ${s.score}`, 8, 20);
      ctx.fillStyle = '#4a6a8a';
      ctx.fillText(`HI: ${Math.max(hi, s.score)}`, W - 80, 20);
      // hp hearts
      for (let i = 0; i < p.hp; i++) {
        ctx.fillStyle = '#ff4466';
        ctx.fillText('♥', W - 20 - i * 18, 20);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  // touch controls
  const touchMove = e => {
    const r = canvasRef.current.getBoundingClientRect();
    const s = stateRef.current;
    if (!s) return;
    const t = e.touches[0];
    s.player.y = ((t.clientY - r.top) / r.height) * H;
  };
  const touchShoot = () => {
    const s = stateRef.current;
    if (!s) return;
    s.bullets.push({ x: s.player.x + s.player.w, y: s.player.y, spd: 9 });
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <div style={{ position:'relative' }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ border:'1px solid #1a2f50', borderRadius:6, display:'block',
            maxWidth:'100%', touchAction:'none' }}
          onTouchMove={touchMove} onTouchStart={touchShoot} />
        {status !== 'playing' && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', background:'rgba(2,8,20,0.88)',
            borderRadius:6, gap:12 }}>
            {status === 'dead' && (
              <>
                <div style={{ fontFamily:"'Share Tech Mono'", color:'#ff4466', fontSize:20 }}>GAME OVER</div>
                <div style={{ fontFamily:"'Share Tech Mono'", color:'#00d4ff', fontSize:14 }}>Score: {score} | HI: {hi}</div>
              </>
            )}
            {status === 'idle' && <div style={{ fontFamily:"'Share Tech Mono'", color:'#00d4ff', fontSize:15 }}>SPACE SHOOTER</div>}
            <button onClick={startGame} style={{ padding:'8px 24px', background:'#00d4ff', color:'#050b18',
              border:'none', borderRadius:4, fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
              fontSize:14, cursor:'pointer', letterSpacing:1 }}>
              {status === 'dead' ? 'PLAY AGAIN' : 'START GAME'}
            </button>
          </div>
        )}
      </div>
      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:'#4a6a8a', textAlign:'center' }}>
        ↑↓ / W·S move &nbsp;|&nbsp; SPACE / Z shoot &nbsp;|&nbsp; Mobile: drag to aim, tap to shoot
      </div>
    </div>
  );
}
