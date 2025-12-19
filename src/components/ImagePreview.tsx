import { Card } from '@/components/ui/card';

interface ImagePreviewProps {
  imageUrl: string | null;
  fileName?: string;
}

export function ImagePreview({ imageUrl, fileName }: ImagePreviewProps) {
  return (
    <Card className="p-6">
      <div className="w-full min-h-[400px] bg-background rounded-lg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <div className="flex flex-col items-center w-full">
            <img
              src={imageUrl}
              alt={fileName || 'Uploaded image'}
              className="max-w-full max-h-[500px] object-contain"
            />
            {fileName && (
              <p className="mt-4 text-sm text-muted-foreground">{fileName}</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No image selected</p>
        )}
      </div>
    </Card>
  );
}
