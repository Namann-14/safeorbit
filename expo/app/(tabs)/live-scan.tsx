/**
 * Live Scan Screen - Real-time Object Detection
 * 
 * Continuous frame-by-frame analysis similar to Google Lens.
 * Production-ready with comprehensive error handling, performance optimization,
 * and debugging capabilities.
 * 
 * Features:
 * - Real-time object detection from camera feed
 * - Automatic frame throttling based on detection activity
 * - Visual bounding boxes overlaid on camera
 * - Performance metrics display
 * - Smart request queuing to prevent overload
 * - Automatic reconnection on failure
 * 
 * @module LiveScanScreen
 */

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { 
  CameraIcon, 
  RotateCwIcon,
  ZapIcon,
  ZapOffIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ActivityIcon,
  WifiIcon,
  WifiOffIcon,
  ZoomInIcon,
  ImageIcon
} from 'lucide-react-native';
import * as React from 'react';
import { 
  Pressable, 
  View, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  Platform
} from 'react-native';
import { API_CONFIG, ENDPOINTS } from '@/lib/api-config';
import { saveScanResult } from '@/lib/storage';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Detection {
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DetectionResponse {
  objects: Detection[];
  inference_time: number;
  image_size: [number, number];
}

interface PerformanceMetrics {
  fps: number;
  avgInferenceTime: number;
  totalFramesProcessed: number;
  detectionCount: number;
  lastUpdateTime: number;
}

interface LiveScanState {
  isScanning: boolean;
  detections: Detection[];
  metrics: PerformanceMetrics;
  isBackendConnected: boolean;
  isProcessing: boolean;
  errorCount: number;
  imageSize: [number, number] | null; // [width, height] of processed image
}

// ============================================================================
// CONSTANTS
// ============================================================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: '#4285F4', // Google Blue
  success: '#0F9D58', // Google Green
  warning: '#F4B400', // Google Yellow
  danger: '#DB4437',  // Google Red
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Color mapping for different object classes
const CLASS_COLORS: Record<string, { color: string; bgColor: string; name: string }> = {
  // Oxygen variants
  'oxygen_cylinder': {
    color: '#4285F4', // Blue
    bgColor: 'rgba(66, 133, 244, 0.15)',
    name: 'Oxygen',
  },
  'oxygen': {
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    name: 'Oxygen',
  },
  // Nitrogen variants
  'nitrogen_cylinder': {
    color: '#9C27B0', // Purple
    bgColor: 'rgba(156, 39, 176, 0.15)',
    name: 'Nitrogen',
  },
  'nitrogen': {
    color: '#9C27B0',
    bgColor: 'rgba(156, 39, 176, 0.15)',
    name: 'Nitrogen',
  },
  // Acetylene variants
  'acetylene_cylinder': {
    color: '#F4B400', // Yellow
    bgColor: 'rgba(244, 180, 0, 0.15)',
    name: 'Acetylene',
  },
  'acetylene': {
    color: '#F4B400',
    bgColor: 'rgba(244, 180, 0, 0.15)',
    name: 'Acetylene',
  },
  // CO2 variants
  'co2_cylinder': {
    color: '#0F9D58', // Green
    bgColor: 'rgba(15, 157, 88, 0.15)',
    name: 'CO2',
  },
  'co2': {
    color: '#0F9D58',
    bgColor: 'rgba(15, 157, 88, 0.15)',
    name: 'CO2',
  },
  'carbon_dioxide': {
    color: '#0F9D58',
    bgColor: 'rgba(15, 157, 88, 0.15)',
    name: 'CO2',
  },
  // Argon variants
  'argon_cylinder': {
    color: '#00BCD4', // Cyan
    bgColor: 'rgba(0, 188, 212, 0.15)',
    name: 'Argon',
  },
  'argon': {
    color: '#00BCD4',
    bgColor: 'rgba(0, 188, 212, 0.15)',
    name: 'Argon',
  },
  // Hydrogen variants
  'hydrogen_cylinder': {
    color: '#DB4437', // Red
    bgColor: 'rgba(219, 68, 55, 0.15)',
    name: 'Hydrogen',
  },
  'hydrogen': {
    color: '#DB4437',
    bgColor: 'rgba(219, 68, 55, 0.15)',
    name: 'Hydrogen',
  },
  // Helium variants
  'helium_cylinder': {
    color: '#FF9800', // Orange
    bgColor: 'rgba(255, 152, 0, 0.15)',
    name: 'Helium',
  },
  'helium': {
    color: '#FF9800',
    bgColor: 'rgba(255, 152, 0, 0.15)',
    name: 'Helium',
  },
  // LPG variants
  'lpg_cylinder': {
    color: '#E91E63', // Pink
    bgColor: 'rgba(233, 30, 99, 0.15)',
    name: 'LPG',
  },
  'lpg': {
    color: '#E91E63',
    bgColor: 'rgba(233, 30, 99, 0.15)',
    name: 'LPG',
  },
  // Generic cylinder
  'cylinder': {
    color: '#607D8B', // Blue Gray
    bgColor: 'rgba(96, 125, 139, 0.15)',
    name: 'Cylinder',
  },
};

// Default color for unknown classes
const DEFAULT_CLASS_COLOR = {
  color: '#757575', // Gray
  bgColor: 'rgba(117, 117, 117, 0.15)',
  name: 'Unknown',
};

/**
 * Get color configuration for a class name
 * Handles various naming formats from backend
 */
const getClassColor = (className: string) => {
  // Log original class name for debugging
  if (!className) {
    console.warn('⚠️ Empty class name received');
    return DEFAULT_CLASS_COLOR;
  }

  // Try exact match first
  if (CLASS_COLORS[className]) {
    return CLASS_COLORS[className];
  }

  // Normalize: lowercase and replace spaces with underscores
  const normalized = className.toLowerCase().replace(/\s+/g, '_');
  
  if (CLASS_COLORS[normalized]) {
    return CLASS_COLORS[normalized];
  }

  // Try without _cylinder suffix
  const withoutSuffix = normalized.replace(/_cylinder$/, '');
  const withCylinder = `${withoutSuffix}_cylinder`;
  
  if (CLASS_COLORS[withCylinder]) {
    return CLASS_COLORS[withCylinder];
  }

  // Try with _cylinder suffix if not present
  if (!normalized.endsWith('_cylinder')) {
    const withSuffix = `${normalized}_cylinder`;
    if (CLASS_COLORS[withSuffix]) {
      return CLASS_COLORS[withSuffix];
    }
  }

  // Log unknown class for debugging
  console.log('❓ Unknown class detected:', className, '(normalized:', normalized + ')');
  
  // Return default with actual name
  return {
    ...DEFAULT_CLASS_COLOR,
    name: className, // Use actual name instead of "Unknown"
  };
};

// Detection configuration
const DETECTION_CONFIG = {
  // Dynamic interval adjustment
  INTERVAL_IDLE: API_CONFIG.DETECTION_INTERVAL_IDLE,     // When nothing detected
  INTERVAL_ACTIVE: API_CONFIG.DETECTION_INTERVAL_ACTIVE, // When objects detected
  INTERVAL_BOOST: API_CONFIG.DETECTION_INTERVAL_BOOST,   // Maximum responsiveness
  
  // Image processing
  IMAGE_QUALITY: API_CONFIG.IMAGE_QUALITY,
  MAX_WIDTH: API_CONFIG.IMAGE_MAX_WIDTH,
  MAX_HEIGHT: API_CONFIG.IMAGE_MAX_HEIGHT,
  
  // Safety limits
  MAX_CONSECUTIVE_ERRORS: 5,
  RECONNECT_DELAY: 3000,
  REQUEST_TIMEOUT: 10000,
  
  // Performance optimization
  SKIP_IF_PROCESSING: API_CONFIG.SKIP_IF_PROCESSING,
  MAX_CONCURRENT_REQUESTS: API_CONFIG.MAX_CONCURRENT_REQUESTS,
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Detection Grid Frame Component
 * Shows the active detection area that matches backend processing
 */
const DetectionGrid: React.FC<{ isScanning: boolean }> = React.memo(({ isScanning }) => {
  const gridSize = Math.min(SCREEN_WIDTH * 0.85, SCREEN_HEIGHT * 0.6);
  const gridLeft = (SCREEN_WIDTH - gridSize) / 2;
  const gridTop = SCREEN_HEIGHT * 0.2;
  
  return (
    <View
      style={{
        position: 'absolute',
        left: gridLeft,
        top: gridTop,
        width: gridSize,
        height: gridSize,
        borderWidth: 3,
        borderColor: isScanning ? COLORS.primary : 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        backgroundColor: 'rgba(66, 133, 244, 0.05)',
      }}
      pointerEvents="none"
    >
      {/* Corner markers */}
      <View style={[styles.gridCorner, { top: -3, left: -3, borderTopWidth: 5, borderLeftWidth: 5, borderColor: isScanning ? COLORS.primary : '#fff' }]} />
      <View style={[styles.gridCorner, { top: -3, right: -3, borderTopWidth: 5, borderRightWidth: 5, borderColor: isScanning ? COLORS.primary : '#fff' }]} />
      <View style={[styles.gridCorner, { bottom: -3, left: -3, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: isScanning ? COLORS.primary : '#fff' }]} />
      <View style={[styles.gridCorner, { bottom: -3, right: -3, borderBottomWidth: 5, borderRightWidth: 5, borderColor: isScanning ? COLORS.primary : '#fff' }]} />
      
      {/* Grid lines for better alignment */}
      {isScanning && (
        <>
          <View style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <View style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <View style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <View style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
        </>
      )}
    </View>
  );
});

DetectionGrid.displayName = 'DetectionGrid';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LiveScanScreen() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = React.useState(false);
  
  // Live scanning state
  const [state, setState] = React.useState<LiveScanState>({
    isScanning: false,
    detections: [],
    metrics: {
      fps: 0,
      avgInferenceTime: 0,
      totalFramesProcessed: 0,
      detectionCount: 0,
      lastUpdateTime: Date.now(),
    },
    isBackendConnected: false,
    isProcessing: false,
    errorCount: 0,
    imageSize: null,
  });

  // Store last captured frame for final analysis
  const [lastCapturedFrame, setLastCapturedFrame] = React.useState<string | null>(null);

  // Debug mode
  const [showDebugInfo, setShowDebugInfo] = React.useState(true);
  
  // ========================================
  // REFS
  // ========================================
  
  const cameraRef = React.useRef<CameraView>(null);
  const scanIntervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScanTimeRef = React.useRef<number>(0);
  const inferenceTimesRef = React.useRef<number[]>([]);
  const frameCountRef = React.useRef<number>(0);
  const lastFPSUpdateRef = React.useRef<number>(Date.now());
  const currentRequestRef = React.useRef<AbortController | null>(null);
  
  // Animated values for smooth UI transitions
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const detectionOpacity = React.useRef(new Animated.Value(0)).current;

  // ========================================
  // EFFECTS
  // ========================================
  
  // Check backend health on mount
  React.useEffect(() => {
    checkBackendHealth();
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopScanning();
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  // Start pulse animation when scanning
  React.useEffect(() => {
    if (state.isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state.isScanning]);

  // Fade in/out detection boxes
  React.useEffect(() => {
    Animated.timing(detectionOpacity, {
      toValue: state.detections.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state.detections.length]);

  // ========================================
  // CORE FUNCTIONS
  // ========================================

  /**
   * Check backend health and connectivity
   */
  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        isBackendConnected: data.status === 'healthy' && data.model_loaded,
        errorCount: 0,
      }));

      if (data.status === 'healthy' && data.model_loaded) {
        console.log('✅ Backend connected and ready');
      } else {
        console.warn('⚠️ Backend unhealthy:', data);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isBackendConnected: false,
      }));
      console.log('❌ Backend not reachable:', error);
    }
  };

  /**
   * Capture frame and send for detection
   */
  const captureAndDetect = async () => {
    if (!cameraRef.current || !state.isBackendConnected) return;
    
    // Skip if already processing (prevent queue buildup)
    if (DETECTION_CONFIG.SKIP_IF_PROCESSING && state.isProcessing) {
      console.log('⏭️ Skipping frame - previous request still processing');
      return;
    }

    const startTime = Date.now();

    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Capture photo with optimized settings
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: DETECTION_CONFIG.IMAGE_QUALITY,
        skipProcessing: true, // Faster capture
      });

      if (!photo?.base64) {
        throw new Error('Failed to capture frame');
      }

      // Store last captured frame for final analysis when stopping
      setLastCapturedFrame(photo.base64);

      // Log photo dimensions for debugging
      console.log('📸 Captured photo:', {
        width: photo.width,
        height: photo.height,
        aspect: photo.width && photo.height ? (photo.width / photo.height).toFixed(2) : 'unknown'
      });

      // Create abort controller for this request
      currentRequestRef.current = new AbortController();
      const timeoutId = setTimeout(
        () => currentRequestRef.current?.abort(),
        DETECTION_CONFIG.REQUEST_TIMEOUT
      );

      // Send to backend
      const response = await fetch(ENDPOINTS.DETECT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photo.base64,
          confidence: API_CONFIG.CONFIDENCE_THRESHOLD,
        }),
        signal: currentRequestRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Detection failed: ${response.status}`);
      }

      const result: DetectionResponse = await response.json();
      const inferenceTime = Date.now() - startTime;

      // Log detection results for debugging
      console.log('🎯 Detection result:', {
        objects: result.objects.length,
        imageSize: result.image_size,
        allObjectNames: result.objects.map(obj => obj.name), // Log all names
        firstBox: result.objects[0] ? {
          name: result.objects[0].name,
          bbox: result.objects[0].bbox
        } : null
      });

      // Update detections and metrics
      updateDetections(result, inferenceTime);

      // Reset error count on success
      setState(prev => ({ ...prev, errorCount: 0 }));

    } catch (error: any) {
      // Handle different error types
      if (error.name === 'AbortError') {
        console.warn('⏱️ Request timeout');
      } else {
        console.error('❌ Detection error:', error.message);
      }

      // Increment error count
      setState(prev => {
        const newErrorCount = prev.errorCount + 1;
        
        // Stop scanning if too many consecutive errors
        if (newErrorCount >= DETECTION_CONFIG.MAX_CONSECUTIVE_ERRORS) {
          console.error('🛑 Too many errors, stopping scan');
          stopScanning();
          Alert.alert(
            'Connection Lost',
            'Lost connection to backend. Please check if the server is running.',
            [
              { text: 'Retry', onPress: () => checkBackendHealth() },
              { text: 'Cancel' }
            ]
          );
        }

        return { ...prev, errorCount: newErrorCount };
      });
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
      lastScanTimeRef.current = Date.now();
    }
  };

  /**
   * Update detections and calculate metrics
   */
  const updateDetections = (result: DetectionResponse, inferenceTime: number) => {
    // Track inference times for averaging
    inferenceTimesRef.current.push(inferenceTime);
    if (inferenceTimesRef.current.length > 30) {
      inferenceTimesRef.current.shift(); // Keep last 30 measurements
    }

    // Calculate FPS
    frameCountRef.current++;
    const now = Date.now();
    const timeSinceLastUpdate = now - lastFPSUpdateRef.current;

    let currentFPS = state.metrics.fps;
    if (timeSinceLastUpdate >= 1000) {
      currentFPS = (frameCountRef.current / timeSinceLastUpdate) * 1000;
      frameCountRef.current = 0;
      lastFPSUpdateRef.current = now;
    }

    // Calculate average inference time
    const avgInference = inferenceTimesRef.current.reduce((a, b) => a + b, 0) / 
                        inferenceTimesRef.current.length;

    // Update state
    setState(prev => ({
      ...prev,
      detections: result.objects,
      imageSize: result.image_size, // Store image size for coordinate mapping
      metrics: {
        fps: currentFPS,
        avgInferenceTime: avgInference,
        totalFramesProcessed: prev.metrics.totalFramesProcessed + 1,
        detectionCount: prev.metrics.detectionCount + result.objects.length,
        lastUpdateTime: now,
      },
    }));

    // Save to storage if objects detected
    if (result.objects.length > 0) {
      saveScanResult(result.objects, inferenceTime).catch(err => 
        console.error('Failed to save scan result:', err)
      );
    }
  };

  /**
   * Get dynamic scan interval based on detection activity
   */
  const getScanInterval = (): number => {
    if (state.detections.length === 0) {
      return DETECTION_CONFIG.INTERVAL_IDLE;
    } else if (state.detections.length >= 3) {
      return DETECTION_CONFIG.INTERVAL_BOOST; // Many objects = faster scanning
    } else {
      return DETECTION_CONFIG.INTERVAL_ACTIVE;
    }
  };

  /**
   * Start continuous scanning
   */
  const startScanning = () => {
    if (!state.isBackendConnected) {
      Alert.alert(
        'Backend Not Connected',
        `Please ensure the Python backend is running at:\n${API_CONFIG.BACKEND_URL}\n\nUpdate the IP address in lib/api-config.ts if needed.`,
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('▶️ Starting live scan...');
    setState(prev => ({ ...prev, isScanning: true }));

    // Initial scan
    captureAndDetect();

    // Setup interval with dynamic adjustment
    const schedulNextScan = () => {
      const interval = getScanInterval();
      scanIntervalRef.current = setTimeout(() => {
        captureAndDetect();
        schedulNextScan(); // Recursive scheduling for dynamic intervals
      }, interval);
    };

    schedulNextScan();
  };

  /**
   * Stop continuous scanning and perform final analysis
   */
  const stopScanning = async () => {
    console.log('⏸️ Stopping live scan...');
    
    if (scanIntervalRef.current) {
      clearTimeout(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
      currentRequestRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isScanning: false,
      isProcessing: false,
    }));

    console.log('⏹️ Scanning stopped. Frame ready for analysis.');
    // Note: Frame is kept in lastCapturedFrame for manual analysis via button
  };

  /**
   * Toggle scanning on/off
   */
  const toggleScanning = () => {
    if (state.isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  /**
   * Send last captured frame for manual analysis with bounding boxes
   */
  const sendLastFrameForAnalysis = async () => {
    if (!lastCapturedFrame) {
      Alert.alert('No Frame Available', 'Please start scanning first to capture a frame.');
      return;
    }

    console.log('📤 Manually sending last frame for analysis...');
    
    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Get detection results
      const response = await fetch(ENDPOINTS.DETECT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: lastCapturedFrame,
          confidence: API_CONFIG.CONFIDENCE_THRESHOLD,
        }),
      });

      if (!response.ok) {
        throw new Error(`Detection failed: ${response.status}`);
      }

      const result: DetectionResponse = await response.json();
      
      // Get image with bounding boxes drawn
      const imageResponse = await fetch(`${API_CONFIG.BACKEND_URL}/detect-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: lastCapturedFrame,
          confidence: API_CONFIG.CONFIDENCE_THRESHOLD,
        }),
      });

      let processedImageBase64 = lastCapturedFrame;
      if (imageResponse.ok) {
        const blob = await imageResponse.blob();
        const reader = new FileReader();
        processedImageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64 || lastCapturedFrame);
          };
          reader.readAsDataURL(blob);
        });
      }
      
      console.log('✅ Manual analysis complete:', {
        objects: result.objects.length,
        imageSize: result.image_size,
        hasProcessedImage: !!processedImageBase64,
      });

      // Save to temporary storage for photo mode to pick up
      const tempKey = '@safeorbit_temp_live_scan_result';
      const tempData = {
        detections: JSON.stringify(result.objects),
        image: lastCapturedFrame,
        processedImage: processedImageBase64, // Image with boxes drawn
        inferenceTime: result.inference_time.toString(),
      };
      
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        await AsyncStorage.setItem(tempKey, JSON.stringify(tempData));
      } catch (storageError) {
        console.log('Note: Could not save temp data, navigating anyway');
      }

      setState(prev => ({ ...prev, isProcessing: false }));

      // Navigate to photo scan tab to show results with boxes
      router.push('/(tabs)/scan');
      
    } catch (error) {
      console.error('❌ Manual analysis failed:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
      Alert.alert(
        'Analysis Failed',
        error instanceof Error ? error.message : 'Could not analyze the frame'
      );
    }
  };

  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setIsFlashOn((current) => !current);
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(prev => !prev);
  };

  const goToStaticScan = () => {
    stopScanning();
    router.push('/(tabs)/scan');
  };

  // ========================================
  // RENDER CONDITIONS
  // ========================================

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Icon as={CameraIcon} size={64} color="#ffffff" style={{ marginBottom: 20 }} />
        <Text className="mb-2 text-center text-white text-xl font-bold">
          Camera Permission Required
        </Text>
        <Text className="mb-6 text-center text-white/70 text-base">
          We need your permission to access the camera for real-time object detection
        </Text>
        <Button onPress={requestPermission}>
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Button>
      </View>
    );
  }

  // ========================================
  // MAIN RENDER
  // ========================================

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Camera View */}
      <CameraView 
        ref={cameraRef}
        style={StyleSheet.absoluteFill} 
        facing={facing} 
        enableTorch={isFlashOn}
      />
      
      {/* Overlay UI */}
      <View className="absolute inset-0" style={{ pointerEvents: 'box-none' }}>
        
        {/* Top Bar */}
        <View className="absolute top-[20px] left-5 right-5 flex-row justify-between items-center">
          {/* Back Button */}
          <Pressable 
            onPress={() => router.back()}
            className="bg-black/80 px-3 py-2 rounded-full flex-row items-center gap-2"
          >
            <Icon as={ArrowLeftIcon} size={18} color="#ffffff" />
            <Text className="text-white text-sm font-bold">Back</Text>
          </Pressable>

          {/* Controls Row */}
          <View className="flex-row items-center gap-2">
            {/* Flash Toggle */}
            <Pressable 
              className="w-10 h-10 rounded-full bg-black/80 justify-center items-center"
              onPress={toggleFlash}
            >
              <Icon
                as={isFlashOn ? ZapIcon : ZapOffIcon}
                size={20}
                color="#ffffff"
              />
            </Pressable>

            {/* Rotate Camera */}
            <Pressable 
              className="w-10 h-10 rounded-full bg-black/80 justify-center items-center"
              onPress={toggleCameraFacing}
            >
              <Icon as={RotateCwIcon} size={20} color="#ffffff" />
            </Pressable>

            {/* Static Scan Mode */}
            <Pressable 
              onPress={goToStaticScan}
              className="bg-black/80 px-3 py-2 rounded-full flex-row items-center gap-2"
            >
              <Icon as={ImageIcon} size={18} color="#ffffff" />
              <Text className="text-white text-sm font-bold">Photo</Text>
            </Pressable>
          </View>
        </View>

        {/* Status Bar */}
        <View className="absolute top-[70px] left-5 right-5 flex-row gap-2">
          {/* Connection Status */}
          <View 
            className="flex-row items-center gap-2 px-3 py-2 rounded-full"
            style={{ 
              backgroundColor: state.isBackendConnected ? 
                'rgba(15, 157, 88, 0.9)' : 'rgba(219, 68, 55, 0.9)' 
            }}
          >
            <Icon 
              as={state.isBackendConnected ? WifiIcon : WifiOffIcon} 
              size={14} 
              color="#ffffff" 
            />
            <Text className="text-white text-xs font-bold">
              {state.isBackendConnected ? 'Connected' : 'Offline'}
            </Text>
          </View>

          {/* Scanning Status */}
          {state.isScanning && (
            <Animated.View 
              className="flex-row items-center gap-2 bg-blue-500/90 px-3 py-2 rounded-full"
              style={{ transform: [{ scale: pulseAnim }] }}
            >
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white text-xs font-bold">
                {state.isProcessing ? 'Processing...' : 'Scanning...'}
              </Text>
            </Animated.View>
          )}

          {/* Detection Count */}
          {state.detections.length > 0 && (
            <View className="flex-row items-center gap-2 bg-green-500/90 px-3 py-2 rounded-full">
              <Icon as={ActivityIcon} size={14} color="#ffffff" />
              <Text className="text-white text-xs font-bold">
                {state.detections.length} {state.detections.length === 1 ? 'object' : 'objects'}
              </Text>
            </View>
          )}
        </View>

        {/* Detection Grid Frame - Shows the active detection area */}
        <DetectionGrid isScanning={state.isScanning} />

        {/* Detection Tray - List of detected objects (no bounding boxes) */}
        {state.detections.length > 0 && state.isScanning && (
          <Animated.View 
            className="absolute bottom-24 left-5 right-5"
            style={{ opacity: detectionOpacity }}
          >
            <View className="bg-black/85 rounded-2xl p-4 max-h-[250px]">
              <Text className="text-white text-sm font-bold mb-3">
                🔍 Detected Objects
              </Text>
              <View className="gap-2">
                {Array.from(
                  state.detections.reduce((acc, detection) => {
                    const existing = acc.get(detection.name);
                    if (existing) {
                      existing.count++;
                      existing.maxConfidence = Math.max(existing.maxConfidence, detection.confidence);
                    } else {
                      acc.set(detection.name, {
                        name: detection.name,
                        count: 1,
                        maxConfidence: detection.confidence,
                      });
                    }
                    return acc;
                  }, new Map<string, { name: string; count: number; maxConfidence: number }>())
                  .values()
                ).map((item, index) => {
                  const classColor = getClassColor(item.name);
                  return (
                    <View 
                      key={`tray-${index}`} 
                      className="flex-row items-center justify-between bg-white/10 rounded-xl p-3"
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View 
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: classColor.color,
                            borderRadius: 6,
                          }}
                        />
                        <Text className="text-white font-semibold flex-1" numberOfLines={1}>
                          {classColor.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        {item.count > 1 && (
                          <View className="bg-white/20 px-2 py-1 rounded-full">
                            <Text className="text-white text-xs font-bold">
                              ×{item.count}
                            </Text>
                          </View>
                        )}
                        <Text className="text-green-400 text-sm font-bold">
                          {(item.maxConfidence * 100).toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Debug Info Panel */}
        {showDebugInfo && (
          <View className="absolute top-[120px] left-5 bg-black/80 p-3 rounded-xl max-w-[200px]">
            <Pressable onPress={toggleDebugInfo}>
              <Text className="text-white text-xs font-bold mb-2">
                📊 Performance Metrics
              </Text>
            </Pressable>
            <Text className="text-white/80 text-xs">
              FPS: {state.metrics.fps.toFixed(1)}
            </Text>
            <Text className="text-white/80 text-xs">
              Avg Inference: {state.metrics.avgInferenceTime.toFixed(0)}ms
            </Text>
            <Text className="text-white/80 text-xs">
              Frames: {state.metrics.totalFramesProcessed}
            </Text>
            <Text className="text-white/80 text-xs">
              Total Detections: {state.metrics.detectionCount}
            </Text>
            <Text className="text-white/80 text-xs">
              Interval: {getScanInterval()}ms
            </Text>
            <Text className="text-white/80 text-xs">
              Screen: {SCREEN_WIDTH.toFixed(0)}x{SCREEN_HEIGHT.toFixed(0)}
            </Text>
            {state.imageSize && (
              <>
                <Text className="text-white/80 text-xs">
                  Image: {state.imageSize[0]}x{state.imageSize[1]}
                </Text>
                <Text className="text-yellow-400 text-xs font-bold">
                  Aspect: {(SCREEN_WIDTH/SCREEN_HEIGHT).toFixed(2)} vs {(state.imageSize[0]/state.imageSize[1]).toFixed(2)}
                </Text>
              </>
            )}
            {state.detections.length > 0 && (
              <Text className="text-green-400 text-xs">
                Box1: ({state.detections[0].bbox.x.toFixed(2)}, {state.detections[0].bbox.y.toFixed(2)})
              </Text>
            )}
            {state.errorCount > 0 && (
              <Text className="text-red-400 text-xs font-bold mt-1">
                Errors: {state.errorCount}/{DETECTION_CONFIG.MAX_CONSECUTIVE_ERRORS}
              </Text>
            )}
          </View>
        )}

        {!showDebugInfo && (
          <Pressable 
            onPress={toggleDebugInfo}
            className="absolute top-[120px] left-5 bg-black/60 p-2 rounded-full"
          >
            <Icon as={ZoomInIcon} size={16} color="#ffffff" />
          </Pressable>
        )}


        {/* Main Control Buttons */}
        <View className="absolute bottom-8 left-0 right-0 items-center">
          {/* Start/Stop Scanning Button */}
          <Pressable 
            onPress={toggleScanning}
            disabled={!state.isBackendConnected}
            className="px-8 py-4 rounded-full shadow-lg"
            style={{
              backgroundColor: state.isScanning ? COLORS.danger : COLORS.success,
              opacity: !state.isBackendConnected ? 0.5 : 1,
            }}
          >
            <View className="flex-row items-center gap-3">
              <Icon 
                as={state.isScanning ? PauseIcon : PlayIcon} 
                size={24} 
                color="#ffffff" 
              />
              <Text className="text-white font-bold text-lg">
                {state.isScanning ? 'Stop Scanning' : 'Start Live Scan'}
              </Text>
            </View>
          </Pressable>

          {/* Show Detection Grid Button - Only shows AFTER stopping scan */}
          {lastCapturedFrame && !state.isScanning && (
            <Pressable 
              onPress={sendLastFrameForAnalysis}
              disabled={state.isProcessing}
              className="mt-3 px-6 py-3 rounded-full shadow-lg border-2 border-white/30"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                opacity: state.isProcessing ? 0.5 : 1,
              }}
            >
              <View className="flex-row items-center gap-2">
                <Icon as={ImageIcon} size={20} color="#ffffff" />
                <Text className="text-white font-bold text-base">
                  {state.isProcessing ? 'Analyzing...' : 'Show Detection Grid'}
                </Text>
              </View>
            </Pressable>
          )}

          {!state.isBackendConnected && (
            <Pressable 
              onPress={checkBackendHealth}
              className="mt-4 bg-white/20 px-4 py-2 rounded-full border border-white/40"
            >
              <Text className="text-white text-xs">Retry Connection</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  gridCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#ffffff',
    borderRadius: 10,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#ffffff',
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#ffffff',
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#ffffff',
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#ffffff',
    borderBottomRightRadius: 8,
  },
});
