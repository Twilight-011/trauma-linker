
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Camera, Activity, AlertTriangle, Play } from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import demoFracture from '@/assets/demo-fracture.jpg';
import demoWound from '@/assets/demo-wound.jpg';
import demoBurn from '@/assets/demo-burn.jpg';
import demoTrauma from '@/assets/demo-trauma.jpg';

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

  const demoImages = [
    { name: 'Fracture Demo', type: 'fracture', src: demoFracture },
    { name: 'Wound Demo', type: 'wound', src: demoWound },
    { name: 'Burn Demo', type: 'burn', src: demoBurn },
    { name: 'Trauma Demo', type: 'trauma', src: demoTrauma }
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

  const handleDemoTest = async (demoImage: any) => {
    setSelectedDemo(demoImage.name);
    
    // Convert image to file-like object
    const response = await fetch(demoImage.src);
    const blob = await response.blob();
    const file = new File([blob], `${demoImage.type}-demo.jpg`, { type: 'image/jpeg' });
    
    const vitals = generateRandomVitals();
    const patientData = generateRandomPatientData();
    
    try {
      const result = await analyzePatientData(file, vitals, patientData);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
            <div className="grid grid-cols-2 gap-3 vital-container">
              {analysisResult ? (
                <>
                  <VitalSign name="Heart Rate" value={85} unit="bpm" status="normal" />
                  <VitalSign name="Blood Pressure" value={120} unit="/80" status="normal" />
                  <VitalSign name="SpO2" value={98} unit="%" status="normal" />
                  <VitalSign name="Resp. Rate" value={16} unit="bpm" status="normal" />
                  <VitalSign name="Temperature" value={37.1} unit="°C" status="normal" />
                  <VitalSign name="GCS" value={15} unit="/15" status="normal" />
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAssessment;
