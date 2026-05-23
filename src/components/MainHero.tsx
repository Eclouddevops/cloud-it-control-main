import { Shield } from "lucide-react";
import robotAnalytics from "@/assets/robot-analytics.jpg";
import { useTranslation } from "react-i18next";

export const MainHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-25 hidden lg:block">
        <img src={robotAnalytics} alt="AI Analytics Robot" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background"></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Shield className="w-4 h-4" />
              {t('mainHero.badge')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-tight">
            {t('mainHero.title1')}
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              {t('mainHero.title2')}
            </span>
          </h1>

          <div className="text-[0.68rem] md:text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed space-y-3">
            <p>{t('mainHero.description1')}</p>
            <p className="font-medium text-foreground">{t('mainHero.description2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
