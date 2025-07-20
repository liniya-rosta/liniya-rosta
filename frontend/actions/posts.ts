import axiosAPI from "@/lib/axiosAPI";
import {Post, PostResponse} from "@/lib/types";
import {isAxiosError} from "axios";

export const fetchPosts = async (limit?: string, page?: string, title?: string, description?: string) => {
    try {
        const params = new URLSearchParams();

        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (title) params.append("title", title);
        if (description) params.append("description", description);

        const response = await axiosAPI<PostResponse>(
            `/posts${params.toString() ? `?${params.toString()}` : ""}`
        );
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.message || 'Произошла ошибка при получении постов');
        }
        throw e;
    }
};

export const fetchPostById = async (postId: string): Promise<Post> => {
    try {
        const response = await axiosAPI.get<Post>(`/posts/${postId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.message || 'Произошла ошибка при получении поста');
        }
        throw e;
    }
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
    const response = await axiosAPI.get<Post>(`/posts/slug/${slug}`);
    return response.data;
};