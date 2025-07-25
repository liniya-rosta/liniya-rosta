import { create } from 'zustand';
import { Post } from '@/src/lib/types';

interface PostsState {
    posts: Post[];
    fetchPostsLoading: boolean;
    fetchPostsError: string | null;
    setPosts: (posts: Post[]) => void;
    setFetchPostsLoading: (loading: boolean) => void;
    setFetchPostsError: (error: string | null) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
    posts: [],
    fetchPostsLoading: true,
    fetchPostsError: null,

    setPosts: (posts) => set({posts}),
    setFetchPostsLoading: (loading) => set({fetchPostsLoading: loading}),
    setFetchPostsError: (error) => set({fetchPostsError: error}),
}));