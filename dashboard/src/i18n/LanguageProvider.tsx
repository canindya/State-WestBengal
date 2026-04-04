'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import en from './en.json';
import bn from './bn.json';

type Lang = 'en' | 'bn';
const messages: Record<Lang, Record<string, unknown>> = { en, bn };

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function useLang() { return useContext(LangContext); }

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('westbengal-lang', l);
    document.documentElement.lang = l;
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let obj: unknown = messages[lang];
    for (const k of keys) {
      if (typeof obj !== 'object' || obj === null) return key;
      obj = (obj as Record<string, unknown>)[k];
    }
    if (typeof obj === 'string') return obj;
    // Fallback to English
    obj = messages.en;
    for (const k of keys) {
      if (typeof obj !== 'object' || obj === null) return key;
      obj = (obj as Record<string, unknown>)[k];
    }
    return typeof obj === 'string' ? obj : key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
