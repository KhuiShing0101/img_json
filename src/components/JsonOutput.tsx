import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import type { ImageAnalysisResult } from '@/types';

interface JsonOutputProps {
  result: ImageAnalysisResult | null;
}

export function JsonOutput({ result }: JsonOutputProps) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return null;
  }

  const jsonString = JSON.stringify(result, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">JSON Output</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="relative">
        <pre className="bg-background p-4 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto text-sm font-mono text-cyan-300">
          {jsonString}
        </pre>
      </div>
    </Card>
  );
}
