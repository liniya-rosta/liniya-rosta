import { create } from 'zustand';
import { Category } from '@/lib/types';

interface CategoryState {
    categories: Category[];
    loading: boolean;
    fetchLoading: boolean;
    error: string | null;
    fetchError: string | null;

    setCategories: (categories: Category[]) => void;
    setLoading: (loading: boolean) => void;
    setFetchLoading: (loading: boolean) => void;
    setCategoriesError: (error: string | null) => void;
    setFetchError: (error: string | null) => void;
    getCategoryById: (id: string) => Category | undefined;
    clearError: () => void;
    reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loading: false,
    fetchLoading: false,
    error: null,
    fetchError: null,

    setCategories: (categories) => set({ categories }),
    setLoading: (loading) => set({ loading }),
    setFetchLoading: (loading) => set({ fetchLoading: loading, loading }),
    setCategoriesError: (error) => set({ error }),
    setFetchError: (error) => set({ fetchError: error, error }),
    getCategoryById: (id) => get().categories.find((category) => category._id === id),
    clearError: () => set({ error: null, fetchError: null }),
    reset: () =>
        set({
            categories: [],
            loading: false,
            fetchLoading: false,
            error: null,
            fetchError: null
        })
}));
