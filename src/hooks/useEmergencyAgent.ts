
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
    
    // Simulate AI analysis of patient data
    setTimeout(() => {
      setAgentState(prev => ({
        ...prev,
        progress: 30,
        message: 'Analyzing images using medical AI models...'
      }));
      
      setTimeout(() => {
        setAgentState(prev => ({
          ...prev,
          progress: 60,
          message: 'Locating nearest trauma centers...',
          location: {
            latitude: 28.6139,
            longitude: 77.2090,
            accuracy: 15,
            address: 'Ring Road, Delhi'
          }
        }));
        
        setTimeout(() => {
          const nearestHospital = {
            name: 'AIIMS Delhi',
            distance: '4.2 km',
            eta: '12 min',
            notified: true,
            orStatus: 'Preparing'
          };
          
          setAgentState(prev => ({
            ...prev,
            progress: 90,
            message: 'Notifying nearest trauma center...',
            nearestHospital
          }));
          
          toast({
            title: 'Hospital Notified',
            description: `${nearestHospital.name} has been notified about incoming trauma patient`,
          });
          
          setTimeout(() => {
            setAgentState(prev => ({
              ...prev,
              status: 'complete',
              progress: 100,
              message: 'Emergency response coordinated',
              currentAction: 'Monitoring patient status during transport'
            }));
            
            setLiveLocation(true);
          }, 1500);
          
        }, 2000);
        
      }, 2000);
      
    }, 2000);
  };

  return { agentState, liveLocation, activateAgent };
};
