
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Camera, Activity, AlertTriangle, Play } from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import demoFracture from '@/assets/demo-fracture.jpg';
import demoWound from '@/assets/demo-wound.jpg';
import demoBurn from '@/assets/demo-burn.jpg';
import demoTrauma from '@/assets/demo-trauma.jpg';
import demoHeadTrauma from '@/assets/demo-head-trauma.jpg';
import demoAbdominalInjury from '@/assets/demo-abdominal-injury.jpg';
import demoCompoundFracture from '@/assets/demo-compound-fracture.jpg';
import demoChestTrauma from '@/assets/demo-chest-trauma.jpg';
import demoSevereBurn from '@/assets/demo-severe-burn.jpg';

type VitalStatus = 'normal' | 'warning' | 'critical';

interface VitalSignProps {
  name: string;
  value: number;
  unit: string;
  status: VitalStatus;
}

const VitalSign = ({ name, value, unit, status }: VitalSignProps) => {
  let statusColor = 'text-green-500';
  let animationClass = '';
  
  if (status === 'warning') statusColor = 'text-yellow-500';
  if (status === 'critical') {
    statusColor = 'text-red-500';
    animationClass = 'animate-pulse';
  }

  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{name}</span>
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold ${statusColor} ${animationClass}`}>{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
};

const PatientAssessment = () => {
  const { analyzePatientData, isAnalyzing, analysisProgress } = useEnhancedAI();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedDemo, setSelectedDemo] = useState<string>('');
  const [currentVitals, setCurrentVitals] = useState<any>(null);
  const [currentPatientData, setCurrentPatientData] = useState<any>(null);
  const { toast } = useToast();

  const demoImages = [
    { name: 'Fracture Demo', type: 'fracture', src: demoFracture },
    { name: 'Wound Demo', type: 'wound', src: demoWound },
    { name: 'Burn Demo', type: 'burn', src: demoBurn },
    { name: 'Trauma Demo', type: 'trauma', src: demoTrauma },
    { name: 'Head Trauma', type: 'head-trauma', src: demoHeadTrauma },
    { name: 'Abdominal Injury', type: 'abdominal-injury', src: demoAbdominalInjury },
    { name: 'Compound Fracture', type: 'compound-fracture', src: demoCompoundFracture },
    { name: 'Chest Trauma', type: 'chest-trauma', src: demoChestTrauma },
    { name: 'Severe Burn', type: 'severe-burn', src: demoSevereBurn }
  ];

  const generateRandomVitals = () => {
    return {
      heartRate: Math.floor(Math.random() * 60) + 60, // 60-120
      bloodPressure: `${Math.floor(Math.random() * 60) + 90}/${Math.floor(Math.random() * 30) + 60}`, // 90-150/60-90
      spO2: Math.floor(Math.random() * 20) + 85, // 85-105
      temperature: (Math.random() * 4 + 36).toFixed(1), // 36-40
      respiratoryRate: Math.floor(Math.random() * 15) + 12, // 12-27
      gcs: Math.floor(Math.random() * 8) + 8 // 8-15
    };
  };

  const generateRandomPatientData = () => {
    const ages = [25, 34, 45, 28, 52, 38, 41];
    const genders = ['male', 'female'];
    const incidents = ['motor vehicle accident', 'fall from height', 'workplace injury', 'sports injury', 'domestic accident'];
    
    return {
      age: ages[Math.floor(Math.random() * ages.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      incidentType: incidents[Math.floor(Math.random() * incidents.length)]
    };
  };

  const saveToDatabase = async (patientData: any, vitals: any, analysisResult: any, imageType: string) => {
    try {
      // Generate a unique case ID
      const caseId = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save patient data to database
      const { data, error } = await supabase
        .from('patients')
        .insert({
          case_id: caseId,
          age: patientData.age,
          gender: patientData.gender,
          incident_type: patientData.incidentType,
          description: `AI Test - ${imageType} injury simulation`,
          vital_signs: vitals,
          ai_analysis: analysisResult,
          triage_level: analysisResult.vitalSignsAnalysis?.riskScore > 70 ? 'critical' : 
                       analysisResult.vitalSignsAnalysis?.riskScore > 40 ? 'urgent' : 'standard'
        })
        .select();

      if (error) {
        console.error('Database save error:', error);
        toast({
          title: 'Database Error',
          description: 'Failed to save test results to database',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Test Results Saved',
          description: `Patient case ${caseId} saved to database`,
        });
      }
    } catch (error) {
      console.error('Database save error:', error);
    }
  };

  const handleDemoTest = async (demoImage: any) => {
    setSelectedDemo(demoImage.name);
    
    // Convert image to file-like object
    const response = await fetch(demoImage.src);
    const blob = await response.blob();
    const file = new File([blob], `${demoImage.type}-demo.jpg`, { type: 'image/jpeg' });
    
    const vitals = generateRandomVitals();
    const patientData = generateRandomPatientData();
    
    // Store current test data
    setCurrentVitals(vitals);
    setCurrentPatientData(patientData);
    
    try {
      const result = await analyzePatientData(file, vitals, patientData);
      setAnalysisResult(result);
      
      // Save to database
      await saveToDatabase(patientData, vitals, result, demoImage.type);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to complete AI analysis',
        variant: 'destructive'
      });
    }
  };

  const getStatusFromValue = (name: string, value: any): VitalStatus => {
    switch (name) {
      case 'Heart Rate':
        const hr = typeof value === 'number' ? value : parseInt(value);
        if (hr > 120 || hr < 50) return 'critical';
        if (hr > 100 || hr < 60) return 'warning';
        return 'normal';
      case 'SpO2':
        const spo2 = typeof value === 'number' ? value : parseInt(value);
        if (spo2 < 90) return 'critical';
        if (spo2 < 95) return 'warning';
        return 'normal';
      case 'GCS':
        const gcs = typeof value === 'number' ? value : parseInt(value);
        if (gcs < 9) return 'critical';
        if (gcs < 13) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Patient Assessment - AI Model Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Demo Image Selection */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold mb-3 text-blue-800">Test AI Model with Demo Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {demoImages.map((demo) => (
              <Button
                key={demo.type}
                variant="outline"
                size="sm"
                onClick={() => handleDemoTest(demo)}
                disabled={isAnalyzing}
                className="flex flex-col items-center p-2 h-auto"
              >
                <img src={demo.src} alt={demo.name} className="w-12 h-12 object-cover rounded mb-1" />
                <span className="text-xs">{demo.name}</span>
              </Button>
            ))}
          </div>
          {selectedDemo && (
            <p className="text-xs mt-2 text-blue-600">Testing: {selectedDemo}</p>
          )}
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Analyzing with AI Model...</span>
              <span className="text-sm font-medium">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Camera className="h-4 w-4 mr-1" />
                <span>AI Image Analysis</span>
              </div>
              <span className="text-sm font-medium">
                {analysisResult ? `${analysisResult.overallConfidence}%` : '--'}
              </span>
            </div>
            <Progress value={analysisResult?.overallConfidence || 0} className="h-2" />

            <div className="p-3 bg-gray-100 rounded-lg mt-4">
              <div className="text-sm font-medium mb-2">AI Detection Results:</div>
              <div className="space-y-2 text-sm">
                {analysisResult?.imageAnalysis?.detectedConditions?.length > 0 ? (
                  analysisResult.imageAnalysis.detectedConditions.map((condition: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{condition.condition}</span>
                      <span className={`font-medium ${
                        condition.severity === 'critical' ? 'text-red-600' : 
                        condition.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        {condition.confidence}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-2">
                    Click a demo image above to test AI analysis
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Current Test Vitals</h4>
              {currentPatientData && (
                <div className="text-xs text-gray-600 mb-2">
                  Patient: {currentPatientData.age}y {currentPatientData.gender}, {currentPatientData.incidentType}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 vital-container">
              {currentVitals ? (
                <>
                  <VitalSign 
                    name="Heart Rate" 
                    value={currentVitals.heartRate} 
                    unit="bpm" 
                    status={getStatusFromValue('Heart Rate', currentVitals.heartRate)} 
                  />
                  <VitalSign 
                    name="Blood Pressure" 
                    value={parseInt(currentVitals.bloodPressure.split('/')[0])} 
                    unit={`/${currentVitals.bloodPressure.split('/')[1]}`} 
                    status="normal" 
                  />
                  <VitalSign 
                    name="SpO2" 
                    value={currentVitals.spO2} 
                    unit="%" 
                    status={getStatusFromValue('SpO2', currentVitals.spO2)} 
                  />
                  <VitalSign 
                    name="Resp. Rate" 
                    value={currentVitals.respiratoryRate} 
                    unit="bpm" 
                    status="normal" 
                  />
                  <VitalSign 
                    name="Temperature" 
                    value={parseFloat(currentVitals.temperature)} 
                    unit="°C" 
                    status="normal" 
                  />
                  <VitalSign 
                    name="GCS" 
                    value={currentVitals.gcs} 
                    unit="/15" 
                    status={getStatusFromValue('GCS', currentVitals.gcs)} 
                  />
                </>
              ) : (
                <>
                  <VitalSign name="Heart Rate" value={0} unit="bpm" status="normal" />
                  <VitalSign name="Blood Pressure" value={0} unit="/--" status="normal" />
                  <VitalSign name="SpO2" value={0} unit="%" status="normal" />
                  <VitalSign name="Resp. Rate" value={0} unit="bpm" status="normal" />
                  <VitalSign name="Temperature" value={0} unit="°C" status="normal" />
                  <VitalSign name="GCS" value={0} unit="/15" status="normal" />
                </>
              )}
            </div>

            {analysisResult && analysisResult.vitalSignsAnalysis?.riskScore > 40 && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">AI Analysis Alert:</p>
                  <p>Risk Score: {analysisResult.vitalSignsAnalysis.riskScore}% - {analysisResult.vitalSignsAnalysis.concerningValues.join(', ')}</p>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">
                  <p className="font-medium">AI Predictions:</p>
                  <div className="mt-2 space-y-1">
                    {analysisResult.injuries?.map((injury: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{injury.name}</span>
                        <span className="font-medium">{injury.confidence}% confidence</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-300">
                    <p className="text-xs">Treatment: {analysisResult.treatmentProtocol}</p>
                    <p className="text-xs">Survival Rate: {analysisResult.estimatedSurvivalRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAssessment;
