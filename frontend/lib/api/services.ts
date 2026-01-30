import { apiClient } from './client';

// ---------------------------------------------------------------------------
// Types (aligned with backend)
// ---------------------------------------------------------------------------

export interface TranslateRequest {
  text: string;
  source_language_code?: string;
  target_language_code?: string;
}

export interface TranslatePipelineRequest {
  text: string;
  target_lang: string;
  source_language_code?: string;
}

export interface TranslateResponse {
  translated_text: string;
}

export interface LanguagesResponse {
  languages: { code: string; name: string }[];
}

export interface SpeechToTextResponse {
  transcript: string;
}

export interface ImageToTextResponse {
  text: string;
}

export interface SummarizeRequest {
  text: string;
  audience?: string;
}

export interface SummarizeResponse {
  summary: string;
}

export interface ExplainRequest {
  text: string;
  audience?: string;
}

export interface ExplainResponse {
  explanation: string;
}

export interface HealthResponse {
  status: string;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Backend/Sarvam expects codes like hi-IN. Map frontend code (e.g. hi) to backend. */
function toSarvamCode(code: string): string {
  if (code.includes('-') || code === 'auto') return code;
  return `${code}-IN`;
}

export function translate(
  text: string,
  sourceLang: string = 'auto',
  targetLang: string = 'hi'
): Promise<TranslateResponse> {
  return apiClient
    .post<TranslateResponse>('/translate', {
      text,
      source_language_code: toSarvamCode(sourceLang),
      target_language_code: toSarvamCode(targetLang),
    })
    .then((res) => res.data);
}

export function translatePipeline(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<TranslateResponse> {
  return apiClient
    .post<TranslateResponse>('/translate-pipeline', {
      text,
      target_lang: targetLang,
      source_language_code: sourceLang,
    })
    .then((res) => res.data);
}

export function getLanguages(): Promise<LanguagesResponse> {
  return apiClient.get<LanguagesResponse>('/languages').then((res) => res.data);
}

export function speechToText(file: File | Blob, languageCode: string = 'hi'): Promise<SpeechToTextResponse> {
  const formData = new FormData();
  const blob = file instanceof Blob ? file : new Blob([file]);
  const filename = file instanceof File ? file.name : 'audio.webm';
  formData.append('file', blob, filename);
  const code = toSarvamCode(languageCode);
  return apiClient
    .post<SpeechToTextResponse>('/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { language_code: code },
    })
    .then((res) => res.data);
}

export function imageToText(file: File): Promise<ImageToTextResponse> {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return apiClient
    .post<ImageToTextResponse>('/image-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
}

export function summarize(text: string, audience: string = 'student'): Promise<SummarizeResponse> {
  return apiClient
    .post<SummarizeResponse>('/summarize', { text, audience })
    .then((res) => res.data);
}

export function explain(text: string, audience: string = 'student'): Promise<ExplainResponse> {
  return apiClient
    .post<ExplainResponse>('/explain', { text, audience })
    .then((res) => res.data);
}

export function checkHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/health').then((res) => res.data);
}
