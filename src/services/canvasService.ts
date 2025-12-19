import type { ImageMetadata, ColorPalette, ColorInfo, ImageStats } from '@/types';

/**
 * Extract basic metadata from an image file
 */
export function extractMetadata(file: File, img: HTMLImageElement): ImageMetadata {
  const aspectRatio = (img.width / img.height).toFixed(2);

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    dimensions: {
      width: img.width,
      height: img.height,
    },
    aspectRatio: `${aspectRatio}:1`,
  };
}

/**
 * Extract dominant colors from an image using color quantization
 */
export function extractColorPalette(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  numColors: number = 8
): ColorPalette {
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Sample pixels (every 10th pixel for performance)
  const sampledColors: number[][] = [];
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    sampledColors.push([r, g, b]);
  }

  // Use median cut algorithm for color quantization
  const palette = medianCut(sampledColors, numColors);

  // Calculate percentage for each color
  const totalPixels = sampledColors.length;
  const colorCounts = palette.map(color => {
    let count = 0;
    for (const pixel of sampledColors) {
      if (getColorDistance(pixel, color) < 50) {
        count++;
      }
    }
    return count;
  });

  const dominantColors: ColorInfo[] = palette.map((color, index) => ({
    hex: rgbToHex(color[0], color[1], color[2]),
    rgb: { r: color[0], g: color[1], b: color[2] },
    percentage: parseFloat(((colorCounts[index] / totalPixels) * 100).toFixed(2)),
  }));

  // Sort by percentage
  dominantColors.sort((a, b) => b.percentage - a.percentage);

  return { dominantColors };
}

/**
 * Median cut algorithm for color quantization
 */
function medianCut(colors: number[][], depth: number): number[][] {
  if (depth === 0 || colors.length <= 1) {
    // Return average color of the bucket
    const avg = [0, 0, 0];
    for (const color of colors) {
      avg[0] += color[0];
      avg[1] += color[1];
      avg[2] += color[2];
    }
    avg[0] = Math.round(avg[0] / colors.length);
    avg[1] = Math.round(avg[1] / colors.length);
    avg[2] = Math.round(avg[2] / colors.length);
    return [avg];
  }

  // Find the channel with the greatest range
  const ranges = [0, 1, 2].map(channel => {
    const values = colors.map(color => color[channel]);
    return Math.max(...values) - Math.min(...values);
  });

  const maxChannel = ranges.indexOf(Math.max(...ranges));

  // Sort by the channel with greatest range
  colors.sort((a, b) => a[maxChannel] - b[maxChannel]);

  // Split in half
  const mid = Math.floor(colors.length / 2);
  const left = colors.slice(0, mid);
  const right = colors.slice(mid);

  // Recursively split
  return [
    ...medianCut(left, depth - 1),
    ...medianCut(right, depth - 1),
  ];
}

/**
 * Calculate Euclidean distance between two colors
 */
function getColorDistance(color1: number[], color2: number[]): number {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Convert image to base64 data URL
 */
export function convertToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Calculate image statistics (brightness, contrast, color distribution)
 */
export function calculateImageStats(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): ImageStats {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let totalBrightness = 0;
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let pixelCount = 0;

  // Calculate averages
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Calculate brightness (perceived luminance)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;

    totalRed += r;
    totalGreen += g;
    totalBlue += b;
    pixelCount++;
  }

  const avgBrightness = totalBrightness / pixelCount;
  const avgRed = totalRed / pixelCount;
  const avgGreen = totalGreen / pixelCount;
  const avgBlue = totalBlue / pixelCount;

  // Calculate contrast (standard deviation of brightness)
  let varianceSum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 128) continue;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    varianceSum += Math.pow(brightness - avgBrightness, 2);
  }

  const contrast = Math.sqrt(varianceSum / pixelCount);

  return {
    averageBrightness: parseFloat(avgBrightness.toFixed(2)),
    averageContrast: parseFloat(contrast.toFixed(2)),
    colorDistribution: {
      red: parseFloat(avgRed.toFixed(2)),
      green: parseFloat(avgGreen.toFixed(2)),
      blue: parseFloat(avgBlue.toFixed(2)),
    },
  };
}

/**
 * Process image file with Canvas API
 */
export async function processImageWithCanvas(
  file: File,
  options: {
    extractMetadata?: boolean;
    extractColors?: boolean;
    convertBase64?: boolean;
    calculateStats?: boolean;
  }
): Promise<{
  metadata?: ImageMetadata;
  colors?: ColorPalette;
  base64?: string;
  statistics?: ImageStats;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      const result: any = {};

      // Extract requested data
      if (options.extractMetadata) {
        result.metadata = extractMetadata(file, img);
      }

      if (options.extractColors) {
        result.colors = extractColorPalette(canvas, ctx);
      }

      if (options.convertBase64) {
        result.base64 = convertToBase64(canvas);
      }

      if (options.calculateStats) {
        result.statistics = calculateImageStats(canvas, ctx);
      }

      resolve(result);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}
