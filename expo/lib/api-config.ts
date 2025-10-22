/**
 * API Configuration for SafeOrbit
 * 
 * Update the BACKEND_URL with your computer's local IP address
 * to connect from your mobile device.
 * 
 * To find your IP:
 * - Windows: Run 'ipconfig' in terminal, look for IPv4 Address
 * - Mac/Linux: Run 'ifconfig' or 'ip addr'
 * 
 * Example: http://192.168.1.100:8000
 */

// For development, update this with your local IP address
export const API_CONFIG = {
  // Replace with your computer's IP address when testing on physical device
  BACKEND_URL: 'http://192.168.152.122:8000',
  
  // Use localhost when testing on emulator/simulator on same machine
  // BACKEND_URL: 'http://localhost:8000',
  
  // Detection settings - AGGRESSIVE MODE (for development)
  DETECTION_INTERVAL_IDLE: 400, // milliseconds when nothing detected (slower to save resources)
  DETECTION_INTERVAL_ACTIVE: 150, // milliseconds when objects detected (faster tracking)
  DETECTION_INTERVAL_BOOST: 100, // milliseconds for maximum responsiveness
  CONFIDENCE_THRESHOLD: 0.4, // minimum confidence for detections (lower = more detections)
  IMAGE_QUALITY: 0.6, // JPEG quality (0-1) - lower = faster upload
  IMAGE_MAX_WIDTH: 640, // resize image to this width
  IMAGE_MAX_HEIGHT: 640, // resize image to this height
  
  // Smart features
  SKIP_IF_PROCESSING: true, // skip frame if previous request still processing
  MAX_CONCURRENT_REQUESTS: 1, // only 1 request at a time
};

export const ENDPOINTS = {
  DETECT: `${API_CONFIG.BACKEND_URL}/detect`,
  HEALTH: `${API_CONFIG.BACKEND_URL}/health`,
};
