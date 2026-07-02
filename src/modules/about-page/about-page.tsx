import { useTranslation } from "react-i18next";
import { usePageTitle } from "@/hooks/use-page-title";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, ScaleUp } from "@/modules/animations";

export function AboutPage() {
  const { t } = useTranslation("about-page");
  usePageTitle({ title: t("title") });

  const values = [
    { icon: Target, titleKey: "missionTitle", descKey: "missionDesc" },
    { icon: Heart, titleKey: "valuesTitle", descKey: "valuesDesc" },
    { icon: Users, titleKey: "teamTitle", descKey: "teamDesc" },
    { icon: Award, titleKey: "qualityTitle", descKey: "qualityDesc" },
  ];

  const stats = [
    { valueKey: "customersValue", labelKey: "customersLabel" },
    { valueKey: "projectsValue", labelKey: "projectsLabel" },
    { valueKey: "experienceValue", labelKey: "experienceLabel" },
    { valueKey: "satisfactionValue", labelKey: "satisfactionLabel" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4">
          {/* Hero Section */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("title")}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t("subtitle")}
            </p>
          </FadeIn>

          {/* Story Section */}
          <FadeIn delay={0.1} className="mb-16">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{t("storyTitle")}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t("storyP1")}</p>
                  <p>{t("storyP2")}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Values & Stats */}
          <div>
            {/* Values Grid */}
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {values.map(({ icon: Icon, titleKey, descKey }) => (
                <StaggerItem key={titleKey}>
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{t(titleKey)}</h3>
                      <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Stats Section */}
            <ScaleUp className="bg-primary/5 rounded-2xl p-8 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map(({ valueKey, labelKey }) => (
                  <div key={valueKey}>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {t(valueKey)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(labelKey)}
                    </div>
                  </div>
                ))}
              </div>
            </ScaleUp>
          </div>

          {/* CTA Section */}
          <FadeIn className="text-center">
            <h2 className="text-2xl font-semibold mb-4">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t("ctaDesc")}
            </p>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}

export default AboutPage;
