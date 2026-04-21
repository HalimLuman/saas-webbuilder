import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  // Populated by API
  memberCount?: number;
  myRole?: string;
  isDefault?: boolean;
}

interface WorkspaceStore {
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
    }),
    { name: "buildstack-workspace", skipHydration: true }
  )
);
