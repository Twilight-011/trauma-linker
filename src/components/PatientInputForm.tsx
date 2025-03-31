
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Clipboard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PatientInputForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientData, setPatientData] = useState({
    gender: '',
    age: '',
    incidentType: '',
    incidentDetails: '',
    location: '',
    locationDetails: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the data and images to a server here
      // For this prototype, we'll simulate the AI processing with a timeout
      
      toast({
        title: 'Processing Information',
        description: 'Analyzing patient data and images...',
      });
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a random case ID
      const caseId = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // In a real app, you would save this data to a database and redirect with the case ID
      // For now, we'll just redirect to the dashboard
      
      toast({
        title: 'Case Created',
        description: `Case ID: ${caseId}`,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Error',
        description: 'Failed to process patient data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clipboard className="h-5 w-5 mr-2 text-primary" />
          New Patient Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Patient Gender</Label>
                <Input 
                  id="gender" 
                  name="gender" 
                  placeholder="Male/Female/Other" 
                  value={patientData.gender}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Patient Age</Label>
                <Input 
                  id="age" 
                  name="age" 
                  type="number" 
                  placeholder="Age in years" 
                  value={patientData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incidentType">Incident Type</Label>
              <Input 
                id="incidentType" 
                name="incidentType" 
                placeholder="e.g. Road Accident, Fall, Burn" 
                value={patientData.incidentType}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incidentDetails">Incident Details</Label>
              <Textarea 
                id="incidentDetails" 
                name="incidentDetails" 
                placeholder="Describe what happened" 
                rows={3}
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
                  placeholder="e.g. NH-48" 
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
                  placeholder="e.g. Gurgaon, Haryana" 
                  value={patientData.locationDetails}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Pre-existing Medical Conditions</Label>
              <Textarea 
                id="medicalConditions" 
                name="medicalConditions" 
                placeholder="e.g. Diabetes, Hypertension" 
                rows={2}
                value={patientData.medicalConditions}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea 
                  id="medications" 
                  name="medications" 
                  placeholder="e.g. Metformin 500mg" 
                  rows={2}
                  value={patientData.medications}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  name="allergies" 
                  placeholder="e.g. Penicillin, Iodine" 
                  rows={2}
                  value={patientData.allergies}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="block mb-2">Injury Photos</Label>
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
      </CardContent>
    </Card>
  );
};

export default PatientInputForm;
