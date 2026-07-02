import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "@/hooks/use-page-title";
import { Mail, Phone, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import constants from "@/constants/constants.json";
import { FormFileInput } from "@/components/FormFileInput";
import { FormField } from "@/components/FormField";

interface ContactPageCenteredProps {
  className?: string;
}

export function ContactPageCentered({ className }: ContactPageCenteredProps) {
  const { t } = useTranslation("contact-page-centered");
  usePageTitle({ title: t("title", "Contact Us") });
  const { submit: submitForm } = useFormSubmit({ formType: "contact" });
  const fileMaxFiles = constants.file?.maxFiles || 5;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const contactCards = [
    {
      icon: Mail,
      title: t("emailTitle", "Email"),
      value: constants.email || "hello@example.com",
      href: `mailto:${constants.email || "hello@example.com"}`,
    },
    {
      icon: Phone,
      title: t("phoneTitle", "Phone"),
      value: constants.phone || "+1 234 567 890",
      href: `tel:${constants.phone || "+1234567890"}`,
    },
    {
      icon: MapPin,
      title: t("addressTitle", "Address"),
      value: constants.address?.city || "New York, USA",
      href: "#",
    },
  ];
  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];

    const remainingSlots = fileMaxFiles - formData.attachments.length;

    // If the limit is exceeded, alert and do not add any files
    if (selectedFiles.length > remainingSlots) {
      alert(t("maxFilesLimit", { max: fileMaxFiles }));
      e.target.value = ''; // Clear the input
      return;
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...selectedFiles]
    }));

    e.target.value = ''; // Clear the input
  }
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitForm(formData, {
        email_subject1: "Thank you for contacting us",
        email_subject2: "New Contact Form Submission",
        fields: [
          { name: "name", required: true },
          { name: "email", required: true },
          { name: "message", required: true },
          { name: "attachments", required: false },
        ],
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "", attachments: [] });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout>
      <div className={cn("min-h-screen bg-muted/30 py-16 md:py-24", className)}>
        <div className="w-full max-w-[var(--container-max-width)] mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("title", "Contact Us")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("subtitle", "We'd love to hear from you. Send us a message and we'll respond as soon as possible.")}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {contactCards.map((card, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <a
                    href={card.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {card.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label={t("nameLabel", "Name")} htmlFor="name" required>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("namePlaceholder", "Your name")}
                      required
                      className="mt-1"
                    />
                  </FormField>
                  <FormField label={t("emailLabel", "Email")} htmlFor="email" required>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("emailPlaceholder", "your@email.com")}
                      required
                      className="mt-1"
                    />
                  </FormField>
                </div>
                <FormField label={t("messageLabel", "Message")} htmlFor="message" required>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("messagePlaceholder", "How can we help you?")}
                    required
                    rows={6}
                    className="mt-1 resize-none"
                  />
                </FormField>
                <FormFileInput
                  files={formData.attachments}
                  onFilesChange={handleFileUploadChange}
                  handleRemoveFile={handleRemoveFile}
                  maxFiles={constants.file?.maxFiles || 5}
                  accept={constants.file?.accept || ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
                  disabled={isSubmitting}
                  uploadButtonText={t("addFiles")}
                  maxFilesReachedText={t("maxFilesReached")}
                />
                {submitStatus === "success" && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {t("success", "Message sent successfully! We'll get back to you soon.")}
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-destructive text-sm font-medium">
                      {t("error", "Something went wrong. Please try again.")}
                    </p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("sending", "Sending...") : t("submit", "Send Message")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPageCentered;
