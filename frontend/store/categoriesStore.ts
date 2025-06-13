import {create} from 'zustand';
import {Category} from '@/lib/types';
import {fetchCategories} from "@/actions/categories";

interface CategoryState {
    categories: Category[];
    fetchLoading: boolean;
    fetchError: string | null;

    setCategories: (categories: Category[]) => void;
    setFetchLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;

    fetchCategoriesAsync: () => Promise<void>;

    clearErrors: () => void;
    reset: () => void;
    getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    currentCategory: null,
    fetchLoading: false,
    fetchError: null,

    setCategories: (categories) => set({ categories }),
    setFetchLoading: (loading) => set({ fetchLoading: loading }),
    setFetchError: (error) => set({ fetchError: error }),

    fetchCategoriesAsync: async () => {
        set({ fetchLoading: true, fetchError: null });
        try {
            const categories = await fetchCategories();
            set({ categories, fetchLoading: false });
        } catch (error) {
            set({
                fetchError: error instanceof Error ? error.message : 'Произошла ошибка при загрузке категорий',
                fetchLoading: false
            });
        }
    },

    clearErrors: () => set({ fetchError: null }),
    reset: () => set({
        categories: [],
        fetchLoading: false,
        fetchError: null
    }),
    getCategoryById: (id: string) => {
        const { categories } = get();
        return categories.find(category => category._id === id);
    }
}));