import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Processing image...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
