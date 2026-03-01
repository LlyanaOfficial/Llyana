// ============================================================
// LLYANA NUCLEAR — Module 4: Operational Monitor
// Plant availability, load following, maintenance scheduling
// ============================================================

export function getMaintenanceSchedule() {
  return {
    nextMaintenance: 4, // days
    scheduledTasks: 6,
    completedWeek: 3,
    avgDuration: 6.3,
    overallStatus: 'SAFE',
    tasks: [
      { id: 1, name: 'Primary Coolant System Inspection', date: '2026-03-05', hours: 8, priority: 'HIGH',     status: 'upcoming',  color: '#eab308' },
      { id: 2, name: 'Turbine Blade Calibration',         date: '2026-03-08', hours: 4, priority: 'MEDIUM',   status: 'upcoming',  color: '#06b6d4' },
      { id: 3, name: 'Control Rod Drive Mechanism Test',   date: '2026-03-12', hours: 6, priority: 'HIGH',     status: 'upcoming',  color: '#eab308' },
      { id: 4, name: 'Emergency Cooling System Drill',     date: '2026-03-15', hours: 3, priority: 'CRITICAL', status: 'scheduled', color: '#ef4444' },
      { id: 5, name: 'Radiation Monitor Calibration',      date: '2026-03-18', hours: 5, priority: 'HIGH',     status: 'scheduled', color: '#eab308' },
      { id: 6, name: 'Steam Generator Tube Inspection',    date: '2026-03-22', hours: 12,priority: 'MEDIUM',   status: 'scheduled', color: '#06b6d4' },
    ],
    recentActivity: [
      { name: 'Reactor Vessel Inspection',      date: '2026-02-28', team: 'Team A', status: 'complete' },
      { name: 'Feedwater System Maintenance',    date: '2026-02-26', team: 'Team B', status: 'complete' },
      { name: 'Backup Generator Test',           date: '2026-02-24', team: 'Team C', status: 'complete' },
    ],
    statistics: {
      onTimeRate: 98.5,
      taskCompletion: 94.2,
      resourceUtilization: 87.1,
    },
  };
}

export function filterTasks(tasks, filter) {
  if (filter === 'All') return tasks;
  return tasks.filter(t => t.priority === filter.toUpperCase());
}
