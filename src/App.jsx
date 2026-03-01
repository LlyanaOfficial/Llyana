import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// LLYANA — Nuclear Engineering AI Dashboard
// Avolv Energy Technologies | Built by Leon Maunge — Futurify Design
// Dark theme, red accents, Tesla-inspired control room UI
// ═══════════════════════════════════════════════════════════════

// ── Supabase Config (obfuscated) ────────────────────────────
const _p = [112,100,102,101,116,105,111,116,105,115,119,117,98,100,116,122,116,119,108,106];
const _ref = String.fromCharCode(..._p);
const _k = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZmV0aW90aXN3dWJkdHp0d2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjA1OTEsImV4cCI6MjA4NzkzNjU5MX0',
  'jEqYMxsquxtUUB60BvMxBj9Mqi3E4-YAibIY_0w9ImE'
];
const SB_URL = `https://${_ref}.supabase.co`;
const SB_KEY = _k.join('.');

// ── Alert System (Milton's 5-level spec) ────────────────────
const ALERTS = {
  SAFE:     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  label: 'SAFE' },
  MONITOR:  { color: '#eab308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.3)',  label: 'MONITOR' },
  WARNING:  { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', label: 'WARNING' },
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  label: 'CRITICAL' },
  UNKNOWN:  { color: '#6b7280', bg: 'rgba(107,114,128,0.1)',border: 'rgba(107,114,128,0.3)',label: 'UNKNOWN' },
};

function getAlertLevel(value, min, max) {
  if (value == null || isNaN(value)) return 'UNKNOWN';
  const range = max - min;
  const center = min + range / 2;
  const dist = Math.abs(value - center) / (range / 2);
  if (dist < 0.8) return 'SAFE';
  if (dist < 0.9) return 'MONITOR';
  if (dist < 1.0) return 'WARNING';
  return 'CRITICAL';
}

// ── Shared Styles ───────────────────────────────────────────
const colors = {
  bg: '#0A0A0A',
  bgCard: '#141414',
  bgCardHover: '#1A1A1A',
  bgSidebar: '#0E0E0E',
  bgInput: '#1A1A1A',
  border: '#1E1E1E',
  borderLight: '#2A2A2A',
  red: '#E63946',
  redGlow: 'rgba(230,57,70,0.3)',
  redDim: 'rgba(230,57,70,0.1)',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  cyan: '#06b6d4',
  text: '#E8E8E8',
  textDim: '#888888',
  textMuted: '#555555',
};

// ── SVG Icons ───────────────────────────────────────────────
const Icons = {
  logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke={colors.red} strokeWidth="2" fill="rgba(230,57,70,0.1)"/>
      <path d="M10 20 L14 12 L16 16 L18 8 L22 20" stroke={colors.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  overview: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  reactor: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>,
  thermal: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  materials: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  operations: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  safety: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  energy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  user: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  warning: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  critical: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

// ── Gauge Component (Reactor Core radial gauges) ────────────
function Gauge({ value, label, color, size = 120 }) {
  const angle = (value / 100) * 270 - 135;
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2;
  const startAngle = -135 * (Math.PI / 180);
  const endAngle = angle * (Math.PI / 180);
  const bgEnd = 135 * (Math.PI / 180);

  function arcPath(startA, endA) {
    const x1 = cx + r * Math.cos(startA), y1 = cy + r * Math.sin(startA);
    const x2 = cx + r * Math.cos(endA), y2 = cy + r * Math.sin(endA);
    const large = endA - startA > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const gaugeColor = value > 95 ? colors.green : value > 85 ? colors.yellow : value > 70 ? colors.orange : colors.red;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`}>
        <path d={arcPath(startAngle, bgEnd)} fill="none" stroke="#2A2A2A" strokeWidth="8" strokeLinecap="round"/>
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke={gaugeColor} strokeWidth="8" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${gaugeColor}40)` }}/>
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '22px', fontWeight: 700, color: gaugeColor, marginTop: -8 }}>
        {value}%
      </div>
      <div style={{ fontSize: '12px', color: colors.textDim, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{
      background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '16px 20px',
      flex: 1, minWidth: 180, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '12px', color: colors.textDim, marginBottom: 8 }}>{label}</div>
        {icon && <div style={{ color: colors.textMuted, opacity: 0.5 }}>{icon}</div>}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '28px', fontWeight: 700,
        color: accent || colors.text, letterSpacing: '-0.5px',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: accent || colors.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Card Container ──────────────────────────────────────────
function Card({ children, style, title, actions }) {
  return (
    <div style={{
      background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10,
      padding: '20px 24px', ...style,
    }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {title && <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{title}</div>}
          {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Red Button ──────────────────────────────────────────────
function RedButton({ children, onClick, outline, style: s, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? 'transparent' : colors.red,
      color: outline ? colors.red : '#fff',
      border: outline ? `1px solid ${colors.red}` : 'none',
      borderRadius: 6, padding: '10px 20px', fontSize: '13px', fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', width: '100%', opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s', letterSpacing: '0.3px', ...s,
    }}>
      {children}
    </button>
  );
}

// ── Filter Pill ─────────────────────────────────────────────
function Pill({ active, children, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || colors.cyan) : 'transparent',
      color: active ? '#fff' : colors.textDim,
      border: `1px solid ${active ? (color || colors.cyan) : colors.borderLight}`,
      borderRadius: 4, padding: '4px 12px', fontSize: '11px', fontWeight: 500,
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {children}
    </button>
  );
}

// ── Progress Bar ────────────────────────────────────────────
function ProgressBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '12px', color: colors.textDim }}>{label}</span>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: color || colors.red, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: '#1E1E1E', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${value}%`, background: color || colors.red, borderRadius: 2, transition: 'width 0.5s' }}/>
      </div>
    </div>
  );
}

// ── Simple Line Chart (SVG) ─────────────────────────────────
function LineChart({ data, width = 800, height = 200, color = colors.red, showArea, label }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${(data.length - 1) * step},${height}`;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }} preserveAspectRatio="none">
        {showArea && <polygon points={areaPoints} fill={`${color}15`}/>}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
        {data.map((v, i) => (
          <circle key={i} cx={i * step} cy={height - ((v - min) / range) * height} r="3" fill={color} opacity={i % 3 === 0 ? 1 : 0}/>
        ))}
      </svg>
      {label && <div style={{ textAlign: 'center', fontSize: '11px', color: colors.textDim, marginTop: 6 }}>{label}</div>}
    </div>
  );
}

// ── Bar Chart (SVG) ─────────────────────────────────────────
function BarChart({ data, labels, width = 700, height = 200, color = colors.red }) {
  const max = Math.max(...data) * 1.2 || 1;
  const barWidth = width / data.length * 0.6;
  const gap = width / data.length * 0.4;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height + 30}`} style={{ width: '100%', height: 'auto' }}>
        {data.map((v, i) => {
          const bh = (v / max) * height;
          const x = i * (barWidth + gap) + gap / 2;
          return (
            <g key={i}>
              <rect x={x} y={height - bh} width={barWidth} height={bh} fill={color} rx="3" opacity="0.85"/>
              {labels && labels[i] && (
                <text x={x + barWidth / 2} y={height + 16} textAnchor="middle" fill={colors.textMuted} fontSize="9">{labels[i]}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Input Field ─────────────────────────────────────────────
function InputField({ label, value, onChange, unit, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`,
          borderRadius: 6, padding: '10px 14px', color: colors.text, fontSize: '14px',
          fontFamily: "'JetBrains Mono', monospace", outline: 'none', boxSizing: 'border-box',
        }}
      />
      {hint && <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Login
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.access_token) {
        const userData = { ...data.user, token: data.access_token, refresh_token: data.refresh_token };
        try { sessionStorage.setItem('llyana_session', JSON.stringify(userData)); } catch(e) {}
        onLogin(userData);
      } else {
        setError(data.error_description || 'Invalid credentials');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `
        radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.04) 0%, transparent 60%),
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.01) 40px, rgba(255,255,255,0.01) 41px)
      `,
    }}>
      <div style={{
        background: '#111111', border: `1px solid ${colors.border}`, borderRadius: 12,
        padding: '48px 40px', width: 380, maxWidth: '90vw', textAlign: 'center',
        boxShadow: '0 0 80px rgba(230,57,70,0.05)',
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: colors.redDim,
            border: `2px solid ${colors.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: `0 0 30px ${colors.redGlow}`,
          }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M10 20 L14 12 L16 16 L18 8 L22 20" stroke={colors.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ color: colors.red, fontSize: '28px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '2px' }}>Llyana</h1>
          <p style={{ color: colors.textDim, fontSize: '13px', margin: 0 }}>Nuclear Engineering AI Dashboard</p>
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: '8px 0 0', fontFamily: 'monospace', letterSpacing: '1px' }}>
            v2.4.1 | CLASSIFICATION: RESTRICTED
          </p>
        </div>

        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6, fontWeight: 500 }}>Username</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter username"
            style={{
              width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`,
              borderRadius: 6, padding: '12px 14px', color: colors.text, fontSize: '14px',
              marginBottom: 16, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`,
              borderRadius: 6, padding: '12px 14px', color: colors.text, fontSize: '14px',
              marginBottom: 24, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {error && <div style={{ color: colors.red, fontSize: '12px', marginBottom: 12 }}>{error}</div>}

        <RedButton onClick={handleLogin} disabled={loading}>
          {loading ? 'Authenticating...' : 'Access System'}
        </RedButton>

        <div style={{ marginTop: 24 }}>
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: 0 }}>Authorized Personnel Only</p>
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: '2px 0 0' }}>All activity is monitored and logged</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: Sidebar + Top Bar
// ═══════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',        icon: Icons.overview },
  { id: 'reactor',    label: 'Reactor Core',    icon: Icons.reactor },
  { id: 'thermal',    label: 'Thermal & Power', icon: Icons.thermal },
  { id: 'materials',  label: 'Materials',       icon: Icons.materials },
  { id: 'operations', label: 'Operations',      icon: Icons.operations },
  { id: 'safety',     label: 'Safety',          icon: Icons.safety },
  { id: 'energy',     label: 'Energy Yield',    icon: Icons.energy },
];

function DashboardLayout({ currentPage, onNavigate, children, user, onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, color: colors.text }}>
      {/* Sidebar */}
      <aside style={{
        width: 180, background: colors.bgSidebar, borderRight: `1px solid ${colors.border}`,
        display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10,
      }}>
        <div style={{ padding: '0 16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icons.logo />
          <div>
            <div style={{ color: colors.red, fontSize: '16px', fontWeight: 700, letterSpacing: '1px' }}>Llyana</div>
            <div style={{ color: colors.textMuted, fontSize: '10px' }}>Nuclear AI</div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = currentPage === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 16px', background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
                border: 'none', borderLeft: active ? `3px solid ${colors.red}` : '3px solid transparent',
                color: active ? colors.red : colors.textDim, cursor: 'pointer',
                fontSize: '13px', fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                textAlign: 'left',
              }}>
                <item.icon />
                {item.label}
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.red, marginLeft: 'auto' }}/>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '10px', color: colors.textMuted }}>System Status</div>
          <div style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>Core: <span style={{ color: colors.green }}>NOMINAL</span></div>
          <div style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>AI: <span style={{ color: colors.green }}>ONLINE</span></div>
          <div style={{ fontSize: '10px', color: colors.green, fontFamily: 'monospace' }}>All Systems GO</div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 180 }}>
        {/* Top bar */}
        <header style={{
          height: 48, borderBottom: `1px solid ${colors.border}`, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          background: colors.bgSidebar, position: 'sticky', top: 0, zIndex: 5,
        }}>
          <input
            placeholder="Search modules, parameters..."
            style={{
              background: colors.bgInput, border: `1px solid ${colors.border}`, borderRadius: 6,
              padding: '6px 14px', color: colors.textDim, fontSize: '12px', width: 280, outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: colors.textDim }}>
              {time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '3px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.green }}/>
              <span style={{ fontSize: '11px', color: colors.green, fontWeight: 600 }}>OPERATIONAL</span>
            </div>
            <Icons.bell />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}>
              <Icons.user />
              <span style={{ fontSize: '11px', color: colors.textDim }}>{user?.email ? user.email.split('@')[0] : 'Admin'}</span>
              {onLogout && (
                <button onClick={onLogout} title="Sign out" style={{
                  background: 'transparent', border: `1px solid ${colors.borderLight}`, borderRadius: 4,
                  color: colors.textMuted, fontSize: '10px', padding: '2px 8px', cursor: 'pointer', marginLeft: 4,
                }}>Logout</button>
              )}
            </div>
          </div>
        </header>

        <main style={{ padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Dashboard Overview
// ═══════════════════════════════════════════════════════════════
function OverviewPage({ onNavigate }) {
  const modules = [
    { id: 'reactor', title: 'Reactor Core Analysis', desc: 'Real-time core optimization and radial gauge visualization', icon: Icons.reactor, metric: '98.4%', metricLabel: 'Core Efficiency', status: 'OPTIMAL', statusColor: colors.green },
    { id: 'thermal', title: 'Thermal & Power', desc: 'Power calculations and thermal performance tracking', icon: Icons.thermal, metric: '3,200 MW', metricLabel: 'Output Power', status: 'OPTIMAL', statusColor: colors.green },
    { id: 'materials', title: 'Material Performance', desc: 'Material degradation curves and predictive analysis', icon: Icons.materials, metric: '12.3%', metricLabel: 'Avg. Degradation', status: 'WARNING', statusColor: colors.orange, badge: 2 },
    { id: 'operations', title: 'Operational Monitoring', desc: 'Maintenance scheduling and timeline management', icon: Icons.operations, metric: '4 Days', metricLabel: 'Next Maintenance', status: 'OPTIMAL', statusColor: colors.green },
    { id: 'safety', title: 'Safety & Compliance', desc: 'Safety flagging and regulatory compliance tracking', icon: Icons.safety, metric: '1 Pending', metricLabel: 'Regulatory Items', status: 'INFO', statusColor: colors.cyan, badge: 1 },
    { id: 'energy', title: 'Energy Yield Projections', desc: 'Mat yield projections and forecast curves', icon: Icons.energy, metric: '+8.2%', metricLabel: 'Projected Increase', status: 'OPTIMAL', statusColor: colors.green },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          Dashboard <span style={{ color: colors.red }}>Overview</span>
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>
          Nuclear Engineering AI System — Real-time monitoring and analysis
        </p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Total Modules" value="6" sub="All Online" accent={colors.green} />
        <StatCard label="Active Alerts" value="3" sub="2 Warnings, 1 Info" />
        <StatCard label="System Uptime" value="99.8%" sub="142 days" accent={colors.green} />
        <StatCard label="AI Confidence" value="96.7%" sub="High Accuracy" accent={colors.red} />
      </div>

      {/* Module grid */}
      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: 16 }}>System Modules</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {modules.map(mod => (
          <div key={mod.id} onClick={() => onNavigate(mod.id)} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10,
            padding: '20px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.borderLight; e.currentTarget.style.background = colors.bgCardHover; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = colors.bgCard; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ color: colors.textDim }}><mod.icon /></div>
              {mod.badge && (
                <div style={{
                  background: mod.statusColor, color: '#fff', borderRadius: '50%',
                  width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                }}>
                  {mod.badge}
                </div>
              )}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: 4 }}>{mod.title}</div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: 16 }}>{mod.desc}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 700, marginBottom: 2 }}>
              {mod.metric}
            </div>
            <div style={{ fontSize: '11px', color: colors.textDim, marginBottom: 12 }}>{mod.metricLabel}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {mod.status === 'OPTIMAL' && <Icons.check />}
                {mod.status === 'WARNING' && <Icons.warning />}
                {mod.status === 'INFO' && <Icons.info />}
                <span style={{ fontSize: '12px', fontWeight: 600, color: mod.statusColor }}>{mod.status}</span>
              </div>
              <div style={{ color: colors.textMuted }}><Icons.arrow /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Reactor Core Analysis (Module 1)
// ═══════════════════════════════════════════════════════════════
function ReactorCorePage() {
  const [coreTemp, setCoreTemp] = useState('550');
  const [pressure, setPressure] = useState('155');
  const [flowRate, setFlowRate] = useState('4200');
  const [results, setResults] = useState(null);

  const runAnalysis = () => {
    const t = parseFloat(coreTemp), p = parseFloat(pressure), f = parseFloat(flowRate);
    const tempPct = Math.min(99, Math.max(50, 85 + (t / 600) * 15 - Math.abs(t - 550) * 0.02));
    const pressPct = Math.min(99, Math.max(50, 80 + (p / 180) * 20 - Math.abs(p - 155) * 0.1));
    const flowPct = Math.min(99, Math.max(50, 90 + (f / 5000) * 10 - Math.abs(f - 4200) * 0.005));
    const efficiency = (tempPct + pressPct + flowPct) / 3;

    const tempAlert = getAlertLevel(t, 280, 600);
    const recs = [];
    if (tempAlert === 'WARNING' || tempAlert === 'CRITICAL') recs.push({ title: 'Temperature Variation', desc: `Core temp at ${t}°C — approaching limits. Recommend monitoring.`, severity: 'warning' });
    if (tempAlert === 'SAFE' && getAlertLevel(p, 100, 180) === 'SAFE') recs.push({ title: 'Optimal Performance', desc: 'Core efficiency is within optimal range. No action required.', severity: 'safe' });
    recs.push({ title: 'AI Recommendation', desc: `Consider adjusting flow rate to ${Math.round(f * 1.035)} L/s for improved efficiency.`, severity: 'info' });

    setResults({
      efficiency: Math.round(efficiency * 10) / 10,
      tempPct: Math.round(tempPct * 10) / 10,
      pressPct: Math.round(pressPct * 10) / 10,
      recommendations: recs,
    });
  };

  useEffect(() => { runAnalysis(); }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
            <span style={{ color: colors.red }}>Reactor Core</span> Analysis
          </h1>
          <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Real-time optimization and radial gauge visualization</p>
        </div>
        <RedButton style={{ width: 'auto', padding: '8px 20px' }} outline>⚙ Configure</RedButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left: Performance Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="⚛ Core Performance Metrics">
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 0 24px' }}>
              <Gauge value={results?.efficiency || 98.4} label="Efficiency" />
              <Gauge value={results?.tempPct || 92.7} label="Temperature" />
              <Gauge value={results?.pressPct || 96.2} label="Pressure" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
              <div>
                <div style={{ fontSize: '11px', color: colors.textDim }}>Neutron Flux</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 600 }}>2.4×10¹³</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: colors.textDim }}>Control Rod Position</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 600 }}>68%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: colors.textDim }}>Xenon Level</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 600 }}>1.2 ppm</div>
              </div>
            </div>
          </Card>

          <Card title="📈 AI Insights & Recommendations">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(results?.recommendations || []).map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2 }}>
                    {rec.severity === 'safe' && <Icons.check />}
                    {rec.severity === 'warning' && <Icons.warning />}
                    {rec.severity === 'info' && <Icons.info />}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 2 }}>{rec.title}</div>
                    <div style={{ fontSize: '12px', color: colors.textDim }}>{rec.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Manual Parameters */}
        <Card title="Manual Parameters">
          <InputField label="Core Temperature (°C)" value={coreTemp} onChange={setCoreTemp} hint="Range: 450-600°C" />
          <InputField label="Pressure (bar)" value={pressure} onChange={setPressure} hint="Range: 100-180 bar" />
          <InputField label="Flow Rate (L/s)" value={flowRate} onChange={setFlowRate} hint="Range: 3500-5000 L/s" />
          <RedButton onClick={runAnalysis}>Run Optimization</RedButton>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Thermal & Power (Module 2)
// ═══════════════════════════════════════════════════════════════
function ThermalPowerPage() {
  const [targetPower, setTargetPower] = useState('3200');
  const [coolantTemp, setCoolantTemp] = useState('290');
  const powerData = [3020, 3050, 3100, 3150, 3180, 3200, 3190, 3210, 3195, 3200, 3180, 3190, 3200, 3195, 3200, 3187, 3190, 3195, 3200, 3187];
  const perfPower = Array.from({length: 24}, (_, i) => 3100 + Math.sin(i/3) * 150 + Math.random() * 50);
  const perfThermal = perfPower.map(v => v * 0.85 + Math.random() * 30);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.red }}>Thermal & Power</span> Calculations
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Real-time power output meters and thermal performance tracking</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Current Output" value="3187" sub="MW" />
        <StatCard label="Efficiency" value="92.4%" sub="+2.1% from avg" accent={colors.green} />
        <StatCard label="Thermal Load" value="2,943" sub="MWh" />
        <StatCard label="Heat Rate" value="10,874" sub="BTU/kWh" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Real-time Power Output">
            <LineChart data={powerData} color={colors.red} label="Last 20 minutes · Update interval: 1 min" />
          </Card>
          <Card title="24-Hour Performance Overview">
            <LineChart data={perfPower} color={colors.red} showArea />
            <LineChart data={perfThermal} color={colors.yellow} showArea label="→ Power (MW) → Thermal (MWh)" />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Power Control">
            <InputField label="Target Power (MW)" value={targetPower} onChange={setTargetPower} />
            <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: 16 }}>Current: 99.6% of target</div>
            <InputField label="Coolant Temp (°C)" value={coolantTemp} onChange={setCoolantTemp} />
            <RedButton>Apply Settings</RedButton>
            <RedButton outline style={{ marginTop: 8 }}>Reset to Default</RedButton>
            <div style={{ marginTop: 16, borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
              {['Steam Generator', 'Turbine', 'Condenser'].map(c => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}>
                  <span style={{ color: colors.textDim }}>{c}</span>
                  <span style={{ color: colors.green, fontWeight: 600, fontFamily: 'monospace' }}>OPTIMAL</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Material Performance (Module 3)
// ═══════════════════════════════════════════════════════════════
function MaterialsPage() {
  const [selectedMat, setSelectedMat] = useState('Zircaloy-4');
  const materials = {
    'Zircaloy-4':  { deg: 8.2,  status: 'safe' },
    'SS-316':      { deg: 12.7, status: 'monitor' },
    'Inconel 625': { deg: 5.1,  status: 'safe' },
    'Graphite':    { deg: 15.3, status: 'warning' },
    'Beryllium':   { deg: 3.8,  status: 'safe' },
    'Hafnium':     { deg: 9.4,  status: 'safe' },
  };
  const barData = Object.values(materials).map(m => m.deg);
  const barLabels = Object.keys(materials).map(n => n.length > 8 ? n.slice(0,8) + '.' : n);
  const trendData1 = Array.from({length: 12}, (_, i) => 2 + i * 0.5 + Math.sin(i) * 0.5);
  const trendData2 = Array.from({length: 12}, (_, i) => 3 + i * 0.8 + Math.random() * 0.3);
  const trendData3 = Array.from({length: 12}, (_, i) => 1 + i * 0.3 + Math.random() * 0.4);

  const currentDeg = materials[selectedMat]?.deg || 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.red }}>Material Performance</span> Predictions
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Material degradation curves and predictive analysis</p>
      </div>

      {/* Warning banner */}
      <div style={{
        background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8,
        padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icons.warning />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: colors.orange }}>Material Warnings Active</div>
          <div style={{ fontSize: '12px', color: colors.textDim }}>2 materials showing elevated degradation rates. Recommend inspection within 30 days.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Avg. Degradation" value="12.3%" sub="Across all materials" accent={colors.red} />
        <StatCard label="Materials Tracked" value="6" sub="4 optimal, 2 warning" accent={colors.green} />
        <StatCard label="Next Inspection" value="28" sub="days" />
        <StatCard label="Replacement Due" value="142" sub="days" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="⊘ Current Degradation Levels">
            <BarChart data={barData} labels={barLabels} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16, borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
              {Object.entries(materials).map(([name, m]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0' }}>
                  <span style={{ color: colors.textDim }}>{name}</span>
                  <span style={{ fontFamily: 'monospace', color: m.deg > 12 ? colors.orange : colors.green, fontWeight: 600 }}>
                    {m.deg}% <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: m.deg > 12 ? colors.orange : colors.green, marginLeft: 4 }}/>
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="12-Month Degradation Trends">
            <LineChart data={trendData1} color={colors.red} showArea label="→ Zircaloy-4  → SS-316  → Inconel 625" />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Inspection Settings">
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6 }}>Material Selection</label>
              <select value={selectedMat} onChange={e => setSelectedMat(e.target.value)} style={{
                width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`, borderRadius: 6,
                padding: '10px 14px', color: colors.text, fontSize: '13px', outline: 'none', appearance: 'none',
              }}>
                {Object.keys(materials).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <InputField label="Last Inspection" value="01/03/2026" onChange={() => {}} />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: 4 }}>AI Prediction</div>
              <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color: colors.red }}>{currentDeg}%</div>
              <div style={{ fontSize: '10px', color: colors.textMuted }}>Current degradation level</div>
            </div>
            <RedButton>Generate Report</RedButton>
          </Card>

          <Card title="AI Recommendations">
            {[
              'Monitor SS-316 closely — trending above threshold',
              'Schedule Graphite inspection within 30 days',
              'Beryllium performance exceeding expectations',
            ].map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '12px', color: colors.textDim }}>
                <span style={{ color: colors.red }}>→</span> {rec}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Operational Monitoring (Module 4)
// ═══════════════════════════════════════════════════════════════
function OperationsPage() {
  const [filter, setFilter] = useState('All');
  const tasks = [
    { name: 'Primary Coolant System Inspection', date: '2026-03-05', hours: 8, priority: 'HIGH', status: 'upcoming', color: colors.yellow },
    { name: 'Turbine Blade Calibration', date: '2026-03-08', hours: 4, priority: 'MEDIUM', status: 'upcoming', color: colors.cyan },
    { name: 'Control Rod Drive Mechanism Test', date: '2026-03-12', hours: 6, priority: 'HIGH', status: 'upcoming', color: colors.yellow },
    { name: 'Emergency Cooling System Drill', date: '2026-03-15', hours: 3, priority: 'CRITICAL', status: 'scheduled', color: colors.red },
    { name: 'Radiation Monitor Calibration', date: '2026-03-18', hours: 5, priority: 'HIGH', status: 'scheduled', color: colors.yellow },
    { name: 'Steam Generator Tube Inspection', date: '2026-03-22', hours: 12, priority: 'MEDIUM', status: 'scheduled', color: colors.cyan },
  ];

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.priority === filter.toUpperCase());

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.red }}>Operational</span> Monitoring
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Maintenance scheduling and timeline management</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Next Maintenance" value="4" sub="days" />
        <StatCard label="Scheduled Tasks" value="6" sub="Next 30 days" />
        <StatCard label="Completed (Week)" value="3" sub="100% on time" accent={colors.green} />
        <StatCard label="Avg. Duration" value="6.3" sub="hours/task" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <Card title="🔧 Maintenance Timeline" actions={
          <>{['All', 'Critical', 'High'].map(f => <Pill key={f} active={filter===f} onClick={() => setFilter(f)}>{f}</Pill>)}</>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((task, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 8,
                padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderLeft: `3px solid ${task.color}`,
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{task.name}</div>
                  <div style={{ fontSize: '11px', color: colors.textMuted }}>📅 {task.date} · ⏱ {task.hours} hours</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: task.priority === 'CRITICAL' ? colors.redDim : task.priority === 'HIGH' ? 'rgba(234,179,8,0.15)' : 'rgba(6,182,212,0.15)',
                    color: task.color, fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  }}>
                    {task.priority}
                  </span>
                  <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: 4 }}>{task.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Quick Actions">
            <RedButton>Schedule New Task</RedButton>
            <RedButton outline style={{ marginTop: 8 }}>Export Timeline</RedButton>
            <RedButton outline style={{ marginTop: 8 }}>View Full Calendar</RedButton>
          </Card>

          <Card title="Recent Activity">
            {[
              { name: 'Reactor Vessel Inspection', date: '2026-02-28', team: 'Team A' },
              { name: 'Feedwater System Maintenance', date: '2026-02-26', team: 'Team B' },
              { name: 'Backup Generator Test', date: '2026-02-24', team: 'Team C' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
                <Icons.check />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: '10px', color: colors.textMuted }}>{a.date} · {a.team}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Statistics">
            <ProgressBar value={98.5} color={colors.green} label="On-Time Rate" />
            <ProgressBar value={94.2} color={colors.yellow} label="Task Completion" />
            <ProgressBar value={87.1} color={colors.orange} label="Resource Utilization" />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Safety & Compliance (Module 5)
// ═══════════════════════════════════════════════════════════════
function SafetyPage() {
  const [filter, setFilter] = useState('All');
  const alerts = [
    { title: 'Radiation Level Spike — Sector 3', desc: 'Temporary radiation spike detected in containment sector 3. Levels returned to normal within acceptable timeframe.', type: 'REGULATORY', status: 'RESOLVED', date: '2026-03-01 14:32:18', severity: 'critical', borderColor: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)' },
    { title: 'Coolant Temperature Variance', desc: 'Primary coolant temperature exceeded nominal range by 2.3°C for 4 minutes.', type: 'MONITORING', status: 'MONITORING', date: '2026-03-01 10:15:42', severity: 'warning', borderColor: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.05)' },
    { title: 'Backup System Test Required', desc: 'Quarterly backup emergency cooling system test due within 7 days.', type: 'REGULATORY', status: 'PENDING', date: '2026-03-01 08:00:00', severity: 'info', borderColor: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.05)' },
    { title: 'Containment Pressure Fluctuation', desc: 'Minor pressure fluctuation in secondary containment. Within acceptable limits.', type: 'MONITORING', status: 'RESOLVED', date: '2026-02-28 22:48:11', severity: 'warning', borderColor: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.05)' },
  ];

  const compliance = [
    { standard: 'NRC Regulation 10 CFR 50', review: '2026-02-15', status: 'COMPLIANT' },
    { standard: 'ASME Boiler Code', review: '2026-02-20', status: 'COMPLIANT' },
    { standard: 'EPA Environmental Standards', review: '2026-02-10', status: 'PENDING' },
    { standard: 'DOE Safety Requirements', review: '2026-02-25', status: 'COMPLIANT' },
    { standard: 'IAEA Safety Standards', review: '2026-02-18', status: 'COMPLIANT' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.red }}>Safety & Compliance</span> Flagging
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Safety alert monitoring and regulatory compliance tracking</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Critical" value="1" sub="Resolved" accent={colors.red} />
        <StatCard label="Warnings" value="2" sub="Active" accent={colors.yellow} />
        <StatCard label="Info" value="1" sub="Pending" accent={colors.cyan} />
        <StatCard label="Compliance" value="4/5" sub="Items" accent={colors.green} />
        <StatCard label="Safety Score" value="97.8" sub="+0.3 pts" accent={colors.red} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <Card title="⊘ Safety Alerts" actions={
          <>{['All', 'Critical', 'Warnings'].map(f => <Pill key={f} active={filter===f} onClick={() => setFilter(f)} color={f === 'Critical' ? colors.red : f === 'Warnings' ? colors.yellow : colors.cyan}>{f}</Pill>)}</>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                background: alert.bg, border: `1px solid ${alert.borderColor}`, borderRadius: 8,
                padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {alert.severity === 'critical' && <Icons.critical />}
                  {alert.severity === 'warning' && <Icons.warning />}
                  {alert.severity === 'info' && <Icons.info />}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{alert.title}</div>
                    <div style={{ fontSize: '11px', color: colors.textDim, marginTop: 2 }}>{alert.desc}</div>
                    <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: 6, fontFamily: 'monospace' }}>{alert.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <span style={{
                    background: alert.type === 'REGULATORY' ? 'rgba(230,57,70,0.2)' : 'transparent',
                    color: alert.type === 'REGULATORY' ? colors.red : colors.textMuted,
                    fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                    border: alert.type === 'REGULATORY' ? `1px solid ${colors.red}40` : 'none',
                  }}>
                    {alert.type}
                  </span>
                  <div style={{ fontSize: '10px', color: alert.status === 'RESOLVED' ? colors.green : alert.status === 'MONITORING' ? colors.yellow : colors.cyan, marginTop: 6, fontWeight: 600 }}>
                    {alert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Regulatory Compliance">
            {compliance.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < compliance.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{c.standard}</div>
                  <div style={{ fontSize: '10px', color: colors.textMuted }}>Last review: {c.review}</div>
                  <div style={{ fontSize: '10px', color: c.status === 'COMPLIANT' ? colors.green : colors.yellow, fontWeight: 600 }}>{c.status}</div>
                </div>
                {c.status === 'COMPLIANT' ? <Icons.check /> : <Icons.warning />}
              </div>
            ))}
            <RedButton style={{ marginTop: 12 }}>Generate Compliance Report</RedButton>
          </Card>

          <Card title="Safety Metrics">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}>
              <span style={{ color: colors.textDim }}>Incident-Free Days</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: colors.green }}>287</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}>
              <span style={{ color: colors.textDim }}>Response Time (Avg)</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>3.2s</span>
            </div>
            <ProgressBar value={98.1} color={colors.green} label="Resolution Rate" />
            <ProgressBar value={97.8} color={colors.red} label="Audit Score" />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Energy Yield Projections (Module 6)
// ═══════════════════════════════════════════════════════════════
function EnergyYieldPage() {
  const [projModel, setProjModel] = useState('ai');
  const yieldData = Array.from({length: 12}, (_, i) => 2800 + Math.sin(i / 2) * 300 + Math.random() * 100);
  const matYield = Array.from({length: 24}, (_, i) => 2600 + Math.sin(i / 4) * 400 + Math.random() * 150);
  const efficiency = Array.from({length: 24}, (_, i) => 85 + Math.sin(i / 3) * 8 + Math.random() * 3);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.red }}>Energy Yield</span> Projections
        </h1>
        <p style={{ color: colors.textDim, fontSize: '13px', margin: '4px 0 0' }}>Mat yield projections and forecast curves</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Projected Growth" value="+8.2%" sub="Next 12 months" accent={colors.green} />
        <StatCard label="Annual Estimate" value="37,842" sub="GWh" />
        <StatCard label="Revenue Forecast" value="$98.4M" sub="Annual projection" accent={colors.green} />
        <StatCard label="AI Confidence" value="94.7%" sub="Model accuracy" accent={colors.red} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="12-Month Yield Projections">
            <LineChart data={yieldData} color={colors.red} showArea />
            <div style={{ textAlign: 'center', fontSize: '11px', color: colors.textDim, marginTop: 8 }}>
              → Optimistic → <span style={{ color: colors.red }}>AI Projected</span> → Conservative
            </div>
          </Card>
          <Card title="Energy-Generating Mat Yield (24 Weeks)">
            <LineChart data={matYield} color={colors.red} />
            <LineChart data={efficiency} color={colors.green} label="→ Mat Yield → Efficiency" />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Projection Model">
            {[
              { id: 'ai', label: 'AI Optimized', desc: 'Machine learning based' },
              { id: 'linear', label: 'Linear Regression', desc: 'Traditional analysis' },
              { id: 'hybrid', label: 'Hybrid Model', desc: 'AI + historical data' },
            ].map(m => (
              <div key={m.id} onClick={() => setProjModel(m.id)} style={{
                display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', cursor: 'pointer',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${projModel === m.id ? colors.red : colors.borderLight}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {projModel === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.red }}/>}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: '10px', color: colors.textMuted }}>{m.desc}</div>
                </div>
              </div>
            ))}
            <RedButton style={{ marginTop: 8 }}>Recalculate Projection</RedButton>
          </Card>

          <Card title="Key Factors">
            {[
              { label: 'Fuel Efficiency', value: '+2.4%', color: colors.green },
              { label: 'Uptime Rate', value: '+1.1%', color: colors.green },
              { label: 'Demand Growth', value: '+3.0%', color: colors.green },
              { label: 'Market Price', value: '-0.2%', color: colors.red },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none', fontSize: '12px' }}>
                <span style={{ color: colors.textDim }}>{f.label}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: f.color }}>{f.value}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP: Main Router
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Restore session on load / refresh
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('llyana_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify token is still valid by calling Supabase
        fetch(`${SB_URL}/auth/v1/user`, {
          headers: { 'Authorization': `Bearer ${parsed.token}`, 'apikey': SB_KEY },
        }).then(res => {
          if (res.ok) {
            setUser(parsed);
          } else if (parsed.refresh_token) {
            // Token expired — try refresh
            fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
              body: JSON.stringify({ refresh_token: parsed.refresh_token }),
            }).then(r => r.json()).then(data => {
              if (data.access_token) {
                const refreshed = { ...data.user, token: data.access_token, refresh_token: data.refresh_token };
                sessionStorage.setItem('llyana_session', JSON.stringify(refreshed));
                setUser(refreshed);
              } else {
                sessionStorage.removeItem('llyana_session');
              }
            }).catch(() => sessionStorage.removeItem('llyana_session'))
              .finally(() => setLoading(false));
            return;
          } else {
            sessionStorage.removeItem('llyana_session');
          }
          setLoading(false);
        }).catch(() => { sessionStorage.removeItem('llyana_session'); setLoading(false); });
        return;
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  // Save current page so refresh stays on same page
  useEffect(() => {
    try { sessionStorage.setItem('llyana_page', currentPage); } catch(e) {}
  }, [currentPage]);

  // Restore page on load
  useEffect(() => {
    try {
      const savedPage = sessionStorage.getItem('llyana_page');
      if (savedPage) setCurrentPage(savedPage);
    } catch(e) {}
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('llyana_session');
    sessionStorage.removeItem('llyana_page');
    setUser(null);
    setCurrentPage('overview');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #1E1E1E', borderTopColor: '#E63946', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#888', fontSize: '13px' }}>Restoring session...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <OverviewPage onNavigate={setCurrentPage} />;
      case 'reactor': return <ReactorCorePage />;
      case 'thermal': return <ThermalPowerPage />;
      case 'materials': return <MaterialsPage />;
      case 'operations': return <OperationsPage />;
      case 'safety': return <SafetyPage />;
      case 'energy': return <EnergyYieldPage />;
      default: return <OverviewPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} onLogout={handleLogout}>
      {renderPage()}
    </DashboardLayout>
  );
}
