import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { ProcessingOptions as Options } from '@/types';

interface ProcessingOptionsProps {
  options: Options;
  onOptionsChange: (options: Options) => void;
  onProcess: () => void;
  hasImage: boolean;
  hasApiKey: boolean;
  isProcessing: boolean;
}

export function ProcessingOptions({
  options,
  onOptionsChange,
  onProcess,
  hasImage,
  hasApiKey,
  isProcessing,
}: ProcessingOptionsProps) {
  const handleOptionChange = (key: keyof Options, value: boolean) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Extraction Options</h3>

        {/* Canvas API Options */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Canvas API (Free)</p>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="basicInfo"
              checked={options.basicInfo}
              onCheckedChange={(checked) => handleOptionChange('basicInfo', !!checked)}
            />
            <Label
              htmlFor="basicInfo"
              className="text-sm font-normal cursor-pointer flex-1"
            >
              Basic Info (dimensions, format, size)
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="colors"
              checked={options.colors}
              onCheckedChange={(checked) => handleOptionChange('colors', !!checked)}
            />
            <Label
              htmlFor="colors"
              className="text-sm font-normal cursor-pointer flex-1"
            >
              Color Palette (dominant colors)
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="base64"
              checked={options.base64}
              onCheckedChange={(checked) => handleOptionChange('base64', !!checked)}
            />
            <Label
              htmlFor="base64"
              className="text-sm font-normal cursor-pointer flex-1"
            >
              Base64 Encoding
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="statistics"
              checked={options.statistics}
              onCheckedChange={(checked) => handleOptionChange('statistics', !!checked)}
            />
            <Label
              htmlFor="statistics"
              className="text-sm font-normal cursor-pointer flex-1"
            >
              Image Statistics (brightness, contrast)
            </Label>
          </div>
        </div>

        {/* Gemini AI Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Gemini AI {!hasApiKey && '(requires API key)'}
          </p>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="aiOcr"
              checked={options.aiOcr}
              onCheckedChange={(checked) => handleOptionChange('aiOcr', !!checked)}
              disabled={!hasApiKey}
            />
            <Label
              htmlFor="aiOcr"
              className={`text-sm font-normal cursor-pointer flex-1 ${
                !hasApiKey ? 'opacity-50' : ''
              }`}
            >
              OCR Text Extraction
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="aiObjects"
              checked={options.aiObjects}
              onCheckedChange={(checked) => handleOptionChange('aiObjects', !!checked)}
              disabled={!hasApiKey}
            />
            <Label
              htmlFor="aiObjects"
              className={`text-sm font-normal cursor-pointer flex-1 ${
                !hasApiKey ? 'opacity-50' : ''
              }`}
            >
              Object Detection
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="aiUI"
              checked={options.aiUI}
              onCheckedChange={(checked) => handleOptionChange('aiUI', !!checked)}
              disabled={!hasApiKey}
            />
            <Label
              htmlFor="aiUI"
              className={`text-sm font-normal cursor-pointer flex-1 ${
                !hasApiKey ? 'opacity-50' : ''
              }`}
            >
              UI Element Analysis
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
              id="aiDesign"
              checked={options.aiDesign}
              onCheckedChange={(checked) => handleOptionChange('aiDesign', !!checked)}
              disabled={!hasApiKey}
            />
            <Label
              htmlFor="aiDesign"
              className={`text-sm font-normal cursor-pointer flex-1 ${
                !hasApiKey ? 'opacity-50' : ''
              }`}
            >
              Design Analysis
            </Label>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <Button
        onClick={onProcess}
        disabled={!hasImage || isProcessing}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        size="lg"
      >
        {isProcessing ? 'Processing...' : 'Process Image'}
      </Button>
    </Card>
  );
}
