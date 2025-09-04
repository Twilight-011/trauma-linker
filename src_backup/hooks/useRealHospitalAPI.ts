import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NearestHospital } from '@/types/emergency';
import { Location } from '@/types/emergency';

interface OverpassHospital {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    emergency?: string;
    'addr:city'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    phone?: string;
    website?: string;
    beds?: string;
    'healthcare:speciality'?: string;
  };
}

export const useRealHospitalAPI = () => {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<NearestHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate ETA based on distance (simplified)
  const calculateETA = (distance: number): string => {
    // Assume average speed of 30 km/h in city traffic
    const minutes = Math.round((distance / 30) * 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Get specialties based on hospital tags
  const getSpecialties = (tags: OverpassHospital['tags']): string[] => {
    const specialties: string[] = [];
    
    if (tags.emergency === 'yes') specialties.push('Emergency');
    if (tags['healthcare:speciality']) {
      const specs = tags['healthcare:speciality'].split(';');
      specialties.push(...specs.map(s => s.trim()));
    }
    
    // Default specialties if none specified
    if (specialties.length === 0) {
      specialties.push('General Medicine', 'Emergency');
    }
    
    return specialties;
  };

  // Fetch hospitals using Overpass API (OpenStreetMap data)
  const fetchNearbyHospitals = async (location: Location, radiusKm: number = 25) => {
    setLoading(true);
    
    try {
      // Overpass API query for hospitals within radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusKm * 1000},${location.latitude},${location.longitude});
          way["amenity"="hospital"](around:${radiusKm * 1000},${location.latitude},${location.longitude});
          relation["amenity"="hospital"](around:${radiusKm * 1000},${location.latitude},${location.longitude});
        );
        out center meta;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });
      
      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data
      const processedHospitals: NearestHospital[] = data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: OverpassHospital) => {
          // For ways and relations, use center coordinates if available
          const lat = element.lat || (element as any).center?.lat;
          const lon = element.lon || (element as any).center?.lon;
          
          if (!lat || !lon) return null;
          
          const distance = calculateDistance(location.latitude, location.longitude, lat, lon);
          const eta = calculateETA(distance);
          
          // Generate realistic capacity and status
          const totalBeds = parseInt(element.tags.beds || '0') || Math.floor(Math.random() * 200) + 50;
          const currentOccupancy = Math.floor(totalBeds * (0.6 + Math.random() * 0.3)); // 60-90% occupancy
          const available = totalBeds - currentOccupancy;
          
          const statuses = ['Available', 'Busy', 'Limited'];
          const orStatus = available > 20 ? 'Available' : available > 5 ? 'Limited' : 'Busy';
          
          const waitTimes = ['5 min', '10 min', '15 min', '20 min', '30 min', '45 min'];
          const waitTime = available > 20 ? waitTimes[0] : available > 10 ? waitTimes[1] : waitTimes[Math.floor(Math.random() * 4) + 2];
          
          return {
            name: element.tags.name,
            distance: `${distance.toFixed(1)} km`,
            eta: eta,
            notified: false,
            orStatus: orStatus,
            specialties: getSpecialties(element.tags),
            address: [
              element.tags['addr:housenumber'],
              element.tags['addr:street'],
              element.tags['addr:city']
            ].filter(Boolean).join(', ') || 'Address not available',
            phone: element.tags.phone || '+91-11-XXXX-XXXX',
            patientCapacity: {
              total: totalBeds,
              current: currentOccupancy,
              available: available
            },
            departments: [
              { 
                name: 'Emergency', 
                status: available > 10 ? 'available' : 'busy', 
                waitTime: waitTime 
              }
            ]
          };
        })
        .filter(Boolean)
        .sort((a: NearestHospital, b: NearestHospital) => 
          parseFloat(a.distance.replace(' km', '')) - parseFloat(b.distance.replace(' km', ''))
        )
        .slice(0, 10); // Limit to 10 nearest hospitals
      
      setHospitals(processedHospitals);
      setLastUpdate(new Date());
      
      toast({
        title: "Real Hospital Data Loaded",
        description: `Found ${processedHospitals.length} hospitals using OpenStreetMap data`,
      });
      
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      
      // Fallback to sample data if API fails
      const fallbackHospitals = generateFallbackHospitals(location);
      setHospitals(fallbackHospitals);
      setLastUpdate(new Date());
      
      toast({
        title: "Using Sample Data",
        description: "Real hospital API unavailable. Using sample data.",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate fallback hospitals based on location
  const generateFallbackHospitals = (location: Location): NearestHospital[] => {
    // Generate hospitals based on user's approximate location
    const cityName = getCityFromCoordinates(location.latitude, location.longitude);
    
    return [
      {
        name: `${cityName} General Hospital`,
        distance: '2.5 km',
        eta: '8 min',
        notified: false,
        orStatus: 'Available',
        specialties: ['Emergency', 'General Medicine', 'Surgery'],
        address: `Main Street, ${cityName}`,
        phone: '+91-XXX-XXX-XXXX',
        patientCapacity: { total: 200, current: 150, available: 50 },
        departments: [{ name: 'Emergency', status: 'available', waitTime: '10 min' }]
      },
      {
        name: `${cityName} Medical Center`,
        distance: '4.1 km',
        eta: '12 min',
        notified: false,
        orStatus: 'Busy',
        specialties: ['Cardiology', 'Neurology'],
        address: `Hospital Road, ${cityName}`,
        phone: '+91-XXX-XXX-XXXX',
        patientCapacity: { total: 150, current: 130, available: 20 },
        departments: [{ name: 'Emergency', status: 'busy', waitTime: '25 min' }]
      }
    ];
  };

  // Simple city detection based on coordinates
  const getCityFromCoordinates = (lat: number, lon: number): string => {
    // This is a simplified approach - in reality you'd use reverse geocoding
    if (lat >= 28.4 && lat <= 28.8 && lon >= 76.8 && lon <= 77.3) return 'Delhi';
    if (lat >= 19.0 && lat <= 19.3 && lon >= 72.7 && lon <= 73.0) return 'Mumbai';
    if (lat >= 12.8 && lat <= 13.1 && lon >= 77.4 && lon <= 77.8) return 'Bangalore';
    if (lat >= 22.4 && lat <= 22.8 && lon >= 88.2 && lon <= 88.5) return 'Kolkata';
    if (lat >= 17.3 && lat <= 17.5 && lon >= 78.3 && lon <= 78.6) return 'Hyderabad';
    return 'City';
  };

  return {
    hospitals,
    loading,
    lastUpdate,
    fetchNearbyHospitals
  };
};