'use client'

import React, { useState, useEffect } from 'react';
import {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
} from '@/actions/posts';
import {CreatePostData, Post, UpdatePostData} from "@/lib/types";
import {AxiosError} from "axios";

const AdminBlogClient: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null as File | null
    });

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchPosts();
            setPosts(data);
        } catch (err) {
            let errorMessage = 'Ошибка при загрузке постов';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.error || errorMessage;
            }
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPosts();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: null
        });
        setEditingPost(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            description: post.description,
            image: null
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleCreatePost = async () => {
        try {
            if (!formData.image) return;

            const postData: CreatePostData = {
                title: formData.title,
                description: formData.description,
                image: formData.image
            };

            await createPost(postData);
            await loadPosts();
            closeModal();
            alert('Пост создан успешно!');
        } catch (err) {
            let errorMessage = 'Ошибка при создании поста';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.error || errorMessage;
            }
            alert(errorMessage);
        }
    };

    const handleUpdatePost = async () => {
        if (!editingPost) return;

        try {
            const postData: UpdatePostData = {};

            if (formData.title !== editingPost.title) {
                postData.title = formData.title;
            }
            if (formData.description !== editingPost.description) {
                postData.description = formData.description;
            }
            if (formData.image) {
                postData.image = formData.image;
            }

            await updatePost(editingPost._id, postData);
            await loadPosts();
            closeModal();
            alert('Пост обновлен успешно!');
        } catch (err) {
            let errorMessage = 'Ошибка при обновлении поста';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.error || errorMessage;
            }
            alert(errorMessage);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
            return;
        }

        try {
            await deletePost(postId);
            await loadPosts();
            alert('Пост удален успешно!');
        } catch (err) {
            let errorMessage = 'Ошибка при удалении поста';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.error || errorMessage;
            }
            alert(errorMessage);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            alert('Заполните все обязательные поля');
            return;
        }

        if (!editingPost && !formData.image) {
            alert('Выберите изображение для поста');
            return;
        }

        if (editingPost) {
            void handleUpdatePost();
        } else {
            void handleCreatePost();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center p-4">
                {error}
                <button
                    onClick={loadPosts}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление постами блога</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Создать пост
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Посты не найдены
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Изображение</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Заголовок</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Описание</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    {post.title}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <div className="max-w-xs truncate" title={post.description}>
                                        {post.description}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <div className="flex space-x-2 justify-center">
                                        <button
                                            onClick={() => openEditModal(post)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPost ? 'Редактировать пост' : 'Создать новый пост'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium mb-2">
                                    Заголовок *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium mb-2">
                                    Описание *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="image" className="block text-sm font-medium mb-2">
                                    Изображение {!editingPost && '*'}
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {editingPost && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Текущее изображение:
                                        <img
                                            src={editingPost.image}
                                            alt="Текущее"
                                            className="w-16 h-16 object-cover rounded mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    {editingPost ? 'Обновить' : 'Создать'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogClient;