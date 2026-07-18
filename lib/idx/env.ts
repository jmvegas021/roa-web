import { z } from "zod";

const envSchema = z.object({
  IDX_API_KEY: z.string().min(1).optional(),
  IDX_ACCOUNT_ID: z.string().optional(),
  IDX_ANCILLARY_KEY: z.string().optional(),
  IDX_API_VERSION: z.string().default("1.8.0"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_IDX_SUBDOMAIN: z.string().optional(),
  NEXT_PUBLIC_IDX_QUICK_SEARCH_ID: z.string().optional(),
  NEXT_PUBLIC_IDX_SHOWCASE_ID: z.string().optional(),
});

export type IdxEnv = z.infer<typeof envSchema>;

export function getIdxEnv(): IdxEnv {
  const parsed = envSchema.safeParse({
    IDX_API_KEY: process.env.IDX_API_KEY || undefined,
    IDX_ACCOUNT_ID: process.env.IDX_ACCOUNT_ID || undefined,
    IDX_ANCILLARY_KEY: process.env.IDX_ANCILLARY_KEY || undefined,
    IDX_API_VERSION: process.env.IDX_API_VERSION || "1.8.0",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    NEXT_PUBLIC_IDX_SUBDOMAIN: process.env.NEXT_PUBLIC_IDX_SUBDOMAIN || undefined,
    NEXT_PUBLIC_IDX_QUICK_SEARCH_ID:
      process.env.NEXT_PUBLIC_IDX_QUICK_SEARCH_ID || undefined,
    NEXT_PUBLIC_IDX_SHOWCASE_ID:
      process.env.NEXT_PUBLIC_IDX_SHOWCASE_ID || undefined,
  });

  if (!parsed.success) {
    console.warn("[idx] env validation warnings", parsed.error.flatten());
    return {
      IDX_API_VERSION: "1.8.0",
    };
  }

  return parsed.data;
}

export function hasIdxCredentials(env: IdxEnv = getIdxEnv()): boolean {
  return Boolean(env.IDX_API_KEY && env.IDX_API_KEY.length >= 10);
}

export const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  listingId: z.string().optional(),
  propertyAddress: z.string().max(200).optional(),
  website: z.string().max(0).optional(),
});

export type LeadFormInput = z.infer<typeof leadSchema>;
