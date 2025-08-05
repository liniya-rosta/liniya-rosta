'use client';

import React, {useEffect} from 'react';
import {usePostsStore} from '@/store/postsStore';
import {PostResponse} from "@/src/lib/types";
import CardSkeleton from "@/src/app/(public)/[locale]/blog/components/CardSkeleton";
import PostCard from "@/src/app/(public)/[locale]/blog/components/PostCard";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    data: PostResponse | null;
    error: string | null;
}

const BlogClient: React.FC<Props> = ({data, error}) => {
    const {
        posts,
        fetchPostsLoading,
        setPosts,
        setFetchPostsError,
        setFetchPostsLoading
    } = usePostsStore();
    const tBlog = useTranslations("BlogPage");
    const tError = useTranslations("Errors");
    const locale = useLocale() as "ky" | "ru";

    useEffect(() => {
        if (data) {
            setPosts(data.items);
        }
        setFetchPostsError(error);
        setFetchPostsLoading(false);
    }, [data, error, setPosts, setFetchPostsError, setFetchPostsLoading]);

    if (fetchPostsLoading) return <CardSkeleton/>;
    if (error) return <p>{tError("newsError")}</p>

    return (
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px]">

                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            slug={post.slug}
                            title={post.title[locale]}
                            description={post.description[locale]}
                            images={post.images}
                        />
                    ))
                ) : <div className="flex justify-center items-center min-h-[200px]">
                    <p className="text-muted-foreground text-lg text center">{tBlog("noNews")}</p>
                </div>
                }
            </div>
        </div>
    );
};

export default BlogClient;