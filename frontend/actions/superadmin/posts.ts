import axiosAPI from "@/lib/axiosAPI";
import {ImageObject, Post, UpdateImagePost} from "@/lib/types";
import {CreatePostFormData, UpdatePostFormData} from "@/lib/zodSchemas/postSchema";

export const createPost = async (postData: CreatePostFormData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);

    postData.images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
        if (img.alt) formData.append("alts", img.alt);
    });

    await axiosAPI.post<{ message: string; post: Post }>("/superadmin/posts", formData);
};

export const updatePost = async (
    postId: string,
    postData: UpdatePostFormData,
    mode: "replace" | "append" = "replace"
) => {
    const formData = new FormData();

    if (postData.title) formData.append('title', postData.title);
    if (postData.description) formData.append('description', postData.description);
    formData.append("mode", mode);

    postData.images?.forEach((img) => {
        if (img.file) formData.append("images", img.file);
        formData.append("alts", img.alt ? img.alt : "");
    });

    await axiosAPI.patch(`/superadmin/posts/${postId}`, formData);
};

export const updatePostImage = async (postId: string, data: UpdateImagePost) => {
    const formData = new FormData();
    formData.append("imageUrl", data.imageUrl);
    formData.append("alt", data.alt ? data.alt : "");
    if (data.newImage) formData.append("newImage", data.newImage);

    await axiosAPI.patch(`/superadmin/posts/${postId}/update-image`, formData);
};

export const reorderPostImages = async (postId: string, newOrder: ImageObject[]) => {
    await axiosAPI.patch(`/superadmin/posts/${postId}/reorder-images`, {newOrder});
};

export const deletePostImage = async (postId: string, image: string) => {
    await axiosAPI.patch(`/superadmin/posts/${postId}/remove-images`, {image});
};

export const deletePost = async (postId: string) => {
    await axiosAPI.delete<{ message: string }>(`/superadmin/posts/${postId}`);
};