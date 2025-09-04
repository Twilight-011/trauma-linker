import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisResult {
  injuries: Array<{
    name: string;
    confidence: number;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    bodyRegion: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'immediate' | 'urgent' | 'standard';
    timeframe: string;
  }>;
  vitalSignsAnalysis: {
    riskScore: number;
    concerningValues: string[];
    stabilityIndex: number;
  };
  overallConfidence: number;
  treatmentProtocol: string;
  estimatedSurvivalRate: number;
}

interface UseEnhancedAIReturn {
  analyzePatientData: (imageFile: File | null, vitalSigns: any, patientData: any) => Promise<AIAnalysisResult>;
  isAnalyzing: boolean;
  analysisProgress: number;
}

export const useEnhancedAI = (): UseEnhancedAIReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  const simulateImageAnalysis = async (imageFile: File | null): Promise<Partial<AIAnalysisResult>> => {
    // Check if this is a demo image with predefined results
    const demoData = localStorage.getItem('demo-image-data');
    if (demoData) {
      const parsedDemo = JSON.parse(demoData);
      localStorage.removeItem('demo-image-data'); // Clean up
      
      return {
        injuries: parsedDemo.expectedResults.injuries.map((injury: string, index: number) => ({
          name: injury,
          confidence: parsedDemo.expectedResults.confidence - (index * 3),
          severity: index === 0 ? 'critical' : index === 1 ? 'high' : 'moderate',
          bodyRegion: getBodyRegionFromInjury(injury)
        })),
        overallConfidence: parsedDemo.expectedResults.confidence
      };
    }

    // Enhanced AI simulation for uploaded images
    if (!imageFile) {
      return {
        injuries: [],
        overallConfidence: 0
      };
    }

    // Simulate advanced computer vision analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    // More sophisticated injury detection simulation
    const mockInjuries = [
      { name: 'Compound fracture - right tibia', confidence: 94, severity: 'critical' as const, bodyRegion: 'lower extremity' },
      { name: 'Soft tissue laceration', confidence: 89, severity: 'high' as const, bodyRegion: 'lower extremity' },
      { name: 'Possible vascular damage', confidence: 76, severity: 'high' as const, bodyRegion: 'circulatory' },
      { name: 'Contusion - surrounding area', confidence: 68, severity: 'moderate' as const, bodyRegion: 'soft tissue' }
    ];

    return {
      injuries: mockInjuries,
      overallConfidence: 89
    };
  };

  const analyzeVitalSigns = (vitalSigns: any) => {
    const hr = parseInt(vitalSigns.heartRate) || 0;
    const systolic = parseInt(vitalSigns.bloodPressure?.split('/')[0]) || 0;
    const spO2 = parseInt(vitalSigns.spO2) || 0;
    const rr = parseInt(vitalSigns.respRate) || 0;
    const gcs = parseInt(vitalSigns.gcs) || 15;

    let riskScore = 0;
    const concerningValues: string[] = [];

    // Advanced vital signs analysis
    if (hr > 120 || hr < 50) {
      riskScore += hr > 140 ? 25 : 15;
      concerningValues.push(`Heart rate: ${hr} BPM (${hr > 120 ? 'tachycardic' : 'bradycardic'})`);
    }

    if (systolic < 90 || systolic > 180) {
      riskScore += systolic < 80 ? 30 : 20;
      concerningValues.push(`Blood pressure: ${vitalSigns.bloodPressure} (${systolic < 90 ? 'hypotensive' : 'hypertensive'})`);
    }

    if (spO2 < 95) {
      riskScore += spO2 < 85 ? 35 : 25;
      concerningValues.push(`Oxygen saturation: ${spO2}% (hypoxemic)`);
    }

    if (rr > 24 || rr < 12) {
      riskScore += rr > 30 ? 20 : 10;
      concerningValues.push(`Respiratory rate: ${rr} (${rr > 24 ? 'tachypneic' : 'bradypneic'})`);
    }

    if (gcs < 15) {
      riskScore += gcs < 8 ? 40 : (15 - gcs) * 5;
      concerningValues.push(`Glasgow Coma Scale: ${gcs}/15 (altered consciousness)`);
    }

    const stabilityIndex = Math.max(0, 100 - riskScore);

    return {
      riskScore: Math.min(100, riskScore),
      concerningValues,
      stabilityIndex
    };
  };

  const generateRecommendations = (injuries: any[], vitalAnalysis: any) => {
    const recommendations = [];

    // Priority-based recommendations
    if (vitalAnalysis.riskScore > 70) {
      recommendations.push({
        action: 'Immediate airway, breathing, circulation (ABC) assessment',
        priority: 'immediate' as const,
        timeframe: 'Now'
      });
    }

    if (injuries.some(i => i.severity === 'critical')) {
      recommendations.push({
        action: 'Activate trauma team - Level 1 response',
        priority: 'immediate' as const,
        timeframe: '< 2 minutes'
      });
      recommendations.push({
        action: 'Secure IV access - two large bore (14-16G) lines',
        priority: 'immediate' as const,
        timeframe: '< 5 minutes'
      });
    }

    if (injuries.some(i => i.name.includes('fracture'))) {
      recommendations.push({
        action: 'Immobilize fracture site - apply splint/traction',
        priority: 'urgent' as const,
        timeframe: '< 10 minutes'
      });
    }

    recommendations.push({
      action: 'Continuous cardiac monitoring and pulse oximetry',
      priority: 'urgent' as const,
      timeframe: '< 3 minutes'
    });

    return recommendations;
  };

  const analyzePatientData = useCallback(async (
    imageFile: File | null,
    vitalSigns: any,
    patientData: any
  ): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Stage 1: Image Analysis
      setAnalysisProgress(20);
      toast({
        title: 'AI Analysis Started',
        description: 'Running computer vision analysis...',
      });

      const imageResults = await simulateImageAnalysis(imageFile);

      // Stage 2: Vital Signs Analysis
      setAnalysisProgress(50);
      const vitalAnalysis = analyzeVitalSigns(vitalSigns);

      // Stage 3: Treatment Protocol Generation
      setAnalysisProgress(75);
      const recommendations = generateRecommendations(imageResults.injuries || [], vitalAnalysis);

      // Stage 4: Risk Assessment
      setAnalysisProgress(90);
      const treatmentProtocol = determineTreatmentProtocol(imageResults.injuries || [], vitalAnalysis);
      const survivalRate = calculateSurvivalRate(imageResults.injuries || [], vitalAnalysis);

      setAnalysisProgress(100);

      const result: AIAnalysisResult = {
        injuries: imageResults.injuries || [],
        recommendations,
        vitalSignsAnalysis: vitalAnalysis,
        overallConfidence: imageResults.overallConfidence || 0,
        treatmentProtocol,
        estimatedSurvivalRate: survivalRate
      };

      toast({
        title: 'AI Analysis Complete',
        description: `Analysis completed with ${result.overallConfidence}% confidence`,
      });

      return result;

    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to complete AI analysis. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [toast]);

  return {
    analyzePatientData,
    isAnalyzing,
    analysisProgress
  };
};

// Helper functions
const getBodyRegionFromInjury = (injury: string): string => {
  if (injury.toLowerCase().includes('head') || injury.toLowerCase().includes('brain')) return 'head/neck';
  if (injury.toLowerCase().includes('chest') || injury.toLowerCase().includes('rib')) return 'chest';
  if (injury.toLowerCase().includes('abdomen') || injury.toLowerCase().includes('pelvi')) return 'abdomen/pelvis';
  if (injury.toLowerCase().includes('tibia') || injury.toLowerCase().includes('leg')) return 'lower extremity';
  if (injury.toLowerCase().includes('arm') || injury.toLowerCase().includes('shoulder')) return 'upper extremity';
  return 'unspecified';
};

const determineTreatmentProtocol = (injuries: any[], vitalAnalysis: any): string => {
  if (vitalAnalysis.riskScore > 80) return 'Advanced Trauma Life Support (ATLS) - Critical';
  if (injuries.some(i => i.severity === 'critical')) return 'Trauma Team Activation - Level 1';
  if (vitalAnalysis.riskScore > 40) return 'Emergency Department - Priority';
  return 'Standard Emergency Protocol';
};

const calculateSurvivalRate = (injuries: any[], vitalAnalysis: any): number => {
  let baseRate = 95;
  
  // Reduce survival rate based on injury severity
  injuries.forEach(injury => {
    switch (injury.severity) {
      case 'critical': baseRate -= 15; break;
      case 'high': baseRate -= 8; break;
      case 'moderate': baseRate -= 3; break;
    }
  });

  // Adjust for vital signs
  baseRate -= vitalAnalysis.riskScore * 0.3;

  return Math.max(20, Math.min(95, baseRate));
};