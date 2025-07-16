import { create } from 'zustand';
import { Product } from '@/lib/types';

interface ProductState {
    products: Product[];
    fetchProductsLoading: boolean;
    fetchProductsError: string | null;
    setProducts: (products: Product[]) => void;
    setFetchProductsLoading: (loading: boolean) => void;
    setFetchProductsError: (error: string | null) => void;
    product: Product | null;
    setProduct: (product: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    fetchProductsLoading: true,
    fetchProductsError: null,
    setProducts: (products) => set({products}),
    setFetchProductsLoading: (loading) => set({fetchProductsLoading: loading}),
    setFetchProductsError: (error) => set({fetchProductsError: error}),
    product: null,
    setProduct: (product) => set({product}),
}));
