'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Mic, Square, AlertCircle, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
  onTranscribe: (blob: Blob) => void;
  isLoading?: boolean;
}

export default function AudioRecorder({ onTranscribe, isLoading = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const onAudioRecorded = (blob: Blob) => {
    onTranscribe(blob);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        onTranscribe(audioBlob);
        setHasRecording(true);
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to access microphone. Please check permissions.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const resetRecording = () => {
    setHasRecording(false);
    setDuration(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Voice Input</CardTitle>
        <CardDescription>
          Speak into your microphone in your preferred language
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 justify-center">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          {!hasRecording && (
            <>
              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  {isRecording
                    ? 'Recording in progress...'
                    : 'Click the microphone button to start recording'}
                </p>
              </div>

              <div
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center cursor-pointer
                  transition-all transform hover:scale-110
                  ${isRecording
                    ? 'bg-red-100 border-2 border-red-500 animate-pulse'
                    : 'bg-blue-100 border-2 border-blue-500 hover:bg-blue-200'
                  }
                `}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <Square className="w-10 h-10 text-red-600" />
                ) : (
                  <Mic className="w-10 h-10 text-blue-600" />
                )}
              </div>

              {isRecording && (
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {formatTime(duration)}
                </div>
              )}

              <p className="text-xs text-slate-500 text-center max-w-xs">
                {isRecording
                  ? 'Click the stop button to finish recording'
                  : 'Your recording will be processed and transcribed'}
              </p>
            </>
          )}

          {hasRecording && (
            <>
              <div className="w-full space-y-2">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-900 mb-1">
                    Recording Complete
                  </p>
                  <p className="text-slate-600">
                    Duration: {formatTime(duration)}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2 flex gap-2 flex-col">
                <Button
                  disabled={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Process Recording'}
                </Button>
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                  Record Again
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center">
          Audio is processed locally on your device and not stored on any server.
        </p>
      </CardContent>
    </Card>
  );
}
