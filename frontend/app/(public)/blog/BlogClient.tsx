'use client';

import React, {useEffect} from 'react';
import {usePostsStore} from '@/store/postsStore';
import {PostResponse} from "@/lib/types";
import CardSkeleton from "@/app/(public)/blog/components/CardSkeleton";
import PostCard from "@/app/(public)/blog/components/PostCard";
import ErrorMsg from "@/components/ui/ErrorMsg";

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

    useEffect(() => {
        if (data) {
            setPosts(data.items);
        }
        setFetchPostsError(error);
        setFetchPostsLoading(false);
    }, [data, error, setPosts, setFetchPostsError, setFetchPostsLoading]);

    if (fetchPostsLoading) return <CardSkeleton/>;
    if (error) return <ErrorMsg error={error}/>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-foreground">Блог</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            slug={post.slug}
                            title={post.title}
                            description={post.description}
                            images={post.images}
                        />
                    ))
                ) : <div className="flex justify-center items-center min-h-[200px]">
                    <p className="text-muted-foreground text-lg text center">Нет новостей</p>
                </div>
                }
            </div>
        </div>
    );
};

export default BlogClient;