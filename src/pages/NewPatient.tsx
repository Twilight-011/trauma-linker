
import React from 'react';
import Layout from '@/components/Layout';
import PatientInputForm from '@/components/PatientInputForm';

const NewPatient = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">Emergency Patient Assessment</h1>
        <p className="text-gray-600 text-center mb-6">Complete this form to assess an unidentified patient at the accident site</p>
        <PatientInputForm />
      </div>
    </Layout>
  );
};

export default NewPatient;
