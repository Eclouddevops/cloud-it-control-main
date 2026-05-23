import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead />
      <Navigation />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-neutral dark:prose-invert">
            <h1 className="text-4xl font-bold text-foreground mb-2">{t('privacy.title')}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t('privacy.lastUpdated')}</p>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s1Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s1p1')}</p>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s1p2')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s2Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.s2p1')}{" "}
                <a href="mailto:althea@aiobz.com" className="text-primary hover:underline">althea@aiobz.com</a>.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s3Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s3p1')}</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong className="text-foreground">{t('privacy.s3Contact')}</strong> {t('privacy.s3ContactDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s3Usage')}</strong> {t('privacy.s3UsageDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s3Assessment')}</strong> {t('privacy.s3AssessmentDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s3Communication')}</strong> {t('privacy.s3CommunicationDesc')}</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s4Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s4p1')}</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong className="text-foreground">{t('privacy.s4Consent')}</strong> {t('privacy.s4ConsentDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s4Legitimate')}</strong> {t('privacy.s4LegitimateDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s4Contract')}</strong> {t('privacy.s4ContractDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s4Legal')}</strong> {t('privacy.s4LegalDesc')}</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s5Title')}</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('privacy.s5i1')}</li>
                <li>{t('privacy.s5i2')}</li>
                <li>{t('privacy.s5i3')}</li>
                <li>{t('privacy.s5i4')}</li>
                <li>{t('privacy.s5i5')}</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s6Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s6p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s7Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s7p1')}</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong className="text-foreground">{t('privacy.s7Service')}</strong> {t('privacy.s7ServiceDesc')}</li>
                <li><strong className="text-foreground">{t('privacy.s7Legal')}</strong> {t('privacy.s7LegalDesc')}</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s7p2')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s8Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s8p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s9Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s9p1')}</p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">{t('privacy.s10Title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('privacy.s10p1')}</p>
            </section>

            <div className="mt-12 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground italic">{t('privacy.disclaimer')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
