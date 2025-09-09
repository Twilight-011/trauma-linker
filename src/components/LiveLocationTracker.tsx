import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LiveLocationTracker = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleApiKeySubmit = () => {
    if (!apiKey) {
      setError('Please enter your Mapbox API key');
      return;
    }
    if (!apiKey.startsWith('pk.')) {
      setError('Invalid Mapbox API key format. It should start with "pk."');
      return;
    }
    setError('');
    initializeMap();
  };

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    try {
      // Dynamic import to avoid loading mapbox-gl until needed
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      // Set access token using the default export
      (mapboxgl as any).accessToken = apiKey;

      map.current = new (mapboxgl as any).Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [0, 0],
        zoom: 2
      });

      // Add navigation controls
      map.current.addControl(new (mapboxgl as any).NavigationControl(), 'top-right');

      // Get current location
      getCurrentLocation();

    } catch (error) {
      setError('Error initializing map. Please check your API key.');
      console.error('Map initialization error:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsTracking(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        if (map.current) {
          // Fly to current location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });

          // Add marker for current location
          const mapboxgl = await import('mapbox-gl');
          new (mapboxgl as any).Marker({ color: '#ef4444' })
            .setLngLat([longitude, latitude])
            .setPopup(new (mapboxgl as any).Popup().setHTML('<h3>Current Location</h3><p>Emergency response location</p>'))
            .addTo(map.current);
        }

        // Get address from coordinates
        getAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    setIsTracking(false);
  };

  const trackContinuously = () => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        if (map.current) {
          map.current.setCenter([longitude, latitude]);
          // Update marker position
        }
      },
      (error) => {
        setError(`Tracking error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
      }
    );

    // Store watchId to clear later
    return watchId;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Location Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        {!map.current && (
          <div className="space-y-2">
            <Label htmlFor="mapbox-key">Mapbox API Key</Label>
            <div className="flex gap-2">
              <Input
                id="mapbox-key"
                type="password"
                placeholder="Enter your Mapbox API key (pk.xxx)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleApiKeySubmit}>Connect</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your free API key at{' '}
              <a 
                href="https://www.mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Map Container */}
        <div
          ref={mapContainer}
          className="h-64 rounded-lg bg-muted/20 border"
          style={{ display: map.current ? 'block' : 'none' }}
        />

        {/* Location Info */}
        {location && (
          <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
            <h4 className="font-medium">Current Location</h4>
            <p className="text-sm text-muted-foreground">
              Latitude: {location.lat.toFixed(6)}
            </p>
            <p className="text-sm text-muted-foreground">
              Longitude: {location.lng.toFixed(6)}
            </p>
            {address && (
              <p className="text-sm">
                <strong>Address:</strong> {address}
              </p>
            )}
          </div>
        )}

        {/* Tracking Controls */}
        {map.current && (
          <div className="flex gap-2">
            <Button 
              onClick={getCurrentLocation}
              disabled={isTracking}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isTracking ? 'Getting Location...' : 'Get Current Location'}
            </Button>
            <Button 
              onClick={trackContinuously}
              variant="outline"
              className="flex-1"
            >
              Start Continuous Tracking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLocationTracker;