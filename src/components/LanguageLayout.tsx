import { useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from "./SeoHead";

const SUPPORTED_LANGS = ["en", "sv"];

export const LanguageLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else if (lang && !SUPPORTED_LANGS.includes(lang)) {
      navigate(`/en`, { replace: true });
    }
  }, [lang, i18n, navigate]);

  return (
    <>
      <SeoHead />
      <Outlet />
    </>
  );
};
