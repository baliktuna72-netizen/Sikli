import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CookiesPage from "@/modules/cookies-page";
import TermsPage from "@/modules/terms-page";
import ContactPage from "@/modules/contact-page";
import PrivacyPage from "@/modules/privacy-page";
import AboutPage from "@/modules/about-page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/cookies" element={<CookiesPage />} />

      <Route path="/terms" element={<TermsPage />} />


      <Route path="/contact" element={<ContactPage />} />



      <Route path="/privacy" element={<PrivacyPage />} />




      <Route path="/about" element={<AboutPage />} />





      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
