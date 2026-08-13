"use server";

import { deliverLead, type LeadDeliverySource } from "./deliver-lead";
import { leadSchema } from "./env";

export interface LeadActionResult {
  ok: boolean;
  message: string;
  source?: LeadDeliverySource;
}

const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

export async function createLead(
  formData: FormData
): Promise<LeadActionResult> {
  const raw = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    message: String(formData.get("message") ?? "") || undefined,
    listingId: String(formData.get("listingId") ?? "") || undefined,
    propertyAddress: String(formData.get("propertyAddress") ?? "") || undefined,
    website: String(formData.get("website") ?? "") || undefined,
  };

  if (raw.website) {
    return { ok: true, message: "Thank you. We will be in touch shortly." };
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid form data";
    return { ok: false, message: first };
  }

  const rateKey = parsed.data.email.toLowerCase();
  const last = recentSubmissions.get(rateKey) ?? 0;
  if (Date.now() - last < RATE_LIMIT_MS) {
    return {
      ok: false,
      message: "Please wait a moment before submitting again.",
    };
  }
  recentSubmissions.set(rateKey, Date.now());

  return deliverLead(parsed.data);
}
