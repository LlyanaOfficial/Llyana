// ============================================================
// LLYANA — Page Exports
// All pages matching Figma designs:
//   Login, Dashboard Overview, Reactor Core, Thermal & Power,
//   Materials, Operations, Safety & Compliance, Energy Yield
//
// Currently implemented in App.jsx as a single-file SPA.
// As the project grows, each page can be extracted into its own file here.
// ============================================================

export { default as LoginPage } from './LoginPage.jsx';

// The following pages are currently inline in App.jsx:
// - OverviewPage (Dashboard Overview)
// - ReactorCorePage (Module 1)
// - ThermalPowerPage (Module 2)
// - MaterialsPage (Module 3)
// - OperationsPage (Module 4)
// - SafetyPage (Module 5)
// - EnergyYieldPage (Module 6)
//
// To extract: move each function from App.jsx into its own file,
// import components from ../components/UIComponents.jsx
// and module engines from ../ventures/nuclear/
