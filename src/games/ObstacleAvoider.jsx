import { useEffect, useRef, useState } from 'react';

export default function ObstacleAvoider() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  const W = 480, H = 180;
  const GROUND = H - 30;

  const init = () => {
    stateRef.current = {
      player: { x: 70, y: GROUND, vy: 0, w: 26, h: 26, jumping: false, doubleJump: false },
      obstacles: [], particles: [], frame: 0, score: 0, speed: 3.5,
      alive: true, nextSpawn: 90,
    };
  };

  const jump = () => {
    const s = stateRef.current;
    if (!s || !s.alive) return;
    const p = s.player;
    if (!p.jumping) { p.vy = -11; p.jumping = true; p.doubleJump = false; }
    else if (!p.doubleJump) { p.vy = -9; p.doubleJump = true; }
  };

  const startGame = () => { init(); setStatus('playing'); setScore(0); };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const onKey = e => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', onKey);

    const stars = Array.from({length:40}, () => ({
      x: Math.random()*W, y: Math.random()*(GROUND-20),
      s: Math.random()*1.5+0.5, spd: Math.random()*0.4+0.1,
    }));

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const s = stateRef.current;
      ctx.fillStyle = '#020814';
      ctx.fillRect(0, 0, W, H);

      // stars
      stars.forEach(st => {
        st.x -= (s?.speed || 1) * 0.15;
        if (st.x < 0) st.x = W;
        ctx.fillStyle = `rgba(180,220,255,${st.s/3})`;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.s*0.4, 0, Math.PI*2); ctx.fill();
      });

      // ground
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, GROUND + 26, W, H);
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.moveTo(0, GROUND + 26); ctx.lineTo(W, GROUND + 26); ctx.stroke();
      ctx.setLineDash([]);

      if (!s || !s.alive) {
        // idle/dead screen
        ctx.fillStyle = 'rgba(2,8,20,0.6)';
        ctx.fillRect(0,0,W,H);
        return;
      }

      s.frame++;
      s.score++;
      s.speed = 3.5 + s.frame * 0.001;
      if (s.frame % 2 === 0) { setScore(Math.floor(s.score / 6)); }

      const p = s.player;
      // gravity
      p.vy += 0.55;
      p.y += p.vy;
      if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; p.jumping = false; p.doubleJump = false; }

      // spawn obstacles
      s.nextSpawn--;
      if (s.nextSpawn <= 0) {
        const tall = Math.random() > 0.6;
        const h = tall ? 44 : 26;
        s.obstacles.push({ x: W + 10, w: 18, h, type: tall ? 'tall' : 'short' });
        s.nextSpawn = Math.floor(Math.random() * 60) + 60;
      }

      // update obstacles
      s.obstacles.forEach(o => { o.x -= s.speed; });
      s.obstacles = s.obstacles.filter(o => o.x > -40);

      // collision
      s.obstacles.forEach(o => {
        const py2 = p.y + p.h, ox1 = o.x, ox2 = o.x + o.w, oy1 = GROUND + 26 - o.h;
        if (p.x + p.w - 4 > ox1 && p.x + 4 < ox2 && p.y + 4 < oy1 + o.h && py2 - 2 > oy1) {
          s.alive = false;
          setHi(h => Math.max(h, Math.floor(s.score/6)));
          setStatus('dead');
          for (let i = 0; i < 12; i++) s.particles.push({
            x: p.x + 13, y: p.y + 13,
            vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
            life: 25, color: '#00d4ff',
          });
        }
      });

      // draw obstacles
      s.obstacles.forEach(o => {
        const oy = GROUND + 26 - o.h;
        ctx.fillStyle = o.type === 'tall' ? '#ff4466' : '#ffb800';
        ctx.shadowBlur = 8; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(o.x, oy, o.w, o.h);
        ctx.shadowBlur = 0;
        // top spike
        ctx.fillStyle = o.type === 'tall' ? '#ff6680' : '#ffc833';
        ctx.beginPath();
        ctx.moveTo(o.x, oy); ctx.lineTo(o.x + o.w/2, oy - 8); ctx.lineTo(o.x + o.w, oy);
        ctx.fill();
      });

      // draw player - glowing square robot
      const px = p.x, py = p.y;
      ctx.shadowBlur = 14; ctx.shadowColor = '#00d4ff';
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(px, py, p.w, p.h);
      // visor
      ctx.fillStyle = '#050b18';
      ctx.fillRect(px+6, py+6, 14, 8);
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(px+8, py+8, 4, 4);
      ctx.fillRect(px+14, py+8, 4, 4);
      ctx.shadowBlur = 0;

      // particles
      s.particles.forEach(pt => { pt.x+=pt.vx; pt.y+=pt.vy; pt.vy+=0.2; pt.life--; });
      s.particles.forEach(pt => {
        ctx.globalAlpha = pt.life/25;
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 3, 0, Math.PI*2); ctx.fill();
      });
      s.particles = s.particles.filter(pt => pt.life > 0);
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = '#00d4ff';
      ctx.font = "bold 13px 'Share Tech Mono', monospace";
      ctx.fillText(`${Math.floor(s.score/6)}m`, W - 60, 22);
      if (p.doubleJump) {
        ctx.fillStyle = '#ffb800';
        ctx.font = "10px 'Share Tech Mono', monospace";
        ctx.fillText('2x JUMP', px - 10, py - 5);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <div style={{ position:'relative' }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ border:'1px solid #1a2f50', borderRadius:6, display:'block', maxWidth:'100%' }}
          onClick={jump} onTouchStart={e => { e.preventDefault(); jump(); }} />
        {status !== 'playing' && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', background:'rgba(2,8,20,0.85)',
            borderRadius:6, gap:12 }}>
            {status === 'dead' && <>
              <div style={{ fontFamily:"'Share Tech Mono'", color:'#ff4466', fontSize:18 }}>SYSTEM CRASH</div>
              <div style={{ fontFamily:"'Share Tech Mono'", color:'#00d4ff', fontSize:13 }}>
                {score}m · HI: {hi}m
              </div>
            </>}
            {status === 'idle' && <div style={{ fontFamily:"'Share Tech Mono'", color:'#00d4ff', fontSize:15 }}>OBSTACLE RUN</div>}
            <button onClick={startGame} style={{ padding:'8px 24px', background:'#00ff88',
              color:'#050b18', border:'none', borderRadius:4, fontFamily:"'Rajdhani',sans-serif",
              fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:1 }}>
              {status === 'dead' ? 'RETRY' : 'START'}
            </button>
          </div>
        )}
      </div>
      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:'#4a6a8a', textAlign:'center' }}>
        SPACE / ↑ or TAP to jump · Double jump available!
      </div>
    </div>
  );
}
