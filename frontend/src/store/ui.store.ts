import { create } from "zustand";

interface UIState {
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeStatus: string;
  setStatus: (s: string) => void;
  activeSort: "top" | "new";
  setSort: (s: "top" | "new") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  activeStatus: "ALL",
  setStatus: (activeStatus) => set({ activeStatus }),
  activeSort: "top",
  setSort: (activeSort) => set({ activeSort }),
}));
