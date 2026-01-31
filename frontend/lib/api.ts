/**
 * Public API layer: uses central Axios client and backend-aligned services.
 * Exposes the same interface expected by Dashboard and other pages.
 */

import type { DomainType, ProcessingResult, ApiError } from "./types";
import * as api from "./api/services";


// ---------------------------------------------------------------------------
// Re-export services
// ---------------------------------------------------------------------------

export { api };

export {
  translate,
  translatePipeline,
  speechToText,
  fileToText,   // ✅ comes from services.ts
  summarize,
  explain,
  aiAnalyze,
} from "./api/services";


// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------


// ---------------- HEALTH ----------------

export async function checkHealth(): Promise<{ status: string }> {

  const data = await api.checkHealth();

  return {
    status: data.status === "ok" ? "healthy" : "error",
  };
}


// ---------------- OCR (IMAGE + PDF) ----------------

export async function extractTextFromImage(
  file: File,
  _domain: DomainType
): Promise<{ extractedText: string; confidence: number }> {

  const data = await api.fileToText(file);

  return {
    extractedText: data.text,
    confidence: 1,
  };
}


// ---------------- SPEECH TO TEXT ----------------

export async function transcribeAudio(
  audioBlob: Blob,
  languageCode: string,
  _domain: DomainType
): Promise<{ text: string }> {

  const data = await api.speechToText(audioBlob, languageCode);

  return {
    text: data.transcript,
  };
}


// ---------------- DOCUMENT PIPELINE ----------------

export async function processDocument(
  text: string,
  targetLanguage: string,
  _domain: DomainType
): Promise<ProcessingResult> {

  const [translated, summarized] = await Promise.all([
    api.translatePipeline(text, targetLanguage),
    api.summarize(text),
  ]);

  return {
    originalText: text,
    translatedText: translated.translated_text,
    simplifiedText: summarized.summary,
    audioUrl: undefined,
  };
}


// ---------------- LANGUAGES ----------------

export async function getLanguages(): Promise<
  { code: string; name: string }[]
> {

  const data = await api.getLanguages();

  return data.languages;
}


// ---------------- AI ANALYSIS ----------------

export async function analyzeDocumentAI(
  text: string,
  audience: string
) {

  return api.aiAnalyze(text, audience);
}


// ---------------------------------------------------------------------------

export type { ApiError };
