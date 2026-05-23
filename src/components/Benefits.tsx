import { Clock, DollarSign, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Benefits = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: Clock, title: t('benefits.items.0.title'), description: t('benefits.items.0.description') },
    { icon: ShieldCheck, title: t('benefits.items.1.title'), description: t('benefits.items.1.description') },
    { icon: DollarSign, title: t('benefits.items.2.title'), description: t('benefits.items.2.description') },
    { icon: Zap, title: t('benefits.items.3.title'), description: t('benefits.items.3.description') },
  ];

  return (
    <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('benefits.title')}</h2>
          <p className="text-xl text-primary-foreground/90">{t('benefits.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="group text-center space-y-4 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
