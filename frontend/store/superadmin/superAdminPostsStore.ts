import { create } from 'zustand';
import {PaginationMeta, Post} from '@/src/lib/types';

interface AdminPostState {
    posts: Post[];
    detailPost: Post | null;
    fetchLoading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    fetchError: string | null;
    paginationPost: PaginationMeta | null,
    selectedToDelete: string[];

    setPosts: (posts: Post[]) => void;
    setDetailPost: (data: Post) => void;
    setFetchLoading: (loading: boolean) => void;
    setCreateLoading: (loading: boolean) => void;
    setUpdateLoading: (loading: boolean) => void;
    setDeleteLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
    setPaginationPost: (data: PaginationMeta) => void;
    setSelectedToDelete: (selectedToDelete: string[]) => void;
}

export const useSuperAdminPostStore = create<AdminPostState>((set) => ({
    posts: [],
    detailPost: null,
    fetchLoading: true,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    fetchError: null,
    paginationPost: null,
    selectedToDelete: [],

    setPosts: (posts) => set({ posts }),
    setDetailPost: (data) => set({ detailPost: data }),
    setFetchLoading: (loading) => set({ fetchLoading: loading }),
    setCreateLoading: (loading) => set({ createLoading: loading }),
    setUpdateLoading: (loading) => set({ updateLoading: loading }),
    setDeleteLoading: (loading) => set({ deleteLoading: loading }),
    setFetchError: (error) => set({ fetchError: error }),
    setPaginationPost: (data) => set({ paginationPost: data }),
    setSelectedToDelete: (ids) => set({ selectedToDelete: ids }),
}));