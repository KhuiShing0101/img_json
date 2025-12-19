// Image metadata from Canvas API
export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
}

// Color palette from Canvas API
export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
}

export interface ColorPalette {
  dominantColors: ColorInfo[];
}

// Image statistics from Canvas API
export interface ImageStats {
  averageBrightness: number;
  averageContrast: number;
  colorDistribution: {
    red: number;
    green: number;
    blue: number;
  };
}

// Gemini AI results
export interface OCRResult {
  text: string;
  confidence: number;
}

export interface ObjectDetection {
  label: string;
  confidence: number;
}

export interface UIElement {
  type: string;
  position: { x: number; y: number; width: number; height: number };
}

export interface DesignAnalysis {
  colorHarmony: string;
  typography: string;
  layout: string;
}

export interface GeminiAnalysis {
  ocr?: OCRResult[];
  objects?: ObjectDetection[];
  description?: string;
  uiElements?: UIElement[];
  designAnalysis?: DesignAnalysis;
}

// Final output JSON structure
export interface ImageAnalysisResult {
  timestamp: string;
  canvas: {
    metadata?: ImageMetadata;
    colors?: ColorPalette;
    base64?: string;
    statistics?: ImageStats;
  };
  ai?: GeminiAnalysis;
}

// Processing options (user toggles)
export interface ProcessingOptions {
  basicInfo: boolean;
  colors: boolean;
  base64: boolean;
  statistics: boolean;
  aiOcr: boolean;
  aiObjects: boolean;
  aiUI: boolean;
  aiDesign: boolean;
}
