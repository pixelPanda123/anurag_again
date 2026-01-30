'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import DocumentUploader from '@/app/components/DocumentUploader';
import TextInputPanel from '@/app/components/TextInputPanel';
import AudioRecorder from '@/app/components/AudioRecorder';
import LanguageSelector from '@/app/components/LanguageSelector';
import DomainSelector from '@/app/components/DomainSelector';
import OutputPanel from '@/app/components/OutputPanel';
import SideBySideViewer from '@/app/components/SideBySideViewer';
import ChatPanel from '@/app/components/ChatPanel';
import ErrorState from '@/app/components/ErrorState';
import LoadingState from '@/app/components/LoadingState';
import { Button } from '@/app/components/ui/button';
import type { DomainType, ProcessingResult, ApiError } from '@/lib/types';
import { DEMO_MODE, DEMO_EXTRACTION, DEMO_TRANSLATION, DEMO_SIMPLIFICATION } from '@/lib/constants';
import * as api from '@/lib/api';

interface DashboardProps {
  onNavigateToLanding: () => void;
  onNavigateToHistory?: () => void;
}

type ViewMode = 'output' | 'comparison' | 'chat';

export default function Dashboard({ onNavigateToLanding, onNavigateToHistory }: DashboardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('government');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('output');
  const [documentContent, setDocumentContent] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const handleError = (err: unknown) => {
    console.error('[v0] Error occurred:', err);
    if (err instanceof Error) {
      if ('code' in err) {
        setError(err as ApiError);
      } else {
        setError({
          message: err.message,
          code: 'ERROR',
        });
      }
    } else {
      setError({
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      });
    }
  };

  const processText = async (text: string) => {
    setError(null);
    setIsLoading(true);
    setDocumentContent(text);

    try {
      if (DEMO_MODE) {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const demoResult: ProcessingResult = {
          originalText: text,
          translatedText: DEMO_TRANSLATION.translatedText,
          simplifiedText: DEMO_SIMPLIFICATION.simplifiedText,
          audioUrl: undefined,
        };

        setResult(demoResult);
      } else {
        // Call real API
        const result = await api.processDocument(text, selectedLanguage, selectedDomain);
        setResult(result);
      }

      setViewMode('output');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const demoResult: ProcessingResult = {
          originalText: DEMO_EXTRACTION.originalText,
          translatedText: DEMO_TRANSLATION.translatedText,
          simplifiedText: DEMO_SIMPLIFICATION.simplifiedText,
          audioUrl: undefined,
        };
        setDocumentContent(DEMO_EXTRACTION.originalText);
        setResult(demoResult);
      } else {
        // Extract text from image
        const extraction = await api.extractTextFromImage(file, selectedDomain);
        setDocumentContent(extraction.extractedText);

        // Process the extracted text
        const processedResult = await api.processDocument(extraction.extractedText, selectedLanguage, selectedDomain);
        setResult(processedResult);
      }

      setViewMode('output');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioRecorded = async (blob: Blob) => {
    setRecordedAudio(blob);
  };

  const processAudio = async () => {
    if (!recordedAudio) return;

    setError(null);
    setIsLoading(true);

    try {
      if (DEMO_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const demoResult: ProcessingResult = {
          originalText: DEMO_EXTRACTION.originalText,
          translatedText: DEMO_TRANSLATION.translatedText,
          simplifiedText: DEMO_SIMPLIFICATION.simplifiedText,
          audioUrl: undefined,
        };
        setDocumentContent(DEMO_EXTRACTION.originalText);
        setResult(demoResult);
      } else {
        // Transcribe audio
        const transcription = await api.transcribeAudio(recordedAudio, selectedLanguage, selectedDomain);
        setDocumentContent(transcription.text);

        // Process the transcribed text
        const processedResult = await api.processDocument(transcription.text, selectedLanguage, selectedDomain);
        setResult(processedResult);
      }

      setViewMode('output');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">DocAccess Dashboard</h1>
          </div>
          <div className="flex gap-2">
            {onNavigateToHistory && (
              <Button variant="outline" onClick={onNavigateToHistory}>
                History
              </Button>
            )}
            <Button variant="outline" onClick={onNavigateToLanding}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700 font-medium">
            Demo mode is active. Using mock data for testing. Disable DEMO_MODE in lib/constants.ts to use real API.
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorState
              error={error.message}
              onRetry={() => setError(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Controls and Input */}
          <div className="flex flex-col gap-4">
            {/* Selectors */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
              <LanguageSelector
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                disabled={isLoading}
              />
              <DomainSelector
                value={selectedDomain}
                onValueChange={setSelectedDomain}
                disabled={isLoading}
              />
            </div>

            {/* Input Tabs */}
            <Tabs defaultValue="text" className="flex-grow flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text" className="text-xs sm:text-sm">
                  Text
                </TabsTrigger>
                <TabsTrigger value="image" className="text-xs sm:text-sm">
                  Image
                </TabsTrigger>
                <TabsTrigger value="voice" className="text-xs sm:text-sm">
                  Voice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="flex-grow">
                <TextInputPanel onSubmit={processText} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="image" className="flex-grow">
                <DocumentUploader onFileSelected={handleDocumentUpload} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="voice" className="flex-grow">
                <div className="space-y-4 h-full flex flex-col">
                  <AudioRecorder onTranscribe={handleAudioRecorded} isLoading={isLoading} />
                  {recordedAudio && (
                    <Button
                      onClick={processAudio}
                      disabled={isLoading}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? 'Processing...' : 'Process Audio'}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Center and Right Panel - Results */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <LoadingState />
              </div>
            )}

            {!isLoading && result && (
              <>
                {/* View Mode Tabs */}
                <Tabs
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as ViewMode)}
                  className="flex-grow flex flex-col"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    <TabsTrigger value="chat">Q&A</TabsTrigger>
                  </TabsList>

                  <TabsContent value="output" className="flex-grow">
                    <OutputPanel document={{ id: '', ...result, language: selectedLanguage, domain: selectedDomain, timestamp: new Date() }} />
                  </TabsContent>

                  <TabsContent value="comparison" className="flex-grow">
                    <SideBySideViewer result={result} />
                  </TabsContent>

                  <TabsContent value="chat" className="flex-grow">
                    <ChatPanel
                      document={{ id: '', originalText: documentContent, translatedText: result.translatedText, simplifiedText: result.simplifiedText, audioUrl: result.audioUrl, language: selectedLanguage, domain: selectedDomain, timestamp: new Date() }}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}

            {!isLoading && !result && (
              <div className="rounded-lg border border-slate-200 bg-white p-12 flex items-center justify-center h-full text-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Ready to Process Documents
                  </h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Upload a document, paste text, or use voice input to get started. Select your language and document type above.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
