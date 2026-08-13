import type { LeadPayload } from "@/lib/idx/types";
import {
  getLeadFromAddress,
  getLeadNotifyEnv,
  isLeadEmailConfigured,
  type LeadNotifyEnv,
} from "./env";
import { buildLeadEmailSubject, buildLeadEmailText } from "./build-lead-email";

export interface LeadEmailResult {
  ok: boolean;
}

export async function sendLeadNotification(
  payload: LeadPayload
): Promise<LeadEmailResult> {
  const env = getLeadNotifyEnv();
  if (!isLeadEmailConfigured(env)) return { ok: false };

  return postResendEmail(env, payload);
}

async function postResendEmail(
  env: LeadNotifyEnv,
  payload: LeadPayload
): Promise<LeadEmailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getLeadFromAddress(env),
        to: [env.LEAD_NOTIFY_EMAIL],
        reply_to: payload.email,
        subject: buildLeadEmailSubject(payload),
        text: buildLeadEmailText(payload),
      }),
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 200);
      console.error("[notifyLead] Resend failed", response.status, detail);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("[notifyLead] Resend request error", error);
    return { ok: false };
  }
}
