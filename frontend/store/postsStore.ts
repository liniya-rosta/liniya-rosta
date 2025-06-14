import { create } from 'zustand';
import { Post } from '@/lib/types';

interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;

    setPosts: (posts: Post[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getPostById: (postId: string) => Post | undefined;
    addPost: (post: Post) => void;
    updatePost: (postId: string, updatedPost: Post) => void;
    removePost: (postId: string) => void;
    upsertPost: (post: Post) => void;
    clearError: () => void;
    reset: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
    posts: [],
    loading: false,
    error: null,

    setPosts: (posts) => set({ posts }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    getPostById: (postId) => get().posts.find(post => post._id === postId),

    addPost: (post) => set(state => ({ posts: [...state.posts, post] })),

    updatePost: (postId, updatedPost) => set(state => ({
        posts: state.posts.map(post => post._id === postId ? updatedPost : post)
    })),

    removePost: (postId) => set(state => ({
        posts: state.posts.filter(post => post._id !== postId)
    })),

    upsertPost: (post) => set(state => {
        const exists = state.posts.some(p => p._id === post._id);
        return {
            posts: exists
                ? state.posts.map(p => p._id === post._id ? post : p)
                : [...state.posts, post]
        };
    }),

    clearError: () => set({ error: null }),
    reset: () => set({
        posts: [],
        loading: false,
        error: null
    })
}));