import { ScanResult } from './storage';

export interface DashboardStats {
  totalScans: number;
  totalObjectsDetected: number;
  averageInferenceTime: number;
  objectCounts: Record<string, number>;
  averageConfidence: number;
  scansOverTime: { date: string; count: number }[];
  mostDetectedObjects: { name: string; count: number; percentage: number }[];
}

export const analyzeScanData = (scans: ScanResult[]): DashboardStats => {
  if (scans.length === 0) {
    return {
      totalScans: 0,
      totalObjectsDetected: 0,
      averageInferenceTime: 0,
      objectCounts: {},
      averageConfidence: 0,
      scansOverTime: [],
      mostDetectedObjects: [],
    };
  }

  // Calculate total objects detected
  let totalObjectsDetected = 0;
  let totalInferenceTime = 0;
  let totalConfidence = 0;
  let confidenceCount = 0;
  const objectCounts: Record<string, number> = {};

  scans.forEach((scan) => {
    totalObjectsDetected += scan.totalObjects;
    totalInferenceTime += scan.inferenceTime;

    scan.detections.forEach((detection) => {
      // Count objects by name
      if (objectCounts[detection.name]) {
        objectCounts[detection.name]++;
      } else {
        objectCounts[detection.name] = 1;
      }

      // Sum confidence
      totalConfidence += detection.confidence;
      confidenceCount++;
    });
  });

  // Calculate average inference time
  const averageInferenceTime = totalInferenceTime / scans.length;

  // Calculate average confidence
  const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

  // Get most detected objects
  const mostDetectedObjects = Object.entries(objectCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / totalObjectsDetected) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  // Scans over time (group by date)
  const scansOverTime = groupScansByDate(scans);

  return {
    totalScans: scans.length,
    totalObjectsDetected,
    averageInferenceTime,
    objectCounts,
    averageConfidence,
    scansOverTime,
    mostDetectedObjects,
  };
};

const groupScansByDate = (scans: ScanResult[]): { date: string; count: number }[] => {
  const dateMap: Record<string, number> = {};

  scans.forEach((scan) => {
    const date = new Date(scan.timestamp);
    const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (dateMap[dateKey]) {
      dateMap[dateKey]++;
    } else {
      dateMap[dateKey] = 1;
    }
  });

  return Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .slice(-7); // Last 7 dates
};

export const getCylinderStats = (scans: ScanResult[]) => {
  const cylinderTypes: Record<string, number> = {};
  let totalCylinders = 0;

  scans.forEach((scan) => {
    scan.detections.forEach((detection) => {
      const name = detection.name.toLowerCase();
      if (
        name.includes('tank') ||
        name.includes('cylinder') ||
        name.includes('oxygen') ||
        name.includes('nitrogen') ||
        name.includes('gas')
      ) {
        cylinderTypes[detection.name] = (cylinderTypes[detection.name] || 0) + 1;
        totalCylinders++;
      }
    });
  });

  return {
    totalCylinders,
    cylinderTypes,
    cylinderBreakdown: Object.entries(cylinderTypes).map(([name, count]) => ({
      name,
      count,
      percentage: (count / totalCylinders) * 100,
    })),
  };
};
