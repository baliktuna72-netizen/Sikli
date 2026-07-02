import { useTranslation } from "react-i18next";
import { usePageTitle } from "@/hooks/use-page-title";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, BarChart, Megaphone, Shield, Info } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/modules/animations";

export function CookiesPage() {
  const { t } = useTranslation("cookies-page");
  usePageTitle({ title: t("title") });

  const cookieTypes = [
    { icon: Shield, titleKey: "essentialTitle", descKey: "essentialDesc" },
    { icon: BarChart, titleKey: "analyticsTitle", descKey: "analyticsDesc" },
    { icon: Settings, titleKey: "functionalTitle", descKey: "functionalDesc" },
    { icon: Megaphone, titleKey: "marketingTitle", descKey: "marketingDesc" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4">
          {/* Header */}
          <FadeIn className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              {t("lastUpdated")}: {t("updateDate")}
            </p>
          </FadeIn>

          {/* Introduction */}
          <FadeIn delay={0.1} className="max-w-4xl mx-auto mb-12">
            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  {t("introduction")}
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* What Are Cookies */}
          <FadeIn delay={0.2} className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3">{t("whatTitle")}</h2>
                    <p className="text-muted-foreground">{t("whatContent")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Cookie Types */}
          <div className="max-w-4xl mx-auto mb-8">
            <FadeIn className="text-center mb-6">
              <h2 className="text-2xl font-semibold">{t("typesTitle")}</h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {cookieTypes.map(({ icon: Icon, titleKey, descKey }) => (
                <StaggerItem key={titleKey}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{t(titleKey)}</h3>
                          <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Management */}
          <FadeIn className="max-w-4xl mx-auto mb-12">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3">{t("managementTitle")}</h2>
                    <p className="text-muted-foreground">{t("managementContent")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Footer Note */}
          <FadeIn className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">{t("footerNote")}</p>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}

export default CookiesPage;
