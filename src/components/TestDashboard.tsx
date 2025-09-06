import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSupabaseTest } from '@/hooks/useSupabaseTest';
import { Database, Brain, Activity, Hospital, Users, AlertTriangle } from 'lucide-react';

const TestDashboard = () => {
  const { testDatabase, testAIAnalysis, testResults, isLoading } = useSupabaseTest();
  const [aiResults, setAiResults] = useState<any>(null);

  const handleDatabaseTest = async () => {
    try {
      await testDatabase();
    } catch (error) {
      console.error('Database test error:', error);
    }
  };

  const handleAITest = async () => {
    try {
      const results = await testAIAnalysis();
      setAiResults(results);
    } catch (error) {
      console.error('AI test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Trauma Linker Test Dashboard</h1>
          <p className="text-gray-600">Test database connectivity and AI model predictions</p>
        </div>

        {/* Test Controls */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDatabaseTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Database Connection'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Model Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAITest} 
                disabled={isLoading}
                className="w-full"
                variant="secondary"
              >
                {isLoading ? 'Analyzing...' : 'Test AI Analysis'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Database Results */}
        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Hospital className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Hospitals:</span>
                  <Badge variant="secondary">{testResults.hospitals?.length || 0}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Patients:</span>
                  <Badge variant="secondary">{testResults.patients?.length || 0}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Active Cases:</span>
                  <Badge variant="secondary">{testResults.emergencyCases?.length || 0}</Badge>
                </div>
              </div>

              <Separator />

              {/* Sample Hospital Data */}
              {testResults.hospitals?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Hospital:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Name:</strong> {testResults.hospitals[0].name}</p>
                    <p><strong>Address:</strong> {testResults.hospitals[0].address}</p>
                    <p><strong>Specialties:</strong> {testResults.hospitals[0].specialties?.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Sample Patient Data */}
              {testResults.patients?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Patient:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Case ID:</strong> {testResults.patients[0].case_id}</p>
                    <p><strong>Age/Gender:</strong> {testResults.patients[0].age}, {testResults.patients[0].gender}</p>
                    <p><strong>Incident:</strong> {testResults.patients[0].incident_type}</p>
                    <p><strong>Triage Level:</strong> 
                      <Badge 
                        variant={testResults.patients[0].triage_level === 'Red' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {testResults.patients[0].triage_level}
                      </Badge>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Results */}
        {aiResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Analysis Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Confidence:</span>
                <Badge variant="secondary">{aiResults.overallConfidence}%</Badge>
              </div>

              <Separator />

              {/* Image Analysis */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Image Analysis Results
                </h4>
                <div className="space-y-2">
                  {aiResults.imageAnalysis?.detectedConditions?.map((condition: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                      <span>{condition.condition}</span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={condition.severity === 'critical' ? 'destructive' : 
                                  condition.severity === 'high' ? 'destructive' : 'secondary'}
                        >
                          {condition.severity}
                        </Badge>
                        <span className="text-sm text-gray-600">{condition.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Signs Analysis */}
              <div>
                <h4 className="font-medium mb-2">Vital Signs Assessment</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p><strong>Risk Score:</strong> {aiResults.vitalSignsAnalysis?.riskScore}/100</p>
                  {aiResults.vitalSignsAnalysis?.concerningValues?.length > 0 && (
                    <div className="mt-2">
                      <strong>Concerning Values:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {aiResults.vitalSignsAnalysis.concerningValues.map((value: string, index: number) => (
                          <li key={index} className="text-red-600">{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-2">AI Recommendations</h4>
                <div className="space-y-1">
                  {[...aiResults.imageAnalysis?.recommendations || [], ...aiResults.vitalSignsAnalysis?.recommendations || []]
                    .map((rec: string, index: number) => (
                      <div key={index} className="flex items-start bg-blue-50 p-2 rounded text-sm">
                        <span className="text-blue-600 mr-2">•</span>
                        {rec}
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestDashboard;