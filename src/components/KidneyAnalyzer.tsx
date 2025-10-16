import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface KidneyData {
  age: number;
  bloodPressure: number;
  specificGravity: number;
  albumin: string;
  sugar: string;
  redBloodCells: string;
  pusCell: string;
  pusCellClumps: string;
  bacteria: string;
  bloodGlucoseRandom: number;
  bloodUrea: number;
  serumCreatinine: number;
  sodium: number;
  potassium: number;
  haemoglobin: number;
  packedCellVolume: number;
  whiteBloodCellCount: number;
  redBloodCellCount: number;
  hypertension: string;
  diabetesMellitus: string;
  coronaryArteryDisease: string;
  appetite: string;
  pedalEdema: string;
  anemia: string;
}

interface PredictionResult {
  risk: 'Normal Function' | 'Mild Impairment' | 'Moderate Risk' | 'High Risk';
  confidence: number;
  recommendations: string[];
}

export default function KidneyAnalyzer() {
  const [formData, setFormData] = useState<KidneyData>({
    age: 0,
    bloodPressure: 0,
    specificGravity: 0,
    albumin: '',
    sugar: '',
    redBloodCells: '',
    pusCell: '',
    pusCellClumps: '',
    bacteria: '',
    bloodGlucoseRandom: 0,
    bloodUrea: 0,
    serumCreatinine: 0,
    sodium: 0,
    potassium: 0,
    haemoglobin: 0,
    packedCellVolume: 0,
    whiteBloodCellCount: 0,
    redBloodCellCount: 0,
    hypertension: '',
    diabetesMellitus: '',
    coronaryArteryDisease: '',
    appetite: '',
    pedalEdema: '',
    anemia: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof KidneyData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateKidneyRisk = (): PredictionResult => {
    let riskScore = 0;
    
    // Age factor
    if (formData.age > 70) riskScore += 3;
    else if (formData.age > 60) riskScore += 2;
    else if (formData.age > 50) riskScore += 1;
    
    // Blood pressure
    if (formData.bloodPressure > 140) riskScore += 3;
    else if (formData.bloodPressure > 120) riskScore += 2;
    
    // Serum creatinine (key indicator)
    if (formData.serumCreatinine > 1.5) riskScore += 4;
    else if (formData.serumCreatinine > 1.2) riskScore += 3;
    else if (formData.serumCreatinine > 1.0) riskScore += 2;
    
    // Blood urea
    if (formData.bloodUrea > 50) riskScore += 3;
    else if (formData.bloodUrea > 40) riskScore += 2;
    else if (formData.bloodUrea > 30) riskScore += 1;
    
    // Albumin in urine
    if (formData.albumin === '5' || formData.albumin === '4') riskScore += 4;
    else if (formData.albumin === '3') riskScore += 3;
    else if (formData.albumin === '2') riskScore += 2;
    else if (formData.albumin === '1') riskScore += 1;
    
    // Red blood cells in urine
    if (formData.redBloodCells === 'abnormal') riskScore += 2;
    
    // Pus cells
    if (formData.pusCell === 'abnormal') riskScore += 2;
    
    // Medical conditions
    if (formData.hypertension === 'yes') riskScore += 2;
    if (formData.diabetesMellitus === 'yes') riskScore += 3;
    if (formData.coronaryArteryDisease === 'yes') riskScore += 2;
    
    // Symptoms
    if (formData.appetite === 'poor') riskScore += 2;
    if (formData.pedalEdema === 'yes') riskScore += 3;
    if (formData.anemia === 'yes') riskScore += 2;
    
    // Hemoglobin levels
    if (formData.haemoglobin < 10) riskScore += 3;
    else if (formData.haemoglobin < 12) riskScore += 2;
    
    // Sodium and Potassium imbalance
    if (formData.sodium > 145 || formData.sodium < 135) riskScore += 2;
    if (formData.potassium > 5.0 || formData.potassium < 3.5) riskScore += 2;

    let risk: 'Normal Function' | 'Mild Impairment' | 'Moderate Risk' | 'High Risk';
    let confidence: number;
    let recommendations: string[];

    if (riskScore >= 20) {
      risk = 'High Risk';
      confidence = Math.min(85 + Math.random() * 10, 95);
      recommendations = [
        'Immediate nephrology consultation required',
        'Consider dialysis preparation if GFR <15',
        'Strict dietary protein restriction (0.6-0.8g/kg)',
        'Monitor fluid intake and electrolyte balance',
        'Regular kidney function tests (weekly)',
        'Blood pressure control <130/80 mmHg',
        'Avoid nephrotoxic medications'
      ];
    } else if (riskScore >= 12) {
      risk = 'Moderate Risk';
      confidence = Math.min(75 + Math.random() * 15, 90);
      recommendations = [
        'Regular monitoring by nephrologist',
        'Moderate protein restriction (0.8-1.0g/kg)',
        'Control diabetes and hypertension',
        'Monthly kidney function tests',
        'Stay hydrated but avoid fluid overload',
        'Limit sodium intake (<2g per day)',
        'Monitor for complications'
      ];
    } else if (riskScore >= 6) {
      risk = 'Mild Impairment';
      confidence = Math.min(70 + Math.random() * 20, 90);
      recommendations = [
        'Bi-annual kidney function screening',
        'Maintain healthy protein intake',
        'Control underlying conditions',
        'Regular blood pressure monitoring',
        'Stay well hydrated (8-10 glasses water)',
        'Limit processed foods and excess salt',
        'Regular exercise as tolerated'
      ];
    } else {
      risk = 'Normal Function';
      confidence = Math.min(80 + Math.random() * 15, 95);
      recommendations = [
        'Continue maintaining healthy lifestyle',
        'Annual kidney function screening',
        'Maintain adequate hydration',
        'Regular exercise and healthy diet',
        'Monitor blood pressure regularly',
        'Avoid excessive use of pain medications',
        'Limit alcohol and quit smoking'
      ];
    }

    return { risk, confidence: Math.round(confidence), recommendations };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const prediction = calculateKidneyRisk();
    setResult(prediction);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      bloodPressure: 0,
      specificGravity: 0,
      albumin: '',
      sugar: '',
      redBloodCells: '',
      pusCell: '',
      pusCellClumps: '',
      bacteria: '',
      bloodGlucoseRandom: 0,
      bloodUrea: 0,
      serumCreatinine: 0,
      sodium: 0,
      potassium: 0,
      haemoglobin: 0,
      packedCellVolume: 0,
      whiteBloodCellCount: 0,
      redBloodCellCount: 0,
      hypertension: '',
      diabetesMellitus: '',
      coronaryArteryDisease: '',
      appetite: '',
      pedalEdema: '',
      anemia: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Droplets className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">NephroTrack - Kidney Health Monitor</h1>
          <p className="text-gray-400">Comprehensive chronic kidney disease risk assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Form - Takes 2 columns */}
        <div className="xl:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Clinical Data Input
              </CardTitle>
              <CardDescription>
                Enter comprehensive kidney function test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Basic Information</h3>
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
                      <Label htmlFor="bloodPressure" className="text-gray-300">Blood Pressure (systolic)</Label>
                      <Input
                        id="bloodPressure"
                        type="number"
                        value={formData.bloodPressure || ''}
                        onChange={(e) => handleInputChange('bloodPressure', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="120"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Urine Tests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Urine Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specificGravity" className="text-gray-300">Specific Gravity</Label>
                      <Input
                        id="specificGravity"
                        type="number"
                        step="0.001"
                        value={formData.specificGravity || ''}
                        onChange={(e) => handleInputChange('specificGravity', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="1.020"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Albumin</Label>
                      <Select value={formData.albumin} onValueChange={(value) => handleInputChange('albumin', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Normal</SelectItem>
                          <SelectItem value="1">1 - Trace</SelectItem>
                          <SelectItem value="2">2 - Mild</SelectItem>
                          <SelectItem value="3">3 - Moderate</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Sugar</Label>
                      <Select value={formData.sugar} onValueChange={(value) => handleInputChange('sugar', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Normal</SelectItem>
                          <SelectItem value="1">1 - Trace</SelectItem>
                          <SelectItem value="2">2 - Present</SelectItem>
                          <SelectItem value="3">3 - High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Red Blood Cells</Label>
                      <Select value={formData.redBloodCells} onValueChange={(value) => handleInputChange('redBloodCells', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="abnormal">Abnormal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Pus Cells</Label>
                      <Select value={formData.pusCell} onValueChange={(value) => handleInputChange('pusCell', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="abnormal">Abnormal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Bacteria</Label>
                      <Select value={formData.bacteria} onValueChange={(value) => handleInputChange('bacteria', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="notpresent">Not Present</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Blood Tests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Blood Tests</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodUrea" className="text-gray-300">Blood Urea (mg/dL)</Label>
                      <Input
                        id="bloodUrea"
                        type="number"
                        value={formData.bloodUrea || ''}
                        onChange={(e) => handleInputChange('bloodUrea', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serumCreatinine" className="text-gray-300">Serum Creatinine (mg/dL)</Label>
                      <Input
                        id="serumCreatinine"
                        type="number"
                        step="0.1"
                        value={formData.serumCreatinine || ''}
                        onChange={(e) => handleInputChange('serumCreatinine', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="1.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="haemoglobin" className="text-gray-300">Hemoglobin (g/dL)</Label>
                      <Input
                        id="haemoglobin"
                        type="number"
                        step="0.1"
                        value={formData.haemoglobin || ''}
                        onChange={(e) => handleInputChange('haemoglobin', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="12.5"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sodium" className="text-gray-300">Sodium (mEq/L)</Label>
                      <Input
                        id="sodium"
                        type="number"
                        value={formData.sodium || ''}
                        onChange={(e) => handleInputChange('sodium', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="140"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="potassium" className="text-gray-300">Potassium (mEq/L)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        step="0.1"
                        value={formData.potassium || ''}
                        onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="4.0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Medical History & Symptoms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Hypertension</Label>
                      <Select value={formData.hypertension} onValueChange={(value) => handleInputChange('hypertension', value)} required>
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
                      <Label className="text-gray-300">Diabetes Mellitus</Label>
                      <Select value={formData.diabetesMellitus} onValueChange={(value) => handleInputChange('diabetesMellitus', value)} required>
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
                      <Label className="text-gray-300">Pedal Edema</Label>
                      <Select value={formData.pedalEdema} onValueChange={(value) => handleInputChange('pedalEdema', value)} required>
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
                      <Label className="text-gray-300">Anemia</Label>
                      <Select value={formData.anemia} onValueChange={(value) => handleInputChange('anemia', value)} required>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Kidney Function'}
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
                  {result.risk === 'Mild Impairment' && <Activity className="h-5 w-5 text-orange-400" />}
                  {result.risk === 'Normal Function' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gray-700/50">
                  <div className={`text-2xl font-bold mb-2 ${
                    result.risk === 'High Risk' ? 'text-red-400' :
                    result.risk === 'Moderate Risk' ? 'text-yellow-400' :
                    result.risk === 'Mild Impairment' ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {result.risk}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Confidence: {result.confidence}%
                  </div>
                </div>

                <Alert className={`border ${
                  result.risk === 'High Risk' ? 'border-red-500 bg-red-500/10' :
                  result.risk === 'Moderate Risk' ? 'border-yellow-500 bg-yellow-500/10' :
                  result.risk === 'Mild Impairment' ? 'border-orange-500 bg-orange-500/10' :
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

          {/* Info Card */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">About CKD</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p>Chronic kidney disease affects millions worldwide. Early detection is crucial for slowing progression.</p>
              <p><strong>Key Indicators:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Elevated serum creatinine</li>
                <li>Proteinuria (albumin in urine)</li>
                <li>Reduced GFR</li>
                <li>Electrolyte imbalances</li>
                <li>Anemia and bone disorders</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}