import { create } from "zustand";

type TBoxStore = {
    selectedTBoxId: string | null;
    setSelectedTBoxId: (id: string | null) => void;
};

export const useTBoxesStore = create<TBoxStore>((set) => ({
    selectedTBoxId: null,
    setSelectedTBoxId: (id) => set({ selectedTBoxId: id }),
}));
