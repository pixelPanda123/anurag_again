'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';


// ----------------------------
// TYPES
// ----------------------------

export interface ProcessedDocument {
  id: string;

  originalText: string;
  translatedText: string;
  simplifiedText: string;

  audioUrl?: string;

  // ✅ FIXED: AI returns object, not string
  aiAnalysis?: any;

  language: string;
  domain: string;

  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


// ----------------------------
// CONTEXT TYPE
// ----------------------------

export interface AppContextType {

  // Auth
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  guestLogin: () => void;

  // Preferences
  language: string;
  domain: string;
  theme: 'light' | 'dark' | 'system';

  setLanguage: (lang: string) => void;
  setDomain: (domain: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Documents
  currentDocument: ProcessedDocument | null;
  documents: ProcessedDocument[];

  setCurrentDocument: (doc: ProcessedDocument) => void;
  addDocument: (doc: ProcessedDocument) => void;
  removeDocument: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // Settings
  defaultLanguage: string;
  defaultDomain: string;
  demoMode: boolean;
  apiBaseUrl: string;

  setDefaultLanguage: (lang: string) => void;
  setDefaultDomain: (domain: string) => void;
  setDemoMode: (enabled: boolean) => void;
  setApiBaseUrl: (url: string) => void;
}


// ----------------------------
// CONTEXT
// ----------------------------

const AppContext = createContext<AppContextType | undefined>(undefined);


// ----------------------------
// STORAGE
// ----------------------------

const STORAGE_KEYS = {
  AUTH: 'docaccess_auth',
  DOCUMENTS: 'docaccess_documents',
  PREFERENCES: 'docaccess_preferences',
} as const;


function loadFromStorage<T>(key: string, defaultValue: T): T {

  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}


function saveToStorage<T>(key: string, value: T): void {

  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}


// ----------------------------
// PROVIDER
// ----------------------------

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const [language, setLanguage] = useState('en');
  const [domain, setDomain] = useState('government');

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const [currentDocument, setCurrentDocument] =
    useState<ProcessedDocument | null>(null);

  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [defaultDomain, setDefaultDomain] = useState('government');

  const [demoMode, setDemoMode] = useState(true);

  const [apiBaseUrl, setApiBaseUrl] =
    useState('http://localhost:8000');

  const [isHydrated, setIsHydrated] = useState(false);


  // ----------------------------
  // HYDRATE
  // ----------------------------

  useEffect(() => {

    const savedAuth =
      loadFromStorage<{
        user: { email: string; name: string };
        isAuthenticated: boolean;
      } | null>(STORAGE_KEYS.AUTH, null);

    const savedDocs =
      loadFromStorage(STORAGE_KEYS.DOCUMENTS, []);

    const savedPrefs =
      loadFromStorage<{
        language?: string;
        domain?: string;
        defaultLanguage?: string;
        defaultDomain?: string;
        demoMode?: boolean;
        apiBaseUrl?: string;
      }>(STORAGE_KEYS.PREFERENCES, {});


    if (savedAuth) {
      setUser(savedAuth.user);
      setIsAuthenticated(savedAuth.isAuthenticated);
    }


    if (savedDocs.length > 0) {

      setDocuments(
        savedDocs.map((doc: any) => ({

          ...doc,

          // ✅ Keep AI data
          aiAnalysis: doc.aiAnalysis ?? null,

          timestamp: new Date(doc.timestamp),
        }))
      );
    }


    if (savedPrefs) {

      if (savedPrefs.language) setLanguage(savedPrefs.language);
      if (savedPrefs.domain) setDomain(savedPrefs.domain);

      if (savedPrefs.defaultLanguage)
        setDefaultLanguage(savedPrefs.defaultLanguage);

      if (savedPrefs.defaultDomain)
        setDefaultDomain(savedPrefs.defaultDomain);

      if (savedPrefs.demoMode !== undefined)
        setDemoMode(savedPrefs.demoMode);

      if (savedPrefs.apiBaseUrl)
        setApiBaseUrl(savedPrefs.apiBaseUrl);
    }

    setIsHydrated(true);

  }, []);


  // ----------------------------
  // AUTH
  // ----------------------------

  const login = useCallback(async (email: string, password: string) => {

    if (email && password) {

      const userData = {
        email,
        name: email.split('@')[0],
      };

      setUser(userData);
      setIsAuthenticated(true);

      saveToStorage(STORAGE_KEYS.AUTH, {
        user: userData,
        isAuthenticated: true,
      });

    } else {
      throw new Error('Invalid credentials');
    }

  }, []);


  const register = useCallback(async (
    email: string,
    name: string,
    password: string
  ) => {

    if (email && name && password) {

      const userData = { email, name };

      setUser(userData);
      setIsAuthenticated(true);

      saveToStorage(STORAGE_KEYS.AUTH, {
        user: userData,
        isAuthenticated: true,
      });

    } else {
      throw new Error('Invalid input');
    }

  }, []);


  const logout = useCallback(() => {

    setUser(null);
    setIsAuthenticated(false);

    setChatMessages([]);
    setCurrentDocument(null);

    window.localStorage.removeItem(STORAGE_KEYS.AUTH);

  }, []);


  const guestLogin = useCallback(() => {

    const guestUser = {
      email: 'guest@docaccess.local',
      name: 'Guest',
    };

    setUser(guestUser);
    setIsAuthenticated(true);

    saveToStorage(STORAGE_KEYS.AUTH, {
      user: guestUser,
      isAuthenticated: true,
    });

  }, []);


  // ----------------------------
  // DOCUMENTS
  // ----------------------------

  const addDocument = useCallback((doc: ProcessedDocument) => {

    setDocuments(prev => {

      const updated = [doc, ...prev];

      saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);

      return updated;
    });

    setCurrentDocument(doc);

  }, []);


  const removeDocument = useCallback((id: string) => {

    setDocuments(prev => {

      const updated = prev.filter(d => d.id !== id);

      saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);

      return updated;
    });

    if (currentDocument?.id === id) {
      setCurrentDocument(null);
    }

  }, [currentDocument]);


  // ----------------------------
  // CHAT
  // ----------------------------

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  }, []);


  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);


  // ----------------------------
  // SAVE PREFS
  // ----------------------------

  useEffect(() => {

    if (!isHydrated) return;

    const prefs = {
      language,
      domain,
      defaultLanguage,
      defaultDomain,
      demoMode,
      apiBaseUrl,
    };

    saveToStorage(STORAGE_KEYS.PREFERENCES, prefs);

  }, [
    language,
    domain,
    defaultLanguage,
    defaultDomain,
    demoMode,
    apiBaseUrl,
    isHydrated,
  ]);


  // ----------------------------
  // CONTEXT VALUE
  // ----------------------------

  const value: AppContextType = {

    isAuthenticated,
    user,

    login,
    register,
    logout,
    guestLogin,

    language,
    domain,
    theme,

    setLanguage,
    setDomain,
    setTheme,

    currentDocument,
    documents,

    setCurrentDocument,
    addDocument,
    removeDocument,

    chatMessages,
    addChatMessage,
    clearChat,

    defaultLanguage,
    defaultDomain,
    demoMode,
    apiBaseUrl,

    setDefaultLanguage,
    setDefaultDomain,
    setDemoMode,
    setApiBaseUrl,
  };


  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


// ----------------------------
// HOOK
// ----------------------------

export function useApp() {

  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}
