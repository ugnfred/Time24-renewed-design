/* ---------- Calendar ---------- */
function Calendar(){
  const [cursor, setCursor] = React.useState(new Date());
  const [events, setEvents] = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem("t24_events")||"null") || [
      { id:1, date: isoDay(new Date()), title:"Team standup", color:"" },
      { id:2, date: isoDay(addDays(new Date(),1)), title:"Dentist", color:"b" },
      { id:3, date: isoDay(addDays(new Date(),3)), title:"Yoga", color:"" },
      { id:4, date: isoDay(addDays(new Date(),5)), title:"Flight DEL→BOM", color:"r" },
      { id:5, date: isoDay(addDays(new Date(),8)), title:"Mom's birthday", color:"b" },
    ];}catch(e){ return [] }
  });
  function isoDay(d){ return d.toISOString().slice(0,10) }
  function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }

  React.useEffect(()=>{ localStorage.setItem("t24_events", JSON.stringify(events)) },[events]);

  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y,m,1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const prevDays = new Date(y,m,0).getDate();
  const cells = [];
  for(let i=0;i<startDow;i++) cells.push({ d: prevDays-startDow+1+i, out:true });
  for(let i=1;i<=daysInMonth;i++) cells.push({ d:i, out:false, date:new Date(y,m,i) });
  while(cells.length<42) cells.push({ d: cells.length-startDow-daysInMonth+1, out:true });

  const monthName = cursor.toLocaleString("en-US",{month:"long"});
  const today = new Date();

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Calendar</div>
        <h1>Plan the month in <em>one glance.</em></h1>
        <p>A calendar that respects the Indian Standard Time grid but works for any zone. Quick add events, color-tag them, and they persist on this device.</p>
      </div>

      <div className="glass panel">
        <div className="cal-head">
          <h2>{monthName} <em>{y}</em></h2>
          <div style={{display:"flex", gap:"8px"}}>
            <button className="btn ghost sm" onClick={()=>setCursor(new Date(y,m-1,1))}>‹ Prev</button>
            <button className="btn ghost sm" onClick={()=>setCursor(new Date())}>Today</button>
            <button className="btn ghost sm" onClick={()=>setCursor(new Date(y,m+1,1))}>Next ›</button>
          </div>
        </div>
        <div className="cal-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {cells.map((c,i)=>{
            const isToday = !c.out && c.date && c.date.toDateString()===today.toDateString();
            const ds = c.date ? isoDay(c.date) : null;
            const evs = ds ? events.filter(e=>e.date===ds) : [];
            return (
              <div key={i} className={"cal-cell"+(c.out?" out":"")+(isToday?" today":"")}
                onClick={()=>{
                  if(c.out) return;
                  const title = prompt("Event title for "+ds+"?\n(Tip: prefix with ! for red, * for orange)");
                  if(!title) return;
                  let color = "";
                  let t = title.trim();
                  if(t.startsWith("!")){ color="r"; t=t.slice(1).trim(); }
                  else if(t.startsWith("*")){ color="b"; t=t.slice(1).trim(); }
                  setEvents([...events, { id:Date.now(), date:ds, title:t, color }]);
                }}>
                <div className="d">{c.d}</div>
                {evs.slice(0,3).map(e=>(
                  <div key={e.id} className={"evt "+(e.color||"")}
                    onClick={(ev)=>{
                      ev.stopPropagation();
                      if(confirm("Delete \""+e.title+"\"?")) setEvents(events.filter(x=>x.id!==e.id));
                    }}
                    title="Click to delete">{e.title}</div>
                ))}
                {evs.length>3 && <div style={{fontSize:"10px", color:"var(--ink-4)", fontFamily:"var(--f-mono)"}}>+{evs.length-3} more</div>}
              </div>
            );
          })}
        </div>
        <div className="mono" style={{marginTop:"16px", fontSize:"11px", color:"var(--ink-4)", letterSpacing:"0.1em", textTransform:"uppercase"}}>
          Click any day to add an event. Stored on this device only.
        </div>
      </div>
    </div>
  );
}
window.Calendar = Calendar;
