/**
 * Object Priority and Color Configuration
 * Defines priority levels and colors for different detected objects
 */

export interface ObjectConfig {
  priority: number; // Lower number = higher priority (1 is highest)
  color: string;
  category: 'critical' | 'important' | 'standard';
  displayName?: string;
}

export const OBJECT_PRIORITIES: Record<string, ObjectConfig> = {
  // Critical Safety Equipment (Priority 1-3)
  'FirstAidKit': {
    priority: 1,
    color: '#10b981', // Green
    category: 'critical',
    displayName: 'First Aid Kit',
  },
  'first aid kit': {
    priority: 1,
    color: '#10b981',
    category: 'critical',
    displayName: 'First Aid Kit',
  },
  'FireExtinguisher': {
    priority: 2,
    color: '#ef4444', // Red
    category: 'critical',
    displayName: 'Fire Extinguisher',
  },
  'fire extinguisher': {
    priority: 2,
    color: '#ef4444',
    category: 'critical',
    displayName: 'Fire Extinguisher',
  },
  'EmergencyKit': {
    priority: 3,
    color: '#f59e0b', // Amber
    category: 'critical',
    displayName: 'Emergency Kit',
  },

  // Important Gas Cylinders (Priority 4-6)
  'OxygenTank': {
    priority: 4,
    color: '#3b82f6', // Blue
    category: 'important',
    displayName: 'Oxygen Tank',
  },
  'oxygen tank': {
    priority: 4,
    color: '#3b82f6',
    category: 'important',
    displayName: 'Oxygen Tank',
  },
  'NitrogenTank': {
    priority: 5,
    color: '#8b5cf6', // Purple
    category: 'important',
    displayName: 'Nitrogen Tank',
  },
  'nitrogen tank': {
    priority: 5,
    color: '#8b5cf6',
    category: 'important',
    displayName: 'Nitrogen Tank',
  },
  'GasCylinder': {
    priority: 6,
    color: '#6366f1', // Indigo
    category: 'important',
    displayName: 'Gas Cylinder',
  },

  // Standard Equipment (Priority 7+)
  'Tool': {
    priority: 7,
    color: '#64748b', // Slate
    category: 'standard',
    displayName: 'Tool',
  },
  'Equipment': {
    priority: 8,
    color: '#94a3b8', // Light Slate
    category: 'standard',
    displayName: 'Equipment',
  },
};

/**
 * Get configuration for an object by name
 * Returns default config if object is not in priority list
 */
export const getObjectConfig = (objectName: string): ObjectConfig => {
  // Try exact match first
  if (OBJECT_PRIORITIES[objectName]) {
    return OBJECT_PRIORITIES[objectName];
  }

  // Try case-insensitive match
  const lowerName = objectName.toLowerCase();
  const matchedKey = Object.keys(OBJECT_PRIORITIES).find(
    (key) => key.toLowerCase() === lowerName
  );

  if (matchedKey) {
    return OBJECT_PRIORITIES[matchedKey];
  }

  // Default config for unknown objects
  return {
    priority: 99,
    color: '#ffffff', // White
    category: 'standard',
    displayName: objectName,
  };
};

/**
 * Sort detections by priority
 */
export const sortByPriority = <T extends { name: string }>(detections: T[]): T[] => {
  return [...detections].sort((a, b) => {
    const configA = getObjectConfig(a.name);
    const configB = getObjectConfig(b.name);
    return configA.priority - configB.priority;
  });
};

/**
 * Get category badge color
 */
export const getCategoryColor = (category: 'critical' | 'important' | 'standard'): string => {
  switch (category) {
    case 'critical':
      return '#dc2626'; // Red-600
    case 'important':
      return '#f59e0b'; // Amber-500
    case 'standard':
      return '#6b7280'; // Gray-500
  }
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority: number): string => {
  if (priority <= 3) return 'CRITICAL';
  if (priority <= 6) return 'IMPORTANT';
  return 'STANDARD';
};
