import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { Shield, Users, Key, FileCheck, CheckCircle2, ArrowLeft, Zap, Lock, UserCheck, AlertTriangle, RefreshCcw, Database } from "lucide-react";
import { useTranslation } from "react-i18next";
import idamLifecycleImage from "@/assets/IDAM-lifecycle.png";
import robotAnalyticsImage from "@/assets/robot-analytics.jpg";

const IdentityManagement = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const joinerFeatures = t('identityMgmt.joinerFeatures', { returnObjects: true }) as string[];
  const moverFeatures = t('identityMgmt.moverFeatures', { returnObjects: true }) as string[];
  const leaverFeatures = t('identityMgmt.leaverFeatures', { returnObjects: true }) as string[];
  const centralizedFeatures = t('identityMgmt.centralizedFeatures', { returnObjects: true }) as string[];
  const lapsFeatures = t('identityMgmt.lapsFeatures', { returnObjects: true }) as string[];
  const igaFeatures = t('identityMgmt.igaFeatures', { returnObjects: true }) as string[];
  const complianceFeatures = t('identityMgmt.complianceFeatures', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-light/10 via-background to-background overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-15 hidden lg:block">
          <img src={robotAnalyticsImage} alt="Identity automation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" className="mb-8" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            {t('common.backToSolutions')}
          </Button>
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">{t('identityMgmt.badge')}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">{t('identityMgmt.title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{t('identityMgmt.description')}</p>
            <div className="flex flex-wrap gap-4">
              {['stat1', 'stat2', 'stat3'].map((key) => (
                <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t(`identityMgmt.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Joiner-Mover-Leaver Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('identityMgmt.lifecycleTitle')}</h2>
            <p className="text-lg text-muted-foreground">{t('identityMgmt.lifecycleSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* Joiner */}
            <Card className="p-6 border-border hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">{t('identityMgmt.joiner')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.joinerSubtitle')}</p>
              <ul className="space-y-2">
                {joinerFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
            {/* Mover */}
            <Card className="p-6 border-border hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                <RefreshCcw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-700 dark:text-amber-400">{t('identityMgmt.mover')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.moverSubtitle')}</p>
              <ul className="space-y-2">
                {moverFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
            {/* Leaver */}
            <Card className="p-6 border-border hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">{t('identityMgmt.leaver')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.leaverSubtitle')}</p>
              <ul className="space-y-2">
                {leaverFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-start">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{t('identityMgmt.comprehensiveTitle')}</h2>
              <div className="space-y-6">
                {/* Centralized */}
                <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t('identityMgmt.centralizedTitle')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.centralizedDesc')}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {centralizedFeatures.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* LAPS */}
                <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t('identityMgmt.lapsTitle')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.lapsDesc')}</p>
                  <ul className="space-y-2">
                    {lapsFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* IGA */}
                <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t('identityMgmt.igaTitle')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.igaDesc')}</p>
                  <ul className="space-y-2">
                    {igaFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Compliance */}
                <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t('identityMgmt.complianceTitle')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t('identityMgmt.complianceDesc')}</p>
                  <ul className="space-y-2">
                    {complianceFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
            <div className="lg:w-[450px] flex-shrink-0">
              <img src={idamLifecycleImage} alt="Automating the Full Identity Lifecycle with IT Control Box" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('identityMgmt.benefitsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { icon: Shield, key: 'forLeadership' },
              { icon: Zap, key: 'forITManagers' },
              { icon: UserCheck, key: 'forITSupport' },
              { icon: Lock, key: 'forEndUsers' },
            ].map(({ icon: Icon, key }) => (
              <Card key={key} className="p-6 text-center border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t(`identityMgmt.${key}`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`identityMgmt.${key}Desc`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('identityMgmt.ctaTitle')}</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">{t('identityMgmt.ctaDesc')}</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to={localizedPath("/contact?source=Identity Management Demo Request")}>{t('common.scheduleDemo')}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IdentityManagement;
