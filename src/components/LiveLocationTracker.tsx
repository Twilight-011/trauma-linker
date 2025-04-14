
import React from 'react';
import { Activity, MapPin } from 'lucide-react';

const LiveLocationTracker = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium flex items-center">
          <Activity className="h-4 w-4 mr-1 text-red-500" />
          Live Location Tracking
        </p>
        <span className="text-xs text-green-600 animate-pulse">Active</span>
      </div>
      <div className="aspect-video bg-gray-100 rounded relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-gray-500">Live map would be displayed here</p>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
            <MapPin className="h-5 w-5 text-red-500" />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>Current speed: 42 km/h</span>
        <span>ETA: 8 min remaining</span>
      </div>
    </div>
  );
};

export default LiveLocationTracker;
