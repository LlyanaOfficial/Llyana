-- ============================================================
-- LLYANA DATABASE SCHEMA
-- Avolv Energy Technologies
-- Supabase PostgreSQL
-- ============================================================

-- ── Core Tables (Shared across all ventures) ────────────────

-- Analysis logs: every time Llyana processes input
CREATE TABLE IF NOT EXISTS analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venture TEXT NOT NULL DEFAULT 'nuclear',
  module TEXT NOT NULL,
  input_params JSONB NOT NULL,
  output_result JSONB NOT NULL,
  alert_level TEXT CHECK (alert_level IN ('SAFE','MONITOR','WARNING','CRITICAL','UNKNOWN')),
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  reasoning_chain JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Alert history
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venture TEXT NOT NULL DEFAULT 'nuclear',
  module TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  alert_level TEXT CHECK (alert_level IN ('SAFE','MONITOR','WARNING','CRITICAL','UNKNOWN')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','resolved','monitoring','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id)
);

-- ── Nuclear Venture Tables ──────────────────────────────────

-- Reactor core readings
CREATE TABLE IF NOT EXISTS nuclear_reactor_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  core_temp DECIMAL,
  pressure DECIMAL,
  flow_rate DECIMAL,
  neutron_flux TEXT,
  control_rod_position DECIMAL,
  xenon_level DECIMAL,
  efficiency DECIMAL,
  alert_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Thermal & power readings
CREATE TABLE IF NOT EXISTS nuclear_thermal_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_power DECIMAL,
  current_output DECIMAL,
  coolant_temp DECIMAL,
  efficiency DECIMAL,
  thermal_load DECIMAL,
  heat_rate DECIMAL,
  steam_generator_status TEXT DEFAULT 'OPTIMAL',
  turbine_status TEXT DEFAULT 'OPTIMAL',
  condenser_status TEXT DEFAULT 'OPTIMAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Material tracking
CREATE TABLE IF NOT EXISTS nuclear_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_name TEXT NOT NULL,
  degradation_pct DECIMAL,
  status TEXT CHECK (status IN ('safe','monitor','warning','critical')),
  last_inspection DATE,
  next_inspection DATE,
  irradiation_hours INTEGER,
  corrosion_rate DECIMAL,
  remaining_life_months INTEGER,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Maintenance schedule
CREATE TABLE IF NOT EXISTS nuclear_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  duration_hours DECIMAL,
  priority TEXT CHECK (priority IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','upcoming','in_progress','completed','cancelled')),
  assigned_team TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Safety & compliance
CREATE TABLE IF NOT EXISTS nuclear_compliance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  standard_name TEXT NOT NULL,
  standard_code TEXT,
  last_review DATE,
  next_review DATE,
  status TEXT CHECK (status IN ('COMPLIANT','PENDING','NON_COMPLIANT','UNDER_REVIEW')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- EGM (Energy-Generating Mat) data
CREATE TABLE IF NOT EXISTS nuclear_egm_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT,
  foot_traffic_per_min DECIMAL,
  area_sqm DECIMAL,
  raw_power_w DECIMAL,
  net_power_w DECIMAL,
  daily_kwh DECIMAL,
  monthly_kwh DECIMAL,
  efficiency_pct DECIMAL,
  mat_condition TEXT DEFAULT 'good',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- ── Venture config (admin toggle per module) ────────────────
CREATE TABLE IF NOT EXISTS venture_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venture TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT false,
  modules JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default nuclear venture
INSERT INTO venture_config (venture, is_active, modules) 
VALUES ('nuclear', true, '["reactor_core","thermal_power","materials","operations","safety","energy_yield"]')
ON CONFLICT (venture) DO NOTHING;

-- ── Row Level Security ──────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_reactor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_thermal_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_egm_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE venture_config ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can read/write their own data
CREATE POLICY "Users can read own data" ON analysis_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data" ON analysis_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read reactor data" ON nuclear_reactor_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert reactor data" ON nuclear_reactor_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read thermal data" ON nuclear_thermal_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert thermal data" ON nuclear_thermal_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage materials" ON nuclear_materials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage maintenance" ON nuclear_maintenance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage compliance" ON nuclear_compliance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage egm data" ON nuclear_egm_data FOR ALL USING (auth.uid() = user_id);

-- Venture config readable by all authenticated users
CREATE POLICY "Authenticated read venture config" ON venture_config FOR SELECT USING (auth.role() = 'authenticated');
