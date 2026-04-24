/* ---------- Tasks ---------- */
function Tasks(){
  const [tasks, setTasks] = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem("t24_tasks")||"null") || [
      { id:1, title:"Ship the Q2 analytics review deck", cat:"Meeting", when:"Today · 14:00", done:false },
      { id:2, title:"Review converter tests across DST edge cases", cat:"Dev", when:"Today · EOD", done:false },
      { id:3, title:"30-minute run before sunset", cat:"Fitness", when:"Today · 18:30", done:false },
      { id:4, title:"Draft IST explainer for the guide section", cat:"Writing", when:"Tomorrow", done:false },
      { id:5, title:"Respond to Priya about the launch timeline", cat:"General", when:"Yesterday", done:true },
    ];}catch(e){ return [] }
  });
  const [input, setInput] = React.useState("");
  const [cat, setCat] = React.useState("General");

  React.useEffect(()=>{ localStorage.setItem("t24_tasks", JSON.stringify(tasks)) },[tasks]);

  const add = () => {
    if(!input.trim()) return;
    setTasks([{ id:Date.now(), title:input.trim(), cat, when:"Today", done:false }, ...tasks]);
    setInput("");
  };
  const toggle = (id) => setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del = (id) => setTasks(tasks.filter(t=>t.id!==id));

  const open = tasks.filter(t=>!t.done).length;

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Tasks</div>
        <h1>A clean list, <em>kept locally.</em></h1>
        <p>A minimal task list that lives on your device. No sign-up, no sync, no surveillance. Perfect for today's intentions.</p>
      </div>

      <div className="glass" style={{padding:0, overflow:"hidden"}}>
        <div className="add-task">
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") add() }}
            placeholder="What do you want to get done?"/>
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            <option>General</option><option>Meeting</option><option>Fitness</option>
            <option>Writing</option><option>Dev</option><option>Errand</option>
          </select>
          <button className="btn" onClick={add}><IconPlus size={14}/> Add</button>
        </div>
        <div style={{padding:"14px 20px", display:"flex", justifyContent:"space-between",
          borderBottom:"1px solid var(--rule)", background:"var(--paper-2)"}}>
          <div className="h-eyebrow">{open} open · {tasks.length-open} done</div>
          <div className="mono" style={{fontSize:"11px", color:"var(--ink-4)"}}>Saved locally</div>
        </div>
        {tasks.map(t=>(
          <div key={t.id} className={"task"+(t.done?" done":"")}>
            <button className={"check"+(t.done?" on":"")} onClick={()=>toggle(t.id)}>
              {t.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
            <div className="title">{t.title}</div>
            <div className="cat">{t.cat}</div>
            <div className="when">{t.when} <span onClick={()=>del(t.id)}
              style={{marginLeft:12, cursor:"pointer", color:"var(--ink-4)"}}>×</span></div>
          </div>
        ))}
        {tasks.length===0 && (
          <div style={{padding:"60px", textAlign:"center", color:"var(--ink-4)"}}>
            <div className="h-eyebrow">No tasks yet</div>
            <div style={{fontFamily:"var(--f-display)", fontSize:"24px", marginTop:"8px"}}>
              A quiet list is a kind of peace.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.Tasks = Tasks;
