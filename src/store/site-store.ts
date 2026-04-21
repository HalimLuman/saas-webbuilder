import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Site, Deployment } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface SiteStore {
  sites: Site[];
  isLoading: boolean;

  // Actions
  addSite: (site: Omit<Site, "id" | "createdAt" | "updatedAt"> & { id?: string }) => Site;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  getSiteById: (id: string) => Site | undefined;
  duplicateSite: (id: string) => Site | null;
  deploySite: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useSiteStore = create<SiteStore>()(
  devtools(
    persist(
      (set, get) => ({
        sites: [],
        isLoading: false,

        addSite: (siteData) => {
          const newSite: Site = {
            ...siteData,
            id: siteData.id || `site-${generateId()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({ sites: [newSite, ...state.sites] }));
          return newSite;
        },

        updateSite: (id, updates) => {
          set((state) => ({
            sites: state.sites.map((site) =>
              site.id === id
                ? { ...site, ...updates, updatedAt: new Date() }
                : site
            ),
          }));
        },

        deleteSite: (id) => {
          set((state) => ({
            sites: state.sites.filter((site) => site.id !== id),
          }));
        },

        getSiteById: (id) => {
          return get().sites.find((site) => site.id === id);
        },

        duplicateSite: (id) => {
          const site = get().getSiteById(id);
          if (!site) return null;

          const newSite: Site = {
            ...site,
            id: `site-${generateId()}`,
            name: `${site.name} (Copy)`,
            status: "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({ sites: [newSite, ...state.sites] }));
          return newSite;
        },

        deploySite: async (id) => {
          const site = get().getSiteById(id);
          if (!site) return;

          set({ isLoading: true });

          try {
            // Simulate build time
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const domain = site.customDomain ?? site.domain ?? `${site.name.toLowerCase().replace(/\\s+/g, "-")}.buildstack.site`;

            const newDeployment: Deployment = {
              id: `deploy-${generateId()}`,
              siteId: id,
              status: "success",
              url: `https://${domain}`,
              createdAt: new Date(),
              finishedAt: new Date(),
              versionData: JSON.stringify(site),
            };

            // Save the published snapshot to localStorage
            localStorage.setItem(`published-site-${id}`, JSON.stringify(site));

            set((state) => ({
              sites: state.sites.map((s) =>
                s.id === id
                  ? {
                    ...s,
                    status: "published",
                    publishedAt: new Date(),
                    updatedAt: new Date(),
                    deployments: [newDeployment, ...(s.deployments || [])],
                  }
                  : s
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ isLoading: false });
            console.error("Failed to deploy site", error);
          }
        },

        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: "site-store-v2",
        partialize: (state) => ({ sites: state.sites }),
        // Prevent SSR/client mismatch: server renders with initial state ([]),
        // client rehydrates from localStorage after mount via StoreHydrator.
        skipHydration: true,
      }
    ),
    { name: "site-store" }
  )
);
