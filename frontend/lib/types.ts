export type DomainType = "government" | "medical";

export type Language = {
  code: string;
  label: string;
};


// ----------------------------
// MAIN RESULT TYPE (UPDATED)
// ----------------------------

export type ProcessingResult = {
  originalText: string;
  translatedText: string;
  simplifiedText: string;

  // Optional audio output
  audioUrl?: string;

  // ✅ NEW: AI Medical / Legal Analysis
  aiAnalysis?: string;
};


// ----------------------------
// CHAT
// ----------------------------

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};


// ----------------------------
// UPLOAD
// ----------------------------

export type DocumentUploadResponse = {
  extractedText: string;
  confidence: number;
};


// ----------------------------
// TRANSLATION
// ----------------------------

export type TranslationResponse = {
  translatedText: string;
  targetLanguage: string;
};


// ----------------------------
// SPEECH
// ----------------------------

export type SpeechToTextResponse = {
  text: string;
  duration: number;
};


// ----------------------------
// SIMPLIFICATION
// ----------------------------

export type SimplificationResponse = {
  simplifiedText: string;
  keyPoints: string[];
  actionItems: string[];
};


// ----------------------------
// TTS
// ----------------------------

export type TextToSpeechResponse = {
  audioUrl: string;
  duration: number;
};


// ----------------------------
// HEALTH
// ----------------------------

export type HealthResponse = {
  status: "healthy" | "error";
  message: string;
};


// ----------------------------
// API ERROR
// ----------------------------

export type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};
