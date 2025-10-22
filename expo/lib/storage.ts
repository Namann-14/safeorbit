import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScanResult {
  id: string;
  timestamp: number;
  dateTime: string;
  detections: Detection[];
  inferenceTime: number;
  totalObjects: number;
  imageKey?: string; // Reference to separately stored image
}

export interface Detection {
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const STORAGE_KEY = '@safeorbit_scan_history';
const IMAGE_KEY_PREFIX = '@safeorbit_image_';

/**
 * Save scan image separately to avoid row size limits
 */
const saveScanImage = async (scanId: string, imageBase64: string): Promise<void> => {
  try {
    const imageKey = `${IMAGE_KEY_PREFIX}${scanId}`;
    await AsyncStorage.setItem(imageKey, imageBase64);
  } catch (error) {
    console.error('Error saving scan image:', error);
    throw error;
  }
};

/**
 * Get scan image by scan ID
 */
export const getScanImage = async (scanId: string): Promise<string | null> => {
  try {
    const imageKey = `${IMAGE_KEY_PREFIX}${scanId}`;
    return await AsyncStorage.getItem(imageKey);
  } catch (error) {
    console.error('Error getting scan image:', error);
    return null;
  }
};

/**
 * Delete scan image
 */
const deleteScanImage = async (scanId: string): Promise<void> => {
  try {
    const imageKey = `${IMAGE_KEY_PREFIX}${scanId}`;
    await AsyncStorage.removeItem(imageKey);
  } catch (error) {
    console.error('Error deleting scan image:', error);
  }
};

export const saveScanResult = async (
  detections: Detection[],
  inferenceTime: number,
  imageBase64?: string
): Promise<void> => {
  try {
    const now = new Date();
    const scanId = `scan_${now.getTime()}`;
    
    const scanResult: ScanResult = {
      id: scanId,
      timestamp: now.getTime(),
      dateTime: now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      detections,
      inferenceTime,
      totalObjects: detections.length,
      imageKey: imageBase64 ? scanId : undefined, // Reference to image
    };

    console.log('Saving scan result:', {
      id: scanId,
      totalObjects: detections.length,
      hasImage: !!imageBase64,
    });

    // Save image separately if provided
    if (imageBase64) {
      await saveScanImage(scanId, imageBase64);
    }

    const existingHistory = await getScanHistory();
    const updatedHistory = [scanResult, ...existingHistory];
    
    // Keep only last 50 scans
    const trimmedHistory = updatedHistory.slice(0, 50);
    
    // Delete images for scans that are being removed
    const removedScans = updatedHistory.slice(50);
    for (const scan of removedScans) {
      if (scan.imageKey) {
        await deleteScanImage(scan.id);
      }
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
};

export const getScanHistory = async (): Promise<ScanResult[]> => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedHistory = history ? JSON.parse(history) : [];
    console.log('Retrieved scan history:', parsedHistory.length, 'scans');
    return parsedHistory;
  } catch (error: any) {
    console.error('Error getting scan history:', error);
    
    // If it's a "Row too big" error, automatically clean up
    if (error.message && error.message.includes('Row too big')) {
      console.log('🔧 Detected corrupted storage, running emergency cleanup...');
      try {
        await emergencyClearAllScanData();
        console.log('✅ Emergency cleanup complete. Please restart the app.');
      } catch (cleanupError) {
        console.error('Failed to clean up:', cleanupError);
      }
    }
    
    return [];
  }
};

export const deleteScanResult = async (id: string): Promise<void> => {
  try {
    const history = await getScanHistory();
    const scanToDelete = history.find(scan => scan.id === id);
    
    // Delete associated image if exists
    if (scanToDelete?.imageKey) {
      await deleteScanImage(id);
    }
    
    const updatedHistory = history.filter((scan) => scan.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting scan result:', error);
    throw error;
  }
};

export const clearScanHistory = async (): Promise<void> => {
  try {
    // Get all scans to delete their images
    const history = await getScanHistory();
    
    // Delete all associated images
    for (const scan of history) {
      if (scan.imageKey) {
        await deleteScanImage(scan.id);
      }
    }
    
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing scan history:', error);
    throw error;
  }
};

/**
 * Emergency cleanup - removes all scan-related data from storage
 * Use this if storage is corrupted or too large
 */
export const emergencyClearAllScanData = async (): Promise<void> => {
  try {
    console.log('🚨 Emergency cleanup: Clearing all scan data...');
    const allKeys = await AsyncStorage.getAllKeys();
    const scanKeys = allKeys.filter(key => 
      key.startsWith('@safeorbit_scan') || key.startsWith('@safeorbit_image')
    );
    
    if (scanKeys.length > 0) {
      await AsyncStorage.multiRemove(scanKeys);
      console.log(`✅ Removed ${scanKeys.length} scan-related items`);
    } else {
      console.log('ℹ️ No scan data found to clear');
    }
  } catch (error) {
    console.error('Error during emergency cleanup:', error);
    throw error;
  }
};
