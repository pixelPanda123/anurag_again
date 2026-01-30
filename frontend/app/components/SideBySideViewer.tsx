'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import type { ProcessingResult } from '@/lib/types';

interface SideBySideViewerProps {
  result: ProcessingResult;
}

export default function SideBySideViewer({ result }: SideBySideViewerProps) {
  const [copied, setCopied] = useState<'original' | 'simplified' | null>(null);

  const copyToClipboard = (text: string, type: 'original' | 'simplified') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadText = (content: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Comparison View</CardTitle>
        <CardDescription>
          Side-by-side comparison of original and simplified text
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Original Text */}
          <div className="flex flex-col gap-3 border border-slate-200 rounded-lg p-4 bg-slate-50 overflow-hidden">
            <h3 className="font-semibold text-slate-900">Original Text</h3>
            <div className="flex-grow overflow-y-auto">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result.originalText}
              </p>
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.originalText, 'original')}
                className="gap-2"
              >
                {copied === 'original' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(result.originalText, 'original.txt')}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Simplified Text */}
          <div className="flex flex-col gap-3 border border-green-200 rounded-lg p-4 bg-green-50 overflow-hidden">
            <h3 className="font-semibold text-slate-900">Simplified Text</h3>
            <div className="flex-grow overflow-y-auto">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                {result.simplifiedText}
              </p>
            </div>
            <div className="flex gap-2 pt-4 border-t border-green-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.simplifiedText, 'simplified')}
                className="gap-2"
              >
                {copied === 'simplified' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(result.simplifiedText, 'simplified.txt')}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
