'use client';

import React, { createContext, useContext, useState, ReactNode} from "react";

type Language = 'en' | 'ar';

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const languageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children } : { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ar'); //default is Arabic

    return (
        <languageContext.Provider value={{ language, setLanguage}}>
            <html lang={language} dir={language === 'en' ? 'ltr' : 'rtl'}>
                <body>{children}</body>
            </html>
        </languageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(languageContext);
    if (!context) {
        throw new Error('Langue is not provided');
    }
    return context;
};