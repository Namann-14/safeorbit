

<div align="center">
  <h1>SafeOrbit Mobile App</h1>
  <p><strong>Intelligent Object Detection & Safety Analysis Platform</strong></p>
  <p>Built with React Native, TypeScript, and AI-powered scanning capabilities</p>
</div>

---

## 📋 Overview

**SafeOrbit** is a cutting-edge cross-platform mobile application that leverages on-device machine learning to provide real-time object detection and safety analysis. Designed for iOS, Android, and web platforms, SafeOrbit combines modern React Native architecture with advanced AI capabilities to deliver fast, secure, and intelligent scanning solutions.

The application features a comprehensive authentication system, intuitive dashboard with analytics, live scanning capabilities powered by ONNX-based neural networks, and a seamless user experience through Tailwind CSS styling.

### 🏗️ Architecture

- **Framework**: React Native with Expo Router
- **Language**: TypeScript (100% type-safe)
- **Styling**: Tailwind CSS via NativeWind
- **Authentication**: Clerk-based secure authentication
- **UI Components**: React Native Reusables
- **ML Engine**: ONNX Runtime for on-device inference
- **State Management**: React Context & Hooks
- **API Layer**: RESTful architecture with TypeScript clients

---

## 🚀 How to Run

### Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm**, **yarn**, **pnpm**, or **bun** (package manager)
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (Mac only) or **Android Emulator**
- **Expo Go** app (for physical device testing)

### Environment Setup

1. **Clone the repository** and navigate to the app directory:

```powershell
cd app
```

2. **Install dependencies**:

```powershell
npm install
```

3. **Configure environment variables**:

   Rename `.env.example` to `.env.local` and add your configuration:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   EXPO_PUBLIC_API_BASE_URL=your_api_url_here
   ```

   Required keys:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — Get from [Clerk Dashboard](https://dashboard.clerk.com)
   - `EXPO_PUBLIC_API_BASE_URL` — Your backend API endpoint

### Running the App

Start the development server:

```powershell
npm run dev
```

This launches the Expo development server. Choose your platform:

- **iOS Simulator**: Press `i` (macOS only)
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`
- **Physical Device**: Scan the QR code with Expo Go app

### Building for Production

**Development Build**:
```powershell
npm run build
```

**Production Build**:
```powershell
# For iOS
npx expo build:ios

# For Android
npx expo build:android

# For Web
npm run build:web
```

**Preview Production Build**:
```powershell
npm run start
```

---

## ✨ Features

### 🔐 Authentication & Security
- **Multi-factor Authentication** — Email, phone, and username-based sign-up
- **OAuth Integration** — Sign in with Apple, Google, and GitHub
- **Password Management** — Secure password reset and recovery flows
- **Email Verification** — Two-step email verification for enhanced security
- **Protected Routes** — Clerk-powered route protection and session management
- **User Profile Management** — Comprehensive user settings and profile customization

### 📊 Dashboard & Analytics
- **Real-time Statistics** — Live scanning statistics and object detection metrics
- **Interactive Charts** — Visual data representation with custom chart components
- **Comparison Cards** — Side-by-side comparison of scan results
- **3D Cylinder Pie Charts** — Advanced data visualization
- **Map Integration** — Geographic visualization of scan locations
- **Object Distribution Analysis** — Detailed breakdown of detected object types

### 🎯 Live Scanning
- **Real-time Object Detection** — Powered by optimized ONNX neural network (`best.onnx`)
- **On-device ML Inference** — Fast, private, and offline-capable detection
- **Scan Result Storage** — Persistent storage of scan history
- **Detailed Scan Analysis** — Comprehensive scan details with object prioritization
- **Photo Mode** — Capture and analyze static images
- **Tray Mode** — Organized scan result management
- **Bounding Box Display** — Visual object highlighting with color-coded legends
- **Unknown Object Debugging** — Advanced debugging for unrecognized objects

### 🎨 User Experience
- **Cross-platform Support** — Seamless experience on iOS, Android, and Web
- **Responsive Design** — Adaptive layouts for all screen sizes
- **Tailwind Styling** — Modern, consistent design system
- **Dark Mode Support** — Built-in theme switching
- **Edge-to-Edge UI** — Immersive full-screen experience
- **Smooth Animations** — Native-quality transitions and interactions
- **Accessibility** — WCAG-compliant components and navigation

### ⚙️ Settings & Customization
- **User Preferences** — Customizable app behavior and display options
- **Notification Controls** — Granular notification management
- **Privacy Settings** — Data sharing and privacy controls
- **Toggle Components** — Easy on/off switches for features
- **Settings Sections** — Organized configuration categories

---

## 📁 Project Structure

---

## 📁 Project Structure

```
app/
├── app/                          # Application routes and screens
│   ├── (auth)/                   # Authentication flows
│   │   ├── sign-in.tsx          # Sign-in screen
│   │   ├── forgot-password.tsx  # Password recovery
│   │   ├── reset-password.tsx   # Password reset
│   │   └── sign-up/             # Sign-up flow
│   │       ├── index.tsx        # Sign-up form
│   │       └── verify-email.tsx # Email verification
│   ├── (tabs)/                  # Main app tabs
│   │   ├── dashboard.tsx        # Analytics dashboard
│   │   ├── home.tsx             # Home screen
│   │   ├── live-scan.tsx        # Live scanning interface
│   │   ├── scan.tsx             # Scan history
│   │   └── settings.tsx         # User settings
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Landing page
│   ├── live-scan-result.tsx     # Scan result details
│   ├── scan-details.tsx         # Detailed scan view
│   └── instructions.tsx         # App instructions
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI primitives
│   │   ├── button.tsx           # Button component
│   │   ├── input.tsx            # Input field
│   │   ├── card.tsx             # Card container
│   │   ├── avatar.tsx           # User avatar
│   │   └── ...                  # Other primitives
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── stat-card.tsx        # Statistics cards
│   │   ├── object-chart.tsx     # Object distribution charts
│   │   ├── cylinder-pie-chart.tsx # 3D pie charts
│   │   ├── map-card.tsx         # Map visualization
│   │   └── comparison-card.tsx  # Comparison views
│   ├── settings/                # Settings components
│   │   ├── settings-section.tsx # Settings sections
│   │   ├── settings-item.tsx    # Individual settings
│   │   └── settings-toggle.tsx  # Toggle switches
│   └── ...                      # Auth & other components
│
├── lib/                         # Core utilities and configuration
│   ├── api-config.ts           # API client configuration
│   ├── gemini-config.ts        # AI model configuration
│   ├── storage.ts              # Local storage helpers
│   ├── analytics.ts            # Analytics tracking
│   ├── object-instructions.ts  # Object detection rules
│   ├── object-priorities.ts    # Priority classification
│   ├── theme.ts                # Theme configuration
│   └── utils.ts                # General utilities
│
├── assets/                      # Static assets
│   ├── images/                 # Image resources
│   └── models/                 # ML models
│       └── best.onnx           # ONNX object detection model
│
├── tailwind.config.js          # Tailwind CSS configuration
├── global.css                  # Global styles
├── tsconfig.json               # TypeScript configuration
├── metro.config.js             # Metro bundler config
├── babel.config.js             # Babel transpiler config
└── package.json                # Dependencies and scripts
```

---

## 🔧 Development Guide

### Code Organization

- **Components** — Reusable UI components in `components/ui` for consistency
- **Business Logic** — Keep logic in `lib/` utilities to avoid duplication
- **Styling** — Use Tailwind utility classes; customize tokens in `tailwind.config.js`
- **Type Safety** — Leverage TypeScript; run `npx tsc --noEmit` for type checking

### ML Model Integration

The `assets/models/best.onnx` file powers the on-device object detection:

- **Format**: ONNX (Open Neural Network Exchange)
- **Usage**: Loaded in live-scan functionality
- **Replacement**: If updating the model, ensure compatibility with ONNX Runtime
- **Location**: Must remain in `assets/models/` for proper bundling

### API Configuration

Configure API endpoints in `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

### Adding New Features

1. **Create component** in appropriate `components/` subdirectory
2. **Add utilities** in `lib/` if needed
3. **Create route** in `app/` directory
4. **Update types** in relevant `.d.ts` files
5. **Test** on all target platforms

---

## 🧪 Testing

### Running Tests

```powershell
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Recommended Testing Stack

- **Unit Tests**: Jest + ts-jest
- **Component Tests**: React Native Testing Library
- **E2E Tests**: Detox or Maestro
- **Type Checking**: TypeScript compiler

---

## 🐛 Troubleshooting

### Common Issues

**Metro bundler cache issues**:
```powershell
npx expo start --clear
```

**Dependency conflicts**:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

**Type errors**:
```powershell
npx tsc --noEmit
```

**iOS build issues** (macOS only):
```powershell
cd ios
pod install
cd ..
```

**Android build issues**:
```powershell
cd android
./gradlew clean
cd ..
```

### Platform-Specific Notes

- **Windows**: Use PowerShell or Windows Terminal
- **macOS**: iOS builds require Xcode and CocoaPods
- **Linux**: Android development only; iOS requires macOS

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and type checking
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- Follow existing TypeScript and React patterns
- Use Tailwind utility classes for styling
- Write meaningful component and variable names
- Add JSDoc comments for complex functions
- Ensure all TypeScript types are properly defined
- Keep components small and focused

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback promptly

---

## 📚 Resources & Documentation

### Official Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Clerk Authentication](https://clerk.com/docs)
- [ONNX Runtime](https://onnxruntime.ai/docs/)

### Internal Documentation
- `COLOR_LEGEND_SYSTEM.md` — Color coding system for UI
- `BOUNDING_BOX_DISPLAY.md` — Object detection visualization
- `LIVE_SCAN_TRAY_MODE.md` — Tray functionality guide
- `STORAGE_FIX_COMPLETE.md` — Storage implementation notes
- `DEBUG_UNKNOWN_OBJECTS.md` — Debugging guide

---

## 📄 License

See the repository root for license information. Please contact maintainers before using this code commercially.

---

## 🙏 Acknowledgments

Built with powerful open-source technologies:

- [Expo Router](https://expo.dev/router) — File-based routing
- [Clerk](https://clerk.com) — Authentication infrastructure
- [React Native Reusables](https://github.com/founded-labs/react-native-reusables) — UI components
- [NativeWind](https://www.nativewind.dev/) — Tailwind for React Native
- [ONNX Runtime](https://onnxruntime.ai/) — ML inference engine

---

<div align="center">
  <p>Made with ❤️ by the SafeOrbit Team</p>
  <p>
    <a href="#overview">Back to Top ↑</a>
  </p>
</div>
