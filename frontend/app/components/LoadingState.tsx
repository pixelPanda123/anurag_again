'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingState({
  message = 'Processing your document...',
  subMessage = 'This may take a moment',
}: LoadingStateProps) {
  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
              {message}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {subMessage}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
