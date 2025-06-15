'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePostsStore } from "@/store/postsStore";
import { Post } from "@/lib/types";
import Loading from "@/components/shared/Loading";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";

interface Props {
    data: Post | null;
    error: string | null;
}

const PostClient: React.FC<Props> = ({ data, error }) => {
    const router = useRouter();

    const {
        upsertPost,
        setError,
        loading,
        setLoading,
        error: storeError
    } = usePostsStore();

    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        if (data) {
            upsertPost(data);
        }
        setError(error);
        setLoading(false);
        setIsHydrating(false);
    }, [data, error, upsertPost, setError, setLoading]);

    if (isHydrating || loading) return <Loading />;
    if (storeError) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500 text-xl">
                Ошибка при загрузке поста: {storeError}
            </div>
        </div>
    );

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500 text-xl">Пост не найден</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Вернуться к блогу
            </button>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-w-16 aspect-h-9 h-64 md:h-96">
                    <Image
                        src={`${API_BASE_URL}/${data.image}`}
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

                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{data.title}</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">{data.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => router.push('/blog')}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Все посты
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default PostClient;