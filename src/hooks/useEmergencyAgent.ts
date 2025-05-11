
import { useState, useEffect } from 'react';
import { AgentState } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from './useLocation';

interface PatientTrackingData {
  id: string;
  gender?: string;
  age?: string;
  incidentType?: string;
  addedAt: Date;
  status: 'processing' | 'transferring' | 'hospital' | 'complete';
  hospital?: string;
}

export const useEmergencyAgent = () => {
  const { toast } = useToast();
  const { getCurrentLocation } = useLocation();
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    message: 'Ready to begin assessment',
    progress: 0,
    accuracy: 0
  });
  const [liveLocation, setLiveLocation] = useState<boolean>(false);
  const [recentPatients, setRecentPatients] = useState<PatientTrackingData[]>([]);
  const [currentPatient, setCurrentPatient] = useState<PatientTrackingData | null>(null);

  // Load saved patients from localStorage on initial render
  useEffect(() => {
    const savedPatients = localStorage.getItem('traumalink_recent_patients');
    if (savedPatients) {
      try {
        const parsedPatients = JSON.parse(savedPatients);
        setRecentPatients(parsedPatients);
      } catch (e) {
        console.error('Failed to parse saved patients:', e);
      }
    }
  }, []);

  // Save patients to localStorage whenever recentPatients changes
  useEffect(() => {
    if (recentPatients.length > 0) {
      localStorage.setItem('traumalink_recent_patients', JSON.stringify(recentPatients));
    }
  }, [recentPatients]);

  const activateAgent = (patientData: any) => {
    // Create a new patient tracking entry
    const patientId = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newPatient: PatientTrackingData = {
      id: patientId,
      gender: patientData?.gender || 'Unknown',
      age: patientData?.estimatedAge || 'Unknown',
      incidentType: patientData?.incidentType || 'Medical Emergency',
      addedAt: new Date(),
      status: 'processing'
    };
    
    // Set as current patient
    setCurrentPatient(newPatient);
    
    // Add to recent patients list
    setRecentPatients(prev => [newPatient, ...prev].slice(0, 10)); // Keep last 10 patients
    
    setAgentState({
      status: 'analyzing',
      message: 'Analyzing patient data and images...',
      progress: 10,
      accuracy: 0
    });
    
    getCurrentLocation();
    
    // Simulate AI analysis of patient data with enhanced accuracy
    setTimeout(() => {
      setAgentState(prev => ({
        ...prev,
        progress: 25,
        message: 'Processing images using medical AI models...'
      }));
      
      setTimeout(() => {
        setAgentState(prev => ({
          ...prev,
          progress: 40,
          message: 'Detecting injury patterns and severity...',
          accuracy: 45
        }));
        
        setTimeout(() => {
          setAgentState(prev => ({
            ...prev,
            progress: 55,
            message: 'Cross-referencing with global trauma database...',
            accuracy: 68
          }));
          
          setTimeout(() => {
            setAgentState(prev => ({
              ...prev,
              progress: 70,
              message: 'Locating nearest suitable trauma centers...',
              location: {
                latitude: 28.6139,
                longitude: 77.2090,
                accuracy: 8,
                address: 'Ring Road, Delhi'
              },
              accuracy: 75
            }));
            
            setTimeout(() => {
              const nearestHospital = {
                name: 'AIIMS Delhi',
                distance: '4.2 km',
                eta: '12 min',
                notified: true,
                orStatus: 'Preparing',
                specialties: ['Trauma Surgery', 'Orthopedics', 'Neurosurgery', 'Vascular Surgery'],
                bloodBank: ['A-', 'O-', 'B+', 'AB-'],
                traumaTeam: 'Activated',
                address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, 110029',
                phone: '+91-11-2658-7900',
                email: 'trauma@aiims.edu',
                contacts: [
                  {
                    name: 'Dr. Amit Gupta',
                    role: 'Trauma Team Lead',
                    phone: '+91-11-2658-7901',
                    email: 'trauma.lead@aiims.edu'
                  },
                  {
                    name: 'Dr. Sushma Verma',
                    role: 'Orthopedic Surgeon',
                    phone: '+91-11-2658-7902'
                  },
                  {
                    name: 'Nurse Coordinator',
                    role: 'ER Coordinator',
                    phone: '+91-11-2658-7905'
                  }
                ],
                resources: {
                  traumaBays: 4,
                  operatingRooms: 8,
                  icuBeds: 12,
                  ventilators: 15
                },
                capabilities: {
                  traumaLevel: 'Level 1',
                  hasStrokeUnit: true,
                  hasBurnUnit: true,
                  hasCardiacCath: true,
                  hasPediatricsER: true
                }
              };

              // Add route suggestions
              const routeSuggestions = [
                {
                  type: 'fastest',
                  eta: '12 min',
                  distance: '4.2 km',
                  trafficLevel: 'moderate'
                },
                {
                  type: 'alternate',
                  eta: '15 min',
                  distance: '5.1 km',
                  trafficLevel: 'low'
                },
                {
                  type: 'emergency',
                  eta: '8 min',
                  distance: '4.2 km',
                  trafficLevel: 'low'
                }
              ];
              
              // Update current patient with hospital info
              setCurrentPatient(prev => {
                if (!prev) return null;
                return {
                  ...prev,
                  hospital: nearestHospital.name,
                  status: 'transferring'
                };
              });
              
              // Update recent patients list
              setRecentPatients(prev => {
                const updatedList = [...prev];
                const index = updatedList.findIndex(p => p.id === currentPatient?.id);
                if (index >= 0) {
                  updatedList[index] = {
                    ...updatedList[index],
                    hospital: nearestHospital.name,
                    status: 'transferring'
                  };
                }
                return updatedList;
              });
              
              setAgentState(prev => ({
                ...prev,
                status: 'processing',
                progress: 85,
                message: 'Coordinating with trauma center and ambulance services...',
                nearestHospital,
                routeSuggestions,
                accuracy: 83
              }));
              
              toast({
                title: 'Hospital Notified',
                description: `${nearestHospital.name} trauma team has been activated for incoming patient`,
              });
              
              setTimeout(() => {
                // Update current patient to hospital status
                setCurrentPatient(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    status: 'hospital'
                  };
                });
                
                // Update recent patients list
                setRecentPatients(prev => {
                  const updatedList = [...prev];
                  const index = updatedList.findIndex(p => p.id === currentPatient?.id);
                  if (index >= 0) {
                    updatedList[index] = {
                      ...updatedList[index],
                      status: 'hospital'
                    };
                  }
                  return updatedList;
                });
                
                setAgentState(prev => ({
                  ...prev,
                  status: 'complete',
                  progress: 100,
                  message: 'Emergency response coordinated successfully',
                  currentAction: 'Monitoring patient status during transport',
                  accuracy: 86
                }));
                
                setLiveLocation(true);
                
                toast({
                  title: 'OR-2 Prepared',
                  description: 'Surgical team on standby for immediate intervention',
                });
              }, 1500);
              
            }, 1500);
            
          }, 1500);
          
        }, 1500);
        
      }, 1500);
      
    }, 1500);
  };

  return { 
    agentState, 
    liveLocation, 
    activateAgent, 
    recentPatients, 
    currentPatient 
  };
};
