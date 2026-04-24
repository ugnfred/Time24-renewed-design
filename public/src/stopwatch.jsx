/* ---------- Stopwatch ---------- */
function Stopwatch(){
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [laps, setLaps] = React.useState([]);
  const last = React.useRef(0);

  React.useEffect(()=>{
    if(!running) return;
    let raf;
    let start = performance.now() - elapsed;
    const loop = () => {
      setElapsed(performance.now()-start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[running]);

  const fmt = (ms) => {
    const h = Math.floor(ms/3600000);
    const m = Math.floor((ms%3600000)/60000);
    const s = Math.floor((ms%60000)/1000);
    const cs = Math.floor((ms%1000)/10);
    return { main: (h?pad(h)+":":"") + pad(m)+":"+pad(s), cs: pad(cs) };
  };
  const parts = fmt(elapsed);

  const lapTimes = laps.map(l=>l.lap);
  const minLap = lapTimes.length>1 ? Math.min(...lapTimes) : null;
  const maxLap = lapTimes.length>1 ? Math.max(...lapTimes) : null;

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Stopwatch</div>
        <h1>Measure <em>exactly</em> what passes.</h1>
        <p>Millisecond precision, unlimited laps, best and worst automatically flagged. Runs in the browser — no account, nothing uploaded.</p>
      </div>

      <div className="glass panel">
        <div className="giant-timer" style={{textAlign:"center"}}>
          {parts.main}<span className="ms">.{parts.cs}</span>
        </div>
        <div style={{display:"flex", justifyContent:"center", gap:"10px", marginTop:"32px"}}>
          {!running ? (
            <button className="btn accent" onClick={()=>setRunning(true)}>
              <IconPlay/> {elapsed>0?"Resume":"Start"}
            </button>
          ) : (
            <button className="btn" onClick={()=>setRunning(false)}>
              <IconPause/> Pause
            </button>
          )}
          <button className="btn ghost" onClick={()=>{
            if(!running) return;
            const total = elapsed;
            const prev = laps.reduce((a,l)=>a+l.lap,0);
            setLaps([...laps, { idx: laps.length+1, lap: total-prev, total }]);
          }} disabled={!running}>Lap</button>
          <button className="btn ghost" onClick={()=>{
            setRunning(false); setElapsed(0); setLaps([]);
          }}>
            <IconReset/> Reset
          </button>
        </div>

        {laps.length>0 && (
          <div className="lap-list">
            {[...laps].reverse().map(l=>{
              const cls = l.lap===minLap?"best" : l.lap===maxLap?"worst" : "";
              const lp = fmt(l.lap);
              const tt = fmt(l.total);
              return (
                <div key={l.idx} className={"lap-row "+cls}>
                  <div className="idx">#{pad(l.idx)}</div>
                  <div className="lap">{lp.main}.{lp.cs}</div>
                  <div className="total">{tt.main}.{tt.cs}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
window.Stopwatch = Stopwatch;
