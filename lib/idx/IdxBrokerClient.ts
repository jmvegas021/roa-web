import { getIdxEnv, hasIdxCredentials, type IdxEnv } from "./env";
import type { LeadPayload } from "./types";

interface IdxRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, string | number | undefined>;
  body?: Record<string, unknown>;
  revalidate?: number | false;
}

interface IdxResponse<T> {
  data: T;
  hourlyUsage: number | null;
  apiVersion: string | null;
  status: number;
}

/**
 * Server-only IDX Broker REST client.
 * Authenticates via headers; never imported from client components.
 */
export class IdxBrokerClient {
  private readonly env: IdxEnv;
  private readonly baseUrl = "https://api.idxbroker.com";

  constructor(env: IdxEnv = getIdxEnv()) {
    this.env = env;
  }

  isConfigured(): boolean {
    return hasIdxCredentials(this.env);
  }

  async getFeaturedListings(limit = 12): Promise<IdxResponse<unknown>> {
    return this.request({
      path: "/clients/featured",
      query: { limit },
      revalidate: 300,
    });
  }

  async getAgents(): Promise<IdxResponse<unknown>> {
    return this.request({
      path: "/clients/agents",
      revalidate: 600,
    });
  }

  async getWidgets(): Promise<IdxResponse<unknown>> {
    return this.request({
      path: "/clients/widgets",
      revalidate: 3600,
    });
  }

  async getAccountInfo(): Promise<IdxResponse<unknown>> {
    return this.request({
      path: "/clients/accountinfo",
      revalidate: 3600,
    });
  }

  async createLead(payload: LeadPayload): Promise<IdxResponse<unknown>> {
    const body: Record<string, unknown> = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
    if (payload.phone) body.phone = payload.phone;
    if (payload.message) body.notes = payload.message;
    if (payload.listingId) body.listingID = payload.listingId;
    if (payload.propertyAddress) body.property = payload.propertyAddress;

    return this.request({
      method: "PUT",
      path: "/leads/lead",
      body,
      revalidate: false,
    });
  }

  private buildHeaders(): HeadersInit {
    if (!this.env.IDX_API_KEY) {
      throw new Error("IDX_API_KEY is not configured");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
      accesskey: this.env.IDX_API_KEY,
      outputtype: "json",
      apiversion: this.env.IDX_API_VERSION ?? "1.8.0",
    };

    if (this.env.IDX_ANCILLARY_KEY) {
      headers.ancillarykey = this.env.IDX_ANCILLARY_KEY;
    }

    return headers;
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T = unknown>(
    options: IdxRequestOptions
  ): Promise<IdxResponse<T>> {
    const method = options.method ?? "GET";
    const url = this.buildUrl(options.path, options.query);
    const headers = this.buildHeaders();

    const init: RequestInit & { next?: { revalidate?: number | false } } = {
      method,
      headers,
    };

    if (options.revalidate !== undefined) {
      init.next = { revalidate: options.revalidate };
    } else if (method === "GET") {
      init.next = { revalidate: 300 };
    } else {
      init.cache = "no-store";
    }

    if (options.body && (method === "POST" || method === "PUT")) {
      init.body = new URLSearchParams(
        Object.entries(options.body).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          },
          {}
        )
      ).toString();
    }

    const response = await fetch(url, init);
    const hourlyUsageHeader = response.headers.get("Hourly-Access-Key-Usage");
    const apiVersion = response.headers.get("Api-Version");
    const text = await response.text();

    let data: T;
    try {
      data = text ? (JSON.parse(text) as T) : (null as T);
    } catch {
      data = text as unknown as T;
    }

    if (!response.ok) {
      const message =
        typeof data === "object" && data !== null
          ? JSON.stringify(data)
          : String(data);
      throw new Error(
        `IDX API ${method} ${options.path} failed (${response.status}): ${message}`
      );
    }

    return {
      data,
      hourlyUsage: hourlyUsageHeader ? Number(hourlyUsageHeader) : null,
      apiVersion,
      status: response.status,
    };
  }
}

export function createIdxClient(): IdxBrokerClient {
  return new IdxBrokerClient();
}
