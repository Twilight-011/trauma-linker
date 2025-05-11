
import React, { useEffect, useRef, useState } from 'react';
import { Activity, MapPin, Navigation } from 'lucide-react';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LiveLocationTracker = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { agentState } = useEmergencyAgent();
  const [mapKey, setMapKey] = useState<string>('');
  const [routeType, setRouteType] = useState<'fastest' | 'alternate' | 'emergency'>('fastest');
  
  useEffect(() => {
    // In a real implementation, this would use a properly stored API key
    const storedKey = localStorage.getItem('mapbox_key');
    if (storedKey) {
      setMapKey(storedKey);
    }
  }, []);

  const handleSaveMapKey = () => {
    const input = document.getElementById('mapbox-key') as HTMLInputElement;
    if (input && input.value) {
      localStorage.setItem('mapbox_key', input.value);
      setMapKey(input.value);
    }
  };

  useEffect(() => {
    if (!mapKey || !mapRef.current || !agentState.location) return;
    
    // Load Mapbox script dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
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
          
          new mapboxgl.Marker({ color: '#E53E3E' })
            .setLngLat([hospitalLng, hospitalLat])
            .addTo(map);
            
          // Draw route between current location and hospital
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': [
                  [agentState.location!.longitude, agentState.location!.latitude],
                  [hospitalLng, hospitalLat]
                ]
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
              'line-color': '#3FB1CE',
              'line-width': 6,
              'line-dasharray': routeType === 'emergency' ? [2, 1] : [1, 0]
            }
          });
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
            <span>ETA: 8 min remaining</span>
          </div>
          
          {routeType === 'emergency' && (
            <div className="mt-2 text-xs bg-red-50 text-red-800 p-2 rounded-md flex items-center">
              <Navigation className="h-3 w-3 mr-1" />
              <span>Emergency corridors activated for fastest route</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveLocationTracker;
