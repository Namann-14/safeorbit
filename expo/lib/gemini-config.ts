// Gemini API Configuration
// Get your API key from: https://makersuite.google.com/app/apikey

export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyBSOEWj4IUs3E5Icpndmw9dIa2-Rp9V8GE', // Replace with your actual API key
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  MODEL: 'gemini-2.0-flash-exp',
};

export interface GeminiDetection {
  name: string;
  confidence: number;
  description: string;
  safety_level?: 'critical' | 'important' | 'standard';
  recommendations?: string[];
}

export interface GeminiAnalysisResponse {
  detections: GeminiDetection[];
  analysis_time: number;
  overall_assessment: string;
  safety_score?: number;
}

/**
 * Analyzes an image using Google Gemini API
 * @param base64Image - Base64 encoded image string
 * @returns Gemini analysis response
 */
export async function analyzeImageWithGemini(
  base64Image: string
): Promise<GeminiAnalysisResponse> {
  const startTime = Date.now();

  try {
    const response = await fetch(
      `${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this image for safety equipment and objects. Identify any of the following objects if present:
- First Aid Kit
- Fire Extinguisher
- Emergency Kit
- Oxygen Tank (O2 cylinder)
- Nitrogen Tank (N2 cylinder)
- Gas Cylinder
- Safety Equipment
- Tools

For each object detected, provide:
1. Object name
2. Confidence level (0-1)
3. Brief description of what you see
4. Safety level (critical/important/standard)
5. Key safety recommendations

Also provide an overall safety assessment of the scene.

Respond in JSON format:
{
  "detections": [
    {
      "name": "First Aid Kit",
      "confidence": 0.95,
      "description": "Red and white first aid kit visible in the image",
      "safety_level": "critical",
      "recommendations": ["Ensure kit is fully stocked", "Check expiration dates monthly"]
    }
  ],
  "overall_assessment": "Brief safety assessment of the scene",
  "safety_score": 85
}`,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API error: ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();
    const analysisTime = Date.now() - startTime;

    // Parse the response
    const textContent =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Extract JSON from markdown code blocks if present
    let jsonText = textContent;
    const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object in the text
      const jsonObjectMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonText = jsonObjectMatch[0];
      }
    }

    const parsedResponse = JSON.parse(jsonText);

    return {
      detections: parsedResponse.detections || [],
      analysis_time: analysisTime,
      overall_assessment: parsedResponse.overall_assessment || 'No assessment available',
      safety_score: parsedResponse.safety_score || 0,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Checks if Gemini API key is configured
 * @returns true if API key is set
 */
export function isGeminiConfigured(): boolean {
  return GEMINI_CONFIG.API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && 
         GEMINI_CONFIG.API_KEY.length > 0;
}
