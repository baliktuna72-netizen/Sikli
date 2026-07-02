import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import constants from "@/constants/constants.json";

interface ContactInfoGridProps {
  className?: string;
}

export function ContactInfoGrid({ className }: ContactInfoGridProps) {
  const { t } = useTranslation("contact-info-grid");

  const contactItems = [
    {
      icon: Mail,
      label: t("emailLabel", "Email"),
      description: t("emailDesc", "We respond to all emails within 24 hours."),
      value: constants.email || "hello@example.com",
      href: `mailto:${constants.email || "hello@example.com"}`,
    },
    {
      icon: MapPin,
      label: t("officeLabel", "Office"),
      description: t("officeDesc", "Drop by our office for a chat."),
      value: `${constants.address?.line1 || ""}, ${constants.address?.city || ""}`,
      href: "#",
    },
    {
      icon: Phone,
      label: t("phoneLabel", "Phone"),
      description: t("phoneDesc", "We're available Mon-Fri, 9am-5pm."),
      value: constants.phone || "+1 234 567 890",
      href: `tel:${constants.phone || "+1234567890"}`,
    },
    {
      icon: MessageCircle,
      label: t("chatLabel", "Live Chat"),
      description: t("chatDesc", "Get instant help from our support team."),
      value: t("startChat", "Start Chat"),
      href: "#",
    },
  ];

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            {t("title", "Get in Touch")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            {t("subtitle", "Have questions? We'd love to hear from you. Choose your preferred way to reach us.")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-muted/50 p-6 hover:bg-muted transition-colors"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">{item.label}</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {item.description}
              </p>
              <a
                href={item.href}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
