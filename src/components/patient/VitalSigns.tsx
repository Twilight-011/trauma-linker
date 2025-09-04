import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Heart, Thermometer, Gauge } from 'lucide-react';

interface VitalSignsProps {
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    spO2: string;
    respRate: string;
    temperature: string;
    gcs: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VitalSigns = ({ vitalSigns, onChange }: VitalSignsProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              Heart Rate (bpm)
            </Label>
            <Input
              id="heartRate"
              name="heartRate"
              type="number"
              placeholder="e.g. 72"
              value={vitalSigns.heartRate}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodPressure" className="flex items-center">
              <Gauge className="h-4 w-4 mr-1 text-blue-500" />
              Blood Pressure
            </Label>
            <Input
              id="bloodPressure"
              name="bloodPressure"
              placeholder="e.g. 120/80"
              value={vitalSigns.bloodPressure}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spO2">
              SpO2 (%)
            </Label>
            <Input
              id="spO2"
              name="spO2"
              type="number"
              placeholder="e.g. 98"
              value={vitalSigns.spO2}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respRate">
              Respiratory Rate (bpm)
            </Label>
            <Input
              id="respRate"
              name="respRate"
              type="number"
              placeholder="e.g. 16"
              value={vitalSigns.respRate}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1 text-orange-500" />
              Temperature (°C)
            </Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g. 37.0"
              value={vitalSigns.temperature}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gcs">
              Glasgow Coma Scale
            </Label>
            <Input
              id="gcs"
              name="gcs"
              type="number"
              min="3"
              max="15"
              placeholder="e.g. 15"
              value={vitalSigns.gcs}
              onChange={onChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSigns;