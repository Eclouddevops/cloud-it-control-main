import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const linkedInPosts = [
  { id: 1, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7420481516033540096?collapsed=1" },
  { id: 2, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7414069163876548608?collapsed=1" },
  { id: 3, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7416531316566921216?collapsed=1" },
  { id: 4, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7418631450247258112?collapsed=1" },
  { id: 5, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7419325494678085632?collapsed=1" },
];

const linkedInVideos = [
  { id: 1, embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7417345038260715520?collapsed=1" },
];

const Media = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t('media.title')}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{t('media.description')}</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">{t('media.blogs')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {linkedInPosts.map((post) => (
                <div key={post.id} className="w-full max-w-[504px]">
                  <iframe src={post.embedUrl} height="592" width="100%" frameBorder="0" allowFullScreen title={`LinkedIn post ${post.id}`} className="rounded-lg shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">{t('media.videos')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {linkedInVideos.map((video) => (
                <div key={video.id} className="w-full max-w-[504px]">
                  <iframe src={video.embedUrl} height="541" width="100%" frameBorder="0" allowFullScreen title={`LinkedIn video ${video.id}`} className="rounded-lg shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Media;
