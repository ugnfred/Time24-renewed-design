/* ---------- Analog clock face ---------- */

function AnalogClock({ hh, mm, ss, size = 160 }){
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);

  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const cx = size / 2;
  const r  = size / 2 - 6;

  const hand = (deg, len, width, color, glow) => {
    const rad = (deg - 90) * Math.PI / 180;
    return (
      <line x1={cx} y1={cx}
        x2={cx + Math.cos(rad) * len}
        y2={cx + Math.sin(rad) * len}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        style={glow ? { filter:`drop-shadow(0 0 5px ${color})` } : {}}/>
    );
  };

  const markers = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30 - 90) * Math.PI / 180;
    const major = i % 3 === 0;
    const r1 = r - (major ? 12 : 7);
    return (
      <line key={i}
        x1={cx + Math.cos(rad) * r1} y1={cx + Math.sin(rad) * r1}
        x2={cx + Math.cos(rad) * r}  y2={cx + Math.sin(rad) * r}
        stroke={major ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)"}
        strokeWidth={major ? 2 : 1} strokeLinecap="round"/>
    );
  });

  const tailRad = (secDeg - 90 + 180) * Math.PI / 180;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flex:"0 0 auto"}}>
      <circle cx={cx} cy={cx} r={r}
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <circle cx={cx} cy={cx} r={r - 3}
        fill="none" stroke="rgba(110,243,193,0.07)" strokeWidth="8"/>
      {markers}
      {hand(hourDeg, r * 0.54, 3.5, "rgba(244,246,255,0.92)")}
      {hand(minDeg,  r * 0.77, 2.5, "rgba(244,246,255,0.75)")}
      {hand(secDeg,  r * 0.88, 1.5, "#6ef3c1", true)}
      <line x1={cx} y1={cx}
        x2={cx + Math.cos(tailRad) * r * 0.22}
        y2={cx + Math.sin(tailRad) * r * 0.22}
        stroke="#6ef3c1" strokeWidth="1.5" strokeLinecap="round"
        style={{filter:"drop-shadow(0 0 4px #6ef3c1)"}}/>
      <circle cx={cx} cy={cx} r="5" fill="#6ef3c1"
        style={{filter:"drop-shadow(0 0 8px #6ef3c1)"}}/>
      <circle cx={cx} cy={cx} r="2.5" fill="#070814"/>
    </svg>
  );
}

/* ---------- Clock view with dynamic data ---------- */

function Clock(){
  const now = useTick(1000);
  const userLoc = useUserLocation();
  const t24 = useT24Settings();
  const [activeCity, setActiveCity] = React.useState(()=> t24.homeTz === "Asia/Kolkata" ? "IST" : (CITIES.find(c=>c.tz===t24.homeTz)?.id || "IST"));
  const h12 = t24.h12;
  const [sunData, setSunData] = React.useState(null);
  const [copied, setCopied] = React.useState("");

  const active = CITIES.find(c=>c.id===activeCity);
  const liveOff = utcOffsetHours(active.tz, now);

  // Fetch real sunrise/sunset from sunrise-sunset.org when active city changes
  React.useEffect(()=>{
    let cancelled = false;
    setSunData(null);
    const today = now.toISOString().slice(0,10);
    fetch(`https://api.sunrise-sunset.org/json?lat=${active.lat}&lng=${active.lng}&formatted=0&date=${today}`)
      .then(r=>r.ok?r.json():null)
      .then(d=>{
        if(cancelled || !d || d.status!=="OK") return;
        setSunData({
          rise: new Date(d.results.sunrise),
          set:  new Date(d.results.sunset),
          dayLen: d.results.day_length
        });
      })
      .catch(()=>{});
    return ()=>{ cancelled = true };
  },[activeCity]);

  const doy = getDayOfYear(now);
  const wk  = getWeekNumber(now);
  const yp  = yearProgress(now);

  const tStr = formatTimeInTz(now, active.tz, h12, true);
  const dStr = formatDateInTz(now, active.tz);
  const parts = tStr.split(" ");
  const hms = parts[0];
  const ap  = parts[1] || "";
  const [hh, mm, ss] = hms.split(":");

  const unix = Math.floor(now.getTime()/1000);
  const iso  = now.toISOString();
  const rfc  = now.toUTCString();
  const copy = (key,val) => {
    navigator.clipboard?.writeText(val);
    setCopied(key); setTimeout(()=>setCopied(""), 1200);
  };

  // Sun times (prefer API data, fallback to NOAA calc)
  let riseLocal, setLocal, daylight;
  if(sunData){
    riseLocal = getHourInTz(sunData.rise, active.tz) + sunData.rise.getMinutes()/60;
    setLocal  = getHourInTz(sunData.set,  active.tz) + sunData.set.getMinutes()/60;
    daylight  = sunData.dayLen/3600;
  } else {
    const s = sunTimes(now, active.lat, active.lng);
    riseLocal = hoursToLocal(s.rise, liveOff);
    setLocal  = hoursToLocal(s.set,  liveOff);
    daylight  = (s.rise!=null && s.set!=null) ? ((s.set - s.rise + 24)%24) : null;
  }
  const phase = moonPhase(now);
  const moonX = (phase<0.5 ? phase*2 : (phase-0.5)*-2) * 100;

  const hourLocalActive = getHourInTz(now, active.tz);
  const minNow = parseInt(formatTimeInTz(now, active.tz, false, false).split(":")[1],10)||0;
  const isDayActive = hourLocalActive>=6 && hourLocalActive<18;
  const captionMood = (() => {
    if(hourLocalActive<5) return { a:"Still hours.",    b:"The city is asleep, the servers are awake." };
    if(hourLocalActive<8) return { a:"Early light.",    b:"Sunrise is drawing the day on the horizon." };
    if(hourLocalActive<12)return { a:"Morning pace.",   b:"Most of the world is at their desks." };
    if(hourLocalActive<14)return { a:"High noon.",      b:"The sun is closest to directly overhead." };
    if(hourLocalActive<17)return { a:"Afternoon drift.",b:"Long shadows, warm light, deadlines approaching." };
    if(hourLocalActive<20)return { a:"Golden hour.",    b:"The sun has begun its descent westward." };
    if(hourLocalActive<23)return { a:"Evening settles.",b:"Street lights blink on across the hemisphere." };
    return { a:"Late hours.", b:"Night belongs to the patient." };
  })();

  return (
    <div>
      <div className="clock-hero">
        <div className="glass hero-card">
          <div className="hero-top">
            <div className="hero-locale">{active.name} · {active.tz}</div>
            <div className="hero-date">{dStr}</div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"40px", flex:1, marginTop:"12px"}}>
            <div style={{flex:1, minWidth:0}}>
              <div className="big-time">
                <span>{hh}:{mm}</span>
                <span className="sec blink">:{ss}</span>
                {h12 && ap && <span className="ap">{ap}</span>}
              </div>
              <div className="big-caption">
                <span className="accent">{captionMood.a}</span> {captionMood.b}
              </div>
            </div>
            <AnalogClock hh={hh} mm={mm} ss={ss} size={220}/>
          </div>

          <div className="stat-strip">
            <div className="stat">
              <div className="k">Year · {now.getFullYear()}</div>
              <div className="v">{yp.toFixed(1)}%</div>
              <div className="progress"><i style={{width:yp+"%"}}/></div>
            </div>
            <div className="stat">
              <div className="k">Day of year</div>
              <div className="v">{doy}</div>
              <div className="s">of {new Date(now.getFullYear(),11,31).getDate()===31?365:366}</div>
            </div>
            <div className="stat">
              <div className="k">ISO Week</div>
              <div className="v">W{pad(wk)}</div>
              <div className="s">of 52</div>
            </div>
            <div className="stat">
              <div className="k">UTC offset</div>
              <div className="v">{liveOff>=0?"+":""}{liveOff}</div>
              <div className="s">hours · live</div>
            </div>
          </div>
        </div>

        <div className="glass map-card">
          <div className="map-head">
            <h3>The world, right now</h3>
            <div className="map-legend">
              <span><i className="day"/> daylight</span>
              <span><i className="night"/> night</span>
            </div>
          </div>
          <WorldMap cities={CITIES} nowMs={now.getTime()}
            activeId={active.id} onSelect={setActiveCity}/>
          <div className="map-foot">
            Real country data · Sun position & terminator updated live · Click a dot
          </div>
        </div>
      </div>

      {userLoc.city && (
        <div className="glass" style={{marginTop:"24px", padding:"18px 24px", display:"flex",
          justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px"}}>
          <div>
            <div className="h-eyebrow">Your location · detected live</div>
            <div style={{fontFamily:"var(--f-display)", fontSize:"22px", marginTop:"4px"}}>
              {userLoc.city}, {userLoc.country} — {userLoc.tz}
            </div>
          </div>
          <div className="mono" style={{color:"var(--ink-3)", fontSize:"13px"}}>
            {formatTimeInTz(now, userLoc.tz, h12, true)}
          </div>
        </div>
      )}

      <div className="city-rail">
        <div className="glass city-col">
          <div className="city-col-head">
            <div className="h-eyebrow">Primary cities · live</div>
            <div className="mono" style={{fontSize:"10.5px", color:"var(--ink-4)", letterSpacing:"0.1em"}}>
              {h12?"12h":"24h"} · in Settings
            </div>
          </div>
          {CITIES.slice(0,6).map(c=>{
            const hr = getHourInTz(now, c.tz);
            const isDay = hr>=6 && hr<18;
            const isActive = c.id===activeCity;
            const off = utcOffsetHours(c.tz, now);
            return (
              <div key={c.id} className={"city-row"+(isActive?" active":"")}
                onClick={()=>setActiveCity(c.id)}>
                <div className="flag">{c.cc}</div>
                <div>
                  <div className="name">{c.name}</div>
                  <div className="sub">{c.country} · UTC{off>=0?"+":""}{off}</div>
                </div>
                <div className="time">{formatTimeInTz(now,c.tz,h12,false)}</div>
                <div className={"badge"+(isDay?" day":"")}>{isDay?"DAY":"NIGHT"}</div>
              </div>
            );
          })}
        </div>
        <div className="glass city-col">
          <div className="city-col-head">
            <div className="h-eyebrow">Additional zones</div>
          </div>
          {CITIES.slice(6).map(c=>{
            const hr = getHourInTz(now, c.tz);
            const isDay = hr>=6 && hr<18;
            const isActive = c.id===activeCity;
            const off = utcOffsetHours(c.tz, now);
            return (
              <div key={c.id} className={"city-row"+(isActive?" active":"")}
                onClick={()=>setActiveCity(c.id)}>
                <div className="flag">{c.cc}</div>
                <div>
                  <div className="name">{c.name}</div>
                  <div className="sub">{c.country} · UTC{off>=0?"+":""}{off}</div>
                </div>
                <div className="time">{formatTimeInTz(now,c.tz,h12,false)}</div>
                <div className={"badge"+(isDay?" day":"")}>{isDay?"DAY":"NIGHT"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass sunbelt">
        <div className="sunbelt-head">
          <div>
            <div className="h-eyebrow">Almanac · {active.name}</div>
            <div style={{fontFamily:"var(--f-display)", fontSize:"26px", letterSpacing:"-0.015em", marginTop:"4px"}}>
              Sun & moon {sunData?"· live":""}
            </div>
          </div>
          <div className="mono" style={{color:"var(--ink-3)", fontSize:"12px"}}>
            {active.lat.toFixed(2)}°, {active.lng.toFixed(2)}°
          </div>
        </div>
        <div className="sunbelt-grid">
          <div>
            <div className="h-eyebrow">Daylight arc</div>
            <div className="daylight">
              <div className="v">{daylight? daylight.toFixed(1):"—"}<span style={{fontSize:"0.5em", color:"var(--ink-3)"}}>h</span></div>
              <div className="s">of sunlight today</div>
            </div>
            <div className="sun-arc">
              <svg viewBox="0 0 300 130">
                <path d="M 10 120 Q 150 -20 290 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <path d="M 10 120 Q 150 -20 290 120" fill="none"
                  stroke="url(#sunArcGrad)" strokeWidth="3"
                  strokeDasharray="400"
                  strokeDashoffset={(() => {
                    if(riseLocal==null||setLocal==null) return 400;
                    const localH = hourLocalActive + minNow/60;
                    const t = Math.max(0, Math.min(1, (localH - riseLocal)/(setLocal - riseLocal)));
                    return 400 - t*400;
                  })()}/>
                <defs>
                  <linearGradient id="sunArcGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#ffb067"/>
                    <stop offset="0.5" stopColor="#ffcb6b"/>
                    <stop offset="1" stopColor="#ff7c9d"/>
                  </linearGradient>
                </defs>
                {(() => {
                  if(riseLocal==null||setLocal==null) return null;
                  const localH = hourLocalActive + minNow/60;
                  const t = Math.max(0, Math.min(1, (localH - riseLocal)/(setLocal - riseLocal)));
                  const x = 10 + t*280;
                  const y = 120 - Math.sin(t*Math.PI)*140;
                  return (
                    <g>
                      <circle cx={x} cy={y} r="14" fill="#ffcb6b" opacity="0.3"/>
                      <circle cx={x} cy={y} r="7" fill="#ffcb6b" stroke="#fff3c4" strokeWidth="1"/>
                    </g>
                  );
                })()}
                <text x="10" y="128" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.5)">
                  {riseLocal!=null? hoursToHM(riseLocal):"—"}
                </text>
                <text x="290" y="128" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="end">
                  {setLocal!=null? hoursToHM(setLocal):"—"}
                </text>
              </svg>
            </div>
          </div>
          <div>
            <div className="h-eyebrow">Moon phase</div>
            <div className="moon-wrap" style={{marginTop:"12px"}}>
              <div className="moon" style={{"--moon-x": moonX+"%"}}/>
              <div>
                <div style={{fontFamily:"var(--f-display)", fontSize:"24px", letterSpacing:"-0.015em"}}>
                  {moonName(phase)}
                </div>
                <div className="mono" style={{fontSize:"12px", color:"var(--ink-3)", marginTop:"4px"}}>
                  {(phase*100).toFixed(1)}% of cycle
                </div>
                <div className="mono" style={{fontSize:"11px", color:"var(--ink-4)", marginTop:"10px", letterSpacing:"0.1em", textTransform:"uppercase"}}>
                  Synodic · 29.53 days
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="h-eyebrow">Today in {active.name}</div>
            <div style={{fontFamily:"var(--f-display)", fontSize:"20px", letterSpacing:"-0.01em", marginTop:"8px", lineHeight:1.4}}>
              The {isDayActive?"sun is above":"sun is below"} the horizon; {isDayActive?"sunset at":"sunrise at"} <em style={{fontStyle:"italic", color:"var(--accent)"}}>{isDayActive?(setLocal!=null?hoursToHM(setLocal):"—"):(riseLocal!=null?hoursToHM(riseLocal):"—")}</em>.
            </div>
            <div className="chips" style={{marginTop:"14px"}}>
              <div className="chip">{isDayActive? "☀ Daytime":"☽ Nighttime"}</div>
              <div className="chip">Lat {active.lat.toFixed(0)}°</div>
              {sunData && <div className="chip" style={{color:"var(--accent)", borderColor:"rgba(110,243,193,0.3)"}}>Live API</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:"40px"}}>
        <GuidesRail/>
      </div>
      <LongFormArticle/>
    </div>
  );
}
window.Clock = Clock;
