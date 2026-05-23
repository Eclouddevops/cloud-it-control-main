import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageLayout } from "@/components/LanguageLayout";
import { CookieConsent } from "@/components/CookieConsent";
import Index from "./pages/Index";
import ITControlBox from "./pages/ITControlBox";
import GreenitcoITAM from "./pages/GreenitcoITAM";
import AIOBZITAM from "./pages/ITAMAlternate";
import IdentityManagement from "./pages/IdentityManagement";
import DeviceManagement from "./pages/DeviceManagement";
import O365Management from "./pages/O365Management";
import AIOBZ from "./pages/AIOBZ";
import Cognitia from "./pages/Cognitia";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import DatasheetDownload from "./pages/DatasheetDownload";
import Assessment from "./pages/Assessment";
import AboutUs from "./pages/AboutUs";
import SuccessStories from "./pages/SuccessStories";
import Media from "./pages/Media";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import i18n from "./i18n";

const queryClient = new QueryClient();

const DetectAndRedirect = () => {
  const detectedLang = i18n.language?.startsWith("sv") ? "sv" : "en";
  return <Navigate to={`/${detectedLang}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirects to detected language */}
          <Route path="/" element={<DetectAndRedirect />} />

          {/* All routes nested under /:lang */}
          <Route path="/:lang" element={<LanguageLayout />}>
            <Route index element={<ITControlBox />} />
            <Route path="itcontrolbox" element={<ITControlBox />} />
            <Route path="products" element={<Index />} />
            <Route path="it-asset-management" element={<GreenitcoITAM />} />
            <Route path="itam" element={<AIOBZITAM />} />
            <Route path="identity-management" element={<IdentityManagement />} />
            <Route path="device-management" element={<DeviceManagement />} />
            <Route path="o365-management" element={<O365Management />} />
            <Route path="ai-obz" element={<AIOBZ />} />
            <Route path="cognitia" element={<Cognitia />} />
            <Route path="datasheet/itcontrolbox" element={<DatasheetDownload />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="success-stories" element={<SuccessStories />} />
            <Route path="media" element={<Media />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
