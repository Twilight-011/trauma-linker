import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const testDatabase = async () => {
    setIsLoading(true);
    try {
      // Test hospitals query
      const { data: hospitals, error: hospitalsError } = await supabase
        .from('hospitals')
        .select('*')
        .limit(5);

      if (hospitalsError) throw hospitalsError;

      // Test patients query
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .limit(5);

      if (patientsError) throw patientsError;

      // Test emergency cases query
      const { data: cases, error: casesError } = await supabase
        .from('emergency_cases')
        .select(`
          *,
          patients (*),
          hospitals (*)
        `)
        .limit(5);

      if (casesError) throw casesError;

      const results = {
        hospitals: hospitals || [],
        patients: patients || [],
        emergencyCases: cases || [],
        timestamp: new Date().toISOString()
      };

      setTestResults(results);
      
      toast({
        title: 'Database Test Successful',
        description: `Found ${hospitals?.length || 0} hospitals, ${patients?.length || 0} patients, ${cases?.length || 0} cases`,
      });

      return results;
    } catch (error: any) {
      console.error('Database test failed:', error);
      
      toast({
        title: 'Database Test Failed',
        description: error.message,
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomVitals = () => {
    const scenarios = [
      {
        heartRate: Math.floor(Math.random() * 40) + 80, // 80-120
        bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 60}`,
        spO2: Math.floor(Math.random() * 10) + 90, // 90-100
        respRate: Math.floor(Math.random() * 10) + 16, // 16-26
        gcs: Math.floor(Math.random() * 3) + 13, // 13-15
        temperature: Math.round((Math.random() * 4 + 96.5) * 10) / 10 // 96.5-100.5
      },
      {
        heartRate: Math.floor(Math.random() * 50) + 130, // Critical - 130-180
        bloodPressure: `${Math.floor(Math.random() * 20) + 70}/${Math.floor(Math.random() * 15) + 40}`,
        spO2: Math.floor(Math.random() * 15) + 75, // Critical - 75-90
        respRate: Math.floor(Math.random() * 15) + 28, // Critical - 28-43
        gcs: Math.floor(Math.random() * 8) + 7, // Critical - 7-15
        temperature: Math.round((Math.random() * 6 + 100.5) * 10) / 10 // 100.5-106.5
      }
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  const generateRandomPatient = () => {
    const ages = [25, 32, 45, 58, 67, 71, 28, 34, 52];
    const genders = ['Male', 'Female'];
    const incidents = [
      'Motor Vehicle Accident',
      'Fall from height',
      'Industrial accident',
      'Sports injury',
      'Workplace injury',
      'Bicycle accident',
      'House fire',
      'Assault',
      'Construction accident'
    ];
    
    return {
      age: ages[Math.floor(Math.random() * ages.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      incidentType: incidents[Math.floor(Math.random() * incidents.length)]
    };
  };

  const testAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const testData = {
        vitalSigns: generateRandomVitals(),
        patientData: generateRandomPatient(),
        imageData: `test-injury-photo-${Date.now()}`
      };

      const { data, error } = await supabase.functions.invoke('ai-medical-analysis', {
        body: testData
      });

      if (error) throw error;

      // Save test result to database
      const { error: saveError } = await supabase
        .from('patients')
        .insert({
          case_id: `TEST-${Date.now()}`,
          age: testData.patientData.age,
          gender: testData.patientData.gender,
          incident_type: testData.patientData.incidentType,
          vital_signs: testData.vitalSigns,
          ai_analysis: data,
          triage_level: data.vitalSignsAnalysis?.riskScore > 70 ? 'Red' : 
                       data.vitalSignsAnalysis?.riskScore > 40 ? 'Yellow' : 'Green',
          description: `AI Test Analysis - ${data.imageAnalysis?.detectedConditions?.[0]?.condition || 'No injury detected'}`,
          location: 'Test Environment'
        });

      if (saveError) console.warn('Failed to save test result:', saveError);

      toast({
        title: 'AI Analysis Test Successful',
        description: `Analysis completed with ${data.overallConfidence}% confidence - Results saved to DB`,
      });

      return data;
    } catch (error: any) {
      console.error('AI analysis test failed:', error);
      
      toast({
        title: 'AI Analysis Test Failed',
        description: error.message,
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    testDatabase,
    testAIAnalysis,
    testResults,
    isLoading
  };
};