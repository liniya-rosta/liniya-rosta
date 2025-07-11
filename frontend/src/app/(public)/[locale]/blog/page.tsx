import React from "react";
import { Post } from "@/lib/types";
import BlogClient from "@/src/app/(public)/[locale]/blog/BlogClient";
import { fetchPosts } from "@/actions/posts";

const BlogPage = async () => {
    let posts: Post[] = [];
    let postsError: string | null = null;

    try {
        posts = await fetchPosts();
    } catch (e) {
        if (e instanceof Error) {
            postsError = e.message;
        } else {
            postsError = 'Неизвестная ошибка на сервере при загрузке постов.';
        }
    }

    return (
        <BlogClient data={posts} error={postsError} />
    );
};

export default BlogPage;