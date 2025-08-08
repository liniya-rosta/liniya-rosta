import React from "react";
import {PostResponse} from "@/src/lib/types";
import BlogClient from "@/src/app/(public)/[locale]/blog/BlogClient";
import {fetchPosts} from "@/actions/posts";

import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("BlogPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.blog"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "/blog",
            siteName: "Линия Роста",
            images: [
                {
                    url: "/images/og/blog.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("ogImageAlt"),
                },
            ],
            type: "website",
        },
    };
};

const BlogPage = async () => {
    let posts: PostResponse | null = null;
    let postsError: string | null = null;
    const limit = "9";

    const tBlog = await getTranslations("BlogPage");

    try {
        posts = await fetchPosts(limit);
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
                    {tBlog("subTitle")}
                </span>
            </h1>
            <BlogClient data={posts} error={postsError} limit={limit} />
        </main>
    );
};

export default BlogPage;