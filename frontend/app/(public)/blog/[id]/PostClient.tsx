'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePostsStore } from "@/store/postsStore";
import { Post } from "@/lib/types";
import Loading from "@/components/ui/Loading/Loading";
import { API_BASE_URL } from "@/lib/globalConstants";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Terminal } from 'lucide-react';

interface Props {
    data: Post | null;
    error: string | null;
}

const PostClient: React.FC<Props> = ({ data, error }) => {
    const router = useRouter();

    const {
        setFetchPostsError,
        fetchPostsLoading,
        setFetchPostsLoading,
        fetchPostsError: storeError
    } = usePostsStore();

    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        setFetchPostsError(error);
        setFetchPostsLoading(false);
        setIsHydrating(false);
    }, [data, error, setFetchPostsError, setFetchPostsLoading]);

    if (isHydrating || fetchPostsLoading) return <Loading />;

    if (storeError) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
                <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Ошибка!</AlertTitle>
                    <AlertDescription>
                        Ошибка при загрузке поста: {storeError}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground text-lg">Пост не найден.</p>
                        <Button onClick={() => router.push('/blog')} className="mt-4">
                            Вернуться к блогу
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 pl-0 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к блогу
            </Button>

            <Card className="overflow-hidden">
                <div className="relative aspect-video md:aspect-[2/1] w-full">
                    <Image
                        src={`${API_BASE_URL}/${data.images}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
                        }}
                        alt={data.title}
                        className="object-cover"
                    />
                </div>

                <CardHeader className="space-y-4 pt-6 pb-4">
                    <CardTitle className="text-4xl font-extrabold leading-tight text-foreground">{data.title}</CardTitle>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="leading-relaxed text-lg">{data.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 pb-6">
                    <Separator className="my-6" />
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/blog')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ← Все посты
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostClient;