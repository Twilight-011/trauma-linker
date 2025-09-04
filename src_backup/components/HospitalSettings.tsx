
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Sliders, MapPin, Bell, FileText, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HospitalSettings = () => {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [notificationLevel, setNotificationLevel] = useState<string>('important');
  const [searchRadius, setSearchRadius] = useState<number[]>([10]);
  const [preferredHospitalTypes, setPreferredHospitalTypes] = useState({
    traumaCenter: true,
    pediatric: false,
    cardiac: true,
    burn: false,
    psychiatric: false,
    orthopedic: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your hospital information settings have been updated.",
    });
  };

  const handleResetSettings = () => {
    setAutoRefresh(true);
    setLocationTracking(true);
    setNotificationLevel('important');
    setSearchRadius([10]);
    setPreferredHospitalTypes({
      traumaCenter: true,
      pediatric: false,
      cardiac: true,
      burn: false,
      psychiatric: false,
      orthopedic: true,
    });
    
    toast({
      title: "Settings Reset",
      description: "Your hospital information settings have been reset to defaults.",
    });
  };

  const handleSpecialtyToggle = (key: keyof typeof preferredHospitalTypes) => {
    setPreferredHospitalTypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Hospital Information Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preferences">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-4 pt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="search-radius" className="text-sm font-medium">Search Radius</Label>
                  <p className="text-xs text-gray-500">How far to search for hospitals</p>
                </div>
                <div className="w-[180px] flex items-center gap-2">
                  <Slider
                    id="search-radius"
                    defaultValue={[10]}
                    max={50}
                    min={1}
                    step={1}
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                  />
                  <span className="text-sm font-medium w-12">{searchRadius[0]} km</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Preferred Hospital Types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(preferredHospitalTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch 
                        id={`hospital-${key}`} 
                        checked={value}
                        onCheckedChange={() => handleSpecialtyToggle(key as keyof typeof preferredHospitalTypes)}
                      />
                      <Label htmlFor={`hospital-${key}`} className="text-sm">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 pt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-gray-500">Get alerts about hospital status changes</p>
                </div>
                <Switch checked={true} />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notification Level</Label>
                <RadioGroup 
                  defaultValue={notificationLevel} 
                  onValueChange={setNotificationLevel}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-sm">All Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="important" />
                    <Label htmlFor="important" className="text-sm">Important Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="text-sm">Critical Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4 pt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-refresh" className="text-sm font-medium">
                    Auto-Refresh Hospital Data
                  </Label>
                  <p className="text-xs text-gray-500">
                    Updates every 5 minutes
                  </p>
                </div>
                <Switch 
                  id="auto-refresh" 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-tracking" className="text-sm font-medium">
                    Location-Based Updates
                  </Label>
                  <p className="text-xs text-gray-500">
                    Updates when your location changes
                  </p>
                </div>
                <Switch 
                  id="location-tracking" 
                  checked={locationTracking}
                  onCheckedChange={setLocationTracking}
                />
              </div>
              
              <Separator />
              
              <div className="pt-2 flex justify-between gap-2">
                <Button variant="outline" className="w-full" onClick={handleResetSettings}>
                  Reset to Defaults
                </Button>
                <Button className="w-full" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HospitalSettings;
