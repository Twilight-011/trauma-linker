import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  AlertTriangle, 
  Heart, 
  Activity, 
  MapPin, 
  Clock,
  Hospital,
  UserCheck,
  Stethoscope,
  Target
} from 'lucide-react';

interface FinalAssessmentReportProps {
  patientData: any;
  vitalSigns: any;
  aiAnalysis: any;
  caseId: string;
  timestamp?: Date;
}

const FinalAssessmentReport = ({ 
  patientData, 
  vitalSigns, 
  aiAnalysis, 
  caseId, 
  timestamp = new Date() 
}: FinalAssessmentReportProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <Heart className="h-4 w-4 text-orange-500" />;
      case 'moderate': return <Activity className="h-4 w-4 text-yellow-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Final Assessment Report
          <Badge variant="outline" className="ml-auto">
            Case ID: {caseId}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString()}
          <Separator orientation="vertical" className="h-4" />
          <MapPin className="h-4 w-4" />
          {patientData?.location}, {patientData?.locationDetails}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Patient Demographics */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Patient Demographics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Gender</span>
              <p className="font-medium">{patientData?.gender || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Age Range</span>
              <p className="font-medium">{patientData?.estimatedAge || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Responsiveness</span>
              <p className="font-medium capitalize">{patientData?.responsiveness}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Primary Injury</span>
              <p className="font-medium">{patientData?.injuryLocation}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Incident Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Incident Information
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Type:</span>
              <p className="font-medium">{patientData?.incidentType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Details:</span>
              <p className="text-sm">{patientData?.incidentDetails}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Physical Findings:</span>
              <p className="text-sm">{patientData?.physicalFindings}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Vital Signs */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Vital Signs Assessment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Heart Rate</span>
              <p className="font-bold text-lg">{vitalSigns?.heartRate} <span className="text-sm font-normal">bpm</span></p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Blood Pressure</span>
              <p className="font-bold text-lg">{vitalSigns?.bloodPressure} <span className="text-sm font-normal">mmHg</span></p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">SpO2</span>
              <p className="font-bold text-lg">{vitalSigns?.spO2}<span className="text-sm font-normal">%</span></p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Respiratory Rate</span>
              <p className="font-bold text-lg">{vitalSigns?.respRate} <span className="text-sm font-normal">bpm</span></p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Temperature</span>
              <p className="font-bold text-lg">{vitalSigns?.temperature}<span className="text-sm font-normal">°C</span></p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">GCS</span>
              <p className="font-bold text-lg">{vitalSigns?.gcs}<span className="text-sm font-normal">/15</span></p>
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Analysis Results */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            AI Medical Analysis
            <Badge variant="outline" className="ml-2">
              {aiAnalysis?.overallConfidence}% Confidence
            </Badge>
          </h3>
          
          {/* Detected Conditions */}
          {aiAnalysis?.imageAnalysis?.detectedConditions && (
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-sm text-muted-foreground">DETECTED CONDITIONS</h4>
              {aiAnalysis.imageAnalysis.detectedConditions.map((condition: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(condition.severity)}
                    <span className="font-medium">{condition.condition || condition.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(condition.severity)}>
                      {condition.severity}
                    </Badge>
                    <span className="text-sm font-medium">{condition.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Risk Assessment */}
          {aiAnalysis?.vitalSignsAnalysis && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Risk Assessment</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-orange-700">Risk Score:</span>
                  <p className="font-bold text-orange-800">{aiAnalysis.vitalSignsAnalysis.riskScore}/100</p>
                </div>
                {aiAnalysis.estimatedSurvivalRate && (
                  <div>
                    <span className="text-sm text-orange-700">Survival Rate:</span>
                    <p className="font-bold text-orange-800">{aiAnalysis.estimatedSurvivalRate}%</p>
                  </div>
                )}
              </div>
              {aiAnalysis.vitalSignsAnalysis.concerningValues?.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm text-orange-700">Concerning Values:</span>
                  <ul className="text-sm text-orange-800 mt-1 space-y-1">
                    {aiAnalysis.vitalSignsAnalysis.concerningValues.map((value: string, index: number) => (
                      <li key={index}>• {value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Treatment Protocol */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            Treatment Protocol
          </h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-800">
              {aiAnalysis?.treatmentProtocol || 'Standard Emergency Protocol'}
            </p>
            
            {/* Recommendations */}
            {aiAnalysis?.recommendations && aiAnalysis.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-blue-700 mb-2">IMMEDIATE ACTIONS REQUIRED:</h4>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.slice(0, 5).map((rec: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-blue-800">
                        {typeof rec === 'string' ? rec : rec.action}
                        {rec.timeframe && (
                          <span className="text-xs text-blue-600 ml-2">({rec.timeframe})</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t text-center text-xs text-muted-foreground">
          <p>This report was generated using AI-assisted medical analysis. Always consult with qualified medical professionals for treatment decisions.</p>
          <p className="mt-1">TraumaLink Emergency Response System • Generated at {timestamp.toISOString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalAssessmentReport;