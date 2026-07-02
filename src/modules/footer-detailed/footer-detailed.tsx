import { useMemo } from "react";
import { Link } from "react-router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  ArrowUp,
  CreditCard,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import constants from "@/constants/constants.json";

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

interface FooterDetailedProps {
  className?: string;
}

export function FooterDetailed({ className }: FooterDetailedProps) {
  const { t } = useTranslation("footer-detailed");

  const socialLinks = useMemo(() => {
    const socialMedia = constants.socialMedia as Record<string, string> | undefined;
    if (!socialMedia) return [];
    return Object.entries(socialMedia)
      .filter(([platform, url]) => url && socialIcons[platform])
      .map(([platform, url]) => ({ platform, url, Icon: socialIcons[platform] }));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      title: t("quickLinks"),
      links: [
        { text: t("home"), url: "/" },
        { text: t("about"), url: "/about" },
        { text: t("contact"), url: "/contact" },
        { text: t("services"), url: "/#hizmetler" },
      ],
    },
    {
      title: t("services"),
      links: [
        { text: t("service1"), url: "/#hizmetler" },
        { text: t("service2"), url: "/#hizmetler" },
        { text: t("service3"), url: "/#surec" },
        { text: t("service4"), url: "/#surec" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { text: t("privacy"), url: "/privacy" },
        { text: t("terms"), url: "/terms" },
        { text: t("cookies"), url: "/cookies" },
      ],
    },
  ];

  return (
    <footer className={cn("border-t border-slate-800 bg-[#0b1730] text-white", className)}>
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-6">
            <Logo size="lg" variant="light" />
            <p className="max-w-sm text-sm leading-7 text-white/70">
              {t("description")}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-2 pt-2">
                {socialLinks.map(({ platform, url, Icon }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {linkSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4df9a]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.url}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4df9a]">
              {t("contactTitle")}
            </h4>
            <div className="space-y-4 text-sm text-white/75">
              <a href={`tel:${constants.phone}`} className="flex items-start gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 text-[#C9A227]" />
                <div>
                  <p className="text-white/50">{t("phoneLabel")}</p>
                  <p>{constants.phone}</p>
                </div>
              </a>
              <a href={`mailto:${constants.email}`} className="flex items-start gap-3 transition-colors hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 text-[#C9A227]" />
                <div>
                  <p className="text-white/50">{t("emailLabel")}</p>
                  <p className="break-all">{constants.email}</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#C9A227]" />
                <div>
                  <p className="text-white/50">{t("addressLabel")}</p>
                  <p>{constants.address.line1}</p>
                </div>
              </div>
            </div>
            <Button asChild className="mt-2 h-11 bg-[#C9A227] px-5 text-[#0b1730] hover:bg-[#d7b54a]">
              <a href="https://wa.me/14065786542" target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t("whatsappCta")}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#081224]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            <div className="flex flex-col items-center gap-4 text-sm text-white/60 sm:flex-row sm:gap-6 lg:items-center">
              <span>
                © {currentYear} {constants.site.name}. {t("allRightsReserved")}
              </span>
              <div className="hidden h-4 w-px bg-white/15 sm:block" />
              <div className="flex items-center gap-2 text-white/60">
                <CreditCard className="h-4 w-4" />
                <span>{t("securePayment")}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="gap-2 border-white/15 bg-white/5 text-white hover:bg-white hover:text-[#0b1730]"
            >
              <ArrowUp className="h-4 w-4" />
              {t("backToTop")}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
