
export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
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
}
