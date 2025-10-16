# This file is only for editing file nodes, do not break the structure
## Project Description
AI Health Analyzer - A comprehensive medical analysis platform with multi-disease prediction capabilities, anemia detection system, and intelligent AI chat support. Features complete light/dark theme support and AI-themed interface with neural patterns and interactive elements.

## Key Features
- Complete authentication system with email OTP verification
- Light/Dark mode toggle with theme persistence
- Multi-disease health analyzers:
  * Diabetes Risk Predictor (GlucoSense) - Blood sugar and metabolic analysis
  * Heart Disease Analyzer (CardioGuard) - Cardiovascular risk assessment
  * Kidney Health Monitor (NephroTrack) - Chronic kidney disease screening
  * Liver Function Checker (LivoScan) - Liver enzyme and function analysis
  * Lung Health Detector (PneumoAI) - Respiratory health and COPD screening
  * Cancer Risk Assessment (OncoGuard) - Comprehensive cancer risk evaluation
  * Anemia Detection System (IronIQ) - Complete blood analysis with CBC, iron studies, and clinical symptoms
- Multi-language AI health chat with streaming responses
- AI-themed professional interface with neural patterns, glow effects, and interactive animations
- Responsive design optimized for all devices with enhanced mobile experience
- Comprehensive sidebar navigation with theme controls

## Data Storage
Tables: None created yet (authentication handled by SDK)
Local: Zustand stores with persistence for auth state, chat messages, and theme preferences

## Devv SDK Integration
Built-in: DevvAI for chat functionality, Auth system for user management
External: None currently

## Special Requirements
Medical-grade design with AI-themed enhancements including neural network patterns, data flow animations, AI glow effects, and professional light/dark mode support. All analyzers use evidence-based risk scoring algorithms with comprehensive recommendations.

/src
├── components/          # Components directory
│   ├── ui/             # Pre-installed shadcn/ui components
│   ├── AuthDialog.tsx  # Email OTP authentication dialog
│   ├── ChatInterface.tsx # AI health chat with streaming responses
│   ├── HealthAnalyzer.tsx # Diabetes predictor with risk assessment
│   ├── HeartAnalyzer.tsx # Heart disease risk analyzer with comprehensive scoring
│   ├── KidneyAnalyzer.tsx # Kidney function monitor with CKD screening
│   ├── LiverAnalyzer.tsx # Liver function analyzer with enzyme interpretation
│   ├── LungAnalyzer.tsx # Lung health detector with COPD and cancer screening
│   ├── CancerAnalyzer.tsx # Comprehensive cancer risk assessment tool
│   ├── AnemiaAnalyzer.tsx # Complete anemia detection system with blood analysis
│   └── Sidebar.tsx     # Navigation sidebar with theme toggle and all health analyzer menu
│
├── store/              # State management directory (Zustand)
│   ├── auth-store.ts   # Authentication state with persistence
│   ├── chat-store.ts   # Chat messages and AI streaming state
│   └── theme-store.ts  # Theme management with light/dark mode toggle and persistence
│
├── pages/              # Page components directory
│   ├── HomePage.tsx    # Main application with layout, analyzer routing, and AI-themed welcome
│   └── NotFoundPage.tsx # 404 error page
│
├── hooks/              # Custom Hooks directory
│   ├── use-mobile.ts   # Mobile detection Hook
│   └── use-toast.ts    # Toast notification system Hook
│
├── lib/                # Utility library directory
│   └── utils.ts        # Utility functions, including cn function for merging Tailwind classes
│
├── App.tsx             # Root component with React Router and auth initialization
├── main.tsx            # Entry file, renders root component and mounts to DOM
├── index.css           # AI-themed design system with professional light/dark mode colors and effects
└── tailwind.config.js  # Tailwind CSS v3 configuration file