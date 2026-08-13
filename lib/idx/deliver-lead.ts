import { sendLeadNotification } from "@/lib/forms/notify-lead";
import { isLeadEmailConfigured } from "@/lib/forms/env";
import { createIdxClient, type IdxBrokerClient } from "./IdxBrokerClient";
import type { LeadFormInput } from "./env";

export type LeadDeliverySource = "idx" | "email" | "both";

export interface LeadDeliveryResult {
  ok: boolean;
  message: string;
  source?: LeadDeliverySource;
}

const SUCCESS_MESSAGE =
  "Thank you. Kevin’s office will be in touch shortly.";
const FAILURE_MESSAGE =
  "We could not submit your inquiry right now. Please call the office or try again.";

export async function deliverLead(
  input: LeadFormInput
): Promise<LeadDeliveryResult> {
  const emailConfigured = isLeadEmailConfigured();
  const client = createIdxClient();
  const idxConfigured = client.isConfigured();

  if (!emailConfigured && !idxConfigured) {
    console.error("[deliverLead] no inbox or IDX channel configured");
    return { ok: false, message: FAILURE_MESSAGE };
  }

  const [emailOk, idxOk] = await Promise.all([
    tryEmail(emailConfigured, input),
    tryIdx(idxConfigured, client, input),
  ]);

  if (!emailOk && !idxOk) {
    return { ok: false, message: FAILURE_MESSAGE };
  }

  const source: LeadDeliverySource =
    emailOk && idxOk ? "both" : emailOk ? "email" : "idx";
  return { ok: true, message: SUCCESS_MESSAGE, source };
}

async function tryEmail(
  configured: boolean,
  input: LeadFormInput
): Promise<boolean> {
  if (!configured) return false;
  const result = await sendLeadNotification(input);
  return result.ok;
}

async function tryIdx(
  configured: boolean,
  client: IdxBrokerClient,
  input: LeadFormInput
): Promise<boolean> {
  if (!configured) return false;
  try {
    await client.createLead(input);
    return true;
  } catch (error) {
    console.error("[deliverLead] IDX lead failed", error);
    return false;
  }
}
