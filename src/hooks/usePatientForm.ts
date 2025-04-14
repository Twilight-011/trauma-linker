
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0);
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

  const handleVitalSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitalSigns(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: PatientData) => {
    setIsSubmitting(true);
    
    try {
      toast({
        title: 'Processing Assessment',
        description: 'Analyzing patient data and images using AI...',
      });
      
      simulateAiAnalysis();
      
      const caseId = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Dispatch custom event to activate the EmergencyResponseAgent
        const patientDataEvent = new CustomEvent('patientDataSubmitted', {
          detail: {
            ...data,
            vitalSigns,
            caseId
          }
        });
        document.dispatchEvent(patientDataEvent);
        
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

  return {
    form,
    isSubmitting,
    showResults,
    aiAnalysisProgress,
    vitalSigns,
    handleVitalSignChange,
    handleSubmit,
    navigate
  };
};
