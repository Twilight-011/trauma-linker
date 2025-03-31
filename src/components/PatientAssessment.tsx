
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Activity, AlertTriangle } from 'lucide-react';

type VitalStatus = 'normal' | 'warning' | 'critical';

interface VitalSignProps {
  name: string;
  value: number;
  unit: string;
  status: VitalStatus;
}

const VitalSign = ({ name, value, unit, status }: VitalSignProps) => {
  let statusColor = 'text-green-500';
  let animationClass = '';
  
  if (status === 'warning') statusColor = 'text-yellow-500';
  if (status === 'critical') {
    statusColor = 'text-red-500';
    animationClass = 'animate-pulse';
  }

  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{name}</span>
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold ${statusColor} ${animationClass}`}>{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
};

const PatientAssessment = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Patient Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Camera className="h-4 w-4 mr-1" />
                <span>AI Image Analysis</span>
              </div>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" />

            <div className="p-3 bg-gray-100 rounded-lg mt-4">
              <div className="text-sm font-medium mb-2">AI Detection Results:</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Suspected Compound Fracture</span>
                  <span className="font-medium text-red-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tibia/Fibula Fracture</span>
                  <span className="font-medium text-red-600">91%</span>
                </div>
                <div className="flex justify-between">
                  <span>Internal Hemorrhage</span>
                  <span className="font-medium text-yellow-600">67%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3 vital-container">
              <VitalSign name="Heart Rate" value={128} unit="bpm" status="warning" />
              <VitalSign name="Blood Pressure" value={95} unit="/65" status="warning" />
              <VitalSign name="SpO2" value={94} unit="%" status="warning" />
              <VitalSign name="Resp. Rate" value={22} unit="bpm" status="warning" />
              <VitalSign name="Temperature" value={37.2} unit="°C" status="normal" />
              <VitalSign name="GCS" value={14} unit="/15" status="normal" />
            </div>

            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Critical Alert:</p>
                <p>Patient showing signs of hypovolemic shock. Open fracture with active bleeding requires immediate attention and stabilization.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAssessment;
