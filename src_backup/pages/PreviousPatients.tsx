
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, User, Calendar, Search, ArrowUpDown, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEmergencyAgent } from '@/hooks/useEmergencyAgent';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PreviousPatients = () => {
  const { recentPatients } = useEmergencyAgent();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter patients based on search term
  const filteredPatients = recentPatients.filter(patient => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      patient.id.toLowerCase().includes(searchTermLower) ||
      (patient.gender || '').toLowerCase().includes(searchTermLower) ||
      (patient.incidentType || '').toLowerCase().includes(searchTermLower) ||
      (patient.hospital || '').toLowerCase().includes(searchTermLower)
    );
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'transferring':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Transferring</Badge>;
      case 'hospital':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">At Hospital</Badge>;
      case 'complete':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Previous Patients
              </CardTitle>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentPatients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Case ID</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Patient
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Incident Type</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Date/Time
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            {patient.gender || 'Unknown'}, {patient.age || 'Unknown'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.incidentType || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {new Date(patient.addedAt).toLocaleDateString()}
                          <Clock className="mx-1 h-3 w-3 text-muted-foreground" />
                          {new Date(patient.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>{patient.hospital || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(patient.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Case</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-16 text-center">
                <History className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                <p className="text-lg font-medium">No patient history</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You haven't assessed any patients yet.
                </p>
                <Separator className="my-4 mx-auto w-1/3" />
                <Button asChild>
                  <a href="/new-patient">Assess New Patient</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PreviousPatients;
