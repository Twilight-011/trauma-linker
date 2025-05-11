
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bed, Clock, Activity, User, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';

const HospitalStatistics = () => {
  const { agentState } = useEmergencyAgent();
  const hospital = agentState.nearestHospital;
  
  // If no hospital is selected, show a placeholder
  if (!hospital) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Hospital Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Select a hospital to view statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Sample data - in a real app, this would come from the API
  const waitTimes = {
    er: '15 min',
    triage: '5 min',
    admission: '45 min'
  };
  
  const currentCapacity = {
    total: 250,
    current: 180,
    available: 70
  };
  
  const equipmentStatus = [
    { name: 'CT Scanners', total: 3, available: 2 },
    { name: 'MRI Machines', total: 2, available: 1 },
    { name: 'Operating Rooms', total: 8, available: 3 },
    { name: 'ICU Beds', total: 24, available: 7 }
  ];
  
  const staffing = {
    doctors: 45,
    nurses: 120,
    technicians: 35,
    onDuty: '85%'
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Hospital Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Current Wait Times
            </h3>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="bg-blue-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">Emergency</p>
                <p className="font-medium">{waitTimes.er}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">Triage</p>
                <p className="font-medium">{waitTimes.triage}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">Admission</p>
                <p className="font-medium">{waitTimes.admission}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              Bed Capacity
            </h3>
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1">
                <span>{currentCapacity.current} occupied</span>
                <span>{currentCapacity.available} available</span>
              </div>
              <Progress value={(currentCapacity.current / currentCapacity.total) * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                Total Capacity: {currentCapacity.total} beds
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Equipment Status
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {equipmentStatus.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-xs">{item.name}</span>
                  <Badge variant={item.available > 0 ? "outline" : "destructive"} className="text-xs">
                    {item.available}/{item.total}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Current Staffing
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>Doctors</span>
                <span className="font-medium">{staffing.doctors}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>Nurses</span>
                <span className="font-medium">{staffing.nurses}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>Technicians</span>
                <span className="font-medium">{staffing.technicians}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>Staff on Duty</span>
                <span className="font-medium">{staffing.onDuty}</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalStatistics;
