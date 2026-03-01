import { useState, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// LLYANA v4.0 — Nuclear Engineering AI Dashboard
// Avolv Energy Technologies | Gemini AI + Supabase Integration
// ═══════════════════════════════════════════════════════════════

const _p=[112,100,102,101,116,105,111,116,105,115,119,117,98,100,116,122,116,119,108,106];
const _ref=String.fromCharCode(..._p);
const _k=['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9','eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZmV0aW90aXN3dWJkdHp0d2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjA1OTEsImV4cCI6MjA4NzkzNjU5MX0','jEqYMxsquxtUUB60BvMxBj9Mqi3E4-YAibIY_0w9ImE'];
const SB_URL=`https://${_ref}.supabase.co`;
const SB_KEY=_k.join('.');

// ── Supabase CRUD ───────────────────────────────────────────
async function db(method,table,token,body,qs=''){
  try{
    const h={apikey:SB_KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
    if(method==='POST')h['Prefer']='return=representation';
    const r=await fetch(`${SB_URL}/rest/v1/${table}${qs?'?'+qs:''}`,{method,headers:h,...(body?{body:JSON.stringify(body)}:{})});
    if(!r.ok)return method==='GET'?[]:null;
    return r.json();
  }catch{return method==='GET'?[]:null}
}
const dbGet=(t,tk,qs)=>db('GET',t,tk,null,qs);
const dbPost=(t,d,tk)=>db('POST',t,tk,d);
const dbPatch=(t,id,d,tk)=>db('PATCH',t,tk,d,`id=eq.${id}`);

// ── Gemini AI Engine ─────────────────────────────────────────
const GEMINI_KEY = 'AIzaSyC09pCMTT8xio3bXk0uOxaCX8MooK4KjMg';
const GEMINI_MODEL = 'gemini-2.0-flash';
const LLYANA_CORE = `You are Llyana, a Nuclear Engineering AI by Avolv Energy Technologies. RULES:
- SAFETY FIRST: Always prioritise safety over efficiency. If threshold breached, alert immediately.
- CONSERVATIVE: When ambiguous, assume worst case. Never assume best case.
- UNCERTAINTY: State confidence level (0-100%) with every output.
- ZERO HALLUCINATION: Never fabricate data. If unknown, say unknown.
- EXPLAINABILITY: Show numbered reasoning steps for HOW you decided.
- CROSS-DISCIPLINE: Flag impacts on other modules (thermal, materials, safety, operations).
- BENCHMARKS: Compare against IAEA/OECD standards where applicable.
Alert levels: SAFE (within range), MONITOR (80% threshold), WARNING (90-99%), CRITICAL (at/beyond limit), UNKNOWN (insufficient data).
Respond ONLY with valid JSON, no markdown, no backticks, no explanation outside the JSON.`;

const MOD_PROMPTS = {
  reactor: `REACTOR CORE MODULE. Operating ranges (STRICT):
- Core Temperature: 280-600°C. Optimal: 520-560°C. Material limit (Zircaloy): 1200°C. IAEA SSR-2/1 requires staying below 600°C during normal ops.
- Pressure: 100-180 bar. Optimal: 145-165 bar. PWR standard: ~155 bar (IAEA NS-G-1.9).
- Flow Rate: 3500-5000 L/s. Optimal: 4000-4400 L/s. Below 3500 risks inadequate heat removal.

ALERT THRESHOLDS (calculate distance from range center as % of half-range):
- SAFE: <80% deviation from center
- MONITOR: 80-90% deviation
- WARNING: 90-100% deviation  
- CRITICAL: >100% (outside range entirely)

EFFICIENCY FORMULA: Base 95% minus penalties: |temp-540|*0.02 penalty, |pressure-155|*0.05 penalty, |flow-4200|*0.003 penalty. Clamp 50-99%.
NEUTRON FLUX: Typical PWR 2.0-2.8e13 n/cm²s. Scale with power level.
CONTROL ROD: 60-75% withdrawal during normal operation. More inserted = lower reactivity.
XENON: 1.0-1.5 ppm equilibrium. Higher after power reduction (xenon poisoning effect).

Steps: (1) Compare each param against range and compute alert level, (2) Analyze trend direction from history, (3) Cross-check thermal-hydraulic consistency (temp+pressure+flow must be coherent), (4) Check material stress at given temperature, (5) Generate specific actionable recommendation.
JSON shape: {"alert_level":"SAFE|MONITOR|WARNING|CRITICAL","confidence":85,"efficiency":94.2,"temperature_pct":91,"pressure_pct":88,"neutron_flux":"2.4e13","control_rod_position":68,"xenon_level":1.2,"reasoning":[{"step":1,"action":"...","result":"..."}],"recommendations":[{"title":"...","desc":"...","severity":"safe|warning|critical|info"}],"cross_module_impacts":[{"module":"thermal|materials|safety","impact":"..."}],"trend_analysis":"...","benchmarks":"..."}`,

  thermal: `THERMAL & POWER MODULE. Operating ranges (STRICT):
- Target Power: 0-4000 MWth. Typical large PWR: 3000-3400 MWth.
- Coolant Temperature: 250-320°C. Optimal inlet: 280-295°C. Outlet: 310-330°C. Delta-T ~30-40°C.

CALCULATIONS (use these formulas):
- Thermal efficiency: Carnot-limited. Typical PWR: 33-37%. Use base 94% of theoretical max, penalize for deviation from optimal coolant temp.
- Current output (MWe): target_power * (efficiency/100) * 0.33 (thermal-to-electric conversion)
- Thermal load: current_output * 0.92
- Heat rate: 10000-11000 BTU/kWh typical. Higher = less efficient. Formula: 3412/efficiency * 100

COMPONENT STATUS RULES:
- Steam Generator: WARNING if coolant temp >310°C or <260°C, else OPTIMAL
- Turbine: WARNING if efficiency <85%, CRITICAL if <75%, else OPTIMAL  
- Condenser: WARNING if heat_rate >11500, else OPTIMAL

Steps: (1) Validate inputs against ranges, (2) Calculate all outputs using formulas, (3) Assess component status, (4) Cross-reference with reactor conditions if in history, (5) Recommend.
JSON shape: {"alert_level":"...","confidence":90,"current_output":3100,"efficiency":94.5,"thermal_load":2852,"heat_rate":10680,"steam_generator":"OPTIMAL","turbine":"OPTIMAL","condenser":"OPTIMAL","reasoning":[...],"recommendations":[...],"cross_module_impacts":[...],"trend_analysis":"..."}`,

  materials: `MATERIALS MODULE. Steps: (1) Compare degradation % vs yield strength baseline — over 15% is WARNING, over 25% is CRITICAL, (2) Check irradiation embrittlement risk based on degradation rate — Low(<5%), Moderate(5-10%), Elevated(10-20%), High(>20%), (3) Calculate remaining life: (100 - degradation) / 1.5 months approx, (4) Corrosion rate: degradation * 0.3 mm/year approx, (5) Recommend: Safe(<10%), Monitor(10-15%), Replace(>15%).
Common nuclear materials: Zircaloy-4 (fuel cladding, limit 1200°C), Inconel-600 (steam generators), SS-316L (internals), Carbon Steel SA-508 (pressure vessel).
JSON shape: {"alert_level":"...","confidence":88,"degradation_assessment":"...","embrittlement_risk":"Low|Moderate|Elevated|High","remaining_life_months":54,"corrosion_rate":0.4,"reasoning":[...],"recommendations":[...],"cross_module_impacts":[...]}`,

  energy: `EGM (Energy-Generating Mat) MODULE. Piezoelectric energy harvesting. USE THESE EXACT FORMULAS:
Step 1: Traffic density = foot_traffic_per_min / area_sqm (steps/min/m²)
Step 2: Raw power (W) = foot_traffic_per_min × area_sqm × 0.035 (3.5% piezo conversion of ~1W per step)
Step 3: Net power (W) = raw_power × 0.88 (12% signal conditioning loss)
Step 4: Daily energy (kWh) = net_power × 16 hours / 1000
Step 5: Monthly energy (kWh) = daily × 30
Step 6: Annual revenue (USD) = monthly × 12 × $0.12/kWh (Rwanda grid rate)

EFFICIENCY: net_power/raw_power × 3.5 ≈ 3.08%
Mat lifespan: ~5 years typical. Degradation ~2%/year.

DEPLOYMENT INSIGHTS: High traffic zones (>60 steps/min/m²) = premium placement. Low traffic (<20) = not cost effective. ROI breakeven typically 2-3 years for high traffic areas.
JSON shape: {"alert_level":"...","confidence":92,"raw_power_w":15.75,"net_power_w":13.86,"daily_kwh":0.22,"monthly_kwh":6.65,"efficiency_pct":3.08,"annual_revenue_usd":0.80,"reasoning":[...],"recommendations":[...],"trend_analysis":"...","deployment_insights":"..."}`
};

async function geminiAnalyze(module, params, history = []) {
  if (!GEMINI_KEY || GEMINI_KEY === 'PASTE_YOUR_KEY_HERE') { console.warn('Llyana: No Gemini key'); return null; }
  const histCtx = history.length ? `\nHISTORY (last ${Math.min(history.length,5)} readings, newest first):\n${JSON.stringify(history.slice(0,5))}` : '\nNo history yet.';
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
    console.log('Llyana: Calling Gemini for', module);
    const r = await fetch(url, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:`${LLYANA_CORE}\n\n${MOD_PROMPTS[module]}\n\nINPUT: ${JSON.stringify(params)}${histCtx}\n\nAnalyze now. JSON only.`}]}], generationConfig:{temperature:0.3,maxOutputTokens:1500} })
    });
    if (!r.ok) { const err = await r.text(); console.error('Llyana Gemini HTTP error:', r.status, err); return null; }
    const d = await r.json();
    const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!txt) { console.error('Llyana: No text in Gemini response', d); return null; }
    console.log('Llyana: Gemini raw response:', txt.slice(0, 200));
    const parsed = JSON.parse(txt.replace(/```json\s?/g,'').replace(/```/g,'').trim());
    console.log('Llyana: Gemini parsed OK, alert_level:', parsed.alert_level);
    return parsed;
  } catch(e) { console.error('Llyana Gemini error:', e); return null; }
}

const C={bg:'#060608',bgCard:'#0D0D10',bgCardHover:'#131318',bgSidebar:'#0A0A0D',bgInput:'#111115',border:'#1A1A20',borderLight:'#252530',red:'#E63946',redGlow:'rgba(230,57,70,0.35)',redDim:'rgba(230,57,70,0.08)',green:'#10b981',greenDim:'rgba(16,185,129,0.1)',yellow:'#f59e0b',yellowDim:'rgba(245,158,11,0.1)',orange:'#f97316',orangeDim:'rgba(249,115,22,0.1)',cyan:'#06b6d4',cyanDim:'rgba(6,182,212,0.1)',gray:'#6b7280',text:'#E8E8EC',dim:'#8888A0',muted:'#50506A',veryMuted:'#2A2A3A'};

function getAlertLevel(v,min,max){if(v==null||isNaN(v))return'UNKNOWN';const d=Math.abs(v-(min+(max-min)/2))/((max-min)/2);return d<0.8?'SAFE':d<0.9?'MONITOR':d<1.0?'WARNING':'CRITICAL'}
const AC={SAFE:C.green,MONITOR:C.yellow,WARNING:C.orange,CRITICAL:C.red,UNKNOWN:C.gray};

// ── Global CSS with unique per-module transitions ───────────
const CSS=`
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px rgba(230,57,70,0.4))}50%{filter:drop-shadow(0 0 20px rgba(230,57,70,0.7))}}
@keyframes orbit1{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes orbit2{from{transform:rotate(120deg)}to{transform:rotate(480deg)}}
@keyframes orbit3{from{transform:rotate(240deg)}to{transform:rotate(600deg)}}
@keyframes heartbeat{0%,40%,100%{transform:scale(1)}20%{transform:scale(1.08)}}
@keyframes shakeX{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes scanMove{0%{transform:translateY(-100vh)}100%{transform:translateY(100vh)}}
@keyframes reactorEntry{from{opacity:0;transform:scale(0.9) rotateX(10deg)}to{opacity:1;transform:scale(1) rotateX(0)}}
@keyframes thermalEntry{from{opacity:0;filter:blur(6px);transform:translateY(30px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}
@keyframes materialsEntry{from{opacity:0;transform:translateX(-40px) scale(0.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes opsEntry{from{opacity:0;transform:perspective(800px) rotateY(-10deg)}to{opacity:1;transform:perspective(800px) rotateY(0)}}
@keyframes safetyEntry{from{opacity:0;clip-path:inset(0 50% 0 50%)}to{opacity:1;clip-path:inset(0 0 0 0)}}
@keyframes energyEntry{from{opacity:0;transform:scaleY(0.85) translateY(-20px)}to{opacity:1;transform:scaleY(1) translateY(0)}}
.p-overview{animation:fadeUp .4s ease-out forwards}
.p-reactor{animation:reactorEntry .5s cubic-bezier(.22,1,.36,1) forwards}
.p-thermal{animation:thermalEntry .5s ease-out forwards}
.p-materials{animation:materialsEntry .5s cubic-bezier(.22,1,.36,1) forwards}
.p-operations{animation:opsEntry .5s cubic-bezier(.22,1,.36,1) forwards}
.p-safety{animation:safetyEntry .6s ease-out forwards}
.p-energy{animation:energyEntry .5s cubic-bezier(.22,1,.36,1) forwards}
.card-hover{transition:all .25s cubic-bezier(.4,0,.2,1)}.card-hover:hover{transform:translateY(-2px);border-color:${C.borderLight}!important;background:${C.bgCardHover}!important;box-shadow:0 8px 32px rgba(0,0,0,.3)}
.btn-primary{transition:all .2s}.btn-primary:hover{filter:brightness(1.15);transform:translateY(-1px);box-shadow:0 4px 20px rgba(230,57,70,.3)}
.btn-outline{transition:all .2s}.btn-outline:hover{background:rgba(230,57,70,.08)!important}
.input-focus:focus{border-color:${C.red}!important;box-shadow:0 0 0 3px rgba(230,57,70,.1)}
.nav-item{transition:all .2s cubic-bezier(.4,0,.2,1)}.nav-item:hover{background:rgba(230,57,70,.06)}
.shake{animation:shakeX .4s ease}
`;
function Inject(){useEffect(()=>{if(!document.getElementById('lc')){const s=document.createElement('style');s.id='lc';s.textContent=CSS;document.head.appendChild(s)}},[]);return null}

// ── Logo ────────────────────────────────────────────────────
function Logo({size=40,anim=true}){const s=size,cx=s/2,cy=s/2,r=s*.38;return(
<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={anim?{animation:'heartbeat 3s ease-in-out infinite'}:{}}>
<circle cx={cx} cy={cy} r={r+2} fill="none" stroke={C.red} strokeWidth=".5" opacity=".2"/>
<g style={anim?{animation:'orbit1 8s linear infinite',transformOrigin:`${cx}px ${cy}px`}:{}}><ellipse cx={cx} cy={cy} rx={r} ry={r*.35} fill="none" stroke={C.red} strokeWidth="1.2" opacity=".6" transform={`rotate(-30 ${cx} ${cy})`}/><circle cx={cx+r*Math.cos(-.52)} cy={cy+r*.35*Math.sin(-.52)} r={s*.04} fill={C.red}>{anim&&<animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>}</circle></g>
<g style={anim?{animation:'orbit2 10s linear infinite',transformOrigin:`${cx}px ${cy}px`}:{}}><ellipse cx={cx} cy={cy} rx={r} ry={r*.35} fill="none" stroke={C.red} strokeWidth="1.2" opacity=".45" transform={`rotate(50 ${cx} ${cy})`}/><circle cx={cx+r*Math.cos(.87)} cy={cy-r*.35*Math.sin(.87)} r={s*.035} fill={C.red} opacity=".8"/></g>
<g style={anim?{animation:'orbit3 12s linear infinite',transformOrigin:`${cx}px ${cy}px`}:{}}><ellipse cx={cx} cy={cy} rx={r} ry={r*.35} fill="none" stroke={C.red} strokeWidth="1" opacity=".3" transform={`rotate(170 ${cx} ${cy})`}/></g>
<circle cx={cx} cy={cy} r={s*.09} fill={C.red} opacity=".9" style={anim?{filter:`drop-shadow(0 0 ${s*.1}px ${C.redGlow})`}:{}}>{anim&&<animate attributeName="r" values={`${s*.08};${s*.1};${s*.08}`} dur="2s" repeatCount="indefinite"/>}</circle>
<circle cx={cx} cy={cy} r={s*.05} fill="#fff" opacity=".9"/>
<path d={`M${cx-r*.6} ${cy} L${cx-r*.25} ${cy} L${cx-r*.12} ${cy-s*.08} L${cx} ${cy+s*.06} L${cx+r*.12} ${cy-s*.1} L${cx+r*.25} ${cy} L${cx+r*.6} ${cy}`} fill="none" stroke={C.red} strokeWidth="1.3" strokeLinecap="round" opacity=".7" style={anim?{filter:`drop-shadow(0 0 4px ${C.redGlow})`}:{}}/>
</svg>)}

// ── UI Components ───────────────────────────────────────────
function StatCard({label,value,sub,accent,delay=0}){return(<div className="card-hover" style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:'18px 20px',flex:1,minWidth:160,animation:`fadeUp .4s ease-out ${delay}s both`}}><div style={{fontSize:'11px',color:C.muted,marginBottom:8,letterSpacing:'.5px',textTransform:'uppercase'}}>{label}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'26px',fontWeight:700,color:accent||C.text}}>{value}</div>{sub&&<div style={{fontSize:'11px',color:accent||C.dim,marginTop:4}}>{sub}</div>}</div>)}
function Card({children,style,title,actions,delay=0}){return(<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 24px',animation:`fadeUp .4s ease-out ${delay}s both`,...style}}>{(title||actions)&&<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>{title&&<div style={{fontSize:'14px',fontWeight:600,color:C.text}}>{title}</div>}{actions}</div>}{children}</div>)}
function Btn({children,onClick,outline,style:s,disabled}){return(<button className={outline?'btn-outline':'btn-primary'} onClick={onClick} disabled={disabled} style={{background:outline?'transparent':`linear-gradient(135deg,${C.red},#c42d39)`,color:outline?C.red:'#fff',border:outline?`1px solid ${C.red}33`:'none',borderRadius:8,padding:'11px 20px',fontSize:'13px',fontWeight:600,cursor:disabled?'not-allowed':'pointer',width:'100%',opacity:disabled?.4:1,...s}}>{children}</button>)}
function Pill({active,children,onClick}){return(<button onClick={onClick} style={{background:active?C.cyan+'20':'transparent',color:active?C.cyan:C.muted,border:`1px solid ${active?C.cyan+'40':C.border}`,borderRadius:6,padding:'5px 14px',fontSize:'11px',fontWeight:500,cursor:'pointer',transition:'all .2s'}}>{children}</button>)}
function PBar({value,color,label}){return(<div style={{marginBottom:14}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:'12px',color:C.dim}}>{label}</span><span style={{fontSize:'12px',fontFamily:'monospace',color:color||C.red,fontWeight:600}}>{value}%</span></div><div style={{height:5,background:C.veryMuted,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${value}%`,background:`linear-gradient(90deg,${color||C.red},${color||C.red}cc)`,borderRadius:3,transition:'width .8s cubic-bezier(.4,0,.2,1)'}}/></div></div>)}

function Inp({label,value,onChange,hint,required,min,max,unit}){
  const[t,sT]=useState(false);const[f,sF]=useState(false);const n=parseFloat(value);
  let e='';if(t&&required&&!value)e=`${label} is required`;else if(t&&value&&isNaN(n))e='Must be a number';else if(t&&value&&min!=null&&n<min)e=`Min: ${min}${unit?' '+unit:''}`;else if(t&&value&&max!=null&&n>max)e=`Max: ${max}${unit?' '+unit:''}`;
  const al=!e&&t&&value&&!isNaN(n)&&min!=null&&max!=null?getAlertLevel(n,min,max):null;
  const bc=e?C.red:f?C.red:al==='WARNING'?C.orange:al==='MONITOR'?C.yellow:C.borderLight;
  return(<div style={{marginBottom:18}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}><label style={{fontSize:'12px',color:C.dim,fontWeight:500}}>{label} {required&&<span style={{color:C.red}}>*</span>}</label>{al&&al!=='SAFE'&&<span style={{fontSize:'9px',fontWeight:700,color:AC[al],background:AC[al]+'15',padding:'2px 8px',borderRadius:4}}>{al}</span>}</div><div style={{position:'relative'}}><input type="text" value={value} onChange={x=>{onChange(x.target.value);if(!t)sT(true)}} onFocus={()=>sF(true)} onBlur={()=>{sF(false);sT(true)}} className={`input-focus ${e&&t?'shake':''}`} style={{width:'100%',background:C.bgInput,border:`1.5px solid ${bc}`,borderRadius:8,padding:unit?'11px 50px 11px 14px':'11px 14px',color:C.text,fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",outline:'none',boxSizing:'border-box',transition:'border-color .2s'}}/>{unit&&<span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',fontSize:'11px',color:C.muted,fontFamily:'monospace'}}>{unit}</span>}</div>{e&&t?<div style={{fontSize:'10px',color:C.red,marginTop:5,animation:'fadeIn .2s'}}>{e}</div>:hint?<div style={{fontSize:'10px',color:C.muted,marginTop:4}}>{hint}</div>:null}</div>)}

function LnChart({data,w=800,h=180,color=C.red,showArea,label}){if(!data?.length)return null;const mx=Math.max(...data)*1.08,mn=Math.min(...data)*.92,rng=mx-mn||1;const step=w/(data.length-1);const pts=data.map((v,i)=>`${i*step},${h-((v-mn)/rng)*h}`).join(' ');return(<div style={{width:'100%',overflow:'hidden'}}><svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto'}} preserveAspectRatio="none">{showArea&&<><defs><linearGradient id={`ag${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".15"/><stop offset="100%" stopColor={color} stopOpacity=".01"/></linearGradient></defs><polygon points={`0,${h} ${pts} ${(data.length-1)*step},${h}`} fill={`url(#ag${color.slice(1)})`}/></>}<polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>{data.map((v,i)=>i%Math.max(1,Math.floor(data.length/8))===0&&<circle key={i} cx={i*step} cy={h-((v-mn)/rng)*h} r="3" fill={color} style={{filter:`drop-shadow(0 0 4px ${color}60)`}}/>)}</svg>{label&&<div style={{textAlign:'center',fontSize:'10px',color:C.muted,marginTop:6}}>{label}</div>}</div>)}

function BrChart({data,labels,w=700,h=180,color=C.red}){const mx=Math.max(...data)*1.2||1;const bw=w/data.length*.55,gap=w/data.length*.45;return(<div style={{width:'100%'}}><svg viewBox={`0 0 ${w} ${h+28}`} style={{width:'100%'}}><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color} stopOpacity=".5"/></linearGradient></defs>{data.map((v,i)=>{const bh=(v/mx)*h,x=i*(bw+gap)+gap/2;return(<g key={i}><rect x={x} y={h-bh} width={bw} height={bh} fill="url(#bg1)" rx="4" style={{transformOrigin:`${x}px ${h}px`,animation:`barGrow .6s ease-out ${i*.08}s both`}}/>{labels?.[i]&&<text x={x+bw/2} y={h+16} textAnchor="middle" fill={C.muted} fontSize="8.5">{labels[i]}</text>}</g>)})}</svg></div>)}

function Gauge({value,label,size=120}){const a=(value/100)*270-135,r=size/2-12,cx=size/2,cy=size/2+4;const sA=-135*Math.PI/180,eA=a*Math.PI/180,bgE=135*Math.PI/180;const arc=(s,e)=>{const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);return`M${x1} ${y1}A${r} ${r} 0 ${e-s>Math.PI?1:0} 1 ${x2} ${y2}`};const gc=value>95?C.green:value>85?C.yellow:value>70?C.orange:C.red;return(<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><path d={arc(sA,bgE)} fill="none" stroke={C.veryMuted} strokeWidth="7" strokeLinecap="round"/><path d={arc(sA,eA)} fill="none" stroke={gc} strokeWidth="7" strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${gc}50)`}}/></svg><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'20px',fontWeight:700,color:gc,marginTop:-16}}>{value}%</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{label}</div></div>)}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS CONTEXT — shared realtime state
// ═══════════════════════════════════════════════════════════════
function useSystemStatus(token) {
  const [status, setStatus] = useState({ alerts: 0, critical: 0, warnings: 0, modules: 6, online: 0, dbOk: false, label: 'CHECKING', color: C.yellow });
  useEffect(() => {
    if (!token) return;
    const check = async () => {
      const [alerts, reactor, materials, maint] = await Promise.all([
        dbGet('alerts', token, 'status=eq.active&select=alert_level'),
        dbGet('nuclear_reactor_readings', token, 'order=created_at.desc&limit=1'),
        dbGet('nuclear_materials', token, 'select=status'),
        dbGet('nuclear_maintenance', token, 'status=neq.completed&select=id'),
      ]);
      const crit = (alerts || []).filter(a => a.alert_level === 'CRITICAL').length;
      const warn = (alerts || []).filter(a => a.alert_level === 'WARNING').length;
      const hasData = (reactor || []).length > 0 || (materials || []).length > 0;
      const matWarn = (materials || []).filter(m => m.status === 'warning' || m.status === 'critical').length;
      const totalIssues = crit + matWarn;
      let label = 'OPERATIONAL', color = C.green;
      if (totalIssues > 0 || warn > 2) { label = 'DEGRADED'; color = C.yellow; }
      if (crit > 0) { label = 'ALERT'; color = C.orange; }
      if (crit > 2) { label = 'CRITICAL'; color = C.red; }
      setStatus({ alerts: (alerts || []).length, critical: crit, warnings: warn, modules: 6, online: hasData ? 6 : 0, dbOk: true, label, color });
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, [token]);
  return status;
}

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [ld, setLd] = useState(false);
  const go = async () => {
    if (!email || !pw) { setErr('Please enter credentials'); return; }
    setLd(true); setErr('');
    try {
      const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY }, body: JSON.stringify({ email, password: pw }) });
      const d = await r.json();
      if (d.access_token) { const u = { ...d.user, token: d.access_token, refresh_token: d.refresh_token }; try { sessionStorage.setItem('llyana_session', JSON.stringify(u)); } catch(e) {} onLogin(u); }
      else setErr(d.error_description || 'Invalid credentials');
    } catch { setErr('Connection error'); }
    setLd(false);
  };
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `radial-gradient(ellipse at 50% 30%,rgba(230,57,70,.06) 0%,transparent 50%),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.008) 60px,rgba(255,255,255,.008) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.008) 60px,rgba(255,255,255,.008) 61px)` }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}><div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(230,57,70,.12),transparent)`, animation: 'scanMove 6s linear infinite' }} /></div>
      <div style={{ background: 'linear-gradient(145deg,#0E0E12,#0A0A0D)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '52px 44px', width: 400, maxWidth: '92vw', textAlign: 'center', position: 'relative', boxShadow: '0 0 100px rgba(230,57,70,.04),0 40px 80px rgba(0,0,0,.5)', animation: 'fadeUp .6s ease-out' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg,transparent,${C.red}40,transparent)` }} />
        <div style={{ marginBottom: 32 }}>
          <div style={{ margin: '0 auto 20px', width: 80, height: 80, animation: 'glow 4s ease-in-out infinite' }}><Logo size={80} /></div>
          <h1 style={{ color: C.red, fontSize: '32px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '4px' }}>LLYANA</h1>
          <p style={{ color: C.dim, fontSize: '12px', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Nuclear Engineering AI</p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '11px', color: C.dim, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '.5px', textTransform: 'uppercase' }}>Username</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter credentials" className="input-focus" style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '14px', marginBottom: 18, outline: 'none', boxSizing: 'border-box' }} />
          <label style={{ fontSize: '11px', color: C.dim, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '.5px', textTransform: 'uppercase' }}>Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter password" className="input-focus" onKeyDown={e => e.key === 'Enter' && go()} style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '14px', marginBottom: 28, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {err && <div className="shake" style={{ color: C.red, fontSize: '12px', marginBottom: 14, padding: '8px 12px', background: C.redDim, borderRadius: 6, border: `1px solid ${C.red}20` }}>{err}</div>}
        <Btn onClick={go} disabled={ld}>{ld ? 'Authenticating...' : 'Access System'}</Btn>
        <div style={{ marginTop: 28, padding: '12px 0', borderTop: `1px solid ${C.border}` }}><p style={{ color: C.muted, fontSize: '10px', margin: 0, letterSpacing: '1px' }}>Avolv Energy Technologies</p></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT — Local time, realtime system status, scanline
// ═══════════════════════════════════════════════════════════════
const NAV=[{id:'overview',label:'Overview',d:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'},{id:'reactor',label:'Reactor Core',d:'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83'},{id:'thermal',label:'Thermal & Power',d:'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z'},{id:'materials',label:'Materials',d:'M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5'},{id:'operations',label:'Operations',d:'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'},{id:'safety',label:'Safety',d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'},{id:'energy',label:'Energy Yield',d:'M22 12h-4l-3 9L9 3l-3 9H2'}];

function Layout({page,onNav,children,user,onLogout,sysStatus}){
  const[time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);
  const localTime=time.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g,' ');
  return(
    <div style={{display:'flex',minHeight:'100vh',background:C.bg,color:C.text}}>
      <Inject/>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9999,overflow:'hidden'}}><div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,rgba(230,57,70,.1),transparent)`,animation:'scanMove 7s linear infinite'}}/></div>
      <aside style={{width:190,background:C.bgSidebar,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',padding:'20px 0',position:'fixed',top:0,left:0,bottom:0,zIndex:10}}>
        <div style={{padding:'0 16px 28px',display:'flex',alignItems:'center',gap:10}}><Logo size={28} anim={false}/><div><div style={{color:C.red,fontSize:'15px',fontWeight:800,letterSpacing:'2px'}}>LLYANA</div><div style={{color:C.muted,fontSize:'9px',letterSpacing:'1px'}}>NUCLEAR AI</div></div></div>
        <nav style={{flex:1}}>{NAV.map((item,i)=>{const a=page===item.id;return(<button key={item.id} className="nav-item" onClick={()=>onNav(item.id)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 16px',background:a?C.redDim:'transparent',border:'none',borderLeft:a?`3px solid ${C.red}`:'3px solid transparent',color:a?C.red:C.dim,cursor:'pointer',fontSize:'12px',fontWeight:a?600:400,textAlign:'left',animation:`slideIn .3s ease-out ${i*.04}s both`}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.d}/></svg>{item.label}{a&&<div style={{width:5,height:5,borderRadius:'50%',background:C.red,marginLeft:'auto',boxShadow:`0 0 8px ${C.redGlow}`}}/>}</button>)})}</nav>
        <div style={{padding:'14px 16px',borderTop:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}><div style={{width:6,height:6,borderRadius:'50%',background:sysStatus.color,animation:'pulse 2s infinite'}}/><span style={{fontSize:'9px',color:C.muted,letterSpacing:'.5px'}}>SYSTEM STATUS</span></div>
          <div style={{fontSize:'9px',fontFamily:'monospace',color:C.dim}}>Status: <span style={{color:sysStatus.color}}>{sysStatus.label}</span></div>
          <div style={{fontSize:'9px',fontFamily:'monospace',color:C.dim}}>DB: <span style={{color:sysStatus.dbOk?C.green:C.red}}>{sysStatus.dbOk?'CONNECTED':'OFFLINE'}</span></div>
        </div>
      </aside>
      <div style={{flex:1,marginLeft:190}}>
        <header style={{height:50,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',background:C.bgSidebar,position:'sticky',top:0,zIndex:5}}>
          <input placeholder="Search modules..." className="input-focus" style={{background:C.bgInput,border:`1px solid ${C.border}`,borderRadius:8,padding:'7px 16px',color:C.dim,fontSize:'12px',width:260,outline:'none'}}/>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <span style={{fontFamily:'monospace',fontSize:'11px',color:C.muted}}>{localTime} {tz}</span>
            <div style={{display:'flex',alignItems:'center',gap:5,background:sysStatus.color+'18',border:`1px solid ${sysStatus.color}30`,borderRadius:20,padding:'3px 12px'}}><div style={{width:5,height:5,borderRadius:'50%',background:sysStatus.color,animation:'pulse 2s infinite'}}/><span style={{fontSize:'10px',color:sysStatus.color,fontWeight:600,letterSpacing:'.5px'}}>{sysStatus.label}</span></div>
            <span style={{fontSize:'11px',color:C.dim}}>{user?.email?user.email.split('@')[0]:'Admin'}</span>
            {onLogout&&<button onClick={onLogout} style={{background:C.bgInput,border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontSize:'10px',padding:'4px 10px',cursor:'pointer'}}>Sign Out</button>}
          </div>
        </header>
        <main style={{padding:24}} className={`p-${page}`} key={page}>{children}</main>
      </div>
    </div>
  );
}
function PH({red,white,sub}){return(<div style={{marginBottom:24}}><h1 style={{fontSize:'24px',fontWeight:700,margin:0}}><span style={{color:C.red}}>{red}</span> {white}</h1><p style={{color:C.dim,fontSize:'12px',margin:'4px 0 0'}}>{sub}</p></div>)}

// ═══════════════════════════════════════════════════════════════
// OVERVIEW — Realtime from DB
// ═══════════════════════════════════════════════════════════════
function OverviewPage({onNav,token,sysStatus}){
  const [hov,setHov]=useState(null);
  const [stats,setStats]=useState({reactor:null,materials:0,maint:0,alerts:0,compliance:0});
  useEffect(()=>{if(!token)return;(async()=>{
    const[r,m,mt,al,co]=await Promise.all([dbGet('nuclear_reactor_readings',token,'order=created_at.desc&limit=1'),dbGet('nuclear_materials',token,'select=degradation_pct,status'),dbGet('nuclear_maintenance',token,'status=neq.completed&status=neq.cancelled&select=id,scheduled_date'),dbGet('alerts',token,'status=eq.active&select=alert_level'),dbGet('nuclear_compliance',token,'select=status')]);
    const avgDeg=m?.length?m.reduce((a,x)=>a+(+x.degradation_pct||0),0)/m.length:0;
    const nextMaint=mt?.length?Math.max(0,Math.ceil((new Date(mt.sort((a,b)=>new Date(a.scheduled_date)-new Date(b.scheduled_date))[0]?.scheduled_date)-new Date())/(86400000))):'-';
    const compOk=(co||[]).filter(c=>c.status==='COMPLIANT').length;
    setStats({reactor:r?.[0],avgDeg:avgDeg.toFixed(1),nextMaint,alerts:(al||[]).length,compliance:`${compOk}/${(co||[]).length}`,matWarn:(m||[]).filter(x=>x.status==='warning'||x.status==='critical').length,totalMaint:(mt||[]).length});
  })()},[token]);
  const eff=stats.reactor?Math.round(+stats.reactor.efficiency||0):'-';
  const mods=[
    {id:'reactor',title:'Reactor Core Analysis',desc:'Real-time optimization and radial gauges',metric:eff!=='-'?eff+'%':'-',ml:'Core Efficiency',st:sysStatus.label,sc:sysStatus.color},
    {id:'thermal',title:'Thermal & Power',desc:'Power output and thermal tracking',metric:stats.reactor?Math.round(+stats.reactor.core_temp||0)+'\u00B0C':'-',ml:'Core Temperature',st:'LIVE',sc:C.green},
    {id:'materials',title:'Material Performance',desc:'Degradation curves and predictions',metric:stats.avgDeg+'%',ml:'Avg. Degradation',st:stats.matWarn>0?'WARNING':'OPTIMAL',sc:stats.matWarn>0?C.orange:C.green,badge:stats.matWarn||null},
    {id:'operations',title:'Operational Monitoring',desc:'Maintenance scheduling',metric:String(stats.nextMaint),ml:stats.nextMaint==='-'?'No tasks':'Days to next',st:'LIVE',sc:C.green},
    {id:'safety',title:'Safety & Compliance',desc:'Regulatory compliance tracking',metric:stats.compliance,ml:'Standards met',st:stats.alerts>0?'ALERTS':'CLEAR',sc:stats.alerts>0?C.orange:C.green,badge:stats.alerts||null},
    {id:'energy',title:'Energy Yield Projections',desc:'EGM mat yield and forecast curves',metric:'-',ml:'Projected',st:'LIVE',sc:C.green},
  ];
  return(<div><PH red="Dashboard" white="Overview" sub="Nuclear Engineering AI \u2014 Real-time monitoring"/><div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}><StatCard label="Modules" value="6" sub={sysStatus.dbOk?"DB Connected":"Offline"} accent={sysStatus.dbOk?C.green:C.red} delay={.05}/><StatCard label="Active Alerts" value={String(stats.alerts)} sub={`${sysStatus.critical} critical`} delay={.1}/><StatCard label="System" value={sysStatus.label} accent={sysStatus.color} delay={.15}/><StatCard label="Compliance" value={stats.compliance||'-'} accent={C.green} delay={.2}/></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>{mods.map((m,i)=>(<div key={m.id} onMouseEnter={()=>setHov(m.id)} onMouseLeave={()=>setHov(null)} onClick={()=>onNav(m.id)} style={{background:hov===m.id?C.bgCardHover:C.bgCard,border:`1px solid ${hov===m.id?m.sc+'40':C.border}`,borderRadius:12,padding:'22px',cursor:'pointer',position:'relative',animation:`fadeUp .4s ease-out ${i*.06}s both`,transition:'all .3s cubic-bezier(.4,0,.2,1)',transform:hov===m.id?'translateY(-3px) scale(1.01)':'none',boxShadow:hov===m.id?`0 12px 40px rgba(0,0,0,.3),0 0 20px ${m.sc}10`:'none'}}>
    <div style={{position:'absolute',top:18,right:m.badge?44:18,display:'flex',alignItems:'center',gap:5}}><div style={{width:6,height:6,borderRadius:'50%',background:m.sc,animation:'pulse 2s infinite'}}/><span style={{fontSize:'9px',fontWeight:600,color:m.sc}}>{m.st}</span></div>
    {m.badge&&<div style={{position:'absolute',top:16,right:16,background:m.sc,color:'#fff',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700}}>{m.badge}</div>}
    <div style={{fontSize:'14px',fontWeight:600,marginBottom:3}}>{m.title}</div><div style={{fontSize:'11px',color:C.muted,marginBottom:18}}>{m.desc}</div>
    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'24px',fontWeight:700,color:hov===m.id?m.sc:C.text,transition:'color .2s'}}>{m.metric}</div><div style={{fontSize:'10px',color:C.dim,marginBottom:14}}>{m.ml}</div>
    <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:6}}><span style={{fontSize:'10px',color:hov===m.id?C.red:C.muted}}>View Module</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hov===m.id?C.red:C.muted} strokeWidth="2" style={{transition:'all .2s',transform:hov===m.id?'translateX(3px)':'none'}}><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
  </div>))}</div></div>);
}

// ═══════════════════════════════════════════════════════════════
// REACTOR CORE — Full Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function ReactorPage({token,userId}){
  const[ct,setCt]=useState('');const[pr,setPr]=useState('');const[fr,setFr]=useState('');
  const[res,setRes]=useState(null);const[ak,setAk]=useState(0);const[saving,setSaving]=useState(false);const[history,setHistory]=useState([]);const[lastRead,setLastRead]=useState(null);
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[benchInfo,setBenchInfo]=useState('');const[confidence,setConfidence]=useState(null);

  useEffect(()=>{if(!token)return;dbGet('nuclear_reactor_readings',token,'order=created_at.desc&limit=10').then(d=>{if(d?.length){setHistory(d);setLastRead(d[0]);setCt(String(d[0].core_temp||''));setPr(String(d[0].pressure||''));setFr(String(d[0].flow_rate||''));}});},[token]);

  const fallback=(t,p,f)=>{
    const eff=Math.min(99,Math.max(50,85+(t/600)*15-Math.abs(p-155)*.05));const tPct=Math.min(99,Math.max(50,85+(t/600)*15-Math.abs(t-550)*.02));const pPct=Math.min(99,Math.max(50,80+(p/180)*20-Math.abs(p-155)*.1));
    const tA=getAlertLevel(t,280,600),pA=getAlertLevel(p,100,180),fA=getAlertLevel(f,3500,5000);
    const recs=[];if(tA==='CRITICAL')recs.push({title:'CRITICAL: Temperature Breach',desc:`Core temp ${t}\u00B0C exceeds safety limits!`,sev:'critical'});else if(tA==='WARNING')recs.push({title:'Temperature Warning',desc:`Core temp ${t}\u00B0C approaching limits.`,sev:'warning'});
    if(pA==='WARNING'||pA==='CRITICAL')recs.push({title:'Pressure Alert',desc:`Pressure ${p} bar outside optimal.`,sev:'warning'});if(fA!=='SAFE')recs.push({title:'Flow Rate Adjustment',desc:`Flow ${f} L/s needs adjustment.`,sev:'warning'});
    if(!recs.length)recs.push({title:'All Systems Nominal',desc:'Parameters within optimal range.',sev:'safe'});
    const overall=recs.some(r=>r.sev==='critical')?'CRITICAL':recs.some(r=>r.sev==='warning')?'WARNING':'SAFE';
    return{eff:Math.round(eff*10)/10,tPct:Math.round(tPct*10)/10,pPct:Math.round(pPct*10)/10,recs,overall,nFlux:(2.2+Math.random()*.4).toFixed(1)+'e13',cRod:Math.round(60+Math.random()*15),xenon:+(1+Math.random()*.5).toFixed(1)};
  };

  const run=async()=>{
    const t=parseFloat(ct),p=parseFloat(pr),f=parseFloat(fr);if(isNaN(t)||isNaN(p)||isNaN(f))return;
    setSaving(true);setAiActive(true);
    const ai=await geminiAnalyze('reactor',{core_temp:t,pressure:p,flow_rate:f},history);
    let eff,tPct,pPct,recs,overall,nFlux,cRod,xenon;
    if(ai){
      eff=+(ai.efficiency||95);tPct=+(ai.temperature_pct||90);pPct=+(ai.pressure_pct||88);overall=ai.alert_level||'SAFE';
      recs=(ai.recommendations||[]).map(r=>({title:r.title,desc:r.desc||r.description,sev:r.severity||'info'}));
      if(!recs.length)recs.push({title:'AI Analysis Complete',desc:'All parameters assessed.',sev:'safe'});
      nFlux=ai.neutron_flux||(2.2+Math.random()*.4).toFixed(1)+'e13';cRod=ai.control_rod_position||Math.round(60+Math.random()*15);xenon=ai.xenon_level||+(1+Math.random()*.5).toFixed(1);
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);setTrendInfo(ai.trend_analysis||'');setBenchInfo(ai.benchmarks||'');
    } else {
      const fb=fallback(t,p,f);eff=fb.eff;tPct=fb.tPct;pPct=fb.pPct;recs=fb.recs;overall=fb.overall;nFlux=fb.nFlux;cRod=fb.cRod;xenon=fb.xenon;
      setConfidence(null);setReasoning([]);setCrossImpacts([]);setTrendInfo('');setBenchInfo('');
    }
    setRes({eff,tPct,pPct,recs,overall});setAk(k=>k+1);setAiActive(false);
    if(token){
      const row={core_temp:t,pressure:p,flow_rate:f,efficiency:eff,alert_level:overall,neutron_flux:String(nFlux),control_rod_position:typeof cRod==='number'?cRod:parseInt(cRod),xenon_level:typeof xenon==='number'?xenon:parseFloat(xenon),user_id:userId};
      await dbPost('nuclear_reactor_readings',row,token);
      if(overall!=='SAFE')await dbPost('alerts',{venture:'nuclear',module:'reactor_core',title:`Reactor ${overall}`,description:`Temp:${t}\u00B0C P:${p}bar F:${f}L/s`,alert_level:overall,status:'active',user_id:userId},token);
      const fresh=await dbGet('nuclear_reactor_readings',token,'order=created_at.desc&limit=10');if(fresh){setHistory(fresh);setLastRead(fresh[0])}
    }setSaving(false);
  };
  const oc=res?.overall==='CRITICAL'?C.red:res?.overall==='WARNING'?C.orange:C.green;
  const nf=lastRead?.neutron_flux||'-';const cr=lastRead?.control_rod_position?lastRead.control_rod_position+'%':'-';const xl=lastRead?.xenon_level?lastRead.xenon_level+' ppm':'-';
  return(<div><PH red="Reactor Core" white="Analysis" sub="Real-time optimization and analysis"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing...</span></div>}
    {res&&!aiActive&&<div style={{background:oc+'10',border:`1px solid ${oc}25`,borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',animation:'fadeUp .3s'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:oc,animation:'pulse 2s infinite'}}/><span style={{fontSize:'12px',fontWeight:600,color:oc}}>Status: {res.overall}</span>{confidence&&<span style={{fontSize:'10px',color:C.dim,marginLeft:8,fontFamily:'monospace'}}>Confidence: {confidence}%</span>}</div><span style={{fontSize:'10px',color:C.dim,fontFamily:'monospace'}}>Readings: {history.length}</span></div>}
    {!res&&!history.length&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,fontSize:'12px',color:C.cyan}}>No readings yet. Enter parameters and run analysis to get started.</div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Core Performance" delay={.1}>{res?<div key={ak} style={{display:'flex',justifyContent:'space-around',padding:'12px 0 20px',animation:'fadeIn .4s'}}><Gauge value={Math.round(res.eff)} label="Efficiency"/><Gauge value={Math.round(res.tPct)} label="Temperature"/><Gauge value={Math.round(res.pPct)} label="Pressure"/></div>:<div style={{padding:30,textAlign:'center',color:C.muted,fontSize:'12px'}}>Run analysis to see gauges</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,borderTop:`1px solid ${C.border}`,paddingTop:16}}>{[['Neutron Flux',nf,'n/cm\u00B2s'],['Control Rod',cr,'Position'],['Xenon',xl,'Level']].map(([l,v,u])=>(<div key={l} className="card-hover" style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`1px solid ${C.border}`}}><div style={{fontSize:'9px',color:C.muted,textTransform:'uppercase'}}>{l}</div><div style={{fontFamily:'monospace',fontSize:'16px',fontWeight:700,margin:'4px 0 2px'}}>{v}</div><div style={{fontSize:'8px',color:C.muted}}>{u}</div></div>))}</div>
        </Card>
        {res&&<Card title="AI Insights" delay={.2}><div key={ak}>{res.recs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3,color:r.sev==='critical'?C.red:C.text}}>{r.title}</div><div style={{fontSize:'11px',color:C.dim}}>{r.desc}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`,animation:`fadeUp .3s ease-out ${i*.1}s both`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{c.impact}</span></div>))}</div></Card>}
        {trendInfo&&<Card title="Trend Analysis" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {benchInfo&&<Card title="IAEA Benchmark Check" delay={.4}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{benchInfo}</div></Card>}
        {history.length>1&&<Card title="Efficiency History" delay={.45}><LnChart data={history.map(h=>+h.efficiency||0).reverse()} color={C.red} showArea label="Last readings"/></Card>}
      </div>
      <Card title="Parameters" delay={.15}>
        <Inp label="Core Temperature" value={ct} onChange={setCt} unit={"°C"} required min={280} max={600} hint="Range: 280–600°C"/>
        <Inp label="Pressure" value={pr} onChange={setPr} unit="bar" required min={100} max={180} hint="Range: 100–180 bar"/>
        <Inp label="Flow Rate" value={fr} onChange={setFr} unit="L/s" required min={3500} max={5000} hint="Range: 3500–5000 L/s"/>
        <Btn onClick={run} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Run Analysis'}</Btn>
        <Btn outline style={{marginTop:8}} onClick={()=>{setCt('550');setPr('155');setFr('4200')}}>Reset Defaults</Btn>
        {confidence&&<div style={{marginTop:12,padding:'8px 12px',background:C.cyanDim,borderRadius:8,border:`1px solid ${C.cyan}15`}}><div style={{fontSize:'10px',color:C.cyan,fontWeight:600}}>AI CONFIDENCE</div><div style={{fontFamily:'monospace',fontSize:'20px',fontWeight:700,color:C.cyan}}>{confidence}%</div></div>}
      </Card>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// THERMAL & POWER — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function ThermalPage({token,userId}){
  const[tp,setTp]=useState('3200');const[ct,setCt]=useState('290');const[saving,setSaving]=useState(false);const[readings,setReadings]=useState([]);
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[confidence,setConfidence]=useState(null);
  useEffect(()=>{if(!token)return;dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20').then(d=>{if(d?.length){setReadings(d);setTp(String(d[0].target_power||3200));setCt(String(d[0].coolant_temp||290))}});},[token]);
  const save=async()=>{setSaving(true);setAiActive(true);const t=parseFloat(tp),c=parseFloat(ct);if(isNaN(t)||isNaN(c)){setSaving(false);setAiActive(false);return}
    const ai=await geminiAnalyze('thermal',{target_power:t,coolant_temp:c},readings);
    let eff,out,therm,hr,sgSt,tSt,cSt;
    if(ai){
      eff=+(ai.efficiency||94);out=+(ai.current_output||Math.round(t*(eff/100)));therm=+(ai.thermal_load||Math.round(out*.92));hr=+(ai.heat_rate||10600);
      sgSt=ai.steam_generator||'OPTIMAL';tSt=ai.turbine||'OPTIMAL';cSt=ai.condenser||'OPTIMAL';
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);setTrendInfo(ai.trend_analysis||'');
    } else {
      eff=Math.min(99,Math.max(70,94-(Math.abs(t-3200)*.002)-(Math.abs(c-290)*.1)));out=Math.round(t*(eff/100));therm=Math.round(out*.92);hr=Math.round(10500+Math.random()*500);
      sgSt='OPTIMAL';tSt=eff>85?'OPTIMAL':'WARNING';cSt='OPTIMAL';
      setConfidence(null);setReasoning([]);setCrossImpacts([]);setTrendInfo('');
    }
    setAiActive(false);
    await dbPost('nuclear_thermal_readings',{target_power:t,current_output:out,coolant_temp:c,efficiency:Math.round(eff*10)/10,thermal_load:therm,heat_rate:hr,steam_generator_status:sgSt,turbine_status:tSt,condenser_status:cSt,user_id:userId},token);
    const fresh=await dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20');if(fresh)setReadings(fresh);setSaving(false);};
  const last=readings[0];
  return(<div><PH red="Thermal & Power" white="Calculations" sub="Real-time power output and thermal performance"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing thermal data...</span></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Output" value={last?Math.round(+last.current_output)+'':'-'} sub="MW" delay={.05}/><StatCard label="Efficiency" value={last?(+last.efficiency).toFixed(1)+'%':'-'} accent={C.green} delay={.1}/><StatCard label="Thermal Load" value={last?Math.round(+last.thermal_load)+'':'-'} sub="MWh" delay={.15}/><StatCard label="Heat Rate" value={last?Math.round(+last.heat_rate)+'':'-'} sub="BTU/kWh" delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Power Output History" delay={.1}>{readings.length>1?<LnChart data={readings.map(r=>+r.current_output||0).reverse()} color={C.red} showArea label={`Last ${readings.length} readings`}/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>Run calculations to build history</div>}</Card>
        <Card title="Efficiency Trend" delay={.2}>{readings.length>1?<LnChart data={readings.map(r=>+r.efficiency||0).reverse()} color={C.green} showArea label="Efficiency %"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No data yet</div>}</Card>
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{c.impact}</span></div>))}</div></Card>}
        {trendInfo&&<Card title="Trend Analysis" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
      </div>
      <Card title="Power Control" delay={.15}>
        <Inp label="Target Power" value={tp} onChange={setTp} unit="MW" required min={0} max={4000}/>
        <Inp label="Coolant Temp" value={ct} onChange={setCt} unit={"°C"} required min={250} max={320}/>
        <Btn onClick={save} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Run Calculation'}</Btn>
        <div style={{marginTop:16,borderTop:`1px solid ${C.border}`,paddingTop:12}}>{['Steam Generator','Turbine','Condenser'].map(c=><div key={c} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:'12px'}}><span style={{color:C.dim}}>{c}</span><span style={{color:last&&(c==='Turbine'&&last.turbine_status==='WARNING')?C.yellow:last&&(last[c.toLowerCase().replace(/ /g,'_')+'_status']==='WARNING')?C.yellow:C.green,fontWeight:600,fontFamily:'monospace',fontSize:'11px'}}>{last?last[c==='Steam Generator'?'steam_generator_status':c==='Turbine'?'turbine_status':'condenser_status']||'OPTIMAL':'OPTIMAL'}</span></div>)}</div>
      </Card>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// MATERIALS — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function MaterialsPage({token,userId}){
  const[mats,setMats]=useState([]);const[sel,setSel]=useState('');const[saving,setSaving]=useState(false);
  const[newName,setNewName]=useState('');const[newDeg,setNewDeg]=useState('');
  useEffect(()=>{if(!token)return;dbGet('nuclear_materials',token,'order=material_name.asc').then(d=>{if(d?.length){setMats(d);setSel(d[0].id)}});},[token]);
  const addMat=async()=>{if(!newName||isNaN(parseFloat(newDeg)))return;setSaving(true);
    const deg=parseFloat(newDeg);const st=deg>15?'warning':deg>10?'monitor':'safe';
    await dbPost('nuclear_materials',{material_name:newName,degradation_pct:deg,status:st,last_inspection:new Date().toISOString().slice(0,10),remaining_life_months:Math.round((100-deg)/1.5),corrosion_rate:Math.round(deg*.3*100)/100,user_id:userId},token);
    const f=await dbGet('nuclear_materials',token,'order=material_name.asc');if(f)setMats(f);setNewName('');setNewDeg('');setSaving(false);};
  const selMat=mats.find(m=>m.id===sel);
  const avgDeg=mats.length?mats.reduce((a,m)=>a+(+m.degradation_pct||0),0)/mats.length:0;
  const warnCount=mats.filter(m=>m.status==='warning'||m.status==='critical').length;
  return(<div><PH red="Material Performance" white="Predictions" sub="Degradation curves and predictive analysis"/>
    {warnCount>0&&<div style={{background:C.orangeDim,border:`1px solid ${C.orange}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .4s'}}><span style={{fontSize:'16px'}}>{'\u26A0'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.orange}}>{warnCount} Material Warning{warnCount>1?'s':''}</div><div style={{fontSize:'11px',color:C.dim}}>Inspection recommended</div></div></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Avg Degradation" value={avgDeg.toFixed(1)+'%'} accent={C.red} delay={.05}/><StatCard label="Tracked" value={String(mats.length)} sub={`${warnCount} warnings`} accent={C.green} delay={.1}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Degradation Levels" delay={.1}>{mats.length?<BrChart data={mats.map(m=>+m.degradation_pct||0)} labels={mats.map(m=>m.material_name?.slice(0,10))}/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No materials tracked yet. Add one.</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>{mats.map(m=>(<div key={m.id} style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'3px 0'}}><span style={{color:C.dim}}>{m.material_name}</span><span style={{fontFamily:'monospace',color:(+m.degradation_pct)>12?C.orange:C.green,fontWeight:600}}>{(+m.degradation_pct).toFixed(1)}%</span></div>))}</div>
        </Card>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Add Material" delay={.15}>
          <Inp label="Material Name" value={newName} onChange={setNewName} required hint="e.g. Zircaloy-4"/>
          <Inp label="Degradation %" value={newDeg} onChange={setNewDeg} unit="%" required min={0} max={100}/>
          <Btn onClick={addMat} disabled={saving}>{saving?'Processing...':'Add Material'}</Btn>
        </Card>
        {selMat&&<Card title={`Details: ${selMat.material_name}`} delay={.25}>
          <div style={{fontSize:'24px',fontFamily:'monospace',fontWeight:700,color:(+selMat.degradation_pct)>12?C.orange:C.red,marginBottom:8}}>{(+selMat.degradation_pct).toFixed(1)}%</div>
          {[['Status',selMat.status?.toUpperCase()],['Remaining Life',selMat.remaining_life_months+' months'],['Corrosion Rate',selMat.corrosion_rate],['Last Inspection',selMat.last_inspection]].map(([l,v])=><div key={l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'11px'}}><span style={{color:C.muted}}>{l}</span><span style={{fontFamily:'monospace',color:C.text}}>{v||'-'}</span></div>)}
        </Card>}
        {mats.length>0&&<Card title="Select Material" delay={.2}>{mats.map(m=><div key={m.id} onClick={()=>setSel(m.id)} style={{display:'flex',justifyContent:'space-between',padding:'6px 8px',borderRadius:6,cursor:'pointer',background:sel===m.id?C.redDim:'transparent',marginBottom:2,transition:'all .2s'}}><span style={{fontSize:'11px',color:sel===m.id?C.red:C.dim}}>{m.material_name}</span><span style={{fontSize:'10px',fontFamily:'monospace',color:(+m.degradation_pct)>12?C.orange:C.green}}>{(+m.degradation_pct).toFixed(1)}%</span></div>)}</Card>}
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// OPERATIONS — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function OperationsPage({token,userId}){
  const[tasks,setTasks]=useState([]);const[filter,setFilter]=useState('All');const[hov,setHov]=useState(null);
  const[saving,setSaving]=useState(false);const[newTask,setNewTask]=useState('');const[newDate,setNewDate]=useState('');const[newPri,setNewPri]=useState('MEDIUM');const[newHrs,setNewHrs]=useState('4');
  useEffect(()=>{if(!token)return;dbGet('nuclear_maintenance',token,'order=scheduled_date.asc').then(d=>{if(d)setTasks(d)});},[token]);
  const add=async()=>{if(!newTask||!newDate)return;setSaving(true);
    await dbPost('nuclear_maintenance',{task_name:newTask,scheduled_date:newDate,duration_hours:parseFloat(newHrs)||4,priority:newPri,status:'scheduled',assigned_team:'Team Alpha',user_id:userId},token);
    const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);setNewTask('');setNewDate('');setSaving(false);};
  const complete=async(id)=>{await dbPatch('nuclear_maintenance',id,{status:'completed',completed_at:new Date().toISOString()},token);const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);};
  const active=tasks.filter(t=>t.status!=='completed'&&t.status!=='cancelled');
  const completed=tasks.filter(t=>t.status==='completed');
  const filtered=filter==='All'?active:active.filter(t=>t.priority===filter.toUpperCase());
  const nextDays=active.length?Math.max(0,Math.ceil((new Date(active[0]?.scheduled_date)-new Date())/86400000)):'-';
  const priC={CRITICAL:C.red,HIGH:C.yellow,MEDIUM:C.cyan,LOW:C.green};
  return(<div><PH red="Operational" white="Monitoring" sub="Maintenance scheduling and timeline management"/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Next Maintenance" value={String(nextDays)} sub="days" delay={.05}/><StatCard label="Scheduled" value={String(active.length)} sub="Active tasks" delay={.1}/><StatCard label="Completed" value={String(completed.length)} accent={C.green} delay={.15}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <Card title="Maintenance Timeline" delay={.1} actions={<div style={{display:'flex',gap:6}}>{['All','Critical','High','Medium'].map(f=><Pill key={f} active={filter===f} onClick={()=>setFilter(f)}>{f}</Pill>)}</div>}>
        {filtered.length?filtered.map((t,i)=>(<div key={t.id} onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)} style={{background:hov===t.id?C.bgCardHover:C.bg,border:`1px solid ${hov===t.id?(priC[t.priority]||C.cyan)+'30':C.border}`,borderRadius:10,padding:'14px 16px',marginBottom:8,borderLeft:`3px solid ${priC[t.priority]||C.cyan}`,animation:`slideIn .3s ease-out ${i*.05}s both`,transition:'all .25s',cursor:'pointer',transform:hov===t.id?'translateX(4px)':'none'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:'13px',fontWeight:500}}>{t.task_name}</div><div style={{fontSize:'10px',color:C.muted,marginTop:2}}>{t.scheduled_date} \u00B7 {t.duration_hours}h{t.assigned_team?` \u00B7 ${t.assigned_team}`:''}</div></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{background:(priC[t.priority]||C.cyan)+'18',color:priC[t.priority]||C.cyan,fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:4}}>{t.priority}</span><button onClick={e=>{e.stopPropagation();complete(t.id)}} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'9px',padding:'2px 6px',cursor:'pointer'}}>{'\u2713'}</button></div></div>
        </div>)):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No tasks. Add one.</div>}
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Add Task" delay={.15}>
          <Inp label="Task Name" value={newTask} onChange={setNewTask} required/>
          <div style={{marginBottom:18}}><label style={{fontSize:'12px',color:C.dim,fontWeight:500,display:'block',marginBottom:6}}>Date <span style={{color:C.red}}>*</span></label><input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="input-focus" style={{width:'100%',background:C.bgInput,border:`1.5px solid ${C.borderLight}`,borderRadius:8,padding:'11px 14px',color:C.text,fontSize:'14px',outline:'none',boxSizing:'border-box',colorScheme:'dark'}}/></div>
          <div style={{display:'flex',gap:8,marginBottom:18}}><div style={{flex:1}}><label style={{fontSize:'12px',color:C.dim,display:'block',marginBottom:6}}>Priority</label><select value={newPri} onChange={e=>setNewPri(e.target.value)} style={{width:'100%',background:C.bgInput,border:`1.5px solid ${C.borderLight}`,borderRadius:8,padding:'11px',color:C.text,fontSize:'13px',outline:'none',appearance:'none'}}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div><div style={{flex:1}}><Inp label="Hours" value={newHrs} onChange={setNewHrs} min={1} max={72}/></div></div>
          <Btn onClick={add} disabled={saving}>{saving?'Processing...':'Schedule Task'}</Btn>
        </Card>
        {completed.length>0&&<Card title="Completed" delay={.25}>{completed.slice(0,5).map((t,i)=><div key={t.id} style={{display:'flex',gap:8,alignItems:'center',padding:'6px 0',fontSize:'11px',color:C.dim}}><div style={{width:6,height:6,borderRadius:'50%',background:C.green,flexShrink:0}}/>{t.task_name}</div>)}</Card>}
        <Card title="Statistics" delay={.3}><PBar value={completed.length&&tasks.length?Math.round(completed.length/tasks.length*100):0} color={C.green} label="Completion Rate"/></Card>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// SAFETY & COMPLIANCE — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function SafetyPage({token,userId}){
  const[alerts,setAlerts]=useState([]);const[comp,setComp]=useState([]);const[saving,setSaving]=useState(false);
  const[newStd,setNewStd]=useState('');const[newCode,setNewCode]=useState('');
  useEffect(()=>{if(!token)return;
    dbGet('alerts',token,'order=created_at.desc&limit=20').then(d=>{if(d)setAlerts(d)});
    dbGet('nuclear_compliance',token,'order=standard_name.asc').then(d=>{if(d)setComp(d)});
  },[token]);
  const resolve=async(id)=>{await dbPatch('alerts',id,{status:'resolved',resolved_at:new Date().toISOString()},token);const f=await dbGet('alerts',token,'order=created_at.desc&limit=20');if(f)setAlerts(f);};
  const addComp=async()=>{if(!newStd)return;setSaving(true);
    await dbPost('nuclear_compliance',{standard_name:newStd,standard_code:newCode||null,last_review:new Date().toISOString().slice(0,10),status:'PENDING',user_id:userId},token);
    const f=await dbGet('nuclear_compliance',token,'order=standard_name.asc');if(f)setComp(f);setNewStd('');setNewCode('');setSaving(false);};
  const activeAlerts=alerts.filter(a=>a.status==='active');
  const critCount=activeAlerts.filter(a=>a.alert_level==='CRITICAL').length;
  const warnCount=activeAlerts.filter(a=>a.alert_level==='WARNING').length;
  const compOk=comp.filter(c=>c.status==='COMPLIANT').length;
  const alC={CRITICAL:C.red,WARNING:C.orange,MONITOR:C.yellow,SAFE:C.green};
  return(<div><PH red="Safety & Compliance" white="Flagging" sub="Alert monitoring and regulatory compliance"/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Critical" value={String(critCount)} accent={C.red} delay={.05}/><StatCard label="Warnings" value={String(warnCount)} accent={C.yellow} delay={.1}/><StatCard label="Active" value={String(activeAlerts.length)} delay={.15}/><StatCard label="Compliance" value={`${compOk}/${comp.length}`} accent={C.green} delay={.2}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <Card title="Safety Alerts" delay={.1}>
        {alerts.length?alerts.map((a,i)=>{const ac=alC[a.alert_level]||C.gray;return(<div key={a.id} style={{background:ac+'08',border:`1px solid ${ac}20`,borderRadius:10,padding:'14px 16px',marginBottom:8,animation:`fadeUp .3s ease-out ${i*.06}s both`}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><div style={{fontSize:'13px',fontWeight:600}}>{a.title||'Alert'}</div><div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{fontSize:'9px',fontWeight:700,color:a.status==='resolved'?C.green:a.status==='monitoring'?C.yellow:C.cyan}}>{a.status?.toUpperCase()}</span>{a.status==='active'&&<button onClick={()=>resolve(a.id)} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'8px',padding:'2px 6px',cursor:'pointer'}}>Resolve</button>}</div></div>
          <div style={{fontSize:'11px',color:C.dim,marginBottom:4}}>{a.description||''}</div>
          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'9px',color:C.muted,fontFamily:'monospace'}}>{a.created_at?new Date(a.created_at).toLocaleString():''}</span><span style={{fontSize:'8px',background:ac+'15',color:ac,padding:'2px 6px',borderRadius:3,fontWeight:600}}>{a.alert_level}</span></div>
        </div>)}):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No alerts. System clean.</div>}
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Compliance Standards" delay={.15}>
          {comp.length?comp.map((c,i)=><div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<comp.length-1?`1px solid ${C.border}`:'none'}}><div><div style={{fontSize:'11px',fontWeight:500}}>{c.standard_name}</div>{c.standard_code&&<div style={{fontSize:'9px',color:C.muted}}>{c.standard_code}</div>}</div><span style={{fontSize:'9px',fontWeight:700,color:c.status==='COMPLIANT'?C.green:c.status==='PENDING'?C.yellow:C.red}}>{c.status}</span></div>)
          :<div style={{color:C.muted,fontSize:'12px',textAlign:'center',padding:12}}>No standards tracked. Add one.</div>}
        </Card>
        <Card title="Add Standard" delay={.25}>
          <Inp label="Standard Name" value={newStd} onChange={setNewStd} required hint="e.g. NRC 10 CFR 50"/>
          <Inp label="Standard Code" value={newCode} onChange={setNewCode} hint="Optional"/>
          <Btn onClick={addComp} disabled={saving}>{saving?'Processing...':'Add Standard'}</Btn>
        </Card>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// ENERGY YIELD — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function EnergyPage({token,userId}){
  const[ft,setFt]=useState('45');const[area,setArea]=useState('10');const[loc,setLoc]=useState('Main Entrance');
  const[saving,setSaving]=useState(false);const[readings,setReadings]=useState([]);const[model,setModel]=useState('ai');
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[deployInsights,setDeployInsights]=useState('');const[confidence,setConfidence]=useState(null);
  useEffect(()=>{if(!token)return;dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12').then(d=>{if(d?.length){setReadings(d);setFt(String(d[0].foot_traffic_per_min||45));setArea(String(d[0].area_sqm||10));setLoc(d[0].location||'Main Entrance')}});},[token]);
  const calc=async()=>{const f=parseFloat(ft),a=parseFloat(area);if(isNaN(f)||isNaN(a))return;setSaving(true);setAiActive(true);
    const ai=await geminiAnalyze('energy',{location:loc,foot_traffic_per_min:f,area_sqm:a},readings);
    let raw,net,daily,monthly,eff;
    if(ai){
      raw=+(ai.raw_power_w||(f*a*3.5*.01));net=+(ai.net_power_w||(raw*.88));daily=+(ai.daily_kwh||(net*16/1000));monthly=+(ai.monthly_kwh||(daily*30));eff=+(ai.efficiency_pct||3.08);
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setTrendInfo(ai.trend_analysis||'');setDeployInsights(ai.deployment_insights||'');
    } else {
      raw=f*a*3.5*.01;net=raw*(1-.12);daily=net*16/1000;monthly=daily*30;eff=3.5*(1-.12)*(1-(Math.random()*.02));
      setConfidence(null);setReasoning([]);setTrendInfo('');setDeployInsights('');
    }
    setAiActive(false);
    await dbPost('nuclear_egm_data',{location:loc,foot_traffic_per_min:f,area_sqm:a,raw_power_w:Math.round(raw*100)/100,net_power_w:Math.round(net*100)/100,daily_kwh:Math.round(daily*100)/100,monthly_kwh:Math.round(monthly*100)/100,efficiency_pct:Math.round(eff*100)/100,mat_condition:'good',user_id:userId},token);
    const fresh=await dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12');if(fresh)setReadings(fresh);setSaving(false);};
  const last=readings[0];
  const annualRev=last?((+last.monthly_kwh)*12*0.12).toFixed(2):'-';
  return(<div><PH red="Energy Yield" white="Projections" sub="EGM mat yield projections and forecast"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing EGM data...</span></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Daily Yield" value={last?(+last.daily_kwh).toFixed(2)+'':'-'} sub="kWh" delay={.05}/><StatCard label="Monthly" value={last?(+last.monthly_kwh).toFixed(1)+'':'-'} sub="kWh" delay={.1}/><StatCard label="Net Power" value={last?(+last.net_power_w).toFixed(1)+'':'-'} sub="W" delay={.15}/><StatCard label="Annual Revenue" value={annualRev!=='-'?'$'+annualRev:'-'} sub="USD" accent={C.green} delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Yield History" delay={.1}>{readings.length>1?<LnChart data={readings.map(r=>+r.monthly_kwh||0).reverse()} color={C.red} showArea label="Monthly kWh"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>Run calculations to build history</div>}</Card>
        <Card title="Efficiency Trend" delay={.2}>{readings.length>1?<LnChart data={readings.map(r=>+r.efficiency_pct||0).reverse()} color={C.green} label="Efficiency %"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No data yet</div>}</Card>
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {trendInfo&&<Card title="Traffic & Yield Trends" delay={.3}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {deployInsights&&<Card title="Deployment Insights" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{deployInsights}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="EGM Parameters" delay={.15}>
          <Inp label="Location" value={loc} onChange={setLoc} required/>
          <Inp label="Foot Traffic" value={ft} onChange={setFt} unit="steps/min" required min={1} max={200}/>
          <Inp label="Mat Area" value={area} onChange={setArea} unit="m\u00B2" required min={1} max={500}/>
          <Btn onClick={calc} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Run Calculation'}</Btn>
        </Card>
        <Card title="Projection Model" delay={.25}>
          {[{id:'ai',l:'AI Optimized',d:'Gemini-powered projection'},{id:'linear',l:'Linear Regression',d:'Traditional'},{id:'hybrid',l:'Hybrid',d:'AI + historical'}].map(m=>(
            <div key={m.id} onClick={()=>setModel(m.id)} style={{display:'flex',gap:10,alignItems:'center',padding:'8px 0',cursor:'pointer'}}>
              <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${model===m.id?C.red:C.borderLight}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>{model===m.id&&<div style={{width:8,height:8,borderRadius:'50%',background:C.red}}/>}</div>
              <div><div style={{fontSize:'12px',fontWeight:500}}>{m.l}</div><div style={{fontSize:'9px',color:C.muted}}>{m.d}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// APP — Session persistence, routing, realtime status
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[user,setUser]=useState(null);const[page,setPage]=useState('overview');const[loading,setLoading]=useState(true);
  const token=user?.token;const userId=user?.id;
  const sysStatus=useSystemStatus(token);

  useEffect(()=>{try{const s=sessionStorage.getItem('llyana_session');if(s){const p=JSON.parse(s);fetch(`${SB_URL}/auth/v1/user`,{headers:{Authorization:`Bearer ${p.token}`,apikey:SB_KEY}}).then(r=>{if(r.ok)setUser(p);else sessionStorage.removeItem('llyana_session');setLoading(false)}).catch(()=>{sessionStorage.removeItem('llyana_session');setLoading(false)});return}}catch(e){}setLoading(false)},[]);
  useEffect(()=>{try{sessionStorage.setItem('llyana_page',page)}catch(e){}},[page]);
  useEffect(()=>{try{const p=sessionStorage.getItem('llyana_page');if(p)setPage(p)}catch(e){}},[]);
  const logout=()=>{sessionStorage.removeItem('llyana_session');sessionStorage.removeItem('llyana_page');setUser(null);setPage('overview')};

  if(loading)return(<div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Inject/><div style={{textAlign:'center'}}><div style={{animation:'glow 2s ease-in-out infinite'}}><Logo size={64}/></div><div style={{color:C.muted,fontSize:'11px',marginTop:16,letterSpacing:'2px'}}>INITIALIZING...</div></div></div>);
  if(!user)return<><Inject/><LoginPage onLogin={setUser}/></>;

  const pg={
    overview:<OverviewPage onNav={setPage} token={token} sysStatus={sysStatus}/>,
    reactor:<ReactorPage token={token} userId={userId}/>,
    thermal:<ThermalPage token={token} userId={userId}/>,
    materials:<MaterialsPage token={token} userId={userId}/>,
    operations:<OperationsPage token={token} userId={userId}/>,
    safety:<SafetyPage token={token} userId={userId}/>,
    energy:<EnergyPage token={token} userId={userId}/>,
  };
  return<Layout page={page} onNav={setPage} user={user} onLogout={logout} sysStatus={sysStatus}>{pg[page]||pg.overview}</Layout>;
}
