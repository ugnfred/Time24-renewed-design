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

function useTick(intervalMs=1000){
  const [t,setT] = React.useState(()=>new Date());
  React.useEffect(()=>{
    const id = setInterval(()=>setT(new Date()), intervalMs);
    return ()=>clearInterval(id);
  },[intervalMs]);
  return t;
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

Object.assign(window, {
  CITIES, utcOffsetHours, formatTimeInTz, formatDateInTz, getHourInTz,
  getDayOfYear, getWeekNumber, yearProgress, pad,
  sunTimes, hoursToHM, hoursToLocal, moonPhase, moonName, useTick, useUserLocation
});
