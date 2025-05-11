
export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

export interface HospitalFacility {
  type: string;
  available: boolean;
  count?: number;
  notes?: string;
}

export interface HospitalDepartment {
  name: string;
  status: 'available' | 'busy' | 'unavailable';
  waitTime?: string;
  doctors?: number;
}

export interface NearestHospital {
  name: string;
  distance: string;
  eta: string;
  notified: boolean;
  orStatus: string;
  specialties?: string[];
  bloodBank?: string[];
  traumaTeam?: string;
  address?: string;
  phone?: string;
  email?: string;
  contacts?: {
    name: string;
    role: string;
    phone?: string;
    email?: string;
  }[];
  resources?: {
    traumaBays: number;
    operatingRooms: number;
    icuBeds: number;
    ventilators: number;
  };
  capabilities?: {
    traumaLevel: string;
    hasStrokeUnit: boolean;
    hasBurnUnit: boolean;
    hasCardiacCath: boolean;
    hasPediatricsER: boolean;
  };
  departments?: HospitalDepartment[];
  facilities?: HospitalFacility[];
  patientCapacity?: {
    total: number;
    current: number;
    available: number;
  };
  lastUpdated?: Date;
}

export interface AgentState {
  status: 'idle' | 'analyzing' | 'processing' | 'complete' | 'error';
  message: string;
  currentAction?: string;
  progress: number;
  location?: Location;
  nearestHospital?: NearestHospital;
  accuracy: number;
  routeSuggestions?: {
    type: 'fastest' | 'alternate' | 'emergency';
    eta: string;
    distance: string;
    trafficLevel: 'low' | 'moderate' | 'heavy';
  }[];
  nearbyHospitals?: NearestHospital[];
}

export interface PatientTrackingInfo {
  id: string;
  gender?: string;
  age?: string;
  incidentType?: string;
  location?: string;
  addedAt: Date;
  status: 'processing' | 'transferring' | 'hospital' | 'complete';
  hospital?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    temperature?: number;
    glucoseLevel?: number;
  };
  treatmentNotes?: string[];
}
