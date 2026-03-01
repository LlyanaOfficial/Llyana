// ============================================================
// LLYANA — Supabase Client
// Key obfuscation for static GitHub Pages deployment
// Real security is via Row Level Security (RLS) on Supabase
// ============================================================

const _p = [112,100,102,101,116,105,111,116,105,115,119,117,98,100,116,122,116,119,108,106];
const _ref = String.fromCharCode(..._p);

const _k = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZmV0aW90aXN3dWJkdHp0d2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjA1OTEsImV4cCI6MjA4NzkzNjU5MX0',
  'jEqYMxsquxtUUB60BvMxBj9Mqi3E4-YAibIY_0w9ImE'
];

export const SUPABASE_URL = `https://${_ref}.supabase.co`;
export const SUPABASE_ANON_KEY = _k.join('.');

// ── Authentication ──────────────────────────────────────────

export async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function signOut(token) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
  });
}

export async function getUser(token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
  });
  return res.json();
}

// ── Database Operations ─────────────────────────────────────

export async function dbSelect(table, token, options = {}) {
  const params = new URLSearchParams();
  if (options.select) params.set('select', options.select);
  if (options.limit)  params.set('limit', String(options.limit));
  if (options.order)  params.set('order', options.order);
  if (options.filter) {
    for (const [key, val] of Object.entries(options.filter)) {
      params.set(key, val);
    }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function dbInsert(table, data, token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function dbUpdate(table, id, data, token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function dbDelete(table, id, token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.ok;
}
