import {Laminate} from "@/lib/types";
import {create} from "zustand";

interface LaminateState {
    laminateItems: Laminate[];
    oneLaminateItem: Laminate | null;
    fetchLaminateLoading: boolean;
    fetchLaminateError: string | null;
    setLaminateItems: (laminateItems: Laminate[]) => void;
    setOneLaminateItem: (laminate: Laminate) => void;
    setLaminateLoading: (loading: boolean) => void;
    setFetchLaminateError: (error: string | null) => void;
}

export const useLaminateStore = create<LaminateState>((set) => ({
    laminateItems: [],
    oneLaminateItem: null,
    fetchLaminateLoading: true,
    fetchLaminateError: null,

    setLaminateItems: (data) => {
        set({ laminateItems: data })
    },

    setOneLaminateItem: (data) => {
        set({ oneLaminateItem: data })
    },

    setLaminateLoading: (value) => set({fetchLaminateLoading: value}),

    setFetchLaminateError: (error) => set({fetchLaminateError: error}),
}))