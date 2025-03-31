
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ChevronRight, Clipboard } from 'lucide-react';

const TriageClassification = () => {
  return (
    <Card className="border-red-500">
      <CardHeader className="pb-2 bg-red-50">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Triage Classification
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[auto,1fr] border-b">
          <div className="p-4 bg-red-600 text-white font-bold text-center flex flex-col justify-center">
            <span className="text-2xl">P1</span>
            <span className="text-xs">RED</span>
          </div>
          <div className="p-4">
            <h3 className="font-medium">Immediate Life-Threatening</h3>
            <p className="text-sm text-gray-500">Requires immediate medical attention within minutes</p>
            
            <div className="mt-3 text-sm text-gray-700">
              <div className="font-medium mb-1">AI Triage Reasoning:</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Suspected tension pneumothorax (92% confidence)</li>
                <li>Abnormal vital signs: tachycardia, hypotension</li>
                <li>Respiratory distress with decreasing SpO2</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recommended Actions</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <div>
                <p className="font-medium text-sm">Immediate needle decompression</p>
                <p className="text-xs text-gray-500">Second intercostal space, midclavicular line</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <div>
                <p className="font-medium text-sm">Oxygen supplementation</p>
                <p className="text-xs text-gray-500">Target SpO2 > 94%</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <div>
                <p className="font-medium text-sm">Rapid transport to trauma center</p>
                <p className="text-xs text-gray-500">Consider aeromedical evacuation if available</p>
              </div>
            </li>
          </ul>
          
          <button className="mt-4 w-full flex items-center justify-center text-sm font-medium p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
            <Clipboard className="h-4 w-4 mr-1" />
            View Full Protocol
            <ChevronRight className="h-4 w-4 ml-auto" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TriageClassification;
