
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Building2, AlertTriangle, RefreshCw, Map, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';
import { NearestHospital } from '@/types/emergency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RealTimeHospitalList = () => {
  const { toast } = useToast();
  const { currentLocation, getCurrentLocation } = useLocation();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [filterBy, setFilterBy] = useState<'distance' | 'available' | 'specialty'>('distance');
  const [hospitals, setHospitals] = useState<NearestHospital[]>([]);
  
  // Fetch hospitals based on user location
  useEffect(() => {
    if (currentLocation) {
      fetchNearbyHospitals(currentLocation);
    }
  }, [currentLocation]);
  
  const fetchNearbyHospitals = (location: any) => {
    setLoading(true);
    
    // Simulate API call with sample data - in real app would use actual APIs
    setTimeout(() => {
      const sampleHospitals: NearestHospital[] = [
        {
          name: 'AIIMS Delhi',
          distance: '4.2 km',
          eta: '12 min',
          notified: false,
          orStatus: 'Available',
          specialties: ['Trauma', 'Orthopedics', 'Neurosurgery'],
          address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
          phone: '+91-11-2658-7900',
          patientCapacity: {
            total: 250,
            current: 180,
            available: 70
          },
          departments: [
            { name: 'Emergency', status: 'available', waitTime: '15 min' }
          ]
        },
        {
          name: 'Max Hospital',
          distance: '6.1 km',
          eta: '18 min',
          notified: false,
          orStatus: 'Busy',
          specialties: ['Cardiology', 'General Surgery'],
          address: 'Press Enclave Road, Saket, New Delhi',
          phone: '+91-11-2651-5050',
          patientCapacity: {
            total: 180,
            current: 150,
            available: 30
          },
          departments: [
            { name: 'Emergency', status: 'busy', waitTime: '35 min' }
          ]
        },
        {
          name: 'Apollo Hospital',
          distance: '8.3 km',
          eta: '22 min',
          notified: false,
          orStatus: 'Available',
          specialties: ['Cardiology', 'Neurology', 'Pediatrics'],
          address: 'Sarita Vihar, Delhi Mathura Road, New Delhi',
          phone: '+91-11-2692-5858',
          patientCapacity: {
            total: 200,
            current: 120,
            available: 80
          },
          departments: [
            { name: 'Emergency', status: 'available', waitTime: '10 min' }
          ]
        },
        {
          name: 'Fortis Hospital',
          distance: '9.7 km',
          eta: '24 min',
          notified: false,
          orStatus: 'Limited',
          specialties: ['Cardiology', 'Orthopedics'],
          address: 'Okhla road, Sukhdev Vihar, New Delhi',
          phone: '+91-11-4277-6222',
          patientCapacity: {
            total: 150,
            current: 110,
            available: 40
          },
          departments: [
            { name: 'Emergency', status: 'busy', waitTime: '30 min' }
          ]
        }
      ];
      
      setHospitals(sampleHospitals);
      setLastUpdate(new Date());
      setLoading(false);
      
      toast({
        title: "Hospital List Updated",
        description: `Found ${sampleHospitals.length} hospitals near your location`,
      });
    }, 1500);
  };
  
  const handleRefresh = () => {
    getCurrentLocation();
    toast({
      title: "Updating Hospital List",
      description: "Getting your current location...",
    });
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value as 'distance' | 'available' | 'specialty');
    
    // Apply sorting based on filter
    const sortedHospitals = [...hospitals];
    if (value === 'distance') {
      sortedHospitals.sort((a, b) => 
        parseFloat(a.distance.replace(' km', '')) - parseFloat(b.distance.replace(' km', ''))
      );
    } else if (value === 'available') {
      sortedHospitals.sort((a, b) => 
        (b.patientCapacity?.available || 0) - (a.patientCapacity?.available || 0)
      );
    } else if (value === 'specialty') {
      sortedHospitals.sort((a, b) => 
        (b.specialties?.length || 0) - (a.specialties?.length || 0)
      );
    }
    
    setHospitals(sortedHospitals);
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
            disabled={loading}
            className="h-8"
          >
            {loading ? (
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
              {currentLocation ? 'Near current location' : 'Location needed'}
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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <RefreshCw className="h-8 w-8 animate-spin mb-2" />
            <p>Finding nearby hospitals...</p>
            <p className="text-xs mt-1">Using your current location</p>
          </div>
        ) : hospitals.length > 0 ? (
          <div className="space-y-3">
            {hospitals.map((hospital, index) => (
              <HospitalItem key={index} hospital={hospital} />
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
              <MapPin className="h-4 w-4 mr-1" />
              Get Your Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface HospitalItemProps {
  hospital: NearestHospital;
}

const HospitalItem = ({ hospital }: HospitalItemProps) => {
  const { toast } = useToast();
  
  const handleNotify = () => {
    toast({
      title: "Hospital Notified",
      description: `${hospital.name} has been notified about the incoming patient.`,
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
      
      <div className="mt-3 flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
          <MapPin className="h-3 w-3 mr-1" />
          Directions
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-7 flex-1"
          onClick={handleNotify}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Notify
        </Button>
        <Button variant="default" size="sm" className="text-xs h-7 flex-1">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default RealTimeHospitalList;
