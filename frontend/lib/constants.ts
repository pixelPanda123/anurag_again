import type { Language, DomainType } from "./types";

export const DEMO_MODE = false; // Set to true to use mock data

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "bn", label: "Bengali" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "zh", label: "Chinese (Simplified)" },
];

export const DOMAINS: Record<DomainType, string> = {
  government: "Government & Legal Documents",
  medical: "Medical & Healthcare Documents",
};

export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_LENGTH = 5000; // characters

// Mock data for demo mode
export const DEMO_EXTRACTION = {
  originalText:
    "Government Order No. 2024/GM/123: All citizens aged 18-45 are eligible for the new healthcare scheme. Please submit your Aadhar number and proof of residence at the nearest government office.",
  confidence: 0.95,
};

export const DEMO_TRANSLATION = {
  translatedText:
    "सरकारी आदेश नंबर 2024/GM/123: 18-45 वर्ष की आयु के सभी नागरिक नई स्वास्थ्य सेवा के लिए पात्र हैं। कृपया अपने आधार नंबर और निवास का प्रमाण निकटतम सरकारी कार्यालय में जमा करें।",
  targetLanguage: "hi",
};

export const DEMO_SIMPLIFICATION = {
  simplifiedText:
    "सरकार एक नई स्वास्थ्य सेवा शुरू कर रही है। अगर आप 18 से 45 साल के हैं, तो आप इसके लिए आवेदन कर सकते हैं। आपको अपना आधार कार्ड और पता का सबूत दिखाना होगा।",
  keyPoints: [
    "नई स्वास्थ्य सेवा सभी के लिए खुली है",
    "18-45 साल के लोग आवेदन कर सकते हैं",
  ],
  actionItems: [
    "अपना आधार कार्ड तैयार करें",
    "पता का सबूत लेकर जाएं",
    "निकटतम सरकारी कार्यालय में जाएं",
  ],
};

export const SAMPLE_DOCUMENTS = [
  {
    id: "1",
    title: "Government Health Scheme Document",
    type: "government",
    thumbnail: "/samples/doc-1.jpg",
  },
  {
    id: "2",
    title: "Medical Report Sample",
    type: "medical",
    thumbnail: "/samples/doc-2.jpg",
  },
  {
    id: "3",
    title: "Government Land Rights Document",
    type: "government",
    thumbnail: "/samples/doc-3.jpg",
  },
];
