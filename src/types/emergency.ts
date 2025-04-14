
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
}

export interface AgentState {
  status: 'idle' | 'analyzing' | 'processing' | 'complete' | 'error';
  message: string;
  currentAction?: string;
  progress: number;
  location?: Location;
  nearestHospital?: NearestHospital;
}
