
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, User, CalendarClock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CurrentCaseInfo = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Case #TR-2023-0542</h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Started 14:32 (8 min ago)</span>
            </div>
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Active Case
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>Patient</span>
            </div>
            <p className="font-medium">Male, 42 years</p>
            <p>ID: Unknown</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>Incident</span>
            </div>
            <p className="font-medium">Traffic Accident</p>
            <p>Vehicle vs. Barrier</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Location</span>
            </div>
            <p className="font-medium">Gangnam-daero 396</p>
            <p>Seoul, South Korea</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>Responder</span>
            </div>
            <p className="font-medium">Park, Ji-hoon</p>
            <p>Team: Alpha-3</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentCaseInfo;
