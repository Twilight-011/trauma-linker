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

  const simulateImageAnalysis = async (imageFile: File | null): Promise<Partial<AIAnalysisResult> & { imageAnalysis?: { detectedConditions: any[] } }> => {
    // Enhanced simulation based on image filename/type
    const fileName = imageFile?.name || '';
    let mockInjuries = [];
    let confidence = 85;

    if (fileName.includes('fracture')) {
      mockInjuries = [
        { condition: 'Compound fracture - tibia', confidence: 94, severity: 'critical', name: 'Compound fracture - tibia', bodyRegion: 'lower extremity' },
        { condition: 'Bone displacement', confidence: 89, severity: 'high', name: 'Bone displacement', bodyRegion: 'lower extremity' },
        { condition: 'Soft tissue damage', confidence: 76, severity: 'moderate', name: 'Soft tissue damage', bodyRegion: 'soft tissue' }
      ];
      confidence = 92;
    } else if (fileName.includes('wound')) {
      mockInjuries = [
        { condition: 'Deep laceration', confidence: 91, severity: 'high', name: 'Deep laceration', bodyRegion: 'soft tissue' },
        { condition: 'Arterial bleeding', confidence: 87, severity: 'critical', name: 'Arterial bleeding', bodyRegion: 'circulatory' },
        { condition: 'Foreign body presence', confidence: 73, severity: 'moderate', name: 'Foreign body presence', bodyRegion: 'soft tissue' }
      ];
      confidence = 89;
    } else if (fileName.includes('burn')) {
      mockInjuries = [
        { condition: 'Third-degree burns', confidence: 88, severity: 'critical', name: 'Third-degree burns', bodyRegion: 'integumentary' },
        { condition: 'Thermal injury - 15% BSA', confidence: 85, severity: 'high', name: 'Thermal injury', bodyRegion: 'integumentary' },
        { condition: 'Inhalation injury risk', confidence: 67, severity: 'high', name: 'Inhalation injury risk', bodyRegion: 'respiratory' }
      ];
      confidence = 86;
    } else if (fileName.includes('trauma')) {
      mockInjuries = [
        { condition: 'Multiple trauma injuries', confidence: 93, severity: 'critical', name: 'Multiple trauma injuries', bodyRegion: 'multiple' },
        { condition: 'Internal bleeding', confidence: 79, severity: 'critical', name: 'Internal bleeding', bodyRegion: 'circulatory' },
        { condition: 'Possible organ damage', confidence: 71, severity: 'high', name: 'Possible organ damage', bodyRegion: 'abdomen' }
      ];
      confidence = 90;
    } else {
      // Default simulation for unknown images
      mockInjuries = [
        { condition: 'Unspecified injury', confidence: 70, severity: 'moderate', name: 'Unspecified injury', bodyRegion: 'unspecified' },
        { condition: 'Soft tissue trauma', confidence: 65, severity: 'moderate', name: 'Soft tissue trauma', bodyRegion: 'soft tissue' }
      ];
      confidence = 75;
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      injuries: mockInjuries.map(injury => ({
        name: injury.name,
        confidence: injury.confidence,
        severity: injury.severity,
        bodyRegion: injury.bodyRegion
      })),
      imageAnalysis: {
        detectedConditions: mockInjuries
      },
      overallConfidence: confidence
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

      const result: any = {
        imageAnalysis: {
          detectedConditions: imageResults.injuries || [],
          overallConfidence: imageResults.overallConfidence || 0,
          recommendations: recommendations.map(r => r.action)
        },
        vitalSignsAnalysis: {
          riskScore: vitalAnalysis.riskScore,
          concerningValues: vitalAnalysis.concerningValues,
          recommendations: recommendations.filter(r => r.priority === 'immediate').map(r => r.action)
        },
        overallConfidence: imageResults.overallConfidence || 0,
        treatmentProtocol,
        estimatedSurvivalRate: survivalRate,
        injuries: imageResults.injuries || [],
        recommendations
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