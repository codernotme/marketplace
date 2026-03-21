import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  isSearchOpen: boolean;
  toggleTheme: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  isSearchOpen: false,
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen }))
}));
