import React from "react"
// Accessibility utilities for the Document Accessibility System

export const a11yLabels = {
  // Navigation
  backButton: 'Go back to previous page',
  homeButton: 'Return to home page',
  dashboardButton: 'Go to dashboard',
  historyButton: 'View processing history',

  // Form Controls
  fileUpload: 'Upload a document image (JPEG, PNG, WebP, TIFF)',
  textInput: 'Paste document text',
  voiceInput: 'Record audio from microphone',
  recordButton: 'Start recording voice input',
  stopButton: 'Stop recording voice input',

  // Selection Controls
  languageSelect: 'Choose target language for translation',
  domainSelect: 'Select document type (Government or Medical)',

  // Action Buttons
  processButton: 'Process the document',
  submitButton: 'Submit for processing',
  copyButton: 'Copy text to clipboard',
  downloadButton: 'Download text as file',
  playAudio: 'Play audio',
  stopAudio: 'Stop playing audio',

  // Results
  originalText: 'Original extracted text from document',
  translatedText: 'Text translated to selected language',
  simplifiedText: 'Simplified version of the text',
  audioOutput: 'Audio playback of simplified text',

  // Chat/Q&A
  chatInput: 'Ask a question about the document',
  sendMessage: 'Send message',
  suggestedQuestion: 'Pre-written question about the document',

  // Status Messages
  loadingMessage: 'Document is being processed, please wait',
  errorMessage: 'An error occurred while processing',
  successMessage: 'Document processed successfully',
};

export const semanticHeadings = {
  h1: {
    landing: 'Understand Government & Medical Documents in Your Language',
    dashboard: 'DocAccess Dashboard',
    history: 'Processing History',
  },
  h2: {
    howItWorks: 'How It Works',
    features: 'Built for Accessibility',
    inputs: 'Upload or Select Input Method',
    outputs: 'Processing Results',
  },
};

export const ariaLiveRegions = {
  status: 'status',
  alert: 'alert',
  polite: 'polite',
  assertive: 'assertive',
};

export const roleAttributes = {
  main: 'main',
  navigation: 'navigation',
  form: 'form',
  region: 'region',
  tablist: 'tablist',
  tab: 'tab',
  tabpanel: 'tabpanel',
  button: 'button',
  progressbar: 'progressbar',
};

// Function to create accessible form labels
export function createFormLabelProps(htmlFor: string, label: string) {
  return {
    htmlFor,
    className: 'text-sm font-medium text-slate-700',
    children: label,
  };
}

// Function to add keyboard shortcuts info
export function getKeyboardShortcuts() {
  return {
    submit: 'Enter to submit form',
    cancel: 'Escape to cancel',
    focusSearch: 'Ctrl+K or Cmd+K to focus search',
  };
}

// Keyboard event handlers for accessibility
export function handleKeyboardSubmit(
  e: React.KeyboardEvent<HTMLElement>,
  callback: () => void
) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    callback();
  }
}

export function handleKeyboardEscape(
  e: React.KeyboardEvent<HTMLElement>,
  callback: () => void
) {
  if (e.key === 'Escape') {
    e.preventDefault();
    callback();
  }
}
