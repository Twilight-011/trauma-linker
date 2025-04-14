import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Clipboard, AlertCircle, Thermometer, Activity, Heart, Map, Hospital, ChevronRight, Ambulance } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const PatientInputForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0);
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: '',
    bloodPressure: '',
    respRate: '',
    spO2: '',
    temperature: '',
    gcs: '',
  });
  
  const form = useForm({
    defaultValues: {
      // Empty default values to ensure the form context is initialized properly
    }
  });
  
  const [patientData, setPatientData] = useState({
    gender: '',
    estimatedAge: '',
    incidentType: '',
    incidentDetails: '',
    location: '',
    locationDetails: '',
    responsiveness: 'responsive', // responsive, semi-responsive, unresponsive
    breathing: 'normal', // normal, labored, absent
    bleeding: 'none', // none, mild, moderate, severe
    injuryLocation: '',
    physicalFindings: '',
  });
  
  const [images, setImages] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([
    { name: 'AIIMS Delhi', distance: '4.2 km', eta: '12 min', level: 'Level 1 Trauma Center', availability: true },
    { name: 'Safdarjung Hospital', distance: '5.8 km', eta: '18 min', level: 'Level 2 Trauma Center', availability: true },
    { name: 'Max Super Speciality Hospital', distance: '7.1 km', eta: '22 min', level: 'Level 2 Trauma Center', availability: false },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value,
    });
  };
  
  const handleVitalSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitalSigns({
      ...vitalSigns,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setImages(files);
    
    // Create preview URLs
    const newPreviewUrls: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });
    
    setPreviewUrls(newPreviewUrls);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create a video element to show the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create a modal to show the stream and capture button
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white p-4 rounded-lg flex flex-col items-center max-w-xl';
      
      const videoContainer = document.createElement('div');
      videoContainer.className = 'w-full h-64 relative overflow-hidden bg-gray-900 rounded-lg';
      videoContainer.appendChild(video);
      
      const captureBtn = document.createElement('button');
      captureBtn.className = 'mt-4 px-4 py-2 bg-primary text-white rounded-lg';
      captureBtn.textContent = 'Capture Photo';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg';
      closeBtn.textContent = 'Cancel';
      
      modalContent.appendChild(videoContainer);
      modalContent.appendChild(captureBtn);
      modalContent.appendChild(closeBtn);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Handle capture button click
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);
        
        // Convert to blob and create a file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const dt = new DataTransfer();
            dt.items.add(file);
            
            // Update state
            setImages(dt.files);
            
            const url = URL.createObjectURL(blob);
            setPreviewUrls([...previewUrls, url]);
            
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(modal);
          }
        }, 'image/jpeg');
      };
      
      // Handle close button click
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    if (images) {
      const dt = new DataTransfer();
      Array.from(images).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setImages(dt.files.length > 0 ? dt.files : null);
    }
  };

  const simulateAiAnalysis = () => {
    setShowResults(false);
    setAiAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAiAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowResults(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      toast({
        title: 'Processing Assessment',
        description: 'Analyzing patient data and images using AI...',
      });
      
      // Simulate AI processing
      simulateAiAnalysis();
      
      // Generate a random case ID
      const caseId = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setTimeout(() => {
        setIsSubmitting(false);
        
        toast({
          title: 'Assessment Complete',
          description: `Case ID: ${caseId}`,
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Error',
        description: 'Failed to process patient data. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Estimated Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={patientData.gender}
                    onChange={handleInputChange}
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
                    name="estimatedAge"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={patientData.estimatedAge}
                    onChange={handleInputChange}
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
                  name="incidentType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={patientData.incidentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Incident Type</option>
                  <option value="Road Traffic Accident">Road Traffic Accident</option>
                  <option value="Fall">Fall</option>
                  <option value="Burn">Burn</option>
                  <option value="Assault">Assault</option>
                  <option value="Industrial Accident">Industrial Accident</option>
                  <option value="Drowning">Drowning</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incidentDetails">Incident Details</Label>
                <Textarea 
                  id="incidentDetails" 
                  name="incidentDetails" 
                  placeholder="Describe what happened" 
                  rows={2}
                  value={patientData.incidentDetails}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="e.g. NH-8" 
                    value={patientData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationDetails">City/District</Label>
                  <Input 
                    id="locationDetails" 
                    name="locationDetails" 
                    placeholder="e.g. Gurugram, Haryana" 
                    value={patientData.locationDetails}
                    onChange={handleInputChange}
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
                      name="responsiveness"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={patientData.responsiveness}
                      onChange={handleInputChange}
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
                      name="breathing"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={patientData.breathing}
                      onChange={handleInputChange}
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
                      name="bleeding"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={patientData.bleeding}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="none">None</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>
                
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
                          onChange={handleVitalSignChange}
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
                          onChange={handleVitalSignChange}
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
                          onChange={handleVitalSignChange}
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
                          onChange={handleVitalSignChange}
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
                          onChange={handleVitalSignChange}
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
                          onChange={handleVitalSignChange}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <div className="space-y-1">
                  <Label htmlFor="injuryLocation">Injury Location</Label>
                  <select
                    id="injuryLocation"
                    name="injuryLocation"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={patientData.injuryLocation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Primary Injury Location</option>
                    <option value="Head/Face">Head/Face</option>
                    <option value="Neck">Neck</option>
                    <option value="Chest">Chest</option>
                    <option value="Abdomen">Abdomen</option>
                    <option value="Back">Back</option>
                    <option value="Upper Extremities">Upper Extremities</option>
                    <option value="Lower Extremities">Lower Extremities</option>
                    <option value="Multiple">Multiple Locations</option>
                  </select>
                </div>
                
                <div className="space-y-1 mt-3">
                  <Label htmlFor="physicalFindings">Physical Examination Findings</Label>
                  <Textarea 
                    id="physicalFindings" 
                    name="physicalFindings" 
                    placeholder="Describe visible injuries, deformities, etc." 
                    rows={3}
                    value={patientData.physicalFindings}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block mb-2">Injury Photos (for AI Analysis)</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="h-4 w-4" />
                    Capture Photo
                  </Button>
                  <div className="relative">
                    <Input
                      id="injuryPhotos"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('injuryPhotos')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photos
                    </Button>
                  </div>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Injury ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {previewUrls.length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 mt-4">
                    <p>Upload or capture photos of injuries for AI analysis</p>
                  </div>
                )}
              </div>
              
              {aiAnalysisProgress > 0 && !showResults && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>AI Analysis in Progress</Label>
                    <span className="text-sm">{aiAnalysisProgress}%</span>
                  </div>
                  <Progress value={aiAnalysisProgress} className="h-2" />
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
