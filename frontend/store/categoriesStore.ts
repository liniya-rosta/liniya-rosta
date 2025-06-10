import {create} from 'zustand';
import {Category} from '@/lib/types';

interface CategoryState {
    categories: Category[];
    fetchLoading: boolean;
    fetchError: string | null;
    setCategories: (categories: Category[]) => void;
    setFetchLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    fetchLoading: false,
    fetchError: null,
    setCategories: (categories) => set({categories}),
    setFetchLoading: (loading) => set({fetchLoading: loading}),
    setFetchError: (error) => set({fetchError: error})
}));
