import { Button } from "@/components/ui/button";
import linkedInLogo from "@/assets/linkedin-logo.png";
import { useTranslation } from "react-i18next";

interface ShareToLinkedInProps {
  url?: string;
  title?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export const ShareToLinkedIn = ({
  url,
  title,
  variant = "outline",
  size = "sm",
  className = "",
  showLabel = true,
}: ShareToLinkedInProps) => {
  const { t } = useTranslation();

  const handleShare = () => {
    const shareUrl = url || window.location.href;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInShareUrl, "_blank", "width=600,height=600");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`gap-2 ${className}`}
      title={title || t('common.shareOnLinkedin')}
    >
      <img src={linkedInLogo} alt="LinkedIn" className="w-4 h-4" />
      {showLabel && <span>{t('common.shareOnLinkedin')}</span>}
    </Button>
  );
};
