// ============================================================
// LLYANA NUCLEAR — Module 2: Thermal Hydraulics Engine
// Heat transfer, coolant flow, temperature management
// ============================================================

import { getAlertLevel } from '../../core/alertSystem.js';
import { calculateConfidence } from '../../core/reasoningEngine.js';
import { buildExplanation } from '../../core/explainability.js';

const THRESHOLDS = {
  targetPower: { min: 0, max: 4000, unit: 'MW', nominal: 3200 },
  coolantTemp: { min: 250, max: 320, unit: '°C', nominal: 290 },
};

export function analyzeThermalPower(inputs) {
  const targetPower = parseFloat(inputs.targetPower) || THRESHOLDS.targetPower.nominal;
  const coolantTemp = parseFloat(inputs.coolantTemp) || THRESHOLDS.coolantTemp.nominal;
  const confidence = calculateConfidence(inputs, ['targetPower', 'coolantTemp']);
  const steps = [];

  // Calculate derived metrics
  const currentOutput = Math.round(targetPower * (0.993 + Math.random() * 0.01));
  const efficiency = 85 + (coolantTemp / THRESHOLDS.coolantTemp.max) * 10 + Math.random() * 2;
  const thermalLoad = Math.round(currentOutput * 0.92);
  const heatRate = Math.round(currentOutput * 3.41);

  steps.push({ action: 'Calculate current power output from target', result: `${currentOutput} MW (${(currentOutput/targetPower*100).toFixed(1)}% of target)` });
  steps.push({ action: 'Calculate thermal efficiency', result: `${efficiency.toFixed(1)}%` });
  steps.push({ action: 'Derive thermal load from output', result: `${thermalLoad} MWh` });
  steps.push({ action: 'Calculate heat rate', result: `${heatRate} BTU/kWh` });

  // Component status check
  const steamGen = coolantTemp > 310 ? 'WARNING' : 'OPTIMAL';
  const turbine = currentOutput > targetPower * 1.05 ? 'WARNING' : 'OPTIMAL';
  const condenser = 'OPTIMAL';
  steps.push({ action: 'Check steam generator, turbine, condenser status', result: `SG: ${steamGen}, T: ${turbine}, C: ${condenser}` });

  // Power output time series (simulated 20-minute window)
  const powerTimeSeries = Array.from({ length: 20 }, (_, i) =>
    Math.round(targetPower * 0.97 + Math.sin(i / 3) * 30 + Math.random() * 20)
  );

  // 24-hour performance (simulated)
  const perfPower = Array.from({ length: 24 }, (_, i) =>
    Math.round(targetPower * 0.95 + Math.sin(i / 4) * 150 + Math.random() * 50)
  );
  const perfThermal = perfPower.map(v => Math.round(v * 0.85 + Math.random() * 30));

  return {
    module: 'thermal_power',
    confidence,
    currentOutput,
    efficiency: Math.round(efficiency * 10) / 10,
    thermalLoad,
    heatRate,
    overallStatus: steamGen === 'WARNING' || turbine === 'WARNING' ? 'MONITOR' : 'SAFE',
    reasoning: buildExplanation(steps),
    components: { steamGenerator: steamGen, turbine, condenser },
    charts: { powerTimeSeries, perfPower, perfThermal },
  };
}

export { THRESHOLDS as THERMAL_THRESHOLDS };
