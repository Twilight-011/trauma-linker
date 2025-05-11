
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clipboard, AlertCircle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import ImageUpload from './patient/ImageUpload';
import VitalSigns from './patient/VitalSigns';
import AiAnalysisResults from './patient/AiAnalysisResults';
import { usePatientForm } from '@/hooks/usePatientForm';

const PatientInputForm = () => {
  const {
    form,
    isSubmitting,
    showResults,
    aiAnalysisProgress,
    vitalSigns,
    handleVitalSignChange,
    handleSubmit,
    navigate
  } = usePatientForm();
  
  const [images, setImages] = useState<FileList | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clipboard className="h-5 w-5 mr-2 text-primary" />
          Emergency Patient Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Estimated Gender</Label>
                  <select
                    id="gender"
                    {...form.register("gender")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedAge">Estimated Age</Label>
                  <select
                    id="estimatedAge"
                    {...form.register("estimatedAge")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select Age Range</option>
                    <option value="Infant (0-1)">Infant (0-1 years)</option>
                    <option value="Child (2-12)">Child (2-12 years)</option>
                    <option value="Adolescent (13-17)">Adolescent (13-17 years)</option>
                    <option value="Young Adult (18-35)">Young Adult (18-35 years)</option>
                    <option value="Middle-aged (36-55)">Middle-aged (36-55 years)</option>
                    <option value="Elderly (56+)">Elderly (56+ years)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type</Label>
                <select
                  id="incidentType"
                  {...form.register("incidentType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select Incident Type</option>
                  <option value="Road Traffic Accident">Road Traffic Accident</option>
                  <option value="Road Traffic Accident - Vehicle-Vehicle">Road Traffic Accident - Vehicle-Vehicle</option>
                  <option value="Road Traffic Accident - Vehicle-Pedestrian">Road Traffic Accident - Vehicle-Pedestrian</option>
                  <option value="Road Traffic Accident - Vehicle-Cyclist">Road Traffic Accident - Vehicle-Cyclist</option>
                  <option value="Fall">Fall</option>
                  <option value="Fall - From Height">Fall - From Height</option>
                  <option value="Fall - Same Level">Fall - Same Level</option>
                  <option value="Fall - Stairs">Fall - Stairs</option>
                  <option value="Burn">Burn</option>
                  <option value="Burn - Thermal">Burn - Thermal</option>
                  <option value="Burn - Chemical">Burn - Chemical</option>
                  <option value="Burn - Electrical">Burn - Electrical</option>
                  <option value="Assault">Assault</option>
                  <option value="Assault - Blunt Force">Assault - Blunt Force</option>
                  <option value="Assault - Sharp Object">Assault - Sharp Object</option>
                  <option value="Industrial Accident">Industrial Accident</option>
                  <option value="Industrial Accident - Machinery">Industrial Accident - Machinery</option>
                  <option value="Industrial Accident - Fall">Industrial Accident - Fall</option>
                  <option value="Drowning">Drowning</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Medical Emergency - Cardiac">Medical Emergency - Cardiac</option>
                  <option value="Medical Emergency - Respiratory">Medical Emergency - Respiratory</option>
                  <option value="Medical Emergency - Neurological">Medical Emergency - Neurological</option>
                  <option value="Medical Emergency - Metabolic">Medical Emergency - Metabolic</option>
                  <option value="Crush Injury">Crush Injury</option>
                  <option value="Explosion/Blast Injury">Explosion/Blast Injury</option>
                  <option value="Poisoning/Intoxication">Poisoning/Intoxication</option>
                  <option value="Animal Attack">Animal Attack</option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incidentDetails">Incident Details</Label>
                <Textarea 
                  id="incidentDetails" 
                  {...form.register("incidentDetails")}
                  placeholder="Describe what happened" 
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    {...form.register("location")}
                    placeholder="e.g. NH-8" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationDetails">City/District</Label>
                  <Input 
                    id="locationDetails" 
                    {...form.register("locationDetails")}
                    placeholder="e.g. Gurugram, Haryana" 
                    required
                  />
                </div>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                <h3 className="font-medium text-orange-800 mb-2">On-site Patient Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-1">
                    <Label htmlFor="responsiveness">Responsiveness</Label>
                    <select
                      id="responsiveness"
                      {...form.register("responsiveness")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="responsive">Alert & Responsive</option>
                      <option value="semi-responsive">Semi-Responsive</option>
                      <option value="unresponsive">Unresponsive</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="breathing">Breathing</Label>
                    <select
                      id="breathing"
                      {...form.register("breathing")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="normal">Normal</option>
                      <option value="labored">Labored</option>
                      <option value="absent">Absent/Minimal</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="bleeding">Bleeding</Label>
                    <select
                      id="bleeding"
                      {...form.register("bleeding")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="none">None</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>
                
                <VitalSigns
                  vitalSigns={vitalSigns}
                  onChange={handleVitalSignChange}
                />
                
                <div className="space-y-1">
                  <Label htmlFor="injuryLocation">Injury Location</Label>
                  <select
                    id="injuryLocation"
                    {...form.register("injuryLocation")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select Primary Injury Location</option>
                    <option value="Head/Face">Head/Face</option>
                    <option value="Head - Frontal">Head - Frontal</option>
                    <option value="Head - Temporal">Head - Temporal</option>
                    <option value="Head - Parietal">Head - Parietal</option>
                    <option value="Head - Occipital">Head - Occipital</option>
                    <option value="Face - Orbital">Face - Orbital/Eye</option>
                    <option value="Face - Nasal">Face - Nasal</option>
                    <option value="Face - Maxillary">Face - Maxillary/Cheek</option>
                    <option value="Face - Mandibular">Face - Mandibular/Jaw</option>
                    <option value="Neck">Neck</option>
                    <option value="Neck - Anterior">Neck - Anterior</option>
                    <option value="Neck - Posterior">Neck - Posterior</option>
                    <option value="Neck - Lateral">Neck - Lateral</option>
                    <option value="Chest">Chest</option>
                    <option value="Chest - Sternum">Chest - Sternum</option>
                    <option value="Chest - Right Ribs">Chest - Right Ribs</option>
                    <option value="Chest - Left Ribs">Chest - Left Ribs</option>
                    <option value="Abdomen">Abdomen</option>
                    <option value="Abdomen - Right Upper Quadrant">Abdomen - Right Upper Quadrant</option>
                    <option value="Abdomen - Left Upper Quadrant">Abdomen - Left Upper Quadrant</option>
                    <option value="Abdomen - Right Lower Quadrant">Abdomen - Right Lower Quadrant</option>
                    <option value="Abdomen - Left Lower Quadrant">Abdomen - Left Lower Quadrant</option>
                    <option value="Back">Back</option>
                    <option value="Back - Cervical Spine">Back - Cervical Spine</option>
                    <option value="Back - Thoracic Spine">Back - Thoracic Spine</option>
                    <option value="Back - Lumbar Spine">Back - Lumbar Spine</option>
                    <option value="Back - Sacral Spine">Back - Sacral Spine</option>
                    <option value="Pelvis">Pelvis</option>
                    <option value="Upper Extremities">Upper Extremities</option>
                    <option value="Shoulder - Right">Shoulder - Right</option>
                    <option value="Shoulder - Left">Shoulder - Left</option>
                    <option value="Upper Arm - Right">Upper Arm - Right</option>
                    <option value="Upper Arm - Left">Upper Arm - Left</option>
                    <option value="Elbow - Right">Elbow - Right</option>
                    <option value="Elbow - Left">Elbow - Left</option>
                    <option value="Forearm - Right">Forearm - Right</option>
                    <option value="Forearm - Left">Forearm - Left</option>
                    <option value="Wrist - Right">Wrist - Right</option>
                    <option value="Wrist - Left">Wrist - Left</option>
                    <option value="Hand - Right">Hand - Right</option>
                    <option value="Hand - Left">Hand - Left</option>
                    <option value="Lower Extremities">Lower Extremities</option>
                    <option value="Hip - Right">Hip - Right</option>
                    <option value="Hip - Left">Hip - Left</option>
                    <option value="Thigh - Right">Thigh - Right</option>
                    <option value="Thigh - Left">Thigh - Left</option>
                    <option value="Knee - Right">Knee - Right</option>
                    <option value="Knee - Left">Knee - Left</option>
                    <option value="Lower Leg - Right">Lower Leg - Right</option>
                    <option value="Lower Leg - Left">Lower Leg - Left</option>
                    <option value="Ankle - Right">Ankle - Right</option>
                    <option value="Ankle - Left">Ankle - Left</option>
                    <option value="Foot - Right">Foot - Right</option>
                    <option value="Foot - Left">Foot - Left</option>
                    <option value="Multiple">Multiple Locations</option>
                  </select>
                </div>
                
                <div className="space-y-1 mt-3">
                  <Label htmlFor="physicalFindings">Physical Examination Findings</Label>
                  <Textarea 
                    id="physicalFindings" 
                    {...form.register("physicalFindings")}
                    placeholder="Describe visible injuries, deformities, etc." 
                    rows={3}
                    required
                  />
                </div>
              </div>
              
              <ImageUpload onImagesChange={setImages} />
              
              <AiAnalysisResults
                progress={aiAnalysisProgress}
                showResults={showResults}
              />
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important Notice:</p>
                  <p>All patient data must be handled according to hospital privacy policy and regulations. Images should clearly show injuries without unnecessary exposure.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Submit Assessment'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientInputForm;
