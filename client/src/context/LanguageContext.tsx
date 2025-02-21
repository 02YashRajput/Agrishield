import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useSWR from 'swr';
import i18n from '../utils/i18'; // Assuming i18n is configured in your project
import axios from 'axios';

// Define supported languages
const supportedLanguages = ['en', 'hi', 'as', 'bn', 'gu', 'kn', 'mai', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'ur'] as const;
export type Language = typeof supportedLanguages[number];

// Define the shape of the context
interface LanguageContextProps {
  language: Language | '';
  setLanguage: (language: Language) => void;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentChatId: string | null
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>
}

// Create context with a default value
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Fetcher function for useSWR
const fetcher = (url: string) => axios.get(url,{
  withCredentials: true,headers: {
    'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
  },
}).then(res => res.data);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language | ''>('');
  const { data: backendLanguage } = useSWR(`/api/get-language`, fetcher);
  const [isChatOpen,setIsChatOpen] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  useEffect(() => {
    const initializeLanguage = () => {
      let selectedLanguage: Language;
      
      if (backendLanguage && backendLanguage.language!=="") {
       
        selectedLanguage = supportedLanguages.includes(backendLanguage.language) 
          ? backendLanguage.language 
          : 'en';
      } else {
        // Fall back to the browser language if backend language is empty
        const browserLang = navigator.language.slice(0, 2) as Language;
        selectedLanguage = supportedLanguages.includes(browserLang) ? browserLang : 'en';
      }

      // Set i18n language and state
      i18n.changeLanguage(selectedLanguage);
      setLanguage(selectedLanguage);
    };

    initializeLanguage();
  }, [backendLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage,isChatOpen,setIsChatOpen,currentChatId,setCurrentChatId }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use LanguageContext
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
