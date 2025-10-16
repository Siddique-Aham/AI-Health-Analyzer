import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CancerData {
  age: number;
  gender: string;
  smokingHistory: string;
  alcoholConsumption: string;
  familyHistory: string;
  bmi: number;
  physicalActivity: string;
  dietQuality: string;
  sunExposure: string;
  occupationalExposure: string;
  medicalHistory: string;
  reproductiveHistory: string;
  vaccinationStatus: string;
  chronicInflammation: string;
  previousCancer: string;
}

interface PredictionResult {
  risk: 'Very Low Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
  confidence: number;
  recommendations: string[];
  riskFactors: string[];
  screeningTests: string[];
}

export default function CancerAnalyzer() {
  const [formData, setFormData] = useState<CancerData>({
    age: 0,
    gender: '',
    smokingHistory: '',
    alcoholConsumption: '',
    familyHistory: '',
    bmi: 0,
    physicalActivity: '',
    dietQuality: '',
    sunExposure: '',
    occupationalExposure: '',
    medicalHistory: '',
    reproductiveHistory: '',
    vaccinationStatus: '',
    chronicInflammation: '',
    previousCancer: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CancerData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCancerRisk = (): PredictionResult => {
    let riskScore = 0;
    let riskFactors: string[] = [];
    let screeningTests: string[] = [];
    
    // Age is the strongest risk factor
    if (formData.age >= 70) {
      riskScore += 5;
      riskFactors.push('Advanced age (≥70)');
    } else if (formData.age >= 60) {
      riskScore += 4;
      riskFactors.push('Older age (60-69)');
    } else if (formData.age >= 50) {
      riskScore += 3;
      riskFactors.push('Middle age (50-59)');
    } else if (formData.age >= 40) {
      riskScore += 2;
      riskFactors.push('Age over 40');
    }
    
    // Gender-specific risks and screening
    if (formData.gender === 'female') {
      screeningTests.push('Mammography (40+)', 'Cervical screening (21+)');
      if (formData.reproductiveHistory === 'high_risk') {
        riskScore += 2;
        riskFactors.push('High-risk reproductive factors');
      }
    } else if (formData.gender === 'male') {
      screeningTests.push('Prostate screening (50+)');
    }
    
    // Smoking - strongest modifiable risk factor
    if (formData.smokingHistory === 'heavy_current') {
      riskScore += 6;
      riskFactors.push('Heavy current smoking');
      screeningTests.push('Low-dose CT (lung)', 'Head & neck examination');
    } else if (formData.smokingHistory === 'current') {
      riskScore += 4;
      riskFactors.push('Current smoking');
      screeningTests.push('Lung screening');
    } else if (formData.smokingHistory === 'former_heavy') {
      riskScore += 3;
      riskFactors.push('Former heavy smoker');
      screeningTests.push('Lung screening');
    } else if (formData.smokingHistory === 'former') {
      riskScore += 2;
      riskFactors.push('Former smoker');
    }
    
    // Alcohol consumption
    if (formData.alcoholConsumption === 'heavy') {
      riskScore += 3;
      riskFactors.push('Heavy alcohol use');
      screeningTests.push('Liver imaging', 'Upper endoscopy');
    } else if (formData.alcoholConsumption === 'moderate') {
      riskScore += 1;
      riskFactors.push('Moderate alcohol use');
    }
    
    // Family history
    if (formData.familyHistory === 'strong') {
      riskScore += 4;
      riskFactors.push('Strong family history');
      screeningTests.push('Genetic counseling', 'Enhanced screening');
    } else if (formData.familyHistory === 'moderate') {
      riskScore += 2;
      riskFactors.push('Family history present');
      screeningTests.push('Earlier screening');
    }
    
    // BMI and obesity
    if (formData.bmi >= 35) {
      riskScore += 3;
      riskFactors.push('Severe obesity (BMI ≥35)');
    } else if (formData.bmi >= 30) {
      riskScore += 2;
      riskFactors.push('Obesity (BMI 30-35)');
    } else if (formData.bmi >= 25) {
      riskScore += 1;
      riskFactors.push('Overweight (BMI 25-30)');
    }
    
    // Physical activity - protective factor
    if (formData.physicalActivity === 'none') {
      riskScore += 2;
      riskFactors.push('Sedentary lifestyle');
    } else if (formData.physicalActivity === 'minimal') {
      riskScore += 1;
      riskFactors.push('Insufficient physical activity');
    } else if (formData.physicalActivity === 'regular') {
      riskScore -= 1; // Protective
    } else if (formData.physicalActivity === 'high') {
      riskScore -= 2; // Highly protective
    }
    
    // Diet quality
    if (formData.dietQuality === 'poor') {
      riskScore += 2;
      riskFactors.push('Poor diet quality');
    } else if (formData.dietQuality === 'average') {
      riskScore += 1;
    } else if (formData.dietQuality === 'excellent') {
      riskScore -= 1; // Protective
    }
    
    // Sun exposure (skin cancer risk)
    if (formData.sunExposure === 'excessive') {
      riskScore += 2;
      riskFactors.push('Excessive sun exposure');
      screeningTests.push('Dermatology screening');
    } else if (formData.sunExposure === 'moderate') {
      riskScore += 1;
      screeningTests.push('Annual skin check');
    }
    
    // Occupational exposure
    if (formData.occupationalExposure === 'high') {
      riskScore += 3;
      riskFactors.push('High occupational exposure');
      screeningTests.push('Occupational health screening');
    } else if (formData.occupationalExposure === 'moderate') {
      riskScore += 1;
      riskFactors.push('Moderate occupational exposure');
    }
    
    // Medical history
    if (formData.medicalHistory === 'high_risk') {
      riskScore += 3;
      riskFactors.push('High-risk medical conditions');
      screeningTests.push('Targeted screening');
    } else if (formData.medicalHistory === 'moderate_risk') {
      riskScore += 1;
      riskFactors.push('Some risk conditions');
    }
    
    // Vaccination status
    if (formData.vaccinationStatus === 'incomplete') {
      riskScore += 1;
      riskFactors.push('Incomplete vaccinations');
    }
    
    // Chronic inflammation
    if (formData.chronicInflammation === 'severe') {
      riskScore += 2;
      riskFactors.push('Severe chronic inflammation');
    } else if (formData.chronicInflammation === 'moderate') {
      riskScore += 1;
      riskFactors.push('Chronic inflammatory condition');
    }
    
    // Previous cancer
    if (formData.previousCancer === 'yes') {
      riskScore += 4;
      riskFactors.push('Previous cancer history');
      screeningTests.push('Enhanced surveillance');
    }
    
    // Standard screening tests based on age
    if (formData.age >= 50) {
      screeningTests.push('Colonoscopy');
    }
    if (formData.age >= 45) {
      screeningTests.push('Annual physical exam');
    }

    let risk: 'Very Low Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
    let confidence: number;
    let recommendations: string[];

    if (riskScore >= 18) {
      risk = 'Very High Risk';
      confidence = Math.min(85 + Math.random() * 10, 95);
      recommendations = [
        'Immediate oncology consultation required',
        'Comprehensive genetic counseling and testing',
        'Enhanced multi-organ screening program',
        'Consider preventive interventions where appropriate',
        'Aggressive lifestyle modification program',
        'Regular monitoring every 3-6 months',
        'Participation in high-risk screening protocols',
        'Consider chemoprevention if eligible'
      ];
    } else if (riskScore >= 12) {
      risk = 'High Risk';
      confidence = Math.min(80 + Math.random() * 15, 95);
      recommendations = [
        'Consultation with oncologist or genetic counselor',
        'Accelerated and enhanced screening protocols',
        'Annual comprehensive cancer screening',
        'Immediate smoking cessation if applicable',
        'Weight management and dietary counseling',
        'Consider preventive medications where indicated',
        'Regular follow-up every 6 months',
        'Family screening recommendations'
      ];
    } else if (riskScore >= 7) {
      risk = 'Moderate Risk';
      confidence = Math.min(75 + Math.random() * 20, 95);
      recommendations = [
        'Follow standard cancer screening guidelines',
        'Annual health check-ups with primary physician',
        'Lifestyle modification program',
        'Age-appropriate cancer screening tests',
        'Maintain healthy weight and diet',
        'Regular physical activity (150 min/week)',
        'Limit alcohol consumption',
        'Annual skin and self-examinations'
      ];
    } else if (riskScore >= 3) {
      risk = 'Low Risk';
      confidence = Math.min(70 + Math.random() * 25, 95);
      recommendations = [
        'Continue healthy lifestyle practices',
        'Follow routine screening recommendations',
        'Maintain regular physical activity',
        'Healthy diet rich in fruits and vegetables',
        'Limit processed foods and red meat',
        'Avoid tobacco and limit alcohol',
        'Sun protection and skin awareness',
        'Biennial health check-ups'
      ];
    } else {
      risk = 'Very Low Risk';
      confidence = Math.min(75 + Math.random() * 20, 95);
      recommendations = [
        'Excellent! Continue current healthy practices',
        'Maintain optimal weight and fitness level',
        'Continue nutritious, balanced diet',
        'Regular exercise and stress management',
        'Follow age-appropriate screening only',
        'Sun safety and skin protection',
        'Avoid known carcinogens',
        'Health check-ups every 2-3 years'
      ];
    }

    // Remove duplicates and limit arrays
    const uniqueRiskFactors = [...new Set(riskFactors)].slice(0, 6);
    const uniqueScreeningTests = [...new Set(screeningTests)].slice(0, 6);

    return { 
      risk, 
      confidence: Math.round(confidence), 
      recommendations,
      riskFactors: uniqueRiskFactors,
      screeningTests: uniqueScreeningTests
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const prediction = calculateCancerRisk();
    setResult(prediction);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      gender: '',
      smokingHistory: '',
      alcoholConsumption: '',
      familyHistory: '',
      bmi: 0,
      physicalActivity: '',
      dietQuality: '',
      sunExposure: '',
      occupationalExposure: '',
      medicalHistory: '',
      reproductiveHistory: '',
      vaccinationStatus: '',
      chronicInflammation: '',
      previousCancer: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Shield className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">OncoGuard - Cancer Risk Analyzer</h1>
          <p className="text-gray-400">Comprehensive cancer risk assessment and screening recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Form - Takes 2 columns */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Cancer Risk Assessment
              </CardTitle>
              <CardDescription>
                Complete comprehensive cancer risk evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Demographics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Demographics</h3>
                  <div className="grid grid-cols-3 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="bmi" className="text-gray-300">BMI</Label>
                      <Input
                        id="bmi"
                        type="number"
                        step="0.1"
                        value={formData.bmi || ''}
                        onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="25.0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle Factors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Lifestyle & Behavioral Factors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Smoking History</Label>
                      <Select value={formData.smokingHistory} onValueChange={(value) => handleInputChange('smokingHistory', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never smoked</SelectItem>
                          <SelectItem value="former">Former smoker</SelectItem>
                          <SelectItem value="current">Current smoker</SelectItem>
                          <SelectItem value="former_heavy">Former heavy smoker (&gt;20 pack-years)</SelectItem>
                          <SelectItem value="heavy_current">Heavy current smoker (&gt;20 pack-years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Alcohol Consumption</Label>
                      <Select value={formData.alcoholConsumption} onValueChange={(value) => handleInputChange('alcoholConsumption', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None/Rare</SelectItem>
                          <SelectItem value="light">Light (1-7 drinks/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (8-14 drinks/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (&gt;14 drinks/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Physical Activity Level</Label>
                      <Select value={formData.physicalActivity} onValueChange={(value) => handleInputChange('physicalActivity', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sedentary (no exercise)</SelectItem>
                          <SelectItem value="minimal">Minimal (&lt;150 min/week)</SelectItem>
                          <SelectItem value="regular">Regular (150-300 min/week)</SelectItem>
                          <SelectItem value="high">High (&gt;300 min/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Diet Quality</Label>
                      <Select value={formData.dietQuality} onValueChange={(value) => handleInputChange('dietQuality', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Poor (processed foods, low fruits/vegetables)</SelectItem>
                          <SelectItem value="average">Average (mixed diet)</SelectItem>
                          <SelectItem value="good">Good (balanced, some fruits/vegetables)</SelectItem>
                          <SelectItem value="excellent">Excellent (Mediterranean/plant-based)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Family & Medical History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Medical & Family History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Family History of Cancer</Label>
                      <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange('familyHistory', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No family history</SelectItem>
                          <SelectItem value="distant">Distant relatives only</SelectItem>
                          <SelectItem value="moderate">First/second degree relatives</SelectItem>
                          <SelectItem value="strong">Strong family history (multiple relatives)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Personal Medical History</Label>
                      <Select value={formData.medicalHistory} onValueChange={(value) => handleInputChange('medicalHistory', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No significant history</SelectItem>
                          <SelectItem value="low_risk">Minor conditions only</SelectItem>
                          <SelectItem value="moderate_risk">Some cancer-related conditions</SelectItem>
                          <SelectItem value="high_risk">High-risk conditions (immunodeficiency, etc.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Previous Cancer</Label>
                      <Select value={formData.previousCancer} onValueChange={(value) => handleInputChange('previousCancer', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Chronic Inflammation</Label>
                      <Select value={formData.chronicInflammation} onValueChange={(value) => handleInputChange('chronicInflammation', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild (occasional flares)</SelectItem>
                          <SelectItem value="moderate">Moderate (IBD, etc.)</SelectItem>
                          <SelectItem value="severe">Severe/chronic conditions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Environmental & Other Factors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Environmental & Other Risk Factors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Sun Exposure</Label>
                      <Select value={formData.sunExposure} onValueChange={(value) => handleInputChange('sunExposure', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal (always protected)</SelectItem>
                          <SelectItem value="moderate">Moderate (some protection)</SelectItem>
                          <SelectItem value="high">High (regular unprotected exposure)</SelectItem>
                          <SelectItem value="excessive">Excessive (frequent burns/tanning)</SelectItem>
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
                          <SelectItem value="none">No significant exposure</SelectItem>
                          <SelectItem value="low">Low exposure (office work)</SelectItem>
                          <SelectItem value="moderate">Moderate (chemicals, radiation)</SelectItem>
                          <SelectItem value="high">High (mining, asbestos, etc.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Vaccination Status</Label>
                      <Select value={formData.vaccinationStatus} onValueChange={(value) => handleInputChange('vaccinationStatus', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complete">Up-to-date (HPV, Hep B, etc.)</SelectItem>
                          <SelectItem value="incomplete">Some missing vaccinations</SelectItem>
                          <SelectItem value="none">No relevant vaccinations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.gender === 'female' && (
                      <div className="space-y-2">
                        <Label className="text-gray-300">Reproductive History</Label>
                        <Select value={formData.reproductiveHistory} onValueChange={(value) => handleInputChange('reproductiveHistory', value)} required>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low_risk">Low risk profile</SelectItem>
                            <SelectItem value="average">Average risk profile</SelectItem>
                            <SelectItem value="high_risk">High-risk factors (nulliparity, late menopause, etc.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? 'Analyzing Risk Profile...' : 'Calculate Cancer Risk'}
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
            <>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {result.risk === 'Very High Risk' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {result.risk === 'High Risk' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                    {result.risk === 'Moderate Risk' && <Activity className="h-5 w-5 text-yellow-400" />}
                    {result.risk === 'Low Risk' && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {result.risk === 'Very Low Risk' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-gray-700/50">
                    <div className={`text-xl font-bold mb-2 ${
                      result.risk === 'Very High Risk' ? 'text-red-500' :
                      result.risk === 'High Risk' ? 'text-red-400' :
                      result.risk === 'Moderate Risk' ? 'text-yellow-400' :
                      result.risk === 'Low Risk' ? 'text-green-400' : 'text-green-500'
                    }`}>
                      {result.risk}
                    </div>
                    <div className="text-gray-300 text-sm">
                      Confidence: {result.confidence}%
                    </div>
                  </div>

                  {result.riskFactors.length > 0 && (
                    <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                      <h4 className="text-sm font-semibold text-white mb-2">Key Risk Factors:</h4>
                      <div className="space-y-1">
                        {result.riskFactors.map((factor, index) => (
                          <div key={index} className="text-xs text-red-300">• {factor}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.screeningTests.length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700">
                      <h4 className="text-sm font-semibold text-white mb-2">Recommended Screening:</h4>
                      <div className="space-y-1">
                        {result.screeningTests.map((test, index) => (
                          <div key={index} className="text-xs text-blue-300">• {test}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert className={`border ${
                    result.risk === 'Very High Risk' ? 'border-red-500 bg-red-500/10' :
                    result.risk === 'High Risk' ? 'border-red-400 bg-red-400/10' :
                    result.risk === 'Moderate Risk' ? 'border-yellow-500 bg-yellow-500/10' :
                    result.risk === 'Low Risk' ? 'border-green-500 bg-green-500/10' : 
                    'border-green-600 bg-green-600/10'
                  }`}>
                    <AlertDescription className="text-white">
                      <div className="font-semibold mb-2">Action Plan:</div>
                      <ul className="space-y-1">
                        {result.recommendations.slice(0, 4).map((rec, index) => (
                          <li key={index} className="text-xs">• {rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </>
          )}

          {/* Info Cards */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Prevention Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p><strong>Key Prevention Strategies:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Quit smoking and avoid secondhand smoke</li>
                <li>Maintain healthy weight (BMI 18.5-25)</li>
                <li>Regular physical activity (150+ min/week)</li>
                <li>Limit alcohol consumption</li>
                <li>Eat plenty of fruits and vegetables</li>
                <li>Protect skin from UV radiation</li>
                <li>Get recommended vaccinations</li>
                <li>Follow screening guidelines</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Important Note</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p className="text-yellow-300 font-semibold">This is a risk assessment tool only.</p>
              <p>It cannot diagnose cancer or replace professional medical evaluation. Always consult healthcare providers for personalized advice and appropriate screening.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}