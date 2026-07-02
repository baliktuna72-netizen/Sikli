import { Link } from "react-router";
import { ArrowRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  className?: string;
}

export function HeroCta({ className }: HeroCtaProps) {
  const { t } = useTranslation("hero-cta");

  const avatars = [
    { src: "/images/placeholder.png", alt: "User 1", fallback: "U1" },
    { src: "/images/placeholder.png", alt: "User 2", fallback: "U2" },
    { src: "/images/placeholder.png", alt: "User 3", fallback: "U3" },
    { src: "/images/placeholder.png", alt: "User 4", fallback: "U4" },
    { src: "/images/placeholder.png", alt: "User 5", fallback: "U5" },
  ];

  return (
    <section className={cn("py-8 md:py-12 lg:py-26", className)}>
      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="mb-6 text-2xl font-bold text-pretty sm:text-3xl lg:text-4xl xl:text-5xl leading-tight">
              {t("heading")}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground text-base lg:text-lg">
              {t("description")}
            </p>

            {/* Social Proof */}
            <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <div className="flex -space-x-3">
                {avatars.map((avatar, index) => (
                  <Avatar key={index} className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                    <AvatarFallback className="text-xs">{avatar.fallback}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1 font-semibold text-sm">5.0</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("reviews")}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/register">
                  {t("primaryCta")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/about">
                  {t("secondaryCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative order-first lg:order-last">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <img
                src="/images/placeholder.png"
                alt={t("imageAlt")}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Decorative gradient blur */}
            <div className="absolute -z-10 -bottom-4 -right-4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
