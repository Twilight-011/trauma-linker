import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, vitalSigns, patientData } = await req.json();
    
    console.log('AI Analysis Request:', { 
      hasImage: !!imageData, 
      vitalSigns, 
      patientData 
    });

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis based on vital signs and patient data
    const analysis = await performMockAnalysis(vitalSigns, patientData, imageData);
    
    console.log('AI Analysis Result:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    return new Response(JSON.stringify({ 
      error: 'Analysis failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performMockAnalysis(vitalSigns: any, patientData: any, imageData?: string) {
  const hr = parseInt(vitalSigns?.heartRate) || 0;
  const systolic = parseInt(vitalSigns?.bloodPressure?.split('/')[0]) || 0;
  const spO2 = parseInt(vitalSigns?.spO2) || 0;
  const gcs = parseInt(vitalSigns?.gcs) || 15;

  // Random medical conditions database
  const medicalConditions = [
    {
      type: 'fracture',
      conditions: [
        { name: 'Compound fracture - femur', severity: 'critical', confidence: [85, 95] },
        { name: 'Closed fracture - radius', severity: 'high', confidence: [80, 90] },
        { name: 'Hairline fracture - tibia', severity: 'moderate', confidence: [70, 85] },
        { name: 'Comminuted fracture - humerus', severity: 'critical', confidence: [88, 96] },
        { name: 'Spiral fracture - fibula', severity: 'high', confidence: [75, 88] }
      ]
    },
    {
      type: 'wound',
      conditions: [
        { name: 'Deep laceration - anterior chest', severity: 'critical', confidence: [90, 98] },
        { name: 'Puncture wound - abdomen', severity: 'critical', confidence: [85, 95] },
        { name: 'Avulsion injury - scalp', severity: 'high', confidence: [80, 92] },
        { name: 'Degloving injury - hand', severity: 'critical', confidence: [88, 96] },
        { name: 'Superficial abrasions - multiple', severity: 'low', confidence: [60, 75] }
      ]
    },
    {
      type: 'trauma',
      conditions: [
        { name: 'Traumatic brain injury', severity: 'critical', confidence: [85, 95] },
        { name: 'Pneumothorax - tension', severity: 'critical', confidence: [90, 98] },
        { name: 'Internal bleeding - suspected', severity: 'critical', confidence: [80, 92] },
        { name: 'Spinal cord injury - cervical', severity: 'critical', confidence: [85, 94] },
        { name: 'Cardiac contusion', severity: 'high', confidence: [75, 88] }
      ]
    },
    {
      type: 'burn',
      conditions: [
        { name: 'Third-degree burns - 15% BSA', severity: 'critical', confidence: [92, 98] },
        { name: 'Chemical burns - face/neck', severity: 'critical', confidence: [88, 95] },
        { name: 'Electrical burns - entry/exit', severity: 'high', confidence: [80, 90] },
        { name: 'Thermal burns - hands', severity: 'high', confidence: [85, 93] },
        { name: 'Minor burns - forearm', severity: 'moderate', confidence: [70, 82] }
      ]
    }
  ];

  const imageAnalysis = {
    detectedConditions: [] as any[],
    overallConfidence: 0,
    recommendations: [] as string[],
    predictedOn: 'AI Image Analysis of Patient Photos'
  };

  if (imageData) {
    // Randomly select a medical condition category
    const randomCategory = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
    const numConditions = Math.floor(Math.random() * 3) + 1; // 1-3 conditions
    
    for (let i = 0; i < numConditions; i++) {
      const randomCondition = randomCategory.conditions[Math.floor(Math.random() * randomCategory.conditions.length)];
      const confidence = Math.floor(Math.random() * (randomCondition.confidence[1] - randomCondition.confidence[0] + 1)) + randomCondition.confidence[0];
      
      imageAnalysis.detectedConditions.push({
        condition: randomCondition.name,
        confidence: confidence,
        severity: randomCondition.severity,
        detectedIn: 'Patient injury photograph'
      });
    }

    // Calculate overall confidence
    imageAnalysis.overallConfidence = Math.floor(
      imageAnalysis.detectedConditions.reduce((sum, cond) => sum + cond.confidence, 0) / 
      imageAnalysis.detectedConditions.length
    );

    // Generate appropriate recommendations based on severity
    const hasCritical = imageAnalysis.detectedConditions.some(c => c.severity === 'critical');
    const hasHigh = imageAnalysis.detectedConditions.some(c => c.severity === 'high');

    if (hasCritical) {
      const criticalRecommendations = [
        'Activate trauma team immediately',
        'Prepare for emergency surgery',
        'Type and crossmatch 6 units blood',
        'IV access x2 large bore',
        'Continuous monitoring required',
        'Notify OR immediately'
      ];
      imageAnalysis.recommendations.push(...criticalRecommendations.slice(0, Math.floor(Math.random() * 3) + 2));
    } else if (hasHigh) {
      const highRecommendations = [
        'Orthopedic surgery consult',
        'CT scan recommended',
        'Pain management protocol',
        'Wound care specialist',
        'X-ray series required'
      ];
      imageAnalysis.recommendations.push(...highRecommendations.slice(0, Math.floor(Math.random() * 2) + 1));
    } else {
      imageAnalysis.recommendations.push('Standard wound care', 'Tetanus prophylaxis');
    }
  }

  // Vital signs analysis
  let riskScore = 0;
  const concerningValues: string[] = [];

  if (hr > 120 || hr < 50) {
    riskScore += hr > 140 ? 25 : 15;
    concerningValues.push(`Heart rate: ${hr} BPM (${hr > 120 ? 'tachycardic' : 'bradycardic'})`);
  }

  if (systolic < 90 || systolic > 180) {
    riskScore += systolic < 80 ? 30 : 20;
    concerningValues.push(`Blood pressure: ${vitalSigns?.bloodPressure} (${systolic < 90 ? 'hypotensive' : 'hypertensive'})`);
  }

  if (spO2 < 95) {
    riskScore += spO2 < 85 ? 35 : 25;
    concerningValues.push(`Oxygen saturation: ${spO2}% (hypoxemic)`);
  }

  if (gcs < 15) {
    riskScore += gcs < 8 ? 40 : (15 - gcs) * 5;
    concerningValues.push(`Glasgow Coma Scale: ${gcs}/15 (altered consciousness)`);
  }

  const vitalSignsAnalysis = {
    riskScore: Math.min(100, riskScore),
    concerningValues,
    recommendations: [] as string[]
  };

  if (riskScore > 70) {
    vitalSignsAnalysis.recommendations.push('Immediate ABC assessment required');
    vitalSignsAnalysis.recommendations.push('Activate trauma team');
  } else if (riskScore > 40) {
    vitalSignsAnalysis.recommendations.push('Close monitoring required');
    vitalSignsAnalysis.recommendations.push('IV access recommended');
  } else {
    vitalSignsAnalysis.recommendations.push('Standard monitoring protocol');
  }

  const overallConfidence = imageData ? 
    Math.round((imageAnalysis.overallConfidence + (100 - riskScore)) / 2) :
    Math.max(50, 100 - riskScore);

  return {
    imageAnalysis,
    vitalSignsAnalysis,
    overallConfidence
  };
}