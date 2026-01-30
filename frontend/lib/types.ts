export type DomainType = "government" | "medical";

export type Language = {
  code: string;
  label: string;
};

export type ProcessingResult = {
  originalText: string;
  translatedText: string;
  simplifiedText: string;
  audioUrl?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type DocumentUploadResponse = {
  extractedText: string;
  confidence: number;
};

export type TranslationResponse = {
  translatedText: string;
  targetLanguage: string;
};

export type SpeechToTextResponse = {
  text: string;
  duration: number;
};

export type SimplificationResponse = {
  simplifiedText: string;
  keyPoints: string[];
  actionItems: string[];
};

export type TextToSpeechResponse = {
  audioUrl: string;
  duration: number;
};

export type HealthResponse = {
  status: "healthy" | "error";
  message: string;
};

export type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};
