/* ---------- App shell ---------- */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "displayFont": "Fraunces",
  "bodyFont": "Inter",
  "accent": "#6ef3c1"
}/*EDITMODE-END*/;

const DISPLAY_FONTS = [
  "Fraunces","Instrument Serif","Playfair Display","Cormorant Garamond",
  "Crimson Text","Merriweather","Georgia","Palatino","Times New Roman"
];
const BODY_FONTS = [
  "Inter","DM Sans","Work Sans","Lato","Raleway","Ubuntu","Josefin Sans",
  "system-ui","Segoe UI","Arial","Trebuchet MS"
];
const ACCENTS = ["#6ef3c1","#ffcb6b","#ff7c9d","#8aa6ff","#c9b3ff","#4ec3ff"];

function loadGoogleFont(family){
  if(!family) return;
  const id = "gf-" + family.replace(/\s+/g,"-");
  if(document.getElementById(id)) return;
  // Only attempt for names that look like web fonts (skip system stacks)
  if(/^(system-ui|-apple-system|Segoe UI|Arial|Georgia|Palatino|Times New Roman|Trebuchet MS|Courier New)$/i.test(family)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g,"+")}:ital,wght@0,300..700;1,400&display=swap`;
  document.head.appendChild(link);
}

function App(){
  const [view, setView] = React.useState(()=>localStorage.getItem("t24_view")||"clock");
  const now = useTick(1000);

  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  // Apply tweaks to CSS vars
  React.useEffect(()=>{
    loadGoogleFont(tweaks.displayFont);
    loadGoogleFont(tweaks.bodyFont);
    const root = document.documentElement;
    root.style.setProperty("--f-display", `"${tweaks.displayFont}", Georgia, serif`);
    root.style.setProperty("--f-body", `"${tweaks.bodyFont}", system-ui, sans-serif`);
    root.style.setProperty("--accent", tweaks.accent);
  },[tweaks]);

  // Tweaks host protocol
  React.useEffect(()=>{
    const onMsg = (e) => {
      const d = e.data || {};
      if(d.type === "__activate_edit_mode") setEditMode(true);
      else if(d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({type:"__edit_mode_available"}, "*");
    return () => window.removeEventListener("message", onMsg);
  },[]);

  const updateTweak = (k,v) => {
    setTweaks(t => {
      const next = { ...t, [k]: v };
      window.parent.postMessage({type:"__edit_mode_set_keys", edits:{[k]:v}}, "*");
      return next;
    });
  };

  React.useEffect(()=>{ localStorage.setItem("t24_view", view) },[view]);

  // Keyboard shortcuts 1-7
  React.useEffect(()=>{
    const h = (e) => {
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT") return;
      const keys = {"1":"clock","2":"stopwatch","3":"timer","4":"tasks","5":"calendar","6":"converter","7":"alarm","8":"developer","9":"guides"};
      if(keys[e.key]) setView(keys[e.key]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  },[]);

  const nav = [
    { id:"clock",     label:"World Clock",  icon: <IconClock/>, k:"1" },
    { id:"stopwatch", label:"Stopwatch",    icon: <IconStop/>,  k:"2" },
    { id:"timer",     label:"Timer",        icon: <IconTimer/>, k:"3" },
    { id:"tasks",     label:"Tasks",        icon: <IconTask/>,  k:"4" },
    { id:"calendar",  label:"Calendar",     icon: <IconCal/>,   k:"5" },
    { id:"converter", label:"Converter",    icon: <IconConv/>,  k:"6" },
    { id:"alarm",     label:"Alarm",        icon: <IconBell/>,  k:"7" },
    { id:"developer", label:"Developer",    icon: <IconDev/>,   k:"8" },
  ];
  const crumbMap = {
    clock:"World Clock", stopwatch:"Stopwatch", timer:"Timer",
    tasks:"Tasks", calendar:"Calendar", converter:"Converter", alarm:"Alarm",
    developer:"Developer", guides:"Guides"
  };

  const istNow = formatTimeInTz(now, "Asia/Kolkata", false, true);

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <div className="brand-mark">24</div>
          <div>
            <div className="brand-name">Time<em>24</em></div>
            <div className="brand-sub">Est. IST · 05:30</div>
          </div>
        </div>

        <div className="nav">
          <div className="nav-label">Tools</div>
          {nav.map(n=>(
            <button key={n.id} className="nav-item"
              aria-current={view===n.id}
              onClick={()=>setView(n.id)}
              data-screen-label={n.label}>
              {n.icon} {n.label}
              <span className="nk">{n.k}</span>
            </button>
          ))}
          <div className="nav-label">Reading</div>
          <button className="nav-item" aria-current={view==="guides"}
            onClick={()=>setView("guides")}>
            <IconBook/> Guides <span className="nk">9</span>
          </button>
        </div>

        <div className="side-foot">
          <div className="pill">
            <span className="dot"/> IST · {istNow}
          </div>
          <div style={{fontSize:"11px", color:"var(--ink-4)", letterSpacing:"0.04em", lineHeight:1.5}}>
            No ads, no sign-up, no tracking pixels. Your data lives on your device.
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            Time24 <span style={{color:"var(--ink-4)"}}>›</span> <b>{crumbMap[view]}</b>
          </div>
          <div className="topbar-spacer"/>
          <div className="top-actions">
            <button className="toggle" title="Press number keys to switch views"
              style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                padding:"8px 14px", borderRadius:"999px",
                background:"linear-gradient(135deg, rgba(110,243,193,0.18), rgba(78,195,255,0.12))",
                border:"1px solid rgba(110,243,193,0.4)",
                color:"#d8fff1", cursor:"pointer",
                backdropFilter:"blur(8px)",
                boxShadow:"0 0 16px rgba(110,243,193,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:"5px",
                fontFamily:"var(--f-mono)", fontSize:"11px",
                color:"#d8fff1", letterSpacing:"0.1em", fontWeight:600
              }}>
                <kbd style={{
                  background:"rgba(255,255,255,0.12)", padding:"1px 6px",
                  borderRadius:"4px", border:"1px solid rgba(255,255,255,0.18)",
                  fontSize:"10px", color:"#fff"
                }}>1–9</kbd>
                switch view
              </span>
            </button>
            <div className="mono" style={{fontSize:"11.5px", color:"var(--ink-3)"}}>
              {formatTimeInTz(now,"UTC",false,true)} UTC
            </div>
          </div>
        </div>

        <div className="view">
          {view==="clock" && <Clock/>}
          {view==="stopwatch" && <Stopwatch/>}
          {view==="timer" && <Timer/>}
          {view==="tasks" && <Tasks/>}
          {view==="calendar" && <Calendar/>}
          {view==="converter" && <Converter/>}
          {view==="alarm" && <Alarm/>}
          {view==="developer" && <Developer/>}
          {view==="guides" && (
            <div>
              <div className="section-intro">
                <div className="h-eyebrow">Guides · Time24 journal</div>
                <h1>Field notes on <em>time.</em></h1>
                <p>Long-form writing on timezones, clocks, calendars, and the small decisions we all make about when things happen.</p>
              </div>
              <GuidesRail/>
              <LongFormArticle/>
            </div>
          )}

          <div className="foot">
            <div>
              <h4>Time24</h4>
              <div className="lead">The editorial world clock. Exact time in every zone, with field notes on how time actually works.</div>
            </div>
            <div>
              <h4>Tools</h4>
              <ul>
                <li><a onClick={()=>setView("clock")} style={{cursor:"pointer"}}>World Clock</a></li>
                <li><a onClick={()=>setView("converter")} style={{cursor:"pointer"}}>Timezone Converter</a></li>
                <li><a onClick={()=>setView("stopwatch")} style={{cursor:"pointer"}}>Stopwatch</a></li>
                <li><a onClick={()=>setView("timer")} style={{cursor:"pointer"}}>Timer · Pomodoro</a></li>
                <li><a onClick={()=>setView("alarm")} style={{cursor:"pointer"}}>Alarm</a></li>
                <li><a onClick={()=>setView("developer")} style={{cursor:"pointer"}}>Developer · Timestamps</a></li>
              </ul>
            </div>
            <div>
              <h4>Plan</h4>
              <ul>
                <li><a onClick={()=>setView("tasks")} style={{cursor:"pointer"}}>Tasks</a></li>
                <li><a onClick={()=>setView("calendar")} style={{cursor:"pointer"}}>Calendar</a></li>
                <li><a onClick={()=>setView("guides")} style={{cursor:"pointer"}}>Guides</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="/about.html">About</a></li>
                <li><a href="/contact.html">Contact</a></li>
                <li><a href="/privacy-policy.html">Privacy</a></li>
                <li><a href="/terms.html">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-base">
            <div>© 2026 Time24 — Exact time, every zone</div>
            <div>Made for the global, hosted from Delhi · IST +05:30</div>
          </div>
        </div>
      </main>

      <div className="kbd-tip">
        <span><kbd>1–9</kbd>switch</span>
        <span><kbd>?</kbd>help</span>
      </div>

      {editMode && (
        <div style={{
          position:"fixed", right:"20px", bottom:"20px", width:"280px",
          background:"rgba(15,18,40,0.92)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)", borderRadius:"14px",
          padding:"18px", zIndex:9999, color:"var(--ink)",
          fontFamily:"var(--f-body)", fontSize:"13px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)"
        }}>
          <div style={{fontFamily:"var(--f-mono)", fontSize:"10px", letterSpacing:"0.2em",
            textTransform:"uppercase", color:"var(--ink-3)", marginBottom:"14px"}}>
            Tweaks
          </div>

          <div style={{marginBottom:"14px"}}>
            <label style={{display:"block", marginBottom:"6px", color:"var(--ink-2)"}}>Display font</label>
            <select value={tweaks.displayFont}
              onChange={e=>updateTweak("displayFont", e.target.value)}
              style={{width:"100%", background:"rgba(255,255,255,0.06)", color:"var(--ink)",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px",
                padding:"8px 10px", fontFamily:"var(--f-body)", fontSize:"13px"}}>
              {DISPLAY_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div style={{marginBottom:"14px"}}>
            <label style={{display:"block", marginBottom:"6px", color:"var(--ink-2)"}}>Body font</label>
            <select value={tweaks.bodyFont}
              onChange={e=>updateTweak("bodyFont", e.target.value)}
              style={{width:"100%", background:"rgba(255,255,255,0.06)", color:"var(--ink)",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px",
                padding:"8px 10px", fontFamily:"var(--f-body)", fontSize:"13px"}}>
              {BODY_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label style={{display:"block", marginBottom:"8px", color:"var(--ink-2)"}}>Accent</label>
            <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}}>
              {ACCENTS.map(c=>(
                <button key={c} onClick={()=>updateTweak("accent",c)}
                  style={{
                    width:"28px", height:"28px", borderRadius:"50%",
                    background:c, border: tweaks.accent===c?"2px solid #fff":"1px solid rgba(255,255,255,0.2)",
                    cursor:"pointer", padding:0
                  }}
                  aria-label={c}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
