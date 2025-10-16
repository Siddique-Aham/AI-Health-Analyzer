import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PredictionResult {
  risk: 'low' | 'medium' | 'high'
  confidence: number
  recommendations: string[]
  keyFactors: string[]
}

export function HealthAnalyzer() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigree: '',
    age: ''
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const simulateDiabetesPrediction = (data: typeof formData): PredictionResult => {
    // Simple rule-based simulation for demo
    const glucose = parseFloat(data.glucose) || 0
    const bmi = parseFloat(data.bmi) || 0
    const age = parseFloat(data.age) || 0
    const bp = parseFloat(data.bloodPressure) || 0

    let riskScore = 0
    const factors: string[] = []

    // Glucose assessment
    if (glucose > 140) {
      riskScore += 3
      factors.push('Elevated glucose levels')
    } else if (glucose > 100) {
      riskScore += 1
      factors.push('Borderline glucose levels')
    }

    // BMI assessment
    if (bmi > 30) {
      riskScore += 2
      factors.push('Obesity (BMI > 30)')
    } else if (bmi > 25) {
      riskScore += 1
      factors.push('Overweight (BMI > 25)')
    }

    // Age factor
    if (age > 45) {
      riskScore += 1
      factors.push('Age over 45')
    }

    // Blood pressure
    if (bp > 140) {
      riskScore += 1
      factors.push('High blood pressure')
    }

    let risk: 'low' | 'medium' | 'high'
    let confidence: number

    if (riskScore >= 4) {
      risk = 'high'
      confidence = 85 + Math.random() * 10
    } else if (riskScore >= 2) {
      risk = 'medium'
      confidence = 75 + Math.random() * 15
    } else {
      risk = 'low'
      confidence = 80 + Math.random() * 15
    }

    const recommendations = [
      risk === 'high' 
        ? 'Consult an endocrinologist immediately for comprehensive evaluation'
        : risk === 'medium'
        ? 'Schedule regular check-ups with your healthcare provider'
        : 'Maintain current healthy lifestyle habits',
      'Follow a balanced diet with controlled carbohydrate intake',
      'Engage in regular physical exercise (150 minutes per week)',
      'Monitor blood sugar levels regularly',
      'Maintain a healthy weight through diet and exercise'
    ]

    return {
      risk,
      confidence: Math.round(confidence),
      recommendations: recommendations.slice(0, risk === 'high' ? 5 : 4),
      keyFactors: factors.length ? factors : ['Normal range values detected']
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const prediction = simulateDiabetesPrediction(formData)
    setResult(prediction)
    setIsAnalyzing(false)
  }

  const resetForm = () => {
    setFormData({
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      skinThickness: '',
      insulin: '',
      bmi: '',
      diabetesPedigree: '',
      age: ''
    })
    setResult(null)
  }

  const isFormValid = formData.glucose && formData.bmi && formData.age && formData.bloodPressure

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Diabetes Predictor</h1>
          <p className="text-muted-foreground">GlucoSense AI Analysis System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Enter health metrics for diabetes risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="glucose">Blood Glucose (mg/dL) *</Label>
                <Input
                  id="glucose"
                  type="number"
                  placeholder="100"
                  value={formData.glucose}
                  onChange={(e) => handleInputChange('glucose', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI (kg/m²) *</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  placeholder="25.0"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="35"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure (mmHg) *</Label>
                <Input
                  id="bloodPressure"
                  type="number"
                  placeholder="120"
                  value={formData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pregnancies">Pregnancies</Label>
                <Input
                  id="pregnancies"
                  type="number"
                  placeholder="0"
                  value={formData.pregnancies}
                  onChange={(e) => handleInputChange('pregnancies', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insulin">Insulin (μU/mL)</Label>
                <Input
                  id="insulin"
                  type="number"
                  placeholder="80"
                  value={formData.insulin}
                  onChange={(e) => handleInputChange('insulin', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
                <Input
                  id="skinThickness"
                  type="number"
                  placeholder="20"
                  value={formData.skinThickness}
                  onChange={(e) => handleInputChange('skinThickness', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diabetesPedigree">Diabetes Pedigree</Label>
                <Input
                  id="diabetesPedigree"
                  type="number"
                  step="0.001"
                  placeholder="0.627"
                  value={formData.diabetesPedigree}
                  onChange={(e) => handleInputChange('diabetesPedigree', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button 
                onClick={handleAnalyze}
                disabled={!isFormValid || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              * Required fields for accurate analysis
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered diabetes risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Fill out the form and click "Run Analysis" to get your diabetes risk assessment
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Risk Level */}
                <div className="text-center">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold",
                    result.risk === 'low' && "risk-low",
                    result.risk === 'medium' && "risk-medium", 
                    result.risk === 'high' && "risk-high"
                  )}>
                    {result.risk === 'low' && <CheckCircle className="w-5 h-5" />}
                    {result.risk === 'medium' && <AlertTriangle className="w-5 h-5" />}
                    {result.risk === 'high' && <AlertTriangle className="w-5 h-5" />}
                    {result.risk === 'low' && 'Low Risk'}
                    {result.risk === 'medium' && 'Medium Risk'}
                    {result.risk === 'high' && 'High Risk'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Confidence: {result.confidence}%
                  </p>
                </div>

                <Separator />

                {/* Key Factors */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Key Risk Factors
                  </h4>
                  <div className="space-y-2">
                    {result.keyFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Important:</strong> This is an AI prediction for educational purposes only. 
                    Always consult qualified healthcare professionals for proper medical diagnosis and treatment.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}