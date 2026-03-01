// ============================================================
// LLYANA NUCLEAR — Module 3: Materials & Metallurgy Brain
// Alloy performance, irradiation, corrosion tracking
// Reasoning: yield strength → embrittlement → life → corrosion → recommend
// ============================================================

import { buildExplanation } from '../../core/explainability.js';

const MATERIALS_DB = {
  'Zircaloy-4':  { degradation: 8.2,  yieldStrength: 380, maxDeg: 25, status: 'safe' },
  'SS-316':      { degradation: 12.7, yieldStrength: 290, maxDeg: 20, status: 'monitor' },
  'Inconel 625': { degradation: 5.1,  yieldStrength: 490, maxDeg: 30, status: 'safe' },
  'Graphite':    { degradation: 15.3, yieldStrength: 40,  maxDeg: 18, status: 'warning' },
  'Beryllium':   { degradation: 3.8,  yieldStrength: 240, maxDeg: 15, status: 'safe' },
  'Hafnium':     { degradation: 9.4,  yieldStrength: 200, maxDeg: 22, status: 'safe' },
};

export function analyzeMaterial(materialName, inputs = {}) {
  const mat = MATERIALS_DB[materialName];
  if (!mat) return { error: `Unknown material: ${materialName}`, module: 'materials' };

  const steps = [];

  // Step 1: Compare against yield strength baseline
  const yieldUsed = (mat.degradation / mat.maxDeg) * 100;
  steps.push({ action: `Compare ${materialName} against yield strength baseline`, result: `${mat.degradation}% degradation (${yieldUsed.toFixed(0)}% of yield capacity used)` });

  // Step 2: Check irradiation history for embrittlement
  const embrittlementRisk = mat.degradation > 10 ? 'Elevated' : mat.degradation > 7 ? 'Moderate' : 'Low';
  steps.push({ action: 'Check irradiation history for embrittlement', result: `Embrittlement risk: ${embrittlementRisk}` });

  // Step 3: Calculate remaining safe operating life
  const remainingMonths = Math.round((mat.maxDeg - mat.degradation) / (mat.degradation / 24)); // Assume 24 months of operation
  steps.push({ action: 'Calculate remaining safe operating life', result: `${remainingMonths} months estimated` });

  // Step 4: Check corrosion rate
  const corrosionRate = mat.degradation > 12 ? 'Accelerating' : mat.degradation > 8 ? 'Normal' : 'Minimal';
  steps.push({ action: 'Check corrosion rate data', result: `Corrosion rate: ${corrosionRate}` });

  // Step 5: Generate recommendations
  const recommendations = [];
  if (mat.degradation > 12) recommendations.push(`Monitor ${materialName} closely — trending above threshold`);
  if (mat.degradation > 15) recommendations.push(`Schedule ${materialName} inspection within 30 days`);
  if (mat.degradation < 5) recommendations.push(`${materialName} performance exceeding expectations`);

  // Trend data (simulated 12-month degradation)
  const trendData = Array.from({ length: 12 }, (_, i) =>
    mat.degradation * (i / 12) * (1 + Math.sin(i / 3) * 0.1) + Math.random() * 0.5
  );

  return {
    module: 'materials',
    material: materialName,
    degradation: mat.degradation,
    yieldUsed: Math.round(yieldUsed * 10) / 10,
    remainingMonths,
    embrittlementRisk,
    corrosionRate,
    overallStatus: mat.status.toUpperCase(),
    reasoning: buildExplanation(steps),
    recommendations,
    trendData,
  };
}

export function getAllMaterials() {
  return {
    materials: Object.entries(MATERIALS_DB).map(([name, data]) => ({
      name,
      ...data,
    })),
    avgDegradation: Object.values(MATERIALS_DB).reduce((sum, m) => sum + m.degradation, 0) / Object.keys(MATERIALS_DB).length,
    totalTracked: Object.keys(MATERIALS_DB).length,
    warningCount: Object.values(MATERIALS_DB).filter(m => m.degradation > 10).length,
    nextInspection: 28,
    replacementDue: 142,
  };
}

export { MATERIALS_DB };
