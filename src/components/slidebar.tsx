import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/store/auth-store'
import { useThemeStore } from '@/store/theme-store'
import { 
  Heart, 
  Droplets, 
  CircleDot, 
  Zap, 
  Wind, 
  Shield, 
  Microscope,
  Activity,
  Home,
  Menu,
  X,
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const healthAnalyzers = [
  { id: 'home', name: 'Home', icon: Home, description: 'AI Chat & Overview' },
  { id: 'diabetes', name: 'Diabetes Predictor', icon: Droplets, description: 'GlucoSense Analysis' },
  { id: 'heart', name: 'Heart Risk Analyzer', icon: Heart, description: 'CardioGuard Assessment' },
  { id: 'kidney', name: 'Kidney Health Monitor', icon: CircleDot, description: 'NephroTrack System' },
  { id: 'liver', name: 'Liver Function Checker', icon: Shield, description: 'LivoScan Analysis' },
  { id: 'lung', name: 'Lung Health Detector', icon: Wind, description: 'PneumoAI System' },
  { id: 'cancer', name: 'Cancer Risk Assessment', icon: Microscope, description: 'OncoGuard Analysis' },
  { id: 'anemia', name: 'Anemia Detection', icon: Activity, description: 'IronIQ Blood Analysis' },
]

interface SidebarProps {
  currentAnalyzer: string
  onAnalyzerChange: (id: string) => void
}

export function Sidebar({ currentAnalyzer, onAnalyzerChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  // Initialize theme on component mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sidebar-foreground">Health Analyzer</h2>
            <p className="text-xs text-sidebar-foreground/70">AI-Powered Diagnostics</p>
          </div>
        </div>
        
        {/* User info */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <User className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-sidebar-accent-foreground/70 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            {healthAnalyzers.map((analyzer) => {
              const Icon = analyzer.icon
              const isActive = currentAnalyzer === analyzer.id
              
              return (
                <Button
                  key={analyzer.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-auto p-3",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => {
                    onAnalyzerChange(analyzer.id)
                    setIsOpen(false)
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{analyzer.name}</div>
                    <div className="text-xs text-muted-foreground">{analyzer.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme}
          className="w-full justify-start gap-2"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        
        {/* Logout */}
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background border border-border"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-80 bg-sidebar-background border-r border-sidebar-border">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-80 bg-sidebar-background border-r border-sidebar-border">
            <SidebarContent />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}