// ============================================================
// LLYANA CORE — Output Formatter
// Standardised output formats per Milton's spec (Section 5)
// Every output: Value + Unit + Confidence% + Benchmark + Reasoning
// ============================================================

import { ALERT_LEVELS } from './alertSystem.js';

/**
 * Format a Status Report output
 * Used: Every data input
 */
export function formatStatusReport(moduleId, alertLevel, parameters, confidence) {
  return {
    type: 'status_report',
    moduleId,
    alertLevel,
    alertInfo: ALERT_LEVELS[alertLevel] || ALERT_LEVELS.UNKNOWN,
    parameters,
    confidence,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Numerical Analysis output
 * Used: All calculations
 */
export function formatNumericalAnalysis(value, unit, confidence, benchmark = null) {
  return {
    type: 'numerical_analysis',
    value,
    unit,
    confidence,
    benchmark: benchmark ? {
      standard: benchmark.standard,
      expected: benchmark.expected,
      deviation: benchmark.expected ? ((value - benchmark.expected) / benchmark.expected * 100).toFixed(1) + '%' : null,
      withinLimits: benchmark.min != null ? value >= benchmark.min && value <= benchmark.max : null,
    } : null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Safety Flag output
 * Used: When limits exceeded
 */
export function formatSafetyFlag(parameter, breachLevel, value, limit, recommendation) {
  return {
    type: 'safety_flag',
    parameter,
    breachLevel,
    value,
    limit,
    recommendation,
    alertInfo: ALERT_LEVELS[breachLevel] || ALERT_LEVELS.UNKNOWN,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Trend Analysis output
 * Used: Monitoring mode
 */
export function formatTrendAnalysis(parameter, direction, rate, timeToLimit = null) {
  return {
    type: 'trend_analysis',
    parameter,
    direction,
    rate,
    timeToLimit,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Recommendation output
 * Used: All warnings
 */
export function formatRecommendation(action, priority, reasoning) {
  return {
    type: 'recommendation',
    action,
    priority,
    reasoning,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Prediction output
 * Used: Forecasting mode
 */
export function formatPrediction(futureValue, unit, timeHorizon, uncertaintyRange) {
  return {
    type: 'prediction',
    futureValue,
    unit,
    timeHorizon,
    uncertaintyRange,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Maintenance Alert output
 * Used: Operational module
 */
export function formatMaintenanceAlert(component, issue, urgency, estimatedDowntime) {
  return {
    type: 'maintenance_alert',
    component,
    issue,
    urgency,
    estimatedDowntime,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format an EGM Yield Report output
 * Used: EGM module
 */
export function formatEGMYieldReport(dailyKwh, monthlyKwh, revenue, topZones) {
  return {
    type: 'egm_yield_report',
    dailyKwh,
    monthlyKwh,
    revenue,
    topZones,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a Compliance Report output
 * Used: Regulatory module
 */
export function formatComplianceReport(standard, requirement, currentStatus, gap) {
  return {
    type: 'compliance_report',
    standard,
    requirement,
    currentStatus,
    gap,
    timestamp: new Date().toISOString(),
  };
}
