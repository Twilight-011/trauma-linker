-- Create patients table
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

-- Create hospitals table
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

-- Create emergency cases table  
CREATE TABLE IF NOT EXISTS emergency_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  hospital_id UUID REFERENCES hospitals(id),
  status VARCHAR(50) DEFAULT 'active',
  priority_level VARCHAR(10),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Insert test hospitals
INSERT INTO hospitals (name, address, phone, latitude, longitude, specialties, capacity) VALUES
('Central Medical Center', '123 Main St, City Center', '+1-555-0123', 40.7128, -74.0060, ARRAY['Emergency Medicine', 'Trauma Surgery', 'Cardiology'], '{"total_beds": 200, "available_beds": 45, "icu_beds": 20, "emergency_beds": 15}'),
('St. Mary''s Hospital', '456 Oak Ave, Downtown', '+1-555-0456', 40.7589, -73.9851, ARRAY['General Surgery', 'Orthopedics', 'Neurology'], '{"total_beds": 150, "available_beds": 32, "icu_beds": 12, "emergency_beds": 8}'),
('Metro General Hospital', '789 Pine Blvd, Metro District', '+1-555-0789', 40.7831, -73.9712, ARRAY['Trauma Surgery', 'Emergency Medicine', 'Burn Unit'], '{"total_beds": 300, "available_beds": 67, "icu_beds": 25, "emergency_beds": 20}');

-- Insert test patients
INSERT INTO patients (case_id, age, gender, incident_type, description, location, triage_level, vital_signs, ai_analysis) VALUES
('TC-2024-001', 35, 'Male', 'Motor Vehicle Accident', 'Patient involved in high-speed collision, conscious and alert', 'Highway 101, Mile Marker 45', 'Red', 
'{"heartRate": 110, "bloodPressure": "90/60", "spO2": 94, "respRate": 22, "gcs": 14, "temperature": 98.6}',
'{"confidence": 89, "injuries": [{"name": "Compound fracture - right tibia", "severity": "critical", "confidence": 94}], "recommendations": ["Immediate IV access", "Blood type and crossmatch", "Orthopedic surgery consult"]}'),

('TC-2024-002', 28, 'Female', 'Fall from Height', 'Construction worker fell from 2nd floor scaffolding', 'Construction Site, 5th & Main', 'Yellow', 
'{"heartRate": 95, "bloodPressure": "120/80", "spO2": 98, "respRate": 18, "gcs": 15, "temperature": 98.2}',
'{"confidence": 76, "injuries": [{"name": "Possible concussion", "severity": "moderate", "confidence": 78}], "recommendations": ["CT scan of head", "Neurological monitoring", "Pain management"]}'),

('TC-2024-003', 42, 'Male', 'Chest Pain', 'Patient experiencing severe chest pain with radiation to left arm', 'Downtown Office Building', 'Red', 
'{"heartRate": 125, "bloodPressure": "160/95", "spO2": 96, "respRate": 24, "gcs": 15, "temperature": 99.1}',
'{"confidence": 92, "injuries": [{"name": "Possible myocardial infarction", "severity": "critical", "confidence": 92}], "recommendations": ["12-lead ECG", "Cardiac enzymes", "Cardiology consult", "Aspirin administration"]}');

-- Insert emergency cases
INSERT INTO emergency_cases (patient_id, hospital_id, status, priority_level) 
SELECT p.id, h.id, 'active', 
  CASE 
    WHEN p.triage_level = 'Red' THEN 'critical'
    WHEN p.triage_level = 'Yellow' THEN 'urgent'
    ELSE 'standard'
  END
FROM patients p
CROSS JOIN hospitals h
WHERE h.name = 'Central Medical Center'
LIMIT 3;

-- Enable Row Level Security (for future auth implementation)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_cases ENABLE ROW LEVEL SECURITY;

-- Create public access policies for testing (remove when auth is implemented)
CREATE POLICY "Public read access for hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public read access for patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public read access for emergency_cases" ON emergency_cases FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();