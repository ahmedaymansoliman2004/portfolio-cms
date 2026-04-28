import { createContext, useContext, useState, useEffect } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import { useCms } from './CmsContext';

const translations = { ar, en };
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') === 'en' ? 'en' : 'ar');
  const isRTL = lang === 'ar';
  const { data: cmsData } = useCms();
  const t = JSON.parse(JSON.stringify(translations[lang]));

  if (cmsData?.about) {
    const a = cmsData.about;
    t.about.bio1 = a['bio1_' + lang] || t.about.bio1;
    t.about.bio2 = a['bio2_' + lang] || t.about.bio2;
    t.about.bio3 = a['bio3_' + lang] || t.about.bio3;
    t.about.bio4 = a['bio4_' + lang] || t.about.bio4;
    t.hero.role = a['title_' + lang] || t.hero.role;
  }

  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.style.fontFamily = isRTL ? "'Cairo', 'Segoe UI', system-ui, sans-serif" : "'Syne', 'DM Sans', system-ui, sans-serif";
    localStorage.setItem('lang', lang);
  }, [lang, isRTL]);

  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar');
  return <LangContext.Provider value={{ lang, isRTL, t, toggleLang }}>{children}</LangContext.Provider>;
}
export function useLang() { return useContext(LangContext); }
