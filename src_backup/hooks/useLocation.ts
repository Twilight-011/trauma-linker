
import { useState, useEffect } from 'react';
import { Location } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';

export const useLocation = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>();
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check if browser supports permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(result.state);
          
          // Listen for changes to permission
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

  const getCurrentLocation = () => {
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
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = 'Unable to get your current location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get location timed out.';
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
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Provide a fallback location for testing when actual location isn't available
  const useFallbackLocation = () => {
    // Default to New Delhi coordinates
    const fallbackLocation: Location = {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 100,
    };
    
    setCurrentLocation(fallbackLocation);
    
    toast({
      title: 'Using Test Location',
      description: 'Using a fallback location for testing purposes.',
    });
  };

  return { 
    currentLocation, 
    getCurrentLocation, 
    useFallbackLocation, 
    permissionStatus,
    isLoading
  };
};
