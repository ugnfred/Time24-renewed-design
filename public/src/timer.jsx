/* ---------- Timer / Pomodoro ---------- */
function Timer(){
  const [target, setTarget] = React.useState(25*60); // seconds
  const [left, setLeft] = React.useState(25*60);
  const [running, setRunning] = React.useState(false);
  const [label, setLabel] = React.useState("Focus session");

  React.useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=>{
      setLeft(l => {
        if(l<=1){ setRunning(false); playChime(); try{ if("Notification" in window && Notification.permission==="granted") new Notification("Time24 · Timer done", { body: label }); }catch(e){} return 0 }
        return l-1;
      });
    },1000);
    return ()=>clearInterval(id);
  },[running]);

  const presets = [
    { k:"1 min",   s:60,       l:"Quick task" },
    { k:"5 min",   s:5*60,     l:"Short break" },
    { k:"10 min",  s:10*60,    l:"Micro work" },
    { k:"25 min",  s:25*60,    l:"Pomodoro",  pomo:true },
    { k:"45 min",  s:45*60,    l:"Deep focus" },
    { k:"1 hour",  s:60*60,    l:"Long session" },
  ];

  const pct = target? (1 - left/target) : 0;
  const m = Math.floor(left/60), s = left%60;
  const R = 130; const C = 2*Math.PI*R;

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Timer · Pomodoro</div>
        <h1>Commit a chunk of <em>time</em> to one thing.</h1>
        <p>Pick a preset or dial in your own. The ring fills as the seconds elapse, so you can tell from across the room how much longer to go.</p>
      </div>

      <div className="glass panel">
        <div className="panel-hero">
          <div>
            <div className="ring-wrap">
              <svg viewBox="0 0 300 300">
                <circle cx="150" cy="150" r={R} fill="none" stroke="var(--rule)" strokeWidth="6"/>
                <circle cx="150" cy="150" r={R} fill="none"
                  stroke="var(--accent)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C*(1-pct)}
                  transform="rotate(-90 150 150)"
                  style={{transition: running? "stroke-dashoffset 1s linear" : "none"}}/>
                {/* tick marks */}
                {[...Array(60)].map((_,i)=>(
                  <line key={i}
                    x1="150" y1={150-R-6} x2="150" y2={150-R-(i%5===0?14:10)}
                    stroke={i%5===0?"#5a574c":"#8a8678"} strokeWidth={i%5===0?1.3:0.7}
                    transform={`rotate(${i*6} 150 150)`} opacity="0.5"/>
                ))}
              </svg>
              <div className="ring-center">
                <div>
                  <div className="t">{pad(m)}:{pad(s)}</div>
                  <div className="l">{label}</div>
                </div>
              </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", gap:"10px", marginTop:"28px"}}>
              {!running? (
                <button className="btn accent" onClick={()=>{ if(left===0) setLeft(target); setRunning(true); }}>
                  <IconPlay/> {left<target && left>0?"Resume":"Start"}
                </button>
              ) : (
                <button className="btn" onClick={()=>setRunning(false)}><IconPause/> Pause</button>
              )}
              <button className="btn ghost" onClick={()=>{ setRunning(false); setLeft(target); }}>
                <IconReset/> Reset
              </button>
            </div>
          </div>

          <div>
            <div className="h-eyebrow">Presets</div>
            <div className="chips" style={{marginTop:"12px"}}>
              {presets.map(p=>(
                <button key={p.k} className={"chip"+(target===p.s?" active":"")}
                  onClick={()=>{ setTarget(p.s); setLeft(p.s); setLabel(p.l); setRunning(false); }}>
                  {p.pomo?"🍅 ":""}{p.k}
                </button>
              ))}
            </div>
            <div className="h-eyebrow" style={{marginTop:"28px"}}>Custom</div>
            <div style={{display:"flex", gap:"8px", marginTop:"10px", alignItems:"center"}}>
              {["h","m","s"].map((u,i)=>(
                <React.Fragment key={u}>
                  <input type="number" min="0" max={u==="h"?99:59}
                    defaultValue={u==="m"?25:0}
                    onChange={(e)=>{
                      const hh = u==="h"?parseInt(e.target.value||0):Math.floor(target/3600);
                      const mm = u==="m"?parseInt(e.target.value||0):Math.floor((target%3600)/60);
                      const ss = u==="s"?parseInt(e.target.value||0):target%60;
                      const t = hh*3600+mm*60+ss;
                      setTarget(t); setLeft(t); setRunning(false);
                    }}
                    style={{width:"60px", padding:"10px", border:"1px solid var(--rule-2)",
                      borderRadius:"8px", fontFamily:"var(--f-mono)", fontSize:"18px", textAlign:"center",
                      background:"var(--paper)"}}/>
                  <span className="mono" style={{color:"var(--ink-4)"}}>{u}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="h-eyebrow" style={{marginTop:"28px"}}>Label</div>
            <input value={label} onChange={e=>setLabel(e.target.value)}
              style={{marginTop:"10px", width:"100%", padding:"12px 14px",
                border:"1px solid var(--rule-2)", borderRadius:"10px",
                fontFamily:"var(--f-display)", fontSize:"17px", background:"var(--paper)", outline:"none"}}/>
            <div style={{marginTop:"28px", padding:"16px 18px", border:"1px solid var(--rule)",
              borderRadius:"10px", background:"var(--paper-2)", fontSize:"13px", color:"var(--ink-3)", lineHeight:1.5}}>
              <b style={{color:"var(--ink)"}}>Pomodoro method.</b> Work for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15–30 minute break. Developed by Francesco Cirillo in the late 1980s.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Timer = Timer;
