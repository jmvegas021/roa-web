import { MOCK_LISTINGS } from "@/lib/content/mock-listings";
import { TEAM } from "@/lib/content/team";
import { createIdxClient } from "./IdxBrokerClient";
import { mapAgents, mapFeaturedListings } from "./mappers";
import type { AgentProfile, LuxuryListing } from "./types";

export interface ListingsResult {
  listings: LuxuryListing[];
  source: "idx" | "mock";
}

export interface AgentsResult {
  agents: AgentProfile[];
  source: "idx" | "mock";
}

export class ListingsManager {
  async getFeatured(limit = 12): Promise<ListingsResult> {
    const client = createIdxClient();
    if (!client.isConfigured()) {
      return { listings: MOCK_LISTINGS.slice(0, limit), source: "mock" };
    }

    try {
      const response = await client.getFeaturedListings(limit);
      const listings = mapFeaturedListings(response.data).slice(0, limit);
      if (listings.length === 0) {
        return { listings: MOCK_LISTINGS.slice(0, limit), source: "mock" };
      }
      return { listings, source: "idx" };
    } catch (error) {
      console.error("[ListingsManager] featured fetch failed", error);
      return { listings: MOCK_LISTINGS.slice(0, limit), source: "mock" };
    }
  }

  async getById(id: string): Promise<LuxuryListing | null> {
    const { listings } = await this.getFeatured(50);
    return listings.find((item) => item.id === id || item.listingId === id) ?? null;
  }
}

export class AgentsManager {
  async getTeam(): Promise<AgentsResult> {
    const client = createIdxClient();
    if (!client.isConfigured()) {
      return { agents: TEAM, source: "mock" };
    }

    try {
      const response = await client.getAgents();
      const agents = mapAgents(response.data).filter(
        (agent) => agent.slug === "kevin-shoun" || agent.isPrimary
      );
      if (agents.length === 0) {
        return { agents: TEAM, source: "mock" };
      }
      return { agents, source: "idx" };
    } catch (error) {
      console.error("[AgentsManager] agents fetch failed", error);
      return { agents: TEAM, source: "mock" };
    }
  }

  async getBySlug(slug: string): Promise<AgentProfile | null> {
    const { agents } = await this.getTeam();
    return agents.find((agent) => agent.slug === slug) ?? null;
  }
}

export const listingsManager = new ListingsManager();
export const agentsManager = new AgentsManager();
