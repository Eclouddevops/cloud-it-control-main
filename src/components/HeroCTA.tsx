import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DomainLink } from "./DomainLink";

export const HeroCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gradient-to-b from-background to-primary-light/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group" asChild>
            <DomainLink to="/datasheet/itcontrolbox">
              <FileText className="mr-2 w-5 h-5" />
              {t('heroCTA.technicalDataSheet')}
            </DomainLink>
          </Button>
        </div>
      </div>
    </section>
  );
};
