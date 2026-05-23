import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const SwedenFlag = ({ className = "w-6 h-4", title }: { className?: string; title?: string }) => (
  <svg viewBox="0 0 16 10" className={className} aria-hidden="true">
    {title && <title>{title}</title>}
    <rect width="16" height="10" fill="#006AA7" />
    <rect x="5" width="2" height="10" fill="#FECC00" />
    <rect y="4" width="16" height="2" fill="#FECC00" />
  </svg>
);

const UKFlag = ({ className = "w-6 h-4", title }: { className?: string; title?: string }) => (
  <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
    {title && <title>{title}</title>}
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(newLang);

    // Replace the language prefix in the current URL
    const currentPath = location.pathname;
    const rest = lang ? currentPath.replace(`/${lang}`, '') : currentPath;
    const newPath = `/${newLang}${rest || ''}`;
    navigate(newPath + location.search + location.hash, { replace: true });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors"
      aria-label={i18n.language === 'sv' ? 'Switch to English' : 'Byt till svenska'}
    >
      {i18n.language === 'sv' ? (
        <UKFlag className="w-7 h-5 rounded-sm shadow-sm" title="English" />
      ) : (
        <SwedenFlag className="w-7 h-5 rounded-sm shadow-sm" title="Svenska" />
      )}
    </button>
  );
};
