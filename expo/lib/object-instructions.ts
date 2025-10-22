/**
 * Object Usage Instructions
 * Provides step-by-step guides on how to use detected safety equipment
 */

export interface InstructionStep {
  step: number;
  title: string;
  description: string;
  warning?: string;
}

export interface ObjectInstructions {
  objectName: string;
  displayName: string;
  overview: string;
  steps: InstructionStep[];
  warnings: string[];
  emergencyContact?: string;
}

export const OBJECT_INSTRUCTIONS: Record<string, ObjectInstructions> = {
  'FirstAidKit': {
    objectName: 'FirstAidKit',
    displayName: 'First Aid Kit',
    overview: 'A first aid kit contains essential medical supplies for treating minor injuries and providing initial care in emergencies.',
    steps: [
      {
        step: 1,
        title: 'Assess the Situation',
        description: 'Ensure the area is safe for you and the injured person. Check for any ongoing dangers before approaching.'
      },
      {
        step: 2,
        title: 'Check the Person',
        description: 'Assess the injured person\'s condition. Check for consciousness, breathing, and visible injuries.',
        warning: 'If the person is unconscious or not breathing, call emergency services immediately.'
      },
      {
        step: 3,
        title: 'Open the Kit',
        description: 'Locate and open the first aid kit. Familiarize yourself with its contents if you haven\'t already.'
      },
      {
        step: 4,
        title: 'Use Appropriate Supplies',
        description: 'Select the appropriate items based on the injury:\n• Bandages for wounds\n• Antiseptic wipes for cleaning\n• Gauze for bleeding\n• Ice pack for swelling\n• Pain relievers for pain management'
      },
      {
        step: 5,
        title: 'Apply Treatment',
        description: 'Clean wounds with antiseptic, apply pressure to stop bleeding, and cover with appropriate bandages.'
      },
      {
        step: 6,
        title: 'Monitor the Person',
        description: 'Continue to monitor the injured person\'s condition. Seek professional medical help if needed.'
      }
    ],
    warnings: [
      'Always call emergency services (911/112) for serious injuries',
      'Wear gloves when treating wounds to prevent infection',
      'Never move a person with suspected spinal injuries',
      'Check expiration dates on medications and supplies',
      'Restock the kit after use'
    ],
    emergencyContact: '911 or your local emergency number'
  },
  
  'FireExtinguisher': {
    objectName: 'FireExtinguisher',
    displayName: 'Fire Extinguisher',
    overview: 'A fire extinguisher is a critical safety device used to control or extinguish small fires in emergency situations.',
    steps: [
      {
        step: 1,
        title: 'Alert Others',
        description: 'Activate the fire alarm and notify others in the building. Ensure everyone is evacuating safely.'
      },
      {
        step: 2,
        title: 'Assess the Fire',
        description: 'Only attempt to fight the fire if:\n• It\'s small and contained\n• You have a clear escape route\n• You know how to use the extinguisher\n• The fire department has been called',
        warning: 'If the fire is large, spreading, or you feel unsafe, evacuate immediately!'
      },
      {
        step: 3,
        title: 'Remove the Pin (P.A.S.S. Technique)',
        description: 'Pull the safety pin at the top of the extinguisher. This breaks the tamper seal.'
      },
      {
        step: 4,
        title: 'Aim at the Base',
        description: 'Aim the nozzle at the BASE of the fire, not at the flames. Stand 6-8 feet away from the fire.'
      },
      {
        step: 5,
        title: 'Squeeze the Handle',
        description: 'Squeeze the handle to release the extinguishing agent. Use firm, steady pressure.'
      },
      {
        step: 6,
        title: 'Sweep Side to Side',
        description: 'Sweep the nozzle from side to side at the base of the fire until it appears to be out. Move slowly forward as the fire diminishes.'
      },
      {
        step: 7,
        title: 'Watch for Re-ignition',
        description: 'Keep watching the area. If the fire re-ignites, repeat the process. If the extinguisher empties, evacuate immediately.'
      }
    ],
    warnings: [
      'Never turn your back on a fire, even if it appears to be out',
      'Always have a clear escape route behind you',
      'If the fire grows or you feel unsafe, evacuate immediately',
      'Call the fire department even if you put out the fire',
      'Check extinguisher pressure gauge regularly (should be in green zone)',
      'Different extinguisher types for different fires (A, B, C, D, K)',
      'Never use water on electrical or grease fires'
    ],
    emergencyContact: '911 (Fire Department)'
  },
  
  'EmergencyKit': {
    objectName: 'EmergencyKit',
    displayName: 'Emergency Kit',
    overview: 'An emergency kit contains essential supplies for survival during disasters or emergencies when normal services are disrupted.',
    steps: [
      {
        step: 1,
        title: 'Identify the Emergency',
        description: 'Determine the type of emergency (natural disaster, power outage, evacuation, etc.) and assess immediate threats.'
      },
      {
        step: 2,
        title: 'Locate Your Kit',
        description: 'Retrieve your emergency kit from its designated storage location. Keep it easily accessible.'
      },
      {
        step: 3,
        title: 'Assess Your Needs',
        description: 'Check what supplies you need based on the situation:\n• Water and food\n• Light sources\n• Communication devices\n• First aid supplies\n• Shelter materials'
      },
      {
        step: 4,
        title: 'Use Supplies Wisely',
        description: 'Ration supplies if necessary. Prioritize water (1 gallon per person per day), food, and shelter.'
      },
      {
        step: 5,
        title: 'Stay Informed',
        description: 'Use battery-powered radio or phone to monitor emergency broadcasts and instructions from authorities.'
      },
      {
        step: 6,
        title: 'Follow Emergency Plan',
        description: 'Execute your family emergency plan. Communicate with family members and stay together if possible.'
      }
    ],
    warnings: [
      'Keep emergency kit in accessible location',
      'Check and rotate supplies every 6 months',
      'Ensure batteries are fresh',
      'Include important documents in waterproof container',
      'Have emergency contact list readily available',
      'Customize kit for family needs (medications, baby supplies, pet needs)'
    ],
    emergencyContact: '911 or local emergency management'
  },
  
  'OxygenTank': {
    objectName: 'OxygenTank',
    displayName: 'Oxygen Tank',
    overview: 'Oxygen tanks provide supplemental oxygen for medical purposes or emergency situations. Proper handling is critical for safety.',
    steps: [
      {
        step: 1,
        title: 'Check the Tank',
        description: 'Inspect the tank for damage, check pressure gauge, and ensure regulator is properly attached.',
        warning: 'Never use damaged tanks or tanks with leaking valves.'
      },
      {
        step: 2,
        title: 'Position Safely',
        description: 'Secure the tank upright in a stand or cart. Never leave standing unsecured as it could fall and rupture.'
      },
      {
        step: 3,
        title: 'Open Valve Slowly',
        description: 'Turn the valve counterclockwise slowly. Never open quickly as this can damage equipment.'
      },
      {
        step: 4,
        title: 'Set Flow Rate',
        description: 'Adjust the regulator to the prescribed flow rate (measured in liters per minute). Follow medical provider\'s instructions.'
      },
      {
        step: 5,
        title: 'Connect Delivery Device',
        description: 'Attach nasal cannula, mask, or other delivery device as prescribed. Ensure proper fit.'
      },
      {
        step: 6,
        title: 'Monitor Usage',
        description: 'Regularly check pressure gauge to monitor remaining oxygen. Plan for tank changes before empty.'
      }
    ],
    warnings: [
      'Keep oxygen tanks away from flames, sparks, and heat sources (minimum 5 feet)',
      'No smoking within 10 feet of oxygen equipment',
      'Store tanks in well-ventilated areas',
      'Never use oil or grease on oxygen equipment',
      'Secure tanks to prevent falling',
      'Only use with prescribed flow rates',
      'Keep backup tanks available',
      'Never adjust pressure regulator without proper training'
    ],
    emergencyContact: 'Medical provider or 911 for medical emergencies'
  },
  
  'NitrogenTank': {
    objectName: 'NitrogenTank',
    displayName: 'Nitrogen Tank',
    overview: 'Nitrogen tanks contain compressed nitrogen gas used for various industrial and laboratory applications. Proper handling prevents asphyxiation and pressure hazards.',
    steps: [
      {
        step: 1,
        title: 'Inspect the Tank',
        description: 'Check for damage, leaks, and proper labeling. Verify it\'s the correct gas using the label and color code.',
        warning: 'Never use unlabeled or damaged tanks.'
      },
      {
        step: 2,
        title: 'Ensure Ventilation',
        description: 'Work only in well-ventilated areas. Nitrogen displaces oxygen and can cause asphyxiation in enclosed spaces.'
      },
      {
        step: 3,
        title: 'Secure the Tank',
        description: 'Secure tank upright using chains or straps. Never leave standing unsecured.'
      },
      {
        step: 4,
        title: 'Attach Regulator',
        description: 'Install the appropriate pressure regulator. Ensure connections are tight and leak-free.'
      },
      {
        step: 5,
        title: 'Open Valve Slowly',
        description: 'Stand to the side and slowly open the cylinder valve. Never stand in front of the regulator.'
      },
      {
        step: 6,
        title: 'Set Working Pressure',
        description: 'Adjust regulator to required working pressure for your application. Monitor pressure gauges.'
      },
      {
        step: 7,
        title: 'Close When Done',
        description: 'Close cylinder valve when finished. Bleed pressure from regulator. Mark empty cylinders clearly.'
      }
    ],
    warnings: [
      'ASPHYXIATION HAZARD: Nitrogen displaces oxygen - use only in ventilated areas',
      'Never enter confined spaces with nitrogen gas',
      'Wear appropriate PPE (safety glasses, gloves)',
      'Keep away from heat sources',
      'Never tamper with pressure relief devices',
      'Rapid decompression can cause frostbite',
      'Use oxygen monitors in enclosed areas',
      'Only trained personnel should handle compressed gases'
    ],
    emergencyContact: 'Safety officer or 911 for medical emergencies'
  },
  
  'GasCylinder': {
    objectName: 'GasCylinder',
    displayName: 'Gas Cylinder',
    overview: 'Gas cylinders contain compressed or liquefied gases under high pressure. Safe handling requires proper training and procedures.',
    steps: [
      {
        step: 1,
        title: 'Identify the Gas',
        description: 'Read the cylinder label to identify contents. Never assume contents based on color alone.'
      },
      {
        step: 2,
        title: 'Inspect for Safety',
        description: 'Check for damage, corrosion, leaks, and current inspection dates. Do not use if expired or damaged.'
      },
      {
        step: 3,
        title: 'Transport Safely',
        description: 'Use appropriate cart or trolley. Never roll or drag cylinders. Always secure with valve protection cap on.'
      },
      {
        step: 4,
        title: 'Secure in Place',
        description: 'Chain or strap cylinder upright to fixed structure. Keep valve accessible.'
      },
      {
        step: 5,
        title: 'Connect Equipment',
        description: 'Use correct regulator for gas type. Check connections for leaks using soap solution, never flame.'
      },
      {
        step: 6,
        title: 'Open Valve Carefully',
        description: 'Stand to side of regulator. Open valve slowly. Adjust pressure as needed for application.'
      },
      {
        step: 7,
        title: 'Proper Storage',
        description: 'Store in upright position, secured, in well-ventilated area. Separate full and empty cylinders.'
      }
    ],
    warnings: [
      'Always handle cylinders as if they are full',
      'Never expose to temperatures above 125°F (52°C)',
      'Keep away from electrical circuits',
      'Never use cylinders as rollers or supports',
      'Do not mix gases in cylinders',
      'Use correct regulator for specific gas',
      'Ensure proper ventilation',
      'Know emergency procedures for specific gas type'
    ],
    emergencyContact: 'Safety officer or 911'
  }
};

/**
 * Get instructions for a specific object
 */
export function getObjectInstructions(objectName: string): ObjectInstructions | null {
  // Normalize the name (remove spaces, convert to lowercase)
  const normalizedName = objectName.replace(/\s+/g, '').toLowerCase();
  
  // Find matching instructions
  for (const [key, instructions] of Object.entries(OBJECT_INSTRUCTIONS)) {
    if (key.toLowerCase() === normalizedName) {
      return instructions;
    }
  }
  
  return null;
}

/**
 * Check if instructions exist for an object
 */
export function hasInstructions(objectName: string): boolean {
  return getObjectInstructions(objectName) !== null;
}
