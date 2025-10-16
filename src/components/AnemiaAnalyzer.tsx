import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Droplets, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnemiaFormData {
  age: string;
  gender: string;
  hemoglobin: string;
  hematocrit: string;
  mcv: string; // Mean Corpuscular Volume
  mch: string; // Mean Corpuscular Hemoglobin
  mchc: string; // Mean Corpuscular Hemoglobin Concentration
  rdw: string; // Red Cell Distribution Width
  wbc: string; // White Blood Cell count
  platelets: string;
  ferritin: string;
  vitaminB12: string;
  folate: string;
  fatigue: string;
  breathlessness: string;
  coldHands: string;
  paleSkin: string;
}

interface AnemiaResult {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  anemiaType: string;
  confidence: number;
  recommendations: string[];
  labValues: { name: string; value: string; status: string }[];
}

const AnemiaAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState<AnemiaFormData>({
    age: '',
    gender: '',
    hemoglobin: '',
    hematocrit: '',
    mcv: '',
    mch: '',
    mchc: '',
    rdw: '',
    wbc: '',
    platelets: '',
    ferritin: '',
    vitaminB12: '',
    folate: '',
    fatigue: '',
    breathlessness: '',
    coldHands: '',
    paleSkin: ''
  });

  const [result, setResult] = useState<AnemiaResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateAnemiaRisk = (): AnemiaResult => {
    const age = parseInt(formData.age) || 0;
    const gender = formData.gender;
    const hb = parseFloat(formData.hemoglobin) || 0;
    const hct = parseFloat(formData.hematocrit) || 0;
    const mcv = parseFloat(formData.mcv) || 0;
    const mch = parseFloat(formData.mch) || 0;
    const mchc = parseFloat(formData.mchc) || 0;
    const rdw = parseFloat(formData.rdw) || 0;
    const ferritin = parseFloat(formData.ferritin) || 0;
    const vitB12 = parseFloat(formData.vitaminB12) || 0;
    const folate = parseFloat(formData.folate) || 0;

    // Hemoglobin reference ranges
    const normalHbMale = hb >= 13.8 && hb <= 17.2;
    const normalHbFemale = hb >= 12.1 && hb <= 15.1;
    const isHbNormal = gender === 'male' ? normalHbMale : normalHbFemale;

    // Calculate anemia severity
    let severity = 0;
    let anemiaType = 'Normal';
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';

    // Hemoglobin analysis
    if (!isHbNormal) {
      if (gender === 'male') {
        if (hb < 11) severity += 3;
        else if (hb < 13) severity += 2;
        else severity += 1;
      } else {
        if (hb < 10) severity += 3;
        else if (hb < 12) severity += 2;
        else severity += 1;
      }
    }

    // MCV analysis for anemia type
    if (mcv < 80) {
      anemiaType = 'Microcytic Anemia (Iron Deficiency)';
      severity += 1;
    } else if (mcv > 100) {
      anemiaType = 'Macrocytic Anemia (B12/Folate Deficiency)';
      severity += 1;
    } else if (mcv >= 80 && mcv <= 100) {
      anemiaType = 'Normocytic Anemia';
    }

    // Additional lab value analysis
    if (ferritin < 15) severity += 2; // Iron deficiency
    if (vitB12 < 200) severity += 2; // B12 deficiency
    if (folate < 2) severity += 1; // Folate deficiency
    if (rdw > 14.5) severity += 1; // Increased RDW

    // Symptom analysis
    const symptomScore = [
      formData.fatigue === 'severe' ? 2 : formData.fatigue === 'moderate' ? 1 : 0,
      formData.breathlessness === 'yes' ? 1 : 0,
      formData.coldHands === 'yes' ? 1 : 0,
      formData.paleSkin === 'yes' ? 1 : 0
    ].reduce((sum, score) => sum + score, 0);

    severity += symptomScore;

    // Determine risk level
    if (severity >= 8) riskLevel = 'Severe';
    else if (severity >= 5) riskLevel = 'High';
    else if (severity >= 3) riskLevel = 'Moderate';
    else riskLevel = 'Low';

    const confidence = Math.min(95, 60 + severity * 5);

    // Lab values analysis
    const labValues = [
      {
        name: 'Hemoglobin',
        value: `${hb} g/dL`,
        status: isHbNormal ? 'Normal' : 'Low'
      },
      {
        name: 'Hematocrit',
        value: `${hct}%`,
        status: hct >= (gender === 'male' ? 41 : 36) ? 'Normal' : 'Low'
      },
      {
        name: 'MCV',
        value: `${mcv} fL`,
        status: mcv >= 80 && mcv <= 100 ? 'Normal' : mcv < 80 ? 'Low' : 'High'
      },
      {
        name: 'Ferritin',
        value: `${ferritin} ng/mL`,
        status: ferritin >= 15 ? 'Normal' : 'Low'
      }
    ];

    // Recommendations based on type and severity
    const recommendations = [];
    
    if (anemiaType.includes('Iron Deficiency')) {
      recommendations.push('Increase iron-rich foods (red meat, spinach, lentils)');
      recommendations.push('Take iron supplements as prescribed by doctor');
      recommendations.push('Combine iron intake with vitamin C for better absorption');
    }
    
    if (anemiaType.includes('B12/Folate')) {
      recommendations.push('Include B12 sources: meat, fish, dairy products');
      recommendations.push('Add folate-rich foods: leafy greens, citrus fruits');
      recommendations.push('Consider B12 injections if severely deficient');
    }

    if (severity >= 3) {
      recommendations.push('Consult hematologist for detailed evaluation');
      recommendations.push('Get complete blood workup including reticulocyte count');
    }

    recommendations.push('Regular monitoring of blood parameters');
    recommendations.push('Maintain balanced diet with adequate protein');
    recommendations.push('Avoid excessive tea/coffee with iron-rich meals');

    return {
      riskLevel,
      anemiaType: severity < 2 ? 'No Significant Anemia' : anemiaType,
      confidence,
      recommendations: recommendations.slice(0, 6),
      labValues
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const analysisResult = calculateAnemiaRisk();
      setResult(analysisResult);
      setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      hemoglobin: '',
      hematocrit: '',
      mcv: '',
      mch: '',
      mchc: '',
      rdw: '',
      wbc: '',
      platelets: '',
      ferritin: '',
      vitaminB12: '',
      folate: '',
      fatigue: '',
      breathlessness: '',
      coldHands: '',
      paleSkin: ''
    });
    setResult(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Severe': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Droplets className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">IronIQ - Anemia Detection</h1>
            <p className="text-gray-400">Comprehensive blood analysis and anemia risk assessment</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              Blood Parameters & Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-gray-700" />
              <h3 className="text-lg font-semibold text-white">Complete Blood Count (CBC)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Hemoglobin (g/dL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.hemoglobin}
                    onChange={(e) => handleInputChange('hemoglobin', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="12.5"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Hematocrit (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.hematocrit}
                    onChange={(e) => handleInputChange('hematocrit', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="37.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">MCV (fL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.mcv}
                    onChange={(e) => handleInputChange('mcv', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="85"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">MCH (pg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.mch}
                    onChange={(e) => handleInputChange('mch', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="29"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">MCHC (g/dL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.mchc}
                    onChange={(e) => handleInputChange('mchc', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="34"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">RDW (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.rdw}
                    onChange={(e) => handleInputChange('rdw', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="13.5"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Platelets (×10³/μL)</Label>
                  <Input
                    type="number"
                    value={formData.platelets}
                    onChange={(e) => handleInputChange('platelets', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="250"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />
              <h3 className="text-lg font-semibold text-white">Iron Studies & Vitamins</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Ferritin (ng/mL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.ferritin}
                    onChange={(e) => handleInputChange('ferritin', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Vitamin B12 (pg/mL)</Label>
                  <Input
                    type="number"
                    value={formData.vitaminB12}
                    onChange={(e) => handleInputChange('vitaminB12', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Folate (ng/mL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.folate}
                    onChange={(e) => handleInputChange('folate', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="5"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />
              <h3 className="text-lg font-semibold text-white">Clinical Symptoms</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Fatigue Level</Label>
                  <Select value={formData.fatigue} onValueChange={(value) => handleInputChange('fatigue', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Breathlessness</Label>
                  <Select value={formData.breathlessness} onValueChange={(value) => handleInputChange('breathlessness', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Cold Hands/Feet</Label>
                  <Select value={formData.coldHands} onValueChange={(value) => handleInputChange('coldHands', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Pale Skin/Nails</Label>
                  <Select value={formData.paleSkin} onValueChange={(value) => handleInputChange('paleSkin', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Analyzing Blood...' : 'Analyze Anemia Risk'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                Anemia Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <Badge className={`px-4 py-2 text-lg font-semibold ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel} Risk
                </Badge>
                <div>
                  <p className="text-2xl font-bold text-white">{result.anemiaType}</p>
                  <p className="text-gray-400">Confidence: {result.confidence}%</p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Lab Values Analysis</h3>
                <div className="space-y-2">
                  {result.labValues.map((lab, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">{lab.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{lab.value}</span>
                        <Badge 
                          variant={lab.status === 'Normal' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {lab.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  {result.riskLevel === 'Low' ? 
                    <CheckCircle className="w-5 h-5 text-emerald-400" /> : 
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  }
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <Alert key={index} className="bg-gray-800/50 border-gray-700">
                      <AlertDescription className="text-gray-300">
                        {rec}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>

              {result.riskLevel !== 'Low' && (
                <Alert className="bg-red-900/20 border-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    <strong>Important:</strong> This analysis is for educational purposes only. Please consult a healthcare provider for proper diagnosis and treatment of anemia.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnemiaAnalyzer;