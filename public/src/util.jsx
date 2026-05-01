/* ---------- Shared util & data, with dynamic APIs ---------- */

const CITIES = [
  { id:"IST", name:"Delhi",         country:"India",         cc:"IN", tz:"Asia/Kolkata",       lat:28.6, lng:77.2,  off:5.5 },
  { id:"NYC", name:"New York",      country:"United States", cc:"US", tz:"America/New_York",   lat:40.7, lng:-74.0, off:-4 },
  { id:"LON", name:"London",        country:"UK",            cc:"GB", tz:"Europe/London",      lat:51.5, lng:-0.1,  off:1 },
  { id:"DXB", name:"Dubai",         country:"UAE",           cc:"AE", tz:"Asia/Dubai",         lat:25.2, lng:55.3,  off:4 },
  { id:"SIN", name:"Singapore",     country:"Singapore",     cc:"SG", tz:"Asia/Singapore",     lat:1.35, lng:103.8, off:8 },
  { id:"TYO", name:"Tokyo",         country:"Japan",         cc:"JP", tz:"Asia/Tokyo",         lat:35.7, lng:139.7, off:9 },
  { id:"SYD", name:"Sydney",        country:"Australia",     cc:"AU", tz:"Australia/Sydney",   lat:-33.9,lng:151.2, off:10 },
  { id:"SFO", name:"San Francisco", country:"United States", cc:"US", tz:"America/Los_Angeles",lat:37.8, lng:-122.4,off:-7 },
  { id:"BER", name:"Berlin",        country:"Germany",       cc:"DE", tz:"Europe/Berlin",      lat:52.5, lng:13.4,  off:2 },
  { id:"SAO", name:"São Paulo",     country:"Brazil",        cc:"BR", tz:"America/Sao_Paulo",  lat:-23.5,lng:-46.6, off:-3 },
  { id:"JNB", name:"Johannesburg",  country:"South Africa",  cc:"ZA", tz:"Africa/Johannesburg",lat:-26.2,lng:28.0,  off:2 },
  { id:"MOW", name:"Moscow",        country:"Russia",        cc:"RU", tz:"Europe/Moscow",      lat:55.8, lng:37.6,  off:3 },
];

// Compute real UTC offset from IANA tz (handles DST) — replaces static .off
function utcOffsetHours(tz, date=new Date()){
  try{
    const dtf = new Intl.DateTimeFormat("en-US",{ timeZone: tz, timeZoneName:"shortOffset" });
    const parts = dtf.formatToParts(date);
    const tzn = parts.find(p=>p.type==="timeZoneName")?.value || "";
    // "GMT+5:30" / "GMT-7"
    const m = tzn.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);
    if(m){
      const sign = m[1]==="-"?-1:1;
      const h = parseInt(m[2],10);
      const mm = m[3]?parseInt(m[3],10):0;
      return sign*(h + mm/60);
    }
  }catch(e){}
  return 0;
}

function formatTimeInTz(date, tz, hour12=true, withSec=true){
  try{
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour:"2-digit", minute:"2-digit",
      second: withSec?"2-digit":undefined, hour12
    }).format(date);
  }catch(e){ return "--:--" }
}
function formatDateInTz(date, tz){
  try{
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz, weekday:"short", month:"short", day:"numeric", year:"numeric"
    }).format(date);
  }catch(e){ return "" }
}
function getHourInTz(date, tz){
  try{
    const s = new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"2-digit",hour12:false}).format(date);
    return parseInt(s,10)%24;
  }catch(e){ return 0 }
}
function getDayOfYear(d){
  const s = new Date(d.getFullYear(),0,0);
  return Math.floor((d - s)/86400000);
}
function getWeekNumber(d){
  const t = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate()+4-dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(),0,1));
  return Math.ceil(((t - yearStart)/86400000 + 1)/7);
}
function yearProgress(d){
  const y = d.getFullYear();
  const start = new Date(y,0,1).getTime();
  const end = new Date(y+1,0,1).getTime();
  return ((d.getTime()-start)/(end-start))*100;
}
function pad(n,w=2){ return String(n).padStart(w,"0") }

/* sunrise/sunset NOAA approx, returns UT hours */
function sunTimes(date, lat, lng){
  const rad = Math.PI/180;
  const doy = getDayOfYear(date);
  const lngHour = lng/15;
  function calc(isRise){
    const t = doy + ((isRise?6:18)-lngHour)/24;
    const M = (0.9856*t)-3.289;
    let L = M + (1.916*Math.sin(M*rad)) + (0.020*Math.sin(2*M*rad)) + 282.634;
    L = (L+360)%360;
    let RA = Math.atan(0.91764*Math.tan(L*rad))/rad;
    RA = (RA+360)%360;
    const Lq = Math.floor(L/90)*90;
    const RAq = Math.floor(RA/90)*90;
    RA = (RA + (Lq-RAq))/15;
    const sinDec = 0.39782*Math.sin(L*rad);
    const cosDec = Math.cos(Math.asin(sinDec));
    const zenith = 90.833;
    const cosH = (Math.cos(zenith*rad) - (sinDec*Math.sin(lat*rad)))/(cosDec*Math.cos(lat*rad));
    if(cosH>1||cosH<-1) return null;
    let H = isRise ? 360-Math.acos(cosH)/rad : Math.acos(cosH)/rad;
    H = H/15;
    const T = H + RA - (0.06571*t) - 6.622;
    let UT = T - lngHour;
    return ((UT%24)+24)%24;
  }
  return { rise: calc(true), set: calc(false) };
}
function hoursToHM(h){
  if(h==null) return "--:--";
  const hh = Math.floor(h);
  const mm = Math.floor((h-hh)*60);
  return pad(hh)+":"+pad(mm);
}
function hoursToLocal(h, tzOffsetHours){
  if(h==null) return null;
  return ((h + tzOffsetHours) % 24 + 24) % 24;
}

function moonPhase(d){
  const lp = 2551443;
  const newMoon = new Date(Date.UTC(1970,0,7,20,35,0)).getTime()/1000;
  const phase = (((d.getTime()/1000) - newMoon) % lp + lp) % lp / lp;
  return phase;
}
function moonName(p){
  if(p<0.03||p>0.97) return "New Moon";
  if(p<0.22) return "Waxing Crescent";
  if(p<0.28) return "First Quarter";
  if(p<0.47) return "Waxing Gibbous";
  if(p<0.53) return "Full Moon";
  if(p<0.72) return "Waning Gibbous";
  if(p<0.78) return "Last Quarter";
  return "Waning Crescent";
}

// Beep using Web Audio API
function playBeep(freq=880, duration=0.6, type="sine"){
  try{
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + duration);
    setTimeout(()=>ctx.close().catch(()=>{}), (duration+0.2)*1000);
  }catch(e){}
}
function playChime(){
  playBeep(880,0.5);
  setTimeout(()=>playBeep(1175,0.6),250);
  setTimeout(()=>playBeep(1568,0.9),550);
}

function useTick(intervalMs=1000){
  const [t,setT] = React.useState(()=>new Date());
  React.useEffect(()=>{
    const id = setInterval(()=>setT(new Date()), intervalMs);
    return ()=>clearInterval(id);
  },[intervalMs]);
  return t;
}

// Subscribe components to global Time24 settings
function useT24Settings(){
  const get = () => (window.__T24 && window.__T24.settings) ||
    (window.t24LoadSettings ? window.t24LoadSettings() : {});
  const [s, setS] = React.useState(get);
  React.useEffect(()=>{
    const onChg = (e) => setS(e.detail || get());
    window.addEventListener("t24-settings-changed", onChg);
    return () => window.removeEventListener("t24-settings-changed", onChg);
  },[]);
  const is24h = s.timeFormat === "24";
  const homeTz = s.homeTimezone === "auto"
    ? (Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC")
    : (s.homeTimezone || "UTC");
  return {
    settings: s,
    is24h, h12: !is24h,
    showSeconds: s.showSeconds !== false,
    homeTz,
    weekStart: parseInt(s.weekStart,10)||0,
    name: s.greetingByName || ""
  };
}

// Detect user's timezone via browser API (dynamic, no hardcoding)
function useUserLocation(){
  const [loc, setLoc] = React.useState(()=>{
    try{
      return {
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        source: "browser"
      };
    }catch(e){ return { tz:"Asia/Kolkata", source:"fallback" } }
  });
  React.useEffect(()=>{
    // Try to enrich via free IP API
    fetch("https://ipapi.co/json/")
      .then(r=>r.ok?r.json():null)
      .then(d=>{
        if(d && d.timezone){
          setLoc({
            tz: d.timezone,
            city: d.city,
            country: d.country_name,
            cc: d.country_code,
            lat: d.latitude,
            lng: d.longitude,
            source: "ipapi"
          });
        }
      })
      .catch(()=>{});
  },[]);
  return loc;
}

/* ── WORLD_CITIES — comprehensive list for the world table ── */
const WORLD_CITIES = [
  { name:"Accra",         tz:"Africa/Accra" },
  { name:"Addis Ababa",   tz:"Africa/Addis_Ababa" },
  { name:"Adelaide",      tz:"Australia/Adelaide" },
  { name:"Algiers",       tz:"Africa/Algiers" },
  { name:"Almaty",        tz:"Asia/Almaty" },
  { name:"Amman",         tz:"Asia/Amman" },
  { name:"Amsterdam",     tz:"Europe/Amsterdam" },
  { name:"Anchorage",     tz:"America/Anchorage" },
  { name:"Ankara",        tz:"Europe/Istanbul" },
  { name:"Athens",        tz:"Europe/Athens" },
  { name:"Atlanta",       tz:"America/New_York" },
  { name:"Auckland",      tz:"Pacific/Auckland" },
  { name:"Baghdad",       tz:"Asia/Baghdad" },
  { name:"Baku",          tz:"Asia/Baku" },
  { name:"Bangkok",       tz:"Asia/Bangkok" },
  { name:"Barcelona",     tz:"Europe/Madrid" },
  { name:"Beijing",       tz:"Asia/Shanghai" },
  { name:"Beirut",        tz:"Asia/Beirut" },
  { name:"Belgrade",      tz:"Europe/Belgrade" },
  { name:"Berlin",        tz:"Europe/Berlin" },
  { name:"Bogotá",        tz:"America/Bogota" },
  { name:"Brussels",      tz:"Europe/Brussels" },
  { name:"Bucharest",     tz:"Europe/Bucharest" },
  { name:"Budapest",      tz:"Europe/Budapest" },
  { name:"Buenos Aires",  tz:"America/Argentina/Buenos_Aires" },
  { name:"Cairo",         tz:"Africa/Cairo" },
  { name:"Casablanca",    tz:"Africa/Casablanca" },
  { name:"Chicago",       tz:"America/Chicago" },
  { name:"Copenhagen",    tz:"Europe/Copenhagen" },
  { name:"Dallas",        tz:"America/Chicago" },
  { name:"Dar es Salaam", tz:"Africa/Dar_es_Salaam" },
  { name:"Darwin",        tz:"Australia/Darwin" },
  { name:"Denver",        tz:"America/Denver" },
  { name:"Dhaka",         tz:"Asia/Dhaka" },
  { name:"Doha",          tz:"Asia/Qatar" },
  { name:"Dubai",         tz:"Asia/Dubai" },
  { name:"Dublin",        tz:"Europe/Dublin" },
  { name:"Frankfurt",     tz:"Europe/Berlin" },
  { name:"Hanoi",         tz:"Asia/Ho_Chi_Minh" },
  { name:"Havana",        tz:"America/Havana" },
  { name:"Helsinki",      tz:"Europe/Helsinki" },
  { name:"Ho Chi Minh",   tz:"Asia/Ho_Chi_Minh" },
  { name:"Hong Kong",     tz:"Asia/Hong_Kong" },
  { name:"Honolulu",      tz:"Pacific/Honolulu" },
  { name:"Istanbul",      tz:"Europe/Istanbul" },
  { name:"Jakarta",       tz:"Asia/Jakarta" },
  { name:"Johannesburg",  tz:"Africa/Johannesburg" },
  { name:"Kabul",         tz:"Asia/Kabul" },
  { name:"Karachi",       tz:"Asia/Karachi" },
  { name:"Kathmandu",     tz:"Asia/Kathmandu" },
  { name:"Kiev",          tz:"Europe/Kiev" },
  { name:"Kolkata",       tz:"Asia/Kolkata" },
  { name:"Kuala Lumpur",  tz:"Asia/Kuala_Lumpur" },
  { name:"Kuwait City",   tz:"Asia/Kuwait" },
  { name:"Lagos",         tz:"Africa/Lagos" },
  { name:"Lahore",        tz:"Asia/Karachi" },
  { name:"La Paz",        tz:"America/La_Paz" },
  { name:"Lima",          tz:"America/Lima" },
  { name:"Lisbon",        tz:"Europe/Lisbon" },
  { name:"London",        tz:"Europe/London" },
  { name:"Los Angeles",   tz:"America/Los_Angeles" },
  { name:"Madrid",        tz:"Europe/Madrid" },
  { name:"Managua",       tz:"America/Managua" },
  { name:"Manila",        tz:"Asia/Manila" },
  { name:"Melbourne",     tz:"Australia/Melbourne" },
  { name:"Mexico City",   tz:"America/Mexico_City" },
  { name:"Miami",         tz:"America/New_York" },
  { name:"Milan",         tz:"Europe/Rome" },
  { name:"Minneapolis",   tz:"America/Chicago" },
  { name:"Minsk",         tz:"Europe/Minsk" },
  { name:"Montreal",      tz:"America/Toronto" },
  { name:"Moscow",        tz:"Europe/Moscow" },
  { name:"Mumbai",        tz:"Asia/Kolkata" },
  { name:"Nairobi",       tz:"Africa/Nairobi" },
  { name:"New Delhi",     tz:"Asia/Kolkata" },
  { name:"New York",      tz:"America/New_York" },
  { name:"Oslo",          tz:"Europe/Oslo" },
  { name:"Ottawa",        tz:"America/Toronto" },
  { name:"Panama City",   tz:"America/Panama" },
  { name:"Paris",         tz:"Europe/Paris" },
  { name:"Perth",         tz:"Australia/Perth" },
  { name:"Phoenix",       tz:"America/Phoenix" },
  { name:"Prague",        tz:"Europe/Prague" },
  { name:"Reykjavík",     tz:"Atlantic/Reykjavik" },
  { name:"Riyadh",        tz:"Asia/Riyadh" },
  { name:"Rio de Janeiro",tz:"America/Sao_Paulo" },
  { name:"Rome",          tz:"Europe/Rome" },
  { name:"Salt Lake City",tz:"America/Denver" },
  { name:"San Francisco", tz:"America/Los_Angeles" },
  { name:"San Juan",      tz:"America/Puerto_Rico" },
  { name:"Santiago",      tz:"America/Santiago" },
  { name:"Santo Domingo", tz:"America/Santo_Domingo" },
  { name:"São Paulo",     tz:"America/Sao_Paulo" },
  { name:"Seattle",       tz:"America/Los_Angeles" },
  { name:"Seoul",         tz:"Asia/Seoul" },
  { name:"Shanghai",      tz:"Asia/Shanghai" },
  { name:"Singapore",     tz:"Asia/Singapore" },
  { name:"Sofia",         tz:"Europe/Sofia" },
  { name:"Stockholm",     tz:"Europe/Stockholm" },
  { name:"Sydney",        tz:"Australia/Sydney" },
  { name:"Taipei",        tz:"Asia/Taipei" },
  { name:"Tashkent",      tz:"Asia/Tashkent" },
  { name:"Tehran",        tz:"Asia/Tehran" },
  { name:"Tel Aviv",      tz:"Asia/Jerusalem" },
  { name:"Tokyo",         tz:"Asia/Tokyo" },
  { name:"Toronto",       tz:"America/Toronto" },
  { name:"Vancouver",     tz:"America/Vancouver" },
  { name:"Vienna",        tz:"Europe/Vienna" },
  { name:"Warsaw",        tz:"Europe/Warsaw" },
  { name:"Washington DC", tz:"America/New_York" },
  { name:"Winnipeg",      tz:"America/Winnipeg" },
  { name:"Yangon",        tz:"Asia/Yangon" },
  { name:"Yerevan",       tz:"Asia/Yerevan" },
  { name:"Zürich",        tz:"Europe/Zurich" },
];

Object.assign(window, {
  CITIES, WORLD_CITIES,
  utcOffsetHours, formatTimeInTz, formatDateInTz, getHourInTz,
  getDayOfYear, getWeekNumber, yearProgress, pad,
  sunTimes, hoursToHM, hoursToLocal, moonPhase, moonName, useTick, useUserLocation,
  useT24Settings,
  playBeep, playChime
});
