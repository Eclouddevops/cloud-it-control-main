import { useTranslation } from "react-i18next";

const clients = [
  { name: "Piramal Finance", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/Piramal_Finance_logo.jpg" },
  { name: "Piramal Pharma", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/Piramal_Pharma_Limited_Logo.jpg" },
  { name: "Encora Digital", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/encora-logo.png" },
  { name: "Lupin", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/The_Lupin_Logo.svg.png" },
  { name: "Alkem Labs", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/ALKEM.webp" },
  { name: "Tata Chemicals", logo: "https://yvzekynyerwbcfqslkfb.supabase.co/storage/v1/object/public/media/client-logos/Tata_Chemicals_Limited_-_Logo.svg.png" },
];

const LogoCard = ({ client }: { client: typeof clients[0] }) => (
  <div className="flex-shrink-0 mx-8 flex flex-col items-center">
    <div className="w-32 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm p-3">
      <img src={client.logo} alt={`${client.name} logo`} className="max-w-full max-h-full object-contain"
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
    </div>
    <span className="mt-2 text-sm text-muted-foreground font-medium">{client.name}</span>
  </div>
);

export const ClientLogos = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-semibold text-center text-foreground">{t('clientLogos.title')}</h2>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="flex animate-scroll">
          {clients.map((client, index) => (<LogoCard key={`first-${index}`} client={client} />))}
          {clients.map((client, index) => (<LogoCard key={`second-${index}`} client={client} />))}
        </div>
      </div>
    </section>
  );
};
