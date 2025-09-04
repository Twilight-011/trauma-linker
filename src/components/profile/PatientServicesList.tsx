import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Users, Calendar } from 'lucide-react';

const PatientServicesList = () => {
  const services = [
    {
      name: 'Emergency Response',
      description: 'Rapid trauma assessment and hospital coordination',
      status: 'Active',
      lastUsed: '2 hours ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      name: 'AI Medical Analysis',
      description: 'Automated injury detection and severity assessment',
      status: 'Active',
      lastUsed: '5 minutes ago',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      name: 'Hospital Communication',
      description: 'Real-time notifications to medical facilities',
      status: 'Active',
      lastUsed: '1 hour ago',
      icon: Users,
      color: 'text-green-500'
    },
    {
      name: 'Case Management',
      description: 'Patient history and outcome tracking',
      status: 'Available',
      lastUsed: 'Never',
      icon: Calendar,
      color: 'text-gray-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Services</h3>
      <div className="grid gap-4">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-5 w-5 ${service.color} mt-0.5`} />
                    <div className="space-y-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Last used: {service.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={service.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {service.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PatientServicesList;