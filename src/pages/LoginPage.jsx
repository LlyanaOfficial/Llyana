import React, { useState } from 'react';
import { signIn } from '../lib/supabase.js';
import { colors, RedButton } from '../components/UIComponents.jsx';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await signIn(email, password);
      if (data.access_token) {
        onLogin({ ...data.user, token: data.access_token });
      } else {
        setError(data.error_description || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.04) 0%, transparent 60%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.01) 40px, rgba(255,255,255,0.01) 41px)`,
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
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: '8px 0 0', fontFamily: 'monospace', letterSpacing: '1px' }}>v2.4.1 | CLASSIFICATION: RESTRICTED</p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6, fontWeight: 500 }}>Username</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter username" style={{
            width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`, borderRadius: 6,
            padding: '12px 14px', color: colors.text, fontSize: '14px', marginBottom: 16, outline: 'none', boxSizing: 'border-box',
          }}/>
          <label style={{ fontSize: '12px', color: colors.textDim, display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{
            width: '100%', background: colors.bgInput, border: `1px solid ${colors.borderLight}`, borderRadius: 6,
            padding: '12px 14px', color: colors.text, fontSize: '14px', marginBottom: 24, outline: 'none', boxSizing: 'border-box',
          }}/>
        </div>
        {error && <div style={{ color: colors.red, fontSize: '12px', marginBottom: 12 }}>{error}</div>}
        <RedButton onClick={handleLogin} disabled={loading}>{loading ? 'Authenticating...' : 'Access System'}</RedButton>
        <div style={{ marginTop: 24 }}>
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: 0 }}>Authorized Personnel Only</p>
          <p style={{ color: colors.textMuted, fontSize: '11px', margin: '2px 0 0' }}>All activity is monitored and logged</p>
        </div>
      </div>
    </div>
  );
}
