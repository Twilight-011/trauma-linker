import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Activity, Database, Brain, Hospital, Users, AlertTriangle } from 'lucide-react';

const SystemTestResults = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runCompleteSystemTest = async () => {
    setIsRunning(true);
    const results: any = {};

    try {
      // Test 1: Database Connectivity
      console.log('🔍 Testing database connectivity...');
      const { data: hospitals, error: hospitalsError } = await supabase
        .from('hospitals')
        .select('*');
      
      results.database = {
        status: hospitalsError ? 'failed' : 'passed',
        hospitals: hospitals?.length || 0,
        error: hospitalsError?.message
      };

      // Test 2: Patient Data Query
      console.log('🔍 Testing patient data queries...');
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select(`
          *,
          emergency_cases (
            *,
            hospitals (name, specialties)
          )
        `);

      results.patients = {
        status: patientsError ? 'failed' : 'passed',
        count: patients?.length || 0,
        sampleData: patients?.[0] || null,
        error: patientsError?.message
      };

      // Test 3: AI Analysis Function
      console.log('🔍 Testing AI analysis function...');
      const testVitals = {
        heartRate: 120,
        bloodPressure: '85/55',
        spO2: 92,
        respRate: 28,
        gcs: 13,
        temperature: 99.5
      };

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-medical-analysis', {
        body: {
          vitalSigns: testVitals,
          patientData: { age: 45, gender: 'Female', incidentType: 'Motor Vehicle Accident' },
          imageData: 'test-critical-injury-image'
        }
      });

      results.aiAnalysis = {
        status: aiError ? 'failed' : 'passed',
        confidence: aiResponse?.overallConfidence || 0,
        detectedConditions: aiResponse?.imageAnalysis?.detectedConditions?.length || 0,
        riskScore: aiResponse?.vitalSignsAnalysis?.riskScore || 0,
        recommendations: (aiResponse?.imageAnalysis?.recommendations?.length || 0) + 
                        (aiResponse?.vitalSignsAnalysis?.recommendations?.length || 0),
        error: aiError?.message,
        fullResponse: aiResponse
      };

      // Test 4: Emergency Case Management
      console.log('🔍 Testing emergency case management...');
      const { data: emergencyCases, error: casesError } = await supabase
        .from('emergency_cases')
        .select(`
          *,
          patients (case_id, triage_level, incident_type),
          hospitals (name, capacity)
        `)
        .eq('status', 'active');

      results.emergencyManagement = {
        status: casesError ? 'failed' : 'passed',
        activeCases: emergencyCases?.length || 0,
        criticalCases: emergencyCases?.filter(c => c.priority_level === 'critical').length || 0,
        error: casesError?.message
      };

      setTestResults(results);
      
      const passedTests = Object.values(results).filter((r: any) => r.status === 'passed').length;
      const totalTests = Object.keys(results).length;

      toast({
        title: `System Test Complete`,
        description: `${passedTests}/${totalTests} tests passed`,
        variant: passedTests === totalTests ? 'default' : 'destructive'
      });

    } catch (error: any) {
      console.error('System test error:', error);
      toast({
        title: 'System Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runCompleteSystemTest();
  }, []);

  const getStatusIcon = (status: string) => {
    return status === 'passed' ? 
      <CheckCircle className="h-5 w-5 text-green-600" /> : 
      <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'passed' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Complete System Test Results</h1>
          <p className="text-gray-600">Comprehensive testing of all Trauma Linker components</p>
          <Button 
            onClick={runCompleteSystemTest} 
            disabled={isRunning}
            className="mt-4"
          >
            {isRunning ? 'Running Tests...' : 'Rerun All Tests'}
          </Button>
        </div>

        {/* Test Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Database Connectivity Test */}
          {testResults.database && (
            <Card className={getStatusColor(testResults.database.status)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Database Connectivity
                  </div>
                  {getStatusIcon(testResults.database.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hospitals Loaded:</span>
                    <Badge variant="secondary">{testResults.database.hospitals}</Badge>
                  </div>
                  {testResults.database.error && (
                    <p className="text-red-600 text-sm">{testResults.database.error}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Data Test */}
          {testResults.patients && (
            <Card className={getStatusColor(testResults.patients.status)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Patient Data Management
                  </div>
                  {getStatusIcon(testResults.patients.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Patient Records:</span>
                    <Badge variant="secondary">{testResults.patients.count}</Badge>
                  </div>
                  {testResults.patients.sampleData && (
                    <div className="text-sm bg-white p-2 rounded">
                      <strong>Sample Case:</strong> {testResults.patients.sampleData.case_id}<br/>
                      <strong>Type:</strong> {testResults.patients.sampleData.incident_type}<br/>
                      <strong>Triage:</strong> 
                      <Badge className="ml-1" variant={testResults.patients.sampleData.triage_level === 'Red' ? 'destructive' : 'secondary'}>
                        {testResults.patients.sampleData.triage_level}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Test */}
          {testResults.aiAnalysis && (
            <Card className={getStatusColor(testResults.aiAnalysis.status)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Medical Analysis
                  </div>
                  {getStatusIcon(testResults.aiAnalysis.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Analysis Confidence:</span>
                    <Badge variant="secondary">{testResults.aiAnalysis.confidence}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Conditions Detected:</span>
                    <Badge variant="secondary">{testResults.aiAnalysis.detectedConditions}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <Badge variant={testResults.aiAnalysis.riskScore > 50 ? 'destructive' : 'secondary'}>
                      {testResults.aiAnalysis.riskScore}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommendations:</span>
                    <Badge variant="secondary">{testResults.aiAnalysis.recommendations}</Badge>
                  </div>
                  {testResults.aiAnalysis.fullResponse?.imageAnalysis?.detectedConditions?.[0] && (
                    <div className="text-sm bg-white p-2 rounded">
                      <strong>Detected:</strong> {testResults.aiAnalysis.fullResponse.imageAnalysis.detectedConditions[0].condition}
                      <Badge className="ml-2" variant="destructive">
                        {testResults.aiAnalysis.fullResponse.imageAnalysis.detectedConditions[0].severity}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Management Test */}
          {testResults.emergencyManagement && (
            <Card className={getStatusColor(testResults.emergencyManagement.status)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Case Management
                  </div>
                  {getStatusIcon(testResults.emergencyManagement.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Cases:</span>
                    <Badge variant="secondary">{testResults.emergencyManagement.activeCases}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Cases:</span>
                    <Badge variant="destructive">{testResults.emergencyManagement.criticalCases}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed AI Response */}
        {testResults.aiAnalysis?.fullResponse && (
          <Card>
            <CardHeader>
              <CardTitle>Live AI Analysis Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Image Analysis</h4>
                  <div className="space-y-1">
                    {testResults.aiAnalysis.fullResponse.imageAnalysis?.detectedConditions?.map((condition: any, i: number) => (
                      <div key={i} className="bg-gray-50 p-2 rounded flex justify-between">
                        <span className="text-sm">{condition.condition}</span>
                        <Badge variant={condition.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {condition.confidence}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Vital Signs Analysis</h4>
                  {testResults.aiAnalysis.fullResponse.vitalSignsAnalysis?.concerningValues?.map((value: string, i: number) => (
                    <div key={i} className="bg-red-50 p-2 rounded text-sm text-red-700 mb-1">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">AI Recommendations</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {testResults.aiAnalysis.fullResponse.imageAnalysis?.recommendations?.map((rec: string, i: number) => (
                    <div key={i} className="bg-blue-50 p-2 rounded text-sm flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {rec}
                    </div>
                  ))}
                  {testResults.aiAnalysis.fullResponse.vitalSignsAnalysis?.recommendations?.map((rec: string, i: number) => (
                    <div key={i} className="bg-green-50 p-2 rounded text-sm flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Activity className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold">Trauma Linker System Status</h3>
              {testResults.database && testResults.aiAnalysis && testResults.emergencyManagement && (
                <div className="flex justify-center space-x-4 mt-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Database: {testResults.database.status === 'passed' ? '✅ Online' : '❌ Error'}
                  </Badge>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    AI Analysis: {testResults.aiAnalysis.status === 'passed' ? '✅ Active' : '❌ Error'}
                  </Badge>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Emergency Management: {testResults.emergencyManagement.status === 'passed' ? '✅ Ready' : '❌ Error'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemTestResults;