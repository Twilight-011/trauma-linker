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

  const testAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const testData = {
        vitalSigns: {
          heartRate: 110,
          bloodPressure: '90/60',
          spO2: 94,
          respRate: 22,
          gcs: 14,
          temperature: 98.6
        },
        patientData: {
          age: 35,
          gender: 'Male',
          incidentType: 'Motor Vehicle Accident'
        },
        imageData: 'test-image-data'
      };

      const { data, error } = await supabase.functions.invoke('ai-medical-analysis', {
        body: testData
      });

      if (error) throw error;

      toast({
        title: 'AI Analysis Test Successful',
        description: `Analysis completed with ${data.overallConfidence}% confidence`,
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