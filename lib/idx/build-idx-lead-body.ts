import type { LeadPayload } from "./types";

/** IDX `PUT /leads/lead` body. Never send `property` — it 500s. */
export function buildIdxLeadBody(
  payload: LeadPayload
): Record<string, string> {
  const body: Record<string, string> = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
  };

  if (payload.phone) body.phone = payload.phone;
  if (payload.listingId) body.listingID = payload.listingId;
  if (payload.propertyAddress) body.address = payload.propertyAddress;

  const notes = buildIdxLeadNotes(payload.message, payload.propertyAddress);
  if (notes) body.notes = notes;

  return body;
}

export function buildIdxLeadNotes(
  message?: string,
  propertyAddress?: string
): string | undefined {
  if (message && propertyAddress && !message.includes(propertyAddress)) {
    return `${message}\nProperty: ${propertyAddress}`;
  }
  if (message) return message;
  return undefined;
}
