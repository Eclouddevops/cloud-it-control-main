import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const Assessment = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('assessment.heroTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('assessment.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <AssessmentForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;
