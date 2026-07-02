import { useState } from "react";
import { Link } from "react-router";
import { Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";

export function HeaderSimple() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation("header-simple");

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <Logo size="sm" className="text-base sm:text-xl lg:text-2xl" />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative py-2 text-sm font-semibold tracking-[0.08em] text-slate-700 uppercase transition-colors hover:text-[#163A70]"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex">
            <Button asChild className="h-11 bg-[#163A70] px-5 text-white hover:bg-[#0f2b54]">
              <a href="https://wa.me/14065786542" target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t("cta")}
              </a>
            </Button>
          </div>

          <div className="flex-shrink-0 lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-slate-200 bg-white px-6">
                <SheetHeader>
                  <SheetTitle>{t("menu")}</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base font-semibold text-slate-700 transition-colors hover:text-[#163A70]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button asChild className="mt-4 h-11 bg-[#163A70] text-white hover:bg-[#0f2b54]">
                    <a href="https://wa.me/14065786542" target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t("cta")}
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
