'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Post, CreatePostData, UpdatePostData } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {createPost, deletePost, updatePost} from "@/actions/posts";
import PostsTable from "@/app/admin/blog/components/PostsTable";
import PostModal from "@/app/admin/blog/components/PostModal";
import Loading from "@/components/shared/Loading";
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import {useAdminPostStore} from "@/store/superadmin/superadminPostsStore";

interface Props {
    data: Post[];
    error: string | null;
    isAdmin?: boolean;
}

const AdminBlogClient: React.FC<Props> = ({ data, error, isAdmin = true }) => {
    const {
        posts,
        fetchLoading,
        createLoading,
        updateLoading,
        deleteLoading,
        fetchError,
        createError,
        updateError,
        setPosts,
        setFetchLoading,
        setCreateLoading,
        setUpdateLoading,
        setDeleteLoading,
        setFetchError,
        setCreateError,
        setUpdateError,
        setDeleteError,
    } = useAdminPostStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const anyLoading = createLoading || updateLoading || deleteLoading;

    useEffect(() => {
        if (data) {
            setPosts(data);
        }
        setFetchError(error);
        setFetchLoading(false);
        setIsHydrating(false);
    }, [data, error, setPosts, setFetchError, setFetchLoading]);

    const resetErrors = () => {
        setFetchError(null);
        setCreateError(null);
        setUpdateError(null);
        setDeleteError(null);
    };

    const openCreateModal = () => {
        setEditingPost(null);
        setIsModalOpen(true);
        resetErrors();
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setIsModalOpen(true);
        resetErrors();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        resetErrors();
    };

    const onSubmit = async (formData: CreatePostData | UpdatePostData, isEditingMode: boolean) => {
        resetErrors();
        try {
            let result: { message: string; post: Post; };

            if (isEditingMode) {
                setUpdateLoading(true);
                if (!editingPost) throw new Error('Editing post is null');

                const updateData: UpdatePostData = {
                    title: formData.title,
                    description: formData.description,
                    image: (formData as UpdatePostData).image,
                };

                result = await updatePost(editingPost._id, updateData);
                setPosts(posts.map(p => p._id === editingPost._id ? result.post : p));
                toast.success('Пост успешно обновлен!');
            } else {
                setCreateLoading(true);
                const createData = formData as CreatePostData;

                result = await createPost(createData);
                setPosts([result.post, ...posts]);
                toast.success('Пост успешно создан!');
            }
            closeModal();
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : err instanceof Error
                    ? err.message
                    : 'Произошла ошибка при сохранении поста';
            if (isEditingMode) {
                setUpdateError(errorMessage);
            } else {
                setCreateError(errorMessage);
            }
            toast.error(errorMessage);
        } finally {
            setCreateLoading(false);
            setUpdateLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
            return;
        }
        resetErrors();
        setDeleteLoading(true);
        try {
            await deletePost(postId);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Пост успешно удален!');
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : err instanceof Error
                    ? err.message
                    : 'Произошла ошибка при удалении';
            setDeleteError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (isHydrating || fetchLoading) {
        return <Loading />;
    }

    if (fetchError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertDescription>
                        Ошибка при загрузке постов: {fetchError}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Управление постами</h1>
                    <p className="text-muted-foreground mt-1">Создавайте и редактируйте посты</p>
                </div>
                {isAdmin && (
                    <Button onClick={openCreateModal} size="lg" className="flex items-center gap-2 w-full sm:w-auto" disabled={anyLoading}>
                        <Plus className="mr-2 h-5 w-5" />
                        Создать пост
                    </Button>
                )}
            </div>

            {posts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Посты не найдены</p>
                        <p className="text-sm mt-2">
                            Нажмите &#34;Создать пост&#34; для создания первого поста
                        </p>
                    </div>
                ) : (
                <PostsTable
                    posts={posts}
                    onEditPost={openEditModal}
                    onDeletePost={handleDelete}
                    actionLoading={anyLoading}
                />
            )}

            <PostModal
                isOpen={isModalOpen}
                onClose={closeModal}
                isEditing={!!editingPost}
                editingPost={editingPost}
                actionLoading={createLoading || updateLoading}
                createError={createError}
                updateError={updateError}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default AdminBlogClient;