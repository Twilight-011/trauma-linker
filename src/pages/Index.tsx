import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PatientAssessment from '@/components/PatientAssessment';
import MedicalHistory from '@/components/MedicalHistory';
import TriageClassification from '@/components/TriageClassification';
import HospitalNotification from '@/components/HospitalNotification';
import CurrentCaseInfo from '@/components/CurrentCaseInfo';
import CaseSummary from '@/components/CaseSummary';
import RealTimeHospitalList from '@/components/RealTimeHospitalList';
import LiveLocationTracker from '@/components/LiveLocationTracker';
import EmergencyResponseAgent from '@/components/EmergencyResponseAgent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from '@/hooks/useLocation';
import { TestTube, Activity, Database } from 'lucide-react';

const Index = () => {
  const { getCurrentLocation } = useLocation();
  
  // Request location access when the page loads
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* System Test Navigation */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <TestTube className="h-5 w-5 mr-2" />
              System Testing & Demonstration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/test">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Basic Tests
                </Button>
              </Link>
              <Link to="/system-test">
                <Button variant="outline" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Complete System Test
                </Button>
              </Link>
              <Link to="/new-patient">
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  Patient Input Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <CurrentCaseInfo />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PatientAssessment />
            <MedicalHistory />
          </div>
          
          <div className="space-y-6">
            <TriageClassification />
            <HospitalNotification />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RealTimeHospitalList />
          <div className="space-y-6">
            <LiveLocationTracker />
            <EmergencyResponseAgent />
          </div>
        </div>
        
        <CaseSummary />
      </div>
    </Layout>
  );
};

export default Index;