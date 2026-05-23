import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { DollarSign, BarChart3, CheckCircle2, ArrowLeft, TrendingDown, Eye, Calendar, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import o365OptimizeImage from "@/assets/o365optimize-column.png";
import robotNetworkImage from "@/assets/robot-network.jpg";

const O365Management = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const realTimeFeatures = t('o365Mgmt.realTimeSummaryFeatures', { returnObjects: true }) as string[];
  const costFeatures = t('o365Mgmt.costAllocationFeatures', { returnObjects: true }) as string[];
  const personaFeatures = t('o365Mgmt.personaAssignFeatures', { returnObjects: true }) as string[];
  const shortTermFeatures = t('o365Mgmt.shortTermFeatures', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-purple-500/10 via-background to-background overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-15 hidden lg:block">
          <img src={robotNetworkImage} alt="License optimization" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" className="mb-8" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 w-4 h-4" />{t('common.backToSolutions')}
          </Button>
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">{t('o365Mgmt.badge')}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">{t('o365Mgmt.title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{t('o365Mgmt.description')}</p>
            <div className="flex flex-wrap gap-4">
              {['stat1', 'stat2', 'stat3'].map((key) => (
                <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t(`o365Mgmt.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">{t('o365Mgmt.refCase')}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, titleKey: 'personaAllocation', descKey: 'personaAllocationDesc' },
              { icon: Clock, titleKey: 'shortTermMgmt', descKey: 'shortTermMgmtDesc' },
              { icon: DollarSign, titleKey: 'costAccountability', descKey: 'costAccountabilityDesc' },
              { icon: TrendingDown, titleKey: 'optimizationInsights', descKey: 'optimizationInsightsDesc' },
            ].map(({ icon: Icon, titleKey, descKey }) => (
              <Card key={titleKey} className="p-6 text-center border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <Icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-muted-foreground">{t(`o365Mgmt.${titleKey}`)}</div>
                <p className="text-xs text-muted-foreground mt-2">{t(`o365Mgmt.${descKey}`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-start">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('o365Mgmt.completeControl')}</h2>
              <div className="space-y-6">
                {[
                  { icon: Eye, titleKey: 'realTimeSummaryTitle', descKey: 'realTimeSummaryDesc', features: realTimeFeatures },
                  { icon: BarChart3, titleKey: 'costAllocationTitle', descKey: 'costAllocationDesc', features: costFeatures },
                  { icon: DollarSign, titleKey: 'personaAssignTitle', descKey: 'personaAssignDesc', features: personaFeatures },
                  { icon: Calendar, titleKey: 'shortTermTitle', descKey: 'shortTermDesc', features: shortTermFeatures },
                ].map(({ icon: Icon, titleKey, descKey, features }) => (
                  <Card key={titleKey} className="p-6 border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{t(`o365Mgmt.${titleKey}`)}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t(`o365Mgmt.${descKey}`)}</p>
                    <ul className="space-y-2">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:w-[400px] sticky top-24 self-start">
              <img src={o365OptimizeImage} alt="O365 License Optimization Guide" className="w-full h-auto max-h-[800px] object-contain rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('o365Mgmt.ctaTitle')}</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">{t('o365Mgmt.ctaDesc')}</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to={localizedPath("/contact?source=O365 Management Demo Request")}>{t('common.scheduleDemo')}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default O365Management;
