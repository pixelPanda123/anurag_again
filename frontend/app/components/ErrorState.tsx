'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({ error, onRetry, title = 'Error Processing Document' }: ErrorStateProps) {
  let message = 'An unexpected error occurred';

  if (typeof error === 'string') {
    message = error;
  } else if ('message' in error) {
    message = error.message;
  }

  return (
    <Card className="h-full flex items-center justify-center border-red-200 dark:border-red-800">
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
              {title}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-200 mb-4">
              {message}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="gap-2 mt-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
