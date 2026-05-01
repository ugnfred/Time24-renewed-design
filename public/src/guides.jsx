/* ---------- Guides / editorial content with full article modal reader ---------- */

const ARTICLES = [
  {
    id: "feature",
    num: "Feature",
    cat: "Timezones",
    read: "9 min read",
    title: "One planet, thirty-eight timezones.",
    titleHTML: <>One planet, thirty-eight <em>timezones.</em></>,
    summary: "Earth takes twenty-four hours to turn on its axis, but the map of human time has thirty-eight distinct offsets. We look at how nations chose their time, why the half-hour offsets exist at all, and what it costs to keep the clocks we keep.",
    body: [
      { type:"lead", text:"Earth takes twenty-four hours to rotate once on its axis. A neat division of the sphere into twenty-four equal wedges would give every meridian its own hour. In practice, the map of human time has thirty-eight distinct offsets — more than the geometry demands — because timezones are not an astronomical fact. They are a political one." },
      { type:"p", text:"The modern system of standardized time is just over a century old. Before railways, every town kept its own local noon, defined as the moment the sun crossed its meridian. A train crossing the country passed through a hundred slightly different clocks. The International Meridian Conference of 1884 fixed the Greenwich meridian as the prime reference and suggested the world divide itself into twenty-four one-hour zones counted east and west from it. Most countries adopted the framework; very few adopted it cleanly." },
      { type:"h", text:"Countries that chose width over precision" },
      { type:"p", text:"China is the clearest example. The country spans roughly sixty degrees of longitude, which would place it naturally across five one-hour zones. Instead, since 1949, the entire country has officially observed Beijing time (UTC+8). Residents of Kashgar, in the far western province of Xinjiang, see the sun rise at what their official clock calls ten in the morning. Locally, many people quietly keep an unofficial two-hour-offset \"Xinjiang time\" for daily life." },
      { type:"p", text:"India is another case. Roughly twenty-nine degrees wide from the Gujarat coast to the Myanmar border, India observes a single national time — IST, UTC+5:30 — referenced to the 82.5° east meridian near Mirzapur. That choice dates to 1906, under the British Raj, and was consolidated in the 1950s after independence." },
      { type:"p", text:"Russia, by contrast, runs across eleven official timezones, from Kaliningrad on the Baltic to Kamchatka in the Pacific. The country has reorganized that map several times — adding zones, removing them, experimenting with permanent daylight saving and then abandoning it." },
      { type:"q", text:"Time is not only measured. It is also legislated. And every legislature has to decide whose sunrise counts." },
      { type:"h", text:"The half-hour and quarter-hour offsets" },
      { type:"p", text:"Most of the world sits on whole-hour offsets from UTC, but not all of it. India (+5:30), Sri Lanka (+5:30), Iran (+3:30), Afghanistan (+4:30), Myanmar (+6:30), and parts of Australia (+9:30, +10:30) are on half-hour offsets. Nepal is on a quarter-hour offset (+5:45), as are the Chatham Islands of New Zealand (+12:45). These reflect specific historical choices about which local meridian to treat as reference." },
      { type:"p", text:"The half-hour offsets cause real software headaches. A startling number of date libraries quietly assume that all offsets are whole hours. Time24's converter treats all offsets as first-class values, in minutes from UTC, which is how they should have been modelled from the start." },
      { type:"h", text:"Daylight saving: a century of ambivalence" },
      { type:"p", text:"Daylight saving time was first proposed in the late nineteenth century and widely adopted during the First World War as a wartime fuel-conservation measure. Roughly seventy countries observe some form of it today. Roughly one hundred and twenty do not." },
      { type:"p", text:"The evidence for its practical benefits is thin. Energy-saving studies have produced mixed and often negative results. Medical researchers consistently find small but real spikes in heart attacks and traffic accidents in the days immediately following the spring shift forward." },
      { type:"h", text:"Why this site exists" },
      { type:"p", text:"Time24 started as a utility — a fast world clock and timezone converter that worked without logging in, without tracking, and without the visual noise of most timezone websites. The tools are free. The guides are written by humans. And the time, no matter which zone you choose, is as exact as we can make it." }
    ]
  },
  {
    id: "01",
    num: "01 · Timezones",
    cat: "Timezones",
    read: "7 min read",
    title: "UTC, GMT, and the very small but meaningful difference",
    titleHTML: "UTC, GMT, and the very small but meaningful difference",
    summary: "Most people use the terms interchangeably. Astronomers and aviation lawyers do not. A short history of the leap second and why atomic clocks drifted apart from the rotating Earth.",
    body: [
      { type:"lead", text:"For most everyday purposes UTC and GMT are the same thing — both refer to the time at the Greenwich meridian, both are the reference everyone else's clocks are offset from. But they are not, technically, the same standard, and the difference matters in a small handful of fields where milliseconds are money." },
      { type:"p", text:"GMT — Greenwich Mean Time — is a solar standard. It is defined by the position of the mean sun over the Royal Observatory in Greenwich, London. It has been the world's reference clock since the late nineteenth century, when British naval power and railway expansion together made a single, precise, internationally-agreed clock necessary for the first time." },
      { type:"p", text:"UTC — Coordinated Universal Time — is an atomic standard. It is defined by the average of roughly four hundred caesium atomic clocks distributed across timekeeping laboratories around the world, coordinated by the Bureau International des Poids et Mesures in Paris. The atomic second, which UTC ticks in, was given its modern definition in 1967: 9,192,631,770 cycles of the caesium-133 atom." },
      { type:"h", text:"Why two standards drifted apart" },
      { type:"p", text:"The Earth, it turns out, is a poor clock. Tidal friction with the Moon is gradually slowing its rotation; major earthquakes can shift it abruptly. By the 1960s, the atomic second had become more reliable than the rotational second, and astronomers and physicists began to keep two parallel times: UT1 (rotational) and TAI (atomic)." },
      { type:"p", text:"UTC was created as a compromise. It ticks at the atomic rate of TAI, but it occasionally inserts a leap second to keep it within 0.9 seconds of UT1 — within 0.9 seconds, in other words, of the actual Earth's rotation." },
      { type:"h", text:"The leap second problem" },
      { type:"p", text:"There have been twenty-seven leap seconds since 1972, all positive (an extra second inserted at the end of June or December). They are announced six months in advance by the International Earth Rotation Service. They have caused exactly the kind of trouble you would expect: software that assumed every minute is exactly sixty seconds has crashed, mishandled bookings, dropped messages." },
      { type:"p", text:"In 2022, the international community voted to abandon the leap second by 2035. UTC will simply drift from solar time, slowly, indefinitely. The drift will be small enough — a few seconds per century — that it will only matter to astronomers, who can correct for it. For everyone else, the clock will simply tick atomically, forever." },
      { type:"h", text:"Practical implications" },
      { type:"p", text:"For day-to-day work: treat UTC and GMT as identical. Use UTC in code, in databases, in API contracts. The half-second-or-so historical difference is invisible to humans and, after 2035, will officially go away." },
      { type:"p", text:"For aviation, satellite navigation, and high-frequency trading: keep reading the leap-second announcements. Or, increasingly, switch to TAI, which is a clean monotonic atomic time without leap-second discontinuities." }
    ]
  },
  {
    id: "02",
    num: "02 · Conversion",
    cat: "Workflow",
    read: "5 min read",
    title: "Scheduling across three continents without anyone feeling abused",
    titleHTML: "Scheduling across three continents without anyone feeling abused",
    summary: "A practical workflow: pick the most constrained party's morning, slide the converter until all three zones land in polite hours, and write meeting times in UTC in the calendar invite.",
    body: [
      { type:"lead", text:"The hardest part of distributed work isn't the timezones. It's the politeness math. A team in San Francisco, Berlin, and Singapore has fewer than two overlapping waking hours per weekday. Someone is always waking up early or staying up late. The art of scheduling is making sure it isn't always the same person." },
      { type:"h", text:"Step one: optimize for the extremes, not the middle" },
      { type:"p", text:"Find your westernmost and easternmost team members. Everyone else can flex into either side of the call. The two extreme zones define the hard constraint. If San Francisco and Singapore are your endpoints, the shared polite-hours window is roughly Singapore's 9pm and San Francisco's 6am — narrow, but workable, and you can rotate which side stays late." },
      { type:"h", text:"Step two: write the time in UTC in the invite" },
      { type:"p", text:"Calendar tools convert correctly almost all of the time. They fail when timezones change for daylight saving — usually for one or two recurring meetings each spring and fall. Including a UTC reference in the invite description (\"Mon 14:00 UTC\") removes the ambiguity for everyone, including yourself when you reread the invite a week later." },
      { type:"h", text:"Step three: rotate the burden" },
      { type:"p", text:"If you have a recurring weekly call across three zones, alternate which zone's evening hours it lands on. The pain doesn't disappear, but it gets distributed. The team in the middle who can attend either slot will appreciate not being the default sacrifice every week." },
      { type:"h", text:"Step four: respect the no-meeting hours" },
      { type:"p", text:"Anything before 7am or after 9pm in any participant's local time should be reserved for genuinely time-critical work. Async written communication is almost always sufficient. Save the synchronous calls for the conversations that actually need them." },
      { type:"h", text:"A worked example" },
      { type:"p", text:"Three teammates: Alma in San Francisco (UTC-7 in summer), Ben in Berlin (UTC+2), Chitra in Singapore (UTC+8). The intersection of polite hours (8am–8pm local) is empty. The intersection of tolerable hours (7am–10pm local) is exactly one slot: 7am SF / 4pm Berlin / 10pm Singapore. Rotate that to 8am SF / 5pm Berlin / 11pm Singapore on alternating weeks, and Chitra gets relief." }
    ]
  },
  {
    id: "03",
    num: "03 · Developers",
    cat: "Engineering",
    read: "6 min read",
    title: "Unix time, ISO 8601, and when each one saves you",
    titleHTML: "Unix time, ISO 8601, and when each one saves you",
    summary: "Unix time is good for math, ISO 8601 is good for humans and databases, and RFC 2822 persists in email headers. A cheatsheet for which format to use in which layer of your stack.",
    body: [
      { type:"lead", text:"Every layer of a modern application has a different opinion about how time should be represented. The frontend wants a Date object. The database wants a TIMESTAMP. The cache wants an integer. The log file wants something a human can read in the terminal. Picking the right format for each boundary is the difference between a system that handles DST gracefully and one that quietly corrupts everyone's calendars." },
      { type:"h", text:"Storage: use UTC, in any sortable format" },
      { type:"p", text:"Whatever format you pick, store everything in UTC. Convert on the way in, convert on the way out for display, but never persist a local-time string. ISO 8601 (2026-04-21T14:30:00Z) and Unix milliseconds (1745251800000) are both fine; pick whichever your database stores natively. Postgres TIMESTAMPTZ stores UTC under the hood regardless of what you write — perfect." },
      { type:"h", text:"Network APIs: ISO 8601, always" },
      { type:"p", text:"In API request and response bodies, always use ISO 8601 with an explicit offset. Z for UTC. Never send naked Unix integers across an API boundary — the next person to consume your API will have to guess whether they're seconds or milliseconds, and they will guess wrong. Never send local-time strings; you will introduce timezone bugs that take days to debug." },
      { type:"h", text:"Arithmetic: convert to milliseconds, then back" },
      { type:"p", text:"Subtracting two ISO timestamps to get an interval is easy in any language: parse to Date, get .getTime(), subtract. The result is a number of milliseconds. Adding a duration is the same operation in reverse. Don't try to manipulate the string representation directly — month boundaries, leap years, and DST will break your math." },
      { type:"h", text:"Display: locale-aware, in the user's timezone" },
      { type:"p", text:"Use Intl.DateTimeFormat in JavaScript, or your platform's equivalent. It handles locale-appropriate formatting, locale-appropriate timezone names, and the cultural conventions you don't even think about (does this locale write the day or the month first? are weekday names abbreviated?)." },
      { type:"h", text:"Logs: ISO 8601 with milliseconds and offset" },
      { type:"p", text:"Logs need to be both human-readable and machine-sortable. ISO 8601 with millisecond precision and explicit offset (2026-04-21T14:30:00.123+05:30) is the right answer. It sorts lexically the same way it sorts chronologically — a property that nothing else has." },
      { type:"h", text:"Email headers, HTTP Date headers: RFC 2822" },
      { type:"p", text:"You don't choose this — the protocols do. RFC 2822 is the format you'll see in email Date: headers and HTTP Date: headers. Parse it on input, but don't generate it elsewhere; it's a quirky historical format that loses information (timezone names instead of offsets) and is easy to get subtly wrong." }
    ]
  },
  {
    id: "04",
    num: "04 · Astronomy",
    cat: "Astronomy",
    read: "4 min read",
    title: "Why sunrise shifts across cities that share the same timezone",
    titleHTML: "Why sunrise shifts across cities that share the same timezone",
    summary: "Two cities on the same clock can see the sun rise more than an hour apart. Latitude is part of the story; longitude is most of it. A primer on solar time versus civil time.",
    body: [
      { type:"lead", text:"Mumbai and Kolkata both run on Indian Standard Time. Both observe UTC+5:30. Both, on a given day, will say it is 6 in the morning at the same moment. But Kolkata sees the sun rise nearly fifty minutes earlier than Mumbai does. The clocks agree; the sky does not." },
      { type:"h", text:"Solar time vs. civil time" },
      { type:"p", text:"Solar time is the time the sun says it is. Local solar noon is the moment the sun is highest in the sky at your specific longitude. Civil time is the time your wristwatch says it is — fixed to a national or regional reference meridian, regardless of where exactly you are within that timezone." },
      { type:"p", text:"Every degree of longitude east or west of your reference meridian shifts your solar time by four minutes. India's reference meridian is 82.5°E. Kolkata sits at 88.4°E — about six degrees east of the reference, twenty-four minutes ahead in solar time. Mumbai sits at 72.9°E — about ten degrees west of the reference, forty minutes behind in solar time. The total spread between Mumbai's solar time and Kolkata's is over an hour, even though their civil clocks are perfectly synchronized." },
      { type:"h", text:"Latitude adds a smaller correction" },
      { type:"p", text:"Latitude affects sunrise and sunset times too, but in a different way: it changes the length of daylight, not its position relative to noon. Cities at higher latitudes have longer summer days and shorter winter days; cities near the equator have nearly constant 12-hour days year-round. Solar noon, however, is determined almost entirely by longitude." },
      { type:"h", text:"Why this matters" },
      { type:"p", text:"For most people, it doesn't. Civil time is the social agreement we live by; solar time is a curiosity. But if you're scheduling outdoor activities, planning sunrise photography, calculating solar panel output, or simply wondering why morning feels so much earlier in Eastern India than in Western India, this is the answer." },
      { type:"p", text:"It also explains why some countries with wide longitude spreads — China, India, Russia in places — have at various times debated splitting their territory into multiple zones. The argument is always about energy: the further your civil time is from your solar time, the more electric light you burn during waking hours." }
    ]
  },
  {
    id: "05",
    num: "05 · Productivity",
    cat: "Productivity",
    read: "8 min read",
    title: "The Pomodoro Technique, thirty years on",
    titleHTML: "The Pomodoro Technique, thirty years on",
    summary: "Francesco Cirillo's kitchen timer is now a background hum in productivity culture. Does the 25/5 rhythm actually make you work better, or does it just make the clock feel less threatening?",
    body: [
      { type:"lead", text:"In 1987, an Italian university student named Francesco Cirillo set a tomato-shaped kitchen timer (in Italian: pomodoro) for twenty-five minutes and committed to focusing on a single task until it rang. He took a five-minute break, then started another twenty-five-minute round. Four rounds in, he took a longer break. The pattern worked, he wrote it down, and three decades later it has its own books, courses, branded products, and a small army of dedicated apps." },
      { type:"h", text:"What the technique actually claims" },
      { type:"p", text:"The Pomodoro Technique is not, fundamentally, a time-management system. It's a cognitive trick. The claim is that twenty-five minutes is short enough to feel non-threatening — almost any task can be tolerated for twenty-five minutes — but long enough that meaningful work gets done. The five-minute break enforces a rest your brain wouldn't otherwise take. The longer break after four rounds prevents accumulated fatigue." },
      { type:"h", text:"Does it work?" },
      { type:"p", text:"The empirical literature is thin. Most published studies on Pomodoro are small, self-reported, and prone to selection bias — people who choose to study Pomodoro are usually people already inclined to like it. The strongest claims, charitably, are that some kind of structured break protocol improves sustained attention; the specific 25/5 cadence is mostly arbitrary." },
      { type:"p", text:"Anecdotally, the technique seems to help most for people who struggle to start tasks at all. The twenty-five-minute commitment is small enough that the resistance to beginning is reduced. People who already focus easily often find the breaks disruptive — they hit a flow state at minute fifteen and don't want to be interrupted at minute twenty-five." },
      { type:"h", text:"Variations that work better for some" },
      { type:"p", text:"50/10 splits suit people doing deep creative work that takes longer to ramp into. 90-minute focus blocks (matching the ultradian rhythm of the human body) have a small but loyal following. The point isn't the specific numbers — it's the explicit decision to focus, the explicit decision to rest, and the structure that prevents either from running indefinitely." },
      { type:"h", text:"How to use the timer on this site" },
      { type:"p", text:"Time24's timer ships with a 25-minute Pomodoro preset, a 45-minute deep-focus preset, and freely-configurable custom durations. The ring fills as time elapses so you can read it from across the room. A chime sounds at the end. You can run it without an account; nothing leaves your browser." }
    ]
  },
  {
    id: "06",
    num: "06 · Calendars",
    cat: "Calendars",
    read: "5 min read",
    title: "ISO weeks, fiscal years, and the calendars that disagree",
    titleHTML: "ISO weeks, fiscal years, and the calendars that disagree",
    summary: "Fiscal calendars around the world rarely align with the Gregorian one. A walkthrough of the major regimes — April-to-March, July-to-June, October-to-September — and why week numbering matters more than you think.",
    body: [
      { type:"lead", text:"The Gregorian calendar — January through December — is the civil calendar of almost every country, but it is rarely the calendar that organizations actually run on. Companies use fiscal years; governments use budget years; retailers use 4-4-5 calendars; ISO 8601 specifies its own week-based year for engineering purposes. They overlap, they disagree, and they all matter." },
      { type:"h", text:"Fiscal year regimes around the world" },
      { type:"p", text:"In India, the fiscal year runs April 1 to March 31, a legacy of British colonial administration. The United Kingdom's tax year is even more eccentric: April 6 to April 5. The United States federal government runs October 1 to September 30. Japan and most of Europe align fiscal year with calendar year. Australia and New Zealand use July 1 to June 30. Saudi Arabia, until recently, used the Hijri calendar for fiscal purposes; it has since shifted to Gregorian." },
      { type:"p", text:"Most multinational companies pick one fiscal year and stick to it globally, regardless of local civil convention, to make consolidated reporting possible. This is why an Indian subsidiary of an American company will often have its books closed September 30, even though every other Indian organization closes March 31." },
      { type:"h", text:"ISO 8601 weeks: the engineer's calendar" },
      { type:"p", text:"ISO 8601 defines its own week numbering: weeks run Monday to Sunday, week 1 is the week containing the first Thursday of the year, and there are either 52 or 53 weeks in an ISO year. The ISO year does not perfectly align with the Gregorian year — the first few days of January can belong to the previous ISO year, and the last few days of December can belong to the next ISO year." },
      { type:"p", text:"This sounds like a nuisance, and it is. But it has a useful property: every ISO week is exactly seven days, and ISO years are always whole multiples of weeks. For analytics, planning, and any week-over-week comparison, ISO weeks are dramatically easier to work with than Gregorian-month weeks." },
      { type:"h", text:"Retail calendars: 4-4-5" },
      { type:"p", text:"Large retailers — Walmart, Target, most US chains — use a 4-4-5 calendar internally. Each fiscal quarter is divided into a 4-week month, a 4-week month, and a 5-week month, totalling 13 weeks per quarter and 52 weeks per year. Once every five or six years, an extra week is added to keep it aligned with the solar year." },
      { type:"p", text:"This sounds bizarre but solves a real problem: it makes month-over-month comparisons honest. Under the Gregorian calendar, February has fewer days than March; comparing February sales to March sales is structurally unfair. Under 4-4-5, every month is exactly four or five weeks, and comparable months always have the same length." },
      { type:"h", text:"Why this matters for your software" },
      { type:"p", text:"If you're building a reporting dashboard for a multinational organization, you will eventually need to support fiscal-year boundaries that aren't January 1, week numbers that aren't Gregorian, and possibly retail calendars that aren't either. Build the abstraction in early. Hardcoding January-December comparisons works until your first non-US enterprise customer, and then it doesn't." }
    ]
  }
];

function Article({ a, onClose }){
  React.useEffect(()=>{
    const onKey = (e) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  },[onClose]);

  return (
    <div onClick={onClose}
      style={{position:"fixed", inset:0, background:"rgba(3,5,15,0.85)",
        backdropFilter:"blur(20px)", zIndex:9998, overflowY:"auto", padding:"40px 20px"}}>
      <div onClick={e=>e.stopPropagation()}
        className="glass" style={{maxWidth:"760px", margin:"0 auto", padding:"50px 60px",
          position:"relative"}}>
        <button onClick={onClose} aria-label="Close"
          style={{position:"absolute", top:"20px", right:"20px",
            width:"40px", height:"40px", borderRadius:"50%",
            background:"rgba(255,255,255,0.06)", border:"1px solid var(--stroke-2)",
            color:"var(--ink)", cursor:"pointer", fontSize:"20px",
            display:"grid", placeItems:"center"}}>×</button>

        <div className="h-eyebrow" style={{color:"var(--accent)"}}>{a.cat} · {a.read}</div>
        <h1 style={{fontFamily:"var(--f-display)", fontSize:"48px", letterSpacing:"-0.03em",
          lineHeight:1.05, marginTop:"10px", marginBottom:"6px", color:"var(--ink)"}}>
          {a.titleHTML}
        </h1>
        <div className="mono" style={{fontSize:"11.5px", color:"var(--ink-4)",
          letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"32px"}}>
          By the Time24 desk · April 2026
        </div>

        {a.body.map((b,i)=>{
          if(b.type==="lead") return <p key={i} className="lead-p" style={{
            fontFamily:"var(--f-display)", fontWeight:300, fontSize:"22px",
            lineHeight:1.5, color:"var(--ink)"}}>{b.text}</p>;
          if(b.type==="h") return <h3 key={i} style={{
            fontFamily:"var(--f-display)", fontWeight:400, fontSize:"26px",
            letterSpacing:"-0.015em", margin:"36px 0 8px", color:"var(--ink)"}}>{b.text}</h3>;
          if(b.type==="q") return <blockquote key={i} style={{
            margin:"28px 0", padding:"4px 0 4px 24px",
            borderLeft:"2px solid var(--accent)",
            fontFamily:"var(--f-display)", fontStyle:"italic",
            fontSize:"22px", color:"var(--ink)", lineHeight:1.4}}>"{b.text}"</blockquote>;
          return <p key={i} style={{
            fontFamily:"var(--f-display)", fontWeight:300, fontSize:"18px",
            lineHeight:1.65, color:"var(--ink-2)"}}>{b.text}</p>;
        })}

        <div style={{marginTop:"40px", paddingTop:"24px", borderTop:"1px solid var(--stroke)",
          display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div className="mono" style={{fontSize:"11px", color:"var(--ink-4)",
            letterSpacing:"0.12em", textTransform:"uppercase"}}>
            End of article
          </div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function GuidesRail(){
  const [open, setOpen] = React.useState(null);
  const feature = ARTICLES.find(a=>a.id==="feature");
  const others = ARTICLES.filter(a=>a.id!=="feature");

  return (
    <div className="editorial">
      <div className="editorial-head">
        <div>
          <div className="h-eyebrow">Guides · the Time24 journal</div>
          <h2>How <em>time</em> actually works — the field notes.</h2>
        </div>
        <div className="mono" style={{fontSize:"11px", color:"var(--ink-4)", letterSpacing:"0.1em", textTransform:"uppercase", textAlign:"right"}}>
          Updated monthly<br/>Vol. 03 · 2026
        </div>
      </div>

      <div className="article-grid">
        <div className="glass article-pin" onClick={()=>setOpen(feature)} style={{cursor:"pointer"}}>
          <div className="img">
            <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice"
              style={{position:"absolute", inset:0, width:"100%", height:"100%"}}>
              <defs>
                <linearGradient id="pinSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0a1028"/>
                  <stop offset="0.35" stopColor="#1a1f3c"/>
                  <stop offset="0.6" stopColor="#3a2a4c"/>
                  <stop offset="0.82" stopColor="#c66a5a"/>
                  <stop offset="0.94" stopColor="#ffb067"/>
                  <stop offset="1" stopColor="#ffd89a"/>
                </linearGradient>
                <radialGradient id="pinSun" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#fff6d6"/>
                  <stop offset="0.35" stopColor="#ffcb6b"/>
                  <stop offset="0.7" stopColor="#ffb067" stopOpacity="0.5"/>
                  <stop offset="1" stopColor="#ffb067" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="600" height="400" fill="url(#pinSky)"/>
              {[[60,40],[120,70],[200,30],[280,55],[340,35],[420,70],[500,40],[90,110],[260,100],[480,110]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#fff" opacity={0.5-i*0.02}/>
              ))}
              <circle cx="300" cy="300" r="260" fill="url(#pinSun)" opacity="0.6"/>
              <circle cx="300" cy="305" r="55" fill="#fff3c4" opacity="0.9"/>
              <circle cx="300" cy="305" r="42" fill="#ffcb6b"/>
              <path d="M 0 320 Q 300 300 600 320 L 600 400 L 0 400 Z" fill="#1a1730" opacity="0.6"/>
              <path d="M 0 345 Q 300 330 600 345 L 600 400 L 0 400 Z" fill="#0d1024" opacity="0.9"/>
              <path d="M 0 370 Q 300 360 600 370 L 600 400 L 0 400 Z" fill="#05070f"/>
              <g fill="#05070f">
                <rect x="50" y="335" width="8" height="25"/><rect x="60" y="328" width="10" height="32"/><rect x="72" y="340" width="6" height="20"/>
                <rect x="200" y="330" width="7" height="30"/><rect x="210" y="322" width="9" height="38"/><rect x="222" y="335" width="6" height="25"/>
                <rect x="372" y="332" width="8" height="28"/><rect x="383" y="325" width="11" height="35"/><rect x="397" y="338" width="6" height="22"/>
                <rect x="500" y="335" width="7" height="25"/><rect x="510" y="320" width="12" height="40"/>
                <rect x="525" y="340" width="6" height="20"/>
              </g>
            </svg>
          </div>
          <div className="txt">
            <div className="byline">{feature.cat} · {feature.read}</div>
            <h2>{feature.titleHTML}</h2>
            <p>{feature.summary}</p>
            <div className="read">Read the full essay →</div>
          </div>
        </div>

        {others.map(a=>(
          <div key={a.id} className="glass article" onClick={()=>setOpen(a)}>
            <div className="num">{a.num}</div>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
            <div className="read">{a.read} →</div>
          </div>
        ))}
      </div>

      {open && <Article a={open} onClose={()=>setOpen(null)}/>}
    </div>
  );
}

function LongFormArticle(){
  const [open, setOpen] = React.useState(false);
  const a = ARTICLES.find(x=>x.id==="feature");

  return (
    <div className="longform">
      <div className="h-eyebrow">Featured reading</div>
      <h2>One planet, thirty-eight timezones.</h2>
      <div className="mono" style={{fontSize:"11.5px", color:"var(--ink-4)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"12px 0 28px"}}>
        By the Time24 desk · April 2026 · 12 min read
      </div>

      <p className="lead">Earth takes twenty-four hours to rotate once on its axis. A neat division of the sphere into twenty-four equal wedges would give every meridian its own hour. In practice, the map of human time has thirty-eight distinct offsets — more than the geometry demands — because timezones are not an astronomical fact. They are a political one.</p>

      <p>The modern system of standardized time is just over a century old. Before railways, every town kept its own local noon, defined as the moment the sun crossed its meridian. The International Meridian Conference of 1884 fixed the Greenwich meridian as the prime reference and suggested the world divide itself into twenty-four one-hour zones counted east and west from it. Most countries adopted the framework; very few adopted it cleanly.</p>

      <h3>Countries that chose width over precision</h3>
      <p>China is the clearest example. The country spans roughly sixty degrees of longitude, which would place it naturally across five one-hour zones. Instead, since 1949, the entire country has officially observed Beijing time (UTC+8). India observes a single national time — IST, UTC+5:30. Russia, by contrast, runs across eleven official timezones. Each choice reflects a political decision about whose sunrise counts.</p>

      <blockquote>"Time is not only measured. It is also legislated. And every legislature has to decide whose sunrise counts."</blockquote>

      <div style={{margin:"40px 0", display:"flex", justifyContent:"center"}}>
        <button className="btn accent" onClick={()=>setOpen(true)}>Read the full essay →</button>
      </div>

      {open && <Article a={a} onClose={()=>setOpen(false)}/>}
    </div>
  );
}

window.GuidesRail = GuidesRail;
window.LongFormArticle = LongFormArticle;
window.ARTICLES = ARTICLES;
