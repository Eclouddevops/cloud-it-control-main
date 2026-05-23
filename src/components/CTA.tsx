import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DomainLink } from "./DomainLink";

export const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              asChild
            >
              <DomainLink to="/contact?source=Contact Sales">
                <Mail className="mr-2 w-5 h-5" />
                {t('common.contactSales')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </DomainLink>
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">{t('cta.noRecurringFees')}</div>
              <div className="text-white/80 text-sm">{t('cta.getStarted')}</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">{t('cta.noPerDeviceFee')}</div>
              <div className="text-white/80 text-sm">{t('cta.transparentPricing')}</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">{t('cta.noPerUserFees')}</div>
              <div className="text-white/80 text-sm">{t('cta.unlimitedUsers')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
