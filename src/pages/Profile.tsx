
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  Calendar, 
  Shield 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PatientServicesList from '@/components/profile/PatientServicesList';
import RecentActivities from '@/components/profile/RecentActivities';

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/10">
                  <AvatarImage src="" alt="Dr. Sharma" />
                  <AvatarFallback className="text-2xl bg-primary/10">VS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">Dr. Vikas Sharma</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                      Emergency Medicine
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                      Active
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                  <Clock className="w-3 h-3 mr-1" /> On Duty
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
                  <Calendar className="w-3 h-3 mr-1" /> 108-A6 Team
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                  <Shield className="w-3 h-3 mr-1" /> Level 3 Access
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>vikas.sharma@traumalinkindia.org</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>AIIMS Delhi, Trauma Center</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Professional Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>Senior Emergency Medicine Specialist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Medical License: DL-EMD-7821</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Experience: 8+ years</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="services" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="services">Patient Services</TabsTrigger>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              </TabsList>
              <TabsContent value="services">
                <PatientServicesList />
              </TabsContent>
              <TabsContent value="activities">
                <RecentActivities />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
