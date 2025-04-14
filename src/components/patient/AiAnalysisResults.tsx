
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, Hospital, Map, Ambulance } from 'lucide-react';

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
            <Label>AI Analysis in Progress</Label>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {showResults && (
        <div className="space-y-4 border border-green-200 bg-green-50 p-4 rounded-md">
          <h3 className="font-medium text-green-800">AI Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Detected Injuries:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li className="flex justify-between">
                  <span>Open Fracture - Right Tibia</span>
                  <span className="font-medium text-red-600">94%</span>
                </li>
                <li className="flex justify-between">
                  <span>Traumatic Head Injury</span>
                  <span className="font-medium text-red-600">89%</span>
                </li>
                <li className="flex justify-between">
                  <span>Internal Hemorrhage</span>
                  <span className="font-medium text-yellow-600">67%</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recommended Actions:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>Immediate hemorrhage control</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>C-spine immobilization</span>
                </li>
                <li className="flex items-start gap-1 text-red-700">
                  <span>●</span>
                  <span>Apply pressure bandage & tourniquet</span>
                </li>
              </ul>
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
