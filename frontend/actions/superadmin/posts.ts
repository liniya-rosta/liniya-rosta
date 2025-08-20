import {ImageObject, Post, UpdateImagePost} from "@/src/lib/types";
import {CreatePostFormData, UpdatePostFormData} from "@/src/lib/zodSchemas/admin/postSchema";
import kyAPI from "@/src/lib/kyAPI";

export const createPost = async (postData: CreatePostFormData) => {
    const formData = new FormData();
    formData.append('title', postData.title.ru);
    formData.append('description', postData.description.ru);
    formData.append('seoTitle', postData.seoTitle.ru);
    formData.append('seoDescription', postData.seoDescription.ru);

    postData.images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
        if (img.alt) formData.append("alts", img.alt.ru);
    });

    await kyAPI.post("superadmin/posts", {body: formData}).json<{ message: string; post: Post }>();
};

export const updatePost = async (postId: string, postData: UpdatePostFormData, mode: "replace" | "append" = "replace") => {
    const formData = new FormData();

    if (postData.title) formData.append('title', postData.title.ru);
    if (postData.description) formData.append('description', postData.description.ru);
    if (postData.seoTitle) formData.append('seoTitle', postData.seoTitle.ru);
    if (postData.seoDescription) formData.append('seoDescription', postData.seoDescription.ru);
    formData.append("mode", mode);

    postData.images?.forEach((img) => {
        if (img.image) formData.append("images", img.image);
        formData.append("alts", img.alt ? img.alt?.ru : "");
    });

    await kyAPI.patch(`superadmin/posts/${postId}`, {body: formData}).json();
};

export const updatePostImage = async (postId: string, data: UpdateImagePost) => {
    const formData = new FormData();
    formData.append("imageUrl", data.imageUrl);
    formData.append("alt", data.alt ? data.alt?.ru : "");
    if (data.newImage) formData.append("newImage", data.newImage);

    await kyAPI.patch(`superadmin/posts/${postId}/update-image`, {body: formData}).json();
};

export const reorderPostImages = async (postId: string, newOrder: ImageObject[]) => {
    await kyAPI.patch(`superadmin/posts/${postId}/reorder-images`, {json: {newOrder}}).json();
};

export const deletePostImage = async (postId: string, image: string) => {
    await kyAPI.patch(`superadmin/posts/${postId}/remove-images`, {json: {image}}).json();
};

export const deletePost = async (postId: string) => {
    await kyAPI.delete(`superadmin/posts/${postId}`).json<{ message: string }>();
};