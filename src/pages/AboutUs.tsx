import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useTranslation } from "react-i18next";
import maheshKoliImage from "@/assets/mahesh-koli.png";
import vinodDadheImage from "@/assets/vinod-dadhe.png";

const AboutUs = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Vision Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('aboutUs.title')}
              </h1>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                  {t('aboutUs.ourVision')}
                </h2>
                <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed border-l-4 border-primary pl-6 text-left">
                  {t('aboutUs.visionQuote')}
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
                {t('aboutUs.leadershipTeam')}
              </h2>

              {/* Mahesh Koli */}
              <div className="mb-20">
                <Card className="overflow-hidden border-border/50 shadow-lg">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                        <div className="relative text-center">
                          <img src={maheshKoliImage} alt={t('aboutUs.mahesh.name')} className="w-64 h-64 object-cover rounded-full border-4 border-primary/20 shadow-xl" />
                          <a href="https://www.linkedin.com/in/mkoli/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors">
                            <Linkedin className="w-5 h-5" />
                            <span className="text-sm font-medium">{t('common.linkedinProfile')}</span>
                          </a>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                          {t('aboutUs.mahesh.name')}
                        </h3>
                        <p className="text-lg text-primary font-semibold mb-6">
                          {t('aboutUs.mahesh.role')}
                        </p>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                          <p>{t('aboutUs.mahesh.bio1')}</p>
                          <p>{t('aboutUs.mahesh.bio2')}</p>
                          <p>{t('aboutUs.mahesh.bio3')}</p>
                        </div>
                        <blockquote className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary italic text-muted-foreground">
                          {t('aboutUs.mahesh.quote')}
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vinod Dadhe */}
              <div>
                <Card className="overflow-hidden border-border/50 shadow-lg">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center md:order-last">
                        <div className="relative text-center">
                          <img src={vinodDadheImage} alt={t('aboutUs.vinod.name')} className="w-64 h-64 object-cover rounded-full border-4 border-primary/20 shadow-xl" />
                          <a href="https://www.linkedin.com/in/vvdadhe/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors">
                            <Linkedin className="w-5 h-5" />
                            <span className="text-sm font-medium">{t('common.linkedinProfile')}</span>
                          </a>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                          {t('aboutUs.vinod.name')}
                        </h3>
                        <p className="text-lg text-primary font-semibold mb-6">
                          {t('aboutUs.vinod.role')}
                        </p>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                          <p>{t('aboutUs.vinod.bio1')}</p>
                          <p>{t('aboutUs.vinod.bio2')}</p>
                          <p>{t('aboutUs.vinod.bio3')}</p>
                        </div>
                        <blockquote className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary italic text-muted-foreground">
                          {t('aboutUs.vinod.quote')}
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">
                {t('aboutUs.getInTouch')}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{t('aboutUs.india')}</h3>
                        <p className="text-muted-foreground text-sm">{t('aboutUs.indiaAddress')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{t('aboutUs.sweden')}</h3>
                        <p className="text-muted-foreground text-sm">{t('aboutUs.swedenAddress')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:info@itcontrolbox.com" className="hover:text-primary transition-colors">
                    info@itcontrolbox.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button asChild size="lg">
                    <Link to={localizedPath("/contact")}>{t('common.contactUs')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="https://www.linkedin.com/company/itcontrolbox" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      <Linkedin className="w-5 h-5" />
                      {t('common.followUs')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
