
import React from 'react';
import Layout from '@/components/Layout';
import PatientAssessment from '@/components/PatientAssessment';
import MedicalHistory from '@/components/MedicalHistory';
import TriageClassification from '@/components/TriageClassification';
import HospitalNotification from '@/components/HospitalNotification';
import CurrentCaseInfo from '@/components/CurrentCaseInfo';
import CaseSummary from '@/components/CaseSummary';
import RealTimeHospitalList from '@/components/RealTimeHospitalList';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
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
        
        <RealTimeHospitalList />
        <CaseSummary />
      </div>
    </Layout>
  );
};

export default Index;
