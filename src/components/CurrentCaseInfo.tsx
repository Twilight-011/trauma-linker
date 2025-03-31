
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, CalendarClock, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CurrentCaseInfo = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Case #TR-2023-0786</h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Started 15:12 (12 min ago)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Active Case
            </div>
            <Link to="/new-patient">
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Patient
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>Patient</span>
            </div>
            <p className="font-medium">Male, 38 years</p>
            <p>ID: Unknown</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>Incident</span>
            </div>
            <p className="font-medium">Two-wheeler Accident</p>
            <p>Motorcycle vs. Truck</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Location</span>
            </div>
            <p className="font-medium">NH-48, Km 112</p>
            <p>Gurgaon, Haryana</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>Responder</span>
            </div>
            <p className="font-medium">Dr. Sharma, Vikas</p>
            <p>Team: 108-A6</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentCaseInfo;
