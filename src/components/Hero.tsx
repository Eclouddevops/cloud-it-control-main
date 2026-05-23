import robotImage from "@/assets/robot-network.jpg";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  return <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-primary-light/5 to-background overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-20 hidden lg:block">
        <img src={robotImage} alt="AI Robot" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background"></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            {t('hero.title1')}
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
              {t('hero.title2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </div>
    </section>;
};
