'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import {fetchPostById} from "@/actions/posts";

type Props = {
    postId: string;
};

const PostClient: React.FC<Props> = ({ postId }) => {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        return imagePath.startsWith('http') ? imagePath : `/${imagePath}`;
    };

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const fetchedPost = await fetchPostById(postId);
                setPost(fetchedPost);
            } catch (err) {
                setError('Ошибка при загрузке поста');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            void loadPost();
        }
    }, [postId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    if (!post) {
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
                <div className="aspect-w-16 aspect-h-9">
                    <img
                        src={getImageUrl(post.image) || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
                        }}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover"
                    />
                </div>

                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {post.description}
                        </p>
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