
import { useState } from 'react';
import { Location } from '@/types/emergency';
import { useToast } from '@/hooks/use-toast';

export const useLocation = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location. Please enable location services.',
            variant: 'destructive'
          });
        }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive'
      });
    }
  };

  return { currentLocation, getCurrentLocation };
};
