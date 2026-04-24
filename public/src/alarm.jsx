/* ---------- Alarm ---------- */
function Alarm(){
  const now = useTick(1000);
  const [alarms, setAlarms] = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem("t24_alarms")||"null") || [
      { id:1, time:"06:30", label:"Morning run", days:["Mo","Tu","We","Th","Fr"], on:true },
      { id:2, time:"13:00", label:"Lunch break", days:["Mo","Tu","We","Th","Fr"], on:false },
      { id:3, time:"22:00", label:"Wind down", days:["Mo","Tu","We","Th","Fr","Sa","Su"], on:true },
    ];}catch(e){ return [] }
  });
  React.useEffect(()=>{ localStorage.setItem("t24_alarms", JSON.stringify(alarms)) },[alarms]);

  const [newTime, setNewTime] = React.useState("07:00");
  const [newLabel, setNewLabel] = React.useState("");

  const add = () => {
    if(!newTime) return;
    setAlarms([{ id:Date.now(), time:newTime, label:newLabel||"Alarm",
      days:["Mo","Tu","We","Th","Fr"], on:true }, ...alarms]);
    setNewLabel("");
  };
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const toggle = id => setAlarms(alarms.map(a=>a.id===id?{...a,on:!a.on}:a));
  const toggleDay = (id, d) => setAlarms(alarms.map(a=>{
    if(a.id!==id) return a;
    const has = a.days.includes(d);
    return {...a, days: has?a.days.filter(x=>x!==d):[...a.days, d]};
  }));

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Alarm</div>
        <h1>Quiet bells for <em>fixed moments.</em></h1>
        <p>Set recurring alarms that stay with you in this browser. Great for a morning ritual or a gentle work-hours reminder.</p>
      </div>

      <div className="glass" style={{padding:0, overflow:"hidden"}}>
        <div style={{padding:"20px 24px", borderBottom:"1px solid var(--rule)",
          display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap"}}>
          <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)}
            style={{padding:"10px 14px", border:"1px solid var(--rule-2)",
              borderRadius:"10px", fontFamily:"var(--f-mono)", fontSize:"18px", background:"var(--paper)"}}/>
          <input value={newLabel} onChange={e=>setNewLabel(e.target.value)}
            placeholder="Label (optional)"
            style={{flex:1, minWidth:"200px", padding:"12px 14px", border:"1px solid var(--rule-2)",
              borderRadius:"10px", fontFamily:"var(--f-display)", fontSize:"17px", background:"var(--paper)", outline:"none"}}/>
          <button className="btn" onClick={add}><IconPlus size={14}/> Add alarm</button>
        </div>

        {alarms.map(a=>(
          <div key={a.id} className={"alarm-row"+(a.on?"":" off")}>
            <div className="t">{a.time}</div>
            <div>
              <div className="lbl">{a.label}</div>
              <div className="rep">
                {days.map(d=>(
                  <span key={d} className={a.days.includes(d)?"on":""}
                    onClick={()=>toggleDay(a.id,d)} style={{cursor:"pointer"}}>{d[0]}</span>
                ))}
              </div>
            </div>
            <button className={"switch"+(a.on?" on":"")} onClick={()=>toggle(a.id)}/>
            <button onClick={()=>setAlarms(alarms.filter(x=>x.id!==a.id))}
              style={{background:"none", border:"none", color:"var(--ink-4)", cursor:"pointer", fontSize:"20px"}}>×</button>
          </div>
        ))}
      </div>

      <div style={{marginTop:"24px", padding:"18px 22px", border:"1px solid var(--rule)",
        borderRadius:"10px", background:"var(--paper)", fontSize:"13px", color:"var(--ink-3)", lineHeight:1.6}}>
        <b style={{color:"var(--ink)", fontFamily:"var(--f-display)", fontSize:"15px"}}>A note on alarms in the browser.</b><br/>
        Browser alarms only ring while this tab is open. For critical wake-ups, rely on your phone's native alarm. These are best for in-workday reminders — stand up, drink water, leave for the meeting.
      </div>
    </div>
  );
}
window.Alarm = Alarm;
