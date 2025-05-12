
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ChevronRight, Clipboard, Clock, Activity, RefreshCw, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const TriageClassification = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [confidenceScore, setConfidenceScore] = useState(94);
  
  const handleRefresh = () => {
    // In a real app, this would recalculate triage based on latest vitals
    setLastUpdated(new Date());
    // Simulate slight confidence change
    setConfidenceScore(Math.floor(92 + Math.random() * 6));
  };
  
  return (
    <Card className="border-red-500">
      <CardHeader className="pb-2 bg-red-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Triage Classification
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
          <Badge variant="outline" className="ml-2 text-xs">Real-time</Badge>
        </div>
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
            
            <div className="mt-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-700">AI Triage Confidence:</div>
                <div className="flex items-center">
                  <Activity className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600 font-medium">{confidenceScore}%</span>
                </div>
              </div>
              <Progress value={confidenceScore} className="h-1.5 mt-1" />
              
              <div className="font-medium mt-3 text-gray-700">AI Triage Reasoning:</div>
              <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                <li>Open fracture with significant blood loss ({confidenceScore}% confidence)</li>
                <li>Abnormal vital signs: tachycardia, borderline hypotension</li>
                <li>Risk of hypovolemic shock based on injury pattern</li>
                <li>Age and comorbidities increase risk factors</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Recommended Actions</h3>
            <Button variant="ghost" size="sm" className="p-0 h-6">
              <Bell className="h-3 w-3 mr-1" />
              Alert Team
            </Button>
          </div>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <div>
                <p className="font-medium text-sm">Apply pressure bandage & tourniquet</p>
                <p className="text-xs text-gray-500">Control active bleeding from compound fracture</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <div>
                <p className="font-medium text-sm">Fluid resuscitation</p>
                <p className="text-xs text-gray-500">Target SpO2 &gt; 94%</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-800 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <div>
                <p className="font-medium text-sm">Rapid transport to trauma center</p>
                <p className="text-xs text-gray-500">AIIMS Delhi Level 1 Trauma Center</p>
              </div>
            </li>
          </ul>
          
          <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded-md text-xs">
            <div className="font-medium flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-600" />
              Critical Timing
            </div>
            <p className="mt-1 text-gray-600">Golden hour: 35 minutes remaining. Expedite transport.</p>
          </div>
          
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
