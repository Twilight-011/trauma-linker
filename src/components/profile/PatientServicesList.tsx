
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Stethoscope, Ambulance } from 'lucide-react';

const patientServices = [
  {
    id: 1,
    name: 'Emergency Response',
    description: 'On-site trauma assessment and emergency care coordination',
    status: 'active',
    icon: Ambulance,
    patients: 128,
    accuracy: 86
  },
  {
    id: 2,
    name: 'Triage Classification',
    description: 'AI-assisted patient prioritization based on severity',
    status: 'active',
    icon: AlertCircle,
    patients: 205,
    accuracy: 92
  },
  {
    id: 3,
    name: 'Hospital Coordination',
    description: 'Real-time communication with receiving hospitals',
    status: 'active',
    icon: Stethoscope,
    patients: 97,
    accuracy: 89
  },
  {
    id: 4,
    name: 'Patient Follow-up',
    description: 'Post-trauma care coordination and monitoring',
    status: 'pending',
    icon: Clock,
    patients: 0,
    accuracy: 0
  },
  {
    id: 5,
    name: 'Outcome Analysis',
    description: 'Analysis of patient outcomes and treatment efficacy',
    status: 'active',
    icon: CheckCircle,
    patients: 76,
    accuracy: 84
  }
];

const PatientServicesList = () => {
  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Patients Served</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <service.icon className="h-4 w-4 text-primary" />
                {service.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {service.description}
              </TableCell>
              <TableCell>
                {service.status === 'active' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {service.patients > 0 ? service.patients : '-'}
              </TableCell>
              <TableCell className="text-right">
                {service.accuracy > 0 ? `${service.accuracy}%` : '-'}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PatientServicesList;
