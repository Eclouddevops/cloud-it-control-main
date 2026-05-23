import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AIOBZ_BASE = "https://www.aiobz.com";
const OG_IMAGE_URL = `${AIOBZ_BASE}/og-image.png?v=2`;

/**
 * SEO metadata per route — provides translated titles and descriptions.
 */
const seoKeys: Record<string, { titleKey: string; descKey: string }> = {
  "": { titleKey: "seo.home.title", descKey: "seo.home.description" },
  "itcontrolbox": { titleKey: "seo.home.title", descKey: "seo.home.description" },
  "products": { titleKey: "seo.products.title", descKey: "seo.products.description" },
  "itam": { titleKey: "seo.itam.title", descKey: "seo.itam.description" },
  "ai-obz": { titleKey: "seo.aiObz.title", descKey: "seo.aiObz.description" },
  "identity-management": { titleKey: "seo.identity.title", descKey: "seo.identity.description" },
  "device-management": { titleKey: "seo.device.title", descKey: "seo.device.description" },
  "o365-management": { titleKey: "seo.o365.title", descKey: "seo.o365.description" },
  "about-us": { titleKey: "seo.aboutUs.title", descKey: "seo.aboutUs.description" },
  "success-stories": { titleKey: "seo.successStories.title", descKey: "seo.successStories.description" },
  "media": { titleKey: "seo.media.title", descKey: "seo.media.description" },
  "contact": { titleKey: "seo.contact.title", descKey: "seo.contact.description" },
  "assessment": { titleKey: "seo.assessment.title", descKey: "seo.assessment.description" },
  "it-asset-management": { titleKey: "seo.itAssetMgmt.title", descKey: "seo.itAssetMgmt.description" },
  "datasheet/itcontrolbox": { titleKey: "seo.datasheet.title", descKey: "seo.datasheet.description" },
  "cognitia": { titleKey: "seo.cognitia.title", descKey: "seo.cognitia.description" },
};

export const SeoHead = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const match = pathname.match(/^\/(en|sv)(\/.*)?$/);
    const currentLang = match?.[1] || "en";
    const restPath = match?.[2] || "";
    const routeKey = restPath.replace(/^\//, "");

    // --- HTML lang ---
    document.documentElement.lang = currentLang;

    // --- Title & Description ---
    const seo = seoKeys[routeKey] || seoKeys[""];
    const title = t(seo.titleKey);
    const description = t(seo.descKey);
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) {
      metaDesc.content = description;
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      metaDesc.content = description;
      document.head.appendChild(metaDesc);
    }

    // --- Canonical ---
    const canonicalUrl = routeKey === ""
      ? `${AIOBZ_BASE}/${currentLang}`
      : `${AIOBZ_BASE}/${currentLang}/${routeKey}`;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    // --- Hreflang ---
    document.querySelectorAll("link[data-hreflang]").forEach((el) => el.remove());

    ["en", "sv"].forEach((lang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = routeKey === ""
        ? `${AIOBZ_BASE}/${lang}`
        : `${AIOBZ_BASE}/${lang}/${routeKey}`;
      link.setAttribute("data-hreflang", "true");
      document.head.appendChild(link);
    });

    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.hreflang = "x-default";
    xDefault.href = routeKey === ""
      ? `${AIOBZ_BASE}/en`
      : `${AIOBZ_BASE}/en/${routeKey}`;
    xDefault.setAttribute("data-hreflang", "true");
    document.head.appendChild(xDefault);

    // --- Open Graph ---
    const setOgMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (el) {
        el.content = content;
      } else {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        el.content = content;
        document.head.appendChild(el);
      }
    };
    setOgMeta("og:title", title);
    setOgMeta("og:description", description);
    setOgMeta("og:url", canonicalUrl);
    setOgMeta("og:locale", currentLang === "sv" ? "sv_SE" : "en_US");
    setOgMeta("og:image", OG_IMAGE_URL);
    setOgMeta("og:image:width", "512");
    setOgMeta("og:image:height", "512");
    setOgMeta("og:type", "website");
    setOgMeta("og:site_name", "AIObz - IT Control Box");

    // Twitter
    const setTwitterMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (el) {
        el.content = content;
      } else {
        el = document.createElement("meta");
        el.name = name;
        el.content = content;
        document.head.appendChild(el);
      }
    };
    setTwitterMeta("twitter:card", "summary");
    setTwitterMeta("twitter:title", title);
    setTwitterMeta("twitter:description", description);
    setTwitterMeta("twitter:image", OG_IMAGE_URL);

    // --- JSON-LD ---
    let jsonLd = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AIObz Consulting",
      "url": `${AIOBZ_BASE}/${currentLang}`,
      "logo": OG_IMAGE_URL,
      "description": description,
      "inLanguage": currentLang === "sv" ? "sv-SE" : "en-US",
      "sameAs": ["https://www.linkedin.com/company/aiobz"],
      "offers": [
        { "@type": "Offer", "name": "IT Control Box", "description": t("seo.home.description") },
        { "@type": "Offer", "name": "ITAM", "description": t("seo.itam.description") },
        { "@type": "Offer", "name": "AI OBZ", "description": t("seo.aiObz.description") },
      ],
    };

    if (jsonLd) {
      jsonLd.textContent = JSON.stringify(jsonLdData);
    } else {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.setAttribute("data-seo-jsonld", "true");
      jsonLd.textContent = JSON.stringify(jsonLdData);
      document.head.appendChild(jsonLd);
    }
  }, [pathname, i18n.language, t]);

  return null;
};
