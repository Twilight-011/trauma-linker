
import React from 'react';
import Layout from '@/components/Layout';
import PatientInputForm from '@/components/PatientInputForm';

const NewPatient = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <PatientInputForm />
      </div>
    </Layout>
  );
};

export default NewPatient;
