import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Brain, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const productKeys = [
  {
    id: "itcontrolbox",
    key: "itControlBox",
    icon: Shield,
    highlightIcons: [Clock, Shield, CheckCircle2],
    highlightKeys: ["timeSaved", "auditReady", "zeroSubs"],
    highlightColors: ["text-amber-600 dark:text-amber-400", "text-blue-600 dark:text-blue-400", "text-green-600 dark:text-green-400"],
    color: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
    route: "/"
  },
  {
    id: "aiobz-itam",
    key: "itam",
    icon: TrendingUp,
    highlightIcons: [Sparkles, TrendingUp, Shield],
    highlightKeys: ["autoDiscovery", "costSavings", "fullCompliance"],
    highlightColors: ["text-purple-600 dark:text-purple-400", "text-green-600 dark:text-green-400", "text-blue-600 dark:text-blue-400"],
    color: "from-emerald-500 to-green-600",
    bgGradient: "from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
    route: "/itam"
  },
  {
    id: "ai-obz",
    key: "aiObz",
    icon: Brain,
    highlightIcons: [Brain, Sparkles, Clock],
    highlightKeys: ["aiPowered", "predictive", "realTime"],
    highlightColors: ["text-purple-600 dark:text-purple-400", "text-amber-600 dark:text-amber-400", "text-blue-600 dark:text-blue-400"],
    color: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
    route: "/ai-obz"
  }
];

export const ProductsOverview = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(localizedPath(route));
  };

  return (
    <section id="products" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {productKeys.map((product, index) => {
            const features = t(`productsOverview.${product.key}.features`, { returnObjects: true }) as string[];
            return (
              <Card
                key={product.id}
                className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-card animate-slide-up flex flex-col cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleNavigate(product.route)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative p-6 space-y-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{t(`productsOverview.${product.key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`productsOverview.${product.key}.subtitle`)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.highlightKeys.map((hk, i) => {
                      const HIcon = product.highlightIcons[i];
                      return (
                        <Badge key={hk} variant="outline" className="flex items-center gap-1.5 px-3 py-1 border-border/50 bg-background/50">
                          <HIcon className={`w-3.5 h-3.5 ${product.highlightColors[i]}`} />
                          <span className="text-xs font-medium">{t(`productsOverview.${product.key}.highlights.${hk}`)}</span>
                        </Badge>
                      );
                    })}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`productsOverview.${product.key}.description`)}</p>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {t('common.keyCapabilities')}
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

                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mt-auto"
                    onClick={(e) => { e.stopPropagation(); handleNavigate(product.route); }}
                  >
                    {t('common.learnMore')}
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
