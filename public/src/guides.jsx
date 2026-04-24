/* ---------- Guides / editorial content (globally framed) ---------- */

function GuidesRail(){
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
        <div className="glass article-pin">
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
                <linearGradient id="pinHaze" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffb067" stopOpacity="0"/>
                  <stop offset="1" stopColor="#ffb067" stopOpacity="0.3"/>
                </linearGradient>
              </defs>

              {/* Sky */}
              <rect x="0" y="0" width="600" height="400" fill="url(#pinSky)"/>

              {/* Stars */}
              {[[60,40],[120,70],[200,30],[280,55],[340,35],[420,70],[500,40],[90,110],[260,100],[480,110],[540,80],[150,50],[380,90]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#fff" opacity={0.5-i*0.02}/>
              ))}

              {/* Curved Earth horizon suggestion */}
              <ellipse cx="300" cy="620" rx="500" ry="300" fill="#05070f" opacity="0.5"/>

              {/* Sun rising on horizon — centered */}
              <circle cx="300" cy="300" r="260" fill="url(#pinSun)" opacity="0.6"/>
              <circle cx="300" cy="305" r="55" fill="#fff3c4" opacity="0.9"/>
              <circle cx="300" cy="305" r="42" fill="#ffcb6b"/>

              {/* Atmospheric haze */}
              <rect x="0" y="240" width="600" height="160" fill="url(#pinHaze)"/>

              {/* Longitude meridians suggesting global coverage */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none">
                <path d="M 100 0 Q 300 200 100 400"/>
                <path d="M 200 0 Q 300 200 200 400"/>
                <path d="M 400 0 Q 300 200 400 400"/>
                <path d="M 500 0 Q 300 200 500 400"/>
              </g>

              {/* Distant curved horizon */}
              <path d="M 0 320 Q 300 300 600 320 L 600 400 L 0 400 Z" fill="#1a1730" opacity="0.6"/>
              <path d="M 0 345 Q 300 330 600 345 L 600 400 L 0 400 Z" fill="#0d1024" opacity="0.9"/>
              <path d="M 0 370 Q 300 360 600 370 L 600 400 L 0 400 Z" fill="#05070f"/>

              {/* City skyline silhouettes — generic, across horizon */}
              <g fill="#05070f">
                {/* Left cluster */}
                <rect x="50" y="335" width="8" height="25"/>
                <rect x="60" y="328" width="10" height="32"/>
                <rect x="72" y="340" width="6" height="20"/>
                {/* Center cluster (behind sun, partial) */}
                <rect x="200" y="330" width="7" height="30"/>
                <rect x="210" y="322" width="9" height="38"/>
                <rect x="222" y="335" width="6" height="25"/>
                <rect x="372" y="332" width="8" height="28"/>
                <rect x="383" y="325" width="11" height="35"/>
                <rect x="397" y="338" width="6" height="22"/>
                {/* Right cluster */}
                <rect x="500" y="335" width="7" height="25"/>
                <rect x="510" y="320" width="12" height="40"/>
                <path d="M 516 320 L 516 310 L 518 310 L 518 320 Z"/>
                <rect x="525" y="340" width="6" height="20"/>
              </g>

              {/* Bird silhouettes */}
              <g fill="none" stroke="#1a1730" strokeWidth="1.8" strokeLinecap="round">
                <path d="M 110 150 Q 118 144 126 150 Q 134 144 142 150"/>
                <path d="M 470 170 Q 476 165 482 170 Q 488 165 494 170"/>
              </g>

              {/* Corner labels — coordinates suggesting global */}
              <text x="24" y="34" fill="rgba(255,255,255,0.55)" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="0.2em">
                00:00 UTC · PRIME MERIDIAN
              </text>
              <text x="576" y="34" fill="rgba(255,255,255,0.35)" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="0.2em" textAnchor="end">
                38 TIMEZONES · ONE SKY
              </text>
            </svg>
          </div>
          <div className="txt">
            <div className="byline">Feature · 9 min read</div>
            <h2>One planet, thirty-eight <em>timezones.</em></h2>
            <p>Earth takes twenty-four hours to turn on its axis, but the map of human time has thirty-eight distinct offsets. Some countries adopt a single clock that stretches across a continent; others carve themselves into strips. Daylight saving adds and subtracts a second layer every spring. We look at how nations chose their time, why the half-hour offsets exist at all, and what it costs — in electricity, in productivity, in human circadian rhythm — to keep the clocks we keep.</p>
            <div className="read">Read the full essay →</div>
          </div>
        </div>

        <div className="article">
          <div className="num">01 · Timezones</div>
          <h3>UTC, GMT, and the very small but meaningful difference</h3>
          <p>Most people use the terms interchangeably. Astronomers and aviation lawyers do not. A short history of the leap second and why atomic clocks drifted apart from the rotating Earth.</p>
          <div className="read">7 min read →</div>
        </div>
        <div className="article">
          <div className="num">02 · Conversion</div>
          <h3>Scheduling across three continents without anyone feeling abused</h3>
          <p>A practical workflow: pick the most constrained party's morning, slide the converter until all three zones land in polite hours, and write meeting times in UTC in the calendar invite.</p>
          <div className="read">5 min read →</div>
        </div>
        <div className="article">
          <div className="num">03 · Developers</div>
          <h3>Unix time, ISO 8601, and when each one saves you</h3>
          <p>Unix time is good for math, ISO 8601 is good for humans and databases, and RFC 2822 persists in email headers. A cheatsheet for which format to use in which layer of your stack.</p>
          <div className="read">6 min read →</div>
        </div>

        <div className="article">
          <div className="num">04 · Astronomy</div>
          <h3>Why sunrise shifts across cities that share the same timezone</h3>
          <p>Two cities on the same clock can see the sun rise more than an hour apart. Latitude is part of the story; longitude is most of it. A primer on solar time versus civil time.</p>
          <div className="read">4 min read →</div>
        </div>
        <div className="article">
          <div className="num">05 · Productivity</div>
          <h3>The Pomodoro Technique, thirty years on</h3>
          <p>Francesco Cirillo's kitchen timer is now a background hum in productivity culture. Does the 25/5 rhythm actually make you work better, or does it just make the clock feel less threatening?</p>
          <div className="read">8 min read →</div>
        </div>
        <div className="article">
          <div className="num">06 · Calendars</div>
          <h3>ISO weeks, fiscal years, and the calendars that disagree</h3>
          <p>Fiscal calendars around the world rarely align with the Gregorian one. A walkthrough of the major regimes — April-to-March, July-to-June, October-to-September — and why week numbering matters more than you think.</p>
          <div className="read">5 min read →</div>
        </div>
      </div>
    </div>
  );
}

function LongFormArticle(){
  return (
    <div className="longform">
      <div className="h-eyebrow">Featured reading</div>
      <h2>One planet, thirty-eight timezones.</h2>
      <div className="mono" style={{fontSize:"11.5px", color:"var(--ink-4)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"12px 0 28px"}}>
        By the Time24 desk · April 2026 · 12 min read
      </div>

      <p className="lead">Earth takes twenty-four hours to rotate once on its axis. A neat division of the sphere into twenty-four equal wedges would give every meridian its own hour. In practice, the map of human time has thirty-eight distinct offsets — more than the geometry demands — because timezones are not an astronomical fact. They are a political one.</p>

      <p>The modern system of standardized time is just over a century old. Before railways, every town kept its own local noon, defined as the moment the sun crossed its meridian. A train crossing the country passed through a hundred slightly different clocks. The International Meridian Conference of 1884 fixed the Greenwich meridian as the prime reference and suggested that the world divide itself into twenty-four one-hour zones counted east and west from it. Most countries adopted the framework; very few adopted it cleanly.</p>

      <div className="ad-slot">
        <div className="lbl">Sponsored</div>
        <div>Ad placement · 728 × 90 leaderboard</div>
      </div>

      <h3>Countries that chose width over precision</h3>
      <p>China is the clearest example. The country spans roughly sixty degrees of longitude, which would place it naturally across five one-hour zones. Instead, since 1949, the entire country has officially observed Beijing time (UTC+8). Residents of Kashgar, in the far western province of Xinjiang, see the sun rise at what their official clock calls ten in the morning. Locally, many people quietly keep an unofficial two-hour-offset "Xinjiang time" for daily life, while the official clock governs government offices, trains, and broadcasts.</p>

      <p>India is another case. Roughly twenty-nine degrees wide from the Gujarat coast to the Myanmar border, India observes a single national time — IST, UTC+5:30 — referenced to the 82.5° east meridian near Mirzapur. That choice dates to 1906, under the British Raj, and was consolidated in the 1950s after independence, when Kolkata and Mumbai gave up their separate local times. Researchers have periodically proposed splitting the country into two zones on energy-consumption grounds; none of the proposals have carried.</p>

      <p>Russia, by contrast, chose the opposite path. It runs across eleven official timezones, from Kaliningrad on the Baltic to Kamchatka in the Pacific. The country has reorganized that map several times — adding zones, removing them, experimenting with permanent daylight saving and then abandoning it — and the current arrangement is the result of successive political decisions rather than any single plan.</p>

      <blockquote>"Time is not only measured. It is also legislated. And every legislature has to decide whose sunrise counts."</blockquote>

      <h3>The half-hour and quarter-hour offsets</h3>
      <p>Most of the world sits on whole-hour offsets from UTC, but not all of it. India (+5:30), Sri Lanka (+5:30), Iran (+3:30), Afghanistan (+4:30), Myanmar (+6:30), and parts of Australia (+9:30, +10:30) are on half-hour offsets. Nepal is on a quarter-hour offset (+5:45), as are the Chatham Islands of New Zealand (+12:45). These are not errors. They reflect specific historical choices about which local meridian to treat as reference, in an era when a difference of thirty minutes of solar time was meaningful for agriculture, commerce, or religious observance.</p>

      <p>The half-hour offsets cause real software headaches. A startling number of date libraries, scheduling tools, and meeting invites quietly assume that all offsets are whole hours. The assumption works for most of the world's users and then produces strange, hard-to-diagnose bugs the moment someone from Adelaide or Colombo joins the call. Time24's converter treats all offsets as first-class values, in minutes from UTC, which is how they should have been modelled from the start.</p>

      <h3>Daylight saving: a century of ambivalence</h3>
      <p>Daylight saving time — the practice of shifting the civil clock forward in spring and back in autumn to extend evening daylight — was first proposed in the late nineteenth century and widely adopted during the First World War as a wartime fuel-conservation measure. Roughly seventy countries observe some form of it today. Roughly one hundred and twenty do not.</p>

      <p>The evidence for its practical benefits is surprisingly thin. Studies of the energy-saving rationale have produced mixed and often negative results; the original logic assumed a pattern of household electricity use that no longer describes modern life. Medical researchers consistently find small but real spikes in heart attacks and traffic accidents in the days immediately following the spring shift forward. Several jurisdictions — the European Union formally, and a number of U.S. states — have voted in recent years to abolish the twice-yearly shift, though implementation has stalled on the question of which time to make permanent.</p>

      <div className="ad-slot">
        <div className="lbl">Sponsored</div>
        <div>Ad placement · 300 × 250 mid-article</div>
      </div>

      <h3>Scheduling across three continents</h3>
      <p>Time24's converter exists for a smaller, more immediate version of the same problem: getting a team distributed across three or four timezones onto the same call without anyone feeling abused. The rule of thumb we recommend is to optimize for the two extremes, not the middle. If your westernmost colleague is in San Francisco and your easternmost is in Singapore, the shared polite-hours window is narrow and shifts with daylight saving; the middle offices, wherever they are, can handle either side of it.</p>

      <p>Daylight saving complicates this twice a year. The United States, Canada, Mexico, and most of Europe all shift their clocks, but on slightly different dates. Most of Asia, most of Africa, and all of India do not. For a brief period each spring and fall, the offset between two specific cities is different from what it was last week. The converter on this site always reflects the current offset at the chosen date, but you should sanity-check meeting invites that cross a DST boundary.</p>

      <h3>Unix time, and the tyranny of the epoch</h3>
      <p>Developers think about time in a different coordinate system. The Unix epoch — midnight UTC on January 1, 1970 — is the zero point, and every moment since is counted as a number of seconds from that origin. It is elegant for arithmetic. Subtracting two timestamps gives you an interval; adding a duration gives you a new moment. No timezone confusion, no DST, no "fall back" hour that happens twice.</p>

      <p>The elegance has edges. The 32-bit signed integer version of Unix time will overflow on January 19, 2038, a deadline that has come to be called Y2038. Most modern systems have moved to 64-bit time, which pushes the problem out past the heat death of the Sun. But embedded systems and old file formats still carry the risk, and it is not unusual to find a legacy script somewhere in a bank or a telecom that is counting down.</p>

      <h3>ISO 8601, the quietly brilliant standard</h3>
      <p>For human-readable timestamps that are also machine-sortable, ISO 8601 is the right answer almost every time. It looks like this: <span className="mono">2026-04-21T14:30:00+05:30</span>. The year-month-day ordering means string sorting and chronological sorting are the same operation. The explicit offset avoids ambiguity. The format is regular enough that a simple regex can parse it, and old enough that virtually every library and database already knows how to read it.</p>

      <p>The common alternatives are worse in subtle ways. MM/DD/YYYY and DD/MM/YYYY are ambiguous in most written contexts — a date like "04/05/2026" is either April 5 or May 4 depending on which country wrote it. Locale-specific date formats vary even within a country. ISO 8601 removes the ambiguity at the cost of a slightly less natural-feeling format, and that trade is worth making in almost every production system.</p>

      <h3>Why this site exists</h3>
      <p>Time24 started as a utility — a fast world clock and timezone converter that worked without logging in, without tracking, and without the visual noise of most timezone websites. It has grown, a little, into a journal. We write about the small decisions that governments, engineers, and individuals make about time, and about the ways those decisions add up, wherever in the world you happen to be reading this.</p>

      <p>If you read to the end of an essay like this one, thank you. The tools on this site are free. The guides are written by humans. And the time, no matter which zone you choose, is as exact as we can make it.</p>

      <div className="ad-slot">
        <div className="lbl">Sponsored</div>
        <div>Ad placement · footer leaderboard</div>
      </div>
    </div>
  );
}

window.GuidesRail = GuidesRail;
window.LongFormArticle = LongFormArticle;
