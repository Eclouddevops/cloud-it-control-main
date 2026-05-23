import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const GTM_ID = "GTM-WQGVZDL3";
const CONSENT_KEY = "cookie_consent";

type ConsentValue = "accepted" | "declined";

function loadGTM() {
  // Prevent double-loading
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) return;

  // GTM script
  (function (w: any, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode?.insertBefore(j, f);
  })(window, document, "script", "dataLayer", GTM_ID);

  // noscript iframe
  if (!document.querySelector(`iframe[src*="googletagmanager.com/ns.html?id=${GTM_ID}"]`)) {
    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
    if (stored === "accepted") {
      loadGTM();
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    loadGTM();
    setVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              {t("cookie.title")}
            </p>
            <p>
              {t("cookie.description")}{" "}
              <a
                href={`/${t("cookie.lang", { defaultValue: "en" })}/privacy-policy`}
                className="underline text-primary hover:text-primary/80"
              >
                {t("cookie.privacyLink")}
              </a>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-initial"
            >
              {t("cookie.decline")}
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-initial"
            >
              {t("cookie.accept")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
