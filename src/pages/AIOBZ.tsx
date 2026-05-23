import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DomainLink } from "@/components/DomainLink";
import {
  Brain,
  Sparkles,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  Search,
  Zap,
  BarChart3,
  Bell,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [Brain, AlertTriangle, Search, Activity, Bell, BarChart3];

const highlightMeta = [
  { icon: Brain, color: "text-purple-600 dark:text-purple-400" },
  { icon: Sparkles, color: "text-amber-600 dark:text-amber-400" },
  { icon: Clock, color: "text-blue-600 dark:text-blue-400" },
  { icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
];

const AIOBZ = () => {
  const { t } = useTranslation();
  const features = t('aiobz.features', { returnObjects: true }) as { title: string; description: string }[];
  const highlightKeys = ['aiPowered', 'predictiveAnalytics', 'realTimeInsights', 'proactiveOperations'];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-background via-purple-500/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t('aiobz.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
              {t('aiobz.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('aiobz.description')}
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {highlightKeys.map((key, i) => {
                const meta = highlightMeta[i];
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 text-sm border-border/50 bg-background/50"
                  >
                    <meta.icon className={`w-4 h-4 ${meta.color}`} />
                    <span className="font-medium">{t(`aiobz.highlights.${key}`)}</span>
                  </Badge>
                );
              })}
            </div>

            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              asChild
            >
              <DomainLink to="/contact?source=AI OBZ">
                {t('common.contactUs')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </DomainLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('aiobz.whatToExpect')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('aiobz.whatToExpectDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const FIcon = featureIcons[index] || Brain;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-purple-500/50 bg-card animate-slide-up opacity-80"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <FIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('aiobz.futureTitle')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('aiobz.futureDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">90%</div>
                <div className="text-sm text-muted-foreground">{t('aiobz.reductionNoise')}</div>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">70%</div>
                <div className="text-sm text-muted-foreground">{t('aiobz.fasterRCA')}</div>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50%</div>
                <div className="text-sm text-muted-foreground">{t('aiobz.fewerIncidents')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('aiobz.ctaTitle')}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {t('aiobz.ctaDesc')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <DomainLink to="/products">
                  {t('common.exploreOtherProducts')}
                </DomainLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIOBZ;
