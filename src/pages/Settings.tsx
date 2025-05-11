
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HospitalSettings from '@/components/HospitalSettings';
import HospitalStatistics from '@/components/HospitalStatistics';
import NearbyHospitals from '@/components/NearbyHospitals';

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="hospital-settings">
          <TabsList className="mb-4">
            <TabsTrigger value="hospital-settings">Hospital Settings</TabsTrigger>
            <TabsTrigger value="hospital-info">Hospital Information</TabsTrigger>
            <TabsTrigger value="nearby-hospitals">Nearby Hospitals</TabsTrigger>
            <TabsTrigger value="app-settings">App Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hospital-settings">
            <HospitalSettings />
          </TabsContent>
          
          <TabsContent value="hospital-info">
            <HospitalStatistics />
          </TabsContent>
          
          <TabsContent value="nearby-hospitals">
            <NearbyHospitals />
          </TabsContent>
          
          <TabsContent value="app-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Application settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
