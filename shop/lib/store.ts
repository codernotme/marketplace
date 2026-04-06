import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  expandedNavKeys: string[];
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  toggleNavKey: (key: string) => void;
  expandNavKey: (key: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      expandedNavKeys: ["dashboard"],
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleNavKey: (key) => {
        const curr = get().expandedNavKeys;
        set({
          expandedNavKeys: curr.includes(key)
            ? curr.filter((k) => k !== key)
            : [...curr, key],
        });
      },
      expandNavKey: (key) => {
        const curr = get().expandedNavKeys;
        if (!curr.includes(key)) {
          set({ expandedNavKeys: [...curr, key] });
        }
      },
    }),
    { name: "admin-ui-store" }
  )
);
