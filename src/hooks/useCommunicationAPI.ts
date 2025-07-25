import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SMSRequest {
  to: string;
  message: string;
  priority?: 'high' | 'normal';
}

interface CallRequest {
  to: string;
  message: string;
  voice?: 'male' | 'female';
}

export const useCommunicationAPI = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isoCalling, setIsCalling] = useState(false);

  // Send SMS using Twilio-compatible API
  const sendSMS = async ({ to, message, priority = 'normal' }: SMSRequest) => {
    setIsSending(true);
    
    try {
      // For demo purposes - in production you'd use actual Twilio API
      // const response = await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to, message, priority })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success response
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        toast({
          title: "SMS Sent Successfully",
          description: `Emergency alert sent to ${to}`,
        });
        
        return { success: true, messageId: `msg_${Date.now()}` };
      } else {
        throw new Error('SMS delivery failed');
      }
      
    } catch (error) {
      console.error('SMS Error:', error);
      
      toast({
        title: "SMS Failed",
        description: "Unable to send SMS. Please try again.",
        variant: 'destructive'
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsSending(false);
    }
  };

  // Make voice call using Twilio Voice API
  const makeVoiceCall = async ({ to, message, voice = 'female' }: CallRequest) => {
    setIsCalling(true);
    
    try {
      // For demo purposes - in production you'd use actual Twilio Voice API
      // const response = await fetch('/api/make-call', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to, message, voice })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success response
      const success = Math.random() > 0.15; // 85% success rate
      
      if (success) {
        toast({
          title: "Call Initiated",
          description: `Emergency call placed to ${to}`,
        });
        
        return { success: true, callId: `call_${Date.now()}`, status: 'ringing' };
      } else {
        throw new Error('Call failed to connect');
      }
      
    } catch (error) {
      console.error('Call Error:', error);
      
      toast({
        title: "Call Failed",
        description: "Unable to place call. Please try again.",
        variant: 'destructive'
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsCalling(false);
    }
  };

  // Send emergency alerts to multiple contacts
  const sendEmergencyAlert = async (contacts: string[], patientInfo: any) => {
    const emergencyMessage = `EMERGENCY ALERT: Patient ${patientInfo.age}y ${patientInfo.gender} requires immediate medical attention. Location: ${patientInfo.location}. Condition: ${patientInfo.condition}. Case ID: ${patientInfo.caseId}`;
    
    const results = await Promise.allSettled(
      contacts.map(contact => 
        contact.startsWith('+') ? 
          sendSMS({ to: contact, message: emergencyMessage, priority: 'high' }) :
          makeVoiceCall({ to: contact, message: emergencyMessage })
      )
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - successful;
    
    toast({
      title: "Emergency Alerts Sent",
      description: `${successful} alerts sent successfully${failed > 0 ? `, ${failed} failed` : ''}`,
    });
    
    return { successful, failed };
  };

  // Send hospital notification
  const notifyHospital = async (hospitalPhone: string, patientData: any, eta: string) => {
    const hospitalMessage = `INCOMING PATIENT ALERT: ETA ${eta}. Patient: ${patientData.age}y ${patientData.gender}. Condition: ${patientData.condition}. Triage: ${patientData.triage}. Case ID: ${patientData.caseId}. Please prepare for arrival.`;
    
    // Send both SMS and call for critical cases
    if (patientData.triage === 'Critical' || patientData.triage === 'Red') {
      const smsResult = await sendSMS({ 
        to: hospitalPhone, 
        message: hospitalMessage, 
        priority: 'high' 
      });
      
      const callResult = await makeVoiceCall({ 
        to: hospitalPhone, 
        message: hospitalMessage 
      });
      
      return { sms: smsResult, call: callResult };
    } else {
      // Just SMS for non-critical cases
      const smsResult = await sendSMS({ 
        to: hospitalPhone, 
        message: hospitalMessage 
      });
      
      return { sms: smsResult };
    }
  };

  // Get communication status
  const getCommunicationStatus = () => {
    return {
      smsAvailable: true, // In production, check API keys/credits
      voiceAvailable: true,
      isSending,
      isCalling: isoCalling
    };
  };

  return {
    sendSMS,
    makeVoiceCall,
    sendEmergencyAlert,
    notifyHospital,
    getCommunicationStatus,
    isSending,
    isCalling: isoCalling
  };
};

// Example usage:
/*
const { sendSMS, makeVoiceCall, sendEmergencyAlert, notifyHospital } = useCommunicationAPI();

// Send SMS
await sendSMS({
  to: '+1234567890',
  message: 'Emergency: Patient needs immediate attention',
  priority: 'high'
});

// Make voice call
await makeVoiceCall({
  to: '+1234567890',
  message: 'Emergency alert: Patient requires immediate medical assistance',
  voice: 'female'
});

// Send alerts to multiple contacts
await sendEmergencyAlert(['+1234567890', '+0987654321'], {
  age: 25,
  gender: 'Male',
  location: 'Main Street',
  condition: 'Severe trauma',
  caseId: 'TR-2024-1234'
});

// Notify hospital
await notifyHospital('+1234567890', {
  age: 25,
  gender: 'Male',
  condition: 'Severe trauma',
  triage: 'Critical',
  caseId: 'TR-2024-1234'
}, '15 minutes');
*/