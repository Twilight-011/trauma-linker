
import React from 'react';
import { Hospital, Clock, MapPin, Phone, Mail, Route } from 'lucide-react';
import { NearestHospital } from '@/types/emergency';
import { Badge } from '@/components/ui/badge';

interface HospitalInfoProps {
  hospital: NearestHospital;
}

const HospitalInfo = ({ hospital }: HospitalInfoProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <div className="flex items-start gap-2">
        <Hospital className="h-4 w-4 text-blue-600 mt-0.5" />
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Nearest Trauma Center</p>
            <p className="text-xs font-medium">ETA: {hospital.eta}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm">{hospital.name}</p>
            <Badge variant={hospital.notified ? "success" : "outline"} className="text-xs">
              {hospital.notified ? 'Notified' : 'Pending'}
            </Badge>
          </div>
          
          <div className="mt-2 space-y-2 text-xs">
            {hospital.specialties && (
              <div className="flex flex-wrap gap-1">
                {hospital.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-white">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
            
            {hospital.bloodBank && (
              <div className="flex items-center gap-1">
                <span className="text-blue-700">Blood Bank:</span>
                {hospital.bloodBank.map((blood, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-white">
                    {blood}
                  </Badge>
                ))}
              </div>
            )}
            
            {hospital.traumaTeam && (
              <div className="flex items-center">
                <span className="text-blue-700 mr-1">Trauma Team:</span>
                <span>{hospital.traumaTeam}</span>
              </div>
            )}
            
            {hospital.address && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-blue-600 mr-1" />
                <span>{hospital.address}</span>
              </div>
            )}
            
            {hospital.phone && (
              <div className="flex items-center">
                <Phone className="h-3 w-3 text-blue-600 mr-1" />
                <span>{hospital.phone}</span>
              </div>
            )}
            
            {hospital.email && (
              <div className="flex items-center">
                <Mail className="h-3 w-3 text-blue-600 mr-1" />
                <span>{hospital.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;
