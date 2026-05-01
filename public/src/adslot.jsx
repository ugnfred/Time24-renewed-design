/* ---------- AdSlot · Google AdSense + responsive in-article slot ---------- */
/* Publisher: ca-pub-6716247063561440 — replace data-ad-slot IDs with your real
   slot IDs once AdSense approves the site. The component renders a clean
   placeholder until AdSense fills it. */

const ADSENSE_CLIENT = "ca-pub-6716247063561440";

function AdSlot({ slot, format = "auto", layout, height, label = "Sponsored", style = {} }){
  const ref = React.useRef(null);
  const [filled, setFilled] = React.useState(false);

  React.useEffect(()=>{
    if(typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch(e){
      // ignored — adsbygoogle may not be loaded yet (e.g. blocker present)
    }
    // Detect fill: AdSense sets data-ad-status attribute after render
    const t = setInterval(()=>{
      const el = ref.current;
      if(!el) return;
      if(el.getAttribute("data-ad-status") === "filled"){
        setFilled(true); clearInterval(t);
      }
    }, 800);
    return () => clearInterval(t);
  },[]);

  return (
    <div className="ad-slot" style={{minHeight: height || 100, ...style}}>
      {!filled && <div className="lbl">{label}</div>}
      <ins className="adsbygoogle"
        ref={ref}
        style={{display:"block", textAlign:"center", width:"100%", minHeight: height || 90}}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"/>
      {!filled && <div style={{fontSize:"11px", color:"var(--ink-4)", fontFamily:"var(--f-mono)", letterSpacing:"0.08em"}}>
        Ad placement
      </div>}
    </div>
  );
}

window.AdSlot = AdSlot;
window.ADSENSE_CLIENT = ADSENSE_CLIENT;
