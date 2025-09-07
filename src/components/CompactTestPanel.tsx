import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseTest } from '@/hooks/useSupabaseTest';
import { Database, Brain, ChevronUp, ChevronDown, Activity, TestTube } from 'lucide-react';

const CompactTestPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const { testDatabase, testAIAnalysis, testResults, isLoading } = useSupabaseTest();

  const handleDatabaseTest = async () => {
    try {
      await testDatabase();
    } catch (error) {
      console.error('Database test failed:', error);
    }
  };

  const handleAITest = async () => {
    try {
      const result = await testAIAnalysis();
      setAiResults(result);
    } catch (error) {
      console.error('AI test failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50">
      <Card className="bg-background/95 backdrop-blur border-border/50 shadow-lg">
        <CardContent className="p-3">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">System Tests</span>
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>

          {isExpanded && (
            <div className="mt-3 space-y-3">
              {/* Quick Test Buttons */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDatabaseTest}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Database className="h-3 w-3 mr-1" />
                  DB
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAITest}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  AI
                </Button>
              </div>

              {/* Results Summary */}
              {testResults && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Database:</span>
                    <div className="flex space-x-1">
                      <Badge variant="secondary" className="text-xs px-1">
                        {testResults.hospitals?.length || 0}H
                      </Badge>
                      <Badge variant="secondary" className="text-xs px-1">
                        {testResults.patients?.length || 0}P
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Results */}
              {aiResults && (
                <div className="space-y-2 text-xs bg-muted/30 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI Analysis</span>
                    <Badge variant="secondary" className="text-xs">
                      {aiResults.overallConfidence}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Analyzing: {aiResults.imageAnalysis?.predictedOn}
                    </div>
                    
                    {aiResults.imageAnalysis?.detectedConditions?.map((condition: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-background/50 p-1 rounded">
                        <span className="text-xs truncate">{condition.condition}</span>
                        <div className="flex items-center space-x-1">
                          <Badge 
                            variant={condition.severity === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs px-1"
                          >
                            {condition.confidence}%
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {aiResults.vitalSignsAnalysis && (
                      <div className="mt-2 pt-1 border-t border-border/50">
                        <div className="flex justify-between">
                          <span className="text-xs">Risk Score:</span>
                          <Badge 
                            variant={aiResults.vitalSignsAnalysis.riskScore > 50 ? 'destructive' : 'secondary'}
                            className="text-xs px-1"
                          >
                            {aiResults.vitalSignsAnalysis.riskScore}/100
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <Activity className="h-4 w-4 animate-spin text-primary" />
                  <span className="ml-2 text-xs">Testing...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactTestPanel;