
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HospitalSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HospitalNotification = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <HospitalSquare className="h-5 w-5 mr-2 text-primary" />
          Hospital Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Seoul National University Hospital</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>ETA: 12 minutes</span>
              </div>
            </div>
            <Badge status="Preparing" />
          </div>
          
          <div className="p-3 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Resource Preparation:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span>Trauma Bay 1</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Ready
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Thoracic Surgeon</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Notified
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Chest Tube Tray</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Prepared
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Blood Products (O-Neg)</span>
                <span className="flex items-center text-yellow-600">
                  <Clock className="h-4 w-4 mr-1" />
                  In Progress
                </span>
              </li>
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1 text-sm">Update ETA</Button>
            <Button className="flex-1 text-sm flex items-center justify-center">
              <Send className="h-4 w-4 mr-1" />
              Send Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Badge = ({ status }: { status: string }) => {
  let colors = "";
  
  switch (status) {
    case "Preparing":
      colors = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "Ready":
      colors = "bg-green-100 text-green-800 border-green-200";
      break;
    default:
      colors = "bg-gray-100 text-gray-800 border-gray-200";
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors}`}>
      {status}
    </span>
  );
};

export default HospitalNotification;
