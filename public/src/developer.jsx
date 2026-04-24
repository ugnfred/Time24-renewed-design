/* ---------- Developer: live timestamps + format reference ---------- */

function Developer(){
  const now = useTick(1000);
  const [copied, setCopied] = React.useState("");

  const unix = Math.floor(now.getTime()/1000);
  const unixMs = now.getTime();
  const iso  = now.toISOString();
  const rfc  = now.toUTCString();
  const utc  = now.toISOString().replace("T"," ").slice(0,19)+" UTC";
  const local = now.toString();
  const year = now.getUTCFullYear();
  const doy = getDayOfYear(now);
  const wk = getWeekNumber(now);

  const copy = (key,val) => {
    navigator.clipboard?.writeText(val);
    setCopied(key); setTimeout(()=>setCopied(""), 1200);
  };

  const formats = [
    { k:"unix",     label:"Unix seconds",       val:String(unix),   hint:"seconds since 1970-01-01 00:00:00 UTC" },
    { k:"unixms",   label:"Unix milliseconds",  val:String(unixMs), hint:"used by JavaScript Date, Java, etc." },
    { k:"iso",      label:"ISO 8601",           val:iso,            hint:"machine-sortable, timezone-explicit" },
    { k:"rfc",      label:"RFC 2822",           val:rfc,            hint:"email headers, HTTP Date" },
    { k:"utc",      label:"UTC (readable)",     val:utc,            hint:"human-facing UTC" },
    { k:"local",    label:"Local (runtime)",    val:local,          hint:"JavaScript toString in your timezone" },
  ];

  return (
    <div>
      <div className="section-intro">
        <div className="h-eyebrow">Developer · live timestamps</div>
        <h1>Every timestamp format, <em>live.</em></h1>
        <p>Copy-ready representations of the current moment in every format you're likely to need — Unix seconds and milliseconds, ISO 8601, RFC 2822, and ordinal calendar values. Updates every second.</p>
      </div>

      <div className="formats" style={{gridTemplateColumns:"repeat(2, 1fr)", gap:"16px"}}>
        {formats.map(f => (
          <div key={f.k} className="glass format" style={{padding:"22px 24px"}}>
            <div className="k">{f.label}</div>
            <div className="v" style={{marginTop:"8px", fontSize:"17px"}}>{f.val}</div>
            <div className="mono" style={{fontSize:"11px", color:"var(--ink-4)",
              letterSpacing:"0.06em", marginTop:"4px"}}>{f.hint}</div>
            <button className="copy" onClick={()=>copy(f.k, f.val)}>
              {copied===f.k ? "Copied ✓" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <div style={{marginTop:"40px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px"}}>
        <div className="glass" style={{padding:"22px 24px"}}>
          <div className="k mono" style={{fontSize:"10px", letterSpacing:"0.16em",
            textTransform:"uppercase", color:"var(--ink-4)"}}>Year progress</div>
          <div style={{fontFamily:"var(--f-display)", fontSize:"40px",
            letterSpacing:"-0.02em", marginTop:"8px",
            fontVariantNumeric:"tabular-nums"}}>
            {yearProgress(now).toFixed(2)}%
          </div>
          <div className="mono" style={{fontSize:"12px", color:"var(--ink-3)", marginTop:"4px"}}>
            of {year}
          </div>
        </div>
        <div className="glass" style={{padding:"22px 24px"}}>
          <div className="k mono" style={{fontSize:"10px", letterSpacing:"0.16em",
            textTransform:"uppercase", color:"var(--ink-4)"}}>Day of year</div>
          <div style={{fontFamily:"var(--f-display)", fontSize:"40px",
            letterSpacing:"-0.02em", marginTop:"8px",
            fontVariantNumeric:"tabular-nums"}}>
            {doy}
          </div>
          <div className="mono" style={{fontSize:"12px", color:"var(--ink-3)", marginTop:"4px"}}>
            ordinal date
          </div>
        </div>
        <div className="glass" style={{padding:"22px 24px"}}>
          <div className="k mono" style={{fontSize:"10px", letterSpacing:"0.16em",
            textTransform:"uppercase", color:"var(--ink-4)"}}>ISO Week</div>
          <div style={{fontFamily:"var(--f-display)", fontSize:"40px",
            letterSpacing:"-0.02em", marginTop:"8px",
            fontVariantNumeric:"tabular-nums"}}>
            W{pad(wk)}
          </div>
          <div className="mono" style={{fontSize:"12px", color:"var(--ink-3)", marginTop:"4px"}}>
            ISO 8601 week
          </div>
        </div>
      </div>

      <div className="glass" style={{marginTop:"40px", padding:"32px"}}>
        <div className="h-eyebrow">Reference</div>
        <div style={{fontFamily:"var(--f-display)", fontSize:"28px",
          letterSpacing:"-0.02em", marginTop:"6px", marginBottom:"20px"}}>
          When to use each format
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px"}}>
          <div>
            <div className="mono" style={{fontSize:"11px", color:"var(--accent)",
              letterSpacing:"0.12em", textTransform:"uppercase"}}>Unix time</div>
            <p style={{color:"var(--ink-2)", fontSize:"14px", lineHeight:1.6, marginTop:"6px"}}>
              Best for arithmetic: subtract two timestamps and you get an interval in seconds. The 32-bit signed version overflows in 2038; use 64-bit.
            </p>
          </div>
          <div>
            <div className="mono" style={{fontSize:"11px", color:"var(--accent)",
              letterSpacing:"0.12em", textTransform:"uppercase"}}>ISO 8601</div>
            <p style={{color:"var(--ink-2)", fontSize:"14px", lineHeight:1.6, marginTop:"6px"}}>
              Human-readable and machine-sortable. Use in logs, databases, APIs. Always include the offset (<span className="mono">+05:30</span>).
            </p>
          </div>
          <div>
            <div className="mono" style={{fontSize:"11px", color:"var(--accent)",
              letterSpacing:"0.12em", textTransform:"uppercase"}}>RFC 2822</div>
            <p style={{color:"var(--ink-2)", fontSize:"14px", lineHeight:1.6, marginTop:"6px"}}>
              Email headers, HTTP <span className="mono">Date</span> headers, legacy systems. Avoid in new code.
            </p>
          </div>
          <div>
            <div className="mono" style={{fontSize:"11px", color:"var(--accent)",
              letterSpacing:"0.12em", textTransform:"uppercase"}}>Local string</div>
            <p style={{color:"var(--ink-2)", fontSize:"14px", lineHeight:1.6, marginTop:"6px"}}>
              Useful for debugging. Never store — it depends on the runtime's timezone and locale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Developer = Developer;
