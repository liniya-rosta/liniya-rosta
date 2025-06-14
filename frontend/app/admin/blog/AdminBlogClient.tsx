'use client';

import React, { useEffect, useState } from 'react';
import { usePostsStore } from '@/store/postsStore';
import { CreatePostData, UpdatePostData, Post } from '@/lib/types';
import { AxiosError } from 'axios';
import { ModalWindow } from "@/components/ui/modal-window";
import Loading from "@/components/shared/Loading";
import { createPost, updatePost, deletePost } from "@/actions/posts";

interface Props {
    data: Post[];
    error: string | null;
}

const AdminBlogClient: React.FC<Props> = ({ data, error }) => {
    const {
        posts,
        setPosts,
        setError: setStoreError,
        setLoading,
        loading,
        error: storeError,
        addPost,
        updatePost: updatePostInStore,
        removePost,
        clearError,
    } = usePostsStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null as File | null
    });

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        return imagePath.startsWith('http') ? imagePath : `/${imagePath}`;
    };

    useEffect(() => {
        if (data) setPosts(data);
        setStoreError(error);
        setLoading(false);
        setIsHydrating(false);
    }, [data, error, setPosts, setStoreError, setLoading]);

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
        clearError();
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            description: post.description,
            image: null
        });
        clearError();
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

            const result = await createPost(postData);
            addPost(result.post);

            closeModal();
            alert('Пост создан успешно!');
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.error : 'Ошибка при создании поста';
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

            const result = await updatePost(editingPost._id, postData);
            updatePostInStore(editingPost._id, result.post);

            closeModal();
            alert('Пост обновлен успешно!');
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.error : 'Ошибка при обновлении поста';
            alert(errorMessage);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

        try {
            await deletePost(postId);
            removePost(postId);

            alert('Пост удален успешно!');
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.error : 'Ошибка при удалении поста';
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

    if (isHydrating || loading) {
        return <Loading />;
    }

    if (storeError) {
        return (
            <div className="text-red-600 text-center p-4">
                Ошибка при загрузке постов: {storeError}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Управление блогом</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Создать пост
                </button>
            </div>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <div key={post._id} className="border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                <p className="text-gray-600 line-clamp-3">{post.description}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => openEditModal(post)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                        {post.image && (
                            <img
                                src={getImageUrl(post.image) || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
                                }}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded"
                            />
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <ModalWindow isOpen={isModalOpen} onClose={closeModal}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingPost ? 'Редактировать пост' : 'Создать пост'}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Заголовок *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Описание *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Изображение {!editingPost && '*'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {editingPost ? 'Обновить' : 'Создать'}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </ModalWindow>
            )}
        </div>
    );
};

export default AdminBlogClient;