import {create} from 'zustand';
import axiosAPI from '@/lib/axiosAPI';
import {Category, Product} from '@/lib/types';

interface HomeStoreState {
    categories: Category[];
    products: Product[];
    fetchLoading: boolean;
    fetchCategories: () => Promise<void>;
    fetchProducts: () => Promise<void>;
}

export const useHomeStore = create<HomeStoreState>((set) => ({
    categories: [],
    products: [],
    fetchLoading: false,

    fetchCategories: async () => {
        set({fetchLoading: true});
        try {
            const res = await axiosAPI<Category[]>('/categories');
            set({categories: res.data});
        } catch (e) {
            console.error(e);
        } finally {
            set({fetchLoading: false});
        }
    },

    fetchProducts: async () => {
        set({fetchLoading: true});
        try {
            const res = await axiosAPI<Product[]>('/products');
            set({products: res.data});
        } catch (e) {
            console.error(e);
        } finally {
            set({fetchLoading: false});
        }
    },
}));