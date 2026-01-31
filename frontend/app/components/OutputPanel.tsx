'use client';

import { useState, useRef } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import { Button } from '@/app/components/ui/button';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import {
  Copy,
  Download,
  Volume2,
  Check,
  Brain,
} from 'lucide-react';

import type { ProcessedDocument } from '@/lib/contexts/app-context';


interface OutputPanelProps {
  document: ProcessedDocument;
}


export default function OutputPanel({ document }: OutputPanelProps) {

  const [copiedTab, setCopiedTab] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);


  // ----------------------------
  // HELPERS
  // ----------------------------

  const copyToClipboard = (text: string, tabName: string) => {

    navigator.clipboard.writeText(text);

    setCopiedTab(tabName);

    setTimeout(() => setCopiedTab(''), 2000);
  };


  const downloadText = (content: string, filename: string) => {

    const el = window.document.createElement('a');

    el.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    );

    el.setAttribute('download', filename);

    el.style.display = 'none';

    window.document.body.appendChild(el);

    el.click();

    window.document.body.removeChild(el);
  };


  const handlePlayAudio = () => {

    if (document.audioUrl && audioRef.current) {

      audioRef.current.src = document.audioUrl;

      audioRef.current.play();

      setIsPlaying(true);
    }
  };


  // ----------------------------
  // UI
  // ----------------------------

  return (

    <Card className="flex flex-col h-full">

      <CardHeader>

        <CardTitle>Processed Results</CardTitle>

        <CardDescription>
          Translation, simplification, and AI analysis
        </CardDescription>

      </CardHeader>


      <CardContent className="flex-1 overflow-auto">

        <Tabs
          defaultValue="simplified"
          className="h-full flex flex-col"
        >

          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-4 mb-4">

            <TabsTrigger value="simplified">
              Simplified
            </TabsTrigger>

            <TabsTrigger value="translated">
              Translated
            </TabsTrigger>

            <TabsTrigger value="original">
              Original
            </TabsTrigger>

            <TabsTrigger value="ai">
              <span className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                AI
              </span>
            </TabsTrigger>

          </TabsList>


          {/* Tabs Content */}
          <div className="flex-1 overflow-auto">


            {/* ---------------- SIMPLIFIED ---------------- */}

            <TabsContent
              value="simplified"
              className="mt-0 space-y-4"
            >

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {document.simplifiedText}
              </div>


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      document.simplifiedText,
                      'simplified'
                    )
                  }
                  className="gap-2"
                >

                  {copiedTab === 'simplified' ? (
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
                  onClick={() =>
                    downloadText(
                      document.simplifiedText,
                      'simplified.txt'
                    )
                  }
                  className="gap-2"
                >

                  <Download className="w-4 h-4" />
                  Download

                </Button>

              </div>

            </TabsContent>


            {/* ---------------- TRANSLATED ---------------- */}

            <TabsContent
              value="translated"
              className="mt-0 space-y-4"
            >

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {document.translatedText}
              </div>


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      document.translatedText,
                      'translated'
                    )
                  }
                  className="gap-2"
                >

                  {copiedTab === 'translated' ? (
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
                  onClick={() =>
                    downloadText(
                      document.translatedText,
                      'translated.txt'
                    )
                  }
                  className="gap-2"
                >

                  <Download className="w-4 h-4" />
                  Download

                </Button>

              </div>

            </TabsContent>


            {/* ---------------- ORIGINAL ---------------- */}

            <TabsContent
              value="original"
              className="mt-0 space-y-4"
            >

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {document.originalText}
              </div>


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      document.originalText,
                      'original'
                    )
                  }
                  className="gap-2"
                >

                  {copiedTab === 'original' ? (
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
                  onClick={() =>
                    downloadText(
                      document.originalText,
                      'original.txt'
                    )
                  }
                  className="gap-2"
                >

                  <Download className="w-4 h-4" />
                  Download

                </Button>

              </div>

            </TabsContent>


            {/* ---------------- AI ANALYSIS ---------------- */}

            <TabsContent
              value="ai"
              className="mt-0 space-y-4"
            >

              {document.aiAnalysis ? (

                <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4 whitespace-pre-wrap break-words text-sm leading-relaxed border border-indigo-200 dark:border-indigo-800">

                  {document.aiAnalysis}

                </div>

              ) : (

                <div className="text-sm text-slate-500 text-center py-6">

                  No AI analysis available for this document.

                </div>

              )}

            </TabsContent>


          </div>

        </Tabs>

      </CardContent>


      {/* ---------------- AUDIO ---------------- */}

      {document.audioUrl && (

        <div className="border-t border-slate-200 dark:border-slate-800 p-4">

          <Button
            onClick={handlePlayAudio}
            variant="default"
            size="sm"
            className="w-full gap-2"
          >

            <Volume2 className="w-4 h-4" />

            {isPlaying ? 'Playing...' : 'Play Audio'}

          </Button>


          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            className="w-full mt-2"
          />

        </div>

      )}

    </Card>
  );
}
