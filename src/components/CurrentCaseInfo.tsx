
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, CalendarClock, Plus, Ambulance, Hospital } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';

const CurrentCaseInfo = () => {
  const { currentPatient, recentPatients, agentState } = useEmergencyAgent();
  const [elapsed, setElapsed] = useState<string>("0 min");
  
  useEffect(() => {
    // Calculate elapsed time if there's a current patient
    if (currentPatient) {
      const timer = setInterval(() => {
        const now = new Date();
        const startTime = new Date(currentPatient.addedAt);
        const diff = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        setElapsed(`${diff} min${diff !== 1 ? 's' : ''}`);
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(timer);
    }
  }, [currentPatient]);
  
  // Use the most recent patient if currentPatient is null
  const displayPatient = currentPatient || (recentPatients.length > 0 ? recentPatients[0] : null);
  
  // Status label and color based on patient status
  const getStatusInfo = () => {
    if (!displayPatient) return { label: "No Active Case", color: "bg-gray-100 text-gray-800" };
    
    switch (displayPatient.status) {
      case 'processing':
        return { label: "Processing", color: "bg-blue-100 text-blue-800" };
      case 'transferring':
        return { label: "Transferring", color: "bg-amber-100 text-amber-800" };
      case 'hospital':
        return { label: "At Hospital", color: "bg-purple-100 text-purple-800" };
      case 'complete':
        return { label: "Complete", color: "bg-green-100 text-green-800" };
      default:
        return { label: "Active Case", color: "bg-red-100 text-red-800" };
    }
  };
  
  const statusInfo = getStatusInfo();

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">
              {displayPatient ? `Case #${displayPatient.id}` : "No Active Case"}
            </h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {displayPatient ? (
                <span>Started {new Date(displayPatient.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({elapsed} ago)</span>
              ) : (
                <span>No ongoing case</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </div>
            <Link to="/new-patient">
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Patient
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="my-3" />

        {displayPatient ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span>Patient</span>
              </div>
              <p className="font-medium">
                {displayPatient.gender}, {displayPatient.age}
              </p>
              <p>ID: {displayPatient.id}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-gray-500">
                <CalendarClock className="h-4 w-4 mr-1" />
                <span>Incident</span>
              </div>
              <p className="font-medium">{displayPatient.incidentType || "Unknown Incident"}</p>
              <p>{agentState?.location?.address || "Location pending..."}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Location</span>
              </div>
              {agentState?.location ? (
                <>
                  <p className="font-medium">{agentState.location.address}</p>
                  <p>
                    {agentState.location.latitude.toFixed(4)}, {agentState.location.longitude.toFixed(4)}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Acquiring location...</p>
                  <p>GPS coordinates pending</p>
                </>
              )}
            </div>

            <div className="space-y-1">
              {displayPatient.hospital ? (
                <>
                  <div className="flex items-center text-gray-500">
                    <Hospital className="h-4 w-4 mr-1" />
                    <span>Hospital</span>
                  </div>
                  <p className="font-medium">{displayPatient.hospital}</p>
                  <p>{agentState?.nearestHospital?.eta || "ETA calculating..."}</p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-gray-500">
                    <Ambulance className="h-4 w-4 mr-1" />
                    <span>Responder</span>
                  </div>
                  <p className="font-medium">Dr. Sharma, Vikas</p>
                  <p>Team: 108-A6</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            <p>No active patient case. Start a new assessment to begin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentCaseInfo;
