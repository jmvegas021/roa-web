import { z } from "zod";
import { SITE } from "@/lib/content/team";

export interface LeadNotifyEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
  LEAD_NOTIFY_EMAIL: string;
}

const DEFAULT_FROM = "Office of Kevin Shoun <noreply@kevinshoun.com>";

export function getLeadNotifyEnv(): LeadNotifyEnv {
  return {
    RESEND_API_KEY: emptyToUndef(process.env.RESEND_API_KEY),
    RESEND_FROM_EMAIL: emptyToUndef(process.env.RESEND_FROM_EMAIL),
    LEAD_FROM_EMAIL: emptyToUndef(process.env.LEAD_FROM_EMAIL),
    LEAD_NOTIFY_EMAIL:
      parseNotifyEmail(process.env.LEAD_NOTIFY_EMAIL) ?? SITE.email,
  };
}

export function isLeadEmailConfigured(
  env: LeadNotifyEnv = getLeadNotifyEnv()
): boolean {
  return Boolean(env.RESEND_API_KEY);
}

export function getLeadFromAddress(
  env: LeadNotifyEnv = getLeadNotifyEnv()
): string {
  return env.RESEND_FROM_EMAIL || env.LEAD_FROM_EMAIL || DEFAULT_FROM;
}

function emptyToUndef(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseNotifyEmail(raw: string | undefined): string | undefined {
  const value = emptyToUndef(raw);
  if (!value) return undefined;
  const parsed = z.string().email().safeParse(value);
  if (!parsed.success) {
    console.warn(
      "[lead-notify] LEAD_NOTIFY_EMAIL is invalid; using office inbox"
    );
    return undefined;
  }
  return parsed.data;
}
