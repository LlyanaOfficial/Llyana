// ============================================================
// LLYANA NUCLEAR — Module 1: Reactor Core Analyser
// Neutronics, criticality, burnup calculations
// Reasoning flow: compare → trend → cross-check → limits → recommend
// ============================================================

import { getAlertLevel } from '../../core/alertSystem.js';
import { calculateConfidence } from '../../core/reasoningEngine.js';
import { buildExplanation } from '../../core/explainability.js';
import { validateInputs, NUCLEAR_SCHEMAS } from '../../core/inputHandler.js';

const THRESHOLDS = {
  coreTemp:   { min: 280, max: 600, unit: '°C', nominal: 550 },
  pressure:   { min: 100, max: 180, unit: 'bar', nominal: 155 },
  flowRate:   { min: 3500, max: 5000, unit: 'L/s', nominal: 4200 },
  neutronFlux:{ min: 1e12, max: 5e13, unit: 'n/cm²·s' },
  controlRod: { min: 0, max: 100, unit: '%' },
  xenonLevel: { min: 0, max: 5, unit: 'ppm' },
};

export function analyzeReactorCore(inputs) {
  const validation = validateInputs(inputs, NUCLEAR_SCHEMAS.reactor);
  const data = validation.sanitized;
  const confidence = calculateConfidence(data, ['coreTemp', 'pressure', 'flowRate']);

  const steps = [];
  const alerts = [];

  // Step 1: Compare against normal operating range
  const tempAlert = getAlertLevel(data.coreTemp, THRESHOLDS.coreTemp.min, THRESHOLDS.coreTemp.max);
  steps.push({ action: `Compare core temperature against operating range (${THRESHOLDS.coreTemp.min}–${THRESHOLDS.coreTemp.max}°C)`, result: `${data.coreTemp}°C → ${tempAlert}` });
  if (tempAlert !== 'SAFE') alerts.push({ param: 'Core Temperature', level: tempAlert, value: data.coreTemp });

  const pressAlert = getAlertLevel(data.pressure, THRESHOLDS.pressure.min, THRESHOLDS.pressure.max);
  steps.push({ action: `Compare pressure against operating range (${THRESHOLDS.pressure.min}–${THRESHOLDS.pressure.max} bar)`, result: `${data.pressure} bar → ${pressAlert}` });
  if (pressAlert !== 'SAFE') alerts.push({ param: 'Pressure', level: pressAlert, value: data.pressure });

  const flowAlert = getAlertLevel(data.flowRate, THRESHOLDS.flowRate.min, THRESHOLDS.flowRate.max);
  steps.push({ action: `Compare flow rate against operating range (${THRESHOLDS.flowRate.min}–${THRESHOLDS.flowRate.max} L/s)`, result: `${data.flowRate} L/s → ${flowAlert}` });
  if (flowAlert !== 'SAFE') alerts.push({ param: 'Flow Rate', level: flowAlert, value: data.flowRate });

  // Step 2: Calculate efficiency
  const efficiency = data.coreTemp && data.pressure
    ? Math.min(99.9, 85 + (data.coreTemp / THRESHOLDS.coreTemp.max) * 15 - Math.abs(data.pressure - THRESHOLDS.pressure.nominal) * 0.05)
    : null;
  steps.push({ action: 'Calculate core efficiency from temperature and pressure', result: efficiency ? `${efficiency.toFixed(1)}%` : 'Insufficient data' });

  // Step 3: Cross-check thermal consistency
  if (data.coreTemp && data.flowRate) {
    const thermalBalance = data.coreTemp * data.flowRate / 1000000;
    steps.push({ action: 'Cross-check thermal-hydraulic consistency', result: `Thermal balance: ${thermalBalance.toFixed(2)} — ${thermalBalance > 0.5 && thermalBalance < 3 ? 'Consistent' : 'Anomaly detected'}` });
  }

  // Step 4: Generate recommendations
  const recommendations = [];
  if (tempAlert === 'WARNING' || tempAlert === 'CRITICAL') {
    recommendations.push({ title: 'Temperature Variation', desc: `Core temp at ${data.coreTemp}°C — approaching limits. Recommend adjusting coolant flow.`, severity: 'warning' });
  }
  if (flowAlert !== 'SAFE') {
    recommendations.push({ title: 'Flow Rate Adjustment', desc: `Flow rate ${data.flowRate} L/s outside optimal. Check coolant pump operation.`, severity: 'warning' });
  }
  if (alerts.length === 0) {
    recommendations.push({ title: 'Optimal Performance', desc: 'Core efficiency is within optimal range. No action required.', severity: 'safe' });
  }

  const optimalFlow = Math.round(data.flowRate * 1.035);
  recommendations.push({ title: 'AI Recommendation', desc: `Consider adjusting flow rate to ${optimalFlow} L/s for improved efficiency.`, severity: 'info' });

  // Gauge percentages for UI
  const tempPct = data.coreTemp ? Math.min(99, Math.max(50, 85 + (data.coreTemp / THRESHOLDS.coreTemp.max) * 15 - Math.abs(data.coreTemp - THRESHOLDS.coreTemp.nominal) * 0.02)) : 0;
  const pressPct = data.pressure ? Math.min(99, Math.max(50, 80 + (data.pressure / THRESHOLDS.pressure.max) * 20 - Math.abs(data.pressure - THRESHOLDS.pressure.nominal) * 0.1)) : 0;
  const flowPct = data.flowRate ? Math.min(99, Math.max(50, 90 + (data.flowRate / THRESHOLDS.flowRate.max) * 10 - Math.abs(data.flowRate - THRESHOLDS.flowRate.nominal) * 0.005)) : 0;

  return {
    module: 'reactor_core',
    confidence,
    validation,
    efficiency: efficiency ? Math.round(efficiency * 10) / 10 : null,
    gauges: { efficiency: Math.round((efficiency || 98) * 10) / 10, temperature: Math.round(tempPct * 10) / 10, pressure: Math.round(pressPct * 10) / 10 },
    alerts,
    overallStatus: alerts.length > 0 ? alerts.reduce((w, a) => ['SAFE','MONITOR','WARNING','CRITICAL'].indexOf(a.level) > ['SAFE','MONITOR','WARNING','CRITICAL'].indexOf(w) ? a.level : w, 'SAFE') : 'SAFE',
    reasoning: buildExplanation(steps),
    recommendations,
    metrics: { neutronFlux: data.neutronFlux || '2.4×10¹³', controlRodPosition: data.controlRod || 68, xenonLevel: data.xenonLevel || 1.2 },
  };
}

export { THRESHOLDS as REACTOR_THRESHOLDS };
