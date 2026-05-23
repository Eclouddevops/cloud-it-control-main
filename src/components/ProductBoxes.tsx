import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const products = [
  { id: "itcontrolbox", icon: Shield, titleKey: "itControlBox", subKey: "itControlBoxSub", route: "/", iconColor: "text-blue-600 dark:text-blue-400" },
  { id: "it-asset-management", icon: TrendingUp, titleKey: "itam", subKey: "itamSub", route: "/itam", iconColor: "text-blue-600 dark:text-blue-400" },
  { id: "ai-obz", icon: Brain, titleKey: "aiObz", subKey: "aiObzSub", route: "/ai-obz", iconColor: "text-purple-600 dark:text-purple-400" },
];

export const ProductBoxes = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card
              key={product.id}
              className="p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-border bg-card"
              onClick={() => navigate(localizedPath(product.route))}
            >
              <div className="flex justify-center mb-6">
                <product.icon className={`w-16 h-16 ${product.iconColor}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t(`productBoxes.${product.titleKey}`)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(`productBoxes.${product.subKey}`)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
