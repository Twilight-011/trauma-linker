
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Thermometer } from 'lucide-react';

interface VitalSignsProps {
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    respRate: string;
    spO2: string;
    temperature: string;
    gcs: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VitalSigns = ({ vitalSigns, onChange }: VitalSignsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="w-full mb-3">
          <Activity className="mr-2 h-4 w-4" />
          Record Vital Signs
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Patient Vital Signs</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              <span>Heart Rate (BPM)</span>
            </div>
            <Input
              name="heartRate"
              type="number"
              placeholder="e.g. 80"
              className="w-24"
              value={vitalSigns.heartRate}
              onChange={onChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500" />
              <span>Blood Pressure</span>
            </div>
            <Input
              name="bloodPressure"
              placeholder="e.g. 120/80"
              className="w-24"
              value={vitalSigns.bloodPressure}
              onChange={onChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-purple-500" />
              <span>Respiratory Rate</span>
            </div>
            <Input
              name="respRate"
              type="number"
              placeholder="e.g. 16"
              className="w-24"
              value={vitalSigns.respRate}
              onChange={onChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-indigo-500" />
              <span>SpO2 (%)</span>
            </div>
            <Input
              name="spO2"
              type="number"
              placeholder="e.g. 98"
              className="w-24"
              value={vitalSigns.spO2}
              onChange={onChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-orange-500" />
              <span>Temperature (°C)</span>
            </div>
            <Input
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g. 37.0"
              className="w-24"
              value={vitalSigns.temperature}
              onChange={onChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-gray-500" />
              <span>GCS (3-15)</span>
            </div>
            <Input
              name="gcs"
              type="number"
              min="3"
              max="15"
              placeholder="e.g. 15"
              className="w-24"
              value={vitalSigns.gcs}
              onChange={onChange}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VitalSigns;
