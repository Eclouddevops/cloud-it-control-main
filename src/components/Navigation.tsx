import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import itcontrolboxLogo from "@/assets/itcontrolbox-logo.png";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DomainLink } from "./DomainLink";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <DomainLink to="/" className="flex items-center gap-2">
              <img src={itcontrolboxLogo} alt="IT Control Box Logo" className="h-10 w-auto" />
            </DomainLink>
            <LanguageSwitcher />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <DomainLink to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.products')}
            </DomainLink>
            <DomainLink to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.itControlBox')}
            </DomainLink>
            <DomainLink to="/about-us" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.aboutUs')}
            </DomainLink>
            <DomainLink to="/success-stories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.successStories')}
            </DomainLink>
            <DomainLink to="/media" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.media')}
            </DomainLink>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <DomainLink to="/contact?source=Get Started">
                {t('nav.getStarted')}
              </DomainLink>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <DomainLink to="/products" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.products')}
            </DomainLink>
            <DomainLink to="/" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.itControlBox')}
            </DomainLink>
            <DomainLink to="/about-us" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.aboutUs')}
            </DomainLink>
            <DomainLink to="/success-stories" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.successStories')}
            </DomainLink>
            <DomainLink to="/media" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t('nav.media')}
            </DomainLink>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <DomainLink to="/contact?source=Get Started">
                {t('nav.getStarted')}
              </DomainLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
