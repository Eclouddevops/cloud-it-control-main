import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { DomainLink } from "@/components/DomainLink";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead />
      <Navigation />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-neutral dark:prose-invert">
            <h1 className="text-4xl font-bold text-foreground mb-2">{t('terms.title')}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t('terms.lastUpdated')}</p>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s1Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s1p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s2Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s2p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s3Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s3p1')}</p>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s3p2')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s4Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s4p1')}</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('terms.s4i1')}</li>
                <li>{t('terms.s4i2')}</li>
                <li>{t('terms.s4i3')}</li>
                <li>{t('terms.s4i4')}</li>
                <li>{t('terms.s4i5')}</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s5Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s5p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s6Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s6p1')}</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('terms.s6i1')}</li>
                <li>{t('terms.s6i2')}</li>
                <li>{t('terms.s6i3')}</li>
                <li>{t('terms.s6i4')}</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s7Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.s7p1')}{" "}
                <DomainLink to="/privacy-policy" className="text-primary hover:underline">{t('terms.s7PrivacyLink')}</DomainLink>.{" "}
                {t('terms.s7p1b')}
              </p>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s7p2')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s8Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s8p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s9Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s9p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s10Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s10p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s11Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s11p1')}</p>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s11p2')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s12Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('terms.s12p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('terms.s13Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.s13p1')}{" "}
                <a href="mailto:althea@aiobz.com" className="text-primary hover:underline">althea@aiobz.com</a>.
              </p>
            </section>

            <div className="mt-12 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground italic">{t('terms.disclaimer')}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground">{t('terms.copyright')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
