
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

const PreviousPatients = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Previous Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Previous patients list coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PreviousPatients;
