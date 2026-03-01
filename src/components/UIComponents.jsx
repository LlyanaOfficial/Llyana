// ============================================================
// LLYANA — Reusable UI Components
// Dark theme, red accents, Tesla-inspired control room aesthetic
// ============================================================

import React from 'react';

// ── Color Tokens ────────────────────────────────────────────
export const colors = {
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
export const Icons = {
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

// ── Gauge Component ─────────────────────────────────────────
export function Gauge({ value, label, size = 120 }) {
  const angle = (value / 100) * 270 - 135;
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2;
  const startAngle = -135 * (Math.PI / 180);
  const endAngle = angle * (Math.PI / 180);
  const bgEnd = 135 * (Math.PI / 180);

  function arcPath(sA, eA) {
    const x1 = cx + r * Math.cos(sA), y1 = cy + r * Math.sin(sA);
    const x2 = cx + r * Math.cos(eA), y2 = cy + r * Math.sin(eA);
    const large = eA - sA > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const gc = value > 95 ? colors.green : value > 85 ? colors.yellow : value > 70 ? colors.orange : colors.red;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`}>
        <path d={arcPath(startAngle, bgEnd)} fill="none" stroke="#2A2A2A" strokeWidth="8" strokeLinecap="round"/>
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke={gc} strokeWidth="8" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${gc}40)` }}/>
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: 700, color: gc, marginTop: -8 }}>{value}%</div>
      <div style={{ fontSize: '12px', color: colors.textDim, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '16px 20px', flex: 1, minWidth: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '12px', color: colors.textDim, marginBottom: 8 }}>{label}</div>
        {icon && <div style={{ color: colors.textMuted, opacity: 0.5 }}>{icon}</div>}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: accent || colors.text, letterSpacing: '-0.5px' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: accent || colors.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Card Container ──────────────────────────────────────────
export function Card({ children, style, title, actions }) {
  return (
    <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '20px 24px', ...style }}>
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
export function RedButton({ children, onClick, outline, style: s, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? 'transparent' : colors.red, color: outline ? colors.red : '#fff',
      border: outline ? `1px solid ${colors.red}` : 'none', borderRadius: 6, padding: '10px 20px',
      fontSize: '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      width: '100%', opacity: disabled ? 0.5 : 1, transition: 'all 0.2s', letterSpacing: '0.3px', ...s,
    }}>{children}</button>
  );
}

// ── Filter Pill ─────────────────────────────────────────────
export function Pill({ active, children, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || colors.cyan) : 'transparent', color: active ? '#fff' : colors.textDim,
      border: `1px solid ${active ? (color || colors.cyan) : colors.borderLight}`, borderRadius: 4,
      padding: '4px 12px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
    }}>{children}</button>
  );
}

// ── Progress Bar ────────────────────────────────────────────
export function ProgressBar({ value, color, label }) {
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

// ── Line Chart ──────────────────────────────────────────────
export function LineChart({ data, width = 800, height = 200, color = colors.red, showArea, label }) {
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

// ── Bar Chart ───────────────────────────────────────────────
export function BarChart({ data, labels, width = 700, height = 200, color = colors.red }) {
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
              {labels && labels[i] && <text x={x + barWidth / 2} y={height + 16} textAnchor="middle" fill={colors.textMuted} fontSize="9">{labels[i]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Input Field ─────────────────────────────────────────────
export function InputField({ label, value, onChange, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6 }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`, borderRadius: 6,
        padding: '10px 14px', color: colors.text, fontSize: '14px', fontFamily: "'JetBrains Mono', monospace",
        outline: 'none', boxSizing: 'border-box',
      }}/>
      {hint && <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
