
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Clock, Send, CheckCircle2, Phone, Mail, MessageSquare, Ambulance, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HospitalNotification = () => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'sms' | 'email' | 'call'>('all');
  const [customMessage, setCustomMessage] = useState<string>(
    "Patient with multiple fractures and possible internal bleeding en route. Estimated arrival in 15 minutes. Please prepare trauma bay and orthopedic team."
  );
  const [preparedResources, setPreparedResources] = useState({
    traumaBay: true,
    orthopedicSurgeon: true,
    plasterCastTray: true,
    bloodProducts: false
  });
  const [preparationStatus, setPreparationStatus] = useState<'Preparing' | 'Ready'>('Preparing');
  const [messageTemplate, setMessageTemplate] = useState<string>("trauma_orthopedic");
  
  const handleSendUpdate = () => {
    toast({
      title: "Update Sent",
      description: `Hospital has been notified via ${selectedMethod === 'all' ? 'all channels' : selectedMethod}.`,
    });
  };
  
  const handleUpdateETA = () => {
    toast({
      title: "ETA Updated",
      description: "Estimated arrival time has been updated.",
    });
  };

  const handleResourceStatusChange = (resource: keyof typeof preparedResources) => {
    const updated = { ...preparedResources, [resource]: !preparedResources[resource] };
    setPreparedResources(updated);
    
    // Check if all resources are ready
    if (Object.values(updated).every(status => status)) {
      setPreparationStatus('Ready');
      toast({
        title: "All Resources Ready",
        description: "Hospital has prepared all necessary resources.",
      });
    } else {
      setPreparationStatus('Preparing');
    }
  };

  const handleTemplateChange = (value: string) => {
    setMessageTemplate(value);
    
    // Update message based on template
    switch(value) {
      case "trauma_orthopedic":
        setCustomMessage("Patient with multiple fractures and possible internal bleeding en route. Estimated arrival in 15 minutes. Please prepare trauma bay and orthopedic team.");
        break;
      case "cardiac_emergency":
        setCustomMessage("Cardiac emergency patient en route. Patient experiencing chest pain and arrhythmia. Require cardiac team and cath lab preparation. ETA 15 minutes.");
        break;
      case "neurological":
        setCustomMessage("Neurological emergency. Patient with suspected stroke symptoms. FAST assessment positive. Please prepare CT scan and stroke team. ETA 15 minutes.");
        break;
      case "pediatric":
        setCustomMessage("Pediatric emergency. 8-year-old patient with severe respiratory distress and possible foreign body aspiration. Please prepare pediatric team. ETA 15 minutes.");
        break;
      default:
        setCustomMessage("");
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-primary" />
          Hospital Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">AIIMS Delhi</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>ETA: 18 minutes</span>
              </div>
            </div>
            <Badge status={preparationStatus} />
          </div>
          
          <div className="p-3 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Resource Preparation:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span>Trauma Bay 2</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 p-0 flex items-center text-green-600"
                  onClick={() => handleResourceStatusChange('traumaBay')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {preparedResources.traumaBay ? 'Ready' : 'Pending'}
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Orthopedic Surgeon</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 p-0 flex items-center text-green-600"
                  onClick={() => handleResourceStatusChange('orthopedicSurgeon')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {preparedResources.orthopedicSurgeon ? 'Notified' : 'Pending'}
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Plaster Cast Tray</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 p-0 flex items-center text-green-600"
                  onClick={() => handleResourceStatusChange('plasterCastTray')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {preparedResources.plasterCastTray ? 'Prepared' : 'Pending'}
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Blood Products (B+)</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`h-6 p-0 flex items-center ${preparedResources.bloodProducts ? 'text-green-600' : 'text-yellow-600'}`}
                  onClick={() => handleResourceStatusChange('bloodProducts')}
                >
                  {preparedResources.bloodProducts ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Ready
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-1" />
                      In Progress
                    </>
                  )}
                </Button>
              </li>
            </ul>
          </div>
          
          <Tabs defaultValue="notify">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notify">Notification</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notify" className="space-y-4">
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Message Template:</h3>
                <Select defaultValue={messageTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trauma_orthopedic">Trauma - Orthopedic</SelectItem>
                    <SelectItem value="cardiac_emergency">Cardiac Emergency</SelectItem>
                    <SelectItem value="neurological">Neurological Emergency</SelectItem>
                    <SelectItem value="pediatric">Pediatric Emergency</SelectItem>
                    <SelectItem value="custom">Custom Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Notification Method:</h3>
                <RadioGroup defaultValue="all" className="flex flex-wrap gap-2" onValueChange={(val) => setSelectedMethod(val as any)}>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms" className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      SMS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="call" id="call" />
                    <Label htmlFor="call" className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      AI Call
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Message:</h3>
                <Textarea 
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="h-20 text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 text-sm" onClick={handleUpdateETA}>
                  <Clock className="h-4 w-4 mr-1" />
                  Update ETA
                </Button>
                <Button className="flex-1 text-sm flex items-center justify-center" onClick={handleSendUpdate}>
                  <Send className="h-4 w-4 mr-1" />
                  Send Update
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 text-sm">
                  <Ambulance className="h-4 w-4 mr-1" />
                  Request Ambulance Transfer
                </Button>
                <Button variant="outline" className="flex-1 text-sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Send Patient Report
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="space-y-2">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <span>Emergency Desk</span>
                  </div>
                  <span>+91-11-2658-7900</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <span>Trauma Center</span>
                  </div>
                  <span>+91-11-2673-1164</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <span>Emergency Email</span>
                  </div>
                  <span>trauma@aiims.edu</span>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Phone className="h-4 w-4 mr-1" />
                  Call Hospital Directly
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
