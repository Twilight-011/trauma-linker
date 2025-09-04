import { useState, useEffect } from 'react';
import { Location } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';

interface LocationAPIResponse {
  lat: number;
  lon: number;
  accuracy?: number;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const useRealLocationAPI = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>();
  const [address, setAddress] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(result.state);
          
          result.addEventListener('change', () => {
            setPermissionStatus(result.state);
            if (result.state === 'granted') {
              getCurrentLocation();
            }
          });
        }
      } catch (error) {
        console.log('Permission check not supported');
      }
    };
    
    checkPermission();
  }, []);

  // Get location using browser geolocation
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        setCurrentLocation(location);
        
        // Get address using reverse geocoding
        await getAddressFromCoordinates(location.latitude, location.longitude);
        
        setIsLoading(false);
        
        toast({
          title: 'Location Found',
          description: 'Successfully retrieved your current location.',
        });
      },
      async (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = 'Unable to get your current location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Trying IP-based location...';
            await getLocationFromIP();
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Trying IP-based location...';
            await getLocationFromIP();
            break;
        }
        
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive'
        });
        
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Fallback: Get location from IP address (free API)
  const getLocationFromIP = async () => {
    try {
      setIsLoading(true);
      
      // Using ipapi.co - free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const location: Location = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 1000, // IP-based location is less accurate
        };
        
        setCurrentLocation(location);
        setAddress(`${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`);
        
        toast({
          title: 'Location Found (IP-based)',
          description: `Located in ${data.city || 'Unknown City'}, ${data.country_name || 'Unknown Country'}`,
        });
      } else {
        throw new Error('Invalid location data from IP service');
      }
    } catch (error) {
      console.error('IP location error:', error);
      
      // Final fallback to default location
      useFallbackLocation();
    } finally {
      setIsLoading(false);
    }
  };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      // Using Nominatim (OpenStreetMap) - free reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Emergency Response App/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Not critical, just won't show address
    }
  };

  // Provide a fallback location for testing
  const useFallbackLocation = () => {
    const fallbackLocation: Location = {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 100,
    };
    
    setCurrentLocation(fallbackLocation);
    setAddress('New Delhi, India (Test Location)');
    
    toast({
      title: 'Using Test Location',
      description: 'Using a fallback location for testing purposes.',
    });
  };

  return { 
    currentLocation, 
    address,
    getCurrentLocation, 
    getLocationFromIP,
    useFallbackLocation, 
    permissionStatus,
    isLoading
  };
};