import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ProcessingOptions } from '@/components/ProcessingOptions';
import { ImagePreview } from '@/components/ImagePreview';
import { JsonOutput } from '@/components/JsonOutput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { processImageWithCanvas } from '@/services/canvasService';
import { analyzeImageWithGemini } from '@/services/geminiService';
import type { ProcessingOptions as Options, ImageAnalysisResult } from '@/types';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<Options>({
    basicInfo: true,
    colors: true,
    base64: false,
    statistics: false,
    aiOcr: false,
    aiObjects: false,
    aiUI: false,
    aiDesign: false,
  });

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const analysisResult: ImageAnalysisResult = {
        timestamp: new Date().toISOString(),
        canvas: {},
      };

      // Process with Canvas API
      const canvasOptions = {
        extractMetadata: options.basicInfo,
        extractColors: options.colors,
        convertBase64: options.base64,
        calculateStats: options.statistics,
      };

      const canvasResult = await processImageWithCanvas(selectedFile, canvasOptions);
      analysisResult.canvas = canvasResult;

      // Process with Gemini AI if API key is provided and any AI option is selected
      const hasAiOptions = options.aiOcr || options.aiObjects || options.aiUI || options.aiDesign;

      if (apiKey && hasAiOptions) {
        try {
          const geminiResult = await analyzeImageWithGemini(selectedFile, apiKey, {
            extractOCR: options.aiOcr,
            detectObjects: options.aiObjects,
            analyzeUI: options.aiUI,
            analyzeDesign: options.aiDesign,
          });
          analysisResult.ai = geminiResult;
        } catch (aiError) {
          console.error('Gemini AI Error:', aiError);
          setError(
            aiError instanceof Error
              ? `AI Analysis failed: ${aiError.message}`
              : 'AI Analysis failed with unknown error'
          );
        }
      }

      setResult(analysisResult);
    } catch (err) {
      console.error('Processing Error:', err);
      setError(
        err instanceof Error
          ? `Processing failed: ${err.message}`
          : 'Processing failed with unknown error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isProcessing && <LoadingSpinner />}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🖼️ Image to JSON Converter
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract data using Canvas API + Gemini AI
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
            <ProcessingOptions
              options={options}
              onOptionsChange={setOptions}
              onProcess={handleProcess}
              hasImage={!!selectedFile}
              hasApiKey={!!apiKey}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Column */}
          <div>
            <ImagePreview imageUrl={imageUrl} fileName={selectedFile?.name} />
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <JsonOutput result={result} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Canvas API is 100% free • Gemini AI requires{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              API key
            </a>{' '}
            (free tier available)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
