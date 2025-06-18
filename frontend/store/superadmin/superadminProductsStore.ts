import { create } from 'zustand';
import { Product } from '@/lib/types';

interface AdminProductState {
    products: Product[];
    fetchLoading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;

    setProducts: (products: Product[]) => void;
    setFetchLoading: (loading: boolean) => void;
    setCreateLoading: (loading: boolean) => void;
    setUpdateLoading: (loading: boolean) => void;
    setDeleteLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
    setCreateError: (error: string | null) => void;
    setUpdateError: (error: string | null) => void;
    setDeleteError: (error: string | null) => void;
}

export const useAdminProductStore = create<AdminProductState>((set) => ({
    products: [],
    fetchLoading: true,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    fetchError: null,
    createError: null,
    updateError: null,
    deleteError: null,

    setProducts: (products) => set({ products }),
    setFetchLoading: (loading) => set({ fetchLoading: loading }),
    setCreateLoading: (loading) => set({ createLoading: loading }),
    setUpdateLoading: (loading) => set({ updateLoading: loading }),
    setDeleteLoading: (loading) => set({ deleteLoading: loading }),
    setFetchError: (error) => set({ fetchError: error }),
    setCreateError: (error) => set({ createError: error }),
    setUpdateError: (error) => set({ updateError: error }),
    setDeleteError: (error) => set({ deleteError: error }),
}));