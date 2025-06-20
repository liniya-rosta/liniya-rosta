import axiosAPI from "@/lib/axiosAPI";
import {CreatePostData, Post, UpdatePostData} from "@/lib/types";
import {isAxiosError} from "axios";

export const fetchPosts = async (): Promise<Post[]> => {
    try {
        const response = await axiosAPI.get<Post[]>("/posts");
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

export const createPost = async (postData: CreatePostData): Promise<{ message: string; post: Post }> => {
    try {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('description', postData.description);

        if (postData.image) {
            formData.append('image', postData.image);
        }

        const response = await axiosAPI.post<{ message: string; post: Post }>("/superadmin/posts", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при создании поста');
        }
        throw e;
    }
};

export const updatePost = async (postId: string, postData: UpdatePostData): Promise<{ message: string; post: Post }> => {
    try {
        const formData = new FormData();

        if (postData.title) {
            formData.append('title', postData.title);
        }
        if (postData.description) {
            formData.append('description', postData.description);
        }
        if (postData.image) {
            formData.append('image', postData.image);
        }

        const response = await axiosAPI.patch<{ message: string; post: Post }>(`/superadmin/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при обновлении поста');
        }
        throw e;
    }
};

export const deletePost = async (postId: string): Promise<{ message: string }> => {
    try {
        const response = await axiosAPI.delete<{ message: string }>(`/superadmin/posts/${postId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при удалении поста');
        }
        throw e;
    }
};