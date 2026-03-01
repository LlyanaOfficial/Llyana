// ============================================================
// LLYANA CORE — Alert System
// Universal 5-level status framework per Milton's spec
// GREEN (Safe) → YELLOW (Monitor 80%) → ORANGE (Warning 90-99%)
// → RED (Critical 100%+) → GRAY (Unknown/Insufficient)
// ============================================================

export const ALERT_LEVELS = {
  SAFE: {
    level: 'SAFE',
    label: 'Safe',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.3)',
    description: 'All parameters within normal range',
    action: 'Display green status. Log data.',
  },
  MONITOR: {
    level: 'MONITOR',
    label: 'Monitor',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.1)',
    border: 'rgba(234,179,8,0.3)',
    description: 'Parameter approaching limit — 80% threshold',
    action: 'Yellow warning. Recommend check.',
  },
  WARNING: {
    level: 'WARNING',
    label: 'Warning',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.3)',
    description: 'Parameter at 90-99% of safety limit',
    action: 'Orange alert. Recommend action now.',
  },
  CRITICAL: {
    level: 'CRITICAL',
    label: 'Critical',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
    description: 'Parameter at or beyond safety limit',
    action: 'Red alert. Recommend immediate shutdown.',
  },
  UNKNOWN: {
    level: 'UNKNOWN',
    label: 'Unknown',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.1)',
    border: 'rgba(107,114,128,0.3)',
    description: 'Insufficient data to assess',
    action: 'Gray flag. Request more data.',
  },
};

/**
 * Determine alert level for a value against min/max safety range.
 * Uses conservative assumption: worst-case when ambiguous.
 *
 * @param {number} value - The parameter value
 * @param {number} safeMin - Minimum safe operating value
 * @param {number} safeMax - Maximum safe operating value
 * @returns {object} Alert level object from ALERT_LEVELS
 */
export function getAlertForValue(value, safeMin, safeMax) {
  // Unknown if no data
  if (value == null || isNaN(value)) return ALERT_LEVELS.UNKNOWN;
  if (safeMin == null || safeMax == null) return ALERT_LEVELS.UNKNOWN;

  const range = safeMax - safeMin;
  if (range <= 0) return ALERT_LEVELS.UNKNOWN;

  const center = safeMin + range / 2;
  const distFromCenter = Math.abs(value - center) / (range / 2);

  // Outside range entirely = CRITICAL
  if (value < safeMin || value > safeMax) return ALERT_LEVELS.CRITICAL;

  // Distance-based thresholds
  if (distFromCenter < 0.8) return ALERT_LEVELS.SAFE;
  if (distFromCenter < 0.9) return ALERT_LEVELS.MONITOR;
  if (distFromCenter < 1.0) return ALERT_LEVELS.WARNING;
  return ALERT_LEVELS.CRITICAL;
}

/**
 * Get the alert level string for a value (convenience function)
 */
export function getAlertLevel(value, min, max) {
  return getAlertForValue(value, min, max).level;
}

/**
 * Determine the worst (highest severity) alert from an array
 */
export function worstAlert(alerts) {
  const order = ['SAFE', 'MONITOR', 'WARNING', 'CRITICAL', 'UNKNOWN'];
  return alerts.reduce((worst, alert) => {
    const level = typeof alert === 'string' ? alert : alert.level;
    return order.indexOf(level) > order.indexOf(worst) ? level : worst;
  }, 'SAFE');
}

/**
 * Create an alert record for storage/display
 */
export function createAlert(moduleId, param, level, value, details = {}) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
    moduleId,
    param,
    level,
    value,
    timestamp: new Date().toISOString(),
    ...ALERT_LEVELS[level],
    ...details,
  };
}
