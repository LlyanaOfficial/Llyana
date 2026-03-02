import { useState, useEffect, useMemo, Component } from "react";

// Error boundary to prevent blank pages on render errors
class ModuleErrorBoundary extends Component {
  constructor(props){super(props);this.state={hasError:false,error:null}}
  static getDerivedStateFromError(error){return{hasError:true,error}}
  componentDidCatch(error,info){console.error('Llyana module crash:',error,info)}
  render(){
    if(this.state.hasError){return(
      <div style={{padding:40,textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:16}}>⚠</div>
        <div style={{fontSize:16,fontWeight:600,color:'#ef4444',marginBottom:8}}>Module Error</div>
        <div style={{fontSize:12,color:'#94a3b8',marginBottom:16}}>{this.state.error?.message||'An unexpected error occurred'}</div>
        <button onClick={()=>this.setState({hasError:false,error:null})} style={{background:'#1e293b',border:'1px solid #334155',borderRadius:8,padding:'8px 16px',color:'#e2e8f0',cursor:'pointer',fontSize:12}}>Retry</button>
      </div>
    )}
    return this.props.children;
  }
}

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
const dbDelete=(t,id,tk)=>db('DELETE',t,tk,null,`id=eq.${id}`);

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

MATERIAL VALIDATION (MANDATORY FIRST STEP):
Before any analysis, validate the material name. Known nuclear-grade materials include:
- Zircaloy-2, Zircaloy-4 (fuel cladding)
- Inconel-600, Inconel-625, Inconel-690 (steam generators, heat exchangers)
- SS-304, SS-304L, SS-316, SS-316L, SS-316LN (reactor internals, piping)
- SA-508 Grade 3, SA-533 Grade B (pressure vessel)
- Alloy X-750 (springs, bolts)
- Stellite 6 (valve seats, hard-facing)
- Hafnium, Boron Carbide (B4C), Silver-Indium-Cadmium (Ag-In-Cd) (control rods)
- Carbon Steel A106, A516 (piping, containment)
- Alumina, Zirconia (ceramic insulators)
- Copper alloys (condenser tubes)
If the material is NOT a recognized nuclear/engineering material, set "material_valid": false and alert_level to "UNKNOWN". Include a recommendation: "Unrecognized material — verify material name. Did you mean [suggest closest match]?"
If the material IS recognized, set "material_valid": true and proceed with full analysis.

FAILURE MODES (analyze ALL for each validated material):
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

JSON: {"alert_level":"...","confidence":N,"material_valid":true|false,"degradation_assessment":"...","embrittlement_risk":"Low|Moderate|Elevated|High","remaining_life_months":N,"corrosion_rate":N,"reasoning":[...],"recommendations":[...],"cross_module_impacts":[...]}`,

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

// Cross-module event bus — allows real-time updates across all modules
const _crossModuleListeners = {};
function onCrossModuleEvent(module, callback) {
  if (!_crossModuleListeners[module]) _crossModuleListeners[module] = [];
  _crossModuleListeners[module].push(callback);
  return () => { _crossModuleListeners[module] = _crossModuleListeners[module].filter(cb => cb !== callback); };
}
function emitCrossModuleEvent(sourceModule, event) {
  // Notify ALL other modules
  Object.keys(_crossModuleListeners).forEach(mod => {
    if (mod !== sourceModule) {
      _crossModuleListeners[mod].forEach(cb => cb(event));
    }
  });
}

// Hook for modules to listen to cross-module events in real-time
function useCrossModuleAlert(moduleName) {
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const unsub = onCrossModuleEvent(moduleName, (event) => {
      setAlert(event);
      setTimeout(() => setAlert(null), 20000);
    });
    return unsub;
  }, [moduleName]);
  return alert;
}

// Cross-module alert banner component
function CrossModuleAlertBanner({alert}) {
  if (!alert) return null;
  const ac = alert.level === 'WARNING' ? C.orange : alert.level === 'CRITICAL' ? C.red : C.cyan;
  return (<div style={{background:ac+'10',border:`1px solid ${ac}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'flex-start',gap:10,animation:'fadeUp .3s'}}>
    <span style={{fontSize:'14px',flexShrink:0}}>{alert.level==='WARNING'?'\u26A0':alert.level==='CRITICAL'?'\u2716':'\u2139'}</span>
    <div><div style={{fontSize:'12px',fontWeight:600,color:ac}}>{alert.source} Update</div>
    <div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{alert.message}</div></div>
  </div>);
}

// AI request counter (persists per day in sessionStorage)
const AI_DAILY_LIMIT = 1000;
function getAiCount() {
  try {
    const d = JSON.parse(sessionStorage.getItem('llyana_ai_usage') || '{}');
    // Google resets RPD at midnight Pacific Time
    const ptDate = new Date().toLocaleDateString('en-CA', {timeZone:'America/Los_Angeles'});
    if (d.date !== ptDate) return { date: ptDate, count: 0 };
    return d;
  } catch { return { date: new Date().toLocaleDateString('en-CA', {timeZone:'America/Los_Angeles'}), count: 0 }; }
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
    if (m === 'safety_resolution') {
      return `SAFETY RESOLUTION EVENT: ${r.trend_analysis||'Alert resolved'}`;
    }
    return `${m.toUpperCase()}: alert=${r.alert_level||'UNKNOWN'}, confidence=${r.confidence||'?'}%` +
      (r.efficiency ? `, efficiency=${r.efficiency}%` : '') +
      (r.recommendations?.length ? `, flags=[${(r.recommendations||[]).slice(0,3).map(x=>x.title||x).join('; ')}]` : '') +
      (r.trend_analysis ? `, trend="${typeof r.trend_analysis==='string'?r.trend_analysis.slice(0,100):''}"` : '');
  }).join('\n');
  return `\nCROSS-MODULE INTELLIGENCE (you are ONE AI brain — Llyana — operating across all modules. Here is what you found in other modules. Use this to inform your analysis, flag cascading risks, and provide holistic recommendations):\n${brain}`;
}

// Save AI analysis to Supabase log (fire and forget)
function saveAiLog(module, params, parsed, token, userId) {
  if (!token || !parsed) return;
  dbPost('ai_analysis_log', {
    module, alert_level: parsed.alert_level, confidence: parsed.confidence || null,
    input_params: params, reasoning: parsed.reasoning || [],
    recommendations: parsed.recommendations || [], cross_module_impacts: parsed.cross_module_impacts || [],
    trend_analysis: typeof parsed.trend_analysis === 'string' ? parsed.trend_analysis : JSON.stringify(parsed.trend_analysis || ''),
    benchmarks: typeof parsed.benchmarks === 'string' ? parsed.benchmarks : JSON.stringify(parsed.benchmarks || ''),
    full_response: parsed, user_id: userId
  }, token).catch(e => console.warn('Llyana: Log save failed', e));
}

// Load last AI log for a module from Supabase
async function loadLastAiLog(module, token) {
  if (!token) return null;
  const logs = await dbGet('ai_analysis_log', token, `module=eq.${module}&order=created_at.desc&limit=1`);
  return logs?.[0] || null;
}

async function geminiAnalyze(module, params, history = [], token = null, userId = null) {
  if (!GEMINI_KEY || GEMINI_KEY === 'PASTE_HERE') { console.warn('Llyana: No Gemini key'); return null; }
  const histCtx = history.length ? `\nHISTORY (last ${Math.min(history.length,5)} readings, newest first):\n${JSON.stringify(history.slice(0,5))}` : '\nNo history yet.';
  const prevAi = _lastAiResponse[module] ? `\nYOUR PREVIOUS ANALYSIS FOR THIS MODULE (build upon it, note changes, compare trends):\n${JSON.stringify({alert_level:_lastAiResponse[module].alert_level,confidence:_lastAiResponse[module].confidence,efficiency:_lastAiResponse[module].efficiency,recommendations:(_lastAiResponse[module].recommendations||[]).map(r=>r.title),trend_analysis:_lastAiResponse[module].trend_analysis})}` : '';
  const brainCtx = buildBrainContext(module);
  const attempt = async (retryNum) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
    console.log('Llyana: Calling Gemini for', module, retryNum > 0 ? `(retry ${retryNum})` : '', brainCtx ? '(with cross-module brain)' : '');
    const r = await fetch(url, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:`${LLYANA_CORE}\n\n${MOD_PROMPTS[module]}\n\nINPUT: ${JSON.stringify(params)}${histCtx}${prevAi}${brainCtx}\n\nYou are Llyana — one unified AI brain. Analyze this module now. Compare with your previous analysis if available. Reference findings from other modules to provide cross-cutting insights. Note parameter changes, improving/degrading trends, and cascading impacts. KEEP YOUR RESPONSE COMPACT — max 5 reasoning steps, max 3 recommendations, max 3 cross-module impacts. JSON only, no trailing text.`}]}], generationConfig:{temperature:0.3,maxOutputTokens:4000} })
    });
    if (r.status === 429) {
      const wait = retryNum === 0 ? 5 : 10;
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
    console.log('Llyana: Recs keys:', (parsed.recommendations||[]).map(r=>Object.keys(r)));
    console.log('Llyana: Reasoning keys:', (parsed.reasoning||[]).map(r=>Object.keys(r)));
    console.log('Llyana: First rec:', JSON.stringify((parsed.recommendations||[])[0]));
    console.log('Llyana: First reasoning:', JSON.stringify((parsed.reasoning||[])[0]));
    incAiCount();
    // Store for continuity + cross-module brain
    _lastAiResponse[module] = parsed;
    try { sessionStorage.setItem('llyana_ai_prev_'+module, JSON.stringify(parsed)); } catch {}
    // Save to persistent Supabase log
    saveAiLog(module, params, parsed, token, userId);
    // Real-time cross-module notification
    emitCrossModuleEvent(module, {
      source: module.charAt(0).toUpperCase()+module.slice(1), level: parsed.alert_level||'INFO',
      message: `New analysis: ${parsed.alert_level||'UNKNOWN'} (${parsed.confidence||'?'}% confidence). ${parseRecs(parsed.recommendations).map(r=>r.title).slice(0,2).join('. ')}`
    });
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

// Parse AI reasoning steps from any Gemini response format
function parseReasoning(steps) {
  if (!steps || !Array.isArray(steps)) return [];
  return steps.map((r, i) => {
    if (typeof r === 'string') {
      const dot = r.indexOf('. ');
      return {step: i+1, action: dot > 5 && dot < 120 ? r.slice(0, dot+1) : r, result: dot > 5 && dot < 120 ? r.slice(dot+2) : ''};
    }
    if (typeof r !== 'object' || r === null) return {step: i+1, action: String(r||''), result: ''};
    const allStr = Object.values(r).filter(v => typeof v === 'string' && v.length > 5);
    return {
      step: r.step || r.number || r.index || i+1,
      action: r.action || r.title || r.analysis || r.finding || r.check || r.step_description || r.parameter || r.name || r.summary || allStr[0] || '',
      result: r.result || r.outcome || r.detail || r.description || r.conclusion || r.assessment || r.explanation || r.impact || r.observation || allStr[1] || ''
    };
  });
}

// Parse AI cross-module impacts from any Gemini response format
function parseCrossImpacts(impacts) {
  if (!impacts || !Array.isArray(impacts)) return [];
  return impacts.map(c => {
    if (typeof c === 'string') return {module: 'SYSTEM', impact: c};
    if (typeof c !== 'object' || c === null) return {module: 'SYSTEM', impact: String(c||'')};
    const mod = c.module || c.system || c.area || c.component || 'SYSTEM';
    const allStr = Object.values(c).filter(v => typeof v === 'string' && v.length > 10);
    const impact = c.impact || c.description || c.detail || c.text || c.assessment || c.effect || c.note || c.analysis || allStr.sort((a,b)=>b.length-a.length)[0] || '';
    return {module: mod, impact};
  });
}

// Parse AI recommendations from any Gemini response format
function parseRecs(recs) {
  if (!recs || !Array.isArray(recs)) return [];
  return recs.map(r => {
    // Gemini sometimes returns plain strings instead of objects
    if (typeof r === 'string') {
      // Split long string into title (first sentence) and desc (rest)
      const dot = r.indexOf('. ');
      if (dot > 10 && dot < 120) return {title: r.slice(0, dot+1), desc: r.slice(dot+2), sev: 'info'};
      return {title: r.length > 80 ? r.slice(0, 80) + '...' : r, desc: r.length > 80 ? r : '', sev: 'info'};
    }
    if (typeof r === 'number' || typeof r === 'boolean') return {title: String(r), desc: '', sev: 'info'};
    if (typeof r !== 'object' || r === null) return {title: 'Recommendation', desc: '', sev: 'info'};
    // Object — try every possible field name
    const allStrVals = Object.values(r).filter(v => typeof v === 'string' && v.length > 3 && !['info','warning','critical','safe','monitor','high','medium','low'].includes(v?.toLowerCase()));
    const title = safeText(r.title || r.name || r.action || r.recommendation || r.summary || r.heading || r.finding || r.issue || allStrVals[0] || 'Recommendation');
    const desc = safeText(r.desc || r.description || r.detail || r.details || r.text || r.body || r.result || r.impact || r.explanation || r.rationale || r.note || r.content || r.message || r.assessment || r.analysis || allStrVals[1] || '');
    const sev = r.severity || r.sev || r.priority || r.level || r.status || 'info';
    return {title, desc, sev: typeof sev === 'string' ? sev.toLowerCase() : 'info'};
  });
}

// Safely convert any AI response value to a renderable string
function safeText(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(x => safeText(x)).join(', ');
  if (typeof v === 'object') {
    return Object.entries(v).map(([k, val]) => {
      const sv = (val != null && typeof val === 'object') ? JSON.stringify(val) : String(val ?? '');
      return `${k}: ${sv}`;
    }).join('. ');
  }
  return String(v);
}

// Persist and restore AI analysis state per module


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

function Inp({label,value,onChange,hint,required,min,max,unit,type='number'}){
  const[t,sT]=useState(false);const[f,sF]=useState(false);const n=parseFloat(value);
  let e='';
  if(t&&required&&!value)e=`${label} is required`;
  else if(type==='number'&&t&&value&&isNaN(n))e='Must be a number';
  else if(type==='number'&&t&&value&&min!=null&&n<min)e=`Min: ${min}${unit?' '+unit:''}`;
  else if(type==='number'&&t&&value&&max!=null&&n>max)e=`Max: ${max}${unit?' '+unit:''}`;
  const al=type==='number'&&!e&&t&&value&&!isNaN(n)&&min!=null&&max!=null?getAlertLevel(n,min,max):null;
  const bc=e?C.red:f?C.red:al==='WARNING'?C.orange:al==='MONITOR'?C.yellow:C.borderLight;
  // Reset touched when value is cleared externally (after submit)
  useEffect(()=>{if(!value)sT(false)},[value]);
  return(<div style={{marginBottom:18}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}><label style={{fontSize:'12px',color:C.dim,fontWeight:500}}>{label} {required&&<span style={{color:C.red}}>*</span>}</label>{al&&al!=='SAFE'&&<span style={{fontSize:'9px',fontWeight:700,color:AC[al],background:AC[al]+'15',padding:'2px 8px',borderRadius:4}}>{al}</span>}</div><div style={{position:'relative'}}><input type="text" value={value} onChange={x=>{onChange(x.target.value);if(!t)sT(true)}} onFocus={()=>sF(true)} onBlur={()=>{sF(false);sT(true)}} className={`input-focus ${e&&t?'shake':''}`} style={{width:'100%',background:C.bgInput,border:`1.5px solid ${bc}`,borderRadius:8,padding:unit?'11px 50px 11px 14px':'11px 14px',color:C.text,fontSize:'14px',fontFamily:"'JetBrains Mono',monospace",outline:'none',boxSizing:'border-box',transition:'border-color .2s'}}/>{unit&&<span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',fontSize:'11px',color:C.muted,fontFamily:'monospace'}}>{unit}</span>}</div>{e&&t?<div style={{fontSize:'10px',color:C.red,marginTop:5,animation:'fadeIn .2s'}}>{e}</div>:hint?<div style={{fontSize:'10px',color:C.muted,marginTop:4}}>{hint}</div>:null}</div>)}

function LnChart({data,w=800,h=220,color=C.red,showArea,label,labels,unit=''}){
  const[hov,setHov]=useState(null);
  if(!data?.length)return null;
  const pad={t:25,r:20,b:30,l:50};const iw=w-pad.l-pad.r;const ih=h-pad.t-pad.b;
  const mx=Math.max(...data),mn=Math.min(...data);const rng=mx-mn||1;
  const step=data.length>1?iw/(data.length-1):iw;
  const getX=i=>pad.l+i*step;const getY=v=>pad.t+ih-((v-mn)/rng)*ih;
  const pts=data.map((v,i)=>`${getX(i)},${getY(v)}`).join(' ');
  // Y-axis ticks
  const yTicks=5;const ySteps=Array.from({length:yTicks},(_,i)=>mn+(rng/(yTicks-1))*i);
  return(<div style={{width:'100%',position:'relative'}}>
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto'}} onMouseLeave={()=>setHov(null)}>
      {/* Grid lines + Y labels */}
      {ySteps.map((v,i)=>{const y=getY(v);return(<g key={i}><line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke={C.border} strokeWidth=".5" strokeDasharray="4,4"/><text x={pad.l-8} y={y+3} textAnchor="end" fill={C.muted} fontSize="9" fontFamily="'JetBrains Mono',monospace">{v>=1000?(v/1000).toFixed(1)+'k':v.toFixed(v<10?1:0)}</text></g>)})}
      {/* X labels */}
      {data.map((v,i)=>{if(data.length>8&&i%Math.ceil(data.length/6)!==0&&i!==data.length-1)return null;return(<text key={i} x={getX(i)} y={h-6} textAnchor="middle" fill={C.muted} fontSize="8">{labels?.[i]||`#${i+1}`}</text>)})}
      {/* Area fill */}
      {showArea&&<><defs><linearGradient id={`ag${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".12"/><stop offset="100%" stopColor={color} stopOpacity=".01"/></linearGradient></defs><polygon points={`${getX(0)},${pad.t+ih} ${pts} ${getX(data.length-1)},${pad.t+ih}`} fill={`url(#ag${color.slice(1)})`}/></>}
      {/* Line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>
      {/* Data points — all visible */}
      {data.map((v,i)=><circle key={i} cx={getX(i)} cy={getY(v)} r={hov===i?6:3.5} fill={hov===i?color:C.bg} stroke={color} strokeWidth="2" style={{cursor:'pointer',transition:'r .15s',filter:hov===i?`drop-shadow(0 0 8px ${color}80)`:''}} onMouseEnter={()=>setHov(i)}/>)}
      {/* Hover crosshair */}
      {hov!==null&&<line x1={getX(hov)} y1={pad.t} x2={getX(hov)} y2={pad.t+ih} stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity=".4"/>}
    </svg>
    {/* Tooltip */}
    {hov!==null&&<div style={{position:'absolute',left:`${(getX(hov)/w)*100}%`,top:0,transform:'translateX(-50%)',background:C.bgCard,border:`1px solid ${color}30`,borderRadius:8,padding:'8px 12px',pointerEvents:'none',zIndex:10,boxShadow:`0 4px 12px ${C.bg}80`,minWidth:100}}>
      <div style={{fontSize:'14px',fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace"}}>{data[hov]?.toFixed?.(1)}{unit}</div>
      <div style={{fontSize:'10px',color:C.dim,marginTop:2}}>{labels?.[hov]||`Reading #${hov+1}`}</div>
      {hov>0&&<div style={{fontSize:'9px',color:data[hov]>data[hov-1]?C.green:data[hov]<data[hov-1]?C.red:C.muted,marginTop:3}}>{data[hov]>data[hov-1]?'\u25B2':data[hov]<data[hov-1]?'\u25BC':'\u25C6'} {((data[hov]-data[hov-1])/Math.abs(data[hov-1]||1)*100).toFixed(1)}% from prev</div>}
    </div>}
    {label&&<div style={{textAlign:'center',fontSize:'10px',color:C.muted,marginTop:4}}>{label}</div>}
  </div>)}

function BrChart({data,labels,w=700,h=200,color=C.red,unit='%'}){
  const[hov,setHov]=useState(null);
  if(!data?.length)return null;
  const pad={t:15,r:10,b:30,l:10};const ih=h-pad.t-pad.b;
  const mx=Math.max(...data)*1.2||1;const bw=w/data.length*.55,gap=w/data.length*.45;
  return(<div style={{width:'100%',position:'relative'}}>
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto'}} onMouseLeave={()=>setHov(null)}>
      <defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color} stopOpacity=".5"/></linearGradient>
      <linearGradient id="bg1h" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="1"/><stop offset="100%" stopColor={color} stopOpacity=".8"/></linearGradient></defs>
      {data.map((v,i)=>{const bh=Math.max(2,(v/mx)*ih);const x=pad.l+i*(bw+gap)+gap/2;const y=pad.t+ih-bh;
        return(<g key={i} onMouseEnter={()=>setHov(i)} style={{cursor:'pointer'}}>
          <rect x={x} y={y} width={bw} height={bh} fill={hov===i?"url(#bg1h)":"url(#bg1)"} rx="4" style={{transition:'all .15s',filter:hov===i?`drop-shadow(0 0 6px ${color}50)`:''}}/>
          {/* Value on top of bar */}
          <text x={x+bw/2} y={y-5} textAnchor="middle" fill={hov===i?color:C.muted} fontSize={hov===i?"10":"8"} fontWeight={hov===i?"700":"400"} fontFamily="'JetBrains Mono',monospace" style={{transition:'all .15s'}}>{v.toFixed(1)}{unit}</text>
          {/* Label below */}
          {labels?.[i]&&<text x={x+bw/2} y={pad.t+ih+16} textAnchor="middle" fill={hov===i?C.text:C.muted} fontSize={hov===i?"9":"8"} fontWeight={hov===i?"600":"400"}>{labels[i]}</text>}
        </g>)})}
    </svg>
    {/* Tooltip */}
    {hov!==null&&<div style={{position:'absolute',left:`${((pad.l+hov*(bw+gap)+gap/2+bw/2)/w)*100}%`,top:0,transform:'translateX(-50%)',background:C.bgCard,border:`1px solid ${color}30`,borderRadius:8,padding:'8px 12px',pointerEvents:'none',zIndex:10,boxShadow:`0 4px 12px ${C.bg}80`}}>
      <div style={{fontSize:'14px',fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace"}}>{data[hov]?.toFixed(1)}{unit}</div>
      <div style={{fontSize:'10px',color:C.dim,marginTop:2}}>{labels?.[hov]||`Item #${hov+1}`}</div>
      {data.length>1&&<div style={{fontSize:'9px',color:C.muted,marginTop:3}}>Avg: {(data.reduce((a,b)=>a+b,0)/data.length).toFixed(1)}{unit}</div>}
    </div>}
  </div>)}

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
          <div style={{fontSize:'9px',fontFamily:'monospace',color:C.dim,marginTop:2}}>AI: <span style={{color:aiCount<900?C.cyan:aiCount<980?C.yellow:C.red}}>{AI_DAILY_LIMIT-aiCount}/{AI_DAILY_LIMIT}</span> <span style={{color:C.muted}}>remaining</span></div>
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[benchInfo,setBenchInfo]=useState(null);const[confidence,setConfidence]=useState(null);

  useEffect(()=>{if(!token)return;
    // Load last AI log from Supabase for persistent insights
    loadLastAiLog('reactor',token).then(log=>{
      if(log?.full_response){
        const ai=log.full_response;
        const recs=parseRecs(ai.recommendations);
        if(!recs.length)recs.push({title:'AI Analysis Complete',desc:'All parameters assessed.',sev:'safe'});
        const eff=+(ai.efficiency||95),tPct=+(ai.temperature_pct||90),pPct=+(ai.pressure_pct||88);
        setRes({eff,tPct,pPct,recs,overall:ai.alert_level||'SAFE'});setAk(1);
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
        setTrendInfo(safeText(ai.trend_analysis));setBenchInfo(ai.benchmarks||null);
        _lastAiResponse['reactor']=ai;
      }
    });
    dbGet('nuclear_reactor_readings',token,'order=created_at.desc&limit=10').then(d=>{if(d?.length){setHistory(d);setLastRead(d[0]);}});},[token]);

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
    const ai=await geminiAnalyze('reactor',{core_temp:t,pressure:p,flow_rate:f},history,token,userId);
    let eff,tPct,pPct,recs,overall,nFlux,cRod,xenon;
    if(ai){
      eff=+(ai.efficiency||95);tPct=+(ai.temperature_pct||90);pPct=+(ai.pressure_pct||88);overall=ai.alert_level||'SAFE';
      recs=parseRecs(ai.recommendations);
      if(!recs.length)recs.push({title:'AI Analysis Complete',desc:'All parameters assessed.',sev:'safe'});
      nFlux=ai.neutron_flux||(2.2+Math.random()*.4).toFixed(1)+'e13';cRod=ai.control_rod_position||Math.round(60+Math.random()*15);xenon=ai.xenon_level||+(1+Math.random()*.5).toFixed(1);
    const _reasoning=ai?.reasoning||[];const _cross=ai?.cross_module_impacts||[];const _trend=safeText(ai?.trend_analysis);const _bench=ai?.benchmarks||null;const _conf=ai?.confidence||null;
    setConfidence(_conf);setReasoning(_reasoning);setCrossImpacts(_cross);setTrendInfo(_trend);setBenchInfo(_bench);
    } else {
      const fb=fallback(t,p,f);eff=fb.eff;tPct=fb.tPct;pPct=fb.pPct;recs=fb.recs;overall=fb.overall;nFlux=fb.nFlux;cRod=fb.cRod;xenon=fb.xenon;
      setConfidence(null);setReasoning([]);setCrossImpacts([]);setTrendInfo('');setBenchInfo(null);
    }
    setRes({eff,tPct,pPct,recs,overall});setAk(k=>k+1);setAiActive(false);
    // Persist AI insights
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
    const crossAlert=useCrossModuleAlert('reactor');
  return(<div><PH red="Reactor Core" white="Analysis" sub="Real-time optimization and analysis"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    {res&&!aiActive&&<div style={{background:oc+'10',border:`1px solid ${oc}25`,borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',animation:'fadeUp .3s'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:oc,animation:'pulse 2s infinite'}}/><span style={{fontSize:'12px',fontWeight:600,color:oc}}>Status: {res.overall}</span>{confidence&&<span style={{fontSize:'10px',color:C.dim,marginLeft:8,fontFamily:'monospace'}}>Confidence: {confidence}%</span>}</div><span style={{fontSize:'10px',color:C.dim,fontFamily:'monospace'}}>Readings: {history.length}</span></div>}
    {!res&&!history.length&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,fontSize:'12px',color:C.cyan}}>No readings yet. Enter parameters and run analysis to get started.</div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Core Performance" delay={.1}>{res?<div key={ak} style={{display:'flex',justifyContent:'space-around',padding:'12px 0 20px',animation:'fadeIn .4s'}}><Gauge value={Math.round(res.eff)} label="Efficiency"/><Gauge value={Math.round(res.tPct)} label="Temperature"/><Gauge value={Math.round(res.pPct)} label="Pressure"/></div>:<div style={{padding:30,textAlign:'center',color:C.muted,fontSize:'12px'}}>Run analysis to see gauges</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,borderTop:`1px solid ${C.border}`,paddingTop:16}}>{[['Neutron Flux',nf,'n/cm\u00B2s'],['Control Rod',cr,'Position'],['Xenon',xl,'Level']].map(([l,v,u])=>(<div key={l} className="card-hover" style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`1px solid ${C.border}`}}><div style={{fontSize:'9px',color:C.muted,textTransform:'uppercase'}}>{l}</div><div style={{fontFamily:'monospace',fontSize:'16px',fontWeight:700,margin:'4px 0 2px'}}>{v}</div><div style={{fontSize:'8px',color:C.muted}}>{u}</div></div>))}</div>
        </Card>
        {res&&<Card title="AI Insights" delay={.2}><div key={ak}>{res.recs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3,color:r.sev==='critical'?C.red:C.text}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`,animation:`fadeUp .3s ease-out ${i*.1}s both`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
        {trendInfo&&<Card title="Trend Analysis" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {benchInfo&&<Card title="IAEA Benchmark Check" delay={.4}><div>{typeof benchInfo==='object'&&benchInfo!==null?Object.entries(benchInfo).map(([k,v],i)=>{
          const param=k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
          if(typeof v==='object'&&v!==null){
            const cur=v.current??v.value;const lim=v.limit;const opt=v.optimal_center||v.optimal;const ttl=v.time_to_limit;const dev=v.deviation_from_optimal_center??v.deviation;
            const severity=ttl&&typeof ttl==='string'&&parseInt(ttl)<30?C.red:dev&&Math.abs(dev)>20?C.orange:C.green;
            return(<div key={k} style={{display:'flex',gap:10,marginBottom:10,padding:'10px 12px',background:severity+'08',borderRadius:8,border:`1px solid ${severity}15`,animation:`fadeUp .3s ease-out ${i*.08}s both`}}>
              <div style={{width:6,borderRadius:3,background:severity,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'12px',fontWeight:600,color:C.text,marginBottom:4}}>{param}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px 16px',fontSize:'11px'}}>
                  {cur!=null&&<span style={{color:C.dim}}>Current: <span style={{color:severity,fontWeight:600,fontFamily:'monospace'}}>{cur}</span></span>}
                  {lim!=null&&<span style={{color:C.dim}}>Limit: <span style={{fontFamily:'monospace',color:C.muted}}>{lim}</span></span>}
                  {opt!=null&&<span style={{color:C.dim}}>Optimal: <span style={{fontFamily:'monospace',color:C.muted}}>{opt}</span></span>}
                  {dev!=null&&<span style={{color:C.dim}}>Deviation: <span style={{fontFamily:'monospace',color:severity,fontWeight:600}}>{dev>0?'+':''}{dev}</span></span>}
                  {ttl!=null&&<span style={{color:C.dim}}>Time to limit: <span style={{fontFamily:'monospace',color:severity,fontWeight:600}}>{ttl}</span></span>}
                </div>
              </div>
            </div>)
          }
          return(<div key={k} style={{fontSize:'11px',color:C.dim,marginBottom:4,padding:'4px 0'}}><span style={{fontWeight:600}}>{param}:</span> {safeText(v)}</div>)
        }):<div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{safeText(benchInfo)}</div>}</div></Card>}
        {history.length>1&&<Card title="Efficiency History" delay={.45}><LnChart data={history.map(h=>+h.efficiency||0).reverse()} color={C.red} showArea unit="%" label="Efficiency History"/></Card>}
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[confidence,setConfidence]=useState(null);const[aiRecs,setAiRecs]=useState([]);
  useEffect(()=>{if(!token)return;
    loadLastAiLog('thermal',token).then(log=>{
      if(log?.full_response){
        const ai=log.full_response;
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));setTrendInfo(safeText(ai.trend_analysis));
        setAiRecs(parseRecs(ai.recommendations));
        _lastAiResponse['thermal']=ai;
      }
    });
    dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20').then(d=>{if(d?.length)setReadings(d)});},[token]);
  const save=async()=>{setSaving(true);setAiActive(true);const t=parseFloat(tp),c=parseFloat(ct);if(isNaN(t)||isNaN(c)){setSaving(false);setAiActive(false);return}
    const ai=await geminiAnalyze('thermal',{target_power:t,coolant_temp:c},readings,token,userId);
    let eff,out,therm,hr,sgSt,tSt,cSt;
    if(ai){
      eff=+(ai.efficiency||94);out=+(ai.current_output||Math.round(t*(eff/100)));therm=+(ai.thermal_load||Math.round(out*.92));hr=+(ai.heat_rate||10600);
      sgSt=ai.steam_generator||'OPTIMAL';tSt=ai.turbine||'OPTIMAL';cSt=ai.condenser||'OPTIMAL';
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));setTrendInfo(safeText(ai.trend_analysis));
      setAiRecs(parseRecs(ai.recommendations));
    } else {
      eff=Math.min(99,Math.max(70,94-(Math.abs(t-3200)*.002)-(Math.abs(c-290)*.1)));out=Math.round(t*(eff/100));therm=Math.round(out*.92);hr=Math.round(10500+Math.random()*500);
      sgSt='OPTIMAL';tSt=eff>85?'OPTIMAL':'WARNING';cSt='OPTIMAL';
      setConfidence(null);setReasoning([]);setCrossImpacts([]);setTrendInfo('');setAiRecs([]);
    }
    setAiActive(false);
    await dbPost('nuclear_thermal_readings',{target_power:t,current_output:out,coolant_temp:c,efficiency:Math.round(eff*10)/10,thermal_load:therm,heat_rate:hr,steam_generator_status:sgSt,turbine_status:tSt,condenser_status:cSt,user_id:userId},token);
    const fresh=await dbGet('nuclear_thermal_readings',token,'order=created_at.desc&limit=20');if(fresh)setReadings(fresh);setSaving(false);
    setTp('');setCt('');
  };
  const last=readings[0];
    const crossAlert=useCrossModuleAlert('thermal');
  return(<div><PH red="Thermal & Power" white="Calculations" sub="Real-time power output and thermal performance"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing thermal data...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Output" value={last?Math.round(+last.current_output)+'':'-'} sub="MW" delay={.05}/><StatCard label="Efficiency" value={last?(+last.efficiency).toFixed(1)+'%':'-'} accent={C.green} delay={.1}/><StatCard label="Thermal Load" value={last?Math.round(+last.thermal_load)+'':'-'} sub="MWh" delay={.15}/><StatCard label="Heat Rate" value={last?Math.round(+last.heat_rate)+'':'-'} sub="BTU/kWh" delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Power Output History" delay={.1}>{readings.length>1?<LnChart data={readings.map(r=>+r.current_output||0).reverse()} color={C.red} showArea unit=" MW" label={`Last ${readings.length} readings`}/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>Run calculations to build history</div>}</Card>
        <Card title="Efficiency Trend" delay={.2}>{readings.length>1?<LnChart data={readings.map(r=>+r.efficiency||0).reverse()} color={C.green} showArea unit="%" label="Efficiency %"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No data yet</div>}</Card>
        {aiRecs.length>0&&<Card title="AI Insights" delay={.22}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
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
  const[newName,setNewName]=useState('');const[newDeg,setNewDeg]=useState('');const[deleting,setDeleting]=useState(null);
  const deleteMat=async(id)=>{setDeleting(id);
    const mat=mats.find(m=>m.id===id);
    await dbDelete('nuclear_materials',id,token);
    const f=await dbGet('nuclear_materials',token,'order=material_name.asc');
    if(f){setMats(f);if(sel===id)setSel(f[0]?.id||'')}else{setMats([]);setSel('')}
    // Clear AI insights since they belonged to deleted material
    if(!f||!f.length){setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);}
    setMatWarning(null);
    // Notify cross-module brain
    const event={alert_level:'INFO',confidence:100,
      recommendations:[{title:`${mat?.material_name||'Material'} removed from tracking`}],
      trend_analysis:`Material "${mat?.material_name}" (${mat?.degradation_pct}% degradation) removed from monitoring. Remaining tracked: ${(f||[]).length} materials.`};
    _lastAiResponse['materials']=event;
    try{sessionStorage.setItem('llyana_ai_prev_materials',JSON.stringify(event))}catch{}
    // Log to all modules
    const modules=['reactor','thermal','operations','safety','energy'];
    for(const mod of modules){
      dbPost('ai_analysis_log',{module:mod,alert_level:'INFO',confidence:100,
        input_params:{action:'material_removed',material:mat?.material_name,degradation:mat?.degradation_pct},
        reasoning:[{step:1,action:`Material "${mat?.material_name}" removed from tracking`,result:`Operator removed ${mat?.material_name} (${mat?.degradation_pct}% degradation). ${(f||[]).length} materials remain tracked. Review if related inspections or maintenance tasks should be updated.`}],
        recommendations:[],cross_module_impacts:[{module:'materials',impact:`${mat?.material_name} no longer tracked. Verify no dependent maintenance or safety actions reference this material.`}],
        trend_analysis:`Cross-module update: Material removed from monitoring.`,
        full_response:event,user_id:userId},token).catch(()=>{});
    }
    // Real-time notification to all other modules
    emitCrossModuleEvent('materials', {
      source: 'Materials', level: 'INFO',
      message: `"${mat?.material_name}" (${mat?.degradation_pct}% degradation) removed from tracking. ${(f||[]).length} materials remain monitored.`
    });
    setDeleting(null);
  };
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[crossImpacts,setCrossImpacts]=useState([]);const[confidence,setConfidence]=useState(null);const[aiRecs,setAiRecs]=useState([]);
  useEffect(()=>{if(!token)return;
    loadLastAiLog('materials',token).then(log=>{
      if(log?.full_response){const ai=log.full_response;
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
        setAiRecs(parseRecs(ai.recommendations));
        _lastAiResponse['materials']=ai;}
    });
    dbGet('nuclear_materials',token,'order=material_name.asc').then(d=>{if(d?.length){setMats(d);setSel(d[0].id)}});},[token]);
  const[matWarning,setMatWarning]=useState(null);

  const addMat=async()=>{if(!newName||isNaN(parseFloat(newDeg)))return;
    // Duplicate check — case-insensitive
    const exists=mats.find(m=>m.material_name.toLowerCase().trim()===newName.toLowerCase().trim());
    if(exists){
      setMatWarning(`"${newName}" is already being tracked at ${(+exists.degradation_pct).toFixed(1)}% degradation. To update, delete the existing entry first or add a different material.`);
      return;
    }
    setSaving(true);setAiActive(true);setMatWarning(null);
    const deg=parseFloat(newDeg);
    const ai=await geminiAnalyze('materials',{material_name:newName,degradation_pct:deg},mats,token,userId);
    let st,remLife,corrRate;
    if(ai){
      // Check if AI flagged the material as invalid
      if(ai.material_valid===false){
        setMatWarning(`"${newName}" is not a recognized nuclear-grade material. ${parseRecs(ai.recommendations).map(r=>r.desc).join(' ')}`);
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
        setAiRecs(parseRecs(ai.recommendations));
        setAiActive(false);setSaving(false);return;
      }
      st=ai.alert_level==='SAFE'?'safe':ai.alert_level==='MONITOR'?'monitor':'warning';
      remLife=ai.remaining_life_months||Math.round((100-deg)/1.5);
      corrRate=ai.corrosion_rate||Math.round(deg*.3*100)/100;
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
      setAiRecs(parseRecs(ai.recommendations));
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
    const crossAlert=useCrossModuleAlert('materials');
  return(<div><PH red="Material Performance" white="Predictions" sub="Degradation curves and predictive analysis"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing material data...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    {warnCount>0&&<div style={{background:C.orangeDim,border:`1px solid ${C.orange}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .4s'}}><span style={{fontSize:'16px'}}>{'\u26A0'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.orange}}>{warnCount} Material Warning{warnCount>1?'s':''}</div><div style={{fontSize:'11px',color:C.dim}}>Inspection recommended</div></div></div>}
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Avg Degradation" value={avgDeg.toFixed(1)+'%'} accent={C.red} delay={.05}/><StatCard label="Tracked" value={String(mats.length)} sub={`${warnCount} warnings`} accent={C.green} delay={.1}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.15}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Degradation Levels" delay={.1}>{mats.length?<BrChart data={mats.map(m=>+m.degradation_pct||0)} labels={mats.map(m=>m.material_name?.slice(0,10))}/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No materials tracked yet. Add one.</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>{mats.map(m=>(<div key={m.id} style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'3px 0'}}><span style={{color:C.dim}}>{m.material_name}</span><span style={{fontFamily:'monospace',color:(+m.degradation_pct)>12?C.orange:C.green,fontWeight:600}}>{(+m.degradation_pct).toFixed(1)}%</span></div>))}</div>
        </Card>
        {aiRecs.length>0&&<Card title="AI Insights" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.3}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {matWarning&&<div style={{background:C.orangeDim,border:`1px solid ${C.orange}25`,borderRadius:10,padding:'12px 16px',marginBottom:12,animation:'fadeUp .3s'}}><div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{fontSize:'16px',flexShrink:0}}>{'\u26A0'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.orange,marginBottom:4}}>Material Not Recognized</div><div style={{fontSize:'11px',color:C.dim,lineHeight:1.4}}>{matWarning}</div></div></div></div>}
        <Card title="Add Material" delay={.15}>
          <Inp label="Material Name" value={newName} onChange={setNewName} required type="text" hint="e.g. Zircaloy-4"/>
          <Inp label="Degradation %" value={newDeg} onChange={setNewDeg} unit="%" required min={0} max={100}/>
          <Btn onClick={addMat} disabled={saving||aiActive}>{aiActive?'AI Analyzing...':saving?'Processing...':'Add Material'}</Btn>
        </Card>
        {selMat&&<Card title={`Details: ${selMat.material_name}`} delay={.25}>
          <div style={{fontSize:'24px',fontFamily:'monospace',fontWeight:700,color:(+selMat.degradation_pct)>12?C.orange:C.red,marginBottom:8}}>{(+selMat.degradation_pct).toFixed(1)}%</div>
          {[['Status',selMat.status?.toUpperCase()],['Remaining Life',selMat.remaining_life_months+' months'],['Corrosion Rate',selMat.corrosion_rate],['Last Inspection',selMat.last_inspection]].map(([l,v])=><div key={l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'11px'}}><span style={{color:C.muted}}>{l}</span><span style={{fontFamily:'monospace',color:C.text}}>{v||'-'}</span></div>)}
        </Card>}
        {mats.length>0&&<Card title="Select Material" delay={.2}>{mats.map(m=><div key={m.id} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 8px',borderRadius:6,background:sel===m.id?C.redDim:'transparent',marginBottom:2,transition:'all .2s'}}><div onClick={()=>setSel(m.id)} style={{flex:1,display:'flex',justifyContent:'space-between',cursor:'pointer'}}><span style={{fontSize:'11px',color:sel===m.id?C.red:C.dim}}>{m.material_name}</span><span style={{fontSize:'10px',fontFamily:'monospace',color:(+m.degradation_pct)>12?C.orange:C.green}}>{(+m.degradation_pct).toFixed(1)}%</span></div><button onClick={e=>{e.stopPropagation();if(confirm(`Delete ${m.material_name}?`))deleteMat(m.id)}} disabled={deleting===m.id} style={{background:'transparent',border:'none',color:C.muted,fontSize:'10px',cursor:'pointer',padding:'2px 4px',borderRadius:4,opacity:deleting===m.id?.3:1}} onMouseEnter={e=>e.target.style.color=C.red} onMouseLeave={e=>e.target.style.color=C.muted}>{deleting===m.id?'...':'\u2715'}</button></div>)}</Card>}
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
  useEffect(()=>{if(!token)return;
    loadLastAiLog('operations',token).then(log=>{
      if(log?.full_response){const ai=log.full_response;
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
        setAiRecs(parseRecs(ai.recommendations));
        setSchedInsights(safeText(ai.scheduling_insights));setPlantAvail(ai.plant_availability_pct||null);
        _lastAiResponse['operations']=ai;}
    });
    dbGet('nuclear_maintenance',token,'order=scheduled_date.asc').then(d=>{if(d)setTasks(d)});},[token]);
  const add=async()=>{if(!newTask||!newDate)return;setSaving(true);setAiActive(true);
    await dbPost('nuclear_maintenance',{task_name:newTask,scheduled_date:newDate,duration_hours:parseFloat(newHrs)||4,priority:newPri,status:'scheduled',assigned_team:'Team Alpha',user_id:userId},token);
    const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);
    // Run AI analysis on full task list
    const ai=await geminiAnalyze('operations',{new_task:{name:newTask,date:newDate,priority:newPri,hours:newHrs},all_tasks:f||tasks},f||tasks,token,userId);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
      setAiRecs(parseRecs(ai.recommendations));
      setSchedInsights(safeText(ai.scheduling_insights));setPlantAvail(ai.plant_availability_pct||null);
    } else { setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);setSchedInsights('');setPlantAvail(null); }
    setAiActive(false);setNewTask('');setNewDate('');setSaving(false);};
  const complete=async(id)=>{await dbPatch('nuclear_maintenance',id,{status:'completed',completed_at:new Date().toISOString()},token);const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);};
  const deleteTask=async(id)=>{
    const task=tasks.find(t=>t.id===id);
    await dbDelete('nuclear_maintenance',id,token);
    const f=await dbGet('nuclear_maintenance',token,'order=scheduled_date.asc');if(f)setTasks(f);else setTasks([]);
    // Notify cross-module brain
    const event={alert_level:task?.priority==='CRITICAL'?'WARNING':'INFO',confidence:100,
      recommendations:[{title:`Task "${task?.task_name||'Task'}" deleted`,severity:task?.priority==='CRITICAL'?'warning':'info'}],
      trend_analysis:`Maintenance task "${task?.task_name}" (${task?.priority} priority) removed. ${(f||[]).length} tasks remain scheduled.${task?.priority==='CRITICAL'?' WARNING: Deleted task was CRITICAL priority — verify no safety-critical maintenance is being skipped.':''}`};
    _lastAiResponse['operations']=event;
    try{sessionStorage.setItem('llyana_ai_prev_operations',JSON.stringify(event))}catch{}
    // Log to affected modules
    const modules=['reactor','thermal','materials','safety','energy'];
    for(const mod of modules){
      dbPost('ai_analysis_log',{module:mod,alert_level:task?.priority==='CRITICAL'?'WARNING':'INFO',confidence:100,
        input_params:{action:'task_deleted',task:task?.task_name,priority:task?.priority},
        reasoning:[{step:1,action:`Maintenance task "${task?.task_name}" deleted`,result:`Operator removed ${task?.priority} priority task "${task?.task_name}". ${(f||[]).length} tasks remain.${task?.priority==='CRITICAL'?' This was a CRITICAL task — all modules should verify no dependent safety actions are affected.':''}`}],
        recommendations:[],cross_module_impacts:[{module:'operations',impact:`${task?.task_name} removed from schedule.${task?.priority==='CRITICAL'?' CRITICAL task deletion — verify safety compliance.':''}`}],
        trend_analysis:`Cross-module update: Maintenance task deleted.`,
        full_response:event,user_id:userId},token).catch(()=>{});
    }
    // Real-time notification to all other modules
    emitCrossModuleEvent('operations', {
      source: 'Operations', level: task?.priority==='CRITICAL'?'WARNING':'INFO',
      message: `Task "${task?.task_name}" (${task?.priority}) deleted. ${(f||[]).length} tasks remain.${task?.priority==='CRITICAL'?' CRITICAL task removed — verify safety compliance.':''}`
    });
  };
  const active=tasks.filter(t=>t.status!=='completed'&&t.status!=='cancelled');
  const completed=tasks.filter(t=>t.status==='completed');
  const filtered=filter==='All'?active:active.filter(t=>t.priority===filter.toUpperCase());
  const nextDays=active.length?Math.max(0,Math.ceil((new Date(active[0]?.scheduled_date)-new Date())/86400000)):'-';
  const priC={CRITICAL:C.red,HIGH:C.yellow,MEDIUM:C.cyan,LOW:C.green};
    const crossAlert=useCrossModuleAlert('operations');
  return(<div><PH red="Operational" white="Monitoring" sub="Maintenance scheduling and timeline management"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing maintenance schedule...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Next Maintenance" value={String(nextDays)} sub="days" delay={.05}/><StatCard label="Scheduled" value={String(active.length)} sub="Active tasks" delay={.1}/><StatCard label="Completed" value={String(completed.length)} accent={C.green} delay={.15}/>{plantAvail&&<StatCard label="Plant Availability" value={plantAvail+'%'} accent={plantAvail>90?C.green:C.orange} delay={.2}/>}{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Maintenance Timeline" delay={.1} actions={<div style={{display:'flex',gap:6}}>{['All','Critical','High','Medium'].map(f=><Pill key={f} active={filter===f} onClick={()=>setFilter(f)}>{f}</Pill>)}</div>}>
          {filtered.length?filtered.map((t,i)=>(<div key={t.id} onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)} style={{background:hov===t.id?C.bgCardHover:C.bg,border:`1px solid ${hov===t.id?(priC[t.priority]||C.cyan)+'30':C.border}`,borderRadius:10,padding:'14px 16px',marginBottom:8,borderLeft:`3px solid ${priC[t.priority]||C.cyan}`,animation:`slideIn .3s ease-out ${i*.05}s both`,transition:'all .25s',cursor:'pointer',transform:hov===t.id?'translateX(4px)':'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:'13px',fontWeight:500}}>{t.task_name}</div><div style={{fontSize:'10px',color:C.muted,marginTop:2}}>{t.scheduled_date} {'\u00B7'} {t.duration_hours}h{t.assigned_team?` ${'\u00B7'} ${t.assigned_team}`:''}</div></div>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{background:(priC[t.priority]||C.cyan)+'18',color:priC[t.priority]||C.cyan,fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:4}}>{t.priority}</span><button onClick={e=>{e.stopPropagation();complete(t.id)}} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'9px',padding:'2px 6px',cursor:'pointer'}}>{'\u2713'}</button><button onClick={e=>{e.stopPropagation();if(confirm(`Delete "${t.task_name}"?`))deleteTask(t.id)}} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,fontSize:'9px',padding:'2px 6px',cursor:'pointer'}} onMouseEnter={e=>e.target.style.color=C.red} onMouseLeave={e=>e.target.style.color=C.muted}>{'\u2715'}</button></div></div>
          </div>)):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No tasks. Add one.</div>}
        </Card>
        {aiRecs.length>0&&<Card title="AI Insights" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`,animation:`slideIn .3s ease-out ${i*.1}s both`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {schedInsights&&<Card title="Scheduling Insights" delay={.3}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{schedInsights}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.35}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Add Task" delay={.15}>
          <Inp label="Task Name" value={newTask} onChange={setNewTask} required type="text"/>
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
    loadLastAiLog('safety',token).then(log=>{
      if(log?.full_response){const ai=log.full_response;
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
        setAiRecs(parseRecs(ai.recommendations));
        setTrendInfo(safeText(ai.trend_analysis));setSafetyPosture(safeText(ai.safety_posture));setRegGaps((ai.regulatory_gaps||[]).map(g=>typeof g==='string'?g:safeText(g)));
        _lastAiResponse['safety']=ai;}
    });
    dbGet('alerts',token,'order=created_at.desc&limit=20').then(d=>{if(d)setAlerts(d)});
    dbGet('nuclear_compliance',token,'order=standard_name.asc').then(d=>{if(d)setComp(d)});
  },[token]);
  const[resolving,setResolving]=useState(null);const[resolveNote,setResolveNote]=useState('');const[resolveResult,setResolveResult]=useState(null);
  const startResolve=(id)=>{setResolving(id);setResolveNote('');setResolveResult(null)};
  const cancelResolve=()=>{setResolving(null);setResolveNote('');setResolveResult(null)};
  const confirmResolve=async()=>{if(!resolveNote.trim())return;
    const alert=alerts.find(a=>a.id===resolving);
    setResolveResult('analyzing');
    // AI validates the resolution with full cross-module context
    const ai=await geminiAnalyze('safety',{
      action:'validate_resolution',
      alert_being_resolved:{title:alert?.title,description:alert?.description,alert_level:alert?.alert_level,created_at:alert?.created_at},
      operator_resolution_note:resolveNote,
      active_alerts:alerts.filter(a=>a.status==='active'&&a.id!==resolving),
      compliance_standards:comp
    },alerts,token,userId);
    // Update alert in database
    await dbPatch('alerts',resolving,{status:'resolved',resolved_at:new Date().toISOString()},token);
    // Log full resolution with AI assessment
    await dbPost('ai_analysis_log',{module:'safety',alert_level:ai?.alert_level||'INFO',confidence:ai?.confidence||100,
      input_params:{action:'alert_resolved',alert_id:resolving,alert_title:alert?.title,alert_level:alert?.alert_level,operator_note:resolveNote},
      reasoning:ai?.reasoning||[{step:1,action:'Alert resolved by operator',result:resolveNote}],
      recommendations:ai?.recommendations||[],cross_module_impacts:ai?.cross_module_impacts||[],
      trend_analysis:safeText(ai?.trend_analysis||'Alert resolved'),
      full_response:ai||{alert_level:'INFO',action:'resolve',note:resolveNote},user_id:userId},token);
    // Update AI display
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
      setAiRecs(parseRecs(ai.recommendations));
      setTrendInfo(safeText(ai.trend_analysis));setSafetyPosture(safeText(ai.safety_posture));setRegGaps((ai.regulatory_gaps||[]).map(g=>typeof g==='string'?g:safeText(g)));
    }
    const approved=ai?.alert_level==='SAFE'||ai?.alert_level==='MONITOR';
    setResolveResult(approved?'approved':'flagged');
    // CROSS-MODULE PROPAGATION — update brain so all modules know about resolution
    _lastAiResponse['safety_resolution'] = {
      alert_level: approved?'SAFE':'WARNING',
      confidence: ai?.confidence||100,
      recommendations: [{title:`Alert "${alert?.title}" resolved`,desc:resolveNote}],
      trend_analysis: `Resolution ${approved?'approved':'flagged'} by AI: ${alert?.title} — ${resolveNote.slice(0,100)}`
    };
    // Log cross-module events so each module picks up the resolution on next load
    const impactedModules = (ai?.cross_module_impacts||[]).map(c=>c.module).filter(Boolean);
    const allModules = ['reactor','thermal','materials','operations','energy'];
    const modulesToNotify = impactedModules.length ? impactedModules : allModules;
    for(const mod of modulesToNotify){
      await dbPost('ai_analysis_log',{module:mod,alert_level:'INFO',confidence:100,
        input_params:{action:'cross_module_resolution_notice',source_module:'safety',resolved_alert:alert?.title,resolution_note:resolveNote,ai_verdict:approved?'approved':'flagged'},
        reasoning:[{step:1,action:`Safety alert "${alert?.title}" resolved`,result:`Operator action: ${resolveNote.slice(0,150)}. AI verdict: ${approved?'Resolution adequate':'Resolution flagged for review'}.`}],
        recommendations:ai?.recommendations||[],cross_module_impacts:[{module:'safety',impact:`Alert "${alert?.title}" has been resolved. ${approved?'Corrective action validated by AI.':'AI flagged concerns — monitor closely.'}`}],
        trend_analysis:`Cross-module update: Safety alert resolved. ${approved?'System safety posture improved.':'Review recommended.'}`,
        full_response:{alert_level:'INFO',source:'safety_resolution',resolved_alert:alert?.title,verdict:approved?'approved':'flagged'},
        user_id:userId},token).catch(()=>{});
    }
    const f=await dbGet('alerts',token,'order=created_at.desc&limit=20');if(f)setAlerts(f);
    // Real-time notification to all other modules
    emitCrossModuleEvent('safety', {
      source: 'Safety', level: approved?'INFO':'WARNING',
      message: `Alert "${alert?.title}" resolved. ${approved?'AI validated corrective action.':'AI flagged concerns — review recommended.'} Action: ${resolveNote.slice(0,100)}`
    });
    setTimeout(()=>{setResolving(null);setResolveNote('');setResolveResult(null)},4000);
  };
  const addComp=async()=>{if(!newStd)return;setSaving(true);setAiActive(true);
    try{
    await dbPost('nuclear_compliance',{standard_name:newStd,standard_code:newCode||null,last_review:new Date().toISOString().slice(0,10),status:'PENDING',user_id:userId},token);
    const freshComp=await dbGet('nuclear_compliance',token,'order=standard_name.asc');if(freshComp)setComp(freshComp);
    // Run AI safety analysis
    const ai=await geminiAnalyze('safety',{active_alerts:alerts.filter(a=>a.status==='active'),compliance_standards:freshComp||comp,new_standard:{name:newStd,code:newCode}},alerts,token,userId);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
      setAiRecs(parseRecs(ai.recommendations));
      setTrendInfo(safeText(ai.trend_analysis));setSafetyPosture(safeText(ai.safety_posture));setRegGaps((ai.regulatory_gaps||[]).map(g=>typeof g==='string'?g:safeText(g)));
      // Update compliance status based on AI assessment
      const compStatus = ai.alert_level==='SAFE'||ai.alert_level==='MONITOR'?'COMPLIANT':'NON-COMPLIANT';
      if(freshComp){
        for(const c of freshComp){
          await dbPatch('nuclear_compliance',c.id,{status:compStatus},token);
        }
        const updated=await dbGet('nuclear_compliance',token,'order=standard_name.asc');if(updated)setComp(updated);
      }
    } else { setConfidence(null);setReasoning([]);setCrossImpacts([]);setAiRecs([]);setTrendInfo('');setSafetyPosture('');setRegGaps([]); }
    }catch(err){console.error('Llyana: Safety addComp error:',err)}
    setAiActive(false);setNewStd('');setNewCode('');setSaving(false);};
  const runSafetyAudit=async()=>{setAiActive(true);
    try{
    const ai=await geminiAnalyze('safety',{active_alerts:alerts.filter(a=>a.status==='active'),compliance_standards:comp},alerts,token,userId);
    if(ai){
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));
      setAiRecs(parseRecs(ai.recommendations));
      setTrendInfo(safeText(ai.trend_analysis));setSafetyPosture(safeText(ai.safety_posture));setRegGaps((ai.regulatory_gaps||[]).map(g=>typeof g==='string'?g:safeText(g)));
      // Update compliance statuses based on AI assessment
      const compStatus = ai.alert_level==='SAFE'||ai.alert_level==='MONITOR'?'COMPLIANT':'NON-COMPLIANT';
      if(comp.length){
        for(const c of comp){await dbPatch('nuclear_compliance',c.id,{status:compStatus,last_review:new Date().toISOString().slice(0,10)},token)}
        const updated=await dbGet('nuclear_compliance',token,'order=standard_name.asc');if(updated)setComp(updated);
      }
    }
    }catch(err){console.error('Llyana: Safety audit error:',err)}
    setAiActive(false);};
  const activeAlerts=alerts.filter(a=>a.status==='active');
  const critCount=activeAlerts.filter(a=>a.alert_level==='CRITICAL').length;
  const warnCount=activeAlerts.filter(a=>a.alert_level==='WARNING').length;
  const compOk=comp.filter(c=>c.status==='COMPLIANT').length;
  const alC={CRITICAL:C.red,WARNING:C.orange,MONITOR:C.yellow,SAFE:C.green};
    const crossAlert=useCrossModuleAlert('safety');
  return(<div><PH red="Safety & Compliance" white="Flagging" sub="Alert monitoring and regulatory compliance"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is running safety audit...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Critical" value={String(critCount)} accent={C.red} delay={.05}/><StatCard label="Warnings" value={String(warnCount)} accent={C.yellow} delay={.1}/><StatCard label="Active" value={String(activeAlerts.length)} delay={.15}/><StatCard label="Compliance" value={`${compOk}/${comp.length}`} accent={C.green} delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Safety Alerts" delay={.1}>
          {alerts.length?alerts.map((a,i)=>{const ac=alC[a.alert_level]||C.gray;return(<div key={a.id} style={{background:ac+'08',border:`1px solid ${ac}20`,borderRadius:10,padding:'14px 16px',marginBottom:8,animation:`fadeUp .3s ease-out ${i*.06}s both`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><div style={{fontSize:'13px',fontWeight:600}}>{a.title||'Alert'}</div><div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{fontSize:'9px',fontWeight:700,color:a.status==='resolved'?C.green:a.status==='monitoring'?C.yellow:C.cyan}}>{a.status?.toUpperCase()}</span>{a.status==='active'&&resolving!==a.id&&<button onClick={()=>startResolve(a.id)} style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:4,color:C.green,fontSize:'8px',padding:'2px 6px',cursor:'pointer'}}>Resolve</button>}</div></div>
            <div style={{fontSize:'11px',color:C.dim,marginBottom:4}}>{a.description||''}</div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'9px',color:C.muted,fontFamily:'monospace'}}>{a.created_at?new Date(a.created_at).toLocaleString():''}</span><span style={{fontSize:'8px',background:ac+'15',color:ac,padding:'2px 6px',borderRadius:3,fontWeight:600}}>{a.alert_level}</span></div>
            {resolving===a.id&&<div style={{marginTop:12,padding:'14px',background:C.bg,borderRadius:10,border:`1px solid ${C.cyan}25`,animation:'fadeUp .3s'}}>
              <div style={{fontSize:'12px',fontWeight:600,color:C.cyan,marginBottom:8}}>Resolution Report</div>
              {resolveResult==='analyzing'?<div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 0'}}><div style={{width:14,height:14,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'11px',color:C.cyan}}>Llyana AI is validating resolution...</span></div>
              :resolveResult==='approved'?<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:C.greenDim,borderRadius:8,border:`1px solid ${C.green}25`}}><span style={{color:C.green,fontSize:'14px'}}>{'\u2713'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.green}}>Resolution Approved</div><div style={{fontSize:'10px',color:C.dim}}>AI has validated the corrective action. Alert resolved.</div></div></div>
              :resolveResult==='flagged'?<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}25`}}><span style={{color:C.orange,fontSize:'14px'}}>{'\u26A0'}</span><div><div style={{fontSize:'12px',fontWeight:600,color:C.orange}}>Resolution Flagged</div><div style={{fontSize:'10px',color:C.dim}}>AI has concerns about this resolution. Alert resolved but flagged for review.</div></div></div>
              :<div>
                <textarea value={resolveNote} onChange={e=>setResolveNote(e.target.value)} placeholder="Describe the corrective action taken (required)..." rows={3} style={{width:'100%',background:C.bgInput,border:`1.5px solid ${C.borderLight}`,borderRadius:8,padding:'10px 12px',color:C.text,fontSize:'12px',resize:'vertical',fontFamily:'inherit',outline:'none',boxSizing:'border-box',minHeight:70}}/>
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <button onClick={confirmResolve} disabled={!resolveNote.trim()} style={{flex:1,background:resolveNote.trim()?C.green:C.gray,border:'none',borderRadius:8,padding:'8px',color:'#fff',fontSize:'11px',fontWeight:600,cursor:resolveNote.trim()?'pointer':'not-allowed',opacity:resolveNote.trim()?1:.5}}>Submit & Validate</button>
                  <button onClick={cancelResolve} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 14px',color:C.dim,fontSize:'11px',cursor:'pointer'}}>Cancel</button>
                </div>
                <div style={{fontSize:'9px',color:C.muted,marginTop:6}}>Llyana AI will validate your corrective action against current system state</div>
              </div>}
            </div>}
          </div>)}):<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No alerts. System clean.</div>}
        </Card>
        {safetyPosture&&<Card title="Safety Posture Assessment" delay={.15}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{safetyPosture}</div></Card>}
        {aiRecs.length>0&&<Card title="AI Safety Recommendations" delay={.2}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {regGaps.length>0&&<Card title="Regulatory Gaps" delay={.3}><div>{regGaps.map((g,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.red+'08',borderRadius:8,border:`1px solid ${C.red}15`}}><span style={{color:C.red,fontSize:'12px'}}>{'\u26A0'}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(g)}</span></div>))}</div></Card>}
        {trendInfo&&<Card title="Alert Trend Analysis" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.4}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
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
          <Inp label="Standard Name" value={newStd} onChange={setNewStd} required type="text" hint="e.g. NRC 10 CFR 50"/>
          <Inp label="Standard Code" type="text" value={newCode} onChange={setNewCode} hint="Optional"/>
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
  const[aiActive,setAiActive]=useState(false);const[reasoning,setReasoning]=useState([]);const[trendInfo,setTrendInfo]=useState('');const[deployInsights,setDeployInsights]=useState('');const[confidence,setConfidence]=useState(null);const[crossImpacts,setCrossImpacts]=useState([]);const[aiRecs,setAiRecs]=useState([]);
  useEffect(()=>{if(!token)return;
    loadLastAiLog('energy',token).then(log=>{
      if(log?.full_response){const ai=log.full_response;
        setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));
        setTrendInfo(safeText(ai.trend_analysis));setDeployInsights(safeText(ai.deployment_insights));
        setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));setAiRecs(parseRecs(ai.recommendations));
        _lastAiResponse['energy']=ai;}
    });
    dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12').then(d=>{if(d?.length)setReadings(d)});},[token]);
  const calc=async()=>{const f=parseFloat(ft),a=parseFloat(area);if(isNaN(f)||isNaN(a))return;setSaving(true);setAiActive(true);
    const ai=await geminiAnalyze('energy',{location:loc,foot_traffic_per_min:f,area_sqm:a},readings,token,userId);
    let raw,net,daily,monthly,eff;
    if(ai){
      raw=+(ai.raw_power_w||(f*a*3.5*.01));net=+(ai.net_power_w||(raw*.88));daily=+(ai.daily_kwh||(net*16/1000));monthly=+(ai.monthly_kwh||(daily*30));eff=+(ai.efficiency_pct||3.08);
      setConfidence(ai.confidence||null);setReasoning(parseReasoning(ai.reasoning));setTrendInfo(safeText(ai.trend_analysis));setDeployInsights(safeText(ai.deployment_insights));
      setCrossImpacts(parseCrossImpacts(ai.cross_module_impacts));setAiRecs(parseRecs(ai.recommendations));
    } else {
      raw=f*a*3.5*.01;net=raw*(1-.12);daily=net*16/1000;monthly=daily*30;eff=3.5*(1-.12)*(1-(Math.random()*.02));
      setConfidence(null);setReasoning([]);setTrendInfo('');setDeployInsights('');setCrossImpacts([]);setAiRecs([]);
    }
    setAiActive(false);
    await dbPost('nuclear_egm_data',{location:loc,foot_traffic_per_min:f,area_sqm:a,raw_power_w:Math.round(raw*100)/100,net_power_w:Math.round(net*100)/100,daily_kwh:Math.round(daily*100)/100,monthly_kwh:Math.round(monthly*100)/100,efficiency_pct:Math.round(eff*100)/100,mat_condition:'good',user_id:userId},token);
    const fresh=await dbGet('nuclear_egm_data',token,'order=created_at.desc&limit=12');if(fresh)setReadings(fresh);setSaving(false);
    setFt('');setArea('');
  };
  const last=readings[0];
  const annualRev=last?((+last.monthly_kwh)*12*0.12).toFixed(2):'-';
    const crossAlert=useCrossModuleAlert('energy');
  return(<div><PH red="Energy Yield" white="Projections" sub="EGM mat yield projections and forecast"/>
    {aiActive&&<div style={{background:C.cyanDim,border:`1px solid ${C.cyan}25`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,animation:'fadeUp .3s'}}><div style={{width:16,height:16,border:`2px solid ${C.cyan}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><span style={{fontSize:'12px',color:C.cyan}}>Llyana AI is analyzing EGM data...</span></div>}
    <CrossModuleAlertBanner alert={crossAlert}/>
    <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}><StatCard label="Daily Yield" value={last?(+last.daily_kwh).toFixed(2)+'':'-'} sub="kWh" delay={.05}/><StatCard label="Monthly" value={last?(+last.monthly_kwh).toFixed(1)+'':'-'} sub="kWh" delay={.1}/><StatCard label="Net Power" value={last?(+last.net_power_w).toFixed(1)+'':'-'} sub="W" delay={.15}/><StatCard label="Annual Revenue" value={annualRev!=='-'?'$'+annualRev:'-'} sub="USD" accent={C.green} delay={.2}/>{confidence&&<StatCard label="AI Confidence" value={confidence+'%'} accent={C.cyan} delay={.25}/>}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="Yield History" delay={.1}>{readings.length>1?<LnChart data={readings.map(r=>+r.monthly_kwh||0).reverse()} color={C.red} showArea unit=" kWh" label="Monthly kWh"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>Run calculations to build history</div>}</Card>
        <Card title="Efficiency Trend" delay={.2}>{readings.length>1?<LnChart data={readings.map(r=>+r.efficiency_pct||0).reverse()} color={C.green} unit="%" label="Efficiency %"/>:<div style={{color:C.muted,fontSize:'12px',padding:20,textAlign:'center'}}>No data yet</div>}</Card>
        {reasoning.length>0&&<Card title="AI Reasoning Chain" delay={.25}><div>{reasoning.map((r,i)=>(<div key={i} style={{display:'flex',gap:10,marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,animation:`slideIn .3s ease-out ${i*.08}s both`}}><div style={{width:24,height:24,borderRadius:'50%',background:C.cyan+'20',color:C.cyan,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,flexShrink:0}}>{r.step}</div><div><div style={{fontSize:'12px',fontWeight:600,color:C.text}}>{safeText(r.action)}</div><div style={{fontSize:'11px',color:C.dim,marginTop:2}}>{safeText(r.result)}</div></div></div>))}</div></Card>}
        {trendInfo&&<Card title="Traffic & Yield Trends" delay={.3}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{trendInfo}</div></Card>}
        {aiRecs.length>0&&<Card title="AI Insights" delay={.27}><div>{aiRecs.map((r,i)=>(<div key={i} style={{display:'flex',gap:12,marginBottom:12,padding:'10px 12px',background:r.sev==='critical'?C.red+'08':r.sev==='warning'?C.orangeDim:r.sev==='safe'?C.greenDim:C.cyanDim,borderRadius:10,border:`1px solid ${(r.sev==='critical'?C.red:r.sev==='warning'?C.orange:r.sev==='safe'?C.green:C.cyan)+'15'}`}}><div style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',background:(r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan)+'20',color:r.sev==='critical'?C.red:r.sev==='safe'?C.green:r.sev==='warning'?C.orange:C.cyan}}>{r.sev==='critical'?'\u2716':r.sev==='safe'?'\u2713':r.sev==='warning'?'\u26A0':'i'}</div><div><div style={{fontSize:'13px',fontWeight:600,marginBottom:3}}>{safeText(r.title)}</div><div style={{fontSize:'11px',color:C.dim}}>{safeText(r.desc)}</div></div></div>))}</div></Card>}
        {crossImpacts.length>0&&<Card title="Cross-Module Impact" delay={.32}><div>{crossImpacts.map((c,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:8,padding:'8px 10px',background:C.orangeDim,borderRadius:8,border:`1px solid ${C.orange}15`}}><span style={{fontSize:'10px',fontWeight:700,color:C.orange,textTransform:'uppercase',minWidth:70}}>{c.module}</span><span style={{fontSize:'11px',color:C.dim}}>{safeText(c.impact)}</span></div>))}</div></Card>}
        {deployInsights&&<Card title="Deployment Insights" delay={.35}><div style={{fontSize:'12px',color:C.dim,lineHeight:1.5}}>{deployInsights}</div></Card>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Card title="EGM Parameters" delay={.15}>
          <Inp label="Location" value={loc} onChange={setLoc} required type="text"/>
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

  // Preload ALL modules' last AI responses into cross-module brain
  useEffect(()=>{if(!token)return;
    const modules=['reactor','thermal','materials','operations','safety','energy'];
    modules.forEach(mod=>{
      // First check sessionStorage for instant brain
      try{const s=sessionStorage.getItem('llyana_ai_prev_'+mod);if(s){_lastAiResponse[mod]=JSON.parse(s);}}catch{}
      // Then load from Supabase for persistence across sessions
      loadLastAiLog(mod,token).then(log=>{
        if(log?.full_response){_lastAiResponse[mod]=log.full_response;
          try{sessionStorage.setItem('llyana_ai_prev_'+mod,JSON.stringify(log.full_response))}catch{}}
      });
    });
    console.log('Llyana: Cross-module brain preloading all modules');
  },[token]);

  useEffect(()=>{try{const s=sessionStorage.getItem('llyana_session');if(s){const p=JSON.parse(s);fetch(`${SB_URL}/auth/v1/user`,{headers:{Authorization:`Bearer ${p.token}`,apikey:SB_KEY}}).then(r=>{if(r.ok)setUser(p);else sessionStorage.removeItem('llyana_session');setLoading(false)}).catch(()=>{sessionStorage.removeItem('llyana_session');setLoading(false)});return}}catch(e){}setLoading(false)},[]);
  useEffect(()=>{try{sessionStorage.setItem('llyana_page',page)}catch(e){}},[page]);
  useEffect(()=>{try{const p=sessionStorage.getItem('llyana_page');if(p)setPage(p)}catch(e){}},[]);
  const logout=()=>{sessionStorage.removeItem('llyana_session');sessionStorage.removeItem('llyana_page');setUser(null);setPage('overview')};

  if(loading)return(<div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Inject/><div style={{textAlign:'center'}}><div style={{animation:'glow 2s ease-in-out infinite'}}><Logo size={64}/></div><div style={{color:C.muted,fontSize:'11px',marginTop:16,letterSpacing:'2px'}}>INITIALIZING...</div></div></div>);
  if(!user)return<><Inject/><LoginPage onLogin={setUser}/></>;

  const pg={
    overview:<OverviewPage onNav={setPage} token={token} sysStatus={sysStatus}/>,
    reactor:<ModuleErrorBoundary><ReactorPage token={token} userId={userId}/></ModuleErrorBoundary>,
    thermal:<ModuleErrorBoundary><ThermalPage token={token} userId={userId}/></ModuleErrorBoundary>,
    materials:<ModuleErrorBoundary><MaterialsPage token={token} userId={userId}/></ModuleErrorBoundary>,
    operations:<ModuleErrorBoundary><OperationsPage token={token} userId={userId}/></ModuleErrorBoundary>,
    safety:<ModuleErrorBoundary><SafetyPage token={token} userId={userId}/></ModuleErrorBoundary>,
    energy:<ModuleErrorBoundary><EnergyPage token={token} userId={userId}/></ModuleErrorBoundary>,
  };
  return<Layout page={page} onNav={setPage} user={user} onLogout={logout} sysStatus={sysStatus} aiStatus={aiStatus} aiCount={aiCount}>{pg[page]||pg.overview}</Layout>;
}
