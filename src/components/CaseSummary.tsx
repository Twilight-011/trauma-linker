
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CaseSummary = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Case Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assessment">
          <TabsList className="grid grid-cols-3 mb-3">
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment" className="text-sm space-y-3">
            <p>
              38-year-old male involved in motorcycle accident with a truck. 
              Patient presents with compound fracture of right tibia/fibula with 
              active bleeding and signs of early hypovolemic shock.
            </p>
            <p>
              Vital signs show mild tachycardia (HR 128), borderline hypotension (BP 95/65), 
              and normal oxygen saturation (SpO2 94%). AI analysis confirms compound fracture 
              with 94% confidence.
            </p>
            <p>
              Patient has history of diabetes and hypertension which may complicate management.
              Currently classified as Priority 1 (RED) triage status requiring immediate 
              intervention for hemorrhage control.
            </p>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Completed Actions:</div>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700 space-y-1">
                <li>Primary survey (ABCDE)</li>
                <li>Pressure bandage applied to fracture site</li>
                <li>IV access established (16G, left AC)</li>
                <li>500ml Ringer's Lactate initiated</li>
                <li>Hospital notification sent to AIIMS Delhi</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <div className="font-medium">Pending Actions:</div>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700 space-y-1">
                <li>Splint application for fracture stabilization</li>
                <li>Additional fluid bolus if hypotension worsens</li>
                <li>Pain management (considering medication interactions)</li>
                <li>Serial vital sign assessments during transport</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-2">
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">15:12</div>
              <div className="text-sm font-medium">Incident reported</div>
              <div className="text-xs text-gray-700 mt-0.5">MVA reported via 108 helpline</div>
            </div>
            
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">15:15</div>
              <div className="text-sm font-medium">Team dispatched</div>
              <div className="text-xs text-gray-700 mt-0.5">108-A6 ambulance en route</div>
            </div>
            
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">15:22</div>
              <div className="text-sm font-medium">Arrived on scene</div>
              <div className="text-xs text-gray-700 mt-0.5">Patient found on roadside</div>
            </div>
            
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">15:24</div>
              <div className="text-sm font-medium">TraumaLinker activated</div>
              <div className="text-xs text-gray-700 mt-0.5">AI analysis initiated</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CaseSummary;
