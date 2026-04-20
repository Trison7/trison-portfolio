import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const CELL = 18, COLS = 22, ROWS = 18;

function placeFood(snake) {
  let pos;
  do { pos = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) }; }
  while (snake.some(s => s.x===pos.x && s.y===pos.y));
  return pos;
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef({ snake:[{x:11,y:9}], dir:{x:1,y:0}, nextDir:{x:1,y:0}, food:{x:5,y:5}, score:0, alive:true, speed:140 });
  const intervalRef = useRef(null);
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const g = gameRef.current;
    // Background
    ctx.fillStyle = '#020814'; ctx.fillRect(0, 0, COLS*CELL, ROWS*CELL);
    // Grid
    ctx.strokeStyle = 'rgba(26,47,80,0.4)'; ctx.lineWidth = 0.5;
    for (let x=0;x<COLS;x++) for (let y=0;y<ROWS;y++) ctx.strokeRect(x*CELL,y*CELL,CELL,CELL);
    // Snake
    g.snake.forEach((s, i) => {
      const alpha = Math.max(0.15, 1 - i * 0.035);
      ctx.fillStyle = i===0 ? '#00ff88' : `rgba(0,200,100,${alpha})`;
      if (i===0) { ctx.shadowBlur=12; ctx.shadowColor='#00ff88'; }
      ctx.beginPath(); ctx.roundRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2, 3); ctx.fill();
      ctx.shadowBlur=0;
      // Eyes on head
      if (i===0) {
        ctx.fillStyle='#050b18';
        const ex = g.dir.x===0 ? [3,11] : g.dir.x>0 ? [11,11] : [4,4];
        const ey = g.dir.y===0 ? [4,11] : g.dir.y>0 ? [11,11] : [4,4];
        ctx.fillRect(s.x*CELL+ex[0], s.y*CELL+ey[0], 3, 3);
        if (g.dir.x===0) ctx.fillRect(s.x*CELL+ex[1], s.y*CELL+ey[1], 3, 3);
      }
    });
    // Food
    const fx = g.food.x*CELL+CELL/2, fy = g.food.y*CELL+CELL/2;
    ctx.shadowBlur=16; ctx.shadowColor='#ff4466';
    ctx.fillStyle='#ff4466';
    ctx.beginPath(); ctx.arc(fx, fy, CELL/2-2, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    // Score HUD
    ctx.fillStyle='rgba(0,212,255,0.8)';
    ctx.font="bold 11px 'Share Tech Mono',monospace";
    ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText(`SCORE: ${g.score}`, 6, 4);
    ctx.textAlign='right';
    ctx.fillText(`BEST: ${Math.max(hi, g.score)}`, COLS*CELL-6, 4);
  }, [hi]);

  const tick = useCallback(() => {
    const g = gameRef.current; if (!g.alive) return;
    g.dir = { ...g.nextDir };
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||g.snake.some(s=>s.x===head.x&&s.y===head.y)) {
      g.alive=false; setDead(true); setHi(h=>Math.max(h,g.score)); clearInterval(intervalRef.current); return;
    }
    g.snake.unshift(head);
    if (head.x===g.food.x && head.y===g.food.y) {
      g.score++; setScore(g.score); g.food=placeFood(g.snake);
      if (g.score%5===0 && g.speed>70) { g.speed=Math.max(70,g.speed-8); clearInterval(intervalRef.current); intervalRef.current=setInterval(tick,g.speed); }
    } else { g.snake.pop(); }
    draw();
  }, [draw]);

  const start = useCallback(() => {
    const g = gameRef.current;
    g.snake=[{x:11,y:9}]; g.dir={x:1,y:0}; g.nextDir={x:1,y:0};
    g.food=placeFood(g.snake); g.score=0; g.alive=true; g.speed=140;
    setScore(0); setDead(false); setStarted(true);
    clearInterval(intervalRef.current);
    intervalRef.current=setInterval(tick,g.speed);
    draw();
  }, [tick, draw]);

  useEffect(()=>{ draw(); return()=>clearInterval(intervalRef.current); },[draw]);

  useEffect(()=>{
    const h = e => {
      const g=gameRef.current; if(!g.alive) return;
      const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
      const d=map[e.key]; if(!d) return;
      if(d.x!==-g.dir.x||d.y!==-g.dir.y) g.nextDir=d;
      e.preventDefault();
    };
    window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h);
  },[]);

  const setDir=(dx,dy)=>{ const g=gameRef.current; if(!g.alive) return; if(dx!==-g.dir.x||dy!==-g.dir.y) g.nextDir={x:dx,y:dy}; };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
      <div style={{position:'relative',display:'inline-block'}}>
        <canvas ref={canvasRef} width={COLS*CELL} height={ROWS*CELL}
          style={{border:'1px solid #1a2f50',borderRadius:6,display:'block',maxWidth:'100%'}}/>
        {(!started||dead)&&(
          <div style={{position:'absolute',inset:0,background:'rgba(2,8,20,0.88)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:6,gap:12}}>
            {dead&&<><div style={{fontFamily:"'Share Tech Mono'",color:'#ff4466',fontSize:18}}>GAME OVER</div><div style={{fontFamily:"'Share Tech Mono'",color:'#00d4ff',fontSize:13}}>Score: {score} · Best: {hi}</div></>}
            {!started&&<div style={{fontFamily:"'Share Tech Mono'",color:'#00ff88',fontSize:16}}>🐍 SNAKE</div>}
            <button onClick={start} style={{padding:'8px 24px',background:'#00ff88',color:'#050b18',border:'none',borderRadius:4,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer',letterSpacing:1}}>{dead?'PLAY AGAIN':'START'}</button>
          </div>
        )}
      </div>
      {/* Mobile d-pad */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,44px)',gridTemplateRows:'repeat(2,44px)',gap:4}}>
        {[null,{icon:<ArrowUp size={18}/>,dx:0,dy:-1},null,
          {icon:<ArrowLeft size={18}/>,dx:-1,dy:0},{icon:<ArrowDown size={18}/>,dx:0,dy:1},{icon:<ArrowRight size={18}/>,dx:1,dy:0}
        ].map((cell,i)=>cell?(
          <button key={i} onTouchStart={e=>{e.preventDefault();setDir(cell.dx,cell.dy);}} onClick={()=>setDir(cell.dx,cell.dy)}
            style={{width:44,height:44,background:'#0a1628',border:'1px solid #1a2f50',borderRadius:6,cursor:'pointer',color:'#b8d4f0',display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none'}}>
            {cell.icon}
          </button>
        ):<div key={i}/>)}
      </div>
      <div style={{fontFamily:"'Share Tech Mono'",fontSize:11,color:'#4a6a8a',textAlign:'center'}}>Arrow keys · Speed increases every 5 points!</div>
    </div>
  );
}
