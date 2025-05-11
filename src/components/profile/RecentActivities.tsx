
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, User, FileText, Ambulance, Hospital } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'patient_assessed',
    description: 'Assessed patient with two-wheeler accident',
    caseId: 'TR-2023-0786',
    time: '15:12',
    icon: User
  },
  {
    id: 2,
    type: 'hospital_notified',
    description: 'Notified AIIMS Delhi about incoming trauma patient',
    caseId: 'TR-2023-0786',
    time: '15:14',
    icon: Hospital
  },
  {
    id: 3,
    type: 'report_filed',
    description: 'Filed emergency assessment report',
    caseId: 'TR-2023-0786',
    time: '15:18',
    icon: FileText
  },
  {
    id: 4,
    type: 'patient_transferred',
    description: 'Transferred patient to ambulance',
    caseId: 'TR-2023-0786',
    time: '15:25',
    icon: Ambulance
  },
  {
    id: 5,
    type: 'patient_assessed',
    description: 'Assessed patient with fall from height',
    caseId: 'TR-2023-0785',
    time: '14:05',
    icon: User
  },
  {
    id: 6,
    type: 'hospital_notified',
    description: 'Notified LNJP Hospital about incoming trauma patient',
    caseId: 'TR-2023-0785',
    time: '14:08',
    icon: Hospital
  }
];

const ActivityItem = ({ activity }: { activity: typeof activities[0] }) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'patient_assessed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hospital_notified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'report_filed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'patient_transferred':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex gap-3 py-3">
      <div className="mt-0.5">
        <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
          <activity.icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{activity.description}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {activity.time}
          </div>
        </div>
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="text-xs mr-2">
            {activity.caseId}
          </Badge>
          <Badge variant="outline" className={`text-xs ${getBadgeColor(activity.type)}`}>
            {activity.type.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const RecentActivities = () => {
  return (
    <Card className="p-4">
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ActivityItem activity={activity} />
            {index < activities.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivities;
