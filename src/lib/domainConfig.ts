/**
 * Domain configuration.
 * Single-domain setup: aiobz.com serves everything.
 * itcontrolbox.com forwards to aiobz.com via GoDaddy domain forwarding.
 */

/**
 * Publishable anti-abuse token for the contact email endpoint.
 * Must match the CONTACT_FORM_SECRET stored in backend secrets.
 */
export const CONTACT_FORM_TOKEN = "itcb-contact-2025-secure";

/** Cross-domain navigation is no longer needed — always use SPA navigation */
export const needsCrossDomainNavigation = (_targetRoutePath: string): boolean => false;

export const getCorrectDomainUrl = (lang: string, routePath: string): string => {
  const cleanPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  if (cleanPath === "/" || cleanPath === "") return `/${lang}`;
  return `/${lang}${cleanPath}`;
};

export const isWrongDomain = (_routePath: string): boolean => false;
