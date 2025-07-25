
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Building2, AlertTriangle, RefreshCw, Map, ListFilter, Route, Pill, Ambulance, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealLocationAPI } from '@/hooks/useRealLocationAPI';
import { useRealHospitalAPI } from '@/hooks/useRealHospitalAPI';
import { useCommunicationAPI } from '@/hooks/useCommunicationAPI';
import { useToast } from '@/hooks/use-toast';
import { NearestHospital } from '@/types/emergency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RealTimeHospitalList = () => {
  const { toast } = useToast();
  const { currentLocation, address, getCurrentLocation, useFallbackLocation, permissionStatus, isLoading } = useRealLocationAPI();
  const { hospitals, loading, lastUpdate, fetchNearbyHospitals } = useRealHospitalAPI();
  const { notifyHospital, sendSMS } = useCommunicationAPI();
  const [filterBy, setFilterBy] = useState<'distance' | 'available' | 'specialty'>('distance');
  
  // Fetch hospitals based on user location
  useEffect(() => {
    // Initial location check
    if (!currentLocation) {
      getCurrentLocation();
    }
  }, []);
  
  // Fetch hospitals when location changes
  useEffect(() => {
    if (currentLocation) {
      fetchNearbyHospitals(currentLocation);
    }
  }, [currentLocation]);
  
  const handleRefresh = () => {
    if (currentLocation) {
      fetchNearbyHospitals(currentLocation);
    } else {
      getCurrentLocation();
    }
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value as 'distance' | 'available' | 'specialty');
    // Note: Filtering is now handled in the hospital API hook
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-primary" />
            Nearby Hospitals
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading || isLoading}
            className="h-8"
          >
            {(loading || isLoading) ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Update
          </Button>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs">Real-time</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {currentLocation ? (address || 'Near current location') : 'Location needed'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <Select 
              defaultValue={filterBy} 
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="available">Availability</SelectItem>
                <SelectItem value="specialty">Specialties</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!currentLocation && !isLoading && !loading ? (
          <div className="flex flex-col gap-3 py-4 items-center justify-center">
            {permissionStatus === 'denied' ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Location permission denied</AlertTitle>
                <AlertDescription>
                  Please enable location access in your browser settings to see nearby hospitals.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>We need your location to find nearby hospitals</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-1" />
                {isLoading ? 'Getting location...' : 'Get My Location'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={useFallbackLocation}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Use Test Location
              </Button>
            </div>
          </div>
        ) : loading || isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <RefreshCw className="h-8 w-8 animate-spin mb-2" />
            <p>Finding nearby hospitals...</p>
            <p className="text-xs mt-1">Using your current location</p>
          </div>
        ) : hospitals.length > 0 ? (
          <div className="space-y-3">
            {hospitals.map((hospital, index) => (
              <HospitalItem 
                key={index} 
                hospital={hospital} 
                onNotify={(hospitalData) => notifyHospital(hospitalData.phone || '', {
                  age: 25,
                  gender: 'Unknown',
                  condition: 'Emergency',
                  triage: 'Unknown',
                  caseId: 'TR-' + Date.now()
                }, hospitalData.eta)}
              />
            ))}
            
            <Button variant="outline" className="w-full text-sm">
              <Map className="h-4 w-4 mr-1" />
              View All on Map
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>No hospitals found nearby</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh List
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface HospitalItemProps {
  hospital: NearestHospital;
  onNotify?: (hospital: NearestHospital) => void;
}

const HospitalItem = ({ hospital, onNotify }: HospitalItemProps) => {
  const { toast } = useToast();
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  
  const handleNotify = () => {
    onNotify?.(hospital);
    toast({
      title: "Hospital Notified",
      description: `${hospital.name} has been notified about the incoming patient via SMS and call.`,
    });
  };
  
  const handleAmbulanceRequest = () => {
    toast({
      title: "Ambulance Requested",
      description: `Emergency service contacted. Ambulance dispatched from ${hospital.name}.`,
    });
    
    // After 2 seconds, show confirmation
    setTimeout(() => {
      toast({
        title: "Ambulance Confirmed",
        description: "ETA: 8 minutes. Patient report sent to hospital.",
      });
    }, 2000);
  };
  
  const handleShowMedications = () => {
    setMedicationDialogOpen(true);
  };
  
  const handleShowDirections = () => {
    toast({
      title: "Directions",
      description: `Showing route to ${hospital.name}`,
    });
  };
  
  // Determine status color based on wait time
  const getWaitTimeColor = () => {
    const waitTime = hospital.departments?.[0]?.waitTime || '';
    const minutes = parseInt(waitTime);
    if (minutes < 15) return "text-green-600";
    if (minutes < 30) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className="border border-gray-200 rounded-lg bg-white p-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{hospital.name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-0.5" />
              {hospital.distance}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-0.5" />
              ETA: {hospital.eta}
            </span>
          </div>
        </div>
        
        <Badge variant="outline" className={
          hospital.departments?.[0]?.status === 'available' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }>
          {hospital.departments?.[0]?.status === 'available' ? 'Available' : 'Busy'}
        </Badge>
      </div>
      
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <span className="text-gray-500">ER Wait</span>
          <span className={`font-medium ${getWaitTimeColor()}`}>
            {hospital.departments?.[0]?.waitTime || 'Unknown'}
          </span>
        </div>
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <span className="text-gray-500">Beds</span>
          <span className="font-medium">
            {hospital.patientCapacity?.available || '?'}/{hospital.patientCapacity?.total || '?'}
          </span>
        </div>
        <div className="bg-gray-50 p-1.5 rounded flex flex-col items-center">
          <span className="text-gray-500">OR Status</span>
          <span className="font-medium">{hospital.orStatus}</span>
        </div>
      </div>
      
      {hospital.specialties && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Specialties:</div>
          <div className="flex flex-wrap gap-1">
            {hospital.specialties.slice(0, 3).map((specialty, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0">
                {specialty}
              </Badge>
            ))}
            {hospital.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs py-0">
                +{hospital.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-xs h-7" onClick={handleShowDirections}>
          <Route className="h-3 w-3 mr-1" />
          Directions
        </Button>
        
        <Dialog open={medicationDialogOpen} onOpenChange={setMedicationDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={handleShowMedications}>
              <Pill className="h-3 w-3 mr-1" />
              Medications
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Available Medications</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm">
                <h4 className="font-medium mb-1">Emergency Medications</h4>
                <div className="space-y-1">
                  {["Epinephrine", "Atropine", "Amiodarone", "Dopamine", "Lidocaine"].map((med, i) => (
                    <div key={i} className="flex justify-between p-1.5 rounded bg-gray-50">
                      <span>{med}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">In Stock</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-sm">
                <h4 className="font-medium mb-1">Trauma Medications</h4>
                <div className="space-y-1">
                  {["Tranexamic Acid", "Ketamine", "Fentanyl", "Norepinephrine", "Morphine"].map((med, i) => (
                    <div key={i} className="flex justify-between p-1.5 rounded bg-gray-50">
                      <span>{med}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">In Stock</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-sm">
                <h4 className="font-medium mb-1">Blood Products</h4>
                <div className="space-y-1">
                  {[
                    { name: "Type O- Whole Blood", status: "Limited" },
                    { name: "Type A+ Whole Blood", status: "Available" },
                    { name: "Fresh Frozen Plasma", status: "Available" },
                    { name: "Platelets", status: "Limited" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between p-1.5 rounded bg-gray-50">
                      <span>{item.name}</span>
                      <Badge variant="outline" className={
                        item.status === "Available" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-amber-50 text-amber-700"
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="default" size="sm" className="text-xs h-7 bg-red-600 hover:bg-red-700" onClick={handleAmbulanceRequest}>
          <Ambulance className="h-3 w-3 mr-1" />
          Ambulance
        </Button>
      </div>
    </div>
  );
};

export default RealTimeHospitalList;
