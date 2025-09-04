-- Patient Management Schema - To be created in Supabase
-- This would be implemented using Supabase Database

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(50) UNIQUE NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  incident_type VARCHAR(100),
  description TEXT,
  location TEXT,
  triage_level VARCHAR(10),
  vital_signs JSONB,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  specialties TEXT[],
  capacity JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency cases table  
CREATE TABLE IF NOT EXISTS emergency_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  hospital_id UUID REFERENCES hospitals(id),
  status VARCHAR(50) DEFAULT 'active',
  priority_level VARCHAR(10),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security policies would be added here
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can access their own data" ON patients...