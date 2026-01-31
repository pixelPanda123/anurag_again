// lib/api/services.ts

import { apiClient } from "./client";

// ---------------------------------------------------------------------------
// Types (Backend Aligned)
// ---------------------------------------------------------------------------

export interface TranslateResponse {
  translated_text: string;
}

export interface LanguagesResponse {
  languages: { code: string; name: string }[];
}

export interface SpeechToTextResponse {
  transcript: string;
}

export interface FileToTextResponse {
  text: string;
}

export interface SummarizeResponse {
  summary: string;
}

export interface ExplainResponse {
  explanation: string;
}

export interface HealthResponse {
  status: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert frontend language code to Sarvam backend format
 * Example: hi → hi-IN
 */
function toSarvamCode(code: string): string {
  if (code.includes("-") || code === "auto") return code;
  return `${code}-IN`;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------


// ===================== TRANSLATE =====================

export function translate(
  text: string,
  sourceLang: string = "auto",
  targetLang: string = "hi"
): Promise<TranslateResponse> {

  return apiClient
    .post<TranslateResponse>("/translate", {
      text,
      source_language_code: toSarvamCode(sourceLang),
      target_language_code: toSarvamCode(targetLang),
    })
    .then((res) => res.data);
}


// ===================== PIPELINE TRANSLATE =====================

export function translatePipeline(
  text: string,
  targetLang: string,
  sourceLang: string = "auto"
): Promise<TranslateResponse> {

  return apiClient
    .post<TranslateResponse>("/translate-pipeline", {
      text,
      target_lang: targetLang,
      source_language_code: sourceLang,
    })
    .then((res) => res.data);
}


// ===================== LANGUAGES =====================

export function getLanguages(): Promise<LanguagesResponse> {

  return apiClient
    .get<LanguagesResponse>("/languages")
    .then((res) => res.data);
}


// ===================== SPEECH TO TEXT =====================

export function speechToText(
  file: File | Blob,
  languageCode: string = "hi"
): Promise<SpeechToTextResponse> {

  const formData = new FormData();

  const blob = file instanceof Blob ? file : new Blob([file]);
  const filename = file instanceof File ? file.name : "audio.webm";

  formData.append("file", blob, filename);

  const code = toSarvamCode(languageCode);

  return apiClient
    .post<SpeechToTextResponse>("/speech-to-text", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        language_code: code,
      },
    })
    .then((res) => res.data);
}


// ===================== FILE (IMAGE + PDF) TO TEXT =====================

/**
 * OCR endpoint.
 * Tries /file-to-text first.
 * Falls back to /image-to-text if backend is old.
 */
export async function fileToText(
  file: File
): Promise<FileToTextResponse> {

  const formData = new FormData();

  formData.append("file", file, file.name);

  try {
    // New endpoint
    const res = await apiClient.post<FileToTextResponse>(
      "/file-to-text",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (err: any) {

    // Fallback for old backend
    if (err?.code === "HTTP_404") {

      const res = await apiClient.post<FileToTextResponse>(
        "/image-to-text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    }

    throw err;
  }
}


// ===================== SUMMARIZE =====================

export function summarize(
  text: string,
  audience: string = "student"
): Promise<SummarizeResponse> {

  return apiClient
    .post<SummarizeResponse>("/summarize", { text, audience })
    .then((res) => res.data);
}


// ===================== EXPLAIN =====================

export function explain(
  text: string,
  audience: string = "student"
): Promise<ExplainResponse> {

  return apiClient
    .post<ExplainResponse>("/explain", { text, audience })
    .then((res) => res.data);
}


// ===================== HEALTH =====================

export function checkHealth(): Promise<HealthResponse> {

  return apiClient
    .get<HealthResponse>("/health")
    .then((res) => res.data);
}


// ===================== AI ANALYZE =====================

export interface AIAnalyzeResponse {
  type: string;
  error?: string;
  raw_output?: string;
}

export function aiAnalyze(
  text: string,
  audience: string = "general"
): Promise<AIAnalyzeResponse> {

  return apiClient
    .post<AIAnalyzeResponse>("/ai-analyze", {
      text,
      audience,
    })
    .then((res) => res.data);
}
