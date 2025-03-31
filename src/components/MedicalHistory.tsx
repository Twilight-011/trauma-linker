
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MedicalHistory = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Medical History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pre-existing Conditions</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" /> Asthma
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" /> Hypertension
              </Badge>
              <Badge variant="outline">Diabetes Type 2</Badge>
              <Badge variant="outline">Previous Surgery (Appendectomy)</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Medications</h3>
            <ul className="text-sm space-y-1">
              <li className="flex justify-between">
                <span>Albuterol</span>
                <span className="text-gray-500">2 puffs as needed</span>
              </li>
              <li className="flex justify-between">
                <span>Lisinopril</span>
                <span className="text-gray-500">10mg daily</span>
              </li>
              <li className="flex justify-between">
                <span>Metformin</span>
                <span className="text-gray-500">500mg twice daily</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Allergies</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Penicillin</Badge>
              <Badge variant="destructive">Sulfa Drugs</Badge>
              <Badge variant="outline">Latex (Mild)</Badge>
            </div>
          </div>
          
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Medication Interaction Alert:</p>
              <p>Potential interaction between current medications and emergency trauma protocols. Consider alternative pain management.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
