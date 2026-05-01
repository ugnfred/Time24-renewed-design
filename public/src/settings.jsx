/* ---------- Settings panel · personalization without signup ---------- */
/* All state lives in localStorage. Survives reloads, never leaves the device. */

const SETTINGS_DEFAULTS = {
  homeTimezone: "auto",   // "auto" = browser-detected, else IANA name
  theme: "auto",          // auto | dark | light
  timeFormat: "24",       // 12 | 24
  weekStart: "1",         // 0 = Sunday, 1 = Monday
  showSeconds: true,
  greetingByName: ""      // optional display name
};

function loadSettings(){
  try {
    const s = JSON.parse(localStorage.getItem("t24_settings") || "{}");
    return { ...SETTINGS_DEFAULTS, ...s };
  } catch { return SETTINGS_DEFAULTS; }
}
function saveSettings(s){ localStorage.setItem("t24_settings", JSON.stringify(s)); }

function detectTz(){
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
  catch { return "UTC"; }
}

const POPULAR_TZS = [
  "Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo","Asia/Shanghai",
  "Europe/London","Europe/Berlin","Europe/Paris","Africa/Lagos",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "America/Sao_Paulo","Australia/Sydney","Pacific/Auckland","UTC"
];

function applySettingsToDOM(s){
  const root = document.documentElement;
  // theme
  let resolved = s.theme;
  if(s.theme === "auto"){
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    resolved = prefersLight ? "light" : "dark";
  }
  if(resolved === "dark"){
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", "light");
  }
  // update the meta theme-color so the browser chrome matches
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", resolved === "light" ? "#f4f1ea" : "#070814");

  // expose globally for clocks/converter
  window.__T24 = window.__T24 || {};
  window.__T24.settings = s;
  window.__T24.homeTz = s.homeTimezone === "auto" ? detectTz() : s.homeTimezone;
  window.__T24.is24h = s.timeFormat === "24";
  window.__T24.showSeconds = !!s.showSeconds;
  window.__T24.weekStart = parseInt(s.weekStart, 10) || 0;
  window.__T24.resolvedTheme = resolved;
  // notify listeners
  window.dispatchEvent(new CustomEvent("t24-settings-changed", { detail: s }));
}

// React to OS-level theme changes when user is in "auto"
if(typeof window !== "undefined" && window.matchMedia){
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const handler = () => {
    const cur = (window.__T24 && window.__T24.settings) || loadSettings();
    if(cur.theme === "auto") applySettingsToDOM(cur);
  };
  if(mq.addEventListener) mq.addEventListener("change", handler);
  else if(mq.addListener) mq.addListener(handler);
}

function useSettings(){
  const [s, setS] = React.useState(loadSettings);
  React.useEffect(()=>{ applySettingsToDOM(s); saveSettings(s); }, [s]);
  return [s, (patch)=>setS(prev => ({ ...prev, ...patch }))];
}

function SettingsPanel({ open, onClose }){
  const [s, setS] = useSettings();
  React.useEffect(()=>{
    if(!open) return;
    const onKey = (e) => { if(e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if(!open) return null;
  const detected = detectTz();

  return (
    <div onClick={onClose}
      style={{position:"fixed", inset:0, background:"rgba(3,5,15,0.7)",
        backdropFilter:"blur(12px)", zIndex:9997, display:"flex",
        justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()}
        className="glass" style={{width:"min(420px, 100vw)", height:"100vh",
          padding:"30px 28px", overflowY:"auto", borderRadius:0,
          borderLeft:"1px solid var(--stroke-2)"}}>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
          <div>
            <div className="h-eyebrow">Personalize</div>
            <h2 style={{fontFamily:"var(--f-display)", fontSize:"32px",
              letterSpacing:"-0.02em", margin:"4px 0 0", color:"var(--ink)"}}>
              Settings
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{width:"36px", height:"36px", borderRadius:"50%",
              background:"rgba(255,255,255,0.06)", border:"1px solid var(--stroke-2)",
              color:"var(--ink)", cursor:"pointer", fontSize:"18px"}}>×</button>
        </div>

        <div style={{display:"grid", gap:"24px"}}>

          <Field label="Display name" hint="Used for the greeting on the home screen.">
            <input type="text" value={s.greetingByName}
              onChange={e=>setS({greetingByName: e.target.value})}
              placeholder="(optional) e.g. Sam"
              style={inputStyle}/>
          </Field>

          <Field label="Home timezone" hint={`Detected: ${detected}`}>
            <select value={s.homeTimezone}
              onChange={e=>setS({homeTimezone: e.target.value})}
              style={inputStyle}>
              <option value="auto">Auto-detect ({detected})</option>
              {POPULAR_TZS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>

          <Field label="Theme">
            <SegRow value={s.theme} onChange={v=>setS({theme:v})}
              options={[
                {v:"auto", l:"Auto"},
                {v:"dark", l:"Dark"},
                {v:"light", l:"Light"}
              ]}/>
          </Field>

          <Field label="Time format">
            <SegRow value={s.timeFormat} onChange={v=>setS({timeFormat:v})}
              options={[
                {v:"24", l:"24-hour"},
                {v:"12", l:"12-hour"}
              ]}/>
          </Field>

          <Field label="Week starts on">
            <SegRow value={s.weekStart} onChange={v=>setS({weekStart:v})}
              options={[
                {v:"1", l:"Monday"},
                {v:"0", l:"Sunday"}
              ]}/>
          </Field>

          <Field label="Show seconds in clocks">
            <SegRow value={s.showSeconds ? "y" : "n"}
              onChange={v=>setS({showSeconds: v==="y"})}
              options={[
                {v:"y", l:"Show"},
                {v:"n", l:"Hide"}
              ]}/>
          </Field>

          <div style={{padding:"16px", background:"var(--paper)",
            border:"1px solid var(--stroke)", borderRadius:"10px"}}>
            <div className="mono" style={{fontSize:"10.5px", letterSpacing:"0.1em",
              textTransform:"uppercase", color:"var(--ink-4)", marginBottom:"8px"}}>
              Privacy
            </div>
            <div style={{fontSize:"13px", color:"var(--ink-2)", lineHeight:1.55}}>
              All settings are stored only in your browser. We use Google Analytics to understand aggregate traffic and Google AdSense to display ads — these may set cookies. No account, no signup, no email required.
            </div>
            <div style={{marginTop:"12px", display:"flex", gap:"10px"}}>
              <button className="btn" onClick={()=>{
                if(confirm("Clear all local data (settings, alarms, tasks, events, theme)?")){
                  localStorage.clear();
                  location.reload();
                }
              }}>Clear all local data</button>
            </div>
          </div>

          <div style={{fontSize:"11px", color:"var(--ink-4)",
            fontFamily:"var(--f-mono)", letterSpacing:"0.08em",
            paddingTop:"16px", borderTop:"1px solid var(--stroke)"}}>
            Settings save automatically · Press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%",
  background:"rgba(255,255,255,0.04)",
  color:"var(--ink)",
  border:"1px solid var(--stroke-2)",
  borderRadius:"8px",
  padding:"10px 12px",
  fontFamily:"var(--f-body)",
  fontSize:"14px"
};

function Field({ label, hint, children }){
  return (
    <div>
      <label style={{display:"block", fontFamily:"var(--f-mono)",
        fontSize:"10.5px", letterSpacing:"0.12em",
        textTransform:"uppercase", color:"var(--ink-3)",
        marginBottom:"8px"}}>{label}</label>
      {children}
      {hint && <div style={{fontSize:"11.5px", color:"var(--ink-4)",
        marginTop:"6px", lineHeight:1.5}}>{hint}</div>}
    </div>
  );
}

function SegRow({ value, onChange, options }){
  return (
    <div style={{display:"flex", gap:"6px",
      background:"var(--paper)", padding:"4px",
      borderRadius:"10px", border:"1px solid var(--stroke)"}}>
      {options.map(o=>(
        <button key={o.v} onClick={()=>onChange(o.v)}
          style={{
            flex:1, padding:"8px 12px", borderRadius:"7px",
            border:"none", cursor:"pointer",
            fontFamily:"var(--f-body)", fontSize:"13px",
            background: String(value)===String(o.v) ? "var(--accent)" : "transparent",
            color: String(value)===String(o.v) ? "#0a0c1c" : "var(--ink-2)",
            fontWeight: String(value)===String(o.v) ? 600 : 400,
            transition:"all 0.15s"
          }}>{o.l}</button>
      ))}
    </div>
  );
}

// Apply settings on first load (before React mounts) so initial paint is right
applySettingsToDOM(loadSettings());

window.SettingsPanel = SettingsPanel;
window.useSettings = useSettings;
window.t24LoadSettings = loadSettings;
