import type { LeadPayload } from "@/lib/idx/types";

export type LeadEmailKind = "valuation" | "listing" | "consultation";

export function getLeadEmailKind(payload: LeadPayload): LeadEmailKind {
  if (payload.listingId) return "listing";
  if (payload.propertyAddress) return "valuation";
  return "consultation";
}

export function buildLeadEmailSubject(payload: LeadPayload): string {
  const kind = getLeadEmailKind(payload);
  if (kind === "valuation") {
    return payload.propertyAddress
      ? `Home valuation — ${payload.propertyAddress}`
      : "Home valuation request";
  }
  if (kind === "listing") return `Listing inquiry — ${payload.listingId}`;
  return "Private consultation request";
}

export function buildLeadEmailText(payload: LeadPayload): string {
  const lines = [
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.propertyAddress ? `Address: ${payload.propertyAddress}` : null,
    payload.listingId ? `Listing ID: ${payload.listingId}` : null,
    "",
    payload.message ?? "(No message provided)",
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}
