# 🏆 SafeOrbit


**AI-Powered Safety Equipment Detection System for Space Stations**

A complete full-stack solution combining YOLOv8-based object detection with a cross-platform mobile application for real-time safety equipment monitoring in space station environments.

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![YOLOv8](https://img.shields.io/badge/YOLOv8-m-green)
![Expo](https://img.shields.io/badge/Expo-54.0-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

<video controls muted loop autoplay src="public/landing.mp4" title="Title"></video>


https://github.com/user-attachments/assets/31af0b30-26af-4bb2-8695-b18eb3dafe34


---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [AI Engine Setup](#-ai-engine-setup)
- [Mobile App Setup](#-mobile-app-setup)
- [API Documentation](#-api-documentation)
- [Model Performance](#-model-performance)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

SafeOrbit is an intelligent safety monitoring system designed for space station environments. It combines advanced computer vision with a modern mobile interface to detect and track critical safety equipment in real-time.

### Key Components

- **AI Engine**: YOLOv8m-based object detection model achieving 86.4% mAP@0.5
- **Mobile App**: Cross-platform React Native application with on-device ML inference
- **REST API**: FastAPI backend for model serving and real-time predictions
- **ONNX Runtime**: On-device inference for iOS, Android, and web platforms

### Detected Safety Equipment

The system identifies 7 critical safety equipment classes:

| Class ID | Equipment | Purpose |
|----------|-----------|---------|
| 0 | Oxygen Tank | Emergency oxygen supply |
| 1 | Nitrogen Tank | Nitrogen storage |
| 2 | First Aid Box | Medical emergency kit |
| 3 | Fire Alarm | Fire detection system |
| 4 | Safety Switch Panel | Emergency control panel |
| 5 | Emergency Phone | Emergency communication |
| 6 | Fire Extinguisher | Fire suppression equipment |

---

## ✨ Features

### 🤖 AI-Powered Detection
- **High Accuracy**: 86.36% mAP@0.5, 95.52% precision
- **Real-time Processing**: Fast inference with ONNX optimization
- **Multi-platform**: CPU and GPU support with automatic fallback
- **Domain Adaptation**: Optimized for real-world space station imagery

### 📱 Mobile Application
- **Cross-platform**: iOS, Android, and web support via React Native
- **Live Scanning**: Real-time camera-based object detection
- **On-device ML**: ONNX Runtime for privacy and speed
- **Secure Authentication**: Clerk-based authentication system
- **Analytics Dashboard**: Visual insights and scanning history
- **Offline Capable**: Core detection works without internet

### 🔧 Developer Experience
- **TypeScript**: 100% type-safe codebase
- **Modern UI**: Tailwind CSS via NativeWind
- **Production Ready**: Comprehensive logging and error handling
- **Well Documented**: Extensive documentation and code comments

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)                 │
├──────────────────────────────────────────────────────────────┤
│  • Expo Router navigation                                    │
│  • On-device ONNX inference                                  │
│  • Real-time camera scanning                                 │
│  • Analytics dashboard                                       │
│  • Clerk authentication                                      │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    REST API (FastAPI)                        │
├──────────────────────────────────────────────────────────────┤
│  • /predict endpoint                                         │
│  • Base64 image processing                                   │
│  • CORS handling                                             │
│  • Health checks                                             │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    AI Engine (YOLOv8m)                       │
├──────────────────────────────────────────────────────────────┤
│  • YOLOv8m architecture                                      │
│  • Custom trained weights (204 epochs)                       │
│  • ONNX export support                                       │
│  • CPU/GPU inference                                         │
│  • Advanced augmentation pipeline                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18.x or higher
- **Git**: Latest version
- **Expo CLI**: For mobile development
- **CUDA** (optional): For GPU acceleration

### 1. Clone the Repository

```powershell
git clone https://github.com/Namann-14/safeorbit.git
cd safeorbit
```

### 2. AI Engine Setup

```powershell
cd ai-engine
pip install -r requirements.txt
```

Create `.env` file (optional):
```env
MODEL_PATH=results/improved_model/train/weights/best.pt
DEVICE=cpu
```

Start the API server:
```powershell
python api.py
```

The API will be available at `http://localhost:8000`

### 3. Mobile App Setup

```powershell
cd expo
npm install
```

Configure environment variables in `.env.local`:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start the development server:
```powershell
npm run dev
```

### 4. Access the Application

- **API Documentation**: http://localhost:8000/docs
- **Mobile App**: Scan QR code with Expo Go or press `i`/`a` for simulator

---

## 🤖 AI Engine Setup

### Training the Model

The AI engine includes comprehensive training scripts and configurations.

**Basic Training:**
```powershell
cd ai-engine
python train.py
```

**Advanced Training with Optimization:**
```powershell
python scripts/train.py --config configs/train_config.yaml
```

**Master Pipeline (Complete Automation):**
```powershell
python scripts/master_pipeline.py
```

### Configuration Files

- **`configs/dataset.yaml`**: Dataset paths and class definitions
- **`configs/train_config.yaml`**: Training hyperparameters
- **`configs/augmentation_config.yaml`**: Data augmentation settings

### Model Inference

**Python API:**
```python
from ultralytics import YOLO

model = YOLO('results/improved_model/train/weights/best.pt')
results = model.predict('image.jpg', conf=0.25)
```

**Command Line:**
```powershell
python predict.py --source image.jpg --conf 0.25
```

**FastAPI Endpoint:**
```powershell
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image", "confidence": 0.25}'
```

### Export to ONNX

```powershell
python -c "from ultralytics import YOLO; YOLO('results/improved_model/train/weights/best.pt').export(format='onnx')"
```

---

## 📱 Mobile App Setup

### Running on Different Platforms

**iOS Simulator (macOS only):**
```powershell
npm run ios
```

**Android Emulator:**
```powershell
npm run android
```

**Web Browser:**
```powershell
npm run web
```

**Physical Device:**
```powershell
npm run dev
# Scan QR code with Expo Go app
```

### Key Features

- **Authentication**: Sign up, sign in, password reset, email verification
- **Live Scanning**: Real-time camera-based object detection
- **Dashboard**: Analytics with charts and statistics
- **Scan History**: Review past detections with details
- **Settings**: User preferences and account management

### Project Structure

```
expo/
├── app/                    # Application screens
│   ├── (auth)/            # Authentication flows
│   ├── (tabs)/            # Main tabbed interface
│   └── index.tsx          # Entry point
├── components/            # Reusable UI components
│   ├── ui/               # Base UI primitives
│   ├── dashboard/        # Dashboard components
│   └── settings/         # Settings components
├── lib/                   # Utilities and configuration
│   ├── api-config.ts     # API client setup
│   ├── storage.ts        # AsyncStorage helpers
│   └── utils.ts          # Utility functions
└── assets/
    └── models/
        └── best.onnx     # ONNX model for on-device inference
```

---

## 📚 API Documentation

### Endpoints

#### POST `/predict`
Detect objects in an image.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "confidence": 0.25,
  "use_tta": true
}
```

**Response:**
```json
{
  "objects": [
    {
      "name": "FireExtinguisher",
      "confidence": 0.95,
      "bbox": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 300
      }
    }
  ],
  "inference_time": 0.245,
  "image_size": [640, 480]
}
```

#### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "results/improved_model/train/weights/best.pt"
}
```

### Interactive Documentation

Visit `http://localhost:8000/docs` for Swagger UI with interactive API testing.

---

## 📊 Model Performance

### Validation Metrics (Epoch 204)

| Metric | Value |
|--------|-------|
| **mAP@0.5** | **86.36%** |
| **mAP@0.5:0.95** | **75.33%** |
| **Precision** | **95.52%** |
| **Recall** | **74.31%** |

### Per-Class Performance

Results demonstrate strong detection capabilities across all 7 safety equipment classes with high precision and competitive recall rates.

### Training Configuration

- **Model**: YOLOv8m (medium variant)
- **Epochs**: 204 (stopped due to CUDA OOM)
- **Image Size**: 640x640
- **Batch Size**: Adaptive based on GPU memory
- **Optimizer**: AdamW with cosine learning rate schedule
- **Augmentations**: Advanced pipeline including mixup, mosaic, and spatial transforms

---

## 📁 Project Structure

```
safeorbit/
├── ai-engine/                      # AI/ML Backend
│   ├── api.py                     # FastAPI server
│   ├── predict.py                 # Inference script
│   ├── train.py                   # Training script
│   ├── requirements.txt           # Python dependencies
│   ├── configs/                   # Configuration files
│   ├── scripts/                   # Advanced training scripts
│   ├── utils/                     # Utility modules
│   └── results/                   # Training outputs
│       └── improved_model/
│           └── train/
│               └── weights/
│                   └── best.pt    # Best model checkpoint
│
└── expo/                          # Mobile Application
    ├── app/                       # App screens and routes
    ├── components/                # UI components
    ├── lib/                       # Utilities and config
    ├── assets/                    # Static assets
    │   └── models/
    │       └── best.onnx         # ONNX model
    ├── package.json               # Node dependencies
    └── tsconfig.json              # TypeScript config
```

---

## 🚀 Deployment

### AI Engine Deployment

**Docker:**
```dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY ai-engine/ .
RUN pip install -r requirements.txt
CMD ["python", "api.py"]
```

**Production Server:**
```powershell
uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4
```

### Mobile App Deployment

**iOS:**
```powershell
eas build --platform ios
```

**Android:**
```powershell
eas build --platform android
```

**Web:**
```powershell
npm run build:web
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **YOLOv8**: Ultralytics for the excellent object detection framework
- **Expo**: For simplifying cross-platform mobile development
- **React Native Community**: For comprehensive ecosystem and support

---

## 📞 Contact

**Project Maintainer**: Namann-14  
**Repository**: [github.com/Namann-14/safeorbit](https://github.com/Namann-14/safeorbit)

---

<div align="center">
  <p>Built with ❤️ for safer space exploration</p>
</div>
