'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {useForm, UseFormReturn} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostsStore } from '@/store/postsStore';
import { Post, CreatePostData, UpdatePostData } from "@/lib/types";
import { API_BASE_URL } from "@/lib/globalConstants";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {CreatePostFormData, createPostSchema, UpdatePostFormData, updatePostSchema } from '@/lib/zodSchemas/postSchema';
import {createPost, deletePost, updatePost} from "@/actions/posts";

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const createForm = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: '',
            description: '',
        }
    });

    const updateForm = useForm<UpdatePostFormData>({
        resolver: zodResolver(updatePostSchema),
        defaultValues: {
            title: '',
            description: '',
        }
    });

    const currentForm = (editingPost ? updateForm : createForm) as UseFormReturn<CreatePostFormData | UpdatePostFormData>;


    useEffect(() => {
        if (data) {
            setPosts(data);
        }
        setError(error);
        setLoading(false);
    }, [data, error, setPosts, setError, setLoading]);

    const openCreateModal = () => {
        setEditingPost(null);
        createForm.reset();
        setImagePreviewUrl(null);
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        updateForm.reset({
            title: post.title,
            description: post.description,
        });

        if (post.image) {
            setImagePreviewUrl(`${API_BASE_URL}/${post.image}`);
        } else {
            setImagePreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        createForm.reset();
        updateForm.reset();
        setImagePreviewUrl(null);
    };

    const onCreateSubmit = async (data: CreatePostFormData) => {
        setSubmitting(true);
        try {
            const createData: CreatePostData = {
                title: data.title,
                description: data.description,
                image: data.image
            };

            const result = await createPost(createData);
            setPosts([result.post, ...posts]);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setSubmitting(false);
        }
    };

    const onUpdateSubmit = async (data: UpdatePostFormData) => {
        if (!editingPost) return;

        setSubmitting(true);
        try {
            const updateData: UpdatePostData = {};
            if (data.title !== editingPost.title) updateData.title = data.title;
            if (data.description !== editingPost.description) updateData.description = data.description;
            if (data.image) updateData.image = data.image;

            const result = await updatePost(editingPost._id, updateData);
            setPosts(posts.map(p => p._id === editingPost._id ? result.post : p));
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
            return;
        }

        try {
            await deletePost(postId);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при удалении');
        }
    };

    if (fetchPostsLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-48 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
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
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertDescription>
                        {fetchPostsError}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative aspect-video">
                                <Image
                                    src={`${API_BASE_URL}/${post.image}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
                                    }}
                                    alt={post.title}
                                    className="object-cover"
                                />
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => openEditModal(post)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(post._id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <CardHeader>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                            </CardHeader>

                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPost ? 'Редактировать пост' : 'Создать новый пост'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPost
                                ? 'Внесите изменения в пост и нажмите сохранить'
                                : 'Заполните форму для создания нового поста'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...currentForm}>
                        <form
                            onSubmit={
                                editingPost
                                    ? updateForm.handleSubmit(onUpdateSubmit)
                                    : createForm.handleSubmit(onCreateSubmit)
                            }
                            className="space-y-6"
                        >

                            <FormField
                                control={currentForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Заголовок</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Введите заголовок поста"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={currentForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Описание</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Краткое описание поста"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={currentForm.control}
                                name="image"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Изображение</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImagePreviewUrl(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setImagePreviewUrl(null);
                                                    }
                                                    onChange(file);
                                                }}
                                                name={field.name}
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        {imagePreviewUrl && (
                                            <div className="mt-2 relative w-32 h-32 overflow-hidden rounded-md">
                                                <Image
                                                    src={imagePreviewUrl}
                                                    alt="Image Preview"
                                                    fill
                                                    sizes="100px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        {!editingPost && (
                                            <p className="text-sm text-muted-foreground">
                                                Выберите изображение для поста
                                            </p>
                                        )}
                                        {editingPost && !imagePreviewUrl && (
                                            <p className="text-sm text-muted-foreground">
                                                Оставьте пустым, чтобы сохранить текущее изображение
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                    disabled={submitting}
                                >
                                    Отмена
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting
                                        ? 'Сохранение...'
                                        : editingPost
                                            ? 'Сохранить изменения'
                                            : 'Создать пост'
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBlogClient;