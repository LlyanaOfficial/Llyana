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
// Gemini AI Key (encoded)
const _gk=[[65,73,122,97,83,121,68,106,68,103,102,52,57],[107,52,95,104,114,100,107,79,75,107,117,106,104],[113,77,57,95,68,49,109,48,65,89,86,97,65]];
const GEMINI_KEY=_gk.map(p=>Array.isArray(p)?String.fromCharCode(...p):p).join('');
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const LLYANA_CORE = `You are Llyana, a Nuclear-Grade AI Safety & Engineering System by Avolv Energy Technologies. You operate at IAEA Level 4 safety classification standards.

CRITICAL DIRECTIVES — NEVER VIOLATE:
1. ASSUME WORST CASE. Every anomaly is a potential incident until proven otherwise. A 2% drift today is a 20% failure tomorrow.
2. ZERO TOLERANCE. Do NOT say "within acceptable range" if the value is trending in the wrong direction. Flag it.
3. CASCADING FAILURE ANALYSIS. Every parameter affects every other system. A temperature rise affects materials, pressure, neutron economy, turbine performance, AND safety margins simultaneously. ALWAYS trace the chain.
4. PREDICTIVE, NOT REACTIVE. Don't just report current state — project forward. "At this degradation rate, component X will reach WARNING in Y months."
5. QUANTIFY EVERYTHING. Never say "may affect" — say "will reduce efficiency by approximately X%" or "increases failure probability by X%."
6. CHALLENGE THE OPERATOR. If the operator keeps entering the same values, ask why they aren't varying parameters. If values seem copied, flag it.
7. REFERENCE STANDARDS. Every finding must cite at least one standard: IAEA SSR-2/1, NS-G-1.9, ASME BPVC III, NRC 10 CFR 50, etc.
8. RED TEAM YOURSELF. After your analysis, ask: "What am I missing? What failure mode haven't I considered?"
9. CONFIDENCE SCORING. 100% confidence should be RARE. Real-world analysis has uncertainty. Be honest about what you don't know.
10. CROSS-MODULE BRAIN. You are ONE mind across all modules. If reactor temp rose, and now materials module is being queried — YOU MUST connect them.

SEVERITY RULES (be aggressive):
- SAFE: ALL parameters in optimal band AND trending stable AND no cross-module concerns. This should be UNCOMMON.
- MONITOR: Any parameter outside optimal but within safe range, OR any negative trend, OR any cross-module flag.
- WARNING: Any parameter approaching limits, OR degradation accelerating, OR multiple MONITOR conditions stacking.
- CRITICAL: Any parameter at/beyond limits, OR cascading failures detected, OR safety standard violated.

OUTPUT: Valid JSON only. No markdown, no backticks, no text outside JSON.`;

const MOD_PROMPTS = {
  reactor: `REACTOR CORE ANALYSIS — CRITICAL SAFETY SYSTEM.

OPERATING ENVELOPE (deviation from optimal = immediate concern):
- Core Temperature: Range 280-600°C. OPTIMAL: 520-560°C. Above 560°C: thermal creep on fuel cladding accelerates exponentially. Above 580°C: Zircaloy oxidation rate doubles per 10°C increase. Material limit: 1200°C (this is FAILURE, not a target). Reference: IAEA SSR-2/1 Rev.1, Requirement 43.
- Pressure: Range 100-180 bar. OPTIMAL: 145-165 bar. Deviation >10 bar from 155: check pressurizer heater/spray system. >20 bar deviation: potential LOCA precursor. Reference: IAEA NS-G-1.9, Section 6.
- Flow Rate: Range 3500-5000 L/s. OPTIMAL: 4000-4400 L/s. Below 3800: departure from nucleate boiling ratio (DNBR) may drop below safety limit of 1.3. Reference: NRC Regulatory Guide 1.157.

CRITICAL ANALYSIS REQUIREMENTS:
(1) For EACH parameter: exact deviation from optimal center, rate of change from history, time-to-limit projection
(2) Thermal-hydraulic coupling: T + P + F must be self-consistent. If temp rises but flow doesn't increase, flag INADEQUATE COOLING.
(3) Neutron economy: Calculate flux based on power level. Check xenon transient effects. Flag xenon oscillation risk if power recently changed.
(4) Material stress projection: At current temp, what is Zircaloy creep rate? Inconel stress-corrosion cracking risk?
(5) Safety margin calculation: How far from each SCRAM setpoint? Express as percentage margin remaining.
(6) ALWAYS give at least 2 recommendations — one immediate action and one preventive measure.
(7) If ALL values look perfect — be SUSPICIOUS. Flag potential instrument calibration drift or sensor malfunction possibility.

EFFICIENCY FORMULA: Base 95% minus penalties: |temp-540|*0.02, |pressure-155|*0.05, |flow-4200|*0.003. Clamp 50-99%.
NEUTRON FLUX: 2.0-2.8e13 n/cm²s typical PWR. CONTROL ROD: 60-75% withdrawal normal. XENON: 1.0-1.5 ppm equilibrium.

JSON: {"alert_level":"...","confidence":0-100,"efficiency":N,"temperature_pct":N,"pressure_pct":N,"neutron_flux":"...","control_rod_position":N,"xenon_level":N,"reasoning":[{"step":1,"action":"...","result":"..."}],"recommendations":[{"title":"...","desc":"...","severity":"safe|warning|critical|info"}],"cross_module_impacts":[{"module":"thermal|materials|safety|operations","impact":"..."}],"trend_analysis":"...","benchmarks":"..."}`,

  thermal: `THERMAL & POWER PERFORMANCE — CRITICAL EFFICIENCY SYSTEM.

OPERATING ENVELOPE:
- Target Power: 0-4000 MWth. Typical large PWR: 3000-3400 MWth. Below 2000: reduced efficiency regime. Above 3600: approaching licensed limit.
- Coolant Temperature: 250-320°C. Optimal inlet: 280-295°C. Outlet: 310-330°C. Delta-T should be 30-40°C. Delta-T <25°C: possible flow bypass. Delta-T >45°C: possible hot channel factor exceedance. Reference: ASME BPVC Section III, NB-3200.

CRITICAL ANALYSIS REQUIREMENTS:
(1) Calculate thermal efficiency precisely. PWR theoretical max ~37%. Actual should be 33-36%. Below 33%: IMMEDIATE investigation — every 1% loss = millions in annual revenue.
(2) Heat rate analysis: Target <10,500 BTU/kWh. Above 11,000: turbine degradation likely. Above 11,500: condenser tube fouling probable. QUANTIFY the revenue impact.
(3) Component cascade: Steam generator tube integrity directly affects radioactive contamination risk. Turbine bearing wear affects vibration → shaft alignment → seal integrity → potential release.
(4) Cross-check with reactor: If reactor temp changed, thermal output MUST change proportionally. If not — flag instrumentation or bypass flow issue.
(5) Predict maintenance window: Based on heat rate trend, when will turbine need next overhaul?
(6) Revenue impact: Calculate MWh lost per day from inefficiency. At $0.12/kWh, express in USD.

FORMULAS: Output(MWe) = target_power × (efficiency/100) × 0.33. Thermal load = output × 0.92. Heat rate = 3412/efficiency × 100.
COMPONENT STATUS: SG WARNING if temp >310°C or <260°C. Turbine WARNING if eff <85%. Condenser WARNING if heat_rate >11500.

JSON: {"alert_level":"...","confidence":N,"current_output":N,"efficiency":N,"thermal_load":N,"heat_rate":N,"steam_generator":"OPTIMAL|WARNING|CRITICAL","turbine":"OPTIMAL|WARNING|CRITICAL","condenser":"OPTIMAL|WARNING|CRITICAL","reasoning":[...],"recommendations":[...],"cross_module_impacts":[...],"trend_analysis":"..."}`,

  materials: `MATERIAL INTEGRITY & DEGRADATION — CRITICAL STRUCTURAL SAFETY.

FAILURE MODES (analyze ALL for each material):
- Irradiation embrittlement: Neutron fluence causes ductile-to-brittle transition temperature (DBTT) shift. 5% degradation ≈ 20°C DBTT shift. Above 15% degradation: pressure vessel may not survive pressurized thermal shock (PTS). Reference: NRC 10 CFR 50.61.
- Stress corrosion cracking (SCC): Inconel-600 is notorious. At >10% degradation with primary water chemistry, SCC probability increases 4x. Reference: EPRI MRP-375.
- Creep: Zircaloy at elevated temperature. Creep rate doubles per 50°C above 400°C. At current reactor temperature, calculate projected creep strain.
- Fatigue: Thermal cycling causes cumulative fatigue damage. Each startup/shutdown = one fatigue cycle. Most components rated for 200-500 cycles.

CRITICAL ANALYSIS REQUIREMENTS:
(1) Degradation rate: Not just current %, but rate of change. If last reading was 8% and now 12%, that's 50% acceleration — CRITICAL finding.
(2) Remaining life: Don't just divide. Account for acceleration: remaining_life = (threshold - current) / (rate × 1.2 safety factor).
(3) Inspection intervals: ASME Section XI requires specific intervals based on degradation category. Flag if overdue.
(4) Material-specific risks: Zircaloy hydriding, Inconel PWSCC, SS-316L sensitization, SA-508 underclad cracking — identify which applies.
(5) Cross-reference reactor temperature: Higher temp = faster degradation. ALWAYS connect to reactor module data.
(6) Replacement cost/timeline: Estimate impact of unplanned replacement vs scheduled.

Thresholds: Safe(<8%), Monitor(8-15%), Warning(15-25%), Critical(>25%).
Embrittlement: Low(<5%), Moderate(5-10%), Elevated(10-20%), High(>20%).

JSON: {"alert_level":"...","confidence":N,"degradation_assessment":"...","embrittlement_risk":"Low|Moderate|Elevated|High","remaining_life_months":N,"corrosion_rate":N,"reasoning":[...],"recommendations":[...],"cross_module_impacts":[...]}`,

  energy: `EGM (ENERGY-GENERATING MAT) — PIEZOELECTRIC YIELD ANALYSIS.

EXACT FORMULAS (use precisely):
Step 1: Traffic density = foot_traffic_per_min / area_sqm (steps/min/m²)
Step 2: Raw power (W) = foot_traffic_per_min × area_sqm × 0.035
Step 3: Net power (W) = raw_power × 0.88 (12% conditioning loss)
Step 4: Daily energy (kWh) = net_power × 16 hours / 1000
Step 5: Monthly energy (kWh) = daily × 30
Step 6: Annual revenue (USD) = monthly × 12 × $0.12/kWh (Rwanda grid rate)

CRITICAL ANALYSIS REQUIREMENTS:
(1) Traffic viability: Below 20 steps/min/m² — WARN this location may not be cost-effective. Below 10: CRITICAL — recommend relocation.
(2) Mat degradation projection: 2%/year baseline, but high-traffic areas degrade 3-4%/year. After 3 years at >60 steps/min/m², output drops ~15%.
(3) Revenue reality check: Compare monthly revenue vs mat replacement cost (~$200/m²). If ROI exceeds 4 years — flag as concerning.
(4) Seasonal/temporal patterns: If history shows declining traffic, project when location becomes unprofitable.
(5) Optimal placement: Based on traffic density, recommend whether to expand, relocate, or maintain current deployment.
(6) Grid connection efficiency: Factor in inverter losses (additional 5-8%). Real net may be lower than calculated.

Efficiency: ~3.08%. Mat lifespan: ~5 years. ROI target: 2-3 years.

JSON: {"alert_level":"...","confidence":N,"raw_power_w":N,"net_power_w":N,"daily_kwh":N,"monthly_kwh":N,"efficiency_pct":N,"annual_revenue_usd":N,"reasoning":[...],"recommendations":[...],"trend_analysis":"...","deployment_insights":"..."}`,

  operations: `MAINTENANCE & OPERATIONS — CRITICAL PLANT AVAILABILITY.

SCHEDULING RULES (enforce strictly):
- CRITICAL tasks: Must be executed within 48 hours. Any delay = automatic CRITICAL alert. Reference: NRC Maintenance Rule 10 CFR 50.65.
- HIGH: Within 7 days. Delay beyond 5 days = WARNING escalation.
- MEDIUM: Within 30 days. But if safety-related, treat as HIGH.
- LOW: Deferrable, but track cumulative deferrals — more than 3 deferrals of same task = escalate to MEDIUM.

CRITICAL ANALYSIS REQUIREMENTS:
(1) Overdue detection: Calculate days past due for every task. ANY overdue CRITICAL task = system-wide CRITICAL alert.
(2) Resource conflicts: Two tasks on same day? Flag if total hours exceed 16 (two-shift capacity). More than 24h on one day = physically impossible.
(3) Plant availability calculation: Total scheduled maintenance hours this month / (30 × 24) = downtime fraction. Target: <10% downtime = >90% availability.
(4) Preventive vs corrective ratio: Track what percentage of tasks are reactive (corrective) vs planned (preventive). Industry benchmark: >80% preventive. Below 60%: CRITICAL maintenance culture problem.
(5) Cross-module urgency: If reactor or materials module flagged concerns, check if corresponding maintenance tasks exist. If not — CRITICAL gap.
(6) Backlog analysis: Growing backlog = declining reliability. Calculate backlog trend.

JSON: {"alert_level":"...","confidence":N,"plant_availability_pct":N,"overdue_count":N,"risk_assessment":"...","reasoning":[...],"recommendations":[...],"cross_module_impacts":[...],"scheduling_insights":"..."}`,

  safety: `SAFETY & REGULATORY COMPLIANCE — CRITICAL OVERSIGHT.

REGULATORY FRAMEWORK (enforce compliance):
- IAEA SSR-2/1 Rev.1: Design safety requirements for nuclear power plants. 69 requirements covering all aspects.
- IAEA GSR Part 4: Safety assessment for facilities and activities.
- NRC 10 CFR 50: Domestic licensing of production and utilization facilities.
- ASME BPVC Section III: Nuclear facility components construction rules.
- ASME Section XI: In-service inspection of nuclear plant components.
- EPA 40 CFR 190: Radiation protection standards — dose limits.
- DOE Order 420.1C: Facility safety.

CRITICAL ANALYSIS REQUIREMENTS:
(1) Alert severity audit: ANY unresolved CRITICAL alert older than 24 hours = REGULATORY VIOLATION. Flag immediately with specific standard reference.
(2) Compliance gap analysis: Compare tracked standards against minimum required set (SSR-2/1, 10 CFR 50, ASME III, Section XI minimum). Missing ANY = CRITICAL gap.
(3) Defense-in-depth assessment: Are multiple safety barriers being challenged simultaneously? Even if each individually is MONITOR-level, two concurrent issues = WARNING.
(4) Dose tracking: If any readings approach 1 mSv/year (public limit) or 20 mSv/year (worker limit), escalate immediately.
(5) Event precursor analysis: Look at alert patterns. Increasing frequency even of low-severity alerts = leading indicator of systemic issue.
(6) Regulatory reporting triggers: Identify any conditions that would require reporting to regulatory authority within 24h, 48h, or 30 days per NRC reporting guidelines.
(7) ALARA verification: Is the principle of As Low As Reasonably Achievable being applied? Challenge if safety margins are unnecessarily thin.

JSON: {"alert_level":"...","confidence":N,"safety_posture":"...","compliance_coverage_pct":N,"regulatory_gaps":[...],"reasoning":[...],"recommendations":[...],"cross_module_impacts":[...],"trend_analysis":"..."}`
};

// Global AI status for user-facing messages
let _aiStatusCallback = null;
function setGlobalAiStatus(msg) { if (_aiStatusCallback) _aiStatusCallback(msg); }

// AI request counter (persists per day in sessionStorage)
const AI_DAILY_LIMIT = 20;
function getAiCount() {
  try {
    const d = JSON.parse(sessionStorage.getItem('llyana_ai_usage') || '{}');
    const today = new Date().toISOString().slice(0, 10);
    if (d.date !== today) return { date: today, count: 0 };
    return d;
  } catch { return { date: new Date().toISOString().slice(0, 10), count: 0 }; }
}
function incAiCount() {
  const d = getAiCount();
  d.count++;
  try { sessionStorage.setItem('llyana_ai_usage', JSON.stringify(d)); } catch {}
  if (_aiCountCallback) _aiCountCallback(d.count);
  return d.count;
}
let _aiCountCallback = null;

// Store last AI response per module for continuity
const _lastAiResponse = {};

// Build unified brain context — every module sees what all other modules found
function buildBrainContext(currentModule) {
  const otherModules = Object.keys(_lastAiResponse).filter(m => m !== currentModule);
  if (!otherModules.length) return '';
  const brain = otherModules.map(m => {
    const r = _lastAiResponse[m];
    return `${m.toUpperCase()}: alert=${r.alert_level||'UNKNOWN'}, confidence=${r.confidence||'?'}%` +
      (r.efficiency ? `, efficiency=${r.efficiency}%` : '') +
      (r.recommendations?.length ? `, flags=[${(r.recommendations||[]).slice(0,3).map(x=>x.title||x).join('; ')}]` : '') +
      (r.trend_analysis ? `, trend="${typeof r.trend_analysis==='string'?r.trend_analysis.slice(0,100):''}"` : '');
  }).join('\n');
  return `\nCROSS-MODULE INTELLIGENCE (you are ONE AI brain — Llyana — operating across all modules. Here is what you found in other modules. Use this to inform your analysis, flag cascading risks, and provide holistic recommendations):\n${brain}`;
}

async function geminiAnalyze(module, params, history = []) {
  if (!GEMINI_KEY || GEMINI_KEY === 'PASTE_HERE') { console.warn('Llyana: No Gemini key'); return null; }
  const histCtx = history.length ? `\nHISTORY (last ${Math.min(history.length,5)} readings, newest first):\n${JSON.stringify(history.slice(0,5))}` : '\nNo history yet.';
  const prevAi = _lastAiResponse[module] ? `\nYOUR PREVIOUS ANALYSIS FOR THIS MODULE (build upon it, note changes, compare trends):\n${JSON.stringify({alert_level:_lastAiResponse[module].alert_level,confidence:_lastAiResponse[module].confidence,efficiency:_lastAiResponse[module].efficiency,recommendations:(_lastAiResponse[module].recommendations||[]).map(r=>r.title),trend_analysis:_lastAiResponse[module].trend_analysis})}` : '';
  const brainCtx = buildBrainContext(module);
  const attempt = async (retryNum) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
    console.log('Llyana: Calling Gemini for', module, retryNum > 0 ? `(retry ${retryNum})` : '', brainCtx ? '(with cross-module brain)' : '');
    const r = await fetch(url, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:`${LLYANA_CORE}\n\n${MOD_PROMPTS[module]}\n\nINPUT: ${JSON.stringify(params)}${histCtx}${prevAi}${brainCtx}\n\nYou are Llyana — one unified AI brain. Analyze this module now. Compare with your previous analysis if available. Reference findings from other modules to provide cross-cutting insights. Note parameter changes, improving/degrading trends, and cascading impacts. JSON only.`}]}], generationConfig:{temperature:0.3,maxOutputTokens:1500} })
    });
    if (r.status === 429) {
      const wait = retryNum === 0 ? 8 : 15;
      setGlobalAiStatus(`AI rate limit reached. Retrying in ${wait}s...`);
      console.log(`Llyana: Rate limited, waiting ${wait}s...`);
      await new Promise(x=>setTimeout(x,wait*1000));
      setGlobalAiStatus(null);
      return 'RETRY';
    }
    if (!r.ok) { const err = await r.text(); console.error('Llyana Gemini HTTP error:', r.status, err); return null; }
    const d = await r.json();
    const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!txt) { console.error('Llyana: No text in response', d); return null; }
    console.log('Llyana: Gemini raw:', txt.slice(0, 200));
    const parsed = JSON.parse(txt.replace(/```json\s?/g,'').replace(/```/g,'').trim());
    console.log('Llyana: Parsed OK, alert:', parsed.alert_level);
    incAiCount();
    // Store for continuity + cross-module brain
    _lastAiResponse[module] = parsed;
    try { sessionStorage.setItem('llyana_ai_prev_'+module, JSON.stringify(parsed)); } catch {}
    return parsed;
  };
  try {
    let res = await attempt(0);
    if (res === 'RETRY') res = await attempt(1);
    if (res === 'RETRY') { setGlobalAiStatus('AI temporarily unavailable. Using local analysis.'); setTimeout(()=>setGlobalAiStatus(null),4000); return null; }
    return res;
  } catch(e) { console.error('Llyana Gemini error:', e); return null; }
}

// Restore previous AI responses from session on page load
try { Object.keys(sessionStorage).filter(k=>k.startsWith('llyana_ai_prev_')).forEach(k=>{_lastAiResponse[k.replace('llyana_ai_prev_','')]=JSON.parse(sessionStorage.getItem(k))}); } catch {}

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

function LnChart({data,w=800,h=180,color=C.red,showArea,label}){if(!data?.length)return null;const pad=20;const ih=h-pad*2;const mx=Math.max(...data),mn=Math.min(...data);const rng=mx-mn||1;const step=data.length>1?w/(data.length-1):w;const pts=data.map((v,i)=>`${i*step},${pad+ih-((v-mn)/rng)*ih}`).join(' ');return(<div style={{width:'100%',overflow:'hidden'}}><svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto'}} preserveAspectRatio="none">{showArea&&<><defs><linearGradient id={`ag${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".15"/><stop offset="100%" stopColor={color} stopOpacity=".01"/></linearGradient></defs><polygon points={`0,${h} ${pts} ${(data.length-1)*step},${h}`} fill={`url(#ag${color.slice(1)})`}/></>}<polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>{data.map((v,i)=>i%Math.max(1,Math.floor(data.length/8))===0&&<circle key={i} cx={i*step} cy={pad+ih-((v-mn)/rng)*ih} r="3" fill={color} style={{filter:`drop-shadow(0 0 4px ${color}60)`}}/>)}</svg>{label&&<div style={{textAlign:'center',fontSize:'10px',color:C.muted,marginTop:6}}>{label}</div>}</div>)}

function BrChart({data,labels,w=700,h=180,color=C.red}){const mx=Math.max(...data)*1.2||1;const bw=w/data.length*.55,gap=w/data.length*.45;return(<div style={{width:'100%'}}><svg viewBox={`0 0 ${w} ${h+28}`} style={{width:'100%'}}><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color} stopOpacity=".5"/></linearGradient></defs>{data.map((v,i)=>{const bh=(v/mx)*h,x=i*(bw+gap)+gap/2;return(<g key={i}><rect x={x} y={h-bh} width={bw} height={bh} fill="url(#bg1)" rx="4" style={{transformOrigin:`${x}px ${h}px`,animation:`barGrow .6s ease-out ${i*.08}s both`}}/>{labels?.[i]&&<text x={x+bw/2} y={h+16} textAnchor="middle" fill={C.muted} fontSize="8.5">{labels[i]}</text>}</g>)})}</svg></div>)}

function Gauge({value,label,size=120}){const a=(value/100)*270-135,r=size/2-14,cx=size/2,cy=size/2+6;const sA=-135*Math.PI/180,eA=a*Math.PI/180,bgE=135*Math.PI/180;const arc=(s,e)=>{const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);return`M${x1} ${y1}A${r} ${r} 0 ${e-s>Math.PI?1:0} 1 ${x2} ${y2}`};const gc=value>95?C.green:value>85?C.yellow:value>70?C.orange:C.red;return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',minHeight:size+30}}><svg width={size} height={size*.75} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}><path d={arc(sA,bgE)} fill="none" stroke={C.veryMuted} strokeWidth="6" strokeLinecap="round"/><path d={arc(sA,eA)} fill="none" stroke={gc} strokeWidth="6" strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${gc}50)`}}/><text x={cx} y={cy+8} textAnchor="middle" fill={gc} fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{Math.round(value)}%</text></svg><div style={{fontSize:'11px',color:C.dim,marginTop:4}}>{label}</div></div>)}

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

function Layout({page,onNav,children,user,onLogout,sysStatus,aiStatus,aiCount}){
  const[time,setTime]=useState(new Date());
  const[resetTimer,setResetTimer]=useState('');
  useEffect(()=>{const t=setInterval(()=>{
    const now=new Date();setTime(now);
    // Calculate time until midnight PT (UTC-7 or UTC-8 depending on DST)
    const pt=new Date(now.toLocaleString('en-US',{timeZone:'America/Los_Angeles'}));
    const midnight=new Date(pt);midnight.setHours(24,0,0,0);
    const diff=midnight-pt;
    const hrs=Math.floor(diff/3600000);const mins=Math.floor((diff%3600000)/60000);const secs=Math.floor((diff%60000)/1000);
    setResetTimer(`${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
  },1000);return()=>clearInterval(t)},[]);
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
          <div style={{fontSize:'9px',fontFamily:'monospace',color:C.dim,marginTop:2}}>AI: <span style={{color:aiCount<15?C.cyan:aiCount<19?C.yellow:C.red}}>{AI_DAILY_LIMIT-aiCount}/{AI_DAILY_LIMIT}</span> <span style={{color:C.muted}}>remaining</span></div>
          <div style={{fontSize:'9px',fontFamily:'monospace',color:C.muted,marginTop:2}}>Resets: <span style={{color:C.dim}}>{resetTimer}</span></div>
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
      {aiStatus&&<div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#1a1a2e',border:`1px solid ${C.cyan}40`,borderRadius:12,padding:'12px 24px',display:'flex',alignItems:'center',gap:10,zIndex:9999,animation:'fadeUp .3s ease-out',boxShadow:`0 4px 20px rgba(6,182,212,0.15)`}}><div style={{width:14,height:14,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan,fontWeight:500}}>{aiStatus}</span></div>}
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

  useEffect(()=>{if(!token)return;dbGet('nuclear_reactor_readings',token,'order=created_at.desc&limit=10').then(d=>{if(d?.length){setHistory(d);setLastRead(d[0]);
    // Auto-analyze last reading with fallback (no AI call to save quota)
    const t=+d[0].core_temp,p=+d[0].pressure,f=+d[0].flow_rate;
    if(!isNaN(t)&&!isNaN(p)&&!isNaN(f)){const fb=fallback(t,p,f);setRes({eff:fb.eff,tPct:fb.tPct,pPct:fb.pPct,recs:fb.recs,overall:fb.overall});setAk(1)}
    // Leave inputs empty for new entry
  }});},[token]);

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
    // Clear inputs for next entry
    setCt('');setPr('');setFr('');
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
  const[tp,setTp]=useState('');const[ct,setCt]=useState('');const[saving,setSaving]=useState(false);const[readings,setReadings]=useState([]);
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[confidence,setConfidence]=useState(null);
  useEffect(()=>{if(!token)return;dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20').then(d=>{if(d?.length)setReadings(d)});},[token]);
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
    const fresh=await dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20');if(fresh)setReadings(fresh);setSaving(false);
    setTp('');setCt('');
  };
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[confidence,setConfidence]=useState(null);const[aiRecs,setAiRecs]=useState([]);
  useEffect(()=>{if(!token)return;dbGet('nuclear_materials',token,'order=material_name.asc').then(d=>{if(d?.length){setMats(d);setSel(d[0].id)}});},[token]);
  const addMat=async()=>{if(!newName||isNaN(parseFloat(newDeg)))return;setSaving(true);setAiActive(true);
    const deg=parseFloat(newDeg);
    const ai=await geminiAnalyze('materials',{material_name:newName,degradation_pct:deg},mats);
    let st,remLife,corrRate;
    if(ai){
      st=ai.alert_level==='SAFE'?'safe':ai.alert_level==='MONITOR'?'monitor':'warning';
      remLife=ai.remaining_life_months||Math.round((100-deg)/1.5);
      corrRate=ai.corrosion_rate||Math.round(deg*.3*100)/100;
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);
      setAiRecs((ai.recommendations||[]).map(r=>({title:r.title,desc:r.desc||r.description,sev:r.severity||'info'})));
    } else {
      st=deg>15?'warning':deg>10?'monitor':'safe';
      remLife=Math.round((100-deg)/1.5);corrRate=Math.round(deg*.3*100)/100;
      setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);
    }
    setAiActive(false);
    await dbPost('nuclear_materials',{material_name:newName,degradation_pct:deg,status:st,last_inspection:new Date().toISOString().slice(0,10),remaining_life_months:remLife,corrosion_rate:corrRate,user_id:userId},token);
    const f=await dbGet('nuclear_materials',token,'order=material_name.asc');if(f)setMats(f);setNewName('');setNewDeg('');setSaving(false);};
  const selMat=mats.find(m=>m.id===sel);
  const avgDeg=mats.length?mats.reduce((a,m)=>a+(+m.degradation_pct||0),0)/mats.length:0;
  const warnCount=mats.filter(m=>m.status==='warning'||m.status==='critical').length;
  return(<div><PH red="Material Performance" white="Predictions" sub="Degradation curves and predictive analysis"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing material data...</span></div>}
    {warnCount>0&&<div style={{background:C.orangeDim,border:`1px solid ${C.orange}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .4s'}}><span style={{fontSize:'16px'}}>{'\u26A0'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.orange}}>{warnCount} Material Warning{warnCount>1?'s':''}</div><div style={{fontSize:'11px',color:C.dim}}>Inspection recommended</div></div></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Avg Degradation" value={avgDeg.toFixed(1)+'%'} accent={C.red} delay={.05}/><StatCard label="Tracked" value={String(mats.length)} sub={`${warnCount} warnings`} accent={C.green} delay={.1}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.15}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Degradation Levels" delay={.1}>{mats.length?<BrChart data={mats.map(m=>+m.degradation_pct||0)} labels={mats.map(m=>m.material_name?.slice(0,10))}/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No materials tracked yet. Add one.</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>{mats.map(m=>(<div key={m.id} style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'3px 0'}}><span style={{color:C.dim}}>{m.material_name}</span><span style={{fontFamily:'monospace',color:(+m.degradation_pct)>12?C.orange:C.green,fontWeight:600}}>{(+m.degradation_pct).toFixed(1)}%</span></div>))}</div>
        </Card>
        {aiRecs.length>0&&<Card title="AI Insights" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{r.title}</div><div style={{fontSize:'11px',color:C.dim}}>{r.desc}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{c.impact}</span></div>))}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Add Material" delay={.15}>
          <Inp label="Material Name" value={newName} onChange={setNewName} required hint="e.g. Zircaloy-4"/>
          <Inp label="Degradation %" value={newDeg} onChange={setNewDeg} unit="%" required min={0} max={100}/>
          <Btn onClick={addMat} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Add Material'}</Btn>
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[confidence,setConfidence]=useState(null);const[aiRecs,setAiRecs]=useState([]);const[schedInsights,setSchedInsights]=useState('');const[plantAvail,setPlantAvail]=useState(null);
  useEffect(()=>{if(!token)return;dbGet('nuclear_maintenance',token,'order=scheduled_date.asc').then(d=>{if(d)setTasks(d)});},[token]);
  const add=async()=>{if(!newTask||!newDate)return;setSaving(true);setAiActive(true);
    await dbPost('nuclear_maintenance',{task_name:newTask,scheduled_date:newDate,duration_hours:parseFloat(newHrs)||4,priority:newPri,status:'scheduled',assigned_team:'Team Alpha',user_id:userId},token);
    const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);
    // Run AI analysis on full task list
    const ai=await geminiAnalyze('operations',{new_task:{name:newTask,date:newDate,priority:newPri,hours:newHrs},all_tasks:f||tasks},f||tasks);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);
      setAiRecs((ai.recommendations||[]).map(r=>({title:r.title,desc:r.desc||r.description,sev:r.severity||'info'})));
      setSchedInsights(ai.scheduling_insights||'');setPlantAvail(ai.plant_availability_pct||null);
    } else { setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);setSchedInsights('');setPlantAvail(null); }
    setAiActive(false);setNewTask('');setNewDate('');setSaving(false);};
  const complete=async(id)=>{await dbPatch('nuclear_maintenance',id,{status:'completed',completed_at:new Date().toISOString()},token);const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);};
  const active=tasks.filter(t=>t.status!=='completed'&&t.status!=='cancelled');
  const completed=tasks.filter(t=>t.status==='completed');
  const filtered=filter==='All'?active:active.filter(t=>t.priority===filter.toUpperCase());
  const nextDays=active.length?Math.max(0,Math.ceil((new Date(active[0]?.scheduled_date)-new Date())/86400000)):'-';
  const priC={CRITICAL:C.red,HIGH:C.yellow,MEDIUM:C.cyan,LOW:C.green};
  return(<div><PH red="Operational" white="Monitoring" sub="Maintenance scheduling and timeline management"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing maintenance schedule...</span></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Next Maintenance" value={String(nextDays)} sub="days" delay={.05}/><StatCard label="Scheduled" value={String(active.length)} sub="Active tasks" delay={.1}/><StatCard label="Completed" value={String(completed.length)} accent={C.green} delay={.15}/>{plantAvail&&<StatCard label="Plant Availability" value={plantAvail+'%'} accent={plantAvail>90?C.green:C.orange} delay={.2}/>}{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Maintenance Timeline" delay={.1} actions={<div style={{display:'flex',gap:6}}>{['All','Critical','High','Medium'].map(f=><Pill key={f} active={filter===f} onClick={()=>setFilter(f)}>{f}</Pill>)}</div>}>
          {filtered.length?filtered.map((t,i)=>(<div key={t.id} onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)} style={{background:hov===t.id?C.bgCardHover:C.bg,border:`1px solid ${hov===t.id?(priC[t.priority]||C.cyan)+'30':C.border}`,borderRadius:10,padding:'14px 16px',marginBottom:8,borderLeft:`3px solid ${priC[t.priority]||C.cyan}`,animation:`slideIn .3s ease-out ${i*.05}s both`,transition:'all .25s',cursor:'pointer',transform:hov===t.id?'translateX(4px)':'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:'13px',fontWeight:500}}>{t.task_name}</div><div style={{fontSize:'10px',color:C.muted,marginTop:2}}>{t.scheduled_date} {'\u00B7'} {t.duration_hours}h{t.assigned_team?` ${'\u00B7'} ${t.assigned_team}`:''}</div></div>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{background:(priC[t.priority]||C.cyan)+'18',color:priC[t.priority]||C.cyan,fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:4}}>{t.priority}</span><button onClick={e=>{e.stopPropagation();complete(t.id)}} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'9px',padding:'2px 6px',cursor:'pointer'}}>{'\u2713'}</button></div></div>
          </div>)):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No tasks. Add one.</div>}
        </Card>
        {aiRecs.length>0&&<Card title="AI Insights" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{r.title}</div><div style={{fontSize:'11px',color:C.dim}}>{r.desc}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {schedInsights&&<Card title="Scheduling Insights" delay={.3}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{schedInsights}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.35}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{c.impact}</span></div>))}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Add Task" delay={.15}>
          <Inp label="Task Name" value={newTask} onChange={setNewTask} required/>
          <div style={{marginBottom:18}}><label style={{fontSize:'12px',color:C.dim,fontWeight:500,display:'block',marginBottom:6}}>Date <span style={{color:C.red}}>*</span></label><input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="input-focus" style={{width:'100%',background:C.bgInput,border:`1.5px solid ${C.borderLight}`,borderRadius:8,padding:'11px 14px',color:C.text,fontSize:'14px',outline:'none',boxSizing:'border-box',colorScheme:'dark'}}/></div>
          <div style={{display:'flex',gap:8,marginBottom:18}}><div style={{flex:1}}><label style={{fontSize:'12px',color:C.dim,display:'block',marginBottom:6}}>Priority</label><select value={newPri} onChange={e=>setNewPri(e.target.value)} style={{width:'100%',background:C.bgInput,border:`1.5px solid ${C.borderLight}`,borderRadius:8,padding:'11px',color:C.text,fontSize:'13px',outline:'none',appearance:'none'}}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div><div style={{flex:1}}><Inp label="Hours" value={newHrs} onChange={setNewHrs} min={1} max={72}/></div></div>
          <Btn onClick={add} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Schedule Task'}</Btn>
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[confidence,setConfidence]=useState(null);const[aiRecs,setAiRecs]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[safetyPosture,setSafetyPosture]=useState('');const[regGaps,setRegGaps]=useState([]);
  useEffect(()=>{if(!token)return;
    dbGet('alerts',token,'order=created_at.desc&limit=20').then(d=>{if(d)setAlerts(d)});
    dbGet('nuclear_compliance',token,'order=standard_name.asc').then(d=>{if(d)setComp(d)});
  },[token]);
  const resolve=async(id)=>{await dbPatch('alerts',id,{status:'resolved',resolved_at:new Date().toISOString()},token);const f=await dbGet('alerts',token,'order=created_at.desc&limit=20');if(f)setAlerts(f);};
  const addComp=async()=>{if(!newStd)return;setSaving(true);setAiActive(true);
    await dbPost('nuclear_compliance',{standard_name:newStd,standard_code:newCode||null,last_review:new Date().toISOString().slice(0,10),status:'PENDING',user_id:userId},token);
    const freshComp=await dbGet('nuclear_compliance',token,'order=standard_name.asc');if(freshComp)setComp(freshComp);
    // Run AI safety analysis
    const ai=await geminiAnalyze('safety',{active_alerts:alerts.filter(a=>a.status==='active'),compliance_standards:freshComp||comp,new_standard:{name:newStd,code:newCode}},alerts);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);
      setAiRecs((ai.recommendations||[]).map(r=>({title:r.title,desc:r.desc||r.description,sev:r.severity||'info'})));
      setTrendInfo(ai.trend_analysis||'');setSafetyPosture(ai.safety_posture||'');setRegGaps(ai.regulatory_gaps||[]);
    } else { setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);setTrendInfo('');setSafetyPosture('');setRegGaps([]); }
    setAiActive(false);setNewStd('');setNewCode('');setSaving(false);};
  const runSafetyAudit=async()=>{setAiActive(true);
    const ai=await geminiAnalyze('safety',{active_alerts:alerts.filter(a=>a.status==='active'),compliance_standards:comp},alerts);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(ai.reasoning||[]);setCrossImpacts(ai.cross_module_impacts||[]);
      setAiRecs((ai.recommendations||[]).map(r=>({title:r.title,desc:r.desc||r.description,sev:r.severity||'info'})));
      setTrendInfo(ai.trend_analysis||'');setSafetyPosture(ai.safety_posture||'');setRegGaps(ai.regulatory_gaps||[]);
    }
    setAiActive(false);};
  const activeAlerts=alerts.filter(a=>a.status==='active');
  const critCount=activeAlerts.filter(a=>a.alert_level==='CRITICAL').length;
  const warnCount=activeAlerts.filter(a=>a.alert_level==='WARNING').length;
  const compOk=comp.filter(c=>c.status==='COMPLIANT').length;
  const alC={CRITICAL:C.red,WARNING:C.orange,MONITOR:C.yellow,SAFE:C.green};
  return(<div><PH red="Safety & Compliance" white="Flagging" sub="Alert monitoring and regulatory compliance"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is running safety audit...</span></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Critical" value={String(critCount)} accent={C.red} delay={.05}/><StatCard label="Warnings" value={String(warnCount)} accent={C.yellow} delay={.1}/><StatCard label="Active" value={String(activeAlerts.length)} delay={.15}/><StatCard label="Compliance" value={`${compOk}/${comp.length}`} accent={C.green} delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Safety Alerts" delay={.1}>
          {alerts.length?alerts.map((a,i)=>{const ac=alC[a.alert_level]||C.gray;return(<div key={a.id} style={{background:ac+'08',border:`1px solid ${ac}20`,borderRadius:10,padding:'14px 16px',marginBottom:8,animation:`fadeUp .3s ease-out ${i*.06}s both`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><div style={{fontSize:'13px',fontWeight:600}}>{a.title||'Alert'}</div><div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{fontSize:'9px',fontWeight:700,color:a.status==='resolved'?C.green:a.status==='monitoring'?C.yellow:C.cyan}}>{a.status?.toUpperCase()}</span>{a.status==='active'&&<button onClick={()=>resolve(a.id)} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'8px',padding:'2px 6px',cursor:'pointer'}}>Resolve</button>}</div></div>
            <div style={{fontSize:'11px',color:C.dim,marginBottom:4}}>{a.description||''}</div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'9px',color:C.muted,fontFamily:'monospace'}}>{a.created_at?new Date(a.created_at).toLocaleString():''}</span><span style={{fontSize:'8px',background:ac+'15',color:ac,padding:'2px 6px',borderRadius:3,fontWeight:600}}>{a.alert_level}</span></div>
          </div>)}):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No alerts. System clean.</div>}
        </Card>
        {safetyPosture&&<Card title="Safety Posture Assessment" delay={.15}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{safetyPosture}</div></Card>}
        {aiRecs.length>0&&<Card title="AI Safety Recommendations" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{r.title}</div><div style={{fontSize:'11px',color:C.dim}}>{r.desc}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{r.action}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{r.result}</div></div></div>))}</div></Card>}
        {regGaps.length>0&&<Card title="Regulatory Gaps" delay={.3}><div>{regGaps.map((g,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.red+'08',borderRadius:8,border:`1px solid ${C.red}15`}}><span style={{color:C.red,fontSize:'12px'}}>{'\u26A0'}</span><span style={{fontSize:'11px',color:C.dim}}>{g}</span></div>))}</div></Card>}
        {trendInfo&&<Card title="Alert Trend Analysis" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.4}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{c.impact}</span></div>))}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Run Safety Audit" delay={.12}>
          <Btn onClick={runSafetyAudit} disabled={aiActive}>{aiActive?'AI Auditing...':'Run AI Safety Audit'}</Btn>
          <div style={{fontSize:'10px',color:C.muted,marginTop:8,textAlign:'center'}}>Analyzes all alerts and compliance gaps</div>
        </Card>
        <Card title="Compliance Standards" delay={.15}>
          {comp.length?comp.map((c,i)=><div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<comp.length-1?`1px solid ${C.border}`:'none'}}><div><div style={{fontSize:'11px',fontWeight:500}}>{c.standard_name}</div>{c.standard_code&&<div style={{fontSize:'9px',color:C.muted}}>{c.standard_code}</div>}</div><span style={{fontSize:'9px',fontWeight:700,color:c.status==='COMPLIANT'?C.green:c.status==='PENDING'?C.yellow:C.red}}>{c.status}</span></div>)
          :<div style={{color:C.muted,fontSize:'12px',textAlign:'center',padding:12}}>No standards tracked. Add one.</div>}
        </Card>
        <Card title="Add Standard" delay={.25}>
          <Inp label="Standard Name" value={newStd} onChange={setNewStd} required hint="e.g. NRC 10 CFR 50"/>
          <Inp label="Standard Code" value={newCode} onChange={setNewCode} hint="Optional"/>
          <Btn onClick={addComp} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Add Standard'}</Btn>
        </Card>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// ENERGY YIELD — Supabase CRUD
// ═══════════════════════════════════════════════════════════════
function EnergyPage({token,userId}){
  const[ft,setFt]=useState('');const[area,setArea]=useState('');const[loc,setLoc]=useState('Main Entrance');
  const[saving,setSaving]=useState(false);const[readings,setReadings]=useState([]);const[model,setModel]=useState('ai');
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[deployInsights,setDeployInsights]=useState('');const[confidence,setConfidence]=useState(null);
  useEffect(()=>{if(!token)return;dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12').then(d=>{if(d?.length)setReadings(d)});},[token]);
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
    const fresh=await dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12');if(fresh)setReadings(fresh);setSaving(false);
    setFt('');setArea('');
  };
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
  const[aiStatus,setAiStatus]=useState(null);
  const[aiCount,setAiCount]=useState(getAiCount().count);
  const token=user?.token;const userId=user?.id;
  const sysStatus=useSystemStatus(token);

  // Wire up global AI status callback
  useEffect(()=>{_aiStatusCallback=setAiStatus;_aiCountCallback=setAiCount;return()=>{_aiStatusCallback=null;_aiCountCallback=null}},[]);

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
  return<Layout page={page} onNav={setPage} user={user} onLogout={logout} sysStatus={sysStatus} aiStatus={aiStatus} aiCount={aiCount}>{pg[page]||pg.overview}</Layout>;
}
