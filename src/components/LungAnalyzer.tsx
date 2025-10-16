import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wind, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LungData {
  age: number;
  gender: string;
  smokingHistory: string;
  yearsOfSmoking: number;
  packYears: number;
  chronicCough: string;
  shortnessOfBreath: string;
  chestPain: string;
  wheezing: string;
  fatigueWeakness: string;
  weightLoss: string;
  respiratoryRate: number;
  oxygenSaturation: number;
  peakFlow: number;
  chestXray: string;
  familyHistory: string;
  occupationalExposure: string;
  allergies: string;
}

interface PredictionResult {
  risk: 'Healthy Lungs' | 'Mild Risk' | 'Moderate Risk' | 'High Risk';
  confidence: number;
  recommendations: string[];
  possibleConditions: string[];
}

export default function LungAnalyzer() {
  const [formData, setFormData] = useState<LungData>({
    age: 0,
    gender: '',
    smokingHistory: '',
    yearsOfSmoking: 0,
    packYears: 0,
    chronicCough: '',
    shortnessOfBreath: '',
    chestPain: '',
    wheezing: '',
    fatigueWeakness: '',
    weightLoss: '',
    respiratoryRate: 0,
    oxygenSaturation: 0,
    peakFlow: 0,
    chestXray: '',
    familyHistory: '',
    occupationalExposure: '',
    allergies: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LungData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateLungRisk = (): PredictionResult => {
    let riskScore = 0;
    let possibleConditions: string[] = [];
    
    // Age factor
    if (formData.age > 65) riskScore += 3;
    else if (formData.age > 50) riskScore += 2;
    else if (formData.age > 40) riskScore += 1;
    
    // Smoking history (major risk factor)
    if (formData.smokingHistory === 'current') {
      riskScore += 5;
      possibleConditions.push('COPD', 'Lung Cancer Risk', 'Emphysema');
    } else if (formData.smokingHistory === 'former') {
      riskScore += 3;
      possibleConditions.push('COPD Risk', 'Residual Damage');
    }
    
    // Pack years (cigarettes per day × years / 20)
    if (formData.packYears > 30) riskScore += 4;
    else if (formData.packYears > 20) riskScore += 3;
    else if (formData.packYears > 10) riskScore += 2;
    
    // Symptoms assessment
    if (formData.chronicCough === 'severe') {
      riskScore += 3;
      possibleConditions.push('Chronic Bronchitis', 'COPD');
    } else if (formData.chronicCough === 'moderate') {
      riskScore += 2;
    } else if (formData.chronicCough === 'mild') {
      riskScore += 1;
    }
    
    if (formData.shortnessOfBreath === 'severe') {
      riskScore += 4;
      possibleConditions.push('Asthma', 'COPD', 'Pulmonary Embolism');
    } else if (formData.shortnessOfBreath === 'moderate') {
      riskScore += 2;
      possibleConditions.push('Exercise Intolerance', 'Mild Asthma');
    } else if (formData.shortnessOfBreath === 'mild') {
      riskScore += 1;
    }
    
    if (formData.chestPain === 'severe') {
      riskScore += 3;
      possibleConditions.push('Pneumonia', 'Pleuritis', 'Pulmonary Embolism');
    } else if (formData.chestPain === 'moderate') {
      riskScore += 2;
    }
    
    if (formData.wheezing === 'frequent') {
      riskScore += 3;
      possibleConditions.push('Asthma', 'COPD', 'Allergic Bronchitis');
    } else if (formData.wheezing === 'occasional') {
      riskScore += 1;
    }
    
    if (formData.weightLoss === 'significant') {
      riskScore += 4;
      possibleConditions.push('Lung Cancer', 'Advanced COPD', 'Tuberculosis');
    } else if (formData.weightLoss === 'moderate') {
      riskScore += 2;
    }
    
    // Vital signs
    if (formData.respiratoryRate > 24) riskScore += 3;
    else if (formData.respiratoryRate > 20) riskScore += 2;
    
    if (formData.oxygenSaturation < 90) riskScore += 4;
    else if (formData.oxygenSaturation < 95) riskScore += 3;
    else if (formData.oxygenSaturation < 98) riskScore += 1;
    
    // Peak flow (Normal varies by age/gender, approximately 400-700 L/min)
    const expectedPeakFlow = formData.gender === 'male' ? 
      (formData.age < 40 ? 600 : 500) : 
      (formData.age < 40 ? 450 : 380);
    
    const peakFlowPercentage = (formData.peakFlow / expectedPeakFlow) * 100;
    if (peakFlowPercentage < 50) {
      riskScore += 4;
      possibleConditions.push('Severe Airway Obstruction', 'Acute Asthma');
    } else if (peakFlowPercentage < 70) {
      riskScore += 3;
      possibleConditions.push('Moderate Airway Obstruction');
    } else if (peakFlowPercentage < 80) {
      riskScore += 2;
    }
    
    // Chest X-ray findings
    if (formData.chestXray === 'abnormal') {
      riskScore += 4;
      possibleConditions.push('Pneumonia', 'Lung Cancer', 'Pulmonary Fibrosis');
    } else if (formData.chestXray === 'suspicious') {
      riskScore += 2;
    }
    
    // Risk factors
    if (formData.familyHistory === 'yes') riskScore += 2;
    if (formData.occupationalExposure === 'high') {
      riskScore += 3;
      possibleConditions.push('Occupational Lung Disease', 'Asbestosis');
    } else if (formData.occupationalExposure === 'moderate') {
      riskScore += 1;
    }
    
    if (formData.allergies === 'severe') {
      riskScore += 2;
      possibleConditions.push('Allergic Asthma', 'Hypersensitivity Pneumonitis');
    }

    let risk: 'Healthy Lungs' | 'Mild Risk' | 'Moderate Risk' | 'High Risk';
    let confidence: number;
    let recommendations: string[];

    if (riskScore >= 20) {
      risk = 'High Risk';
      confidence = Math.min(85 + Math.random() * 10, 95);
      recommendations = [
        'Immediate pulmonology consultation required',
        'Complete pulmonary function tests (PFTs)',
        'High-resolution CT scan of chest',
        'Consider bronchoscopy if indicated',
        'Immediate smoking cessation if applicable',
        'Oxygen therapy evaluation if hypoxic',
        'Pulmonary rehabilitation program',
        'Regular monitoring for disease progression'
      ];
    } else if (riskScore >= 12) {
      risk = 'Moderate Risk';
      confidence = Math.min(75 + Math.random() * 15, 90);
      recommendations = [
        'Pulmonologist consultation recommended',
        'Spirometry and lung function testing',
        'Chest CT scan if symptoms persist',
        'Smoking cessation program if needed',
        'Bronchodilator therapy trial',
        'Avoid respiratory irritants and pollutants',
        'Annual influenza and pneumonia vaccines',
        'Regular follow-up every 3-6 months'
      ];
    } else if (riskScore >= 6) {
      risk = 'Mild Risk';
      confidence = Math.min(70 + Math.random() * 20, 90);
      recommendations = [
        'Regular monitoring by primary physician',
        'Basic spirometry screening annually',
        'Smoking cessation if applicable',
        'Regular cardiovascular exercise as tolerated',
        'Avoid secondhand smoke and air pollution',
        'Maintain healthy weight',
        'Stay up-to-date with vaccinations',
        'Practice breathing exercises'
      ];
    } else {
      risk = 'Healthy Lungs';
      confidence = Math.min(80 + Math.random() * 15, 95);
      recommendations = [
        'Continue maintaining excellent lung health',
        'Regular aerobic exercise (30 min, 5x/week)',
        'Avoid smoking and secondhand smoke',
        'Annual health screenings',
        'Practice deep breathing exercises',
        'Maintain good indoor air quality',
        'Stay hydrated and eat antioxidant-rich foods',
        'Get adequate sleep and manage stress'
      ];
    }

    // Remove duplicate conditions
    const uniqueConditions = [...new Set(possibleConditions)];

    return { 
      risk, 
      confidence: Math.round(confidence), 
      recommendations,
      possibleConditions: uniqueConditions.slice(0, 4) // Limit to top 4
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const prediction = calculateLungRisk();
    setResult(prediction);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      gender: '',
      smokingHistory: '',
      yearsOfSmoking: 0,
      packYears: 0,
      chronicCough: '',
      shortnessOfBreath: '',
      chestPain: '',
      wheezing: '',
      fatigueWeakness: '',
      weightLoss: '',
      respiratoryRate: 0,
      oxygenSaturation: 0,
      peakFlow: 0,
      chestXray: '',
      familyHistory: '',
      occupationalExposure: '',
      allergies: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Wind className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">PneumoAI - Lung Health Detector</h1>
          <p className="text-gray-400">Comprehensive respiratory health assessment and COPD screening</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Form - Takes 2 columns */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Respiratory Assessment
              </CardTitle>
              <CardDescription>
                Complete respiratory health evaluation form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Demographics & Smoking History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Basic Information & Smoking History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-300">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Smoking History</Label>
                      <Select value={formData.smokingHistory} onValueChange={(value) => handleInputChange('smokingHistory', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never Smoked</SelectItem>
                          <SelectItem value="former">Former Smoker</SelectItem>
                          <SelectItem value="current">Current Smoker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packYears" className="text-gray-300">Pack Years</Label>
                      <Input
                        id="packYears"
                        type="number"
                        value={formData.packYears || ''}
                        onChange={(e) => handleInputChange('packYears', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Respiratory Symptoms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Chronic Cough</Label>
                      <Select value={formData.chronicCough} onValueChange={(value) => handleInputChange('chronicCough', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Shortness of Breath</Label>
                      <Select value={formData.shortnessOfBreath} onValueChange={(value) => handleInputChange('shortnessOfBreath', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild (with exertion)</SelectItem>
                          <SelectItem value="moderate">Moderate (with minimal activity)</SelectItem>
                          <SelectItem value="severe">Severe (at rest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Chest Pain</Label>
                      <Select value={formData.chestPain} onValueChange={(value) => handleInputChange('chestPain', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Wheezing</Label>
                      <Select value={formData.wheezing} onValueChange={(value) => handleInputChange('wheezing', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="frequent">Frequent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Unexplained Weight Loss</Label>
                      <Select value={formData.weightLoss} onValueChange={(value) => handleInputChange('weightLoss', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild (&lt; 5 lbs)</SelectItem>
                          <SelectItem value="moderate">Moderate (5-15 lbs)</SelectItem>
                          <SelectItem value="significant">Significant (&gt; 15 lbs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Vital Signs & Tests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Vital Signs & Tests</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="respiratoryRate" className="text-gray-300">Respiratory Rate (/min)</Label>
                      <Input
                        id="respiratoryRate"
                        type="number"
                        value={formData.respiratoryRate || ''}
                        onChange={(e) => handleInputChange('respiratoryRate', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="16"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygenSaturation" className="text-gray-300">Oxygen Saturation (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        value={formData.oxygenSaturation || ''}
                        onChange={(e) => handleInputChange('oxygenSaturation', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="98"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peakFlow" className="text-gray-300">Peak Flow (L/min)</Label>
                      <Input
                        id="peakFlow"
                        type="number"
                        value={formData.peakFlow || ''}
                        onChange={(e) => handleInputChange('peakFlow', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="450"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Risk Factors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Risk Factors & History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Chest X-ray Result</Label>
                      <Select value={formData.chestXray} onValueChange={(value) => handleInputChange('chestXray', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="suspicious">Suspicious findings</SelectItem>
                          <SelectItem value="abnormal">Clearly abnormal</SelectItem>
                          <SelectItem value="not_done">Not done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Family History (Lung Disease)</Label>
                      <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange('familyHistory', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Occupational Exposure</Label>
                      <Select value={formData.occupationalExposure} onValueChange={(value) => handleInputChange('occupationalExposure', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="low">Low (office work)</SelectItem>
                          <SelectItem value="moderate">Moderate (chemicals, dust)</SelectItem>
                          <SelectItem value="high">High (mining, construction)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Allergies/Asthma History</Label>
                      <Select value={formData.allergies} onValueChange={(value) => handleInputChange('allergies', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild allergies</SelectItem>
                          <SelectItem value="moderate">Moderate allergies/asthma</SelectItem>
                          <SelectItem value="severe">Severe asthma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Lung Health'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results - Takes 1 column */}
        <div className="space-y-4">
          {result && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {result.risk === 'High Risk' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                  {result.risk === 'Moderate Risk' && <Activity className="h-5 w-5 text-yellow-400" />}
                  {result.risk === 'Mild Risk' && <Activity className="h-5 w-5 text-orange-400" />}
                  {result.risk === 'Healthy Lungs' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  Lung Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gray-700/50">
                  <div className={`text-2xl font-bold mb-2 ${
                    result.risk === 'High Risk' ? 'text-red-400' :
                    result.risk === 'Moderate Risk' ? 'text-yellow-400' :
                    result.risk === 'Mild Risk' ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {result.risk}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Confidence: {result.confidence}%
                  </div>
                </div>

                {result.possibleConditions.length > 0 && (
                  <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                    <h4 className="text-sm font-semibold text-white mb-2">Possible Conditions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.possibleConditions.map((condition, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Alert className={`border ${
                  result.risk === 'High Risk' ? 'border-red-500 bg-red-500/10' :
                  result.risk === 'Moderate Risk' ? 'border-yellow-500 bg-yellow-500/10' :
                  result.risk === 'Mild Risk' ? 'border-orange-500 bg-orange-500/10' :
                  'border-green-500 bg-green-500/10'
                }`}>
                  <AlertDescription className="text-white">
                    <div className="font-semibold mb-2">Recommendations:</div>
                    <ul className="space-y-1">
                      {result.recommendations.slice(0, 5).map((rec, index) => (
                        <li key={index} className="text-xs">• {rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Normal Values</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <div className="grid grid-cols-1 gap-1">
                <div>• Respiratory Rate: 12-20 /min</div>
                <div>• O₂ Saturation: 95-100%</div>
                <div>• Peak Flow: 400-700 L/min</div>
                <div>• Normal varies by age/gender</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Lung Health Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p>Protect your lungs with these habits:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Quit smoking immediately</li>
                <li>Avoid secondhand smoke</li>
                <li>Exercise regularly</li>
                <li>Deep breathing exercises</li>
                <li>Avoid air pollution</li>
                <li>Get vaccinated (flu, pneumonia)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}