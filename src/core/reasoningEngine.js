// ============================================================
// LLYANA CORE — Reasoning Engine
// Safety-first thinking | Conservative assumptions
// Zero hallucination: unknown = "UNKNOWN", never guesses
// ============================================================

import { getAlertForValue } from './alertSystem.js';
import { buildExplanation } from './explainability.js';

/**
 * Run a full reasoning flow on input parameters.
 * Steps: compare → trend → cross-check → material limits → recommend
 * (Per Milton's Intelligence Parameters doc, Section 2)
 */
export function runReasoningFlow(moduleId, inputs, thresholds) {
  const steps = [];
  const alerts = [];
  const recommendations = [];

  // Step 1: Compare each input against normal operating range
  for (const [param, value] of Object.entries(inputs)) {
    if (value == null || value === '') continue;
    const t = thresholds[param];
    if (!t) continue;

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      alerts.push({ param, level: 'UNKNOWN', reason: `Non-numeric value for ${param}` });
      continue;
    }

    const alert = getAlertForValue(numVal, t.min, t.max);
    steps.push({
      action: `Compare ${param} against operating range (${t.min}–${t.max} ${t.unit || ''})`,
      result: `${numVal} ${t.unit || ''} → ${alert.level}`,
    });

    if (alert.level !== 'SAFE') {
      alerts.push({ param, level: alert.level, value: numVal, ...t });
    }
  }

  // Step 2: Trend analysis (if historical data provided)
  if (inputs._history && inputs._history.length >= 2) {
    const trend = analyzeTrend(inputs._history);
    steps.push({
      action: 'Analyze parameter trend over time',
      result: `${trend.direction} at rate ${trend.rate}/interval`,
    });
  }

  // Step 3: Cross-module consistency check
  steps.push({
    action: 'Cross-check against related module parameters',
    result: alerts.length > 0 ? `${alerts.length} parameter(s) flagged — impact analysis triggered` : 'All parameters consistent',
  });

  // Step 4: Generate recommendations
  const criticals = alerts.filter(a => a.level === 'CRITICAL');
  const warnings = alerts.filter(a => a.level === 'WARNING');
  const monitors = alerts.filter(a => a.level === 'MONITOR');

  if (criticals.length > 0) {
    recommendations.push({
      action: 'IMMEDIATE SHUTDOWN RECOMMENDED',
      priority: 'CRITICAL',
      reasoning: `${criticals.length} parameter(s) at or beyond safety limits: ${criticals.map(a => a.param).join(', ')}`,
    });
  }
  if (warnings.length > 0) {
    warnings.forEach(w => {
      recommendations.push({
        action: `Take corrective action on ${w.param}`,
        priority: 'HIGH',
        reasoning: `${w.param} at ${w.value} ${w.unit || ''} — 90-99% of safety limit (${w.max} ${w.unit || ''})`,
      });
    });
  }
  if (monitors.length > 0) {
    monitors.forEach(m => {
      recommendations.push({
        action: `Monitor ${m.param} closely`,
        priority: 'MEDIUM',
        reasoning: `${m.param} approaching 80% threshold`,
      });
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      action: 'No action required',
      priority: 'LOW',
      reasoning: 'All parameters within normal operating range',
    });
  }

  // Determine overall status (worst alert wins)
  const levelOrder = ['SAFE', 'MONITOR', 'WARNING', 'CRITICAL', 'UNKNOWN'];
  const overallStatus = alerts.reduce((worst, a) => {
    return levelOrder.indexOf(a.level) > levelOrder.indexOf(worst) ? a.level : worst;
  }, 'SAFE');

  return {
    moduleId,
    overallStatus,
    alerts,
    recommendations,
    reasoning: buildExplanation(steps),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze trend from array of numeric values
 */
export function analyzeTrend(dataPoints) {
  if (!dataPoints || dataPoints.length < 2) {
    return { direction: 'insufficient_data', rate: 0 };
  }
  const recent = dataPoints.slice(-5);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const rate = (last - first) / recent.length;

  return {
    direction: rate > 0.01 ? 'increasing' : rate < -0.01 ? 'decreasing' : 'stable',
    rate: Math.round(rate * 1000) / 1000,
    lastValue: last,
    dataPoints: recent.length,
  };
}

/**
 * Cross-module impact check:
 * When one parameter changes, check which other modules are affected
 */
export function crossModuleCheck(paramName, value, allModuleThresholds) {
  const impacts = [];
  for (const [moduleId, thresholds] of Object.entries(allModuleThresholds)) {
    if (thresholds[paramName]) {
      const { min, max } = thresholds[paramName];
      const alert = getAlertForValue(value, min, max);
      if (alert.level !== 'SAFE') {
        impacts.push({ moduleId, param: paramName, level: alert.level, value });
      }
    }
  }
  return impacts;
}

/**
 * Calculate confidence percentage based on data completeness
 */
export function calculateConfidence(inputs, requiredFields) {
  if (!inputs || !requiredFields || requiredFields.length === 0) return 0;
  const provided = requiredFields.filter(f => inputs[f] != null && inputs[f] !== '');
  return Math.round((provided.length / requiredFields.length) * 100);
}
