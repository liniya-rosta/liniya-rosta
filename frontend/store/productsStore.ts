import { create } from 'zustand';
import { Product, ProductWithoutId } from '@/lib/types';
import { createProduct, deleteProduct, fetchProductById, fetchProducts, updateProduct } from '@/actions/products';

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    loading: boolean;
    fetchLoading: boolean;
    error: string | null;
    fetchError: string | null;

    fetchProducts: (categoryId?: string) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    createProduct: (data: ProductWithoutId, imageFile?: File) => Promise<Product>;
    updateProduct: (id: string, data: Partial<ProductWithoutId>, imageFile?: File) => Promise<Product>;
    deleteProduct: (id: string) => Promise<void>;
    setProducts: (products: Product[]) => void;
    setFetchLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;

    clearError: () => void;
    reset: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    currentProduct: null,
    loading: false,
    fetchLoading: false,
    error: null,
    fetchError: null,

    fetchProducts: async (categoryId) => {
        set({ loading: true, fetchLoading: true, error: null, fetchError: null });
        try {
            const products = await fetchProducts(categoryId);
            set({ products, loading: false, fetchLoading: false });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ошибка при загрузке';
            set({
                error: errorMessage,
                fetchError: errorMessage,
                loading: false,
                fetchLoading: false
            });
        }
    },

    fetchProductById: async (id) => {
        set({ loading: true, error: null, fetchError: null });
        try {
            const product = await fetchProductById(id);
            set({ currentProduct: product, loading: false });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ошибка при загрузке продукта';
            set({
                error: errorMessage,
                fetchError: errorMessage,
                loading: false
            });
        }
    },

    createProduct: async (data, imageFile) => {
        set({ loading: true, error: null, fetchError: null });
        try {
            const newProduct = await createProduct(data, imageFile);
            set(state => ({ products: [...state.products, newProduct], loading: false }));
            return newProduct;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ошибка при создании';
            set({
                error: errorMessage,
                fetchError: errorMessage,
                loading: false
            });
            throw e;
        }
    },

    updateProduct: async (id, data, imageFile) => {
        set({ loading: true, error: null, fetchError: null });
        try {
            const updated = await updateProduct(id, data, imageFile);
            set(state => ({
                products: state.products.map(p => p._id === id ? updated : p),
                currentProduct: updated,
                loading: false
            }));
            return updated;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ошибка при обновлении';
            set({
                error: errorMessage,
                fetchError: errorMessage,
                loading: false
            });
            throw e;
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true, error: null, fetchError: null });
        try {
            await deleteProduct(id);
            set(state => ({
                products: state.products.filter(p => p._id !== id),
                currentProduct: null,
                loading: false
            }));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ошибка при удалении';
            set({
                error: errorMessage,
                fetchError: errorMessage,
                loading: false
            });
            throw e;
        }
    },

    setProducts: (products) => set({ products }),
    setFetchLoading: (loading) => set({ fetchLoading: loading }),
    setFetchError: (error) => set({ fetchError: error, error }),

    clearError: () => set({ error: null, fetchError: null }),
    reset: () => set({
        products: [],
        currentProduct: null,
        loading: false,
        fetchLoading: false,
        error: null,
        fetchError: null
    }),
}));