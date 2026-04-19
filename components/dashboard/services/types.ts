export interface LandingPageData {
  id: string;
  slug: string;
  template: string;
  variables: string; // JSON string
  sections: string; // JSON string
  status: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  type: string;
  deliverables: string;
  priceMin: number;
  priceMax: number;
  turnaroundDays: number;
  funnelUrl: string | null;
  status: string;
  ownedLandingPage?: LandingPageData | null;
  _count?: {
    tickets: number;
  };
}

export interface Ticket {
  id: string;
  clientName: string;
  clientEmail: string;
  niche: string;
  message: string;
  source?: string;
  status: string;
  notes?: string;
  quote?: string;
  quoteSentAt?: Date | string;
  deliverables?: string;
  deliveredAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  service: {
    id: string;
    name: string;
    type: string;
    deliverables: string;
    priceMin: number;
    priceMax: number;
    turnaroundDays: number;
  };
}
