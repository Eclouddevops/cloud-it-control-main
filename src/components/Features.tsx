import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Features = () => {
  const { t } = useTranslation();
  const groups = t('features.groups', { returnObjects: true }) as { category: string; features: string[] }[];

  return (
    <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            {t('features.badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {groups.map((group: any, groupIndex: number) => (
            <div 
              key={groupIndex}
              className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${groupIndex * 150}ms` }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border">
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
