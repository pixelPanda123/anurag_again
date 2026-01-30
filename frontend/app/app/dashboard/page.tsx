'use client';

import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import DocumentUploader from '@/app/components/DocumentUploader';
import TextInputPanel from '@/app/components/TextInputPanel';
import AudioRecorder from '@/app/components/AudioRecorder';
import OutputPanel from '@/app/components/OutputPanel';
import ChatPanel from '@/app/components/ChatPanel';
import LoadingState from '@/app/components/LoadingState';
import ErrorState from '@/app/components/ErrorState';
import { useApp } from '@/lib/contexts/app-context';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import type { ProcessedDocument } from '@/lib/contexts/app-context';

export default function DashboardPage() {
  const { currentDocument, addDocument, language, domain, demoMode } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleDocumentProcess = async (text: string, source: 'file' | 'text' | 'voice') => {
    setError(null);
    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (demoMode) {
        // Demo mode: generate mock results
        const mockDocument: ProcessedDocument = {
          id: `doc-${Date.now()}`,
          originalText: text,
          translatedText: `[Translated to ${language}] ${text.slice(0, 100)}...`,
          simplifiedText: `[Simplified] This document contains important information. Key points: 1) First point 2) Second point 3) Third point.`,
          audioUrl: undefined,
          language,
          domain,
          timestamp: new Date(),
        };
        addDocument(mockDocument);
        toast.success('Document processed successfully!');
      } else {
        // Real API call would go here
        toast.info('API integration coming soon');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process document';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    // Simulate reading file and extracting text
    const reader = new FileReader();
    reader.onload = async () => {
      const text = `Document: ${file.name}\n\nContent extracted from document...`;
      await handleDocumentProcess(text, 'file');
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = (text: string) => {
    handleDocumentProcess(text, 'text');
  };

  const handleAudioTranscribe = (audioBlob: Blob) => {
    const text = `[Audio transcribed from recording]`;
    handleDocumentProcess(text, 'voice');
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Controls - Desktop Only */}
      <div className="hidden md:block px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Document Processing
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Upload, translate, and simplify your documents
            </p>
          </div>
          {currentDocument && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isProcessing}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Process New
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upload" className="text-xs sm:text-sm">
                Upload
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs sm:text-sm">
                Text
              </TabsTrigger>
              <TabsTrigger value="voice" className="text-xs sm:text-sm">
                Voice
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="upload" className="mt-0">
                <DocumentUploader
                  onFileSelected={handleFileUpload}
                  isLoading={isProcessing}
                />
              </TabsContent>

              <TabsContent value="text" className="mt-0">
                <TextInputPanel
                  onSubmit={handleTextSubmit}
                  isLoading={isProcessing}
                />
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <AudioRecorder
                  onTranscribe={handleAudioTranscribe}
                  isLoading={isProcessing}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center & Right: Output + Chat */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Output Panel */}
          {isProcessing ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={handleRetry} />
          ) : currentDocument ? (
            <>
              <OutputPanel document={currentDocument} />
              {/* Chat Panel */}
              <ChatPanel document={currentDocument} />
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📄</div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  No Document Selected
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload, paste text, or record audio to get started
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
