import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface AIAnalysisResult {
  imageAnalysis: {
    detectedConditions: Array<{
      condition: string;
      confidence: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
    overallConfidence: number;
    recommendations: string[];
  };
  vitalSignsAnalysis: {
    riskScore: number;
    concerningValues: string[];
    recommendations: string[];
  };
  overallConfidence: number;
}

interface AiAnalysisResultsProps {
  progress: number;
  analysisData: AIAnalysisResult | null;
  isAnalyzing: boolean;
}

const AiAnalysisResults = ({ progress, analysisData, isAnalyzing }: AiAnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-600 text-center">
              {progress < 30 && "Processing medical images..."}
              {progress >= 30 && progress < 60 && "Analyzing vital signs..."}
              {progress >= 60 && progress < 90 && "Cross-referencing medical data..."}
              {progress >= 90 && "Generating recommendations..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData || !analysisData.imageAnalysis || !analysisData.vitalSignsAnalysis) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Upload images and enter vital signs to see AI analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getOverallStatus = () => {
    const confidence = analysisData.overallConfidence;
    if (confidence >= 90) return { icon: CheckCircle, text: 'High Confidence', color: 'text-green-600' };
    if (confidence >= 70) return { icon: Activity, text: 'Good Confidence', color: 'text-blue-600' };
    return { icon: AlertTriangle, text: 'Review Required', color: 'text-yellow-600' };
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            AI Medical Analysis
          </div>
          <div className="flex items-center text-sm">
            <StatusIcon className={`h-4 w-4 mr-1 ${status.color}`} />
            <span className={status.color}>{status.text}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Analysis Results */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Brain className="h-4 w-4 mr-1" />
            Image Analysis ({analysisData.imageAnalysis.overallConfidence}% confidence)
          </h4>
          <div className="space-y-2">
            {analysisData.imageAnalysis.detectedConditions?.map((condition, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span className="font-medium">{condition.condition}</span>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(condition.severity)}>
                    {condition.severity}
                  </Badge>
                  <span className="text-sm text-gray-600">{condition.confidence}%</span>
                </div>
              </div>
            )) || (
              <div className="p-2 rounded bg-gray-50 text-gray-600 text-sm">
                No conditions detected
              </div>
            )}
          </div>
        </div>

        {/* Vital Signs Analysis */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            Vital Signs Assessment (Risk Score: {analysisData.vitalSignsAnalysis.riskScore})
          </h4>
          {analysisData.vitalSignsAnalysis.concerningValues?.length > 0 ? (
            <div className="space-y-1">
              {analysisData.vitalSignsAnalysis.concerningValues.map((value, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{value}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="p-2 rounded bg-green-50 text-green-800 text-sm">
              Vital signs within normal ranges
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium mb-2">Recommended Actions</h4>
          <div className="space-y-1">
            {[...(analysisData.imageAnalysis.recommendations || []), ...(analysisData.vitalSignsAnalysis.recommendations || [])]
              .slice(0, 5)
              .map((recommendation, index) => (
                <div key={index} className="flex items-start p-2 rounded bg-blue-50 text-blue-800 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  {recommendation}
                </div>
              ))}
          </div>
        </div>

        {/* Overall Confidence */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Assessment Confidence</span>
            <span className="text-sm">{analysisData.overallConfidence}%</span>
          </div>
          <Progress value={analysisData.overallConfidence} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysisResults;