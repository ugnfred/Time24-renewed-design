/* ---------- World map: editorial/premium look, d3-geo + world-atlas topojson ---------- */

function WorldMap({ cities=CITIES, nowMs, activeId, onSelect }){
  const [topo, setTopo] = React.useState(null);
  const [err, setErr] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);

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

  return (
    <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Deep-space ocean with subtle warm hint */}
        <radialGradient id="oceanGrad" cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor="#162044"/>
          <stop offset="0.55" stopColor="#0a1230"/>
          <stop offset="1" stopColor="#03050f"/>
        </radialGradient>

        {/* Land: soft emerald-to-indigo interior */}
        <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3a4e" stopOpacity="0.85"/>
          <stop offset="0.5" stopColor="#153244" stopOpacity="0.82"/>
          <stop offset="1" stopColor="#0f2435" stopOpacity="0.8"/>
        </linearGradient>

        {/* Land coastline glow */}
        <linearGradient id="coastStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7cf0c4"/>
          <stop offset="1" stopColor="#6fb9ff"/>
        </linearGradient>

        {/* Sun: warm, layered */}
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

        {/* City dot colors */}
        <radialGradient id="dotDay" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3c4"/>
          <stop offset="0.6" stopColor="#ffcb6b"/>
          <stop offset="1" stopColor="#f5a04a"/>
        </radialGradient>
        <radialGradient id="dotNight" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d9fff0"/>
          <stop offset="0.6" stopColor="#6ef3c1"/>
          <stop offset="1" stopColor="#3ec79a"/>
        </radialGradient>

        {/* Vignette mask for globe feel */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
          <stop offset="0.5" stopColor="#000" stopOpacity="0"/>
          <stop offset="1" stopColor="#000" stopOpacity="0.55"/>
        </radialGradient>

        {/* Dot glow */}
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Subtle land elevation shadow */}
        <filter id="landDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#7cf0c4" floodOpacity="0.12"/>
        </filter>
      </defs>

      {/* Ocean base */}
      <rect x="0" y="0" width={W} height={H} fill="url(#oceanGrad)"/>

      {/* Starfield */}
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

      {/* Graticule: longitude every 30°, latitude every 20° — very subtle */}
      <g stroke="rgba(124,240,196,0.05)" strokeWidth="0.5" fill="none">
        {[...Array(11)].map((_,i)=>{
          const x = (i+1)*(W/12);
          return <line key={"mer"+i} x1={x} y1="0" x2={x} y2={H}/>;
        })}
        {[...Array(8)].map((_,i)=>{
          const y = (i+1)*(H/9);
          return <line key={"par"+i} x1="0" y1={y} x2={W} y2={y}/>;
        })}
      </g>

      {/* Equator — signature line */}
      <line x1="0" y1={H/2} x2={W} y2={H/2}
        stroke="rgba(124,240,196,0.22)" strokeWidth="0.8"
        strokeDasharray="2 10"/>

      {/* Countries — two-pass: outer glow halo + filled shape */}
      {countryPaths.length>0 ? (
        <>
          {/* Soft cyan halo around landmasses */}
          <g opacity="0.35" filter="url(#landDepth)">
            {countryPaths.map((c,i)=>(
              <path key={"h"+i} d={c.d}
                fill="none"
                stroke="#7cf0c4"
                strokeWidth="2.2"
                strokeOpacity="0.18"
                strokeLinejoin="round"/>
            ))}
          </g>
          {/* Fill + crisp coastline */}
          <g>
            {countryPaths.map((c,i)=>(
              <path key={"c"+i} d={c.d}
                fill="url(#landFill)"
                stroke="url(#coastStroke)"
                strokeWidth="0.7"
                strokeOpacity="0.75"
                strokeLinejoin="round"/>
            ))}
          </g>
          {/* Inner highlight — thin */}
          <g opacity="0.4">
            {countryPaths.map((c,i)=>(
              <path key={"i"+i} d={c.d}
                fill="none"
                stroke="#a8fcda"
                strokeWidth="0.3"
                strokeLinejoin="round"/>
            ))}
          </g>
        </>
      ) : !err ? (
        <text x={W/2} y={H/2} textAnchor="middle" fill="rgba(255,255,255,0.3)"
          fontFamily="JetBrains Mono" fontSize="14">Loading geography…</text>
      ) : null}

      {/* Night overlay — smoother, two-tone */}
      <path d={nightPath} fill="#02030a" opacity="0.62"/>
      <path d={nightPath} fill="#1a2855" opacity="0.2"/>

      {/* Sun glow layers (behind dot) */}
      <g transform={`translate(${sx},${sy})`}>
        <circle r="95" fill="url(#sunOuter)"/>
        <circle r="55" fill="url(#sunHalo)"/>
      </g>

      {/* Subtle sun rays */}
      <g transform={`translate(${sx},${sy})`} opacity="0.4">
        {[...Array(8)].map((_,i)=>{
          const a = (i/8)*Math.PI*2;
          const r1 = 16, r2 = 32;
          return <line key={i}
            x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
            x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
            stroke="#ffcb6b" strokeWidth="1" strokeLinecap="round"/>;
        })}
      </g>

      {/* Sun core */}
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
        const ringColor = isDay ? "#ffcb6b" : "#6ef3c1";

        return (
          <g key={c.id} transform={`translate(${x},${y})`}
             onClick={()=>onSelect&&onSelect(c.id)}
             onMouseEnter={()=>setHovered(c.id)}
             onMouseLeave={()=>setHovered(null)}
             style={{ cursor: "pointer" }}>

            {/* Pulse on active */}
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

            {/* Ring around dot */}
            <circle r={isActive ? 8 : 6} fill="none"
              stroke={ringColor} strokeOpacity={isActive ? 0.55 : 0.3}
              strokeWidth="0.8"/>

            {/* Dot */}
            <circle r={isActive ? 5 : 3.5}
              fill={dotFill}
              stroke="#fff"
              strokeOpacity="0.95"
              strokeWidth={isActive ? 1.2 : 0.6}
              filter="url(#dotGlow)"/>

            {/* Label */}
            <g transform="translate(10, -11)">
              <rect x="-3" y="-10" width={c.id.length*10 + 14} height="18"
                rx="4" fill="rgba(3,5,15,0.85)"
                stroke={isActive ? ringColor : "rgba(255,255,255,0.18)"}
                strokeOpacity={isActive ? 0.5 : 1}
                strokeWidth="0.6"/>
              <text x="4" y="3"
                fontFamily="JetBrains Mono, monospace"
                fontSize="13"
                fontWeight="700"
                fill={isActive ? "#fff" : (isDay ? "#ffe9a8" : "#b8ffe3")}
                letterSpacing="0.8">
                {c.id}
              </text>
            </g>

            {/* Hover tooltip with local time */}
            {isHover && !isActive && (
              <g transform="translate(-64, 14)">
                <rect x="0" y="0" width="128" height="34" rx="7"
                  fill="rgba(8,12,28,0.96)"
                  stroke={ringColor} strokeOpacity="0.45" strokeWidth="0.8"/>
                <text x="64" y="14" textAnchor="middle"
                  fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="600" fill="#fff">
                  {c.name}
                </text>
                <text x="64" y="27" textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill={ringColor}>
                  {formatTimeInTz(new Date(nowMs), c.tz, false, false)} · {isDay ? "DAY" : "NIGHT"}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Vignette to sell the globe feeling */}
      <rect x="0" y="0" width={W} height={H} fill="url(#vignette)" pointerEvents="none"/>
    </svg>
  );
}
window.WorldMap = WorldMap;
