
import React, { useEffect, useRef, useState } from 'react';
import { Activity, MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

const LiveLocationTracker = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { agentState } = useEmergencyAgent();
  const [mapKey, setMapKey] = useState<string>('');
  const [routeType, setRouteType] = useState<'fastest' | 'alternate' | 'emergency'>('fastest');
  const [trafficInfo, setTrafficInfo] = useState<{ level: string; delay: string } | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, this would use a properly stored API key
    const storedKey = localStorage.getItem('mapbox_key');
    if (storedKey) {
      setMapKey(storedKey);
    }
  }, []);

  useEffect(() => {
    // Simulate traffic API data
    const trafficLevels = ['moderate', 'heavy', 'light'];
    const delays = ['5 min', '12 min', '2 min'];
    
    // In a real app, this would fetch from a traffic API
    const fetchTrafficData = () => {
      const randomIndex = Math.floor(Math.random() * trafficLevels.length);
      setTrafficInfo({
        level: trafficLevels[randomIndex],
        delay: delays[randomIndex]
      });
    };
    
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleSaveMapKey = () => {
    const input = document.getElementById('mapbox-key') as HTMLInputElement;
    if (input && input.value) {
      localStorage.setItem('mapbox_key', input.value);
      setMapKey(input.value);
      toast({
        title: "Map key saved",
        description: "Your Mapbox key has been saved for this session."
      });
    }
  };

  const handleCheckRoadClosures = () => {
    toast({
      title: "Road Closures Checked",
      description: "No road closures or construction detected on your route."
    });
  };

  useEffect(() => {
    if (!mapKey || !mapRef.current || !agentState.location) return;
    
    // Load Mapbox script dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
      // Now that the script is loaded, we can safely access window.mapboxgl
      const mapboxgl = window.mapboxgl;
      if (!mapboxgl) return;
      
      // Initialize map
      mapboxgl.accessToken = mapKey;
      
      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [agentState.location!.longitude, agentState.location!.latitude],
        zoom: 13
      });
      
      map.on('load', () => {
        // Add starting point marker
        new mapboxgl.Marker({ color: '#3FB1CE' })
          .setLngLat([agentState.location!.longitude, agentState.location!.latitude])
          .addTo(map);
          
        // Add hospital marker if hospital info exists
        if (agentState.nearestHospital) {
          // For demo purposes, use a position slightly offset from current location
          // In real implementation, this would use actual hospital coordinates
          const hospitalLng = agentState.location!.longitude + 0.01;
          const hospitalLat = agentState.location!.latitude + 0.01;
          
          // Create a popup with hospital info
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${agentState.nearestHospital.name}</strong>
                <p>${agentState.nearestHospital.address || ''}</p>
                <p>${agentState.nearestHospital.phone || ''}</p>
              </div>
            `);
          
          // Add marker with popup
          new mapboxgl.Marker({ color: '#E53E3E' })
            .setLngLat([hospitalLng, hospitalLat])
            .setPopup(popup)
            .addTo(map);
            
          // Draw route between current location and hospital
          // Simulate different route patterns based on selected route type
          const createRouteCoordinates = () => {
            const direct = [
              [agentState.location!.longitude, agentState.location!.latitude],
              [hospitalLng, hospitalLat]
            ];
            
            // For alternate route, add some waypoints to create a different path
            if (routeType === 'alternate') {
              return [
                [agentState.location!.longitude, agentState.location!.latitude],
                [agentState.location!.longitude + 0.005, agentState.location!.latitude + 0.005],
                [agentState.location!.longitude + 0.008, agentState.location!.latitude - 0.003],
                [hospitalLng, hospitalLat]
              ];
            } 
            // For emergency route, use a more direct path but slightly different
            else if (routeType === 'emergency') {
              return [
                [agentState.location!.longitude, agentState.location!.latitude],
                [agentState.location!.longitude + 0.002, agentState.location!.latitude + 0.002],
                [hospitalLng - 0.002, hospitalLat - 0.002],
                [hospitalLng, hospitalLat]
              ];
            }
            
            return direct;
          };
          
          // Remove existing route layer and source if they exist
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          if (map.getSource('route')) {
            map.removeSource('route');
          }
            
          // Add new route
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': createRouteCoordinates()
              }
            }
          });
          
          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': routeType === 'emergency' ? '#ff0000' : '#3FB1CE',
              'line-width': routeType === 'emergency' ? 8 : 6,
              'line-dasharray': routeType === 'emergency' ? [2, 1] : [1, 0]
            }
          });
          
          // If emergency route, add pulsing effect
          if (routeType === 'emergency') {
            let start = 0;
            function animateDashArray(timestamp) {
              const dashArraySequence = [
                [0, 4, 3],
                [0.5, 4, 2.5],
                [1, 4, 2],
                [1.5, 4, 1.5],
                [2, 4, 1],
                [2.5, 4, 0.5],
                [3, 4, 0],
                [0, 0.5, 3, 3.5],
                [0, 1, 3, 3],
                [0, 1.5, 3, 2.5],
                [0, 2, 3, 2],
                [0, 2.5, 3, 1.5],
                [0, 3, 3, 1],
                [0, 3.5, 3, 0.5],
              ];
              
              // update dashArray
              if (map.getLayer('route')) {
                const animationPhase = Math.floor((timestamp % 1000) / 1000 * dashArraySequence.length);
                map.setPaintProperty('route', 'line-dasharray', dashArraySequence[animationPhase]);
              } else {
                return; // Stop animation if layer is gone
              }
              
              requestAnimationFrame(animateDashArray);
            }
            
            if (routeType === 'emergency') {
              requestAnimationFrame(animateDashArray);
            }
          }
        }
      });
      
      return () => {
        map.remove();
      };
    };
    
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mapKey, agentState.location, agentState.nearestHospital, routeType]);
  
  const handleRouteChange = (type: 'fastest' | 'alternate' | 'emergency') => {
    setRouteType(type);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium flex items-center">
          <Activity className="h-4 w-4 mr-1 text-red-500" />
          Live Location Tracking
        </p>
        <span className="text-xs text-green-600 animate-pulse">Active</span>
      </div>
      
      {!mapKey ? (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Please enter your Mapbox API key to display the map</p>
          <div className="flex space-x-2">
            <input
              id="mapbox-key"
              type="text"
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="Mapbox public token"
            />
            <Button size="sm" onClick={handleSaveMapKey}>Save</Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Get your free API key at mapbox.com</p>
        </div>
      ) : (
        <>
          <div className="aspect-video bg-gray-100 rounded relative mb-2" ref={mapRef}>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading map...</p>
            </div>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-xs">Route type:</span>
            <div className="flex space-x-1">
              <Badge 
                variant={routeType === 'fastest' ? 'default' : 'outline'}
                className="text-xs cursor-pointer"
                onClick={() => handleRouteChange('fastest')}
              >
                Fastest
              </Badge>
              <Badge 
                variant={routeType === 'alternate' ? 'default' : 'outline'}
                className="text-xs cursor-pointer"
                onClick={() => handleRouteChange('alternate')}
              >
                Alternate
              </Badge>
              <Badge 
                variant={routeType === 'emergency' ? 'default' : 'outline'}
                className="text-xs cursor-pointer bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                onClick={() => handleRouteChange('emergency')}
              >
                Emergency
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>Current speed: 42 km/h</span>
            <span>ETA: {routeType === 'emergency' ? '6' : routeType === 'alternate' ? '12' : '8'} min remaining</span>
          </div>
          
          {trafficInfo && (
            <div className="mt-2 bg-gray-50 p-2 rounded text-xs flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                <span>Traffic: <span className="font-medium">{trafficInfo.level}</span></span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                <span>+{trafficInfo.delay} delay</span>
              </div>
            </div>
          )}
          
          {routeType === 'emergency' && (
            <div className="mt-2 text-xs bg-red-50 text-red-800 p-2 rounded-md flex items-center">
              <Navigation className="h-3 w-3 mr-1" />
              <span>Emergency corridors activated for fastest route</span>
            </div>
          )}
          
          <div className="mt-2 flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs w-full" onClick={handleCheckRoadClosures}>
              Check Road Closures
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs w-full">
                  Alternative Hospitals
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2">
                <div className="text-xs space-y-2">
                  <div className="font-medium">Other Nearby Facilities:</div>
                  <div className="space-y-2">
                    <div className="p-1.5 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Max Hospital</div>
                      <div className="text-gray-500">6.7 km • 18 min</div>
                    </div>
                    <div className="p-1.5 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Apollo Hospitals</div>
                      <div className="text-gray-500">8.3 km • 22 min</div>
                    </div>
                    <div className="p-1.5 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Sir Ganga Ram Hospital</div>
                      <div className="text-gray-500">9.5 km • 25 min</div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveLocationTracker;
