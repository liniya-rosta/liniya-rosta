import { create } from 'zustand';
import { Post, CreatePostData, UpdatePostData } from '@/lib/types';
import {
    createPost,
    deletePost,
    fetchPostById,
    fetchPosts,
    updatePost,
} from '@/actions/posts';

interface PostsState {
    posts: Post[];
    fetchLoading: boolean;
    fetchError: string | null;

    setPosts: (posts: Post[]) => void;
    fetchPostsAsync: () => Promise<void>;
    fetchPostByIdAsync: (postId: string) => Promise<Post | null>;
    getPostById: (postId: string) => Post | undefined;
    createPostAsync: (postData: CreatePostData) => Promise<Post>;
    updatePostAsync: (postId: string, postData: UpdatePostData) => Promise<Post>;
    deletePostAsync: (postId: string) => Promise<void>;
    clearErrors: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
    posts: [],
    fetchLoading: false,
    fetchError: null,

    setPosts: (posts) => set({ posts }),

    fetchPostsAsync: async () => {
        set({ fetchLoading: true, fetchError: null });
        try {
            const posts = await fetchPosts();
            set({ posts, fetchLoading: false });
        } catch (error) {
            set({
                fetchError:
                    error instanceof Error
                        ? error.message
                        : 'Ошибка при загрузке постов',
                fetchLoading: false,
            });
        }
    },

    fetchPostByIdAsync: async (postId: string) => {
        set({ fetchLoading: true, fetchError: null });
        try {
            const post = await fetchPostById(postId);
            const { posts } = get();
            const postExists = posts.some((p) => p._id === post._id);
            set({
                posts: postExists
                    ? posts.map((p) => (p._id === post._id ? post : p))
                    : [...posts, post],
                fetchLoading: false,
            });
            return post;
        } catch (error) {
            set({
                fetchError:
                    error instanceof Error
                        ? error.message
                        : 'Ошибка при загрузке поста',
                fetchLoading: false,
            });
            return null;
        }
    },

    getPostById: (postId: string) => {
        const { posts } = get();
        return posts.find((post) => post._id === postId);
    },

    createPostAsync: async (postData: CreatePostData) => {
        set({ fetchLoading: true, fetchError: null });
        try {
            const response = await createPost(postData);
            const newPost = response.post;
            const { posts } = get();
            set({ posts: [...posts, newPost], fetchLoading: false });
            return newPost;
        } catch (error) {
            set({
                fetchError:
                    error instanceof Error
                        ? error.message
                        : 'Ошибка при создании поста',
                fetchLoading: false,
            });
            throw error;
        }
    },

    updatePostAsync: async (postId: string, postData: UpdatePostData) => {
        set({ fetchLoading: true, fetchError: null });
        try {
            const response = await updatePost(postId, postData);
            const updatedPost = response.post;
            const { posts } = get();
            set({
                posts: posts.map((post) =>
                    post._id === postId ? updatedPost : post
                ),
                fetchLoading: false,
            });
            return updatedPost;
        } catch (error) {
            set({
                fetchError:
                    error instanceof Error
                        ? error.message
                        : 'Ошибка при обновлении поста',
                fetchLoading: false,
            });
            throw error;
        }
    },

    deletePostAsync: async (postId: string) => {
        set({ fetchLoading: true, fetchError: null });
        try {
            await deletePost(postId);
            const { posts } = get();
            set({ posts: posts.filter((post) => post._id !== postId), fetchLoading: false });
        } catch (error) {
            set({
                fetchError:
                    error instanceof Error
                        ? error.message
                        : 'Ошибка при удалении поста',
                fetchLoading: false,
            });
            throw error;
        }
    },

    clearErrors: () => set({ fetchError: null }),
}));
