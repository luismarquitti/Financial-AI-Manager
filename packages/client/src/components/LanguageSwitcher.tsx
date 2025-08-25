import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'pt-BR', name: 'Português (BR)' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-center space-x-2 p-2 bg-gray-100 rounded-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          disabled={i18n.resolvedLanguage === lang.code}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200
            ${i18n.resolvedLanguage === lang.code
              ? 'bg-primary text-white cursor-default'
              : 'text-gray-600 hover:bg-indigo-100 hover:text-primary'
            }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};
