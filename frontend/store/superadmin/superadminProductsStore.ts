import { create } from 'zustand';
import { Product } from '@/lib/types';

interface AdminProductState {
    products: Product[];
    setProducts: (products: Product[]) => void;

    fetchLoading: boolean;
    setFetchLoading: (loading: boolean) => void;

    fetchError: string | null;
    setFetchError: (error: string | null) => void;

    createLoading: boolean;
    setCreateLoading: (loading: boolean) => void;

    createError: string | null;
    setCreateError: (error: string | null) => void;

    updateLoading: boolean;
    setUpdateLoading: (loading: boolean) => void;

    updateError: string | null;
    setUpdateError: (error: string | null) => void;

    deleteLoading: boolean;
    setDeleteLoading: (loading: boolean) => void;


    deleteError: string | null;
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