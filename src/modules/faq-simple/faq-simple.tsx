import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSimpleProps {
  className?: string;
}

export function FaqSimple({ className }: FaqSimpleProps) {
  const { t } = useTranslation("faq-simple");

  const faqItems = [
    {
      id: "faq-1",
      question: t("q1", "What is included in the free plan?"),
      answer: t("a1", "The free plan includes basic features such as up to 3 projects, 1GB storage, and email support. Perfect for individuals and small teams getting started."),
    },
    {
      id: "faq-2",
      question: t("q2", "Can I upgrade or downgrade my plan?"),
      answer: t("a2", "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. No penalties for switching plans."),
    },
    {
      id: "faq-3",
      question: t("q3", "How do I cancel my subscription?"),
      answer: t("a3", "You can cancel your subscription from your account settings. Your access will continue until the end of your current billing period."),
    },
    {
      id: "faq-4",
      question: t("q4", "Is my data secure?"),
      answer: t("a4", "Yes, we take security seriously. All data is encrypted at rest and in transit. We comply with industry standards and regularly undergo security audits."),
    },
    {
      id: "faq-5",
      question: t("q5", "Do you offer customer support?"),
      answer: t("a5", "We offer 24/7 customer support via email and live chat. Premium plans also include phone support and dedicated account managers."),
    },
    {
      id: "faq-6",
      question: t("q6", "Can I get a refund?"),
      answer: t("a6", "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."),
    },
  ];

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            {t("title", "Frequently Asked Questions")}
          </h2>
          <p className="text-muted-foreground">
            {t("subtitle", "Find answers to common questions about our service.")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={item.id} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
