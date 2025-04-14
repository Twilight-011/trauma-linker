
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import LiveLocationTracker from './LiveLocationTracker';
import HospitalInfo from './HospitalInfo';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';

const EmergencyResponseAgent = () => {
  const { agentState, liveLocation, activateAgent } = useEmergencyAgent();

  useEffect(() => {
    const handlePatientDataSubmitted = (event: CustomEvent) => {
      const patientData = event.detail;
      activateAgent(patientData);
    };

    document.addEventListener('patientDataSubmitted', handlePatientDataSubmitted as EventListener);
    return () => {
      document.removeEventListener('patientDataSubmitted', handlePatientDataSubmitted as EventListener);
    };
  }, [activateAgent]);

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
              <HospitalInfo hospital={agentState.nearestHospital} />
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
            
            {liveLocation && <LiveLocationTracker />}
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
