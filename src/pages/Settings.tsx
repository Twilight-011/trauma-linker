
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, File, MapPin, ListFilter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HospitalSettings from '@/components/HospitalSettings';
import HospitalStatistics from '@/components/HospitalStatistics';
import NearbyHospitals from '@/components/NearbyHospitals';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="hospital-settings">
          <TabsList className="mb-4">
            <TabsTrigger value="hospital-settings">Hospital Settings</TabsTrigger>
            <TabsTrigger value="hospital-info">Hospital Information</TabsTrigger>
            <TabsTrigger value="nearby-hospitals">Nearby Hospitals</TabsTrigger>
            <TabsTrigger value="hospital-list">Hospital List</TabsTrigger>
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
          
          <TabsContent value="hospital-list">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Hospital List Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Display Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">Configure how hospital information is displayed</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="real-time-updates" className="font-medium">Real-time Updates</Label>
                          <p className="text-xs text-gray-500">Automatically update hospital data</p>
                        </div>
                        <Switch id="real-time-updates" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="location-tracking" className="font-medium">Location Tracking</Label>
                          <p className="text-xs text-gray-500">Update hospital list based on location</p>
                        </div>
                        <Switch id="location-tracking" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-unavailable" className="font-medium">Show Unavailable Hospitals</Label>
                          <p className="text-xs text-gray-500">Include hospitals with no capacity</p>
                        </div>
                        <Switch id="show-unavailable" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-refresh" className="font-medium">Auto-refresh Interval</Label>
                          <p className="text-xs text-gray-500">How often to update hospital data</p>
                        </div>
                        <Select defaultValue="60">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                            <SelectItem value="0">Manual only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Default Sorting</h3>
                    <p className="text-sm text-gray-500 mb-4">Set default hospital list sorting</p>
                    
                    <RadioGroup defaultValue="distance" className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distance" id="distance" />
                        <Label htmlFor="distance" className="cursor-pointer">
                          <div className="font-medium">Distance</div>
                          <div className="text-xs text-gray-500">Sort hospitals by proximity</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="availability" id="availability" />
                        <Label htmlFor="availability" className="cursor-pointer">
                          <div className="font-medium">Availability</div>
                          <div className="text-xs text-gray-500">Sort by capacity and ER wait time</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialty" id="specialty" />
                        <Label htmlFor="specialty" className="cursor-pointer">
                          <div className="font-medium">Specialty</div>
                          <div className="text-xs text-gray-500">Sort by relevant medical specialties</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Filter Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">Configure default filter options</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="max-distance" className="font-medium">Maximum Distance</Label>
                          <p className="text-xs text-gray-500">Maximum distance to search</p>
                        </div>
                        <Select defaultValue="15">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                            <SelectItem value="15">15 km</SelectItem>
                            <SelectItem value="25">25 km</SelectItem>
                            <SelectItem value="50">50 km</SelectItem>
                            <SelectItem value="100">100 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="min-capacity" className="font-medium">Minimum Available Capacity</Label>
                          <p className="text-xs text-gray-500">Minimum available beds</p>
                        </div>
                        <Select defaultValue="0">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="5">5 beds</SelectItem>
                            <SelectItem value="10">10 beds</SelectItem>
                            <SelectItem value="20">20 beds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="include-trauma" className="font-medium">Required Trauma Level</Label>
                          <p className="text-xs text-gray-500">Minimum trauma center level</p>
                        </div>
                        <Select defaultValue="any">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">Level 1</SelectItem>
                            <SelectItem value="2">Level 2</SelectItem>
                            <SelectItem value="3">Level 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
