import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Shield, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import { ClientLogos } from "@/components/ClientLogos";
import { ShareToLinkedIn } from "@/components/ShareToLinkedIn";
import { useTranslation } from "react-i18next";
import { DomainLink } from "@/components/DomainLink";

const storyIcons = [Globe, Shield, DollarSign];
const storyColors = ["blue", "green", "purple"];

const colorClasses = {
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: "bg-blue-500",
    metric: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
  },
  green: {
    badge: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: "bg-green-500",
    metric: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    gradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
  },
  purple: {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: "bg-purple-500",
    metric: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
  }
};

const SuccessStories = () => {
  const { t } = useTranslation();
  const stories = t('successStories.stories', { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <ClientLogos />

        {/* Video with Share Button */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('successStories.videoTitle')}</h2>
              <p className="text-lg text-muted-foreground">{t('successStories.videoDescription')}</p>
            </div>
            
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="flex-shrink-0 pt-2">
                <ShareToLinkedIn 
                  title={t('successStories.shareTitle')}
                  size="icon"
                  showLabel={false}
                  className="hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]"
                />
              </div>
              
              <div className="flex-1">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
                  <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                    <iframe
                      src="https://player.vimeo.com/video/1160661205?badge=0&autopause=0&player_id=0&app_id=58479"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      title={t('successStories.videoTitle')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {stories.map((story: any, index: number) => {
                const color = storyColors[index] as keyof typeof colorClasses;
                const colors = colorClasses[color];
                const IconComponent = storyIcons[index];
                return (
                  <Card key={index} className={`p-8 md:p-12 ${colors.border} bg-gradient-to-br ${colors.gradient}`}>
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{story.title}</h2>
                            <p className={`text-lg ${colors.metric} font-medium`}>{story.subtitle}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              {t('common.theChallenge')}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{story.challenge}</p>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              {t('common.theSolution')}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{story.solution}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground">{t('common.keyHighlights')}</h3>
                          <ul className="space-y-2">
                            {story.highlights.map((highlight: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className={`w-4 h-4 ${colors.metric} flex-shrink-0 mt-0.5`} />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {story.metrics.map((metric: any, i: number) => (
                          <Card key={i} className="p-6 text-center bg-background/50 backdrop-blur-sm px-[2px]">
                            <div className={`text-3xl md:text-4xl font-bold ${colors.metric} mb-2`}>{metric.value}</div>
                            <div className="text-sm text-muted-foreground">{metric.label}</div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('successStories.ctaTitle')}</h2>
              <p className="text-lg text-muted-foreground">{t('successStories.ctaDescription')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <DomainLink to="/contact">
                    {t('common.contactUs')}
                    <ArrowRight className="w-4 h-4" />
                  </DomainLink>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;
