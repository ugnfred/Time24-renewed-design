/* ---------- World map: editorial/premium look, d3-geo + world-atlas topojson ---------- */

function WorldMap({ cities=CITIES, nowMs, activeId, onSelect }){
  const [topo, setTopo] = React.useState(null);
  const [err, setErr] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);
  const [theme, setTheme] = React.useState(()=>document.documentElement.getAttribute("data-theme")||"dark");

  // Track theme changes
  React.useEffect(()=>{
    const obs = new MutationObserver(()=>{
      setTheme(document.documentElement.getAttribute("data-theme")||"dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter:["data-theme"] });
    return ()=>obs.disconnect();
  },[]);

  const isLight = theme === "light";

  React.useEffect(()=>{
    let cancelled = false;
    (async () => {
      try{
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json");
        if(!res.ok) throw new Error("failed");
        const data = await res.json();
        if(!cancelled) setTopo(data);
      }catch(e){ if(!cancelled) setErr(true) }
    })();
    return () => { cancelled = true };
  },[]);

  const W = 1000, H = 480;
  const proj = (lat, lng) => [(lng + 180) * (W / 360), (90 - lat) * (H / 180)];

  const countryPaths = React.useMemo(()=>{
    if(!topo || !window.topojson) return [];
    try{
      const geo = window.topojson.feature(topo, topo.objects.countries);
      return geo.features.map(f => ({ id: f.id, d: geoPath(f, proj) }));
    }catch(e){ return [] }
  },[topo]);

  function geoPath(feature, proj){
    const g = feature.geometry;
    if(!g) return "";
    const rings = [];
    const walk = (coords, type) => {
      if(type === "Polygon") coords.forEach(r => rings.push(r));
      else if(type === "MultiPolygon") coords.forEach(p => p.forEach(r => rings.push(r)));
    };
    walk(g.coordinates, g.type);
    return rings.map(ring => "M" + ring.map(([lng,lat])=>{
      const [x,y] = proj(lat,lng);
      return x.toFixed(1)+","+y.toFixed(1);
    }).join("L") + "Z").join(" ");
  }

  // Sun + terminator math
  const d = new Date(nowMs);
  const nowMinutes = d.getUTCHours()*60 + d.getUTCMinutes();
  const sunLng = 180 - (nowMinutes/4);
  const doy = getDayOfYear(d);
  const decl = 23.44 * Math.sin(((360/365)*(doy-81))*Math.PI/180);
  const [sx, sy] = proj(decl, sunLng);

  const nightPath = React.useMemo(()=>{
    const pts = [];
    for(let lng=-180; lng<=180; lng+=2){
      const H_ang = (lng - sunLng);
      const tanDecl = Math.tan(decl*Math.PI/180);
      let lat = Math.atan( -Math.cos(H_ang*Math.PI/180) / (tanDecl || 0.0001) )*180/Math.PI;
      if(isNaN(lat)) lat = 0;
      pts.push(proj(lat, lng));
    }
    if(decl > 0){ pts.push([W, H]); pts.push([0, H]); }
    else{ pts.push([W, 0]); pts.push([0, 0]); }
    return "M" + pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" L") + " Z";
  },[sunLng, decl]);

  // Stable starfield
  const stars = React.useMemo(()=>{
    const arr = [];
    let seed = 7;
    const rand = () => { seed = (seed*9301 + 49297) % 233280; return seed/233280; };
    for(let i=0; i<90; i++){
      arr.push({
        x: rand()*W,
        y: rand()*H,
        r: rand()<0.15 ? 1.1 : (rand()<0.4 ? 0.7 : 0.4),
        o: 0.25 + rand()*0.55
      });
    }
    return arr;
  },[]);

  // ── Theme-aware palette ──────────────────────────────
  const P = isLight ? {
    ocean1: "#c8dff5",
    ocean2: "#a8c8e8",
    ocean3: "#7aaedc",
    landFill1: "#d6e8c4",
    landFill2: "#b8d4a0",
    coastStroke1: "#4a8a5a",
    coastStroke2: "#3a7a9a",
    landHaloStroke: "#4a9a6a",
    graticule: "rgba(30,80,120,0.08)",
    equator: "rgba(30,140,90,0.30)",
    nightFill: "rgba(100,130,180,0.28)",
    nightFill2: "rgba(80,100,160,0.12)",
    vignette: "rgba(120,160,200,0.25)",
    starOpacity: 0,
    dotDayOuter: "#f5a020",
    dotDayInner: "#fff3c4",
    dotNightOuter: "#1f9d6a",
    dotNightInner: "#d9fff0",
    ringDay: "#e08010",
    ringNight: "#1f9d6a",
    labelBg: "rgba(255,255,255,0.92)",
    labelStroke: "rgba(30,60,30,0.25)",
    labelActiveStroke: "#1f9d6a",
    labelText: "#1a2e1a",
    labelDayText: "#7a4800",
    labelNightText: "#0a5a3a",
    tooltipBg: "rgba(240,248,242,0.97)",
    tooltipStroke: "rgba(31,157,106,0.5)",
    sunHaloColor: "#ffcb6b",
    sunCoreColor: "#ffb067",
    sunCenterColor: "#fff3c4",
  } : {
    ocean1: "#162044",
    ocean2: "#0a1230",
    ocean3: "#03050f",
    landFill1: "#1a3a4e",
    landFill2: "#0f2435",
    coastStroke1: "#7cf0c4",
    coastStroke2: "#6fb9ff",
    landHaloStroke: "#7cf0c4",
    graticule: "rgba(124,240,196,0.05)",
    equator: "rgba(124,240,196,0.22)",
    nightFill: "#02030a",
    nightFill2: "#1a2855",
    vignette: "#000",
    starOpacity: 1,
    dotDayOuter: "#f5a04a",
    dotDayInner: "#fff3c4",
    dotNightOuter: "#3ec79a",
    dotNightInner: "#d9fff0",
    ringDay: "#ffcb6b",
    ringNight: "#6ef3c1",
    labelBg: "rgba(3,5,15,0.85)",
    labelStroke: "rgba(255,255,255,0.18)",
    labelActiveStroke: "#6ef3c1",
    labelText: "#fff",
    labelDayText: "#ffe9a8",
    labelNightText: "#b8ffe3",
    tooltipBg: "rgba(8,12,28,0.96)",
    tooltipStroke: "#6ef3c1",
    sunHaloColor: "#ffcb6b",
    sunCoreColor: "#ffb067",
    sunCenterColor: "#fff9e4",
  };

  return (
    <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="oceanGrad" cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor={P.ocean1}/>
          <stop offset="0.55" stopColor={P.ocean2}/>
          <stop offset="1" stopColor={P.ocean3}/>
        </radialGradient>

        <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.landFill1} stopOpacity={isLight?"0.95":"0.85"}/>
          <stop offset="1" stopColor={P.landFill2} stopOpacity={isLight?"0.9":"0.8"}/>
        </linearGradient>

        <linearGradient id="coastStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={P.coastStroke1}/>
          <stop offset="1" stopColor={P.coastStroke2}/>
        </linearGradient>

        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff9e4"/>
          <stop offset="0.4" stopColor="#ffd98c"/>
          <stop offset="1" stopColor="#ffb067"/>
        </radialGradient>
        <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffcb6b" stopOpacity="0.5"/>
          <stop offset="0.4" stopColor="#ffb067" stopOpacity="0.22"/>
          <stop offset="1" stopColor="#ffb067" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="sunOuter" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb067" stopOpacity="0.15"/>
          <stop offset="1" stopColor="#ffb067" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="dotDay" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={P.dotDayInner}/>
          <stop offset="0.6" stopColor="#ffcb6b"/>
          <stop offset="1" stopColor={P.dotDayOuter}/>
        </radialGradient>
        <radialGradient id="dotNight" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={P.dotNightInner}/>
          <stop offset="0.6" stopColor={isLight?"#2ecf90":"#6ef3c1"}/>
          <stop offset="1" stopColor={P.dotNightOuter}/>
        </radialGradient>

        <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
          <stop offset="0.5" stopColor={P.vignette} stopOpacity="0"/>
          <stop offset="1" stopColor={P.vignette} stopOpacity={isLight?"0.18":"0.55"}/>
        </radialGradient>

        {/* Light mode: subtle water shimmer */}
        {isLight && (
          <linearGradient id="waterShimmer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8f4fc" stopOpacity="0.6"/>
            <stop offset="1" stopColor="#b0cde8" stopOpacity="0.2"/>
          </linearGradient>
        )}

        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <filter id="landDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8"
            floodColor={isLight?"#4a8a5a":"#7cf0c4"}
            floodOpacity={isLight?"0.18":"0.12"}/>
        </filter>
      </defs>

      {/* Ocean base */}
      <rect x="0" y="0" width={W} height={H} fill="url(#oceanGrad)"/>
      {isLight && <rect x="0" y="0" width={W} height={H} fill="url(#waterShimmer)"/>}

      {/* Starfield — dark mode only */}
      {!isLight && (
        <g>
          {stars.map((s,i)=>(
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o}>
              {s.r > 0.8 && (
                <animate attributeName="opacity"
                  values={`${s.o};${s.o*0.3};${s.o}`}
                  dur={`${3 + (i%4)}s`} repeatCount="indefinite"/>
              )}
            </circle>
          ))}
        </g>
      )}

      {/* Light mode: gentle wave hint */}
      {isLight && (
        <g opacity="0.15">
          {[80,160,240,320].map((y,i)=>(
            <path key={i} d={`M0 ${y} Q${W/4} ${y-8} ${W/2} ${y} Q${3*W/4} ${y+8} ${W} ${y}`}
              fill="none" stroke="#7ab8d8" strokeWidth="0.6"/>
          ))}
        </g>
      )}

      {/* Graticule */}
      <g stroke={P.graticule} strokeWidth="0.5" fill="none">
        {[...Array(11)].map((_,i)=>{
          const x = (i+1)*(W/12);
          return <line key={"mer"+i} x1={x} y1="0" x2={x} y2={H}/>;
        })}
        {[...Array(8)].map((_,i)=>{
          const y = (i+1)*(H/9);
          return <line key={"par"+i} x1="0" y1={y} x2={W} y2={y}/>;
        })}
      </g>

      {/* Equator */}
      <line x1="0" y1={H/2} x2={W} y2={H/2}
        stroke={P.equator} strokeWidth="0.8"
        strokeDasharray="2 10"/>

      {/* Tropics — light mode gets extra reference lines */}
      {isLight && (
        <>
          <line x1="0" y1={proj(23.44,0)[1]} x2={W} y2={proj(23.44,0)[1]}
            stroke="rgba(200,120,0,0.15)" strokeWidth="0.5" strokeDasharray="4 12"/>
          <line x1="0" y1={proj(-23.44,0)[1]} x2={W} y2={proj(-23.44,0)[1]}
            stroke="rgba(200,120,0,0.15)" strokeWidth="0.5" strokeDasharray="4 12"/>
        </>
      )}

      {/* Countries */}
      {countryPaths.length>0 ? (
        <>
          <g opacity={isLight?"0.5":"0.35"} filter="url(#landDepth)">
            {countryPaths.map((c,i)=>(
              <path key={"h"+i} d={c.d}
                fill="none"
                stroke={P.landHaloStroke}
                strokeWidth={isLight?"1.8":"2.2"}
                strokeOpacity={isLight?"0.25":"0.18"}
                strokeLinejoin="round"/>
            ))}
          </g>
          <g>
            {countryPaths.map((c,i)=>(
              <path key={"c"+i} d={c.d}
                fill="url(#landFill)"
                stroke="url(#coastStroke)"
                strokeWidth={isLight?"0.9":"0.7"}
                strokeOpacity={isLight?"0.85":"0.75"}
                strokeLinejoin="round"/>
            ))}
          </g>
          <g opacity={isLight?"0.5":"0.4"}>
            {countryPaths.map((c,i)=>(
              <path key={"i"+i} d={c.d}
                fill="none"
                stroke={isLight?"#8ad0a8":"#a8fcda"}
                strokeWidth="0.3"
                strokeLinejoin="round"/>
            ))}
          </g>
        </>
      ) : !err ? (
        <text x={W/2} y={H/2} textAnchor="middle"
          fill={isLight?"rgba(40,80,60,0.5)":"rgba(255,255,255,0.3)"}
          fontFamily="JetBrains Mono" fontSize="14">Loading geography…</text>
      ) : null}

      {/* Night overlay */}
      <path d={nightPath} fill={P.nightFill} opacity={isLight?"0.35":"0.62"}/>
      <path d={nightPath} fill={P.nightFill2} opacity={isLight?"0.2":"0.2"}/>

      {/* Sun glow */}
      <g transform={`translate(${sx},${sy})`}>
        <circle r="95" fill="url(#sunOuter)"/>
        <circle r="55" fill="url(#sunHalo)"/>
      </g>
      <g transform={`translate(${sx},${sy})`} opacity={isLight?"0.55":"0.4"}>
        {[...Array(8)].map((_,i)=>{
          const a = (i/8)*Math.PI*2;
          const r1=16, r2=32;
          return <line key={i}
            x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
            x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
            stroke="#ffcb6b" strokeWidth="1" strokeLinecap="round"/>;
        })}
      </g>
      <g transform={`translate(${sx},${sy})`}>
        <circle r="12" fill="url(#sunCore)"/>
        <circle r="5" fill="#fff9e4"/>
      </g>

      {/* Cities */}
      {cities.map(c=>{
        const [x,y] = proj(c.lat, c.lng);
        const hourLocal = getHourInTz(new Date(nowMs), c.tz);
        const isDay = hourLocal >= 6 && hourLocal < 18;
        const isActive = c.id === activeId;
        const isHover = c.id === hovered;
        const dotFill = isDay ? "url(#dotDay)" : "url(#dotNight)";
        const ringColor = isDay ? P.ringDay : P.ringNight;

        return (
          <g key={c.id} transform={`translate(${x},${y})`}
             onClick={()=>onSelect&&onSelect(c.id)}
             onMouseEnter={()=>setHovered(c.id)}
             onMouseLeave={()=>setHovered(null)}
             style={{ cursor: "pointer" }}>

            {isActive && (
              <>
                <circle r="4" fill={ringColor} opacity="0.5">
                  <animate attributeName="r" from="5" to="24" dur="2.4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.55" to="0" dur="2.4s" repeatCount="indefinite"/>
                </circle>
                <circle r="3" fill={ringColor} opacity="0.4">
                  <animate attributeName="r" from="3" to="16" dur="2.4s" begin="0.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.45" to="0" dur="2.4s" begin="0.8s" repeatCount="indefinite"/>
                </circle>
              </>
            )}

            <circle r={isActive ? 8 : 6} fill="none"
              stroke={ringColor} strokeOpacity={isActive ? 0.55 : 0.3}
              strokeWidth="0.8"/>

            <circle r={isActive ? 5 : 3.5}
              fill={dotFill}
              stroke={isLight?"rgba(255,255,255,0.95)":"#fff"}
              strokeOpacity="0.95"
              strokeWidth={isActive ? 1.2 : 0.6}
              filter="url(#dotGlow)"/>

            <g transform="translate(10, -11)">
              <rect x="-3" y="-10" width={c.id.length*10 + 14} height="18"
                rx="4" fill={P.labelBg}
                stroke={isActive ? P.labelActiveStroke : P.labelStroke}
                strokeOpacity={isActive ? 0.6 : 1}
                strokeWidth="0.7"/>
              <text x="4" y="3"
                fontFamily="JetBrains Mono, monospace"
                fontSize="13"
                fontWeight="700"
                fill={isActive ? (isLight?"#0a4a2a":P.labelText) : (isDay ? P.labelDayText : P.labelNightText)}
                letterSpacing="0.8">
                {c.id}
              </text>
            </g>

            {isHover && !isActive && (
              <g transform="translate(-64, 14)">
                <rect x="0" y="0" width="128" height="34" rx="7"
                  fill={P.tooltipBg}
                  stroke={P.tooltipStroke} strokeOpacity="0.5" strokeWidth="0.8"/>
                <text x="64" y="14" textAnchor="middle"
                  fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="600"
                  fill={isLight?"#1a2e2a":"#fff"}>
                  {c.name}
                </text>
                <text x="64" y="27" textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace" fontSize="9.5"
                  fill={ringColor}>
                  {formatTimeInTz(new Date(nowMs), c.tz, false, false)} · {isDay ? "DAY" : "NIGHT"}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Vignette */}
      <rect x="0" y="0" width={W} height={H} fill="url(#vignette)" pointerEvents="none"/>
    </svg>
  );
}
window.WorldMap = WorldMap;
