import { create } from 'zustand';
import { Category } from '@/lib/types';

interface CategoryState {
    categories: Category[];
    fetchCategoriesLoading: boolean;
    fetchCategoriesError: string | null;

    setCategories: (categories: Category[]) => void;
    setFetchCategoriesLoading: (loading: boolean) => void;
    setFetchCategoriesError: (error: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    fetchCategoriesLoading: true,
    fetchCategoriesError: null,

    setCategories: (categories) => set({ categories }),
    setFetchCategoriesLoading: (loading) => set({ fetchCategoriesLoading: loading }),
    setFetchCategoriesError: (error) => set({ fetchCategoriesError: error }),
}));
