import { useParams } from "react-router-dom";
import i18n from "@/i18n";

/**
 * Returns the current language prefix from the URL (e.g., "en" or "sv").
 * Also provides a helper to prepend the prefix to any path.
 */
export const useLocalizedPath = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language || "en";

  const localizedPath = (path: string) => {
    // If path already starts with /en/ or /sv/, return as-is
    if (path.startsWith("/en/") || path.startsWith("/sv/") || path === "/en" || path === "/sv") {
      return path;
    }
    // Strip leading slash for joining
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${currentLang}${cleanPath}`;
  };

  return { lang: currentLang, localizedPath };
};
