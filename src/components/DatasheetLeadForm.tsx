import { useState } from "react";
import { CONTACT_FORM_TOKEN } from "@/lib/domainConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PrivacyPolicyCheckbox } from "@/components/PrivacyPolicyCheckbox";

interface DatasheetLeadFormProps {
  datasheetName?: string;
  onSuccess?: () => void;
}

const DatasheetLeadForm = ({ datasheetName = "IT Control Box", onSuccess }: DatasheetLeadFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast.error(t('contact.errorSubmit'));
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
      const { error } = await supabase.from("datasheet_leads").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        organisation: formData.organisation.trim() || null,
        datasheet_name: datasheetName,
      });

      if (error) throw error;

      const datasheetUrl = `${window.location.origin}/IT-Control-Box-Datasheet.pdf`;

      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          organisation: formData.organisation.trim() || null,
          source: `${datasheetName} Datasheet`,
          datasheetUrl: datasheetUrl,
        },
        headers: { "x-contact-form-secret": CONTACT_FORM_TOKEN },
      });

      if (emailError) {
        console.error("Email sending failed:", emailError);
      }

      toast.success(t('contact.successToast'));

      const link = document.createElement("a");
      link.href = "/IT-Control-Box-Datasheet.pdf";
      link.download = "IT-Control-Box-Datasheet.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onSuccess?.();
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <FileDown className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">{t('datasheet.downloadTitle', { name: datasheetName })}</CardTitle>
        <CardDescription>{t('datasheet.downloadDesc')}</CardDescription>
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
            <Input id="name" type="text" placeholder={t('contact.namePlaceholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')} *</Label>
            <Input id="email" type="email" placeholder={t('contact.emailPlaceholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('common.phone')}</Label>
            <Input id="phone" type="tel" placeholder={t('contact.phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} maxLength={20} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organisation">{t('common.organisation')}</Label>
            <Input id="organisation" type="text" placeholder={t('contact.orgPlaceholder')} value={formData.organisation} onChange={(e) => setFormData({ ...formData, organisation: e.target.value })} maxLength={100} />
          </div>
          <PrivacyPolicyCheckbox checked={privacyAccepted} onCheckedChange={setPrivacyAccepted} />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !privacyAccepted || !formData.email.trim()}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.processing')}</>
            ) : (
              <><FileDown className="mr-2 h-4 w-4" />{t('datasheet.downloadBtn')}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DatasheetLeadForm;
