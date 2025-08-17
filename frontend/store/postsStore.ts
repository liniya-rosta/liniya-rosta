import { create } from 'zustand';
import {PaginationMeta, Post} from '@/src/lib/types';

interface PostsState {
    posts: Post[];
    fetchPostsLoading: boolean;
    fetchPostsError: string | null;
    paginationPosts: PaginationMeta | null;

    setPosts: (posts: Post[]) => void;
    setFetchPostsLoading: (loading: boolean) => void;
    setFetchPostsError: (error: string | null) => void;
    setPaginationPosts: (data: PaginationMeta) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    posts: [],
    fetchPostsLoading: true,
    fetchPostsError: null,
    paginationPosts: null,

    setPosts: (posts) => set({posts}),
    setFetchPostsLoading: (loading) => set({fetchPostsLoading: loading}),
    setFetchPostsError: (error) => set({fetchPostsError: error}),
    setPaginationPosts: (data) => set({ paginationPosts: data }),
}));