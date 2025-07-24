import React from "react";
import { Post } from "@/src/lib/types";
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
        <main className="container mx-auto px-8">
            <h1 className="text-3xl font-bold text-foreground mb-5">
                Блог
                <span className="block font-medium text-muted-foreground text-sm tracking-wider uppercase">
                    Последние новости и статьи
                </span>
            </h1>
            <BlogClient data={posts} error={postsError} />
        </main>
    );
};

export default BlogPage;