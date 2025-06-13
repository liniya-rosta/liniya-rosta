'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import {fetchPosts} from "@/actions/posts";
import {ArrowRight} from "lucide-react";

const BlogClient = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        return imagePath.startsWith('http') ? imagePath : `/${imagePath}`;
    };

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await fetchPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Ошибка при загрузке постов');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        void loadPosts();
    }, []);

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

    if (posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8">Блог</h1>
                <div className="text-center text-gray-500 text-xl">
                    Пока нет опубликованных постов
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Блог</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <article
                        key={post._id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="aspect-w-16 aspect-h-9">
                            <img
                                src={getImageUrl(post.image) || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
                                }}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                                {post.title}
                            </h2>

                            <p className="text-gray-600 mb-6 line-clamp-3">
                                {post.description}
                            </p>

                            <div className="flex justify-end">
                                <Link
                                    href={`/blog/${post._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 inline-flex items-center gap-2"
                                >
                                    <span>Подробнее</span>
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogClient;