import { ArrowLeft, Shield, Server, Users, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatasheetLeadForm from "@/components/DatasheetLeadForm";
import { useTranslation } from "react-i18next";
import { DomainLink } from "@/components/DomainLink";
import itControlBoxLogo from "@/assets/itcontrolbox-logo.png";

const DatasheetDownload = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <DomainLink to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToHome')}
            </Button>
          </DomainLink>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img src={itControlBoxLogo} alt="IT Control Box Logo" className="h-16" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('datasheet.title')}</h1>
              <p className="text-lg text-muted-foreground">{t('datasheet.description')}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">{t('datasheet.whatsInside')}</h2>
              <div className="grid gap-4">
                {[
                  { icon: Users, titleKey: 'identityMgmt', descKey: 'identityMgmtDesc' },
                  { icon: Monitor, titleKey: 'deviceMgmt', descKey: 'deviceMgmtDesc' },
                  { icon: Server, titleKey: 'o365LicenseMgmt', descKey: 'o365LicenseMgmtDesc' },
                  { icon: Shield, titleKey: 'techSpecs', descKey: 'techSpecsDesc' },
                ].map(({ icon: Icon, titleKey, descKey }) => (
                  <div key={titleKey} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{t(`datasheet.${titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`datasheet.${descKey}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <DatasheetLeadForm datasheetName="IT Control Box" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DatasheetDownload;
