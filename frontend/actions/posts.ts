import {Post, PostResponse} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const fetchPosts = async (limit?: string, page?: string, title?: string, description?: string) => {
    const searchParams = new URLSearchParams();

    if (page) searchParams.append("page", page);
    if (limit) searchParams.append("limit", limit);
    if (title) searchParams.append("title", title);
    if (description) searchParams.append("description", description);

    return await kyAPI.get("posts", {searchParams}).json<PostResponse>();
};

export const fetchPostById = async (postId: string): Promise<Post> => {
    return await kyAPI.get(`posts/${postId}`).json<Post>();
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
    return await kyAPI.get(`posts/slug/${slug}`).json<Post>();
};