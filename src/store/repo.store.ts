import { create } from "zustand";

type RepoStore = {
    selectedRepositoryId: string | null;
    setSelectedRepositoryId: (id: string | null) => void;
};

export const useRepoStore = create<RepoStore>((set) => ({
    selectedRepositoryId: null,
    setSelectedRepositoryId: (id) => set({ selectedRepositoryId: id }),
}));
