import { Navigation } from "@/components/Navigation";
import { MainHero } from "@/components/MainHero";
import { ClientLogos } from "@/components/ClientLogos";
import { ProductBoxes } from "@/components/ProductBoxes";
import { ProductsOverview } from "@/components/ProductsOverview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <MainHero />
      <ClientLogos />
      <ProductBoxes />
      <ProductsOverview />
      <Footer />
    </div>
  );
};

export default Index;