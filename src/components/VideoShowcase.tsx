interface VideoShowcaseProps {
  vimeoId?: string;
  title?: string;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  full: "max-w-6xl",
};

export const VideoShowcase = ({ 
  vimeoId = "1154475407",
  title = "See IT Control Box in Action",
  description = "Watch how our automation platform transforms IT operations",
  maxWidth = "xl"
}: VideoShowcaseProps) => {
  const containerWidth = maxWidthClasses[maxWidth];
  const headerWidth = maxWidth === "sm" ? "max-w-xl" : maxWidth === "md" ? "max-w-2xl" : "max-w-4xl";
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`${headerWidth} mx-auto text-center mb-8`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        
        <div className={`${containerWidth} mx-auto`}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
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
                title="IT Governance and control with Automation in User identity and device management"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
