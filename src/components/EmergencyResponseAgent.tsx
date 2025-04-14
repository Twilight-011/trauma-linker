
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, MapPin, Hospital, AlertTriangle, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AgentState {
  status: 'idle' | 'analyzing' | 'processing' | 'complete' | 'error';
  message: string;
  currentAction?: string;
  progress: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  nearestHospital?: {
    name: string;
    distance: string;
    eta: string;
    notified: boolean;
    orStatus: string;
  };
}

const EmergencyResponseAgent = () => {
  const { toast } = useToast();
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    message: 'Ready to begin assessment',
    progress: 0
  });
  const [liveLocation, setLiveLocation] = useState<boolean>(false);

  // Simulate agent activation when patient data is submitted
  useEffect(() => {
    // Listen for custom event when patient form is submitted
    const handlePatientDataSubmitted = (event: CustomEvent) => {
      const patientData = event.detail;
      activateAgent(patientData);
    };

    document.addEventListener('patientDataSubmitted', handlePatientDataSubmitted as EventListener);
    
    return () => {
      document.removeEventListener('patientDataSubmitted', handlePatientDataSubmitted as EventListener);
    };
  }, []);

  // Function to start the agent workflow
  const activateAgent = (patientData: any) => {
    // Step 1: Start analyzing
    setAgentState({
      status: 'analyzing',
      message: 'Analyzing patient data and images...',
      progress: 10
    });
    
    // Simulate getting user's location
    getCurrentLocation();
    
    // Simulate AI analysis of patient data
    setTimeout(() => {
      setAgentState(prev => ({
        ...prev,
        progress: 30,
        message: 'Analyzing images using medical AI models...'
      }));
      
      // Simulate finding nearest hospitals
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
        
        // Simulate notifying hospital
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
          
          // Complete the process
          setTimeout(() => {
            setAgentState(prev => ({
              ...prev,
              status: 'complete',
              progress: 100,
              message: 'Emergency response coordinated',
              currentAction: 'Monitoring patient status during transport'
            }));
            
            // Enable live location tracking
            setLiveLocation(true);
          }, 1500);
          
        }, 2000);
        
      }, 2000);
      
    }, 2000);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentState(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }
          }));
          
          // Here you would reverse geocode to get address
          // For demo purposes, we're using a placeholder
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location. Please enable location services.',
            variant: 'destructive'
          });
        }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className={agentState.status === 'idle' ? 'border-dashed border-gray-300' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          Emergency Response Agent
          {agentState.status !== 'idle' && (
            <Badge variant={agentState.status === 'complete' ? 'success' : 'default'} 
                  className="ml-2">
              {agentState.status === 'analyzing' || agentState.status === 'processing' ? 'Active' : 
               agentState.status === 'complete' ? 'Complete' : 
               agentState.status === 'error' ? 'Error' : 'Ready'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {agentState.status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
            <Bot className="h-12 w-12 mb-3 text-gray-400" />
            <p>The emergency agent will activate when you submit patient data</p>
            <p className="text-sm mt-2">It will coordinate hospital notification, transport, and provide real-time updates</p>
          </div>
        )}
        
        {(agentState.status === 'analyzing' || agentState.status === 'processing') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <Loader2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{agentState.message}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${agentState.progress}%` }}></div>
                </div>
              </div>
            </div>
            
            {agentState.location && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-xs text-gray-600">
                      {agentState.location.address || `${agentState.location.latitude.toFixed(4)}, ${agentState.location.longitude.toFixed(4)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {agentState.nearestHospital && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Hospital className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Nearest Trauma Center</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs">{agentState.nearestHospital.name}</p>
                      <p className="text-xs font-medium">ETA: {agentState.nearestHospital.eta}</p>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {agentState.nearestHospital.notified ? 'Hospital notified' : 'Contacting hospital...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {agentState.status === 'complete' && (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              <AlertTitle>Emergency Response Activated</AlertTitle>
              <AlertDescription>
                AIIMS Delhi has prepared OR-2 for incoming trauma patient. Estimated arrival: 12 minutes.
              </AlertDescription>
            </Alert>
            
            {liveLocation && (
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-red-500" />
                    Live Location Tracking
                  </p>
                  <span className="text-xs text-green-600 animate-pulse">Active</span>
                </div>
                <div className="aspect-video bg-gray-100 rounded relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Live map would be displayed here</p>
                    <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
                      <MapPin className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Current speed: 42 km/h</span>
                  <span>ETA: 8 min remaining</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {agentState.status === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {agentState.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyResponseAgent;
