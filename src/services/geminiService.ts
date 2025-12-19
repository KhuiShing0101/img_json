import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiAnalysis, OCRResult, ObjectDetection } from '@/types';

/**
 * Analyze image using Gemini AI
 */
export async function analyzeImageWithGemini(
  file: File,
  apiKey: string,
  options: {
    extractOCR?: boolean;
    detectObjects?: boolean;
    analyzeUI?: boolean;
    analyzeDesign?: boolean;
  }
): Promise<GeminiAnalysis> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  // Convert file to base64
  const base64Data = await fileToBase64(file);

  const result: GeminiAnalysis = {};

  try {
    // OCR Text Extraction
    if (options.extractOCR) {
      const ocrPrompt = `Extract all readable text from this image. For each piece of text found, provide:
1. The actual text content
2. A confidence score (0-1)

Return the result as a JSON array with this structure:
[{"text": "...", "confidence": 0.95}, ...]

If no text is found, return an empty array.`;

      const ocrResult = await model.generateContent([
        ocrPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ]);

      const ocrText = ocrResult.response.text();
      result.ocr = parseJSONResponse<OCRResult[]>(ocrText, []);
    }

    // Object Detection
    if (options.detectObjects) {
      const objectPrompt = `Analyze this image and identify all objects, people, or items visible. For each object, provide:
1. A descriptive label
2. A confidence score (0-1)

Return the result as a JSON array with this structure:
[{"label": "person", "confidence": 0.98}, {"label": "laptop", "confidence": 0.95}, ...]

List the most prominent objects first.`;

      const objectResult = await model.generateContent([
        objectPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ]);

      const objectText = objectResult.response.text();
      result.objects = parseJSONResponse<ObjectDetection[]>(objectText, []);
    }

    // Generate overall description
    if (options.detectObjects || options.analyzeDesign) {
      const descPrompt = `Provide a detailed description of this image in 2-3 sentences. Focus on the main subject, composition, and overall visual characteristics.`;

      const descResult = await model.generateContent([
        descPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ]);

      result.description = descResult.response.text().trim();
    }

    // UI Element Analysis
    if (options.analyzeUI) {
      const uiPrompt = `Analyze this image as if it's a UI design or mockup. Identify all user interface elements such as:
- Buttons
- Input fields
- Navigation elements
- Cards/containers
- Icons
- Text labels

For each UI element, provide:
1. The type of element
2. Approximate position (as percentages of image dimensions)

Return as JSON array:
[{"type": "button", "position": {"x": 10, "y": 20, "width": 100, "height": 40}}, ...]

If this is not a UI/mockup image, return an empty array.`;

      const uiResult = await model.generateContent([
        uiPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ]);

      const uiText = uiResult.response.text();
      result.uiElements = parseJSONResponse(uiText, []);
    }

    // Design Analysis
    if (options.analyzeDesign) {
      const designPrompt = `Analyze the design aspects of this image:
1. Color harmony - describe the color scheme and palette
2. Typography - describe font styles, sizes, hierarchy (if text is present)
3. Layout - describe the visual composition and structure

Return as JSON with this structure:
{
  "colorHarmony": "description of color scheme...",
  "typography": "description of typography...",
  "layout": "description of layout..."
}`;

      const designResult = await model.generateContent([
        designPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ]);

      const designText = designResult.response.text();
      result.designAnalysis = parseJSONResponse(designText, {
        colorHarmony: 'N/A',
        typography: 'N/A',
        layout: 'N/A',
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(
      `Failed to analyze image with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Convert File to base64 string (without data URL prefix)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Parse JSON response from Gemini, handling markdown code blocks
 */
function parseJSONResponse<T>(text: string, fallback: T): T {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('Failed to parse JSON response:', text);
    return fallback;
  }
}

/**
 * Validate Gemini API key format
 */
export function validateApiKey(apiKey: string): boolean {
  // Basic validation - Gemini API keys typically start with "AI" and are ~40 chars
  return apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
}
