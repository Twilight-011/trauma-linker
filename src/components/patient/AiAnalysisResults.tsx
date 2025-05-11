
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, Hospital, Map, Ambulance, Activity, BarChart3 } from 'lucide-react';

interface AiAnalysisResultsProps {
  progress: number;
  showResults: boolean;
}

const AiAnalysisResults = ({ progress, showResults }: AiAnalysisResultsProps) => {
  if (progress === 0) return null;

  return (
    <div className="space-y-4">
      {!showResults && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="flex items-center">
              <Activity className="h-4 w-4 mr-1 text-blue-600" />
              AI Analysis in Progress
            </Label>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress > 30 && (
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Data preparation</span>
              <span>Model inference</span>
              <span>Validation</span>
            </div>
          )}
        </div>
      )}
      
      {showResults && (
        <div className="space-y-4 border border-green-200 bg-green-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-green-800 flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              AI Analysis Results
            </h3>
            <span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded-full">
              86% Confidence
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Detected Injuries:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li className="flex justify-between">
                  <span>Open Fracture - Right Tibia</span>
                  <span className="font-medium text-red-600">96%</span>
                </li>
                <li className="flex justify-between">
                  <span>Traumatic Head Injury - Right Temporal</span>
                  <span className="font-medium text-red-600">92%</span>
                </li>
                <li className="flex justify-between">
                  <span>Possible Internal Hemorrhage</span>
                  <span className="font-medium text-yellow-600">82%</span>
                </li>
                <li className="flex justify-between">
                  <span>Pelvic Instability</span>
                  <span className="font-medium text-yellow-600">79%</span>
                </li>
                <li className="flex justify-between">
                  <span>Nerve Damage - Lower Extremity</span>
                  <span className="font-medium text-yellow-600">76%</span>
                </li>
              </ul>
              
              <div className="mt-2 text-xs text-gray-500">
                <p>AI Model: TraumaDetect v4.2</p>
                <p>Dataset: 1.2M global trauma cases</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recommended Actions:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>Immediate hemorrhage control - apply tourniquet above fracture site</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>C-spine immobilization - probable head injury</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>Secure open fracture with sterile pressure bandage</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>IV access - two large-bore (16G) lines</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>Fluid resuscitation - crystalloids 20ml/kg bolus</span>
                </li>
              </ul>
              
              <div className="mt-2 p-1.5 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="font-medium text-blue-800">Differential Diagnoses:</p>
                <p className="text-blue-700">Hemorrhagic shock, Compound fracture, Compartment syndrome</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recommended Facility:</h4>
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Hospital className="h-4 w-4 mr-1 text-red-600" />
                    AIIMS Delhi
                  </h3>
                  <p className="text-xs text-gray-500">Level 1 Trauma Center</p>
                  <p className="text-xs text-gray-600 mt-1">Orthopedic Surgery & Neurosurgery Available</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    <Map className="h-3 w-3 inline mr-1" />
                    4.2 km
                  </p>
                  <p className="text-xs font-medium text-green-600">
                    <Ambulance className="h-3 w-3 inline mr-1" />
                    ETA: 12 min
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Blood Bank: A-, O- Available</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2 text-xs flex items-center justify-center">
                <Hospital className="h-3 w-3 mr-1" />
                Notify Hospital
                <ChevronRight className="h-3 w-3 ml-auto" />
              </Button>
            </div>
          </div>
          
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Critical Alert:</p>
              <p>Patient requires immediate transfer to trauma center. Estimated survival probability decreases by 12% for every 10 minute delay in treatment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAnalysisResults;
