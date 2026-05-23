import aiobzLogo from "@/assets/itcontrolbox-logo.png";
import { useTranslation } from "react-i18next";
import { DomainLink } from "./DomainLink";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={aiobzLogo} alt="AIObz Logo" className="h-8 w-auto" />
                <h3 className="text-xl font-bold text-foreground">AIObz</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.products')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><DomainLink to="/products" className="hover:text-primary transition-colors">{t('footer.products')}</DomainLink></li>
                <li><DomainLink to="/" className="hover:text-primary transition-colors">IT Control Box</DomainLink></li>
                <li><DomainLink to="/itam" className="hover:text-primary transition-colors">IT Asset Management</DomainLink></li>
                <li><DomainLink to="/identity-management" className="hover:text-primary transition-colors">Identity Management</DomainLink></li>
                <li><DomainLink to="/device-management" className="hover:text-primary transition-colors">Device Management</DomainLink></li>
                <li><DomainLink to="/o365-management" className="hover:text-primary transition-colors">O365 License Management</DomainLink></li>
                <li><DomainLink to="/ai-obz" className="hover:text-primary transition-colors">AI OBZ</DomainLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><DomainLink to="/about-us" className="hover:text-primary transition-colors">{t('nav.aboutUs')}</DomainLink></li>
                <li><DomainLink to="/success-stories" className="hover:text-primary transition-colors">{t('nav.successStories')}</DomainLink></li>
                <li><DomainLink to="/media" className="hover:text-primary transition-colors">{t('nav.media')}</DomainLink></li>
                <li><DomainLink to="/contact" className="hover:text-primary transition-colors">{t('common.contactUs')}</DomainLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><DomainLink to="/datasheet/itcontrolbox" className="hover:text-primary transition-colors">{t('footer.technicalDatasheet')}</DomainLink></li>
                <li><DomainLink to="/assessment" className="hover:text-primary transition-colors">{t('footer.quickAssessment')}</DomainLink></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <DomainLink to="/privacy-policy" className="hover:text-primary transition-colors">{t('privacy.title')}</DomainLink>
              <span>|</span>
              <DomainLink to="/terms-and-conditions" className="hover:text-primary transition-colors">{t('terms.title')}</DomainLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
