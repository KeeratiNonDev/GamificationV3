import React, { createContext, useState, useContext, ReactNode } from "react";

interface LanguageContextProps {
  lang: string;
  setLang: (lang: string) => void;
  localeItems: { key: string; label: string }[];
  translate: (value: Record<string, string>, lang?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<string>("th");

  const localeItems = [
    { key: "en", label: "EN" },
    { key: "th", label: "TH" },
    { key: "km", label: "KM" },
    { key: "my", label: "MY" },
    { key: "zh", label: "ZH" },
  ];

  return (
    <LanguageContext.Provider 
      value={{ 
        lang, 
        setLang, 
        localeItems,
        translate: (
          value: Record<string, string>,
          lang: string = 'th',
        ) => {
            const matched = value?.[lang];

            if (matched) {
                return matched;
            }

            return Object.values(value).filter(Boolean)?.[0] ?? '';
        },
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
