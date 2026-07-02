import { Layout } from "@/components/Layout";
import { Link } from "react-router";
import { ShieldCheck, FileCheck2, GraduationCap, ScrollText, Lock, Clock3, BadgeCheck, MessageCircle, CheckCircle2, ArrowRight, Wallet, Eye, Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { t } = useTranslation("home");

  const serviceCards = [
    {
      icon: ShieldCheck,
      title: t("services.items.0.title"),
      description: t("services.items.0.description"),
    },
    {
      icon: FileCheck2,
      title: t("services.items.1.title"),
      description: t("services.items.1.description"),
    },
    {
      icon: GraduationCap,
      title: t("services.items.2.title"),
      description: t("services.items.2.description"),
    },
    {
      icon: ScrollText,
      title: t("services.items.3.title"),
      description: t("services.items.3.description"),
    },
  ];

  const processSteps = [
    {
      number: "01",
      icon: Wallet,
      title: t("process.steps.0.title"),
      description: t("process.steps.0.description"),
    },
    {
      number: "02",
      icon: Eye,
      title: t("process.steps.1.title"),
      description: t("process.steps.1.description"),
    },
    {
      number: "03",
      icon: BadgeCheck,
      title: t("process.steps.2.title"),
      description: t("process.steps.2.description"),
    },
    {
      number: "04",
      icon: Handshake,
      title: t("process.steps.3.title"),
      description: t("process.steps.3.description"),
    },
  ];

  const trustItems = [
    {
      icon: Lock,
      title: t("trust.items.0.title"),
      description: t("trust.items.0.description"),
    },
    {
      icon: Clock3,
      title: t("trust.items.1.title"),
      description: t("trust.items.1.description"),
    },
    {
      icon: CheckCircle2,
      title: t("trust.items.2.title"),
      description: t("trust.items.2.description"),
    },
  ];

  const heroBadges = [
    t("hero.badges.0"),
    t("hero.badges.1"),
    t("hero.badges.2"),
  ];

  return (
    <Layout>
      <div className="bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-[#0d2347] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
          <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                {t("hero.eyebrow")}
              </div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroBadges.map((badge) => (
                  <div
                    key={badge}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"
                  >
                    {badge}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 bg-[#C9A227] px-7 text-[#0d2347] hover:bg-[#d7b54a]">
                  <a href="https://wa.me/14065786542" target="_blank" rel="noreferrer">
                    {t("hero.primaryCta")}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-7 text-white hover:bg-white hover:text-[#0d2347]">
                  <Link to="/contact">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="relative z-10">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm">
                <img
                  src="/images/hero-primary-1.jpg"
                  alt={t("hero.imageAlt")}
                  className="h-full min-h-[360px] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/10 bg-white/95 p-5 text-slate-900 shadow-xl sm:left-auto sm:right-6 sm:w-72">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#163A70]">
                  {t("hero.highlightLabel")}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {t("hero.highlightTitle")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t("hero.highlightDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#163A70]">
                {t("services.eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                {t("services.title")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {t("services.description")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="h-full border-slate-200 bg-slate-50/70 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#163A70]/10 text-[#163A70]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7fa] py-20">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#163A70]">
                {t("process.eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                {t("process.title")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {t("process.description")}
              </p>
              <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
                <img
                  src="/images/hero-primary-2.jpg"
                  alt={t("process.imageAlt")}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-5">
              {processSteps.map(({ number, icon: Icon, title, description }) => (
                <div key={number} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#163A70] text-sm font-bold text-white">
                        {number}
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#163A70]">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#163A70]">
                  {t("trust.eyebrow")}
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {t("trust.title")}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                  {t("trust.description")}
                </p>
                <div className="mt-8 space-y-4">
                  {trustItems.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#163A70] text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild variant="outline" className="border-[#163A70] text-[#163A70] hover:bg-[#163A70] hover:text-white">
                    <Link to="/about">
                      {t("trust.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-xl">
                <img
                  src="/images/custom/contact_cta_corporate.jpg"
                  alt={t("trust.imageAlt")}
                  className="h-full min-h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0d2347] py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="inline-flex items-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2 text-sm font-semibold text-[#f4df9a]">
                    {t("contact.eyebrow")}
                  </p>
                  <h2 className="mt-5 max-w-3xl text-3xl font-bold sm:text-4xl">
                    {t("contact.title")}
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
                    {t("contact.description")}
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                      <p className="text-sm text-white/60">{t("contact.phoneLabel")}</p>
                      <a href="tel:+14065786542" className="mt-2 block text-lg font-semibold text-white">
                        {t("contact.phoneValue")}
                      </a>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                      <p className="text-sm text-white/60">{t("contact.emailLabel")}</p>
                      <a href="mailto:Diplomailetişim@gmail.com" className="mt-2 block text-lg font-semibold text-white break-all">
                        {t("contact.emailValue")}
                      </a>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                      <p className="text-sm text-white/60">{t("contact.addressLabel")}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{t("contact.addressValue")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:min-w-[260px]">
                  <Button asChild size="lg" className="h-12 bg-[#C9A227] px-7 text-[#0d2347] hover:bg-[#d7b54a]">
                    <a href="https://wa.me/14065786542" target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("contact.primaryCta")}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 border-white/25 bg-transparent px-7 text-white hover:bg-white hover:text-[#0d2347]">
                    <Link to="/contact">{t("contact.secondaryCta")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <a
          href="https://wa.me/14065786542"
          target="_blank"
          rel="noreferrer"
          aria-label={t("whatsapp.ariaLabel")}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </div>
    </Layout>
  );
};

export default Index;
