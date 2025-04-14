
import React from 'react';
import { Hospital } from 'lucide-react';
import { NearestHospital } from '@/types/emergency';

interface HospitalInfoProps {
  hospital: NearestHospital;
}

const HospitalInfo = ({ hospital }: HospitalInfoProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <div className="flex items-start gap-2">
        <Hospital className="h-4 w-4 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Nearest Trauma Center</p>
          <div className="flex items-center justify-between">
            <p className="text-xs">{hospital.name}</p>
            <p className="text-xs font-medium">ETA: {hospital.eta}</p>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">
            {hospital.notified ? 'Hospital notified' : 'Contacting hospital...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;
