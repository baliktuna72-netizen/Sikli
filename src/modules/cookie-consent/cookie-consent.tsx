import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface CookieConsentProps {
  className?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  width?: "full" | "compact" | "auto";
  position?: "left" | "right" | "center";
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = "cookie-consent";

export function CookieConsent({
  className,
  privacyPolicyUrl = "/privacy",
  cookiePolicyUrl = "/cookies",
  onAccept,
  onDecline,
  width = "full",
  position = "center",
  storageKey = DEFAULT_STORAGE_KEY,
}: CookieConsentProps) {
  const { t } = useTranslation("cookie-consent");
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(storageKey);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const handleAccept = () => {
    localStorage.setItem(storageKey, "accepted");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onAccept?.();
    }, 300);
  };

  const handleDecline = () => {
    localStorage.setItem(storageKey, "declined");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDecline?.();
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: isClosing ? 100 : 0, opacity: isClosing ? 0 : 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-0 z-50 p-4 md:p-6 left-0 right-0",
            position === "left" && "md:right-auto",
            position === "right" && "md:left-auto",
            className
          )}
        >
          <div className={cn(
            "w-full mx-auto",
            width === "full" && "max-w-[var(--container-max-width)]",
            width === "compact" && "md:max-w-md",
            width === "auto" && "md:w-auto"
          )}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("close", "Close")}
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Description */}
              <div className="mb-4 pr-6">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {t("title", "Cookie Notice")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("description", "We use cookies to improve your experience.")}{" "}
                  <Link to={privacyPolicyUrl} className="text-primary hover:underline">
                    {t("privacyPolicy", "Privacy")}
                  </Link>
                  {" · "}
                  <Link to={cookiePolicyUrl} className="text-primary hover:underline">
                    {t("cookiePolicy", "Cookies")}
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="flex-1"
                >
                  {t("decline", "Decline")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1"
                >
                  {t("accept", "Accept")}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
