# AI Health Analyzer

A comprehensive medical analysis platform with multi-disease prediction capabilities, anemia detection system, and intelligent AI chat support.

## 🏥 Overview

AI Health Analyzer is a cutting-edge healthcare application that leverages artificial intelligence to provide users with instant health insights and risk assessments. The platform features a complete authentication system, light/dark theme support, and multiple specialized health analyzers.

## 🌟 Key Features

### 🔐 Authentication
- Secure email OTP verification system
- Persistent login state management

### 🎨 UI/UX
- Light/Dark mode toggle with theme persistence
- AI-themed professional interface with neural patterns
- Responsive design optimized for all devices
- Interactive animations and glow effects

### 🩺 Health Analyzers
- **Diabetes Risk Predictor (GlucoSense)** - Blood sugar and metabolic analysis
- **Heart Disease Analyzer (CardioGuard)** - Cardiovascular risk assessment
- **Kidney Health Monitor (NephroTrack)** - Chronic kidney disease screening
- **Liver Function Checker (LivoScan)** - Liver enzyme and function analysis
- **Lung Health Detector (PneumoAI)** - Respiratory health and COPD screening
- **Cancer Risk Assessment (OncoGuard)** - Comprehensive cancer risk evaluation
- **Anemia Detection System (IronIQ)** - Complete blood analysis with CBC, iron studies, and clinical symptoms

### 💬 AI Assistant
- Multi-language AI health chat (English, Hindi, Hinglish)
- Streaming responses for real-time interaction
- Medical-grade information and advice

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand
- **Routing**: React Router
- **Form Handling**: React Hook Form, Zod
- **Charts**: Recharts
- **Authentication**: Devv SDK
- **AI Integration**: DevvAI

## 📁 Project Structure

```
/src
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AuthDialog.tsx  # Authentication dialog
│   ├── ChatInterface.tsx # AI chat interface
│   ├── HealthAnalyzer.tsx # Diabetes predictor
│   ├── HeartAnalyzer.tsx # Heart disease analyzer
│   ├── KidneyAnalyzer.tsx # Kidney health monitor
│   ├── LiverAnalyzer.tsx # Liver function checker
│   ├── LungAnalyzer.tsx # Lung health detector
│   ├── CancerAnalyzer.tsx # Cancer risk assessment
│   ├── AnemiaAnalyzer.tsx # Anemia detection system
│   └── Sidebar.tsx     # Navigation sidebar
├── store/              # Zustand state management
│   ├── auth-store.ts   # Authentication state
│   ├── chat-store.ts   # Chat messages state
│   └── theme-store.ts  # Theme management
├── pages/              # Page components
│   ├── HomePage.tsx    # Main application page
│   └── NotFoundPage.tsx # 404 error page
├── hooks/              # Custom React hooks
│   ├── use-mobile.ts   # Mobile detection hook
│   └── use-toast.ts    # Toast notification hook
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Build for production:
```bash
npm run build
# or
yarn build
```

## 🧪 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Data Storage

- Authentication handled by Devv SDK
- Local state management with Zustand stores
- Persistence for auth state, chat messages, and theme preferences

## 🎯 Special Requirements

- Medical-grade design with AI-themed enhancements
- Neural network patterns and data flow animations
- Professional light/dark mode support
- Evidence-based risk scoring algorithms
- Comprehensive health recommendations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Crafted with ❤️ by Mohammad Aham - Powered by [DevvAI](https://devv.ai/)
