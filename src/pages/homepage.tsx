import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/Sidebar'
import { ChatInterface } from '@/components/ChatInterface'
import { HealthAnalyzer } from '@/components/HealthAnalyzer'
import HeartAnalyzer from '@/components/HeartAnalyzer'
import KidneyAnalyzer from '@/components/KidneyAnalyzer'
import LiverAnalyzer from '@/components/LiverAnalyzer'
import LungAnalyzer from '@/components/LungAnalyzer'
import CancerAnalyzer from '@/components/CancerAnalyzer'
import AnemiaAnalyzer from '@/components/AnemiaAnalyzer'
import { AuthDialog } from '@/components/AuthDialog'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Activity,
  Brain,
  Stethoscope,
  LogIn
} from 'lucide-react'

function HomePage() {
  const [currentAnalyzer, setCurrentAnalyzer] = useState('home')
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const { isAuthenticated, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const renderAnalyzerContent = () => {
    switch (currentAnalyzer) {
      case 'diabetes':
        return <HealthAnalyzer />
      case 'heart':
        return <HeartAnalyzer />
      case 'kidney':
        return <KidneyAnalyzer />
      case 'liver':
        return <LiverAnalyzer />
      case 'lung':
        return <LungAnalyzer />
      case 'cancer':
        return <CancerAnalyzer />
      case 'anemia':
        return <AnemiaAnalyzer />
      default:
        return <HomeContent onOpenAuth={() => setAuthDialogOpen(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          currentAnalyzer={currentAnalyzer}
          onAnalyzerChange={setCurrentAnalyzer}
        />
        
        <main className="flex-1 md:ml-0">
          <div className="p-4 md:p-6 pb-20 md:pb-6">
            {renderAnalyzerContent()}
          </div>
        </main>
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </div>
  )
}

function HomeContent({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { isAuthenticated } = useAuthStore()

  const features = [
    {
      icon: Heart,
      title: 'Multi-Disease Analysis',
      description: 'Advanced AI models for diabetes, heart disease, kidney health, liver function, lung health, cancer risk, and anemia detection',
      badge: '8 Analyzers'
    },
    {
      icon: MessageCircle,
      title: 'AI Health Chat',
      description: 'Instant answers to health questions in English, Hindi, and Hinglish with streaming responses',
      badge: 'Multilingual'
    },
    {
      icon: Activity,
      title: 'Blood Analysis',
      description: 'Comprehensive anemia detection with CBC analysis, iron studies, and clinical symptoms evaluation',
      badge: 'IronIQ'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data stays secure with advanced authentication and encrypted storage',
      badge: 'Secure'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="health-gradient rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="neural-pattern absolute inset-0 opacity-30"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center ai-glow ai-pulse">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">AI Health Analyzer</h1>
              <p className="text-sm text-muted-foreground">Next-Generation Medical Intelligence</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            🧠 <strong>Advanced AI-powered health analysis</strong> with multi-disease prediction and intelligent chat support.<br/>
            🩺 Get instant insights into your health with our comprehensive diagnostic tools powered by machine learning.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={onOpenAuth} className="gap-2">
                <LogIn className="w-4 h-4" />
                Get Started - Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                Free analysis • Secure • Multi-language support
              </p>
            </div>
          ) : (
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Ready for Analysis
            </Badge>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="medical-card group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
              <div className="matrix-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:ai-glow">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="group-hover:border-primary/50 transition-colors duration-300">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Chat Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Health Assistant</h2>
        </div>
        <ChatInterface />
      </div>

      {/* Health Tips */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Daily Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Nutrition</h4>
              <p className="text-sm text-muted-foreground">
                Eat a balanced diet with plenty of fruits, vegetables, and whole grains to maintain optimal health.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Exercise</h4>
              <p className="text-sm text-muted-foreground">
                Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Prevention</h4>
              <p className="text-sm text-muted-foreground">
                Regular health screenings and check-ups can help detect issues early when they're most treatable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage