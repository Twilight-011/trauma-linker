import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MapPin, Phone, Camera } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'Emergency Case',
      description: 'Motorcycle accident - compound fracture assessment',
      timestamp: '2 hours ago',
      status: 'Completed',
      location: 'Highway NH-1, Delhi',
      icon: User,
      priority: 'high'
    },
    {
      id: 2,
      type: 'Hospital Communication',
      description: 'Notified AIIMS Delhi - ETA 12 minutes',
      timestamp: '2 hours ago',
      status: 'Sent',
      location: 'AIIMS Delhi',
      icon: Phone,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'AI Analysis',
      description: 'Medical image analysis completed - 94% confidence',
      timestamp: '2 hours ago',
      status: 'Completed',
      location: 'Cloud Processing',
      icon: Camera,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'Location Update',
      description: 'GPS coordinates updated for ambulance tracking',
      timestamp: '2 hours ago',
      status: 'Active',
      location: 'Live Tracking',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 5,
      type: 'Emergency Case',
      description: 'Cardiac arrest - CPR administered',
      timestamp: '1 day ago',
      status: 'Completed',
      location: 'Connaught Place, Delhi',
      icon: User,
      priority: 'critical'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <Card key={activity.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{activity.type}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getPriorityColor(activity.priority)} variant="outline">
                          {activity.priority}
                        </Badge>
                        <Badge className={getStatusColor(activity.status)} variant="secondary">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.timestamp}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center pt-4">
        <Badge variant="outline" className="text-xs">
          Showing last 5 activities
        </Badge>
      </div>
    </div>
  );
};

export default RecentActivities;