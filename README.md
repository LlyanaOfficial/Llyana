# Llyana — Nuclear Engineering AI Dashboard

> **Avolv Energy Technologies** | Built by Leon Maunge — Futurify Design
> v2.4.1 | CLASSIFICATION: RESTRICTED

---

## Project Structure

```
llyana/
├── src/
│   ├── core/                       ← Shared Llyana brain (Phase 1)
│   │   ├── reasoningEngine.js      ← Logic, safety-first thinking, trend analysis
│   │   ├── alertSystem.js          ← GREEN/YELLOW/ORANGE/RED/GRAY framework
│   │   ├── inputHandler.js         ← Validates format, flags missing data, units
│   │   ├── outputFormatter.js      ← Standardised reports per Section 5
│   │   └── explainability.js       ← Reasoning chains — HOW Llyana decided
│   ├── ventures/
│   │   └── nuclear/                ← Phase 2: 6 nuclear modules
│   │       ├── reactorCore.js      ← Neutronics, criticality, burnup
│   │       ├── thermalPower.js     ← Heat transfer, coolant, power output
│   │       ├── materials.js        ← Alloy performance, corrosion, irradiation
│   │       ├── operations.js       ← Maintenance scheduling, timeline
│   │       ├── safety.js           ← IAEA compliance, dose rates, alerts
│   │       └── energyYield.js      ← EGM piezoelectric mat projections
│   ├── pages/                      ← React pages (matching Figma)
│   │   ├── LoginPage.jsx           ← Supabase auth login screen
│   │   └── index.js                ← Page exports
│   ├── components/                 ← Reusable UI components
│   │   └── UIComponents.jsx        ← Card, Gauge, Charts, Buttons, Icons
│   ├── lib/
│   │   └── supabase.js             ← Obfuscated Supabase client + CRUD helpers
│   ├── App.jsx                     ← Main SPA (all 8 pages + routing)
│   └── main.jsx                    ← Entry point
├── supabase/
│   └── schema.sql                  ← Full DB schema with RLS policies
├── .github/workflows/
│   └── deploy.yml                  ← Auto-deploy to GitHub Pages on push
├── index.html                      ← Root HTML with fonts + scanline effect
├── vite.config.js                  ← Build config (base: /Llyana/)
├── package.json
├── .gitignore
└── README.md
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/llyanaofficial/Llyana.git
cd Llyana

# 2. Install
npm install

# 3. Dev server
npm run dev

# 4. Build for production
npm run build
```

---

## Supabase Setup

1. Go to **Supabase Dashboard → SQL Editor**
2. Paste and run `supabase/schema.sql`
3. Go to **Auth → Add User** → Create Milton's account
4. Go to **Auth → Settings** → Disable public signups

---

## Deployment

Push to `main` → GitHub Actions auto-builds and deploys to:
**https://llyanaofficial.github.io/Llyana/**

---

## Architecture

### Core Brain (Phase 1 — shared across all ventures)
| File | Purpose |
|------|---------|
| `reasoningEngine.js` | Safety-first logic, trend analysis, cross-module checks, confidence scoring |
| `alertSystem.js` | 5-level alert framework: SAFE → MONITOR → WARNING → CRITICAL → UNKNOWN |
| `inputHandler.js` | Parameter validation, unit tracking, schema definitions per module |
| `outputFormatter.js` | 9 output types: status report, numerical analysis, safety flag, trend, recommendation, prediction, maintenance, EGM yield, compliance |
| `explainability.js` | Reasoning chains, confidence explanations, error propagation tracking |

### Nuclear Modules (Phase 2)
| # | Module | File | Function |
|---|--------|------|----------|
| 1 | Reactor Core | `reactorCore.js` | Neutronics, criticality, radial gauge analysis |
| 2 | Thermal & Power | `thermalPower.js` | Heat transfer, coolant flow, power tracking |
| 3 | Materials | `materials.js` | Alloy degradation, corrosion, replacement predictions |
| 4 | Operations | `operations.js` | Maintenance scheduling, timeline management |
| 5 | Safety | `safety.js` | IAEA compliance, alert system, regulatory tracking |
| 6 | Energy Yield | `energyYield.js` | EGM piezoelectric mat projections, ROI |

### Alert System
| Level | Trigger | Color |
|-------|---------|-------|
| SAFE | All parameters normal | 🟢 Green |
| MONITOR | 80% of safety limit | 🟡 Yellow |
| WARNING | 90-99% of limit | 🟠 Orange |
| CRITICAL | At or beyond limit | 🔴 Red |
| UNKNOWN | Insufficient data | ⚪ Gray |

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **Hosting:** GitHub Pages (static)
- **AI Engine:** Rule-based reasoning (no ML dependencies)
- **Design:** Dark theme + red accents, Tesla-inspired control room UI

---

## Future Phases

| Phase | Venture | Status |
|-------|---------|--------|
| 1-2 | Nuclear | ✅ Current build |
| 3 | EGM (included in Nuclear) | ✅ Included |
| 4 | Space | 🔲 Future — plug into same core |
| 5 | Energy/Grid | 🔲 Future |
| 6 | Enterprise | 🔲 Future |

---

**CONFIDENTIAL** — Avolv Energy Technologies | Milton Munikwa, CEO & Founder
