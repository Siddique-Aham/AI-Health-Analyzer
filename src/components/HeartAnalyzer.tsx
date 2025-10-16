import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HeartData {
  age: number;
  sex: string;
  chestPain: string;
  restingBP: number;
  cholesterol: number;
  fastingBS: string;
  restingECG: string;
  maxHR: number;
  exerciseAngina: string;
  oldpeak: number;
  stSlope: string;
}

interface PredictionResult {
  risk: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  confidence: number;
  recommendations: string[];
}

export default function HeartAnalyzer() {
  const [formData, setFormData] = useState<HeartData>({
    age: 0,
    sex: '',
    chestPain: '',
    restingBP: 0,
    cholesterol: 0,
    fastingBS: '',
    restingECG: '',
    maxHR: 0,
    exerciseAngina: '',
    oldpeak: 0,
    stSlope: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof HeartData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateHeartRisk = (): PredictionResult => {
    let riskScore = 0;
    
    // Age factor
    if (formData.age > 60) riskScore += 3;
    else if (formData.age > 45) riskScore += 2;
    else if (formData.age > 35) riskScore += 1;
    
    // Gender factor
    if (formData.sex === 'M') riskScore += 1;
    
    // Blood pressure
    if (formData.restingBP > 140) riskScore += 3;
    else if (formData.restingBP > 120) riskScore += 2;
    
    // Cholesterol
    if (formData.cholesterol > 240) riskScore += 3;
    else if (formData.cholesterol > 200) riskScore += 2;
    
    // Fasting blood sugar
    if (formData.fastingBS === 'Yes') riskScore += 2;
    
    // Chest pain type
    if (formData.chestPain === 'ASY') riskScore += 3;
    else if (formData.chestPain === 'NAP') riskScore += 2;
    else if (formData.chestPain === 'ATA') riskScore += 1;
    
    // Max heart rate
    if (formData.maxHR < 100) riskScore += 2;
    else if (formData.maxHR < 150) riskScore += 1;
    
    // Exercise angina
    if (formData.exerciseAngina === 'Y') riskScore += 2;
    
    // Oldpeak (ST depression)
    if (formData.oldpeak > 2) riskScore += 3;
    else if (formData.oldpeak > 1) riskScore += 2;
    else if (formData.oldpeak > 0) riskScore += 1;

    let risk: 'Low Risk' | 'Moderate Risk' | 'High Risk';
    let confidence: number;
    let recommendations: string[];

    if (riskScore >= 15) {
      risk = 'High Risk';
      confidence = Math.min(85 + Math.random() * 10, 95);
      recommendations = [
        'Immediate consultation with cardiologist recommended',
        'Consider stress test and ECG evaluation',
        'Start cardiac medication as prescribed',
        'Adopt heart-healthy diet (low sodium, low saturated fat)',
        'Begin supervised exercise program',
        'Monitor blood pressure daily',
        'Quit smoking and limit alcohol consumption'
      ];
    } else if (riskScore >= 8) {
      risk = 'Moderate Risk';
      confidence = Math.min(75 + Math.random() * 15, 90);
      recommendations = [
        'Schedule regular check-ups with your doctor',
        'Monitor blood pressure and cholesterol levels',
        'Maintain healthy weight through diet and exercise',
        'Include 30 minutes of moderate exercise daily',
        'Follow Mediterranean or DASH diet',
        'Manage stress through relaxation techniques',
        'Get adequate sleep (7-9 hours nightly)'
      ];
    } else {
      risk = 'Low Risk';
      confidence = Math.min(70 + Math.random() * 20, 90);
      recommendations = [
        'Continue maintaining healthy lifestyle',
        'Regular cardiovascular exercise 3-4 times per week',
        'Eat plenty of fruits, vegetables, and whole grains',
        'Maintain healthy weight and BMI',
        'Annual health check-ups recommended',
        'Stay hydrated and limit processed foods',
        'Practice stress management techniques'
      ];
    }

    return { risk, confidence: Math.round(confidence), recommendations };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate prediction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prediction = calculateHeartRisk();
    setResult(prediction);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      sex: '',
      chestPain: '',
      restingBP: 0,
      cholesterol: 0,
      fastingBS: '',
      restingECG: '',
      maxHR: 0,
      exerciseAngina: '',
      oldpeak: 0,
      stSlope: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <Heart className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">CardioGuard - Heart Risk Analyzer</h1>
          <p className="text-gray-400">AI-powered cardiovascular disease risk assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-400" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Enter your medical data for heart disease risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-300">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Gender</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)} required>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Chest Pain Type</Label>
                <Select value={formData.chestPain} onValueChange={(value) => handleInputChange('chestPain', value)} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select chest pain type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TA">Typical Angina</SelectItem>
                    <SelectItem value="ATA">Atypical Angina</SelectItem>
                    <SelectItem value="NAP">Non-Anginal Pain</SelectItem>
                    <SelectItem value="ASY">Asymptomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restingBP" className="text-gray-300">Resting BP (mmHg)</Label>
                  <Input
                    id="restingBP"
                    type="number"
                    value={formData.restingBP || ''}
                    onChange={(e) => handleInputChange('restingBP', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="120"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cholesterol" className="text-gray-300">Cholesterol (mg/dL)</Label>
                  <Input
                    id="cholesterol"
                    type="number"
                    value={formData.cholesterol || ''}
                    onChange={(e) => handleInputChange('cholesterol', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Fasting Blood Sugar &gt; 120 mg/dL</Label>
                <Select value={formData.fastingBS} onValueChange={(value) => handleInputChange('fastingBS', value)} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Resting ECG Result</Label>
                <Select value={formData.restingECG} onValueChange={(value) => handleInputChange('restingECG', value)} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select ECG result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="ST">ST-T Wave Abnormality</SelectItem>
                    <SelectItem value="LVH">Left Ventricular Hypertrophy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxHR" className="text-gray-300">Max Heart Rate</Label>
                  <Input
                    id="maxHR"
                    type="number"
                    value={formData.maxHR || ''}
                    onChange={(e) => handleInputChange('maxHR', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="150"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oldpeak" className="text-gray-300">ST Depression</Label>
                  <Input
                    id="oldpeak"
                    type="number"
                    step="0.1"
                    value={formData.oldpeak || ''}
                    onChange={(e) => handleInputChange('oldpeak', parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Exercise Induced Angina</Label>
                <Select value={formData.exerciseAngina} onValueChange={(value) => handleInputChange('exerciseAngina', value)} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Heart Risk'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {result.risk === 'High Risk' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                  {result.risk === 'Moderate Risk' && <Activity className="h-5 w-5 text-yellow-400" />}
                  {result.risk === 'Low Risk' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  Risk Assessment Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-gray-700/50">
                  <div className={`text-3xl font-bold mb-2 ${
                    result.risk === 'High Risk' ? 'text-red-400' :
                    result.risk === 'Moderate Risk' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {result.risk}
                  </div>
                  <div className="text-gray-300">
                    Confidence: {result.confidence}%
                  </div>
                </div>

                <Alert className={`border ${
                  result.risk === 'High Risk' ? 'border-red-500 bg-red-500/10' :
                  result.risk === 'Moderate Risk' ? 'border-yellow-500 bg-yellow-500/10' : 
                  'border-green-500 bg-green-500/10'
                }`}>
                  <AlertDescription className="text-white">
                    <div className="font-semibold mb-2">Recommendations:</div>
                    <ul className="space-y-1">
                      {result.recommendations.slice(0, 4).map((rec, index) => (
                        <li key={index} className="text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">About Heart Disease</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p>Heart disease is the leading cause of death globally. Early detection and lifestyle modifications can significantly reduce risk.</p>
              <p><strong>Key Risk Factors:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>High blood pressure and cholesterol</li>
                <li>Smoking and excessive alcohol</li>
                <li>Diabetes and obesity</li>
                <li>Family history and age</li>
                <li>Sedentary lifestyle</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}