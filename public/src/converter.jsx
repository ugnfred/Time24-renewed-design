/* ---------- Timezone Converter ---------- */
function Converter(){
  const now = useTick(60000);
  const [baseZone, setBaseZone] = React.useState("IST");
  const [baseHour, setBaseHour] = React.useState(()=>new Date().getHours() + new Date().getMinutes()/60);
  const [zones, setZones] = React.useState(["IST","NYC","LON","SIN","TYO"]);
  const [dayOffset, setDayOffset] = React.useState(0);
  const base = CITIES.find(c=>c.id===baseZone);

  // Convert baseHour (in base zone) to UTC
  const utcHour = (baseHour - base.off + 24*3) % 24;

  const fmtHour = (h) => {
    const hh = Math.floor(h);
    const mm = Math.floor((h-hh)*60);
    const ap = hh<12 ? "AM" : "PM";
    const h12 = ((hh+11)%12)+1;
    return `${pad(h12)}:${pad(mm)} ${ap}`;
  };

  const available = CITIES.filter(c=>!zones.includes(c.id));

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Timezone Converter</div>
        <h1>Compare zones at a <em>glance.</em></h1>
        <p>Drag the slider to pick a time in your base zone; every other zone updates live. Green bars mark local 9–5, navy marks likely-asleep hours.</p>
      </div>

      <div className="glass panel">
        <div style={{display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap", marginBottom:"14px"}}>
          <div>
            <div className="h-eyebrow">Base zone</div>
            <select value={baseZone} onChange={e=>setBaseZone(e.target.value)}
              style={{marginTop:"6px", padding:"10px 14px", border:"1px solid var(--rule-2)",
                borderRadius:"10px", fontFamily:"var(--f-display)", fontSize:"18px", background:"var(--paper)"}}>
              {CITIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{flex:1, minWidth:"280px"}}>
            <div className="h-eyebrow">Time in {base.name}</div>
            <div className="slider-row" style={{marginTop:"6px"}}>
              <input type="range" min="0" max="23.9" step="0.25"
                value={baseHour} onChange={e=>setBaseHour(parseFloat(e.target.value))}/>
              <div className="mono" style={{minWidth:"110px", textAlign:"right", fontSize:"17px"}}>
                {fmtHour(baseHour)}
              </div>
              <button className="btn ghost sm" onClick={()=>{
                const d = new Date();
                setBaseHour(d.getHours()+d.getMinutes()/60);
              }}>Now</button>
            </div>
          </div>
          <div>
            <div className="h-eyebrow">Day</div>
            <div style={{display:"flex", gap:"6px", marginTop:"6px"}}>
              {[-1,0,1].map(o=>(
                <button key={o} className={"chip"+(dayOffset===o?" active":"")}
                  onClick={()=>setDayOffset(o)}>
                  {o===0?"Today":o>0?"+"+o+"d":o+"d"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="conv-zones">
          {zones.map(zid=>{
            const c = CITIES.find(x=>x.id===zid);
            // local hour in this zone
            const localH = (utcHour + c.off + 24*3) % 24;
            const hours = [...Array(24)].map((_,i)=>{
              const hr = (i);
              const isNow = Math.floor(localH)===hr;
              const isWork = hr>=9 && hr<17;
              const isSleep = hr<7 || hr>=22;
              return { hr, isNow, cls: isNow?"now":(isSleep?"sleep":(isWork?"work":"")) };
            });
            return (
              <div key={zid} className="zone">
                <div>
                  <div className="name">{c.name}</div>
                  <div className="sub">UTC{c.off>=0?"+":""}{c.off} · {c.cc}</div>
                </div>
                <div>
                  <div className="hours">
                    {hours.map(h=>(
                      <div key={h.hr} className={"hour "+h.cls} title={pad(h.hr)+":00"}/>
                    ))}
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", marginTop:"4px",
                    fontFamily:"var(--f-mono)", fontSize:"9.5px", color:"var(--ink-4)"}}>
                    <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>12a</span>
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                  <div className="t">{fmtHour(localH)}</div>
                  {zid!==baseZone && (
                    <button onClick={()=>setZones(zones.filter(z=>z!==zid))}
                      style={{background:"none", border:"none", color:"var(--ink-4)", cursor:"pointer", fontSize:"18px"}}>×</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {available.length>0 && (
          <div style={{marginTop:"16px", display:"flex", gap:"8px", flexWrap:"wrap"}}>
            <div className="h-eyebrow" style={{alignSelf:"center", marginRight:"6px"}}>Add:</div>
            {available.map(c=>(
              <button key={c.id} className="chip" onClick={()=>setZones([...zones, c.id])}>+ {c.name}</button>
            ))}
          </div>
        )}

        <div style={{marginTop:"28px", display:"grid", gridTemplateColumns:"auto auto auto", gap:"18px",
          padding:"16px 20px", background:"var(--paper-2)", borderRadius:"10px",
          fontSize:"12px", color:"var(--ink-3)"}}>
          <span><b style={{color:"#2b6b3e"}}>■</b> Work hours (9–5 local)</span>
          <span><b style={{color:"#1a1e28"}}>■</b> Likely asleep (10p–7a)</span>
          <span><b style={{color:"var(--accent)"}}>■</b> Current selected hour</span>
        </div>
      </div>
    </div>
  );
}
window.Converter = Converter;
