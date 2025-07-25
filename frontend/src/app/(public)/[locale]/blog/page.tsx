import React from "react";
import { PostResponse} from "@/src/lib/types";
import BlogClient from "@/src/app/(public)/[locale]/blog/BlogClient";
import { fetchPosts } from "@/actions/posts";

import type { Metadata } from "next";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: "Блог",
        description: "Последние новости, статьи и советы от компании Линия Роста. Всё о потолках, ламинате и интерьерных решениях.",
        openGraph: {
            title: "Блог | Линия Роста",
            description: "Читайте полезные статьи и свежие новости от нашей компании.",
            url: "/blog",
            siteName: "Линия Роста",
            images: [
                {
                    url: "/images/og/blog.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Блог Линия Роста",
                },
            ],
            type: "website",
        }
    };
};

const BlogPage = async () => {
    let posts: PostResponse | null = null;
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