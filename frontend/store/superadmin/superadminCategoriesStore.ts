import { create } from 'zustand';
import { Category } from '@/src/lib/types';

interface AdminCategoryState {
    categories: Category[];
    setCategories: (categories: Category[]) => void;

    fetchCategoriesLoading: boolean;
    setFetchCategoriesLoading: (loading: boolean) => void;
    fetchCategoriesError: string | null;
    setFetchCategoriesError: (error: string | null) => void;

    createCategoryLoading: boolean;
    setCreateCategoryLoading: (loading: boolean) => void;
    createCategoryError: string | null;
    setCreateCategoryError: (error: string | null) => void;

    deleteCategoryLoading: boolean;
    setDeleteCategoryLoading: (loading: boolean) => void;
    deleteCategoryError: string | null;
    setDeleteCategoryError: (error: string | null) => void;
}

export const useAdminCategoryStore = create<AdminCategoryState>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),

    fetchCategoriesLoading: false,
    setFetchCategoriesLoading: (loading) => set({ fetchCategoriesLoading: loading }),
    fetchCategoriesError: null,
    setFetchCategoriesError: (error) => set({ fetchCategoriesError: error }),

    createCategoryLoading: false,
    setCreateCategoryLoading: (loading) => set({ createCategoryLoading: loading }),
    createCategoryError: null,
    setCreateCategoryError: (error) => set({ createCategoryError: error }),

    deleteCategoryLoading: false,
    setDeleteCategoryLoading: (loading) => set({ deleteCategoryLoading: loading }),
    deleteCategoryError: null,
    setDeleteCategoryError: (error) => set({ deleteCategoryError: error }),
}));