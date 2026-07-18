export interface LuxuryListing {
  id: string;
  listingId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: string;
  imageUrl: string;
  gallery: string[];
  description: string;
  mlsId?: string;
  idxDetailUrl?: string;
  agentName?: string;
}

export interface AgentProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  imageUrl: string;
  isPrimary?: boolean;
}

export interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  listingId?: string;
  propertyAddress?: string;
}

export interface IdxFeaturedListingRaw {
  listingID?: string | number;
  idxID?: string;
  address?: string;
  streetName?: string;
  cityName?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  zip?: string;
  listingPrice?: string | number;
  price?: string | number;
  bedrooms?: string | number;
  totalBaths?: string | number;
  bathrooms?: string | number;
  fullBaths?: string | number;
  halfBaths?: string | number;
  sqFt?: string | number;
  acres?: string | number;
  propStatus?: string;
  status?: string;
  image?: string | Record<string, string | { url?: string }>;
  imageUrl?: string;
  images?: Array<string | { url?: string }>;
  remarksConcat?: string;
  remarks?: string;
  mlsPtID?: string | number;
  agent?: string;
  agentDisplayName?: string;
  detailsURL?: string;
  fullDetailsURL?: string;
  [key: string]: unknown;
}

export interface IdxAgentRaw {
  agentID?: string | number;
  agentName?: string;
  agentFirstName?: string;
  agentLastName?: string;
  agentTitle?: string;
  agentEmail?: string;
  agentPhone?: string;
  agentBio?: string;
  agentPhotoURL?: string;
  [key: string]: unknown;
}

export interface IdxWidgetRaw {
  id?: string | number;
  name?: string;
  url?: string;
  type?: string;
  [key: string]: unknown;
}
