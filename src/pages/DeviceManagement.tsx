import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { Laptop, Shield, CheckCircle2, ArrowLeft, Key, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import deviceManagementLifecycleImage from "@/assets/devicemanagement-lifecycle.png";
import robotSecurityImage from "@/assets/robot-security.jpg";

const DeviceManagement = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const soeFeatures = t('deviceMgmt.soeFeatures', { returnObjects: true }) as string[];
  const hardeningFeatures = t('deviceMgmt.hardeningFeatures', { returnObjects: true }) as string[];
  const zeroTouchFeatures = t('deviceMgmt.zeroTouchFeatures', { returnObjects: true }) as string[];
  const lapsFeatures = t('deviceMgmt.lapsFeatures', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-green-500/10 via-background to-background overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-15 hidden lg:block">
          <img src={robotSecurityImage} alt="Security automation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" className="mb-8" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 w-4 h-4" />{t('common.backToSolutions')}
          </Button>
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">{t('deviceMgmt.badge')}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">{t('deviceMgmt.title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{t('deviceMgmt.description')}</p>
            <div className="flex flex-wrap gap-4">
              {['stat1', 'stat2', 'stat3'].map((key) => (
                <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t(`deviceMgmt.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">{t('deviceMgmt.refCase')}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: "15.45K", labelKey: "totalDeployed" },
              { value: "23,175", labelKey: "manHoursSaved" },
              { value: "100%", labelKey: "configConsistency" },
            ].map((stat) => (
              <Card key={stat.labelKey} className="p-6 text-center border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{t(`deviceMgmt.${stat.labelKey}`)}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('deviceMgmt.enterpriseTitle')}</h2>
              <div className="space-y-6">
                {[
                  { icon: Laptop, titleKey: 'soeTitle', descKey: 'soeDesc', features: soeFeatures },
                  { icon: Shield, titleKey: 'hardeningTitle', descKey: 'hardeningDesc', features: hardeningFeatures },
                  { icon: Globe, titleKey: 'zeroTouchTitle', descKey: 'zeroTouchDesc', features: zeroTouchFeatures },
                  { icon: Key, titleKey: 'lapsTitle', descKey: 'lapsDesc', features: lapsFeatures },
                ].map(({ icon: Icon, titleKey, descKey, features }) => (
                  <Card key={titleKey} className="p-6 border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{t(`deviceMgmt.${titleKey}`)}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t(`deviceMgmt.${descKey}`)}</p>
                    <ul className="space-y-2">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:w-[225px] flex-shrink-0">
              <img src={deviceManagementLifecycleImage} alt="The Modern Endpoint Management Lifecycle" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('deviceMgmt.ctaTitle')}</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">{t('deviceMgmt.ctaDesc')}</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to={localizedPath("/contact?source=Device Management Demo Request")}>{t('common.scheduleDemo')}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DeviceManagement;
