import { Card } from "@/components/ui/card";
import { Shield, Monitor, FileText, ArrowRight, Lock, Zap, DollarSign, Award, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const categoryKeys = [
  {
    key: "identity",
    icon: Shield,
    highlightIcons: [Lock, Zap, Award],
    highlightKeys: ["securityFirst", "lessEffort", "auditReady"],
    highlightColors: ["text-blue-600 dark:text-blue-400", "text-amber-600 dark:text-amber-400", "text-green-600 dark:text-green-400"],
    color: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
    route: "/identity-management"
  },
  {
    key: "device",
    icon: Monitor,
    highlightIcons: [Zap, Shield, Users],
    highlightKeys: ["minutesNotDays", "secureByDefault", "deployed"],
    highlightColors: ["text-amber-600 dark:text-amber-400", "text-blue-600 dark:text-blue-400", "text-purple-600 dark:text-purple-400"],
    color: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
    route: "/device-management"
  },
  {
    key: "o365",
    icon: FileText,
    highlightIcons: [DollarSign, Zap, Award],
    highlightKeys: ["eliminateWaste", "realTimeData", "fullVisibility"],
    highlightColors: ["text-green-600 dark:text-green-400", "text-amber-600 dark:text-amber-400", "text-blue-600 dark:text-blue-400"],
    color: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
    route: "/o365-management"
  }
];

export const ProductCategories = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(localizedPath(route));
  };

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t('productCategories.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('productCategories.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categoryKeys.map((cat, index) => {
            const features = t(`productCategories.${cat.key}.features`, { returnObjects: true }) as string[];
            return (
              <Card key={cat.key} className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-card animate-slide-up flex flex-col cursor-pointer" style={{ animationDelay: `${index * 150}ms` }} onClick={() => handleNavigate(cat.route)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="relative p-6 space-y-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{t(`productCategories.${cat.key}.title`)}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.highlightKeys.map((hk, i) => {
                      const HIcon = cat.highlightIcons[i];
                      return (
                        <Badge key={hk} variant="outline" className="flex items-center gap-1.5 px-3 py-1 border-border/50 bg-background/50">
                          <HIcon className={`w-3.5 h-3.5 ${cat.highlightColors[i]}`} />
                          <span className="text-xs font-medium">{t(`productCategories.${cat.key}.highlights.${hk}`)}</span>
                        </Badge>
                      );
                    })}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`productCategories.${cat.key}.description`)}</p>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {t('common.keyFeatures')}
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                          <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mt-auto" onClick={(e) => { e.stopPropagation(); handleNavigate(cat.route); }}>
                    {t('common.viewDetails')}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
