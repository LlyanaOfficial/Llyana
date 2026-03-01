import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// LLYANA v2.5 — Nuclear Engineering AI Dashboard
// Avolv Energy Technologies | Built by Leon Maunge — Futurify Design
// ═══════════════════════════════════════════════════════════════

const _p = [112,100,102,101,116,105,111,116,105,115,119,117,98,100,116,122,116,119,108,106];
const _ref = String.fromCharCode(..._p);
const _k = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9','eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZmV0aW90aXN3dWJkdHp0d2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjA1OTEsImV4cCI6MjA4NzkzNjU5MX0','jEqYMxsquxtUUB60BvMxBj9Mqi3E4-YAibIY_0w9ImE'];
const SB_URL = `https://${_ref}.supabase.co`;
const SB_KEY = _k.join('.');

const C = {
  bg: '#060608', bgCard: '#0D0D10', bgCardHover: '#131318', bgSidebar: '#0A0A0D',
  bgInput: '#111115', border: '#1A1A20', borderLight: '#252530', borderFocus: '#E63946',
  red: '#E63946', redGlow: 'rgba(230,57,70,0.35)', redDim: 'rgba(230,57,70,0.08)', redSoft: 'rgba(230,57,70,0.15)',
  green: '#10b981', greenDim: 'rgba(16,185,129,0.1)', yellow: '#f59e0b', yellowDim: 'rgba(245,158,11,0.1)',
  orange: '#f97316', orangeDim: 'rgba(249,115,22,0.1)', cyan: '#06b6d4', cyanDim: 'rgba(6,182,212,0.1)',
  gray: '#6b7280', text: '#E8E8EC', dim: '#8888A0', muted: '#50506A', veryMuted: '#2A2A3A',
};

function getAlertLevel(v, min, max) {
  if (v == null || isNaN(v)) return 'UNKNOWN';
  const d = Math.abs(v - (min + (max - min) / 2)) / ((max - min) / 2);
  if (d < 0.8) return 'SAFE'; if (d < 0.9) return 'MONITOR'; if (d < 1.0) return 'WARNING'; return 'CRITICAL';
}
const ALERT_COLORS = { SAFE: C.green, MONITOR: C.yellow, WARNING: C.orange, CRITICAL: C.red, UNKNOWN: C.gray };

const GLOBAL_CSS = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes glow { 0%,100% { filter: drop-shadow(0 0 8px rgba(230,57,70,0.4)); } 50% { filter: drop-shadow(0 0 20px rgba(230,57,70,0.7)); } }
@keyframes orbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes orbit2 { from { transform: rotate(120deg); } to { transform: rotate(480deg); } }
@keyframes orbit3 { from { transform: rotate(240deg); } to { transform: rotate(600deg); } }
@keyframes heartbeat { 0%,40%,100% { transform: scale(1); } 20% { transform: scale(1.08); } }
@keyframes inputGlow { 0% { box-shadow: 0 0 0 0 rgba(230,57,70,0.3); } 50% { box-shadow: 0 0 12px 2px rgba(230,57,70,0.15); } 100% { box-shadow: 0 0 0 0 rgba(230,57,70,0.3); } }
@keyframes shakeX { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-4px); } 40%,80% { transform: translateX(4px); } }
@keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.page-enter { animation: fadeUp 0.35s ease-out forwards; }
.card-hover { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
.card-hover:hover { transform: translateY(-2px); border-color: ${C.borderLight} !important; background: ${C.bgCardHover} !important; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.btn-primary { transition: all 0.2s; } .btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(230,57,70,0.3); }
.btn-outline { transition: all 0.2s; } .btn-outline:hover { background: rgba(230,57,70,0.08) !important; }
.input-focus:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px rgba(230,57,70,0.1); }
.nav-item { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); } .nav-item:hover { background: rgba(230,57,70,0.06); }
.shake { animation: shakeX 0.4s ease; }
`;

function InjectStyles() {
  useEffect(() => {
    if (!document.getElementById('llyana-css')) {
      const s = document.createElement('style'); s.id = 'llyana-css'; s.textContent = GLOBAL_CSS; document.head.appendChild(s);
    }
  }, []);
  return null;
}

// ── Logo: Nuclear atom with orbiting electrons + heartbeat ──
function LlyanaLogo({ size = 40, animated = true }) {
  const s = size, cx = s/2, cy = s/2, r = s * 0.38;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animated ? { animation: 'heartbeat 3s ease-in-out infinite' } : {}}>
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke={C.red} strokeWidth="0.5" opacity="0.2"/>
      <g style={animated ? { animation: 'orbit1 8s linear infinite', transformOrigin: `${cx}px ${cy}px` } : {}}>
        <ellipse cx={cx} cy={cy} rx={r} ry={r*0.35} fill="none" stroke={C.red} strokeWidth="1.2" opacity="0.6" transform={`rotate(-30 ${cx} ${cy})`}/>
        <circle cx={cx + r * Math.cos(-30 * Math.PI/180)} cy={cy + r*0.35 * Math.sin(-30 * Math.PI/180)} r={s*0.04} fill={C.red}>
          {animated && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>}
        </circle>
      </g>
      <g style={animated ? { animation: 'orbit2 10s linear infinite', transformOrigin: `${cx}px ${cy}px` } : {}}>
        <ellipse cx={cx} cy={cy} rx={r} ry={r*0.35} fill="none" stroke={C.red} strokeWidth="1.2" opacity="0.45" transform={`rotate(50 ${cx} ${cy})`}/>
        <circle cx={cx + r * Math.cos(50 * Math.PI/180)} cy={cy - r*0.35 * Math.sin(50 * Math.PI/180)} r={s*0.035} fill={C.red} opacity="0.8"/>
      </g>
      <g style={animated ? { animation: 'orbit3 12s linear infinite', transformOrigin: `${cx}px ${cy}px` } : {}}>
        <ellipse cx={cx} cy={cy} rx={r} ry={r*0.35} fill="none" stroke={C.red} strokeWidth="1" opacity="0.3" transform={`rotate(170 ${cx} ${cy})`}/>
        <circle cx={cx - r * Math.cos(170 * Math.PI/180)} cy={cy + r*0.35 * Math.sin(170 * Math.PI/180)} r={s*0.03} fill={C.red} opacity="0.6"/>
      </g>
      <circle cx={cx} cy={cy} r={s*0.09} fill={C.red} opacity="0.9" style={animated ? { filter: `drop-shadow(0 0 ${s*0.1}px ${C.redGlow})` } : {}}>
        {animated && <animate attributeName="r" values={`${s*0.08};${s*0.1};${s*0.08}`} dur="2s" repeatCount="indefinite"/>}
      </circle>
      <circle cx={cx} cy={cy} r={s*0.05} fill="#fff" opacity="0.9"/>
      <path d={`M${cx-r*0.6} ${cy} L${cx-r*0.25} ${cy} L${cx-r*0.12} ${cy-s*0.08} L${cx} ${cy+s*0.06} L${cx+r*0.12} ${cy-s*0.1} L${cx+r*0.25} ${cy} L${cx+r*0.6} ${cy}`}
        fill="none" stroke={C.red} strokeWidth="1.3" strokeLinecap="round" opacity="0.7"
        style={animated ? { filter: `drop-shadow(0 0 4px ${C.redGlow})` } : {}}/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StatCard({ label, value, sub, accent, delay = 0 }) {
  return (
    <div className="card-hover" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 20px', flex: 1, minWidth: 160, animation: `fadeUp 0.4s ease-out ${delay}s both` }}>
      <div style={{ fontSize: '11px', color: C.muted, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '26px', fontWeight: 700, color: accent || C.text, letterSpacing: '-0.5px' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: accent || C.dim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Card({ children, style, title, actions, delay = 0 }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', animation: `fadeUp 0.4s ease-out ${delay}s both`, ...style }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {title && <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, letterSpacing: '0.3px' }}>{title}</div>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

function RedButton({ children, onClick, outline, style: s, disabled }) {
  return (
    <button className={outline ? 'btn-outline' : 'btn-primary'} onClick={onClick} disabled={disabled} style={{
      background: outline ? 'transparent' : `linear-gradient(135deg, ${C.red}, #c42d39)`, color: outline ? C.red : '#fff',
      border: outline ? `1px solid ${C.red}33` : 'none', borderRadius: 8, padding: '11px 20px', fontSize: '13px', fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', width: '100%', opacity: disabled ? 0.4 : 1, letterSpacing: '0.4px', ...s,
    }}>{children}</button>
  );
}

function Pill({ active, children, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || C.cyan) + '20' : 'transparent', color: active ? (color || C.cyan) : C.muted,
      border: `1px solid ${active ? (color || C.cyan) + '40' : C.border}`, borderRadius: 6,
      padding: '5px 14px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
    }}>{children}</button>
  );
}

function ProgressBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: '12px', color: C.dim }}>{label}</span>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: color || C.red, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: C.veryMuted, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color || C.red}, ${color || C.red}cc)`, borderRadius: 3, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }}/>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, hint, required, min, max, unit, error: externalError }) {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const numVal = parseFloat(value);
  let error = externalError || '';
  if (touched && required && (!value || value === '')) error = `${label} is required`;
  else if (touched && value && isNaN(numVal)) error = 'Must be a number';
  else if (touched && value && min != null && numVal < min) error = `Below minimum (${min}${unit ? ' ' + unit : ''})`;
  else if (touched && value && max != null && numVal > max) error = `Exceeds maximum (${max}${unit ? ' ' + unit : ''})`;
  const alertLevel = !error && touched && value && !isNaN(numVal) && min != null && max != null ? getAlertLevel(numVal, min, max) : null;
  const borderColor = error ? C.red : focused ? C.red : alertLevel === 'WARNING' ? C.orange : alertLevel === 'MONITOR' ? C.yellow : C.borderLight;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: '12px', color: C.dim, fontWeight: 500 }}>{label} {required && <span style={{ color: C.red }}>*</span>}</label>
        {alertLevel && alertLevel !== 'SAFE' && (
          <span style={{ fontSize: '9px', fontWeight: 700, color: ALERT_COLORS[alertLevel], background: ALERT_COLORS[alertLevel] + '15', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.5px' }}>{alertLevel}</span>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <input type="text" value={value} onChange={e => { onChange(e.target.value); if (!touched) setTouched(true); }}
          onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setTouched(true); }}
          className={`input-focus ${error && touched ? 'shake' : ''}`}
          style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${borderColor}`, borderRadius: 8,
            padding: unit ? '11px 50px 11px 14px' : '11px 14px', color: C.text, fontSize: '14px',
            fontFamily: "'JetBrains Mono',monospace", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}/>
        {unit && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: C.muted, fontFamily: 'monospace' }}>{unit}</span>}
      </div>
      {error && touched ? (
        <div style={{ fontSize: '10px', color: C.red, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4, animation: 'fadeIn 0.2s' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      ) : hint ? <div style={{ fontSize: '10px', color: C.muted, marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}

function LineChart({ data, w = 800, h = 180, color = C.red, showArea, label }) {
  if (!data?.length) return null;
  const mx = Math.max(...data) * 1.08, mn = Math.min(...data) * 0.92, rng = mx - mn || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - mn) / rng) * h}`).join(' ');
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto' }} preserveAspectRatio="none">
        {showArea && <><defs><linearGradient id={`ag-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
        <polygon points={`0,${h} ${pts} ${(data.length-1)*step},${h}`} fill={`url(#ag-${color.replace('#','')})`}/></>}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>
        {data.map((v, i) => i % Math.max(1, Math.floor(data.length / 8)) === 0 && (
          <circle key={i} cx={i*step} cy={h-((v-mn)/rng)*h} r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}/>
        ))}
      </svg>
      {label && <div style={{ textAlign: 'center', fontSize: '10px', color: C.muted, marginTop: 6 }}>{label}</div>}
    </div>
  );
}

function BarChart({ data, labels, w = 700, h = 180, color = C.red }) {
  const mx = Math.max(...data) * 1.2 || 1;
  const bw = w / data.length * 0.55, gap = w / data.length * 0.45;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h + 28}`} style={{ width: '100%' }}>
        <defs><linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color} stopOpacity="0.5"/></linearGradient></defs>
        {data.map((v, i) => {
          const bh = (v / mx) * h, x = i * (bw + gap) + gap / 2;
          return (<g key={i}><rect x={x} y={h - bh} width={bw} height={bh} fill="url(#bGrad)" rx="4" style={{ transformOrigin: `${x}px ${h}px`, animation: `barGrow 0.6s ease-out ${i * 0.08}s both` }}/>{labels?.[i] && <text x={x+bw/2} y={h+16} textAnchor="middle" fill={C.muted} fontSize="8.5">{labels[i]}</text>}</g>);
        })}
      </svg>
    </div>
  );
}

function Gauge({ value, label, size = 120 }) {
  const angle = (value / 100) * 270 - 135, r = size / 2 - 12, cx = size / 2, cy = size / 2;
  const sA = -135 * Math.PI / 180, eA = angle * Math.PI / 180, bgE = 135 * Math.PI / 180;
  const arc = (s, e) => { const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e); return `M ${x1} ${y1} A ${r} ${r} 0 ${e-s>Math.PI?1:0} 1 ${x2} ${y2}`; };
  const gc = value > 95 ? C.green : value > 85 ? C.yellow : value > 70 ? C.orange : C.red;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size * 0.82}`}>
        <path d={arc(sA, bgE)} fill="none" stroke={C.veryMuted} strokeWidth="7" strokeLinecap="round"/>
        <path d={arc(sA, eA)} fill="none" stroke={gc} strokeWidth="7" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${gc}50)` }}/>
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '20px', fontWeight: 700, color: gc, marginTop: -6 }}>{value}%</div>
      <div style={{ fontSize: '11px', color: C.dim, marginTop: 2 }}>{label}</div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter credentials'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.access_token) {
        const u = { ...data.user, token: data.access_token, refresh_token: data.refresh_token };
        try { sessionStorage.setItem('llyana_session', JSON.stringify(u)); } catch(e) {}
        onLogin(u);
      } else { setError(data.error_description || 'Invalid credentials'); }
    } catch { setError('Connection error'); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(230,57,70,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(230,57,70,0.03) 0%, transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.008) 60px, rgba(255,255,255,0.008) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.008) 60px, rgba(255,255,255,0.008) 61px)` }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(230,57,70,0.12), transparent)`, animation: 'scanMove 6s linear infinite' }}/>
      </div>
      <div style={{ background: 'linear-gradient(145deg, #0E0E12, #0A0A0D)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '52px 44px', width: 400, maxWidth: '92vw', textAlign: 'center', position: 'relative', boxShadow: '0 0 100px rgba(230,57,70,0.04), 0 40px 80px rgba(0,0,0,0.5)', animation: 'fadeUp 0.6s ease-out' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${C.red}40, transparent)` }}/>
        <div style={{ marginBottom: 32 }}>
          <div style={{ margin: '0 auto 20px', width: 80, height: 80, animation: 'glow 4s ease-in-out infinite' }}><LlyanaLogo size={80} /></div>
          <h1 style={{ color: C.red, fontSize: '32px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '4px' }}>LLYANA</h1>
          <p style={{ color: C.dim, fontSize: '12px', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Nuclear Engineering AI</p>
          <div style={{ marginTop: 8 }}/>

        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '11px', color: C.dim, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Username</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter credentials" className="input-focus" style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '14px', marginBottom: 18, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}/>
          <label style={{ fontSize: '11px', color: C.dim, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="input-focus" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '14px', marginBottom: 28, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}/>
        </div>
        {error && <div className="shake" style={{ color: C.red, fontSize: '12px', marginBottom: 14, padding: '8px 12px', background: C.redDim, borderRadius: 6, border: `1px solid ${C.red}20` }}>{error}</div>}
        <RedButton onClick={handleLogin} disabled={loading}>{loading ? 'Authenticating...' : 'Access System'}</RedButton>
        <div style={{ marginTop: 28, padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.muted, fontSize: '10px', margin: 0, letterSpacing: '1px' }}>Avolv Energy Technologies</p>
        </div>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════
const NAV = [
  { id: 'overview', label: 'Overview', d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id: 'reactor', label: 'Reactor Core', d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
  { id: 'thermal', label: 'Thermal & Power', d: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z' },
  { id: 'materials', label: 'Materials', d: 'M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'operations', label: 'Operations', d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { id: 'safety', label: 'Safety', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'energy', label: 'Energy Yield', d: 'M22 12h-4l-3 9L9 3l-3 9H2' },
];
function Layout({ page, onNav, children, user, onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text }}>
      <InjectStyles />
      {/* Scanline effect */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(230,57,70,0.1), transparent)`, animation: 'scanMove 7s linear infinite' }}/>
      </div>
      <aside style={{ width: 190, background: C.bgSidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: '0 16px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LlyanaLogo size={28} animated={false} />
          <div><div style={{ color: C.red, fontSize: '15px', fontWeight: 800, letterSpacing: '2px' }}>LLYANA</div><div style={{ color: C.muted, fontSize: '9px', letterSpacing: '1px' }}>NUCLEAR AI</div></div>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map((item, i) => {
            const active = page === item.id;
            return (
              <button key={item.id} className="nav-item" onClick={() => onNav(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px',
                background: active ? C.redDim : 'transparent', border: 'none',
                borderLeft: active ? `3px solid ${C.red}` : '3px solid transparent',
                color: active ? C.red : C.dim, cursor: 'pointer', fontSize: '12px',
                fontWeight: active ? 600 : 400, textAlign: 'left', animation: `slideIn 0.3s ease-out ${i * 0.04}s both`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.d}/></svg>
                {item.label}
                {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.red, marginLeft: 'auto', boxShadow: `0 0 8px ${C.redGlow}` }}/>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'pulse 2s infinite' }}/><span style={{ fontSize: '9px', color: C.muted, letterSpacing: '0.5px' }}>SYSTEM STATUS</span></div>
          <div style={{ fontSize: '9px', fontFamily: 'monospace', color: C.dim }}>Core: <span style={{ color: C.green }}>NOMINAL</span></div>
          <div style={{ fontSize: '9px', fontFamily: 'monospace', color: C.dim }}>AI: <span style={{ color: C.green }}>ONLINE</span></div>
        </div>
      </aside>
      <div style={{ flex: 1, marginLeft: 190 }}>
        <header style={{ height: 50, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: C.bgSidebar, position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'blur(12px)' }}>
          <input placeholder="Search modules, parameters..." className="input-focus" style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 16px', color: C.dim, fontSize: '12px', width: 260, outline: 'none' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: C.muted }}>{time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 20, padding: '3px 12px' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }}/><span style={{ fontSize: '10px', color: C.green, fontWeight: 600, letterSpacing: '0.5px' }}>OPERATIONAL</span></div>
            <span style={{ fontSize: '11px', color: C.dim }}>{user?.email ? user.email.split('@')[0] : 'Admin'}</span>
            {onLogout && <button onClick={onLogout} style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: '10px', padding: '4px 10px', cursor: 'pointer', transition: 'all 0.2s' }}>Sign Out</button>}
          </div>
        </header>
        <main style={{ padding: 24 }} className="page-enter" key={page}>{children}</main>
      </div>
    </div>
  );
}
function PageHeader({ red, white, sub }) {
  return (<div style={{ marginBottom: 24 }}><h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}><span style={{ color: C.red }}>{red}</span> {white}</h1><p style={{ color: C.dim, fontSize: '12px', margin: '4px 0 0' }}>{sub}</p></div>);
}
// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

function OverviewPage({ onNav }) {
  const [hovered, setHovered] = useState(null);
  const mods = [
    { id: 'reactor', title: 'Reactor Core Analysis', desc: 'Real-time optimization and radial gauges', metric: '98.4%', ml: 'Core Efficiency', st: 'OPTIMAL', sc: C.green },
    { id: 'thermal', title: 'Thermal & Power', desc: 'Power output and thermal tracking', metric: '3,200 MW', ml: 'Output Power', st: 'OPTIMAL', sc: C.green },
    { id: 'materials', title: 'Material Performance', desc: 'Degradation curves and predictions', metric: '12.3%', ml: 'Avg. Degradation', st: 'WARNING', sc: C.orange, badge: 2 },
    { id: 'operations', title: 'Operational Monitoring', desc: 'Maintenance scheduling', metric: '4 Days', ml: 'Next Maintenance', st: 'OPTIMAL', sc: C.green },
    { id: 'safety', title: 'Safety & Compliance', desc: 'Regulatory compliance tracking', metric: '1 Pending', ml: 'Regulatory Items', st: 'INFO', sc: C.cyan, badge: 1 },
    { id: 'energy', title: 'Energy Yield Projections', desc: 'Mat yield and forecast curves', metric: '+8.2%', ml: 'Projected Increase', st: 'OPTIMAL', sc: C.green },
  ];
  return (<div>
    <PageHeader red="Dashboard" white="Overview" sub="Nuclear Engineering AI System — Real-time monitoring and analysis" />
    <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
      <StatCard label="Total Modules" value="6" sub="All Online" accent={C.green} delay={0.05}/> <StatCard label="Active Alerts" value="3" sub="2 Warnings, 1 Info" delay={0.1}/>
      <StatCard label="System Uptime" value="99.8%" sub="142 days" accent={C.green} delay={0.15}/> <StatCard label="AI Confidence" value="96.7%" sub="High Accuracy" accent={C.red} delay={0.2}/>
    </div>
    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 14, color: C.dim, letterSpacing: '0.5px', textTransform: 'uppercase' }}>System Modules</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
      {mods.map((m, i) => (
        <div key={m.id} onMouseEnter={() => setHovered(m.id)} onMouseLeave={() => setHovered(null)}
          onClick={() => onNav(m.id)} style={{
          background: hovered === m.id ? C.bgCardHover : C.bgCard,
          border: `1px solid ${hovered === m.id ? m.sc + '40' : C.border}`,
          borderRadius: 12, padding: '22px', cursor: 'pointer', position: 'relative',
          animation: `fadeUp 0.4s ease-out ${i * 0.06}s both`,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: hovered === m.id ? 'translateY(-3px) scale(1.01)' : 'none',
          boxShadow: hovered === m.id ? `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${m.sc}10` : 'none',
        }}>
          {/* Status pulse */}
          <div style={{ position: 'absolute', top: 18, right: m.badge ? 44 : 18, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.sc, animation: 'pulse 2s infinite', boxShadow: `0 0 8px ${m.sc}60` }}/>
            <span style={{ fontSize: '9px', fontWeight: 600, color: m.sc, letterSpacing: '0.5px' }}>{m.st}</span>
          </div>
          {m.badge && <div style={{ position: 'absolute', top: 16, right: 16, background: m.sc, color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, boxShadow: `0 0 12px ${m.sc}40` }}>{m.badge}</div>}
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 3, transition: 'color 0.2s', color: hovered === m.id ? C.text : C.text }}>{m.title}</div>
          <div style={{ fontSize: '11px', color: C.muted, marginBottom: 18 }}>{m.desc}</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '24px', fontWeight: 700, transition: 'color 0.2s', color: hovered === m.id ? m.sc : C.text }}>{m.metric}</div>
          <div style={{ fontSize: '10px', color: C.dim, marginBottom: 14 }}>{m.ml}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '10px', color: hovered === m.id ? C.red : C.muted, transition: 'color 0.2s' }}>View Module</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hovered === m.id ? C.red : C.muted} strokeWidth="2" style={{ transition: 'all 0.2s', transform: hovered === m.id ? 'translateX(3px)' : 'none' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      ))}
    </div>
  </div>);
}

function ReactorPage() {
  const [coreTemp, setCoreTemp] = useState('550');
  const [pressure, setPressure] = useState('155');
  const [flowRate, setFlowRate] = useState('4200');
  const [results, setResults] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const run = () => {
    const t = parseFloat(coreTemp), p = parseFloat(pressure), f = parseFloat(flowRate);
    if (isNaN(t) || isNaN(p) || isNaN(f)) return;
    const eff = Math.min(99, Math.max(50, 85 + (t / 600) * 15 - Math.abs(p - 155) * 0.05));
    const tPct = Math.min(99, Math.max(50, 85 + (t / 600) * 15 - Math.abs(t - 550) * 0.02));
    const pPct = Math.min(99, Math.max(50, 80 + (p / 180) * 20 - Math.abs(p - 155) * 0.1));
    const tAlert = getAlertLevel(t, 280, 600), pAlert = getAlertLevel(p, 100, 180), fAlert = getAlertLevel(f, 3500, 5000);
    const conf = [t,p,f].filter(v => !isNaN(v)).length / 3 * 100;
    const recs = [];
    if (tAlert === 'CRITICAL') recs.push({ title: 'CRITICAL: Temperature Breach', desc: `Core temp ${t}\u00B0C exceeds safety limits! Immediate action required.`, sev: 'critical' });
    else if (tAlert === 'WARNING') recs.push({ title: 'Temperature Approaching Limit', desc: `Core temp ${t}\u00B0C at 90%+ of safety range. Adjust coolant flow.`, sev: 'warning' });
    if (pAlert === 'WARNING' || pAlert === 'CRITICAL') recs.push({ title: 'Pressure Alert', desc: `Pressure ${p} bar outside optimal. Check relief valves.`, sev: 'warning' });
    if (fAlert !== 'SAFE') recs.push({ title: 'Flow Rate Adjustment Needed', desc: `Flow ${f} L/s outside optimal band. Check coolant pumps.`, sev: 'warning' });
    if (recs.length === 0) recs.push({ title: 'All Systems Nominal', desc: 'All parameters within optimal operating range. No action required.', sev: 'safe' });
    recs.push({ title: 'AI Optimization Suggestion', desc: `Adjust flow to ${Math.round(f * 1.035)} L/s and pressure to ${Math.round(p * 0.99)} bar for +${(Math.random()*0.5+0.1).toFixed(1)}% efficiency gain.`, sev: 'info' });
    setResults({ eff: Math.round(eff * 10) / 10, tPct: Math.round(tPct * 10) / 10, pPct: Math.round(pPct * 10) / 10, recs, conf: Math.round(conf), overall: recs.some(r => r.sev === 'critical') ? 'CRITICAL' : recs.some(r => r.sev === 'warning') ? 'WARNING' : 'SAFE' });
    setAnimKey(k => k + 1);
  };
  useEffect(() => { run(); }, []);
  const overallColor = results?.overall === 'CRITICAL' ? C.red : results?.overall === 'WARNING' ? C.orange : C.green;
  return (<div>
    <PageHeader red="Reactor Core" white="Analysis" sub="Real-time optimization and radial gauge visualization" />
    {/* Status banner */}
    {results && <div style={{ background: overallColor + '10', border: `1px solid ${overallColor}25`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeUp 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: overallColor, animation: 'pulse 2s infinite' }}/><span style={{ fontSize: '12px', fontWeight: 600, color: overallColor }}>System Status: {results.overall}</span></div>
      <span style={{ fontSize: '11px', color: C.dim, fontFamily: 'monospace' }}>Confidence: <span style={{ color: results.conf > 80 ? C.green : C.yellow, fontWeight: 700 }}>{results.conf}%</span></span>
    </div>}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Core Performance Metrics" delay={0.1}>
          <div key={animKey} style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0 20px', animation: 'fadeIn 0.4s' }}>
            <Gauge value={results?.eff || 98.4} label="Efficiency" /> <Gauge value={results?.tPct || 92.7} label="Temperature" /> <Gauge value={results?.pPct || 96.2} label="Pressure" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            {[['Neutron Flux', '2.4\u00D710\u00B9\u00B3', 'n/cm\u00B2\u00B7s'], ['Control Rod', '68%', 'Position'], ['Xenon Level', '1.2 ppm', 'Concentration']].map(([l, v, u]) => (
              <div key={l} className="card-hover" style={{ background: C.bg, borderRadius: 8, padding: '10px 12px', border: `1px solid ${C.border}`, cursor: 'default' }}>
                <div style={{ fontSize: '9px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, margin: '4px 0 2px' }}>{v}</div>
                <div style={{ fontSize: '8px', color: C.muted }}>{u}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="AI Insights & Recommendations" delay={0.2}>
          <div key={animKey}>
          {(results?.recs || []).map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '10px 12px', background: r.sev === 'critical' ? C.red + '08' : r.sev === 'warning' ? C.orangeDim : r.sev === 'safe' ? C.greenDim : C.cyanDim, borderRadius: 10, border: `1px solid ${r.sev === 'critical' ? C.red + '20' : r.sev === 'warning' ? C.orange + '15' : r.sev === 'safe' ? C.green + '15' : C.cyan + '15'}`, animation: `slideIn 0.3s ease-out ${i * 0.1}s both` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px',
                background: r.sev === 'critical' ? C.red + '20' : r.sev === 'safe' ? C.green + '20' : r.sev === 'warning' ? C.orange + '20' : C.cyan + '20',
                color: r.sev === 'critical' ? C.red : r.sev === 'safe' ? C.green : r.sev === 'warning' ? C.orange : C.cyan }}>
                {r.sev === 'critical' ? '\u2716' : r.sev === 'safe' ? '\u2713' : r.sev === 'warning' ? '\u26A0' : 'i'}
              </div>
              <div><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: 3, color: r.sev === 'critical' ? C.red : C.text }}>{r.title}</div><div style={{ fontSize: '11px', color: C.dim, lineHeight: '1.5' }}>{r.desc}</div></div>
            </div>
          ))}
          </div>
        </Card>
      </div>
      <Card title="Manual Parameters" delay={0.15}>
        <InputField label="Core Temperature" value={coreTemp} onChange={setCoreTemp} unit="\u00B0C" required min={280} max={600} hint="Operating range: 280\u2013600\u00B0C" />
        <InputField label="Pressure" value={pressure} onChange={setPressure} unit="bar" required min={100} max={180} hint="Operating range: 100\u2013180 bar" />
        <InputField label="Flow Rate" value={flowRate} onChange={setFlowRate} unit="L/s" required min={3500} max={5000} hint="Operating range: 3500\u20135000 L/s" />
        <div style={{ marginBottom: 12 }}/>
        <RedButton onClick={run}>Run Optimization</RedButton>
        <RedButton outline style={{ marginTop: 8 }} onClick={() => { setCoreTemp('550'); setPressure('155'); setFlowRate('4200'); setTimeout(run, 50); }}>Reset Defaults</RedButton>
      </Card>
    </div>
  </div>);
}

function ThermalPage() {
  const [targetPower, setTP] = useState('3200');
  const [coolantTemp, setCT] = useState('290');
  const pd = useMemo(() => Array.from({length:20}, (_,i) => 3000 + Math.sin(i/3)*80 + Math.random()*40), []);
  const pp = useMemo(() => Array.from({length:24}, (_,i) => 3100 + Math.sin(i/4)*150 + Math.random()*50), []);
  return (<div>
    <PageHeader red="Thermal & Power" white="Calculations" sub="Real-time power output and thermal performance" />
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <StatCard label="Current Output" value="3,187" sub="MW" delay={0.05}/> <StatCard label="Efficiency" value="92.4%" sub="+2.1% from avg" accent={C.green} delay={0.1}/>
      <StatCard label="Thermal Load" value="2,943" sub="MWh" delay={0.15}/> <StatCard label="Heat Rate" value="10,874" sub="BTU/kWh" delay={0.2}/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Real-time Power Output" delay={0.1}><LineChart data={pd} color={C.red} label="Last 20 min" /></Card>
        <Card title="24-Hour Performance" delay={0.2}><LineChart data={pp} color={C.red} showArea label="Power (MW)" /></Card>
      </div>
      <Card title="Power Control" delay={0.15}>
        <InputField label="Target Power" value={targetPower} onChange={setTP} unit="MW" required min={0} max={4000} />
        <div style={{ fontSize: '10px', color: C.muted, marginBottom: 16 }}>Current: 99.6% of target</div>
        <InputField label="Coolant Temp" value={coolantTemp} onChange={setCT} unit="\u00B0C" required min={250} max={320} />
        <RedButton>Apply Settings</RedButton>
        <RedButton outline style={{ marginTop: 8 }}>Reset to Default</RedButton>
        <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          {['Steam Generator', 'Turbine', 'Condenser'].map(c => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}>
              <span style={{ color: C.dim }}>{c}</span><span style={{ color: C.green, fontWeight: 600, fontFamily: 'monospace', fontSize: '11px' }}>OPTIMAL</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>);
}

function MaterialsPage() {
  const [sel, setSel] = useState('Zircaloy-4');
  const mats = { 'Zircaloy-4': 8.2, 'SS-316': 12.7, 'Inconel 625': 5.1, 'Graphite': 15.3, 'Beryllium': 3.8, 'Hafnium': 9.4 };
  return (<div>
    <PageHeader red="Material Performance" white="Predictions" sub="Degradation curves and predictive analysis" />
    <div style={{ background: C.orangeDim, border: `1px solid ${C.orange}25`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.4s' }}>
      <span style={{ fontSize: '16px' }}>{'\u26A0'}</span>
      <div><div style={{ fontSize: '12px', fontWeight: 600, color: C.orange }}>Material Warnings Active</div><div style={{ fontSize: '11px', color: C.dim }}>2 materials elevated. Inspection recommended within 30 days.</div></div>
    </div>
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <StatCard label="Avg. Degradation" value="12.3%" accent={C.red} delay={0.05}/> <StatCard label="Tracked" value="6" sub="4 optimal, 2 warning" accent={C.green} delay={0.1}/>
      <StatCard label="Next Inspection" value="28" sub="days" delay={0.15}/> <StatCard label="Replacement Due" value="142" sub="days" delay={0.2}/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Current Degradation Levels" delay={0.1}>
          <BarChart data={Object.values(mats)} labels={Object.keys(mats).map(n => n.length > 9 ? n.slice(0,9)+'.' : n)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            {Object.entries(mats).map(([n, d]) => (<div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '3px 0' }}><span style={{ color: C.dim }}>{n}</span><span style={{ fontFamily: 'monospace', color: d > 12 ? C.orange : C.green, fontWeight: 600 }}>{d}%</span></div>))}
          </div>
        </Card>
        <Card title="12-Month Trends" delay={0.2}><LineChart data={Array.from({length:12}, (_,i) => 2+i*0.5+Math.sin(i)*0.5)} color={C.red} showArea /></Card>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Inspection Settings" delay={0.15}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '11px', color: C.dim, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material Selection</label>
            <select value={sel} onChange={e => setSel(e.target.value)} className="input-focus" style={{ width: '100%', background: C.bgInput, border: `1.5px solid ${C.borderLight}`, borderRadius: 8, padding: '11px 14px', color: C.text, fontSize: '13px', outline: 'none', appearance: 'none' }}>
              {Object.keys(mats).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}><div style={{ fontSize: '10px', color: C.muted, marginBottom: 4 }}>AI Prediction</div><div style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 700, color: mats[sel] > 12 ? C.orange : C.red }}>{mats[sel]}%</div><div style={{ fontSize: '10px', color: C.muted }}>Current degradation</div></div>
          <RedButton>Generate Report</RedButton>
        </Card>
        <Card title="AI Recommendations" delay={0.25}>
          {['Monitor SS-316 \u2014 trending above threshold', 'Schedule Graphite inspection within 30 days', 'Beryllium exceeding expectations'].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: '11px', color: C.dim, animation: `slideIn 0.3s ease-out ${i*0.08}s both` }}><span style={{ color: C.red, flexShrink: 0 }}>{'\u2192'}</span> {r}</div>
          ))}
        </Card>
      </div>
    </div>
  </div>);
}

function OperationsPage() {
  const [filter, setFilter] = useState('All');
  const [hoveredTask, setHoveredTask] = useState(null);
  const tasks = [
    { name: 'Primary Coolant System Inspection', date: '2026-03-05', hrs: 8, pri: 'HIGH', st: 'upcoming', c: C.yellow, team: 'Team Alpha' },
    { name: 'Turbine Blade Calibration', date: '2026-03-08', hrs: 4, pri: 'MEDIUM', st: 'upcoming', c: C.cyan, team: 'Team Beta' },
    { name: 'Control Rod Drive Mechanism Test', date: '2026-03-12', hrs: 6, pri: 'HIGH', st: 'upcoming', c: C.yellow, team: 'Team Alpha' },
    { name: 'Emergency Cooling System Drill', date: '2026-03-15', hrs: 3, pri: 'CRITICAL', st: 'scheduled', c: C.red, team: 'All Teams' },
    { name: 'Radiation Monitor Calibration', date: '2026-03-18', hrs: 5, pri: 'HIGH', st: 'scheduled', c: C.yellow, team: 'Team Gamma' },
    { name: 'Steam Generator Tube Inspection', date: '2026-03-22', hrs: 12, pri: 'MEDIUM', st: 'scheduled', c: C.cyan, team: 'Team Beta' },
  ];
  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.pri === filter.toUpperCase());
  return (<div>
    <PageHeader red="Operational" white="Monitoring" sub="Maintenance scheduling and timeline management" />
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <StatCard label="Next Maintenance" value="4" sub="days" delay={0.05}/> <StatCard label="Scheduled" value="6" sub="Next 30 days" delay={0.1}/>
      <StatCard label="Completed" value="3" sub="100% on time" accent={C.green} delay={0.15}/> <StatCard label="Avg Duration" value="6.3" sub="hrs/task" delay={0.2}/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <Card title="Maintenance Timeline" delay={0.1} actions={<div style={{ display: 'flex', gap: 6 }}>{['All','Critical','High','Medium'].map(f => <Pill key={f} active={filter===f} onClick={() => setFilter(f)}>{f}</Pill>)}</div>}>
        {filtered.map((t, i) => (
          <div key={i} onMouseEnter={() => setHoveredTask(i)} onMouseLeave={() => setHoveredTask(null)}
            style={{ background: hoveredTask === i ? C.bgCardHover : C.bg, border: `1px solid ${hoveredTask === i ? t.c + '30' : C.border}`,
            borderRadius: 10, padding: '14px 16px', marginBottom: 8, borderLeft: `3px solid ${t.c}`,
            animation: `slideIn 0.3s ease-out ${i*0.05}s both`, transition: 'all 0.25s', cursor: 'pointer',
            transform: hoveredTask === i ? 'translateX(4px)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: '13px', fontWeight: 500 }}>{t.name}</div><div style={{ fontSize: '10px', color: C.muted, marginTop: 2 }}>{t.date} \u00B7 {t.hrs}h \u00B7 {t.team}</div></div>
              <div style={{ textAlign: 'right' }}><span style={{ background: t.c + '18', color: t.c, fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{t.pri}</span><div style={{ fontSize: '9px', color: C.muted, marginTop: 4 }}>{t.st}</div></div>
            </div>
            {hoveredTask === i && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontSize: '10px', color: C.dim, animation: 'fadeIn 0.2s' }}>
              <ProgressBar value={t.st === 'upcoming' ? 30 : 0} color={t.c} label="Preparation Progress" />
            </div>}
          </div>
        ))}
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Quick Actions" delay={0.15}><RedButton>Schedule New Task</RedButton><RedButton outline style={{ marginTop: 8 }}>Export Timeline</RedButton><RedButton outline style={{ marginTop: 8 }}>Download Report</RedButton></Card>
        <Card title="Statistics" delay={0.25}><ProgressBar value={98.5} color={C.green} label="On-Time Rate" /><ProgressBar value={94.2} color={C.yellow} label="Task Completion" /><ProgressBar value={87.1} color={C.orange} label="Resource Utilization" /></Card>
        <Card title="Recent Activity" delay={0.3}>
          {['Reactor Vessel Inspection \u2013 Complete', 'Feedwater System Maintenance \u2013 Complete', 'Backup Generator Test \u2013 Complete'].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: '11px', color: C.dim, animation: `slideIn 0.2s ease-out ${i*0.05}s both` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }}/>{a}
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>);
}

function SafetyPage() {
  const alerts = [
    { title: 'Radiation Level Spike \u2014 Sector 3', desc: 'Temporary spike. Returned to normal.', type: 'REGULATORY', st: 'RESOLVED', date: '2026-03-01 14:32', c: C.red },
    { title: 'Coolant Temperature Variance', desc: 'Exceeded nominal by 2.3\u00B0C for 4 min.', type: 'MONITORING', st: 'MONITORING', date: '2026-03-01 10:15', c: C.orange },
    { title: 'Backup System Test Required', desc: 'Quarterly test due within 7 days.', type: 'REGULATORY', st: 'PENDING', date: '2026-03-01 08:00', c: C.cyan },
    { title: 'Containment Pressure Fluctuation', desc: 'Minor fluctuation. Within limits.', type: 'MONITORING', st: 'RESOLVED', date: '2026-02-28 22:48', c: C.orange },
  ];
  const comp = [ { std: 'NRC Regulation 10 CFR 50', rev: '2026-02-15', st: 'COMPLIANT' }, { std: 'ASME Boiler Code', rev: '2026-02-20', st: 'COMPLIANT' }, { std: 'EPA Environmental Standards', rev: '2026-02-10', st: 'PENDING' }, { std: 'DOE Safety Requirements', rev: '2026-02-25', st: 'COMPLIANT' }, { std: 'IAEA Safety Standards', rev: '2026-02-18', st: 'COMPLIANT' } ];
  return (<div>
    <PageHeader red="Safety & Compliance" white="Flagging" sub="Alert monitoring and regulatory compliance" />
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <StatCard label="Critical" value="1" sub="Resolved" accent={C.red} delay={0.05}/> <StatCard label="Warnings" value="2" sub="Active" accent={C.yellow} delay={0.1}/>
      <StatCard label="Info" value="1" sub="Pending" accent={C.cyan} delay={0.15}/> <StatCard label="Compliance" value="4/5" sub="Standards met" accent={C.green} delay={0.2}/>
      <StatCard label="Safety Score" value="97.8" sub="+0.3 pts" accent={C.red} delay={0.25}/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <Card title="Safety Alerts" delay={0.1}>
        {alerts.map((a, i) => (
          <div key={i} style={{ background: a.c + '08', border: `1px solid ${a.c}20`, borderRadius: 10, padding: '14px 16px', marginBottom: 8, animation: `fadeUp 0.3s ease-out ${i*0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><div style={{ fontSize: '13px', fontWeight: 600 }}>{a.title}</div><span style={{ fontSize: '9px', fontWeight: 700, color: a.st === 'RESOLVED' ? C.green : a.st === 'MONITORING' ? C.yellow : C.cyan }}>{a.st}</span></div>
            <div style={{ fontSize: '11px', color: C.dim, marginBottom: 6 }}>{a.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '9px', color: C.muted, fontFamily: 'monospace' }}>{a.date}</span><span style={{ fontSize: '8px', background: a.type === 'REGULATORY' ? C.redDim : 'transparent', color: a.type === 'REGULATORY' ? C.red : C.muted, padding: '2px 6px', borderRadius: 3, fontWeight: 600 }}>{a.type}</span></div>
          </div>
        ))}
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Regulatory Compliance" delay={0.15}>
          {comp.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < comp.length-1 ? `1px solid ${C.border}` : 'none' }}>
              <div><div style={{ fontSize: '11px', fontWeight: 500 }}>{c.std}</div><div style={{ fontSize: '9px', color: C.muted }}>Last: {c.rev}</div></div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: c.st === 'COMPLIANT' ? C.green : C.yellow }}>{c.st}</span>
            </div>
          ))}
          <RedButton style={{ marginTop: 12 }}>Generate Report</RedButton>
        </Card>
        <Card title="Safety Metrics" delay={0.25}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}><span style={{ color: C.dim }}>Incident-Free Days</span><span style={{ fontFamily: 'monospace', fontWeight: 700, color: C.green }}>287</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 12px', fontSize: '12px' }}><span style={{ color: C.dim }}>Response Time</span><span style={{ fontFamily: 'monospace', fontWeight: 700 }}>3.2s</span></div>
          <ProgressBar value={98.1} color={C.green} label="Resolution Rate" /> <ProgressBar value={97.8} color={C.red} label="Audit Score" />
        </Card>
      </div>
    </div>
  </div>);
}

function EnergyPage() {
  const [model, setModel] = useState('ai');
  const yd = useMemo(() => Array.from({length:12}, (_,i) => 2800+Math.sin(i/2)*300+Math.random()*100), []);
  const my = useMemo(() => Array.from({length:24}, (_,i) => 2600+Math.sin(i/4)*400+Math.random()*150), []);
  return (<div>
    <PageHeader red="Energy Yield" white="Projections" sub="Mat yield projections and forecast curves" />
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <StatCard label="Projected Growth" value="+8.2%" sub="Next 12 months" accent={C.green} delay={0.05}/> <StatCard label="Annual Estimate" value="37,842" sub="GWh" delay={0.1}/>
      <StatCard label="Revenue Forecast" value="$98.4M" sub="Annual" accent={C.green} delay={0.15}/> <StatCard label="AI Confidence" value="94.7%" sub="Model accuracy" accent={C.red} delay={0.2}/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="12-Month Yield Projections" delay={0.1}><LineChart data={yd} color={C.red} showArea /></Card>
        <Card title="EGM Mat Yield (24 Weeks)" delay={0.2}><LineChart data={my} color={C.red} /></Card>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Projection Model" delay={0.15}>
          {[{id:'ai',l:'AI Optimized',d:'Machine learning based'},{id:'linear',l:'Linear Regression',d:'Traditional analysis'},{id:'hybrid',l:'Hybrid Model',d:'AI + historical'}].map(m => (
            <div key={m.id} onClick={() => setModel(m.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${model===m.id ? C.red : C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>{model===m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red }}/>}</div>
              <div><div style={{ fontSize: '12px', fontWeight: 500 }}>{m.l}</div><div style={{ fontSize: '9px', color: C.muted }}>{m.d}</div></div>
            </div>
          ))}
          <RedButton style={{ marginTop: 10 }}>Recalculate Projection</RedButton>
        </Card>
        <Card title="Key Factors" delay={0.25}>
          {[['Fuel Efficiency','+2.4%',C.green],['Uptime Rate','+1.1%',C.green],['Demand Growth','+3.0%',C.green],['Market Price','-0.2%',C.red]].map(([l,v,c], i) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', fontSize: '12px' }}>
              <span style={{ color: C.dim }}>{l}</span><span style={{ fontFamily: 'monospace', fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>);
}
// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('llyana_session');
      if (s) {
        const p = JSON.parse(s);
        fetch(`${SB_URL}/auth/v1/user`, { headers: { 'Authorization': `Bearer ${p.token}`, 'apikey': SB_KEY } })
          .then(r => { if (r.ok) setUser(p); else sessionStorage.removeItem('llyana_session'); setLoading(false); })
          .catch(() => { sessionStorage.removeItem('llyana_session'); setLoading(false); });
        return;
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  useEffect(() => { try { sessionStorage.setItem('llyana_page', page); } catch(e) {} }, [page]);
  useEffect(() => { try { const p = sessionStorage.getItem('llyana_page'); if (p) setPage(p); } catch(e) {} }, []);

  const logout = () => { sessionStorage.removeItem('llyana_session'); sessionStorage.removeItem('llyana_page'); setUser(null); setPage('overview'); };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <InjectStyles />
      <div style={{ textAlign: 'center' }}>
        <div style={{ animation: 'glow 2s ease-in-out infinite' }}><LlyanaLogo size={64} /></div>
        <div style={{ color: C.muted, fontSize: '11px', marginTop: 16, letterSpacing: '2px' }}>INITIALIZING...</div>
      </div>
    </div>
  );

  if (!user) return <><InjectStyles /><LoginPage onLogin={setUser} /></>;

  const pages = { overview: <OverviewPage onNav={setPage}/>, reactor: <ReactorPage/>, thermal: <ThermalPage/>,
    materials: <MaterialsPage/>, operations: <OperationsPage/>, safety: <SafetyPage/>, energy: <EnergyPage/> };

  return <Layout page={page} onNav={setPage} user={user} onLogout={logout}>{pages[page] || pages.overview}</Layout>;
}
