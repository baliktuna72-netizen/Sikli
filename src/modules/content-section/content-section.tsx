import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  image: string;
  imageAlt?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  grayscale?: boolean;
  className?: string;
}

export function ContentSection({
  image,
  imageAlt,
  title,
  description,
  ctaText,
  ctaLink = "#",
  grayscale = false,
  className,
}: ContentSectionProps) {

  return (
    <section className={cn("py-16 md:py-32", className)}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <img
          className={cn("rounded-lg w-full", grayscale && "grayscale")}
          src={image}
          alt={imageAlt || title}
          loading="lazy"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-3xl md:text-4xl font-medium leading-tight">
            {title}
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>

            {ctaText && (
              <Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
                <Link to={ctaLink}>
                  <span>{ctaText}</span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
