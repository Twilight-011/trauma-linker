
import { useState } from 'react';
import { AgentState } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from './useLocation';

export const useEmergencyAgent = () => {
  const { toast } = useToast();
  const { getCurrentLocation } = useLocation();
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    message: 'Ready to begin assessment',
    progress: 0
  });
  const [liveLocation, setLiveLocation] = useState<boolean>(false);

  const activateAgent = (patientData: any) => {
    setAgentState({
      status: 'analyzing',
      message: 'Analyzing patient data and images...',
      progress: 10
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
          message: 'Detecting injury patterns and severity...'
        }));
        
        setTimeout(() => {
          setAgentState(prev => ({
            ...prev,
            progress: 55,
            message: 'Cross-referencing with global trauma database...',
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
              }
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
                traumaTeam: 'Activated'
              };
              
              setAgentState(prev => ({
                ...prev,
                status: 'processing',
                progress: 85,
                message: 'Coordinating with trauma center and ambulance services...',
                nearestHospital
              }));
              
              toast({
                title: 'Hospital Notified',
                description: `${nearestHospital.name} trauma team has been activated for incoming patient`,
              });
              
              setTimeout(() => {
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

  return { agentState, liveLocation, activateAgent };
};
