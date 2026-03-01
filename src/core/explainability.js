// ============================================================
// LLYANA CORE — Explainability Layer
// Every output includes reasoning chain — HOW Llyana decided
// Per Milton's spec: "Always show HOW conclusion was reached"
// ============================================================

/**
 * Build a structured explanation from reasoning steps.
 * Each step has: action (what Llyana did) and result (what it found)
 */
export function buildExplanation(steps) {
  return steps.map((step, i) => ({
    step: i + 1,
    action: step.action,
    result: step.result,
    status: step.status || 'complete',
  }));
}

/**
 * Generate a human-readable reasoning summary from steps
 */
export function summarizeReasoning(steps) {
  if (!steps || steps.length === 0) return 'No reasoning steps recorded.';

  const lines = steps.map((s, i) =>
    `Step ${i + 1}: ${s.action} → ${s.result}`
  );
  return lines.join('\n');
}

/**
 * Build confidence explanation — why confidence is at this level
 */
export function explainConfidence(confidence, providedFields, totalFields) {
  if (confidence >= 95) {
    return {
      level: 'HIGH',
      explanation: `${providedFields}/${totalFields} parameters provided. High-confidence analysis.`,
    };
  }
  if (confidence >= 70) {
    return {
      level: 'MODERATE',
      explanation: `${providedFields}/${totalFields} parameters provided. Some inputs missing — results are estimates.`,
    };
  }
  if (confidence >= 40) {
    return {
      level: 'LOW',
      explanation: `Only ${providedFields}/${totalFields} parameters provided. Results have significant uncertainty.`,
    };
  }
  return {
    level: 'INSUFFICIENT',
    explanation: `Only ${providedFields}/${totalFields} parameters provided. Cannot provide reliable analysis. Please supply more data.`,
  };
}

/**
 * Track error propagation through multi-step calculations.
 * Per Milton's spec: "Show accumulated uncertainty at each step"
 */
export function trackErrorPropagation(steps) {
  let accumulatedError = 0;

  return steps.map((step, i) => {
    const stepError = step.uncertaintyPct || 0;
    accumulatedError = Math.sqrt(accumulatedError ** 2 + stepError ** 2); // Root sum of squares

    return {
      step: i + 1,
      action: step.action,
      stepUncertainty: `±${stepError.toFixed(1)}%`,
      accumulatedUncertainty: `±${accumulatedError.toFixed(1)}%`,
    };
  });
}

/**
 * Build a cross-discipline impact explanation
 * Per Milton: "One change triggers impact analysis across all modules"
 */
export function explainCrossImpact(impacts) {
  if (!impacts || impacts.length === 0) {
    return 'No cross-module impacts detected. Change is isolated to current module.';
  }

  const lines = impacts.map(imp =>
    `⚠ ${imp.param} change affects ${imp.moduleId}: Alert level → ${imp.level}`
  );
  return `Cross-module impacts detected:\n${lines.join('\n')}`;
}
