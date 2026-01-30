'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

const MAX_TEXT_LENGTH = 5000;

interface TextInputPanelProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export default function TextInputPanel({ onSubmit, isLoading = false }: TextInputPanelProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Text must be less than ${MAX_TEXT_LENGTH} characters`);
      return;
    }

    onSubmit(text);
  };

  const charCount = text.length;
  const charPercentage = (charCount / MAX_TEXT_LENGTH) * 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Paste Text</CardTitle>
        <CardDescription>
          Paste government notices, medical reports, or any formal document text
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex-grow">
          <Textarea
            placeholder="Paste your document text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            className="h-64 resize-none font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>{charCount} characters</span>
            <span>{MAX_TEXT_LENGTH - charCount} remaining</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                charPercentage > 80 ? 'bg-red-500' : charPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(charPercentage, 100)}%` }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !text.trim()}
          size="lg"
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Process Text'}
        </Button>
      </CardContent>
    </Card>
  );
}
