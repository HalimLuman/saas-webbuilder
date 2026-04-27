export type PlanType = "free" | "pro" | "business" | "enterprise";

export interface PlanLimits {
  maxPagesPerSite: number;
  maxCollections: number;
  maxRecordsPerCollection: number;
  maxPublishedSites: number;
  allowCustomDomain: boolean;
  allowAdvancedActions: boolean;
  allowBasicAuth: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxPagesPerSite: 2,
    maxCollections: 2,
    maxRecordsPerCollection: 100,
    maxPublishedSites: 1,
    allowCustomDomain: false,
    allowAdvancedActions: false,
    allowBasicAuth: true,
  },
  pro: {
    maxPagesPerSite: 20,
    maxCollections: 10,
    maxRecordsPerCollection: 10000,
    maxPublishedSites: 5,
    allowCustomDomain: true,
    allowAdvancedActions: true,
    allowBasicAuth: true,
  },
  business: {
    maxPagesPerSite: 999999, // effectively unlimited
    maxCollections: 50,
    maxRecordsPerCollection: 1000000,
    maxPublishedSites: 999999,
    allowCustomDomain: true,
    allowAdvancedActions: true,
    allowBasicAuth: true,
  },
  enterprise: {
    maxPagesPerSite: 999999,
    maxCollections: 999999,
    maxRecordsPerCollection: 999999,
    maxPublishedSites: 999999,
    allowCustomDomain: true,
    allowAdvancedActions: true,
    allowBasicAuth: true,
  },
};

