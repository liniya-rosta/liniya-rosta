'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePostsStore } from '@/store/postsStore';
import { Post } from "@/lib/types";
import { API_BASE_URL } from "@/lib/globalConstants";
import Image from "next/image";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Terminal } from 'lucide-react';
import EmptyState from "@/components/ui/emptyState";

interface Props {
    data: Post[];
    error: string | null;
}

const BlogClient: React.FC<Props> = ({ data, error }) => {
    const {
        posts,
        fetchPostsLoading,
        fetchPostsError,
        setPosts,
        setFetchPostsError,
        setfetchPostsLoading
    } = usePostsStore();

    useEffect(() => {
        if (data) {
            setPosts(data);
        }
        setFetchPostsError(error);
        setfetchPostsLoading(false);
    }, [data, error, setPosts, setFetchPostsError, setfetchPostsLoading]);

    if (fetchPostsLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground">Блог</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                            <CardFooter>
                                <Skeleton className="h-10 w-32 ml-auto" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (fetchPostsError) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
                <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Ошибка!</AlertTitle>
                    <AlertDescription>
                        Ошибка при загрузке постов: {fetchPostsError}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-start px-4 py-8">
                <EmptyState message="Пока нет опубликованных постов." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Card
                        key={post._id}
                        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        <div className="relative aspect-video h-48 w-full">
                            <Image
                                src={`${API_BASE_URL}/${post.image}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'; // Fallback image
                                }}
                                alt={post.title}
                                className="object-cover"
                            />
                        </div>

                        <CardHeader className="flex-grow">
                            <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
                            <CardDescription className="line-clamp-3 text-sm">{post.description}</CardDescription>
                        </CardHeader>

                        <CardFooter className="flex justify-end pt-0">
                            <Link href={`/blog/${post._id}`} passHref>
                                <Button className="inline-flex items-center gap-2">
                                    <span>Подробнее</span>
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BlogClient;