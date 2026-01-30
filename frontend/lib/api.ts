import type {
    DocumentUploadResponse,
    TranslationResponse,
    SpeechToTextResponse,
    SimplificationResponse,
    TextToSpeechResponse,
    HealthResponse,
    ApiError,
    DomainType,
    ProcessingResult, // Declare ProcessingResult here
  } from "./types";
  
  const BASE_URL = "http://localhost:8000";
  
  // Utility function for API error handling
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `API Error: ${response.status}`,
        code: `HTTP_${response.status}`,
      };
  
      try {
        const data = await response.json();
        error.details = data;
        if (data.detail) {
          error.message = data.detail;
        }
      } catch {
        // Response is not JSON, use status text
        error.message = response.statusText || error.message;
      }
  
      throw error;
    }
  
    return response.json() as Promise<T>;
  }
  
  // Health check endpoint
  export async function checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
      });
      return handleResponse<HealthResponse>(response);
    } catch (error) {
      throw {
        message: "Failed to connect to backend",
        code: "CONNECTION_ERROR",
        details: error,
      } as ApiError;
    }
  }
  
  // Image to text extraction (OCR)
  export async function extractTextFromImage(
    file: File,
    domain: DomainType
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("domain", domain);
  
    const response = await fetch(`${BASE_URL}/image-to-text`, {
      method: "POST",
      body: formData,
    });
  
    return handleResponse<DocumentUploadResponse>(response);
  }
  
  // Text translation
  export async function translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    domain: DomainType
  ): Promise<TranslationResponse> {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        domain,
      }),
    });
  
    return handleResponse<TranslationResponse>(response);
  }
  
  // Speech to text conversion
  export async function transcribeAudio(
    audioBlob: Blob,
    language: string,
    domain: DomainType
  ): Promise<SpeechToTextResponse> {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("language", language);
    formData.append("domain", domain);
  
    const response = await fetch(`${BASE_URL}/speech-to-text`, {
      method: "POST",
      body: formData,
    });
  
    return handleResponse<SpeechToTextResponse>(response);
  }
  
  // Simplify text
  export async function simplifyText(
    text: string,
    domain: DomainType,
    readingLevel: "basic" | "intermediate" | "advanced" = "basic"
  ): Promise<SimplificationResponse> {
    const response = await fetch(`${BASE_URL}/simplify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        domain,
        reading_level: readingLevel,
      }),
    });
  
    return handleResponse<SimplificationResponse>(response);
  }
  
  // Text to speech
  export async function synthesizeSpeech(
    text: string,
    language: string,
    voice: string = "default"
  ): Promise<TextToSpeechResponse> {
    const response = await fetch(`${BASE_URL}/text-to-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        language,
        voice,
      }),
    });
  
    return handleResponse<TextToSpeechResponse>(response);
  }
  
  // Complete document processing pipeline
  export async function processDocument(
    text: string,
    targetLanguage: string,
    domain: DomainType
  ): Promise<ProcessingResult> {
    try {
      // First translate the text
      const translationResult = await translateText(
        text,
        "en", // assuming input is English
        targetLanguage,
        domain
      );
  
      // Then simplify the translated text
      const simplificationResult = await simplifyText(
        translationResult.translatedText,
        domain
      );
  
      // Finally, generate audio for the simplified text
      const audioResult = await synthesizeSpeech(
        simplificationResult.simplifiedText,
        targetLanguage
      );
  
      return {
        originalText: text,
        translatedText: translationResult.translatedText,
        simplifiedText: simplificationResult.simplifiedText,
        audioUrl: audioResult.audioUrl,
      };
    } catch (error) {
      throw {
        message: "Document processing failed",
        code: "PROCESSING_ERROR",
        details: error,
      } as ApiError;
    }
  }
  