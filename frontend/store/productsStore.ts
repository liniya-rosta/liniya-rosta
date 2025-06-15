import { create } from 'zustand';
import { Product } from '@/lib/types';

interface ProductState {
    products: Product[];
    loading: boolean;
    fetchLoading: boolean;
    error: string | null;
    fetchError: string | null;

    setProducts: (products: Product[]) => void;
    setLoading: (loading: boolean) => void;
    setFetchLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFetchError: (error: string | null) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updatedProduct: Product) => void;
    removeProduct: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
    clearError: () => void;
    reset: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    loading: false,
    fetchLoading: false,
    error: null,
    fetchError: null,

    setProducts: (products) => set({ products }),
    setLoading: (loading) => set({ loading }),
    setFetchLoading: (loading) => set({ fetchLoading: loading, loading }),
    setError: (error) => set({ error }),
    setFetchError: (error) => set({ fetchError: error, error }),

    addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
    updateProduct: (id, updatedProduct) =>
        set((state) => ({
            products: state.products.map((p) => (p._id === id ? updatedProduct : p))
        })),
    removeProduct: (id) =>
        set((state) => ({
            products: state.products.filter((p) => p._id !== id)
        })),
    getProductById: (id) => get().products.find((p) => p._id === id),

    clearError: () => set({ error: null, fetchError: null }),
    reset: () =>
        set({
            products: [],
            loading: false,
            fetchLoading: false,
            error: null,
            fetchError: null
        })
}));