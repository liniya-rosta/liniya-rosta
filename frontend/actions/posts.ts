import axiosAPI from "@/lib/axiosAPI";
import {CreatePostData, Post, UpdatePostData} from "@/lib/types";

export const fetchPosts = async (): Promise<Post[]> => {
    const response = await axiosAPI<Post[]>("/posts");
    return response.data;
};

export const fetchPostById = async (postId: string): Promise<Post> => {
    try {
        const response = await axiosAPI<Post>("/posts/" + postId);
        return response.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const createPost = async (postData: CreatePostData): Promise<{ message: string; post: Post }> => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('image', postData.image);

    const response = await axiosAPI.post<{ message: string; post: Post }>("/superadmin/posts", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

export const updatePost = async (postId: string, postData: UpdatePostData): Promise<{ message: string; post: Post }> => {
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

    const response = await axiosAPI.patch<{ message: string; post: Post }>("/superadmin/posts/" + postId, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

export const deletePost = async (postId: string): Promise<{ message: string }> => {
    const response = await axiosAPI.delete<{ message: string }>("/superadmin/posts/" + postId);
    return response.data;
};