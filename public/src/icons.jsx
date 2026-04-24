/* ---------- Icon set (thin editorial line) ---------- */
const Ic = ({children, size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.4"
       strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IconClock = p => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>;
const IconStop  = p => <Ic {...p}><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 3h6M12 3v2"/></Ic>;
const IconTimer = p => <Ic {...p}><path d="M5 21h14M6 21a6 6 0 0 1 12 0M18 3a6 6 0 0 1-12 0"/></Ic>;
const IconTask  = p => <Ic {...p}><path d="M4 6h10M4 12h10M4 18h6"/><path d="M18 5l2 2 4-4" transform="translate(-4 1)"/></Ic>;
const IconCal   = p => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Ic>;
const IconConv  = p => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Ic>;
const IconBell  = p => <Ic {...p}><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9zM10 19a2 2 0 0 0 4 0"/></Ic>;
const IconBook  = p => <Ic {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M6 3v16"/></Ic>;
const IconDev   = p => <Ic {...p}><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></Ic>;
const IconPlay  = p => <Ic {...p}><path d="M7 5l12 7-12 7z"/></Ic>;
const IconPause = p => <Ic {...p}><path d="M7 5v14M17 5v14"/></Ic>;
const IconReset = p => <Ic {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></Ic>;
const IconPlus  = p => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const IconCopy  = p => <Ic {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></Ic>;
const IconSun   = p => <Ic {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></Ic>;
const IconMoon  = p => <Ic {...p}><path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/></Ic>;
const IconSearch= p => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></Ic>;

Object.assign(window, {
  IconClock, IconStop, IconTimer, IconTask, IconCal, IconConv, IconBell,
  IconBook, IconDev, IconPlay, IconPause, IconReset, IconPlus, IconCopy, IconSun, IconMoon, IconSearch
});
