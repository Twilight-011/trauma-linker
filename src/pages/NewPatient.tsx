
import React from 'react';
import Layout from '@/components/Layout';
import PatientInputForm from '@/components/PatientInputForm';
import PatientAssessment from '@/components/PatientAssessment';
import EmergencyResponseAgent from '@/components/EmergencyResponseAgent';
import LiveLocationTracker from '@/components/LiveLocationTracker';

const NewPatient = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">Emergency Patient Assessment</h1>
        <p className="text-gray-600 text-center mb-6">Complete this form to assess an unidentified patient at the accident site</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EmergencyResponseAgent />
            <PatientInputForm />
          </div>
          
          <div className="space-y-6">
            <LiveLocationTracker />
            <PatientAssessment />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewPatient;
