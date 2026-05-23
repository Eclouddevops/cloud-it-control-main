import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Users, Shield, Laptop, Monitor, Mail, FileCheck,
  Key, Fingerprint, RefreshCw, Clock, Upload, Trash2,
  HardDrive, Lock, Server, Usb, Calendar, Ban, Network,
  CheckCircle, ScrollText, Info
} from "lucide-react";
import { useTranslation } from "react-i18next";

const capabilityMeta = [
  {
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    featureIcons: [Fingerprint, RefreshCw, Key]
  },
  {
    icon: Shield,
    color: "from-emerald-500 to-green-500",
    featureIcons: [RefreshCw, Lock, Clock]
  },
  {
    icon: Laptop,
    color: "from-violet-500 to-purple-500",
    featureIcons: [Upload, Trash2, HardDrive]
  },
  {
    icon: Monitor,
    color: "from-orange-500 to-amber-500",
    featureIcons: [Server, Shield, Usb]
  },
  {
    icon: Mail,
    color: "from-rose-500 to-pink-500",
    featureIcons: [Calendar, Ban, Network]
  },
  {
    icon: FileCheck,
    color: "from-slate-500 to-gray-600",
    featureIcons: [CheckCircle, ScrollText]
  }
];

export const TechnicalFeatures = () => {
  const { t } = useTranslation();
  const capabilities = t('technicalFeatures.capabilities', { returnObjects: true }) as any[];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('technicalFeatures.title')}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('technicalFeatures.description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {capabilities.map((capability: any, index: number) => {
            const meta = capabilityMeta[index];
            const CapIcon = meta.icon;
            return (
              <Card 
                key={index}
                className="p-8 border-border hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <CapIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{capability.title}</h3>
                    <p className="text-muted-foreground">{capability.description}</p>
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${capability.features.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
                  <TooltipProvider delayDuration={100}>
                    {capability.features.map((feature: any, fi: number) => {
                      const FIcon = meta.featureIcons[fi] || Info;
                      return (
                        <Tooltip key={fi}>
                          <TooltipTrigger asChild>
                            <div className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border cursor-help">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                                  <FIcon className="w-4 h-4 text-primary" />
                                </div>
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                                  {feature.title}
                                </h4>
                                <Info className="w-4 h-4 text-muted-foreground ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs p-3 text-sm">
                            {feature.desc}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
