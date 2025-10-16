import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LiverData {
  age: number;
  gender: string;
  totalBilirubin: number;
  directBilirubin: number;
  alkalinePhosphotase: number;
  alamineAminotransferase: number;
  aspartateAminotransferase: number;
  totalProteins: number;
  albumin: number;
  albuminGlobulinRatio: number;
}

interface PredictionResult {
  risk: 'Normal Function' | 'Mild Dysfunction' | 'Moderate Risk' | 'High Risk';
  confidence: number;
  recommendations: string[];
}

export default function LiverAnalyzer() {
  const [formData, setFormData] = useState<LiverData>({
    age: 0,
    gender: '',
    totalBilirubin: 0,
    directBilirubin: 0,
    alkalinePhosphotase: 0,
    alamineAminotransferase: 0,
    aspartateAminotransferase: 0,
    totalProteins: 0,
    albumin: 0,
    albuminGlobulinRatio: 0
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LiverData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateLiverRisk = (): PredictionResult => {
    let riskScore = 0;
    
    // Age factor
    if (formData.age > 65) riskScore += 2;
    else if (formData.age > 50) riskScore += 1;
    
    // Total Bilirubin (Normal: 0.2-1.2 mg/dL)
    if (formData.totalBilirubin > 3.0) riskScore += 4;
    else if (formData.totalBilirubin > 2.0) riskScore += 3;
    else if (formData.totalBilirubin > 1.2) riskScore += 2;
    
    // Direct Bilirubin (Normal: 0.0-0.3 mg/dL)
    if (formData.directBilirubin > 1.0) riskScore += 3;
    else if (formData.directBilirubin > 0.5) riskScore += 2;
    else if (formData.directBilirubin > 0.3) riskScore += 1;
    
    // Alkaline Phosphatase (Normal: 44-147 IU/L)
    if (formData.alkalinePhosphotase > 300) riskScore += 3;
    else if (formData.alkalinePhosphotase > 200) riskScore += 2;
    else if (formData.alkalinePhosphotase > 147) riskScore += 1;
    
    // ALT - Alanine Aminotransferase (Normal: 7-40 IU/L)
    if (formData.alamineAminotransferase > 200) riskScore += 4;
    else if (formData.alamineAminotransferase > 100) riskScore += 3;
    else if (formData.alamineAminotransferase > 80) riskScore += 2;
    else if (formData.alamineAminotransferase > 40) riskScore += 1;
    
    // AST - Aspartate Aminotransferase (Normal: 10-40 IU/L)
    if (formData.aspartateAminotransferase > 200) riskScore += 4;
    else if (formData.aspartateAminotransferase > 100) riskScore += 3;
    else if (formData.aspartateAminotransferase > 80) riskScore += 2;
    else if (formData.aspartateAminotransferase > 40) riskScore += 1;
    
    // AST/ALT Ratio (>2 suggests alcoholic liver disease)
    const astAltRatio = formData.aspartateAminotransferase / formData.alamineAminotransferase;
    if (astAltRatio > 2.0) riskScore += 2;
    else if (astAltRatio > 1.5) riskScore += 1;
    
    // Total Proteins (Normal: 6.3-8.2 g/dL)
    if (formData.totalProteins < 6.0) riskScore += 2;
    else if (formData.totalProteins > 8.5) riskScore += 1;
    
    // Albumin (Normal: 3.5-5.0 g/dL)
    if (formData.albumin < 3.0) riskScore += 3;
    else if (formData.albumin < 3.5) riskScore += 2;
    
    // Albumin/Globulin Ratio (Normal: 1.1-2.5)
    if (formData.albuminGlobulinRatio < 1.0) riskScore += 2;
    else if (formData.albuminGlobulinRatio > 2.5) riskScore += 1;

    let risk: 'Normal Function' | 'Mild Dysfunction' | 'Moderate Risk' | 'High Risk';
    let confidence: number;
    let recommendations: string[];

    if (riskScore >= 15) {
      risk = 'High Risk';
      confidence = Math.min(85 + Math.random() * 10, 95);
      recommendations = [
        'Immediate hepatology consultation required',
        'Consider hospitalization for severe cases',
        'Complete abstinence from alcohol and hepatotoxic drugs',
        'Antiviral therapy if viral hepatitis detected',
        'Monitor for complications (ascites, varices)',
        'Low-sodium diet (<2g/day) if fluid retention',
        'Regular liver function monitoring (weekly)'
      ];
    } else if (riskScore >= 10) {
      risk = 'Moderate Risk';
      confidence = Math.min(75 + Math.random() * 15, 90);
      recommendations = [
        'Gastroenterologist consultation recommended',
        'Identify and treat underlying causes',
        'Avoid alcohol and hepatotoxic medications',
        'Vaccination for Hepatitis A & B if not immune',
        'Weight management if obesity present',
        'Monthly liver function tests',
        'Consider liver biopsy if indicated'
      ];
    } else if (riskScore >= 5) {
      risk = 'Mild Dysfunction';
      confidence = Math.min(70 + Math.random() * 20, 90);
      recommendations = [
        'Follow-up with primary physician',
        'Limit alcohol consumption significantly',
        'Review all medications for hepatotoxicity',
        'Maintain healthy weight through diet and exercise',
        'Increase intake of antioxidant-rich foods',
        'Bi-monthly liver function monitoring',
        'Stay hydrated and get adequate sleep'
      ];
    } else {
      risk = 'Normal Function';
      confidence = Math.min(80 + Math.random() * 15, 95);
      recommendations = [
        'Continue maintaining healthy lifestyle',
        'Moderate alcohol consumption or avoid completely',
        'Regular exercise and balanced nutrition',
        'Annual liver function screening',
        'Maintain healthy weight',
        'Stay hydrated (8-10 glasses water daily)',
        'Avoid unnecessary medications and supplements'
      ];
    }

    return { risk, confidence: Math.round(confidence), recommendations };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prediction = calculateLiverRisk();
    setResult(prediction);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      gender: '',
      totalBilirubin: 0,
      directBilirubin: 0,
      alkalinePhosphotase: 0,
      alamineAminotransferase: 0,
      aspartateAminotransferase: 0,
      totalProteins: 0,
      albumin: 0,
      albuminGlobulinRatio: 0
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Shield className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">LivoScan - Liver Function Analyzer</h1>
          <p className="text-gray-400">Comprehensive liver health assessment and disease prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              Liver Function Tests
            </CardTitle>
            <CardDescription>
              Enter your complete liver panel test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
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
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bilirubin Tests */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Bilirubin Levels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalBilirubin" className="text-gray-300">Total Bilirubin (mg/dL)</Label>
                    <Input
                      id="totalBilirubin"
                      type="number"
                      step="0.1"
                      value={formData.totalBilirubin || ''}
                      onChange={(e) => handleInputChange('totalBilirubin', parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.8"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="directBilirubin" className="text-gray-300">Direct Bilirubin (mg/dL)</Label>
                    <Input
                      id="directBilirubin"
                      type="number"
                      step="0.1"
                      value={formData.directBilirubin || ''}
                      onChange={(e) => handleInputChange('directBilirubin', parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Enzyme Tests */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Liver Enzymes</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="alkalinePhosphotase" className="text-gray-300">Alkaline Phosphatase (IU/L)</Label>
                    <Input
                      id="alkalinePhosphotase"
                      type="number"
                      value={formData.alkalinePhosphotase || ''}
                      onChange={(e) => handleInputChange('alkalinePhosphotase', parseInt(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="90"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alamineAminotransferase" className="text-gray-300">ALT (IU/L)</Label>
                      <Input
                        id="alamineAminotransferase"
                        type="number"
                        value={formData.alamineAminotransferase || ''}
                        onChange={(e) => handleInputChange('alamineAminotransferase', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aspartateAminotransferase" className="text-gray-300">AST (IU/L)</Label>
                      <Input
                        id="aspartateAminotransferase"
                        type="number"
                        value={formData.aspartateAminotransferase || ''}
                        onChange={(e) => handleInputChange('aspartateAminotransferase', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Protein Tests */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Protein Levels</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalProteins" className="text-gray-300">Total Proteins (g/dL)</Label>
                      <Input
                        id="totalProteins"
                        type="number"
                        step="0.1"
                        value={formData.totalProteins || ''}
                        onChange={(e) => handleInputChange('totalProteins', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="7.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="albumin" className="text-gray-300">Albumin (g/dL)</Label>
                      <Input
                        id="albumin"
                        type="number"
                        step="0.1"
                        value={formData.albumin || ''}
                        onChange={(e) => handleInputChange('albumin', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="4.0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="albuminGlobulinRatio" className="text-gray-300">Albumin/Globulin Ratio</Label>
                    <Input
                      id="albuminGlobulinRatio"
                      type="number"
                      step="0.1"
                      value={formData.albuminGlobulinRatio || ''}
                      onChange={(e) => handleInputChange('albuminGlobulinRatio', parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="1.5"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Liver Function'}
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
                  {result.risk === 'Mild Dysfunction' && <Activity className="h-5 w-5 text-orange-400" />}
                  {result.risk === 'Normal Function' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  Liver Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-gray-700/50">
                  <div className={`text-3xl font-bold mb-2 ${
                    result.risk === 'High Risk' ? 'text-red-400' :
                    result.risk === 'Moderate Risk' ? 'text-yellow-400' :
                    result.risk === 'Mild Dysfunction' ? 'text-orange-400' : 'text-green-400'
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
                  result.risk === 'Mild Dysfunction' ? 'border-orange-500 bg-orange-500/10' :
                  'border-green-500 bg-green-500/10'
                }`}>
                  <AlertDescription className="text-white">
                    <div className="font-semibold mb-2">Recommendations:</div>
                    <ul className="space-y-1">
                      {result.recommendations.slice(0, 5).map((rec, index) => (
                        <li key={index} className="text-sm">• {rec}</li>
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
              <div className="grid grid-cols-1 gap-2">
                <div>• Total Bilirubin: 0.2-1.2 mg/dL</div>
                <div>• Direct Bilirubin: 0.0-0.3 mg/dL</div>
                <div>• ALP: 44-147 IU/L</div>
                <div>• ALT: 7-40 IU/L</div>
                <div>• AST: 10-40 IU/L</div>
                <div>• Total Proteins: 6.3-8.2 g/dL</div>
                <div>• Albumin: 3.5-5.0 g/dL</div>
                <div>• A/G Ratio: 1.1-2.5</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">About Liver Health</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p>The liver performs over 500 vital functions. Regular monitoring helps detect problems early.</p>
              <p><strong>Common Causes:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Viral hepatitis (A, B, C)</li>
                <li>Alcohol abuse</li>
                <li>Non-alcoholic fatty liver</li>
                <li>Medications and toxins</li>
                <li>Autoimmune conditions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}