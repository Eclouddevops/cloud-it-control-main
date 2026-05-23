import { useState } from "react";
import { CONTACT_FORM_TOKEN } from "@/lib/domainConfig";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DomainLink } from "@/components/DomainLink";
import { PrivacyPolicyCheckbox } from "@/components/PrivacyPolicyCheckbox";

const Contact = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "Contact Form";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      console.log("Bot detected via honeypot");
      toast.error("Form submission failed");
      return;
    }
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error(t('contact.errorRequired'));
      return;
    }

    if (!privacyAccepted) {
      toast.error(t('common.privacyRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('contact.errorEmail'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from("contact_leads")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          organisation: formData.organisation.trim() || null,
          source: source,
        });

      if (dbError) throw dbError;

      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          organisation: formData.organisation.trim() || null,
          source: source,
        },
        headers: { "x-contact-form-secret": CONTACT_FORM_TOKEN },
      });

      if (emailError) {
        console.error("Email sending failed:", emailError);
      }

      toast.success(t('contact.successToast'));
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const userMessage = error?.message?.toLowerCase().includes("rate limit")
        ? t('contact.errorRateLimit')
        : t('contact.errorSubmit');
      toast.error(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-500/10 rounded-full w-fit">
                <Mail className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('contact.thankYou')}</CardTitle>
              <CardDescription className="text-base">
                {t('contact.thankYouDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <DomainLink to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('common.backToHome')}
                </DomainLink>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <DomainLink to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('common.backToHome')}
                </DomainLink>
              </Button>
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t('contact.title')}</CardTitle>
                <CardDescription>{t('contact.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('common.name')} *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      maxLength={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('common.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      maxLength={255}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('common.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('contact.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      maxLength={20}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organisation">{t('common.organisation')}</Label>
                    <Input
                      id="organisation"
                      type="text"
                      placeholder={t('contact.orgPlaceholder')}
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      maxLength={100}
                    />
                  </div>
                  
                  <PrivacyPolicyCheckbox checked={privacyAccepted} onCheckedChange={setPrivacyAccepted} />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting || !privacyAccepted || !formData.email.trim()}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('common.sendMessage')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
