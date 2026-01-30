'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Loader2, AlertCircle, Upload, Mic } from 'lucide-react';
import { speechToText, getLanguages } from '@/lib/api';

export default function SpeechToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [languageCode, setLanguageCode] = useState('hi');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    getLanguages().then((list) => setLanguages(list)).catch(() => setLanguages([{ code: 'hi', name: 'Hindi' }, { code: 'en', name: 'English' }]));
  }, []);

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
      setError('Please select an audio file.');
      return;
    }
    setLoading(true);
    try {
      const data = await speechToText(file, languageCode);
      setResult(data.transcript);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Transcription failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Speech to Text</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Upload an audio file to get a transcript
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload audio</CardTitle>
              <CardDescription>Select language and upload a WAV or compatible audio file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={languageCode} onValueChange={setLanguageCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audio file</Label>
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/*,.wav,.webm,.ogg,.mp3"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {file ? file.name : 'Choose file'}
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={loading || !file}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Transcribe
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
                <CardTitle>Transcript</CardTitle>
                <CardDescription>Transcribed text</CardDescription>
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
