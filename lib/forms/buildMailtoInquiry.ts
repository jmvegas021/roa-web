import { SITE } from "@/lib/content/team";

export interface InquiryFields {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  listingId?: string;
  propertyAddress?: string;
}

/** Builds a mailto: URL for static hosting (no server actions). */
export function buildMailtoInquiry(fields: InquiryFields): string {
  const subject = fields.propertyAddress
    ? `Inquiry — ${fields.propertyAddress}`
    : `Inquiry — ${SITE.office}`;

  const lines = [
    `Name: ${fields.firstName} ${fields.lastName}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.propertyAddress ? `Property: ${fields.propertyAddress}` : null,
    fields.listingId ? `Listing ID: ${fields.listingId}` : null,
    "",
    fields.message || "(No message provided)",
  ].filter((line): line is string => line !== null);

  const params = new URLSearchParams({
    subject,
    body: lines.join("\n"),
  });

  return `mailto:${SITE.email}?${params.toString()}`;
}
