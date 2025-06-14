
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TriageResult {
  triageLevel: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  recommendedActions: string[];
  estimatedWaitTime: string;
}

interface TriagePredictionProps {
  onTriageResult?: (result: TriageResult) => void;
  initialSymptoms?: string;
  initialVitals?: string;
}

const TriagePrediction: React.FC<TriagePredictionProps> = ({ 
  onTriageResult, 
  initialSymptoms = '', 
  initialVitals = '' 
}) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [vitals, setVitals] = useState(initialVitals);
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const getTriageLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTriageLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Clock className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter patient symptoms');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-triage', {
        body: {
          symptoms: symptoms.trim(),
          vitals: vitals.trim(),
          patientAge: patientAge || null,
          patientGender: patientGender || null,
        }
      });

      if (error) throw error;

      console.log('Triage prediction result:', data);
      setTriageResult(data);
      
      if (onTriageResult) {
        onTriageResult(data);
      }

      toast.success('Triage level predicted successfully');
    } catch (error: any) {
      console.error('Error predicting triage:', error);
      toast.error(`Failed to predict triage level: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms(initialSymptoms);
    setVitals(initialVitals);
    setPatientAge('');
    setPatientGender('');
    setTriageResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Triage Prediction
          </CardTitle>
          <CardDescription>
            Enter patient information to get an AI-powered triage level assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientAge">Patient Age</Label>
              <Input
                id="patientAge"
                placeholder="e.g., 45"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="patientGender">Gender</Label>
              <Select value={patientGender} onValueChange={setPatientGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms *</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe the patient's symptoms in detail..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="vitals">Vital Signs</Label>
            <Textarea
              id="vitals"
              placeholder="e.g., BP: 140/90, HR: 95, Temp: 38.5°C, O2 Sat: 98%"
              value={vitals}
              onChange={(e) => setVitals(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handlePredict} 
              disabled={isLoading || !symptoms.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Predict Triage Level
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {triageResult && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Triage Assessment</span>
              <Badge className={getTriageLevelColor(triageResult.triageLevel)}>
                {getTriageLevelIcon(triageResult.triageLevel)}
                <span className="ml-1 capitalize">{triageResult.triageLevel} Priority</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Assessment Reasoning</h4>
              <p className="text-sm">{triageResult.reasoning}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Estimated Wait Time</h4>
              <p className="text-sm font-medium">{triageResult.estimatedWaitTime}</p>
            </div>

            {triageResult.recommendedActions && triageResult.recommendedActions.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Recommended Actions</h4>
                <ul className="text-sm space-y-1">
                  {triageResult.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2 border-t">
              Confidence: {Math.round((triageResult.confidence || 0) * 100)}% | 
              This is an AI assessment and should be reviewed by medical professionals
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TriagePrediction;
