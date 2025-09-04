
import React, { useState } from 'react';
import { Hospital, Clock, MapPin, Phone, Mail, Route, Activity, Bed, UserRound, AlertCircle, Building, Users } from 'lucide-react';
import { NearestHospital } from '@/types/emergency';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface HospitalInfoProps {
  hospital: NearestHospital;
}

const HospitalInfo = ({ hospital }: HospitalInfoProps) => {
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date>(new Date());
  
  // In a real app, this would fetch updated data
  const refreshData = () => {
    setRefreshTimestamp(new Date());
  };

  // Auto refresh data every 60 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <div className="flex items-start gap-2">
        <Hospital className="h-4 w-4 text-blue-600 mt-0.5" />
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Nearest Trauma Center</p>
            <p className="text-xs font-medium">ETA: {hospital.eta}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm">{hospital.name}</p>
            <Badge variant={hospital.notified ? "success" : "outline"} className="text-xs">
              {hospital.notified ? 'Notified' : 'Pending'}
            </Badge>
          </div>

          <Tabs defaultValue="info" className="mt-2">
            <TabsList className="grid w-full grid-cols-4 h-7">
              <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs">Contacts</TabsTrigger>
              <TabsTrigger value="capacity" className="text-xs">Capacity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="pt-2 space-y-2 text-xs">
              {hospital.address && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 text-blue-600 mr-1" />
                  <span>{hospital.address}</span>
                </div>
              )}
              
              {hospital.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 text-blue-600 mr-1" />
                  <a href={`tel:${hospital.phone}`} className="hover:underline">{hospital.phone}</a>
                </div>
              )}
              
              {hospital.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 text-blue-600 mr-1" />
                  <a href={`mailto:${hospital.email}`} className="hover:underline">{hospital.email}</a>
                </div>
              )}
              
              <div className="flex items-center">
                <Route className="h-3 w-3 text-blue-600 mr-1" />
                <span>Distance: {hospital.distance}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-600">Open ICU Beds</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    {hospital.resources?.icuBeds || 4}
                  </Badge>
                </div>
                <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-600">Trauma Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    {hospital.traumaTeam || "Ready"}
                  </Badge>
                </div>
              </div>
              
              {hospital.departments && (
                <div className="mt-2">
                  <p className="text-blue-700 text-xs font-medium mb-1">Department Wait Times:</p>
                  <div className="space-y-1">
                    {hospital.departments.map((dept, i) => (
                      <div key={i} className="flex justify-between items-center p-1.5 bg-white border border-blue-100 rounded">
                        <span>{dept.name}</span>
                        <Badge variant={
                          dept.status === 'available' 
                            ? "outline" 
                            : dept.status === 'busy' 
                              ? "secondary" 
                              : "destructive"
                        } className="text-xs">
                          {dept.waitTime || 'N/A'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resources" className="pt-2 space-y-2 text-xs">
              {hospital.specialties && (
                <div>
                  <p className="text-blue-700 text-xs font-medium mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-white">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {hospital.bloodBank && (
                <div>
                  <p className="text-blue-700 text-xs font-medium mb-1">Blood Bank:</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {hospital.bloodBank.map((blood, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs bg-white">
                              {blood}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Available</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-blue-700 text-xs font-medium mb-1">Equipment:</p>
                <div className="grid grid-cols-2 gap-1">
                  <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                    <span className="text-xs flex items-center">
                      <Activity className="h-3 w-3 mr-1 text-blue-600" />
                      Ventilators
                    </span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {hospital.resources?.ventilators || 3}
                    </Badge>
                  </div>
                  <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                    <span className="text-xs flex items-center">
                      <Bed className="h-3 w-3 mr-1 text-blue-600" />
                      ICU Beds
                    </span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {hospital.resources?.icuBeds || 4}
                    </Badge>
                  </div>
                  <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                    <span className="text-xs flex items-center">
                      <UserRound className="h-3 w-3 mr-1 text-blue-600" />
                      OR Teams
                    </span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {hospital.resources?.operatingRooms || 2}
                    </Badge>
                  </div>
                  <div className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                    <span className="text-xs flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 text-blue-600" />
                      CT Available
                    </span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {hospital.capabilities?.hasStrokeUnit ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {hospital.traumaTeam && (
                <div className="flex items-center bg-white p-1.5 border border-blue-100 rounded">
                  <span className="text-xs text-blue-700 mr-1">Trauma Team:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    {hospital.traumaTeam}
                  </Badge>
                </div>
              )}
              
              {hospital.facilities && (
                <div className="mt-2">
                  <p className="text-blue-700 text-xs font-medium mb-1">Facilities:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {hospital.facilities.map((facility, i) => (
                      <div key={i} className="border border-blue-100 rounded bg-white p-1.5 flex items-center justify-between">
                        <span className="text-xs">{facility.type}</span>
                        <Badge variant={facility.available ? "outline" : "secondary"} className="text-xs">
                          {facility.available ? `Available ${facility.count || ''}` : 'Unavailable'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contacts" className="pt-2 text-xs">
              {hospital.contacts ? (
                <div className="space-y-2">
                  {hospital.contacts.map((contact, index) => (
                    <div key={index} className="border border-blue-100 bg-white p-2 rounded">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-gray-600">{contact.role}</div>
                      <div className="mt-1 flex flex-col space-y-1">
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="flex items-center hover:text-blue-600">
                            <Phone className="h-3 w-3 mr-1 text-blue-600" />
                            {contact.phone}
                          </a>
                        )}
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="flex items-center hover:text-blue-600">
                            <Mail className="h-3 w-3 mr-1 text-blue-600" />
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-blue-200 rounded p-2 text-center">
                  <p>No specific contacts available</p>
                  <p>Use general hospital contact information</p>
                </div>
              )}
              
              <div className="mt-2 p-2 bg-blue-100 rounded">
                <p className="font-medium">Emergency Contacts</p>
                <div className="flex items-center justify-between mt-1">
                  <a href="tel:+911126588700" className="flex items-center hover:text-blue-600">
                    <Phone className="h-3 w-3 mr-1 text-blue-600" />
                    Emergency Desk
                  </a>
                  <span>24/7</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="capacity" className="pt-2 text-xs">
              {hospital.patientCapacity ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-700 font-medium">Bed Capacity</span>
                      <span>
                        {hospital.patientCapacity.current}/{hospital.patientCapacity.total} occupied
                      </span>
                    </div>
                    <Progress 
                      value={(hospital.patientCapacity.current / hospital.patientCapacity.total) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-green-600">
                        {hospital.patientCapacity.available} available
                      </span>
                      <span className="text-gray-500">
                        {Math.round((hospital.patientCapacity.current / hospital.patientCapacity.total) * 100)}% occupancy
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-blue-100 rounded p-2">
                    <div className="flex items-center mb-1">
                      <Building className="h-3 w-3 mr-1 text-blue-600" />
                      <span className="font-medium">Department Capacity</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded">
                        <span className="text-gray-600">ER</span>
                        <span className="font-medium text-amber-600">80% Full</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded">
                        <span className="text-gray-600">ICU</span>
                        <span className="font-medium text-red-600">95% Full</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded">
                        <span className="text-gray-600">Surgery</span>
                        <span className="font-medium text-green-600">60% Full</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded">
                        <span className="text-gray-600">General</span>
                        <span className="font-medium text-amber-600">75% Full</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-blue-100 rounded p-2">
                    <div className="flex items-center mb-1">
                      <Users className="h-3 w-3 mr-1 text-blue-600" />
                      <span className="font-medium">Staffing Status</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                        <span>Trauma Team</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                        <span>Orthopedic Team</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">On Call</Badge>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                        <span>Neurosurgery Team</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">Limited</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 text-right text-[10px]">
                    Last updated: {refreshTimestamp.toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <p>Capacity data unavailable</p>
                  <p className="text-gray-500 mt-1">Please contact hospital directly</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;
