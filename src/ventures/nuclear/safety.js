// ============================================================
// LLYANA NUCLEAR — Module 5: Safety & Regulatory
// IAEA compliance, dose rates, containment monitoring
// ============================================================

export function getSafetyStatus() {
  return {
    module: 'safety',
    overallStatus: 'SAFE',
    safetyScore: 97.8,
    criticalAlerts: 1,
    warningAlerts: 2,
    infoAlerts: 1,
    compliance: { compliant: 4, total: 5 },

    alerts: [
      {
        id: 1, title: 'Radiation Level Spike — Sector 3',
        description: 'Temporary radiation spike detected in containment sector 3. Levels returned to normal within acceptable timeframe.',
        type: 'REGULATORY', status: 'RESOLVED', date: '2026-03-01 14:32:18', severity: 'critical',
        borderColor: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)',
      },
      {
        id: 2, title: 'Coolant Temperature Variance',
        description: 'Primary coolant temperature exceeded nominal range by 2.3°C for 4 minutes.',
        type: 'MONITORING', status: 'MONITORING', date: '2026-03-01 10:15:42', severity: 'warning',
        borderColor: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.05)',
      },
      {
        id: 3, title: 'Backup System Test Required',
        description: 'Quarterly backup emergency cooling system test due within 7 days.',
        type: 'REGULATORY', status: 'PENDING', date: '2026-03-01 08:00:00', severity: 'info',
        borderColor: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.05)',
      },
      {
        id: 4, title: 'Containment Pressure Fluctuation',
        description: 'Minor pressure fluctuation in secondary containment. Within acceptable limits.',
        type: 'MONITORING', status: 'RESOLVED', date: '2026-02-28 22:48:11', severity: 'warning',
        borderColor: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.05)',
      },
    ],

    complianceItems: [
      { standard: 'NRC Regulation 10 CFR 50', review: '2026-02-15', status: 'COMPLIANT' },
      { standard: 'ASME Boiler Code',          review: '2026-02-20', status: 'COMPLIANT' },
      { standard: 'EPA Environmental Standards',review: '2026-02-10', status: 'PENDING' },
      { standard: 'DOE Safety Requirements',    review: '2026-02-25', status: 'COMPLIANT' },
      { standard: 'IAEA Safety Standards',      review: '2026-02-18', status: 'COMPLIANT' },
    ],

    metrics: {
      incidentFreeDays: 287,
      responseTime: '3.2s',
      resolutionRate: 98.1,
      auditScore: 97.8,
    },
  };
}
