# Time24 — Renewed Design

Renewed global world-clock, timezone converter, stopwatch, timer, alarm, tasks, calendar and developer-timestamps suite.

## Layout

```
public/
  index.html          ← App shell with SEO meta, GA, AdSense, structured data
  src/                ← React (JSX) components, loaded via Babel in the browser
    app.jsx
    clock.jsx
    worldmap.jsx
    converter.jsx
    stopwatch.jsx
    timer.jsx
    tasks.jsx
    calendar.jsx
    alarm.jsx
    developer.jsx
    guides.jsx
    icons.jsx
    util.jsx
  about.html
  contact.html
  privacy-policy.html
  terms.html
  robots.txt
  sitemap.xml
  manifest.json
  ads.txt
  icons/icon-192.png
  icons/icon-512.png
vercel.json           ← CSP, headers, cleanUrls
```

## Deploy on Vercel

1. Push this repo to GitHub (`ugnfred/Time24-renewed-design`).
2. In Vercel → Import Project → pick the repo.
3. **Framework Preset: Other**, **Build command: (empty)**, **Output directory: public**.
4. Deploy. Then assign the custom domain `time24.co.in`.

## Runtime CDNs (all whitelisted in `vercel.json` CSP)

- `unpkg.com` — React 18, ReactDOM, Babel Standalone, topojson-client
- `cdn.jsdelivr.net` — `world-atlas@2.0.2/countries-110m.json` (map geometry)
- `api.sunrise-sunset.org` — sunrise/sunset times
- `ipapi.co` — IP-based location enrichment (optional; falls back gracefully)
- `fonts.googleapis.com` + `fonts.gstatic.com` — Instrument Serif, Inter, JetBrains Mono
- `googletagmanager.com` + `pagead2.googlesyndication.com` — GA4 + AdSense

## Analytics & ads

- GA4 ID: `G-38TD3MXSDR` (same as old site — edit in `index.html` to change)
- AdSense publisher: `ca-pub-6716247063561440` (same as old site; `ads.txt` matches)
- Google Search Console verification: `4ba2336bfd9be539`

## Local preview

```sh
cd public && npx serve .
# → http://localhost:3000
```

## Notes

- JSX is transpiled in-browser by Babel Standalone. Fine for ~13 small files; if you ever want faster first-paint, pre-compile to plain JS with esbuild or swc and swap `<script type="text/babel">` for `<script>`.
- No build step today — push and Vercel serves `public/` as-is.
