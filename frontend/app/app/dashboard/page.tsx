'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';
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
import type { DomainType } from '@/lib/types';
import * as api from '@/lib/api';

export default function DashboardPage() {
  const { currentDocument, addDocument, language, domain } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const toProcessedDocument = (result: { originalText: string; translatedText: string; simplifiedText: string; audioUrl?: string }): ProcessedDocument => ({
    id: `doc-${Date.now()}`,
    ...result,
    language,
    domain,
    timestamp: new Date(),
  });

  const handleDocumentProcess = async (text: string) => {
    setError(null);
    setIsProcessing(true);
    try {
      const result = await api.processDocument(text, language, domain as DomainType);
      addDocument(toProcessedDocument(result));
      toast.success('Document processed successfully!');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to process document';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    try {
      const { extractedText } = await api.extractTextFromImage(file, domain as DomainType);
      const result = await api.processDocument(extractedText, language, domain as DomainType);
      addDocument(toProcessedDocument(result));
      toast.success('Document processed successfully!');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to process document';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (text: string) => {
    handleDocumentProcess(text);
  };

  const handleAudioTranscribe = async (audioBlob: Blob) => {
    setError(null);
    setIsProcessing(true);
    try {
      const { text } = await api.transcribeAudio(audioBlob, language, domain as DomainType);
      const result = await api.processDocument(text, language, domain as DomainType);
      addDocument(toProcessedDocument(result));
      toast.success('Document processed successfully!');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to process document';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
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
