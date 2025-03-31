
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
              42-year-old male involved in high-speed MVA with frontal impact. 
              Patient presents with respiratory distress, chest pain, and decreased
              breath sounds on the right side.
            </p>
            <p>
              Vital signs show tachycardia (HR 142), hypotension (BP 90/60), 
              tachypnea (RR 24), and mild hypoxia (SpO2 92%). AI analysis suggests
              pneumothorax with 92% confidence.
            </p>
            <p>
              Patient has history of asthma and hypertension which may complicate
              management. Currently classified as Priority 1 (RED) triage status
              requiring immediate intervention.
            </p>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Completed Actions:</div>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700 space-y-1">
                <li>Primary survey (ABCDE)</li>
                <li>Oxygen administration via non-rebreather mask</li>
                <li>IV access established (18G, right AC)</li>
                <li>ECG monitoring initiated</li>
                <li>Hospital notification sent</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <div className="font-medium">Pending Actions:</div>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700 space-y-1">
                <li>Needle decompression if condition deteriorates</li>
                <li>Fluid resuscitation as needed</li>
                <li>Pain management (considering medication interactions)</li>
                <li>Continuous vital sign monitoring during transport</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-2">
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">14:32</div>
              <div className="text-sm font-medium">Incident reported</div>
              <div className="text-xs text-gray-700 mt-0.5">MVA reported by bystander</div>
            </div>
            
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">14:35</div>
              <div className="text-sm font-medium">Team dispatched</div>
              <div className="text-xs text-gray-700 mt-0.5">Alpha-3 team en route</div>
            </div>
            
            <div className="relative pl-5 border-l border-gray-200">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">14:38</div>
              <div className="text-sm font-medium">Arrived on scene</div>
              <div className="text-xs text-gray-700 mt-0.5">Patient found in vehicle</div>
            </div>
            
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></div>
              <div className="text-xs text-gray-500">14:40</div>
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
