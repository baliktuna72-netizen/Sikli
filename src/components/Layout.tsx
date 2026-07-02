import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { HeaderSimple } from "@/modules/header-simple";
import { FooterDetailed } from "@/modules/footer-detailed";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  usePageTitle();
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSimple />
      <main className="flex-1">{children}</main>
      <FooterDetailed />
    </div>
  );
}
