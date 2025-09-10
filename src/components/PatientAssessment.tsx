
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
// Real medical dataset images
import realFracture from '@/assets/real-fracture.jpg';
import realWound from '@/assets/real-wound.jpg';
import realBurn from '@/assets/real-burn.jpg';
import realChestTrauma from '@/assets/real-chest-trauma.jpg';
import realHeadTrauma from '@/assets/real-head-trauma.jpg';

const PatientAssessment = () => {
  const medicalImages = [
    { name: 'Fracture X-ray', type: 'fracture', src: realFracture },
    { name: 'Wound Assessment', type: 'wound', src: realWound },
    { name: 'Burn Injury', type: 'burn', src: realBurn },
    { name: 'Chest Trauma', type: 'chest-trauma', src: realChestTrauma },
    { name: 'Head Trauma', type: 'head-trauma', src: realHeadTrauma }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Camera className="h-5 w-5 mr-2 text-primary" />
          Medical Images Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Medical Images Gallery */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold mb-3 text-blue-800">Medical Images - Real Dataset</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {medicalImages.map((image) => (
              <div
                key={image.type}
                className="flex flex-col items-center p-2 border rounded-lg hover:shadow-md transition-shadow"
              >
                <img 
                  src={image.src} 
                  alt={image.name} 
                  className="w-16 h-16 object-cover rounded mb-1" 
                />
                <span className="text-xs text-center">{image.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAssessment;
