
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, Clock, PlusCircle, History, RefreshCw, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MedicalHistory = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  
  const handleRefresh = () => {
    // In a real app, this would fetch latest medical records
    setLastUpdated(new Date());
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Medical History
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
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pre-existing Conditions</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" /> Tuberculosis (Treated)
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" /> Hypertension
              </Badge>
              <Badge variant="outline">Diabetes Type 2</Badge>
              <Badge variant="outline">Previous Surgery (Hernia Repair)</Badge>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Medications</h3>
              <Dialog open={medicationDialogOpen} onOpenChange={setMedicationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Pill className="h-3 w-3 mr-1" /> Manage Medications
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Medications</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Current Medications</h3>
                      <div className="space-y-2">
                        {[
                          { name: "Metformin", dosage: "500mg twice daily", critical: false },
                          { name: "Telmisartan", dosage: "40mg daily", critical: true },
                          { name: "Aspirin", dosage: "75mg daily", critical: true },
                          { name: "Atorvastatin", dosage: "20mg daily", critical: false }
                        ].map((med, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium">{med.name}</div>
                              <div className="text-xs text-gray-500">{med.dosage}</div>
                            </div>
                            <div className="flex gap-2">
                              {med.critical && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                  Critical
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Adjust
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Medication History</h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Amoxicillin</span>
                            <span className="text-gray-500">Ended Apr 8, 2025</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">
                            500mg three times daily (10 day course)
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Prednisone</span>
                            <span className="text-gray-500">Ended Jan 15, 2025</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">
                            Taper course for inflammation (2 weeks)
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Medication
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <ul className="text-sm space-y-1">
              <li className="flex justify-between">
                <span>Metformin</span>
                <span className="text-gray-500">500mg twice daily</span>
              </li>
              <li className="flex justify-between">
                <span>Telmisartan</span>
                <span className="text-gray-500">40mg daily</span>
              </li>
              <li className="flex justify-between">
                <span>Aspirin</span>
                <span className="text-gray-500">75mg daily</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => setMedicationDialogOpen(true)}>
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Medication
            </Button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Allergies</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Cephalosporins</Badge>
              <Badge variant="destructive">Iodine</Badge>
              <Badge variant="outline">NSAIDs (Mild)</Badge>
            </div>
          </div>
          
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Medication Interaction Alert:</p>
              <p>Potential interaction between Aspirin and emergency trauma protocols. Consider alternative blood thinning management.</p>
            </div>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-500">Previous Hospital Visits</h3>
              <Button variant="ghost" size="sm" className="h-6 p-0">
                <History className="h-3 w-3 mr-1" />
                View All
              </Button>
            </div>
            <ul className="mt-1 space-y-2">
              <li className="text-xs p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">AIIMS Delhi</span>
                  <span className="text-gray-500">Mar 15, 2025</span>
                </div>
                <p className="text-gray-600 mt-0.5">Diabetic follow-up, HbA1c: 7.2%</p>
              </li>
              <li className="text-xs p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Max Hospital</span>
                  <span className="text-gray-500">Jan 03, 2025</span>
                </div>
                <p className="text-gray-600 mt-0.5">Respiratory infection, prescribed antibiotics</p>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
