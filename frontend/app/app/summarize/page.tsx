'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { summarize } from '@/lib/api';

export default function SummarizePage() {
  const [text, setText] = useState('');
  const [audience, setAudience] = useState('student');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!text.trim()) {
      setError('Please enter text to summarize.');
      return;
    }
    setLoading(true);
    try {
      const data = await summarize(text, audience);
      setResult(data.summary);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Summarization failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Summarize</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Get a concise summary of your text
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Enter text and optional audience for the summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <select
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Text</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to summarize..."
                  rows={6}
                  className="resize-none"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Summarizing...
                  </>
                ) : (
                  'Summarize'
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
                <CardTitle>Summary</CardTitle>
                <CardDescription>Generated summary</CardDescription>
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
