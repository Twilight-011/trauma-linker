
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEnhancedAI } from './useEnhancedAI';

interface VitalSigns {
  heartRate: string;
  bloodPressure: string;
  respRate: string;
  spO2: string;
  temperature: string;
  gcs: string;
}

interface PatientData {
  gender: string;
  estimatedAge: string;
  incidentType: string;
  incidentDetails: string;
  location: string;
  locationDetails: string;
  responsiveness: 'responsive' | 'semi-responsive' | 'unresponsive';
  breathing: 'normal' | 'labored' | 'absent';
  bleeding: 'none' | 'mild' | 'moderate' | 'severe';
  injuryLocation: string;
  physicalFindings: string;
}

export const usePatientForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { analyzePatientData, isAnalyzing, analysisProgress } = useEnhancedAI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: '',
    bloodPressure: '',
    respRate: '',
    spO2: '',
    temperature: '',
    gcs: '',
  });
  
  const form = useForm<PatientData>({
    defaultValues: {
      gender: '',
      estimatedAge: '',
      incidentType: '',
      incidentDetails: '',
      location: '',
      locationDetails: '',
      responsiveness: 'responsive',
      breathing: 'normal',
      bleeding: 'none',
      injuryLocation: '',
      physicalFindings: '',
    }
  });

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedImage(files[0]);
    }
  };

  const handleVitalSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitalSigns(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: PatientData) => {
    console.log('Form submission started with data:', data);
    console.log('Vital signs:', vitalSigns);
    console.log('Uploaded image:', uploadedImage);
    
    setIsSubmitting(true);
    setShowResults(false);
    
    try {
      // Run enhanced AI analysis
      const aiResults = await analyzePatientData(uploadedImage, vitalSigns, data);
      console.log('AI analysis completed:', aiResults);
      
      setAnalysisData(aiResults);
      setShowResults(true);
      
      const caseId = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Dispatch custom event to activate the EmergencyResponseAgent
      const patientDataEvent = new CustomEvent('patientDataSubmitted', {
        detail: {
          ...data,
          vitalSigns,
          aiAnalysis: aiResults,
          caseId
        }
      });
      document.dispatchEvent(patientDataEvent);
      
      toast({
        title: 'Enhanced AI Analysis Complete',
        description: `Case ID: ${caseId} - Confidence: ${aiResults.overallConfidence}%`,
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to complete AI analysis. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting: isSubmitting || isAnalyzing,
    showResults,
    aiAnalysisProgress: analysisProgress,
    analysisData,
    vitalSigns,
    setVitalSigns,
    setUploadedImage,
    handleVitalSignChange,
    handleImageUpload,
    handleSubmit,
    navigate
  };
};
