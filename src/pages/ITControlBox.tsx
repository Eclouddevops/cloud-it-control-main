import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroCTA } from "@/components/HeroCTA";
import { ProductCategories } from "@/components/ProductCategories";
import { Benefits } from "@/components/Benefits";
import { Features } from "@/components/Features";
import { TechnicalFeatures } from "@/components/TechnicalFeatures";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ShareToLinkedIn } from "@/components/ShareToLinkedIn";
import { useTranslation } from "react-i18next";

const ITControlBox = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProductCategories />
      
      {/* Video with Share Button */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('itcb.videoTitle')}</h2>
            <p className="text-lg text-muted-foreground">{t('itcb.videoDescription')}</p>
          </div>
          
          <div className="max-w-5xl mx-auto flex items-start gap-4">
            <div className="flex-shrink-0 pt-2">
              <ShareToLinkedIn 
                title={t('itcb.shareTitle')}
                size="icon"
                showLabel={false}
                className="hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]"
              />
            </div>
            
            <div className="flex-1">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
                <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                  <iframe
                    src="https://player.vimeo.com/video/1154475407?badge=0&autopause=0&player_id=0&app_id=58479"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%"
                    }}
                    title={t('itcb.videoTitle')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroCTA />
      <Benefits />
      <Features />
      <TechnicalFeatures />
      <CTA />
      <Footer />
    </div>
  );
};

export default ITControlBox;
