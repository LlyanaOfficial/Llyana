// ============================================================
// LLYANA CORE — Input Handler
// Receives manual parameters, validates format, flags missing data
// Unit tracking & verification across all calculations
// ============================================================

/**
 * Validate a set of inputs against a parameter schema.
 * Returns { valid, sanitized, errors, warnings }
 */
export function validateInputs(inputs, schema) {
  const errors = [];
  const warnings = [];
  const sanitized = {};

  for (const [field, rules] of Object.entries(schema)) {
    const raw = inputs[field];

    // Required field check
    if (rules.required && (raw == null || raw === '')) {
      errors.push({ field, type: 'missing', message: `${rules.label || field} is required` });
      continue;
    }

    // Skip optional empty fields
    if (raw == null || raw === '') {
      if (rules.default !== undefined) sanitized[field] = rules.default;
      continue;
    }

    // Type validation
    if (rules.type === 'number') {
      const num = parseFloat(raw);
      if (isNaN(num)) {
        errors.push({ field, type: 'invalid', message: `${rules.label || field} must be a number` });
        continue;
      }

      // Range check
      if (rules.min !== undefined && num < rules.min) {
        warnings.push({ field, type: 'below_range', message: `${rules.label || field} (${num}) is below minimum (${rules.min} ${rules.unit || ''})` });
      }
      if (rules.max !== undefined && num > rules.max) {
        warnings.push({ field, type: 'above_range', message: `${rules.label || field} (${num}) is above maximum (${rules.max} ${rules.unit || ''})` });
      }

      sanitized[field] = num;
    } else if (rules.type === 'string') {
      sanitized[field] = String(raw).trim();
    } else if (rules.type === 'date') {
      const d = new Date(raw);
      if (isNaN(d.getTime())) {
        errors.push({ field, type: 'invalid', message: `${rules.label || field} must be a valid date` });
        continue;
      }
      sanitized[field] = d.toISOString();
    } else {
      sanitized[field] = raw;
    }
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
    warnings,
    completeness: Math.round(Object.keys(sanitized).length / Object.keys(schema).length * 100),
  };
}

/**
 * Validate unit consistency across calculations
 */
export function validateUnits(value, expectedUnit, providedUnit) {
  if (!providedUnit) return { valid: true, converted: value };
  if (expectedUnit === providedUnit) return { valid: true, converted: value };

  // Common nuclear unit conversions
  const conversions = {
    'C_to_F': (v) => v * 9/5 + 32,
    'F_to_C': (v) => (v - 32) * 5/9,
    'bar_to_psi': (v) => v * 14.5038,
    'psi_to_bar': (v) => v / 14.5038,
    'MW_to_kW': (v) => v * 1000,
    'kW_to_MW': (v) => v / 1000,
    'MWh_to_kWh': (v) => v * 1000,
    'kWh_to_MWh': (v) => v / 1000,
    'L/s_to_m3/h': (v) => v * 3.6,
  };

  const key = `${providedUnit}_to_${expectedUnit}`;
  if (conversions[key]) {
    return { valid: true, converted: conversions[key](value), note: `Converted from ${providedUnit} to ${expectedUnit}` };
  }

  return { valid: false, error: `Unit mismatch: expected ${expectedUnit}, got ${providedUnit}. No conversion available.` };
}

/**
 * Parameter schemas for each nuclear module
 */
export const NUCLEAR_SCHEMAS = {
  reactor: {
    coreTemp:   { type: 'number', required: true,  label: 'Core Temperature', unit: '°C', min: 200, max: 700, default: 550 },
    pressure:   { type: 'number', required: true,  label: 'Pressure',         unit: 'bar', min: 50, max: 200, default: 155 },
    flowRate:   { type: 'number', required: true,  label: 'Flow Rate',        unit: 'L/s', min: 2000, max: 6000, default: 4200 },
    neutronFlux:{ type: 'string', required: false, label: 'Neutron Flux',     unit: 'n/cm²·s' },
    controlRod: { type: 'number', required: false, label: 'Control Rod Position', unit: '%', min: 0, max: 100 },
    xenonLevel: { type: 'number', required: false, label: 'Xenon Level',      unit: 'ppm', min: 0, max: 10 },
  },
  thermal: {
    targetPower: { type: 'number', required: true,  label: 'Target Power',   unit: 'MW', min: 0, max: 5000, default: 3200 },
    coolantTemp: { type: 'number', required: true,  label: 'Coolant Temp',   unit: '°C', min: 200, max: 350, default: 290 },
  },
  materials: {
    materialName:  { type: 'string', required: true,  label: 'Material Name' },
    stressReading: { type: 'number', required: false, label: 'Stress Reading',     unit: 'MPa', min: 0, max: 1000 },
    irradiationHrs:{ type: 'number', required: false, label: 'Irradiation Hours',  unit: 'hrs', min: 0 },
    corrosionRate: { type: 'number', required: false, label: 'Corrosion Rate',      unit: 'mm/yr', min: 0 },
    lastInspection:{ type: 'date',   required: false, label: 'Last Inspection' },
  },
  egm: {
    footTraffic: { type: 'number', required: true,  label: 'Foot Traffic',    unit: 'steps/min', min: 0, max: 500, default: 45 },
    area:        { type: 'number', required: true,  label: 'Mat Area',        unit: 'm²', min: 0.1, max: 1000, default: 10 },
    temperature: { type: 'number', required: false, label: 'Temperature',     unit: '°C', min: -20, max: 60 },
    humidity:    { type: 'number', required: false, label: 'Humidity',        unit: '%', min: 0, max: 100 },
  },
};
