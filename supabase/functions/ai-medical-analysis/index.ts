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

  // Image analysis simulation
  const imageAnalysis = {
    detectedConditions: [] as any[],
    overallConfidence: 0,
    recommendations: [] as string[]
  };

  if (imageData) {
    // Simulate different injury types based on incident type
    if (patientData?.incidentType?.toLowerCase().includes('vehicle')) {
      imageAnalysis.detectedConditions.push({
        condition: 'Compound fracture - right tibia',
        confidence: 94,
        severity: 'critical'
      });
      imageAnalysis.detectedConditions.push({
        condition: 'Soft tissue laceration',
        confidence: 89,
        severity: 'high'
      });
      imageAnalysis.overallConfidence = 91;
      imageAnalysis.recommendations.push('Immediate orthopedic surgery consult');
      imageAnalysis.recommendations.push('Blood type and crossmatch');
    } else if (patientData?.incidentType?.toLowerCase().includes('fall')) {
      imageAnalysis.detectedConditions.push({
        condition: 'Possible head trauma',
        confidence: 76,
        severity: 'high'
      });
      imageAnalysis.overallConfidence = 78;
      imageAnalysis.recommendations.push('CT scan of head and neck');
      imageAnalysis.recommendations.push('Neurological monitoring');
    } else {
      imageAnalysis.detectedConditions.push({
        condition: 'Minor contusion',
        confidence: 65,
        severity: 'low'
      });
      imageAnalysis.overallConfidence = 68;
      imageAnalysis.recommendations.push('Apply ice and elevate');
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