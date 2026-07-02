import { useTranslation } from "react-i18next";
import {
  createClient,
  base64FromFile,
  type AttachmentInput,
} from "@promakeai/customer-backend-client";
import constants from "@/constants/constants.json";

export type FormSubmitFieldConfig = {
  name: string;
  required: boolean;
};

export type FormSubmitConfig = {
  email_subject1: string;
  email_subject2: string;
  fields: FormSubmitFieldConfig[];
};

export type FormSubmitResult = {
  success: boolean;
  message: string;
  persisted: boolean;
  mailSent: boolean;
};

export type UseFormSubmitOptions = {
  formType?: string;
};

// Anon client against the tenant backend pod. The contact endpoint is public, so
// no token is set. Memoized so we build one axios instance per app load.
let cachedClient: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!cachedClient) {
    const tenantUuid = import.meta.env.VITE_TENANT_UUID;
    if (!tenantUuid) {
      throw new Error("VITE_TENANT_UUID environment variable is not set");
    }
    cachedClient = createClient({
      baseURL: "https://" + tenantUuid + ".backend.promake.ai",
    });
  }
  return cachedClient;
}

function isFile(value: unknown): value is File {
  return (
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof value === "object" &&
      value !== null &&
      typeof (value as { name?: unknown }).name === "string" &&
      typeof (value as { size?: unknown }).size === "number")
  );
}

/** Base64-encode any File attachments; the backend auto-detects content vs URL. */
async function buildAttachments(value: unknown): Promise<AttachmentInput[] | undefined> {
  if (!Array.isArray(value)) return undefined;
  const files = value.filter(isFile);
  if (files.length === 0) return undefined;
  return Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: await base64FromFile(f),
      contentType: f.type || undefined,
    })),
  );
}

/** Build the `{ field: { required, value } }` map, skipping File-valued fields. */
function buildData(
  formData: Record<string, unknown>,
  fields: FormSubmitFieldConfig[],
): Record<string, { required: boolean; value: string }> {
  const out: Record<string, { required: boolean; value: string }> = {};
  for (const field of fields) {
    if (field.name === "attachments") continue;
    const v = formData[field.name];
    if (isFile(v)) continue;
    out[field.name] = { required: field.required, value: v == null ? "" : String(v) };
  }
  return out;
}

/**
 * Submits a contact form to the tenant backend `POST /contact`, which persists
 * the submission to the `forms` table and sends the dual customer + owner email
 * (with attachments) server-side. The call API is unchanged for callers.
 *
 * Durability note: persistence is now server-side, so a failed request (network
 * error or 5xx when the backend could neither persist nor send) rejects, and the
 * caller's catch surfaces it to the user. Unlike the previous client-side write,
 * there is no local fallback copy; the submission is not retried automatically.
 */
export function useFormSubmit(options: UseFormSubmitOptions = {}) {
  const { i18n } = useTranslation();
  const formType = options.formType ?? "contact";

  async function submit(
    formData: Record<string, unknown>,
    formConfig: FormSubmitConfig,
  ): Promise<FormSubmitResult> {
    const locale = i18n?.language || "en";

    const customerEmail = String(formData["email"] ?? "");
    const tenantEmail = constants.email || import.meta.env.VITE_TENANT_MAIL;
    if (!tenantEmail) {
      throw new Error("VITE_TENANT_MAIL environment variable is not set");
    }

    const attachments = await buildAttachments(formData.attachments);

    // Locale travels in the request body (no shared-header mutation on the
    // memoized client, so concurrent submits cannot race on the header).
    const result = await getClient().form.sendMail({
      target_email1: customerEmail,
      target_email2: tenantEmail,
      email_subject1: formConfig.email_subject1,
      email_subject2: formConfig.email_subject2,
      form_type: formType,
      locale,
      data: buildData(formData, formConfig.fields),
      ...(attachments ? { attachments } : {}),
    });

    return {
      success: result.sent,
      message: "",
      persisted: result.persisted,
      mailSent: result.sent,
    };
  }

  return { submit };
}
