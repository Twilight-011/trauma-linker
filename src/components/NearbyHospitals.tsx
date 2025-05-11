
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, User, Building, ArrowUpDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NearestHospital } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';

const NearbyHospitals = () => {
  const { agentState } = useEmergencyAgent();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'distance' | 'waitTime' | 'capacity'>('distance');
  
  // Sample data - in a real app this would come from an API
  const nearbyHospitals: NearestHospital[] = [
    {
      name: 'AIIMS Delhi',
      distance: '4.2 km',
      eta: '12 min',
      notified: true,
      orStatus: 'Ready',
      specialties: ['Trauma Surgery', 'Orthopedics', 'Neurosurgery'],
      traumaTeam: 'Activated',
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, 110029',
      phone: '+91-11-2658-7900',
      patientCapacity: {
        total: 250,
        current: 180,
        available: 70
      },
      departments: [
        { name: 'Emergency', status: 'available', waitTime: '15 min' },
        { name: 'Trauma', status: 'available', waitTime: '5 min' },
        { name: 'Surgery', status: 'busy', waitTime: '45 min' }
      ]
    },
    {
      name: 'Max Hospital',
      distance: '6.7 km',
      eta: '18 min',
      notified: false,
      orStatus: 'Preparing',
      specialties: ['Cardiology', 'General Surgery', 'Pediatrics'],
      address: 'Press Enclave Road, Saket, New Delhi, 110017',
      phone: '+91-11-2651-5050',
      patientCapacity: {
        total: 180,
        current: 120,
        available: 60
      },
      departments: [
        { name: 'Emergency', status: 'available', waitTime: '10 min' },
        { name: 'Cardiology', status: 'available', waitTime: '30 min' },
        { name: 'Surgery', status: 'busy', waitTime: '60 min' }
      ]
    },
    {
      name: 'Apollo Hospitals',
      distance: '8.3 km',
      eta: '22 min',
      notified: false,
      orStatus: 'Available',
      specialties: ['Cardiology', 'Neurology', 'Oncology'],
      address: 'Sarita Vihar, Delhi Mathura Road, New Delhi, 110076',
      phone: '+91-11-2692-5858',
      patientCapacity: {
        total: 200,
        current: 150,
        available: 50
      },
      departments: [
        { name: 'Emergency', status: 'busy', waitTime: '25 min' },
        { name: 'Neurology', status: 'available', waitTime: '45 min' },
        { name: 'ICU', status: 'unavailable', waitTime: '120 min' }
      ]
    },
    {
      name: 'Sir Ganga Ram Hospital',
      distance: '9.5 km',
      eta: '25 min',
      notified: false,
      orStatus: 'Busy',
      specialties: ['Gastroenterology', 'Nephrology', 'Urology'],
      address: 'Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi, 110060',
      phone: '+91-11-2575-7575',
      patientCapacity: {
        total: 220,
        current: 190,
        available: 30
      },
      departments: [
        { name: 'Emergency', status: 'busy', waitTime: '30 min' },
        { name: 'Gastro', status: 'busy', waitTime: '60 min' },
        { name: 'Urology', status: 'available', waitTime: '45 min' }
      ]
    }
  ];
  
  // Sort hospitals based on criteria
  const sortedHospitals = [...nearbyHospitals].sort((a, b) => {
    if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    } else if (sortBy === 'waitTime') {
      return parseInt((a.departments?.[0]?.waitTime || '0').replace(' min', '')) - 
             parseInt((b.departments?.[0]?.waitTime || '0').replace(' min', ''));
    } else {
      return (b.patientCapacity?.available || 0) - (a.patientCapacity?.available || 0);
    }
  });
  
  const handleSortChange = (newSortBy: 'distance' | 'waitTime' | 'capacity') => {
    setSortBy(newSortBy);
  };
  
  const handleNotifyHospital = (hospital: NearestHospital) => {
    toast({
      title: "Hospital Notified",
      description: `${hospital.name} has been notified about the incoming patient.`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Nearby Hospitals
          </CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Sort by:</span>
            <Button 
              variant={sortBy === 'distance' ? 'default' : 'outline'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => handleSortChange('distance')}
            >
              Distance
            </Button>
            <Button 
              variant={sortBy === 'waitTime' ? 'default' : 'outline'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => handleSortChange('waitTime')}
            >
              Wait Time
            </Button>
            <Button 
              variant={sortBy === 'capacity' ? 'default' : 'outline'} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => handleSortChange('capacity')}
            >
              Capacity
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedHospitals.map((hospital, index) => (
            <HospitalCard 
              key={index} 
              hospital={hospital} 
              onNotify={() => handleNotifyHospital(hospital)} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface HospitalCardProps {
  hospital: NearestHospital;
  onNotify: () => void;
}

const HospitalCard = ({ hospital, onNotify }: HospitalCardProps) => {
  return (
    <div className="border border-gray-200 rounded p-3 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{hospital.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {hospital.distance}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              ETA: {hospital.eta}
            </span>
          </div>
        </div>
        <Badge 
          variant={hospital.notified ? "default" : "outline"} 
          className={hospital.notified ? "bg-green-100 text-green-800 border-green-200" : ""}
        >
          {hospital.notified ? "Notified" : "Pending"}
        </Badge>
      </div>
      
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-blue-50 p-1.5 rounded flex flex-col items-center justify-center">
          <span className="text-gray-600">ER Wait</span>
          <span className="font-medium">{hospital.departments?.[0]?.waitTime || 'N/A'}</span>
        </div>
        <div className="bg-blue-50 p-1.5 rounded flex flex-col items-center justify-center">
          <span className="text-gray-600">OR Status</span>
          <span className="font-medium">{hospital.orStatus}</span>
        </div>
        <div className="bg-blue-50 p-1.5 rounded flex flex-col items-center justify-center">
          <span className="text-gray-600">Available Beds</span>
          <span className="font-medium">{hospital.patientCapacity?.available || 'N/A'}</span>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 h-8">
              <Info className="h-3 w-3 mr-1" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{hospital.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-gray-600">{hospital.address}</p>
                <p className="text-gray-600">{hospital.phone}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {hospital.specialties?.map((specialty, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{specialty}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Department Wait Times</h4>
                <div className="space-y-1">
                  {hospital.departments?.map((dept, i) => (
                    <div key={i} className="flex justify-between items-center p-1 bg-gray-50 rounded">
                      <span>{dept.name}</span>
                      <Badge variant={
                        dept.status === 'available' 
                          ? "outline" 
                          : dept.status === 'busy' 
                            ? "secondary" 
                            : "destructive"
                      } className="text-xs">
                        {dept.waitTime}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Capacity</h4>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Beds Available</span>
                  <span className="font-medium">
                    {hospital.patientCapacity?.available}/{hospital.patientCapacity?.total}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          size="sm" 
          disabled={hospital.notified}
          className="flex-1 h-8" 
          onClick={onNotify}
        >
          {hospital.notified ? 'Notified' : 'Notify Hospital'}
        </Button>
      </div>
    </div>
  );
};

export default NearbyHospitals;
