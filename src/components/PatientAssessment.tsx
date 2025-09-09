
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle } from 'lucide-react';
// Real medical dataset images
import realFracture from '@/assets/real-fracture.jpg';
import realWound from '@/assets/real-wound.jpg';
import realBurn from '@/assets/real-burn.jpg';
import realChestTrauma from '@/assets/real-chest-trauma.jpg';
import realHeadTrauma from '@/assets/real-head-trauma.jpg';

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
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    spO2: 98,
    temperature: 37.2,
    respiratoryRate: 16,
    gcs: 15
  });

  const medicalImages = [
    { name: 'Fracture X-ray', type: 'fracture', src: realFracture },
    { name: 'Wound Assessment', type: 'wound', src: realWound },
    { name: 'Burn Injury', type: 'burn', src: realBurn },
    { name: 'Chest Trauma', type: 'chest-trauma', src: realChestTrauma },
    { name: 'Head Trauma', type: 'head-trauma', src: realHeadTrauma }
  ];

  // Simulate real-time vitals updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        spO2: Math.max(95, Math.min(100, prev.spO2 + (Math.random() - 0.5) * 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusFromValue = (name: string, value: any): VitalStatus => {
    switch (name) {
      case 'Heart Rate':
        const hr = typeof value === 'number' ? value : parseInt(value);
        if (hr > 120 || hr < 50) return 'critical';
        if (hr > 100 || hr < 60) return 'warning';
        return 'normal';
      case 'SpO2':
        const spo2 = typeof value === 'number' ? value : parseInt(value);
        if (spo2 < 90) return 'critical';
        if (spo2 < 95) return 'warning';
        return 'normal';
      case 'GCS':
        const gcs = typeof value === 'number' ? value : parseInt(value);
        if (gcs < 9) return 'critical';
        if (gcs < 13) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Patient Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Medical Images Gallery */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold mb-3 text-blue-800">Medical Images - Real Dataset</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {medicalImages.map((image) => (
              <div
                key={image.type}
                className="flex flex-col items-center p-2 border rounded-lg hover:shadow-md transition-shadow"
              >
                <img 
                  src={image.src} 
                  alt={image.name} 
                  className="w-16 h-16 object-cover rounded mb-1" 
                />
                <span className="text-xs text-center">{image.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vital Signs Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <VitalSign 
            name="Heart Rate" 
            value={Math.round(vitals.heartRate)} 
            unit="bpm" 
            status={getStatusFromValue('Heart Rate', vitals.heartRate)} 
          />
          <VitalSign 
            name="Blood Pressure" 
            value={parseInt(vitals.bloodPressure.split('/')[0])} 
            unit={`/${vitals.bloodPressure.split('/')[1]}`} 
            status="normal" 
          />
          <VitalSign 
            name="SpO2" 
            value={Math.round(vitals.spO2)} 
            unit="%" 
            status={getStatusFromValue('SpO2', vitals.spO2)} 
          />
          <VitalSign 
            name="Resp. Rate" 
            value={vitals.respiratoryRate} 
            unit="bpm" 
            status="normal" 
          />
          <VitalSign 
            name="Temperature" 
            value={vitals.temperature} 
            unit="°C" 
            status="normal" 
          />
          <VitalSign 
            name="GCS" 
            value={vitals.gcs} 
            unit="/15" 
            status={getStatusFromValue('GCS', vitals.gcs)} 
          />
        </div>

        {/* Alert for concerning vitals */}
        {(getStatusFromValue('Heart Rate', vitals.heartRate) === 'critical' || 
          getStatusFromValue('SpO2', vitals.spO2) === 'critical') && (
          <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Critical Vital Signs Detected</p>
              <p>Immediate medical attention required</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAssessment;
