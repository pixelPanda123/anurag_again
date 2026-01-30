'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Loader2, AlertCircle, Upload, ImageIcon } from 'lucide-react';
import { imageToText } from '@/lib/api';

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError('Please select an image file.');
      return;
    }
    setLoading(true);
    try {
      const data = await imageToText(file);
      setResult(data.text);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'OCR failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Image to Text</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Upload an image to extract text (OCR)
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload image</CardTitle>
              <CardDescription>JPEG, PNG, WebP or TIFF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Image file</Label>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/tiff"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4" />
                  {file ? file.name : 'Choose image'}
                </Button>
              </div>
              <Button type="submit" disabled={loading || !file}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Extracting text...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Extract text
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted text</CardTitle>
                <CardDescription>Text from image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 whitespace-pre-wrap text-sm">
                  {result}
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
