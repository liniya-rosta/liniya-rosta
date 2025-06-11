import {create} from 'zustand';
import {Product} from '@/lib/types';

interface ProductState {
    products: Product[];
    fetchLoading: boolean;
    fetchError: string | null;
    setProducts: (products: Product[]) => void;
    setFetchLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    fetchLoading: false,
    fetchError: null,
    setProducts: (products) => set({ products }),
    setFetchLoading: (loading) => set({ fetchLoading: loading }),
    setFetchError: (error) => set({ fetchError: error })
}));