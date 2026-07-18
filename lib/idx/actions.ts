"use server";

import { createIdxClient } from "./IdxBrokerClient";
import { leadSchema } from "./env";

export interface LeadActionResult {
  ok: boolean;
  message: string;
  source?: "idx" | "local";
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

  const client = createIdxClient();
  if (!client.isConfigured()) {
    console.info("[createLead] mock accept (no IDX credentials)", {
      email: parsed.data.email,
    });
    return {
      ok: true,
      message: "Thank you. Our office will follow up shortly.",
      source: "local",
    };
  }

  try {
    await client.createLead({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      listingId: parsed.data.listingId,
      propertyAddress: parsed.data.propertyAddress,
    });
    return {
      ok: true,
      message: "Thank you. Kevin’s office will be in touch shortly.",
      source: "idx",
    };
  } catch (error) {
    console.error("[createLead] IDX lead failed", error);
    return {
      ok: false,
      message:
        "We could not submit your inquiry right now. Please call the office or try again.",
    };
  }
}
