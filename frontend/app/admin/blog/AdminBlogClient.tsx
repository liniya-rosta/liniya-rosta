'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePostsStore } from '@/store/postsStore';
import { Post, CreatePostData, UpdatePostData } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {createPost, deletePost, updatePost} from "@/actions/posts";
import PostsTable from "@/app/admin/blog/components/PostsTable";
import PostFormModal from "@/app/admin/blog/components/PostFormModal";
import Loading from "@/components/shared/Loading";

interface Props {
    data: Post[];
    error: string | null;
    isAdmin?: boolean;
}

const AdminBlogClient: React.FC<Props> = ({ data, error, isAdmin = true }) => {
    const {
        posts,
        fetchPostsLoading,
        fetchPostsError,
        setPosts,
        setfetchPostsLoading: setLoading,
        setFetchPostsError: setError
    } = usePostsStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setPosts(data);
        }
        setError(error);
        setLoading(false);
        setIsHydrating(false);
    }, [data, error, setPosts, setError, setLoading]);

    const openCreateModal = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setError(null);
    };

    const onSubmit = async (formData: CreatePostData | UpdatePostData, isEditingMode: boolean) => {
        setActionLoading(true);
        try {
            let result: { message: string; post: Post; };

            if (isEditingMode) {
                if (!editingPost) throw new Error('Editing post is null');

                const updateData: UpdatePostData = {
                    title: formData.title,
                    description: formData.description,
                    image: (formData as UpdatePostData).image,
                };

                result = await updatePost(editingPost._id, updateData);
                setPosts(posts.map(p => p._id === editingPost._id ? result.post : p));
                alert('Пост успешно обновлен!');
            } else {
                const createData = formData as CreatePostData;

                result = await createPost(createData);
                setPosts([result.post, ...posts]);
                alert('Пост успешно создан!');
            }
            closeModal();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при сохранении поста';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
            return;
        }
        setActionLoading(true);
        try {
            await deletePost(postId);
            setPosts(posts.filter(p => p._id !== postId));
            alert('Пост успешно удален!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    if (isHydrating || fetchPostsLoading) {
        return <Loading />;
    }

    if (fetchPostsError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertDescription>
                        Ошибка при загрузке постов: {fetchPostsError}
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
                    <Button onClick={openCreateModal} size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="mr-2 h-5 w-5" />
                        Создать пост
                    </Button>
                )}
            </div>

            {posts.length === 0 ? (
                <div className="text-center">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">Пока нет опубликованных постов</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <PostsTable
                    posts={posts}
                    onEditPost={openEditModal}
                    onDeletePost={handleDelete}
                    actionLoading={actionLoading}
                />
            )}

            <PostFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                isEditing={!!editingPost}
                editingPost={editingPost}
                actionLoading={actionLoading}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default AdminBlogClient;